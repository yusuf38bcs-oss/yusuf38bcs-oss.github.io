---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Hypothesis Testing (নাস্তিক ও বিকল্প কল্পনা)"
date: 2026-04-05T20:12:00.011Z
categories:
  - Biostatistics
---

<div class="separator" style="clear: both; text-align: center;"><a href="https://blogger.googleusercontent.com/img/a/AVvXsEhplUtAEV5hYOnMV_Xu7V9JYd_SgWJwj6J6CkKwpmVWNW-gwarMhhC22gH3Jpk6wSfpj3bjG9A1BRXimaNc12lLOEdgeYlPIloxirKWQlFNctlZoFdjanANt3p_w1BmOQ1lZaGd-EfvNBsfU7BMdl-4JZ9_W4D84wnxcqE-TvifFb9kB5l_TAYsYrXzXF4" style="margin-left: 1em; margin-right: 1em;"><img alt="" data-original-height="559" data-original-width="1024" height="175" src="https://blogger.googleusercontent.com/img/a/AVvXsEhplUtAEV5hYOnMV_Xu7V9JYd_SgWJwj6J6CkKwpmVWNW-gwarMhhC22gH3Jpk6wSfpj3bjG9A1BRXimaNc12lLOEdgeYlPIloxirKWQlFNctlZoFdjanANt3p_w1BmOQ1lZaGd-EfvNBsfU7BMdl-4JZ9_W4D84wnxcqE-TvifFb9kB5l_TAYsYrXzXF4" width="320" /></a></div><br />
<html lang="bn">
<head>
<meta charset="UTF-8"></meta>
<meta content="width=device-width, initial-scale=1.0" name="viewport"></meta>
<title>নাস্তিক ও বিকল্প কল্পনা (Hypothesis Testing) - বায়োস্ট্যাটিস্টিকস</title>

<link href="https://fonts.googleapis.com/css2?family=Tiro+Bangla&amp;family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet"></link>

<style>
    /* হিরো সেকশন স্টাইল */
    .feature-hero-junction {
        background: linear-gradient(135deg, rgba(30, 60, 114, 0.9) 0%, rgba(42, 82, 152, 0.8) 100%), 
                    url('https://images.unsplash.com/photo-1551288049-bbbda5366a7a?auto=format&fit=crop&q=80&w=1200');
        background-size: cover;
        background-position: center;
        height: 350px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 40px;
        box-shadow: 0 10px 30px rgba(30, 60, 114, 0.2);
        border-bottom: 6px solid #2a5298;
        overflow: hidden;
    }

    .hero-overlay {
        text-align: center;
        padding: 25px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        max-width: 85%;
    }

    .hero-main-title {
        color: #ffffff !important;
        font-size: 36px !important;
        font-weight: 900 !important;
        margin: 10px 0 !important;
        font-family: 'Tiro Bangla', serif;
    }

    .cyan-text { color: #00e5ff; }

    /* মেইন কন্টেইনার */
    .hypothesis-container {
        font-family: 'Inter', 'Tiro Bangla', sans-serif;
        line-height: 1.8;
        color: #2c3e50;
        max-width: 850px;
        margin: 0 auto;
        border: 1px solid #e0e6ed;
        border-radius: 12px;
        background-color: #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        padding-bottom: 20px;
    }

    .intro-box {
        padding: 25px;
        background-color: #f0f4f8;
        border-bottom: 1px solid #e0e6ed;
        font-size: 1.1em;
        border-radius: 0 0 0 0;
    }

    .hypothesis-container details {
        border-bottom: 1px solid #f1f1f1;
    }

    .hypothesis-container summary {
        padding: 20px 25px;
        font-weight: 700;
        cursor: pointer;
        color: #1e3c72;
        font-size: 19px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        list-style: none;
    }

    .hypothesis-container summary:hover { background-color: #f9fbff; }

    .step-content { padding: 20px 35px; }

    .math-formula {
        background: #f8f9fa;
        border-left: 4px solid #1e3c72;
        padding: 15px;
        margin: 15px 0;
        text-align: center;
        font-weight: bold;
    }

    .comparison-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }

    .comparison-table th, .comparison-table td {
        border: 1px solid #dee2e6;
        padding: 12px;
        text-align: left;
    }

    .comparison-table th { background-color: #e9ecef; color: #1e3c72; }

    .stat-box {
        background-color: #e3fcef;
        border: 1px solid #2ecc71;
        padding: 20px;
        border-radius: 10px;
        margin-top: 15px;
    }

    .img-tag {
        text-align: center;
        margin: 20px 0;
        font-style: italic;
        color: #7f8c8d;
    }
</style>
</head>
<body>

<div class="hypothesis-container">
    
    <div class="feature-hero-junction">
        <div class="hero-overlay">
            <h2 class="hero-main-title">নাস্তিক ও বিকল্প কল্পনা <br /><span class="cyan-text">(Hypothesis Testing)</span></h2>
            <div style="background: #00e5ff; height: 3px; margin: 15px auto; width: 50px;"></div>
            <p style="color: #e0f7fa; font-size: 17px;">বৈজ্ঞানিক সিদ্ধান্ত গ্রহণের গাণিতিক ভিত্তি</p>
        </div>
    </div>
    
    <div class="intro-box">
        जीवপরিসংখ্যানে কোনো গবেষণার ফলাফল কেবল দৈববশত (By chance) হয়েছে নাকি এর পেছনে বাস্তব কোনো কারণ আছে, তা বৈজ্ঞানিকভাবে জানার পদ্ধতিই হলো <strong>Hypothesis Testing</strong> বা পরিকল্পনা যাচাই।
    </div>

    <details open="">
        <summary>১. নাস্তিক কল্পনা (Null Hypothesis - H₀)</summary>
        <div class="step-content">
            <p>এটি হলো গবেষণার সেই প্রাথমিক ধারণা যেখানে ধরে নেওয়া হয় যে পরীক্ষাধীন চলকগুলোর মধ্যে কোনো বাস্তব পার্থক্য নেই। গবেষক মূলত এই ধারণাটিকে ভুল প্রমাণ করার চেষ্টা করেন।</p>
            <p><strong>উদাহরণ:</strong> "একটি নতুন ওষুধ ব্যবহারের ফলে রোগীদের সুস্থ হওয়ার হারে কোনো পরিবর্তন আসেনি।"</p>
            <div class="math-formula">গাণিতিক চিহ্ন: H₀: μ₁ = μ₂</div>
        </div>
    </details>

    <details>
        <summary>২. বিকল্প কল্পনা (Alternative Hypothesis - H₁ বা Hₐ)</summary>
        <div class="step-content">
            <p>এটি নাস্তিক কল্পনার ঠিক বিপরীত ধারণা। গবেষক গবেষণার মাধ্যমে আসলে এই ফলাফলটিই আশা করেন বা প্রমাণ করতে চান।</p>
            <p><strong>উদাহরণ:</strong> "নতুন ওষুধটি ব্যবহারের ফলে রোগীরা দ্রুত সুস্থ হচ্ছেন (অর্থাৎ সুস্থ হওয়ার হার বেড়েছে)।"</p>
            <div class="math-formula">
                Hₐ: μ₁ ≠ μ₂ (দ্বিমুখী)<br />
                Hₐ: μ₁ &gt; μ₂ (একমুখী)
            </div>
        </div>
    </details>

    <div class="img-tag">
        
    </div>

    <details>
        <summary>৩. সংশয়ী এলাকা (Critical Region)</summary>
        <div class="step-content">
            <p>একটি নরমাল ডিস্ট্রিবিউশন কার্ভের (Normal Distribution Curve) যে নির্দিষ্ট অংশে আমাদের গণনাকৃত মান পড়লে আমরা নাস্তিক কল্পনাকে (H₀) বর্জন করি, তাকেই <strong>Critical Region</strong> বা বর্জন এলাকা বলে।</p>
        </div>
    </details>

    <details>
        <summary>৪. একমুখী বনাম দ্বিমুখী পরীক্ষা (One-tailed vs Two-tailed Test)</summary>
        <div class="step-content">
            <div class="img-tag">
                [Image comparing one-tailed and two-tailed test critical regions on a bell curve]
            </div>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>বৈশিষ্ট্য</th>
                        <th>একমুখী পরীক্ষা (One-tailed)</th>
                        <th>দ্বিমুখী পরীক্ষা (Two-tailed)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>উদ্দেশ্য</strong></td>
                        <td>পার্থক্যটি শুধু একটি নির্দিষ্ট দিকে (বেশি বা কম) কি না তা দেখা।</td>
                        <td>শুধু পার্থক্য আছে কি না তা দেখা।</td>
                    </tr>
                    <tr>
                        <td><strong>উদাহরণ</strong></td>
                        <td>নতুন সার দিলে কি ফলন বাড়বে?</td>
                        <td>দুই জাতের মাছের ওজনে কি কোনো পার্থক্য আছে?</td>
                    </tr>
                    <tr>
                        <td><strong>Critical Region</strong></td>
                        <td>কার্ভের যেকোনো এক প্রান্তে থাকে।</td>
                        <td>কার্ভের দুই প্রান্তেই সমানভাবে থাকে।</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </details>

    <details>
        <summary>৫. ফলাফলের ব্যাখ্যা (Interpretation)</summary>
        <div class="step-content">
            <p>আমরা যখন কোনো টেস্ট করি, তখন একটি <strong>p-value</strong> বা সার্থকতা স্তর (যেমন: 0.05 বা ৫%) ব্যবহার করি।</p>
            <div class="stat-box">
                <ul>
                    <li><strong>যদি মান Critical Region-এ পড়ে:</strong> ফলাফলটি পরিসংখ্যানিকভাবে সার্থক (Statistically Significant)। আমরা <strong>H₀ বর্জন করি</strong>।</li>
                    <li><strong>যদি মান সংশয়ী এলাকার বাইরে থাকে:</strong> আমরা <strong>H₀ গ্রহণ করি</strong>।</li>
                </ul>
            </div>
        </div>
    </details>

</div>

</body>
</html>