# ==========================================================================
# UNIFIED RESPONSIVE UI AUDIT PATCH
# Learning Biology For Life | Targets: 320px–1920px
# ==========================================================================

Write-Host "Applying responsive UI audit patches..." -ForegroundColor Cyan

# --------------------------------------------------------------------------
# 1. NAVIGATION: Smaller toggle, fluid title, tighter mobile padding
# --------------------------------------------------------------------------
$Masthead = @'
<header class="neural-site-masthead">
  <div class="masthead-matrix-container">

    <div class="masthead-branding-node">
      <a href="{{ '/' | relative_url }}" class="masthead-logo-anchor">
        <img src="{{ site.logo | relative_url }}" alt="" class="masthead-clean-logo">
      </a>
      <a href="{{ '/' | relative_url }}" class="masthead-title-anchor">
        Learning Biology <span class="accent-neon">For Life</span>
      </a>
    </div>

    <button id="neural-mobile-toggle" class="masthead-mobile-trigger" aria-label="Expand Responsive Menu">
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
    </button>

    <nav class="masthead-desktop-navigation">
      <ul class="desktop-nav-menu">
        <li><a href="{{ '/' | relative_url }}" class="nav-main-link">Home</a></li>

        <li class="has-neural-dropdown">
          <a href="#" class="nav-main-link dropdown-trigger-node">Biology <span class="dropdown-arrow-indicator">▼</span></a>
          <ul class="neural-sub-menu">
            <li class="sub-menu-category-title">HSC Corner</li>
            <li><a href="{{ '/biology/hsc-corner/botany/' | relative_url }}">HSC Botany</a></li>
            <li><a href="{{ '/biology/hsc-corner/zoology/' | relative_url }}">HSC Zoology</a></li>
            <li class="sub-menu-category-title">Higher Zoology Tree</li>
            <li><a href="{{ '/synaptic-bridge/systems-biology/' | relative_url }}">Systems Biology</a></li>
            <li><a href="{{ '/synaptic-bridge/interdisciplinary-science/' | relative_url }}">Interdisciplinary Science</a></li>
          </ul>
        </li>

        <li class="has-neural-dropdown">
          <a href="#" class="nav-main-link dropdown-trigger-node">Synaptic Bridge <span class="dropdown-arrow-indicator">▼</span></a>
          <ul class="neural-sub-menu">
            <li class="sub-menu-category-title">4IR Ecosystem</li>
            <li><a href="{{ '/synaptic-bridge/4ir-education/' | relative_url }}">4IR Cognitive Education</a></li>
            <li><a href="{{ '/synaptic-bridge/knowledge-network/' | relative_url }}">Knowledge Network Hub</a></li>
            <li><a href="{{ '/synaptic-bridge/future-science/' | relative_url }}">Future Learning Science</a></li>
          </ul>
        </li>

        <li><a href="{{ '/life-practices/' | relative_url }}" class="nav-main-link">Life Practices</a></li>
        <li><a href="{{ '/socratic/' | relative_url }}" class="nav-main-link">Socratic 4.0</a></li>
        <li><a href="{{ '/contact/' | relative_url }}" class="nav-main-link">Contact</a></li>
      </ul>
    </nav>

  </div>

  <div id="neural-mobile-drawer" class="masthead-mobile-dropdown-drawer">
    <ul class="mobile-nav-menu-list">
      <li><a href="{{ '/' | relative_url }}">Home</a></li>

      <li class="mobile-menu-section-header">Biology Dynamic Stream</li>
      <li><a href="{{ '/biology/hsc-corner/botany/' | relative_url }}" class="mobile-sub-link">HSC Botany</a></li>
      <li><a href="{{ '/biology/hsc-corner/zoology/' | relative_url }}" class="mobile-sub-link">HSC Zoology</a></li>
      <li><a href="{{ '/synaptic-bridge/systems-biology/' | relative_url }}" class="mobile-sub-link">Systems Biology</a></li>
      <li><a href="{{ '/synaptic-bridge/interdisciplinary-science/' | relative_url }}" class="mobile-sub-link">Interdisciplinary Science</a></li>

      <li class="mobile-menu-section-header">Synaptic Core Arrays</li>
      <li><a href="{{ '/synaptic-bridge/4ir-education/' | relative_url }}" class="mobile-sub-link">4IR Cognitive Education</a></li>
      <li><a href="{{ '/synaptic-bridge/knowledge-network/' | relative_url }}" class="mobile-sub-link">Knowledge Network Hub</a></li>
      <li><a href="{{ '/synaptic-bridge/future-science/' | relative_url }}" class="mobile-sub-link">Future Learning Science</a></li>

      <li class="mobile-menu-section-header">Core Portals</li>
      <li><a href="{{ '/life-practices/' | relative_url }}">Life Practices</a></li>
      <li><a href="{{ '/socratic/' | relative_url }}">Socratic 4.0 Portal</a></li>
      <li><a href="{{ '/contact/' | relative_url }}">Contact Hub</a></li>
    </ul>
  </div>
</header>

<style>
  .neural-site-masthead {
    background-color: #020617 !important;
    border-bottom: 1px solid rgba(0, 212, 178, 0.08) !important;
    padding: 1rem 2rem !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    position: sticky;
    top: 0;
    z-index: 1000000;
    width: 100%;
    box-sizing: border-box;
  }

  .masthead-matrix-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .masthead-branding-node {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .masthead-clean-logo {
    height: 42px !important;
    width: 42px !important;
    border-radius: 0px !important;
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    object-fit: contain !important;
    flex-shrink: 0;
  }

  .masthead-title-anchor {
    color: #ffffff !important;
    font-weight: 800 !important;
    font-size: clamp(0.9rem, 3.8vw, 1.25rem) !important;
    text-decoration: none !important;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .masthead-title-anchor .accent-neon {
    color: #00d4b2;
  }

  .desktop-nav-menu {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    list-style: none !important;
    margin: 0; padding: 0;
  }

  .nav-main-link {
    color: #94a3b8 !important;
    text-decoration: none !important;
    font-size: 0.95rem !important;
    font-weight: 600 !important;
    transition: color 0.2s ease;
    white-space: nowrap;
  }

  .nav-main-link:hover, .has-neural-dropdown:hover .nav-main-link {
    color: #00d4b2 !important;
  }

  .dropdown-trigger-node .dropdown-arrow-indicator {
    font-size: 0.6rem;
    margin-left: 4px;
    color: #475569;
    display: inline-block;
    transition: transform 0.2s ease;
  }

  .has-neural-dropdown { position: relative; }

  .neural-sub-menu {
    position: absolute;
    top: 100%; left: 0;
    background-color: #0d1527 !important;
    border: 1px solid rgba(0, 212, 178, 0.12) !important;
    border-radius: 8px;
    padding: 1rem !important;
    width: 250px;
    display: none;
    list-style: none !important;
    margin: 0;
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  }

  .has-neural-dropdown:hover .neural-sub-menu {
    display: block;
    margin-top: 0.5rem;
  }

  .has-neural-dropdown:hover .dropdown-arrow-indicator {
    transform: rotate(180deg);
    color: #00d4b2;
  }

  .sub-menu-category-title {
    font-size: 0.72rem !important;
    text-transform: uppercase;
    color: #00d4b2 !important;
    font-weight: 700 !important;
    letter-spacing: 0.08em;
    padding: 0.6rem 0.75rem 0.25rem 0.75rem;
    opacity: 0.8;
  }

  .neural-sub-menu li a {
    display: block;
    color: #94a3b8 !important;
    padding: 0.5rem 0.75rem !important;
    font-size: 0.9rem !important;
    text-decoration: none !important;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .neural-sub-menu li a:hover {
    background-color: rgba(0, 212, 178, 0.04) !important;
    color: #ffffff !important;
    padding-left: 14px !important;
  }

  .masthead-mobile-trigger {
    background: none; border: none;
    display: none; flex-direction: column;
    gap: 4px; cursor: pointer; padding: 2px; outline: none;
    flex-shrink: 0;
  }

  .hamburger-bar {
    display: block; width: 20px; height: 2px;
    background-color: #00d4b2; border-radius: 2px;
    transition: transform 0.25s ease, opacity 0.25s ease;
  }

  .masthead-mobile-dropdown-drawer {
    display: none; background-color: #020617;
    border-top: 1px solid rgba(0, 212, 178, 0.08);
    position: absolute; top: 100%; left: 0; width: 100%;
    box-shadow: 0 15px 30px rgba(0,0,0,0.6);
    box-sizing: border-box;
  }

  .mobile-nav-menu-list {
    list-style: none !important; margin: 0;
    padding: 1.5rem !important; display: flex;
    flex-direction: column; gap: 1rem;
  }

  .mobile-nav-menu-list a {
    color: #ffffff !important; text-decoration: none !important;
    font-weight: 600; font-size: 1.05rem; display: block;
  }

  .mobile-menu-section-header {
    font-size: 0.75rem !important; text-transform: uppercase;
    color: #00d4b2 !important; font-weight: 700;
    letter-spacing: 0.05em; margin-top: 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    padding-bottom: 0.25rem;
  }

  .mobile-nav-menu-list .mobile-sub-link {
    color: #94a3b8 !important; font-size: 0.95rem;
    padding-left: 0.75rem; border-left: 1px solid rgba(0, 212, 178, 0.15);
  }

  @media (max-width: 992px) {
    .neural-site-masthead { padding: 0.75rem 1rem !important; }
    .masthead-desktop-navigation { display: none !important; }
    .masthead-mobile-trigger { display: flex; }
    .neural-site-masthead.is-active-drawer #neural-mobile-drawer { display: block; }
    .neural-site-masthead.is-active-drawer .hamburger-bar:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    .neural-site-masthead.is-active-drawer .hamburger-bar:nth-child(2) { opacity: 0; }
    .neural-site-masthead.is-active-drawer .hamburger-bar:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
  }

  @media (max-width: 480px) {
    .masthead-clean-logo { height: 34px !important; width: 34px !important; }
    .masthead-title-anchor { font-size: 0.9rem !important; }
  }

  @media (min-width: 1440px) {
    .masthead-matrix-container { max-width: 1600px; padding: 0 2.5rem; }
  }
</style>

<script>
  document.addEventListener("DOMContentLoaded", function() {
    const masthead = document.querySelector(".neural-site-masthead");
    const toggleBtn = document.getElementById("neural-mobile-toggle");
    if (toggleBtn && masthead) {
      toggleBtn.addEventListener("click", function(event) {
        event.stopPropagation();
        masthead.classList.toggle("is-active-drawer");
      });
      document.addEventListener("click", function(event) {
        if (!masthead.contains(event.target)) {
          masthead.classList.remove("is-active-drawer");
        }
      });
    }
  });
</script>
'@
Set-Content -Path ".\_includes\navigation\masthead.html" -Value $Masthead -Force -Encoding UTF8
Write-Host "[OK] masthead.html" -ForegroundColor Green

# --------------------------------------------------------------------------
# 2. NEURAL FLOW: Remove numbering + responsive grid
# --------------------------------------------------------------------------
$NeuralFlow = @'
<section class="premium-neural-flow-block" aria-label="Socratic conceptual mapping dashboard">
  <div class="flow-engine-container">

    <div class="flow-nodes-grid-axis">

      <div class="flow-node-card-slot" data-aos="fade-right">
        <div class="node-graphic-icon-box">
          <div class="pulsing-core-dot"></div>
        </div>
        <h3 class="flow-node-title">Biological Dots</h3>
        <p class="flow-node-desc">Isolate individual biological phenomena—whether a cranial nerve axis, an environmental niche, or a base pair nucleotide cluster—as a standalone data dot.</p>
      </div>

      <div class="flow-node-card-slot highlight-border-cyan" data-aos="fade-up">
        <div class="node-graphic-icon-box">
          <div class="vector-streaming-line"></div>
        </div>
        <h3 class="flow-node-title" style="color: #00d4b2 !important;">Interdisciplinary Lines</h3>
        <p class="flow-node-desc">Trace the structural connections where raw biology metrics actively intersect with psychological behaviors, neural leadership models, and systemic choices.</p>
      </div>

      <div class="flow-node-card-slot" data-aos="fade-left">
        <div class="node-graphic-icon-box">
          <div class="infinite-hollow-circle"></div>
        </div>
        <h3 class="flow-node-title">The Socratic Circle</h3>
        <p class="flow-node-desc">Complete the reflective learning circle back to divine wisdom, translating academic evidence into profound self-knowledge, active ethics, and global insight.</p>
      </div>

    </div>

  </div>
</section>

{% unless jekyll_neural_flow_styles_loaded %}
<style>
  .premium-neural-flow-block {
    background-color: #020617 !important;
    padding: 4rem 1.5rem !important;
    width: 100%;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  }

  .flow-engine-container {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }

  .flow-nodes-grid-axis {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    align-items: stretch;
  }

  @media (min-width: 768px) {
    .flow-nodes-grid-axis { grid-template-columns: repeat(2, 1fr); }
  }

  @media (min-width: 1024px) {
    .flow-nodes-grid-axis { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  }

  .flow-node-card-slot {
    background: #0d1527 !important;
    border: 1px solid rgba(255, 255, 255, 0.03) !important;
    border-radius: 12px !important;
    padding: 2rem 1.5rem !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
  }

  .flow-node-card-slot:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 212, 178, 0.2) !important;
  }

  .flow-node-card-slot.highlight-border-cyan {
    border-color: rgba(0, 212, 178, 0.1) !important;
    background: linear-gradient(145deg, #0d1527 0%, #070b13 100%) !important;
  }

  .node-graphic-icon-box {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 1.5rem;
  }

  .pulsing-core-dot {
    width: 10px; height: 10px;
    background-color: #00d4b2;
    border-radius: 50%;
    box-shadow: 0 0 12px #00d4b2;
    animation: corePulse 2s infinite ease-in-out;
  }

  .vector-streaming-line {
    width: 80px; height: 2px;
    background: linear-gradient(90deg, #00d4b2 0%, #3b82f6 100%);
    position: relative;
    border-radius: 2px;
  }

  .infinite-hollow-circle {
    width: 16px; height: 16px;
    border: 3px solid #00d4b2;
    border-radius: 50%;
    background: transparent;
    box-shadow: 0 0 10px rgba(0, 212, 178, 0.2);
  }

  .flow-node-title {
    color: #ffffff !important;
    font-size: 1.25rem !important;
    font-weight: 800 !important;
    margin: 0 0 0.85rem 0 !important;
    letter-spacing: -0.01em;
  }

  .flow-node-desc {
    color: #94a3b8 !important;
    font-size: 0.95rem !important;
    line-height: 1.6 !important;
    margin: 0 !important;
    text-align: left !important;
  }

  @keyframes corePulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.6; box-shadow: 0 0 18px #00d4b2; }
  }

  @media (max-width: 480px) {
    .premium-neural-flow-block { padding: 3rem 1rem !important; }
    .flow-node-card-slot { padding: 1.75rem 1.25rem !important; }
    .flow-node-title { font-size: 1.15rem !important; }
  }
</style>
{% assign jekyll_neural_flow_styles_loaded = true %}
{% endunless %}
'@
Set-Content -Path ".\_includes\home\neural-flow.html" -Value $NeuralFlow -Force -Encoding UTF8
Write-Host "[OK] neural-flow.html" -ForegroundColor Green

# --------------------------------------------------------------------------
# 3. ACADEMIC SECTIONS: Remove A/B/C + responsive grid
# --------------------------------------------------------------------------
$Academic = @'
<section class="synaptic-core-deck-wrapper" style="padding: 5rem 1.5rem; background-color: #020617;">
  <div style="max-width: 1400px; margin: 0 auto;">

    <div class="section-header" style="margin-bottom: 3rem; text-align: left;">
      <h2 style="font-size: clamp(1.5rem, 4vw, 2rem); color: #ffffff; border-bottom: 2px solid #00d4b2; display: inline-block; padding-bottom: 10px; margin: 0 0 0.5rem 0;">
        🧩 Central Knowledge Manifolds
      </h2>
      <p style="color: #94a3b8; margin: 0; font-size: 1rem;">Explore the clean-mapped relational collection grids of this platform.</p>
    </div>

    <div class="neural-card-matrix">
      <div class="neural-card-shell">
        <h3 style="color: #ffffff; margin-top: 0; font-size: 1.25rem;">Higher Zoology & Biostatistics</h3>
        <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.65; margin-bottom: 1.5rem;">
          Deep nested logs spanning Population Ecology dynamics, Survivorship trends, and mathematical applications including t-test and z-test calculations.
        </p>
        <a href="/biology/" style="color: #00d4b2; font-weight: bold; text-decoration: none; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 0.5rem;">Initialize Vector <span style="font-size: 1.1rem;">→</span></a>
      </div>

      <div class="neural-card-shell">
        <h3 style="color: #ffffff; margin-top: 0; font-size: 1.25rem;">Synaptic Bridge & Pedagogy</h3>
        <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.65; margin-bottom: 1.5rem;">
          Cross-disciplinary educational interfaces charting the nexus of leadership dynamics, human behavioral mechanics, and digital research structures.
        </p>
        <a href="/synaptic-bridge/" style="color: #00d4b2; font-weight: bold; text-decoration: none; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 0.5rem;">Initialize Vector <span style="font-size: 1.1rem;">→</span></a>
      </div>

      <div class="neural-card-shell">
        <h3 style="color: #ffffff; margin-top: 0; font-size: 1.25rem;">Cosmic Life Philosophy</h3>
        <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.65; margin-bottom: 1.5rem;">
          Sanitized English-mapped critical essays investigating the profound ontology of universal ethics, moral fortitude, and psychological analyses.
        </p>
        <a href="/life-philosophy/" style="color: #00d4b2; font-weight: bold; text-decoration: none; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 0.5rem;">Initialize Vector <span style="font-size: 1.1rem;">→</span></a>
      </div>
    </div>

  </div>
</section>

<style>
  .neural-card-matrix {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .neural-card-shell {
    background: rgba(15, 23, 42, 0.45);
    border: 1px solid rgba(0, 212, 178, 0.12);
    padding: 2rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.45);
    box-sizing: border-box;
  }
  @media (min-width: 768px) {
    .neural-card-matrix { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
  }
  @media (min-width: 1024px) {
    .neural-card-matrix { grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
    .neural-card-shell { padding: 2.5rem; }
  }
  @media (max-width: 480px) {
    .synaptic-core-deck-wrapper { padding: 3rem 1rem !important; }
    .neural-card-shell { padding: 1.5rem; }
  }
</style>
'@
Set-Content -Path ".\_includes\home\academic-sections.html" -Value $Academic -Force -Encoding UTF8
Write-Host "[OK] academic-sections.html" -ForegroundColor Green

# --------------------------------------------------------------------------
# 4. TESTS CTA: Responsive grid
# --------------------------------------------------------------------------
$TestsCTA = @'
<section class="premium-tests-cta-block" aria-label="Self-discovery assessment triggers">
  <div class="tests-matrix-grid-container">

    <a class="neural-cta-interactive-card cta-card--mi" href="{{ '/socratic/multiple-intelligences/' | relative_url }}" aria-label="Multiple Intelligences Analysis Test Track">
      <div class="neural-cta-content-shield">
        <div class="cta-badge-indicator">
          <span class="badge-pulse-dot"></span>
          <span class="badge-lbl-text">Cognitive Audit</span>
        </div>
        <h3 class="neural-cta-title-node">Your Life is the Most Precious Gift For You From Allah (SWT)</h3>
        <p class="neural-cta-desc-node">Discover the unique constellation of intelligences you possess. Through reflective questions and interactive analysis, uncover your cognitive strengths and learning preferences.</p>
        <div class="neural-cta-action-trigger">
          <span class="cta-action-text">Take MI Analysis</span>
          <span class="cta-indicator-arrow">→</span>
        </div>
      </div>
      <div class="neural-card-ambient-glow" aria-hidden="true"></div>
    </a>

    <a class="neural-cta-interactive-card cta-card--personality" href="{{ '/socratic/personality-archetypes/' | relative_url }}" aria-label="Personality Assessment Test Track">
      <div class="neural-cta-content-shield">
        <div class="cta-badge-indicator indicator--blue">
          <span class="badge-pulse-dot"></span>
          <span class="badge-lbl-text">Behavioral Axis</span>
        </div>
        <h3 class="neural-cta-title-node">Find Yourself <br>within You</h3>
        <p class="neural-cta-desc-node">Move beyond surface labels. This introspective assessment reveals your core values, behavioral patterns, strengths, and systemic areas for growth. Discover who you truly are.</p>
                <div class="neural-cta-action-trigger">
          <span class="cta-action-text">Begin Self-Discovery</span>
          <span class="cta-indicator-arrow">→</span>
        </div>
      </div>
      <div class="neural-card-ambient-glow" aria-hidden="true"></div>
    </a>

  </div>

  <div class="tests-unified-geometric-divider" aria-hidden="true">
    <div class="geo-solid-dot"></div>
    <div class="geo-horizontal-line"></div>
    <div class="geo-solid-dot"></div>
  </div>
</section>

<style>
  .premium-tests-cta-block {
    padding: clamp(3rem, 6vw, 5rem) 1.5rem !important;
    width: 100%;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  }
  .tests-matrix-grid-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
    align-items: stretch;
    box-sizing: border-box;
  }
  @media (min-width: 768px) {
    .tests-matrix-grid-container { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
  }
  @media (min-width: 1440px) {
    .tests-matrix-grid-container { gap: 2.5rem; }
  }
  .neural-cta-interactive-card {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 2.5rem 2rem !important;
    background: #0d1527 !important;
    border: 1px solid rgba(255, 255, 255, 0.03) !important;
    border-radius: 12px !important;
    text-decoration: none !important;
    overflow: hidden;
    box-sizing: border-box;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  }
  .neural-cta-interactive-card:hover {
    transform: translateY(-5px) !important;
    border-color: rgba(0, 212, 178, 0.25) !important;
    box-shadow: 0 20px 40px rgba(0, 212, 178, 0.05) !important;
    background: #0f172a !important;
  }
  .neural-cta-content-shield {
    position: relative;
    z-index: 5;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .cta-badge-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0, 212, 178, 0.04);
    border: 1px solid rgba(0, 212, 178, 0.15);
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 1.5rem;
    width: fit-content;
  }
  .cta-badge-indicator.indicator--blue {
    background: rgba(59, 130, 246, 0.04);
    border-color: rgba(59, 130, 246, 0.15);
  }
  .badge-pulse-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background-color: #00d4b2;
    box-shadow: 0 0 6px #00d4b2;
  }
  .cta-badge-indicator.indicator--blue .badge-pulse-dot {
    background-color: #3b82f6;
    box-shadow: 0 0 6px #3b82f6;
  }
  .badge-lbl-text {
    font-size: 0.72rem !important;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    color: #00d4b2 !important;
  }
  .cta-badge-indicator.indicator--blue .badge-lbl-text {
    color: #3b82f6 !important;
  }
  .neural-cta-title-node {
    margin: 0 0 1rem 0 !important;
    color: #ffffff !important;
    font-size: clamp(1.25rem, 3vw, 1.5rem) !important;
    line-height: 1.35 !important;
    font-weight: 800 !important;
    letter-spacing: -0.02em;
  }
  .neural-cta-desc-node {
    color: #94a3b8 !important;
    font-size: 0.95rem !important;
    line-height: 1.6 !important;
    margin: 0 0 2.5rem 0 !important;
    text-align: left !important;
  }
  .neural-cta-action-trigger {
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #ffffff !important;
    font-weight: 700 !important;
    font-size: 0.9rem !important;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    padding-top: 1.25rem;
    width: 100%;
    transition: color 0.2s ease;
  }
  .neural-cta-action-trigger .cta-indicator-arrow {
    color: #00d4b2 !important;
    transition: transform 0.2s ease;
  }
  .neural-cta-interactive-card:hover .neural-cta-action-trigger {
    color: #00d4b2 !important;
  }
  .neural-cta-interactive-card:hover .cta-indicator-arrow {
    transform: translateX(4px);
  }
  .tests-unified-geometric-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    margin-top: 3rem;
    user-select: none;
  }
  .geo-solid-dot {
    width: 5px; height: 5px;
    background-color: rgba(0, 212, 178, 0.2) !important;
    border-radius: 50%;
  }
  .geo-horizontal-line {
    width: 80px; height: 1px;
    background: rgba(0, 212, 178, 0.1);
  }
  @media (max-width: 480px) {
    .premium-tests-cta-block { padding: 3rem 1rem !important; }
    .neural-cta-interactive-card { padding: 2rem 1.25rem !important; }
    .neural-cta-title-node { font-size: 1.2rem !important; }
  }
</style>
'@
Set-Content -Path ".\_includes\home\tests-cta.html" -Value $TestsCTA -Force -Encoding UTF8
Write-Host "[OK] tests-cta.html" -ForegroundColor Green

# --------------------------------------------------------------------------
# 5. RECENT POSTS: Limit to 6 + responsive
# --------------------------------------------------------------------------
$RecentPosts = @'
<section class="recent-posts-viewport" style="padding: 5rem 1.5rem; background: #090d16; border-top: 1px solid rgba(255,255,255,0.05);">
  <div style="max-width: 900px; margin: 0 auto;">
    <h2 style="font-size: clamp(1.35rem, 4vw, 1.75rem); color: #ffffff; margin-bottom: 2.5rem; text-align: left;">⚡ Latest Scientific Logs</h2>

    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      {% assign docs = site.documents | where_exp: "doc", "doc.collection != 'posts'" | slice: 0, 6 %}
      {% for doc in docs %}
        <article style="background: #0f172a; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #00d4b2; box-shadow: 0 4px 20px rgba(0,0,0,0.2); box-sizing: border-box;">
          <span style="font-size: 0.8rem; color: #00d4b2; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">{{ doc.collection }}</span>
          <h3 style="margin: 0.4rem 0; font-size: clamp(1.05rem, 3vw, 1.25rem); line-height: 1.3;">
            <a href="{{ doc.url | relative_url }}" style="color: #ffffff; text-decoration: none;">{{ doc.title }}</a>
          </h3>
          <p style="color: #94a3b8; margin: 0; font-size: 0.9rem; line-height: 1.55;">{{ doc.excerpt | strip_html | truncatewords: 22 }}</p>
        </article>
      {% endfor %}
    </div>

  </div>
</section>

<style>
  @media (max-width: 480px) {
    .recent-posts-viewport { padding: 3rem 1rem !important; }
  }
</style>
'@
Set-Content -Path ".\_includes\home\recent-posts.html" -Value $RecentPosts -Force -Encoding UTF8
Write-Host "[OK] recent-posts.html (limited to 6)" -ForegroundColor Green

# --------------------------------------------------------------------------
# 6. HERO ENHANCEMENTS: Navbar gap fix + footer alignment + responsive
# --------------------------------------------------------------------------
$HeroEnhancements = @'
/* ==========================================================================
   CINEMATIC HERO ENHANCEMENTS ENGINE & FOOTER INTEGRATION
   ========================================================================== */

/* --- HERO / NAVBAR GAP ELIMINATION --- */
.neural-hero,
.neural-hero-shell,
.home-hero {
  margin-top: 0 !important;
  padding-top: clamp(5rem, 12vw, 8rem) !important;
}

/* --- MOBILE TOGGLE DESKTOP HIDE FIX --- */
.masthead-mobile-trigger,
#neural-mobile-toggle {
  display: none !important;
}

@media (max-width: 992px) {
  .masthead-mobile-trigger,
  #neural-mobile-toggle {
    display: flex !important;
  }
  .masthead-desktop-navigation {
    display: none !important;
  }
}

/* --- FOOTER ALIGNMENT FIXES --- */
.neural-footer,
.neural-core-footer {
  background-color: #020617 !important;
  border-top: 1px solid rgba(0, 212, 178, 0.1) !important;
  padding: 5rem 1.5rem 2rem 1.5rem !important;
  width: 100% !important;
  box-sizing: border-box !important;
  display: block !important;
  position: relative !important;
  z-index: 10 !important;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.footer-matrix-container {
  max-width: 1400px !important;
  margin: 0 auto !important;
  display: grid !important;
  grid-template-columns: 1fr !important;
  gap: 2.5rem !important;
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .footer-matrix-container {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 2.5rem !important;
  }
  .brand-profile-node,
  .dispatch-engine-node {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1024px) {
  .footer-matrix-container {
    grid-template-columns: 1.4fr 0.9fr 0.9fr 1.4fr !important;
    gap: 3rem !important;
  }
  .brand-profile-node,
  .dispatch-engine-node {
    grid-column: auto;
  }
}

.footer-matrix-title {
  font-size: clamp(1.25rem, 3vw, 1.5rem) !important;
  font-weight: 800 !important;
  color: #ffffff !important;
  line-height: 1.3 !important;
  margin: 0 0 1rem 0 !important;
}

.accent-neon {
  color: #00d4b2 !important;
}

.footer-matrix-desc {
  font-size: 0.92rem !important;
  color: #94a3b8 !important;
  line-height: 1.6 !important;
  text-align: left;
}

.footer-matrix-heading {
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  color: #f8fafc !important;
  margin: 0 0 1.25rem 0 !important;
}

.footer-matrix-nav {
  display: flex !important;
  flex-direction: column !important;
  gap: 0.75rem !important;
  align-items: flex-start;
}

.footer-matrix-link {
  color: #cbd5e1 !important;
  text-decoration: none !important;
  font-size: 0.95rem !important;
  transition: color 0.2s ease !important;
  text-align: left;
}

.footer-matrix-link:hover {
  color: #00d4b2 !important;
}

.newsletter-action-trigger {
  background: linear-gradient(135deg, #00d4b2 0%, #0055ff 100%) !important;
  color: #020617 !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 700 !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  transition: opacity 0.2s ease !important;
  width: 100%;
  max-width: 260px;
}

.newsletter-action-trigger:hover {
  opacity: 0.9 !important;
}

.footer-pedagogy-card {
  max-width: 1400px !important;
  margin: 4rem auto 2rem auto !important;
  background: rgba(7, 10, 19, 0.6) !important;
  border: 1px solid rgba(0, 212, 178, 0.1) !important;
  padding: 2rem !important;
  border-radius: 12px !important;
  box-sizing: border-box;
}

.footer-pedagogy-title {
  color: #00d4b2 !important;
  margin: 0 0 0.5rem 0 !important;
  font-weight: 700 !important;
}

.footer-pedagogy-text {
  color: #cbd5e1 !important;
  font-style: italic !important;
  line-height: 1.6 !important;
  margin: 0 !important;
}

.footer-base-strip {
  max-width: 1400px !important;
  margin: 2rem auto 0 auto !important;
  border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
  padding-top: 1.5rem !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: 1rem !important;
}

.footer-base-copyright {
  font-size: 0.88rem !important;
  color: #94a3b8 !important;
  margin: 0 !important;
}

.bright-text {
  color: #94a3b8 !important;
}

.footer-base-link {
  font-size: 0.88rem !important;
  color: #94a3b8 !important;
  text-decoration: none !important;
  transition: color 0.2s ease !important;
}

.footer-base-link:hover {
  color: #00d4b2 !important;
}

@media (max-width: 768px) {
  .neural-footer,
  .neural-core-footer {
    padding: 4rem 1.25rem 2rem 1.25rem !important;
  }
  .footer-matrix-container {
    gap: 2rem !important;
  }
  .footer-matrix-nav {
    align-items: center !important;
  }
  .footer-matrix-desc {
    text-align: center !important;
  }
  .footer-base-strip {
    flex-direction: column !important;
    text-align: center !important;
    justify-content: center !important;
  }
  .newsletter-action-trigger {
    max-width: 100% !important;
  }
  .footer-pedagogy-card {
    margin: 3rem 0.5rem 2rem 0.5rem !important;
    padding: 1.5rem !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero {
    animation: none !important;
    transition: none !important;
    background-attachment: scroll !important;
  }
}
'@
Set-Content -Path ".\_sass\components\_hero-enhancements.scss" -Value $HeroEnhancements -Force -Encoding UTF8
Write-Host "[OK] _hero-enhancements.scss" -ForegroundColor Green

# --------------------------------------------------------------------------
# 7. BUILD & DEPLOY
# --------------------------------------------------------------------------
Write-Host "`nBuilding Jekyll site..." -ForegroundColor Yellow
bundle exec jekyll clean
if ($LASTEXITCODE -ne 0) { Write-Error "Jekyll clean failed"; exit 1 }

bundle exec jekyll build --trace
if ($LASTEXITCODE -ne 0) { Write-Error "Jekyll build failed"; exit 1 }

Write-Host "`nStaging changes..." -ForegroundColor Cyan
git add _includes/navigation/masthead.html
git add _includes/home/neural-flow.html
git add _includes/home/academic-sections.html
git add _includes/home/tests-cta.html
git add _includes/home/recent-posts.html
git add _sass/components/_hero-enhancements.scss

Write-Host "`nCommitting..." -ForegroundColor Cyan
git commit -m "fix(ui): responsive audit — nav, hero, cards, footer, posts limit, grids, gaps"

Write-Host "`nPushing to origin..." -ForegroundColor Cyan
git push origin main

Write-Host 'Done! Cloudflare Pages will rebuild automatically.' -ForegroundColor Green