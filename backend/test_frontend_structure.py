"""Structural smoke tests for the frontend (no browser, pure stdlib).

These guard the wiring between the method dropdown, the JS navigation tables
(METHOD_PREFIX / TOPICS) and the actual HTML panels — the class of bug that is
invisible to the Python unit tests but breaks the page (e.g. a method with a
missing sub-panel, or a topic left in both TOPICS and METHOD_PREFIX).

Fast and deterministic; safe to run in CI on every push.
"""
import os
import re

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND = os.path.join(ROOT, "frontend")

SUBS = ["learn", "play", "analyze", "assume", "ml", "whatif"]


def _read(name):
    with open(os.path.join(FRONTEND, name), encoding="utf-8") as f:
        return f.read()


def _obj_body(js, decl):
    """Return the text inside the first balanced { } after `const <decl> =`."""
    m = re.search(r"const\s+" + re.escape(decl) + r"\s*=\s*\{", js)
    assert m, f"{decl} not found in app.js"
    i = m.end() - 1
    depth, start = 0, i
    for j in range(i, len(js)):
        if js[j] == "{":
            depth += 1
        elif js[j] == "}":
            depth -= 1
            if depth == 0:
                return js[start + 1:j]
    raise AssertionError(f"unbalanced braces for {decl}")


@pytest.fixture(scope="module")
def html():
    return _read("index.html")


@pytest.fixture(scope="module")
def appjs():
    return _read("app.js")


@pytest.fixture(scope="module")
def method_prefix(appjs):
    body = _obj_body(appjs, "METHOD_PREFIX")
    # entries look like `iv: "", rdd: "rdd", ...`
    return dict(re.findall(r'(\w+)\s*:\s*"([^"]*)"', body))


@pytest.fixture(scope="module")
def topic_keys(appjs):
    body = _obj_body(appjs, "TOPICS")
    return set(re.findall(r"(\w+)\s*:\s*\{", body))


def test_methods_have_all_six_subpanels(html, method_prefix):
    missing = []
    for method, prefix in method_prefix.items():
        for sub in SUBS:
            pid = prefix + sub
            if f'id="{pid}"' not in html:
                missing.append(pid)
    assert not missing, f"missing sub-panels: {missing}"


def test_every_method_has_a_dropdown_option(html, method_prefix):
    missing = [m for m in method_prefix if f'value="{m}"' not in html]
    assert not missing, f"methods with no <option>: {missing}"


def test_topics_are_not_also_methods(method_prefix, topic_keys):
    overlap = topic_keys & set(method_prefix)
    assert not overlap, f"keys in both TOPICS and METHOD_PREFIX: {overlap}"


def test_topic_panels_and_options_exist(html, topic_keys, appjs):
    body = _obj_body(appjs, "TOPICS")
    for key in topic_keys:
        m = re.search(re.escape(key) + r'\s*:\s*\{[^}]*panel:\s*"([^"]+)"', body)
        assert m, f"TOPICS.{key} has no panel id"
        panel = m.group(1)
        assert f'id="{panel}"' in html, f"topic panel #{panel} not in HTML"
        assert f'value="{key}"' in html, f"topic {key} has no <option>"


def test_quiz_keys_are_real_methods(appjs, method_prefix):
    body = _obj_body(appjs, "QUIZ")
    # keep only depth-0 characters so nested keys like `options:` are excluded
    depth, top = 0, []
    for ch in body:
        if ch in "{[(":
            depth += 1
        elif ch in "}])":
            depth -= 1
        elif depth == 0:
            top.append(ch)
    keys = set(re.findall(r"(\w+)\s*:", "".join(top)))
    assert keys, "QUIZ registry is empty"
    bad = keys - set(method_prefix)
    assert not bad, f"QUIZ keys that are not methods: {bad}"


# --- SELF_AUDIT.md standard: enforced on every push (see SELF_AUDIT.md) ---

def test_every_method_has_a_method_ref(appjs, method_prefix):
    body = _obj_body(appjs, "METHOD_REF")
    keys = set(re.findall(r"(\w+)\s*:\s*\{", body))
    missing = [m for m in method_prefix if m not in keys]
    assert not missing, f"methods with no METHOD_REF entry: {missing}"


def test_every_method_has_at_least_one_reference(html, method_prefix):
    missing = [m for m in method_prefix if f'data-ref="{m}"' not in html]
    assert not missing, f"methods with no reference <li>: {missing}"


def test_cross_links_point_at_real_methods(html, method_prefix):
    targets = set(re.findall(r'data-m="(\w+)"', html))
    bad = targets - set(method_prefix)
    assert not bad, f"data-m cross-links that are not methods: {bad}"


def test_no_long_em_dash_ai_tell(html, appjs):
    # the long em-dash 「——」 reads as AI-generated; use 「：」 / 「，」 instead.
    assert "——" not in html, "long em-dash '——' found in index.html (see SELF_AUDIT.md)"
    assert "——" not in appjs, "long em-dash '——' found in app.js (see SELF_AUDIT.md)"


def test_no_casual_slang(html):
    assert "「GG」" not in html and "&quot;GG&quot;" not in html, "casual 'GG' slang in shipped copy"


def test_subtab_buttons_match_the_six_subs(html):
    found = set(re.findall(r'class="tab subtab[^"]*"\s+data-sub="(\w+)"', html))
    found |= set(re.findall(r'data-sub="(\w+)"', html))
    for sub in SUBS:
        assert sub in found, f"subtab button for '{sub}' missing"


# --- Round 3: every method ships a downloadable sample CSV, and the ③ code -----
# --- that has been migrated reads exactly that file (runnable on dummy data). ---

DATA = os.path.join(FRONTEND, "data")

# Methods whose ③ code has been rewritten to read <key>_sample.csv end-to-end.
# Extend this set as each batch lands; the column-level correctness is verified
# by review against each package's documented usage (R/SAS/Stata can't run here).
DONE_METHODS = {"ccw", "seq"}


def _analyze_panel(html, prefix):
    """Return the HTML of the <section id="<prefix>analyze"> ... </section>."""
    pid = prefix + "analyze"
    m = re.search(r'<section id="' + re.escape(pid) + r'"', html)
    assert m, f"no analyze panel for #{pid}"
    end = html.find("</section>", m.end())
    return html[m.start():end]


def test_every_method_has_a_sample_csv(method_prefix):
    missing = [m for m in method_prefix
               if not os.path.exists(os.path.join(DATA, f"{m}_sample.csv"))]
    assert not missing, f"methods with no data/<m>_sample.csv: {missing}"


def test_migrated_code_reads_its_sample_csv(html, method_prefix):
    bad = []
    for m in sorted(DONE_METHODS):
        prefix = method_prefix[m]
        panel = _analyze_panel(html, prefix)
        if f"{m}_sample.csv" not in panel:
            bad.append(m)
    assert not bad, f"③ code does not read its own sample CSV: {bad}"
