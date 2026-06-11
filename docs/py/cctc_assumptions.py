"""CCO/CCTC assumption checks C1–C5 — following Maclure (1991), Suissa (1995),
Jeong et al. (2023, J Epidemiol 33:82-90), Wong et al. (2025, AJE). Most identifying
assumptions are untestable from data alone (blue info cards); the clearly testable
one is having enough discordant pairs.

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}.
"""
from __future__ import annotations

import numpy as np

import cctc_core
from i18n import t


def run_dashboard(df, group="group", x_hazard="x_hazard", x_ref="x_ref",
                  cal_time="cal_time", lang="zh"):
    res = cctc_core.full_cctc(df, group, x_hazard, x_ref, cal_time, lang=lang)
    checks = [
        _c1_transient(lang),
        _c2_trend(res, lang),
        _c3_reference(lang),
        _c4_immeasurable(lang),
        _c5_discordant(res, lang),
    ]
    return {"checks": checks}


def _c1_transient(lang="zh"):
    return {
        "id": "C1",
        "title": t(lang, "暴露是短暫、可逆的嗎？（case-crossover 的前提）",
                   "Is the exposure transient and reversible? (the case-crossover premise)"),
        "status": "info",
        "headline": t(lang, "case-crossover 比較同一個人不同時窗的暴露，前提是暴露短暫、有明確的誘發窗；慢性暴露會破壞此設計。",
                      "Case-crossover compares a person's exposure across time windows; it requires a transient exposure with a defined induction window. Chronic exposure breaks the design."),
        "plain": t(
            lang,
            "case-crossover 用每個 case 自己當對照，把『危險窗 W1』與『參考窗 W0』的暴露相比。這只有在暴露"
            "<b>短暫、會來來去去</b>（例如短效藥的單次使用），且有明確的<b>誘發窗</b>時才合理。如果暴露是"
            "慢性、長期持續的，兩個時窗都會暴露、沒有可比的對照對，設計就不適用——這時應改用世代法。",
            "Case-crossover uses each case as their own control, comparing exposure in a 'hazard window' W1 vs a 'reference "
            "window' W0. This only makes sense when the exposure is <b>transient</b> (e.g. a single dose of a short-acting "
            "drug) with a defined <b>induction window</b>. For a chronic, sustained exposure both windows are exposed, "
            "there are no informative discordant pairs, and the design does not apply — use a cohort method instead.",
        ),
        "term": t(lang, "案例交叉（case-crossover）＝不另找別人當對照，而是拿同一個病人自己在不同時間的暴露來比，自動排除性別、體質這類不隨時間變的差異。危險窗／參考窗＝把事件發生前最可疑的那一小段時間叫「危險窗」，再挑一段平常、沒被觸發的時間叫「參考窗」，比較兩段有沒有暴露。誘發窗（induction window）＝從吃藥（暴露）到真正引發事件需要的那段反應時間，必須先設定它，危險窗才知道該抓哪一段。",
                  "Case-crossover = instead of finding other people as controls, you compare the same patient's exposure at different times, which automatically cancels out anything fixed like sex or constitution. Hazard / reference window = the short stretch of time just before the event (the suspicious one, 'hazard') is compared against an ordinary untriggered stretch ('reference') to see whether exposure was present. Induction window = the delay between taking the drug and the event it can trigger; you must set it first so the hazard window knows which stretch of time to look at."),
        "metrics": [],
    }


def _c2_trend(res, lang="zh"):
    ortrend = res["or_trend"]
    prev = [p for p in res["exposure_curve"]["prev"] if p is not None]
    slope = (prev[-1] - prev[0]) if len(prev) >= 2 else float("nan")
    metrics = [
        {"name": t(lang, "對照族群的純趨勢勝算比", "Pure-trend OR (controls)"), "value": round(ortrend, 2),
         "note": t(lang, "偏離 1 越多＝時間趨勢越強、CCO 被汙染越多",
                   "the further from 1, the stronger the trend and the more CCO is contaminated")},
        {"name": t(lang, "暴露盛行率變化（首→末月）", "Exposure prevalence change (first→last month)"),
         "value": f"{slope*100:+.0f}%" if slope == slope else "–",
         "note": t(lang, "上升＝近期 W1 本就比早期 W0 常暴露", "rising = recent windows are more exposed than earlier ones")},
    ]
    return {
        "id": "C2",
        "title": t(lang, "暴露盛行率有沒有日曆時間趨勢？（CCO 的致命傷，可看趨勢）",
                   "Does exposure prevalence trend over calendar time? (CCO's Achilles heel — visible)"),
        "status": "info",
        "headline": t(lang, "若暴露盛行率隨時間上升，純 case-crossover 會被高估；CCTC 用對照的趨勢把它扣掉。",
                      "If exposure prevalence rises over time, plain case-crossover is inflated; CCTC nets out the trend using controls."),
        "plain": t(
            lang,
            "case-crossover 假設『在沒有事件時，同一個人不同時窗的暴露機率一樣』。但如果暴露的<b>盛行率隨日曆"
            "時間上升</b>，近期的危險窗 W1 本來就比較早的參考窗 W0 更常暴露，於是即使沒有因果關係，一致對也會"
            "偏向 W1 → CCO 高估。上面的『純趨勢勝算比』與暴露曲線就是這個趨勢的指紋；CCTC 用對照族群（或未來"
            "case）的同一趨勢把它除掉。",
            "Case-crossover assumes that, absent the event, a person is equally likely to be exposed in either time window. "
            "But if exposure <b>prevalence rises over calendar time</b>, the recent hazard window W1 is more exposed than "
            "the earlier reference window W0, so discordant pairs lean toward W1 even with no causal effect → CCO is "
            "inflated. The pure-trend OR and exposure curve above are the fingerprint of that trend; CCTC divides it out "
            "using controls (or future cases) that share the same trend.",
        ),
        "term": t(lang, "暴露時間趨勢（exposure time trend）＝某個暴露（例如某種藥）隨著年月份越來越普遍（或越來越少），跟有沒有生病無關，純粹是「最近的人本來就比較常用」。這會讓近期的危險窗看起來暴露偏高，把假象算成因果。案例-時間對照（case-time-control）＝額外找一群沒發病的對照，量出他們身上同一段時間趨勢有多大，再從病人的結果裡把這份趨勢扣掉，留下真正的效果。",
                  "Exposure time trend = an exposure (say a particular drug) gradually becoming more (or less) common from month to month, unrelated to who gets sick — recent periods are simply more exposed. This makes the recent hazard window look more exposed and turns an artefact into apparent cause. Case-time-control = bring in a separate group who did not have the event, measure how big that same time trend is in them, and subtract it out of the cases' result to leave the real effect."),
        "metrics": metrics,
    }


def _c3_reference(lang="zh"):
    return {
        "id": "C3",
        "title": t(lang, "參考窗選得對嗎？（位置、長度、可交換性）",
                   "Is the reference window well-chosen? (position, length, exchangeability)"),
        "status": "info",
        "headline": t(lang, "參考窗要能代表『此人沒被觸發時的常態暴露』，且與危險窗只差設定好的時間間隔。",
                      "The reference window must represent the person's usual exposure absent the trigger, offset from the hazard window by the chosen lag."),
        "plain": t(
            lang,
            "參考窗 W0 的位置與長度是關鍵設計選擇：太靠近危險窗會被同一段暴露汙染（carry-over），太遠則更容易"
            "被時間趨勢拉開。理想上 W0 要代表『這個人平常、沒被觸發時』的暴露機率。應對不同的 W0 位置／長度做"
            "敏感度分析。",
            "The position and length of the reference window W0 are key design choices: too close to the hazard window "
            "and it is contaminated by the same exposure episode (carry-over); too far and the time trend pulls them "
            "apart more. Ideally W0 represents the person's usual exposure when not triggered. Report a sensitivity "
            "analysis over the choice of W0 position/length.",
        ),
        "term": t(lang, "參考窗可交換性（reference-window exchangeability）＝挑出來的參考窗要能誠實代表「這個人平常、沒被觸發時」的暴露機率，跟危險窗除了時間先後以外其他條件都一樣、可以對等互換；否則兩段一開始就不公平。carry-over＝同一次的暴露（例如一次用藥的效果）拖太久，連參考窗也沾到了，使「沒暴露的對照段」其實也算有暴露，兩段差距被沖淡。",
                  "Reference-window exchangeability = the chosen reference window must honestly stand for the person's usual, untriggered exposure probability, identical to the hazard window in every respect except timing so the two are interchangeable; otherwise the comparison is unfair from the start. Carry-over = one exposure episode (e.g. the effect of a single dose) lingers so long that it spills into the reference window, so the supposedly unexposed control stretch is actually exposed too and the contrast between the two windows is washed out."),
        "metrics": [],
    }


def _c4_immeasurable(lang="zh"):
    return {
        "id": "C4",
        "title": t(lang, "事件前的暴露量得到嗎？（不可測時間偏誤）",
                   "Is exposure measurable right before the event? (immeasurable-time bias)"),
        "status": "info",
        "headline": t(lang, "若事件前（如住院期間）暴露無法被觀測，會產生『不可測時間偏誤』，扭曲危險窗的暴露。",
                      "If exposure cannot be observed right before the event (e.g. during hospitalisation), 'immeasurable-time bias' distorts the hazard window."),
        "plain": t(
            lang,
            "Jeong 等人（2023）、Wong 等人（2025）指出：自我對照設計中，若<b>事件前一段時間的暴露無法測得</b>"
            "（例如人在住院、處方資料看不到），危險窗的暴露會被系統性低估或扭曲，造成<b>不可測時間偏誤</b>。"
            "case-case-time-control 對此較穩健，但仍需確認暴露在兩個時窗都被一致地測到。",
            "Jeong et al. (2023) and Wong et al. (2025) note that in self-controlled designs, if <b>exposure in a window "
            "just before the event cannot be measured</b> (e.g. the person is hospitalised and prescriptions are not "
            "captured), the hazard window's exposure is systematically under-ascertained — <b>immeasurable-time bias</b>. "
            "Case-case-time-control is more robust to it, but you must still ensure exposure is measured consistently in "
            "both windows.",
        ),
        "term": t(lang, "不可測時間偏誤（immeasurable-time bias）＝事件前有一段時間根本看不到病人到底有沒有暴露（例如人在住院、外面的處方紀錄抓不到），於是危險窗的暴露被系統性地少算或扭曲，估出來的風險就失真。案例-案例-時間對照（CCTC）＝再加一群「未來才發病」或對照的案例當基準，比單純的自我對照更能抵抗這種看不到的時間，但前提仍是兩段時窗的暴露都用一樣的方式被測到。",
                  "Immeasurable-time bias = for some stretch just before the event you genuinely cannot see whether the patient was exposed (e.g. they are hospitalised and outside prescription records are not captured), so the hazard window's exposure is systematically under-counted or distorted and the risk estimate goes wrong. Case-case-time-control (CCTC) = adds a group of future or control cases as a baseline, making it sturdier against this unobservable time than a plain self-controlled design — but it still relies on exposure being measured the same way in both windows."),
        "metrics": [],
    }


def _c5_discordant(res, lang="zh"):
    d = res["discordant"]
    nmin = int(min(d["b_case"], d["c_case"], d["b_ctrl"], d["c_ctrl"]))
    metrics = [
        {"name": t(lang, "最少的一致對數（四格取最小）", "Fewest discordant pairs (min of the four cells)"),
         "value": nmin,
         "note": t(lang, "只有一致對（W1≠W0）才提供資訊；太少→勝算比很不穩",
                   "only discordant pairs (W1≠W0) are informative; too few → unstable OR")},
    ]
    if nmin >= 50:
        status, head = "green", t(lang, "一致對充足，CCO 與 CCTC 的勝算比估得穩。",
                                  "Plenty of discordant pairs — the CCO and CCTC odds ratios are stable.")
    elif nmin >= 20:
        status, head = "amber", t(lang, "一致對偏少，勝算比較不穩、信賴區間偏寬。",
                                  "Few discordant pairs — the odds ratio is unstable and the interval is wide.")
    else:
        status, head = "red", t(lang, "一致對太少，勝算比極不穩、不可靠。",
                                "Too few discordant pairs — the odds ratio is very unstable and unreliable.")
    return {
        "id": "C5",
        "title": t(lang, "一致對（discordant pairs）夠多嗎？（可檢驗）",
                   "Are there enough discordant pairs? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "case-crossover／CCTC 的勝算比只由<b>一致對</b>（同一人兩窗暴露不同：W1暴露W0未，或相反）決定。"
            "若這類對很少（事件罕見、或暴露很穩定），勝算比就估得很不穩、信賴區間爆寬。延長觀察、選暴露變動較大"
            "的情境，都能改善。",
            "The case-crossover / CCTC odds ratio is driven only by <b>discordant pairs</b> (a person exposed in one "
            "window but not the other). If such pairs are few (rare event, or very stable exposure), the odds ratio is "
            "unstable and the interval blows up. A longer observation window or a more variable exposure both help.",
        ),
        "term": t(lang, "一致對（discordant pairs，又稱不一致對）＝同一個人兩段時窗的暴露剛好不同（一段有、一段沒有），只有這種人才提供資訊；兩段都暴露或都沒暴露的人對結果毫無貢獻，所以真正算數的樣本往往比總人數少很多。條件 logistic／McNemar＝專門用來分析這種「自己跟自己配對」資料的統計方法，計算時自動只看一致對；當一致對太少，這兩種方法算出的勝算比就會非常不穩、信賴區間爆寬。",
                  "Discordant pairs = the same person was exposed in one of the two windows but not the other (one yes, one no); only these people carry information, while anyone exposed in both windows or neither contributes nothing, so the sample that actually counts is often far smaller than the headcount. Conditional logistic / McNemar = the statistical methods built for this 'each person matched to themselves' data; they automatically rely only on discordant pairs, and when those pairs are few the odds ratio they produce becomes very unstable with a wide confidence interval."),
        "metrics": metrics,
    }
