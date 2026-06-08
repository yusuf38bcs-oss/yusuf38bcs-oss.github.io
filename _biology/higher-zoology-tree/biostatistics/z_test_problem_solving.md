---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Z Test: Problem Solving"
date: 2026-04-05T19:06:00.005Z
categories:
  - Biostatistics
node_id: z_test_problem_solving
---

<style>
  .biostats-module { font-family: 'Inter', 'Tiro Bangla', sans-serif; color: #cbd5e1; line-height: 1.75; }
  .lecture-header { background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); color: white; padding: 2.5rem; border-radius: 14px; text-align: center; margin-bottom: 2rem; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
  .concept-block { background: #0f172a; padding: 2rem; border-radius: 12px; margin: 2rem 0; border-left: 5px solid #00d4b2; border: 1px solid rgba(255,255,255,0.02); }
  .math-center { text-align: center; font-size: 1.25rem; font-weight: bold; color: #00d4b2; margin: 1.5rem 0; padding: 1.5rem; background: #131c2e; border-radius: 8px; border: 1px solid rgba(0, 212, 178, 0.15); }
  .conclusion-box { background: rgba(39, 174, 96, 0.05); border-left: 4px solid #27ae60; padding: 1.5rem; margin-top: 1.5rem; border-radius: 0 8px 8px 0; color: #cbd5e1; }
</style>

<div class="biostats-module">

  <div class="lecture-header">
    <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 2.2rem; font-weight: 800;">গাণিতিক উদাহরণ: পাঙ্গাশ মাছের গড় ওজন যাচাই (Z-test)</h1>
    <p style="color: #00d4b2; font-weight: 600; margin: 0;">Biostatistical Hypothesis Testing (Large Sample)</p>
  </div>

  <div class="concept-block">
    <h3 style="color: #ffffff; font-size: 1.3rem; margin-top: 0;">ধাপ ১: নাস্তিক ও বিকল্প কল্পনা (Hypothesis)</h3>
    <p>গবেষণার শুরুতে আমরা দুটি বিপরীতধর্মী কল্পনা গ্রহণ করি:</p>
    <ul style="padding-left: 1.25rem; line-height: 1.8;">
      <li><strong>নাস্তিক কল্পনা ($H_0$):</strong> $\mu = 1.5$ (খামারের মাছের গড় ওজন সাধারণ ওজনের সমান, কোনো পার্থক্য নেই)</li>
      <li><strong>বিকল্প কল্পনা ($H_a$):</strong> $\mu > 1.5$ (খামারের মাছের গড় ওজন সাধারণ ওজনের চেয়ে উল্লেখযোগ্যভাবে বেশি)</li>
    </ul>
  </div>

  <div class="concept-block" style="border-left-color: #3b82f6;">
    <h3 style="color: #ffffff; font-size: 1.3rem; margin-top: 0;">ধাপ ২: প্রয়োজনীয় উপাত্তসমূহ</h3>
    <ul style="list-style: none; padding-left: 0; line-height: 1.8;">
      <li>🔹 পপুলেশন গড় ($\mu$) = ১.৫ কেজি</li>
      <li>🔹 স্যাম্পল গড় ($\bar{X}$) = ১.৫৬ কেজি</li>
      <li>🔹 আদর্শ বিচ্যুতি ($\sigma$) = ০.২০ কেজি</li>
      <li>🔹 নমুনার সংখ্যা ($n$) = ১০০</li>
      <li>🔹 সার্থকতা স্তর ($\alpha$) = ০.০৫ (৫%)</li>
    </ul>
  </div>

  <div class="concept-block">
    <h3 style="color: #ffffff; font-size: 1.3rem; margin-top: 0;">ধাপ ৩: Z-মান গণনা</h3>
    <p>Z-test এর সূত্রটি ব্যবহার করে আমরা পাই:</p>
    <div class="math-center">
      $$Z = \frac{\bar{X} - \mu}{\sigma / \sqrt{n}}$$
    </div>
    <p>মান বসিয়ে পরবর্তী হিসাব:</p>
    <div class="math-center">
      $$Z = \frac{1.56 - 1.5}{0.20 / \sqrt{100}} = \frac{0.06}{0.02} = 3.0$$
    </div>
    <p><strong>গণনাকৃত মান (Calculated Value):</strong> $Z = 3.0$</p>
  </div>

  <div class="concept-block" style="border-left-color: #facc15;">
    <h3 style="color: #ffffff; font-size: 1.3rem; margin-top: 0;">ধাপ ৪: সিদ্ধান্ত গ্রহণ</h3>
    <p>৫% সার্থকতা স্তরে একমুখী পরীক্ষার জন্য Z-এর সংকট মান (Table Value) হলো <strong>১.৬৪৫</strong>।</p>
    <div style="text-align: center; border-left: none; border-top: 3px solid #e74c3c; background: rgba(231, 76, 60, 0.05); padding: 1.5rem; margin: 1.5rem 0; border-radius: 8px;">
      <p>যেহেতু আমাদের গণনাকৃত মান $(Z = 3.0)$ টেবিল মান $(1.645)$ অপেক্ষা বড়:</p>
      <p style="font-weight: bold; font-size: 1.5rem; color: #e74c3c; margin: 10px 0;">$$3.0 > 1.645$$</p>
    </div>
    <p>সুতরাং, আমরা নাস্তিক কল্পনা ($H_0$) বর্জন করছি।</p>
  </div>

  <div class="concept-block" style="border-left-color: #27ae60;">
    <h3 style="color: #ffffff; font-size: 1.3rem; margin-top: 0;">ধাপ ৫: চূড়ান্ত মন্তব্য</h3>
    <div class="conclusion-box">
      ✅ <strong>ফলাফল:</strong> ৫% সার্থকতা স্তরে এটি প্রমাণিত যে, এই খামারের পাঙ্গাশ মাছের গড় ওজন সাধারণ গড় ওজনের চেয়ে উল্লেখযোগ্যভাবে বেশি। উন্নত চাষ পদ্ধতি বা পুষ্টিকর খাবারের কারণে এই ইতিবাচক পরিবর্তন এসেছে বলে গবেষক দাবি করতে পারেন।
    </div>
  </div>

</div>

{% include components/quiz-render.html quiz_id="biostatistics" %}
