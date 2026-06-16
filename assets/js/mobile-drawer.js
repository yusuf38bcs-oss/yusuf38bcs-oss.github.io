/**
 * Core Mobile Drawer Controller | Safe Patch v1.1
 * WCAG AA Compliant | Vanilla JS
 */
document.addEventListener("DOMContentLoaded", function() {
  const toggleBtn = document.getElementById("neural-mobile-toggle") || document.querySelector(".greedy-nav__toggle");
  const drawer = document.getElementById("neural-mobile-drawer") || document.querySelector(".greedy-nav__hidden");
  const masthead = document.querySelector(".neural-site-masthead");

  if (!toggleBtn || !drawer) {
    console.warn("[Nav Audit] Mobile drawer elements missing from DOM.");
    return;
  }

  const toggleDrawer = (forceState) => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    const newState = typeof forceState === "boolean" ? forceState : !isExpanded;
    
    // Accessibility States
    toggleBtn.setAttribute("aria-expanded", newState);
    drawer.setAttribute("aria-hidden", !newState);
    
    // Visual States
    drawer.classList.toggle("is-open", newState);
    if (masthead) masthead.classList.toggle("is-active-drawer", newState);

    // Prevent body scroll
    document.body.style.overflow = newState ? "hidden" : "";
  };

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDrawer();
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (toggleBtn.getAttribute("aria-expanded") === "true" && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleDrawer(false);
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggleBtn.getAttribute("aria-expanded") === "true") {
      toggleDrawer(false);
      toggleBtn.focus();
    }
  });
});
