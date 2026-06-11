"""Built-in DEMO dataset for the G-methods tabs (time-varying confounding feedback).

Fully fictional teaching scenario — NOT real data:

    情境：一種藥分兩個時點服用（A₀、A₁）。中間有一個<b>時變混淆 Lₜ</b>（疾病活動度／生物標記）：
          ・Lₜ 影響<b>當下是否用藥</b>（病重→用藥）——所以是混淆；
          ・<b>過去用藥又會改變 Lₜ</b>（藥讓 L₁ 下降）——所以 Lₜ 同時是<b>中介</b>；
          ・Lₜ 也直接影響結果 Y。
          這種「治療↔混淆<b>回饋</b>」讓標準迴歸<b>兩頭都錯</b>：不校正 Lₜ→被混淆；校正 Lₜ→擋掉
          A→L→Y 的效果路徑又開啟對撞偏誤。g-methods（g-formula／IPTW-MSM）才能還原真值。

每筆資料：pid、L0（基線嚴重度）、A0（第 1 期用藥 1／否 0）、L1（第 2 期嚴重度，受 A0 影響）、
A1（第 2 期用藥）、Y（結果，連續；越高越糟）。真實效果＝「全程用藥(1,1) vs 全程不用(0,0)」的對比。
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 7
N = 4000
TAU = -1.0          # per-period protective effect of treatment on Y (lower Y = better)
B_L0 = 0.6          # how strongly baseline severity persists into L1
FEEDBACK = 1.0      # how strongly past treatment A0 lowers later severity L1 (the feedback)
A_L = 1.2           # severity → treatment (confounding by indication)
D_L = 1.3           # severity → outcome (the confounding/mediating channel)
COLUMNS = ["pid", "L0", "A0", "L1", "A1", "Y"]

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_gm.csv")


def _sig(x):
    return 1.0 / (1.0 + np.exp(-x))


def true_effect(feedback=FEEDBACK, tau=TAU, d_l=D_L):
    """Closed-form truth: contrast of the static regimes 'always treat (1,1)' vs 'never (0,0)'.
    always: A0=A1=1, L1=B_L0*L0 − feedback ; never: A0=A1=0, L1=B_L0*L0. Taking E[·] (E[L0]=0):
    truth = 2·tau − d_l·feedback."""
    return float(2.0 * tau - d_l * feedback)


def generate(seed=SEED, n=N, feedback=FEEDBACK):
    """Simulate a 2-period treatment with a time-varying confounder L that is itself moved by
    past treatment (treatment–confounder feedback). The naive regressions are biased in BOTH
    directions; g-formula / IPTW-MSM recover the regime contrast true_effect(feedback)."""
    rng = np.random.default_rng(seed)
    L0 = rng.normal(0.0, 1.0, n)
    A0 = (rng.random(n) < _sig(A_L * L0)).astype(float)
    L1 = B_L0 * L0 - feedback * A0 + rng.normal(0.0, 0.6, n)
    A1 = (rng.random(n) < _sig(A_L * L1)).astype(float)
    Y = TAU * (A0 + A1) + D_L * (L0 + L1) + rng.normal(0.0, 1.0, n)
    return pd.DataFrame({
        "pid": np.arange(n), "L0": np.round(L0, 4), "A0": A0,
        "L1": np.round(L1, 4), "A1": A1, "Y": np.round(Y, 4),
    }, columns=COLUMNS)


if __name__ == "__main__":
    df = generate()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    df.to_csv(OUT, index=False)
    A = df.A0.values + df.A1.values
    Y = df.Y.values
    naive = np.polyfit(A, Y, 1)[0] * 2
    print(f"wrote {OUT}  ({len(df)} rows)")
    print(f"truth (always vs never) = {true_effect():.3f}")
    print(f"naive unadjusted        = {naive:.3f}   (confounded)")
