"""Built-in DEMO dataset for the Mediation analysis (MED) tabs.

Fully fictional teaching scenario — NOT real data:

    情境：疫苗 A 降低感染 Y。但這個保護效果，有多少是<b>透過提高抗體效價 M（中介 mediator）</b>
          （間接效果 NIE），有多少是<b>走其他免疫路徑</b>（直接效果 NDE）？
          中介分析把總效果拆成：總效果 TE ＝ 自然直接效果 NDE ＋ 自然間接效果 NIE，
          並回報<b>被中介的比例（proportion mediated）</b>＝ NIE ÷ TE。

    路徑模型（含暴露–中介交互 A×M，沿 VanderWeele）：
        M = m0 + a·A + mX·X + εM            （疫苗 → 抗體效價）
        Y = y0 + d·A + b·M + g·(A·M) + yX·X + εY   （直接 d、中介 b、交互 g）

每筆資料：pid、A（接種 1／否 0）、M（抗體效價，連續中介）、Y（感染風險分數，連續）、X（已測共變項）。
真值（給定上面參數、E[X]=0）：
    NDE = d + g·m0 ;  NIE = (b + g)·a ;  TE = NDE + NIE 。
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 67
N = 6000
# mediator model：疫苗對抗體 a；基線抗體 m0（≠0，使未校正直接效果 ≠ NDE）
M0, M_A, M_X = 0.5, 0.8, 0.3
# outcome model：直接 d、中介 b、暴露×中介交互 g、共變項 yX
Y0, Y_A, Y_M, Y_AM, Y_X = 0.0, -0.4, -0.5, -0.3, 0.4
# treatment：受 X 影響（已測混淆；序列可忽略給定 X 成立）
A0, A_X = 0.0, 0.5

COLUMNS = ["pid", "A", "M", "Y", "X"]

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_med.csv")


def _sig(x):
    return 1.0 / (1.0 + np.exp(-x))


def true_effects(m0=M0, a=M_A, d=Y_A, b=Y_M, g=Y_AM):
    """Closed-form natural effects (continuous M, linear models, A:0→1, E[X]=0).
    NDE = d + g·E[M(0)] = d + g·m0 ; NIE = (b+g)·a ; TE = NDE+NIE."""
    nde = d + g * m0
    nie = (b + g) * a
    return {"NDE": nde, "NIE": nie, "TE": nde + nie}


_T = true_effects()
TRUE_NDE, TRUE_NIE, TRUE_TE = _T["NDE"], _T["NIE"], _T["TE"]


def generate(seed=SEED, n=N, m_a=M_A, y_m=Y_M, y_am=Y_AM, y_a=Y_A):
    """Simulate the vaccine→antibody→infection mediation data. The knobs let the
    interactive vary the mediator pathway strength. Truth recomputed from params."""
    rng = np.random.default_rng(seed)
    X = rng.normal(0.0, 1.0, n)
    A = (rng.random(n) < _sig(A0 + A_X * X)).astype(float)
    M = M0 + m_a * A + M_X * X + rng.normal(0, 1.0, n)
    Y = Y0 + y_a * A + y_m * M + y_am * (A * M) + Y_X * X + rng.normal(0, 1.0, n)
    return pd.DataFrame({
        "pid": np.arange(n), "A": A, "M": np.round(M, 4),
        "Y": np.round(Y, 4), "X": np.round(X, 4),
    }, columns=COLUMNS)


if __name__ == "__main__":
    df = generate()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    df.to_csv(OUT, index=False)
    A = df.A.values; M = df.M.values; Y = df.Y.values; X = df.X.values

    def ols(cols, y):
        Xm = np.column_stack([np.ones(len(y))] + cols)
        return np.linalg.lstsq(Xm, y, rcond=None)[0]
    total = ols([A, X], Y)[1]                      # total effect Y~A+X
    naive_direct = ols([A, M, X], Y)[1]            # "direct" w/o interaction (biased)
    print(f"wrote {OUT}  ({len(df)} rows)")
    print(f"true  NDE={TRUE_NDE:.3f}  NIE={TRUE_NIE:.3f}  TE={TRUE_TE:.3f}  pm={TRUE_NIE/TRUE_TE:.3f}")
    print(f"total effect (Y~A+X)        = {total:.3f}  (≈ TE {TRUE_TE:.3f})")
    print(f"naive direct (Y~A+M+X)      = {naive_direct:.3f}  (≠ NDE {TRUE_NDE:.3f} because of A×M interaction)")
