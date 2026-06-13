"""Transportability core — carry a study effect to a target population.

Story (the toolbox's "naive biased -> method recovers truth"): the study's own
average effect is biased for the TARGET when an effect modifier X is distributed
differently. Two transport estimators recover the target effect:
- standardisation / g-formula: fit the effect surface tau(X) on the study, then
  average it over the TARGET's X distribution;
- IOSW (inverse odds of selection weighting): weight study subjects so their X
  distribution matches the target's, then take the weighted ATE.

Refs: Adamson et al. (2026), ISPE framework, Pharmacoepi Drug Saf; Inoue & Hsu
(2024); Westreich, Edwards, Lesko et al.; Dahabreh et al.; Bareinboim & Pearl.
"""
import numpy as np
from transport_gen import generate, BASE, MOD

try:
    from i18n import t
except Exception:  # pragma: no cover
    def t(lang, zh, en):
        return zh if lang == "zh" else en


def _sig(z):
    return 1.0 / (1.0 + np.exp(-z))


def _ols(y, X):
    beta, *_ = np.linalg.lstsq(X, y, rcond=None)
    return beta


def _study_ate(a, y):
    """Plain (randomised) study ATE = mean Y among treated − among controls."""
    return float(y[a == 1].mean() - y[a == 0].mean())


def _standardize(xs, a, ys, xt):
    """Fit Y ~ 1 + A + X + A*X on the study; average the A=1−A=0 gap over target X."""
    X = np.column_stack([np.ones_like(xs), a, xs, a * xs])
    b = _ols(ys, X)                       # b: [intercept, A, X, A*X]
    # predicted individual effect at covariate x is b[A] + b[A*X]*x
    return float(b[1] + b[3] * xt.mean())


def _iosw(xs, a, ys, xt):
    """Inverse-odds-of-selection weights: P(target|X)/P(study|X), then weighted ATE."""
    x = np.concatenate([xs, xt])
    s = np.concatenate([np.ones_like(xs), np.zeros_like(xt)])   # 1 = study, 0 = target
    Xd = np.column_stack([np.ones_like(x), x, x * x])
    # logistic of S ~ X via IRLS (few steps, pure numpy)
    beta = np.zeros(Xd.shape[1])
    for _ in range(25):
        p = _sig(Xd @ beta)
        W = p * (1 - p) + 1e-6
        z = Xd @ beta + (s - p) / W
        beta = np.linalg.lstsq(Xd * W[:, None], z * W, rcond=None)[0]
    ps_study = _sig(np.column_stack([np.ones_like(xs), xs, xs * xs]) @ beta)
    w = (1 - ps_study) / np.clip(ps_study, 1e-3, 1 - 1e-3)       # odds of being target
    w1, w0 = w[a == 1], w[a == 0]
    m1 = np.average(ys[a == 1], weights=w1)
    m0 = np.average(ys[a == 0], weights=w0)
    return float(m1 - m0)


def full_transport(mu_target=None, lang="zh", seed=5):
    d = generate(mu_target=(0.5 if mu_target is None else float(mu_target)), seed=seed)
    xs, a, ys, xt = d["study_X"], d["study_A"], d["study_Y"], d["target_X"]
    truth = d["target_effect"]
    naive = _study_ate(a, ys)
    std = _standardize(xs, a, ys, xt)
    iosw = _iosw(xs, a, ys, xt)
    gap = naive - truth
    reading = t(
        lang,
        f"目標族群的真實效果＝<b>{truth:.2f}</b>。直接把研究效果（<b>{naive:.2f}</b>）拿來用，因為效果修飾子 X 的分布不同而偏了 {gap:+.2f}；"
        f"<b>標準化</b>＝{std:.2f}、<b>選樣反機率加權（IOSW）</b>＝{iosw:.2f}，兩者都把效果搬回目標族群。",
        f"The true effect in the target = <b>{truth:.2f}</b>. Using the study effect directly (<b>{naive:.2f}</b>) is off by {gap:+.2f} because the effect-modifier X is distributed differently; "
        f"<b>standardisation</b> = {std:.2f} and <b>inverse-odds-of-selection weighting (IOSW)</b> = {iosw:.2f} both carry the effect to the target.",
    )
    interp = t(
        lang,
        "可轉移性靠『把研究的效果修飾子分布，重新加權／標準化成目標的分布』。前提：沒有未測量、且兩族群分布不同的效果修飾子，且目標的共變項落在研究的支持範圍內（正性）。",
        "Transportability reweights / standardises the study's effect-modifier distribution to the target's. It assumes no unmeasured effect modifier whose distribution differs across populations, and that the target's covariates lie within the study's support (positivity).",
    )
    return {
        "mu_study": d["mu_study"], "mu_target": d["mu_target"],
        "truth": truth, "naive": naive, "standardize": std, "iosw": iosw,
        "study_effect": d["study_effect"], "reading": reading, "interpretation": interp,
    }


def transport_interactive(mu_target, lang="zh"):
    return full_transport(mu_target=mu_target, lang=lang)
