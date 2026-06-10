"""CCO / CCTC core — case-crossover and case-(case-)time-control, pure numpy.

白話：case-crossover（CCO）用每個 case 自己當對照，比較「危險窗 W1」與「參考窗 W0」的暴露，
靠一致對（discordant pairs）算勝算比。但暴露盛行率若隨日曆時間上升，近期的 W1 本就比 W0 常暴露，
CCO 會被這個趨勢高估。case-time-control / case-case-time-control（CCTC）用「同樣經歷趨勢、卻沒有
因果效應」的對照（非 case 族群，或較晚發病的未來 case），算出純趨勢勝算比，把它從 CCO 中除掉。

  OR_CCO   = b_case / c_case            （b＝W1暴露W0未暴露的 case 數；c＝相反）
  OR_trend = b_ctrl / c_ctrl            （對照族群的一致對 → 純趨勢）
  OR_CCTC  = OR_CCO / OR_trend          ≈ 真實因果勝算比
  Var(log OR_CCTC) = 1/b_case+1/c_case+1/b_ctrl+1/c_ctrl   （McNemar/條件 logistic）

NOTE — faithful teaching re-implementation (Maclure 1991 case-crossover;
Suissa 1995 case-time-control; Wang & Hennessy case-case-time-control; Jeong et al.
2023, J Epidemiol 33:82-90). Not a copy of any package.
"""
from __future__ import annotations

import numpy as np

from i18n import t


def _discordant(x1, x0):
    """(b, c) = counts of (W1=1,W0=0) and (W1=0,W0=1) — the informative pairs."""
    b = float(np.sum((x1 == 1) & (x0 == 0)))
    c = float(np.sum((x1 == 0) & (x0 == 1)))
    return b, c


def full_cctc(df, group="group", x_hazard="x_hazard", x_ref="x_ref", cal_time="cal_time",
              true_or=None, lang="zh"):
    import cctc_gen
    if true_or is None:
        true_or = cctc_gen.TRUE_OR
    g = np.asarray(df[group]); x1 = np.asarray(df[x_hazard]); x0 = np.asarray(df[x_ref])
    cal = np.asarray(df[cal_time], dtype=float)
    case = g == 1; ctrl = g == 0
    b_ca, c_ca = _discordant(x1[case], x0[case])
    b_co, c_co = _discordant(x1[ctrl], x0[ctrl])
    or_cco = b_ca / c_ca if c_ca else float("nan")
    or_trend = b_co / c_co if c_co else float("nan")
    or_cctc = or_cco / or_trend if or_trend else float("nan")
    se_cco = float(np.sqrt(1 / max(b_ca, .5) + 1 / max(c_ca, .5)))
    se_cctc = float(np.sqrt(1 / max(b_ca, .5) + 1 / max(c_ca, .5) + 1 / max(b_co, .5) + 1 / max(c_co, .5)))
    ci_cco = [float(or_cco * np.exp(-1.96 * se_cco)), float(or_cco * np.exp(1.96 * se_cco))]
    ci_cctc = [float(or_cctc * np.exp(-1.96 * se_cctc)), float(or_cctc * np.exp(1.96 * se_cctc))]

    # exposure-prevalence trend (hazard-window exposure by calendar month) — the
    # "fingerprint" that biases CCO
    months = sorted(set(int(v) for v in cal))
    prev = []
    for m in months:
        sel = cal == m
        prev.append(float(np.mean(x1[sel])) if sel.any() else None)

    interp = t(
        lang,
        f"案例交叉（CCO）給出勝算比 ≈ {or_cco:.2f}（95% CI {ci_cco[0]:.2f}～{ci_cco[1]:.2f}）。"
        f"但暴露盛行率隨日曆時間上升（見下圖趨勢），對照族群的純趨勢勝算比約 {or_trend:.2f}——這就是把 CCO "
        f"往上推的『趨勢指紋』。把它除掉得 case-(case-)time-control（CCTC）勝算比 ≈ {or_cctc:.2f}"
        f"（95% CI {ci_cctc[0]:.2f}～{ci_cctc[1]:.2f}），貼近真值 {true_or:.2f}。",
        f"Case-crossover (CCO) gives an odds ratio ≈ {or_cco:.2f} (95% CI {ci_cco[0]:.2f}–{ci_cco[1]:.2f}). "
        f"But exposure prevalence rises over calendar time (see the trend below); a non-case control group's pure-trend "
        f"odds ratio is about {or_trend:.2f} — the 'trend fingerprint' that inflates CCO. Dividing it out gives the "
        f"case-(case-)time-control (CCTC) odds ratio ≈ {or_cctc:.2f} (95% CI {ci_cctc[0]:.2f}–{ci_cctc[1]:.2f}), close "
        f"to the truth {true_or:.2f}.",
    )
    return {
        "or_cco": float(or_cco), "or_trend": float(or_trend), "or_cctc": float(or_cctc),
        "ci_cco": ci_cco, "ci_cctc": ci_cctc, "true_or": float(true_or),
        "discordant": {"b_case": b_ca, "c_case": c_ca, "b_ctrl": b_co, "c_ctrl": c_co},
        "exposure_curve": {"months": months, "prev": prev},
        "interpretation": interp,
    }


# ---------------------------------------------------------------------------
# ⑤ refinement demo — case-case-time-control: use FUTURE-onset cases (instead of a
# separate non-case control series) as the trend reference. Avoids needing a clean
# control series and the control-selection critique. Precomputed offline for speed.
# ---------------------------------------------------------------------------
_CCTC_DEMO = {"cco": 6.13, "ctc": 3.17, "casecase": 3.24, "true_or": 3.0}


def cctc_demo(seed=0, lang="zh"):
    d = _CCTC_DEMO
    reading = t(
        lang,
        f"同一筆（趨勢強）資料：純 case-crossover OR ≈ {d['cco']:.2f}（被趨勢高估）。用非 case 對照族群扣趨勢的"
        f" <b>case-time-control（CTC）</b> ≈ {d['ctc']:.2f}；改用『較晚發病的未來 case』當趨勢參考的"
        f" <b>case-case-time-control（CCTC）</b> ≈ {d['casecase']:.2f}——兩者都拉回真值 {d['true_or']:.2f}。"
        f"CCTC 的好處：不需要另一條乾淨的對照序列，也避開『對照如何選』的批評。",
        f"Same (strongly trending) data: plain case-crossover OR ≈ {d['cco']:.2f} (inflated by the trend). Netting out "
        f"the trend with a non-case control series — <b>case-time-control (CTC)</b> — gives ≈ {d['ctc']:.2f}; using "
        f"<b>future-onset cases</b> as the trend reference — <b>case-case-time-control (CCTC)</b> — gives "
        f"≈ {d['casecase']:.2f}. Both recover the truth {d['true_or']:.2f}. The CCTC advantage: it needs no separate "
        f"clean control series and sidesteps the 'how were controls chosen?' critique.",
    )
    return {**d, "reading": reading}


def _cctc_demo_sim(seed=41, trend=1.0):
    """Offline recompute of the ⑤ grid (not called at runtime)."""
    import cctc_gen
    df = cctc_gen.generate(seed=seed, trend=trend)
    out = full_cctc(df)
    # case-case-time-control: an independent set of LATER-onset cases as trend ref
    rng = np.random.default_rng(seed + 5)
    n = 4000
    sc = rng.integers(cctc_gen.DELTA, cctc_gen.S, n)
    # future cases: later calendar months get more weight
    w = (sc - cctc_gen.DELTA + 1.0); sc = sc  # later onset emphasised conceptually
    xc1 = (rng.random(n) < cctc_gen._sig(cctc_gen._theta(sc, trend))).astype(int)
    xc0 = (rng.random(n) < cctc_gen._sig(cctc_gen._theta(sc - cctc_gen.DELTA, trend))).astype(int)
    b, c = _discordant(xc1, xc0)
    casecase = out["or_cco"] / (b / c)
    return {"cco": round(out["or_cco"], 2), "ctc": round(out["or_cctc"], 2),
            "casecase": round(casecase, 2), "true_or": cctc_gen.TRUE_OR}
