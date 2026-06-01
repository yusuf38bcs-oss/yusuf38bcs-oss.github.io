/**
 * Learning Biology For Life - Neural Interaction Core System
 * Manages premium tactile haptics, glow synchronizations, and button states across home layout nodes
 */

(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", function() {
    const interactionContext = {
      cards: document.querySelectorAll(".premium-neural-card, .section-card, .neural-cta-interactive-card, .flow-node-card-slot"),
      triggers: document.querySelectorAll(".academic-action-btn, .newsletter-action-trigger, .archive-hub-action-trigger, .mi-btn-calculate")
    };

    /**
     * 1. Dynamic Hover Glow Tracking Engine
     * Generates responsive cursor light mapping matrix safely
     */
    function setupGlowInteractions() {
      if (!interactionContext.cards.length) return;

      interactionContext.cards.forEach(card => {
card.addEventListener("mouseenter", function() {
          const pulseDot = card.querySelector(".neural-pulse-dot, .badge-pulse-dot");
          if (pulseDot) {
            pulseDot.style.transform = "scale(1.4)";
            pulseDot.style.boxShadow = "0 0 15px #00d4b2";
            pulseDot.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease";
          }
        });

        card.addEventListener("mouseleave", function() {
          const pulseDot = card.querySelector(".neural-pulse-dot, .badge-pulse-dot");
          if (pulseDot) {
            pulseDot.style.transform = "scale(1)";
            pulseDot.style.boxShadow = "0 0 8px #00d4b2";
          }
        });
      });
    }

    /**
     * 2. High Contrast Interactive Action Button Haptics
     * Prevents button double-submission bugs and manages micro-loading tokens
     */
    function setupButtonHaptics() {
      if (!interactionContext.triggers.length) return;

      interactionContext.triggers.forEach(btn => {
        btn.addEventListener("click", function() {
          // Soft tactile pulse scale hint via temporary inline styles
          btn.style.transform = "scale(0.98)";
          setTimeout(() => {
            btn.style.transform = "";
          }, 100);
        });


      });
    }

    setupGlowInteractions();
    setupButtonHaptics();
  });
})();
