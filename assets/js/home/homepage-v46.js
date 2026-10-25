/* LBFL V4.6: local-only prediction and unified decorative-motion controller. */
(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  const challenge = document.querySelector('[data-v46-challenge]');
  const check = challenge?.querySelector('[data-v46-check]');
  const reset = challenge?.querySelector('[data-v46-reset]');
  const feedback = challenge?.querySelector('[data-v46-feedback]');
  const evidence = challenge?.querySelector('[data-v46-evidence]');
  const revision = challenge?.querySelector('[data-v46-revision]');
  const radios = Array.from(challenge?.querySelectorAll('input[name="lbfl-v46-prediction"]') || []);

  check?.addEventListener('click', () => {
    const selected = radios.find((radio) => radio.checked);
    if (!selected) {
      feedback.textContent = 'Select a prediction or “I am not sure yet” before checking.';
      radios[0]?.focus();
      return;
    }
    const confidence = challenge.querySelector('[data-v46-confidence]')?.value || 'low';
    if (selected.value === 'out') {
      feedback.textContent = 'Your prediction matches the water-potential model. Explain why water leaves before you continue. Confidence recorded locally: ' + confidence + '.';
    } else if (selected.value === 'unsure') {
      feedback.textContent = 'Uncertainty is a useful starting point. Compare the model with your first idea, then explain the direction of water movement.';
    } else {
      feedback.textContent = 'Reconsider the water-potential difference. Inspect the explanation, repair the model, then predict again.';
    }
    if (evidence) evidence.open = true;
    if (revision) revision.hidden = false;
    if (reset) reset.hidden = false;
  });

  reset?.addEventListener('click', () => {
    radios.forEach((radio) => { radio.checked = false; });
    if (feedback) feedback.textContent = 'Choose a prediction, then check your reasoning.';
    if (revision) revision.hidden = true;
    if (evidence) evidence.open = false;
    radios[0]?.focus();
  });

  const motionButton = document.querySelector('[data-v46-motion-toggle]');
  const hero = document.querySelector('.lbfl-v3-hero');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let heroVisible = true;
  function syncMotion() {
    const stop = userPaused || reduced.matches || root.dataset.saveData === 'true' || document.hidden;
    body.dataset.v46MotionPaused = stop ? 'true' : 'false';
    body.dataset.v46HeroVisible = heroVisible ? 'true' : 'false';
    root.dataset.reducedMotion = reduced.matches ? 'true' : 'false';
    if (motionButton) {
      motionButton.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
      motionButton.textContent = userPaused ? 'Resume decorative motion' : 'Pause decorative motion';
    }
  }
  motionButton?.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  if (typeof reduced.addEventListener === 'function') reduced.addEventListener('change', syncMotion);
  else if (typeof reduced.addListener === 'function') reduced.addListener(syncMotion);
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      heroVisible = entries[0]?.isIntersecting !== false;
      syncMotion();
    }, { threshold: 0.02 }).observe(hero);
  }
  syncMotion();
})();
