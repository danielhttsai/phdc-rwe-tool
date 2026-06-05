"""Tests for the case-control method (cc_gen / cc_core / cc_assumptions / cc_ml)."""
from __future__ import annotations

import numpy as np

import cc_gen
import cc_core
import cc_assumptions


def test_crude_is_confounded_adjustment_recovers_truth():
    df = cc_gen.generate()
    r = cc_core.full_cc(df)
    # crude OR is biased upward by age confounding; adjusted & MH recover ~truth
    assert r["crude_or"] > r["adj_or"] + 0.5
    assert abs(r["adj_or"] - r["true_or"]) < 0.25
    assert abs(r["mh_or"] - r["true_or"]) < 0.35
    # the bias is real: |crude - truth| >> |adjusted - truth|
    assert abs(r["crude_or"] - r["true_or"]) > abs(r["adj_or"] - r["true_or"]) + 0.4


def test_cases_older_than_controls():
    df = cc_gen.generate()
    r = cc_core.full_cc(df)
    assert r["age_balance"]["case"] > r["age_balance"]["control"] + 3


def test_interactive_confounding_monotone():
    g = cc_core._CONF_GRID
    # crude OR rises monotonically with confounding strength; adjusted stays near truth
    assert all(g["crude"][i] <= g["crude"][i + 1] + 1e-6 for i in range(len(g["crude"]) - 1))
    assert all(abs(a - g["true_or"]) < 0.25 for a in g["adj"])
    lo = cc_core.cc_interactive(0.0); hi = cc_core.cc_interactive(1.5)
    assert hi["crude_or"] > lo["crude_or"] + 1.0


def test_targettrial_demo_shapes():
    d = cc_core.cc_targettrial_demo()
    assert d["naive_or"] < 0.8 and abs(d["emulated_or"] - d["cohort_or"]) < 0.1
    assert "reading" in d


def test_external_demo_narrows_ci():
    d = cc_core.cc_external_demo()
    assert d["se_ext"] < d["se_base"]
    assert d["ci_width_ext"] < d["ci_width_base"]


def test_assumptions_shape():
    df = cc_gen.generate()
    out = cc_assumptions.run_dashboard(df)
    ids = [c["id"] for c in out["checks"]]
    assert ids == ["C1", "C2", "C3", "C4", "C5"]
    for c in out["checks"]:
        assert c["status"] in ("green", "amber", "red", "info")
        assert c["title"] and c["headline"] and c["plain"]
    # C3 (confounding) should fire amber on the confounded demo data
    c3 = [c for c in out["checks"] if c["id"] == "C3"][0]
    assert c3["status"] == "amber"


def test_bilingual_interpretation_differs():
    df = cc_gen.generate()
    zh = cc_core.full_cc(df, lang="zh")["interpretation"]
    en = cc_core.full_cc(df, lang="en")["interpretation"]
    assert zh != en and len(zh) > 20 and len(en) > 20


def test_ml_demo_real_sklearn_beats_linear():
    cc_ml = __import__("cc_ml")
    m = cc_ml.matched_forest_demo()
    # random forest captures the interaction -> clearly higher AUC than linear
    assert m["auc_rf"] > m["auc_linear"] + 0.08
    assert len(m["importance"]) == 4
