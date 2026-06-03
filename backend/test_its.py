"""Tests for the Interrupted Time Series core, assumptions and ⑤ demos."""
import numpy as np

import its_gen
import its_core
import its_assumptions
import its_ml


def test_recovers_level_and_slope():
    df = its_gen.generate()
    out = its_core.full_its(df)
    assert abs(out["level"]["estimate"] - its_gen.TRUE_LEVEL) < 2.5
    assert abs(out["slope"]["estimate"] - its_gen.TRUE_SLOPE) < 0.3
    assert abs(out["baseline"] - its_gen.B0) < 3
    assert out["level"]["se"] > 0


def test_hac_se_exceeds_ols_under_autocorrelation():
    df = its_gen.generate(ar=0.7, noise=2.5)
    fit = its_core.segmented(df)
    assert fit["se_hac"]["level"] > fit["se_ols"]["level"]
    assert abs(fit["acf1"]) > 0.2


def test_interactive_tracks_the_level():
    for lv in (-20.0, 0.0, 15.0):
        df = its_gen.generate(level=lv)
        out = its_core.full_its(df)
        assert abs(out["level"]["estimate"] - lv) < 3.0


def test_dashboard_shape_and_statuses():
    df = its_gen.generate()
    dash = its_assumptions.run_dashboard(df)
    ids = [c["id"] for c in dash["checks"]]
    assert ids == ["I1", "I2", "I3", "I4", "I5"]
    for c in dash["checks"]:
        assert c["status"] in ("green", "amber", "red", "info")
        assert c["title"] and c["headline"] and c["plain"] and c["term"]
    assert dash["checks"][0]["status"] == "info"          # I1 untestable
    # strong autocorrelation -> I4 red
    bad = its_assumptions.run_dashboard(its_gen.generate(ar=0.75))
    assert bad["checks"][3]["status"] == "red"


def test_boost_demos():
    d = its_ml.boost_demos(seed=7)
    # HAC SE wider than OLS SE
    assert d["hac"]["se_hac"] > d["hac"]["se_ols"]
    # controlled removes the coincident shock better than uncontrolled
    assert abs(d["controlled"]["controlled"] - d["controlled"]["true_level"]) < \
           abs(d["controlled"]["uncontrolled"] - d["controlled"]["true_level"])
    # flexible counterfactual beats straight-line on a curved pre-trend
    assert abs(d["flexible"]["flexible"] - d["flexible"]["true_level"]) < \
           abs(d["flexible"]["linear"] - d["flexible"]["true_level"])
    assert d["bsts"]["concept"] is True


def test_bilingual_interpretation():
    df = its_gen.generate()
    zh = its_core.full_its(df, lang="zh")
    en = its_core.full_its(df, lang="en")
    assert zh["interpretation"] != en["interpretation"]
    assert "level" in en["interpretation"].lower()
