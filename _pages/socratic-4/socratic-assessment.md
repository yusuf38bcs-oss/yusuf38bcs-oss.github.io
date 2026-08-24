---
layout: single
author_profile: true
author: "MD. Yusuf"
sidebar:
  nav: "synaptic_nav"
title: "Socratic MI-Informed Reflection (Legacy)"
excerpt: "A legacy MI-informed reflective questionnaire retained for compatibility while Socratic 4.0 is rebuilt."
description: "A legacy educational reflection using MI-informed prompts; not a personality, intelligence, clinical, or psychometric assessment."
permalink: /socratic-4/socratic-assessment/
categories:
  - Socratic 4.0
  - Cognitive Audit
  - Life Philosophy
tags:
  - Multiple Intelligences
  - Socratic Assessment
  - Biological Behaviour
  - Cognitive Audit
language: "en"
curriculum_tracks:
  - "HSC"
  - "NEET"
  - "IB"
neet_alignment: "Human physiology, behaviour, nervous coordination, self-regulation, and applied reasoning"
ib_theme: "Interaction and Interdependence"
ib_subtopic: "Human behaviour, cognition, learning, and reflective self-assessment"
hsc_alignment: "Zoology: Human physiology, nervous coordination, behaviour, and applied life learning"
concept_level: "Socratic Assessment"
node_id: socratic-cognitive-assessment
parent_node: socratic-4
network:
  - mcq-arena
  - higher-zoology-tree
  - human-physiology
toc: true
toc_sticky: true
classes: wide
---

<style>
.socratic-assessment-intro {
  padding: 1.25rem;
  border: 1px solid rgba(80, 120, 160, 0.25);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(8, 38, 58, 0.06), rgba(0, 180, 180, 0.06));
  margin-bottom: 1.5rem;
}

.socratic-flow {
  font-weight: 700;
  margin: 1rem 0;
}

.socratic-question-card {
  margin: 1.25rem 0;
  padding: 1.15rem;
  border: 1px solid rgba(80, 120, 160, 0.28);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
}

.socratic-question-card h3 {
  margin-top: 0;
}

.socratic-meta {
  font-size: 0.9rem;
  opacity: 0.85;
  margin-bottom: 0.75rem;
}

.socratic-scale {
  display: grid;
  grid-template-columns: repeat(5, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.socratic-scale label {
  display: block;
  padding: 0.65rem;
  border: 1px solid rgba(80, 120, 160, 0.25);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
}

.socratic-scale input {
  margin-right: 0.25rem;
}

.socratic-action-button {
  display: inline-block;
  padding: 0.85rem 1.25rem;
  border: 0;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  margin: 1.5rem 0;
}

.socratic-result-panel {
  display: none;
  margin: 1.5rem 0;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid rgba(80, 120, 160, 0.3);
  background: rgba(245, 250, 255, 0.9);
}

.socratic-result-panel.is-visible {
  display: block;
}

@media (max-width: 720px) {
  .socratic-scale {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="socratic-assessment-intro">

This legacy questionnaire is retained as an educational reflection surface while Socratic 4.0 is rebuilt. It does not measure intelligence, infer a personality phase, or provide a clinical or psychometric diagnosis. MI-informed responses and personality reflection are separate constructs and are not mathematically fused.

<div class="socratic-flow">
Stimulus → Biological Activation → CNS Appraisal → Philosophical Vector → Action / Reaction → Reflection → Correction
</div>

Answer each item honestly using the 1–5 scale. The values represent only your current self-report on these prompts.

**Version boundary:** this legacy instrument is exploratory and must not be used for longitudinal comparison with future Socratic instruments unless explicit compatibility is established.

</div>

## Assessment Scale

- **1** = Rarely describes me  
- **2** = Sometimes describes me  
- **3** = Moderately describes me  
- **4** = Strongly describes me  
- **5** = Very strongly describes me  

## Questions

{% assign questions = site.data.socratic.mi_assessment.questions %}

{% for q in questions %}
<section class="socratic-question-card">
  <h3>{{ forloop.index }}. {{ q.title }}</h3>

  <div class="socratic-meta">
    <strong>MI-informed channel:</strong> {{ q.intelligence | replace: "_", " " | capitalize }}<br>
    <strong>Biological focus:</strong> {{ q.biological_focus }}<br>
    <strong>Philosophical vector:</strong> {{ q.philosophical_vector }}
  </div>

  <p>{{ q.prompt }}</p>

  <div class="socratic-scale">
    {% for value in (1..5) %}
    <label>
      <input
        type="radio"
        name="{{ q.id }}"
        value="{{ value }}"
        data-intelligence="{{ q.intelligence }}"
        data-dimensions="{{ q.dimensions | join: ',' }}">
      {{ value }}
    </label>
    {% endfor %}
  </div>
</section>
{% endfor %}

<button id="generate-socratic-result" class="socratic-action-button" type="button">
  Generate Reflection Summary
</button>

<div id="socratic-result-panel" class="socratic-result-panel"></div>

## Reflection Journal

After generating your result, write one paragraph for each point:

1. Which real-life stimulus triggered me most strongly this week?
2. What biological reaction did I notice in my body?
3. What decision did my CNS appear to make first: escape, attack, delay, seek comfort, solve, serve, or reflect?
4. Which philosophical vector should guide my next response?
5. What one correction will I apply tomorrow?

<script src="{{ '/assets/js/socratic-assessment.js' | relative_url }}" defer></script>
