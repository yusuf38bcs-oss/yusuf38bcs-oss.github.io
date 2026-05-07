---
layout: archive
title: "Higher Zoology Tree: Animal Diversity"
permalink: /categories/animal-diversity/
author_profile: true
---

<div class="entries-list">
  {% assign category_posts = site.categories['animal-diversity'] %}
  {% for post in category_posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>
