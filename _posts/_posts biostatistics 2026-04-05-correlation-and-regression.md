---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Correlation and Regression (সহসম্বন্ধ ও নির্ভরক বিশ্লেষণ)"
date: 2026-04-05T20:55:00.003Z
categories:
  - Higher Zoology Tree
  - Biostatistics & Research Methodology
---

<p><br /></p><style>
    .cr-container {
        font-family: 'SolaimanLipi', 'Segoe UI', Arial, sans-serif;
        line-height: 1.8;
        color: #2c3e50;
        max-width: 850px;
        margin: 20px auto;
        border: 1px solid #dcdde1;
        border-radius: 10px;
        background-color: #ffffff;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    .cr-header {
        background: linear-gradient(135deg, #2980b9 0%, #2c3e50 100%);
        color: white;
        padding: 25px;
        text-align: center;
        border-radius: 10px 10px 0 0;
        margin: 0;
    }
    .cr-container details {
        border-bottom: 1px solid #f1f2f6;
        transition: background 0.3s ease;
    }
    .cr-container details:last-child {
        border-bottom: none;
    }
    .cr-container summary {
        padding: 18px 25px;
        font-weight: 600;
        font-size: 1.1em;
        cursor: pointer;
        outline: none;
        color: #2980b9;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .cr-container summary:hover {
        background-color: #f7fbfe;
    }
    .cr-container summary::after {
        content: "⊕";
        font-size: 1.2em;
        color: #2980b9;
    }
    .cr-container details[open] summary::after {
        content: "⊖";
    }
    .cr-content {
        padding: 20px 30px;
        background-color: #ffffff;
    }
    .formula-highlight {
        background: #f1f8ff;
        border-left: 5px solid #2980b9;
        padding: 15px;
        margin: 15px 0;
        text-align: center;
    }
    .cr-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
    }
    .cr-table th, .cr-table td {
        border: 1px solid #dee2e6;
        padding: 10px;
        text-align: center;
    }
    .cr-table th {
        background-color: #2980b9;
        color: white;
    }
    .comparison-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 10px;
    }
    .comp-item {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }
</style>

<div class="cr-container">
    <h2 class="cr-header">সহসম্বন্ধ ও নির্ভরক বিশ্লেষণ (Correlation and Regression)</h2>

    <details>
        <summary>১. সহসম্বন্ধ (Correlation)</summary>
        <div class="cr-content">
            <p>দুটি চলকের মধ্যে পারস্পরিক সম্পর্কের মাত্রা এবং প্রকৃতিকে সহসম্বন্ধ বলে। একে সাধারণত $r$ দ্বারা প্রকাশ করা হয়।</p>
            <ul>
                <li><strong>ধনাত্মক সহসম্বন্ধ:</strong> একটি চলক বাড়লে অন্যটিও বাড়ে (যেমন: উদ্ভিদের উচ্চতা বাড়লে পাতাও বাড়ে)।</li>
                <li><strong>ঋণাত্মক সহসম্বন্ধ:</strong> একটি বাড়লে অন্যটি কমে (যেমন: জনসংখ্যা বাড়লে মাথাপিছু খাদ্য কমে)।</li>
                <li><strong>শূন্য সহসম্বন্ধ:</strong> চলক দুটির মধ্যে কোনো সম্পর্ক নেই।</li>
            </ul>
            <div class="formula-highlight">
                <strong>বৈশিষ্ট্য:</strong> এর মান সর্বদাই $-1$ থেকে $+1$ এর মধ্যে থাকে। $r = +1$ হলে পূর্ণ ধনাত্মক এবং $r = -1$ হলে পূর্ণ ঋণাত্মক সম্পর্ক বোঝায়।
            </div>
        </div>
    </details>

    <details>
        <summary>২. বিক্ষেপ চিত্র (Scatter Diagram)</summary>
        <div class="cr-content">
            <p>উপাত্তগুলোকে যখন গ্রাফ পেপারে ছক কাগজের মতো বিন্দু দিয়ে বসানো হয়, তখন তাকে <strong>Scatter Diagram</strong> বলে। এটি দেখে খুব সহজেই সম্পর্কের ধরণ বোঝা যায়।</p>
        </div>
    </details>

    <details>
        <summary>৩. নির্ভরক বিশ্লেষণ (Linear Regression)</summary>
        <div class="cr-content">
            <p>নির্ভরক হলো এমন একটি গাণিতিক পদ্ধতি যার মাধ্যমে একটি স্বাধীন চলকের ($X$) ওপর ভিত্তি করে একটি নির্ভরশীল চলকের ($Y$) মান আগে থেকেই অনুমান করা যায়।</p>
            <div class="formula-highlight">
                <strong>নির্ভরক সমীকরণ:</strong><br>
                <span style="font-size: 1.3em;">$Y = a + bX$</span>
            </div>
            <p><strong>যেখানে:</strong></p>
            <ul>
                <li>$Y$ = নির্ভরশীল চলক (Dependent variable)</li>
                <li>$X$ = স্বাধীন চলক (Independent variable)</li>
                <li>$a$ = ইন্টারসেপ্ট বা ধ্রুবক (Intercept)</li>
                <li>$b$ = নির্ভরক গুণাঙ্ক বা ঢাল (Slope)</li>
            </ul>
        </div>
    </details>

    <details>
        <summary>৪. গাণিতিক উদাহরণ: উচ্চতা ও ওজনের সম্পর্ক</summary>
        <div class="cr-content">
            <p><strong>সমস্যা:</strong> ৫ জন শিক্ষার্থীর উচ্চতা ($X$) এবং ওজন ($Y$) থেকে সহসম্বন্ধ ($r$) নির্ণয় করো।</p>
            <div style="overflow-x: auto;">
                <table class="cr-table">
                    <thead>
                        <tr>
                            <th>উচ্চতা (X)</th>
                            <th>ওজন (Y)</th>
                            <th>$X^2$</th>
                            <th>$Y^2$</th>
                            <th>$XY$</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>১৫০</td><td>৫০</td><td>২২৫০০</td><td>২৫০০</td><td>৭৫০০</td></tr>
                        <tr><td>১৬০</td><td>৬০</td><td>২৫৬০০</td><td>৩৬০০</td><td>৯৬০০</td></tr>
                        <tr><td>১৭০</td><td>৭০</td><td>২৮৯০০</td><td>৪৯০০</td><td>১১৯০০</td></tr>
                        <tr><td>১৮০</td><td>৮০</td><td>৩২৪০০</td><td>৬৪০০</td><td>১৪৪০০</td></tr>
                        <tr><td>১৯০</td><td>৯০</td><td>৩৬১০০</td><td>৮১০০</td><td>১৭১০০</td></tr>
                        <tr style="background:#f1f8ff; font-weight:bold;">
                            <td>$\sum X = 850$</td>
                            <td>$\sum Y = 350$</td>
                            <td>$\sum X^2 = 145500$</td>
                            <td>$\sum Y^2 = 25500$</td>
                            <td>$\sum XY = 60500$</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="formula-highlight">
                <strong>সূত্র:</strong><br>
                $$r = \frac{n(\sum XY) - (\sum X)(\sum Y)}{\sqrt{[n\sum X^2 - (\sum X)^2][n\sum Y^2 - (\sum Y)^2]}}$$
            </div>
            <p>মানগুলো বসালে দেখা যায় $r = 1$, অর্থাৎ উচ্চতা ও ওজনের মধ্যে <strong>পূর্ণ ধনাত্মক সম্পর্ক</strong> বিদ্যমান।</p>
        </div>
    </details>

    <details>
        <summary>৫. রিগ্রেশন এবং কোরিলেশনের মধ্যে পার্থক্য</summary>
        <div class="cr-content">
            <div class="comparison-grid">
                <div class="comp-item">
                    <strong>কোরিলেশন:</strong> এটি শুধু সম্পর্কের মাত্রা এবং দিক জানায়। চলক অদলবদল করলে মানের পরিবর্তন হয় না।
                </div>
                <div class="comp-item">
                    <strong>রিগ্রেশন:</strong> এটি একটি চলকের সাপেক্ষে অন্যটির মান ভবিষ্যদ্বাণী করে। এখানে স্বাধীন ও নির্ভরশীল চলক নির্দিষ্ট থাকে।
                </div>
            </div>
        </div>
    </details>
</div>