"""Tests for the Mediation (MED) method backend."""
import numpy as np

import med_gen
import med_core
import med_assumptions


def test_decomposition_recovers_truth_and_sums():
    df = med_gen.generate()
    r = med_core.full_med(df, n_boot=0)
    # NDE + NIE = TE (identity of the decomposition)
    assert abs((r["nde"] + r["nie"]) - r["te"]) < 1e-6
    # recovers the known truths within tolerance
    assert abs(r["nde"] - med_gen.TRUE_NDE) < 0.1
    assert abs(r["nie"] - med_gen.TRUE_NIE) < 0.1
    assert abs(r["te"] - med_gen.TRUE_TE) < 0.12
    # proportion mediated is sensible (about half)
    assert 0.35 < r["pm"] < 0.7


def test_naive_direct_is_biased_under_interaction():
    df = med_gen.generate()
    r = med_core.full_med(df, n_boot=0)
    # the naive 'Y~A+M' direct effect differs from the true NDE because of the A×M interaction
    assert abs(r["naive_direct"] - med_gen.TRUE_NDE) > abs(r["nde"] - med_gen.TRUE_NDE)


def test_interactive_grid_monotonic():
    g = med_core._GRID
    nie = [abs(v) for v in g["nie"]]
    pm = g["pm"]
    # stronger mediator pathway → larger indirect effect and larger proportion mediated
    assert nie == sorted(nie)
    assert pm == sorted(pm)
    # direct effect stays roughly constant relative to how much the indirect grows
    assert abs(g["nde"][-1] - g["nde"][0]) < abs(g["nie"][-1] - g["nie"][0])


def test_interactive_endpoints():
    lo = med_core.med_interactive(0.0)
    hi = med_core.med_interactive(1.5)
    assert abs(lo["nie"]) < abs(hi["nie"])
    assert lo["pm"] < hi["pm"]


def test_dashboard_shape_and_bilingual():
    df = med_gen.generate()
    d_zh = med_assumptions.run_dashboard(df, lang="zh")
    d_en = med_assumptions.run_dashboard(df, lang="en")
    ids = [c["id"] for c in d_zh["checks"]]
    assert ids == ["C1", "C2", "C3", "C4", "C5"]
    for c in d_zh["checks"]:
        assert c["status"] in ("green", "amber", "red", "info")
        assert c["title"] and c["plain"]
    # bilingual: interpretation differs by language
    assert d_zh["checks"][0]["plain"] != d_en["checks"][0]["plain"]


def test_full_med_bilingual():
    df = med_gen.generate()
    rz = med_core.full_med(df, n_boot=0, lang="zh")
    re = med_core.full_med(df, n_boot=0, lang="en")
    assert rz["interpretation"] != re["interpretation"]


def test_ml_recovers_nonlinear_mediation_better_than_linear():
    import med_ml
    r = med_ml.natural_effects_ml_demo()
    # under a non-linear mediator→outcome surface, ML's NIE is closer to the truth than linear's
    assert abs(r["nie_ml"] - r["nie_true"]) < abs(r["nie_lin"] - r["nie_true"])
    # and the gap is meaningful (linear is clearly biased)
    assert abs(r["nie_lin"] - r["nie_true"]) > 0.1
