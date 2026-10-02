(() => {
  "use strict";

  const ROOT_SELECTOR = "[data-authored-assessment]";

  function preferredScrollBehavior() {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? "auto" : "smooth";
  }

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
    let deadlineAt = null;

    function optionsFor(question) {
      return [...question.querySelectorAll("[data-assessment-option]")];
    }

    function answeredCount() {
      return questions.filter(question =>
        optionsFor(question).some(option => option.getAttribute("aria-checked") === "true")
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

    function syncTimerFromClock() {
      if (deadlineAt === null || submitted) return;
      timeLeft = Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000));
      updateTimer();
      if (timeLeft <= 0) {
        stopTimer();
        submitAssessment();
      }
    }

    function startTimer() {
      stopTimer();
      timeLeft = Number.isFinite(timeLimit) ? Math.max(0, timeLimit) : 0;
      deadlineAt = timeLeft > 0 ? Date.now() + (timeLeft * 1000) : null;
      updateTimer();
      if (deadlineAt === null) return;
      timerId = window.setInterval(syncTimerFromClock, 1000);
    }

    function clearOptionState(question) {
      question.classList.remove("correct", "wrong", "done");
      optionsFor(question).forEach((option, index) => {
        option.classList.remove("selected", "correct", "wrong");
        option.setAttribute("aria-checked", "false");
        option.removeAttribute("aria-label");
        option.disabled = false;
        option.tabIndex = index === 0 ? 0 : -1;
      });
    }

    function selectOption(option) {
      if (submitted) return;
      const question = option.closest("[data-assessment-question]");
      if (!question) return;
      optionsFor(question).forEach(candidate => {
        candidate.classList.remove("selected");
        candidate.setAttribute("aria-checked", "false");
        candidate.tabIndex = -1;
      });
      option.classList.add("selected");
      option.setAttribute("aria-checked", "true");
      option.tabIndex = 0;
      updateProgress();
    }

    function handleOptionKeydown(event, option) {
      if (submitted) return;
      const navigationKeys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
      if (!navigationKeys.includes(event.key)) return;

      const question = option.closest("[data-assessment-question]");
      if (!question) return;
      const options = optionsFor(question);
      const currentIndex = options.indexOf(option);
      if (currentIndex < 0) return;

      let nextIndex = currentIndex;
      if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = options.length - 1;
      else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % options.length;
      } else {
        nextIndex = (currentIndex - 1 + options.length) % options.length;
      }

      event.preventDefault();
      const nextOption = options[nextIndex];
      selectOption(nextOption);
      nextOption.focus();
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
      resultBox.scrollIntoView({ behavior: preferredScrollBehavior(), block: "nearest" });
    }

    function submitAssessment() {
      if (submitted) return;
      submitted = true;
      submitButton.disabled = true;
      stopTimer();
      deadlineAt = null;

      let correctCount = 0;
      questions.forEach(question => {
        const options = optionsFor(question);
        const selectedIndex = options.findIndex(option => option.getAttribute("aria-checked") === "true");
        const correctIndex = Number.parseInt(question.dataset.a || "-1", 10);
        const isCorrect = selectedIndex === correctIndex;

        if (isCorrect) correctCount += 1;
        question.classList.add("done", isCorrect ? "correct" : "wrong");

        options.forEach((option, index) => {
          option.disabled = true;
          const baseLabel = (option.dataset.assessmentBaseLabel || option.textContent || "").trim();
          if (index === correctIndex) {
            option.classList.add("correct");
            option.setAttribute("aria-label", `${baseLabel}. Correct answer${index === selectedIndex ? ". Your answer" : ""}.`);
          } else if (index === selectedIndex) {
            option.classList.add("wrong");
            option.setAttribute("aria-label", `${baseLabel}. Your answer. Incorrect.`);
          }
        });
      });

      renderResults(correctCount);
    }

    function resetAssessment() {
      submitted = false;
      submitButton.disabled = false;
      questions.forEach(clearOptionState);
      resultBox.classList.remove("show");
      resultBox.replaceChildren();
      retryButton.hidden = true;
      updateProgress();
      startTimer();
      const firstOption = root.querySelector("[data-assessment-option]");
      if (firstOption) firstOption.focus({ preventScroll: true });
      root.scrollIntoView({ behavior: preferredScrollBehavior(), block: "start" });
    }

    questions.forEach(question => {
      optionsFor(question).forEach((option, index) => {
        option.dataset.assessmentBaseLabel = (option.textContent || "").trim();
        option.tabIndex = index === 0 ? 0 : -1;
        option.addEventListener("click", () => selectOption(option));
        option.addEventListener("keydown", event => handleOptionKeydown(event, option));
      });
    });

    submitButton.disabled = false;
    submitButton.addEventListener("click", submitAssessment);
    retryButton.addEventListener("click", resetAssessment);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !submitted && deadlineAt !== null) syncTimerFromClock();
    });

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
