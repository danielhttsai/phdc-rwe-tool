import missing_core as mc
from missing_gen import TRUE_TAU


def test_truth_recovers_tau():
    out = mc.full_missing(p=0.3, mechanism="MCAR", lang="zh")
    assert abs(out["truth"] - TRUE_TAU) < 0.25


def test_naive_is_confounded():
    out = mc.full_missing(p=0.3, mechanism="MCAR", lang="zh")
    assert out["naive"] - out["truth"] > 0.2          # naive over-states the effect


def test_mean_imputation_biased_mcar():
    out = mc.full_missing(p=0.45, mechanism="MCAR", lang="zh")
    # mean imputation drifts toward the naive value; MI stays near truth
    assert abs(out["mean_impute"] - out["truth"]) > abs(out["multiple_imputation"] - out["truth"])


def test_mi_recovers_under_mar():
    out = mc.full_missing(p=0.45, mechanism="MAR", lang="zh")
    assert abs(out["multiple_imputation"] - out["truth"]) < 0.3
    # complete-case is selecting on Y under MAR → further from truth than MI
    assert abs(out["complete_case"] - out["truth"]) > abs(out["multiple_imputation"] - out["truth"])


def test_bilingual():
    zh = mc.full_missing(p=0.3, mechanism="MAR", lang="zh")
    en = mc.full_missing(p=0.3, mechanism="MAR", lang="en")
    assert zh["reading"] != en["reading"]
    assert "complete-case" in en["reading"].lower() or "complete" in en["reading"].lower()


def test_shape():
    out = mc.missing_interactive(0.4, "MCAR", "zh")
    for k in ["truth", "naive", "complete_case", "mean_impute", "multiple_imputation", "missing_rate"]:
        assert k in out
