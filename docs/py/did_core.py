"""Difference-in-differences core — the 2×2 estimate, the interaction regression
with cluster-robust SE, and an event-study, all in pure numpy/scipy so it runs
in Pyodide with no external estimation packages.

白話：DiD 比較「處置組的前→後變化」與「對照組的前→後變化」，相減（差異的差異）
就把『各組固定差異』與『共同時代趨勢』都消掉，剩下政策本身的效果（ATT）。

  * two_by_two   —— 四格平均與 (後-前) - (後-前) 的點估計
  * did_regression —— Y = b0 + b1·post + b2·treated + b3·(post×treated)，b3 即 DiD/ATT，
                       標準誤用『以單位為群集』的三明治估計（cluster-robust）
  * event_study  —— 各期相對基期的處置×期別係數，用來檢查前期是否平行
  * group_means_by_period —— 兩條折線（介入/對照各期平均），畫趨勢圖用

實作為教學等級：以單位群集的 CRVE（HC0 風格），合成資料上點估計與標準誤都與標準
套件（如 R 的 fixest/sandwich）相符到可教學的程度。
"""
from __future__ import annotations

import numpy as np
from scipy import stats

from i18n import t


# ---------------------------------------------------------------------------
# OLS with cluster-robust (CR0) covariance
# ---------------------------------------------------------------------------
def _ols_cluster(X, y, groups):
    """OLS of y on X (already includes an intercept column) with cluster-robust
    covariance clustered on `groups`. Returns (beta, cov)."""
    X = np.asarray(X, dtype=float)
    y = np.asarray(y, dtype=float)
    groups = np.asarray(groups)
    XtX_inv = np.linalg.pinv(X.T @ X)
    beta = XtX_inv @ (X.T @ y)
    resid = y - X @ beta
    k = X.shape[1]
    # meat = sum_g (X_g' e_g)(X_g' e_g)'
    meat = np.zeros((k, k))
    uniq = np.unique(groups)
    for g in uniq:
        m = groups == g
        Xg = X[m]
        eg = resid[m]
        s = Xg.T @ eg
        meat += np.outer(s, s)
    G = uniq.size
    n = X.shape[0]
    # small-sample correction (à la Stata): G/(G-1) * (n-1)/(n-k)
    corr = (G / (G - 1.0)) * ((n - 1.0) / (n - k)) if G > 1 and n > k else 1.0
    cov = corr * (XtX_inv @ meat @ XtX_inv)
    return beta, cov


def _cell_means(df, group, post, outcome):
    g = np.asarray(df[group], dtype=float)
    p = np.asarray(df[post], dtype=float)
    y = np.asarray(df[outcome], dtype=float)
    def mean(mask):
        return float(y[mask].mean()) if mask.any() else float("nan")
    return {
        "treated_pre": mean((g == 1) & (p == 0)),
        "treated_post": mean((g == 1) & (p == 1)),
        "control_pre": mean((g == 0) & (p == 0)),
        "control_post": mean((g == 0) & (p == 1)),
    }


# ---------------------------------------------------------------------------
# Canonical 2×2 DiD point estimate (means only)
# ---------------------------------------------------------------------------
def two_by_two(df, group, post, outcome):
    m = _cell_means(df, group, post, outcome)
    did = (m["treated_post"] - m["treated_pre"]) - (m["control_post"] - m["control_pre"])
    return {"means": m, "did": float(did)}


# ---------------------------------------------------------------------------
# Interaction regression with cluster-robust SE (b3 = DiD / ATT)
# ---------------------------------------------------------------------------
def did_regression(df, group, post, outcome, cluster):
    g = np.asarray(df[group], dtype=float)
    p = np.asarray(df[post], dtype=float)
    y = np.asarray(df[outcome], dtype=float)
    inter = g * p
    X = np.column_stack([np.ones_like(y), p, g, inter])
    beta, cov = _ols_cluster(X, y, df[cluster])
    est = float(beta[3])
    se = float(np.sqrt(cov[3, 3]))
    z = est / se if se > 0 else np.nan
    pval = float(2 * stats.norm.sf(abs(z))) if se > 0 else np.nan
    return {
        "estimate": est, "se": se,
        "ci": [est - 1.96 * se, est + 1.96 * se],
        "z": float(z) if se > 0 else None, "p": pval,
        "coef": {"intercept": float(beta[0]), "post": float(beta[1]),
                 "treated": float(beta[2]), "did": est},
    }


# ---------------------------------------------------------------------------
# Group means by period (the two trend lines)
# ---------------------------------------------------------------------------
def group_means_by_period(df, group, period, outcome):
    periods = sorted(int(v) for v in np.unique(df[period]))
    g = np.asarray(df[group], dtype=float)
    pr = np.asarray(df[period], dtype=float)
    y = np.asarray(df[outcome], dtype=float)
    treated, control = [], []
    for q in periods:
        tm = (g == 1) & (pr == q)
        cm = (g == 0) & (pr == q)
        treated.append(float(y[tm].mean()) if tm.any() else None)
        control.append(float(y[cm].mean()) if cm.any() else None)
    return {"periods": periods, "treated": treated, "control": control}


# ---------------------------------------------------------------------------
# Event study: treated×period coefficients relative to the last pre-period
# ---------------------------------------------------------------------------
def event_study(df, group, period, outcome, t0, cluster):
    """Estimate, for each period q (except the base = t0-1), the coefficient on
    treated×1[period=q]. Pre-period coefficients should be ~0 if parallel trends
    hold; post-period coefficients trace out the dynamic treatment effect."""
    periods = sorted(int(v) for v in np.unique(df[period]))
    base = t0 - 1 if (t0 - 1) in periods else periods[0]
    g = np.asarray(df[group], dtype=float)
    pr = np.asarray(df[period], dtype=float)
    y = np.asarray(df[outcome], dtype=float)
    n = y.size

    # Build design: intercept + treated + period dummies + treated×period dummies
    cols = [np.ones(n), g]
    labels = ["const", "treated"]
    for q in periods:
        if q == base:
            continue
        cols.append((pr == q).astype(float)); labels.append(f"per{q}")
    ev_index = {}
    for q in periods:
        if q == base:
            continue
        cols.append(((pr == q) * g).astype(float))
        ev_index[q] = len(labels); labels.append(f"ev{q}")
    X = np.column_stack(cols)
    beta, cov = _ols_cluster(X, y, df[cluster])

    out = {"periods": [], "coef": [], "lo": [], "hi": [], "se": [],
           "base": int(base), "t0": int(t0)}
    for q in periods:
        out["periods"].append(int(q))
        if q == base:
            out["coef"].append(0.0); out["lo"].append(0.0); out["hi"].append(0.0); out["se"].append(0.0)
            continue
        i = ev_index[q]
        b = float(beta[i]); se = float(np.sqrt(cov[i, i]))
        out["coef"].append(b); out["se"].append(se)
        out["lo"].append(b - 1.96 * se); out["hi"].append(b + 1.96 * se)
    # joint pre-trend: are all pre-period (q < t0, q != base) coefficients ~0?
    pre_q = [q for q in periods if q < t0 and q != base]
    pre_z = []
    for q in pre_q:
        i = ev_index[q]
        se = float(np.sqrt(cov[i, i]))
        if se > 0:
            pre_z.append(abs(float(beta[i]) / se))
    out["pre_periods"] = pre_q
    out["pre_max_abs_z"] = float(max(pre_z)) if pre_z else 0.0
    out["pre_max_p"] = float(2 * stats.norm.sf(max(pre_z))) if pre_z else 1.0
    return out


# ---------------------------------------------------------------------------
# High-level DiD analysis used by the API
# ---------------------------------------------------------------------------
def full_did(df, unit, period, group, outcome, t0, covariates=None, lang="zh"):
    # define post from period & cutoff
    df = df.copy()
    df["__post"] = (np.asarray(df[period], dtype=float) >= float(t0)).astype(int)

    tbt = two_by_two(df, group, "__post", outcome)
    reg = did_regression(df, group, "__post", outcome, cluster=unit)
    ev = event_study(df, group, period, outcome, int(t0), cluster=unit)
    trend = group_means_by_period(df, group, period, outcome)

    m = tbt["means"]
    # naive (biased): post-period treated-minus-control, ignoring the pre baseline
    naive = float(m["treated_post"] - m["control_post"])

    reg["interpretation"] = t(
        lang,
        f"差異中的差異（DiD）估計政策效果約 {reg['estimate']:+.2f} 分"
        f"（95% 信賴區間 {reg['ci'][0]:+.2f} ～ {reg['ci'][1]:+.2f}）。"
        f"也就是：介入組前→後變化 {m['treated_post']-m['treated_pre']:+.2f}，"
        f"減掉對照組前→後變化 {m['control_post']-m['control_pre']:+.2f}。"
        f"（對照：只看後期『介入減對照』的未校正差異約 {naive:+.2f} 分，被各組固定差異汙染。）",
        f"The difference-in-differences estimate of the policy effect is about "
        f"{reg['estimate']:+.2f} (95% CI {reg['ci'][0]:+.2f} to {reg['ci'][1]:+.2f}): "
        f"the treated before→after change ({m['treated_post']-m['treated_pre']:+.2f}) "
        f"minus the control before→after change ({m['control_post']-m['control_pre']:+.2f}). "
        f"(Contrast: the naive post-period treated-minus-control gap is about {naive:+.2f}, "
        f"contaminated by fixed group differences.)",
    )
    return {
        "t0": int(t0),
        "two_by_two": tbt,
        "did": reg,
        "naive_difference": naive,
        "event_study": ev,
        "trend": trend,
        "n_units": int(np.unique(df[unit]).size),
        "n_periods": int(np.unique(df[period]).size),
    }
