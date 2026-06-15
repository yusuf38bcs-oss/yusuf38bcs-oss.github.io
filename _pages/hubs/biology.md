---
layout: single
title: "Biology Hub: Educational Neural Network"
permalink: /biology/
author_profile: false
sidebar:
  nav: "synaptic_nav"

node_id: hub-biology
pillar: "Life Sciences"
difficulty: "Advanced"
xp: 1000
status: "Active"
classes: biology-hub
---

{% include neural-node-panel.html %}

<div class="biology-hub-page">
  <p class="page-subtitle-lead">
    Explore the complete cognitive mapping of the biological sciences. 
    This node dynamically syncs all biological data entries.
  </p>

  <h2 class="section-heading">Core Structural Hubs</h2>
  
  <div class="card-grid hub-links-grid">
    <a href="{{ '/biology/higher-zoology-tree/' | relative_url }}" class="hub-card">
      <span class="hub-card__icon" aria-hidden="true">🧬</span>
      <span class="hub-card__title">Higher Zoology Tree</span>
    </a>
    <a href="{{ '/categories/botany/' | relative_url }}" class="hub-card">
      <span class="hub-card__icon" aria-hidden="true">🌿</span>
      <span class="hub-card__title">HSC Corner: Botany</span>
    </a>
    <a href="{{ '/categories/zoology/' | relative_url }}" class="hub-card">
      <span class="hub-card__icon" aria-hidden="true">🦋</span>
      <span class="hub-card__title">HSC Corner: Zoology</span>
    </a>
  </div>

  <h2 class="section-heading">All Synaptic Biology Nodes</h2>
  
  <div class="entries-list card-grid">
    {% for post in site.biology %}
      {% include archive-single.html %}
    {% else %}
      <p class="archive__warning"><em>Neural synchronization in progress. Loading biology assets...</em></p>
    {% endfor %}
  </div>
</div>
