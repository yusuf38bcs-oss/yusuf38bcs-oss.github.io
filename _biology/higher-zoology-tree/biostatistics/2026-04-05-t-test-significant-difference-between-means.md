---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "T-test: Significant difference between means"
date: 2026-04-05T20:38:00.012Z
categories:
  - Biostatistics
tags:
  - Student t-Test
  - Hypothesis Testing
  - Small Sample Theory
  - Biostatistics Lectures
---

<div class="neural-banner-card" style="margin: 1.5em 0; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); background: #0b1329; padding: 10px;">
  <img src="https://blogger.googleusercontent.com/img/a/AVvXsEiNP3n5LF_AvFKrvHN50NVADCV0AH3R7rYNwVDpREy3h_mV5jChNjLEWDFq6wAfruQkiE4irC6UY1PpKVkUrnudOi2VPiU3YDdQS-59eutIwL5TOY3RmUtR5FpmvISLp0k5mA-WKPGvKvta4M3E2-64ZiyDEpZyVAjimEmYesK8DNevcCpDdw3cxB0x0Vk" alt="Student t-Test Analytical Banner Mesh" style="width: 100%; height: auto; display: block; border-radius: 8px;">
</div>

<div class="notice--info" style="background: rgba(0, 212, 178, 0.05); border-left: 4px solid #00d4b2; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 2em;">
  <h3 style="margin: 0; font-family: 'Sovereign-Neural'; color: #00d4b2;"><i class="fas fa-calculator"></i> স্টুডেন্ট টি-টেস্ট (Student's t-Test)</h3>
  <p style="margin: 5px 0 0 0; color: #abb2bf;">ক্ষুদ্র নমুনা তত্ত্বের (Small Sample Theory) অধীনে একক গড় এবং দুটি স্বাধীন নমুনার গড়ের মধ্যকার পার্থক্যের তাৎপর্য যাচাইয়ের গাণিতিক বিশ্লেষণ।</p>
</div>

## 🌐 স্টুডেন্ট টি-ডিস্ট্রিবিউশন-এর পটভূমি

বিখ্যাত পরিসংখ্যানবিদ **উইলিয়াম সিলি গোসেট (William Sealy Gosset)** ১৯০৮ সালে ছদ্মনামে এই কালজয়ী পদ্ধতিটি উদ্ভাবন করেন। জীববৈচিত্র্যের গবেষণায় যখন সংগৃহীত নমুনার আকার অত্যন্ত ছোট হয় এবং পপুলেশনের প্রকৃত আদর্শ বিচ্যুতি ($\sigma$) অজ্ঞাত থাকে, তখন গড়ের তাৎপর্যপূর্ণ পার্থক্য যাচাইয়ের জন্য এই টেস্টটি একটি বৈজ্ঞানিক হাতিয়ার।


---

### ⚠️ ১. t-Test ব্যবহারের প্রধান শর্তাবলী (Assumptions)

টি-টেস্টের গাণিতিক পরিমাপের শুদ্ধতা বজায় রাখতে নিচের প্রমিত শর্তসমূহ পূরণ হওয়া বাধ্যতামূলক:

1. **ক্ষুদ্র নমুনা আকার:** সংগৃহীত নমুনার মোট সংখ্যা ($n$) অবশ্যই **৩০ এর কম** ($n < ৩০$) হতে হবে।
2. **নরমাল বন্টন:** উপাত্তের স্যাম্পলিং বন্টনটি অবশ্যই প্রমিত বা নরমাল ডিস্ট্রিবিউশন (Normal Distribution) মেনে চলবে।
3. **স্বাধীন ও সমভেদাঙ্ক:** পরীক্ষণাধীন গ্রুপ দুটি সম্পূর্ণ স্বাধীন হতে হবে এবং তাদের ভেদাঙ্ক (Variance) প্রায় সমান হতে হবে।

---

## 🧮 ২. গাণিতিক উদাহরণ: দুই জাতের ধানের ফলনের তুলনা

<div class="notice--warning" style="background: rgba(230, 126, 34, 0.04); border-left: 4px solid #e67e22; padding: 15px; border-radius: 0 8px 8px 0; margin: 1.5em 0;">
  <strong>📌 বাস্তব সমস্যা (Case Study):</strong> 
  একটি কৃষি গবেষণা খামারে নিয়ন্ত্রিত দুটি ভিন্ন ব্লকে উৎপাদিত 'জাত-ক' এবং 'জাত-খ' ধানের ফলন (কুইন্টাল/হেক্টর) পরীক্ষা করা হলো। নিচে সংগৃহীত উপাত্তের ভিত্তিতে $৫\%$ সার্থকতা স্তরে ($\alpha = ০.০৫$) যাচাই করো যে, উভয় জাতের ধানের গড় ফলনের মধ্যে কোনো বাস্তব বা উল্লেখযোগ্য পার্থক্য আছে কি না?
</div>

### 📊 উপাত্তের বিন্যাস ও বিচ্যুতি টেবিল

উভয় জাতের নমুনার সংখ্যা $n_1 = ৫$ এবং $n_2 = ৫$। প্রথম জাতের গড় $\bar{X}_1 = \frac{১০৫}{৫} = ২১$ এবং দ্বিতীয় জাতের গড় $\bar{X}_2 = \frac{৯৫}{৫} = ১৯$। গড় থেকে বিচ্যুতির বর্গের তথ্য নিচে ছকে সাজানো হলো:

<table style="width: 100%; border-collapse: collapse; margin: 1.5em 0; text-align: center; font-size: 0.95em; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
  <thead>
    <tr style="background-color: #0b1329; color: #00d4b2; font-weight: bold;">
      <th style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">জাত-ক ($X_1$)</th>
      <th style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">বিচ্যুতির বর্গ ($d_1^2 = (X_1 - \bar{X}_1)^2$)</th>
      <th style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">জাত-খ ($X_2$)</th>
      <th style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">বিচ্যুতির বর্গ ($d_2^2 = (X_2 - \bar{X}_2)^2$)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: rgba(255,255,255,0.02); color: #abb2bf;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$২০$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১৮$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১$</td>
    </tr>
    <tr style="background-color: rgba(0, 212, 178, 0.02); color: #abb2bf;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$২২$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$২০$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১$</td>
    </tr>
    <tr style="background-color: rgba(255,255,255,0.02); color: #abb2bf;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১৯$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$৪$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$২১$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$৪$</td>
    </tr>
    <tr style="background-color: rgba(0, 212, 178, 0.02); color: #abb2bf;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$২১$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$০$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১৯$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$০$</td>
    </tr>
    <tr style="background-color: rgba(255,255,255,0.02); color: #abb2bf;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$২৩$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$৪$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১৭$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$৪$</td>
    </tr>
    <tr style="background-color: #0b1329; color: #00d4b2; font-weight: bold;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">&sum; $X_1 = ১০৫$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">&sum; $d_1^2 = ১০$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">&sum; $X_2 = ৯৫$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">&sum; $d_2^2 = ১০$</td>
    </tr>
  </tbody>
</table>

---

### 🧮 ৩. t-মান গণনা ও গাণিতিক সমীকরণ (Computation)

#### ক. কম্বাইন্ড ভেদাঙ্ক (Pooled Variance - $s_p^2$) নির্ণয়:
$$s_p^2 = \frac{\sum d_1^2 + \sum d_2^2}{n_1 + n_2 - 2}$$

$$s_p^2 = \frac{10 + 10}{5 + 5 - 2} = \frac{20}{8} = 2.5$$

#### খ. t-স্ট্যাটিস্টিক এর মূল সূত্রে মান বসানো:
$$t = \frac{\bar{X}_1 - \bar{X}_2}{\sqrt{s_p^2 \left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$$

$$t = \frac{21 - 19}{\sqrt{2.5 \left(\frac{1}{5} + \frac{1}{5}\right)}} = \frac{2}{\sqrt{2.5 \times 0.4}} = \frac{2}{\sqrt{1.0}} = 2.0$$

* 📊 **গণনাকৃত মান (Calculated t-Value):** $t_{cal} = ২.০$
* 📐 **স্বাধীনতার মাত্রা (Degrees of Freedom - $df$):** $df = n_1 + n_2 - ২ = ৫ + ৫ - ২ = ৮$

---

### ⚖️ ৪. চূড়ান্ত সিদ্ধান্ত ও তাৎপর্য মূল্যায়ন

$৫\%$ সার্থকতা স্তরে ($\alpha = ০.০৫$) এবং $৮$ স্বাধীনতার মাত্রায় ($df = ৮$) দ্বিমুখী পরীক্ষার জন্য পরিসংখ্যানিক টেবিল থেকে প্রাপ্ত t-এর সংকট মান (Critical Table Value) হলো **২.৩০৬**।

<div class="notice--danger" style="background: rgba(231, 76, 60, 0.05); border-left: 4px solid #e74c3c; padding: 15px; border-radius: 0 8px 8px 0; margin: 1.5em 0; text-align: center;">
  <p style="margin: 0; font-size: 1.1em;">যেহেতু আমাদের গণনাকৃত মান ($t_{cal} = ২.০$) সংকট টেবিল মান ($২.৩০৬$) অপেক্ষা ছোট:</p>
  <p style="font-weight: bold; font-size: 1.4em; color: #e74c3c; margin: 10px 0;">$$২.০ < ২.৩০৬$$</p>
  <p style="margin: 0; font-weight: 500;">সুতরাং, আমরা নাস্তিক কল্পনাটি ($H_0$) বর্জন করতে পারছি না (Fail to Reject $H_0$)। অর্থাৎ, নমুনার পার্থক্যটি কেবলই দৈবচয়নের কারণে ঘটেছে।</p>
</div>

<div class="notice--success" style="background: rgba(39, 174, 96, 0.05); border-left: 4px solid #27ae60; padding: 15px; border-radius: 0 8px 8px 0; margin: 1.5em 0;">
  🎉 <strong>চূড়ান্ত বৈজ্ঞানিক মন্তব্য:</strong> পরিসংখ্যানিক বিশ্লেষণে এটি প্রমাণিত হলো যে, 'জাত-ক' এবং 'জাত-খ' ধানের ফলনের মধ্যে বাস্তবিকভাবে <strong>কোনো উল্লেখযোগ্য বা তাৎপর্যপূর্ণ পার্থক্য নেই (Not Statistically Significant)</strong>। উভয় জাতেরই উৎপাদন ক্ষমতা জিনগত ও পরিবেশগতভাবে সমমানের।
</div>

---

### 📝 ৫. বিশেষ নোড: Degrees of Freedom ($df$) এর গুরুত্ব

টি-টেস্টের লাইফসাইকেলে **Degrees of Freedom ($df$)** বা স্বাধীনতার মাত্রা অত্যন্ত গুরুত্বপূর্ণ নোড। এটি মূলত উপাত্তের স্বাধীন চলনের সীমাকে নির্দেশ করে। ক্ষুদ্র নমুনার ক্ষেত্রে বক্ররেখার বিস্তার নমুনার সংখ্যার ওপর সরাসরি সংবেদনশীল হওয়ায় এই $df$ এর নিখুঁত পরিবর্তনের মাধ্যমেই কেবল সঠিক সংকট টেবিল মানটি খুঁজে পাওয়া সম্ভব।