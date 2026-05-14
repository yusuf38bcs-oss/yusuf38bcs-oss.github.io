layout: biostatistics
description: "Understanding range, variance, standard deviation, and coefficient of variation in biological data."
title: "বিস্তারের পরিমাপ (Measures of Dispersion)"
date: 2026-04-05T20:01:00.008Z
categories:
  - biostatistics

<div class="bio-post-container">

  <div class="text-center">
    <img src="https://blogger.googleusercontent.com/img/a/AVvXsEi3RbIBPxej7IdHBYZVR1R3baMgCaT6Ub_AIQYoetzWP1EfEES1H3HoN8UNixNdbFHOsLDFWBjAgO4BtfISItJZmwNGHTl08-gLdnUIWHyLpJdP76Hts4Q1ry-G3dHpkqAh4Goeu-DW-Oz78XbMnXcNJHt3K9wVIu8U_MoNRjbSjS1Ftf9EUcHk0vnGa4k" alt="Measures of Dispersion" class="edu-diagram-img" />
  </div>

  <h2 class="main-title text-center" style="color: #0ea5e9; margin-bottom: 30px;">📊 বিস্তারের পরিমাপ: তাত্ত্বিক আলোচনা ও গাণিতিক সমাধান</h2>

  <div class="smart-accordion">
        
    <details class="smart-details" open>
      <summary class="smart-summary">১. বিস্তারের প্রধান পরিমাপসমূহ (Theory)</summary>
      <div class="smart-content">
        <p>জীবপরিসংখ্যানে উপাত্তের নির্ভরযোগ্যতা এবং ভিন্নতা বোঝার জন্য বিস্তারের পরিমাপ অপরিহার্য।</p>
        
        <h3 style="color: #d97706;">📏 পরিসর (Range)</h3>
        <p>উপাত্তের সর্বোচ্চ ও সর্বনিম্ন মানের ব্যবধান।</p>
        <div class="math-formula-box">
          $$R = X_{max} - X_{min}$$
        </div>

        <h3 style="color: #d97706;">🔢 ভেদাঙ্ক (Variance)</h3>
        <p>গাণিতিক গড় থেকে প্রতিটি উপাত্তের দূরত্বের বর্গের গড়।</p>
        <div class="math-formula-box">
          $$s^2 = \frac{\sum(X - \bar{X})^2}{n - 1}$$
        </div>

        <h3 style="color: #d97706;">📉 পরিমিত ব্যবধান (Standard Deviation - SD)</h3>
        <p>ভেদাঙ্কের ধনাত্মক বর্গমূল। এটি উপাত্তের বিচ্যুতির সবচেয়ে জনপ্রিয় পরিমাপ।</p>
        <div class="math-formula-box">
          $$s = \sqrt{\frac{\sum(X - \bar{X})^2}{n - 1}}$$
        </div>
        
        [attachment_0](attachment)

        <h3 style="color: #d97706;">📍 আদর্শ বিভ্রম (Standard Error - SE)</h3>
        <p>নমুনা গড় পপুলেশন গড় থেকে কতটা দূরে থাকতে পারে তার পরিমাপ।</p>
        <div class="math-formula-box">
          $$SE = \frac{SD}{\sqrt{n}}$$
        </div>
      </div>
    </details>

    <details class="smart-details">
      <summary class="smart-summary">২. গাণিতিক উদাহরণ: গড় নির্ণয় (Step 1)</summary>
      <div class="smart-content">
        <p><strong>উদাহরণ:</strong> ৫টি চারাগাছের উচ্চতা (সেমি) যথাক্রমে: ৮, ১০, ১২, ১৪, ১৬।</p>
        <p>প্রথমে গড় ($\bar{X}$) নির্ণয় করি:</p>
        <div class="math-formula-box">
          $$\bar{X} = \frac{8 + 10 + 12 + 14 + 16}{5} = \frac{60}{5} = 12$$
        </div>
        <p>অতএব, গড় উচ্চতা <strong>১২ সেমি</strong>।</p>
      </div>
    </details>

    <details class="smart-details">
      <summary class="smart-summary">৩. বিচ্যুতি ও বর্গের টেবিল (Step 2)</summary>
      <div class="smart-content">
        <p>গড় ($\bar{X} = 12$) ব্যবহার করে নিচের টেবিলটি তৈরি করি:</p>
        <div class="table-wrapper">
          <table style="width: 100%; border-collapse: collapse; text-align: center;">
            <thead style="background-color: #f1f5f9;">
              <tr>
                <th style="padding: 10px; border: 1px solid #cbd5e1;">উচ্চতা ($X$)</th>
                <th style="padding: 10px; border: 1px solid #cbd5e1;">বিচ্যুতি ($X - \bar{X}$)</th>
                <th style="padding: 10px; border: 1px solid #cbd5e1;">বিচ্যুতির বর্গ $(X - \bar{X})^2$</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding: 8px; border: 1px solid #cbd5e1;">৮</td><td style="padding: 8px; border: 1px solid #cbd5e1;">-৪</td><td style="padding: 8px; border: 1px solid #cbd5e1;">১৬</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #cbd5e1;">১০</td><td style="padding: 8px; border: 1px solid #cbd5e1;">-২</td><td style="padding: 8px; border: 1px solid #cbd5e1;">৪</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #cbd5e1;">১২</td><td style="padding: 8px; border: 1px solid #cbd5e1;">০</td><td style="padding: 8px; border: 1px solid #cbd5e1;">০</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #cbd5e1;">১৪</td><td style="padding: 8px; border: 1px solid #cbd5e1;">২</td><td style="padding: 8px; border: 1px solid #cbd5e1;">৪</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #cbd5e1;">১৬</td><td style="padding: 8px; border: 1px solid #cbd5e1;">৪</td><td style="padding: 8px; border: 1px solid #cbd5e1;">১৬</td></tr>
              <tr style="background: #f8fafc; font-weight: bold;">
                <td style="padding: 8px; border: 1px solid #cbd5e1;">মোট ($\Sigma$)</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1;">০</td>
                <td style="padding: 8px; border: 1px solid #cbd5e1;">৪০</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </details>

    <details class="smart-details">
      <summary class="smart-summary">৪. SD এবং SE গণনা ও ফলাফল (Final Step)</summary>
      <div class="smart-content">
        <p><strong>পরিমিত ব্যবধান (SD) গণনা:</strong></p>
        <div class="math-formula-box">
          $$s = \sqrt{\frac{40}{5-1}} = \sqrt{\frac{40}{4}} = \sqrt{10} \approx 3.16$$
        </div>

        <p><strong>আদর্শ বিভ্রম (SE) গণনা:</strong></p>
        <div class="math-formula-box">
          $$SE = \frac{3.16}{\sqrt{5}} \approx \frac{3.16}{2.236} \approx 1.41$$
        </div>

        <div class="math-result-box">
          <strong>চুড়ান্ত ফলাফল (Mean ± SE):</strong> <br />
          <span style="color: #059669; font-size: 1.3em; font-weight: bold;">$12 \pm 1.41$ সেমি</span>
        </div>
      </div>
    </details>

  </div>

</div>
