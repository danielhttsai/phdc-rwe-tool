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
