---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Z Test: Problem Solving"
date: 2026-04-05T19:06:00.005Z
categories:
  - Biostatistics
---

<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<style>
    .z-test-container {
        font-family: 'Segoe UI', 'SolaimanLipi', Tahoma, Geneva, Verdana, sans-serif;
        color: #2c3e50;
        line-height: 1.7;
        max-width: 850px;
        margin: 20px auto;
        border: 1px solid #e1e4e8;
        border-radius: 12px;
        overflow: hidden;
        background-color: #ffffff;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    .z-test-header {
        background-color: #2c3e50;
        color: white;
        padding: 25px;
        text-align: center;
        margin: 0;
    }
    .z-test-container details {
        border-bottom: 1px solid #e1e4e8;
        background: #fdfdfd;
    }
    .z-test-container details[open] {
        background: #ffffff;
    }
    .z-test-container summary {
        padding: 18px 25px;
        font-weight: 600;
        cursor: pointer;
        outline: none;
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #34495e;
        border-bottom: 1px solid transparent;
    }
    .z-test-container summary:after {
        content: "＋";
        font-size: 1.2em;
        transition: transform 0.3s;
    }
    .z-test-container details[open] summary:after {
        content: "−";
    }
    .z-test-content {
        padding: 20px 30px;
        color: #444;
    }
    .highlight-box {
        background-color: #e8f4fd;
        border-left: 5px solid #3498db;
        padding: 20px;
        margin: 15px 0;
        border-radius: 0 8px 8px 0;
    }
    .conclusion-box {
        background-color: #eafaf1;
        border-left: 5px solid #27ae60;
        padding: 20px;
        font-weight: 500;
        border-radius: 0 8px 8px 0;
    }
    .math-center {
        text-align: center;
        font-size: 1.25em;
        margin: 15px 0;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 6px;
    }
</style>
</head>
<body>

<div class="z-test-container">
    <h2 class="z-test-header">গাণিতিক উদাহরণ: পাঙ্গাশ মাছের গড় ওজন যাচাই (Z-test)</h2>

    <details open>
        <summary>ধাপ ১: নাস্তিক ও বিকল্প কল্পনা (Hypothesis)</summary>
        <div class="z-test-content">
            <p>গবেষণার শুরুতে আমরা দুটি বিপরীতধর্মী কল্পনা গ্রহণ করি:</p>
            <ul>
                <li><strong>নাস্তিক কল্পনা ($H_0$):</strong> $\mu = 1.5$ (খামারের মাছের গড় ওজন সাধারণ ওজনের সমান, কোনো পার্থক্য নেই)</li>
                <li><strong>বিকল্প কল্পনা ($H_a$):</strong> $\mu > 1.5$ (খামারের মাছের গড় ওজন সাধারণ ওজনের চেয়ে উল্লেখযোগ্যভাবে বেশি)</li>
            </ul>
        </div>
    </details>

    <details>
        <summary>ধাপ ২: প্রয়োজনীয় উপাত্তসমূহ</summary>
        <div class="z-test-content">
            <div class="highlight-box">
                <p>সমস্যা থেকে প্রাপ্ত তথ্যসমূহ:</p>
                <ul style="list-style: none; padding-left: 0;">
                    <li>🔹 পপুলেশন গড় ($\mu$) = ১.৫ কেজি</li>
                    <li>🔹 স্যাম্পল গড় ($\bar{X}$) = ১.৫৬ কেজি</li>
                    <li>🔹 আদর্শ বিচ্যুতি ($\sigma$) = ০.২০ কেজি</li>
                    <li>🔹 নমুনার সংখ্যা ($n$) = ১০০</li>
                    <li>🔹 সার্থকতা স্তর ($\alpha$) = ০.০৫ (৫%)</li>
                </ul>
            </div>
        </div>
    </details>

    

    <details open>
        <summary>ধাপ ৩: Z-মান গণনা</summary>
        <div class="z-test-content">
            <p>Z-test এর সূত্রটি ব্যবহার করে আমরা পাই:</p>
            <div class="math-center">
                $$Z = \frac{\bar{X} - \mu}{\sigma / \sqrt{n}}$$
            </div>
            <p>মান বসিয়ে পরবর্তী হিসাব:</p>
            <div class="math-center">
                $$Z = \frac{1.56 - 1.5}{0.20 / \sqrt{100}} = \frac{0.06}{0.02} = 3.0$$
            </div>
            <p><strong>গণনাকৃত মান (Calculated Value):</strong> $Z = 3.0$</p>
        </div>
    </details>

    <details>
        <summary>ধাপ ৪: সিদ্ধান্ত গ্রহণ</summary>
        <div class="z-test-content">
            <p>৫% সার্থকতা স্তরে একমুখী পরীক্ষার জন্য Z-এর সংকট মান (Table Value) হলো <strong>১.৬৪৫</strong>।</p>
            <div class="highlight-box" style="text-align: center; border-left: none; border-top: 3px solid #e74c3c;">
                <p>যেহেতু আমাদের গণনাকৃত মান $(Z = 3.0)$ টেবিল মান $(1.645)$ অপেক্ষা বড়:</p>
                <p style="font-weight: bold; font-size: 1.3em; color: #e74c3c; margin: 10px 0;">$$3.0 > 1.645$$</p>
            </div>
            <p>সুতরাং, আমরা নাস্তিক কল্পনা ($H_0$) বর্জন করছি।</p>
        </div>
    </details>

    

    <details open>
        <summary>ধাপ ৫: চূড়ান্ত মন্তব্য</summary>
        <div class="z-test-content">
            <div class="conclusion-box">
                ✅ <strong>ফলাফল:</strong> ৫% সার্থকতা স্তরে এটি প্রমাণিত যে, ওই খামারের পাঙ্গাশ মাছের গড় ওজন সাধারণ গড় ওজনের চেয়ে উল্লেখযোগ্যভাবে বেশি। উন্নত চাষ পদ্ধতি বা পুষ্টিকর খাবারের কারণে এই ইতিবাচক পরিবর্তন এসেছে বলে গবেষক দাবি করতে পারেন।
            </div>
        </div>
    </details>
</div>

</body>
</html>
