# OMEGA Bilingual Route Audit
# Branch: feature/bilingual-polyglot
# Purpose: verify native English/Bangla Polyglot pilot output without touching production.

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$siteRoot = Join-Path $repoRoot "_site"
$englishAbout = Join-Path $siteRoot "about/index.html"
$banglaAbout = Join-Path $siteRoot "bn/about/index.html"
$englishBiology = Join-Path $siteRoot "biology/index.html"
$banglaBiology = Join-Path $siteRoot "bn/biology/index.html"

# Avoid raw non-ASCII literals in this script so Windows PowerShell 5.1 does not
# misread Bengali text when the script is stored as UTF-8 without BOM.
$banglaAuthorTitle = -join ([char[]](0x09B2, 0x09C7, 0x0996, 0x0995, 0x0020, 0x09AA, 0x09B0, 0x09BF, 0x099A, 0x09BF, 0x09A4, 0x09BF))
$banglaBiologyTitle = -join ([char[]](0x099C, 0x09C0, 0x09AC, 0x09AC, 0x09BF, 0x099C, 0x09CD, 0x099E, 0x09BE, 0x09A8))
$englishAboutHref = "href='https://learningbiologyforlife.org/about/'"
$banglaAboutHref = "href='https://learningbiologyforlife.org/bn/about/'"
$englishBiologyHref = "href='https://learningbiologyforlife.org/biology/'"
$banglaBiologyHref = "href='https://learningbiologyforlife.org/bn/biology/'"

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

Write-Host "OMEGA Bilingual Route Audit" -ForegroundColor Cyan
Write-Host "Repository: $repoRoot"
Write-Host "Site root:  $siteRoot"

if (-not (Test-Path $siteRoot)) {
  Add-Failure "_site directory does not exist. Run: bundle exec jekyll build"
}

Assert-FileExists -Path $englishAbout -Label "English About route" | Out-Null
Assert-FileExists -Path $banglaAbout -Label "Bangla About route" | Out-Null
Assert-FileExists -Path $englishBiology -Label "English Biology route" | Out-Null
Assert-FileExists -Path $banglaBiology -Label "Bangla Biology route" | Out-Null

# English About route invariants
Assert-Contains -Path $englishAbout -Pattern '<html lang="en" class="no-js">' -Label "English About html lang"
Assert-Contains -Path $englishAbout -Pattern '<link rel="canonical" href="https://learningbiologyforlife.org/about/" />' -Label "English About canonical"
Assert-Contains -Path $englishAbout -Pattern 'lbfl-language-switcher' -Label "English About native language switcher"
Assert-Contains -Path $englishAbout -Pattern $englishAboutHref -Label "English About switcher English href"
Assert-Contains -Path $englishAbout -Pattern $banglaAboutHref -Label "English About switcher Bangla href"

# Bangla About route invariants
Assert-Contains -Path $banglaAbout -Pattern '<html lang="bn" class="no-js">' -Label "Bangla About html lang"
Assert-Contains -Path $banglaAbout -Pattern '<link rel="canonical" href="https://learningbiologyforlife.org/bn/about/" />' -Label "Bangla About canonical"
Assert-Contains -Path $banglaAbout -Pattern $banglaAuthorTitle -Label "Native Bangla About title/body"
Assert-Contains -Path $banglaAbout -Pattern 'class="polyglot-jsonld-override"' -Label "Bangla About Polyglot JSON-LD override"
Assert-Contains -Path $banglaAbout -Pattern '"url": "https://learningbiologyforlife.org/bn/about/"' -Label "Bangla About JSON-LD override URL"
Assert-Contains -Path $banglaAbout -Pattern '<meta property="og:url" content="https://learningbiologyforlife.org/bn/about/">' -Label "Bangla About override og:url"
Assert-Contains -Path $banglaAbout -Pattern '<meta name="twitter:url" content="https://learningbiologyforlife.org/bn/about/">' -Label "Bangla About override twitter:url"
Assert-Contains -Path $banglaAbout -Pattern 'lbfl-language-switcher' -Label "Bangla About native language switcher"
Assert-Contains -Path $banglaAbout -Pattern $englishAboutHref -Label "Bangla About switcher English href"
Assert-Contains -Path $banglaAbout -Pattern $banglaAboutHref -Label "Bangla About switcher Bangla href"
Assert-Contains -Path $banglaAbout -Pattern 'hreflang="en" href="https://learningbiologyforlife.org/about/"' -Label "Bangla About English hreflang"
Assert-Contains -Path $banglaAbout -Pattern 'hreflang="bn" href="https://learningbiologyforlife.org/bn/about/"' -Label "Bangla About Bangla hreflang"
Assert-Contains -Path $banglaAbout -Pattern "href='https://learningbiologyforlife.org/about/' rel='alternate' hreflang='x-default'" -Label "Bangla About x-default hreflang"
Assert-Contains -Path $banglaAbout -Pattern 'google_translate_element' -Label "Bangla About temporary Google Translate bridge"

# English Biology route invariants
Assert-Contains -Path $englishBiology -Pattern '<html lang="en" class="no-js">' -Label "English Biology html lang"
Assert-Contains -Path $englishBiology -Pattern '<link rel="canonical" href="https://learningbiologyforlife.org/biology/" />' -Label "English Biology canonical"
Assert-Contains -Path $englishBiology -Pattern 'biology-matrix-hub-wrapper' -Label "English Biology Matrix wrapper"
Assert-Contains -Path $englishBiology -Pattern 'biology-matrix-card-link' -Label "English Biology Matrix cards"
Assert-Contains -Path $englishBiology -Pattern 'lbfl-language-switcher' -Label "English Biology native language switcher"
Assert-Contains -Path $englishBiology -Pattern $englishBiologyHref -Label "English Biology switcher English href"
Assert-Contains -Path $englishBiology -Pattern $banglaBiologyHref -Label "English Biology switcher Bangla href"

# Bangla Biology route invariants
Assert-Contains -Path $banglaBiology -Pattern '<html lang="bn" class="no-js">' -Label "Bangla Biology html lang"
Assert-Contains -Path $banglaBiology -Pattern '<link rel="canonical" href="https://learningbiologyforlife.org/bn/biology/" />' -Label "Bangla Biology canonical"
Assert-Contains -Path $banglaBiology -Pattern $banglaBiologyTitle -Label "Native Bangla Biology title/body"
Assert-Contains -Path $banglaBiology -Pattern 'biology-matrix-hub-wrapper' -Label "Bangla Biology Matrix wrapper"
Assert-Contains -Path $banglaBiology -Pattern 'biology-matrix-card-link' -Label "Bangla Biology Matrix cards"
Assert-Contains -Path $banglaBiology -Pattern 'lbfl-language-switcher' -Label "Bangla Biology native language switcher"
Assert-Contains -Path $banglaBiology -Pattern $englishBiologyHref -Label "Bangla Biology switcher English href"
Assert-Contains -Path $banglaBiology -Pattern $banglaBiologyHref -Label "Bangla Biology switcher Bangla href"
Assert-Contains -Path $banglaBiology -Pattern 'class="polyglot-jsonld-override"' -Label "Bangla Biology Polyglot JSON-LD override"
Assert-Contains -Path $banglaBiology -Pattern '"url": "https://learningbiologyforlife.org/bn/biology/"' -Label "Bangla Biology JSON-LD override URL"
Assert-Contains -Path $banglaBiology -Pattern "href='https://learningbiologyforlife.org/biology/' rel='alternate' hreflang='x-default'" -Label "Bangla Biology x-default hreflang"
Assert-Contains -Path $banglaBiology -Pattern 'google_translate_element' -Label "Bangla Biology temporary Google Translate bridge"

if ($failures.Count -gt 0) {
  Write-Host "`nBILINGUAL AUDIT FAILED" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host " - $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "`nBILINGUAL AUDIT PASSED" -ForegroundColor Green
Write-Host "Verified About and Biology bilingual pilot routes, native switcher, localized metadata override, x-default, and temporary translator bridge."
exit 0
