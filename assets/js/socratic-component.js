/**
 * Learning Biology For Life - Socratic Component System
 * Manages reflective UI states and Neural Web Components
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
     * QUESTION BLOCKS: Observe -> Reflect -> Reveal
     */
    setupQuestionBlocks() {
      const blocks = document.querySelectorAll("[data-socratic-question]");
      blocks.forEach(block => {
        if (block.dataset.initialized) return;

        const trigger = document.createElement("button");
        trigger.className = "neural-btn neural-btn--ghost socratic-trigger";
        trigger.innerHTML = "<span><i class='fas fa-brain'></i> Initiate Reflection</span>";
        
        trigger.addEventListener("click", () => {
          block.classList.toggle("is-active");
          trigger.innerHTML = block.classList.contains("is-active") 
            ? "<span><i class='fas fa-eye'></i> Hide Reflection</span>" 
            : "<span><i class='fas fa-brain'></i> Initiate Reflection</span>";
        });

        block.appendChild(trigger);
        block.dataset.initialized = "true";
      });
    },

    /**
     * REFLECTIVE PROMPTS: Illuminating deep inquiry text
     */
    setupReflectivePrompts() {
      const prompts = document.querySelectorAll("[data-reflective]");
      prompts.forEach(prompt => {
        prompt.addEventListener("mouseenter", () => prompt.classList.add("neural-glow"));
        prompt.addEventListener("mouseleave", () => prompt.classList.remove("neural-glow"));
      });
    },

    /**
     * CRITICAL THINKING: Toggling analytical perspectives
     */
    setupCriticalThinking() {
      const blocks = document.querySelectorAll("[data-critical-thinking]");
      blocks.forEach(block => {
        block.addEventListener("click", () => {
          block.classList.toggle("critical-active");
          // Dispatch event for Analytics Engine
          document.dispatchEvent(new CustomEvent("lbfl:critical-thinking-engaged", {
            detail: { id: block.id || 'anonymous-node' }
          }));
        });
      });
    }
  };

  /**
   * SOCRATIC INQUIRY WEB COMPONENT
   * Implements a secure Shadow DOM for cognitive nodes
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
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; margin: 2.5rem 0; }
          .panel {
            padding: 2.5rem;
            border-radius: 24px;
            background: linear-gradient(145deg, rgba(7, 17, 31, 0.9), rgba(2, 8, 18, 0.98));
            border: 1px solid rgba(0, 255, 170, 0.15);
            color: #edf6ff;
            font-family: system-ui, -apple-system, sans-serif;
            backdrop-filter: blur(12px);
            box-shadow: 0 15px 45px rgba(0, 0, 0, 0.4);
          }
          .status {
            color: #00ffaa;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin-bottom: 1.2rem;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .status::before {
            content: '';
            width: 8px;
            height: 8px;
            background: #00ffaa;
            border-radius: 50%;
            box-shadow: 0 0 10px #00ffaa;
          }
          h2 {
            font-size: clamp(1.5rem, 4vw, 2.2rem);
            margin: 0 0 1rem;
            letter-spacing: -0.02em;
            background: linear-gradient(to right, #fff, #00ffaa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p {
            line-height: 1.7;
            opacity: 0.85;
            margin: 0;
            font-size: 1.05rem;
          }
        </style>
        <div class="panel">
          <div class="status">Neural Link: Socratic Mode</div>
          <h2><slot name="title">Cognitive Node</slot></h2>
          <p><slot name="content">Awaiting synaptic input...</slot></p>
        </div>
      `;
    }
  }

  // Definition Safeguard
  if (!customElements.get("socratic-inquiry")) {
    customElements.define("socratic-inquiry", SocraticInquiry);
  }

  document.addEventListener("DOMContentLoaded", () => SocraticEngine.init());
})();