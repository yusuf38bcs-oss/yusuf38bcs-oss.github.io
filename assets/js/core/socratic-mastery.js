/**
 * NeuralOS Core: Socratic Mastery Interface
 * Path: assets/js/core/socratic-mastery.js
 * Architecture: Event-Driven UI Layer
 * Purpose: Handles asynchronous Socratic feedback and UI morphing. 
 * Note: Does NOT handle persistence. Dispatches 'lbfl:node-myelinated' to the central tracker.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Socratic Environment
    const conceptNode = document.querySelector('.concept-node-container');
    
    // Abort execution if not on a concept node page
    if (!conceptNode) return; 

    // Extract physiological metadata from the DOM
    const nodeId = conceptNode.getAttribute('data-node-id');
    const xpPoints = parseInt(conceptNode.getAttribute('data-mastery-points') || 0, 10);
    
    // Map Socratic UI Elements
    const masteryBadge = document.querySelector('[data-mastery-badge], .mastery-badge');
    const socraticBtn = document.getElementById('submitResponseBtn');
    const socraticInput = document.getElementById('socraticInput');
    const socraticConsole = document.getElementById('socraticConsole');

    // 2. Hydrate Existing State (Check central storage array)
    // We do a read-only check here to set the initial UI state if the student returns to a mastered node.
    const masteredNodes = JSON.parse(localStorage.getItem('lbfl_myelinated_nodes') || '[]');
    if (masteredNodes.includes(nodeId)) {
        applyMasteredState(conceptNode, masteryBadge);
        if (socraticConsole) {
            socraticConsole.innerHTML = `<span style="color: #1e8e3e; font-weight: bold;">[System] Pathway heavily myelinated. Mastery previously achieved.</span>`;
        }
        if (socraticInput) {
            socraticInput.value = "Hypothesis previously verified.";
            socraticInput.disabled = true;
        }
        if (socraticBtn) {
            socraticBtn.innerText = "Pathway Secured";
            socraticBtn.disabled = true;
        }
    }

    // 3. Socratic Reflex Arc (Afferent Pathway -> Processing -> Efferent Response)
    if (socraticBtn && socraticInput && !socraticBtn.disabled) {
        socraticBtn.addEventListener('click', () => {
            const hypothesis = socraticInput.value.trim();
            
            // Validation: Prevent firing an empty action potential
            if (!hypothesis) {
                socraticConsole.innerHTML = `<span style="color: #d93025;">[Anomaly] No neurotransmitter detected. Please synthesize a hypothesis.</span>`;
                return;
            }

            // Morph UI: Synaptic Transmission State (Asynchronous hold)
            socraticBtn.innerText = "Synthesizing...";
            socraticBtn.disabled = true;
            socraticInput.disabled = true;
            socraticConsole.innerHTML = "Transmitting vector to AI interneuron...";

            // Simulate Asynchronous AI Processing 
            // NOTE: In production, replace setTimeout with a fetch() call to the LLM backend
            setTimeout(() => {
                
                // Update Socratic Interface UI to reflect validated state
                socraticConsole.innerHTML = `<span style="color: #1e8e3e; font-weight: bold;">[Validation] Biological logic confirmed. Myelination +${xpPoints} XP.</span>`;
                socraticBtn.innerText = "Pathway Secured";
                
                // Trigger structural brain change via the central nervous system
                triggerMyelination(nodeId, xpPoints, conceptNode, masteryBadge);
                
            }, 1500); // 1.5s simulated latency
        });
    }
});

/**
 * Biological Function: Trigger Myelination
 * Dispatches the action potential to the central tracker and morphs the local DOM.
 */
function triggerMyelination(nodeId, xpPoints, container, badge) {
    // 1. Dispatch custom event to the global Myelination Tracker (Persistence Engine)
    document.dispatchEvent(new CustomEvent("lbfl:node-myelinated", {
        detail: {
            nodeId: nodeId,
            masteryPoints: xpPoints
        }
    }));

    // 2. Morph the localized HTML architecture
    applyMasteredState(container, badge);
}

/**
 * Utility: UI State Mutation
 * Shifts the node's visual state from 'locked/unlocked' to 'mastered'.
 */
function applyMasteredState(container, badge) {
    // Overwrite DOM Data Attribute for standard CSS targeting
    if (container) {
        container.setAttribute('data-mastery-state', 'mastered');
        // Add specific class for advanced SCSS hooks (replaces inline CSS)
        container.classList.add('mastery-achieved'); 
    }
    
    // Update Badge UI
    if (badge) {
        badge.classList.remove('state-locked', 'state-unlocked');
        badge.classList.add('state-mastered');
        badge.innerText = 'Mastered';
    }
}

// 4. Global Neural API Exposure
// Allows NeuralOS or external scripts to artificially trigger these states if necessary
window.SocraticMastery = {
    triggerMyelination,
    applyMasteredState
};
