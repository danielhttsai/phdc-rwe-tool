"""Generate the built-in DEMO dataset — a fully fictional teaching example.

This is NOT the original ivdata.rds and NOT the sugar-tax example from the
paper. It is an independent, synthetic scenario invented for this tool:

    情境:衛生單位在「隨機抽中的社區」主動寄出免費接種提醒並安排到府接種。
        工具 Z = vaccine_reminder  (住在被隨機抽中、收到接種提醒的社區，近乎隨機)
        處置 A = vaccinated        (是否接種疫苗)
        結果 Y = health_score_change (一年後健康分數的變化)
    看不見的干擾因子 U = 個人健康意識 (同時影響是否接種與健康分數)

Numbers are deliberately different from the sugar-tax teaching figures so the
data cannot be mistaken for a copy of the source example.
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 34
N = 60000
TRUE_LATE = 1.80  # true effect in compliers (different from the 2.40 example)

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_vaccine.csv")

# Different covariate set / names / types from ivdata.rds (age, sex, race, smokeyrs, exercise).
COVARIATES = ["age", "female", "bmi", "chronic_conditions", "income_band"]
COLUMNS = ["health_score_change", "vaccinated", "vaccine_reminder", *COVARIATES]


def generate(n=N, seed=SEED):
    rng = np.random.default_rng(seed)

    # Instrument: lives in a randomly chosen community that received a free vaccination reminder.
    vaccine_reminder = rng.binomial(1, 0.5, n)

    # Unmeasured confounder: baseline health consciousness.
    U = rng.standard_normal(n)

    # Measured baseline covariates (independent of the instrument -> balanced).
    age = np.clip(rng.normal(50, 15, n), 18, 90).round(1)
    female = rng.binomial(1, 0.5, n)
    bmi = np.clip(rng.normal(25, 4, n), 16, 45).round(1)
    chronic_conditions = rng.choice([0, 1, 2, 3], size=n, p=[0.45, 0.30, 0.18, 0.07])
    income_band = rng.choice([0, 1, 2, 3], size=n, p=[0.3, 0.3, 0.25, 0.15])

    # First stage: the reminder nudges ~9% of people into getting vaccinated.
    p_vax = 0.30 + 0.090 * vaccine_reminder + 0.12 * U
    p_vax = np.clip(p_vax, 0.02, 0.98)
    vaccinated = rng.binomial(1, p_vax)

    # Structural outcome. True LATE = 1.80; U creates upward bias in the naive estimate.
    health_score_change = (
        2.0
        + TRUE_LATE * vaccinated
        + 1.50 * U
        - 0.04 * (age - 50)
        + 0.30 * female
        - 0.10 * (bmi - 25)
        - 0.50 * chronic_conditions
        - 0.20 * income_band
        + rng.normal(0, 3.0, n)
    ).round(2)

    return pd.DataFrame(
        {
            "health_score_change": health_score_change,
            "vaccinated": vaccinated,
            "vaccine_reminder": vaccine_reminder,
            "age": age,
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

    import iv_core

    naive = iv_core.naive_regression(df, "health_score_change", "vaccinated", COVARIATES)
    fs = iv_core.first_stage(df, "vaccinated", "vaccine_reminder")
    wald = iv_core.wald_estimator(df, "health_score_change", "vaccinated", "vaccine_reminder")
    iv = iv_core.iv_2sls(df, "health_score_change", "vaccinated", "vaccine_reminder")
    print(f"naive treatment coef : {naive['estimate']:.3f}   (target ~2.60)")
    print(f"first-stage coef     : {fs['coef']:.4f}  F={fs['f_stat']:.1f}  (target ~0.090)")
    print(f"Wald estimate        : {wald['estimate']:.3f}   (target ~1.80)")
    print(f"2SLS estimate        : {iv['estimate']:.3f}   (target ~1.80)")
