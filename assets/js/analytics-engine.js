/**
 * Learning Biology For Life - Cognitive Intelligence Engine
 * Tracks Socratic engagement, conceptual depth, and learner behavior.
 */

(function() {
  "use strict";

  const STORAGE_KEY = "lbfl-neural-analytics";
  const SESSION_START = Date.now();

  let analytics = loadStorage();

  const SynapticAnalytics = {
    init() {
      this.trackPageContext();
      this.initScrollDepth();
      this.initEngagementTimer();
      this.bindNeuralInteractions();
      this.setupQuizListener();
      
      // Heartbeat: Persistence every 30 seconds
      setInterval(() => this.saveStorage(), 30000);
    },

    /* --- Neural Context Tracking --- */
    trackPageContext() {
      const path = window.location.pathname;
      if (!analytics.pathway) analytics.pathway = {};
      
      if (!analytics.pathway[path]) {
        analytics.pathway[path] = {
          entries: 0,
          depthReached: 0,
          timeInvested: 0,
          lastEngaged: null
        };
      }
      
      analytics.pathway[path].entries++;
      analytics.pathway[path].lastEngaged = new Date().toISOString();
      this.saveStorage();
    },

    /* --- Socratic Engagement Metrics --- */
    initEngagementTimer() {
      window.addEventListener("beforeunload", () => {
        const sessionDuration = Math.round((Date.now() - SESSION_START) / 1000);
        const path = window.location.pathname;
        
        if (analytics.pathway[path]) {
          analytics.pathway[path].timeInvested += sessionDuration;
        }
        
        analytics.totalExpeditionTime = (analytics.totalExpeditionTime || 0) + sessionDuration;
        this.saveStorage();
      });
    },

    /* --- Cognitive Depth (Scroll) --- */
    initScrollDepth() {
      let maxDepth = 0;
      window.addEventListener("scroll", () => {
        const scrollH = document.documentElement.scrollHeight - window.innerHeight;
        const currentDepth = Math.round((window.scrollY / scrollH) * 100);

        if (currentDepth > maxDepth) {
          maxDepth = currentDepth;
          const path = window.location.pathname;
          if (analytics.pathway[path]) {
            analytics.pathway[path].depthReached = maxDepth;
          }
        }
      }, { passive: true });
    },

    /* --- Bind Ecosystem Components --- */
    bindNeuralInteractions() {
      document.addEventListener("click", (e) => {
        const trigger = e.target.closest("[data-neural-track]");
        if (!trigger) return;

        const action = trigger.dataset.neuralTrack;
        if (!analytics.interactions) analytics.interactions = {};
        
        analytics.interactions[action] = (analytics.interactions[action] || 0) + 1;
        this.saveStorage();
      });
    },

    /* --- Knowledge Retrieval (Quiz) --- */
    setupQuizListener() {
      document.addEventListener("lbfl:quiz-completed", (e) => {
        const { score, total, topic } = e.detail;
        if (!analytics.conceptualMastery) analytics.conceptualMastery = {};
        
        if (!analytics.conceptualMastery[topic]) {
          analytics.conceptualMastery[topic] = { attempts: 0, bestScore: 0 };
        }
        
        const mastery = analytics.conceptualMastery[topic];
        mastery.attempts++;
        const percent = Math.round((score / total) * 100);
        if (percent > mastery.bestScore) mastery.bestScore = percent;
        
        this.saveStorage();
      });
    },

    /* --- State Management --- */
    saveStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics));
      } catch (err) {
        console.warn("Neural Storage Failure", err);
      }
    }
  };

  function loadStorage() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  // Global API for the Educational UI
  window.CognitiveIntelligence = {
    getStats: () => analytics,
    getMastery: (topic) => analytics.conceptualMastery?.[topic] || null,
    getExpeditionSummary: () => {
      const paths = Object.keys(analytics.pathway || {});
      return {
        uniquePathsExplored: paths.length,
        totalTime: analytics.totalExpeditionTime || 0,
        averageEngagement: Math.round(
          paths.reduce((acc, p) => acc + analytics.pathway[p].depthReached, 0) / paths.length
        ) || 0
      };
    },
    resetExpedition: () => {
      localStorage.removeItem(STORAGE_KEY);
      analytics = {};
    }
  };

  SynapticAnalytics.init();
})();