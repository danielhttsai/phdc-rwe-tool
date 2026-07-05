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
