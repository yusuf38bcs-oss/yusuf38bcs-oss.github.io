(() => {
  const root = document.querySelector("[data-ielts-speaking-simulator]");
  if (!root) return;

  const prompts = window.LBFL_IELTS_SPEAKING_PROMPTS || {};
  const STORAGE_KEY = "lbfl-ielts-speaking-simulator:v1";

  const timings = {
    part1: { label: "Response", seconds: 45 },
    part2: { label: "Preparation", seconds: 60 },
    part3: { label: "Response", seconds: 90 },
  };

  const criteria = [
    {
      id: "fluency",
      title: "Fluency & Coherence",
      text: "I developed the response logically and recovered from hesitation without losing the main idea.",
    },
    {
      id: "lexical",
      title: "Lexical Resource",
      text: "I used precise vocabulary and avoided unnecessary repetition.",
    },
    {
      id: "grammar",
      title: "Grammatical Range & Accuracy",
      text: "I used a useful range of sentence structures while keeping meaning clear.",
    },
    {
      id: "pronunciation",
      title: "Pronunciation Awareness",
      text: "My pace, stress and phrasing would allow a listener to follow the response comfortably.",
    },
  ];

  const els = {
    part: root.querySelector("[data-speaking-part]"),
    topic: root.querySelector("[data-speaking-topic]"),
    title: root.querySelector("[data-speaking-prompt-title]"),
    prompt: root.querySelector("[data-speaking-prompt]"),
    newPrompt: root.querySelector("[data-speaking-new-prompt]"),
    attempt: root.querySelector("[data-speaking-attempt]"),
    plan: root.querySelector("[data-speaking-plan]"),
    notes: root.querySelector("[data-speaking-notes]"),
    reflection: root.querySelector("[data-speaking-reflection]"),
    timer: root.querySelector("[data-speaking-timer]"),
    timerPhase: root.querySelector("[data-speaking-timer-phase]"),
    timerStatus: root.querySelector("[data-speaking-timer-status]"),
    start: root.querySelector("[data-speaking-start]"),
    pause: root.querySelector("[data-speaking-pause]"),
    resetTimer: root.querySelector("[data-speaking-reset-timer]"),
    checklist: root.querySelector("[data-speaking-checklist]"),
    reviewSummary: root.querySelector("[data-speaking-review-summary]"),
    save: root.querySelector("[data-speaking-save]"),
    retry: root.querySelector("[data-speaking-retry]"),
    reset: root.querySelector("[data-speaking-reset]"),
    saveStatus: root.querySelector("[data-speaking-save-status]"),
  };

  let interval = null;
  let state = {
    part: "part1",
    promptId: "",
    attempt: 1,
    remaining: timings.part1.seconds,
    checks: {},
    plan: "",
    notes: "",
    reflection: "",
  };

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

  function collection() {
    return Array.isArray(prompts[state.part]) ? prompts[state.part] : [];
  }

  function currentPrompt() {
    const list = collection();
    return list.find((item) => item.id === state.promptId) || list[0];
  }

  function randomPrompt() {
    const list = collection();
    if (!list.length) return null;
    if (list.length === 1) return list[0];
    const available = list.filter((item) => item.id !== state.promptId);
    return available[Math.floor(Math.random() * available.length)];
  }

  function formatTime(seconds) {
    const safe = Math.max(0, seconds);
    const minutes = Math.floor(safe / 60);
    const remainder = safe % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  function stopTimer() {
    if (interval) window.clearInterval(interval);
    interval = null;
    els.start.disabled = false;
    els.pause.disabled = true;
  }

  function resetTimerState() {
    stopTimer();
    const config = timings[state.part];
    state.remaining = config.seconds;
    els.timerPhase.textContent = config.label;
    els.timer.textContent = formatTime(state.remaining);
    els.timerStatus.textContent = "Timer ready.";
  }

  function renderPrompt() {
    const item = currentPrompt();
    if (!item) {
      els.topic.textContent = "Practice";
      els.title.textContent = "No prompt available";
      els.prompt.textContent = "";
      return;
    }

    els.topic.textContent = item.topic;

    if (state.part === "part2") {
      els.title.textContent = item.cue;
      els.prompt.innerHTML = `
        <p>${item.cue}</p>
        <p><strong>You may consider:</strong></p>
        <ul>${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
        <p><strong>Follow-up thinking:</strong></p>
        <ul>${item.follow_up.map((question) => `<li>${question}</li>`).join("")}</ul>
      `;
      return;
    }

    els.title.textContent = item.topic;
    els.prompt.innerHTML = `<ol>${item.questions.map((question) => `<li>${question}</li>`).join("")}</ol>`;
  }

  function renderChecklist() {
    els.checklist.innerHTML = criteria.map((criterion) => {
      const id = `speaking-check-${criterion.id}`;
      return `
        <li>
          <label for="${id}">
            <input id="${id}" type="checkbox" value="${criterion.id}" data-speaking-check>
            <span><strong>${criterion.title}</strong><br>${criterion.text}</span>
          </label>
        </li>`;
    }).join("");

    root.querySelectorAll("[data-speaking-check]").forEach((input) => {
      input.checked = Boolean(state.checks[input.value]);
    });
  }

  function renderReviewSummary() {
    const checked = root.querySelectorAll("[data-speaking-check]:checked").length;
    els.reviewSummary.textContent = `${checked} of ${criteria.length} reviewed.`;
  }

  function collectState() {
    const checks = {};
    root.querySelectorAll("[data-speaking-check]").forEach((input) => {
      checks[input.value] = input.checked;
    });

    state = {
      ...state,
      part: els.part.value,
      plan: els.plan.value,
      notes: els.notes.value,
      reflection: els.reflection.value,
      checks,
    };
  }

  function render() {
    els.part.value = state.part;
    const item = currentPrompt();
    if (!state.promptId && item) state.promptId = item.id;

    els.attempt.textContent = `Attempt ${state.attempt}`;
    els.plan.value = state.plan || "";
    els.notes.value = state.notes || "";
    els.reflection.value = state.reflection || "";

    renderPrompt();
    renderChecklist();
    renderReviewSummary();

    els.timer.textContent = formatTime(state.remaining);
    els.timerPhase.textContent = timings[state.part].label;
  }

  function changePart() {
    collectState();
    stopTimer();

    state = {
      part: els.part.value,
      promptId: "",
      attempt: 1,
      remaining: timings[els.part.value].seconds,
      checks: {},
      plan: "",
      notes: "",
      reflection: "",
    };

    const item = randomPrompt();
    if (item) state.promptId = item.id;
    render();
    safeWrite("Speaking mode changed.");
  }

  function chooseNewPrompt() {
    collectState();
    stopTimer();

    const item = randomPrompt();
    if (!item) return;

    state.promptId = item.id;
    state.attempt = 1;
    state.plan = "";
    state.notes = "";
    state.reflection = "";
    state.checks = {};
    state.remaining = timings[state.part].seconds;

    render();
    safeWrite("New prompt selected.");
  }

  function timerFinished() {
    stopTimer();
    state.remaining = 0;
    els.timer.textContent = "00:00";
    els.timerStatus.textContent = "Time is up. Finish the idea, then review the attempt.";
    collectState();
    safeWrite();
    els.notes.focus();
  }

  els.part.addEventListener("change", changePart);
  els.newPrompt.addEventListener("click", chooseNewPrompt);

  els.start.addEventListener("click", () => {
    if (interval || state.remaining <= 0) return;
    els.start.disabled = true;
    els.pause.disabled = false;
    els.timerStatus.textContent = "Timer running.";

    interval = window.setInterval(() => {
      state.remaining -= 1;
      els.timer.textContent = formatTime(state.remaining);
      if (state.remaining <= 0) timerFinished();
    }, 1000);
  });

  els.pause.addEventListener("click", () => {
    stopTimer();
    els.timerStatus.textContent = "Timer paused.";
    collectState();
    safeWrite();
  });

  els.resetTimer.addEventListener("click", () => {
    resetTimerState();
    collectState();
    safeWrite("Timer reset.");
  });

  root.addEventListener("change", (event) => {
    if (event.target.matches("[data-speaking-check]")) {
      collectState();
      renderReviewSummary();
      safeWrite();
    }
  });

  [els.plan, els.notes, els.reflection].forEach((field) => {
    field.addEventListener("input", () => {
      collectState();
      safeWrite("Autosaved locally.");
    });
  });

  els.save.addEventListener("click", () => {
    collectState();
    safeWrite("Speaking attempt saved locally.");
  });

  els.retry.addEventListener("click", () => {
    collectState();
    stopTimer();
    state.attempt += 1;
    state.remaining = timings[state.part].seconds;
    state.checks = {};
    render();
    safeWrite(`Retry ${state.attempt} started for the same prompt.`);
    els.plan.focus();
  });

  els.reset.addEventListener("click", () => {
    const confirmed = window.confirm("Reset this speaking practice? Local notes and review selections will be removed.");
    if (!confirmed) return;

    stopTimer();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      // Continue with in-memory reset.
    }

    state = {
      part: els.part.value,
      promptId: "",
      attempt: 1,
      remaining: timings[els.part.value].seconds,
      checks: {},
      plan: "",
      notes: "",
      reflection: "",
    };

    const item = randomPrompt();
    if (item) state.promptId = item.id;
    render();
    els.saveStatus.textContent = "Practice reset. Nothing was submitted.";
  });

  window.addEventListener("pagehide", () => {
    collectState();
    safeWrite();
  });

  const saved = safeRead();
  if (saved && timings[saved.part] && Array.isArray(prompts[saved.part])) {
    state = { ...state, ...saved };
  }

  if (!currentPrompt()) {
    const list = Array.isArray(prompts[state.part]) ? prompts[state.part] : [];
    if (list[0]) state.promptId = list[0].id;
  }

  render();
})();
