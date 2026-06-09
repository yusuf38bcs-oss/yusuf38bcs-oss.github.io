---
permalink: /category-botany/
layout: archive
title: "HSC Corner: Botany"
permalink: /categories/botany/
author_profile: true
---

<div class="entries-list">
  {% assign category_posts = site.categories['botany'] %}
  {% for post in category_posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>
