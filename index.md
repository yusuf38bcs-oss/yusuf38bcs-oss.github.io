---
layout: home
permalink: /
author_profile: false

# Direct layout variables passed cleanly to page__hero.html
title: "Where Biology Meets Life"
excerpt: "A Neural Educational Ecosystem for Reflective Scientific Learning."

header:
  overlay_image: /assets/images/header-bg.webp
  caption: null
---

<style>
/* =========================================================
   GLOBAL FOUNDATION & ECOSYSTEM THEME
========================================================= */
html,
body {
  overflow-x: hidden;
  scroll-behavior: smooth;
}

body {
  background: radial-gradient(circle at top, #0b2133, #020812 65%) !important;
  color: #eef7ff !important;
}

/* Hard shutdown for the theme's automatic read-time meta injection */
.page__meta {
  display: none !important;
}

/* =========================================================
   HERO SYSTEM
========================================================= */
.page__hero--overlay {
  min-height: 88svh !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  position: relative !important;
  text-align: left !important;
}

/* Cinematic Darkening Layer */
.page__hero--overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(2, 8, 18, 0.2) 0%,
    rgba(2, 8, 18, 0.55) 50%,
    rgba(2, 8, 18, 0.92) 100%
  ) !important;
  z-index: 1;
}

/* Elevating the content container over the image overlay filters */
.page__hero-caption,
.page__hero-content {
  position: relative !important;
  z-index: 2 !important;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem !important;
}

/* =========================================================
   SINGLE HERO TITLE & SUBTITLE DESIGN
========================================================= */
.page__hero-content .page__title {
  font-size: clamp(2.5rem, 7.5vw, 5.8rem) !important;
  font-weight: 800 !important;
  line-height: 1.05 !important;
  color: #ffffff !important;
  margin-top: 0 !important;
  margin-bottom: 1.25rem !important;
  text-align: left !important;
  text-shadow: 0 0 30px rgba(0, 255, 180, 0.18) !important;
}

.page__hero-content .page__lead {
  max-width: 720px !important;
  font-size: clamp(1.05rem, 2vw, 1.35rem) !important;
  line-height: 1.75 !important;
  color: rgba(235, 247, 255, 0.9) !important;
  text-align: left !important;
  margin-bottom: 0 !important;
}

/* Subtle cinematic fading intro animation */
.page__hero-content > * {
  animation: immersiveFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes immersiveFadeIn {
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
   MOBILE RESPONSIVE SYSTEM (SHOWN IN YOUR SCREENSHOT)
========================================================= */
@media (max-width: 768px) {
  .page__hero--overlay {
    min-height: 82svh !important;
    align-items: flex-end !important; /* Drop content gracefully on small viewports */
    background-position: 65% center !important; /* Focus on the neural node visuals */
    padding-bottom: 4.5rem !important;
  }

  .page__hero-caption,
  .page__hero-content {
    padding: 0 1.5rem !important;
  }

  .page__hero-content .page__title {
    font-size: clamp(2.2rem, 8.5vw, 3.4rem) !important;
    margin-bottom: 1rem !important;
  }

  .page__hero-content .page__lead {
    font-size: 1.1rem !important;
    line-height: 1.6 !important;
    max-width: 100% !important;
  }
}

@media (max-width: 480px) {
  .page__hero--overlay {
    min-height: 75svh !important;
    padding-bottom: 3.5rem !important;
  }
}

/* =========================================================
   MAIN CONTENT ARCHITECTURE
========================================================= */
.page__content {
  max-width: 1280px;
  margin: auto;
  padding: 2rem 1rem;
}
</style>

{% include home-sections.html %}