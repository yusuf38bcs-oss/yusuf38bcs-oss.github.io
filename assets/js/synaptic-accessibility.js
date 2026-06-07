// ============================================================================
// SYNAPTIC ACCESSIBILITY — Focus Management & ARIA Live Regions
// ============================================================================

(function() {
  "use strict";

  // Announce page changes to screen readers
  const announcer = document.createElement("div");
  announcer.setAttribute("aria-live", "polite");
  announcer.setAttribute("aria-atomic", "true");
  announcer.className = "sr-only";
  announcer.style.cssText = "position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;";
  document.body.appendChild(announcer);

  window.SynapticA11y = {
    announce: (msg) => { announcer.textContent = msg; },
    setFocus: (selector) => {
      const el = document.querySelector(selector);
      if (el) { el.setAttribute("tabindex", "-1"); el.focus(); }
    }
  };

  // Skip link target fix
  document.querySelectorAll(".skip-link, [href^='#']").forEach(link => {
    link.addEventListener("click", function(e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) { target.setAttribute("tabindex", "-1"); target.focus(); }
    });
  });
})();
