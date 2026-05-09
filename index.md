---
layout: splash
permalink: /
header:
  overlay_color: '#081b29'
  overlay_filter: rgba(8, 27, 41, 0.8)
  overlay_image: /assets/images/head-bg.jpg
  title: 'Learning Biology For Life'
  excerpt: >
    Welcome to the Synaptic Bridge — where biology transcends textbooks and becomes a framework for leadership, cognition, human behaviour, and life itself.
  cta_label: 'Enter The Cognitive System'
  cta_url: '/dashboard/'
classes: wide
---

<!-- === SYNAPTIC FRONTIER GRID (Three Pillars) === -->
<div class="feature__wrapper">
  
  <!-- Pillar 1 -->
  <div class="feature__item synaptic-card--biology">
    <i class="fas fa-dna fa-3x" style="color:#27ae60;margin-bottom:1rem;"></i>
    <h2>The Dots</h2>
    <p>Build deep academic mastery through Zoology, Human Physiology, Ecology, Genetics, and the Higher Zoology Tree.</p>
    <div class="synaptic-card-meta"><em>Scientific Foundation</em></div>
    <a href="/categories/biology/" class="btn btn--primary btn--block">Explore Biology</a>
  </div>

  <!-- Pillar 2 -->
  <div class="feature__item synaptic-card--leadership">
    <i class="fas fa-project-diagram fa-3x" style="color:#3498db;margin-bottom:1rem;"></i>
    <h2>The Lines</h2>
    <p>Discover how biological laws shape leadership, psychology, and strategic human behaviour.</p>
    <div class="synaptic-card-meta"><em>Applied Biology</em></div>
    <a href="/categories/leadership/" class="btn btn--primary btn--block">Apply To Life</a>
  </div>

  <!-- Pillar 3 -->
  <div class="feature__item synaptic-card--socratic">
    <i class="fas fa-brain fa-3x" style="color:#9b59b6;margin-bottom:1rem;"></i>
    <h2>The Bridge</h2>
    <p>Evolve through Socratic reflection, MCQ systems, and AI-powered learning feedback loops.</p>
    <div class="synaptic-card-meta"><em>Cognitive Growth</em></div>
    <a href="/dashboard/" class="btn btn--primary btn--block" style="background-color:#9b59b6;border-color:#9b59b6;">Test Your Synapse</a>
  </div>

</div>

---

<!-- === RECENT POSTS === -->
<div class="entries-list margin-top-4">
  {% for post in site.posts limit:6 %}
    {% include archive-single.html type="list" %}
  {% endfor %}
</div>

<div class="text-center margin-top-3">
  <a href="/year-archive/" class="btn btn--outline btn--large" style="border-color: var(--neural-navy); color: var(--neural-navy);">
    Explore The Full Archive
  </a>
</div>

---

<!-- === SIDE MODULES === -->

<div class="synaptic-split-layout margin-top-4">
  <div class="synaptic-sidebar sticky" style="flex:1;min-width:280px;">
    
    <div class="synaptic-side-card border-left-orange margin-bottom-2">
      <h3 class="text-orange margin-top-0">Cognitive Identity</h3>
      <p class="small text-muted">Discover your learning archetype, behavioural tendencies, and intelligence patterns.</p>
      <a href="/personality-test/" class="btn btn--warning btn--block">Find Your Archetype</a>
    </div>

    <div class="synaptic-side-card border-left-green margin-bottom-2">
      <h3 class="text-green margin-top-0">Explore Domains</h3>
      <div class="synaptic-domain-cloud">
        <a href="/categories/human-behaviour/" class="btn btn--success btn--small">Human Behaviour</a>
        <a href="/categories/biostatistics/" class="btn btn--success btn--small">Biostatistics</a>
        <a href="/categories/research-highlights/" class="btn btn--success btn--small">Research</a>
        <a href="/categories/leadership/" class="btn btn--success btn--small">Leadership</a>
      </div>
    </div>

    <div class="synaptic-side-card border-left-blue margin-bottom-2">
      <h3 class="text-blue margin-top-0">Socratic Reflex</h3>
      <blockquote class="socratic-quote small">
        "If evolution rewards adaptation, what happens to leaders who refuse to evolve?"
      </blockquote>
      <a href="/socratic-mcq-arena/" class="btn btn--primary btn--block">Enter MCQ Arena</a>
    </div>

    <div class="synaptic-side-card text-center border-left-gray">
      <h3 class="margin-top-0">Curiosity Loop</h3>
      <p class="small text-muted">Have a biological or leadership question?</p>
      <a href="/contact/" class="btn btn--inverse btn--block">Ask A Question</a>
    </div>
  </div>
</div>
