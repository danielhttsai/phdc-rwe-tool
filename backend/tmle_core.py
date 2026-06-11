"""TMLE / doubly-robust (AIPW) core — pure numpy.

白話：要估「疫苗 A → 結果 Y」的 ATE，但適應症混淆讓病重者（X 大）較易接種、結果也較差。兩張網：
  ・<b>結果迴歸 Q(A,X)＝E[Y|A,X]</b>（g-computation 用它，標準化 Q(1,X)−Q(0,X)）。
  ・<b>傾向分數 PS＝P(A=1|X)</b>（IPTW 用它）。
單用其一、若設定錯就偏。<b>AIPW（擴增反機率加權）</b>把兩者合起來，<b>只要其一對就不偏</b>（雙重穩健）。
<b>TMLE</b> 在 g-computation 的基礎上，用「clever covariate」做<b>一步 targeting 微調</b>，得到雙重穩健＋
半參數有效率＋邊界安全的插入式估計（van der Laan & Rubin 2006；Luque-Fernandez 等 2018 教學）。

NOTE — faithful teaching re-implementation (van der Laan & Rubin 2006; Gruber & van der Laan;
Luque-Fernandez, Schomaker, Rachet & Schnitzer 2018, Stat Med, continuous-outcome TMLE). Synthetic data.
"""
from __future__ import annotations

import numpy as np

from i18n import t


def _ols(cols, y):
    X = np.column_stack([np.ones(len(y))] + list(cols))
    beta = np.linalg.solve(X.T @ X + 1e-10 * np.eye(X.shape[1]), X.T @ y)
    return beta


def _logit_fit(X, y, iters=25):
    beta = np.zeros(X.shape[1])
    for _ in range(iters):
        p = 1.0 / (1.0 + np.exp(-(X @ beta)))
        W = p * (1 - p) + 1e-9
        grad = X.T @ (y - p)
        H = (X * W[:, None]).T @ X + 1e-8 * np.eye(X.shape[1])
        beta = beta + np.linalg.solve(H, grad)
    return beta


def _ps(A, X):
    Xm = np.column_stack([np.ones(len(A)), X, X ** 2])
    p = 1.0 / (1.0 + np.exp(-(Xm @ _logit_fit(Xm, A))))
    return np.clip(p, 1e-3, 1 - 1e-3)


def _qbar(A, Y, X):
    """Outcome regression Q(A,X) = E[Y|A,X] with X and X^2 (flexible enough here).
    Returns (Q_obs, Q1, Q0): fitted at observed A, and counterfactual at A=1 / A=0."""
    beta = _ols([A, X, X ** 2, A * X], Y)
    def q(a):
        return beta[0] + beta[1] * a + beta[2] * X + beta[3] * X ** 2 + beta[4] * (a * X)
    return q(A), q(np.ones_like(A)), q(np.zeros_like(A))


def _tmle(Y, A, ps, Q1, Q0, Qobs):
    """Continuous-outcome TMLE (Luque-Fernandez 2018): scale Y to [0,1], one logistic
    fluctuation with the clever covariate, update Q, rescale; ATE = mean(Q1*-Q0*)."""
    a, b = float(Y.min()), float(Y.max())
    span = max(b - a, 1e-9)
    Ys = (Y - a) / span
    Q1s = np.clip((Q1 - a) / span, 1e-6, 1 - 1e-6)
    Q0s = np.clip((Q0 - a) / span, 1e-6, 1 - 1e-6)
    Qobss = np.clip((Qobs - a) / span, 1e-6, 1 - 1e-6)
    H = A / ps - (1 - A) / (1 - ps)                     # clever covariate (observed)
    # one-dimensional logistic fluctuation: solve for epsilon by Newton on the score
    eps = 0.0
    for _ in range(50):
        m = 1.0 / (1.0 + np.exp(-(np.log(Qobss / (1 - Qobss)) + eps * H)))
        g = float(np.sum(H * (Ys - m)))
        hess = -float(np.sum(H * H * m * (1 - m))) - 1e-9
        step = g / hess
        eps -= step
        if abs(step) < 1e-8:
            break
    def upd(Q, Hc):
        logit = np.log(Q / (1 - Q)) + eps * Hc
        return 1.0 / (1.0 + np.exp(-logit))
    Q1u = upd(Q1s, 1.0 / ps)
    Q0u = upd(Q0s, -1.0 / (1 - ps))
    psi = float(np.mean(Q1u - Q0u)) * span
    # influence-curve SE
    Qou = upd(Qobss, H)
    ic = H * (Ys - Qou) * span + (Q1u - Q0u) * span - psi
    se = float(np.sqrt(np.var(ic) / len(Y)))
    return psi, se


def full_tmle(df, treat="A", outcome="Y", cov="X", true_ate=None, lang="zh"):
    import tmle_gen
    if true_ate is None:
        true_ate = tmle_gen.TRUE_ATE
    A = np.asarray(df[treat], float); Y = np.asarray(df[outcome], float); X = np.asarray(df[cov], float)

    crude = float(Y[A == 1].mean() - Y[A == 0].mean())
    Qobs, Q1, Q0 = _qbar(A, Y, X)
    gcomp = float(np.mean(Q1 - Q0))                     # g-computation (outcome model only)
    ps = _ps(A, X)
    w = np.where(A == 1, 1.0 / ps, 1.0 / (1.0 - ps))
    iptw = float(np.sum(w * A * Y) / np.sum(w * A) - np.sum(w * (1 - A) * Y) / np.sum(w * (1 - A)))
    aipw = float(np.mean((Q1 - Q0) + A / ps * (Y - Q1) - (1 - A) / (1 - ps) * (Y - Q0)))  # doubly robust
    tmle, se = _tmle(Y, A, ps, Q1, Q0, Qobs)
    lo, hi = tmle - 1.96 * se, tmle + 1.96 * se

    interp = t(
        lang,
        f"直接比較接種 vs 未接種，<b>粗估 ATE ≈ {crude:.2f}</b>，被適應症混淆＋非線性 X 偏掉（真值 {true_ate:.2f}）。"
        f"用兩張網校正後：g-computation ≈ {gcomp:.2f}、IPTW ≈ {iptw:.2f}、<b>雙重穩健 AIPW ≈ {aipw:.2f}</b>、"
        f"<b>TMLE ≈ {tmle:.2f}</b>（95% CI {lo:.2f}～{hi:.2f}）——都貼回真值 {true_ate:.2f}。AIPW／TMLE 的好處是"
        f"<b>雙重穩健</b>：結果模型或傾向分數<b>其一對</b>就不偏；TMLE 再做一步 targeting，效率與邊界更好。",
        f"Comparing vaccinated vs unvaccinated directly, the <b>crude ATE ≈ {crude:.2f}</b> is biased by confounding by indication "
        f"and the non-linear X (truth {true_ate:.2f}). With two models: g-computation ≈ {gcomp:.2f}, IPTW ≈ {iptw:.2f}, "
        f"<b>doubly-robust AIPW ≈ {aipw:.2f}</b>, <b>TMLE ≈ {tmle:.2f}</b> (95% CI {lo:.2f}–{hi:.2f}) — all back near the truth "
        f"{true_ate:.2f}. The value of AIPW/TMLE is <b>double robustness</b>: it stays unbiased if <b>either</b> the outcome model "
        f"or the propensity score is correct; TMLE then adds a targeting step for efficiency and bounded, plug-in estimates.",
    )
    return {
        "crude": crude, "gcomp": gcomp, "iptw": iptw, "aipw": aipw, "tmle": tmle,
        "ci": [lo, hi], "se": se, "true_ate": float(true_ate), "n": int(len(Y)),
        "interpretation": interp,
    }


# ---------------------------------------------------------------------------
# ② interactive — confounding-strength knob (offline grid)
# ---------------------------------------------------------------------------
_CONF = [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5]


def _recompute_grid(n=40000):
    import tmle_gen
    out = {"conf": _CONF, "crude": [], "aipw": [], "tmle": [], "true_ate": tmle_gen.TRUE_ATE}
    for c in _CONF:
        df = tmle_gen.generate(seed=311, n=n, conf=c)
        r = full_tmle(df)
        out["crude"].append(round(r["crude"], 3))
        out["aipw"].append(round(r["aipw"], 3))
        out["tmle"].append(round(r["tmle"], 3))
    return out


_GRID = {
    "conf": [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5],
    "crude": [2.024, 2.091, 2.274, 2.56, 2.919, 3.309, 3.733],
    "aipw": [2.024, 2.026, 2.025, 2.021, 2.029, 2.03, 2.035],
    "tmle": [2.024, 2.026, 2.025, 2.021, 2.029, 2.03, 2.035],
    "true_ate": 2.0,
}


def tmle_interactive(conf=1.0, lang="zh"):
    g = _GRID
    xc = float(np.clip(conf, g["conf"][0], g["conf"][-1]))
    crude = float(np.interp(xc, g["conf"], g["crude"]))
    aipw = float(np.interp(xc, g["conf"], g["aipw"]))
    tmle = float(np.interp(xc, g["conf"], g["tmle"]))
    reading = t(
        lang,
        f"混淆強度 {xc:.2f}：<b>粗估 ≈ {crude:.2f}</b> 被嚴重度 X（含非線性）越推越偏；而 <b>AIPW ≈ {aipw:.2f}</b>、"
        f"<b>TMLE ≈ {tmle:.2f}</b> 不管混淆多強都穩在真值 {g['true_ate']:.1f}。雙重穩健＋targeting 的威力。",
        f"Confounding strength {xc:.2f}: the <b>crude estimate ≈ {crude:.2f}</b> is pushed ever further off by severity X (with its "
        f"non-linearity); while <b>AIPW ≈ {aipw:.2f}</b> and <b>TMLE ≈ {tmle:.2f}</b> stay on the truth {g['true_ate']:.1f} however "
        f"strong the confounding — the power of double robustness + targeting.",
    )
    return {"conf": xc, "crude": crude, "aipw": aipw, "tmle": tmle,
            "true_ate": g["true_ate"], "grid": g, "reading": reading}
