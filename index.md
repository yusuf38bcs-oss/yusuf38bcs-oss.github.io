---
layout: splash
permalink: /
title: "Learning Biology For Life"
classes: wide
header:
  overlay_image: /assets/images/site/header-bg.png
  overlay_filter: 0.18
excerpt: "Connecting biology, AI, leadership, and life through Synaptic Bridge Learning."
---

<style>
.page__hero,
.page__hero--overlay {
  display: none !important;
}

.synaptic-hero-section {
  position: relative;
  width: 100%;
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  padding: 60px 20px;

  background:
    linear-gradient(
      135deg,
      rgba(1,10,25,0.90),
      rgba(2,22,42,0.84)
    ),
    url('/assets/images/site/header-bg.png') center/cover no-repeat;
}

.synaptic-hero-section::before {
  content: "";

  position: absolute;
  inset: 0;

  background:
    radial-gradient(circle at top left,
      rgba(0,255,255,0.22),
      transparent 35%),
    radial-gradient(circle at bottom right,
      rgba(0,170,255,0.18),
      transparent 42%);

  z-index: 1;
}

.synaptic-grid {
  position: absolute;
  inset: 0;

  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);

  background-size: 60px 60px;

  opacity: 0.20;

  z-index: 0;
}

.glass-card {
  position: relative;
  z-index: 3;

  background: rgba(10, 20, 35, 0.36);

  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border: 1px solid rgba(255,255,255,0.16);

  box-shadow:
    0 8px 32px rgba(0,0,0,0.38),
    0 0 42px rgba(0,255,220,0.10);

  border-radius: 30px;

  padding: 60px 44px;

  max-width: 900px;

  text-align: center;

  color: #ffffff;
}

.glass-card::before {
  content: "";

  position: absolute;
  inset: 0;

  border-radius: 30px;

  background: linear-gradient(
    145deg,
    rgba(255,255,255,0.08),
    transparent 48%
  );

  pointer-events: none;
}

.synaptic-label {
  color: #4cf6d2;

  text-transform: uppercase;

  letter-spacing: 0.24em;

  font-weight: 700;

  margin-bottom: 22px;

  font-size: 0.95rem;
}

.glass-card h1 {
  font-size: clamp(2.8rem, 7vw, 6rem);

  font-weight: 800;

  line-height: 0.94;

  margin-bottom: 28px;

  letter-spacing: -2px;

  text-shadow: 0 4px 24px rgba(0,0,0,0.45);
}

.glass-card p {
  font-size: 1.16rem;

  line-height: 1.9;

  color: rgba(255,255,255,0.88);

  max-width: 760px;

  margin: 0 auto 38px;
}

.subscribe-form {
  display: flex;

  justify-content: center;

  align-items: center;

  gap: 14px;

  flex-wrap: wrap;
}

.glass-input {
  background: rgba(255,255,255,0.10);

  border: 1px solid rgba(255,255,255,0.22);

  padding: 16px 22px;

  border-radius: 999px;

  color: #ffffff;

  width: min(100%, 360px);

  outline: none;

  font-size: 1rem;

  transition: all 0.3s ease;
}

.glass-input::placeholder {
  color: rgba(255,255,255,0.68);
}

.glass-input:focus {
  border-color: #49f7e1;

  background: rgba(255,255,255,0.16);

  box-shadow: 0 0 20px rgba(73,247,225,0.18);
}

.glass-button {
  background: linear-gradient(
    135deg,
    #49f7e1 0%,
    #59b7ff 100%
  );

  border: none;

  padding: 16px 30px;

  border-radius: 999px;

  color: #04111f;

  font-weight: 800;

  font-size: 1rem;

  cursor: pointer;

  transition: all 0.3s ease;

  box-shadow: 0 6px 22px rgba(73,247,225,0.22);
}

.glass-button:hover {
  transform: translateY(-3px);

  box-shadow: 0 12px 32px rgba(73,247,225,0.34);
}

@media (max-width: 768px) {

  .synaptic-hero-section {
    padding: 90px 18px;
  }

  .glass-card {
    padding: 42px 24px;
    border-radius: 24px;
  }

  .glass-card h1 {
    line-height: 1.02;
    letter-spacing: -1px;
  }

  .glass-card p {
    font-size: 1rem;
  }

  .subscribe-form {
    flex-direction: column;
  }

  .glass-input,
  .glass-button {
    width: 100%;
  }
}
</style>

<div class="synaptic-hero-section">

  <div class="synaptic-grid"></div>

  <div class="glass-card">

    <div class="synaptic-label">
      Synaptic Bridge Learning
    </div>

    <h1>
      Learning<br>
      Biology For<br>
      Life
    </h1>

    <p>
      Connecting scientific theory to real life through biology,
      leadership, AI-driven learning, multidisciplinary exploration,
      and the Socratic 4.0 educational framework.
    </p>

    <div class="subscribe-form">

      <input
        type="email"
        class="glass-input"
        placeholder="Enter your email to cross the bridge..."
      >

      <button class="glass-button">
        Join the Network
      </button>

    </div>

  </div>

</div>
