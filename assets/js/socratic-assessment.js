(function () {
  function titleCase(value) {
    return value
      .replace(/_/g, " ")
      .replace(/\b\w/g, function (char) { return char.toUpperCase(); });
  }

  function collectResponses() {
    const selected = document.querySelectorAll(".socratic-scale input[type='radio']:checked");
    const scores = {};
    const dimensions = {};
    let answered = 0;

    selected.forEach(function (input) {
      const intelligence = input.dataset.intelligence;
      const value = Number(input.value);
      const dimensionList = (input.dataset.dimensions || "").split(",").filter(Boolean);

      scores[intelligence] = (scores[intelligence] || 0) + value;
      answered += 1;

      dimensionList.forEach(function (dimension) {
        dimensions[dimension] = (dimensions[dimension] || 0) + value;
      });
    });

    return { scores: scores, dimensions: dimensions, answered: answered };
  }

  function sortObjectEntries(object) {
    return Object.entries(object).sort(function (a, b) {
      return b[1] - a[1];
    });
  }

  function personalityPhase(topDimensions) {
    const names = topDimensions.map(function (item) { return item[0]; });

    if (names.includes("meaning_making") || names.includes("spiritual_reflection")) {
      return "Meaning-Seeking Reflector";
    }

    if (names.includes("service") || names.includes("empathy") || names.includes("social_regulation")) {
      return "Service-Oriented Co-Regulator";
    }

    if (names.includes("problem_solving") || names.includes("pattern_detection") || names.includes("systems_thinking")) {
      return "Systems Builder";
    }

    if (names.includes("discipline") || names.includes("self_regulation") || names.includes("accountability")) {
      return "Self-Mastery Builder";
    }

    return "Reflective Learner";
  }

  function renderResults() {
    const totalQuestions = document.querySelectorAll(".socratic-question-card").length;
    const result = collectResponses();
    const panel = document.getElementById("socratic-result-panel");

    if (!panel) return;

    if (result.answered < totalQuestions) {
      panel.innerHTML =
        "<strong>Incomplete assessment.</strong><br>Please answer all " +
        totalQuestions +
        " questions before generating your Socratic profile.";
      panel.classList.add("is-visible");
      return;
    }

    const topIntelligences = sortObjectEntries(result.scores).slice(0, 3);
    const topDimensions = sortObjectEntries(result.dimensions).slice(0, 5);
    const phase = personalityPhase(topDimensions);

    const intelligenceHtml = topIntelligences
      .map(function (item, index) {
        return "<li><strong>" + (index + 1) + ". " + titleCase(item[0]) + "</strong> — Score: " + item[1] + "</li>";
      })
      .join("");

    const dimensionHtml = topDimensions
      .map(function (item) {
        return "<li>" + titleCase(item[0]) + " — " + item[1] + "</li>";
      })
      .join("");

    panel.innerHTML =
      "<h2>Your Socratic Cognitive Audit Result</h2>" +
      "<h3>Dominant MI Signals</h3>" +
      "<ol>" + intelligenceHtml + "</ol>" +
      "<h3>Dominant Behavioural Dimensions</h3>" +
      "<ul>" + dimensionHtml + "</ul>" +
      "<h3>Current Personality Phase</h3>" +
      "<p><strong>" + phase + "</strong></p>" +
      "<h3>Action Task</h3>" +
      "<p>Choose one real-life trigger from this week. Identify the stimulus, biological reaction, CNS decision point, philosophical vector, and one corrective action for tomorrow.</p>" +
      "<p><em>This is an educational self-reflection tool, not a medical or psychiatric diagnosis.</em></p>";

    panel.classList.add("is-visible");
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("generate-socratic-result");
    if (button) {
      button.addEventListener("click", renderResults);
    }
  });
})();
