"""Synthetic data for TreeScan (the tree-based scan statistic).

Story: after a drug exposure we watch a whole *hierarchy* of adverse-event outcomes
(body systems → specific events). Under the null, the exposed fraction is the same at
every node. We inject a genuine excess of exposure at ONE target leaf (a real signal).
Everything else is noise. A naive uncorrected scan over hundreds of nodes flags many
false positives; the tree-based scan statistic, with a Monte-Carlo permutation p-value,
controls the family-wise error and flags (essentially) only the true node.

Columns: pid, leaf (int leaf index), exposed (0/1).
The tree (leaf → system) is fixed by TREE below; `node_table()` returns the membership
matrix used by the scan.
"""
from __future__ import annotations

import numpy as np

SEED = 7
N = 6000
P0 = 0.30                 # baseline exposed fraction (constant under the null)
SIGNAL = 3.0              # default signal strength (odds multiplier at the target leaf)
TARGET_LEAF = 11          # the one leaf with a real exposure excess

# A two-level outcome hierarchy: 6 body systems, each with 4 specific-event leaves.
SYSTEMS = [
    ("Cardiac", ["Arrhythmia", "MI", "Heart failure", "Hypertension"]),
    ("Hepatic", ["ALT rise", "Jaundice", "Hepatitis", "Liver failure"]),
    ("Neuro", ["Headache", "Seizure", "Neuropathy", "Stroke"]),
    ("Derm", ["Rash", "Urticaria", "SJS", "Pruritus"]),
    ("GI", ["Nausea", "GI bleed", "Pancreatitis", "Diarrhoea"]),
    ("Renal", ["AKI", "Proteinuria", "CKD", "Electrolyte"]),
]
# Flatten leaves; leaf index = position in this list.
LEAVES = [(si, lname) for si, (_s, ls) in enumerate(SYSTEMS) for lname in ls]
N_LEAVES = len(LEAVES)                      # 24
N_SYS = len(SYSTEMS)                         # 6
# Baseline outcome distribution over leaves (exposure-independent), mildly uneven.
_BASE_Q = None


def leaf_names():
    return [f"{SYSTEMS[si][0]} / {ln}" for si, ln in LEAVES]


def system_of(leaf):
    return LEAVES[int(leaf)][0]


def _base_q():
    global _BASE_Q
    if _BASE_Q is None:
        rng = np.random.default_rng(101)
        q = 0.6 + rng.random(N_LEAVES)       # uneven but bounded
        _BASE_Q = q / q.sum()
    return _BASE_Q


def generate(seed: int = SEED, n: int = N, signal: float = SIGNAL):
    """Each subject gets an outcome leaf (exposure-independent) and an exposure flag.

    Exposure is Bernoulli(P0) everywhere EXCEPT the target leaf, where the odds are
    multiplied by `signal` (signal=1 → pure null, no excess anywhere).
    """
    rng = np.random.default_rng(seed)
    leaf = rng.choice(N_LEAVES, size=n, p=_base_q()).astype(np.intp)
    # exposure probability per subject
    p = np.full(n, P0, dtype=float)
    if signal != 1.0:
        odds = P0 / (1.0 - P0) * float(signal)
        p_target = odds / (1.0 + odds)
        p[leaf == TARGET_LEAF] = p_target
    exposed = (rng.random(n) < p).astype(np.intp)
    return {"pid": np.arange(n, dtype=np.intp), "leaf": leaf, "exposed": exposed}


def node_table():
    """Return the scan's node structure.

    nodes: list of (kind, label) for every leaf node and every system node, plus root.
    membership: (n_nodes, N_LEAVES) 0/1 matrix — row g is 1 for leaves under node g.
    A subject at leaf L contributes to every node whose row has a 1 in column L.
    """
    rows = []
    labels = []
    kinds = []
    # leaf nodes
    for li, (si, ln) in enumerate(LEAVES):
        r = np.zeros(N_LEAVES, dtype=float); r[li] = 1.0
        rows.append(r); labels.append(f"{SYSTEMS[si][0]} / {ln}"); kinds.append("leaf")
    # system nodes (a system = all its leaves)
    for si, (sname, _ls) in enumerate(SYSTEMS):
        r = np.array([1.0 if LEAVES[li][0] == si else 0.0 for li in range(N_LEAVES)])
        rows.append(r); labels.append(sname); kinds.append("system")
    return {"membership": np.vstack(rows), "labels": labels, "kinds": kinds,
            "target_label": leaf_names()[TARGET_LEAF]}
