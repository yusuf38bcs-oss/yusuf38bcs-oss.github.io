---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Correlation and Regression (সহসম্বন্ধ ও নির্ভরক বিশ্লেষণ)"
excerpt: "দুটি চলকের পারস্পরিক সম্পর্কের গভীরতা এবং একটি স্বাধীন চলকের সাপেক্ষে অন্যটির গাণিতিক পূর্বাভাস দেওয়ার বায়োস্ট্যাটিস্টিক্যাল মেকানিজম।"
date: 2026-04-05T20:55:00.000Z
categories:
  - Higher Zoology Tree
  - Biostatistics & Research Methodology
tags:
  - Biostatistics
  - Correlation
  - Regression
  - Zoology
  - Research-Methodology
node_id: correlation_and_regression
---

<div style="width: 100%; max-width: 900px; margin: 0 auto 2.5rem auto; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 212, 178, 0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <img src="https://blogger.googleusercontent.com/img/a/AVvXsEiRef92V6BMS8BJsjN9iv2K4NBGGC0dA-2edTcgEBwu-B3LB3QwV6FqzLl3Q" alt="Biostatistics Data Analytics Correlation and Regression Lines Chart" style="width: 100%; height: auto; display: block; object-fit: cover;">
</div>

<div style="background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); padding: 2.5rem; border-radius: 14px; text-align: center; margin-bottom: 2.5rem; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
  <h1 style="color: #ffffff; margin: 0 0 0.75rem 0; font-weight: 800; font-size: 2.2rem; letter-spacing: -0.02em;">📊 জীবপরিসংখ্যান: সহসম্বন্ধ ও নির্ভরক বিশ্লেষণ</h1>
  <p style="margin: 0; opacity: 0.9; font-size: 1.1rem; color: #00d4b2; font-weight: 600; letter-spacing: 0.03em;">Biostatistics & Research Methodology Module</p>
</div>

<div style="background: rgba(255,255,255,0.02); border-left: 4px solid #64748b; padding: 1.5rem; margin: 2.5rem 0; border-radius: 0 8px 8px 0; color: #cbd5e1; line-height: 1.75;">
  <strong style="color: #ffffff; display: block; margin-bottom: 0.5rem; font-size: 1.05rem;">হে প্রখর চিন্তাশীল গবেষক (Active Thinkers):</strong>
  জীববিজ্ঞান কেবল ল্যাবরেটরির টেস্টটিউবেই সীমাবদ্ধ নয়; এটি হলো মহাবিশ্বের সুনিপুণ প্রকৌশলের জীবন্ত দলিল। আর এই মহাজাগতিক রণাঙ্গনে ডেটার অভ্যন্তরীণ শৃঙ্খলা ও সত্যতা উন্মোচনের হাতিয়ার হলো জীবপরিসংখ্যান (Biostatistics)। পবিত্র কুরআনে মহান আল্লাহ প্রকৃতির এই সুনির্দিষ্ট পরিমাপ ও আন্তঃসংযোগ সম্পর্কে পরম গাইডলাইন দিয়েছেন:
  <br><br>
  <em>“আমি প্রত্যেক বস্তু সৃষ্টি করেছি সুনির্দিষ্ট পরিমাপে।” (সূরা আল-ক্বামার: ৪৯)</em>
  <br>এবং
  <em>“আর তিনি প্রতিটি জিনিসকে গণনা করে হিসাব রেখেছেন।” (সূরা আল-জিন: ২৮)</em>।
  <br><br>
  প্রকৃতির এই গাণিতিক হিসাব এবং একটি ঘটনার সাথে অন্য ঘটনার যে গভীর অদৃশ্য সুতো, তাকেই আমরা কোরিলেশন ও রিগ্রেশনের চশমা দিয়ে ডিকোড করি। আসুন, মুখস্থ করার অন্ধ বৃত্ত ভেঙে ডেটার ভেতরের সেই গোপন ভাষাটিকে বোঝার চেষ্টা করি।
</div>

---

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.4rem; font-weight: 800; margin-top: 0; margin-bottom: 1rem;"><span style="color: #00d4b2;">১️⃣</span> সহসম্বন্ধ (Correlation) — জৈবিক সম্পর্কের মিটার</h3>
  <p style="color: #cbd5e1; line-height: 1.75; margin-bottom: 1.25rem;">
    প্রকৃতিতে কোনো ঘটনা বিচ্ছিন্নভাবে ঘটে না। দুটি চলক বা বৈশিষ্ট্যের মধ্যে পারস্পরিক সম্পর্কের তীব্রতার মাত্রা এবং দিক কেমন, তা পরিমাপ করার বিশুদ্ধ গাণিতিক পদ্ধতিই হলো সহসম্বন্ধ বা <strong>Correlation</strong>। একে সাধারণত $r$ দ্বারা প্রকাশ করা হয়।
  </p>

  <p style="color: #ffffff; font-weight: 700; margin-bottom: 0.5rem;">🗺️ বাস্তব জীবনের রূপক (Metaphor):</p>
  <p style="color: #94a3b8; margin-bottom: 1.5rem; line-height: 1.6;">সহসম্বন্ধ হলো দুটি বন্ধুর মিতালীর মতো। তারা একে অপরের ওপর কতটা প্রভাব ফেলে এবং একসাথে কোন দিকে হাঁটে, কোরিলেশন মূলত সেটুকুই পরিমাপ করে।</p>

  <ul style="padding-left: 1.25rem; color: #cbd5e1; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
    <li><strong style="color: #00d4b2;">ধনাত্মক সহসম্বন্ধ (Positive Correlation):</strong> একটি চলক বাড়লে অন্যটিও সমানুপাতিক হারে বাড়ে।
      <br><span style="font-size: 0.9rem; color: #64748b;">[জৈবিক উদাহরণ]: উদ্ভিদের বয়স বৃদ্ধির সাথে সাথে তার পাতার সংখ্যা বা উচ্চতা বৃদ্ধি পাওয়া; অথবা মানবদেহে ক্যালসিয়াম গ্রহণের মাত্রার সাথে হাড়ের ঘনত্ব বৃদ্ধি।</span>
    </li>
    <li><strong style="color: #00d4b2;">ঋণাত্মক সহসম্বন্ধ (Negative Correlation):</strong> একটি চলক বাড়লে অন্যটি বিপরীত হারে কমে যায়।
      <br><span style="font-size: 0.9rem; color: #64748b;">[জৈবিক উদাহরণ]: একটি জলাশয়ে শিকারী মাছের সংখ্যা বাড়লে ছোট পোনা মাছের সংখ্যা কমে যাওয়া; অথবা কোনো অরণ্যে দূষণের মাত্রা বাড়লে জীববৈচিত্র্যের সূচক হ্রাস পাওয়া।</span>
    </li>
    <li><strong style="color: #00d4b2;">শূন্য সহসম্বন্ধ (Zero Correlation):</strong> চলক দুটির মধ্যে কোনো দৃশ্যমান বা গাণিতিক যোগসূত্র নেই।
      <br><span style="font-size: 0.9rem; color: #64748b;">[জৈবিক উদাহরণ]: একজন মানুষের বুদ্ধিমত্তার স্কোরের সাথে তার রক্তে লোহিত রক্তকণিকার (RBC) সংখ্যার কোনো সম্পর্ক না থাকা।</span>
    </li>
  </ul>

  <div style="background: #131c2e; border: 1px solid rgba(0, 212, 178, 0.15); border-left: 5px solid #00d4b2; padding: 1.25rem; border-radius: 8px; color: #cbd5e1; line-height: 1.6;">
    📌 <strong>পরম গাণিতিক সীমা রুল:</strong> সহসম্বন্ধ গুণাঙ্ক বা কোরিলেশন কো-অফিসিয়েন্টের মান সর্বদা $-1$ থেকে $+1$ এর সীমার মধ্যে আবদ্ধ থাকে:
    <div style="margin: 0.75rem 0; text-align: center; font-size: 1.2rem; font-weight: 700;">
      $$r \in [-1, +1]$$
    </div>
    $r = +1$ হলে চলক দুটির মধ্যে <strong>পূর্ণ ধনাত্মক</strong> এবং $r = -1$ হলে <strong>পূর্ণ ঋণাত্মক</strong> রৈখিক সম্পর্ক বোঝায়। $r = 0$ মানে চলক দুটি সম্পূর্ণ স্বাধীন।
  </div>
</div>

---

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.4rem; font-weight: 800; margin-top: 0; margin-bottom: 1rem;"><span style="color: #00d4b2;">২️⃣</span> বিক্ষেপ চিত্র (Scatter Diagram) — সম্পর্কের ভিজ্যুয়াল ম্যাপ</h3>
  <p style="color: #cbd5e1; line-height: 1.7; margin-bottom: 1.5rem;">
    গাণিতিক জটিল সমীকরণে যাওয়ার আগে যখন সংগৃহীত উপাত্তগুলোকে গ্রাফ পেপারে স্বাধীন চলকসমূহকে $X$-অক্ষে এবং নির্ভরশীল চলকসমূহকে $Y$-অক্ষে বিন্দু (Dots) দিয়ে প্লট করা হয়, তখন যে চিত্র তৈরি হয় তাকে <strong>Scatter Diagram</strong> বলে। এটি মূলত ডেটার একটি ভিজ্যুয়াল প্রোটোটাইপ। এই বিন্দুর বিন্যাস বা ঝোঁক দেখেই একজন গবেষক এক সেকেন্ডে ধরে ফেলতে পারেন যে চলক দুটির সম্পর্ক সোজা উপরের দিকে উঠছে (ধনাত্মক), নাকি নিচের দিকে নামছে (ঋণাত্মক)।
  </p>
</div>

---

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.4rem; font-weight: 800; margin-top: 0; margin-bottom: 1rem;"><span style="color: #00d4b2;">৩️⃣</span> নির্ভরক বিশ্লেষণ (Linear Regression) — পূর্বাভাসের মেশিন</h3>
  <p style="color: #cbd5e1; line-height: 1.75; margin-bottom: 1.5rem;">
    সহসম্বন্ধ কেবল আমাদের জানায় সম্পর্ক আছে কি নেই। কিন্তু সেই সম্পর্কের ওপর ভিত্তি করে গাণিতিক পূর্বাভাস (Prediction) করার কোনো ক্ষমতা কোরিলেশনের নেই। এখানেই প্রয়োজন হয় <strong>Regression</strong> বা নির্ভরক বিশ্লেষণ। এটি এমন একটি গাণিতিক মডেল যার মাধ্যমে একটি জানা স্বাধীন চলকের ($X$) মানের ওপর ভিত্তি করে অজানা নির্ভরশীল চলকের ($Y$) মান আগে থেকেই নিখুঁতভাবে অনুমান করা যায়।
  </p>

  <div style="background: #131c2e; border: 1px solid rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; border-top: 4px solid #3b82f6;">
    <h4 style="color: #ffffff; font-size: 1.15rem; margin-top: 0; font-weight: 700; margin-bottom: 0.75rem;">📐 লিনিয়ার রিগ্রেশন সমীকরণ (The Predictive Formula):</h4>
    <div style="margin: 1.25rem 0; text-align: center; font-size: 1.5rem; font-weight: 700; color: #00d4b2;">
      $$Y = a + bX$$
    </div>

    <p style="color: #ffffff; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.95rem;">ইঞ্জিনিয়ারিং ব্যবচ্ছেদ নোড:</p>
    <ul style="padding-left: 1.25rem; color: #94a3b8; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem;">
      <li><strong style="color: #e2e8f0;">$Y$ (Dependent Variable):</strong> নির্ভরশীল চলক—যার মান আমরা প্রেডিক্ট করতে চাই (যেমন: ফসলের চূড়ান্ত ফলন)।</li>
      <li><strong style="color: #e2e8f0;">$X$ (Independent Variable):</strong> স্বাধীন চলক—যার মান আমাদের জানা আছে (যেমন: জমিতে প্রয়োগকৃত সারের পরিমাণ)।</li>
      <li><strong style="color: #e2e8f0;">$a$ (Y-intercept):</strong> ধ্রুবক বা ইন্টারসেপ্ট। যখন স্বাধীন চলক $X=0$, তখন $Y$-এর বেসলাইন মান কত, এটি তা নির্দেশ করে।</li>
      <li><strong style="color: #e2e8f0;">$b$ (Slope / Regression Coefficient):</strong> রেখার ঢাল বা নির্ভরক গুণাঙ্ক। স্বাধীন চলক $X$ এক ইউনিট বাড়লে নির্ভরশীল চলক $Y$ ঠিক কতটুকু গতিতে বাড়বে বা কমবে, এটি তার স্পিডোমিটার।</li>
    </ul>
  </div>
</div>

---

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.4rem; font-weight: 800; margin-top: 0; margin-bottom: 1rem;"><span style="color: #00d4b2;">৪️⃣</span> গাণিতিক কেস স্টাডি: শিক্ষার্থীর উচ্চতা ও ওজনের বায়োমেট্রিক ম্যাপিং</h3>
  <p style="color: #cbd5e1; line-height: 1.7; margin-bottom: 1.25rem;">
    <strong>বাস্তব সমস্যা:</strong> একটি ল্যাব ক্লাসে ৫ জন শিক্ষার্থীর উচ্চতা ($X$, সেমি) এবং ওজন ($Y$, কেজি) পরিমাপ করা হলো। এদের মধ্যকার কার্ল পিয়ারসন সহসম্বন্ধ গুণাঙ্ক ($r$) নির্ণয় করে সম্পর্কটি গাণিতিক স্তরে বিশ্লেষণ করো।
  </p>

  <div style="overflow-x: auto; width: 100%; margin: 1.5rem 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem; text-align: center; border: 1px solid rgba(255,255,255,0.05);">
      <thead>
        <tr style="background-color: #131c2e;">
          <th style="color: #00d4b2; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">উচ্চতা ($X$)</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">ওজন ($Y$)</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">$X^2$</th>
          <th style="color: #ffffff; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">$Y^2$</th>
          <th style="color: #00d4b2; padding: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.05);">$XY$</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">১৫০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৫০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">২২৫০০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">২৫০০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৭৫০০</td>
        </tr>
        <tr style="background-color: rgba(255,255,255,0.01);">
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">১৬০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৬০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">২৫৬০০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৩৬০০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৯৬০০</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">১৭০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৭০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">২৮৯০০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৪৯০০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">১১৯০০</td>
        </tr>
        <tr style="background-color: rgba(255,255,255,0.01);">
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">১৮০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৮০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৩২৪০০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৬৪০০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">১৪৪০০</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">১৯০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৯০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৩৬১০০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">৮১০০</td>
          <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1;">১৭১০০</td>
        </tr>
        <tr style="background-color: #131c2e; font-weight: bold;">
          <td style="color: #00d4b2; padding: 12px; border: 1px solid rgba(255,255,255,0.05);">$\sum X = 850$</td>
          <td style="color: #ffffff; padding: 12px; border: 1px solid rgba(255,255,255,0.05);">$\sum Y = 350$</td>
          <td style="color: #ffffff; padding: 12px; border: 1px solid rgba(255,255,255,0.05);">$\sum X^2 = 145500$</td>
          <td style="color: #ffffff; padding: 12px; border: 1px solid rgba(255,255,255,0.05);">$\sum Y^2 = 25500$</td>
          <td style="color: #00d4b2; padding: 12px; border: 1px solid rgba(255,255,255,0.05);">$\sum XY = 60500$</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="background: #131c2e; border: 1px solid rgba(255,255,255,0.02); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
    <p style="margin: 0 0 0.75rem 0; font-weight: 700; color: #ffffff;">কার্ল পিয়ারসনের সহসম্বন্ধ সূত্র:</p>
    $$r = \frac{n(\sum XY) - (\sum X)(\sum Y)}{\sqrt{[n\sum X^2 - (\sum X)^2][n\sum Y^2 - (\sum Y)^2]}}$$
  </div>

  <p style="color: #cbd5e1; margin-top: 1rem;">এখানে মোট নমুনা সংখ্যা, $n = 5$। সমীকরণে মানগুলো ইনপুট দিলে আমরা পাই:</p>
  <div style="margin: 1.25rem 0; text-align: center; font-size: 1.25rem; font-weight: 700; color: #00d4b2;">
    $$r = \frac{5(60500) - (850)(350)}{\sqrt{[5(145500) - (850)^2][5(25500) - (350)^2]}} = 1.0$$
  </div>

  <p style="margin: 1rem 0 0 0; font-weight: bold; color: #00d4b2; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.15); padding: 14px; border-radius: 6px; font-size: 0.95rem; line-height: 1.6;">
    📊 <strong>বৈজ্ঞানিক সিদ্ধান্ত:</strong> যেহেতু $r = +1$, সেহেতু গাণিতিকভাবে প্রমাণিত হলো যে এই শিক্ষার্থীদের উচ্চতা ও ওজনের মধ্যে একটি নিখুঁত <strong>পূর্ণ ধনাত্মক রৈখিক সম্পর্ক</strong> বিদ্যমান। অর্থাৎ উচ্চতা যে সুনির্দিষ্ট অনুপাতে বাড়ছে, ওজনের বৃদ্ধিও ঠিক একই গাণিতিক ধারা মেনে সমান্তরালভাবে চলছে।
  </p>
</div>

---

<div style="background: #0b1324; border: 2px dashed rgba(0, 212, 178, 0.3); padding: 25px; border-radius: 12px; margin-top: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
  <h3 style="color: #00d4b2; font-size: 1.3rem; font-weight: 700; margin-top: 0; margin-bottom: 1rem;">💡 ব্রেনস্টর্মিং ও উচ্চতর চিন্তন চ্যালেঞ্জ (Correlation $\neq$ Causation)</h3>
  <p style="color: #ffffff; font-weight: 700; margin-bottom: 0.5rem;">বাস্তব দৃশ্যকল্প:</p>
  <p style="color: #cbd5e1; margin-bottom: 1.25rem; line-height: 1.6;">
    একটি সামুদ্রিক পরিবেশ গবেষণায় দেখা গেল, সমুদ্রতীরে আইসক্রিম বিক্রির পরিমাণের ($X$) সাথে সাগরে হাঙ্গরের আক্রমণের সংখ্যার ($Y$) সহসম্বন্ধের মান এসেছে অত্যন্ত উচ্চ এবং ধনাত্মক ($r = +0.85$)।
  </p>
  <p style="color: #ffffff; font-weight: 700; margin-bottom: 0.5rem;">ক্রিটিক্যাল থিংকিং চ্যালেঞ্জ:</p>
  <p style="color: #cbd5e1; line-height: 1.7; margin: 0;">
    এই গাণিতিক ফলাফলের ওপর ভিত্তি করে তুমি কি এই পলিসিগত সিদ্ধান্তে নেবে যে আইসক্রিম খাওয়া বাড়ার কারণেই হাঙ্গর মানুষকে বেশি আক্রমণ করছে? যদি তা না হয়, তবে এখানে লুকিয়ে থাকা তৃতীয় কোন বায়োলজিক্যাল ও এনভায়রনমেন্টাল চলকটি (Confounding Variable) পর্দার আড়াল থেকে এই দুই চলকের স্ট্রং কোরিলেশন নিয়ন্ত্রণ করছে? জীববিজ্ঞানের আলোকে তোমার যুক্তিনির্ভর উত্তর দাও!
  </p>
</div>

{% include components/quiz-render.html quiz_id="biostatistics" %}

<p class="footer-line" style="text-align: center; font-weight: 700; opacity: 0.5; margin-top: 4rem; font-size: 0.85rem; color: #64748b; letter-spacing: 0.05em;">
  📊 Biostatistics & Research Methodology Series 2026 | Learning Biology For Life | learningbiologyforlife.org
</p>
