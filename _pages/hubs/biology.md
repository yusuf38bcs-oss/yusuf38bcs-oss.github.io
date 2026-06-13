---
layout: single
title: "Biology Hub: Educational Neural Network"
permalink: /biology/
author_profile: true
sidebar:
  nav: "synaptic_nav"

node_id: hub-biology
pillar: "Life Sciences"
difficulty: "Advanced"
xp: 1000
status: "Active"
---

<div class="biology-hub-page">
  <p class="page-subtitle-lead">Explore the complete cognitive mapping of the biological sciences. This node dynamically syncs all biological data entries.</p>

  <h2 style="border-bottom: 1px solid #2d3748; padding-bottom: 0.5rem;">Core Structural Hubs</h2>
  <ul style="line-height: 2;">
    <li><a href="{{ '/biology/higher-zoology-tree/' | relative_url }}" style="color: #00f5d4; font-weight: 600;">Higher Zoology Tree</a></li>
    <li><a href="{{ '/categories/botany/' | relative_url }}" style="color: #00f5d4; font-weight: 600;">HSC Corner: Botany</a></li>
    <li><a href="{{ '/categories/zoology/' | relative_url }}" style="color: #00f5d4; font-weight: 600;">HSC Corner: Zoology</a></li>
  </ul>

  <h2 style="border-bottom: 1px solid #2d3748; padding-bottom: 0.5rem; margin-top: 2rem;">All Synaptic Biology Nodes</h2>
  <div class="entries-list">
    {% for post in site.biology %}
      {% include archive-single.html %}
    {% else %}
      <p style="color: #a0aec0;"><em>Neural synchronization in progress. Loading biology assets...</em></p>
    {% endfor %}
  </div>
</div>