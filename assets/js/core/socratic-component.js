/**
 * Learning Biology For Life - Socratic Component System (Final Edition)
 * Manages reflective UI states, analytical thinking nodes, and secure Shadow DOM Web Components.
 * Fully optimized for mobile typography and synchronized with the core theme controller.
 */

(function() {
  "use strict";

  const SocraticEngine = {
    init() {
      this.setupQuestionBlocks();
      this.setupReflectivePrompts();
      this.setupCriticalThinking();
    },

    /**
     * 1. QUESTION BLOCKS: Observe -> Reflect -> Reveal Transitions
     */
    setupQuestionBlocks() {
      const blocks = document.querySelectorAll("[data-socratic-question]");
      
      blocks.forEach(block => {
        if (block.dataset.initialized) return;

        // Enforce strict typography alignment on the question block container
        block.style.textAlign = "left";

        const trigger = document.createElement("button");
        // Aligned perfectly with your premium main.scss button atoms
        trigger.className = "mi-btn-calculate socratic-trigger";
        trigger.style.cssText = "padding: 8px 18px !important; font-size: 0.85rem !important; margin-top: 1rem; display: inline-flex; align-items: center; gap: 8px;";
        trigger.innerHTML = `<span>⚡ Initiate Reflection</span>`;
        
        trigger.addEventListener("click", () => {
          block.classList.toggle("is-active");
          const isActive = block.classList.contains("is-active");
          
          trigger.innerHTML = isActive 
            ? `<span>👁️ Hide Reflection</span>` 
            : `<span>⚡ Initiate Reflection</span>`;

          // Adjust soft toggle scaling properties on runtime click loops
          trigger.style.transform = "scale(0.97)";
          setTimeout(() => { trigger.style.transform = ""; }, 100);
        });

        block.appendChild(trigger);
        block.dataset.initialized = "true";
      });
    },

    /**
     * 2. REFLECTIVE PROMPTS: Soft micro-glow synchronization triggers
     */
    setupReflectivePrompts() {
      const prompts = document.querySelectorAll("[data-reflective]");
      prompts.forEach(prompt => {
        prompt.style.textAlign = "left";
        prompt.style.transition = "text-shadow 0.3s ease, color 0.3s ease";

        prompt.addEventListener("mouseenter", () => {
          prompt.style.color = "#ffffff";
          prompt.style.textShadow = "0 0 12px rgba(0, 212, 178, 0.4)";
        });

        prompt.addEventListener("mouseleave", () => {
          prompt.style.color = "";
          prompt.style.textShadow = "none";
        });
      });
    },

    /**
     * 3. CRITICAL THINKING: Toggling analytical telemetry states
     */
    setupCriticalThinking() {
      const blocks = document.querySelectorAll("[data-critical-thinking]");
      blocks.forEach(block => {
        block.style.textAlign = "left";
        block.style.cursor = "pointer";

        block.addEventListener("click", () => {
          block.classList.toggle("critical-active");
          
          // Securely dispatches telemetry updates payload for analytics-engine.js click capture
          document.dispatchEvent(new CustomEvent("lbfl:critical-thinking-engaged", {
            detail: { id: block.id || 'anonymous-socratic-node' }
          }));
        });
      });
    }
  };

  /**
   * SOCRATIC INQUIRY CUSTOM WEB COMPONENT
   * Implements a highly isolated, secure Shadow DOM container for advanced reflections.
   */
  class SocraticInquiry extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this.render();
    }

    render() {
      // Injected crisp Left Alignment directly inside shadow canopy to shatter iOS Safari text anomalies
      this.shadowRoot.innerHTML = `
        <style>
          :host { 
            display: block; 
            margin: 2.5rem 0; 
            width: 100%;
            box-sizing: border-box;
          }
          .panel {
            padding: 2.25rem;
            border-radius: 12px;
            background: #0d1527; /* Premium unified system dark slot background */
            border: 1px solid rgba(0, 212, 178, 0.15); /* Aligned with signature neon cyan accent */
            color: #cbd5e1;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 15px 45px rgba(0, 0, 0, 0.4);
            text-align: left !important;
          }
          .status {
            color: #00d4b2;
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 700;
          }
          .status::before {
            content: '';
            width: 6px;
            height: 6px;
            background: #00d4b2;
            border-radius: 50%;
            box-shadow: 0 0 8px #00d4b2;
          }
          h2 {
            font-size: clamp(1.4rem, 4vw, 2rem);
            font-weight: 800;
            margin: 0 0 0.85rem 0;
            letter-spacing: -0.02em;
            color: #ffffff;
            text-shadow: 0 0 15px rgba(0, 212, 178, 0.2);
            text-align: left !important;
          }
          p {
            line-height: 1.65;
            color: #94a3b8;
            margin: 0;
            font-size: 1.02rem;
            text-align: left !important; /* Rigid structural anchor kills forced mobile gaps */
            word-spacing: normal !important;
            letter-spacing: normal !important;
          }
        </style>
        <div class="panel">
          <div class="status">Neural Link: Socratic Matrix Mode</div>
          <h2><slot name="title">Cognitive Verification Node</slot></h2>
          <p><slot name="content">Awaiting synaptic academic tracking profile input...</slot></p>
        </div>
      `;
    }
  }

  // Definition Registry Safeguard Pattern
  if (!customElements.get("socratic-inquiry")) {
    customElements.define("socratic-inquiry", SocraticInquiry);
  }

  // Safe Global Context Export 
  window.SocraticComponentEngine = SocraticEngine;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => SocraticEngine.init());
  } else {
    SocraticEngine.init();
  }
})();
