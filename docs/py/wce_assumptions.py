"""WCE assumption checks C1–C5. WCE flexibly estimates the time-since-exposure weight
function; its validity rests on a well-measured exposure history, a wide-enough weight
window, a correct hazard form, no time-varying confounding by indication, and enough
events/exposure variation to pin down the weight curve. term: fields are written in plain
language (explain each named term), per the site's terminology style.

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}.
"""
from __future__ import annotations

import numpy as np

import wce_core
from i18n import t


def run_dashboard(df, lang="zh"):
    r = wce_core.full_wce(df, lang=lang)
    checks = [
        _c1_history(lang),
        _c2_window(r, lang),
        _c3_form(lang),
        _c4_tvc(lang),
        _c5_events(r, lang),
    ]
    return {"checks": checks}


def _c1_history(lang="zh"):
    return {
        "id": "C1",
        "title": t(lang, "暴露史量得準：每段時間用了多少藥都記得對（不可純檢驗）",
                   "The exposure history is measured accurately — every period's dose is recorded right (untestable)"),
        "status": "info",
        "headline": t(lang, "WCE 把「過去每個月用了多少」逐月加權，所以這份逐月用藥史必須完整、無錯。",
                      "WCE weights 'how much you took each past month', so the monthly exposure history must be complete and correct."),
        "plain": t(
            lang,
            "WCE 的整個計算，是把<b>過去每個月的劑量</b>各自乘上一個權重再加起來。若用藥史有缺漏、把時間記錯、"
            "或把劑量量錯，加權的對象就錯了，估出的權重曲線與效果都會被帶偏。所以要有<b>逐時間、準確的暴露紀錄</b>"
            "（理賠的領藥日與天數、或可信的自述），且涵蓋足夠長的過去。",
            "WCE works by multiplying <b>each past month's dose</b> by a weight and summing. If the history has gaps, the "
            "timing is wrong, or the dose is mismeasured, the weighting is applied to the wrong thing and both the weight "
            "curve and the effect are biased. So you need a <b>time-resolved, accurate exposure record</b> (dispensing "
            "dates and days-supply, or reliable self-report) reaching far enough into the past.",
        ),
        "term": t(lang, "時變暴露＝會隨時間開開關關、增增減減的暴露（例如某個月有用藥、某個月沒用），不是一個「有用過／沒用過」的固定標籤。暴露測量誤差＝把「何時用、用多少」記錯；WCE 對這個特別敏感，因為它逐月加權，記錯時間等於把權重套到錯的月份上。",
                  "Time-varying exposure = exposure that switches on/off and goes up/down over time (on the drug some months, off others), not a fixed 'ever/never' label. Exposure measurement error = getting 'when and how much' wrong; WCE is especially sensitive to it because it weights month by month, so wrong timing puts the weight on the wrong month."),
        "metrics": [],
    }


def _c2_window(r, lang="zh"):
    w = np.asarray(r["w_hat"]); L = len(w)
    tail = float(abs(w[-1]) / (abs(w).max() + 1e-9))
    if tail < 0.10:
        status, head = "green", t(lang, "權重曲線在窗的尾端已衰減到接近 0——時間窗夠長，捕捉到完整的效應期。",
                                  "The weight curve has decayed to near 0 by the end of the window — long enough to capture the full effect period.")
    elif tail < 0.25:
        status, head = "amber", t(lang, "權重在窗尾還沒完全歸零——時間窗可能略短，考慮加長。",
                                  "The weight is not quite back to 0 at the window's end — the window may be a touch short; consider lengthening it.")
    else:
        status, head = "red", t(lang, "權重在窗尾仍很大——時間窗太短，會截掉仍有作用的較早暴露。",
                                "The weight is still large at the window's end — the window is too short and cuts off earlier exposure that still matters.")
    return {
        "id": "C2",
        "title": t(lang, "時間窗夠長嗎？（權重應在窗尾衰減到 0；部分可檢驗）",
                   "Is the window long enough? (the weight should decay to 0 by its end; partly testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "你必須先決定「一劑藥的影響最久延續幾個月」＝<b>時間窗 L</b>。窗太短，會把仍有作用的較早暴露硬切掉、低估；"
            "窗太長則多估了一段沒用的尾巴、徒增雜訊。一個好用的自我檢查：估出來的權重曲線應在窗的尾端<b>自然衰減到接近 0</b>；"
            "若還沒歸零，代表窗開得不夠長。",
            "You must first choose how many months a single dose can keep mattering — the <b>window L</b>. Too short cuts off "
            "earlier exposure that still acts (under-estimation); too long adds a useless tail of noise. A handy self-check: "
            "the estimated weight curve should <b>decay to near 0 by the end of the window</b>; if it hasn't, the window is "
            "too short.",
        ),
        "term": t(lang, "時間窗（暴露窗 L）＝你假設「一劑藥最多還能影響你幾個月」的長度；超過這段時間以前的劑量就不再計入。權重曲線＝一張圖，畫出「τ 個月前的劑量，對現在的風險貢獻多少」；它在窗尾自然趨近 0，代表很久以前的藥已經不重要了。",
                  "Window (exposure window L) = the length of time you assume a single dose can still affect you; doses older than this are no longer counted. Weight curve = a plot of 'how much a dose τ months ago contributes to today's risk'; it tapering to 0 at the window's end means long-ago doses no longer matter."),
        "metrics": [
            {"name": t(lang, "窗尾權重／最大權重", "end-of-window weight / peak weight"), "value": f"{tail:.2f}",
             "note": t(lang, "越接近 0 越好", "closer to 0 is better")},
        ],
    }


def _c3_form(lang="zh"):
    return {
        "id": "C3",
        "title": t(lang, "風險模型的形式正確：效果在加權暴露上是對數線性、比例風險（不可純檢驗）",
                   "The hazard model form is correct: log-linear in weighted exposure, proportional hazards (untestable)"),
        "status": "info",
        "headline": t(lang, "WCE 假設「風險隨加權暴露呈對數線性上升、且比例風險成立」——這是模型設定，要靠判斷。",
                      "WCE assumes the hazard rises log-linearly with the weighted exposure under proportional hazards — a modelling choice, needs judgement."),
        "plain": t(
            lang,
            "WCE 把效果寫成 <code>風險 ∝ exp(β · 加權暴露)</code>：加權暴露每多一單位，風險就乘上一個固定倍數（對數線性、"
            "比例風險）。若真實關係不是這樣（例如有飽和、有閾值、或倍數隨時間變），估計會偏。權重<b>形狀</b>本身已被"
            "彈性基底放鬆，但「對數線性＋比例風險」這層仍是設定。可用加交互項、彈性基線、或殘差診斷來檢查。",
            "WCE writes the effect as <code>hazard ∝ exp(β · weighted exposure)</code>: each extra unit of weighted exposure "
            "multiplies the hazard by a fixed factor (log-linear, proportional hazards). If the truth isn't like that "
            "(saturation, a threshold, or a factor that drifts over time), the estimate is biased. The weight <b>shape</b> is "
            "already relaxed by the flexible basis, but the 'log-linear + proportional hazards' layer remains an assumption — "
            "check it with interactions, a flexible baseline, or residual diagnostics.",
        ),
        "term": t(lang, "比例風險＝不同暴露程度的人，風險高低的「倍數關係」不隨時間改變（兩條風險曲線是平行縮放的）。對數線性＝把暴露對風險的作用設成「每多一單位就乘上固定倍數」，所以在 log 尺度上是直線。彈性基底（樣條／徑向基）＝用幾個平滑的小函數疊出權重曲線，讓它的形狀由資料決定，而不是事先假設一條固定曲線。",
                  "Proportional hazards = the 'how-many-times-higher' risk ratio between people with different exposure does not change over time (the hazard curves are parallel rescalings). Log-linear = setting exposure's effect so each extra unit multiplies the hazard by a fixed factor, i.e. a straight line on the log scale. Flexible basis (spline / radial) = building the weight curve out of a few smooth little functions so its shape is decided by the data, not fixed in advance."),
        "metrics": [],
    }


def _c4_tvc(lang="zh"):
    return {
        "id": "C4",
        "title": t(lang, "沒有時變的適應症混淆：用藥的增減不是被「快出事」本身驅動（關鍵、不可純檢驗）",
                   "No time-varying confounding by indication: dose changes aren't driven by impending events (key, untestable)"),
        "status": "info",
        "headline": t(lang, "若病情惡化同時讓人<b>改變用藥</b>又<b>拉高風險</b>，加權暴露與結果的關聯會被這個時變混淆汙染。",
                      "If worsening disease both <b>changes the dose</b> and <b>raises risk</b>, the exposure–outcome link is confounded by this time-varying factor."),
        "plain": t(
            lang,
            "最棘手的偏誤：病人之所以這個月加藥／停藥，往往跟他當下的<b>病情</b>有關，而病情又直接影響結果。這時"
            "「最近用藥多」可能只是「最近病重」的影子，WCE 會把病情的效果誤算到藥上。這是<b>時變的適應症混淆</b>，"
            "和 CCW／g-methods 處理的是同一類問題。緩解：校正<b>時變</b>的疾病嚴重度指標，或在能界定「策略」時改用"
            "g-formula／IPTW（見 g-methods、CCW）。",
            "The nastiest bias: people raise or stop the drug this month largely because of their current <b>disease state</b>, "
            "which itself drives the outcome. Then 'lots of recent use' can be a shadow of 'recently sicker', and WCE "
            "mis-attributes the illness effect to the drug. This is <b>time-varying confounding by indication</b> — the same "
            "problem CCW / g-methods tackle. Remedies: adjust for <b>time-varying</b> severity, or, when a strategy is "
            "well-defined, switch to a g-formula / IPTW analysis (see g-methods, CCW).",
        ),
        "term": t(lang, "時變適應症混淆＝促使你「何時加藥、何時停藥」的原因（通常是當下病情），本身又會影響結果；於是用藥多寡和結果的關聯，一部分其實是病情造成的。時變共變項＝會隨時間變動的背景因素（如逐月的疾病嚴重度）；要校正它得用會「隨時間更新」的方法，不能只用一個基線值。",
                  "Time-varying confounding by indication = the reason you start/stop the drug (usually your current disease state) itself affects the outcome, so part of the dose–outcome link is really the disease. Time-varying covariate = a background factor that changes over time (e.g. month-by-month severity); adjusting for it needs a method that updates over time, not a single baseline value."),
        "metrics": [],
    }


def _c5_events(r, lang="zh"):
    ne = int(r["n_events"])
    if ne >= 200:
        status, head = "green", t(lang, "事件數充足，足以穩定估出整條權重曲線。",
                                  "Plenty of events — enough to estimate the whole weight curve stably.")
    elif ne >= 80:
        status, head = "amber", t(lang, "事件數中等——權重曲線的尾端與細節會比較不穩。",
                                  "Moderate events — the tail and fine detail of the weight curve will be less stable.")
    else:
        status, head = "red", t(lang, "事件太少——估整條權重曲線會很不穩，考慮減少基底數或簡化。",
                                "Too few events — estimating the whole curve is unstable; use fewer basis functions or simplify.")
    return {
        "id": "C5",
        "title": t(lang, "事件數與暴露變異夠多嗎？（可檢驗）",
                   "Enough events and exposure variation? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "WCE 不是只估一個數字，而是估<b>一整條權重曲線</b>（很多時間點的權重），所以比一般分析更吃資料。"
            "事件太少、或大家的用藥型態太像（暴露變異不足），曲線就會抖、尾端尤其不可靠。對策：用較少的基底函數、"
            "縮短時間窗、或限制只估曲線形狀的關鍵特徵。",
            "WCE estimates not a single number but a <b>whole weight curve</b> (weights at many lags), so it is hungrier for "
            "data than ordinary analyses. With few events, or if everyone's use pattern looks alike (too little exposure "
            "variation), the curve gets jumpy and its tail is unreliable. Remedies: fewer basis functions, a shorter window, "
            "or estimating only key features of the shape.",
        ),
        "term": t(lang, "事件數＝研究期間真正發生結果的人數；WCE 要用它撐起一整條曲線，所以需要的事件比估單一數字多。暴露變異＝大家的用藥型態夠不夠多樣（有人早用、有人晚用、有人斷斷續續）；變異夠，資料才分得出「不同時間的劑量各自有多重要」。",
                  "Event count = how many people actually had the outcome during the study; WCE uses it to support a whole curve, so it needs more events than estimating a single number. Exposure variation = how varied people's use patterns are (some used early, some late, some intermittently); enough variation is what lets the data tell apart 'how much each timing of a dose matters'."),
        "metrics": [
            {"name": t(lang, "事件數", "events"), "value": ne, "note": ""},
        ],
    }
