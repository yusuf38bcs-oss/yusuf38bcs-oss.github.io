---
title: "IELTS Speaking Simulator"
permalink: /ielts/speaking/
layout: single
classes: wide ielts-speaking-page
sidebar:
  nav: "ielts"
author_profile: false
excerpt: "A local-first IELTS Speaking Simulator for structured preparation, timed speaking and deliberate self-review."
---

<link rel="stylesheet" href="{{ '/assets/css/ielts-hub.css' | relative_url }}">

<section class="ielts-speaking" data-ielts-speaking-simulator data-certification-surface="phase-2c" aria-labelledby="ielts-speaking-title">
  <header class="ielts-speaking__header">
    <p class="ielts-speaking__eyebrow">Phase 2C · Speaking Simulator MVP</p>
    <h1 id="ielts-speaking-title">Think clearly. Speak deliberately.</h1>
    <p>Practise structured spoken English through preparation, timed response, self-review and focused retry.</p>
  </header>

  <section class="ielts-speaking__panel" aria-labelledby="speaking-setup-title">
    <p class="ielts-speaking__label">Choose practice mode</p>
    <h2 id="speaking-setup-title">Select a speaking part</h2>
    <div class="ielts-speaking__setup-grid">
      <div>
        <label class="ielts-speaking__field-label" for="speakingPartSelect">Speaking mode</label>
        <select id="speakingPartSelect" data-speaking-part>
          <option value="part1">Part 1 · Short responses</option>
          <option value="part2">Part 2 · Cue-card practice</option>
          <option value="part3">Part 3 · Discussion</option>
        </select>
      </div>
      <div>
        <span class="ielts-speaking__field-label">Current attempt</span>
        <strong data-speaking-attempt>Attempt 1</strong>
      </div>
    </div>
  </section>

  <section class="ielts-speaking__panel ielts-speaking__prompt" aria-labelledby="speaking-prompt-title">
    <div class="ielts-speaking__panel-heading">
      <div>
        <p class="ielts-speaking__label" data-speaking-topic>Topic</p>
        <h2 id="speaking-prompt-title" data-speaking-prompt-title>Speaking prompt</h2>
      </div>
      <button id="speakingNewPrompt" class="btn" type="button" data-speaking-new-prompt>New prompt</button>
    </div>
    <div data-speaking-prompt></div>
  </section>

  <section class="ielts-speaking__panel" aria-labelledby="speaking-preparation-title">
    <p class="ielts-speaking__label">1 · Prepare</p>
    <h2 id="speaking-preparation-title">Build a response map</h2>
    <label class="ielts-speaking__field-label" for="speakingPlan">Keywords, examples, sequence or argument</label>
    <textarea id="speakingPlan" rows="6" data-speaking-plan placeholder="Use keywords rather than writing a complete script."></textarea>
  </section>

  <section class="ielts-speaking__panel ielts-speaking__timer-panel" aria-labelledby="speaking-timer-title">
    <div class="ielts-speaking__timer-box" role="timer" aria-label="Speaking practice timer">
      <span class="ielts-speaking__label" data-speaking-timer-phase>Response</span>
      <strong data-speaking-timer>00:45</strong>
    </div>
    <div class="ielts-speaking__timer-copy">
      <h2 id="speaking-timer-title">Practise under controlled time</h2>
      <p data-speaking-timer-status aria-live="polite">Timer ready.</p>
      <div class="ielts-speaking__controls" aria-label="Speaking timer controls">
        <button class="btn btn--primary" type="button" data-speaking-start>Start</button>
        <button class="btn" type="button" data-speaking-pause disabled>Pause</button>
        <button class="btn" type="button" data-speaking-reset-timer>Reset timer</button>
      </div>
    </div>
  </section>

  <section class="ielts-speaking__panel" aria-labelledby="speaking-notes-title">
    <p class="ielts-speaking__label">2 · Speak</p>
    <h2 id="speaking-notes-title">Record evidence from the attempt</h2>
    <p class="ielts-speaking__help">Phase 2C does not record microphone audio. After speaking aloud, write only the phrases, hesitations or ideas you want to examine.</p>
    <label class="ielts-speaking__field-label" for="speakingNotes">Attempt notes</label>
    <textarea id="speakingNotes" rows="7" data-speaking-notes placeholder="Example: repeated 'I think'; lost the sequence after the example; useful phrase: from my perspective..."></textarea>
  </section>

  <section class="ielts-speaking__panel" aria-labelledby="speaking-review-title">
    <div class="ielts-speaking__panel-heading">
      <div>
        <p class="ielts-speaking__label">3 · Review</p>
        <h2 id="speaking-review-title">Review four speaking dimensions</h2>
      </div>
      <span class="ielts-speaking__review-summary" data-speaking-review-summary>0 of 4 reviewed.</span>
    </div>
    <ul class="ielts-speaking__checklist" data-speaking-checklist></ul>
  </section>

  <section class="ielts-speaking__panel" aria-labelledby="speaking-reflection-title">
    <p class="ielts-speaking__label">4 · Reflect</p>
    <h2 id="speaking-reflection-title">Identify one change for the retry</h2>
    <label class="ielts-speaking__field-label" for="speakingReflection">Most important improvement</label>
    <textarea id="speakingReflection" rows="4" data-speaking-reflection placeholder="Example: Give the main answer first, then explain it with one concrete example."></textarea>
    <div class="ielts-speaking__controls">
      <button class="btn btn--primary" type="button" data-speaking-save>Save attempt</button>
      <button class="btn" type="button" data-speaking-retry>Retry same prompt</button>
      <button class="btn" type="button" data-speaking-reset>Reset practice</button>
    </div>
    <p class="ielts-speaking__save-status" data-speaking-save-status aria-live="polite">Your practice is stored only in this browser.</p>
  </section>

  <aside class="ielts-speaking__notice">
    <strong>Independent educational resource.</strong> This simulator supports practice and self-reflection. It does not provide an official IELTS score or examiner assessment.
  </aside>
</section>

<!-- Phase 2C exact-head certification surface: behavior-harness-v2 -->
<script>
  window.LBFL_IELTS_SPEAKING_PROMPTS = {{ site.data.ielts_speaking_prompts | jsonify }};
</script>
<script src="{{ '/assets/js/ielts-speaking-simulator.js' | relative_url }}" defer></script>
