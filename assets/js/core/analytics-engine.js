/**
 * Learning Biology For Life - Cognitive Intelligence Analytics Engine
 * Tracks Socratic engagement milestones, multi-intelligence mapping, scroll depths,
 * and learner behaviors with high-reliability mobile fail-safes.
 */

(function() {
  "use strict";

  const STORAGE_KEY = "lbfl-neural-analytics";
  let lastHeartbeatTime = Date.now();

  // Load verified memory matrix or build empty tracking scaffold safely
  let analytics = loadStorage();

  const SynapticAnalytics = {
    init() {
      this.initDataStructures();
      this.trackPageContext();
      this.initThrottledScrollDepth();
      this.initReliableEngagementTimer();
      this.bindSystemWideListeners();
    },

    /**
     * 1. Scaffold Initial Data Integrity Block
     */
    initDataStructures() {
      if (!analytics.pathway) analytics.pathway = {};
      if (!analytics.interactions) analytics.interactions = {};
      if (!analytics.conceptualMastery) analytics.conceptualMastery = {};
      if (!analytics.cognitiveProfile) analytics.cognitiveProfile = { miTopChannels: [], archetype: null };
      if (typeof analytics.totalExpeditionTime !== "number") analytics.totalExpeditionTime = 0;
    },

    /**
     * 2. Real-time Page Context Anchor Logs
     */
    trackPageContext() {
      const path = window.location.pathname;
      
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

    /**
     * 3. Milestone-Based Scroll Throttling
     * Limits memory mutation by writing changes only at explicit 5% depth intervals
     */
    initThrottledScrollDepth() {
      let currentMaxDepth = 0;
      let scrollDebounceTimeout;

      window.addEventListener("scroll", () => {
        if (scrollDebounceTimeout) return;

        scrollDebounceTimeout = setTimeout(() => {
          scrollDebounceTimeout = null;
          
          const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (scrollableHeight <= 0) return;

          const rawDepth = Math.round((window.scrollY / scrollableHeight) * 100);
          // Standardizing boundary limits between 0% and 100%
          const cleanDepth = Math.max(0, Math.min(100, rawDepth));

          // Quantum write barrier: trigger write loops only when shift steps cross a 5% milestone
          if (cleanDepth > currentMaxDepth && cleanDepth - currentMaxDepth >= 5) {
            currentMaxDepth = cleanDepth;
            const path = window.location.pathname;
            
            if (analytics.pathway[path] && currentMaxDepth > analytics.pathway[path].depthReached) {
              analytics.pathway[path].depthReached = currentMaxDepth;
            }
          }
        }, 100); // Throttled at 100ms macro windows to protect GPU threads
      }, { passive: true });
    },

    /**
     * 4. High-Reliability Time Engagement System
     * Replaces flaky beforeunload triggers with a multi-layered pagehide + heartbeat architecture
     */
    initReliableEngagementTimer() {
      const flushAccumulatedTime = () => {
        const currentTime = Date.now();
        const deltaSeconds = Math.round((currentTime - lastHeartbeatTime) / 1000);
        
        if (deltaSeconds > 0 && deltaSeconds < 3600) { // Discard anomalous logic gaps
          const path = window.location.pathname;
          if (analytics.pathway[path]) {
            analytics.pathway[path].timeInvested += deltaSeconds;
          }
          analytics.totalExpeditionTime += deltaSeconds;
        }
        lastHeartbeatTime = currentTime;
        this.saveStorage();
      };

      // Interval Background Heartbeat: Flushes increments every 20 seconds cleanly
      setInterval(flushAccumulatedTime, 20000);

      // Mobile Native Lifecycles: Safely captures transitions when tabs hide or freeze
      window.addEventListener("pagehide", flushAccumulatedTime);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          flushAccumulatedTime();
        }
      });
    },

    /**
     * 5. Unified System Event Broker
     * Collects and hooks telemetries dispatched across Socratic test components
     */
    bindSystemWideListeners() {
      // Catch custom click metrics matching data attributes
      document.addEventListener("click", (e) => {
        const targetElement = e.target.closest("[data-neural-track]");
        if (!targetElement) return;

        const label = targetElement.dataset.neuralTrack;
        analytics.interactions[label] = (analytics.interactions[label] || 0) + 1;
        this.saveStorage();
      });

      // Synchronize MCQ Retrieval metrics
      document.addEventListener("lbfl:quiz-completed", (e) => {
        const { score, total, topic } = e.detail;
        if (!topic) return;

        if (!analytics.conceptualMastery[topic]) {
          analytics.conceptualMastery[topic] = { attempts: 0, bestScore: 0 };
        }

        const stats = analytics.conceptualMastery[topic];
        stats.attempts++;
        const percentScore = Math.round((score / total) * 100);
        if (percentScore > stats.bestScore) stats.bestScore = percentScore;

        this.saveStorage();
      });

      // Synchronize Cognitive Multiple Intelligences Maps
      document.addEventListener("lbfl:mi-profile-generated", (e) => {
        const { top } = e.detail;
        if (Array.isArray(top)) {
          analytics.cognitiveProfile.miTopChannels = top.map(item => ({ channel: item[0], score: item[1] }));
          this.saveStorage();
        }
      });

      // Synchronize Inner Archetype Profiles
      document.addEventListener("lbfl:archetype-revealed", (e) => {
        const { primary } = e.detail;
        if (primary) {
          analytics.cognitiveProfile.archetype = primary;
          this.saveStorage();
        }
      });
    },

    /**
     * Safe State Serializer
     */
    saveStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics));
      } catch (err) {
        console.warn("🔒 Synaptic Analytics: Local storage packet serialization blocked.", err);
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

  // Exposed Global Query API Console Interface
  window.CognitiveIntelligence = {
    getStats: () => analytics,
    getMastery: (topic) => analytics.conceptualMastery?.[topic] || null,
    getCognitiveProfile: () => analytics.cognitiveProfile || null,
    getExpeditionSummary: () => {
      const paths = Object.keys(analytics.pathway || {});
      const activePathsCount = paths.length;

      let totalDepthSum = 0;
      paths.forEach(p => {
        totalDepthSum += analytics.pathway[p].depthReached || 0;
      });

      return {
        uniquePathsExplored: activePathsCount,
        totalTimeInvested: analytics.totalExpeditionTime || 0,
        averageEngagementDepth: activePathsCount > 0 ? Math.round(totalDepthSum / activePathsCount) : 0
      };
    },
    resetExpedition: () => {
      localStorage.removeItem(STORAGE_KEY);
      analytics = {
        pathway: {},
        interactions: {},
        conceptualMastery: {},
        cognitiveProfile: { miTopChannels: [], archetype: null },
        totalExpeditionTime: 0
      };
      console.log("🧹 Synaptic Analytics: Cognitive database registry cleared successfully.");
    }
  };

  SynapticAnalytics.init();
})();
