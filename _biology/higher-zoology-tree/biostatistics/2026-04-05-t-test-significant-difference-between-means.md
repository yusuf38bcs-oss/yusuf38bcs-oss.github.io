---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "T-test: Significant difference between means"
date: 2026-04-05T20:38:00.012Z
categories:
  - Biostatistics
---

<div class="separator" style="clear: both; text-align: center;"><a href="https://blogger.googleusercontent.com/img/a/AVvXsEiNP3n5LF_AvFKrvHN50NVADCV0AH3R7rYNwVDpREy3h_mV5jChNjLEWDFq6wAfruQkiE4irC6UY1PpKVkUrnudOi2VPiU3YDdQS-59eutIwL5TOY3RmUtR5FpmvISLp0k5mA-WKPGvKvta4M3E2-64ZiyDEpZyVAjimEmYesK8DNevcCpDdw3cxB0x0Vk" style="margin-left: 1em; margin-right: 1em;"><img alt="" data-original-height="400" data-original-width="800" height="160" src="https://blogger.googleusercontent.com/img/a/AVvXsEiNP3n5LF_AvFKrvHN50NVADCV0AH3R7rYNwVDpREy3h_mV5jChNjLEWDFq6wAfruQkiE4irC6UY1PpKVkUrnudOi2VPiU3YDdQS-59eutIwL5TOY3RmUtR5FpmvISLp0k5mA-WKPGvKvta4M3E2-64ZiyDEpZyVAjimEmYesK8DNevcCpDdw3cxB0x0Vk" width="320" /></a></div><br />
<html lang="bn">
<head>
<meta charset="UTF-8"></meta>
<meta content="width=device-width, initial-scale=1.0" name="viewport"></meta>
<title>স্টুডেন্ট টি-ডিস্ট্রিবিউশন (Student's t-test) - বায়োস্ট্যাটিস্টিকস</title>

<link href="https://fonts.googleapis.com/css2?family=Tiro+Bangla&amp;family=Inter:wght@400;700&amp;display=swap" rel="stylesheet"></link>

<style>
  /* আপনার আগের সেভ করা কমান্ড অনুযায়ী শুরুতে হাইলাইট ইমেজ ও হিরো সেকশন */
  .feature-hero-junction {
    background: linear-gradient(135deg, rgba(22, 42, 91, 0.9) 0%, rgba(0, 184, 212, 0.8) 100%), 
                url('https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1200');
    background-size: cover;
    background-position: center;
    height: 400px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
    box-shadow: 0 10px 30px rgba(22, 42, 91, 0.2);
    border-bottom: 6px solid #00e5ff;
    overflow: hidden;
  }

  .hero-overlay {
    text-align: center;
    padding: 30px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    max-width: 80%;
  }

  .hero-main-title {
    color: #ffffff !important;
    font-size: 38px !important;
    font-weight: 900 !important;
    margin: 15px 0 !important;
    font-family: 'Tiro Bangla', serif;
  }

  .synaptic-lecture-container {
    max-width: 850px;
    margin: 0 auto;
    font-family: 'Inter', 'Tiro Bangla', sans-serif;
    color: #1f2937;
    line-height: 1.8;
  }

  .lecture-header {
    background: linear-gradient(135deg, #162a5b 0%, #00b8d4 100%);
    color: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    margin-bottom: 25px;
  }

  .intro-box {
    background: #f1f5f9;
    padding: 20px;
    border-left: 5px solid #162a5b;
    margin-bottom: 20px;
    border-radius: 0 10px 10px 0;
  }

  .synaptic-toggle {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    margin-bottom: 15px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
  }

  .synaptic-toggle summary {
    font-weight: 700;
    color: #162a5b;
    cursor: pointer;
    font-size: 20px;
    outline: none;
  }

  .biostat-table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
  }

  .biostat-table th { background: #162a5b; color: white; padding: 12px; }
  .biostat-table td { border: 1px solid #e2e8f0; padding: 10px; text-align: center; }

  .calculation-box {
    background: #e0f7fa;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #00b8d4;
    font-weight: bold;
  }

  .special-note {
    background: #fff9db;
    border: 2px solid #fab005;
    padding: 20px;
    border-radius: 12px;
    margin-top: 30px;
  }

  .cyan-text { color: #00e5ff; }
</style>
</head>
<body>

<div class="synaptic-lecture-container">

  <div class="feature-hero-junction">
    <div class="hero-overlay">
      <h2 class="hero-main-title">স্টুডেন্ট টি-ডিস্ট্রিবিউশন <br /><span class="cyan-text">(Student's t-test)</span></h2>
      <div style="background: #00e5ff; height: 4px; margin: 20px auto; width: 60px;"></div>
      <p style="color: #e0f7fa; font-size: 18px;">একক গড় এবং দুটি গড়ের পার্থক্যের সার্থকতা যাচাই</p>
    </div>
  </div>

  <div class="intro-box">
    <p>উইলিয়াম সিলি গোসেট ১৯০৮ সালে এই পদ্ধতিটি উদ্ভাবন করেন। যখন নমুনার সংখ্যা ছোট হয় <strong>(n &lt; 30)</strong> এবং পপুলেশন স্ট্যান্ডার্ড ডেভিয়েশন জানা থাকে না, তখন এই টেস্টটি ব্যবহার করা হয়।</p>
  </div>

  

[Image of t-distribution curve comparing with normal distribution]


  <details class="synaptic-toggle" open="">
    <summary>১. t-test ব্যবহারের শর্তাবলী (Assumptions)</summary>
    <div style="padding: 15px;">
      <ul>
        <li><strong>নমুনার সংখ্যা (n):</strong> অবশ্যই ৩০-এর কম হতে হবে।</li>
        <li><strong>বন্টন:</strong> উপাত্তগুলো অবশ্যই নরমাল ডিস্ট্রিবিউশন মেনে চলতে হবে।</li>
        <li><strong>স্বাধীন নমুনা:</strong> দুটি গ্রুপের উপাত্ত একে অপরের ওপর নির্ভরশীল হবে না।</li>
      </ul>
    </div>
  </details>

  <details class="synaptic-toggle">
    <summary>২. গাণিতিক উদাহরণ: দুই জাতের ধানের ফলনের তুলনা</summary>
    <div style="padding: 15px;">
      <p><strong>সমস্যা:</strong> ৫% সার্থকতা স্তরে যাচাই করো যে, 'জাত-ক' এবং 'জাত-খ' ধানের ফলনের মধ্যে কোনো উল্লেখযোগ্য পার্থক্য আছে কি না?</p>
      
      <table class="biostat-table">
        <thead>
          <tr>
            <th>জাত-ক (X₁)</th>
            <th>d₁²</th>
            <th>জাত-খ (X₂)</th>
            <th>d₂²</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>২০</td><td>১</td><td>১৮</td><td>১</td></tr>
          <tr><td>২২</td><td>১</td><td>২০</td><td>১</td></tr>
          <tr><td>১৯</td><td>৪</td><td>২১</td><td>৪</td></tr>
          <tr><td>২১</td><td>০</td><td>১৯</td><td>০</td></tr>
          <tr><td>২৩</td><td>৪</td><td>১৭</td><td>৪</td></tr>
        </tbody>
        <tr style="background: #f8fafc; font-weight: bold;">
          <td>ΣX₁ = ১০৫</td>
          <td>Σd₁² = ১০</td>
          <td>ΣX₂ = ৯৫</td>
          <td>Σd₂² = ১০</td>
        </tr>
      </table>
    </div>
  </details>

  <details class="synaptic-toggle" open="">
    <summary>৩. t-মান গণনা ও সিদ্ধান্ত</summary>
    <div style="padding: 15px;">
      <div class="calculation-box">
        <p>Pooled Variance (sₚ²): 2.5</p>
        <p>গণনাকৃত t-মান: 2.0</p>
        <p>স্বাধীনতার মাত্রা (df): 8</p>
      </div>
      
      <div style="background: #fdf2f2; border-radius: 10px; margin-top: 15px; padding: 20px;">
        <h4>ধাপ ৪: চূড়ান্ত সিদ্ধান্ত</h4>
        <p>টেবিল মান (৫% স্তরে, df=8): <strong>২.৩০৬</strong></p>
        <p>যেহেতু গণনাকৃত মান (২.০) &lt; টেবিল মান (২.৩০৬), তাই <strong>নাস্তিক কল্পনা (H₀) বর্জন করা গেল না।</strong></p>
        <p style="border-top: 1px solid #ecc9c9; color: #162a5b; font-weight: bold; padding-top: 10px;">মন্তব্য: দুই জাতের ধানের ফলনের মধ্যে কোনো উল্লেখযোগ্য পার্থক্য নেই।</p>
      </div>
    </div>
  </details>

  

  <div class="special-note">
    <h4>📝 বিশেষ নোট: Degrees of Freedom (df)</h4>
    <p>t-test এ <strong>df</strong> অত্যন্ত গুরুত্বপূর্ণ কারণ এর মাধ্যমেই আমরা সঠিক টেবিল মান খুঁজে পাই। এটি মূলত নমুনার তথ্যের স্বাধীনতার সীমা নির্দেশ করে।</p>
  </div>

</div>
</body>
</html>
