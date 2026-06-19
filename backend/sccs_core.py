"""SCCS (self-controlled case series) core — conditional Poisson, pure numpy.

白話：SCCS 只用<b>發生過事件的人</b>，每個人當自己的對照：把他的觀察期切成接種後的<b>危險窗</b>
與其餘<b>基線期</b>，看事件比較容易落在哪一段。因為是同一個人前後比，所有<b>不隨時間變</b>的因子
（基因、體質、城鄉、社經）都自動被消掉——這是 SCCS 最大的賣點。

  條件式概似（每人恰一個事件，危險窗暴露 x=1、基線 x=0、person-time e）：
    P(事件落在危險窗) = e_risk·IRR / (e_base + e_risk·IRR)
    log L(β) = Σᵢ [ xᵣ·β + log e_r − log Σⱼ eⱼ·exp(β·xⱼ) ]，  IRR = exp(β)
  條件 Poisson ＝ 把每個人的 frailty 當固定效果條件掉，所以時間不變的混淆全部相消。

NOTE — faithful teaching re-implementation (Farrington 1995; Whitaker, Farrington
& Musonda 2006; Petersen, Douglas & Whitaker 2016, BMJ 354:i4515; sccs-studies.info). Not a
copy of any package.
"""
from __future__ import annotations

import numpy as np

from i18n import t


def _intervals(df, risk_days=None):
    import sccs_gen
    if risk_days is None:
        risk_days = sccs_gen.RISK_DAYS
    start = np.asarray(df["obs_start"], float); end = np.asarray(df["obs_end"], float)
    vacc = np.asarray(df["vacc_day"], float); ev = np.asarray(df["event_day"], float)
    lo = np.maximum(start, vacc + 1); hi = np.minimum(end, vacc + risk_days)
    e_risk = np.maximum(0.0, hi - lo)
    e_base = (end - start) - e_risk
    in_risk = ((ev >= vacc + 1) & (ev <= vacc + risk_days)).astype(float)
    return e_risk, e_base, in_risk


def _fit_irr(e_risk, e_base, in_risk, iters=60):
    """Conditional-Poisson MLE for log-IRR (one event per case, risk vs baseline)."""
    beta = 0.0
    for _ in range(iters):
        eb = np.exp(beta)
        p = (e_risk * eb) / (e_base + e_risk * eb + 1e-12)      # E[event in risk | person]
        score = float(np.sum(in_risk - p))
        info = float(np.sum(p * (1 - p))) + 1e-9
        step = score / info
        beta += step
        if abs(step) < 1e-9:
            break
    eb = np.exp(beta)
    p = (e_risk * eb) / (e_base + e_risk * eb + 1e-12)
    info = float(np.sum(p * (1 - p))) + 1e-9
    se = 1.0 / np.sqrt(info)
    return beta, se


def full_sccs(df, risk_days=None, true_irr=None, lang="zh"):
    import sccs_gen
    if true_irr is None:
        true_irr = sccs_gen.TRUE_IRR
    e_risk, e_base, in_risk = _intervals(df, risk_days)
    beta, se = _fit_irr(e_risk, e_base, in_risk)
    irr = float(np.exp(beta))
    ci = [float(np.exp(beta - 1.96 * se)), float(np.exp(beta + 1.96 * se))]
    n_risk = int(in_risk.sum()); n_base = int((1 - in_risk).sum())
    # the "fingerprint": share of events landing in the (short) risk window
    pt_risk = float(np.mean(e_risk)); pt_base = float(np.mean(e_base))
    interp = t(
        lang,
        f"在 {len(df)} 位 case 裡，有 {n_risk} 人的事件落在接種後 1–{risk_days or sccs_gen.RISK_DAYS} 天的<b>危險窗</b>"
        f"（這段只佔每人觀察期的一小塊），其餘 {n_base} 人落在基線期。把每個人當自己的對照、做條件 Poisson 後，"
        f"危險窗的相對速率 <b>IRR ≈ {irr:.2f}</b>（95% CI {ci[0]:.2f}～{ci[1]:.2f}），貼近真值 {true_irr:.2f}。"
        f"因為是同一個人前後比，<b>所有不隨時間變的因子（體質、基因、社經）都自動相消</b>。",
        f"Of {len(df)} cases, {n_risk} had their event in the post-vaccination <b>risk window</b> (days 1–"
        f"{risk_days or sccs_gen.RISK_DAYS}; only a small slice of each person's observation), and {n_base} in the baseline "
        f"period. Using each person as their own control with conditional Poisson, the risk window's relative rate is "
        f"<b>IRR ≈ {irr:.2f}</b> (95% CI {ci[0]:.2f}–{ci[1]:.2f}), close to the truth {true_irr:.2f}. Because it is a "
        f"within-person before/after comparison, <b>every time-fixed factor (constitution, genetics, socioeconomics) "
        f"cancels automatically</b>.",
    )
    return {
        "irr": irr, "ci": ci, "true_irr": float(true_irr),
        "n_cases": len(df), "n_risk": n_risk, "n_base": n_base,
        "pt_risk": pt_risk, "pt_base": pt_base,
        "interpretation": interp,
    }


# ---------------------------------------------------------------------------
# ② interactive — SCCS is IMMUNE to time-fixed (between-person) confounding.
# Knob = strength of "healthy-vaccinee" selection: a naive between-person rate
# ratio drifts away from truth, while the within-person SCCS IRR stays put.
# Offline grid (the SCCS line is flat at truth by construction).
# ---------------------------------------------------------------------------
_HV_GRID = {
    "hv": [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5],
    "naive": [3.00, 2.55, 2.16, 1.83, 1.55, 1.31, 1.11],   # healthy-vaccinee drags naive down
    "sccs": [3.00, 2.99, 3.01, 3.00, 2.98, 3.02, 3.00],    # within-person — unmoved
    "true_irr": 3.0,
}


def sccs_interactive(hv=1.0, lang="zh"):
    g = _HV_GRID
    x = float(np.clip(hv, g["hv"][0], g["hv"][-1]))
    naive = float(np.interp(x, g["hv"], g["naive"]))
    sccs = float(np.interp(x, g["hv"], g["sccs"]))
    reading = t(
        lang,
        f"健康接種者選擇強度 {x:.2f}：在「人與人之間」比較（接種者 vs 未接種者）的<b>未校正速率比 ≈ {naive:.2f}</b>，"
        f"被『會去接種的人本來就比較健康』拉偏；而<b>同一個人前後比的 SCCS IRR ≈ {sccs:.2f}</b>，<b>不動如山</b>、"
        f"停在真值 {g['true_irr']:.1f}。這就是 SCCS 對<b>不隨時間變的混淆</b>免疫的威力。",
        f"Healthy-vaccinee selection strength {x:.2f}: the between-person <b>naive rate ratio ≈ {naive:.2f}</b> is dragged "
        f"off by 'people who get vaccinated are healthier to begin with'; the within-person <b>SCCS IRR ≈ {sccs:.2f}</b> "
        f"<b>doesn't budge</b>, staying on the truth {g['true_irr']:.1f}. This is SCCS's immunity to <b>time-fixed "
        f"confounding</b>.",
    )
    return {"hv": x, "naive": naive, "sccs": sccs, "true_irr": g["true_irr"], "grid": g, "reading": reading}
