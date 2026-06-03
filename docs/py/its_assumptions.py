"""ITS assumption checks I1-I5 — the interrupted-time-series analogue of the
other dashboards, following Bernal, Cummins & Gasparrini (2017).

白話文優先：每一項先用日常語言說明在檢查什麼、結果代表什麼，專有名詞放到 `term`。
ITS 最關鍵的假設（I1：介入前趨勢能正確外推＝沒有同時發生的別的事件）無法用資料證明，
誠實標示；其餘可測（函數型態、前後期數、自相關、介入時點）一併提供。

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}; the front-end computes the worst status.
"""
from __future__ import annotations

import numpy as np

import its_core
from i18n import t


def run_dashboard(df, outcome="outcome", time="time", post="post", t_since="t_since", lang="zh"):
    fit = its_core.segmented(df, outcome, time, post, t_since)
    n_pre = int((np.asarray(df[post]) == 0).sum())
    n_post = int((np.asarray(df[post]) == 1).sum())
    checks = [
        _i1_coincident(lang),
        _i2_functional_form(df, outcome, time, post, lang),
        _i3_points(n_pre, n_post, lang),
        _i4_autocorr(fit, lang),
        _i5_sharp(lang),
    ]
    return {"checks": checks}


def _i1_coincident(lang="zh"):
    return {
        "id": "I1",
        "title": t(lang, "介入的同時，有沒有別的事情也發生？（關鍵、不可檢驗）",
                   "Did anything else happen at the same time as the intervention? (key, untestable)"),
        "status": "info",
        "headline": t(lang, "這是 ITS 最關鍵的前提，無法用資料證明，要靠領域知識。",
                      "This is ITS's key premise; it cannot be proven from data and rests on domain knowledge."),
        "plain": t(
            lang,
            "ITS 把『介入前趨勢往後延伸』當成『沒有介入會怎樣』的反事實。只要在介入的同一個時點，"
            "還有別的事情也發生了（另一個政策、季節變化、通報方式改變、疫情……），那個跳變或轉折"
            "就不一定是這個介入造成的。資料本身看不出來——要靠你對情境的了解，或改用「控制組 ITS」"
            "（⑤ 的進階）把同時代的共同變化差分掉。",
            "ITS treats the extrapolated pre-intervention trend as the counterfactual ('what would have happened "
            "without the intervention'). If anything ELSE happened at the same time point (another policy, a seasonal "
            "shift, a change in reporting, an epidemic…), the jump or turn need not be due to THIS intervention. The "
            "data cannot reveal this — it rests on your knowledge of the context, or on a controlled ITS (an ⑤ upgrade) "
            "that differences out shared, contemporaneous change.",
        ),
        "term": t(lang, "專有名詞：共時混淆／同時介入（co-intervention, history threat）。",
                  "Term: co-intervention / history threat."),
        "metrics": [],
    }


def _i2_functional_form(df, outcome, time, post, lang="zh"):
    # check for curvature in the PRE period: regress pre residuals' shape via a quadratic
    tt = np.asarray(df[time], dtype=float)
    y = np.asarray(df[outcome], dtype=float)
    pre = np.asarray(df[post]) == 0
    xt, yt = tt[pre], y[pre]
    curv = None
    if xt.size >= 6:
        X = np.column_stack([np.ones_like(xt), xt, xt ** 2])
        beta = np.linalg.pinv(X.T @ X) @ (X.T @ yt)
        resid = yt - X @ beta
        s2 = (resid @ resid) / max(xt.size - 3, 1)
        cov = s2 * np.linalg.pinv(X.T @ X)
        se2 = float(np.sqrt(cov[2, 2]))
        curv = abs(float(beta[2]) / se2) if se2 > 0 else 0.0
    metrics = [
        {"name": t(lang, "前期趨勢的曲度檢定 |z|", "Curvature test on the pre-trend |z|"),
         "value": round(curv, 2) if curv is not None else None,
         "note": t(lang, "接近 0 代表前期趨勢確實近似直線", "near 0 means the pre-trend is approximately linear")},
    ]
    if curv is None:
        status, head = "info", t(lang, "前期點數太少，無法檢查函數型態。",
                                 "Too few pre-period points to check the functional form.")
    elif curv < 1.96:
        status = "green"
        head = t(lang, "前期趨勢近似直線，用線性分段迴歸是合理的。",
                 "The pre-trend is approximately linear — a linear segmented regression is reasonable.")
    elif curv < 3.0:
        status = "amber"
        head = t(lang, "前期趨勢有點彎，線性外推可能略偏，考慮加曲線項或季節項。",
                 "The pre-trend curves somewhat; linear extrapolation may be slightly off — consider curvature or seasonal terms.")
    else:
        status = "red"
        head = t(lang, "前期趨勢明顯非線性，直線外推的反事實不可靠，改用彈性模型（見 ⑤）。",
                 "The pre-trend is clearly non-linear — a straight-line counterfactual is unreliable; use a flexible model (see ⑤).")
    return {
        "id": "I2",
        "title": t(lang, "介入前的趨勢是直線嗎？（函數型態）", "Is the pre-intervention trend a straight line? (functional form)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "標準 ITS 用『直線』描述介入前趨勢，再直線外推當反事實。如果前期其實是曲線、或有季節循環，"
            "直線外推就會把反事實畫錯，效果估計跟著偏。我們檢查前期是否有明顯曲度；若有，可加曲線/季節項，"
            "或用 ⑤ 的彈性反事實。",
            "Standard ITS describes the pre-intervention trend with a straight line and extrapolates it as the "
            "counterfactual. If the pre-period is actually curved or seasonal, that straight-line extrapolation draws "
            "the counterfactual wrong and biases the effect. We check for clear curvature in the pre-period; if present, "
            "add curvature/seasonal terms or use the flexible counterfactual in ⑤.",
        ),
        "term": t(lang, "專有名詞：函數型態設定（functional-form specification）、季節性。",
                  "Term: functional-form specification; seasonality."),
        "metrics": metrics,
    }


def _i3_points(n_pre, n_post, lang="zh"):
    metrics = [
        {"name": t(lang, "介入前期數 / 介入後期數", "Pre-intervention points / post-intervention points"),
         "value": f"{n_pre} / {n_post}",
         "note": t(lang, "前後各建議 ≥ 8 點（越多越穩）", "ideally ≥ 8 points each (more is better)")},
    ]
    if n_pre >= 8 and n_post >= 8:
        status = "green"
        head = t(lang, "前後期觀測點都足夠，趨勢與效果都能穩定估計。",
                 "Plenty of points before and after — the trend and effect can be estimated stably.")
    elif n_pre >= 4 and n_post >= 4:
        status = "amber"
        head = t(lang, "觀測點偏少，估計會比較不穩、檢定力低。",
                 "Few points — the estimate is less stable with lower power.")
    else:
        status = "red"
        head = t(lang, "觀測點太少，分段迴歸不可靠。",
                 "Too few points — the segmented regression is unreliable.")
    return {
        "id": "I3",
        "title": t(lang, "介入前後的觀測點夠多嗎？", "Are there enough points before and after?"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "要可靠地配出『介入前趨勢』並偵測『水準/斜率改變』，介入前後都需要足夠多的時間點。"
            "前期太短，趨勢估不準、外推的反事實就不可靠；後期太短，效果（尤其斜率變化）測不出來。",
            "To reliably fit the pre-intervention trend and detect a level/slope change, you need enough time points "
            "both before and after. Too few pre-points and the trend (hence the extrapolated counterfactual) is "
            "unreliable; too few post-points and the effect (especially the slope change) cannot be detected.",
        ),
        "term": t(lang, "專有名詞：序列長度／檢定力（series length, power）。",
                  "Term: series length / statistical power."),
        "metrics": metrics,
    }


def _i4_autocorr(fit, lang="zh"):
    acf1 = fit["acf1"]; dw = fit["dw"]
    metrics = [
        {"name": t(lang, "殘差 lag-1 自相關", "Residual lag-1 autocorrelation"),
         "value": round(acf1, 3),
         "note": t(lang, "接近 0 較好；已用 HAC 標準誤校正", "near 0 is best; corrected with HAC SE")},
        {"name": t(lang, "Durbin–Watson 統計量", "Durbin–Watson statistic"),
         "value": round(dw, 2),
         "note": t(lang, "接近 2 代表無一階自相關", "near 2 means no first-order autocorrelation")},
    ]
    if abs(acf1) < 0.2:
        status = "green"
        head = t(lang, "殘差幾乎沒有自相關，標準誤可信。",
                 "Residuals show little autocorrelation — the standard errors are trustworthy.")
    elif abs(acf1) < 0.4:
        status = "amber"
        head = t(lang, "殘差有中度自相關；已用 Newey–West 校正，仍建議檢視 ARIMA。",
                 "Moderate residual autocorrelation; corrected with Newey–West, but consider ARIMA too.")
    else:
        status = "red"
        head = t(lang, "殘差自相關很強，天真標準誤會嚴重低估；務必用 HAC/ARIMA（見 ⑤）。",
                 "Strong residual autocorrelation — naive SEs badly understate uncertainty; use HAC/ARIMA (see ⑤).")
    return {
        "id": "I4",
        "title": t(lang, "殘差有沒有自相關？（標準誤是否可信）", "Is there residual autocorrelation? (are the SEs trustworthy)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "時間序列相鄰的點通常彼此相關（這個月高、下個月也容易高）。如果忽略這種自相關，"
            "天真的迴歸標準誤會過窄、信賴區間太樂觀、p 值太漂亮。我們用 Durbin–Watson 與 lag-1 自相關"
            "檢查殘差，並用 Newey–West（HAC）標準誤校正；自相關很強時可進一步用 ARIMA。",
            "Adjacent points in a time series are usually correlated (a high month tends to be followed by another high "
            "month). Ignore this autocorrelation and the naive regression SEs are too narrow, the CIs too optimistic, the "
            "p-values too good. We check residuals with Durbin–Watson and the lag-1 autocorrelation, and correct with "
            "Newey–West (HAC) SEs; with strong autocorrelation, ARIMA is a further option.",
        ),
        "term": t(lang, "專有名詞：自相關（autocorrelation）、Newey–West/HAC 標準誤、Durbin–Watson。",
                  "Term: autocorrelation; Newey–West/HAC standard errors; Durbin–Watson."),
        "metrics": metrics,
    }


def _i5_sharp(lang="zh"):
    return {
        "id": "I5",
        "title": t(lang, "介入時點明確又尖銳嗎？", "Is the intervention time sharp and known?"),
        "status": "info",
        "headline": t(lang, "ITS 假設介入在已知的單一時點瞬間生效；逐步推行需另外處理。",
                      "ITS assumes the intervention takes effect sharply at a single known time; gradual roll-out needs care."),
        "plain": t(
            lang,
            "ITS 假設介入在某個確定的時點『瞬間』開始作用。如果實際上是慢慢推行（roll-out）、或生效有延遲，"
            "把它當成單一尖銳跳變就不準。做法：把過渡期排除、或把效果模型改成『延遲後才開始的斜率變化』，"
            "並對介入時點前後挪一兩期做敏感度分析。",
            "ITS assumes the intervention starts acting instantly at a definite time. If it was actually phased in "
            "(rolled out) or had a delayed onset, treating it as a single sharp jump is inaccurate. Remedies: exclude a "
            "transition period, model the effect as a slope change that starts after a lag, and run a sensitivity "
            "analysis shifting the intervention time by a period or two.",
        ),
        "term": t(lang, "專有名詞：介入時點的明確性（sharp, known intervention time）、過渡期。",
                  "Term: sharp/known intervention time; transition period."),
        "metrics": [],
    }
