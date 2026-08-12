---
title: "IELTS Reading Trainer"
permalink: /ielts/reading/
layout: single
classes: wide ielts-reading-page
sidebar:
  nav: "ielts"
author_profile: false
excerpt: "A local-first IELTS Reading Trainer for timed passage work, evidence-based review and a browser-local error log."
---

<link rel="stylesheet" href="{{ '/assets/css/ielts-hub.css' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/ielts-reading-trainer.css' | relative_url }}">

<section class="ielts-reading" data-ielts-reading-trainer data-certification-surface="phase-2d" aria-labelledby="ielts-reading-title">
  <header class="ielts-reading__header">
    <p class="ielts-reading__eyebrow">Phase 2D · Reading Trainer MVP</p>
    <h1 id="ielts-reading-title">Read for evidence, not familiarity.</h1>
    <p>Work through an original academic-style passage, answer under controlled time, then review the exact evidence behind each decision.</p>
  </header>

  <section class="ielts-reading__panel" aria-labelledby="reading-setup-title">
    <div class="ielts-reading__panel-heading">
      <div>
        <p class="ielts-reading__label">Choose practice set</p>
        <h2 id="reading-setup-title">Select a passage</h2>
      </div>
      <button class="btn" type="button" data-reading-new-set>New passage</button>
    </div>
    <div class="ielts-reading__setup-grid">
      <div>
        <label class="ielts-reading__field-label" for="readingSetSelect">Reading set</label>
        <select id="readingSetSelect" data-reading-set aria-describedby="readingSetHelp"></select>
        <p id="readingSetHelp" class="ielts-reading__help">Each set uses original LBFL practice content and six questions.</p>
      </div>
      <div>
        <span class="ielts-reading__field-label">Current attempt</span>
        <strong data-reading-attempt>Attempt 1</strong>
      </div>
    </div>
  </section>

  <section class="ielts-reading__panel ielts-reading__timer-panel" aria-labelledby="reading-timer-title">
    <div class="ielts-reading__timer-box" role="timer" aria-label="Reading practice timer">
      <span class="ielts-reading__label">Passage time</span>
      <strong data-reading-timer>20:00</strong>
    </div>
    <div class="ielts-reading__timer-copy">
      <h2 id="reading-timer-title">Twenty-minute passage discipline</h2>
      <p data-reading-timer-status aria-live="polite">Timer ready. You can also practise without starting it.</p>
      <div class="ielts-reading__controls" aria-label="Reading timer controls">
        <button class="btn btn--primary" type="button" data-reading-start>Start</button>
        <button class="btn" type="button" data-reading-pause disabled>Pause</button>
        <button class="btn" type="button" data-reading-reset-timer>Reset timer</button>
      </div>
    </div>
  </section>

  <div class="ielts-reading__workspace">
    <article class="ielts-reading__panel ielts-reading__passage" tabindex="-1" aria-labelledby="reading-passage-title">
      <p class="ielts-reading__label" data-reading-topic>Academic reading</p>
      <h2 id="reading-passage-title" data-reading-title>Reading passage</h2>
      <div class="ielts-reading__passage-copy" data-reading-passage></div>
    </article>

    <section class="ielts-reading__panel" aria-labelledby="reading-questions-title">
      <p class="ielts-reading__label">Question set</p>
      <h2 id="reading-questions-title">Make each answer evidence-based</h2>
      <p class="ielts-reading__help">Answer all six if possible. Unanswered items count as errors when you submit for review.</p>
      <div class="ielts-reading__questions" data-reading-questions></div>
      <div class="ielts-reading__actions">
        <button class="btn btn--primary" type="button" data-reading-submit>Submit &amp; review</button>
        <button class="btn" type="button" data-reading-retry>Retry same passage</button>
      </div>
      <p class="ielts-reading__save-status" data-reading-save-status aria-live="polite">Answers are stored only in this browser.</p>
    </section>
  </div>

  <section class="ielts-reading__panel ielts-reading__result" data-reading-result tabindex="-1" hidden aria-labelledby="reading-result-title">
    <p class="ielts-reading__label">Review result</p>
    <h2 id="reading-result-title">Accuracy snapshot</h2>
    <p data-reading-result-summary></p>
  </section>

  <section class="ielts-reading__panel" aria-labelledby="reading-error-title">
    <div class="ielts-reading__panel-heading">
      <div>
        <p class="ielts-reading__label">Local error log</p>
        <h2 id="reading-error-title">Turn mistakes into targets</h2>
        <p class="ielts-reading__error-meta" data-reading-error-count>0 saved errors</p>
      </div>
      <button class="btn" type="button" data-reading-clear-errors disabled>Clear error log</button>
    </div>
    <p class="ielts-reading__help" data-reading-error-empty>No errors have been saved yet. Submit a passage to build your local review history.</p>
    <ul class="ielts-reading__error-list" data-reading-error-list></ul>
  </section>

  <aside class="ielts-reading__notice">
    <strong>Independent educational resource.</strong> The trainer uses original LBFL practice material. Raw accuracy is for self-review only and is not an official IELTS band score or examiner assessment.
  </aside>
</section>

<script>
  window.LBFL_IELTS_READING_SETS = {{ site.data.ielts_reading_sets | jsonify }};
</script>
<script src="{{ '/assets/js/ielts-reading-trainer.js' | relative_url }}" defer></script>

<!-- Phase 2D exact-head certification surface: reading-evidence-loop-v1 -->
