---
layout: default
title: Synaptic Bridge
description: Mapping biological mechanisms to human behaviour, leadership, and reflective intelligence.
permalink: /
---

<section class="hero hero-synaptic">
  <div class="hero__content">
    <p class="eyebrow">Biology × Behaviour × Leadership</p>

    <h1>Build a living bridge between science and self-mastery.</h1>

    <p class="hero__lead">
      Synaptic Bridge connects biological concepts with human behaviour,
      leadership practice, Socratic reflection, and applied intelligence.
    </p>

    <div class="hero__actions">
      <a href="/biology/" class="btn btn-primary">Explore Biology</a>
      <a href="/socratic/" class="btn btn-secondary">Enter Socratic 4.0</a>
    </div>
  </div>

  <div class="hero__visual" aria-hidden="true">
    <div class="neuron-orb"></div>
    <div class="synapse-line synapse-line--one"></div>
    <div class="synapse-line synapse-line--two"></div>
  </div>
</section>

<section class="section">
  <div class="section-heading">
    <p class="eyebrow">Learning Topography</p>
    <h2>Three pathways, one integrated mind.</h2>
  </div>

  <div class="card-grid">
    <article class="feature-card">
      <span class="card-badge">Academic Pillar</span>
      <h3>Biology</h3>
      <p>
        Study zoology, physiology, genetics, evolution, ecology, taxonomy,
        and biostatistics through clear conceptual pathways.
      </p>
      <a href="/biology/">Start learning ?</a>
    </article>

    <article class="feature-card">
      <span class="card-badge">Practical Pillar</span>
      <h3>Life Practices</h3>
      <p>
        Translate biological mechanisms into leadership, human behaviour,
        productivity, creativity, and life design.
      </p>
      <a href="/life-practices/">Apply concepts ?</a>
    </article>

    <article class="feature-card">
      <span class="card-badge">Assessment Pillar</span>
      <h3>Socratic 4.0</h3>
      <p>
        Use MCQs, Multiple Intelligences analysis, personality reflection,
        and Socratic dialogue to deepen self-understanding.
      </p>
      <a href="/socratic/">Begin reflection ?</a>
    </article>
  </div>
</section>

<section class="section section-muted">
  <div class="section-heading">
    <p class="eyebrow">Latest Notes</p>
    <h2>Recent synaptic connections</h2>
  </div>

  <div class="post-grid">
    {% for post in site.posts limit:6 %}
      <article class="post-card">
        {% if post.image %}
          <img src="{{ post.image | relative_url }}" alt="{{ post.title }}">
        {% endif %}

        <div class="post-card__body">
          {% if post.categories %}
            <span class="card-badge">{{ post.categories | first }}</span>
          {% endif %}

          <h3>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h3>

          <p>{{ post.excerpt | strip_html | truncate: 140 }}</p>

          <small>
            {% assign words = post.content | number_of_words %}
            {% assign minutes = words | divided_by: 180 | plus: 1 %}
            {{ minutes }} min read
          </small>
        </div>
      </article>
    {% endfor %}
  </div>
</section>
