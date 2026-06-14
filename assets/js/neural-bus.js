window.NeuralBus = (function () {
  const events = {};
  return {
    on: function (evt, cb) { if (!events[evt]) events[evt] = []; events[evt].push(cb); },
    off: function (evt, cb) { if (!events[evt]) return; events[evt] = events[evt].filter(fn => fn !== cb); },
    emit: function (evt, data) { if (!events[evt]) return; events[evt].forEach(fn => { try { fn(data); } catch (e) { console.error('NeuralBus error:', e); } }); }
  };
})();

document.addEventListener('DOMContentLoaded', function () {
  const drawer = document.getElementById('neural-mobile-drawer');
  const toggle = document.querySelector('.greedy-nav__toggle');
  if (drawer && toggle) {
    toggle.addEventListener('click', function () {
      NeuralBus.emit('drawer:toggle', { open: !drawer.classList.contains('is-open') });
    });
  }
});