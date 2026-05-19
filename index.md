---
layout: home
author_profile: false
classes: wide
permalink: /

header:
  overlay_image: /assets/images/header-bg.webp
  overlay_filter: 0.28
  caption: "Learning Biology For Life"

excerpt: >
  Where Biology Meets Life —
  A Neural Educational Ecosystem Integrating
  Biology, Reflective Learning,
  Behavioural Science, Leadership,
  Systems Thinking & Socratic 4.0.
---

<style>

/* =========================================================
   GLOBAL FOUNDATION
========================================================= */

html,
body{
  overflow-x:hidden;
  scroll-behavior:smooth;
}

body{
  background:#03111d;
  color:#eef6ff;
}

/* =========================================================
   HERO
========================================================= */

.page__hero--overlay{
  min-height:100vh;
  position:relative;
}

.page__hero--overlay::before{
  content:"";

  position:absolute;
  inset:0;

  background:
    linear-gradient(
      to bottom,
      rgba(1,7,14,.35),
      rgba(1,7,14,.72)
    );

  z-index:0;
}

.page__hero-caption,
.page__hero-content{
  position:relative;
  z-index:2;
}

.page__title{
  font-size:clamp(2.7rem,7vw,6rem);
  line-height:1.05;
  font-weight:800;

  text-shadow:
    0 0 18px rgba(0,255,170,.18);
}

.page__lead{
  font-size:clamp(1rem,2vw,1.45rem);

  max-width:900px;

  line-height:1.8;
}

/* =========================================================
   MAIN CONTENT
========================================================= */

.page__content{
  max-width:1200px;
  margin:auto;
}

/* =========================================================
   DIVIDER
========================================================= */

.neural-divider{
  width:90%;
  height:1px;

  margin:5rem auto;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(0,255,170,.7),
      transparent
    );
}

/* =========================================================
   GRID
========================================================= */

.synaptic-grid{
  display:grid;

  grid-template-columns:
    repeat(auto-fit,minmax(280px,1fr));

  gap:2rem;

  margin-top:3rem;
}

.synaptic-card{
  background:
    rgba(255,255,255,.04);

  border:
    1px solid rgba(255,255,255,.08);

  border-radius:28px;

  padding:2rem;

  backdrop-filter:blur(12px);

  transition:.35s ease;
}

.synaptic-card:hover{
  transform:translateY(-6px);

  border-color:
    rgba(0,255,170,.4);

  box-shadow:
    0 0 24px rgba(0,255,170,.12);
}

.synaptic-card h2{
  margin-top:0;
  color:#7fffd4;
}

.synaptic-card p{
  line-height:1.8;
}

.synaptic-card a{
  color:#7fcfff;
  text-decoration:none;
  font-weight:600;
}

/* =========================================================
   SECTION TITLE
========================================================= */

.section-title{
  text-align:center;
  margin-bottom:3rem;
}

.section-title h2{
  font-size:clamp(2rem,4vw,3rem);
}

/* =========================================================
   SYMBOLIC SYSTEM
========================================================= */

.symbolic{
  text-align:center;
  opacity:.18;

  letter-spacing:1rem;

  margin-top:2rem;
}

/* =========================================================
   ACADEMIC POSTS
========================================================= */

.post-grid{
  display:grid;

  grid-template-columns:
    repeat(auto-fit,minmax(320px,1fr));

  gap:2rem;

  margin-top:3rem;
}

.post-card{
  background:
    rgba(255,255,255,.03);

  border:
    1px solid rgba(255,255,255,.08);

  border-radius:24px;

  overflow:hidden;
}

.post-card img{
  width:100%;
  height:220px;
  object-fit:cover;
}

.post-card-content{
  padding:1.5rem;
}

/* =========================================================
   MOBILE
========================================================= */

@media(max-width:768px){

  .page__hero--overlay{
    min-height:85vh;
  }

  .synaptic-card{
    padding:1.5rem;
  }

  .post-card img{
    height:180px;
  }
}

</style>

<div class="section-title">

## Where Biology Meets Life

Academic biology connected with:
- reflective learning
- behavioural science
- systems thinking
- leadership
- Socratic intelligence

<div class="symbolic">
◯ ━━ ● ━━ ◯
</div>

</div>

<div class="neural-divider"></div>

<div class="synaptic-grid">

<div class="synaptic-card">

<h2>🧬 Biology</h2>

<p>
Explore biology from HSC foundations
to advanced zoology:
</p>

<ul>
<li>Animal Diversity</li>
<li>Human Physiology</li>
<li>Ecology</li>
<li>Genetics</li>
<li>Biostatistics</li>
</ul>

<a href="/biology/">
Enter Biology →
</a>

</div>

<div class="synaptic-card">

<h2>🌱 Life Practices</h2>

<p>
Integrating:
</p>

<ul>
<li>Human Behaviour</li>
<li>Reflective Thinking</li>
<li>Emotional Intelligence</li>
<li>Leadership</li>
<li>Biology & Life</li>
</ul>

<a href="/life-practices/">
Explore Life Practices →
</a>

</div>

<div class="synaptic-card">

<h2>🧠 Socratic</h2>

<p>
Interactive reflective learning ecosystem:
</p>

<ul>
<li>MCQ Arena</li>
<li>Critical Thinking</li>
<li>Reflective Journaling</li>
<li>Multiple Intelligence</li>
</ul>

<a href="/socratic/">
Enter Socratic →
</a>

</div>

</div>

<div class="neural-divider"></div>

<div class="section-title">

## Featured Academic Explorations

Latest interdisciplinary educational insights.

</div>

<div class="post-grid">

{% for post in site.posts limit:6 %}

<div class="post-card">

{% if post.header.teaser %}
<img src="{{ post.header.teaser }}" alt="{{ post.title }}">
{% endif %}

<div class="post-card-content">

<h3>
<a href="{{ post.url }}">
{{ post.title }}
</a>
</h3>

<p>
{{ post.excerpt | strip_html | truncate: 120 }}
</p>

</div>

</div>

{% endfor %}

</div>

<div class="neural-divider"></div>

## Vision

> “Learning Biology For Life evolves toward
> a living neural educational ecosystem integrating
> biology, systems thinking, reflective learning,
> behavioural science, leadership,
> spirituality & AI-assisted pedagogy.”