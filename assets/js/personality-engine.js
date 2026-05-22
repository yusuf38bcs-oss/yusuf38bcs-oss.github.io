/**
 * Learning Biology For Life - Personality Archetype Engine
 * Maps behavioral intelligence to biological learning pathways.
 */

(function() {
  "use strict";

  const ARCHETYPES = {
    Architect: {
      desc: "You prioritize structure, principles, and long-range systems clarity.",
      edge: "Your growth edge is acting before every variable is perfectly quantified.",
      path: "Focus on Systems Thinking and Molecular Architectures."
    },
    Catalyst: {
      desc: "You mobilize energy, momentum, and collective action.",
      edge: "Your growth edge is slowing down to refine direction through deep listening.",
      path: "Explore Evolutionary Dynamics and Behavioral Intelligence."
    },
    Observer: {
      desc: "You detect subtle patterns and biological signals others miss.",
      edge: "Your growth edge is externalizing your insights before the window of action closes.",
      path: "Study Ecological Monitoring and Reflective Cognition."
    },
    Explorer: {
      desc: "You are adaptive, experimental, and driven by biological curiosity.",
      edge: "Your growth edge is sustaining metabolic focus after the novelty fades.",
      path: "Dive into Genetic Engineering and Field Expeditions."
    },
    Steward: {
      desc: "You cultivate safety, continuity, and systemic trust.",
      edge: "Your growth edge is protecting your own homeostasis while supporting the group.",
      path: "Investigate Homeostatic Systems and Collaborative Ecology."
    }
  };

  const QUESTIONS = [
    { text: "I naturally seek to understand the underlying principles of a system.", trait: "Architect" },
    { text: "I find myself energizing others during periods of uncertainty.", trait: "Catalyst" },
    { text: "I prefer to observe a biological pattern quietly before intervening.", trait: "Observer" },
    { text: "I learn best by experimenting with unconventional methods.", trait: "Explorer" },
    { text: "I feel responsible for the harmony and health of my environment.", trait: "Steward" },
    { text: "I am drawn to clear systems, measurable data, and structural logic.", trait: "Architect" },
    { text: "I notice subtle behavioral changes in a group dynamic instantly.", trait: "Observer" },
    { text: "I am quick to adapt my learning strategy when new data emerges.", trait: "Explorer" }
  ];

  const PersonalityEngine = {
    init() {
      this.roots = document.querySelectorAll("[data-personality-analysis]");
      if (!this.roots.length) return;

      this.roots.forEach(root => this.setupAnalyzer(root));
    },

    setupAnalyzer(root) {
      const form = root.querySelector("[data-personality-form]");
      const resultBox = root.querySelector("[data-personality-result]");
      if (!form) return;

      this.renderSurvey(form);

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.processArchetype(form, resultBox);
      });
    },

    renderSurvey(form) {
      form.innerHTML = `
        <div class="archetype-survey-container">
          ${QUESTIONS.map((q, i) => `
            <fieldset class="neural-card archetype-card" data-aos="fade-up">
              <legend class="archetype-question">${i + 1}. ${q.text}</legend>
              <div class="archetype-options">
                ${[1, 2, 3, 4, 5].map(v => `
                  <label class="archetype-radio">
                    <input type="radio" name="p_${i}" value="${v}" required>
                    <span class="radio-label">${this.getLabel(v)}</span>
                  </label>
                `).join('')}
              </div>
            </fieldset>
          `).join('')}
        </div>
        <div class="u-text-center u-mt-lg">
          <button type="submit" class="neural-btn neural-btn--primary">Reveal My Archetype</button>
        </div>
      `;
    },

    getLabel(v) {
      return ["Disagree", "", "Neutral", "", "Agree"][v - 1] || v;
    },

    processArchetype(form, resultBox) {
      const scores = { Architect: 0, Catalyst: 0, Observer: 0, Explorer: 0, Steward: 0 };
      
      QUESTIONS.forEach((q, i) => {
        const val = parseInt(form.querySelector(`input[name="p_${i}"]:checked`)?.value || 0);
        scores[q.trait] += val;
      });

      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const primary = sorted[0];
      const secondary = sorted[1];

      this.renderResults(resultBox, primary, secondary, sorted);
      
      // Dispatch to Analytics Engine
      document.dispatchEvent(new CustomEvent("lbfl:archetype-revealed", {
        detail: { primary: primary[0], scores: scores }
      }));
    },

    renderResults(box, primary, secondary, all) {
      const data = ARCHETYPES[primary[0]];
      
      box.innerHTML = `
        <div class="neural-card results-card" data-aos="zoom-in">
          <header class="results-header">
            <span class="eyebrow">Your Neural Archetype</span>
            <h2 class="u-text-glow">${primary[0]}</h2>
          </header>
          
          <div class="results-body">
            <p class="description">${data.desc}</p>
            <div class="growth-box">
              <strong><i class="fas fa-seedling"></i> Growth Edge:</strong>
              <p>${data.edge}</p>
            </div>
            <div class="path-box">
              <strong><i class="fas fa-map-signs"></i> Recommended Pathway:</strong>
              <p>${data.path}</p>
            </div>
          </div>

          <div class="secondary-influence">
            <p>Secondary Influence: <strong>${secondary[0]}</strong></p>
          </div>

          <button class="neural-btn neural-btn--secondary u-mt-md" onclick="location.reload()">Reflect Again</button>
        </div>
      `;
      box.scrollIntoView({ behavior: 'smooth' });
    }
  };

  document.addEventListener("DOMContentLoaded", () => PersonalityEngine.init());
})();