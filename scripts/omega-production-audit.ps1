# ==========================================================================
# LEARNING BIOLOGY FOR LIFE - OMEGA PRODUCTION AUDIT
# ==========================================================================
$ErrorActionPreference = "Stop"

Write-Host "Starting LBFL Omega production audit..." -ForegroundColor Cyan

function Assert-FileExists {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        Write-Error "CRITICAL: Missing required file: $Path"
    }

    Write-Host "OK Exists: $Path" -ForegroundColor Green
}

function Assert-NoCorruptSpanArtifacts {
    $matches = Get-ChildItem -Recurse -File |
        Where-Object {
            $_.FullName -notmatch "\\.git\\" -and
            $_.FullName -notmatch "\\_site\\" -and
            $_.FullName -notmatch "\\node_modules\\" -and
            $_.FullName -notmatch "\\.jekyll-cache\\"
        } |
        Select-String -Pattern "\[span_[0-9]+\]"

    if ($matches) {
        $matches | ForEach-Object {
            Write-Host "$($_.Path):$($_.LineNumber) $($_.Line)" -ForegroundColor Red
        }
        Write-Error "CRITICAL: Corrupted [span_*] artifacts detected."
    }

    Write-Host "OK Artifact Check: No [span_*] corruption detected." -ForegroundColor Green
}

function Assert-Utf8NoBom {
    param([string]$Path)

    $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $Path))

    if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
        Write-Error "CRITICAL: UTF-8 BOM detected in $Path"
    }

    Write-Host "OK Encoding: $Path is UTF-8 without BOM." -ForegroundColor Green
}

function Assert-ScssFrontMatter {
    param([string]$Path)

    $lines = Get-Content $Path -TotalCount 2

    if ($lines.Count -lt 2 -or $lines[0] -ne "---") {
        Write-Error "CRITICAL: $Path must start with valid Jekyll front matter."
    }

    Write-Host "OK SCSS Front Matter: $Path has valid Jekyll front matter start." -ForegroundColor Green
}

Assert-FileExists "_config.yml"
Assert-FileExists "Gemfile"
Assert-FileExists "assets/css/main.scss"
Assert-FileExists "assets/js/socratic-component.js"
Assert-FileExists "assets/js/myelination-tracker.js"
Assert-FileExists "_includes/socratic/socratic-node.html"

Assert-Utf8NoBom "assets/css/main.scss"
Assert-ScssFrontMatter "assets/css/main.scss"
Assert-NoCorruptSpanArtifacts

if (Test-Path "_biology") {
    Write-Host "OK Collection Check: _biology collection exists." -ForegroundColor Green
} else {
    Write-Warning "WARN: _biology collection not found. Skip if biology pages are still stored as posts."
}

if ((Test-Path "wrangler.toml") -or (Test-Path "worker/wrangler.toml") -or (Test-Path "wrangler.jsonc") -or (Test-Path "worker/wrangler.jsonc")) {
    Write-Host "OK Worker Config: Wrangler configuration detected." -ForegroundColor Green
} else {
    Write-Warning "WARN: Wrangler config not detected. Required only if Worker source lives in this repo."
}

Write-Host "Running Jekyll build..." -ForegroundColor Cyan
bundle exec jekyll build

if ($LASTEXITCODE -ne 0) {
    Write-Error "CRITICAL: Jekyll build failed."
}

Write-Host "OK Build Check: Jekyll build completed successfully." -ForegroundColor Green
Write-Host "Omega audit completed. Review warnings before production deployment." -ForegroundColor Green
