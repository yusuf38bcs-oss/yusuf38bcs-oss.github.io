/* ==========================================================================
   OMNIPOTENT RUNTIME ORCHESTRATOR & FAILSAFE GUARD (FINAL PRODUCTION)
   Designed for Learning Biology For Life Ecosystem | Socratic Matrix 4.0
   ========================================================================== */

(function () {
  'use strict';

  // SECURE INITIALIZATION GATEWAY: Forces execution ONLY when DOM is fully compiled
  function initializeEcosystem() {
    const htmlNode = document.documentElement;
    const bodyNode = document.body;
    const canvasNode = document.getElementById('neural-network');
    const viewportRoot = document.getElementById('synaptic-viewport-root');

    console.log("ðŸ§¬ Neural Ecosystem: DOM Core verified. Initiating hardware acceleration layers...");

    /* --- 1. CANVAS RUNTIME PROTECTION LAYER --- */
    if (canvasNode) {
      // Force hardware acceleration and prevent pointer trapping on touchscreens explicitly
      canvasNode.style.pointerEvents = 'none';
      canvasNode.style.transform = 'translate3d(0,0,0)';
      
      // Trigger a custom event to notify neural-bg.js that it is 100% safe to ignite
      window.dispatchEvent(new CustomEvent('synaptic-canvas-ready'));
    } else {
      console.warn("âš ï¸ Neural Ecosystem Warning: Active Canvas Node missing from current viewport.");
    }

    /* --- 2. TOUCH-SCREEN POINTER EVENTS INSULATION --- */
    if (viewportRoot) {
      viewportRoot.style.position = 'relative';
      viewportRoot.style.zIndex = '5';
      // Ensures content layers completely ignore any latent canvas traps underneath
      viewportRoot.style.pointerEvents = 'auto'; 
    }

    /* --- 3. PREMIUM REVEAL TICK ORCHESTRATION --- */
    // Synchronized phase reveal that completely eliminates accidental white flashes
    requestAnimationFrame(() => {
      htmlNode.classList.add('synaptic-runtime-loaded');
      bodyNode.classList.add('synaptic-runtime-loaded');
      // Opacity controlled by CSS to prevent FOUC
    });
  }

  /* ==========================================================================
     ROBUST LIFECYCLE ANCHOR: Handles Multi-Browser Async & Cached States Safely
     ========================================================================== */
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // If browser loaded the assets blindingly fast from cache, execute instantly
    initializeEcosystem();
  } else {
    // Standard asynchronous structural pipeline anchor
    document.addEventListener('DOMContentLoaded', initializeEcosystem);
  }

  // GLOBAL FALLBACK UNBLIND: Ultimate protection against any script freezing
  window.addEventListener('load', () => {
    if (!document.documentElement.classList.contains('synaptic-runtime-loaded')) {
      document.documentElement.classList.add('synaptic-runtime-loaded');
      document.body.classList.add('synaptic-runtime-loaded');
    }
  });

})();
