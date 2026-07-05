"use strict";

const API = "";  // same origin
const state = {
  source: null, columns: [], numeric: [],
  // remembered inputs/outputs so a language switch can re-render
  lastReq: null, nlData: null, fbData: null, cmpDone: false,
};
const tr = (zh, en) => window.IV.tr(zh, en);
const lang = () => window.IV.lang;

// ----- navigation: method dropdown + sub-tabs -----
const METHOD_PREFIX = { iv: "", rdd: "rdd", did: "did", tit: "tit", its: "its", perr: "perr", ccw: "ccw", cctc: "cctc", seq: "seq", cc: "cc", sccs: "sccs", acnu: "acnu", pnu: "pnu", nc: "nc", med: "med", ps: "ps", tmle: "tmle", gm: "gm", tnd: "tnd", pssa: "pssa", tscan: "tscan", wce: "wce", transport: "transport", extctrl: "extctrl", srma: "srma", nma: "nma", gbtm: "gbtm", miss: "miss", causalml: "causalml", evalue: "evalue", mr: "mr", dt: "dt", mcda: "mcda", fsqca: "fsqca", babe: "babe", wetlab: "wetlab" };
const PANEL_INIT = {
  play: () => refreshPlay(), ml: () => initMl(),
  rddplay: () => initRdd(), rddanalyze: () => initRddAnalyze(),
  rddassume: () => initRddAssume(), rddml: () => initRddMl(),
  didlearn: () => initDidLearn(), didplay: () => initDidPlay(), didanalyze: () => initDidAnalyze(),
  didassume: () => initDidAssume(), didml: () => initDidMl(),
  titlearn: () => initTitLearn(), titplay: () => initTitPlay(),
  titanalyze: () => initTitAnalyze(), titassume: () => initTitAssume(),
  itslearn: () => initItsLearn(), itsplay: () => initItsPlay(), itsanalyze: () => initItsAnalyze(),
  itsassume: () => initItsAssume(), itsml: () => initItsMl(),
  perrlearn: () => initPerrLearn(), perrplay: () => initPerrPlay(), perranalyze: () => initPerrAnalyze(),
  perrassume: () => initPerrAssume(), perrml: () => initPerrMl(),
  ccwlearn: () => initCcwLearn(), ccwplay: () => initCcwPlay(), ccwanalyze: () => initCcwAnalyze(),
  ccwassume: () => initCcwAssume(), ccwml: () => initCcwMl(),
  cctclearn: () => initCctcLearn(), cctcplay: () => initCctcPlay(), cctcanalyze: () => initCctcAnalyze(),
  cctcassume: () => initCctcAssume(), cctcml: () => initCctcMl(),
  seqlearn: () => initSeqLearn(), seqplay: () => initSeqPlay(), seqanalyze: () => initSeqAnalyze(),
  seqassume: () => initSeqAssume(), seqml: () => initSeqMl(),
  cclearn: () => initCcLearn(), ccplay: () => initCcPlay(), ccanalyze: () => initCcAnalyze(),
  ccassume: () => initCcAssume(), ccml: () => initCcMl(),
  sccslearn: () => initSccsLearn(), sccsplay: () => initSccsPlay(), sccsanalyze: () => initSccsAnalyze(),
  sccsassume: () => initSccsAssume(), sccsml: () => initSccsMl(),
  acnulearn: () => initAcnuLearn(), acnuplay: () => initAcnuPlay(), acnuanalyze: () => initAcnuAnalyze(),
  acnuassume: () => initAcnuAssume(), acnuml: () => initAcnuMl(),
  pnulearn: () => initPnuLearn(), pnuplay: () => initPnuPlay(), pnuanalyze: () => initPnuAnalyze(),
  pnuassume: () => initPnuAssume(), pnuml: () => initPnuMl(),
  nclearn: () => initNcLearn(), ncplay: () => initNcPlay(), ncanalyze: () => initNcAnalyze(),
  ncassume: () => initNcAssume(), ncml: () => initNcMl(),
  medlearn: () => initMedLearn(), medplay: () => initMedPlay(), medanalyze: () => initMedAnalyze(),
  medassume: () => initMedAssume(), medml: () => initMedMl(),
  pslearn: () => initPsLearn(), psplay: () => initPsPlay(), psanalyze: () => initPsAnalyze(),
  psassume: () => initPsAssume(), psml: () => initPsMl(),
  gmlearn: () => initGmLearn(), gmplay: () => initGmPlay(), gmanalyze: () => initGmAnalyze(),
  gmassume: () => initGmAssume(), gmml: () => initGmMl(),
  tndlearn: () => initTndLearn(), tndplay: () => initTndPlay(), tndanalyze: () => initTndAnalyze(),
  tndassume: () => initTndAssume(), tndml: () => initTndMl(),
  pssalearn: () => initPssaLearn(), pssaplay: () => initPssaPlay(), pssaanalyze: () => initPssaAnalyze(),
  pssaassume: () => initPssaAssume(), pssaml: () => {},
  tscanlearn: () => initTscanLearn(), tscanplay: () => initTscanPlay(), tscananalyze: () => initTscanAnalyze(),
  tscanassume: () => initTscanAssume(), tscanml: () => {},
  wcelearn: () => initWceLearn(), wceplay: () => initWcePlay(), wceanalyze: () => initWceAnalyze(),
  wceassume: () => initWceAssume(), wceml: () => {},
  tmlelearn: () => initTmleLearn(), tmleplay: () => initTmlePlay(), tmleanalyze: () => initTmleAnalyze(),
  tmleassume: () => initTmleAssume(), tmleml: () => initTmleMl(),
  whatif: () => drawWhatifPair("iv"), rddwhatif: () => drawWhatifPair("rdd"), didwhatif: () => drawWhatifPair("did"),
  perrwhatif: () => drawWhatifPair("perr"), itswhatif: () => drawWhatifPair("its"), titwhatif: () => drawWhatifPair("tit"),
  ccwwhatif: () => drawWhatifPair("ccw"), seqwhatif: () => drawWhatifPair("seq"), cctcwhatif: () => drawWhatifPair("cctc"),
  ccwhatif: () => drawWhatifPair("cc"), sccswhatif: () => drawWhatifPair("sccs"), acnuwhatif: () => drawWhatifPair("acnu"),
  pnuwhatif: () => drawWhatifPair("pnu"), ncwhatif: () => drawWhatifPair("nc"),
  medwhatif: () => drawWhatifPair("med"), pswhatif: () => drawWhatifPair("ps"),
  tmlewhatif: () => drawWhatifPair("tmle"), gmwhatif: () => drawWhatifPair("gm"), tndwhatif: () => drawWhatifPair("tnd"),
  pssawhatif: () => drawWhatifPair("pssa"), tscanwhatif: () => drawWhatifPair("tscan"),
  wcewhatif: () => drawWhatifPair("wce"),
  transportlearn: () => initTransportLearn(), transportplay: () => initTransportPlay(), transportanalyze: () => initTransportAnalyze(),
  transportassume: () => initTransportAssume(), transportml: () => {},
  transportwhatif: () => drawWhatifPair("transport"),
  extctrllearn: () => initExtctrlLearn(), extctrlplay: () => initExtctrlPlay(), extctrlanalyze: () => initExtctrlAnalyze(),
  extctrlassume: () => initExtctrlAssume(), extctrlml: () => {},
  extctrlwhatif: () => drawWhatifPair("extctrl"),
  srmaplay: () => initSrma(), nmaplay: () => initNma(), gbtmplay: () => initGbtm(),
  missplay: () => initMiss(), causalmlplay: () => initCausalml(),
  evalueplay: () => { initEvaluePlay(); initEvalueArray(); },
  mrplay: () => initMr(), dtplay: () => initDt(),
  mcdaplay: () => initMcda(), fsqcaplay: () => initFsqca(), babeplay: () => initBabe(), wetlabplay: () => initWetlab(),
  home: () => initHome(), glossary: () => initGlossary(),
  choose: () => initChoose(),
};
let curMethod = "iv", curSub = "learn";
const methodSelect = document.getElementById("methodSelect");
const subtabBtns = [...document.querySelectorAll(".subtab")];
const subtabsRow = document.querySelector(".subtabs");
const chooseTab = document.getElementById("chooseTab");
const flowTab = document.getElementById("flowTab");
const dataTab = document.getElementById("dataTab");
const homeTab = document.getElementById("homeTab");
const glossaryTab = document.getElementById("glossaryTab");
const cbookTab = document.getElementById("cbookTab");
// The ①–⑥ sub-tabs only apply to the 24 per-method panels. Hide them on the
// standalone pages (topics, 怎麼選, 資料庫) so a stray click can't jump to a method.
function setSubtabs(show) { if (subtabsRow) subtabsRow.style.display = show ? "" : "none"; }
// No standalone single-page topics remain — every dropdown entry is now a full
// method with the ①–⑥ sub-tabs. TOPICS is kept (empty) so the legacy openTopic /
// #topic= paths stay harmless no-ops.
const TOPICS = {};

function showPanel(panelId) {
  document.querySelectorAll(".panel").forEach((x) => x.classList.remove("active"));
  const el = document.getElementById(panelId);
  if (el) el.classList.add("active");
  if (PANEL_INIT[panelId]) PANEL_INIT[panelId]();
  if (el) labelCharts(el);
  window.scrollTo(0, 0);
}
// Accessibility: give each chart container a screen-reader label drawn from its
// caption / nearest heading (charts are otherwise opaque <div>s to assistive tech).
function labelCharts(panel) {
  panel.querySelectorAll(".chart").forEach((c) => {
    let label = "";
    const cap = c.nextElementSibling;
    if (cap && cap.classList && cap.classList.contains("caption")) label = cap.textContent.trim();
    if (!label) { let p = c.previousElementSibling; while (p && !/^H[1-4]$/.test(p.tagName || "")) p = p.previousElementSibling; if (p) label = p.textContent.trim(); }
    if (!label) { const h = panel.querySelector("h1"); if (h) label = h.textContent.trim(); }
    c.setAttribute("role", "img");
    if (label) c.setAttribute("aria-label", label.slice(0, 160));
  });
}
// ---- Deep-linking ----------------------------------------------------------
// Reflect the active view in the URL hash so it is shareable and survives a
// reload. Forms: #m=ccw&t=assume (method + sub-tab), #topic=miss, #choose, #db.
// replaceState keeps the back-stack clean; _suppressHash guards the
// read → navigate → write loop. The initial applyHash() runs at end of file,
// after every module-level const (EVALUE_METHODS, gotoMethod, …) is initialised.
const HASH_SUBS = ["learn", "play", "analyze", "assume", "ml", "whatif"];
let _suppressHash = false;
function setHash(h) {
  if (_suppressHash) return;
  if (location.hash === h) return;
  try { history.replaceState(null, "", h || (location.pathname + location.search)); }
  catch (e) { /* file:// or sandbox — ignore */ }
}
function applyHash() {
  const raw = (location.hash || "").replace(/^#/, "");
  if (!raw) return false;
  _suppressHash = true;
  try {
    if (raw === "home") { showHome(); return true; }
    if (raw === "glossary") { showGlossary(); return true; }
    if (raw === "cbook") { showCbook(); return true; }
    if (raw === "flow") { if (flowTab) flowTab.click(); return true; }
    if (raw === "choose") { chooseTab.click(); return true; }
    if (raw === "db") { if (dataTab) { dataTab.click(); return true; } return false; }
    const p = new URLSearchParams(raw);
    if (p.has("topic") && TOPICS[p.get("topic")]) { openTopic(p.get("topic")); return true; }
    if (p.has("m") && METHOD_PREFIX[p.get("m")] !== undefined) {
      const t = p.get("t"); gotoMethod(p.get("m"), HASH_SUBS.includes(t) ? t : "learn"); return true;
    }
  } finally { _suppressHash = false; }
  return false;
}

// Home / overview landing page: a searchable grid of every method (built from
// the dropdown <option>s, so it stays in sync). Doubles as method search.
function initHome() {
  const grid = document.getElementById("homeGrid");
  if (!grid || !methodSelect) return;
  grid.innerHTML = [...methodSelect.options].map((o) => {
    const txt = o.textContent.trim();
    const sep = txt.indexOf("·");
    const abbr = sep >= 0 ? txt.slice(0, sep).trim() : txt;
    const name = sep >= 0 ? txt.slice(sep + 1).trim() : "";
    const search = (o.value + " " + txt + " " + (o.dataset.en || "")).toLowerCase();
    return `<button class="home-card" data-m="${o.value}" data-search="${search.replace(/"/g, "")}">` +
           `<span class="hc-abbr">${abbr}</span><span class="hc-name">${name}</span></button>`;
  }).join("");
  grid.onclick = (e) => { const c = e.target.closest(".home-card"); if (c) gotoMethod(c.dataset.m); };
  const inp = document.getElementById("homeSearch");
  if (inp) {
    const apply = () => { const q = inp.value.trim().toLowerCase();
      grid.querySelectorAll(".home-card").forEach((c) => { c.style.display = c.dataset.search.includes(q) ? "" : "none"; }); };
    inp.oninput = apply; apply();
  }
}
function showHome() {
  subtabBtns.forEach((x) => x.classList.remove("active"));
  setSubtabs(false);
  chooseTab.classList.remove("active"); if (flowTab) flowTab.classList.remove("active");
  if (dataTab) dataTab.classList.remove("active");
  if (glossaryTab) glossaryTab.classList.remove("active");
  if (homeTab) homeTab.classList.add("active");
  showPanel("home");
  if (typeof filterRefs === "function") filterRefs("choose");   // hide the per-method refs/citation block
  setHash("");
}
if (homeTab) homeTab.addEventListener("click", showHome);

// Glossary: one page collecting every .tdef term definition across the toolbox
// (deduped by term, sorted, searchable). Rebuilt on language toggle.
function initGlossary() {
  const list = document.getElementById("glossaryList"); if (!list) return;
  const seen = new Set(), items = [];
  document.querySelectorAll(".tdef").forEach((d) => {
    const h4 = d.querySelector("h4"), p = d.querySelector("p");
    if (!h4 || !p) return;
    const en = h4.querySelector(".en");
    const term = (en ? h4.textContent.replace(en.textContent, "") : h4.textContent).trim();
    const sub = en ? en.textContent.trim() : "";
    const key = term.toLowerCase();
    if (!term || seen.has(key)) return; seen.add(key);
    items.push({ term, sub, def: p.textContent.trim() });
  });
  items.sort((a, b) => a.term.localeCompare(b.term, "zh-Hant"));
  list.innerHTML = items.map((it) =>
    `<div class="gloss-item" data-search="${(it.term + " " + it.sub + " " + it.def).toLowerCase().replace(/"/g, "")}">` +
    `<h4>${it.term}${it.sub ? ` <span class="en">${it.sub}</span>` : ""}</h4><p>${it.def}</p></div>`).join("");
  const inp = document.getElementById("glossarySearch");
  if (inp) { const apply = () => { const q = inp.value.trim().toLowerCase();
    list.querySelectorAll(".gloss-item").forEach((x) => { x.style.display = x.dataset.search.includes(q) ? "" : "none"; }); };
    inp.oninput = apply; apply(); }
}
function showGlossary() {
  subtabBtns.forEach((x) => x.classList.remove("active"));
  setSubtabs(false);
  chooseTab.classList.remove("active"); if (flowTab) flowTab.classList.remove("active");
  if (dataTab) dataTab.classList.remove("active");
  if (homeTab) homeTab.classList.remove("active");
  if (glossaryTab) glossaryTab.classList.add("active");
  showPanel("glossary");
  if (typeof filterRefs === "function") filterRefs("choose");
  setHash("#glossary");
}
if (glossaryTab) glossaryTab.addEventListener("click", showGlossary);

// ---- What If book notes (password-gated, AES-GCM via WebCrypto) --------------
// The chapter notes ship ONLY as ciphertext (CBOOK_ENC). A static site can't
// truly authenticate, but real encryption means the plaintext is not in the
// source at all: the correct password derives the key and decrypts; a wrong one
// simply fails the GCM auth tag. CBOOK_ENC is generated once with cbEncrypt().
const CBOOK_ENC = "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";   // base64( salt[16] | iv[12] | AES-GCM ciphertext )

function _b64ToBytes(b64) { const s = atob(b64); const a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }
function _bytesToB64(bytes) { let s = ""; const a = new Uint8Array(bytes); for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); }
async function _cbKey(password, salt) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
async function cbEncrypt(password, plaintext) {     // used once to generate CBOOK_ENC
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await _cbKey(password, salt);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));
  const out = new Uint8Array(28 + ct.byteLength); out.set(salt, 0); out.set(iv, 16); out.set(new Uint8Array(ct), 28);
  return _bytesToB64(out);
}
async function cbDecrypt(password, b64) {
  const raw = _b64ToBytes(b64);
  const key = await _cbKey(password, raw.slice(0, 16));
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: raw.slice(16, 28) }, key, raw.slice(28));
  return new TextDecoder().decode(pt);              // throws on wrong password
}

let _cbUnlocked = null;   // decrypted HTML once unlocked (kept for this session)
function _cbReveal(html) {
  const body = document.getElementById("cbBody");
  const gate = document.getElementById("cbGate");
  if (!body) return;
  body.innerHTML = html;
  body.hidden = false;
  if (gate) gate.hidden = true;
  if (window.IV && typeof IV.setLang === "function") IV.setLang(IV.lang);   // translate injected content
}
async function _cbTryUnlock() {
  const inp = document.getElementById("cbPass");
  const msg = document.getElementById("cbMsg");
  if (!inp || !inp.value) return;
  msg.className = "cb-msg"; msg.textContent = tr("解鎖中…", "Unlocking…");
  try {
    const html = await cbDecrypt(inp.value, CBOOK_ENC);
    _cbUnlocked = html;
    try { sessionStorage.setItem("cbook", html); } catch (e) {}
    _cbReveal(html);
  } catch (e) {
    msg.className = "cb-msg err"; msg.textContent = tr("密碼錯誤，請再試一次。", "Wrong password, try again.");
    inp.select();
  }
}
function showCbook() {
  subtabBtns.forEach((x) => x.classList.remove("active"));
  setSubtabs(false);
  chooseTab.classList.remove("active"); if (flowTab) flowTab.classList.remove("active");
  if (dataTab) dataTab.classList.remove("active");
  if (homeTab) homeTab.classList.remove("active");
  if (glossaryTab) glossaryTab.classList.remove("active");
  if (cbookTab) cbookTab.classList.add("active");
  showPanel("cbook");
  setHash("#cbook");
  if (_cbUnlocked) _cbReveal(_cbUnlocked);   // stay unlocked while navigating away and back
}
if (cbookTab) cbookTab.addEventListener("click", showCbook);
(function _cbInit() {
  const enter = document.getElementById("cbEnter");
  const inp = document.getElementById("cbPass");
  if (enter) enter.addEventListener("click", _cbTryUnlock);
  if (inp) inp.addEventListener("keydown", (e) => { if (e.key === "Enter") _cbTryUnlock(); });
  try { const cached = sessionStorage.getItem("cbook"); if (cached) _cbUnlocked = cached; } catch (e) {}
})();

// ---- Self-check quiz ----------------------------------------------------------
// Data-driven multiple-choice questions, rendered as a collapsible card at the end
// of a method's ① learn panel. Extensible: add a QUIZ[method] entry for any method.
const QUIZ = {
  iv: [{ q: { zh: "工具變數最關鍵、<b>無法用資料檢驗</b>的假設是哪一個？", en: "Which is IV's key assumption that <b>cannot be tested from data</b>?" },
    options: [{ zh: "排除限制（工具只透過暴露影響結果）", en: "Exclusion (the instrument affects the outcome only through the exposure)" },
              { zh: "工具與暴露相關", en: "The instrument is correlated with the exposure" },
              { zh: "樣本要夠大", en: "A large enough sample" }],
    answer: 0, explain: { zh: "排除限制無法檢驗；工具強度（與暴露相關）反而可檢，看第一階段 F>10。", en: "Exclusion is untestable; instrument strength (correlation with exposure) IS checkable via the first-stage F>10." } }],
  rdd: [{ q: { zh: "RDD 的因果效果是在<b>哪裡</b>被識別的？", en: "<b>Where</b> does RDD identify the causal effect?" },
    options: [{ zh: "整個族群", en: "The whole population" }, { zh: "切點附近", en: "Right around the cutoff" }, { zh: "分數最高的人", en: "The highest-scoring people" }],
    answer: 1, explain: { zh: "RDD 只在切點附近識別 LATE；離切點越遠越靠外推、越不可信。", en: "RDD identifies a LATE only near the cutoff; away from it you are extrapolating." } }],
  did: [{ q: { zh: "DiD 最關鍵、事後不可檢驗的假設是？", en: "DiD's key (post-period untestable) assumption is?" },
    options: [{ zh: "平行趨勢", en: "Parallel trends" }, { zh: "隨機分派", en: "Randomisation" }, { zh: "無測量誤差", en: "No measurement error" }],
    answer: 0, explain: { zh: "平行趨勢，沒政策時兩組會一起變；用事前趨勢（事件研究）佐證但無法證明。", en: "Parallel trends — absent the policy the groups move together; supported by pre-trends but not provable." } }],
  its: [{ q: { zh: "單組 ITS 把<b>什麼</b>當作反事實？", en: "What does a single-group ITS use as the counterfactual?" },
    options: [{ zh: "介入前趨勢的外推", en: "The extrapolated pre-intervention trend" }, { zh: "一個對照組", en: "A control group" }, { zh: "隨機化", en: "Randomisation" }],
    answer: 0, explain: { zh: "用介入前趨勢外推當「沒介入會怎樣」；要小心同時發生的其他事件。", en: "It extrapolates the pre-trend as 'what if no intervention'; beware coincident events." } }],
  ps: [{ q: { zh: "傾向分數<b>平衡得好不好</b>，應該看？", en: "How do you judge whether a propensity score <b>balanced</b> the groups?" },
    options: [{ zh: "共變項的標準化差異 SMD（<0.1）", en: "The covariates' standardized mean difference (SMD < 0.1)" },
              { zh: "PS 模型的判別力 AUC", en: "The PS model's discrimination (AUC)" },
              { zh: "p 值", en: "The p-value" }],
    answer: 0, explain: { zh: "看校正後共變項的 SMD，不是 PS 預測得準不準；高 AUC 不代表平衡好。", en: "Check covariate SMD after weighting, not how well the PS predicts treatment; high AUC ≠ good balance." } }],
  sccs: [{ q: { zh: "SCCS 用<b>什麼</b>當對照？", en: "What serves as the control in SCCS?" },
    options: [{ zh: "同一個人的其他時間", en: "The same person's other time" }, { zh: "別的人", en: "Other people" }, { zh: "隨機分組", en: "A randomised group" }],
    answer: 0, explain: { zh: "自身對照，條件在「人」，所有時間不變因子相消；需事件不改變後續暴露機率。", en: "Person-as-own-control — conditioning on the person cancels all time-fixed factors; needs events not to change later exposure." } }],
  tnd: [{ q: { zh: "陰性檢驗設計（TND）主要想消除哪種偏誤？", en: "Which bias does the test-negative design mainly remove?" },
    options: [{ zh: "就醫／檢驗傾向", en: "Care-seeking / testing propensity" }, { zh: "回憶偏誤", en: "Recall bias" }, { zh: "發表偏誤", en: "Publication bias" }],
    answer: 0, explain: { zh: "對照取「來檢驗卻陰性」者，讓就醫傾向相對接種非差別；VE = 1 − OR。", en: "Tested-but-negative controls make care-seeking non-differential w.r.t. vaccination; VE = 1 − OR." } }],
  ccw: [{ q: { zh: "Clone-censor-weight 主要解決什麼問題？", en: "What problem does clone-censor-weight mainly solve?" },
    options: [{ zh: "不死時間偏誤（immortal-time）", en: "Immortal-time bias" }, { zh: "缺失資料", en: "Missing data" }, { zh: "多重比較", en: "Multiple comparisons" }],
    answer: 0, explain: { zh: "把每人複製到各策略臂、對人為設限做 IPCW、對齊時間零點，避免 immortal-time bias。", en: "Clone into each strategy arm, IPCW the artificial censoring, align time zero — avoiding immortal-time bias." } }],
};
function renderQuiz(method) {
  const panel = document.getElementById((METHOD_PREFIX[method] || "") + "learn");
  if (!panel) return;
  const old = panel.querySelector(".quiz"); if (old) old.remove();   // rebuild (e.g. after a language switch)
  const qs = QUIZ[method]; if (!qs || !qs.length) return;
  const card = document.createElement("div");
  card.className = "quiz card";
  card.innerHTML = `<h3>${tr("自我測驗", "Self-check")}</h3>` + qs.map((it) =>
    `<div class="quiz-q" data-a="${it.answer}">` +
    `<p class="quiz-prompt">${tr(it.q.zh, it.q.en)}</p>` +
    `<div class="quiz-opts">` + it.options.map((o, i) =>
      `<button type="button" class="quiz-opt" data-i="${i}">${tr(o.zh, o.en)}</button>`).join("") + `</div>` +
    `<p class="quiz-explain" hidden>${tr(it.explain.zh, it.explain.en)}</p></div>`).join("");
  card.addEventListener("click", (e) => {
    const opt = e.target.closest(".quiz-opt"); if (!opt) return;
    const q = opt.closest(".quiz-q"); const ans = +q.dataset.a, i = +opt.dataset.i;
    q.querySelectorAll(".quiz-opt").forEach((b, j) => {
      if (j === ans) b.classList.add("correct");
      if (j === i && i !== ans) b.classList.add("wrong");
    });
    const ex = q.querySelector(".quiz-explain"); if (ex) ex.hidden = false;
  });
  panel.appendChild(card);
}

function openTopic(key) {
  const t = TOPICS[key]; if (!t) return;
  if (homeTab) homeTab.classList.remove("active");
  if (glossaryTab) glossaryTab.classList.remove("active");
  subtabBtns.forEach((x) => x.classList.remove("active"));
  setSubtabs(false);
  chooseTab.classList.remove("active"); if (flowTab) flowTab.classList.remove("active");
  if (dataTab) dataTab.classList.remove("active");
  if (methodSelect) methodSelect.value = key;
  showPanel(t.panel);
  if (t.init) t.init();
  if (typeof filterRefs === "function") filterRefs(t.ref);
  setHash("#topic=" + key);
}
function showMethodSub() {
  if (methodSelect.value !== curMethod) methodSelect.value = curMethod;  // resync dropdown if we came from a topic panel
  setSubtabs(true);
  if (homeTab) homeTab.classList.remove("active");
  if (glossaryTab) glossaryTab.classList.remove("active");
  chooseTab.classList.remove("active"); if (flowTab) flowTab.classList.remove("active");
  if (dataTab) dataTab.classList.remove("active");
  subtabBtns.forEach((b) => { const on = b.dataset.sub === curSub; b.classList.toggle("active", on); b.setAttribute("aria-selected", on ? "true" : "false"); });
  showPanel(METHOD_PREFIX[curMethod] + curSub);
  if (curSub === "learn") renderQuiz(curMethod);            // ①: optional self-check quiz
  if (curSub === "analyze") renderDataPreview(curMethod);   // ③: show the real data rows on top
  if (curSub === "assume" && EVALUE_METHODS.includes(curMethod)) ensureEvalueCard(curMethod);  // ④: E-value sensitivity
  if (typeof filterRefs === "function") filterRefs(curMethod);
  setHash("#m=" + curMethod + "&t=" + curSub);
}
methodSelect.addEventListener("change", () => {
  const v = methodSelect.value;
  if (TOPICS[v]) { openTopic(v); return; }   // standalone teaching topics (miss / SR-MA / NMA)
  curMethod = v; showMethodSub();
});
subtabBtns.forEach((b) => b.addEventListener("click", () => {
  if (subtabsRow && subtabsRow.style.display === "none") return;  // ignore clicks while on a topic / choose / db page
  curSub = b.dataset.sub; showMethodSub();
}));
if (flowTab) flowTab.addEventListener("click", () => {
  subtabBtns.forEach((x) => x.classList.remove("active"));
  setSubtabs(false);
  if (homeTab) homeTab.classList.remove("active");
  if (glossaryTab) glossaryTab.classList.remove("active");
  if (dataTab) dataTab.classList.remove("active");
  chooseTab.classList.remove("active");
  flowTab.classList.add("active");
  showPanel("flow");
  if (typeof filterRefs === "function") filterRefs("all");
  setHash("#flow");
});
chooseTab.addEventListener("click", () => {
  subtabBtns.forEach((x) => x.classList.remove("active"));
  setSubtabs(false);
  if (homeTab) homeTab.classList.remove("active");
  if (glossaryTab) glossaryTab.classList.remove("active");
  if (dataTab) dataTab.classList.remove("active");
  if (flowTab) flowTab.classList.remove("active");
  chooseTab.classList.add("active");
  showPanel("choose");
  if (typeof filterRefs === "function") filterRefs("choose");
  setHash("#choose");
});
if (dataTab) dataTab.addEventListener("click", () => {
  subtabBtns.forEach((x) => x.classList.remove("active"));
  setSubtabs(false);
  if (homeTab) homeTab.classList.remove("active");
  if (glossaryTab) glossaryTab.classList.remove("active");
  chooseTab.classList.remove("active"); if (flowTab) flowTab.classList.remove("active");
  dataTab.classList.add("active");
  showPanel("dbpanel");
  if (typeof filterRefs === "function") filterRefs("db");
  setHash("#db");
});
window.addEventListener("hashchange", applyHash);
// Delegated handler for in-content cross links (.xref) — survives i18n innerHTML swaps.
// <a class="xref" data-m="sccs">SCCS</a> → go to that method; data-tab="db" → Databases tab.
document.addEventListener("click", (e) => {
  // In-page section nav (chips on the SR-MA / NMA topic pages): smooth-scroll
  // to the target heading without writing the hash to the URL.
  const toc = e.target.closest && e.target.closest("a.toc-link");
  if (toc) {
    e.preventDefault();
    const t = document.getElementById((toc.getAttribute("href") || "").slice(1));
    const _rm = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (t) t.scrollIntoView({ behavior: _rm ? "auto" : "smooth", block: "start" });
    return;
  }
  const a = e.target.closest && e.target.closest("a.xref");
  if (!a) return;
  e.preventDefault();
  if (a.dataset.m) gotoMethod(a.dataset.m, "learn");
  else if (a.dataset.tab === "db" && dataTab) dataTab.click();
  else if (a.dataset.tab === "choose") chooseTab.click();
  else if (a.dataset.tab === "flow" && flowTab) flowTab.click();
  else if (TOPICS[a.dataset.tab]) openTopic(a.dataset.tab);
});


// Auto-link method abbreviations inside every panel's prose / tables, so the
// methods cross-link to each other. Links the FIRST occurrence of each token
// per block, skips the panel's own method, code/charts/decision-tree, and
// already-linked text. Re-run after each language switch (applyStatic wipes them).
const _MLINK = { SCCS: "sccs", CCTC: "cctc", ACNU: "acnu", PNU: "pnu", CCW: "ccw",
  RDD: "rdd", DiD: "did", PERR: "perr", ITS: "its", TiT: "tit", Seq: "seq",
  MED: "med", NC: "nc", CC: "cc", IV: "iv", PS: "ps", TMLE: "tmle", "G-methods": "gm", TND: "tnd", PSSA: "pssa", TreeScan: "tscan", WCE: "wce", Transportability: "transport" };
// note: "External control" is multi-word; autolinked via the table/dropdown, not _MLINK regex.
const _MTOKENS = Object.keys(_MLINK).sort((a, b) => b.length - a.length);
const _MRE = new RegExp("\\b(" + _MTOKENS.join("|") + ")\\b", "g");
function _panelMethod(id) {
  const subs = ["learn", "play", "analyze", "assume", "ml", "whatif"];
  for (const sub of subs) { if (id.endsWith(sub)) { const pre = id.slice(0, -sub.length); return pre === "" ? "iv" : pre; } }
  return null;
}
function autolinkMethods() {
  document.querySelectorAll(".panel").forEach((panel) => {
    const owner = _panelMethod(panel.id);
    panel.querySelectorAll("p, td, li, h1, h2, h3, h4, summary").forEach((block) => {
      if (block.closest("#dtree, #dtreeMap, .chart, a, code, pre")) return;
      const seen = new Set();
      const tw = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          if (!n.nodeValue) return NodeFilter.FILTER_REJECT;
          let p = n.parentNode;
          while (p && p !== block) { const t = p.tagName; if (t === "A" || t === "CODE" || t === "PRE") return NodeFilter.FILTER_REJECT; p = p.parentNode; }
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      const tns = []; while (tw.nextNode()) tns.push(tw.currentNode);
      tns.forEach((node) => {
        const s = node.nodeValue; _MRE.lastIndex = 0;
        if (!_MRE.test(s)) return; _MRE.lastIndex = 0;
        const frag = document.createDocumentFragment(); let last = 0, m;
        while ((m = _MRE.exec(s))) {
          const tok = m[0], to = _MLINK[tok];
          if (seen.has(tok) || to === owner) continue;   // first-per-block, skip self
          seen.add(tok);
          if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
          const a = document.createElement("a"); a.className = "xref"; a.dataset.m = to; a.textContent = tok;
          frag.appendChild(a); last = m.index + tok.length;
        }
        if (last === 0) return;                            // nothing linked → leave node
        if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
        node.parentNode.replaceChild(frag, node);
      });
    });
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autolinkMethods);
else autolinkMethods();

// ----------------------------------------------------------------------
// Code-language switcher (SAS / R / Stata / Python). Every ③ code card is
// tagged data-lang in index.html; this injects a per-section toggle bar above
// the first code card and shows only the chosen language (with a graceful
// fallback: if a section has no card for that language, all its code shows).
// ----------------------------------------------------------------------
const CLANG_LABELS = { sas: "SAS", r: "R", stata: "Stata", python: "Python" };
const CLANG_ORDER = ["sas", "r", "stata", "python"];
function applyCodeLang(lang) {
  try { localStorage.setItem("phdc-clang", lang); } catch (e) {}
  document.querySelectorAll(".clang-btn").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  document.querySelectorAll(".panel, section").forEach((sec) => {
    const cards = sec.querySelectorAll(".card[data-lang]");
    if (!cards.length) return;
    const present = new Set(Array.from(cards, (c) => c.dataset.lang));
    const has = present.has(lang);
    cards.forEach((c) => { c.style.display = (!has || c.dataset.lang === lang) ? "" : "none"; });
  });
}
function initCodeSwitchers() {
  let saved = "sas";
  try { saved = localStorage.getItem("phdc-clang") || "sas"; } catch (e) {}
  document.querySelectorAll(".panel, section").forEach((sec) => {
    const first = sec.querySelector(".card[data-lang]");
    if (!first || sec.querySelector(".clang-switch")) return;
    const present = new Set(Array.from(sec.querySelectorAll(".card[data-lang]"), (c) => c.dataset.lang));
    if (present.size < 2) return;                       // only one language here — no toggle needed
    const bar = document.createElement("div");
    bar.className = "clang-switch";
    bar.innerHTML =
      `<span class="clang-label" data-en="Code language:">程式語言：</span>` +
      CLANG_ORDER.filter((k) => present.has(k))
        .map((k) => `<button type="button" class="clang-btn" data-lang="${k}">${CLANG_LABELS[k]}</button>`)
        .join("");
    first.parentNode.insertBefore(bar, first);
    bar.querySelectorAll(".clang-btn").forEach((b) =>
      b.addEventListener("click", () => applyCodeLang(b.dataset.lang)));
  });
  applyCodeLang(saved);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initCodeSwitchers);
else initCodeSwitchers();

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error((await r.json()).detail || r.statusText);
  return r.json();
}
async function postJSON(url, body) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error((await r.json()).detail || r.statusText);
  return r.json();
}
const fmt = (x, d = 2) => (x === null || x === undefined || Number.isNaN(x) ? "–" : Number(x).toFixed(d));

// ----------------------------------------------------------------------
// ③ "What the actual data looks like" — a real data-row table at the top of
// each analyse panel, built from the example endpoint's `columns` + `preview`
// (df.head(8)). The container is created dynamically (no per-method HTML), and
// the rows are cached so re-opening / language-toggling is cheap.
// ----------------------------------------------------------------------
const _previewCache = {};
// Minimal CSV parser — our sample files are plain (no embedded commas/quotes),
// so a line/field split is enough; empty fields stay "" (shown blank).
function _parseCSV(text) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n").filter((l) => l.length);
  if (!lines.length) return { columns: [], rows: [] };
  const columns = lines[0].split(",");
  const rows = lines.slice(1).map((l) => {
    const parts = l.split(",");
    const o = {};
    columns.forEach((c, i) => { o[c] = parts[i] === undefined ? "" : parts[i]; });
    return o;
  });
  return { columns, rows };
}
async function renderDataPreview(method) {
  const prefix = METHOD_PREFIX[method];
  const panel = document.getElementById(prefix + "analyze");
  if (!panel) return;
  let box = document.getElementById(prefix + "analyze_preview");
  if (!box) {
    box = document.createElement("div");
    box.id = prefix + "analyze_preview";
    box.className = "data-preview";
    const h1 = panel.querySelector("h1");
    if (h1) h1.insertAdjacentElement("afterend", box);
    else panel.insertAdjacentElement("afterbegin", box);
  }
  // ③ now reads the SAME downloadable file the SAS/R/Stata code reads:
  // data/<method>_sample.csv (copied to docs/data by build_docs.py). This keeps
  // the preview, the download and the code's column names perfectly in sync.
  let data = _previewCache[method];
  if (!data) {
    try {
      const r = await fetch(`data/${method}_sample.csv`);
      if (!r.ok) throw new Error(r.statusText);
      const text = await r.text();
      data = { csv: text, ..._parseCSV(text) };
      _previewCache[method] = data;
    } catch (e) { box.innerHTML = ""; return; }
  }
  const cols = data.columns || [];
  const rows = (data.rows || []).slice(0, 6);
  if (!cols.length || !rows.length) { box.innerHTML = ""; return; }
  const num = (s) => (s !== "" && s != null && !Number.isNaN(Number(s)));
  const cell = (v) => (num(v) ? (Number.isInteger(Number(v)) ? Number(v) : Math.round(Number(v) * 1000) / 1000)
                       : (v == null ? "" : String(v)));
  const thead = "<tr>" + cols.map((c) => `<th>${c}</th>`).join("") + "</tr>";
  const tbody = rows.map((r) => "<tr>" + cols.map((c) => `<td>${cell(r[c])}</td>`).join("") + "</tr>").join("");
  box.innerHTML =
    `<h3 class="dp-title">${tr("實際資料長什麼樣子（可下載的範例檔前幾列）", "What the actual data looks like (first rows of the downloadable sample file)")}</h3>` +
    `<div class="dp-scroll"><table class="dp-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>` +
    `<p class="caption">${tr("下面 SAS／R／Stata 的程式就直接讀這個檔（" + method + "_sample.csv）跑。純屬合成的示範資料。", "The SAS / R / Stata code below reads exactly this file (" + method + "_sample.csv). Purely synthetic demo data.")}</p>` +
    `<button type="button" class="dl-csv">⬇ ${tr("下載這份範例資料（CSV）", "Download this sample data (CSV)")}</button>`;
  const dl = box.querySelector(".dl-csv");
  if (dl) dl.addEventListener("click", () => {
    const blob = new Blob([data.csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${method}_sample.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });
}

// ----------------------------------------------------------------------
// ④ E-value sensitivity analysis — cross-method. For the designs whose KEY
// untestable assumption is "no unmeasured (time-varying) confounding", add an
// interactive E-value card: how strong would an unmeasured confounder have to be
// (associated with BOTH treatment and outcome) to explain away the result?
// Closed-form, pure JS (VanderWeele & Ding 2017; Haneuse et al. 2019, JAMA).
// ----------------------------------------------------------------------
// E-value now lives in its own standalone method (the "evalue" panels), so it is
// no longer auto-injected into each method's ④ assume tab. Kept as an empty list
// so the existing guards/loops harmlessly no-op.
const EVALUE_METHODS = [];
function _evalue(rr) {                       // E-value of a risk ratio
  rr = (rr > 0 && rr < 1) ? 1 / rr : rr;     // E-value is symmetric: invert protective effects
  if (!(rr > 1)) return 1;
  return rr + Math.sqrt(rr * (rr - 1));
}
// Convert a reported effect to the approximate risk-ratio scale the E-value uses
// (VanderWeele & Ding 2017; Mathur et al. EValue package). Ratio measures:
// RR / rare OR / rare HR ≈ as-is; OR(common)→√OR; HR(common)→(1−0.5^√HR)/(1−0.5^√(1∕HR)).
// Difference measures need one extra input: SMD d→exp(0.91·d); OLS coef→exp(0.91·coef/SD);
// RD→(p0+RD)/p0 using the baseline (unexposed) risk p0.
function _hrToRR(v) { return (1 - Math.pow(0.5, Math.sqrt(v))) / (1 - Math.pow(0.5, Math.sqrt(1 / v))); }
function _toRR(v, measure, extra) {
  switch (measure) {
    case "smd": return Math.exp(0.91 * v);                       // standardized mean diff (d)
    case "ols": { const sd = (extra > 0) ? extra : 1; return Math.exp(0.91 * (v / sd)); }
    case "rd":  { const p0 = (extra > 0 && extra < 1) ? extra : 0.1; const re = p0 + v; return re > 0 ? re / p0 : 1e-4; }
  }
  if (!(v > 0)) return v;                                        // ratio measures below
  if (measure === "or_common" || measure === "or") return Math.sqrt(v);
  if (measure === "hr_common" || measure === "hr") return _hrToRR(v);
  return v;                                                      // rr, or_rare, hr_rare
}
function _evMeasure(card) { const s = card.querySelector(".ev-measure"); return s ? s.value : "rr"; }
function _evExtra(card) { const e = card.querySelector(".ev-extra"); const v = e ? parseFloat(e.value) : NaN; return isFinite(v) ? v : 0; }
// Difference measures need an extra field; show it with the right label, hide otherwise.
function _evSyncExtra(card) {
  const wrap = card.querySelector(".ev-extra-wrap"); if (!wrap) return;
  const m = _evMeasure(card), lab = wrap.querySelector(".ev-extra-label");
  const cfg = {
    rd:  { zh: "未暴露組的基準風險 P₀", en: "Baseline risk in the unexposed (P₀)", val: "0.1" },
    ols: { zh: "結果的標準差 SD", en: "SD of the outcome", val: "1" },
  }[m];
  if (cfg) {
    wrap.style.display = "";
    if (lab) { lab.textContent = cfg.zh; lab.setAttribute("data-en", cfg.en); }
    const inp = card.querySelector(".ev-extra");
    if (inp && (m === "rd") !== (inp.dataset.kind === "rd")) { inp.value = cfg.val; inp.dataset.kind = m; }
  } else {
    wrap.style.display = "none";
  }
}
function _evRecompute(card) {
  const num = (sel, d) => { const v = parseFloat(card.querySelector(sel).value); return isFinite(v) ? v : d; };
  const rawRr = num(".ev-rr", 2), rawCi = num(".ev-ci", 1.4), eu = num(".ev-eu", 2), ud = num(".ev-ud", 2);
  const m = _evMeasure(card), ex = _evExtra(card);
  const rr = _toRR(rawRr, m, ex), ci = _toRR(rawCi, m, ex);   // convert to the approximate RR scale
  card.querySelector(".ev-euv").textContent = eu.toFixed(1);
  card.querySelector(".ev-udv").textContent = ud.toFixed(1);
  const ev = _evalue(rr).toFixed(2), evci = _evalue(ci).toFixed(2);
  card.querySelector(".ev-out").innerHTML = tr(
    `一個未測混淆要<b>同時</b>和「接種」與「結果」各關聯到風險比 ≥ <b>${ev}</b>，才足以把這個效果完全解釋掉（把 RR 推回 1）；只要各關聯 ≥ <b>${evci}</b>，就能把信賴區間推到涵蓋 1（不再顯著）。<b>E-value 越大＝結果越穩</b>，越難被未測混淆推翻。`,
    `An unmeasured confounder would have to be associated with <b>both</b> vaccination and the outcome by a risk ratio ≥ <b>${ev}</b> (each) to fully explain away this effect (push the RR to 1); only ≥ <b>${evci}</b> is needed to push the CI to include 1. <b>A bigger E-value = a more robust result</b> — harder for unmeasured confounding to overturn.`);
  const B = (eu * ud) / (eu + ud - 1);       // Ding–VanderWeele bounding factor
  const adj = rr >= 1 ? rr / B : rr * B;
  const overturned = rr >= 1 ? adj <= 1 : adj >= 1;
  card.querySelector(".ev-verdict").innerHTML = tr(
    `這個強度的混淆（偏誤因子 B＝${B.toFixed(2)}）最多把 RR 從 ${rr} 拉到 <b>${adj.toFixed(2)}</b> → ` +
      (overturned ? `<b style="color:#b91c1c">足以推翻（跨過 1）</b>` : `<b style="color:#1d6f57">仍在 1 的同側，結果存活</b>`),
    `Confounding this strong (bias factor B = ${B.toFixed(2)}) can move the RR from ${rr} only as far as <b>${adj.toFixed(2)}</b> → ` +
      (overturned ? `<b style="color:#b91c1c">enough to overturn it (crosses 1)</b>` : `<b style="color:#1d6f57">still on the same side of 1 — the result survives</b>`));
}
// Standalone E-value method (② interactive). The "explain-away" plot: for a target
// risk ratio R, the (RR_EU, RR_UD) confounder pairs that just push the effect to the
// null satisfy the bounding factor B = R, i.e. RR_UD = R(a−1)/(a−R) for a > R. The
// E-value is where that curve meets the diagonal (RR_EU = RR_UD).
let evaluePlayReady = false;
function drawEvalueChart(card) {
  const el = document.getElementById("evalueChart"); if (!el) return;
  const num = (s, d) => { const v = parseFloat(card.querySelector(s).value); return isFinite(v) ? v : d; };
  const m = _evMeasure(card), ex = _evExtra(card);
  let rr = _toRR(num(".ev-rr", 2), m, ex), ci = _toRR(num(".ev-ci", 1.4), m, ex);   // → approx RR scale
  rr = (rr > 0 && rr < 1) ? 1 / rr : rr;                 // E-value is symmetric
  ci = (ci > 0 && ci < 1) ? 1 / ci : ci;
  const eu = num(".ev-eu", 2), ud = num(".ev-ud", 2);
  const AMAX = Math.max(8, Math.ceil(_evalue(rr)) + 2);
  const curve = (R) => { const x = [], y = []; if (!(R > 1)) return { x, y };
    for (let a = R + 0.02; a <= AMAX; a += 0.04) { const b = R * (a - 1) / (a - R); if (b > 0 && b <= AMAX) { x.push(a); y.push(b); } } return { x, y }; };
  const cRR = curve(rr), cCI = curve(ci), E = _evalue(rr);
  const B = (eu * ud) / (eu + ud - 1), overturns = (rr >= 1) ? (rr / B <= 1) : (rr * B >= 1);
  const traces = [
    { x: cRR.x, y: cRR.y, mode: "lines", name: tr("把估計推到 1 的門檻", "pushes estimate to 1"), line: { color: "#b91c1c", width: 2.5 } },
  ];
  if (cCI.x.length) traces.push({ x: cCI.x, y: cCI.y, mode: "lines", name: tr("把 CI 推到 1", "pushes CI to 1"), line: { color: "#d97706", width: 2, dash: "dot" } });
  traces.push({ x: [E], y: [E], mode: "markers+text", name: "E-value", text: [` E=${E.toFixed(2)}`], textposition: "top right", textfont: { color: "#b91c1c" }, marker: { color: "#b91c1c", size: 11, symbol: "diamond" } });
  traces.push({ x: [eu], y: [ud], mode: "markers", name: tr("你設的混淆", "your confounder"), marker: { color: overturns ? "#b91c1c" : "#1d6f57", size: 14, line: { color: "#fff", width: 1.5 } } });
  Plotly.react(el, traces, sceneLayout({
    height: 360, showlegend: true, legend: { orientation: "h", y: 1.13 },
    xaxis: { title: tr("混淆 ↔ 暴露（RR_EU）", "confounder ↔ exposure (RR_EU)"), range: [1, AMAX], dtick: 1 },
    yaxis: { title: tr("混淆 ↔ 結果（RR_UD）", "confounder ↔ outcome (RR_UD)"), range: [1, AMAX], dtick: 1 },
  }), SCENE_CFG);
}
function initEvaluePlay() {
  const card = document.getElementById("evalueCard"); if (!card) return;
  if (!evaluePlayReady) {
    evaluePlayReady = true;
    card.querySelectorAll("input, select").forEach((inp) => {
      const redraw = () => { _evSyncExtra(card); _evRecompute(card); drawEvalueChart(card); };
      inp.addEventListener("input", redraw); inp.addEventListener("change", redraw);
    });
  }
  _evSyncExtra(card); _evRecompute(card); drawEvalueChart(card);
}
// ⑤ array approach (Schneeweiss 2006): a single binary unmeasured confounder with
// prevalence P1 (exposed) / P0 (unexposed) and outcome RR_CD biases the RR by the
// factor BF = (1+P1(RR_CD−1)) / (1+P0(RR_CD−1)); adjusted RR = observed / BF.
let evalueArrayReady = false;
function refreshEvalueArray() {
  const card = document.getElementById("evalueArrayCard"); if (!card) return;
  const num = (s, d) => { const v = parseFloat(card.querySelector(s).value); return isFinite(v) ? v : d; };
  const rr = num(".ea-rr", 2), p1 = num(".ea-p1", 0.5), p0 = num(".ea-p0", 0.2), cd = num(".ea-cd", 2.5);
  card.querySelector(".ea-rrv").textContent = rr.toFixed(2);
  card.querySelector(".ea-p1v").textContent = p1.toFixed(2);
  card.querySelector(".ea-p0v").textContent = p0.toFixed(2);
  card.querySelector(".ea-cdv").textContent = cd.toFixed(1);
  const bf = (1 + p1 * (cd - 1)) / (1 + p0 * (cd - 1)), adj = rr / bf;
  const gone = adj <= 1;
  // Excel-style 3D surface: RRadjusted over P_C1 (x) × RR_CD (y), with ARR & P_C0 fixed.
  const xs = [], ys = [];
  for (let i = 0; i <= 24; i++) xs.push(i / 24);          // P_C1 : 0 → 1
  for (let j = 0; j <= 24; j++) ys.push(1 + j * (5 / 24)); // RR_CD: 1 → 6
  const z = ys.map((cdv) => xs.map((pc1) => {
    const BF = (1 + pc1 * (cdv - 1)) / (1 + p0 * (cdv - 1));
    return rr / BF;                                        // RRadjusted = ARR / BF
  }));
  const el = document.getElementById("evalueArrayChart");
  if (el) Plotly.react(el, [
    {
      type: "surface", x: xs, y: ys, z: z, showscale: false, opacity: 0.97,
      colorscale: [[0, "#fff7bc"], [0.4, "#7fcdbb"], [0.7, "#8856a7"], [1, "#c51b8a"]],
      contours: { z: { show: true, usecolormap: true, width: 1, project: { z: false } } },
      hovertemplate: "P<sub>C1</sub>=%{x:.2f}<br>RR<sub>CD</sub>=%{y:.1f}<br>RR<sub>adj</sub>=%{z:.2f}<extra></extra>",
    },
    {
      type: "scatter3d", mode: "markers", x: [p1], y: [cd], z: [adj],
      marker: { size: 5, color: gone ? "#b91c1c" : "#0f172a" },
      hovertemplate: `${tr("目前選擇", "current")}: P<sub>C1</sub>=${p1.toFixed(2)}, RR<sub>CD</sub>=${cd.toFixed(1)} → RR<sub>adj</sub>=${adj.toFixed(2)}<extra></extra>`,
    },
  ], {
    height: 380, margin: { l: 0, r: 0, t: 6, b: 0 }, showlegend: false,
    paper_bgcolor: "rgba(0,0,0,0)",
    scene: {
      xaxis: { title: "P<sub>C1</sub>", range: [0, 1] },
      yaxis: { title: "RR<sub>CD</sub>", range: [1, 6] },
      zaxis: { title: tr("校正後 RR<sub>adj</sub>", "RR<sub>adjusted</sub>") },
      camera: { eye: { x: 1.7, y: -1.5, z: 0.7 } },
    },
    annotations: [{
      xref: "paper", yref: "paper", x: 1, y: 0.96, xanchor: "right", showarrow: false,
      align: "left", bordercolor: "#94a3b8", borderwidth: 1, borderpad: 5, bgcolor: "#ffffff",
      font: { size: 11 },
      text: `${tr("固定", "Fixed")}:<br>ARR = ${rr.toFixed(2)}<br>P<sub>C0</sub> = ${p0.toFixed(2)}`,
    }],
  }, { displayModeBar: false, responsive: true });
  card.querySelector(".ea-out").innerHTML = tr(
    `偏誤因子 BF＝<b>${bf.toFixed(2)}</b>，把 ARR ${rr.toFixed(2)} 校正成 RRadj＝<b>${adj.toFixed(2)}</b> → ` +
      (gone ? `<b style="color:#b91c1c">這個混淆足以把效果解釋掉（跨過 1）</b>` : `<b style="color:#1d6f57">仍在 1 的同側，效果存活</b>`),
    `Bias factor BF = <b>${bf.toFixed(2)}</b> moves ARR ${rr.toFixed(2)} to RRadj = <b>${adj.toFixed(2)}</b> → ` +
      (gone ? `<b style="color:#b91c1c">this confounder is enough to explain it away (crosses 1)</b>` : `<b style="color:#1d6f57">still on the same side of 1 — the effect survives</b>`));
}
function initEvalueArray() {
  const card = document.getElementById("evalueArrayCard"); if (!card) return;
  if (!evalueArrayReady) {
    evalueArrayReady = true;
    card.querySelectorAll("input").forEach((i) => i.addEventListener("input", refreshEvalueArray));
  }
  refreshEvalueArray();
}
// ---- MCDA: weighted-scoring (MAVT / simple additive weighting) ranking demo ----
// A fixed performance matrix (treatments × criteria); drag the criterion weights
// and the alternatives re-rank. Criteria are min-max normalised to 0–1 (cost
// inverted), then a weighted sum gives each option's overall score.
const MCDA_CRIT = [
  { key: "eff", zh: "療效", en: "efficacy", dir: 1 },
  { key: "saf", zh: "安全", en: "safety", dir: 1 },
  { key: "cost", zh: "成本", en: "cost", dir: -1 },     // lower is better
  { key: "conv", zh: "方便性", en: "convenience", dir: 1 },
];
const MCDA_ALT = [
  { zh: "新藥 A", en: "new drug A", v: [90, 60, 80, 70] },
  { zh: "老藥 B", en: "old drug B", v: [65, 85, 20, 80] },
  { zh: "生物製劑 C", en: "biologic C", v: [95, 70, 95, 40] },
  { zh: "學名藥 D", en: "generic D", v: [60, 80, 10, 90] },
];
let mcdaReady = false;
function _mcdaScores(weights) {
  const n = MCDA_CRIT.length;
  const norm = [];
  for (let j = 0; j < n; j++) {                          // min-max normalise each criterion
    const col = MCDA_ALT.map((a) => a.v[j]); const lo = Math.min(...col), hi = Math.max(...col);
    norm.push(col.map((x) => { const s = hi > lo ? (x - lo) / (hi - lo) : 0.5; return MCDA_CRIT[j].dir > 0 ? s : 1 - s; }));
  }
  const wsum = weights.reduce((s, w) => s + w, 0) || 1;
  return MCDA_ALT.map((a, i) => { let sc = 0; for (let j = 0; j < n; j++) sc += (weights[j] / wsum) * norm[j][i]; return { alt: a, score: sc }; });
}
function refreshMcda() {
  const card = document.getElementById("mcdaCard"); if (!card) return;
  const num = (s, d) => { const v = parseFloat(card.querySelector(s).value); return isFinite(v) ? v : d; };
  const w = MCDA_CRIT.map((c) => num(".mw-" + c.key, 5));
  MCDA_CRIT.forEach((c, j) => { const b = card.querySelector(".mwv-" + c.key); if (b) b.textContent = w[j].toFixed(0); });
  const scored = _mcdaScores(w).sort((a, b) => b.score - a.score);
  const el = document.getElementById("mcdaChart");
  if (el) Plotly.react(el, [{
    type: "bar", orientation: "h",
    y: scored.map((s) => tr(s.alt.zh, s.alt.en)).reverse(),
    x: scored.map((s) => s.score).reverse(),
    marker: { color: scored.map((s, i) => (i === 0 ? TEAL : "#cbd5e1")).reverse() },
    text: scored.map((s) => s.score.toFixed(2)).reverse(), textposition: "outside", hoverinfo: "skip",
  }], sceneLayout({
    height: 300, margin: { t: 16, r: 26, b: 36, l: 96 },
    xaxis: { title: tr("加權總分（0–1）", "weighted score (0–1)"), range: [0, 1.05] }, yaxis: { automargin: true },
  }), SCENE_CFG);
  const win = scored[0];
  card.querySelector(".mcda-out").innerHTML = tr(
    `目前權重下，<b>${win.alt.zh}</b> 排第一（總分 ${win.score.toFixed(2)}）。把某個準則的權重拉高，排名就會改變，這正是 MCDA 把「價值判斷」攤開、可以討論的地方。`,
    `Under these weights, <b>${win.alt.en}</b> ranks first (score ${win.score.toFixed(2)}). Drag any criterion's weight and the ranking shifts — exactly where MCDA makes the value judgement explicit and debatable.`);
}
function initMcda() {
  const card = document.getElementById("mcdaCard"); if (!card) return;
  if (!mcdaReady) { mcdaReady = true; card.querySelectorAll("input").forEach((i) => i.addEventListener("input", refreshMcda)); }
  refreshMcda();
}
// ---- fsQCA: set-theoretic sufficiency demo ----------------------------------
// Cases have fuzzy membership in conditions A, B and the outcome Y. For a chosen
// configuration X (A, B, A·B = min, A+B = max), sufficiency (X ⊆ Y) shows as
// points on/above the diagonal; consistency = Σmin(X,Y)/ΣX, coverage = Σmin(X,Y)/ΣY.
const FSQCA_CASES = [
  [0.95, 0.90, 0.95], [0.90, 0.80, 0.90], [0.85, 0.75, 0.85], [0.70, 0.70, 0.80],
  [0.90, 0.20, 0.30], [0.20, 0.90, 0.35], [0.60, 0.60, 0.65], [0.75, 0.85, 0.80],
  [0.30, 0.30, 0.20], [0.40, 0.80, 0.45], [0.80, 0.55, 0.60], [0.10, 0.20, 0.15],
];
const FSQCA_CFG = [
  { id: "AB", zh: "A 且 B（AND）", en: "A AND B", f: (c) => Math.min(c[0], c[1]) },
  { id: "A", zh: "只有 A", en: "A alone", f: (c) => c[0] },
  { id: "B", zh: "只有 B", en: "B alone", f: (c) => c[1] },
  { id: "AorB", zh: "A 或 B（OR）", en: "A OR B", f: (c) => Math.max(c[0], c[1]) },
];
let fsqcaReady = false;
function refreshFsqca() {
  const card = document.getElementById("fsqcaCard"); if (!card) return;
  const sel = card.querySelector(".fq-cfg");
  const cfg = FSQCA_CFG.find((c) => c.id === (sel ? sel.value : "AB")) || FSQCA_CFG[0];
  const xs = FSQCA_CASES.map(cfg.f), ys = FSQCA_CASES.map((c) => c[2]);
  let sm = 0, sx = 0, sy = 0;
  for (let i = 0; i < xs.length; i++) { sm += Math.min(xs[i], ys[i]); sx += xs[i]; sy += ys[i]; }
  const cons = sx > 0 ? sm / sx : 0, cov = sy > 0 ? sm / sy : 0;
  const el = document.getElementById("fsqcaChart");
  if (el) Plotly.react(el, [{
    x: xs, y: ys, mode: "markers", type: "scatter", hoverinfo: "skip",
    marker: { size: 12, line: { color: "#fff", width: 1 }, color: xs.map((x, i) => (ys[i] >= x - 1e-9 ? TEAL : "#ef4444")) },
  }], sceneLayout({
    height: 320, showlegend: false, margin: { t: 16, r: 18, b: 46, l: 56 },
    xaxis: { title: tr(`屬於「${cfg.zh}」的程度`, `membership in "${cfg.en}"`), range: [0, 1.02], dtick: 0.2 },
    yaxis: { title: tr("結果 Y 的程度", "outcome Y membership"), range: [0, 1.02], dtick: 0.2 },
    shapes: [{ type: "line", x0: 0, y0: 0, x1: 1, y1: 1, line: { color: "#94a3b8", dash: "dash", width: 1.5 } }],
  }), SCENE_CFG);
  const suff = cons >= 0.8;
  card.querySelector(".fq-out").innerHTML = tr(
    `一致性 consistency＝<b>${cons.toFixed(2)}</b>（充分性：點是否都在對角線上方？）；覆蓋率 coverage＝<b>${cov.toFixed(2)}</b>。` +
      (suff ? `<b style="color:#1d6f57">一致性 ≥ 0.80 → 可把「${cfg.zh}」當作結果的<b>充分</b>條件。</b>` : `<b style="color:#b45309">一致性 < 0.80 → 還不夠充分（有點落在對角線下方）。</b>`),
    `Consistency = <b>${cons.toFixed(2)}</b> (sufficiency: do points sit on/above the diagonal?); coverage = <b>${cov.toFixed(2)}</b>. ` +
      (suff ? `<b style="color:#1d6f57">consistency ≥ 0.80 → "${cfg.en}" can be read as a <b>sufficient</b> condition for the outcome.</b>` : `<b style="color:#b45309">consistency < 0.80 → not sufficient enough (some points fall below the diagonal).</b>`));
}
function initFsqca() {
  const card = document.getElementById("fsqcaCard"); if (!card) return;
  if (!fsqcaReady) { fsqcaReady = true; card.querySelectorAll("select, input").forEach((i) => { i.addEventListener("change", refreshFsqca); i.addEventListener("input", refreshFsqca); }); }
  refreshFsqca();
}
function ensureEvalueCard(method) {
  const prefix = METHOD_PREFIX[method];
  const panel = document.getElementById(prefix + "assume");
  if (!panel) return;
  let card = document.getElementById(prefix + "_evalue");
  if (!card) {
    card = document.createElement("div");
    card.id = prefix + "_evalue";
    card.className = "card info evalue-card";
    card.innerHTML =
      `<h3 data-en="Sensitivity: the E-value — how strong must unmeasured confounding be to overturn this?">敏感度分析：E-value：未測混淆要多強，才能推翻這個結果？</h3>` +
      `<p class="lead" data-en="This design's key assumption — no unmeasured (time-varying) confounding — cannot be tested from the data. The E-value quantifies how strong such confounding would have to be to undo your finding. Type in the effect you got (as a risk ratio; for an OR/HR treat it as an approximate RR) and the CI limit nearest 1.">這個設計最關鍵的假設，沒有未測（時變）混淆，無法用資料檢驗。E-value 把「混淆要多強才能翻盤」量化出來。把你算到的效果（以風險比 RR 填入；OR／HR 可近似當 RR）與信賴區間靠近 1 的那端填進去。</p>` +
      `<div class="ev-inputs">` +
        `<label data-en="Observed effect (risk ratio)">觀察到的效果（風險比 RR）<input type="number" class="ev-rr" step="0.05" min="0.05" value="2.0"></label>` +
        `<label data-en="CI limit nearest 1">信賴區間靠近 1 的那端<input type="number" class="ev-ci" step="0.05" min="0.05" value="1.4"></label>` +
      `</div>` +
      `<p class="ev-out"></p>` +
      `<h4 data-en="Try it: a hypothetical unmeasured confounder">試試看：一個假想的未測混淆</h4>` +
      `<div class="ev-sliders">` +
        `<label data-en="Confounder ↔ vaccination (RR_EU)">混淆 ↔ 接種（RR_EU）<input type="range" class="ev-eu" min="1" max="5" step="0.1" value="2"> <b class="ev-euv">2.0</b></label>` +
        `<label data-en="Confounder ↔ outcome (RR_UD)">混淆 ↔ 結果（RR_UD）<input type="range" class="ev-ud" min="1" max="5" step="0.1" value="2"> <b class="ev-udv">2.0</b></label>` +
      `</div>` +
      `<p class="ev-verdict"></p>` +
      `<p class="caption" data-en="E-value = RR + √(RR×(RR−1)); bounding factor B = (RR_EU·RR_UD)/(RR_EU+RR_UD−1). VanderWeele &amp; Ding (2017), Ann Intern Med; Haneuse, VanderWeele &amp; Arterburn (2019), JAMA.">E-value ＝ RR ＋ √(RR×(RR−1))；偏誤因子 B ＝ (RR_EU·RR_UD)／(RR_EU＋RR_UD−1)。VanderWeele &amp; Ding（2017），Ann Intern Med；Haneuse、VanderWeele &amp; Arterburn（2019），JAMA。</p>`;
    panel.appendChild(card);
    card.querySelectorAll("input").forEach((inp) => inp.addEventListener("input", () => _evRecompute(card)));
  }
  _evRecompute(card);
}

// ----------------------------------------------------------------------
// Missing-data tab — interactive demo: knock out a confounder X (MCAR / MAR) and
// watch complete-case / mean / multiple imputation vs the truth.
// ----------------------------------------------------------------------
let missReady = false, missTimer = null;
function initMiss() { if (missReady) return; missReady = true; refreshMiss(); }
function scheduleMiss() {
  const p = document.getElementById("missSlider").value;
  document.getElementById("missPval").textContent = p + "%";
  clearTimeout(missTimer); missTimer = setTimeout(refreshMiss, 150);
}
{
  const sl = document.getElementById("missSlider"), mh = document.getElementById("missMech");
  if (sl) sl.addEventListener("input", scheduleMiss);
  if (mh) mh.addEventListener("change", refreshMiss);
}
async function refreshMiss() {
  const p = (Number(document.getElementById("missSlider").value) || 40) / 100;
  const mech = document.getElementById("missMech").value;
  let r;
  try { r = await getJSON(`${API}/api/missing_interactive?p=${p}&mechanism=${mech}&lang=${lang()}`); } catch (e) { return; }
  state.miss = r;
  const rd = document.getElementById("missReading"); if (rd) rd.innerHTML = r.reading;
  drawMissChart(r);
}
function drawMissChart(r) {
  if (!document.getElementById("missChart")) return;
  const labels = [tr("未校正（不校正）", "naive (unadjusted)"), tr("完整個案", "complete-case"),
                  tr("平均值插補", "mean imputation"), tr("多重插補", "multiple imputation")];
  const vals = [r.naive, r.complete_case, r.mean_impute, r.multiple_imputation];
  const cols = vals.map((v) => Math.abs(v - r.truth) < 0.2 ? TEAL : AMBER);  // green = on truth, amber = biased
  Plotly.react("missChart", [{
    x: labels, y: vals, type: "bar", marker: { color: cols },
    text: vals.map((v) => v.toFixed(2)), textposition: "outside", hoverinfo: "skip",
  }], sceneLayout({
    height: 330, margin: { t: 20, r: 16, b: 55, l: 55 },
    yaxis: { title: tr("估出的 A→Y 效果", "estimated A→Y effect") },
    shapes: [{ type: "line", x0: -0.5, x1: 3.5, y0: r.truth, y1: r.truth, line: { color: GREEN, dash: "dash", width: 2 } }],
    annotations: [{ x: 3.45, y: r.truth, xanchor: "right", yanchor: "bottom",
                    text: tr(`真值 ${r.truth.toFixed(2)}`, `truth ${r.truth.toFixed(2)}`),
                    showarrow: false, font: { color: GREEN, size: 11 } }],
  }), SCENE_CFG);
}

// ----------------------------------------------------------------------
// SR/MA tab — live meta-analysis: forest + funnel, fixed vs random effects,
// heterogeneity slider (τ → I² and the random-effects interval grow).
// ----------------------------------------------------------------------
let srmaReady = false, srmaTimer = null;
function initSrma() { if (srmaReady) return; srmaReady = true; refreshSrma(); }
function scheduleSrma() {
  const v = parseFloat(document.getElementById("srmaTauSlider").value);
  const t = isNaN(v) ? 0.2 : v;
  document.getElementById("srmaTauVal").textContent = t.toFixed(2);
  clearTimeout(srmaTimer); srmaTimer = setTimeout(refreshSrma, 150);
}
{
  const sl = document.getElementById("srmaTauSlider");
  if (sl) sl.addEventListener("input", scheduleSrma);
}
async function refreshSrma() {
  const tv = parseFloat(document.getElementById("srmaTauSlider").value);
  const tau = isNaN(tv) ? 0.2 : tv;
  let r;
  try { r = await getJSON(`${API}/api/srma_interactive?tau=${tau}&lang=${lang()}`); } catch (e) { return; }
  // per-study rows (for forest boxes + funnel) don't depend on τ — fetch once, cache per language.
  let full = state.srmaFull;
  if (!full || full._lang !== lang()) {
    try { full = await getJSON(`${API}/api/srma_analyze?lang=${lang()}`); full._lang = lang(); } catch (e) { full = null; }
  }
  state.srma = r; state.srmaFull = full;
  const f = (x) => x.toFixed(2);
  const setHtml = (id, s) => { const e = document.getElementById(id); if (e) e.innerHTML = s; };
  setHtml("srmaFe", `${f(r.fixed.rr)} [${f(r.fixed.lo)}, ${f(r.fixed.hi)}]`);
  setHtml("srmaRe", `${f(r.random.rr)} [${f(r.random.lo)}, ${f(r.random.hi)}]`);
  setHtml("srmaI2", `${r.I2.toFixed(0)}%`);
  setHtml("srmaReading", r.reading);
  if (full) setHtml("srmaEgger", full.egger_msg);
  if (full) { drawSrmaForest(full, r); drawSrmaFunnel(full); }
}
function drawSrmaForest(full, slider) {
  if (!document.getElementById("srmaForest")) return;
  const st = full.studies;
  const n = st.length;
  // rows: studies top-to-bottom, then a gap, then FE and RE diamonds
  const yPos = st.map((_, i) => n - i + 1);
  const traces = [];
  // per-study CI whiskers + boxes (box size ~ weight)
  st.forEach((s, i) => {
    traces.push({ x: [s.lo, s.hi], y: [yPos[i], yPos[i]], mode: "lines",
      line: { color: SLATE, width: 1.4 }, hoverinfo: "skip", showlegend: false });
  });
  traces.push({ x: st.map((s) => s.rr), y: yPos, mode: "markers", hoverinfo: "text",
    text: st.map((s) => `${s.label}: RR ${s.rr.toFixed(2)} [${s.lo.toFixed(2)}, ${s.hi.toFixed(2)}], w=${s.weight.toFixed(1)}%`),
    marker: { color: INK, symbol: "square", size: st.map((s) => 8 + s.weight * 0.9) }, showlegend: false });
  // pooled diamonds (use slider numbers so they react to τ)
  const diamond = (yc, lo, mid, hi, col, label) => ({
    x: [lo, mid, hi, mid, lo], y: [yc, yc + 0.32, yc, yc - 0.32, yc], mode: "lines", fill: "toself",
    fillcolor: col, line: { color: col, width: 1 }, hoverinfo: "text",
    text: `${label}: RR ${mid.toFixed(2)} [${lo.toFixed(2)}, ${hi.toFixed(2)}]`, showlegend: false });
  traces.push(diamond(1.0, slider.fixed.lo, slider.fixed.rr, slider.fixed.hi, AMBER, tr("固定效果", "fixed effect")));
  traces.push(diamond(0.2, slider.random.lo, slider.random.rr, slider.random.hi, TEAL, tr("隨機效果", "random effect")));
  const ticks = yPos.concat([1.0, 0.2]);
  const tickt = st.map((s) => s.label).concat([tr("固定效果", "fixed"), tr("隨機效果", "random")]);
  Plotly.react("srmaForest", traces, sceneLayout({
    height: 420, margin: { t: 14, r: 18, b: 42, l: 86 },
    xaxis: { title: tr("風險比 RR（log 軸）", "risk ratio RR (log axis)"), type: "log",
             zeroline: false, tickvals: [0.5, 0.7, 1, 1.4, 2], ticktext: ["0.5", "0.7", "1", "1.4", "2"] },
    yaxis: { tickvals: ticks, ticktext: tickt, range: [-0.3, n + 2.2], showgrid: false },
    shapes: [{ type: "line", x0: 1, x1: 1, y0: -0.3, y1: n + 1.6, line: { color: SLATE, dash: "dot", width: 1 } }],
  }), SCENE_CFG);
}
function drawSrmaFunnel(full) {
  if (!document.getElementById("srmaFunnel")) return;
  const st = full.studies;
  const center = full.fixed.logrr;          // funnel centred on the pooled log RR
  const seMax = Math.max.apply(null, st.map((s) => s.si)) * 1.1;
  // pseudo 95% CI funnel: x = center ± 1.96*se as se runs 0..seMax (y = se, inverted)
  const ses = [0, seMax];
  const leftX = ses.map((se) => Math.exp(center - 1.96 * se));
  const rightX = ses.map((se) => Math.exp(center + 1.96 * se));
  const traces = [
    { x: leftX, y: ses, mode: "lines", line: { color: SLATE, dash: "dot", width: 1 }, hoverinfo: "skip", showlegend: false },
    { x: rightX, y: ses, mode: "lines", line: { color: SLATE, dash: "dot", width: 1 }, hoverinfo: "skip", showlegend: false },
    { x: st.map((s) => s.rr), y: st.map((s) => s.si), mode: "markers", hoverinfo: "text",
      text: st.map((s) => `${s.label}: RR ${s.rr.toFixed(2)}, SE ${s.si.toFixed(2)}`),
      marker: { color: TEAL, size: 9, line: { color: INK, width: 0.6 } }, showlegend: false },
  ];
  Plotly.react("srmaFunnel", traces, sceneLayout({
    height: 420, margin: { t: 14, r: 16, b: 42, l: 52 },
    xaxis: { title: tr("風險比 RR（log 軸）", "risk ratio RR (log axis)"), type: "log",
             tickvals: [0.5, 0.7, 1, 1.4, 2], ticktext: ["0.5", "0.7", "1", "1.4", "2"] },
    yaxis: { title: tr("標準誤（小研究在下）", "standard error (small studies low)"), autorange: "reversed" },
    shapes: [{ type: "line", x0: Math.exp(center), x1: Math.exp(center), y0: 0, y1: seMax,
               line: { color: AMBER, dash: "dash", width: 1.5 } }],
  }), SCENE_CFG);
}

// ----------------------------------------------------------------------
// NMA tab — frontend-only demo: indirect comparison via a common comparator +
// the direct-vs-indirect consistency (incoherence) check. Closed-form, exact.
// ----------------------------------------------------------------------
const NMA_DAP = -0.40, NMA_DBP = -0.25;          // direct log RRs: A-vs-Placebo, B-vs-Placebo
const NMA_INDIRECT = NMA_DAP - NMA_DBP;          // indirect A-vs-B = (A-P) − (B-P) = −0.15
let nmaReady = false, nmaTimer = null;
function initNma() { if (nmaReady) return; nmaReady = true; refreshNma(); }
{
  const sl = document.getElementById("nmaDirSlider");
  if (sl) sl.addEventListener("input", () => {
    document.getElementById("nmaDirVal").textContent = Number(sl.value).toFixed(2);
    clearTimeout(nmaTimer); nmaTimer = setTimeout(refreshNma, 80);
  });
}
function _nmaStatus(incoh) {
  const a = Math.abs(incoh);
  return a < 0.08 ? GREEN : (a < 0.2 ? AMBER : RED);
}
function refreshNma() {
  const sl = document.getElementById("nmaDirSlider");
  const direct = sl ? parseFloat(sl.value) : NMA_INDIRECT;
  const incoh = direct - NMA_INDIRECT;
  const col = _nmaStatus(incoh);
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.innerHTML = v; };
  set("nmaIndirect", `${NMA_INDIRECT.toFixed(2)} <span class="muted">(RR ${Math.exp(NMA_INDIRECT).toFixed(2)})</span>`);
  set("nmaDirect", `${direct.toFixed(2)} <span class="muted">(RR ${Math.exp(direct).toFixed(2)})</span>`);
  set("nmaIncoh", `${incoh >= 0 ? "+" : ""}${incoh.toFixed(2)}`);
  const card = document.getElementById("nmaIncohCard");
  if (card) { card.className = "rc"; if (col === GREEN) card.classList.add("highlight"); }
  const verdict = col === GREEN
    ? tr("一致：直接與間接相符，迴圈閉合，可放心合併成混合估計。", "Consistent: direct and indirect agree, the loop closes — safe to pool into a mixed estimate.")
    : (col === AMBER
      ? tr("有些不一致：直接與間接開始背離，node-splitting／net-heat 會亮起來，先查原因再合併。", "Some incoherence: direct and indirect start to diverge — node-splitting / net-heat would light up; investigate before pooling.")
      : tr("嚴重不一致：直接與間接矛盾，可遞移性很可能被破壞，硬合併會誤導。", "Strong incoherence: direct and indirect contradict — transitivity is likely broken; pooling them would mislead."));
  set("nmaReading", verdict);
  drawNmaNetwork(col);
  drawNmaBars(direct, col);
}
function drawNmaNetwork(loopCol) {
  if (!document.getElementById("nmaNetwork")) return;
  const N = { P: [0, 0], A: [-1.1, 1.5], B: [1.1, 1.5] };
  const edge = (a, b, color, width, dash) => ({ x: [N[a][0], N[b][0]], y: [N[a][1], N[b][1]],
    mode: "lines", line: { color, width, dash: dash || "solid" }, hoverinfo: "skip", showlegend: false });
  const traces = [
    edge("P", "A", SLATE, 4),                 // direct A-vs-Placebo
    edge("P", "B", SLATE, 3),                 // direct B-vs-Placebo
    edge("A", "B", loopCol, 3, "dot"),        // the A-vs-B loop edge, coloured by coherence
    { x: [N.P[0], N.A[0], N.B[0]], y: [N.P[1], N.A[1], N.B[1]], mode: "markers+text",
      text: [tr("安慰劑", "Placebo"), tr("藥 A", "Drug A"), tr("藥 B", "Drug B")], textposition: "middle center",
      textfont: { color: "#fff", size: 12 }, hoverinfo: "skip", showlegend: false,
      marker: { size: 54, color: [SLATE, TEAL, PURPLE] } },
  ];
  Plotly.react("nmaNetwork", traces, sceneLayout({
    height: 340, margin: { t: 16, r: 16, b: 16, l: 16 },
    xaxis: { visible: false, range: [-2, 2], fixedrange: true },
    yaxis: { visible: false, range: [-0.6, 2.1], fixedrange: true },
    annotations: [{ x: 0, y: 1.62, text: tr("間接（虛線）", "indirect (dotted)"), showarrow: false, font: { size: 10, color: loopCol } }],
  }), SCENE_CFG);
}
function drawNmaBars(direct, col) {
  if (!document.getElementById("nmaBars")) return;
  const labels = [tr("間接（經安慰劑）", "indirect (via Placebo)"), tr("直接（滑桿）", "direct (slider)")];
  const vals = [NMA_INDIRECT, direct];
  Plotly.react("nmaBars", [{ x: labels, y: vals, type: "bar", marker: { color: [SLATE, col] },
    text: vals.map((v) => v.toFixed(2)), textposition: "outside", hoverinfo: "skip" }],
    sceneLayout({ height: 340, margin: { t: 16, r: 16, b: 40, l: 52 },
      yaxis: { title: tr("A vs B（log 風險比）", "A vs B (log risk ratio)"), range: [-0.7, 0.4], zeroline: true },
      shapes: [{ type: "line", x0: -0.5, x1: 1.5, y0: NMA_INDIRECT, y1: NMA_INDIRECT, line: { color: SLATE, dash: "dash", width: 1.5 } }],
    }), SCENE_CFG);
}

// ----------------------------------------------------------------------
// GBTM tab — a genuine in-browser group-based trajectory model. We fit an EM
// mixture of quadratic-in-time trajectories (shared variance ≈ Nagin's CNORM
// without the censoring) to a synthetic 3-group adherence cohort, for K = 1..6,
// and report BIC + average posterior probability so model selection is visible.
// Pure JS, no backend.
// ----------------------------------------------------------------------
const GBTM_N = 300, GBTM_T = 12;                 // patients; monthly follow-up points
const GBTM_X = Array.from({ length: GBTM_T }, (_, t) => t / (GBTM_T - 1));   // time scaled to [0,1]
// design matrix rows [1, x, x^2] and the projector M = (XᵀX)⁻¹Xᵀ (3×T), so a
// weighted group mean trajectory ȳ_k(t) maps to its polynomial coefs by M·ȳ_k.
const GBTM_DESIGN = GBTM_X.map((x) => [1, x, x * x]);
function _matInv3(A) {
  const [a, b, c] = A[0], [d, e, f] = A[1], [g, h, i] = A[2];
  const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  const inv = [
    [(e * i - f * h), (c * h - b * i), (b * f - c * e)],
    [(f * g - d * i), (a * i - c * g), (c * d - a * f)],
    [(d * h - e * g), (b * g - a * h), (a * e - b * d)],
  ];
  return inv.map((r) => r.map((v) => v / det));
}
const GBTM_M = (() => {
  const XtX = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const r of GBTM_DESIGN) for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) XtX[a][b] += r[a] * r[b];
  const inv = _matInv3(XtX);
  // M[a][t] = sum_b inv[a][b] * X[t][b]
  return [0, 1, 2].map((a) => GBTM_X.map((_, t) => [0, 1, 2].reduce((s, b) => s + inv[a][b] * GBTM_DESIGN[t][b], 0)));
})();
const _gbtmEval = (beta, t) => beta[0] + beta[1] * GBTM_X[t] + beta[2] * GBTM_X[t] * GBTM_X[t];
const _normPdf = (y, mu, sig) => Math.exp(-0.5 * ((y - mu) / sig) ** 2) / (sig * 2.5066282746310002);
// true generative groups (adherence 0–1): persistent-high, gradual-decline, early-drop
const GBTM_TRUE = [
  { p: 0.40, b: [0.90, 0.02, -0.04] },
  { p: 0.33, b: [0.88, -0.15, -0.45] },
  { p: 0.27, b: [0.72, -1.55, 1.00] },
];
function _gbtmSample() {
  const Y = [];
  for (let i = 0; i < GBTM_N; i++) {
    let u = Math.random(), gi = 0, acc = 0;
    for (let k = 0; k < GBTM_TRUE.length; k++) { acc += GBTM_TRUE[k].p; if (u <= acc) { gi = k; break; } }
    const b = GBTM_TRUE[gi].b;
    const row = GBTM_X.map((x) => {
      let v = b[0] + b[1] * x + b[2] * x * x + (Math.random() + Math.random() + Math.random() - 1.5) * 0.16;
      return Math.max(0, Math.min(1, v));                       // CNORM-style censoring at [0,1]
    });
    Y.push(row);
  }
  return Y;
}
// EM for a K-group mixture of quadratic trajectories with shared variance.
function _gbtmFit(Y, K) {
  const n = Y.length, T = GBTM_T;
  // init: order individuals by mean level, split into K seed groups
  const order = Y.map((row, i) => [row.reduce((s, v) => s + v, 0) / T, i]).sort((a, b) => a[0] - b[0]);
  let beta = [], pi = new Array(K).fill(1 / K);
  for (let k = 0; k < K; k++) {
    const seg = order.slice(Math.floor(k * n / K), Math.floor((k + 1) * n / K)).map((o) => o[1]);
    const ybar = GBTM_X.map((_, t) => seg.reduce((s, i) => s + Y[i][t], 0) / seg.length);
    beta.push(GBTM_M.map((mt) => mt.reduce((s, m, t) => s + m * ybar[t], 0)));
  }
  let sig = 0.16, resp = Array.from({ length: n }, () => new Array(K).fill(0)), ll = 0;
  for (let iter = 0; iter < 80; iter++) {
    // E-step (log-domain), accumulate log-likelihood
    ll = 0;
    const mu = beta.map((b) => GBTM_X.map((_, t) => _gbtmEval(b, t)));
    for (let i = 0; i < n; i++) {
      const logp = new Array(K);
      for (let k = 0; k < K; k++) {
        let lp = Math.log(Math.max(pi[k], 1e-12));
        for (let t = 0; t < T; t++) lp += Math.log(Math.max(_normPdf(Y[i][t], mu[k][t], sig), 1e-300));
        logp[k] = lp;
      }
      const mx = Math.max(...logp);
      let den = 0; for (let k = 0; k < K; k++) den += Math.exp(logp[k] - mx);
      ll += mx + Math.log(den);
      for (let k = 0; k < K; k++) resp[i][k] = Math.exp(logp[k] - mx) / den;
    }
    // M-step
    let ssq = 0, wtot = 0;
    for (let k = 0; k < K; k++) {
      let Wk = 0; const ybar = new Array(T).fill(0);
      for (let i = 0; i < n; i++) { Wk += resp[i][k]; for (let t = 0; t < T; t++) ybar[t] += resp[i][k] * Y[i][t]; }
      pi[k] = Wk / n;
      if (Wk > 1e-9) { for (let t = 0; t < T; t++) ybar[t] /= Wk; beta[k] = GBTM_M.map((mt) => mt.reduce((s, m, t) => s + m * ybar[t], 0)); }
    }
    const mu2 = beta.map((b) => GBTM_X.map((_, t) => _gbtmEval(b, t)));
    for (let i = 0; i < n; i++) for (let k = 0; k < K; k++) { for (let t = 0; t < T; t++) ssq += resp[i][k] * (Y[i][t] - mu2[k][t]) ** 2; wtot += resp[i][k] * T; }
    sig = Math.sqrt(Math.max(ssq / wtot, 1e-4));
  }
  // assignments, diagnostics
  const assign = resp.map((r) => r.indexOf(Math.max(...r)));
  const nParam = K * 3 + (K - 1) + 1;                          // betas + free pis + variance
  const bic = -2 * ll + nParam * Math.log(n * GBTM_T);
  const sizes = new Array(K).fill(0), ppsum = new Array(K).fill(0);
  assign.forEach((k, i) => { sizes[k]++; ppsum[k] += resp[i][k]; });
  const avepp = sizes.reduce((s, c, k) => s + (c ? ppsum[k] : 0), 0) / n;   // overall mean max-posterior
  const order2 = beta.map((b, k) => [b[0] + 0.5 * b[1] + 0.25 * b[2], k]).sort((a, b) => b[0] - a[0]).map((o) => o[1]);
  return { beta, pi, sig, resp, assign, bic, avepp, sizes, K, order: order2 };
}
const GBTM_COLS = ["#3f8268", "#7c3aed", "#f59e0b", "#0ea5e9", "#ef4444", "#65a30d"];
let gbtmReady = false, gbtmData = null, gbtmFits = null;
function initGbtm() {
  if (!document.getElementById("gbtmTraj")) return;
  if (!gbtmReady) {
    gbtmReady = true;
    const sl = document.getElementById("gbtmKSlider");
    if (sl) sl.addEventListener("input", () => { document.getElementById("gbtmKVal").textContent = sl.value; drawGbtm(); });
    const rs = document.getElementById("gbtmResample");
    if (rs) rs.addEventListener("click", () => { _gbtmRun(); drawGbtm(); });
    _gbtmRun();
  }
  drawGbtm();
}
function _gbtmRun() {
  gbtmData = _gbtmSample();
  gbtmFits = {}; for (let k = 1; k <= 6; k++) gbtmFits[k] = _gbtmFit(gbtmData, k);
}
function _gbtmBestK() {
  let best = 1, bv = Infinity;
  for (let k = 1; k <= 6; k++) if (gbtmFits[k].bic < bv) { bv = gbtmFits[k].bic; best = k; }
  return best;
}
function drawGbtm() {
  if (!gbtmFits) return;
  const K = parseInt(document.getElementById("gbtmKSlider").value, 10);
  const fit = gbtmFits[K], bestK = _gbtmBestK();
  const months = GBTM_X.map((_, t) => t);
  // map fit groups to a stable colour order (high → low overall level)
  const colOf = {}; fit.order.forEach((k, idx) => { colOf[k] = GBTM_COLS[idx % GBTM_COLS.length]; });
  const traces = [];
  const show = Math.min(GBTM_N, 90);                          // thin the spaghetti for speed
  for (let i = 0; i < show; i++) {
    traces.push({ x: months, y: gbtmData[i], mode: "lines", line: { color: colOf[fit.assign[i]], width: 0.6 },
      opacity: 0.22, hoverinfo: "skip", showlegend: false });
  }
  fit.order.forEach((k, idx) => {
    traces.push({ x: months, y: months.map((_, t) => _gbtmEval(fit.beta[k], t)), mode: "lines",
      line: { color: colOf[k], width: 4 }, name: tr(`群組 ${idx + 1}（${(fit.pi[k] * 100).toFixed(0)}%）`, `Group ${idx + 1} (${(fit.pi[k] * 100).toFixed(0)}%)`) });
  });
  Plotly.react("gbtmTraj", traces, sceneLayout({
    height: 430, showlegend: true, margin: { t: 28, r: 16, b: 44, l: 52 },
    xaxis: { title: tr("月", "month"), dtick: 2, range: [-0.3, GBTM_T - 0.7] },
    yaxis: { title: tr("順從度", "adherence"), range: [-0.05, 1.05] },
  }), SCENE_CFG);
  // BIC by K
  const ks = [1, 2, 3, 4, 5, 6], bics = ks.map((k) => gbtmFits[k].bic);
  Plotly.react("gbtmBic", [
    { x: ks, y: bics, mode: "lines+markers", line: { color: SLATE, width: 2 },
      marker: { size: ks.map((k) => (k === K ? 13 : 8)), color: ks.map((k) => (k === bestK ? GREEN : (k === K ? INK : SLATE))) },
      hovertemplate: "K=%{x}<br>BIC=%{y:.0f}<extra></extra>", showlegend: false },
  ], sceneLayout({
    height: 430, margin: { t: 28, r: 16, b: 44, l: 64 },
    xaxis: { title: tr("群組數 K", "number of groups K"), dtick: 1 },
    yaxis: { title: "BIC" },
    annotations: [{ x: bestK, y: gbtmFits[bestK].bic, ay: 28, ax: 0, text: tr("最低 BIC", "lowest BIC"), font: { size: 10, color: GREEN }, arrowcolor: GREEN }],
  }), SCENE_CFG);
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.innerHTML = v; };
  set("gbtmBicVal", fit.bic.toFixed(0));
  set("gbtmAvepp", `<span style="color:${fit.avepp >= 0.7 ? GREEN : AMBER}">${fit.avepp.toFixed(2)}</span>`);
  set("gbtmSizes", fit.order.map((k, idx) => `${tr("組", "G")}${idx + 1}: ${(100 * fit.sizes[k] / GBTM_N).toFixed(0)}%`).join(" · "));
  const tiny = Math.min(...fit.sizes.map((c) => 100 * c / GBTM_N));
  const reading = K < 3
    ? tr(`K = ${K} 太少：不同形狀被迫共用一條曲線，BIC 偏高。試著增加到 3。`, `K = ${K} is too few: distinct shapes are forced to share a curve and BIC stays high. Try increasing to 3.`)
    : (K === 3
      ? tr("K = 3：BIC 觸底、AvePP 高、三組大小合理，和真相相符。", "K = 3: BIC bottoms out, AvePP is high, group sizes are reasonable — this matches the truth.")
      : tr(`K = ${K}：BIC 幾乎沒再降，卻把真實群組拆開（最小一組僅 ${tiny.toFixed(0)}%），AvePP 下降，過度抽取。`, `K = ${K}: BIC barely improves but a real group gets split (smallest group only ${tiny.toFixed(0)}%) and AvePP drops — over-extraction.`));
  set("gbtmReading", reading);
}

// ----------------------------------------------------------------------
// Causal ML tab — a genuine in-browser T-learner CATE demo. Two quadratic
// least-squares fits (treated arm, control arm); their difference estimates the
// CATE, which a single ATE (a flat line) cannot. Closed-form, exact, no backend.
// ----------------------------------------------------------------------
const CML_N = 240, CML_BASE = 1.0;               // sample size; effect at X = 0
let cmlReady = false, cmlTimer = null;
function initCausalml() { if (cmlReady) return; cmlReady = true; refreshCausalml(); }
{
  const sl = document.getElementById("cmlHetSlider");
  if (sl) sl.addEventListener("input", () => {
    document.getElementById("cmlHetVal").textContent = Number(sl.value).toFixed(2);
    clearTimeout(cmlTimer); cmlTimer = setTimeout(refreshCausalml, 60);
  });
}
function _mul32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function _randn(rng) { let u = 0, v = 0; while (u === 0) u = rng(); while (v === 0) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
// quadratic least squares: returns [b0,b1,b2] for y ≈ b0 + b1 x + b2 x²
function _quadfit(xs, ys) {
  let S0 = xs.length, S1 = 0, S2 = 0, S3 = 0, S4 = 0, T0 = 0, T1 = 0, T2 = 0;
  for (let i = 0; i < xs.length; i++) { const x = xs[i], y = ys[i], x2 = x * x;
    S1 += x; S2 += x2; S3 += x2 * x; S4 += x2 * x2; T0 += y; T1 += x * y; T2 += x2 * y; }
  // solve the 3×3 normal-equation system by Gaussian elimination
  const M = [[S0, S1, S2, T0], [S1, S2, S3, T1], [S2, S3, S4, T2]];
  for (let c = 0; c < 3; c++) {
    let p = c; for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < 3; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k < 4; k++) M[r][k] -= f * M[c][k]; }
  }
  return [M[0][3] / M[0][0], M[1][3] / M[1][1], M[2][3] / M[2][2]];
}
function refreshCausalml() {
  const sl = document.getElementById("cmlHetSlider");
  const slope = sl ? parseFloat(sl.value) : 0.8;        // effect heterogeneity: tau(X) = BASE + slope*X
  const rng = _mul32(20260614);
  const xs = [], a = [], y = [], x1 = [], y1 = [], x0 = [], y0 = [];
  let harmed = 0;
  for (let i = 0; i < CML_N; i++) {
    const x = -2 + 4 * rng();                            // X ~ U(−2, 2)
    const tau = CML_BASE + slope * x;                    // true CATE at x
    if (tau < 0) harmed++;
    const g = 0.5 * x;                                   // baseline outcome surface
    const ai = rng() < 0.5 ? 1 : 0;
    const yi = g + (ai ? tau : 0) + 0.5 * _randn(rng);
    xs.push(x); a.push(ai); y.push(yi);
    if (ai) { x1.push(x); y1.push(yi); } else { x0.push(x); y0.push(yi); }
  }
  const m1 = _quadfit(x1, y1), m0 = _quadfit(x0, y0);    // T-learner: one curve per arm
  const pred = (b, x) => b[0] + b[1] * x + b[2] * x * x;
  const ate = (y1.reduce((s, v) => s + v, 0) / y1.length) - (y0.reduce((s, v) => s + v, 0) / y0.length);
  const grid = []; for (let i = 0; i <= 40; i++) grid.push(-2 + 4 * i / 40);
  const trueC = grid.map((x) => CML_BASE + slope * x);
  const hatC = grid.map((x) => pred(m1, x) - pred(m0, x));
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.innerHTML = v; };
  set("cmlAte", ate.toFixed(2));
  set("cmlRange", `${(CML_BASE - slope * 2).toFixed(2)} → ${(CML_BASE + slope * 2).toFixed(2)}`);
  set("cmlHarm", `${Math.round(100 * harmed / CML_N)}%`);
  set("cmlReading", slope < 0.15
    ? tr(`效果幾乎不隨 X 變（CATE 大致是常數 ${CML_BASE.toFixed(1)}），此時單一 ATE（${ate.toFixed(2)}）就足以代表所有人。`,
         `The effect barely varies with X (CATE ≈ constant ${CML_BASE.toFixed(1)}) — here the single ATE (${ate.toFixed(2)}) represents everyone well.`)
    : tr(`效果隨 X 從 ${(CML_BASE - slope * 2).toFixed(2)} 變到 ${(CML_BASE + slope * 2).toFixed(2)}：單一 ATE（${ate.toFixed(2)}）對兩端的人都是錯的，且約 ${Math.round(100 * harmed / CML_N)}% 的人其實<b>被傷害</b>（CATE<0）卻被「平均有效」蓋過去。T-learner 把這條變化的 CATE 還原出來。`,
         `The effect runs from ${(CML_BASE - slope * 2).toFixed(2)} to ${(CML_BASE + slope * 2).toFixed(2)} across X: the single ATE (${ate.toFixed(2)}) is wrong at both ends, and about ${Math.round(100 * harmed / CML_N)}% of patients are actually <b>harmed</b> (CATE<0) yet hidden under "works on average". The T-learner recovers that varying CATE.`));
  if (!document.getElementById("causalmlChart")) return;
  Plotly.react("causalmlChart", [
    { x: grid, y: trueC, mode: "lines", name: tr("真實 CATE", "true CATE"), line: { color: GREEN, width: 3 } },
    { x: grid, y: hatC, mode: "lines", name: tr("T-learner 估計", "T-learner estimate"), line: { color: TEAL, width: 2.5, dash: "dot" } },
    { x: [-2, 2], y: [ate, ate], mode: "lines", name: tr("單一 ATE", "single ATE"), line: { color: AMBER, width: 2, dash: "dash" } },
  ], sceneLayout({ height: 380, margin: { t: 16, r: 16, b: 44, l: 52 }, legend: { orientation: "h", y: 1.12 },
    xaxis: { title: tr("共變項 X（如疾病嚴重度）", "covariate X (e.g. disease severity)") },
    yaxis: { title: tr("治療效果", "treatment effect"), range: [-1.8, 2.6], zeroline: true },
    shapes: [{ type: "line", x0: -2, x1: 2, y0: 0, y1: 0, line: { color: SLATE, dash: "dot", width: 1 } }],
  }), SCENE_CFG);
}

// ======================================================================
// 2. Interactive teaching
// ======================================================================
const csSlider = document.getElementById("csSlider");
const stSlider = document.getElementById("stSlider");
let playTimer = null;

function scheduleRefreshPlay() {
  document.getElementById("csVal").textContent = Number(csSlider.value).toFixed(1) + "%";
  document.getElementById("stVal").textContent = Number(stSlider.value).toFixed(1) + "×";
  clearTimeout(playTimer);
  playTimer = setTimeout(refreshPlay, 120);
}
csSlider.addEventListener("input", scheduleRefreshPlay);
stSlider.addEventListener("input", scheduleRefreshPlay);

async function refreshPlay() {
  const cs = Number(csSlider.value) / 100;
  const st = Number(stSlider.value);
  let d;
  try {
    d = await getJSON(`${API}/api/interactive?complier_share=${cs}&strength=${st}`);
  } catch (e) { return; }

  document.getElementById("fStat").textContent = fmt(d.f_stat, 0);
  const weak = d.f_stat < 10;
  document.getElementById("fNote").textContent = weak
    ? tr("太弱，答案會亂跳 ⚠（F<10）", "Too weak, the answer jumps around ⚠ (F<10)")
    : tr("夠力 ✓（F>10）", "Strong enough ✓ (F>10)");
  document.getElementById("fNote").style.color = weak ? "var(--red)" : "var(--green)";
  document.getElementById("ivEst").textContent = fmt(d.estimate, 2);
  document.getElementById("ivCi").textContent = `${fmt(d.ci[0], 2)} ~ ${fmt(d.ci[1], 2)}`;
  const width = d.ci[1] - d.ci[0];
  document.getElementById("ciNote").textContent = tr(`寬度 ${fmt(width, 2)}`, `width ${fmt(width, 2)}`);

  Plotly.react("playChart", [
    {
      x: [tr("IV 估計", "IV estimate")], y: [d.estimate],
      error_y: { type: "data", symmetric: false,
        array: [d.ci[1] - d.estimate], arrayminus: [d.estimate - d.ci[0]], color: "#6366f1", thickness: 3, width: 14 },
      type: "scatter", mode: "markers", marker: { size: 16, color: "#6366f1" }, name: "IV",
    },
  ], sceneLayout({
    margin: { t: 24, r: 20, b: 40, l: 50 }, showlegend: false,
    yaxis: { title: tr("估計效果", "Estimated effect"), range: [-2, 5], zeroline: true },
    shapes: [{ type: "line", x0: -0.5, x1: 0.5, y0: 1.8, y1: 1.8, line: { color: "#10b981", dash: "dash", width: 2 } }],
    annotations: [{ x: 0.45, y: 1.8, text: tr("真值 1.80", "truth 1.80"), showarrow: false, font: { color: "#10b981" }, yshift: 12 }],
  }), SCENE_CFG);
}

// ======================================================================
// 3. Analysis — data loading + column mapping
// ======================================================================
const dataStatus = document.getElementById("dataStatus");

function fillSelects() {
  const opts = state.columns.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["selY", "selA", "selZ", "selCov"].forEach((id) => { document.getElementById(id).innerHTML = opts; });
  document.getElementById("colMap").classList.remove("hidden");
}

function applyDefaults(d) {
  if (!d) return;
  document.getElementById("selY").value = d.outcome;
  document.getElementById("selA").value = d.treatment;
  document.getElementById("selZ").value = d.instrument;
  const cov = document.getElementById("selCov");
  [...cov.options].forEach((o) => { o.selected = d.covariates.includes(o.value); });
}

document.getElementById("useExample").addEventListener("click", async () => {
  try {
    const d = await getJSON(`${API}/api/example`);
    state.source = "example"; state.columns = d.columns;
    dataStatus.textContent = tr(
      `已載入內建接種提醒示範資料（${d.n} 筆，合成虛構）`,
      `Loaded built-in vaccine-reminder demo data (${d.n} rows, synthetic & fictional)`);
    fillSelects(); applyDefaults(d.defaults);
  } catch (e) { dataStatus.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});

document.getElementById("fileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  dataStatus.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    state.source = d.token; state.columns = d.columns;
    dataStatus.textContent = tr(`已上傳「${file.name}」（${d.n} 筆）`, `Uploaded "${file.name}" (${d.n} rows)`);
    fillSelects();
  } catch (e) { dataStatus.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});

function currentMapping() {
  return {
    source: state.source,
    outcome: document.getElementById("selY").value,
    treatment: document.getElementById("selA").value,
    instrument: document.getElementById("selZ").value,
    covariates: [...document.getElementById("selCov").selectedOptions].map((o) => o.value),
    lang: lang(),
  };
}

document.getElementById("runAnalyze").addEventListener("click", async () => {
  const req = currentMapping();
  try {
    const out = await postJSON(`${API}/api/analyze`, req);
    state.lastReq = req;
    renderAnalysis(out);
    runAssumptions(req);  // keep dashboard in sync
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
});

function renderAnalysis(out) {
  document.getElementById("analyzeOut").classList.remove("hidden");
  const ivCov = out.iv_with_covariates;
  const labels = [tr("未調整 naive", "Naive"), tr("Wald", "Wald"), tr("2SLS", "2SLS")];
  const vals = [out.naive.estimate, out.wald.estimate, out.iv.estimate];
  if (ivCov) { labels.push(tr("2SLS+共變項", "2SLS+covariates")); vals.push(ivCov.estimate); }
  const colors = vals.map((_, i) => (i === 0 ? "#ef4444" : "#6366f1"));

  Plotly.react("estChart", [{
    x: labels, y: vals, type: "bar",
    marker: { color: colors },
    text: vals.map((v) => fmt(v, 2)), textposition: "outside",
  }], sceneLayout({
    margin: { t: 30, r: 20, b: 50, l: 50 },
    yaxis: { title: tr("對結果的估計效果", "Estimated effect on the outcome") },
    shapes: [{ type: "line", x0: -0.5, x1: labels.length - 0.5, y0: out.iv.estimate, y1: out.iv.estimate,
               line: { color: "#10b981", dash: "dot", width: 1.5 } }],
    annotations: [
      { x: 0, y: vals[0], text: tr("被混淆帶偏", "confounded"), showarrow: false, font: { color: RED, size: 10.5 }, yshift: 18 },
      { x: labels.length - 1, y: out.iv.estimate, text: tr("IV 校正後", "IV-corrected"), showarrow: false, font: { color: GREEN }, yshift: 12, xanchor: "right" },
    ],
  }), SCENE_CFG);

  const FS = tr("第一階段（工具→處置）", "First stage (instrument→treatment)");
  const cards = [
    [tr("未調整迴歸（naive）", "Naive regression"), out.naive.estimate, out.naive.interpretation, false],
    [FS, out.first_stage.coef, out.first_stage.interpretation, false],
    [tr("簡化式（工具→結果）", "Reduced form (instrument→outcome)"), out.reduced_form.coef, out.reduced_form.interpretation, false],
    [tr("Wald 估計", "Wald estimate"), out.wald.estimate, out.wald.interpretation, false],
    [tr("2SLS（工具變數）", "2SLS (instrumental variable)"), out.iv.estimate, out.iv.interpretation, true],
  ];
  if (ivCov) cards.push([tr("2SLS + 共變項", "2SLS + covariates"), ivCov.estimate, ivCov.interpretation, false]);
  document.getElementById("resultCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, hl || t === FS ? 3 : 2)}</div><p>${desc}</p></div>`
  ).join("");
}

// ======================================================================
// 4. Assumptions dashboard
// ======================================================================
async function runAssumptions(req) {
  try {
    const out = await postJSON(`${API}/api/assumptions`, req);
    renderAssumptions(out);
  } catch (e) { /* ignore */ }
}

function renderAssumptions(out) {
  document.getElementById("assumeHint").classList.add("hidden");
  const ov = document.getElementById("overall");
  ov.classList.remove("hidden");
  ov.className = `overall st-${out.overall_status}`;
  ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${out.overall_status}"></span> ${out.overall_headline}`;

  document.getElementById("assumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) =>
      `<li>${m.name}<b>${m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}">
      <h3><span class="dot bg-${c.status}"></span>${c.title}
        <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p>
      <p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details>
    </div>`;
  }).join("");
}
function statusText(s) {
  const zh = { green: "通過", amber: "警示", red: "不符", info: "需判斷" };
  const en = { green: "Pass", amber: "Caution", red: "Fail", info: "Judgement" };
  return (lang() === "en" ? en : zh)[s] || s;
}

// ======================================================================
// 5. ML + IV demos
// ======================================================================
const TEAL = "#3f8268", AMBER = "#f59e0b", RED = "#ef4444", GREEN = "#10b981", INK = "#14283c";
const STATUS_COLOR = { good: TEAL, weak: AMBER, bad: RED, trap: AMBER };

// ---- deterministic seeded RNG for the "what does the data look like" mini charts ----
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function randn(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
const SCENE_CFG = { displayModeBar: false, responsive: true };
// ---------------------------------------------------------------------------
// One unified visual language for EVERY method's figures (IV/RDD/DiD/TiT/ITS/
// PERR + the comparison tab). All charts go through sceneLayout(), so fonts,
// font sizes, axes, gridlines, legends and annotation labels look identical
// across study designs. Per-call overrides are deep-merged onto these defaults.
// ---------------------------------------------------------------------------
const CHART_FONT = "system-ui, 'Noto Sans TC', 'Segoe UI', sans-serif";
const GRIDC = "#e6ebf1", ZLINEC = "#c3cedb", TICKC = "#475569";
const axisBase = () => ({
  gridcolor: GRIDC, zerolinecolor: ZLINEC, linecolor: ZLINEC,
  titlefont: { family: CHART_FONT, size: 12.5, color: INK },
  tickfont: { family: CHART_FONT, size: 11, color: TICKC }, automargin: true,
});
function sceneLayout(extra) {
  extra = extra || {};
  const _ink = INK;
  const base = {
    height: 300, margin: { t: 30, r: 18, b: 46, l: 56 }, showlegend: false,
    font: { family: CHART_FONT, size: 12, color: _ink },
    paper_bgcolor: "rgba(0,0,0,0)", plot_bgcolor: "rgba(0,0,0,0)",
    hoverlabel: { font: { family: CHART_FONT, size: 12 } },
    legend: { orientation: "h", y: 1.16, x: 0,
      font: { family: CHART_FONT, size: 11.5, color: _ink }, bgcolor: "rgba(0,0,0,0)" },
    xaxis: axisBase(), yaxis: axisBase(),
  };
  const out = Object.assign({}, base, extra);
  ["font", "hoverlabel", "title"].forEach((k) => { if (extra[k]) out[k] = Object.assign({}, base[k] || {}, extra[k]); });
  if (extra.legend) { out.legend = Object.assign({}, base.legend, extra.legend);
    out.legend.font = Object.assign({}, base.legend.font, extra.legend.font || {}); }
  ["xaxis", "yaxis", "xaxis2", "yaxis2"].forEach((k) => {
    if (extra[k]) { out[k] = Object.assign(axisBase(), extra[k]);
      if (extra[k].titlefont) out[k].titlefont = Object.assign({ family: CHART_FONT, size: 12.5, color: INK }, extra[k].titlefont); }
  });
  // give every annotation the same readable, consistent label font
  if (out.annotations) out.annotations = out.annotations.map((a) =>
    Object.assign({}, a, { font: Object.assign({ family: CHART_FONT, size: 11.5, color: INK }, a.font || {}) }));
  return out;
}

// ---------------------------------------------------------------------------
// Mechanism schematics for the ⑤ "AI remedies": small box-and-arrow diagrams
// that show HOW each advanced method actually works — cross-fitting, the
// doubly-robust (AIPW) score, and the two-stage counterfactual. Drawn with
// Plotly so they share the unified fonts and re-render bilingually on language
// flip. Reused across IV ⑤, RDD ⑤, DiD ⑤ and ITS ⑤.
// ---------------------------------------------------------------------------
const SCHEMA_PURPLE = "#7c3aed", SCHEMA_SLATE = "#64748b";
const SCHEMA_DUMMY = [{ x: [0], y: [0], mode: "markers", marker: { opacity: 0 }, hoverinfo: "skip" }];
const _box = (x0, y0, x1, y1, fill, line) =>
  ({ type: "rect", x0, y0, x1, y1, fillcolor: fill, line: { color: line, width: 1.5 }, layer: "below" });
const _lbl = (x, y, text, color, size) =>
  ({ x, y, text, showarrow: false, align: "center", font: { size: size || 11, color: color || INK } });
const _arrow = (x0, y0, x1, y1) =>
  ({ x: x1, y: y1, ax: x0, ay: y0, xref: "x", yref: "y", axref: "x", ayref: "y",
     text: "", showarrow: true, arrowhead: 3, arrowsize: 1.1, arrowwidth: 2, arrowcolor: SCHEMA_SLATE });
const schemaLayout = (extra) => sceneLayout(Object.assign({
  height: 240, margin: { t: 26, r: 12, b: 10, l: 12 },
  xaxis: { visible: false, range: [0, 10], fixedrange: true },
  yaxis: { visible: false, range: [0, 10], fixedrange: true },
}, extra || {}));

const _circle = (cx, cy, r, fill, line) =>
  ({ type: "circle", x0: cx - r, y0: cy - r, x1: cx + r, y1: cy + r, fillcolor: fill, line: { color: line || fill, width: 1.5 } });
const _curve = (d, color, width, dash) =>
  ({ type: "path", path: d, line: { color: color, width: width || 3, dash: dash || "solid" } });

// CROSS-FITTING — illustrated as the danger it prevents: a model that "memorises
// the noise". The red wiggle threads every dot (looks perfect on what it saw) but
// strays from the true green curve. Cross-fitting always scores on unseen people,
// so it can't cheat like that.
// Cross-fitting illustrated as the K-fold ROTATION it actually is: split people
// into K folds; each round, TRAIN on the other folds (green) and SCORE the one
// held-out fold (amber, never seen). After K rounds every person was scored by a
// model that never trained on them — so it can't "memorise the answers".
function drawCrossfit(elId) {
  if (!document.getElementById(elId)) return;
  const K = 5;
  const TRAIN = "#d7ece3", TRAINB = "#3f8268", TRAINTX = "#2f6149";
  const SCORE = "#fde6c2", SCOREB = "#e08e10", SCORETX = "#b45309";
  const shapes = [], anns = [];
  for (let r = 0; r < K; r++) {
    const yc = K - r;                       // round 0 at top
    for (let c = 0; c < K; c++) {
      const xc = c + 1;                      // folds 1..K left→right
      const held = (c === r);                // diagonal = held-out (scored) fold
      shapes.push({ type: "rect", x0: xc - 0.46, x1: xc + 0.46, y0: yc - 0.4, y1: yc + 0.4,
        fillcolor: held ? SCORE : TRAIN, line: { color: held ? SCOREB : TRAINB, width: held ? 2 : 1.2 } });
      anns.push(_lbl(xc, yc, held ? tr("評分", "score") : tr("訓練", "train"),
        held ? SCORETX : TRAINTX, 9.5));
    }
    anns.push(Object.assign(_lbl(0.05, yc, tr("第 " + (r + 1) + " 回", "round " + (r + 1)), INK, 9.5),
      { xanchor: "left" }));
  }
  for (let c = 0; c < K; c++) anns.push(_lbl(c + 1, K + 0.78, tr("組 " + (c + 1), "fold " + (c + 1)), "#64748b", 9.5));
  // bottom plain-language takeaway
  anns.push(_lbl((K + 1) / 2, -0.05, tr(
    "每回合：用「其他組（綠）」訓練 → 對「留下這組（琥珀，沒看過的人）」評分。",
    "Each round: train on the OTHER folds (green) → score the held-out fold (amber, never seen)."), INK, 10));
  anns.push(_lbl((K + 1) / 2, -0.65, tr(
    "輪完 5 回，每個人都只被「沒看過他的模型」評分 → 不會背答案、去偏。",
    "After all 5 rounds, every person was scored by a model that never saw them → no memorising, debiased."), INK, 10));
  Plotly.react(elId, [{ x: [null], y: [null], mode: "markers", type: "scatter", showlegend: false }], schemaLayout({
    height: 300, shapes, annotations: anns, showlegend: false,
    xaxis: { visible: false, range: [-0.2, K + 0.6], fixedrange: true },
    yaxis: { visible: false, range: [-1.1, K + 1.1], fixedrange: true },
    margin: { t: 40, r: 14, b: 14, l: 14 },
    title: { text: tr("交叉擬合：把人分成 5 組，輪流訓練與評分", "Cross-fitting: split people into 5 folds, rotate train ↔ score"),
             font: { size: 12.5 }, x: 0.5, xanchor: "center" },
  }), SCENE_CFG);
}

// DOUBLY-ROBUST — a real statistical illustration. We plot the actual estimate
// (with its CI) under five scenarios; the truth is the green line. The point: as
// long as EITHER the propensity OR the outcome model is right, the estimate lands
// ON the truth (unbiased). Only when BOTH are wrong does it miss.
function drawDoublyRobust(elId) {
  if (!document.getElementById(elId)) return;
  const truth = 2.0;
  const rows = [
    { y: 5, label: tr("未校正：兩個都沒校正", "naive: neither adjusted"), est: 3.15, ci: 0.30, ok: false },
    { y: 4, label: tr("只有 ① 傾向模型對", "only ① propensity right"), est: 2.05, ci: 0.34, ok: true },
    { y: 3, label: tr("只有 ② 結果模型對", "only ② outcome right"), est: 1.94, ci: 0.33, ok: true },
    { y: 2, label: tr("兩個都對", "both right"), est: 2.0, ci: 0.26, ok: true },
    { y: 1, label: tr("兩個都錯", "both wrong"), est: 1.42, ci: 0.31, ok: false },
  ];
  const pack = (sel, color, sym, name) => {
    const r = rows.filter(sel);
    return {
      x: r.map((d) => d.est), y: r.map((d) => d.y), mode: "markers", type: "scatter",
      marker: { color, size: 13, symbol: sym, line: { color: "#fff", width: 1 } },
      error_x: { type: "data", array: r.map((d) => d.ci), color, thickness: 1.6, width: 6 },
      name, hoverinfo: "skip",
    };
  };
  const traces = [
    pack((d) => d.ok, "#3f8268", "circle", tr("命中真值（不偏）", "on truth (unbiased)")),
    pack((d) => !d.ok, "#f59e0b", "diamond", tr("偏掉", "biased")),
  ];
  const shapes = [
    { type: "rect", x0: truth - 0.18, x1: truth + 0.18, y0: 0.4, y1: 5.6, fillcolor: "rgba(16,185,129,0.10)", line: { width: 0 }, layer: "below" },
    { type: "line", x0: truth, x1: truth, y0: 0.4, y1: 5.6, line: { color: GREEN, width: 2, dash: "dash" } },
  ];
  const anns = rows.map((d) =>
    Object.assign(_lbl(0.45, d.y, d.label, d.ok ? "#2f6149" : "#9a3412", 10.5), { xanchor: "left" }));
  anns.push(Object.assign(_lbl(truth, 5.75, tr("真值", "truth"), GREEN, 10.5), { xanchor: "center" }));
  anns.push(_lbl(truth, 0.35, tr(
      "<b>綠</b>＝① 傾向模型 或 ② 結果模型「至少一個對」→ 雙重穩健命中真值<br><b>黃</b>＝兩個都沒對（或根本沒校正）→ 雙重穩健沒東西可靠，才會偏",
      "<b>Green</b> = ① propensity OR ② outcome — at least one right → DR hits the truth<br><b>Yellow</b> = neither right (or no adjustment) → DR has nothing to lean on, so it's biased"),
      INK, 9.5));
  Plotly.react(elId, traces, schemaLayout({
    height: 290, shapes, annotations: anns, showlegend: true, legend: { orientation: "h", y: 1.16 },
    xaxis: { visible: true, title: tr("估出的效果", "estimated effect"), range: [0.6, 3.8], fixedrange: true },
    yaxis: { visible: false, range: [-0.3, 6.2] },
    margin: { t: 40, r: 16, b: 38, l: 16 },
    title: { text: tr("雙重穩健：兩個模型，有一個對就命中真值", "Doubly-robust: two models — either one right hits the truth"),
             font: { size: 11.5 }, x: 0.5, xanchor: "center" },
  }), SCENE_CFG);
}

// TWO-STAGE COUNTERFACTUAL — illustrated as a real time series: learn the pre-trend,
// extrapolate the dashed "no-intervention" line, and the gap to the observed post
// points IS the effect.
function drawTwoStage(elId) {
  if (!document.getElementById(elId)) return;
  const rng = mulberry32(5);
  const f = (x) => 1.8 + 0.62 * x;          // underlying pre-trend (the counterfactual)
  const drop = 2.2;                          // the intervention's effect (a drop)
  const preX = [], preY = [], cfX = [], cfY = [], postX = [], postY = [];
  for (let x = 0; x <= 10; x += 0.5) {
    if (x < 6) { preX.push(x); preY.push(f(x) + randn(rng) * 0.28); }
    else { cfX.push(x); cfY.push(f(x)); postX.push(x); postY.push(f(x) - drop + randn(rng) * 0.28); }
  }
  const traces = [
    { x: preX, y: preY, mode: "markers", type: "scatter", name: tr("介入前（觀測）", "pre (observed)"), marker: { color: TEAL, size: 7 } },
    { x: [0, 6], y: [f(0), f(6)], mode: "lines", type: "scatter", showlegend: false, line: { color: TEAL, width: 3 } },
    { x: [6].concat(cfX), y: [f(6)].concat(cfY), mode: "lines", type: "scatter",
      name: tr("反事實：沒介入會怎樣", "counterfactual: if no intervention"), line: { color: SCHEMA_PURPLE, width: 3, dash: "dash" } },
    { x: postX, y: postY, mode: "markers", type: "scatter", name: tr("介入後（觀測）", "post (observed)"),
      marker: { color: "#2f6149", size: 8, symbol: "diamond" } },
  ];
  const shapes = [{ type: "line", x0: 6, y0: 0, x1: 6, y1: 10, line: { color: "#94a3b8", width: 1.5, dash: "dot" } }];
  const cf9 = f(9), ob9 = f(9) - drop;
  const anns = [
    _lbl(6, 9.5, tr("介入", "intervention"), INK, 10),
    Object.assign(_arrow(9, cf9, 9, ob9), { arrowcolor: "#dc2626", arrowwidth: 2.2 }),
    Object.assign(_lbl(9.15, (cf9 + ob9) / 2, tr("效果", "effect"), "#dc2626", 11), { xanchor: "left" }),
    _lbl(2.7, 1.0, tr("① 用介入前學趨勢", "① learn the pre-trend"), "#2f6149", 10.5),
    _lbl(7.7, 9.0, tr("② 外推反事實（虛線）", "② extrapolate it (dashed)"), "#6d28d9", 10.5),
  ];
  Plotly.react(elId, traces, schemaLayout({
    height: 300, shapes, annotations: anns, showlegend: true, legend: { orientation: "h", y: 1.2 },
    xaxis: { visible: true, title: tr("時間", "time"), range: [-0.3, 10.6], fixedrange: true },
    yaxis: { visible: true, title: tr("結果", "outcome"), range: [0, 10], fixedrange: true },
    margin: { t: 50, r: 16, b: 40, l: 44 },
    title: { text: tr("兩階段反事實：學過去 → 畫出「沒介入會怎樣」→ 量差距",
                      "Two-stage: learn the past → draw the no-intervention line → read the gap"),
             font: { size: 11.5 }, x: 0.5, xanchor: "center" },
  }), SCENE_CFG);
}

// AFT illustration — the treatment "stretches" the WHOLE event-time distribution
// (two survival curves; the treated one is the control curve scaled later in time).
function drawAFT(elId) {
  if (!document.getElementById(elId)) return;
  const FACTOR = 1.7;
  const S = (t, sc) => Math.exp(-Math.pow(t / (3.0 * sc), 1.6));
  const tx = [], cy = [], ty = [];
  for (let t = 0; t <= 10; t += 0.15) { tx.push(t); cy.push(S(t, 1)); ty.push(S(t, FACTOR)); }
  const med = (sc) => 3.0 * sc * Math.pow(Math.log(2), 1 / 1.6);
  const mC = med(1), mT = med(FACTOR);
  const traces = [
    { x: tx, y: cy, mode: "lines", type: "scatter", name: tr("沒處置（對照）", "control"), line: { color: "#94a3b8", width: 3 } },
    { x: tx, y: ty, mode: "lines", type: "scatter", name: tr("有處置：時間被拉長", "treated: time stretched"), line: { color: TEAL, width: 3 } },
  ];
  const shapes = [{ type: "line", x0: 0, y0: 0.5, x1: 10, y1: 0.5, line: { color: "#cbd5e1", width: 1, dash: "dot" } }];
  const anns = [
    Object.assign(_arrow(mC, 0.5, mT, 0.5), { arrowcolor: "#dc2626", arrowwidth: 2.2 }),
    _lbl((mC + mT) / 2, 0.6, tr("×1.7：中位事件時間延後", "×1.7 later median event time"), "#dc2626", 10),
    _lbl(5, 0.98, tr("AFT：把「整段事件時間」往後拉長（不只比一個平均）", "AFT: stretch the WHOLE event-time distribution (not just a mean)"), INK, 9.5),
  ];
  Plotly.react(elId, traces, schemaLayout({
    height: 300, shapes, annotations: anns, showlegend: true, legend: { orientation: "h", y: 1.2 },
    xaxis: { visible: true, title: tr("時間（追蹤多久）", "time"), range: [0, 10], fixedrange: true },
    yaxis: { visible: true, title: tr("還沒發生事件的比例", "still event-free"), range: [0, 1.12], fixedrange: true },
    margin: { t: 40, r: 18, b: 40, l: 52 },
  }), SCENE_CFG);
}

// IPCW illustration — a group of people with SIMILAR covariates. Some are
// censored before their event is seen (✂ + faded dashed = unobserved). At each
// OBSERVED event (●), the event is up-weighted (×1/P[uncensored]) so it also
// "stands in" for the similar people who were censored before their own event.
function drawIPCW(elId) {
  if (!document.getElementById(elId)) return;
  // y rows, top→bottom. cens = censored before event; event = observed event (up-weighted).
  const GREYLINE = "#9aa6b2";
  const rows = [
    { y: 5, kind: "event", obs: 8.6 },
    { y: 4, kind: "cens", obs: 3.4, would: 7.8 },
    { y: 3, kind: "event", obs: 6.6 },
    { y: 2, kind: "cens", obs: 2.6, would: 9.0 },
    { y: 1, kind: "event", obs: 7.6 },
  ];
  const nCens = rows.filter((r) => r.kind === "cens").length;
  const nEvt = rows.filter((r) => r.kind === "event").length;
  const W = (1 + nCens / nEvt); // each observed event also represents its share of the censored → weight ≈ 1.67×
  const shapes = [], evX = [], evY = [], csX = [], csY = [];
  rows.forEach((r) => {
    // solid observed segment
    shapes.push({ type: "line", x0: 0.6, y0: r.y, x1: r.obs, y1: r.y,
      line: { color: GREYLINE, width: 3 } });
    if (r.kind === "cens") {
      // faded dashed continuation to the would-be (unobserved) event
      shapes.push({ type: "line", x0: r.obs, y0: r.y, x1: r.would, y1: r.y,
        line: { color: GREYLINE, width: 2, dash: "dot" }, opacity: 0.4 });
      csX.push(r.obs); csY.push(r.y);
    } else {
      evX.push(r.obs); evY.push(r.y);
    }
  });
  const traces = [
    { x: evX, y: evY, mode: "markers", type: "scatter", name: tr("● 看到的事件（被加重）", "● observed event (up-weighted)"),
      marker: { color: RED, size: 15, line: { color: "#7f1d1d", width: 1.5 } } },
    { x: csX, y: csY, mode: "markers", type: "scatter", name: tr("✂ 事件前先被設限", "✂ censored before event"),
      marker: { color: "#64748b", size: 13, symbol: "line-ns-open", line: { width: 3 } } },
  ];
  // weight badge next to each observed event
  const anns = [];
  rows.filter((r) => r.kind === "event").forEach((r) => {
    anns.push(Object.assign(_lbl(r.obs + 0.25, r.y, "×" + W.toFixed(1), "#b91c1c", 11), { xanchor: "left", yanchor: "middle" }));
  });
  // left bracket label: similar covariates
  anns.push(Object.assign(_lbl(0.0, 3, tr("一群特徵相近的人", "people with similar covariates"), INK, 10.5),
    { textangle: -90, xanchor: "center", yanchor: "middle" }));
  // ✂ explanation on the censored rows
  rows.filter((r) => r.kind === "cens").forEach((r) => {
    anns.push(Object.assign(_lbl((r.obs + r.would) / 2, r.y + 0.32, tr("┄ 本來會發生（沒看到）", "┄ event would occur (unseen)"), "#64748b", 9), { xanchor: "center" }));
  });
  anns.push(_lbl(5, 6.2, tr(
    "在事件(●)上加重 → 替提早設限(✂)者補回",
    "weight events (●) → stand in for censored (✂)"), INK, 10.5));
  Plotly.react(elId, traces, schemaLayout({
    height: 300, shapes, annotations: anns, showlegend: true, legend: { orientation: "h", y: 1.16 },
    xaxis: { visible: true, title: tr("追蹤時間", "follow-up time"), range: [0, 10.6], fixedrange: true },
    yaxis: { visible: false, range: [0, 6.7] },
    margin: { t: 34, r: 20, b: 38, l: 40 },
  }), SCENE_CFG);
}

// scene 1 (IV remedy 1): illustrate the STACKING — one weak force = two
// overlapping humps (can't tell apart); stack a dozen and the two groups
// (nudged vs not) separate into a clear strong signal.
function drawSceneWeak() {
  if (!document.getElementById("sceneWeak")) return;
  const hump = (mu, base, color) => {
    const xs = [], ys = [], sd = 1.0, amp = 1.9;
    for (let x = 0; x <= 10; x += 0.2) { xs.push(x); ys.push(base + amp * Math.exp(-Math.pow(x - mu, 2) / (2 * sd * sd))); }
    xs.push(10, 0); ys.push(base, base);
    return { x: xs, y: ys, fill: "toself", fillcolor: color, line: { color: "rgba(0,0,0,0)" },
      mode: "lines", type: "scatter", hoverinfo: "skip", showlegend: false };
  };
  const GREY = "rgba(100,116,139,0.45)", TL = "rgba(13,148,136,0.55)";
  const rows = [
    { base: 7.0, sep: 0.35, label: tr("① 單一弱外力", "① one weak force") },
    { base: 3.8, sep: 1.4, label: tr("② 疊加幾個", "② stack a few") },
    { base: 0.6, sep: 2.9, label: tr("③ AI 合成十幾個", "③ AI fuses a dozen") },
  ];
  const traces = [];
  rows.forEach((r) => { traces.push(hump(5 - r.sep, r.base, GREY)); traces.push(hump(5 + r.sep, r.base, TL)); });
  const anns = [
    Object.assign(_lbl(0.1, 9.4, tr("● 有被推", "● nudged"), "#3f8268", 10.5), { xanchor: "left" }),
    Object.assign(_lbl(2.6, 9.4, tr("● 沒被推", "● not nudged"), "#64748b", 10.5), { xanchor: "left" }),
  ];
  rows.forEach((r) => anns.push(Object.assign(_lbl(0.1, r.base + 2.45, r.label, INK, 11), { xanchor: "left" })));
  anns.push(_lbl(5, rows[0].base - 0.05, tr("兩團幾乎重疊 → 分不出誰會打針", "almost fully overlapping → can't tell who gets the shot"), "#dc2626", 10));
  anns.push(_lbl(5, rows[2].base - 0.05, tr("兩團清楚分開 → 看得出誰會打針（＝強外力）", "clearly separated → you can tell who gets the shot (strong)"), "#15803d", 10));
  anns.push(Object.assign(_arrow(0.7, 6.95, 0.7, 5.95), { arrowcolor: "#94a3b8" }));
  anns.push(Object.assign(_lbl(0.95, 6.45, tr("疊加", "stack"), "#64748b", 9.5), { xanchor: "left" }));
  anns.push(Object.assign(_arrow(0.7, 3.75, 0.7, 2.75), { arrowcolor: "#94a3b8" }));
  anns.push(Object.assign(_lbl(0.95, 3.25, tr("再疊加", "stack more"), "#64748b", 9.5), { xanchor: "left" }));
  Plotly.react("sceneWeak", traces, schemaLayout({
    height: 330, annotations: anns,
    xaxis: { visible: false, range: [0, 10] }, yaxis: { visible: false, range: [0, 10] },
    margin: { t: 38, r: 12, b: 10, l: 12 },
    title: { text: tr("疊加：很多「分不開」的弱外力 → 合成一個「分得開」的強外力",
                      "Stacking: many indistinguishable weak forces → one separable strong force"),
             font: { size: 11.5 }, x: 0.5, xanchor: "center" },
  }), SCENE_CFG);
}

// scene 2 (IV remedy 2): hill-shaped first stage — distance vs uptake
function drawSceneBend() {
  if (!document.getElementById("sceneBend")) return;
  const rng = mulberry32(202);
  const xs = [], ys = [];
  for (let i = 0; i < 90; i++) {
    const d = rng() * 10;                 // distance 0..10 km
    const hill = Math.exp(-Math.pow((d - 5) / 2.4, 2)); // peak at 5
    const yv = 0.12 + 0.7 * hill + randn(rng) * 0.06;
    xs.push(d); ys.push(yv);
  }
  const cx = [], cy = [];
  for (let d = 0; d <= 10; d += 0.2) { cx.push(d); cy.push(0.12 + 0.7 * Math.exp(-Math.pow((d - 5) / 2.4, 2))); }
  const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;
  const dots = { x: xs, y: ys, mode: "markers", type: "scatter", marker: { color: "#9aa6b2", size: 6, opacity: 0.7 } };
  const curve = { x: cx, y: cy, mode: "lines", type: "scatter", line: { color: TEAL, width: 3 } };
  const flat = { x: [0, 10], y: [meanY, meanY], mode: "lines", type: "scatter", line: { color: AMBER, width: 2, dash: "dash" } };
  Plotly.react("sceneBend", [dots, flat, curve], sceneLayout({
    xaxis: { title: tr("離快打車距離 (km)", "distance to van (km)"), range: [-0.3, 10.3] },
    yaxis: { title: tr("打針率", "uptake"), range: [0, 1] },
  }), SCENE_CFG);
}

// scene 3 (IV remedy 3): overfitting — red wiggle threads every point vs green truth
function drawSceneOverfit() {
  if (!document.getElementById("sceneOverfit")) return;
  const rng = mulberry32(303);
  const xs = [], ys = [];
  const truth = (x) => 0.5 + 0.35 * Math.sin(x * 0.9);
  for (let i = 0; i < 22; i++) {
    const x = (i / 21) * 10;
    xs.push(x); ys.push(truth(x) + randn(rng) * 0.16);
  }
  // green dashed truth
  const tx = [], ty = [];
  for (let x = 0; x <= 10; x += 0.1) { tx.push(x); ty.push(truth(x)); }
  // red wiggle: piecewise through every point (Catmull-Rom-ish via plotly spline)
  const dots = { x: xs, y: ys, mode: "markers", type: "scatter", marker: { color: INK, size: 7 } };
  const truthLine = { x: tx, y: ty, mode: "lines", type: "scatter", line: { color: GREEN, width: 3, dash: "dash" } };
  const wiggle = { x: xs, y: ys, mode: "lines", type: "scatter", line: { color: RED, width: 2, shape: "spline", smoothing: 1.3 } };
  Plotly.react("sceneOverfit", [truthLine, wiggle, dots], sceneLayout({
    xaxis: { title: tr("外力強度", "nudge strength"), range: [-0.3, 10.3] },
    yaxis: { title: tr("反應", "response"), range: [-0.2, 1.3] },
  }), SCENE_CFG);
}

// scene 4 (RDD remedy 1): sloped trend + jump at 65, wide window band
function drawSceneTrend() {
  if (!document.getElementById("sceneTrend")) return;
  const rng = mulberry32(404);
  const xl = [], yl = [], xr = [], yr = [];
  for (let i = 0; i < 120; i++) {
    const age = 45 + rng() * 40;          // 45..85
    const elig = age >= 65 ? 1 : 0;
    const yv = 0.42 * (age - 65) / 5 + 1.8 * elig + randn(rng) * 1.4 + 6;
    if (elig) { xr.push(age); yr.push(yv); } else { xl.push(age); yl.push(yv); }
  }
  const left = { x: xl, y: yl, mode: "markers", type: "scatter", marker: { color: "#9aa6b2", size: 5, opacity: 0.7 } };
  const right = { x: xr, y: yr, mode: "markers", type: "scatter", marker: { color: TEAL, size: 5, opacity: 0.7 } };
  Plotly.react("sceneTrend", [left, right], sceneLayout({
    xaxis: { title: tr("年齡", "age"), range: [44, 86] },
    yaxis: { title: tr("結果", "outcome") },
    shapes: [
      { type: "rect", x0: 53, x1: 77, y0: 0, y1: 1, yref: "paper", fillcolor: AMBER, opacity: 0.1, line: { width: 0 } },
      { type: "line", x0: 65, x1: 65, y0: 0, y1: 1, yref: "paper", line: { color: INK, width: 1.5, dash: "dot" } },
    ],
    annotations: [{ x: 65, y: 1, yref: "paper", text: tr("65 歲斷點", "cutoff 65"), showarrow: false, font: { size: 11, color: INK }, yshift: 6 }],
  }), SCENE_CFG);
}

// scene 5 (RDD remedy 2): swimmer plot — events vs censoring, frail censored earlier
function drawSceneCensor() {
  if (!document.getElementById("sceneCensor")) return;
  const rng = mulberry32(505);
  const lines = [], dashes = [], eventX = [], eventY = [], censX = [], censY = [];
  const n = 14, GREYLINE = "#9aa6b2", XMAX = 11;
  for (let i = 0; i < n; i++) {
    const frail = rng() < 0.5;                       // timing still varies; just not coloured
    const eventTime = (frail ? 2 + rng() * 5 : 4 + rng() * 6);
    const censTime = (frail ? 2 + rng() * 3 : 5 + rng() * 5);
    const observed = Math.min(eventTime, censTime);
    const isEvent = eventTime <= censTime;
    lines.push({ x: [0, observed], y: [i, i], mode: "lines", type: "scatter", line: { color: GREYLINE, width: 3 }, hoverinfo: "skip" });
    if (isEvent) { eventX.push(observed); eventY.push(i); }
    else {
      censX.push(observed); censY.push(i);
      dashes.push({ x: [observed, Math.min(eventTime, XMAX - 0.2)], y: [i, i], mode: "lines", type: "scatter",
        line: { color: GREYLINE, width: 2, dash: "dot" }, opacity: 0.4, hoverinfo: "skip" });  // unobserved-after-censoring
    }
  }
  const events = { x: eventX, y: eventY, mode: "markers", type: "scatter", marker: { color: RED, size: 9, symbol: "circle" }, name: "event" };
  const cens = { x: censX, y: censY, mode: "markers", type: "scatter", marker: { color: "#64748b", size: 11, symbol: "line-ns-open", line: { width: 2 } }, name: "censored" };
  Plotly.react("sceneCensor", lines.concat(dashes, [events, cens]), sceneLayout({
    xaxis: { title: tr("追蹤時間", "follow-up time"), range: [0, XMAX], zeroline: false },
    yaxis: { showticklabels: false, range: [-1, n], title: tr("每條線＝一個人", "each line = a person") },
    annotations: [
      { x: 10.6, y: n - 1, text: "● " + tr("事件", "event"), showarrow: false, font: { size: 11, color: RED }, xanchor: "right" },
      { x: 10.6, y: n - 2.3, text: "| " + tr("設限", "censored"), showarrow: false, font: { size: 11, color: INK }, xanchor: "right" },
      { x: 10.6, y: n - 3.6, text: "┄ " + tr("設限後（未觀測）", "after censoring (unobserved)"), showarrow: false, font: { size: 10, color: "#94a3b8" }, xanchor: "right" },
    ],
  }), SCENE_CFG);
}

// rddplay ② intro: what censored time-to-event data looks like (swimmer plot).
// Each row is a person's follow-up; ● = the event happened, | = censored
// (follow-up ended event-free). Frail people (amber) tend to be censored earlier.
function drawSceneSurvIntro() {
  if (!document.getElementById("sceneSurvIntro")) return;
  const rng = mulberry32(606);
  const traces = [], dashes = [], evX = [], evY = [], cX = [], cY = [];
  const n = 16, GREYLINE = "#7e8a98", XMAX = 11.6;
  for (let i = 0; i < n; i++) {
    const frail = rng() < 0.5;                       // timing still varies; just not coloured
    const eventTime = frail ? 2 + rng() * 5 : 4.5 + rng() * 6;
    const censTime = frail ? 2 + rng() * 3.5 : 5 + rng() * 5.5;
    const observed = Math.min(eventTime, censTime, 11);
    const isEvent = eventTime <= censTime && eventTime <= 11;
    traces.push({ x: [0, observed], y: [i, i], mode: "lines", type: "scatter",
      line: { color: GREYLINE, width: 3 }, hoverinfo: "skip" });
    if (isEvent) { evX.push(observed); evY.push(i); }
    else {
      cX.push(observed); cY.push(i);
      dashes.push({ x: [observed, Math.min(eventTime, XMAX - 0.3)], y: [i, i], mode: "lines", type: "scatter",
        line: { color: GREYLINE, width: 2, dash: "dot" }, opacity: 0.4, hoverinfo: "skip" });  // unobserved-after-censoring
    }
  }
  const events = { x: evX, y: evY, mode: "markers", type: "scatter",
    marker: { color: RED, size: 10, symbol: "circle" } };
  const cens = { x: cX, y: cY, mode: "markers", type: "scatter",
    marker: { color: "#64748b", size: 13, symbol: "line-ns-open", line: { width: 2.5 } } };
  Plotly.react("sceneSurvIntro", traces.concat(dashes, [events, cens]), sceneLayout({
    xaxis: { title: tr("追蹤時間（年）", "follow-up time (years)"), range: [0, XMAX], zeroline: false },
    yaxis: { showticklabels: false, range: [-1, n], title: tr("每條線＝一個人", "each line = a person") },
    annotations: [
      { x: 11.4, y: n - 1, text: "● " + tr("事件發生", "event"), showarrow: false, font: { size: 11, color: RED }, xanchor: "right" },
      { x: 11.4, y: n - 2.4, text: "| " + tr("被設限", "censored"), showarrow: false, font: { size: 11, color: INK }, xanchor: "right" },
      { x: 11.4, y: n - 3.8, text: "┄ " + tr("設限後（未觀測）", "after censoring (unobserved)"), showarrow: false, font: { size: 10, color: "#94a3b8" }, xanchor: "right" },
    ],
  }), SCENE_CFG);
}

function drawIvScenes() { drawSceneWeak(); drawSceneBend(); drawSceneOverfit(); }
function drawRddScenes() { drawSceneTrend(); drawSceneCensor(); }

let mlReady = false;
const kSlider = document.getElementById("kSlider");
const psSlider = document.getElementById("psSlider");
let synTimer = null;

function initMl() {
  if (mlReady) return;
  mlReady = true;
  drawIvScenes();
  refreshSynthesis();
  drawCrossfit("ivCfDiagram");
}

function scheduleSynthesis() {
  document.getElementById("kVal").textContent = kSlider.value;
  document.getElementById("psVal").textContent = Number(psSlider.value).toFixed(1) + "%";
  clearTimeout(synTimer);
  synTimer = setTimeout(refreshSynthesis, 150);
}
kSlider.addEventListener("input", scheduleSynthesis);
psSlider.addEventListener("input", scheduleSynthesis);

async function refreshSynthesis() {
  const k = Number(kSlider.value);
  const ps = Number(psSlider.value) / 100;
  let d;
  try {
    d = await getJSON(`${API}/api/ml_synthesis?k_candidates=${k}&per_strength=${ps}`);
  } catch (e) { return; }

  document.getElementById("synSingleF").textContent = fmt(d.max_single_F, 1);
  const mlivF = d.mliv_crossfit.f_stat;
  const mEl = document.getElementById("synMlivF");
  mEl.textContent = fmt(mlivF, 1);
  mEl.style.color = mlivF >= 10 ? TEAL : AMBER;
  const est = d.mliv_crossfit.estimate, ci = d.mliv_crossfit.ci;
  document.getElementById("synEst").textContent = fmt(est, 2);
  document.querySelector("#synEst").parentElement.querySelector(".stat-foot").textContent =
    tr(`誤差範圍 ${fmt(ci[0], 1)} ~ ${fmt(ci[1], 1)}（真值 1.80）`,
       `margin ${fmt(ci[0], 1)} ~ ${fmt(ci[1], 1)} (truth 1.80)`);

  const labels = d.per_candidate_F.map((_, i) => tr(`外力${i + 1}`, `force ${i + 1}`)).concat([tr("AI 合成", "AI synthesis")]);
  const yvals = d.per_candidate_F.concat([mlivF]);
  const colors = d.per_candidate_F.map(() => "#9ca3af").concat([TEAL]);
  Plotly.react("synChart", [{
    x: labels, y: yvals, type: "bar", marker: { color: colors },
    text: yvals.map((v) => fmt(v, 0)), textposition: "outside",
  }], sceneLayout({
    margin: { t: 24, r: 20, b: 50, l: 50 },
    yaxis: { title: tr("外力強度（F 統計量）", "Force strength (F statistic)") },
    shapes: [{ type: "line", x0: -0.5, x1: labels.length - 0.5, y0: 10, y1: 10,
               line: { color: RED, dash: "dash", width: 1.5 } }],
    annotations: [{ x: 0, y: 10, text: tr("及格線 10", "pass line 10"), showarrow: false, font: { color: RED, size: 11 }, yshift: 10, xanchor: "left" }],
  }), SCENE_CFG);
}

document.getElementById("runNonlinear").addEventListener("click", async () => {
  let d;
  try { d = await getJSON(`${API}/api/ml_nonlinear`); }
  catch (e) { alert(tr("執行失敗：", "Run failed: ") + e.message); return; }
  state.nlData = d;
  renderNonlinear(d);
});

function renderNonlinear(d) {
  document.getElementById("nlOut").classList.remove("hidden");
  const linF = d.linear_first_stage_F, flexF = d.flexible_first_stage_F;
  document.getElementById("nlLinF").textContent = fmt(linF, 1);
  document.getElementById("nlLinNote").textContent = linF < 10
    ? tr("抓不到 ⚠（F<10）", "can't catch it ⚠ (F<10)") : tr("夠力", "strong enough");
  document.getElementById("nlLinNote").style.color = linF < 10 ? RED : TEAL;
  document.getElementById("nlFlexF").textContent = fmt(flexF, 1);
  document.getElementById("nlFlexNote").textContent = flexF >= 10
    ? tr("抓到了 ✓（F>10）", "caught it ✓ (F>10)") : tr("仍偏弱", "still weak");
  document.getElementById("nlFlexNote").style.color = flexF >= 10 ? TEAL : AMBER;
  document.getElementById("nlFlexEst").textContent = fmt(d.flexible.estimate, 2);

  Plotly.react("nlChart", [
    { x: d.curve.dist, y: d.curve.line, type: "scatter", mode: "lines",
      name: tr("硬用直線", "forced straight line"), line: { color: "#3b82f6", width: 3 } },
    { x: d.curve.dist, y: d.curve.flex, type: "scatter", mode: "lines",
      name: tr("讓它可以彎", "let it bend"), line: { color: TEAL, width: 3 } },
  ], sceneLayout({
    margin: { t: 24, r: 20, b: 45, l: 55 },
    xaxis: { title: tr("離快打巡迴車的距離（公里）", "Distance to the mobile vaccination van (km)") },
    yaxis: { title: tr("去打針的機率", "Probability of getting vaccinated") },
    legend: { orientation: "h", y: 1.12 },
  }), SCENE_CFG);
}

document.getElementById("runMlCompare").addEventListener("click", async () => {
  await runMlCompare();
});

async function runMlCompare() {
  let d;
  try { d = await getJSON(`${API}/api/ml_compare?lang=${lang()}`); }
  catch (e) { alert(tr("執行失敗：", "Run failed: ") + e.message); return; }
  state.cmpDone = true;
  document.getElementById("mlCompareOut").classList.remove("hidden");

  const labels = d.bars.map((b) => b.label);
  const vals = d.bars.map((b) => b.estimate);
  const colors = d.bars.map((b) => STATUS_COLOR[b.status] || INK);
  const errPlus = d.bars.map((b) => (b.ci ? b.ci[1] - b.estimate : 0));
  const errMinus = d.bars.map((b) => (b.ci ? b.estimate - b.ci[0] : 0));
  Plotly.react("mlCompareChart", [{
    x: labels, y: vals, type: "bar", marker: { color: colors },
    error_y: { type: "data", symmetric: false, array: errPlus, arrayminus: errMinus, color: INK, thickness: 1.5, width: 8 },
    text: vals.map((v) => fmt(v, 2)), textposition: "outside",
  }], sceneLayout({
    margin: { t: 30, r: 20, b: 70, l: 50 },
    yaxis: { title: tr("估出的疫苗效果", "Estimated vaccine effect") },
    shapes: [{ type: "line", x0: -0.5, x1: labels.length - 0.5, y0: d.true_late, y1: d.true_late,
               line: { color: GREEN, dash: "dash", width: 2 } }],
    annotations: [{ x: labels.length - 1, y: d.true_late, text: tr("真值 1.80", "truth 1.80"), showarrow: false, font: { color: GREEN }, yshift: 12 }],
  }), SCENE_CFG);

  document.getElementById("mlCompareCards").innerHTML = d.bars.map((b) => {
    const fTxt = b.f === null || b.f === undefined ? "" : `<span>${tr("工具強度 F=", "strength F=")}${fmt(b.f, 1)}</span>`;
    return `<div class="rc"><h3>${b.label}</h3><div class="big">${fmt(b.estimate, 2)}</div>
      <p>${b.note}${fTxt ? "　" + fTxt : ""}</p></div>`;
  }).join("");
}

document.getElementById("runForbidden").addEventListener("click", async (ev) => {
  const btn = ev.target;
  const old = btn.dataset.zh !== undefined ? (lang() === "en" ? btn.dataset.en : btn.dataset.zh) : btn.textContent;
  btn.disabled = true; btn.textContent = tr("訓練模型中…（約幾秒）", "Training model… (a few seconds)");
  let d;
  try { d = await getJSON(`${API}/api/ml_forbidden`); }
  catch (e) { alert(tr("執行失敗：", "Run failed: ") + e.message); return; }
  finally { btn.disabled = false; btn.textContent = old; }
  state.fbData = d;
  renderForbidden(d);
});

function renderForbidden(d) {
  document.getElementById("fbOut").classList.remove("hidden");
  const trap = d.in_sample, cf = d.cross_fit;
  document.getElementById("fbNaive").textContent = fmt(d.naive, 2);
  document.getElementById("fbTrap").textContent = fmt(trap.estimate, 2);
  document.getElementById("fbTrap").style.color = AMBER;
  document.getElementById("fbTrapFoot").textContent =
    tr(`黏在 naive ⚠（看似 F=${fmt(trap.f_stat, 0)}，假的）`,
       `stuck on naive ⚠ (looks like F=${fmt(trap.f_stat, 0)}, but fake)`);
  document.getElementById("fbCf").textContent = fmt(cf.estimate, 2);
  document.getElementById("fbCf").style.color = TEAL;
  document.getElementById("fbCfFoot").textContent =
    tr(`拉回真值 ✓（F=${fmt(cf.f_stat, 0)}）`, `pulled back to truth ✓ (F=${fmt(cf.f_stat, 0)})`);

  const labels = [tr("未調整", "Naive"), tr("AI 偷看版", "AI peeking"), tr("AI 交叉擬合版", "AI cross-fit")];
  const vals = [d.naive, trap.estimate, cf.estimate];
  const colors = [RED, AMBER, TEAL];
  const errPlus = [0, trap.ci[1] - trap.estimate, cf.ci[1] - cf.estimate];
  const errMinus = [0, trap.estimate - trap.ci[0], cf.estimate - cf.ci[0]];
  Plotly.react("fbChart", [{
    x: labels, y: vals, type: "bar", marker: { color: colors },
    error_y: { type: "data", symmetric: false, array: errPlus, arrayminus: errMinus, color: INK, thickness: 1.5, width: 10 },
    text: vals.map((v) => fmt(v, 2)), textposition: "outside",
  }], sceneLayout({
    margin: { t: 30, r: 20, b: 50, l: 50 },
    yaxis: { title: tr("估出的疫苗效果", "Estimated vaccine effect"), range: [0, 3] },
    shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: d.true_late, y1: d.true_late,
               line: { color: GREEN, dash: "dash", width: 2 } }],
    annotations: [{ x: 2, y: d.true_late, text: tr("真值 1.80", "truth 1.80"), showarrow: false, font: { color: GREEN }, yshift: 12 }],
  }), SCENE_CFG);
}

// ======================================================================
// 6. Regression Discontinuity — teaching + interactive (bandwidth slider)
// ======================================================================
const PURPLE = "#7c3aed", SLATE = "#64748b";
let rddReady = false, rddAssumeReady = false, rddBwTimer = null;
const rddBwSlider = document.getElementById("rddBwSlider");

function initRdd() {
  if (rddReady) return;
  rddReady = true;
  refreshRdd();
  // NOTE: the survival fit (IPCW/Cox/AFT) is heavy (~3s) and, on the
  // browser-only Pyodide build, runs synchronously and freezes the UI.
  // So it is gated behind an explicit button instead of auto-running.
}
function scheduleRdd() {
  document.getElementById("rddBwVal").textContent = Number(rddBwSlider.value).toFixed(1);
  clearTimeout(rddBwTimer);
  rddBwTimer = setTimeout(refreshRdd, 130);
}
rddBwSlider.addEventListener("input", scheduleRdd);

async function refreshRdd() {
  const bw = Number(rddBwSlider.value);
  let i, a;
  try {
    i = await getJSON(`${API}/api/rdd_interactive?bandwidth=${bw}&lang=${lang()}`);
    a = await postJSON(`${API}/api/rdd_analyze`, { source: "example_rdd", bandwidth: bw, lang: lang() });
  } catch (e) { return; }

  document.getElementById("rddTakeup").textContent = fmt(i.takeup_jump * 100, 0) + "%";
  document.getElementById("rddSharp").textContent = fmt(i.sharp, 2);
  document.getElementById("rddSharpCi").textContent =
    `${fmt(i.sharp_ci[0], 2)} ~ ${fmt(i.sharp_ci[1], 2)}`;
  const fuzzyEl = document.getElementById("rddFuzzy");
  fuzzyEl.textContent = fmt(i.fuzzy, 2);
  fuzzyEl.style.color = Math.abs(i.fuzzy - 1.8) < 0.4 ? TEAL : AMBER;

  // bias–variance readout: window N (variance shrinks with more people) and the
  // 95% CI width of the fuzzy estimate (variance shows up directly as CI width).
  const nWin = (i.n_left || 0) + (i.n_right || 0);
  const ciW = (i.fuzzy_ci && i.fuzzy_ci.length === 2) ? Math.abs(i.fuzzy_ci[1] - i.fuzzy_ci[0]) : NaN;
  const nEl = document.getElementById("rddNwin");
  const cwEl = document.getElementById("rddCiW");
  if (nEl) nEl.textContent = nWin.toLocaleString();
  if (cwEl) {
    cwEl.textContent = isFinite(ciW) ? "±" + fmt(ciW / 2, 2) + tr("（半寬）", " (half-width)") : "–";
    // wider CI = more variance → tint amber when it gets large
    cwEl.style.color = isFinite(ciW) && ciW > 1.2 ? AMBER : TEAL;
  }

  // ② interactive: pass the bandwidth (draw the window band) and a FIXED half-range
  // (= slider max) so a narrower window visibly shrinks instead of the axis zooming in.
  renderRddPlotInto("rddPlot", a.plot, a.h != null ? a.h : bw, 14.5);
}

// h = bandwidth actually used (draws a light window band [c-h, c+h]); the binned
// dots and fitted lines already live only inside that window (backend-clipped), so
// the band + a FIXED x-axis (fixedHalf) make a narrower window visibly shrink — the
// line really does get shorter, instead of the axis just zooming in to hide it.
function renderRddPlotInto(elId, plot, h, fixedHalf) {
  const c = plot.cutoff;
  const traces = [
    { x: plot.left.bx, y: plot.left.by, type: "scatter", mode: "markers",
      name: tr("斷點下方", "below cutoff"), marker: { color: SLATE, size: 7 } },
    { x: plot.right.bx, y: plot.right.by, type: "scatter", mode: "markers",
      name: tr("斷點上方", "above cutoff"), marker: { color: PURPLE, size: 7 } },
  ];
  if (plot.fit.left) traces.push({ x: plot.fit.left.x, y: plot.fit.left.y, type: "scatter",
    mode: "lines", name: tr("左側配適", "left fit"), line: { color: SLATE, width: 3 }, showlegend: false });
  if (plot.fit.right) traces.push({ x: plot.fit.right.x, y: plot.fit.right.y, type: "scatter",
    mode: "lines", name: tr("右側配適", "right fit"), line: { color: PURPLE, width: 3 }, showlegend: false });

  const shapes = [{ type: "line", x0: c, x1: c, yref: "paper", y0: 0, y1: 1,
                    line: { color: RED, dash: "dash", width: 1.5 } }];
  const annotations = [{ x: c, yref: "paper", y: 1, text: tr(`斷點 ${c}`, `cutoff ${c}`),
                    showarrow: false, font: { color: RED, size: 11 }, yshift: 10 }];
  if (h && isFinite(h)) {
    // shaded window band — shrinks as the bandwidth narrows
    shapes.unshift({ type: "rect", xref: "x", yref: "paper", x0: c - h, x1: c + h, y0: 0, y1: 1,
                     fillcolor: "rgba(63,125,98,0.10)", line: { color: "rgba(63,125,98,0.35)", width: 1, dash: "dot" }, layer: "below" });
    annotations.push({ x: c + h, yref: "paper", y: 0.04, text: tr(`視窗 ±${fmt(h, 1)}`, `window ±${fmt(h, 1)}`),
                       showarrow: false, font: { color: "#3f7d62", size: 10 }, xanchor: "right", yshift: 0 });
  }
  const xaxis = { title: tr("跑分變數", "Running variable") };
  if (fixedHalf && isFinite(fixedHalf)) { xaxis.range = [c - fixedHalf, c + fixedHalf]; xaxis.autorange = false; }

  Plotly.react(elId, traces, sceneLayout({
    margin: { t: 24, r: 20, b: 45, l: 55 },
    xaxis,
    yaxis: { title: tr("結果", "Outcome") },
    legend: { orientation: "h", y: 1.14 },
    shapes, annotations,
  }), SCENE_CFG);
}

const runRddSurvBtn = document.getElementById("runRddSurv");
if (runRddSurvBtn) {
  runRddSurvBtn.addEventListener("click", async () => {
    runRddSurvBtn.disabled = true;
    const label = runRddSurvBtn.textContent;
    runRddSurvBtn.textContent = tr("計算中…（約 3 秒）", "Computing… (~3 sec)");
    // let the button repaint before the synchronous Pyodide work blocks the thread
    await new Promise((r) => setTimeout(r, 30));
    await runRddSurvival();
    runRddSurvBtn.textContent = tr("重新計算設限校正", "Re-run censoring correction");
    runRddSurvBtn.disabled = false;
  });
}

async function runRddSurvival() {
  let s;
  try { s = await postJSON(`${API}/api/rdd_survival`, { source: "example_rdd", lang: lang() }); }
  catch (e) { return; }
  state.rddSurv = s;
  renderRddSurvival(s);
}
function renderRddSurvival(s) {
  const U = tr("Δlog（事件時間）", "Δlog(event time)");
  const cards = [];
  // baseline: ignoring censoring (biased)
  cards.push({
    t: tr("未處理設限（有偏）", "No censoring fix (biased)"),
    v: s.naive.estimate,
    p: tr("直接對 log（觀察時間）做 RD，被提早設限者往下拉。",
          "Plain RD on log(observed time); dragged down by early-censored subjects."),
    hl: false,
  });
  // sharp design, one card per outcome-regression method
  (s.sharp.methods || []).forEach((m, i) => {
    cards.push({
      t: tr("銳利 · ", "Sharp · ") + m.label,
      v: m.estimate,
      p: i === 0
        ? tr("跨越資格門檻對「log 事件時間」的跳躍（類似 ITT）。",
              "Jump in log event-time from crossing eligibility (ITT-like).")
        : tr("雙重穩健版：多帶結果模型校正設限。",
              "Doubly-robust: adds an outcome model on top of IPCW."),
      hl: false,
    });
  });
  // fuzzy design, primary (IPCW) — the LATE for compliers at the cutoff
  const fz = (s.fuzzy.methods && s.fuzzy.methods[0]) || { label: "IPCW", estimate: s.fuzzy.estimate };
  cards.push({
    t: tr("模糊 · ", "Fuzzy · ") + fz.label,
    v: fz.estimate,
    p: tr("斷點附近實際接種者的效果（complier 的 LATE）。",
          "Effect for those actually vaccinated near the cutoff (complier LATE)."),
    hl: true,
  });
  document.getElementById("rddSurvCards").innerHTML = cards.map(c =>
    `<div class="rc ${c.hl ? "highlight" : ""}"><h3>${c.t}</h3>` +
    `<div class="big">${fmt(c.v, 2)}</div>` +
    `<p class="caption">${U}</p><p>${c.p}</p></div>`
  ).join("");
}

// ======================================================================
// RDD ③ data analysis (load example / upload, map columns, run RDD)
// ======================================================================
const rddState = { source: null, columns: [], req: null };
let rddAnalyzeReady = false;

function initRddAnalyze() {
  if (rddAnalyzeReady) return;
  rddAnalyzeReady = true;
  drawSceneSurvIntro();   // "what does censored time-to-event data look like" (survival teaching)
  drawAFT("aftDiagram"); drawIPCW("ipcwDiagram");  // AFT / IPCW concept illustrations
  document.getElementById("useRddExample").click();   // auto-load the demo
}

function rddFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  const none = `<option value="">—</option>`;
  ["rddSelX", "rddSelY", "rddSelD", "rddSelCov"].forEach((id) => {
    document.getElementById(id).innerHTML = opts;
  });
  ["rddSelT", "rddSelE"].forEach((id) => {   // optional survival columns
    document.getElementById(id).innerHTML = none + opts;
  });
  document.getElementById("rddColMap").classList.remove("hidden");
}
function rddApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null) el.value = v; };
  set("rddSelX", d.running); set("rddSelY", d.outcome); set("rddSelD", d.treatment);
  set("rddSelC", d.cutoff); set("rddSelT", d.time); set("rddSelE", d.event);
  const cov = document.getElementById("rddSelCov");
  if (d.covariates) [...cov.options].forEach((o) => { o.selected = d.covariates.includes(o.value); });
}

document.getElementById("useRddExample").addEventListener("click", async () => {
  const st = document.getElementById("rddDataStatus");
  try {
    const d = await getJSON(`${API}/api/rdd_example`);
    rddState.source = "example_rdd"; rddState.columns = d.columns;
    st.textContent = tr(`已載入內建 65 歲範例（${d.n} 筆，合成虛構）`,
                        `Loaded built-in age-65 example (${d.n} rows, synthetic & fictional)`);
    rddFillSelects(d.columns); rddApplyDefaults(d.defaults);
    runRddAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});

document.getElementById("rddFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0];
  if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("rddDataStatus");
  st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    rddState.source = d.token; rddState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 筆）`, `Uploaded "${file.name}" (${d.n} rows)`);
    rddFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});

function rddCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return {
    source: rddState.source,
    running: v("rddSelX"), outcome: v("rddSelY"), treatment: v("rddSelD"),
    cutoff: Number(v("rddSelC")),
    time: v("rddSelT"), event: v("rddSelE"),
    covariates: [...document.getElementById("rddSelCov").selectedOptions].map((o) => o.value),
    lang: lang(),
  };
}

document.getElementById("runRddAnalyze").addEventListener("click", runRddAnalyze);

async function runRddAnalyze() {
  const req = rddCurrentMapping();
  if (!req.source) return;
  rddState.req = req;
  try {
    const a = await postJSON(`${API}/api/rdd_analyze`, req);
    renderRddAnalyze(a);
    runRddAssumptions(req);   // keep the ④ dashboard in sync
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); return; }

  // optional survival RDD when both time + event columns are chosen.
  // The IPCW/doubly-robust fit is ~1.4 s of *synchronous* Pyodide compute,
  // which would freeze the whole UI the moment this tab opens. So we only
  // reveal the block + a button here, and compute on the user's click.
  const block = document.getElementById("rddSurvBlock");
  if (req.time && req.event) {
    block.classList.remove("hidden");
    state.rddAnalyzeSurv = null;
    document.getElementById("rddAnalyzeSurv").innerHTML = "";
    const b = document.getElementById("runRddAnalyzeSurv");
    if (b) {
      b.classList.remove("hidden");
      b.disabled = false;
      b.textContent = tr("跑設限校正估計（約 1.5 秒）", "Run the censoring-corrected estimate (~1.5 sec)");
    }
  } else {
    block.classList.add("hidden");
  }
}

// Button-gated survival fit for the analysis tab (heavy synchronous Pyodide).
document.getElementById("runRddAnalyzeSurv").addEventListener("click", async () => {
  const req = rddState.req;
  if (!req || !req.time || !req.event) return;
  const b = document.getElementById("runRddAnalyzeSurv");
  b.disabled = true;
  b.textContent = tr("計算中…（約 1.5 秒）", "Computing… (~1.5 sec)");
  await new Promise((r) => setTimeout(r, 30));   // let the button repaint first
  try {
    const s = await postJSON(`${API}/api/rdd_survival`, { ...req, lang: lang() });
    state.rddAnalyzeSurv = s;
    renderRddAnalyzeSurv(s);
    b.textContent = tr("重新計算設限校正", "Re-run censoring correction");
  } catch (e) {
    b.textContent = tr("計算失敗，再試一次", "Failed — try again");
  } finally {
    b.disabled = false;
  }
});

function renderRddAnalyze(a) {
  document.getElementById("rddAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("接種率跳幅（第一階段）", "Take-up jump (first stage)"), a.takeup.estimate, a.takeup.interpretation, false],
    [tr("未校正差異（有偏）", "Naive difference (biased)"), a.naive_difference, tr("直接比較有／無處置者，被干擾因子汙染。", "Direct treated-vs-untreated comparison, confounded."), false],
    [tr("銳利 RD（資格效果）", "Sharp RD (eligibility)"), a.sharp.estimate, a.sharp.interpretation, false],
    [tr("模糊 RD（斷點順從者）", "Fuzzy RD (compliers)"), a.fuzzy ? a.fuzzy.estimate : null, a.fuzzy ? a.fuzzy.interpretation : "", true],
  ];
  document.getElementById("rddAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, hl ? 3 : 2)}</div><p>${desc}</p></div>`
  ).join("");
  if (a.plot) renderRddPlotInto("rddAnalyzePlot", a.plot, a.h);
}

function renderRddAnalyzeSurv(s) {
  const U = tr("Δlog（事件時間）", "Δlog(event time)");
  const rows = [];
  rows.push({ t: tr("未處理設限（有偏）", "No censoring fix (biased)"), v: s.naive.estimate, hl: false });
  (s.sharp.methods || []).forEach((m) => rows.push({ t: tr("銳利 · ", "Sharp · ") + m.label, v: m.estimate, hl: false }));
  const fz = (s.fuzzy.methods && s.fuzzy.methods[0]) || { label: "IPCW", estimate: s.fuzzy.estimate };
  rows.push({ t: tr("模糊 · ", "Fuzzy · ") + fz.label, v: fz.estimate, hl: true });
  document.getElementById("rddAnalyzeSurv").innerHTML = rows.map((c) =>
    `<div class="rc ${c.hl ? "highlight" : ""}"><h3>${c.t}</h3><div class="big">${fmt(c.v, 2)}</div><p class="caption">${U}</p></div>`
  ).join("");
}

// ======================================================================
// RDD ④ assumptions dashboard (R1–R5)
// ======================================================================
function initRddAssume() {
  if (rddAssumeReady) return;
  rddAssumeReady = true;
  runRddAssumptions(rddState.req || { source: "example_rdd", lang: lang() });
}
async function runRddAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_rdd", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/rdd_assumptions`, body); }
  catch (e) { return; }
  state.rddDash = out;
  renderRddAssumptions(out);
}
function worstStatus(checks) {
  const rank = { red: 3, amber: 2, info: 1, green: 0 };
  return checks.reduce((w, c) => (rank[c.status] > rank[w] ? c.status : w), "green");
}
function renderRddAssumptions(out) {
  document.getElementById("rddAssumeHint").classList.add("hidden");
  const ov = document.getElementById("rddOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("各項佐證都通過，這個 RDD 設計看起來可信。", "All supporting checks pass — this RDD design looks credible."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards to see."),
    red: tr("有項目不符，RDD 結果要保守看待。", "Some items fail — interpret the RDD with caution."),
    info: tr("關鍵假設需靠領域知識判斷，請看各卡片說明。", "The key assumption needs domain judgement — see each card."),
  }[worst];
  ov.classList.remove("hidden");
  ov.className = `overall st-${worst}`;
  ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;

  document.getElementById("rddAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) =>
      `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}">
      <h3><span class="dot bg-${c.status}"></span>${c.title}
        <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p>
      <p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details>
    </div>`;
  }).join("");
}

// ======================================================================
// RDD ⑤ Boost with AI — DML window-robustness + flexible-ML DR survival
// ======================================================================
let rddMlReady = false, rddDmlTimer = null;
const rddDmlWindow = document.getElementById("rddDmlWindow");

function initRddMl() {
  if (rddMlReady) return;
  rddMlReady = true;
  drawRddScenes();
  refreshRddDml();
  drawCrossfit("rddCfDiagram");
  drawDoublyRobust("rddDrDiagram");
}
function scheduleRddDml() {
  document.getElementById("rddDmlWinVal").textContent = Number(rddDmlWindow.value).toFixed(1);
  clearTimeout(rddDmlTimer);
  rddDmlTimer = setTimeout(refreshRddDml, 140);
}
rddDmlWindow.addEventListener("input", scheduleRddDml);

async function refreshRddDml() {
  const w = Number(rddDmlWindow.value);
  let d;
  try { d = await getJSON(`${API}/api/rdd_ml_bandwidth?window=${w}`); }
  catch (e) { return; }
  state.rddDml = d;

  const conv = d.conventional.estimate, dml = d.dml.estimate;
  const convEl = document.getElementById("rddDmlConv");
  convEl.textContent = fmt(conv, 2);
  convEl.style.color = AMBER;
  document.getElementById("rddDmlConvFoot").textContent =
    tr(`誤差 ${fmt(d.conventional.ci[0], 1)} ~ ${fmt(d.conventional.ci[1], 1)}`,
       `CI ${fmt(d.conventional.ci[0], 1)} ~ ${fmt(d.conventional.ci[1], 1)}`);
  const dmlEl = document.getElementById("rddDmlEst");
  dmlEl.textContent = fmt(dml, 2);
  dmlEl.style.color = Math.abs(dml - 1.8) < 0.4 ? TEAL : AMBER;
  document.getElementById("rddDmlGap").textContent = (conv >= 1.8 ? "+" : "") + fmt(conv - 1.8, 2);

  const c = d.curve;
  Plotly.react("rddDmlChart", [
    { x: c.window.concat(c.window.slice().reverse()),
      y: c.conv_hi.concat(c.conv_lo.slice().reverse()),
      fill: "toself", fillcolor: "rgba(245,158,11,0.10)", line: { color: "transparent" },
      type: "scatter", mode: "lines", showlegend: false, hoverinfo: "skip" },
    { x: c.window, y: c.conv, type: "scatter", mode: "lines+markers",
      name: tr("視窗內直接比較", "plain comparison"), line: { color: AMBER, width: 3 }, marker: { size: 6 } },
    { x: c.window.concat(c.window.slice().reverse()),
      y: c.dml_hi.concat(c.dml_lo.slice().reverse()),
      fill: "toself", fillcolor: "rgba(13,148,136,0.12)", line: { color: "transparent" },
      type: "scatter", mode: "lines", showlegend: false, hoverinfo: "skip" },
    { x: c.window, y: c.dml, type: "scatter", mode: "lines+markers",
      name: tr("DML（調整＋交叉擬合）", "DML (adjusted + cross-fit)"), line: { color: TEAL, width: 3 }, marker: { size: 6 } },
  ], sceneLayout({
    margin: { t: 24, r: 20, b: 45, l: 55 },
    xaxis: { title: tr("觀察視窗（半寬，年）", "Observation window (half-width, years)") },
    yaxis: { title: tr("估出的疫苗效果", "Estimated vaccine effect") },
    legend: { orientation: "h", y: 1.14 },
    shapes: [{ type: "line", x0: c.window[0], x1: c.window[c.window.length - 1], y0: 1.8, y1: 1.8,
               line: { color: GREEN, dash: "dash", width: 2 } }],
    annotations: [{ x: c.window[c.window.length - 1], y: 1.8, text: tr("真值 1.80", "truth 1.80"),
               showarrow: false, font: { color: GREEN }, yshift: 12, xanchor: "right" }],
  }), SCENE_CFG);
}

document.getElementById("runRddSurvMl").addEventListener("click", async (ev) => {
  const btn = ev.target;
  const old = btn.dataset.zh !== undefined ? (lang() === "en" ? btn.dataset.en : btn.dataset.zh) : btn.textContent;
  btn.disabled = true; btn.textContent = tr("擬合模型中…（約幾秒）", "Fitting models… (a few seconds)");
  let d;
  try { d = await getJSON(`${API}/api/rdd_ml_survival?lang=${lang()}`); }
  catch (e) { alert(tr("執行失敗：", "Run failed: ") + e.message); return; }
  finally { btn.disabled = false; btn.textContent = old; }
  state.rddSurvMl = d;
  renderRddSurvMl(d);
});

function renderRddSurvMl(d) {
  document.getElementById("rddSurvMlOut").classList.remove("hidden");
  const labels = d.bars.map((b) => b.label);
  const vals = d.bars.map((b) => b.estimate);
  const colors = d.bars.map((b) => STATUS_COLOR[b.status] || INK);
  const errPlus = d.bars.map((b) => (b.ci ? b.ci[1] - b.estimate : 0));
  const errMinus = d.bars.map((b) => (b.ci ? b.estimate - b.ci[0] : 0));
  Plotly.react("rddSurvMlChart", [{
    x: labels, y: vals, type: "bar", marker: { color: colors },
    error_y: { type: "data", symmetric: false, array: errPlus, arrayminus: errMinus, color: INK, thickness: 1.5, width: 8 },
    text: vals.map((v) => fmt(v, 2)), textposition: "outside",
  }], sceneLayout({
    margin: { t: 30, r: 20, b: 70, l: 50 },
    yaxis: { title: tr("斷點處 Δlog（事件時間）", "Δlog(event time) at the cutoff") },
  }), SCENE_CFG);

  document.getElementById("rddSurvMlCards").innerHTML = d.bars.map((b) =>
    `<div class="rc ${b.status === "good" ? "highlight" : ""}"><h3>${b.label}</h3>` +
    `<div class="big">${fmt(b.estimate, 2)}</div>` +
    `<p>${b.note}</p></div>`
  ).join("");
}

// ======================================================================
// 8. IV vs RDD — when to use which (comparison chart)
// ======================================================================
let chooseReady = false;

function initChoose() {
  if (chooseReady) return;
  chooseReady = true;
  drawChooseChart();
  initDtree();
}

// ----------------------------------------------------------------------
// Interactive decision tree: external designs + this toolbox's six methods,
// merged into one clickable anchor-based tree. Click through → best-fit advice.
// ----------------------------------------------------------------------
function gotoMethod(m, sub) {
  if (TOPICS[m]) { openTopic(m); return; }   // standalone topics (miss / causalml) have no ①–⑥ sub-tabs
  curMethod = m;
  curSub = sub || "learn";
  methodSelect.value = m;
  showMethodSub();
}
const L = (o) => (lang() === "en" ? o.en : o.zh);

// node = question {step, q:{}, opts:[{l:{}, to}]}  OR  leaf {rec:{...}}
// One tree, faithful to the pharmacoepidemiology "anchor" decision diagram:
// the common study designs (active comparator cohort, SCCS, CCW, sequential
// trial, nested case-control, case-crossover, CTC/CCTC) and the toolbox's six
// methods (IV/RDD/DiD/ITS/PERR/TiT) are all reachable endpoints. Every leaf
// carries a concrete vaccine scenario, and the full tree pops out at the end.
const DNODES = {
  n1: {
    step: { zh: "錨點", en: "Anchor" },
    q: { zh: "你的研究「錨點」是什麼？（決策樹的第一個分岔）", en: "What is your study's anchor? (the first split)" },
    opts: [
      { l: { zh: "暴露錨定：先固定一個暴露／介入，看它造成什麼結果", en: "Exposure-anchored: fix one exposure/intervention, study its effects" }, to: "exOut" },
      { l: { zh: "結果錨定：先固定一個結果，回頭找是哪些暴露造成的", en: "Outcome-anchored: fix one outcome, look back for the exposures" }, to: "outHow" },
      { l: { zh: "機制錨定：已知某暴露有效果，想知道有多少<b>透過某中介</b>發生（中介分析）", en: "Mechanism-anchored: an effect is known — ask how much runs <b>through a mediator</b> (mediation)" }, to: "rMED" },
      { l: { zh: "證據錨定：你不是在做單一研究，而是想把<b>已有的多篇研究</b>合起來回答（證據合併）", en: "Evidence-anchored: you are not running a single study but want to combine <b>several existing studies</b> (evidence synthesis)" }, to: "synth" },
    ],
  },
  // ================= D · evidence-anchored (cross-study synthesis) =================
  synth: {
    step: { zh: "證據合併", en: "Evidence synthesis" },
    q: { zh: "你要一次比較幾個治療？（這層決定做一般統合分析還是網路統合分析）", en: "How many treatments are you comparing at once? (this decides ordinary vs network meta-analysis)" },
    opts: [
      { l: { zh: "兩個的正面對決（或一個介入 vs 對照），先系統性回顧找出所有研究，再做統合分析", en: "Two, head-to-head (or one intervention vs a control) — systematically review all studies, then meta-analyse" }, to: "rSRMA" },
      { l: { zh: "三個以上、而且很少有試驗直接兩兩比過，用直接＋間接證據連成網路", en: "Three or more, with few head-to-head trials — connect direct + indirect evidence into a network" }, to: "rNMA" },
    ],
  },
  // ================= A · exposure-anchored =================
  exOut: {
    step: { zh: "結果型態", en: "Outcome type" },
    q: { zh: "你的結果是哪一種？這一步決定哪些設計「用得了」。", en: "Which kind is your outcome? This step decides which designs are even eligible." },
    opts: [
      { l: { zh: "一次性／可能致命／慢性持續（不是「會反覆又會好」）", en: "One-off / possibly fatal / chronic-persistent (not 'recurs and resolves')" }, to: "exInst" },
      { l: { zh: "急性、會反覆發生、也會痊癒、非致命", en: "Acute, recurrent, resolving, non-fatal" }, to: "exSelf" },
    ],
  },
  exInst: {
    step: { zh: "外生工具？", en: "An instrument?" },
    q: { zh: "你有沒有一個「外生、近似隨機」的工具，會改變人們是否接受暴露，且只透過暴露影響結果？（隨機提醒、抽籤、政策樂透、基因變異）", en: "Do you have an external, near-random instrument that changes whether people get the exposure and affects the outcome only through it? (a randomised reminder, lottery, policy lottery, genetic variant)" },
    opts: [
      { l: { zh: "有，這工具幾乎可當隨機", en: "Yes — that instrument is essentially random" }, to: "rIV" },
      { l: { zh: "有，而且是<b>遺傳變異</b>（基因型）", en: "Yes — and it is a <b>genetic variant</b>" }, to: "rMR" },
      { l: { zh: "沒有這種工具 → 繼續往下", en: "No such instrument — continue" }, to: "exCut" },
    ],
  },
  exCut: {
    step: { zh: "切點／時點／對照", en: "Cutoff / timing / comparator" },
    q: { zh: "你的暴露有沒有以下任一種「準隨機」結構？（選最接近的一個）", en: "Does your exposure have any of these quasi-random structures? (pick the closest one)" },
    opts: [
      { l: { zh: "分數上的明確門檻（年齡 65／風險指標切點），只需門檻附近的答案", en: "A sharp cutoff on a score (age 65 / a risk index); answer needed near the cutoff" }, to: "rRDD" },
      { l: { zh: "政策在已知時點開啟，且有沒被開啟的對照組（面板資料）", en: "Policy switched on at a known time, with an untreated control group (panel data)" }, to: "rDiD" },
      { l: { zh: "政策在已知時點開啟，但只有單一群體、前後有許多時間點", en: "Policy at a known time, but a single population with many time points" }, to: "rITS" },
      { l: { zh: "有藥理／適應症相近的活性對照（比「打 A vs 打 B」）", en: "A pharmacologically / indication-similar active comparator ('A vs B')" }, to: "rACC" },
      { l: { zh: "有活性對照，但想把<b>既有（盛行）使用者</b>也納入、不想只用新起始者", en: "Active comparator, but you want to include <b>prevalent</b> users, not just new starters" }, to: "rPNU" },
      { l: { zh: "都沒有，但有兩組「暴露前 vs 暴露後」事件率、且混淆乘法穩定", en: "None, but both groups' before-vs-after event rates with stable multiplicative confounding" }, to: "rPERR" },
      { l: { zh: "擔心<b>未測混淆</b>，但有一對<b>陰性對照</b>（對結果無因果的暴露代理＋不受暴露影響的結果代理）", en: "Worried about <b>unmeasured confounding</b>, but you have a pair of <b>negative controls</b> (an exposure proxy with no effect on the outcome + an outcome proxy unaffected by exposure)" }, to: "rNC" },
      { l: { zh: "以上皆非 → 繼續", en: "None of the above — continue" }, to: "exDyn" },
    ],
  },
  exDyn: {
    step: { zh: "動態策略？", en: "Dynamic strategy?" },
    q: { zh: "剩下的情況：你的處置是「診斷後動態／隨時間調整」的策略嗎？", en: "What's left: is the treatment a sustained / dynamic strategy adjusted over time after diagnosis?" },
    opts: [
      { l: { zh: "是，動態策略（早 vs 晚開始、是否持續或密集用藥）", en: "Yes — a dynamic strategy (early vs late, sustained / intensive use)" }, to: "rCCW" },
      { l: { zh: "比較像一次性的點治療，但病人在多個時間點陸續符合收案", en: "More a one-off point treatment, but patients become eligible at many times" }, to: "rSEQ" },
      { l: { zh: "都不是，但我有<b>豐富的已測共變項</b>，只想把它們<b>平衡</b>掉（配對／加權）", en: "Neither, but I have <b>rich measured covariates</b> and just want to <b>balance</b> them (matching / weighting)" }, to: "rPS" },
      { l: { zh: "有已測共變項，且想要<b>雙重穩健</b>（兩張網其一對就好）＋可用 ML／效率最佳", en: "Measured covariates, and you want <b>double robustness</b> (two models, either right) + ML / efficiency" }, to: "rTMLE" },
      { l: { zh: "治療<b>分多個時點</b>給，且有<b>時變混淆</b>（被過去治療改變、又預測未來治療與結果）", en: "Treatment given at <b>several times</b>, with a <b>time-varying confounder</b> (changed by past treatment, predicts future treatment &amp; outcome)" }, to: "rGM" },
      { l: { zh: "用藥逐月增減，且你想知道效果如何<b>隨用藥的時間與累積</b>變化（最近的劑量 vs 很久以前的）", en: "Dosing varies month to month and you want how the effect depends on the <b>timing &amp; accumulation</b> of doses (recent vs long-ago)" }, to: "rWCE" },
      { l: { zh: "以上皆非 → 最後一步", en: "None of the above — go to the last step" }, to: "rLast" },
    ],
  },
  exSelf: {
    step: { zh: "自身對照／趨勢", en: "Self-control / trend" },
    q: { zh: "結果是急性、會反覆又會好，你想怎麼利用「個人自身」或「日曆趨勢」？", en: "The outcome is acute and recurrent/resolving — how do you want to use 'the person as their own control' or a calendar trend?" },
    opts: [
      { l: { zh: "用個人自身當對照、暴露有明確時窗（非致命、可復發）", en: "Person as own control, exposure has a clear window (non-fatal, recurrent)" }, to: "rSCCS" },
      { l: { zh: "暴露隨日曆時間逐漸普及、跨族群速度不同，且結果罕見", en: "Exposure spreads over calendar time at different rates; rare outcome" }, to: "rTiT" },
      { l: { zh: "只想<b>快速篩出</b>「A 引起、B 治療」的<b>處方瀑布</b>訊號（產生假說，先 A 後 B 的不對稱）", en: "Just want a <b>fast screen</b> for an 'A-causes, B-treats' <b>prescribing cascade</b> (hypothesis-generating; A-then-B asymmetry)" }, to: "rPSSA" },
      { l: { zh: "想<b>一次掃整個結果階層</b>（數百–數千個事件）找暴露的安全訊號，並<b>控制多重比較</b>", en: "Want to <b>scan a whole outcome hierarchy</b> (hundreds–thousands of events) for safety signals while <b>controlling multiplicity</b>" }, to: "rTSCAN" },
      { l: { zh: "以上皆非 → 最後一步", en: "None of the above — go to the last step" }, to: "rLast" },
    ],
  },
  // ================= B · outcome-anchored =================
  outHow: {
    step: { zh: "B 結果錨定 · 取對照", en: "B Outcome-anchored · controls" },
    q: { zh: "你從「已發生結果的個案」回看暴露，怎麼取對照？（多用於急性、可復發的結果）", en: "Looking back from cases — how do you take controls? (usually for acute, recurrent outcomes)" },
    opts: [
      { l: { zh: "從一般來源族群取對照、用校正／配對處理混淆（基本病例對照）", en: "Controls from the source population; handle confounding by adjustment/matching (basic case-control)" }, to: "rCC" },
      { l: { zh: "在大世代裡用配對對照、巢式抽樣（想細看劑量–反應）", en: "Matched controls nested in a large cohort (to examine dose-response)" }, to: "rNCC" },
      { l: { zh: "用個人自身近期當對照（急性、短暫暴露；案例交叉 CCO）", en: "The person's own recent past as control (acute, transient exposure; case-crossover CCO)" }, to: "rCCTC" },
      { l: { zh: "個人自身對照，但暴露有日曆時間趨勢（用 CCTC 扣趨勢）", en: "Person-as-own-control, but the exposure has a calendar trend (CCTC nets it out)" }, to: "rCCTC" },
      { l: { zh: "估<b>疫苗效力</b>，對照取自「來檢驗卻<b>陰性</b>」的人，去掉就醫傾向（陰性檢驗設計）", en: "Estimating <b>vaccine effectiveness</b> with controls who were tested but <b>negative</b>, removing care-seeking (test-negative design)" }, to: "rTND" },
      { l: { zh: "以上皆非 → 最後一步", en: "None of the above — go to the last step" }, to: "rLast" },
    ],
  },

  // ====== recommendations (leaves) — each carries a vaccine scenario ======
  rIV: { rec: { kind: "toolbox", method: "iv", badge: "IV ✓",
    title: { zh: "最適合：工具變數 IV", en: "Best fit: Instrumental Variables (IV)" },
    why: { zh: "你手上有一個近似隨機、只透過暴露影響結果的外生工具，這正是 IV 的引擎。用它把「被推動的順從者」的因果效果（LATE）撬出來。",
           en: "You have a near-random, exclusion-respecting external instrument — exactly IV's engine. Use it to recover the causal effect for the compliers it moves (the LATE)." },
    scenario: { zh: "疫苗情境：衛生局「隨機」寄出接種提醒，推了一部分人去打疫苗。用『有沒有收到提醒』當工具，估接種對健康的真正效果。",
                en: "Vaccine scenario: the health authority mails reminders at random, nudging some people to get vaccinated. Use 'got a reminder?' as the instrument to estimate vaccination's true effect on health." },
    watch: { zh: "最關鍵、不可檢驗的是<b>排除限制</b>（工具只透過暴露影響結果）。到 IV 的 ④ 跑一遍，特別看工具強度 F&gt;10。若你的工具是<b>遺傳變異</b>，那就是 IV 的特例：孟德爾隨機化（MR）。",
             en: "The key untestable assumption is <b>exclusion</b> (the instrument affects the outcome only through the exposure). Run IV's ④ dashboard — check instrument strength F&gt;10. If your instrument is a <b>genetic variant</b>, that special case of IV is Mendelian randomization (MR).",
             }, altMethod: "mr", altLabel: { zh: "工具是基因？看 MR →", en: "Genetic instrument? See MR →" } } },
  rRDD: { rec: { kind: "toolbox", method: "rdd", badge: "RDD ✓",
    title: { zh: "最適合：斷點回歸 RDD", en: "Best fit: Regression Discontinuity (RDD)" },
    why: { zh: "暴露資格由分數上的明確門檻決定，門檻上下的人其他條件相近，把門檻兩側各配一條線、量切點的跳幅，就是 RDD。",
           en: "Eligibility is set by a sharp cutoff and people just above/below are otherwise alike — fit a line on each side and read the jump at the cutoff. That's RDD." },
    scenario: { zh: "疫苗情境：免費疫苗只開放給「滿 65 歲」的人。比較剛滿 65 與還差幾天的人，量門檻處健康指標的跳幅。",
                en: "Vaccine scenario: free vaccination is offered only at age 65+. Compare those just over 65 with those just under, and read the jump in the health outcome at the cutoff." },
    watch: { zh: "最關鍵的是<b>連續性</b>（剛好門檻上下的人本來就相像、且無法精準操弄分數）。小提醒：模糊 RDD 其實是「把門檻當工具」的局部 IV。",
             en: "The key assumption is <b>continuity</b> (people right at the cutoff are comparable and can't precisely game the score). Note: a fuzzy RDD is really a local IV with the cutoff as the instrument." } } },
  rDiD: { rec: { kind: "toolbox", method: "did", badge: "DiD ✓",
    title: { zh: "最適合：差異中的差異 DiD", en: "Best fit: Difference-in-Differences (DiD)" },
    why: { zh: "政策在已知時點對部分單位開啟、你又有對照組，且開啟前走勢平行，比較兩組「前→後變化的差」，消掉固定組差與共同時間趨勢。",
           en: "A policy switches on for some units at a known time, you have a control group, and pre-trends were parallel — difference the two before/after changes to cancel fixed group gaps and common time trends." },
    scenario: { zh: "疫苗情境：某些縣市在某月開啟接種推廣、其他縣市沒有。比較兩組「推廣前→後」健康變化的差。",
                en: "Vaccine scenario: some counties switch on a vaccination drive in a given month, others don't. Compare the difference in each group's before→after change in health." },
    watch: { zh: "最關鍵、後期不可檢驗的是<b>平行趨勢</b>（沒政策時兩組會一起變）。用 ④ 的事件研究檢查前期趨勢。",
             en: "The key (post-period untestable) assumption is <b>parallel trends</b>. Use the event-study in ④ to check pre-trends." } } },
  rITS: { rec: { kind: "toolbox", method: "its", badge: "ITS ✓",
    title: { zh: "最適合：中斷時間序列 ITS", en: "Best fit: Interrupted Time Series (ITS)" },
    why: { zh: "只有單一群體、但介入前後有許多時間點，用介入前趨勢外推當反事實，量介入處的水準與斜率跳變。",
           en: "A single population with many points before and after — extrapolate the pre-intervention trend as the counterfactual and read the level & slope change at the interruption." },
    scenario: { zh: "疫苗情境：某縣市在已知月份推出接種計畫，逐月追蹤健康指標。用推出前的趨勢外推當「沒推會怎樣」，量斷裂處的跳變。",
                en: "Vaccine scenario: a county launches a vaccination programme in a known month and tracks a monthly health indicator. Extrapolate the pre-launch trend as 'what if no launch' and read the break." },
    watch: { zh: "最關鍵的是<b>介入的同時沒有別的大事</b>一起發生；另要處理殘差自相關（④ 會檢 HAC）。若其實有對照序列，控制組 ITS／DiD 會更穩。",
             en: "The key assumption is <b>no coincident event</b> at the interruption; also handle residual autocorrelation (④ checks HAC). If a control series exists, controlled-ITS/DiD is stronger." } } },
  rTiT: { rec: { kind: "toolbox", method: "tit", badge: "TiT ✓",
    title: { zh: "最適合：趨勢中的趨勢 TiT", en: "Best fit: Trend-in-Trend (TiT)" },
    why: { zh: "暴露隨日曆時間逐漸普及、跨族群速度不同，且結果罕見，看「結果率的趨勢」是否跟著「暴露率的趨勢」走。它是案例-時間對照（CTC/CCTC）的世代版。",
           en: "Exposure spreads over calendar time at different rates across strata and the outcome is rare — check whether the outcome-rate trend tracks the exposure-rate trend. It is the cohort cousin of case-time-control (CTC/CCTC)." },
    scenario: { zh: "疫苗情境：一支新疫苗的接種率隨季逐漸上升、不同縣市快慢不同。看「事件率的趨勢」是否跟著「接種率的趨勢」一起走。",
                en: "Vaccine scenario: a new vaccine's uptake climbs over quarters, faster in some counties. Check whether the event-rate trend moves in step with the uptake trend." },
    watch: { zh: "最關鍵、不可檢驗的是<b>沒有與接種趨勢同步的未測混淆趨勢</b>。另一個重要限制：它建模「每期盛行率」，<b>只適合會反覆發生／也會痊癒的（急性）結果，看不了死亡</b>，死掉的人在這個框架下仍留在分母（見 TiT ④）。",
             en: "The key untestable assumption is <b>no unmeasured confounder trend that moves in step with uptake</b>. Another important limit: it models per-period prevalence, so it <b>fits recurrent / resolving (acute) outcomes and CANNOT handle death</b> — the deceased still sit in the denominator here (see TiT ④)." } } },
  rPERR: { rec: { kind: "toolbox", method: "perr", badge: "PERR ✓",
    title: { zh: "最適合：事前事件率比 PERR", en: "Best fit: Prior Event Rate Ratio (PERR)" },
    why: { zh: "你有兩組在「暴露前」與「暴露後」的事件率，且相信混淆隨時間穩定，用同一群人「暴露前」的率比當混淆基準除掉。",
           en: "You have both groups' event rates in a pre- and a post-exposure window and believe confounding is stable — divide out the same people's pre-exposure ratio as the confounding benchmark." },
    scenario: { zh: "疫苗情境：高風險者較常被接種。比較接種 vs 未接種者在「接種前」與「接種後」的事件率比，用事前率比扣掉體質差異。",
                en: "Vaccine scenario: higher-risk people get vaccinated more. Compare vaccinated vs unvaccinated rate ratios in a pre- and a post-window, dividing out the prior ratio as the confounding benchmark." },
    watch: { zh: "最關鍵的是<b>混淆時間不變且為乘法尺度</b>（P1）；事前期事件數要夠多，否則基準不穩。",
             en: "The key assumption is <b>time-invariant, multiplicative confounding</b> (P1); the prior window needs enough events or the benchmark is unstable." } } },
  rNC: { rec: { kind: "toolbox", method: "nc", badge: "NC ✓",
    title: { zh: "最適合：陰性對照與近端因果 NC ✓（本工具）", en: "Best fit: Negative Control & Proximal (NC) ✓ (this tool)" },
    why: { zh: "你擔心有<b>未測混淆</b>，但手上有一對<b>陰性對照</b>，一個<b>對結果無因果</b>的暴露代理（NCE）＋一個<b>不受暴露影響</b>的結果代理（NCO），兩者都與該混淆相關。先用「A→陰性對照結果本應為 0」<b>偵測</b>偏誤，再用<b>雙陰性對照／近端因果（P2SLS）</b>把未測混淆扣掉、還原效應。",
           en: "You worry about <b>unmeasured confounding</b> but have a pair of <b>negative controls</b> — an exposure proxy with <b>no effect on the outcome</b> (NCE) + an outcome proxy <b>unaffected by exposure</b> (NCO), both associated with that confounder. <b>Detect</b> bias via 'A→NCO should be 0', then <b>correct</b> it with <b>double negative control / proximal (P2SLS)</b> to recover the effect." },
    scenario: { zh: "疫苗情境：健康／就醫傾向（未測）同時影響接種與結果。用接種前事件當陰性對照結果、另一個與健康傾向相關但不影響結果的暴露當陰性對照暴露，偵測並校正 healthy-vaccinee 偏誤（見「NC」分頁 ①–⑥）。",
                en: "Vaccine scenario: health / care-seeking (unmeasured) drives both vaccination and the outcome. Use a pre-vaccination event as the NCO and a health-related exposure that can't affect the outcome as the NCE to detect and correct healthy-vaccinee bias (see the NC tabs ①–⑥)." },
    watch: { zh: "✓ 本工具箱已實作。核心代價：<b>陰性對照的「無因果」與完備性不可檢驗</b>，要靠領域知識挑選；代理要夠相關（類似工具強度）。",
             en: "✓ Implemented in this toolbox. The price: the negative controls' <b>'no causal effect' and completeness are untestable</b> — choose by domain knowledge; proxies must be relevant enough (like instrument strength)." } } },
  rMED: { rec: { kind: "toolbox", method: "med", badge: "MED ✓",
    title: { zh: "最適合：中介分析 MED ✓（本工具）", en: "Best fit: Mediation analysis (MED) ✓ (this tool)" },
    why: { zh: "你已知（或正在估）某暴露對結果有效果，現在想知道<b>機制</b>：這個效果有多少是<b>透過某個中介 M</b>（間接 NIE）、多少走<b>其他路徑</b>（直接 NDE）。中介分析把總效果拆成 TE＝NDE＋NIE，並報<b>被中介比例</b>。這不是「控制混淆的設計」，而是效果的<b>分解</b>，通常接在前面任一設計之後。",
           en: "You already know (or are estimating) that an exposure affects an outcome, and now want the <b>mechanism</b>: how much of the effect runs <b>through a mediator M</b> (indirect NIE) vs <b>other pathways</b> (direct NDE). Mediation splits the total into TE = NDE + NIE and reports the <b>proportion mediated</b>. It is not a confounding-control design but a <b>decomposition</b> that usually follows one of the designs above." },
    scenario: { zh: "疫苗情境：疫苗對感染的保護，有多少是透過提高抗體效價（中介）？用中介分析估自然直接／間接效果與被中介比例（見「MED」分頁 ①–⑦）。",
                en: "Vaccine scenario: how much of the vaccine's protection against infection runs through raising antibody titer (the mediator)? Mediation estimates the natural direct/indirect effects and proportion mediated (see the MED tabs ①–⑦)." },
    watch: { zh: "✓ 本工具箱已實作。最關鍵代價：要拆出間接效果，必須<b>沒有未測的中介–結果（M–Y）混淆</b>，<b>連把暴露隨機分派都換不到</b>這一條；務必做敏感度分析。",
             en: "✓ Implemented in this toolbox. The key price: isolating the indirect effect needs <b>no unmeasured mediator-outcome (M–Y) confounding</b> — <b>not even randomising the exposure buys this</b>; always run a sensitivity analysis." } } },
  rPS: { rec: { kind: "toolbox", method: "ps", badge: "PS ✓",
    title: { zh: "最適合：傾向分數 PS ✓（本工具）", en: "Best fit: Propensity Score (PS) ✓ (this tool)" },
    why: { zh: "沒有準隨機結構、也不是動態策略，但你<b>測到了會驅動治療與結果的共變項</b>，那就用<b>傾向分數 PS＝P(A|X)</b> 把它們<b>平衡</b>掉：<b>配對</b>（ATT）、<b>IPTW</b>（ATE）或<b>重疊權重</b>（ATO）。平衡好不好用<b>標準化差異 SMD</b> 檢查（目標 &lt; 0.1），而不是看 PS 預測得準不準。PS 是 RWE 最核心的工作馬，後面的 TMLE／g-methods 也都以它為基礎。",
           en: "No quasi-random structure and not a dynamic strategy, but you <b>measured the covariates that drive treatment and outcome</b> — then use the <b>propensity score PS = P(A|X)</b> to <b>balance</b> them: <b>matching</b> (ATT), <b>IPTW</b> (ATE) or <b>overlap weights</b> (ATO). Judge balance by the <b>standardized mean difference (SMD)</b> (target &lt; 0.1), not by how well the PS predicts treatment. PS is the workhorse of RWE and underpins TMLE / g-methods." },
    scenario: { zh: "疫苗情境：病重者（已測嚴重度 X 大）較易接種、也較易出事（適應症混淆）。對 PS 做配對／加權，讓兩組在 X 上看起來一樣，再比較（見「PS」分頁 ①–⑦）。",
                en: "Vaccine scenario: sicker people (large measured severity X) are more likely to be vaccinated and to have the outcome (confounding by indication). Match/weight on the PS so the groups look alike on X, then compare (see the PS tabs ①–⑦)." },
    watch: { zh: "✓ 本工具箱已實作。最關鍵、不可檢驗的是<b>無未測混淆</b>，PS 只能平衡<b>有測到</b>的 X；還要<b>正性／重疊</b>（每人 0 &lt; PS &lt; 1）。",
             en: "✓ Implemented in this toolbox. The key untestable assumption is <b>no unmeasured confounding</b> — PS only balances the X you <b>measured</b>; also needs <b>positivity / overlap</b> (0 &lt; PS &lt; 1 for everyone)." } } },
  rTMLE: { rec: { kind: "toolbox", method: "tmle", badge: "TMLE ✓",
    title: { zh: "最適合：雙重穩健／TMLE ✓（本工具）", en: "Best fit: Doubly-robust / TMLE ✓ (this tool)" },
    why: { zh: "和 PS 一樣是「已測共變項、想校正」的情境，但你想要<b>更穩</b>：<b>雙重穩健（AIPW／TMLE）</b>同時配<b>兩張網</b>，結果模型（給定 X、A 下的 Y）＋傾向模型 PS，只要<b>其中一個對</b>就不偏（PS 法只賭傾向模型對）。TMLE 再做一步 <b>targeting</b> 取得半參數<b>有效率</b>估計，天然搭配 <b>機器學習／Super Learner</b> 當輔助模型。",
           en: "Same 'measured covariates, want adjustment' situation as PS, but you want to be <b>more robust</b>: <b>doubly-robust (AIPW / TMLE)</b> fits <b>two models</b> — an outcome model (Y given X, A) and a propensity model PS — and stays unbiased if <b>either one</b> is right (plain PS bets only on the propensity model). TMLE adds a <b>targeting</b> step for a semiparametric-<b>efficient</b> estimate and pairs naturally with <b>machine learning / Super Learner</b> for the nuisance models." },
    scenario: { zh: "疫苗情境：嚴重度 X 對接種與結果都是<b>非線性</b>影響。單一線性模型容易設錯；AIPW／TMLE 用兩張（可用 ML 的）網互相保險，把 ATE 還原到真值（見「TMLE」分頁 ①–⑦）。",
                en: "Vaccine scenario: severity X drives both treatment and outcome <b>non-linearly</b>. A single linear model is easily mis-specified; AIPW/TMLE insure two (optionally ML) models against each other and recover the true ATE (see the TMLE tabs ①–⑦)." },
    watch: { zh: "✓ 本工具箱已實作。仍需<b>無未測混淆＋正性</b>；雙重穩健保的是「模型設定」、<b>不是</b>未測混淆。至少一個輔助模型要設定正確、Super Learner 函式庫要夠豐富。",
             en: "✓ Implemented in this toolbox. Still needs <b>no unmeasured confounding + positivity</b>; double robustness guards <b>model specification</b>, <b>not</b> unmeasured confounding. At least one nuisance model must be right, and the Super Learner library rich enough." } } },
  rGM: { rec: { kind: "toolbox", method: "gm", badge: "G-methods ✓",
    title: { zh: "最適合：G-methods（時變混淆）✓（本工具）", en: "Best fit: G-methods (time-varying confounding) ✓ (this tool)" },
    why: { zh: "你的治療<b>分多個時點</b>給、且有一個<b>時變混淆 Lₜ</b>：它預測下一次治療、<b>又被過去治療改變</b>、也影響結果（治療↔混淆<b>回饋</b>）。這時標準迴歸<b>兩頭都錯</b>，不校正 Lₜ 被混淆、校正 Lₜ 又擋掉效果路徑＋開對撞。要用 <b>g-methods</b>：<b>g-formula</b>（標準化）、<b>IPTW 邊際結構模型</b>（反治療機率加權）、或 <b>g-estimation</b>，估「全程治療 vs 全程不治療」這類策略的效果。",
           en: "Your treatment is given at <b>several time points</b> and there is a <b>time-varying confounder Lₜ</b> that predicts the next treatment, is <b>itself changed by past treatment</b>, and affects the outcome (treatment–confounder <b>feedback</b>). Standard regression is then wrong <b>both ways</b> — not adjusting for Lₜ is confounded, adjusting blocks the effect path and opens a collider. Use <b>g-methods</b>: the <b>g-formula</b> (standardisation), the <b>IPTW marginal structural model</b> (inverse-probability-of-treatment weighting), or <b>g-estimation</b>, to estimate a treatment-regime effect like 'always treat vs never'." },
    scenario: { zh: "疫苗／藥物情境：一種藥分兩期服用，中間的疾病活動度 Lₜ 既決定要不要續用、又被前一劑壓低、也影響結果。用 g-formula／IPTW-MSM 還原「全程用 vs 全程不用」的效果（見「G-methods」分頁 ①–⑦）。",
                en: "Drug scenario: a drug taken over two periods; disease activity Lₜ in between both drives whether you continue and is lowered by the earlier dose, and affects the outcome. g-formula / IPTW-MSM recover the 'always vs never' effect (see the G-methods tabs ①–⑦)." },
    watch: { zh: "✓ 本工具箱已實作。最關鍵、不可檢驗的是<b>序列可交換</b>（無未測<b>時變</b>混淆）；還需每個時點正性、輔助模型設定正確（可用 ML，並可搭 TMLE 做雙重穩健）。",
             en: "✓ Implemented in this toolbox. The key untestable assumption is <b>sequential exchangeability</b> (no unmeasured <b>time-varying</b> confounding); also needs per-time positivity and correct nuisance models (ML-improvable, and pairs with TMLE for double robustness)." } } },
  rTND: { rec: { kind: "toolbox", method: "tnd", badge: "TND ✓",
    title: { zh: "最適合：陰性檢驗設計 TND ✓（本工具）", en: "Best fit: Test-Negative Design (TND) ✓ (this tool)" },
    why: { zh: "你要估<b>疫苗效力 VE</b>，麻煩是<b>就醫傾向</b>是未測混淆（愛就醫者較常接種、也較常被檢驗發現感染）。<b>陰性檢驗設計</b>只在「<b>因症狀就醫並檢驗</b>」的人裡比：case＝目標病原檢驗陽性、control＝檢驗陰性（其他病原）。兩組都通過同一道就醫濾網，就醫傾向被條件掉 → 接種勝算比給 <b>VE ＝ 1 − OR</b>。",
           en: "You want <b>vaccine effectiveness (VE)</b>, and the trouble is <b>care-seeking</b> as an unmeasured confounder (care-seekers vaccinate more and have infections detected more). The <b>test-negative design</b> compares only people who <b>sought care for symptoms and were tested</b>: cases test positive for the target, controls test negative (another pathogen). Both passed the same care-seeking filter, so it is conditioned out and the vaccination odds ratio gives <b>VE = 1 − OR</b>." },
    scenario: { zh: "疫苗情境：在因急性呼吸道症狀就醫並檢驗的人裡，比流感檢驗陽性（case）與陰性（control）的接種勝算，估流感疫苗效力（見「TND」分頁 ①–⑦）。",
                en: "Vaccine scenario: among people tested for acute respiratory symptoms, compare vaccination odds in influenza-positive (cases) vs negative (controls) to estimate influenza VE (see the TND tabs ①–⑦)." },
    watch: { zh: "✓ 本工具箱已實作。關鍵、多不可檢驗：檢驗準確、<b>疫苗不影響對照疾病</b>、相同症狀下就醫無差別。其他<b>已測</b>混淆（年齡、日曆時間）仍要調整（可用因果 TND／ML，見 ⑤）。",
             en: "✓ Implemented in this toolbox. Key, mostly untestable: an accurate test, the <b>vaccine not affecting the control illness</b>, and no differential care-seeking given symptoms. Other <b>measured</b> confounders (age, calendar time) still need adjustment (a causal TND / ML, see ⑤)." } } },
  rPSSA: { rec: { kind: "toolbox", method: "pssa", badge: "PSSA ✓",
    title: { zh: "最適合：處方順序對稱分析 PSSA ✓（本工具）", en: "Best fit: Prescription Sequence Symmetry Analysis (PSSA) ✓ (this tool)" },
    why: { zh: "你想<b>快速、自我對照地篩</b>出「藥 A 引起某症狀、症狀又被藥 B 處理」的<b>處方瀑布</b>。在兩種藥都用過的人裡數「先 A 後 B」（a）與「先 B 後 A」（b）：未校正順序比 cSR ＝ a ÷ b 會被<b>處方趨勢</b>灌成假訊號，除以「只有趨勢」的 SRnull 得 <b>aSR ＝ cSR ÷ SRnull</b>；aSR＞1 且 CI 不含 1 ＝訊號。這是<b>產生假說</b>的篩檢，不是效果估計。",
           en: "You want a <b>fast, self-controlled screen</b> for a <b>prescribing cascade</b> ('drug A causes a symptom, treated with drug B'). Among people who used both, count A-then-B (a) and B-then-A (b): the crude SR = a ÷ b is inflated into a false signal by the <b>prescribing trend</b>; dividing by the trend-only SRnull gives <b>aSR = cSR ÷ SRnull</b>; aSR > 1 with a CI excluding 1 = a signal. This is a <b>hypothesis-generating</b> screen, not an effect estimate." },
    scenario: { zh: "藥物安全情境：新藥 A 上市後逐年普及；想知道 A 是否引發某不良反應、進而被 B 處理。用 PSSA 快速標出候選配對，再用控混淆的設計（世代／SCCS／主動對照）追下去（見「PSSA」分頁 ①–⑦）。",
                en: "Drug-safety scenario: a new drug A diffuses over calendar time; you want to flag whether A triggers an adverse event that gets treated with B. PSSA quickly flags candidate pairs, to follow up with a confounder-controlled design (cohort / SCCS / active comparator) — see the PSSA tabs ①–⑦." },
    watch: { zh: "✓ 本工具箱已實作。它<b>只標、不確認</b>：關鍵、多不可檢驗的是<b>瀑布方向合理</b>、趨勢建模正確（SRnull）、新使用者、時間窗合適。被標出的配對要用控混淆的設計追蹤。想<b>一次篩上千個結果</b>＝看 TreeScan。",
             en: "✓ Implemented in this toolbox. It <b>flags, it does not confirm</b>: key, mostly untestable items are a plausible cascade direction, a correctly modelled trend (SRnull), new users, and a sensible time window. Flagged pairs need a confounder-controlled follow-up. To screen <b>thousands of outcomes at once</b>, see TreeScan." } } },
  rTSCAN: { rec: { kind: "toolbox", method: "tscan", badge: "TreeScan ✓",
    title: { zh: "最適合：樹狀掃描統計 TreeScan ✓（本工具）", en: "Best fit: Tree-based Scan Statistic (TreeScan) ✓ (this tool)" },
    why: { zh: "你想<b>一次掃整個結果階層</b>（數百到數千個事件，組成 MedDRA PT→SOC 之類的樹）找暴露的安全訊號，又不被<b>多重比較</b>的假陽性淹沒。TreeScan 為每個節點（葉＋父）算 Bernoulli <b>LLR</b>、取整棵樹的<b>最大 LLR</b>、用<b>打亂暴露標籤的排列法</b>給校正 p；這個最大統計量校正一次就把<b>族系錯誤率</b>控制住，只有真超額存活。",
           en: "You want to <b>scan a whole outcome hierarchy</b> (hundreds–thousands of events forming a tree like MedDRA PT→SOC) for an exposure's safety signals, without drowning in <b>multiplicity</b> false positives. TreeScan computes a Bernoulli <b>LLR</b> at every node (leaf + parent), takes the <b>maximum LLR</b> over the tree, and gets an adjusted p by <b>permuting exposure labels</b>; that one max-statistic correction controls the <b>family-wise error</b> so only real excesses survive." },
    scenario: { zh: "藥物／疫苗安全情境：一次暴露後掃描整棵不良反應樹，找出哪個事件（或哪個系統）有超額，FDA Sentinel 式的主動監測（見「TreeScan」分頁 ①–⑦）。",
                en: "Drug / vaccine safety scenario: after one exposure, scan the whole adverse-event tree to find which event (or system) is in excess — FDA-Sentinel-style active surveillance (see the TreeScan tabs ①–⑦)." },
    watch: { zh: "✓ 本工具箱已實作。它<b>只標、不確認</b>：關鍵、多不可檢驗的是<b>樹建得對</b>、各節點基準為常數、排列虛無有效（無未建模混淆）。被標出的節點要用控混淆的設計追蹤；想對混淆更穩健＝自我對照樹-時序掃描（見 ⑤）。它是 PSSA 的高通量表親。",
             en: "✓ Implemented in this toolbox. It <b>flags, it does not confirm</b>: key, mostly untestable items are a well-built tree, a constant baseline across nodes, and a valid permutation null (no unmodelled confounding). Flagged nodes need a confounder-controlled follow-up; for confounding robustness use a self-controlled tree-temporal scan (see ⑤). It is the high-throughput cousin of PSSA." } } },
  rWCE: { rec: { kind: "toolbox", method: "wce", badge: "WCE ✓",
    title: { zh: "最適合：加權累積暴露 WCE ✓（本工具）", en: "Best fit: Weighted Cumulative Exposure (WCE) ✓ (this tool)" },
    why: { zh: "你的暴露是<b>逐月增減</b>的用藥史，而且你相信「一劑藥的影響會隨時間而變」，最近的劑量可能比很久以前的重要。與其用「現在有沒有用藥」或「總劑量等權加總」這兩種會把時間權重設錯的未校正做法，<b>WCE</b> 直接從資料估出<b>權重函數</b> w(距離用藥的時間)，把過去每個月的劑量各乘上對應權重再加總，放進 Cox／風險模型。它<b>還原權重的形狀</b>（最近最重、隨時間衰減）與整體效果。",
           en: "Your exposure is a <b>month-to-month dosing history</b>, and you believe a dose's effect changes over time — recent doses may matter more than long-ago ones. Rather than the naive 'current use?' or 'equally-weighted total dose' (both forcing a wrong time-weight), <b>WCE</b> estimates the <b>weight function</b> w(time-since-dose) directly from the data, multiplying each past month's dose by its weight and summing into a Cox/hazard model. It recovers the <b>shape of the weight</b> (recent doses weigh most, decaying) and the overall effect." },
    scenario: { zh: "藥物安全情境：某長期用藥與某不良事件，效果集中在最近幾個月的用藥。用 WCE 估出權重曲線、看出「風險主要由近期暴露驅動」，並比未校正的當下／總劑量模型更貼近真值（見「WCE」分頁 ①–⑦）。",
                en: "Drug-safety scenario: a chronic drug and an adverse event whose effect concentrates in the last few months of use. WCE recovers the weight curve, shows the risk is driven mostly by recent exposure, and beats the naive current-use / total-dose models (see the WCE tabs ①–⑦)." },
    watch: { zh: "✓ 本工具箱已實作。需要<b>逐時間、準確的暴露史</b>與夠長的時間窗；事件要夠多（估整條曲線比估一個數字更吃資料）。最關鍵、不可檢的是<b>沒有時變的適應症混淆</b>，若病情同時驅動用藥與結果，要改用邊際結構 Cox／g-methods（見 ⑤、⑥）。",
             en: "✓ Implemented in this toolbox. Needs a <b>time-resolved, accurate exposure history</b> and a long-enough window; enough events (estimating a whole curve is data-hungry). The key, untestable item is <b>no time-varying confounding by indication</b> — if disease state drives both dose and outcome, switch to a marginal structural Cox / g-methods (see ⑤, ⑥)." } } },
  // common / external designs (reference)
  rACC: { rec: { kind: "toolbox", method: "acnu", badge: "ACNU ✓",
    title: { zh: "建議：主動對照新使用者 ACNU ✓（本工具）", en: "Suggested: Active-Comparator, New-User (ACNU) ✓ (this tool)" },
    why: { zh: "你有藥理／適應症相近的對照藥可比，用「<b>新使用者＋主動對照</b>（A 的新使用者 vs B 的新使用者）」設計，兩組都有這個病、都剛起始、時間零點明確，能大幅削掉<b>因適應症的混淆</b>與 immortal-time／既有使用者偏誤；殘留的嚴重度差再用傾向分數校正。",
           en: "With a pharmacologically / indication-similar comparator, a <b>new-user active-comparator</b> design (new users of A vs new users of B) puts both groups in the same indicated population with a clear time zero, sharply cutting <b>confounding by indication</b> and immortal-time / prevalent-user bias; residual severity is then handled by a propensity score." },
    scenario: { zh: "疫苗情境：不用「打 vs 不打」比，而是比「打 A 廠牌 vs 打 B 廠牌」的新接種者，兩組都願意接種、體質較接近（見「ACNU」分頁 ①–⑥）。",
                en: "Vaccine scenario: instead of 'vaccinated vs not', compare new recipients of brand A vs brand B — both groups chose to vaccinate, so they're more alike (see the ACNU tabs ①–⑥)." },
    watch: { zh: "✓ 本工具箱已實作。需要一個<b>同適應症、對該結果中性</b>的對照藥；估的是 A『相對 B』的效應。常可結合 <b>target trial emulation</b>。",
             en: "✓ Implemented in this toolbox. Needs a comparator that shares the indication and is <b>neutral for the outcome</b>; you estimate A's effect <b>relative to B</b>. Often combined with <b>target trial emulation</b>." } } },
  rPNU: { rec: { kind: "toolbox", method: "pnu", badge: "PNU ✓",
    title: { zh: "建議：盛行新使用者 PNU ✓（本工具）", en: "Suggested: Prevalent New-User (PNU) ✓ (this tool)" },
    why: { zh: "純新使用者設計會<b>丟掉所有既有（盛行）使用者</b>，樣本小、代表性差；但未經校正就把盛行使用者直接和新起始者比會中<b>易感者耗竭</b>偏誤（留下來的是低風險存活者）。PNU 用<b>時間條件配對</b>（依距起始時間對齊＋時間條件傾向分數）把盛行使用者<b>納回來</b>，既不偏、又用上他們。",
           en: "A new-user-only design <b>discards all prevalent users</b> (small, less representative); but naively pooling prevalent users with new starters suffers <b>depletion of susceptibles</b> (the survivors are lower-risk). PNU uses <b>time-conditional matching</b> (align on time-since-start + a time-conditional propensity score) to <b>bring prevalent users back</b> — unbiased and using them." },
    scenario: { zh: "疫苗情境：很多人已經接種過一段時間（盛行使用者）；只用「剛接種者」會丟掉他們，PNU 依「距接種時間」把他們對齊納回來（見「PNU」分頁 ①–⑥）。",
                en: "Vaccine scenario: many people were vaccinated a while ago (prevalent users); using only fresh recipients discards them — PNU realigns them by time-since-vaccination and brings them back (see the PNU tabs ①–⑥)." },
    watch: { zh: "✓ 本工具箱已實作。需要盛行使用者的<b>暴露起始史</b>（何時起始、用多久）；殘留時變混淆仍需校正。",
             en: "✓ Implemented in this toolbox. Needs prevalent users' <b>treatment-start history</b> (when they started, for how long); residual time-varying confounding still needs adjustment." } } },
  rSCCS: { rec: { kind: "toolbox", method: "sccs", badge: "SCCS ✓",
    title: { zh: "建議：自身對照病例系列 SCCS ✓（本工具）", en: "Suggested: self-controlled case series (SCCS) ✓ (this tool)" },
    why: { zh: "結果是急性、短暫事件、暴露有明確時窗，SCCS <b>只用 case</b>、用「<b>個人自身</b>」當對照，把每個人切成接種後的危險窗與基線期比較，<b>自動消掉所有不隨時間變的混淆</b>（基因、體質、社經）。時變因子（年齡、季節）用切分處理。",
           en: "For acute, transient outcomes with a well-defined exposure window, SCCS uses <b>only cases</b> and makes <b>each person their own control</b> — splitting each into a post-exposure risk window vs baseline, which <b>cancels all time-fixed confounding</b> (genetics, constitution, socioeconomics). Time-varying factors (age, season) are handled by splitting." },
    scenario: { zh: "疫苗情境：只取「接種後曾發生不良事件」的人，比較他們在「接種後危險窗 vs 自己其他時間」的事件率，每個人當自己的對照（見「自身對照病例系列」分頁 ①–⑤）。",
                en: "Vaccine scenario: take only people who had an adverse event, and compare their event rate in the post-vaccination risk window vs their own other time — each person is their own control (see the SCCS tabs ①–⑤)." },
    watch: { zh: "✓ 本工具箱已實作。需假設事件<b>不致命、可復發</b>（致死事件用修正版）、且事件<b>不影響後續暴露</b>機率。",
             en: "✓ Implemented in this toolbox. Assumes events are <b>non-fatal / recurrent</b> (fatal events need a modified version) and that the event <b>does not alter later exposure</b> probability." } } },
  rCCW: { rec: { kind: "toolbox", method: "ccw", badge: "CCW ✓",
    title: { zh: "建議：複製-設限-加權 CCW ✓（本工具）", en: "Suggested: clone-censor-weight (CCW) ✓ (this tool)" },
    why: { zh: "CCW 適合「<b>診斷後一段時間的動態／持續策略</b>」，例如早 vs 晚開始、是否持續或密集用藥。這種隨時間調整的策略若直接分組會有 immortal time bias；CCW 在時間零點把每個人複製到各策略、依偏離設限、再加權校正。<b>好處</b>：若比較「<b>早用 vs 晚用</b>」，兩組<b>最終都會用藥（適應症相同）</b>，因此能大幅減輕「<b>因適應症而生的混淆（confounding by indication）</b>」。",
           en: "CCW fits a <b>sustained / dynamic strategy over a window after diagnosis</b> — e.g. early vs late initiation, or sustained / intensive use. Naively grouping such a time-varying strategy creates immortal-time bias; CCW clones each person into each strategy at time zero, censors on deviation, and reweights. <b>Bonus</b>: comparing <b>early vs late</b> use largely removes <b>confounding by indication</b>, because <b>both groups end up treated</b> (same indication) — only the timing differs." },
    scenario: { zh: "疫苗情境：比較「確診後<b>早接種 vs 晚接種</b>」，或「是否持續按時打追加劑」這類隨時間調整的策略。把每個人複製到各策略、依偏離設限再加權，避免 immortal time bias。",
                en: "Vaccine scenario: compare '<b>early vs late</b> vaccination after diagnosis', or 'keep up booster doses on schedule or not' — a time-varying strategy. Clone each person into each strategy, censor on deviation, then reweight — avoiding immortal-time bias." },
    watch: { zh: "✓ 本工具箱已實作（見 CCW 分頁 ①–⑤）。是 <b>target trial emulation</b> 的常見實作之一。",
             en: "✓ Implemented in this toolbox (see the CCW tabs ①–⑤). A common way to implement <b>target trial emulation</b>." } } },
  rSEQ: { rec: { kind: "toolbox", method: "seq", badge: "Seq ✓",
    title: { zh: "建議：序列試驗 sequential trial ✓（本工具）", en: "Suggested: sequential trials ✓ (this tool)" },
    why: { zh: "序列試驗適合「<b>某時點的單次（點）治療決定</b>」（不是診斷後持續調整的策略），病人在不同時間點陸續符合資格時，在每個符合點各開一場「迷你試驗」（當下打 vs 不打）、對齊時間零點再合併。和 CCW 的差別：這裡是<b>點治療</b>，CCW 處理的是<b>診斷後一段時間的動態／持續策略</b>。<b>好處</b>：同一個人可在多個符合點被重複納入，<b>潛在能放大有效樣本數</b>。",
           en: "Sequential trials fit a <b>one-shot (point) treatment decision</b> (not a strategy adjusted over time): when patients become eligible at different times, open a 'mini-trial' at each point (treat now vs not), align time zero, then pool. Versus CCW: here the treatment is a <b>point decision</b>, whereas CCW handles a <b>sustained / dynamic strategy over a window after diagnosis</b>. <b>Bonus</b>: the same person can re-enter at several eligibility points, so it can <b>boost the effective sample size</b>." },
    scenario: { zh: "疫苗情境：每個月把「當月剛符合接種資格的人」開一場迷你試驗（<b>當下打 vs 暫不打</b>，一次決定），再把多場合併估計。",
                en: "Vaccine scenario: each month, open a mini-trial among people who just became eligible (<b>vaccinate now vs not</b> — a one-shot decision), then pool across months." },
    watch: { zh: "✓ 本工具箱已實作（見「序列試驗」分頁 ①–⑤）。也屬 <b>target trial emulation</b> 家族。",
             en: "✓ Implemented in this toolbox (see the Sequential-trials tabs ①–⑤). Also part of the <b>target trial emulation</b> family." } } },
  rCCTC: { rec: { kind: "toolbox", method: "cctc", badge: "CCTC ✓",
    title: { zh: "建議：案例交叉／案例-時間對照 CCTC ✓（本工具）", en: "Suggested: case-crossover / case-(case-)time-control (CCTC) ✓ (this tool)" },
    why: { zh: "暴露<b>短暫、會波動</b>，想用個人自身近期當對照，比較發病前的危險窗 vs 較早的參考窗（案例交叉，CCO），自我控制掉所有穩定特徵。若暴露的<b>盛行率隨日曆時間上升</b>，純 CCO 會被高估；用對照族群（或較晚發病的未來 case）把趨勢扣掉，就是 <b>CCTC</b>。其「世代版」正是本工具箱的 TiT。",
           en: "For a <b>transient, fluctuating</b> exposure, use each case's own recent past as control — compare the pre-event hazard window vs an earlier reference window (case-crossover, CCO), cancelling every time-stable trait. If the exposure's <b>prevalence trends up over calendar time</b>, plain CCO is inflated; net out that trend with controls (or future-onset cases) → <b>CCTC</b>. Its cohort version is this toolbox's TiT." },
    scenario: { zh: "疫苗情境：對「接種後當天就醫」這種急性事件，比較事件前幾天 vs 更早一段時間的接種暴露；若全國接種率逐年上升，再用對照族群把趨勢扣掉。",
                en: "Vaccine scenario: for an acute event like an ER visit on the day of vaccination, compare exposure in the days before vs an earlier reference window; if national uptake rises year on year, net out the trend with a control group." },
    watch: { zh: "✓ 本工具箱已實作（見 CCTC 分頁 ①–⑤）。若你有世代資料，也可改用世代版 <b>TiT ✓</b>。",
             en: "✓ Implemented in this toolbox (see the CCTC tabs ①–⑤). With cohort data you can also use the cohort version <b>TiT ✓</b>." },
    altMethod: "tit", altLabel: { zh: "改用世代版 TiT →", en: "Use the cohort version: TiT →" } } },
  rCC: { rec: { kind: "toolbox", method: "cc", badge: "CC ✓",
    title: { zh: "建議：病例對照 case-control ✓（本工具）", en: "Suggested: case-control ✓ (this tool)" },
    why: { zh: "<b>結果罕見</b>時最有效率的設計：先找個案與對照，再回看暴露，用<b>勝算比</b>衡量。關鍵是<b>對照取自產生個案的同一來源族群</b>、暴露兩組量得一樣準；混淆用 logistic <b>校正</b>、Mantel–Haenszel <b>分層</b>、或<b>配對</b>＋條件式分析處理。現代視角：把它當成對「模擬目標試驗的世代」做病例對照抽樣。",
           en: "The most efficient design when the <b>outcome is rare</b>: find cases and controls, look back at exposure, summarise with an <b>odds ratio</b>. The keys are <b>controls from the same source population that produced the cases</b> and equally-measured exposure; handle confounding by logistic <b>adjustment</b>, Mantel–Haenszel <b>stratification</b>, or <b>matching</b> + conditional analysis. Modern view: it's case-control sampling of a target-trial-emulating cohort." },
    scenario: { zh: "疫苗情境：要研究一個罕見的不良事件，找到「發生該事件的個案」與「沒發生的對照」，回頭比兩組過去的接種暴露，並校正年齡等混淆。",
                en: "Vaccine scenario: to study a rare adverse event, find cases who had it and controls who didn't, compare their past vaccination exposure, and adjust for age and other confounders." },
    watch: { zh: "✓ 本工具箱已實作（見「病例對照」分頁 ①–⑤）。配對時務必用條件式分析；別配在中介／對撞因子。",
             en: "✓ Implemented in this toolbox (see the Case-control tabs ①–⑤). With matching, use conditional analysis; never match on mediators/colliders." } } },
  rNCC: { rec: { kind: "toolbox", method: "cc", badge: "CC ✓",
    title: { zh: "建議：病例對照（巢式對照）case-control ✓（本工具）", en: "Suggested: case-control (nested case-control) ✓ (this tool)" },
    why: { zh: "<b>巢式對照其實就是病例對照</b>，只是把它「巢」在一個明確世代裡：只對「個案＋抽樣對照」量暴露。所以它特別適合<b>需要費工測量「暴露量／劑量」</b>的研究，量得起就能畫出<b>劑量–反應（dose-response）</b>關係，而結果≈完整世代分析。分析方法與「病例對照」分頁完全相同（勝算比、校正／配對、條件式分析）。",
           en: "<b>A nested case-control IS just a case-control study</b> — nested inside an explicit cohort: exposure is measured only for cases + sampled controls. That makes it ideal when the exposure <b>level/dose is expensive to measure</b> — you can afford the detailed measurement and map a <b>dose-response</b> relationship, with results ≈ the full-cohort analysis. The analysis is exactly the Case-control tab's (odds ratio, adjustment/matching, conditional analysis)." },
    scenario: { zh: "疫苗情境：在百萬人世代裡，只對「得到該疾病的個案」與抽樣對照<b>仔細量接種劑次／抗體濃度</b>，看「打越多劑、風險怎麼變」的劑量–反應。",
                en: "Vaccine scenario: in a cohort of a million, carefully measure <b>number of doses / antibody level</b> only for disease cases and sampled controls, to map how risk changes with dose." },
    watch: { zh: "✓ 本工具箱已實作（見「病例對照」分頁 ①–⑤），巢式對照就是病例對照的一種抽樣方式。",
             en: "✓ Implemented in this toolbox (see the Case-control tabs ①–⑤) — nested case-control is just a sampling form of case-control." } } },
  rLast: {
    step: { zh: "最後一步（沒辦法的辦法）", en: "Last step (last resort)" },
    q: { zh: "上面的觀察性設計都不符合，這是沒辦法的辦法：你其實已經有一場（別族群的）RCT 可以借嗎？", en: "None of the observational designs above fit — as a last resort: do you actually have an RCT (in another population) to borrow?" },
    opts: [
      { l: { zh: "有，但只有發表的彙總結果（沒有個體資料）", en: "Yes, but only published summary results (no individual data)" }, to: "rEXTCTRL" },
      { l: { zh: "有，且拿得到個體層級資料", en: "Yes, and I can get its individual-level data" }, to: "rTRANS" },
      { l: { zh: "沒有可借的 RCT，但想用<b>實驗／遺傳／模型</b>從外部佐證", en: "No RCT to borrow — but I want to corroborate from outside (experiment / genetics / model)" }, to: "exTri" },
    ],
  },
  exTri: {
    step: { zh: "實驗／遺傳／模型三角驗證", en: "Experimental / genetic / model triangulation" },
    q: { zh: "你想從觀察性資料<b>之外</b>佐證因果？選一個最貼近的取徑（它們各自以不同方式出錯，因此最適合三角驗證）。", en: "Want to corroborate causation from <b>outside</b> observational data? Pick the closest approach (each fails differently, which is what makes them ideal for triangulation)." },
    opts: [
      { l: { zh: "用<b>遺傳變異</b>當工具（人體、終生暴露）", en: "Use a <b>genetic variant</b> as the instrument (human, lifelong exposure)" }, to: "rMR" },
      { l: { zh: "用<b>模型預測的對照軌跡（數位孿生）</b>當比較基準", en: "Use a <b>model-predicted control (digital twin)</b> as the comparator" }, to: "rDT" },
    ],
  },
  rMR: { rec: { kind: "toolbox", method: "mr", badge: "MR ✓",
    title: { zh: "最適合：孟德爾隨機化 MR ✓（本工具）", en: "Best fit: Mendelian randomization (MR) ✓ (this tool)" },
    why: { zh: "你有一個與暴露穩健相關的<b>遺傳變異</b>。等位基因在受孕時近乎隨機分派、且終生固定，所以一個有效的遺傳工具沒有混淆、也沒有反向因果。它就是把工具變數的工具換成基因：每個變異的 β<sub>Y</sub>/β<sub>X</sub> 是一個 Wald 比值，用 IVW 合併、再以 MR-Egger／加權中位數檢查多效性。",
           en: "You have a <b>genetic variant</b> robustly associated with the exposure. Alleles are allocated near-randomly at conception and fixed for life, so a valid genetic instrument is unconfounded and free of reverse causation. It is instrumental variables with a gene as the instrument: each variant's β<sub>Y</sub>/β<sub>X</sub> is a Wald ratio, combined by IVW and stress-tested for pleiotropy with MR-Egger / weighted median." },
    scenario: { zh: "情境：想知道終生 LDL 膽固醇是否導致心臟病，但無法隨機分配膽固醇；改用會升高 LDL 的遺傳變異當工具（見「MR」分頁 ①–⑥）。",
                en: "Scenario: does lifelong LDL cholesterol cause heart disease? You can't randomize cholesterol — use LDL-raising genetic variants as the instrument (see the MR tabs ①–⑥)." },
    watch: { zh: "✓ 本工具箱已實作。IV 三條：相關性（小心弱工具，F&lt;10）、獨立性（族群分層）、排除性（<b>水平多效性</b>是頭號威脅）。",
             en: "✓ Implemented in this toolbox. The IV trio: relevance (beware weak instruments, F&lt;10), independence (population stratification), exclusion (<b>horizontal pleiotropy</b> is the main threat)." } } },
  rDT: { rec: { kind: "toolbox", method: "dt", badge: "Digital twin ✓",
    title: { zh: "最適合：數位孿生 ✓（本工具）", en: "Best fit: Digital twin ✓ (this tool)" },
    why: { zh: "你想用一個<b>預後模型</b>，預測每位病人「未治療」時的軌跡（數位孿生），再把效果讀成「實際 − 孿生」。它可當隨機試驗的精準度調整（PROCOVA），或在缺乏同期對照時當合成對照臂。注意：孿生本身<b>不</b>消除混淆，效度全押在預後模型是否無偏、可轉移。",
           en: "You want a <b>prognostic model</b> that predicts each patient's untreated trajectory (a digital twin), then read the effect as observed − twin. It can be a precision adjustment in an RCT (PROCOVA) or a synthetic control arm when concurrent controls are scarce. Note: the twin removes <b>no</b> confounding by itself — validity rests on the prognostic model being unbiased and transportable." },
    scenario: { zh: "情境：罕病單臂試驗沒有同期對照；用歷史對照資料訓練預後模型，為每位治療者預測未治療軌跡當對照（見「數位孿生」分頁 ①–⑥）。",
                en: "Scenario: a single-arm rare-disease trial with no concurrent control; train a prognostic model on historical controls to predict each treated patient's untreated trajectory as the comparator (see the Digital-twin tabs ①–⑥)." },
    watch: { zh: "✓ 本工具箱已實作。關鍵：預後模型<b>無偏、校準良好、可轉移</b>到當前病人；當孿生取代同期對照時，等於回到歷史對照陷阱。",
             en: "✓ Implemented in this toolbox. Key: the prognostic model must be <b>unbiased, well-calibrated and transportable</b> to current patients; when the twin replaces a concurrent control it re-enters the historical-control trap." } } },
  // adjacent (non-core) approaches — reference leaf cards, reachable from the
  // "adjacent approaches" chips on the choose page (jumpDtree). Their references
  // live in hidden #adjrefs-* blocks pulled in by renderDtree via refsId.
  rEXTCTRL: { rec: { kind: "toolbox", method: "extctrl", badge: "外部對照 ✓",
    title: { zh: "最適合：外部對照 ✓（本工具）， 借一個對照臂補上單臂研究缺的對照", en: "Best fit: External control ✓ (this tool) — borrow a control arm for a single-arm study" },
    why: { zh: "你只有一個<b>單臂</b>（全部都治療）、沒有同期對照。借<b>外部／歷史對照</b>（外部世代、登錄、或那場 RCT 的未治療者）補上對照臂；有個體資料時，用<b>標準化／傾向加權</b>把兩臂的共變項差異校正掉再比較。只有彙總結果時，改走較輕量的 MAIC／STC（配對調整間接比較）。",
           en: "You have a single <b>treated</b> arm with no concurrent control. Borrow an <b>external / historical control</b> (an external cohort, registry, or the untreated arm of that RCT) to supply the missing arm; with individual-level data, adjust the covariate difference between the arms by <b>standardisation / propensity weighting</b> before comparing. With only summary results, use the lighter MAIC / STC (matching-adjusted indirect comparison)." },
    scenario: { zh: "疫苗情境：你只追蹤了一個「接種組」、沒有同期未接種對照；借一場外部 RCT／登錄資料的未接種者當對照臂，校正共變項差異後比較。",
                en: "Vaccine scenario: you only followed a vaccinated arm with no concurrent unvaccinated controls; borrow the unvaccinated arm of an external RCT/registry as the control, and compare after adjusting for covariate differences." },
    watch: { zh: "<b>關鍵</b>：兩來源的可比性（收案、時代、結果定義），歷史對照的頭號風險是時代效應；常用傾向分數／標準化／貝氏動態借用。ICH E10 提醒：效果要夠大、疾病自然史可預測才穩。",
             en: "<b>Key</b>: comparability of the two sources (eligibility, era, outcome definitions) — the top risk with historical controls is an era effect; adjust with propensity scores / standardisation / Bayesian dynamic borrowing. ICH E10 cautions it is only reliable when the effect is large and the disease course is predictable." } } },
  rTRANS: { rec: { kind: "toolbox", method: "transport", badge: "可轉移性 ✓",
    title: { zh: "最適合：可轉移性／泛化 ✓（本工具）， 用個體資料把研究結果轉到你的族群", en: "Best fit: Transportability / generalizability ✓ (this tool) — carry a study's result to your population" },
    why: { zh: "如果你<b>拿得到那場 RCT 的個體層級資料</b>，就能做<b>可移轉性／類推（transportability / generalizability）</b>：用兩邊都測得到的<b>效果修飾因子</b>重新加權，把「在試驗族群成立的因果效果」<b>搬到你關心的目標族群</b>，藉此更了解這個疾病在你族群裡的真實效果。（沒有個體資料、只有彙總結果時，改走上一格的「外部對照」。）",
           en: "If you <b>have the RCT's individual-level data</b>, you can do <b>transportability / generalizability</b>: reweight by <b>effect modifiers</b> measured in both samples to <b>carry the trial's causal effect to your target population</b>, to understand the true effect in the people you care about. (With only summary results, use the 'external control' option instead.)" },
    scenario: { zh: "疫苗情境：疫苗保護力來自一場在某國成人做的 RCT，但你關心的是<b>本地長者</b>。用兩邊共同的風險因子分布重新加權，把試驗估到的效果「轉」到本地長者族群。",
                en: "Vaccine scenario: a vaccine's efficacy comes from an RCT in adults in another country, but you care about <b>local older adults</b>. Reweight by the shared distribution of risk factors to transport the trial's effect to your local elderly population." },
    watch: { zh: "↗ 本工具箱未實作，供參考。<b>關鍵假設</b>：所有會改變效果的<b>修飾因子都測得到</b>，且兩族群在這些因子上有<b>重疊（共同支持）</b>。",
             en: "↗ Not implemented here; for reference. <b>Key assumptions</b>: all effect modifiers are <b>measured</b>, and the two populations <b>overlap</b> on them (common support)." } } },
  rSRMA: { rec: { kind: "toolbox", method: "srma", badge: "SR-MA ✓",
    title: { zh: "最適合：系統性回顧與統合分析 ✓（本工具）， 把整個證據體合成一個答案", en: "Best fit: Systematic review & meta-analysis ✓ (this tool) — synthesise the whole evidence base" },
    why: { zh: "你不是在分析單一份資料，而是想回答「<b>整個證據體</b>說了什麼」。先用事先寫好、可重現的方法（PICO、登錄計畫書、全面檢索、雙人篩選、偏誤風險）找出並評讀所有研究，再在研究夠相似時用<b>統合分析</b>（固定 vs 隨機效果、I²、漏斗圖）合併，最後用 <b>GRADE</b> 評整體證據強度。注意：這是比單一研究<b>更上一層</b>的設計，不是用來控制某一份資料的混淆。",
           en: "You are not analysing one dataset but asking what <b>the whole body of evidence</b> says. Use a pre-specified, reproducible method (PICO, a registered protocol, a comprehensive search, dual screening, risk-of-bias) to find and appraise every study, then — where studies are similar enough — <b>meta-analyse</b> (fixed vs random effects, I², funnel plot), and finally rate certainty with <b>GRADE</b>. Note this sits <b>one level above</b> a single study; it is not a confounding-control design for one dataset." },
    scenario: { zh: "疫苗情境：你想知道某疫苗對某結果的整體效果，找出所有相關試驗／世代研究，評讀並合併成一個帶信賴（與預測）區間的合併估計（見「系統性回顧與統合分析」分頁的即時森林圖／漏斗圖）。",
                en: "Vaccine scenario: you want the overall effect of a vaccine on an outcome — find every relevant trial/cohort study, appraise and pool them into a single estimate with a confidence (and prediction) interval (see the SR-MA page's live forest/funnel plots)." },
    watch: { zh: "✓ 本工具箱已實作。<b>關鍵</b>：合併的可信度不會超過納入的研究（垃圾進、垃圾出），透明的事前方法、偏誤風險評讀、處理異質性與發表偏誤，缺一不可。",
             en: "✓ Implemented in this toolbox. <b>Key</b>: the pool is only as trustworthy as the studies in it (garbage in, garbage out) — a transparent pre-specified method, risk-of-bias appraisal, and handling of heterogeneity & publication bias are all essential." } } },
  rNMA: { rec: { kind: "toolbox", method: "nma", badge: "NMA ✓",
    title: { zh: "最適合：網路統合分析 ✓（本工具）， 一次比較三個以上治療", en: "Best fit: Network meta-analysis ✓ (this tool) — compare three or more treatments at once" },
    why: { zh: "臨床上要在<b>很多種</b>治療之間選擇，但很少有試驗直接兩兩比過。網路統合分析把所有治療連成一個<b>網路</b>，結合<b>直接</b>證據（真的比過的試驗）與<b>間接</b>證據（透過共同對照推得），一次估出每一對的對比、甚至排名。代價是多一個大假設，<b>可遞移性</b>，以及直接 vs 間接的<b>一致性</b>檢查。",
           en: "Clinicians must choose among <b>many</b> treatments, but few trials compare every pair head-to-head. Network meta-analysis connects all treatments into one <b>network</b>, combining <b>direct</b> evidence (trials that compared the two) with <b>indirect</b> evidence (via a common comparator), to estimate every pairwise contrast at once — even a ranking. The price is one big extra assumption — <b>transitivity</b> — plus a direct-vs-indirect <b>coherence</b> check." },
    scenario: { zh: "疫苗情境：有 A vs 安慰劑、B vs 安慰劑的試驗，但沒人直接做 A vs B。用安慰劑當共同對照間接估 A vs B，並在有直接試驗時合併成混合估計（見「網路統合分析」分頁）。",
                en: "Vaccine scenario: trials of A vs placebo and B vs placebo exist, but nobody ran A vs B directly. Use placebo as the common comparator to estimate A vs B indirectly, pooling with any direct trial into a mixed estimate (see the NMA page)." },
    watch: { zh: "✓ 本工具箱已實作。<b>關鍵</b>：可遞移性（各比較的網路彼此可比）與一致性（直接與間接相符），信任排名前務必檢查這兩者。",
             en: "✓ Implemented in this toolbox. <b>Key</b>: transitivity (the compared networks are comparable) and coherence (direct and indirect agree) — check both before trusting a ranking." } } },
};

// the whole tree as a static map — shown at a leaf, with the reached design lit
const FULLMAP = {
  title: { zh: "完整決策樹（流程圖；你剛走到的設計會被標亮）", en: "Full decision tree (flowchart; your endpoint is highlighted)" },
  start: { zh: "研究錨點？", en: "Study anchor?" },
  lanes: [
    {
      cls: "a",
      edge: { zh: "暴露錨定", en: "exposure-anchored" },
      head: { zh: "A · 暴露錨定", en: "A · Exposure-anchored" },
      sub: { zh: "先固定暴露／介入 → 看它造成的結果", en: "fix the exposure → study its effects" },
      steps: [
        { q: { zh: "結果是哪一種型態？", en: "What type of outcome?" },
          forks: [
            { edge: { zh: "一次性／致命／慢性 → 世代與時點設計", en: "one-off / fatal / chronic → cohort & timing designs" },
              leaves: [
                { key: "rIV", cond: { zh: "有外生、近似隨機的工具", en: "an external, near-random instrument" }, tag: "IV ✓", kind: "tb" },
                { key: "rRDD", cond: { zh: "分數上的明確門檻（年齡 65／指標）", en: "a sharp cutoff on a score" }, tag: "RDD ✓", kind: "tb" },
                { key: "rDiD", cond: { zh: "政策某時點開啟＋有對照組", en: "policy at a known time + control group" }, tag: "DiD ✓", kind: "tb" },
                { key: "rITS", cond: { zh: "政策某時點＋單一群體、前後多時點", en: "policy at a time + single population, many points" }, tag: "ITS ✓", kind: "tb" },
                { key: "rACC", cond: { zh: "有藥理相近的活性對照（打 A vs 打 B）", en: "a similar active comparator (A vs B)" }, tag: "ACNU ✓", kind: "tb" },
                { key: "rPNU", cond: { zh: "有活性對照，且想納入既有（盛行）使用者", en: "active comparator + want to include prevalent users" }, tag: "PNU ✓", kind: "tb" },
                { key: "rPERR", cond: { zh: "前後事件率＋混淆乘法穩定", en: "before/after rates + stable multiplicative confounding" }, tag: "PERR ✓", kind: "tb" },
                { key: "rNC", cond: { zh: "未測混淆＋有一對陰性對照（代理）", en: "unmeasured confounding + a pair of negative controls (proxies)" }, tag: "NC ✓", kind: "tb" },
                { key: "rCCW", cond: { zh: "診斷後動態／持續策略（早 vs 晚、密集用藥）", en: "sustained/dynamic strategy (early vs late, intensive)" }, tag: "CCW ✓", kind: "tb" },
                { key: "rSEQ", cond: { zh: "點治療，但多時點陸續收案", en: "point treatment, eligible at many times" }, tag: "Seq ✓", kind: "tb" },
                { key: "rPS", cond: { zh: "有豐富已測共變項，配對／加權平衡（PS）", en: "rich measured covariates; balance by matching/weighting (PS)" }, tag: "PS ✓", kind: "tb" },
                { key: "rTMLE", cond: { zh: "已測共變項，想雙重穩健＋ML／效率（TMLE）", en: "measured covariates; want double robustness + ML / efficiency (TMLE)" }, tag: "TMLE ✓", kind: "tb" },
                { key: "rGM", cond: { zh: "多時點治療＋時變混淆回饋（g-formula／IPTW-MSM）", en: "multi-time treatment + time-varying confounding feedback (g-formula / IPTW-MSM)" }, tag: "G-methods ✓", kind: "tb" },
                { key: "rWCE", cond: { zh: "逐月用藥史，想知道效果隨時間／累積怎麼變（權重函數）", en: "monthly dosing history; how the effect depends on timing/accumulation (weight function)" }, tag: "WCE ✓", kind: "tb" },
              ] },
            { edge: { zh: "急性、會反覆又會好、非致命 → 自身對照／趨勢", en: "acute, recurrent/resolving, non-fatal → self-control / trend" },
              leaves: [
                { key: "rSCCS", cond: { zh: "個人自身當對照＋暴露有明確時窗", en: "person as own control + clear exposure window" }, tag: "SCCS ✓", kind: "tb" },
                { key: "rTiT", cond: { zh: "暴露隨日曆趨勢、跨族群速度不同、結果罕見", en: "exposure has a calendar trend, rare outcome" }, tag: "TiT ✓", kind: "tb" },
                { key: "rPSSA", cond: { zh: "快速篩處方瀑布訊號（先 A 後 B 不對稱；aSR＝cSR÷SRnull）", en: "fast screen for a prescribing cascade (A-then-B asymmetry; aSR = cSR ÷ SRnull)" }, tag: "PSSA ✓", kind: "tb" },
                { key: "rTSCAN", cond: { zh: "一次掃整棵結果樹找安全訊號、控制多重比較（最大 LLR＋排列 p）", en: "scan a whole outcome tree for safety signals with multiplicity control (max LLR + permutation p)" }, tag: "TreeScan ✓", kind: "tb" },
              ] },
          ] },
      ],
    },
    {
      cls: "b",
      edge: { zh: "結果錨定", en: "outcome-anchored" },
      head: { zh: "B · 結果錨定", en: "B · Outcome-anchored" },
      sub: { zh: "先固定結果 → 回頭找暴露（多為急性、可復發）", en: "fix the outcome → find exposures (usually acute, recurrent)" },
      steps: [
        { q: { zh: "從個案回看，怎麼取對照？", en: "From cases, how to take controls?" },
          forks: [
            { edge: { zh: "來源族群對照 · 校正／配對", en: "source-population controls · adjust/match" },
              leaves: [{ key: "rCC", cond: { zh: "結果罕見、用勝算比＋校正/分層/配對處理混淆", en: "rare outcome; odds ratio + adjust/stratify/match for confounding" }, tag: "CC ✓", kind: "tb" }] },
            { edge: { zh: "配對、巢式抽樣", en: "matched, nested" },
              leaves: [{ key: "rNCC", cond: { zh: "想看「劑量–反應」，只量個案＋抽樣對照的暴露量（巢式對照＝病例對照）", en: "want a dose-response; measure exposure only for cases + sampled controls (nested = case-control)" }, tag: "CC ✓", kind: "tb" }] },
            { edge: { zh: "自身對照 · 暴露無趨勢", en: "own control · no trend" },
              leaves: [{ key: "rCCTC", cond: { zh: "CCO（案例交叉）", en: "CCO (case-crossover)" }, tag: "CCTC ✓", kind: "tb" }] },
            { edge: { zh: "自身對照 · 暴露有趨勢", en: "own control · has a trend" },
              leaves: [{ key: "rCCTC", cond: { zh: "扣掉日曆趨勢（CCTC；世代版＝TiT ✓）", en: "net out the trend (CCTC; cohort = TiT ✓)" }, tag: "CCTC ✓", kind: "tb" }] },
            { edge: { zh: "疫苗效力 · 陰性對照", en: "vaccine effectiveness · test-negative controls" },
              leaves: [{ key: "rTND", cond: { zh: "估 VE，對照取「來檢驗卻陰性」者，去掉就醫傾向（VE＝1−OR）", en: "estimate VE with tested-but-negative controls, removing care-seeking (VE = 1 − OR)" }, tag: "TND ✓", kind: "tb" }] },
          ] },
      ],
    },
    {
      cls: "c",
      edge: { zh: "機制錨定", en: "mechanism-anchored" },
      head: { zh: "C · 機制錨定", en: "C · Mechanism-anchored" },
      sub: { zh: "已知有效果 → 問「怎麼有效」（效果的分解，接在任一設計之後）", en: "an effect is known → ask 'how' (a decomposition, follows any design)" },
      steps: [
        { q: { zh: "想拆出效果的機制？", en: "Want to decompose the mechanism?" },
          forks: [
            { edge: { zh: "多少透過某中介？", en: "how much via a mediator?" },
              leaves: [{ key: "rMED", cond: { zh: "把總效果拆成直接 NDE ＋ 間接 NIE（透過中介）、報被中介比例", en: "split the total into direct NDE + indirect NIE (via a mediator), report proportion mediated" }, tag: "MED ✓", kind: "tb" }] },
          ] },
      ],
    },
    {
      cls: "d",
      edge: { zh: "證據錨定", en: "evidence-anchored" },
      head: { zh: "D · 證據錨定（跨研究合併）", en: "D · Evidence-anchored (cross-study synthesis)" },
      sub: { zh: "不是單一研究 → 把已有的多篇研究合成一個答案（比單一研究高一層）", en: "not a single study → synthesise several existing studies (one level above a single study)" },
      steps: [
        { q: { zh: "一次比較幾個治療？", en: "How many treatments at once?" },
          forks: [
            { edge: { zh: "兩個正面對決（或介入 vs 對照）", en: "two, head-to-head (or vs control)" },
              leaves: [{ key: "rSRMA", cond: { zh: "系統性回顧找出所有研究，再合併（固定／隨機效果、I²、GRADE）", en: "systematically find all studies, then pool (fixed/random effects, I², GRADE)" }, tag: "SR-MA ✓", kind: "tb", method: "srma" }] },
            { edge: { zh: "三個以上、少有直接對決", en: "three or more, few head-to-head" },
              leaves: [{ key: "rNMA", cond: { zh: "用直接＋間接證據連成網路（可遞移性＋一致性）", en: "connect direct + indirect evidence into a network (transitivity + coherence)" }, tag: "NMA ✓", kind: "tb", method: "nma" }] },
          ] },
      ],
    },
  ],
  rct: {
    q: { zh: "最後一步（沒辦法的辦法）：上面都不符合，你其實已有一場（別族群的）RCT 可以借嗎？", en: "Last step (last resort): nothing above fits — do you actually have an RCT (in another population) to borrow?" },
    forks: [
      { edge: { zh: "有，但只有彙總結果", en: "yes, summary results only" },
        leaves: [{ key: "rEXTCTRL", cond: { zh: "把那場 RCT／外部資料當對照組", en: "borrow the RCT / external data as a control arm" }, tag: "外部對照 ✓", kind: "tb", method: "extctrl" }] },
      { edge: { zh: "有，且有個體資料", en: "yes, with individual data" },
        leaves: [{ key: "rTRANS", cond: { zh: "用效果修飾因子把結果轉到你的族群", en: "reweight by effect modifiers to your population" }, tag: "可轉移性 ✓", kind: "tb", method: "transport" }] },
    ],
  },
};
let dtreeStack = [{ id: "n1", ans: null }];

function initDtree() {
  if (!document.getElementById("dtreeStage")) return;
  const back = document.getElementById("dtreeBack");
  const restart = document.getElementById("dtreeRestart");
  const fullmap = document.getElementById("dtreeFullmap");
  if (back && !back.dataset.wired) {
    back.dataset.wired = "1";
    back.addEventListener("click", () => { if (dtreeStack.length > 1) { dtreeStack.pop(); renderDtree(); } });
    restart.addEventListener("click", () => { dtreeStack = [{ id: "n1", ans: null }]; renderDtree(); });
    if (fullmap) fullmap.addEventListener("click", () => {
      const box = document.getElementById("dtreeMap");
      if (box && !box.hidden) { box.hidden = true; return; }   // toggle off if already showing
      renderFullMap(null);                                     // whole tree, no endpoint highlighted
    });
  }
  renderDtree();
}

function renderDtree() {
  const stage = document.getElementById("dtreeStage");
  const pathEl = document.getElementById("dtreePath");
  if (!stage) return;
  const mapBox = document.getElementById("dtreeMap");
  if (mapBox) mapBox.hidden = true;                       // collapse the full map on any move
  const cur = dtreeStack[dtreeStack.length - 1];
  const node = DNODES[cur.id];

  // breadcrumb: the picks made so far
  pathEl.innerHTML =
    `<span class="dtree-crumb start">${tr("開始", "Start")}</span>` +
    dtreeStack.slice(1).map((s) => `<span class="dtree-crumb">${L(s.ans)}</span>`).join("");

  if (node.rec) {
    const r = node.rec;
    const goto = r.kind === "toolbox"
      ? `<button class="dtree-goto" data-go="${r.method}">${tr("前往「" + r.badge.replace(" ✓", "") + "」的教學 →", "Go to " + r.badge.replace(" ✓", "") + " →")}</button>`
      : (r.altMethod ? `<button class="dtree-goto" data-go="${r.altMethod}">${L(r.altLabel)}</button>` : "");
    const scenario = r.scenario
      ? `<div class="rec-scenario">${L(r.scenario)}</div>` : "";
    stage.innerHTML =
      `<div class="dtree-rec ${r.kind}">` +
      `<span class="rec-tag">${tr("最終建議", "Recommendation")}</span>` +
      `<h3>${L(r.title)}</h3>` +
      `<p>${L(r.why)}</p>` +
      scenario +
      `<div class="rec-watch">${tr("⚠ 要盯住的關鍵假設：", "⚠ Key assumption to watch: ")}${L(r.watch)}</div>` +
      `<div class="rec-actions">` + goto +
      `<button class="dtree-showmap" data-mapkey="${cur.id}">${tr("🌳 看完整決策樹（標出你的位置）", "🌳 Show the full tree (your spot marked)")}</button>` +
      `</div></div>`;
    const gb = stage.querySelector(".dtree-goto");
    if (gb) gb.addEventListener("click", () => gotoMethod(gb.dataset.go, "learn"));
    const mb = stage.querySelector(".dtree-showmap");
    if (mb) mb.addEventListener("click", () => renderFullMap(mb.dataset.mapkey));
  } else {
    stage.innerHTML =
      `<div class="dtree-step">${L(node.step)}</div>` +
      `<div class="dtree-q">${L(node.q)}</div>` +
      `<div class="dtree-opts">` +
      node.opts.map((o, i) =>
        `<button class="dtree-opt" data-i="${i}">${L(o.l)}<span class="arrow">→</span></button>`
      ).join("") +
      `</div>`;
    stage.querySelectorAll(".dtree-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        const o = node.opts[Number(btn.dataset.i)];
        dtreeStack.push({ id: o.to, ans: o.l });
        renderDtree();
      });
    });
  }
  const back = document.getElementById("dtreeBack");
  if (back) back.disabled = dtreeStack.length <= 1;
}

// the whole tree as a top-down FLOWCHART (start → two anchor lanes → decision
// boxes → branch-labelled connectors → colour-coded terminal boxes), with the
// reached design lit up (hitKey).
function renderFullMap(hitKey) {
  const box = document.getElementById("dtreeMap");
  if (!box) return;
  const link = (label) => `<div class="fc-link">${label ? `<span class="fc-elabel">${label}</span>` : ""}</div>`;
  const leafBox = (lf) => {
    const cond = lf.cond ? `<span class="fc-cond">${L(lf.cond)}</span>` : "";
    return `<div class="fc-leaf ${lf.kind}${lf.key === hitKey ? " fc-hit" : ""}">${cond}` +
           `<span class="fc-badge ${lf.kind}">${lf.tag}</span></div>`;
  };
  const outGroup = (o) =>
    link(L(o.edge)) + (o.leaves.length > 1 ? `<div class="fc-leaves">${o.leaves.map(leafBox).join("")}</div>` : leafBox(o.leaves[0]));
  const laneHtml = (lane) =>
    `<div class="fc-lane">` +
    link(L(lane.edge)) +
    `<div class="fc-head ${lane.cls}">${L(lane.head)}<small>${L(lane.sub)}</small></div>` +
    lane.steps.map((s) => {
      let h = link("") + `<div class="fc-q">${L(s.q)}</div>`;
      if (s.yes) h += outGroup(s.yes);
      if (s.forks) h += s.forks.map(outGroup).join("");
      return h;
    }).join("") +
    `</div>`;
  const rct = FULLMAP.rct;
  const rctHtml =
    `<div class="fc-q">${L(rct.q)}</div>` +
    rct.forks.map(outGroup).join("");
  box.innerHTML =
    `<div class="fc-toolbar"><button type="button" class="btn fc-dl">⬇ ${tr("下載完整流程圖", "Download full flowchart")}</button></div>` +
    `<h3 class="fc-title">${L(FULLMAP.title)}</h3>` +
    `<div class="fc">` +
    `<div class="fc-start">${L(FULLMAP.start)}</div>` +
    `<div class="fc-lanes">${FULLMAP.lanes.map(laneHtml).join("")}</div>` +
    link("") +
    `<div class="fc-rct">${rctHtml}</div>` +
    `</div>`;
  box.hidden = false;
  const dl = box.querySelector(".fc-dl");
  if (dl) dl.addEventListener("click", downloadFlowchart);
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}

function _saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

// Build the flowchart's stylesheet + markup once, shared by the PNG and the
// standalone-HTML fallback.
async function _flowchartExport() {
  const box = document.getElementById("dtreeMap");
  let css = "";
  try { css = await (await fetch("styles.css")).text(); } catch (e) { /* offline */ }
  const clone = box.cloneNode(true);
  clone.hidden = false;
  const bar = clone.querySelector(".fc-toolbar");
  if (bar) bar.remove();                                  // don't ship the download button
  return { box, css, clone };
}

function _xmlEsc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;");
}
const _TRANSPARENT = /^rgba?\(0,\s*0,\s*0,\s*0\)$|transparent/;

// Paint the rendered flowchart into a NATIVE svg (rect / line / text — no
// <foreignObject>, so the canvas is not tainted and PNG export works). We walk
// the live DOM: box backgrounds + borders from each element, text word-by-word
// via Range rects (so wrapping/alignment match exactly), and the connector
// lines that CSS draws with pseudo-elements are synthesised from geometry.
function _flowchartToSVG(box) {
  const base = box.getBoundingClientRect();
  const ox = base.left, oy = base.top;
  const P = [];
  let mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
  const grow = (x1, y1, x2, y2) => {                   // track true content bounds
    if (x1 < mnx) mnx = x1; if (y1 < mny) mny = y1;
    if (x2 > mxx) mxx = x2; if (y2 > mxy) mxy = y2;
  };

  box.querySelectorAll("*").forEach((el) => {
    if (el.closest(".fc-toolbar")) return;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const x = r.left - ox, y = r.top - oy;
    const rx = parseFloat(cs.borderTopLeftRadius) || 0;
    if (!_TRANSPARENT.test(cs.backgroundColor)) {
      P.push(`<rect x="${x}" y="${y}" width="${r.width}" height="${r.height}" rx="${rx}" fill="${cs.backgroundColor}"/>`);
      grow(x, y, x + r.width, y + r.height);
    }
    const bw = parseFloat(cs.borderTopWidth) || 0;
    if (bw > 0 && cs.borderTopStyle !== "none" && !_TRANSPARENT.test(cs.borderTopColor)) {
      P.push(`<rect x="${x + bw / 2}" y="${y + bw / 2}" width="${r.width - bw}" height="${r.height - bw}" rx="${Math.max(0, rx - bw / 2)}" fill="none" stroke="${cs.borderTopColor}" stroke-width="${bw}"/>`);
      grow(x, y, x + r.width, y + r.height);
    }
    const blw = parseFloat(cs.borderLeftWidth) || 0;   // left accent stripe (fc-leaf)
    if (blw > 1 && cs.borderLeftColor !== cs.borderTopColor && !_TRANSPARENT.test(cs.borderLeftColor))
      P.push(`<rect x="${x}" y="${y}" width="${blw}" height="${r.height}" rx="${rx}" fill="${cs.borderLeftColor}"/>`);
  });

  // the vertical + horizontal branch connectors CSS draws via ::before
  box.querySelectorAll(".fc-leaves").forEach((g) => {
    const gr = g.getBoundingClientRect();
    const lx = gr.left - ox + 8;
    P.push(`<line x1="${lx}" y1="${gr.top - oy - 10}" x2="${lx}" y2="${gr.bottom - oy - 18}" stroke="#94a3b8" stroke-width="2"/>`);
    g.querySelectorAll(":scope > .fc-leaf").forEach((lf) => {
      const lr = lf.getBoundingClientRect(), cy = (lr.top + lr.bottom) / 2 - oy;
      P.push(`<line x1="${lx}" y1="${cy}" x2="${lr.left - ox}" y2="${cy}" stroke="#94a3b8" stroke-width="2"/>`);
    });
  });

  const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.nodeValue.trim()) continue;
    const parent = node.parentElement;
    if (!parent || parent.closest(".fc-toolbar")) continue;
    const cs = getComputedStyle(parent);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const fs = parseFloat(cs.fontSize);
    const fam = cs.fontFamily.replace(/"/g, "'");
    // Group characters into visual LINES (walk char-by-char; a jump in top =
    // a new line). Whitespace-splitting breaks on CJK, which has no spaces, so
    // a wrapped Chinese label would render as one overflowing line.
    const val = node.nodeValue;
    let run = "", rLeft = 0, rTop = null, rH = fs, rRight = 0;
    const flush = () => {
      if (run.trim()) {
        const ty = rTop - oy + (rH + fs) / 2 - fs * 0.2;         // approx baseline
        P.push(`<text x="${rLeft - ox}" y="${ty}" font-family="${_xmlEsc(fam)}" font-size="${fs}" font-weight="${cs.fontWeight}" font-style="${cs.fontStyle}" fill="${cs.color}">${_xmlEsc(run)}</text>`);
        grow(rLeft - ox, rTop - oy, rRight - ox, rTop - oy + rH);
      }
      run = "";
    };
    for (let i = 0; i < val.length; i++) {
      const rg = document.createRange();
      rg.setStart(node, i); rg.setEnd(node, i + 1);
      const rr = rg.getBoundingClientRect();
      if (!rr.width && !rr.height) continue;
      if (rTop === null || Math.abs(rr.top - rTop) > 1.5) { flush(); rLeft = rr.left; rTop = rr.top; rH = rr.height; }
      run += val[i]; rRight = rr.right;
    }
    flush();
  }
  const PAD = 14;
  if (!isFinite(mnx)) { mnx = 0; mny = 0; mxx = box.scrollWidth; mxy = box.scrollHeight; }
  const W = Math.ceil(mxx - mnx) + PAD * 2;
  const H = Math.ceil(mxy - mny) + PAD * 2;
  // shift so the leftmost/topmost content sits at PAD (content may start at a
  // negative offset when the horizontally-scrolling lanes are centred).
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff"/>` +
    `<g transform="translate(${(PAD - mnx).toFixed(2)},${(PAD - mny).toFixed(2)})">${P.join("")}</g></svg>`;
  return { svg, W, H };
}

// Download the full decision flowchart as a PNG. Falls back to a self-contained
// HTML file if anything in the rasterisation path fails.
async function downloadFlowchart() {
  const box = document.getElementById("dtreeMap");
  if (!box) return;
  const bar = box.querySelector(".fc-toolbar");
  if (bar) bar.style.visibility = "hidden";               // keep it out of the capture
  try {
    const { svg, W, H } = _flowchartToSVG(box);
    const scale = 2;
    const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error("svg load")); img.src = svgUrl; });
    const canvas = document.createElement("canvas");
    canvas.width = W * scale; canvas.height = H * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(svgUrl);
    const blob = await new Promise((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png"));
    _saveBlob(blob, "causal-inference-flowchart.png");
  } catch (e) {
    const { css, clone } = await _flowchartExport();
    downloadFlowchartHTML(css, clone);
  } finally {
    if (bar) bar.style.visibility = "";
  }
}

// Fallback: self-contained HTML (opens standalone, print/save to PDF).
function downloadFlowchartHTML(css, clone) {
  clone.hidden = false;
  const bar = clone.querySelector(".fc-toolbar");
  if (bar) bar.remove();
  const title = tr("因果推論方法選擇：完整流程圖", "Causal inference method selection — full flowchart");
  const html =
    `<!doctype html><html lang="${lang()}"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<title>${title}</title><style>\n${css}\n` +
    `body{background:#fff;margin:0;padding:24px;}#dtreeMap{display:block!important;}</style></head>` +
    `<body>${clone.outerHTML}</body></html>`;
  _saveBlob(new Blob([html], { type: "text/html;charset=utf-8" }), "causal-inference-flowchart.html");
}
// All 15 methods, one vaccine question, grouped by DESIGN FAMILY (mediation shown as the
// 'mechanism' family: its naive direct effect is biased, the proper NDE recovers truth).
// Each method's truth
// is on a different scale (effect difference, odds ratio, rate ratio, level change…),
// so we plot every estimate ÷ its OWN truth: 1.0 = perfectly recovered. Amber = the
// naive comparison (biased, off 1.0); teal = the method's corrected estimate (back near
// 1.0). Representative values from this tool's verified demos.
// ======================================================================
// Four added methods' ② interactive demos (Plotly, deterministic synthetic data).
// ======================================================================
function initMr() {
  const card = document.getElementById("mrCard"); if (!card) return;
  if (!card._wired) { card._wired = true; card.querySelector(".mr-scn").addEventListener("change", refreshMr); }
  refreshMr();
}
function refreshMr() {
  const card = document.getElementById("mrCard"); if (!card) return;
  const pleio = card.querySelector(".mr-scn").value === "pleio";
  const bx = [0.10, 0.14, 0.18, 0.22, 0.26, 0.30, 0.34, 0.40];
  const jit = [0.004, -0.006, 0.008, -0.003, 0.006, -0.007, 0.003, -0.004];
  const TRUTH = 0.5, lift = pleio ? [0, 0, 0.07, 0, 0.10, 0.02, 0.12, 0.03] : bx.map(() => 0);
  const by = bx.map((x, i) => TRUTH * x + jit[i] + lift[i]);
  // IVW = weighted regression through origin (equal weights); Egger = OLS with intercept
  let sxy = 0, sxx = 0; bx.forEach((x, i) => { sxy += x * by[i]; sxx += x * x; });
  const ivw = sxy / sxx;
  const n = bx.length, mx = bx.reduce((a, b) => a + b, 0) / n, my = by.reduce((a, b) => a + b, 0) / n;
  let sb = 0, sd = 0; bx.forEach((x, i) => { sb += (x - mx) * (by[i] - my); sd += (x - mx) ** 2; });
  const eggb = sb / sd, egga = my - eggb * mx;
  const xmax = 0.44;
  Plotly.react("mrChart", [
    { x: bx, y: by, mode: "markers", type: "scatter", name: tr("遺傳變異", "variants"), marker: { color: INK, size: 9 } },
    { x: [0, xmax], y: [0, ivw * xmax], mode: "lines", name: "IVW", line: { color: RED, width: 2.5 } },
    { x: [0, xmax], y: [egga, egga + eggb * xmax], mode: "lines", name: "MR-Egger", line: { color: AMBER, width: 2, dash: "dot" } },
    { x: [0, xmax], y: [0, TRUTH * xmax], mode: "lines", name: tr("真值斜率 0.50", "truth 0.50"), line: { color: GREEN, width: 1.5, dash: "dash" } },
  ], sceneLayout({
    height: 320, showlegend: true, legend: { orientation: "h", y: 1.12 }, margin: { t: 24, r: 14, b: 44, l: 50 },
    xaxis: { title: tr("變異 → 暴露（β_X）", "variant → exposure (β_X)"), range: [0, xmax], zeroline: true },
    yaxis: { title: tr("變異 → 結果（β_Y）", "variant → outcome (β_Y)"), zeroline: true },
  }), SCENE_CFG);
  card.querySelector(".mr-out").innerHTML = pleio
    ? tr(`IVW 斜率＝<b style="color:#b91c1c">${ivw.toFixed(2)}</b>（被多效性灌大、偏離真值 0.50）；MR-Egger 截距＝<b>${egga.toFixed(2)}</b>（不為 0 → 偵測到多效性），其斜率＝<b style="color:#1d6f57">${eggb.toFixed(2)}</b> 較接近真值。`,
        `IVW slope = <b style="color:#b91c1c">${ivw.toFixed(2)}</b> (inflated by pleiotropy, off the truth 0.50); MR-Egger intercept = <b>${egga.toFixed(2)}</b> (≠ 0 → pleiotropy detected), its slope = <b style="color:#1d6f57">${eggb.toFixed(2)}</b> is closer to the truth.`)
    : tr(`IVW 斜率＝<b style="color:#1d6f57">${ivw.toFixed(2)}</b>（貼近真值 0.50）；MR-Egger 截距＝<b>${egga.toFixed(2)}</b>（≈ 0 → 無多效性跡象）。`,
        `IVW slope = <b style="color:#1d6f57">${ivw.toFixed(2)}</b> (on the truth 0.50); MR-Egger intercept = <b>${egga.toFixed(2)}</b> (≈ 0 → no sign of pleiotropy).`);
}

function initWetlab() {
  const card = document.getElementById("wetlabCard"); if (!card) return;
  if (!card._wired) { card._wired = true; card.querySelector(".wl-conf").addEventListener("input", refreshWetlab); }
  refreshWetlab();
}
function refreshWetlab() {
  const card = document.getElementById("wetlabCard"); if (!card) return;
  const conf = parseFloat(card.querySelector(".wl-conf").value); card.querySelector(".wl-confv").textContent = conf.toFixed(1);
  const dose = [0, 1, 2, 3, 4, 5, 6, 7, 8], TRUTH = 0.40;
  const truth = dose.map((d) => TRUTH * d);
  const obs = dose.map((d) => TRUTH * d + conf * 0.22 * d);     // confounding inflates the observational slope
  Plotly.react("wetlabChart", [
    { x: dose, y: truth, mode: "lines+markers", name: tr("隨機實驗（真值）", "randomized experiment (truth)"), line: { color: GREEN, width: 2.5 }, marker: { color: GREEN, size: 7 } },
    { x: dose, y: obs, mode: "lines+markers", name: tr("觀察性關聯", "observational"), line: { color: AMBER, width: 2.5 }, marker: { color: AMBER, size: 7 } },
  ], sceneLayout({
    height: 320, showlegend: true, legend: { orientation: "h", y: 1.12 }, margin: { t: 24, r: 14, b: 44, l: 50 },
    xaxis: { title: tr("劑量", "dose") }, yaxis: { title: tr("結果", "outcome") },
  }), SCENE_CFG);
  const obsSlope = TRUTH + conf * 0.22;
  card.querySelector(".wl-out").innerHTML = tr(
    `實驗斜率＝<b style="color:#1d6f57">${TRUTH.toFixed(2)}</b>（永遠是真值）；觀察斜率＝<b style="color:${conf > 0.05 ? "#b91c1c" : "#1d6f57"}">${obsSlope.toFixed(2)}</b>。混淆越強，只有觀察曲線越偏。`,
    `Experiment slope = <b style="color:#1d6f57">${TRUTH.toFixed(2)}</b> (always the truth); observational slope = <b style="color:${conf > 0.05 ? "#b91c1c" : "#1d6f57"}">${obsSlope.toFixed(2)}</b>. The stronger the confounding, the more only the observational curve drifts.`);
}

function initDt() {
  const card = document.getElementById("dtCard"); if (!card) return;
  if (!card._wired) { card._wired = true; card.querySelector(".dt-bias").addEventListener("input", refreshDt); }
  refreshDt();
}
function refreshDt() {
  const card = document.getElementById("dtCard"); if (!card) return;
  const bias = parseFloat(card.querySelector(".dt-bias").value); card.querySelector(".dt-biasv").textContent = bias.toFixed(1);
  const t = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const obs = t.map((x) => 10 - 0.50 * x);                 // observed treated trajectory
  const ctrlTrue = t.map((x) => 10 - 0.20 * x);            // true (unseen) control trajectory
  const twin = t.map((x) => 10 - 0.20 * x + bias * 0.08 * x); // model-predicted twin (biased by slider)
  const estEff = obs[10] - twin[10], trueEff = obs[10] - ctrlTrue[10];
  Plotly.react("dtChart", [
    { x: t, y: obs, mode: "lines", name: tr("實際（治療）", "observed (treated)"), line: { color: TEAL, width: 2.5 } },
    { x: t, y: twin, mode: "lines", name: tr("數位孿生（對照）", "digital twin (control)"), line: { color: SLATE, width: 2, dash: "dash" } },
    { x: t, y: ctrlTrue, mode: "lines", name: tr("真實對照（看不到）", "true control (unseen)"), line: { color: "#cbd5e1", width: 1.5, dash: "dot" } },
  ], sceneLayout({
    height: 320, showlegend: true, legend: { orientation: "h", y: 1.12 }, margin: { t: 24, r: 14, b: 44, l: 50 },
    xaxis: { title: tr("時間", "time") }, yaxis: { title: tr("結果", "outcome") },
  }), SCENE_CFG);
  const off = Math.abs(estEff - trueEff);
  card.querySelector(".dt-out").innerHTML = tr(
    `估計效果（實際 − 孿生）＝<b style="color:${off > 0.3 ? "#b91c1c" : "#1d6f57"}">${estEff.toFixed(2)}</b>；真值＝<b>${trueEff.toFixed(2)}</b>。孿生模型偏誤越大，估計越偏離真值（治療其實沒變）。`,
    `Estimated effect (observed − twin) = <b style="color:${off > 0.3 ? "#b91c1c" : "#1d6f57"}">${estEff.toFixed(2)}</b>; truth = <b>${trueEff.toFixed(2)}</b>. The more biased the twin model, the further the estimate drifts — though the treatment never changed.`);
}

function initBabe() {
  const card = document.getElementById("babeCard"); if (!card) return;
  if (!card._wired) { card._wired = true; card.querySelector(".bb-gmr").addEventListener("input", refreshBabe); }
  refreshBabe();
}
function refreshBabe() {
  const card = document.getElementById("babeCard"); if (!card) return;
  const gmr = parseFloat(card.querySelector(".bb-gmr").value); card.querySelector(".bb-gmrv").textContent = gmr.toFixed(2);
  const se = 0.075, f = Math.exp(1.645 * se);              // 90% CI multiplier (CV≈0.25, n≈24)
  const lo = gmr / f, hi = gmr * f, pass = lo >= 0.80 && hi <= 1.25;
  Plotly.react("babeChart", [
    { x: ["GMR"], y: [gmr], type: "scatter", mode: "markers", marker: { color: pass ? GREEN : RED, size: 14 },
      error_y: { type: "data", symmetric: false, array: [hi - gmr], arrayminus: [gmr - lo], color: pass ? GREEN : RED, thickness: 2.5, width: 14 },
      hovertemplate: `GMR ${gmr.toFixed(2)} [${lo.toFixed(2)}, ${hi.toFixed(2)}]<extra></extra>` },
  ], sceneLayout({
    height: 320, showlegend: false, margin: { t: 18, r: 14, b: 30, l: 50 },
    xaxis: { showticklabels: true }, yaxis: { title: tr("測試／參考 比值", "test/reference ratio"), range: [0.6, 1.5] },
    shapes: [
      { type: "rect", xref: "paper", x0: 0, x1: 1, y0: 0.80, y1: 1.25, fillcolor: "rgba(16,185,129,.10)", line: { width: 0 }, layer: "below" },
      { type: "line", xref: "paper", x0: 0, x1: 1, y0: 0.80, y1: 0.80, line: { color: GREEN, width: 1, dash: "dash" } },
      { type: "line", xref: "paper", x0: 0, x1: 1, y0: 1.25, y1: 1.25, line: { color: GREEN, width: 1, dash: "dash" } },
      { type: "line", xref: "paper", x0: 0, x1: 1, y0: 1.0, y1: 1.0, line: { color: "#94a3b8", width: 1, dash: "dot" } },
    ],
  }), SCENE_CFG);
  card.querySelector(".bb-out").innerHTML = tr(
    `GMR ${gmr.toFixed(2)}，90% CI [${lo.toFixed(2)}, ${hi.toFixed(2)}] → ` + (pass
      ? `<b style="color:#1d6f57">通過（整段 CI 在 0.80–1.25 內）</b>` : `<b style="color:#b91c1c">未通過（CI 超出 0.80–1.25）</b>`),
    `GMR ${gmr.toFixed(2)}, 90% CI [${lo.toFixed(2)}, ${hi.toFixed(2)}] → ` + (pass
      ? `<b style="color:#1d6f57">PASS (whole CI within 0.80–1.25)</b>` : `<b style="color:#b91c1c">FAIL (CI exits 0.80–1.25)</b>`));
}

const CHOOSE_FAMILIES = [
  { zh: "借外生變異（含遺傳工具 MR）", en: "borrowed exogenous variation (incl. genetic-IV / MR)", members: [
      ["IV", 1.83, 1.00], ["RDD", 1.83, 1.00], ["MR", 1.62, 1.00]] },
  { zh: "借時間", en: "borrowed timing / trends", members: [
      ["DiD", 0.52, 1.00], ["ITS", 1.45, 1.00], ["PERR", 1.47, 1.06], ["TiT", 1.57, 1.08]] },
  { zh: "自我對照", en: "self-controlled", members: [
      ["CCTC", 2.04, 1.06], ["SCCS", 0.52, 0.99]] },
  { zh: "目標試驗模擬", en: "target-trial emulation", members: [
      ["CCW", 1.75, 1.00], ["Seq", 2.95, 0.95]] },
  { zh: "主動對照新使用者", en: "active-comparator new-user", members: [
      ["ACNU", 2.53, 0.99], ["PNU", 0.69, 1.03]] },
  { zh: "抽樣設計／疫苗效力", en: "sampling design / vaccine effectiveness", members: [["CC", 1.66, 1.00], ["TND", 0.50, 0.98]] },
  { zh: "代理／陰性對照", en: "proxies / negative controls", members: [["NC/PCI", 2.12, 0.94]] },
  { zh: "機制／中介", en: "mechanism / mediation", members: [["MED", 1.15, 0.94]] },
  { zh: "校正／傾向分數／雙重穩健", en: "adjustment / PS / doubly-robust", members: [["PS", 1.52, 1.01], ["TMLE", 1.46, 1.02]] },
  { zh: "時變治療／g-methods", en: "time-varying treatment / g-methods", members: [["GM", 0.58, 0.97], ["WCE", 0.58, 1.01]] },
  { zh: "訊號偵測（產生假說）", en: "signal detection (hypothesis-generating)", members: [["PSSA", 2.37, 1.00], ["TreeScan", 3.00, 1.00]] },
  { zh: "可轉移性・外部對照", en: "transport / external control", members: [["Transportability", 0.39, 0.91], ["External control", 1.52, 1.02]] },
  { zh: "數位孿生", en: "digital twin", members: [["Digital twin", 1.55, 1.00]] },
];
function drawChooseChart() {
  if (!document.getElementById("chooseChart")) return;
  const M = CHOOSE_FAMILIES.flatMap((f) => f.members);
  const x = M.map((r) => r[0]);
  const naive = { x, y: M.map((r) => r[1]), type: "bar", name: tr("未校正比較（被混淆帶偏）", "naive (confounded)"),
    marker: { color: AMBER }, text: M.map((r) => r[1].toFixed(2)), textposition: "outside", cliponaxis: false };
  const corr = { x, y: M.map((r) => r[2]), type: "bar", name: tr("該方法校正後", "method (corrected)"),
    marker: { color: TEAL }, text: M.map((r) => r[2].toFixed(2)), textposition: "outside", cliponaxis: false };
  // alternating family bands + family labels
  const TOP = 4.0;  // headroom above the tallest bar (~3.0) for the two-row family labels
  const shapes = [{ type: "line", x0: -0.5, x1: x.length - 0.5, y0: 1, y1: 1, line: { color: GREEN, width: 2, dash: "dash" } }];
  const anns = [{ xref: "paper", x: 1.005, xanchor: "left", y: 1, yref: "y", text: tr("真值＝1.0", "truth = 1.0"), showarrow: false, font: { size: 11, color: GREEN } }];
  let i = 0;
  CHOOSE_FAMILIES.forEach((f, fi) => {
    const x0 = i - 0.5, x1 = i + f.members.length - 0.5;
    if (fi % 2 === 1) shapes.push({ type: "rect", x0, x1, y0: 0, y1: TOP, yref: "y", fillcolor: "rgba(20,40,60,.045)", line: { width: 0 }, layer: "below" });
    // stagger labels into two rows so adjacent (long) family names don't overlap
    anns.push({ x: (x0 + x1) / 2, y: fi % 2 === 0 ? TOP - 0.12 : TOP - 0.42, yref: "y", text: tr(f.zh, f.en), showarrow: false, font: { size: 9, color: SLATE }, xanchor: "center" });
    i += f.members.length;
  });
  Plotly.react("chooseChart", [naive, corr], sceneLayout({
    height: 360, barmode: "group", showlegend: true, legend: { orientation: "h", y: 1.08 },
    margin: { t: 30, r: 74, b: 40, l: 56 },
    xaxis: { tickfont: { size: 10 } },
    yaxis: { title: tr("估計 ÷ 各自真值（1.0＝命中）", "estimate ÷ own truth (1.0 = on target)"), range: [0, TOP] },
    shapes, annotations: anns,
  }), SCENE_CFG);
}

// ======================================================================
// Citation — JAMA text + BibTeX + downloadable RIS
// ======================================================================
const CITE = {
  authors: "Methodology Working Group, Population Health Data Center, National Cheng Kung University; Tsai DH-T, Lai EC-C.",
  publisher: "Population Health Data Center, National Cheng Kung University",
  titleZh: "真實世界證據與準實驗工具箱線上教學工具",
  titleEn: "RWE and Quasi-experimental Toolbox — Online Teaching Tool",
  year: "2026",
  url: "https://danielhttsai.github.io/phdc-rwe-tool/",
};
// per-method label + the primary methodological source(s) for that page, so both the
// reference list and the citation can be scoped to the page you are actually on.
const METHOD_REF = {
  iv:   { zh: "工具變數 IV", en: "Instrumental Variables (IV)", src: "Homayra et al. (2024), Epidemiology" },
  rdd:  { zh: "斷點回歸 RDD", en: "Regression Discontinuity (RDD)", src: "Cattaneo, Keele & Titiunik (2023); Schuessler et al. (2026)" },
  did:  { zh: "差異中的差異 DiD", en: "Difference-in-Differences (DiD)", src: "Rothbard et al. (2024); Chang (2020)" },
  tit:  { zh: "趨勢中的趨勢 TiT", en: "Trend-in-Trend (TiT)", src: "Ji, Small, Leonard & Hennessy (2017), Epidemiology" },
  its:  { zh: "中斷時間序列 ITS", en: "Interrupted Time Series (ITS)", src: "Bernal, Cummins & Gasparrini (2017), IJE; Dey et al. (2025)" },
  perr: { zh: "事前事件率比 PERR", en: "Prior Event Rate Ratio (PERR)", src: "Yu et al. (2012); van Aalst et al. (2021)" },
  ccw:  { zh: "複製-設限-加權 CCW", en: "Clone-Censor-Weight (CCW)", src: "Hernán (2018), BMJ; Gaber et al. (2024)" },
  cctc: { zh: "案例交叉與時間對照 CCTC", en: "Case-crossover & (case-)time-control (CCTC)", src: "Maclure (1991); Suissa (1995); Jeong et al. (2023)" },
  seq:  { zh: "序列試驗", en: "Sequential trials", src: "Hernán & Robins (target trial); Danaei et al.; Gran et al." },
  cc:   { zh: "病例對照", en: "Case-control", src: "Dickerman et al. (2020), IJE; Shomal Zadeh et al. (2020); Schauberger et al. (2024)" },
  sccs: { zh: "自身對照病例系列 SCCS", en: "Self-controlled case series (SCCS)", src: "Whitaker, Farrington & Musonda (2006); Petersen, Douglas & Whitaker (2016); sccs-studies.info" },
  acnu: { zh: "主動對照新使用者 ACNU", en: "Active-Comparator, New-User (ACNU)", src: "Lund, Richardson & Stürmer (2015); Ray (2003); Yoshida, Solomon & Kim (2015)" },
  pnu:  { zh: "盛行新使用者 PNU", en: "Prevalent New-User (PNU)", src: "Suissa, Moodie & Dell'Aniello (2017), Pharmacoepidemiol Drug Saf" },
  nc:   { zh: "陰性對照與近端因果 NC/PCI", en: "Negative Control & Proximal Causal Inference (NC/PCI)", src: "Lipsitch, Tchetgen Tchetgen & Cohen (2010); Miao, Geng & Tchetgen Tchetgen (2018); Schuemie et al. (2014/2018)" },
  med:  { zh: "中介分析 Mediation", en: "Mediation analysis (MED)", src: "Imai, Keele & Yamamoto (2010); Tingley et al. (2014), JSS; VanderWeele (2015)" },
  ps:   { zh: "傾向分數 PS", en: "Propensity Score (PS)", src: "Rosenbaum & Rubin (1983), Biometrika; Austin (2011); Li, Morgan & Zaslavsky (2018)" },
  tmle: { zh: "TMLE／雙重穩健", en: "TMLE / doubly-robust (AIPW)", src: "van der Laan & Rubin (2006); van der Laan & Rose (2011); Luque-Fernandez et al. (2018), Stat Med" },
  gm: { zh: "G-methods（時變混淆）", en: "G-methods (time-varying confounding)", src: "Robins, Hernán & Brumback (2000); Naimi, Cole & Kennedy (2017), IJE; Daniel et al. (2013), Stat Med" },
  gbtm: { zh: "群組軌跡模型 GBTM", en: "Group-based trajectory model (GBTM)", src: "Nagin (1999, 2005); Nagin & Odgers (2010), Annu Rev Clin Psychol; Jones & Nagin (2007, PROC TRAJ); Nagin & Tremblay (2005)" },
  evalue: { zh: "量化偏誤分析 QBA", en: "Quantitative bias analysis (QBA)", src: "VanderWeele & Ding (2017), Ann Intern Med; Haneuse, VanderWeele & Arterburn (2019), JAMA; Ding & VanderWeele (2016), Epidemiology; Lash, Fox & Fink (2009), Applying QBA" },
  tnd: { zh: "陰性檢驗設計 TND", en: "Test-Negative Design (TND)", src: "Jackson & Nelson (2013), Vaccine; Sullivan, Tchetgen Tchetgen & Cowling (2016); Schnitzer (2022), Epidemiology" },
  pssa: { zh: "處方順序對稱 PSSA", en: "Prescription Sequence Symmetry (PSSA)", src: "Hallas (1996), Epidemiology; Tsiropoulos, Andersen & Hallas (2009); Lai et al. (2017), Eur J Epidemiol" },
  tscan: { zh: "樹狀掃描統計 TreeScan", en: "Tree-based Scan Statistic (TreeScan)", src: "Kulldorff, Fang & Walsh (2003), Biometrics; Kulldorff et al. (2013), Stat Med; Maro et al. (2014), FDA Sentinel" },
  wce: { zh: "加權累積暴露 WCE", en: "Weighted Cumulative Exposure (WCE)", src: "Sela & Abrahamowicz (2009), Stat Med; Abrahamowicz, Beauchamp & Sylvestre (2012); Sylvestre & Abrahamowicz, R WCE package" },
  transport: { zh: "可轉移性／泛化", en: "Transportability / generalizability", src: "Adamson et al. (2026, ISPE); Westreich et al. (2017); Dahabreh et al. (2020); Bareinboim & Pearl (2016)" },
  extctrl: { zh: "外部對照", en: "External control", src: "ICH E10; Pocock (1976); Schmidli et al. (2014); Burcu et al. (2020); Jahanshahi et al. (2021)" },
  db:   { zh: "資料庫", en: "Databases", src: "AsPEN database directory; Sturkenboom & Schink (2020); NeuroGEN (Tsai DH-T, Bell JS, Abtahi S, Baak BN, Bazelier MT, Brauer R, Chan AYL, Chan EW, Chen H, Chui CSL, Cook S, Crystal S, Gandhi P, Hartikainen S, Ho FK, Hsu ST, Ilomäki J, Kim JH, Klungel OH, Koponen M, Lau WCY, Lau KK, Lum TYS, Luo H, Man KKC, Pell JP, Setoguchi S, Shao SC, Shen CY, Shin JY, Souverein PC, Tolppanen AM, Wei L, Wong ICK, Lai EC-C. Clin Epidemiol. 2023;15:1241-1252. doi:10.2147/CLEP.S426485)" },
  miss: { zh: "缺失資料", en: "Missing data", src: "Rubin (1987); van Buuren (2018); Sterne et al. (2009), BMJ" },
  srma: { zh: "系統性回顧與統合分析", en: "Systematic review & meta-analysis", src: "Cochrane Handbook (Higgins et al. 2024); PRISMA 2020; DerSimonian & Laird (1986); GRADE (Guyatt et al. 2008)" },
  nma: { zh: "網路統合分析", en: "Network meta-analysis", src: "Cochrane NMA Toolkit; Harrer et al. (doing-meta.guide/netwma); Salanti (2012); Bucher et al. (1997); Rücker & Schwarzer (2015)" },
  mcda: { zh: "多準則決策分析 MCDA", en: "Multi-criteria decision analysis (MCDA)", src: "Thokala et al. (2016) & Marsh et al. (2016), ISPOR MCDA Task Force, Value in Health; Belton & Stewart (2002); Mussen, Salek & Walker (2007)" },
  fsqca: { zh: "模糊集質性比較分析 fsQCA", en: "Fuzzy-set QCA (fsQCA)", src: "Ragin (2008), Redesigning Social Inquiry; Ragin (2006), Political Analysis; Schneider & Wagemann (2012); Dusa (2019), QCA with R" },
  babe: { zh: "生體可用率／生體相等性 BA/BE", en: "Bioavailability / bioequivalence (BA/BE)", src: "FDA Bioequivalence guidance; EMA CHMP BE guideline; Chow & Liu, Design and Analysis of BA/BE Studies; PowerTOST" },
  wetlab: { zh: "實驗室實驗 Wet lab", en: "Wet lab experiments", src: "Fisher (1935), Design of Experiments; Lawlor, Tilling & Davey Smith (2016, triangulation), IJE" },
  causalml: { zh: "因果機器學習", en: "Causal machine learning", src: "Feuerriegel et al. (2024, Nat Med); Künzel et al. (2019, PNAS); Wager & Athey (2018); Chernozhukov et al. (2018, DML); Nie & Wager (2021)" },
  mr: { zh: "孟德爾隨機化 MR", en: "Mendelian randomization (MR)", src: "Davey Smith & Ebrahim (2003), IJE; Burgess, Butterworth & Thompson (2013); Bowden et al. (2015, MR-Egger); Hemani et al. (2018, TwoSampleMR)" },
  dt: { zh: "數位孿生", en: "Digital twin", src: "Schuler et al. (2022, PROCOVA); FDA/EMA prognostic-adjustment guidance; synthetic control arms" },
};
let refsContext = "iv";   // which page's references/citation to show

function filterRefs(method) {
  refsContext = method || "iv";
  const list = document.getElementById("refsList");
  const intro = document.getElementById("refsIntro");
  if (!list) return;
  const showAll = refsContext === "choose";
  list.querySelectorAll("li").forEach((li) => {
    li.style.display = (showAll || li.dataset.ref === refsContext || li.dataset.ref === "all") ? "" : "none";
  });
  if (intro) {
    const m = METHOD_REF[refsContext];
    intro.innerHTML = showAll
      ? tr("全部方法的完整參考文獻：", "Full reference list for all methods:")
      : tr(`本頁（${m.zh}）的參考文獻：`, `References for this page (${m.en}):`);
  }
  renderCitation();
}
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function accessDates() {
  const d = new Date();
  const y = d.getFullYear(), m = d.getMonth(), day = d.getDate();
  return {
    en: `${MONTHS[m]} ${day}, ${y}`,                                  // Accessed May 30, 2026
    zh: `${y}年${m + 1}月${day}日`,                                    // 2026年5月30日
    ris: `${y}/${String(m + 1).padStart(2, "0")}/${String(day).padStart(2, "0")}`, // 2026/05/30
  };
}

function citationText() {
  const a = accessDates();
  const title = lang() === "en" ? CITE.titleEn : CITE.titleZh;
  const m = refsContext !== "choose" ? METHOD_REF[refsContext] : null;
  const tail = !m ? "" : (lang() === "en"
    ? ` [This page: ${m.en}; key methodological source(s): ${m.src}.]`
    : `〔本頁主題：${m.zh}；主要方法依據：${m.src}。〕`);
  return (lang() === "en"
    ? `${CITE.authors} ${title}. ${CITE.publisher}. Published ${CITE.year}. Accessed ${a.en}. ${CITE.url}`
    : `${CITE.authors} ${title}. ${CITE.publisher}. 發表於 ${CITE.year} 年。取用於 ${a.zh}。${CITE.url}`) + tail;
}

function bibtex() {
  const a = accessDates();
  return [
    "@misc{phdc-rwe-tool-2026,",
    "  author       = {{Methodology Working Group, Population Health Data Center, National Cheng Kung University} and Tsai, DH-T and Lai, EC-C},",
    `  title        = {${CITE.titleEn}},`,
    `  year         = {${CITE.year}},`,
    `  publisher    = {${CITE.publisher}},`,
    `  howpublished = {\\url{${CITE.url}}},`,
    `  note         = {Accessed ${a.en}}`,
    "}",
  ].join("\n");
}

function risText() {
  const a = accessDates();
  return [
    "TY  - ELEC",
    "AU  - Methodology Working Group, Population Health Data Center, National Cheng Kung University",
    "AU  - Tsai, DH-T",
    "AU  - Lai, EC-C",
    `TI  - ${CITE.titleEn}`,
    `PY  - ${CITE.year}`,
    `PB  - ${CITE.publisher}`,
    `UR  - ${CITE.url}`,
    `Y2  - ${a.ris}`,
    "ER  - ",
    "",
  ].join("\r\n");
}

function renderCitation() {
  const el = document.getElementById("citeText");
  if (!el) return;
  const txt = citationText();
  // linkify the trailing URL
  el.innerHTML = txt.replace(CITE.url, `<a href="${CITE.url}" target="_blank" rel="noopener">${CITE.url}</a>`);
}

async function flash(btn, msg) {
  const cur = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => { btn.textContent = cur; }, 1400);
}
async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    flash(btn, tr("已複製 ✓", "Copied ✓"));
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); flash(btn, tr("已複製 ✓", "Copied ✓")); }
    catch (e2) { flash(btn, tr("複製失敗", "Copy failed")); }
    document.body.removeChild(ta);
  }
}

document.getElementById("copyCite").addEventListener("click", (e) => copyText(citationText(), e.target));
document.getElementById("copyBib").addEventListener("click", (e) => copyText(bibtex(), e.target));
document.getElementById("dlRis").addEventListener("click", () => {
  const blob = new Blob([risText()], { type: "application/x-research-info-systems" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "phdc-rwe-tool.ris";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
filterRefs("iv");   // initial: show only the IV page's references + scoped citation

// ======================================================================
// Difference-in-differences (DiD method) — tabs ①–⑤
// ======================================================================
const didState = { source: null, columns: [], req: null };
let didLearnReady = false, didPlayReady = false, didAnalyzeReady = false,
    didAssumeReady = false, didMlReady = false;

// ---- shared DiD chart helpers ----
function didTrendInto(elId, trend, t0) {
  if (!document.getElementById(elId)) return;
  const P = trend.periods;
  const treated = { x: P, y: trend.treated, mode: "lines+markers", type: "scatter",
    name: tr("介入組", "treated"), line: { color: TEAL, width: 3 }, marker: { size: 7 } };
  const control = { x: P, y: trend.control, mode: "lines+markers", type: "scatter",
    name: tr("對照組", "control"), line: { color: "#9aa6b2", width: 3 }, marker: { size: 7 } };
  Plotly.react(elId, [control, treated], sceneLayout({
    height: 320, showlegend: true, legend: { orientation: "h", y: 1.15 },
    xaxis: { title: tr("期別", "period"), dtick: 1 },
    yaxis: { title: tr("平均結果", "mean outcome") },
    shapes: [{ type: "line", x0: t0 - 0.5, x1: t0 - 0.5, y0: 0, y1: 1, yref: "paper",
      line: { color: INK, width: 1.5, dash: "dot" } }],
    annotations: [{ x: t0 - 0.5, y: 1, yref: "paper", yshift: 6,
      text: tr("政策上路", "policy on"), showarrow: false, font: { size: 11, color: INK } }],
  }), SCENE_CFG);
}

function didEventInto(elId, ev) {
  if (!document.getElementById(elId)) return;
  const err = ev.coef.map((c, i) => (ev.hi[i] - ev.lo[i]) / 2);
  const colors = ev.periods.map((q) => (q < ev.t0 ? "#9aa6b2" : TEAL));
  const dots = { x: ev.periods, y: ev.coef, mode: "markers", type: "scatter",
    marker: { color: colors, size: 9 },
    error_y: { type: "data", array: err, visible: true, color: "#c2cad4", thickness: 1.2 } };
  Plotly.react(elId, [dots], sceneLayout({
    height: 300,
    xaxis: { title: tr("期別（相對基期）", "period (vs base)"), dtick: 1 },
    yaxis: { title: tr("介入−對照 係數", "treated−control coef") },
    shapes: [
      { type: "line", x0: Math.min(...ev.periods), x1: Math.max(...ev.periods), y0: 0, y1: 0,
        line: { color: GREEN, width: 1.5, dash: "dash" } },
      { type: "line", x0: ev.t0 - 0.5, x1: ev.t0 - 0.5, y0: 0, y1: 1, yref: "paper",
        line: { color: INK, width: 1.2, dash: "dot" } },
    ],
  }), SCENE_CFG);
}

function didBarsInto(elId, bars) {
  if (!document.getElementById(elId)) return;
  const n = bars.values.length;
  const colors = bars.values.map((v, i) => (i === 0 ? GREEN : (i === n - 1 ? TEAL : AMBER)));
  Plotly.react(elId, [{
    x: bars.labels, y: bars.values, type: "bar", marker: { color: colors },
    text: bars.values.map((v) => v.toFixed(2)), textposition: "auto",
  }], sceneLayout({ height: 280, margin: { t: 20, r: 16, b: 40, l: 40 }, yaxis: { title: "" } }), SCENE_CFG);
}

// ---- ① learn ----
function initDidLearn() {
  if (didLearnReady) return;
  didLearnReady = true;
  drawSceneDidParallel();
}
function drawSceneDidParallel() {
  if (!document.getElementById("sceneDidParallel")) return;
  const P = [0, 1, 2, 3, 4, 5], t0 = 3, att = 3.0;
  const control = P.map((p) => 60 + 2 * p);
  const treatedCf = P.map((p) => 64 + 2 * p);                  // parallel counterfactual (+4 gap)
  const treated = P.map((p) => 64 + 2 * p + (p >= t0 ? att : 0));
  const cline = { x: P, y: control, mode: "lines+markers", type: "scatter",
    name: tr("對照組", "control"), line: { color: "#9aa6b2", width: 3 }, marker: { size: 7 } };
  const cf = { x: P, y: treatedCf, mode: "lines", type: "scatter",
    name: tr("介入組（假如沒政策）", "treated (no policy)"), line: { color: TEAL, width: 2, dash: "dash" } };
  const tline = { x: P, y: treated, mode: "lines+markers", type: "scatter",
    name: tr("介入組", "treated"), line: { color: TEAL, width: 3 }, marker: { size: 7 } };
  Plotly.react("sceneDidParallel", [cline, cf, tline], sceneLayout({
    height: 300, showlegend: true, legend: { orientation: "h", y: 1.18 },
    xaxis: { title: tr("期別", "period"), dtick: 1 },
    yaxis: { title: tr("平均結果", "mean outcome") },
    shapes: [{ type: "line", x0: t0 - 0.5, x1: t0 - 0.5, y0: 0, y1: 1, yref: "paper",
      line: { color: INK, width: 1.5, dash: "dot" } }],
    annotations: [{ x: t0 - 0.5, y: 1, yref: "paper", yshift: 6,
      text: tr("政策上路", "policy on"), showarrow: false, font: { size: 11, color: INK } }],
  }), SCENE_CFG);
}

// ---- ② interactive ----
const didViolSlider = document.getElementById("didViolSlider");
let didPlayTimer = null;
function initDidPlay() {
  if (didPlayReady) return;
  didPlayReady = true;
  refreshDidPlay();
}
function scheduleDidPlay() {
  document.getElementById("didViolVal").textContent = Number(didViolSlider.value).toFixed(1);
  clearTimeout(didPlayTimer);
  didPlayTimer = setTimeout(refreshDidPlay, 120);
}
if (didViolSlider) didViolSlider.addEventListener("input", scheduleDidPlay);

async function refreshDidPlay() {
  const v = didViolSlider ? Number(didViolSlider.value) : 0;
  let d;
  try { d = await getJSON(`${API}/api/did_interactive?violation=${v}&lang=${lang()}`); }
  catch (e) { return; }
  state.didPlay = d;
  document.getElementById("didEst").textContent = fmt(d.estimate, 2);
  document.getElementById("didNaive").textContent = fmt(d.naive, 2);
  const p = d.event_study.pre_max_p;
  const ok = p >= 0.05;
  const pre = document.getElementById("didPre");
  pre.textContent = ok ? tr("平行 ✓", "parallel ✓") : tr("分岔 ⚠", "diverging ⚠");
  pre.style.color = ok ? "var(--green)" : "var(--red)";
  document.getElementById("didPreFoot").textContent = tr(`前期檢定 p=${fmt(p, 3)}`, `pre-trend p=${fmt(p, 3)}`);
  didTrendInto("didTrendChart", d.trend, d.t0);
  didEventInto("didEventChart", d.event_study);
}

// ---- ③ analyze ----
function initDidAnalyze() {
  if (didAnalyzeReady) return;
  didAnalyzeReady = true;
  document.getElementById("useDidExample").click();
}
function didFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["didSelUnit", "didSelPeriod", "didSelGroup", "didSelY", "didSelCov"].forEach((id) => {
    document.getElementById(id).innerHTML = opts;
  });
  document.getElementById("didColMap").classList.remove("hidden");
}
function didApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null) el.value = v; };
  set("didSelUnit", d.unit); set("didSelPeriod", d.period); set("didSelGroup", d.group);
  set("didSelY", d.outcome); set("didSelT0", d.t0);
  const cov = document.getElementById("didSelCov");
  if (d.covariates) [...cov.options].forEach((o) => { o.selected = d.covariates.includes(o.value); });
}
document.getElementById("useDidExample").addEventListener("click", async () => {
  const st = document.getElementById("didDataStatus");
  try {
    const d = await getJSON(`${API}/api/did_example`);
    didState.source = "example_did"; didState.columns = d.columns;
    st.textContent = tr(`已載入內建政策範例（${d.n} 列＝單位×期，合成虛構）`,
                        `Loaded built-in policy example (${d.n} rows = unit×period, synthetic)`);
    didFillSelects(d.columns); didApplyDefaults(d.defaults);
    runDidAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("didFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("didDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    didState.source = d.token; didState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    didFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function didCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return {
    source: didState.source, unit: v("didSelUnit"), period: v("didSelPeriod"),
    group: v("didSelGroup"), outcome: v("didSelY"), t0: Number(v("didSelT0")),
    covariates: [...document.getElementById("didSelCov").selectedOptions].map((o) => o.value),
    lang: lang(),
  };
}
document.getElementById("runDidAnalyze").addEventListener("click", runDidAnalyze);
async function runDidAnalyze() {
  const req = didCurrentMapping();
  if (!req.source) return;
  didState.req = req;
  try {
    const a = await postJSON(`${API}/api/did_analyze`, req);
    renderDidAnalyze(a);
    runDidAssumptions(req);
    renderDidVariants();   // advanced (non-AI) variants shown under ③
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
// advanced VARIANTS (not AI) rendered in tab ③ — light, no sklearn
async function renderDidVariants() {
  let d;
  try { d = await getJSON(`${API}/api/did_variants?lang=${lang()}`); } catch (e) { return; }
  state.didVar = d;
  drawDidStagScene(); didBarsInto("didStagChart", d.staggered.bars);
  document.getElementById("didStagReading").textContent = d.staggered.reading;
  drawDidUnivScene(d.universal); didBarsInto("didUnivChart", d.universal.bars);
  document.getElementById("didUnivReading").textContent = d.universal.reading;
  drawDidSynth(d.synth);
  document.getElementById("didSynthReading").textContent = d.synth.reading;
}
function renderDidAnalyze(a) {
  document.getElementById("didAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("DiD（政策效果，ATT）", "DiD (policy effect, ATT)"), a.did.estimate, a.did.interpretation, true],
    [tr("2×2 點估計", "2×2 point estimate"), a.two_by_two.did,
      tr("四格平均的（後−前）−（後−前）。", "(after−before)−(after−before) of the four cell means."), false],
    [tr("未校正：只看後期差（有偏）", "Naive: post-only gap (biased)"), a.naive_difference,
      tr("被各組固定落差汙染。", "contaminated by fixed group differences."), false],
  ];
  document.getElementById("didAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, hl ? 3 : 2)}</div><p>${desc}</p></div>`
  ).join("");
  didTrendInto("didAnalyzePlot", a.trend, a.t0);
  didEventInto("didAnalyzeEvent", a.event_study);
}

// ---- ④ assumptions ----
function initDidAssume() {
  if (didAssumeReady) return;
  didAssumeReady = true;
  runDidAssumptions(didState.req || { source: "example_did", lang: lang() });
}
async function runDidAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_did", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/did_assumptions`, body); } catch (e) { return; }
  state.didDash = out;
  renderDidAssumptions(out);
}
function renderDidAssumptions(out) {
  document.getElementById("didAssumeHint").classList.add("hidden");
  const ov = document.getElementById("didOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("各項佐證都通過，這個 DiD 看起來可信。", "All checks pass — this DiD looks credible."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，DiD 結果要保守看待。", "Some items fail — interpret the DiD with caution."),
    info: tr("關鍵假設需靠領域知識判斷，請看各卡片說明。", "The key assumption needs domain judgement — see each card."),
  }[worst];
  ov.classList.remove("hidden");
  ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("didAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) =>
      `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}">
      <h3><span class="dot bg-${c.status}"></span>${c.title}
        <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p>
      <p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details>
    </div>`;
  }).join("");
}

// ---- ⑤ boost: the ONE real-ML estimator (DML), button-gated (loads sklearn) ----
function initDidMl() {
  didMlReady = true;
  drawDoublyRobust("didDrDiagram");
  drawCrossfit("didCfDiagram");
  if (state.didDml) renderDidDml(state.didDml);
}
function renderDidDml(d) {
  document.getElementById("didDmlOut").classList.remove("hidden");
  didBarsInto("didDmlChart", d.bars);
  document.getElementById("didDmlReading").textContent = d.reading;
}
const _runDidDmlBtn = document.getElementById("runDidDml");
if (_runDidDmlBtn) _runDidDmlBtn.addEventListener("click", async () => {
  _runDidDmlBtn.disabled = true;
  const old = _runDidDmlBtn.textContent;
  _runDidDmlBtn.textContent = tr("計算中…（載入 ML 套件＋訓練）", "Computing… (loading ML package + training)");
  try {
    const d = await getJSON(`${API}/api/did_dml?lang=${lang()}`);
    state.didDml = d;
    renderDidDml(d);
    _runDidDmlBtn.textContent = tr("重新計算 DML", "Re-run DML");
  } catch (e) {
    _runDidDmlBtn.textContent = tr("計算失敗，再試一次", "Failed — try again");
  } finally { _runDidDmlBtn.disabled = false; }
});
function drawDidStagScene() {
  if (!document.getElementById("sceneDidStag")) return;
  const cohorts = [
    { g: 2, label: tr("早採用（第2期起）", "early (from t=2)"), y: 2 },
    { g: 4, label: tr("晚採用（第4期起）", "late (from t=4)"), y: 1 },
    { g: -1, label: tr("從不採用（對照）", "never (control)"), y: 0 },
  ];
  const rows = [], ann = [];
  cohorts.forEach((c) => {
    rows.push({ x: [0, 5], y: [c.y, c.y], mode: "lines", type: "scatter",
      line: { color: "#dce2e8", width: 12 }, hoverinfo: "skip" });
    if (c.g >= 0) rows.push({ x: [c.g, 5], y: [c.y, c.y], mode: "lines", type: "scatter",
      line: { color: TEAL, width: 12 }, hoverinfo: "skip" });
    ann.push({ x: 5.2, y: c.y, text: c.label, showarrow: false, xanchor: "left",
      font: { size: 11, color: INK } });
  });
  Plotly.react("sceneDidStag", rows, sceneLayout({
    height: 220, margin: { t: 18, r: 150, b: 38, l: 16 },
    xaxis: { title: tr("期別（青色＝已受處置）", "period (teal = treated)"), range: [-0.3, 8.5], dtick: 1 },
    yaxis: { showticklabels: false, range: [-0.6, 2.6] },
    annotations: ann,
  }), SCENE_CFG);
}
function drawDidUnivScene(u) {
  if (!document.getElementById("sceneDidUniv")) return;
  const pr = u.scene.probs;
  const xs = [tr("政策前", "pre"), tr("政策後", "post")];
  const treat = { x: xs, y: pr.treated, mode: "lines+markers", type: "scatter",
    name: tr("介入", "treated"), line: { color: TEAL, width: 3 }, marker: { size: 9 } };
  const ctrl = { x: xs, y: pr.control, mode: "lines+markers", type: "scatter",
    name: tr("對照", "control"), line: { color: "#9aa6b2", width: 3 }, marker: { size: 9 } };
  Plotly.react("sceneDidUniv", [ctrl, treat], sceneLayout({
    showlegend: true, legend: { orientation: "h", y: 1.18 },
    yaxis: { title: tr("事件發生率", "event rate"), range: [0, 1], tickformat: ".0%" },
  }), SCENE_CFG);
}
function drawDidSynth(s) {
  if (!document.getElementById("didSynthChart")) return;
  const P = s.series.periods;
  const treated = { x: P, y: s.series.treated, mode: "lines+markers", type: "scatter",
    name: tr("受處置單位", "treated unit"), line: { color: TEAL, width: 3 }, marker: { size: 6 } };
  const synth = { x: P, y: s.series.synth, mode: "lines", type: "scatter",
    name: tr("合成反事實", "synthetic"), line: { color: AMBER, width: 3, dash: "dash" } };
  Plotly.react("didSynthChart", [synth, treated], sceneLayout({
    height: 320, showlegend: true, legend: { orientation: "h", y: 1.15 },
    xaxis: { title: tr("期別", "period"), dtick: 1 }, yaxis: { title: tr("結果", "outcome") },
    shapes: [{ type: "line", x0: s.t0 - 0.5, x1: s.t0 - 0.5, y0: 0, y1: 1, yref: "paper",
      line: { color: INK, width: 1.5, dash: "dot" } }],
    annotations: [{ x: s.t0 - 0.5, y: 1, yref: "paper", yshift: 6,
      text: tr("政策上路", "policy on"), showarrow: false, font: { size: 11, color: INK } }],
  }), SCENE_CFG);
}

// ======================================================================
// Trend-in-trend (TiT method) — tabs ①–④ (⑤ is static honest-unknown HTML)
// ======================================================================
const titState = { source: null, columns: [], req: null };
let titLearnReady = false, titPlayReady = false, titAnalyzeReady = false, titAssumeReady = false;

function titColor(g, K) {
  const f = K > 1 ? g / (K - 1) : 0;
  const c0 = [154, 166, 178], c1 = [13, 148, 136];   // grey -> teal
  const c = c0.map((v, i) => Math.round(v + (c1[i] - v) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
function titCurvesInto(elId, curve, key, yTitle, pct) {
  if (!document.getElementById(elId)) return;
  const P = curve.periods, K = curve.strata.length;
  const traces = curve.strata.map((s) => ({
    x: P, y: s[key], mode: "lines+markers", type: "scatter",
    name: tr(`第 ${s.g + 1} 層`, `stratum ${s.g + 1}`),
    line: { color: titColor(s.g, K), width: 2.5 }, marker: { size: 5 },
  }));
  Plotly.react(elId, traces, sceneLayout({
    height: 320, showlegend: true, legend: { orientation: "h", y: 1.12 },
    xaxis: { title: tr("期別（季）", "period (quarter)"), dtick: 1 },
    yaxis: Object.assign({ title: yTitle }, pct ? { tickformat: ".0%" } : {}),
  }), SCENE_CFG);
}

// ---- ① learn ----
function initTitLearn() {
  if (titLearnReady) return;
  titLearnReady = true;
  drawSceneTitFan();
}
function drawSceneTitFan() {
  if (!document.getElementById("sceneTitExpo")) return;
  const rng = mulberry32(717);
  const P = Array.from({ length: 10 }, (_, i) => i), K = 5;
  const q0 = 0.012, beta = 0.06;                  // baseline event rate; causal effect of exposure on outcome
  const strata = [];
  for (let g = 0; g < K; g++) {
    const slope = 0.05 + 0.12 * g;
    const p = P.map((tp) => {                     // exposure (vaccination) prevalence trend
      const lo = -4.0 + slope * tp;
      const pr = 1 / (1 + Math.exp(-lo));
      return Math.max(0, pr + (rng() - 0.5) * 0.012);
    });
    // outcome (event) rate TRACKS the exposure prevalence: q = q0 + β·p. Strata
    // whose uptake fans out steeply show the outcome fanning out the same way —
    // that co-movement IS the trend-in-trend signal.
    const q = p.map((pp) => Math.max(0, q0 + beta * pp + (rng() - 0.5) * 0.004));
    strata.push({ g, p, q });
  }
  const data = { periods: P, strata };
  titCurvesInto("sceneTitExpo", data, "p", tr("接種率", "vaccination rate"), true);
  titCurvesInto("sceneTitOut", data, "q", tr("事件率", "event rate"), true);
}

// ---- ② interactive ----
const titTrendSlider = document.getElementById("titTrendSlider");
let titPlayTimer = null;
function initTitPlay() {
  if (titPlayReady) return;
  titPlayReady = true;
  refreshTitPlay();
}
function scheduleTitPlay() {
  document.getElementById("titTrendVal").textContent = Number(titTrendSlider.value).toFixed(1);
  clearTimeout(titPlayTimer);
  titPlayTimer = setTimeout(refreshTitPlay, 180);
}
if (titTrendSlider) titTrendSlider.addEventListener("input", scheduleTitPlay);
async function refreshTitPlay() {
  const tv = titTrendSlider ? Number(titTrendSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/tit_interactive?trend=${tv}&lang=${lang()}`); }
  catch (e) { return; }
  state.titPlay = d;
  document.getElementById("titOr").textContent = fmt(d.or, 2);
  const w = (d.ci[0] != null && d.ci[1] != null) ? d.ci[1] - d.ci[0] : null;
  document.getElementById("titCiW").textContent = w != null ? fmt(w, 2) : "–";
  document.getElementById("titCiFoot").textContent = (d.ci[0] != null)
    ? tr(`${fmt(d.ci[0], 2)}～${fmt(d.ci[1], 2)}`, `${fmt(d.ci[0], 2)}–${fmt(d.ci[1], 2)}`) : "";
  document.getElementById("titNaive").textContent = fmt(d.naive_or, 2);
  titCurvesInto("titExpoChart", d.exposure_curve, "p", tr("接種率", "vaccination rate"), true);
  titCurvesInto("titOutChart", d.outcome_curve, "q", tr("結果率", "outcome rate"), true);
}

// ---- ③ analyze ----
function initTitAnalyze() {
  if (titAnalyzeReady) return;
  titAnalyzeReady = true;
  document.getElementById("useTitExample").click();
}
function titFillCov(cols) {
  const cov = cols.filter((c) => !["pid", "period", "exposed", "outcome"].includes(c));
  document.getElementById("titSelCov").innerHTML =
    cov.map((c) => `<option value="${c}" selected>${c}</option>`).join("");
  document.getElementById("titColMap").classList.remove("hidden");
}
document.getElementById("useTitExample").addEventListener("click", async () => {
  const st = document.getElementById("titDataStatus");
  try {
    const d = await getJSON(`${API}/api/tit_example`);
    titState.source = "example_tit"; titState.columns = d.columns;
    st.textContent = tr(`已載入內建疫苗普及範例（${d.n_people} 人 × ${Math.round(d.n_rows / d.n_people)} 期，合成虛構）`,
                        `Loaded built-in vaccine-uptake example (${d.n_people} people × ${Math.round(d.n_rows / d.n_people)} periods, synthetic)`);
    titFillCov(d.columns);
    runTitAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("titFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("titDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    titState.source = d.token; titState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    titFillCov(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function titCurrentMapping() {
  return {
    source: titState.source,
    K: Number(document.getElementById("titSelK").value),
    covariates: [...document.getElementById("titSelCov").selectedOptions].map((o) => o.value),
    lang: lang(),
  };
}
document.getElementById("runTitAnalyze").addEventListener("click", runTitAnalyze);
async function runTitAnalyze() {
  const req = titCurrentMapping();
  if (!req.source) return;
  titState.req = req;
  try {
    const a = await postJSON(`${API}/api/tit_analyze`, req);
    renderTitAnalyze(a);
    runTitAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderTitAnalyze(a) {
  document.getElementById("titAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("趨勢中的趨勢 OR（因果）", "Trend-in-trend OR (causal)"), a.or, a.interpretation, true],
    [tr("未校正世代 OR（有偏）", "Naive cohort OR (biased)"), a.naive_or,
      tr("直接比較接種與未接種，被適應症混淆。", "Direct vaccinated-vs-unvaccinated comparison, confounded by indication."), false],
    [tr("CPE 分層品質（AUC）", "CPE stratification quality (AUC)"), a.cpe_auc,
      tr("越高代表分層越能拉開暴露趨勢。", "Higher = strata separate the exposure trends better."), false],
  ];
  document.getElementById("titAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}</div><p>${desc}</p></div>`
  ).join("");
  titCurvesInto("titAnalyzeExpo", a.exposure_curve, "p", tr("接種率", "vaccination rate"), true);
  titCurvesInto("titAnalyzeOut2", a.outcome_curve, "q", tr("結果率", "outcome rate"), true);
}

// ---- ③ bonus: the PUBLISHED Ji & Small cell-MLE (offline-precomputed) ----
let titRealCache = null;
const runTitRealBtn = document.getElementById("runTitRealMle");
if (runTitRealBtn) runTitRealBtn.addEventListener("click", async () => {
  const btn = runTitRealBtn; const old = btn.textContent;
  btn.disabled = true; btn.textContent = tr("載入中…", "Loading…");
  try {
    const s = await getJSON(`${API}/api/tit_realmle?lang=${lang()}`);
    titRealCache = s; drawTitReal(s);
  } catch (e) { alert(tr("載入失敗：", "Failed: ") + e.message); }
  finally { btn.disabled = false; btn.textContent = old; }
});
function drawTitReal(s) {
  document.getElementById("titRealOut").classList.remove("hidden");
  const ci = s.ci || [null, null];
  const err = (ci[0] != null) ? { type: "data", symmetric: false, array: [ci[1] - s.or], arrayminus: [s.or - ci[0]], color: INK, thickness: 1.5, width: 8 } : undefined;
  if (document.getElementById("titRealChart")) {
    Plotly.react("titRealChart", [{
      x: [tr("發表版 cell-MLE", "published cell-MLE"), tr("未校正世代", "naive cohort")],
      y: [s.or, s.naive_or], type: "bar", marker: { color: [TEAL, AMBER] },
      error_y: err ? { ...err, array: [ci[1] - s.or, 0], arrayminus: [s.or - ci[0], 0] } : undefined,
      text: [s.or.toFixed(2), s.naive_or.toFixed(2)], textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 24, r: 16, b: 40, l: 50 },
      yaxis: { title: tr("勝算比 OR", "odds ratio OR"), range: [0, Math.max(s.naive_or, (ci[1] || s.or)) * 1.2] },
      shapes: [{ type: "line", x0: -0.5, x1: 1.5, y0: s.true_or, y1: s.true_or, line: { color: GREEN, width: 2, dash: "dash" } }],
      annotations: [{ x: 1, y: s.true_or, text: tr("真值 " + s.true_or, "truth " + s.true_or), showarrow: false, yshift: 11, font: { color: GREEN, size: 10 } }],
    }), SCENE_CFG);
  }
  document.getElementById("titRealReading").innerHTML = s.reading;
}

// ---- ④ assumptions ----
function initTitAssume() {
  if (titAssumeReady) return;
  titAssumeReady = true;
  runTitAssumptions(titState.req || { source: "example_tit", lang: lang() });
}
async function runTitAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_tit", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/tit_assumptions`, body); } catch (e) { return; }
  state.titDash = out;
  renderTitAssumptions(out);
}
function renderTitAssumptions(out) {
  document.getElementById("titAssumeHint").classList.add("hidden");
  const ov = document.getElementById("titOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("各項佐證都通過，這個 TiT 看起來可信。", "All checks pass — this TiT looks credible."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，TiT 結果要保守看待。", "Some items fail — interpret the TiT with caution."),
    info: tr("關鍵假設需靠領域知識判斷，請看各卡片說明。", "The key assumption needs domain judgement — see each card."),
  }[worst];
  ov.classList.remove("hidden");
  ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("titAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) =>
      `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}">
      <h3><span class="dot bg-${c.status}"></span>${c.title}
        <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p>
      <p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details>
    </div>`;
  }).join("");
}

// ======================================================================
// Interrupted Time Series (ITS method) — tabs ①–⑤
// ======================================================================
const itsState = { source: null, columns: [], req: null };
let itsLearnReady = false, itsPlayReady = false, itsAnalyzeReady = false,
    itsAssumeReady = false, itsMlReady = false;

// shared: observed points + fitted pre/post segments + dashed counterfactual + cutoff
function itsSeriesInto(elId, plot) {
  if (!document.getElementById(elId)) return;
  const pts = { x: plot.points.x, y: plot.points.y, mode: "markers", type: "scatter",
    name: tr("觀察", "observed"), marker: { color: "#9aa6b2", size: 5, opacity: 0.85 } };
  const cf = { x: plot.counterfactual.x, y: plot.counterfactual.y, mode: "lines", type: "scatter",
    name: tr("反事實", "counterfactual"), line: { color: AMBER, width: 2.5, dash: "dash" } };
  const pre = { x: plot.pre.x, y: plot.pre.y, mode: "lines", type: "scatter",
    name: tr("前趨勢", "pre-trend"), line: { color: TEAL, width: 3 } };
  const post = { x: plot.post.x, y: plot.post.y, mode: "lines", type: "scatter",
    name: tr("介入後", "post"), line: { color: TEAL, width: 3 }, showlegend: false };
  Plotly.react(elId, [pts, cf, pre, post], sceneLayout({
    height: 320, showlegend: true, legend: { orientation: "h", y: 1.1 },
    xaxis: { title: tr("期序", "period") }, yaxis: { title: tr("結果", "outcome") },
    shapes: [{ type: "line", x0: plot.t0 - 0.5, x1: plot.t0 - 0.5, y0: 0, y1: 1, yref: "paper",
      line: { color: INK, width: 1.5, dash: "dot" } }],
    annotations: [{ x: plot.t0 - 0.5, y: 1, yref: "paper", yshift: 6,
      text: tr("介入", "intervention"), showarrow: false, font: { size: 11, color: INK } }],
  }), SCENE_CFG);
}

// ---- ① learn ----
function initItsLearn() {
  if (itsLearnReady) return;
  itsLearnReady = true;
  drawSceneItsExplain();
}
function drawSceneItsExplain() {
  if (!document.getElementById("sceneItsExplain")) return;
  const rng = mulberry32(818);
  const n = 48, t0 = 24, b0 = 100, b1 = 0.4, lev = -12, slo = -0.6;
  const x = [], y = [];
  for (let t = 0; t < n; t++) {
    const post = t >= t0 ? 1 : 0, ts = post ? t - t0 : 0;
    x.push(t); y.push(b0 + b1 * t + lev * post + slo * ts + randn(rng) * 2.2);
  }
  itsSeriesInto("sceneItsExplain", {
    points: { x, y },
    pre: { x: [0, t0 - 1], y: [b0, b0 + b1 * (t0 - 1)] },
    post: { x: [t0, n - 1], y: [b0 + b1 * t0 + lev, b0 + b1 * (n - 1) + lev + slo * (n - 1 - t0)] },
    counterfactual: { x: [t0 - 1, n - 1], y: [b0 + b1 * (t0 - 1), b0 + b1 * (n - 1)] },
    t0,
  });
}

// ---- ② interactive ----
const itsLevelSlider = document.getElementById("itsLevelSlider");
let itsPlayTimer = null;
function initItsPlay() {
  if (itsPlayReady) return;
  itsPlayReady = true;
  refreshItsPlay();
}
function scheduleItsPlay() {
  document.getElementById("itsLevelVal").textContent = Number(itsLevelSlider.value).toFixed(0);
  clearTimeout(itsPlayTimer);
  itsPlayTimer = setTimeout(refreshItsPlay, 140);
}
if (itsLevelSlider) itsLevelSlider.addEventListener("input", scheduleItsPlay);
async function refreshItsPlay() {
  const lv = itsLevelSlider ? Number(itsLevelSlider.value) : -12;
  let d;
  try { d = await getJSON(`${API}/api/its_interactive?level=${lv}&lang=${lang()}`); }
  catch (e) { return; }
  state.itsPlay = d;
  document.getElementById("itsLevel").textContent = fmt(d.level.estimate, 1);
  document.getElementById("itsLevelFoot").textContent = tr(`你設定的真值 ${lv}`, `you set ${lv}`);
  document.getElementById("itsSlope").textContent = fmt(d.slope.estimate, 2);
  document.getElementById("itsEffEnd").textContent = fmt(d.effect_end, 1);
  itsSeriesInto("itsPlayChart", d.plot);
}

// ---- ③ analyze ----
function initItsAnalyze() {
  if (itsAnalyzeReady) return;
  itsAnalyzeReady = true;
  document.getElementById("useItsExample").click();
}
function itsFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["itsSelTime", "itsSelY", "itsSelPost", "itsSelTs"].forEach((id) =>
    document.getElementById(id).innerHTML = opts);
  document.getElementById("itsColMap").classList.remove("hidden");
}
function itsApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null) el.value = v; };
  set("itsSelTime", d.time); set("itsSelY", d.outcome); set("itsSelPost", d.post); set("itsSelTs", d.t_since);
}
document.getElementById("useItsExample").addEventListener("click", async () => {
  const st = document.getElementById("itsDataStatus");
  try {
    const d = await getJSON(`${API}/api/its_example`);
    itsState.source = "example_its"; itsState.columns = d.columns;
    st.textContent = tr(`已載入內建每月範例（${d.n} 期，合成虛構）`,
                        `Loaded built-in monthly example (${d.n} months, synthetic)`);
    itsFillSelects(d.columns); itsApplyDefaults(d.defaults);
    runItsAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("itsFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("itsDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    itsState.source = d.token; itsState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    itsFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function itsCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return { source: itsState.source, time: v("itsSelTime"), outcome: v("itsSelY"),
    post: v("itsSelPost"), t_since: v("itsSelTs"), lang: lang() };
}
document.getElementById("runItsAnalyze").addEventListener("click", runItsAnalyze);
async function runItsAnalyze() {
  const req = itsCurrentMapping();
  if (!req.source) return;
  itsState.req = req;
  try {
    const a = await postJSON(`${API}/api/its_analyze`, req);
    renderItsAnalyze(a);
    runItsAssumptions(req);
    renderItsVariants();   // advanced (non-AI) variants shown under ③
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
// advanced VARIANTS (not AI) rendered in tab ③ — light, no sklearn
async function renderItsVariants() {
  let d;
  try { d = await getJSON(`${API}/api/its_variants?lang=${lang()}`); } catch (e) { return; }
  state.itsVar = d;
  drawItsHac(d.hac); document.getElementById("itsHacReading").textContent = d.hac.reading;
  drawItsCtrl(d.controlled); document.getElementById("itsCtrlReading").textContent = d.controlled.reading;
  drawItsBsts(d.bsts); document.getElementById("itsBstsReading").textContent = d.bsts.reading;
}
function renderItsAnalyze(a) {
  document.getElementById("itsAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("水準變化 β₂", "Level change β₂"), a.level.estimate, a.interpretation, true],
    [tr("斜率變化 β₃", "Slope change β₃"), a.slope.estimate,
      tr(`HAC 95% 區間 ${fmt(a.slope.ci[0], 2)}～${fmt(a.slope.ci[1], 2)}。`,
         `HAC 95% CI ${fmt(a.slope.ci[0], 2)}–${fmt(a.slope.ci[1], 2)}.`), false],
    [tr("追蹤結束時效果", "Effect at end"), a.effect_end,
      tr(`殘差自相關 lag-1≈${fmt(a.acf1, 2)}（已用 HAC 校正）。`,
         `residual lag-1 acf≈${fmt(a.acf1, 2)} (HAC-corrected).`), false],
  ];
  document.getElementById("itsAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, hl ? 1 : 2)}</div><p>${desc}</p></div>`
  ).join("");
  itsSeriesInto("itsAnalyzeChart", a.plot);
}

// ---- ④ assumptions ----
function initItsAssume() {
  if (itsAssumeReady) return;
  itsAssumeReady = true;
  runItsAssumptions(itsState.req || { source: "example_its", lang: lang() });
}
async function runItsAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_its", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/its_assumptions`, body); } catch (e) { return; }
  state.itsDash = out;
  renderItsAssumptions(out);
}
function renderItsAssumptions(out) {
  document.getElementById("itsAssumeHint").classList.add("hidden");
  const ov = document.getElementById("itsOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("各項佐證都通過，這個 ITS 看起來可信。", "All checks pass — this ITS looks credible."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，ITS 結果要保守看待。", "Some items fail — interpret the ITS with caution."),
    info: tr("關鍵假設需靠領域知識判斷，請看各卡片說明。", "The key assumption needs domain judgement — see each card."),
  }[worst];
  ov.classList.remove("hidden");
  ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("itsAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) =>
      `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}">
      <h3><span class="dot bg-${c.status}"></span>${c.title}
        <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p>
      <p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details>
    </div>`;
  }).join("");
}

// ---- ⑤ boost: the ONE real-ML estimator (ML two-stage counterfactual), button-gated ----
function initItsMl() {
  itsMlReady = true;
  drawTwoStage("itsTwoStageDiagram");
  if (state.itsMlcf) renderItsMlcf(state.itsMlcf);
}
function renderItsMlcf(d) {
  document.getElementById("itsMlcfOut").classList.remove("hidden");
  didBarsInto("itsMlcfChart", d.bars);
  document.getElementById("itsMlcfReading").textContent = d.reading;
  const s = d.series;
  const pts = { x: s.time, y: s.y, mode: "markers", type: "scatter",
    name: tr("觀察", "observed"), marker: { color: "#9aa6b2", size: 5 } };
  const cf = { x: s.time, y: s.cf, mode: "lines", type: "scatter",
    name: tr("ML 反事實", "ML counterfactual"), line: { color: AMBER, width: 2.5, dash: "dash" } };
  Plotly.react("itsMlcfSeries", [pts, cf], sceneLayout({
    height: 320, showlegend: true, legend: { orientation: "h", y: 1.12 },
    xaxis: { title: tr("期序", "period") }, yaxis: { title: tr("結果", "outcome") },
    shapes: [_itsCutoff(s.t0)],
  }), SCENE_CFG);
}
const _runItsMlcfBtn = document.getElementById("runItsMlcf");
if (_runItsMlcfBtn) _runItsMlcfBtn.addEventListener("click", async () => {
  _runItsMlcfBtn.disabled = true;
  _runItsMlcfBtn.textContent = tr("計算中…（載入 ML 套件＋訓練）", "Computing… (loading ML package + training)");
  try {
    const d = await getJSON(`${API}/api/its_mlcf?lang=${lang()}`);
    state.itsMlcf = d;
    renderItsMlcf(d);
    _runItsMlcfBtn.textContent = tr("重新計算 ML 反事實", "Re-run ML counterfactual");
  } catch (e) {
    _runItsMlcfBtn.textContent = tr("計算失敗，再試一次", "Failed — try again");
  } finally { _runItsMlcfBtn.disabled = false; }
});
function _itsCutoff(t0) {
  return { type: "line", x0: t0 - 0.5, x1: t0 - 0.5, y0: 0, y1: 1, yref: "paper",
    line: { color: INK, width: 1.3, dash: "dot" } };
}
function drawItsHac(h) {
  if (!document.getElementById("itsHacChart")) return;
  const s = h.series;
  const pts = { x: s.time, y: s.y, mode: "lines+markers", type: "scatter",
    line: { color: "#9aa6b2", width: 1 }, marker: { color: INK, size: 4 }, name: tr("觀察", "observed") };
  Plotly.react("itsHacChart", [pts], sceneLayout({
    height: 300, xaxis: { title: tr("期序", "period") }, yaxis: { title: tr("結果", "outcome") },
    shapes: [_itsCutoff(s.t0)],
  }), SCENE_CFG);
}
function drawItsCtrl(c) {
  if (!document.getElementById("itsCtrlChart")) return;
  const s = c.series;
  const tr1 = { x: s.time, y: s.treated, mode: "lines+markers", type: "scatter",
    name: tr("介入序列", "treated"), line: { color: TEAL, width: 2 }, marker: { size: 4 } };
  const cr = { x: s.time, y: s.control, mode: "lines+markers", type: "scatter",
    name: tr("控制序列", "control"), line: { color: "#9aa6b2", width: 2 }, marker: { size: 4 } };
  Plotly.react("itsCtrlChart", [cr, tr1], sceneLayout({
    height: 320, showlegend: true, legend: { orientation: "h", y: 1.12 },
    xaxis: { title: tr("期序", "period") }, yaxis: { title: tr("結果", "outcome") },
    shapes: [_itsCutoff(s.t0)],
  }), SCENE_CFG);
}
function drawItsFlex(f) {
  if (!document.getElementById("itsFlexChart")) return;
  const s = f.series;
  const pts = { x: s.time, y: s.y, mode: "markers", type: "scatter",
    name: tr("觀察", "observed"), marker: { color: "#9aa6b2", size: 5 } };
  const cf = { x: s.time, y: s.cf, mode: "lines", type: "scatter",
    name: tr("彈性反事實", "flexible counterfactual"), line: { color: AMBER, width: 2.5, dash: "dash" } };
  Plotly.react("itsFlexChart", [pts, cf], sceneLayout({
    height: 320, showlegend: true, legend: { orientation: "h", y: 1.12 },
    xaxis: { title: tr("期序", "period") }, yaxis: { title: tr("結果", "outcome") },
    shapes: [_itsCutoff(s.t0)],
  }), SCENE_CFG);
}
function drawItsBsts(b) {
  if (!document.getElementById("itsBstsChart")) return;
  const s = b.series;
  const lo = { x: s.time, y: s.lo, mode: "lines", type: "scatter", line: { width: 0 },
    showlegend: false, hoverinfo: "skip" };
  const hi = { x: s.time, y: s.hi, mode: "lines", type: "scatter", line: { width: 0 },
    fill: "tonexty", fillcolor: "rgba(245,158,11,0.18)", name: tr("反事實不確定帶", "counterfactual band") };
  const cf = { x: s.time, y: s.cf, mode: "lines", type: "scatter",
    name: tr("反事實", "counterfactual"), line: { color: AMBER, width: 2, dash: "dash" } };
  const pts = { x: s.time, y: s.y, mode: "markers", type: "scatter",
    name: tr("觀察", "observed"), marker: { color: INK, size: 4 } };
  Plotly.react("itsBstsChart", [lo, hi, cf, pts], sceneLayout({
    height: 320, showlegend: true, legend: { orientation: "h", y: 1.12 },
    xaxis: { title: tr("期序", "period") }, yaxis: { title: tr("結果", "outcome") },
    shapes: [_itsCutoff(s.t0)],
  }), SCENE_CFG);
}

// ======================================================================
// Prior Event Rate Ratio (PERR method) — tabs ①–⑤
// ======================================================================
const perrState = { source: null, columns: [], req: null };
let perrLearnReady = false, perrPlayReady = false, perrAnalyzeReady = false,
    perrAssumeReady = false, perrMlReady = false;

function perrRatesInto(elId, rates) {
  if (!document.getElementById(elId)) return;
  const x = [tr("事前期", "prior"), tr("事後期", "post")];
  const treated = { x, y: [rates.treated_prior, rates.treated_post], type: "bar",
    name: tr("處置組", "treated"), marker: { color: TEAL } };
  const control = { x, y: [rates.control_prior, rates.control_post], type: "bar",
    name: tr("對照組", "control"), marker: { color: "#9aa6b2" } };
  Plotly.react(elId, [treated, control], sceneLayout({
    height: 300, barmode: "group", showlegend: true, legend: { orientation: "h", y: 1.12 },
    yaxis: { title: tr("事件率（每人年）", "event rate (per person-year)") },
  }), SCENE_CFG);
}
function perrRatioBars(elId, d) {
  if (!document.getElementById(elId)) return;
  const labels = [tr("事前率比", "RR prior"), tr("未校正事後", "naive post"), tr("PERR", "PERR")];
  const vals = [d.rr_prior, d.naive_rr, d.perr];
  Plotly.react(elId, [{ x: labels, y: vals, type: "bar",
    marker: { color: ["#9aa6b2", AMBER, TEAL] },
    text: vals.map((v) => v.toFixed(2)), textposition: "auto" }], sceneLayout({
    height: 300, yaxis: { title: tr("率比", "rate ratio") },
    shapes: [
      { type: "line", x0: -0.5, x1: 2.5, y0: 1.0, y1: 1.0, line: { color: "#9aa6b2", width: 1.5, dash: "dot" } },
      { type: "line", x0: -0.5, x1: 2.5, y0: d.true_rr, y1: d.true_rr, line: { color: GREEN, width: 2, dash: "dash" } },
    ],
    annotations: [{ x: 2, y: d.true_rr, text: tr("真值 0.70", "truth 0.70"), showarrow: false,
      yshift: -12, font: { size: 11, color: GREEN } }],
  }), SCENE_CFG);
}

// ---- ① learn ----
function initPerrLearn() {
  if (perrLearnReady) return;
  perrLearnReady = true;
  drawScenePerr();
}
function drawScenePerr() {
  if (!document.getElementById("perrScene")) return;
  perrRatesInto("perrScene", { treated_prior: 0.131, control_prior: 0.094,
    treated_post: 0.066, control_post: 0.064 });
}

// ---- ② interactive ----
const perrDriftSlider = document.getElementById("perrDriftSlider");
let perrPlayTimer = null;
function initPerrPlay() {
  if (perrPlayReady) return;
  perrPlayReady = true;
  refreshPerrPlay();
}
function schedulePerrPlay() {
  document.getElementById("perrDriftVal").textContent = Number(perrDriftSlider.value).toFixed(1);
  clearTimeout(perrPlayTimer);
  perrPlayTimer = setTimeout(refreshPerrPlay, 150);
}
if (perrDriftSlider) perrDriftSlider.addEventListener("input", schedulePerrPlay);
async function refreshPerrPlay() {
  const dv = perrDriftSlider ? Number(perrDriftSlider.value) : 0;
  let d;
  try { d = await getJSON(`${API}/api/perr_interactive?drift=${dv}&lang=${lang()}`); }
  catch (e) { return; }
  state.perrPlay = d;
  document.getElementById("perrEst").textContent = fmt(d.perr, 2);
  document.getElementById("perrNaive").textContent = fmt(d.naive_rr, 2);
  document.getElementById("perrPrior").textContent = fmt(d.rr_prior, 2);
  perrRatioBars("perrPlayChart", d);
}

// ---- ③ analyze ----
function initPerrAnalyze() {
  if (perrAnalyzeReady) return;
  perrAnalyzeReady = true;
  document.getElementById("usePerrExample").click();
  perrMlReady = true; refreshPerrMl();   // PERR vs PERD scale-sensitivity demo (non-AI) now lives in ③
}
function perrFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["perrSelGroup", "perrSelEp", "perrSelPp", "perrSelEs", "perrSelPs"].forEach((id) =>
    document.getElementById(id).innerHTML = opts);
  document.getElementById("perrColMap").classList.remove("hidden");
}
function perrApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null) el.value = v; };
  set("perrSelGroup", d.group); set("perrSelEp", d.events_prior); set("perrSelPp", d.pt_prior);
  set("perrSelEs", d.events_post); set("perrSelPs", d.pt_post);
}
document.getElementById("usePerrExample").addEventListener("click", async () => {
  const st = document.getElementById("perrDataStatus");
  try {
    const d = await getJSON(`${API}/api/perr_example`);
    perrState.source = "example_perr"; perrState.columns = d.columns;
    st.textContent = tr(`已載入內建世代範例（${d.n} 人，合成虛構）`,
                        `Loaded built-in cohort example (${d.n} people, synthetic)`);
    perrFillSelects(d.columns); perrApplyDefaults(d.defaults);
    runPerrAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("perrFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("perrDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    perrState.source = d.token; perrState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    perrFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function perrCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return { source: perrState.source, group: v("perrSelGroup"),
    events_prior: v("perrSelEp"), pt_prior: v("perrSelPp"),
    events_post: v("perrSelEs"), pt_post: v("perrSelPs"), lang: lang() };
}
document.getElementById("runPerrAnalyze").addEventListener("click", runPerrAnalyze);
async function runPerrAnalyze() {
  const req = perrCurrentMapping();
  if (!req.source) return;
  perrState.req = req;
  try {
    const a = await postJSON(`${API}/api/perr_analyze`, req);
    renderPerrAnalyze(a);
    runPerrAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderPerrAnalyze(a) {
  document.getElementById("perrAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("PERR（因果率比）", "PERR (causal rate ratio)"), a.perr, a.interpretation, true],
    [tr("未校正事後率比（有偏）", "Naive post ratio (biased)"), a.naive_rr,
      tr("只看事後期，被適應症混淆掩蓋了效果。", "Post-only — confounding by indication hides the effect."), false],
    [tr("事前期率比（混淆指紋）", "Prior ratio (confounding fingerprint)"), a.rr_prior,
      tr(`PERR 95% 區間 ${fmt(a.ci[0], 2)}～${fmt(a.ci[1], 2)}。`,
         `PERR 95% CI ${fmt(a.ci[0], 2)}–${fmt(a.ci[1], 2)}.`), false],
  ];
  document.getElementById("perrAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}</div><p>${desc}</p></div>`
  ).join("");
  perrRatesInto("perrAnalyzeChart", a.rates);
}

// ---- ④ assumptions ----
function initPerrAssume() {
  if (perrAssumeReady) return;
  perrAssumeReady = true;
  runPerrAssumptions(perrState.req || { source: "example_perr", lang: lang() });
}
async function runPerrAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_perr", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/perr_assumptions`, body); } catch (e) { return; }
  state.perrDash = out;
  renderPerrAssumptions(out);
}
function renderPerrAssumptions(out) {
  document.getElementById("perrAssumeHint").classList.add("hidden");
  const ov = document.getElementById("perrOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；關鍵假設仍需領域判斷。", "Testable checks pass; the key assumptions still need domain judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，PERR 結果要保守看待。", "Some items fail — interpret the PERR with caution."),
    info: tr("PERR 多數假設不可檢驗，需靠領域知識與敏感度分析。", "Most PERR assumptions are untestable — rely on domain knowledge and sensitivity analysis."),
  }[worst];
  ov.classList.remove("hidden");
  ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("perrAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) =>
      `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}">
      <h3><span class="dot bg-${c.status}"></span>${c.title}
        <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p>
      <p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details>
    </div>`;
  }).join("");
}

// ---- ⑤ scale sensitivity (documented refinement, not AI) ----
function initPerrMl() { /* PERR ⑤ is now text-only (honest "no AI" + speculation); the
  scale-sensitivity demo moved to ③ and is drawn from initPerrAnalyze. */ }
async function refreshPerrMl() {
  let s;
  try { s = await getJSON(`${API}/api/perr_scale?lang=${lang()}`); } catch (e) { return; }
  state.perrScale = s;
  drawPerrScale(s);
  document.getElementById("perrScaleReading").textContent = s.reading;
}
function drawPerrScale(s) {
  if (!document.getElementById("perrScaleChart")) return;
  const y = [s.multiplicative.perr / s.multiplicative.true_rr, s.additive.perd / s.additive.true_diff];
  Plotly.react("perrScaleChart", [{
    x: [tr("乘法世界：看 PERR", "multiplicative: use PERR"), tr("加法世界：看 PERD", "additive: use PERD")],
    y, type: "bar", marker: { color: [TEAL, TEAL] },
    text: y.map((v) => v.toFixed(2) + "×"), textposition: "auto",
  }], sceneLayout({
    height: 280, yaxis: { title: tr("估計 ÷ 真值（1.0＝命中）", "estimate ÷ truth (1.0 = on target)"), range: [0, 1.4] },
    shapes: [{ type: "line", x0: -0.5, x1: 1.5, y0: 1, y1: 1, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: 1, y: 1, text: tr("命中真值", "on target"), showarrow: false, yshift: 10,
      font: { size: 11, color: GREEN } }],
  }), SCENE_CFG);
}

// ======================================================================
// Clone-Censor-Weight (CCW method) — tabs ①–⑤
// ======================================================================
const ccwState = { source: null, columns: [], req: null, scenario: "grace" };
let ccwLearnReady = false, ccwPlayReady = false, ccwAnalyzeReady = false,
    ccwAssumeReady = false, ccwMlReady = false;

// per-scenario arm labels for charts/cards. The three CCW scenarios are DIFFERENT
// cloning concepts, so the two arms are named differently in each:
//   grace      → initiate within a grace window  vs  defer
//   earlylate  → early initiation                vs  late initiation
//   sustained  → stay on treatment               vs  discontinue
function ccwArmLabels(sc) {
  if (sc === "earlylate") return [tr("早啟動", "early initiation"), tr("晚啟動", "late initiation")];
  if (sc === "sustained") return [tr("持續用藥", "stay on treatment"), tr("停藥", "discontinue")];
  return [tr("寬限期內起始", "initiate within grace"), tr("延後起始", "defer initiation")];
}

// per-scenario timeline endpoints + the deviation rule that triggers censoring —
// this is what genuinely differs between the three cloning concepts.
function ccwSceneMeta(sc) {
  if (sc === "earlylate") return {
    start: tr("合格日（時間零）", "eligibility (time zero)"),
    end: tr("起始時窗結束", "end of initiation window"),
    span: tr("起始時窗", "initiation window"),
    dev: tr("早啟動臂在「太晚才用藥」時設限；晚啟動臂在「太早就用藥」時設限。",
            "the early arm is censored if treatment starts too late; the late arm if it starts too early."),
  };
  if (sc === "sustained") return {
    start: tr("開始用藥（時間零）", "start of treatment (time zero)"),
    end: tr("追蹤結束", "end of follow-up"),
    span: tr("追蹤期間", "follow-up"),
    dev: tr("持續用藥臂在「停藥」時設限；停藥臂在「沒有如期停藥」時設限。設限後用 unstabilized IPCW（分子=1）＋截斷加權，sustained 策略配無母數加權 KM 的標準作法。",
            "the stay-on arm is censored at discontinuation; the discontinue arm if it fails to stop as assigned. The censoring is reweighted with unstabilized IPCW (numerator = 1) + truncation — the standard pairing for a sustained-strategy non-parametric weighted KM."),
  };
  return {  // grace
    start: tr("指標日", "index date"),
    end: tr("指標日＋寬限期", "index date + grace period"),
    span: tr("寬限期", "grace period"),
    dev: tr("「寬限期內起始」臂在過了寬限期仍未起始時設限；「延後起始」臂在寬限期內就起始時設限。",
            "the within-grace arm is censored if it hasn't initiated by the end of grace; the defer arm if it initiates during grace."),
  };
}

// cumulative-incidence curves: arm 1 (teal) vs arm 2 (slate), over months
function ccwCurveInto(elId, curve) {
  if (!document.getElementById(elId) || !curve) return;
  const m = curve.months;
  const [la, lb] = ccwArmLabels(ccwState.scenario);
  Plotly.react(elId, [
    { x: m, y: curve.early, mode: "lines+markers", type: "scatter", line: { color: TEAL, width: 3, shape: "hv" },
      marker: { size: 5 }, name: la },
    { x: m, y: curve.late, mode: "lines+markers", type: "scatter", line: { color: SLATE, width: 3, shape: "hv" },
      marker: { size: 5 }, name: lb },
  ], sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.16 },
    margin: { t: 28, r: 18, b: 42, l: 54 },
    xaxis: { title: tr("診斷後月份", "months since diagnosis"), dtick: 2 },
    yaxis: { title: tr("累積發生率", "cumulative incidence"), range: [0, Math.max(...curve.late) * 1.15 + 0.02], tickformat: ".0%" },
  }), SCENE_CFG);
}

// ① learn: each CCW scenario gets its OWN illustration, because the three are
// mechanically different cloning problems — not one figure with the caption swapped.
//   grace      → the population panel figure of the source supplement (Tsai et al,
//                Br J Psychiatry 2024, Suppl Fig 1): cohort → clone into two arms →
//                censor deviators → weight survivors.
//   earlylate  → individual swimmer lanes with an early/late cutoff τ; a clone is
//                censored when its actual initiation time conflicts with its arm.
//   sustained  → treatment on/off bars over follow-up; a clone is censored the moment
//                its on/off status deviates from its assigned strategy.
const CCW_RING = "#2e8b6f", CCW_CENS = "#cbd5e1", CCW_PILL = "#b45309";
function drawSceneCcw() {
  if (!document.getElementById("ccwScene")) return;
  const sc = ccwState.scenario;
  if (sc === "earlylate") return drawCcwEarlyLate();
  if (sc === "sustained") return drawCcwSustained();
  return drawCcwGraceSwim();
}
const CCW_ON = TEAL, CCW_ARM1 = "#5b7aa8", CCW_CUT = "#b45309";

// shared helpers for the swimmer-style scenes
function ccwLane(shapes, x0, x1, y, color, solid, w) {
  shapes.push({ type: "line", x0, x1, y0: y, y1: y, line: { color, width: w || 4.5, dash: solid ? "solid" : "dot" }, opacity: solid ? 1 : 0.35 });
}
function ccwCensorMark(x, y) { return { x, y, sym: "x-thin-open" }; }

// ---- GRACE: a clone swimmer where IPCW up-weighting happens AT each censoring ----
// Each person is cloned into the "initiate within grace" arm and the "defer" arm. The
// moment a clone deviates it is censored (✂); at that SAME instant the still-uncensored
// clones in that arm are up-weighted (their lanes thicken + ×w↑), because IPCW is the
// inverse probability of remaining uncensored — recomputed continuously over time.
function drawCcwGraceSwim() {
  const A = CCW_ON, B = CCW_ARM1, RING = CCW_RING, g = 3, XMAX = 12;
  const shapes = [
    { type: "rect", x0: 0, x1: g, y0: 0.4, y1: 5.4, fillcolor: "rgba(245,158,11,.10)", line: { width: 0 } },
    { type: "line", x0: g, x1: g, y0: 0.4, y1: 5.4, line: { color: CCW_CUT, width: 1.4, dash: "dot" } },
  ];
  const evX = [], evY = [], pillX = [], pillY = [], censX = [], censY = [];
  // within-grace arm (top), defer arm (bottom). 3 clones each.
  // within-grace: A1 init@1 (ok), A2 init@2 (ok), A3 never inits → censored at g
  ccwLane(shapes, 0, XMAX, 4.8, A, true); pillX.push(1); pillY.push(4.8); evX.push(9); evY.push(4.8);
  ccwLane(shapes, 0, XMAX, 4.3, A, true); pillX.push(2); pillY.push(4.3);
  ccwLane(shapes, 0, g, 3.8, A, true); ccwLane(shapes, g, XMAX, 3.8, A, false); censX.push(g); censY.push(3.8);
  // after A3 is censored at g, the two survivors get up-weighted → thicken from g onward
  ccwLane(shapes, g, XMAX, 4.8, A, true, 8); ccwLane(shapes, g, XMAX, 4.3, A, true, 8);
  // defer arm: B1 defers (ok), B3 defers→event, B2 inits@2 during grace → censored at 2
  ccwLane(shapes, 0, XMAX, 2.0, B, true);
  ccwLane(shapes, 0, XMAX, 1.5, B, true); evX.push(7); evY.push(1.5);
  ccwLane(shapes, 0, 2, 1.0, B, true); ccwLane(shapes, 2, XMAX, 1.0, B, false); pillX.push(2); pillY.push(1.0); censX.push(2); censY.push(1.0);
  ccwLane(shapes, 2, XMAX, 2.0, B, true, 8); ccwLane(shapes, 2, XMAX, 1.5, B, true, 8);
  const traces = [
    { x: pillX, y: pillY, mode: "markers", type: "scatter", name: tr("起始用藥", "treatment start"), marker: { color: CCW_CUT, size: 12, symbol: "square" } },
    { x: evX, y: evY, mode: "markers", type: "scatter", name: tr("● 事件", "● event"), marker: { color: RED, size: 13 } },
    { x: censX, y: censY, mode: "markers", type: "scatter", name: tr("偏離策略 → 設限 ✂", "deviated → censored ✂"), marker: { color: "#64748b", size: 15, symbol: "x-thin-open", line: { width: 3 } } },
    { x: [null], y: [null], mode: "markers", type: "scatter", name: tr("設限後存活者被加權（粗線＝×w↑）", "survivors up-weighted after censoring (thick = ×w↑)"), marker: { color: RING, size: 12, symbol: "line-ew", line: { width: 4 } } },
  ];
  const anns = [
    Object.assign(_lbl(g, 5.55, tr("寬限期結束 g", "end of grace g"), CCW_CUT, 9.5), { xanchor: "center" }),
    Object.assign(_lbl(-0.1, 4.3, tr("寬限期內起始臂", "within-grace arm"), A, 9), { xanchor: "right" }),
    Object.assign(_lbl(-0.1, 1.5, tr("延後起始臂", "defer arm"), B, 9), { xanchor: "right" }),
    // the key callouts: censoring → IPCW up-weight at the SAME instant
    Object.assign(_lbl(g + 0.15, 4.05, tr("✂ 設限 → 同一刻把存活者 ×1.5", "✂ censor → up-weight survivors ×1.5 right now"), RING, 9), { xanchor: "left" }),
    Object.assign(_lbl(2 + 0.15, 0.75, tr("✂ 設限 → 同一刻把存活者 ×1.5", "✂ censor → up-weight survivors ×1.5 right now"), RING, 9), { xanchor: "left" }),
    Object.assign(_lbl(7.5, 4.55, "×1.5", RING, 10), { xanchor: "center" }),
    Object.assign(_lbl(7.5, 1.75, "×1.5", RING, 10), { xanchor: "center" }),
    _lbl(6, -0.35, tr(
      "每個人在診斷日複製到兩臂。寬限期內：「寬限期內起始」臂在沒能於 g 前起始時設限(✂)；「延後起始」臂在窗內就起始時設限(✂)。關鍵：<b>設限的那一刻，當下仍未被設限的分身就被放大權重（IPCW＝1∕未被設限機率，線變粗、×w↑）</b>，補回被設限流失的資訊，設限與加權是同一刻、沿時間持續發生。",
      "Each person is cloned into both arms at diagnosis. During grace, the within-grace arm is censored (✂) if it fails to initiate by g; the defer arm if it initiates inside the window. Key: <b>at the instant of censoring, the clones still uncensored are up-weighted (IPCW = 1∕probability-uncensored; lanes thicken, ×w↑)</b> to recover the lost information — censoring and weighting happen at the same moment, continuously over time."), INK, 9.5),
  ];
  Plotly.react("ccwScene", traces, schemaLayout({
    height: 340, shapes, annotations: anns, showlegend: true, legend: { orientation: "h", y: 1.14 },
    xaxis: { visible: true, title: tr("診斷後月份", "months since diagnosis"), range: [0, XMAX], fixedrange: true, dtick: 2 },
    yaxis: { visible: false, range: [-0.7, 5.8] },
    margin: { t: 30, r: 14, b: 38, l: 92 },
  }), SCENE_CFG);
}

// ---- EARLY vs LATE: both arms eventually treat; the early/late cutoff τ decides which
// clone is compatible. Survivors up-weighted (×w↑, thicker) after each ✂. ----
function drawCcwEarlyLate() {
  const A = CCW_ON, B = CCW_ARM1, RING = CCW_RING, TAU = 3, XMAX = 12;
  const shapes = [
    { type: "rect", x0: 0, x1: TAU, y0: 0.4, y1: 5.4, fillcolor: "rgba(63,130,104,.07)", line: { width: 0 } },
    { type: "line", x0: TAU, x1: TAU, y0: 0.4, y1: 5.4, line: { color: CCW_CUT, width: 1.4, dash: "dot" } },
  ];
  const pillX = [], pillY = [], censX = [], censY = [], evX = [], evY = [];
  // early arm (top): compatible if initiate ≤ τ. A1 init@1 ok→event; A2 init@2 ok; A3 inits@6 (too late)→censored at τ
  ccwLane(shapes, 0, XMAX, 4.8, A, true); pillX.push(1); pillY.push(4.8); evX.push(10); evY.push(4.8);
  ccwLane(shapes, 0, XMAX, 4.3, A, true); pillX.push(2); pillY.push(4.3);
  ccwLane(shapes, 0, TAU, 3.8, A, true); ccwLane(shapes, TAU, XMAX, 3.8, A, false); censX.push(TAU); censY.push(3.8);
  ccwLane(shapes, TAU, XMAX, 4.8, A, true, 8); ccwLane(shapes, TAU, XMAX, 4.3, A, true, 8);
  // late arm (bottom): compatible if initiate > τ. B1 inits@6 ok; B3 inits@8 ok→event; B2 inits@2 (too early)→censored at 2
  ccwLane(shapes, 0, XMAX, 2.0, B, true); pillX.push(6); pillY.push(2.0);
  ccwLane(shapes, 0, XMAX, 1.5, B, true); pillX.push(8); pillY.push(1.5); evX.push(11); evY.push(1.5);
  ccwLane(shapes, 0, 2, 1.0, B, true); ccwLane(shapes, 2, XMAX, 1.0, B, false); pillX.push(2); pillY.push(1.0); censX.push(2); censY.push(1.0);
  ccwLane(shapes, 2, XMAX, 2.0, B, true, 8); ccwLane(shapes, 2, XMAX, 1.5, B, true, 8);
  const traces = [
    { x: pillX, y: pillY, mode: "markers", type: "scatter", name: tr("實際起始用藥", "actual treatment start"), marker: { color: CCW_CUT, size: 12, symbol: "square" } },
    { x: evX, y: evY, mode: "markers", type: "scatter", name: tr("● 事件", "● event"), marker: { color: RED, size: 13 } },
    { x: censX, y: censY, mode: "markers", type: "scatter", name: tr("與指派臂衝突 → 設限 ✂", "conflicts with arm → censored ✂"), marker: { color: "#64748b", size: 15, symbol: "x-thin-open", line: { width: 3 } } },
    { x: [null], y: [null], mode: "markers", type: "scatter", name: tr("設限後存活者被加權（粗線＝×w↑）", "survivors up-weighted (thick = ×w↑)"), marker: { color: RING, size: 12, symbol: "line-ew", line: { width: 4 } } },
  ];
  const anns = [
    Object.assign(_lbl(TAU, 5.55, tr("早／晚分界 τ", "early/late cutoff τ"), CCW_CUT, 9.5), { xanchor: "center" }),
    Object.assign(_lbl(-0.1, 4.3, tr("早啟動臂", "early arm"), A, 9), { xanchor: "right" }),
    Object.assign(_lbl(-0.1, 1.5, tr("晚啟動臂", "late arm"), B, 9), { xanchor: "right" }),
    Object.assign(_lbl(TAU + 0.15, 4.05, tr("太晚才用藥 → 設限；存活者 ×w↑", "started too late → censor; survivors ×w↑"), RING, 9), { xanchor: "left" }),
    Object.assign(_lbl(2 + 0.15, 0.75, tr("太早就用藥 → 設限；存活者 ×w↑", "started too early → censor; survivors ×w↑"), RING, 9), { xanchor: "left" }),
    _lbl(6, -0.35, tr(
      "兩臂<b>最終都會用藥</b>，差別只在「早或晚」。每人複製成早臂、晚臂；實際起始時機與指派臂衝突時就設限(✂)，早臂在「太晚才起始」、晚臂在「太早就起始」。設限的同時，當下仍存活的分身被 IPCW 放大權重（線變粗、×w↑）。",
      "Both arms <b>eventually treat</b> — only the timing differs. Clone each person into an early and a late arm; censor (✂) the clone whose actual initiation conflicts with its arm — the early arm if it starts too late, the late arm if it starts too early. At each censoring, the surviving clones are IPC-weighted up (thicker lanes, ×w↑)."), INK, 9.5),
  ];
  Plotly.react("ccwScene", traces, schemaLayout({
    height: 340, shapes, annotations: anns, showlegend: true, legend: { orientation: "h", y: 1.14 },
    xaxis: { visible: true, title: tr("診斷後月份", "months since diagnosis"), range: [0, XMAX], fixedrange: true, dtick: 2 },
    yaxis: { visible: false, range: [-0.7, 5.8] },
    margin: { t: 30, r: 14, b: 38, l: 78 },
  }), SCENE_CFG);
}

// ---- SUSTAINED: time-varying on/off treatment; censor at status deviation; up-weight ----
function drawCcwSustained() {
  const ONc = TEAL, OFFc = "#d6dde6", B = CCW_ARM1, RING = CCW_RING, TAU = 4, XMAX = 12;
  const shapes = [];
  const bar = (x0, x1, y, c, op) => shapes.push({ type: "rect", x0, x1, y0: y - 0.18, y1: y + 0.18, fillcolor: c, line: { width: 0 }, opacity: op == null ? 1 : op });
  const censX = [], censY = [], evX = [], evY = [];
  // stay-on arm (top): censored at discontinuation. P1 never stops (ok→event); P2 stops@5 → censored
  bar(0, XMAX, 4.8, ONc); evX.push(10); evY.push(4.8);
  bar(0, 5, 4.3, ONc); bar(5, XMAX, 4.3, OFFc, 0.5); censX.push(5); censY.push(4.3);
  // stay-on survivor (P1) up-weighted after the ✂ at 5 → outline ring band
  shapes.push({ type: "rect", x0: 5, x1: XMAX, y0: 4.8 - 0.22, y1: 4.8 + 0.22, fillcolor: "rgba(0,0,0,0)", line: { color: RING, width: 2.5 } });
  // discontinue arm (bottom): must stop by τ. P3 stops@3 (ok); P4 never stops → censored at τ
  bar(0, 3, 2.0, ONc); bar(3, XMAX, 2.0, OFFc); evX.push(9); evY.push(2.0);
  bar(0, XMAX, 1.4, ONc, 0.85); censX.push(TAU); censY.push(1.4);
  shapes.push({ type: "rect", x0: 3, x1: XMAX, y0: 2.0 - 0.22, y1: 2.0 + 0.22, fillcolor: "rgba(0,0,0,0)", line: { color: RING, width: 2.5 } });
  const traces = [
    { x: evX, y: evY, mode: "markers", type: "scatter", name: tr("● 事件", "● event"), marker: { color: RED, size: 13 } },
    { x: censX, y: censY, mode: "markers", type: "scatter", name: tr("狀態偏離指派 → 設限 ✂", "status deviates → censored ✂"), marker: { color: "#64748b", size: 15, symbol: "x-thin-open", line: { width: 3 } } },
    { x: [null], y: [null], mode: "markers", type: "scatter", name: tr("用藥中 on", "on treatment"), marker: { color: ONc, size: 12, symbol: "square" } },
    { x: [null], y: [null], mode: "markers", type: "scatter", name: tr("已停藥 off", "off treatment"), marker: { color: OFFc, size: 12, symbol: "square" } },
    { x: [null], y: [null], mode: "markers", type: "scatter", name: tr("存活者被加權（綠框＝×w↑）", "survivors up-weighted (green outline = ×w↑)"), marker: { color: "#fff", size: 12, symbol: "square", line: { color: RING, width: 2.5 } } },
  ];
  const anns = [
    Object.assign(_lbl(TAU, 5.4, tr("應停藥期限 τ", "stop-by deadline τ"), CCW_CUT, 9), { xanchor: "center" }),
    { type: "line", x0: TAU, x1: TAU, y0: 0.6, y1: 5.0, line: { color: CCW_CUT, width: 1.2, dash: "dot" }, xref: "x", yref: "y" },
    Object.assign(_lbl(-0.2, 4.55, tr("持續用藥臂", "stay-on arm"), ONc, 9), { xanchor: "right" }),
    Object.assign(_lbl(-0.2, 1.7, tr("停藥臂", "discontinue arm"), B, 9), { xanchor: "right" }),
    Object.assign(_lbl(5.15, 4.0, tr("停藥當下 → 設限；存活者 ×w↑", "discontinues → censor; survivors ×w↑"), RING, 9), { xanchor: "left" }),
    Object.assign(_lbl(TAU + 0.15, 1.1, tr("沒如期停藥 → 設限", "didn't stop in time → censor"), RING, 9), { xanchor: "left" }),
    _lbl(6, -0.4, tr(
      "全員第 0 月起都在用藥，治療狀態<b>隨時間開／關</b>。每人複製成持續臂、停藥臂；狀態一偏離指派就設限(✂)，持續臂在「停藥當下」、停藥臂在「沒有如期停藥」。設限的同時，符合策略而存活的分身被 IPCW 放大權重（綠框＝×w↑）。",
      "Everyone is on treatment from month 0; status switches <b>on/off over time</b>. Clone each into a stay-on and a discontinue arm; censor (✂) the moment status deviates — the stay-on arm at discontinuation, the discontinue arm if it never stops. At each censoring, the still-compatible survivors are IPC-weighted up (green outline = ×w↑)."), INK, 9.5),
  ];
  // pull the τ line shape out of anns into shapes
  shapes.push(anns.splice(1, 1)[0]);
  Plotly.react("ccwScene", traces, schemaLayout({
    height: 340, shapes, annotations: anns, showlegend: true, legend: { orientation: "h", y: 1.14 },
    xaxis: { visible: true, title: tr("診斷後月份", "months since diagnosis"), range: [0, XMAX], fixedrange: true, dtick: 2 },
    yaxis: { visible: false, range: [-0.75, 5.7] },
    margin: { t: 30, r: 14, b: 38, l: 78 },
  }), SCENE_CFG);
}

function initCcwLearn() {
  if (ccwLearnReady) return;
  ccwLearnReady = true;
  drawSceneCcw();
}

// ---- ② interactive ----
const ccwTimingSlider = document.getElementById("ccwTimingSlider");
let ccwPlayTimer = null;
function initCcwPlay() {
  if (ccwPlayReady) return;
  ccwPlayReady = true;
  refreshCcwPlay();
}
function scheduleCcwPlay() {
  document.getElementById("ccwTimingVal").textContent = Number(ccwTimingSlider.value).toFixed(2);
  clearTimeout(ccwPlayTimer);
  ccwPlayTimer = setTimeout(refreshCcwPlay, 350);
}
if (ccwTimingSlider) ccwTimingSlider.addEventListener("input", scheduleCcwPlay);
// scenario selectors (①, ② and ③ kept in sync via ccwState.scenario)
function ccwSyncScenario(val, from) {
  ccwState.scenario = val;
  ["ccwScenario1", "ccwScenario", "ccwScenario3"].forEach((id) => {
    const s = document.getElementById(id);
    if (s && s.value !== val) s.value = val;
  });
}
const ccwScen1 = document.getElementById("ccwScenario1");
if (ccwScen1) ccwScen1.addEventListener("change", () => { ccwSyncScenario(ccwScen1.value); drawSceneCcw(); });
const ccwScen2 = document.getElementById("ccwScenario");
if (ccwScen2) ccwScen2.addEventListener("change", () => { ccwSyncScenario(ccwScen2.value); drawSceneCcw(); refreshCcwPlay(); });
const ccwScen3 = document.getElementById("ccwScenario3");
if (ccwScen3) ccwScen3.addEventListener("change", () => { ccwSyncScenario(ccwScen3.value); drawSceneCcw(); document.getElementById("useCcwExample").click(); });
async function refreshCcwPlay() {
  const te = ccwTimingSlider ? Number(ccwTimingSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/ccw_interactive?timing_effect=${te}&scenario=${ccwState.scenario}&lang=${lang()}`); }
  catch (e) { return; }
  state.ccwPlay = d;
  const set = (id, v, col) => { const el = document.getElementById(id); if (el) { el.textContent = fmt(v, 2); if (col) el.style.color = col; } };
  set("ccwEst", d.ccw, Math.abs(d.ccw - d.true_rd) < 0.06 ? TEAL : AMBER);
  set("ccwTruth", d.true_rd, GREEN);
  set("ccwNaiveEst", d.naive, RED);
  ccwCurveInto("ccwPlayChart", d.curve);
}

// ---- ③ analyze ----
function initCcwAnalyze() {
  if (ccwAnalyzeReady) return;
  ccwAnalyzeReady = true;
  document.getElementById("useCcwExample").click();
}
function ccwFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["ccwSelVacc", "ccwSelEvent", "ccwSelFu"].forEach((id) =>
    document.getElementById(id).innerHTML = opts);
  const cov = document.getElementById("ccwSelCov");
  if (cov) cov.innerHTML = opts;
  document.getElementById("ccwColMap").classList.remove("hidden");
}
function ccwApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null && el) el.value = v; };
  set("ccwSelVacc", d.vacc_time); set("ccwSelEvent", d.event); set("ccwSelFu", d.futime);
  const cov = document.getElementById("ccwSelCov");
  if (cov && d.covariates) [...cov.options].forEach((o) => { o.selected = d.covariates.includes(o.value); });
}
document.getElementById("useCcwExample").addEventListener("click", async () => {
  const st = document.getElementById("ccwDataStatus");
  try {
    const d = await getJSON(`${API}/api/ccw_example?scenario=${ccwState.scenario}`);
    ccwState.source = "example_ccw"; ccwState.columns = d.columns;
    st.textContent = tr(`已載入內建範例（${d.n} 人，合成虛構）`,
                        `Loaded built-in example (${d.n} people, synthetic)`);
    ccwFillSelects(d.columns); ccwApplyDefaults(d.defaults);
    runCcwAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("ccwFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("ccwDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    ccwState.source = d.token; ccwState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    ccwFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function ccwCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  const cov = [...document.getElementById("ccwSelCov").selectedOptions].map((o) => o.value);
  return { source: ccwState.source, vacc_time: v("ccwSelVacc"), event: v("ccwSelEvent"),
    futime: v("ccwSelFu"), covariates: cov.length ? cov : ["age", "frailty"],
    scenario: ccwState.scenario, lang: lang() };
}
const runCcwBtn = document.getElementById("runCcwAnalyze");
if (runCcwBtn) runCcwBtn.addEventListener("click", runCcwAnalyze);
async function runCcwAnalyze() {
  const req = ccwCurrentMapping();
  if (!req.source) return;
  ccwState.req = req;
  try {
    const a = await postJSON(`${API}/api/ccw_analyze`, req);
    renderCcwAnalyze(a);
    // dashboard (④) is computed lazily when that tab opens (each full_ccw is ~3s under
    // Pyodide). Invalidate it so a scenario change re-computes ④ with the new scenario.
    state.ccwDash = null;
    ccwAssumeReady = false;
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderCcwAnalyze(a) {
  document.getElementById("ccwAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("CCW（因果風險差）", "CCW (causal risk difference)"), a.ccw, a.interpretation, true],
    [tr("未校正比較（immortal-time 偏誤）", "Naive contrast (immortal-time bias)"), a.naive,
      tr("照實際早／晚分組直接比，被 immortal-time 與混淆扭曲。", "Comparing realized early/late groups — distorted by immortal time and confounding."), false],
    [tr("真值（估計目標）", "Truth (the estimand target)"), a.true_rd,
      tr("CCW 應該還原的風險差（負值＝早接種較保護）。", "The risk difference CCW should recover (negative = early is protective)."), false],
  ];
  document.getElementById("ccwAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${v >= 0 ? "+" : ""}${fmt(v, 2)}</div><p>${desc}</p></div>`
  ).join("");
  ccwCurveInto("ccwAnalyzeChart", a.curve);
}

// ④ schematic — WHY CCW only removes BASELINE confounding by indication.
// Left: L₀ measured at t=0 → cloning + baseline IPCW close the back door (✓).
// Right: Lₜ emerges after baseline (during the grace period) → baseline weights are
// blind to it, so the back door stays open (✗ — needs time-varying IPCW).
// (Maringe et al. 2020; Gaber et al. 2024)
function drawCcwBaseline(elId) {
  elId = elId || "ccwBaselineScene";
  if (!document.getElementById(elId)) return;
  // nodes spread WIDE to fill each box (no grey dead-space on the sides), bigger markers
  const N = [
    { id: "L₀", x: 2.5, y: 3.35, c: GREEN,  up: 1, lab: { zh: "基線混淆 L₀（t=0 就量到）", en: "baseline L₀ (seen at t=0)" } },
    { id: "A",  x: 0.95, y: 1.35, c: SLATE,        lab: { zh: "策略臂（早/晚）", en: "strategy arm" } },
    { id: "Y",  x: 4.05, y: 1.35, c: PURPLE,       lab: { zh: "結果 Y", en: "outcome Y" } },
    { id: "Lₜ", x: 7.5, y: 3.35, c: AMBER,  up: 1, lab: { zh: "時變混淆 Lₜ（寬限期內才出現）", en: "time-varying Lₜ (appears in grace)" } },
    { id: "Aₜ", x: 5.95, y: 1.35, c: SLATE,        lab: { zh: "窗內是否接種 Aₜ", en: "initiate in window Aₜ" } },
    { id: "Y₂", x: 9.05, y: 1.35, c: PURPLE, disp: "Y", lab: { zh: "結果 Y", en: "outcome Y" } },
  ];
  const pos = {}; N.forEach((n) => (pos[n.id] = [n.x, n.y]));
  const L = (o) => (lang() === "en" ? o.en : o.zh);
  const arrow = (a, b, color, w, faded) => ({ x: pos[b][0], y: pos[b][1], ax: pos[a][0], ay: pos[a][1],
    xref: "x", yref: "y", axref: "x", ayref: "y", showarrow: true, arrowhead: 3, arrowsize: 1.1,
    arrowwidth: w, arrowcolor: color, standoff: 26, startstandoff: 26, text: "", opacity: faded ? 0.55 : 1 });
  const shapes = [
    { type: "rect", x0: 0.15, x1: 4.85, y0: 0.5, y1: 4.0, fillcolor: "rgba(46,139,111,.08)", line: { color: "rgba(46,139,111,.40)", width: 1, dash: "dot" }, layer: "below" },
    { type: "rect", x0: 5.15, x1: 9.85, y0: 0.5, y1: 4.0, fillcolor: "rgba(220,38,38,.06)", line: { color: "rgba(220,38,38,.35)", width: 1, dash: "dot" }, layer: "below" },
  ];
  const anns = [
    arrow("L₀", "A", "#94a3b8", 2.0, true), arrow("L₀", "Y", "#94a3b8", 2.0, true), arrow("A", "Y", TEAL, 2.8, false),
    arrow("Lₜ", "Aₜ", RED, 2.8, false), arrow("Lₜ", "Y₂", RED, 2.8, false), arrow("Aₜ", "Y₂", TEAL, 2.8, false),
  ];
  anns.push(Object.assign(_lbl(2.5, 4.32, L({ zh: "基線適應症混淆 → 處理得到 ✓", en: "baseline confounding → removed ✓" }), "#1d6f57", 12.5), { xanchor: "center" }));
  anns.push(Object.assign(_lbl(7.5, 4.32, L({ zh: "寬限期之後的時變混淆 → 處理不到 ✗", en: "post-grace time-varying → not removed ✗" }), "#b91c1c", 12.5), { xanchor: "center" }));
  anns.push(Object.assign(_lbl(2.5, 2.45, L({ zh: "複製＋baseline IPCW：後門關上", en: "clone + baseline IPCW: door closed" }), "#1d6f57", 10), { xanchor: "center" }));
  anns.push(Object.assign(_lbl(7.5, 2.45, L({ zh: "baseline 權重看不到 Lₜ：後門仍開", en: "baseline weights blind to Lₜ: door open" }), "#b91c1c", 10), { xanchor: "center" }));
  N.forEach((n) => anns.push(Object.assign(_lbl(n.x, n.up ? n.y + 0.5 : n.y - 0.5, L(n.lab), INK, 9.5), { xanchor: "center" })));
  anns.push(Object.assign(_lbl(5, 0.12, L({ zh: "灰虛線＝被擋住的後門；紅實線＝仍打開的後門。要關掉右邊，得把 Lₜ 放進「時變 IPCW」（Maringe 2020；Gaber 2024）。", en: "grey dashed = blocked back door; red = still-open back door. Closing the right one needs Lₜ in a time-varying IPCW (Maringe 2020; Gaber 2024)." }), INK, 10),
    { width: 760, align: "center", xanchor: "center", yanchor: "top" }));
  const traces = [{ x: N.map((n) => n.x), y: N.map((n) => n.y), mode: "markers+text", type: "scatter",
    text: N.map((n) => n.disp || n.id), textposition: "middle center", textfont: { color: "#fff", size: 14 },
    marker: { color: N.map((n) => n.c), size: 42, line: { color: "#fff", width: 1.5 } }, hoverinfo: "none", showlegend: false }];
  Plotly.react(elId, traces, schemaLayout({
    height: 420, shapes, annotations: anns, showlegend: false,
    xaxis: { visible: false, range: [0, 10], fixedrange: true },
    yaxis: { visible: false, range: [-0.55, 4.7] },
    margin: { t: 10, r: 8, b: 8, l: 8 },
  }), SCENE_CFG);
}

// ---- ④ assumptions ----
function initCcwAssume() {
  if (ccwAssumeReady) return;
  ccwAssumeReady = true;
  drawCcwBaseline();   // baseline-vs-time-varying confounding schematic (static teaching)
  if (state.ccwDash) { renderCcwAssumptions(state.ccwDash); return; }   // reuse if already computed
  runCcwAssumptions(ccwState.req || { source: "example_ccw", lang: lang() });
}
async function runCcwAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_ccw", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/ccw_assumptions`, body); } catch (e) { return; }
  state.ccwDash = out;
  renderCcwAssumptions(out);
}
function renderCcwAssumptions(out) {
  const hint = document.getElementById("ccwAssumeHint");
  if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("ccwOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；關鍵假設仍需領域判斷。", "Testable checks pass; the key assumptions still need domain judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，CCW 結果要保守看待。", "Some items fail — interpret the CCW with caution."),
    info: tr("CCW 多數核心假設不可檢驗，需靠領域知識與設計。", "Most core CCW assumptions are untestable — rely on domain knowledge and design."),
  }[worst];
  ov.classList.remove("hidden");
  ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("ccwAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) =>
      `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}">
      <h3><span class="dot bg-${c.status}"></span>${c.title}
        <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p>
      <p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details>
    </div>`;
  }).join("");
}

// ---- ⑤ grace-period sensitivity (button-triggered; ~1.7s) ----
function initCcwMl() { /* concept cards are static HTML; the grace demo is button-triggered */ }
const runCcwGraceBtn = document.getElementById("runCcwGrace");
if (runCcwGraceBtn) {
  runCcwGraceBtn.addEventListener("click", async () => {
    runCcwGraceBtn.disabled = true;
    await refreshCcwGrace();
    runCcwGraceBtn.textContent = tr("重新顯示寬限期敏感度", "Re-show grace-period sensitivity");
    runCcwGraceBtn.disabled = false;
  });
}
async function refreshCcwGrace() {
  let s;
  try { s = await getJSON(`${API}/api/ccw_grace?scenario=${ccwState.scenario}&lang=${lang()}`); } catch (e) { return; }
  state.ccwGrace = s;
  document.getElementById("ccwGraceOut").classList.remove("hidden");
  drawCcwGrace(s);
  document.getElementById("ccwGraceReading").innerHTML = s.reading;
}
function drawCcwGrace(s) {
  if (!document.getElementById("ccwGraceChart")) return;
  Plotly.react("ccwGraceChart", [
    { x: s.graces, y: s.ccw, mode: "lines+markers", type: "scatter", line: { color: TEAL, width: 3 },
      marker: { size: 7 }, name: tr("CCW（複製-設限-加權）", "CCW") },
    { x: s.graces, y: s.naive, mode: "lines+markers", type: "scatter", line: { color: AMBER, width: 3 },
      marker: { size: 7 }, name: tr("未校正（immortal-time）", "naive (immortal time)") },
  ], sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.16 }, margin: { t: 28, r: 18, b: 42, l: 54 },
    xaxis: { title: tr("寬限期 g（月）", "grace period g (months)"), dtick: 1 },
    yaxis: { title: tr("風險差（早 − 晚）", "risk difference (early − late)") },
    shapes: [{ type: "line", x0: s.graces[0], x1: s.graces[s.graces.length - 1], y0: s.truth_ref, y1: s.truth_ref,
               line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: s.graces[s.graces.length - 1], y: s.truth_ref, text: tr("真值（g=3）", "truth (g=3)"),
               showarrow: false, font: { color: GREEN, size: 11 }, yshift: 11, xanchor: "right" }],
  }), SCENE_CFG);
}

// ======================================================================
// CCO / CCTC (case-crossover & case-(case-)time-control) — tabs ①–⑤
// ======================================================================
const cctcState = { source: null, columns: [], req: null };
let cctcLearnReady = false, cctcPlayReady = false, cctcAnalyzeReady = false,
    cctcAssumeReady = false, cctcMlReady = false;

// exposure-prevalence trend curve
function cctcCurveInto(elId, curve) {
  if (!document.getElementById(elId) || !curve) return;
  Plotly.react(elId, [{
    x: curve.months, y: curve.prev, mode: "lines+markers", type: "scatter",
    line: { color: AMBER, width: 3 }, marker: { size: 5 }, name: tr("暴露盛行率", "exposure prevalence"),
  }], sceneLayout({
    height: 280, showlegend: false, margin: { t: 24, r: 18, b: 42, l: 54 },
    xaxis: { title: tr("日曆月", "calendar month"), dtick: 4 },
    yaxis: { title: tr("暴露盛行率", "exposure prevalence"), tickformat: ".0%", range: [0, 1] },
  }), SCENE_CFG);
}

// ① learn: the case-case-time-control design figure as drawn in the source paper
// (Tsai et al, BMJ 2023, anticholinergics & cardiovascular events): a Current-cases
// row and a Future-cases row, each spanning 180 days before the index date and split
// into four reference windows (one randomly selected), a washout window, and the
// hazard window just before the index date. Future cases carry the calendar trend in
// drug use that the control-crossover analysis removes.
function drawSceneCctc() {
  if (!document.getElementById("cctcScene")) return;
  const LAV = "#cdc7ec", LAVF = "rgba(205,199,236,.6)", HAZF = "#5b4ea0", IDX = "#5b4ea0";
  const yCur = 2.55, yFut = 1.05, h = 0.30;     // row centres, half-height
  // helper: build the window blocks for one row (days are negative, index at 0)
  function rowShapes(yc) {
    const s = [];
    // four 30-day reference windows: −180…−60 (lavender, with internal dividers)
    s.push({ type: "rect", x0: -180, x1: -60, y0: yc - h, y1: yc + h, fillcolor: LAVF, line: { color: LAV, width: 1 } });
    [-150, -120, -90].forEach((d) => s.push({ type: "line", x0: d, x1: d, y0: yc - h, y1: yc + h, line: { color: "#fff", width: 1.5 } }));
    // washout window: −60…−30 (white / unshaded)
    s.push({ type: "rect", x0: -60, x1: -30, y0: yc - h, y1: yc + h, fillcolor: "#ffffff", line: { color: "#b9c2cf", width: 1 } });
    // hazard window: −30…−1 (dark purple)
    s.push({ type: "rect", x0: -30, x1: -1, y0: yc - h, y1: yc + h, fillcolor: HAZF, line: { color: HAZF, width: 1 } });
    return s;
  }
  const shapes = rowShapes(yCur).concat(rowShapes(yFut));
  // index-date line (current case event date) + future-case continuation with a break
  shapes.push({ type: "line", x0: 0, x1: 0, y0: 0.55, y1: 3.15, line: { color: IDX, width: 1.5, dash: "dot" } });
  shapes.push({ type: "line", x0: 0, x1: 26, y0: yFut, y1: yFut, line: { color: "#b9c2cf", width: 1.5, dash: "dot" } });
  const traces = [
    { x: [0], y: [yCur], mode: "markers", type: "scatter", name: tr("↓ 當前案例事件日（指標日）", "↓ current case event date (index)"),
      marker: { color: IDX, size: 12, symbol: "triangle-down" } },
    { x: [40], y: [yFut], mode: "markers", type: "scatter", name: tr("↓ 未來案例事件日", "↓ future case event date"),
      marker: { color: "#8b8bbf", size: 12, symbol: "triangle-down" } },
  ];
  const anns = [
    // window labels above the current-cases row
    Object.assign(_lbl(-120, 3.18, tr("參考窗 ×4（隨機選一）", "reference windows ×4 (1 randomly selected)"), "#6a5fae", 10), { xanchor: "center" }),
    Object.assign(_lbl(-45, 3.18, tr("清除窗", "washout"), SLATE, 9.5), { xanchor: "center" }),
    Object.assign(_lbl(-15.5, 3.18, tr("危險窗", "hazard"), HAZF, 10), { xanchor: "center" }),
    Object.assign(_lbl(2, 3.0, tr("指標日", "index date"), IDX, 9.5), { xanchor: "left" }),
    // row labels
    Object.assign(_lbl(-192, yCur, tr("當前案例", "current cases"), INK, 10), { xanchor: "left" }),
    Object.assign(_lbl(-192, yFut, tr("未來案例", "future cases"), SLATE, 10), { xanchor: "left" }),
    Object.assign(_lbl(40, yFut + 0.42, tr("事件較晚", "event later"), "#8b8bbf", 9), { xanchor: "center" }),
    Object.assign(_lbl(13, yFut + 0.18, "//", "#b9c2cf", 11), { xanchor: "center" }),
    // captions
    _lbl(-70, 0.28, tr(
      "案例交叉：在「當前案例」內比危險窗 vs 參考窗的暴露；藥物使用隨日曆時間有趨勢 → 案例交叉被高估。",
      "Case-crossover: within current cases, compare exposure in the hazard vs reference window; drug use trends over calendar time → case-crossover is inflated."), INK, 9.5),
    _lbl(-70, -0.12, tr(
      "控制交叉：用「未來案例」（事件較晚、配對年齡性別）量出同樣的時間趨勢；CCTC＝案例交叉 OR ÷ 控制交叉 OR，把趨勢除掉。",
      "Control-crossover: future cases (event later, matched on age/sex) measure the same time trend; CCTC = case-crossover OR ÷ control-crossover OR, dividing out the trend."), INK, 9.5),
  ];
  Plotly.react("cctcScene", traces, schemaLayout({
    height: 310, shapes, annotations: anns, showlegend: true, legend: { orientation: "h", y: 1.17 },
    xaxis: { visible: true, title: tr("指標日前天數", "days before index date"), range: [-200, 52], fixedrange: true,
      tickmode: "array", tickvals: [-180, -150, -120, -90, -60, -30, 0], ticktext: ["−180", "−150", "−120", "−90", "−60", "−30", "0"] },
    yaxis: { visible: false, range: [-0.35, 3.45] },
    margin: { t: 30, r: 16, b: 38, l: 16 },
  }), SCENE_CFG);
}
function initCctcLearn() { if (cctcLearnReady) return; cctcLearnReady = true; drawSceneCctc(); }

// ② interactive — exposure-trend slider
const cctcTrendSlider = document.getElementById("cctcTrendSlider");
let cctcPlayTimer = null;
function initCctcPlay() { if (cctcPlayReady) return; cctcPlayReady = true; refreshCctcPlay(); }
function scheduleCctcPlay() {
  document.getElementById("cctcTrendVal").textContent = Number(cctcTrendSlider.value).toFixed(1);
  clearTimeout(cctcPlayTimer); cctcPlayTimer = setTimeout(refreshCctcPlay, 300);
}
if (cctcTrendSlider) cctcTrendSlider.addEventListener("input", scheduleCctcPlay);
async function refreshCctcPlay() {
  const trd = cctcTrendSlider ? Number(cctcTrendSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/cctc_interactive?trend=${trd}&lang=${lang()}`); } catch (e) { return; }
  state.cctcPlay = d;
  const set = (id, v, col) => { const el = document.getElementById(id); if (el) { el.textContent = fmt(v, 2); if (col) el.style.color = col; } };
  set("cctcCco", d.or_cco, Math.abs(d.or_cco - d.true_or) < 0.7 ? TEAL : RED);
  set("cctcCctc", d.or_cctc, Math.abs(d.or_cctc - d.true_or) < 0.7 ? TEAL : AMBER);
  set("cctcTrendOr", d.or_trend, INK);
  cctcCurveInto("cctcPlayChart", d.exposure_curve);
}

// ③ analyze
function initCctcAnalyze() { if (cctcAnalyzeReady) return; cctcAnalyzeReady = true; document.getElementById("useCctcExample").click(); }
function cctcFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["cctcSelGroup", "cctcSelXh", "cctcSelXr", "cctcSelCal"].forEach((id) => document.getElementById(id).innerHTML = opts);
  document.getElementById("cctcColMap").classList.remove("hidden");
}
function cctcApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null && el) el.value = v; };
  set("cctcSelGroup", d.group); set("cctcSelXh", d.x_hazard); set("cctcSelXr", d.x_ref); set("cctcSelCal", d.cal_time);
}
document.getElementById("useCctcExample").addEventListener("click", async () => {
  const st = document.getElementById("cctcDataStatus");
  try {
    const d = await getJSON(`${API}/api/cctc_example`);
    cctcState.source = "example_cctc"; cctcState.columns = d.columns;
    st.textContent = tr(`已載入內建急性事件範例（${d.n} 列，合成虛構）`, `Loaded built-in acute-event example (${d.n} rows, synthetic)`);
    cctcFillSelects(d.columns); cctcApplyDefaults(d.defaults);
    runCctcAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("cctcFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("cctcDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    cctcState.source = d.token; cctcState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    cctcFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function cctcCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return { source: cctcState.source, group: v("cctcSelGroup"), x_hazard: v("cctcSelXh"),
    x_ref: v("cctcSelXr"), cal_time: v("cctcSelCal"), lang: lang() };
}
const runCctcBtn = document.getElementById("runCctcAnalyze");
if (runCctcBtn) runCctcBtn.addEventListener("click", runCctcAnalyze);
async function runCctcAnalyze() {
  const req = cctcCurrentMapping();
  if (!req.source) return;
  cctcState.req = req;
  try {
    const a = await postJSON(`${API}/api/cctc_analyze`, req);
    renderCctcAnalyze(a);
    runCctcAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderCctcAnalyze(a) {
  document.getElementById("cctcAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("CCTC（扣趨勢，因果 OR）", "CCTC (trend-adjusted, causal OR)"), a.or_cctc, a.interpretation, true],
    [tr("案例交叉 CCO（被趨勢吹大）", "Case-crossover CCO (trend-inflated)"), a.or_cco,
      tr(`95% CI ${fmt(a.ci_cco[0], 2)}～${fmt(a.ci_cco[1], 2)}`, `95% CI ${fmt(a.ci_cco[0], 2)}–${fmt(a.ci_cco[1], 2)}`), false],
    [tr("純趨勢 OR（對照）", "Pure-trend OR (controls)"), a.or_trend,
      tr("偏離 1＝時間趨勢的強度＝CCO 的偏誤來源。", "distance from 1 = trend strength = source of CCO's bias."), false],
  ];
  document.getElementById("cctcAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}</div><p>${desc}</p></div>`
  ).join("");
  cctcCurveInto("cctcAnalyzeChart", a.exposure_curve);
}

// ④ assumptions
function initCctcAssume() {
  if (cctcAssumeReady) return;
  cctcAssumeReady = true;
  runCctcAssumptions(cctcState.req || { source: "example_cctc", lang: lang() });
}
async function runCctcAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_cctc", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/cctc_assumptions`, body); } catch (e) { return; }
  state.cctcDash = out;
  renderCctcAssumptions(out);
}
function renderCctcAssumptions(out) {
  const hint = document.getElementById("cctcAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("cctcOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；關鍵假設仍需領域判斷。", "Testable checks pass; key assumptions need domain judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設不可檢驗，需靠領域知識與設計。", "Most core assumptions are untestable — rely on domain knowledge and design."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("cctcAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ⑤ refinement demo
function initCctcMl() { /* concept cards static; demo button-triggered */ }
const runCctcDemoBtn = document.getElementById("runCctcDemo");
if (runCctcDemoBtn) runCctcDemoBtn.addEventListener("click", refreshCctcDemo);
async function refreshCctcDemo() {
  let s;
  try { s = await getJSON(`${API}/api/cctc_demo?lang=${lang()}`); } catch (e) { return; }
  state.cctcDemo = s;
  document.getElementById("cctcDemoOut").classList.remove("hidden");
  drawCctcDemo(s);
  document.getElementById("cctcDemoReading").innerHTML = s.reading;
}
function drawCctcDemo(s) {
  if (!document.getElementById("cctcDemoChart")) return;
  const labels = [tr("CCO（純案例交叉）", "CCO (plain)"), tr("CTC（對照扣趨勢）", "CTC (control-adjusted)"),
                  tr("CCTC（未來 case 扣趨勢）", "CCTC (future-case)")];
  const vals = [s.cco, s.ctc, s.casecase];
  Plotly.react("cctcDemoChart", [{
    x: labels, y: vals, type: "bar",
    marker: { color: [RED, TEAL, TEAL] }, text: vals.map((v) => v.toFixed(2) + "×"), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 28, r: 18, b: 56, l: 50 },
    yaxis: { title: tr("勝算比", "odds ratio"), range: [0, Math.max(...vals) * 1.2] },
    shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: s.true_or, y1: s.true_or, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: 2.5, y: s.true_or, text: tr("真值 " + s.true_or, "truth " + s.true_or), showarrow: false, yshift: 11, xanchor: "right", font: { color: GREEN, size: 11 } }],
  }), SCENE_CFG);
}

// ======================================================================
// Case-control (病例對照) — tabs ①–⑤
// ======================================================================
const ccState = { source: null, columns: [], req: null };
let ccLearnReady = false, ccPlayReady = false, ccAnalyzeReady = false,
    ccAssumeReady = false, ccMlReady = false, ccForestCache = null;

// ① learn: a schematic — start from the outcome (cases vs controls at "now"), then
// look BACK at past exposure. Cases (red) carry the outcome; the odds ratio compares
// past-exposure odds. Age (a confounder) drives both exposure and outcome.
function drawSceneCc() {
  if (!document.getElementById("ccScene")) return;
  const yCa = 2.35, yCo = 1.0, NOW = 9.6;
  const shapes = [
    { type: "line", x0: NOW, x1: NOW, y0: 0.4, y1: 3.0, line: { color: INK, width: 1.5, dash: "dot" } },
    // look-back arrows
    { type: "line", x0: 8.8, x1: 3.4, y0: yCa, y1: yCa, line: { color: "#b9c2cf", width: 1.4, dash: "dot" } },
    { type: "line", x0: 8.8, x1: 3.4, y0: yCo, y1: yCo, line: { color: "#b9c2cf", width: 1.4, dash: "dot" } },
  ];
  // outcome groups at "now"
  const caO = { x: [], y: [] }, coO = { x: [], y: [] }, exP = { x: [], y: [] };
  for (let k = 0; k < 6; k++) { caO.x.push(NOW + (k % 3) * 0.22 - 0.22); caO.y.push(yCa + (k < 3 ? 0.16 : -0.16)); }
  for (let k = 0; k < 6; k++) { coO.x.push(NOW + (k % 3) * 0.22 - 0.22); coO.y.push(yCo + (k < 3 ? 0.16 : -0.16)); }
  // past exposure pills: more exposed among cases (4) than controls (2)
  [[4.3, yCa], [4.9, yCa], [5.5, yCa], [4.6, yCa + 0.28]].forEach(([x, y]) => { exP.x.push(x); exP.y.push(y); });
  [[4.3, yCo], [4.9, yCo]].forEach(([x, y]) => { exP.x.push(x); exP.y.push(y); });
  const traces = [
    { x: caO.x, y: caO.y, mode: "markers", type: "scatter", name: tr("● 病例（有結果）", "● cases (with outcome)"), marker: { color: RED, size: 12 } },
    { x: coO.x, y: coO.y, mode: "markers", type: "scatter", name: tr("○ 對照（無結果）", "○ controls (no outcome)"), marker: { color: TEAL, size: 12, symbol: "circle-open", line: { width: 2.5 } } },
    { x: exP.x, y: exP.y, mode: "markers", type: "scatter", name: tr("過去的暴露", "past exposure"), marker: { color: "#b45309", size: 11, symbol: "square" } },
  ];
  const anns = [
    Object.assign(_lbl(3.0, 2.95, tr("過去（暴露）", "past (exposure)"), SLATE, 10), { xanchor: "left" }),
    Object.assign(_lbl(NOW, 2.95, tr("現在（結果）", "now (outcome)"), INK, 10), { xanchor: "center" }),
    Object.assign(_lbl(0.2, yCa, tr("病例", "cases"), RED, 10), { xanchor: "left" }),
    Object.assign(_lbl(0.2, yCo, tr("對照", "controls"), TEAL, 10), { xanchor: "left" }),
    Object.assign(_lbl(6.2, yCa + 0.45, tr("← 回頭比較過去的暴露", "← look back at past exposure"), "#64748b", 9.5), { xanchor: "center" }),
    _lbl(5.0, 0.18, tr(
      "勝算比 OR＝病例暴露勝算 ÷ 對照暴露勝算＝(a·d)/(b·c)。年齡同時影響暴露與結果（混淆）→ 未校正 OR 會偏，需校正／配對。",
      "Odds ratio OR = exposure odds in cases ÷ in controls = (a·d)/(b·c). Age drives both exposure and outcome (confounding) → the crude OR is biased; adjust / match."), INK, 9.5),
  ];
  Plotly.react("ccScene", traces, schemaLayout({
    height: 300, shapes, annotations: anns, showlegend: true, legend: { orientation: "h", y: 1.16 },
    xaxis: { visible: false, range: [0, 10.4], fixedrange: true },
    yaxis: { visible: false, range: [-0.1, 3.2] },
    margin: { t: 28, r: 14, b: 22, l: 14 },
  }), SCENE_CFG);
}
function initCcLearn() { if (ccLearnReady) return; ccLearnReady = true; drawSceneCc(); }

// ② interactive — confounding-strength slider
const ccConfSlider = document.getElementById("ccConfSlider");
let ccPlayTimer = null;
function initCcPlay() { if (ccPlayReady) return; ccPlayReady = true; refreshCcPlay(); }
function scheduleCcPlay() {
  document.getElementById("ccConfVal").textContent = Number(ccConfSlider.value).toFixed(2);
  clearTimeout(ccPlayTimer); ccPlayTimer = setTimeout(refreshCcPlay, 250);
}
if (ccConfSlider) ccConfSlider.addEventListener("input", scheduleCcPlay);
async function refreshCcPlay() {
  const cf = ccConfSlider ? Number(ccConfSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/cc_interactive?conf=${cf}&lang=${lang()}`); } catch (e) { return; }
  state.ccPlay = d;
  const set = (id, v, col) => { const el = document.getElementById(id); if (el) { el.textContent = fmt(v, 2); if (col) el.style.color = col; } };
  set("ccCrude", d.crude_or, Math.abs(d.crude_or - d.true_or) < 0.5 ? TEAL : RED);
  set("ccAdj", d.adj_or, Math.abs(d.adj_or - d.true_or) < 0.4 ? TEAL : AMBER);
  drawCcPlay(d);
}
function drawCcPlay(d) {
  if (!document.getElementById("ccPlayChart")) return;
  const g = d.grid;
  Plotly.react("ccPlayChart", [
    { x: g.conf, y: g.crude, mode: "lines+markers", type: "scatter", name: tr("未校正 OR", "crude OR"), line: { color: AMBER, width: 3 }, marker: { size: 5 } },
    { x: g.conf, y: g.adj, mode: "lines+markers", type: "scatter", name: tr("校正 OR", "adjusted OR"), line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: [d.conf], y: [d.crude_or], mode: "markers", type: "scatter", name: tr("目前", "current"), marker: { color: RED, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.16 }, margin: { t: 26, r: 18, b: 44, l: 50 },
    xaxis: { title: tr("混淆強度（年齡→暴露）", "confounding strength (age→exposure)") },
    yaxis: { title: tr("勝算比", "odds ratio"), range: [0, Math.max(...g.crude) * 1.12] },
    shapes: [{ type: "line", x0: g.conf[0], x1: g.conf[g.conf.length - 1], y0: g.true_or, y1: g.true_or, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: g.conf[g.conf.length - 1], y: g.true_or, text: tr("真值 " + g.true_or, "truth " + g.true_or), showarrow: false, yshift: 11, xanchor: "right", font: { color: GREEN, size: 11 } }],
  }), SCENE_CFG);
}

// ③ analyze
function initCcAnalyze() { if (ccAnalyzeReady) return; ccAnalyzeReady = true; document.getElementById("useCcExample").click(); }
function ccFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["ccSelCase", "ccSelExposed"].forEach((id) => document.getElementById(id).innerHTML = opts);
  document.getElementById("ccColMap").classList.remove("hidden");
}
function ccApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null && el) el.value = v; };
  set("ccSelCase", d.case); set("ccSelExposed", d.exposed);
}
document.getElementById("useCcExample").addEventListener("click", async () => {
  const st = document.getElementById("ccDataStatus");
  try {
    const d = await getJSON(`${API}/api/cc_example`);
    ccState.source = "example_cc"; ccState.columns = d.columns;
    st.textContent = tr(`已載入內建病例對照範例（${d.n} 列，合成虛構）`, `Loaded built-in case-control example (${d.n} rows, synthetic)`);
    ccFillSelects(d.columns); ccApplyDefaults(d.defaults);
    runCcAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("ccFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("ccDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    ccState.source = d.token; ccState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    ccFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function ccCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return { source: ccState.source, case: v("ccSelCase"), exposed: v("ccSelExposed"), lang: lang() };
}
const runCcBtn = document.getElementById("runCcAnalyze");
if (runCcBtn) runCcBtn.addEventListener("click", runCcAnalyze);
async function runCcAnalyze() {
  const req = ccCurrentMapping();
  if (!req.source) return;
  ccState.req = req;
  try {
    const a = await postJSON(`${API}/api/cc_analyze`, req);
    renderCcAnalyze(a);
    runCcAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderCcAnalyze(a) {
  document.getElementById("ccAnalyzeOut").classList.remove("hidden");
  const bal = a.age_balance ? tr(`病例平均 ${fmt(bal_v(a, "case"), 0)} 歲、對照 ${fmt(bal_v(a, "control"), 0)} 歲。`,
    `Cases avg ${fmt(bal_v(a, "case"), 0)} yrs, controls ${fmt(bal_v(a, "control"), 0)} yrs.`) : "";
  const cards = [
    [tr("校正年齡 OR（≈ 因果）", "Age-adjusted OR (≈ causal)"), a.adj_or, a.interpretation, true],
    [tr("未校正 OR（被年齡混淆）", "Crude OR (age-confounded)"), a.crude_or,
      tr(`95% CI ${fmt(a.ci_crude[0], 2)}～${fmt(a.ci_crude[1], 2)}。${bal}`, `95% CI ${fmt(a.ci_crude[0], 2)}–${fmt(a.ci_crude[1], 2)}. ${bal}`), false],
    [tr("Mantel–Haenszel OR（分層）", "Mantel–Haenszel OR (stratified)"), a.mh_or,
      tr("按年齡層×性別分層合併，應與校正 OR 一致。", "Stratified by age band × sex; should agree with the adjusted OR."), false],
  ];
  document.getElementById("ccAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}</div><p>${desc}</p></div>`
  ).join("");
  drawCcAnalyze(a);
}
function bal_v(a, k) { return a.age_balance ? a.age_balance[k] : 0; }
function drawCcAnalyze(a) {
  if (!document.getElementById("ccAnalyzeChart")) return;
  const labels = [tr("未校正 OR", "crude"), tr("校正 OR", "adjusted"), tr("M–H OR", "M–H")];
  const vals = [a.crude_or, a.adj_or, a.mh_or];
  Plotly.react("ccAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [AMBER, TEAL, TEAL] },
    text: vals.map((v) => v.toFixed(2) + "×"), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 26, r: 18, b: 40, l: 50 },
    yaxis: { title: tr("勝算比", "odds ratio"), range: [0, Math.max(...vals) * 1.2] },
    shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: a.true_or, y1: a.true_or, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: 2.5, y: a.true_or, text: tr("真值 " + a.true_or, "truth " + a.true_or), showarrow: false, yshift: 11, xanchor: "right", font: { color: GREEN, size: 11 } }],
  }), SCENE_CFG);
}
// ③ advanced variants (not AI)
const runCcTtBtn = document.getElementById("runCcTargetTrial");
if (runCcTtBtn) runCcTtBtn.addEventListener("click", async () => {
  let s; try { s = await getJSON(`${API}/api/cc_targettrial?lang=${lang()}`); } catch (e) { return; }
  state.ccTt = s;
  document.getElementById("ccTtOut").classList.remove("hidden");
  const labels = [tr("傳統病例對照", "naive case-control"), tr("模擬目標試驗", "emulated target trial"), tr("完整世代", "full cohort")];
  const vals = [s.naive_or, s.emulated_or, s.cohort_or];
  Plotly.react("ccTtChart", [{ x: labels, y: vals, type: "bar", marker: { color: [RED, TEAL, SLATE] }, text: vals.map((v) => v.toFixed(2) + "×"), textposition: "outside" }],
    sceneLayout({ height: 280, margin: { t: 22, r: 14, b: 46, l: 48 }, yaxis: { title: tr("勝算比", "odds ratio"), range: [0, 1.4] },
      shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: 1.0, y1: 1.0, line: { color: GREEN, width: 2, dash: "dash" } }] }), SCENE_CFG);
  document.getElementById("ccTtReading").innerHTML = s.reading;
});
const runCcExtBtn = document.getElementById("runCcExternal");
if (runCcExtBtn) runCcExtBtn.addEventListener("click", async () => {
  let s; try { s = await getJSON(`${API}/api/cc_external?lang=${lang()}`); } catch (e) { return; }
  state.ccExt = s;
  document.getElementById("ccExtOut").classList.remove("hidden");
  const labels = [tr("僅手上資料", "data only"), tr("＋外部彙總", "+ external summary")];
  const vals = [s.ci_width_base, s.ci_width_ext];
  Plotly.react("ccExtChart", [{ x: labels, y: vals, type: "bar", marker: { color: [SLATE, TEAL] }, text: vals.map((v) => v.toFixed(2)), textposition: "outside" }],
    sceneLayout({ height: 280, margin: { t: 22, r: 14, b: 40, l: 52 }, yaxis: { title: tr("95% CI 寬度（log-OR）", "95% CI width (log-OR)"), range: [0, Math.max(...vals) * 1.25] } }), SCENE_CFG);
  document.getElementById("ccExtReading").innerHTML = s.reading;
});

// ④ assumptions
function initCcAssume() {
  if (ccAssumeReady) return;
  ccAssumeReady = true;
  runCcAssumptions(ccState.req || { source: "example_cc", lang: lang() });
}
async function runCcAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_cc", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/cc_assumptions`, body); } catch (e) { return; }
  state.ccDash = out;
  renderCcAssumptions(out);
}
function renderCcAssumptions(out) {
  const hint = document.getElementById("ccAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("ccOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；關鍵設計假設仍需領域判斷。", "Testable checks pass; key design assumptions need domain judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("ccAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ⑤ real ML (random forest for matched case-control) — button-triggered (loads sklearn)
function initCcMl() { if (ccForestCache) drawCcForest(ccForestCache); }
const runCcForestBtn = document.getElementById("runCcForest");
if (runCcForestBtn) runCcForestBtn.addEventListener("click", async () => {
  const btn = runCcForestBtn; const old = btn.textContent;
  btn.disabled = true; btn.textContent = tr("計算中（載入 ML 套件）…", "Computing (loading ML package)…");
  try {
    const s = await getJSON(`${API}/api/cc_forest?lang=${lang()}`);
    ccForestCache = s; drawCcForest(s);
  } catch (e) { alert(tr("計算失敗：", "Failed: ") + e.message); }
  finally { btn.disabled = false; btn.textContent = old; }
});
function drawCcForest(s) {
  document.getElementById("ccForestOut").classList.remove("hidden");
  if (document.getElementById("ccForestChart")) {
    Plotly.react("ccForestChart", [{
      x: s.bars.labels, y: s.bars.values, type: "bar", marker: { color: [SLATE, GREEN] },
      text: s.bars.values.map((v) => v.toFixed(3)), textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 26, r: 18, b: 50, l: 50 },
      yaxis: { title: tr("留出 AUC（越高越好）", "held-out AUC (higher better)"), range: [0.5, 1.0] },
    }), SCENE_CFG);
  }
  document.getElementById("ccForestReading").innerHTML = s.reading;
  const imp = (s.importance || []).map((i) => `${i.name} <b>${i.value}</b>`).join("　·　");
  document.getElementById("ccForestImp").innerHTML = imp ? tr("變數重要度：", "Variable importance: ") + imp : "";
}

// ======================================================================
// SCCS (self-controlled case series, 自身對照病例系列) — tabs ①–⑤
// ======================================================================
const sccsState = { source: null, columns: [], req: null };
let sccsLearnReady = false, sccsPlayReady = false, sccsAnalyzeReady = false,
    sccsAssumeReady = false, sccsMlReady = false, sccsSelfCache = null;

// ① learn: a swimmer of CASES. Each case's observation is a lane; a vaccination pill
// marks exposure; a shaded RISK WINDOW follows it; the event ● lands in the risk window
// (for most) or baseline. Each person is their own control; time-fixed factors cancel.
function drawSceneSccs() {
  if (!document.getElementById("sccsScene")) return;
  // BMJ-style SCCS schematic in the PHDc green palette: control person-time = green
  // band, the post-dose risk window = amber, within each case's own timeline.
  const GREEN = "#3f8268", GREENFILL = "rgba(63,130,104,.16)", GREENDK = "#1f5135";
  const RISK = "#f59e0b", RISKEDGE = "#b45309", RED = "#ef4444";
  const OBS = 200, RW = 28;                                   // observation length; risk window = days 1..28 after dose
  // top row = an "anatomy of one case" key; rows below = four example cases.
  const rows = [
    { y: 5, v: 60, e: 74, lbl: tr("一個 case 的剖析", "anatomy of one case") },
    { y: 4, v: 40, e: 52, lbl: tr("病人甲", "case A") },
    { y: 3, v: 95, e: 106, lbl: tr("病人乙", "case B") },
    { y: 2, v: 120, e: 178, lbl: tr("病人丙（落控制期）", "case C (in control)") },
    { y: 1, v: 60, e: 72, lbl: tr("病人丁", "case D") },
  ];
  const shapes = [], anns = [], pillX = [], pillY = [], evX = [], evY = [];
  rows.forEach((r) => {
    // whole observation = the person's own CONTROL person-time (green band) ...
    shapes.push({ type: "rect", x0: 0, x1: OBS, y0: r.y - 0.16, y1: r.y + 0.16, fillcolor: GREENFILL, line: { color: GREEN, width: 1 } });
    // ... except the RISK WINDOW after the dose = exposed person-time (amber)
    shapes.push({ type: "rect", x0: r.v + 1, x1: r.v + RW, y0: r.y - 0.2, y1: r.y + 0.2, fillcolor: "rgba(245,158,11,.65)", line: { color: RISKEDGE, width: 1.5 } });
    pillX.push(r.v); pillY.push(r.y); evX.push(r.e); evY.push(r.y);
    anns.push(Object.assign(_lbl(-8, r.y, r.lbl, INK, 9), { xanchor: "right" }));
  });
  // segment labels on the anatomy row (control | risk window | control)
  const A = rows[0];
  anns.push(_lbl(A.v / 2, A.y + 0.44, tr("控制期", "control"), GREENDK, 9));
  anns.push(_lbl(A.v + RW / 2, A.y + 0.46, tr("危險窗", "risk window"), RISKEDGE, 9.5));
  anns.push(_lbl((A.v + RW + OBS) / 2, A.y + 0.44, tr("控制期", "control"), GREENDK, 9));
  anns.push(_lbl(A.v + RW / 2, A.y - 0.46, tr(`接種後 1–${RW} 天`, `days 1–${RW}`), RISKEDGE, 8));
  // compact inline key (replaces the wrapping legend that overflowed the box)
  anns.push(Object.assign(_lbl(0, 6.0, tr("▲ 接種日", "▲ vaccination"), GREENDK, 9.5), { xanchor: "left" }));
  anns.push(Object.assign(_lbl(70, 6.0, tr("● 急性事件", "● acute event"), RED, 9.5), { xanchor: "left" }));
  anns.push(Object.assign(_lbl(150, 6.0, tr("■ 危險窗 / ■ 控制期", "■ risk / ■ control"), RISKEDGE, 9), { xanchor: "left" }));
  const traces = [
    { x: pillX, y: pillY, mode: "markers", type: "scatter", name: tr("接種日", "vaccination"), marker: { color: GREENDK, size: 14, symbol: "triangle-up", line: { color: "#fff", width: 1 } } },
    { x: evX, y: evY, mode: "markers", type: "scatter", name: tr("急性事件", "acute event"), marker: { color: RED, size: 13, line: { color: "#fff", width: 1.2 } } },
  ];
  Plotly.react("sccsScene", traces, schemaLayout({
    height: 380, shapes, annotations: anns, showlegend: false,
    xaxis: { visible: true, title: tr("觀察期天數", "days of observation"), range: [-44, OBS + 4], fixedrange: true, dtick: 50 },
    yaxis: { visible: false, range: [0.35, 6.4] },
    margin: { t: 16, r: 16, b: 40, l: 84 },
  }), SCENE_CFG);
}
function initSccsLearn() { if (sccsLearnReady) return; sccsLearnReady = true; drawSceneSccs(); }

// ② interactive — healthy-vaccinee slider (SCCS immune to time-fixed confounding)
const sccsHvSlider = document.getElementById("sccsHvSlider");
let sccsPlayTimer = null;
function initSccsPlay() { if (sccsPlayReady) return; sccsPlayReady = true; refreshSccsPlay(); }
function scheduleSccsPlay() {
  document.getElementById("sccsHvVal").textContent = Number(sccsHvSlider.value).toFixed(2);
  clearTimeout(sccsPlayTimer); sccsPlayTimer = setTimeout(refreshSccsPlay, 250);
}
if (sccsHvSlider) sccsHvSlider.addEventListener("input", scheduleSccsPlay);
async function refreshSccsPlay() {
  const hv = sccsHvSlider ? Number(sccsHvSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/sccs_interactive?hv=${hv}&lang=${lang()}`); } catch (e) { return; }
  state.sccsPlay = d;
  const set = (id, v, col) => { const el = document.getElementById(id); if (el) { el.textContent = fmt(v, 2); if (col) el.style.color = col; } };
  set("sccsNaive", d.naive, Math.abs(d.naive - d.true_irr) < 0.4 ? TEAL : RED);
  set("sccsSccs", d.sccs, Math.abs(d.sccs - d.true_irr) < 0.3 ? TEAL : AMBER);
  drawSccsPlay(d);
}
function drawSccsPlay(d) {
  if (!document.getElementById("sccsPlayChart")) return;
  const g = d.grid;
  Plotly.react("sccsPlayChart", [
    { x: g.hv, y: g.naive, mode: "lines+markers", type: "scatter", name: tr("未校正人際速率比", "naive between-person RR"), line: { color: AMBER, width: 3 }, marker: { size: 5 } },
    { x: g.hv, y: g.sccs, mode: "lines+markers", type: "scatter", name: tr("SCCS IRR（個人內）", "SCCS IRR (within-person)"), line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: [d.hv], y: [d.naive], mode: "markers", type: "scatter", name: tr("目前", "current"), marker: { color: RED, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.16 }, margin: { t: 26, r: 18, b: 44, l: 50 },
    xaxis: { title: tr("健康接種者選擇強度", "healthy-vaccinee selection strength") },
    yaxis: { title: tr("相對速率", "rate ratio"), range: [0, Math.max(...g.naive, ...g.sccs) * 1.15] },
    shapes: [{ type: "line", x0: g.hv[0], x1: g.hv[g.hv.length - 1], y0: g.true_irr, y1: g.true_irr, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: g.hv[g.hv.length - 1], y: g.true_irr, text: tr("真值 " + g.true_irr, "truth " + g.true_irr), showarrow: false, yshift: 11, xanchor: "right", font: { color: GREEN, size: 11 } }],
  }), SCENE_CFG);
}

// ③ analyze
function initSccsAnalyze() { if (sccsAnalyzeReady) return; sccsAnalyzeReady = true; document.getElementById("useSccsExample").click(); }
function sccsFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["sccsSelVacc", "sccsSelEvent"].forEach((id) => document.getElementById(id).innerHTML = opts);
  document.getElementById("sccsColMap").classList.remove("hidden");
}
function sccsApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null && el) el.value = v; };
  set("sccsSelVacc", d.vacc_day); set("sccsSelEvent", d.event_day);
  if (d.risk_days) document.getElementById("sccsRiskDays").value = d.risk_days;
}
document.getElementById("useSccsExample").addEventListener("click", async () => {
  const st = document.getElementById("sccsDataStatus");
  try {
    const d = await getJSON(`${API}/api/sccs_example`);
    sccsState.source = "example_sccs"; sccsState.columns = d.columns;
    st.textContent = tr(`已載入內建 case 範例（${d.n} 位 case，合成虛構）`, `Loaded built-in cases (${d.n} cases, synthetic)`);
    sccsFillSelects(d.columns); sccsApplyDefaults(d.defaults);
    runSccsAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("sccsFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("sccsDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    sccsState.source = d.token; sccsState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    sccsFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function sccsCurrentMapping() {
  const rd = parseInt(document.getElementById("sccsRiskDays").value, 10);
  return { source: sccsState.source, risk_days: rd || 28, lang: lang() };
}
const runSccsBtn = document.getElementById("runSccsAnalyze");
if (runSccsBtn) runSccsBtn.addEventListener("click", runSccsAnalyze);
async function runSccsAnalyze() {
  const req = sccsCurrentMapping();
  if (!req.source) return;
  sccsState.req = req;
  try {
    const a = await postJSON(`${API}/api/sccs_analyze`, req);
    renderSccsAnalyze(a);
    runSccsAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderSccsAnalyze(a) {
  document.getElementById("sccsAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("SCCS IRR（個人內，因果）", "SCCS IRR (within-person, causal)"), a.irr, a.interpretation, true],
    [tr("95% 信賴區間", "95% confidence interval"), null,
      tr(`${fmt(a.ci[0], 2)} ～ ${fmt(a.ci[1], 2)}（${a.n_risk} 個事件落在危險窗、${a.n_base} 個落在基線）`,
         `${fmt(a.ci[0], 2)} – ${fmt(a.ci[1], 2)} (${a.n_risk} events in the risk window, ${a.n_base} in baseline)`), false, fmt(a.irr, 2) + "×"],
    [tr("真值（危險窗 IRR）", "Truth (risk-window IRR)"), a.true_irr,
      tr("條件 Poisson 還原它，且自動消掉所有時間不變的混淆。", "Conditional Poisson recovers it, cancelling all time-fixed confounding."), false],
  ];
  document.getElementById("sccsAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl, override]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${override || (v == null ? "" : fmt(v, 2))}</div><p>${desc}</p></div>`
  ).join("");
  drawSccsAnalyze(a);
}
function drawSccsAnalyze(a) {
  if (!document.getElementById("sccsAnalyzeChart")) return;
  // events: share landing in the short risk window vs the long baseline
  const labels = [tr("危險窗事件", "risk-window events"), tr("基線事件", "baseline events")];
  const vals = [a.n_risk, a.n_base];
  Plotly.react("sccsAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: ["#f59e0b", "#9aa6b2"] },
    text: vals.map((v) => "" + v), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 26, r: 18, b: 40, l: 54 },
    yaxis: { title: tr("事件數", "event count") },
    annotations: [{ x: 0.5, y: Math.max(...vals) * 1.05, xref: "x", yref: "y", showarrow: false,
      text: tr(`危險窗只佔每人觀察期一小塊，卻收了 ${a.n_risk} 個事件 → IRR ≈ ${fmt(a.irr, 2)}`,
               `the risk window is a small slice yet holds ${a.n_risk} events → IRR ≈ ${fmt(a.irr, 2)}`),
      font: { size: 10, color: INK } }],
  }), SCENE_CFG);
}

// ④ assumptions
function initSccsAssume() {
  if (sccsAssumeReady) return;
  sccsAssumeReady = true;
  runSccsAssumptions(sccsState.req || { source: "example_sccs", lang: lang() });
}
async function runSccsAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_sccs", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/sccs_assumptions`, body); } catch (e) { return; }
  state.sccsDash = out;
  renderSccsAssumptions(out);
}
function renderSccsAssumptions(out) {
  const hint = document.getElementById("sccsAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("sccsOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；關鍵設計假設仍需領域判斷。", "Testable checks pass; key design assumptions need domain judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("sccsAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ⑤ real ML (self-matched learning) — button-triggered (loads sklearn)
function initSccsMl() { if (sccsSelfCache) drawSccsSelf(sccsSelfCache); }
const runSccsSelfBtn = document.getElementById("runSccsSelf");
if (runSccsSelfBtn) runSccsSelfBtn.addEventListener("click", async () => {
  const btn = runSccsSelfBtn; const old = btn.textContent;
  btn.disabled = true; btn.textContent = tr("計算中（載入 ML 套件）…", "Computing (loading ML package)…");
  try {
    const s = await getJSON(`${API}/api/sccs_selfmatch?lang=${lang()}`);
    sccsSelfCache = s; drawSccsSelf(s);
  } catch (e) { alert(tr("計算失敗：", "Failed: ") + e.message); }
  finally { btn.disabled = false; btn.textContent = old; }
});
function drawSccsSelf(s) {
  document.getElementById("sccsSelfOut").classList.remove("hidden");
  if (document.getElementById("sccsSelfChart")) {
    Plotly.react("sccsSelfChart", [{
      x: s.bars.labels, y: s.bars.values, type: "bar", marker: { color: [SLATE, RED, TEAL] },
      text: s.bars.values.map((v) => v.toFixed(2) + "×"), textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 26, r: 18, b: 50, l: 50 },
      yaxis: { title: tr("相對速率 IRR", "incidence rate ratio") },
    }), SCENE_CFG);
  }
  document.getElementById("sccsSelfReading").innerHTML = s.reading;
  const imp = (s.importance || []).map((i) => `${i.name} <b>${i.value}</b>`).join("　·　");
  document.getElementById("sccsSelfImp").innerHTML = imp ? tr("變數重要度：", "Variable importance: ") + imp : "";
}

// ======================================================================
// ACNU — Active-Comparator, New-User — tabs ①–⑤
// ======================================================================
const acnuState = { source: null, columns: [], req: null };
let acnuLearnReady = false, acnuPlayReady = false, acnuAnalyzeReady = false,
    acnuAssumeReady = false, acnuPsCache = null;

// ① learn scene: three groups on a SEVERITY axis. Non-users sit far to the healthy
// side; A and B (both indicated) are close together — that closeness is why ACNU's
// crude contrast is far less biased than 'A vs non-users'.
function drawSceneAcnu() {
  if (!document.getElementById("acnuScene")) return;
  const groups = [
    { k: "none", sev: -0.51, col: "#9aa6b2", lbl: tr("沒用藥（healthy-user）", "non-users (healthy-user)") },
    { k: "B", sev: -0.09, col: SLATE, lbl: tr("對照藥 B 新使用者", "comparator B new users") },
    { k: "A", sev: 0.75, col: TEAL, lbl: tr("研究藥 A 新使用者", "drug A new users") },
  ];
  Plotly.react("acnuScene", [{
    x: groups.map((g) => g.sev), y: groups.map((g) => g.lbl), type: "bar", orientation: "h",
    marker: { color: groups.map((g) => g.col) },
    text: groups.map((g) => (g.sev >= 0 ? "+" : "") + g.sev.toFixed(2)), textposition: "outside",
  }], schemaLayout({
    height: 290,
    xaxis: { visible: true, title: tr("平均疾病嚴重度（混淆因子）", "mean disease severity (the confounder)"), range: [-1.0, 1.3], zeroline: true },
    yaxis: { visible: true, automargin: true },
    margin: { t: 16, r: 18, b: 44, l: 12 },
    annotations: [{ x: 0.33, y: 2, xref: "x", yref: "y", ax: -0.51, ay: 0, axref: "x", ayref: "y",
      showarrow: true, arrowhead: 3, arrowcolor: "#c0504d", arrowwidth: 2, text: "" },
      { x: -0.3, y: 2.42, xref: "x", yref: "y", showarrow: false, font: { color: "#c0504d", size: 9.5 },
        text: tr("未校正：A vs 沒用藥（差距大→偏）", "naive: A vs non-users (big gap → biased)") },
      { x: 0.33, y: 1.55, xref: "x", yref: "y", showarrow: false, font: { color: TEAL, size: 9.5 },
        text: tr("ACNU：A vs B（差距小→較不偏）", "ACNU: A vs B (small gap → less biased)") }],
  }), SCENE_CFG);
}
function initAcnuLearn() { if (acnuLearnReady) return; acnuLearnReady = true; drawSceneAcnu(); }

// ② interactive — confounding-by-indication slider
const acnuConfSlider = document.getElementById("acnuConfSlider");
let acnuPlayTimer = null;
function initAcnuPlay() { if (acnuPlayReady) return; acnuPlayReady = true; refreshAcnuPlay(); }
function scheduleAcnuPlay() {
  document.getElementById("acnuConfVal").textContent = Number(acnuConfSlider.value).toFixed(2);
  clearTimeout(acnuPlayTimer); acnuPlayTimer = setTimeout(refreshAcnuPlay, 250);
}
if (acnuConfSlider) acnuConfSlider.addEventListener("input", scheduleAcnuPlay);
async function refreshAcnuPlay() {
  const conf = acnuConfSlider ? Number(acnuConfSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/acnu_interactive?conf=${conf}&lang=${lang()}`); } catch (e) { return; }
  state.acnuPlay = d;
  const set = (id, v, col) => { const el = document.getElementById(id); if (el) { el.textContent = fmt(v, 2); if (col) el.style.color = col; } };
  set("acnuNaive", d.naive_irr, RED);
  set("acnuCrude", d.crude_irr, Math.abs(d.crude_irr - d.true_hr) < 0.4 ? TEAL : AMBER);
  set("acnuAdj", d.adj_irr, Math.abs(d.adj_irr - d.true_hr) < 0.2 ? TEAL : AMBER);
  const rd = document.getElementById("acnuPlayReading"); if (rd) rd.innerHTML = d.reading;
  drawAcnuPlay(d);
}
function drawAcnuPlay(d) {
  if (!document.getElementById("acnuPlayChart")) return;
  const g = d.grid;
  Plotly.react("acnuPlayChart", [
    { x: g.conf, y: g.naive, mode: "lines+markers", type: "scatter", name: tr("未校正：A vs 沒用藥", "naive: A vs non-users"), line: { color: RED, width: 3 }, marker: { size: 5 } },
    { x: g.conf, y: g.crude, mode: "lines+markers", type: "scatter", name: tr("ACNU 未校正：A vs B", "crude ACNU: A vs B"), line: { color: AMBER, width: 3 }, marker: { size: 5 } },
    { x: g.conf, y: g.adj, mode: "lines+markers", type: "scatter", name: tr("ACNU 校正後", "adjusted ACNU"), line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: [d.conf], y: [d.crude_irr], mode: "markers", type: "scatter", marker: { color: INK, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.18 }, margin: { t: 30, r: 18, b: 44, l: 50 },
    xaxis: { title: tr("因適應症的混淆強度", "confounding-by-indication strength") },
    yaxis: { title: tr("速率比", "rate ratio"), range: [0, Math.max(...g.naive) * 1.12] },
    shapes: [{ type: "line", x0: g.conf[0], x1: g.conf[g.conf.length - 1], y0: g.true_hr, y1: g.true_hr, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: g.conf[g.conf.length - 1], y: g.true_hr, text: tr("真值 " + g.true_hr, "truth " + g.true_hr), showarrow: false, yshift: 11, xanchor: "right", font: { color: GREEN, size: 11 } }],
  }), SCENE_CFG);
}

// ③ analyze
function initAcnuAnalyze() { if (acnuAnalyzeReady) return; acnuAnalyzeReady = true; document.getElementById("useAcnuExample").click(); }
function acnuFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["acnuSelDrug", "acnuSelEvent", "acnuSelFu"].forEach((id) => document.getElementById(id).innerHTML = opts);
  document.getElementById("acnuColMap").classList.remove("hidden");
}
function acnuApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null && el) el.value = v; };
  set("acnuSelDrug", d.drug); set("acnuSelEvent", d.event); set("acnuSelFu", d.futime);
}
document.getElementById("useAcnuExample").addEventListener("click", async () => {
  const st = document.getElementById("acnuDataStatus");
  try {
    const d = await getJSON(`${API}/api/acnu_example`);
    acnuState.source = "example_acnu"; acnuState.columns = d.columns;
    st.textContent = tr(`已載入內建範例（${d.n} 人，合成虛構）`, `Loaded built-in example (${d.n} people, synthetic)`);
    acnuFillSelects(d.columns); acnuApplyDefaults(d.defaults);
    runAcnuAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("acnuFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("acnuDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    acnuState.source = d.token; acnuState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    acnuFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function acnuCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return { source: acnuState.source, drug: v("acnuSelDrug"), event: v("acnuSelEvent"),
    futime: v("acnuSelFu"), covariates: ["severity", "comorbidity"], lang: lang() };
}
const runAcnuBtn = document.getElementById("runAcnuAnalyze");
if (runAcnuBtn) runAcnuBtn.addEventListener("click", runAcnuAnalyze);
async function runAcnuAnalyze() {
  const req = acnuCurrentMapping();
  if (!req.source) return;
  acnuState.req = req;
  try {
    const a = await postJSON(`${API}/api/acnu_analyze`, req);
    renderAcnuAnalyze(a);
    runAcnuAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderAcnuAnalyze(a) {
  document.getElementById("acnuAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("ACNU 校正後（A vs B，因果）", "adjusted ACNU (A vs B, causal)"), a.adj_irr, a.interpretation, true],
    [tr("未校正：A vs 沒用藥（偏）", "naive: A vs non-users (biased)"), a.naive_irr,
      tr("被 healthy-user 與因適應症的混淆嚴重撐大。", "badly inflated by healthy-user + confounding by indication."), false],
    [tr("真值（A 相對 B 的速率比）", "Truth (A-vs-B rate ratio)"), a.true_hr,
      tr("主動對照＋新使用者＋傾向分數校正應還原它。", "active comparator + new-user + PS adjustment should recover it."), false],
  ];
  document.getElementById("acnuAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}×</div><p>${desc}</p></div>`
  ).join("");
  drawAcnuAnalyze(a);
}
function drawAcnuAnalyze(a) {
  if (!document.getElementById("acnuAnalyzeChart")) return;
  const labels = [tr("未校正<br>A vs 沒用藥", "naive<br>A vs none"), tr("ACNU 粗<br>A vs B", "crude ACNU<br>A vs B"),
    tr("ACNU 校正<br>A vs B", "adjusted ACNU<br>A vs B"), tr("真值", "truth")];
  const vals = [a.naive_irr, a.crude_irr, a.adj_irr, a.true_hr];
  Plotly.react("acnuAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [RED, AMBER, TEAL, GREEN] },
    text: vals.map((v) => fmt(v, 2) + "×"), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 22, r: 16, b: 46, l: 50 },
    yaxis: { title: tr("速率比", "rate ratio"), range: [0, Math.max(...vals) * 1.18] },
    shapes: [{ type: "line", x0: -0.5, x1: 3.5, y0: a.true_hr, y1: a.true_hr, line: { color: GREEN, width: 2, dash: "dash" } }],
  }), SCENE_CFG);
}

// ④ assumptions
function initAcnuAssume() {
  if (acnuAssumeReady) return;
  acnuAssumeReady = true;
  runAcnuAssumptions(acnuState.req || { source: "example_acnu", lang: lang() });
}
async function runAcnuAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_acnu", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/acnu_assumptions`, body); } catch (e) { return; }
  state.acnuDash = out;
  renderAcnuAssumptions(out);
}
function renderAcnuAssumptions(out) {
  const hint = document.getElementById("acnuAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("acnuOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；關鍵設計假設仍需領域判斷。", "Testable checks pass; key design assumptions need domain judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("acnuAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ⑤ real ML (ML propensity score) — button-triggered (loads sklearn)
function initAcnuMl() { if (acnuPsCache) drawAcnuPs(acnuPsCache); }
const runAcnuPsBtn = document.getElementById("runAcnuPs");
if (runAcnuPsBtn) runAcnuPsBtn.addEventListener("click", async () => {
  const btn = runAcnuPsBtn; const old = btn.textContent;
  btn.disabled = true; btn.textContent = tr("計算中（載入 ML 套件）…", "Computing (loading ML package)…");
  try {
    const s = await getJSON(`${API}/api/acnu_psml?lang=${lang()}`);
    acnuPsCache = s; drawAcnuPs(s);
  } catch (e) { alert(tr("計算失敗：", "Failed: ") + e.message); }
  finally { btn.disabled = false; btn.textContent = old; }
});
function drawAcnuPs(s) {
  document.getElementById("acnuPsOut").classList.remove("hidden");
  if (document.getElementById("acnuPsChart")) {
    Plotly.react("acnuPsChart", [{
      x: s.bars.labels, y: s.bars.values, type: "bar", marker: { color: [RED, AMBER, TEAL, GREEN] },
      text: s.bars.values.map((v) => v.toFixed(2) + "×"), textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 22, r: 16, b: 50, l: 50 },
      yaxis: { title: tr("速率比 IRR", "rate ratio"), range: [0, Math.max(...s.bars.values) * 1.18] },
      shapes: [{ type: "line", x0: -0.5, x1: 3.5, y0: s.true_hr, y1: s.true_hr, line: { color: GREEN, width: 2, dash: "dash" } }],
    }), SCENE_CFG);
  }
  document.getElementById("acnuPsReading").innerHTML = s.reading;
}

// ======================================================================
// PNU — Prevalent New-User — tabs ①–⑤
// ======================================================================
const pnuState = { source: null, columns: [], req: null };
let pnuLearnReady = false, pnuPlayReady = false, pnuAnalyzeReady = false,
    pnuAssumeReady = false, pnuPsCache = null;

// ① learn scene: frailty of A new vs A prevalent vs B new. Prevalent A users sit on
// the low-risk (depleted) side — that's depletion of susceptibles.
function drawScenePnu() {
  if (!document.getElementById("pnuScene")) return;
  const groups = [
    { f: -0.47, col: "#9aa6b2", lbl: tr("A 盛行使用者（存活的低風險群）", "A prevalent (low-risk survivors)") },
    { f: 0.00, col: TEAL, lbl: tr("A 新使用者", "A new users") },
    { f: 0.01, col: SLATE, lbl: tr("B 新使用者（對照）", "B new users (comparator)") },
  ];
  Plotly.react("pnuScene", [{
    x: groups.map((g) => g.f), y: groups.map((g) => g.lbl), type: "bar", orientation: "h",
    marker: { color: groups.map((g) => g.col) },
    text: groups.map((g) => (g.f >= 0 ? "+" : "") + g.f.toFixed(2)), textposition: "outside",
  }], schemaLayout({
    height: 290,
    xaxis: { visible: true, title: tr("平均體質脆弱度（風險因子）", "mean frailty (the risk factor)"), range: [-0.85, 0.5], zeroline: true },
    yaxis: { visible: true, automargin: true },
    margin: { t: 16, r: 18, b: 44, l: 12 },
    annotations: [{ x: -0.47, y: 2.45, xref: "x", yref: "y", showarrow: false, font: { color: "#c0504d", size: 9.5 },
      text: tr("盛行 A 使用者被「易感者耗竭」選成低風險 → 未校正比會低估", "prevalent A users selected low-risk by depletion → naive comparison underestimates") }],
  }), SCENE_CFG);
}
function initPnuLearn() { if (pnuLearnReady) return; pnuLearnReady = true; drawScenePnu(); }

// ② interactive — depletion-of-susceptibles slider
const pnuDeplSlider = document.getElementById("pnuDeplSlider");
let pnuPlayTimer = null;
function initPnuPlay() { if (pnuPlayReady) return; pnuPlayReady = true; refreshPnuPlay(); }
function schedulePnuPlay() {
  document.getElementById("pnuDeplVal").textContent = Number(pnuDeplSlider.value).toFixed(2);
  clearTimeout(pnuPlayTimer); pnuPlayTimer = setTimeout(refreshPnuPlay, 250);
}
if (pnuDeplSlider) pnuDeplSlider.addEventListener("input", schedulePnuPlay);
async function refreshPnuPlay() {
  const depl = pnuDeplSlider ? Number(pnuDeplSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/pnu_interactive?depletion=${depl}&lang=${lang()}`); } catch (e) { return; }
  state.pnuPlay = d;
  const set = (id, v, col) => { const el = document.getElementById(id); if (el) { el.textContent = fmt(v, 2); if (col) el.style.color = col; } };
  set("pnuNaive", d.naive_hr, RED);
  set("pnuNewuser", d.newuser_hr, Math.abs(d.newuser_hr - d.true_hr) < 0.2 ? TEAL : AMBER);
  set("pnuPnu", d.pnu_hr, Math.abs(d.pnu_hr - d.true_hr) < 0.2 ? TEAL : AMBER);
  const rd = document.getElementById("pnuPlayReading"); if (rd) rd.innerHTML = d.reading;
  drawPnuPlay(d);
}
function drawPnuPlay(d) {
  if (!document.getElementById("pnuPlayChart")) return;
  const g = d.grid;
  Plotly.react("pnuPlayChart", [
    { x: g.depl, y: g.naive, mode: "lines+markers", type: "scatter", name: tr("未校正盛行（A 全部 vs B 新）", "naive prevalent (A-all vs B-new)"), line: { color: RED, width: 3 }, marker: { size: 5 } },
    { x: g.depl, y: g.newuser, mode: "lines+markers", type: "scatter", name: tr("純新使用者", "new-user-only"), line: { color: AMBER, width: 3, dash: "dot" }, marker: { size: 5 } },
    { x: g.depl, y: g.pnu, mode: "lines+markers", type: "scatter", name: tr("PNU（時間條件）", "PNU (time-conditional)"), line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: [d.depletion], y: [d.naive_hr], mode: "markers", type: "scatter", marker: { color: INK, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.18 }, margin: { t: 30, r: 18, b: 44, l: 50 },
    xaxis: { title: tr("易感者耗竭強度", "depletion-of-susceptibles strength") },
    yaxis: { title: tr("速率比", "rate ratio"), range: [0.8, Math.max(...g.newuser, ...g.pnu) * 1.12] },
    shapes: [{ type: "line", x0: g.depl[0], x1: g.depl[g.depl.length - 1], y0: g.true_hr, y1: g.true_hr, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: g.depl[g.depl.length - 1], y: g.true_hr, text: tr("真值 " + g.true_hr, "truth " + g.true_hr), showarrow: false, yshift: 11, xanchor: "right", font: { color: GREEN, size: 11 } }],
  }), SCENE_CFG);
}

// ③ analyze
function initPnuAnalyze() { if (pnuAnalyzeReady) return; pnuAnalyzeReady = true; document.getElementById("usePnuExample").click(); }
function pnuFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["pnuSelDrug", "pnuSelEvent", "pnuSelFu"].forEach((id) => document.getElementById(id).innerHTML = opts);
  document.getElementById("pnuColMap").classList.remove("hidden");
}
function pnuApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null && el) el.value = v; };
  set("pnuSelDrug", d.drug); set("pnuSelEvent", d.event); set("pnuSelFu", d.futime);
}
document.getElementById("usePnuExample").addEventListener("click", async () => {
  const st = document.getElementById("pnuDataStatus");
  try {
    const d = await getJSON(`${API}/api/pnu_example`);
    pnuState.source = "example_pnu"; pnuState.columns = d.columns;
    st.textContent = tr(`已載入內建範例（${d.n} 人，合成虛構）`, `Loaded built-in example (${d.n} people, synthetic)`);
    pnuFillSelects(d.columns); pnuApplyDefaults(d.defaults);
    runPnuAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("pnuFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("pnuDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    pnuState.source = d.token; pnuState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    pnuFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function pnuCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return { source: pnuState.source, drug: v("pnuSelDrug"), event: v("pnuSelEvent"),
    futime: v("pnuSelFu"), lang: lang() };
}
const runPnuBtn = document.getElementById("runPnuAnalyze");
if (runPnuBtn) runPnuBtn.addEventListener("click", runPnuAnalyze);
async function runPnuAnalyze() {
  const req = pnuCurrentMapping();
  if (!req.source) return;
  pnuState.req = req;
  try {
    const a = await postJSON(`${API}/api/pnu_analyze`, req);
    renderPnuAnalyze(a);
    runPnuAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderPnuAnalyze(a) {
  document.getElementById("pnuAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("PNU（時間條件，含盛行使用者）", "PNU (time-conditional, incl. prevalent)"), a.pnu_hr, a.interpretation, true],
    [tr("純新使用者（無偏但樣本小）", "new-user-only (unbiased but small)"), a.newuser_hr,
      tr(`乾淨的標竿，但丟掉 ${a.n_prevalent} 位盛行使用者。`, `the clean benchmark, but discards ${a.n_prevalent} prevalent users.`), false],
    [tr("未校正盛行（易感者耗竭，偏）", "naive prevalent (depletion, biased)"), a.naive_hr,
      tr("把盛行使用者直接和新起始者比，被耗竭往無效值拉。", "pooling prevalent users with new starters — dragged to the null by depletion."), false],
    [tr("真值", "Truth"), a.true_hr,
      tr("PNU 與純新使用者都應還原它。", "both PNU and new-user-only should recover it."), false],
  ];
  document.getElementById("pnuAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}×</div><p>${desc}</p></div>`
  ).join("");
  drawPnuAnalyze(a);
}
function drawPnuAnalyze(a) {
  if (!document.getElementById("pnuAnalyzeChart")) return;
  const labels = [tr("未校正盛行", "naive prevalent"), tr("純新使用者", "new-user-only"), tr("PNU", "PNU"), tr("真值", "truth")];
  const vals = [a.naive_hr, a.newuser_hr, a.pnu_hr, a.true_hr];
  Plotly.react("pnuAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [RED, AMBER, TEAL, GREEN] },
    text: vals.map((v) => fmt(v, 2) + "×"), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 22, r: 16, b: 40, l: 50 },
    yaxis: { title: tr("速率比", "rate ratio"), range: [0, Math.max(...vals) * 1.2] },
    shapes: [{ type: "line", x0: -0.5, x1: 3.5, y0: a.true_hr, y1: a.true_hr, line: { color: GREEN, width: 2, dash: "dash" } }],
  }), SCENE_CFG);
}

// ④ assumptions
function initPnuAssume() {
  if (pnuAssumeReady) return;
  pnuAssumeReady = true;
  runPnuAssumptions(pnuState.req || { source: "example_pnu", lang: lang() });
}
async function runPnuAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_pnu", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/pnu_assumptions`, body); } catch (e) { return; }
  state.pnuDash = out;
  renderPnuAssumptions(out);
}
function renderPnuAssumptions(out) {
  const hint = document.getElementById("pnuAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("pnuOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；關鍵設計假設仍需領域判斷。", "Testable checks pass; key design assumptions need domain judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("pnuAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ⑤ real ML (ML time-conditional propensity score) — button-triggered (loads sklearn)
function initPnuMl() { if (pnuPsCache) drawPnuPs(pnuPsCache); }
const runPnuPsBtn = document.getElementById("runPnuPs");
if (runPnuPsBtn) runPnuPsBtn.addEventListener("click", async () => {
  const btn = runPnuPsBtn; const old = btn.textContent;
  btn.disabled = true; btn.textContent = tr("計算中（載入 ML 套件）…", "Computing (loading ML package)…");
  try {
    const s = await getJSON(`${API}/api/pnu_psml?lang=${lang()}`);
    pnuPsCache = s; drawPnuPs(s);
  } catch (e) { alert(tr("計算失敗：", "Failed: ") + e.message); }
  finally { btn.disabled = false; btn.textContent = old; }
});
function drawPnuPs(s) {
  document.getElementById("pnuPsOut").classList.remove("hidden");
  if (document.getElementById("pnuPsChart")) {
    Plotly.react("pnuPsChart", [{
      x: s.bars.labels, y: s.bars.values, type: "bar", marker: { color: [SLATE, AMBER, TEAL, GREEN] },
      text: s.bars.values.map((v) => v.toFixed(2) + "×"), textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 22, r: 16, b: 50, l: 50 },
      yaxis: { title: tr("速率比 IRR", "rate ratio"), range: [0, Math.max(...s.bars.values) * 1.18] },
      shapes: [{ type: "line", x0: -0.5, x1: 3.5, y0: s.true_hr, y1: s.true_hr, line: { color: GREEN, width: 2, dash: "dash" } }],
    }), SCENE_CFG);
  }
  document.getElementById("pnuPsReading").innerHTML = s.reading;
}

// ======================================================================
// NC — Negative Control & Proximal Causal Inference — tabs ①–⑤
// ======================================================================
const ncState = { source: null, columns: [], req: null };
let ncLearnReady = false, ncPlayReady = false, ncAnalyzeReady = false,
    ncAssumeReady = false, ncCalCache = null;

// ① learn scene: the detection + correction story in three bars (representative demo numbers)
function drawSceneNc() {
  if (!document.getElementById("ncScene")) return;
  const labels = [tr("未校正 A→Y<br>（被 U 偏）", "naive A→Y<br>(biased by U)"),
    tr("偵測 A→W<br>（本應 0）", "detect A→W<br>(should be 0)"),
    tr("近端 P2SLS<br>（校正後）", "proximal P2SLS<br>(corrected)"), tr("真值", "truth")];
  const vals = [2.12, 1.06, 0.94, 1.0];
  Plotly.react("ncScene", [{
    x: labels, y: vals, type: "bar", marker: { color: [RED, AMBER, TEAL, GREEN] },
    text: vals.map((v) => v.toFixed(2)), textposition: "outside",
  }], schemaLayout({
    height: 300, margin: { t: 16, r: 14, b: 46, l: 48 },
    xaxis: { visible: true, tickfont: { size: 9.5 } },
    yaxis: { visible: true, title: tr("效應估計", "effect estimate"), range: [0, 2.5] },
    shapes: [{ type: "line", x0: -0.5, x1: 3.5, y0: 1.0, y1: 1.0, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: 1, y: 1.06, yref: "y", showarrow: false, yshift: 16, font: { color: "#c0504d", size: 9 },
      text: tr("≠0 → 未測混淆的警訊", "≠0 → unmeasured-confounding signal") }],
  }), SCENE_CFG);
}
function initNcLearn() { if (ncLearnReady) return; ncLearnReady = true; drawSceneNc(); }

// ② interactive — unmeasured-confounding slider
const ncConfSlider = document.getElementById("ncConfSlider");
let ncPlayTimer = null;
function initNcPlay() { if (ncPlayReady) return; ncPlayReady = true; refreshNcPlay(); }
function scheduleNcPlay() {
  document.getElementById("ncConfVal").textContent = Number(ncConfSlider.value).toFixed(2);
  clearTimeout(ncPlayTimer); ncPlayTimer = setTimeout(refreshNcPlay, 250);
}
if (ncConfSlider) ncConfSlider.addEventListener("input", scheduleNcPlay);
async function refreshNcPlay() {
  const conf = ncConfSlider ? Number(ncConfSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/nc_interactive?conf=${conf}&lang=${lang()}`); } catch (e) { return; }
  state.ncPlay = d;
  const set = (id, v, col) => { const el = document.getElementById(id); if (el) { el.textContent = fmt(v, 2); if (col) el.style.color = col; } };
  set("ncNaive", d.naive, RED);
  set("ncDetect", d.detect, Math.abs(d.detect) < 0.1 ? TEAL : AMBER);
  set("ncProx", d.proximal, Math.abs(d.proximal - d.true_tau) < 0.1 ? TEAL : AMBER);
  const rd = document.getElementById("ncPlayReading"); if (rd) rd.innerHTML = d.reading;
  drawNcPlay(d);
}
function drawNcPlay(d) {
  if (!document.getElementById("ncPlayChart")) return;
  const g = d.grid;
  Plotly.react("ncPlayChart", [
    { x: g.conf, y: g.naive, mode: "lines+markers", type: "scatter", name: tr("未校正 A→Y", "naive A→Y"), line: { color: RED, width: 3 }, marker: { size: 5 } },
    { x: g.conf, y: g.detect, mode: "lines+markers", type: "scatter", name: tr("偵測 A→W（應 0）", "detect A→W (should be 0)"), line: { color: AMBER, width: 3, dash: "dot" }, marker: { size: 5 } },
    { x: g.conf, y: g.proximal, mode: "lines+markers", type: "scatter", name: tr("近端 P2SLS", "proximal P2SLS"), line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: [d.conf], y: [d.naive], mode: "markers", type: "scatter", marker: { color: INK, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.18 }, margin: { t: 30, r: 18, b: 44, l: 50 },
    xaxis: { title: tr("未測混淆強度", "unmeasured-confounding strength") },
    yaxis: { title: tr("效應估計", "effect estimate"), range: [-0.2, Math.max(...g.naive) * 1.12] },
    shapes: [{ type: "line", x0: g.conf[0], x1: g.conf[g.conf.length - 1], y0: g.true_tau, y1: g.true_tau, line: { color: GREEN, width: 2, dash: "dash" } },
             { type: "line", x0: g.conf[0], x1: g.conf[g.conf.length - 1], y0: 0, y1: 0, line: { color: "#cbd5e1", width: 1 } }],
    annotations: [{ x: g.conf[g.conf.length - 1], y: g.true_tau, text: tr("真值 " + g.true_tau, "truth " + g.true_tau), showarrow: false, yshift: 11, xanchor: "right", font: { color: GREEN, size: 11 } }],
  }), SCENE_CFG);
}

// ③ analyze
function initNcAnalyze() { if (ncAnalyzeReady) return; ncAnalyzeReady = true; document.getElementById("useNcExample").click(); }
function ncFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["ncSelA", "ncSelY", "ncSelX", "ncSelW", "ncSelZ"].forEach((id) => document.getElementById(id).innerHTML = opts);
  document.getElementById("ncColMap").classList.remove("hidden");
}
function ncApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null && el) el.value = v; };
  set("ncSelA", d.treat); set("ncSelY", d.outcome); set("ncSelX", d.cov); set("ncSelW", d.nco); set("ncSelZ", d.nce);
}
document.getElementById("useNcExample").addEventListener("click", async () => {
  const st = document.getElementById("ncDataStatus");
  try {
    const d = await getJSON(`${API}/api/nc_example`);
    ncState.source = "example_nc"; ncState.columns = d.columns;
    st.textContent = tr(`已載入內建範例（${d.n} 人，合成虛構）`, `Loaded built-in example (${d.n} people, synthetic)`);
    ncFillSelects(d.columns); ncApplyDefaults(d.defaults);
    runNcAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("ncFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("ncDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    ncState.source = d.token; ncState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    ncFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function ncCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return { source: ncState.source, treat: v("ncSelA"), outcome: v("ncSelY"), cov: v("ncSelX"),
    nco: v("ncSelW"), nce: v("ncSelZ"), lang: lang() };
}
const runNcBtn = document.getElementById("runNcAnalyze");
if (runNcBtn) runNcBtn.addEventListener("click", runNcAnalyze);
async function runNcAnalyze() {
  const req = ncCurrentMapping();
  if (!req.source) return;
  ncState.req = req;
  try {
    const a = await postJSON(`${API}/api/nc_analyze`, req);
    renderNcAnalyze(a);
    runNcAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderNcAnalyze(a) {
  document.getElementById("ncAnalyzeOut").classList.remove("hidden");
  const ci = a.ci_proximal && a.ci_proximal[0] != null ? ` (95% CI ${fmt(a.ci_proximal[0],2)}–${fmt(a.ci_proximal[1],2)})` : "";
  const cards = [
    [tr("近端因果 P2SLS（校正後）", "proximal P2SLS (corrected)"), a.proximal, a.interpretation, true],
    [tr("未校正 A→Y（被未測混淆偏）", "naive A→Y (biased by unmeasured U)"), a.naive,
      tr("用未測混淆 U 推離真值。", "pushed off the truth by the unmeasured U."), false],
    [tr("偵測 A→W（陰性對照，應 0）", "detect A→W (negative control, should be 0)"), a.detect,
      tr(`離 0 達 ${fmt(Math.abs(a.detect_z),1)} 個標準誤＝偏誤訊號。`, `${fmt(Math.abs(a.detect_z),1)} SEs from 0 = the bias signal.`), false],
    [tr("真值", "Truth"), a.true_tau, tr("近端 P2SLS 應還原它。", "proximal P2SLS should recover it.") + ci, false],
  ];
  document.getElementById("ncAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}</div><p>${desc}</p></div>`
  ).join("");
  drawNcAnalyze(a);
}
function drawNcAnalyze(a) {
  if (!document.getElementById("ncAnalyzeChart")) return;
  const labels = [tr("未校正 A→Y", "naive A→Y"), tr("偵測 A→W", "detect A→W"), tr("近端 P2SLS", "proximal P2SLS"), tr("真值", "truth")];
  const vals = [a.naive, a.detect, a.proximal, a.true_tau];
  Plotly.react("ncAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [RED, AMBER, TEAL, GREEN] },
    text: vals.map((v) => fmt(v, 2)), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 22, r: 16, b: 40, l: 50 },
    yaxis: { title: tr("效應估計", "effect estimate"), range: [Math.min(0, ...vals) - 0.1, Math.max(...vals) * 1.18] },
    shapes: [{ type: "line", x0: -0.5, x1: 3.5, y0: a.true_tau, y1: a.true_tau, line: { color: GREEN, width: 2, dash: "dash" } }],
  }), SCENE_CFG);
}

// ④ assumptions
function initNcAssume() {
  if (ncAssumeReady) return;
  ncAssumeReady = true;
  runNcAssumptions(ncState.req || { source: "example_nc", lang: lang() });
}
async function runNcAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_nc", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/nc_assumptions`, body); } catch (e) { return; }
  state.ncDash = out;
  renderNcAssumptions(out);
}
function renderNcAssumptions(out) {
  const hint = document.getElementById("ncAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("ncOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；關鍵設計假設仍需領域判斷。", "Testable checks pass; key design assumptions need domain judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("ncAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ⑤ empirical calibration — button-triggered (numpy/scipy, light)
function initNcMl() { if (ncCalCache) drawNcCal(ncCalCache); }
const runNcCalBtn = document.getElementById("runNcCal");
if (runNcCalBtn) runNcCalBtn.addEventListener("click", async () => {
  const btn = runNcCalBtn; const old = btn.textContent;
  btn.disabled = true; btn.textContent = tr("計算中…", "Computing…");
  try {
    const s = await getJSON(`${API}/api/nc_calibrate?lang=${lang()}`);
    ncCalCache = s; drawNcCal(s);
  } catch (e) { alert(tr("計算失敗：", "Failed: ") + e.message); }
  finally { btn.disabled = false; btn.textContent = old; }
});
function drawNcCal(s) {
  document.getElementById("ncCalOut").classList.remove("hidden");
  if (document.getElementById("ncCalChart")) {
    Plotly.react("ncCalChart", [{
      x: s.bars.labels, y: s.bars.values, type: "bar", marker: { color: [RED, TEAL] },
      text: s.bars.values.map((v) => v.toFixed(1) + "%"), textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 22, r: 16, b: 44, l: 52 },
      yaxis: { title: tr("陰性對照偽陽性率（應 ~5%）", "neg-control false-positive rate (should ~5%)"), range: [0, Math.max(...s.bars.values) * 1.2] },
      shapes: [{ type: "line", x0: -0.5, x1: 1.5, y0: 5, y1: 5, line: { color: GREEN, width: 2, dash: "dash" } }],
      annotations: [{ x: 1.5, y: 5, text: tr("名目 5%", "nominal 5%"), showarrow: false, yshift: 10, xanchor: "right", font: { color: GREEN, size: 11 } }],
    }), SCENE_CFG);
  }
  if (s.cov_bars && document.getElementById("ncCalCovChart")) {
    Plotly.react("ncCalCovChart", [{
      x: s.cov_bars.labels, y: s.cov_bars.values, type: "bar", marker: { color: [RED, TEAL] },
      text: s.cov_bars.values.map((v) => v.toFixed(1) + "%"), textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 22, r: 16, b: 44, l: 52 },
      yaxis: { title: tr("95% CI 涵蓋真值的比例（應 ~95%）", "95% CI coverage of the truth (should ~95%)"), range: [0, 105] },
      shapes: [{ type: "line", x0: -0.5, x1: 1.5, y0: 95, y1: 95, line: { color: GREEN, width: 2, dash: "dash" } }],
      annotations: [{ x: 1.5, y: 95, text: tr("名目 95%", "nominal 95%"), showarrow: false, yshift: 10, xanchor: "right", font: { color: GREEN, size: 11 } }],
    }), SCENE_CFG);
  }
  document.getElementById("ncCalReading").innerHTML = s.reading;
}

// ======================================================================
// MED — Mediation analysis (15th method)
// ======================================================================
const medState = { source: null, columns: [], req: null };
let medLearnReady = false, medPlayReady = false, medAnalyzeReady = false,
    medAssumeReady = false, medMlCache = null;

// ① learn scene: the decomposition TE = NDE + NIE in bars (representative demo numbers)
function drawSceneMed() {
  if (!document.getElementById("medScene")) return;
  const labels = [tr("總效果<br>TE", "total<br>TE"), tr("直接 NDE<br>（其他路徑）", "direct NDE<br>(other paths)"),
    tr("間接 NIE<br>（透過抗體）", "indirect NIE<br>(via antibodies)")];
  const vals = [-1.19, -0.55, -0.64];
  Plotly.react("medScene", [{
    x: labels, y: vals, type: "bar", marker: { color: [INK, TEAL, PURPLE] },
    text: vals.map((v) => v.toFixed(2)), textposition: "outside",
  }], schemaLayout({
    height: 300, margin: { t: 16, r: 14, b: 46, l: 48 },
    xaxis: { visible: true, tickfont: { size: 9.5 } },
    yaxis: { visible: true, title: tr("對感染的效果", "effect on infection"), range: [-1.4, 0.2] },
    annotations: [{ x: 0, y: -1.19, yref: "y", showarrow: false, yshift: -12, font: { color: SLATE, size: 9 },
      text: tr("TE = NDE + NIE（約 54% 被中介）", "TE = NDE + NIE (~54% mediated)") }],
  }), SCENE_CFG);
}
function initMedLearn() { if (medLearnReady) return; medLearnReady = true; drawSceneMed(); }

// ② interactive — mediator-pathway-strength slider
const medStrengthSlider = document.getElementById("medStrengthSlider");
let medPlayTimer = null;
function initMedPlay() { if (medPlayReady) return; medPlayReady = true; refreshMedPlay(); }
function scheduleMedPlay() {
  document.getElementById("medStrengthVal").textContent = Number(medStrengthSlider.value).toFixed(2);
  clearTimeout(medPlayTimer); medPlayTimer = setTimeout(refreshMedPlay, 250);
}
if (medStrengthSlider) medStrengthSlider.addEventListener("input", scheduleMedPlay);
async function refreshMedPlay() {
  const s = medStrengthSlider ? Number(medStrengthSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/med_interactive?strength=${s}&lang=${lang()}`); } catch (e) { return; }
  state.medPlay = d;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = fmt(v, 2); };
  set("medNde", d.nde); set("medNie", d.nie);
  const pm = document.getElementById("medPm"); if (pm) pm.textContent = (d.pm * 100).toFixed(0) + "%";
  const rd = document.getElementById("medPlayReading"); if (rd) rd.innerHTML = d.reading;
  drawMedPlay(d);
}
function drawMedPlay(d) {
  if (!document.getElementById("medPlayChart")) return;
  const g = d.grid;
  Plotly.react("medPlayChart", [
    { x: g.s, y: g.te, mode: "lines+markers", type: "scatter", name: tr("總效果 TE", "total TE"), line: { color: INK, width: 3 }, marker: { size: 5 } },
    { x: g.s, y: g.nde, mode: "lines+markers", type: "scatter", name: tr("直接 NDE", "direct NDE"), line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: g.s, y: g.nie, mode: "lines+markers", type: "scatter", name: tr("間接 NIE", "indirect NIE"), line: { color: PURPLE, width: 3, dash: "dot" }, marker: { size: 5 } },
    { x: [d.strength], y: [d.nie], mode: "markers", type: "scatter", marker: { color: INK, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.18 }, margin: { t: 30, r: 18, b: 44, l: 50 },
    xaxis: { title: tr("中介路徑強度", "mediator-pathway strength") },
    yaxis: { title: tr("對感染的效果", "effect on infection"), range: [Math.min(...g.te) * 1.12, 0.15] },
    shapes: [{ type: "line", x0: g.s[0], x1: g.s[g.s.length - 1], y0: 0, y1: 0, line: { color: "#cbd5e1", width: 1 } }],
  }), SCENE_CFG);
}

// ③ analyze
function initMedAnalyze() { if (medAnalyzeReady) return; medAnalyzeReady = true; document.getElementById("useMedExample").click(); }
function medFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["medSelA", "medSelM", "medSelY", "medSelX"].forEach((id) => document.getElementById(id).innerHTML = opts);
  document.getElementById("medColMap").classList.remove("hidden");
}
function medApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null && el) el.value = v; };
  set("medSelA", d.treat); set("medSelM", d.mediator); set("medSelY", d.outcome); set("medSelX", d.cov);
}
document.getElementById("useMedExample").addEventListener("click", async () => {
  const st = document.getElementById("medDataStatus");
  try {
    const d = await getJSON(`${API}/api/med_example`);
    medState.source = "example_med"; medState.columns = d.columns;
    st.textContent = tr(`已載入內建範例（${d.n} 人，合成虛構）`, `Loaded built-in example (${d.n} people, synthetic)`);
    medFillSelects(d.columns); medApplyDefaults(d.defaults);
    runMedAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("medFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("medDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    medState.source = d.token; medState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    medFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function medCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return { source: medState.source, treat: v("medSelA"), mediator: v("medSelM"),
    outcome: v("medSelY"), cov: v("medSelX"), lang: lang() };
}
const runMedBtn = document.getElementById("runMedAnalyze");
if (runMedBtn) runMedBtn.addEventListener("click", runMedAnalyze);
async function runMedAnalyze() {
  const req = medCurrentMapping();
  if (!req.source) return;
  medState.req = req;
  try {
    const a = await postJSON(`${API}/api/med_analyze`, req);
    renderMedAnalyze(a);
    runMedAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderMedAnalyze(a) {
  document.getElementById("medAnalyzeOut").classList.remove("hidden");
  const ciN = a.ci_nie && a.ci_nie[0] != null ? ` (95% CI ${fmt(a.ci_nie[0],2)}–${fmt(a.ci_nie[1],2)})` : "";
  const ciD = a.ci_nde && a.ci_nde[0] != null ? ` (95% CI ${fmt(a.ci_nde[0],2)}–${fmt(a.ci_nde[1],2)})` : "";
  const cards = [
    [tr("間接效果 NIE（透過抗體 M）", "indirect effect NIE (via antibodies M)"), a.nie, a.interpretation, true],
    [tr("直接效果 NDE（其他路徑）", "direct effect NDE (other pathways)"), a.nde,
      tr("固定中介在沒接種的值、只動暴露。", "holds the mediator at its no-treatment value, moves only exposure.") + ciD, false],
    [tr("總效果 TE = NDE + NIE", "total effect TE = NDE + NIE"), a.te,
      tr(`被中介比例 ≈ ${(a.pm*100).toFixed(0)}%。`, `proportion mediated ≈ ${(a.pm*100).toFixed(0)}%.`) + ciN, false],
    [tr("未校正直接（Y~A+M，偏）", "naive direct (Y~A+M, biased)"), a.naive_direct,
      tr("忽略暴露×中介交互，≠ 真正的 NDE。", "ignores the exposure-mediator interaction, ≠ the true NDE."), false],
  ];
  document.getElementById("medAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}</div><p>${desc}</p></div>`
  ).join("");
  drawMedAnalyze(a);
}
function drawMedAnalyze(a) {
  if (!document.getElementById("medAnalyzeChart")) return;
  const labels = [tr("總效果 TE", "total TE"), tr("直接 NDE", "direct NDE"), tr("間接 NIE", "indirect NIE"), tr("未校正直接", "naive direct")];
  const vals = [a.te, a.nde, a.nie, a.naive_direct];
  Plotly.react("medAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [INK, TEAL, PURPLE, AMBER] },
    text: vals.map((v) => fmt(v, 2)), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 22, r: 16, b: 40, l: 50 },
    yaxis: { title: tr("對感染的效果", "effect on infection"), range: [Math.min(...vals) * 1.2, 0.15] },
    shapes: [{ type: "line", x0: -0.5, x1: 3.5, y0: a.true_te, y1: a.true_te, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: 0, y: a.true_te, text: tr("真值 TE " + fmt(a.true_te, 2), "truth TE " + fmt(a.true_te, 2)), showarrow: false, yshift: -12, font: { color: GREEN, size: 10 } }],
  }), SCENE_CFG);
}

// ④ assumptions
function initMedAssume() {
  if (medAssumeReady) return;
  medAssumeReady = true;
  runMedAssumptions(medState.req || { source: "example_med", lang: lang() });
}
async function runMedAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_med", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/med_assumptions`, body); } catch (e) { return; }
  state.medDash = out;
  renderMedAssumptions(out);
}
function renderMedAssumptions(out) {
  const hint = document.getElementById("medAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("medOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；關鍵設計假設仍需領域判斷。", "Testable checks pass; key design assumptions need domain judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("medAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ⑤ real-ML natural effects — button-triggered (loads scikit-learn)
function initMedMl() { if (medMlCache) drawMedMl(medMlCache); }
const runMedMlBtn = document.getElementById("runMedMl");
if (runMedMlBtn) runMedMlBtn.addEventListener("click", async () => {
  const btn = runMedMlBtn; const old = btn.textContent;
  btn.disabled = true; btn.textContent = tr("計算中（載入 ML 套件）…", "Computing (loading ML)…");
  try {
    const s = await getJSON(`${API}/api/med_natural_ml?lang=${lang()}`);
    medMlCache = s; drawMedMl(s);
  } catch (e) { alert(tr("計算失敗：", "Failed: ") + e.message); }
  finally { btn.disabled = false; btn.textContent = old; }
});
function drawMedMl(s) {
  document.getElementById("medMlOut").classList.remove("hidden");
  if (document.getElementById("medMlChart")) {
    Plotly.react("medMlChart", [{
      x: s.bars.labels, y: s.bars.values, type: "bar", marker: { color: [AMBER, TEAL, GREEN] },
      text: s.bars.values.map((v) => v.toFixed(2)), textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 22, r: 16, b: 44, l: 52 },
      yaxis: { title: tr("間接效果 NIE", "indirect effect NIE"), range: [Math.min(...s.bars.values) * 1.2, 0.1] },
      shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: s.nie_true, y1: s.nie_true, line: { color: GREEN, width: 2, dash: "dash" } }],
    }), SCENE_CFG);
  }
  document.getElementById("medMlReading").innerHTML = s.reading;
}

// ======================================================================
// PS — Propensity Score (16th method)
// ======================================================================
const psState = { source: null, columns: [], req: null };
let psLearnReady = false, psPlayReady = false, psAnalyzeReady = false,
    psAssumeReady = false, psMlCache = null;

// ① learn scene: the confounding-by-indication triangle X → A, X → Y, A → Y
function _psArrow(fromx, fromy, tox, toy, color) {
  return { x: tox, y: toy, ax: fromx, ay: fromy, xref: "x", yref: "y", axref: "x", ayref: "y",
    showarrow: true, arrowhead: 3, arrowsize: 1.1, arrowwidth: 2.4, arrowcolor: color, text: "", standoff: 14, startstandoff: 14 };
}
function drawScenePs() {
  if (!document.getElementById("psScene")) return;
  const nodes = [
    { x: 2, y: 2.4, t: tr("共變項 X<br>（嚴重度）", "covariate X<br>(severity)"), c: "#b45309" },
    { x: 1, y: 1, t: tr("治療 A（接種）", "treatment A"), c: TEAL },
    { x: 3, y: 1, t: tr("結果 Y", "outcome Y"), c: "#c0504d" },
  ];
  Plotly.react("psScene", [{
    x: nodes.map((n) => n.x), y: nodes.map((n) => n.y), mode: "markers+text", type: "scatter",
    text: nodes.map((n) => n.t), textposition: ["top center", "bottom center", "bottom center"],
    marker: { size: 26, color: nodes.map((n) => n.c) }, textfont: { size: 11 }, hoverinfo: "skip",
  }], schemaLayout({
    height: 300, margin: { t: 24, r: 20, b: 30, l: 20 },
    xaxis: { visible: false, range: [0.3, 3.7] }, yaxis: { visible: false, range: [0.4, 3.0] },
    annotations: [
      _psArrow(2, 2.4, 1, 1, "#c0504d"),       // X → A
      _psArrow(2, 2.4, 3, 1, "#c0504d"),       // X → Y
      _psArrow(1, 1, 3, 1, TEAL),              // A → Y (the effect)
      { x: 2, y: 1.0, text: tr("A→Y＝想估的效果", "A→Y = the effect we want"), showarrow: false, yshift: 14, font: { size: 9.5, color: TEAL } },
      { x: 2, y: 0.62, text: tr("適應症混淆：X 同時推動接種與結果（紅箭頭）→ 直接比 A 會偏", "confounding by indication: X drives both A and Y (red) → comparing A directly is biased"), showarrow: false, font: { size: 9.5, color: SLATE } },
    ],
  }), SCENE_CFG);
}
function initPsLearn() { if (psLearnReady) return; psLearnReady = true; drawScenePs(); }

// ② interactive — confounding-strength slider
const psConfSlider = document.getElementById("psConfSlider");
let psPlayTimer = null;
function initPsPlay() { if (psPlayReady) return; psPlayReady = true; refreshPsPlay(); }
function schedulePsPlay() {
  document.getElementById("psConfVal").textContent = Number(psConfSlider.value).toFixed(2);
  clearTimeout(psPlayTimer); psPlayTimer = setTimeout(refreshPsPlay, 250);
}
if (psConfSlider) psConfSlider.addEventListener("input", schedulePsPlay);
async function refreshPsPlay() {
  const c = psConfSlider ? Number(psConfSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/ps_interactive?conf=${c}&lang=${lang()}`); } catch (e) { return; }
  state.psPlay = d;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = fmt(v, 2); };
  set("psCrude", d.crude); set("psIptw", d.iptw); set("psOverlap", d.overlap);
  const rd = document.getElementById("psPlayReading"); if (rd) rd.innerHTML = d.reading;
  drawPsPlay(d);
}
function drawPsPlay(d) {
  if (!document.getElementById("psPlayChart")) return;
  const g = d.grid;
  Plotly.react("psPlayChart", [
    { x: g.conf, y: g.crude, mode: "lines+markers", type: "scatter", name: tr("未校正", "crude"), line: { color: AMBER, width: 3 }, marker: { size: 5 } },
    { x: g.conf, y: g.iptw, mode: "lines+markers", type: "scatter", name: tr("IPTW", "IPTW"), line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: g.conf, y: g.overlap, mode: "lines+markers", type: "scatter", name: tr("重疊權重", "overlap"), line: { color: PURPLE, width: 3, dash: "dot" }, marker: { size: 5 } },
    { x: [d.conf], y: [d.crude], mode: "markers", type: "scatter", marker: { color: INK, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.18 }, margin: { t: 30, r: 18, b: 44, l: 50 },
    xaxis: { title: tr("適應症混淆強度", "confounding-by-indication strength") },
    yaxis: { title: tr("估計效果", "estimated effect"), range: [g.true_ate - 0.4, Math.max(...g.crude) * 1.08] },
    shapes: [{ type: "line", x0: g.conf[0], x1: g.conf[g.conf.length - 1], y0: g.true_ate, y1: g.true_ate, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: g.conf[0], y: g.true_ate, text: tr("真值 " + fmt(g.true_ate, 1), "truth " + fmt(g.true_ate, 1)), showarrow: false, yshift: 11, xanchor: "left", font: { color: GREEN, size: 10 } }],
  }), SCENE_CFG);
}

// ③ analyze
function initPsAnalyze() { if (psAnalyzeReady) return; psAnalyzeReady = true; document.getElementById("usePsExample").click(); }
function psFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["psSelA", "psSelY", "psSelX"].forEach((id) => document.getElementById(id).innerHTML = opts);
  document.getElementById("psColMap").classList.remove("hidden");
}
function psApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null && el) el.value = v; };
  set("psSelA", d.treat); set("psSelY", d.outcome); set("psSelX", d.cov);
}
document.getElementById("usePsExample").addEventListener("click", async () => {
  const st = document.getElementById("psDataStatus");
  try {
    const d = await getJSON(`${API}/api/ps_example`);
    psState.source = "example_ps"; psState.columns = d.columns;
    st.textContent = tr(`已載入內建範例（${d.n} 人，合成虛構）`, `Loaded built-in example (${d.n} people, synthetic)`);
    psFillSelects(d.columns); psApplyDefaults(d.defaults);
    runPsAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("psFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("psDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    psState.source = d.token; psState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    psFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function psCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return { source: psState.source, treat: v("psSelA"), outcome: v("psSelY"), cov: v("psSelX"), lang: lang() };
}
const runPsBtn = document.getElementById("runPsAnalyze");
if (runPsBtn) runPsBtn.addEventListener("click", runPsAnalyze);
async function runPsAnalyze() {
  const req = psCurrentMapping();
  if (!req.source) return;
  psState.req = req;
  try {
    const a = await postJSON(`${API}/api/ps_analyze`, req);
    renderPsAnalyze(a);
    runPsAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderPsAnalyze(a) {
  document.getElementById("psAnalyzeOut").classList.remove("hidden");
  const ci = a.ci_iptw && a.ci_iptw[0] != null ? ` (95% CI ${fmt(a.ci_iptw[0],2)}–${fmt(a.ci_iptw[1],2)})` : "";
  const cards = [
    [tr("未校正差異（偏）", "crude difference (biased)"), a.crude,
      tr("直接比接種 vs 未接種，被適應症混淆撐高。", "vaccinated vs unvaccinated directly — inflated by confounding by indication."), false],
    [tr("IPTW（ATE）", "IPTW (ATE)"), a.iptw, a.interpretation + ci, true],
    [tr("重疊權重（ATO）", "overlap weighting (ATO)"), a.overlap,
      tr("權重有界、最穩定的加權估計。", "bounded weights — the most stable weighted estimate."), false],
    [tr("PS 配對（ATT）／迴歸校正", "PS matching (ATT) / regression adj."), a.att,
      tr(`PS 配對 ATT ≈ ${fmt(a.att,2)}；迴歸校正 ≈ ${fmt(a.adjust,2)}。平衡證據：SMD ${fmt(a.smd_before,2)} → ${fmt(a.smd_after,2)}。`,
         `PS-matching ATT ≈ ${fmt(a.att,2)}; regression adjustment ≈ ${fmt(a.adjust,2)}. Balance: SMD ${fmt(a.smd_before,2)} → ${fmt(a.smd_after,2)}.`), false],
  ];
  document.getElementById("psAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}</div><p>${desc}</p></div>`
  ).join("");
  drawPsAnalyze(a);
}
function drawPsAnalyze(a) {
  if (!document.getElementById("psAnalyzeChart")) return;
  const labels = [tr("未校正", "crude"), tr("迴歸校正", "regression adj."), tr("IPTW", "IPTW"), tr("重疊權重", "overlap"), tr("PS 配對", "PS matching")];
  const vals = [a.crude, a.adjust, a.iptw, a.overlap, a.att];
  Plotly.react("psAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [AMBER, "#7c8aa0", TEAL, PURPLE, "#3f8a6a"] },
    text: vals.map((v) => fmt(v, 2)), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 22, r: 16, b: 44, l: 50 },
    yaxis: { title: tr("估計效果", "estimated effect"), range: [0, Math.max(...vals) * 1.18] },
    shapes: [{ type: "line", x0: -0.5, x1: 4.5, y0: a.true_ate, y1: a.true_ate, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: 4, y: a.true_ate, text: tr("真值 " + fmt(a.true_ate, 1), "truth " + fmt(a.true_ate, 1)), showarrow: false, yshift: 11, font: { color: GREEN, size: 10 } }],
  }), SCENE_CFG);
}

// ④ assumptions
function initPsAssume() {
  if (psAssumeReady) return;
  psAssumeReady = true;
  runPsAssumptions(psState.req || { source: "example_ps", lang: lang() });
}
async function runPsAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_ps", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/ps_assumptions`, body); } catch (e) { return; }
  state.psDash = out;
  renderPsAssumptions(out);
}
function renderPsAssumptions(out) {
  const hint = document.getElementById("psAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("psOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；無未測混淆仍需領域判斷。", "Testable checks pass; no-unmeasured-confounding still needs domain judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("psAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ⑤ real-ML propensity score — button-triggered (loads scikit-learn)
function initPsMl() { if (psMlCache) drawPsMl(psMlCache); }
const runPsMlBtn = document.getElementById("runPsMl");
if (runPsMlBtn) runPsMlBtn.addEventListener("click", async () => {
  const btn = runPsMlBtn; const old = btn.textContent;
  btn.disabled = true; btn.textContent = tr("計算中（載入 ML 套件）…", "Computing (loading ML)…");
  try {
    const s = await getJSON(`${API}/api/ps_ml?lang=${lang()}`);
    psMlCache = s; drawPsMl(s);
  } catch (e) { alert(tr("計算失敗：", "Failed: ") + e.message); }
  finally { btn.disabled = false; btn.textContent = old; }
});
function drawPsMl(s) {
  document.getElementById("psMlOut").classList.remove("hidden");
  if (document.getElementById("psMlChart")) {
    Plotly.react("psMlChart", [{
      x: s.bars.labels, y: s.bars.values, type: "bar", marker: { color: [AMBER, TEAL, GREEN] },
      text: s.bars.values.map((v) => v.toFixed(2)), textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 22, r: 16, b: 44, l: 52 },
      yaxis: { title: tr("IPTW 後的 ATE", "ATE after IPTW"), range: [0, Math.max(...s.bars.values) * 1.18] },
      shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: s.ate_true, y1: s.ate_true, line: { color: GREEN, width: 2, dash: "dash" } }],
    }), SCENE_CFG);
  }
  document.getElementById("psMlReading").innerHTML = s.reading;
}

// ======================================================================
// TMLE — doubly-robust / targeted ML (17th method)
// ======================================================================
const tmleState = { source: null, columns: [], req: null };
let tmleLearnReady = false, tmlePlayReady = false, tmleAnalyzeReady = false,
    tmleAssumeReady = false, tmleMlCache = null;

function drawSceneTmle() {
  if (!document.getElementById("tmleScene")) return;
  const nodes = [
    { x: 2, y: 2.4, t: tr("共變項 X<br>（嚴重度，非線性）", "covariate X<br>(severity, non-linear)"), c: "#b45309" },
    { x: 1, y: 1, t: tr("治療 A（接種）", "treatment A"), c: TEAL },
    { x: 3, y: 1, t: tr("結果 Y", "outcome Y"), c: "#c0504d" },
  ];
  Plotly.react("tmleScene", [{
    x: nodes.map((n) => n.x), y: nodes.map((n) => n.y), mode: "markers+text", type: "scatter",
    text: nodes.map((n) => n.t), textposition: ["top center", "bottom center", "bottom center"],
    marker: { size: 26, color: nodes.map((n) => n.c) }, textfont: { size: 11 }, hoverinfo: "skip",
  }], schemaLayout({
    height: 300, margin: { t: 24, r: 20, b: 30, l: 20 },
    xaxis: { visible: false, range: [0.3, 3.7] }, yaxis: { visible: false, range: [0.4, 3.0] },
    annotations: [
      _psArrow(2, 2.4, 1, 1, "#c0504d"), _psArrow(2, 2.4, 3, 1, "#c0504d"), _psArrow(1, 1, 3, 1, TEAL),
      { x: 2, y: 1.0, text: tr("A→Y＝想估的效果", "A→Y = the effect we want"), showarrow: false, yshift: 14, font: { size: 9.5, color: TEAL } },
      { x: 2, y: 0.62, text: tr("兩個模型（結果迴歸＋傾向分數）擋後門：其一對就不偏（雙重穩健）", "two models (outcome regression + propensity) block the back door: unbiased if either is right"), showarrow: false, font: { size: 9.5, color: SLATE } },
    ],
  }), SCENE_CFG);
}
function initTmleLearn() { if (tmleLearnReady) return; tmleLearnReady = true; drawSceneTmle(); }

const tmleConfSlider = document.getElementById("tmleConfSlider");
let tmlePlayTimer = null;
function initTmlePlay() { if (tmlePlayReady) return; tmlePlayReady = true; refreshTmlePlay(); }
function scheduleTmlePlay() {
  document.getElementById("tmleConfVal").textContent = Number(tmleConfSlider.value).toFixed(2);
  clearTimeout(tmlePlayTimer); tmlePlayTimer = setTimeout(refreshTmlePlay, 250);
}
if (tmleConfSlider) tmleConfSlider.addEventListener("input", scheduleTmlePlay);
async function refreshTmlePlay() {
  const c = tmleConfSlider ? Number(tmleConfSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/tmle_interactive?conf=${c}&lang=${lang()}`); } catch (e) { return; }
  state.tmlePlay = d;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = fmt(v, 2); };
  set("tmleCrude", d.crude); set("tmleAipw", d.aipw); set("tmleTmle", d.tmle);
  const rd = document.getElementById("tmlePlayReading"); if (rd) rd.innerHTML = d.reading;
  drawTmlePlay(d);
}
function drawTmlePlay(d) {
  if (!document.getElementById("tmlePlayChart")) return;
  const g = d.grid;
  Plotly.react("tmlePlayChart", [
    { x: g.conf, y: g.crude, mode: "lines+markers", type: "scatter", name: tr("未校正", "crude"), line: { color: AMBER, width: 3 }, marker: { size: 5 } },
    { x: g.conf, y: g.aipw, mode: "lines+markers", type: "scatter", name: tr("AIPW", "AIPW"), line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: g.conf, y: g.tmle, mode: "lines+markers", type: "scatter", name: tr("TMLE", "TMLE"), line: { color: PURPLE, width: 3, dash: "dot" }, marker: { size: 5 } },
    { x: [d.conf], y: [d.crude], mode: "markers", type: "scatter", marker: { color: INK, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.18 }, margin: { t: 30, r: 18, b: 44, l: 50 },
    xaxis: { title: tr("混淆強度", "confounding strength") },
    yaxis: { title: tr("估計效果", "estimated effect"), range: [g.true_ate - 0.4, Math.max(...g.crude) * 1.08] },
    shapes: [{ type: "line", x0: g.conf[0], x1: g.conf[g.conf.length - 1], y0: g.true_ate, y1: g.true_ate, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: g.conf[0], y: g.true_ate, text: tr("真值 " + fmt(g.true_ate, 1), "truth " + fmt(g.true_ate, 1)), showarrow: false, yshift: 11, xanchor: "left", font: { color: GREEN, size: 10 } }],
  }), SCENE_CFG);
}

function initTmleAnalyze() { if (tmleAnalyzeReady) return; tmleAnalyzeReady = true; document.getElementById("useTmleExample").click(); }
function tmleFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["tmleSelA", "tmleSelY", "tmleSelX"].forEach((id) => document.getElementById(id).innerHTML = opts);
  document.getElementById("tmleColMap").classList.remove("hidden");
}
function tmleApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null && el) el.value = v; };
  set("tmleSelA", d.treat); set("tmleSelY", d.outcome); set("tmleSelX", d.cov);
}
document.getElementById("useTmleExample").addEventListener("click", async () => {
  const st = document.getElementById("tmleDataStatus");
  try {
    const d = await getJSON(`${API}/api/tmle_example`);
    tmleState.source = "example_tmle"; tmleState.columns = d.columns;
    st.textContent = tr(`已載入內建範例（${d.n} 人，合成虛構）`, `Loaded built-in example (${d.n} people, synthetic)`);
    tmleFillSelects(d.columns); tmleApplyDefaults(d.defaults);
    runTmleAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("tmleFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("tmleDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    tmleState.source = d.token; tmleState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    tmleFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function tmleCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  return { source: tmleState.source, treat: v("tmleSelA"), outcome: v("tmleSelY"), cov: v("tmleSelX"), lang: lang() };
}
const runTmleBtn = document.getElementById("runTmleAnalyze");
if (runTmleBtn) runTmleBtn.addEventListener("click", runTmleAnalyze);
async function runTmleAnalyze() {
  const req = tmleCurrentMapping();
  if (!req.source) return;
  tmleState.req = req;
  try {
    const a = await postJSON(`${API}/api/tmle_analyze`, req);
    renderTmleAnalyze(a);
    runTmleAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderTmleAnalyze(a) {
  document.getElementById("tmleAnalyzeOut").classList.remove("hidden");
  const ci = a.ci && a.ci[0] != null ? ` (95% CI ${fmt(a.ci[0],2)}–${fmt(a.ci[1],2)})` : "";
  const cards = [
    [tr("未校正差異（偏）", "crude difference (biased)"), a.crude,
      tr("直接比接種 vs 未接種，被適應症混淆＋非線性 X 撐高。", "vaccinated vs unvaccinated directly — inflated by confounding and the non-linear X."), false],
    [tr("TMLE（targeting）", "TMLE (targeted)"), a.tmle, a.interpretation + ci, true],
    [tr("雙重穩健 AIPW", "doubly-robust AIPW"), a.aipw,
      tr("結果模型或傾向分數其一對就不偏。", "unbiased if either the outcome model or the propensity is right."), false],
    [tr("g-computation／IPTW", "g-computation / IPTW"), a.gcomp,
      tr(`g-computation ≈ ${fmt(a.gcomp,2)}（只用結果模型）；IPTW ≈ ${fmt(a.iptw,2)}（只用傾向分數）。`,
         `g-computation ≈ ${fmt(a.gcomp,2)} (outcome model only); IPTW ≈ ${fmt(a.iptw,2)} (propensity only).`), false],
  ];
  document.getElementById("tmleAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}</div><p>${desc}</p></div>`
  ).join("");
  drawTmleAnalyze(a);
}
function drawTmleAnalyze(a) {
  if (!document.getElementById("tmleAnalyzeChart")) return;
  const labels = [tr("未校正", "crude"), tr("g-comp", "g-comp"), tr("IPTW", "IPTW"), tr("AIPW", "AIPW"), tr("TMLE", "TMLE")];
  const vals = [a.crude, a.gcomp, a.iptw, a.aipw, a.tmle];
  Plotly.react("tmleAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [AMBER, "#7c8aa0", "#3f8a6a", TEAL, PURPLE] },
    text: vals.map((v) => fmt(v, 2)), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 22, r: 16, b: 44, l: 50 },
    yaxis: { title: tr("估計效果", "estimated effect"), range: [0, Math.max(...vals) * 1.18] },
    shapes: [{ type: "line", x0: -0.5, x1: 4.5, y0: a.true_ate, y1: a.true_ate, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: 4, y: a.true_ate, text: tr("真值 " + fmt(a.true_ate, 1), "truth " + fmt(a.true_ate, 1)), showarrow: false, yshift: 11, font: { color: GREEN, size: 10 } }],
  }), SCENE_CFG);
}

function initTmleAssume() {
  if (tmleAssumeReady) return;
  tmleAssumeReady = true;
  runTmleAssumptions(tmleState.req || { source: "example_tmle", lang: lang() });
}
async function runTmleAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_tmle", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/tmle_assumptions`, body); } catch (e) { return; }
  state.tmleDash = out;
  renderTmleAssumptions(out);
}
function renderTmleAssumptions(out) {
  const hint = document.getElementById("tmleAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("tmleOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；無未測混淆與「至少一模型對」仍需判斷。", "Testable checks pass; no-unmeasured-confounding and ‘at least one model correct’ still need judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("tmleAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

function initTmleMl() { if (tmleMlCache) drawTmleMl(tmleMlCache); }
const runTmleMlBtn = document.getElementById("runTmleMl");
if (runTmleMlBtn) runTmleMlBtn.addEventListener("click", async () => {
  const btn = runTmleMlBtn; const old = btn.textContent;
  btn.disabled = true; btn.textContent = tr("計算中（載入 ML 套件）…", "Computing (loading ML)…");
  try {
    const s = await getJSON(`${API}/api/tmle_ml?lang=${lang()}`);
    tmleMlCache = s; drawTmleMl(s);
  } catch (e) { alert(tr("計算失敗：", "Failed: ") + e.message); }
  finally { btn.disabled = false; btn.textContent = old; }
});
function drawTmleMl(s) {
  document.getElementById("tmleMlOut").classList.remove("hidden");
  if (document.getElementById("tmleMlChart")) {
    Plotly.react("tmleMlChart", [{
      x: s.bars.labels, y: s.bars.values, type: "bar", marker: { color: [AMBER, TEAL, GREEN] },
      text: s.bars.values.map((v) => v.toFixed(2)), textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 22, r: 16, b: 44, l: 52 },
      yaxis: { title: tr("估計 ATE", "estimated ATE"), range: [0, Math.max(...s.bars.values) * 1.18] },
      shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: s.ate_true, y1: s.ate_true, line: { color: GREEN, width: 2, dash: "dash" } }],
    }), SCENE_CFG);
  }
  document.getElementById("tmleMlReading").innerHTML = s.reading;
}

// ======================================================================
// GM — G-methods (time-varying confounding, 18th method)
// ======================================================================
const gmState = { source: null };
let gmLearnReady = false, gmPlayReady = false, gmAnalyzeReady = false,
    gmAssumeReady = false, gmMlCache = null;

// ① learn scene: the treatment–confounder feedback DAG L0→A0→L1→A1→Y
function drawSceneGm() {
  if (!document.getElementById("gmScene")) return;
  const N = [
    { x: 0.6, y: 2.3, t: "L₀", c: "#7c5fae" }, { x: 0.6, y: 1.0, t: tr("A₀ 治療", "A₀"), c: TEAL },
    { x: 2.3, y: 2.3, t: "L₁", c: "#7c5fae" }, { x: 2.3, y: 1.0, t: tr("A₁ 治療", "A₁"), c: TEAL },
    { x: 3.9, y: 1.65, t: "Y", c: "#c0504d" },
  ];
  const arr = (fx, fy, tx, ty, c) => _psArrow(fx, fy, tx, ty, c);
  Plotly.react("gmScene", [{
    x: N.map((n) => n.x), y: N.map((n) => n.y), mode: "markers+text", type: "scatter",
    text: N.map((n) => n.t), textposition: "middle center",
    marker: { size: 30, color: N.map((n) => n.c) }, textfont: { size: 11, color: "#fff" }, hoverinfo: "skip",
  }], schemaLayout({
    height: 300, margin: { t: 18, r: 16, b: 26, l: 16 },
    xaxis: { visible: false, range: [0.2, 4.3] }, yaxis: { visible: false, range: [0.5, 2.8] },
    annotations: [
      arr(0.6, 2.3, 0.6, 1.0, "#c0504d"),   // L0→A0
      arr(0.6, 2.3, 2.3, 2.3, INK),         // L0→L1
      arr(0.6, 1.0, 2.3, 2.3, INK),         // A0→L1 (feedback)
      arr(2.3, 2.3, 2.3, 1.0, "#c0504d"),   // L1→A1
      arr(2.3, 2.3, 3.9, 1.65, "#c0504d"),  // L1→Y
      arr(0.6, 1.0, 3.9, 1.65, TEAL),       // A0→Y
      arr(2.3, 1.0, 3.9, 1.65, TEAL),       // A1→Y
      { x: 1.45, y: 2.5, text: tr("A₀→L₁＝回饋", "A₀→L₁ = feedback"), showarrow: false, font: { size: 9, color: SLATE } },
      { x: 2.1, y: 0.66, text: tr("青＝效果 A→Y；紅＝混淆", "teal = effect A→Y; red = confounding"), showarrow: false, font: { size: 9, color: SLATE } },
    ],
  }), SCENE_CFG);
}
function initGmLearn() { if (gmLearnReady) return; gmLearnReady = true; drawSceneGm(); }

// ② interactive — feedback-strength slider
const gmFbSlider = document.getElementById("gmFbSlider");
let gmPlayTimer = null;
function initGmPlay() { if (gmPlayReady) return; gmPlayReady = true; refreshGmPlay(); }
function scheduleGmPlay() {
  document.getElementById("gmFbVal").textContent = Number(gmFbSlider.value).toFixed(2);
  clearTimeout(gmPlayTimer); gmPlayTimer = setTimeout(refreshGmPlay, 250);
}
if (gmFbSlider) gmFbSlider.addEventListener("input", scheduleGmPlay);
async function refreshGmPlay() {
  const f = gmFbSlider ? Number(gmFbSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/gm_interactive?feedback=${f}&lang=${lang()}`); } catch (e) { return; }
  state.gmPlay = d;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = fmt(v, 2); };
  set("gmUnadj", d.unadj); set("gmAdj", d.adj); set("gmGform", d.gformula);
  const rd = document.getElementById("gmPlayReading"); if (rd) rd.innerHTML = d.reading;
  drawGmPlay(d);
}
function drawGmPlay(d) {
  if (!document.getElementById("gmPlayChart")) return;
  const g = d.grid;
  Plotly.react("gmPlayChart", [
    { x: g.fb, y: g.truth, mode: "lines", type: "scatter", name: tr("真值", "truth"), line: { color: GREEN, width: 2, dash: "dash" } },
    { x: g.fb, y: g.unadj, mode: "lines+markers", type: "scatter", name: tr("不校正", "unadjusted"), line: { color: AMBER, width: 3 }, marker: { size: 5 } },
    { x: g.fb, y: g.adj, mode: "lines+markers", type: "scatter", name: tr("校正 Lₜ", "adjusted for Lₜ"), line: { color: "#b45309", width: 3, dash: "dot" }, marker: { size: 5 } },
    { x: g.fb, y: g.gformula, mode: "lines+markers", type: "scatter", name: "g-formula", line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: g.fb, y: g.iptw, mode: "lines+markers", type: "scatter", name: "IPTW-MSM", line: { color: PURPLE, width: 3 }, marker: { size: 5 } },
    { x: [d.feedback], y: [d.gformula], mode: "markers", type: "scatter", marker: { color: INK, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 320, legend: { orientation: "h", y: 1.18 }, margin: { t: 32, r: 18, b: 44, l: 50 },
    xaxis: { title: tr("治療↔混淆回饋強度", "treatment–confounder feedback strength") },
    yaxis: { title: tr("估計效果", "estimated effect") },
  }), SCENE_CFG);
}

// ③ analyze (fixed columns; load + auto-run)
function initGmAnalyze() { if (gmAnalyzeReady) return; gmAnalyzeReady = true; document.getElementById("useGmExample").click(); }
document.getElementById("useGmExample").addEventListener("click", async () => {
  const st = document.getElementById("gmDataStatus");
  try {
    const d = await getJSON(`${API}/api/gm_example`);
    gmState.source = "example_gm";
    st.textContent = tr(`已載入內建範例（${d.n} 人，合成虛構）`, `Loaded built-in example (${d.n} people, synthetic)`);
    runGmAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("gmFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("gmDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    gmState.source = d.token;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    runGmAnalyze();
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
async function runGmAnalyze() {
  if (!gmState.source) return;
  try {
    const a = await postJSON(`${API}/api/gm_analyze`, { source: gmState.source, lang: lang() });
    renderGmAnalyze(a);
    runGmAssumptions();
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderGmAnalyze(a) {
  document.getElementById("gmAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("不校正（被混淆）", "unadjusted (confounded)"), a.naive_unadj,
      tr("忽略時變混淆，病重者較常用藥、也較糟，方向都可能反。", "ignores time-varying confounding — can even flip sign."), false],
    [tr("校正 Lₜ（偏）", "adjusted for Lₜ (biased)"), a.naive_adj,
      tr("L₁ 是中介＋對撞，條件控制反而擋掉 A→L→Y 的效果。", "L₁ is a mediator + collider; conditioning blocks the A→L→Y effect."), false],
    [tr("g-formula", "g-formula"), a.gformula, a.interpretation, true],
    [tr("IPTW-MSM", "IPTW-MSM"), a.iptw,
      tr(`邊際結構模型加權估計；真值 ${fmt(a.true_effect,2)}。`, `marginal structural model estimate; truth ${fmt(a.true_effect,2)}.`), false],
  ];
  document.getElementById("gmAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}</div><p>${desc}</p></div>`
  ).join("");
  drawGmAnalyze(a);
}
function drawGmAnalyze(a) {
  if (!document.getElementById("gmAnalyzeChart")) return;
  const labels = [tr("不校正", "unadjusted"), tr("校正 Lₜ", "adj. Lₜ"), "g-formula", "IPTW-MSM"];
  const vals = [a.naive_unadj, a.naive_adj, a.gformula, a.iptw];
  Plotly.react("gmAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [AMBER, "#b45309", TEAL, PURPLE] },
    text: vals.map((v) => fmt(v, 2)), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 22, r: 16, b: 40, l: 50 },
    yaxis: { title: tr("估計效果", "estimated effect"), range: [Math.min(a.gformula, a.iptw, a.true_effect) * 1.2, Math.max(a.naive_unadj, 0.3) + 0.4] },
    shapes: [{ type: "line", x0: -0.5, x1: 3.5, y0: a.true_effect, y1: a.true_effect, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: 3, y: a.true_effect, text: tr("真值 " + fmt(a.true_effect, 1), "truth " + fmt(a.true_effect, 1)), showarrow: false, yshift: -12, font: { color: GREEN, size: 10 } }],
  }), SCENE_CFG);
}

// ④ assumptions
function initGmAssume() { if (gmAssumeReady) return; gmAssumeReady = true; runGmAssumptions(); }
async function runGmAssumptions() {
  const src = gmState.source || "example_gm";
  let out;
  try { out = await postJSON(`${API}/api/gm_assumptions`, { source: src, lang: lang() }); } catch (e) { return; }
  state.gmDash = out;
  renderGmAssumptions(out);
}
function renderGmAssumptions(out) {
  const hint = document.getElementById("gmAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("gmOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；序列可交換仍需領域判斷。", "Testable checks pass; sequential exchangeability still needs judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("gmAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ⑤ real-ML g-formula — button-triggered (loads scikit-learn)
function initGmMl() { if (gmMlCache) drawGmMl(gmMlCache); }
const runGmMlBtn = document.getElementById("runGmMl");
if (runGmMlBtn) runGmMlBtn.addEventListener("click", async () => {
  const btn = runGmMlBtn; const old = btn.textContent;
  btn.disabled = true; btn.textContent = tr("計算中（載入 ML 套件）…", "Computing (loading ML)…");
  try {
    const s = await getJSON(`${API}/api/gm_ml?lang=${lang()}`);
    gmMlCache = s; drawGmMl(s);
  } catch (e) { alert(tr("計算失敗：", "Failed: ") + e.message); }
  finally { btn.disabled = false; btn.textContent = old; }
});
function drawGmMl(s) {
  document.getElementById("gmMlOut").classList.remove("hidden");
  if (document.getElementById("gmMlChart")) {
    Plotly.react("gmMlChart", [{
      x: s.bars.labels, y: s.bars.values, type: "bar", marker: { color: [AMBER, TEAL, GREEN] },
      text: s.bars.values.map((v) => v.toFixed(2)), textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 22, r: 16, b: 44, l: 52 },
      yaxis: { title: tr("估計效果", "estimated effect") },
      shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: s.truth, y1: s.truth, line: { color: GREEN, width: 2, dash: "dash" } }],
    }), SCENE_CFG);
  }
  document.getElementById("gmMlReading").innerHTML = s.reading;
}

// ======================================================================
// TND — Test-Negative Design (19th method)
// ======================================================================
const tndState = { source: null };
let tndLearnReady = false, tndPlayReady = false, tndAnalyzeReady = false,
    tndAssumeReady = false, tndMlCache = null;

// ① learn scene: H (care-seeking) → V & tested; conditioning on 'tested' (a collider)
function drawSceneTnd() {
  if (!document.getElementById("tndScene")) return;
  const N = [
    { x: 2.1, y: 2.4, t: tr("就醫傾向 H", "care-seek H"), c: "#5b7aa8" },
    { x: 0.7, y: 1.3, t: tr("接種 V", "vaccine V"), c: TEAL },
    { x: 3.5, y: 1.3, t: tr("目標感染 Y", "target Y"), c: "#c0504d" },
    { x: 2.1, y: 0.4, t: tr("被檢驗 S", "tested S"), c: "#64748b" },
  ];
  const arr = (fx, fy, tx, ty, c) => _psArrow(fx, fy, tx, ty, c);
  Plotly.react("tndScene", [{
    x: N.map((n) => n.x), y: N.map((n) => n.y), mode: "markers+text", type: "scatter",
    text: N.map((n) => n.t), textposition: "middle center",
    marker: { size: 30, color: N.map((n) => n.c), symbol: ["circle", "circle", "circle", "square"] },
    textfont: { size: 10, color: "#fff" }, hoverinfo: "skip",
  }], schemaLayout({
    height: 300, margin: { t: 18, r: 16, b: 26, l: 16 },
    xaxis: { visible: false, range: [0.2, 4.0] }, yaxis: { visible: false, range: [0.0, 2.8] },
    annotations: [
      arr(2.1, 2.4, 0.7, 1.3, "#c0504d"),   // H→V
      arr(2.1, 2.4, 2.1, 0.4, "#c0504d"),   // H→S
      arr(0.7, 1.3, 3.5, 1.3, TEAL),        // V→Y (effect)
      arr(3.5, 1.3, 2.1, 0.4, INK),         // Y→S (symptoms→tested)
      { x: 2.1, y: 0.08, text: tr("方框＝條件在「被檢驗」上（對撞）；TND 用陰性對照保持非差別", "box = conditioning on 'tested' (a collider); TND keeps it non-differential via test-negative controls"), showarrow: false, font: { size: 8.5, color: SLATE } },
    ],
  }), SCENE_CFG);
}
function initTndLearn() { if (tndLearnReady) return; tndLearnReady = true; drawSceneTnd(); }

// ② interactive — care-seeking-strength slider
const tndCsSlider = document.getElementById("tndCsSlider");
let tndPlayTimer = null;
function initTndPlay() { if (tndPlayReady) return; tndPlayReady = true; refreshTndPlay(); }
function scheduleTndPlay() {
  document.getElementById("tndCsVal").textContent = Number(tndCsSlider.value).toFixed(2);
  clearTimeout(tndPlayTimer); tndPlayTimer = setTimeout(refreshTndPlay, 250);
}
if (tndCsSlider) tndCsSlider.addEventListener("input", scheduleTndPlay);
async function refreshTndPlay() {
  const c = tndCsSlider ? Number(tndCsSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/tnd_interactive?cseek=${c}&lang=${lang()}`); } catch (e) { return; }
  state.tndPlay = d;
  const setpct = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = (v * 100).toFixed(0) + "%"; };
  setpct("tndNaive", d.naive); setpct("tndVe", d.tnd); setpct("tndTrue", d.true);
  const rd = document.getElementById("tndPlayReading"); if (rd) rd.innerHTML = d.reading;
  drawTndPlay(d);
}
function drawTndPlay(d) {
  if (!document.getElementById("tndPlayChart")) return;
  const g = d.grid;
  Plotly.react("tndPlayChart", [
    { x: g.cs, y: g.cs.map(() => g.true), mode: "lines", type: "scatter", name: tr("真值 VE", "true VE"), line: { color: GREEN, width: 2, dash: "dash" } },
    { x: g.cs, y: g.naive, mode: "lines+markers", type: "scatter", name: tr("未校正 VE", "naive VE"), line: { color: AMBER, width: 3 }, marker: { size: 5 } },
    { x: g.cs, y: g.tnd, mode: "lines+markers", type: "scatter", name: "TND VE", line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: [d.cseek], y: [d.tnd], mode: "markers", type: "scatter", marker: { color: INK, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.18 }, margin: { t: 30, r: 18, b: 44, l: 52 },
    xaxis: { title: tr("就醫傾向混淆強度", "care-seeking confounding strength") },
    yaxis: { title: tr("疫苗效力 VE", "vaccine effectiveness VE"), tickformat: ".0%", range: [0, 0.8] },
  }), SCENE_CFG);
}

// ③ analyze (fixed columns; load + auto-run)
function initTndAnalyze() { if (tndAnalyzeReady) return; tndAnalyzeReady = true; document.getElementById("useTndExample").click(); }
document.getElementById("useTndExample").addEventListener("click", async () => {
  const st = document.getElementById("tndDataStatus");
  try {
    const d = await getJSON(`${API}/api/tnd_example`);
    tndState.source = "example_tnd";
    st.textContent = tr(`已載入內建範例（${d.n} 人，合成虛構）`, `Loaded built-in example (${d.n} people, synthetic)`);
    runTndAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("tndFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("tndDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    tndState.source = d.token;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    runTndAnalyze();
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
async function runTndAnalyze() {
  if (!tndState.source) return;
  try {
    const a = await postJSON(`${API}/api/tnd_analyze`, { source: tndState.source, lang: lang() });
    renderTndAnalyze(a);
    runTndAssumptions();
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderTndAnalyze(a) {
  document.getElementById("tndAnalyzeOut").classList.remove("hidden");
  const pct = (v) => (v * 100).toFixed(0) + "%";
  const ci = a.ci_tnd && a.ci_tnd[0] != null ? ` (95% CI ${pct(a.ci_tnd[0])}–${pct(a.ci_tnd[1])})` : "";
  const cards = [
    [tr("未校正病例對照 VE（偏）", "naive case-control VE (biased)"), pct(a.ve_naive),
      tr("一般族群對照，被就醫傾向往下偏、低估保護。", "population controls — biased down by care-seeking, under-stating protection."), false],
    [tr("TND VE ＝ 1 − OR", "TND VE = 1 − OR"), pct(a.ve_tnd), a.interpretation + ci, true],
    [tr("接種勝算比 OR", "vaccination odds ratio OR"), fmt(a.or_tnd, 2),
      tr(`檢驗陽性 case vs 陰性 control 的接種勝算比；真值 VE ${pct(a.ve_true)}。`, `vaccination OR, test-positive cases vs test-negative controls; true VE ${pct(a.ve_true)}.`), false],
    [tr("檢驗者：case／control", "tested: cases / controls"), `${a.n_case} / ${a.n_control}`,
      tr(`共 ${a.n_tested} 人被檢驗。`, `${a.n_tested} people tested in total.`), false],
  ];
  document.getElementById("tndAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${v}</div><p>${desc}</p></div>`
  ).join("");
  drawTndAnalyze(a);
}
function drawTndAnalyze(a) {
  if (!document.getElementById("tndAnalyzeChart")) return;
  const labels = [tr("未校正 VE", "naive VE"), "TND VE"];
  const vals = [a.ve_naive, a.ve_tnd];
  Plotly.react("tndAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [AMBER, TEAL] },
    text: vals.map((v) => (v * 100).toFixed(0) + "%"), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 22, r: 16, b: 40, l: 52 },
    yaxis: { title: tr("疫苗效力 VE", "vaccine effectiveness VE"), tickformat: ".0%", range: [0, 0.8] },
    shapes: [{ type: "line", x0: -0.5, x1: 1.5, y0: a.ve_true, y1: a.ve_true, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: 1, y: a.ve_true, text: tr("真值 " + (a.ve_true * 100).toFixed(0) + "%", "truth " + (a.ve_true * 100).toFixed(0) + "%"), showarrow: false, yshift: 11, font: { color: GREEN, size: 10 } }],
  }), SCENE_CFG);
}

// ④ assumptions
function initTndAssume() { if (tndAssumeReady) return; tndAssumeReady = true; runTndAssumptions(); }
async function runTndAssumptions() {
  const src = tndState.source || "example_tnd";
  let out;
  try { out = await postJSON(`${API}/api/tnd_assumptions`, { source: src, lang: lang() }); } catch (e) { return; }
  state.tndDash = out;
  renderTndAssumptions(out);
}
function renderTndAssumptions(out) {
  const hint = document.getElementById("tndAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("tndOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；TND 的設計假設仍需領域判斷。", "Testable checks pass; the TND design assumptions still need judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("tndAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ⑤ real-ML causal TND — button-triggered (loads scikit-learn)
function initTndMl() { if (tndMlCache) drawTndMl(tndMlCache); }
const runTndMlBtn = document.getElementById("runTndMl");
if (runTndMlBtn) runTndMlBtn.addEventListener("click", async () => {
  const btn = runTndMlBtn; const old = btn.textContent;
  btn.disabled = true; btn.textContent = tr("計算中（載入 ML 套件）…", "Computing (loading ML)…");
  try {
    const s = await getJSON(`${API}/api/tnd_ml?lang=${lang()}`);
    tndMlCache = s; drawTndMl(s);
  } catch (e) { alert(tr("計算失敗：", "Failed: ") + e.message); }
  finally { btn.disabled = false; btn.textContent = old; }
});
function drawTndMl(s) {
  document.getElementById("tndMlOut").classList.remove("hidden");
  if (document.getElementById("tndMlChart")) {
    Plotly.react("tndMlChart", [{
      x: s.bars.labels, y: s.bars.values, type: "bar", marker: { color: [RED, AMBER, TEAL, GREEN] },
      text: s.bars.values.map((v) => (v * 100).toFixed(0) + "%"), textposition: "outside",
    }], sceneLayout({
      height: 300, margin: { t: 22, r: 16, b: 56, l: 52 },
      yaxis: { title: tr("疫苗效力 VE", "vaccine effectiveness VE"), tickformat: ".0%", range: [0, 0.8] },
      shapes: [{ type: "line", x0: -0.5, x1: 3.5, y0: s.ve_true, y1: s.ve_true, line: { color: GREEN, width: 2, dash: "dash" } }],
    }), SCENE_CFG);
  }
  document.getElementById("tndMlReading").innerHTML = s.reading;
}

// ======================================================================
// PSSA — Prescription Sequence Symmetry Analysis (20th method)
// crude SR (trend-confounded) ÷ SRnull (trend baseline) = adjusted SR; aSR>1 = signal
// ======================================================================
const pssaState = { source: null };
let pssaLearnReady = false, pssaPlayReady = false, pssaAnalyzeReady = false, pssaAssumeReady = false;

// ① learn scene: within-person; the prescribing trend is the only back door left
function drawScenePssa() {
  if (!document.getElementById("pssaScene")) return;
  const N = [
    { x: 2.1, y: 2.4, t: tr("日曆趨勢 T", "trend T"), c: "#5b7aa8" },
    { x: 0.7, y: 1.3, t: tr("指標藥 A", "index A"), c: TEAL },
    { x: 3.5, y: 1.3, t: tr("標記藥 B", "marker B"), c: "#c0504d" },
    { x: 2.1, y: 0.4, t: tr("不良反應", "adverse event"), c: "#64748b" },
  ];
  const arr = (fx, fy, tx, ty, c) => _psArrow(fx, fy, tx, ty, c);
  Plotly.react("pssaScene", [{
    x: N.map((n) => n.x), y: N.map((n) => n.y), mode: "markers+text", type: "scatter",
    text: N.map((n) => n.t), textposition: "middle center",
    marker: { size: 30, color: N.map((n) => n.c), symbol: ["circle", "circle", "circle", "circle"] },
    textfont: { size: 10, color: "#fff" }, hoverinfo: "skip",
  }], schemaLayout({
    height: 300, margin: { t: 18, r: 16, b: 26, l: 16 },
    xaxis: { visible: false, range: [0.2, 4.0] }, yaxis: { visible: false, range: [0.0, 2.8] },
    annotations: [
      arr(2.1, 2.4, 0.7, 1.3, "#c0504d"),   // trend→A timing
      arr(2.1, 2.4, 3.5, 1.3, "#c0504d"),   // trend→B timing (the confounder SRnull removes)
      arr(0.7, 1.3, 2.1, 0.4, TEAL),        // A→adverse event
      arr(2.1, 0.4, 3.5, 1.3, TEAL),        // adverse event→B (the cascade)
      { x: 2.1, y: 0.08, text: tr("同一人內：時間不變混淆相消；只剩趨勢 T，SRnull 把它除掉 → aSR", "within-person: time-invariant confounders cancel; only the trend T is left, SRnull divides it out → aSR"), showarrow: false, font: { size: 8.5, color: SLATE } },
    ],
  }), SCENE_CFG);
}
function initPssaLearn() { if (pssaLearnReady) return; pssaLearnReady = true; drawScenePssa(); }

// ② interactive — real-cascade-strength slider
const pssaCascSlider = document.getElementById("pssaCascSlider");
let pssaPlayTimer = null;
function initPssaPlay() { if (pssaPlayReady) return; pssaPlayReady = true; refreshPssaPlay(); }
function schedulePssaPlay() {
  document.getElementById("pssaCascVal").textContent = Number(pssaCascSlider.value).toFixed(2);
  clearTimeout(pssaPlayTimer); pssaPlayTimer = setTimeout(refreshPssaPlay, 250);
}
if (pssaCascSlider) pssaCascSlider.addEventListener("input", schedulePssaPlay);
async function refreshPssaPlay() {
  const c = pssaCascSlider ? Number(pssaCascSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/pssa_interactive?cascade=${c}&lang=${lang()}`); } catch (e) { return; }
  state.pssaPlay = d;
  document.getElementById("pssaCsr").textContent = fmt(d.csr, 2);
  document.getElementById("pssaSrnull").textContent = fmt(d.srnull, 2);
  document.getElementById("pssaAsr").textContent = fmt(d.asr, 2);
  const rd = document.getElementById("pssaPlayReading"); if (rd) rd.innerHTML = d.reading;
  drawPssaPlay(d);
}
function drawPssaPlay(d) {
  if (!document.getElementById("pssaPlayChart")) return;
  const g = d.grid;
  Plotly.react("pssaPlayChart", [
    { x: g.casc, y: g.csr, mode: "lines+markers", type: "scatter", name: tr("未校正 SR", "crude SR"), line: { color: RED, width: 3 }, marker: { size: 5 } },
    { x: g.casc, y: g.srnull, mode: "lines+markers", type: "scatter", name: "SRnull", line: { color: SLATE, width: 2, dash: "dot" }, marker: { size: 4 } },
    { x: g.casc, y: g.asr, mode: "lines+markers", type: "scatter", name: tr("校正 SR", "adjusted SR"), line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: [d.cascade], y: [d.asr], mode: "markers", type: "scatter", marker: { color: INK, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 320, margin: { t: 20, r: 16, b: 46, l: 48 },
    xaxis: { title: tr("真實瀑布強度", "real cascade strength") },
    yaxis: { title: tr("順序比", "sequence ratio") },
    shapes: [{ type: "line", x0: 0, x1: 1.5, y0: 1.0, y1: 1.0, line: { color: GREEN, width: 2, dash: "dash" } }],
    legend: { orientation: "h", y: 1.16, x: 0.5, xanchor: "center" },
  }), SCENE_CFG);
}

// ③ data analysis — crude SR vs adjusted SR
function initPssaAnalyze() { if (pssaAnalyzeReady) return; pssaAnalyzeReady = true; document.getElementById("usePssaExample").click(); }
document.getElementById("usePssaExample").addEventListener("click", async () => {
  const st = document.getElementById("pssaDataStatus");
  try {
    await getJSON(`${API}/api/pssa_example`);
    pssaState.source = "example_pssa";
    st.textContent = tr("已載入內建世代範例", "Built-in cohort loaded");
    runPssaAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Failed: ") + e.message; }
});
document.getElementById("pssaFileInput").addEventListener("change", async (ev) => {
  const f = ev.target.files[0]; if (!f) return;
  const st = document.getElementById("pssaDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const fd = new FormData(); fd.append("file", f);
    const d = await (await fetch(`${API}/api/upload`, { method: "POST", body: fd })).json();
    pssaState.source = d.token;
    st.textContent = tr("已載入：", "Loaded: ") + f.name;
    runPssaAnalyze();
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
async function runPssaAnalyze() {
  if (!pssaState.source) return;
  try {
    const a = await postJSON(`${API}/api/pssa_analyze`, { source: pssaState.source, lang: lang() });
    renderPssaAnalyze(a);
    runPssaAssumptions();
  } catch (e) { /* ignore */ }
}
function renderPssaAnalyze(a) {
  document.getElementById("pssaAnalyzeOut").classList.remove("hidden");
  state.pssaAnalyze = a;
  const ci = a.ci && a.ci[0] != null ? ` (95% CI ${fmt(a.ci[0], 2)}–${fmt(a.ci[1], 2)})` : "";
  const sig = a.signal ? tr("✔ 標為訊號", "✔ flagged as a signal") : tr("✘ 未達訊號", "✘ no signal");
  const cards = [
    [tr("校正順序比 aSR ＝ cSR ÷ SRnull", "adjusted SR (aSR = cSR ÷ SRnull)"), fmt(a.asr, 2), a.interpretation + ci, true],
    [tr("未校正順序比 cSR（趨勢偏）", "crude SR (trend-biased)"), fmt(a.csr, 2),
      tr("先 A 後 B vs 先 B 後 A，未除趨勢，被處方趨勢抬高。", "A-then-B vs B-then-A, trend not removed — lifted by the prescribing trend."), false],
    [tr("無效果順序比 SRnull", "null SR (SRnull)"), fmt(a.srnull, 2),
      tr("「只有趨勢」時 cSR 的期望；越遠離 1 趨勢越強。", "the cSR expected under the trend alone; the further from 1, the stronger the trend."), false],
    [tr("訊號判定", "signal verdict"), sig,
      tr("不一致對：先 A 後 B ＝ " + a.a_index_first + "、先 B 後 A ＝ " + a.b_marker_first + "。",
         "discordant pairs: A-then-B = " + a.a_index_first + ", B-then-A = " + a.b_marker_first + "."), false],
  ];
  document.getElementById("pssaAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${v}</div><p>${desc}</p></div>`).join("");
  drawPssaAnalyze(a);
}
function drawPssaAnalyze(a) {
  if (!document.getElementById("pssaAnalyzeChart")) return;
  const labels = [tr("未校正 SR", "crude SR"), "SRnull", tr("校正 SR", "adjusted SR")];
  const vals = [a.csr, a.srnull, a.asr];
  Plotly.react("pssaAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [RED, SLATE, TEAL] },
    text: vals.map((v) => fmt(v, 2)), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 22, r: 16, b: 40, l: 48 },
    yaxis: { title: tr("順序比", "sequence ratio"), rangemode: "tozero" },
    shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: 1.0, y1: 1.0, line: { color: GREEN, width: 2, dash: "dash" } }],
  }), SCENE_CFG);
}

// ④ assumptions C1–C5
function initPssaAssume() { if (pssaAssumeReady) return; pssaAssumeReady = true; runPssaAssumptions(); }
async function runPssaAssumptions() {
  const src = pssaState.source || "example_pssa";
  let out;
  try { out = await postJSON(`${API}/api/pssa_assumptions`, { source: src, lang: lang() }); } catch (e) { return; }
  state.pssaDash = out;
  renderPssaAssumptions(out);
}
function renderPssaAssumptions(out) {
  const hint = document.getElementById("pssaAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("pssaOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；PSSA 的設計假設仍需領域判斷。", "Testable checks pass; the PSSA design assumptions still need judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，訊號要保守看待。", "Some items fail — interpret the signal with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("pssaAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ======================================================================
// TreeScan — tree-based scan statistic (21st method)
// max-LLR over a node hierarchy + permutation p; naive over-flags, TreeScan controls FWER
// ======================================================================
const tscanState = { source: null };
let tscanLearnReady = false, tscanPlayReady = false, tscanAnalyzeReady = false, tscanAssumeReady = false;

// ① learn scene: a small outcome tree with one node lit up (the real signal)
function drawSceneTscan() {
  if (!document.getElementById("tscanScene")) return;
  const root = { x: 2.1, y: 2.5 };
  const sys = [{ x: 0.8, y: 1.5 }, { x: 2.1, y: 1.5 }, { x: 3.4, y: 1.5 }];
  const leaves = [
    { x: 0.4, y: 0.5, hit: false }, { x: 1.2, y: 0.5, hit: false },
    { x: 1.7, y: 0.5, hit: false }, { x: 2.5, y: 0.5, hit: true },
    { x: 3.0, y: 0.5, hit: false }, { x: 3.8, y: 0.5, hit: false },
  ];
  const edges = [
    [root, sys[0]], [root, sys[1]], [root, sys[2]],
    [sys[0], leaves[0]], [sys[0], leaves[1]], [sys[1], leaves[2]], [sys[1], leaves[3]],
    [sys[2], leaves[4]], [sys[2], leaves[5]],
  ];
  const ann = edges.map(([a, b]) => ({
    x: b.x, y: b.y, ax: a.x, ay: a.y, xref: "x", yref: "y", axref: "x", ayref: "y",
    showarrow: true, arrowhead: 0, arrowwidth: 1.4, arrowcolor: "#9aa6b2", standoff: 6, startstandoff: 6,
  }));
  ann.push({ x: 2.5, y: 0.5, ax: 0, ay: -34, text: tr("真訊號", "real signal"), showarrow: true,
             arrowhead: 0, arrowcolor: RED, font: { size: 9, color: RED } });
  ann.push({ x: 2.1, y: 0.02, text: tr("掃描每個節點（葉＋系統＋根），取最大 LLR；排列法給校正 p", "scan every node (leaf+system+root), take the max LLR; permutation gives the adjusted p"),
             showarrow: false, font: { size: 8.5, color: SLATE } });
  const allx = [root.x, ...sys.map(s => s.x), ...leaves.map(l => l.x)];
  const ally = [root.y, ...sys.map(s => s.y), ...leaves.map(l => l.y)];
  const cols = [INK, ...sys.map(() => "#5b7aa8"), ...leaves.map(l => l.hit ? RED : "#94a3b8")];
  Plotly.react("tscanScene", [{
    x: allx, y: ally, mode: "markers", type: "scatter",
    marker: { size: [22, 18, 18, 18, 13, 13, 13, 13, 13, 13], color: cols, symbol: "circle" },
    hoverinfo: "skip",
  }], schemaLayout({
    height: 300, margin: { t: 14, r: 12, b: 26, l: 12 },
    xaxis: { visible: false, range: [0.0, 4.2] }, yaxis: { visible: false, range: [-0.1, 2.8] },
    annotations: ann,
  }), SCENE_CFG);
}
function initTscanLearn() { if (tscanLearnReady) return; tscanLearnReady = true; drawSceneTscan(); }

// ② interactive — signal-strength slider
const tscanSigSlider = document.getElementById("tscanSigSlider");
let tscanPlayTimer = null;
function initTscanPlay() { if (tscanPlayReady) return; tscanPlayReady = true; refreshTscanPlay(); }
function scheduleTscanPlay() {
  document.getElementById("tscanSigVal").textContent = Number(tscanSigSlider.value).toFixed(1);
  clearTimeout(tscanPlayTimer); tscanPlayTimer = setTimeout(refreshTscanPlay, 250);
}
if (tscanSigSlider) tscanSigSlider.addEventListener("input", scheduleTscanPlay);
async function refreshTscanPlay() {
  const s = tscanSigSlider ? Number(tscanSigSlider.value) : 3.0;
  let d;
  try { d = await getJSON(`${API}/api/tscan_interactive?signal=${s}&lang=${lang()}`); } catch (e) { return; }
  state.tscanPlay = d;
  document.getElementById("tscanLlr").textContent = fmt(d.llr, 1);
  document.getElementById("tscanP").textContent = d.p < 0.001 ? "<0.001" : fmt(d.p, 3);
  document.getElementById("tscanNaive").textContent = d.naive;
  document.getElementById("tscanFlags").textContent = d.tscan;
  const rd = document.getElementById("tscanPlayReading"); if (rd) rd.innerHTML = d.reading;
  drawTscanPlay(d);
}
function drawTscanPlay(d) {
  if (!document.getElementById("tscanPlayChart")) return;
  const g = d.grid;
  Plotly.react("tscanPlayChart", [
    { x: g.sig, y: g.naive, type: "bar", name: tr("未校正標記", "naive flags"), marker: { color: "#f0b6b2" } },
    { x: g.sig, y: g.tscan, type: "bar", name: tr("TreeScan 標記", "TreeScan flags"), marker: { color: TEAL } },
    { x: g.sig, y: g.llr, mode: "lines+markers", type: "scatter", name: tr("最大 LLR", "max LLR"), yaxis: "y2", line: { color: INK, width: 2.5 }, marker: { size: 5 } },
    { x: [d.signal], y: [d.llr], mode: "markers", type: "scatter", yaxis: "y2", marker: { color: INK, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 330, margin: { t: 20, r: 48, b: 46, l: 44 }, barmode: "group",
    xaxis: { title: tr("目標節點訊號強度", "signal strength at target node"), dtick: 0.5 },
    yaxis: { title: tr("標記數", "flag count"), rangemode: "tozero" },
    yaxis2: { title: tr("最大 LLR", "max LLR"), overlaying: "y", side: "right", rangemode: "tozero" },
    legend: { orientation: "h", y: 1.16, x: 0.5, xanchor: "center" },
  }), SCENE_CFG);
}

// ③ data analysis — scan the tree, ranked node table + flag-count contrast
function initTscanAnalyze() { if (tscanAnalyzeReady) return; tscanAnalyzeReady = true; document.getElementById("useTscanExample").click(); }
document.getElementById("useTscanExample").addEventListener("click", async () => {
  const st = document.getElementById("tscanDataStatus");
  try {
    await getJSON(`${API}/api/tscan_example`);
    tscanState.source = "example_tscan";
    st.textContent = tr("已載入內建世代範例", "Built-in cohort loaded");
    runTscanAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Failed: ") + e.message; }
});
document.getElementById("tscanFileInput").addEventListener("change", async (ev) => {
  const f = ev.target.files[0]; if (!f) return;
  const st = document.getElementById("tscanDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const fd = new FormData(); fd.append("file", f);
    const d = await (await fetch(`${API}/api/upload`, { method: "POST", body: fd })).json();
    tscanState.source = d.token;
    st.textContent = tr("已載入：", "Loaded: ") + f.name;
    runTscanAnalyze();
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
async function runTscanAnalyze() {
  if (!tscanState.source) return;
  try {
    const a = await postJSON(`${API}/api/tscan_analyze`, { source: tscanState.source, lang: lang() });
    renderTscanAnalyze(a);
    runTscanAssumptions();
  } catch (e) { /* ignore */ }
}
function renderTscanAnalyze(a) {
  document.getElementById("tscanAnalyzeOut").classList.remove("hidden");
  state.tscanAnalyze = a;
  const cards = [
    [tr("TreeScan 標記數（控 FWER）", "TreeScan flags (FWER-controlled)"), String(a.n_tscan_flags), a.interpretation, true],
    [tr("未校正標記數（未校正）", "naive flags (uncorrected)"), String(a.n_naive_flags),
      tr("逐節點未校正會標出更多，多出來的是假警報。", "An uncorrected per-node scan flags more — the extras are false alarms."), false],
    [tr("掃描節點數", "nodes scanned"), String(a.n_nodes),
      tr("葉節點＋系統節點都一起掃，同享一份錯誤率預算。", "Leaves and system nodes scanned together under one error budget."), false],
    [tr("最大 LLR", "max LLR"), fmt(a.T_obs, 1),
      tr("最強節點：" + a.target_label + (a.target_hit ? "（＝真正有超額者）。" : "。"),
         "strongest node: " + a.target_label + (a.target_hit ? " (= the one with a real excess)." : ".")), false],
  ];
  document.getElementById("tscanAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${v}</div><p>${desc}</p></div>`).join("");
  drawTscanAnalyze(a);
  renderTscanTable(a);
}
function drawTscanAnalyze(a) {
  if (!document.getElementById("tscanAnalyzeChart")) return;
  const top = a.nodes.slice(0, 8);
  Plotly.react("tscanAnalyzeChart", [{
    x: top.map((n) => n.label), y: top.map((n) => n.llr), type: "bar",
    marker: { color: top.map((n) => n.flag ? TEAL : "#cbd5e1") },
    text: top.map((n) => n.llr.toFixed(1)), textposition: "outside",
  }], sceneLayout({
    height: 320, margin: { t: 22, r: 16, b: 96, l: 46 },
    yaxis: { title: "LLR", rangemode: "tozero" },
    xaxis: { tickangle: -35, automargin: true },
  }), SCENE_CFG);
}
function renderTscanTable(a) {
  const el = document.getElementById("tscanNodeTable"); if (!el) return;
  const head = `<thead><tr>
    <th>${tr("節點", "node")}</th><th>${tr("類型", "kind")}</th><th>LLR</th>
    <th>${tr("人數 n", "n")}</th><th>${tr("暴露率", "exposed rate")}</th>
    <th>${tr("校正 p", "adj. p")}</th><th>${tr("標記", "flag")}</th></tr></thead>`;
  const kindLabel = (k) => k === "leaf" ? tr("葉", "leaf") : (k === "system" ? tr("系統", "system") : tr("根", "root"));
  const rows = a.nodes.map((n) => `<tr${n.flag ? ' class="hl"' : ""}>
    <td>${n.label}</td><td>${kindLabel(n.kind)}</td><td>${n.llr.toFixed(1)}</td>
    <td>${n.n}</td><td>${(n.rate * 100).toFixed(0)}%</td>
    <td>${n.p < 0.001 ? "&lt;0.001" : n.p.toFixed(3)}</td>
    <td>${n.flag ? "✔" : "–"}</td></tr>`).join("");
  el.innerHTML = head + "<tbody>" + rows + "</tbody>";
}

// ④ assumptions C1–C5
function initTscanAssume() { if (tscanAssumeReady) return; tscanAssumeReady = true; runTscanAssumptions(); }
async function runTscanAssumptions() {
  const src = tscanState.source || "example_tscan";
  let out;
  try { out = await postJSON(`${API}/api/tscan_assumptions`, { source: src, lang: lang() }); } catch (e) { return; }
  state.tscanDash = out;
  renderTscanAssumptions(out);
}
function renderTscanAssumptions(out) {
  const hint = document.getElementById("tscanAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("tscanOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；TreeScan 的設計假設仍需領域判斷。", "Testable checks pass; the TreeScan design assumptions still need judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，訊號要保守看待。", "Some items fail — interpret the signals with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("tscanAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ======================================================================
// WCE — weighted cumulative exposure (22nd method)
// estimate the time-since-exposure weight curve; naive current-use / total-dose biased
// ======================================================================
const wceState = { source: null };
let wceLearnReady = false, wcePlayReady = false, wceAnalyzeReady = false, wceAssumeReady = false;

// ① learn scene: the true weight curve (recent doses weigh most, decays)
function drawSceneWce() {
  if (!document.getElementById("wceScene")) return;
  const tau = Array.from({ length: 24 }, (_, i) => i);
  const w = tau.map((t) => Math.exp(-t / 8));
  const s = w.reduce((a, b) => a + b, 0);
  const wn = w.map((x) => x / s);
  const flat = tau.map(() => 1 / 24);
  Plotly.react("wceScene", [
    { x: tau, y: wn, mode: "lines", type: "scatter", name: tr("真實權重（衰減）", "true weight (decay)"), line: { color: TEAL, width: 3 }, fill: "tozeroy", fillcolor: "rgba(63,130,104,.12)" },
    { x: tau, y: flat, mode: "lines", type: "scatter", name: tr("未校正：等權", "naive: equal weight"), line: { color: "#c0504d", width: 2, dash: "dash" } },
    { x: [0], y: [wn[0]], mode: "markers", type: "scatter", name: tr("未校正：只看當下", "naive: current only"), marker: { color: "#f59e0b", size: 11, symbol: "circle" } },
  ], sceneLayout({
    height: 300, margin: { t: 20, r: 16, b: 44, l: 50 },
    xaxis: { title: tr("距離用藥的時間（月）", "months since the dose") },
    yaxis: { title: tr("權重", "weight"), rangemode: "tozero" },
    legend: { orientation: "h", y: 1.18, x: 0.5, xanchor: "center" },
  }), SCENE_CFG);
}
function initWceLearn() { if (wceLearnReady) return; wceLearnReady = true; drawSceneWce(); }

// ② interactive — decay-scale slider
const wceDecaySlider = document.getElementById("wceDecaySlider");
let wcePlayTimer = null;
function initWcePlay() { if (wcePlayReady) return; wcePlayReady = true; refreshWcePlay(); }
function scheduleWcePlay() {
  document.getElementById("wceDecayVal").textContent = Number(wceDecaySlider.value).toFixed(1);
  clearTimeout(wcePlayTimer); wcePlayTimer = setTimeout(refreshWcePlay, 250);
}
if (wceDecaySlider) wceDecaySlider.addEventListener("input", scheduleWcePlay);
async function refreshWcePlay() {
  const d = wceDecaySlider ? Number(wceDecaySlider.value) : 8.0;
  let r;
  try { r = await getJSON(`${API}/api/wce_interactive?decay=${d}&lang=${lang()}`); } catch (e) { return; }
  state.wcePlay = r;
  setval("wceHrWce", r.hr_wce); setval("wceHrCur", r.hr_current); setval("wceHrCum", r.hr_cum); setval("wceHrTrue", r.hr_true);
  const rd = document.getElementById("wcePlayReading"); if (rd) rd.innerHTML = r.reading;
  drawWcePlay(r);
}
function setval(id, v) { const el = document.getElementById(id); if (el) el.textContent = fmt(v, 2); }
function drawWcePlay(r) {
  if (!document.getElementById("wcePlayChart")) return;
  const g = r.grid;
  Plotly.react("wcePlayChart", [
    { x: g.decay, y: g.hr_wce, mode: "lines+markers", type: "scatter", name: "WCE", line: { color: TEAL, width: 3 }, marker: { size: 5 } },
    { x: g.decay, y: g.hr_current, mode: "lines+markers", type: "scatter", name: tr("未校正：只看當下", "naive: current"), line: { color: "#f59e0b", width: 2 }, marker: { size: 4 } },
    { x: g.decay, y: g.hr_cum, mode: "lines+markers", type: "scatter", name: tr("未校正：等權總劑量", "naive: total dose"), line: { color: "#c0504d", width: 2, dash: "dot" }, marker: { size: 4 } },
    { x: [r.decay], y: [r.hr_wce], mode: "markers", type: "scatter", marker: { color: INK, size: 11, symbol: "x" }, showlegend: false },
  ], sceneLayout({
    height: 320, margin: { t: 20, r: 16, b: 46, l: 48 },
    xaxis: { title: tr("效果集中度（衰減尺度，月）", "effect concentration (decay, months)") },
    yaxis: { title: tr("風險比 HR", "hazard ratio") },
    shapes: [{ type: "line", x0: 6, x1: 16, y0: r.hr_true, y1: r.hr_true, line: { color: GREEN, width: 2, dash: "dash" } }],
    legend: { orientation: "h", y: 1.16, x: 0.5, xanchor: "center" },
  }), SCENE_CFG);
}

// ③ data analysis — weight curve + HR comparison
function initWceAnalyze() { if (wceAnalyzeReady) return; wceAnalyzeReady = true; document.getElementById("useWceExample").click(); }
document.getElementById("useWceExample").addEventListener("click", async () => {
  const st = document.getElementById("wceDataStatus");
  try {
    await getJSON(`${API}/api/wce_example`);
    wceState.source = "example_wce";
    st.textContent = tr("已載入內建世代範例", "Built-in cohort loaded");
    runWceAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Failed: ") + e.message; }
});
document.getElementById("wceFileInput").addEventListener("change", async (ev) => {
  const f = ev.target.files[0]; if (!f) return;
  const st = document.getElementById("wceDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const fd = new FormData(); fd.append("file", f);
    const d = await (await fetch(`${API}/api/upload`, { method: "POST", body: fd })).json();
    wceState.source = d.token;
    st.textContent = tr("已載入：", "Loaded: ") + f.name;
    runWceAnalyze();
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
async function runWceAnalyze() {
  if (!wceState.source) return;
  try {
    const a = await postJSON(`${API}/api/wce_analyze`, { source: wceState.source, lang: lang() });
    renderWceAnalyze(a);
    runWceAssumptions();
  } catch (e) { /* ignore */ }
}
function renderWceAnalyze(a) {
  document.getElementById("wceAnalyzeOut").classList.remove("hidden");
  state.wceAnalyze = a;
  drawWceWeight(a);
  const cards = [
    [tr("WCE 風險比（HR）", "WCE hazard ratio"), fmt(a.hr_wce, 2), a.interpretation, true],
    [tr("未校正：只看當下用藥", "naive: current use only"), fmt(a.hr_current, 2),
      tr("忽略累積與衰減，通常低估。", "ignores accumulation/decay — usually under-states."), false],
    [tr("未校正：等權總劑量", "naive: equally-weighted total dose"), fmt(a.hr_cum, 2),
      tr("把過去每劑當成一樣重，形狀錯。", "treats every past dose as equally important — wrong shape."), false],
    [tr("真值 HR（持續用藥者）", "true HR (sustained user)"), fmt(a.hr_true, 2),
      tr("事件數 ＝ " + a.n_events + "。", "events = " + a.n_events + "."), false],
  ];
  document.getElementById("wceAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${v}</div><p>${desc}</p></div>`).join("");
  drawWceAnalyze(a);
}
function drawWceWeight(a) {
  if (!document.getElementById("wceWeightChart")) return;
  Plotly.react("wceWeightChart", [
    { x: a.tau, y: a.w_hat, mode: "lines", type: "scatter", name: tr("估出的權重", "estimated weight"), line: { color: TEAL, width: 3 }, fill: "tozeroy", fillcolor: "rgba(63,130,104,.12)" },
    { x: a.tau, y: a.w_true, mode: "lines", type: "scatter", name: tr("真實權重", "true weight"), line: { color: INK, width: 2, dash: "dash" } },
  ], sceneLayout({
    height: 300, margin: { t: 18, r: 16, b: 44, l: 50 },
    xaxis: { title: tr("距離用藥的時間（月）", "months since the dose") },
    yaxis: { title: tr("權重", "weight"), rangemode: "tozero" },
    legend: { orientation: "h", y: 1.18, x: 0.5, xanchor: "center" },
  }), SCENE_CFG);
}
function drawWceAnalyze(a) {
  if (!document.getElementById("wceAnalyzeChart")) return;
  const labels = ["WCE", tr("只看當下", "current"), tr("等權總劑量", "total dose")];
  const vals = [a.hr_wce, a.hr_current, a.hr_cum];
  Plotly.react("wceAnalyzeChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [TEAL, "#f59e0b", "#c0504d"] },
    text: vals.map((v) => fmt(v, 2)), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 22, r: 16, b: 40, l: 48 },
    yaxis: { title: tr("風險比 HR", "hazard ratio"), rangemode: "tozero" },
    shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: a.hr_true, y1: a.hr_true, line: { color: GREEN, width: 2, dash: "dash" } }],
  }), SCENE_CFG);
}

// ④ assumptions C1–C5
function initWceAssume() { if (wceAssumeReady) return; wceAssumeReady = true; runWceAssumptions(); }
async function runWceAssumptions() {
  const src = wceState.source || "example_wce";
  let out;
  try { out = await postJSON(`${API}/api/wce_assumptions`, { source: src, lang: lang() }); } catch (e) { return; }
  state.wceDash = out;
  renderWceAssumptions(out);
}
function renderWceAssumptions(out) {
  const hint = document.getElementById("wceAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("wceOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；WCE 的關鍵假設仍需領域判斷。", "Testable checks pass; the key WCE assumptions still need judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設關乎設計、不可檢驗。", "Most core assumptions are about design and untestable."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("wceAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ======================================================================
// Transportability — carry a study effect to a target population (23rd method)
// ======================================================================
let transportLearnReady = false, transportPlayReady = false, transportAnalyzeReady = false, transportAssumeReady = false;
let transportPlayTimer = null;
const _tsv = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = fmt(v, 2); };
function drawSceneTransport() {
  if (!document.getElementById("transportScene")) return;
  const xs = []; for (let i = -45; i <= 45; i++) xs.push(i / 10);
  const bell = (m) => xs.map((x) => Math.exp(-0.5 * (x - m) * (x - m)));
  Plotly.react("transportScene", [
    { x: xs, y: bell(-0.5), type: "scatter", mode: "lines", fill: "tozeroy", name: tr("研究族群", "study"), line: { color: SLATE } },
    { x: xs, y: bell(0.5), type: "scatter", mode: "lines", fill: "tozeroy", name: tr("目標族群", "target"), line: { color: PURPLE } },
  ], sceneLayout({ height: 300, margin: { t: 18, r: 14, b: 42, l: 30 }, xaxis: { title: tr("效果修飾子 X（效果隨 X 變大）", "effect modifier X (effect grows with X)") }, yaxis: { visible: false }, legend: { orientation: "h", y: 1.15 } }), SCENE_CFG);
}
function initTransportLearn() { if (transportLearnReady) return; transportLearnReady = true; drawSceneTransport(); }

const transportMtSlider = document.getElementById("transportMtSlider");
function initTransportPlay() { if (transportPlayReady) return; transportPlayReady = true; refreshTransportPlay(); }
function scheduleTransportPlay() {
  document.getElementById("transportMtVal").textContent = Number(transportMtSlider.value).toFixed(1);
  clearTimeout(transportPlayTimer); transportPlayTimer = setTimeout(refreshTransportPlay, 150);
}
if (transportMtSlider) transportMtSlider.addEventListener("input", scheduleTransportPlay);
async function refreshTransportPlay() {
  const mt = transportMtSlider ? Number(transportMtSlider.value) : 0.5;
  let r; try { r = await getJSON(`${API}/api/transport_interactive?mu_target=${mt}&lang=${lang()}`); } catch (e) { return; }
  state.transportPlay = r;
  _tsv("transportTruth", r.truth); _tsv("transportNaive", r.naive); _tsv("transportStd", r.standardize); _tsv("transportIosw", r.iosw);
  const rd = document.getElementById("transportPlayReading"); if (rd) rd.innerHTML = r.reading;
  _drawTransportBars("transportPlayChart", r);
}
function _drawTransportBars(elId, r) {
  if (!document.getElementById(elId)) return;
  const labels = [tr("研究（未校正）", "study (naive)"), tr("標準化", "standardise"), tr("IOSW", "IOSW")];
  const vals = [r.naive, r.standardize, r.iosw];
  const cols = vals.map((v) => Math.abs(v - r.truth) < 0.2 ? TEAL : AMBER);
  Plotly.react(elId, [{ x: labels, y: vals, type: "bar", marker: { color: cols }, text: vals.map((v) => v.toFixed(2)), textposition: "outside", hoverinfo: "skip" }],
    sceneLayout({ height: 300, margin: { t: 18, r: 16, b: 45, l: 52 }, yaxis: { title: tr("估出的目標效果", "estimated target effect") },
      shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: r.truth, y1: r.truth, line: { color: GREEN, dash: "dash", width: 2 } }],
      annotations: [{ x: 2.45, y: r.truth, xanchor: "right", yanchor: "bottom", text: tr(`真值 ${r.truth.toFixed(2)}`, `truth ${r.truth.toFixed(2)}`), showarrow: false, font: { color: GREEN, size: 11 } }] }), SCENE_CFG);
}
function initTransportAnalyze() { if (transportAnalyzeReady) return; transportAnalyzeReady = true; const b = document.getElementById("useTransportExample"); if (b) b.click(); }
{
  const b = document.getElementById("useTransportExample");
  if (b) b.addEventListener("click", async () => {
    const st = document.getElementById("transportDataStatus");
    try { await getJSON(`${API}/api/transport_example`); } catch (e) { /* ignore */ }
    if (st) st.textContent = tr("已載入內建範例", "Loaded built-in example");
    runTransportAnalyze();
  });
}
async function runTransportAnalyze() {
  let a; try { a = await postJSON(`${API}/api/transport_analyze`, { lang: lang() }); } catch (e) { return; }
  state.transportAnalyze = a; renderTransportAnalyze(a);
}
function renderTransportAnalyze(a) {
  document.getElementById("transportAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("目標真值", "target truth"), a.truth, tr("用上完整資訊的目標效果。", "the target effect with full info."), false],
    [tr("研究效果（未校正）", "study effect (naive)"), a.naive, tr("直接拿研究的效果、忽略目標分布 → 偏。", "the study's own effect, ignoring the target → biased."), false],
    [tr("標準化", "standardisation"), a.standardize, tr("配效果曲面、對目標取平均 → 救回。", "fit the effect surface, average over the target → recovered."), true],
    [tr("選樣反機率加權 IOSW", "IOSW"), a.iosw, tr("把研究重新加權成目標的組成 → 救回。", "reweight the study to the target's mix → recovered."), true],
  ];
  document.getElementById("transportAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}</div><p>${desc}</p></div>`).join("");
  _drawTransportBars("transportAnalyzeChart", a);
}
function initTransportAssume() { if (transportAssumeReady) return; transportAssumeReady = true; runTransportAssumptions(); }
async function runTransportAssumptions() {
  let out; try { out = await postJSON(`${API}/api/transport_assumptions`, { lang: lang() }); } catch (e) { return; }
  state.transportDash = out; renderTransportAssumptions(out);
}
function renderTransportAssumptions(out) {
  const hint = document.getElementById("transportAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("transportOverall");
  if (ov) { ov.classList.remove("hidden"); ov.className = `overall st-${out.overall_status}`; ov.style.background = "#fff"; ov.innerHTML = `<span class="dot bg-${out.overall_status}"></span> ${out.overall_headline}`; }
  document.getElementById("transportAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = (c.metrics || []).map((m) => `<li>${m.name}<b>${m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title} <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3><p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p><ul class="metrics">${metrics}</ul><details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ======================================================================
// External control — single-arm study vs a borrowed control arm (24th method)
// ======================================================================
let extctrlLearnReady = false, extctrlPlayReady = false, extctrlAnalyzeReady = false, extctrlAssumeReady = false;
let extctrlPlayTimer = null;
function drawSceneExtctrl() {
  if (!document.getElementById("extctrlScene")) return;
  const xs = []; for (let i = -45; i <= 45; i++) xs.push(i / 10);
  const bell = (m) => xs.map((x) => Math.exp(-0.5 * (x - m) * (x - m)));
  Plotly.react("extctrlScene", [
    { x: xs, y: bell(0.5), type: "scatter", mode: "lines", fill: "tozeroy", name: tr("單臂試驗（治療）", "single-arm trial (treated)"), line: { color: TEAL } },
    { x: xs, y: bell(-0.5), type: "scatter", mode: "lines", fill: "tozeroy", name: tr("外部對照（未治療）", "external controls (untreated)"), line: { color: AMBER } },
  ], sceneLayout({ height: 300, margin: { t: 18, r: 14, b: 42, l: 30 }, xaxis: { title: tr("預後共變項 X（X 越高、結果越好）", "prognostic covariate X (higher X, better outcome)") }, yaxis: { visible: false }, legend: { orientation: "h", y: 1.18 } }), SCENE_CFG);
}
function initExtctrlLearn() { if (extctrlLearnReady) return; extctrlLearnReady = true; drawSceneExtctrl(); }

const extctrlMtSlider = document.getElementById("extctrlMtSlider");
function initExtctrlPlay() { if (extctrlPlayReady) return; extctrlPlayReady = true; refreshExtctrlPlay(); }
function scheduleExtctrlPlay() {
  document.getElementById("extctrlMtVal").textContent = Number(extctrlMtSlider.value).toFixed(1);
  clearTimeout(extctrlPlayTimer); extctrlPlayTimer = setTimeout(refreshExtctrlPlay, 150);
}
if (extctrlMtSlider) extctrlMtSlider.addEventListener("input", scheduleExtctrlPlay);
async function refreshExtctrlPlay() {
  const me = extctrlMtSlider ? Number(extctrlMtSlider.value) : -0.5;
  let r; try { r = await getJSON(`${API}/api/extctrl_interactive?mu_ext=${me}&lang=${lang()}`); } catch (e) { return; }
  state.extctrlPlay = r;
  _tsv("extctrlTruth", r.truth); _tsv("extctrlNaive", r.naive); _tsv("extctrlStd", r.standardize); _tsv("extctrlIpsw", r.ipsw);
  const rd = document.getElementById("extctrlPlayReading"); if (rd) rd.innerHTML = r.reading;
  _drawExtctrlBars("extctrlPlayChart", r);
}
function _drawExtctrlBars(elId, r) {
  if (!document.getElementById(elId)) return;
  const labels = [tr("未校正（兩臂直接差）", "naive (raw arm diff)"), tr("標準化", "standardise"), tr("IPSW", "IPSW")];
  const vals = [r.naive, r.standardize, r.ipsw];
  const cols = vals.map((v) => Math.abs(v - r.truth) < 0.2 ? TEAL : AMBER);
  Plotly.react(elId, [{ x: labels, y: vals, type: "bar", marker: { color: cols }, text: vals.map((v) => v.toFixed(2)), textposition: "outside", hoverinfo: "skip" }],
    sceneLayout({ height: 300, margin: { t: 18, r: 16, b: 45, l: 52 }, yaxis: { title: tr("估出的治療效果", "estimated treatment effect") },
      shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: r.truth, y1: r.truth, line: { color: GREEN, dash: "dash", width: 2 } }],
      annotations: [{ x: 2.45, y: r.truth, xanchor: "right", yanchor: "bottom", text: tr(`真值 ${r.truth.toFixed(2)}`, `truth ${r.truth.toFixed(2)}`), showarrow: false, font: { color: GREEN, size: 11 } }] }), SCENE_CFG);
}
function initExtctrlAnalyze() { if (extctrlAnalyzeReady) return; extctrlAnalyzeReady = true; const b = document.getElementById("useExtctrlExample"); if (b) b.click(); }
{
  const b = document.getElementById("useExtctrlExample");
  if (b) b.addEventListener("click", async () => {
    const st = document.getElementById("extctrlDataStatus");
    try { await getJSON(`${API}/api/extctrl_example`); } catch (e) { /* ignore */ }
    if (st) st.textContent = tr("已載入內建範例", "Loaded built-in example");
    runExtctrlAnalyze();
  });
}
async function runExtctrlAnalyze() {
  let a; try { a = await postJSON(`${API}/api/extctrl_analyze`, { lang: lang() }); } catch (e) { return; }
  state.extctrlAnalyze = a; renderExtctrlAnalyze(a);
}
function renderExtctrlAnalyze(a) {
  document.getElementById("extctrlAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("真實效果", "true effect"), a.truth, tr("我們要救回的治療效果。", "the treatment effect we want to recover."), false],
    [tr("未校正（兩臂直接差）", "naive (raw arm diff)"), a.naive, tr("直接比兩臂、忽略共變項不平衡 → 偏。", "compare the arms directly, ignoring imbalance → biased."), false],
    [tr("標準化", "standardisation"), a.standardize, tr("把未治療結果建模、預測到試驗 X → 救回。", "model the untreated outcome, predict at the trial's X → recovered."), true],
    [tr("選樣反機率加權 IPSW", "IPSW"), a.ipsw, tr("把外部對照加權成試驗的組成 → 救回。", "reweight the external controls to the trial's mix → recovered."), true],
  ];
  document.getElementById("extctrlAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${fmt(v, 2)}</div><p>${desc}</p></div>`).join("");
  _drawExtctrlBars("extctrlAnalyzeChart", a);
}
function initExtctrlAssume() { if (extctrlAssumeReady) return; extctrlAssumeReady = true; runExtctrlAssumptions(); }
async function runExtctrlAssumptions() {
  let out; try { out = await postJSON(`${API}/api/extctrl_assumptions`, { lang: lang() }); } catch (e) { return; }
  state.extctrlDash = out; renderExtctrlAssumptions(out);
}
function renderExtctrlAssumptions(out) {
  const hint = document.getElementById("extctrlAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("extctrlOverall");
  if (ov) { ov.classList.remove("hidden"); ov.className = `overall st-${out.overall_status}`; ov.style.background = "#fff"; ov.innerHTML = `<span class="dot bg-${out.overall_status}"></span> ${out.overall_headline}`; }
  document.getElementById("extctrlAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = (c.metrics || []).map((m) => `<li>${m.name}<b>${m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title} <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3><p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p><ul class="metrics">${metrics}</ul><details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ======================================================================
// ⑥ What if — every method in the language of counterfactuals
// (original plain-language take on Hernán & Robins, Causal Inference: What If;
//  no text is copied from the book). One small counterfactual-contrast diagram
//  per method, parameterised by the WHATIF config table.
// ======================================================================
// Each method gets its OWN causal DAG — the actual structure that explains how the
// design identifies the effect (the language of What If, Part I). Nodes: A exposure,
// Y outcome, U confounder, Z instrument, T time, L time-varying confounder, S selection;
// a boxed node = "conditioned on". Edges: effect (the A→Y we want, teal), causal (ink),
// inst (amber), bias (red backdoor), cancel (grey — differenced/cancelled by the design).
const WHATIF = {
  iv: { nodes: [
      { id: "Z", x: 0.5, y: 1.1, role: "Z", label: { zh: "工具 Z（隨機提醒）", en: "instrument Z" } },
      { id: "A", x: 2.1, y: 1.1, role: "A", label: { zh: "治療（接種）", en: "treatment A" } },
      { id: "Y", x: 3.7, y: 1.1, role: "Y", label: { zh: "結果", en: "outcome Y" } },
      { id: "U", x: 2.1, y: 2.5, role: "U", label: { zh: "未測混淆 U", en: "unmeasured U" } }],
    edges: [{ a: "Z", b: "A", kind: "inst" }, { a: "A", b: "Y", kind: "effect" }, { a: "U", b: "A", kind: "bias" }, { a: "U", b: "Y", kind: "bias" }],
    note: { zh: "後門 A←U→Y 打開，<b>不能直接比 A</b>；工具 Z 與 U 無關、又只透過 A 影響 Y（排除限制），是<b>乾淨的側門</b>→在順從者身上辨識 A→Y。", en: "The backdoor A←U→Y is open, so <b>A can't be compared directly</b>; instrument Z is independent of U and affects Y only via A (exclusion) — a <b>clean side door</b> identifying A→Y in compliers." } },
  rdd: { nodes: [
      { id: "R", x: 0.5, y: 1.2, role: "X", label: { zh: "分數 R（年齡）", en: "running R (age)" } },
      { id: "A", x: 2.1, y: 0.6, role: "A", label: { zh: "資格／治療", en: "eligible / treated A" } },
      { id: "Y", x: 3.7, y: 1.2, role: "Y", label: { zh: "結果", en: "outcome Y" } }],
    edges: [{ a: "R", b: "A", kind: "causal", label: { zh: "在斷點 65 跳變", en: "jumps at cutoff 65" } }, { a: "A", b: "Y", kind: "effect" }, { a: "R", b: "Y", kind: "causal", label: { zh: "連續、平滑", en: "continuous, smooth" } }],
    note: { zh: "R 透過斷點決定 A，也可能<b>平滑</b>地直接影響 Y，<b>這條 R→Y 箭頭是允許的，不是違規</b>。RDD <b>不是 IV、不需要排除限制</b>：它靠的是「在斷點處不連續」，而不是「R 對 Y 沒有直接路徑」。斷點附近 R 幾乎固定→A 近似隨機；R→Y 既然<b>連續</b>，那一個<b>突然的跳階就只能來自 A</b>。", en: "R sets A via the cutoff and may also affect Y <b>smoothly</b> — <b>this R→Y arrow is allowed, not a violation</b>. RDD is <b>not IV and needs no exclusion restriction</b>: it relies on a <b>discontinuity at the cutoff</b>, not on R having no direct path to Y. Right at the cutoff R is nearly fixed → A is as-good-as-random; since R→Y is <b>continuous</b>, a <b>sudden jump can only come from A</b>." } },
  did: { nodes: [
      { id: "A", x: 2.1, y: 1.1, role: "A", label: { zh: "政策 A", en: "policy A" } },
      { id: "Y", x: 3.7, y: 1.1, role: "Y", label: { zh: "結果", en: "outcome Y" } },
      { id: "G", x: 0.5, y: 2.4, role: "U", label: { zh: "固定組差", en: "fixed group gap" } },
      { id: "T", x: 0.5, y: -0.2, role: "T", label: { zh: "共同時間趨勢", en: "common time trend" } }],
    edges: [{ a: "A", b: "Y", kind: "effect" }, { a: "G", b: "Y", kind: "cancel", label: { zh: "被差分掉", en: "differenced out" } }, { a: "T", b: "Y", kind: "cancel", label: { zh: "被差分掉", en: "differenced out" } }],
    note: { zh: "固定的<b>組間差</b>與<b>共同時間趨勢</b>被「差異中的差異」差分掉；只要兩組「沒政策的變化」相同（<b>平行趨勢</b>），剩下的就是 A→Y。", en: "Fixed <b>group gaps</b> and the <b>common time trend</b> are differenced away; if the two groups' no-policy changes match (<b>parallel trends</b>), what remains is A→Y." } },
  perr: { nodes: [
      { id: "A", x: 1.6, y: 1.1, role: "A", label: { zh: "用藥 A", en: "drug A" } },
      { id: "Y", x: 3.5, y: 1.1, role: "Y", label: { zh: "事件率", en: "event rate Y" } },
      { id: "U", x: 2.5, y: 2.5, role: "U", label: { zh: "穩定體質 U", en: "stable frailty U" } }],
    edges: [{ a: "A", b: "Y", kind: "effect" }, { a: "U", b: "A", kind: "bias" }, { a: "U", b: "Y", kind: "cancel", label: { zh: "比值相除消掉", en: "cancels in the ratio" } }],
    note: { zh: "穩定體質 U 同時影響用藥與事件率。在<b>事前期</b>也算一次率比、再相除：<b>時間不變、乘法型</b>的 U 被消掉，剩下 A→Y。", en: "Stable frailty U affects both drug use and the event rate. Taking the rate ratio in the <b>prior period</b> and dividing it out cancels <b>time-fixed, multiplicative</b> U, leaving A→Y." } },
  its: { nodes: [
      { id: "T", x: 0.5, y: 1.1, role: "T", label: { zh: "時間趨勢", en: "time trend" } },
      { id: "Y", x: 3.7, y: 1.1, role: "Y", label: { zh: "結果", en: "outcome Y" } },
      { id: "X", x: 2.1, y: 2.5, role: "X", label: { zh: "介入 X", en: "intervention X" } }],
    edges: [{ a: "T", b: "Y", kind: "causal", label: { zh: "反事實＝外推", en: "counterfactual = extrapolation" } }, { a: "X", b: "Y", kind: "effect", label: { zh: "水準/斜率變化", en: "level/slope change" } }],
    note: { zh: "介入前的<b>時間趨勢外推</b>＝「沒介入會怎樣」的反事實；效果＝實際偏離它的幅度。前提：介入時點<b>沒有其他同時發生的原因</b>。", en: "The pre-intervention <b>trend extrapolated</b> is the 'no-intervention' counterfactual; the effect is the departure from it. Assumes <b>no other cause</b> occurs at the same moment." } },
  tit: { nodes: [
      { id: "A", x: 2.1, y: 1.1, role: "A", label: { zh: "暴露 A（隨時間↑）", en: "exposure A (rising)" } },
      { id: "Y", x: 3.7, y: 1.1, role: "Y", label: { zh: "結果", en: "outcome Y" } },
      { id: "U", x: 2.1, y: 2.5, role: "U", label: { zh: "未測混淆 U", en: "unmeasured U" } }],
    edges: [{ a: "A", b: "Y", kind: "effect" }, { a: "U", b: "A", kind: "bias" }, { a: "U", b: "Y", kind: "bias", label: { zh: "只有「跨層相關趨勢」才偏", en: "biases only if its trend tracks A across strata" } }],
    note: { zh: "暴露隨日曆時間上升、且跨「累積暴露機率」層速度不同。<b>只有趨勢跨層跟著暴露走的 U 才會偏</b>，比「無混淆」寬鬆得多。", en: "Exposure rises over calendar time at different speeds across CPE strata. <b>Only a U whose trend tracks exposure across strata biases TiT</b> — far weaker than 'no confounding'." } },
  ccw: { nodes: [
      { id: "A₀", x: 0.5, y: 1.1, role: "A", label: { zh: "早期治療 A₀", en: "early treatment A₀" } },
      { id: "L", x: 1.7, y: 2.5, role: "L", label: { zh: "時變狀態 L₁", en: "time-varying L₁" } },
      { id: "A₁", x: 2.6, y: 1.1, role: "A", label: { zh: "後續治療 A₁", en: "later treatment A₁" } },
      { id: "Y", x: 3.9, y: 1.1, role: "Y", label: { zh: "結果", en: "outcome Y" } }],
    edges: [{ a: "A₀", b: "L", kind: "causal" }, { a: "L", b: "A₁", kind: "bias" }, { a: "L", b: "Y", kind: "bias" }, { a: "A₁", b: "Y", kind: "effect" }],
    note: { zh: "L₁ 是被<b>前一步治療 A₀ 影響、又影響後續治療 A₁ 與結果 Y</b> 的時變混淆。標準校正會出錯（對撞／擋住中介）→ 要用 <b>g-methods（IPCW）</b>。", en: "L₁ is a time-varying confounder <b>affected by prior treatment A₀ and affecting later treatment A₁ and Y</b>. Standard adjustment fails (collider / blocked mediator) → you need <b>g-methods (IPCW)</b>." } },
  seq: { nodes: [
      { id: "L", x: 1.0, y: 2.4, role: "L", label: { zh: "基線 Lₖ", en: "baseline Lₖ" } },
      { id: "A", x: 2.1, y: 1.1, role: "A", label: { zh: "當下啟動 Aₖ", en: "initiate now Aₖ" } },
      { id: "Y", x: 3.7, y: 1.1, role: "Y", label: { zh: "結果", en: "outcome Y" } }],
    edges: [{ a: "L", b: "A", kind: "bias" }, { a: "L", b: "Y", kind: "bias" }, { a: "A", b: "Y", kind: "effect" }],
    note: { zh: "<b>點治療</b>：每個資格月開一場試驗，<b>條件在基線 Lₖ</b> 就可交換（IPTW）；對齊各場時間零點避免 immortal time，再反變異合併。", en: "A <b>point treatment</b>: open a trial each eligibility month; <b>conditioning on baseline Lₖ</b> gives exchangeability (IPTW); align each trial's time zero to avoid immortal time, then pool." } },
  cctc: { nodes: [
      { id: "X", x: 0.5, y: 1.1, role: "X", label: { zh: "危險窗暴露", en: "hazard-window exposure" } },
      { id: "Y", x: 3.7, y: 1.1, role: "Y", label: { zh: "急性事件", en: "acute event Y" } },
      { id: "U", x: 2.1, y: 2.5, role: "U", box: true, label: { zh: "個人固定 Uᵢ", en: "person-fixed Uᵢ" } },
      { id: "T", x: 2.1, y: -0.2, role: "T", label: { zh: "暴露時間趨勢", en: "exposure time trend" } }],
    edges: [{ a: "X", b: "Y", kind: "effect" }, { a: "U", b: "Y", kind: "cancel", label: { zh: "自我對照消掉", en: "cancelled by self-control" } }, { a: "T", b: "X", kind: "bias" }],
    note: { zh: "同一人比危險窗 vs 參考窗→所有<b>個人固定 Uᵢ 自動相消（入框＝條件在人）</b>；暴露的時間趨勢會殘留→<b>CCTC 用對照把趨勢扣掉</b>。", en: "Comparing a person's hazard vs reference window cancels all <b>person-fixed Uᵢ (boxed = conditioned on the person)</b>; the exposure time trend would remain → <b>CCTC divides it out using controls</b>." } },
  cc: { nodes: [
      { id: "A", x: 1.6, y: 1.1, role: "A", label: { zh: "暴露 A", en: "exposure A" } },
      { id: "Y", x: 3.4, y: 1.1, role: "Y", label: { zh: "疾病 Y", en: "disease Y" } },
      { id: "U", x: 2.5, y: 2.5, role: "U", label: { zh: "已測混淆 U（校正）", en: "measured U (adjusted)" } },
      { id: "S", x: 3.9, y: 2.4, role: "S", label: { zh: "選入樣本 S", en: "selected S" } }],
    edges: [{ a: "A", b: "Y", kind: "effect" }, { a: "U", b: "A", kind: "bias" }, { a: "U", b: "Y", kind: "bias" }, { a: "Y", b: "S", kind: "causal", label: { zh: "依結果抽樣", en: "sample on outcome" } }],
    note: { zh: "病例對照＝<b>依「結果」抽樣（Y→S）</b>：選病例＋代表來源族群的對照。把已測混淆 U 校正/配對，OR≈世代效果（罕見時≈RR）。", en: "Case-control samples on the <b>outcome (Y→S)</b>: cases + controls representing the source population. Adjust/match measured U; the OR ≈ the cohort effect (≈ RR when rare)." } },
  sccs: { nodes: [
      { id: "X", x: 0.5, y: 1.1, role: "X", label: { zh: "暴露時段", en: "exposed time" } },
      { id: "Y", x: 3.7, y: 1.1, role: "Y", label: { zh: "事件", en: "event Y" } },
      { id: "U", x: 2.1, y: 2.5, role: "U", box: true, label: { zh: "個人固定 Uᵢ", en: "person-fixed Uᵢ" } },
      { id: "Ag", x: 0.5, y: 2.5, role: "T", label: { zh: "年齡/季節", en: "age / season" } }],
    edges: [{ a: "X", b: "Y", kind: "effect" }, { a: "U", b: "Y", kind: "cancel", label: { zh: "條件在人→相消", en: "conditioned → cancels" } }, { a: "Ag", b: "Y", kind: "bias", label: { zh: "切分調整", en: "split out" } }],
    note: { zh: "只用 case、<b>條件在「人」</b>：所有時間不變的 Uᵢ 自動相消（入框）；會隨時間變的（年齡、季節）用<b>切分</b>調整。", en: "Cases only, <b>conditioning on the person</b>: all time-fixed Uᵢ cancel (boxed); time-varying factors (age, season) are handled by <b>splitting</b>." } },
  acnu: { nodes: [
      { id: "A", x: 1.7, y: 1.1, role: "A", label: { zh: "新使用者：A vs 對照藥 B", en: "new users: A vs comparator B" } },
      { id: "Y", x: 3.6, y: 1.1, role: "Y", label: { zh: "結果", en: "outcome Y" } },
      { id: "S", x: 2.65, y: 2.5, role: "X", box: true, label: { zh: "疾病嚴重度 S（校正）", en: "severity S (adjusted)" } }],
    edges: [{ a: "A", b: "Y", kind: "effect" }, { a: "S", b: "A", kind: "bias", label: { zh: "因適應症而生的混淆", en: "confounding by indication" } }, { a: "S", b: "Y", kind: "bias" }],
    note: { zh: "嚴重度 S 同時影響『拿 A 還是對照藥 B』與結果＝<b>因適應症的混淆</b>。<b>主動對照</b>（同適應症）讓 S 範圍變窄、<b>新使用者</b>對齊時間零點；殘留的 S 用<b>傾向分數校正（入框）</b>→ A ⫫ Y | S。", en: "Severity S drives both 'A vs comparator B' and the outcome = <b>confounding by indication</b>. An <b>active comparator</b> (same indication) narrows the range of S and the <b>new-user</b> design aligns time zero; residual S is removed by <b>adjusting on the propensity score (boxed)</b> → A ⫫ Y | S." } },
  pnu: { nodes: [
      { id: "A", x: 1.7, y: 1.1, role: "A", label: { zh: "用藥 A（含盛行使用者）", en: "drug A (incl. prevalent)" } },
      { id: "Y", x: 3.6, y: 1.1, role: "Y", label: { zh: "結果", en: "outcome Y" } },
      { id: "T", x: 1.7, y: 2.5, role: "T", box: true, label: { zh: "距起始時間 T（條件）", en: "time-since-start T (matched)" } },
      { id: "F", x: 2.95, y: 2.5, role: "U", box: true, label: { zh: "易感體質 F（校正）", en: "frailty F (adjusted)" } }],
    edges: [{ a: "A", b: "Y", kind: "effect" }, { a: "T", b: "A", kind: "bias", label: { zh: "盛行＝存活選擇", en: "prevalent = survival selection" } }, { a: "T", b: "Y", kind: "bias" }, { a: "F", b: "A", kind: "bias" }, { a: "F", b: "Y", kind: "bias" }],
    note: { zh: "盛行使用者是<b>存活下來的低風險群</b>（易感者耗竭）：距起始時間 T 與體質 F 同時影響『還在用 A』與結果。PNU 用<b>時間條件配對（入框 T）</b>＋體質校正（入框 F）把盛行使用者納回來→ A ⫫ Y | T, F。", en: "Prevalent users are the <b>lower-risk survivors</b> (depletion of susceptibles): time-since-start T and frailty F both drive 'still on A' and the outcome. PNU brings them back with <b>time-conditional matching (boxed T)</b> + frailty adjustment (boxed F) → A ⫫ Y | T, F." } },
  nc: { nodes: [
      { id: "A", x: 1.6, y: 0.9, role: "A", label: { zh: "治療（接種）", en: "treatment A" } },
      { id: "Y", x: 3.7, y: 0.9, role: "Y", label: { zh: "結果", en: "outcome Y" } },
      { id: "U", x: 2.65, y: 2.5, role: "U", label: { zh: "未測混淆 U", en: "unmeasured U" } },
      { id: "Z", x: 0.5, y: 2.5, role: "Z", label: { zh: "陰性對照暴露 Z（NCE）", en: "neg-control exposure Z" } },
      { id: "W", x: 4.0, y: 2.5, role: "X", label: { zh: "陰性對照結果 W（NCO）", en: "neg-control outcome W" } }],
    edges: [{ a: "A", b: "Y", kind: "effect" }, { a: "U", b: "A", kind: "bias" }, { a: "U", b: "Y", kind: "bias" }, { a: "U", b: "Z", kind: "causal" }, { a: "U", b: "W", kind: "causal" }],
    note: { zh: "U 開了後門（A←U→Y），但<b>沒測到</b>。關鍵：<b>A 不影響 W、Z 不影響 Y</b>（陰性對照定義），Z、W 只是 U 的代理。偵測：A→W 本應 0，≠0 即偏誤訊號；校正：用 Z、W 解出 U 的效應（confounding bridge / P2SLS）→ 辨識 A→Y。", en: "U opens a backdoor (A←U→Y) but is <b>unmeasured</b>. Key: <b>A does not affect W, Z does not affect Y</b> (the negative-control definitions); Z and W are mere proxies of U. Detection: A→W should be 0, ≠0 flags bias; correction: use Z and W to back out U's effect (confounding bridge / P2SLS) → identify A→Y." } },
  med: { nodes: [
      { id: "A", x: 1.0, y: 0.9, role: "A", label: { zh: "治療（接種）", en: "treatment A" } },
      { id: "M", x: 2.65, y: 2.4, role: "L", label: { zh: "中介 M（抗體）", en: "mediator M (antibody)" } },
      { id: "Y", x: 4.3, y: 0.9, role: "Y", label: { zh: "結果（感染）", en: "outcome Y" } },
      { id: "X", x: 0.4, y: 2.4, role: "X", label: { zh: "共變項 X", en: "covariate X" } }],
    edges: [{ a: "A", b: "M", kind: "causal", label: { zh: "a", en: "a" } }, { a: "M", b: "Y", kind: "causal", label: { zh: "b", en: "b" } },
            { a: "A", b: "Y", kind: "effect", label: { zh: "直接", en: "direct" } },
            { a: "X", b: "A", kind: "bias" }, { a: "X", b: "M", kind: "causal" }, { a: "X", b: "Y", kind: "causal" }],
    note: { zh: "效果走兩條路：<b>間接</b> A→M→Y（透過抗體，NIE＝a·b 一帶）與<b>直接</b> A→Y（其他路徑，NDE）。中介分析把總效果拆成這兩部分。關鍵代價：要拆出間接，必須<b>沒有未測的 M–Y 混淆</b>，連把 A 隨機分派都換不到這一條。", en: "The effect travels two paths: <b>indirect</b> A→M→Y (through antibodies, NIE ≈ a·b) and <b>direct</b> A→Y (other pathways, NDE). Mediation splits the total into these two. The key price: to isolate the indirect part you need <b>no unmeasured M–Y confounding</b> — not even randomising A buys you that." } },
  ps: { nodes: [
      { id: "X", x: 2.1, y: 2.5, role: "X", label: { zh: "已測共變項 X（嚴重度）", en: "measured X (severity)" } },
      { id: "A", x: 1.0, y: 1.0, role: "A", label: { zh: "治療（接種）", en: "treatment A" } },
      { id: "Y", x: 3.7, y: 1.0, role: "Y", label: { zh: "結果", en: "outcome Y" } }],
    edges: [{ a: "A", b: "Y", kind: "effect" }, { a: "X", b: "A", kind: "bias" }, { a: "X", b: "Y", kind: "bias" }],
    note: { zh: "後門 A←X→Y 打開：病重者（X 大）較易接種、也較易出事，直接比 A 會偏。X 是<b>已測</b>的，所以可以對<b>傾向分數 PS＝P(A|X)</b> 做配對／加權把後門擋住→還原 A→Y。前提：沒有未測的混淆、且重疊（正性）。", en: "The backdoor A←X→Y is open: sicker people (large X) are both more likely to be treated and to have the outcome, so comparing A directly is biased. X is <b>measured</b>, so matching/weighting on the <b>propensity score PS = P(A|X)</b> blocks the backdoor and recovers A→Y. Provided: no unmeasured confounding and overlap (positivity)." } },
  tmle: { nodes: [
      { id: "X", x: 2.1, y: 2.5, role: "X", label: { zh: "已測共變項 X（嚴重度）", en: "measured X (severity)" } },
      { id: "A", x: 1.0, y: 1.0, role: "A", label: { zh: "治療（接種）", en: "treatment A" } },
      { id: "Y", x: 3.7, y: 1.0, role: "Y", label: { zh: "結果", en: "outcome Y" } }],
    edges: [{ a: "A", b: "Y", kind: "effect" }, { a: "X", b: "A", kind: "bias" }, { a: "X", b: "Y", kind: "bias" }],
    note: { zh: "同一張後門圖（X 混淆 A 與 Y）。不同的是<b>估計器</b>：TMLE／AIPW 用<b>兩個</b>模型描述這個結構，結果迴歸 Q(A,X) 與傾向分數 PS，所以<b>其一</b>對就不偏（雙重穩健）；TMLE 再做一步 targeting 讓插入式估計有效率。識別仍靠無未測混淆＋正性。", en: "The same back-door picture (X confounds A and Y). What differs is the <b>estimator</b>: TMLE/AIPW use <b>two</b> models of this structure — the outcome regression Q(A,X) and the propensity PS — so it is unbiased if <b>either</b> is right (double robustness); TMLE then targets the plug-in for efficiency. Identification still rests on no-unmeasured-confounding + positivity." } },
  gm: { nodes: [
      { id: "L0", x: 0.5, y: 2.4, role: "L", label: { zh: "L₀ 基線混淆", en: "L₀ baseline" } },
      { id: "A0", x: 0.5, y: 0.9, role: "A", label: { zh: "A₀ 第1期治療", en: "A₀ treat t1" } },
      { id: "L1", x: 2.2, y: 2.4, role: "L", label: { zh: "L₁ 時變混淆", en: "L₁ time-varying" } },
      { id: "A1", x: 2.2, y: 0.9, role: "A", label: { zh: "A₁ 第2期治療", en: "A₁ treat t2" } },
      { id: "Y", x: 3.9, y: 1.65, role: "Y", label: { zh: "結果 Y", en: "outcome Y" } }],
    edges: [{ a: "L0", b: "A0", kind: "bias" }, { a: "L0", b: "L1", kind: "causal" },
            { a: "A0", b: "L1", kind: "causal", label: { zh: "回饋", en: "feedback" } },
            { a: "L1", b: "A1", kind: "bias" }, { a: "L1", b: "Y", kind: "bias" }, { a: "L0", b: "Y", kind: "bias" },
            { a: "A0", b: "Y", kind: "effect" }, { a: "A1", b: "Y", kind: "effect" }],
    note: { zh: "關鍵在 <b>L₁</b>：它被 A₀ 造成（<b>中介</b>，A₀→L₁→Y），又混淆 A₁（<b>L₁→A₁</b>）。<b>條件控制</b> L₁ 會擋掉 A₀ 的效果路徑又開對撞；<b>不控制</b>又讓 L₁ 混淆 A₁。g-methods 用<b>標準化（g-formula）或反機率加權（IPTW）</b>取代條件控制，估「全程用 vs 全程不用」的策略效果。", en: "The crux is <b>L₁</b>: it is caused by A₀ (a <b>mediator</b>, A₀→L₁→Y) yet confounds A₁ (<b>L₁→A₁</b>). <b>Conditioning</b> on L₁ blocks A₀'s effect path and opens a collider; <b>not</b> conditioning leaves L₁ confounding A₁. g-methods replace conditioning with <b>standardisation (g-formula) or inverse-probability weighting (IPTW)</b> to estimate the 'always vs never' regime effect." } },
  tnd: { nodes: [
      { id: "H", x: 2.1, y: 2.5, role: "U", label: { zh: "就醫傾向 H（未測）", en: "care-seeking H (unmeasured)" } },
      { id: "V", x: 0.7, y: 1.4, role: "A", label: { zh: "接種 V", en: "vaccination V" } },
      { id: "Y", x: 3.5, y: 1.4, role: "Y", label: { zh: "目標感染 Y", en: "target infection Y" } },
      { id: "S", x: 2.1, y: 0.5, role: "S", label: { zh: "被檢驗 S（條件在此）", en: "tested S (conditioned)" }, boxed: true }],
    edges: [{ a: "H", b: "V", kind: "bias" }, { a: "H", b: "S", kind: "bias" },
            { a: "V", b: "Y", kind: "effect" }, { a: "Y", b: "S", kind: "causal", label: { zh: "症狀→檢驗", en: "symptoms→tested" } }],
    note: { zh: "<b>就醫傾向 H</b>（未測）同時推動<b>接種 V</b> 與<b>被檢驗 S</b>，是混淆。<b>被檢驗 S</b> 是<b>對撞</b>（H 與「有症狀」都指向它）。TND <b>條件在 S</b> 上（只看被檢驗者），並用<b>檢驗陰性對照</b>，他們也通過了同一道就醫濾網，讓選樣相對接種<b>非差別</b>，於是接種勝算比仍辨識 VE＝1−OR。", en: "<b>Care-seeking H</b> (unmeasured) drives both <b>vaccination V</b> and <b>being tested S</b> — confounding. <b>Tested S</b> is a <b>collider</b> (both H and 'having symptoms' point into it). TND <b>conditions on S</b> (only the tested) and uses <b>test-negative controls</b> — who passed the same care-seeking filter — making the selection <b>non-differential</b> w.r.t. vaccination, so the vaccination odds ratio still identifies VE = 1 − OR." } },
  pssa: { nodes: [
      { id: "T", x: 2.1, y: 2.5, role: "T", label: { zh: "日曆趨勢 T", en: "calendar trend T" } },
      { id: "A", x: 0.7, y: 1.4, role: "A", label: { zh: "指標藥 A 起始", en: "index A start" } },
      { id: "E", x: 2.1, y: 0.5, role: "X", label: { zh: "不良反應", en: "adverse event" } },
      { id: "B", x: 3.5, y: 1.4, role: "Y", label: { zh: "標記藥 B 起始", en: "marker B start" } }],
    edges: [{ a: "T", b: "A", kind: "bias" }, { a: "T", b: "B", kind: "bias", label: { zh: "趨勢", en: "trend" } },
            { a: "A", b: "E", kind: "effect" }, { a: "E", b: "B", kind: "effect", label: { zh: "瀑布", en: "cascade" } }],
    note: { zh: "PSSA 是<b>自我對照</b>：每個用過兩種藥的人當自己的對照，所有<b>時間不變</b>混淆相消、不必畫進來。指標藥 A 的不良反應促使開立標記藥 B（<b>瀑布</b> A→不良反應→B），表現為「先 A 後 B」多於「先 B 後 A」。唯一的後門是<b>日曆趨勢 T</b>：若 B 的使用本來就上升，光趨勢就讓 B 偏晚、灌大 cSR。<b>SRnull</b> 抓住「只有趨勢」下的先後，<b>aSR ＝ cSR ÷ SRnull</b> 把它除掉。", en: "PSSA is <b>self-controlled</b>: each person who used both drugs is their own comparison, so every <b>time-invariant</b> confounder cancels and need not be drawn. The index drug A's adverse event prompts the marker drug B (a <b>cascade</b> A→adverse event→B), seen as more 'A-then-B' than 'B-then-A'. The only back door is the <b>calendar trend T</b>: if B's use is rising, the trend alone makes B come later and inflates the cSR. <b>SRnull</b> captures the trend-only order and <b>aSR = cSR ÷ SRnull</b> divides it out." } },
  tscan: { nodes: [
      { id: "A", x: 0.9, y: 1.4, role: "A", label: { zh: "暴露 A（藥）", en: "exposure A (drug)" } },
      { id: "Y", x: 3.3, y: 1.4, role: "Y", label: { zh: "結果節點 Y", en: "outcome node Y" } },
      { id: "U", x: 2.1, y: 2.5, role: "U", label: { zh: "混淆 U（若有）", en: "confounder U (if any)" } }],
    edges: [{ a: "A", b: "Y", kind: "effect" },
            { a: "U", b: "A", kind: "bias" }, { a: "U", b: "Y", kind: "bias" }],
    note: { zh: "TreeScan 在<b>每個結果節點</b>問「暴露 A 是否抬高風險」，並用<b>打亂暴露標籤的排列虛無</b>模擬「藥到處都沒作用」的世界，拿真實的<b>最大 LLR</b> 跟它比，極端到不像虛無世界的節點才標出，這就一次控制了整棵樹的<b>族系錯誤率</b>。唯一的威脅是後門<b>混淆 U</b>（同時影響暴露與落在哪個節點）：它若存在，排列虛無就不對、訊號有偏（見 ④ C4）。", en: "TreeScan asks, at <b>each outcome node</b>, whether exposure A raises the risk, and uses the <b>label-permutation null</b> to simulate a world where the drug does nothing anywhere, comparing the real <b>max LLR</b> against it — only nodes too extreme to belong to that null world get flagged, which controls the <b>family-wise error</b> across the whole tree at once. The one threat is a back-door <b>confounder U</b> (driving both exposure and which node you land in): if present, the permutation null is wrong and the signals are biased (see ④, C4)." } },
  wce: { nodes: [
      { id: "A", x: 0.9, y: 1.4, role: "A", label: { zh: "加權暴露史 A", en: "weighted exposure A" } },
      { id: "Y", x: 3.3, y: 1.4, role: "Y", label: { zh: "風險 Y", en: "hazard Y" } },
      { id: "L", x: 2.1, y: 2.5, role: "L", label: { zh: "時變病情 Lₜ", en: "time-varying state Lₜ" } }],
    edges: [{ a: "A", b: "Y", kind: "effect" },
            { a: "L", b: "A", kind: "bias", label: { zh: "病重→改藥", en: "sicker→dose change" } },
            { a: "L", b: "Y", kind: "bias" }],
    note: { zh: "WCE 估的是「整段<b>加權暴露史 A</b>」對風險 Y 的效果，權重曲線說明過去每個月的劑量各算多重。它在風險模型裡校正已測共變項；可比成立的前提是「在這些之下，加權暴露近似隨機」。最大威脅是<b>時變病情 Lₜ</b>：病情惡化既讓你<b>改藥</b>（L→A）又<b>拉高風險</b>（L→Y），這是一條時變後門，單一基線校正修不了，要用邊際結構 Cox／g-methods（見 ④ C4）。", en: "WCE estimates the effect of the whole <b>weighted exposure history A</b> on the hazard Y — the weight curve says how much each past month's dose counts. It adjusts for measured covariates in the hazard model; comparability needs the weighted exposure to be as-good-as-random given those. The big threat is the <b>time-varying state Lₜ</b>: worsening disease both <b>changes the dose</b> (L→A) and <b>raises the hazard</b> (L→Y) — a time-varying back door a single baseline adjustment can't fix, needing a marginal structural Cox / g-methods (see ④, C4)." } },
  transport: { nodes: [
      { id: "A", x: 0.6, y: 1.1, role: "A", label: { zh: "治療 A", en: "treatment A" } },
      { id: "Y", x: 3.7, y: 1.1, role: "Y", label: { zh: "結果 Y", en: "outcome Y" } },
      { id: "X", x: 2.15, y: 2.5, role: "X", label: { zh: "效果修飾子 X", en: "effect modifier X" } },
      { id: "S", x: 2.15, y: -0.1, role: "S", box: true, label: { zh: "選樣 S（研究/目標）", en: "selection S (study/target)" } }],
    edges: [{ a: "A", b: "Y", kind: "effect", label: { zh: "效果隨 X 變", en: "effect varies with X" } },
            { a: "X", b: "Y", kind: "causal" },
            { a: "S", b: "X", kind: "causal", label: { zh: "族群決定 X 分布", en: "population sets X" } }],
    note: { zh: "你要的是<b>目標</b>族群的 A→Y 效果，但只在<b>研究</b>裡量到。效果被<b>修飾子 X</b> 改變（A→Y 隨 X 變），而 X 的分布在兩族群不同（S→X）。只要在 X 之下「選樣與反事實獨立」（沒有未測、又分布不同的修飾子），就能對 X <b>標準化／加權</b>把效果搬到目標；還需目標落在研究的共變項支持內（正性）。", en: "You want the A→Y effect in the <b>target</b>, but you only measured it in the <b>study</b>. The effect is changed by the <b>modifier X</b> (A→Y varies with X), and X is distributed differently across populations (S→X). As long as selection is independent of the counterfactual given X (no unmeasured, differentially-distributed modifier), you can <b>standardise / weight</b> over X to carry the effect to the target — provided the target lies within the study's covariate support (positivity)." } },
  extctrl: { nodes: [
      { id: "A", x: 0.6, y: 1.1, role: "A", label: { zh: "治療 A", en: "treatment A" } },
      { id: "Y", x: 3.7, y: 1.1, role: "Y", label: { zh: "結果 Y", en: "outcome Y" } },
      { id: "X", x: 2.15, y: 2.5, role: "X", label: { zh: "預後共變項 X", en: "prognostic covariate X" } },
      { id: "S", x: 2.15, y: -0.1, role: "S", box: true, label: { zh: "臂別 S（試驗/外部）", en: "arm S (trial/external)" } }],
    edges: [{ a: "A", b: "Y", kind: "effect", label: { zh: "治療效果", en: "treatment effect" } },
            { a: "X", b: "Y", kind: "causal" },
            { a: "S", b: "X", kind: "bias", label: { zh: "臂別 → X 分布不同", en: "arm sets X" } }],
    note: { zh: "單臂試驗只給<b>已治療</b>的結果（Yᵃ⁼¹）；外部對照補上<b>未治療</b>的反事實（Yᵃ⁼⁰）。但哪個臂（S）和<b>預後共變項 X</b> 有關（S→X），X 又影響結果（X→Y），這條後門讓直接比較有偏。只要在 X 之下「臂別與未治療反事實獨立」（外部對照可交換、無未測差異、無時代效應），對 X <b>標準化／加權</b>就能把外部臂校到試驗族群、辨識 A→Y；還需試驗落在外部的支持內（正性）。", en: "The single-arm trial gives only the <b>treated</b> outcome (Yᵃ⁼¹); the external controls supply the <b>untreated</b> counterfactual (Yᵃ⁼⁰). But which arm (S) relates to the <b>prognostic covariate X</b> (S→X), and X drives the outcome (X→Y) — this back door biases a raw comparison. As long as the arm is independent of the untreated counterfactual given X (the external controls are exchangeable, with no unmeasured difference or era effect), <b>standardising / weighting</b> over X aligns the external arm to the trial and identifies A→Y — provided the trial lies within the external controls' support (positivity)." } },
};

const WHATIF_COL = { A: TEAL, Y: "#c0504d", U: "#5b7aa8", Z: "#f59e0b", X: "#b45309", T: "#64748b", L: "#7c5fae", S: "#94a3b8" };
const WHATIF_EDGE = { effect: { c: TEAL, w: 3.2 }, causal: { c: INK, w: 2.2 }, inst: { c: "#f59e0b", w: 2.8 }, bias: { c: "#c0504d", w: 2 }, cancel: { c: "#9aa6b2", w: 1.8 } };
const whatifShown = new Set();
// Render the long explanatory note as an HTML paragraph BELOW the chart (not as a
// Plotly annotation inside it), so the graph itself fills the whole frame. Idempotent:
// the <p> is created once right after the chart div and just updated on re-render /
// language toggle. Lands inside the chart's own .whatif-col so it sits under its diagram.
function setDiagNote(chartId, html) {
  const host = document.getElementById(chartId);
  if (!host) return;
  let note = document.getElementById(chartId + "_note");
  if (!note) {
    note = document.createElement("p");
    note.id = chartId + "_note";
    note.className = "caption diagnote";
    host.insertAdjacentElement("afterend", note);
  }
  note.innerHTML = html;
}
function drawWhatif(method) {
  const id = "whatifScene_" + method;
  if (!document.getElementById(id)) return;
  whatifShown.add(method);
  const cfg = WHATIF[method]; if (!cfg) return;
  const L = (o) => (o == null ? "" : (typeof o === "string" ? o : (lang() === "en" ? o.en : o.zh)));
  const pos = {}; cfg.nodes.forEach((n) => { pos[n.id] = [n.x, n.y]; });
  const shapes = [];
  cfg.nodes.forEach((n) => { if (n.box) shapes.push({ type: "rect", x0: n.x - 0.5, x1: n.x + 0.5, y0: n.y - 0.34, y1: n.y + 0.34, line: { color: INK, width: 1.4, dash: "dot" }, fillcolor: "rgba(20,40,60,.05)" }); });
  const anns = [];
  // arrows (Plotly annotation arrows; colour-coded by edge kind)
  cfg.edges.forEach((e) => {
    const [ax, ay] = pos[e.a], [x, y] = pos[e.b];
    const s = WHATIF_EDGE[e.kind] || WHATIF_EDGE.causal;
    anns.push({ x, y, ax, ay, xref: "x", yref: "y", axref: "x", ayref: "y", showarrow: true,
      arrowhead: 3, arrowsize: 1.1, arrowwidth: s.w, arrowcolor: s.c, standoff: 22, startstandoff: 22, text: "" });
    if (e.label) {
      const vert = Math.abs(ax - x) < 0.4;            // vertical edge → push label aside, not onto the line
      const horiz = Math.abs(ay - y) < 0.4;
      const mx = (ax + x) / 2 + (vert ? 0.62 : 0);
      const my = (ay + y) / 2 + (vert ? 0 : (horiz ? 0.24 : 0.05));
      anns.push(Object.assign(_lbl(mx, my, L(e.label), s.c, 9.5), { xanchor: vert ? "left" : "center" }));
    }
  });
  // node markers + ids inside; full label beside
  const traces = [{ x: cfg.nodes.map((n) => n.x), y: cfg.nodes.map((n) => n.y), mode: "markers+text", type: "scatter",
    text: cfg.nodes.map((n) => n.id), textposition: "middle center", textfont: { color: "#fff", size: 16 },
    marker: { color: cfg.nodes.map((n) => WHATIF_COL[n.role] || "#94a3b8"), size: 52, line: { color: "#fff", width: 1.5 } },
    hoverinfo: "none", showlegend: false }];
  cfg.nodes.forEach((n) => anns.push(Object.assign(_lbl(n.x, n.y >= 1.8 ? n.y + 0.58 : n.y - 0.58, L(n.label), INK, 11.5), { xanchor: "center" })));
  // note now lives BELOW the chart (see setDiagNote) so the graph fills the whole frame
  Plotly.react(id, traces, schemaLayout({
    height: 360, shapes, annotations: anns, showlegend: false,
    xaxis: { visible: false, range: [0.0, 4.7], fixedrange: true },
    yaxis: { visible: false, range: [-1.0, 3.25] },
    margin: { t: 10, r: 8, b: 8, l: 8 },
  }), SCENE_CFG);
  setDiagNote(id, L(cfg.note));
}

// ----------------------------------------------------------------------
// SWIG (Single-World Intervention Graph) — same nodes/edges as the DAG, but the
// treatment node is SPLIT into A∣a (left = observed/random A, right = the value a
// we intervene to set) and the outcome becomes the counterfactual Yᵃ. Reads the
// per-method intervention node + counterfactual symbol + exchangeability note here.
// ----------------------------------------------------------------------
const SWIG_META = {
  iv:   { split: "A",  cf: "Yᵃ", note: { zh: "把治療設成 a → 反事實 Yᵃ。IV 的關鍵：U 開了後門，<b>A ⫫ Yᵃ 不成立</b>；改用工具 Z（與 U 無關、只經 A）在順從者上辨識。", en: "Set treatment to a → counterfactual Yᵃ. The IV point: U opens a backdoor so <b>A ⫫ Yᵃ fails</b>; instead Z (independent of U, acting only via A) identifies the effect in compliers." } },
  rdd:  { split: "A",  cf: "Yᵃ", note: { zh: "把資格／治療設成 a → 反事實 Yᵃ。<b>只在斷點處</b> R 近似固定→A ⫫ Yᵃ <b>局部</b>成立（局部隨機化）。R 可以直接、平滑地影響 Y 也無妨，RDD 不靠排除限制（這不是 IV）。", en: "Set eligibility/treatment to a → Yᵃ. <b>Only at the cutoff</b> R is nearly fixed, so A ⫫ Yᵃ holds <b>locally</b> (local randomization). R may even affect Y directly and smoothly — that's fine, RDD does not rely on an exclusion restriction (this is not IV)." } },
  did:  { split: "A",  cf: "Yᵃ", note: { zh: "把政策設成 a → 反事實 Yᵃ。可交換性不直接成立，靠<b>平行趨勢</b>：受處置組『沒政策的 Yᵃ⁼⁰ 變化』＝對照組的變化。", en: "Set policy to a → Yᵃ. Exchangeability isn't direct; <b>parallel trends</b> supply it: the treated group's no-policy change in Yᵃ⁼⁰ equals the controls'." } },
  perr: { split: "A",  cf: "Yᵃ", note: { zh: "把用藥設成 a → 反事實 Yᵃ。穩定體質 U 開後門→A ⫫ Yᵃ 不成立；用<b>事前期比值相除</b>消掉時間不變的 U。", en: "Set drug to a → Yᵃ. Stable frailty U opens a backdoor so A ⫫ Yᵃ fails; the <b>prior-period ratio</b> divides out time-fixed U." } },
  its:  { split: "X",  cf: "Yˣ", note: { zh: "把介入設成 x → 反事實 Yˣ。沒有對照組；用介入前<b>趨勢外推</b>當 Yˣ⁼⁰，前提是同一時點沒有其他原因。", en: "Set intervention to x → Yˣ. No control group; the pre-trend <b>extrapolation</b> serves as Yˣ⁼⁰, assuming no co-occurring cause." } },
  tit:  { split: "A",  cf: "Yᵃ", note: { zh: "把暴露設成 a → 反事實 Yᵃ。A ⫫ Yᵃ 不需全成立，只要沒有『跨層相關趨勢』的 U，OR=exp(β₁) 仍可辨識。", en: "Set exposure to a → Yᵃ. A ⫫ Yᵃ needn't fully hold — absent a U whose trend tracks exposure across strata, OR=exp(β₁) is still identified." } },
  ccw:  { split: "A₁", cf: "Yᵍ", note: { zh: "把整個策略設成 ḡ（此處示意設 A₁=a₁）→ 反事實 Yᵍ。可交換性是<b>序列的</b>：每一步要條件在過去（含 L₁）才成立→用 IPCW。", en: "Set the whole strategy to ḡ (here illustrated by setting A₁=a₁) → Yᵍ. Exchangeability is <b>sequential</b>: it holds only conditional on the past (incl. L₁) at each step → use IPCW." } },
  seq:  { split: "A",  cf: "Yᵃ", note: { zh: "把『當下啟動』設成 a → 反事實 Yᵃ。每場試驗內<b>條件在基線 Lₖ</b>，A ⫫ Yᵃ | Lₖ 成立（IPTW）；對齊時間零點。", en: "Set 'initiate now' to a → Yᵃ. Within each trial, <b>conditional on baseline Lₖ</b>, A ⫫ Yᵃ | Lₖ holds (IPTW); align time zero." } },
  cctc: { split: "X",  cf: "Yˣ", note: { zh: "把危險窗暴露設成 x → 反事實 Yˣ。<b>條件在「人」</b>，個人固定 Uᵢ 相消→Xᵢ ⫫ Yˣ | 人；再用對照扣掉暴露時間趨勢。", en: "Set hazard-window exposure to x → Yˣ. <b>Conditional on the person</b>, fixed Uᵢ cancels → Xᵢ ⫫ Yˣ | person; controls then remove the exposure time trend." } },
  cc:   { split: "A",  cf: "Yᵃ", note: { zh: "把暴露設成 a → 反事實 Yᵃ。可交換性＝已測 U 校正＋對照代表來源族群；OR 在<b>依結果抽樣</b>下仍≈世代效果。", en: "Set exposure to a → Yᵃ. Exchangeability = measured U adjusted + controls representing the source population; the OR still ≈ the cohort effect despite <b>sampling on the outcome</b>." } },
  sccs: { split: "X",  cf: "Yˣ", note: { zh: "把『暴露時段』設成 x → 反事實 Yˣ。<b>條件在「人」</b>，所有時間不變的 Uᵢ 相消→Xᵢ ⫫ Yˣ | 人；年齡／季節用切分處理。", en: "Set 'exposed time' to x → Yˣ. <b>Conditional on the person</b>, all time-fixed Uᵢ cancel → Xᵢ ⫫ Yˣ | person; age/season handled by splitting." } },
  acnu: { split: "A",  cf: "Yᵃ", note: { zh: "把『用 A（vs 對照藥 B）』設成 a → 反事實 Yᵃ。可交換性靠<b>主動對照＋新使用者</b>把 S 範圍縮小，再<b>校正嚴重度 S</b>達成：A ⫫ Yᵃ | S。", en: "Set 'take A (vs comparator B)' to a → counterfactual Yᵃ. Exchangeability comes from the <b>active comparator + new-user</b> design narrowing S, then <b>adjusting for severity S</b>: A ⫫ Yᵃ | S." } },
  pnu: { split: "A",  cf: "Yᵃ", note: { zh: "把『用 A』設成 a → 反事實 Yᵃ。盛行使用者有易感者耗竭，要<b>條件在距起始時間 T 與體質 F</b> 才可交換：A ⫫ Yᵃ | T, F（時間條件配對＋校正）。", en: "Set 'take A' to a → counterfactual Yᵃ. Prevalent users carry depletion of susceptibles, so exchangeability holds only <b>conditional on time-since-start T and frailty F</b>: A ⫫ Yᵃ | T, F (time-conditional matching + adjustment)." } },
  nc:  { split: "A",  cf: "Yᵃ", note: { zh: "把治療設成 a → 反事實 Yᵃ。U 未測，A ⫫ Yᵃ <b>不成立</b>；改用陰性對照 Z、W（U 的代理）解出 confounding bridge，在<b>近端意義</b>下辨識 Yᵃ（P2SLS）。", en: "Set treatment to a → counterfactual Yᵃ. U is unmeasured so A ⫫ Yᵃ <b>fails</b>; instead the negative controls Z, W (proxies of U) solve a confounding bridge that identifies Yᵃ in the <b>proximal</b> sense (P2SLS)." } },
  med: { split: "A",  cf: "Yᵃ", note: { zh: "把治療設成 a → 反事實。中介分析用<b>跨世界</b>反事實 Yᵃ˒ᴹ⁽ᵃ*⁾：把暴露設 a、卻把中介固定在另一暴露值 a* 會有的 M。NDE 比 a=1 vs 0（M 固定在 M(0)）；NIE 在 a=1 下搬動 M(0)→M(1)。需序列可交換＋無暴露誘發的 M–Y 混淆。", en: "Set treatment to a → counterfactual. Mediation uses the <b>cross-world</b> counterfactual Yᵃ˒ᴹ⁽ᵃ*⁾: set exposure to a but hold the mediator at the M it would take under another exposure a*. NDE contrasts a=1 vs 0 with M fixed at M(0); NIE moves M(0)→M(1) under a=1. Needs sequential exchangeability + no exposure-induced M–Y confounder." } },
  ps:  { split: "A",  cf: "Yᵃ", note: { zh: "把接種設成 a → 反事實 Yᵃ。傾向分數對<b>已測 X</b> 做配對／加權，讓被設定的治療在 X 下和反事實獨立：<b>A ⫫ Yᵃ | X</b>（條件可交換）。這時 IPTW／重疊加權後的對比＝因果效果。救不了未測的混淆。", en: "Set vaccination to a → counterfactual Yᵃ. The propensity score matches/weights on the <b>measured X</b> so the set treatment is independent of the counterfactual given X: <b>A ⫫ Yᵃ | X</b> (conditional exchangeability). Then the IPTW/overlap-weighted contrast equals the causal effect. It cannot fix an unmeasured confounder." } },
  tmle: { split: "A", cf: "Yᵃ", note: { zh: "把接種設成 a → 反事實 Yᵃ。識別條件和 PS 相同（A ⫫ Yᵃ | X）。差別在估計：TMLE／AIPW 用結果模型<b>與</b>傾向分數兩張網，<b>其一</b>對就不偏（雙重穩健）；TMLE 的 targeting 步讓插入式估計達到半參數有效率。", en: "Set vaccination to a → counterfactual Yᵃ. Identification is the same as PS (A ⫫ Yᵃ | X). The difference is estimation: TMLE/AIPW use both an outcome model <b>and</b> a propensity score, unbiased if <b>either</b> is right (double robustness); TMLE's targeting step makes the plug-in semiparametric-efficient." } },
  gm:  { split: "A0", cf: "Yᵃ", note: { zh: "<b>兩個</b>治療都介入：把 A₀、A₁ 都設成策略值 a → 策略反事實 Yᵃ。識別靠<b>序列可交換</b>：每個時點，在過去史（含 Lₜ）之下被設定的治療與 Yᵃ 獨立。注意不能直接「條件在 L₁」（它是中介＋對撞），要用標準化（g-formula）或反機率加權（IPTW）。", en: "Intervene on <b>both</b> treatments: set A₀ and A₁ to the regime values a → the regime counterfactual Yᵃ. Identification rests on <b>sequential exchangeability</b>: at each time, given the past history (including Lₜ), the set treatment is independent of Yᵃ. You cannot simply 'condition on L₁' (it's a mediator + collider) — use standardisation (g-formula) or inverse-probability weighting (IPTW)." } },
  tnd: { split: "V",  cf: "Yᵃ", note: { zh: "把接種設成 a → 目標感染的反事實 Yᵃ。TND 不是條件在共變項、而是<b>條件在「被檢驗 S」</b>這個選樣上：用陰性對照讓 S 相對接種<b>非差別</b>，於是在被檢驗者中 <b>V ⫫ Yᵃ</b>，勝算比＝VE。前提：對照疾病中性、檢驗準確、相同症狀下就醫無差別。", en: "Set vaccination to a → the counterfactual target infection Yᵃ. TND conditions not on covariates but on the <b>selection 'tested S'</b>: test-negative controls make S <b>non-differential</b> w.r.t. vaccination, so among the tested <b>V ⫫ Yᵃ</b> and the odds ratio gives VE. Provided: a neutral control disease, an accurate test, and no differential care-seeking given symptoms." } },
  wce: { split: "A", cf: "Yᵃ", note: { zh: "把整段暴露史設成某型態 a → 反事實風險 Yᵃ。WCE 透過「加權暴露摘要」估這段歷史的效果，權重曲線由樣條從資料學出。可交換性靠校正已測共變項取得；最關鍵、不可檢的是<b>沒有時變的適應症混淆</b>，若病情同時驅動用藥與結果，得改用邊際結構 Cox／g-methods。", en: "Set the whole exposure history to a pattern a → counterfactual hazard Yᵃ. WCE estimates that history's effect through its weighted summary, with the weight curve learned from data by splines. Exchangeability comes from adjusting measured covariates; the key, untestable one is <b>no time-varying confounding by indication</b> — if disease state drives both dose and outcome, switch to a marginal structural Cox / g-methods." } },
  tscan: { split: "A", cf: "Yᵃ", note: { zh: "把暴露設成 a → 每個結果節點的反事實風險 Yᵃ。TreeScan 不是估單一效果，而是<b>篩</b>：當某節點觀察到的暴露超額，極端到不像「藥沒作用」世界裡最極端的節點時就標出。那個「藥沒作用」的世界＝<b>打亂暴露標籤的排列虛無</b>。前提：樹有意義、各節點基準為常數、無未建模混淆（否則排列虛無不對）。", en: "Set exposure to a → the counterfactual risk Yᵃ at each outcome node. TreeScan estimates no single effect — it <b>screens</b>: a node is flagged when its observed exposed excess is too extreme to belong to the most-extreme node of a 'drug does nothing' world. That no-effect world is the <b>label-permutation null</b>. Provided: a meaningful tree, a constant baseline across nodes, and no unmodelled confounding (else the permutation null is wrong)." } },
  pssa: { split: "A", cf: "Bᵃ", note: { zh: "把指標藥 A 設成 a → 反事實的標記藥起始 Bᵃ。PSSA 靠<b>自我對照</b>取得可交換：時間不變混淆在個人內自動相消，不必校正。剩下唯一要處理的是<b>日曆趨勢</b>，用 SRnull 除掉。於是「先後不對稱」辨識出 A→B 的瀑布（aSR＞1）。前提：瀑布方向合理、趨勢建模正確、新使用者、時間窗合適。", en: "Set the index drug A to a → the counterfactual marker-drug start Bᵃ. PSSA gets exchangeability from <b>self-control</b>: time-invariant confounders cancel within-person and need no adjustment. The only thing left to handle is the <b>calendar trend</b> — removed by SRnull. The order asymmetry then identifies the A→B cascade (aSR > 1). Provided: a plausible cascade direction, a correctly modelled trend, new users, and a sensible time window." } },
  transport: { split: "A", cf: "Yᵃ", note: { zh: "把治療設成 a → 反事實 Yᵃ，但你要的是<b>目標族群</b>的 Yᵃ。選樣 S 在效果修飾子 X 上和兩族群有關；只要<b>在 X 之下 S ⫫ Yᵃ</b>（沒有未測、又分布不同的修飾子），對 X 標準化／加權就能把研究的反事實對比搬成目標的。", en: "Set treatment to a → counterfactual Yᵃ, but you want Yᵃ in the <b>target</b>. Selection S relates to the populations through the effect modifier X; as long as <b>S ⫫ Yᵃ given X</b> (no unmeasured, differentially-distributed modifier), standardising / weighting over X carries the study's counterfactual contrast to the target." } },
  extctrl: { split: "A", cf: "Yᵃ", note: { zh: "把治療設成 a → 反事實 Yᵃ。單臂試驗只觀察到 Yᵃ⁼¹；外部對照提供 Yᵃ⁼⁰。臂別 S 在預後共變項 X 上和兩臂有關；只要<b>在 X 之下 S ⫫ Yᵃ⁼⁰</b>（外部對照可交換、無未測差異與時代效應），對 X 標準化／加權就能用外部臂辨識治療效果。", en: "Set treatment to a → counterfactual Yᵃ. The single-arm trial observes only Yᵃ⁼¹; the external controls supply Yᵃ⁼⁰. Arm S relates to the two arms through the prognostic covariate X; as long as <b>S ⫫ Yᵃ⁼⁰ given X</b> (the external controls are exchangeable, with no unmeasured difference or era effect), standardising / weighting over X identifies the treatment effect from the borrowed arm." } },
};

const swigShown = new Set();
function drawSwig(method) {
  const id = "swigScene_" + method;
  if (!document.getElementById(id)) return;
  swigShown.add(method);
  const cfg = WHATIF[method]; if (!cfg) return;
  const meta = SWIG_META[method] || {};
  const splitId = meta.split || "A";
  const cfSym = meta.cf || "Yᵃ";
  const setSym = (splitId[0] === "X") ? "x" : "a";       // intervention value label
  const L = (o) => (o == null ? "" : (typeof o === "string" ? o : (lang() === "en" ? o.en : o.zh)));
  const pos = {}; cfg.nodes.forEach((n) => { pos[n.id] = [n.x, n.y]; });
  const HW = 0.60, HH = 0.42;                            // split-box half width / height
  const sp = pos[splitId];
  const shapes = [];
  // keep dashed "conditioned-on" boxes
  cfg.nodes.forEach((n) => { if (n.box) shapes.push({ type: "rect", x0: n.x - 0.5, x1: n.x + 0.5, y0: n.y - 0.34, y1: n.y + 0.34, line: { color: INK, width: 1.4, dash: "dot" }, fillcolor: "rgba(20,40,60,.05)" }); });
  // the split (intervention) node: a two-tone box  [ A | a ]  (left = observed, right = set value)
  if (sp) {
    const [sx, sy] = sp;
    shapes.push({ type: "rect", x0: sx - HW, x1: sx, y0: sy - HH, y1: sy + HH, line: { color: "#fff", width: 1.5 }, fillcolor: TEAL });           // observed A
    shapes.push({ type: "rect", x0: sx, x1: sx + HW, y0: sy - HH, y1: sy + HH, line: { color: TEAL, width: 1.8 }, fillcolor: "#ffffff" });          // set value a
    shapes.push({ type: "line", x0: sx, x1: sx, y0: sy - HH, y1: sy + HH, line: { color: TEAL, width: 1.5 } });
  }
  // endpoint on the split-box boundary facing (ox,oy); other nodes use their centre
  const endAt = (nodeId, ox, oy) => {
    if (nodeId !== splitId || !sp) return pos[nodeId];
    const [cx, cy] = pos[nodeId], dx = ox - cx, dy = oy - cy;
    return (Math.abs(dx) >= Math.abs(dy)) ? [cx + (dx > 0 ? HW : -HW), cy] : [cx, cy + (dy > 0 ? HH : -HH)];
  };
  const anns = [];
  cfg.edges.forEach((e) => {
    const ca = pos[e.a], cb = pos[e.b];
    const [ax, ay] = endAt(e.a, cb[0], cb[1]);
    const [x, y] = endAt(e.b, ca[0], ca[1]);
    const s = WHATIF_EDGE[e.kind] || WHATIF_EDGE.causal;
    anns.push({ x, y, ax, ay, xref: "x", yref: "y", axref: "x", ayref: "y", showarrow: true,
      arrowhead: 3, arrowsize: 1.1, arrowwidth: s.w, arrowcolor: s.c,
      standoff: (e.b === splitId ? 6 : 22), startstandoff: (e.a === splitId ? 6 : 22), text: "" });
    if (e.label) {
      const vert = Math.abs(ax - x) < 0.4;            // vertical edge → push label aside, not onto the line
      const horiz = Math.abs(ay - y) < 0.4;
      const mx = (ax + x) / 2 + (vert ? 0.62 : 0);
      const my = (ay + y) / 2 + (vert ? 0 : (horiz ? 0.24 : 0.05));
      anns.push(Object.assign(_lbl(mx, my, L(e.label), s.c, 9.5), { xanchor: vert ? "left" : "center" }));
    }
  });
  // split-box inner labels  A | a
  if (sp) {
    const [sx, sy] = sp;
    anns.push(Object.assign(_lbl(sx - HW / 2, sy, splitId, "#fff", 15), { xanchor: "center", yanchor: "middle" }));
    anns.push(Object.assign(_lbl(sx + HW / 2, sy, setSym, TEAL, 15.5), { xanchor: "center", yanchor: "middle" }));
  }
  // other nodes drawn as markers; the outcome node is relabelled to the counterfactual symbol
  const others = cfg.nodes.filter((n) => n.id !== splitId);
  const traces = [{ x: others.map((n) => n.x), y: others.map((n) => n.y), mode: "markers+text", type: "scatter",
    text: others.map((n) => (n.role === "Y" ? cfSym : n.id)), textposition: "middle center",
    textfont: { color: "#fff", size: 16 },
    marker: { color: others.map((n) => WHATIF_COL[n.role] || "#94a3b8"), size: 52, line: { color: "#fff", width: 1.5 } },
    hoverinfo: "none", showlegend: false }];
  cfg.nodes.forEach((n) => {
    const lab = (n.id === splitId)
      ? (lang() === "en" ? "intervention node A∣a" : "介入節點 A∣a")
      : (n.role === "Y" ? cfSym + (lang() === "en" ? " (counterfactual)" : "（反事實）") : L(n.label));
    anns.push(Object.assign(_lbl(n.x, n.y >= 1.8 ? n.y + 0.58 : n.y - 0.58, lab, INK, 11.5), { xanchor: "center" }));
  });
  // note now lives BELOW the chart (see setDiagNote) so the graph fills the whole frame
  Plotly.react(id, traces, schemaLayout({
    height: 360, shapes, annotations: anns, showlegend: false,
    xaxis: { visible: false, range: [0.0, 4.7], fixedrange: true },
    yaxis: { visible: false, range: [-1.0, 3.25] },
    margin: { t: 10, r: 8, b: 8, l: 8 },
  }), SCENE_CFG);
  setDiagNote(id, L(meta.note || cfg.note));
}

// draw both the DAG and the SWIG for a method (used by PANEL_INIT + language re-render)
function drawWhatifPair(method) { drawWhatif(method); drawSwig(method); }

// ======================================================================
// Sequential trials — tabs ①–⑤
// ======================================================================
const seqState = { source: null, columns: [], req: null };
let seqLearnReady = false, seqPlayReady = false, seqAnalyzeReady = false,
    seqAssumeReady = false, seqMlReady = false;

// per-trial risk differences + pooled / truth / naive lines
function seqPerTrialInto(elId, d) {
  if (!document.getElementById(elId) || !d) return;
  const pt = d.per_trial || [];
  const xs = pt.map((p) => p.k), ys = pt.map((p) => p.rd);
  const xr = pt.length ? [Math.min(...xs) - 0.5, Math.max(...xs) + 0.5] : [-0.5, 5.5];
  const traces = [
    { x: xs, y: ys, mode: "markers", type: "scatter", name: tr("每場試驗的風險差", "per-trial risk diff"),
      marker: { color: SLATE, size: 9 } },
    { x: xr, y: [d.seq_rd, d.seq_rd], mode: "lines", type: "scatter", name: tr("合併（序列）", "pooled (sequential)"), line: { color: TEAL, width: 3 } },
    { x: xr, y: [d.naive, d.naive], mode: "lines", type: "scatter", name: tr("未校正（曾 vs 從未）", "naive (ever vs never)"), line: { color: AMBER, width: 3, dash: "dot" } },
  ];
  Plotly.react(elId, traces, sceneLayout({
    height: 300, legend: { orientation: "h", y: 1.16 }, margin: { t: 28, r: 18, b: 42, l: 54 },
    xaxis: { title: tr("序列試驗（資格月 k）", "sequential trial (eligibility month k)"), dtick: 1 },
    yaxis: { title: tr("風險差", "risk difference") },
    shapes: [{ type: "line", x0: xr[0], x1: xr[1], y0: d.true_rd, y1: d.true_rd, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: xr[1], y: d.true_rd, text: tr("真值", "truth"), showarrow: false, yshift: 11, xanchor: "right", font: { color: GREEN, size: 11 } }],
  }), SCENE_CFG);
}

// ① learn: the SPIRIT of sequential (target-trial) emulation — at each eligibility month
// you open a brand-new emulated trial, RESET its clock to time-zero, and compare those who
// initiate at that moment (treated) vs those who don't yet (control), following each forward.
// The same person can be a control in early trials then an initiator later (re-entry). The
// per-trial effects are pooled. This avoids the immortal-time bias of "ever vs never".
function drawSceneSeq() {
  if (!document.getElementById("seqScene")) return;
  const TREAT = TEAL, CTRL = "#5b7aa8", RING = "#2e8b6f", T0 = 1.4, TEND = 6.6;
  // three emulated trials, each realigned to its own time zero (T0) and run forward
  const trialY = [[5.0, 4.45], [3.5, 2.95], [2.0, 1.45]];   // [treated, control] per trial
  const labels = [tr("資格月 k=0", "elig. month k=0"), tr("資格月 k=1", "k=1"), tr("資格月 k=2", "k=2")];
  const shapes = [
    // common time-zero alignment line
    { type: "line", x0: T0, x1: T0, y0: 0.9, y1: 5.45, line: { color: "#94a3b8", width: 1.4, dash: "dot" } },
    // pooling region on the right
    { type: "rect", x0: 8.0, x1: 9.5, y0: 1.2, y1: 5.0, fillcolor: "rgba(63,130,104,.12)", line: { color: "rgba(63,130,104,.5)", width: 1 } },
  ];
  const pillX = [], pillY = [], evX = [], evY = [], reX = [], reY = [];
  trialY.forEach(([yT, yC], k) => {
    // treated (initiate-now) lane + control (not-yet) lane, both running forward from T0
    shapes.push({ type: "line", x0: T0, x1: TEND, y0: yT, y1: yT, line: { color: TREAT, width: 6 } });
    shapes.push({ type: "line", x0: T0, x1: TEND, y0: yC, y1: yC, line: { color: CTRL, width: 6 } });
    pillX.push(T0); pillY.push(yT);                                  // treatment starts at time zero
    // a couple of events along the lanes
    if (k === 0) { evX.push(5.6); evY.push(yC); }
    if (k === 1) { evX.push(6.0); evY.push(yT); }
    if (k === 2) { evX.push(5.2); evY.push(yC); }
    // per-trial effect → feeds the pool
    shapes.push({ type: "line", x0: TEND + 0.15, x1: 8.0, y0: (yT + yC) / 2, y1: 3.1, line: { color: "#9aa6b2", width: 1, dash: "dot" } });
  });
  // re-entry: the same person (amber) is a CONTROL in k=0 and k=1, then INITIATES in k=2
  reX.push(T0, T0, T0); reY.push(4.45, 2.95, 2.0);
  shapes.push({ type: "line", x0: T0, x1: T0, y0: 2.0, y1: 4.45, line: { color: "#f59e0b", width: 1.2, dash: "dot" } });
  const traces = [
    { x: pillX, y: pillY, mode: "markers", type: "scatter", name: tr("時間零點＝當下啟動", "time zero = initiate now"), marker: { color: "#b45309", size: 12, symbol: "square" } },
    { x: evX, y: evY, mode: "markers", type: "scatter", name: tr("● 事件", "● event"), marker: { color: RED, size: 12 } },
    { x: reX, y: reY, mode: "markers", type: "scatter", name: tr("同一人重複收案", "same person re-enters"), marker: { color: "#f59e0b", size: 11, symbol: "circle-open", line: { width: 2.5 } } },
    { x: [8.75], y: [3.1], mode: "markers", type: "scatter", name: tr("反變異合併＝序列估計", "inverse-variance pool = sequential estimate"), marker: { color: RING, size: 22, symbol: "diamond" } },
    { x: [null], y: [null], mode: "markers", type: "scatter", name: tr("啟動臂 / 未啟動臂", "treated / control arm"), marker: { color: TREAT, size: 11 } },
  ];
  const anns = [
    Object.assign(_lbl(T0, 5.6, tr("時間零點對齊（每場各自歸零）", "time-zero aligned (each trial resets its clock)"), SLATE, 9.5), { xanchor: "center" }),
    Object.assign(_lbl(8.75, 5.15, tr("③ 反變異合併", "③ pool"), RING, 9.5), { xanchor: "center" }),
    Object.assign(_lbl(8.75, 0.95, tr("序列試驗估計", "sequential estimate"), RING, 9), { xanchor: "center" }),
    Object.assign(_lbl((T0 + TEND) / 2, 5.85, tr("① 每個資格月開一場「模擬目標試驗」（② 當下啟動 vs 未啟動，往前追蹤）", "① an emulated target trial at each eligibility month (② initiate-now vs not, followed forward)"), INK, 9), { xanchor: "center" }),
  ];
  trialY.forEach(([yT, yC], k) => {
    anns.push(Object.assign(_lbl(T0 - 0.15, (yT + yC) / 2, labels[k], INK, 8.5), { xanchor: "right" }));
    anns.push(Object.assign(_lbl(TEND + 0.05, yT, tr("啟動", "treated"), TREAT, 8), { xanchor: "left" }));
    anns.push(Object.assign(_lbl(7.05, (yT + yC) / 2, "RD" + ["₀", "₁", "₂"][k], "#64748b", 9), { xanchor: "center" }));
  });
  anns.push(_lbl(4.5, 0.3, tr(
    "未校正「曾治療 vs 從未」把所有時間混在一起：曾治療者必須<b>活到能治療</b>＝immortal time，會高估治療。序列試驗在<b>每個資格月各開一場</b>、把<b>時間零點歸零</b>後比「當下啟動 vs 未啟動」、再<b>反變異合併</b>，就避開這個偏誤；同一人未啟動可重複收案（橘圈），啟動後退出。",
    "Naive 'ever vs never' lumps all time together: the ever-treated had to <b>survive long enough to treat</b> = immortal time, overstating the effect. Sequential trials open <b>one trial per eligibility month</b>, <b>reset time-zero</b>, compare 'initiate-now vs not', and <b>inverse-variance pool</b> — avoiding the bias. The same person can re-enter as a control (amber) until they initiate, then exits."), INK, 9.5));
  Plotly.react("seqScene", traces, schemaLayout({
    height: 340, shapes, annotations: anns, showlegend: true, legend: { orientation: "h", y: 1.14 },
    xaxis: { visible: true, title: tr("試驗內追蹤時間（已對齊）", "in-trial follow-up time (aligned)"), range: [-0.2, 9.8], fixedrange: true, showticklabels: false },
    yaxis: { visible: false, range: [-0.1, 6.1] },
    margin: { t: 30, r: 14, b: 30, l: 70 },
  }), SCENE_CFG);
}
function initSeqLearn() { if (seqLearnReady) return; seqLearnReady = true; drawSceneSeq(); }

// ② interactive — confounding slider
const seqConfSlider = document.getElementById("seqConfSlider");
let seqPlayTimer = null;
function initSeqPlay() { if (seqPlayReady) return; seqPlayReady = true; refreshSeqPlay(); }
function scheduleSeqPlay() {
  document.getElementById("seqConfVal").textContent = Number(seqConfSlider.value).toFixed(1);
  clearTimeout(seqPlayTimer); seqPlayTimer = setTimeout(refreshSeqPlay, 300);
}
if (seqConfSlider) seqConfSlider.addEventListener("input", scheduleSeqPlay);
async function refreshSeqPlay() {
  const cf = seqConfSlider ? Number(seqConfSlider.value) : 1.0;
  let d;
  try { d = await getJSON(`${API}/api/seq_interactive?conf=${cf}&lang=${lang()}`); } catch (e) { return; }
  state.seqPlay = d;
  const set = (id, v, col) => { const el = document.getElementById(id); if (el) { el.textContent = fmt(v, 2); if (col) el.style.color = col; } };
  set("seqEst", d.seq_rd, Math.abs(d.seq_rd - d.true_rd) < 0.06 ? TEAL : AMBER);
  set("seqTruth", d.true_rd, GREEN);
  set("seqNaiveEst", d.naive, RED);
  seqPerTrialInto("seqPlayChart", d);
}

// ③ analyze
function initSeqAnalyze() { if (seqAnalyzeReady) return; seqAnalyzeReady = true; document.getElementById("useSeqExample").click(); }
function seqFillSelects(cols) {
  const opts = cols.map((c) => `<option value="${c}">${c}</option>`).join("");
  ["seqSelInit", "seqSelEvent", "seqSelFu"].forEach((id) => document.getElementById(id).innerHTML = opts);
  const cov = document.getElementById("seqSelCov"); if (cov) cov.innerHTML = opts;
  document.getElementById("seqColMap").classList.remove("hidden");
}
function seqApplyDefaults(d) {
  if (!d) return;
  const set = (id, v) => { const el = document.getElementById(id); if (v != null && el) el.value = v; };
  set("seqSelInit", d.init_time); set("seqSelEvent", d.event); set("seqSelFu", d.futime);
  const cov = document.getElementById("seqSelCov");
  if (cov && d.covariates) [...cov.options].forEach((o) => { o.selected = d.covariates.includes(o.value); });
}
document.getElementById("useSeqExample").addEventListener("click", async () => {
  const st = document.getElementById("seqDataStatus");
  try {
    const d = await getJSON(`${API}/api/seq_example`);
    seqState.source = "example_seq"; seqState.columns = d.columns;
    st.textContent = tr(`已載入內建點治療範例（${d.n} 人，合成虛構）`, `Loaded built-in point-treatment example (${d.n} people, synthetic)`);
    seqFillSelects(d.columns); seqApplyDefaults(d.defaults);
    runSeqAnalyze();
  } catch (e) { st.textContent = tr("載入失敗：", "Load failed: ") + e.message; }
});
document.getElementById("seqFileInput").addEventListener("change", async (ev) => {
  const file = ev.target.files[0]; if (!file) return;
  const fd = new FormData(); fd.append("file", file);
  const st = document.getElementById("seqDataStatus"); st.textContent = tr("上傳中…", "Uploading…");
  try {
    const r = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error((await r.json()).detail);
    const d = await r.json();
    seqState.source = d.token; seqState.columns = d.columns;
    st.textContent = tr(`已上傳「${file.name}」（${d.n} 列）`, `Uploaded "${file.name}" (${d.n} rows)`);
    seqFillSelects(d.columns);
  } catch (e) { st.textContent = tr("上傳失敗：", "Upload failed: ") + e.message; }
});
function seqCurrentMapping() {
  const v = (id) => document.getElementById(id).value;
  const cov = [...document.getElementById("seqSelCov").selectedOptions].map((o) => o.value);
  return { source: seqState.source, init_time: v("seqSelInit"), event: v("seqSelEvent"),
    futime: v("seqSelFu"), covariates: cov.length ? cov : ["age", "frailty"], lang: lang() };
}
const runSeqBtn = document.getElementById("runSeqAnalyze");
if (runSeqBtn) runSeqBtn.addEventListener("click", runSeqAnalyze);
async function runSeqAnalyze() {
  const req = seqCurrentMapping();
  if (!req.source) return;
  seqState.req = req;
  try {
    const a = await postJSON(`${API}/api/seq_analyze`, req);
    renderSeqAnalyze(a);
    runSeqAssumptions(req);
  } catch (e) { alert(tr("分析失敗：", "Analysis failed: ") + e.message); }
}
function renderSeqAnalyze(a) {
  document.getElementById("seqAnalyzeOut").classList.remove("hidden");
  const cards = [
    [tr("序列合併（因果風險差）", "Sequential pooled (causal risk diff)"), a.seq_rd, a.interpretation, true],
    [tr("未校正（曾 vs 從未治療）", "Naive (ever vs never treated)"), a.naive,
      tr("被 immortal-time bias 與混淆扭曲。", "Distorted by immortal-time bias and confounding."), false],
    [tr("真值（點治療效應）", "Truth (point-treatment effect)"), a.true_rd,
      tr(`合併了 ${a.n_trials} 場序列試驗；95% 區間 ${fmt(a.ci[0], 2)}～${fmt(a.ci[1], 2)}。`,
         `Pooled over ${a.n_trials} sequential trials; 95% interval ${fmt(a.ci[0], 2)}–${fmt(a.ci[1], 2)}.`), false],
  ];
  document.getElementById("seqAnalyzeCards").innerHTML = cards.map(([t, v, desc, hl]) =>
    `<div class="rc ${hl ? "highlight" : ""}"><h3>${t}</h3><div class="big">${v >= 0 ? "+" : ""}${fmt(v, 2)}</div><p>${desc}</p></div>`
  ).join("");
  seqPerTrialInto("seqAnalyzeChart", a);
}

// ④ assumptions
function initSeqAssume() {
  if (seqAssumeReady) return;
  seqAssumeReady = true;
  runSeqAssumptions(seqState.req || { source: "example_seq", lang: lang() });
}
async function runSeqAssumptions(req) {
  const body = req ? { ...req, lang: lang() } : { source: "example_seq", lang: lang() };
  let out;
  try { out = await postJSON(`${API}/api/seq_assumptions`, body); } catch (e) { return; }
  state.seqDash = out;
  renderSeqAssumptions(out);
}
function renderSeqAssumptions(out) {
  const hint = document.getElementById("seqAssumeHint"); if (hint) hint.classList.add("hidden");
  const ov = document.getElementById("seqOverall");
  const worst = worstStatus(out.checks);
  const head = {
    green: tr("可測項目通過；關鍵假設仍需領域判斷。", "Testable checks pass; key assumptions need domain judgement."),
    amber: tr("有項目需要留意，請展開卡片細看。", "Some items need attention — expand the cards."),
    red: tr("有項目不符，結果要保守看待。", "Some items fail — interpret with caution."),
    info: tr("多數核心假設不可檢驗，需靠領域知識與設計。", "Most core assumptions are untestable — rely on domain knowledge and design."),
  }[worst];
  ov.classList.remove("hidden"); ov.className = `overall st-${worst}`; ov.style.background = "#fff";
  ov.innerHTML = `<span class="dot bg-${worst}"></span> ${head}`;
  document.getElementById("seqAssumeCards").innerHTML = out.checks.map((c) => {
    const metrics = c.metrics.map((m) => `<li>${m.name}<b>${m.value === null ? "–" : m.value}</b><span>${m.note || ""}</span></li>`).join("");
    return `<div class="acard st-${c.status}"><h3><span class="dot bg-${c.status}"></span>${c.title}
      <span class="badge bg-${c.status}">${statusText(c.status)}</span></h3>
      <p class="headline"><b>${c.headline}</b></p><p class="plain">${c.plain}</p>
      <ul class="metrics">${metrics}</ul>
      <details class="term"><summary>${tr("看專有名詞解釋", "Show term explanation")}</summary><p>${c.term}</p></details></div>`;
  }).join("");
}

// ⑤ refinement demo
function initSeqMl() { /* concept cards static; demo button-triggered */ }
const runSeqDemoBtn = document.getElementById("runSeqDemo");
if (runSeqDemoBtn) runSeqDemoBtn.addEventListener("click", refreshSeqDemo);
async function refreshSeqDemo() {
  let s;
  try { s = await getJSON(`${API}/api/seq_demo?lang=${lang()}`); } catch (e) { return; }
  state.seqDemo = s;
  document.getElementById("seqDemoOut").classList.remove("hidden");
  drawSeqDemo(s);
  document.getElementById("seqDemoReading").innerHTML = s.reading;
}
function drawSeqDemo(s) {
  if (!document.getElementById("seqDemoChart")) return;
  const labels = [tr("未校正（曾 vs 從未）", "naive (ever vs never)"), tr("只用第 0 月那場", "month-0 trial only"), tr("合併所有序列試驗", "pooled (all trials)")];
  const vals = [s.naive, s.single, s.pooled];
  Plotly.react("seqDemoChart", [{
    x: labels, y: vals, type: "bar", marker: { color: [RED, SLATE, TEAL] },
    text: vals.map((v) => (v >= 0 ? "+" : "") + v.toFixed(2)), textposition: "outside",
  }], sceneLayout({
    height: 300, margin: { t: 28, r: 18, b: 56, l: 50 },
    yaxis: { title: tr("風險差", "risk difference"), range: [Math.min(...vals) * 1.2, 0.05] },
    shapes: [{ type: "line", x0: -0.5, x1: 2.5, y0: s.true_rd, y1: s.true_rd, line: { color: GREEN, width: 2, dash: "dash" } }],
    annotations: [{ x: 2.5, y: s.true_rd, text: tr("真值 " + s.true_rd, "truth " + s.true_rd), showarrow: false, yshift: 11, xanchor: "right", font: { color: GREEN, size: 11 } }],
  }), SCENE_CFG);
}

// ======================================================================
// Language switch — re-render any dynamic content already on screen
// ======================================================================
window.addEventListener("iv-lang", async () => {
  filterRefs(refsContext);                         // re-scope refs + citation in new language
  initHome();                                      // rebuild the home grid in the new language
  initGlossary();                                  // rebuild the glossary in the new language
  if (curSub === "learn") renderQuiz(curMethod);   // rebuild the quiz in the new language
  { const ec = document.getElementById("evalueCard"); if (ec) { _evRecompute(ec); drawEvalueChart(ec); } } // E-value ② re-render
  if (evalueArrayReady) refreshEvalueArray();           // QBA ④ array-approach re-render
  if (mcdaReady) refreshMcda();                         // MCDA ② ranking re-render
  if (fsqcaReady) refreshFsqca();                       // fsQCA ② sufficiency re-render
  refreshPlay();                                   // interactive tab
  if (state.lastReq) {                             // analysis + dashboard
    const req = { ...state.lastReq, lang: lang() };
    state.lastReq = req;
    try {
      const out = await postJSON(`${API}/api/analyze`, req);
      renderAnalysis(out);
      runAssumptions(req);
    } catch (e) { /* ignore */ }
  }
  if (mlReady) { drawIvScenes(); refreshSynthesis(); drawCrossfit("ivCfDiagram"); } // ML scenes + synthesis + schematic
  if (state.nlData) renderNonlinear(state.nlData); // ML nonlinear
  if (state.cmpDone) runMlCompare();               // ML compare (backend text)
  if (state.fbData) renderForbidden(state.fbData); // ML forbidden
  if (rddReady) refreshRdd();                           // RDD ② interactive (bandwidth)
  if (state.rddSurv) renderRddSurvival(state.rddSurv);  // re-render cached survival (no recompute → no freeze)
  if (rddAnalyzeReady) {                                // RDD ③ data analysis (+ survival teaching diagrams)
    drawSceneSurvIntro(); drawAFT("aftDiagram"); drawIPCW("ipcwDiagram");
    const keepSurv = state.rddAnalyzeSurv;             // runRddAnalyze resets this
    await runRddAnalyze();                              // analyze+assumptions are light (~70 ms)
    if (keepSurv) {                                     // re-show a previously computed survival result
      state.rddAnalyzeSurv = keepSurv;
      renderRddAnalyzeSurv(keepSurv);
      const b = document.getElementById("runRddAnalyzeSurv");
      if (b) b.textContent = tr("重新計算設限校正", "Re-run censoring correction");
    }
  }
  if (rddAssumeReady) runRddAssumptions(rddState.req);  // RDD ④ assumptions (backend text)
  if (rddMlReady) { drawRddScenes(); refreshRddDml(); drawCrossfit("rddCfDiagram"); drawDoublyRobust("rddDrDiagram"); } // RDD ⑤ scenes + DML + schematics
  if (state.rddSurvMl) {                                // RDD ⑤ survival (backend text)
    try {
      const d = await getJSON(`${API}/api/rdd_ml_survival?lang=${lang()}`);
      state.rddSurvMl = d; renderRddSurvMl(d);
    } catch (e) { /* ignore */ }
  }
  if (didLearnReady) drawSceneDidParallel();           // DiD ① learn scene
  if (didPlayReady) refreshDidPlay();                  // DiD ② interactive
  if (didAnalyzeReady) runDidAnalyze();                // DiD ③ analysis + dashboard
  else if (didAssumeReady) runDidAssumptions(didState.req);
  if (didMlReady) { drawDoublyRobust("didDrDiagram"); drawCrossfit("didCfDiagram"); } // DiD ⑤ schematics
  if (state.didDml) renderDidDml(state.didDml);        // DiD ⑤ real DML (re-render cached)
  if (titLearnReady) drawSceneTitFan();                // TiT ① learn scene
  if (titPlayReady) refreshTitPlay();                  // TiT ② interactive
  if (titAnalyzeReady) runTitAnalyze();                // TiT ③ analysis + dashboard
  else if (titAssumeReady) runTitAssumptions(titState.req);
  if (titRealCache) {                                  // TiT ③ published cell-MLE (re-render cached, re-fetch reading)
    try { const s = await getJSON(`${API}/api/tit_realmle?lang=${lang()}`); titRealCache = s; drawTitReal(s); } catch (e) { /* ignore */ }
  }
  if (itsLearnReady) drawSceneItsExplain();            // ITS ① learn scene
  if (itsPlayReady) refreshItsPlay();                  // ITS ② interactive
  if (itsAnalyzeReady) runItsAnalyze();                // ITS ③ analysis + dashboard
  else if (itsAssumeReady) runItsAssumptions(itsState.req);
  if (itsMlReady) drawTwoStage("itsTwoStageDiagram");  // ITS ⑤ schematic
  if (state.itsMlcf) renderItsMlcf(state.itsMlcf);     // ITS ⑤ real ML counterfactual (re-render cached)
  if (perrLearnReady) drawScenePerr();                 // PERR ① learn scene
  if (perrPlayReady) refreshPerrPlay();                // PERR ② interactive
  if (perrAnalyzeReady) runPerrAnalyze();              // PERR ③ analysis + dashboard
  else if (perrAssumeReady) runPerrAssumptions(perrState.req);
  if (perrMlReady) refreshPerrMl();                    // PERR ⑤ scale sensitivity
  if (ccwLearnReady) drawSceneCcw();                   // CCW ① learn scene
  if (ccwPlayReady) refreshCcwPlay();                  // CCW ② interactive
  if (ccwAnalyzeReady) runCcwAnalyze();                // CCW ③ analysis + dashboard
  else if (ccwAssumeReady) runCcwAssumptions(ccwState.req);
  if (ccwAssumeReady) drawCcwBaseline();               // CCW ④ baseline-confounding schematic
  if (state.ccwGrace) refreshCcwGrace();               // CCW ⑤ grace sensitivity (re-render)
  if (cctcLearnReady) drawSceneCctc();                 // CCTC ① learn scene
  if (cctcPlayReady) refreshCctcPlay();                // CCTC ② interactive
  if (cctcAnalyzeReady) runCctcAnalyze();              // CCTC ③ analysis + dashboard
  else if (cctcAssumeReady) runCctcAssumptions(cctcState.req);
  if (state.cctcDemo) refreshCctcDemo();               // CCTC ⑤ demo (re-render)
  if (seqLearnReady) drawSceneSeq();                   // Sequential ① learn scene
  if (seqPlayReady) refreshSeqPlay();                  // Sequential ② interactive
  if (seqAnalyzeReady) runSeqAnalyze();                // Sequential ③ analysis + dashboard
  else if (seqAssumeReady) runSeqAssumptions(seqState.req);
  if (state.seqDemo) refreshSeqDemo();                 // Sequential ⑤ demo (re-render)
  if (ccLearnReady) drawSceneCc();                     // Case-control ① learn scene
  if (ccPlayReady) refreshCcPlay();                    // Case-control ② interactive
  if (ccAnalyzeReady) runCcAnalyze();                  // Case-control ③ analysis + dashboard
  else if (ccAssumeReady) runCcAssumptions(ccState.req);
  if (ccForestCache) drawCcForest(ccForestCache);      // Case-control ⑤ ML (re-render cache)
  if (sccsLearnReady) drawSceneSccs();                 // SCCS ① learn scene
  if (sccsPlayReady) refreshSccsPlay();                // SCCS ② interactive
  if (sccsAnalyzeReady) runSccsAnalyze();              // SCCS ③ analysis + dashboard
  else if (sccsAssumeReady) runSccsAssumptions(sccsState.req);
  if (sccsSelfCache) drawSccsSelf(sccsSelfCache);      // SCCS ⑤ ML (re-render cache)
  if (acnuLearnReady) drawSceneAcnu();                 // ACNU ① learn scene
  if (acnuPlayReady) refreshAcnuPlay();                // ACNU ② interactive
  if (acnuAnalyzeReady) runAcnuAnalyze();              // ACNU ③ analysis + dashboard
  else if (acnuAssumeReady) runAcnuAssumptions(acnuState.req);
  if (acnuPsCache) drawAcnuPs(acnuPsCache);            // ACNU ⑤ ML (re-render cache)
  if (pnuLearnReady) drawScenePnu();                   // PNU ① learn scene
  if (pnuPlayReady) refreshPnuPlay();                  // PNU ② interactive
  if (pnuAnalyzeReady) runPnuAnalyze();                // PNU ③ analysis + dashboard
  else if (pnuAssumeReady) runPnuAssumptions(pnuState.req);
  if (pnuPsCache) drawPnuPs(pnuPsCache);               // PNU ⑤ ML (re-render cache)
  if (ncLearnReady) drawSceneNc();                     // NC ① learn scene
  if (ncPlayReady) refreshNcPlay();                    // NC ② interactive
  if (ncAnalyzeReady) runNcAnalyze();                  // NC ③ analysis + dashboard
  else if (ncAssumeReady) runNcAssumptions(ncState.req);
  if (ncCalCache) drawNcCal(ncCalCache);               // NC ⑤ empirical calibration (re-render cache)
  if (medLearnReady) drawSceneMed();                   // MED ① learn scene
  if (medPlayReady) refreshMedPlay();                  // MED ② interactive
  if (medAnalyzeReady) runMedAnalyze();                // MED ③ analysis + dashboard
  else if (medAssumeReady) runMedAssumptions(medState.req);
  if (medMlCache) drawMedMl(medMlCache);               // MED ⑤ natural-effects ML (re-render cache)
  if (psLearnReady) drawScenePs();                     // PS ① learn scene
  if (psPlayReady) refreshPsPlay();                    // PS ② interactive
  if (psAnalyzeReady) runPsAnalyze();                  // PS ③ analysis + dashboard
  else if (psAssumeReady) runPsAssumptions(psState.req);
  if (psMlCache) drawPsMl(psMlCache);                  // PS ⑤ ML propensity score (re-render cache)
  if (tmleLearnReady) drawSceneTmle();                 // TMLE ① learn scene
  if (tmlePlayReady) refreshTmlePlay();                // TMLE ② interactive
  if (tmleAnalyzeReady) runTmleAnalyze();              // TMLE ③ analysis + dashboard
  else if (tmleAssumeReady) runTmleAssumptions(tmleState.req);
  if (tmleMlCache) drawTmleMl(tmleMlCache);            // TMLE ⑤ doubly-robust ML (re-render cache)
  if (gmLearnReady) drawSceneGm();                     // GM ① learn scene
  if (gmPlayReady) refreshGmPlay();                    // GM ② interactive
  if (gmAnalyzeReady) runGmAnalyze();                  // GM ③ analysis + dashboard
  else if (gmAssumeReady) runGmAssumptions();
  if (gmMlCache) drawGmMl(gmMlCache);                  // GM ⑤ ML g-formula (re-render cache)
  if (tndLearnReady) drawSceneTnd();                   // TND ① learn scene
  if (tndPlayReady) refreshTndPlay();                  // TND ② interactive
  if (tndAnalyzeReady) runTndAnalyze();                // TND ③ analysis + dashboard
  else if (tndAssumeReady) runTndAssumptions();
  if (tndMlCache) drawTndMl(tndMlCache);               // TND ⑤ causal-TND ML (re-render cache)
  if (pssaLearnReady) drawScenePssa();                 // PSSA ① learn scene
  if (pssaPlayReady) refreshPssaPlay();                // PSSA ② interactive
  if (pssaAnalyzeReady) runPssaAnalyze();              // PSSA ③ analysis + dashboard
  else if (pssaAssumeReady) runPssaAssumptions();
  if (tscanLearnReady) drawSceneTscan();               // TreeScan ① learn scene
  if (tscanPlayReady) refreshTscanPlay();              // TreeScan ② interactive
  if (tscanAnalyzeReady) runTscanAnalyze();            // TreeScan ③ analysis + dashboard
  else if (tscanAssumeReady) runTscanAssumptions();
  if (wceLearnReady) drawSceneWce();                   // WCE ① learn scene
  if (wcePlayReady) refreshWcePlay();                  // WCE ② interactive
  if (wceAnalyzeReady) runWceAnalyze();                // WCE ③ analysis + dashboard
  else if (wceAssumeReady) runWceAssumptions();
  if (transportLearnReady) drawSceneTransport();        // Transport ① learn scene
  if (transportPlayReady) refreshTransportPlay();       // Transport ② interactive
  if (transportAnalyzeReady) runTransportAnalyze();     // Transport ③ analysis
  else if (transportAssumeReady) runTransportAssumptions();
  if (extctrlLearnReady) drawSceneExtctrl();            // External control ① learn scene
  if (extctrlPlayReady) refreshExtctrlPlay();           // External control ② interactive
  if (extctrlAnalyzeReady) runExtctrlAnalyze();         // External control ③ analysis
  else if (extctrlAssumeReady) runExtctrlAssumptions();
  whatifShown.forEach((m) => drawWhatif(m));            // ⑥ What-if DAGs (re-render)
  swigShown.forEach((m) => drawSwig(m));                // ⑥ SWIGs (re-render)
  if (curSub === "analyze") renderDataPreview(curMethod); // ③ data-preview table (re-translate header/caption)
  EVALUE_METHODS.forEach((m) => { const c = document.getElementById(METHOD_PREFIX[m] + "_evalue"); if (c) _evRecompute(c); }); // ④ E-value readings
  if (missReady) refreshMiss();                          // 缺失資料 demo (re-fetch + redraw in new lang)
  if (srmaReady) refreshSrma();                          // SR/MA meta-analysis (re-fetch + redraw in new lang)
  if (nmaReady) refreshNma();                            // NMA network + indirect-comparison demo
  if (cmlReady) refreshCausalml();                       // Causal ML — T-learner CATE demo
  if (chooseReady) { drawChooseChart(); renderDtree(); } // six-method chart + decision tree
  autolinkMethods();                                   // re-apply inline method cross-links (applyStatic wiped them)
});

// initial render of interactive tab data
refreshPlay();

// Honour a deep link on first load (e.g. #m=ccw&t=assume); with no/invalid hash
// land on the Home overview. Runs last, after every module-level const and
// function above is initialised.
if (!applyHash()) showHome();
