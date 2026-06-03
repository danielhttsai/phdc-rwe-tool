"""Generate the built-in DEMO time series for the Interrupted Time Series (ITS) tabs.

Fully fictional teaching scenario — NOT real data. We reuse the public-health
flavour of the other tabs: a county tracks a monthly health-burden index; at a
known month an intervention (e.g. a mobile-clinic + reminder programme) switches
on. ITS reads the effect as the LEVEL change (immediate jump) and the SLOPE
change (change in trend) after that interruption.

    時間     time     （期序 0..n-1，等間隔的月）
    介入後   post     （1[time >= t0]）
    介入後經過 t_since（介入後經過幾期，介入前為 0）
    結果     outcome  （該月的健康負擔指數）
    可選     control  （一條不受介入影響的控制序列，⑤ 控制組 ITS 用）

校準（預設）：β0=100、β1=+0.4/月（緩升前趨勢）、β2=-12（介入當下立即下降）、
            β3=-0.6/月（介入後趨勢更往下）。雜訊常態；可加 AR(1) 自相關、季節、
            或與介入同時發生的「時代事件」（給控制組 ITS 示範）。
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 31
N = 48                 # months
T0 = 24                # intervention switches on at month 24
B0, B1 = 100.0, 0.4    # baseline level, pre-trend slope per month
TRUE_LEVEL = -12.0     # immediate level change at the intervention
TRUE_SLOPE = -0.6      # change in slope after the intervention

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_its.csv")

COLUMNS = ["time", "post", "t_since", "outcome"]


def generate(n=N, t0=T0, level=TRUE_LEVEL, slope=TRUE_SLOPE, seed=SEED,
             ar=0.0, season=0.0, noise=2.5, coincident=0.0, with_control=False):
    """Return a tidy ITS time series.

    level / slope : the true intervention effects (β2, β3).
    ar            : AR(1) autocorrelation of the noise (0 = independent).
    season        : amplitude of a 12-period seasonal cycle.
    coincident    : a secular shock that ALSO hits at t0 (for the controlled-ITS demo);
                    it contaminates the treated series and, if with_control, the control too.
    with_control  : also return a 'control' column unaffected by the intervention
                    (but hit by the same coincident shock + seasonality + trend).
    """
    rng = np.random.default_rng(seed)
    time = np.arange(n)
    post = (time >= t0).astype(int)
    t_since = np.clip(time - t0, 0, None) * post

    # AR(1) noise
    eps = rng.normal(0, noise, n)
    if ar:
        for i in range(1, n):
            eps[i] += ar * eps[i - 1]
    seasonal = season * np.sin(2 * np.pi * time / 12.0)
    coincident_shock = coincident * post   # a level shift that is NOT the intervention

    outcome = (B0 + B1 * time + level * post + slope * t_since
               + seasonal + coincident_shock + eps)

    data = {"time": time, "post": post, "t_since": t_since, "outcome": outcome.round(2)}
    if with_control:
        eps_c = rng.normal(0, noise, n)
        if ar:
            for i in range(1, n):
                eps_c[i] += ar * eps_c[i - 1]
        # the control follows the same trend / season / coincident shock but gets
        # NO intervention level or slope change
        control = (90 + B1 * time + seasonal + coincident_shock + eps_c)
        data["control"] = control.round(2)
    return pd.DataFrame(data)


if __name__ == "__main__":
    df = generate()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    df.to_csv(OUT, index=False)
    print(f"wrote {OUT}  ({len(df)} months, intervention at t={T0})")
    print(df.head())
    print("pre mean:", round(df.loc[df.post == 0, "outcome"].mean(), 2),
          " post mean:", round(df.loc[df.post == 1, "outcome"].mean(), 2))
