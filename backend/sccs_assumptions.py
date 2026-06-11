"""SCCS assumption checks C1–C5 (Farrington; Whitaker, Farrington & Musonda 2006;
Petersen, Douglas & Whitaker 2016; sccs-studies.info). Most are design assumptions and
untestable from data alone (blue info cards); the testable one is having enough events
in the risk window vs baseline.

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}.
"""
from __future__ import annotations

import numpy as np

import sccs_core
from i18n import t


def run_dashboard(df, lang="zh"):
    res = sccs_core.full_sccs(df, lang=lang)
    return {"checks": [
        _c1_event_exposure(lang),
        _c2_event_observation(res, lang),
        _c3_risk_window(lang),
        _c4_timevarying(lang),
        _c5_counts(res, lang),
    ]}


def _c1_event_exposure(lang="zh"):
    return {
        "id": "C1",
        "title": t(lang, "事件會不會改變『之後的暴露』？（SCCS 最關鍵假設）",
                   "Does the event change FUTURE exposure? (SCCS's key assumption)"),
        "status": "info",
        "headline": t(lang, "SCCS 要求『發生事件』不影響日後接種／用藥的機率；否則暴露與事件的時間關係被扭曲。",
                      "SCCS requires that having the event does not change the probability of later exposure; otherwise the exposure–event timing is distorted."),
        "plain": t(
            lang,
            "SCCS 把每個人的事件位置（危險窗 vs 基線）拿來估 IRR，前提是<b>暴露的時點不被事件本身影響</b>。"
            "若得了這個病之後就<b>不會再接種</b>（或醫師會避免再開某藥），暴露就被事件「往前推」，IRR 會偏。"
            "對這種情形，有<b>事件相依暴露</b>的修正版 SCCS（Farrington 等）。",
            "SCCS uses where each person's event falls (risk vs baseline) to estimate the IRR, assuming <b>exposure timing "
            "is not affected by the event itself</b>. If having the disease means you <b>won't be vaccinated again</b> (or a "
            "clinician avoids re-prescribing), exposure is pushed before the event and the IRR is biased. For this there is "
            "an <b>event-dependent-exposure</b> modified SCCS (Farrington et al.).",
        ),
        "term": t(lang, "事件相依暴露＝「先發病、再決定要不要暴露」的情形：例如得了這個病之後就不敢再接種、或醫師避免再開這藥，於是暴露被事件「往前推」，IRR 就被扭曲了。修正版 SCCS＝專門替這種情形設計的算法，會把「事件改變了之後暴露機率」這件事一起納入模型來校正。",
                  "Event-dependent exposure = when getting the event changes whether you get exposed afterwards — e.g. after this disease you avoid being vaccinated again, or a clinician avoids re-prescribing, so exposure gets pushed before the event and the IRR is distorted. Modified SCCS = a version built for exactly this case; it folds 'the event changed the chance of later exposure' into the model to correct for it."),
        "metrics": [],
    }


def _c2_event_observation(res, lang="zh"):
    return {
        "id": "C2",
        "title": t(lang, "事件會不會中斷觀察期？（罕見／可復發 vs 致死）",
                   "Does the event curtail the observation period? (rare/recurrent vs fatal)"),
        "status": "info",
        "headline": t(lang, "標準 SCCS 假設事件不縮短觀察期；事件罕見或可復發時成立，致死性事件需用修正版。",
                      "Standard SCCS assumes the event doesn't shorten observation; fine for rare or recurrent events, but fatal events need a modified version."),
        "plain": t(
            lang,
            "若事件會<b>結束觀察</b>（例如死亡），那「事件之後的時間」就被截掉，標準 SCCS 會偏。當事件<b>罕見</b>"
            "（截掉的時間很少）或<b>可復發</b>時，影響可忽略；致死性、非復發事件則要用<b>事件相依觀察期</b>的修正版"
            "（如 Farrington 2011）。",
            "If the event <b>ends observation</b> (e.g. death), the time after the event is truncated and standard SCCS is "
            "biased. When the event is <b>rare</b> (little time truncated) or <b>recurrent</b>, the effect is negligible; for "
            "fatal, non-recurrent events use a modified SCCS with <b>event-dependent observation periods</b> (Farrington 2011).",
        ),
        "term": t(lang, "事件相依觀察期＝事件本身會「結束」這個人的可觀察時間（最典型是死亡），導致事件之後的時間被截掉、資料不完整，需要用修正版把這個截斷一起算進去。可復發 vs 非復發事件＝同一個人能不能再發生第二次：可復發（如反覆癲癇發作）不會因為一次事件就終止觀察、影響很小；非復發又致死的事件最麻煩，標準 SCCS 會偏。",
                  "Event-dependent observation period = the event itself ends the person's observable time (death being the classic case), so the time after the event gets cut off and the data is incomplete — a modified version is needed to account for that truncation. Recurrent vs non-recurrent event = whether the same person can have it again: recurrent ones (like repeated seizures) don't end observation after one event and barely matter, while a fatal non-recurrent event is the troublesome case that biases standard SCCS."),
        "metrics": [],
    }


def _c3_risk_window(lang="zh"):
    return {
        "id": "C3",
        "title": t(lang, "危險窗選得對嗎？（暴露要短暫、窗長正確）",
                   "Is the risk window right? (transient exposure, correct window length)"),
        "status": "info",
        "headline": t(lang, "暴露要是『短暫』的，且危險窗要涵蓋真正升高風險的那段；窗選錯會稀釋或扭曲 IRR。",
                      "Exposure must be transient and the risk window must cover the truly elevated period; a wrong window dilutes or distorts the IRR."),
        "plain": t(
            lang,
            "SCCS 適合<b>短暫</b>的暴露（如一劑疫苗、一個療程）。<b>危險窗</b>的長度與位置是關鍵設計選擇：太短會"
            "漏掉部分升高風險、太長會把基線時間混進去而<b>稀釋</b> IRR。最好對不同窗長做敏感度分析，也可把窗再"
            "切成數段看風險隨時間的形狀。",
            "SCCS suits a <b>transient</b> exposure (a vaccine dose, a course of a drug). The <b>risk window</b>'s length and "
            "position are key design choices: too short misses part of the elevated risk, too long mixes in baseline time and "
            "<b>dilutes</b> the IRR. Run a sensitivity analysis over window lengths, and consider splitting the window to see "
            "the shape of risk over time.",
        ),
        "term": t(lang, "危險窗＝暴露之後「風險真的升高」的那一段時間（例如打完疫苗後的 1～14 天），SCCS 就是比較事件落在這段、還是落在其他平常時間。暴露相關區間＝跟暴露有關、要特別標出來的時段，可能還包含暴露當下或前後的緩衝期。窗長敏感度＝把危險窗設長一點、短一點各算一次，看結論會不會跟著大變；若很敏感，代表答案很看你怎麼框這個窗，要保守看待。",
                  "Risk window = the stretch of time right after exposure when risk is genuinely elevated (say days 1–14 after a vaccine); SCCS compares whether events land in this stretch versus ordinary time. Exposure-related interval = the period flagged as tied to the exposure, which may also include the moment of exposure or a buffer around it. Window-length sensitivity = re-running with a longer and a shorter window to see if the conclusion swings; if it's very sensitive, the answer depends heavily on how you draw the window and should be read cautiously."),
        "metrics": [],
    }


def _c4_timevarying(lang="zh"):
    return {
        "id": "C4",
        "title": t(lang, "隨時間變的因子（年齡、季節）處理了嗎？",
                   "Are time-varying factors (age, season) handled?"),
        "status": "info",
        "headline": t(lang, "時間不變的因子自動相消；但隨時間變的（年齡、季節、流行）要用切分區間調整。",
                      "Time-fixed factors cancel automatically; time-varying ones (age, season, epidemics) must be adjusted by splitting time into intervals."),
        "plain": t(
            lang,
            "SCCS 自動消掉<b>不隨時間變</b>的混淆（這是它的賣點）。但<b>會隨時間變</b>的因子——年齡（基線風險隨年齡升）、"
            "季節、流行高峰——若同時和暴露時點相關，就會偏。做法是把每個人的觀察期再<b>切成年齡層／季節段</b>，"
            "在條件 Poisson 裡一起估，把它們的時間效果分離出來。",
            "SCCS automatically removes <b>time-fixed</b> confounding (its selling point). But <b>time-varying</b> factors — "
            "age (baseline risk rises with age), season, epidemic peaks — bias the estimate if they also track exposure "
            "timing. The fix is to further <b>split each person's time into age/season bands</b> and estimate them jointly in "
            "the conditional Poisson, separating out their time effects.",
        ),
        "term": t(lang, "時變共變項＝會「隨時間改變」的背景因子，例如年齡、季節、流行高峰——它在觀察期內不是固定值，若又剛好和暴露時點同步，就會混進去害 IRR 偏掉。年齡分層＝把每個人的觀察期再切成幾個年齡段（如 0～1 歲、1～2 歲），讓模型分開估各段的基線風險，把年齡的影響扣掉。半參數 SCCS（樣條年齡效果）＝不硬性假設年齡風險是某條固定曲線，而是讓資料自己彎出一條平滑曲線（樣條）來描述風險隨年齡的形狀，更貼近真實。",
                  "Time-varying covariate = a background factor that changes over time — age, season, an epidemic peak — that isn't constant during follow-up, and if it happens to move in step with exposure timing it leaks in and biases the IRR. Age stratification = splitting each person's follow-up into age bands (say 0–1 yr, 1–2 yr) so the model estimates baseline risk separately in each and subtracts out the age effect. Semiparametric SCCS (spline age effects) = instead of forcing the age-risk curve to a fixed shape, it lets the data bend a smooth curve (a spline) to describe how risk varies with age, fitting reality more closely."),
        "metrics": [],
    }


def _c5_counts(res, lang="zh"):
    nr, nb = res["n_risk"], res["n_base"]
    metrics = [
        {"name": t(lang, "事件落在危險窗 / 基線", "events in risk window / baseline"), "value": f"{nr} / {nb}",
         "note": t(lang, "危險窗事件太少→IRR 不穩、區間爆寬", "too few risk-window events → unstable IRR, wide interval")},
        {"name": t(lang, "總 case 數", "total cases"), "value": res["n_cases"], "note": ""},
    ]
    if nr >= 50:
        status, head = "green", t(lang, "危險窗事件充足，IRR 估得穩。", "Plenty of risk-window events — the IRR is stable.")
    elif nr >= 15:
        status, head = "amber", t(lang, "危險窗事件偏少，IRR 較不穩、區間偏寬。",
                                  "Few risk-window events — the IRR is unstable and the interval is wide.")
    else:
        status, head = "red", t(lang, "危險窗事件太少，IRR 極不穩、不可靠。",
                                "Too few risk-window events — the IRR is very unstable and unreliable.")
    return {
        "id": "C5",
        "title": t(lang, "危險窗裡的事件夠多嗎？（可檢驗）", "Enough events in the risk window? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "SCCS 的全部資訊來自『事件落在危險窗 vs 基線』的<b>對比</b>。若<b>落在危險窗的事件很少</b>（事件罕見、"
            "危險窗很短、或真的沒效應），IRR 就估得很不穩、信賴區間爆寬。延長收案、累積更多 case 可改善。",
            "All of SCCS's information comes from the <b>contrast</b> of events in the risk window vs baseline. If <b>few events "
            "fall in the risk window</b> (rare event, short window, or truly no effect), the IRR is unstable and the interval "
            "blows up. Accruing more cases helps.",
        ),
        "term": t(lang, "條件式資訊量＝這個分析「實際上有多少有效情報」可拿來估 IRR；SCCS 只靠每個人事件落在危險窗或基線的對比，所以真正的情報量取決於有多少事件落進危險窗，而非總人數有多大。危險窗事件數＝實際落在危險窗裡的事件件數，這個數字太小（事件罕見、窗很短、或真的沒效應），IRR 就會極不穩、信賴區間爆寬。",
                  "Conditional information = how much usable evidence the analysis actually has to estimate the IRR; SCCS relies only on the contrast of each person's event falling in the risk window versus baseline, so the real information depends on how many events land in the risk window, not on the total headcount. Risk-window event count = the actual number of events that fall inside the risk window; when this is too small (rare event, short window, or truly no effect), the IRR becomes very unstable and the confidence interval blows up."),
        "metrics": metrics,
    }
