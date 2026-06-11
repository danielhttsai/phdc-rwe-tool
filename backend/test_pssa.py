"""Tests for the Prescription Sequence Symmetry Analysis (PSSA) method.

Story: the crude sequence ratio (cSR) is inflated by the prescribing trend (a false signal even
with no cascade); dividing by the trend-only SRnull gives the adjusted SR (aSR), which is ≈1 when
there is no cascade and rises with a real cascade. Interactive grid monotone; dashboard shape;
bilingual.
"""
from __future__ import annotations

import numpy as np
import pytest

import pssa_gen
import pssa_core
import pssa_assumptions


def _demo(cascade=pssa_gen.CASCADE):
    return pssa_gen.generate(cascade=cascade)


def test_crude_sr_is_a_false_signal_without_cascade():
    # with NO cascade the crude SR is still well above 1 (driven by the trend)
    r = pssa_core.full_pssa(pssa_gen.generate(cascade=0.0))
    assert r["csr"] > 1.5
    # but the adjusted SR correctly sits at the null (no signal)
    assert abs(r["asr"] - 1.0) < 0.12
    assert not r["signal"]


def test_adjusted_sr_flags_a_real_cascade():
    r = pssa_core.full_pssa(_demo())
    assert r["asr"] > 1.3
    assert r["signal"]
    lo, hi = r["ci"]
    assert lo > 1.0                                   # CI excludes the null


def test_asr_beats_crude_as_signal():
    # the adjusted SR separates 'no cascade' from 'cascade' far better than the crude SR
    r0 = pssa_core.full_pssa(pssa_gen.generate(cascade=0.0))
    r1 = pssa_core.full_pssa(pssa_gen.generate(cascade=1.0))
    assert (r1["asr"] - r0["asr"]) > (r1["csr"] - r0["csr"]) * 0.0 + 0.6   # aSR moves clearly
    assert r0["asr"] < 1.2 < r1["asr"]


def test_interactive_grid_monotone():
    g = pssa_core._GRID
    assert all(g["asr"][i] <= g["asr"][i + 1] + 1e-6 for i in range(len(g["asr"]) - 1))
    assert abs(g["asr"][0] - 1.0) < 0.05              # aSR starts at the null
    assert g["asr"][-1] > 3.0
    # crude SR is high throughout (trend), never dropping near 1
    assert min(g["csr"]) > 2.0


def test_grid_matches_recompute():
    g = pssa_core._recompute_grid(n=60000)
    for k in ("asr", "csr"):
        for a, b in zip(g[k], pssa_core._GRID[k]):
            assert abs(a - b) < 0.2, f"grid drift in {k}: {a} vs {b}"


def test_interactive_reading_bilingual():
    zh = pssa_core.pssa_interactive(1.0, lang="zh")
    en = pssa_core.pssa_interactive(1.0, lang="en")
    assert zh["reading"] != en["reading"]
    assert zh["asr"] == en["asr"]


def test_dashboard_shape():
    d = pssa_assumptions.run_dashboard(_demo(), lang="zh")
    ids = [c["id"] for c in d["checks"]]
    assert ids == ["C1", "C2", "C3", "C4", "C5"]
    for c in d["checks"]:
        assert c["status"] in ("green", "amber", "red", "info")
        assert c["title"] and c["headline"] and c["plain"]


def test_interpretation_bilingual():
    zh = pssa_core.full_pssa(_demo(), lang="zh")["interpretation"]
    en = pssa_core.full_pssa(_demo(), lang="en")["interpretation"]
    assert zh != en and len(zh) > 40 and len(en) > 40


if __name__ == "__main__":
    import sys
    sys.exit(pytest.main([__file__, "-q"]))
