(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  root.dataset.saveData = saveData ? 'true' : 'false';

  const heroVisual = document.querySelector('[data-v3-hero-visual]');
  const heroMediaTemplate = heroVisual?.querySelector('template[data-v3-hero-media]');

  if (saveData) {
    heroVisual?.setAttribute('hidden', '');
  } else if (heroMediaTemplate instanceof HTMLTemplateElement) {
    heroMediaTemplate.replaceWith(heroMediaTemplate.content.cloneNode(true));
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.dataset.reducedMotion = reducedMotion ? 'true' : 'false';

  const menu = document.querySelector('[data-v3-menu]');
  const openButton = document.querySelector('[data-v3-menu-open]');
  const closeButton = document.querySelector('[data-v3-menu-close]');
  let returnFocus = null;

  function openMenu() {
    if (!(menu instanceof HTMLDialogElement)) return;
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : openButton;
    if (!menu.open) menu.showModal();
    const first = menu.querySelector('button, a[href], [tabindex]:not([tabindex="-1"])');
    if (first instanceof HTMLElement) first.focus();
  }

  function closeMenu() {
    if (!(menu instanceof HTMLDialogElement)) return;
    if (menu.open) menu.close();
  }

  openButton?.addEventListener('click', openMenu);
  closeButton?.addEventListener('click', closeMenu);
  menu?.addEventListener('click', (event) => {
    if (event.target === menu) closeMenu();
  });
  menu?.addEventListener('close', () => {
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
  });
})();
