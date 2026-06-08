"""Mediation analysis (MED) core — pure numpy.

白話：疫苗 A 降低感染 Y，但有多少是<b>透過抗體 M</b>（間接 NIE），多少<b>走其他路徑</b>（直接 NDE）？
把總效果拆成 <b>TE ＝ NDE ＋ NIE</b>，並報<b>被中介比例</b> = NIE ÷ TE。

  做法（反事實分解，沿 Imai 等 `mediation` 與 VanderWeele）：
    中介模型：M ~ A + X            → (m0, a, mX)
    結果模型：Y ~ A + M + A·M + X  → (d, b, g, …)   （含暴露×中介交互 g）
    NDE = d + g·E[M(0)]           （把暴露設 0→1，中介固定在「沒接種會有的水準」）
    NIE = (b + g)·a               （暴露設 1，中介從 M(0)→M(1) 的搬移）
    TE  = NDE + NIE ；  proportion mediated = NIE / TE
  對照：<b>天真直接效果</b>＝只放 Y ~ A + M（無交互）的 A 係數——有交互或基線中介≠0 時，它<b>不等於</b> NDE。

NOTE — faithful-but-simplified teaching reconstruction (Baron & Kenny 1986; Imai, Keele, Tingley
& Yamamoto; Tingley et al. `mediation` R package, JSS 2014; VanderWeele & Valeri 2013 SAS/SPSS
macros; Stata `mediate`). Synthetic data only.
"""
from __future__ import annotations

import numpy as np

from i18n import t


def _ols(cols, y):
    """OLS with intercept. cols = list of 1-D arrays. Returns (beta, se) incl. intercept."""
    X = np.column_stack([np.ones(len(y))] + list(cols))
    XtX = X.T @ X
    XtXi = np.linalg.inv(XtX + 1e-10 * np.eye(X.shape[1]))
    beta = XtXi @ (X.T @ y)
    resid = y - X @ beta
    dof = max(len(y) - X.shape[1], 1)
    sigma2 = float(resid @ resid) / dof
    se = np.sqrt(np.diag(XtXi) * sigma2)
    return beta, se


def _decompose(A, M, X, Y):
    """Natural-effects decomposition with exposure-mediator interaction.
    Returns (NDE, NIE, TE, proportion_mediated, naive_direct, total)."""
    # mediator model M ~ A + X  → intercept, a, mX
    bm, _ = _ols([A, X], M)
    m0, a, mX = float(bm[0]), float(bm[1]), float(bm[2])
    EM0 = m0 + mX * float(np.mean(X))               # E[M(0)] averaged over X
    # outcome model Y ~ A + M + A*M + X  → intercept, d, b, g, yX
    bo, _ = _ols([A, M, A * M, X], Y)
    d, b, g = float(bo[1]), float(bo[2]), float(bo[3])
    nde = d + g * EM0
    nie = (b + g) * a
    te = nde + nie
    pm = nie / te if abs(te) > 1e-9 else float("nan")
    # contrasts
    naive_direct = float(_ols([A, M, X], Y)[0][1])  # Y~A+M+X (no interaction)
    total = float(_ols([A, X], Y)[0][1])            # Y~A+X
    return nde, nie, te, pm, naive_direct, total


def full_med(df, treat="A", mediator="M", outcome="Y", cov="X",
             true_nde=None, true_nie=None, n_boot=400, lang="zh"):
    import med_gen
    if true_nde is None:
        true_nde = med_gen.TRUE_NDE
    if true_nie is None:
        true_nie = med_gen.TRUE_NIE
    true_te = true_nde + true_nie
    A = np.asarray(df[treat], dtype=float); M = np.asarray(df[mediator], dtype=float)
    X = np.asarray(df[cov], dtype=float); Y = np.asarray(df[outcome], dtype=float)

    nde, nie, te, pm, naive_direct, total = _decompose(A, M, X, Y)

    # bootstrap CIs for NDE, NIE, proportion mediated
    ci = {"NDE": [None, None], "NIE": [None, None], "PM": [None, None]}
    if n_boot and n_boot > 0:
        rng = np.random.default_rng(20260608); nN = len(Y)
        bn, bi, bp = [], [], []
        for _ in range(int(n_boot)):
            idx = rng.integers(0, nN, nN)
            try:
                r = _decompose(A[idx], M[idx], X[idx], Y[idx])
                bn.append(r[0]); bi.append(r[1]); bp.append(r[3])
            except Exception:
                pass
        if bn:
            ci["NDE"] = [float(np.percentile(bn, 2.5)), float(np.percentile(bn, 97.5))]
            ci["NIE"] = [float(np.percentile(bi, 2.5)), float(np.percentile(bi, 97.5))]
            ci["PM"] = [float(np.percentile(bp, 2.5)), float(np.percentile(bp, 97.5))]

    interp = t(
        lang,
        f"疫苗對感染的<b>總效果 TE ≈ {te:.2f}</b>（真值 {true_te:.2f}）。把它拆開："
        f"<b>自然間接效果 NIE ≈ {nie:.2f}</b>（透過抗體 M 的部分）"
        + (f"、95% 自助 CI {ci['NIE'][0]:.2f}～{ci['NIE'][1]:.2f}" if ci['NIE'][0] is not None else "")
        + f"；<b>自然直接效果 NDE ≈ {nde:.2f}</b>（走其他路徑）"
        + (f"、95% CI {ci['NDE'][0]:.2f}～{ci['NDE'][1]:.2f}" if ci['NDE'][0] is not None else "")
        + f"。<b>被中介比例 ≈ {pm*100:.0f}%</b>——約一半的保護來自抗體。"
        f"注意：若只用『Y ~ A + M』的 A 係數當直接效果，會得到 ≈ <b>{naive_direct:.2f}</b>，"
        f"因為忽略了<b>暴露×中介交互</b>，並不等於真正的 NDE（{true_nde:.2f}）。",
        f"The vaccine's <b>total effect on infection TE ≈ {te:.2f}</b> (truth {true_te:.2f}). Decomposed: "
        f"<b>natural indirect effect NIE ≈ {nie:.2f}</b> (the part through antibodies M)"
        + (f", 95% bootstrap CI {ci['NIE'][0]:.2f}–{ci['NIE'][1]:.2f}" if ci['NIE'][0] is not None else "")
        + f"; <b>natural direct effect NDE ≈ {nde:.2f}</b> (other pathways)"
        + (f", 95% CI {ci['NDE'][0]:.2f}–{ci['NDE'][1]:.2f}" if ci['NDE'][0] is not None else "")
        + f". <b>Proportion mediated ≈ {pm*100:.0f}%</b> — about half the protection runs through antibodies. "
        f"Note: taking the A coefficient from 'Y ~ A + M' as the direct effect gives ≈ <b>{naive_direct:.2f}</b>, "
        f"which ignores the <b>exposure-mediator interaction</b> and is NOT the true NDE ({true_nde:.2f}).",
    )
    return {
        "nde": nde, "nie": nie, "te": te, "pm": pm,
        "ci_nde": ci["NDE"], "ci_nie": ci["NIE"], "ci_pm": ci["PM"],
        "naive_direct": naive_direct, "total": total,
        "true_nde": float(true_nde), "true_nie": float(true_nie), "true_te": float(true_te),
        "n": int(len(Y)), "interpretation": interp,
    }


# ---------------------------------------------------------------------------
# ② interactive — mediator-pathway-strength knob. As the antibody→infection
# pathway (b and the interaction g) strengthens, NIE grows and the proportion
# mediated rises, while NDE stays ~constant. Offline-precomputed grid.
# ---------------------------------------------------------------------------
_S_X = [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5]


def _recompute_grid(n=60000):
    import med_gen
    out = {"s": _S_X, "nde": [], "nie": [], "te": [], "pm": [],
           "tnde": [], "tnie": [], "tte": []}
    base_b, base_g = med_gen.Y_M, med_gen.Y_AM
    for s in out["s"]:
        b, g = base_b * s, base_g * s
        df = med_gen.generate(seed=202, n=n, y_m=b, y_am=g)
        r = full_med(df, n_boot=0)
        tr = med_gen.true_effects(b=b, g=g)
        out["nde"].append(round(r["nde"], 3)); out["nie"].append(round(r["nie"], 3))
        out["te"].append(round(r["te"], 3)); out["pm"].append(round(r["pm"], 3))
        out["tnde"].append(round(tr["NDE"], 3)); out["tnie"].append(round(tr["NIE"], 3))
        out["tte"].append(round(tr["TE"], 3))
    return out


# precomputed via _recompute_grid(n=60000): NIE grows (more mediation), NDE ~ constant,
# proportion mediated rises from ~0.
_GRID = {
    "s": [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5],
    "nde": [-0.381, -0.418, -0.455, -0.492, -0.529, -0.566, -0.603],
    "nie": [-0.007, -0.167, -0.327, -0.488, -0.648, -0.808, -0.969],
    "te": [-0.387, -0.585, -0.782, -0.98, -1.177, -1.375, -1.572],
    "pm": [0.017, 0.285, 0.418, 0.498, 0.551, 0.588, 0.616],
}


def med_interactive(strength=1.0, lang="zh"):
    g = _GRID
    xs = float(np.clip(strength, g["s"][0], g["s"][-1]))
    nde = float(np.interp(xs, g["s"], g["nde"]))
    nie = float(np.interp(xs, g["s"], g["nie"]))
    te = float(np.interp(xs, g["s"], g["te"]))
    pm = float(np.interp(xs, g["s"], g["pm"]))
    reading = t(
        lang,
        f"中介路徑（抗體 → 感染）強度 {xs:.2f}：<b>間接效果 NIE ≈ {nie:.2f}</b> 隨之變大，"
        f"<b>被中介比例 ≈ {pm*100:.0f}%</b> 上升；<b>直接效果 NDE ≈ {nde:.2f}</b> 幾乎不動；"
        f"總效果 TE ≈ {te:.2f} 也跟著變。強度為 0 時，保護完全不經抗體（NIE=0、proportion=0）。",
        f"Mediator-pathway (antibody → infection) strength {xs:.2f}: the <b>indirect effect NIE ≈ {nie:.2f}</b> grows and the "
        f"<b>proportion mediated ≈ {pm*100:.0f}%</b> rises; the <b>direct effect NDE ≈ {nde:.2f}</b> barely moves; the total "
        f"TE ≈ {te:.2f} shifts too. At strength 0 none of the protection runs through antibodies (NIE=0, proportion=0).",
    )
    return {"strength": xs, "nde": nde, "nie": nie, "te": te, "pm": pm,
            "grid": g, "reading": reading}
