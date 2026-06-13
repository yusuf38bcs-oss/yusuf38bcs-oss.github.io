---
layout: archive
title: "Leadership"
permalink: /categories/leadership/
author_profile: true
---

<div class="entries-list">
  {% comment %} Scan ALL collections globally (posts, biology, life-practices, etc) {% endcomment %}
  {% assign omni_collection = site.documents | where_exp: "item", "item.category == 'leadership' or item.categories contains 'leadership'" %}
  
  {% for post in omni_collection %}
    {% include archive-single.html %}
  {% else %}
    <p style="color: #a0aec0; padding: 2rem 0;"><em>Awaiting fresh scientific logs. Synaptic synchronization in progress...</em></p>
  {% endfor %}
</div>