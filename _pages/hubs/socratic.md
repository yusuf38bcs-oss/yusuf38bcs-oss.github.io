---
title: "Socratic 4.0"
layout: single
permalink: /socratic/
author_profile: false
sidebar:
  nav: "synaptic_nav"
classes: wide
excerpt: "Reflective assessment loops, Multiple Intelligences awareness, personality reflection, and critical-thinking practice."
description: "Educational and reflective Socratic 4.0 hub for critical thinking, Multiple Intelligences reflection, and non-clinical self-assessment."
---

<section class="socratic-hub-intro" aria-labelledby="socratic-purpose">
  <h2 id="socratic-purpose">Reflective Assessment for Critical Thinking</h2>
  <p><strong>Socratic 4.0</strong> is the reflective assessment pillar of Learning Biology For Life. It uses structured questioning to help learners observe their thinking, behaviour, learning preferences, strengths, and correction needs.</p>

  <p><strong>Important boundary:</strong> Socratic 4.0 is an educational and reflective self-assessment framework. It is not a clinical, psychological, medical, or professional diagnostic tool.</p>
</section>

<section class="socratic-hub-framework" aria-labelledby="socratic-framework">
  <h2 id="socratic-framework">Socratic Learning Focus</h2>
  <p>The Socratic model connects stimulus, biological activation, CNS appraisal, philosophical direction, action, reflection, and correction. It helps learners move from automatic reaction toward thoughtful response.</p>
  <p>This hub applies the central LBFL framework to reflective questioning, Multiple Intelligences awareness, personality-pattern reflection, and non-diagnostic self-correction.</p>
</section>

{% include education/framework-links.html %}

<section class="socratic-hub-archive" aria-labelledby="socratic-nodes">
  <h2 id="socratic-nodes">Socratic Nodes</h2>
  <div class="archive-matrix-grid-stream">
    {% assign items = site.socratic | sort: 'date' | reverse %}
    {% if items.size > 0 %}
      {% for item in items %}
        <div class="archive-grid-item-card">
          <h3 class="archive-item-title">
            <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
          </h3>
          {% if item.excerpt %}
            <p class="archive-item-excerpt">{{ item.excerpt | strip_html | truncate: 160 }}</p>
          {% endif %}
        </div>
      {% endfor %}
    {% else %}
      <div class="archive-empty-fallback">
        <p>No analytical publication tracks found in this node timeline.</p>
      </div>
    {% endif %}
  </div>
</section>

<section class="socratic-critical-thinking" aria-labelledby="socratic-critical-thinking-title">
  <h2 id="socratic-critical-thinking-title">Critical Thinking Questions</h2>
  <ol>
    <li>Which question helps you understand your learning behaviour more deeply?</li>
    <li>How can a learner use reflection without turning it into a fixed label?</li>
  </ol>
</section>
