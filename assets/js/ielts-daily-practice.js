(() => {
  const root = document.querySelector('[data-ielts-daily-practice]');
  if (!root) return;

  const SESSION_SECONDS = 20 * 60;
  const STORAGE_PREFIX = 'lbfl-ielts-daily-practice:';
  const anchor = new Date(2026, 7, 10); // 10 Aug 2026 = Writing in the LBFL rotation.

  const sessions = [
    {
      skill: 'Listening',
      focus: 'Main idea, supporting detail and signal words',
      taskTitle: 'Focused listening notes',
      task: '<p>Use a short academic-English audio source you already have access to. Listen once and record: the topic, the main message, three supporting points, one example, and two transition or signal expressions.</p>',
      review: '<ul><li>I identified the main message rather than isolated keywords.</li><li>I recorded at least three accurate supporting points.</li><li>I distinguished examples from the speaker\'s main claims.</li><li>I noticed signal words such as <em>however</em>, <em>therefore</em>, or <em>in contrast</em>.</li><li>My notes are concise enough to support a 90–110 word summary.</li></ul>',
      vocabulary: ['main message', 'supporting detail', 'transition', 'paraphrase', 'inference', 'summary'],
      followup: '<p>Write a 3-sentence summary using one contrast connector and one cause-effect connector.</p>'
    },
    {
      skill: 'Reading',
      focus: 'Skimming, evidence and inference',
      taskTitle: 'Evidence-first reading',
      task: '<p>Read one short academic passage. In your notes, write the main idea in one sentence, identify three supporting details, and record one statement that is clearly supported, one that is contradicted, and one that is not stated.</p>',
      review: '<ul><li>I separated the main idea from examples.</li><li>I located textual evidence before deciding an answer.</li><li>I did not treat a plausible inference as stated fact.</li><li>I distinguished contradiction from missing information.</li><li>I paraphrased the passage rather than copying long phrases.</li></ul>',
      vocabulary: ['evidence', 'inference', 'contradict', 'explicit', 'implicit', 'paraphrase'],
      followup: '<p>Choose one paragraph and reduce it to a 12–18 word gist statement without copying a full phrase from the text.</p>'
    },
    {
      skill: 'Writing',
      focus: 'Task response, coherence and precise development',
      taskTitle: 'Band 8 paragraph drill',
      task: '<p>Write one 120–160 word body paragraph responding to this question: <strong>Some people think universities should focus mainly on academic knowledge, while others believe practical skills are equally important. Discuss one side and explain why.</strong></p>',
      review: '<ul><li>The paragraph has one clear controlling idea.</li><li>The explanation develops that idea rather than listing points.</li><li>An example or consequence is relevant and specific.</li><li>Linking is natural rather than mechanical.</li><li>Vocabulary is precise and not unnecessarily complex.</li><li>Sentence structures vary while remaining accurate.</li></ul>',
      vocabulary: ['curriculum', 'practical competence', 'academic foundation', 'transferable skills', 'coherent', 'well-developed'],
      followup: '<p>Rewrite your weakest sentence in two different grammatical structures without changing its meaning.</p>'
    },
    {
      skill: 'Speaking',
      focus: 'Fluency, development and lexical flexibility',
      taskTitle: 'Part 2 mini-simulation',
      task: '<p>Prepare for one minute, then speak for up to two minutes on: <strong>Describe a skill that has been useful in your education or work.</strong> Cover what the skill is, how you learned it, how you use it, and why it matters to you.</p>',
      review: '<ul><li>I spoke continuously without overusing fillers.</li><li>I developed each point with a reason, example, or consequence.</li><li>I paraphrased when I could not recall an exact word.</li><li>I used a mix of simple and complex structures.</li><li>My pronunciation and stress made key ideas easy to follow.</li></ul>',
      vocabulary: ['proficiency', 'adaptability', 'develop', 'apply', 'effective', 'confidence'],
      followup: '<p>Answer this Part 3 question in 4–6 sentences: Should schools explicitly teach transferable skills? Give a reason and one example.</p>'
    }
  ];

  const els = {
    skill: root.querySelector('[data-practice-skill]'),
    focus: root.querySelector('[data-practice-focus]'),
    timer: root.querySelector('[data-practice-timer]'),
    start: root.querySelector('[data-timer-start]'),
    pause: root.querySelector('[data-timer-pause]'),
    reset: root.querySelector('[data-timer-reset]'),
    taskTitle: root.querySelector('[data-practice-task-title]'),
    task: root.querySelector('[data-practice-task]'),
    answer: root.querySelector('[data-practice-answer]'),
    reviewToggle: root.querySelector('[data-review-toggle]'),
    review: root.querySelector('[data-practice-review]'),
    vocabulary: root.querySelector('[data-practice-vocabulary]'),
    followup: root.querySelector('[data-practice-followup]'),
    reflection: root.querySelector('[data-practice-reflection]'),
    saveStatus: root.querySelector('[data-save-status]')
  };

  const today = new Date();
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dayOffset = Math.floor((localToday - anchor) / 86400000);
  const sessionIndex = ((2 + dayOffset) % sessions.length + sessions.length) % sessions.length;
  const session = sessions[sessionIndex];
  const dateKey = `${localToday.getFullYear()}-${String(localToday.getMonth() + 1).padStart(2, '0')}-${String(localToday.getDate()).padStart(2, '0')}`;
  const storageKey = `${STORAGE_PREFIX}${dateKey}:${session.skill.toLowerCase()}`;

  let state = {
    remaining: SESSION_SECONDS,
    answer: '',
    reflection: '',
    reviewOpen: false
  };
  let interval = null;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') state = { ...state, ...saved };
  } catch (_) {
    // Continue without persistence if storage is unavailable or malformed.
  }

  const persist = () => {
    state.answer = els.answer.value;
    state.reflection = els.reflection.value;
    state.reviewOpen = !els.review.hidden;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      els.saveStatus.textContent = 'Saved locally in this browser.';
    } catch (_) {
      els.saveStatus.textContent = 'Browser storage is unavailable; this session will not persist after reload.';
    }
  };

  const renderTimer = () => {
    const minutes = Math.floor(state.remaining / 60);
    const seconds = state.remaining % 60;
    els.timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const stopTimer = () => {
    if (interval) window.clearInterval(interval);
    interval = null;
    els.start.disabled = false;
    els.pause.disabled = true;
  };

  const completeTimer = () => {
    stopTimer();
    state.remaining = 0;
    renderTimer();
    persist();
    els.reviewToggle.focus();
  };

  els.skill.textContent = session.skill;
  els.focus.textContent = session.focus;
  els.taskTitle.textContent = session.taskTitle;
  els.task.innerHTML = session.task;
  els.review.innerHTML = session.review;
  els.vocabulary.innerHTML = session.vocabulary.map((item) => `<li>${item}</li>`).join('');
  els.followup.innerHTML = session.followup;
  els.answer.value = state.answer || '';
  els.reflection.value = state.reflection || '';
  els.review.hidden = !state.reviewOpen;
  els.reviewToggle.setAttribute('aria-expanded', state.reviewOpen ? 'true' : 'false');
  els.reviewToggle.textContent = state.reviewOpen ? 'Hide review' : 'Reveal review';
  renderTimer();

  els.start.addEventListener('click', () => {
    if (interval || state.remaining <= 0) return;
    els.start.disabled = true;
    els.pause.disabled = false;
    interval = window.setInterval(() => {
      state.remaining -= 1;
      if (state.remaining <= 0) {
        completeTimer();
        return;
      }
      renderTimer();
      if (state.remaining % 5 === 0) persist();
    }, 1000);
  });

  els.pause.addEventListener('click', () => {
    stopTimer();
    persist();
  });

  els.reset.addEventListener('click', () => {
    stopTimer();
    state.remaining = SESSION_SECONDS;
    renderTimer();
    persist();
  });

  els.reviewToggle.addEventListener('click', () => {
    const willOpen = els.review.hidden;
    els.review.hidden = !willOpen;
    els.reviewToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    els.reviewToggle.textContent = willOpen ? 'Hide review' : 'Reveal review';
    persist();
  });

  let saveTimer;
  [els.answer, els.reflection].forEach((field) => {
    field.addEventListener('input', () => {
      els.saveStatus.textContent = 'Saving…';
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(persist, 300);
    });
  });

  window.addEventListener('pagehide', persist);
})();
