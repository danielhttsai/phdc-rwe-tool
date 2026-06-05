"""Case-control assumption checks C1–C5. Most identifying assumptions are about study
DESIGN and are untestable from the data alone (blue info cards); the testable ones are
how far the crude OR is confounded and whether there are enough cases/exposed.

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}.
"""
from __future__ import annotations

import numpy as np

import cc_core
from i18n import t


def run_dashboard(df, case="case", exposed="exposed", lang="zh"):
    res = cc_core.full_cc(df, case=case, exposed=exposed, lang=lang)
    checks = [
        _c1_controls(lang),
        _c2_exposure(lang),
        _c3_confounding(res, lang),
        _c4_design(lang),
        _c5_counts(res, lang),
    ]
    return {"checks": checks}


def _c1_controls(lang="zh"):
    return {
        "id": "C1",
        "title": t(lang, "對照能代表『產生病例的那個族群』嗎？（選擇偏誤）",
                   "Do controls represent the population that produced the cases? (selection bias)"),
        "status": "info",
        "headline": t(lang, "對照要從『若得病也會成為本研究病例』的同一個來源族群隨機抽——抽錯了就有選擇偏誤。",
                      "Controls must be sampled from the same source population that would have become cases — pick the wrong base and you get selection bias."),
        "plain": t(
            lang,
            "病例對照最核心的設計問題是：<b>對照從哪裡來</b>。對照應該代表『產生這些病例的來源族群』——也就是"
            "『如果這些對照得了病，也會被納入成為本研究的病例』。常見陷阱：用醫院對照（他們因別的病住院，暴露分布"
            "和一般人不同）、或對照的納入和暴露有關。抽樣抽錯，勝算比就有<b>選擇偏誤</b>，再多統計也救不回來。",
            "The central design question in a case-control study is <b>where the controls come from</b>. Controls should "
            "represent the source population that produced the cases — i.e. had a control developed the disease, they too "
            "would have been a case here. Classic traps: hospital controls (admitted for other conditions, with a different "
            "exposure distribution) or controls whose selection is related to exposure. Sample the wrong base and the odds "
            "ratio carries <b>selection bias</b> that no amount of analysis can fix.",
        ),
        "term": t(lang, "專有名詞：來源族群（source population）；選擇偏誤；發生密度抽樣（incidence-density sampling）。",
                  "Term: source population; selection bias; incidence-density sampling."),
        "metrics": [],
    }


def _c2_exposure(lang="zh"):
    return {
        "id": "C2",
        "title": t(lang, "兩組的暴露是『一樣準』地量到的嗎？（回憶／測量偏誤）",
                   "Is exposure measured equally well in both groups? (recall / measurement bias)"),
        "status": "info",
        "headline": t(lang, "病例對照回頭問過去的暴露；若病例比對照更會回想起暴露，就會產生回憶偏誤。",
                      "Case-control looks back at past exposure; if cases recall exposure more than controls, recall bias results."),
        "plain": t(
            lang,
            "因為暴露是<b>回溯</b>測量的，若病例（已經生病）比對照更努力、更容易回想起過去的暴露（<b>回憶偏誤</b>），"
            "或兩組的病歷／資料完整度不同（<b>測量偏誤</b>），暴露的差異就會被人為放大或縮小。用<b>客觀紀錄</b>"
            "（如處方資料庫）而非自述、對暴露評估設盲，都能減輕。",
            "Because exposure is measured <b>retrospectively</b>, if cases (already ill) recall past exposure more readily "
            "than controls (<b>recall bias</b>), or the two groups have different record completeness (<b>measurement "
            "bias</b>), the exposure contrast is artificially widened or shrunk. Using <b>objective records</b> (e.g. a "
            "prescription database) instead of self-report, and blinding exposure assessment, both help.",
        ),
        "term": t(lang, "專有名詞：回憶偏誤（recall bias）；差異性錯分（differential misclassification）。",
                  "Term: recall bias; differential misclassification."),
        "metrics": [],
    }


def _c3_confounding(res, lang="zh"):
    crude, adj, mh = res["crude_or"], res["adj_or"], res["mh_or"]
    gap = abs(np.log(max(crude, 1e-6)) - np.log(max(adj, 1e-6)))
    metrics = [
        {"name": t(lang, "粗 OR vs 校正 OR", "crude OR vs adjusted OR"),
         "value": f"{crude:.2f} → {adj:.2f}",
         "note": t(lang, "兩者差距＝可測混淆造成的偏誤（已被校正）",
                   "the gap = bias from measured confounding (removed by adjustment)")},
        {"name": t(lang, "Mantel–Haenszel 合併 OR", "Mantel–Haenszel OR"), "value": round(mh, 2),
         "note": t(lang, "分層合併，應與校正 OR 接近", "stratified pooling; should agree with the adjusted OR")},
    ]
    if gap >= 0.3:
        status = "amber"
        head = t(lang, "粗 OR 與校正 OR 差很多——有明顯可測混淆；務必報校正／分層後的結果，別看粗 OR。",
                 "Crude and adjusted ORs differ a lot — clear measured confounding; report the adjusted/stratified result, not the crude OR.")
    else:
        status = "green"
        head = t(lang, "校正前後變化不大，可測混淆有限（但未測混淆仍無法排除）。",
                 "Little change after adjustment — limited measured confounding (though unmeasured confounding can't be ruled out).")
    return {
        "id": "C3",
        "title": t(lang, "可測混淆校正了嗎？（粗 OR vs 校正 OR，可檢驗）",
                   "Is measured confounding adjusted for? (crude vs adjusted OR — testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "若某個因子<b>同時</b>影響暴露與結果（這裡是年齡），它就是<b>混淆因子</b>，會讓粗 OR 偏掉。把它放進 "
            "logistic 模型<b>校正</b>，或按它<b>分層</b>後用 Mantel–Haenszel 合併，都能修掉。上面粗 OR 與校正 OR 的"
            "差距，就是可測混淆造成的偏誤大小。注意：這只處理<b>量得到</b>的混淆，量不到的仍需設計（配對、敏感度分析）。",
            "If a factor affects <b>both</b> exposure and outcome (here, age), it is a <b>confounder</b> and biases the crude "
            "OR. Put it in a logistic model to <b>adjust</b>, or <b>stratify</b> on it and pool with Mantel–Haenszel. The gap "
            "between the crude and adjusted OR above is the size of the measured-confounding bias. Note this only handles "
            "<b>measured</b> confounding; unmeasured confounding still needs design (matching, sensitivity analysis).",
        ),
        "term": t(lang, "專有名詞：混淆（confounding）；Mantel–Haenszel；條件 logistic（配對時）。",
                  "Term: confounding; Mantel–Haenszel; conditional logistic (when matched)."),
        "metrics": metrics,
    }


def _c4_design(lang="zh"):
    return {
        "id": "C4",
        "title": t(lang, "配對與時間零點設對了嗎？（別配在中介/對撞、避免 immortal time）",
                   "Are matching and time-zero set correctly? (don't match on mediators/colliders; avoid immortal time)"),
        "status": "info",
        "headline": t(lang, "配對要配在混淆因子、且分析要用條件式；設計上要有明確時間零點、用新使用者，否則重現假象。",
                      "Match on confounders and analyse with conditional methods; define a clear time zero and use new users, or you reproduce artefacts."),
        "plain": t(
            lang,
            "兩個設計陷阱：(1) <b>配對</b>只該配在混淆因子，不能配在<b>中介</b>（暴露的下游）或<b>對撞因子</b>，"
            "否則引入偏誤；而且配對後分析要用<b>條件式</b>（一致對／條件 logistic），忽略配對會把 OR 拉向 1。"
            "(2) Dickerman & Hernán（2020）指出，把病例對照想成<b>對「模擬目標試驗的世代」做抽樣</b>：要有明確的"
            "<b>時間零點</b>、用<b>新使用者</b>，否則納入既有使用者、沒對齊時間，會憑空生出『保護』假象（見 ③ 進階）。",
            "Two design traps: (1) <b>matching</b> should be on confounders only — never on a <b>mediator</b> (downstream of "
            "exposure) or a <b>collider</b>, which introduces bias; and a matched design must be analysed with <b>conditional</b> "
            "methods (discordant pairs / conditional logistic), since ignoring the matching pulls the OR toward 1. (2) Dickerman "
            "& Hernán (2020) frame a case-control study as <b>sampling from a cohort that emulates a target trial</b>: you need a "
            "clear <b>time zero</b> and <b>new users</b>, or prevalent users and unaligned time create a spurious 'protective' "
            "effect (see ③ advanced).",
        ),
        "term": t(lang, "專有名詞：中介／對撞因子；過度配對（overmatching）；目標試驗模擬（target-trial emulation）。",
                  "Term: mediator / collider; overmatching; target-trial emulation."),
        "metrics": [],
    }


def _c5_counts(res, lang="zh"):
    a, b, c, d = res["counts"]["a"], res["counts"]["b"], res["counts"]["c"], res["counts"]["d"]
    nmin = int(min(a, b, c, d))
    metrics = [
        {"name": t(lang, "2×2 四格最小細格數", "smallest of the four 2×2 cells"), "value": nmin,
         "note": t(lang, "任何一格太小→勝算比不穩、信賴區間爆寬",
                   "any tiny cell → unstable OR and a very wide interval")},
        {"name": t(lang, "病例數 / 對照數", "cases / controls"),
         "value": f"{res['n_cases']} / {res['n_controls']}", "note": ""},
    ]
    if nmin >= 50:
        status, head = "green", t(lang, "各格樣本充足，勝算比估得穩。", "All cells well-populated — the odds ratio is stable.")
    elif nmin >= 15:
        status, head = "amber", t(lang, "有格子偏小，勝算比較不穩、信賴區間偏寬。",
                                  "A cell is on the small side — the OR is somewhat unstable and the interval is wide.")
    else:
        status, head = "red", t(lang, "有格子太小，勝算比極不穩、不可靠。",
                                "A cell is too small — the OR is very unstable and unreliable.")
    return {
        "id": "C5",
        "title": t(lang, "每一格的人數夠嗎？（可檢驗）", "Are all four cells well-populated? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "勝算比 (a·d)/(b·c) 對<b>最小的細格</b>很敏感：只要有一格（例如『暴露的對照』或『未暴露的病例』）人數很少，"
            "估計就會很不穩、信賴區間爆寬，甚至無法計算。罕見暴露＋罕見結果時尤其要注意。增加對照數（1:k 配對）可改善。",
            "The odds ratio (a·d)/(b·c) is sensitive to the <b>smallest cell</b>: if any one cell (say 'exposed controls' or "
            "'unexposed cases') has very few people, the estimate is unstable, the interval blows up, or it can't be computed. "
            "Watch out with a rare exposure plus a rare outcome. Adding controls (1:k matching) helps.",
        ),
        "term": t(lang, "專有名詞：稀疏資料偏誤（sparse-data bias）；1:k 配對。",
                  "Term: sparse-data bias; 1:k matching."),
        "metrics": metrics,
    }
