<#
.SYNOPSIS
    Biological Neural Network — Safe Architecture Patch v2.0
    Preserves masthead inheritance, removes inline styles, enforces UTF-8 without BOM.
#>
param([switch]$Apply)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot  = (Get-Location).Path
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-SafeFile {
    param([string]$Path, [string]$Content)
    $Content = $Content -replace "`r`n", "`n" -replace "`r", "`n"
    $Dir = Split-Path $Path
    if (-not (Test-Path $Dir)) { $null = New-Item -ItemType Directory -Path $Dir -Force }
    [System.IO.File]::WriteAllText($Path, $Content, $Utf8NoBom)
    Write-Host "  WRITTEN: $Path" -ForegroundColor Green
}

# =========================================================================================
# SAFETY CHECK
# =========================================================================================
$GitStatus = & git status --porcelain
if ($GitStatus) { throw "Working tree is dirty. Commit or stash first." }

if (-not $Apply) {
    Write-Host "AUDIT MODE. Use -Apply to execute." -ForegroundColor Yellow
    exit
}

# =========================================================================================
# STEP 1: CONFIG DEFAULTS (idempotent)
# =========================================================================================
$configPath = Join-Path $RepoRoot "_config.yml"
$config     = Get-Content $configPath -Raw

if ($config -notmatch "type:\s*concepts") {
    $defaultsBlock = @"

  - scope:
      path: ""
      type: concepts
    values:
      layout: concept_node
      author_profile: false
      classes: wide
      mastery_state: "locked"
      cognitive_depth: 1
"@
    $config = $config -replace '(# ==========================================================================\r?\n# AUTHOR)', "$defaultsBlock`n`n`$1"
    Write-SafeFile -Path $configPath -Content $config
    Write-Host "Step 1: Config defaults injected." -ForegroundColor Green
} else {
    Write-Host "Step 1: Config defaults already present. Skipped." -ForegroundColor Cyan
}

# =========================================================================================
# STEP 2: BIDIRECTIONAL GRAPH API (assets/js/graph.json)
# =========================================================================================
$graphPath = Join-Path $RepoRoot "assets/js/graph.json"
$graphJson = @'
---
layout: null
---
{
  "nodes": [
{%- for concept in site.concepts -%}
{%- assign slug = concept.slug | default: concept.title | slugify -%}
{%- assign title = concept.title | default: slug -%}
{%- unless title == blank -%}
    {
      "id": {{ slug | jsonify }},
      "title": {{ title | jsonify }},
      "category": {{ concept.category | jsonify }},
      "depth": {{ concept.cognitive_depth | default: 1 | jsonify }},
      "mastery_state": {{ concept.mastery_state | default: "locked" | jsonify }},
      "url": {{ concept.url | relative_url | jsonify }},
      "socratic_prompt": {{ concept.socratic_prompt | jsonify }}
    }{%- unless forloop.last -%},{%- endunless -%}
{%- endunless -%}
{%- endfor -%}
  ],
  "links": [
{%- assign has_links = false -%}
{%- for concept in site.concepts -%}
{%- assign c_slug = concept.slug | default: concept.title | slugify -%}
{%- if concept.prerequisites -%}
{%- for prereq in concept.prerequisites -%}
{%- if has_links -%},{%- endif -%}
    {
      "source": {{ prereq | jsonify }},
      "target": {{ c_slug | jsonify }},
      "type": "prerequisite"
    }
{%- assign has_links = true -%}
{%- endfor -%}
{%- endif -%}
{%- if concept.downstream_links -%}
{%- for d_link in concept.downstream_links -%}
{%- if has_links -%},{%- endif -%}
    {
      "source": {{ c_slug | jsonify }},
      "target": {{ d_link | jsonify }},
      "type": "sequence"
    }
{%- assign has_links = true -%}
{%- endfor -%}
{%- endif -%}
{%- endfor -%}
  ]
}
'@
Write-SafeFile -Path $graphPath -Content $graphJson
Write-Host "Step 2: Bidirectional graph API written." -ForegroundColor Green

# =========================================================================================
# STEP 3: CONCEPT NODE LAYOUT (layout: default, no inline styles, canvas restored)
# =========================================================================================
$layoutPath = Join-Path $RepoRoot "_layouts/concept_node.html"
$layoutHtml = @'
---
layout: default
---

<nav class="synaptic-breadcrumb-bar" aria-label="Synaptic path">
  <div class="breadcrumb-track">
    <span class="sys-metric breadcrumb-label">Vector:</span>
    <a href="{{ '/categories/' | append: page.category | downcase | relative_url }}">
      {{ page.category | default: "Matrix" }}
    </a>
    <span class="breadcrumb-separator">&#8212;&#8212;&#9889;&#8212;&#8212;&gt;</span>
    <span class="current-node">{{ page.title }}</span>
  </div>
  <div class="user-telemetry sys-metric">
    Depth: <span>Lvl {{ page.cognitive_depth | default: 1 }}</span>
  </div>
</nav>

<div class="neural-concept-workspace">

  <section class="neural-canvas-pane" aria-label="Interactive Graph Network Space">
    <canvas id="neuralNetworkCanvas"></canvas>
  </section>

  <section class="neural-content-pane" aria-label="Concept Details and Learning Interface">

    <article class="quantum-node-card" data-state="{{ page.mastery_state | default: 'locked' }}">

      <header class="node-card-header">
        <div class="category-tag sys-metric">
          {{ page.category | default: "Biological Node" | upcase }}
        </div>
        <h1 class="page-main-title">{{ page.title }}</h1>

        <div class="vector-grid">
          {% if page.prerequisites %}
          <div class="vector-section">
            <span class="vector-label sys-metric">Upstream Prerequisites:</span>
            <div class="vector-list">
              {% for req in page.prerequisites %}
                {% assign req_node = site.concepts | where: "slug", req | first %}
                <a href="{{ req_node.url | default: '#' | relative_url }}" class="vector-chip prereq-chip">
                  {{ req_node.title | default: req | replace: '-', ' ' | capitalize }}
                </a>
              {% endfor %}
            </div>
          </div>
          {% endif %}

          {% if page.downstream_links %}
          <div class="vector-section">
            <span class="vector-label sys-metric downstream-label">Downstream Vectors:</span>
            <div class="vector-list">
              {% for link in page.downstream_links %}
                {% assign link_node = site.concepts | where: "slug", link | first %}
                <a href="{{ link_node.url | default: '#' | relative_url }}" class="vector-chip downstream-chip">
                  {{ link_node.title | default: link | replace: '-', ' ' | capitalize }} &rarr;
                </a>
              {% endfor %}
            </div>
          </div>
          {% endif %}
        </div>
      </header>

      <section class="node-body-content">
        {{ content }}
      </section>

      <section class="socratic-interface-dock" aria-label="Socratic Dialog Module">
        <h3>Socratic Simulation</h3>
        <p class="sys-metric socratic-subhead">[ CLOSING THE CIRCLE ]</p>

        <div id="socraticConsole" class="console-output" role="log" aria-live="polite">
          <p class="ai-prompt">
            {{ page.socratic_prompt | default: "Based on the biological parameters established in this node, synthesize your hypothesis on how this system responds to anomalous stress." }}
          </p>
        </div>

        <div class="input-row">
          <textarea id="socraticInput" placeholder="Synthesize your hypothesis here..." rows="5"></textarea>
        </div>
        <div class="action-row">
          <button id="submitResponseBtn" class="primary-btn" type="button">Transmit Vector</button>
        </div>
      </section>

    </article>

  </section>

</div>

<script defer src="{{ '/assets/js/neural-engine.js' | relative_url }}"></script>
'@
Write-SafeFile -Path $layoutPath -Content $layoutHtml
Write-Host "Step 3: Sanitized concept_node layout written." -ForegroundColor Green

Write-Host "`nPatch complete. Commit, build, and verify." -ForegroundColor Cyan
