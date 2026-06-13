"""Synthetic study-level data for the systematic-review / meta-analysis demo.

We imagine K randomised vaccine trials, each reporting a log risk ratio yi with a
within-study standard error si (smaller trials → larger si). The trials do NOT all
estimate exactly the same thing: each trial's true effect is drawn around a common
pooled effect MU with a between-study standard deviation TAU (clinical/methodo-
logical diversity). TAU=0 means every trial targets the identical effect (a fixed-
effect world); TAU>0 means the effects genuinely differ (a random-effects world).

Purely synthetic, for teaching only — no real trial is used.
"""
import numpy as np

SEED = 42
K = 12               # number of trials in the meta-analysis
MU = -0.36           # true pooled log risk ratio (exp(-0.36) ≈ 0.70, i.e. 30% lower risk)
TAU = 0.20           # between-study SD of the true effects (heterogeneity)
SE_LO, SE_HI = 0.05, 0.22   # within-study SEs range from big trials to small ones


def generate(k=K, tau=TAU, seed=SEED):
    """K trials: per-trial log risk ratio yi and within-study SE si.

    Each trial i has its own true effect theta_i ~ N(MU, tau^2); the reported
    estimate adds within-study sampling noise N(0, si^2).
    """
    rng = np.random.default_rng(seed)
    # within-study SEs: a spread of trial sizes (a few precise, several small)
    si = np.sort(rng.uniform(SE_LO, SE_HI, k))
    theta = MU + tau * rng.standard_normal(k)        # true per-trial effects
    yi = theta + si * rng.standard_normal(k)          # observed estimates
    labels = ["Trial %02d" % (i + 1) for i in range(k)]
    return {
        "labels": labels,
        "yi": yi,            # log risk ratios
        "si": si,            # within-study SEs
        "k": int(k),
        "mu": float(MU),
        "tau": float(tau),
        "true_rr": float(np.exp(MU)),
    }
