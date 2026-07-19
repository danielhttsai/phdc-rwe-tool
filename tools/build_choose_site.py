"""Build a STANDALONE, single-file version of the "Which one?" decision tree.

Why a generator and not a hand-copy: the tree data (DNODES / FULLMAP) lives in
frontend/app.js and changes often. This script slices that block out at build
time, so the teaching site never drifts from the toolbox.

Output (both are the same self-contained file, no external assets, works offline):
    standalone/choose.html        <- open locally / email / put on a USB stick
    docs/choose/index.html        <- served at <pages-url>/choose/

Run:
    python tools/build_choose_site.py
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
APP = os.path.join(ROOT, "frontend", "app.js")
CSS = os.path.join(ROOT, "frontend", "styles.css")
OUT_STANDALONE = os.path.join(ROOT, "standalone", "choose.html")
OUT_DOCS = os.path.join(ROOT, "docs", "choose", "index.html")

TOOLBOX_URL = "https://danielhttsai.github.io/phdc-rwe-tool/"

# The decision-tree block in app.js: from the `L()` helper through the last
# flowchart-export function, i.e. everything up to the next unrelated feature.
JS_START = "const L = (o) => (lang()"
JS_END = "function initMr()"


def extract_tree_js(app_src: str) -> str:
    i = app_src.index(JS_START)
    j = app_src.index(JS_END, i)
    js = app_src[i:j].rstrip()
    # The export helper reads styles.css over the network; inline it instead so
    # the single file works with no server and no fetch.
    js = js.replace('await (await fetch("styles.css")).text()', "__DTREE_CSS")
    # The export helper builds a whole HTML document as a JS string. A literal
    # "</script>" anywhere in this block would terminate the page's inline
    # <script> early and silently break the standalone file, so neutralise it.
    js = js.replace("</script>", "<\\/script>")
    return js


def build(app_src: str, css_src: str) -> str:
    tree_js = extract_tree_js(app_src)
    return f"""<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>怎麼選：因果研究設計決策樹 · Which design? A decision tree</title>
<meta name="description" content="A standalone, clickable decision tree for choosing a causal / real-world-evidence study design, ending in the full flowchart. 因果推論研究設計的可點擊決策樹。">
<style>
{css_src}

/* ---- standalone page shell (this file has no app chrome) ---- */
body {{ background: var(--bg, #f4f7f6); margin: 0; }}
.sa-wrap {{ max-width: 1180px; margin: 0 auto; padding: 1rem 1.1rem 4rem; }}
.sa-top {{ display: flex; align-items: center; gap: .8rem; flex-wrap: wrap;
  padding: .9rem 0 .5rem; border-bottom: 1px solid var(--line, #dfe7e4); margin-bottom: 1.1rem; }}
.sa-top h1 {{ font-size: 1.18rem; margin: 0; flex: 1 1 auto; color: var(--ink, #14283c); }}
.sa-top .sa-sub {{ display: block; font-size: .82rem; font-weight: 500; color: var(--muted, #64748b); margin-top: .2rem; }}
.sa-langbtn {{ border: 1px solid var(--z, #2f6f57); background: var(--z, #2f6f57); color: #fff;
  border-radius: 999px; padding: .34rem .9rem; font-size: .84rem; cursor: pointer; }}
.sa-langbtn:hover {{ filter: brightness(1.08); }}
.sa-foot {{ margin-top: 2.2rem; padding-top: .9rem; border-top: 1px solid var(--line, #dfe7e4);
  font-size: .82rem; color: var(--muted, #64748b); line-height: 1.7; }}
.sa-foot a {{ color: var(--z, #2f6f57); }}
@media print {{
  .dtree-controls, .sa-langbtn, .fc-toolbar {{ display: none !important; }}
  #dtreeMap[hidden] {{ display: block !important; }}
}}
</style>
</head>
<body>
<div class="sa-wrap">

  <header class="sa-top">
    <h1 data-en="Which design? A causal-inference decision tree">怎麼選：因果研究設計決策樹
      <span class="sa-sub" data-en="Click through the questions; the full flowchart is at the end.">一題一題點下去，最後會給你完整流程圖。</span>
    </h1>
    <button id="saLang" class="sa-langbtn" type="button">EN</button>
  </header>

  <p class="caption" data-en="Built on the pharmacoepidemiology &quot;anchor&quot; approach, this puts the common study designs and the toolbox's methods (incl. mediation, transportability &amp; external control) into <b>one clickable tree</b>. Answer each question about your study and it lands on a best-fit recommendation, then open the <b>full flowchart</b> with your endpoint highlighted. <b>✓</b> = covered in the full toolbox (opens in a new tab); <b>↗</b> = related design, for reference.">建構在藥物流行病學的「錨點（anchor）」取向上，把<b>常見研究設計</b>與<b>工具箱的方法（含中介分析、可轉移性與外部對照）</b>合進<b>同一棵可點擊的樹</b>。順著你的研究情境一題一題點下去，最後會落在最適合的建議，並可打開<b>完整流程圖</b>、標出你的位置。<b>✓</b>＝完整工具箱有教學（另開分頁）；<b>↗</b>＝延伸設計，供參考。</p>

  <div class="flow-legend">
    <span data-en="<b>✓</b> covered in the full toolbox (clickable)"><b>✓</b> 完整工具箱有教學（可點擊前往）</span>
    <span data-en="<b>↗</b> other related design, for reference"><b>↗</b> 其他延伸設計，供參考</span>
  </div>

  <div id="dtree" class="dtree">
    <div id="dtreePath" class="dtree-path"></div>
    <div id="dtreeStage" class="dtree-stage"></div>
    <div class="dtree-controls">
      <button id="dtreeBack" class="btn" type="button" data-en="← Back">← 上一步</button>
      <button id="dtreeRestart" class="btn" type="button" data-en="Start over">重新開始</button>
      <button id="dtreeFullmap" class="btn" type="button" data-en="🌳 Full flowchart">🌳 看完整流程圖</button>
    </div>
  </div>
  <div id="dtreeMap" class="dtree-map" hidden></div>

  <p class="sa-foot" data-en="A standalone extract of the &quot;Which one?&quot; tab from the RWE &amp; Quasi-experimental Toolbox — for teaching use. Full toolbox (32 methods, each with six learning tabs): {TOOLBOX_URL} · All built-in data is fictional synthetic demo data.">這是「真實世界證據與準實驗工具箱」中「怎麼選」分頁的獨立版，供授課使用。完整工具箱（32 種方法、每種六個學習分頁）：<a href="{TOOLBOX_URL}" target="_blank" rel="noopener">{TOOLBOX_URL}</a>　·　所有內建資料皆為純屬虛構的合成示範資料。</p>

</div>

<script>
/* ---------- minimal i18n shim (the full toolbox uses i18n.js) ---------- */
var _lang = (function () {{
  try {{ return localStorage.getItem("iv-lang") || "zh"; }} catch (e) {{ return "zh"; }}
}})();
function lang() {{ return _lang; }}
function tr(zh, en) {{ return _lang === "en" ? en : zh; }}
function applyLang() {{
  document.querySelectorAll("[data-en]").forEach(function (el) {{
    if (el.dataset.zh === undefined) el.dataset.zh = el.innerHTML;
    el.innerHTML = _lang === "en" ? el.dataset.en : el.dataset.zh;
  }});
  document.documentElement.lang = _lang === "en" ? "en" : "zh-Hant";
  var b = document.getElementById("saLang");
  if (b) b.textContent = _lang === "en" ? "中文" : "EN";
}}

/* ---------- leaf "go to the method" opens the full toolbox ---------- */
var TOOLBOX_URL = {json.dumps(TOOLBOX_URL)};
function gotoMethod(m, sub) {{
  window.open(TOOLBOX_URL + "#m=" + m + "&t=" + (sub || "learn"), "_blank", "noopener");
}}

/* ---------- the flowchart exporter reads the stylesheet; inline it ---------- */
var __DTREE_CSS = {json.dumps(css_src)};

/* ================= extracted verbatim from frontend/app.js ================= */
{tree_js}
/* =========================== end extracted block =========================== */

applyLang();
initDtree();
document.getElementById("saLang").addEventListener("click", function () {{
  _lang = _lang === "en" ? "zh" : "en";
  try {{ localStorage.setItem("iv-lang", _lang); }} catch (e) {{}}
  applyLang();
  renderDtree();                       // re-render the dynamic tree in the new language
}});
</script>
</body>
</html>
"""


def main():
    app_src = open(APP, encoding="utf-8").read()
    css_src = open(CSS, encoding="utf-8").read()
    html = build(app_src, css_src)
    for path in (OUT_STANDALONE, OUT_DOCS):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(html)
        print("wrote {} ({:,} bytes)".format(os.path.relpath(path, ROOT), len(html.encode("utf-8"))))


if __name__ == "__main__":
    main()
