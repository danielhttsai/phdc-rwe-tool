"""Generate the built-in DEMO dataset for the Regression-Discontinuity (RDD) tabs.

Fully fictional teaching scenario — NOT real patient data, NOT a copy of any
source dataset (the BMJ guide uses Framingham SBP≥140; the Nature-Medicine study
uses a Welsh date-of-birth cutoff). Here we invent an independent age-cutoff story
that re-uses the SAME vaccine narrative as the IV tabs so the two methods can be
compared side by side.

    情境：公共衛生單位對「年齡滿 65 歲」者提供免費疫苗計畫（含到府接種與提醒）。
        跑分變數 X = age            （年齡，連續）
        斷點     c = 65            （滿 65 歲才符合資格）
        資格     T = 1[age >= 65]  （Sharp：是否落入計畫，依年齡決定，確定性）
        處置     D = vaccinated    （Fuzzy：實際是否接種；65 歲接種率「跳升」但非 100%）
        結果     Y = health_score_change （一年後健康分數變化）
        存活     (event_time, event)     （到「重大健康事件」的時間，含設限 censoring）
    看不見的干擾因子 U = 健康意識：同時影響是否接種與健康/事件風險。
    關鍵：U 在斷點兩側「連續」（65 歲前後的人 U 分布相近）—— 這正是 RDD 能在
    『不需隨機工具』的情況下處理這個干擾因子的原因（連續性假設）。

校準目標（h≈5、c=65）：
    處置跳躍   tau_D ≈ 0.40   （接種率在 65 歲跳升約 40 個百分點）
    Sharp  RD  tau_Y ≈ 0.72   （= 1.80 × 0.40，跨越資格門檻對健康的跳躍，類似 ITT）
    Fuzzy  RD       ≈ 1.80    （= tau_Y / tau_D，斷點附近 complier 的疫苗效果，= 真值）
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 51
N = 12000
CUTOFF = 65.0
TRUE_LATE = 1.80      # true vaccination effect on health_score_change (matches the IV tabs)
UPTAKE_JUMP = 0.40    # discontinuity in vaccination probability at the cutoff
TAU = 10.0            # horizon (years) for restricted-mean-survival-time outcomes

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_rdd.csv")

COVARIATES = ["female", "bmi", "chronic_conditions", "income_band"]
COLUMNS = ["age", "eligible", "vaccinated", "health_score_change",
           "event_time", "event", *COVARIATES]


def generate(n=N, seed=SEED):
    rng = np.random.default_rng(seed)

    # Running variable: age, spread around the cutoff so both sides are well populated.
    age = np.clip(rng.uniform(50, 80, n), 50, 80).round(2)
    a = (age - CUTOFF) / 10.0  # centred & scaled running variable

    eligible = (age >= CUTOFF).astype(int)

    # Unmeasured confounder (health consciousness): CONTINUOUS across the cutoff.
    U = rng.standard_normal(n)

    # Measured covariates: smooth in age, NO jump at the cutoff (for the balance check).
    female = rng.binomial(1, 0.5, n)
    bmi = np.clip(rng.normal(26 - 0.4 * a, 4, n), 16, 45).round(1)
    chronic_conditions = rng.binomial(3, np.clip(0.18 + 0.05 * a, 0.02, 0.6), n)
    income_band = rng.choice([0, 1, 2, 3], size=n, p=[0.3, 0.3, 0.25, 0.15])

    # Fuzzy first stage: vaccination probability is smooth in age but JUMPS at 65
    # (free programme). U (health consciousness) also raises uptake -> confounding.
    p_vax = 0.18 + 0.05 * a + UPTAKE_JUMP * eligible + 0.10 * U
    p_vax = np.clip(p_vax, 0.02, 0.98)
    vaccinated = rng.binomial(1, p_vax)

    # Continuous outcome. Smooth (mostly linear) age trend that is continuous at 65;
    # the ONLY discontinuity in Y comes through the jump in `vaccinated`.
    health_score_change = (
        2.0
        + TRUE_LATE * vaccinated
        - 0.40 * a
        + 0.10 * a ** 2 * 0.0   # keep purely linear (coeff 0) -> local-linear unbiased
        + 1.50 * U
        + 0.30 * female
        - 0.10 * (bmi - 26)
        - 0.50 * chronic_conditions
        - 0.20 * income_band
        + rng.normal(0, 3.0, n)
    ).round(2)

    # Survival outcome: time to a major adverse health event. Vaccination lowers the
    # hazard; age raises it; U raises it. Continuous in age except through `vaccinated`.
    log_rate = (-2.9 + 0.45 * a - 0.55 * vaccinated + 0.25 * U)
    rate = np.exp(log_rate)
    t_event = rng.exponential(1.0 / rate)
    # Random (administrative + dropout) censoring, independent of the event time.
    t_cens = np.minimum(rng.exponential(14.0, n), 12.0)
    event_time = np.minimum(t_event, t_cens).round(3)
    event = (t_event <= t_cens).astype(int)

    return pd.DataFrame(
        {
            "age": age,
            "eligible": eligible,
            "vaccinated": vaccinated,
            "health_score_change": health_score_change,
            "event_time": event_time,
            "event": event,
            "female": female,
            "bmi": bmi,
            "chronic_conditions": chronic_conditions,
            "income_band": income_band,
        }
    )


if __name__ == "__main__":
    df = generate()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    df.to_csv(OUT, index=False)
    print(f"wrote {OUT}  ({len(df)} rows)")
    print(df.head())
    print("uptake below/above 65:",
          round(df.loc[df.age < 65, "vaccinated"].mean(), 3),
          round(df.loc[df.age >= 65, "vaccinated"].mean(), 3))
    print("event rate:", round(df["event"].mean(), 3),
          " median follow-up:", round(df["event_time"].median(), 2))
