"""PNU ⑤『用 AI 強化』—— a GENUINE machine-learning demo (real scikit-learn).

對應文獻：PNU 的核心是<b>時間條件傾向分數</b>（Suissa, Moodie & Dell'Aniello 2017）；用<b>機器學習</b>
估計傾向分數的工作（Schneeweiss 等 2009 hdPS；Lee, Lessler & Stuart 2010 boosted PS）讓它能抓到
<b>非線性</b>的選擇結構。教學重點：盛行使用者的『拿 A 還是 B』和<b>距起始時間</b>、體質是<b>非線性</b>關係
（起始後的高風險期會隨時間衰減）。只放主效應的<b>邏輯斯時間條件 PS</b> 設定錯誤、校正不乾淨、留下殘餘
耗竭偏誤；改用<b>梯度提升</b>估時間條件 PS 能抓到非線性、把速率比拉回真值。
"""
from __future__ import annotations

import numpy as np

from i18n import t


def _wirr(event, fut, isA, w):
    eA = float(np.sum(w[isA] * event[isA])); tA = float(np.sum(w[isA] * fut[isA]))
    eB = float(np.sum(w[~isA] * event[~isA])); tB = float(np.sum(w[~isA] * fut[~isA]))
    if tA <= 0 or tB <= 0 or eB <= 0:
        return float("nan")
    return (eA / tA) / (eB / tB)


def ps_ml_demo(seed=53, lang="zh"):
    """Real sklearn. Both drugs have a spread of time-since-start (new + prevalent users), so a
    TIME-CONDITIONAL propensity score P(A | frailty, time-since-start) has overlap. The A-vs-B
    pattern depends NON-LINEARLY on time-since-start and frailty; the hazard has a non-linear
    early-risk decay. A main-effects LOGISTIC time-conditional PS is mis-specified → IPTW leaves
    residual depletion bias; a GRADIENT-BOOSTING PS captures the non-linearity → recovers the
    truth. Compared on the same data."""
    from sklearn.linear_model import LogisticRegression
    from sklearn.ensemble import GradientBoostingClassifier
    from sklearn.metrics import roc_auc_score

    rng = np.random.default_rng(seed)
    n = 24000
    true_hr = 1.7
    fr = rng.normal(0, 1, n)
    tss = rng.uniform(0, 3, n)                              # years since start (both drugs)
    # A-vs-B choice depends NON-LINEARLY on time-since-start and frailty (thresholds + interaction)
    logit_A = (-0.2 + 1.6 * (tss > 1.2).astype(float) + 1.4 * fr * (tss > 1.0).astype(float)
               - 1.2 * (fr < -0.5).astype(float))
    isA = rng.random(n) < (1.0 / (1.0 + np.exp(-logit_A)))
    early = 1.0 + 1.8 * np.exp(-tss / 0.5)                  # non-linear early-risk decay
    lam = 0.16 * np.exp(0.85 * fr) * early * np.where(isA, true_hr, 1.0)
    lam = np.clip(lam, 1e-4, None)
    evt_time = rng.exponential(1.0 / lam)
    fut = np.minimum(evt_time, 1.0)
    event = (evt_time <= 1.0).astype(float)

    # main effects only → a linear time-conditional PS can't represent the thresholds/interaction
    X = np.column_stack([fr, tss])
    y = isA.astype(int)
    ntr = int(0.6 * n); idx = rng.permutation(n); tr = idx[:ntr]

    lin = LogisticRegression(max_iter=300).fit(X[tr], y[tr])
    gb = GradientBoostingClassifier(n_estimators=350, max_depth=3, learning_rate=0.05,
                                    subsample=0.8, random_state=seed).fit(X[tr], y[tr])
    ps_lin = np.clip(lin.predict_proba(X)[:, 1], 0.02, 0.98)
    ps_gb = np.clip(gb.predict_proba(X)[:, 1], 0.02, 0.98)
    auc_lin = float(roc_auc_score(y, ps_lin)); auc_gb = float(roc_auc_score(y, ps_gb))

    pA = float(y.mean())
    def stab_w(ps):
        return np.where(isA, pA / ps, (1 - pA) / (1 - ps))
    irr_unadj = _wirr(event, fut, isA, np.ones(n))
    irr_lin = _wirr(event, fut, isA, stab_w(ps_lin))
    irr_gb = _wirr(event, fut, isA, stab_w(ps_gb))

    return {
        "key": "pnu_ps_ml",
        "title": t(lang, "機器學習時間條件傾向分數：把耗竭偏誤校乾淨（真的跑 ML）",
                   "ML time-conditional propensity score: clean up depletion bias (real ML)"),
        "auc_logistic": round(auc_lin, 3), "auc_gb": round(auc_gb, 3),
        "true_hr": true_hr,
        "irr_unadj": round(irr_unadj, 2), "irr_logistic": round(irr_lin, 2), "irr_gb": round(irr_gb, 2),
        "bars": {"labels": [t(lang, "未校正", "unadjusted"),
                            t(lang, "邏輯斯時間條件 PS", "logistic time-conditional PS"),
                            t(lang, "梯度提升時間條件 PS", "gradient-boosting time-conditional PS"),
                            t(lang, "真值", "truth")],
                 "values": [round(irr_unadj, 2), round(irr_lin, 2), round(irr_gb, 2), true_hr]},
        "plain": t(
            lang,
            "PNU 用<b>時間條件傾向分數</b>（依距起始時間＋體質）把盛行使用者納回來。這裡『拿 A 還是 B』和<b>距起始時間</b>、"
            "體質是<b>非線性</b>關係（起始後的高風險期隨時間衰減）。只放主效應的<b>邏輯斯</b>時間條件 PS 設定錯誤、校正不乾淨，"
            "速率比仍被耗竭往無效值拉；改用<b>梯度提升</b>估時間條件 PS 抓到非線性，IPTW 加權後把速率比拉回<b>真值</b>。"
            "這是本頁真的呼叫 scikit-learn 的地方。",
            "PNU brings prevalent users back with a <b>time-conditional propensity score</b> (on time-since-start + frailty). "
            "Here the A-vs-B pattern depends <b>non-linearly</b> on time-since-start and frailty (the early-risk period decays "
            "over time). A main-effects <b>logistic</b> time-conditional PS is mis-specified and adjusts imperfectly, so the "
            "rate ratio stays pulled toward the null by depletion; a <b>gradient-boosting</b> time-conditional PS captures the "
            "non-linearity, and IPTW weighting pulls the rate ratio back to the <b>truth</b>. This is where the page really "
            "calls scikit-learn.",
        ),
        "reading": t(
            lang,
            f"未校正 ≈ {irr_unadj:.2f}（偏離真值）；主效應<b>邏輯斯時間條件 PS</b> ≈ {irr_lin:.2f}（仍偏，PS 設定錯誤，"
            f"AUC ≈ {auc_lin:.3f}）；<b>梯度提升時間條件 PS</b> ≈ {irr_gb:.2f}（AUC ≈ {auc_gb:.3f}）——貼回真值 {true_hr:.2f}。",
            f"Unadjusted ≈ {irr_unadj:.2f} (off the truth); main-effects <b>logistic time-conditional PS</b> "
            f"≈ {irr_lin:.2f} (still biased — mis-specified, AUC ≈ {auc_lin:.3f}); <b>gradient-boosting time-conditional PS</b> "
            f"≈ {irr_gb:.2f} (AUC ≈ {auc_gb:.3f}) — back on the truth {true_hr:.2f}.",
        ),
    }
