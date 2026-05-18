---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "কাই-বর্গ পরীক্ষা (Chi-square Test) "
date: 2026-04-11T09:53:00.007Z
categories:
  - Biostatistics
---

<p></p><div class="separator" style="clear: both; text-align: center;"><a href="https://blogger.googleusercontent.com/img/a/AVvXsEgTCqRrk8TmLuAEgUkmepnqVKei-SCf2JxM7vEzGXV2niZWa9T2_di0OPAOWiKNOBEcMiPV7QSIbBG3YHUjYJ8ZTj2GBvnUKCeL2iYtlF2UmiZMcn350VUdbGYvt-zH0QMCvsWTDdZyYJHMXqVbxmshuVe99yAI1vT1KhPnjc3ShHt93UEY_GnbL7Y3dKU" style="margin-left: 1em; margin-right: 1em;"><img alt="" data-original-height="559" data-original-width="1024" height="175" src="https://blogger.googleusercontent.com/img/a/AVvXsEgTCqRrk8TmLuAEgUkmepnqVKei-SCf2JxM7vEzGXV2niZWa9T2_di0OPAOWiKNOBEcMiPV7QSIbBG3YHUjYJ8ZTj2GBvnUKCeL2iYtlF2UmiZMcn350VUdbGYvt-zH0QMCvsWTDdZyYJHMXqVbxmshuVe99yAI1vT1KhPnjc3ShHt93UEY_GnbL7Y3dKU" width="320" /></a></div><br />&nbsp;<p></p>
<html lang="bn">
<head>
<meta charset="UTF-8"></meta>
<meta content="width=device-width, initial-scale=1.0" name="viewport"></meta>
<title>কাই-বর্গ পরীক্ষা (Chi-square Test) - বায়োস্ট্যাটিস্টিকস</title>

<link href="https://fonts.googleapis.com/css2?family=Tiro+Bangla&amp;family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet"></link>

<style>
    /* হিরো সেকশন স্টাইল */
    .feature-hero-junction {
        background: linear-gradient(135deg, rgba(22, 160, 133, 0.9) 0%, rgba(44, 62, 80, 0.8) 100%), 
                    url('https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1200');
        background-size: cover;
        background-position: center;
        height: 380px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 40px;
        box-shadow: 0 10px 30px rgba(22, 160, 133, 0.2);
        border-bottom: 6px solid #16a085;
        overflow: hidden;
    }

    .hero-overlay {
        text-align: center;
        padding: 30px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        max-width: 85%;
    }

    .hero-main-title {
        color: #ffffff !important;
        font-size: 38px !important;
        font-weight: 900 !important;
        margin: 10px 0 !important;
        font-family: 'Tiro Bangla', serif;
    }

    .cyan-text { color: #00e5ff; }

    /* মেইন কন্টেইনার */
    .biology-lecture-container {
        font-family: 'Inter', 'Tiro Bangla', sans-serif;
        line-height: 1.8;
        color: #2c3e50;
        max-width: 850px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
    }

    h2 { color: #16a085; border-bottom: 2px solid #16a085; padding-bottom: 10px; margin-top: 30px; }

    .intro-box {
        padding: 25px;
        background-color: #f1f8f7;
        border-left: 5px solid #16a085;
        font-size: 1.1em;
        margin-bottom: 25px;
        border-radius: 0 10px 10px 0;
    }

    details {
        background: #f9f9f9;
        padding: 15px 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        margin-bottom: 15px;
        transition: all 0.3s ease;
    }

    details[open] { background: #fff; border-color: #16a085; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

    summary {
        font-weight: 700;
        cursor: pointer;
        color: #2c3e50;
        font-size: 1.15em;
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .formula-box {
        background: #f4f7f6;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        font-size: 1.3em;
        margin: 15px 0;
        border: 1px dashed #16a085;
    }

    .biostat-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }

    .biostat-table th { background: #16a085; color: white; padding: 12px; }
    .biostat-table td { border: 1px solid #ddd; padding: 10px; text-align: center; }

    .tip-box {
        background-color: #e8f4fd;
        border: 1px solid #3498db;
        padding: 20px;
        border-radius: 10px;
        margin-top: 30px;
    }
</style>
</head>
<body>

<div class="biology-lecture-container">

    <div class="feature-hero-junction">
        <div class="hero-overlay">
            <h2 class="hero-main-title">কাই-বর্গ পরীক্ষা <br /><span class="cyan-text">(Chi-square Test)</span></h2>
            <div style="background: #00e5ff; height: 3px; margin: 15px auto; width: 50px;"></div>
            <p style="color: #e0f7fa; font-size: 18px;">গুডনেস অফ ফিট এবং কন্টিনজেন্সি টেবিল বিশ্লেষণ</p>
        </div>
    </div>

    <div class="intro-box">
        অনার্স ৪র্থ বর্ষের জীবপরিসংখ্যান (Biostatistics) কোর্সে <strong>Chi-square (χ²) test</strong> একটি অত্যন্ত রোমাঞ্চকর বিষয়। বিশেষ করে বংশগতিবিদ্যা বা জেনেটিক্সের (Mendelian Genetics) গবেষণায় এটি অপরিহার্য। ১৯০০ সালে কার্ল পিয়ারসন এই পরীক্ষাটি উদ্ভাবন করেন।
    </div>

    

    <details open="">
        <summary>১. গুডনেস অফ ফিট (Goodness of Fit)</summary>
        <div style="padding-top: 15px;">
            <p>এটি যাচাই করে যে, আমাদের সংগৃহীত উপাত্ত কোনো নির্দিষ্ট তাত্ত্বিক অনুপাতকে (যেমন- মেন্ডেলের ৩:১ অনুপাত) মেনে চলে কি না।</p>
            <div class="formula-box">
                χ² = Σ [ (O - E)² / E ]
            </div>
            <p>এখানে, O = পর্যবেক্ষণকৃত মান এবং E = প্রত্যাশিত মান।</p>
        </div>
    </details>

    <details>
        <summary>📊 গাণিতিক উদাহরণ: মেন্ডেলের মটরশুঁটি পরীক্ষা</summary>
        <div style="padding-top: 15px;">
            <p><strong>সমস্যা:</strong> ৪০০টি গাছের মধ্যে ৩০০টি লম্বা এবং ১০০টি খাটো। এটি কি ৩:১ অনুপাত সমর্থন করে?</p>
            <table class="biostat-table">
                <thead>
                    <tr>
                        <th>বৈশিষ্ট্য</th>
                        <th>O</th>
                        <th>E</th>
                        <th>(O-E)²/E</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>লম্বা</td><td>৩০০</td><td>৩০০</td><td>০</td></tr>
                    <tr><td>খাটো</td><td>১০০</td><td>১০০</td><td>০</td></tr>
                </tbody>
                <tr style="background: #f1f8f7; font-weight: bold;">
                    <td colspan="3">মোট χ² মান</td>
                    <td>০</td>
                </tr>
            </table>
            <p><strong>সিদ্ধান্ত:</strong> যেহেতু গণনাকৃত মান (০) টেবিল মান (৩.৮৪) এর চেয়ে ছোট, তাই এটি মেন্ডেলের তত্ত্বকে নিখুঁতভাবে সমর্থন করে।</p>
        </div>
    </details>

    

    <details>
        <summary>২. কন্টিনজেন্সি টেবিল (Contingency Table)</summary>
        <div style="padding-top: 15px;">
            <p>যখন দুটি বৈশিষ্ট্যের মধ্যে কোনো সম্পর্ক আছে কি না তা যাচাই করা হয় (যেমন- ধূমপান এবং ফুসফুসের ক্যান্সারের সম্পর্ক), তখন এটি ব্যবহার করা হয়। একে <strong>Test of Independence</strong>-ও বলা হয়।</p>
            <p><strong>স্বাধীনতার মাত্রা (df):</strong> df = (r - 1)(c - 1)</p>
            
        </div>
    </details>

    <details>
        <summary>⚠️ Chi-square টেস্টের শর্তাবলী</summary>
        <div style="padding-top: 15px;">
            <ul style="list-style-type: disc; padding-left: 20px;">
                <li>মোট নমুনা সংখ্যা (N) অন্তত ৫০ হতে হবে।</li>
                <li>কোনো সেলের প্রত্যাশিত মান (E) ৫-এর কম হওয়া উচিত নয়।</li>
                <li>উপাত্তগুলো অবশ্যই গণসংখ্যা (Frequency) হতে হবে, কোনো শতাংশ নয়।</li>
            </ul>
        </div>
    </details>

    <div class="tip-box">
        <h4>💡 ব্লগার টিপস:</h4>
        <p>আপনার শিক্ষার্থীদের বুঝিয়ে দেবেন যে, <strong>χ² এর মান যত কম হবে</strong>, Observed এবং Expected মানের মধ্যে মিল তত বেশি হবে। অর্থাৎ নাস্তিক কল্পনা গ্রহণ করার সম্ভাবনা বাড়বে।</p>
    </div>

</div>

</body>
</html>