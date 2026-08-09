---
title: "Daily 20-Minute IELTS Practice"
permalink: /ielts/daily-practice/
layout: single
classes: wide ielts-practice-page
sidebar:
  nav: "ielts"
author_profile: false
---

<link rel="stylesheet" href="{{ '/assets/css/ielts-hub.css' | relative_url }}">

<section class="ielts-practice" data-ielts-daily-practice>
  <header class="ielts-practice__header">
    <p class="ielts-practice__eyebrow">Phase 2A · Daily Practice MVP</p>
    <h1>Daily 20-Minute IELTS Practice</h1>
    <p>Follow the fixed rotation <strong>Listening → Reading → Writing → Speaking</strong>. Today’s skill is selected automatically from the learner’s local date.</p>
  </header>

  <section class="ielts-practice__status" aria-labelledby="today-skill-heading">
    <div>
      <p class="ielts-practice__label">Today’s skill</p>
      <h2 id="today-skill-heading" data-practice-skill>Loading…</h2>
      <p data-practice-focus>Preparing today’s focus.</p>
    </div>
    <div class="ielts-practice__timer" aria-live="polite" aria-atomic="true">
      <span class="ielts-practice__label">Time remaining</span>
      <strong data-practice-timer>20:00</strong>
    </div>
  </section>

  <div class="ielts-practice__controls" aria-label="Practice timer controls">
    <button class="btn btn--primary" type="button" data-timer-start>Start</button>
    <button class="btn" type="button" data-timer-pause disabled>Pause</button>
    <button class="btn" type="button" data-timer-reset>Reset</button>
  </div>

  <section class="ielts-practice__panel" aria-labelledby="practice-task-heading">
    <p class="ielts-practice__label">Task</p>
    <h2 id="practice-task-heading" data-practice-task-title>Today’s task</h2>
    <div data-practice-task></div>
    <label class="ielts-practice__field-label" for="ieltsPracticeAnswer">Your working notes / answer</label>
    <textarea id="ieltsPracticeAnswer" rows="8" data-practice-answer placeholder="Write your response or notes here. Your work is stored only in this browser."></textarea>
  </section>

  <section class="ielts-practice__panel" aria-labelledby="review-heading">
    <div class="ielts-practice__panel-heading">
      <div>
        <p class="ielts-practice__label">Review</p>
        <h2 id="review-heading">Model answer / checklist</h2>
      </div>
      <button class="btn" type="button" data-review-toggle aria-expanded="false" aria-controls="ieltsPracticeReview">Reveal review</button>
    </div>
    <div id="ieltsPracticeReview" data-practice-review hidden></div>
  </section>

  <section class="ielts-practice__grid" aria-label="Vocabulary and follow-up practice">
    <article class="ielts-practice__panel">
      <p class="ielts-practice__label">Key vocabulary</p>
      <h2>Use these precisely</h2>
      <ul data-practice-vocabulary></ul>
    </article>

    <article class="ielts-practice__panel">
      <p class="ielts-practice__label">Follow-up drill</p>
      <h2>One more step</h2>
      <div data-practice-followup></div>
    </article>
  </section>

  <section class="ielts-practice__panel" aria-labelledby="reflection-heading">
    <p class="ielts-practice__label">Reflection</p>
    <h2 id="reflection-heading">What will you improve next?</h2>
    <label class="ielts-practice__field-label" for="ieltsPracticeReflection">Record one recurring error or one action for the next session.</label>
    <textarea id="ieltsPracticeReflection" rows="4" data-practice-reflection placeholder="Example: I will identify textual evidence before choosing True / False / Not Given."></textarea>
    <p class="ielts-practice__save-status" data-save-status aria-live="polite">Saved locally in this browser.</p>
  </section>

  <aside class="ielts-practice__privacy">
    <strong>Local-first MVP.</strong> This page uses browser storage only for the current daily session. No account, microphone, AI scoring, or backend submission is used in Phase 2A.
  </aside>
</section>

<script src="{{ '/assets/js/ielts-daily-practice.js' | relative_url }}" defer></script>
