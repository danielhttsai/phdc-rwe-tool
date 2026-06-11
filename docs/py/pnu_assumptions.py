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
        "term": t(lang, "時間條件配對（time-conditional matching）＝比較時先把人按「已經用藥多久」分層，只在同一層裡互比，避免拿老用戶去對上剛起始的新人。距起始時間＝某人從第一次用藥到現在過了多久；剛起始時風險最高，之後通常降下來，所以這個「時間點」要對齊才公平。時變混淆＝會隨時間變動、又同時影響「是否續用」與「會不會出事」的因素（例如病情起伏）；沒量到它，配得再齊也還是會偏。",
                  "Time-conditional matching = before comparing, sort people by how long they have already been on the drug and only compare within the same band, so you never pit a long-term user against a fresh starter. Time-since-start = how long it has been since a person's first dose; risk is highest right after starting and usually falls later, so this clock has to be lined up for a fair comparison. Time-varying confounding = factors that change over time and affect both whether someone keeps taking the drug and whether they have the event (e.g. a fluctuating illness); if it goes unmeasured, even perfectly aligned timing stays biased."),
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
        "term": t(lang, "標竿估計＝只比「剛起始用藥」的人所得到的答案；這種設計公認沒有盛行使用者的偏誤，所以拿它當「正確答案」來對照，看 PNU 有沒有對齊。時間條件傾向分數（time-conditional PS）＝先估計「在已經用藥這麼久的情況下，這個人會被分到 A 組的機率」，再用這個機率把兩組湊得可比；它把「用藥多久」也算進去，所以同一時間點上的人才會被擺在一起比。",
                  "Benchmark estimate = the answer you get from comparing only fresh starters; this design is accepted as free of prevalent-user bias, so it serves as the 'correct answer' to check whether PNU lines up with it. Time-conditional propensity score (time-conditional PS) = the estimated probability that a person ends up in group A given how long they have already been on the drug, used to make the two groups comparable; because it folds in time-since-start, only people at the same point on the treatment clock get matched together."),
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
        "term": t(lang, "暴露起始史＝每位盛行使用者「何時拿到第一張處方、已經連續用了多久」的完整紀錄；沒有它就算不出每個人在治療時間軸上的位置。左截斷（left truncation）＝資料的觀察是從某一天才開始記的，在那之前就已經在用藥的人，他們真正的起始日落在紀錄之外、看不到。距起始時間＝從第一次用藥到進入研究過了多久；這正是 PNU 配對要對齊的「時鐘」，缺了起始日就無從計算。",
                  "Treatment-start history = a full record of each prevalent user's first prescription date and how long they have been on the drug continuously; without it you cannot place anyone on the treatment timeline. Left truncation (left truncation) = the data only start recording from a certain date, so for people already on the drug before that, their true start date falls outside the records and is invisible. Time-since-start = how long from the first dose to entering the study; this is exactly the clock PNU's matching must align, and with no start date it cannot be computed."),
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
        "term": t(lang, "易感者耗竭（depletion of susceptibles）＝體質敏感、容易因藥物出事的人早就出事退出了，剩下還在用藥的都是耐受得住的低風險族群；所以盛行使用者看起來特別「安全」，其實是篩選的結果。存活者偏誤＝你只看到「撐到現在的人」，沒看到中途出事離開的人，於是把這群被挑剩的人當成全體，結論就偏樂觀。盛行使用者偏誤＝因為上述篩選，直接拿盛行使用者來算藥物風險，會系統性低估真正的傷害。",
                  "Depletion of susceptibles (depletion of susceptibles) = the people whose constitution makes them prone to harm from the drug have already had the event and dropped out, so those still on it are the tolerant, lower-risk survivors; prevalent users therefore look unusually 'safe', but that is a selection artifact. Survivor bias = you only see the people who lasted until now, not those who had the event and left, so treating this leftover group as if it were everyone makes the conclusion overly rosy. Prevalent-user bias = because of that selection, computing drug risk directly from prevalent users systematically underestimates the true harm."),
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
        "term": t(lang, "精確度／效能＝估計值有多「穩」：人多、事件多，信賴區間就窄，也比較有把握偵測到真正的效果（效能高）。代表性＝你的樣本像不像真實在用這個藥的整群人；只看剛起始的人會漏掉長期使用者，PNU 把他們納回來就更貼近真實族群。有效樣本數＝把每個人對精確度的實際貢獻加總起來的「實質人數」；它通常比帳面人數小，是衡量估計穩不穩的更誠實指標。",
                  "Precision / power = how 'steady' the estimate is: more people and more events give a narrower confidence interval and a better chance of detecting a real effect (higher power). Representativeness = how closely your sample resembles the whole population actually taking the drug; looking only at fresh starters misses long-term users, and PNU brings them back to better mirror the real population. Effective sample size = the 'real headcount' you get after adding up how much each person actually contributes to precision; it is usually smaller than the raw count and is a more honest gauge of how stable the estimate is."),
        "metrics": metrics,
    }
