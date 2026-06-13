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
---

<div class="hub-page">
  <p class="page-subtitle-lead">Actionable frameworks translating biological theory into optimal human behavior, cognitive audits, and leadership applications.</p>

  <div class="entries-list" style="margin-top: 2rem;">
    {% assign practices_nodes = site.documents | where_exp: "item", "item.url contains '/life-practices/'" %}
    {% for post in practices_nodes %}
      {% if post.url != page.url %}
        {% include archive-single.html %}
      {% endif %}
    {% else %}
      <p style="color: #a0aec0;"><em>Mapping life practice frameworks...</em></p>
    {% endfor %}
  </div>
</div>