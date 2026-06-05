"""Built-in DEMO dataset for the case-control (病例對照) tabs.

Fully fictional teaching scenario — NOT real data:

    情境：想知道某個<b>暴露</b>（這裡借用「長期使用某藥物」）和一個<b>罕見結果</b>（這裡借用
          「大腸直腸癌」）的關聯。世代研究要追蹤一大群人很久；病例對照研究<b>反過來做</b>：先找到
          有結果的人（cases）和沒有結果的人（controls），再回頭比較兩組過去的暴露。對<b>罕見結果</b>
          特別有效率。但<b>年齡</b>同時影響「是否暴露」與「是否得病」——是<b>混淆因子</b>：直接比的
          「粗」勝算比會被它推偏；用 logistic <b>校正年齡</b>、或把對照<b>配對</b>到病例的年齡層再用
          條件式分析，都能還原真實勝算比。

每筆資料：pid、case（1＝病例 / 0＝對照）、exposed（是否暴露）、age、sex、comorbidity、
          age_band（年齡層，配對用）。真實（校正後）勝算比 TRUE_OR（這裡 2.0）。
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 23
N_COHORT = 120000       # source cohort; we keep all cases + a matched control sample
TRUE_OR = 2.0           # true causal odds ratio of exposure → outcome (age-adjusted)
A0, A_AGE, A_COM = -0.4, 0.55, 0.5      # exposure model (age drives exposure → confounding)
B0, B_AGE, B_COM = -4.6, 0.7, 0.45      # outcome model (age also drives outcome → confounding)
N_CONTROLS_PER_CASE = 1                  # 1:1 (matched on age band + sex)

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_cc.csv")
COLUMNS = ["pid", "match_id", "case", "exposed", "age", "sex", "comorbidity", "age_band"]


def _sig(x):
    return 1.0 / (1.0 + np.exp(-x))


def _band(age):
    return np.clip(((np.asarray(age) - 45) // 8).astype(int), 0, 4)


def generate(seed=SEED, n_cohort=N_COHORT, true_or=TRUE_OR):
    """Simulate a source cohort where AGE confounds (drives both exposure and outcome),
    then build a case-control sample: every case + an age-band/sex matched control. The
    crude OR is confounded upward; age-adjusted logistic and the matched analysis both
    recover true_or."""
    rng = np.random.default_rng(seed)
    age = rng.integers(45, 85, n_cohort)
    sex = rng.integers(0, 2, n_cohort)
    az = (age - 65) / 10.0
    comorb = (rng.random(n_cohort) < _sig(-0.6 + 0.5 * az)).astype(int)
    exposed = (rng.random(n_cohort) < _sig(A0 + A_AGE * az + A_COM * comorb)).astype(int)
    p_out = _sig(B0 + np.log(true_or) * exposed + B_AGE * az + B_COM * comorb)
    outcome = (rng.random(n_cohort) < p_out).astype(int)

    case_idx = np.where(outcome == 1)[0]
    band = _band(age)
    noncase_idx = np.where(outcome == 0)[0]
    # controls = a RANDOM sample of non-cases (NOT age-matched) → cases are older, so the
    # crude OR is confounded upward; age-adjusted / age-stratified analyses recover truth.
    ctrl_idx = rng.choice(noncase_idx, size=case_idx.size * N_CONTROLS_PER_CASE, replace=False)
    rows = []
    pid = 0
    for ci in case_idx:
        rows.append((pid, -1, 1, int(exposed[ci]), int(age[ci]), int(sex[ci]),
                     int(comorb[ci]), int(band[ci]))); pid += 1
    for cj in ctrl_idx:
        rows.append((pid, -1, 0, int(exposed[cj]), int(age[cj]), int(sex[cj]),
                     int(comorb[cj]), int(band[cj]))); pid += 1
    return pd.DataFrame(rows, columns=COLUMNS)


if __name__ == "__main__":
    df = generate()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    df.to_csv(OUT, index=False)
    ca = df[df.case == 1]; co = df[df.case == 0]
    a = int((ca.exposed == 1).sum()); b = int((ca.exposed == 0).sum())
    c = int((co.exposed == 1).sum()); d = int((co.exposed == 0).sum())
    print(f"wrote {OUT}  ({len(df)} rows, {len(ca)} cases)")
    print("crude OR (ignore confounding) =", round((a * d) / (b * c), 3), " (true", TRUE_OR, ")")
    cm = df.sort_values(["match_id", "case"], ascending=[True, False])
    cav = cm[cm.case == 1].exposed.values; cov = cm[cm.case == 0].exposed.values
    n = min(len(cav), len(cov))
    bb = int(((cav[:n] == 1) & (cov[:n] == 0)).sum()); cc2 = int(((cav[:n] == 0) & (cov[:n] == 1)).sum())
    print("matched OR (b/c)              =", round(bb / cc2, 3), f"(b={bb}, c={cc2})")
