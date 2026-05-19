---
layout: home
author_profile: false
classes: wide
permalink: /

header:
  overlay_image: /images/header-bg.webp
  overlay_filter: 0.38
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
      rgba(1,7,14,.22),
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
  font-size:clamp(2.8rem,7vw,6rem);

  line-height:1.05;

  font-weight:800;

  text-shadow:
    0 0 18px rgba(0,255,170,.18);
}

.page__lead{
  font-size:clamp(1rem,2vw,1.4rem);

  max-width:900px;

  line-height:1.8;
}

/* =========================================================
   MAIN CONTENT
========================================================= */

.page__content{
  max-width:1280px;
  margin:auto;
}

/* =========================================================
   REMOVE DUPLICATE FOOTER NAV
========================================================= */

.page__footer-follow,
.page__footer-copyright{
  text-align:center;
}

</style>

{% include home-sections.html %}