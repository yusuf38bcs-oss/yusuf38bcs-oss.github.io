---

layout: single
author_profile: true
author: "MD. Yusuf"

sidebar:
  nav: "synaptic_nav"

title: "HSC Biology 2nd Paper: Animal Diversity MCQ"
excerpt: "Test your mastery of the animal kingdom, taxonomy, symmetry, and phylum characteristics in this interactive Socratic node."

date: 2026-04-06T07:53:00.000Z
last_modified_at: 2026-06-09T04:13:27.000Z

permalink: /mcq-arena/academic/zoology-animal-diversity-mcq-1/

categories:
  - MCQ
  - Academic
  - Zoology

tags:
  - Animal Diversity
  - Taxonomy
  - HSC Biology

node_id: mcq-academic-animal-diversity-1
parent_node: academic
network:
  - mcq-arena

related: true
synaptic_links:
  - /biology/hsc-corner/zoology/
  - /biology/higher-zoology-tree/animal-diversity/

toc: false
classes: wide

header:
  overlay_image: /assets/images/biology/zoology-banner.webp
language: en
curriculum_tracks:
  - HSC Zoology
  - NEET Biology
  - IB Biology
neet_alignment: "NCERT Biology: Animal Kingdom"
ib_theme: "Diversity"
ib_subtopic: "Animal diversity MCQ assessment"
hsc_alignment: "HSC Zoology: animal diversity and classification"
concept_level: "Assessment"
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
      <h2>🦁 প্রাণী বৈচিত্র্য ও শ্রেণিবিন্যাস কুইজ</h2>
      <div class="quiz-timer" id="timer1">⏱️ 15:00</div>
      <div class="progress-wrap">
        <div class="progress-bar" id="progressBar1"></div>
      </div>
      <div class="progress-text" id="progressText1">0 / 10 Answered</div>
    </div>

    <div class="quiz-body" id="quizBody1">
      <div class="q" data-a="2">
        <div class="q-text">১. Protostomia এর কোনটি সত্য নয়?</div>
        <div class="opts">
          <div class="opt">ক) প্রথমে মুখছিদ্র দেখা যায়</div>
          <div class="opt">খ) ভ্রূণীয় পরিস্ফুটন নির্দিষ্ট প্রকৃতির</div>
          <div class="opt">গ) ক্লিভেজ অরীয়</div>
          <div class="opt">ঘ) অমেরুদণ্ডী পর্বের প্রাণীদের ক্ষেত্রে পরিলক্ষিত হয়</div>
        </div>
        <div class="exp">✔ সঠিক: গ) ক্লিভেজ অরীয় (প্রোস্টোমিয়াতে ক্লিভেজ সর্পিলাকার হয়)।</div>
      </div>

      <div class="q" data-a="2">
        <div class="q-text">২. কোন পর্বের প্রাণীদের ক্লিভেজ সর্পিলাকার?</div>
        <div class="opts">
          <div class="opt">ক) Porifera</div>
          <div class="opt">খ) Arthropoda</div>
          <div class="opt">গ) Annelida</div>
          <div class="opt">ঘ) Echinodermata</div>
        </div>
        <div class="exp">✔ সঠিক: গ) Annelida। অ্যানিলিডা ও আর্থ্রোপোডা পর্বে সর্পিলাকার ক্লিভেজ দেখা যায়।</div>
      </div>

      <div class="q" data-a="1">
        <div class="q-text">৩. কোন ধরণের ক্লিভেজে জাইগোট সুষমভাবে বিভাজিত হয়?</div>
        <div class="opts">
          <div class="opt">ক) সর্পিলাকার</div>
          <div class="opt">খ) অরীয় ক্লিভেজ</div>
          <div class="opt">গ) দ্বি-অরীয় ক্লিভেজ</div>
          <div class="opt">ঘ) দ্বিপার্শ্বীয় ক্লিভেজ</div>
        </div>
        <div class="exp">✔ সঠিক: খ) অরীয় ক্লিভেজ।</div>
      </div>

      <div class="q" data-a="2">
        <div class="q-text">৪. কোনটি ত্রিস্তরী প্রাণীদের বৈশিষ্ট্য নয়?</div>
        <div class="opts">
          <div class="opt">ক) সিলোম</div>
          <div class="opt">খ) মেসোগ্লিয়া থাকে না</div>
          <div class="opt">গ) বহুরূপতা</div>
          <div class="opt">ঘ) অঙ্গ ও অঙ্গতন্ত্র গঠন করে</div>
        </div>
        <div class="exp">✔ সঠিক: গ) বহুরূপতা (এটি নিডারিয়া বা দ্বিস্তরী প্রাণীর বৈশিষ্ট্য)।</div>
      </div>

      <div class="q" data-a="0">
        <div class="q-text">৫. কোন পর্বের প্রাণিদের 'সমুদ্রের ফুল' বলা হয়?</div>
        <div class="opts">
          <div class="opt">ক) Cnidaria</div>
          <div class="opt">খ) Porifera</div>
          <div class="opt">গ) Annelida</div>
          <div class="opt">ঘ) Echinodermata</div>
        </div>
        <div class="exp">✔ সঠিক: ক) Cnidaria (যেমন সি-অ্যানেমোন)।</div>
      </div>

      <div class="q" data-a="2">
        <div class="q-text">৬. প্রকৃত সিলোমেট প্রাণী প্রথম দেখা যায় কোন পর্বে?</div>
        <div class="opts">
          <div class="opt">ক) Cnidaria</div>
          <div class="opt">খ) Porifera</div>
          <div class="opt">গ) Annelida</div>
          <div class="opt">ঘ) Echinodermata</div>
        </div>
        <div class="exp">✔ সঠিক: গ) Annelida।</div>
      </div>

      <div class="q" data-a="3">
        <div class="q-text">৭. "পেডিসিলারি" নামক বহিঃকঙ্কাল পরিলক্ষিত হয় কোন পর্বে?</div>
        <div class="opts">
          <div class="opt">ক) Cnidaria</div>
          <div class="opt">খ) Arthropoda</div>
          <div class="opt">গ) Porifera</div>
          <div class="opt">ঘ) Echinodermata</div>
        </div>
        <div class="exp">✔ সঠিক: ঘ) Echinodermata (যেমন তারামাছ)।</div>
      </div>

      <div class="q" data-a="0">
        <div class="q-text">৮. Retrogressive Metamorphosis দেখা যায় কোন প্রাণীতে?</div>
        <div class="opts">
          <div class="opt">ক) Ascidia</div>
          <div class="opt">খ) Hemichordata</div>
          <div class="opt">গ) Myxini</div>
          <div class="opt">ঘ) Sea Lamprey</div>
        </div>
        <div class="exp">✔ সঠিক: ক) Ascidia (ইউরোকর্ডাটা উপপর্বের প্রাণী)।</div>
      </div>

      <div class="q" data-a="2">
        <div class="q-text">৯. "সমুদ্র শসা" নামে পরিচিত প্রাণী কোনটি?</div>
        <div class="opts">
          <div class="opt">ক) Asterias</div>
          <div class="opt">খ) Ophiura</div>
          <div class="opt">গ) Holothuria</div>
          <div class="opt">ঘ) Antedon</div>
        </div>
        <div class="exp">✔ সঠিক: গ) Holothuria।</div>
      </div>

      <div class="q" data-a="0">
        <div class="q-text">১০. সরল অমরা (Placenta) বিশিষ্ট স্তন্যপায়ী কোনটি?</div>
        <div class="opts">
          <div class="opt">ক) Metatheria</div>
          <div class="opt">খ) Eutheria</div>
          <div class="opt">গ) Prototheria</div>
          <div class="opt">ঘ) Monotreme</div>
        </div>
        <div class="exp">✔ সঠিক: ক) Metatheria (যেমন ক্যাঙ্গারু)।</div>
      </div>

    </div>

    <div class="quiz-foot">
      <button class="btn-submit" onclick="submitQuiz('quizBody1', 'scoreBoard1', 'progressBar1')">Submit Assessment</button>
      <button class="btn-restart" onclick="location.reload()">Restart</button>
      <div class="score-board" id="scoreBoard1"></div>
    </div>
  </div>
</div>

<script>
// Unified Quiz Engine Logic
function initQuiz(quizId, timerId, barId, textId, timeLimit) {
  const quiz = document.getElementById(quizId);
  const progressBar = document.getElementById(barId);
  const progressText = document.getElementById(textId);
  const timerDisplay = document.getElementById(timerId);
  let time = timeLimit;

  let countdown = setInterval(() => {
    let m = Math.floor(time / 60);
    let s = time % 60;
    timerDisplay.innerHTML = ⏱️ :;
    time--;
    if (time < 0) {
      clearInterval(countdown);
      submitQuiz(quizId, 'scoreBoard1', barId);
    }
  }, 1000);

  quiz.addEventListener('click', e => {
    if (!e.target.classList.contains('opt')) return;
    const q = e.target.closest('.q');
    if (q.classList.contains('done')) return;

    q.querySelectorAll('.opt').forEach(o => o.classList.remove('selected'));
    e.target.classList.add('selected');
    q.dataset.sel = [...q.children[1].children].indexOf(e.target);

    let ans = quiz.querySelectorAll('.q[data-sel]').length;
    let total = quiz.querySelectorAll('.q').length;
    progressBar.style.width = (ans / total) * 100 + '%';
    progressText.innerText = ${ans} /  Answered;
  });
}

function submitQuiz(quizId, scoreId, barId) {
  const quiz = document.getElementById(quizId);
  let score = 0;
  const qs = quiz.querySelectorAll('.q');

  qs.forEach(q => {
    let c = q.dataset.a;
    let s = q.dataset.sel;

    if (s == c) { score++; q.classList.add('correct'); }
    else { q.classList.add('wrong'); }
    q.classList.add('done');

    let opts = q.querySelectorAll('.opt');
    if (opts[c]) opts[c].classList.add('correct');
    if (s !== undefined && s !== c && opts[s]) opts[s].classList.add('wrong');
  });

  document.getElementById(barId).style.width = '100%';
  let p = (score / qs.length) * 100;
  let sc = document.getElementById(scoreId);
  sc.innerHTML = <div>Diagnostic Complete</div><div class="score-text"> / </div><div style="color:#94a3b8">Accuracy: %</div>;
  sc.classList.add('show');
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  initQuiz('quizBody1', 'timer1', 'progressBar1', 'progressText1', 900);
});
</script>
