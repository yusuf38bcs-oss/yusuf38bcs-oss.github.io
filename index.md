---
layout: splash
permalink: /
header:
  overlay_color: "#e6f2f5"
  overlay_filter: rgba(11, 83, 148, 0.6) # Enhanced contrast for the Frontal Lobe
  overlay_image: /assets/images/synaptic-bridge-hero.jpg
  excerpt: "Welcome to the Synaptic Bridge: Where Biology Meets Life.<br><br>Connecting scientific theory to reality through case studies, leadership insights, and the Socratic 4.0 Framework."
  cta_label: "Start Your Journey"
  cta_url: "/categories/zoology/"
---

<div class="notice--info text-center synaptic-newsletter-box">
  <h3>Bridge the Gap. Join the Newsletter.</h3>
  <p>Get biological insights and leadership lessons delivered straight to your inbox.</p>
  <button class="btn btn--primary btn--large" onclick="openBrevoModal()">Subscribe Now</button>
</div>

<h2 class="text-center">The Three Pillars of Synthesis</h2>

<div class="grid__wrapper">
  <div class="grid__item">
    <div class="archive__item text-center synaptic-card">
      <div class="archive__item-teaser">
        <i class="fas fa-dna fa-3x icon-biology"></i>
      </div>
      <div class="archive__item-body">
        <h3 class="archive__item-title">The Dots</h3>
        <p>Master the complexities of the <strong>HSC Corner</strong> and the <strong>Higher Zoology Tree</strong>. Pure scientific theory designed for academic excellence.</p>
        <a href="/categories/zoology/" class="btn btn--success">Explore Biology</a>
      </div>
    </div>
  </div>

  <div class="grid__item">
    <div class="archive__item text-center synaptic-card">
      <div class="archive__item-teaser">
        <i class="fas fa-project-diagram fa-3x icon-leadership"></i>
      </div>
      <div class="archive__item-body">
        <h3 class="archive__item-title">The Lines</h3>
        <p>Applying biological laws to <strong>Human Behaviour</strong> and <strong>Leadership Management</strong>. Science in action for everyday life.</p>
        <a href="/categories/leadership/" class="btn btn--info">Apply to Life</a>
      </div>
    </div>
  </div>

  <div class="grid__item">
    <div class="archive__item text-center synaptic-card">
      <div class="archive__item-teaser">
        <i class="fas fa-brain fa-3x icon-socratic"></i>
      </div>
      <div class="archive__item-body">
        <h3 class="archive__item-title">The Bridge</h3>
        <p>Test your synthesis with the <strong>MCQ Arena</strong>, <strong>MI Analysis</strong>, and <strong>Personality Tests</strong>. Feedback for the evolving learner.</p>
        <a href="/mi-analysis/" class="btn btn--warning">Test Your Synapse</a>
      </div>
    </div>
  </div>
</div>

<hr>

<div class="synaptic-split-layout">
  
  <div class="academic-feed">
    <h2>Latest Biological Insights</h2>
    <div class="entries-list">
      {% for post in site.posts limit:5 %}
        {% include archive-single.html type="list" %}
      {% endfor %}
    </div>
    <div class="text-center">
      <a href="/year-archive/" class="btn btn--outline">View All Posts</a>
    </div>
  </div>
  
  <aside class="socratic-sidebar sticky">
    <div class="notice--primary">
      <h3 class="margin-top-0">Socratic Reflex</h3>
      <blockquote class="socratic-quote">
        "If every cell in your body replaces itself every seven years, are you still the same leader you were a decade ago?"
      </blockquote>
      <a href="/categories/mcq/" class="btn btn--primary btn--block">Enter MCQ Arena</a>
    </div>
    
    <div class="notice--warning text-center margin-top-2">
      <h3 class="margin-top-0">Self-Discovery</h3>
      <p><strong>What is your Archetype?</strong></p>
      <a href="/personality-test/" class="btn btn--warning btn--block">Find Your Intelligence Zone</a>
    </div>
  </aside>

</div>
