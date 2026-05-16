---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Measures of Central Tendency"
date: 2026-05-05T06:20:00.002Z
categories:
  - biostatistics
description: "Learning Biology for Life - 2026-05-05-measures-of-central-tendency.md"
---
---
<div id="bio-statistics-pro">

<style>
#bio-statistics-pro{
  font-family:'Segoe UI',sans-serif;
  background:#020617;
  color:#e2e8f0;
  max-width:1000px;
  margin:auto;
  padding:25px;
  border-radius:16px;
}

/* Headings */
h1,h2,h3{
  color:#38bdf8;
}

/* Sections */
.section{
  background:#0f172a;
  margin:20px 0;
  border-radius:12px;
  overflow:hidden;
  border:1px solid #1e293b;
}

.section summary{
  padding:18px;
  cursor:pointer;
  font-weight:600;
  font-size:18px;
}

.section .content{
  padding:20px;
  line-height:1.9;
}

/* Boxes */
.box{
  background:#020617;
  border-left:4px solid #38bdf8;
  padding:14px;
  margin:15px 0;
  border-radius:6px;
}

.example{
  background:#022c22;
  border-left:4px solid #22c55e;
}

.note{
  background:#1e293b;
  border-left:4px solid #facc15;
}

/* Table */
table{
  width:100%;
  border-collapse:collapse;
  margin-top:20px;
}

th,td{
  padding:12px;
  border:1px solid #334155;
  text-align:center;
}

th{
  background:#1e293b;
}

/* Highlight */
.highlight{
  color:#facc15;
  font-weight:bold;
}

/* Image */
img{
  width:100%;
  border-radius:10px;
  margin:15px 0;
}
</style>

<h1>📊 পরিসংখ্যানের ভিত্তি ও কেন্দ্রীয় প্রবণতা</h1>

<!-- INTRO -->
<div class="section">
<div class="content">
<h2>🧠 ভূমিকা</h2>
<p>জীববিজ্ঞান, চিকিৎসাবিজ্ঞান ও গবেষণায় পরিসংখ্যান অত্যন্ত গুরুত্বপূর্ণ। ডেটা বিশ্লেষণের মাধ্যমে বাস্তব সিদ্ধান্ত গ্রহণ করা সম্ভব হয়।</p>
</div>
</div>

<!-- BASIC CONCEPT -->
<details class="section" open>
<summary>🔷 মৌলিক ধারণা</summary>
<div class="content">

<h3>📌 Variable (চলক)</h3>
<img src="https://images.openai.com/static-rsc-4/iR_cw1THFjUcPRSP5Vxi9gNTIIIINZ4_mjSqvnkcCTYVU3uBgMUYIYneT-IONVXXCqpBZnjEfIRMhANsJokaoBBHVT_I2rByXzzSKXF0BolarXlwbMo9YxFIUIT22y36bRQsWzusCpz2L-KQtiy72Mw7OKZo-zqMKhZVfRmi8mNHTiLHXlKzUDeuURS-9UYo" />

<p>যে কোনো বৈশিষ্ট্য যার মান পরিবর্তিত হয় তাকে Variable বলে।</p>

<div class="box">
উদাহরণ: উচ্চতা, ওজন, রক্তচাপ
</div>

<ul>
<li>Discrete → নির্দিষ্ট সংখ্যা</li>
<li>Continuous → ধারাবাহিক মান</li>
<li>Independent → নিয়ন্ত্রিত</li>
<li>Dependent → ফলাফল</li>
</ul>

<h3>📌 Data (উপাত্ত)</h3>
<p>Variable-এর মানগুলোই Data।</p>

<div class="box">
150, 155, 160, 165
</div>

<h3>📌 Population (সমগ্রক)</h3>
<p>গবেষণার সকল উপাদান।</p>

<h3>📌 Observation</h3>
<p>প্রতিটি পৃথক মান।</p>

</div>
</details>

<!-- MEAN -->
<details class="section">
<summary>📊 Mean (গড়)</summary>
<div class="content">

<img src="https://images.openai.com/static-rsc-4/V0Gu7-tGSkImEhzloU_k_PbHDRmbPP1w_U76x5kR55M1bURCc82S7wYMHdnvKgYqYeZomDla9NGSiXCO1Ut_s1F-QAf4Imx54aiCMqsBRLaWNjV1M74SebSeuB-3MqlLYjnLCM_kkS2O2ustT2bnH6dxoR2fDySOIfKHNe0bPu5xK8VKwJf9BBqUh19jQw6O" />

<p><b>সংজ্ঞা:</b> সব মানের গড়</p>

<div class="box">Mean = ΣX / n</div>

<div class="example">
10,20,30,40,50 → Mean = <span class="highlight">30</span>
</div>

<div class="note">Outlier দ্বারা প্রভাবিত হয়</div>

</div>
</details>

<!-- MEDIAN -->
<details class="section">
<summary>📊 Median (মধ্যক)</summary>
<div class="content">

<img src="https://images.openai.com/static-rsc-4/eCl6ngiGVN2yNVZedmy20Y_NgOAeLSTGR5ezzlWpBZW8HcELz-8lUKO5SUpQt-5PYjjZGoYa61iH3ZXfqy-lPbLPOzGeolevbZuDh0ivKKVrPHf3GW0KDLtH1rZHHyEgtRTHXRDXw8ow3vLP7f2FeR9sjwCCR_BbgYK3-vB_wI0ajj7Y8nRC4HMxdyLZ-oL4" />

<p><b>সংজ্ঞা:</b> মাঝের মান</p>

<div class="example">
5,10,15,20,25 → <span class="highlight">15</span>
</div>

<div class="example">
5,10,15,20 → <span class="highlight">12.5</span>
</div>

</div>
</details>

<!-- MODE -->
<details class="section">
<summary>📊 Mode (প্রাবল্য)</summary>
<div class="content">

<img src="https://images.openai.com/static-rsc-4/pU4n5aX0mZ_aV1KqYKP1boi_slaWEz10FAxeAzeKzKKTvPihsCnugEc2bHKeaiRMIsH7-N_k_PtFVa6lG6hpmQH82N2q6TtbUoQh5RPsDecqV2wYyLem1Q0dTaEWOSEtZfZYlt-Xoxk-suOpTTIfQey5xTWlxBIENAihYTcgISTDmjSAeuq1BNE0D9-iEG9U" />

<p><b>সংজ্ঞা:</b> সবচেয়ে বেশি আসা মান</p>

<div class="example">
2,4,4,6 → <span class="highlight">4</span>
</div>

</div>
</details>

<!-- COMPARISON -->
<details class="section">
<summary>🔥 তুলনা</summary>
<div class="content">

<table>
<tr>
<th>পরিমাপ</th>
<th>ব্যাখ্যা</th>
<th>বিশেষত্ব</th>
</tr>

<tr>
<td>Mean</td>
<td>গড়</td>
<td>Outlier sensitive</td>
</tr>

<tr>
<td>Median</td>
<td>মাঝের মান</td>
<td>Stable</td>
</tr>

<tr>
<td>Mode</td>
<td>Frequency</td>
<td>Most common</td>
</tr>

</table>

</div>
</details>

<!-- APPLICATION -->
<details class="section">
<summary>🧪 বাস্তব প্রয়োগ</summary>
<div class="content">

<ul>
<li>চিকিৎসা → রক্তচাপ বিশ্লেষণ</li>
<li>জীববিজ্ঞান → বৃদ্ধি হার</li>
<li>অর্থনীতি → আয় বিশ্লেষণ</li>
</ul>

</div>
</details>

<!-- CONCLUSION -->
<div class="section">
<div class="content">

<h2>📎 উপসংহার</h2>
<p>Mean, Median, Mode ডেটা বিশ্লেষণের ভিত্তি। এগুলো একসাথে ব্যবহার করলে সবচেয়ে ভালো ধারণা পাওয়া যায়।</p>

</div>
</div>

</div>