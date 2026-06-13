---
layout: archive
title: "Human Physiology"
permalink: /categories/human-physiology/
author_profile: true
---

<div class="entries-list">
  {% assign category_posts = site.categories['human-physiology'] %}
  {% for post in category_posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>