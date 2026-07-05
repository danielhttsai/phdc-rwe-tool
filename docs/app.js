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
