---
title: "IELTS Writing Lab"
permalink: /ielts/writing/
layout: single
classes: wide ielts-writing-page
sidebar:
  nav: "ielts"
author_profile: false
excerpt: "A local-first IELTS Academic Writing Lab for planning, timed writing and self-review."
---

<link rel="stylesheet" href="{{ '/assets/css/ielts-hub.css' | relative_url }}">

<section class="ielts-writing" data-ielts-writing-lab aria-labelledby="ielts-writing-title">
  <header class="ielts-writing__header">
    <p class="ielts-writing__eyebrow">Phase 2B · Writing Lab MVP</p>
    <h1 id="ielts-writing-title">Write with evidence. Revise with intention.</h1>
    <p>Practise Academic Writing Task 1 and Task 2 through a focused loop: plan, write, count, review, and rewrite.</p>
  </header>

  <section class="ielts-writing__panel ielts-writing__setup" aria-labelledby="writing-setup-title">
    <div>
      <p class="ielts-writing__label">Choose your attempt</p>
      <h2 id="writing-setup-title">Set the task and time</h2>
    </div>
    <div class="ielts-writing__setup-grid">
      <div>
        <label class="ielts-writing__field-label" for="writingTaskSelect">Writing task</label>
        <select id="writingTaskSelect" data-writing-task></select>
      </div>
      <div>
        <label class="ielts-writing__field-label" for="writingDurationSelect">Timer length</label>
        <select id="writingDurationSelect" data-writing-duration>
          <option value="20">20 minutes · focused practice</option>
          <option value="40">40 minutes · full attempt</option>
        </select>
      </div>
    </div>
    <p class="ielts-writing__privacy">Your plan, writing and self-review are stored only in this browser. No account, AI scoring, band prediction or submission is used in this MVP.</p>
  </section>

  <section class="ielts-writing__panel ielts-writing__prompt" aria-labelledby="writing-prompt-title">
    <p class="ielts-writing__label" data-writing-task-type>Academic Task</p>
    <h2 id="writing-prompt-title" data-writing-prompt-title>Writing prompt</h2>
    <p class="ielts-writing__prompt-text" data-writing-prompt></p>
    <p class="ielts-writing__threshold" data-writing-threshold></p>
  </section>

  <section class="ielts-writing__panel" aria-labelledby="writing-plan-title">
    <p class="ielts-writing__label">1 · Plan</p>
    <h2 id="writing-plan-title">Make the argument visible before you write</h2>
    <label class="ielts-writing__field-label" for="writingPlan">Notes, comparisons, thesis, paragraph map or key data</label>
    <textarea id="writingPlan" rows="7" data-writing-plan placeholder="Write a quick plan. What will each paragraph prove?"></textarea>
  </section>

  <section class="ielts-writing__panel" aria-labelledby="writing-response-title">
    <div class="ielts-writing__panel-heading">
      <div>
        <p class="ielts-writing__label">2 · Write</p>
        <h2 id="writing-response-title">Draft your response</h2>
      </div>
      <div class="ielts-writing__word-count" aria-label="Writing word count">
        <strong data-writing-word-count>0 words</strong>
        <span data-writing-word-message aria-live="polite">Reference threshold loading.</span>
      </div>
    </div>
    <label class="ielts-writing__field-label" for="writingResponse">Your response</label>
    <textarea id="writingResponse" rows="18" data-writing-response aria-describedby="writingWordHelp" placeholder="Write here. The word counter counts whitespace-separated words and your draft autosaves locally."></textarea>
    <p id="writingWordHelp" class="ielts-writing__help">Task 1 reference: 150 words. Task 2 reference: 250 words. The threshold is a practice guide, not a band score.</p>
  </section>

  <section class="ielts-writing__panel ielts-writing__timer-panel" aria-labelledby="writing-timer-title">
    <div class="ielts-writing__timer-box" role="timer" aria-live="off">
      <span class="ielts-writing__label">Time remaining</span>
      <strong data-writing-timer>20:00</strong>
    </div>
    <div class="ielts-writing__timer-copy">
      <h2 id="writing-timer-title">Protect a deliberate writing window</h2>
      <p data-writing-timer-status aria-live="polite">Timer ready.</p>
      <div class="ielts-writing__controls" aria-label="Writing timer controls">
        <button class="btn btn--primary" type="button" data-writing-start>Start</button>
        <button class="btn" type="button" data-writing-pause disabled>Pause</button>
        <button class="btn" type="button" data-writing-reset-timer>Reset timer</button>
      </div>
    </div>
  </section>

  <section class="ielts-writing__panel" aria-labelledby="writing-review-title">
    <div class="ielts-writing__panel-heading">
      <div>
        <p class="ielts-writing__label">3 · Review</p>
        <h2 id="writing-review-title">Use the four IELTS criteria</h2>
      </div>
      <span class="ielts-writing__review-summary" data-writing-review-summary>0 of 4 criteria reviewed.</span>
    </div>
    <ul class="ielts-writing__checklist" data-writing-checklist></ul>
  </section>

  <section class="ielts-writing__panel" aria-labelledby="writing-model-title">
    <div class="ielts-writing__panel-heading">
      <div>
        <p class="ielts-writing__label">4 · Compare and rewrite</p>
        <h2 id="writing-model-title">Structure and checklist</h2>
      </div>
      <button class="btn" type="button" data-writing-model-toggle aria-expanded="false" aria-controls="writingModel">Reveal structure and checklist</button>
    </div>
    <div id="writingModel" class="ielts-writing__model" data-writing-model hidden tabindex="-1">
      <div>
        <h3>Suggested structure</h3>
        <ol data-writing-structure></ol>
      </div>
      <div>
        <h3>Self-check before saving</h3>
        <ul data-writing-checklist-copy></ul>
      </div>
    </div>
    <label class="ielts-writing__field-label" for="writingWeakestSentence">Rewrite your weakest sentence</label>
    <textarea id="writingWeakestSentence" rows="4" data-writing-weakest-sentence placeholder="Paste or describe one sentence you want to improve, then write a stronger version below it."></textarea>
  </section>

  <section class="ielts-writing__panel ielts-writing__actions-panel" aria-labelledby="writing-save-title">
    <div>
      <p class="ielts-writing__label">5 · Save the attempt</p>
      <h2 id="writing-save-title">Keep the evidence of your practice</h2>
      <p class="ielts-writing__help">Saving stores this task locally so you can return, notice patterns and revise deliberately.</p>
    </div>
    <div class="ielts-writing__controls">
      <button class="btn btn--primary" type="button" data-writing-save>Save current attempt</button>
      <button class="btn" type="button" data-writing-reset-attempt>Reset this attempt</button>
    </div>
    <p class="ielts-writing__save-status" data-writing-save-status aria-live="polite">Not saved yet. Your work will autosave locally.</p>
  </section>

  <aside class="ielts-writing__notice">
    <strong>Independent educational resource.</strong> IELTS is a registered trademark of the IELTS Partners. This section is not affiliated with, endorsed by, or approved by the British Council, IDP IELTS, or Cambridge University Press &amp; Assessment.
  </aside>
</section>

<script>
  window.LBFL_IELTS_WRITING_TASKS = {{ site.data.ielts_writing_tasks | jsonify }};
</script>
<script src="{{ '/assets/js/ielts-writing-lab.js' | relative_url }}" defer></script>
