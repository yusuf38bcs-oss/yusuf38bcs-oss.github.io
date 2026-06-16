# ==========================================================================
# LEARNING BIOLOGY FOR LIFE - OMEGA PRODUCTION AUDIT
# Jekyll + Minimal Mistakes + Cloudflare + AI Worker Contract Gate
# ==========================================================================
$ErrorActionPreference = "Stop"

$script:Failures = New-Object System.Collections.Generic.List[string]
$script:Warnings = New-Object System.Collections.Generic.List[string]
$script:Passes = 0

function Write-Ok { param([string]$Message) $script:Passes++; Write-Host "OK  $Message" -ForegroundColor Green }
function Write-Warn { param([string]$Message) $script:Warnings.Add($Message) | Out-Null; Write-Host "WARN $Message" -ForegroundColor Yellow }
function Write-Fail { param([string]$Message) $script:Failures.Add($Message) | Out-Null; Write-Host "FAIL $Message" -ForegroundColor Red }

function Assert-FileExists {
    param([string]$Path, [switch]$Optional)
    if (Test-Path $Path) { Write-Ok "Exists: $Path"; return }
    if ($Optional) { Write-Warn "Optional file missing: $Path" } else { Write-Fail "Missing required file: $Path" }
}

function Assert-DirectoryExists {
    param([string]$Path, [switch]$Optional)
    if (Test-Path $Path -PathType Container) { Write-Ok "Directory exists: $Path"; return }
    if ($Optional) { Write-Warn "Optional directory missing: $Path" } else { Write-Fail "Missing required directory: $Path" }
}

function Assert-Utf8NoBom {
    param([string]$Path)
    if (-not (Test-Path $Path)) { Write-Fail "Encoding target missing: $Path"; return }
    $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $Path))
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        Write-Fail "UTF-8 BOM detected in $Path"
    } else {
        Write-Ok "Encoding clean: $Path is UTF-8 without BOM"
    }
}

function Assert-Contains {
    param([string]$Path, [string]$Pattern, [string]$Name)
    if (-not (Test-Path $Path)) { Write-Fail "Cannot inspect missing file: $Path"; return }
    $text = Get-Content $Path -Raw
    if ($text -match $Pattern) { Write-Ok $Name } else { Write-Fail "$Name not found in $Path" }
}

function Assert-NotContains {
    param([string]$Path, [string]$Pattern, [string]$Name)
    if (-not (Test-Path $Path)) { Write-Fail "Cannot inspect missing file: $Path"; return }
    $text = Get-Content $Path -Raw
    if ($text -match $Pattern) { Write-Fail "$Name found in $Path" } else { Write-Ok $Name }
}

function Assert-NoCorruptSpanArtifacts {
    $matches = Get-ChildItem -Recurse -File |
        Where-Object {
            $_.FullName -notmatch "\\.git\\" -and
            $_.FullName -notmatch "\\_site\\" -and
            $_.FullName -notmatch "\\node_modules\\" -and
            $_.FullName -notmatch "\\vendor\\" -and
            $_.FullName -notmatch "\\.jekyll-cache\\" -and
            $_.FullName -notmatch "\\.sass-cache\\"
        } |
        Select-String -Pattern "\[span_[0-9]+\]" -ErrorAction SilentlyContinue

    if ($matches) {
        $matches | ForEach-Object { Write-Host "$($_.Path):$($_.LineNumber) $($_.Line)" -ForegroundColor Red }
        Write-Fail "Corrupted [span_*] artifacts detected"
    } else {
        Write-Ok "No corrupted [span_*] artifacts detected"
    }
}

function Assert-NoScssImportAmbiguity {
    if (-not (Test-Path "_sass")) { Write-Fail "_sass directory missing"; return }
    $sassRoot = (Resolve-Path "_sass").Path
    $groups = Get-ChildItem _sass -Recurse -File -Include *.scss |
        Group-Object {
            $dir = $_.DirectoryName.Replace($sassRoot, "").TrimStart([char]'\', [char]'/')
            $name = $_.BaseName.TrimStart([char]'_')
            if ($dir) { "$dir/$name".Replace("\", "/") } else { $name }
        } |
        Where-Object { $_.Count -gt 1 }

    if ($groups) {
        foreach ($group in $groups) {
            Write-Host "Duplicate SCSS import identity: $($group.Name)" -ForegroundColor Red
            $group.Group | ForEach-Object { Write-Host "  - $($_.FullName)" -ForegroundColor Red }
        }
        Write-Fail "SCSS import ambiguity detected"
    } else {
        Write-Ok "No SCSS partial/non-partial import ambiguity detected"
    }
}

function Assert-JekyllScssFrontMatter {
    $path = "assets/css/main.scss"
    if (-not (Test-Path $path)) { Write-Fail "Missing $path"; return }
    $lines = Get-Content $path
    if ($lines.Count -lt 2) {
        Write-Fail "main.scss is too short to contain valid Jekyll front matter"
        return
    }
    if ($lines[0] -ne "---") {
        Write-Fail "main.scss must begin with opening front matter delimiter ---"
        return
    }
    $closingIndex = -1
    for ($i = 1; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -eq "---") { $closingIndex = $i; break }
    }
    if ($closingIndex -gt 0) {
        Write-Ok "main.scss has valid Jekyll front matter boundary"
    } else {
        Write-Fail "main.scss must contain a closing front matter delimiter ---"
    }
}

function Assert-ConfigContracts {
    Assert-Contains "_config.yml" "collections:\s*`r?`n" "Jekyll collections block configured"
    Assert-Contains "_config.yml" "biology:\s*`r?`n\s+output:\s+true" "biology collection output enabled"
    Assert-Contains "_config.yml" "concepts:\s*`r?`n\s+output:\s+true" "concepts collection output enabled"
    Assert-Contains "_config.yml" "permalink:\s+/matrix/:path/" "concept matrix permalink contract configured"
    Assert-Contains "_config.yml" "jekyll-seo-tag" "SEO plugin configured"
    Assert-Contains "_config.yml" "jekyll-sitemap" "Sitemap plugin configured"
}

function Assert-HeadContracts {
    Assert-Contains "_includes/head/custom.html" "omega-blueprint-runtime" "Omega runtime mounted once through custom head"
    Assert-NotContains "_includes/head/custom.html" "include\s+head/head\.html" "No duplicate head/head.html include in head/custom.html"
    Assert-Contains "_includes/head/omega-blueprint-runtime.html" "LBFL_AI_ENDPOINT" "AI endpoint contract exposed to frontend"
    Assert-Contains "_includes/head/omega-blueprint-runtime.html" "socratic-component\.js" "Socratic component globally mounted"
    Assert-Contains "_includes/head/omega-blueprint-runtime.html" "myelination-tracker\.js" "Myelination tracker globally mounted"
}

function Assert-AIContracts {
    Assert-Contains "assets/js/socratic-component.js" "fetch\(API_ENDPOINT" "Frontend calls configured Socratic endpoint"
    Assert-Contains "assets/js/socratic-component.js" "application/json" "Socratic request sends JSON"
    Assert-Contains "assets/js/socratic-component.js" "mastery_achieved" "Socratic response mastery contract handled"
    Assert-Contains "assets/js/myelination-tracker.js" "localStorage" "Myelination state persistence exists"
    Assert-Contains "assets/js/myelination-tracker.js" "lbfl:node-myelinated" "Myelination event contract exists"
}

function Assert-StaticGraphContracts {
    Assert-FileExists "assets/data/graph_manifest.json"
    Assert-FileExists "assets/js/graph_engine.js"
    Assert-Contains "assets/data/graph_manifest.json" "site.data.neural_nodes" "Graph manifest reads neural nodes source"
    Assert-Contains "assets/data/graph_manifest.json" "site.data.neural_edges" "Graph manifest reads neural edges source"
    Assert-Contains "assets/js/graph_engine.js" "graph_manifest\.json" "Graph engine loads graph manifest"
}

function Assert-GeneratedRoute {
    param([string]$Path)
    if (Test-Path $Path) { Write-Ok "Generated route exists: $Path" } else { Write-Fail "Generated route missing: $Path" }
}

function Run-JekyllBuild {
    Write-Host "Running clean Jekyll build..." -ForegroundColor Cyan
    bundle exec jekyll clean
    if ($LASTEXITCODE -ne 0) { Write-Fail "jekyll clean failed"; return }

    bundle exec jekyll build --trace
    if ($LASTEXITCODE -ne 0) { Write-Fail "jekyll build failed"; return }
    Write-Ok "Jekyll build completed successfully"
}

function Assert-RenderedOutputContracts {
    Assert-GeneratedRoute "_site/index.html"
    Assert-GeneratedRoute "_site/biology/index.html"
    Assert-GeneratedRoute "_site/life-philosophy/index.html"
    Assert-GeneratedRoute "_site/synaptic-bridge/index.html"
    Assert-GeneratedRoute "_site/life-practices/index.html"
    Assert-GeneratedRoute "_site/life-practices/cognitive-audit/index.html"
    Assert-GeneratedRoute "_site/socratic/multiple-intelligences/index.html"
    Assert-GeneratedRoute "_site/socratic/personality-archetypes/index.html"
    Assert-GeneratedRoute "_site/matrix/behavioral-axis/index.html"
    Assert-GeneratedRoute "_site/matrix/decision-making/index.html"
    Assert-GeneratedRoute "_site/matrix/leadership-dynamics/index.html"
    Assert-GeneratedRoute "_site/matrix/systems-thinking/index.html"
    Assert-GeneratedRoute "_site/matrix/neuroplasticity/index.html"
    Assert-GeneratedRoute "_site/assets/data/graph_manifest.json"

    try {
        Get-Content "_site/assets/data/graph_manifest.json" -Raw | ConvertFrom-Json | Out-Null
        Write-Ok "Rendered graph_manifest.json is valid JSON"
    } catch {
        Write-Fail "Rendered graph_manifest.json is not valid JSON: $($_.Exception.Message)"
    }
}

function Assert-HtmlProoferAvailability {
    $htmlproofer = Get-Command htmlproofer -ErrorAction SilentlyContinue
    if ($htmlproofer) {
        Write-Host "Running HTMLProofer internal check..." -ForegroundColor Cyan
        htmlproofer ./_site --disable-external --ignore-empty-alt --ignore-missing-alt
        if ($LASTEXITCODE -eq 0) { Write-Ok "HTMLProofer internal rendered-output check passed" } else { Write-Fail "HTMLProofer internal rendered-output check failed" }
    } else {
        Write-Warn "HTMLProofer not installed; skipped rendered link proof. Install later with: gem install html-proofer"
    }
}

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "LBFL OMEGA PRODUCTION AUDIT START" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

Assert-FileExists "_config.yml"
Assert-FileExists "Gemfile"
Assert-FileExists "assets/css/main.scss"
Assert-FileExists "_includes/head/custom.html"
Assert-FileExists "_includes/head/omega-blueprint-runtime.html"
Assert-FileExists "assets/js/socratic-component.js"
Assert-FileExists "assets/js/myelination-tracker.js"
Assert-FileExists "_includes/socratic/socratic-node.html"
Assert-DirectoryExists "_biology"
Assert-DirectoryExists "_concepts"
Assert-Utf8NoBom "assets/css/main.scss"
Assert-JekyllScssFrontMatter
Assert-NoScssImportAmbiguity
Assert-NoCorruptSpanArtifacts
Assert-ConfigContracts
Assert-HeadContracts
Assert-AIContracts
Assert-StaticGraphContracts
Run-JekyllBuild
Assert-RenderedOutputContracts
Assert-HtmlProoferAvailability

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "LBFL OMEGA PRODUCTION AUDIT SUMMARY" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Passes: $script:Passes" -ForegroundColor Green
Write-Host "Warnings: $($script:Warnings.Count)" -ForegroundColor Yellow
Write-Host "Failures: $($script:Failures.Count)" -ForegroundColor Red

if ($script:Warnings.Count -gt 0) {
    Write-Host "Warnings:" -ForegroundColor Yellow
    $script:Warnings | ForEach-Object { Write-Host " - $_" -ForegroundColor Yellow }
}

if ($script:Failures.Count -gt 0) {
    Write-Host "Failures:" -ForegroundColor Red
    $script:Failures | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
    throw "OMEGA AUDIT FAILED. Fix the failures above before claiming 100/100 production."
}

Write-Host "OMEGA AUDIT PASSED. Repository is locally eligible for 100/100 production certification." -ForegroundColor Green
