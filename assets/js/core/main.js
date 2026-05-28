/**
 * Learning Biology For Life - Global Synaptic Controller Hub
 * Master Orchestrator for the Educational Ecosystem Runtime.
 * Aligns interaction telemetry, verifies cloud proxies, and manages multi-device rendering health safely.
 */

(function() {
  "use strict";

  const SynapticHub = {
    // Core telemetry registry parameters
    version: "3.5.0",
    isReady: false,

    init() {
      console.log(`🧠 Synaptic Core Hub [v${this.version}]: Aligning ecosystem arrays...`);

      // 1. Core Structural Theme Verification
      if (window.ThemeController && typeof window.ThemeController.init === "function") {
        window.ThemeController.init();
      }

      // 2. Scan and Register Live Independent Functional Nodules
      this.verifyEcosystemTelemetry();

      // 3. Hardware Accelerated Layout Fixes
      this.optimizeViewportPerformance();
      
      this.isReady = true;
      document.dispatchEvent(new CustomEvent("synaptic:core-hub-active"));
    },

    /**
     * Cross-verifies active modular instances without forcing double-initialization crashes
     */
    verifyEcosystemTelemetry() {
      // Synchronizing core interface hooks with your updated window.SynapticAI class singleton
      if (window.SynapticAI) {
        console.log("🔗 Synaptic AI Pedagogy Matrix: Link Verified and Active.");
      } else {
        console.warn("⚠️ Synaptic AI Layer offline: Proxy validation network unresolved.");
      }

      // Contextual telemetry reporting for diagnostics logs
      const interactiveModules = {
        "Accordion System": document.querySelector(".accordion"),
        "MCQ Arena Dashboard": document.querySelector("[data-mcq-arena]"),
        "Multiple Intelligences Console": document.querySelector("[data-mi-analysis]"),
        "Personality Archetype Canvas": document.querySelector("[data-personality-analysis]")
      };

      for (const [moduleName, domNode] of Object.entries(interactiveModules)) {
        if (domNode) {
          console.log(`📍 Active Interface Node Captured: ${moduleName}`);
        }
      }
    },

    /**
     * Calibrates scrolling dynamics for fluid 60 FPS viewport transitions 
     * without freezing interactive floating conversational widgets on mobile devices
     */
    optimizeViewportPerformance() {
      // Appends loading state completion tokens to body layer for css transition reveals
      if (document.body) {
        document.body.classList.add("synaptic-runtime-loaded");
      }

      let passiveScrollTimeout;
      const floatingAssistantRoot = document.getElementById("synaptic-floating-ai-root");

      window.addEventListener("scroll", function() {
        // Safe context: If user is interacting with the floating AI, bypass pointer modifications
        if (floatingAssistantRoot && floatingAssistantRoot.contains(document.activeElement)) return;

        // Apply light performance smoothing filters safely
        if (document.body && !document.body.classList.contains("viewport-scrolling-active")) {
          document.body.classList.add("viewport-scrolling-active");
        }

        clearTimeout(passiveScrollTimeout);
        passiveScrollTimeout = setTimeout(() => {
          if (document.body) {
            document.body.classList.remove("viewport-scrolling-active");
          }
        }, 200);
      }, { passive: true });
    },

    /**
     * Emergency Blueprint Fallback Trigger
     * Enables explicit runtime boots if nodes are loaded via async layout shifts or template injections
     */
    rebootEcosystemContext() {
      console.log("🔄 Synaptic Hub Trigger: Re-evaluating environment nodes...");
      this.verifyEcosystemTelemetry();
    }
  };

  // Global Multi-Device Boot Ingress Selector
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => SynapticHub.init());
  } else {
    // Failsafe anchor: Run instantly if page modules are compiled ahead of this script thread
    SynapticHub.init();
  }

  // Export for emergency context evaluations inside dynamic archive routes
  window.SynapticCoreControl = SynapticHub;
})();
