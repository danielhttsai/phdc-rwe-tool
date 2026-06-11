"""Built-in DEMO dataset for the TMLE / doubly-robust tabs.

Fully fictional teaching scenario — NOT real data:

    情境：估「疫苗 A 對結果 Y 的平均因果效應（ATE）」。病重者（共變項 X 大）較容易接種、結果也較差
          （適應症混淆），而且 X 對結果 Y 的影響是<b>非線性</b>的（含 X²）。所以：
          ・直接比較接種 vs 未接種＝<b>粗估</b>，被 X 偏。
          ・只配一個模型（結果迴歸 Q 或傾向分數 PS）若設定錯就偏。
          ・<b>雙重穩健（AIPW）／TMLE</b> 同時用兩個模型，<b>只要其一對就不偏</b>；TMLE 再做一步
            targeting 把效率與邊界顧好。

每筆資料：pid、A（接種 1／否 0）、Y（結果，連續）、X（嚴重度，已測共變項）。真實 ATE = 2.0。
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 53
N = 4000
TRUE_ATE = 2.0
A_X = 1.0          # severity drives treatment (confounding by indication)
B_X = 1.1          # linear effect of X on the outcome
B_X2 = 0.8         # NON-LINEAR (X^2) effect of X on the outcome
COLUMNS = ["pid", "A", "Y", "X"]

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_tmle.csv")


def _sig(x):
    return 1.0 / (1.0 + np.exp(-x))


def generate(seed=SEED, n=N, true_ate=TRUE_ATE, conf=1.0):
    """Severity X confounds treatment and the outcome, and X affects Y NON-LINEARLY (X^2),
    so a single mis-specified model is biased while doubly-robust AIPW / TMLE recover the truth.
    `conf` scales the confounding strength (used by the ② interactive slider)."""
    rng = np.random.default_rng(seed)
    X = rng.normal(0.0, 1.0, n)
    A = (rng.random(n) < _sig(A_X * conf * X)).astype(float)
    Y = true_ate * A + B_X * conf * X + B_X2 * conf * (X ** 2 - 1.0) + rng.normal(0, 1.0, n)
    return pd.DataFrame({
        "pid": np.arange(n), "A": A, "Y": np.round(Y, 4), "X": np.round(X, 4),
    }, columns=COLUMNS)


if __name__ == "__main__":
    df = generate()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    df.to_csv(OUT, index=False)
    A = df.A.values; Y = df.Y.values; X = df.X.values
    crude = Y[A == 1].mean() - Y[A == 0].mean()
    print(f"wrote {OUT}  ({len(df)} rows)")
    print(f"crude diff = {crude:.3f}   (biased; true {TRUE_ATE})")
