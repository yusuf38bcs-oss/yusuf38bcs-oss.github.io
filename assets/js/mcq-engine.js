/**
 * Learning Biology For Life - MCQ Arena Engine
 * AI-Generated Socratic Assessments with Performance Caching
 */

(function() {
  "use strict";

  const MCQ_CONFIG = {
    cachePrefix: "lbfl-mcq-cache-",
    defaultTime: 1200, // 20 minutes
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
        current: 0,
        score: 0,
        timer: null,
        timeLeft: MCQ_CONFIG.defaultTime,
        topic: arena.dataset.topic || "Biology Systems"
      };

      const generateBtn = arena.querySelector("[data-mcq-generate]");
      if (generateBtn) {
        generateBtn.addEventListener("click", () => this.startExpedition(arena, state));
      }
    },

    async startExpedition(arena, state) {
      const box = arena.querySelector("[data-mcq-box]");
      const cacheKey = MCQ_CONFIG.cachePrefix + btoa(state.topic);
      
      this.updateUI(box, "loading", "Synthesizing Neural Assessment...");

      // 1. Attempt Cache Retrieval
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        state.quiz = JSON.parse(cached);
        this.renderInterface(arena, state);
        return;
      }

      // 2. AI Synthesis (via Synaptic Proxy)
      try {
        const result = await window.synapticAI.askGemini(
          `Generate ${MCQ_CONFIG.questionsPerSet} complex biology MCQs for topic: ${state.topic}. 
           Format: JSON object with questions array. Each item: question, options (4), answerIndex, explanation, concept.`,
          "academic"
        );

        if (result.success) {
          // Clean the response string if necessary and parse
          const cleanJson = result.response.replace(/```json|