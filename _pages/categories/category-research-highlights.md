---
layout: archive
title: "Research Highlights"
permalink: /categories/research-highlights/
author_profile: true
---

<div class="entries-list">
  {% assign has_documents = false %}
  {% for post in site.documents %}
    {% if post.category == 'research-highlights' or post.categories contains 'research-highlights' %}
      {% include archive-single.html %}
      {% assign has_documents = true %}
    {% endif %}
  {% endfor %}
  
  {% if has_documents == false %}
    <p style="color: #a0aec0; padding: 2rem 0; font-style: italic;">Awaiting fresh scientific logs. Synaptic synchronization in progress...</p>
  {% endif %}
</div>