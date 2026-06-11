"""TMLE / doubly-robust assumption checks C1–C5. The identification rests on the same
causal assumptions as any confounding-adjustment method (no unmeasured confounding,
positivity, consistency); double robustness only protects against MODELLING error, not
against unmeasured confounding. Testable supports: positivity/overlap and enough data.
"""
from __future__ import annotations

import numpy as np

import tmle_core
from i18n import t


def run_dashboard(df, treat="A", outcome="Y", cov="X", lang="zh"):
    A = np.asarray(df[treat], float); X = np.asarray(df[cov], float)
    ps = tmle_core._ps(A, X)
    frac_extreme = float(np.mean((ps < 0.05) | (ps > 0.95)))
    checks = [
        _c1(lang), _c2(frac_extreme, lang), _c3(lang), _c4(lang), _c5(len(A), lang),
    ]
    return {"checks": checks}


def _c1(lang):
    return {"id": "C1", "status": "info",
            "title": t(lang, "無未測混淆（最關鍵、不可檢驗）", "No unmeasured confounding (the key, untestable assumption)"),
            "headline": t(lang, "雙重穩健只防<b>模型設定錯</b>，<b>救不了未測混淆</b>。",
                          "Double robustness guards against <b>model mis-specification</b>, <b>not</b> unmeasured confounding."),
            "plain": t(lang,
                       "AIPW／TMLE 的識別和任何混淆校正法一樣，建立在「在已測 X 下接種可交換」上。雙重穩健的意思是：結果模型"
                       "或傾向分數<b>其一設定對</b>就不偏——但<b>兩者都對也救不了沒測到的混淆</b>。要靠豐富共變項、設計（主動對照／新使用者）、陰性對照。",
                       "AIPW/TMLE identify the effect under the same condition as any adjustment method: exchangeability given the "
                       "measured X. Double robustness means it is unbiased if <b>either</b> the outcome model or the propensity score "
                       "is right — but <b>neither protects against an unmeasured confounder</b>. Lean on rich covariates, design "
                       "(active-comparator / new-user), and negative controls."),
            "term": t(lang, "可交換性＝在已測的背景條件 X 都一樣的人裡，誰去接種、誰沒接種，跟他們本來會有的結果無關——就像有沒有打針是隨機決定的；只有這樣兩組才能直接比。雙重穩健＝你有兩道保險：結果模型（預測會生病）跟傾向分數模型（預測會接種）只要其中一個配對，估計就不偏。無未測混淆＝沒有任何「同時影響接種與否、又影響結果」的因素是你沒量到的；這一點資料本身永遠檢驗不出來，只能靠設計與背景知識。",
                            "Exchangeability = among people who look the same on the measured background X, who did and didn't get vaccinated is unrelated to the outcomes they would have had — as if treatment were assigned at random; only then can the two groups be compared directly. Double robustness = you have two safety nets: the outcome model (predicts getting sick) and the propensity model (predicts getting vaccinated), and if just one of them is right the estimate is unbiased. No unmeasured confounding = there is no factor that affects both whether someone is vaccinated and their outcome that you failed to measure; the data can never test this, only design and background knowledge can defend it."),
            "metrics": []}


def _c2(frac_extreme, lang):
    if frac_extreme < 0.02:
        st, hd = "green", t(lang, "重疊良好——權重穩定，TMLE 的 targeting 不會被極端傾向分數放大。",
                            "Good overlap — weights are stable and TMLE's targeting won't be amplified by extreme PS.")
    elif frac_extreme < 0.1:
        st, hd = "amber", t(lang, "有些人傾向分數很極端——AIPW 的權重項會變大，考慮截斷或重疊權重。",
                            "Some extreme PS — the weighting term in AIPW blows up; consider trimming or overlap weights.")
    else:
        st, hd = "red", t(lang, "正性受威脅——某些人幾乎一定（不）接種，這些區域估不準。",
                          "Positivity threatened — some people almost surely (don't) get treated; the effect is not estimable there.")
    return {"id": "C2", "status": st,
            "title": t(lang, "正性／重疊：每種人都可能接種也可能不接種嗎？（可檢驗）",
                       "Positivity / overlap: can every kind of person plausibly be treated or untreated? (testable)"),
            "headline": hd,
            "plain": t(lang,
                       "TMLE／AIPW 都用到 1/PS 與 1/(1−PS)。若某種人幾乎一定（不）接種，這些權重會爆大、估計很不穩。"
                       "可檢的指標是傾向分數分布的重疊與極端比例。修法：截斷、重疊權重、或限制在共同支持區。",
                       "TMLE/AIPW both use 1/PS and 1/(1−PS). If some people are almost certain to be (un)treated those weights "
                       "explode and the estimate is unstable. The testable metric is PS overlap and the fraction with extreme PS. "
                       "Fixes: trim, overlap weights, or restrict to common support."),
            "term": t(lang, "正性＝每一種人都要「有可能接種、也有可能不接種」；如果某種人幾乎百分之百都會（或都不會）接種，就沒有對照可比，那群人的效果根本估不出來。共同支持＝兩組病人「長得像」的重疊區間；只在這個區間裡比較才有意義，落在區間外的人要捨棄或特別處理。clever covariate＝TMLE 內部用傾向分數算出來的一個校正用變項，用來把估計往正確答案微調；傾向分數太極端時它會變得很大，把估計值放大、變不穩。",
                         "Positivity = every kind of person must have some real chance of being treated and some chance of not being treated; if a certain kind of person is almost always (or never) vaccinated there is no comparison group, and the effect simply cannot be estimated for them. Common support = the range where the two groups of patients overlap and look alike; comparisons only make sense inside this range, and people outside it must be dropped or handled specially. Clever covariate = an adjustment variable TMLE builds internally from the propensity score to nudge the estimate toward the right answer; when the propensity score is extreme it grows huge, magnifying and destabilizing the estimate."),
            "metrics": [{"name": t(lang, "PS 極端（&lt;0.05 或 &gt;0.95）比例", "fraction with extreme PS (&lt;0.05 or &gt;0.95)"),
                         "value": f"{frac_extreme*100:.1f}%",
                         "note": t(lang, "越低越好", "lower is better")}]}


def _c3(lang):
    return {"id": "C3", "status": "info",
            "title": t(lang, "至少一個模型設定正確（雙重穩健的條件）", "At least one model correctly specified (the double-robustness condition)"),
            "headline": t(lang, "結果模型<b>或</b>傾向分數<b>其一</b>對，AIPW／TMLE 就一致。",
                          "If <b>either</b> the outcome model <b>or</b> the propensity score is right, AIPW/TMLE is consistent."),
            "plain": t(lang,
                       "這是雙重穩健的核心：你有<b>兩次機會</b>把模型配對。實務上用<b>Super Learner</b>（多個學習器的交叉驗證集成）"
                       "讓結果與傾向模型都盡量配好，把「至少一個對」的機會最大化。注意：用彈性 ML 時要<b>交叉擬合（cross-fitting）</b>避免過度配適偏誤。",
                       "This is the heart of double robustness: you get <b>two chances</b> to get a model right. In practice use a "
                       "<b>Super Learner</b> (a cross-validated ensemble of learners) for both the outcome and propensity models to "
                       "maximise the chance that at least one is correct. Note: with flexible ML use <b>cross-fitting</b> to avoid "
                       "over-fitting bias."),
            "term": t(lang, "雙重穩健＝兩次配對機會：結果模型（預測會不會生病）跟傾向分數模型（預測會不會接種），只要其中一個配對，估計就會收斂到正確答案。Super Learner＝把好幾種預測方法（迴歸、樹模型等）放在一起，用交叉驗證自動挑出、加權組合成最好的那一個；目的是讓兩個模型都盡量配好，提高「至少一個對」的機會。交叉擬合＝把資料切成幾份，用其中一份學模型、再去預測另一份，輪流做；這樣模型不會「先偷看再預測自己」，避免因為過度配適而偏掉。",
                       "Double robustness = two chances to get it right: the outcome model (predicts getting sick) and the propensity model (predicts getting vaccinated), and as long as one of them is correct the estimate converges to the true answer. Super Learner = pools several prediction methods (regressions, tree models, etc.) and uses cross-validation to automatically pick and weight them into the best combined model; the goal is to fit both models as well as possible and raise the odds that at least one is right. Cross-fitting = splits the data into parts, learns the model on one part and predicts on another, rotating through; this stops the model from peeking at the same data it then predicts, avoiding bias from over-fitting."),
            "metrics": []}


def _c4(lang):
    return {"id": "C4", "status": "info",
            "title": t(lang, "一致性與良好定義的處置（SUTVA）", "Consistency & a well-defined treatment (SUTVA)"),
            "headline": t(lang, "「接種」要定義明確、無干擾（一個人的處置不影響別人的結果）。",
                          "‘Vaccination’ must be well-defined and interference-free (one person's treatment doesn't change another's outcome)."),
            "plain": t(lang,
                       "估計目標 E[Yᵃ⁼¹]−E[Yᵃ⁼⁰] 只有在處置定義明確、且觀察到的 Y 等於對應介入下的反事實時才有意義。疫苗效果有傳播／"
                       "群體免疫時 SUTVA 可能被破壞，需要特別設計。",
                       "The estimand E[Yᵃ⁼¹]−E[Yᵃ⁼⁰] is meaningful only if the treatment is well-defined and the observed Y equals the "
                       "counterfactual under the corresponding intervention. With transmission / herd immunity, SUTVA can break and "
                       "needs special handling."),
            "term": t(lang, "一致性＝我們實際看到的結果，就等於「他真的去做那個處置時」會發生的結果；前提是處置定義要夠明確（到底「接種」是指哪支疫苗、幾劑、什麼時間），否則反事實比較沒有意義。SUTVA＝一條穩定性假設，包含兩件事：處置只有單一明確版本，而且一個人的處置不會改變別人的結果。無干擾＝SUTVA 的後半——你接種與否，不會影響到我會不會生病；但疫苗有傳播阻斷、群體免疫時這點常被破壞，需要特別設計處理。",
                       "Consistency = the outcome we actually observe equals the outcome that would happen when a person truly receives that treatment; this requires the treatment to be defined clearly enough (which vaccine, how many doses, at what time), otherwise the counterfactual comparison is meaningless. SUTVA = a stability assumption with two parts: the treatment has a single well-defined version, and one person's treatment does not change another person's outcome. No interference = the second half of SUTVA — whether you get vaccinated does not affect whether I get sick; but with transmission-blocking and herd immunity this is often broken and needs special handling."),
            "metrics": []}


def _c5(n, lang):
    if n >= 1000:
        st, hd = "green", t(lang, "樣本充足，半參數有效率估計的常態近似可靠。", "Ample sample — the asymptotics for the efficient estimator are reliable.")
    elif n >= 300:
        st, hd = "amber", t(lang, "樣本中等，CI 偏寬、targeting 較不穩。", "Moderate sample — wider CI and less stable targeting.")
    else:
        st, hd = "red", t(lang, "樣本太小，半參數估計與影響曲線 CI 不可靠。", "Sample too small — the semiparametric estimate and influence-curve CI are unreliable.")
    return {"id": "C5", "status": st,
            "title": t(lang, "樣本／事件數夠嗎？（可檢驗）", "Enough sample / events? (testable)"),
            "headline": hd,
            "plain": t(lang,
                       "TMLE／AIPW 是<b>半參數有效率</b>估計，CI 來自<b>影響曲線</b>（influence curve）的變異。要有足夠樣本，常態近似與"
                       "交叉擬合才站得住；事件太少時 CI 不可靠。",
                       "TMLE/AIPW are <b>semiparametric-efficient</b>; the CI comes from the variance of the <b>influence curve</b>. "
                       "You need enough sample for the asymptotics and cross-fitting to hold; with few events the CI is unreliable."),
            "term": t(lang, "影響曲線＝衡量「每一個受試者對最終估計值的拉力有多大」的一條曲線；把這些拉力的散布程度算出來，就得到信賴區間，所以事件太少時區間會抓不準。半參數有效率＝在不硬性假設資料長什麼分布的前提下，這個方法能達到理論上最小的誤差——也就是同樣的資料量，它的估計抖動最小、最省。漸近常態＝樣本夠大時，估計值的分布會趨近常態的鐘形曲線；這正是用標準誤算信賴區間的前提，樣本太小時這個近似就站不住。",
                       "Influence curve = a curve measuring how much pull each individual subject has on the final estimate; spreading out those pulls gives the confidence interval, which is why with too few events the interval becomes unreliable. Semiparametric efficiency = without forcing rigid assumptions about the shape of the data's distribution, the method reaches the theoretically smallest possible error — for a given sample size its estimate wobbles the least. Asymptotic normality = with a large enough sample the estimate's distribution approaches a normal bell curve; this is exactly what justifies building the confidence interval from a standard error, and the approximation breaks down when the sample is too small."),
            "metrics": [{"name": t(lang, "樣本數", "sample size"), "value": str(n),
                         "note": t(lang, "越大越穩", "larger is more stable")}]}
