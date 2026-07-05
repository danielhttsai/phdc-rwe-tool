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
