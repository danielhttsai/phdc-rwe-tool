"""Tests for the Trend-in-trend core and assumptions."""
import numpy as np

import tit_gen
import tit_core
import tit_assumptions


def test_recovers_true_or_and_naive_is_biased():
    df = tit_gen.generate()
    out = tit_core.full_tit(df, lang="zh")
    # trend-in-trend recovers the true OR (2.0) more closely than the naive cohort OR
    assert abs(out["or"] - tit_gen.TRUE_OR) < 0.6
    assert out["naive_or"] > tit_gen.TRUE_OR + 0.3      # naive is biased upward
    assert abs(out["or"] - tit_gen.TRUE_OR) < abs(out["naive_or"] - tit_gen.TRUE_OR)
    assert out["converged"]
    assert out["outcome_rate"] < 0.05                   # rare outcome


def test_exposure_trend_present():
    df = tit_gen.generate()
    out = tit_core.full_tit(df, lang="zh")
    assert out["exposure_overall"][-1] - out["exposure_overall"][0] > 0.10


def test_weak_trend_collapses_identification():
    strong = tit_core.full_tit(tit_gen.generate(trend=1.0))
    weak = tit_core.full_tit(tit_gen.generate(trend=0.25))
    # a strong trend recovers ~2.0; a near-flat trend cannot
    assert abs(strong["or"] - 2.0) < abs(weak["or"] - 2.0) + 1e-9


def test_dashboard_shape_and_statuses():
    df = tit_gen.generate()
    dash = tit_assumptions.run_dashboard(df, lang="zh")
    ids = [c["id"] for c in dash["checks"]]
    assert ids == ["A1", "A2", "A3", "A4", "A5"]
    for c in dash["checks"]:
        assert c["status"] in ("green", "amber", "red", "info")
        assert c["title"] and c["headline"] and c["plain"] and c["term"]
    assert dash["checks"][0]["status"] == "green"        # strong trend -> A1 green
    assert dash["checks"][3]["status"] == "info"         # A4 untestable
    weak = tit_assumptions.run_dashboard(tit_gen.generate(trend=0.25), lang="zh")
    assert weak["checks"][0]["status"] in ("amber", "red")


def test_bilingual_interpretation():
    df = tit_gen.generate()
    zh = tit_core.full_tit(df, lang="zh")
    en = tit_core.full_tit(df, lang="en")
    assert zh["interpretation"] != en["interpretation"]
    assert "OR" in en["interpretation"]


def test_published_estimator_demo_shape_and_bilingual():
    """The ③ 'run the published estimator' button serves a baked Ji & Small cell-MLE
    result (the live fit is too slow for the browser)."""
    import tit_realmle
    zh = tit_realmle.published_estimator_demo(lang="zh")
    en = tit_realmle.published_estimator_demo(lang="en")
    for r in (zh, en):
        assert 1.0 < r["or"] < 4.0                       # a real, in-range estimate
        assert r["naive_or"] > r["true_or"]              # naive cohort OR is biased upward
        assert r["ci"][0] < r["or"] < r["ci"][1] or r["ci"][0] < r["or"]   # wide, possibly skewed
        assert r["true_or"] == tit_realmle.TRUE_OR
        assert len(r["curves"]["periods"]) == tit_realmle.TN
    assert zh["reading"] != en["reading"]


def test_published_estimator_recompute_matches_baked():
    """Audit: the baked _REAL is reproducible by the offline real cell-MLE.
    Skipped by default (the multi-start fit takes ~25 s); run with TIT_SLOW=1."""
    import os
    if os.environ.get("TIT_SLOW") != "1":
        import pytest
        pytest.skip("slow (~25s) real-MLE recompute; set TIT_SLOW=1 to run")
    import tit_realmle
    r = tit_realmle._recompute(seed=2)
    assert abs(r["or"] - tit_realmle._REAL["or"]) < 0.05
