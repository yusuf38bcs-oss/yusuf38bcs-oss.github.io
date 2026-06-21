/**
 * Core Mobile Drawer Controller | Safe Patch v1.2
 * WCAG AA Compliant | Vanilla JS
 */
(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    const toggleBtn = document.getElementById("neural-mobile-toggle") || document.querySelector(".greedy-nav__toggle");
    const drawer = document.getElementById("neural-mobile-drawer") || document.querySelector(".greedy-nav__hidden");
    const masthead = document.querySelector(".neural-site-masthead");

    if (!toggleBtn || !drawer) return;

    let previousBodyOverflow = "";

    const setBodyLock = (isLocked) => {
      if (isLocked) {
        previousBodyOverflow = document.body.style.overflow || "";
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = previousBodyOverflow;
        previousBodyOverflow = "";
      }
    };

    const toggleDrawer = (forceState) => {
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      const newState = typeof forceState === "boolean" ? forceState : !isExpanded;
      
      // Accessibility States
      toggleBtn.setAttribute("aria-expanded", String(newState));
      drawer.setAttribute("aria-hidden", String(!newState));
      
      // Visual States
      drawer.classList.toggle("is-open", newState);
      if (masthead) masthead.classList.toggle("is-active-drawer", newState);

      // Prevent body scroll while preserving previous inline overflow state.
      setBodyLock(newState);
    };

    toggleBtn.setAttribute("aria-expanded", toggleBtn.getAttribute("aria-expanded") || "false");
    drawer.setAttribute("aria-hidden", drawer.getAttribute("aria-hidden") || "true");

    toggleBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleDrawer();
    });

    // Close on outside click.
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (toggleBtn.getAttribute("aria-expanded") === "true" && !drawer.contains(target) && !toggleBtn.contains(target)) {
        toggleDrawer(false);
      }
    });

    // Close on Escape key.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggleBtn.getAttribute("aria-expanded") === "true") {
        toggleDrawer(false);
        toggleBtn.focus();
      }
    });
  }, { once: true });
})();
