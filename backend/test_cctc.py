"""Tests for the CCO/CCTC core and assumptions."""
import cctc_gen
import cctc_core
import cctc_assumptions


def test_cctc_recovers_true_or_and_cco_is_biased_under_trend():
    df = cctc_gen.generate(trend=1.0)
    out = cctc_core.full_cctc(df)
    truth = out["true_or"]
    # CCTC recovers the true OR; plain case-crossover is inflated by the trend
    assert abs(out["or_cctc"] - truth) < 0.6
    assert out["or_cco"] > truth + 1.0
    assert abs(out["or_cco"] - truth) > abs(out["or_cctc"] - truth) + 0.5
    assert out["or_trend"] > 1.2                  # the trend fingerprint
    assert out["ci_cctc"][0] < out["or_cctc"] < out["ci_cctc"][1]


def test_no_trend_means_cco_is_unbiased():
    df = cctc_gen.generate(trend=0.0)
    out = cctc_core.full_cctc(df)
    # with no calendar trend, CCO is already unbiased and ≈ CCTC ≈ truth
    assert abs(out["or_cco"] - out["true_or"]) < 0.6
    assert abs(out["or_trend"] - 1.0) < 0.2


def test_stronger_trend_inflates_cco_more():
    weak = cctc_core.full_cctc(cctc_gen.generate(trend=0.5))
    strong = cctc_core.full_cctc(cctc_gen.generate(trend=1.5))
    assert strong["or_cco"] > weak["or_cco"]
    # CCTC stays near the truth regardless of trend strength
    assert abs(strong["or_cctc"] - strong["true_or"]) < 0.7


def test_dashboard_shape_and_statuses():
    df = cctc_gen.generate()
    dash = cctc_assumptions.run_dashboard(df)
    ids = [c["id"] for c in dash["checks"]]
    assert ids == ["C1", "C2", "C3", "C4", "C5"]
    for c in dash["checks"]:
        assert c["status"] in ("green", "amber", "red", "info")
        assert c["title"] and c["headline"] and c["plain"] and c["term"]
    assert dash["checks"][4]["status"] == "green"   # plenty of discordant pairs


def test_demo_shape():
    s = cctc_core.cctc_demo()
    assert s["cco"] > s["true_or"]                  # CCO inflated
    assert abs(s["ctc"] - s["true_or"]) < 0.8
    assert abs(s["casecase"] - s["true_or"]) < 0.8


def test_bilingual_interpretation():
    df = cctc_gen.generate()
    zh = cctc_core.full_cctc(df, lang="zh")
    en = cctc_core.full_cctc(df, lang="en")
    assert zh["interpretation"] != en["interpretation"]
    assert "CCTC" in en["interpretation"]
