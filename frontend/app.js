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
