"""Generate one downloadable sample CSV per method → frontend/data/<key>_sample.csv.

These are the files the ③「分析資料 / Analyse data」code blocks read, so that anyone
can download a method's CSV and run the SAS / R / Stata code on it verbatim. The
build (build_docs.py) copies frontend/data/ → docs/data/.

For the methods that already ship a real synthetic generator (backend/*_gen.py) we
reuse it, so the sample CSV matches the ② interactive demo's column names exactly.
For the methods that lacked any data we define a small seeded generator here, with a
documented schema. Every CSV is capped to keep it light.

Run:  python tools/make_samples.py
"""
from __future__ import annotations

import os
import sys

import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)

OUT = os.path.join(ROOT, "frontend", "data")
CAP = 500  # rows per sample CSV (plenty to fit a model, small to download)


# --- methods backed by an existing real generator -------------------------
# key -> (module name under backend/, kwargs for generate())
GEN = {
    "iv": ("gen_data", {}),
    "rdd": ("rdd_gen", {}),
    "did": ("did_gen", {}),
    "tit": ("tit_gen", {}),
    "its": ("its_gen", {}),
    "perr": ("perr_gen", {}),
    "ccw": ("ccw_gen", {"scenario": "grace"}),
    "cctc": ("cctc_gen", {}),
    "seq": ("seq_gen", {}),
    "cc": ("cc_gen", {}),
    "sccs": ("sccs_gen", {}),
    "acnu": ("acnu_gen", {}),
    "pnu": ("pnu_gen", {}),
    "nc": ("nc_gen", {}),
    "med": ("med_gen", {}),
    "ps": ("ps_gen", {}),
    "tmle": ("tmle_gen", {}),
    "gm": ("gm_gen", {}),
    "tnd": ("tnd_gen", {}),
    "pssa": ("pssa_gen", {}),
    "tscan": ("tscan_gen", {}),
    "wce": ("wce_gen", {}),
    # NOTE: srma, miss, extctrl, transport, wce reuse the *concepts* of their
    # backend generators but ship a clean row-per-observation CSV (defined below
    # in NEW) so the published code reads real columns and runs end-to-end.
}


def _from_generator(key):
    mod_name, kw = GEN[key]
    mod = __import__(f"backend.{mod_name}", fromlist=["generate"])
    df = mod.generate(**kw)
    if not isinstance(df, pd.DataFrame):
        df = pd.DataFrame(df)
    return df


# --- methods that had no data: small documented generators ----------------
def _mr(rng):
    # Two-sample MR summary statistics, one row per genetic instrument (SNP).
    k = 30
    beta_exp = rng.uniform(0.03, 0.20, k)               # SNP -> exposure
    se_exp = rng.uniform(0.004, 0.012, k)
    true_causal = 0.35                                  # exposure -> outcome (log-OR per unit)
    beta_out = true_causal * beta_exp + rng.normal(0, 0.01, k)
    se_out = rng.uniform(0.01, 0.03, k)
    return pd.DataFrame({
        "snp": [f"rs{1000+i}" for i in range(k)],
        "beta_exp": beta_exp.round(4), "se_exp": se_exp.round(4),
        "beta_out": beta_out.round(4), "se_out": se_out.round(4),
        "eaf": rng.uniform(0.1, 0.5, k).round(3),
    })


def _gbtm(rng):
    # Longitudinal trajectories: 3 latent groups, repeated measures per person.
    n, T = 220, 6
    grp = rng.choice([0, 1, 2], n, p=[0.5, 0.3, 0.2])
    rows = []
    for pid in range(1, n + 1):
        g = grp[pid - 1]
        base, slope = [(2.0, 0.1), (5.0, -0.6), (8.0, 0.05)][g]
        for t in range(T):
            y = base + slope * t + rng.normal(0, 0.6)
            rows.append((pid, t, round(float(y), 3)))
    return pd.DataFrame(rows, columns=["pid", "time", "y"])


def _causalml(rng):
    # Heterogeneous-effect data for causal forests / DoubleML.
    n = 500
    X = rng.normal(0, 1, (n, 5))
    ps = 1 / (1 + np.exp(-(0.5 * X[:, 0] - 0.4 * X[:, 1])))
    A = rng.binomial(1, ps)
    tau = 1.0 + 1.5 * (X[:, 0] > 0)                     # effect depends on x1
    Y = 2 + X[:, 1] - 0.5 * X[:, 2] + tau * A + rng.normal(0, 1, n)
    df = pd.DataFrame(X, columns=[f"x{i+1}" for i in range(5)]).round(3)
    df.insert(0, "Y", Y.round(3))
    df.insert(0, "A", A)
    df.insert(0, "pid", np.arange(1, n + 1))
    return df


def _evalue(rng):
    # Summary estimates (risk-ratio scale) to feed an E-value calculation.
    return pd.DataFrame({
        "outcome": ["mortality", "hospitalisation", "MI", "stroke", "AKI"],
        "rr": [0.78, 0.85, 0.91, 1.20, 1.45],
        "lo": [0.69, 0.74, 0.80, 1.05, 1.10],
        "hi": [0.88, 0.98, 1.04, 1.37, 1.91],
    })


def _dt(rng):
    # Digital-twin / external-control style: concurrent trial arm + historical controls.
    n_tr, n_hist = 200, 300
    def block(n, source, arm):
        x1 = rng.normal(0, 1, n); x2 = rng.normal(60, 10, n); x3 = rng.binomial(1, 0.4, n)
        eff = 0.8 if arm == 1 else 0.0
        y = 3 + 0.5 * x1 - 0.03 * (x2 - 60) + 0.4 * x3 + eff + rng.normal(0, 1, n)
        return pd.DataFrame({"source": source, "arm": arm,
                             "x1": x1.round(3), "x2": x2.round(1), "x3": x3,
                             "y": y.round(3)})
    df = pd.concat([block(n_tr, "trial", 1), block(n_hist, "historical", 0)], ignore_index=True)
    df.insert(0, "pid", np.arange(1, len(df) + 1))
    return df


def _mcda(rng):
    # Multi-criteria scores per alternative (higher = better), 0–100 scale.
    alts = ["drugA", "drugB", "drugC", "drugD", "drugE"]
    return pd.DataFrame({
        "alternative": alts,
        "efficacy": rng.integers(55, 95, len(alts)),
        "safety": rng.integers(50, 90, len(alts)),
        "convenience": rng.integers(40, 95, len(alts)),
        "cost": rng.integers(30, 90, len(alts)),
    })


def _fsqca(rng):
    # Calibrated set-membership scores (0–1) for fsQCA.
    n = 40
    A = rng.uniform(0, 1, n); B = rng.uniform(0, 1, n); C = rng.uniform(0, 1, n)
    # outcome high when (A AND B) OR C is high
    y = np.maximum(np.minimum(A, B), C) + rng.normal(0, 0.05, n)
    y = np.clip(y, 0, 1)
    return pd.DataFrame({"case": [f"c{i+1}" for i in range(n)],
                         "A": A.round(3), "B": B.round(3), "C": C.round(3),
                         "Y": y.round(3)})


def _babe(rng):
    # 2x2 crossover bioequivalence: each subject gets Test & Reference.
    n = 24
    rows = []
    seqs = rng.permutation(["TR"] * (n // 2) + ["RT"] * (n // 2))
    for i in range(n):
        sid = i + 1; seq = seqs[i]
        subj = rng.normal(0, 0.15)                      # subject random effect (log scale)
        for period in (1, 2):
            trt = seq[period - 1]                       # 'T' or 'R'
            mu = np.log(100) + (0.05 if trt == "T" else 0.0)  # ~5% higher, within BE
            logauc = mu + subj + rng.normal(0, 0.10)
            logcmax = mu - 0.1 + subj + rng.normal(0, 0.12)
            rows.append((sid, seq, period, "Test" if trt == "T" else "Reference",
                         round(float(np.exp(logauc)), 2), round(float(np.exp(logcmax)), 2)))
    return pd.DataFrame(rows, columns=["subject", "sequence", "period", "treatment", "auc", "cmax"])


def _wetlab(rng):
    # Dose-response across batches (e.g. cell-viability assay).
    doses = [0, 1, 3, 10, 30, 100]
    rows = []
    well = 0
    for batch in (1, 2, 3):
        b = rng.normal(0, 3)                            # batch effect
        for d in doses:
            for _ in range(4):                          # replicates
                well += 1
                resp = 100 / (1 + (d / 12.0)) + b + rng.normal(0, 4)
                rows.append((well, d, round(float(resp), 2), batch))
    return pd.DataFrame(rows, columns=["well", "dose", "response", "batch"])


def _nma(rng):
    # Arm-level data for a network meta-analysis (events out of n per arm/study).
    studies = [("S1", "placebo", "drugA"), ("S2", "placebo", "drugB"),
               ("S3", "drugA", "drugB"), ("S4", "placebo", "drugC"),
               ("S5", "drugB", "drugC"), ("S6", "drugA", "drugC")]
    base = {"placebo": 0.30, "drugA": 0.22, "drugB": 0.20, "drugC": 0.18}
    rows = []
    for s, t1, t2 in studies:
        n = int(rng.integers(120, 260))
        for t in (t1, t2):
            p = min(max(base[t] + rng.normal(0, 0.02), 0.02), 0.95)
            rows.append((s, t, int(rng.binomial(n, p)), n))
    return pd.DataFrame(rows, columns=["study", "treatment", "events", "n"])


def _srma(rng):
    # Per-study effect sizes (log risk-ratio) + standard errors for a meta-analysis.
    k = 12
    mu, tau = np.log(0.80), 0.12                        # pooled effect + heterogeneity
    theta = rng.normal(mu, tau, k)
    sei = rng.uniform(0.06, 0.25, k)
    yi = theta + rng.normal(0, sei)
    return pd.DataFrame({"study": [f"Study {i+1}" for i in range(k)],
                         "yi": yi.round(4), "sei": sei.round(4)})


def _miss(rng):
    # Confounding-adjustment data with MAR missingness in the outcome and one covariate.
    n = 500
    x1 = rng.normal(0, 1, n); x2 = rng.normal(0, 1, n); x3 = rng.binomial(1, 0.4, n)
    A = rng.binomial(1, 1 / (1 + np.exp(-(0.4 * x1 - 0.3 * x2))))
    Y = 1.0 + 0.8 * A + 0.5 * x1 - 0.4 * x2 + 0.3 * x3 + rng.normal(0, 1, n)
    df = pd.DataFrame({"pid": np.arange(1, n + 1), "A": A,
                       "x1": x1.round(3), "x2": x2.round(3), "x3": x3,
                       "Y": Y.round(3)})
    # MAR: Y missing more often when x1 high; x2 occasionally missing.
    miss_y = rng.uniform(0, 1, n) < (0.10 + 0.15 * (x1 > 0.5))
    df.loc[miss_y, "Y"] = np.nan
    df.loc[rng.uniform(0, 1, n) < 0.08, "x2"] = np.nan
    return df


def _extctrl(rng):
    # Hybrid control: a small concurrent trial (treated + control) + external controls.
    def block(n, treated, external):
        x = rng.normal(0, 1, n)
        y = 2 + 0.6 * x + (0.7 if treated else 0.0) + (0.2 if external else 0.0) + rng.normal(0, 1, n)
        return pd.DataFrame({"treated": treated, "external": int(external),
                             "x": x.round(3), "y": y.round(3)})
    df = pd.concat([block(60, 1, 0), block(40, 0, 0), block(200, 0, 1)], ignore_index=True)
    df.insert(0, "pid", np.arange(1, len(df) + 1))
    return df


def _transport(rng):
    # Trial (S=1, randomised, outcome observed) + target population (S=0, covariates only).
    def block(n, trial):
        x1 = rng.normal(0 if trial else 0.6, 1, n)      # target shifted on x1
        x2 = rng.binomial(1, 0.5 if trial else 0.7, n)
        A = rng.binomial(1, 0.5, n) if trial else np.nan
        if trial:
            tau = 1.0 + 0.8 * x1                         # effect modified by x1
            Y = 2 + 0.5 * x1 + 0.4 * x2 + tau * A + rng.normal(0, 1, n)
            Y = Y.round(3)
        else:
            Y = np.nan
        return pd.DataFrame({"S": int(trial), "x1": x1.round(3), "x2": x2,
                             "A": A, "Y": Y})
    df = pd.concat([block(250, True), block(250, False)], ignore_index=True)
    df.insert(0, "pid", np.arange(1, len(df) + 1))
    return df


def _wce(rng):
    # Counting-process long form for a weighted-cumulative-exposure / time-dependent Cox.
    n = 120
    rows = []
    for pid in range(1, n + 1):
        end = int(rng.integers(8, 24))                  # follow-up months
        base_dose = rng.uniform(0, 2)
        haz = 0.0; event_time = None
        for t in range(end):
            dose = max(0.0, base_dose + rng.normal(0, 0.3))
            haz += 0.02 * dose                          # exposure raises hazard
            if event_time is None and rng.uniform() < haz:
                event_time = t
        for t in range(end):
            dose = round(float(max(0.0, base_dose + rng.normal(0, 0.3))), 3)
            ev = 1 if (event_time is not None and t == event_time) else 0
            rows.append((pid, t, t + 1, ev, dose))
            if ev:
                break
    return pd.DataFrame(rows, columns=["id", "start", "stop", "event", "dose"])


NEW = {
    "mr": _mr, "gbtm": _gbtm, "causalml": _causalml, "evalue": _evalue,
    "dt": _dt, "mcda": _mcda, "fsqca": _fsqca, "babe": _babe,
    "wetlab": _wetlab, "nma": _nma,
    "srma": _srma, "miss": _miss, "extctrl": _extctrl,
    "transport": _transport, "wce": _wce,
}


def main():
    os.makedirs(OUT, exist_ok=True)
    rng = np.random.default_rng(20240623)
    keys = sorted(set(GEN) | set(NEW))
    for key in keys:
        try:
            df = NEW[key](rng) if key in NEW else _from_generator(key)
        except Exception as e:  # noqa: BLE001
            print(f"  !! {key}: {type(e).__name__}: {e}")
            continue
        df = df.head(CAP)
        path = os.path.join(OUT, f"{key}_sample.csv")
        df.to_csv(path, index=False, lineterminator="\n")
        print(f"  {key:10s} {df.shape[0]:4d}x{df.shape[1]:<2d}  {list(df.columns)}")


if __name__ == "__main__":
    main()
