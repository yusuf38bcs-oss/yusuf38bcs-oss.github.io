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
classes: wide
---

<div class="biology-hub-page synaptic-bridge-hub-page">
  {% include neural-node-panel.html %}

  <section class="hub-section" aria-labelledby="synaptic-bridge-nodes">
    <h2 id="synaptic-bridge-nodes" class="section-heading">Interdisciplinary Nodes</h2>
    <p class="section-intro">The nexus where hard sciences intersect with behavioral psychology, leadership, digital pedagogy, and 4IR research paradigms.</p>

    <div class="entries-list card-grid">
      {% assign synaptic_nodes = site.documents | where_exp: "item", "item.url contains '/synaptic-bridge/'" %}
      {% for post in synaptic_nodes %}
        {% if post.url != page.url %}
          {% include archive-single.html %}
        {% endif %}
      {% else %}
        <p class="archive__warning"><em>Routing synaptic bridge connections...</em></p>
      {% endfor %}
    </div>
  </section>
</div>

{% include hubs/omega-hub-styles.html %}
