---
layout: home
permalink: /
author_profile: false
classes: wide
title: "Learning Biology For Life"
description: "A Neural Educational Ecosystem for Reflective Scientific Learning, Biology, Systems Thinking, Behavioural Science & Socratic Inquiry."
pagination:
  enabled: true
  collection: posts
  per_page: 4
---

<!-- HERO SECTION -->
<div class="synaptic-hero-layout-wrapper">
  <h1 class="synaptic-hero-title">
    Where Biology<br>
    Meets Life
  </h1>

  <p class="synaptic-hero-subtitle">
    A Neural Educational Ecosystem for Reflective Scientific Learning,
    Biology, Systems Thinking, Behavioural Science & Socratic Inquiry.
  </p>

  <div class="synaptic-hero-actions">
    <a href="{{ '/biology/' | relative_url }}" class="neural-btn">
      Explore Biology
    </a>
    <a href="#socratic-dialogue" class="neural-btn bg-gradient-to-tr from-purple-500 to-indigo-400 text-white">
      Socratic Ecosystem
    </a>
  </div>
</div>

<!-- INTRODUCTION -->
<div class="synaptic-intro">
  <h2 class="section-title">
    The Synaptic Learning Ecosystem
  </h2>
  <p class="section-description">
    Biology is not merely a subject — it is the architecture of life, systems, cognition and evolution.
  </p>
</div>

<!-- PILLARS GRID -->
<div class="neural-grid">
  <article class="neural-card" onclick="focusPillar('biology')">
    <div class="neural-icon">🧬</div>
    <h3>Biology</h3>
    <p>Molecular biology, ecology, physiology, genetics and systems thinking.</p>
  </article>

  <article class="neural-card" onclick="focusPillar('reflective')">
    <div class="neural-icon">🌍</div>
    <h3>Life Practices</h3>
    <p>Connecting academic knowledge with human reflection and real-world application.</p>
  </article>

  <article class="neural-card" onclick="focusPillar('pedagogy')">
    <div class="neural-icon">🧠</div>
    <h3>Socratic Learning</h3>
    <p>Reflective inquiry, critical thinking, interdisciplinary cognition and AI pedagogy.</p>
  </article>
</div>

<!-- CINEMATIC GENERATOR BUTTON -->
<div class="pt-4 border-t border-white/5 flex justify-end">
  <button onclick="generateCinematicConceptArt('lesson')" class="px-4 py-2 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-1.5">
    <span>✨ Generate Cinematic Illustration</span>
  </button>
</div>

<!-- IQRA HARMONY SANCTUM -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12">
  <div class="lg:col-span-7 space-y-6">
    <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25">
      <span class="text-xs font-bold text-amber-300 uppercase tracking-widest">Spiritual & Scientific Harmony</span>
    </div>
    
    <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
      The Sanctum of <span class="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent glow-text-gold">IQRA</span>
    </h2>
    
    <p class="text-slate-300 font-light leading-relaxed">
      Knowledge begins with <strong class="text-amber-200">Iqra (اقرأ)</strong>—the profound command to read, proclaim, and reflect upon creation. This sanctum bridges the absolute design of biological machinery with philosophical and spiritual mindfulness, inviting contemplation on the natural blueprints of existence.
    </p>
    
    <div class="p-5 rounded-2xl bg-black/40 border border-white/5">
      <p class="text-sm italic text-slate-300">
        "Verily, in the creation of the heavens and the earth, and the alternation of night and day, are indeed signs for men of reflective understanding."
      </p>
    </div>

    <div class="space-y-4 pt-2">
      <label class="block text-xs font-bold uppercase tracking-wider text-amber-300">Select a biological marvel to synthesize Socratic wisdom:</label>
      <div class="flex flex-wrap gap-2">
        <button onclick="synthesizeIqraReflect('The Helix of DNA (The code of inheritance)')" class="px-4 py-2 bg-slate-900/60 hover:bg-amber-500/25 border border-amber-500/20 rounded-xl text-xs text-amber-200 transition-all">
          🧬 Helix of DNA
        </button>
        <button onclick="synthesizeIqraReflect('Cellular Gating & Homeostasis')" class="px-4 py-2 bg-slate-900/60 hover:bg-amber-500/25 border border-amber-500/20 rounded-xl text-xs text-amber-200 transition-all">
          ⚖️ Homeostatic Gates
        </button>
        <button onclick="synthesizeIqraReflect('Neural Network Synapses')" class="px-4 py-2 bg-slate-900/60 hover:bg-amber-500/25 border border-amber-500/20 rounded-xl text-xs text-amber-200 transition-all">
          🧠 Synapse Networks
        </button>
      </div>
    </div>
  </div>

  <div class="lg:col-span-5 flex flex-col items-center justify-center p-4">
    <div class="relative w-72 h-72 md:w-80 md:h-80 rounded-full flex items-center justify-center bg-radial-glow border border-amber-500/20 p-6 bg-slate-950/40 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
      <svg viewBox="0 0 200 200" class="w-full h-full text-amber-400">
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fbbf24" />
            <stop offset="50%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#d97706" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="none" stroke="url(#gold-grad)" stroke-width="1.5" />
        <circle cx="100" cy="100" r="91" fill="none" stroke="url(#gold-grad)" stroke-width="0.75" stroke-dasharray="2,2" />
        
        <path d="M75,50 Q100,80 125,110 T75,170" fill="none" stroke="rgba(245, 158, 11, 0.3)" stroke-width="2" />
        <path d="M125,50 Q100,80 75,110 T125,170" fill="none" stroke="rgba(56, 189, 248, 0.3)" stroke-width="2" />
        
        <line x1="88" y1="65" x2="112" y2="65" stroke="#f59e0b" stroke-width="1" opacity="0.6"/>
        <line x1="100" y1="80" x2="100" y2="80" stroke="#f59e0b" stroke-width="1" opacity="0.6"/>
        <line x1="84" y1="125" x2="116" y2="125" stroke="#f59e0b" stroke-width="1" opacity="0.6"/>
        <line x1="94" y1="140" x2="106" y2="140" stroke="#f59e0b" stroke-width="1" opacity="0.6"/>

        <path d="M100,160 L100,75" fill="none" stroke="url(#gold-grad)" stroke-width="2" />
        <path d="M100,120 Q80,105 70,115" fill="none" stroke="url(#gold-grad)" stroke-width="1.5" />
        <path d="M100,100 Q120,85 130,95" fill="none" stroke="url(#gold-grad)" stroke-width="1.5" />
        <circle cx="70" cy="115" r="3" fill="#3ee7b6" />
        <circle cx="130" cy="95" r="3" fill="#3ee7b6" />
        <circle cx="100" cy="72" r="3" fill="#3ee7b6" />

        <text x="100" y="110" font-family="'Inter', sans-serif" font-weight="800" font-size="22" fill="url(#gold-grad)" text-anchor="middle" letter-spacing="1">اقرأ</text>
        <text x="100" y="180" font-family="'Inter', sans-serif" font-size="7" fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="2">IQRA REFLECTION</text>
      </svg>
    </div>
  </div>
</div>

<div id="iqraSynthesisArea" class="hidden mt-8 p-6 rounded-2xl bg-black/60 border border-amber-500/25">
  <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
    <span id="iqraTargetTitle" class="text-xs uppercase tracking-wider text-amber-300 font-bold">DNA Helix Synthesis</span>
    <span id="iqraLoader" class="text-[10px] text-amber-400 animate-pulse hidden">Reflecting...</span>
  </div>
  <div id="iqraSynthesisContent" class="text-sm text-slate-300 leading-relaxed space-y-3"></div>
</div>

<!-- SOCRATIC COACH COACHING BOX INTERACTIVE CARD -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
  <div class="p-6 md:p-8 rounded-3xl border border-teal-500/10 bg-slate-950/20">
    <h3 id="mcqQuestion" class="text-lg md:text-xl font-bold text-white leading-relaxed">
      During plant respiration, what mechanism regulates the rapid cellular influx of potassium ions ($K^+$) into guard cells to open the stomata?
    </h3>
    
    <div class="space-y-3 pt-4">
      <button onclick="selectMCQOption(this, 'A')" class="w-full text-left p-4 rounded-xl bg-slate-950/40 border border-white/10 hover:border-teal-400/40 text-sm text-slate-300 transition-all flex items-center justify-between group">
        <span>A. Simple passive osmosis through phospholipid membranes.</span>
        <span class="text-xs opacity-0 group-hover:opacity-100 text-teal-300 font-mono">Select</span>
      </button>
      <button onclick="selectMCQOption(this, 'B')" class="w-full text-left p-4 rounded-xl bg-slate-950/40 border border-white/10 hover:border-teal-400/40 text-sm text-slate-300 transition-all flex items-center justify-between group">
        <span>B. Active transport mediated by $H^+$-ATPase proton pumps generating membrane potential.</span>
        <span class="text-xs opacity-0 group-hover:opacity-100 text-teal-300 font-mono">Select</span>
      </button>
      <button onclick="selectMCQOption(this, 'C')" class="w-full text-left p-4 rounded-xl bg-slate-950/40 border border-white/10 hover:border-teal-400/40 text-sm text-slate-300 transition-all flex items-center justify-between group">
        <span>C. Facilitated diffusion through ligand-gated aquaporin pathways.</span>
        <span class="text-xs opacity-0 group-hover:opacity-100 text-teal-300 font-mono">Select</span>
      </button>
      <button onclick="selectMCQOption(this, 'D')" class="w-full text-left p-4 rounded-xl bg-slate-950/40 border border-white/10 hover:border-teal-400/40 text-sm text-slate-300 transition-all flex items-center justify-between group">
        <span>D. Pinocytosis inside peripheral xylem vessels.</span>
        <span class="text-xs opacity-0 group-hover:opacity-100 text-teal-300 font-mono">Select</span>
      </button>
    </div>

    <div class="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
      <button onclick="evaluateMCQSubmission()" class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
        Submit & Process
      </button>
      <button onclick="nextMCQQuestion()" class="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
        Skip Question &rarr;
      </button>
    </div>
  </div>

  <div class="p-6 md:p-8 rounded-3xl flex flex-col justify-between border border-teal-500/20 bg-slate-950/30">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-teal-400">Socratic MCQ Coach</span>
        <span id="mcqCoachStatus" class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
      </div>
      
      <p class="text-slate-400 text-xs">
        Select an option and submit to begin Socratic synthesis. Your coach won't just tell you the answer—it will guide you to reconstruct the biological principle.
      </p>
      
      <div id="mcqFeedbackArea" class="min-h-[220px] max-h-[300px] overflow-y-auto p-4 rounded-2xl bg-black/40 border border-white/5 text-sm text-slate-300 space-y-3 leading-relaxed">
        <p class="text-slate-500 italic text-xs">Waiting for your submission...</p>
      </div>
    </div>

    <div class="pt-4 border-t border-white/5 flex justify-end">
      <button onclick="askCoachSocraticHint()" class="px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-lg text-xs font-semibold uppercase tracking-wider border border-teal-500/20 transition-all">
        Ask Coach for Socratic Hint
      </button>
    </div>
  </div>
</div>

<!-- TOPICAL CORE DOMAINS -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
  <div id="human-physiology" class="p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-white/10 transition-all duration-300 flex flex-col justify-between hover:border-emerald-500/30">
    <div>
      <span class="text-[10px] font-bold text-[#3ee7b6] uppercase tracking-wider block mb-2">Systems Regulation</span>
      <h3 class="text-xl font-bold text-white mb-3">Human Physiology</h3>
      <p class="text-sm text-slate-400 leading-relaxed mb-6">
        Understand the homeostatic balancing acts that stabilize chemical gradients, hormone pathways, and fluid thresholds.
      </p>
      
      <div class="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 mb-6">
        <div class="flex justify-between items-center text-xs">
          <span class="text-slate-400">Core Temperature Regulator</span>
          <span id="physioTemp" class="text-[#3ee7b6] font-bold">37.0°C</span>
        </div>
        <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div id="physioBar" class="w-1/2 h-full bg-[#3ee7b6] transition-all"></div>
        </div>
        <div class="flex gap-2 font-sans">
          <button onclick="adjustPhysiology('cool')" class="flex-grow py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-lg text-[10px] font-bold uppercase transition-all">Add Chill</button>
          <button onclick="adjustPhysiology('heat')" class="flex-grow py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-[10px] font-bold uppercase transition-all">Add Heat</button>
        </div>
      </div>
    </div>
    <a href="#systems-sandbox" class="text-xs text-[#3ee7b6] font-semibold hover:underline flex items-center space-x-1">
      <span>Open Sandbox Simulation &rarr;</span>
    </a>
  </div>

  <div id="genetics" class="p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-white/10 transition-all duration-300 flex flex-col justify-between hover:border-purple-500/30">
    <div>
      <span class="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-2">Inheritance Dynamics</span>
      <h3 class="text-xl font-bold text-white mb-3">Genetics & Heredity</h3>
      <p class="text-sm text-slate-400 leading-relaxed mb-6">
        Track complex Mendelian inheritance structures, genetic codominance, alleles, and molecular mutation pathways.
      </p>
      
      <div class="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 mb-6">
        <div class="flex justify-between items-center text-xs">
          <span class="text-slate-400">Monohybrid Cross (F2 Phenotype)</span>
          <span id="geneticsResult" class="text-purple-300 font-bold">3:1 dominant</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono text-center">
          <div onclick="breedAlleles('T', 'T')" class="p-2 bg-slate-900/60 rounded border border-purple-500/20 cursor-pointer hover:bg-purple-500/15">TT (Tall)</div>
          <div onclick="breedAlleles('T', 't')" class="p-2 bg-slate-900/60 rounded border border-purple-500/20 cursor-pointer hover:bg-purple-500/15">Tt (Tall Hybrid)</div>
        </div>
      </div>
    </div>
    <button onclick="usePredefinedQuery('Explain how Mendelian allele mapping informs behavioral traits.')" class="text-xs text-purple-400 font-semibold hover:underline text-left bg-transparent border-none cursor-pointer">
      Explore Inheritance Models &rarr;
    </button>
  </div>

  <div id="ecology" class="p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-white/10 transition-all duration-300 flex flex-col justify-between hover:border-amber-500/30">
    <div>
      <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">Ecosystem Energy flow</span>
      <h3 class="text-xl font-bold text-white mb-3">Ecology & Conservation</h3>
      <p class="text-sm text-slate-400 leading-relaxed mb-6">
        Trace intricate food chains, nitrogen feedback patterns, energy absorption limits, and ecosystemic transformation metrics.
      </p>
      
      <div class="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 mb-6">
        <div class="flex justify-between text-[11px] text-slate-400">
          <span>Species Biomass Balance</span>
          <span class="text-emerald-400 font-semibold">94% Equilibrium</span>
        </div>
        <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div class="h-full w-[94%] bg-emerald-400"></div>
        </div>
      </div>
    </div>
    <a href="#systems-sandbox" class="text-xs text-amber-400 font-semibold hover:underline flex items-center space-x-1">
      <span>Simulate Ecosystem Stressors &rarr;</span>
    </a>
  </div>
</div>

<!-- INTROSPECTIVE DEPTH GRID -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
  <div id="subconsciousness" class="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0c0516] to-[#040108] border border-purple-500/20 hover:border-purple-500/35 transition-all">
    <span class="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-3">Introspective Depth</span>
    <h3 class="text-2xl font-bold text-white mb-4">Shade of Subconsciousness</h3>
    <p class="text-sm text-slate-400 leading-relaxed mb-6">
      Investigate the biochemical footprint of conditioning. How we program habits, trigger flight responses, and construct identity loops using basic evolutionary neural chemistry frameworks.
    </p>
    <blockquote class="text-xs italic border-l border-purple-500/35 pl-4 text-slate-300">
      "Conditioned pathways within the amygdala function like early firmware. True growth occurs by developing conscious metacognitive controls."
    </blockquote>
  </div>

  <div id="human-behaviour" class="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0c0516] to-[#040108] border border-purple-500/20 hover:border-purple-500/35 transition-all">
    <span class="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-3">Habit Dynamics</span>
    <h3 class="text-2xl font-bold text-white mb-4">Human Behaviour</h3>
    <p class="text-sm text-slate-400 leading-relaxed mb-6">
      Evaluate neurotransmitter pathways, dopamine saturation thresholds, and habit-loop metrics. Learn to restructure lifestyle routines using actual biological signaling constraints.
    </p>
    <blockquote class="text-xs italic border-l border-purple-500/35 pl-4 text-slate-300">
      "We do not fail our resolutions because of weakness; we fail because we neglect the biological limits of neuroplastic adaptation."
    </blockquote>
  </div>

  <div id="synaptic-approach" class="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0c0516] to-[#040108] border border-purple-500/20 hover:border-purple-500/35 transition-all">
    <span class="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-3">Interdisciplinary Synapse</span>
    <h3 class="text-2xl font-bold text-white mb-4">The Synaptic Approach</h3>
    <p class="text-sm text-slate-400 leading-relaxed mb-6">
      The ultimate bridge connecting scientific biology with human development, organizational leadership styles, and Socratic discovery loops.
    </p>
    <button onclick="usePredefinedQuery('How do cell network properties map onto organizational workflow models?')" class="text-xs text-purple-400 font-bold hover:underline bg-transparent border-none cursor-pointer">
      Observe Leadership Synergies &rarr;
    </button>
  </div>
</div>

<!-- SANDBOX CONTROL BOARD -->
<div id="systems-sandbox" class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-start">
  <div class="lg:col-span-5 p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-white/10 space-y-6">
    <div>
      <span class="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">Interactive Systems Framework</span>
      <h2 class="text-2xl font-extrabold text-white">Homeostatic Feedback Sandbox</h2>
    </div>

    <div class="space-y-4 font-sans">
      <div>
        <label class="flex justify-between text-sm text-slate-400 mb-2">
          <span>Environmental Stress Level</span>
          <span id="stressValue" class="text-emerald-400 font-bold">Low</span>
        </label>
        <input id="stressSlider" type="range" min="1" max="10" value="2" class="w-full accent-emerald-400" oninput="updateSimulation()">
      </div>

      <div>
        <label class="flex justify-between text-sm text-slate-400 mb-2">
          <span>Feedback Response Efficiency</span>
          <span id="efficiencyValue" class="text-cyan-400 font-bold">Standard</span>
        </label>
        <input id="efficiencySlider" type="range" min="1" max="10" value="5" class="w-full accent-cyan-400" oninput="updateSimulation()">
      </div>
    </div>

    <div id="loopOutcome" class="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed">
      🚀 <strong>Outcome:</strong> System maintains solid homeostatic equilibrium. Feedback parameters easily counter external environmental stresses.
    </div>

    <div class="grid grid-cols-2 gap-3 font-sans">
      <button id="generateCrisisBtn" onclick="triggerSystemCrisis()" class="py-3 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-200 font-semibold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2">
        <span>✨ Generate Crisis Scenario</span>
      </button>

      <button id="visualizeSystemStateBtn" onclick="generateCinematicConceptArt('simulator')" class="py-3 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 font-semibold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2">
        <span>✨ Generate State Hologram</span>
      </button>
    </div>
  </div>

  <!-- NETWORK DISPLAY MATRIX -->
  <div class="lg:col-span-7 w-full h-[350px] md:h-[450px] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/10 bg-slate-950/40">
    <div class="absolute top-0 left-0 w-full h-full bg-slate-900/40 pointer-events-none"></div>
    
    <div class="flex items-center justify-between relative z-10 font-sans">
      <span class="text-xs uppercase tracking-widest text-slate-400 font-semibold">Active Feedback Visualization</span>
      <div class="flex items-center space-x-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span class="text-[10px] text-slate-300">Live Feedback Network</span>
      </div>
    </div>

    <div class="relative w-full h-[250px] flex items-center justify-center">
      <div id="sysNodeCenter" class="absolute w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-400/40 flex items-center justify-center text-center p-2 z-10 transition-all duration-300">
        <span class="text-xs font-bold text-white leading-tight">SYSTEM STATUS</span>
      </div>
      <div id="sysNodeA" class="absolute left-10 md:left-24 top-1/4 w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-center p-2 z-10 transition-all duration-300">
        <span class="text-[10px] font-semibold text-slate-300">Stressor</span>
      </div>
      <div id="sysNodeB" class="absolute right-10 md:right-24 bottom-1/4 w-16 h-16 rounded-full bg-purple-500/10 border border-purple-400/40 flex items-center justify-center text-center p-2 z-10 transition-all duration-300">
        <span class="text-[10px] font-semibold text-slate-300">Response</span>
      </div>

      <svg class="absolute inset-0 w-full h-full pointer-events-none">
        <line id="lineA" x1="0" y1="0" x2="0" y2="0" stroke="rgba(56,189,248,0.25)" stroke-width="2" stroke-dasharray="4"/>
        <line id="lineB" x1="0" y1="0" x2="0" y2="0" stroke="rgba(168,85,247,0.25)" stroke-width="2" stroke-dasharray="4"/>
        <line id="lineC" x1="0" y1="0" x2="0" y2="0" stroke="rgba(0,255,180,0.25)" stroke-width="2" />
      </svg>
    </div>

    <div class="relative z-10 w-full font-sans">
      <div class="flex justify-between text-[11px] text-slate-400 mb-1.5">
        <span>System Stability Metrics</span>
        <span id="healthPercent" class="text-emerald-400 font-semibold">96% Stable</span>
      </div>
      <div class="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
        <div id="healthFill" class="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-300" style="width: 96%"></div>
      </div>
    </div>
  </div>
</div>

<!-- REFLECTIVE JOURNAL LEDGER SYSTEM -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
  <div class="p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-white/10 space-y-6">
    <div>
      <span class="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1">Metacognitive Ledgers</span>
      <h2 class="text-2xl font-extrabold text-white">Reflective Systems Journal</h2>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subject Link / System Context</label>
        <input id="journalSubject" type="text" placeholder="e.g. Mitochondria & Organizational Output" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 text-white">
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Internal Reflective Observations</label>
        <textarea id="journalLog" rows="5" placeholder="Which biological processes patterns did you observe today inside human interactions, personal workflows, or organizational dynamics?" class="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white leading-relaxed"></textarea>
      </div>

      <div class="flex items-center justify-between font-sans">
        <button onclick="saveJournalEntry()" class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
          Commit To Log
        </button>
        <span id="journalStatus" class="text-xs text-slate-500">Local in-memory instance</span>
      </div>
    </div>
  </div>

  <div class="p-6 rounded-3xl flex flex-col justify-between bg-slate-900/40 border border-white/10">
    <div class="space-y-4">
      <h3 class="text-sm font-bold text-white uppercase tracking-wider">Previous Ledgers (Local)</h3>
      <div id="journalEntries" class="space-y-3 max-h-[150px] overflow-y-auto pr-1">
        <div class="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1 hover:border-emerald-500/20 cursor-pointer transition-all">
          <div class="flex justify-between font-bold text-white">
            <span>Homeostasis & Mindset</span>
            <span class="text-[9px] text-emerald-400">Active</span>
          </div>
          <p class="text-slate-400 line-clamp-2">Noticed that when stress triggers rise, psychological homeostasis fails exactly like cellular functions without buffering reserves.</p>
        </div>
      </div>
    </div>

    <div class="space-y-4 mt-6 border-t border-white/10 pt-6">
      <h3 class="text-sm font-bold text-white uppercase tracking-wider text-teal-400">Latest Academic Expeditions</h3>
      <div class="space-y-3 max-h-[250px] overflow-y-auto pr-1">
        {% for post in paginator.posts %}
        <a href="{{ post.url | relative_url }}" class="block p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1 hover:border-emerald-500/20 cursor-pointer transition-all group">
          <div class="flex justify-between font-bold text-white group-hover:text-emerald-400 transition-colors">
            <span class="truncate pr-2">{{ post.title }}</span>
            <span class="text-[9px] text-emerald-500 flex-shrink-0">{{ post.date | date: "%b %d" }}</span>
          </div>
          <p class="text-slate-400 line-clamp-2 mt-1">{{ post.excerpt | strip_html | truncatewords: 12 }}</p>
        </a>
        {% endfor %}
      </div>
      
      <!-- Jekyll Paginate V2 Controls -->
      {% if paginator.total_pages > 1 %}
      <div class="flex items-center justify-between mt-3 px-1">
        {% if paginator.previous_page %}
        <a href="{{ paginator.previous_page_path | relative_url }}" class="text-[10px] uppercase tracking-widest text-[#3ee7b6] hover:text-emerald-300 font-bold transition-all">&larr; Newer</a>
        {% else %}
        <span class="text-[10px] uppercase tracking-widest text-slate-600 font-bold cursor-not-allowed">&larr; Newer</span>
        {% endif %}
        
        <span class="text-[10px] text-slate-400 font-mono">Page {{ paginator.page }} of {{ paginator.total_pages }}</span>
        
        {% if paginator.next_page %}
        <a href="{{ paginator.next_page_path | relative_url }}" class="text-[10px] uppercase tracking-widest text-[#3ee7b6] hover:text-emerald-300 font-bold transition-all">Older &rarr;</a>
        {% else %}
        <span class="text-[10px] uppercase tracking-widest text-slate-600 font-bold cursor-not-allowed">Older &rarr;</span>
        {% endif %}
      </div>
      {% endif %}
    </div>

    <div class="pt-4 border-t border-white/5 mt-4 space-y-2 font-sans">
      <button id="synthesizeJournalBtn" onclick="synthesizeJournalLogs()" class="w-full py-2.5 bg-[#00ffbc]/10 hover:bg-[#00ffbc]/20 text-[#00ffbc] text-xs font-semibold rounded-xl border border-[#00ffbc]/20 transition-all flex items-center justify-center space-x-1.5">
        <span>✨ Synthesize Systems Connections</span>
      </button>
    </div>
  </div>
</div>

<!-- CALL TO ACTIONS (EVALUATIONS) -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
  <div class="p-8 rounded-3xl bg-slate-900/40 border border-[#3ee7b6]/20 flex flex-col justify-between items-start space-y-6">
    <div>
      <span class="text-xs font-bold uppercase tracking-wider text-[#3ee7b6]">Self Realization Evaluation</span>
      <h3 class="text-2xl font-extrabold text-white mt-1">"Your Life is the Most Precious Gift..."</h3>
      <p class="text-sm text-slate-300 mt-2 leading-relaxed">
        Take the primary Multidimensional Intelligence evaluation. Uncover how biological systems thinking can redefine your potential and personal learning habits.
      </p>
    </div>
    <button onclick="showAlert('Evaluation Initialized', 'Navigating to the Multidimensional Intelligence Sandbox...')" class="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-[#020813] font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
      Initialize MI Test &rarr;
    </button>
  </div>

  <div class="p-8 rounded-3xl bg-slate-900/40 border border-[#7c5cff]/20 flex flex-col justify-between items-start space-y-6">
    <div>
      <span class="text-xs font-bold uppercase tracking-wider text-purple-400">Identity Alignment</span>
      <h3 class="text-2xl font-extrabold text-white mt-1">"Find Yourself within You"</h3>
      <p class="text-sm text-slate-300 mt-2 leading-relaxed">
        Unlock your personalized neural profile. Discover the hidden behavioral blueprints shaping your daily focus, anxiety levels, and motivation triggers.
      </p>
    </div>
    <button onclick="showAlert('Evaluation Initialized', 'Decrypting genetic behavioural parameters...')" class="px-6 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-400 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
      Launch Personality Sandbox &rarr;
    </button>
  </div>
</div>

<!-- SOCRATIC CORE DIALOGUE CONSOLE -->
<div id="socratic-dialogue" class="mt-12 p-6 md:p-8 rounded-3xl bg-slate-950/20 border border-white/5 relative">
  <div class="relative z-10 flex flex-col space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Socratic Pedagogy AI Engine</span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white mt-1">Dialogue Sandbox</h2>
      </div>
      <div class="flex items-center space-x-2 font-sans">
        <div class="mr-2">
          <select id="ttsVoiceSelect" class="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none">
            <option value="Charon">Wise Mentor (Charon)</option>
            <option value="Kore">Empathetic Sage (Kore)</option>
            <option value="Leda">Synthesized Intelligence (Leda)</option>
          </select>
        </div>
        <div class="flex items-center space-x-2 bg-black/40 px-3.5 py-1.5 rounded-full border border-white/5">
          <span id="aiStatusGlow" class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span id="aiStatusText" class="text-xs font-medium text-slate-300">Ready for Dialogue</span>
        </div>
      </div>
    </div>

    <p class="text-slate-300 max-w-3xl font-light">
      This engine uses non-linear questioning systems to guide you into understanding how a biological process reflects deep organizational structures or human psychology. Choose a question or initiate yours.
    </p>

    <div class="flex flex-wrap gap-2 pt-2 font-sans">
      <button onclick="usePredefinedQuery('How does cellular homeostasis mirror psychological balance?')" class="px-4 py-2 bg-white/5 hover:bg-[#00ffbc]/10 hover:text-[#00ffbc] border border-white/5 rounded-lg text-xs font-medium transition-all">
        🌿 Homeostasis & Psychology
      </button>
      <button onclick="usePredefinedQuery('What can mitochondrial energy systems teach us about team motivation?')" class="px-4 py-2 bg-white/5 hover:bg-[#00ffbc]/10 hover:text-[#00ffbc] border border-white/5 rounded-lg text-xs font-medium transition-all">
        ⚡ Mitochondria & Motivation
      </button>
      <button onclick="usePredefinedQuery('How do cellular membranes mimic organizational boundaries?')" class="px-4 py-2 bg-white/5 hover:bg-[#00ffbc]/10 hover:text-[#00ffbc] border border-white/5 rounded-lg text-xs font-medium transition-all">
        🧬 Membranes & Organizations
      </button>
    </div>

    <div id="dialogueContainer" class="min-h-[250px] max-h-[400px] overflow-y-auto bg-black/50 border border-white/5 rounded-2xl p-6 flex flex-col space-y-4">
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 text-sm font-bold">S</div>
        <div class="bg-slate-900/60 p-4 rounded-2xl rounded-tl-none border border-white/5 text-sm max-w-[85%] text-slate-200">
          <div class="flex justify-between items-start mb-2 font-sans">
            <span class="font-bold text-xs uppercase text-emerald-400">Synapse Core</span>
            <button onclick="speakText(this, 'Welcome to Learning Biology For Life. I am your Socratic partner. By comparing biological patterns with your own behavior and environments, we discover deep systemic truths. What biological phenomenon or behavior shall we investigate?')" class="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-1" title="✨ Read Aloud with Gemini TTS">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"/>
              </svg>
              <span class="text-[10px]">✨ Listen</span>
            </button>
          </div>
          Welcome to Learning Biology For Life. I am your Socratic partner. By comparing biological patterns with your own behavior and environments, we discover deep systemic truths. What biological phenomenon or behavior shall we investigate?
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 pt-2 font-sans">
      <input id="socraticQuery" type="text" placeholder="Type your thought, question or response here..." class="flex-grow bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50">
      <button id="sendBtn" onclick="handleSocraticSubmit()" class="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl flex items-center justify-center space-x-2 transition-all">
        <span>Engage</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </div>
  </div>
</div>

<!-- SYSTEM ANALYSIS CORE DIALOGUE MODAL POPUPS -->
<div id="synthesisModal" class="hidden fixed inset-0 z-[10000] flex flex-col justify-between p-6 bg-slate-950/90 border border-white/10 max-w-xl mx-auto my-12 rounded-3xl">
  <div class="flex items-center justify-between border-b border-white/10 pb-4">
    <div class="flex items-center space-x-2">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
      <h3 class="text-lg font-bold text-white uppercase tracking-wider">Metacognitive Systems Synthesis</h3>
    </div>
    <button onclick="closeSynthesisModal()" class="text-slate-400 hover:text-white text-xl">&times;</button>
  </div>

  <div id="synthesisModalContent" class="text-sm text-slate-200 leading-relaxed overflow-y-auto pr-2 space-y-4 flex-grow"></div>

  <div class="flex items-center justify-end border-t border-white/10 pt-4">
    <button onclick="closeSynthesisModal()" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
      Acknowledge & Close
    </button>
  </div>
</div>

<!-- SYSTEM ENGINE CONTEXT GRAPH VISUALIZATION MODAL POPUPS -->
<div id="illustrationModal" class="hidden fixed inset-0 z-[10000] flex flex-col justify-between p-6 bg-slate-950/90 border border-white/10 max-w-xl mx-auto my-12 rounded-3xl">
  <div class="flex items-center justify-between border-b border-white/10 pb-4">
    <div class="flex items-center space-x-2">
      <span class="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></span>
      <h3 class="text-md font-bold text-white uppercase tracking-wider">✨ Synaptic Hologram Generated</h3>
    </div>
    <button onclick="closeIllustrationModal()" class="text-slate-400 hover:text-white text-xl">&times;</button>
  </div>

  <div id="illustrationArea" class="flex flex-col items-center justify-center aspect-square w-full relative rounded-2xl overflow-hidden bg-black/40 border border-white/5">
    <div id="illustrationLoader" class="flex flex-col items-center justify-center p-6 space-y-4">
      <div class="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-400 animate-spin"></div>
      <p class="text-slate-400 text-sm animate-pulse font-medium text-center">Projecting biological structure onto localized coordinate grid...</p>
    </div>
    <img id="generatedImageElement" src="" alt="Neural Concept Visualization" class="w-full h-full object-cover hidden" />
  </div>

  <div class="p-4 bg-slate-950/60 rounded-xl border border-white/5">
    <p id="illustrationDescription" class="text-xs text-slate-300 leading-relaxed italic"></p>
  </div>

  <div class="flex items-center justify-between border-t border-white/10 pt-4">
    <span class="text-[10px] text-slate-500 font-mono">Rendered via Imagen 4.0</span>
    <button onclick="closeIllustrationModal()" class="px-5 py-2 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
      De-materialize
    </button>
  </div>
</div>
