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
