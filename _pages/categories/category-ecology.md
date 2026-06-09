---
permalink: /category-ecology/
layout: archive
title: "Higher Zoology Tree: Ecology"
permalink: /categories/ecology/
author_profile: true
---

<div class="entries-list">
  {% assign category_posts = site.categories['ecology'] %}
  {% for post in category_posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>
