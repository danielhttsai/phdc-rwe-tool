"""Generate the built-in DEMO dataset for the CCO/CCTC tabs (case-crossover and
case-(case-)time-control).

Fully fictional teaching scenario — NOT real data:

    情境：某種<b>急性事件</b>（例如急診就醫）可能由<b>近期、短暫的暴露</b>（例如一種短效藥）觸發。
          我們用每個 case 自己當對照（case-crossover）：比較「事件前的危險窗 W1」與「更早的參考窗 W0」
          的暴露。麻煩在於：這種暴露的<b>盛行率隨日曆時間上升</b>，於是即使沒有因果關係，近期（W1）也比
          較早（W0）更常暴露 → 純 case-crossover（CCO）會被這個趨勢<b>高估</b>。解法：找一群<b>非 case
          的對照族群</b>，他們同樣經歷時間趨勢、卻沒有因果效應，用他們的趨勢勝算比把 CCO 除掉
          （case-time-control / case-case-time-control，CCTC）。

    每位個體 i：group（1＝case，0＝control）、cal_time（事件/指標的日曆月 s）、
                x_hazard（危險窗 W1 是否暴露）、x_ref（參考窗 W0＝s−Δ 是否暴露）。
    真實因果勝算比 TRUE_OR（這裡 3.0）。

識別恆等式：case 的一致對勝算比 b/c ≈ TRUE_OR × 趨勢OR；control 的一致對勝算比 ≈ 趨勢OR；
相除 → OR_CCTC ≈ TRUE_OR。趨勢=0 時 CCO 本身就無偏。
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 41
S = 24            # calendar months spanned
DELTA = 4         # reference window is DELTA months before the hazard window
THETA0 = np.log(0.10 / 0.90)   # baseline exposure log-odds (~10% prevalence)
TREND = 4.0       # how steeply exposure log-odds rise across the window
BASELINE = 0.04   # baseline per-subject event probability (rare, acute)
TRUE_OR = 3.0     # the true causal odds ratio (hazard-window exposure → event)
N_CASES = 4000    # target cases
N_CONTROLS = 4000 # controls (non-cases) sampled at matched calendar times

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_cctc.csv")
COLUMNS = ["pid", "group", "cal_time", "x_hazard", "x_ref"]


def _sig(x):
    return 1.0 / (1.0 + np.exp(-x))


def _theta(s, trend):
    return THETA0 + TREND * float(trend) * (s / float(S))


def generate(seed=SEED, trend=1.0, true_or=TRUE_OR, n_cases=N_CASES, n_controls=N_CONTROLS):
    """Simulate a large source pool, then keep all cases and a sample of controls.
    `trend` scales the calendar-time rise in exposure prevalence (0 → no trend → CCO
    is already unbiased; larger → CCO biased upward, CCTC still recovers true_or)."""
    rng = np.random.default_rng(seed)

    # --- CASES: simulate a source pool, keep those who have the (acute) event.
    # Event ∝ baseline × OR^(hazard-window exposure), so the within-case discordant
    # odds ratio ≈ TRUE_OR × (calendar-trend OR).
    pool = max(40 * n_cases, 80000)
    s = rng.integers(DELTA, S, pool)
    x1 = (rng.random(pool) < _sig(_theta(s, trend))).astype(int)
    x0 = (rng.random(pool) < _sig(_theta(s - DELTA, trend))).astype(int)
    event = rng.random(pool) < np.clip(BASELINE * (true_or ** x1), 0.0, 0.95)
    ci = np.where(event)[0]; rng.shuffle(ci); ci = ci[:n_cases]

    # --- CONTROLS: an INDEPENDENT sample (NOT selected on the event), so their
    # discordant odds ratio reflects ONLY the calendar-time exposure trend.
    sc = rng.integers(DELTA, S, n_controls)
    xc1 = (rng.random(n_controls) < _sig(_theta(sc, trend))).astype(int)
    xc0 = (rng.random(n_controls) < _sig(_theta(sc - DELTA, trend))).astype(int)

    pid = np.arange(ci.size + n_controls)
    group = np.concatenate([np.ones(ci.size, int), np.zeros(n_controls, int)])
    cal = np.concatenate([s[ci], sc])
    xh = np.concatenate([x1[ci], xc1]); xr = np.concatenate([x0[ci], xc0])
    return pd.DataFrame({"pid": pid, "group": group, "cal_time": cal,
                         "x_hazard": xh, "x_ref": xr}, columns=COLUMNS)


if __name__ == "__main__":
    df = generate()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    df.to_csv(OUT, index=False)
    ca = df[df.group == 1]; co = df[df.group == 0]
    bca = int(((ca.x_hazard == 1) & (ca.x_ref == 0)).sum()); cca = int(((ca.x_hazard == 0) & (ca.x_ref == 1)).sum())
    bco = int(((co.x_hazard == 1) & (co.x_ref == 0)).sum()); cco = int(((co.x_hazard == 0) & (co.x_ref == 1)).sum())
    print(f"wrote {OUT}  ({len(df)} rows: {ca.shape[0]} cases, {co.shape[0]} controls)")
    print("OR_CCO  =", round(bca / cca, 3), " (discordant case pairs %d/%d)" % (bca, cca))
    print("OR_trend=", round(bco / cco, 3), " (discordant control pairs %d/%d)" % (bco, cco))
    print("OR_CCTC =", round((bca / cca) / (bco / cco), 3), " (true OR =", TRUE_OR, ")")
