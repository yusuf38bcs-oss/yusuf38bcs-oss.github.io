/**
 * Learning Biology For Life - MI Analysis Engine
 * Maps cognitive profiles to biological study strategies.
 */

(function() {
  "use strict";

  const MI_SCHEMA = [
    { type: "Linguistic", prompt: "I internalize biological concepts best through structured reading, writing, and verbal debate." },
    { type: "Logical-Mathematical", prompt: "I excel at mapping metabolic pathways, analyzing data sets, and identifying causal links." },
    { type: "Spatial", prompt: "I recall biological structures better through diagrams, 3D models, and mental visualization." },
    { type: "Bodily-Kinesthetic", prompt: "I learn biological mechanisms effectively through physical modeling, dissections, and lab practice." },
    { type: "Musical", prompt: "Rhythmic patterns, auditory mnemonics, and structural harmony help me retain complex terminology." },
    { type: "Interpersonal", prompt: "I synthesize knowledge best through peer teaching, collaborative inquiry, and group discussions." },
    { type: "Intrapersonal", prompt: "Reflection, journaling, and connecting biology to my own life practice facilitate deep learning." },
    { type: "Naturalistic", prompt: "I naturally categorize organisms, observe ecological patterns, and notice environmental systems." }
  ];

  const MIEngine = {
    init() {
      this.roots = document.querySelectorAll("[data-mi-analysis]");
      if (!this.roots.length) return;

      this.roots.forEach(root => this.setupAnalyzer(root));
    },

    setupAnalyzer(root) {
      const form = root.querySelector("[data-mi-form]");
      const resultBox = root.querySelector("[data-mi-result]");
      if (!form) return;

      this.renderSurvey(form);

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.processAnalysis(form, resultBox);
      });
    },

    renderSurvey(form) {
      form.innerHTML = `
        <div class="mi-survey-grid">
          ${MI_SCHEMA.map((item, index) => `
            <div class="neural-card mi-card" data-aos="fade-up">
              <span class="mi-label">${item.type} Channel</span>
              <p class="mi-prompt">${item.prompt}</p>
              <div class="mi-options">
                ${[1, 2, 3, 4, 5].map(val => `
                  <label class="mi-radio">
                    <input type="radio" name="mi_${index}" value="${val}" required>
                    <span class="radio-dot">${val}</span>
                  </label>
                `).join('')}
              </div>
              <div class="mi-scale-labels">
                <span>Rarely</span>
                <span>Always</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="u-text-center u-mt-lg">
          <button type="submit" class="neural-btn neural-btn--primary">Analyze Cognitive Profile</button>
        </div>
      `;
    },

    processAnalysis(form, resultBox) {
      const scores = {};
      MI_SCHEMA.forEach((item, index) => {
        const val = parseInt(form.querySelector(`input[name="mi_${index}"]:checked`)?.value || 0);
        scores[item.type] = val;
      });

      const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const topThree = sorted.slice(0, 3);

      this.renderResults(resultBox, scores, topThree);
      
      // Notify Analytics Engine
      document.dispatchEvent(new CustomEvent("lbfl:mi-profile-generated", {
        detail: { top: topThree, all: scores }
      }));
    },

    renderResults(box, all, top) {
      const strategies = {
        Linguistic: "Synthesize summaries, analogies, and teaching scripts.",
        "Logical-Mathematical": "Build flowcharts, causal systems, and data tables.",
        Spatial: "Construct mind maps, labeled sketches, and visual palaces.",
        "Bodily-Kinesthetic": "Engage in physical modeling and lab-based simulations.",
        Musical: "Create mnemonic rhythms and auditory structural maps.",
        Interpersonal: "Lead peer discussions and collaborative socratic inquiry.",
        Intrapersonal: "Use reflective journals and connect biology to life practice.",
        Naturalistic: "Focus on classification and ecosystem system patterns."
      };

      box.innerHTML = `
        <div class="neural-card results-card" data-aos="zoom-in">
          <h2 class="u-text-glow">Your Neural Learning Profile</h2>
          <div class="top-channels">
            ${top.map(channel => `
              <div class="channel-result">
                <div class="channel-header">
                  <strong>${channel[0]}</strong>
                  <span class="score-tag">${channel[1]}/5</span>
                </div>
                <p class="strategy"><strong>Strategy:</strong> ${strategies[channel[0]]}</p>
              </div>
            `).join('')}
          </div>
          <div class="ai-bridge-note">
            <p><i class="fas fa-brain"></i> <strong>AI Insight:</strong> Your ${top[0][0]} dominance suggests you will master the "Systems Thinking" expeditions best through ${strategies[top[0][0]].toLowerCase()}</p>
          </div>
          <button class="neural-btn neural-btn--secondary u-mt-md" onclick="location.reload()">Retake Analysis</button>
        </div>
      `;
      box.scrollIntoView({ behavior: 'smooth' });
    }
  };

  document.addEventListener("DOMContentLoaded", () => MIEngine.init());
})();