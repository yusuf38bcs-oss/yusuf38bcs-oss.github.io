---

layout: single
author_profile: true
author: "MD. Yusuf"

sidebar:
  nav: "synaptic_nav"

title: "Z-test and its Significance & Chi-Square test"
excerpt: "Advanced biological analysis and structural framework."

date: 2026-04-05T19:36:00.012Z
last_modified_at: 2026-06-09T04:13:27.000Z

permalink: /biology/higher-zoology-tree/biostatistics/z-test-z-test-and-its-significance-chi-square-test/

categories:
  - Biology
  - Higher Zoology
  - Biostatistics

tags:
  - Z-Test
  - Chi-Square Test
  - Non-Parametric Statistics
  - Biostatistics Lectures

# AI Knowledge Graph & Neural Routing
node_id: zoology-biostatistics-z-test-z-test-and-its-significance-chi-square-test
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
language: en
curriculum_tracks:
  - HSC Zoology
  - IB Biology
  - Research Methods
neet_alignment: "Biology data interpretation, z-test, and chi-square test"
ib_theme: "Not Applicable"
ib_subtopic: "Z-test and chi-square significance"
hsc_alignment: "Higher Zoology: z-test, significance, and chi-square test"
concept_level: "Advanced"
---

<div class="neural-banner-card" style="margin: 1.5em 0; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); background: #0b1329; padding: 10px;">
  <img src="https://blogger.googleusercontent.com/img/a/AVvXsEhrrRwNJyREN6BzQuklCoWtewlRwBVFYGuyrm3iePiIgU5USaK9CbKC2zScsRccWSSty6cIPqphtVnPVVIHSVOdMIuqFnJSUhUiLjirkjLz1wJM6_wxZ9n7uy3u-OMpQPXXcHSUO1qg2ktJEtCUBR8bYsRjO0w-kJYT_Is_C-0-C52xsh9NHbnfv2U6I8g" alt="Biostatistics Analytical Hub Banner" style="width: 100%; height: auto; display: block; border-radius: 8px;">
</div>

<div class="notice--info" style="background: rgba(0, 212, 178, 0.05); border-left: 4px solid #00d4b2; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 2em;">
  <h3 style="margin-0; font-family: 'Sovereign-Neural'; color: #00d4b2;"><i class="fas fa-graduation-cap"></i> 🎓 অনার্স ৪র্থ বর্ষ: জীবপরিসংখ্যান লেকচার নোড</h3>
  <p style="margin: 5px 0 0 0; color: #abb2bf;">প্যারামেট্রিক Z-Test এর তাৎপর্য বিশ্লেষণ এবং কার্ল পেয়ারসনের কাই-বর্গ (Chi-Square) অ-প্যারামেট্রিক টেস্টের গভীর গাণিতিক মূল্যায়ন।</p>
</div>

## 📊 ১. Z-Test: মাছের গড় ওজন যাচাই ও সার্থকতা

যখন কোনো জীবতাত্ত্বিক গবেষণায় নমুনার আকার বড় হয় ($n \ge 30$) এবং পপুলেশনের আদর্শ বিচ্যুতি ($\sigma$) জানা থাকে, তখন পপুলেশন গড়ের সত্যতা যাচাইয়ে আমরা Z-Test ব্যবহার করি।

<div class="notice--warning" style="background: rgba(230, 126, 34, 0.04); border-left: 4px solid #e67e22; padding: 15px; border-radius: 0 8px 8px 0; margin: 1.5em 0;">
  <strong>📌 বাস্তব সমস্যা (Case Study):</strong> 
  বাংলাদেশের একটি নির্দিষ্ট অঞ্চলের প্রাকৃতিক জলাশয়ের পাঙ্গাশ মাছের প্রমিত গড় ওজন ১.৫ কেজি এবং আদর্শ বিচ্যুতি ($\sigma$) = ০.২০ কেজি। একটি কৃত্রিম মৎস্য খামার থেকে দৈবচয়ন পদ্ধতিতে ১০০টি মাছ সংগ্রহ করে তাদের গড় ওজন পাওয়া গেল ১.৫৬ কেজি। ৫% সার্থকতা স্তরে ($\alpha = 0.05$) যাচাই করো যে খামারের মাছের ওজন কি সাধারণ গড়ের চেয়ে উল্লেখযোগ্যভাবে বেশি?
</div>

### 🧮 গাণিতিক সমাধান ও গণনা প্রক্রিয়া

#### ক. পরিসংখ্যানিক কল্পনা নির্ধারণ
* **নাস্তিক কল্পনা ($H_0$):** $\mu = 1.5$ কেজি *(খামারের মাছের গড় ওজন ও প্রাকৃতিক মাছের ওজনের মধ্যে কোনো বাস্তব পার্থক্য নেই।)*
* **বিকল্প কল্পনা ($H_a$):** $\mu > 1.5$ কেজি *(খামারের মাছের গড় ওজন প্রাকৃতিক মাছের ওজনের চেয়ে উল্লেখযোগ্যভাবে বেশি।)*

#### খ. উপাত্তের বিন্যাস ও Z-মান নির্ণয়
এখানে প্রদত্ত উপাত্তসমূহ হলো: নমুনার গড় $\bar{X} = 1.56$, পপুলেশন গড় $\mu = 1.5$, আদর্শ বিচ্যুতি $\sigma = 0.20$, এবং নমুনা সংখ্যা $n = 100$। Z-Test এর মূল গাণিতিক সূত্রানুযায়ী:

$$Z = \frac{\bar{X} - \mu}{\frac{\sigma}{\sqrt{n}}}$$

$$Z = \frac{1.56 - 1.5}{\frac{0.20}{\sqrt{100}}} = \frac{0.06}{\frac{0.20}{10}} = \frac{0.06}{0.02} = 3.0$$

* 📈 **গণনাকৃত মান (Calculated Z-Value):** $Z_{cal} = 3.0$

### ⚖️ সার্থকতা যাচাই ও সিদ্ধান্ত

৫% সার্থকতা স্তরে ($\alpha = 0.05$) ডানমুখী একতরফা পরীক্ষার (One-tailed Test) জন্য পরিসংখ্যানিক টেবিল থেকে প্রাপ্ত Z-এর সংকট মান (Critical Table Value) হলো **১.৬৪৫**।

<div class="notice--success" style="background: rgba(39, 174, 96, 0.04); border-left: 4px solid #27ae60; padding: 15px; border-radius: 0 8px 8px 0; margin: 1.5em 0;">
  <strong>🎯 চূড়ান্ত সিদ্ধান্ত:</strong> 
  যেহেতু আমাদের গণনাকৃত মান ($Z_{cal} = 3.0$) সংকট টেবিল মান ($১.৬৪৫$) অপেক্ষা বড় ($3.0 > 1.645$), সেহেতু গাণিতিক নিয়ম অনুযায়ী আমরা নাস্তিক কল্পনাটি ($H_0$) বর্জন করছি। অর্থাৎ, এটি পরিসংখ্যানিকভাবে সুদৃঢ়ভাবে প্রমাণিত যে উক্ত খামারের পাঙ্গাশ মাছের গড় ওজন সাধারণ জলাশয়ের মাছের চেয়ে **উল্লেখযোগ্যভাবে বেশি (Statistically Significant)**।
</div>

---

## 🧬 ২. কাই-বর্গ পরীক্ষা (Chi-Square Test - $\chi^2$)

১৯০০ সালে বিখ্যাত বিজ্ঞানী **কার্ল পিয়ারসন (Karl Pearson)** এই অত্যন্ত শক্তিশালী অ-প্যারামেট্রিক (Non-parametric Test) পরীক্ষাটি উদ্ভাবন করেন। এটি মূলত গুণগত বা শ্রেণীবদ্ধ উপাত্তের (Qualitative or Categorical Data) ক্ষেত্রে পর্যবেক্ষণকৃত মানের সাথে প্রত্যাশিত তাত্ত্বিক মানের সামঞ্জস্যতা যাচাইয়ে ব্যবহৃত হয়।

### 🧫 ক. গুডনেস অফ ফিট (Goodness of Fit)

এই পরীক্ষার মাধ্যমে যাচাই করা হয় যে মাঠপর্যায় থেকে সংগৃহীত বাস্তব উপাত্ত কোনো পূর্বনির্ধারিত তাত্ত্বিক বা বংশগতীয় অনুপাত (যেমন: মেন্ডেলের মটরশুঁটির ৩:১ মনোহাইব্রিড অনুপাত) মেনে চলে কি না। এর গাণিতিক পরিমাপক সূত্রটি নিম্নরূপ:

$$\chi^2 = \sum \frac{(O - E)^2}{E}$$

* এখানে, $O = \text{Observation Value (পর্যবেক্ষণকৃত মান)}$
* $E = \text{Expected Value (প্রত্যাশিত মান)}$

> 💡 **আদর্শ উদাহরণ:** একটি জেনেটিক ক্রসে মোট ৪০০টি উদ্ভিদের মধ্যে তাত্ত্বিকভাবে ৩০০টি লম্বা এবং ১০০টি খাটো হওয়ার কথা। যদি বাস্তবেও হুবহু ৩০০টি লম্বা ও ১০০টি খাটো উদ্ভিদ পাওয়া যায়, তবে পর্যবেক্ষণকৃত ও প্রত্যাশিত মানের ব্যবধান শূন্য হওয়ায় $\chi^2 = 0$ হবে; যা নির্দেশ করে বাস্তব উপাত্ত তাত্ত্বিক মডেলের সাথে নিখুঁতভাবে মিলে গেছে।

### 📊 খ. কন্টিনজেন্সি টেবিল ও স্বাধীনতার মাত্রা (Contingency Table & $df$)

দুটি স্বাধীন গুণগত বৈশিষ্ট্যের (যেমন: ধূমপানের অভ্যাস এবং ফুসফুসের ক্যান্সারের প্রাদুর্ভাব) মধ্যে পারস্পরিক কোনো নির্ভরতা বা সম্পর্ক আছে কি না, তা যাচাইয়ের জন্য **Independence Test** করা হয়। এই পরীক্ষার উপাত্তসমূহকে $r \times c$ কন্টিনজেন্সি টেবিলে সাজানো হয়।

* 📐 **স্বাধীনতার মাত্রা (Degrees of Freedom - $df$):** $$df = (r - 1)(c - 1)$$
  *(এখানে $r = \text{Row number}$ এবং $c = \text{Column number}$)*

---

### ⚠️ কাই-বর্গ পরীক্ষার প্রধান শর্তাবলী (Core Assumptions)

কাই-বর্গ পরীক্ষার গাণিতিক নির্ভুলতা বজায় রাখতে নিচের প্রমিত শর্তসমূহ পূরণ হওয়া বাধ্যতামূলক:

1. **বৃহৎ নমুনা আকার:** মোট নমুনা সংখ্যা ($N$) অন্তত **৫০** বা তার বেশি হতে হবে।
2. **প্রত্যাশিত মানের সীমা:** কন্টিনজেন্সি টেবিলের কোনো ঘরের প্রত্যাশিত মান ($E$) কোনো অবস্থাতেই **৫ এর কম** হওয়া যাবে না। যদি কম হয়, তবে 'ইয়েটস কারেকশন' (Yates's Correction) ব্যবহার করা আবশ্যক।
3. **স্বাধীন চয়ন:** প্রতিটি পর্যবেক্ষণ বা উপাত্ত সম্পূর্ণ স্বাধীন হতে হবে।

<div class="notice--primary" style="background: rgba(0, 212, 178, 0.02); padding: 15px; border: 1px dashed rgba(0, 212, 178, 0.3); border-radius: 8px; margin: 1.5em 0;">
  <strong>💡 ওমেগা বায়োস্ট্যাট টিপস:</strong> মনে রাখবেন, $\chi^2$ এর চূড়ান্ত মান যত কম হবে, আমাদের পর্যবেক্ষণকৃত বাস্তব ডাটার সাথে তাত্ত্বিক প্রত্যাশিত ডাটার মিল তত বেশি হবে। পরবর্তী সেশনে আমরা কাই-বর্গের একটি সম্পূর্ণ গাণিতিক টেবিল সমাধান লাইভ স্টাডি করব।
</div>