---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "HSC Biology 2nd Paper 3rd Chapter MCQ"
date: 2026-04-26T11:48:00.009Z
categories:
  - MCQ
  - Zoology
---

<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet"/>

<style>
:root{
  --primary:#4facfe;
  --accent:#00f2fe;
  --success:#00c896;
  --danger:#ff4d6d;
  --glass:rgba(255,255,255,0.75);
}

*{box-sizing:border-box}

body{
  font-family:'Hind Siliguri',sans-serif;
  background:linear-gradient(135deg,#dfe9f3,#ffffff);
}

.quiz{max-width:800px;margin:30px auto}

.card{
  backdrop-filter:blur(16px);
  background:var(--glass);
  border-radius:20px;
  box-shadow:0 10px 40px rgba(0,0,0,0.1);
  overflow:hidden;
}

.head{
  padding:25px;
  text-align:center;
  background:linear-gradient(135deg,var(--primary),var(--accent));
  color:#fff;
}

.timer{font-weight:700;font-size:1.3rem;margin-top:10px}
.timer.low{color:#ffe066}

.progress{height:8px;background:rgba(255,255,255,.3);border-radius:20px;margin-top:15px;overflow:hidden}
.bar{height:100%;width:0;background:#fff;transition:.3s}

.body{padding:20px}

.q{
  background:#fff;
  border-radius:14px;
  padding:15px;
  margin-bottom:15px;
  border-left:5px solid transparent;
  transition:.3s;
}
.q.correct{border-color:var(--success);background:#ecfff7}
.q.wrong{border-color:var(--danger);background:#fff0f3}

.opt{
  padding:10px;
  border:2px solid #ddd;
  border-radius:10px;
  margin:6px 0;
  cursor:pointer;
  transition:.2s;
}
.opt:hover{border-color:var(--primary)}
.opt.selected{background:#eef7ff;border-color:var(--primary)}
.opt.correct{background:#d4fff1;border-color:var(--success)}
.opt.wrong{background:#ffd6de;border-color:var(--danger)}

.exp{
  display:none;
  margin-top:10px;
  padding:10px;
  background:#f6f6f6;
  border-radius:8px;
  font-size:.9rem;
}
.q.done .exp{display:block}

.foot{text-align:center;padding:20px}

button{
  padding:12px 28px;
  border:none;
  border-radius:30px;
  background:linear-gradient(135deg,var(--primary),var(--accent));
  color:#fff;
  font-weight:700;
  cursor:pointer;
}

.score{
  margin-top:15px;
  padding:15px;
  border-radius:12px;
  display:none;
}
.score.show{display:block;animation:fade .5s}

@keyframes fade{
  from{opacity:0;transform:translateY(10px)}
  to{opacity:1;transform:translateY(0)}
}
</style>

<div class="quiz">
<div class="card">

<div class="head">
<h2>🍽️ Digestive System Master Quiz</h2>
<div class="timer" id="timer">⏱️ 15:00</div>
<div class="progress"><div class="bar" id="bar"></div></div>
</div>

<div class="body" id="quizBody"></div>

<div class="foot">
<button onclick="submitQuiz()">Submit Quiz</button>
<div class="score" id="score"></div>
</div>

</div>
</div>

<script>
const data = [
{q:"১. নিচের কোন তথ্যটি ভুল?",o:["মিউকাস – মিউসিন","প্যারাইটাল – HCl","পেপটিক – পেপসিন","আর্জেন্টাফাইন – রেনিন"],a:3,e:"রেনিন আর্জেন্টাফাইন কোষ থেকে নয়"},
{q:"২. কেসিন → প্যারাকেসিন এনজাইম?",o:["পেপসিন","রেনিন","ট্রিপসিন","কাইমোট্রিপসিন"],a:1,e:"রেনিন দুধ জমাট বাঁধায়"},
{q:"৩. গলবিলে উন্মুক্ত নয়?",o:["শ্বাসনালী","অন্ননালী","ইউস্টেশিয়ান","উইর্সাং ডাক্ট"],a:3,e:"উইর্সাং ডাক্ট ডিউডেনামে খোলে"},
{q:"৪. গ্লুকোনিওজেনেসিস উৎস?",o:["অ্যামিনো এসিড + গ্লিসারল","ফ্যাটি এসিড","গ্লাইকোজেন","সব"],a:0,e:"অ্যামিনো এসিড ও গ্লিসারল"},
{q:"৫. উইর্সাং ডাক্ট কোথায়?",o:["অগ্ন্যাশয়","যকৃত","পাকস্থলি","কোলন"],a:0,e:"প্যানক্রিয়াসে"},
{q:"৬. গ্লুকোনিওজেনেসিসে উৎস?",o:["গ্লাইকোজেন ও অ্যামিনো এসিড","গ্লিসারল ও ফ্যাটি এসিড","ফ্যাটি এসিড ও গ্লাইকোজেন","অ্যামিনো এসিড ও গ্লিসারল"],a:3,e:"অ্যামিনো এসিড ও গ্লিসারল"},
{q:"৭. স্নেহের প্রধান কাজ?",o:["শক্তি উৎপাদন","কোষ আবরণ","বৃদ্ধি","স্নায়ু"],a:0,e:"শক্তি প্রধান কাজ"},
{q:"৮. স্নেহের প্রধান ভূমিকা?",o:["শক্তি উৎপাদন","বৃদ্ধি","স্নায়ু","কোষ ঝিল্লি"],a:3,e:"কোষ ঝিল্লি গঠন"},
{q:"৯. প্রোটিন হজম করে না?",o:["প্রোলিডেজ","ল্যাকটেজ","ইলাস্টেজ","কোলাজিনেজ"],a:1,e:"ল্যাকটেজ শর্করা ভাঙে"},
{q:"১০. পাকস্থলির স্তর?",o:["২","৩","৪","৫"],a:2,e:"৪ স্তর"},
{q:"১১. যকৃতের ম্যাক্রোফেজ?",o:["সাবমিউকোসাল","গামা","কাপফার","মাইক্রোগ্লিয়া"],a:2,e:"কাপফার কোষ"},
{q:"১২. শোষণ পদ্ধতি?",o:["i ii","i iii","ii iii","সব"],a:3,e:"সবগুলো"},
{q:"১৩. অম্লীয় পরিবেশে কাজ করে?",o:["ট্রিপসিন","ইরেপসিন","পেপসিন","কাইমোট্রিপসিন"],a:2,e:"পেপসিন"},
{q:"১৪. যকৃতের ম্যাক্রোফেজ কোষ?",o:["সাবমিউকোসাল","গামা","কাপফার","মাইক্রোগ্লিয়া"],a:2,e:"কাপফার"},
{q:"১৫. পিত্তরস কোথায় তৈরি হয়?",o:["যকৃত","পিত্তথলি","অগ্ন্যাশয়","ক্ষুদ্রান্ত"],a:0,e:"যকৃত"}
];

// Render
const body = document.getElementById('quizBody');
data.forEach(item=>{
let div=document.createElement('div');
div.className='q';
div.dataset.a=item.a;
div.innerHTML=`
<div class="q-text">${item.q}</div>
${item.o.map(o=>`<div class="opt">${o}</div>`).join('')}
<div class="exp">✔ ${item.e}</div>
`;
body.appendChild(div);
});

// Select
document.addEventListener('click',e=>{
if(!e.target.classList.contains('opt')) return;

let q=e.target.closest('.q');
if(q.classList.contains('done')) return;

let opts=q.querySelectorAll('.opt');
opts.forEach(o=>o.classList.remove('selected'));

e.target.classList.add('selected');
q.dataset.sel=[...opts].indexOf(e.target);

updateProgress();
});

function updateProgress(){
let done=[...document.querySelectorAll('.q')].filter(q=>q.dataset.sel!==undefined).length;
bar.style.width=(done/data.length)*100+'%';
}

// Timer
let time=900;
const timerEl=document.getElementById('timer');

const timer=setInterval(()=>{
let m=Math.floor(time/60);
let s=time%60;
timerEl.innerText=`⏱️ ${m}:${s.toString().padStart(2,'0')}`;
if(time<60) timerEl.classList.add('low');
if(time--<=0){clearInterval(timer);submitQuiz();}
},1000);

// Submit
function submitQuiz(){
clearInterval(timer);

let score=0;

document.querySelectorAll('.q').forEach(q=>{
let c=+q.dataset.a;
let s=+q.dataset.sel;
let opts=q.querySelectorAll('.opt');

if(s===c){score++;q.classList.add('correct')}
else{q.classList.add('wrong')}

q.classList.add('done');
opts[c].classList.add('correct');
if(s!==c && opts[s]) opts[s].classList.add('wrong');
});

let percent=(score/data.length)*100;
let grade=percent>=80?"A+ 🎯":percent>=60?"A 👍":percent>=40?"B 🙂":"Improve 🔁";

let sc=document.getElementById('score');
sc.innerHTML=`🎯 Score: ${score}/${data.length}<br>📊 ${percent.toFixed(1)}%<br>🏆 Grade: ${grade}`;
sc.classList.add('show');
}
</script>