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
