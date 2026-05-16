---
layout: single
title: "Leadership & Management for 21st Century Learners"
date: 2026-04-06T08:00:00Z
description: "Exploring leadership and management skills for 21st century learners through biological analogies."
categories:
  - leadership
  - human-behaviour
---
layout: single
description: "Exploring leadership and management skills for 21st century learners through biological analogies."
layout: biostatistics
description: "Understanding measures of dispersion in biological data."
layout: single
description: "Understanding polymorphism in Cnidaria and its adaptive significance."
layout: single
description: "Exploring coral reef types and formation."

<div class="synaptic-quiz-app">
  <div class="quiz-card">
    <div class="quiz-head">
      <h2 style="margin-top: 0; color: white;">ðŸ½ï¸ Digestive System Master Quiz</h2>
      <div class="quiz-timer" id="timer">â±ï¸ 15:00</div>
      <div class="quiz-progress"><div class="quiz-bar" id="bar"></div></div>
    </div>

    <div class="quiz-body" id="quizBody"></div>

    <div class="quiz-foot">
      <button class="quiz-submit-btn" onclick="submitQuiz()">Submit Quiz</button>
      <div class="quiz-score" id="score"></div>
    </div>
  </div>
</div>

<script>
const data = [
  {q:"à§§. à¦¨à¦¿à¦šà§‡à¦° à¦•à§‹à¦¨ à¦¤à¦¥à§à¦¯à¦Ÿà¦¿ à¦­à§à¦²?", o:["à¦®à¦¿à¦‰à¦•à¦¾à¦¸ â€“ à¦®à¦¿à¦‰à¦¸à¦¿à¦¨","à¦ªà§à¦¯à¦¾à¦°à¦¾à¦‡à¦Ÿà¦¾à¦² â€“ HCl","à¦ªà§‡à¦ªà¦Ÿà¦¿à¦• â€“ à¦ªà§‡à¦ªà¦¸à¦¿à¦¨","à¦†à¦°à§à¦œà§‡à¦¨à§à¦Ÿà¦¾à¦«à¦¾à¦‡à¦¨ â€“ à¦°à§‡à¦¨à¦¿à¦¨"], a:3, e:"à¦°à§‡à¦¨à¦¿à¦¨ à¦†à¦°à§à¦œà§‡à¦¨à§à¦Ÿà¦¾à¦«à¦¾à¦‡à¦¨ à¦•à§‹à¦· à¦¥à§‡à¦•à§‡ à¦¨à¦¯à¦¼"},
  {q:"à§¨. à¦•à§‡à¦¸à¦¿à¦¨ â†’ à¦ªà§à¦¯à¦¾à¦°à¦¾à¦•à§‡à¦¸à¦¿à¦¨ à¦à¦¨à¦œà¦¾à¦‡à¦®?", o:["à¦ªà§‡à¦ªà¦¸à¦¿à¦¨","à¦°à§‡à¦¨à¦¿à¦¨","à¦Ÿà§à¦°à¦¿à¦ªà¦¸à¦¿à¦¨","à¦•à¦¾à¦‡à¦®à§‹à¦Ÿà§à¦°à¦¿à¦ªà¦¸à¦¿à¦¨"], a:1, e:"à¦°à§‡à¦¨à¦¿à¦¨ à¦¦à§à¦§ à¦œà¦®à¦¾à¦Ÿ à¦¬à¦¾à¦à¦§à¦¾à¦¯à¦¼"},
  {q:"à§©. à¦—à¦²à¦¬à¦¿à¦²à§‡ à¦‰à¦¨à§à¦®à§à¦•à§à¦¤ à¦¨à¦¯à¦¼?", o:["à¦¶à§à¦¬à¦¾à¦¸à¦¨à¦¾à¦²à§€","à¦…à¦¨à§à¦¨à¦¨à¦¾à¦²à§€","à¦‡à¦‰à¦¸à§à¦Ÿà§‡à¦¶à¦¿à¦¯à¦¼à¦¾à¦¨","à¦‰à¦‡à¦°à§à¦¸à¦¾à¦‚ à¦¡à¦¾à¦•à§à¦Ÿ"], a:3, e:"à¦‰à¦‡à¦°à§à¦¸à¦¾à¦‚ à¦¡à¦¾à¦•à§à¦Ÿ à¦¡à¦¿à¦‰à¦¡à§‡à¦¨à¦¾à¦®à§‡ à¦–à§‹à¦²à§‡"},
  {q:"à§ª. à¦—à§à¦²à§à¦•à§‹à¦¨à¦¿à¦“à¦œà§‡à¦¨à§‡à¦¸à¦¿à¦¸ à¦‰à§Žà¦¸?", o:["à¦…à§à¦¯à¦¾à¦®à¦¿à¦¨à§‹ à¦à¦¸à¦¿à¦¡ + à¦—à§à¦²à¦¿à¦¸à¦¾à¦°à¦²","à¦«à§à¦¯à¦¾à¦Ÿà¦¿ à¦à¦¸à¦¿à¦¡","à¦—à§à¦²à¦¾à¦‡à¦•à§‹à¦œà§‡à¦¨","à¦¸à¦¬"], a:0, e:"à¦…à§à¦¯à¦¾à¦®à¦¿à¦¨à§‹ à¦à¦¸à¦¿à¦¡ à¦“ à¦—à§à¦²à¦¿à¦¸à¦¾à¦°à¦²"},
  {q:"à§«. à¦‰à¦‡à¦°à§à¦¸à¦¾à¦‚ à¦¡à¦¾à¦•à§à¦Ÿ à¦•à§‹à¦¥à¦¾à¦¯à¦¼?", o:["à¦…à¦—à§à¦¨à§à¦¯à¦¾à¦¶à¦¯à¦¼","à¦¯à¦•à§ƒà¦¤","à¦ªà¦¾à¦•à¦¸à§à¦¥à¦²à¦¿","à¦•à§‹à¦²à¦¨"], a:0, e:"à¦ªà§à¦¯à¦¾à¦¨à¦•à§à¦°à¦¿à¦¯à¦¼à¦¾à¦¸à§‡"},
  {q:"à§¬. à¦—à§à¦²à§à¦•à§‹à¦¨à¦¿à¦“à¦œà§‡à¦¨à§‡à¦¸à¦¿à¦¸à§‡ à¦‰à§Žà¦¸?", o:["à¦—à§à¦²à¦¾à¦‡à¦•à§‹à¦œà§‡à¦¨ à¦“ à¦…à§à¦¯à¦¾à¦®à¦¿à¦¨à§‹ à¦à¦¸à¦¿à¦¡","à¦—à§à¦²à¦¿à¦¸à¦¾à¦°à¦² à¦“ à¦«à§à¦¯à¦¾à¦Ÿà¦¿ à¦à¦¸à¦¿à¦¡","à¦«à§à¦¯à¦¾à¦Ÿà¦¿ à¦à¦¸à¦¿à¦¡ à¦“ à¦—à§à¦²à¦¾à¦‡à¦•à§‹à¦œà§‡à¦¨","à¦…à§à¦¯à¦¾à¦®à¦¿à¦¨à§‹ à¦à¦¸à¦¿à¦¡ à¦“ à¦—à§à¦²à¦¿à¦¸à¦¾à¦°à¦²"], a:3, e:"à¦…à§à¦¯à¦¾à¦®à¦¿à¦¨à§‹ à¦à¦¸à¦¿à¦¡ à¦“ à¦—à§à¦²à¦¿à¦¸à¦¾à¦°à¦²"},
  {q:"à§­. à¦¸à§à¦¨à§‡à¦¹à§‡à¦° à¦ªà§à¦°à¦§à¦¾à¦¨ à¦•à¦¾à¦œ?", o:["à¦¶à¦•à§à¦¤à¦¿ à¦‰à§Žà¦ªà¦¾à¦¦à¦¨","à¦•à§‹à¦· à¦†à¦¬à¦°à¦£","à¦¬à§ƒà¦¦à§à¦§à¦¿","à¦¸à§à¦¨à¦¾à¦¯à¦¼à§"], a:0, e:"à¦¶à¦•à§à¦¤à¦¿ à¦ªà§à¦°à¦§à¦¾à¦¨ à¦•à¦¾à¦œ"},
  {q:"à§®. à¦¸à§à¦¨à§‡à¦¹à§‡à¦° à¦ªà§à¦°à¦§à¦¾à¦¨ à¦­à§‚à¦®à¦¿à¦•à¦¾?", o:["à¦¶à¦•à§à¦¤à¦¿ à¦‰à§Žà¦ªà¦¾à¦¦à¦¨","à¦¬à§ƒà¦¦à§à¦§à¦¿","à¦¸à§à¦¨à¦¾à¦¯à¦¼à§","à¦•à§‹à¦· à¦à¦¿à¦²à§à¦²à¦¿"], a:3, e:"à¦•à§‹à¦· à¦à¦¿à¦²à§à¦²à¦¿ à¦—à¦ à¦¨"},
  {q:"à§¯. à¦ªà§à¦°à§‹à¦Ÿà¦¿à¦¨ à¦¹à¦œà¦® à¦•à¦°à§‡ à¦¨à¦¾?", o:["à¦ªà§à¦°à§‹à¦²à¦¿à¦¡à§‡à¦œ","à¦²à§à¦¯à¦¾à¦•à¦Ÿà§‡à¦œ","à¦‡à¦²à¦¾à¦¸à§à¦Ÿà§‡à¦œ","à¦•à§‹à¦²à¦¾à¦œà¦¿à¦¨à§‡à¦œ"], a:1, e:"à¦²à§à¦¯à¦¾à¦•à¦Ÿà§‡à¦œ à¦¶à¦°à§à¦•à¦°à¦¾ à¦­à¦¾à¦™à§‡"},
  {q:"à§§à§¦. à¦ªà¦¾à¦•à¦¸à§à¦¥à¦²à¦¿à¦° à¦¸à§à¦¤à¦°?", o:["à§¨","à§©","à§ª","à§«"], a:2, e:"à§ª à¦¸à§à¦¤à¦°"},
  {q:"à§§à§§. à¦¯à¦•à§ƒà¦¤à§‡à¦° à¦®à§à¦¯à¦¾à¦•à§à¦°à§‹à¦«à§‡à¦œ?", o:["à¦¸à¦¾à¦¬à¦®à¦¿à¦‰à¦•à§‹à¦¸à¦¾à¦²","à¦—à¦¾à¦®à¦¾","à¦•à¦¾à¦ªà¦«à¦¾à¦°","à¦®à¦¾à¦‡à¦•à§à¦°à§‹à¦—à§à¦²à¦¿à¦¯à¦¼à¦¾"], a:2, e:"à¦•à¦¾à¦ªà¦«à¦¾à¦° à¦•à§‹à¦·"},
  {q:"à§§à§¨. à¦¶à§‹à¦·à¦£ à¦ªà¦¦à§à¦§à¦¤à¦¿?", o:["i ii","i iii","ii iii","à¦¸à¦¬"], a:3, e:"à¦¸à¦¬à¦—à§à¦²à§‹"},
  {q:"à§§à§©. à¦…à¦®à§à¦²à§€à¦¯à¦¼ à¦ªà¦°à¦¿à¦¬à§‡à¦¶à§‡ à¦•à¦¾à¦œ à¦•à¦°à§‡?", o:["à¦Ÿà§à¦°à¦¿à¦ªà¦¸à¦¿à¦¨","à¦‡à¦°à§‡à¦ªà¦¸à¦¿à¦¨","à¦ªà§‡à¦ªà¦¸à¦¿à¦¨","à¦•à¦¾à¦‡à¦®à§‹à¦Ÿà§à¦°à¦¿à¦ªà¦¸à¦¿à¦¨"], a:2, e:"à¦ªà§‡à¦ªà¦¸à¦¿à¦¨"},
  {q:"à§§à§ª. à¦¯à¦•à§ƒà¦¤à§‡à¦° à¦®à§à¦¯à¦¾à¦•à§à¦°à§‹à¦«à§‡à¦œ à¦•à§‹à¦·?", o:["à¦¸à¦¾à¦¬à¦®à¦¿à¦‰à¦•à§‹à¦¸à¦¾à¦²","à¦—à¦¾à¦®à¦¾","à¦•à¦¾à¦ªà¦«à¦¾à¦°","à¦®à¦¾à¦‡à¦•à§à¦°à§‹à¦—à§à¦²à¦¿à¦¯à¦¼à¦¾"], a:2, e:"à¦•à¦¾à¦ªà¦«à¦¾à¦°"},
  {q:"à§§à§«. à¦ªà¦¿à¦¤à§à¦¤à¦°à¦¸ à¦•à§‹à¦¥à¦¾à¦¯à¦¼ à¦¤à§ˆà¦°à¦¿ à¦¹à¦¯à¦¼?", o:["à¦¯à¦•à§ƒà¦¤","à¦ªà¦¿à¦¤à§à¦¤à¦¥à¦²à¦¿","à¦…à¦—à§à¦¨à§à¦¯à¦¾à¦¶à¦¯à¦¼","à¦•à§à¦·à§à¦¦à§à¦°à¦¾à¦¨à§à¦¤"], a:0, e:"à¦¯à¦•à§ƒà¦¤"}
];

// Render Questions
const body = document.getElementById('quizBody');
data.forEach(item => {
  let div = document.createElement('div');
  div.className = 'q';
  div.dataset.a = item.a;
  div.innerHTML = `
    <div class="q-text" style="font-weight: bold; margin-bottom: 10px;">${item.q}</div>
    ${item.o.map(o => `<div class="opt">${o}</div>`).join('')}
    <div class="exp">âœ” ${item.e}</div>
  `;
  body.appendChild(div);
});

// Selection Logic
document.addEventListener('click', e => {
  if(!e.target.classList.contains('opt')) return;

  let q = e.target.closest('.q');
  if(q.classList.contains('done')) return;

  let opts = q.querySelectorAll('.opt');
  opts.forEach(o => o.classList.remove('selected'));

  e.target.classList.add('selected');
  q.dataset.sel = [...opts].indexOf(e.target);

  updateProgress();
});

// Progress Bar Logic
function updateProgress() {
  let done = [...document.querySelectorAll('.q')].filter(q => q.dataset.sel !== undefined).length;
  document.getElementById('bar').style.width = (done / data.length) * 100 + '%';
}

// Timer Logic
let time = 900; // 15 minutes
const timerEl = document.getElementById('timer');

const timer = setInterval(() => {
  let m = Math.floor(time / 60);
  let s = time % 60;
  timerEl.innerText = `â±ï¸ ${m}:${s.toString().padStart(2, '0')}`;
  
  if(time < 60) timerEl.classList.add('low');
  
  if(time-- <= 0) {
    clearInterval(timer);
    submitQuiz();
  }
}, 1000);

// Submission & Grading Logic
function submitQuiz() {
  clearInterval(timer);
  let score = 0;

  document.querySelectorAll('.q').forEach(q => {
    let c = +q.dataset.a;
    let s = +q.dataset.sel;
    let opts = q.querySelectorAll('.opt');

    if(s === c) {
      score++;
      q.classList.add('correct-q');
    } else {
      q.classList.add('wrong-q');
    }

    q.classList.add('done');
    if(opts[c]) opts[c].classList.add('correct-opt');
    if(s !== c && opts[s]) opts[s].classList.add('wrong-opt');
  });

  let percent = (score / data.length) * 100;
  let grade = percent >= 80 ? "A+ ðŸŽ¯" : percent >= 60 ? "A ðŸ‘" : percent >= 40 ? "B ðŸ™‚" : "Needs Review ðŸ”";

  let sc = document.getElementById('score');
  sc.innerHTML = `ðŸŽ¯ Score: ${score} / ${data.length}<br>ðŸ“Š ${percent.toFixed(1)}%<br>ðŸ† Grade: ${grade}`;
  sc.classList.add('show');
}
</script>
