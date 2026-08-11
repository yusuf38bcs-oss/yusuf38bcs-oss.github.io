(() => {
  const root = document.querySelector("[data-ielts-reading-trainer]");
  if (!root) return;

  const source = window.LBFL_IELTS_READING_SETS || {};
  const sets = Array.isArray(source.sets) ? source.sets : [];
  const STORAGE_KEY = "lbfl-ielts-reading-trainer:v1";
  const HISTORY_LIMIT = 40;

  const els = {
    setSelect: root.querySelector("[data-reading-set]"),
    attempt: root.querySelector("[data-reading-attempt]"),
    topic: root.querySelector("[data-reading-topic]"),
    title: root.querySelector("[data-reading-title]"),
    passage: root.querySelector("[data-reading-passage]"),
    questions: root.querySelector("[data-reading-questions]"),
    timer: root.querySelector("[data-reading-timer]"),
    timerStatus: root.querySelector("[data-reading-timer-status]"),
    start: root.querySelector("[data-reading-start]"),
    pause: root.querySelector("[data-reading-pause]"),
    resetTimer: root.querySelector("[data-reading-reset-timer]"),
    submit: root.querySelector("[data-reading-submit]"),
    retry: root.querySelector("[data-reading-retry]"),
    newSet: root.querySelector("[data-reading-new-set]"),
    result: root.querySelector("[data-reading-result]"),
    resultSummary: root.querySelector("[data-reading-result-summary]"),
    saveStatus: root.querySelector("[data-reading-save-status]"),
    errorList: root.querySelector("[data-reading-error-list]"),
    errorEmpty: root.querySelector("[data-reading-error-empty]"),
    errorCount: root.querySelector("[data-reading-error-count]"),
    clearErrors: root.querySelector("[data-reading-clear-errors]"),
  };

  let interval = null;
  let deadlineMs = null;

  function firstSet() {
    return sets[0] || null;
  }

  function findSet(id) {
    return sets.find((item) => item.id === id) || firstSet();
  }

  function setSeconds(set = currentSet()) {
    const minutes = Number(set?.minutes) || 20;
    return Math.max(60, Math.round(minutes * 60));
  }

  function freshState(setId, history = [], attempt = 1) {
    const set = findSet(setId);
    return {
      setId: set?.id || "",
      attempt,
      answers: {},
      submitted: false,
      score: null,
      remaining: setSeconds(set),
      history: Array.isArray(history) ? history.slice(-HISTORY_LIMIT) : [],
    };
  }

  let state = freshState(firstSet()?.id || "");

  function currentSet() {
    return findSet(state.setId);
  }

  function safeRead() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return value && typeof value === "object" ? value : null;
    } catch (_) {
      return null;
    }
  }

  function safeWrite(message = "Saved locally.") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      els.saveStatus.textContent = message;
    } catch (_) {
      els.saveStatus.textContent = "Browser storage is unavailable; this session will not persist after reload.";
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatTime(seconds) {
    const safe = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(safe / 60);
    const remainder = safe % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  function stopTimer() {
    if (interval) window.clearInterval(interval);
    interval = null;
    deadlineMs = null;
    els.start.disabled = false;
    els.pause.disabled = true;
  }

  function syncTimerToNow(now = performance.now()) {
    if (!interval || !Number.isFinite(deadlineMs)) return false;

    if (now >= deadlineMs) {
      state.remaining = 0;
      stopTimer();
      els.timer.textContent = "00:00";
      els.timerStatus.textContent = "Time is up. Submit your answers when you are ready to review.";
      safeWrite("Timer completed. Answers remain local until you review them.");
      els.submit.focus();
      return true;
    }

    state.remaining = Math.max(0, Math.ceil((deadlineMs - now) / 1000));
    els.timer.textContent = formatTime(state.remaining);
    return false;
  }

  function renderSelect() {
    els.setSelect.innerHTML = sets.map((set) => (
      `<option value="${escapeHtml(set.id)}">${escapeHtml(set.title)}</option>`
    )).join("");
    els.setSelect.value = state.setId;
  }

  function renderPassage() {
    const set = currentSet();
    if (!set) {
      els.topic.textContent = "Reading practice";
      els.title.textContent = "No reading set available";
      els.passage.innerHTML = "";
      return;
    }

    els.topic.textContent = set.topic || "Academic reading";
    els.title.textContent = set.title;
    els.passage.innerHTML = (set.passage || [])
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");
  }

  function questionStatus(question) {
    if (!state.submitted) return "";
    return state.answers[question.id] === question.answer ? "is-correct" : "is-incorrect";
  }

  function renderQuestions() {
    const set = currentSet();
    const questions = Array.isArray(set?.questions) ? set.questions : [];

    els.questions.innerHTML = questions.map((question, index) => {
      const selected = state.answers[question.id] || "";
      const status = questionStatus(question);
      const options = (question.options || []).map((option, optionIndex) => {
        const id = `reading-${question.id}-${optionIndex}`;
        const checked = selected === option ? " checked" : "";
        const disabled = state.submitted ? " disabled" : "";
        return `
          <label class="ielts-reading__option" for="${escapeHtml(id)}">
            <input id="${escapeHtml(id)}" type="radio" name="reading-${escapeHtml(question.id)}" value="${escapeHtml(option)}" data-reading-answer="${escapeHtml(question.id)}"${checked}${disabled}>
            <span>${escapeHtml(option)}</span>
          </label>`;
      }).join("");

      const review = state.submitted ? `
        <div class="ielts-reading__feedback" data-reading-feedback>
          <p><strong>${status === "is-correct" ? "Correct." : "Review this item."}</strong> ${escapeHtml(question.explanation)}</p>
          <p><strong>Evidence:</strong> ${escapeHtml(question.evidence)}</p>
          ${status === "is-incorrect" ? `<p><strong>Correct answer:</strong> ${escapeHtml(question.answer)}</p>` : ""}
        </div>` : "";

      return `
        <fieldset class="ielts-reading__question ${status}" data-reading-question="${escapeHtml(question.id)}">
          <legend><span class="ielts-reading__question-number">${index + 1}</span>${escapeHtml(question.prompt)}</legend>
          <p class="ielts-reading__question-type">${escapeHtml(question.type)}</p>
          <div class="ielts-reading__options">${options}</div>
          ${review}
        </fieldset>`;
    }).join("");
  }

  function renderResult() {
    const set = currentSet();
    const total = set?.questions?.length || 0;
    els.result.hidden = !state.submitted;
    els.submit.disabled = state.submitted || total === 0;

    if (!state.submitted) {
      els.resultSummary.textContent = "";
      return;
    }

    const unanswered = (set.questions || []).filter((question) => !state.answers[question.id]).length;
    els.resultSummary.textContent = `${state.score} of ${total} correct · ${unanswered} unanswered. This is a practice accuracy result, not an IELTS band score.`;
  }

  function renderErrorLog() {
    const history = Array.isArray(state.history) ? state.history : [];
    const recent = history.slice(-10).reverse();
    els.errorCount.textContent = `${history.length} saved error${history.length === 1 ? "" : "s"}`;
    els.errorEmpty.hidden = recent.length > 0;
    els.clearErrors.disabled = history.length === 0;

    els.errorList.innerHTML = recent.map((entry) => `
      <li class="ielts-reading__error-item">
        <div>
          <strong>${escapeHtml(entry.setTitle)}</strong>
          <span>Question ${escapeHtml(entry.questionNumber)} · ${escapeHtml(entry.tag || entry.type)}</span>
        </div>
        <p><strong>Your answer:</strong> ${escapeHtml(entry.selected || "Unanswered")}</p>
        <p><strong>Correct answer:</strong> ${escapeHtml(entry.correct)}</p>
      </li>`).join("");
  }

  function renderTimer() {
    els.timer.textContent = formatTime(state.remaining);
    if (!interval) {
      els.timerStatus.textContent = state.remaining === 0 ?
        "Time is up. Submit your answers when you are ready to review." :
        "Timer ready. You can also practise without starting it.";
    }
  }

  function render() {
    const set = currentSet();
    if (set && state.setId !== set.id) state.setId = set.id;
    if (!Number.isFinite(state.remaining) || state.remaining < 0 || state.remaining > setSeconds(set)) {
      state.remaining = setSeconds(set);
    }
    if (!Number.isInteger(state.attempt) || state.attempt < 1) state.attempt = 1;
    if (!state.answers || typeof state.answers !== "object") state.answers = {};
    if (!Array.isArray(state.history)) state.history = [];

    renderSelect();
    renderPassage();
    renderQuestions();
    renderResult();
    renderErrorLog();
    renderTimer();
    els.attempt.textContent = `Attempt ${state.attempt}`;
  }

  function resetForSet(setId, message, attempt = 1) {
    stopTimer();
    const history = state.history;
    state = freshState(setId, history, attempt);
    render();
    safeWrite(message);
  }

  function chooseNewSet() {
    if (sets.length < 2) return;
    const candidates = sets.filter((set) => set.id !== state.setId);
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    resetForSet(next.id, "New reading set selected.");
    els.setSelect.focus();
  }

  function submitAnswers() {
    if (state.submitted) return;
    stopTimer();
    const set = currentSet();
    const questions = Array.isArray(set?.questions) ? set.questions : [];
    let correct = 0;
    const newErrors = [];

    questions.forEach((question, index) => {
      const selected = state.answers[question.id] || "";
      if (selected === question.answer) {
        correct += 1;
        return;
      }

      newErrors.push({
        at: new Date().toISOString(),
        attempt: state.attempt,
        setId: set.id,
        setTitle: set.title,
        questionId: question.id,
        questionNumber: index + 1,
        type: question.type,
        tag: question.tag || "reading",
        selected,
        correct: question.answer,
      });
    });

    state.score = correct;
    state.submitted = true;
    state.history = [...state.history, ...newErrors].slice(-HISTORY_LIMIT);
    render();
    safeWrite("Reading attempt reviewed and error log updated locally.");
    els.result.focus();
  }

  els.setSelect.addEventListener("change", () => {
    resetForSet(els.setSelect.value, "Reading set changed.");
  });

  els.newSet.addEventListener("click", chooseNewSet);

  els.questions.addEventListener("change", (event) => {
    const input = event.target.closest("[data-reading-answer]");
    if (!input || state.submitted) return;
    state.answers[input.dataset.readingAnswer] = input.value;
    safeWrite("Answer autosaved locally.");
  });

  els.start.addEventListener("click", () => {
    if (interval || state.remaining <= 0 || state.submitted) return;
    els.start.disabled = true;
    els.pause.disabled = false;
    els.timerStatus.textContent = "Reading timer running.";
    deadlineMs = performance.now() + (state.remaining * 1000);
    interval = window.setInterval(() => syncTimerToNow(), 1000);
  });

  els.pause.addEventListener("click", () => {
    if (syncTimerToNow()) return;
    stopTimer();
    els.timerStatus.textContent = "Timer paused.";
    safeWrite("Timer paused and saved locally.");
  });

  els.resetTimer.addEventListener("click", () => {
    stopTimer();
    state.remaining = setSeconds();
    renderTimer();
    safeWrite("Timer reset.");
  });

  els.submit.addEventListener("click", submitAnswers);

  els.retry.addEventListener("click", () => {
    const nextAttempt = state.attempt + 1;
    const setId = state.setId;
    resetForSet(setId, `Retry ${nextAttempt} started for the same passage.`, nextAttempt);
    els.passage.focus();
  });

  els.clearErrors.addEventListener("click", () => {
    const confirmed = window.confirm("Clear the local Reading Trainer error log? Your current passage answers will remain.");
    if (!confirmed) return;
    state.history = [];
    renderErrorLog();
    safeWrite("Reading error log cleared.");
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible" || !interval) return;
    if (syncTimerToNow()) return;
    safeWrite();
  });

  window.addEventListener("pagehide", () => {
    if (interval) syncTimerToNow();
    safeWrite();
  });

  const saved = safeRead();
  if (saved && sets.some((set) => set.id === saved.setId)) {
    state = {
      ...freshState(saved.setId, saved.history, saved.attempt),
      ...saved,
      history: Array.isArray(saved.history) ? saved.history.slice(-HISTORY_LIMIT) : [],
    };
  }

  render();
})();
