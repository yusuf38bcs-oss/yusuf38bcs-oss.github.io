/**
 * Learning Biology For Life - MCQ Arena Engine (Production Edition)
 * AI-Generated Socratic Assessments with Performance Caching & Robust Sanitation
 */

(function() {
  "use strict";

  const MCQ_CONFIG = {
    cachePrefix: "lbfl-mcq-cache-",
    defaultTime: 1200, // 20 Minutes countdown tracking
    questionsPerSet: 15
  };

  const MCQEngine = {
    init() {
      this.arenas = document.querySelectorAll("[data-mcq-arena]");
      if (!this.arenas.length) return;

      this.arenas.forEach(arena => this.setupArena(arena));
    },

    setupArena(arena) {
      const state = {
        quiz: [],
        timer: null,
        timeLeft: MCQ_CONFIG.defaultTime,
        topic: arena.dataset.topic || "Biology Core Systems"
      };

      const generateBtn = arena.querySelector("[data-mcq-generate]");
      if (generateBtn) {
        generateBtn.addEventListener("click", () => this.startExpedition(arena, state));
      }
    },

    async startExpedition(arena, state) {
      const box = arena.querySelector("[data-mcq-box]");
      const resultBox = arena.querySelector("[data-mcq-result]");
      const generateBtn = arena.querySelector("[data-mcq-generate]");
      const cacheKey = MCQ_CONFIG.cachePrefix + btoa(encodeURIComponent(state.topic));
      
      if (!window.SynapticAI) {
        console.error("🔒 Synaptic AI Global Layer Missing.");
        return;
      }

      // Prepare UI state for asset synthesis
      if (generateBtn) generateBtn.disabled = true;
      resultBox.style.display = "none";
      box.style.display = "block";
      box.innerHTML = `<p style="color:#00d4b2; font-weight:600; text-align:left; animation:flash 1.5s infinite;">⚡ Compiling neural evaluation track from proxy storage network...</p>`;

      // 1. Attempt Performance Caching Retrieval
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          state.quiz = JSON.parse(cached);
          this.renderInterface(arena, state);
          this.startCountdown(arena, state);
          return;
        } catch (e) {
          localStorage.removeItem(cacheKey); // Flush corrupted matrix tracking parameters
        }
      }

      // 2. High-Performance AI Synthesis (via Synaptic Core Network Proxy)
      try {
        const result = await window.SynapticAI.generate({
          model: "fast",
          type: "text",
          useMemory: false,
          systemInstruction: "You are an elite academic biology evaluator. Always respond with a raw minified JSON array object matching the specified keys strictly. No conversational texts.",
          prompt: `Generate exactly ${MCQ_CONFIG.questionsPerSet} complex biology multiple-choice questions for topic focus: ${state.topic}. Output MUST be a valid raw JSON object string with a root "questions" array containing items with these exact keys: "question", "options" (array of 4 text strings), "answerIndex" (0 to 3 integer index pointing to correct choice), "explanation" (brief concept breakdown text).`
        });

        let rawText = result.text || result.output || "";
        
        // Failsafe JSON Sanitation Framework
        rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        
        const parsedData = JSON.parse(rawText);
        state.quiz = parsedData.questions || parsedData;

        // Cache the parsed matrix response safely
        localStorage.setItem(cacheKey, JSON.stringify(state.quiz));
        
        this.renderInterface(arena, state);
        this.startCountdown(arena, state);

      } catch (error) {
        console.error("MCQ Matrix Generation Misfire:", error);
        box.innerHTML = `<p style="color:#ef4444; font-weight:600; text-align:left;">⚠️ Synaptic loop timeout. Could not compile data charts. Please try re-initiating.</p>`;
        if (generateBtn) generateBtn.disabled = false;
      }
    },

    startCountdown(arena, state) {
      clearInterval(state.timer);
      const timerDisplay = arena.querySelector("[data-mcq-timer]");
      state.timeLeft = MCQ_CONFIG.defaultTime;

      state.timer = setInterval(() => {
        if (state.timeLeft <= 0) {
          clearInterval(state.timer);
          this.evaluateAssessment(arena, state);
        } else {
          state.timeLeft--;
          let mins = Math.floor(state.timeLeft / 60);
          let secs = state.timeLeft % 60;
          if (timerDisplay) {
            timerDisplay.innerHTML = `Time Remaining: <span style="color:#00d4b2;">${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}</span>`;
          }
        }
      }, 1000);
    },

    renderInterface(arena, state) {
      const box = arena.querySelector("[data-mcq-box]");
      box.innerHTML = "";
      
      const fragment = document.createDocumentFragment();
      const stackContainer = document.createElement("div");
      stackContainer.style.cssText = "display:flex; flex-direction:column; gap:2rem; width:100%; text-align:left;";

      state.quiz.forEach((node, index) => {
        const card = document.createElement("div");
        card.className = "question-item-card";
        card.style.cssText = "background:#020617; border:1px solid rgba(255,255,255,0.03); padding:1.75rem; border-radius:8px;";

        let optionsHTML = "";
        node.options.forEach((opt, optIndex) => {
          optionsHTML += `
            <label class="option-label-wrapper" style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.05); padding:12px 16px; border-radius:6px; margin-bottom:0.75rem; cursor:pointer; color:#cbd5e1; font-size:0.95rem; text-align:left;">
              <input type="radio" name="arena_q_${index}" value="${optIndex}" class="option-radio-input" style="accent-color:#00d4b2;">
              <span>${opt}</span>
            </label>
          `;
        });

        card.innerHTML = `
          <h4 class="question-text-line" style="color:#ffffff; font-size:1.1rem; font-weight:600; margin:0 0 1.25rem 0; line-height:1.4; text-align:left;">${index + 1}. ${node.question}</h4>
          <div class="options-vertical-stack" style="display:flex; flex-direction:column;">${optionsHTML}</div>
        `;
        stackContainer.appendChild(card);
      });

      // Submit execution button trigger allocation
      const submitWrapper = document.createElement("div");
      submitWrapper.style.cssText = "text-align:center; margin-top:2rem; width:100%;";
      submitWrapper.innerHTML = `
        <button class="mcq-btn-generate" id="submit-arena-evaluation" style="max-width:320px; width:100%;">
          Submit Evaluation Track
        </button>
      `;
      stackContainer.appendChild(submitWrapper);
      
      fragment.appendChild(stackContainer);
      box.appendChild(fragment);

      document.getElementById("submit-arena-evaluation").addEventListener("click", () => this.evaluateAssessment(arena, state));
    },

    evaluateAssessment(arena, state) {
      clearInterval(state.timer);
      const box = arena.querySelector("[data-mcq-box]");
      const resultBox = arena.querySelector("[data-mcq-result]");
      const generateBtn = arena.querySelector("[data-mcq-generate]");
      
      let correctCount = 0;

      state.quiz.forEach((node, index) => {
        const selected = arena.querySelector(`input[name="arena_q_${index}"]:checked`);
        if (selected && parseInt(selected.value) === parseInt(node.answerIndex)) {
          correctCount++;
        }
      });

      box.style.display = "none";
      resultBox.style.display = "block";
      resultBox.innerHTML = `
        <h3 style="color:#ffffff; font-size:1.4rem; font-weight:800; margin:0 0 0.5rem 0; text-align:center;">Assessment Matrix Completed</h3>
        <div style="font-size:2.5rem; font-weight:800; color:#00d4b2; margin-bottom:1rem; text-align:center;">${correctCount} / ${state.quiz.length}</div>
        <p style="color:#94a3b8; font-size:0.95rem; line-height:1.6; text-align:center; margin:0;">
          Your cognitive tracking points have been logged successfully. Focus on concepts requiring deeper verification pipelines to achieve a perfect metric score.
        </p>
      `;

      if (generateBtn) generateBtn.disabled = false;
      resultBox.scrollIntoView({ behavior: 'smooth' });
    }
  };

  document.addEventListener("DOMContentLoaded", () => MCQEngine.init());
})();
