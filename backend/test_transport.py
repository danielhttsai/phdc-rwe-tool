import transport_core as tc
import transport_assumptions as ta


def test_transport_recovers_target():
    o = tc.full_transport(mu_target=0.5, lang="zh")
    assert abs(o["standardize"] - o["truth"]) < 0.25
    assert abs(o["iosw"] - o["truth"]) < 0.40


def test_naive_is_biased():
    o = tc.full_transport(mu_target=0.5, lang="zh")
    # study effect (naive) is off because the modifier distribution differs
    assert abs(o["naive"] - o["truth"]) > abs(o["standardize"] - o["truth"]) + 0.2


def test_no_gap_no_bias():
    # if the target's modifier mean equals the study's, the naive effect is fine
    o = tc.full_transport(mu_target=tc.full_transport()["mu_study"], lang="zh")
    assert abs(o["naive"] - o["truth"]) < 0.25


def test_grid_monotonic():
    diffs = []
    for mt in [-0.6, 0.0, 0.6, 1.2]:
        o = tc.full_transport(mu_target=mt, lang="zh")
        diffs.append(abs(o["naive"] - o["truth"]))
    # naive bias grows as the target drifts away from the study mean (-0.6)
    assert diffs[3] > diffs[0]


def test_dashboard_shape():
    d = ta.run_dashboard(mu_target=0.5, lang="zh")
    assert d["overall_status"] in ("green", "amber", "red", "info")
    assert len(d["checks"]) == 5


def test_bilingual():
    zh = tc.full_transport(mu_target=0.5, lang="zh")
    en = tc.full_transport(mu_target=0.5, lang="en")
    assert zh["reading"] != en["reading"]
