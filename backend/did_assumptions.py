"""DiD assumption checks D1-D5 — the difference-in-differences analogue of the
IV A1-A4b and RDD R1-R5 dashboards.

白話文優先：每一項先用日常語言說明在檢查什麼、結果代表什麼，專有名詞放到 `term`。

DiD 的關鍵假設是『平行趨勢』：若沒有政策，介入組與對照組的結果會以相同的步調變化。
後期本質不可檢驗（看不到反事實），但前期可用 event-study 檢查；其餘可測項目（無預期、
足夠前期、群集數）一併提供，SUTVA 則誠實標為需領域知識。

Each check returns the same shape as the IV / RDD dashboards:
    {id, title, status, headline, plain, term, metrics:[{name,value,note}]}
run_dashboard returns {"checks": [...]}; the front-end computes the worst status.
"""
from __future__ import annotations

import numpy as np

import did_core
from i18n import t


# ---------------------------------------------------------------------------
# D1 — Parallel trends (the key one): pre-period event-study coefficients ~ 0
# ---------------------------------------------------------------------------
def check_d1_parallel(df, unit, group, period, outcome, t0, lang="zh"):
    ev = did_core.event_study(df, group, period, outcome, int(t0), cluster=unit)
    p = ev["pre_max_p"]
    metrics = [
        {"name": t(lang, "前期各係數的最大 |z|", "Largest |z| among pre-period coefficients"),
         "value": round(ev["pre_max_abs_z"], 2),
         "note": t(lang, "前期係數應該都接近 0", "pre-period coefficients should all be near 0")},
        {"name": t(lang, "前期是否平行的檢定 p 值", "p-value for a pre-trend"),
         "value": round(p, 3) if np.isfinite(p) else None,
         "note": t(lang, "p 大（>0.05）代表看不出前期就分岔",
                   "a large p (>0.05) means no detectable pre-trend")},
    ]
    if not np.isfinite(p) or not ev["pre_periods"]:
        status = "info"
        head = t(lang, "前期資料不足，無法檢查平行趨勢，需靠領域知識判斷。",
                 "Not enough pre-periods to test parallel trends; rely on domain knowledge.")
    elif p >= 0.10:
        status = "green"
        head = t(lang, "政策實施前，兩組的趨勢看起來一致，支持平行趨勢假設。",
                 "Before the policy, the two groups trend together — supporting parallel trends.")
    elif p >= 0.05:
        status = "amber"
        head = t(lang, "前期趨勢有點分岔的跡象，平行趨勢要保守看待。",
                 "Some hint of a diverging pre-trend; treat parallel trends with caution.")
    else:
        status = "red"
        head = t(lang, "政策前兩組就已經分岔，平行趨勢可能不成立，DiD 結果要打折扣。",
                 "The groups already diverge before the policy — parallel trends may fail; discount the DiD.")
    return {
        "id": "D1",
        "title": t(lang, "沒有政策的話，兩組會一起變嗎？（平行趨勢）",
                   "Absent the policy, would the two groups have moved together? (parallel trends)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "DiD 最關鍵的前提是『平行趨勢』：如果政策沒發生，介入組與對照組的結果會以相同步調變化。"
            "這個前提在『後期』本質上無法驗證（看不到沒實施政策的反事實），但我們可以看『前期』："
            "把政策前每一期的『介入減對照』畫出來，如果前期都貼在 0 附近、沒有提早分岔，就是平行趨勢的有力佐證。"
            "那如果前期就分岔了呢？不一定整個作廢——可改用允許不同前期趨勢的做法（如加上組別專屬時間趨勢、"
            "或 ⑤『用 AI 強化』裡的雙重穩健／合成控制），但結論要更保守。",
            "DiD's key premise is parallel trends: absent the policy, treated and control outcomes would move "
            "at the same pace. This cannot be verified in the post period (we never see the no-policy counterfactual), "
            "but we CAN inspect the pre period: plot the treated-minus-control gap for each pre-policy period; "
            "if they hug 0 with no early divergence, that supports parallel trends. If they DO diverge early, the "
            "design is not automatically void — you can allow group-specific trends, or use the doubly-robust / "
            "synthetic-control ideas in '⑤ Boost with AI' — but interpret more cautiously.",
        ),
        "term": t(lang, "平行趨勢（parallel trends）＝如果政策從沒發生，介入組與對照組的結果會以「一樣的步調」變化——兩條線高低可以不同，但上下起伏要同步；這是 DiD 能把效果歸功於政策的根本前提。事件研究前期檢定（event-study pre-trend test）＝把政策上路前每一期的「介入減對照」差距畫出來、各自做檢定；若這些前期差距都貼近 0，代表政策前兩組確實同步，是平行趨勢成立的有力佐證。",
                  "Parallel trends = if the policy had never happened, the treated and control outcomes would move at the same pace — the two lines can sit at different heights but their ups and downs stay in step; this is the bedrock that lets DiD credit the change to the policy. Event-study pre-trend test = plot and test the treated-minus-control gap for each period before the policy; if those pre-period gaps all hug 0, the two groups really were moving together beforehand, strong support for parallel trends."),
        "metrics": metrics,
        "_event_study": ev,
    }


# ---------------------------------------------------------------------------
# D2 — No anticipation: the period just before the policy shows no jump
# ---------------------------------------------------------------------------
def check_d2_anticipation(ev, t0, lang="zh"):
    q = int(t0) - 1
    coef = se = None
    for i, qq in enumerate(ev["periods"]):
        if qq == q:
            coef = ev["coef"][i]; se = ev["se"][i]
    # If the immediate pre-period IS the base (coef fixed 0), use the earliest pre.
    z = abs(coef / se) if (coef is not None and se and se > 0) else 0.0
    metrics = [
        {"name": t(lang, f"政策前最後一期（第 {q} 期）的處置係數",
                   f"Treated coefficient at the last pre-period (period {q})"),
         "value": round(coef, 3) if coef is not None else t(lang, "（基期）", "(base)"),
         "note": t(lang, "接近 0 代表政策上路前沒有提前反應",
                   "near 0 means no jump before the policy starts")},
    ]
    if coef is None or z < 1.96:
        status = "green"
        head = t(lang, "政策上路前沒有看到提前反應，符合『無預期』。",
                 "No jump appears before the policy starts — consistent with no anticipation.")
    else:
        status = "amber"
        head = t(lang, "政策上路前似乎就有變化，可能有預期效應，要留意。",
                 "Outcomes seem to move before the policy starts — possible anticipation; be careful.")
    return {
        "id": "D2",
        "title": t(lang, "大家有沒有『提前反應』政策？（無預期）",
                   "Did anyone react before the policy started? (no anticipation)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "如果政策在公布後、正式上路前，大家就先改變行為（例如提前去打疫苗），"
            "那『前期』就會混進一部分效果，DiD 會被汙染。我們特別看政策上路前最後一期有沒有異常跳動。",
            "If people change behaviour after the announcement but before the policy formally starts "
            "(e.g. getting vaccinated early), some effect leaks into the pre period and contaminates the DiD. "
            "We specifically check the last pre-policy period for an abnormal jump.",
        ),
        "term": t(lang, "無預期假設（no-anticipation assumption）＝政策正式上路「之前」，沒有人因為預期它要來而提前改變行為（例如聽到要發補助就提前去打疫苗）。如果有人提前反應，這部分效果會跑進「前期」，讓政策前看起來就有變化，污染前後比較、使 DiD 高估或低估。所以我們特別檢查政策上路前最後一期有沒有異常跳動。",
                  "No-anticipation assumption = before the policy formally starts, nobody changes behaviour because they expect it (e.g. rushing to get vaccinated once a subsidy is announced). If people do react early, that slice of the effect leaks into the pre period, makes things look like they already moved before the policy, and contaminates the before/after comparison — biasing the DiD. That is why we specifically check the last pre-policy period for an abnormal jump."),
        "metrics": metrics,
    }


# ---------------------------------------------------------------------------
# D3 — Enough pre-periods & a balanced panel
# ---------------------------------------------------------------------------
def check_d3_panel(df, unit, period, group, t0, lang="zh"):
    periods = sorted(int(v) for v in np.unique(df[period]))
    n_pre = sum(1 for q in periods if q < int(t0))
    n_post = sum(1 for q in periods if q >= int(t0))
    # balance: every unit observed in every period?
    counts = df.groupby(unit)[period].nunique()
    balanced = bool((counts == len(periods)).all())
    metrics = [
        {"name": t(lang, "政策前期數 / 政策後期數", "Pre-periods / post-periods"),
         "value": f"{n_pre} / {n_post}",
         "note": t(lang, "前期≥2 才能檢查平行趨勢", "need ≥2 pre-periods to check parallel trends")},
        {"name": t(lang, "面板是否完整（每單位每期都有）", "Balanced panel (every unit in every period)"),
         "value": t(lang, "是" if balanced else "否", "yes" if balanced else "no"),
         "note": t(lang, "完整面板較不易因組成改變而偏誤",
                   "a balanced panel is less prone to composition bias")},
    ]
    if n_pre >= 2 and balanced:
        status = "green"
        head = t(lang, "前期足夠且面板完整，足以檢查平行趨勢、組成穩定。",
                 "Enough pre-periods and a balanced panel — fine for checking trends and stable composition.")
    elif n_pre >= 1:
        status = "amber"
        head = t(lang, "前期偏少或面板不完整，平行趨勢檢查與結論會比較弱。",
                 "Few pre-periods or an unbalanced panel — the pre-trend check and conclusions are weaker.")
    else:
        status = "red"
        head = t(lang, "沒有政策前的資料，無法檢查平行趨勢，DiD 風險高。",
                 "No pre-policy data — parallel trends cannot be checked; the DiD is risky.")
    return {
        "id": "D3",
        "title": t(lang, "前期夠多、資料夠完整嗎？", "Enough pre-periods and a complete panel?"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "要檢查平行趨勢，至少要有兩個政策前的時間點；而且最好每個單位在每一期都有資料"
            "（完整面板），否則『前後比較』可能其實是在比不同的人，產生組成偏誤。",
            "To check parallel trends you need at least two pre-policy time points; ideally every unit is "
            "observed in every period (a balanced panel), otherwise a before/after comparison may actually "
            "compare different units — composition bias.",
        ),
        "term": t(lang, "平衡面板（balanced panel）＝每一個單位（社區）在每一期都有資料，沒有人中途加入或退出；資料表沒有缺格。組成穩定（stable composition）＝你前後比較的是「同一批人」，而不是因為有人來、有人走，導致前期和後期其實是不同的人。一旦組成會變，前後差異可能只是換了人造成的（組成偏誤），而非政策效果。",
                  "Balanced panel = every unit (community) has data in every period, with nobody joining or dropping out partway, so there are no empty cells in the table. Stable composition = your before/after comparison is on the same set of units, not a pre period and a post period made up of different people because some entered and others left. When the mix changes, a before/after gap can reflect a change of who is in the sample (composition bias) rather than the policy's effect."),
        "metrics": metrics,
    }


# ---------------------------------------------------------------------------
# D4 — SUTVA / no spillover (not testable)
# ---------------------------------------------------------------------------
def check_d4_sutva(lang="zh"):
    return {
        "id": "D4",
        "title": t(lang, "對照組有沒有被『波及』？（SUTVA／無外溢）",
                   "Is the control group affected by the treatment? (SUTVA / no spillover)"),
        "status": "info",
        "headline": t(lang, "這需要靠領域知識判斷，無法只用資料證明。",
                      "This rests on domain knowledge; it cannot be proven from data alone."),
        "plain": t(
            lang,
            "DiD 假設『對照組沒有受到政策影響』。如果政策會外溢——例如介入社區的人會到隔壁對照社區打疫苗、"
            "或政策改變了整個地區的氛圍——對照組就不再是乾淨的比較基準，估計會偏。"
            "盡量讓介入與對照在地理/時間上分隔，並以領域知識論證沒有明顯外溢。",
            "DiD assumes the control group is unaffected by the policy. If there are spillovers — e.g. people from "
            "treated communities get vaccinated in a neighbouring control community, or the policy shifts the whole "
            "region's climate — the control is no longer a clean benchmark and the estimate is biased. Keep treated "
            "and control separated in space/time and argue from domain knowledge that spillover is negligible.",
        ),
        "term": t(lang, "SUTVA（穩定單位處置值假設）＝一個單位的結果只取決於「它自己」有沒有受政策影響，不會被別的單位是否受政策牽動；簡單說就是各組互不干擾。外溢、干擾（spillover, interference）＝政策的影響「漏」到了對照組，例如介入社區的人跑去隔壁對照社區打疫苗、或政策改變了整個地區的氛圍。一旦發生，對照組就不再是乾淨的比較基準，DiD 估計會偏掉。",
                  "SUTVA (stable unit treatment value assumption) = a unit's outcome depends only on whether it itself is treated, not on whether other units are treated — in plain terms, the groups do not interfere with each other. Spillover, interference = the policy's effect leaks into the control group, e.g. people from a treated community get vaccinated in a neighbouring control community, or the policy shifts the mood of the whole region. Once that happens the control is no longer a clean benchmark and the DiD estimate is biased."),
        "metrics": [],
    }


# ---------------------------------------------------------------------------
# D5 — Enough clusters for valid cluster-robust inference
# ---------------------------------------------------------------------------
def check_d5_clusters(df, unit, lang="zh"):
    G = int(np.unique(df[unit]).size)
    metrics = [
        {"name": t(lang, "群集（單位）數量", "Number of clusters (units)"),
         "value": G,
         "note": t(lang, "群集太少時，標準誤會不可靠",
                   "with too few clusters, standard errors are unreliable")},
    ]
    if G >= 30:
        status = "green"
        head = t(lang, "群集數量足夠，cluster-robust 標準誤可信。",
                 "Plenty of clusters — the cluster-robust standard errors are trustworthy.")
    elif G >= 15:
        status = "amber"
        head = t(lang, "群集數量偏少，標準誤可能偏小，建議用更保守的推論（如 wild bootstrap）。",
                 "Few clusters — standard errors may be too small; consider more conservative inference (wild bootstrap).")
    else:
        status = "red"
        head = t(lang, "群集太少，cluster-robust 標準誤不可靠，p 值與信賴區間都要存疑。",
                 "Too few clusters — cluster-robust SEs are unreliable; distrust the p-values and CIs.")
    return {
        "id": "D5",
        "title": t(lang, "做推論的『群集』夠多嗎？", "Are there enough clusters for inference?"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "政策是按『單位』（社區）開關的，所以同一單位內各期的觀測值彼此相關，標準誤要以單位為群集計算"
            "（cluster-robust）。但這種標準誤需要『夠多的群集』才可靠；群集太少時會低估不確定性、"
            "讓 p 值看起來太漂亮。",
            "The policy switches on/off by unit (community), so observations within a unit are correlated and the "
            "standard error must be clustered by unit. But cluster-robust SEs need enough clusters to be reliable; "
            "with too few, they understate uncertainty and make p-values look too good.",
        ),
        "term": t(lang, "群集穩健標準誤（cluster-robust standard errors）＝同一個單位（社區）在不同期的觀測值會彼此相關，不能當成各自獨立；這種標準誤把「同一單位內各期」當成一群一起算，避免高估資訊量、把不確定性算得太小。群集數量不足問題（few-clusters problem）＝這套算法要「夠多群集」才準；社區數太少時，它會低估不確定性、讓 p 值與信賴區間看起來太漂亮，這時改用較保守的做法（如 wild bootstrap）比較安全。",
                  "Cluster-robust standard errors = observations from the same unit (community) across periods are correlated rather than independent, so this standard error treats all periods within a unit as one cluster, avoiding overcounting the information and understating the uncertainty. The few-clusters problem = this method needs enough clusters to be accurate; with too few communities it understates uncertainty and makes p-values and confidence intervals look too good, so a more conservative approach (such as a wild bootstrap) is safer."),
        "metrics": metrics,
    }


# ---------------------------------------------------------------------------
# Run the full DiD dashboard
# ---------------------------------------------------------------------------
def run_dashboard(df, unit, period, group, outcome, t0, covariates=None, lang="zh"):
    d1 = check_d1_parallel(df, unit, group, period, outcome, int(t0), lang)
    ev = d1.pop("_event_study")
    checks = [
        d1,
        check_d2_anticipation(ev, int(t0), lang),
        check_d3_panel(df, unit, period, group, int(t0), lang),
        check_d4_sutva(lang),
        check_d5_clusters(df, unit, lang),
    ]
    return {"checks": checks, "t0": int(t0)}
