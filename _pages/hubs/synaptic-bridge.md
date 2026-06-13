---
layout: single
title: "Synaptic Bridge"
permalink: /synaptic-bridge/
author_profile: true
sidebar:
  nav: "synaptic_nav"

node_id: hub-synaptic-bridge
pillar: "Interdisciplinary"
status: "Active"
---

<div class="hub-page">
  <p class="page-subtitle-lead">The nexus where hard sciences intersect with behavioral psychology, leadership, and digital 4IR research paradigms.</p>

  <h2 style="border-bottom: 1px solid #2d3748; padding-bottom: 0.5rem; margin-top: 2rem;">Interdisciplinary Nodes</h2>
  <div class="entries-list">
    {% assign synaptic_nodes = site.documents | where_exp: "item", "item.url contains '/synaptic-bridge/'" %}
    {% for post in synaptic_nodes %}
      {% if post.url != page.url %}
        {% include archive-single.html %}
      {% endif %}
    {% else %}
      <p style="color: #a0aec0;"><em>Routing synaptic bridge connections...</em></p>
    {% endfor %}
  </div>
</div>