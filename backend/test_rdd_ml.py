"""Tests for the RDD ⑤ "boost with AI" demos (rdd_ml).

These pin the two teaching messages:
  藥方一  the plain within-window comparison DRIFTS as the window widens, while
          the cross-fitted DML estimate STAYS near the true 1.80 at any window.
  藥方二  ignoring censoring is biased; IPCW + a flexible doubly-robust outcome
          model give a tighter, steadier estimate (and a sensible payload shape).
"""
import numpy as np

import rdd_ml


# ----------------------------- 藥方一: DML ------------------------------------
def test_bandwidth_payload_shape():
    d = rdd_ml.dml_bandwidth_demo(window=8.0)
    for key in ("true_effect", "n", "window", "conventional", "dml", "curve"):
        assert key in d
    assert d["true_effect"] == 1.80
    for key in ("window", "conv", "conv_lo", "conv_hi", "dml", "dml_lo", "dml_hi"):
        assert key in d["curve"]
        assert len(d["curve"][key]) == len(d["curve"]["window"])


def test_dml_recovers_truth_at_wide_window():
    d = rdd_ml.dml_bandwidth_demo(window=16.0)
    assert abs(d["dml"]["estimate"] - 1.80) < 0.4          # robust to a wide window
    assert d["conventional"]["estimate"] > 1.80 + 1.0      # plain comparison drifts up


def test_conventional_drifts_more_than_dml_across_windows():
    d = rdd_ml.dml_bandwidth_demo(window=8.0)
    conv = np.array(d["curve"]["conv"], dtype=float)
    dml = np.array(d["curve"]["dml"], dtype=float)
    # spread of the conventional estimate across windows >> that of DML
    assert conv.max() - conv.min() > 5.0
    assert dml.max() - dml.min() < 1.2
    # DML stays close to the truth on average; conventional does not
    assert abs(np.mean(dml) - 1.80) < 0.4
    assert np.mean(conv) > 1.80 + 1.5


def test_bandwidth_deterministic():
    a = rdd_ml.dml_bandwidth_demo(window=8.0, seed=7)
    b = rdd_ml.dml_bandwidth_demo(window=8.0, seed=7)
    assert a["dml"]["estimate"] == b["dml"]["estimate"]


# --------------------------- 藥方二: survival ---------------------------------
def test_survival_payload_shape():
    d = rdd_ml.survival_robust_demo()
    assert "bars" in d and "cens_rate" in d and "n" in d
    keys = [b["key"] for b in d["bars"]]
    assert keys[0] == "naive"
    assert "ipcw" in keys and "cox" in keys and "lognorm" in keys
    for b in d["bars"]:
        assert "label" in b and "estimate" in b and "ci" in b and "note" in b


def test_doubly_robust_tighter_than_ipcw():
    d = rdd_ml.survival_robust_demo()
    bars = {b["key"]: b for b in d["bars"]}
    width = lambda b: b["ci"][1] - b["ci"][0]
    # the DR outcome-model versions are at least as tight as IPCW alone
    assert width(bars["cox"]) <= width(bars["ipcw"]) + 1e-9
    # and the two DR versions agree closely (the robustness/stability message)
    assert abs(bars["cox"]["estimate"] - bars["lognorm"]["estimate"]) < 0.6


def test_survival_bilingual():
    zh = rdd_ml.survival_robust_demo(lang="zh")
    en = rdd_ml.survival_robust_demo(lang="en")
    assert zh["bars"][0]["label"] != en["bars"][0]["label"]
