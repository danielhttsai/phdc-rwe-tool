"""Transportability assumption dashboard (C1–C5)."""
import numpy as np
from transport_gen import generate

try:
    from i18n import t
except Exception:  # pragma: no cover
    def t(lang, zh, en):
        return zh if lang == "zh" else en


def _chk(status, title, headline, plain, term, metrics):
    return {"status": status, "title": title, "headline": headline, "plain": plain, "term": term, "metrics": metrics}


def run_dashboard(mu_target=0.6, lang="zh"):
    d = generate(mu_target=float(mu_target))
    xs, xt = d["study_X"], d["target_X"]
    # C2 positivity of selection: does the target's X fall inside the study's support?
    lo, hi = np.quantile(xs, 0.01), np.quantile(xs, 0.99)
    outside = float(np.mean((xt < lo) | (xt > hi)))
    c2 = "green" if outside < 0.02 else ("amber" if outside < 0.10 else "red")
    # C5 distributional distance (standardised mean difference of the modifier)
    smd = abs(xt.mean() - xs.mean()) / np.sqrt((xs.var() + xt.var()) / 2 + 1e-9)
    c5 = "green" if smd < 0.3 else ("amber" if smd < 0.8 else "red")

    checks = [
        _chk("info",
             t(lang, "C1 條件可轉移性（無未測、且分布不同的效果修飾子）", "C1 Conditional transportability (no unmeasured, differentially-distributed effect modifier)"),
             t(lang, "最關鍵、不可檢驗。", "The key, untestable one."),
             t(lang, "在已測效果修飾子之下，治療效果在兩族群是一樣的——也就是『讓兩族群效果不同的東西，你都量到了』。若還有沒量到、又在兩族群分布不同的效果修飾子，轉移就會偏。",
                     "Given the measured effect modifiers, the treatment effect is the same across populations — i.e. you measured everything that makes the effect differ. An unmeasured modifier with a different distribution biases the transport."),
             t(lang, "效果修飾子＝會改變『治療效果大小』的變數（不是只改變結果水準）。", "An effect modifier changes the SIZE of the treatment effect (not just the outcome level)."),
             []),
        _chk(c2,
             t(lang, "C2 選樣正性（目標落在研究的支持範圍內）", "C2 Positivity of selection (target lies within the study's support)"),
             t(lang, f"目標約 {outside*100:.0f}% 落在研究 X 範圍外。", f"~{outside*100:.0f}% of the target is outside the study's X range."),
             t(lang, "目標族群的每種共變項組合，研究裡都要有人——否則你是在『外推到沒資料的地方』。落在範圍外的比例越高越危險。",
                     "Every covariate value in the target must occur in the study; otherwise you are extrapolating into regions with no data. The more of the target outside the study's support, the riskier."),
             t(lang, "正性／重疊＝目標的共變項支持 ⊆ 研究的支持。", "Positivity / overlap = the target's covariate support ⊆ the study's."),
             [{"name": t(lang, "目標落在研究範圍外", "target outside study support"), "value": f"{outside*100:.0f}%", "note": ""}]),
        _chk("info",
             t(lang, "C3 效果修飾子在兩邊都量到", "C3 Effect modifiers measured in both populations"),
             t(lang, "需要目標的共變項分布。", "You need the target's covariate distribution."),
             t(lang, "要轉移，你必須在研究與目標都量到同一組效果修飾子（目標至少要有共變項，不必有結果）。",
                     "To transport, the same effect modifiers must be measured in the study and the target (the target needs covariates, not outcomes)."),
             t(lang, "目標資料常只有共變項（如普查／登錄），沒有治療與結果。", "Target data often has only covariates (a census/registry), no treatment or outcome."),
             []),
        _chk("info",
             t(lang, "C4 一致性與良好定義的介入", "C4 Consistency & a well-defined intervention"),
             t(lang, "同一個介入。", "The same intervention."),
             t(lang, "研究裡的治療，和你想在目標施加的治療，是同一回事（同樣的劑量、版本、實作）。",
                     "The treatment in the study is the same as the one you would apply in the target (same dose, version, implementation)."),
             t(lang, "一致性＝觀察到的結果＝你介入到那個值時的反事實。", "Consistency = the observed outcome equals the counterfactual under that set value."),
             []),
        _chk(c5,
             t(lang, "C5 兩族群差多少（建模需求）", "C5 How far apart the populations are (modelling demand)"),
             t(lang, f"效果修飾子標準化差異 SMD ≈ {smd:.2f}。", f"Effect-modifier SMD ≈ {smd:.2f}."),
             t(lang, "兩族群差越大，轉移越仰賴模型設定正確、外推越多。差距小→穩；差距大→對模型敏感、要小心。",
                     "The further apart the populations, the more the transport leans on a correctly specified model and extrapolation. Small gap → stable; large gap → model-sensitive, handle with care."),
             t(lang, "SMD＝標準化平均差，衡量兩分布相距多遠。", "SMD = standardised mean difference, how far apart two distributions are."),
             [{"name": "SMD", "value": f"{smd:.2f}", "note": ""}]),
    ]
    order = {"red": 0, "amber": 1, "info": 2, "green": 3}
    worst = min((c["status"] for c in checks), key=lambda s: order[s])
    head = {"red": t(lang, "轉移有風險：正性或差距亮紅燈。", "Transport is risky: positivity or the gap is red."),
            "amber": t(lang, "可轉移，但要留意正性與兩族群差距。", "Transportable, but mind positivity and the population gap."),
            "info": t(lang, "可檢項看起來合理；關鍵假設仍需領域判斷。", "The checkable items look reasonable; the key assumption needs judgement."),
            "green": t(lang, "可檢項通過；關鍵假設仍需領域判斷。", "Checkable items pass; the key assumption still needs judgement.")}[worst]
    return {"overall_status": worst, "overall_headline": head, "checks": checks}
