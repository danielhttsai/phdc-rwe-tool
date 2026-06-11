"""TreeScan assumption checks C1–C5. TreeScan is a signal-detection (hypothesis-generating)
scan; much of its validity is design judgement (blue): a meaningful outcome hierarchy and a
valid null/permutation reference. The testable supports: enough cases at the flagged node and
a permutation-adjusted p that actually clears the multiplicity it was built to control.

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}.
"""
from __future__ import annotations

import numpy as np

import tscan_core
from i18n import t


def run_dashboard(df, lang="zh"):
    r = tscan_core.full_tscan(df, lang=lang)
    top = r["nodes"][0]
    checks = [
        _c1_tree(lang),
        _c2_baseline(r["p0"], df, lang),
        _c3_counts(top, lang),
        _c4_reference(lang),
        _c5_multiplicity(top, r["n_tscan_flags"], r["n_naive_flags"], lang),
    ]
    return {"checks": checks}


def _c1_tree(lang="zh"):
    return {
        "id": "C1",
        "title": t(lang, "結果階層（樹）設計正確：父子關係反映真實的臨床歸類（不可純檢驗）",
                   "The outcome hierarchy (tree) is meaningful: parent–child links reflect real clinical grouping (untestable)"),
        "status": "info",
        "headline": t(lang, "TreeScan 同時掃<b>葉節點與其父節點</b>；樹建得對，分散在數個相關事件的訊號才聚得起來。",
                      "TreeScan scans <b>leaf nodes and their parents</b>; only a well-built tree lets a signal spread thinly across related events add up."),
        "plain": t(
            lang,
            "樹狀掃描的威力來自<b>同時看不同粒度</b>：一個真訊號可能不在單一事件夠強，卻在整個<b>系統節點</b>（父節點）"
            "上聚成顯著。前提是這棵樹<b>反映真實的臨床歸類</b>（例如 MedDRA 的 PT→HLT→SOC）。若把不相關的事件硬綁在同一"
            "父節點，會稀釋或捏造訊號。這條<b>靠領域知識</b>決定，不能用資料證明。",
            "The power of a tree scan comes from <b>looking at several granularities at once</b>: a real signal may be too weak "
            "at one specific event yet add up to significance at the whole <b>system node</b> (its parent). This rests on the tree "
            "<b>reflecting real clinical grouping</b> (e.g. MedDRA PT→HLT→SOC). Tying unrelated events under one parent dilutes or "
            "fabricates signals. This rests on <b>domain knowledge</b> and cannot be proven from data.",
        ),
        "term": t(lang, "專有名詞：結果階層；節點粒度；MedDRA SOC/HLT/PT。",
                  "Term: outcome hierarchy; node granularity; MedDRA SOC/HLT/PT."),
        "metrics": [],
    }


def _c2_baseline(p0, df, lang="zh"):
    # spread of node exposure rates around p0 under the (assumed) null
    nt = tscan_core.tscan_gen.node_table()
    leaf = np.asarray(df["leaf"], dtype=np.intp); exp = np.asarray(df["exposed"], dtype=float)
    L = tscan_core.tscan_gen.N_LEAVES
    oh = np.zeros((L, leaf.size)); oh[leaf, np.arange(leaf.size)] = 1.0
    Mn = nt["membership"] @ oh
    n_g = Mn.sum(axis=1); c_g = Mn @ exp
    rate = np.where(n_g > 0, c_g / n_g, p0)
    spread = float(np.std(rate))
    if spread < 0.05:
        status, head = "green", t(lang, "各節點接種率大致一致——基準穩，超額才看得出來。",
                                  "Node exposure rates are fairly uniform — a stable baseline, so an excess stands out.")
    elif spread < 0.10:
        status, head = "amber", t(lang, "節點間接種率有些分散——基準不夠平，留意是否有未建模的結構性差異。",
                                  "Some spread in node rates — the baseline is uneven; watch for unmodelled structure.")
    else:
        status, head = "red", t(lang, "節點接種率很分散——「常數基準」假設可疑，掃描可能誤報。",
                                "Node rates are very spread out — the 'constant baseline' assumption is doubtful and the scan may misfire.")
    return {
        "id": "C2",
        "title": t(lang, "虛無下接種率在各節點為常數基準（部分可檢驗）",
                   "Under the null the exposed fraction is a constant baseline across nodes (partly testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "Bernoulli 樹掃描比較「某節點的接種率」與「整體基準 p₀」。它假設<b>虛無下</b>各節點的接種率都等於 p₀。"
            "若不同結果節點本來就有不同的接種傾向（如年齡、適應症造成的結構），會破壞這個基準、製造假訊號。"
            "修法：在<b>分層或調整後</b>的資料上掃描，或改用條件型（自我對照）樹-時序掃描。",
            "The Bernoulli tree scan compares 'a node's exposed rate' with the overall baseline p₀, assuming that <b>under the "
            "null</b> every node's exposed rate equals p₀. If different outcome nodes genuinely have different exposure "
            "propensities (age, indication structure), that breaks the baseline and fabricates signals. Fixes: scan on "
            "<b>stratified or adjusted</b> data, or switch to a conditional (self-controlled) tree-temporal scan.",
        ),
        "term": t(lang, "專有名詞：常數基準率；Bernoulli 模型；分層掃描。",
                  "Term: constant baseline rate; Bernoulli model; stratified scan."),
        "metrics": [
            {"name": t(lang, "節點接種率離散（SD）", "spread of node rates (SD)"), "value": f"{spread:.3f}",
             "note": t(lang, "越小越接近常數基準", "smaller is closer to a constant baseline")},
            {"name": t(lang, "整體基準 p₀", "baseline p₀"), "value": f"{p0:.3f}", "note": ""},
        ],
    }


def _c3_counts(top, lang="zh"):
    m = min(top["c"], top["n"] - top["c"])
    if top["n"] >= 200 and m >= 20:
        status, head = "green", t(lang, "最強節點的事件數充足，LLR 穩定。",
                                  "The strongest node has ample counts; its LLR is stable.")
    elif top["n"] >= 60:
        status, head = "amber", t(lang, "最強節點事件數偏少——LLR 與 p 會比較不穩。",
                                  "The strongest node is thin — its LLR and p will be less stable.")
    else:
        status, head = "red", t(lang, "最強節點事件太少——掃描統計很不穩、訊號不可靠。",
                                "Too few events at the strongest node — the scan statistic is unstable and the signal unreliable.")
    return {
        "id": "C3",
        "title": t(lang, "被標出的節點有足夠的事件數嗎？（可檢驗）",
                   "Enough events at the flagged node? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "LLR 由節點裡的人數 n 與暴露數 c 決定；兩者太小，LLR 與其排列 p 都會很跳。看最強節點的 n 與較少格的計數。",
            "The LLR is driven by a node's n and exposed count c; if either is small, the LLR and its permutation p are noisy. "
            "Look at the strongest node's n and the smaller cell.",
        ),
        "term": t(lang, "專有名詞：節點事件數；對數概似比 LLR；統計精度。",
                  "Term: node event count; log-likelihood ratio (LLR); precision."),
        "metrics": [
            {"name": t(lang, "最強節點 n", "strongest node n"), "value": str(top["n"]), "note": ""},
            {"name": t(lang, "其中暴露 c", "exposed c"), "value": str(top["c"]), "note": ""},
        ],
    }


def _c4_reference(lang="zh"):
    return {
        "id": "C4",
        "title": t(lang, "排列法的虛無參考有效：虛無下個體可交換、無未建模混淆（不可純檢驗）",
                   "A valid permutation null: subjects exchangeable under the null, no unmodelled confounding (untestable)"),
        "status": "info",
        "headline": t(lang, "p 值來自<b>打亂暴露標籤</b>的虛無分布；它只在「虛無下暴露與結果節點可交換」時才正確。",
                      "The p-value comes from a <b>label-permuted</b> null; it is correct only if exposure and outcome-node are exchangeable under the null."),
        "plain": t(
            lang,
            "TreeScan 用<b>蒙地卡羅排列</b>（隨機打亂暴露標籤）建立最大 LLR 的虛無分布，據此給整體錯誤受控的 p。"
            "這假設<b>虛無下</b>暴露標籤可在個體間自由互換——即沒有會同時影響暴露與「落在哪個結果節點」的<b>未建模混淆</b>"
            "（年齡、共病、就醫行為）。若有，排列參考就不對、p 失準。修法：在分層內排列、或先做傾向分數調整。",
            "TreeScan builds the null distribution of the maximum LLR by <b>Monte-Carlo permutation</b> (randomly reshuffling "
            "exposure labels), and reads off a family-wise-error-controlled p. This assumes that <b>under the null</b> exposure "
            "labels are freely exchangeable across subjects — i.e. no <b>unmodelled confounder</b> (age, comorbidity, care-seeking) "
            "drives both exposure and which outcome node you land in. If there is, the permutation reference is wrong and p is off. "
            "Fixes: permute within strata, or adjust by a propensity score first.",
        ),
        "term": t(lang, "專有名詞：蒙地卡羅排列；可交換性；族系錯誤率（FWER）。",
                  "Term: Monte-Carlo permutation; exchangeability; family-wise error rate (FWER)."),
        "metrics": [],
    }


def _c5_multiplicity(top, n_tscan, n_naive, lang="zh"):
    if top["p"] < 0.01:
        status, head = "green", t(lang, "最強節點在校正後仍顯著——這是控制多重比較後的真訊號。",
                                  "The strongest node survives the correction — a real signal after controlling multiplicity.")
    elif top["p"] < 0.05:
        status, head = "amber", t(lang, "最強節點剛好過校正門檻——值得追蹤但別過度解讀。",
                                  "The strongest node just clears the correction — worth following up, don't over-read.")
    else:
        status, head = "red", t(lang, "校正後沒有節點顯著——多半是雜訊，別把天真未校正的警報當真。",
                                "No node is significant after correction — likely noise; don't trust the naive uncorrected alarms.")
    return {
        "id": "C5",
        "title": t(lang, "多重比較已被控制了嗎？（可檢驗）",
                   "Is the multiplicity actually controlled? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "整棵樹有很多節點，<b>每個都測一次</b>就會累積假陽性。TreeScan 用<b>最大 LLR 的排列分布</b>把這件事一次校正掉，"
            "得到族系錯誤率受控的 p。對照：天真未校正會標出更多節點。看最強節點的校正後 p，以及天真 vs TreeScan 的標記數。",
            "A whole tree has many nodes, and <b>testing each one</b> piles up false positives. TreeScan corrects for this in one "
            "shot via the <b>permutation distribution of the maximum LLR</b>, giving a family-wise-error-controlled p. Contrast: a "
            "naive uncorrected scan flags more nodes. Look at the strongest node's adjusted p and the naive-vs-TreeScan flag counts.",
        ),
        "term": t(lang, "專有名詞：族系錯誤率；最大統計量校正；假陽性。",
                  "Term: family-wise error rate; max-statistic correction; false positive."),
        "metrics": [
            {"name": t(lang, "最強節點校正後 p", "strongest node adjusted p"), "value": f"{top['p']:.3g}", "note": ""},
            {"name": t(lang, "天真標記數 / TreeScan 標記數", "naive flags / TreeScan flags"),
             "value": f"{n_naive} / {n_tscan}", "note": t(lang, "天真多為假警報", "naive ones are mostly false alarms")},
        ],
    }
