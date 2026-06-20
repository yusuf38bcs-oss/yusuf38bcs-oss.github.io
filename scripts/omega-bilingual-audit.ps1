# OMEGA Bilingual Route Audit
# Branch: feature/bilingual-polyglot
# Purpose: verify native English/Bangla Polyglot pilot output without touching production.

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$siteRoot = Join-Path $repoRoot "_site"
$englishAbout = Join-Path $siteRoot "about/index.html"
$banglaAbout = Join-Path $siteRoot "bn/about/index.html"

$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure {
  param([string]$Message)
  $script:failures.Add($Message) | Out-Null
}

function Assert-FileExists {
  param(
    [string]$Path,
    [string]$Label
  )

  if (-not (Test-Path $Path)) {
    Add-Failure "$Label missing: $Path"
    return $false
  }

  return $true
}

function Assert-Contains {
  param(
    [string]$Path,
    [string]$Pattern,
    [string]$Label
  )

  if (-not (Test-Path $Path)) {
    Add-Failure "$Label cannot be checked because file is missing: $Path"
    return
  }

  $content = Get-Content $Path -Raw -Encoding UTF8
  if ($content -notmatch [regex]::Escape($Pattern)) {
    Add-Failure "$Label missing expected text: $Pattern"
  }
}

function Assert-Regex {
  param(
    [string]$Path,
    [string]$Pattern,
    [string]$Label
  )

  if (-not (Test-Path $Path)) {
    Add-Failure "$Label cannot be checked because file is missing: $Path"
    return
  }

  $content = Get-Content $Path -Raw -Encoding UTF8
  if ($content -notmatch $Pattern) {
    Add-Failure "$Label missing expected pattern: $Pattern"
  }
}

Write-Host "OMEGA Bilingual Route Audit" -ForegroundColor Cyan
Write-Host "Repository: $repoRoot"
Write-Host "Site root:  $siteRoot"

if (-not (Test-Path $siteRoot)) {
  Add-Failure "_site directory does not exist. Run: bundle exec jekyll build"
}

Assert-FileExists -Path $englishAbout -Label "English About route" | Out-Null
Assert-FileExists -Path $banglaAbout -Label "Bangla About route" | Out-Null

# English route invariants
Assert-Contains -Path $englishAbout -Pattern '<html lang="en" class="no-js">' -Label "English html lang"
Assert-Contains -Path $englishAbout -Pattern '<link rel="canonical" href="https://learningbiologyforlife.org/about/" />' -Label "English canonical"

# Bangla route invariants
Assert-Contains -Path $banglaAbout -Pattern '<html lang="bn" class="no-js">' -Label "Bangla html lang"
Assert-Contains -Path $banglaAbout -Pattern '<link rel="canonical" href="https://learningbiologyforlife.org/bn/about/" />' -Label "Bangla canonical"
Assert-Contains -Path $banglaAbout -Pattern 'লেখক পরিচিতি' -Label "Native Bangla title/body"
Assert-Contains -Path $banglaAbout -Pattern 'class="polyglot-jsonld-override"' -Label "Polyglot JSON-LD override"
Assert-Contains -Path $banglaAbout -Pattern '"url": "https://learningbiologyforlife.org/bn/about/"' -Label "Bangla JSON-LD override URL"
Assert-Contains -Path $banglaAbout -Pattern '<meta property="og:url" content="https://learningbiologyforlife.org/bn/about/">' -Label "Bangla override og:url"
Assert-Contains -Path $banglaAbout -Pattern '<meta name="twitter:url" content="https://learningbiologyforlife.org/bn/about/">' -Label "Bangla override twitter:url"

# Hreflang invariants
Assert-Contains -Path $banglaAbout -Pattern 'hreflang="en" href="https://learningbiologyforlife.org/about/"' -Label "Bangla page English hreflang"
Assert-Contains -Path $banglaAbout -Pattern 'hreflang="bn" href="https://learningbiologyforlife.org/bn/about/"' -Label "Bangla page Bangla hreflang"
Assert-Contains -Path $banglaAbout -Pattern "href='https://learningbiologyforlife.org/about/' rel='alternate' hreflang='x-default'" -Label "Bangla page x-default hreflang"

# Temporary bridge must remain during branch experiment.
Assert-Contains -Path $banglaAbout -Pattern 'google_translate_element' -Label "Temporary Google Translate bridge"

if ($failures.Count -gt 0) {
  Write-Host "`nBILINGUAL AUDIT FAILED" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host " - $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "`nBILINGUAL AUDIT PASSED" -ForegroundColor Green
Write-Host "Verified English and Bangla About pilot routes, localized metadata override, x-default, and temporary translator bridge."
exit 0
