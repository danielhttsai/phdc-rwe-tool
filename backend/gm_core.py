"""G-methods core — pure numpy.

白話：兩個時點的治療 A₀、A₁，中間有時變混淆 Lₜ，且<b>過去治療會改變 Lₜ</b>（治療↔混淆回饋）。
想估「全程用藥(1,1) vs 全程不用(0,0)」的因果效果。標準迴歸<b>兩頭錯</b>：

  ・<b>不校正 Lₜ（粗估）</b>：被混淆（病重者較常用藥、也較糟）→ 偏。
  ・<b>校正 Lₜ</b>：L₁ 是 A₀ 的<b>中介</b>（擋掉 A→L→Y 的效果）又是<b>對撞</b>（開啟偏誤）→ 偏。
  ・<b>g-formula（參數 g-公式）</b>：建 L₁、Y 的模型，模擬 always vs never，標準化 → 還原真值。
  ・<b>IPTW-MSM（邊際結構模型）</b>：用治療史的反機率加權，去掉指向 Aₜ 的箭頭，配邊際模型 → 還原真值。

識別需要：序列可交換（無未測時變混淆）、每個時點正性、模型設定正確、一致性。
Reimplements the standard estimators (Robins, Hernán & Brumback 2000; Naimi, Cole & Kennedy 2017;
Daniel et al. 2013). Synthetic data only.
"""
from __future__ import annotations

import numpy as np

from i18n import t


def _ols(cols, y):
    X = np.column_stack([np.ones(len(y))] + list(cols))
    beta = np.linalg.lstsq(X, y, rcond=None)[0]
    return beta


def _logit(X, y, iters=30):
    beta = np.zeros(X.shape[1])
    for _ in range(iters):
        p = 1.0 / (1.0 + np.exp(-(X @ beta)))
        W = p * (1 - p) + 1e-9
        H = (X * W[:, None]).T @ X + 1e-8 * np.eye(X.shape[1])
        step = np.linalg.solve(H, X.T @ (y - p))
        beta = beta + step
        if np.max(np.abs(step)) < 1e-8:
            break
    return beta


def _sig(x):
    return 1.0 / (1.0 + np.exp(-x))


def _gformula(L0, A0, L1, A1, Y):
    """Parametric g-computation: model L1|L0,A0 and Y|history; simulate always vs never."""
    bL = _ols([L0, A0], L1)
    bY = _ols([L0, A0, L1, A1], Y)

    def predict(a0, a1):
        L1p = bL[0] + bL[1] * L0 + bL[2] * a0
        return bY[0] + bY[1] * L0 + bY[2] * a0 + bY[3] * L1p + bY[4] * a1
    return float(np.mean(predict(1, 1) - predict(0, 0)))


def _iptw_msm(L0, A0, L1, A1, Y, clip=20.0):
    """Stabilized IPTW for a marginal structural model E[Y^a] = b0 + b1*(a0+a1)."""
    n = len(A0)
    g0 = _logit(np.column_stack([np.ones(n), L0]), A0)
    p0 = _sig(np.column_stack([np.ones(n), L0]) @ g0)
    sn0 = A0.mean()
    g1 = _logit(np.column_stack([np.ones(n), A0, L1]), A1)
    p1 = _sig(np.column_stack([np.ones(n), A0, L1]) @ g1)
    gn1 = _logit(np.column_stack([np.ones(n), A0]), A1)
    pn1 = _sig(np.column_stack([np.ones(n), A0]) @ gn1)
    w0 = np.where(A0 == 1, sn0 / p0, (1 - sn0) / (1 - p0))
    w1 = np.where(A1 == 1, pn1 / p1, (1 - pn1) / (1 - p1))
    w = np.clip(w0 * w1, 0, clip)
    A = A0 + A1
    Xm = np.column_stack([np.ones(n), A])
    sw = np.sqrt(w)
    bm = np.linalg.lstsq(Xm * sw[:, None], sw * Y, rcond=None)[0]
    return float(bm[1] * 2.0), w


def full_gm(df, lang="zh"):
    import gm_gen
    L0 = np.asarray(df["L0"], float); A0 = np.asarray(df["A0"], float)
    L1 = np.asarray(df["L1"], float); A1 = np.asarray(df["A1"], float)
    Y = np.asarray(df["Y"], float)
    truth = gm_gen.true_effect()

    A = A0 + A1
    naive_unadj = float(_ols([A], Y)[1] * 2.0)
    b_adj = _ols([A0, A1, L0, L1], Y)
    naive_adj = float(b_adj[1] + b_adj[2])
    gform = _gformula(L0, A0, L1, A1, Y)
    iptw, w = _iptw_msm(L0, A0, L1, A1, Y)

    interp = t(
        lang,
        f"想估「全程用藥 vs 全程不用」的效果（真值 {truth:.2f}）。<b>不校正時變混淆</b>的粗估 ≈ <b>{naive_unadj:.2f}</b>"
        f"——被「病重者較常用藥、也較糟」嚴重<b>偏掉</b>（甚至看起來方向相反）。<b>校正 Lₜ</b> ≈ <b>{naive_adj:.2f}</b>"
        f"——因為 L₁ 同時是<b>中介</b>（擋掉 A→L→Y 的好處）又是<b>對撞</b>，仍然偏。改用 g-methods："
        f"<b>g-formula</b> ≈ <b>{gform:.2f}</b>、<b>IPTW-MSM</b> ≈ <b>{iptw:.2f}</b>——都貼回真值 {truth:.2f}。",
        f"We want the effect of 'always treat vs never treat' (truth {truth:.2f}). The <b>unadjusted</b> crude estimate ≈ "
        f"<b>{naive_unadj:.2f}</b> is badly <b>biased</b> by confounding (sicker people are treated more and do worse — it can even "
        f"flip sign). <b>Adjusting for Lₜ</b> ≈ <b>{naive_adj:.2f}</b> is also biased, because L₁ is both a <b>mediator</b> "
        f"(blocking the A→L→Y benefit) and a <b>collider</b>. The g-methods fix it: <b>g-formula</b> ≈ <b>{gform:.2f}</b>, "
        f"<b>IPTW-MSM</b> ≈ <b>{iptw:.2f}</b> — both back on the truth {truth:.2f}.",
    )
    return {
        "naive_unadj": naive_unadj, "naive_adj": naive_adj, "gformula": gform, "iptw": iptw,
        "true_effect": float(truth), "n": int(len(Y)),
        "w_mean": float(np.mean(w)), "w_max": float(np.max(w)),
        "interpretation": interp,
    }


# ---------------------------------------------------------------------------
# ② interactive — feedback-strength knob. As past treatment moves Lₜ more (stronger
# feedback), the naive estimators drift further off while g-methods hold the truth.
# Offline-precomputed grid (via _recompute_grid()).
# ---------------------------------------------------------------------------
_FB_X = [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5]


def _recompute_grid(n=120000):
    import gm_gen
    out = {"fb": _FB_X, "unadj": [], "adj": [], "gformula": [], "iptw": [], "truth": []}
    for fb in out["fb"]:
        df = gm_gen.generate(seed=303, n=n, feedback=fb)
        r = full_gm(df)
        out["unadj"].append(round(r["naive_unadj"], 3))
        out["adj"].append(round(r["naive_adj"], 3))
        out["gformula"].append(round(r["gformula"], 3))
        out["iptw"].append(round(r["iptw"], 3))
        out["truth"].append(round(gm_gen.true_effect(feedback=fb), 3))
    return out


# precomputed via _recompute_grid(): naive estimators drift as feedback grows; g-methods track truth.
_GRID = {
    "fb": [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5],
    "unadj": [1.174, 0.94, 0.71, 0.465, 0.217, -0.058, -0.346],
    "adj": [-2.001, -2.002, -2.002, -2.004, -2.002, -2.0, -2.0],
    "gformula": [-2.008, -2.334, -2.659, -2.986, -3.308, -3.63, -3.956],
    "iptw": [-1.863, -2.171, -2.469, -2.796, -3.169, -3.521, -3.896],
    "truth": [-2.0, -2.325, -2.65, -2.975, -3.3, -3.625, -3.95],
}


def gm_interactive(feedback=1.0, lang="zh"):
    g = _GRID
    x = float(np.clip(feedback, g["fb"][0], g["fb"][-1]))
    unadj = float(np.interp(x, g["fb"], g["unadj"]))
    adj = float(np.interp(x, g["fb"], g["adj"]))
    gform = float(np.interp(x, g["fb"], g["gformula"]))
    iptw = float(np.interp(x, g["fb"], g["iptw"]))
    truth = float(np.interp(x, g["fb"], g["truth"]))
    reading = t(
        lang,
        f"治療↔混淆回饋強度 {x:.2f}：<b>不校正 ≈ {unadj:.2f}</b>（被混淆、方向都可能反）、<b>校正 Lₜ ≈ {adj:.2f}</b>"
        f"（擋掉 A→L→Y 的效果而停在原地），兩者都<b>離真值 {truth:.2f} 越來越遠</b>；而 <b>g-formula ≈ {gform:.2f}</b>、"
        f"<b>IPTW-MSM ≈ {iptw:.2f}</b> 不管回饋多強都<b>跟著真值走</b>。回饋為 0 時沒有中介路徑、g-formula 與真值都在 {truth:.1f}。",
        f"Treatment–confounder feedback strength {x:.2f}: the <b>unadjusted ≈ {unadj:.2f}</b> (confounded, can flip sign) and "
        f"<b>adjusting for Lₜ ≈ {adj:.2f}</b> (frozen, the A→L→Y effect blocked) both drift <b>further from the truth {truth:.2f}</b>; "
        f"while <b>g-formula ≈ {gform:.2f}</b> and <b>IPTW-MSM ≈ {iptw:.2f}</b> <b>track the truth</b> however strong the feedback. "
        f"At feedback 0 there is no mediated path and g-formula sits at the truth {truth:.1f}.",
    )
    return {"feedback": x, "unadj": unadj, "adj": adj, "gformula": gform, "iptw": iptw,
            "truth": truth, "grid": g, "reading": reading}
