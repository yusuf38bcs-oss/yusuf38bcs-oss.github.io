(function () {
  "use strict";

  var PROGRESS_KEY = "lbfl-admission-7day-progress-20260823";
  var ERROR_KEY = "lbfl-admission-7day-errors-20260823";

  function readJSON(key, fallback) {
    try {
      var value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* Local storage is optional; the lesson remains usable without it. */
    }
  }

  function progressState() {
    var state = readJSON(PROGRESS_KEY, { completed: [], attempts: [] });
    state.completed = Array.isArray(state.completed) ? state.completed : [];
    state.attempts = Array.isArray(state.attempts) ? state.attempts : [];
    return state;
  }

  function renderProgress() {
    var state = progressState();
    document.querySelectorAll("[data-admission-progress-count]").forEach(function (node) {
      node.textContent = String(state.completed.length) + " / 7 days completed";
    });
    document.querySelectorAll("[data-admission-progress-bar]").forEach(function (node) {
      node.style.width = String(Math.round((state.completed.length / 7) * 100)) + "%";
    });
    document.querySelectorAll("[data-admission-day-link]").forEach(function (link) {
      var day = Number(link.getAttribute("data-admission-day-link"));
      if (state.completed.indexOf(day) !== -1) {
        link.setAttribute("data-complete", "true");
        link.setAttribute("aria-label", link.textContent.trim() + " completed");
      }
    });
  }

  function wireCompletion() {
    document.querySelectorAll("[data-admission-complete]").forEach(function (button) {
      var day = Number(button.getAttribute("data-admission-complete"));
      var state = progressState();
      if (state.completed.indexOf(day) !== -1) {
        button.textContent = "Day " + day + " marked complete";
        button.setAttribute("data-completed", "true");
      }
      button.addEventListener("click", function () {
        var next = progressState();
        if (next.completed.indexOf(day) === -1) next.completed.push(day);
        next.completed.sort(function (a, b) { return a - b; });
        writeJSON(PROGRESS_KEY, next);
        button.textContent = "Day " + day + " marked complete";
        button.setAttribute("data-completed", "true");
        renderProgress();
      });
    });
  }

  function wireQuiz() {
    document.querySelectorAll("[data-admission-quiz]").forEach(function (form) {
      var result = form.querySelector("[data-admission-result]");
      var reset = form.querySelector("[data-admission-reset]");
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var questions = Array.prototype.slice.call(form.querySelectorAll("[data-answer]"));
        var score = 0;
        var mistakes = [];
        questions.forEach(function (question, index) {
          var selected = question.querySelector("input[type=radio]:checked");
          var answer = Number(question.getAttribute("data-answer"));
          var chosen = selected ? Number(selected.value) : -1;
          var correct = chosen === answer;
          question.setAttribute("data-result", correct ? "correct" : "incorrect");
          if (correct) {
            score += 1;
          } else {
            mistakes.push({
              number: index + 1,
              subject: question.getAttribute("data-subject") || "Foundation",
              repair: question.getAttribute("data-repair") || "/admission/",
              explanation: question.getAttribute("data-explanation") || "Return to the source concept and retest later."
            });
          }
        });
        var state = progressState();
        state.attempts.push({ date: new Date().toISOString(), score: score, total: questions.length });
        writeJSON(PROGRESS_KEY, state);
        var errors = readJSON(ERROR_KEY, []);
        errors.push({ date: new Date().toISOString(), score: score, total: questions.length, mistakes: mistakes });
        writeJSON(ERROR_KEY, errors.slice(-20));
        result.innerHTML = "<strong>Score: " + score + " / " + questions.length + "</strong>" +
          "<p>" + (mistakes.length ? "Repair " + mistakes.length + " item(s), revisit the linked concept, then retest later." : "Excellent: record the reasoning that made each answer valid.") + "</p>" +
          (mistakes.length ? "<ol>" + mistakes.map(function (mistake) {
            return "<li>Q" + mistake.number + " · " + mistake.subject + " — <a href=\"" + mistake.repair + "\">repair source</a><br><span>" + mistake.explanation + "</span></li>";
          }).join("") + "</ol>" : "");
        result.hidden = false;
        result.focus();
        renderProgress();
      });
      if (reset) {
        reset.addEventListener("click", function () {
          form.reset();
          form.querySelectorAll("[data-result]").forEach(function (node) { node.removeAttribute("data-result"); });
          result.hidden = true;
          result.innerHTML = "";
        });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderProgress();
    wireCompletion();
    wireQuiz();
  });
})();