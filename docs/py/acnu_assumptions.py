"""ACNU assumption checks C1–C5. The identifying assumptions are mostly about study
DESIGN (active comparator + new users) and are untestable from data alone (blue info
cards); the testable ones are the residual severity imbalance between A and B and whether
there are enough events.

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}.
"""
from __future__ import annotations

import numpy as np

import acnu_core
from i18n import t


def run_dashboard(df, drug="drug", event="event", futime="futime", lang="zh"):
    res = acnu_core.full_acnu(df, drug=drug, event=event, futime=futime, lang=lang)
    checks = [
        _c1_comparator(lang),
        _c2_newuser(lang),
        _c3_comparator_effect(lang),
        _c4_residual(res, lang),
        _c5_events(res, lang),
    ]
    return {"checks": checks}


def _c1_comparator(lang="zh"):
    return {
        "id": "C1",
        "title": t(lang, "對照藥和 A 治療『同一個適應症』嗎？（可交換性的來源，關鍵、不可檢驗）",
                   "Does the comparator treat the SAME indication as A? (the source of exchangeability — key, untestable)"),
        "status": "info",
        "headline": t(lang, "ACNU 靠『主動對照藥同適應症』讓兩組病人在病情上可比；選錯對照藥，混淆就回來了。",
                      "ACNU relies on the active comparator sharing the indication so the two groups are comparable in disease; pick the wrong comparator and confounding returns."),
        "plain": t(
            lang,
            "ACNU 之所以能削掉<b>因適應症而生的混淆</b>，關鍵在於對照藥 B 和研究藥 A <b>治療同一個適應症</b>、"
            "面對的是<b>病情相似</b>的病人。這樣『誰拿 A、誰拿 B』比較像在同一群病人裡的選擇，而不是『有病 vs 沒病』。"
            "如果 B 其實用在較輕（或較重）的病人，兩組基線風險就不同，ACNU 的好處會打折。這要靠<b>臨床知識</b>挑對照藥，"
            "資料本身證明不了。",
            "ACNU removes <b>confounding by indication</b> precisely because the comparator drug B treats the <b>same "
            "indication</b> as the study drug A and is given to <b>clinically similar</b> patients. Then 'who gets A vs B' is "
            "more like a choice within one patient population than 'diseased vs not'. If B is actually used in milder (or more "
            "severe) patients, the two groups differ in baseline risk and ACNU's benefit shrinks. Choosing the right comparator "
            "is a matter of <b>clinical knowledge</b>; the data cannot prove it.",
        ),
        "term": t(lang, "主動對照（active comparator）＝拿另一種「真的在治同一個病」的藥當對照組，而不是拿沒吃藥的人；這樣兩邊都是有病、需要治療的人，才比得起來。因適應症而生的混淆（confounding by indication）＝會讓人覺得「藥有效或有害」的假象，其實是因為「病情本來就不一樣的人」才會去吃這個藥——病重的人吃藥也出事多，看起來像藥害，其實是病害。可交換性＝兩組病人「除了吃哪種藥不同、其他都差不多」，這樣對調過來結果也會一樣，比較才公平；ACNU 就是靠選對對照藥來逼近這個狀態。",
                  "Active comparator = use another drug that actually treats the same disease as the control group, instead of people taking nothing; that way both sides are sick and in need of treatment, so they are comparable. Confounding by indication = the false impression that 'the drug helps or harms' when really it is the kind of patient who takes it — sicker patients take the drug and also have more bad events, which looks like drug harm but is disease harm. Exchangeability = the two groups are alike in everything except which drug they took, so swapping them would give the same result and the comparison is fair; ACNU approaches this by choosing the right comparator."),
        "metrics": [],
    }


def _c2_newuser(lang="zh"):
    return {
        "id": "C2",
        "title": t(lang, "兩組都是『新使用者』、時間零點對齊嗎？（避免 immortal-time／既有使用者偏誤）",
                   "Are both groups NEW users with an aligned time zero? (avoid immortal-time / prevalent-user bias)"),
        "status": "info",
        "headline": t(lang, "新使用者設計把『第一張處方』當時間零點，兩組同時起跑——避免納入既有使用者帶來的存活者偏誤。",
                      "The new-user design sets time zero at the first prescription so both groups start together — avoiding the survivor bias of including prevalent users."),
        "plain": t(
            lang,
            "如果把<b>既有使用者</b>（已經用了一段時間的人）也算進來，他們是『用了還沒出事、所以還在用』的存活者——"
            "天生就比較健康（depletion of susceptibles），會讓藥看起來比實際安全，這就是 prevalent-user 偏誤。"
            "ACNU 只收<b>新使用者</b>，把每個人的<b>第一張處方</b>當時間零點，兩組同時起跑、同樣從零開始累積風險，"
            "也就不會有 immortal time。要做到這點，資料必須看得到完整的用藥起始史。",
            "Including <b>prevalent users</b> (already on the drug for a while) means counting survivors — people who tolerated "
            "the drug and are therefore healthier (depletion of susceptibles) — which makes the drug look safer than it is "
            "(prevalent-user bias). ACNU enrols only <b>new users</b> and sets time zero at each person's <b>first "
            "prescription</b>, so both groups start together and accrue risk from zero, with no immortal time. This requires "
            "the data to capture the full treatment-initiation history.",
        ),
        "term": t(lang, "新使用者設計（new-user design）＝只收「第一次開始吃這個藥」的人，並把第一張處方那天當成大家共同的起跑點，兩組同時起算風險。既有使用者偏誤＝如果把「早就在吃、吃了好一陣子」的人也算進來，他們是「吃了沒出事所以還留著」的幸存者，天生比較耐受，會害藥看起來比實際安全。immortal time（不死時間）＝某段「照規則他一定還活著、還沒出事」的時間，如果錯算進觀察期，會憑空讓某組看起來更安全。易感者耗竭（depletion of susceptibles）＝容易出事的人早早就出局了，留下來繼續吃的都是體質好的，造成同樣的低估假象。",
                  "New-user design = enrol only people starting the drug for the FIRST time, and treat that first prescription as everyone's shared starting line so both groups begin accruing risk together. Prevalent-user bias = if you also count people who have already been on the drug for a while, they are survivors who tolerated it and are healthier by nature, making the drug look safer than it is. Immortal time = a stretch of time during which a person is guaranteed (by the way they were selected) to still be alive and event-free; counting it in the follow-up falsely makes one group look safer. Depletion of susceptibles = the people prone to bad events drop out early, leaving only the hardy ones still taking the drug, which produces the same false underestimate of harm."),
        "metrics": [],
    }


def _c3_comparator_effect(lang="zh"):
    return {
        "id": "C3",
        "title": t(lang, "對照藥 B 本身對這個結果『沒有（或已知的）效應』嗎？（可檢驗性有限）",
                   "Does comparator B itself have no (or a known) effect on this outcome? (limited testability)"),
        "status": "info",
        "headline": t(lang, "ACNU 估的是 A『相對 B』的效應；若 B 也會影響結果，估出來的是兩者之差，要小心解讀。",
                      "ACNU estimates A's effect RELATIVE to B; if B also affects the outcome, the estimate is their difference — interpret with care."),
        "plain": t(
            lang,
            "用主動對照的代價是：你估的是 A <b>相對於 B</b> 的效應，不是 A 相對於『什麼都不做』。如果對照藥 B 對這個結果"
            "<b>本身就有保護或有害的效應</b>，那 ACNU 的速率比就被 B 的效應汙染了。最理想的對照藥是『對該結果中性、"
            "但治療同適應症』的藥；否則要用外部知識把 B 的效應納入解讀。",
            "The price of an active comparator is that you estimate A's effect <b>relative to B</b>, not relative to 'doing "
            "nothing'. If comparator B has its <b>own protective or harmful effect</b> on this outcome, the ACNU rate ratio is "
            "contaminated by B's effect. The ideal comparator is a drug that is <b>neutral for this outcome</b> while treating "
            "the same indication; otherwise B's effect must be folded into the interpretation using external knowledge.",
        ),
        "term": t(lang, "主動對照的效應＝對照藥 B 自己對這個結果也有作用（可能保護、也可能有害）；如果 B 不是中立的，你算出來的就不是 A 單獨的效果。相對效應＝你量到的永遠是「A 比 B 多好或多差」這個差距，而不是「A 比起完全不吃藥」的效果——換一種對照藥，數字就會變。陰性對照結果（negative-control outcome）＝特意挑一個「照理說這個藥不該影響」的結果來檢查；如果連它都出現差異，代表方法本身還藏著偏誤，要回頭懷疑結論。",
                  "Comparator effect = comparator B has its own effect on this outcome (protective or harmful); if B is not neutral, what you compute is not A's effect alone. Relative effect = what you measure is always 'how much better or worse A is than B', not 'A versus taking nothing at all' — change the comparator and the number changes. Negative-control outcome = an outcome deliberately chosen because the drug should not plausibly affect it; if a difference shows up even there, the method still hides some bias and the conclusion should be doubted."),
        "metrics": [],
    }


def _c4_residual(res, lang="zh"):
    bal = res.get("severity_balance") or {}
    gap_AB = abs(bal.get("A", 0.0) - bal.get("B", 0.0))
    gap_An = abs(bal.get("A", 0.0) - bal.get("none", 0.0))
    metrics = [
        {"name": t(lang, "嚴重度差：A vs 對照藥 B", "Severity gap: A vs comparator B"),
         "value": f"{gap_AB:.2f}",
         "note": t(lang, "限制在新使用者＋主動對照後，殘留的嚴重度差（越小越好）",
                   "the residual severity gap after restricting to new users + active comparator (smaller is better)")},
        {"name": t(lang, "嚴重度差：A vs 沒用藥（對比）", "Severity gap: A vs non-users (for contrast)"),
         "value": f"{gap_An:.2f}",
         "note": t(lang, "天真對照的嚴重度差——通常大得多，這就是天真比較偏很多的原因",
                   "the naive contrast's gap — usually much larger, which is why the naive comparison is so biased")},
        {"name": t(lang, "粗 ACNU → 校正後", "crude ACNU → adjusted"),
         "value": f"{res['crude_irr']:.2f} → {res['adj_irr']:.2f}",
         "note": t(lang, "校正把殘留嚴重度混淆補掉，移向真值", "adjustment removes residual severity confounding, moving toward truth")},
    ]
    if gap_AB < 0.3:
        status = "green"
        head = t(lang, "A 與對照藥 B 的嚴重度已很接近——殘留混淆小，校正只是微調。",
                 "A and comparator B are already close in severity — little residual confounding; adjustment is a fine-tune.")
    elif gap_AB < 0.9:
        status = "amber"
        head = t(lang, "A 與 B 仍有殘留的嚴重度差——主動對照削掉了大半混淆，剩下的要靠傾向分數／共變項校正補掉。",
                 "A and B still differ somewhat in severity — the active comparator removed most confounding; adjust the rest with a propensity score / covariates.")
    else:
        status = "red"
        head = t(lang, "A 與 B 的嚴重度差很大——對照藥可能不夠相似，或有未測的嚴重度，殘留混淆風險高。",
                 "A and B differ a lot in severity — the comparator may not be similar enough, or severity is unmeasured; high residual-confounding risk.")
    return {
        "id": "C4",
        "title": t(lang, "殘留混淆校正掉了嗎？（可檢驗：A vs B 的嚴重度平衡）",
                   "Is residual confounding adjusted? (testable: severity balance A vs B)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "主動對照＋新使用者把<b>大部分</b>因適應症的混淆削掉，但 A 與 B 之間通常還有<b>殘留</b>的嚴重度差"
            "（這裡 A vs B 的差比 A vs 沒用藥小很多）。把這個殘留用<b>傾向分數或共變項校正</b>補掉，速率比就會從"
            "粗估移向真值。上面三個指標就是在看：殘留差有多大、天真對照差多大、校正前後差多少。",
            "The active comparator + new-user design removes <b>most</b> confounding by indication, but A and B usually still "
            "differ a little in severity (here the A-vs-B gap is much smaller than A-vs-non-users). Mopping up that residual "
            "with a <b>propensity score or covariate adjustment</b> moves the rate ratio from the crude estimate toward the "
            "truth. The three metrics above show how large the residual gap is, how large the naive gap is, and how much "
            "adjustment moves the estimate.",
        ),
        "term": t(lang, "殘留混淆＝就算用了主動對照加新使用者，A 組和 B 組的病人「病情輕重」通常還是沒完全一樣，剩下的這點差距會繼續干擾結論，需要再校正。傾向分數（propensity score）＝把每個人的年齡、共病等資料綜合成一個「他比較會被開到 A 還是 B」的分數，再用它讓兩組病情拉齊，等於事後把人配得更像。標準化差（standardized difference）＝一把衡量「兩組某項特徵差多少」的尺，數字越接近 0 代表越平衡；一般小於 0.1 就算兩組已經很接近。",
                  "Residual confounding = even after the active comparator plus new-user design, groups A and B usually still differ a little in how sick the patients are, and that leftover gap keeps distorting the conclusion until it is adjusted for. Propensity score = a single number combining each person's age, comorbidities, etc. into 'how likely they were to be given A rather than B', which is then used to even out the two groups' disease severity, in effect matching the patients more closely after the fact. Standardized difference = a yardstick for 'how far apart the two groups are on a given characteristic'; the closer to 0 the more balanced, and below about 0.1 the groups are considered well matched."),
        "metrics": metrics,
    }


def _c5_events(res, lang="zh"):
    ev = res.get("events") or {}
    eA, eB = int(ev.get("A", 0)), int(ev.get("B", 0))
    mn = min(eA, eB)
    metrics = [
        {"name": t(lang, "事件數（A／對照藥 B）", "Events (A / comparator B)"), "value": f"{eA} / {eB}",
         "note": t(lang, "兩臂都要有夠多事件，速率比才穩", "both arms need enough events for a stable rate ratio")},
        {"name": t(lang, "新使用者數（A／B）", "New users (A / B)"),
         "value": f"{res['n_a']} / {res['n_b']}",
         "note": t(lang, "主動對照組越大，估計越精確", "a larger comparator arm gives a more precise estimate")},
    ]
    if mn >= 200:
        status, head = "green", t(lang, "兩臂事件都很充足——速率比與信賴區間穩定。",
                                  "Plenty of events in both arms — the rate ratio and CI are stable.")
    elif mn >= 50:
        status, head = "amber", t(lang, "事件數中等——信賴區間會偏寬，解讀留意精確度。",
                                  "Moderate event counts — the CI will be wide; mind the precision.")
    else:
        status, head = "red", t(lang, "事件太少——速率比很不穩，別過度解讀。",
                                "Too few events — the rate ratio is unstable; don't over-interpret.")
    return {
        "id": "C5",
        "title": t(lang, "事件數夠嗎？（可檢驗）", "Are there enough events? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "ACNU 的速率比由各臂的<b>事件數</b>決定精確度。主動對照雖然削掉偏誤，但因為只比『用 A vs 用 B』、"
            "捨棄了沒用藥的人，<b>樣本與事件數會比天真比較少</b>。事件太少時，信賴區間會很寬，要小心別把雜訊當訊號。",
            "The precision of the ACNU rate ratio is driven by the <b>event counts</b> in each arm. The active comparator "
            "removes bias, but because it compares only 'A vs B' and discards non-users, the <b>sample and event counts are "
            "smaller</b> than in the naive comparison. With few events the CI is wide — be careful not to read noise as signal.",
        ),
        "term": t(lang, "人時（person-time）＝把每個人被追蹤的時間全部加起來（例如 100 人各追 1 年＝100 人年），用來當「曝險了多久」的分母，這樣追得久的和追得短的才能公平相加。事件率＝事件數除以人時，也就是「平均每多少人年會發生一件」，比單純比件數更公平。精確度／效能＝事件越多，估出來的速率比就越穩、信賴區間越窄（精確度高），也越有把握偵測到真正的差異（效能足）；事件太少時數字會抖得很厲害，別把雜訊當訊號。",
                  "Person-time = add up the time every person was followed (e.g. 100 people for 1 year each = 100 person-years), used as the denominator for 'how much exposure there was', so people followed long and short can be fairly combined. Event rate = events divided by person-time, i.e. 'how many cases occur per so many person-years', which is fairer than just counting cases. Precision / power = more events make the estimated rate ratio steadier and its confidence interval narrower (high precision) and give a better chance of detecting a real difference (enough power); with too few events the number wobbles wildly, so do not mistake noise for signal."),
        "metrics": metrics,
    }
