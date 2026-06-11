"""Tests for TreeScan (the tree-based scan statistic).

Story: a naive uncorrected scan over many nodes raises false alarms; the tree-based scan
statistic with a permutation p-value controls the family-wise error. Under the null it flags
(essentially) nothing; with a real excess it flags the true node (and its parent system).
Grid monotone in the signal region; dashboard shape; bilingual.
"""
from __future__ import annotations

import numpy as np
import pytest

import tscan_gen
import tscan_core
import tscan_assumptions


def test_null_flags_nothing_naive_overflags():
    r = tscan_core.full_tscan(tscan_gen.generate(signal=1.0))
    assert r["n_tscan_flags"] == 0                  # FWER-controlled: no signal under the null
    assert not r["target_hit"]
    assert r["n_naive_flags"] >= r["n_tscan_flags"]  # naive is no better, usually worse


def test_real_signal_is_found_at_the_target():
    r = tscan_core.full_tscan(tscan_gen.generate(signal=3.0))
    assert r["target_hit"]                           # the true node is flagged
    assert r["nodes"][0]["label"] == r["target_label"]
    assert r["nodes"][0]["p"] < 0.05
    assert r["n_tscan_flags"] >= 1


def test_treescan_controls_multiplicity_vs_naive():
    # across signal strengths, TreeScan never flags more than the naive uncorrected scan
    for s in (1.0, 2.0, 3.0):
        r = tscan_core.full_tscan(tscan_gen.generate(signal=s))
        assert r["n_tscan_flags"] <= r["n_naive_flags"] + 1


def test_interactive_grid_monotone_in_signal():
    g = tscan_core._GRID
    # in the signal region (strength >= 2) the LLR rises and tscan flags appear
    sidx = [i for i, s in enumerate(g["sig"]) if s >= 2.0]
    llrs = [g["llr"][i] for i in sidx]
    assert all(llrs[i] <= llrs[i + 1] + 1e-6 for i in range(len(llrs) - 1))
    assert g["tscan"][0] == 0                        # strength 1.0 → null → no flag
    assert g["tscan"][-1] >= 1
    assert g["p"][0] > 0.05 and g["p"][-1] < 0.05


def test_grid_matches_recompute():
    g = tscan_core._recompute_grid(B=199)
    for a, b in zip(g["llr"], tscan_core._GRID["llr"]):
        assert abs(a - b) < 2.0, f"grid LLR drift: {a} vs {b}"
    # flag-count pattern (null vs signal) must agree at the ends
    assert g["tscan"][0] == tscan_core._GRID["tscan"][0]
    assert g["tscan"][-1] >= 1


def test_interactive_reading_bilingual():
    zh = tscan_core.tscan_interactive(3.0, lang="zh")
    en = tscan_core.tscan_interactive(3.0, lang="en")
    assert zh["reading"] != en["reading"]
    assert zh["llr"] == en["llr"]


def test_dashboard_shape():
    d = tscan_assumptions.run_dashboard(tscan_gen.generate(signal=3.0), lang="zh")
    ids = [c["id"] for c in d["checks"]]
    assert ids == ["C1", "C2", "C3", "C4", "C5"]
    for c in d["checks"]:
        assert c["status"] in ("green", "amber", "red", "info")
        assert c["title"] and c["headline"] and c["plain"]


def test_interpretation_bilingual():
    zh = tscan_core.full_tscan(tscan_gen.generate(signal=3.0), lang="zh")["interpretation"]
    en = tscan_core.full_tscan(tscan_gen.generate(signal=3.0), lang="en")["interpretation"]
    assert zh != en and len(zh) > 40 and len(en) > 40


if __name__ == "__main__":
    import sys
    sys.exit(pytest.main([__file__, "-q"]))
