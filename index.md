---
layout: home
title: "Learning Biology For Life"
classes: wide
header:
  overlay_image: /assets/images/site/header-bg.webp
  overlay_filter: 0.72
  caption: "Synaptic Bridge Learning"
  actions:
    - label: "Start Biology Map"
      url: "/biology/"
    - label: "Explore Socratic Tools"
      url: "/socratic/"
excerpt: "Explore the wonders of biology - from cells to ecosystems."
---

<style>
.hero {
  position: relative;
  overflow: hidden;
  min-height: 100vh;

  background:
    radial-gradient(circle at left center,
      rgba(0,255,180,0.18),
      transparent 42%),
    linear-gradient(
      135deg,
      #021427 0%,
      #041b34 45%,
      #020816 100%
    );
}

.page__hero--overlay {
  position: relative;
  min-height: 100vh;

  background-position: center center !important;
  background-size: cover !important;
}

.page__hero--overlay::before {
  content: "";

  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      to bottom,
      rgba(1,8,20,0.15),
      rgba(1,8,20,0.72)
    );

  z-index: 1;
}

.page__hero--overlay::after {
  content: "";

  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  height: 42%;

  background-image:
    url('/assets/images/site/neural-network.webp');

  background-size: cover;
  background-position: center bottom;
  background-repeat: no-repeat;

  opacity: 0.30;

  mix-blend-mode: screen;

  mask-image: linear-gradient(
    to top,
    transparent,
    rgba(0,0,0,1) 28%
  );

  -webkit-mask-image: linear-gradient(
    to top,
    transparent,
    rgba(0,0,0,1) 28%
  );

  z-index: 1;

  pointer-events: none;
}

.page__hero--overlay .wrapper {
  position: relative;
  z-index: 3;
}

.page__hero-caption {
  color: #4cf6d2 !important;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 700;
}

.page__title {
  text-shadow: 0 4px 24px rgba(0,0,0,0.55);
}

.page__lead {
  text-shadow: 0 2px 12px rgba(0,0,0,0.45);
}

.btn {
  border-radius: 999px !important;
  backdrop-filter: blur(4px);
}

@media (max-width: 768px) {

  .page__hero--overlay {
    min-height: 92vh;
  }

  .page__hero--overlay::after {
    height: 34%;
    opacity: 0.22;
  }

}
</style>

Biology becomes meaningful when it connects structure, function, behaviour, and life practice.
