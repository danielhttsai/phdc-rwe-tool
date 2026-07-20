"""Build a STANDALONE, single-file teaching site with TWO tabs:
    · 選方法  — the "Which one?" design decision tree + full flowchart
    · 選資料庫 — the database chooser + full comparison table (總表)

Why a generator and not a hand-copy: the tree/database data (DNODES / FULLMAP /
DBNODES / DB_SUMMARY …) lives in frontend/app.js and changes often. This script
slices that block out at build time, so the teaching site never drifts from the
toolbox. Examples are framed around a generic drug X for a chronic disease.

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

# The decision-tree + database-chooser block in app.js: from the `L()` helper
# through the database chooser, i.e. everything up to the next unrelated feature.
# initMr() begins the ② interactive demos, so it is the clean cut point (the DB
# chooser sits just before it).
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
<title>怎麼選：研究設計與資料庫 · Which design &amp; which database?</title>
<meta name="description" content="A standalone, clickable teaching site: pick a causal / real-world-evidence study design, and pick a database, each ending in a full map/table. Framed around a generic drug X for a chronic disease. 因果研究設計與資料庫的可點擊挑選器。">
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
/* two-tab switcher */
.sa-tabs {{ display: flex; gap: .5rem; margin: 0 0 1.1rem; flex-wrap: wrap; }}
.sa-tab {{ border: 1.5px solid var(--line, #dfe7e4); background: var(--card, #fff); color: var(--ink, #14283c);
  border-radius: 999px; padding: .5rem 1.2rem; font-size: 1rem; font-weight: 700; cursor: pointer; }}
.sa-tab.active {{ background: var(--z, #2f6f57); color: #fff; border-color: var(--z, #2f6f57); }}
.sa-panel[hidden] {{ display: none; }}
.sa-h2 {{ font-size: 1.1rem; margin: 0 0 1rem; color: var(--ink, #14283c); }}
.sa-foot {{ margin-top: 2.2rem; padding-top: .9rem; border-top: 1px solid var(--line, #dfe7e4);
  font-size: .82rem; color: var(--muted, #64748b); line-height: 1.7; }}
.sa-foot a {{ color: var(--z, #2f6f57); }}
@media print {{
  .dtree-controls, .sa-langbtn, .sa-tabs, .fc-toolbar {{ display: none !important; }}
  .sa-panel[hidden] {{ display: block !important; }}
  #dtreeMap[hidden], #dbtreeSummary[hidden] {{ display: block !important; }}
}}
</style>
</head>
<body>
<div class="sa-wrap">

  <header class="sa-top">
    <h1 data-en="Which design &amp; which database? A teaching picker">怎麼選：研究設計與資料庫
      <span class="sa-sub" data-en="Two clickable pickers, framed around a generic drug X for a chronic disease.">兩個可點擊的挑選器，以「藥物X 對某慢性病」的通用情境示範。</span>
    </h1>
    <button id="saLang" class="sa-langbtn" type="button">EN</button>
  </header>

  <div class="sa-tabs" role="tablist">
    <button class="sa-tab active" id="saTabMethods" type="button" data-en="① Method">① Method</button>
    <button class="sa-tab" id="saTabDb" type="button" data-en="② Database">② Database</button>
    <button class="sa-tab" id="saTabAlign" type="button" data-en="③ Align Time Zero">③ Align Time Zero</button>
    <button class="sa-tab" id="saTabBias" type="button" data-en="④ Bias">④ Bias</button>
  </div>

  <!-- ===================== TAB 1 · 選方法 ===================== -->
  <section class="sa-panel" id="paneMethods">
    <p class="caption" data-en="Built on the pharmacoepidemiology &quot;anchor&quot; approach, this puts the common study designs and the toolbox's methods (incl. mediation, transportability &amp; external control) into <b>one clickable tree</b>. Answer each question about your study of drug X and it lands on a best-fit recommendation, then open the <b>full flowchart</b> with your endpoint highlighted. <b>✓</b> = covered in the full toolbox (opens in a new tab); <b>↗</b> = related design, for reference.">建構在藥物流行病學的「錨點（anchor）」取向上，把<b>常見研究設計</b>與<b>工具箱的方法（含中介分析、可轉移性與外部對照）</b>合進<b>同一棵可點擊的樹</b>。順著你的「藥物X」研究情境一題一題點下去，最後會落在最適合的建議，並可打開<b>完整流程圖</b>、標出你的位置。<b>✓</b>＝完整工具箱有教學（另開分頁）；<b>↗</b>＝延伸設計，供參考。</p>

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
  </section>

  <!-- ===================== TAB 2 · 選資料庫 ===================== -->
  <section class="sa-panel" id="paneDb" hidden>
    <p class="caption" data-en="Answer what your study of drug X most needs; it lands on one of the databases this group uses — NHI, NHI×Cancer Registry, health-check×NHI, Chang Gung CGRD, clinic chart abstraction, HALST, TriNetX — with a drug-X example and chips linking to the designs it powers. Open the <b>full comparison table (總表)</b> at the end, with your pick highlighted and the workshop study contexts mapped to database × method.">回答「你的『藥物X』研究最需要什麼」，它會落在本組常用的一個資料庫（健保、健保串癌登、成人健檢串健保、長庚 CGRD、診所病例抄錄、HALST、TriNetX），附一個藥物X 範例與「撐得起的設計」連結。最後可打開<b>資料庫總表</b>，標出你選到的，並把研究情境對到「資料庫 × 方法」。</p>

    <div id="dbtree" class="dtree">
      <div id="dbtreePath" class="dtree-path"></div>
      <div id="dbtreeStage" class="dtree-stage"></div>
      <div class="dtree-controls">
        <button id="dbtreeBack" class="btn" type="button" data-en="← Back">← 上一步</button>
        <button id="dbtreeRestart" class="btn" type="button" data-en="Start over">重新開始</button>
        <button id="dbtreeTableBtn" class="btn" type="button" data-en="📊 Full comparison table">📊 看資料庫總表</button>
      </div>
    </div>
    <div id="dbtreeSummary" class="dtree-map" hidden></div>
  </section>

  <!-- ===================== TAB 3 · 對齊時間零 ===================== -->
  <section class="sa-panel" id="paneAlign" hidden>
    <h2 class="sa-h2" data-en="Align Time Zero — click an approach and watch the timeline">Align Time Zero：點一個做法，看時間軸怎麼變</h2>
    <div id="alignStage"></div>
  </section>

  <!-- ===================== TAB 4 · 抓偏誤 ===================== -->
  <section class="sa-panel" id="paneBias" hidden>
    <h2 class="sa-h2" data-en="Bias: immortal time · confounding by indication · unmeasured confounder">抓偏誤：不死時間 · 適應症混淆 · 無法被測量的干擾因子</h2>
    <div id="biasGame"></div>
  </section>

  <p class="sa-foot" data-en="A standalone extract of the &quot;Which one?&quot; and &quot;Databases&quot; tabs from the RWE &amp; Quasi-experimental Toolbox — for teaching use. Full toolbox (32 methods, each with six learning tabs): {TOOLBOX_URL} · All built-in data is fictional synthetic demo data; drug X is a generic placeholder, not a real product.">這是「真實世界證據與準實驗工具箱」中「怎麼選」與「資料庫」分頁的獨立版，供授課使用。完整工具箱（32 種方法、每種六個學習分頁）：<a href="{TOOLBOX_URL}" target="_blank" rel="noopener">{TOOLBOX_URL}</a>　·　所有內建資料皆為純屬虛構的合成示範資料；「藥物X」是通用代稱、非真實產品。</p>

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
initDbtree();
renderAlign();
initBiasGame();

/* ---------- tab switch (four panels) ---------- */
(function () {{
  var TABS = [
    {{ btn: "saTabMethods", pane: "paneMethods" }},
    {{ btn: "saTabDb", pane: "paneDb" }},
    {{ btn: "saTabAlign", pane: "paneAlign" }},
    {{ btn: "saTabBias", pane: "paneBias" }},
  ];
  function show(active) {{
    TABS.forEach(function (t) {{
      var on = t.btn === active;
      document.getElementById(t.btn).classList.toggle("active", on);
      document.getElementById(t.pane).hidden = !on;
    }});
  }}
  TABS.forEach(function (t) {{
    document.getElementById(t.btn).addEventListener("click", function () {{ show(t.btn); }});
  }});
}})();

document.getElementById("saLang").addEventListener("click", function () {{
  _lang = _lang === "en" ? "zh" : "en";
  try {{ localStorage.setItem("iv-lang", _lang); }} catch (e) {{}}
  applyLang();
  renderDtree();        // re-render all dynamic content in the new language
  renderDbtree();
  renderAlign();
  renderBiasGame();
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
