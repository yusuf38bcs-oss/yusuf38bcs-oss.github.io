---
layout: archive
title: "Biostatistics"
permalink: /categories/biostatistics/
author_profile: true
---

<div class="entries-list">
  {% assign category_posts = site.categories['biostatistics'] %}
  {% for post in category_posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>