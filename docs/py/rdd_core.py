"""Regression-Discontinuity core — local-linear Sharp & Fuzzy RD in pure numpy/scipy.

Mirrors the teaching core of the BMJ guide (Calonico, Jawadekar, Kezios,
Zeki Al Hazzouri 2023) and `rdrobust`, but implemented from scratch so it runs
in Pyodide with no external estimation packages:

  * local-LINEAR fit on each side of the cutoff with a triangular kernel,
  * the Sharp RD effect = jump in the outcome's regression line at the cutoff,
  * the Fuzzy RD effect = (jump in outcome) / (jump in treatment take-up),
  * a simplified McCrary-style density (manipulation) test,
  * a covariate-continuity (balance) check.

This is local-linear with heteroskedasticity-robust variance; it is NOT the full
Calonico–Cattaneo–Titiunik robust bias-correction. For teaching on synthetic data
the point estimates match the standard estimator closely.
"""
from __future__ import annotations

import numpy as np
from scipy import stats

from i18n import t


# ---------------------------------------------------------------------------
# Weighted local-linear fit on ONE side of the cutoff
# ---------------------------------------------------------------------------
def _tri_weights(xc, h):
    """Triangular kernel weights for centred running variable xc within |xc|<=h."""
    return np.clip(1.0 - np.abs(xc) / h, 0.0, None)


def _local_linear(xc, y, h):
    """Weighted least squares of y on [1, xc] with triangular weights.

    Returns (intercept at cutoff, var(intercept), effective n).
    Variance uses an HC0-style robust sandwich with the kernel weights.
    """
    w = _tri_weights(xc, h)
    keep = w > 0
    xc, y, w = xc[keep], y[keep], w[keep]
    n_eff = int(keep.sum())
    if n_eff < 5:
        return np.nan, np.nan, n_eff

    X = np.column_stack([np.ones_like(xc), xc])
    W = w
    XtWX = (X * W[:, None]).T @ X
    XtWX_inv = np.linalg.pinv(XtWX)
    beta = XtWX_inv @ ((X * W[:, None]).T @ y)
    resid = y - X @ beta

    # robust meat: X' W diag(e^2) W X
    meat = (X * (W * resid) [:, None]).T @ (X * (W * resid)[:, None])
    cov = XtWX_inv @ meat @ XtWX_inv
    return float(beta[0]), float(cov[0, 0]), n_eff


def default_bandwidth(x, c):
    """A simple, transparent default bandwidth (years).

    Rule-of-thumb plug-in: 4.5 * sd(x near cutoff) * n^(-1/5), floored/capped to a
    teaching-friendly 4–10 range. Users can override with the slider to SEE how the
    estimate and its uncertainty trade off (the core RD lesson).
    """
    x = np.asarray(x, dtype=float)
    near = x[np.abs(x - c) <= 15]
    s = np.std(near) if near.size > 30 else np.std(x)
    h = 4.5 * s * x.size ** (-1 / 5)
    return float(np.clip(h, 4.0, 10.0))


# ---------------------------------------------------------------------------
# Sharp RD
# ---------------------------------------------------------------------------
def sharp_rd(x, y, c, h):
    """Sharp RD: difference in local-linear intercepts at the cutoff."""
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)
    xc = x - c
    left = xc < 0
    right = ~left
    m_l, v_l, n_l = _local_linear(xc[left], y[left], h)
    m_r, v_r, n_r = _local_linear(xc[right], y[right], h)
    tau = m_r - m_l
    se = float(np.sqrt(v_l + v_r))
    z = tau / se if se > 0 else np.nan
    p = float(2 * stats.norm.sf(abs(z))) if se > 0 else np.nan
    return {
        "estimate": float(tau), "se": se,
        "ci": [float(tau - 1.96 * se), float(tau + 1.96 * se)],
        "z": float(z), "p": p,
        "mean_left": m_l, "mean_right": m_r,
        "n_left": n_l, "n_right": n_r, "h": float(h),
    }


# ---------------------------------------------------------------------------
# Fuzzy RD = (jump in outcome) / (jump in treatment take-up)
# ---------------------------------------------------------------------------
def fuzzy_rd(x, y, d, c, h):
    """Fuzzy RD: ratio of the outcome jump to the treatment-take-up jump."""
    num = sharp_rd(x, y, c, h)   # jump in Y
    den = sharp_rd(x, d, c, h)   # jump in treatment probability (first stage at cutoff)
    a, Va = num["estimate"], num["se"] ** 2
    b, Vb = den["estimate"], den["se"] ** 2
    est = a / b if b != 0 else np.nan
    # delta-method SE (treats numerator/denominator jumps as approx. independent)
    var = Va / b ** 2 + (a ** 2) * Vb / b ** 4 if b != 0 else np.nan
    se = float(np.sqrt(var))
    return {
        "estimate": float(est), "se": se,
        "ci": [float(est - 1.96 * se), float(est + 1.96 * se)],
        "outcome_jump": a, "takeup_jump": b,
        "takeup_left": den["mean_left"], "takeup_right": den["mean_right"],
        "h": float(h),
    }


# ---------------------------------------------------------------------------
# RD plot: binned scatter + the two fitted lines (for the front-end chart)
# ---------------------------------------------------------------------------
def rd_plot_bins(x, y, c, h, nbins=20):
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)
    out = {"left": {"bx": [], "by": []}, "right": {"bx": [], "by": []}, "fit": {}}
    for side, mask in (("left", x < c), ("right", x >= c)):
        xs, ys = x[mask], y[mask]
        win = np.abs(xs - c) <= h
        xs, ys = xs[win], ys[win]
        if xs.size == 0:
            continue
        edges = np.linspace(xs.min(), xs.max(), nbins + 1)
        idx = np.clip(np.digitize(xs, edges) - 1, 0, nbins - 1)
        for b in range(nbins):
            sel = idx == b
            if sel.sum() >= 3:
                out[side]["bx"].append(float(xs[sel].mean()))
                out[side]["by"].append(float(ys[sel].mean()))
    # fitted line endpoints from the local-linear slopes
    xc = x - c
    for side, mask in (("left", xc < 0), ("right", xc >= 0)):
        w = _tri_weights(xc[mask], h)
        keep = w > 0
        xk, yk, wk = xc[mask][keep], y[mask][keep], w[keep]
        if xk.size < 5:
            continue
        X = np.column_stack([np.ones_like(xk), xk])
        beta = np.linalg.pinv((X * wk[:, None]).T @ X) @ ((X * wk[:, None]).T @ yk)
        x0, x1 = (c - h, c) if side == "left" else (c, c + h)
        out["fit"][side] = {
            "x": [float(x0), float(x1)],
            "y": [float(beta[0] + beta[1] * (x0 - c)), float(beta[0] + beta[1] * (x1 - c))],
        }
    out["cutoff"] = float(c)
    return out


# ---------------------------------------------------------------------------
# Simplified McCrary density (manipulation) test
# ---------------------------------------------------------------------------
def density_test(x, c, h=None, nbins=24):
    """Is the density of the running variable continuous at the cutoff?

    Build a fine histogram around the cutoff, fit a local line to the bin densities
    on each side, and test whether the predicted densities at the cutoff differ.
    A big jump would suggest people sorting / manipulating which side they land on.
    """
    x = np.asarray(x, dtype=float)
    if h is None:
        h = default_bandwidth(x, c) * 1.5
    win = (x >= c - h) & (x <= c + h)
    xs = x[win]
    n = xs.size
    edges = np.linspace(c - h, c + h, nbins + 1)
    width = edges[1] - edges[0]
    counts, _ = np.histogram(xs, bins=edges)
    mid = 0.5 * (edges[:-1] + edges[1:])
    dens = counts / (n * width)

    def side_density(mask):
        mx, md = mid[mask], dens[mask]
        if mx.size < 3:
            return np.nan, np.nan
        X = np.column_stack([np.ones_like(mx), mx - c])
        beta = np.linalg.pinv(X.T @ X) @ (X.T @ md)
        resid = md - X @ beta
        s2 = (resid @ resid) / max(len(md) - 2, 1)
        v0 = s2 * np.linalg.pinv(X.T @ X)[0, 0]
        return float(beta[0]), float(v0)

    f_l, v_l = side_density(mid < c)
    f_r, v_r = side_density(mid >= c)
    diff = f_r - f_l
    se = float(np.sqrt(np.nan_to_num(v_l) + np.nan_to_num(v_r)))
    z = diff / se if se > 0 else np.nan
    p = float(2 * stats.norm.sf(abs(z))) if se > 0 else np.nan
    return {
        "f_left": f_l, "f_right": f_r, "diff": float(diff),
        "ratio": float(f_r / f_l) if f_l else np.nan,
        "z": float(z), "p": p, "h": float(h),
        "hist": {"mid": mid.tolist(), "dens": dens.tolist()},
    }


# ---------------------------------------------------------------------------
# Covariate continuity (balance) at the cutoff
# ---------------------------------------------------------------------------
def covariate_continuity(df, x_name, cov_names, c, h, lang="zh"):
    x = np.asarray(df[x_name], dtype=float)
    rows = []
    for name in cov_names:
        rd = sharp_rd(x, np.asarray(df[name], dtype=float), c, h)
        ok = rd["ci"][0] <= 0 <= rd["ci"][1]
        rows.append({
            "name": name, "jump": rd["estimate"], "se": rd["se"],
            "ci": rd["ci"], "balanced": bool(ok),
        })
    n_bad = sum(not r["balanced"] for r in rows)
    return {"covariates": rows, "n_imbalanced": n_bad}


# ---------------------------------------------------------------------------
# Bandwidth-sensitivity curve (estimate vs bandwidth)
# ---------------------------------------------------------------------------
def bandwidth_curve(x, y, c, d=None, hmin=3.0, hmax=12.0, steps=10):
    hs = np.linspace(hmin, hmax, steps)
    out = {"h": [], "estimate": [], "lo": [], "hi": []}
    for h in hs:
        rd = fuzzy_rd(x, y, d, c, h) if d is not None else sharp_rd(x, y, c, h)
        out["h"].append(float(h))
        out["estimate"].append(float(rd["estimate"]))
        out["lo"].append(float(rd["ci"][0]))
        out["hi"].append(float(rd["ci"][1]))
    return out


# ---------------------------------------------------------------------------
# High-level RDD analysis used by the API (sharp + fuzzy + plot + readings)
# ---------------------------------------------------------------------------
def full_rdd(df, x_name, y_name, d_name, c, h=None, lang="zh"):
    """One-shot sharp & fuzzy RD with plot bins, naive comparison and readings."""
    x = np.asarray(df[x_name], dtype=float)
    y = np.asarray(df[y_name], dtype=float)
    d = np.asarray(df[d_name], dtype=float) if d_name else None
    if h is None:
        h = default_bandwidth(x, c)

    sharp = sharp_rd(x, y, c, h)
    fuzzy = fuzzy_rd(x, y, d, c, h) if d is not None else None
    takeup = sharp_rd(x, d, c, h) if d is not None else None

    # naive: compare treated vs untreated ignoring the cutoff (confounded)
    if d is not None:
        m1, m0 = y[d == 1].mean(), y[d == 0].mean()
        naive = float(m1 - m0)
    else:
        naive = None

    sharp["interpretation"] = t(
        lang,
        f"跨過 65 歲資格門檻，健康分數變化在斷點「跳升」約 {sharp['estimate']:+.2f} 分"
        f"（這是『有沒有資格』的整體效果，類似 ITT）。",
        f"Crossing the age-65 eligibility threshold makes the health-score change "
        f"jump by about {sharp['estimate']:+.2f} at the cutoff "
        f"(the overall effect of eligibility, ITT-like).",
    )
    if fuzzy is not None:
        fuzzy["interpretation"] = t(
            lang,
            f"斷點附近真正因資格而去接種的人（complier），疫苗讓健康分數變化約 "
            f"{fuzzy['estimate']:+.2f} 分；接種率在斷點跳升約 {takeup['estimate']*100:.0f} 個百分點。"
            f"（對照：直接比較有無接種的天真差異約 {naive:+.2f} 分，被健康意識等干擾因子放大。）",
            f"For compliers near the cutoff, vaccination changes the health score by about "
            f"{fuzzy['estimate']:+.2f}; uptake jumps ~{takeup['estimate']*100:.0f} percentage points at 65. "
            f"(Contrast: the naive treated-vs-untreated difference is about {naive:+.2f}, "
            f"inflated by confounders such as health consciousness.)",
        )

    return {
        "cutoff": float(c), "h": float(h),
        "sharp": sharp, "fuzzy": fuzzy, "takeup": takeup,
        "naive_difference": naive,
        "plot": rd_plot_bins(x, y, c, h),
        "takeup_plot": rd_plot_bins(x, d, c, h) if d is not None else None,
        "bandwidth_curve": bandwidth_curve(x, y, c, d=d),
    }
