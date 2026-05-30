"""Survival-outcome Regression Discontinuity with censoring — IPCW + doubly-robust.

A faithful but *teaching-simplified* re-implementation of the idea behind the
JSR sharp/fuzzy survival-RD scripts (code_SRD_JSR.R / code_FRD_JSR.R): when the
outcome is a (right-censored) time-to-event, you cannot just run a local-linear
RD on the observed follow-up time, because censoring shortens it. Two fixes,
combined:

  1.  IPCW — inverse-probability-of-censoring weighting. Estimate the censoring
      survival curve G(t) = P(C > t) with a Kaplan–Meier fit, then build a
      "pseudo-outcome" for the restricted-mean-survival-time (RMST up to horizon
      tau). Subjects who are censored early get up-weighted so the complete-case
      bias is removed.

  2.  DR — doubly robust augmentation. Add a regression-based correction term so
      the estimator stays consistent if EITHER the censoring model OR the outcome
      model is right (here both are simple, transparent models).

The pseudo-outcomes are then fed through the SAME local-linear RD machinery in
`rdd_core` — sharp (jump at the cutoff) and fuzzy (scaled by the treatment jump).

This is NOT the full CCT robust bias-correction, nor the full semiparametric DR
estimator of the source scripts; it is an honest, self-contained numpy/scipy
version for teaching, and we say so.
"""
from __future__ import annotations

import numpy as np

from i18n import t
from rdd_core import sharp_rd, fuzzy_rd, default_bandwidth


# ---------------------------------------------------------------------------
# Kaplan–Meier estimate of the CENSORING survival curve  G(t) = P(C > t)
# ---------------------------------------------------------------------------
def _km_censoring(time, event):
    """Kaplan–Meier for the censoring distribution.

    Censoring is the 'event' here, so we flip the indicator: a censoring 'event'
    happens where event == 0. Returns a step function G(t) as sorted (t, G).
    """
    time = np.asarray(time, dtype=float)
    cens = (np.asarray(event) == 0).astype(int)  # 1 = censored = "event" for G

    order = np.argsort(time)
    t_sorted = time[order]
    c_sorted = cens[order]

    uniq = np.unique(t_sorted)
    G = 1.0
    ts, Gs = [], []
    n = len(t_sorted)
    for ut in uniq:
        at_risk = np.sum(t_sorted >= ut)
        d_c = np.sum(c_sorted[t_sorted == ut])  # censoring events at ut
        if at_risk > 0:
            G *= (1.0 - d_c / at_risk)
        ts.append(float(ut))
        Gs.append(float(G))
    return np.array(ts), np.array(Gs)


def _G_at(ts, Gs, query):
    """Left-continuous lookup of G at the given query times (floored at a small eps)."""
    query = np.asarray(query, dtype=float)
    idx = np.searchsorted(ts, query, side="right") - 1
    idx = np.clip(idx, 0, len(Gs) - 1)
    g = Gs[idx]
    # never divide by zero: floor the weight denominator
    return np.clip(g, 1e-3, 1.0)


# ---------------------------------------------------------------------------
# IPCW pseudo-outcome for the restricted mean survival time (RMST up to tau)
# ---------------------------------------------------------------------------
def rmst_pseudo(time, event, tau):
    """IPCW pseudo-outcome whose expectation is the RMST = E[min(T, tau)].

    For each subject, the observed restricted time is min(time, tau). A subject
    contributes only if they were either observed to fail before tau, or followed
    all the way to tau. The contribution is weighted by 1 / G(.) to undo the
    informative loss from censoring.
    """
    time = np.asarray(time, dtype=float)
    event = np.asarray(event, dtype=int)
    ts, Gs = _km_censoring(time, event)

    y = np.minimum(time, tau)
    # weight time = the time at which this subject's restricted contribution is
    # "complete": min(failure time, tau).
    w_time = np.where((event == 1) & (time <= tau), time, tau)
    G = _G_at(ts, Gs, np.minimum(w_time, time))  # G at the relevant follow-up

    # subjects censored strictly before tau and before failing contribute weight 0
    usable = ~((event == 0) & (time < tau))
    w = np.where(usable, 1.0 / G, 0.0)
    # IPCW pseudo-outcome (mean-zero adjusted later by re-normalising weights)
    return y, w


# ---------------------------------------------------------------------------
# Doubly-robust augmentation term (simple linear outcome working model in age)
# ---------------------------------------------------------------------------
def _dr_augment(xc, y, w, side_mask):
    """Augment the IPCW pseudo-outcome with a regression prediction.

    Fit a weighted linear outcome model m(age) on one side of the cutoff, then
    form the DR pseudo-outcome  m(age) + w * (y - m(age)). If the censoring
    weights are perfect this reduces to IPCW; if the outcome model is perfect the
    residual term vanishes. Either being right gives consistency.
    """
    xs, ys, ws = xc[side_mask], y[side_mask], w[side_mask]
    if xs.size < 5:
        return np.full(xs.size, np.nan)
    X = np.column_stack([np.ones_like(xs), xs])
    WX = X * ws[:, None]
    beta = np.linalg.pinv(WX.T @ X) @ (WX.T @ ys)
    m = X @ beta
    return m + ws * (ys - m)


def _dr_pseudo(x, time, event, c, tau):
    """Build the doubly-robust RMST pseudo-outcome for every subject."""
    x = np.asarray(x, dtype=float)
    xc = x - c
    y, w = rmst_pseudo(time, event, tau)
    # normalise weights to mean 1 on each side so the level is comparable
    out = np.full_like(y, np.nan, dtype=float)
    for mask in (xc < 0, xc >= 0):
        if mask.sum() == 0:
            continue
        ww = w.copy()
        mw = ww[mask].mean()
        if mw > 0:
            ww[mask] = ww[mask] / mw
        out[mask] = _dr_augment(xc, y, ww, mask)
    return out


# ---------------------------------------------------------------------------
# Public: sharp & fuzzy survival RD on the DR-RMST pseudo-outcome
# ---------------------------------------------------------------------------
def survival_rd(df, x_name, time_name, event_name, c, h=None, tau=10.0,
                d_name=None, fuzzy=False, lang="zh"):
    """Sharp (or fuzzy) RD on the IPCW/DR restricted-mean-survival-time pseudo-outcome.

    Returns the RMST jump at the cutoff (extra years of event-free time from
    crossing the eligibility threshold), plus a plain-language reading.
    """
    x = np.asarray(df[x_name], dtype=float)
    time = np.asarray(df[time_name], dtype=float)
    event = np.asarray(df[event_name], dtype=int)
    if h is None:
        h = default_bandwidth(x, c)

    pseudo = _dr_pseudo(x, time, event, c, tau)
    good = np.isfinite(pseudo)
    xg, pg = x[good], pseudo[good]

    if fuzzy and d_name is not None:
        d = np.asarray(df[d_name], dtype=float)[good]
        res = fuzzy_rd(xg, pg, d, c, h)
        kind = t(lang, "模糊", "fuzzy")
    else:
        res = sharp_rd(xg, pg, c, h)
        kind = t(lang, "銳利", "sharp")

    est = res["estimate"]
    res["tau_horizon"] = float(tau)
    res["kind"] = kind
    res["interpretation"] = t(
        lang,
        f"在 {tau:.0f} 年的觀察範圍內，跨過 65 歲資格門檻使「無重大健康事件存活時間」"
        f"變化約 {est:+.2f} 年（已用 IPCW／雙重穩健法處理設限）。"
        + ("（模糊版＝斷點附近實際接種者的效果。）" if fuzzy else "（銳利版＝跨越資格門檻的整體效果，類似 ITT。）"),
        f"Within the {tau:.0f}-year horizon, crossing the age-65 eligibility "
        f"threshold changes event-free survival time by about {est:+.2f} years "
        f"(censoring handled by IPCW / doubly-robust adjustment). "
        + ("(Fuzzy = effect for those actually vaccinated near the cutoff.)"
           if fuzzy else "(Sharp = overall effect of crossing eligibility, ITT-like.)"),
    )
    return res


# ---------------------------------------------------------------------------
# Naive (complete-case) comparison: RD on min(T, tau) ignoring censoring
# ---------------------------------------------------------------------------
def naive_survival_rd(df, x_name, time_name, c, h=None, tau=10.0, lang="zh"):
    """RD on the raw restricted follow-up time, ignoring censoring — the biased
    comparison that motivates IPCW/DR."""
    x = np.asarray(df[x_name], dtype=float)
    time = np.asarray(df[time_name], dtype=float)
    if h is None:
        h = default_bandwidth(x, c)
    y = np.minimum(time, tau)
    res = sharp_rd(x, y, c, h)
    res["tau_horizon"] = float(tau)
    res["interpretation"] = t(
        lang,
        "未處理設限：直接對觀察到的追蹤時間做 RD，會被提早設限的人往下拉而低估存活時間。",
        "No censoring adjustment: an RD on the raw observed follow-up time is "
        "pulled down by early-censored subjects and underestimates survival time.",
    )
    return res
