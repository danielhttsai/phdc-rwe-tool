# Self-audit standard — keeping the toolbox broadly &amp; persistently beneficial

This file is the project's standing quality bar. It adapts the *beneficial-trait* framing of
Jagadeesh et al., **"Reinforcement Learning Towards Broadly and Persistently Beneficial
Models"** (OpenAI, 2025) into concrete, checkable rules for **this** teaching tool. We cannot
RL-train the model that edits the site, but we *can* make the same traits — **truthfulness,
risk-awareness, fairness, and corrigibility** — a persistent, enforced standard so the tool keeps
self-correcting as it grows.

The point of the paper carries over directly: a standard applied **broadly** (to every method,
every change) and **persistently** (re-checked on every commit, not once) generalizes — fixing a
class of defect everywhere stops it recurring anywhere.

## The four traits → what they mean here

### 1. Truthfulness (claims are correct and verifiable)
- Every method's stated formula, assumption, and code must be technically correct.
- Every method has a **③ 出處 / Sources** line citing the canonical paper **and** the exact
  package/procedure used, with a working link where one exists (`.code-src` + `.src-links`).
- Every reference `<li data-ref>` is **one paper per line** with a one-line description (no bare
  citations); attributions are accurate (a paper that *used* a method is an application, not the
  method's origin).
- No invented citations, DOIs, or author lists.

### 2. Risk-awareness (be explicit about what can go wrong)
- Every method states its **one untestable core assumption** and when it fails (the ④ tab).
- Sensitivity/limitations are surfaced, not buried (E-value/array, M-value, QBA; "flags, does not
  confirm" for screening designs).
- ML/⑤ sections say honestly what ML **cannot** fix.

### 3. Fairness / consistency (treat every method to the same bar)
- All 36 methods have the six ①–⑥ sub-panels, a dropdown option, a `METHOD_REF`, references, and
  an interactive ② demo.
- Bilingual parity: Traditional-Chinese innerHTML + an English `data-en` on the same element.
- A new method is **also** wired into the comparison chart/table **and** the decision tree
  (`DNODES`) — "every time you add a method, add it to the structure tree too".

### 4. Corrigibility (find and fix our own errors, don't defend them)
- Prefer the most professional wording; no casual slang in shipped copy (e.g. no "GG").
- No AI-tells in the copy: **no long em-dash `——`** (use a full-width colon `：` for a label, a
  comma `，` mid-sentence); don't overuse "誠實" (keep it only where it is the literal technical
  term, e.g. grf "honest trees").
- When a correction is requested, change the thing — including upstream (refs, tree, chart) — not
  just the spot that was pointed at.

## How the standard is enforced (persistent, automatic)
`backend/test_frontend_structure.py` runs in CI on every push and fails the build on a violation:
- six sub-panels, a dropdown option, and **no TOPICS/METHOD_PREFIX overlap** for every method;
- every method has a `METHOD_REF` entry and at least one `data-ref` reference;
- every `data-m` cross-link points at a real method;
- **no long em-dash `——`** and no "GG" slang in the source;
- quiz keys are real methods; the ①–⑥ subtab buttons exist.

## Workflow when evolving the tool
1. Edit `frontend/` only → `python build_docs.py` (stop any preview server first; it locks `docs/`).
2. Run `python -m pytest backend/test_frontend_structure.py -q` — it encodes this standard.
3. Commit **both** `frontend/` and `docs/`; push.
4. Periodically run a deeper, content-level review (`/code-review`) for things automation can't see
   (factual nuance, pedagogy) — corrigibility means scheduling the check, not waiting for a bug
   report.
