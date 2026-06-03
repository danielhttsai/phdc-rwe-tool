"""Generate the built-in DEMO panel for the Difference-in-differences (DiD) tabs.

Fully fictional teaching scenario — NOT real data, NOT a copy of any source
dataset. We reuse the SAME vaccine narrative as the IV / RDD tabs so the four
methods can be compared side by side, but cast as a policy switched ON for some
communities at a fixed calendar time:

    情境：某縣市衛生局在第 3 期（t0=3）對「介入組」社區推出『疫苗快打車＋到府提醒』政策；
          對照組社區沒有。每一期（季）量一次該社區的平均健康分數。
        單位     unit    （社區/診區，固定追蹤的面板單位）
        期別     period  （0,1,2,3,4,5；t0=3 之後為「後期 post」）
        分組     treated （1＝介入組社區，0＝對照組社區；不隨時間改變）
        後期     post    （1[period >= t0]）
        結果     Y = health_score （該社區當期平均健康分數）
        共變項   urban（是否都會區）、baseline_burden（基期疾病負擔，社區層級）
    看不見的干擾因子：社區固定差異（unit fixed effect）＋共同的時代趨勢（time trend）。
    DiD 的精神：兩者都會被「差異中的差異」消掉，留下政策本身的效果。

校準目標：
    真實 ATT = +3.0 分（政策讓介入組社區在 t0 之後每期平均健康分數提高約 3 分）
    平行趨勢「成立」版（預設）：介入/對照在 t0 之前的趨勢相同 → DiD ≈ 3.0、前期 event-study ≈ 0。
    平行趨勢「違反」版（violate=True，教學用）：介入組在前期就有額外上升斜率 → 前期係數顯著、DiD 有偏。
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 73
N_UNITS = 40          # 20 treated + 20 control communities
N_PERIODS = 6         # periods 0..5
T0 = 3                # policy switches on at period 3 (periods 0,1,2 = pre; 3,4,5 = post)
TRUE_ATT = 3.0        # true policy effect on the community health score, post-t0

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_did.csv")

COVARIATES = ["urban", "baseline_burden"]
COLUMNS = ["unit", "period", "treated", "post", "health_score", *COVARIATES]


def generate(n_units=N_UNITS, n_periods=N_PERIODS, t0=T0, seed=SEED, violation=0.0):
    """Return a long (unit × period) panel DataFrame.

    violation=0.0 (default): parallel trends hold → DiD recovers TRUE_ATT.
    violation>0: treated units carry an extra pre-existing upward slope of size
                 `violation` per period, so the parallel-trends assumption fails
                 (used by the ② interactive slider and the ④ assumption check).
    """
    rng = np.random.default_rng(seed)
    n_treat = n_units // 2

    treated_by_unit = np.array([1] * n_treat + [0] * (n_units - n_treat))
    # Time-invariant community fixed effect (some communities are just healthier).
    unit_fe = rng.normal(0.0, 4.0, n_units)
    # Community-level covariates (smooth, not affected by the policy).
    urban_by_unit = rng.binomial(1, 0.5, n_units)
    baseline_burden = np.clip(rng.normal(50 - 3.0 * urban_by_unit, 8, n_units), 20, 80).round(1)

    rows = []
    for u in range(n_units):
        treated = int(treated_by_unit[u])
        for p in range(n_periods):
            post = int(p >= t0)
            # Common time trend shared by BOTH groups (the thing DiD differences out).
            common_trend = 2.0 * p
            # Optional parallel-trends violation: treated drift even before the policy.
            bad = float(violation) * p * treated
            att = TRUE_ATT * treated * post
            y = (
                60.0
                + unit_fe[u]
                + common_trend
                + att
                + bad
                - 0.05 * (baseline_burden[u] - 50)
                + 0.8 * urban_by_unit[u]
                + rng.normal(0, 1.2)
            )
            rows.append({
                "unit": u,
                "period": p,
                "treated": treated,
                "post": post,
                "health_score": round(float(y), 2),
                "urban": int(urban_by_unit[u]),
                "baseline_burden": float(baseline_burden[u]),
            })
    return pd.DataFrame(rows, columns=COLUMNS)


if __name__ == "__main__":
    df = generate()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    df.to_csv(OUT, index=False)
    print(f"wrote {OUT}  ({len(df)} rows, {df.unit.nunique()} units × {df.period.nunique()} periods)")
    g = df.groupby(["treated", "post"])["health_score"].mean()
    did = (g.loc[(1, 1)] - g.loc[(1, 0)]) - (g.loc[(0, 1)] - g.loc[(0, 0)])
    print(g)
    print("2x2 DiD =", round(float(did), 3), " (true ATT =", TRUE_ATT, ")")
