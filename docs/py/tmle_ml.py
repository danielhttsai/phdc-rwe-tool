"""TMLE ⑤『用 AI 強化』—— a GENUINE machine-learning demo (real scikit-learn).

對應文獻：TMLE／AIPW 配 Super Learner（van der Laan & Rubin 2006；Luque-Fernandez 等 2018）。當結果與
傾向都<b>非線性</b>時，只配<b>線性</b>的單一模型（g-computation 或 IPW）會偏；用<b>梯度提升</b>當兩個輔助模型、
做<b>交叉擬合的 AIPW</b>（雙重穩健），就能把非線性學對、ATE 回到真值。

教學重點：TMLE/AIPW 把彈性 ML 放進<b>輔助</b>（結果＋傾向）模型，識別仍靠「無未測混淆＋正性」。交叉擬合是安全帶。
誠實聲明：合成資料、簡化教學重建。
"""
from __future__ import annotations

import numpy as np

from i18n import t


def _gen(rng, n):
    X1 = rng.normal(0, 1, n)
    X2 = rng.normal(0, 1, n)
    logit = 1.4 * (X1 > 0.4) + 1.2 * X1 * X2 - 0.8 * (X2 ** 2 - 1.0)
    A = (rng.random(n) < 1.0 / (1.0 + np.exp(-logit))).astype(float)
    Y = 2.0 * A + 1.0 * X1 + 0.9 * X2 + 0.8 * X1 * X2 + 0.6 * (X1 ** 2 - 1.0) + rng.normal(0, 1.0, n)
    return np.column_stack([X1, X2]), A, Y


def _aipw(Y, A, ps, Q1, Q0):
    ps = np.clip(ps, 1e-3, 1 - 1e-3)
    return float(np.mean((Q1 - Q0) + A / ps * (Y - Q1) - (1 - A) / (1 - ps) * (Y - Q0)))


def ml_tmle_demo(seed=43, lang="zh"):
    """Real sklearn. Non-linear/interactive outcome AND propensity surfaces: a single
    LINEAR model (linear g-computation) is biased; cross-fitted AIPW with gradient-boosted
    nuisances recovers the true ATE (2.0)."""
    from sklearn.linear_model import LinearRegression, LogisticRegression
    from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor

    rng = np.random.default_rng(seed)
    Xf, A, Y = _gen(rng, 4000)
    truth = 2.0

    # naive: a single LINEAR outcome model (g-computation), main effects only
    lin = LinearRegression().fit(np.column_stack([A, Xf]), Y)
    def qlin(a):
        return lin.predict(np.column_stack([np.full(len(A), a), Xf]))
    ate_lin = float(np.mean(qlin(1) - qlin(0)))

    # AIPW with gradient-boosted nuisances + 2-fold cross-fitting
    n = len(A); idx = rng.permutation(n); fold = idx[: n // 2], idx[n // 2:]
    Q1 = np.zeros(n); Q0 = np.zeros(n); ps = np.zeros(n)
    for tr, te in (fold, (fold[1], fold[0])):
        gr = GradientBoostingRegressor(n_estimators=250, max_depth=3, learning_rate=0.05, subsample=0.8, random_state=seed)
        gr.fit(np.column_stack([A[tr], Xf[tr]]), Y[tr])
        Q1[te] = gr.predict(np.column_stack([np.ones(len(te)), Xf[te]]))
        Q0[te] = gr.predict(np.column_stack([np.zeros(len(te)), Xf[te]]))
        gc = GradientBoostingClassifier(n_estimators=250, max_depth=3, learning_rate=0.05, subsample=0.8, random_state=seed)
        gc.fit(Xf[tr], A[tr])
        ps[te] = gc.predict_proba(Xf[te])[:, 1]
    ate_ml = _aipw(Y, A, ps, Q1, Q0)

    return {
        "key": "tmle_ml",
        "ate_lin": round(ate_lin, 3), "ate_ml": round(ate_ml, 3), "ate_true": truth,
        "bars": {"labels": [t(lang, "線性單模型 g-comp", "single linear g-computation"),
                            t(lang, "交叉擬合 AIPW（GB×GB）", "cross-fit AIPW (GB×GB)"),
                            t(lang, "真值", "truth")],
                 "values": [round(ate_lin, 3), round(ate_ml, 3), truth]},
        "plain": t(
            lang,
            "情境：結果和「會不會接種」對共變項都是<b>非線性、有交互</b>的。只配一個<b>線性</b>結果模型做 g-computation，"
            "把結構配錯、ATE <b>偏</b>。改用<b>梯度提升</b>當結果與傾向兩個輔助模型、做<b>交叉擬合的 AIPW</b>（雙重穩健）："
            "非線性學對、ATE <b>回到真值</b>。這正是 TMLE／AIPW 搭 Super Learner 的精神——彈性 ML 配輔助模型，"
            "識別仍靠無未測混淆＋正性，交叉擬合當安全帶。",
            "Here both the outcome and the propensity depend on the covariates in a <b>non-linear, interactive</b> way. A single "
            "<b>linear</b> outcome model (g-computation) mis-specifies the structure and the ATE is <b>biased</b>. Using "
            "<b>gradient boosting</b> for both nuisance models with <b>cross-fitted AIPW</b> (doubly robust) learns the "
            "non-linearity and the ATE <b>returns to the truth</b> — exactly the spirit of TMLE/AIPW with a Super Learner: flexible "
            "ML for the nuisances, identification still from no-unmeasured-confounding + positivity, cross-fitting as the safety belt.",
        ),
        "reading": t(
            lang,
            f"ATE：線性單模型 ≈ {ate_lin:.2f}、交叉擬合 AIPW ≈ {ate_ml:.2f}、真值 {truth:.1f}。彈性 ML＋交叉擬合把線性模型留下的偏誤清掉了。",
            f"ATE: single linear model ≈ {ate_lin:.2f}, cross-fit AIPW ≈ {ate_ml:.2f}, truth {truth:.1f}. Flexible ML + cross-fitting "
            f"cleared the bias the linear model left.",
        ),
    }
