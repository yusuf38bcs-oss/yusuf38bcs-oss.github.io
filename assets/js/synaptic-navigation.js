// ============================================================================
// SYNAPTIC NAVIGATION — Production Mobile Hamburger & Drawer Control
// Learning Biology For Life — Neural UI Layer
// ============================================================================

(function() {
  "use strict";

  const SELECTORS = {
    toggle: ".masthead__menu-toggle, .neural-menu-toggle, [data-nav-toggle]",
    drawer: ".mobile-menu, .nav-drawer, .greedy-nav__drawer, [data-nav-drawer]",
    closeTriggers: ".mobile-menu__overlay, .nav-drawer__close, [data-nav-close]",
    focusable: 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  };

  const CLASSES = {
    active: "is-active-drawer",
    hidden: "is-hidden"
  };

  let toggleBtn = document.querySelector(SELECTORS.toggle);
  let drawer = document.querySelector(SELECTORS.drawer);
  let isOpen = false;
  let focusTrap = null;

  function init() {
    if (!toggleBtn) {
      // Fallback: search broader
      toggleBtn = document.querySelector(".hamburger-bar")?.closest("button, a, [role='button']")
               || document.querySelector("button[aria-label*='menu' i], button[aria-label*='nav' i]");
    }
    if (!drawer) {
      drawer = document.getElementById("site-nav")
             || document.querySelector(".masthead__menu, .greedy-nav, nav[role='navigation']");
    }
    if (!toggleBtn || !drawer) {
      console.warn("[SynapticNav] Toggle or drawer not found. Selectors:", SELECTORS);
      return;
    }

    // Set initial ARIA
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-controls", drawer.id || "site-nav-drawer");
    if (!drawer.id) drawer.id = "site-nav-drawer";
    drawer.setAttribute("aria-hidden", "true");

    // Event listeners
    toggleBtn.addEventListener("click", onToggle);
    toggleBtn.addEventListener("keydown", onToggleKey);

    document.addEventListener("click", onOutsideClick);
    document.addEventListener("keydown", onEscape);
    window.addEventListener("resize", debounce(onResize, 150));

    console.log("[SynapticNav] Initialized. Toggle:", toggleBtn.className, "Drawer:", drawer.className);
  }

  function onToggle(e) {
    e.preventDefault();
    isOpen ? closeDrawer() : openDrawer();
  }

  function onToggleKey(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(e);
    }
  }

  function openDrawer() {
    isOpen = true;
    drawer.classList.add(CLASSES.active);
    drawer.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    toggleBtn.setAttribute("aria-label", "Close navigation menu");
    document.body.style.overflow = "hidden";
    enableFocusTrap();
  }

  function closeDrawer() {
    isOpen = false;
    drawer.classList.remove(CLASSES.active);
    drawer.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-label", "Open navigation menu");
    document.body.style.overflow = "";
    disableFocusTrap();
    toggleBtn.focus();
  }

  function onOutsideClick(e) {
    if (isOpen && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeDrawer();
    }
  }

  function onEscape(e) {
    if (isOpen && e.key === "Escape") {
      closeDrawer();
    }
  }

  function onResize() {
    if (window.innerWidth >= 768 && isOpen) {
      closeDrawer();
    }
  }

  function enableFocusTrap() {
    const focusables = drawer.querySelectorAll(SELECTORS.focusable);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first.focus();

    focusTrap = function(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    drawer.addEventListener("keydown", focusTrap);
  }

  function disableFocusTrap() {
    if (focusTrap) {
      drawer.removeEventListener("keydown", focusTrap);
      focusTrap = null;
    }
  }

  function debounce(fn, wait) {
    let t;
    return function() {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, arguments), wait);
    };
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
