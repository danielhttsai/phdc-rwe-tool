"""Tests for the G-methods method.

Story: with treatment–confounder feedback, the unadjusted estimate is confounded and the
Lₜ-adjusted estimate is biased the other way (mediator + collider); g-formula and IPTW-MSM
recover the regime contrast. Interactive grid monotone in feedback; dashboard shape; bilingual;
ML g-formula beats linear under non-linear nuisances.
"""
from __future__ import annotations

import numpy as np
import pytest

import gm_gen
import gm_core
import gm_assumptions


TRUTH = gm_gen.true_effect()


def _demo():
    return gm_gen.generate()


def test_truth_is_analytic():
    assert abs(gm_gen.true_effect(feedback=1.0) - (2 * gm_gen.TAU - gm_gen.D_L)) < 1e-9
    assert gm_gen.true_effect(feedback=0.0) == pytest.approx(2 * gm_gen.TAU)


@pytest.mark.parametrize("key", ["gformula", "iptw"])
def test_gmethods_recover_truth(key):
    r = gm_core.full_gm(_demo())
    assert abs(r[key] - TRUTH) < 0.3, f"{key}={r[key]} not near truth {TRUTH}"


def test_naive_estimators_are_biased():
    r = gm_core.full_gm(_demo())
    # unadjusted is badly confounded (truth is strongly negative, unadjusted is near 0 / positive)
    assert abs(r["naive_unadj"] - TRUTH) > 2.0
    # adjusting for the time-varying L is also biased (attenuated toward 0)
    assert abs(r["naive_adj"] - TRUTH) > 0.8
    # and both g-methods beat both naive estimators
    assert abs(r["gformula"] - TRUTH) + 0.5 < abs(r["naive_adj"] - TRUTH)


def test_interactive_grid_monotone():
    g = gm_core._GRID
    # truth and g-formula get more negative as feedback strengthens (the mediated path grows)
    for arr in (g["truth"], g["gformula"]):
        assert all(arr[i] >= arr[i + 1] - 1e-6 for i in range(len(arr) - 1))
    # g-methods track the truth across the whole grid
    for est in ("gformula", "iptw"):
        for v, tr in zip(g[est], g["truth"]):
            assert abs(v - tr) < 0.2


def test_grid_matches_recompute():
    g = gm_core._recompute_grid(n=40000)
    for k in ("truth", "gformula", "iptw"):
        for a, b in zip(g[k], gm_core._GRID[k]):
            assert abs(a - b) < 0.15, f"grid drift in {k}: {a} vs {b}"


def test_interactive_reading_bilingual():
    zh = gm_core.gm_interactive(1.0, lang="zh")
    en = gm_core.gm_interactive(1.0, lang="en")
    assert zh["reading"] != en["reading"]
    assert zh["gformula"] == en["gformula"]


def test_dashboard_shape():
    d = gm_assumptions.run_dashboard(_demo(), lang="zh")
    ids = [c["id"] for c in d["checks"]]
    assert ids == ["C1", "C2", "C3", "C4", "C5"]
    for c in d["checks"]:
        assert c["status"] in ("green", "amber", "red", "info")
        assert c["title"] and c["headline"] and c["plain"]


def test_interpretation_bilingual():
    zh = gm_core.full_gm(_demo(), lang="zh")["interpretation"]
    en = gm_core.full_gm(_demo(), lang="en")["interpretation"]
    assert zh != en and len(zh) > 40 and len(en) > 40


def test_ml_gformula_beats_linear():
    pytest.importorskip("sklearn")
    import gm_ml
    o = gm_ml.ml_gmethods_demo()
    assert abs(o["est_gb"] - o["truth"]) < abs(o["est_lin"] - o["truth"])


if __name__ == "__main__":
    import sys
    sys.exit(pytest.main([__file__, "-q"]))
