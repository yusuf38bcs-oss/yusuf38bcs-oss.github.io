---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "কাই-বর্গ পরীক্ষা (Chi-square Test)"
date: 2026-04-11T09:53:00.007Z
categories:
  - Biostatistics
node_id: chi_square_test
---

<style>
  /* =========================================================
     SCOPED CHI-SQUARE MODULE STYLES (Ecosystem Compliant)
     ========================================================= */
  .chisquare-module {
    font-family: 'Inter', 'Tiro Bangla', sans-serif;
    width: 100%;
    margin: 0 auto;
    color: #cbd5e1;
  }

  /* --- Cinematic Hero Section --- */
  .chisquare-module .feature-hero-junction {
    background: linear-gradient(135deg, rgba(2, 6, 23, 0.85) 0%, rgba(0, 212, 178, 0.4) 100%), 
                url('https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1200');
    background-size: cover;
    background-position: center;
    height: clamp(250px, 40vh, 380px);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(0, 212, 178, 0.2);
    overflow: hidden;
  }

  .chisquare-module .hero-overlay {
    text-align: center;
    padding: 2rem;
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 90%;
  }

  .chisquare-module .hero-main-title {
    color: #ffffff !important;
    font-size: clamp(1.8rem, 4vw, 2.5rem) !important;
    font-weight: 900 !important;
    margin: 0 0 10px 0 !important;
    line-height: 1.2;
  }

  /* --- Intro & Tip Boxes --- */
  .chisquare-module .intro-box {
    padding: 1.5rem;
    background: rgba(15, 23, 42, 0.6);
    border-left: 4px solid #00d4b2;
    font-size: 1.05rem;
    margin-bottom: 2rem;
    border-radius: 0 8px 8px 0;
    line-height: 1.7;
  }

  .chisquare-module .tip-box {
    background: rgba(59, 130, 246, 0.05);
    border: 1px dashed #3b82f6;
    padding: 1.5rem;
    border-radius: 12px;
    margin-top: 2rem;
  }

  .chisquare-module .tip-box h4 {
    color: #3b82f6;
    margin-top: 0;
    margin-bottom: 0.75rem;
    font-size: 1.15rem;
  }

  /* --- Interactive Accordions --- */
  .chisquare-module details {
    background: #0d1527;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    margin-bottom: 1.25rem;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .chisquare-module details[open] { 
    border-color: rgba(0, 212, 178, 0.3); 
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3); 
  }

  .chisquare-module summary {
    font-weight: 700;
    cursor: pointer;
    color: #ffffff;
    font-size: 1.1rem;
    padding: 1.25rem 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.3s ease;
  }
  
  .chisquare-module summary:hover {
    background: rgba(0, 212, 178, 0.05);
  }

  .chisquare-module summary::-webkit-details-marker { display: none; }
  .chisquare-module summary::after { content: '▼'; color: #00d4b2; font-size: 0.9em; transition: transform 0.3s; }
  .chisquare-module details[open] summary::after { transform: rotate(180deg); }
  
  .chisquare-module .details-content {
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  /* --- Math & Tables --- */
  .chisquare-module .formula-box {
    background: rgba(16, 185, 129, 0.05);
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    font-size: 1.25rem;
    margin: 1.5rem 0;
    border: 1px dashed #10b981;
    color: #10b981;
    font-weight: bold;
    overflow-x: auto;
  }

  .chisquare-module .table-responsive {
    width: 100%;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  .chisquare-module .biostat-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 500px;
  }

  .chisquare-module .biostat-table th { 
    background: rgba(0, 212, 178, 0.1); 
    color: #00d4b2; 
    padding: 12px; 
    border: 1px solid rgba(255,255,255,0.05);
  }
  
  .chisquare-module .biostat-table td { 
    border: 1px solid rgba(255,255,255,0.05); 
    padding: 12px; 
    text-align: center; 
  }
  
  /* Image Fix */
  .chisquare-module .featured-image-wrapper {
    text-align: center;
    margin: 2rem 0;
  }
  .chisquare-module .featured-image-wrapper img {
    border-radius: 12px;
    max-width: 100%;
    height: auto;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
</style>

<div class="chisquare-module">

  <div class="featured-image-wrapper">
    <img src="https://blogger.googleusercontent.com/img/a/AVvXsEgTCqRrk8TmLuAEgUkmepnqVKei-SCf2JxM7vEzGXV2niZWa9T2_di0OPAOWiKNOBEcMiPV7QSIbBG3YHUjYJ8ZTj2GBvnUKCeL2iYtlF2UmiZMcn350VUdbGYvt-zH0QMCvsWTDdZyYJHMXqVbxmshuVe99yAI1vT1KhPnjc3ShHt93UEY_GnbL7Y3dKU" alt="Chi-Square Test Diagram" loading="lazy">
  </div>

  <div class="feature-hero-junction">
    <div class="hero-overlay">
      <h2 class="hero-main-title">কাই-বর্গ পরীক্ষা <br /><span style="color: #00d4b2;">(Chi-square Test)</span></h2>
      <div style="background: #00d4b2; height: 3px; margin: 15px auto; width: 60px; border-radius: 2px;"></div>
      <p style="color: #e2e8f0; font-size: 1.1rem; margin: 0;">গুডনেস অফ ফিট এবং কন্টিনজেন্সি টেবিল বিশ্লেষণ</p>
    </div>
  </div>

  <div class="intro-box">
    অনার্স ৪র্থ বর্ষের জীবপরিসংখ্যান (Biostatistics) কোর্সে <strong>Chi-square ($\chi^2$) test</strong> একটি অত্যন্ত রোমাঞ্চকর বিষয়। বিশেষ করে বংশগতিবিদ্যা বা জেনেটিক্সের (Mendelian Genetics) গবেষণায় এটি অপরিহার্য। ১৯০০ সালে কার্ল পিয়ারসন এই পরীক্ষাটি উদ্ভাবন করেন।
  </div>

  <details open>
    <summary>১. গুডনেস অফ ফিট (Goodness of Fit)</summary>
    <div class="details-content">
      <p>এটি যাচাই করে যে, আমাদের সংগৃহীত উপাত্ত কোনো নির্দিষ্ট তাত্ত্বিক অনুপাতকে (যেমন- মেন্ডেলের ৩:১ অনুপাত) মেনে চলে কি না।</p>
      <div class="formula-box">
        $$\chi^2 = \sum \frac{(O - E)^2}{E}$$
      </div>
      <p>এখানে, $O =$ পর্যবেক্ষণকৃত মান (Observed Value) এবং $E =$ প্রত্যাশিত মান (Expected Value)।</p>
    </div>
  </details>

  <details>
    <summary>📊 গাণিতিক উদাহরণ: মেন্ডেলের মটরশুঁটি পরীক্ষা</summary>
    <div class="details-content">
      <p><strong>সমস্যা:</strong> ৪০০টি গাছের মধ্যে ৩০০টি লম্বা এবং ১০০টি খাটো। এটি কি ৩:১ অনুপাত সমর্থন করে?</p>
      <div class="table-responsive">
        <table class="biostat-table">
          <thead>
            <tr>
              <th>বৈশিষ্ট্য</th>
              <th>$O$ (Observed)</th>
              <th>$E$ (Expected)</th>
              <th>$\frac{(O-E)^2}{E}$</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>লম্বা</td><td>৩০০</td><td>৩০০</td><td>০</td></tr>
            <tr><td>খাটো</td><td>১০০</td><td>১০০</td><td>০</td></tr>
            <tr style="background: rgba(255,255,255,0.02); font-weight: bold; color: #00d4b2;">
              <td colspan="3" style="text-align: right; padding-right: 15px;">মোট $\chi^2$ মান =</td>
              <td>০</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><strong>সিদ্ধান্ত:</strong> যেহেতু গণনাকৃত মান (০) টেবিল মান (৩.৮৪) এর চেয়ে ছোট, তাই এটি মেন্ডেলের তত্ত্বকে নিখুঁতভাবে সমর্থন করে।</p>
    </div>
  </details>

  <details>
    <summary>২. কন্টিনজেন্সি টেবিল (Contingency Table)</summary>
    <div class="details-content">
      <p>যখন দুটি বৈশিষ্ট্যের মধ্যে কোনো সম্পর্ক আছে কি না তা যাচাই করা হয় (যেমন- ধূমপান এবং ফুসফুসের ক্যান্সারের সম্পর্ক), তখন এটি ব্যবহার করা হয়। একে <strong>Test of Independence</strong>-ও বলা হয়।</p>
      <p><strong style="color: #00d4b2;">স্বাধীনতার মাত্রা (Degrees of Freedom):</strong> $df = (r - 1)(c - 1)$</p>
    </div>
  </details>

  <details>
    <summary>⚠️ Chi-square টেস্টের শর্তাবলী</summary>
    <div class="details-content">
      <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 0.5rem;">🔹 মোট নমুনা সংখ্যা ($N$) অন্তত ৫০ হতে হবে।</li>
        <li style="margin-bottom: 0.5rem;">🔹 কোনো সেলের প্রত্যাশিত মান ($E$) ৫-এর কম হওয়া উচিত নয়।</li>
        <li>🔹 উপাত্তগুলো অবশ্যই গণসংখ্যা (Frequency) হতে হবে, কোনো শতাংশ (Percentage) নয়।</li>
      </ul>
    </div>
  </details>

  <div class="tip-box">
    <h4>💡 ব্লগার টিপস:</h4>
    <p style="margin: 0; font-size: 0.95rem; color: #cbd5e1;">আপনার শিক্ষার্থীদের বুঝিয়ে দেবেন যে, <strong>$\chi^2$ এর মান যত কম হবে</strong>, Observed এবং Expected মানের মধ্যে মিল তত বেশি হবে। অর্থাৎ নাল হাইপোথিসিস (Null Hypothesis) গ্রহণ করার সম্ভাবনা বাড়বে।</p>
  </div>

</div>