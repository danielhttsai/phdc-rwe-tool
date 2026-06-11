"""G-methods assumption checks C1–C5. The identification of a time-varying treatment effect
rests on SEQUENTIAL exchangeability (no unmeasured time-varying confounding) — untestable —
plus positivity at every time point, correct nuisance models, consistency, and enough data.

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}.
"""
from __future__ import annotations

import numpy as np

import gm_core
from i18n import t


def _sig(x):
    return 1.0 / (1.0 + np.exp(-x))


def run_dashboard(df, lang="zh"):
    L0 = np.asarray(df["L0"], float); A0 = np.asarray(df["A0"], float)
    L1 = np.asarray(df["L1"], float); A1 = np.asarray(df["A1"], float)
    n = len(A0)
    # positivity: fitted treatment propensity at each time; how many are near 0/1
    p0 = _sig(np.column_stack([np.ones(n), L0]) @ gm_core._logit(np.column_stack([np.ones(n), L0]), A0))
    p1 = _sig(np.column_stack([np.ones(n), A0, L1]) @ gm_core._logit(np.column_stack([np.ones(n), A0, L1]), A1))
    frac_extreme = float(np.mean((p0 < 0.05) | (p0 > 0.95) | (p1 < 0.05) | (p1 > 0.95)))
    n_treat0, n_treat1 = int(A0.sum()), int(A1.sum())
    checks = [
        _c1(lang),
        _c2_positivity(frac_extreme, lang),
        _c3_models(lang),
        _c4_consistency(lang),
        _c5_data(n, n_treat0, n_treat1, lang),
    ]
    return {"checks": checks}


def _c1(lang="zh"):
    return {
        "id": "C1",
        "title": t(lang, "序列可交換（無未測時變混淆，最關鍵、不可檢驗）",
                   "Sequential exchangeability (no unmeasured time-varying confounding — the key, untestable assumption)"),
        "status": "info",
        "headline": t(lang, "每個時點，在「過去治療＋過去共變項史」之下，當下治療要近似隨機；沒測到的時變混淆會破壞它。",
                      "At each time, given the past treatment & covariate history, the current treatment must be as-good-as random; an unmeasured time-varying confounder breaks it."),
        "plain": t(
            lang,
            "g-methods 的全部威力建立在<b>序列可交換</b>：在每個時點 t，<b>條件在到 t 為止的治療史與共變項史（含 Lₜ）</b>之下，"
            "「當下是否治療 Aₜ」與反事實結果獨立——也就是<b>沒有未測的時變混淆</b>。它<b>無法用資料證明</b>；任何沒被記錄、卻同時"
            "影響「之後治療」與「結果」的時變因子都會殘留偏誤。要靠豐富的時變共變項、領域知識與敏感度分析。",
            "All of g-methods' power rests on <b>sequential exchangeability</b>: at each time t, given the treatment and covariate "
            "history up to t (including Lₜ), whether you are treated now (Aₜ) is independent of the counterfactual outcome — i.e. "
            "<b>no unmeasured time-varying confounding</b>. It <b>cannot be proven from data</b>; any unrecorded time-varying factor "
            "that drives both later treatment and the outcome leaves residual bias. Support it with rich time-varying covariates, "
            "domain knowledge, and sensitivity analysis.",
        ),
        "term": t(lang, "序列可交換＝在每個時點，把「過去用過哪些藥、過去各項身體指標」都對齊之後，「這一刻有沒有治療」就像擲銅板一樣與將來的結果無關；只要做到這點就能比較。無未測時變混淆＝沒有任何「沒被記錄到、卻會隨時間變動」的因素，同時左右「之後會不會治療」與「最後結果」——只要有這種漏掉的因素，估出來就有偏差。可忽略性＝就是上面這件事的另一個說法：分組可看成近似隨機，所以可以放心忽略分組的不公平。這三者都無法用手上的資料證明。",
                  "Sequential exchangeability = at each time point, once you line up everyone on their past treatments and past health measurements, whether they are treated right now is like a coin flip — unrelated to their future outcome — so the groups are comparable. No unmeasured time-varying confounding = there is no factor that changes over time, was never recorded, yet pushes both later treatment and the final outcome; any such missing factor biases the estimate. Ignorability = another name for the same idea: the grouping can be treated as good-as-random, so its unfairness can safely be ignored. None of these can be proven from the data you have."),
        "metrics": [],
    }


def _c2_positivity(frac_extreme, lang="zh"):
    if frac_extreme < 0.02:
        status, head = "green", t(lang, "正性良好——每個時點、各種共變項史下，治療與不治療都還看得到。",
                                  "Good positivity — at each time and covariate history, both treating and not are observed.")
    elif frac_extreme < 0.1:
        status, head = "amber", t(lang, "有些時點的治療機率很極端——權重會變大，考慮截斷或穩定化。",
                                  "Some treatment probabilities are extreme — weights inflate; consider truncation or stabilization.")
    else:
        status, head = "red", t(lang, "正性受威脅——某些共變項史幾乎一定（不）治療，那裡的效果其實估不出來。",
                                "Positivity threatened — some histories almost surely (don't) get treated; the effect isn't estimable there.")
    return {
        "id": "C2",
        "title": t(lang, "正性：每個時點、每種史下，治療與不治療都「有可能」嗎？（可檢驗）",
                   "Positivity: at each time and history, are treating and not both possible? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "<b>正性</b>要求：在每個時點 t、每一段觀察到的史下，「治療」與「不治療」的機率都<b>大於 0</b>。若某種人在某時點"
            "<b>幾乎一定</b>會（或不會）治療，IPTW 權重會爆大、g-formula 也得外推到沒有資料的地方。可檢的指標是各時點"
            "<b>治療傾向的極端比例</b>。修法：穩定化／截斷權重，或限制在有共同支持的史。",
            "<b>Positivity</b> requires that, at each time t and each observed history, the probability of treating and of not "
            "treating is <b>above 0</b>. If some people are <b>almost certain</b> to (not) be treated at a time, IPTW weights explode "
            "and g-formula must extrapolate where there's no data. The testable metric is the <b>fraction with extreme treatment "
            "propensity</b> at each time. Fixes: stabilize/truncate weights, or restrict to histories with common support.",
        ),
        "term": t(lang, "正性＝在每個時點、每一種「病史長相」的人裡面，都要同時找得到「有治療」和「沒治療」的人；如果某種人幾乎一定會治療（或一定不治療），那種情況下的效果其實估不出來，只能硬猜。共同支持＝兩組人在共變項上要有重疊的範圍；唯有在重疊處才能公平比較，沒有重疊就無從對照。穩定化／截斷權重＝IPTW 會給每個人一個權重，極端的人權重會大到失控；「穩定化」用一個基準比例把權重縮回合理範圍，「截斷」則直接把過大的權重砍到上限，兩者都是為了讓估計不被少數極端個案綁架。",
                  "Positivity = at every time point and for every type of patient history, you must be able to find both treated and untreated people; if some type is almost certain to be treated (or never treated), the effect there simply cannot be estimated and can only be guessed. Common support = the two groups must overlap in their covariate values; only where they overlap can you compare fairly, and outside the overlap there is nothing to compare against. Stabilized / truncated weights = IPTW gives each person a weight, and extreme people get weights so large they dominate; stabilizing rescales weights back to a sensible range using a baseline rate, while truncating simply caps oversized weights — both stop a few extreme cases from hijacking the estimate."),
        "metrics": [
            {"name": t(lang, "治療傾向極端（&lt;0.05 或 &gt;0.95）比例", "fraction with extreme treatment propensity"),
             "value": f"{frac_extreme*100:.1f}%",
             "note": t(lang, "越低越好；高代表正性受威脅", "lower is better; high means positivity is threatened")},
        ],
    }


def _c3_models(lang="zh"):
    return {
        "id": "C3",
        "title": t(lang, "輔助模型設定正確（g-formula 的結果／共變項模型、IPTW 的治療模型）",
                   "Correct nuisance models (the outcome/covariate models for g-formula, the treatment models for IPTW)"),
        "status": "info",
        "headline": t(lang, "g-formula 靠 Lₜ 與 Y 的模型；IPTW 靠各時點治療模型。設錯就偏——這也是 ⑤ 用 ML 的理由。",
                      "g-formula relies on models for Lₜ and Y; IPTW on the treatment models at each time. Mis-specify them and you bias — which is why ⑤ brings in ML."),
        "plain": t(
            lang,
            "g-methods 是<b>有母數</b>的：<b>g-formula</b> 要把 Lₜ 的演變與 Y 的結果模型配對；<b>IPTW-MSM</b> 要把每個時點的"
            "治療模型配對。若這些<b>輔助模型設定錯誤</b>（漏了非線性、交互），估計就會偏——和「無未測混淆」不同，這部分"
            "<b>可以靠更彈性的模型改善</b>。實務：用樣條／交互，或<b>機器學習（見 ⑤）</b>把輔助模型配得更好；雙重穩健（TMLE，見"
            "「TMLE」分頁）讓「結果或治療模型其一對」就不偏。",
            "g-methods are <b>parametric</b>: <b>g-formula</b> fits models for how Lₜ evolves and for the outcome Y; <b>IPTW-MSM</b> "
            "fits the treatment model at each time. If these <b>nuisance models are mis-specified</b> (missing a non-linearity or "
            "interaction), the estimate is biased — unlike no-unmeasured-confounding, this part <b>can be improved with more flexible "
            "models</b>. In practice: use splines/interactions, or <b>machine learning (see ⑤)</b>; a doubly-robust estimator (TMLE, "
            "see the TMLE tab) stays unbiased if <b>either</b> the outcome or the treatment model is right.",
        ),
        "term": t(lang, "輔助模型＝為了算出最終效果，途中要先用統計模型去描述一些「中間的東西」（例如某種人有多大機率被治療、身體指標會怎麼變、結果大概多少）；它們本身不是我們關心的答案，只是過程中的工具，但工具配錯，答案就跟著錯。g-formula／IPTW＝兩種不同的算法路線：g-formula 靠「結果與共變項怎麼演變」的模型一步步推算，IPTW 則靠「每個時點被治療的機率」去加權重新平衡兩組人。雙重穩健＝一種保險設計：同時準備「結果模型」和「治療模型」兩道防線，只要其中一道配對了，最終估計就不會偏，等於多一層保障。機器學習輔助估計＝改用更有彈性的機器學習方法去配這些輔助模型，比死板的直線假設更能抓住真實的曲折關係，降低配錯的風險。",
                  "Nuisance models = to reach the final answer you must first use statistical models to describe some 'in-between' quantities (e.g. how likely a type of person is to be treated, how health indicators evolve, roughly what the outcome will be); these are not the answer we care about, just tools along the way — but if a tool is wrong, the answer goes wrong with it. g-formula / IPTW = two different calculation routes: g-formula works step by step from models of how the outcome and covariates evolve, while IPTW uses the probability of being treated at each time to reweight and rebalance the two groups. Double robustness = a safety design: you prepare two lines of defence — an outcome model and a treatment model — and as long as either one is right, the final estimate stays unbiased, giving you a backup. ML-assisted estimation = fitting those nuisance models with more flexible machine-learning methods, which capture real-world bends and curves better than rigid straight-line assumptions and so cut the risk of mis-specification."),
        "metrics": [],
    }


def _c4_consistency(lang="zh"):
    return {
        "id": "C4",
        "title": t(lang, "一致性／策略定義明確（well-defined interventions，不可純檢驗）",
                   "Consistency / well-defined regimes (largely untestable)"),
        "status": "info",
        "headline": t(lang, "「全程用藥 vs 全程不用」要是<b>定義明確</b>的介入；模糊的暴露讓反事實沒有清楚意義。",
                      "'Always treat vs never treat' must be a <b>well-defined</b> intervention; a vague exposure leaves the counterfactual ill-defined."),
        "plain": t(
            lang,
            "估計目標是一個<b>動態／靜態策略</b>的反事實對比（這裡：每期都用 vs 每期都不用）。<b>一致性</b>要求觀察到「依該策略"
            "行動」的人，其結果就等於該策略下的反事實——這需要<b>介入定義明確</b>（多少劑量、什麼時點）。定義含糊（如「健康生活」）"
            "會讓反事實沒有單一意義。也要注意每個人在每時點都可被指派到任一臂（與正性相連）。",
            "The estimand is a counterfactual contrast of a <b>regime</b> (here: treat every period vs none). <b>Consistency</b> "
            "requires that, for people observed to follow the regime, their outcome equals the regime's counterfactual — which needs a "
            "<b>well-defined intervention</b> (what dose, at what time). A vague exposure (e.g. 'healthy lifestyle') leaves the "
            "counterfactual without a single meaning. It also requires that everyone could be assigned to either arm at each time "
            "(tied to positivity).",
        ),
        "term": t(lang, "一致性＝對那些「實際上剛好照著某套用藥方式做」的人，他們真實看到的結果，就能直接當成「如果大家都照這套方式做」的反事實結果；要成立，前提是這套方式講得夠清楚、沒有歧義。明確介入＝把要比較的做法講到一清二楚：用什麼藥、用多少、什麼時候用——如果只說「過健康生活」這種模糊指令，每個人理解不同，反事實就沒有單一意義。動態／靜態治療策略＝兩種治療規則：靜態是「不管你身體怎樣，每期都照同一套做」（例如每期都用藥）；動態是「看你當下的身體指標再決定要不要治療」，會隨情況調整。",
                  "Consistency = for people who happen to follow a particular treatment plan in real life, the outcome they actually experience can be taken directly as the counterfactual outcome of 'everyone following that plan'; this only holds if the plan is described clearly enough to be unambiguous. Well-defined intervention = spelling out exactly what is being compared: which drug, how much, and when — if the instruction is vague like 'live a healthy lifestyle', everyone interprets it differently and the counterfactual has no single meaning. Dynamic / static treatment regime = two kinds of treatment rule: a static one applies the same plan every period regardless of the patient's state (e.g. treat in every period); a dynamic one decides whether to treat based on the patient's current measurements, adjusting as circumstances change."),
        "metrics": [],
    }


def _c5_data(n, n_treat0, n_treat1, lang="zh"):
    m = min(n_treat0, n - n_treat0, n_treat1, n - n_treat1)
    ratio = m / max(n, 1)
    if ratio >= 0.2:
        status, head = "green", t(lang, "各時點治療／未治療都有充足人數，估計穩定。",
                                  "Plenty of treated and untreated at each time; estimates are stable.")
    elif ratio >= 0.08:
        status, head = "amber", t(lang, "某些時點的某一臂人數偏少——估計變異會偏大。",
                                  "Some arm at some time is thin — variance will be larger.")
    else:
        status, head = "red", t(lang, "某時點幾乎全治療或全不治療——那一格資訊太少、估不準。",
                                "At some time almost everyone is (un)treated — too little information there.")
    return {
        "id": "C5",
        "title": t(lang, "每個時點都有足夠的治療與未治療人數嗎？（可檢驗）",
                   "Enough treated and untreated at each time? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "時變治療把人切成許多「史×當下治療」的格子；要估得準，<b>每個時點的治療與未治療都要有夠多人</b>。某一臂太少，"
            "權重與外推都會不穩。這個指標看各時點兩臂的最小人數比例。",
            "Time-varying treatment splits people into many 'history × current-treatment' cells; for a stable estimate you need "
            "<b>enough treated and untreated at each time</b>. If one arm is thin, weights and extrapolation become unstable. This "
            "metric is the smallest arm share across times.",
        ),
        "term": t(lang, "每時點正性＝在每一個時間點上，都要同時有夠多「有治療」和「沒治療」的人；只要某個時點幾乎全部都治療或全部都不治療，那一格就沒東西可比，估出來不可靠。有效樣本＝真正在貢獻資訊的人數，往往遠少於名目上的總人數；當權重很不平均、或某一臂人很少時，實際能用的資訊就被稀釋掉了。資料稀疏＝把人按「病史×當下治療」切成許多小格後，有些格子裡幾乎沒人；格子一空，那裡的估計就只能靠外推硬補，變得很不穩。",
                  "Per-time positivity = at every single time point you must have enough people who were treated and enough who were not; if at some time almost everyone is treated (or almost no one is), that cell has nothing to compare and its estimate is unreliable. Effective sample = the number of people actually contributing information, which is often far smaller than the headline total; when weights are very uneven or one arm is thin, the usable information gets diluted. Data sparsity = once people are sliced into many small cells by 'history x current treatment', some cells end up almost empty; an empty cell forces the estimate there to be patched in by extrapolation, making it very unstable."),
        "metrics": [
            {"name": t(lang, "第 1 期治療人數", "treated at time 1"), "value": f"{n_treat0} / {n}", "note": ""},
            {"name": t(lang, "第 2 期治療人數", "treated at time 2"), "value": f"{n_treat1} / {n}", "note": ""},
        ],
    }
