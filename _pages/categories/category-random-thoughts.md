---
permalink: /category-random-thoughts/
layout: archive
title: "Practical Approaches: Random Thoughts"
permalink: /categories/random-thoughts/
author_profile: true
---

<div class="entries-list">
  {% assign category_posts = site.categories['random-thoughts'] %}
  {% for post in category_posts %}
    {% include archive-single.html %}
  {% endfor %}
</div>
