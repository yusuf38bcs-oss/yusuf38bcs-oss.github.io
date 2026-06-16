---
layout: single
title: "Biology Hub: Educational Neural Network"
permalink: /biology/
author_profile: false
sidebar:
  nav: "synaptic_nav"
node_id: hub-biology
pillar: "Life Sciences"
difficulty: "Advanced"
xp: 1000
status: "Active"
classes: biology-hub wide
---

<div class="biology-hub-page">

  <header class="biology-hub-hero">
    <p class="eyebrow">Learning Biology For Life</p>

    <h1>Biology Hub</h1>

    <p class="page-subtitle-lead">
      A structured neural pathway for HSC Biology, Higher Zoology, physiology,
      ecology, genetics, biostatistics, and reflective scientific learning.
    </p>

    <div class="hub-hero-actions">
      <a href="{{ '/biology/hsc-corner/botany/' | relative_url }}" class="btn btn--primary">
        Start with Botany
      </a>
      <a href="{{ '/biology/higher-zoology-tree/' | relative_url }}" class="btn btn--inverse">
        Explore Higher Zoology
      </a>
    </div>
  </header>

  {% include neural-node-panel.html %}

  <section class="hub-section" aria-labelledby="core-structural-hubs">
    <h2 id="core-structural-hubs" class="section-heading">Core Structural Hubs</h2>

    <p class="section-intro">
      Begin from the major learning branches. Each hub connects academic biology
      with questioning, application, and long-term conceptual mastery.
    </p>

    <div class="card-grid hub-links-grid">

      <a href="{{ '/biology/higher-zoology-tree/' | relative_url }}" class="hub-card">
        <span class="hub-card__icon" aria-hidden="true">🧬</span>
        <span class="hub-card__title">Higher Zoology Tree</span>
        <span class="hub-card__text">
          Animal diversity, physiology, ecology, genetics, and biostatistics.
        </span>
      </a>

      <a href="{{ '/biology/hsc-corner/botany/' | relative_url }}" class="hub-card">
        <span class="hub-card__icon" aria-hidden="true">🌿</span>
        <span class="hub-card__title">HSC Corner: Botany</span>
        <span class="hub-card__text">
          Cell biology, plant physiology, genetics, ecology, and applied botany.
        </span>
      </a>

      <a href="{{ '/biology/hsc-corner/zoology/' | relative_url }}" class="hub-card">
        <span class="hub-card__icon" aria-hidden="true">🦋</span>
        <span class="hub-card__title">HSC Corner: Zoology</span>
        <span class="hub-card__text">
          Animal systems, diversity, human physiology, evolution, and behaviour.
        </span>
      </a>

    </div>
  </section>

  <section class="hub-section" aria-labelledby="learning-pathways">
    <h2 id="learning-pathways" class="section-heading">Learning Pathways</h2>

    <div class="card-grid hub-links-grid">

      <a href="{{ '/categories/physiology/' | relative_url }}" class="hub-card">
        <span class="hub-card__icon" aria-hidden="true">🫀</span>
        <span class="hub-card__title">Human Physiology</span>
        <span class="hub-card__text">
          Systems-level understanding of body function and regulation.
        </span>
      </a>

      <a href="{{ '/categories/ecology/' | relative_url }}" class="hub-card">
        <span class="hub-card__icon" aria-hidden="true">🌏</span>
        <span class="hub-card__title">Ecology</span>
        <span class="hub-card__text">
          Organisms, environment, population dynamics, and ecosystem thinking.
        </span>
      </a>

      <a href="{{ '/categories/genetics/' | relative_url }}" class="hub-card">
        <span class="hub-card__icon" aria-hidden="true">🧫</span>
        <span class="hub-card__title">Genetics</span>
        <span class="hub-card__text">
          Heredity, variation, molecular logic, and inheritance patterns.
        </span>
      </a>

      <a href="{{ '/categories/biostatistics/' | relative_url }}" class="hub-card">
        <span class="hub-card__icon" aria-hidden="true">📊</span>
        <span class="hub-card__title">Biostatistics</span>
        <span class="hub-card__text">
          Data, dispersion, probability, interpretation, and biological inference.
        </span>
      </a>

    </div>
  </section>

  <section class="hub-section" aria-labelledby="all-synaptic-biology-nodes">
    <h2 id="all-synaptic-biology-nodes" class="section-heading">All Synaptic Biology Nodes</h2>

    <p class="section-intro">
      Latest biology entries connected to this hub.
    </p>

    <div class="entries-list card-grid">

      {% assign biology_collection = site.biology | sort: "date" | reverse %}

      {% if biology_collection and biology_collection.size > 0 %}
        {% for post in biology_collection %}
          {% include archive-single.html %}
        {% endfor %}
      {% else %}

        {% assign biology_posts = site.posts | where_exp: "post", "post.categories contains 'biology' or post.categories contains 'botany' or post.categories contains 'zoology' or post.categories contains 'physiology' or post.categories contains 'ecology' or post.categories contains 'genetics' or post.categories contains 'biostatistics'" %}

        {% if biology_posts and biology_posts.size > 0 %}
          {% for post in biology_posts %}
            {% include archive-single.html %}
          {% endfor %}
        {% else %}
          <p class="archive__warning">
            <em>Neural synchronization in progress. Biology assets are being connected.</em>
          </p>
        {% endif %}

      {% endif %}

    </div>
  </section>

</div>

{% include hubs/omega-hub-styles.html %}
