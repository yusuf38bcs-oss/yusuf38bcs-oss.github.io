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

  // Fail fast and warn if required elements are missing to avoid obscure runtime errors
  const _required = ["setSelect", "questions", "timer", "submit", "saveStatus"];
  const _missing = _required.filter((k) => !els[k]);
  if (_missing.length) {
    console.warn("IELTS reading trainer: missing required elements:", _missing);
    return;
  }

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
      if (els.saveStatus) els.saveStatus.textContent = message;
      else console.debug("saveStatus element missing; message:", message);
    } catch (err) {
      if (els.saveStatus) {
        els.saveStatus.textContent = "Browser storage is unavailable; this session will not persist after reload.";
      }
      console.warn("localStorage set failed:", err);
    }
  }

  function escapeHtml(value) {
    const s = String(value ?? "");
    if (String.prototype.replaceAll) {
      return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
    // Fallback for environments without replaceAll
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
    if (els.start) els.start.disabled = false;
    if (els.pause) els.pause.disabled = true;
  }

  function syncTimerToNow(now = performance.now()) {
    if (!interval || !Number.isFinite(deadlineMs)) return false;

    if (now >= deadlineMs) {
      state.remaining = 0;
      stopTimer();
      if (els.timer) els.timer.textContent = "00:00";
      if (els.timerStatus) els.timerStatus.textContent = "Time is up. Submit your answers when you are ready to review.";
      safeWrite("Timer completed. Answers remain local until you review them.");
      if (els.submit) try { els.submit.focus(); } catch (_) {}
      return true;
    }

    state.remaining = Math.max(0, Math.ceil((deadlineMs - now) / 1000));
    if (els.timer) els.timer.textContent = formatTime(state.remaining);
    return false;
  }

  function renderSelect() {
    els.setSelect.innerHTML = sets.map((set) => (
      `<option value="${escapeHtml(set.id)}">${escapeHtml(set.title)}</option>`
    )).join("");

    const fallback = (sets[0] && sets[0].id) || "";
    els.setSelect.value = state.setId || fallback;
    if (!els.setSelect.value && sets[0]) {
      // Keep UI and state consistent by resetting to the first set
      resetForSet(sets[0].id, "Selected set not found; falling back to first set.");
    }
  }

  function renderPassage() {
    const set = currentSet();
    if (!set) {
      if (els.topic) els.topic.textContent = "Reading practice";
      if (els.title) els.title.textContent = "No reading set available";
      if (els.passage) els.passage.innerHTML = "";
      return;
    }

    if (els.topic) els.topic.textContent = set.topic || "Academic reading";
    if (els.title) els.title.textContent = set.title;
    if (els.passage) els.passage.innerHTML = (set.passage || [])
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
    if (els.result) els.result.hidden = !state.submitted;
    if (els.submit) els.submit.disabled = state.submitted || total === 0;

    if (!state.submitted) {
      if (els.resultSummary) els.resultSummary.textContent = "";
      return;
    }

    const unanswered = (set.questions || []).filter((question) => !state.answers[question.id]).length;
    if (els.resultSummary) els.resultSummary.textContent = `${state.score} of ${total} correct · ${unanswered} unanswered. This is a practice accuracy result, not an IELTS band score.`;
  }

  function renderErrorLog() {
    const history = Array.isArray(state.history) ? state.history : [];
    const recent = history.slice(-10).reverse();
    if (els.errorCount) els.errorCount.textContent = `${history.length} saved error${history.length === 1 ? "" : "s"}`;
    if (els.errorEmpty) els.errorEmpty.hidden = recent.length > 0;
    if (els.clearErrors) els.clearErrors.disabled = history.length === 0;

    if (els.errorList) els.errorList.innerHTML = recent.map((entry) => `
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
    if (els.timer) els.timer.textContent = formatTime(state.remaining);
    if (!interval && els.timerStatus) {
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
    if (els.attempt) els.attempt.textContent = `Attempt ${state.attempt}`;
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
    if (els.setSelect) els.setSelect.focus();
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
    if (els.result) try { els.result.focus(); } catch (_) {}
  }

  if (els.setSelect) {
    els.setSelect.addEventListener("change", () => {
      resetForSet(els.setSelect.value, "Reading set changed.");
    });
  }

  if (els.newSet) els.newSet.addEventListener("click", chooseNewSet);

  if (els.questions) {
    els.questions.addEventListener("change", (event) => {
      const input = event.target.closest("[data-reading-answer]");
      if (!input || state.submitted) return;
      state.answers[input.dataset.readingAnswer] = input.value;
      safeWrite("Answer autosaved locally.");
    });
  }

  if (els.start) {
    els.start.addEventListener("click", () => {
      if (interval || state.remaining <= 0 || state.submitted) return;
      els.start.disabled = true;
      if (els.pause) els.pause.disabled = false;
      if (els.timerStatus) els.timerStatus.textContent = "Reading timer running.";
      deadlineMs = performance.now() + (state.remaining * 1000);
      interval = window.setInterval(() => syncTimerToNow(), 1000);
    });
  }

  if (els.pause) {
    els.pause.addEventListener("click", () => {
      if (syncTimerToNow()) return;
      stopTimer();
      if (els.timerStatus) els.timerStatus.textContent = "Timer paused.";
      safeWrite("Timer paused and saved locally.");
    });
  }

  if (els.resetTimer) {
    els.resetTimer.addEventListener("click", () => {
      stopTimer();
      state.remaining = setSeconds();
      renderTimer();
      safeWrite("Timer reset.");
    });
  }

  if (els.submit) els.submit.addEventListener("click", submitAnswers);

  if (els.retry) {
    els.retry.addEventListener("click", () => {
      const nextAttempt = state.attempt + 1;
      const setId = state.setId;
      resetForSet(setId, `Retry ${nextAttempt} started for the same passage.`, nextAttempt);
      if (els.passage) els.passage.focus();
    });
  }

  if (els.clearErrors) {
    els.clearErrors.addEventListener("click", () => {
      const confirmed = window.confirm("Clear the local Reading Trainer error log? Your current passage answers will remain.");
      if (!confirmed) return;
      state.history = [];
      renderErrorLog();
      safeWrite("Reading error log cleared.");
    });
  }

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
    // Normalize and validate saved values before applying to state
    const normalized = {
      setId: saved.setId,
      attempt: Number.isFinite(Number(saved.attempt)) && Number(saved.attempt) >= 1 ? Math.floor(Number(saved.attempt)) : 1,
      history: Array.isArray(saved.history) ? saved.history.slice(-HISTORY_LIMIT) : [],
      answers: (saved.answers && typeof saved.answers === "object") ? saved.answers : {},
      remaining: (Number.isFinite(Number(saved.remaining)) && saved.remaining >= 0) ? Number(saved.remaining) : setSeconds(findSet(saved.setId)),
      submitted: !!saved.submitted,
      score: Number.isFinite(Number(saved.score)) ? Number(saved.score) : null,
    };

    state = { ...freshState(normalized.setId, normalized.history, normalized.attempt), ...normalized };
  }

  render();
})();
