"""Snapshot tests for the RDD modules on the built-in synthetic age-65 demo.

The demo is fictional; its design pins down: a take-up jump ~0.40 at the cutoff,
a Sharp RD ~0.72 (eligibility / ITT-like), and a Fuzzy RD ~1.80 (the true LATE
for compliers at the cutoff, matching the IV tabs).
"""
import numpy as np

import rdd_core
import rdd_survival
import rdd_assumptions
from rdd_gen import generate, COVARIATES

X, Y, D, C = "age", "health_score_change", "vaccinated", 65.0


def _df():
    return generate()  # fixed SEED/N -> deterministic


def _arrays(df):
    return (df[X].values, df[Y].values, df[D].values)


def test_default_bandwidth_in_range():
    df = _df()
    h = rdd_core.default_bandwidth(df[X].values, C)
    assert 4.0 <= h <= 10.0


def test_takeup_jump_about_040():
    df = _df()
    x, _, d = _arrays(df)
    h = rdd_core.default_bandwidth(x, C)
    res = rdd_core.sharp_rd(x, d, C, h)
    assert abs(res["estimate"] - 0.40) < 0.08


def test_sharp_rd_eligibility_effect():
    df = _df()
    x, y, _ = _arrays(df)
    h = rdd_core.default_bandwidth(x, C)
    res = rdd_core.sharp_rd(x, y, C, h)
    assert abs(res["estimate"] - 0.72) < 0.20      # ITT-like eligibility effect


def test_fuzzy_rd_recovers_true_late():
    df = _df()
    x, y, d = _arrays(df)
    h = rdd_core.default_bandwidth(x, C)
    res = rdd_core.fuzzy_rd(x, y, d, C, h)
    assert abs(res["estimate"] - 1.80) < 0.30      # true LATE = 1.80


def test_fuzzy_below_naive_difference():
    df = _df()
    out = rdd_core.full_rdd(df, X, Y, D, C)
    assert out["fuzzy"]["estimate"] < out["naive_difference"]  # confounding inflates naive


def test_full_rdd_payload_shape():
    df = _df()
    out = rdd_core.full_rdd(df, X, Y, D, C)
    for key in ("cutoff", "h", "sharp", "fuzzy", "takeup", "naive_difference",
                "plot", "takeup_plot", "bandwidth_curve"):
        assert key in out
    assert out["fuzzy"] is not None


def test_density_test_no_manipulation():
    df = _df()
    dt = rdd_core.density_test(df[X].values, C)
    assert dt["p"] > 0.05                           # age cannot be manipulated


def test_covariates_balanced():
    df = _df()
    h = rdd_core.default_bandwidth(df[X].values, C)
    cc = rdd_core.covariate_continuity(df, X, COVARIATES, C, h)
    assert cc["n_imbalanced"] == 0


def test_survival_ipcw_above_naive():
    df = _df()
    naive = rdd_survival.naive_survival_rd(df, X, "event_time", C)
    sharp = rdd_survival.survival_rd(df, X, "event_time", "event", C)
    # vaccination lowers the hazard -> eligibility raises event-free time;
    # ignoring censoring underestimates it
    assert sharp["estimate"] > naive["estimate"]


def test_dashboard_status_shape():
    df = _df()
    h = rdd_core.default_bandwidth(df[X].values, C)
    dash = rdd_assumptions.run_dashboard(df, X, Y, D, C, h, COVARIATES, fuzzy=True)
    ids = [c["id"] for c in dash["checks"]]
    assert ids == ["R1", "R2", "R3", "R4", "R5"]
    by_id = {c["id"]: c["status"] for c in dash["checks"]}
    assert by_id["R2"] == "green"                   # no manipulation
    assert by_id["R3"] == "green"                   # balanced covariates
    assert by_id["R4"] == "green"                   # strong first stage


def test_dashboard_bilingual():
    df = _df()
    h = rdd_core.default_bandwidth(df[X].values, C)
    zh = rdd_assumptions.run_dashboard(df, X, Y, D, C, h, COVARIATES, lang="zh")
    en = rdd_assumptions.run_dashboard(df, X, Y, D, C, h, COVARIATES, lang="en")
    assert zh["checks"][0]["headline"] != en["checks"][0]["headline"]
