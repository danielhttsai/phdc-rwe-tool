"""Tests for the TMLE / doubly-robust (AIPW) method."""
from __future__ import annotations

import numpy as np
import pytest

import tmle_gen
import tmle_core
import tmle_assumptions

TRUTH = tmle_gen.TRUE_ATE


def _demo():
    return tmle_gen.generate()


def test_crude_is_biased():
    r = tmle_core.full_tmle(_demo())
    assert abs(r["crude"] - TRUTH) > 0.4


@pytest.mark.parametrize("key", ["gcomp", "iptw", "aipw", "tmle"])
def test_estimators_recover_truth(key):
    r = tmle_core.full_tmle(_demo())
    assert abs(r[key] - TRUTH) < 0.25, f"{key}={r[key]}"


def test_dr_beats_naive():
    r = tmle_core.full_tmle(_demo())
    assert abs(r["aipw"] - TRUTH) + 0.3 < abs(r["crude"] - TRUTH)
    assert abs(r["tmle"] - TRUTH) + 0.3 < abs(r["crude"] - TRUTH)


def test_tmle_ci_covers_truth():
    r = tmle_core.full_tmle(_demo())
    lo, hi = r["ci"]
    assert lo < TRUTH < hi


def test_grid_monotone_and_dr_flat():
    g = tmle_core._GRID
    crude = g["crude"]
    assert all(crude[i] <= crude[i + 1] + 1e-6 for i in range(len(crude) - 1))
    assert crude[-1] > crude[0] + 1.0
    for v in g["aipw"] + g["tmle"]:
        assert abs(v - g["true_ate"]) < 0.1


def test_interactive_bilingual():
    zh = tmle_core.tmle_interactive(1.0, lang="zh")
    en = tmle_core.tmle_interactive(1.0, lang="en")
    assert zh["reading"] != en["reading"] and zh["crude"] == en["crude"]


def test_dashboard_shape():
    d = tmle_assumptions.run_dashboard(_demo(), lang="zh")
    ids = [c["id"] for c in d["checks"]]
    assert ids == ["C1", "C2", "C3", "C4", "C5"]
    by = {c["id"]: c for c in d["checks"]}
    assert by["C2"]["status"] == "green"
    assert by["C5"]["status"] == "green"


def test_interpretation_bilingual():
    zh = tmle_core.full_tmle(_demo(), lang="zh")["interpretation"]
    en = tmle_core.full_tmle(_demo(), lang="en")["interpretation"]
    assert zh != en and len(en) > 40


def test_ml_beats_linear():
    pytest.importorskip("sklearn")
    import tmle_ml
    out = tmle_ml.ml_tmle_demo()
    assert abs(out["ate_ml"] - out["ate_true"]) < abs(out["ate_lin"] - out["ate_true"])


def test_grid_matches_recompute():
    g = tmle_core._recompute_grid(n=8000)
    for k in ("crude", "aipw", "tmle"):
        d = float(np.max(np.abs(np.array(g[k]) - np.array(tmle_core._GRID[k]))))
        assert d <= 0.2, f"{k} drifted {d}"


if __name__ == "__main__":
    import sys
    sys.exit(pytest.main([__file__, "-q"]))
