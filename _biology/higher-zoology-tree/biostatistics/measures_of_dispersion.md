---
layout: single
author_profile: true
author: "MD. Yusuf"

sidebar:
  nav: "synaptic_nav"

title: "Measures of Dispersion: বিস্তৃতি"
excerpt: "Advanced biological analysis and structural framework."

date: 2026-04-11T09:22:00.007Z
last_modified_at: 2026-06-09T04:13:27.000Z

permalink: /biology/higher-zoology-tree/biostatistics/measures_of_dispersion/

categories:
  - Biology
  - Higher Zoology
  - Biostatistics

tags:
  - Zoology
  - Systems-Thinking

# AI Knowledge Graph & Neural Routing
node_id: zoology-biostatistics-measures_of_dispersion
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
  <h1 style="color: #ffffff; margin: 0 0 0.75rem 0; font-weight: 800; font-size: 2.2rem; letter-spacing: -0.02em;">📊 বিস্তারের পরিমাপ (Measures of Dispersion)</h1>
  <p style="margin: 0; opacity: 0.9; font-size: 1.1rem; color: #00d4b2; font-weight: 600; letter-spacing: 0.03em;">জীবপরিসংখ্যানে উপাত্তের নির্ভরযোগ্যতা যাচাইয়ের সহজ পাঠ</p>
</div>

<div style="background: rgba(250, 204, 21, 0.05); border-left: 4px solid #facc15; padding: 1.5rem; margin: 2.5rem 0; border-radius: 0 8px 8px 0; color: #cbd5e1; line-height: 1.75;">
  <strong style="color: #facc15; display: block; margin-bottom: 0.5rem; font-size: 1.05rem;">📚 রেফারেন্স নোট:</strong>
  এই ব্লগের সকল গাণিতিক সূত্র আন্তর্জাতিকভাবে স্বীকৃত মেডিকেল স্ট্যাটিসটিক্স বই <em>"Fundamentals of Biostatistics" (Bernard Rosner)</em> থেকে ক্রসচেক করা হয়েছে।
</div>

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.3rem; font-weight: 800; margin-top: 0; margin-bottom: 0.75rem;">১. পরিসর (Range) 📏</h3>
  <div style="background: #131c2e; border-left: 4px solid #10b981; padding: 1.25rem; text-align: center; font-size: 1.25rem; font-weight: bold; color: #10b981;">
    $$R = X_{\max} - X_{\min}$$
  </div>
</div>

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.3rem; font-weight: 800; margin-top: 0; margin-bottom: 0.75rem;">২. ভেদাঙ্ক (Variance - $s^2$) 🔢</h3>
  <div style="background: #131c2e; border-left: 4px solid #10b981; padding: 1.25rem; text-align: center; font-size: 1.25rem; font-weight: bold; color: #10b981;">
    $$s^2 = \frac{\sum (X - \bar{X})^2}{n - 1}$$
  </div>
</div>

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.3rem; font-weight: 800; margin-top: 0; margin-bottom: 0.75rem;">৩. পরিমিত ব্যবধান (Standard Deviation - SD) 📈</h3>
  <div style="background: #131c2e; border-left: 4px solid #10b981; padding: 1.25rem; text-align: center; font-size: 1.25rem; font-weight: bold; color: #10b981;">
    $$s = \sqrt{\frac{\sum (X - \bar{X})^2}{n - 1}}$$
  </div>
</div>

<div style="background: #090d16; border: 1px solid rgba(255,255,255,0.02); padding: 2rem; border-radius: 12px; margin: 2rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
  <h3 style="color: #ffffff; font-size: 1.3rem; font-weight: 800; margin-top: 0; margin-bottom: 0.75rem;">৪. আদর্শ বিভ্রম (Standard Error of Mean - SEM) 📐</h3>
  <div style="background: #131c2e; border-left: 4px solid #10b981; padding: 1.25rem; text-align: center; font-size: 1.25rem; font-weight: bold; color: #10b981;">
    $$SE = \frac{SD}{\sqrt{n}}$$
  </div>
</div>

