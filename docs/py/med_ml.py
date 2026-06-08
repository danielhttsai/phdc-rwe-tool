"""Mediation ⑤『用 AI 強化』—— a GENUINE machine-learning demo (real scikit-learn).

對應文獻：把彈性 ML 用進中介分析的自然效果估計（g-computation / 模擬法），當<b>中介→結果</b>的關係
<b>非線性</b>（如抗體對感染的保護會飽和）時，線性結果模型把 NDE/NIE 估偏；用<b>梯度提升</b>當結果模型，
搭配 g-computation 模擬反事實，就能還原正確的自然效果分解。亦呼應 causal ML 觀點
（Feuerriegel 等 2024 Nature Medicine：以彈性 ML 估計個體化/條件效果；meta-learners）。

教學重點：自然效果＝把暴露在「中介搬移」與「其他路徑」上的影響分開；只要結果模型設定錯（漏掉非線性），
分解就偏。ML 把結果面學對 → 分解回到真值。誠實聲明：合成資料、簡化教學重建。
"""
from __future__ import annotations

import numpy as np

from i18n import t


def _gen_nonlinear(rng, n):
    """True DGP with a NON-LINEAR mediator→outcome surface (saturating protection)."""
    X = rng.normal(0, 1, n)
    A = (rng.random(n) < 1.0 / (1.0 + np.exp(-(0.5 * X)))).astype(float)
    M = 0.5 + 1.0 * A + 0.3 * X + rng.normal(0, 1.0, n)
    # antibody M protects against infection but SATURATES sharply (strongly non-linear)
    hM = -3.0 * (1.0 / (1.0 + np.exp(-3.0 * (M - 0.3))))  # steep saturating, in [-3, 0]
    Y = -0.4 * A + hM + 0.4 * X + rng.normal(0, 0.5, n)
    return X, A, M, Y


def _true_effects_mc(seed=11, n=200000):
    """True natural effects via g-computation Monte Carlo on the TRUE structural equations."""
    rng = np.random.default_rng(seed)
    X = rng.normal(0, 1, n)
    # mediator potential values
    eM = rng.normal(0, 1.0, n)
    M0 = 0.5 + 1.0 * 0 + 0.3 * X + eM
    M1 = 0.5 + 1.0 * 1 + 0.3 * X + eM
    def h(M):
        return -3.0 * (1.0 / (1.0 + np.exp(-3.0 * (M - 0.3))))
    def f(a, M):
        return -0.4 * a + h(M) + 0.4 * X
    nde = float(np.mean(f(1, M0) - f(0, M0)))
    nie = float(np.mean(f(1, M1) - f(1, M0)))
    return nde, nie, nde + nie


def _gcomp_natural(fit_predict, A, M, X, rng, draws=1):
    """g-computation natural effects given a fitted outcome predictor fit_predict(a, M, X)
    and a linear mediator model fit on (A,X)->M to draw M(0), M(1)."""
    # mediator model M ~ A + X (OLS) + residual sd
    D = np.column_stack([np.ones(len(M)), A, X])
    coef = np.linalg.lstsq(D, M, rcond=None)[0]
    resid = M - D @ coef
    sM = float(np.std(resid))
    n = len(M)
    nde = nie = 0.0
    for _ in range(draws):
        e = rng.normal(0, sM, n)
        M0 = coef[0] + coef[1] * 0 + coef[2] * X + e
        M1 = coef[0] + coef[1] * 1 + coef[2] * X + e
        y10 = fit_predict(1, M0, X); y00 = fit_predict(0, M0, X); y11 = fit_predict(1, M1, X)
        nde += np.mean(y10 - y00); nie += np.mean(y11 - y10)
    return float(nde / draws), float(nie / draws)


def natural_effects_ml_demo(seed=31, lang="zh"):
    """Real sklearn. Non-linear mediator→outcome surface: a LINEAR outcome model biases the
    NDE/NIE decomposition; a gradient-boosting outcome model (g-computation) recovers the
    true natural effects. Compared against a Monte-Carlo truth."""
    from sklearn.ensemble import GradientBoostingRegressor

    rng = np.random.default_rng(seed)
    X, A, M, Y = _gen_nonlinear(rng, 4000)
    feat = np.column_stack([A, M, A * M, X])

    # linear outcome model (OLS with interaction)
    D = np.column_stack([np.ones(len(Y)), A, M, A * M, X])
    bo = np.linalg.lstsq(D, Y, rcond=None)[0]
    def lin_pred(a, Mv, Xv):
        return bo[0] + bo[1] * a + bo[2] * Mv + bo[3] * (a * Mv) + bo[4] * Xv

    # ML outcome model (gradient boosting)
    gb = GradientBoostingRegressor(n_estimators=300, max_depth=3, learning_rate=0.05,
                                   subsample=0.8, random_state=seed)
    gb.fit(feat, Y)
    def gb_pred(a, Mv, Xv):
        aa = np.full(len(Mv), float(a))
        return gb.predict(np.column_stack([aa, Mv, aa * Mv, Xv]))

    rng2 = np.random.default_rng(seed + 1)
    nde_lin, nie_lin = _gcomp_natural(lin_pred, A, M, X, rng2, draws=2)
    rng3 = np.random.default_rng(seed + 1)
    nde_ml, nie_ml = _gcomp_natural(gb_pred, A, M, X, rng3, draws=2)
    nde_true, nie_true, te_true = _true_effects_mc()

    pm_lin = nie_lin / (nde_lin + nie_lin)
    pm_ml = nie_ml / (nde_ml + nie_ml)
    pm_true = nie_true / te_true

    return {
        "key": "med_natural_ml",
        "title": t(lang, "非線性中介下的自然效果：線性 vs 梯度提升（真的跑 ML）",
                   "Natural effects under a non-linear mediator: linear vs gradient boosting (real ML)"),
        "nie_lin": round(nie_lin, 3), "nie_ml": round(nie_ml, 3), "nie_true": round(nie_true, 3),
        "nde_lin": round(nde_lin, 3), "nde_ml": round(nde_ml, 3), "nde_true": round(nde_true, 3),
        "pm_lin": round(pm_lin, 3), "pm_ml": round(pm_ml, 3), "pm_true": round(pm_true, 3),
        "bars": {"labels": [t(lang, "線性結果模型", "linear outcome model"),
                            t(lang, "梯度提升（ML）", "gradient boosting (ML)"),
                            t(lang, "真值", "truth")],
                 "values": [round(nie_lin, 3), round(nie_ml, 3), round(nie_true, 3)]},
        "plain": t(
            lang,
            "情境：抗體 M 對感染的保護<b>會飽和</b>（超過某水準再多也幫不上）——<b>中介→結果是非線性</b>的。"
            "用<b>線性</b>結果模型做自然效果分解，會把<b>間接效果 NIE</b> 估偏（因為它假設每單位抗體的保護都一樣）。"
            "改用<b>梯度提升</b>當結果模型、再以 g-computation 模擬反事實，就把非線性學對，NIE／被中介比例回到真值。"
            "這正是 causal ML 的精神：用彈性模型處理高維／非線性的輔助部分，識別仍靠因果假設。",
            "Here antibody M's protection against infection <b>saturates</b> (beyond a level, more barely helps) — the "
            "<b>mediator→outcome relationship is non-linear</b>. A <b>linear</b> outcome model biases the <b>indirect effect NIE</b> "
            "in the decomposition (it assumes every unit of antibody protects equally). A <b>gradient-boosting</b> outcome model with "
            "g-computation learns the curve, so NIE and the proportion mediated return to the truth. This is the spirit of causal ML: "
            "flexible models for the high-dimensional / non-linear nuisance pieces, with identification still resting on causal assumptions.",
        ),
        "reading": t(
            lang,
            f"間接效果 NIE：線性 ≈ {nie_lin:.2f}、ML ≈ {nie_ml:.2f}、真值 ≈ {nie_true:.2f}——線性模型把它估偏，ML 貼回真值。"
            f"被中介比例：線性 {pm_lin*100:.0f}% vs ML {pm_ml*100:.0f}% vs 真值 {pm_true*100:.0f}%。",
            f"Indirect effect NIE: linear ≈ {nie_lin:.2f}, ML ≈ {nie_ml:.2f}, truth ≈ {nie_true:.2f} — the linear model is biased, "
            f"ML recovers it. Proportion mediated: linear {pm_lin*100:.0f}% vs ML {pm_ml*100:.0f}% vs truth {pm_true*100:.0f}%.",
        ),
    }
