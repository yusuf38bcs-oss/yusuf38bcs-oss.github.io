---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Survivorship Curve, Life Table & Growth Models: জীবনের গাণিতিক গল্প"
excerpt: "একটি পপুলেশনের জন্ম, মৃত্যু ও বৃদ্ধির গতিশীলতা কীভাবে গাণিতিক ও প্রাকৃতিক নিয়মে নিয়ন্ত্রিত হয়? Survivorship Curve, Life Table এবং পরিবেশের Carrying Capacity (K)-এর এক গভীর রূপকধর্মী ও গাণিতিক বিশ্লেষণ।"
date: 2026-04-03T15:34:00.000Z
categories:
  - Ecology
tags:
  - Population-Ecology
  - Survivorship-Curve
  - Life-Table
  - Growth-Models
toc: true
toc_label: "চিন্তার মানচিত্র"
toc_icon: "seedling"
classes: wide
node_id: survivorship_curve_life_table_growth_models
---

<style>
  /* =========================================================
     SCOPED ECOLOGY MODULE STYLES (Ecosystem Compliant)
     ========================================================= */
  .ecology-module {
    font-family: 'Inter', 'Tiro Bangla', sans-serif;
    color: #cbd5e1;
    line-height: 1.75;
  }

  /* --- Image Wrapping --- */
  .ecology-module .featured-image-wrapper {
    width: 100%;
    max-width: 900px;
    margin: 0 auto 2.5rem auto;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(0, 212, 178, 0.2);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  .ecology-module .featured-image-wrapper img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }

  /* --- Lecture Header --- */
  .ecology-module .lecture-header {
    background: linear-gradient(135deg, #090d16 0%, #1e293b 100%);
    color: white;
    padding: 2.5rem;
    border-radius: 14px;
    text-align: center;
    margin-bottom: 2rem;
    border: 1px solid rgba(0, 212, 178, 0.15);
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  }

  .ecology-module .lecture-header h1 {
    color: white !important;
    margin: 0 0 10px 0 !important;
    font-size: clamp(1.8rem, 4vw, 2.2rem) !important;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .ecology-module .lecture-header p {
    margin: 5px 0 0 0;
    font-size: 1.1rem;
    color: #00d4b2;
    font-weight: 600;
  }

  .ecology-module .lecture-header .subtitle {
    color: #94a3b8;
    font-size: 1rem;
    line-height: 1.65;
    max-width: 800px;
    margin: 1.5rem auto 0 auto;
    text-align: left;
    font-weight: 400;
  }

  /* --- Quote Blocks --- */
  .ecology-module .thinker-quote {
    background: rgba(255, 255, 255, 0.02);
    border-left: 4px solid #64748b;
    padding: 1.5rem;
    margin: 2.5rem 0;
    border-radius: 0 8px 8px 0;
  }

  /* --- Dashboard Cards --- */
  .ecology-module .dashboard-card {
    background: #0f172a;
    padding: 2.25rem 2rem;
    border-radius: 12px;
    margin: 2.5rem 0;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    border: 1px solid rgba(0, 212, 178, 0.1);
    border-left: 5px solid #00d4b2;
  }

  .ecology-module .dashboard-card h3 {
    color: #ffffff;
    font-size: 1.4rem;
    font-weight: 800;
    margin-top: 0;
    margin-bottom: 1.5rem;
    letter-spacing: -0.01em;
  }

  /* --- System Blocks --- */
  .ecology-module .system-block {
    background: #090d16;
    border: 1px solid rgba(255,255,255,0.02);
    padding: 2rem;
    border-radius: 12px;
    margin: 2rem 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
  }

  .ecology-module .system-block h3 {
    color: #ffffff;
    font-size: 1.4rem;
    font-weight: 800;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  /* --- Math Model Cards --- */
  .ecology-module .math-model-card {
    background: #131c2e;
    border: 1px solid rgba(255,255,255,0.02);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  /* --- Tables --- */
  .ecology-module .table-responsive {
    width: 100%;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  .ecology-module .biostat-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 500px;
  }

  .ecology-module .biostat-table th { 
    background: #131c2e;
    color: #00d4b2; 
    padding: 14px; 
    border: 1px solid rgba(255,255,255,0.05);
    font-weight: 700;
  }
  
  .ecology-module .biostat-table td { 
    border: 1px solid rgba(255,255,255,0.05); 
    padding: 14px; 
    text-align: left; 
  }

  .ecology-module .biostat-table tr:nth-child(even) { background-color: rgba(255,255,255,0.01); }

  /* --- Alerts & Highlights --- */
  .ecology-module .metaphor-node {
    background: rgba(0, 212, 178, 0.04);
    border: 1px solid rgba(0, 212, 178, 0.15);
    border-left: 4px solid #00d4b2;
    padding: 1.25rem;
    border-radius: 6px;
    margin-top: 1.5rem;
  }

  .ecology-module .alert-node {
    background: rgba(239, 68, 68, 0.05);
    border: 1px solid rgba(239, 68, 68, 0.15);
    padding: 14px;
    border-radius: 6px;
    margin-top: 1rem;
    color: #ef4444;
    font-weight: bold;
  }

  /* --- Brainstorming Nodes --- */
  .ecology-module .critical-thinking-matrix {
    background: #0b1324;
    border: 2px dashed rgba(0, 212, 178, 0.3);
    padding: 2rem;
    border-radius: 12px;
    margin-top: 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
</style>

<div class="ecology-module">

  <div class="featured-image-wrapper">
    <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOlxZw-lhodT5l6ZJXsuxT0z0mjuURTHXeMlDGxXhO6Vf2DIjkI3xQWjIA43k20MlawYbadAyIPekZn5SPqTp1hkhIJFQ9dhrSFdgJaWNhfCgjPB3wTDNrTEsytT5EYiF6VVlsNyu6NmrtAzBnTu8d7O822Vo8lzIZqjMqaot3iAoYEDUjW7PRcEDxAck/s800/Survivorship%20curve.webp" alt="Population Ecology Survivorship Curve Models Diagram" loading="lazy">
  </div>

  <div class="lecture-header">
    <h1>🌱 জীবনের গাণিতিক গল্প: জন্ম, মৃত্যু ও বৃদ্ধির রহস্য</h1>
    <p>Survivorship Curve, Life Table & Population Growth Models</p>
    <div class="subtitle">
      একটি নির্দিষ্ট অঞ্চলের পপুলেশন কখন দ্রুত ডানা মেলে বৃদ্ধি পায়, আর কখন তা সম্পদের অভাবে বিলুপ্তির মহাসড়কে যাত্রা করে—এই জটিল ধাঁধার উত্তর লুকিয়ে আছে <strong>Survivorship Curve</strong>, <strong>Life Table</strong> এবং <strong>Growth Models</strong>-এর গাণিতিক সমীকরণে। ইকোলজি কেবল প্রকৃতির সৌন্দর্য উপভোগের খাতা নয়—এটি একটি নিখুঁত <strong>Predictive Science</strong> (পূর্বাভাসমূলক বিজ্ঞান)।
    </div>
  </div>

  <div class="thinker-quote">
    <strong style="color: #ffffff; display: block; margin-bottom: 0.5rem; font-size: 1.05rem;">হে চিন্তাশীল অভিযাত্রী (Active Thinkers):</strong>
    আমি বিশ্বাস করি, জীববিজ্ঞান হলো মহাবিশ্বের সমস্ত তাত্ত্বিক ও ব্যবহারিক ক্ষেত্রের মূল ভিত্তি, আর আমাদের চারপাশের পরিবেশ হলো সেই সত্যগুলোর পরম রণাঙ্গন। অনেকে মনে করেন ইকোলজি বা বাস্তুবিদ্যা কেবল গাছপালা আর পশুপাখির সাধারণ পর্যবেক্ষণ। কিন্তু প্রকৃতপক্ষে, প্রকৃতি এক সুনিপুণ গাণিতিক নিয়মে চলে। 
    <br><br>
    পবিত্র কুরআনে মহান আল্লাহ তাআলা এই মহাজাগতিক ভারসাম্য সম্পর্কে স্পষ্ট গাইডলাইন দিয়েছেন: 
    <blockquote style="color: #00d4b2; font-style: italic; margin: 1rem 0; padding-left: 1rem; border-left: 2px solid rgba(0, 212, 178, 0.3);">
      "তিনিই সমস্ত কিছু সৃষ্টি করেছেন, অতঃপর তা সুনির্দিষ্ট পরিমাপে নির্ধারণ করেছেন।" (সূরা আল-ফুরকান: ২)
    </blockquote> 
    প্রকৃতির এই নিখুঁত পরিমাপ, সম্পদের সীমাবদ্ধতা এবং জীবের জীবনসংগ্রামের সেই সুনির্দিষ্ট প্যাটার্নকে বুঝতে হলে আমাদের ডিকোড করতে হবে পপুলেশন ইকোলজির এই তিনটি বৈজ্ঞানিক স্তম্ভ।
  </div>

  <div class="dashboard-card">
    <h3>🔬 LOLO: Learning Objectives & Outcomes</h3>
    
    <p style="color: #00d4b2; font-weight: 700; margin-bottom: 0.6rem; font-size: 1.1rem;">🎯 শিখনের উদ্দেশ্য (Learning Objectives):</p>
    <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem;">
      <li>Survivorship curve বা বেঁচে থাকার গ্রাফের প্রকারভেদ বিশ্লেষণ করে জীববৈজ্ঞানিক কৌশল (Survival Strategies) ডিকোড করতে পারবে।</li>
      <li>Life table-এর জটিল পরিসংখ্যান ব্যবহার করে একটি পপুলেশনের ভবিষ্যৎ গতিপথ আজ অ্যানালাইসিস করতে পারবে।</li>
      <li>Exponential (সূচকীয়) ও Logistic (লজিস্টিক) বৃদ্ধির গাণিতিক মডেলের মধ্যকার মৌলিক ও ব্যবহারিক পার্থক্য নির্ণয় করতে পারবে।</li>
    </ul>
    
    <p style="color: #00d4b2; font-weight: 700; margin-bottom: 0.6rem; margin-top: 1.5rem; font-size: 1.1rem;">✅ শিখন ফল (Learning Outcomes):</p>
    <ul style="padding-left: 1.25rem; margin: 0; display: flex; flex-direction: column; gap: 0.5rem;">
      <li>বাস্তব জীবনের পপুলেশন ডায়নামিকস (যেমন: মানব পপুলেশন বৃদ্ধি বনাম ব্যাকটেরিয়ার কালচার) ব্যাখ্যা করতে পারবে।</li>
      <li>পরিবেশের ধারণক্ষমতা বা Carrying Capacity-এর ওপর ভিত্তি করে টেকসই উন্নয়ন ও প্রকৃতি সংরক্ষণের সিদ্ধান্ত নিতে পারবে।</li>
    </ul>
  </div>

  <h2>📅 আলোচ্য সূচি নোড</h2>
  <ul>
    <li>📈 <strong>Survivorship Curve:</strong> মৃত্যুর প্যাটার্ন ও জীবনযুদ্ধের স্ট্র্যাটেজি</li>
    <li>📊 <strong>Life Table:</strong> পপুলেশনের নিখুঁত পরিসংখ্যানগত ব্লুপ্রিন্ট</li>
    <li>📉 <strong>Growth Models:</strong> পপুলেশন বৃদ্ধির গাণিতিক ফোরকাস্টিং</li>
  </ul>

  <div class="system-block">
    <h3><span style="color: #00d4b2;">1️⃣</span> Survivorship Curve (জীবনের বেঁচে থাকার গ্রাফ)</h3>
    <p>
      <strong>Survivorship Curve</strong> হলো এমন এক জ্যামিতিক গ্রাফ যা দেখায় একটি নির্দিষ্ট পপুলেশনের কত শতাংশ জীব কোন বয়স পর্যন্ত জীবিত থাকে। বিবর্তনের ধারায় প্রতিটি প্রজাতির টিকে থাকার লড়াই আলাদা এবং এরা প্রধানত ৩টি ফিজিক্যাল স্ট্র্যাটেজি বা লুপ অনুসরণ করে:
    </p>

    

    <div class="table-responsive">
      <table class="biostat-table">
        <thead>
          <tr>
            <th>টাইপ (Type)</th>
            <th style="color: #ffffff;">মৃত্যুর প্যাটার্ন (Mortality Pattern)</th>
            <th>বাস্তুতান্ত্রিক কৌশল (Strategy)</th>
            <th style="color: #ffffff;">বাস্তব উদাহরণ (Real-life Example)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Type I</strong></td>
            <td>জীবনের শেষভাগে উচ্চ মৃত্যুহার (Late Death)</td>
            <td><strong>K-selected:</strong> কম সন্তান উৎপাদন কিন্তু সর্বোচ্চ কেয়ারিং।</td>
            <td>মানুষ, হাতি, তিমি মাছ।</td>
          </tr>
          <tr>
            <td><strong>Type II</strong></td>
            <td>বয়স নির্বিশেষে ধ্রুবক মৃত্যুহার (Constant Death)</td>
            <td><strong>Stable Mortality:</strong> জীবনের প্রতি ধাপে মৃত্যুর ঝুঁকি সমান।</td>
            <td>বিভিন্ন পাখি, হাইড্রা, ছোট স্তন্যপায়ী।</td>
          </tr>
          <tr>
            <td><strong>Type III</strong></td>
            <td>জীবনের শুরুতে ব্যাপক মৃত্যুহার (Early Death)</td>
            <td><strong>r-selected:</strong> লাখ লাখ ডিম/সন্তান উৎপাদন কিন্তু শূন্য অভিভাবকত্ব (লটারি কৌশল)।</td>
            <td>মাছ, ঝিনুক, অধিকাংশ উদ্ভিদ।</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="metaphor-node">
      💡 <strong>মেটাফোরিক্যাল থিংকিং (Metaphor):</strong> Type III প্রজাতিগুলো হলো এক ধরণের "হাই-রিস্ক ওপেন সোর্স ডাটা প্যাকেট" ছড়ানোর মতো। এরা জানে শিকারী ও পরিবেশের কারণে <strong>99%</strong> সন্তান শুরুতেই মারা যাবে, তাই ডাটাবেজ টিকিয়ে রাখতে এরা সংখ্যায় এত বেশি সন্তান জন্ম দেয় যেন অন্তত <strong>1%</strong> বেঁচে থেকে পরবর্তী প্রজন্ম চালু রাখতে পারে।
    </div>
  </div>

  <div class="system-block">
    <h3><span style="color: #00d4b2;">2️⃣</span> Life Table (পপুলেশনের পরিসংখ্যানগত জন্মকুণ্ডলী)</h3>
    <p>
      <strong>Life Table</strong> হলো একটি পপুলেশনের জীবনবীমা কোম্পানির (Actuarial Science) খাতার মতো এক নিখুঁত গাণিতিক ছক। এটি সুনির্দিষ্ট বয়সসীমার জীবের বেঁচে থাকার সম্ভাবনা ($l_x$), মৃত্যুহার ($q_x$) এবং প্রজনন ক্ষমতা ($m_x$) ট্র্যাক করে মূলত দুটি ডেটাপ্যাক বিন্যাসে কাজ করে:
    </p>
    
    <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
      <li><strong style="color: #ffffff;">Cohort Life Table (কোহর্ট লাইফ টেবিল):</strong> একই সময়ে জন্ম নেওয়া একদল জীবকে (Batch) তাদের জন্ম থেকে শুরু করে মৃত্যু পর্যন্ত অনবরত ফলো করে এই ডাটাবেজ তৈরি করা হয়।</li>
      <li><strong style="color: #ffffff;">Static Life Table (স্ট্যাটিক লাইফ টেবিল):</strong> এটি হলো পুরো পপুলেশনের একটি সুনির্দিষ্ট মুহূর্তের স্ন্যাপশট (Snapshot) অ্যানালাইসিস, যেখানে সব বয়সশ্রেণীর জীবের বর্তমান অনুপাত এক নজরে দেখা যায়।</li>
    </ul>

    <div class="metaphor-node">
      📊 <strong>বাস্তব প্রয়োগ:</strong> এই লাইফ টেবিল অ্যানালাইসিস ব্যবহার করেই বন্যপ্রাণী সংরক্ষণবাদীরা সিদ্ধান্ত নেন কোন বয়সের হরিণ বা বাঘকে রক্ষা করা সবচেয়ে বেশি জরুরি, যাতে পপুলেশনের সামগ্রিক গ্রোথ রেট ($R_0$) সচল থাকে।
    </div>
  </div>

  <div class="system-block">
    <h3><span style="color: #00d4b2;">3️⃣</span> Population Growth Models: প্রকৃতির সীমারেখা</h3>
    <p>একটি পপুলেশনের বৃদ্ধির গতিপথ মূলত পরিবেশের সম্পদের প্রাপ্যতা এবং সীমাবদ্ধতার ওপর নির্ভর করে দুটি গাণিতিক মডেলে আবর্তিত হয়:</p>

    <div class="math-model-card" style="border-top-color: #3b82f6;">
      <h4 style="color: #ffffff; font-size: 1.15rem; margin-top: 0; font-weight: 700; margin-bottom: 0.5rem;">📈 ক. সূচকীয় বৃদ্ধি বা Exponential Growth (J Curve) — ইউটোপিয়ান মডেল</h4>
      <p style="color: #94a3b8; font-size: 0.95rem; margin: 0 0 1rem 0;">যদি কোনো পপুলেশনের জন্য খাবার, বাসস্থান ও চিকিৎসা সম্পূর্ণ সীমাহীন (Unlimited Resources) করে দেওয়া হয়, তবে সেখানে জ্যামিতিক হারে পপুলেশন বিস্ফোরণ ঘটে। এর গ্রাফ দেখতে ইংরেজি 'J' অক্ষরের মতো হয়।</p>
      
      <div style="margin: 1.25rem 0; text-align: center; font-size: 1.25rem; color: #3b82f6;">
        $$\frac{dN}{dt} = rN$$
      </div>
      
      <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
        [প্যারামিটার নোড: **N** = পপুলেশনের আকার, **t** = সময়, **r** = প্রজাতিটির অন্তর্নিহিত বৃদ্ধির হার (Intrinsic rate of increase)]
      </p>
    </div>

    

    <div class="math-model-card" style="border-top-color: #00d4b2;">
      <h4 style="color: #ffffff; font-size: 1.15rem; margin-top: 0; font-weight: 700; margin-bottom: 0.5rem;">📉 খ. লজিস্টিক বৃদ্ধি বা Logistic Growth (S Curve) — বাস্তবমুখী মডেল</h4>
      <p style="color: #94a3b8; font-size: 0.95rem; margin: 0 0 1rem 0;">বাস্তব পৃথিবীতে সম্পদ সীমিত। পপুলেশন বাড়ার সাথে সাথে প্রতিযোগিতা বাড়ে এবং একসময় প্রকৃতি তার সর্বোচ্চ সীমারেখায় আঘাত করে, যাকে বলে <strong>Carrying Capacity ($K$)</strong> বা পরিবেশের সর্বোচ্চ ধারণক্ষমতা। এর গ্রাফটি দেখতে ইংরেজি 'S' অক্ষরের মতো (Sigmoid Curve) হয়।</p>
      
      <div style="margin: 1.25rem 0; text-align: center; font-size: 1.25rem; color: #00d4b2;">
        $$\frac{dN}{dt} = rN \left( \frac{K-N}{K} \right)$$
      </div>
      
      <p style="font-size: 0.85rem; color: #64748b; margin: 0;">
        [প্যারামিটার নোড: **K** = Carrying Capacity, এবং $\left( \frac{K-N}{K} \right)$ হলো পরিবেশগত বাধা বা প্রতিরোধ্যতার ফ্যাক্টর (Environmental Resistance)]
      </p>
    </div>

    <div class="alert-node">
      🚨 <strong>পরম বাস্তব সত্য:</strong> কোনো পপুলেশন চিরকাল সূচকীয় (Exponential) হারে বাড়তে পারে না—প্রকৃতি মহামারী, দুর্ভিক্ষ বা সম্পদের বিনাশ ঘটিয়ে তাকে লজিস্টিক বক্ররেখায় আছড়ে ফেলতে বাধ্য করে।
    </div>
  </div>

  <div class="dashboard-card" style="border-left-color: #3b82f6;">
    <h3 style="margin-bottom: 1.25rem;">🧪 LALA: Learning Activities (বাস্তব জীবনের ল্যাব)</h3>
    <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 1rem;">
      <li><strong>Self-Identification:</strong> মানব সভ্যতা সামগ্রিকভাবে কোন টাইপের (Type I, II, নাকি III) সারভাইভারশিপ কার্ভ অনুসরণ করে তা সুনির্দিষ্ট তথ্যের ভিত্তিতে চিহ্নিত করো এবং আদিম মানুষের সাথে আধুনিক মানুষের কার্ভের তুলনামূলক গ্রাফ অঙ্কন করো।</li>
      <li><strong>ডাটা অ্যানালাইসিস:</strong> একটি ক্লোজড পেট্রি ডিশে ব্যাকটেরিয়ার গ্রোথ লজিস্টিক মডেলের কোন ধাপে গিয়ে পুষ্টির অভাবে থমকে দাঁড়ায় এবং রিসোর্স ক্র্যাশ ঘটায়, তার একটি কাল্পনিক ডায়াগ্রাম তৈরি করো।</li>
    </ul>
  </div>

  <div class="critical-thinking-matrix">
    <h3 style="color: #00d4b2; font-size: 1.3rem; font-weight: 700; margin-top: 0; margin-bottom: 1.25rem;">💡 Critical Thinking (উচ্চতর চিন্তার খোরাক)</h3>
    <ol style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem;">
      <li>
        <strong>মানব সভ্যতার প্যারাডক্স:</strong> চিকিৎসা এবং তথ্যপ্রযুক্তির (4IR) অভূতপূর্ব উন্নতির মাধ্যমে মানুষ কি পৃথিবীর প্রাকৃতিক ধারণক্ষমতা বা Carrying Capacity ($K$)-কে কৃত্রিমভাবে প্রতিনিয়ত বাড়িয়ে চলেছে? এই কৃত্রিম বৃদ্ধি কি প্রকৃতির বড় কোনো মারাত্মক প্রতিশোধের (যেমন: নতুন মহামারী বা অনিয়ন্ত্রিত জলবায়ু বিপর্যয়) ইশারা দিচ্ছে?
      </li>
      <li>
        যদি কোনো দ্বীপে হঠাৎ করে বাঘের সংখ্যা তার পরিবেশের ধারণক্ষমতা $K$-কে অতিক্রম করে যায় ($N > K$), তবে লজিস্টিক সমীকরণের $\left( \frac{K-N}{K} \right)$ ফ্যাক্টরটি কীভাবে গাণিতিক ঋণাত্মক মান ধারণ করে বাঘের পপুলেশনকে জোরপূর্বক নিয়ন্ত্রণে নিয়ে আসবে? সমীকরণের যান্ত্রিক অবস্থান বিশ্লেষণ করো।
      </li>
    </ol>
  </div>

  <div class="dashboard-card" style="border-left-color: #64748b; padding: 2rem;">
    <h3 style="font-size: 1.2rem; margin-bottom: 1rem;">📚 References</h3>
    <ul style="padding-left: 1.25rem; color: #94a3b8; display: flex; flex-direction: column; gap: 0.5rem; margin: 0;">
      <li><em>Fundamentals of Ecology</em> — Eugene P. Odum.</li>
      <li><em>Campbell Biology</em> — Eleventh Edition (Ecology Unit).</li>
      <li><em>Ecology: Concepts and Applications</em> — Manuel C. Molles.</li>
    </ul>
  </div>

  {% include components/quiz-render.html quiz_id="genetics" %}

  <p style="text-align: center; font-weight: 700; opacity: 0.5; margin-top: 4rem; font-size: 0.85rem; color: #64748b; letter-spacing: 0.05em;">
    🌱 Learning Biology for Life | Ecology Series 2026 | learningbiologyforlife.org
  </p>

</div>