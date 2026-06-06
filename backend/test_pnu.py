"""Tests for the Prevalent New-User (PNU) method."""
from __future__ import annotations

import pnu_gen
import pnu_core
import pnu_assumptions


def test_pnu_recovers_truth_and_naive_is_biased():
    df = pnu_gen.generate()
    r = pnu_core.full_pnu(df)
    truth = r["true_hr"]
    # PNU (time-conditional) and the new-user-only benchmark both land near the truth
    assert abs(r["pnu_hr"] - truth) < 0.15
    assert abs(r["newuser_hr"] - truth) < 0.15
    # the naive prevalent contrast is clearly more biased (depletion pulls it toward the null)
    assert abs(r["naive_hr"] - truth) > abs(r["pnu_hr"] - truth) + 0.3
    assert r["naive_hr"] < r["pnu_hr"]                     # biased toward the null
    # PNU brings the prevalent users back → uses more people than new-user-only
    assert r["n_pnu"] > r["n_new"]
    assert r["n_prevalent"] > 0


def test_depletion_shows_in_frailty_balance():
    df = pnu_gen.generate()
    bal = pnu_core.full_pnu(df)["frailty_balance"]
    # prevalent A users are the lower-frailty survivors (depletion of susceptibles)
    assert bal["A_prev"] < bal["A_new"] - 0.15


def test_interactive_grid_monotone():
    g = pnu_core._GRID
    # naive sinks toward the null as depletion grows; PNU & new-user-only hold the truth
    assert g["naive"][0] > g["naive"][-1] + 0.2
    assert all(abs(p - 1.7) < 0.1 for p in g["pnu"])
    assert all(abs(n - 1.7) < 0.12 for n in g["newuser"])


def test_interactive_endpoint():
    lo = pnu_core.pnu_interactive(0.0)
    hi = pnu_core.pnu_interactive(1.5)
    assert abs(hi["pnu_hr"] - hi["true_hr"]) < 0.1
    assert hi["naive_hr"] < lo["naive_hr"]                 # more depletion → more null-ward bias


def test_dashboard_shape_and_statuses():
    df = pnu_gen.generate()
    dash = pnu_assumptions.run_dashboard(df)
    checks = dash["checks"]
    assert [c["id"] for c in checks] == ["C1", "C2", "C3", "C4", "C5"]
    for c in checks:
        assert c["status"] in ("green", "amber", "red", "info")
        assert c["headline"] and c["plain"]


def test_bilingual_interpretation():
    df = pnu_gen.generate()
    zh = pnu_core.full_pnu(df, lang="zh")
    en = pnu_core.full_pnu(df, lang="en")
    assert zh["interpretation"] != en["interpretation"]


def test_ml_ps_beats_logistic():
    import pnu_ml
    r = pnu_ml.ps_ml_demo()
    truth = r["true_hr"]
    assert abs(r["irr_gb"] - truth) < abs(r["irr_logistic"] - truth)
    assert abs(r["irr_gb"] - truth) < 0.2
