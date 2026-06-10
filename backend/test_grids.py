"""Drift guard for the offline-precomputed ② interactive grids.

Several methods bake their truth / interactive-grid values as constants in `*_core.py`
(`_GRID`, `_TRUTH_GRID`) so the browser (Pyodide) does not recompute a heavy Monte-Carlo
sweep on every slider move. The risk: if the data generator (`*_gen.py`) is later changed,
the baked grid silently disagrees with what the live ③ estimator would now produce.

Each test below re-runs the method's own offline recompute function at a REDUCED sample
size and asserts it still matches the baked grid within a tolerance comfortably above the
Monte-Carlo noise of the smaller n, but far below the shift a real parameter change causes
(~0.3+). So: passes on noise, fails loudly on genuine drift.

(sccs has no recompute function — its `_HV_GRID` is a hand-authored illustrative curve with
the SCCS line flat at the truth by construction — so it is intentionally not covered here.)
"""
from __future__ import annotations

import numpy as np


def _cmp(recomputed: dict, baked: dict, atol: float, label: str):
    keys = [k for k in baked if isinstance(baked[k], list) and isinstance(recomputed.get(k), list)]
    assert keys, f"{label}: no comparable list keys"
    for k in keys:
        a = np.asarray(recomputed[k], dtype=float)
        b = np.asarray(baked[k], dtype=float)
        assert a.shape == b.shape, f"{label}.{k}: shape {a.shape} != baked {b.shape}"
        d = float(np.max(np.abs(a - b)))
        assert d <= atol, f"{label}.{k}: grid drifted by {d:.3f} > {atol} (baked grid stale vs generator?)"


def test_ps_grid_matches_recompute():
    import ps_core
    _cmp(ps_core._recompute_grid(n=8000), ps_core._GRID, atol=0.15, label="ps._GRID")


def test_nc_grid_matches_recompute():
    import nc_core
    _cmp(nc_core._recompute_grid(n=8000), nc_core._GRID, atol=0.22, label="nc._GRID")


def test_med_grid_matches_recompute():
    import med_core
    _cmp(med_core._recompute_grid(n=10000), med_core._GRID, atol=0.15, label="med._GRID")


def test_acnu_grid_matches_recompute():
    import acnu_core
    _cmp(acnu_core._recompute_grid(n=15000), acnu_core._GRID, atol=0.28, label="acnu._GRID")


def test_pnu_grid_matches_recompute():
    import pnu_core
    _cmp(pnu_core._recompute_grid(n_each=4000), pnu_core._GRID, atol=0.12, label="pnu._GRID")


def test_ccw_truth_grid_matches_recompute():
    import ccw_core
    te_list = ccw_core._TRUTH_GRID_X
    for scenario, baked in ccw_core._TRUTH_GRID.items():
        got = [ccw_core._estimand_truth_sim(timing_effect=te, scenario=scenario, n=8000) for te in te_list]
        d = float(np.max(np.abs(np.asarray(got, float) - np.asarray(baked, float))))
        assert d <= 0.06, f"ccw._TRUTH_GRID[{scenario}]: drifted by {d:.3f} > 0.06 (stale vs generator?)"


if __name__ == "__main__":
    import sys
    import pytest
    sys.exit(pytest.main([__file__, "-q"]))
