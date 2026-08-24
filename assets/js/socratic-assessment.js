(function () {
  "use strict";

  const INSTRUMENT_VERSION = "LEGACY-MI-S1-0.1";

  function titleCase(value) {
    return String(value || "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, function (char) { return char.toUpperCase(); });
  }

  function collectResponses() {
    const selected = document.querySelectorAll(
      ".socratic-scale input[type='radio']:checked"
    );

    const channelResponses = {};
    let answered = 0;

    selected.forEach(function (input) {
      const channel = input.dataset.intelligence;
      const value = Number(input.value);

      if (!channel || !Number.isFinite(value)) return;

      channelResponses[channel] =
        (channelResponses[channel] || 0) + value;

      answered += 1;
    });

    return {
      channelResponses: channelResponses,
      answered: answered
    };
  }

  function sortEntries(object) {
    return Object.entries(object).sort(function (a, b) {
      return b[1] - a[1];
    });
  }

  function renderResults() {
    const totalQuestions =
      document.querySelectorAll(".socratic-question-card").length;

    const result = collectResponses();
    const panel = document.getElementById("socratic-result-panel");

    if (!panel) return;

    if (result.answered < totalQuestions) {
      panel.innerHTML =
        "<strong>Incomplete reflection.</strong><br>Please answer all " +
        totalQuestions +
        " questions before generating the summary.";

      panel.classList.add("is-visible");
      return;
    }

    const strongestResponses =
      sortEntries(result.channelResponses).slice(0, 3);

    const channelHtml = strongestResponses
      .map(function (item, index) {
        return (
          "<li><strong>" +
          (index + 1) +
          ". " +
          titleCase(item[0]) +
          "</strong> — combined current response: " +
          item[1] +
          "</li>"
        );
      })
      .join("");

    panel.innerHTML =
      "<h2>Your Current Reflection Summary</h2>" +
      "<h3>Stronger MI-informed responses in this questionnaire</h3>" +
      "<ol>" + channelHtml + "</ol>" +
      "<p><strong>What this does not prove:</strong> these values do not measure intelligence, establish a learning style, diagnose a psychological construct, or define a personality phase.</p>" +
      "<p><strong>Separation rule:</strong> MI-informed responses are not mathematically combined with Personality Pattern Reflection.</p>" +
      "<h3>Action Task</h3>" +
      "<p>Choose one learning strategy suggested by your responses and compare it with an alternative strategy on the same Biology topic. Record which produced clearer explanation, retrieval, or application.</p>" +
      "<p><em>Exploratory instrument: " +
      INSTRUMENT_VERSION +
      ". Not longitudinally comparable unless a later compatibility review explicitly permits it.</em></p>";

    panel.classList.add("is-visible");

    const reducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    panel.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById(
      "generate-socratic-result"
    );

    if (button) {
      button.addEventListener("click", renderResults);
    }
  });
})();