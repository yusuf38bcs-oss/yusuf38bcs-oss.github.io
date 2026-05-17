/* =========================================================
   Learning Biology For Life
   Analytics & Learning Intelligence Engine
   Synaptic Learning Analytics
========================================================= */

(function () {

  "use strict";

  const STORAGE_KEY =
    "lbfl-learning-analytics";

  const SESSION_KEY =
    "lbfl-session";

  let analytics = loadAnalytics();

  /* ======================================================
     INIT
  ====================================================== */

  document.addEventListener(
    "DOMContentLoaded",
    initAnalytics
  );

  function initAnalytics() {

    trackPageVisit();

    trackReadingProgress();

    trackClicks();

    trackScrollDepth();

    setupQuizTracking();

    saveSession();

  }

  /* ======================================================
     STORAGE
  ====================================================== */

  function loadAnalytics() {

    try {

      return JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      ) || {};

    } catch {

      return {};

    }

  }

  function saveAnalytics() {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(analytics)
    );

  }

  /* ======================================================
     SESSION
  ====================================================== */

  function saveSession() {

    sessionStorage.setItem(
      SESSION_KEY,
      Date.now()
    );

  }

  /* ======================================================
     PAGE VISIT
  ====================================================== */

  function trackPageVisit() {

    const path =
      window.location.pathname;

    if (!analytics.pages) {

      analytics.pages = {};

    }

    if (!analytics.pages[path]) {

      analytics.pages[path] = {
        visits: 0,
        lastVisited: null
      };

    }

    analytics.pages[path].visits++;

    analytics.pages[path].lastVisited =
      new Date().toISOString();

    saveAnalytics();

  }

  /* ======================================================
     SCROLL DEPTH
  ====================================================== */

  function trackScrollDepth() {

    let maxDepth = 0;

    window.addEventListener(
      "scroll",
      () => {

        const scrollTop =
          window.scrollY;

        const docHeight =
          document.body.scrollHeight -
          window.innerHeight;

        const percent =
          Math.round(
            (scrollTop / docHeight) * 100
          );

        if (percent > maxDepth) {

          maxDepth = percent;

          analytics.maxScrollDepth =
            maxDepth;

          saveAnalytics();

        }

      },
      { passive: true }
    );

  }

  /* ======================================================
     READING PROGRESS
  ====================================================== */

  function trackReadingProgress() {

    const startTime = Date.now();

    window.addEventListener(
      "beforeunload",
      () => {

        const duration =
          Math.round(
            (Date.now() - startTime) / 1000
          );

        if (!analytics.readingTime) {

          analytics.readingTime = 0;

        }

        analytics.readingTime += duration;

        saveAnalytics();

      }
    );

  }

  /* ======================================================
     CLICK TRACKING
  ====================================================== */

  function trackClicks() {

    document.addEventListener(
      "click",
      (event) => {

        const target =
          event.target.closest(
            "[data-track]"
          );

        if (!target) return;

        const label =
          target.dataset.track;

        if (!analytics.clicks) {

          analytics.clicks = {};

        }

        analytics.clicks[label] =
          (analytics.clicks[label] || 0) + 1;

        saveAnalytics();

      }
    );

  }

  /* ======================================================
     QUIZ TRACKING
  ====================================================== */

  function setupQuizTracking() {

    document.addEventListener(
      "lbfl:quiz-finished",
      (event) => {

        const detail =
          event.detail || {};

        if (!analytics.quiz) {

          analytics.quiz = [];

        }

        analytics.quiz.push({

          score:
            detail.score || 0,

          total:
            detail.total || 0,

          percentage:
            detail.percentage || 0,

          weakConcepts:
            detail.weakConcepts || [],

          timestamp:
            new Date().toISOString()

        });

        saveAnalytics();

      }
    );

  }

  /* ======================================================
     LEARNING PROFILE
  ====================================================== */

  function generateLearningProfile() {

    const quizzes =
      analytics.quiz || [];

    const avg =
      quizzes.length
        ? Math.round(

            quizzes.reduce(
              (sum, q) =>
                sum + q.percentage,
              0
            ) / quizzes.length

          )
        : 0;

    return {

      totalVisits:
        Object.keys(
          analytics.pages || {}
        ).length,

      totalReadingTime:
        analytics.readingTime || 0,

      averageQuizPerformance:
        avg,

      maxScrollDepth:
        analytics.maxScrollDepth || 0

    };

  }

  /* ======================================================
     EXPORT API
  ====================================================== */

  window.LearningAnalytics = {

    getData() {

      return analytics;

    },

    getProfile() {

      return generateLearningProfile();

    },

    clear() {

      localStorage.removeItem(
        STORAGE_KEY
      );

      analytics = {};

    }

  };

})();
