---
layout: archive
title: "Practical Approaches: Research Highlights"
permalink: /categories/research-highlights/
author_profile: true
---

<div class="entries-list">
  {% assign category_posts = site.categories['research-highlights'] %}
  {% for post in category_posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>
