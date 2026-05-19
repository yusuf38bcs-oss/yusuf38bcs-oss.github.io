---
layout: home
author_profile: false
classes: wide wide-container
permalink: /

header:
  overlay_image: /assets/images/header-bg.webp
  overlay_filter: 0.24
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
  align-items:center;

  position:relative;

  overflow:hidden;

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
      rgba(2,6,23,.16) 0%,
      rgba(2,6,23,.48) 45%,
      rgba(1,7,14,.84) 100%
    );

  z-index:0;
}

/* =========================================================
   HERO CONTENT
========================================================= */

.hero-immersive .wrapper{

  position:relative;
  z-index:2;
}

.hero-immersive .page__title{

  max-width:700px;

  font-size:
    clamp(3rem,7vw,6rem);

  line-height:1.02;

  font-weight:800;

  margin-bottom:1.2rem;

  text-shadow:
    0 0 24px rgba(0,255,170,.18);
}

/* =========================================================
   REMOVE DUPLICATION
========================================================= */

.hero-immersive .page__title::after{
  content:"";
}

/* =========================================================
   SUBTITLE
========================================================= */

.hero-immersive .page__lead{

  max-width:620px;

  font-size:
    clamp(1rem,2vw,1.35rem);

  line-height:1.8;

  color:
    rgba(235,245,255,.92);

  margin-top:1rem;
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
      translateY(18px);
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

    min-height:78svh;

    align-items:flex-end;

    background-position:
      62% center;

    padding-bottom:4rem;
  }

  .hero-immersive .page__title{

    font-size:3.3rem;

    max-width:90%;
  }

  .hero-immersive .page__lead{

    font-size:1.08rem;

    line-height:1.7;

    max-width:92%;
  }

}

/* =========================================================
   SMALL DEVICES
========================================================= */

@media (max-width:480px){

  .hero-immersive .page__hero--overlay{

    min-height:72svh;

    padding-bottom:3rem;
  }

  .hero-immersive .page__title{

    font-size:2.8rem;
  }

}

</style>

# Where Biology Meets Life

{% include home-sections.html %}