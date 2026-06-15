/**
 * Learning Biology For Life - Socratic Component System (Production Hardened)
 * Manages reflective UI states, analytical thinking nodes, Shadow DOM, and Gemini AI Reflex Arc.
 */
(function() {
  "use strict";

  const SocraticEngine = {
    init() {
      this.setupQuestionBlocks();
      this.setupReflectivePrompts();
      this.setupCriticalThinking();
      this.setupReflexArc();
    },

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
          trigger.innerHTML = isActive ? `<span> Hide Reflection</span>` : `<span> Initiate Reflection</span>`;
        });

        block.appendChild(trigger);
        block.dataset.initialized = "true";
      });
    },

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

    setupReflexArc() {
      const reflexForms = document.querySelectorAll(".socratic-reflex-form");

      reflexForms.forEach((form) => {
        if (form.dataset.reflexBound) return;
        form.dataset.reflexBound = "true";

        let attemptCount = 1;
        const container = form.closest(".socratic-reflex-container") || form.closest(".case-study-micro");
        if (!container) return;

        const promptTextEl = container.querySelector(".socratic-prompt-text") || container.querySelector("p");
        const inputField = form.querySelector(".reflex-input") || form.querySelector("input[type='text']");
        const submitBtn = form.querySelector(".reflex-submit-btn") || form.querySelector("button[type='submit']");

        if (!promptTextEl || !inputField || !submitBtn) return;

        const originalQuestion = promptTextEl.textContent?.replace(/\s+/g, ' ').trim() || "";

        form.addEventListener("submit", async function(e) {
          e.preventDefault();
          const hypothesis = inputField.value.trim();
          if (!hypothesis) return;

          submitBtn.textContent = "Synthesizing...";
          submitBtn.disabled = true;
          inputField.disabled = true;
          container.classList.add("is-processing");

          const payload = {
            type: "socratic_reflex",
            anomaly_question: originalQuestion,
            student_hypothesis: hypothesis,
            page_context: window.location.pathname,
            attempt_count: attemptCount
          };

          const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
          const endpointUrl = isLocal ? "http://localhost:8787/api/gemini" : "https://learningbiologyforlife.org/api/gemini";

          try {
            const response = await fetch(endpointUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Synaptic Misfire (${response.status})`);

            const data = await response.json();
            if (!data || typeof data !== "object") throw new Error("Malformed synaptic response");

            container.classList.remove("is-processing");

            if (data.mastery_achieved) {
              container.classList.remove("failed-state");
              container.classList.add("mastery-state");
              promptTextEl.innerHTML = `<strong style="color: #00f5d4;">System Override Complete:</strong> ${data.feedback_text}`;
              form.style.display = "none";

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
              submitBtn.textContent = "Fire Again";
              inputField.focus();
            }
          } catch (error) {
            console.error("[Reflex Arc Error]", error);
            submitBtn.textContent = "Error. Retry.";
            submitBtn.disabled = false;
            inputField.disabled = false;
            container.classList.remove("is-processing");
          }
        });
      });
    }
  };

  class SocraticInquiry extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() { this.render(); }
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; margin: 2.5rem 0; width: 100%; box-sizing: border-box; }
          .panel { padding: 2.25rem; border-radius: 12px; background: #0d1527; border: 1px solid rgba(0, 212, 178, 0.15); color: #cbd5e1; }
          h2 { color: #ffffff; margin: 0 0 0.85rem 0; }
          p { line-height: 1.65; color: #94a3b8; margin: 0; }
        </style>
        <div class="panel">
          <h2><slot name="title">Cognitive Verification Node</slot></h2>
          <p><slot name="content">Awaiting profile input...</slot></p>
        </div>`;
    }
  }

  if (!customElements.get("socratic-inquiry")) customElements.define("socratic-inquiry", SocraticInquiry);
  window.SocraticComponentEngine = SocraticEngine;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => SocraticEngine.init());
  } else {
    SocraticEngine.init();
  }
})();