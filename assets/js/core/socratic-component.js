/**
 * Learning Biology For Life - Socratic Component System (Final Edition)
 * Manages reflective UI states, analytical thinking nodes, Shadow DOM, and Gemini AI Reflex Arc.
 * Fully optimized for mobile typography and synchronized with the core theme controller.
 */

(function() {
  "use strict";

  const SocraticEngine = {
    init() {
      this.setupQuestionBlocks();
      this.setupReflectivePrompts();
      this.setupCriticalThinking();
      this.setupReflexArc(); // <-- NEW: Initializes the Gemini AI connection
    },

    /**
     * 1. QUESTION BLOCKS: Observe -> Reflect -> Reveal Transitions
     */
    setupQuestionBlocks() {
      const blocks = document.querySelectorAll("[data-socratic-question]");
      
      blocks.forEach(block => {
        if (block.dataset.initialized) return;

        const trigger = document.createElement("button");
        trigger.className = "mi-btn-calculate socratic-trigger";
        trigger.style.cssText = "padding: 8px 18px !important; font-size: 0.85rem !important; margin-top: 1rem; display: inline-flex; align-items: center; gap: 8px;";
        trigger.innerHTML = `<span> Initiate Reflection</span>`;
        
        trigger.addEventListener("click", () => {
          block.classList.toggle("is-active");
          const isActive = block.classList.contains("is-active");
          
          trigger.innerHTML = isActive 
            ? `<span> Hide Reflection</span>` 
            : `<span> Initiate Reflection</span>`;

          trigger.style.transform = "scale(0.97)";
          setTimeout(() => { trigger.style.transform = ""; }, 100);
        });

        block.appendChild(trigger);
        block.dataset.initialized = "true";
      });
    },

    /**
     * 2. REFLECTIVE PROMPTS: Soft micro-glow synchronization
     */
    setupReflectivePrompts() {
      const prompts = document.querySelectorAll("[data-reflective]");
      prompts.forEach(prompt => {
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
     * 3. CRITICAL THINKING: Telemetry states
     */
    setupCriticalThinking() {
      const blocks = document.querySelectorAll("[data-critical-thinking]");
      blocks.forEach(block => {
        block.style.cursor = "pointer";

        block.addEventListener("click", () => {
          block.classList.toggle("critical-active");
          document.dispatchEvent(new CustomEvent("lbfl:critical-thinking-engaged", {
            detail: { id: block.id || 'anonymous-socratic-node' }
          }));
        });
      });
    },

    /**
     * 4. THE SPINAL REFLEX ARC: Connects UI to Gemini 2.5 Flash Proxy
     */
    setupReflexArc() {
      const reflexForms = document.querySelectorAll(".socratic-reflex-form");

      reflexForms.forEach((form) => {
        let attemptCount = 1; // Tracks the Apoptotic Threshold
        const container = form.closest(".socratic-reflex-container") || form.closest(".case-study-micro");
        if (!container) return;

        // Support both node prompts and footer prompts
        const promptTextEl = container.querySelector(".socratic-prompt-text") || container.querySelector("p");
        const inputField = form.querySelector(".reflex-input") || form.querySelector("input[type='text']");
        const submitBtn = form.querySelector(".reflex-submit-btn") || form.querySelector("button[type='submit']");
        
        if (!promptTextEl || !inputField || !submitBtn) return;
        const originalQuestion = promptTextEl.innerText;

        form.addEventListener("submit", async function(e) {
          e.preventDefault();
          
          const hypothesis = inputField.value.trim();
          if (!hypothesis) return;

          // Afferent Firing State (UI Morph)
          submitBtn.innerText = "Synthesizing...";
          submitBtn.disabled = true;
          inputField.disabled = true;
          container.classList.add("is-processing");

          // The Strict JSON Payload matching our Worker schema
          const payload = {
            type: "socratic_reflex",
            anomaly_question: originalQuestion,
            student_hypothesis: hypothesis,
            page_context: window.location.pathname,
            attempt_count: attemptCount
          };

          try {
            // FIRE TO GEMINI PROXY (Ensure this route matches your Cloudflare worker route)
            const response = await fetch("https://learningbiologyforlife.org/api/gemini", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Synaptic Misfire");
            const data = await response.json();

            // Efferent Motor Response (UI Update)
            container.classList.remove("is-processing");

            if (data.mastery_achieved) {
              container.classList.remove("failed-state");
              container.classList.add("mastery-state");
              promptTextEl.innerHTML = `<strong style="color: #00f5d4;">System Override Complete:</strong> ${data.feedback_text}`;
              form.style.display = "none";
              
              // LocalStorage Myelination Trigger (We will build this next!)
              document.dispatchEvent(new CustomEvent("lbfl:node-myelinated", {
                detail: { path: window.location.pathname }
              }));

              if (data.next_vector) {
                const ghostNode = document.createElement("a");
                ghostNode.href = data.next_vector;
                ghostNode.className = "ghost-node-link";
                ghostNode.innerHTML = `<span>⚡</span> Initialize Ghost Node`;
                container.appendChild(ghostNode);
              }
            } else {
              attemptCount++;
              container.classList.add("failed-state");
              promptTextEl.innerHTML = `<strong>Synaptic Pivot:</strong> ${data.feedback_text}`;
              inputField.value = "";
              inputField.disabled = false;
              submitBtn.disabled = false;
              submitBtn.innerText = "Fire Again";
              inputField.focus();
            }
          } catch (error) {
            console.error("[Reflex Arc Error]", error);
            submitBtn.innerText = "Error. Retry.";
            submitBtn.disabled = false;
            inputField.disabled = false;
            container.classList.remove("is-processing");
          }
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
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; margin: 2.5rem 0; width: 100%; box-sizing: border-box; }
          .panel {
            padding: 2.25rem;
            border-radius: 12px;
            background: #0d1527;
            border: 1px solid rgba(0, 212, 178, 0.15);
            color: #cbd5e1;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 15px 45px rgba(0, 0, 0, 0.4);
            text-align: left !important;
          }
          .status {
            color: #00d4b2; font-size: 0.72rem; text-transform: uppercase;
            letter-spacing: 0.15em; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; font-weight: 700;
          }
          .status::before {
            content: ''; width: 6px; height: 6px; background: #00d4b2; border-radius: 50%; box-shadow: 0 0 8px #00d4b2;
          }
          h2 {
            font-size: clamp(1.4rem, 4vw, 2rem); font-weight: 800; margin: 0 0 0.85rem 0;
            letter-spacing: -0.02em; color: #ffffff; text-shadow: 0 0 15px rgba(0, 212, 178, 0.2); text-align: left !important;
          }
          p {
            line-height: 1.65; color: #94a3b8; margin: 0; font-size: 1.02rem; text-align: left !important;
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

  if (!customElements.get("socratic-inquiry")) {
    customElements.define("socratic-inquiry", SocraticInquiry);
  }

  window.SocraticComponentEngine = SocraticEngine;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => SocraticEngine.init());
  } else {
    SocraticEngine.init();
  }
})();