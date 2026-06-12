"""Synthetic data for Weighted Cumulative Exposure (WCE).

Story: a drug's effect on the hazard does not depend only on whether you take it
*right now*, nor on your *total* lifetime dose — it depends on a weighted sum of
recent doses, where a dose taken τ months ago contributes w(τ). Here recent doses
matter most and the weight decays with time since exposure (Sela & Abrahamowicz
2009). We generate monthly drug-use histories and an event whose monthly hazard
rises with the true weighted cumulative exposure. Naive models that use only
current use, or unweighted total dose, mis-weight the past and are biased; WCE
estimates the weight function and recovers the truth.

generate() returns a dict with:
  dose   (N, T) int 0/1   monthly drug use
  surv   (N,)   int       month of event or censoring (1..T)
  event  (N,)   int 0/1   1 = event observed, 0 = censored at T
plus TRUE_BETA, the true weight curve W_TRUE (length L), and helpers.
"""
from __future__ import annotations

import numpy as np

SEED = 11
N = 700
T = 60                 # follow-up months
L = 24                 # weight window: a dose matters for up to L months
TRUE_BETA = 1.0        # effect size multiplying the weighted cumulative exposure
DECAY = 8.0            # true weight decays with time-since-exposure (scale, months)
ALPHA0 = -4.4          # baseline monthly log-hazard intercept (modest event rate)


def true_weight(L=L, decay=DECAY):
    """True weight function w(τ), τ = months since a dose. Recent doses weigh most."""
    tau = np.arange(L, dtype=float)
    w = np.exp(-tau / decay)
    return w / w.sum()                 # normalised so a sustained user's WCE → 1


W_TRUE = true_weight()


def _use_histories(rng, n, T):
    """Each person switches the drug on/off as a Markov process (sticky use)."""
    dose = np.zeros((n, T), dtype=np.intp)
    on = rng.random(n) < 0.45          # ~45% are on at baseline
    p_start, p_stop = 0.06, 0.10       # monthly start/stop probabilities
    for t in range(T):
        dose[:, t] = on.astype(np.intp)
        flip_start = (~on) & (rng.random(n) < p_start)
        flip_stop = on & (rng.random(n) < p_stop)
        on = (on | flip_start) & ~flip_stop
    return dose


def wce_series(dose, w):
    """Weighted cumulative exposure for every person-month: WCE[i,t] = Σ_τ dose[i,t−τ]·w[τ]."""
    n, T = dose.shape
    L = w.size
    wce = np.zeros((n, T), dtype=float)
    for tau in range(L):
        if tau == 0:
            wce += w[tau] * dose
        else:
            wce[:, tau:] += w[tau] * dose[:, :T - tau]
    return wce


def generate(seed: int = SEED, n: int = N, beta: float = TRUE_BETA):
    rng = np.random.default_rng(seed)
    dose = _use_histories(rng, n, T)
    wce = wce_series(dose, W_TRUE)
    surv = np.full(n, T, dtype=np.intp)
    event = np.zeros(n, dtype=np.intp)
    alive = np.ones(n, dtype=bool)
    for t in range(T):
        haz = 1.0 / (1.0 + np.exp(-(ALPHA0 + beta * wce[:, t])))
        hit = alive & (rng.random(n) < haz)
        surv[hit] = t + 1
        event[hit] = 1
        alive &= ~hit
    return {"dose": dose, "surv": surv, "event": event,
            "n": int(n), "T": int(T), "L": int(L),
            "true_beta": float(beta), "w_true": W_TRUE.tolist()}
