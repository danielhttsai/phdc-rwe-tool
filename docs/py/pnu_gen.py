"""Built-in DEMO dataset for the Prevalent New-User (PNU) tabs.

Fully fictional teaching scenario — NOT real data:

    情境：想比較<b>藥 A</b> vs <b>對照藥 B</b> 對某結果的風險。最乾淨的做法是「<b>新使用者</b>設計」——
          只比 A 的新起始者 vs B 的新起始者。但這會<b>丟掉所有盛行（既有）使用者</b>（已經用 A 一段時間的人）
          →樣本變小、代表性變差。可是若<b>天真地</b>把盛行 A 使用者直接和 B 的新起始者一起比，會中
          <b>易感者耗竭（depletion of susceptibles）</b>偏誤：容易出事的人早就出事、退出了，留到現在還在用 A 的
          盛行使用者是「<b>存活下來的低風險族群</b>」，又已經過了起始後的高風險期——直接比會把 A 的風險<b>低估</b>。
          PNU（Suissa 2017）用<b>時間條件配對</b>（依「距起始時間」把盛行使用者對齊、time-conditional PS）把盛行
          使用者<b>納回來</b>，既不偏、又用上了被新使用者設計丟掉的人。

每筆資料：pid、drug（"A" / "B"）、prevalent（A 是否為盛行使用者）、time_since_start（進入世代時的距起始月）、
          frailty（體質脆弱度；易感者耗竭的來源）、age、futime（追蹤人時，年）、event。真值 TRUE_HR（這裡 1.7）。
"""
from __future__ import annotations

import os
import numpy as np
import pandas as pd

SEED = 53
TRUE_HR = 1.7             # true rate ratio of drug A vs comparator B
HORIZON = 2.0            # follow-up horizon from cohort entry (years)
BASE = 0.16              # baseline yearly hazard
B_FR = 0.85             # frailty → hazard (the depletion driver)
COLUMNS = ["pid", "drug", "prevalent", "time_since_start", "frailty", "age", "futime", "event"]

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "demo_pnu.csv")


def _early(t_years):
    """Early-risk multiplier: hazard is elevated just after starting, then settles to 1."""
    return 1.0 + 1.8 * np.exp(-t_years / 0.5)


def generate(seed=SEED, n_each=14000, true_hr=TRUE_HR, depletion=1.0, horizon=HORIZON):
    """Build a cohort at a cross-sectional entry. B = new initiators (time zero). A = a mix of
    NEW initiators (time zero) and PREVALENT users who started up to ~3 years earlier and
    SURVIVED event-free to entry — that survival selection DEPLETES the high-frailty A users
    (depletion of susceptibles), and prevalent users are also past the early-risk window.
    Follow everyone forward for `horizon` years. Fully VECTORIZED (Pyodide-safe — no per-person
    Python loops): monthly piecewise-constant hazards as (n × months) matrices.

    `depletion` scales how strongly frailty drives the pre-entry events (and thus the selection)."""
    rng = np.random.default_rng(seed)
    H = int(round(horizon * 12))                           # follow-up months

    # --- A prevalent POOL: simulate pre-entry survival, keep event-free survivors (depletion) ---
    n_pool = n_each
    f_pool = rng.normal(0, 1, n_pool)
    dur = rng.integers(6, 37, n_pool)                      # months since start at entry
    DMAX = 36
    pm = np.arange(DMAX)
    early_pre = _early(pm / 12.0)                          # (DMAX,)
    lam_pre = (BASE * np.exp(B_FR * depletion * f_pool)[:, None]) * early_pre[None, :] * true_hr
    p_pre = 1.0 - np.exp(-np.clip(lam_pre, 1e-4, None) / 12.0)
    pre_event = (rng.random((n_pool, DMAX)) < p_pre) & (pm[None, :] < dur[:, None])
    survived = ~pre_event.any(axis=1)                      # event-free over their whole pre-entry duration
    f_prev = f_pool[survived]; dur_prev = dur[survived].astype(float)

    # --- assemble the entry cohort (B new, A new, A prevalent) ---
    n_A_new = n_each // 2
    frail = np.concatenate([rng.normal(0, 1, n_each), rng.normal(0, 1, n_A_new), f_prev])
    drug = np.array(["B"] * n_each + ["A"] * n_A_new + ["A"] * f_prev.size)
    prev = np.concatenate([np.zeros(n_each, np.intp), np.zeros(n_A_new, np.intp),
                           np.ones(f_prev.size, np.intp)])
    tss0 = np.concatenate([np.zeros(n_each), np.zeros(n_A_new), dur_prev])     # months since start at entry
    mult = np.where(drug == "A", true_hr, 1.0)
    N = frail.size

    # --- forward follow-up over H months: monthly hazard with early-risk on ABSOLUTE time-since-start ---
    fm = np.arange(H)
    tss_years = (tss0[:, None] + fm[None, :]) / 12.0       # (N, H)
    lam = (BASE * np.exp(B_FR * frail)[:, None]) * _early(tss_years) * mult[:, None]
    p = 1.0 - np.exp(-np.clip(lam, 1e-4, None) / 12.0)
    evt_mat = rng.random((N, H)) < p
    any_evt = evt_mat.any(axis=1)
    first = np.where(any_evt, evt_mat.argmax(axis=1), H).astype(np.intp)        # first event month (or H)
    fut = np.minimum(np.where(any_evt, (first + 1) / 12.0, horizon), horizon)
    event = any_evt.astype(np.intp)
    age = rng.integers(45, 85, N)

    return pd.DataFrame({
        "pid": np.arange(N),
        "drug": drug,
        "prevalent": prev,
        "time_since_start": tss0.astype(np.intp),
        "frailty": np.round(frail, 3),
        "age": age.astype(np.intp),
        "futime": np.round(fut, 4),
        "event": event,
    }, columns=COLUMNS)


if __name__ == "__main__":
    df = generate()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    df.to_csv(OUT, index=False)
    def irr(mask_a, mask_b):
        a, b = df[mask_a], df[mask_b]
        return (a.event.sum() / a.futime.sum()) / (b.event.sum() / b.futime.sum())
    Bnew = df.drug == "B"
    Anew = (df.drug == "A") & (df.prevalent == 0)
    Aall = df.drug == "A"
    print(f"wrote {OUT}  ({len(df)} rows; A_new={int(Anew.sum())}, "
          f"A_prev={int(((df.drug=='A')&(df.prevalent==1)).sum())}, B_new={int(Bnew.sum())})")
    print("new-user-only IRR  (A_new vs B_new) =", round(irr(Anew, Bnew), 3), " (true", TRUE_HR, ")")
    print("naive prevalent IRR (A_all vs B_new) =", round(irr(Aall, Bnew), 3))
    print("mean frailty A_new=%.3f  A_prev=%.3f  B_new=%.3f" % (
        df[Anew].frailty.mean(), df[(df.drug=='A')&(df.prevalent==1)].frailty.mean(), df[Bnew].frailty.mean()))
