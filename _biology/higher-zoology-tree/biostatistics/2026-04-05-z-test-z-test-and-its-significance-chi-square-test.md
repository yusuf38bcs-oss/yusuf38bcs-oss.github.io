---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Z-test এবং এর সার্থকতা (Z-test and its Significance) & Chi-Square test"
date: 2026-04-05T19:36:00.012Z
categories:
  - Biostatistics
---

<div class="separator" style="clear: both; text-align: center;"><a href="https://blogger.googleusercontent.com/img/a/AVvXsEhrrRwNJyREN6BzQuklCoWtewlRwBVFYGuyrm3iePiIgU5USaK9CbKC2zScsRccWSSty6cIPqphtVnPVVIHSVOdMIuqFnJSUhUiLjirkjLz1wJM6_wxZ9n7uy3u-OMpQPXXcHSUO1qg2ktJEtCUBR8bYsRjO0w-kJYT_Is_C-0-C52xsh9NHbnfv2U6I8g" style="margin-left: 1em; margin-right: 1em;"><img alt="" data-original-height="675" data-original-width="1200" height="180" src="https://blogger.googleusercontent.com/img/a/AVvXsEhrrRwNJyREN6BzQuklCoWtewlRwBVFYGuyrm3iePiIgU5USaK9CbKC2zScsRccWSSty6cIPqphtVnPVVIHSVOdMIuqFnJSUhUiLjirkjLz1wJM6_wxZ9n7uy3u-OMpQPXXcHSUO1qg2ktJEtCUBR8bYsRjO0w-kJYT_Is_C-0-C52xsh9NHbnfv2U6I8g" width="320" /></a></div><br />
<html lang="bn">
<head>
<meta charset="UTF-8"></meta>
<meta content="width=device-width, initial-scale=1.0" name="viewport"></meta>
<title>জীবপরিসংখ্যান লেকচার: Z-test এবং Chi-square Test</title>

<link href="https://fonts.googleapis.com/css2?family=Tiro+Bangla&amp;family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet"></link>

<style>
    :root {
        --primary-blue: #2980b9;
        --primary-green: #16a085;
        --accent-orange: #e67e22;
        --bg-light: #f4f7f6;
    }

    /* হিরো সেকশন */
    .feature-hero-junction {
        background: linear-gradient(135deg, rgba(44, 62, 80, 0.9) 0%, rgba(22, 160, 133, 0.8) 100%), 
                    url('https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1200');
        background-size: cover;
        background-position: center;
        height: 350px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 40px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        border-bottom: 6px solid var(--primary-green);
    }

    .hero-overlay {
        text-align: center;
        padding: 25px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(8px);
        border-radius: 15px;
        max-width: 85%;
    }

    .hero-main-title {
        color: #ffffff !important;
        font-size: 32px !important;
        font-weight: 900 !important;
        font-family: 'Tiro Bangla', serif;
    }

    /* মেইন কন্টেইনার */
    .biostat-container {
        font-family: 'Inter', 'Tiro Bangla', sans-serif;
        line-height: 1.8;
        color: #2c3e50;
        max-width: 850px;
        margin: 0 auto;
        padding: 20px;
    }

    h2 { 
        color: #2c3e50; 
        border-left: 5px solid var(--primary-blue); 
        padding-left: 15px; 
        margin-top: 40px;
    }

    .section-divider {
        height: 2px;
        background: #eee;
        margin: 40px 0;
    }

    /* কার্ড ও ডিটেইলস স্টাইল */
    details {
        background: #f9f9f9;
        padding: 15px 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        margin-bottom: 15px;
    }

    details[open] { background: #fff; border-color: var(--primary-blue); }

    summary {
        font-weight: 700;
        cursor: pointer;
        font-size: 1.1em;
        list-style: none;
    }

    .problem-box {
        background: #fff3e0;
        border-left: 5px solid var(--accent-orange);
        padding: 20px;
        border-radius: 0 8px 8px 0;
        font-style: italic;
    }

    .math-content {
        padding: 20px;
        background: var(--bg-light);
        border-radius: 8px;
    }

    .formula {
        font-family: 'Times New Roman', serif;
        font-size: 1.3em;
        text-align: center;
        background: #fff;
        padding: 15px;
        border: 1px dashed #ccc;
        margin: 10px 0;
    }

    .highlight-result {
        color: #27ae60;
        font-weight: bold;
        text-align: center;
    }
</style>
</head>
<body>

<div class="biostat-container">

    <div class="feature-hero-junction">
        <div class="hero-overlay">
            <h2 class="hero-main-title">অনার্স ৪র্থ বর্ষ: জীবপরিসংখ্যান লেকচার</h2>
            <div style="background: #00e5ff; height: 3px; margin: 15px auto; width: 50px;"></div>
            <p style="color: #e0f7fa; font-size: 18px;">Z-Test গাণিতিক সমাধান এবং Chi-Square এর বিস্তারিত বিশ্লেষণ</p>
        </div>
    </div>

    <h2>১. Z-test: মাছের গড় ওজন যাচাই</h2>
    <div class="problem-box">
        <strong>সমস্যা:</strong> বাংলাদেশের একটি অঞ্চলের পাঙ্গাশ মাছের গড় ওজন ১.৫ কেজি (SD ০.২০ কেজি)। একটি খামারের ১০০টি মাছের গড় ওজন ১.৫৬ কেজি পাওয়া গেল। ৫% সার্থকতা স্তরে পরীক্ষা করো মাছের ওজন কি উল্লেখযোগ্যভাবে বেশি?
    </div>

    

    <details open="">
        <summary>ধাপ ১-৩: উপাত্ত ও গণনা</summary>
        <div class="math-content">
            <p><strong>কল্পনা:</strong> H₀: μ = 1.5 বনাম Hₐ: μ &gt; 1.5</p>
            <p><strong>উপাত্ত:</strong> X̄=1.56, μ=1.5, σ=0.20, n=100</p>
            <div class="formula">Z = (1.56 - 1.5) / (0.20 / √100) = 3.0</div>
        </div>
    </details>

    <details>
        <summary>ধাপ ৪-৫: সিদ্ধান্ত ও মন্তব্য</summary>
        <div class="math-content">
            <p>৫% সার্থকতা স্তরে টেবিল মান ১.৬৪৫। যেহেতু <strong>গণনাকৃত মান (৩.০) &gt; ১.৬৪৫</strong>, তাই আমরা H₀ বর্জন করি।</p>
            <p class="highlight-result">সিদ্ধান্ত: খামারের মাছের ওজন সাধারণ গড় ওজনের চেয়ে উল্লেখযোগ্যভাবে বেশি।</p>
        </div>
    </details>

    <div class="section-divider"></div>

    <h2 style="border-left-color: var(--primary-green);">২. কাই-বর্গ পরীক্ষা (Chi-square Test)</h2>
    <p>১৯০০ সালে কার্ল পিয়ারসন এই নন-প্যারামেট্রিক টেস্টটি উদ্ভাবন করেন, যা গুণগত উপাত্ত (Qualitative Data) বিশ্লেষণে ব্যবহৃত হয়।</p>

    

    <details open="">
        <summary>গুডনেস অফ ফিট (Goodness of Fit)</summary>
        <div class="math-content">
            <p>এটি যাচাই করে সংগৃহীত উপাত্ত কোনো তাত্ত্বিক অনুপাত (যেমন মেন্ডেলের ৩:১) মেনে চলে কি না।</p>
            <div class="formula">χ² = Σ [ (O - E)² / E ]</div>
            <p><strong>উদাহরণ:</strong> ৪০০টি গাছের মধ্যে ৩০০টি লম্বা ও ১০০টি খাটো হলে এটি মেন্ডেলের ৩:১ অনুপাতকে নিখুঁতভাবে সমর্থন করে (যেহেতু χ² = ০)।</p>
        </div>
    </details>

    

    <details>
        <summary>কন্টিনজেন্সি টেবিল ও শর্তাবলী</summary>
        <div class="math-content">
            <p><strong>Independence Test:</strong> দুটি বৈশিষ্ট্যের মধ্যে সম্পর্ক (যেমন ধূমপান ও ক্যান্সার) যাচাইয়ে এটি ব্যবহৃত হয়।</p>
            <p><strong>স্বাধীনতার মাত্রা (df):</strong> (r - 1)(c - 1)</p>
            <hr />
            <strong>প্রধান শর্তাবলী:</strong>
            <ul>
                <li>নমুনা সংখ্যা (N) অন্তত ৫০ হতে হবে।</li>
                <li>প্রত্যাশিত মান (E) ৫ এর কম হওয়া যাবে না।</li>
            </ul>
        </div>
    </details>

    <div style="background-color: #e8f4fd; border-radius: 10px; margin-top: 20px; padding: 15px;">
        <strong>💡 ব্লগার টিপস:</strong> মনে রাখবেন, χ² এর মান যত কম হবে, পর্যবেক্ষণকৃত এবং প্রত্যাশিত মানের মধ্যে মিল তত বেশি হবে।
    </div>

</div>

</body>
</html>
