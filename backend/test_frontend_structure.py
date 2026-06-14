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


def test_subtab_buttons_match_the_six_subs(html):
    found = set(re.findall(r'class="tab subtab[^"]*"\s+data-sub="(\w+)"', html))
    found |= set(re.findall(r'data-sub="(\w+)"', html))
    for sub in SUBS:
        assert sub in found, f"subtab button for '{sub}' missing"
