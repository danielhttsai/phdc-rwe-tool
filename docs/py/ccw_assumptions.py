"""Clone-Censor-Weight (CCW) assumption checks C1–C5 — following Hernán (2018),
Maringe et al. (2020), Gaber et al. (2024). Like other target-trial methods, the
core identifying assumptions are untestable from data alone, so we are honest
(blue 'info' cards) and surface the diagnostics that ARE checkable: positivity
(overlap), the weight distribution, and enough events.

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}.
"""
from __future__ import annotations

import numpy as np

import ccw_core
from i18n import t


def run_dashboard(df, vacc_time=None, event="event", futime="futime",
                  covariates=("age", "frailty"), grace=3, horizon=12, scenario="grace", lang="zh"):
    import ccw_gen
    if vacc_time is None:
        vacc_time = ccw_gen.DRIVE_COL.get(scenario, "vacc_month")
    res = ccw_core.full_ccw(df, vacc_time, event, futime, covariates, grace, horizon,
                            scenario=scenario, lang=lang)
    drive = np.asarray(df[vacc_time], dtype=float)
    # the "positivity group" = whoever followed strategy arm 1 (acted-by-grace, or
    # — for sustained — never discontinued)
    if scenario == "sustained":
        early = np.isnan(drive)
    else:
        early = (~np.isnan(drive)) & (drive <= grace)
    checks = [
        _c1_exchangeability(res, lang),
        _c2_positivity(df, early, covariates, lang),
        _c3_consistency(grace, lang),
        _c4_weight_model(res, lang),
        _c5_alignment(res, lang),
    ]
    return {"checks": checks}


def _c1_exchangeability(res, lang="zh"):
    naive, ccw = res["naive"], res["ccw"]
    metrics = [
        {"name": t(lang, "天真 vs CCW 的差距", "Gap between naive and CCW"),
         "value": f"{naive:+.2f} vs {ccw:+.2f}",
         "note": t(lang, "差距大代表混淆／immortal-time 的校正幅度大",
                   "a large gap means a large correction for confounding / immortal time")},
    ]
    return {
        "id": "C1",
        "title": t(lang, "策略內可交換嗎？（無未測混淆，關鍵、不可檢驗）",
                   "Exchangeability within strategy? (no unmeasured confounding — key, untestable)"),
        "status": "info",
        "headline": t(lang, "CCW 假設『誰遵循哪個策略』只由可測共變項決定；這無法用資料證明，要靠領域知識與設計。",
                      "CCW assumes who follows which strategy is governed only by measured covariates; this cannot be proven from data — rely on domain knowledge and design."),
        "plain": t(
            lang,
            "複製-設限-加權能還原因果效應，靠的是『在加權之後，早策略與晚策略的人在所有會影響結果的因素上"
            "可比』（可交換性／無未測混淆）。我們已用可測共變項（年齡、體弱程度）建立反設限權重；但如果還有"
            "<b>沒測到</b>的因素（例如疾病嚴重度的細節）同時影響『何時接種』與『結果』，CCW 仍會有偏。做法："
            "①盡量蒐集並納入重要共變項；②做未測混淆的敏感度分析（如 E-value）；③與隨機試驗對照。",
            "Clone-censor-weight recovers the causal effect by assuming that, after weighting, people following the "
            "early vs late strategy are comparable on everything that affects the outcome (exchangeability / no "
            "unmeasured confounding). We built the censoring weights from measured covariates (age, frailty); but if "
            "an <b>unmeasured</b> factor (e.g. fine-grained disease severity) drives both the timing of vaccination and "
            "the outcome, CCW is still biased. Remedy: ① measure and include the important confounders; ② run an "
            "unmeasured-confounding sensitivity analysis (e.g. E-value); ③ benchmark against a randomized trial.",
        ),
        "term": t(lang, "可交換性／無未測混淆＝加權之後，走早策略與走晚策略的兩群人，在所有會影響結果的因素上都長得一樣可比；唯一的差別只剩下策略本身。只要有一個沒量到、又同時牽動『何時接種』與『結果』的因素，這個前提就破了，效應估計會有偏。目標試驗模擬＝先在腦中設計一個理想的隨機試驗（誰能入組、何時算起點、怎麼指派治療），再用現有觀察資料去『模仿』它，藉此把分析講清楚、避開常見偏誤。",
                  "Exchangeability / no unmeasured confounding = after weighting, the early-strategy group and the late-strategy group look equally comparable on everything that affects the outcome, so the only thing left differing is the strategy itself. If even one factor goes unmeasured while driving both the timing of vaccination and the outcome, this breaks and the effect is biased. Target trial emulation = first design, on paper, the ideal randomized trial you wish you could run (who is eligible, when the clock starts, how treatment is assigned), then use existing observational data to mimic it — which forces the analysis to be explicit and dodges common pitfalls."),
        "metrics": metrics,
    }


def _c2_positivity(df, early, covariates, lang="zh"):
    # positivity = within covariate strata, BOTH strategies are followed (nonzero prob)
    worst = 1.0
    rows = []
    for c in covariates:
        v = np.asarray(df[c], dtype=float)
        # stratify into low/high (median split for continuous; values for binary)
        uniq = np.unique(v)
        if uniq.size <= 2:
            groups = [(f"{c}={int(u)}", v == u) for u in uniq]
        else:
            med = np.median(v)
            groups = [(f"{c}≤median", v <= med), (f"{c}>median", v > med)]
        for name, mask in groups:
            if mask.sum() == 0:
                continue
            share_early = float(early[mask].mean())
            worst = min(worst, share_early, 1.0 - share_early)
            rows.append((name, share_early))
    metrics = [{"name": t(lang, f"早策略比例（{nm}）", f"Early-strategy share ({nm})"),
                "value": f"{sh*100:.0f}%",
                "note": t(lang, "太接近 0% 或 100% → 該層幾乎只走一種策略（違反正性）",
                          "near 0% or 100% means that stratum almost only follows one strategy (positivity violation)")}
               for nm, sh in rows]
    if worst >= 0.10:
        status = "green"
        head = t(lang, "每個共變項層裡，早策略與晚策略都有足夠的人 —— 正性大致成立、權重穩定。",
                 "Every covariate stratum has enough people on both strategies — positivity holds and weights are stable.")
    elif worst >= 0.03:
        status = "amber"
        head = t(lang, "某些層裡，一種策略的人偏少 —— 權重會偏大、估計較不穩。",
                 "In some strata one strategy is sparse — weights get large and the estimate is less stable.")
    else:
        status = "red"
        head = t(lang, "某些層幾乎只走一種策略（近乎違反正性）—— CCW 在那些人身上幾乎無法外推。",
                 "Some strata almost only follow one strategy (near positivity violation) — CCW can barely extrapolate there.")
    return {
        "id": "C2",
        "title": t(lang, "正性（positivity）：每種人都可能走每種策略嗎？（可檢驗）",
                   "Positivity: could every kind of person follow every strategy? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "反設限加權要成立，必須『不論共變項長相，跟隨早策略與晚策略的機率都大於 0』（正性）。如果某種人"
            "（例如最體弱者）幾乎一定早接種、幾乎沒有人晚接種，那一層就沒有可比的對照，權重會爆大、估計不穩。"
            "上面列出各共變項層的『早策略比例』；越接近 0% 或 100% 越危險。",
            "For the censoring weights to work, every kind of person must have a probability above 0 of following both "
            "the early AND the late strategy (positivity). If some people (say the frailest) almost always vaccinate "
            "early and almost none defer, that stratum has no comparable controls, the weights blow up, and the estimate "
            "is unstable. Above are the early-strategy shares per covariate stratum; the closer to 0% or 100%, the more "
            "dangerous.",
        ),
        "term": t(lang, "正性＝不管一個人長什麼樣（多老、多體弱），他都有可能走早策略、也有可能走晚策略，機率都大於 0；如果某一種人幾乎只會走其中一種，那一層就找不到可比的對照，權重會爆大、估計很不穩。共變項重疊＝把早策略與晚策略兩群人的特徵攤開來比，兩邊要有夠多『重疊範圍』——同時都有人的地方才能互相比較；完全沒重疊的地方，方法只能硬外推、不可信。",
                  "Positivity = whatever a person looks like (however old or frail), they could plausibly follow either the early or the late strategy, each with probability above 0; if some kind of person almost always takes just one, that stratum has no comparable controls, the weights blow up, and the estimate gets shaky. Covariate overlap = lay the early and late groups' characteristics side by side — there must be enough shared range where both groups have people, since only there can they be compared; where they don't overlap at all, the method can only extrapolate hard and is untrustworthy."),
        "metrics": metrics,
    }


def _c3_consistency(grace, lang="zh"):
    return {
        "id": "C3",
        "title": t(lang, "策略定義清楚、寬限期合理嗎？（一致性，靠設計）",
                   "Are the strategies well-defined and the grace period sensible? (consistency — by design)"),
        "status": "info",
        "headline": t(lang, f"早／晚策略與寬限期（這裡 g={grace} 個月）必須事先、明確地定義；一致性靠研究設計保證。",
                      f"The early/late strategies and the grace period (here g={grace} months) must be defined in advance and unambiguously; consistency is ensured by design."),
        "plain": t(
            lang,
            "CCW 的『複製』要成立，前提是兩個策略寫得夠清楚，讓每個人在每個時點都能判斷『有沒有偏離』。"
            "<b>寬限期 g</b> 是關鍵設計選擇：在 g 之內還沒接種、也還沒發生事件的人，同時相容於早與晚兩個策略"
            "（所以被複製到兩臂）；到了 g 才依實際行為決定歸屬。g 太短會排除很多人、g 太長會讓『早』與『晚』"
            "變得太像。應做不同 g 的敏感度分析。",
            "For the 'clone' step to be valid, both strategies must be written clearly enough that, at every time, you "
            "can tell whether a person has deviated. The <b>grace period g</b> is a key design choice: someone still "
            "event-free and untreated within g is compatible with BOTH the early and late strategy (so they are cloned "
            "into both arms); only at g is their arm resolved by what they actually did. Too short a g excludes many "
            "people; too long makes 'early' and 'late' too similar. Report a sensitivity analysis over g.",
        ),
        "term": t(lang, "一致性＝『觀察到某人實際接受的處置』和『策略所指定的處置』要對得上，這樣他的結果才能代表那個策略下會發生的結果；如果策略寫得含糊、實際做法五花八門，這個對應就鬆動了。寬限期 g＝允許一段緩衝時間（這裡 g 個月）才接種仍算數，因為現實裡沒人能在診斷當下立刻打針；在 g 之內還沒接種也還沒出事的人，同時相容於早與晚兩種策略，所以被複製到兩臂。明確定義的策略＝早策略、晚策略都要事先寫清楚，清楚到每個人在每個時點都能判斷他到底有沒有偏離。",
                  "Consistency = the treatment we actually observe a person getting must line up with the treatment their strategy specifies, so that their outcome genuinely represents what that strategy would produce; if a strategy is vaguely worded and people do all sorts of things, that link loosens. Grace period g = a buffer window (here g months) within which getting vaccinated still counts, because nobody realistically gets the shot the very instant of diagnosis; a person still untreated and event-free within g is compatible with both the early and the late strategy, so they are cloned into both arms. Well-defined strategies = the early and late strategies must be spelled out in advance, clearly enough that at every moment you can tell whether a given person has deviated."),
        "metrics": [],
    }


def _c4_weight_model(res, lang="zh"):
    we = res["weights"]["early"]; wl = res["weights"]["late"]
    mx = max(we["max"], wl["max"]); fx = max(we["frac_extreme"], wl["frac_extreme"])
    # sustained uses UNSTABILIZED weights (numerator = 1) → mean > 1 by design; the other
    # scenarios use STABILIZED weights (marginal numerator) → mean ≈ 1.
    unstab = res.get("scenario") == "sustained"
    if unstab:
        wname = t(lang, "未穩定化權重平均（持續／停藥）", "Mean unstabilized weight (sustain/discontinue)")
        wnote = t(lang, "未穩定化權重（分子=1）的平均<b>本來就 >1</b>；看的是有沒有少數極端值",
                  "unstabilized weights (numerator = 1) average <b>above 1 by design</b>; watch for a few extreme values")
    else:
        wname = t(lang, "穩定化權重平均（早／晚）", "Mean stabilized weight (early/late)")
        wnote = t(lang, "應接近 1；明顯偏離代表模型設定可疑", "should be ≈ 1; far from 1 means a suspect model")
    metrics = [
        {"name": wname, "value": f"{we['mean']:.2f} / {wl['mean']:.2f}", "note": wnote},
        {"name": t(lang, "最大權重（截斷前）", "Largest weight (before truncation)"), "value": round(mx, 1),
         "note": t(lang, "我們在 20 截斷，避免少數人主導估計", "we truncate at 20 so a few people don't dominate")},
        {"name": t(lang, "極端權重比例（>10）", "Share of extreme weights (>10)"), "value": f"{fx*100:.1f}%",
         "note": t(lang, "越高越不穩；靠截斷或改善模型控制", "the higher the less stable; controlled by truncation or a better model")},
    ]
    if unstab:
        # unstabilized: large raw weights are expected; judge by share of extremes (we truncate)
        if fx <= 0.05:
            status = "green"
            head = t(lang, "未穩定化權重平均 >1（正常），極端值很少且已截斷 —— 反設限模型行為健康。",
                     "Unstabilized weights average >1 (expected); few extremes, and they are truncated — the censoring model behaves well.")
        elif fx <= 0.12:
            status = "amber"
            head = t(lang, "未穩定化權重出現一些極端值 —— 靠截斷壓住，估計仍可能受少數人影響。",
                     "Some extreme unstabilized weights — truncation caps them, but a few people may still sway the estimate.")
        else:
            status = "red"
            head = t(lang, "極端權重很多 —— 反設限模型可能設定錯誤或正性不足，CCW 不穩。",
                     "Many extreme weights — the censoring model may be mis-specified or positivity is poor; CCW is unstable.")
    else:
        if mx <= 12 and fx <= 0.01:
            status = "green"
            head = t(lang, "穩定化權重平均接近 1、沒有極端值 —— 反設限模型行為健康。",
                     "Stabilized weights average ≈ 1 with no extremes — the censoring model behaves well.")
        elif mx <= 30 and fx <= 0.05:
            status = "amber"
            head = t(lang, "權重有些偏大 —— 估計受少數人影響，建議截斷或加強模型。",
                     "Some large weights — a few people sway the estimate; consider trimming or a better model.")
        else:
            status = "red"
            head = t(lang, "權重極端 —— 反設限模型可能設定錯誤或正性不足，CCW 不穩。",
                     "Extreme weights — the censoring model may be mis-specified or positivity is poor; CCW is unstable.")
    plain = t(
        lang,
        "人為設限（偏離策略）不是隨機的，所以用<b>反設限機率加權（IPCW）</b>補回來。這裡 sustained（持續/停藥）"
        "用<b>未穩定化權重</b>（分子=1，即 1/未設限機率）＋<b>截斷</b>，搭配無母數加權 KM——平均<b>本來就 >1</b>，"
        "重點是極端值不要太多（靠截斷壓住）。其他情境用<b>穩定化權重</b>（分子＝邊際未設限機率），平均應≈1。"
        "兩種都正確；差別在變異與極端權重。",
        "Artificial censoring (deviating from a strategy) is not random, so we correct for it with "
        "<b>inverse-probability-of-censoring weighting (IPCW)</b>. Here the sustained (stay-on/discontinue) strategy uses "
        "<b>unstabilized weights</b> (numerator = 1, i.e. 1/uncensored-probability) + <b>truncation</b> with a "
        "non-parametric weighted KM — so the mean is <b>above 1 by design</b>; what matters is that extremes stay rare "
        "(capped by truncation). The other scenarios use <b>stabilized weights</b> (marginal numerator), whose mean should "
        "be ≈ 1. Both are valid; they differ in variance and extreme-weight behaviour.",
    ) if unstab else t(
        lang,
        "人為設限（偏離策略）不是隨機的，所以我們用<b>反設限機率加權（IPCW）</b>把它補回來。如果這個權重"
        "模型設定正確，<b>穩定化權重的平均應該接近 1</b>，而且不該有少數人帶著超大的權重主宰整個估計。"
        "上面的診斷就是在看這件事；若權重很極端，通常代表模型設定錯誤或正性不足。",
        "Artificial censoring (deviating from a strategy) is not random, so we correct for it with "
        "<b>inverse-probability-of-censoring weighting (IPCW)</b>. If that weight model is correctly specified, the "
        "<b>stabilized weights should average ≈ 1</b>, and no handful of people should carry huge weights that "
        "dominate the estimate. The diagnostics above check exactly this; very extreme weights usually signal "
        "mis-specification or poor positivity.",
    )
    return {
        "id": "C4",
        "title": t(lang, "反設限權重模型合理嗎？（可檢驗）",
                   "Is the censoring-weight model reasonable? (testable)"),
        "status": status, "headline": head,
        "plain": plain,
        "term": t(lang, "反設限機率加權（IPCW）＝因為偏離策略而被人為設限的人並不是隨機挑的，硬刪掉會造成偏誤；於是給『沒被設限、留下來的人』一個權重——他越不容易留下，就放大他的份量，去代表那些被刪掉、和他相似的人。穩定化權重＝在這個放大倍數上再除以一個整體基準，把數值拉回平均約等於 1、變異更小、估計更穩。未穩定化權重＝不做那個拉回（分子固定為 1），平均本來就會大於 1，這在持續／停藥情境是正常的。權重截斷＝設一個上限（這裡 20），把少數爆大的權重壓住，避免極少數人主宰整個結果。",
                  "Inverse-probability-of-censoring weighting (IPCW) = the people artificially censored for deviating from a strategy are not a random subset, so simply dropping them biases the result; instead we give each person who stays uncensored a weight — the less likely they were to stay, the more we scale them up, so they stand in for the similar people who got dropped. Stabilized weights = divide that scale-up factor by an overall baseline, pulling the values back toward an average of about 1, with smaller variance and a steadier estimate. Unstabilized weights = skip that pull-back (numerator fixed at 1), so the mean is above 1 by design — which is normal in the stay-on/discontinue setting. Weight truncation = cap the weights at a ceiling (here 20) so a few runaway values can't let a tiny number of people dominate the whole result."),
        "metrics": metrics,
    }


def _c5_alignment(res, lang="zh"):
    naive, ccw = res["naive"], res["ccw"]
    gap = naive - ccw
    metrics = [
        {"name": t(lang, "天真 − CCW（immortal-time 的指紋）", "Naive − CCW (the immortal-time fingerprint)"),
         "value": f"{gap:+.2f}",
         "note": t(lang, "不為 0 代表天真分組確實受 immortal-time／混淆汙染",
                   "non-zero means the naive grouping really was contaminated by immortal time / confounding")},
    ]
    return {
        "id": "C5",
        "title": t(lang, "時間零點、資格、指派有對齊嗎？（immortal-time，靠設計）",
                   "Are time-zero, eligibility and assignment aligned? (immortal time — by design)"),
        "status": "info",
        "headline": t(lang, "CCW 在『時間零點』就把每個人複製並指派，從源頭消除 immortal-time bias —— 靠正確對齊設計保證。",
                      "CCW clones and assigns everyone at time zero, removing immortal-time bias at the source — ensured by correct alignment in the design."),
        "plain": t(
            lang,
            "immortal-time bias 來自『用未來資訊（最後是早接種還是晚接種）回頭分組』，被歸到早接種的人必須先活著"
            "沒事件，看起來假性更健康。CCW 的解法是：在<b>時間零點（診斷當下）</b>就把每個人複製到兩個策略、"
            "並在偏離時才設限——『死掉或先發生事件的人不會偏離被指派的策略』（Hernán 2018）。上面的"
            "『天真 − CCW』差距，正是這份 immortal-time／混淆被校正掉的證據。前提是設計上正確對齊"
            "<b>時間零點、資格條件、策略指派</b>三者。",
            "Immortal-time bias comes from grouping people using future information (whether they ended up early or "
            "late); those labelled 'early' had to survive event-free first, so they look spuriously healthier. CCW's fix "
            "is to clone every person into both strategies at <b>time zero (the moment of diagnosis)</b> and only censor "
            "on deviation — 'people who die or have the event first do not deviate from their assigned strategy' "
            "(Hernán 2018). The 'naive − CCW' gap above is the evidence of that immortal-time/confounding being "
            "corrected. It requires aligning <b>time zero, eligibility, and treatment assignment</b> correctly in the "
            "design.",
        ),
        "term": t(lang, "不死時間偏誤（immortal-time bias）＝用『最後到底有沒有早接種』這個未來資訊回頭分組，被歸到早接種的人必須先活著、沒出事才有機會去接種，於是這群人看起來假性地更健康，效應被灌水。時間零點對齊＝幫每個人定一個一致的『計時起點』（這裡是診斷當下），並在那一刻就決定資格與策略指派，不准用後來才知道的事回頭歸類；CCW 的做法就是在零點把每個人同時複製到早與晚兩臂，從源頭杜絕這種偏誤。目標試驗模擬＝照著一個理想隨機試驗的規格（起點、資格、指派）來安排觀察資料的分析，讓零點對齊這件事自然到位。",
                  "Immortal-time bias = grouping people by the future fact of whether they ended up vaccinating early; anyone labelled early had to survive event-free long enough to get the shot, so that group looks spuriously healthier and the effect is inflated. Time-zero alignment = give everyone a consistent start-of-clock (here the moment of diagnosis) and settle eligibility and treatment assignment at that instant, never reclassifying people using things learned later; CCW does this by cloning each person into both the early and late arm at time zero, killing the bias at its source. Target trial emulation = arrange the observational analysis to follow the blueprint of an ideal randomized trial (start time, eligibility, assignment), which makes that time-zero alignment fall into place naturally."),
        "metrics": metrics,
    }
