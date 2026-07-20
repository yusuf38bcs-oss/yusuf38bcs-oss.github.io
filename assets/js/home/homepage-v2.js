(() => {
  "use strict";

  const root = document.querySelector("[data-homepage-v2]");

  if (!root) {
    return;
  }

  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  const saveData = Boolean(connection && connection.saveData);
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  root.dataset.saveData = String(saveData);
  root.dataset.reducedMotion = String(reducedMotion);
  root.classList.add("lbfl-home-v2--enhanced");
})();