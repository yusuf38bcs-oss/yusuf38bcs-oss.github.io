/**
 * Learning Biology For Life - Navigation Scroll Engine
 * Optimizes masthead/header transitions during viewport scrolls using requestAnimationFrame.
 * Eradicates Layout Thrashing bugs to guarantee native 60 FPS scrolling on mobile devices.
 */

(function() {
  "use strict";

  const NavigationScrollEngine = {
    init() {
      // Cache the DOM selection once at startup (Supports both .site-header and Minimal Mistakes defaults)
      this.header = document.querySelector('.site-header') || document.querySelector('.masthead');
      if (!this.header) return;

      this.isTicking = false;
      this.bindScrollPipeline();
    },

    /**
     * Binds scroll event using native hardware-accelerated passive configurations
     */
    bindScrollPipeline() {
      window.addEventListener('scroll', () => {
        if (!this.isTicking) {
          // Synchronize layout reads/writes with the browser's next animation frame repaint thread
          window.requestAnimationFrame(() => {
            this.evaluateHeaderState();
            this.isTicking = false;
          });
          this.isTicking = true;
        }
      }, { passive: true });
    },

    /**
     * Evaluates viewport coordinates and toggles active state classes efficiently
     */
    evaluateHeaderState() {
      const currentScrollY = window.scrollY || window.pageYOffset;

      if (currentScrollY > 50) {
        // Guard pattern: Mutate classlist only when state actually transitions
        if (!this.header.classList.contains('scrolled')) {
          this.header.classList.add('scrolled');
        }
      } else {
        if (this.header.classList.contains('scrolled')) {
          this.header.classList.remove('scrolled');
        }
      }
    }
  };

  // Secure Initialization Entry Point matching your Master Hub architecture
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => NavigationScrollEngine.init());
  } else {
    NavigationScrollEngine.init();
  }
})();
