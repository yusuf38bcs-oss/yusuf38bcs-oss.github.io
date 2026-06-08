---
layout: single
author_profile: true
author: "MD. Yusuf"

sidebar:
  nav: "synaptic_nav"

title: "Zoology Pro Quiz: Chordata & Arthropoda"
excerpt: "Challenge your neural pathways with a rapid-fire assessment on structural morphology, reproduction, and taxonomy."

date: 2026-05-04T19:14:00.000Z
last_modified_at: 2026-06-09T04:13:27.000Z

permalink: /mcq-arena/academic/zoology-chordata-arthropoda-mcq-pro/

categories:
  - MCQ
  - Academic
  - Zoology

tags:
  - Animal Diversity
  - Chordata
  - Arthropoda

node_id: mcq-academic-zoology-pro
parent_node: academic
network:
  - mcq-arena

related: true
synaptic_links:
  - /biology/hsc-corner/zoology/

toc: false
classes: wide

header:
  overlay_image: /assets/images/biology/zoology-banner.webp
---

<style>
:root {
  --q-primary: #00d4b2;
  --q-primary-soft: #14b8a6;
  --q-bg: #090d16;
  --q-card: #0f172a;
  --q-card-hover: #131c2e;
  --q-success: #10b981;
  --q-danger: #ef4444;
  --q-text: #cbd5e1;
}

.neural-quiz-wrapper { max-width: 800px; margin: 2rem auto; font-family: 'Inter', 'Tiro Bangla', sans-serif; color: var(--q-text); }
.quiz-card { background: var(--q-card); border-radius: 16px; border: 1px solid rgba(0, 212, 178, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.4); overflow: hidden; }

.quiz-header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 25px; text-align: center; border-bottom: 1px solid rgba(0, 212, 178, 0.2); position: relative; }
.quiz-header h2 { color: #ffffff; margin: 0 0 10px 0; font-size: 1.8rem; font-weight: 800; }
.quiz-timer { display: inline-block; font-family: monospace; font-size: 1.2rem; font-weight: bold; color: var(--q-primary); background: rgba(0, 212, 178, 0.1); padding: 5px 15px; border-radius: 20px; border: 1px solid rgba(0, 212, 178, 0.2); }

.progress-wrap { background: rgba(255,255,255,0.05); height: 8px; border-radius: 10px; margin-top: 20px; overflow: hidden; }
.progress-bar { height: 100%; width: 0; background: var(--q-primary); transition: width 0.4s ease; box-shadow: 0 0 10px var(--q-primary); }
.progress-text { font-size: 0.85rem; margin-top: 8px; color: #94a3b8; }

.quiz-body { padding: 30px; }
.q { background: var(--q-card-hover); border-left: 4px solid var(--q-primary); padding: 20px; border-radius: 12px; margin-bottom: 20px; transition: 0.3s; border-top: 1px solid rgba(255,255,255,0.02); border-right: 1px solid rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.02); }
.q.correct { border-color: var(--q-success); background: rgba(16, 185, 129, 0.05); }
.q.wrong { border-color: var(--q-danger); background: rgba(239, 68, 68, 0.05); }

.q-text { font-weight: 700; font-size: 1.15rem; color: #ffffff; margin-bottom: 15px; }
.opts { display: flex; flex-direction: column; gap: 10px; }
.opt { padding: 12px 15px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; transition: 0.2s; background: rgba(0,0,0,0.2); }
.opt:hover { border-color: var(--q-primary); background: rgba(0, 212, 178, 0.05); }
.opt.selected { border-color: var(--q-primary); background: rgba(0, 212, 178, 0.1); }
.opt.correct { border-color: var(--q-success); background: rgba(16, 185, 129, 0.15); color: #10b981; font-weight: bold; }
.opt.wrong { border-color: var(--q-danger); background: rgba(239, 68, 68, 0.15); color: #ef4444; text-decoration: line-through; }

.exp { display: none; margin-top: 15px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 6px; font-size: 0.95rem; border-left: 3px solid var(--q-success); color: #34d399; }
.q.done .exp { display: block; animation: fadeIn 0.5s ease; }

.quiz-foot { text-align: center; padding: 25px; border-top: 1px solid rgba(255,255,255,0.05); background: #0b1324; }
.btn-submit { background: var(--q-primary); color: #090d16; border: none; padding: 12px 35px; border-radius: 30px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(0, 212, 178, 0.3); }
.btn-submit:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 212, 178, 0.5); }
.btn-restart { background: transparent; color: var(--q-text); border: 1px solid rgba(255,255,255,0.2); padding: 12px 25px; border-radius: 30px; margin-left: 10px; cursor: pointer; transition: 0.3s; }
.btn-restart:hover { background: rgba(255,255,255,0.05); }

.score-board { display: none; margin-top: 25px; padding: 20px; border-radius: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid var(--q-success); text-align: center; }
.score-board.show { display: block; animation: slideUp 0.5s ease; }
.score-text { font-size: 2rem; font-weight: 800; color: #10b981; margin: 10px 0; }

@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>

<div class="neural-quiz-wrapper">
  <div class="quiz-card">
    <div class="quiz-header">
      <h2>🦈 Zoology Pro: Chordata & Arthropoda</h2>
      <div class="quiz-timer" id="timer5">⏱️ 15:00</div>
      <div class="progress-wrap">
        <div class="progress-bar" id="progressBar5"></div>
      </div>
      <div class="progress-text" id="progressText5">Question 1 of 10</div>
    </div>

    <div class="quiz-body" id="jsQuizBody">
      </div>

    <div class="quiz-foot">
      <button class="btn-restart" onclick="prevJSQ()" id="prevBtn" style="display:none;">← Prev</button>
      <button class="btn-submit" onclick="nextJSQ()" id="nextBtn">Next →</button>
      <div class="score-board" id="scoreBoard5"></div>
    </div>
  </div>
</div>

<script>
const quizData = [
  {q:"Scoliodon (হাঙ্গর)-এর আঁইশ কোন ধরনের?",o:["Cycloid","Placoid","Ganoid","Ctenoid"],a:1},
  {q:"হাঙ্গরের ফুলকারন্ধ্র (Gill slit) সংখ্যা কত?",o:["৪ জোড়া","৫ থেকে ৭ জোড়া","৬ জোড়া","৩ জোড়া"],a:1},
  {q:"হাঙ্গরের পুচ্ছ পাখনা (Caudal fin) কোন প্রকৃতির?",o:["Homocercal","Heterocercal"],a:1},
  {q:"স্ক্রল কপাটিকা (Scroll valve) কার অন্ত্রে থাকে?",o:["Labeo (রুই)","Scoliodon (হাঙ্গর)"],a:1},
  {q:"Labeo rohita (রুই মাছ)-এর মুখছিদ্র কোথায় অবস্থিত?",o:["Terminal","Sub-terminal"],a:1},
  {q:"রুই মাছের পুচ্ছ পাখনা (Caudal fin) কোন প্রকৃতির?",o:["Heterocercal","Homocercal"],a:1},
  {q:"Pila globosa (আপেল শামুক) কোন পর্বের প্রাণী?",o:["Mollusca","Arthropoda"],a:0},
  {q:"আপেল শামুকের খোলস (Shell) প্রধানত কী দ্বারা গঠিত?",o:["Calcium Carbonate (CaCO3)","Chitin"],a:0},
  {q:"তেলাপোকার রেচন অঙ্গের নাম কী?",o:["Malpighian Tubules","Green Gland"],a:0},
  {q:"তেলাপোকার রূপান্তর কোন ধরনের?",o:["সম্পূর্ণ (Egg→Larva→Pupa→Adult)","অসম্পূর্ণ (Egg→Nymph→Adult)"],a:1}
];

let currentJS = 0;
let answersJS = {};
let timeJS = 900;
let timerJS = null;

function renderJSQ() {
  const container = document.getElementById("jsQuizBody");
  let q = quizData[currentJS];
  
  let html = <div class="q-text">\. \</div><div class="opts">;
  q.o.forEach((opt, i) => {
    let selClass = answersJS[currentJS] === i ? "selected" : "";
    html += <div class="opt \" onclick="selectJS(\)">\</div>;
  });
  html += </div>;
  
  container.innerHTML = html;
  
  document.getElementById("progressBar5").style.width = ((currentJS + 1) / quizData.length * 100) + "%";
  document.getElementById("progressText5").innerText = Question \ of \;
  
  document.getElementById("prevBtn").style.display = currentJS > 0 ? "inline-block" : "none";
  document.getElementById("nextBtn").innerText = currentJS === quizData.length - 1 ? "Submit Assessment" : "Next →";
}

function selectJS(i) {
  answersJS[currentJS] = i;
  renderJSQ();
}

function nextJSQ() {
  if (currentJS < quizData.length - 1) {
    currentJS++;
    renderJSQ();
  } else {
    submitJSQuiz();
  }
}

function prevJSQ() {
  if (currentJS > 0) {
    currentJS--;
    renderJSQ();
  }
}

function submitJSQuiz() {
  clearInterval(timerJS);
  let score = 0;
  quizData.forEach((q, i) => {
    if (answersJS[i] === q.a) score++;
  });
  
  document.getElementById("jsQuizBody").style.display = "none";
  document.getElementById("prevBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "none";
  
  let p = (score / quizData.length) * 100;
  let sc = document.getElementById("scoreBoard5");
  sc.innerHTML = <div>Diagnostic Complete</div><div class="score-text">\ / \</div><div style="color:#94a3b8">Accuracy: \%</div><br><button class="btn-restart" onclick="location.reload()">Restart</button>;
  sc.classList.add('show');
}

document.addEventListener("DOMContentLoaded", () => {
  renderJSQ();
  timerJS = setInterval(() => {
    let m = Math.floor(timeJS / 60);
    let s = timeJS % 60;
    document.getElementById("timer5").innerHTML = ⏱️ \:\;
    timeJS--;
    if (timeJS < 0) submitJSQuiz();
  }, 1000);
});
</script>
