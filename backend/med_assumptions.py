"""Mediation assumption checks C1–C5. Natural-effects identification rests on
sequential ignorability (no unmeasured confounding of A–Y, A–M, M–Y) plus the
cross-world 'no exposure-induced M–Y confounder' condition — all untestable from
data alone (blue info cards). The testable supports: an exposure-mediator
interaction test (does the decomposition even need the interaction term?) and
whether there is enough data. A sensitivity card explains the medsens (rho) idea.

Each check returns {id, title, status, headline, plain, term, metrics:[...]};
run_dashboard returns {"checks": [...]}.
"""
from __future__ import annotations

import numpy as np

import med_core
from i18n import t


def run_dashboard(df, treat="A", mediator="M", outcome="Y", cov="X", lang="zh"):
    res = med_core.full_med(df, treat, mediator, outcome, cov, n_boot=0, lang=lang)
    A = np.asarray(df[treat], dtype=float); M = np.asarray(df[mediator], dtype=float)
    X = np.asarray(df[cov], dtype=float); Y = np.asarray(df[outcome], dtype=float)
    # interaction test: coefficient on A*M in Y ~ A + M + A*M + X
    bo, seo = med_core._ols([A, M, A * M, X], Y)
    inter_t = float(abs(bo[3] / seo[3])) if seo[3] > 0 else 0.0
    checks = [
        _c1_ay(lang),
        _c2_my(res, lang),
        _c3_am(lang),
        _c4_interaction(inter_t, res, lang),
        _c5_data(res, lang),
    ]
    return {"checks": checks}


def _c1_ay(lang="zh"):
    return {
        "id": "C1",
        "title": t(lang, "無未測的「暴露 → 結果」混淆（A–Y，可調整則靠已測共變項，關鍵、不可檢驗）",
                   "No unmeasured exposure-outcome (A–Y) confounding (given measured covariates; key, untestable)"),
        "status": "info",
        "headline": t(lang, "估總效果與直接效果都要：接種與否 vs 感染，沒有沒測到的共同原因（如健康程度）。",
                      "Both the total and direct effects need: vaccination vs infection share no unmeasured common cause (e.g. underlying health)."),
        "plain": t(
            lang,
            "中介分析建立在<b>序列可忽略（sequential ignorability）</b>之上，第一條是：在已測共變項 X 之下，<b>暴露 A 與結果 Y</b> "
            "沒有未測的共同原因。這和一般因果推論的「無未測混淆」一樣——若健康程度同時影響接種與感染、又沒被 X 校正，總效果與其分解都會偏。"
            "這條<b>無法用資料證明</b>；靠設計（主動對照、新使用者）、豐富的 X、或敏感度分析來支撐。",
            "Mediation rests on <b>sequential ignorability</b>; the first part is: given measured covariates X, the <b>exposure A and "
            "outcome Y</b> share no unmeasured common cause. This is the usual 'no unmeasured confounding' — if underlying health drives "
            "both vaccination and infection and is not captured by X, the total effect and its decomposition are biased. It is "
            "<b>not provable from data</b>; support it by design (active comparator, new users), rich X, or sensitivity analysis.",
        ),
        "term": t(lang, "序列可忽略性（sequential ignorability）＝把中介分析要的所有「沒有藏起來的共同原因」條件一次列齊；只要每一步（A→Y、A→M、M→Y）都沒有沒測到的混淆，效果分解才算得準。無未測混淆＝沒有任何沒被你的共變項 X 校正、卻同時影響「誰接種」和「誰感染」的因子（例如本身健康程度）；有的話，兩組病人本來就不一樣，差距會被誤算成疫苗的功勞。",
                  "Sequential ignorability = the full checklist of 'no hidden common cause' conditions that mediation needs at once; only if every step (A->Y, A->M, M->Y) is free of unmeasured confounding can the decomposition be trusted. No unmeasured confounding = there is no factor, left out of your covariates X, that drives both who gets vaccinated and who gets infected (e.g. underlying health); if there is, the two groups differ to begin with and that gap gets miscredited to the vaccine."),
        "metrics": [],
    }


def _c2_my(res, lang="zh"):
    return {
        "id": "C2",
        "title": t(lang, "無未測的「中介 → 結果」混淆（M–Y，最關鍵、最常被忽略、不可檢驗）",
                   "No unmeasured mediator-outcome (M–Y) confounding (the key, most-overlooked, untestable condition)"),
        "status": "info",
        "headline": t(lang, "拆出間接效果的命門：抗體 M 與感染 Y 不能有沒測到的共同原因（如先天免疫力）。",
                      "The crux of splitting off the indirect effect: antibodies M and infection Y must share no unmeasured common cause (e.g. innate immunity)."),
        "plain": t(
            lang,
            "要把效果『經過中介 M』的部分拆出來，必須<b>沒有未測的 M–Y 混淆</b>——一個同時影響抗體水準與感染風險、卻沒被校正的因子"
            "（如先天免疫力、合併症）會讓 NIE／NDE 都偏。這是中介分析<b>最關鍵也最常被忽略</b>的假設，且<b>即使暴露被隨機分派也不會自動成立</b>"
            "（隨機化只保證 A 的可交換，不保證 M 的）。無法用資料檢驗；務必做<b>敏感度分析</b>（見下方卡）。",
            "To split off the part of the effect that runs <b>through the mediator M</b>, there must be <b>no unmeasured M–Y "
            "confounding</b> — a factor that affects both antibody level and infection risk but is uncontrolled (innate immunity, "
            "comorbidity) biases both NIE and NDE. This is mediation's <b>most critical and most overlooked</b> assumption, and it is "
            "<b>not guaranteed even by randomising the exposure</b> (randomisation makes A exchangeable, not M). Untestable from data — "
            "always run a <b>sensitivity analysis</b> (see the card below).",
        ),
        "term": t(lang, "中介–結果混淆（mediator-outcome confounding）＝有一個因子同時影響「中介 M」（抗體高低）和「結果 Y」（會不會感染），卻沒被校正——例如先天免疫力好的人，抗體本來就高、感染也本來就少。這時你會誤以為是抗體在保護，其實是免疫力同時推動了兩邊，於是「經過抗體」的那段效果（NIE）算錯。序列可忽略性＝中介分析要的整套「沒有藏起來的共同原因」條件；這條 M–Y 是其中最關鍵、最常被漏掉的一塊。",
                  "Mediator-outcome confounding = one factor secretly drives both the mediator M (antibody level) and the outcome Y (getting infected), without being adjusted for — e.g. people with strong innate immunity already have high antibodies and already get infected less. You then credit the antibodies for the protection when really immunity was pushing both, so the 'through-antibody' part of the effect (NIE) comes out wrong. Sequential ignorability = mediation's whole set of 'no hidden common cause' conditions; this M–Y piece is the most critical and most often missed."),
        "metrics": [],
    }


def _c3_am(lang="zh"):
    return {
        "id": "C3",
        "title": t(lang, "無未測的「暴露 → 中介」混淆，且無暴露誘發的 M–Y 混淆（cross-world，不可檢驗）",
                   "No unmeasured exposure-mediator (A–M) confounding, and no exposure-induced M–Y confounder (cross-world, untestable)"),
        "status": "info",
        "headline": t(lang, "自然效果還要：A–M 無未測混淆，且暴露不會製造出新的 M–Y 混淆因子。",
                      "Natural effects also need: no unmeasured A–M confounding, and the exposure must not create a new M–Y confounder."),
        "plain": t(
            lang,
            "<b>自然</b>直接／間接效果（NDE/NIE）的識別還要兩件事：(1) 在 X 下<b>暴露 A 與中介 M</b> 無未測混淆；(2) 沒有<b>被暴露"
            "誘發的中介–結果混淆因子</b>（即治療本身造出一個同時影響 M 與 Y 的中間變項）——這是所謂 <b>cross-world（跨世界）</b>"
            "假設，特別抽象、特別難。若這條被破壞，可改估<b>控制直接效果（CDE）</b>（把 M 固定在某值），它對這個 cross-world 條件較不敏感。",
            "Identifying the <b>natural</b> direct/indirect effects (NDE/NIE) needs two more things: (1) no unmeasured <b>A–M</b> "
            "confounding given X; and (2) no <b>exposure-induced mediator-outcome confounder</b> (the treatment itself creating an "
            "intermediate that affects both M and Y) — the so-called <b>cross-world</b> assumption, especially abstract and hard. If it "
            "fails, switch to the <b>controlled direct effect (CDE)</b> (fix M at a value), which does not require this cross-world condition.",
        ),
        "term": t(lang, "cross-world（跨世界）假設＝要比較「同一個人在某個平行情境下會怎樣」的設定——例如「假如他打了疫苗、但抗體卻停在沒打疫苗時的水準」；這種情況現實中永遠看不到，所以再多資料也驗不了，特別抽象。暴露誘發的中介–結果混淆＝治療本身製造出一個新的中間因子，這因子同時影響抗體和感染（例如疫苗引發的某種發炎反應），把 M 和 Y 又攪在一起。控制直接效果（CDE）＝乾脆把抗體「固定在某個數值」再看疫苗的直接作用；它不需要上面那個跨世界條件，所以這條假設站不住時可改用它。",
                  "Cross-world assumption = a setup that compares 'what the same person would look like in a parallel scenario' — e.g. 'suppose he got the vaccine but his antibodies stayed at the no-vaccine level'; that situation can never actually be observed, so no amount of data can check it, which makes it especially abstract. Exposure-induced mediator-outcome confounder = the treatment itself creates a new intermediate factor that affects both antibodies and infection (say, a vaccine-triggered inflammation), tangling M and Y back together. Controlled direct effect (CDE) = just pin the antibodies at a fixed value and look at the vaccine's direct effect; it does not need that cross-world condition, so it is the fallback when this assumption is shaky."),
        "metrics": [],
    }


def _c4_interaction(inter_t, res, lang="zh"):
    if inter_t >= 3:
        status, head = "amber", t(lang, "暴露×中介交互明顯——務必用含交互的分解，未校正『Y~A+M』的直接效果會偏。",
                                  "Clear exposure-mediator interaction — use the interaction-aware decomposition; the naive 'Y~A+M' direct effect is biased.")
    elif inter_t >= 1.5:
        status, head = "amber", t(lang, "可能有交互——含交互的分解較保險。",
                                  "Possible interaction — the interaction-aware decomposition is safer.")
    else:
        status, head = "green", t(lang, "交互不明顯——含與不含交互的直接效果會接近。",
                                  "Little interaction — direct effects with and without the interaction term are close.")
    return {
        "id": "C4",
        "title": t(lang, "模型設定：是否需要暴露×中介交互？（可檢驗）",
                   "Model spec: is an exposure-mediator interaction needed? (testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "若疫苗讓抗體『更有效』，就存在<b>暴露×中介交互（A×M）</b>。此時只放『Y ~ A + M』的 A 係數<b>不等於</b>自然直接效果，"
            "正確做法要用含交互的反事實分解（NDE 在 M(0) 評估、NIE 用 (b+g)·a）。可檢的指標是交互項的 t 值——明顯就一定要納入交互。"
            "這是少數<b>可由資料檢驗</b>的部分；序列可忽略（C1–C3）仍不可檢。",
            "If the vaccine makes antibodies <b>more protective</b>, there is an <b>exposure-mediator interaction (A×M)</b>. Then the A "
            "coefficient from 'Y ~ A + M' is <b>not</b> the natural direct effect; the correct decomposition is interaction-aware (NDE "
            "evaluated at M(0), NIE = (b+g)·a). The testable metric is the interaction term's t-statistic — if clear, you must include it. "
            "This is one of the few <b>data-testable</b> parts; sequential ignorability (C1–C3) remains untestable.",
        ),
        "term": t(lang, "暴露–中介交互（exposure-mediator interaction）＝抗體的保護力會「因為有沒有打疫苗而不同」——同樣的抗體水準，在打過疫苗的人身上更管用。有這種交互時，不能只看一條 Y~A+M 的疫苗係數，否則直接效果會算偏。四向分解（VanderWeele）＝把總效果拆成四塊：純直接、純間接（經抗體）、純交互、以及交互又經過抗體的部分；這樣交互的貢獻不會被埋沒，能看清效果到底從哪來。",
                  "Exposure-mediator interaction = how protective the antibodies are 'depends on whether the person was vaccinated' — the same antibody level works better in someone who got the vaccine. When this interaction exists you cannot just read the vaccine coefficient from a single Y~A+M model, or the direct effect comes out biased. Four-way decomposition (VanderWeele) = splits the total effect into four pieces: pure direct, pure indirect (through antibodies), pure interaction, and interaction that also runs through antibodies; this way the interaction's contribution is not buried and you can see exactly where the effect comes from."),
        "metrics": [
            {"name": t(lang, "交互項 A×M（t 值）", "interaction A×M (t-stat)"), "value": f"{inter_t:.1f}",
             "note": t(lang, "≳2 就應納入交互；未校正直接效果會偏", "≳2 means include the interaction; the naive direct effect is biased")},
        ],
    }


def _c5_data(res, lang="zh"):
    n = int(res.get("n", 0))
    if n >= 3000:
        status, head = "green", t(lang, "樣本充足——分解與自助信賴區間穩定。",
                                  "Ample sample — the decomposition and bootstrap CIs are stable.")
    elif n >= 800:
        status, head = "amber", t(lang, "樣本中等——間接效果與被中介比例的 CI 會偏寬。",
                                  "Moderate sample — CIs for the indirect effect and proportion mediated are wide.")
    else:
        status, head = "red", t(lang, "樣本太少——比例 NIE/TE 很不穩，別過度解讀。",
                                "Too few observations — the ratio NIE/TE is unstable; don't over-interpret.")
    return {
        "id": "C5",
        "title": t(lang, "資料量夠嗎？（敏感度分析的替身在此；可檢驗）",
                   "Is there enough data? (and where sensitivity analysis lives; testable)"),
        "status": status, "headline": head,
        "plain": t(
            lang,
            "中介分解結合兩個模型（中介模型＋結果模型），<b>被中介比例</b>是兩個估計的比值，對樣本量與雜訊特別敏感——務必看<b>自助信賴區間</b>，"
            "別只看點估計。因為最關鍵的 M–Y 無混淆（C2）<b>不可檢</b>，標準做法是做<b>敏感度分析</b>：例如 Imai 等的 <code>medsens</code>——"
            "假設中介與結果模型的殘差相關 ρ≠0（代表存在未測 M–Y 混淆），看結論要在多大的 ρ 下才會翻盤，藉此衡量結果的穩健度。",
            "Mediation combines two models (mediator + outcome), and the <b>proportion mediated</b> is a ratio of two estimates — "
            "especially sensitive to sample size and noise, so read the <b>bootstrap CI</b>, not just the point estimate. Because the key "
            "M–Y no-confounding condition (C2) is <b>untestable</b>, the standard practice is a <b>sensitivity analysis</b>: e.g. Imai "
            "et al.'s <code>medsens</code> — posit a correlation ρ≠0 between the mediator and outcome errors (i.e. unmeasured M–Y "
            "confounding) and find how large ρ must be before the conclusion flips, gauging robustness.",
        ),
        "term": t(lang, "敏感度分析＝既然「抗體與感染沒有藏起來的共同原因」這條沒法直接驗，就反過來問：要存在「多嚴重」的隱藏混淆，你的結論才會被推翻？需要很嚴重才翻盤，結論就算穩。ρ（medsens，Imai 等人的做法）＝用一個介於 −1 到 1 的數字，代表中介模型和結果模型「沒解釋到的部分」彼此相關多深；ρ 越偏離 0，代表藏著越強的 M–Y 混淆，看結論要在多大的 ρ 下翻盤。自助信賴區間（bootstrap CI）＝把原資料反覆隨機抽樣重算很多次，看估計值會抖動多大，得到一個合理範圍；被中介比例是兩個估計相除，特別會抖，所以要看區間、別只信單一數字。",
                  "Sensitivity analysis = since 'antibodies and infection share no hidden common cause' cannot be checked directly, you flip the question: how severe would a hidden confounder have to be before your conclusion overturns? If it takes a lot, the conclusion is robust. Rho (medsens, the Imai et al. approach) = a single number from −1 to 1 for how strongly the 'unexplained parts' of the mediator model and the outcome model move together; the further rho is from 0, the stronger the hidden M–Y confounding, and you check how large rho must get before the conclusion flips. Bootstrap CI = re-sample the original data at random and recompute many times to see how much the estimate wobbles, giving a plausible range; the proportion mediated is one estimate divided by another and wobbles a lot, so trust the range, not a single number."),
        "metrics": [
            {"name": t(lang, "樣本數", "sample size"), "value": f"{n}",
             "note": t(lang, "比例估計需要較大樣本", "ratio estimates need a larger sample")},
        ],
    }
