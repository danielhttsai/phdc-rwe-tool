"""Missing-data / imputation teaching demo.

Story (the toolbox's signature "naive biased → method recovers truth"):
the adjusted effect of A on Y needs the confounder X. When X has missing values,
- complete-case analysis is fine under MCAR but biased under MAR (it selects on Y),
- mean imputation is biased even under MCAR (it flattens X, leaving residual
  confounding), and
- multiple imputation (impute X from A and Y, repeat, pool) recovers the truth
  under MAR.

All numpy closed-form OLS; fast enough to recompute live on the slider.
Refs: Rubin (1987); van Buuren (2018) mice; Sterne et al. (2009), BMJ.
"""
import numpy as np
from missing_gen import generate, TRUE_TAU, SEED

try:
    from i18n import t
except Exception:  # pragma: no cover - fallback when i18n not importable
    def t(lang, zh, en):
        return zh if lang == "zh" else en


def _sig(z):
    return 1.0 / (1.0 + np.exp(-z))


def _ols(y, *cols):
    """OLS of y ~ intercept + cols; returns the full coefficient vector."""
    X = np.column_stack([np.ones_like(y)] + list(cols))
    beta, *_ = np.linalg.lstsq(X, y, rcond=None)
    return beta


def _effect(a, x, y):
    """Adjusted effect of A in Y ~ A + X (the coefficient on A)."""
    return float(_ols(y, a, x)[1])


def _make_missing(x, y, p, mechanism, rng):
    n = x.size
    if mechanism == "MCAR":
        return rng.random(n) < p
    # MAR: the chance X is missing rises with the (observed) outcome Y
    yz = (y - y.mean()) / (y.std() + 1e-9)
    logit = np.log(p / (1.0 - p) + 1e-12) + 1.3 * yz
    return rng.random(n) < _sig(logit)


def _mean_impute(x, miss):
    xi = x.copy()
    xi[miss] = x[~miss].mean()
    return xi


def _multiple_impute(a, x, y, miss, M=20, seed=0):
    """Impute X ~ A + Y (+ Gaussian noise) on complete cases, M draws, pool A's effect."""
    rng = np.random.default_rng(seed)
    obs = ~miss
    Xd = np.column_stack([np.ones(int(obs.sum())), a[obs], y[obs]])
    coef, *_ = np.linalg.lstsq(Xd, x[obs], rcond=None)
    resid = x[obs] - Xd @ coef
    sd = float(resid.std())
    pred = np.column_stack([np.ones(int(miss.sum())), a[miss], y[miss]]) @ coef
    ests = []
    for _ in range(M):
        xi = x.copy()
        xi[miss] = pred + rng.normal(0.0, sd, int(miss.sum()))
        ests.append(_effect(a, xi, y))
    return float(np.mean(ests))


def full_missing(p=0.4, mechanism="MAR", lang="zh", seed=SEED):
    p = float(min(max(p, 0.05), 0.7))
    mechanism = "MCAR" if str(mechanism).upper() == "MCAR" else "MAR"
    d = generate(seed=seed)
    a, x, y = d["A"], d["X"], d["Y"]
    rng = np.random.default_rng(seed + 1)
    miss = _make_missing(x, y, p, mechanism, rng)
    obs = ~miss

    truth = _effect(a, x, y)                       # full-data adjusted ≈ TRUE_TAU
    naive = float(_ols(y, a)[1])                   # unadjusted (confounded)
    cc = _effect(a[obs], x[obs], y[obs])           # complete-case
    me = _effect(a, _mean_impute(x, miss), y)      # mean imputation
    mi = _multiple_impute(a, x, y, miss, seed=seed + 2)  # multiple imputation
    rate = float(miss.mean())

    mech_zh = "完全隨機缺失（MCAR）" if mechanism == "MCAR" else "隨機缺失（MAR；缺失與結果 Y 有關）"
    mech_en = "MCAR (missing completely at random)" if mechanism == "MCAR" else "MAR (missingness depends on the outcome Y)"
    reading = t(
        lang,
        f"真值（用上完整 X 的校正效果）＝<b>{truth:.2f}</b>。在 {mech_zh}、缺失率約 {rate*100:.0f}% 下："
        f"<b>完整個案</b>＝{cc:.2f}、<b>平均值插補</b>＝{me:.2f}、<b>多重插補</b>＝{mi:.2f}。"
        + ("平均值插補把 X 壓平、殘留混淆 → 偏向天真值；多重插補把不確定性也補回來 → 貼回真值。"
           if mechanism == "MCAR" else
           "缺失與 Y 相關時，完整個案是「對結果選樣」→ 偏；平均值插補也偏；多重插補因為把 Y 放進插補模型 → 救回真值。"),
        f"Truth (the adjusted effect using the full X) = <b>{truth:.2f}</b>. Under {mech_en} at ~{rate*100:.0f}% missing: "
        f"<b>complete-case</b> = {cc:.2f}, <b>mean imputation</b> = {me:.2f}, <b>multiple imputation</b> = {mi:.2f}. "
        + ("Mean imputation flattens X and leaves residual confounding → drifts toward the naive value; multiple imputation puts the uncertainty back → returns to the truth."
           if mechanism == "MCAR" else
           "When missingness depends on Y, complete-case analysis selects on the outcome → biased; mean imputation is biased too; multiple imputation uses Y in the imputation model → recovers the truth."),
    )
    interp = t(
        lang,
        "多重插補在 MAR 下能還原真值，因為它把『與缺失有關的變數（含結果）』放進插補模型，並用多次抽樣把不確定性算進去。",
        "Multiple imputation recovers the truth under MAR because it puts the variables related to missingness (including the outcome) into the imputation model and propagates the uncertainty across draws.",
    )
    return {
        "p": p, "mechanism": mechanism, "missing_rate": rate,
        "truth": truth, "naive": naive,
        "complete_case": cc, "mean_impute": me, "multiple_imputation": mi,
        "reading": reading, "interpretation": interp,
    }


def missing_interactive(p, mechanism, lang="zh"):
    return full_missing(p=p, mechanism=mechanism, lang=lang)
