---
layout: single
author_profile: true
author: "MD. Yusuf"

sidebar:
  nav: "synaptic_nav"

title: "Frequency distribution, Histogram and Polygon"
excerpt: "Advanced biological analysis and structural framework."

date: 2026-04-05T15:59:00.012Z
last_modified_at: 2026-06-09T04:13:27.000Z

permalink: /biology/higher-zoology-tree/biostatistics/frequency_distribution_histogram_and_polygon/

categories:
  - Biology
  - Higher Zoology
  - Biostatistics

tags:
  - Zoology
  - Systems-Thinking

# AI Knowledge Graph & Neural Routing
node_id: zoology-biostatistics-frequency_distribution_histogram_and_polygon
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

<style>
  .biostats-module { font-family: 'Inter', 'Tiro Bangla', sans-serif; color: #cbd5e1; line-height: 1.75; }
  .lecture-header { background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); color: white; padding: 2.5rem; border-radius: 14px; text-align: center; margin-bottom: 2rem; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
  .lecture-header h1 { margin: 0 0 10px 0; font-size: 2.2rem; font-weight: 800; color: #ffffff !important; }
  .concept-block { background: #0f172a; padding: 2rem; border-radius: 12px; margin: 2rem 0; border-left: 5px solid #00d4b2; border: 1px solid rgba(255,255,255,0.02); }
  .data-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; text-align: center; }
  .data-table th { background: #131c2e; color: #00d4b2; padding: 12px; border: 1px solid rgba(255,255,255,0.05); }
  .data-table td { padding: 12px; border: 1px solid rgba(255,255,255,0.05); color: #cbd5e1; }
</style>

<div class="biostats-module">
  <div class="lecture-header">
    <h1>📊 উপাত্তের উপস্থাপন ও গ্রাফিক্যাল বিশ্লেষণ</h1>
    <p style="color: #00d4b2; font-weight: 600;">Presentation and Graphical Analysis of Data</p>
  </div>

  <div class="concept-block">
    <h3 style="color: #ffffff; margin-top: 0; font-size: 1.4rem;">গাণিতিক উদাহরণ: ৫০ জন শিক্ষার্থীর উচ্চতা</h3>
    <p>ধরুন, একটি কলেজের অনার্স ৪র্থ বর্ষের ৫০ জন শিক্ষার্থীর উচ্চতা (সেন্টিমিটারে) সংগ্রহ করা হয়েছে। সংগৃহীত উপাত্ত (Raw Data) নিচে দেওয়া হলো:</p>
    <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; font-family: monospace; color: #94a3b8; line-height: 1.8; border: 1px dashed rgba(255,255,255,0.1);">
      ১৫২, ১৫৮, ১৬১, ১৪৮, ১৭০, ১৫৫, ১৬৩, ১৫৯, ১৬৬, ১৫০, ১৬২, ১৫৭, ১৫১, ১৬৪, ১৬৮, ১৫৩, ১৬০, ১৫৪, ১৫৫, ১৫৬, ১৬৫, ১৭২, ১৪৭, ১৫৯, ১৬১, ১৬৩, ১৫২, ১৬৮, ১৫৮, ১৫৬, ১৬৪, ১৬৬, ১৫৩, ১৬১, ১৫৭, ১৫৯, ১৬০, ১৬৫, ১৫৪, ১৬৩, ১৬২, ১৬১, ১৬০, ১৫৮, ১৫৫, ১৫৬, ১৬১, ১৫৯, ১৬০, ১৫৭
    </div>
  </div>

  <h3 style="color: #00d4b2; margin-top: 2.5rem; font-size: 1.3rem;">১. ফ্রিকোয়েন্সি ডিস্ট্রিবিউশন টেবিল (Frequency Distribution Table)</h3>
  <p>উপাত্তগুলোকে গুছিয়ে উপস্থাপনের জন্য আমরা প্রথমে একটি গণসংখ্যা নিবেশন সারণি তৈরি করব।</p>
  
  <ul style="color: #cbd5e1; line-height: 1.8; padding-left: 1.25rem;">
    <li><strong>ধাপ ১: পরিসর (Range) নির্ণয়:</strong> সর্বোচ্চ মান = ১৭২ সে.মি., সর্বনিম্ন মান = ১৪৭ সে.মি.। পরিসর = ১৭২ - ১৪৭ = ২৫ সে.মি.।</li>
    <li><strong>ধাপ ২: শ্রেণী ব্যবধান ও সংখ্যা:</strong> ৫ সে.মি. শ্রেণী ব্যবধান নিলে, শ্রেণী সংখ্যা = ২৫ / ৫ = ৫টি।</li>
  </ul>

  <div style="overflow-x: auto; width: 100%;">
    <table class="data-table">
      <thead>
        <tr>
          <th>শ্রেণী (Class Interval)</th>
          <th>ট্যালি (Tally)</th>
          <th>গণসংখ্যা (Frequency - f)</th>
          <th>শ্রেণীর মধ্যবিন্দু (x)</th>
          <th>প্রকৃত সীমানা (Boundaries)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>১৪৬ - ১৫০</td><td>IIII</td><td>৪</td><td>১৪৮</td><td>১৪৫.৫ - ১৫০.৫</td></tr>
        <tr style="background: rgba(255,255,255,0.01);"><td>১৫১ - ১৫৫</td><td>IIII IIII</td><td>১০</td><td>১৫৩</td><td>১৫০.৫ - ১৫৫.৫</td></tr>
        <tr><td>১৫৬ - ১৬০</td><td>IIII IIII IIII II</td><td>১৭</td><td>১৫৮</td><td>১৫৫.৫ - ১৬০.৫</td></tr>
        <tr style="background: rgba(255,255,255,0.01);"><td>১৬১ - ১৬৫</td><td>IIII IIII III</td><td>১৩</td><td>১৬৩</td><td>১৬০.৫ - ১৬৫.৫</td></tr>
        <tr><td>১৬৬ - ১৭০</td><td>IIII</td><td>৪</td><td>১৬৮</td><td>১৬৫.৫ - ১৭০.৫</td></tr>
        <tr style="background: rgba(255,255,255,0.01);"><td>১৭১ - ১৭৫</td><td>II</td><td>২</td><td>১৭৩</td><td>১৭০.৫ - ১৭৫.৫</td></tr>
        <tr style="font-weight: bold; background: #131c2e;"><td style="color: #00d4b2;">মোট</td><td></td><td style="color: #ffffff;">N = ৫০</td><td></td><td></td></tr>
      </tbody>
    </table>
  </div>

  <h3 style="color: #00d4b2; margin-top: 2.5rem; font-size: 1.3rem;">২. হিস্টোগ্রাম (Histogram) ও ফ্রিকোয়েন্সি পলিগন</h3>
  <p>উপরের সারণি থেকে হিস্টোগ্রাম অঙ্কন করতে X-অক্ষে 'প্রকৃত সীমানা' এবং Y-অক্ষে 'গণসংখ্যা' স্থাপন করতে হয়। এরপর স্তম্ভগুলোর শীর্ষবিন্দুর মধ্যবিন্দুগুলো যোগ করলে 'ফ্রিকোয়েন্সি পলিগন' পাওয়া যায়।</p>

  <div class="concept-block" style="border-left-color: #3b82f6;">
    <h3 style="color: #ffffff; margin-top: 0; font-size: 1.3rem;">📚 তথ্যসূত্র (References)</h3>
    <ol style="color: #94a3b8; line-height: 1.8; padding-left: 1.25rem;">
      <li><strong>Zar, J. H. (2010).</strong> <em>Biostatistical Analysis</em>. Pearson Education (৫ম সংস্করণ)।</li>
      <li><strong>Gupta, S. P. (2014).</strong> <em>Statistical Methods</em>. Sultan Chand & Sons.</li>
    </ol>
  </div>
</div>

