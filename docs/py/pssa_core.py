"""Prescription Sequence Symmetry Analysis (PSSA) core — pure numpy.

白話：在「指標藥 A 與標記藥 B 都用過」的人裡，數「先 A 後 B」與「先 B 後 A」的人數。

  ・<b>粗順序比 cSR</b>＝n(先 A 後 B) ÷ n(先 B 後 A)。會被處方趨勢偏掉（假訊號）。
  ・<b>無效果順序比 SRnull</b>：在「<b>沒有因果關聯</b>」下、純由兩藥的起始時間分布決定的期望 SR——
    用各自的<b>邊際起始時間經驗分布</b>在獨立假設下算出 P(A先) 與 P(B先) 的比。
  ・<b>校正順序比 aSR ＝ cSR ÷ SRnull</b>；aSR 的 95% CI 由不一致對的二項變異（1/a+1/b）來。
    aSR &gt; 1 且 CI 不含 1 ＝ 訊號。

這是訊號偵測（假說生成）：cSR 是被趨勢污染的未校正訊號，aSR 把趨勢除掉、還原真訊號。
Reimplements Hallas (1996), Tsiropoulos et al. (2009) and the Hendrix et al. (2024) guide. Synthetic data only.
"""
from __future__ import annotations

import numpy as np

from i18n import t


def _srnull_empirical(tA, tB):
    """Expected SR under independence, from the marginal initiation-time distributions:
    P(A before B) = mean_i[1 − F_B(tA_i)], P(B before A) = mean_j[1 − F_A(tB_j)]."""
    sA = np.sort(tA); sB = np.sort(tB)
    Fb_at_tA = np.searchsorted(sB, tA, side="right") / max(len(sB), 1)
    Fa_at_tB = np.searchsorted(sA, tB, side="right") / max(len(sA), 1)
    pAB = np.mean(1.0 - Fb_at_tA); pBA = np.mean(1.0 - Fa_at_tB)
    return float(pAB / max(pBA, 1e-9))


def full_pssa(df, lang="zh"):
    tA = np.asarray(df["t_index"], float); tB = np.asarray(df["t_marker"], float)
    a = int(np.sum(tA < tB)); b = int(np.sum(tB < tA))
    a_, b_ = a + 0.5, b + 0.5
    csr = a_ / b_
    srnull = _srnull_empirical(tA, tB)
    asr = csr / srnull
    se = np.sqrt(1.0 / a_ + 1.0 / b_)                       # SE of ln(SR); SRnull treated as fixed
    lo = float(asr * np.exp(-1.96 * se)); hi = float(asr * np.exp(1.96 * se))
    signal = lo > 1.0

    interp = t(
        lang,
        f"在用過兩種藥的人裡，「先 A 後 B」{a} 人、「先 B 後 A」{b} 人 → <b>粗順序比 cSR ≈ {csr:.2f}</b>。"
        f"但 cSR 被<b>處方趨勢</b>撐高（光看 cSR 會以為有強訊號）。除以純趨勢下的<b>SRnull ≈ {srnull:.2f}</b> 後："
        f"<b>校正順序比 aSR ≈ {asr:.2f}</b>（95% CI {lo:.2f}～{hi:.2f}）。"
        + (f"CI 不含 1 → <b>有訊號</b>：可能存在 A→不良反應→B 的處方瀑布。" if signal
           else "CI 含 1 → <b>沒有訊號</b>：cSR 的高值其實只是趨勢造成的假象。"),
        f"Among people who used both drugs, {a} were A-then-B and {b} were B-then-A → a <b>crude SR ≈ {csr:.2f}</b>. "
        f"But the cSR is inflated by the <b>prescribing trend</b> (cSR alone looks like a strong signal). Dividing by the "
        f"trend-only <b>SRnull ≈ {srnull:.2f}</b> gives the <b>adjusted SR ≈ {asr:.2f}</b> (95% CI {lo:.2f}–{hi:.2f}). "
        + ("The CI excludes 1 → <b>a signal</b>: a possible A→adverse-event→B prescribing cascade." if signal
           else "The CI includes 1 → <b>no signal</b>: the high cSR was just the prescribing trend, not causation."),
    )
    return {
        "csr": csr, "srnull": srnull, "asr": asr, "ci": [lo, hi], "signal": bool(signal),
        "a_index_first": a, "b_marker_first": b, "n": int(len(tA)), "null": 1.0,
        "interpretation": interp,
    }


# ---------------------------------------------------------------------------
# ② interactive — cascade-strength knob. The crude SR is held up by the trend
# even at zero cascade; the adjusted SR rises from the null (1.0) only when a
# real cascade is present. Offline-precomputed grid (via _recompute_grid()).
# ---------------------------------------------------------------------------
_CASC_X = [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5]


def _recompute_grid(n=120000):
    import pssa_gen
    out = {"casc": _CASC_X, "csr": [], "srnull": [], "asr": [], "null": 1.0}
    for c in out["casc"]:
        df = pssa_gen.generate(seed=303, n=n, cascade=c)
        r = full_pssa(df)
        out["csr"].append(round(r["csr"], 3))
        out["srnull"].append(round(r["srnull"], 3))
        out["asr"].append(round(r["asr"], 3))
    return out


# precomputed via _recompute_grid(): cSR stays high (trend); aSR climbs from ~1 with real cascade.
_GRID = {
    "casc": [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5],
    "csr": [2.374, 2.743, 3.181, 3.757, 4.523, 5.567, 7.19],
    "srnull": [2.374, 2.221, 2.075, 1.945, 1.825, 1.709, 1.596],
    "asr": [1.0, 1.235, 1.533, 1.932, 2.478, 3.258, 4.506],
    "null": 1.0,
}


def pssa_interactive(cascade=1.0, lang="zh"):
    g = _GRID
    x = float(np.clip(cascade, g["casc"][0], g["casc"][-1]))
    csr = float(np.interp(x, g["casc"], g["csr"]))
    srnull = float(np.interp(x, g["casc"], g["srnull"]))
    asr = float(np.interp(x, g["casc"], g["asr"]))
    reading = t(
        lang,
        f"處方瀑布強度 {x:.2f}：<b>粗順序比 cSR ≈ {csr:.2f}</b> 一直很高（被趨勢撐住，連沒有瀑布時都 &gt; 2）；"
        f"除以 <b>SRnull ≈ {srnull:.2f}</b> 後的 <b>aSR ≈ {asr:.2f}</b> 才反映真實瀑布——強度 0 時 aSR ≈ 1（無訊號），"
        f"越強 aSR 越高。這就是「cSR 假訊號、aSR 才是真訊號」。",
        f"Cascade strength {x:.2f}: the <b>crude SR ≈ {csr:.2f}</b> stays high (propped up by the trend — above 2 even with no "
        f"cascade); only the <b>aSR ≈ {asr:.2f}</b> (after dividing by <b>SRnull ≈ {srnull:.2f}</b>) reflects the real cascade — "
        f"at strength 0 the aSR ≈ 1 (no signal) and it climbs as the cascade strengthens. cSR is the false signal; aSR is the real one.",
    )
    return {"cascade": x, "csr": csr, "srnull": srnull, "asr": asr, "null": g["null"],
            "grid": g, "reading": reading}
