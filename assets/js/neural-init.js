/**
 * LBFL Neural Init — Issue 12 Consolidation
 * Single DOMContentLoaded owner. All modules initialize here.
 */
document.addEventListener('DOMContentLoaded', function () {
  window.NeuralBus = window.NeuralBus || {
    events: {},
    on: function (evt, cb) { (this.events[evt] = this.events[evt] || []).push(cb); },
    emit: function (evt, data) { (this.events[evt] || []).forEach(function (fn) { try { fn(data); } catch (e) { console.error(e); } }); }
  };

  // Mobile drawer
  var drawer = document.getElementById('neural-mobile-drawer');
  var toggle = document.querySelector('.greedy-nav__toggle');
  if (drawer && toggle) {
    toggle.addEventListener('click', function () {
      var open = !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      drawer.classList.toggle('hidden', !open);
      NeuralBus.emit('drawer:toggle', { open: open });
    });
  }

  // Pause canvas when drawer opens
  NeuralBus.on('drawer:toggle', function (e) {
    var canvas = document.getElementById('neural-network');
    if (canvas) canvas.dataset.paused = e.open ? 'true' : 'false';
  });

  // Lazy images fallback
  document.querySelectorAll('img[data-src]').forEach(function (img) {
    img.src = img.dataset
