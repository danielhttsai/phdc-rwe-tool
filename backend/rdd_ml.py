"""Machine-learning + RDD demonstrations (RDD tab ⑤), vaccine / age-65 story.

Two honest things modern ML does for a regression-discontinuity (RDD) analysis,
grounded in the two papers the user added to the RDD folder. Pure numpy/scipy so
it runs in Pyodide; 藥方二 reuses the faithful IPCW / doubly-robust machinery in
`rdd_survival`.

  藥方一  雙重機器學習 (DML) 讓 RDD「不挑視窗」.
          Under LOCAL RANDOMIZATION, units inside a window around the cutoff are
          as-if randomized GIVEN the running variable and covariates. A plain
          within-window comparison ("difference in means") gets more and more
          biased as the window WIDENS — the two halves stop being comparable. A
          cross-fitted doubly-robust (AIPW) estimator that adjusts for those
          controls stays accurate at any width. That bandwidth/window robustness
          is the whole point.                       (Wang — DML vs sharp RDD.)

  藥方二  彈性 ML ＋ 雙重穩健 處理「帶設限的存活結果」.
          Pairing the doubly-robust censoring correction with a flexible outcome
          learner is consistent if EITHER the censoring model or the outcome model
          is right, and is MORE EFFICIENT and MORE STABLE than a single parametric
          working model — visible as a tighter, steadier estimate across different
          outcome-model choices.   (Schuessler, Sverdrup, Tibshirani, Wager —
          nonparametric regression discontinuity with survival outcomes.)

  安全帶  交叉擬合 (cross-fitting): baked into 藥方一 — every nuisance is predicted
          OUT-OF-FOLD so the estimator can never peek at the rows it is used on.

Vaccine scenario (same as the IV tabs): running variable = age, cutoff = 65,
T = 1[age >= 65] (free-programme eligibility), D = vaccinated, Y = health-score
change, U = unobserved health consciousness (the confounder). True complier
effect TRUE_LATE = 1.80.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from i18n import t
import rdd_survival

TRUE_LATE = 1.80
CUTOFF = 65.0


# ---------------------------------------------------------------------------
# Linear-algebra helper (no statsmodels)
# ---------------------------------------------------------------------------
def _ols_beta(X, y):
    return np.linalg.pinv(X.T @ X) @ (X.T @ y)


# ===========================================================================
# 藥方一 — DML for sharp RDD, robust to the window/bandwidth choice
# ===========================================================================
def _gen_rdd_confounded(n, seed):
    """Sharp-RDD-style data where LOCAL RANDOMIZATION fails as the window widens.

    The running variable (age centred at 65) enters the outcome, and a measured
    covariate trends with age, so the two halves of a WIDE window are not
    comparable: a plain within-window difference-in-means picks up that smooth
    trend and is biased. Inside a NARROW window the halves are comparable.
    Adjusting for (age, covariates) — what DML does — fixes it at ANY width.
    The only true jump in Y at the cutoff is TRUE_LATE * T.
    """
    rng = np.random.default_rng(seed)
    age = rng.uniform(45, 85, n)
    z = age - CUTOFF                          # centred running variable
    T = (age >= CUTOFF).astype(float)         # sharp eligibility (deterministic in z)
    x1 = 0.06 * z + rng.standard_normal(n)    # covariate that trends with age
    x2 = rng.standard_normal(n)               # plain covariate
    Y = (2.0 + TRUE_LATE * T
         + 0.40 * z + 1.20 * x1 + 0.30 * x2
         + rng.normal(0, 2.0, n))
    X = np.column_stack([x1, x2])
    return z, X, T, Y


def _conventional_window(z, T, Y, W):
    """Plain within-window difference in means (the 'OG' / local-randomization
    estimator with NO adjustment). Biased as the window widens."""
    m = np.abs(z) <= W
    TT, YY = T[m], Y[m]
    y1, y0 = YY[TT == 1], YY[TT == 0]
    if y1.size < 5 or y0.size < 5:
        return float("nan"), float("nan")
    est = float(y1.mean() - y0.mean())
    se = float(np.sqrt(y1.var(ddof=1) / y1.size + y0.var(ddof=1) / y0.size))
    return est, se


def _dml_window(z, X, T, Y, W, k_folds=5, seed=0):
    """Cross-fitted doubly-robust (AIPW) effect within the window, adjusting for
    (z, X). Nuisances predicted OUT-OF-FOLD (cross-fitting). Robust to width."""
    m = np.abs(z) <= W
    zz, XX, TT, YY = z[m], X[m], T[m], Y[m]
    n = zz.size
    if n < 40 or TT.sum() < 10 or (1.0 - TT).sum() < 10:
        return float("nan"), float("nan")
    feat = np.column_stack([np.ones(n), zz, XX])     # design with intercept
    p = float(TT.mean())
    l1 = np.empty(n)
    l0 = np.empty(n)
    rng = np.random.default_rng(seed)
    folds = np.array_split(rng.permutation(n), k_folds)
    for f in folds:
        train = np.ones(n, dtype=bool)
        train[f] = False
        tr1 = train & (TT == 1)
        tr0 = train & (TT == 0)
        if tr1.sum() < 4 or tr0.sum() < 4:
            l1[f] = YY[f]
            l0[f] = YY[f]
            continue
        b1 = _ols_beta(feat[tr1], YY[tr1])
        b0 = _ols_beta(feat[tr0], YY[tr0])
        l1[f] = feat[f] @ b1
        l0[f] = feat[f] @ b0
    psi = (l1 - l0) + TT / p * (YY - l1) - (1.0 - TT) / (1.0 - p) * (YY - l0)
    est = float(psi.mean())
    se = float(psi.std(ddof=1) / np.sqrt(n))
    return est, se


def dml_bandwidth_demo(window=8.0, seed=7, n=4000):
    """藥方一 slider: conventional within-window comparison vs cross-fitted DML,
    at the chosen window AND across a range of windows (the robustness curve)."""
    n = int(np.clip(n, 1000, 12000))
    window = float(np.clip(window, 2.0, 20.0))
    z, X, T, Y = _gen_rdd_confounded(n, seed)

    c_est, c_se = _conventional_window(z, T, Y, window)
    d_est, d_se = _dml_window(z, X, T, Y, window, seed=seed)

    Ws = np.linspace(2.0, 20.0, 10)
    curve = {"window": [], "conv": [], "conv_lo": [], "conv_hi": [],
             "dml": [], "dml_lo": [], "dml_hi": []}
    for W in Ws:
        ce, cs = _conventional_window(z, T, Y, W)
        de, ds = _dml_window(z, X, T, Y, W, seed=seed)
        curve["window"].append(round(float(W), 1))
        curve["conv"].append(round(ce, 3))
        curve["conv_lo"].append(round(ce - 1.96 * cs, 3))
        curve["conv_hi"].append(round(ce + 1.96 * cs, 3))
        curve["dml"].append(round(de, 3))
        curve["dml_lo"].append(round(de - 1.96 * ds, 3))
        curve["dml_hi"].append(round(de + 1.96 * ds, 3))

    def _pack(est, se):
        return {"estimate": round(est, 2), "se": round(se, 3),
                "ci": [round(est - 1.96 * se, 2), round(est + 1.96 * se, 2)]}

    return {
        "true_effect": TRUE_LATE,
        "n": n,
        "window": window,
        "conventional": _pack(c_est, c_se),
        "dml": _pack(d_est, d_se),
        "curve": curve,
    }


# ===========================================================================
# 藥方二 — flexible-ML doubly-robust censoring correction for survival RDD
# ===========================================================================
def _gen_survival_rdd(n, seed):
    """Censored survival RDD with COVARIATE-DEPENDENT censoring, so that ignoring
    censoring is clearly biased and a single working model is shakier than the
    doubly-robust pairing of a censoring model with a flexible outcome model."""
    rng = np.random.default_rng(seed)
    age = rng.uniform(50, 80, n)
    a = (age - CUTOFF) / 10.0
    eligible = (age >= CUTOFF).astype(int)
    U = rng.standard_normal(n)                       # unobserved health consciousness
    frailty = np.clip(rng.normal(0.5 + 0.15 * a, 1.0, n), -3.0, 3.0)

    p_vax = np.clip(0.18 + 0.05 * a + 0.40 * eligible + 0.10 * U, 0.02, 0.98)
    vaccinated = rng.binomial(1, p_vax).astype(int)

    log_rate = -1.8 + 0.45 * a - 0.80 * vaccinated + 0.25 * U
    t_event = rng.exponential(1.0 / np.exp(log_rate))

    # Covariate-dependent censoring: older & frailer subjects censored earlier.
    cens_scale = np.exp(2.6 - 0.20 * a - 0.15 * frailty)
    t_cens = np.minimum(rng.exponential(cens_scale), 14.0)
    event_time = np.minimum(t_event, t_cens).round(3)
    event = (t_event <= t_cens).astype(int)

    return pd.DataFrame({
        "age": age.round(2),
        "eligible": eligible,
        "vaccinated": vaccinated,
        "event_time": event_time,
        "event": event,
        "frailty": frailty.round(3),
    })


def survival_robust_demo(seed=11, n=1200, lang="zh"):
    """藥方二: on censored survival data, compare ignoring censoring (biased) vs
    IPCW vs doubly-robust + flexible outcome models (Cox / log-normal AFT)."""
    n = int(np.clip(n, 800, 3000))
    df = _gen_survival_rdd(n, seed)

    naive = rdd_survival.naive_survival_rd(df, "age", "event_time", CUTOFF, lang=lang)
    surv = rdd_survival.survival_rd(
        df, "age", "event_time", "event", CUTOFF,
        d_name="vaccinated", fuzzy=True, lang=lang,
        methods=("ipcw", "cox", "lognorm"),
    )

    methods = {m["key"]: m for m in surv["methods"]}
    bars = [{
        "key": "naive",
        "label": t(lang, "未處理設限（有偏）", "No censoring fix (biased)"),
        "estimate": round(naive["estimate"], 2),
        "ci": [round(c, 2) for c in naive["ci"]],
        "status": "bad",
        "note": t(lang, "直接對 log（觀察時間）做 RD，被提早設限者往下拉。",
                  "Plain RD on log(observed time); dragged down by early-censored subjects."),
    }]
    ipcw = methods.get("ipcw")
    if ipcw:
        bars.append({
            "key": "ipcw", "label": ipcw["label"],
            "estimate": round(ipcw["estimate"], 2),
            "ci": [round(c, 2) for c in ipcw["ci"]],
            "status": "weak",
            "note": t(lang, "只靠設限模型加權；設限與共變項有關時較不穩、誤差較寬。",
                      "Relies on the censoring model alone; shakier and wider when "
                      "censoring depends on covariates."),
        })
    for key in ("cox", "lognorm"):
        m = methods.get(key)
        if not m:
            continue
        bars.append({
            "key": key, "label": m["label"],
            "estimate": round(m["estimate"], 2),
            "ci": [round(c, 2) for c in m["ci"]],
            "status": "good",
            "note": t(lang, "再加一個彈性結果模型（雙重穩健）：兩個模型其中一個對就一致，誤差更窄、更穩。",
                      "Adds a flexible outcome model (doubly robust): consistent if "
                      "either model is right, with a tighter, steadier estimate."),
        })

    return {
        "n": int(surv["nu"]),
        "cens_rate": surv["cens_rate"],
        "bars": bars,
    }
