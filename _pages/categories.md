---
layout: single
title: "Categories"
permalink: /categories/
author_profile: false
classes: wide
---

# Categories

Use this archive to move from broad learning pathways to specific articles and assessment nodes. It is intentionally text-first, crawlable, and lightweight for search engines and AdSense review.

## Core Learning Pathways

<div class="category-hub-grid" aria-label="Core learning pathway links">
  <a href="{{ '/biology/' | relative_url }}"><strong>Biology Matrix</strong><span>Academic biology, HSC Botany/Zoology, Higher Zoology, Genetics, Ecology, Physiology, Biostatistics.</span></a>
  <a href="{{ '/synaptic-bridge/' | relative_url }}"><strong>Synaptic Bridge</strong><span>Systems thinking, interdisciplinary biology, reflective learning, and conceptual integration.</span></a>
  <a href="{{ '/life-practices/' | relative_url }}"><strong>Life Practices</strong><span>Human behaviour, leadership, learning design, random thoughts, and research highlights.</span></a>
  <a href="{{ '/life-philosophy/' | relative_url }}"><strong>Life Philosophy</strong><span>4IR education, life reflection, science, meaning, and philosophical synthesis.</span></a>
  <a href="{{ '/mcq-arena/' | relative_url }}"><strong>MCQ Arena</strong><span>Assessment practice, short Q/A, academic MCQ drills, and reflective evaluation.</span></a>
</div>

## Article Categories

{% assign sorted_categories = site.categories | sort %}
{% if sorted_categories.size > 0 %}
  {% for category in sorted_categories %}
    {% assign category_name = category[0] %}
    {% assign posts = category[1] %}
    <section class="category-archive-block" aria-labelledby="category-{{ category_name | slugify }}">
      <h2 id="category-{{ category_name | slugify }}">{{ category_name | replace: '-', ' ' | capitalize }}</h2>
      <ul>
        {% for post in posts %}
          <li>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            {% if post.excerpt %}<span>{{ post.excerpt | strip_html | normalize_whitespace | truncate: 140 }}</span>{% endif %}
          </li>
        {% endfor %}
      </ul>
    </section>
  {% endfor %}
{% else %}
  <p>No post categories are available yet. Use the core learning pathway links above.</p>
{% endif %}

<style>
  .category-hub-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0 2rem;
  }

  .category-hub-grid a,
  .category-archive-block {
    display: block;
    padding: 1rem;
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 16px;
    background: rgba(15, 23, 42, 0.45);
    text-decoration: none;
  }

  .category-hub-grid strong {
    display: block;
    margin-bottom: 0.4rem;
    color: #7fffe7;
  }

  .category-hub-grid span,
  .category-archive-block span {
    display: block;
    color: #94a3b8;
    font-size: 0.92rem;
    line-height: 1.55;
  }

  .category-archive-block {
    margin: 1rem 0;
  }

  .category-archive-block ul {
    margin-bottom: 0;
  }

  .category-archive-block li + li {
    margin-top: 0.7rem;
  }
</style>
