/**
 * Learning Biology For Life - Navigation Scroll Engine
 * Optimizes masthead/header transitions during viewport scrolls using requestAnimationFrame.
 * Eradicates Layout Thrashing bugs to guarantee native 60 FPS scrolling on mobile devices.
 */

(function() {
  "use strict";

  const NavigationScrollEngine = {
    init() {
      // Cache the DOM selection once at startup (Neural Architecture target)
      this.header = document.querySelector(".neural-site-masthead");
      if (!this.header) return;

      this.isTicking = false;
      this.raf = window.requestAnimationFrame || function(callback) { return window.setTimeout(callback, 16); };
      this.bindScrollPipeline();
      this.evaluateHeaderState();
    },

    /**
     * Binds scroll event using native hardware-accelerated passive configurations
     */
    bindScrollPipeline() {
      window.addEventListener("scroll", () => {
        if (!this.isTicking) {
          // Synchronize layout reads/writes with the browser's next animation frame repaint thread
          this.raf(() => {
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
      if (!this.header) return;
      const currentScrollY = window.scrollY || window.pageYOffset || 0;

      this.header.classList.toggle("scrolled", currentScrollY > 50);
    }
  };

  // Secure Initialization Entry Point matching your Master Hub architecture
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => NavigationScrollEngine.init(), { once: true });
  } else {
    NavigationScrollEngine.init();
  }
})();
