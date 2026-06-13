---
layout: archive
title: "MCQ Arena"
permalink: /categories/mcq/
author_profile: true
---

<div class="entries-list">
  {% assign category_posts = site.categories['mcq'] %}
  {% for post in category_posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>