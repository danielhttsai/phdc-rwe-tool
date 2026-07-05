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
