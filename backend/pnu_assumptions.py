"""PNU assumption checks C1–C5. The identifying assumptions are mostly about DESIGN
(time-conditional matching, exposure history) and are untestable from data alone (blue
info cards); the testable ones are how depleted the prevalent users are and whether the
time-conditional adjustment recovers the new-user estimate.

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}.
"""
from __future__ import annotations

import numpy as np

import pnu_core
from i18n import t


def run_dashboard(df, drug="drug", event="event", futime="futime", lang="zh"):
    res = pnu_core.full_pnu(df, drug=drug, event=event, futime=futime, lang=lang)
    checks = [
        _c1_timeconditional(lang),
        _c2_matching(res, lang),
        _c3_history(lang),
        _c4_depletion(res, lang),
        _c5_events(res, lang),
    ]
    return {"checks": checks}


def _c1_timeconditional(lang="zh"):
    return {
        "id": "C1",
        "title": t(lang, "在『距起始時間』條件下可交換嗎？（無未測時變混淆，關鍵、不可檢驗）",
                   "Conditional exchangeability given time-since-start? (no unmeasured time-varying confounding — key, untestable)"),
        "status": "info",
        "headline": t(lang, "PNU 假設『在相同距起始時間下』，盛行 A 使用者和對照組可比；這要靠把時變因子量到、配對對。",
                      "PNU assumes that, conditional on the same time-since-start, prevalent A users are comparable to the comparator — which needs the time-varying factors measured and matched correctly."),
        "plain": t(
            lang,
            "盛行使用者的風險和『他已經用了多久』有關（剛起始時的高風險期通常已經過了）。PNU 的核心是<b>時間條件</b>："
            "在<b>相同的距起始時間</b>下比較，才不會拿『已經過了高風險期的盛行使用者』去對上『剛起始的人』。這要求"
            "把<b>距起始時間</b>以及隨之改變的風險量到、並正確納入配對／傾向分數；若還有<b>沒測到的時變因子</b>，PNU 仍會偏。"
            "這條假設無法只用資料證明。",
            "A prevalent user's risk depends on <b>how long they have already been treated</b> (the early high-risk period is "
            "usually behind them). The heart of PNU is the <b>time-conditional</b> comparison: compare at the <b>same "
            "time-since-start</b>, so you don't pit 'a prevalent user past the early-risk window' against 'someone who just "
            "started'. This requires measuring time-since-start (and the risk that varies with it) and folding it correctly "
            "into the matching / propensity score; with <b>unmeasured time-varying factors</b>, PNU is still biased. The "
            "assumption cannot be proven from data alone.",
        ),
        "term": t(lang, "專有名詞：時間條件配對（time-conditional matching）；距起始時間；時變混淆。",
                  "Term: time-conditional matching; time-since-start; time-varying confounding."),
        "metrics": [],
    }


def _c2_matching(res, lang="zh"):
    nu, pnu, truth = res["newuser_hr"], res["pnu_hr"], res["true_hr"]
    gap = abs(pnu - nu)
    metrics = [
        {"name": t(lang, "PNU vs 純新使用者", "PNU vs new-user-only"), "value": f"{pnu:.2f} vs {nu:.2f}",
         "note": t(lang, "配對／時間條件做對了，PNU 應與純新使用者估計一致", "if matching is right, PNU should agree with the new-user-only estimate")},
        {"name": t(lang, "納入的盛行使用者數", "prevalent users brought back"), "value": f"{res['n_prevalent']}",
         "note": t(lang, "PNU 用上、純新使用者丟掉的人——更有效率、更有代表性", "users PNU uses that new-user-only discards — more efficient and representative")},
    ]
    if gap < 0.12:
        status, head = "green", t(lang, "PNU 與純新使用者估計一致——時間條件配對抓對了，又用上盛行使用者。",
                                  "PNU agrees with the new-user-only estimate — the time-conditional matching is right, and it uses the prevalent users.")
    elif gap < 0.3:
        status, head = "amber", t(lang, "PNU 與純新使用者有些落差——檢查距起始時間的配對／模型是否設定正確。",
                                  "PNU and new-user-only differ somewhat — check the time-since-start matching / model specification.")
    else:
        status, head = "red", t(lang, "PNU 與純新使用者差很多——時間條件配對可能沒做對，盛行使用者的偏誤沒清掉。",
                                "PNU and new-user-only differ a lot — the time-conditional matching may be wrong; the prevalent-user bias is not removed.")
    return {
        "id": "C2",
        "title": t(lang, "時間條件配對做對了嗎？（可檢驗：PNU 應對齊純新使用者）",
                   "Is the time-conditional matching right? (testable: PNU should match new-user-only)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "純新使用者設計（只比剛起始的人）是不偏的<b>標竿</b>，但丟掉盛行使用者。PNU 的目標是<b>對齊這個標竿</b>、"
            "同時把盛行使用者用時間條件納回來。所以一個直接的可檢項目就是：<b>PNU 估計值是否貼近純新使用者估計值</b>。"
            "貼得近＝配對對了；差很多＝時間條件沒設定好。",
            "The new-user-only design (comparing only fresh starters) is the unbiased <b>benchmark</b>, but it discards prevalent "
            "users. PNU aims to <b>match that benchmark</b> while bringing the prevalent users back time-conditionally. So a "
            "direct check is whether <b>the PNU estimate sits close to the new-user-only estimate</b>: close = the matching is "
            "right; far apart = the time-conditional adjustment is mis-specified.",
        ),
        "term": t(lang, "專有名詞：標竿估計；時間條件傾向分數（time-conditional PS）。",
                  "Term: benchmark estimate; time-conditional propensity score."),
        "metrics": metrics,
    }


def _c3_history(lang="zh"):
    return {
        "id": "C3",
        "title": t(lang, "拿得到盛行使用者完整的『暴露起始史』嗎？（資料可得性）",
                   "Is the full treatment-start history of prevalent users available? (data availability)"),
        "status": "info",
        "headline": t(lang, "PNU 要知道每位盛行使用者『何時起始、用了多久』；缺這段歷史就配不出時間條件。",
                      "PNU needs each prevalent user's start date and duration; without that history you cannot form the time-conditional comparison."),
        "plain": t(
            lang,
            "PNU 的時間條件配對，前提是每位盛行使用者的<b>距起始時間</b>都量得到（何時拿到第一張處方、到進入世代用了多久）。"
            "若資料只看得到『現在在用 A』、看不到<b>起始日</b>（例如資料庫有左截斷），就無法把盛行使用者放到正確的時間條件層，"
            "PNU 也就做不成。這是資料可得性的限制，不是統計能補的。",
            "PNU's time-conditional matching presumes that each prevalent user's <b>time-since-start</b> is measurable (when they "
            "got their first prescription, and how long until cohort entry). If the data only show 'currently on A' without the "
            "<b>start date</b> (e.g. left truncation in the database), you cannot place prevalent users in the right "
            "time-conditional stratum and PNU cannot be done. This is a data-availability limit, not something statistics can fix.",
        ),
        "term": t(lang, "專有名詞：暴露起始史；左截斷（left truncation）；距起始時間。",
                  "Term: treatment-start history; left truncation; time-since-start."),
        "metrics": [],
    }


def _c4_depletion(res, lang="zh"):
    bal = res.get("frailty_balance") or {}
    depl = abs(bal.get("A_new", 0.0) - bal.get("A_prev", 0.0))
    metrics = [
        {"name": t(lang, "體質差：A 新使用者 vs 盛行使用者", "frailty gap: A new vs prevalent"),
         "value": f"{depl:.2f}",
         "note": t(lang, "盛行使用者體質越低＝易感者耗竭越強（存活下來的是低風險群）",
                   "lower frailty in prevalent users = stronger depletion of susceptibles (survivors are lower-risk)")},
        {"name": t(lang, "天真盛行 → PNU", "naive prevalent → PNU"),
         "value": f"{res['naive_hr']:.2f} → {res['pnu_hr']:.2f}",
         "note": t(lang, "天真比被耗竭往無效值拉；PNU 校正回真值", "the naive contrast is pulled to the null by depletion; PNU corrects it back to the truth")},
    ]
    if depl < 0.15:
        status, head = "green", t(lang, "盛行與新使用者體質接近——耗竭很弱，盛行使用者大致可直接用。",
                                  "Prevalent and new users are similar in frailty — weak depletion; prevalent users are largely usable directly.")
    elif depl < 0.6:
        status, head = "amber", t(lang, "盛行使用者明顯較低風險（易感者耗竭）——天真比會低估，需用 PNU 的時間條件校正。",
                                  "Prevalent users are clearly lower-risk (depletion of susceptibles) — a naive comparison underestimates; use PNU's time-conditional adjustment.")
    else:
        status, head = "red", t(lang, "易感者耗竭很強——天真把盛行使用者直接比會嚴重偏，務必用 PNU 或純新使用者。",
                                "Strong depletion of susceptibles — naively pooling prevalent users is badly biased; use PNU or the new-user-only design.")
    return {
        "id": "C4",
        "title": t(lang, "易感者耗竭有多強？（可檢驗：盛行 vs 新使用者的體質差）",
                   "How strong is depletion of susceptibles? (testable: frailty gap, prevalent vs new)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "<b>易感者耗竭</b>＝容易出事的人早就出事、退出了，所以還在用 A 的<b>盛行使用者</b>是存活下來的低風險族群。"
            "上面的指標看盛行使用者的體質比新使用者低多少——差越大，<b>天真</b>把盛行使用者直接和新起始者比就偏越多"
            "（被拉向無效值）。PNU 用時間條件把這個偏誤校正回來。",
            "<b>Depletion of susceptibles</b> means the people prone to the event have already had it and left, so the prevalent "
            "users still on A are the lower-risk survivors. The metric shows how much lower their frailty is than new users' — "
            "the larger the gap, the more a <b>naive</b> pooling of prevalent users is biased (pulled toward the null). PNU "
            "corrects this with its time-conditional adjustment.",
        ),
        "term": t(lang, "專有名詞：易感者耗竭（depletion of susceptibles）；存活者偏誤；盛行使用者偏誤。",
                  "Term: depletion of susceptibles; survivor bias; prevalent-user bias."),
        "metrics": metrics,
    }


def _c5_events(res, lang="zh"):
    ev = res.get("events") or {}
    eA, eB = int(ev.get("A", 0)), int(ev.get("B", 0))
    mn = min(eA, eB)
    metrics = [
        {"name": t(lang, "事件數（A／B）", "Events (A / B)"), "value": f"{eA} / {eB}",
         "note": t(lang, "兩臂都要有夠多事件", "both arms need enough events")},
        {"name": t(lang, "PNU 用的人數 vs 純新使用者", "N used: PNU vs new-user-only"),
         "value": f"{res['n_pnu']} vs {res['n_new']}",
         "note": t(lang, "PNU 納回盛行使用者→樣本更大、估計更精確", "PNU brings prevalent users back → larger sample, more precise")},
    ]
    if mn >= 200:
        status, head = "green", t(lang, "事件充足——速率比與信賴區間穩定；PNU 的精確度優於純新使用者。",
                                  "Plenty of events — the rate ratio and CI are stable; PNU is more precise than new-user-only.")
    elif mn >= 50:
        status, head = "amber", t(lang, "事件中等——PNU 納入盛行使用者有助精確度，仍留意區間寬度。",
                                  "Moderate events — PNU's prevalent users help precision, but mind the interval width.")
    else:
        status, head = "red", t(lang, "事件太少——估計不穩，別過度解讀。", "Too few events — estimates are unstable; don't over-interpret.")
    return {
        "id": "C5",
        "title": t(lang, "事件數夠嗎？（可檢驗）", "Are there enough events? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "PNU 相對於純新使用者設計的<b>賣點</b>，正是把被丟掉的盛行使用者<b>納回來</b>，讓樣本與事件數變多、估計更精確、"
            "也更能代表真實在用藥的族群（含長期使用者）。上面的指標看兩臂事件數，以及 PNU 比純新使用者多用了多少人。",
            "PNU's <b>selling point</b> over the new-user-only design is exactly that it <b>brings back</b> the discarded "
            "prevalent users, increasing the sample and event counts for a more precise estimate that also better represents "
            "the real treated population (including long-term users). The metrics show the events per arm and how many more "
            "people PNU uses than the new-user-only design.",
        ),
        "term": t(lang, "專有名詞：精確度／效能；代表性；有效樣本數。",
                  "Term: precision / power; representativeness; effective sample size."),
        "metrics": metrics,
    }
