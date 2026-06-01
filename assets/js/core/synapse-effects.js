/**
 * Learning Biology For Life - Synapse Effects Engine
 * Controls hardware-accelerated UI micro-interactions, cursor-tracking glows, 
 * and Web Animations API (WAAPI) routines with strict thread decoupling.
 */

(function() {
  "use strict";

  const SynapseEffects = {
    init() {
      this.initGlowTracking();
      this.initSynapticPulse();
      this.initMicroScrollReveal();
    },

    /**
     * 1. GPU-Friendly Dynamic Cursor Glow Tracking
     * Mutates local CSS variables on the GPU composite layer instead of triggering heavy layout repaints
     */
    initGlowTracking() {
      // Targeted selector hub matching both your home cards and workspace assessment cards
      const targetCards = document.querySelectorAll(".neural-card, .synaptic-bridge-shell, .mi-question-card, .question-item-card");
      
      if (!targetCards.length) return;

      targetCards.forEach(card => {
// Inject performance composition layering hints directly into browser engine
        card.style.willChange = "transform, background";

        card.addEventListener("mousemove", (e) => {
          const boundingBox = card.getBoundingClientRect();
          // Calculate precise vector coordinates relative to the element container box
          const relativeCursorX = e.clientX - boundingBox.left;
          const relativeCursorY = e.clientY - boundingBox.top;
          
          card.style.setProperty("--mouse-x", `${relativeCursorX}px`);
          card.style.setProperty("--mouse-y", `${relativeCursorY}px`);
        }, { passive: true });
      });
    },

    /**
     * 2. High-Performance Synaptic Pulse Engine
     * Leverages native Web Animations API (WAAPI) to bypass the main JS thread for infinite loops
     */
    initSynapticPulse() {
      const livePulseIndicators = document.querySelectorAll(".pulse-ring, .synaptic-indicator, .pulsing-core-dot");
      
      if (!livePulseIndicators.length) return;

      livePulseIndicators.forEach((element, orderIndex) => {
        // Explicitly isolate element centering arrays to ensure scale animations don't break flex layouts
        element.style.transformOrigin = "center center";

        element.animate([
          { transform: 'scale(0.85)', opacity: 0.4 },
          { transform: 'scale(1.15)', opacity: 0.15 },
          { transform: 'scale(1.4)', opacity: 0 }
        ], {
          duration: 2500,
          delay: orderIndex * 400, // Balanced staggers to form wave cascades
          iterations: Infinity,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)' // Premium smooth ease-out curves
        });
      });
    },

    /**
     * 3. Micro-Element Viewport Discovery Reveal
     * Handled via a streamlined IntersectionObserver targeting exclusive text-chips and micro-containers 
     * without cross-binding major container layouts already observed by section-transitions.js
     */
    initMicroScrollReveal() {
      if (!("IntersectionObserver" in window)) return;

      const microRevealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px"
      };

      const microObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("synapse-micro-reveal--active");
            observer.unobserve(entry.target); // Release memory hook immediately after paint
          }
        });
      }, microRevealOptions);

      // Exclusive query boundary focusing only on sub-elements
      const microItems = document.querySelectorAll(".reflective-inquiry, .mi-eyebrow-tag, .personality-status-badge");
      
      microItems.forEach(item => {
        item.classList.add("synapse-micro-reveal-scaffold");
        item.style.willChange = "opacity, transform";
        microObserver.observe(item);
      });
    }
  };

  // Safe Export for external asynchronous re-initializations inside main.js controllers
  window.SynapticVisualEffects = SynapseEffects;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => SynapseEffects.init());
  } else {
    SynapseEffects.init();
  }
})();
