---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "বিস্তারের পরিমাপ (Measures of Dispersion)"
date: 2026-04-05T20:01:00.008Z
categories:
  - Biostatistics
tags:
  - Measures of Dispersion
  - Standard Deviation
  - Standard Error
  - Biostatistics Lectures
---

<div class="neural-banner-card" style="margin: 1.5em 0; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); background: #0b1329; padding: 10px;">
  <img src="https://blogger.googleusercontent.com/img/a/AVvXsEi3RbIBPxej7IdHBYZVR1R3baMgCaT6Ub_AIQYoetzWP1EfEES1H3HoN8UNixNdbFHOsLDFWBjAgO4BtfISItJZmwNGHTl08-gLdnUIWHyLpJdP76Hts4Q1ry-G3dHpkqAh4Goeu-DW-Oz78XbMnXcNJHt3K9wVIu8U_MoNRjbSjS1Ftf9EUcHk0vnGa4k" alt="Measures of Dispersion Banner Matrix" style="width: 100%; height: auto; display: block; border-radius: 8px;">
</div>

## 📊 বিস্তারের প্রধান পরিমাপসমূহ (Theoretical Framework)

जीवপরিসংখ্যানে কেন্দ্রীয় প্রবণতার পরিমাপসমূহ (যেমন: গড়, মধ্যমা) কোনো উপাত্ত সেটের প্রতিনিধিত্বকারী মান প্রকাশ করলেও উপাত্তের এককগুলো একে অপরের থেকে কতটা দূরে অবস্থান করছে তা জানাতে পারে না। উপাত্তের নির্ভরযোগ্যতা, সমজাতীয়তা এবং বিচ্যুতির গভীরতা বিশ্লেষণের জন্য **বিস্তারের পরিমাপ (Measures of Dispersion)** অপরিহার্য।


---

### 📐 বিস্তারের মূল গাণিতিক সূচকসমূহ

#### ১. পরিসর (Range - $R$)
উপাত্ত সেটের অন্তর্ভুক্ত সর্বোচ্চ মান ও সর্বনিম্ন মানের পরম ব্যবধানই হলো পরিসর। এটি বিস্তারের সবচেয়ে সহজ ও দ্রুততম পরিমাপক।
$$R = X_{max} - X_{min}$$

#### ২. ভেদাঙ্ক (Variance - $s^2$)
কোনো তথ্য সারির গাণিতিক গড় থেকে প্রতিটি উপাত্তের বিচ্যুতির বর্গের সমষ্টিকে মোট নমুনা সংখ্যা অপেক্ষা ১ কম ($n - 1$) দিয়ে ভাগ করলে যে মান পাওয়া যায়, তাকে নমুনা ভেদাঙ্ক বলে।
$$s^2 = \frac{\sum (X - \bar{X})^2}{n - 1}$$

#### ৩. পরিমিত ব্যবধান (Standard Deviation - $SD$ বা $s$)
ভেদাঙ্কের ধনাত্মক বর্গমূলকে পরিমিত ব্যবধান বলা হয়। জীববিজ্ঞানের গবেষণায় উপাত্তের বিচ্যুতির গভীরতা পরিমাপের জন্য এটি পৃথিবীর সবচেয়ে জনপ্রিয় ও নিখুঁত বৈজ্ঞানিক সূচক।
$$s = \sqrt{\frac{\sum (X - \bar{X})^2}{n - 1}}$$

#### ৪. আদর্শ বিভ্রম (Standard Error of the Mean - $SE$)
নমুনা থেকে প্রাপ্ত গড় মূল পপুলেশনের প্রকৃত গড় থেকে কতটা দূরে বিচ্যুত থাকতে পারে, তার তাত্ত্বিক পরিমাপই হলো আদর্শ বিভ্রম। এটি নমুনার আকারের ওপর সরাসরি নির্ভরশীল।
$$SE = \frac{s}{\sqrt{n}}$$

---

## 🧮 গাণিতিক উদাহরণ ও ধাপে ধাপে সমাধান

<div class="notice--info" style="background: rgba(0, 212, 178, 0.05); border-left: 4px solid #00d4b2; padding: 15px; border-radius: 0 8px 8px 0; margin: 1.5em 0;">
  <strong>📌 সমস্যা:</strong> একটি ল্যাবরেটরিতে নিয়ন্ত্রিত পরিবেশে চাষ করা ৫টি চারাগাছের উচ্চতা (সেমি) যথাক্রমে পাওয়া গেল: $৮, ১০, ১২, ১৪, ১৬$। উক্ত উপাত্তের পরিমিত ব্যবধান ($SD$) এবং আদর্শ বিভ্রম ($SE$) নির্ণয় করো।
</div>

### 🔹 ধাপ ১: গাণিতিক গড় ($\bar{X}$) নির্ণয়
প্রথমে সংগৃহীত ৫টি নমুনার গড় মান গণনা করি ($n = ৫$):

$$\bar{X} = \frac{8 + 10 + 12 + 14 + 16}{5}$$

$$\bar{X} = \frac{60}{5} = 12\text{ সেমি}$$

---

### 🔹 ধাপ ২: বিচ্যুতি ও বর্গের তথ্য বিন্যাস টেবিল

গড় মান ($\bar{X} = ১২$) এর সাপেক্ষে প্রতিটি এককের বিচ্যুতির বর্গ গণনা করার জন্য নিচের প্রমিত টেবিলটি তৈরি করা হলো:

<table style="width: 100%; border-collapse: collapse; margin: 1.5em 0; text-align: center; font-size: 0.95em; box-shadow: 0 5px 15px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
  <thead>
    <tr style="background-color: #0b1329; color: #00d4b2; font-weight: bold;">
      <th style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">গাছের উচ্চতা ($X$)</th>
      <th style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">গড় থেকে বিচ্যুতি ($X - \bar{X}$)</th>
      <th style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">বিচ্যুতির বর্গ ($(X - \bar{X})^2$)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: rgba(255,255,255,0.02); color: #abb2bf;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$৮$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15); font-family: 'Times New Roman';">$-৪$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15); font-weight: 600;">$১৬$</td>
    </tr>
    <tr style="background-color: rgba(0, 212, 178, 0.02); color: #abb2bf;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১০$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15); font-family: 'Times New Roman';">$-২$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15); font-weight: 600;">$৪$</td>
    </tr>
    <tr style="background-color: rgba(255,255,255,0.02); color: #abb2bf;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১২$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15); font-family: 'Times New Roman';">$০$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15); font-weight: 600;">$০$</td>
    </tr>
    <tr style="background-color: rgba(0, 212, 178, 0.02); color: #abb2bf;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১৪$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15); font-family: 'Times New Roman';">$২$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15); font-weight: 600;">$৪$</td>
    </tr>
    <tr style="background-color: rgba(255,255,255,0.02); color: #abb2bf;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$১৬$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15); font-family: 'Times New Roman';">$৪$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15); font-weight: 600;">$১৬$</td>
    </tr>
    <tr style="background-color: #0b1329; color: #00d4b2; font-weight: bold;">
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">মোট ($\sum$)</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15); font-family: 'Times New Roman';">$০$</td>
      <td style="padding: 12px; border: 1px solid rgba(0, 212, 178, 0.15);">$\sum (X - \bar{X})^2 = ৪0$</td>
    </tr>
  </tbody>
</table>

---

### 🔹ধাপ ৩: পরিমিত ব্যবধান ($SD$) এবং আদর্শ বিভ্রম ($SE$) গণনা

টেবিল থেকে প্রাপ্ত মানসমূহ প্রমিত সূত্রে বসিয়ে চূড়ান্ত বিস্তারের সূচক নির্ণয় করা হলো:

#### ক. পরিমিত ব্যবধান ($s$)
$$s = \sqrt{\frac{40}{5 - 1}} = \sqrt{\frac{40}{4}} = \sqrt{10}$$

$$s \approx 3.16\text{ সেমি}$$

#### খ. নমুনা গড়ের আদর্শ বিভ্রম ($SE$)
$$SE = \frac{3.16}{\sqrt{5}} \approx \frac{3.16}{2.236} \approx 1.41\text{ সেমি}$$

---

### ✅ চূড়ান্ত বৈজ্ঞানিক ফলাফল ডিক্লেয়ারেশন

<div class="notice--success" style="background: rgba(39, 174, 96, 0.05); border-left: 4px solid #27ae60; padding: 20px; border-radius: 0 8px 8px 0; margin: 1.5em 0; text-align: center;">
  📊 <strong>গবেষণার চূড়ান্ত রিপোর্ট (Mean $\pm$ SE):</strong> <br />
  <span style="color: #27ae60; font-size: 1.5em; font-weight: bold; display: inline-block; margin-top: 10px;">$$১২ \pm ১.৪১\text{ সেমি}$$</span>
  <p style="margin: 10px 0 0 0; font-size: 0.95em; color: #abb2bf; font-weight: 500;">তাত্ত্বিক ব্যাখ্যা: এটি নির্দেশ করে যে উক্ত ল্যাবের চারাগাছগুলোর গড় উচ্চতা ১২ সেমি হলেও মূল পপুলেশনের গড় মানটি সর্বোচ্চ ১.৪১ সেমি এদিক-ওদিক বিচ্যুত হতে পারে।</p>
</div>

<hr style="border-top: 1px dashed rgba(0, 212, 178, 0.2);" />

<p style="color: #888; font-style: italic; text-align: center;">💡 <strong>পরবর্তী লেকচার নোড:</strong> আমরা পরবর্তী সেশনে বিস্তারের আপেক্ষিক পরিমাপক অর্থাৎ <strong>Coefficient of Variation (বিভদাঙ্ক - CV)</strong> এবং এর তুলনামূলক প্রয়োগ নিয়ে বিস্তারিত আলোচনা করব।</p>