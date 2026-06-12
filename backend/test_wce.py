"""Tests for WCE (weighted cumulative exposure).

Story: WCE recovers the time-since-exposure weight shape and the effect; the naive
'current use only' model is badly biased (it ignores accumulation/decay). Grid; dashboard
shape; bilingual.
"""
from __future__ import annotations

import numpy as np
import pytest

import wce_gen
import wce_core
import wce_assumptions


def _demo():
    return wce_gen.generate()


def test_wce_recovers_weight_shape():
    r = wce_core.full_wce(_demo())
    w_hat = np.asarray(r["w_hat"]); w_true = np.asarray(r["w_true"])
    # recovers a decaying shape that tracks the truth
    assert np.corrcoef(w_hat, w_true)[0, 1] > 0.8
    assert w_hat[0] > w_hat[-1]                          # recent weighted more than distant


def test_wce_recovers_effect_better_than_naive_current():
    r = wce_core.full_wce(_demo())
    # WCE HR is close to the truth; the naive current-use HR is badly biased low
    assert abs(r["hr_wce"] - r["hr_true"]) < 0.4
    assert r["hr_current"] < r["hr_true"] - 0.6          # current-use clearly under-states
    assert abs(r["hr_wce"] - r["hr_true"]) < abs(r["hr_current"] - r["hr_true"])


def test_interactive_grid_shape():
    g = wce_core._GRID
    # across decay scales, WCE stays nearer the truth than the naive current-use model
    for i in range(len(g["decay"])):
        assert abs(g["hr_wce"][i] - g["hr_true"][i]) < abs(g["hr_current"][i] - g["hr_true"][i])
    assert all(h == g["hr_true"][0] for h in g["hr_true"])   # truth constant


def test_grid_matches_recompute():
    g = wce_core._recompute_grid(n=700)
    for a, b in zip(g["hr_wce"], wce_core._GRID["hr_wce"]):
        assert abs(a - b) < 0.4, f"grid drift: {a} vs {b}"


def test_interactive_reading_bilingual():
    zh = wce_core.wce_interactive(6.0, lang="zh")
    en = wce_core.wce_interactive(6.0, lang="en")
    assert zh["reading"] != en["reading"]
    assert zh["hr_true"] == en["hr_true"]


def test_dashboard_shape():
    d = wce_assumptions.run_dashboard(_demo(), lang="zh")
    ids = [c["id"] for c in d["checks"]]
    assert ids == ["C1", "C2", "C3", "C4", "C5"]
    for c in d["checks"]:
        assert c["status"] in ("green", "amber", "red", "info")
        assert c["title"] and c["headline"] and c["plain"] and c["term"]


def test_interpretation_bilingual():
    zh = wce_core.full_wce(_demo(), lang="zh")["interpretation"]
    en = wce_core.full_wce(_demo(), lang="en")["interpretation"]
    assert zh != en and len(zh) > 40 and len(en) > 40


if __name__ == "__main__":
    import sys
    sys.exit(pytest.main([__file__, "-q"]))
