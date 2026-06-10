/**
 * Learning Biology For Life - Myelination Tracker (Persistent Cognitive State)
 * Acts as the ecosystem's Hippocampus, storing mastery states in localStorage.
 */

(function() {
  "use strict";

  const STORAGE_KEY = "lbfl_myelinated_nodes";

  const CognitiveTracker = {
    init() {
      this.checkCurrentNodeState();
      this.listenForMyelination();
    },

    // Retrieve the array of mastered URLs from LocalStorage
    getMemoryBank() {
      const memory = localStorage.getItem(STORAGE_KEY);
      return memory ? JSON.parse(memory) : [];
    },

    // Save a new URL to the mastery array
    saveToMemory(path) {
      const memory = this.getMemoryBank();
      if (!memory.includes(path)) {
        memory.push(path);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
        console.log(`[Cognitive Tracker] Node Myelinated: ${path}`);
      }
    },

    // 1. Listen for the flare sent by socratic-component.js
    listenForMyelination() {
      document.addEventListener("lbfl:node-myelinated", (event) => {
        const path = event.detail.path || window.location.pathname;
        this.saveToMemory(path);
        this.applyMasteryVisuals();
      });
    },

    // 2. On page load, check if the student has already mastered this specific node
    checkCurrentNodeState() {
      const memory = this.getMemoryBank();
      const currentPath = window.location.pathname;

      if (memory.includes(currentPath)) {
        this.applyMasteryVisuals();
      }
    },

    // 3. Morph the UI permanently for Mastered Nodes
    applyMasteryVisuals() {
      // Find the Socratic Dock / Container
      const containers = document.querySelectorAll(".socratic-reflex-container, .case-study-micro");
      
      containers.forEach(container => {
        const form = container.querySelector(".socratic-reflex-form, #microSocraticForm");
        const promptText = container.querySelector(".socratic-prompt-text, p");
        
        // Hide the form since it's already mastered
        if (form) form.style.display = "none";
        
        // Apply the Bio-Green mastery state
        container.classList.remove("failed-state");
        container.classList.add("mastery-state");
        
        // Update text if it hasn't been updated already by the active session
        if (promptText && !promptText.innerHTML.includes("System Override Complete")) {
          promptText.innerHTML = `<strong style="color: #00f5d4;">Node Mastered:</strong> Synaptic pathway permanently myelinated.`;
        }
      });

      // Optional: Add a permanent "Mastered" badge to the top of the article
      const headerFlex = document.querySelector(".page-content-header");
      if (headerFlex && !document.getElementById("mastery-badge")) {
        const badge = document.createElement("span");
        badge.id = "mastery-badge";
        badge.className = "sys-metric";
        badge.style.cssText = "display: inline-block; background: rgba(0, 245, 212, 0.1); color: #00f5d4; padding: 4px 12px; border-radius: 4px; border: 1px solid #00f5d4; font-size: 0.8rem; margin-bottom: 1rem;";
        badge.innerHTML = "⚡ MYELINATED PATHWAY";
        headerFlex.insertBefore(badge, headerFlex.firstChild);
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => CognitiveTracker.init());
  } else {
    CognitiveTracker.init();
  }
})();