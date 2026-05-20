---
layout: splash
permalink: /
title: "Where Biology Meets Life"
excerpt: "A Neural Educational Ecosystem for Reflective Scientific Learning."
classes: wide cinematic-hero-override

header:
  overlay_image: /assets/images/header-bg.webp
  overlay_filter: 0.36
  caption: null
  actions:
    - label: "Explore the Ecosystem"
      url: "#ecosystem-intro"
      class: "btn--light-outline btn--large"
---

<style>

/* =========================================================
   GLOBAL FOUNDATION
========================================================= */

html,
body {
  overflow-x: hidden;
  scroll-behavior: smooth;
}

body {
  background:
    radial-gradient(circle at top, #07111f 0%, #020812 70%);

  color: #eef7ff;
}

/* =========================================================
   HERO FOUNDATION
========================================================= */

.cinematic-hero-override .page__hero--overlay {

  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;

  min-height: 88svh;

  padding: 7rem 0 6rem;

  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;

  text-align: left !important;
}

/* =========================================================
   CINEMATIC OVERLAY
========================================================= */

.cinematic-hero-override .page__hero--overlay::before {

  content: "";

  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      to bottom,
      rgba(2, 6, 23, 0.12) 0%,
      rgba(2, 6, 23, 0.46) 45%,
      rgba(1, 7, 14, 0.86) 100%
    );

  z-index: 0;
}

/* =========================================================
   CONTENT WRAPPER
========================================================= */

.cinematic-hero-override .page__hero--overlay .wrapper {

  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 1280px;

  margin: 0 auto;

  padding-left: 2rem;
  padding-right: 2rem;
}

/* =========================================================
   HERO CONTENT BLOCK
========================================================= */

.cinematic-hero-override .page__hero--overlay .page__hero-caption,
.cinematic-hero-override .page__hero--overlay .page__hero-content {

  max-width: 760px;
}

/* =========================================================
   TITLE FIX
========================================================= */

.cinematic-hero-override .page__title {

  position: relative;
  z-index: 3;

  display: block;

  max-width: 680px;

  margin: 0 0 1.2rem 0 !important;

  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 800;
  line-height: 0.96;
  letter-spacing: -0.05em;

  color: #ffffff !important;

  text-shadow:
    0 4px 28px rgba(0, 0, 0, 0.55),
    0 0 22px rgba(0, 255, 180, 0.16);

  animation: heroFade 1s ease forwards;
}

/* =========================================================
   REMOVE DUPLICATED GENERATED TITLE EFFECTS
========================================================= */

.cinematic-hero-override .page__title::before,
.cinematic-hero-override .page__title::after {
  display: none !important;
  content: none !important;
}

/* =========================================================
   SUBTITLE FIX
========================================================= */

.cinematic-hero-override .page__lead {

  position: relative;
  z-index: 3;

  max-width: 640px;

  margin-top: 1rem !important;
  margin-bottom: 2rem !important;

  font-size: clamp(1.05rem, 2vw, 1.42rem);
  font-weight: 400;
  line-height: 1.7;

  color: rgba(240, 248, 255, 0.94) !important;

  text-shadow:
    0 2px 12px rgba(0, 0, 0, 0.45);

  animation: heroFade 1.25s ease forwards;
}

/* =========================================================
   CTA BUTTON
========================================================= */

.cinematic-hero-override .btn--light-outline {

  border-radius: 999px;

  padding: 0.9rem 1.7rem;

  border: 1px solid rgba(255,255,255,0.35);

  backdrop-filter: blur(10px);

  background: rgba(255,255,255,0.05);

  transition: all .3s ease;
}

.cinematic-hero-override .btn--light-outline:hover {

  transform: translateY(-2px);

  background: rgba(255,255,255,0.12);
}

/* =========================================================
   HERO ANIMATION
========================================================= */

@keyframes heroFade {

  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================================================
   MAIN CONTENT
========================================================= */

.page__content {

  max-width: 1280px;
  margin: auto;
}

.neural-intro-section {

  padding-top: 3rem;
  padding-bottom: 3rem;
}

/* =========================================================
   TABLET OPTIMIZATION
========================================================= */

@media (max-width: 768px) {

  .cinematic-hero-override .page__hero--overlay {

    min-height: 76svh;

    align-items: flex-end;

    padding-top: 7rem;
    padding-bottom: 4rem;

    background-position: 62% center;
  }

  .cinematic-hero-override .page__hero--overlay .wrapper {

    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .cinematic-hero-override .page__title {

    max-width: 92%;

    font-size: 3.25rem;

    line-height: 0.98;
  }

  .cinematic-hero-override .page__lead {

    max-width: 94%;

    font-size: 1.08rem;

    line-height: 1.65;
  }
}

/* =========================================================
   MOBILE FIXES
========================================================= */

@media (max-width: 480px) {

  .cinematic-hero-override .page__hero--overlay {

    min-height: 72svh;

    padding-top: 6.5rem;
    padding-bottom: 3rem;

    background-position: 68% center;
  }

  .cinematic-hero-override .page__hero--overlay .wrapper {

    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }

  .cinematic-hero-override .page__title {

    font-size: 2.7rem;

    max-width: 95%;

    margin-bottom: 1rem !important;
  }

  .cinematic-hero-override .page__lead {

    font-size: 1rem;

    line-height: 1.7;

    max-width: 95%;
  }

  .cinematic-hero-override .btn--light-outline {

    width: 100%;

    text-align: center;
  }
}

/* =========================================================
   ACCESSIBILITY
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .cinematic-hero-override .page__title,
  .cinematic-hero-override .page__lead {

    animation: none !important;
  }
}

</style>

<div id="ecosystem-intro" class="neural-intro-section" markdown="1">

## A Systems Approach to Biology

Welcome to **Learning Biology For Life** — an interdisciplinary educational ecosystem integrating biology, reflective learning, behavioural science, leadership, and systems thinking.

### Core Learning Architecture

* **Systems Thinking** — Understanding biological interconnections rather than isolated facts.
* **Reflective Learning** — Connecting scientific concepts with real-world human behaviour.
* **Socratic Pedagogy** — Inquiry-driven frameworks that cultivate deep thinking.
* **Interdisciplinary Integration** — Bridging biology with cognition, leadership, and digital pedagogy.

</div>
