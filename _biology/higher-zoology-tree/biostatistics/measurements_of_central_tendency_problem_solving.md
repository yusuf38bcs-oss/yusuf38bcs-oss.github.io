---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Measurements of Central Tendency: Problem Solving"
excerpt: "৩০ জন রোগীর রক্তের গ্লুকোজের মাত্রার উপাত্ত ব্যবহার করে শ্রেণীবদ্ধ উপাত্তের (Grouped Data) গাণিতিক গড়, মধ্যমা ও প্রচুরক নির্ণয়ের সম্পূর্ণ বায়োস্ট্যাটিস্টিক্যাল সমাধান।"
date: 2026-04-05T17:31:00.000Z
categories:
  - Biostatistics
tags:
  - Biostatistics
  - Central-Tendency
  - Mean
  - Median
  - Mode
  - Grouped-Data
node_id: measurements_of_central_tendency_problem_solving
---

<style>
  .biostats-module { font-family: 'Inter', 'Tiro Bangla', sans-serif; color: #cbd5e1; line-height: 1.75; }
  .biostats-module .lecture-header { background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); color: white; padding: 2.5rem; border-radius: 14px; text-align: center; margin-bottom: 2rem; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
  .biostats-module .lecture-header h1 { margin: 0 0 10px 0; font-size: 2.2rem; font-weight: 800; color: #ffffff !important; }
  .biostats-module .concept-block { background: #0f172a; padding: 2rem; border-radius: 12px; margin: 2rem 0; border-left: 5px solid #00d4b2; border: 1px solid rgba(255,255,255,0.02); }
  .biostats-module .data-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; text-align: center; }
  .biostats-module .data-table th { background: #131c2e; color: #00d4b2; padding: 12px; border: 1px solid rgba(255,255,255,0.05); }
  .biostats-module .data-table td { padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1; }
  .biostats-module details { background: #090d16; padding: 0; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 10px; margin-bottom: 1.25rem; }
  .biostats-module details[open] { background: #0f172a; border-color: rgba(0, 212, 178, 0.3); }
  .biostats-module summary { font-weight: 700; cursor: pointer; color: #ffffff; font-size: 1.1rem; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
  .biostats-module summary::-webkit-details-marker { display: none; }
  .biostats-module summary::after { content: '▼'; color: #00d4b2; font-size: 0.9em; transition: transform 0.3s; }
  .biostats-module details[open] summary::after { transform: rotate(180deg); }
  .biostats-module .details-content { padding: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05); }
</style>

<div class="biostats-module">
  <div style="text-align: center; margin: 2rem 0;">
    <img src="https://blogger.googleusercontent.com/img/a/AVvXsEhplUtAEV5hYOnMV_Xu7V9JYd_SgWJwj6J6CkKwpmVWNW-gwarMhhC22gH3Jpk6wSfpj3bjG9A1BRXimaNc12lLOEdgeYlPIloxirKWQlFNctlZoFdjanANt3p_w1BmOQ1lZaGd-EfvNBsfU7BMdl-4JZ9_W4D84wnxcqE-TvifFb9kB5l_TAYsYrXzXF4" alt="Central Tendency" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); max-width: 100%;">
  </div>

  <div class="lecture-header">
    <h1>📊 কেন্দ্রীয় প্রবণতার পরিমাপ: গাণিতিক সমাধান</h1>
    <p style="color: #00d4b2; font-weight: 600;">Biostatistical Analysis: Grouped Data Matrix</p>
  </div>

  <div class="concept-block">
    <h3 style="color: #ffffff; margin-top: 0; font-size: 1.4rem;">📌 সমস্যা উপাত্ত (Problem Dataset):</h3>
    <p>৩০ জন রোগীর রক্তের গ্লুকোজের মাত্রা ($\text{mg/dL}$) নিচে দেওয়া হলো। এই শ্রেণীবদ্ধ উপাত্তের গাণিতিক গড় (Mean), মধ্যমা (Median) ও প্রচুরক (Mode) নির্ণয় করো।</p>
    
    <div style="overflow-x: auto; width: 100%;">
      <table class="data-table">
        <thead>
          <tr>
            <th>গ্লুকোজের মাত্রা (শ্রেণী)</th>
            <th style="color: #ffffff;">৭০-৮০</th>
            <th style="color: #ffffff;">৮০-৯০</th>
            <th style="color: #ffffff;">৯০-১০০</th>
            <th style="color: #ffffff;">১০০-১১০</th>
            <th style="color: #ffffff;">১১০-১২০</th>
            <th>মোট</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="color: #ffffff; font-weight: bold;">রোগীর সংখ্যা ($f$)</td>
            <td>৪</td>
            <td>৮</td>
            <td>১০</td>
            <td>৬</td>
            <td>২</td>
            <td style="color: #00d4b2; font-weight: bold;">$N = 30$</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <details open>
    <summary>১. গাণিতিক গড় (Mean) নির্ণয়</summary>
    <div class="details-content">
      <div style="overflow-x: auto; width: 100%;">
        <table class="data-table">
          <thead>
            <tr>
              <th>শ্রেণী</th>
              <th style="color: #ffffff;">গণসংখ্যা ($f$)</th>
              <th style="color: #ffffff;">মধ্যবিন্দু ($x$)</th>
              <th>$fx$</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>৭০-৮০</td><td>৪</td><td>৭৫</td><td>৩০০</td></tr>
            <tr><td>৮০-৯০</td><td>৮</td><td>৮৫</td><td>৬৮০</td></tr>
            <tr><td>৯০-১০০</td><td>১০</td><td>৯৫</td><td>৯৫০</td></tr>
            <tr><td>১০০-১১০</td><td>৬</td><td>১০৫</td><td>৬৩০</td></tr>
            <tr><td>১১০-১২০</td><td>২</td><td>১১৫</td><td>২৩০</td></tr>
            <tr style="background: #131c2e; font-weight: bold;">
              <td>মোট</td><td style="color: #ffffff;">$N = 30$</td><td>-</td><td>$\sum fx = 2790$</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="background: rgba(0, 212, 178, 0.05); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #00d4b2; margin-top: 1.5rem; text-align: center; font-size: 1.25rem;">
        $$\bar{X} = \frac{\sum fx}{N} = \frac{2790}{30} = 93 \text{ mg/dL}$$
      </div>
    </div>
  </details>

  <details>
    <summary>২. মধ্যমা (Median) নির্ণয়</summary>
    <div class="details-content">
      <div style="background: rgba(0, 212, 178, 0.05); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #00d4b2; text-align: center; font-size: 1.25rem;">
        $$\text{Median} = L + \left( \frac{\frac{N}{2} - F}{f_m} \right) \times c$$
      </div>
      <p style="margin-top: 1rem;">মধ্যমা শ্রেণী: <strong>৯০-১০০</strong>। মান বসালে:</p>
      <div style="text-align: center; font-size: 1.25rem; font-weight: 700; color: #00d4b2;">
        $$\text{Median} = 90 + \left( \frac{15 - 12}{10} \right) \times 10 = 93 \text{ mg/dL}$$
      </div>
    </div>
  </details>

  <details>
    <summary>৩. প্রচুরক (Mode) নির্ণয়</summary>
    <div class="details-content">
      <div style="background: rgba(0, 212, 178, 0.05); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #00d4b2; text-align: center; font-size: 1.25rem;">
        $$\text{Mode} = L + \left( \frac{f_1 - f_0}{(f_1 - f_0) + (f_1 - f_2)} \right) \times c$$
      </div>
      <p style="margin-top: 1rem;">প্রচুরক শ্রেণী: <strong>৯০-১০০</strong>। মান বসালে:</p>
      <div style="text-align: center; font-size: 1.25rem; font-weight: 700; color: #00d4b2;">
        $$\text{Mode} = 90 + \left( \frac{10 - 8}{(10 - 8) + (10 - 6)} \right) \times 10 = 93.33 \text{ mg/dL}$$
      </div>
    </div>
  </details>

</div>
