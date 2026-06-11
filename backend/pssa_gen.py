"""Built-in DEMO dataset for the Prescription Sequence Symmetry Analysis (PSSA) tabs.

Fully fictional teaching scenario — NOT real data:

    情境（處方瀑布 prescribing cascade）：<b>指標藥 A</b>（index）可能引起某不良反應，醫師為了處理它而開
          <b>標記藥 B</b>（marker）。若真有這條<b>瀑布</b>（A→不良反應→B），那麼在「兩種藥都用過」的人裡，
          「<b>先 A 後 B</b>」應比「先 B 後 A」更常見。PSSA 用<b>順序比（sequence ratio, SR）</b>當訊號：
          <b>cSR</b>＝(先 A 後 B 的人數) ÷ (先 B 後 A 的人數)。
          但 cSR 會被<b>處方趨勢</b>偏掉——若 B 的開立逐年上升，光是趨勢就會讓 B 偏向「比較晚」、製造假訊號。
          用<b>無效果順序比 SRnull</b>（純趨勢下的期望 SR）去除以，得<b>校正順序比 aSR ＝ cSR ÷ SRnull</b>；
          aSR &gt; 1 才是真訊號（Hallas 1996；Tsiropoulos 2009；Hendrix 等 2024）。

每筆資料：pid、t_index（A 起始月）、t_marker（B 起始月）、index_first（先 A 後 B＝1）。
真實「無訊號」基準＝aSR 1.0。cascade 旋鈕控制瀑布強度（0＝無瀑布、cSR 仍因趨勢假性偏高）。
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 3
N = 8000
T = 60.0            # observation window in months
G_INDEX = 0.0       # index-drug prescribing trend (flat)
G_MARKER = 0.045    # marker-drug prescribing trend (rising → creates a spurious crude signal)
CASCADE = 1.0       # default cascade strength
NULL_ASR = 1.0      # aSR = 1 means "no signal"
COLUMNS = ["pid", "t_index", "t_marker", "index_first"]

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_pssa.csv")


def _draw_trend(rng, g, n):
    """Calendar-time of initiation on [0,T] with prescribing rate ∝ exp(g·t) (inverse-CDF)."""
    u = rng.random(n)
    if abs(g) < 1e-9:
        return u * T
    return np.log(1.0 + u * (np.exp(g * T) - 1.0)) / g


def generate(seed=SEED, n=N, cascade=CASCADE):
    """Pairs of people who initiated both the index drug A and the marker drug B. A prescribing
    cascade (strength `cascade`) makes B follow A; a rising marker-drug trend makes the crude SR
    spuriously high even with no cascade. Truth: aSR = 1 when no cascade."""
    rng = np.random.default_rng(seed)
    tA = _draw_trend(rng, G_INDEX, n)
    tB_bg = _draw_trend(rng, G_MARKER, n)
    p_casc = min(0.6, 0.4 * cascade)                    # fraction of pairs driven by the cascade
    is_casc = rng.random(n) < p_casc
    tB = np.where(is_casc, np.minimum(tA + rng.gamma(2.0, 1.5, n), T + 5.0), tB_bg)
    keep = (tA <= T) & (tB <= T) & (tA != tB)
    tA, tB = tA[keep], tB[keep]
    return pd.DataFrame({
        "pid": np.arange(int(keep.sum())),
        "t_index": np.round(tA, 3), "t_marker": np.round(tB, 3),
        "index_first": (tA < tB).astype(int),
    }, columns=COLUMNS)


if __name__ == "__main__":
    df = generate()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    df.to_csv(OUT, index=False)
    a = int(df.index_first.sum()); b = int((1 - df.index_first).sum())
    print(f"wrote {OUT}  ({len(df)} pairs; A-first={a}, B-first={b}, cSR={a/b:.2f})")
