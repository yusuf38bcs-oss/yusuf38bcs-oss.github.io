---
layout: archive
title: "Genetics"
permalink: /categories/genetics/
author_profile: true
---

<div class="entries-list">
  {% assign category_posts = site.categories['genetics'] %}
  {% for post in category_posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>