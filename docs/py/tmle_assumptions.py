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
            "term": t(lang, "專有名詞：可交換性；雙重穩健；無未測混淆。", "Term: exchangeability; double robustness; no unmeasured confounding."),
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
            "term": t(lang, "專有名詞：正性；共同支持；clever covariate。", "Term: positivity; common support; clever covariate."),
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
            "term": t(lang, "專有名詞：雙重穩健；Super Learner；交叉擬合。", "Term: double robustness; Super Learner; cross-fitting."),
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
            "term": t(lang, "專有名詞：一致性；SUTVA；無干擾。", "Term: consistency; SUTVA; no interference."),
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
            "term": t(lang, "專有名詞：影響曲線；半參數有效率；漸近常態。", "Term: influence curve; semiparametric efficiency; asymptotic normality."),
            "metrics": [{"name": t(lang, "樣本數", "sample size"), "value": str(n),
                         "note": t(lang, "越大越穩", "larger is more stable")}]}
