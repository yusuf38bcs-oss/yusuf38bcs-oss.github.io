---
layout: home
author_profile: false
classes: wide wide-container
permalink: /

header:
  overlay_image: /assets/images/header-bg.webp
  overlay_filter: 0.22
  caption: null

excerpt: >
  A Neural Educational Ecosystem
  for Reflective Scientific Learning.

page_class: hero-immersive
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
  background:
    radial-gradient(circle at top,#07111f,#020812 70%);

  color:#eef7ff;
}

/* =========================================================
   HERO SYSTEM
========================================================= */

.hero-immersive .page__hero--overlay{

  min-height:88svh;

  display:flex;

  align-items:flex-start;

  justify-content:center;

  position:relative;

  overflow:hidden;

  padding-top:12vh;

  background-position:center center;

  background-size:cover;

  background-repeat:no-repeat;
}

/* =========================================================
   CINEMATIC OVERLAY
========================================================= */

.hero-immersive .page__hero--overlay::before{

  content:"";

  position:absolute;
  inset:0;

  background:
    linear-gradient(
      to bottom,
      rgba(2,6,23,.08) 0%,
      rgba(2,6,23,.36) 40%,
      rgba(1,7,14,.82) 100%
    );

  z-index:0;
}

/* =========================================================
   HERO CONTENT WRAPPER
========================================================= */

.hero-immersive .wrapper{

  position:relative;

  z-index:2;

  width:100%;

  max-width:1280px;

  padding-left:2rem;

  padding-right:2rem;
}

/* =========================================================
   HERO TITLE
========================================================= */

.hero-immersive .page__title{

  max-width:680px;

  font-size:
    clamp(3rem,7vw,6rem);

  line-height:0.96;

  font-weight:800;

  letter-spacing:-0.04em;

  margin-bottom:1.3rem;

  text-shadow:
    0 0 24px rgba(0,255,170,.16);
}

/* =========================================================
   SUBTITLE
========================================================= */

.hero-immersive .page__lead{

  max-width:560px;

  font-size:
    clamp(1rem,2vw,1.28rem);

  line-height:1.8;

  color:
    rgba(235,245,255,.92);

  margin-top:1rem;

  text-shadow:
    0 2px 12px rgba(0,0,0,.45);
}

/* =========================================================
   HERO ENTRANCE
========================================================= */

.hero-immersive .page__title,
.hero-immersive .page__lead{

  animation:
    heroFade 1.1s ease forwards;
}

@keyframes heroFade{

  from{
    opacity:0;

    transform:
      translateY(20px);
  }

  to{
    opacity:1;

    transform:
      translateY(0);
  }
}

/* =========================================================
   MAIN CONTENT
========================================================= */

.page__content{

  max-width:1280px;

  margin:auto;
}

/* =========================================================
   MOBILE OPTIMIZATION
========================================================= */

@media (max-width:768px){

  .hero-immersive .page__hero--overlay{

    min-height:82svh;

    align-items:flex-start;

    justify-content:flex-start;

    padding-top:16vh;

    padding-bottom:3rem;

    background-position:64% center;
  }

  .hero-immersive .page__title{

    font-size:3.3rem;

    max-width:92%;
  }

  .hero-immersive .page__lead{

    font-size:1.08rem;

    line-height:1.75;

    max-width:95%;
  }

}

/* =========================================================
   SMALL DEVICES
========================================================= */

@media (max-width:480px){

  .hero-immersive .page__hero--overlay{

    min-height:78svh;

    padding-top:14vh;

    padding-bottom:2rem;
  }

  .hero-immersive .page__title{

    font-size:2.9rem;

    line-height:0.98;
  }

  .hero-immersive .page__lead{

    font-size:1rem;
  }

}

/* =========================================================
   ACCESSIBILITY
========================================================= */

@media (prefers-reduced-motion: reduce){

  .hero-immersive .page__title,
  .hero-immersive .page__lead{

    animation:none;
  }

}

</style>

# Where Biology
# Meets Life

{% include home-sections.html %}