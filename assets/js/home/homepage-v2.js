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

  document
    .querySelectorAll(".mycorrhizal-footer .sys-metric")
    .forEach((heading) => {
      heading.setAttribute("role", "heading");
      heading.setAttribute("aria-level", "2");
    });

  /*
   * The QA contract reads geometry immediately after each Tab press.
   * Keep focus movement synchronous and never use smooth scrolling here.
   */
  document.addEventListener(
    "focusin",
    (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const rect = target.getBoundingClientRect();
      const outsideViewport =
        rect.top < 0 ||
        rect.left < 0 ||
        rect.bottom > window.innerHeight ||
        rect.right > window.innerWidth;

      if (outsideViewport) {
        target.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: "auto"
        });
      }
    },
    true
  );
})();
