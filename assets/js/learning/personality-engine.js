/**
 * Learning Biology For Life - Personality Archetype Engine (Production Edition)
 * Maps behavioral intelligence to biological learning pathways with flawless typography alignment.
 */

(function() {
  "use strict";

  const ARCHETYPES = {
    Architect: {
      desc: "You prioritize clear structure, first principles, data metrics, and long-range ecosystem clarity.",
      edge: "Your cognitive growth edge is taking decisive action before every single variable is perfectly quantified.",
      path: "Focus heavily on Systems Biology Core, nucleotide storage arrays, and molecular architectures."
    },
    Catalyst: {
      desc: "You mobilize intellectual energy, team momentum, collective network growth, and active transformation.",
      edge: "Your cognitive growth edge is slowing down to refine long-term direction through deep, silent listening.",
      path: "Explore Evolutionary Dynamics, Interdisciplinary Sciences, and applied Behavioral Intelligence."
    },
    Observer: {
      desc: "You identify subtle biochemical patterns, ecosystem feedback loops, and biological signals others miss entirely.",
      edge: "Your cognitive growth edge is externalizing and sharing your insights before the window of opportunity closes.",
      path: "Study Ecological Monitoring Networks, Biostatistics Nodes, and Reflective Pedagogy."
    },
    Explorer: {
      desc: "You are highly adaptive, experimental, deeply inquisitive, and driven by raw biological curiosity.",
      edge: "Your cognitive growth edge is sustaining steady metabolic focus and retention after the initial novelty fades.",
      path: "Dive into Genetic Engineering, Nucleotide Synthesis, and field laboratory expeditions."
    },
    Steward: {
      desc: "You cultivate systemic safety, operational continuity, environmental ethics, and collective trust.",
      edge: "Your growth edge is protecting your own cellular homeostasis while supporting the wider population network.",
      path: "Investigate Homeostatic Systems, Feedback Regulations, and Collaborative Ecology."
    }
  };

  const QUESTIONS = [
    { text: "I naturally seek to isolate and understand the underlying first principles of any complex system.", trait: "Architect" },
    { text: "I find myself energizing and motivating peers during periods of academic uncertainty.", trait: "Catalyst" },
    { text: "I prefer to observe a biological or social pattern quietly before intervening with an action.", trait: "Observer" },
    { text: "I learn complex topics best by experimenting with unconventional, self-styled learning tracks.", trait: "Explorer" },
    { text: "I feel personally responsible for the collective harmony, ethics, and health of my environment.", trait: "Steward" },
    { text: "I am naturally drawn to clear schematics, measurable statistical data, and crisp structural logic.", trait: "Architect" },
    { text: "I notice subtle behavioral, emotional, or environmental changes in a group dynamic instantly.", trait: "Observer" },
    { text: "I am extremely quick to adapt my cognitive strategy the moment new verified data emerges.", trait: "Explorer" }
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
      form.className = "mi-interactive-form";
      form.innerHTML = `
        <div class="archetype-survey-container" style="display:flex; flex-direction:column; gap:2rem; width:100%;">
          ${QUESTIONS.map((q, i) => `
            <div class="mi-question-card" style="background:#020617; border:1px solid rgba(255,255,255,0.03); padding:1.75rem; border-radius:8px; text-align:left;">
              <legend class="mi-question-text" style="color:#ffffff; font-size:1.05rem; font-weight:600; margin:0 0 1.25rem 0; line-height:1.4; text-align:left; border:none; padding:0; width:100%; display:block;">${i + 1}. ${q.text}</legend>
              
              <div class="mi-options-vertical-stack" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap:10px; margin-bottom:0.5rem;">
                ${[1, 2, 3, 4, 5].map(v => `
                  <label class="mi-radio-label-wrapper" style="display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05); padding:10px 12px; border-radius:6px; cursor:pointer; color:#cbd5e1; font-size:0.85rem; font-weight:600; transition:all 0.2s ease; justify-content:flex-start;">
                    <input type="radio" name="p_${i}" value="${v}" required class="mi-radio-input" style="accent-color:#00d4b2;">
                    <span>${this.getLabel(v)}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="mi-action-control-panel" style="text-align:center; margin-top:2.5rem; width:100%;">
          <button type="submit" class="mi-btn-calculate" style="max-width:320px; width:100%;">Reveal My Archetype</button>
        </div>
      `;
    },

    getLabel(v) {
      // Standardized all labels to secure full responsive block grids across touchscreens
      return ["1 (Strongly Disagree)", "2 (Disagree)", "3 (Neutral)", "4 (Agree)", "5 (Strongly Agree)"][v - 1] || v;
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

      this.renderResults(resultBox, primary, secondary, sorted, form);
      
      // Dispatch securely to site-wide global analytics pipelines
      document.dispatchEvent(new CustomEvent("lbfl:archetype-revealed", {
        detail: { primary: primary[0], scores: scores }
      }));
    },

    renderResults(box, primary, secondary, all, form) {
      const data = ARCHETYPES[primary[0]];
      
      form.style.display = "none";
      box.style.display = "block";
      box.className = "mi-result-viewport";
      
      box.innerHTML = `
        <h3 class="mi-result-title" style="color:#ffffff; font-size:1.4rem; font-weight:800; margin:0 0 1.5rem 0; text-align:center;">Behavioral Profile Output</h3>
        
        <div class="mi-dominant-badge" style="background:#020617; border:1px solid rgba(0,212,178,0.25); padding:1.5rem; border-radius:8px; text-align:center; margin-bottom:1.5rem; box-shadow:0 0 15px rgba(0,212,178,0.05);">
          <span style="color:#64748b; font-size:0.85rem; text-transform:uppercase; font-weight:700; letter-spacing:0.05em; display:block; margin-bottom:0.25rem;">Primary Inner Archetype</span>
          <span style="font-size:1.8rem; font-weight:800; color:#00d4b2; text-shadow:0 0 12px rgba(0,212,178,0.2);">${primary[0]} Channel</span>
        </div>
        
        <div class="results-body-matrix" style="display:flex; flex-direction:column; gap:1.25rem;">
          
          <div style="background:#020617; border:1px solid rgba(255,255,255,0.03); padding:1.25rem; border-radius:6px; text-align:left;">
            <p style="color:#e2e8f0; font-size:0.98rem; line-height:1.6; margin:0; text-align:left; word-spacing:normal;">
              <strong style="color:#ffffff;">Profile Orientation:</strong> ${data.desc}
            </p>
          </div>

          <div style="background:#020617; border:1px solid rgba(255,255,255,0.03); padding:1.25rem; border-radius:6px; text-align:left;">
            <p style="color:#cbd5e1; font-size:0.95rem; line-height:1.6; margin:0; text-align:left; word-spacing:normal;">
              <strong style="color:#00d4b2;">🌱 Growth Edge Parameter:</strong> ${data.edge}
            </p>
          </div>

          <div style="background:#020617; border:1px solid rgba(0,212,178,0.08); padding:1.25rem; border-radius:6px; text-align:left;">
            <p style="color:#cbd5e1; font-size:0.95rem; line-height:1.6; margin:0; text-align:left; word-spacing:normal;">
              <strong style="color:#3b82f6;">🧭 Recommended Learning Pathway:</strong> ${data.path}
            </p>
          </div>

          <div style="background:rgba(255,255,255,0.01); border:1px dashed rgba(255,255,255,0.05); padding:1rem; border-radius:6px; text-align:center;">
            <p style="color:#64748b; font-size:0.88rem; margin:0;">
              Secondary Auxiliary Influence Vector: <strong style="color:#ffffff;">${secondary[0]}</strong>
            </p>
          </div>

        </div>

        <div style="text-align:center; margin-top:2.5rem;">
          <button type="button" class="mi-btn-calculate" id="reset-personality-trigger" style="background:transparent !important; color:#64748b !important; border:1px solid rgba(255,255,255,0.06) !important; max-width:220px; box-shadow:none;">
            Re-Audit Behavioral Loop
          </button>
        </div>
      `;

      document.getElementById("reset-personality-trigger").addEventListener("click", () => {
        box.style.display = "none";
        form.style.display = "flex";
        this.renderSurvey(form);
        form.scrollIntoView({ behavior: 'smooth' });
      });

      box.scrollIntoView({ behavior: 'smooth' });
    }
  };

  document.addEventListener("DOMContentLoaded", () => PersonalityEngine.init());
})();
