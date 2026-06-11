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
        "term": t(lang, "來源族群＝會「產生這些病例」的那群人；換句話說，如果某位對照真的得了病，他也應該會被收進來當本研究的病例。對照就要從這群人裡隨機抽。選擇偏誤＝對照抽錯了人（不是來自這群人），導致兩組的暴露比例一開始就不可比，勝算比因此偏掉。發生密度抽樣＝在「病例陸續發生」的整段期間動態抽對照，每當有人得病，就從當下還沒得病的人裡挑對照，這樣抽出來的對照才真正代表那段時間的來源族群。",
                  "Source population = the group of people who 'produce' the cases; put differently, if one of your controls had actually fallen ill, they too should have ended up as a case in this study. Controls must be drawn at random from exactly this group. Selection bias = you sampled controls from the wrong people, so the two groups' exposure rates were not comparable to begin with and the odds ratio is thrown off. Incidence-density sampling = pick controls dynamically across the whole period while cases keep occurring — each time someone becomes a case, draw a control from those still disease-free at that moment, so the controls truly represent the source population over time."),
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
        "term": t(lang, "回憶偏誤＝因為暴露是事後回頭問的，已經生病的病例往往會比健康的對照更努力、更容易回想起過去的暴露；於是病例「記得」的暴露比較多，純粹是記憶差異，卻被誤當成真的風險差異。差異性錯分＝把暴露量錯（有的記成沒有、沒的記成有）本身難免，但若這種量錯在兩組「程度不一樣」（病例量得比較準或比較不準），就會系統性地把勝算比往某個方向推；若兩組量錯的程度一樣，偏誤通常只會把結果拉向「沒差別」。",
                  "Recall bias = because exposure is asked about after the fact, already-ill cases tend to search their memory harder and recall past exposure more readily than healthy controls; so cases 'remember' more exposure purely as a memory difference, which gets mistaken for a real difference in risk. Differential misclassification = some exposure will always be recorded wrong (present logged as absent, or vice versa), but if that error differs in degree between the two groups (cases measured more, or less, accurately than controls), it systematically pushes the odds ratio one way; if both groups are mismeasured to the same degree, the bias usually just drags the result toward 'no difference'."),
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
        "term": t(lang, "混淆＝有第三個因子（這裡是年齡）同時牽動「誰會暴露」和「誰會生病」，於是暴露和疾病看起來有關，其實一部分是這個因子在背後造成的假象；把它列入考慮（校正或分層）才能還原真實關聯。Mantel–Haenszel＝先按混淆因子把資料切成幾層（例如各年齡層各算一張表），在每層內各組都已經年齡相近、可比，再把各層的勝算比加權合併成一個總值，藉此「在同年齡內」比較暴露效果。條件 logistic＝當研究是「一個病例配上條件相近的對照」的配對設計時要用的模型，它只在每一配對組「內部」比較，剛好抵掉了被拿來配對的那些因子；若忽略配對、硬用一般模型，勝算比會被往 1（沒效果）拉。",
                  "Confounding = a third factor (here, age) drives both 'who gets exposed' and 'who gets ill', so exposure and disease look linked when part of that link is really this factor working behind the scenes; only by accounting for it (adjusting or stratifying) do you recover the true association. Mantel–Haenszel = first slice the data into layers by the confounder (e.g. one 2x2 table per age band) so that within each layer the groups are already similar in age and comparable, then combine each layer's odds ratio into one weighted overall value — in effect comparing exposure 'within the same age'. Conditional logistic = the model to use when the design pairs each case with a closely matched control; it compares only 'within' each matched set, which exactly cancels out the factors you matched on. Ignore the matching and use an ordinary model and the odds ratio gets pulled toward 1 (no effect)."),
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
        "term": t(lang, "中介因子＝位在「暴露→疾病」這條因果鏈中間、被暴露影響後再去影響疾病的因子（暴露的下游）；它本來就是效果的一部分，若拿來配對或校正，等於把真效果削掉一塊。對撞因子＝同時被暴露和疾病兩邊「指向」的因子；一旦對它配對或校正，反而會憑空製造出暴露和疾病的假關聯。過度配對＝配對配過頭，配到了中介或對撞因子（而不只是混淆因子），結果不是減少偏誤而是引入偏誤、或把真效果稀釋掉。目標試驗模擬＝把這個觀察性研究想像成「我們本來想做、但沒辦法做的那個理想隨機試驗」，再照它的規格來設計：要有明確的起算時間點（時間零點）、只收新使用者，這樣才不會無中生有跑出假的「保護」效果。",
                  "Mediator = a factor that sits in the middle of the 'exposure -> disease' chain — exposure affects it, and it in turn affects disease (downstream of exposure); it is part of the effect itself, so matching or adjusting on it carves away a chunk of the real effect. Collider = a factor that both exposure and disease point into; match or adjust on it and you conjure up a fake association between exposure and disease out of nothing. Overmatching = matching too aggressively, on a mediator or collider rather than only on confounders, which adds bias or dilutes the true effect instead of removing bias. Target-trial emulation = picture this observational study as 'the ideal randomized trial we wish we could have run but couldn't', then build it to that spec: a clearly defined start time (time zero) and new users only, so you don't fabricate a spurious 'protective' effect."),
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
        "term": t(lang, "稀疏資料偏誤＝四格表裡只要有一格人數很少（資料太稀），勝算比的計算就會被那一小格主導、變得很不穩，估出來的值容易偏大且信賴區間爆寬，極端時甚至算不出來；這不是真的效果變大，而是樣本太少造成的人為偏差。1:k 配對＝每收 1 個病例，就配進 k 個（例如 2 個、4 個）條件相近的對照，用「多找對照」來把偏小的格子補大、提高估計的穩定度，比硬去增加難找的病例更省力。",
                  "Sparse-data bias = if any one of the four cells holds very few people (the data is too thin there), the odds ratio calculation gets dominated by that tiny cell and turns unstable — the estimate tends to come out too large with a blown-up confidence interval, and in extreme cases can't be computed at all; this is not a real, larger effect but an artefact of too small a sample. 1:k matching = for every 1 case you enrol, you bring in k matched controls (say 2 or 4), padding out the small cells and steadying the estimate by 'getting more controls' — far easier than chasing down extra hard-to-find cases."),
        "metrics": metrics,
    }
