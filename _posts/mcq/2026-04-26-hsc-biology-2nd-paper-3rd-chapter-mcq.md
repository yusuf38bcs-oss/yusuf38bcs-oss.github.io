layout: single
description: "HSC Biology 2nd Paper Chapter 3 MCQ practice with detailed explanations."
title: "HSC Biology 2nd Paper 3rd Chapter MCQ"
date: 2026-04-26T11:48:00.009Z
categories:
  - mcq
  - zoology

<div class="synaptic-quiz-app">
  <div class="quiz-card">
    <div class="quiz-head">
      <h2 style="margin-top: 0; color: white;">🍽️ Digestive System Master Quiz</h2>
      <div class="quiz-timer" id="timer">⏱️ 15:00</div>
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
  {q:"১. নিচের কোন তথ্যটি ভুল?", o:["মিউকাস – মিউসিন","প্যারাইটাল – HCl","পেপটিক – পেপসিন","আর্জেন্টাফাইন – রেনিন"], a:3, e:"রেনিন আর্জেন্টাফাইন কোষ থেকে নয়"},
  {q:"২. কেসিন → প্যারাকেসিন এনজাইম?", o:["পেপসিন","রেনিন","ট্রিপসিন","কাইমোট্রিপসিন"], a:1, e:"রেনিন দুধ জমাট বাঁধায়"},
  {q:"৩. গলবিলে উন্মুক্ত নয়?", o:["শ্বাসনালী","অন্ননালী","ইউস্টেশিয়ান","উইর্সাং ডাক্ট"], a:3, e:"উইর্সাং ডাক্ট ডিউডেনামে খোলে"},
  {q:"৪. গ্লুকোনিওজেনেসিস উৎস?", o:["অ্যামিনো এসিড + গ্লিসারল","ফ্যাটি এসিড","গ্লাইকোজেন","সব"], a:0, e:"অ্যামিনো এসিড ও গ্লিসারল"},
  {q:"৫. উইর্সাং ডাক্ট কোথায়?", o:["অগ্ন্যাশয়","যকৃত","পাকস্থলি","কোলন"], a:0, e:"প্যানক্রিয়াসে"},
  {q:"৬. গ্লুকোনিওজেনেসিসে উৎস?", o:["গ্লাইকোজেন ও অ্যামিনো এসিড","গ্লিসারল ও ফ্যাটি এসিড","ফ্যাটি এসিড ও গ্লাইকোজেন","অ্যামিনো এসিড ও গ্লিসারল"], a:3, e:"অ্যামিনো এসিড ও গ্লিসারল"},
  {q:"৭. স্নেহের প্রধান কাজ?", o:["শক্তি উৎপাদন","কোষ আবরণ","বৃদ্ধি","স্নায়ু"], a:0, e:"শক্তি প্রধান কাজ"},
  {q:"৮. স্নেহের প্রধান ভূমিকা?", o:["শক্তি উৎপাদন","বৃদ্ধি","স্নায়ু","কোষ ঝিল্লি"], a:3, e:"কোষ ঝিল্লি গঠন"},
  {q:"৯. প্রোটিন হজম করে না?", o:["প্রোলিডেজ","ল্যাকটেজ","ইলাস্টেজ","কোলাজিনেজ"], a:1, e:"ল্যাকটেজ শর্করা ভাঙে"},
  {q:"১০. পাকস্থলির স্তর?", o:["২","৩","৪","৫"], a:2, e:"৪ স্তর"},
  {q:"১১. যকৃতের ম্যাক্রোফেজ?", o:["সাবমিউকোসাল","গামা","কাপফার","মাইক্রোগ্লিয়া"], a:2, e:"কাপফার কোষ"},
  {q:"১২. শোষণ পদ্ধতি?", o:["i ii","i iii","ii iii","সব"], a:3, e:"সবগুলো"},
  {q:"১৩. অম্লীয় পরিবেশে কাজ করে?", o:["ট্রিপসিন","ইরেপসিন","পেপসিন","কাইমোট্রিপসিন"], a:2, e:"পেপসিন"},
  {q:"১৪. যকৃতের ম্যাক্রোফেজ কোষ?", o:["সাবমিউকোসাল","গামা","কাপফার","মাইক্রোগ্লিয়া"], a:2, e:"কাপফার"},
  {q:"১৫. পিত্তরস কোথায় তৈরি হয়?", o:["যকৃত","পিত্তথলি","অগ্ন্যাশয়","ক্ষুদ্রান্ত"], a:0, e:"যকৃত"}
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
    <div class="exp">✔ ${item.e}</div>
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
  timerEl.innerText = `⏱️ ${m}:${s.toString().padStart(2, '0')}`;
  
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
  let grade = percent >= 80 ? "A+ 🎯" : percent >= 60 ? "A 👍" : percent >= 40 ? "B 🙂" : "Needs Review 🔁";

  let sc = document.getElementById('score');
  sc.innerHTML = `🎯 Score: ${score} / ${data.length}<br>📊 ${percent.toFixed(1)}%<br>🏆 Grade: ${grade}`;
  sc.classList.add('show');
}
</script>
