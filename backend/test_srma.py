"""Tests for the meta-analysis core (fixed vs random effects, heterogeneity)."""
import numpy as np

import srma_core as sc
from srma_gen import generate, MU


def test_pooled_near_truth():
    """Both pooling models land near the true pooled log RR."""
    out = sc.full_srma(lang="en")
    assert abs(out["fixed"]["logrr"] - MU) < 0.20
    assert abs(out["random"]["logrr"] - MU) < 0.20


def test_random_effects_wider_under_heterogeneity():
    """With real between-study heterogeneity, the RE interval is wider than FE."""
    out = sc.full_srma(tau=0.25, lang="en")
    assert out["ci_width_ratio"] > 1.05
    assert out["I2"] > 30.0


def test_no_heterogeneity_collapses_to_fixed():
    """With tau=0 the DL tau^2 is small and RE ≈ FE."""
    out = sc.full_srma(tau=0.0, lang="en")
    assert out["ci_width_ratio"] < 1.30
    assert abs(out["fixed"]["logrr"] - out["random"]["logrr"]) < 0.05


def test_heterogeneity_monotone_in_tau():
    """Bigger between-study SD → bigger I^2."""
    lo = sc.full_srma(tau=0.05, lang="en")["I2"]
    hi = sc.full_srma(tau=0.35, lang="en")["I2"]
    assert hi > lo


def test_weights_sum_to_100():
    out = sc.full_srma(lang="en")
    total = sum(s["weight"] for s in out["studies"])
    assert abs(total - 100.0) < 1e-6


def test_egger_returns_pvalue():
    out = sc.full_srma(lang="en")
    assert 0.0 <= out["egger_p"] <= 1.0


def test_bilingual_reading_differs():
    zh = sc.full_srma(lang="zh")["reading"]
    en = sc.full_srma(lang="en")["reading"]
    assert zh != en and len(zh) > 0 and len(en) > 0


def test_interactive_shape():
    out = sc.srma_interactive(tau=0.2, lang="en")
    for key in ("fixed", "random", "I2", "tau2", "ci_width_ratio", "truth_rr"):
        assert key in out
