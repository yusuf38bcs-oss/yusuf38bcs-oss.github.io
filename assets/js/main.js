/**
 * Learning Biology For Life - Synaptic Hub
 * Master Controller for the Educational Ecosystem Runtime.
 */

(function() {
  "use strict";

  const SynapticHub = {
    init() {
      console.log("🧠 Synaptic Hub: Reconstructing Educational Ecosystem...");

      // 1. Core Visual State (Theme must load first to prevent flash)
      if (window.SynapticTheme) window.SynapticTheme.init();

      // 2. Immersive UI Background
      if (window.NeuralEngine) window.NeuralEngine.init();

      // 3. Interactive Component Engines
      this.initEcosystemModules();

      // 4. Intelligence & Tracking
      this.initIntelligence();

      // 5. Cleanup & Performance
      this.optimizeRenderLoop();
    },

    initEcosystemModules() {
      // Initialize Accordions & Socratic Inquiry Nodes
      if (window.AccordionEngine) window.AccordionEngine.init();
      if (window.SocraticEngine) window.SocraticEngine.init();

      // Initialize Dynamic Assessment Engines
      if (window.MCQEngine) window.MCQEngine.init();
      if (window.MIEngine) window.MIEngine.init();
      if (window.PersonalityEngine) window.PersonalityEngine.init();

      // Initialize Visual Polish (Glow/Reveal)
      if (window.SynapseEffects) window.SynapseEffects.init();
    },

    initIntelligence() {
      // Connect AI Pedagogy
      if (window.synapticAI) {
        console.log("🔗 AI Pedagogy: Link Active.");
      }

      // Start Cognitive Analytics
      if (window.LearningAnalytics) {
        window.LearningAnalytics.init();
      }
    },

    optimizeRenderLoop() {
      // Add 'is-loaded' class to body for CSS transitions
      document.body.classList.add('synaptic-loaded');

      // Prevent hover effects during scroll for 60FPS performance
      let scrollTimer;
      window.addEventListener('scroll', () => {
        document.body.style.pointerEvents = 'none';
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          document.body.style.pointerEvents = 'auto';
        }, 150);
      }, { passive: true });
    }
  };

  // Global Entry Point
  document.addEventListener("DOMContentLoaded", () => {
    SynapticHub.init();
  });

  // Export for emergency manual re-init if needed (e.g., after AJAX content loads)
  window.Synaptic = SynapticHub;

})();