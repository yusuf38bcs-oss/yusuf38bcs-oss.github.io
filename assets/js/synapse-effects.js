/**
 * Learning Biology For Life - Synapse Effects Engine
 * Hardware-accelerated UI interactions and neural animations.
 */

(function() {
  "use strict";

  const SynapseEffects = {
    init() {
      this.initGlowTracking();
      this.initSynapticPulse();
      this.initScrollReveal();
    },

    /**
     * GLOW TRACKING: GPU-friendly mouse follow using CSS Variables.
     * Prevents browser repaints by updating variables instead of background strings.
     */
    initGlowTracking() {
      const cards = document.querySelectorAll(".neural-card, .synaptic-bridge-shell");
      
      cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        }, { passive: true });
      });
    },

    /**
     * SYNAPTIC PULSE: WAAPI (Web Animations API) for high-performance loops.
     * Targets .pulse-ring and .synapse-line elements.
     */
    initSynapticPulse() {
      const pulses = document.querySelectorAll(".pulse-ring, .synaptic-indicator");
      
      pulses.forEach((el, i) => {
        el.animate([
          { transform: 'scale(0.8)', opacity: 0.3 },
          { transform: 'scale(1.2)', opacity: 0.1 },
          { transform: 'scale(1.5)', opacity: 0 }
        ], {
          duration: 3000,
          delay: i * 500,
          iterations: Infinity,
          easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
        });
      });
    },

    /**
     * SCROLL REVEAL: IntersectionObserver for battery-efficient discovery.
     * Transitions opacity and transform as the learner explores the ecosystem.
     */
    initScrollReveal() {
      const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("neural-reveal--active");
            observer.unobserve(entry.target); // Reveal once
          }
        });
      }, revealOptions);

      const items = document.querySelectorAll(".neural-card, .section-header, .reflective-inquiry");
      items.forEach(item => {
        item.classList.add("neural-reveal");
        observer.observe(item);
      });
    }
  };

  // Run on load
  document.addEventListener("DOMContentLoaded", () => SynapseEffects.init());
})();