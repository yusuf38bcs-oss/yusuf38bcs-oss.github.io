---
layout: single
author_profile: true
author: "MD. Yusuf"

sidebar:
  nav: "synaptic_nav"

title: "Measures of Central Tendency"
excerpt: "জীবপরিসংখ্যানের (Biostatistics) মূল ভিত্তি: চলক, উপাত্তের শ্রেণীবিন্যাস এবং কেন্দ্রীয় প্রবণতার পরিমাপসমূহের (গড়, মধ্যমা ও প্রচুরক) একটি সুসংগঠিত মডুলার বিশ্লেষণ।"

date: 2026-05-05T06:20:00.000Z
last_modified_at: 2026-06-09T04:13:27.000Z

permalink: /biology/higher-zoology-tree/biostatistics/measures_of_central_tendency/

categories:
  - Biology
  - Higher Zoology
  - Biostatistics

tags:
  - Central-Tendency
  - Mean
  - Median
  - Mode
  - Data-Types

# AI Knowledge Graph & Neural Routing
node_id: zoology-biostatistics-measures_of_central_tendency
parent_node: biostatistics
network:
  - higher-zoology-tree
  - hsc-corner
  - mcq-arena

# Synaptic Connections (Explicit Relational Mapping)
related: true
synaptic_links:
  - /biology/higher-zoology-tree/biostatistics/
  - /life-practices/human-behaviour/
  - /socratic/mcq-arena/biostatistics/

toc: true
toc_sticky: true
classes: wide

header:
  overlay_image: /assets/images/biology/biostatistics-banner.webp
---

<div style="background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); padding: 2.5rem; border-radius: 14px; text-align: center; margin-bottom: 2.5rem; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
  <h1 style="color: #ffffff; margin: 0 0 0.75rem 0; font-weight: 800; font-size: 2.2rem; letter-spacing: -0.02em;">📊 জীবপরিসংখ্যানের ভিত্তি ও কেন্দ্রীয় প্রবণতা</h1>
  <p style="margin: 0; opacity: 0.9; font-size: 1.1rem; color: #00d4b2; font-weight: 600; letter-spacing: 0.03em;">Biostatistical Analysis & Central Tendency Node</p>
</div>

<div style="background: rgba(255,255,255,0.02); border-left: 4px solid #64748b; padding: 1.5rem; margin: 2.5rem 0; border-radius: 0 8px 8px 0; color: #cbd5e1; line-height: 1.75;">
  <strong style="color: #ffffff; display: block; margin-bottom: 0.5rem; font-size: 1.05rem;">হে প্রখর চিন্তাশীল গবেষক (Active Thinkers):</strong>
  ল্যাবরেটরির টেস্টটিউব কিংবা মাঠ পর্যায়ের বাস্তুতন্ত্র থেকে আমরা যে বিপুল তথ্য বা ডেটা সংগ্রহ করি, তার গভীরে লুকিয়ে থাকে প্রকৃতির সুনির্দিষ্ট গাণিতিক শৃঙ্খলা। কোনো ডেটাসেটের মানগুলো কোন কেন্দ্রের দিকে পুঞ্জীভূত হওয়ার প্রবণতা দেখায়—তা নির্ণয় করাই জীবপরিসংখ্যানের (Biostatistics) অন্যতম প্রধান কাজ। আসুন, ডেটার ভেতরের সেই কাঠামোগত ভাষাকে নিখুঁত মডুলার ব্লকের মাধ্যমে ডিকোড করি।
</div>

---

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.4rem; font-weight: 800; margin-top: 0; margin-bottom: 1.25rem;"><span style="color: #00d4b2;">1️⃣</span> ডেটা আর্কিটেকচারের মৌলিক উপাদানসমূহ</h3>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
    <div style="background: #131c2e; padding: 1.25rem; border-radius: 8px; border-left: 4px solid #00d4b2;">
      <strong style="color: #ffffff; font-size: 1.05rem; display: block; margin-bottom: 0.5rem;">চলক (Variable)</strong>
      <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.5; margin: 0;">জীবের যেকোনো পরিমাপযোগ্য বৈশিষ্ট্য যা একক থেকে এককে পরিবর্তিত হয়। যেমন: রক্তচাপ, উদ্ভিদের উচ্চতা।</p>
    </div>
    <div style="background: #131c2e; padding: 1.25rem; border-radius: 8px; border-left: 4px solid #00d4b2;">
      <strong style="color: #ffffff; font-size: 1.05rem; display: block; margin-bottom: 0.5rem;">উপাত্ত (Data)</strong>
      <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.5; margin: 0;">চলকের পরিমাপকৃত মানসমূহের বৈজ্ঞানিক সমষ্টি। যেমন: ৫ জন মানুষের রক্তে গ্লুকোজের মাত্রা (mg/dL)।</p>
    </div>
  </div>
</div>

---

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.3rem; font-weight: 800; margin-top: 0; margin-bottom: 0.75rem;"><span style="color: #00d4b2;">📊</span> ১. গাণিতিক গড় (Arithmetic Mean)</h3>
  <div style="background: #131c2e; border: 1px solid rgba(0, 212, 178, 0.15); padding: 1.25rem; border-radius: 8px; color: #cbd5e1; margin: 1.25rem 0;">
    <span style="color: #ffffff; font-weight: 700; display: block; margin-bottom: 0.5rem;">গাণিতিক সমীকরণ:</span>
    $$\bar{X} = \frac{\sum_{i=1}^{n} X_i}{n}$$
  </div>
</div>

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.3rem; font-weight: 800; margin-top: 0; margin-bottom: 0.75rem;"><span style="color: #00d4b2;">📊</span> ২. মধ্যমা (Median)</h3>
  <p style="color: #cbd5e1; line-height: 1.7;"><strong>সংজ্ঞা:</strong> উপাত্তগুলোকে মানের ক্রমানুসারে (ছোট থেকে বড় বা বড় থেকে ছোট) সাজালে যে মানটি ঠিক মাঝখানে অবস্থান করে এবং সমগ্র ডেটাসেটকে সমান দুটি ভাগে বিভক্ত করে, তাকে মধ্যমা বলে।</p>
</div>

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.3rem; font-weight: 800; margin-top: 0; margin-bottom: 0.75rem;"><span style="color: #00d4b2;">📊</span> ৩. প্রচুরক (Mode)</h3>
  <p style="color: #cbd5e1; line-height: 1.7;"><strong>সংজ্ঞা:</strong> কোনো ডেটাসেটের মধ্যে যে মানটি সবচেয়ে বেশিবার পুনরাবৃত্তি ঘটে অর্থাৎ যার গণসংখ্যা (Frequency) সর্বাধিক, তাকে প্রচুরক বলে।</p>
</div>

{% include components/quiz-render.html quiz_id="biostatistics" %}

