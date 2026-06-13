/**
 * Learning Biology For Life - Myelination Tracker (Persistent Cognitive State)
 */
(function() {
  "use strict";
  const STORAGE_KEY = "lbfl_myelinated_nodes";

  const CognitiveTracker = {
    init() {
      this.checkCurrentNodeState();
      this.listenForMyelination();
    },

    getMemoryBank() {
      try {
        const memory = localStorage.getItem(STORAGE_KEY);
        return memory ? JSON.parse(memory) : [];
      } catch (e) {
        console.warn("[Myelination Tracker] Memory bank unreadable, resetting.", e);
        return [];
      }
    },

    saveToMemory(path) {
      try {
        const memory = this.getMemoryBank();
        if (!memory.includes(path)) {
          memory.push(path);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
        }
      } catch (e) {
        console.warn("[Myelination Tracker] Unable to persist memory.", e);
      }
    },

    listenForMyelination() {
      document.addEventListener("lbfl:node-myelinated", (event) => {
        const path = event.detail?.path || window.location.pathname;
        this.saveToMemory(path);
        this.applyMasteryVisuals();
      });
    },

    checkCurrentNodeState() {
      const memory = this.getMemoryBank();
      if (memory.includes(window.location.pathname)) {
        this.applyMasteryVisuals();
      }
    },

    applyMasteryVisuals() {
      const containers = document.querySelectorAll(".socratic-reflex-container, .case-study-micro");
      containers.forEach(container => {
        if (container.dataset.myelinated) return;
        container.dataset.myelinated = "true";

        const form = container.querySelector(".socratic-reflex-form");
        const promptText = container.querySelector(".socratic-prompt-text, p");

        if (form) form.style.display = "none";
        container.classList.add("mastery-state");

        if (promptText) {
          promptText.innerHTML = `<strong style="color: #00f5d4;">Node Mastered:</strong> Synaptic pathway permanently myelinated.`;
        }
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => CognitiveTracker.init());
  } else {
    CognitiveTracker.init();
  }
})();
