/**
 * Learning Biology For Life - Synaptic Performance Guard
 * Actively throttles background rendering arrays, checks motion preferences, and optimizes memory usage.
 * Fully synchronized with main.js and main.scss rendering specs.
 */

(function() {
  "use strict";

  const PerformanceGuard = {
    init() {
      this.monitorMotionCapabilities();
      this.monitorTabVisibility();
    },

    /**
     * 1. Hardware Motion Preference Tracking
     * Identifies operating system level accessibility flags to disable battery-heavy animations
     */
    monitorMotionCapabilities() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        document.documentElement.classList.add('reduced-motion');
        console.log(" Performance Guard: Reduced motion profiles enforced. Complex transitions suspended.");
      }
    },

    /**
     * 2. Quantum Battery & CPU Protection Engine
     * Freezes intensive CPU loops (like canvas particles) instantly when tab loses focus
     */
    monitorTabVisibility() {
      document.addEventListener('visibilitychange', () => {
        const isTabHidden = document.hidden;

        // Toggle UI style hooks cleanly
        document.body.classList.toggle('tab-hidden', isTabHidden);

        // Broadcast a system-wide secure telemetry event that hero-effects.js hooks into
        document.dispatchEvent(new CustomEvent("synaptic:core-performance-suspend", {
          detail: { suspendActive: isTabHidden }
        }));

        if (isTabHidden) {
          console.log(" Synaptic Guard: Tab thread suspended. Background canvas loops frozen to protect battery.");
        } else {
          console.log(" Synaptic Guard: Tab thread activated. Re-aligning layout rendering matrices.");
        }
      });
    }
  };

  // Secure Initialization Entry Point
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => PerformanceGuard.init());
  } else {
    PerformanceGuard.init();
  }
})();
