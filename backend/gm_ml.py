"""G-methods ⑤『用 AI 強化』—— a GENUINE machine-learning demo (real scikit-learn).

對應文獻：機器學習輔助的 g-computation（Naimi/Cole/Kennedy 2017 的 g-methods；Scientific Reports 2020/2021
以 ML/super learner 估 g-formula 與 IPTW 的輔助模型）。當時變共變項 Lₜ 的演變、以及結果 Y 對史的依賴是
<b>非線性／有交互</b>時，<b>線性 g-formula</b> 把輔助模型設錯、估計偏；改用<b>梯度提升</b>當 Lₜ 與 Y 的模型，
把非線性學對，<b>還原真值</b>。

教學重點：ML 在這裡修的是<b>輔助模型</b>（L、Y 的迴歸），<b>不是</b>放鬆「序列可交換」這條因果假設。
誠實聲明：合成資料、簡化教學重建。
"""
from __future__ import annotations

import numpy as np

from i18n import t


def _sig(x):
    return 1.0 / (1.0 + np.exp(-x))


def _gen_nonlinear(rng, n, feedback=1.0):
    """Non-linear treatment–confounder feedback: L1 and Y depend non-linearly on history."""
    L0 = rng.normal(0, 1, n)
    A0 = (rng.random(n) < _sig(1.2 * L0)).astype(float)
    # L1: non-linear in L0 (quadratic); A0's lowering effect itself depends on L0 (interaction)
    L1 = 0.5 * L0 + 0.5 * (L0 ** 2 - 1.0) - feedback * A0 * (1.0 + 0.9 * L0) + rng.normal(0, 0.5, n)
    A1 = (rng.random(n) < _sig(1.2 * L1)).astype(float)
    # Y depends non-linearly on L (quadratic + interaction)
    Y = (-1.0) * (A0 + A1) + 1.0 * (L0 + L1) + 0.7 * (L1 ** 2 - 1.0) + 0.6 * L0 * L1 + rng.normal(0, 1.0, n)
    return L0, A0, L1, A1, Y


def _truth_nonlinear(rng, feedback=1.0, n=600000):
    L0 = rng.normal(0, 1, n)
    # always treat (1,1)
    L1a = 0.5 * L0 + 0.5 * (L0 ** 2 - 1.0) - feedback * (1.0 + 0.9 * L0)
    Ya = -2.0 + 1.0 * (L0 + L1a) + 0.7 * (L1a ** 2 - 1.0) + 0.6 * L0 * L1a
    # never (0,0)
    L1n = 0.5 * L0 + 0.5 * (L0 ** 2 - 1.0)
    Yn = 0.0 + 1.0 * (L0 + L1n) + 0.7 * (L1n ** 2 - 1.0) + 0.6 * L0 * L1n
    return float(np.mean(Ya - Yn))


def _gformula_with(modelL, modelY, L0, A0, L1, A1, Y):
    """g-computation using arbitrary fitted L1 and Y models (sklearn regressors)."""
    featL = np.column_stack([L0, A0])
    modelL.fit(featL, L1)
    featY = np.column_stack([L0, A0, L1, A1])
    modelY.fit(featY, Y)

    def predict(a0, a1):
        L1p = modelL.predict(np.column_stack([L0, np.full_like(L0, a0)]))
        return modelY.predict(np.column_stack([L0, np.full_like(L0, a0), L1p, np.full_like(L0, a1)]))
    return float(np.mean(predict(1, 1) - predict(0, 0)))


def ml_gmethods_demo(seed=11, lang="zh"):
    """Real sklearn. A non-linear treatment–confounder feedback: a LINEAR g-formula mis-specifies
    the Lₜ and Y models and stays biased; a GRADIENT-BOOSTING g-formula learns the non-linearity
    and recovers the regime contrast (the truth)."""
    from sklearn.linear_model import LinearRegression
    from sklearn.ensemble import GradientBoostingRegressor

    rng = np.random.default_rng(seed)
    L0, A0, L1, A1, Y = _gen_nonlinear(rng, 6000)
    truth = _truth_nonlinear(np.random.default_rng(seed + 1))

    lin = _gformula_with(LinearRegression(), LinearRegression(), L0, A0, L1, A1, Y)
    gb = _gformula_with(
        GradientBoostingRegressor(n_estimators=250, max_depth=3, learning_rate=0.05, subsample=0.8, random_state=seed),
        GradientBoostingRegressor(n_estimators=250, max_depth=3, learning_rate=0.05, subsample=0.8, random_state=seed),
        L0, A0, L1, A1, Y)

    return {
        "key": "gm_ml",
        "title": t(lang, "ML 輔助 g-formula：線性 vs 梯度提升（真的跑 ML）",
                   "ML-assisted g-formula: linear vs gradient boosting (real ML)"),
        "est_lin": round(lin, 3), "est_gb": round(gb, 3), "truth": round(truth, 3),
        "bars": {"labels": [t(lang, "線性 g-formula", "linear g-formula"),
                            t(lang, "梯度提升 g-formula（ML）", "gradient-boosting g-formula (ML)"),
                            t(lang, "真值", "truth")],
                 "values": [round(lin, 3), round(gb, 3), round(truth, 3)]},
        "plain": t(
            lang,
            "情境：時變混淆 Lₜ 的演變、以及結果 Y 對共變項史的依賴都是<b>非線性、有交互</b>的。<b>線性 g-formula</b> 把 Lₜ 與 Y 的"
            "模型配錯，模擬 always vs never 時就<b>偏</b>。改用<b>梯度提升</b>當這兩個輔助模型（ML／super learner 的精神），把非線性"
            "學對，g-computation 就<b>還原真值</b>。重點：ML 修的是<b>輔助模型</b>，識別仍靠「序列可交換＋正性＋一致性」。",
            "Here both how Lₜ evolves and how Y depends on the covariate history are <b>non-linear with interactions</b>. A <b>linear "
            "g-formula</b> mis-specifies the Lₜ and Y models, so simulating always vs never is <b>biased</b>. Using <b>gradient "
            "boosting</b> for those two nuisance models (the spirit of ML / super learner) learns the non-linearity and the "
            "g-computation <b>recovers the truth</b>. The point: ML fixes the <b>nuisance models</b>; identification still rests on "
            "sequential exchangeability + positivity + consistency.",
        ),
        "reading": t(
            lang,
            f"全程用藥 vs 全程不用：線性 g-formula ≈ {lin:.2f}、ML g-formula ≈ {gb:.2f}、真值 {truth:.2f}。"
            f"線性模型把非線性的 L、Y 配錯而偏；梯度提升學對曲線、貼回真值。",
            f"Always vs never: linear g-formula ≈ {lin:.2f}, ML g-formula ≈ {gb:.2f}, truth {truth:.2f}. The linear model "
            f"mis-fits the non-linear L and Y and is biased; gradient boosting learns the curves and lands on the truth.",
        ),
    }
