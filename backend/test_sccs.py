"""Tests for the SCCS method (sccs_gen / sccs_core / sccs_assumptions / sccs_ml)."""
from __future__ import annotations

import numpy as np

import sccs_gen
import sccs_core
import sccs_assumptions


def test_conditional_poisson_recovers_irr():
    df = sccs_gen.generate()
    r = sccs_core.full_sccs(df)
    assert abs(r["irr"] - r["true_irr"]) < 0.3
    assert r["ci"][0] < r["true_irr"] < r["ci"][1]


def test_immune_to_timefixed_confounding():
    # SCCS line is flat across healthy-vaccinee strength; naive drifts away
    g = sccs_core._HV_GRID
    assert all(abs(s - g["true_irr"]) < 0.1 for s in g["sccs"])
    lo = sccs_core.sccs_interactive(0.0); hi = sccs_core.sccs_interactive(1.5)
    assert abs(hi["sccs"] - g["true_irr"]) < 0.1            # SCCS unmoved
    assert hi["naive"] < lo["naive"] - 1.0                  # naive dragged down by selection


def test_risk_window_is_small_slice():
    df = sccs_gen.generate()
    r = sccs_core.full_sccs(df)
    # the risk window is only a small fraction of each person's observation
    assert r["pt_risk"] < r["pt_base"]
    assert r["n_risk"] >= 50


def test_assumptions_shape():
    df = sccs_gen.generate()
    out = sccs_assumptions.run_dashboard(df)
    ids = [c["id"] for c in out["checks"]]
    assert ids == ["C1", "C2", "C3", "C4", "C5"]
    for c in out["checks"]:
        assert c["status"] in ("green", "amber", "red", "info")
        assert c["title"] and c["headline"] and c["plain"]
    c5 = [c for c in out["checks"] if c["id"] == "C5"][0]
    assert c5["status"] == "green"


def test_bilingual_interpretation_differs():
    df = sccs_gen.generate()
    zh = sccs_core.full_sccs(df, lang="zh")["interpretation"]
    en = sccs_core.full_sccs(df, lang="en")["interpretation"]
    assert zh != en and len(zh) > 20 and len(en) > 20


def test_ml_demo_real_sklearn_finds_subgroup():
    import sccs_ml
    m = sccs_ml.self_matched_demo()
    # the forest-flagged high-risk subgroup IRR is well above the pooled IRR and the rest
    assert m["irr_high"] > m["pooled_irr"] + 1.0
    assert m["irr_high"] > m["irr_low"] + 1.0
    assert m["auc_rf"] > 0.55
    assert len(m["importance"]) == 3
