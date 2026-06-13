"""Synthetic data for the Transportability teaching demo.

You ran (or have) a study — say a randomised trial — in a STUDY population and
estimated the treatment effect there. You now want the effect in a TARGET
population that has a DIFFERENT distribution of an effect modifier X (e.g. the
trial enrolled younger, fitter people than the real-world target). Because the
effect is modified by X, the study effect is NOT the target effect. Transport it.

True effect is heterogeneous: tau(X) = BASE + MOD * X. The study estimates the
average over the study's X; the target wants the average over the target's X.
Purely synthetic, for teaching only.
"""
import numpy as np

SEED = 5
N_STUDY = 1600
N_TARGET = 1600
BASE = 1.0          # effect at X = 0
MOD = 0.8           # how much the effect grows per unit of the modifier X
G_X = 0.6           # main effect of X on the outcome
MU_STUDY = -0.5     # the study sample is shifted low on X...
MU_TARGET = 0.5     # ...the target is shifted high on X (so effects differ)


def generate(n_study=N_STUDY, n_target=N_TARGET, mu_study=MU_STUDY, mu_target=MU_TARGET, seed=SEED):
    rng = np.random.default_rng(seed)
    # STUDY: a randomised trial — A is coin-flipped, outcome has a modified effect
    xs = rng.normal(mu_study, 1.0, n_study)
    a = (rng.random(n_study) < 0.5).astype(float)
    tau = BASE + MOD * xs
    ys = 0.0 + tau * a + G_X * xs + rng.normal(0.0, 1.0, n_study)
    # TARGET: we only observe covariates (no treatment / outcome yet)
    xt = rng.normal(mu_target, 1.0, n_target)
    target_effect = float(BASE + MOD * mu_target)   # E_target[tau(X)]
    study_effect = float(BASE + MOD * xs.mean())     # what the study would report
    return {
        "study_X": xs, "study_A": a, "study_Y": ys, "target_X": xt,
        "target_effect": target_effect, "study_effect": study_effect,
        "mu_study": float(mu_study), "mu_target": float(mu_target),
    }
