"""Interrupted Time Series core — segmented regression with Newey–West (HAC)
standard errors, in pure numpy/scipy so it runs in Pyodide.

白話：在已知的介入時點前後，配一條「介入前趨勢」當反事實（沒介入會怎樣），
效果＝介入當下的『水準跳變』（β2）＋介入後的『斜率改變』（β3）。時間序列的殘差
通常自相關，會讓天真 OLS 的標準誤過窄，所以用 Newey–West（HAC）穩健標準誤校正。

Model:  Y_t = β0 + β1·t + β2·post_t + β3·t_since_t + e_t
  β0 baseline level, β1 pre-trend slope, β2 immediate LEVEL change,
  β3 SLOPE change after the interruption. Counterfactual = β0 + β1·t.
"""
from __future__ import annotations

import numpy as np
from scipy import stats

from i18n import t


# ---------------------------------------------------------------------------
# OLS + Newey–West (HAC) covariance
# ---------------------------------------------------------------------------
def _ols(X, y):
    XtX_inv = np.linalg.pinv(X.T @ X)
    beta = XtX_inv @ (X.T @ y)
    resid = y - X @ beta
    return beta, resid, XtX_inv


def _ols_se(X, resid, XtX_inv):
    n, k = X.shape
    sigma2 = (resid @ resid) / max(n - k, 1)
    cov = sigma2 * XtX_inv
    return cov


def newey_west(X, resid, XtX_inv, L=None):
    """HAC (Newey–West) covariance with Bartlett weights up to lag L."""
    n, k = X.shape
    if L is None:
        L = int(np.floor(4 * (n / 100.0) ** (2.0 / 9.0)))   # rule of thumb
        L = max(1, L)
    u = X * resid[:, None]                      # n×k score
    S = (u.T @ u)                               # lag 0
    for l in range(1, L + 1):
        w = 1.0 - l / (L + 1.0)                  # Bartlett kernel
        G = u[l:].T @ u[:-l]
        S += w * (G + G.T)
    cov = XtX_inv @ S @ XtX_inv
    return cov, L


def _durbin_watson(resid):
    d = np.sum(np.diff(resid) ** 2) / np.sum(resid ** 2)
    return float(d)


def _lag1_acf(resid):
    r = resid - resid.mean()
    return float(np.sum(r[1:] * r[:-1]) / np.sum(r ** 2))


# ---------------------------------------------------------------------------
# Segmented regression
# ---------------------------------------------------------------------------
def segmented(df, outcome="outcome", time="time", post="post", t_since="t_since", L=None):
    y = np.asarray(df[outcome], dtype=float)
    tt = np.asarray(df[time], dtype=float)
    pp = np.asarray(df[post], dtype=float)
    ts = np.asarray(df[t_since], dtype=float)
    X = np.column_stack([np.ones_like(y), tt, pp, ts])
    beta, resid, XtX_inv = _ols(X, y)
    cov_ols = _ols_se(X, resid, XtX_inv)
    cov_hac, Lused = newey_west(X, resid, XtX_inv, L=L)
    se_ols = np.sqrt(np.diag(cov_ols))
    se_hac = np.sqrt(np.diag(cov_hac))
    names = ["intercept", "pretrend", "level", "slope"]
    out = {"beta": {}, "se_ols": {}, "se_hac": {}, "ci_hac": {}, "p_hac": {}}
    for i, nm in enumerate(names):
        b = float(beta[i]); s = float(se_hac[i])
        out["beta"][nm] = b
        out["se_ols"][nm] = float(se_ols[i])
        out["se_hac"][nm] = s
        out["ci_hac"][nm] = [b - 1.96 * s, b + 1.96 * s]
        out["p_hac"][nm] = float(2 * stats.norm.sf(abs(b / s))) if s > 0 else None
    out["dw"] = _durbin_watson(resid)
    out["acf1"] = _lag1_acf(resid)
    out["hac_lag"] = int(Lused)
    out["_beta_vec"] = beta
    return out


# ---------------------------------------------------------------------------
# Plot data: observed points, fitted pre/post segments, counterfactual
# ---------------------------------------------------------------------------
def plot_data(df, fit, time="time", outcome="outcome", post="post"):
    tt = np.asarray(df[time], dtype=float)
    y = np.asarray(df[outcome], dtype=float)
    b = fit["_beta_vec"]
    t0 = float(tt[np.asarray(df[post]) == 1].min()) if (np.asarray(df[post]) == 1).any() else tt.max()
    # fitted pre line over the pre region
    pre_x = [float(tt.min()), float(t0 - 1)]
    pre_y = [b[0] + b[1] * x for x in pre_x]
    # fitted post line over the post region (includes level + slope change)
    post_x = [float(t0), float(tt.max())]
    post_y = [b[0] + b[1] * x + b[2] + b[3] * (x - t0) for x in post_x]
    # counterfactual = extrapolated pre-trend across the post region
    cf_x = [float(t0 - 1), float(tt.max())]
    cf_y = [b[0] + b[1] * x for x in cf_x]
    return {
        "points": {"x": tt.tolist(), "y": y.tolist()},
        "pre": {"x": pre_x, "y": pre_y},
        "post": {"x": post_x, "y": post_y},
        "counterfactual": {"x": cf_x, "y": cf_y},
        "t0": t0,
    }


# ---------------------------------------------------------------------------
# High-level ITS analysis used by the API
# ---------------------------------------------------------------------------
def full_its(df, outcome="outcome", time="time", post="post", t_since="t_since",
             lang="zh"):
    fit = segmented(df, outcome, time, post, t_since)
    tt = np.asarray(df[time], dtype=float)
    b = fit["_beta_vec"]
    t0 = float(tt[np.asarray(df[post]) == 1].min())
    tend = float(tt.max())
    # absolute effect at the end of follow-up = observed-model minus counterfactual
    eff_end = float(b[2] + b[3] * (tend - t0))
    cf_end = float(b[0] + b[1] * tend)
    rel_end = float(100.0 * eff_end / cf_end) if cf_end else None
    n_pre = int((np.asarray(df[post]) == 0).sum())
    n_post = int((np.asarray(df[post]) == 1).sum())

    level = fit["beta"]["level"]; slope = fit["beta"]["slope"]
    interp = t(
        lang,
        f"介入當下，結果立即{('下降' if level < 0 else '上升')}約 {abs(level):.1f}"
        f"（水準變化 β₂={level:+.2f}），且介入後每期趨勢再{('往下' if slope < 0 else '往上')} "
        f"{abs(slope):.2f}（斜率變化 β₃={slope:+.2f}）。到追蹤結束時，"
        f"與「沒介入會怎樣」的反事實相比，結果相差約 {eff_end:+.1f}"
        + (f"（約 {rel_end:+.0f}%）" if rel_end is not None else "") + "。"
        f" 殘差自相關 lag-1≈{fit['acf1']:.2f}（Durbin–Watson={fit['dw']:.2f}）；"
        f"已用 Newey–West HAC 標準誤校正。",
        f"At the intervention the outcome immediately "
        f"{('drops' if level < 0 else 'rises')} by about {abs(level):.1f} "
        f"(level change β₂={level:+.2f}), and afterwards the per-period trend additionally "
        f"{('falls' if slope < 0 else 'climbs')} by {abs(slope):.2f} (slope change β₃={slope:+.2f}). "
        f"By the end of follow-up the outcome differs from the no-intervention counterfactual by "
        f"about {eff_end:+.1f}" + (f" (~{rel_end:+.0f}%)" if rel_end is not None else "") + ". "
        f"Residual autocorrelation lag-1≈{fit['acf1']:.2f} (Durbin–Watson={fit['dw']:.2f}); "
        f"corrected with Newey–West HAC standard errors.",
    )
    return {
        "level": {"estimate": level, "se": fit["se_hac"]["level"],
                  "ci": fit["ci_hac"]["level"], "p": fit["p_hac"]["level"],
                  "se_ols": fit["se_ols"]["level"]},
        "slope": {"estimate": slope, "se": fit["se_hac"]["slope"],
                  "ci": fit["ci_hac"]["slope"], "p": fit["p_hac"]["slope"],
                  "se_ols": fit["se_ols"]["slope"]},
        "pretrend": fit["beta"]["pretrend"], "baseline": fit["beta"]["intercept"],
        "effect_end": eff_end, "rel_end": rel_end,
        "dw": fit["dw"], "acf1": fit["acf1"], "hac_lag": fit["hac_lag"],
        "n_pre": n_pre, "n_post": n_post, "t0": t0,
        "plot": plot_data(df, fit, time, outcome, post),
        "interpretation": interp,
    }
