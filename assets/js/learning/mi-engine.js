/**
 * Learning Biology For Life - MI Analysis Engine (Ecosystem Edition)
 * Maps cognitive profiles to synchronized left-aligned biological study strategies.
 */

(function() {
  "use strict";

  const MI_SCHEMA = [
    { type: "Linguistic", prompt: "I internalize biological concepts best through structured reading, analytical writing, and dialectic debate tracks." },
    { type: "Logical-Mathematical", prompt: "I excel at tracking metabolic loops, calculating pathway variances, and mapping causal systems data." },
    { type: "Spatial", prompt: "I record anatomical structures much better through visual graphics, 3D diagrams, and mental spatial palaces." },
    { type: "Bodily-Kinesthetic", prompt: "I synthesize complex physical biological workflows effectively via physical lab modeling and active dissection." },
    { type: "Musical", prompt: "Rhythmic cadences, acoustic mnemonics, and auditory structural harmony help me retain complex terms." },
    { type: "Interpersonal", prompt: "I optimize my knowledge footprint best through peer-to-peer teaching, co-active inquiry, and group networks." },
    { type: "Intrapersonal", prompt: "Deep independent reflections, journal diagnostics, and linking biology concepts to life practice facilitate retention." },
    { type: "Naturalistic", prompt: "I intuitively classify organisms, isolate ecological patterns, and monitor biospheric safety node variances." }
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
      form.className = "mi-interactive-form";
      form.innerHTML = `
        <div class="mi-survey-grid-wrapper" style="display:flex; flex-direction:column; gap:2rem; width:100%;">
          ${MI_SCHEMA.map((item, index) => `
            <div class="mi-question-card" style="background:#020617; border:1px solid rgba(255,255,255,0.03); padding:1.75rem; border-radius:8px; text-align:left;">
              <span class="mi-eyebrow-tag" style="font-size:0.75rem; text-transform:uppercase; color:#00d4b2; font-weight:700; letter-spacing:0.05em; display:block; margin-bottom:0.4rem;">${item.type} Channel</span>
              <p class="mi-question-text" style="color:#ffffff; font-size:1.05rem; font-weight:600; margin:0 0 1.25rem 0; line-height:1.4; text-align:left; word-spacing:normal;">${item.prompt}</p>
              
              <div class="mi-options-vertical-stack" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap:10px; margin-bottom:0.5rem;">
                ${[1, 2, 3, 4, 5].map(val => `
                  <label class="mi-radio-label-wrapper" style="display:flex; align-items:center; justify-content:center; gap:8px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05); padding:10px; border-radius:6px; cursor:pointer; color:#cbd5e1; font-weight:600; transition:all 0.2s ease;">
                    <input type="radio" name="mi_${index}" value="${val}" required class="mi-radio-input" style="accent-color:#00d4b2;">
                    <span>${val}</span>
                  </label>
                `).join('')}
              </div>
              
              <div class="mi-scale-labels-strip" style="display:flex; justify-content:between; width:100%; font-size:0.75rem; color:#475569; font-weight:700; text-transform:uppercase; margin-top:0.5rem;">
                <span style="flex:1; text-align:left;">Rarely Fits</span>
                <span style="text-align:right;">Always Fits</span>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="mi-action-control-panel" style="text-align:center; margin-top:2.5rem; width:100%;">
          <button type="submit" class="mi-btn-calculate" style="max-width:320px; width:100%;">Analyze Cognitive Profile</button>
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

      this.renderResults(resultBox, scores, topThree, form);
    },

    renderResults(box, all, top, form) {
      const strategies = {
        Linguistic: "Synthesize field lecture summaries, active analogies, and conceptual peer-teaching scripts.",
        "Logical-Mathematical": "Build micro-flowcharts, comparative system causal loops, and analytical bio-data matrices.",
        Spatial: "Construct layered mind maps, color-coded structure sketches, and cognitive visual memory palaces.",
        "Bodily-Kinesthetic": "Engage in dynamic tactile modeling, spatial simulation tracking, and active lab practice rules.",
        Musical: "Formulate mnemonic metric rhythms, terminology cadences, and structural auditory maps.",
        Interpersonal: "Lead peer discussion networks, co-active presentation logs, and collaborative Socratic inquiry.",
        Intrapersonal: "Deploy reflective private logs, concept deconstruction diaries, and link biology vectors to core life practices.",
        Naturalistic: "Focus explicitly on taxonomic classification schemas, organizational traits, and ecosystem balance maps."
      };

      form.style.display = "none";
      box.style.display = "block";
      box.className = "mi-result-viewport";
      
      box.innerHTML = `
        <h3 class="mi-result-title" style="color:#ffffff; font-size:1.4rem; font-weight:800; margin:0 0 1.5rem 0; text-align:center;">Cognitive Spectrum Analysis</h3>
        
        <div class="top-channels-stack" style="display:flex; flex-direction:column; gap:1.25rem; margin-bottom:2rem;">
          ${top.map((channel, i) => `
            <div class="channel-result-node" style="background:#020617; border:1px solid ${i === 0 ? 'rgba(0,212,178,0.25)' : 'rgba(255,255,255,0.03)'}; padding:1.5rem; border-radius:8px; text-align:left;">
              <div class="channel-node-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <strong style="color:${i === 0 ? '#00d4b2' : '#ffffff'}; font-size:1.1rem; font-weight:700;">${i + 1}. ${channel[0]} Network</strong>
                <span style="background:rgba(255,255,255,0.04); color:#cbd5e1; font-size:0.8rem; font-weight:700; padding:4px 10px; border-radius:4px;">Score: ${channel[1]}/5</span>
              </div>
              <p class="strategy-desc-line" style="color:#94a3b8; font-size:0.92rem; line-height:1.5; margin:0; text-align:left; word-spacing:normal;">
                <strong style="color:#cbd5e1;">Optimization Strategy:</strong> ${strategies[channel[0]]}
              </p>
            </div>
          `).join('')}
        </div>

        <div class="mi-dominant-badge" style="background:#020617; border:1px solid rgba(0,212,178,0.15); padding:1.25rem; border-radius:6px; margin-bottom:2rem; text-align:left;">
          <p style="color:#cbd5e1; font-size:0.92rem; line-height:1.6; margin:0; text-align:left; word-spacing:normal;">
             <strong style="color:#00d4b2;">Core Ecosystem Insight:</strong> Your high affinity toward the <strong style="color:#ffffff;">${top[0][0]} Matrix</strong> indicates your neural paths process life sciences best via structural networks. Avoid flat text cramming; instead, optimize your retention cycle by prioritizing ${top[0][0].toLowerCase()} metrics during study sessions.
          </p>
        </div>

        <div style="text-align:center;">
          <button type="button" class="mi-btn-calculate" id="reset-mi-survey-trigger" style="background:transparent !important; color:#64748b !important; border:1px solid rgba(255,255,255,0.06) !important; max-width:200px; box-shadow:none;">
            Restart Audit Track
          </button>
        </div>
      `;

      document.getElementById("reset-mi-survey-trigger").addEventListener("click", () => {
        box.style.display = "none";
        form.style.display = "flex";
        this.renderSurvey(form);
        form.scrollIntoView({ behavior: 'smooth' });
      });

      box.scrollIntoView({ behavior: 'smooth' });
      
      // Notify System Wide Analytics Protocols Safely
      document.dispatchEvent(new CustomEvent("lbfl:mi-profile-generated", {
        detail: { top: top, all: all }
      }));
    }
  };

  document.addEventListener("DOMContentLoaded", () => MIEngine.init());
})();
