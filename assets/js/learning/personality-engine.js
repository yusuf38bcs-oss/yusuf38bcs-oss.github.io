/**
 * Learning Biology For Life - Personality Archetype Engine (Production Edition)
 * Supports a short educational pattern reflection. Not a validated personality or psychometric test.
 */

(function() {
  "use strict";

  const INSTRUMENT_VERSION = "PPR-S1-0.1";

  const ARCHETYPES = {
    Architect: {
      desc: "A stronger Architect response can suggest a current preference for structure, first principles, and causal organisation.",
      edge: "Question to test: does seeking complete structure sometimes delay useful action?",
      path: "Experiment: build a causal map of one Biology mechanism, then explain it without the map."
    },
    Catalyst: {
      desc: "A stronger Catalyst response can suggest a current tendency to energise discussion, participation, or collective action.",
      edge: "Question to test: does generating momentum sometimes happen before enough listening?",
      path: "Experiment: teach one Biology mechanism to a peer, then retrieve it independently from memory."
    },
    Observer: {
      desc: "A stronger Observer response can suggest a current tendency to watch for patterns before intervening.",
      edge: "Question to test: are useful observations sometimes held internally for too long?",
      path: "Experiment: observe a Biology pattern first, then make a prediction before checking the explanation."
    },
    Explorer: {
      desc: "A stronger Explorer response can suggest a current tendency to experiment with unfamiliar approaches.",
      edge: "Question to test: what happens when novelty fades and sustained practice becomes necessary?",
      path: "Experiment: try an unfamiliar study method, compare it with retrieval practice, and record the result."
    },
    Steward: {
      desc: "A stronger Steward response can suggest a current tendency to protect continuity, responsibility, and collective trust.",
      edge: "Question to test: can responsibility for others sometimes obscure personal limits?",
      path: "Experiment: organise a feedback-loop explanation, then test whether the structure improves recall."
    }
  };

  const QUESTIONS = [
    { text: "I naturally seek to isolate and understand the underlying first principles of any complex system.", trait: "Architect" },
    { text: "I find myself energizing and motivating peers during periods of academic uncertainty.", trait: "Catalyst" },
    { text: "I prefer to observe a biological or social pattern quietly before intervening with an action.", trait: "Observer" },
    { text: "I often choose experimentation or an unfamiliar approach when exploring a complex topic.", trait: "Explorer" },
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
          <button type="submit" class="mi-btn-calculate" style="max-width:320px; width:100%;">View My Current Reflection</button>
        </div>
      `;
    },

    getLabel(v) {
      // Standardized all labels to secure full responsive block grids across touchscreens
      return ["1 (Strongly Disagree)", "2 (Disagree)", "3 (Neutral)", "4 (Agree)", "5 (Strongly Agree)"][v - 1] || v;
    },

    processArchetype(form, resultBox) {
      const totals = { Architect: 0, Catalyst: 0, Observer: 0, Explorer: 0, Steward: 0 };
      const counts = { Architect: 0, Catalyst: 0, Observer: 0, Explorer: 0, Steward: 0 };

      QUESTIONS.forEach((q, i) => {
        const value = Number(form.querySelector(`input[name="p_${i}"]:checked`)?.value || 0);
        if (!Number.isFinite(value) || value < 1 || value > 5) return;
        totals[q.trait] += value;
        counts[q.trait] += 1;
      });

      const averages = Object.fromEntries(
        Object.keys(totals).map((trait) => [
          trait,
          counts[trait] ? totals[trait] / counts[trait] : 0
        ])
      );

      const sorted = Object.entries(averages).sort((a, b) => b[1] - a[1]);
      const primary = sorted[0];
      const secondary = sorted[1];
      const leaders = sorted
        .filter((entry) => Math.abs(entry[1] - primary[1]) < 1e-9)
        .map((entry) => entry[0]);

      this.renderResults(resultBox, primary, secondary, sorted, leaders, form);
    },

    renderResults(box, primary, secondary, all, leaders, form) {
      const data = ARCHETYPES[primary[0]];
      
      form.style.display = "none";
      box.style.display = "block";
      box.className = "mi-result-viewport";
      
      box.innerHTML = `
        <h3 class="mi-result-title" style="color:#ffffff; font-size:1.4rem; font-weight:800; margin:0 0 1.5rem 0; text-align:center;">Your Current Pattern Reflection</h3>
        
        <div class="mi-dominant-badge" style="background:#020617; border:1px solid rgba(0,212,178,0.25); padding:1.5rem; border-radius:8px; text-align:center; margin-bottom:1.5rem; box-shadow:0 0 15px rgba(0,212,178,0.05);">
          <span style="color:#64748b; font-size:0.85rem; text-transform:uppercase; font-weight:700; letter-spacing:0.05em; display:block; margin-bottom:0.25rem;">Stronger Current Response Lens</span>
          <span style="font-size:1.8rem; font-weight:800; color:#00d4b2; text-shadow:0 0 12px rgba(0,212,178,0.2);">${leaders.length > 1 ? leaders.join(" / ") : primary[0]}</span>
        </div>
        
        <div class="results-body-matrix" style="display:flex; flex-direction:column; gap:1.25rem;">
          
          <div style="background:#020617; border:1px solid rgba(255,255,255,0.03); padding:1.25rem; border-radius:6px; text-align:left;">
            <p style="color:#e2e8f0; font-size:0.98rem; line-height:1.6; margin:0; text-align:left; word-spacing:normal;">
              <strong style="color:#ffffff;">What this may suggest:</strong> ${data.desc}
            </p>
          </div>

          <div style="background:#020617; border:1px solid rgba(255,255,255,0.03); padding:1.25rem; border-radius:6px; text-align:left;">
            <p style="color:#cbd5e1; font-size:0.95rem; line-height:1.6; margin:0; text-align:left; word-spacing:normal;">
              <strong style="color:#00d4b2;"> Reflective question:</strong> ${data.edge}
            </p>
          </div>

          <div style="background:#020617; border:1px solid rgba(0,212,178,0.08); padding:1.25rem; border-radius:6px; text-align:left;">
            <p style="color:#cbd5e1; font-size:0.95rem; line-height:1.6; margin:0; text-align:left; word-spacing:normal;">
              <strong style="color:#3b82f6;"> Biology learning experiment:</strong> ${data.path}
            </p>
          </div>

          <div style="background:rgba(255,255,255,0.01); border:1px dashed rgba(255,255,255,0.05); padding:1rem; border-radius:6px; text-align:center;">
            <p style="color:#64748b; font-size:0.88rem; margin:0;">
              Another current response lens: <strong style="color:#ffffff;">${secondary[0]}</strong>
            </p>
          </div>

        </div>

        <p style="color:#94a3b8; font-size:0.9rem; line-height:1.6; margin:1.5rem 0 0;">
          <strong>What this does not prove:</strong> This short reflection does not establish a
          validated personality type, diagnosis, intelligence, or permanent identity.
          Treat the result as a hypothesis to question and test.
          Instrument: ${INSTRUMENT_VERSION}.
        </p>

        <div style="text-align:center; margin-top:2.5rem;">
          <button type="button" class="mi-btn-calculate" id="reset-personality-trigger" style="background:transparent !important; color:#64748b !important; border:1px solid rgba(255,255,255,0.06) !important; max-width:220px; box-shadow:none;">
            Reflect Again
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
