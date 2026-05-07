---
layout: archive
title: "Video Library"
permalink: /categories/videos/
author_profile: true
---

<div class="entries-list">
  {% assign category_posts = site.categories['videos'] %}
  {% for post in category_posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>
