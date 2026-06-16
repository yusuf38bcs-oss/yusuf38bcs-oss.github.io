---
layout: single
title: "Life Practices"
permalink: /life-practices/
author_profile: true
sidebar:
  nav: "synaptic_nav"

node_id: hub-life-practices
pillar: "Human Metrics"
status: "Active"
classes: wide
---

<div class="biology-hub-page life-practices-hub-page">
  {% include neural-node-panel.html %}

  <section class="hub-section" aria-labelledby="life-practices-nodes">
    <h2 id="life-practices-nodes" class="section-heading">Applied Life Practice Nodes</h2>
    <p class="section-intro">Actionable frameworks translating biological theory into optimal human behavior, cognitive audits, leadership applications, and reflective practice.</p>

    <div class="entries-list card-grid">
      {% assign practices_nodes = site.documents | where_exp: "item", "item.url contains '/life-practices/'" %}
      {% for post in practices_nodes %}
        {% if post.url != page.url %}
          {% include archive-single.html %}
        {% endif %}
      {% else %}
        <p class="archive__warning"><em>Mapping life practice frameworks...</em></p>
      {% endfor %}
    </div>
  </section>
</div>

{% include hubs/omega-hub-styles.html %}
