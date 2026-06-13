"""Synthetic data for the missing-data / imputation teaching demo.

A confounder X drives BOTH the treatment A and the outcome Y, so the honest,
adjusted effect of A on Y is TRUE_TAU (you must adjust for X). We then knock out
some of X (MCAR or MAR) so the learner can watch complete-case analysis and mean
imputation go wrong, while multiple imputation recovers the truth. Purely
synthetic, for teaching only.
"""
import numpy as np

SEED = 7
N = 1500
TRUE_TAU = 1.5      # true effect of A on Y, adjusting for the confounder X
B_X = 1.0           # effect of the confounder X on Y
A_X = 0.9           # how strongly X pushes treatment (this is the confounding)


def _sig(z):
    return 1.0 / (1.0 + np.exp(-z))


def generate(n=N, seed=SEED):
    """One row per person: confounder X, treatment A (depends on X), outcome Y."""
    rng = np.random.default_rng(seed)
    x = rng.normal(0.0, 1.0, n)
    a = (rng.random(n) < _sig(A_X * x)).astype(float)
    y = TRUE_TAU * a + B_X * x + rng.normal(0.0, 1.0, n)
    return {"A": a, "X": x, "Y": y, "n": int(n), "true_tau": float(TRUE_TAU)}
