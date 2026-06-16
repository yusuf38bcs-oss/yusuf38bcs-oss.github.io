---
layout: single
title: "Philosophical Vectors"
permalink: /life-philosophy/
author_profile: false
sidebar:
  nav: "synaptic_nav"
node_id: hub-life-philosophy
pillar: "Existential Framework"
difficulty: "Advanced"
xp: 1200
status: "Active"
classes: philosophy-hub
---

{% include neural-node-panel.html %}

<div class="philosophy-hub-page">
  <p class="page-subtitle-lead">
    Navigate the architecture of thought, ethics, and human consciousness. 
    This node maps the philosophical vectors that govern meaning and morality.
  </p>

  <h2 class="section-heading">Core Vectors</h2>
  
  <div class="card-grid hub-links-grid">
    <a href="{{ '/life-philosophy/ethics/' | relative_url }}" class="hub-card">
      <span class="hub-card__icon" aria-hidden="true">⚖️</span>
      <span class="hub-card__title">Ethics & Morality</span>
    </a>
    <a href="{{ '/life-philosophy/observation/' | relative_url }}" class="hub-card">
      <span class="hub-card__icon" aria-hidden="true">🔭</span>
      <span class="hub-card__title">Cosmic Observation</span>
    </a>
    <a href="{{ '/life-philosophy/psychology/' | relative_url }}" class="hub-card">
      <span class="hub-card__icon" aria-hidden="true">🧠</span>
      <span class="hub-card__title">Psychology & Character</span>
    </a>
    <a href="{{ '/life-philosophy/realization/' | relative_url }}" class="hub-card">
      <span class="hub-card__icon" aria-hidden="true">✨</span>
      <span class="hub-card__title">Realization</span>
    </a>
    <a href="{{ '/life-philosophy/reflective-thinking/' | relative_url }}" class="hub-card">
      <span class="hub-card__icon" aria-hidden="true">🪞</span>
      <span class="hub-card__title">Reflective Thinking</span>
    </a>
  </div>

  <h2 class="section-heading">All Synaptic Philosophy Nodes</h2>
  
  <div class="entries-list card-grid">
    {% for post in site.life-philosophy %}
      {% include archive-single.html %}
    {% else %}
      <p class="archive__warning"><em>Neural synchronization in progress. Loading philosophical assets...</em></p>
    {% endfor %}
  </div>
</div>
