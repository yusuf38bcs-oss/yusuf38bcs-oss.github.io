---
layout: archive
title: "Random Thoughts"
permalink: /categories/random-thoughts/
author_profile: true
---

<div class="entries-list">
  {% assign has_documents = false %}
  {% for post in site.documents %}
    {% if post.category == 'random-thoughts' or post.categories contains 'random-thoughts' %}
      {% include archive-single.html %}
      {% assign has_documents = true %}
    {% endif %}
  {% endfor %}
  
  {% if has_documents == false %}
    <p style="color: #a0aec0; padding: 2rem 0; font-style: italic;">Awaiting fresh scientific logs. Synaptic synchronization in progress...</p>
  {% endif %}
</div>