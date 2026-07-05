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
