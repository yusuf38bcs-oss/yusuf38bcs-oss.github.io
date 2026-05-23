const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  document.documentElement.classList.add('reduced-motion');
}

document.addEventListener('visibilitychange', () => {

  document.body.classList.toggle(
    'tab-hidden',
    document.hidden
  );

});

window.addEventListener('scroll', () => {

  document.body.classList.add('is-scrolling');

  clearTimeout(window.scrollTimer);

  window.scrollTimer = setTimeout(() => {
    document.body.classList.remove('is-scrolling');
  }, 150);

}, { passive: true });