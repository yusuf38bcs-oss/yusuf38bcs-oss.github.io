/**
 * Learning Biology For Life
 * Myelination Tracker (Persistent Cognitive State)
 * Path: assets/js/core/myelination-tracker.js
 * * Architecture
 * --------------------------------------------------
 * ✓ LocalStorage persistence
 * ✓ Concept Node integration
 * ✓ Neural Core compatibility
 * ✓ Mastery badge updates
 * ✓ Socratic UI transformation
 * ✓ Event broadcasting
 * ✓ Future Neural Matrix support
 */

(function () {
    "use strict";

    const STORAGE_KEY = "lbfl_myelinated_nodes";
    const XP_KEY = "lbfl_total_xp";

    const CognitiveTracker = {
        init() {
            this.checkCurrentNodeState();
            this.listenForMyelination();
            // Safe global exposure for NeuralOS / Admin debugging
            window.CognitiveTracker = this;
        },

        /**
         * Read persistent memory bank
         */
        getMemoryBank() {
            try {
                const memory = localStorage.getItem(STORAGE_KEY);
                return memory ? JSON.parse(memory) : [];
            } catch (e) {
                console.warn("[Myelination Tracker] Memory bank unreadable.", e);
                return [];
            }
        },

        /**
         * Save persistent memory
         */
        saveMemory(memory) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
            } catch (e) {
                console.warn("[Myelination Tracker] Save failed.", e);
            }
        },

        /**
         * Save mastered node
         */
        saveToMemory(nodeId) {
            const memory = this.getMemoryBank();
            if (!memory.includes(nodeId)) {
                memory.push(nodeId);
                this.saveMemory(memory);
            }
        },

        /**
         * XP Management
         */
        getXP() {
            return parseInt(localStorage.getItem(XP_KEY) || 0, 10);
        },

        addXP(points) {
            const total = this.getXP() + points;
            localStorage.setItem(XP_KEY, total);
        },

        /**
         * Node state verification
         */
        isMyelinated(nodeId) {
            return this.getMemoryBank().includes(nodeId);
        },

        /**
         * Listen for NeuralOS events
         * Triggered by socratic-mastery.js or future AI handlers
         */
        listenForMyelination() {
            document.addEventListener("lbfl:node-myelinated", (event) => {
                const nodeId = event.detail?.nodeId 
                    || event.detail?.path 
                    || document.querySelector("[data-node-id]")?.dataset.nodeId 
                    || window.location.pathname;

                const masteryPoints = parseInt(
                    event.detail?.masteryPoints 
                    || document.querySelector("[data-mastery-points]")?.dataset.masteryPoints 
                    || 10, 
                    10
                );

                this.saveToMemory(nodeId);
                this.addXP(masteryPoints);
                this.applyMasteryVisuals(nodeId);

                // Broadcast global update for Navbars/Widgets
                document.dispatchEvent(new CustomEvent("lbfl:tracker-updated", {
                    detail: {
                        nodeId: nodeId,
                        xp: this.getXP(),
                        mastered: this.getMemoryBank()
                    }
                }));
            });
        },

        /**
         * Restore page state on load
         */
        checkCurrentNodeState() {
            const currentNode = document.querySelector("[data-node-id]")?.dataset.nodeId 
                || window.location.pathname;

            if (this.isMyelinated(currentNode)) {
                this.applyMasteryVisuals(currentNode);
            }
        },

        /**
         * Apply mastery UI mutations
         */
        applyMasteryVisuals(nodeId) {
            /* 1. Concept Container */
            const concept = document.querySelector(".concept-node-container");
            if (concept) {
                concept.classList.add("mastery-state");
                concept.setAttribute("data-mastery-state", "mastered");
            }

            /* 2. Mastery Badges */
            document.querySelectorAll(".mastery-badge, [data-mastery-badge]").forEach((badge) => {
                // Skip if this badge specifically belongs to a different node in a list
                if (badge.dataset?.masteryBadge && nodeId && badge.dataset.masteryBadge !== nodeId) {
                    return;
                }
                badge.classList.remove("state-locked", "state-unlocked");
                badge.classList.add("state-mastered", "mastery-badge--earned");
                badge.textContent = "Mastered";
            });

            /* 3. Socratic Interface */
            const consoleOutput = document.getElementById("socraticConsole");
            const input = document.getElementById("socraticInput");
            const button = document.getElementById("submitResponseBtn");

            if (consoleOutput) {
                consoleOutput.innerHTML = '<span style="color:#1e8e3e;font-weight:bold;">[System] Pathway heavily myelinated. Mastery achieved.</span>';
            }

            if (input) {
                input.disabled = true;
                if (input.tagName === "INPUT") {
                    input.value = "Hypothesis previously verified.";
                } else {
                    input.value = "Pathway already mastered.";
                }
            }

            if (button) {
                button.disabled = true;
                button.textContent = "Pathway Secured";
            }
        },

        /**
         * Development helper: Wipes cognitive slate
         */
        reset() {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(XP_KEY);
            console.warn("[Myelination Tracker] Memory bank reset.");
            location.reload();
        }
    };

    // Boot up the tracker when the DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            CognitiveTracker.init();
        });
    } else {
        CognitiveTracker.init();
    }

})();
