"""Built-in DEMO dataset for the SCCS (self-controlled case series) tabs.

Fully fictional teaching scenario — NOT real data:

    情境：一支疫苗會不會在接種後<b>短暫</b>提高某個<b>急性事件</b>（這裡借用「心肌炎」）的風險？
          SCCS<b>只用發生過事件的人（cases）</b>，讓<b>每個人當自己的對照</b>：把他自己的觀察期切成
          接種後的<b>危險窗</b>（這裡 1–28 天）與其餘的<b>基線期</b>，比較事件落在危險窗 vs 基線期的
          相對速率（incidence rate ratio, IRR）。因為是同一個人前後比，所有<b>不隨時間變的因子</b>
          （基因、體質、城鄉、社經）都自動被消掉。

每位 case：pid、obs_start／obs_end（觀察期天數）、vacc_day（接種日）、event_day（事件日）、age_grp。
真實危險窗 IRR＝TRUE_IRR（這裡 3.0）。識別：把每個 case 的事件位置在「危險窗 vs 基線期」做
條件式比較（個人 frailty 自動相消）→ 條件 Poisson 還原 IRR。
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 31
N_CASES = 3000
OBS = 365            # observation period length (days)
RISK_DAYS = 28       # risk window = days 1..28 after vaccination
TRUE_IRR = 3.0       # true incidence rate ratio (risk window vs baseline)

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_sccs.csv")
COLUMNS = ["pid", "obs_start", "obs_end", "vacc_day", "event_day", "age_grp"]


def _risk_person_time(vacc, start, end, risk=RISK_DAYS):
    lo = max(start, vacc + 1)
    hi = min(end, vacc + risk)
    return max(0.0, hi - lo)


def generate(seed=SEED, n=N_CASES, true_irr=TRUE_IRR):
    """Simulate CASES only. Each case has one event; conditional on having an event,
    its location (risk window vs baseline) follows the SCCS multinomial with rate ratio
    true_irr — so any time-fixed frailty cancels and conditional Poisson recovers it."""
    rng = np.random.default_rng(seed)
    vacc = rng.integers(30, OBS - 60, n)              # vaccination day
    start = np.zeros(n); end = np.full(n, float(OBS))
    ek = np.array([_risk_person_time(vacc[i], start[i], end[i]) for i in range(n)])
    eb = (end - start) - ek
    p_risk = (ek * true_irr) / (eb + ek * true_irr)   # P(event falls in the risk window)
    in_risk = rng.random(n) < p_risk
    event = np.empty(n)
    for i in range(n):
        if in_risk[i]:
            lo, hi = vacc[i] + 1, min(end[i], vacc[i] + RISK_DAYS)
            event[i] = rng.integers(int(lo), int(hi) + 1)
        else:
            # uniform over baseline time (outside the risk window)
            while True:
                d = rng.integers(int(start[i]), int(end[i]))
                if not (vacc[i] + 1 <= d <= vacc[i] + RISK_DAYS):
                    break
            event[i] = d
    age = rng.integers(0, 3, n)                        # 0=<40, 1=40-64, 2=65+
    return pd.DataFrame({"pid": np.arange(n), "obs_start": start.astype(int),
                         "obs_end": end.astype(int), "vacc_day": vacc.astype(int),
                         "event_day": event.astype(int), "age_grp": age}, columns=COLUMNS)


if __name__ == "__main__":
    df = generate()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    df.to_csv(OUT, index=False)
    import sccs_core
    r = sccs_core.full_sccs(df)
    print(f"wrote {OUT} ({len(df)} cases)")
    print("SCCS IRR =", round(r["irr"], 3), "(true", TRUE_IRR, ")  95% CI", [round(x, 2) for x in r["ci"]])
