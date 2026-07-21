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
<title>Lilly RWE workshop</title>
<meta name="description" content="Lilly RWE workshop — a standalone, clickable teaching site: pick a study design, pick a database, align time zero, and spot the bias, framed around a generic drug X for a chronic disease. 真實世界證據研究設計的互動教學。">
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
.sa-scenario {{ background: #eef2ff; border: 1px solid #c7d2fe; border-left: 4px solid #6366f1;
  border-radius: 12px; padding: .8rem 1rem; font-size: .92rem; line-height: 1.8; margin: 0 0 1.1rem; }}
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
    <h1>Lilly RWE workshop
      <span class="sa-sub">用一個「藥物X 用 vs 不用」的不死時間故事貫穿四個互動分頁：Appraisal（評讀）· Database（選資料庫）· Bias（抓偏誤）· Method（選方法）。</span>
    </h1>
  </header>

  <div class="sa-tabs" role="tablist">
    <button class="sa-tab active" id="saTabAlign" type="button">① Appraisal</button>
    <button class="sa-tab" id="saTabDb" type="button">② Database</button>
    <button class="sa-tab" id="saTabBias" type="button">③ Bias</button>
    <button class="sa-tab" id="saTabMethods" type="button">④ Method</button>
  </div>

  <!-- ===================== TAB 1 · Appraisal ===================== -->
  <section class="sa-panel" id="paneAlign">
    <h2 class="sa-h2">Appraisal：評讀一個「藥物X 用 vs 不用」的研究</h2>
    <div id="alignStage"></div>
  </section>

  <!-- ===================== TAB 2 · Database ===================== -->
  <section class="sa-panel" id="paneDb" hidden>
    <h2 class="sa-h2">Database：小賴醫師要重做這個分析，需要對的資料</h2>
    <div class="sa-scenario">延續 <b>Appraisal</b> 的故事：小賴醫師想知道「某慢性病患者中，<b>有用藥物X vs 沒用</b>的人是不是活得比較久？」第一版（曾用藥＝暴露、從診斷起算）看起來「用藥的人死亡風險少 40%」，但那其實是<b>不死時間</b>灌出來的。要<b>正確重做</b>（新使用者、時變暴露、對齊 Time Zero），資料裡就得有<b>這些設計需要的東西</b>。<b>你手上是哪種資料庫？</b></div>
    <div id="dbIntro"></div>

    <div id="dbtree" class="dtree">
      <div id="dbtreePath" class="dtree-path"></div>
      <div id="dbtreeStage" class="dtree-stage"></div>
      <div class="dtree-controls">
        <button id="dbtreeBack" class="btn" type="button">← 上一步</button>
        <button id="dbtreeRestart" class="btn" type="button">重新開始</button>
        <button id="dbtreeTableBtn" class="btn" type="button">看資料庫總表</button>
      </div>
    </div>
    <div id="dbtreeSummary" class="dtree-map" hidden></div>
  </section>

  <!-- ===================== TAB 3 · Bias ===================== -->
  <section class="sa-panel" id="paneBias" hidden>
    <h2 class="sa-h2">Bias：這些研究各中了哪些偏誤？</h2>
    <div class="sa-scenario">同一個故事的延伸：先評讀小賴醫師<b>最初那一版</b>（第 1 題），再看幾個變形。每題勾出你認為<b>存在</b>的偏誤，按「對答案」看研究者哪裡跌倒、又該怎麼爬起來。</div>
    <div id="biasIntro"></div>
    <div id="biasGame"></div>
  </section>

  <!-- ===================== TAB 4 · Method ===================== -->
  <section class="sa-panel" id="paneMethods" hidden>
    <h2 class="sa-h2">Method：小賴醫師的問題，該用哪種設計？</h2>
    <div class="sa-scenario">收尾：小賴醫師想<b>正確</b>回答「藥物X 用 vs 不用，誰活得久？」。這是一個「暴露隨時間開關、要避免不死時間」的問題 → 順著樹點下去，你會落在<b>時變暴露 / 主動對照新使用者 / CCW</b> 這一類「錨定暴露起始、對齊 Time Zero」的設計。試試看樹會不會帶你到同樣的答案。</div>
    <p class="caption">建構在藥物流行病學的「錨點（anchor）」取向上，把<b>常見研究設計</b>與<b>工具箱的方法</b>合進<b>同一棵可點擊的樹</b>。順著你的研究情境一題一題點下去，最後會落在最適合的建議，並可打開<b>完整流程圖</b>。<b>✓</b>＝完整工具箱有教學（另開分頁）；<b>↗</b>＝延伸設計，供參考。</p>

    <div id="mtIntro"></div>

    <div class="flow-legend">
      <span><b>✓</b> 完整工具箱有教學（可點擊前往）</span>
      <span><b>↗</b> 其他延伸設計，供參考</span>
    </div>

    <div id="dtree" class="dtree">
      <div id="dtreePath" class="dtree-path"></div>
      <div id="dtreeStage" class="dtree-stage"></div>
      <div class="dtree-controls">
        <button id="dtreeBack" class="btn" type="button">← 上一步</button>
        <button id="dtreeRestart" class="btn" type="button">重新開始</button>
        <button id="dtreeFullmap" class="btn" type="button">看完整流程圖</button>
      </div>
    </div>
    <div id="dtreeMap" class="dtree-map" hidden></div>
  </section>

  <p class="sa-foot">所有內建資料皆為純屬虛構的合成示範資料；「藥物X」是通用代稱、非真實產品。</p>

</div>

<script>
/* ---------- Chinese-only teaching site (no language toggle) ---------- */
var _lang = "zh";
function lang() {{ return _lang; }}
function tr(zh, en) {{ return zh; }}
function applyLang() {{ document.documentElement.lang = "zh-Hant"; }}

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
renderDbIntro();
renderBiasIntro();
renderMethodIntro();

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
