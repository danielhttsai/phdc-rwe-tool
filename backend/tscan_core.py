"""TreeScan core: the unconditional Bernoulli tree-based scan statistic.

For every node g of the outcome hierarchy let n_g = subjects whose outcome falls under g
and c_g = exposed among them. Under the null the exposed fraction is a constant p0 = C/N
at every node. The Bernoulli log-likelihood ratio for an *excess* at node g is

    LLR_g = c_g·ln(c_g/n_g) + (n_g−c_g)·ln((n_g−c_g)/n_g)
            − c_g·ln(p0) − (n_g−c_g)·ln(1−p0)        (0 if c_g/n_g ≤ p0)

The scan statistic is T = max_g LLR_g. Its null distribution is obtained by *permuting*
the exposure labels (Monte-Carlo); a node's family-wise-error-adjusted p-value compares its
own LLR to that permutation max-LLR distribution. This controls the false-positive rate
across all the nodes scanned at once — the whole point of the method.

Contrast: a *naive* scan compares each node's LLR to an unadjusted χ²₁/2 reference and flags
every node that clears it, ignoring the multiplicity — so it raises many false alarms.

This is a faithful reimplementation of the Bernoulli tree-scan (Kulldorff et al. 2003); it
does not copy the TreeScan / TreeMineR source, only the mathematics.
"""
from __future__ import annotations

import numpy as np

import tscan_gen
from i18n import t

B_PERM = 999                       # Monte-Carlo permutations for the p-value
_CHI1_95_HALF = 1.9207             # χ²₁(0.95)/2 = 3.8415/2 — the naive per-node cutoff


def _llr(c, n, p0):
    """Bernoulli excess LLR per node; vectorised over an array of nodes (and columns)."""
    c = np.asarray(c, dtype=float)
    n = np.asarray(n, dtype=float)
    with np.errstate(divide="ignore", invalid="ignore"):
        phat = np.where(n > 0, c / n, 0.0)
        term = (c * np.log(np.where(c > 0, phat, 1.0))
                + (n - c) * np.log(np.where(n - c > 0, 1.0 - phat, 1.0))
                - c * np.log(p0) - (n - c) * np.log(1.0 - p0))
    # only excesses (phat > p0) count; clamp the rest to 0
    return np.where((phat > p0) & (n > 0), term, 0.0)


def _scan(df, B=B_PERM, seed=2024):
    nt = tscan_gen.node_table()
    M = nt["membership"]                                  # (n_nodes, n_leaves)
    leaf = np.asarray(df["leaf"], dtype=np.intp)
    exposed = np.asarray(df["exposed"], dtype=float)
    Nn = leaf.size
    # subject→leaf one-hot (n_leaves, N) so node counts = M @ onehot @ vec
    L = tscan_gen.N_LEAVES
    onehot = np.zeros((L, Nn))
    onehot[leaf, np.arange(Nn)] = 1.0
    Mn = M @ onehot                                       # (n_nodes, N) membership per subject
    n_g = Mn.sum(axis=1)                                  # subjects under each node
    c_g = Mn @ exposed                                    # exposed under each node
    p0 = exposed.sum() / Nn
    llr = _llr(c_g, n_g, p0)
    T_obs = float(llr.max())

    # Monte-Carlo: permute exposure across subjects, recompute node counts & max-LLR
    rng = np.random.default_rng(seed)
    E = np.empty((Nn, B))
    for b in range(B):
        E[:, b] = rng.permutation(exposed)
    Cb = Mn @ E                                           # (n_nodes, B) exposed per node per perm
    llr_b = _llr(Cb, n_g[:, None], p0)
    Tmax = llr_b.max(axis=0)                              # (B,) null max-LLR
    # FWER-adjusted p per node: rank of its LLR in the permutation max distribution
    p_fwer = (1.0 + (Tmax[None, :] >= llr[:, None]).sum(axis=1)) / (B + 1.0)
    return {"labels": nt["labels"], "kinds": nt["kinds"], "target_label": nt["target_label"],
            "llr": llr, "n_g": n_g, "c_g": c_g, "p0": p0, "p_fwer": p_fwer,
            "T_obs": T_obs, "Tmax": Tmax, "B": B}


def full_tscan(df, lang="zh", alpha=0.05):
    s = _scan(df)
    llr, p_fwer = s["llr"], s["p_fwer"]
    labels, kinds = s["labels"], s["kinds"]
    order = np.argsort(-llr)
    top = []
    for i in order[:8]:
        top.append({
            "label": labels[i], "kind": kinds[i], "llr": round(float(llr[i]), 2),
            "n": int(s["n_g"][i]), "c": int(s["c_g"][i]),
            "rate": round(float(s["c_g"][i] / max(s["n_g"][i], 1)), 3),
            "p": round(float(p_fwer[i]), 4),
            "flag": bool(p_fwer[i] < alpha),
        })
    # naive uncorrected flags (per-node χ²₁/2 cutoff) vs FWER-controlled flags
    n_naive = int((llr > _CHI1_95_HALF).sum())
    n_tscan = int((p_fwer < alpha).sum())
    # is the genuine target node among the FWER-flagged?
    ti = labels.index(s["target_label"])
    target_hit = bool(p_fwer[ti] < alpha)
    best = top[0]
    interp = t(
        lang,
        f"掃描 {len(labels)} 個節點：最強訊號在「<b>{best['label']}</b>」（LLR {best['llr']}、"
        f"接種率 {best['rate']:.0%} vs 基準 {s['p0']:.0%}），排列法校正後 p ＝ {best['p']:.3g}。"
        f"<b>天真</b>未校正會標出 <b>{n_naive}</b> 個節點（多為假警報）；<b>TreeScan</b> 控制整體錯誤後只標 <b>{n_tscan}</b> 個"
        + ("，正好就是真正有超額的那一個。" if target_hit and n_tscan <= 2 else "。"),
        f"Scanning {len(labels)} nodes: the strongest signal is at '<b>{best['label']}</b>' (LLR {best['llr']}, "
        f"exposed rate {best['rate']:.0%} vs baseline {s['p0']:.0%}), permutation-adjusted p = {best['p']:.3g}. "
        f"A <b>naive</b> uncorrected scan flags <b>{n_naive}</b> nodes (mostly false alarms); <b>TreeScan</b>, controlling "
        f"the family-wise error, flags only <b>{n_tscan}</b>"
        + (" — exactly the node with the real excess." if target_hit and n_tscan <= 2 else "."),
    )
    return {"nodes": top, "n_nodes": len(labels), "p0": round(float(s["p0"]), 3),
            "T_obs": round(s["T_obs"], 2), "n_naive_flags": n_naive, "n_tscan_flags": n_tscan,
            "target_label": s["target_label"], "target_hit": target_hit,
            "interpretation": interp}


# ---------------- offline grid for the ② interactive slider ----------------
# signal strength → (max-LLR, FWER p of the strongest node, naive vs treescan flag counts).
_GRID = {
    "sig":   [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0],
    "llr":   [3.0, 2.8, 8.7, 16.5, 25.6, 33.8, 38.8],
    "p":     [0.141, 0.178, 0.001, 0.001, 0.001, 0.001, 0.001],
    "naive": [1, 2, 2, 3, 3, 3, 3],
    "tscan": [0, 0, 1, 1, 2, 2, 2],
}


def _recompute_grid(B=199):
    out = {"sig": [], "llr": [], "p": [], "naive": [], "tscan": []}
    for s in [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]:
        df = tscan_gen.generate(seed=7, signal=s)
        sc = _scan(df, B=B)
        out["sig"].append(s)
        out["llr"].append(round(float(sc["llr"].max()), 1))
        out["p"].append(round(float(sc["p_fwer"].min()), 3))
        out["naive"].append(int((sc["llr"] > _CHI1_95_HALF).sum()))
        out["tscan"].append(int((sc["p_fwer"] < 0.05).sum()))
    return out


def tscan_interactive(signal: float, lang="zh"):
    g = _GRID
    i = int(np.argmin([abs(signal - s) for s in g["sig"]]))
    reading = t(
        lang,
        f"訊號強度 {g['sig'][i]:.1f}：最強節點 LLR ＝ {g['llr'][i]:.0f}、校正後 p ＝ {g['p'][i]:.3g}。"
        f"天真未校正標 {g['naive'][i]} 個節點、TreeScan 只標 {g['tscan'][i]} 個"
        + ("（強度 1＝純虛無，TreeScan 正確地一個都不標）。" if g['sig'][i] == 1.0 else "。"),
        f"Signal strength {g['sig'][i]:.1f}: strongest node LLR = {g['llr'][i]:.0f}, adjusted p = {g['p'][i]:.3g}. "
        f"The naive uncorrected scan flags {g['naive'][i]} nodes; TreeScan flags only {g['tscan'][i]}"
        + (" (strength 1 = pure null, and TreeScan correctly flags none)." if g['sig'][i] == 1.0 else "."),
    )
    return {"signal": g["sig"][i], "llr": g["llr"][i], "p": g["p"][i],
            "naive": g["naive"][i], "tscan": g["tscan"][i], "grid": g, "reading": reading}
