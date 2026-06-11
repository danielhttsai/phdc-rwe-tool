"""Trend-in-trend assumption checks A1-A5 — the analogue of the IV / RDD / DiD
dashboards, following Ji, Small, Leonard & Hennessy (2017).

白話文優先：每一項先用日常語言說明在檢查什麼、結果代表什麼，專有名詞放到 `term`。
TiT 最關鍵的假設（A4：沒有與暴露趨勢跨層相關的未測混淆趨勢）無法用資料證明，我們誠實
標示；其餘可測（暴露趨勢夠強、結果夠罕見、共變項不隨時間漂、模型可乘分離）一併提供。

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}; the front-end computes the worst status.
"""
from __future__ import annotations

import numpy as np

import tit_core
from i18n import t


def run_dashboard(df, covariates=("x1", "x2"), K=5, lang="zh"):
    strat_map, auc = tit_core.cpe_strata(df, list(covariates), K=K)
    cells = tit_core.build_cells(df, strat_map, K=K)
    periods = cells["periods"]
    expo_overall = np.array([float(cells["p"][cells["t"] == tp].mean()) for tp in periods])
    out_rate = float(df["outcome"].mean())

    checks = [
        _a1_trend(expo_overall, lang),
        _a2_rare(out_rate, lang),
        _a3_covariate_trend(df, list(covariates), periods, lang),
        _a4_confounder_trend(lang),
        _a5_multiplicative(auc, lang),
    ]
    return {"checks": checks, "K": K}


def _a1_trend(expo_overall, lang="zh"):
    change = float(expo_overall[-1] - expo_overall[0])
    metrics = [
        {"name": t(lang, "暴露盛行率：期初 → 期末", "Exposure prevalence: first → last period"),
         "value": f"{expo_overall[0]*100:.0f}% → {expo_overall[-1]*100:.0f}%",
         "note": t(lang, "差距越大，工具越有力", "the bigger the change, the more powerful the design")},
        {"name": t(lang, "整段變化幅度", "Total change"),
         "value": f"{change*100:.0f} %pt",
         "note": t(lang, "建議 ≥ 10 個百分點", "ideally ≥ 10 percentage points")},
    ]
    if change >= 0.10:
        status = "green"
        head = t(lang, "暴露盛行率隨時間有明顯趨勢，trend-in-trend 有足夠的訊號可用。",
                 "Exposure prevalence trends clearly over time — the design has enough signal.")
    elif change >= 0.05:
        status = "amber"
        head = t(lang, "暴露趨勢偏弱，估計會比較不穩、檢定力低。",
                 "The exposure trend is weak — the estimate will be unstable with low power.")
    else:
        status = "red"
        head = t(lang, "幾乎沒有暴露趨勢，trend-in-trend 失去識別基礎，不建議使用。",
                 "Almost no exposure trend — trend-in-trend loses its identifying basis; not advisable.")
    return {
        "id": "A1",
        "title": t(lang, "暴露隨時間有夠強的趨勢嗎？", "Does exposure trend strongly enough over time?"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "trend-in-trend 的整個識別力都來自『暴露盛行率隨日曆時間上升』這個趨勢——而且不同 CPE 層"
            "上升的速度不同。趨勢越強，能用來識別因果的訊號越多；如果暴露率幾乎不動（例如老藥、"
            "普及率早就穩定），這個方法就沒東西可用。這是它最大的前提，也是它檢定力的主要來源。",
            "Trend-in-trend draws ALL of its identifying power from the rise in exposure prevalence over "
            "calendar time — rising at different rates across CPE strata. The stronger the trend, the more signal "
            "there is to identify the effect; if exposure barely moves (an old drug at stable uptake) the method has "
            "nothing to work with. This is its biggest premise and the main driver of its power.",
        ),
        "term": t(lang, "暴露盛行率的時間趨勢＝同一種藥（或處置）在族群裡被使用的比例，隨著日曆年份往上（或往下）走的幅度。這條趨勢就是 trend-in-trend 唯一的「施力點」：用藥率變得越多，方法能抓到的因果訊號就越強；如果一直平平的，方法等於沒東西可分析。",
                  "Temporal trend in exposure prevalence = how much the share of people using the drug (or treatment) rises or falls across calendar years. This trend is the only thing trend-in-trend has to push against: the more the usage rate moves, the more causal signal there is to capture; if it stays flat, the method has nothing to analyse."),
        "metrics": metrics,
    }


def _a2_rare(out_rate, lang="zh"):
    metrics = [
        {"name": t(lang, "整體結果發生率", "Overall outcome rate"),
         "value": f"{out_rate*100:.1f}%",
         "note": t(lang, "建議 < 5%（罕見結果近似才成立）",
                   "ideally < 5% (the rare-outcome approximation)")},
    ]
    if out_rate < 0.05:
        status = "green"
        head = t(lang, "結果夠罕見，勝算比≈相對風險的近似成立。",
                 "The outcome is rare enough — the odds-ratio ≈ risk-ratio approximation holds.")
    elif out_rate < 0.10:
        status = "amber"
        head = t(lang, "結果不算很罕見，估計的尺度解讀要小心。",
                 "The outcome is not very rare — interpret the scale of the estimate with care.")
    else:
        status = "red"
        head = t(lang, "結果太常見，trend-in-trend 的罕見近似可能失效。",
                 "The outcome is too common — the rare-outcome approximation may fail.")
    return {
        "id": "A2",
        "title": t(lang, "結果夠罕見嗎？", "Is the outcome rare enough?"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "trend-in-trend 的概似建立在『結果是罕見事件』的近似上（這時勝算比和相對風險很接近、"
            "數學會簡化）。如果結果其實很常見，這層近似就不夠好，估計尺度的解讀要更謹慎。",
            "The trend-in-trend likelihood is built on a rare-outcome approximation (then the odds ratio and the "
            "risk ratio nearly coincide and the maths simplifies). If the outcome is actually common, that "
            "approximation is shaky and the scale of the estimate needs more caution.",
        ),
        "term": t(lang, "罕見結果假設＝假定我們研究的事件（例如某種嚴重副作用）發生機率很低、很少見。在這種情況下，「勝算比」和「相對風險」這兩種衡量風險的方式幾乎一樣，背後的數學就能大幅簡化；trend-in-trend 的計算正是建立在這個簡化上。一旦結果其實很常見，這個近似就不準，估出來的風險尺度要打折看待。",
                  "Rare-outcome assumption = assuming the event we study (say, a serious side effect) happens with low probability and is uncommon. When that holds, two ways of measuring risk — the odds ratio and the risk ratio — nearly coincide and the underlying maths simplifies a lot; trend-in-trend's calculation is built on that simplification. If the outcome is actually common, the approximation breaks down and the estimated risk scale should be read with a discount."),
        "metrics": metrics,
    }


def _a3_covariate_trend(df, covariates, periods, lang="zh"):
    # do the (cell-mean) baseline covariates drift over calendar time?
    worst = 0.0
    rows = []
    for c in covariates:
        means = np.array([float(df.loc[df["period"] == tp, c].mean()) for tp in periods])
        sd = float(df[c].std()) + 1e-9
        drift = abs(means[-1] - means[0]) / sd      # standardized drift
        worst = max(worst, drift)
        rows.append({"name": t(lang, f"共變項隨時間漂移：{c}", f"Covariate drift over time: {c}"),
                     "value": round(drift, 3),
                     "note": t(lang, "接近 0 代表沒有隨時間漂", "near 0 means no drift over time")})
    if worst < 0.15:
        status = "green"
        head = t(lang, "基線特徵不隨日曆時間漂移，符合假設。",
                 "Baseline characteristics do not drift over calendar time — assumption met.")
    elif worst < 0.35:
        status = "amber"
        head = t(lang, "有些特徵隨時間略有漂移，要留意是否與暴露趨勢混在一起。",
                 "Some characteristics drift a little over time — watch for confounding with the exposure trend.")
    else:
        status = "red"
        head = t(lang, "特徵隨時間明顯漂移，可能與暴露趨勢糾纏，估計要保守看。",
                 "Characteristics drift clearly over time — possibly entangled with the exposure trend; interpret with caution.")
    return {
        "id": "A3",
        "title": t(lang, "可測的背景特徵不隨時間漂移嗎？", "Do measured characteristics stay stable over time?"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "trend-in-trend 假設『背景特徵不隨日曆時間系統性改變』（或就算變也與暴露趨勢無關）。"
            "如果隨著時間，使用者的年齡、疾病組成等悄悄改變，而且剛好跟暴露上升同步，就會混淆估計。"
            "我們檢查可測特徵在各時間點的平均有沒有漂移；看不見的特徵則屬於 A4。",
            "Trend-in-trend assumes measured characteristics do not change systematically over calendar time "
            "(or that any change is unrelated to the exposure trend). If, over time, the case mix quietly shifts in step "
            "with rising exposure, it confounds the estimate. We check whether measured covariates drift across periods; "
            "unmeasured ones fall under A4.",
        ),
        "term": t(lang, "共變項的時間穩定性＝病人的背景特徵（年齡、性別、合併疾病等這些「共變項」）在不同年份之間是不是大致維持一樣、沒有悄悄改變。如果使用者的組成隨時間慢慢變了，而且剛好跟用藥率上升同步，方法就會把這種變化誤當成藥的效果；所以我們檢查這些可測特徵在各時間點的平均值有沒有漂移。",
                  "Temporal stability of covariates = whether patients' background characteristics (age, sex, comorbidities — the covariates) stay roughly the same across years rather than quietly shifting. If the patient mix drifts over time and happens to move in step with rising usage, the method can mistake that drift for a drug effect; so we check whether these measured features' averages drift across time points."),
        "metrics": rows,
    }


def _a4_confounder_trend(lang="zh"):
    return {
        "id": "A4",
        "title": t(lang, "有沒有『跟著暴露一起隨時間變』的看不見因素？（關鍵、不可檢驗）",
                   "Any unmeasured factor that trends WITH exposure over time? (key, untestable)"),
        "status": "info",
        "headline": t(lang, "這是 trend-in-trend 最關鍵的假設，無法用資料證明，要靠領域知識。",
                      "This is trend-in-trend's key assumption; it cannot be proven from data and rests on domain knowledge."),
        "plain": t(
            lang,
            "trend-in-trend 不怕『固定不動的混淆』——那會被 CPE 分層與層別基線吸收掉。它真正怕的是"
            "『一個看不見的因素，剛好也隨日曆時間變化，而且這個變化在不同 CPE 層之間，與暴露的上升趨勢相關』。"
            "例如：診斷標準逐年改變、整體醫療行為的時代變遷，若剛好和用藥潮同步又跨層不一致，就會假裝成因果。"
            "好消息：會破壞 trend-in-trend 的情境，是會破壞傳統世代研究情境的『子集』——所以它比世代研究更穩；"
            "壞消息：仍需用領域知識論證沒有這種『與暴露趨勢同步的時代變化』。",
            "Trend-in-trend is NOT troubled by fixed confounding — that is absorbed by CPE stratification and the "
            "stratum baselines. What it truly fears is an unmeasured factor that ALSO changes over calendar time, with "
            "that change correlated with the exposure trend ACROSS strata. For instance: diagnostic criteria drifting "
            "year by year, or secular shifts in practice, if they happen to move in step with the uptake wave and "
            "differently across strata, can masquerade as causation. The good news: the scenarios that break "
            "trend-in-trend are a SUBSET of those that break an ordinary cohort study — so it is more robust; the bad "
            "news: you still need domain knowledge to argue no such exposure-synchronised secular change exists.",
        ),
        "term": t(lang, "與暴露趨勢相關的未測混淆趨勢＝一個我們沒量到、看不見的因素，它本身也隨著年份在變，而且這個變化在不同 CPE 層之間，剛好跟用藥率的上升「步調一致」。例如診斷標準逐年放寬、或整體醫療習慣的時代變遷，若正好和用藥潮同進退又跨層不一致，就會假裝成藥的因果效果。固定不動的混淆 trend-in-trend 不怕（會被分層吸收掉），它真正怕的就是這種「跟著暴露一起變」的看不見趨勢——而這只能靠領域知識去論證它不存在，資料本身證不了。",
                  "Unmeasured confounder trends correlated with the exposure trend across strata = a factor we never measured and cannot see, which itself changes over the years AND whose change happens to move in step with rising usage, differently across CPE strata. For example, diagnostic criteria loosening year by year, or secular shifts in medical practice, can masquerade as a drug effect if they rise and fall together with the uptake wave and unevenly across strata. Fixed confounding does not worry trend-in-trend (stratification absorbs it); what it truly fears is this kind of unseen trend that moves WITH exposure — and only domain knowledge, not the data itself, can argue it away."),
        "metrics": [],
    }


def _a5_multiplicative(auc, lang="zh"):
    metrics = [
        {"name": t(lang, "CPE 模型區辨力（c 統計量／AUC）", "CPE model discrimination (c-statistic / AUC)"),
         "value": round(auc, 3) if np.isfinite(auc) else None,
         "note": t(lang, "越高代表分層越能拉開暴露趨勢差異",
                   "higher means the strata separate the exposure trends better")},
    ]
    if np.isfinite(auc) and auc >= 0.70:
        status = "green"
        head = t(lang, "CPE 模型能有效把人分到暴露趨勢不同的層，分層基礎良好。",
                 "The CPE model separates people into strata with distinct exposure trends — a good basis.")
    elif np.isfinite(auc) and auc >= 0.60:
        status = "amber"
        head = t(lang, "CPE 模型區辨力一般，分層帶來的趨勢差異有限，檢定力會受影響。",
                 "The CPE model is only moderately discriminating — limited trend separation and reduced power.")
    else:
        status = "info"
        head = t(lang, "CPE 模型區辨力偏低，建議加入更強的暴露預測因子。",
                 "Low CPE discrimination — consider adding stronger predictors of exposure.")
    return {
        "id": "A5",
        "title": t(lang, "分層與可乘結構站得住嗎？", "Do the stratification and multiplicative structure hold up?"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "trend-in-trend 先用基線特徵估每個人的『累積暴露機率（CPE）』再分層，並假設共變項對暴露的影響"
            "與時間是『可乘分離』的（covariate 效果不隨時間交互）。CPE 模型若能有力地預測誰會暴露，"
            "各層的暴露時間趨勢差異就拉得開、識別力更好。這裡用 c 統計量（AUC）當分層品質的指標。",
            "Trend-in-trend first estimates each person's cumulative probability of exposure (CPE) from baseline "
            "characteristics and stratifies on it, assuming covariate effects on exposure separate multiplicatively from "
            "time (no covariate-by-time interaction). The more strongly the CPE model predicts who gets exposed, the "
            "more the strata's exposure-time trends differ and the better the identification. We use the c-statistic "
            "(AUC) as a measure of stratification quality.",
        ),
        "term": t(lang, "累積暴露機率（CPE）分層＝先用每個人的背景特徵算出「這個人有多大機會用到這種藥」，再依這個機率把人分成幾層；機率相近的人歸在同一層，方法就在層內比較。可乘的共變項-時間結構＝假設背景特徵對「會不會用藥」的影響，跟時間的影響是「相乘可拆開」的，也就是特徵的效果不會隨年份而改變方向或強度（沒有特徵×時間的交互作用）。c 統計量（AUC）＝衡量上面那個 CPE 模型「分得準不準」的分數，介於 0.5（等於亂猜）到 1（完美區辨），越高代表越能把暴露趨勢不同的人拉開、識別力越好。",
                  "Cumulative-probability-of-exposure (CPE) stratification = first work out, from each person's background features, how likely they are to use this drug, then sort people into layers by that probability; those with similar probabilities sit in the same layer and the method compares within layers. Multiplicative covariate–time structure = assuming a feature's effect on whether someone gets the drug and the effect of time multiply apart cleanly — a feature's effect does not change direction or strength from year to year (no feature-by-time interaction). c-statistic (AUC) = a score, from 0.5 (no better than guessing) to 1 (perfect), for how well that CPE model tells exposed from unexposed; higher means it separates people with different exposure trends better, giving stronger identification."),
        "metrics": metrics,
    }
