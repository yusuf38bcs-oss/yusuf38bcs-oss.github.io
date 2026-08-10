(() => {
  const root = document.querySelector('[data-ielts-writing-lab]');
  if (!root) return;

  const tasks = Array.isArray(window.LBFL_IELTS_WRITING_TASKS)
    ? window.LBFL_IELTS_WRITING_TASKS
    : [];
  if (!tasks.length) return;

  const STORAGE_PREFIX = 'lbfl-ielts-writing-lab:';
  const reviewCriteria = [
    {
      id: 'task-response',
      name: 'Task Achievement / Task Response',
      task1: 'I selected the main features, made relevant comparisons and met the task purpose.',
      task2: 'I answered every part of the question, developed my position and supported it.'
    },
    {
      id: 'coherence-cohesion',
      name: 'Coherence & Cohesion',
      task1: 'My information is grouped logically and relationships between ideas are clear.',
      task2: 'My paragraphs have a clear progression and linking is natural rather than mechanical.'
    },
    {
      id: 'lexical-resource',
      name: 'Lexical Resource',
      task1: 'My data language is precise, varied and accurate without unnecessary complexity.',
      task2: 'My word choice is precise and flexible, with accurate collocation and tone.'
    },
    {
      id: 'grammar',
      name: 'Grammatical Range & Accuracy',
      task1: 'I used varied sentence structures accurately, including comparisons and tense control.',
      task2: 'I used a range of structures accurately and my errors do not obscure meaning.'
    }
  ];
  const els = {
    taskSelect: root.querySelector('[data-writing-task]'),
    durationSelect: root.querySelector('[data-writing-duration]'),
    taskType: root.querySelector('[data-writing-task-type]'),
    promptTitle: root.querySelector('[data-writing-prompt-title]'),
    prompt: root.querySelector('[data-writing-prompt]'),
    threshold: root.querySelector('[data-writing-threshold]'),
    plan: root.querySelector('[data-writing-plan]'),
    response: root.querySelector('[data-writing-response]'),
    wordCount: root.querySelector('[data-writing-word-count]'),
    wordMessage: root.querySelector('[data-writing-word-message]'),
    timer: root.querySelector('[data-writing-timer]'),
    timerStatus: root.querySelector('[data-writing-timer-status]'),
    start: root.querySelector('[data-writing-start]'),
    pause: root.querySelector('[data-writing-pause]'),
    resetTimer: root.querySelector('[data-writing-reset-timer]'),
    structure: root.querySelector('[data-writing-structure]'),
    checklist: root.querySelector('[data-writing-checklist]'),
    checklistCopy: root.querySelector('[data-writing-checklist-copy]'),
    modelToggle: root.querySelector('[data-writing-model-toggle]'),
    modelPanel: root.querySelector('[data-writing-model]'),
    weakestSentence: root.querySelector('[data-writing-weakest-sentence]'),
    save: root.querySelector('[data-writing-save]'),
    resetAttempt: root.querySelector('[data-writing-reset-attempt]'),
    saveStatus: root.querySelector('[data-writing-save-status]'),
    reviewSummary: root.querySelector('[data-writing-review-summary]')
  };

  const durationSeconds = () => Number(els.durationSelect.value) * 60;
  const selectedTask = () => tasks.find((task) => task.id === els.taskSelect.value) || tasks[0];
  const storageKey = (taskId) => `${STORAGE_PREFIX}${taskId}`;
  let currentTask = tasks[0];
  let interval = null;
  let state = { remaining: durationSeconds(), modelOpen: false, checks: {} };
  let saveTimer = null;

  const safeRead = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : null;
    } catch (_) {
      return null;
    }
  };

  const setSaveStatus = (message) => {
    if (els.saveStatus) els.saveStatus.textContent = message;
  };

  const wordCount = (text) => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/u).length : 0;
  };

  const persist = (message = 'Saved locally in this browser.') => {
    const checks = {};
    root.querySelectorAll('[data-writing-check]').forEach((input) => {
      checks[input.value] = input.checked;
    });
    state = {
      ...state,
      plan: els.plan.value,
      response: els.response.value,
      weakestSentence: els.weakestSentence.value,
      durationMinutes: Number(els.durationSelect.value),
      checks,
      modelOpen: !els.modelPanel.hidden
    };
    try {
      localStorage.setItem(storageKey(currentTask.id), JSON.stringify(state));
      setSaveStatus(message);
    } catch (_) {
      setSaveStatus('Browser storage is unavailable; this attempt will not persist after reload.');
    }
  };

  const schedulePersist = () => {
    setSaveStatus('Saving…');
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => persist(), 350);
  };

  const renderTimer = () => {
    const minutes = Math.floor(Math.max(0, state.remaining) / 60);
    const seconds = Math.max(0, state.remaining) % 60;
    els.timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    els.timer.setAttribute('aria-label', `${minutes} minutes ${seconds} seconds remaining`);
  };

  const stopTimer = () => {
    if (interval) window.clearInterval(interval);
    interval = null;
    els.start.disabled = false;
    els.pause.disabled = true;
  };

  const timerFinished = () => {
    stopTimer();
    state.remaining = 0;
    renderTimer();
    els.timerStatus.textContent = 'Time is up. Save your attempt, then review your response.';
    persist();
    els.save.focus();
  };

  const renderWordCount = () => {
    const count = wordCount(els.response.value);
    const threshold = currentTask.threshold;
    els.wordCount.textContent = `${count} word${count === 1 ? '' : 's'}`;
    els.wordMessage.textContent = count >= threshold
      ? `Reference threshold reached: ${threshold} words.`
      : `${threshold - count} more word${threshold - count === 1 ? '' : 's'} to reach the reference threshold.`;
    els.wordMessage.classList.toggle('is-ready', count >= threshold);
    els.wordMessage.classList.toggle('is-over', count > threshold + 80);
  };

  const renderPrompt = () => {
    currentTask = selectedTask();
    els.taskType.textContent = currentTask.label;
    els.promptTitle.textContent = currentTask.title;
    els.prompt.textContent = currentTask.prompt;
    els.threshold.textContent = `Reference threshold: ${currentTask.threshold} words.`;
    els.structure.innerHTML = currentTask.structure.map((item) => `<li>${item}</li>`).join('');
    els.checklist.innerHTML = reviewCriteria.map((criterion) => {
      const id = `writing-check-${currentTask.id}-${criterion.id}`;
      const description = currentTask.type === 'task1' ? criterion.task1 : criterion.task2;
      return `<li><label for="${id}"><input id="${id}" type="checkbox" data-writing-check value="${criterion.id}"> <span><strong>${criterion.name}</strong><br>${description}</span></label></li>`;
    }).join('');
    els.checklistCopy.innerHTML = currentTask.checklist.map((item) => `<li>${item}</li>`).join('');
  };

  const loadTask = ({ resetTimer = false, restoreDuration = false } = {}) => {
    stopTimer();
    renderPrompt();
    const saved = safeRead(storageKey(currentTask.id));
    if (restoreDuration && saved && [20, 40].includes(Number(saved.durationMinutes))) {
      els.durationSelect.value = String(saved.durationMinutes);
    }
    state = {
      remaining: durationSeconds(),
      modelOpen: false,
      checks: {},
      ...(saved || {})
    };
    if (
      resetTimer ||
      !saved ||
      Number(saved.durationMinutes) !== Number(els.durationSelect.value)
    ) state.remaining = durationSeconds();
    els.plan.value = state.plan || '';
    els.response.value = state.response || '';
    els.weakestSentence.value = state.weakestSentence || '';
    root.querySelectorAll('[data-writing-check]').forEach((input) => {
      input.checked = Boolean(state.checks && state.checks[input.value]);
    });
    els.modelPanel.hidden = !state.modelOpen;
    els.modelToggle.setAttribute('aria-expanded', String(Boolean(state.modelOpen)));
    els.modelToggle.textContent = state.modelOpen ? 'Hide structure and checklist' : 'Reveal structure and checklist';
    els.timerStatus.textContent = state.remaining === 0 ? 'Time is up. Save your attempt, then review your response.' : 'Timer ready.';
    renderTimer();
    renderWordCount();
    renderReviewSummary();
    setSaveStatus(saved ? 'Restored from this browser.' : 'Not saved yet. Your work will autosave locally.');
  };

  const renderReviewSummary = () => {
    const checked = root.querySelectorAll('[data-writing-check]:checked').length;
    els.reviewSummary.textContent = `${checked} of 4 criteria reviewed.`;
  };

  els.taskSelect.innerHTML = tasks.map((task) => `<option value="${task.id}">${task.label} — ${task.title}</option>`).join('');
  els.taskSelect.value = currentTask.id;
  loadTask({ restoreDuration: true });

  els.taskSelect.addEventListener('change', () => {
    persist('Previous attempt saved locally.');
    loadTask({ resetTimer: true });
  });

  els.durationSelect.addEventListener('change', () => {
    stopTimer();
    state.remaining = durationSeconds();
    renderTimer();
    els.timerStatus.textContent = `Timer set to ${els.durationSelect.value} minutes.`;
    persist('Timer preference saved locally.');
  });

  els.start.addEventListener('click', () => {
    if (interval || state.remaining <= 0) return;
    els.start.disabled = true;
    els.pause.disabled = false;
    els.timerStatus.textContent = 'Timer running.';
    interval = window.setInterval(() => {
      state.remaining -= 1;
      renderTimer();
      if (state.remaining <= 0) timerFinished();
      else if (state.remaining % 10 === 0) persist();
    }, 1000);
  });

  els.pause.addEventListener('click', () => {
    stopTimer();
    els.timerStatus.textContent = 'Timer paused.';
    persist();
  });

  els.resetTimer.addEventListener('click', () => {
    stopTimer();
    state.remaining = durationSeconds();
    renderTimer();
    els.timerStatus.textContent = 'Timer reset.';
    persist();
  });

  els.modelToggle.addEventListener('click', () => {
    const willOpen = els.modelPanel.hidden;
    els.modelPanel.hidden = !willOpen;
    els.modelToggle.setAttribute('aria-expanded', String(willOpen));
    els.modelToggle.textContent = willOpen ? 'Hide structure and checklist' : 'Reveal structure and checklist';
    persist();
    if (willOpen) els.modelPanel.focus();
  });

  els.response.addEventListener('input', () => {
    renderWordCount();
    schedulePersist();
  });

  [els.plan, els.weakestSentence].forEach((field) => field.addEventListener('input', schedulePersist));
  root.addEventListener('change', (event) => {
    if (event.target.matches('[data-writing-check]')) {
      renderReviewSummary();
      schedulePersist();
    }
  });

  els.save.addEventListener('click', () => persist('Attempt saved locally in this browser.'));

  els.resetAttempt.addEventListener('click', () => {
    if (!window.confirm('Reset this writing attempt? Your local plan, response and review notes will be removed.')) return;
    stopTimer();
    try { localStorage.removeItem(storageKey(currentTask.id)); } catch (_) { /* continue */ }
    loadTask();
    setSaveStatus('Attempt reset. Nothing from the previous attempt was submitted.');
  });

  window.addEventListener('pagehide', () => persist());
})();
