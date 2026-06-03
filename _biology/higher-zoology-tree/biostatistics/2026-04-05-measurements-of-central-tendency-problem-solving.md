---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Measurements of Central Tendency: Problem Solving"
excerpt: "à§©à§¦ à¦œà¦¨ à¦°à§‹à¦—à§€à¦° à¦°à¦•à§à¦¤à§‡à¦° à¦—à§à¦²à§à¦•à§‹à¦œà§‡à¦° à¦®à¦¾à¦¤à§à¦°à¦¾à¦° à¦‰à¦ªà¦¾à¦¤à§à¦¤ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§‡ à¦¶à§à¦°à§‡à¦£à§€à¦¬à¦¦à§à¦§ à¦‰à¦ªà¦¾à¦¤à§à¦¤à§‡à¦° (Grouped Data) à¦—à¦¾à¦£à¦¿à¦¤à¦¿à¦• à¦—à§œ, à¦®à¦§à§à¦¯à¦®à¦¾ à¦“ à¦ªà§à¦°à¦šà§à¦°à¦• à¦¨à¦¿à¦°à§à¦£à§Ÿà§‡à¦° à¦¸à¦®à§à¦ªà§‚à¦°à§à¦£ à¦¬à¦¾à§Ÿà§‹à¦¸à§à¦Ÿà§à¦¯à¦¾à¦Ÿà¦¿à¦¸à§à¦Ÿà¦¿à¦•à§à¦¯à¦¾à¦² à¦¸à¦®à¦¾à¦§à¦¾à¦¨à¥¤"
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
toc: true
toc_label: "à¦¸à¦®à¦¾à¦§à¦¾à¦¨à§‡à¦° à¦®à¦¾à¦¨à¦šà¦¿à¦¤à§à¦°"
toc_icon: "calculator"
classes: wide

node_id: measurements_of_central_tendency_problem_solving
---

<div style="width: 100%; max-width: 900px; margin: 0 auto 2.5rem auto; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 212, 178, 0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <img src="https://blogger.googleusercontent.com/img/a/AVvXsEhplUtAEV5hYOnMV_Xu7V9JYd_SgWJwj6J6CkKwpmVWNW-gwarMhhC22gH3Jpk6wSfpj3bjG9A1BRXimaNc12lLOEdgeYlPIloxirKWQlFNctlZoFdjanANt3p_w1BmOQ1lZaGd-EfvNBsfU7BMdl-4JZ9_W4D84wnxcqE-TvifFb9kB5l_TAYsYrXzXF4" alt="Biostatistics Data Analytics Central Tendency Math Models" style="width: 100%; height: auto; display: block; object-fit: cover;">
</div>

<div class="summary-master-block" style="background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); padding: 2.5rem; border-radius: 14px; text-align: center; margin-bottom: 2.5rem; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
  <h1 style="color: #ffffff; margin: 0 0 0.75rem 0; font-weight: 800; font-size: 2.2rem; letter-spacing: -0.02em;">ðŸ“Š à¦•à§‡à¦¨à§à¦¦à§à¦°à§€à§Ÿ à¦ªà§à¦°à¦¬à¦£à¦¤à¦¾à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦ª: à¦¶à§à¦°à§‡à¦£à§€à¦¬à¦¦à§à¦§ à¦‰à¦ªà¦¾à¦¤à§à¦¤à§‡à¦° à¦—à¦¾à¦£à¦¿à¦¤à¦¿à¦• à¦¸à¦®à¦¾à¦§à¦¾à¦¨</h1>
  <p style="margin: 0; opacity: 0.9; font-size: 1.1rem; color: #00d4b2; font-weight: 600; letter-spacing: 0.03em;">Biostatistical Analysis: Grouped Data Matrix</p>
</div>

<div class="system-block-layer" style="background: #0f172a; border: 1px solid rgba(0, 212, 178, 0.15); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25); border-left: 5px solid #00d4b2;">
  <p style="color: #ffffff; font-size: 1.2rem; font-weight: 700; margin-top: 0; margin-bottom: 1rem;">ðŸ“Œ à¦¸à¦®à¦¸à§à¦¯à¦¾ à¦‰à¦ªà¦¾à¦¤à§à¦¤ (Problem Dataset):</p>
  <p style="color: #cbd5e1; margin-bottom: 1.5rem;">à§©à§¦ à¦œà¦¨ à¦°à§‹à¦—à§€à¦° à¦°à¦•à§à¦¤à§‡à¦° à¦—à§à¦²à§à¦•à§‹à¦œà§‡à¦° à¦®à¦¾à¦¤à§à¦°à¦¾ ($\text{mg/dL}$) à¦¨à¦¿à¦šà§‡ à¦¦à§‡à¦“à§Ÿà¦¾ à¦¹à¦²à§‹à¥¤ à¦à¦‡ à¦¶à§à¦°à§‡à¦£à§€à¦¬à¦¦à§à¦§ à¦‰à¦ªà¦¾à¦¤à§à¦¤à§‡à¦° à¦—à¦¾à¦£à¦¿à¦¤à¦¿à¦• à¦—à§œ (Mean), à¦®à¦§à§à¦¯à¦®à¦¾ (Median) à¦“ à¦ªà§à¦°à¦šà§à¦°à¦• (Mode) à¦¨à¦¿à¦°à§à¦£à§Ÿ à¦•à¦°à§‹à¥¤</p>
  
  <div style="overflow-x: auto; width: 100%;">
    <table class="premium-matrix-table" style="width: 100%; border-collapse: collapse; font-size: 0.95rem; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
      <thead>
        <tr style="background-color: #131c2e;">
          <th style="color: #00d4b2; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">à¦—à§à¦²à§à¦•à§‹à¦œà§‡à¦° à¦®à¦¾à¦¤à§à¦°à¦¾ (à¦¶à§à¦°à§‡à¦£à§€)</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">à§­à§¦ - à§®à§¦</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">à§®à§¦ - à§¯à§¦</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">à§¯à§¦ - à§§à§¦à§¦</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">à§§à§¦à§¦ - à§§à§§à§¦</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">à§§à§§à§¦ - à§§à§¨à§¦</th>
          <th style="color: #00d4b2; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">à¦®à§‹à¦Ÿ</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ffffff;">à¦°à§‹à¦—à§€à¦° à¦¸à¦‚à¦–à§à¦¯à¦¾ ($f$)</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">à§ª</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">à§®</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">à§§à§¦</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">à§¬</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">à§¨</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00d4b2;">$N = à§©à§¦$</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

---

<div class="interactive-solution-matrix">

  <button class="accordion">à§§. à¦—à¦¾à¦£à¦¿à¦¤à¦¿à¦• à¦—à§œ (Mean) à¦¨à¦¿à¦°à§à¦£à¦¯à¦¼ <span style="color: #00d4b2;">+</span></button>
  <div class="panel">
    <div class="panel-content-inner">
      <p>à¦—à§œ à¦¨à¦¿à¦°à§à¦£à§Ÿà§‡à¦° à¦œà¦¨à§à¦¯ à¦†à¦®à¦¾à¦¦à§‡à¦° à¦¶à§à¦°à§‡à¦£à§€à¦° à¦®à¦§à§à¦¯à¦¬à¦¿à¦¨à§à¦¦à§ ($x$) à¦à¦¬à¦‚ à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾ à¦“ à¦®à¦§à§à¦¯à¦¬à¦¿à¦¨à§à¦¦à§à¦° à¦—à§à¦£à¦«à¦² ($fx$) à¦à¦° à¦®à¦¾à¦¨ à¦¬à§‡à¦° à¦•à¦°à¦¤à§‡ à¦¹à¦¬à§‡à¥¤</p>
      
      <div style="overflow-x: auto; width: 100%;">
        <table class="genetics-table" style="text-align: center;">
          <thead>
            <tr style="background-color: #131c2e;">
              <th style="color: #00d4b2;">à¦¶à§à¦°à§‡à¦£à§€ (Class Interval)</th>
              <th style="color: #ffffff;">à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾ ($f$)</th>
              <th style="color: #ffffff;">à¦®à¦§à§à¦¯à¦¬à¦¿à¦¨à§à¦¦à§ ($x$)</th>
              <th style="color: #00d4b2;">$fx$</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>à§­à§¦ - à§®à§¦</td><td>à§ª</td><td>à§­à§«</td><td>à§©à§¦à§¦</td></tr>
            <tr><td>à§®à§¦ - à§¯à§¦</td><td>à§®</td><td>à§®à§«</td><td>à§¬à§®à§¦</td></tr>
            <tr><td>à§¯à§¦ - à§§à§¦à§¦</td><td>à§§à§¦</td><td>à§¯à§«</td><td>à§¯à§«à§¦</td></tr>
            <tr><td>à§§à§¦à§¦ - à§§à§§à§¦</td><td>à§¬</td><td>à§§à§¦à§«</td><td>à§¬à§©à§¦</td></tr>
            <tr><td>à§§à§§à§¦ - à§§à§¨à§¦</td><td>à§¨</td><td>à§§à§§à§«</td><td>à§¨à§©à§¦</td></tr>
            <tr style="background-color: #131c2e; font-weight: bold;">
              <td style="color: #00d4b2;">à¦®à§‹à¦Ÿ (Total)</td>
              <td style="color: #ffffff;">$N = à§©à§¦$</td>
              <td style="color: #cbd5e1;">-</td>
              <td style="color: #00d4b2;">$\sum fx = à§¨à§­à§¯à§¦$</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="math-model-sub-card" style="background: #131c2e; border: 1px solid rgba(0, 212, 178, 0.15); border-left: 5px solid #00d4b2; padding: 1.25rem; border-radius: 8px; color: #cbd5e1; margin-top: 1.5rem;">
        <strong style="color: #ffffff; display: block; margin-bottom: 0.5rem;">à¦—à§œ à¦¸à§‚à¦¤à§à¦° à¦“ à¦—à¦£à¦¨à¦¾ (Mean Equation):</strong>
        $$\bar{X} = \frac{\sum fx}{N} = \frac{2790}{30} = 93 \text{ mg/dL}$$
      </div>
    </div>
  </div>

  <button class="accordion">à§¨. à¦®à¦§à§à¦¯à¦®à¦¾ (Median) à¦¨à¦¿à¦°à§à¦£à¦¯à¦¼ <span style="color: #00d4b2;">+</span></button>
  <div class="panel">
    <div class="panel-content-inner">
      <p>à¦¶à§à¦°à§‡à¦£à§€à¦¬à¦¦à§à¦§ à¦‰à¦ªà¦¾à¦¤à§à¦¤à§‡à¦° à¦®à¦§à§à¦¯à¦®à¦¾ à¦¨à¦¿à¦°à§à¦£à§Ÿà§‡à¦° à¦œà¦¨à§à¦¯ à¦ªà§à¦°à¦¥à¦®à§‡ à¦•à§à¦°à¦®à¦¯à§‹à¦œà¦¿à¦¤ à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾ (Cumulative Frequency) à¦¸à¦¾à¦°à¦£à§€ à¦¤à§ˆà¦°à¦¿ à¦•à¦°à¦¤à§‡ à¦¹à¦¬à§‡à¥¤</p>
      
      <div style="overflow-x: auto; width: 100%;">
        <table class="genetics-table" style="text-align: center;">
          <thead>
            <tr style="background-color: #131c2e;">
              <th style="color: #ffffff;">à¦¶à§à¦°à§‡à¦£à§€ (Class Interval)</th>
              <th style="color: #ffffff;">à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾ ($f$)</th>
              <th style="color: #00d4b2;">à¦•à§à¦°à¦®à¦¯à§‹à¦œà¦¿à¦¤ à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾ ($cf$)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>à§­à§¦ - à§®à§¦</td><td>à§ª</td><td>à§ª</td></tr>
            <tr><td>à§®à§¦ - à§¯à§¦</td><td>à§®</td><td>à§§à§¨</td></tr>
            <tr style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); font-weight: bold;">
              <td style="color: #00d4b2;">à§¯à§¦ - à§§à§¦à§¦ (à¦®à¦§à§à¦¯à¦®à¦¾ à¦¶à§à¦°à§‡à¦£à§€)</td>
              <td style="color: #ffffff;">à§§à§¦</td>
              <td style="color: #00d4b2;">à§¨à§¨</td>
            </tr>
            <tr><td>à§§à§¦à§¦ - à§§à§§à§¦</td><td>à§¬</td><td>à§¨à§®</td></tr>
            <tr><td>à§§à§§à§¦ - à§§à§¨à§¦</td><td>à§¨</td><td>à§©à§¦</td></tr>
          </tbody>
        </table>
      </div>

      <div class="math-model-sub-card" style="background: #131c2e; border: 1px solid rgba(255, 255, 255, 0.02); padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0 1rem 0; border-top: 4px solid #3b82f6;">
        <strong style="color: #ffffff; display: block; margin-bottom: 0.75rem;">à¦®à¦§à§à¦¯à¦®à¦¾ à¦¸à§‚à¦¤à§à¦° (Median Formula):</strong>
        $$\text{Median} = L + \left( \frac{\frac{N}{2} - F}{f_m} \right) \times c$$
      </div>

      <p style="font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">à¦ªà§à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° à¦¬à¦¿à¦¶à§à¦²à§‡à¦·à¦£:</p>
      <ul style="padding-left: 1.25rem; color: #94a3b8; display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1.5rem;">
        <li>$\frac{N}{2} = \frac{30}{2} = 15$ (à¦®à¦¾à¦¨à¦Ÿà¦¿ $cf$ à¦¸à¦¾à¦°à¦£à§€à¦° à§¨à§¨ à¦à¦° à¦…à¦­à§à¦¯à¦¨à§à¦¤à¦°à§‡ à¦…à¦¬à¦¸à§à¦¥à¦¿à¦¤, à¦¤à¦¾à¦‡ à¦®à¦§à§à¦¯à¦®à¦¾ à¦¶à§à¦°à§‡à¦£à§€ à¦¹à¦²à§‹: <b>à§¯à§¦ - à§§à§¦à§¦</b>)</li>
        <li>$L$ (à¦®à¦§à§à¦¯à¦®à¦¾ à¦¶à§à¦°à§‡à¦£à§€à¦° à¦¨à¦¿à¦®à§à¦¨à¦¸à§€à¦®à¦¾) = $90$</li>
        <li>$F$ (à¦®à¦§à§à¦¯à¦®à¦¾ à¦¶à§à¦°à§‡à¦£à§€à¦° à¦ªà§‚à¦°à§à¦¬à¦¬à¦°à§à¦¤à§€ à¦¶à§à¦°à§‡à¦£à§€à¦° à¦•à§à¦°à¦®à¦¯à§‹à¦œà¦¿à¦¤ à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾) = $12$</li>
        <li>$f_m$ (à¦®à¦§à§à¦¯à¦®à¦¾ à¦¶à§à¦°à§‡à¦£à§€à¦° à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾) = $10$</li>
        <li>$c$ (à¦¶à§à¦°à§‡à¦£à§€ à¦¬à§à¦¯à¦¬à¦§à¦¾à¦¨) = $10$</li>
      </ul>

      <div style="background: rgba(0, 212, 178, 0.03); border: 1px solid rgba(0, 212, 178, 0.2); padding: 1rem; border-radius: 6px; text-align: center; color: #ffffff; font-weight: 600;">
        $$\text{Median} = 90 + \left( \frac{15 - 12}{10} \right) \times 10 = 90 + 3 = 93 \text{ mg/dL}$$
      </div>
    </div>
  </div>

  <button class="accordion">à§©. à¦ªà§à¦°à¦šà§à¦°à¦• (Mode) à¦¨à¦¿à¦°à§à¦£à¦¯à¦¼ <span style="color: #00d4b2;">+</span></button>
  <div class="panel">
    <div class="panel-content-inner">
      <p>à¦ªà§à¦°à¦¦à¦¤à§à¦¤ à¦‰à¦ªà¦¾à¦¤à§à¦¤à§‡ à¦¸à¦°à§à¦¬à§‹à¦šà§à¦š à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾ <strong>à§§à§¦</strong> à¦¬à¦¾à¦° à¦°à§Ÿà§‡à¦›à§‡ <strong>'à§¯à§¦ - à§§à§¦à§¦'</strong> à¦¶à§à¦°à§‡à¦£à§€à¦¤à§‡à¥¤ à¦…à¦¤à¦à¦¬, à¦ªà§à¦°à¦šà§à¦°à¦• à¦¶à§à¦°à§‡à¦£à§€ à¦¹à¦²à§‹ <b>à§¯à§¦ - à§§à§¦à§¦</b>à¥¤</p>
      
      <div class="math-model-sub-card" style="background: #131c2e; border: 1px solid rgba(255, 255, 255, 0.02); padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0 1rem 0; border-top: 4px solid #3b82f6;">
        <strong style="color: #ffffff; display: block; margin-bottom: 0.75rem;">à¦ªà§à¦°à¦šà§à¦°à¦• à¦¸à§‚à¦¤à§à¦° (Mode Formula):</strong>
        $$\text{Mode} = L + \left( \frac{f_1 - f_0}{(f_1 - f_0) + (f_1 - f_2)} \right) \times c$$
      </div>

      <p style="font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">à¦ªà§à¦¯à¦¾à¦°à¦¾à¦®à¦¿à¦Ÿà¦¾à¦° à¦¬à¦¿à¦¶à§à¦²à§‡à¦·à¦£:</p>
      <ul style="padding-left: 1.25rem; color: #94a3b8; display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1.5rem;">
        <li>$L$ (à¦ªà§à¦°à¦šà§à¦°à¦• à¦¶à§à¦°à§‡à¦£à§€à¦° à¦¨à¦¿à¦®à§à¦¨à¦¸à§€à¦®à¦¾) = $90$</li>
        <li>$f_1$ (à¦ªà§à¦°à¦šà§à¦°à¦• à¦¶à§à¦°à§‡à¦£à§€à¦° à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾) = $10$</li>
        <li>$f_0$ (à¦ªà§à¦°à¦šà§à¦°à¦• à¦¶à§à¦°à§‡à¦£à§€à¦° à¦ªà§‚à¦°à§à¦¬à¦¬à¦°à§à¦¤à§€ à¦¶à§à¦°à§‡à¦£à§€à¦° à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾) = $8$</li>
        <li>$f_2$ (à¦ªà§à¦°à¦šà§à¦°à¦• à¦¶à§à¦°à§‡à¦£à§€à¦° à¦ªà¦°à¦¬à¦°à§à¦¤à§€ à¦¶à§à¦°à§‡à¦£à§€à¦° à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾) = $6$</li>
        <li>$c$ (à¦¶à§à¦°à§‡à¦£à§€ à¦¬à§à¦¯à¦¬à¦§à¦¾à¦¨) = $10$</li>
      </ul>

      <div style="background: rgba(0, 212, 178, 0.03); border: 1px solid rgba(0, 212, 178, 0.2); padding: 1rem; border-radius: 6px; text-align: center; color: #ffffff; font-weight: 600;">
        $$\text{Mode} = 90 + \left( \frac{10 - 8}{(10 - 8) + (10 - 6)} \right) \times 10 = 90 + \left( \frac{2}{2 + 4} \right) \times 10 = 93.33 \text{ mg/dL}$$
      </div>
    </div>
  </div>

</div>

---

<div class="critical-thinking-matrix" style="background: #0b1324; border: 2px dashed rgba(0, 212, 178, 0.3); padding: 25px; border-radius: 12px; margin-top: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
  <h3 style="color: #00d4b2; font-size: 1.3rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">ðŸ“Š à¦¬à¦¿à¦¶à§à¦²à§‡à¦·à¦£ à¦“ à¦—à¦¾à¦£à¦¿à¦¤à¦¿à¦• à¦¸à¦¿à¦¦à§à¦§à¦¾à¦¨à§à¦¤ (Biostatistical Analysis)</h3>
  <p style="color: #cbd5e1; line-height: 1.75; margin: 0;">
    à¦¯à§‡à¦¹à§‡à¦¤à§ à¦à¦‡ à¦šà¦¿à¦•à¦¿à§Žà¦¸à¦¾à¦¬à¦¿à¦œà§à¦žà¦¾à¦¨ à¦¸à¦‚à¦•à§à¦°à¦¾à¦¨à§à¦¤ à¦‰à¦ªà¦¾à¦¤à§à¦¤à§‡ à¦—à¦£à¦¨à¦¾à¦•à§ƒà¦¤ à¦—à¦¾à¦£à¦¿à¦¤à¦¿à¦• à¦—à§œ ($\text{Mean} = à§¯à§©$), à¦®à¦§à§à¦¯à¦®à¦¾ ($\text{Median} = à§¯à§©$) à¦à¦¬à¦‚ à¦ªà§à¦°à¦šà§à¦°à¦• ($\text{Mode} = à§¯à§©.à§©à§©$) à¦ªà¦°à¦¸à§à¦ªà¦° à¦ªà§à¦°à¦¾à§Ÿ à¦¸à¦®à¦¾à¦¨ ($\text{Mean} \approx \text{Median} \approx \text{Mode}$), à¦¸à§‡à¦¹à§‡à¦¤à§ à¦†à¦®à¦°à¦¾ à¦¸à¦¿à¦¦à§à¦§à¦¾à¦¨à§à¦¤ à¦¨à¦¿à¦¤à§‡ à¦ªà¦¾à¦°à¦¿ à¦¯à§‡ à¦‰à¦ªà¦¾à¦¤à§à¦¤à¦Ÿà¦¿ à¦à¦•à¦Ÿà¦¿ à¦¨à¦¿à¦–à§à¦à¦¤ <strong>Symmetrical Distribution</strong> à¦¬à¦¾ à¦¸à§à¦·à¦® à¦¸à§à¦¬à¦¾à¦­à¦¾à¦¬à¦¿à¦• à¦¬à¦¿à¦¨à§à¦¯à¦¾à¦¸ (Normal Distribution Curve) à¦ªà§à¦°à¦¦à¦°à§à¦¶à¦¨ à¦•à¦°à§‡à¥¤
  </p>
</div>

---

<div class="lolo-dashboard-card" style="background: #0f172a; padding: 2rem; border-radius: 12px; margin: 2.5rem 0; border: 1px solid rgba(255,255,255,0.03); box-shadow: 0 4px 15px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.2rem; font-weight: 800; margin-top: 0; margin-bottom: 1rem;">ðŸ“š à¦°à§‡à¦«à¦¾à¦°à§‡à¦¨à§à¦¸ (References)</h3>
  <ul style="padding-left: 1.25rem; color: #94a3b8; display: flex; flex-direction: column; gap: 0.4rem; margin: 0; font-size: 0.95rem;">
    <li>Zar, J. H. (2010). <em>Biostatistical Analysis</em>.</li>
    <li>Mahajan, B. K. (2010). <em>Methods in Biostatistics</em>.</li>
  </ul>
</div>

<script>
    (function() {
        var acc = document.getElementsByClassName("accordion");
        for (var i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                for (var j = 0; j < acc.length; j++) {
                    if (acc[j] !== this) {
                        acc[j].classList.remove("active");
                        acc[j].nextElementSibling.style.display = "none";
                        var indicator = acc[j].querySelector('span');
                        if(indicator) indicator.innerHTML = "+";
                    }
                }
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                var currentIndicator = this.querySelector('span');
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                    if(currentIndicator) currentIndicator.innerHTML = "+";
                } else {
                    panel.style.display = "block";
                    if(currentIndicator) currentIndicator.innerHTML = "-";
                }
            });
        }
    })();
</script>

<style>
    /* Premium Collapsible Layout Module Styles matching global site parameters */
    .accordion { 
        background-color: #0f172a; 
        color: #ffffff; 
        cursor: pointer; 
        padding: 18px 22px; 
        width: 100%; 
        border: 1px solid rgba(255,255,255,0.04); 
        text-align: left; 
        outline: none; 
        font-size: 1.15rem; 
        font-weight: 700; 
        transition: 0.2s all ease-in-out; 
        border-radius: 8px; 
        margin-top: 14px; 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        user-select: none;
    }
    .accordion.active, .accordion:hover { 
        background-color: #131c2e; 
        color: #00d4b2; 
        border-color: rgba(0, 212, 178, 0.25); 
    }
    .panel { 
        padding: 0 10px; 
        display: none; 
        background-color: #090d16; 
        border: 1px solid rgba(0, 212, 178, 0.15); 
        border-top: none; 
        border-radius: 0 0 8px 8px; 
        overflow: hidden; 
    }
    .panel-content-inner { 
        padding: 25px 15px; 
        line-height: 1.85; 
        color: #cbd5e1;
    }
    .panel-content-inner p { margin: 0 0 1.25rem 0; }
    .panel-content-inner ul { margin: 0 0 1.25rem 0; }
    
    .genetics-table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 10px 0; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.05);
        font-size: 0.95rem;
    }
    .genetics-table th, .genetics-table td { 
        border: 1px solid rgba(255,255,255,0.05); 
        padding: 14px; 
        text-align: left; 
    }
    .genetics-table td { color: #cbd5e1; }
    .genetics-table tr:nth-child(even) { background-color: rgba(255,255,255,0.01); }
</style>

