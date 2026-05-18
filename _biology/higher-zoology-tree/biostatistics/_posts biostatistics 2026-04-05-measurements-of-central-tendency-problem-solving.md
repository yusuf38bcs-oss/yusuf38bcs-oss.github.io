---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Measurements of Central Tendency: Problem Solving"
date: 2026-04-05T17:31:00.007Z
categories:
  - Biostatistics
---

<style>
    .bio-stats-box {
        font-family: 'SolaimanLipi', 'Segoe UI', Arial, sans-serif;
        line-height: 1.6;
        color: #2c3e50;
        max-width: 900px;
        margin: 20px auto;
        border: 1px solid #dee2e6;
        border-radius: 12px;
        background-color: #fff;
        box-shadow: 0 5px 15px rgba(0,0,0,0.08);
    }
    .bio-stats-header {
        background-color: #34495e;
        color: white;
        padding: 25px;
        text-align: center;
        border-radius: 12px 12px 0 0;
        margin: 0;
    }
    .problem-statement {
        padding: 20px;
        background-color: #f1f3f5;
        border-bottom: 1px solid #dee2e6;
        font-weight: 500;
    }
    details {
        border-bottom: 1px solid #eee;
    }
    details[open] {
        background-color: #ffffff;
    }
    summary {
        padding: 18px 25px;
        font-weight: bold;
        font-size: 1.1em;
        cursor: pointer;
        outline: none;
        color: #2980b9;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    summary:hover {
        background-color: #f8f9fa;
    }
    .content-area {
        padding: 20px 30px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
        font-size: 0.95em;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: center;
    }
    th {
        background-color: #2980b9;
        color: white;
    }
    .formula-display {
        background: #eef7ff;
        border-left: 5px solid #2980b9;
        padding: 15px;
        margin: 15px 0;
        font-size: 1.1em;
    }
    .analysis-box {
        background-color: #e8f5e9;
        border-left: 5px solid #27ae60;
        padding: 15px;
        margin-top: 10px;
    }
    .reference {
        font-size: 0.85em;
        color: #7f8c8d;
        padding: 15px;
        border-top: 1px solid #eee;
    }
</style>

<div class="bio-stats-box">
    <h2 class="bio-stats-header">কেন্দ্রীয় প্রবণতার পরিমাপ - গাণিতিক সমাধান (Grouped Data)</h2>
    
    <div class="problem-statement">
        <strong>📌 সমস্যা:</strong> ৩০ জন রোগীর রক্তের গ্লুকোজের মাত্রা (mg/dL) নিচে দেওয়া হলো। এর গড়, মধ্যমা ও প্রচুরক নির্ণয় করো।
        <table style="margin-top:10px;">
            <tr>
                <th>গ্লুকোজের মাত্রা (শ্রেণী)</th>
                <td>৭০ - ৮০</td>
                <td>৮০ - ৯০</td>
                <td>৯০ - ১০০</td>
                <td>১০০ - ১১০</td>
                <td>১লো - ১২০</td>
                <th>মোট</th>
            </tr>
            <tr>
                <th>রোগীর সংখ্যা (f)</th>
                <td>৪</td>
                <td>৮</td>
                <td>১০</td>
                <td>৬</td>
                <td>২</td>
                <td>N = ৩০</td>
            </tr>
        </table>
    </div>

    <details>
        <summary>১. গাণিতিক গড় (Mean) নির্ণয়</summary>
        <div class="content-area">
            <p>গড় নির্ণয়ের জন্য আমাদের শ্রেণীর মধ্যবিন্দু ($x$) এবং $fx$ এর মান বের করতে হবে।</p>
            <table>
                <tr>
                    <th>শ্রেণী</th>
                    <th>গণসংখ্যা (f)</th>
                    <th>মধ্যবিন্দু (x)</th>
                    <th>fx</th>
                </tr>
                <tr><td>৭০ - ৮০</td><td>৪</td><td>৭৫</td><td>৩০০</td></tr>
                <tr><td>৮০ - ৯০</td><td>৮</td><td>৮৫</td><td>৬৮০</td></tr>
                <tr><td>৯০ - ১০০</td><td>১০</td><td>৯৫</td><td>৯৫০</td></tr>
                <tr><td>১০০ - ১১০</td><td>৬</td><td>১০৫</td><td>৬৩০</td></tr>
                <tr><td>১১০ - ১২০</td><td>২</td><td>১১৫</td><td>২৩০</td></tr>
                <tr style="font-weight:bold; background:#f9f9f9;">
                    <td>মোট</td>
                    <td>N = ৩০</td>
                    <td>-</td>
                    <td>$\sum fx = ২৭৯০$</td>
                </tr>
            </table>
            <div class="formula-display">
                <strong>সূত্র:</strong><br>
                $$\bar{X} = \frac{\sum fx}{N} = \frac{2790}{30} = 93 \text{ mg/dL}$$
            </div>
        </div>
    </details>

    <details>
        <summary>২. মধ্যমা (Median) নির্ণয়</summary>
        <div class="content-area">
            <p>মধ্যমা নির্ণয়ের জন্য ক্রমযোজিত গণসংখ্যা (Cumulative Frequency) প্রয়োজন।</p>
            <table>
                <tr>
                    <th>শ্রেণী</th>
                    <th>গণসংখ্যা (f)</th>
                    <th>ক্রমযোজিত গণসংখ্যা (cf)</th>
                </tr>
                <tr><td>৭০ - ৮০</td><td>৪</td><td>৪</td></tr>
                <tr><td>৮০ - ৯০</td><td>৮</td><td>১২</td></tr>
                <tr style="background:#fff4e6; font-weight:bold;"><td>৯০ - ১০০ (মধ্যমা শ্রেণী)</td><td>১০</td><td>২২</td></tr>
                <tr><td>১০০ - ১১০</td><td>৬</td><td>২৮</td></tr>
                <tr><td>১১০ - ১২০</td><td>২</td><td>৩০</td></tr>
            </table>
            <div class="formula-display">
                <strong>সূত্র:</strong> $$\text{Median} = L + \left( \frac{\frac{N}{2} - F}{f_m} \right) \times c$$
            </div>
            <ul>
                <li>$\frac{N}{2} = \frac{30}{2} = 15$ (যা ২২ এর ভেতরে অবস্থিত, তাই মধ্যমা শ্রেণী ৯০-১০০)</li>
                <li>$L$ (নিম্নসীমা) = ৯০, $F$ (পূর্ববর্তী $cf$) = ১২</li>
                <li>$f_m$ (মধ্যমা শ্রেণীর $f$) = ১০, $c$ (শ্রেণী ব্যবধান) = ১০</li>
            </ul>
            <p><strong>ক্যালকুলেশন:</strong> $$\text{Median} = 90 + \left( \frac{15 - 12}{10} \right) \times 10 = 90 + 3 = 93 \text{ mg/dL}$$</p>
        </div>
    </details>

    <details>
        <summary>৩. প্রচুরক (Mode) নির্ণয়</summary>
        <div class="content-area">
            <p>সবচেয়ে বেশি গণসংখ্যা আছে <strong>'৯০ - ১০০'</strong> শ্রেণীতে (১০ বার)। তাই এটিই প্রচুরক শ্রেণী।</p>
            <div class="formula-display">
                <strong>সূত্র:</strong> $$\text{Mode} = L + \left( \frac{f_1 - f_0}{(f_1 - f_0) + (f_1 - f_2)} \right) \times c$$
            </div>
            <p>এখানে: $L = 90, f_1 = 10, f_0 = 8, f_2 = 6, c = 10$</p>
            <p><strong>ক্যালকুলেশন:</strong><br>
            $$\text{Mode} = 90 + \left( \frac{10 - 8}{(10 - 8) + (10 - 6)} \right) \times 10 = 90 + \left( \frac{2}{2 + 4} \right) \times 10 = 93.33 \text{ mg/dL}$$</p>
        </div>
    </details>

    <div class="content-area">
        <div class="analysis-box">
            <strong>📊 বিশ্লেষণ (Analysis):</strong><br>
            যেহেতু এই উপাত্তে Mean (৯৩), Median (৯৩) এবং Mode (৯৩.৩৩) প্রায় সমান, তাই আমরা বলতে পারি এই উপাত্তটি একটি <strong>Symmetrical Distribution</strong> বা স্বাভাবিক বিন্যাসের কাছাকাছি।
        </div>
    </div>

    <div class="reference">
        <strong>রেফারেন্স:</strong><br>
        * Zar, J. H. (2010). Biostatistical Analysis.<br>
        * Mahajan, B. K. (2010). Methods in Biostatistics.
    </div>
</div>