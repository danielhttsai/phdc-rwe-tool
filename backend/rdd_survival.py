"""Survival-outcome Regression Discontinuity with right-censoring.

Faithful re-implementation (pure numpy/scipy, Pyodide-friendly) of the
IPCW / doubly-robust survival-RD estimator: the outcome is the (right-censored)
log event time log(T); censoring is handled by inverse-probability-of-censoring
weighting and, on top of that, a doubly-robust augmentation using an outcome
working model for the conditional expectation  m1[j,i] = E[log T | T > T_j, W_i].

Pipeline (per the sharp / fuzzy survival-RD method):

  1.  Outcome regression  ->  m1[j,i] = E[log T | T > T_j, W_i]
        * "cox"          Cox proportional-hazards model, Breslow baseline,
                         conditional expectation from the survival-curve jumps.
        * "lognorm"      AFT log-normal, closed-form residual conditional mean.
        * "loglogistic"  AFT log-logistic, closed-form residual conditional mean.

  2.  Censoring distribution  G(t) = P(C > t)  via Kaplan-Meier with a 5%
      upper-tail truncation (force the largest 5% of times to be events) so the
      weights 1/G stay finite.

  3.  External DR pieces  a0,a1,b0,b1,c0,c1  ->
        IPCW pseudo-outcome = a1 = delta * log(T) / G
        DR   pseudo-outcome = a1 + b1 - c1   (consistent if EITHER model holds).

  4.  The pseudo-outcomes are fed through the SAME local-linear RD machinery in
      `rdd_core` -- sharp (jump at the cutoff) or fuzzy (scaled by the treatment
      jump = LATE for compliers at the threshold).

This is the full transform-and-RD estimator, NOT a restricted-mean shortcut.
For the built-in age-65 demo (N=12000) the transform's outcome regression needs
an N x N conditional-expectation matrix, so the survival tab runs on a fixed,
seeded teaching sub-sample (NU_MAX rows); the estimator itself is unchanged.
"""
from __future__ import annotations

import numpy as np
from scipy.stats import norm
from scipy.optimize import minimize, minimize_scalar

from i18n import t
from rdd_core import sharp_rd, fuzzy_rd, default_bandwidth

NU_MAX = 1800        # teaching sub-sample cap for the O(N^2) outcome regression
_SUBSEED = 7


# ---------------------------------------------------------------------------
# Deterministic teaching sub-sample (keeps the N x N matrix feasible)
# ---------------------------------------------------------------------------
def _subsample(*cols, nu_max=NU_MAX, seed=_SUBSEED):
    n = len(cols[0])
    if n <= nu_max:
        return cols
    idx = np.random.default_rng(seed).choice(n, size=nu_max, replace=False)
    idx.sort()
    return tuple(np.asarray(c)[idx] for c in cols)


# ---------------------------------------------------------------------------
# Censoring survival  G(t)=P(C>t)  -- KM with 5% upper-tail truncation (Gfunc)
# ---------------------------------------------------------------------------
def _gfunc(obs, delta):
    """Port of the R `Gfunc`: KM for the censoring survival with the largest 5%
    of observed times forced to be events, guaranteeing G(obs_i) > 0.

    Returns (surC_km, obs, delta_trunc) with surC_km[i] = G(obs_i).
    """
    obs = np.asarray(obs, dtype=float)
    delta = np.asarray(delta, dtype=float).copy()
    nu = obs.size

    order = np.argsort(obs, kind="mergesort")
    lo = int(np.floor(nu - 0.05 * nu)) - 1          # R floor(nu-0.05*nu):nu, 1-based
    lo = max(lo, 0)
    delta[order[lo:]] = 1.0                          # truncate the upper 5%

    # censoring hazard at each obs_i: (1-delta_i) / #{obs >= obs_i}
    at_risk = np.array([np.sum(obs >= xx) for xx in obs], dtype=float)
    hazC = (1.0 - delta) / at_risk
    # KM censoring survival evaluated at each obs_i: prod over obs<=obs_i of (1-haz)
    surC = np.array([np.prod(1.0 - hazC[obs <= xx]) for xx in obs], dtype=float)
    surC = np.clip(surC, 1e-8, 1.0)
    return surC, obs, delta


# ---------------------------------------------------------------------------
# Outcome regression 1: Cox PH (Breslow), m1[j,i] = E[log T | T>T_j, W_i]
# ---------------------------------------------------------------------------
def _cox_fit_beta(obs, delta, x):
    """Single-covariate Cox partial-likelihood MLE (Breslow ties)."""
    obs = np.asarray(obs, float); delta = np.asarray(delta, float); x = np.asarray(x, float)
    order = np.argsort(obs, kind="mergesort")
    obs_s, x_s = obs[order], x[order]
    ev = delta[order] == 1
    first = np.searchsorted(obs_s, obs_s, side="left")   # first index of each tie group

    def negll(beta):
        ex = np.exp(beta * x_s)
        suffix = np.cumsum(ex[::-1])[::-1]               # sum over obs >= obs_s[k]
        risk = suffix[first]
        return -(np.sum(beta * x_s[ev]) - np.sum(np.log(risk[ev])))

    res = minimize_scalar(negll, bounds=(-5.0, 5.0), method="bounded")
    return float(res.x)


def _cox_m1(obs, delta, x):
    obs = np.asarray(obs, float); delta = np.asarray(delta, float); x = np.asarray(x, float)
    nu = obs.size
    beta = _cox_fit_beta(obs, delta, x)
    ex = np.exp(beta * x)

    order = np.argsort(obs, kind="mergesort")
    obs_sort = obs[order]

    # Breslow baseline cumulative hazard at each sorted obs time
    suffix_risk = np.cumsum(ex[order][::-1])[::-1]       # sum_{m>=k} ex at obs_sort
    first = np.searchsorted(obs_sort, obs_sort, side="left")
    risk_at = suffix_risk[first]                         # #risk-weighted set at each time
    d_at = (delta[order]).astype(float)                  # events at each sorted position
    dH0 = np.where(d_at > 0, d_at / risk_at, 0.0)
    H0 = np.cumsum(dH0)                                  # cumulative baseline hazard at obs_sort

    # survival curves S_i(obs_sort_k) = exp(-H0_k * ex_i)   (nu x nu)
    S = np.exp(-np.outer(ex, H0))                        # row i, col k
    # jumps: surv.diff[i,k] = S_i(t_{k-1}) - S_i(t_k), with S_i(t_0)=1
    prev = np.concatenate([np.ones((nu, 1)), S[:, :-1]], axis=1)
    surv_diff = prev - S                                 # probability mass at each time

    logt = np.log(obs_sort)
    # suffix cumulative sums over k (times > T_j): num/den per row i
    num_suf = np.cumsum((logt * surv_diff)[:, ::-1], axis=1)[:, ::-1]
    den_suf = np.cumsum(surv_diff[:, ::-1], axis=1)[:, ::-1]

    max_event_time = obs[delta == 1].max() if np.any(delta == 1) else -np.inf

    m1 = np.zeros((nu, nu))
    cens = np.where(delta == 0)[0]
    for j in cens:
        if max_event_time > obs[j]:
            kstar = np.searchsorted(obs_sort, obs[j], side="right")  # first time > T_j
            den = den_suf[:, kstar]
            num = num_suf[:, kstar]
            m1[j, :] = np.where(den > 1e-12, num / den, np.log(obs[j]))
        else:
            m1[j, :] = np.log(obs[j])
    return m1


# ---------------------------------------------------------------------------
# Outcome regression 2/3: AFT log-normal / log-logistic, closed-form cond. mean
# ---------------------------------------------------------------------------
def _aft_fit(obs, delta, x, family):
    """MLE for an AFT model  log T = b0 + b1*x + scale * eps,  eps ~ std family."""
    logt = np.log(np.asarray(obs, float))
    delta = np.asarray(delta, float); x = np.asarray(x, float)

    def negll(p):
        b0, b1, ls = p
        s = np.exp(ls)
        u = (logt - b0 - b1 * x) / s
        if family == "lognorm":
            log_f = norm.logpdf(u) - np.log(s)
            log_S = norm.logsf(u)
        else:  # loglogistic: standard logistic
            log_f = -u - 2.0 * np.log1p(np.exp(-u)) - np.log(s)
            log_S = -np.log1p(np.exp(u))
        ll = np.where(delta == 1, log_f, log_S)
        return -np.sum(ll)

    b0_0 = float(np.mean(logt)); b1_0 = 0.0; ls_0 = float(np.log(np.std(logt) + 1e-6))
    res = minimize(negll, np.array([b0_0, b1_0, ls_0]), method="Nelder-Mead",
                   options={"xatol": 1e-6, "fatol": 1e-8, "maxiter": 4000})
    b0, b1, ls = res.x
    return float(b0), float(b1), float(np.exp(ls))


def _cond_lognorm(u):
    # E[Z|Z>u] for standard normal; u>5 -> u (numerical guard)
    out = norm.pdf(u) / np.clip(norm.sf(u), 1e-12, None)
    return np.where(u > 5.0, u, out)


def _cond_loglogistic(u):
    # closed-form residual conditional mean for standard logistic; u>15 -> u+1
    safe = np.clip(u, None, 15.0)
    val = safe + (np.log1p(np.exp(safe)) - safe) * (1.0 + np.exp(safe))
    return np.where(u > 15.0, u + 1.0, val)


def _aft_m1(obs, delta, x, family):
    obs = np.asarray(obs, float); delta = np.asarray(delta, float); x = np.asarray(x, float)
    nu = obs.size
    b0, b1, s = _aft_fit(obs, delta, x, family)
    cond = _cond_lognorm if family == "lognorm" else _cond_loglogistic

    mu = b0 + b1 * x                       # length nu (per subject i)
    logt = np.log(obs)                     # per censored j
    m1 = np.zeros((nu, nu))
    cens = np.where(delta == 0)[0]
    for j in cens:
        res = (logt[j] - mu) / s           # vector over i
        m1[j, :] = mu + s * cond(res)
    return m1


def _m1(obs, delta, x, mtype):
    if mtype == "cox":
        return _cox_m1(obs, delta, x)
    return _aft_m1(obs, delta, x, mtype)


# ---------------------------------------------------------------------------
# External DR pieces and the IPCW / DR transformed responses
# ---------------------------------------------------------------------------
def _external_dr(obs, delta, x, mtype):
    """Returns (ipcw, dr) transformed responses on the (possibly truncated) sample."""
    m1 = _m1(obs, delta, x, mtype)
    surC, obs_t, delta_t = _gfunc(obs, delta)

    a0 = delta_t / surC
    a1 = a0 * np.log(obs_t)
    b0 = (1.0 - delta_t) / surC
    b1 = b0 * np.diag(m1)

    kk = np.array([np.sum(tt <= obs_t) for tt in obs_t], dtype=float)  # #{obs >= tt}
    le = (obs_t[:, None] <= obs_t[None, :])          # le[j,i] = obs_j <= obs_i
    c0 = np.sum((b0 / kk)[:, None] * le, axis=0)
    c1 = np.sum((b0 / kk)[:, None] * le * m1, axis=0)  # sum_j b0_j*(obs_j<=obs_i)*m1[j,i]/kk_j

    ipcw = a1
    dr = a1 + b1 - c1
    return ipcw, dr


# ---------------------------------------------------------------------------
# Public: sharp & fuzzy survival RD on the IPCW / DR log-time pseudo-outcomes
# ---------------------------------------------------------------------------
_METHOD_LABELS = {
    "ipcw":        ("IPCW（反設限機率加權）", "IPCW (inverse-prob-of-censoring weighting)"),
    "cox":         ("雙重穩健 · Cox", "Doubly robust · Cox"),
    "lognorm":     ("雙重穩健 · 對數常態 AFT", "Doubly robust · log-normal AFT"),
    "loglogistic": ("雙重穩健 · 對數羅吉斯 AFT", "Doubly robust · log-logistic AFT"),
}


def survival_rd(df, x_name, time_name, event_name, c, h=None,
                d_name=None, fuzzy=False, lang="zh",
                methods=("ipcw", "cox", "lognorm"), nu_max=NU_MAX):
    """Sharp (or fuzzy) survival RD using the IPCW + doubly-robust log-time transform.

    Returns the jump in expected log event-time at the cutoff for each requested
    method, plus a plain-language reading. Top-level `estimate` is the IPCW jump.
    """
    x = np.asarray(df[x_name], dtype=float)
    obs = np.asarray(df[time_name], dtype=float)
    delta = np.asarray(df[event_name], dtype=float)
    dd = np.asarray(df[d_name], dtype=float) if (fuzzy and d_name) else None

    if dd is None:
        x, obs, delta = _subsample(x, obs, delta, nu_max=nu_max)
    else:
        x, obs, delta, dd = _subsample(x, obs, delta, dd, nu_max=nu_max)

    if h is None:
        h = default_bandwidth(x, c)
    xc = x - c                               # centred running variable for the outcome model
    cens_rate = float(np.mean(delta == 0))

    # DR augmentation needs the same model family; cache by mtype.
    needs = set(methods)
    family_for = {"ipcw": "cox", "cox": "cox", "lognorm": "lognorm", "loglogistic": "loglogistic"}
    cache: dict[str, tuple] = {}
    for fam in {family_for[m] for m in needs}:
        cache[fam] = _external_dr(obs, delta, xc, fam)

    out_methods = []
    primary = None
    for m in methods:
        ipcw, dr = cache[family_for[m]]
        pseudo = ipcw if m == "ipcw" else dr
        good = np.isfinite(pseudo)
        if fuzzy and dd is not None:
            res = fuzzy_rd(x[good], pseudo[good], dd[good], c, h)
        else:
            res = sharp_rd(x[good], pseudo[good], c, h)
        zh, en = _METHOD_LABELS[m]
        item = {"key": m, "label": t(lang, zh, en),
                "estimate": res["estimate"], "se": res.get("se"),
                "ci": res.get("ci")}
        out_methods.append(item)
        if primary is None:
            primary = item

    est = primary["estimate"]
    kind = t(lang, "模糊", "fuzzy") if fuzzy else t(lang, "銳利", "sharp")
    payload = {
        "cutoff": float(c), "h": float(h), "fuzzy": bool(fuzzy),
        "nu": int(x.size), "cens_rate": cens_rate, "kind": kind,
        "estimate": est, "se": primary.get("se"),
        "methods": out_methods,
        "interpretation": t(
            lang,
            f"以「log（事件時間）」為結果，並用 IPCW／雙重穩健法處理設限後，跨過 "
            f"{c:.0f} 歲資格門檻使預期 log 事件時間變化約 {est:+.2f}"
            + ("（模糊版＝斷點附近實際接種者的效果）。" if fuzzy
               else "（銳利版＝跨越資格門檻的整體效果，類似 ITT）。")
            + f" 此分頁在 {x.size} 筆的教學子樣本上計算（設限比例約 {cens_rate*100:.0f}%）。",
            f"With log(event time) as the outcome and censoring handled by IPCW / "
            f"doubly-robust adjustment, crossing the age-{c:.0f} eligibility "
            f"threshold changes expected log event-time by about {est:+.2f}"
            + (" (fuzzy = effect for those actually vaccinated near the cutoff)."
               if fuzzy else " (sharp = overall effect of crossing eligibility, ITT-like).")
            + f" Computed on a {x.size}-row teaching sub-sample "
            f"(censoring rate ~{cens_rate*100:.0f}%).",
        ),
    }
    return payload


# ---------------------------------------------------------------------------
# Naive (complete-case) comparison: RD on log(observed time), ignoring censoring
# ---------------------------------------------------------------------------
def naive_survival_rd(df, x_name, time_name, c, h=None, lang="zh", nu_max=NU_MAX):
    """RD on log(observed follow-up), ignoring censoring -- the biased baseline
    that motivates the IPCW/DR correction (early-censored subjects drag it down)."""
    x = np.asarray(df[x_name], dtype=float)
    obs = np.asarray(df[time_name], dtype=float)
    x, obs = _subsample(x, obs, nu_max=nu_max)
    if h is None:
        h = default_bandwidth(x, c)
    res = sharp_rd(x, np.log(obs), c, h)
    res["interpretation"] = t(
        lang,
        "未處理設限：直接對 log（觀察到的追蹤時間）做 RD，會被提早設限者往下拉而低估事件時間。",
        "No censoring adjustment: an RD on log(observed follow-up) is pulled down "
        "by early-censored subjects and underestimates the event time.",
    )
    return res
