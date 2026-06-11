"""PSSA assumption checks C1–C5. PSSA is a signal-detection (hypothesis-generating) method;
most of its validity is design judgement (blue): the cascade direction, a correct null-SR for
the prescribing trend, a sensible time window, and new-user (incident) ascertainment. The
testable supports: how strongly the trend drives the null SR, and enough discordant pairs.

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}.
"""
from __future__ import annotations

import numpy as np

import pssa_core
from i18n import t


def run_dashboard(df, lang="zh"):
    r = pssa_core.full_pssa(df, lang=lang)
    a, b = r["a_index_first"], r["b_marker_first"]
    srnull = r["srnull"]
    checks = [
        _c1_direction(lang),
        _c2_trend(srnull, lang),
        _c3_window(lang),
        _c4_newuser(lang),
        _c5_pairs(a, b, lang),
    ]
    return {"checks": checks}


def _c1_direction(lang="zh"):
    return {
        "id": "C1",
        "title": t(lang, "因果方向正確：指標藥 A 引起、標記藥 B 處理（不可純檢驗）",
                   "Correct direction: the index drug A causes, the marker drug B treats (untestable)"),
        "status": "info",
        "headline": t(lang, "PSSA 只說「A 與 B 的<b>先後</b>不對稱」；要解讀成<b>A→不良反應→B</b> 的瀑布，靠的是藥理與臨床知識。",
                      "PSSA only shows an <b>order asymmetry</b> between A and B; reading it as an <b>A→adverse-event→B</b> cascade rests on pharmacology and clinical knowledge."),
        "plain": t(
            lang,
            "PSSA 偵測到的是「先 A 後 B」比「先 B 後 A」多。要把它解讀成<b>處方瀑布</b>（A 的不良反應促使開 B），必須先有"
            "<b>合理的因果方向</b>：A 可能引起某症狀、而 B 正是用來處理那個症狀。若其實是 B 引起、A 處理（反向），或兩者只是"
            "常一起開立，aSR 的訊號就會被誤讀。這條<b>不能用資料證明</b>，要靠領域知識與已知不良反應假設。",
            "PSSA detects that 'A-then-B' outnumbers 'B-then-A'. To read this as a <b>prescribing cascade</b> (A's adverse event "
            "prompts B), you need a <b>plausible causal direction</b>: A can cause a symptom and B is what's used to treat that "
            "symptom. If instead B causes and A treats (reverse), or the two are simply co-prescribed, the aSR signal is "
            "mis-read. This <b>cannot be proven from data</b> — it rests on domain knowledge and a known/hypothesised adverse effect.",
        ),
        "term": t(lang, "專有名詞：處方瀑布；指標藥／標記藥；反向因果。",
                  "Term: prescribing cascade; index / marker drug; reverse causation."),
        "metrics": [],
    }


def _c2_trend(srnull, lang="zh"):
    dev = abs(np.log(max(srnull, 1e-6)))
    if dev < 0.15:
        status, head = "green", t(lang, "處方趨勢輕微（SRnull 接近 1）——cSR 幾乎不需校正，結論穩。",
                                  "Mild prescribing trend (SRnull near 1) — the cSR barely needs correcting; robust.")
    elif dev < 0.6:
        status, head = "amber", t(lang, "處方趨勢明顯——aSR 很依賴 SRnull 估得準，請檢查趨勢模型。",
                                  "A clear prescribing trend — the aSR leans heavily on a correct SRnull; check the trend model.")
    else:
        status, head = "red", t(lang, "處方趨勢很強——SRnull 遠離 1，aSR 對「趨勢怎麼建模」非常敏感。",
                                "A strong prescribing trend — SRnull is far from 1 and the aSR is very sensitive to how the trend is modelled.")
    return {
        "id": "C2",
        "title": t(lang, "無效果順序比 SRnull 把處方趨勢校正對了嗎？（部分可檢驗）",
                   "Does the null-SR correctly remove the prescribing trend? (partly testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "cSR 會被<b>處方趨勢</b>偏掉：若標記藥 B 的開立逐年上升，光是趨勢就讓 B 偏向「比較晚」、製造假訊號。<b>SRnull</b>"
            "（純趨勢下的期望 SR）就是要把這塊除掉，得到 <b>aSR ＝ cSR ÷ SRnull</b>。SRnull 離 1 越遠，代表趨勢越強、aSR 越"
            "依賴「趨勢有沒有估對」。修法：用更彈性的時間趨勢模型（見 ⑤）、或限制較短的時間窗。",
            "The cSR is biased by the <b>prescribing trend</b>: if the marker drug B's use rises over time, the trend alone makes B "
            "tend to come 'later', creating a spurious signal. <b>SRnull</b> (the expected SR under the trend only) removes this, giving "
            "<b>aSR = cSR ÷ SRnull</b>. The further SRnull is from 1, the stronger the trend and the more the aSR depends on getting the "
            "trend right. Fixes: a more flexible time-trend model (see ⑤), or a shorter time window.",
        ),
        "term": t(lang, "專有名詞：處方趨勢；無效果順序比（SRnull）；校正順序比（aSR）。",
                  "Term: prescribing trend; null-effect sequence ratio (SRnull); adjusted SR (aSR)."),
        "metrics": [
            {"name": t(lang, "SRnull（趨勢基準）", "SRnull (trend baseline)"), "value": f"{srnull:.2f}",
             "note": t(lang, "越接近 1 越好；遠離 1 代表趨勢強", "closer to 1 is better; far from 1 means a strong trend")},
        ],
    }


def _c3_window(lang="zh"):
    return {
        "id": "C3",
        "title": t(lang, "時間窗設定合理嗎？（太長納入無關配對、太短漏掉瀑布）",
                   "Is the time window sensible? (too long pulls in unrelated pairs, too short misses the cascade)"),
        "status": "info",
        "headline": t(lang, "「兩藥都用過」的時間間隔要對得上不良反應出現的時序——這由臨床決定。",
                      "The 'both drugs used' interval must match the timing of the adverse event — a clinical choice."),
        "plain": t(
            lang,
            "PSSA 只看「兩種藥都用過」的人，並界定一個<b>時間窗</b>（如 12 個月內）。窗<b>太長</b>，會把彼此無關、只是先後出現的"
            "配對也算進來，稀釋或扭曲訊號；窗<b>太短</b>，會漏掉那些反應較慢才開 B 的真瀑布。合適的窗要對上「A 的不良反應大概"
            "多久後會促使開 B」。這主要靠臨床判斷與敏感度分析（換不同窗看 aSR 穩不穩）。",
            "PSSA looks only at people who used <b>both</b> drugs within a defined <b>time window</b> (e.g. 12 months). Too <b>long</b> "
            "a window pulls in unrelated pairs that merely happen in sequence, diluting or distorting the signal; too <b>short</b> a "
            "window misses real cascades where B is started only after a delay. The right window matches 'how long after A's adverse "
            "event B tends to be started'. This rests on clinical judgement and a sensitivity analysis (does the aSR hold across windows?).",
        ),
        "term": t(lang, "專有名詞：時間窗／間隔；敏感度分析；不一致對。",
                  "Term: time window / interval; sensitivity analysis; discordant pairs."),
        "metrics": [],
    }


def _c4_newuser(lang="zh"):
    return {
        "id": "C4",
        "title": t(lang, "新使用者（incident）：兩藥都是首次使用，有洗滌期（設計保證）",
                   "Incident (new) users: first-ever use of both drugs, with a washout (design guarantee)"),
        "status": "info",
        "headline": t(lang, "PSSA 要看的是「<b>起始</b>順序」；若把舊使用者也算進來，先後就被舊處方污染。",
                      "PSSA needs the <b>initiation</b> order; including prevalent users contaminates the sequence with old prescriptions."),
        "plain": t(
            lang,
            "PSSA 的「先後」指的是<b>第一次</b>開立 A 與 B 的順序，所以兩種藥都要限定<b>新使用者</b>（前面有一段乾淨的<b>洗滌期</b>"
            "沒用過）。若納入既有（盛行）使用者，他們的真正起始時間在資料窗之前、看不到，先後就被污染、SR 失準。這是和新使用者"
            "設計（見 ACNU／PNU）相同的考量。",
            "The 'order' in PSSA is the sequence of the <b>first-ever</b> prescriptions of A and B, so both drugs must be restricted to "
            "<b>new users</b> (a clean <b>washout</b> with no prior use). Including prevalent users — whose true initiation predates the "
            "data window and is unseen — contaminates the order and distorts the SR. This is the same concern as the new-user design "
            "(see ACNU / PNU).",
        ),
        "term": t(lang, "專有名詞：新使用者（incident user）；洗滌期；盛行使用者偏誤。",
                  "Term: incident (new) user; washout; prevalent-user bias."),
        "metrics": [],
    }


def _c5_pairs(a, b, lang="zh"):
    m = min(a, b)
    if m >= 100:
        status, head = "green", t(lang, "兩個方向的不一致對都夠多，順序比估計穩定。",
                                  "Plenty of discordant pairs in both directions; the sequence ratio is stable.")
    elif m >= 25:
        status, head = "amber", t(lang, "某一方向的配對偏少——aSR 的信賴區間會偏寬。",
                                  "One direction is thin — the aSR confidence interval will be wide.")
    else:
        status, head = "red", t(lang, "不一致對太少——順序比很不穩、訊號不可靠。",
                                "Too few discordant pairs — the sequence ratio is unstable and the signal unreliable.")
    return {
        "id": "C5",
        "title": t(lang, "兩個方向都有足夠的不一致對嗎？（可檢驗）",
                   "Enough discordant pairs in both directions? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "順序比只由「不一致對」決定：先 A 後 B（a）與先 B 後 A（b）。兩者中較少的那個太小，cSR 與 aSR 都會很不穩、CI 很寬。"
            "這個指標看 a、b 的最小值。",
            "The sequence ratio rests entirely on discordant pairs: A-then-B (a) and B-then-A (b). If the smaller of the two is tiny, "
            "the cSR and aSR are unstable with wide CIs. This metric is the minimum of a and b.",
        ),
        "term": t(lang, "專有名詞：不一致對；順序比精度；信賴區間寬度。",
                  "Term: discordant pairs; sequence-ratio precision; confidence-interval width."),
        "metrics": [
            {"name": t(lang, "先 A 後 B（a）", "A-then-B (a)"), "value": str(a), "note": ""},
            {"name": t(lang, "先 B 後 A（b）", "B-then-A (b)"), "value": str(b), "note": ""},
        ],
    }
