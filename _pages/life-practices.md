---
title: "Life Practices"
layout: single
permalink: /life-practices/
author_profile: false
sidebar:
  nav: "synaptic_nav"
classes: wide
excerpt: "Practical neuroscience, leadership architectures, and applied biology for everyday sovereignty."
---

<header class="page-content-header">
  <h1 class="page-main-title u-text-glow">Life Practices</h1>
  <p class="page-subtitle-lead">{{ page.excerpt }}</p>
  <div class="header-matrix-line"></div>
</header>

<div class="archive-matrix-grid-stream">
  {% assign items = site.life-practices | sort: 'date' | reverse %}
  {% if items.size > 0 %}
    {% for item in items %}
      <div class="archive-grid-item-card">
        <h2 class="archive-item-title">
          <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
        </h2>
        {% if item.excerpt %}
          <p class="archive-item-excerpt">{{ item.excerpt | strip_html | truncate: 160 }}</p>
        {% endif %}
        <span class="archive-item-meta">{{ item.date | date: "%B %d, %Y" }}</span>
      </div>
    {% endfor %}
  {% else %}
    <div class="archive-empty-fallback">
      <p>No analytical publication tracks found in this node timeline.</p>
    </div>
  {% endif %}
</div>
