$u=New-Object System.Text.UTF8Encoding($false);$d=".\assets\js\core";if(-not(Test-Path $d)){New-Item -ItemType Directory -Path $d -Force|Out-Null};$c=@'/**
 * Neural Education OS — Core Runtime
 * Integrates: Socratic Engine, Myelination Tracker, Neural Bridge API, Concept Nodes
 * File: assets/js/core/neural-core.js
 */
(function() {
  "use strict";

  const API_BASE = (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost")
    ? "http://localhost:8787"
    : "https://api.learningbiologyforlife.org";

  const NeuralOS = {
    version: "1.0.0",
    state: {
      myelinated: [],
      currentNode: null,
      graphReady: false
    },

    init() {
      this.hydrateState();
      this.bindConceptNodes();
      this.bindNeuralBridge();
      this.bindGhostVectors();
      this.enhanceSocraticForms();
      this.renderMasteryBadges();
      console.info("[NeuralOS] v" + this.version + " initialized");
    },

    hydrateState() {
      try {
        const raw = localStorage.getItem("lbfl_myelinated_nodes");
        this.state.myelinated = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.warn("[NeuralOS] Could not hydrate myelination state", e);
        this.state.myelinated = [];
      }
      this.state.currentNode = window.location.pathname;
    },

    isMyelinated(path) {
      return this.state.myelinated.includes(path);
    },

    bindConceptNodes() {
      const nodes = document.querySelectorAll("[data-concept-node], .concept-node, [data-node-id]");
      nodes.forEach(node => {
        const nodeId = node.dataset.nodeId || node.dataset.slug || window.location.pathname;
        const status = node.dataset.status || "locked";
        const isMastered = this.isMyelinated(nodeId);

        if (isMastered && status !== "mastered") {
          node.dataset.status = "mastered";
          node.classList.add("mastery-state");
          node.classList.remove("locked", "available");
        }

        node.addEventListener("click", (e) => {
          if (node.dataset.status === "locked") {
            e.preventDefault();
            this.showSynapticLock(node);
          }
        });
      });
    },

    showSynapticLock(node) {
      const prereqs = (node.dataset.prerequisites || "").split(",").filter(Boolean);
      const missing = prereqs.filter(p => !this.isMyelinated(p.trim()));
      if (!missing.length) {
        node.dataset.status = "available";
        node.classList.add("available");
        return;
      }
      const toast = document.createElement("div");
      toast.className = "neural-toast neural-toast--lock";
      toast.innerHTML = `<strong>Synaptic Lock:</strong> Master ${missing.join(", ")} to unlock.`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);
    },

    bindNeuralBridge() {
      const containers = document.querySelectorAll(".neural-bridge, [data-neural-bridge]");
      containers.forEach(container => {
        if (container.dataset.neuralBound) return;
        container.dataset.neuralBound = "true";

        const btn = container.querySelector(".neural-bridge-trigger") || document.createElement("button");
        if (!btn.parentElement) {
          btn.className = "neural-bridge-trigger mi-btn-calculate";
          btn.textContent = "Initialize Neural Path";
          container.appendChild(btn);
        }

        btn.addEventListener("click", async () => {
          btn.disabled = true;
          btn.textContent = "Traversing...";
          await this.fetchNeuralPath(container);
          btn.disabled = false;
          btn.textContent = "Initialize Neural Path";
        });
      });
    },

    async fetchNeuralPath(container) {
      try {
        const payload = {
          type: "adaptive_path",
          myelinated_nodes: this.state.myelinated,
          current_page: this.state.currentNode,
          query: container.dataset.query || "What should I learn next?"
        };

        const res = await fetch(API_BASE + "/api/neural-bridge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Neural Bridge misfire (" + res.status + ")");

        const data = await res.json();
        this.renderNeuralPath(container, data.neural_response || data);
      } catch (err) {
        console.error("[NeuralOS] Bridge error", err);
        container.innerHTML += `<div class="neural-error">Bridge offline. Explore the <a href="/biology/">Biology Hub</a>.</div>`;
      }
    },

    renderNeuralPath(container, response) {
      const recs = response.recommendations || [];
      if (!recs.length) {
        container.innerHTML += `<div class="neural-empty">All synaptic pathways explored. You have achieved neural mastery.</div>`;
        return;
      }

      const list = document.createElement("ul");
      list.className = "neural-path-list";

      recs.forEach(rec => {
        const li = document.createElement("li");
        li.className = "neural-path-item";
        li.innerHTML = `
          <a href="${rec.slug}" class="neural-path-link">
            <span class="neural-path-title">${rec.title}</span>
            <span class="neural-path-reason">${rec.reason}</span>
          </a>
        `;
        list.appendChild(li);
      });

      const existing = container.querySelector(".neural-path-list");
      if (existing) existing.remove();

      container.appendChild(list);

      if (response.socratic_probe) {
        const probe = document.createElement("div");
        probe.className = "neural-probe";
        probe.textContent = response.socratic_probe;
        container.appendChild(probe);
      }
    },

    bindGhostVectors() {
      document.addEventListener("lbfl:node-myelinated", (e) => {
        const path = e.detail?.path || window.location.pathname;
        if (!this.state.myelinated.includes(path)) {
          this.state.myelinated.push(path);
        }
        this.renderMasteryBadges();
        this.unlockChildren(path);
      });
    },

    unlockChildren(parentPath) {
      const children = document.querySelectorAll(`[data-prerequisites*="${parentPath}"]`);
      children.forEach(child => {
        const prereqs = (child.dataset.prerequisites || "").split(",").map(s => s.trim());
        const allMet = prereqs.every(p => this.isMyelinated(p));
        if (allMet) {
          child.dataset.status = "available";
          child.classList.add("available");
          child.classList.remove("locked");
        }
      });
    },

    enhanceSocraticForms() {
      const forms = document.querySelectorAll(".socratic-reflex-form");
      forms.forEach(form => {
        const container = form.closest(".socratic-reflex-container") || form.closest(".case-study-micro");
        if (!container) return;

        const bridgeBtn = document.createElement("button");
        bridgeBtn.type = "button";
        bridgeBtn.className = "neural-bridge-contextual";
        bridgeBtn.textContent = "Why does this matter?";
        bridgeBtn.style.cssText = "margin-top: 0.5rem; font-size: 0.8rem;";

        bridgeBtn.addEventListener("click", async () => {
          bridgeBtn.disabled = true;
          const promptText = container.querySelector(".socratic-prompt-text, p")?.textContent || "Explain this concept";
          try {
            const res = await fetch(API_BASE + "/api/neural-bridge", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "concept_explain",
                query: promptText,
                current_page: window.location.pathname
              })
            });
            const data = await res.json();
            const explanation = document.createElement("div");
            explanation.className = "neural-explanation";
            explanation.innerHTML = data.result || data.raw || "No explanation available.";
            container.appendChild(explanation);
          } catch (e) {
            console.error("[NeuralOS] Contextual explain failed", e);
          }
          bridgeBtn.disabled = false;
        });

        if (!container.querySelector(".neural-bridge-contextual")) {
          container.appendChild(bridgeBtn);
        }
      });
    },

    renderMasteryBadges() {
      const badges = document.querySelectorAll("[data-mastery-badge]");
      badges.forEach(badge => {
        const target = badge.dataset.masteryBadge;
        if (this.isMyelinated(target)) {
          badge.classList.add("mastery-badge--earned");
          badge.textContent = "Myelinated";
        }
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => NeuralOS.init());
  } else {
    NeuralOS.init();
  }

  window.NeuralEducationOS = NeuralOS;
})();
'@
$c=$c-replace"`r`n","`n"-replace"`r","`n";[System.IO.File]::WriteAllText((Join-Path (Get-Location).Path ".\assets\js\core\neural-core.js"),$c,$u);Write-Host "Created: neural-core.js" -ForegroundColor Green
