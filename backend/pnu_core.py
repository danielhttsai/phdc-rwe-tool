"""Prevalent New-User (PNU) core — pure numpy.

白話：要比較藥 A vs 對照藥 B。「<b>新使用者</b>設計」只比 A 的新起始者 vs B 的新起始者——乾淨、但
<b>丟掉所有盛行（既有）使用者</b>，樣本小、代表性差。若<b>未校正</b>地把盛行 A 使用者直接和 B 新起始者一起比，
會中<b>易感者耗竭</b>偏誤：留到現在還在用 A 的盛行使用者是「存活下來的低風險族群」、又過了起始後的高風險期
→把 A 的風險低估。PNU（Suissa 2017）用<b>時間條件</b>把盛行使用者<b>納回來</b>：依「距起始時間」對齊、
並用時間條件傾向分數／共變項校正，既不偏、又用上盛行使用者（樣本變大、更精確）。

  new-user-only  = 速率比（A 新 vs B 新，校正體質）            乾淨但樣本小
  naive prevalent = 速率比（A 全部 vs B 新，未校正）           中易感者耗竭偏誤
  PNU            = exp(β_A) from a Poisson rate model on A∪B    時間條件：校正體質＋距起始時間
                   (offset=log person-time; covariates = frailty, time-since-start)  → ≈ 真值，且用上盛行者

NOTE — faithful teaching re-implementation (Suissa, Moodie & Dell'Aniello 2017,
Pharmacoepidemiol Drug Saf 26:459; Webster-Clark et al. applications). Synthetic data only;
not a copy of any package.
"""
from __future__ import annotations

import numpy as np

from i18n import t


def _poisson_fit(X, y, offset, iters=60):
    beta = np.zeros(X.shape[1])
    for _ in range(iters):
        mu = np.exp(np.clip(offset + X @ beta, -30, 30))
        W = mu + 1e-9
        grad = X.T @ (y - mu)
        H = (X * W[:, None]).T @ X + 1e-8 * np.eye(X.shape[1])
        beta = beta + np.linalg.solve(H, grad)
        if np.max(np.abs(grad)) < 1e-8:
            break
    mu = np.exp(np.clip(offset + X @ beta, -30, 30))
    W = mu + 1e-9
    cov = np.linalg.inv((X * W[:, None]).T @ X + 1e-8 * np.eye(X.shape[1]))
    return beta, np.sqrt(np.diag(cov))


def _crude_irr(event, fut, g1, g2):
    e1, t1 = float(event[g1].sum()), float(fut[g1].sum())
    e2, t2 = float(event[g2].sum()), float(fut[g2].sum())
    if t1 <= 0 or t2 <= 0 or e1 <= 0 or e2 <= 0:
        return float("nan"), [float("nan"), float("nan")]
    irr = (e1 / t1) / (e2 / t2)
    se = float(np.sqrt(1.0 / e1 + 1.0 / e2))
    return float(irr), [float(irr * np.exp(-1.96 * se)), float(irr * np.exp(1.96 * se))]


def _adj_irr(isA, event, fut, cov_cols, mask):
    aflag = isA[mask].astype(float)
    X = np.column_stack([np.ones(int(mask.sum())), aflag] + [c[mask] for c in cov_cols])
    beta, se = _poisson_fit(X, event[mask], np.log(np.clip(fut[mask], 1e-6, None)))
    irr = float(np.exp(beta[1]))
    return irr, [float(np.exp(beta[1] - 1.96 * se[1])), float(np.exp(beta[1] + 1.96 * se[1]))]


def full_pnu(df, drug="drug", event="event", futime="futime", prevalent="prevalent",
             tstart="time_since_start", frailty="frailty", true_hr=None, lang="zh"):
    import pnu_gen
    if true_hr is None:
        true_hr = pnu_gen.TRUE_HR
    g = np.asarray(df[drug])
    ev = np.asarray(df[event], dtype=float)
    fu = np.asarray(df[futime], dtype=float)
    prev = np.asarray(df[prevalent], dtype=int) if prevalent in df.columns else np.zeros(len(df), int)
    fr = np.asarray(df[frailty], dtype=float) if frailty in df.columns else np.zeros(len(df))
    tss = (np.asarray(df[tstart], dtype=float) / 12.0) if tstart in df.columns else np.zeros(len(df))
    isA = g == "A"; isB = g == "B"; isAnew = isA & (prev == 0)

    # new-user-only (A new vs B new), frailty-adjusted → unbiased but small
    m_new = isAnew | isB
    nu, ci_nu = _adj_irr(isA, ev, fu, [fr], m_new)
    # naive prevalent: all A vs B new, crude → depletion bias
    naive, ci_naive = _crude_irr(ev, fu, isA, isB)
    # PNU: all A (incl prevalent) vs B new, TIME-CONDITIONAL (frailty + time-since-start)
    m_all = isA | isB
    pnu, ci_pnu = _adj_irr(isA, ev, fu, [fr, tss], m_all)

    bal = {"A_new": float(fr[isAnew].mean()) if isAnew.any() else float("nan"),
           "A_prev": float(fr[isA & (prev == 1)].mean()) if (isA & (prev == 1)).any() else float("nan"),
           "B_new": float(fr[isB].mean()) if isB.any() else float("nan")}
    n_prev = int((isA & (prev == 1)).sum())
    interp = t(
        lang,
        f"只用<b>新使用者</b>（A 新 vs B 新，校正體質）得速率比 ≈ <b>{nu:.2f}</b>（95% CI {ci_nu[0]:.2f}～{ci_nu[1]:.2f}）"
        f"——乾淨、貼近真值 {true_hr:.2f}，但<b>丟掉了 {n_prev} 位盛行使用者</b>。若<b>未校正</b>把盛行 A 使用者也一起比"
        f"（A 全部 vs B 新）≈ {naive:.2f}——被<b>易感者耗竭</b>嚴重低估（盛行 A 使用者體質 {bal['A_prev']:+.2f} 比新使用者 "
        f"{bal['A_new']:+.2f} 低、又過了高風險期）。<b>PNU</b> 用<b>時間條件</b>（校正體質＋距起始時間）把盛行使用者納回來，"
        f"速率比 ≈ <b>{pnu:.2f}</b>（95% CI {ci_pnu[0]:.2f}～{ci_pnu[1]:.2f}）——還原真值、又用上全部 {n_prev} 位盛行使用者。",
        f"Using only <b>new users</b> (A-new vs B-new, frailty-adjusted) gives a rate ratio ≈ <b>{nu:.2f}</b> (95% CI "
        f"{ci_nu[0]:.2f}–{ci_nu[1]:.2f}) — clean and close to the truth {true_hr:.2f}, but it <b>discards {n_prev} prevalent "
        f"users</b>. Naively throwing the prevalent A users in (A-all vs B-new) gives ≈ {naive:.2f} — badly underestimated by "
        f"<b>depletion of susceptibles</b> (prevalent A users' frailty {bal['A_prev']:+.2f} is lower than new users' "
        f"{bal['A_new']:+.2f}, and they are past the early-risk period). <b>PNU</b> brings the prevalent users back with a "
        f"<b>time-conditional</b> adjustment (frailty + time-since-start), giving ≈ <b>{pnu:.2f}</b> (95% CI {ci_pnu[0]:.2f}–"
        f"{ci_pnu[1]:.2f}) — recovering the truth while using all {n_prev} prevalent users.",
    )
    return {
        "newuser_hr": nu, "ci_newuser": ci_nu,
        "naive_hr": naive, "ci_naive": ci_naive,
        "pnu_hr": pnu, "ci_pnu": ci_pnu, "true_hr": float(true_hr),
        "frailty_balance": bal,
        "n_new": int(m_new.sum()), "n_pnu": int(m_all.sum()), "n_prevalent": n_prev,
        "events": {"A": int(ev[isA].sum()), "B": int(ev[isB].sum())},
        "interpretation": interp,
    }


# ---------------------------------------------------------------------------
# ② interactive — depletion-of-susceptibles knob. As depletion grows, the naive
# prevalent contrast biases toward the null; new-user-only and PNU stay on truth.
# Offline-precomputed grid (via _recompute_grid()).
# ---------------------------------------------------------------------------
_DEPL_X = [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5]


def _recompute_grid(n_each=14000):
    import pnu_gen
    out = {"depl": _DEPL_X, "newuser": [], "naive": [], "pnu": [], "true_hr": pnu_gen.TRUE_HR}
    for d in out["depl"]:
        df = pnu_gen.generate(seed=77, n_each=n_each, depletion=d)
        r = full_pnu(df)
        out["newuser"].append(round(r["newuser_hr"], 3))
        out["naive"].append(round(r["naive_hr"], 3))
        out["pnu"].append(round(r["pnu_hr"], 3))
    return out


# precomputed grid via _recompute_grid(): naive prevalent sinks toward the null as
# depletion grows; new-user-only and PNU hold the truth.
_GRID = {
    "depl": [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5],
    "newuser": [1.758, 1.758, 1.758, 1.758, 1.758, 1.758, 1.758],
    "naive": [1.335, 1.265, 1.227, 1.167, 1.127, 1.098, 1.087],
    "pnu": [1.673, 1.693, 1.696, 1.694, 1.701, 1.702, 1.722],
    "true_hr": 1.7,
}


def pnu_interactive(depletion=1.0, lang="zh"):
    g = _GRID
    xd = float(np.clip(depletion, g["depl"][0], g["depl"][-1]))
    nu = float(np.interp(xd, g["depl"], g["newuser"]))
    naive = float(np.interp(xd, g["depl"], g["naive"]))
    pnu = float(np.interp(xd, g["depl"], g["pnu"]))
    reading = t(
        lang,
        f"易感者耗竭強度 {xd:.2f}：未經校正就把盛行使用者直接比 ≈ {naive:.2f}，被耗竭往<b>無效值（1）</b>方向拉得越來越偏；"
        f"<b>純新使用者</b> ≈ {nu:.2f} 與 <b>PNU</b> ≈ {pnu:.2f} 都穩在真值 {g['true_hr']:.1f}。差別是：純新使用者<b>丟掉</b>"
        f"盛行使用者（樣本小），PNU 用時間條件把他們<b>納回來</b>（一樣不偏、但更有效率、更有代表性）。",
        f"Depletion-of-susceptibles strength {xd:.2f}: naively pooling prevalent users ≈ {naive:.2f} is dragged ever further "
        f"toward the <b>null (1)</b> by depletion; the <b>new-user-only</b> ≈ {nu:.2f} and <b>PNU</b> ≈ {pnu:.2f} both hold the "
        f"truth {g['true_hr']:.1f}. The difference: new-user-only <b>discards</b> the prevalent users (small sample), while PNU "
        f"brings them <b>back</b> with a time-conditional adjustment (equally unbiased, but more efficient and representative).",
    )
    return {"depletion": xd, "newuser_hr": nu, "naive_hr": naive, "pnu_hr": pnu,
            "true_hr": g["true_hr"], "grid": g, "reading": reading}
