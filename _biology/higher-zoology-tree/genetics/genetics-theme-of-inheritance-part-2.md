---

layout: single
author_profile: true
author: "MD. Yusuf"

sidebar:
  nav: "synaptic_nav"

title: "Genetics: The Theme of Inheritance - Part 2 (মেন্ডেলের ২য় সূত্র ও এপিস্ট্যাসিসের আণবিক ডিকোডিং)"
excerpt: "দ্বিসংকর ক্রসের স্বাধীন সঞ্চারণ সূত্র, প্রকট ও প্রচ্ছন্ন এপিস্ট্যাসিস, পরিপূরক জিন এবং ডুপ্লিকেট জিনের আণবিক মিথস্ক্রিয়ার গাণিতিক ও থিংকিং বিশ্লেষণ।"

date: 2026-04-10T22:10:00.000Z
last_modified_at: 2026-06-09T04:13:27.000Z

permalink: /biology/higher-zoology-tree/genetics/genetics-theme-of-inheritance-part-2/

categories:
  - Biology
  - Higher Zoology
  - Genetics

tags:
  - Dihybrid-Cross
  - Epistasis
  - Complementary-Gene
  - HSC-Biology

# AI Knowledge Graph & Neural Routing
node_id: zoology-genetics-genetics-theme-of-inheritance-part-2
parent_node: genetics
network:
  - higher-zoology-tree
  - hsc-corner
  - mcq-arena

# Synaptic Connections (Explicit Relational Mapping)
related: true
synaptic_links:
  - /biology/higher-zoology-tree/genetics/
  - /life-practices/human-behaviour/
  - /socratic/mcq-arena/genetics/

toc: true
toc_sticky: true
classes: wide

header:
  overlay_image: /assets/images/biology/genetics-banner.webp
language: en
curriculum_tracks:
  - HSC Biology
  - NEET Biology
  - IB Biology
neet_alignment: "NCERT Biology: Principles of Inheritance and Variation; Molecular Basis of Inheritance"
ib_theme: "Continuity and Change"
ib_subtopic: "Inheritance, variation, and molecular genetics"
hsc_alignment: "HSC Biology: gene, allele, heredity, variation, and genetic continuity"
concept_level: "Advanced"
---

<div style="width: 100%; max-width: 900px; margin: 0 auto 2.5rem auto; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0, 212, 178, 0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
  <img src="https://blogger.googleusercontent.com/img/a/AVvXsEjFpZkwJpGgYf6QMPE_k96uDw-vu7wx6B5Q9HmeZlMhzlrRruNsJ64e0QBffgwq-EmRuMtecpdz_cfRP9F1YXmKV3OVaFeyrRRGIB2aXjiwsOybLCyEYTXJTsR_tbmNZgi4w-df92V6BMS8BJsjN9iv2K4NBGGC0dA-2edTcgEBwu-B3LB3QwV6FqzLl3Q" alt="Genetics Dihybrid Cross and Epistasis Modeling Banner" style="width: 100%; height: auto; display: block; object-fit: cover;">
</div>

<div class="header-box" style="background: linear-gradient(135deg, #090d16 0%, #1e293b 100%); color: white; padding: 35px; border-radius: 12px; text-align: center; margin-bottom: 25px; border: 1px solid rgba(0, 212, 178, 0.15);">
    <h1 style="color: white !important; margin: 0 0 10px 0 !important; font-size: 2.2rem !important; font-weight: 800; letter-spacing: -0.02em;">🧬 মেন্ডেলের ২য় সূত্রের 'ম্যাজিক' ও এপিস্ট্যাসিসের আণবিক ডিকোডিং</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 1.1rem; color: #00d4b2; font-weight: 600;">দ্বিসংকর ক্রস (Dihybrid Cross), জিনগত মিথস্ক্রিয়া ও অনুপাত বিপর্যয়ের ক্রিটিক্যাল বিশ্লেষণ</p>
</div>

<div class="brainstorming" style="background-color: #0f172a; padding: 25px; border-radius: 12px; border-left: 6px solid #00d4b2; margin-bottom: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.25);">
    <h3 style="color: #00d4b2; margin-top: 0; font-size: 1.35rem; font-weight: 700;">🧠 ব্রেইনস্টর্মিং: আদর্শ ৯:৩:৩:১ অনুপাত কেন বদলে যায়?</h3>
    <p style="color: #cbd5e1; margin: 0; line-height: 1.7;">
        মেন্ডেল তাঁর দ্বিসংকর ক্রসে প্রমাণ করেছিলেন যে, দুই জোড়া ভিন্ন ভিন্ন বৈশিষ্ট্য গ্যামেট সৃষ্টির সময় সম্পূর্ণ স্বাধীনভাবে বিন্যস্ত হয়। কিন্তু আমরা যখন উচ্চতর ফলিত জীববিজ্ঞানের দিকে তাকাই, তখন দেখা যায় জিনের আচরণ সবসময় সোজা লাইনে চলে না। কখনো কখনো এক লোকাসের একটি জিন (Epistatic Gene), সম্পূর্ণ ভিন্ন লোকাসের অন্য একটি জিনের (Hypostatic Gene) বৈশিষ্ট্য প্রকাশে বাধা দেয় কিংবা তার কোড পরিবর্তন করে ফেলে। জিনের এই আন্তঃলোকাস অ্যারেনাকেই আমরা বলি **এপিস্ট্যাসিস (Epistasis)**। চলো এই নিউরাল কোড পরিবর্তনের গাণিতিক রহস্যগুলো উন্মোচন করি।
    </p>
</div>

<button class="accordion">📖 ১. মেন্ডেলের ২য় সূত্র: স্বাধীন সঞ্চারণ সূত্র (Law of Independent Assortment) <span style="color: #00d4b2;">+</span></button>
<div class="panel">
    <div class="panel-content-inner">
        <p><strong>মূল তত্ত্ব:</strong> দুই বা ততোধিক জোড়া বিপরীতধর্মী বৈশিষ্ট্যের মধ্যে ক্রস করালে, প্রথম অপত্য জনুতে (F1) কেবল প্রকট বৈশিষ্ট্যই প্রকাশিত হবে; কিন্তু গ্যামেট সৃষ্টির সময় প্রতিটি বৈশিষ্ট্যের জন্য দায়ী জিন জোড়া সম্পূর্ণ স্বাধীনভাবে ও আলাদাভাবে বিন্যস্ত হয়ে ভিন্ন ভিন্ন গ্যামেটে প্রবেশ করে।</p>

        <p><strong>আদর্শ মেন্ডেলিয়ান অনুপাত:</strong> <span style="color: #00d4b2; font-weight: 700;">৯ : ৩ : ৩ : ১</span> (Dihybrid Phenotypic Ratio)</p>

        [attachment_0](attachment)

        <div style="background: rgba(239, 68, 68, 0.08); border-left: 4px solid #ef4444; padding: 1rem; border-radius: 0 6px 6px 0; margin-top: 1rem; color: #cbd5e1;">
            <strong style="color: #ef4444;">🚨 ক্রোমোজোমাল সীমাবদ্ধতা (Linkage Constraint):</strong> যদি নির্বাচিত জিনের লোকাসসমূহ একই ক্রোমোজোমে খুব কাছাকাছি অবস্থান করে, তবে তারা মিয়োসিস বিভাজনের সময় স্বাধীনভাবে আলাদা হতে পারে না। এই জিনগুলোকে <strong>লিংকড জিন (Linked Genes)</strong> বলে, যা মেন্ডেলের ২য় সূত্রের প্রধান ব্যতিক্রম।
        </div>
    </div>
</div>

<button class="accordion">📊 ২. প্রকট এপিস্ট্যাসিস (Dominant Epistasis) — ১২:৩:১ বনাম ১৩:৩ <span style="color: #00d4b2;">+</span></button>
<div class="panel">
    <div class="panel-content-inner">
        <p><strong>আণবিক মেকানিজম:</strong> যখন একটি লোকাসের কোনো প্রকট জিন, অন্য লোকাসের কোনো প্রকট জিনের ফিনোটাইপিক প্রকাশকে সম্পূর্ণ মাস্ক (Mask) বা বাধা প্রদান করে, তখন তাকে প্রকট এপিস্ট্যাসিস বলে। যে জিনটি বাধা দেয় তাকে <strong>এপিস্ট্যাটিক জিন (Epistatic Gene)</strong> এবং যা বাধা পায় তাকে <strong>হাইপোস্ট্যাটিক জিন (Hypostatic Gene)</strong> বলে।</p>

        <p><strong>বাস্তব কেস স্টাডি (Summer Squash & White Leghorn):</strong>
        <br>১. গ্রীষ্মকালীন স্কোয়াশ (Summer Squash) ফলের রঙের ক্ষেত্রে প্রকট এপিস্ট্যাসিসের কারণে আদর্শ অনুপাত পরিবর্তিত হয়ে <strong>১২ : ৩ : ১</strong> হয়।
        <br>২. তবে আমাদের উচ্চ মাধ্যমিক সিলেবাসের ক্লাসিক উদাহরণ— <strong>সাদা লেগহর্ন (White Leghorn)</strong> মোরগ-মুরগির ক্ষেত্রে এটি মূলত একটি <strong>প্রকট প্রতিরোধক জিন (Inhibitory Gene)</strong> এর মিথস্ক্রিয়া, যার ফলে অনুপাতটি দাঁড়ায় ১৩ : ৩।</p>

        <p style="margin-bottom: 0.5rem; font-weight: bold; color: #ffffff;">F2 চেকারবোর্ড বিশ্লেষণ (CcIi × CcIi) — সাদা লেগহর্ন মোরগ-মুরগি:</p>
        <div style="overflow-x: auto; width: 100%;">
            <table class="genetics-table" style="text-align: center;">
                <thead>
                    <tr>
                        <th style="background-color: #131c2e; color: #00d4b2;">♂ \ ♀</th>
                        <th style="background-color: #131c2e; color: #ffffff;">CI</th>
                        <th style="background-color: #131c2e; color: #ffffff;">Ci</th>
                        <th style="background-color: #131c2e; color: #ffffff;">cI</th>
                        <th style="background-color: #131c2e; color: #ffffff;">ci</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="background-color: #131c2e; color: #ffffff;"><b>CI</b></td>
                        <td>CCII<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td>CCIi<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td>CcII<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td>CcIi<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                    </tr>
                    <tr>
                        <td style="background-color: #131c2e; color: #ffffff;"><b>Ci</b></td>
                        <td>CCIi<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.3); color: #00d4b2;"><b>CCii</b><br><span>(রঙিন)</span></td>
                        <td>CcIi<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.3); color: #00d4b2;"><b>Ccii</b><br><span>(রঙিন)</span></td>
                    </tr>
                    <tr>
                        <td style="background-color: #131c2e; color: #ffffff;"><b>cI</b></td>
                        <td>CcII<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td>CcIi<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td>ccII<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td>ccIi<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                    </tr>
                    <tr>
                        <td style="background-color: #131c2e; color: #ffffff;"><b>ci</b></td>
                        <td>CcIi<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.3); color: #00d4b2;"><b>Ccii</b><br><span>(রঙিন)</span></td>
                        <td>ccIi<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td>ccii<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p style="margin-top: 1rem;"><strong>চূড়ান্ত অনুপাত বিপর্যয়:</strong> এখানে রঙিন পালকের জন্য দায়ী জিন <b>C</b> হলেও, প্রকট এপিস্ট্যাটিক ইনহিবিটর জিন <b>I</b> এর উপস্থিতির কারণে ক্রোমোজোমাল এক্সপ্রেশন ব্লক হয়ে যায়। ফলে চূড়ান্ত ফিনোটাইপিক অনুপাত দাঁড়ায় <strong>সাদা : রঙিন = ১৩ : ৩</strong>।</p>
    </div>
</div>

<button class="accordion">🐭 ৩. প্রচ্ছন্ন এপিস্ট্যাসিস (Recessive Epistasis) — ৯:৩:৪ <span style="color: #00d4b2;">+</span></button>
<div class="panel">
    <div class="panel-content-inner">
        <p><strong>আণবিক মেকানিজম:</strong> যখন একটি লোকাসের কোনো জিন হোমোজাইগাস প্রচ্ছন্ন অবস্থায় (যেমন: <b>cc</b>) উপস্থিত থেকে অন্য লোকাসের যেকোনো প্রকট বা প্রচ্ছন্ন জিনের ফিনোটাইপিক বৈশিষ্ট্য প্রকাশে সম্পূর্ণ বাধা দেয়, তখন তাকে প্রচ্ছন্ন এপিস্ট্যাসিস বলে।</p>

        <p><strong>বাস্তব কেস স্টাডি (Mice Coat Color):</strong> ইঁদুরের গায়ের লোমের বর্ণ নির্ধারণের ক্ষেত্রে এটি স্পষ্ট দেখা যায়। এখানে ইঁদুরের স্বাভাবিক বন্য রঙ হলো অ্যাগাউটি (Agouti - ধূসর)।
        <br>• <b>C</b> জিনটি রঙ তৈরির জন্য দায়ী, কিন্তু এর প্রচ্ছন্ন অ্যালিল হোমোজাইগাস অবস্থায় (<b>cc</b>) থাকলে ইঁদুরের পিগমেন্টেশন পাথওয়ে বন্ধ হয়ে যায় এবং ইঁদুরটি সম্পূর্ণ <strong>অ্যালবিনো (সাদা)</strong> হয়।
        <br>• অন্য লোকাসের <b>A</b> জিনটি অ্যাগাউটি রঙের জন্য দায়ী, যা প্রচ্ছন্ন অবস্থায় (<b>aa</b>) থাকলে কালো রঙ তৈরি করে।</p>

        <p><strong>অনুপাত বিপর্যয়:</strong> F2 জেনারেশনে প্রচ্ছন্ন এপিস্ট্যাসিসের কারণে মেন্ডেলিয়ান ক্লাসিক অনুপাত রূপান্তরিত হয়ে দাঁড়ায় <strong>৯ (অ্যাগাউটি) : ৩ (কালো) : ৪ (অ্যালবিনো)</strong>।</p>
    </div>
</div>

<button class="accordion">🌸 ৪. পরিপূরক জিন (Complementary Gene) — ৯:৭ <span style="color: #00d4b2;">+</span></button>
<div class="panel">
    <div class="panel-content-inner">
        <p><strong>আণবিক মেকানিজম:</strong> একে দ্বৈত প্রচ্ছন্ন এপিস্ট্যাসিস (Duplicate Recessive Epistasis)-ও বলা হয়। যখন ভিন্ন ভিন্ন লোকাসে অবস্থিত দুটি পৃথক প্রকট জিনের সহ-অবস্থান বা টিমওয়ার্ক ছাড়া একটি নির্দিষ্ট ফিনোটাইপিক বৈশিষ্ট্য প্রকাশ করা অসম্ভব হয়, তখন তাদেরকে পরিপূরক জিন বলে। কোনো একটি জিন একাকী থাকলে এনজাইম পাথওয়ে সম্পূর্ণ করতে পারে না।</p>

        <p><strong>বাস্তব কেস স্টাডি (Sweet Pea):</strong> মিষ্টি মটরশুঁটি (<i>Lathyrus odoratus</i>) উদ্ভিদের ফুলের রঙ। ফুল বেগুনী হতে হলে ক্রোমোজোমে অবশ্যই অন্ততপক্ষে একটি <b>C</b> এবং একটি <b>P</b> প্রকট জিন একসাথে থাকতে হবে। কোনো একটির অনুপস্থিতিতে ফুল সাদা হয়ে যাবে।</p>

        <div style="overflow-x: auto; width: 100%;">
            <table class="genetics-table" style="text-align: center;">
                <thead>
                    <tr>
                        <th style="background-color: #131c2e; color: #00d4b2;">গ্যামেট</th>
                        <th style="background-color: #131c2e; color: #ffffff;">CP</th>
                        <th style="background-color: #131c2e; color: #ffffff;">Cp</th>
                        <th style="background-color: #131c2e; color: #ffffff;">cP</th>
                        <th style="background-color: #131c2e; color: #ffffff;">cp</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="background-color: #131c2e; color: #ffffff;"><b>CP</b></td>
                        <td style="background: rgba(162, 155, 254, 0.2); color: #a29bfe;">CCPP<br>(বেগুনী)</td>
                        <td style="background: rgba(162, 155, 254, 0.2); color: #a29bfe;">CCPp<br>(বেগুনী)</td>
                        <td style="background: rgba(162, 155, 254, 0.2); color: #a29bfe;">CcPP<br>(বেগুনী)</td>
                        <td style="background: rgba(162, 155, 254, 0.2); color: #a29bfe;">CcPp<br>(বেগুনী)</td>
                    </tr>
                    <tr>
                        <td style="background-color: #131c2e; color: #ffffff;"><b>Cp</b></td>
                        <td style="background: rgba(162, 155, 254, 0.2); color: #a29bfe;">CCPp<br>(বেগুনী)</td>
                        <td>CCpp<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td style="background: rgba(162, 155, 254, 0.2); color: #a29bfe;">CcPp<br>(বেগুনী)</td>
                        <td>Ccpp<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                    </tr>
                    <tr>
                        <td style="background-color: #131c2e; color: #ffffff;"><b>cP</b></td>
                        <td style="background: rgba(162, 155, 254, 0.2); color: #a29bfe;">CcPP<br>(বেগুনী)</td>
                        <td style="background: rgba(162, 155, 254, 0.2); color: #a29bfe;">CcPp<br>(বেগুনী)</td>
                        <td>ccPP<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td>ccPp<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                    </tr>
                    <tr>
                        <td style="background-color: #131c2e; color: #ffffff;"><b>cp</b></td>
                        <td style="background: rgba(162, 155, 254, 0.2); color: #a29bfe;">CcPp<br>(বেগুনী)</td>
                        <td>Ccpp<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td>ccPp<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                        <td>ccpp<br><span style="font-size: 0.8rem; color: #64748b;">(সাদা)</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p style="margin-top: 1rem;"><strong>অনুপাত বিপর্যয়:</strong> এই সমান্তরাল এনজাইমেটিক ব্লকেজের কারণে F2 জনুর চূড়ান্ত ফিনোটাইপিক অনুপাত দাঁড়ায় <strong>বেগুনী : সাদা = ৯ : ৭</strong>।</p>
    </div>
</div>

<button class="accordion">🎒 ৫. ডুপ্লিকেট প্রকট জিন (Duplicate Dominant Epistasis) — ১৫:১ <span style="color: #00d4b2;">+</span></button>
<div class="panel">
    <div class="panel-content-inner">
        <p><strong>আণবিক মেকানিজম:</strong> যখন দুটি ভিন্ন লোকাসে অবস্থিত পৃথক জিন সম্পূর্ণ স্বাধীনভাবে একই ফিনোটাইপিক বৈশিষ্ট্য প্রকাশ করতে সক্ষম হয়, তখন তাদের ডুপ্লিকেট প্রকট জিন বলে। অর্থাৎ, ক্রোমোজোমে যেকোনো একটি লোকাসে একটি মাত্র প্রকট অ্যালিল (যেমন: <b>A</b> বা <b>B</b>) থাকলেই চূড়ান্ত বৈশিষ্ট্য প্রকাশ পেয়ে যায়। কেবল দুটি জিনই যখন একসাথে সম্পূর্ণ প্রচ্ছন্ন হোমোজাইগাস অবস্থায় (<b>aabb</b>) থাকে, শুধুমাত্র তখনই বিকল্প বৈশিষ্ট্যটি প্রকাশিত হয়।</p>

        <p><strong>বাস্তব কেস স্টাডি (Shepherd's Purse):</strong> শেফার্ডস পার্স (<i>Capsella bursa-pastoris</i>) উদ্ভিদের বীজক্যাপসুলের আকৃতি। এখানে বীজক্যাপসুলের ত্রিকোণাকার আকৃতির জন্য দুটি ভিন্ন লোকাসের প্রকট জিনই এককভাবে দায়ী। কেবল ডাবল প্রচ্ছন্ন হোমোজাইগাস অবস্থায় এটি লাটিম আকৃতির (Ovoid) হয়।</p>

        <p><strong>অনুপাত বিপর্যয়:</strong> এই রিডান্ড্যান্ট কোডিং ব্যাকআপের কারণে F2 জেনারেশনের চূড়ান্ত অনুপাত দাঁড়ায় <strong>ত্রিকোণাকার : লাটিম আকৃতি = ১৫ : ১</strong>।</p>
    </div>
</div>

<button class="accordion">📐 ৬. শিখন মূল্যায়ন ও ইন্টারেক্টিভ কুইজ পোর্টাল <span style="color: #00d4b2;">+</span></button>
<div class="panel">
    <div class="panel-content-inner">
        <p style="font-weight: bold; color: #ffffff; margin-bottom: 0.5rem;">নিচের উদ্দীপকটি মনোযোগ সহকারে পড়ো এবং স্ব-মূল্যায়ন করো:</p>
        <div style="font-style: italic; color: #cbd5e1; background: #0f172a; padding: 20px; border-left: 4px solid #00d4b2; margin: 15px 0; border-radius: 6px; border: 1px solid rgba(255,255,255,0.02); border-left: 4px solid #00d4b2;">
            "একটি এক্সপেরিমেন্টাল বায়োলজি ল্যাবে দুটি সাদা ফুল বিশিষ্ট মিষ্টি মটরশুঁটি গাছের মধ্যে কৃত্রিম সংকরায়ন ঘটানোর ফলে F1 জনুর সমস্ত উদ্ভিদের ফুল বেগুনী বর্ণ ধারণ করল। কিন্তু F1 উদ্ভিদের মধ্যে স্ব-পরাগায়ন ঘটানোর পর F2 জেনারেশনে বেগুনী ফুলের পাশাপাশি আবার সাদা ফুল ফিরে এলো।"
        </div>
        <ol style="color: #cbd5e1; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem;">
            <li>উদ্দীপকের ঘটনাটি মেন্ডেলের কোন সূত্রের ব্যতিক্রম নির্দেশ করে এবং কেন?</li>
            <li>F2 জনুর চেকারবোর্ডের সাহায্যে বেগুনী ও সাদা ফুলের গাণিতিক অনুপাত প্রতিষ্ঠা করো।</li>
            <li>যোজিত প্রকট প্রভাবের (Cumulative Effect) কারণে গ্রীষ্মকালীন স্কোয়াশের ক্ষেত্রে কীভাবে ৯:৬:১ অনুপাত তৈরি হয় তা আণবিক স্তরে বিশ্লেষণ করো।</li>
        </ol>

        {% include components/quiz-render.html quiz_id="genetics" %}
    </div>
</div>

<p class="footer-line" style="text-align: center; font-weight: 700; opacity: 0.5; margin-top: 4rem; font-size: 0.85rem; color: #64748b; letter-spacing: 0.05em;">
    🧬 Genetics & Molecular Biology Series 2026 | Learning Biology For Life | learningbiologyforlife.org
</p>

<script>
    (function() {
        var acc = document.getElementsByClassName("accordion");
        for (var i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                for (var j = 0; j < acc.length; j++) {
                    if (acc[j] !== this) {
                        acc[j].classList.remove("active");
                        acc[j].nextElementSibling.style.display = "none";
                        var indicator = acc[j].querySelector('span');
                        if(indicator) indicator.innerHTML = "+";
                    }
                }
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                var currentIndicator = this.querySelector('span');
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                    if(currentIndicator) currentIndicator.innerHTML = "+";
                } else {
                    panel.style.display = "block";
                    if(currentIndicator) currentIndicator.innerHTML = "-";
                }
            });
        }
    })();
</script>

<style>
    /* Premium Collapsible Layout Module Styles matching global site parameters */
    .accordion {
        background-color: #0f172a;
        color: #ffffff;
        cursor: pointer;
        padding: 18px 22px;
        width: 100%;
        border: 1px solid rgba(255,255,255,0.04);
        text-align: left;
        outline: none;
        font-size: 1.15rem;
        font-weight: 700;
        transition: 0.2s all ease-in-out;
        border-radius: 8px;
        margin-top: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        user-select: none;
    }
    .accordion.active, .accordion:hover {
        background-color: #131c2e;
        color: #00d4b2;
        border-color: rgba(0, 212, 178, 0.25);
    }
    .panel {
        padding: 0 10px;
        display: none;
        background-color: #090d16;
        border: 1px solid rgba(0, 212, 178, 0.15);
        border-top: none;
        border-radius: 0 0 8px 8px;
        overflow: hidden;
    }
    .panel-content-inner {
        padding: 25px 15px;
        line-height: 1.85;
        color: #cbd5e1;
    }
    .panel-content-inner p { margin: 0 0 1.25rem 0; }
    .panel-content-inner ul { margin: 0 0 1.25rem 0; }

    .genetics-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.05);
        font-size: 0.95rem;
    }
    .genetics-table th, .genetics-table td {
        border: 1px solid rgba(255,255,255,0.05);
        padding: 14px;
        text-align: left;
    }
    .genetics-table td { color: #cbd5e1; }
    .genetics-table tr:nth-child(even) { background-color: rgba(255,255,255,0.01); }

    .highlight-ratio {
        background-color: rgba(0, 212, 178, 0.1);
        padding: 4px 10px;
        border-radius: 4px;
        border: 1px solid rgba(0, 212, 178, 0.3);
        display: inline-block;
        font-weight: 700;
        color: #00d4b2;
    }
</style>

