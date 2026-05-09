---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "বিস্তারের পরিমাপ (Measures of Dispersion)"
date: 2026-04-05T20:01:00.008Z
categories:
  - Biostatistics
---

<div class="separator" style="clear: both; text-align: center;"><a href="https://blogger.googleusercontent.com/img/a/AVvXsEi3RbIBPxej7IdHBYZVR1R3baMgCaT6Ub_AIQYoetzWP1EfEES1H3HoN8UNixNdbFHOsLDFWBjAgO4BtfISItJZmwNGHTl08-gLdnUIWHyLpJdP76Hts4Q1ry-G3dHpkqAh4Goeu-DW-Oz78XbMnXcNJHt3K9wVIu8U_MoNRjbSjS1Ftf9EUcHk0vnGa4k" style="margin-left: 1em; margin-right: 1em;"><img alt="" data-original-height="559" data-original-width="1024" height="175" src="https://blogger.googleusercontent.com/img/a/AVvXsEi3RbIBPxej7IdHBYZVR1R3baMgCaT6Ub_AIQYoetzWP1EfEES1H3HoN8UNixNdbFHOsLDFWBjAgO4BtfISItJZmwNGHTl08-gLdnUIWHyLpJdP76Hts4Q1ry-G3dHpkqAh4Goeu-DW-Oz78XbMnXcNJHt3K9wVIu8U_MoNRjbSjS1Ftf9EUcHk0vnGa4k" width="320" /></a></div><br />
<html lang="bn">
<head>
    <meta charset="UTF-8"></meta>
    <title>বিস্তারের পরিমাপ ও সমাধান - লেকচার নোট</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2c3e50; max-width: 850px; margin: 20px auto; padding: 0 20px; background-color: #f4f7f6; }
        .main-title { text-align: center; color: #2980b9; margin-bottom: 30px; }
        .biostats-container { background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; }
        details { border-bottom: 1px solid #edf2f7; transition: all 0.3s ease; }
        details:last-child { border-bottom: none; }
        summary { font-size: 1.1em; font-weight: 600; cursor: pointer; padding: 18px 25px; background: #fff; list-style: none; display: flex; justify-content: space-between; align-items: center; outline: none; }
        summary::-webkit-details-marker { display: none; }
        summary::after { content: '📂'; font-size: 1.2em; transition: 0.3s; }
        details[open] summary::after { content: '📂'; transform: rotate(180s); }
        details[open] summary { background: #eef2f7; color: #2980b9; border-bottom: 1px solid #d1d9e6; }
        .content { padding: 20px 30px; line-height: 1.8; }
        .formula-box { background: #f8fbff; border-left: 5px solid #3498db; padding: 15px; margin: 15px 0; border-radius: 4px; font-style: italic; font-weight: 500; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
        th, td { border: 1px solid #d1d9e6; padding: 12px; text-align: center; }
        th { background-color: #f1f4f8; font-weight: 600; }
        .highlight { color: #e67e22; font-weight: bold; }
        .result-box { background: #e8f8f5; border: 1px dashed #27ae60; padding: 15px; border-radius: 8px; text-align: center; margin-top: 15px; }
    </style>
</head>
<body>

    <h1 class="main-title">📊 বিস্তারের পরিমাপ: তাত্ত্বিক আলোচনা ও গাণিতিক সমাধান</h1>

    <div class="biostats-container">
        
        <details open="">
            <summary>১. বিস্তারের প্রধান পরিমাপসমূহ (Theory)</summary>
            <div class="content">
                <p>জীবপরিসংখ্যানে উপাত্তের নির্ভরযোগ্যতা এবং ভিন্নতা বোঝার জন্য বিস্তারের পরিমাপ অপরিহার্য।</p>
                
                <h3 class="highlight">📏 পরিসর (Range)</h3>
                <p>উপাত্তের সর্বোচ্চ ও সর্বনিম্ন মানের ব্যবধান।</p>
                <div class="formula-box">সূত্র: R = X<sub>max</sub> - X<sub>min</sub></div>

                <h3 class="highlight">🔢 ভেদাঙ্ক (Variance)</h3>
                <p>গাণিতিক গড় থেকে প্রতিটি উপাত্তের দূরত্বের বর্গের গড়।</p>
                <div class="formula-box">সূত্র (নমুনা): s² = Σ(X - X̄)² / (n - 1)</div>

                <h3 class="highlight">📉 পরিমিত ব্যবধান (Standard Deviation - SD)</h3>
                <p>ভেদাঙ্কের ধনাত্মক বর্গমূল। এটি উপাত্তের বিচ্যুতির সবচেয়ে জনপ্রিয় পরিমাপ।</p>
                <div class="formula-box">সূত্র: s = √[Σ(X - X̄)² / (n - 1)]</div>

                <h3 class="highlight">📍 আদর্শ বিভ্রম (Standard Error - SE)</h3>
                <p>নমুনা গড় পপুলেশন গড় থেকে কতটা দূরে থাকতে পারে তার পরিমাপ।</p>
                <div class="formula-box">সূত্র: SE = SD / √n</div>
            </div>
        </details>

        <details>
            <summary>২. গাণিতিক উদাহরণ: গড় নির্ণয় (Step 1)</summary>
            <div class="content">
                <p><strong>উদাহরণ:</strong> ৫টি চারাগাছের উচ্চতা (সেমি) যথাক্রমে: ৮, ১০, ১২, ১৪, ১৬।</p>
                <p>প্রথমে গড় (X̄) নির্ণয় করি:</p>
                <div class="formula-box">
                    X̄ = (৮ + ১০ + ১২ + ১৪ + ১৬) / ৫ <br />
                    X̄ = ৬০ / ৫ = <strong>১২ সেমি</strong>
                </div>
            </div>
        </details>

        <details>
            <summary>৩. বিচ্যুতি ও বর্গের টেবিল (Step 2)</summary>
            <div class="content">
                <p>গড় (X̄ = ১২) ব্যবহার করে নিচের টেবিলটি তৈরি করি:</p>
                <table>
                    <thead>
                        <tr>
                            <th>উচ্চতা (X)</th>
                            <th>বিচ্যুতি (X - X̄)</th>
                            <th>বিচ্যুতির বর্গ (X - X̄)²</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>৮</td><td>-৪</td><td>১৬</td></tr>
                        <tr><td>১০</td><td>-২</td><td>৪</td></tr>
                        <tr><td>১২</td><td>০</td><td>০</td></tr>
                        <tr><td>১৪</td><td>২</td><td>৪</td></tr>
                        <tr><td>১৬</td><td>৪</td><td>১৬</td></tr>
                        <tr style="background: #f9f9f9; font-weight: bold;">
                            <td>মোট (Σ)</td>
                            <td>০</td>
                            <td>৪০</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </details>

        <details>
            <summary>৪. SD এবং SE গণনা ও ফলাফল (Final Step)</summary>
            <div class="content">
                <p><strong>পরিমিত ব্যবধান (SD) গণনা:</strong></p>
                <div class="formula-box">
                    s = √(৪০ / (৫-১)) = √(৪০ / ৪) = √১০ ≈ <strong>৩.১৬ সেমি</strong>
                </div>

                <p><strong>আদর্শ বিভ্রম (SE) গণনা:</strong></p>
                <div class="formula-box">
                    SE = ৩.১৬ / √৫ ≈ ৩.১৬ / ২.২৩৬ ≈ <strong>১.৪১ সেমি</strong>
                </div>

                <div class="result-box">
                    <strong>চুড়ান্ত ফলাফল (Mean ± SE):</strong> <br />
                    <span style="color: #27ae60; font-size: 1.3em;">১২ ± ১.৪১ সেমি</span>
                </div>
            </div>
        </details>

    </div>

</body>
</html>