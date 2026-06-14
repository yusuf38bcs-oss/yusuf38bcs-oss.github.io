/**
 * LBFL Neural Init — Single DOMContentLoaded owner
 */
document.addEventListener('DOMContentLoaded', function () {
  // 1. Bus available globally
  if (typeof NeuralBus === 'undefined') window.NeuralBus = { /* fallback */ on(){}, emit(){} };

  // 2. Mobile drawer toggle coordination
  const drawer = document.getElementById('neural-mobile-drawer');
  const toggle = document.querySelector('.greedy-nav__toggle');
  if (drawer && toggle) {
    toggle.addEventListener('click', function () {
      const open = !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      drawer.classList.toggle('hidden', !open);
      NeuralBus.emit('drawer:toggle', { open });
    });
  }

  // 3. Neural canvas pause on drawer open (if canvas exists)
  NeuralBus.on('drawer:toggle', function (e) {
    const canvas = document.getElementById('neural-network');
    if (!canvas) return;
    // If your canvas loop uses a running flag:
    canvas.dataset.paused = e.open ? 'true' : 'false';
  });

  // 4. Lazy image loading fallback
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(function (img) {
      img.src = img.dataset.src;
    });
  }
});
