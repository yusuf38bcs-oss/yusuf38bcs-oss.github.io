/**
 * Neural Navigation Controller v2
 * Learning Biology For Life — Synaptic UI
 * Fixes: selector mismatch, focus trap, resize reset, ARIA
 */

(function() {
  'use strict';

  // CRITICAL FIX: drawer must be the menu container, not the hamburger bar
  const SELECTORS = {
    toggle: '.masthead__menu-toggle, .neural-menu-toggle',
    drawer: '.masthead__menu, .greedy-nav__nav, .mobile-menu', // actual drawer wrapper
    body: 'body',
    focusable: 'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  };

  const CLASSES = {
    active: 'is-active-drawer',
    noScroll: 'no-scroll'
  };

  const toggleEl = document.querySelector(SELECTORS.toggle);
  const drawerEl = document.querySelector(SELECTORS.drawer);
  let focusableElements = [];
  let lastFocused = null;

  if (!toggleEl || !drawerEl) {
    console.warn('[NeuralNav] Missing toggle or drawer. Selectors:', SELECTORS);
    return;
  }

  // Initialize ARIA
  const drawerId = drawerEl.id || 'neural-drawer';
  drawerEl.id = drawerId;
  toggleEl.setAttribute('aria-expanded', 'false');
  toggleEl.setAttribute('aria-controls', drawerId);
  toggleEl.setAttribute('aria-label', 'Toggle navigation menu');
  drawerEl.setAttribute('aria-hidden', 'true');
  drawerEl.setAttribute('role', 'navigation');

  // Cache focusable items
  focusableElements = Array.from(drawerEl.querySelectorAll(SELECTORS.focusable));

  toggleEl.addEventListener('click', (e) => {
    e.preventDefault();
    toggleEl.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  // Outside click
  document.addEventListener('click', (e) => {
    if (drawerEl.classList.contains(CLASSES.active) &&
        !drawerEl.contains(e.target) &&
        !toggleEl.contains(e.target)) {
      close();
    }
  });

  // Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerEl.classList.contains(CLASSES.active)) {
      close();
    }
  });

  // Focus trap
  drawerEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || focusableElements.length === 0) return;
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // CRITICAL FIX: Resize to desktop resets drawer
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 768 && drawerEl.classList.contains(CLASSES.active)) {
        close();
      }
    }, 100);
  });

  function open() {
    lastFocused = document.activeElement;
    toggleEl.setAttribute('aria-expanded', 'true');
    drawerEl.setAttribute('aria-hidden', 'false');
    drawerEl.classList.add(CLASSES.active);
    document.body.classList.add(CLASSES.noScroll);
    if (focusableElements.length) setTimeout(() => focusableElements[0].focus(), 50);
  }

  function close() {
    toggleEl.setAttribute('aria-expanded', 'false');
    drawerEl.setAttribute('aria-hidden', 'true');
    drawerEl.classList.remove(CLASSES.active);
    document.body.classList.remove(CLASSES.noScroll);
    if (lastFocused) lastFocused.focus();
  }
})();