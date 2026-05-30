# 工具變數（IV）教學工具 — 參考文獻

本工具的理論與方法,整理自下列文獻。簡單說,前兩篇是「IV 的基本觀念與假設怎麼檢驗」,
後面幾篇是「把機器學習帶進 IV」的各種做法與陷阱。

---

## 一、IV 基礎與假設檢驗

用來講解 IV 是什麼,以及怎麼檢查一個工具變數合不合格（A1 強度、A2 排除限制、
A3 獨立性、A4a 單調性、A4b 同質性)。

- **Homayra, F., Enns, B., Min, J. E., Kurz, M., Bach, P., Bruneau, J., Greenland, S.,
  Gustafson, P., Karim, M. E., Korthuis, P. T., Loughin, T., MacLure, M., McCandless, L.,
  Platt, R. W., Schnepel, K., Shigeoka, H., Siebert, U., Socias, E., Wood, E., & Nosyk, B.
  (2024).** Comparative Analysis of Instrumental Variables on the Assignment of
  Buprenorphine/Naloxone or Methadone for the Treatment of Opioid Use Disorder.
  *Epidemiology, 35*(2), 218–231. https://doi.org/10.1097/EDE.0000000000001697

- **Leung, M. (2024).** *Instrumental Variables*〔講義〕. NCKU — Bias in Epidemiology, May 2, 2024.

---

## 二、把機器學習帶進 IV

### 合成工具（把很多個弱工具合成一個強工具）

- **Singh, A., Hosanagar, K., & Gandhi, A.** Machine Learning Instrument Variables for
  Causal Inference. The Wharton School / Department of Economics, University of Pennsylvania.

### 機器學習 IV 估計與非參數第一階段

- **Bakhitov, E. (2025).** On machine learning instrumental variable estimators.
  *Economics Letters.* 〔Elsevier ScienceDirect: S0165176525004380〕

- **Bruns-Smith, D. (2025).** *Two-Stage Machine Learning for Nonparametric Instrumental
  Variable Regression.* Stanford University, October 2, 2025.

### 禁止迴歸偏誤(為什麼一定要交叉擬合)

- **Peng, J. (2024).** *Machine Learning for Instrumental Variable Regression: From Bias to
  Resilience.* University of Connecticut, November 4, 2024. SSRN 5008641.

### 綜述

- **Wu, A., Kuang, K., Xiong, R., & Wu, F. (2022).** Instrumental Variables in Causal
  Inference and Machine Learning: A Survey. *arXiv:2212.05778.*

---

## 三、應用範例

- **Kaufman, E. J., Keele, L. J., Wirtalla, C. J., Rosen, C. B., Roberts, S. E.,
  Mavroudis, C. L., Reilly, P. M., Holena, D. N., McHugh, M. D., Small, D., & Kelz, R. R.**
  Operative and Nonoperative Outcomes of Emergency General Surgery Conditions: An
  Observational Study Using a Novel Instrumental Variable.
