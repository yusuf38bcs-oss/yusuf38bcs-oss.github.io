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
toc: true
toc_label: "সমাধানের মানচিত্র"
toc_icon: "calculator"
classes: wide
---

<div style="width: 100%; max-width: 900px; margin: 0 auto 2.5rem auto; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 212, 178, 0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <img src="https://blogger.googleusercontent.com/img/a/AVvXsEhplUtAEV5hYOnMV_Xu7V9JYd_SgWJwj6J6CkKwpmVWNW-gwarMhhC22gH3Jpk6wSfpj3bjG9A1BRXimaNc12lLOEdgeYlPIloxirKWQlFNctlZoFdjanANt3p_w1BmOQ1lZaGd-EfvNBsfU7BMdl-4JZ9_W4D84wnxcqE-TvifFb9kB5l_TAYsYrXzXF4" alt="Biostatistics Data Analytics Central Tendency Math Models" style="width: 100%; height: auto; display: block; object-fit: cover;">
</div>

<div class="summary-master-block" style="background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); padding: 2.5rem; border-radius: 14px; text-align: center; margin-bottom: 2.5rem; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
  <h1 style="color: #ffffff; margin: 0 0 0.75rem 0; font-weight: 800; font-size: 2.2rem; letter-spacing: -0.02em;">📊 কেন্দ্রীয় প্রবণতার পরিমাপ: শ্রেণীবদ্ধ উপাত্তের গাণিতিক সমাধান</h1>
  <p style="margin: 0; opacity: 0.9; font-size: 1.1rem; color: #00d4b2; font-weight: 600; letter-spacing: 0.03em;">Biostatistical Analysis: Grouped Data Matrix</p>
</div>

<div class="system-block-layer" style="background: #0f172a; border: 1px solid rgba(0, 212, 178, 0.15); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25); border-left: 5px solid #00d4b2;">
  <p style="color: #ffffff; font-size: 1.2rem; font-weight: 700; margin-top: 0; margin-bottom: 1rem;">📌 সমস্যা উপাত্ত (Problem Dataset):</p>
  <p style="color: #cbd5e1; margin-bottom: 1.5rem;">৩০ জন রোগীর রক্তের গ্লুকোজের মাত্রা ($\text{mg/dL}$) নিচে দেওয়া হলো। এই শ্রেণীবদ্ধ উপাত্তের গাণিতিক গড় (Mean), মধ্যমা (Median) ও প্রচুরক (Mode) নির্ণয় করো।</p>
  
  <div style="overflow-x: auto; width: 100%;">
    <table class="premium-matrix-table" style="width: 100%; border-collapse: collapse; font-size: 0.95rem; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
      <thead>
        <tr style="background-color: #131c2e;">
          <th style="color: #00d4b2; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">গ্লুকোজের মাত্রা (শ্রেণী)</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">৭০ - ৮০</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">৮০ - ৯০</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">৯০ - ১০০</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">১০০ - ১১০</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">১১০ - ১২০</th>
          <th style="color: #00d4b2; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">মোট</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #ffffff;">রোগীর সংখ্যা ($f$)</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৪</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৮</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">১০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৬</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">২</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #00d4b2;">$N = ৩০$</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

---

<div class="interactive-solution-matrix">

  <button class="accordion">১. গাণিতিক গড় (Mean) নির্ণয় <span style="color: #00d4b2;">+</span></button>
  <div class="panel">
    <div class="panel-content-inner">
      <p>গড় নির্ণয়ের জন্য আমাদের শ্রেণীর মধ্যবিন্দু ($x$) এবং গণসংখ্যা ও মধ্যবিন্দুর গুণফল ($fx$) এর মান বের করতে হবে।</p>
      
      <div style="overflow-x: auto; width: 100%;">
        <table class="genetics-table" style="text-align: center;">
          <thead>
            <tr style="background-color: #131c2e;">
              <th style="color: #00d4b2;">শ্রেণী (Class Interval)</th>
              <th style="color: #ffffff;">গণসংখ্যা ($f$)</th>
              <th style="color: #ffffff;">মধ্যবিন্দু ($x$)</th>
              <th style="color: #00d4b2;">$fx$</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>৭০ - ৮০</td><td>৪</td><td>৭৫</td><td>৩০০</td></tr>
            <tr><td>৮০ - ৯০</td><td>৮</td><td>৮৫</td><td>৬৮০</td></tr>
            <tr><td>৯০ - ১০০</td><td>১০</td><td>৯৫</td><td>৯৫০</td></tr>
            <tr><td>১০০ - ১১০</td><td>৬</td><td>১০৫</td><td>৬৩০</td></tr>
            <tr><td>১১০ - ১২০</td><td>২</td><td>১১৫</td><td>২৩০</td></tr>
            <tr style="background-color: #131c2e; font-weight: bold;">
              <td style="color: #00d4b2;">মোট (Total)</td>
              <td style="color: #ffffff;">$N = ৩০$</td>
              <td style="color: #cbd5e1;">-</td>
              <td style="color: #00d4b2;">$\sum fx = ২৭৯০$</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="math-model-sub-card" style="background: #131c2e; border: 1px solid rgba(0, 212, 178, 0.15); border-left: 5px solid #00d4b2; padding: 1.25rem; border-radius: 8px; color: #cbd5e1; margin-top: 1.5rem;">
        <strong style="color: #ffffff; display: block; margin-bottom: 0.5rem;">গড় সূত্র ও গণনা (Mean Equation):</strong>
        $$\bar{X} = \frac{\sum fx}{N} = \frac{2790}{30} = 93 \text{ mg/dL}$$
      </div>
    </div>
  </div>

  <button class="accordion">২. মধ্যমা (Median) নির্ণয় <span style="color: #00d4b2;">+</span></button>
  <div class="panel">
    <div class="panel-content-inner">
      <p>শ্রেণীবদ্ধ উপাত্তের মধ্যমা নির্ণয়ের জন্য প্রথমে ক্রমযোজিত গণসংখ্যা (Cumulative Frequency) সারণী তৈরি করতে হবে।</p>
      
      <div style="overflow-x: auto; width: 100%;">
        <table class="genetics-table" style="text-align: center;">
          <thead>
            <tr style="background-color: #131c2e;">
              <th style="color: #ffffff;">শ্রেণী (Class Interval)</th>
              <th style="color: #ffffff;">গণসংখ্যা ($f$)</th>
              <th style="color: #00d4b2;">ক্রমযোজিত গণসংখ্যা ($cf$)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>৭০ - ৮০</td><td>৪</td><td>৪</td></tr>
            <tr><td>৮০ - ৯০</td><td>৮</td><td>১২</td></tr>
            <tr style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); font-weight: bold;">
              <td style="color: #00d4b2;">৯০ - ১০০ (মধ্যমা শ্রেণী)</td>
              <td style="color: #ffffff;">১০</td>
              <td style="color: #00d4b2;">২২</td>
            </tr>
            <tr><td>১০০ - ১১০</td><td>৬</td><td>২৮</td></tr>
            <tr><td>১১০ - ১২০</td><td>২</td><td>৩০</td></tr>
          </tbody>
        </table>
      </div>

      <div class="math-model-sub-card" style="background: #131c2e; border: 1px solid rgba(255, 255, 255, 0.02); padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0 1rem 0; border-top: 4px solid #3b82f6;">
        <strong style="color: #ffffff; display: block; margin-bottom: 0.75rem;">মধ্যমা সূত্র (Median Formula):</strong>
        $$\text{Median} = L + \left( \frac{\frac{N}{2} - F}{f_m} \right) \times c$$
      </div>

      <p style="font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">প্যারামিটার বিশ্লেষণ:</p>
      <ul style="padding-left: 1.25rem; color: #94a3b8; display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1.5rem;">
        <li>$\frac{N}{2} = \frac{30}{2} = 15$ (মানটি $cf$ সারণীর ২২ এর অভ্যন্তরে অবস্থিত, তাই মধ্যমা শ্রেণী হলো: <b>৯০ - ১০০</b>)</li>
        <li>$L$ (মধ্যমা শ্রেণীর নিম্নসীমা) = $90$</li>
        <li>$F$ (মধ্যমা শ্রেণীর পূর্ববর্তী শ্রেণীর ক্রমযোজিত গণসংখ্যা) = $12$</li>
        <li>$f_m$ (মধ্যমা শ্রেণীর গণসংখ্যা) = $10$</li>
        <li>$c$ (শ্রেণী ব্যবধান) = $10$</li>
      </ul>

      <div style="background: rgba(0, 212, 178, 0.03); border: 1px solid rgba(0, 212, 178, 0.2); padding: 1rem; border-radius: 6px; text-align: center; color: #ffffff; font-weight: 600;">
        $$\text{Median} = 90 + \left( \frac{15 - 12}{10} \right) \times 10 = 90 + 3 = 93 \text{ mg/dL}$$
      </div>
    </div>
  </div>

  <button class="accordion">৩. প্রচুরক (Mode) নির্ণয় <span style="color: #00d4b2;">+</span></button>
  <div class="panel">
    <div class="panel-content-inner">
      <p>প্রদত্ত উপাত্তে সর্বোচ্চ গণসংখ্যা <strong>১০</strong> বার রয়েছে <strong>'৯০ - ১০০'</strong> শ্রেণীতে। অতএব, প্রচুরক শ্রেণী হলো <b>৯০ - ১০০</b>।</p>
      
      <div class="math-model-sub-card" style="background: #131c2e; border: 1px solid rgba(255, 255, 255, 0.02); padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0 1rem 0; border-top: 4px solid #3b82f6;">
        <strong style="color: #ffffff; display: block; margin-bottom: 0.75rem;">প্রচুরক সূত্র (Mode Formula):</strong>
        $$\text{Mode} = L + \left( \frac{f_1 - f_0}{(f_1 - f_0) + (f_1 - f_2)} \right) \times c$$
      </div>

      <p style="font-weight: 700; color: #ffffff; margin-bottom: 0.5rem;">প্যারামিটার বিশ্লেষণ:</p>
      <ul style="padding-left: 1.25rem; color: #94a3b8; display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1.5rem;">
        <li>$L$ (প্রচুরক শ্রেণীর নিম্নসীমা) = $90$</li>
        <li>$f_1$ (প্রচুরক শ্রেণীর গণসংখ্যা) = $10$</li>
        <li>$f_0$ (প্রচুরক শ্রেণীর পূর্ববর্তী শ্রেণীর গণসংখ্যা) = $8$</li>
        <li>$f_2$ (প্রচুরক শ্রেণীর পরবর্তী শ্রেণীর গণসংখ্যা) = $6$</li>
        <li>$c$ (শ্রেণী ব্যবধান) = $10$</li>
      </ul>

      <div style="background: rgba(0, 212, 178, 0.03); border: 1px solid rgba(0, 212, 178, 0.2); padding: 1rem; border-radius: 6px; text-align: center; color: #ffffff; font-weight: 600;">
        $$\text{Mode} = 90 + \left( \frac{10 - 8}{(10 - 8) + (10 - 6)} \right) \times 10 = 90 + \left( \frac{2}{2 + 4} \right) \times 10 = 93.33 \text{ mg/dL}$$
      </div>
    </div>
  </div>

</div>

---

<div class="critical-thinking-matrix" style="background: #0b1324; border: 2px dashed rgba(0, 212, 178, 0.3); padding: 25px; border-radius: 12px; margin-top: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
  <h3 style="color: #00d4b2; font-size: 1.3rem; font-weight: 700; margin-top: 0; margin-bottom: 0.75rem;">📊 বিশ্লেষণ ও গাণিতিক সিদ্ধান্ত (Biostatistical Analysis)</h3>
  <p style="color: #cbd5e1; line-height: 1.75; margin: 0;">
    যেহেতু এই চিকিৎসাবিজ্ঞান সংক্রান্ত উপাত্তে গণনাকৃত গাণিতিক গড় ($\text{Mean} = ৯৩$), মধ্যমা ($\text{Median} = ৯৩$) এবং প্রচুরক ($\text{Mode} = ৯৩.৩৩$) পরস্পর প্রায় সমান ($\text{Mean} \approx \text{Median} \approx \text{Mode}$), সেহেতু আমরা সিদ্ধান্ত নিতে পারি যে উপাত্তটি একটি নিখুঁত <strong>Symmetrical Distribution</strong> বা সুষম স্বাভাবিক বিন্যাস (Normal Distribution Curve) প্রদর্শন করে।
  </p>
</div>

---

<div class="lolo-dashboard-card" style="background: #0f172a; padding: 2rem; border-radius: 12px; margin: 2.5rem 0; border: 1px solid rgba(255,255,255,0.03); box-shadow: 0 4px 15px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.2rem; font-weight: 800; margin-top: 0; margin-bottom: 1rem;">📚 রেফারেন্স (References)</h3>
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
