---
layout: default
title: Research
---

<div class="content">
  <h1>Research</h1>
  <p style="font-size: 20px; font-family: Times New Roman">
    My current work focuses on the numerical model WRF’s reproducibility and performance during a record-breaking precipitation event happened during September 7 to 8 in 2023 at the Greater Bay Area (GBA). About 250 experiments have been conducted, and most experiments underestimate the peak precipitation. Evaluation are based on station records offered by the China's Meteorological Administration during the event.
  </p>
  <hr>
  <p style="font-size: 25px; font-weight: bold; font-family: Times New Roman">
    A Case Study on the Record-Breaking Rainfall in Southern China during September 7-8, 2023
  </p>
  <p style="font-size: 20px; font-family: Times New Roman">
    <strong>Abstract&nbsp;&nbsp;</strong>On 7-8 September 2023, southern China witnessed a historic rainfall event. Using the Weather Research and Forecasting (WRF) model, we investigated the underlying physics of this extreme precipitation. More than 250 parameterization experiments revealed that most schemes failed to reproduce the observed rainfall intensity (>400 mm day⁻¹), highlighting the challenge in forecasting such rare events. Sensitivity analyses identified the cumulus parameterization scheme as the dominant controlling factor. Crucially, the initial divergence between successful and unsuccessful simulations originated in the upper-level dynamics, driven by the choice of cumulus scheme in the model's outer domains. This suggests that altered vertical transport of momentum and moisture aloft is a key precursor. However, the precise mechanism linking these early upper-level changes to the subsequent development of intense surface precipitation remains to be elucidated.
  </p>
  <p style="font-size: 20px; font-family: Times New Roman">
    <strong>Introduction&nbsp;&nbsp;</strong>On 5 September 2023, Typhoon Haikui (Chinese: 海葵) made landfall in Fujian, subsequently moving into Guangdong and dissipated on September 5th. Yet its remnants stalled over the Greater Bay Area region (GBA) for over two days. As the low pressure trough associated with Haikui's remnants interacted with the south-westerly monsoon, the GBA region started experiencing extreme rainfall beginning on the night of September 7th.
  </p>
  <img src="/assets/images/background.png" alt="Research Image 1" style="max-width:800px; height:auto;">
  <hr>
  <p style="font-size: 20px; font-family: Times New Roman">
    <strong>Results</strong>
    <br>&nbsp;&nbsp;&nbsp;&nbsp;• Over 250 parameterization experiments yielded mixed results, with most schemes unable to simulate extreme precipitation above 400 mm/day due to the rarity of this events.
    <br>&nbsp;&nbsp;&nbsp;&nbsp;• Five experiments performed well, showing high correlation with observations and low error.
    <br>&nbsp;&nbsp;&nbsp;&nbsp;• A detailed analysis investigating the physical mechanisms contributing to the success of these high-performing parameterizations are necessary.
    <img src="/assets/images/pattern_ACC-RMSE-TS.png" alt="Research Image 2" style="max-width:800px; height:auto;">
  </p>
  <hr>
  <p style="font-size: 20px; font-family: Times New Roman">
    <br>&nbsp;&nbsp;&nbsp;&nbsp;• The experiment that performs best in simulating precipitation is selected as the <strong>control</strong> run.
    <br>&nbsp;&nbsp;&nbsp;&nbsp;• Three parameterization schemes (cumulus, microphysics, PBL) are individually perturbed based on the control run (see results below).
    <br>&nbsp;&nbsp;&nbsp;&nbsp;• Results show that perturbing the cumulus scheme leads to a more substantial decrease in simulated precipitation intensity than perturbing either the microphysics or PBL schemes.
    <br>&nbsp;&nbsp;&nbsp;&nbsp;• <strong>This suggests that</strong> the choice of cumulus parameterization in the outer domains has a stronger influence on precipitation performance than changes in microphysics schemes.
  </p>
  <p style="display:flex; gap:50px;">
    <img src="/assets/images/sensitivity_analysis_1.png" alt="Research Image 3" style="max-height:200px; width:auto;">
    <img src="/assets/images/sensitivity_analysis_2.png" alt="Research Image 4" style="max-height:200px; width:auto;">
  </p>
  <hr>
  <p style="font-size: 12px; font-weight: bold; font-family: Arial">
  Temporal mean is conducted from 14:00 to 17:00 on September 4 2025 (UTC).<br>
  <img src="/assets/images/U_ano.0412_0414.png" alt="Research Image 5" style="max-width:800px; height:auto;">
  <br>Temporal mean is conducted from 06:00 to 09:00 on September 5 2025 (UTC).<br>
  <img src="/assets/images/U_ano.0506_0508.png" alt="Research Image 6" style="max-width:800px; height:auto;">
  </p>
  <p style="font-size: 20px; font-family: Times New Roman">
    <br>&nbsp;&nbsp;&nbsp;&nbsp;• In the early stages of the experiments, comparisons were made between the control run and the cumulus-perturbed experiments in terms of dynamic and thermodynamic fields.
    <br>&nbsp;&nbsp;&nbsp;&nbsp;• The key divergence between the control and perturbed runs first appears in the <strong>upper-level dynamics</strong>. This difference is attributed to the use of different cumulus schemes in the outer domains.
    <br>&nbsp;&nbsp;&nbsp;&nbsp;• A possible way is: The cumulus scheme influences the vertical transport of momentum and moisture in the outer domains, leading to the discrepancies aloft. <u>This process is still being investigated.</u>
  </p>
</div>
