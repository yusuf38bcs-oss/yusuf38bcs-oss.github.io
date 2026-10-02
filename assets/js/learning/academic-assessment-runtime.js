(() => {
  "use strict";

  const ROOT_SELECTOR = "[data-authored-assessment]";

  function formatTime(totalSeconds) {
    const seconds = Math.max(0, Number(totalSeconds) || 0);
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  function setupAssessment(root) {
    const questions = [...root.querySelectorAll("[data-assessment-question]")];
    const progressText = root.querySelector("[data-assessment-progress-text]");
    const progressBar = root.querySelector("[data-assessment-progress-bar]");
    const timerDisplay = root.querySelector("[data-assessment-timer]");
    const submitButton = root.querySelector("[data-assessment-submit]");
    const retryButton = root.querySelector("[data-assessment-retry]");
    const resultBox = root.querySelector("[data-assessment-results]");
    const sourceReturn = root.dataset.sourceReturn || "";
    const sourceLabel = root.dataset.sourceLabel || "Review source learning";
    const timeLimit = Number.parseInt(root.dataset.timeLimit || "0", 10);

    if (!questions.length || !submitButton || !retryButton || !resultBox) return;

    let submitted = false;
    let timerId = null;
    let timeLeft = Number.isFinite(timeLimit) ? Math.max(0, timeLimit) : 0;

    function optionsFor(question) {
      return [...question.querySelectorAll("[data-assessment-option]")];
    }

    function answeredCount() {
      return questions.filter(question =>
        optionsFor(question).some(option => option.getAttribute("aria-pressed") === "true")
      ).length;
    }

    function updateProgress() {
      const answered = answeredCount();
      if (progressText) progressText.textContent = `${answered} / ${questions.length} Answered`;
      if (progressBar) {
        const percent = questions.length ? (answered / questions.length) * 100 : 0;
        progressBar.style.width = `${percent}%`;
      }
    }

    function updateTimer() {
      if (timerDisplay) timerDisplay.textContent = `⏱️ ${formatTime(timeLeft)}`;
    }

    function stopTimer() {
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    function startTimer() {
      stopTimer();
      timeLeft = Number.isFinite(timeLimit) ? Math.max(0, timeLimit) : 0;
      updateTimer();
      if (timeLeft <= 0) return;
      timerId = window.setInterval(() => {
        timeLeft -= 1;
        updateTimer();
        if (timeLeft <= 0) {
          stopTimer();
          submitAssessment();
        }
      }, 1000);
    }

    function clearOptionState(question) {
      question.classList.remove("correct", "wrong", "done");
      optionsFor(question).forEach(option => {
        option.classList.remove("selected", "correct", "wrong");
        option.setAttribute("aria-pressed", "false");
        option.disabled = false;
      });
    }

    function selectOption(option) {
      if (submitted) return;
      const question = option.closest("[data-assessment-question]");
      if (!question) return;
      optionsFor(question).forEach(candidate => {
        candidate.classList.remove("selected");
        candidate.setAttribute("aria-pressed", "false");
      });
      option.classList.add("selected");
      option.setAttribute("aria-pressed", "true");
      updateProgress();
    }

    function addResultLine(text, className) {
      const node = document.createElement("p");
      if (className) node.className = className;
      node.textContent = text;
      resultBox.appendChild(node);
      return node;
    }

    function renderResults(correctCount) {
      resultBox.replaceChildren();

      const heading = document.createElement("h3");
      heading.textContent = "Assessment feedback";
      resultBox.appendChild(heading);

      const score = document.createElement("div");
      score.className = "score-text";
      score.dataset.assessmentScore = "";
      score.textContent = `${correctCount} / ${questions.length}`;
      resultBox.appendChild(score);

      addResultLine("Review the marked answers and authored explanations before your next attempt.");

      if (correctCount < questions.length && sourceReturn) {
        addResultLine("Repair the weak concept in the source learning route, then reattempt this assessment.");
        const repair = document.createElement("a");
        repair.href = sourceReturn;
        repair.className = "btn-restart";
        repair.dataset.assessmentRepair = "";
        repair.textContent = sourceLabel;
        resultBox.appendChild(repair);
      }

      resultBox.classList.add("show");
      retryButton.hidden = false;
      resultBox.focus({ preventScroll: true });
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function submitAssessment() {
      if (submitted) return;
      submitted = true;
      stopTimer();

      let correctCount = 0;
      questions.forEach(question => {
        const options = optionsFor(question);
        const selectedIndex = options.findIndex(option => option.getAttribute("aria-pressed") === "true");
        const correctIndex = Number.parseInt(question.dataset.a || "-1", 10);
        const isCorrect = selectedIndex === correctIndex;

        if (isCorrect) correctCount += 1;
        question.classList.add("done", isCorrect ? "correct" : "wrong");

        options.forEach((option, index) => {
          option.disabled = true;
          if (index === correctIndex) option.classList.add("correct");
          if (index === selectedIndex && !isCorrect) option.classList.add("wrong");
        });
      });

      renderResults(correctCount);
    }

    function resetAssessment() {
      submitted = false;
      questions.forEach(clearOptionState);
      resultBox.classList.remove("show");
      resultBox.replaceChildren();
      retryButton.hidden = true;
      updateProgress();
      startTimer();
      const firstOption = root.querySelector("[data-assessment-option]");
      if (firstOption) firstOption.focus({ preventScroll: true });
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    questions.forEach(question => {
      optionsFor(question).forEach(option => {
        option.addEventListener("click", () => selectOption(option));
      });
    });

    submitButton.addEventListener("click", submitAssessment);
    retryButton.addEventListener("click", resetAssessment);

    updateProgress();
    startTimer();
  }

  function init() {
    document.querySelectorAll(ROOT_SELECTOR).forEach(setupAssessment);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
