(function () {
  'use strict';
  const root = document.querySelector('#lbfl-med-v14');
  if (!root) return;
  const escapeHtml = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const STORAGE_KEY = 'lbfl-medical-stage1-v14-progress';
  // Persist only whitelisted completion flags and missed question IDs, never choices, grades, timestamps or learner text.
  const EMPTY = () => ({schema:2,blocks:{},attempts:{},errors:{}});
  let state=EMPTY(), persistAvailable=true;
  function showStorageWarning(){const n=root.querySelector('#med-storage-status');if(n)n.textContent='এই ব্রাউজারে অগ্রগতি সংরক্ষণ হচ্ছে না। পরীক্ষা চালানো যাবে, কিন্তু পৃষ্ঠা বন্ধ করলে তথ্য হারাতে পারে।';}
  const save=()=>{
    const safe=EMPTY();
    for(const d of DB.study_days)for(const b of d.blocks)if(state.blocks[b.id]===true)safe.blocks[b.id]=true;
    for(const t of DB.tests)if(state.attempts[t.id]===true)safe.attempts[t.id]=true;
    for(const q of DB.questions)if(state.errors[q.id]===true)safe.errors[q.id]=true;
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(safe));}
    catch(_){persistAvailable=false;showStorageWarning();}
  };
  let DB, qmap, active, answers={}, submitted=false;
  function restore(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw)return;
      const parsed=JSON.parse(raw);
      if(!parsed || (parsed.schema!==1 && parsed.schema!==2))return;
      const own=(o,k)=>o && typeof o==='object' && Object.prototype.hasOwnProperty.call(o,k);
      for(const d of DB.study_days)for(const b of d.blocks)
        if(own(parsed.blocks,b.id) && parsed.blocks[b.id]===true)state.blocks[b.id]=true;
      for(const t of DB.tests)if(own(parsed.attempts,t.id)){
        const v=parsed.attempts[t.id];
        if(v===true || (parsed.schema===1 && v && typeof v==='object' && !Array.isArray(v)))state.attempts[t.id]=true;
      }
      for(const q of DB.questions)if(own(parsed.errors,q.id)){
        const v=parsed.errors[q.id];
        if(v===true || (parsed.schema===1 && v && typeof v==='object' && !Array.isArray(v)))state.errors[q.id]=true;
      }
      // Migrate legacy schema by replacing detailed results with bounded boolean flags.
      if(parsed.schema===1)save();
    }catch(_){persistAvailable=false;}
  }
  function launch(db){
    if (!db || db.version!=='stage1-v14-isolated-preview' || !Array.isArray(db.questions) || !Array.isArray(db.tests) || !Array.isArray(db.study_days)) throw Error('Unsupported question bank');
    DB=db;qmap=new Map(db.questions.map(q=>[q.id,q]));restore();
    root.innerHTML=`<h1>২১ দিনের মেডিকেল প্রস্তুতি — নিয়ন্ত্রিত প্রিভিউ</h1>
      <p class="med-note"><strong>অভ্যন্তরীণ প্রিভিউ:</strong> প্রশ্ন শিক্ষক-প্রস্তুত; মেডিকেলের মূল পূর্ববর্তী প্রশ্নপত্র নয়। ২০২৫–২৬ নম্বরবণ্টন কেবল পরিকল্পনার ভিত্তি; এটি পূর্ণ ১০০ নম্বরের মেডিকেল মক নয়।</p>
      <p id="med-storage-status" class="med-storage" role="status">এই ব্রাউজারে শুধু সম্পন্ন কাজ, পরীক্ষা দেওয়া এবং আগে ভুল/ফাঁকা প্রশ্নের ID থাকে; উত্তর বা নম্বর সংরক্ষিত হয় না।</p>
      <nav class="med-tabs" aria-label="প্রস্তুতির বিভাগ"><button type="button" data-tab="plan" aria-pressed="true">পড়ার অগ্রগতি</button><button type="button" data-tab="quiz" aria-pressed="false">MCQ পরীক্ষা</button><button type="button" data-tab="errors" aria-pressed="false">ভুল-প্রশ্ন রিভিশন</button></nav>
      <section id="med-panel-plan" aria-labelledby="med-plan-title"><h2 id="med-plan-title">দিনভিত্তিক পড়ার অগ্রগতি</h2><label for="med-day">দিন নির্বাচন</label><select id="med-day"></select><div id="med-summary" aria-live="polite"></div><div id="med-blocks" class="med-grid"></div></section>
      <section id="med-panel-quiz" aria-labelledby="med-quiz-title" hidden><h2 id="med-quiz-title">পরীক্ষা</h2><label for="med-test">প্রশ্নসেট নির্বাচন</label><select id="med-test"></select><div class="med-actions"><button id="med-submit" type="button">উত্তর জমা দিন</button><button id="med-reset" type="button" class="med-secondary">এই চেষ্টা নতুন করে শুরু</button></div><p class="med-muted">উত্তর জমা দেওয়ার আগে সঠিক উত্তর ও ব্যাখ্যা দেখানো হবে না। সঠিক +১, ভুল −০.২৫, ফাঁকা ০।</p><div id="med-score" role="status" aria-live="polite" tabindex="-1"></div><div id="med-questions"></div></section>
      <section id="med-panel-errors" aria-labelledby="med-errors-title" hidden><h2 id="med-errors-title">ভুল-প্রশ্ন পুনরুদ্ধার</h2><p class="med-muted">ভুল ও উত্তর না-দেওয়া প্রশ্ন এখানে আসে। পরে সঠিক করলেই পরীক্ষায় স্থায়ীভাবে আয়ত্ত হয়েছে—এমন দাবি করা হবে না।</p><div id="med-errors-summary" aria-live="polite"></div><div class="med-actions"><button id="med-retest" type="button">ভুল প্রশ্ন দিয়ে অনুশীলন শুরু</button><button id="med-errors-refresh" type="button" class="med-secondary">তালিকা হালনাগাদ</button></div><div id="med-errors-list"></div></section>`;
    const daySel=root.querySelector('#med-day'),testSel=root.querySelector('#med-test');
    db.study_days.forEach(d=>daySel.add(new Option(`Day ${d.day} · ${d.date}${d.kind==='FRIDAY_REVIEW'?' · শুক্রবার':''}`,String(d.day))));
    db.tests.forEach(t=>testSel.add(new Option(`${t.title_bn} · ${t.count} প্রশ্ন`,t.id)));
    daySel.addEventListener('change',renderPlan);
    testSel.addEventListener('change',()=>{active=null;renderTest();});
    root.querySelector('#med-submit').addEventListener('click',submit);
    root.querySelector('#med-reset').addEventListener('click',renderTest);
    root.querySelector('#med-retest').addEventListener('click',beginRevision);
    root.querySelector('#med-errors-refresh').addEventListener('click',renderErrors);
    root.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
    if (!persistAvailable) showStorageWarning();
    renderPlan();renderTest();renderErrors();
  }
  function setTab(which){
    root.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tab===which?'true':'false'));
    for (const n of ['plan','quiz','errors']) root.querySelector('#med-panel-'+n).hidden=(n!==which);
    if (which==='plan')renderPlan();if(which==='errors')renderErrors();
  }
  function studyDay(){return DB.study_days.find(d=>String(d.day)===root.querySelector('#med-day').value)||DB.study_days[0]}
  function renderPlan(){
    const d=studyDay();let count=d.blocks.filter(b=>state.blocks[b.id]).length;
    const t=DB.tests.find(t=>t.day===d.day && t.kind!=='PCB70_DIAGNOSTIC');
    const attempt=t && state.attempts[t.id];
    const allBlocks=count===d.blocks.length;
    root.querySelector('#med-summary').innerHTML=`<div class="med-progress" role="progressbar" aria-label="অধ্যয়ন ব্লক সম্পন্ন" aria-valuemin="0" aria-valuemax="${d.blocks.length}" aria-valuenow="${count}"><span style="width:${Math.round(100*count/d.blocks.length)}%"></span></div><p>${count}/${d.blocks.length} অধ্যয়ন কাজ সম্পন্ন; ${attempt?'পরীক্ষা দেওয়া হয়েছে':'পরীক্ষা বাকি'}। <strong>${allBlocks&&attempt?'এই দিনের পরিকল্পিত কাজ ও পরীক্ষা সম্পন্ন':'এখনও অসম্পূর্ণ'}</strong></p>`;
    const blocks=root.querySelector('#med-blocks');blocks.replaceChildren();
    d.blocks.forEach(b=>{
      const card=document.createElement('article');card.className='med-card';
      card.innerHTML=`<h3>${escapeHtml(b.subject)} ${escapeHtml(b.paper)}</h3><p><strong>${escapeHtml(b.chapter)}</strong></p><p>${escapeHtml(b.topic)}</p>${b.minutes!=null?`<p class="med-duration">সময় ${b.minutes} মিনিট</p>`:''}<label class="med-check"><input type="checkbox" ${state.blocks[b.id]?'checked':''}/> কাজটি সম্পন্ন হয়েছে</label>`;
      card.querySelector('input').addEventListener('change',e=>{state.blocks[b.id]=e.target.checked;save();renderPlan();});blocks.append(card);
    });
  }
  function currentTest(){return DB.tests.find(t=>t.id===root.querySelector('#med-test').value)||DB.tests[0]}
  function renderTest(){
    if (!active || active.kind!=='REVISION')active=currentTest();
    answers={};submitted=false;
    const area=root.querySelector('#med-questions'),score=root.querySelector('#med-score');area.replaceChildren();score.textContent='';
    root.querySelector('#med-submit').disabled=false;
    active.question_ids.forEach((id,i)=>{
      const q=qmap.get(id);if(!q)return;
      const card=document.createElement('article');card.className='med-card med-question';
      const group=`med-q-${i}`;
      card.innerHTML=`<div class="med-muted">প্রশ্ন ${i+1} · ${escapeHtml(q.subject)} · ${escapeHtml(q.chapter_title)}</div><fieldset><legend>${escapeHtml(q.stem)}</legend>${Object.entries(q.options).map(([key,value])=>`<label class="med-option" data-opt="${escapeHtml(key)}"><input type="radio" name="${group}" value="${escapeHtml(key)}"/><span>${escapeHtml(key)}. ${escapeHtml(value)}</span></label>`).join('')}</fieldset><div class="med-feedback" hidden></div>`;
      card.querySelectorAll('input').forEach(x=>x.addEventListener('change',()=>{if(!submitted)answers[id]=x.value;}));area.append(card);
    });
  }
  function submit(){
    if(submitted)return;
    submitted=true;
    const pts={Physics:0,Chemistry:0,Biology:0},correct={Physics:0,Chemistry:0,Biology:0};
    let wrong=0,answered=0;
    root.querySelectorAll('.med-question').forEach((card,i)=>{
      const id=active.question_ids[i],q=qmap.get(id),ans=answers[id];
      const isCorrect=ans===q.correct_option;
      if(ans)answered++;
      if(q.subject in pts)pts[q.subject]+=ans?(isCorrect?1:-.25):0;
      if(isCorrect && q.subject in correct)correct[q.subject]++;
      if(!isCorrect)wrong++;
      card.querySelectorAll('input').forEach(r=>r.disabled=true);
      card.querySelectorAll('.med-option').forEach(label=>{
        const k=label.dataset.opt;if(k===q.correct_option)label.classList.add('med-is-correct');
        if(ans&&ans===k&&!isCorrect)label.classList.add('med-is-wrong');
      });
      const feedback=card.querySelector('.med-feedback');feedback.hidden=false;
      feedback.innerHTML=`<strong>${isCorrect?'সঠিক':ans?'ভুল':'উত্তর দেওয়া হয়নি'} · উত্তর ${escapeHtml(q.correct_option)}: ${escapeHtml(q.options[q.correct_option])}</strong><p>${escapeHtml(q.explanation_bn)}</p><details><summary>চারটি অপশনের ব্যাখ্যা</summary><ul>${Object.keys(q.options).map(k=>`<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(q.option_analysis_bn[k]||'পৃথক ব্যাখ্যা অনুপস্থিত')}</li>`).join('')}</ul></details>`;
      if(!isCorrect)state.errors[id]=true; // Never persist individual answers, grades or timestamps.
    });
    const raw=Object.values(pts).reduce((a,b)=>a+b,0);const max=active.question_ids.length;
    const den=active.subject_count||{},weighted=['Physics','Chemistry','Biology'].reduce((acc,s)=>acc+(den[s]?pts[s]/den[s]*DB.marks_baseline[s]:0),0);
    const isBenchmark=active.kind==='PCB70_DIAGNOSTIC';
    const label=isBenchmark?'PCB ৭০ প্রশ্নের অনুশীলন (সম্পূর্ণ ১০০ নম্বরের মক নয়)':`PCB weighted diagnostic index ${weighted.toFixed(2)}/70; এটি পূর্ণ ৭০ প্রশ্নের পরীক্ষা নয়`;
    const score=root.querySelector('#med-score');
    score.innerHTML=`<div class="med-result"><strong>স্কোর ${raw.toFixed(2)} / ${max}</strong><p>উত্তর দেওয়া ${answered}, সঠিক ${Object.values(correct).reduce((a,b)=>a+b,0)}, ভুল/ফাঁকা ${wrong}</p><p>${escapeHtml(label)}</p></div>`;
    score.focus();root.querySelector('#med-submit').disabled=true;
    if(active.kind!=='REVISION')state.attempts[active.id]=true;
    save();renderErrors();renderPlan();
  }
  function renderErrors(){
    const ids=Object.keys(state.errors).filter(id=>state.errors[id]===true && qmap.has(id));
    root.querySelector('#med-errors-summary').textContent=`${ids.length}টি স্বতন্ত্র প্রশ্নে আগে ভুল বা ফাঁকা উত্তর দেওয়া হয়েছে। রিভিশনে একবার সঠিক হলেই স্থায়ী আয়ত্তের দাবি নয়।`;
    root.querySelector('#med-retest').disabled=ids.length===0;
    root.querySelector('#med-errors-list').innerHTML=ids.length?`<ol>${ids.map(id=>{const q=qmap.get(id);return `<li><strong>${escapeHtml(q.subject)}</strong> · ${escapeHtml(q.chapter_title)} · রিভিশনের জন্য সংরক্ষিত</li>`;}).join('')}</ol>`:'<p>এখনো কোনো ভুল প্রশ্ন নথিভুক্ত হয়নি।</p>';
  }
  function beginRevision(){
    const ids=Object.keys(state.errors).filter(id=>qmap.has(id));if(!ids.length)return;
    const count={Physics:0,Chemistry:0,Biology:0};ids.forEach(id=>{const s=qmap.get(id).subject;if(s in count)count[s]++;});
    active={id:'REVISION-LOCAL',title_bn:'ব্যক্তিগত ভুল-প্রশ্ন রিভিশন',kind:'REVISION',count:ids.length,question_ids:ids,subject_count:count};
    setTab('quiz');renderTest();root.querySelector('#med-score').textContent=`ভুল-প্রশ্ন থেকে ${ids.length}টি প্রশ্ন নিয়ে অনুশীলন; মূল দৈনিক পরীক্ষার স্কোর বদলাবে না।`;
  }
  const embedded = window.LBFL_MED_PREVIEW_DATA_V14;
  const request = embedded ? Promise.resolve(embedded) : fetch(root.dataset.src,{credentials:'same-origin'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();});
  request.then(launch).catch(err=>{
    root.innerHTML='<h1>২১ দিনের মেডিকেল প্রিভিউ</h1><p role="alert">প্রশ্ন ডেটা লোড হয়নি। preview build বা data path যাচাই করতে হবে।</p>';
    if(typeof console!=='undefined')console.error('LBFL preview data load failed',err.message);
  });
}());
