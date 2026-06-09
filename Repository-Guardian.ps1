<#
.SYNOPSIS
    Repository Guardian Engine - Enterprise Forensic Stabilization (10/10)
    TARGET: Jekyll 4.3.x + Minimal Mistakes + Custom Neural UI Kernel
.PARAMETER DryRun
    Simulates UTF-8 repairs and audits without writing any data to disk.
#>
param(
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$RepoRoot = $PWD.Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BranchName = "build-stabilization-$Timestamp"
$BackupDir = Join-Path $RepoRoot "_backup\$Timestamp"
$Exclusions = "_site|\.sass-cache|\.bundle|\.git|_backup|_archive"

# -----------------------------------------------------------------------------------------
# GLOBAL ROLLBACK TRAP
# -----------------------------------------------------------------------------------------
trap {
    Write-Host "`n[CRITICAL FAILURE] System Halt Initiated." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red

    if (Test-Path $BackupDir) {
        Write-Host "Restoring repository from backup..." -ForegroundColor Yellow
        Copy-Item "$BackupDir\*" $RepoRoot -Recurse -Force
        Write-Host "Backup restored successfully." -ForegroundColor Green
    }

    Write-Host "Resetting Git working tree to HEAD..." -ForegroundColor Yellow
    & git reset --hard HEAD

    exit 1
}

# -----------------------------------------------------------------------------------------
# STEP 1: VERIFY GIT WORKING TREE
# -----------------------------------------------------------------------------------------
Write-Host "`n[1/11] Verifying Git Working Tree..." -ForegroundColor Cyan
$GitStatus = & git status --porcelain
if ($GitStatus) {
    throw "Git working tree is dirty. Stash or commit changes before running the Guardian Engine."
}

# -----------------------------------------------------------------------------------------
# STEP 2 & 3: CREATE ISOLATION BRANCH AND BACKUP
# -----------------------------------------------------------------------------------------
if (-not $DryRun) {
    Write-Host "[2/11] Creating isolation branch: $BranchName" -ForegroundColor Cyan
    & git checkout -b $BranchName

    Write-Host "[3/11] Snapshotting architecture to $BackupDir..." -ForegroundColor Cyan
    $null = New-Item -ItemType Directory -Path $BackupDir -Force
    $ProtectedTargets = @("assets", "_sass", "_includes", "_pages", "_config.yml", "index.html")
    foreach ($Target in $ProtectedTargets) {
        $SourcePath = Join-Path $RepoRoot $Target
        if (Test-Path $SourcePath) {
            Copy-Item -Path $SourcePath -Destination $BackupDir -Recurse -Force
        }
    }
} else {
    Write-Host "[DRY RUN] Skipping Branching and Backup..." -ForegroundColor DarkGray
}

# -----------------------------------------------------------------------------------------
# STEP 4 & 5: FORENSIC AUDIT & REPORTING
# -----------------------------------------------------------------------------------------
Write-Host "`n[4/11] Executing Architecture Audit..." -ForegroundColor Cyan

# --- AUDIT: ROOT HTML COLLISIONS ---
$RootHtmlFiles = Get-ChildItem -Path $RepoRoot -Filter "*.html" -File
foreach ($HtmlFile in $RootHtmlFiles) {
    if ($HtmlFile.Name -eq "index.html") { continue }
    $MarkdownEquivalent = Join-Path $RepoRoot "_pages\$($HtmlFile.BaseName).md"
    if (Test-Path $MarkdownEquivalent) {
        Write-Host "[WARNING] Destination Collision: $($HtmlFile.Name) and _pages/$($HtmlFile.BaseName).md share routing. Archival recommended." -ForegroundColor Magenta
    }
}

# --- AUDIT: DUPLICATE PERMALINK & YAML VALIDATOR ---
$Routes = @{}
$MarkdownFiles = Get-ChildItem -Path $RepoRoot -Filter "*.md" -Recurse | Where-Object { $_.FullName -notmatch $Exclusions }

foreach ($File in $MarkdownFiles) {
    $Text = Get-Content $File.FullName -Raw
    
    # Check YAML boundaries
    if ($Text -notmatch '(?s)^\s*---.*?---') {
        throw "FATAL: Missing or broken YAML front matter in $($File.Name)"
    }

    # Check Permalinks
    if ($Text -match '(?m)^permalink:\s*(.+)') {
        $Key = $Matches[1].Trim()
        if ($Routes.ContainsKey($Key)) {
            throw "FATAL: Duplicate permalink detected: [$Key] in $($File.Name) (Conflicts with $($Routes[$Key]))"
        }
        $Routes[$Key] = $File.Name
    }
}

# --- AUDIT: CONFIGURATION KERNEL ---
$ConfigPath = Join-Path $RepoRoot "_config.yml"
if (Test-Path $ConfigPath) {
    $Config = Get-Content $ConfigPath -Raw
    if ($Config -notmatch "remote_theme") { Write-Host "[WARNING] _config.yml missing 'remote_theme' directive." -ForegroundColor Yellow }
    if ($Config -notmatch "include:\s*\n\s*-\s*_pages") { Write-Host "[WARNING] _config.yml missing '_pages' inclusion directive." -ForegroundColor Yellow }
}

# --- AUDIT: NAVIGATION KERNEL ---
$MastheadPath = Join-Path $RepoRoot "_includes\navigation\masthead.html"
if (Test-Path $MastheadPath) {
    $Masthead = Get-Content $MastheadPath -Raw
    $RequiredNavSelectors = @("neural-site-masthead", "desktop-nav-menu", "neural-sub-menu", "masthead-mobile-trigger", "masthead-mobile-dropdown-drawer")
    foreach ($Selector in $RequiredNavSelectors) {
        if ($Masthead -notmatch $Selector) {
            Write-Host "[WARNING] masthead.html is missing architecture-critical class: .$Selector" -ForegroundColor Yellow
        }
    }
}

# --- AUDIT: SCSS IMPORT & RESPONSIBILITY CONTRACTS ---
$MainScssPath = Join-Path $RepoRoot "assets\css\main.scss"
if (Test-Path $MainScssPath) {
    $MainScss = Get-Content $MainScssPath -Raw
    if ($MainScss -notmatch "minimal-mistakes") { Write-Host "[WARNING] assets/css/main.scss is missing Minimal Mistakes theme import." -ForegroundColor Yellow }
}

$ScssChecks = @{
    "_sass\components\_navigation.scss" = @("\.hero", "\.footer", "body\s*\{", "\.page")
    "_sass\layout\_homepage-stabilizer.scss" = @("desktop-nav-menu", "masthead", "mobile-trigger", "drawer")
    "_sass\layout\_omega-overrides.scss" = @("desktop-nav-menu", "hero-banner", "homepage-grid", "footer")
}

foreach ($Path in $ScssChecks.Keys) {
    $FullPath = Join-Path $RepoRoot $Path
    if (Test-Path $FullPath) {
        $ScssContent = Get-Content $FullPath -Raw
        foreach ($Forbidden in $ScssChecks[$Path]) {
            if ($ScssContent -match $Forbidden) {
                Write-Host "[WARNING] Responsibility Violation: $Path contains forbidden selector matching '$Forbidden'" -ForegroundColor Magenta
            }
        }
    }
}

# --- AUDIT: MOBILE DRAWER SINGLETON ---
$DrawerPath = Join-Path $RepoRoot "assets\js\mobile-drawer.js"
if (Test-Path $DrawerPath) {
    $DrawerJs = Get-Content $DrawerPath -Raw
    if ($DrawerJs -notmatch "addEventListener" -or $DrawerJs -notmatch "aria-expanded") {
        Write-Host "[WARNING] mobile-drawer.js is missing required event listeners or ARIA states." -ForegroundColor Yellow
    }
}
$ForbiddenJS = @("neural-nav.js", "synaptic-navigation.js")
foreach ($Script in $ForbiddenJS) {
    if (Test-Path (Join-Path $RepoRoot "assets\js\$Script")) {
        Write-Host "[WARNING] Multiple JS controllers detected. Remove $Script to enforce Singleton Contract." -ForegroundColor Magenta
    }
}

# -----------------------------------------------------------------------------------------
# STEP 6: MINIMAL PATCH (UTF-8 REPAIR)
# -----------------------------------------------------------------------------------------
Write-Host "`n[6/11] Running UTF-8 Compliance Scans..." -ForegroundColor Cyan

$ScannableFiles = Get-ChildItem -Path $RepoRoot -Include "*.md", "*.html", "*.scss", "*.yml" -Recurse | Where-Object { $_.FullName -notmatch $Exclusions }
foreach ($File in $ScannableFiles) {
    $RawBytes = Get-Content $File.FullName -Raw
    if ($RawBytes -match "[Ââ€™â€œâ€â€”ðŸ›‘â€¢â€¦â€‹â€“]") {
        if ($DryRun) {
            Write-Host "[DRY RUN] Would repair UTF-8 Mojibake in: $($File.Name)" -ForegroundColor DarkGray
        } else {
            Write-Host "  -> Repairing UTF-8 Encoding: $($File.Name)" -ForegroundColor Green
            $Scrubbed = $RawBytes.Replace("Â", "").Replace("â€™", "'").Replace("â€œ", "`"").Replace("â€", "`"").Replace("â€”", "-").Replace("ðŸ›‘", "").Replace("â€¢", "-").Replace("â€¦", "...").Replace("â€‹", "").Replace("â€“", "-")
            $Scrubbed = $Scrubbed -replace "`r`n", "`n" -replace "`r", "`n"
            [System.IO.File]::WriteAllText($File.FullName, $Scrubbed, $Utf8NoBom)
        }
    }
}

# -----------------------------------------------------------------------------------------
# STEP 7 & 8: BUILD VALIDATION
# -----------------------------------------------------------------------------------------
if (-not $DryRun) {
    Write-Host "`n[7/11] Running Jekyll Doctor..." -ForegroundColor Cyan
    & bundle exec jekyll doctor
    if ($LASTEXITCODE -ne 0) { throw "Jekyll Doctor failed. Integrity compromised." }

    Write-Host "`n[8/11] Running Jekyll Build (Trace)..." -ForegroundColor Cyan
    & bundle exec jekyll build --trace
    if ($LASTEXITCODE -ne 0) { throw "Jekyll Build failed. YAML or UTF-8 corruption persists." }
}

# -----------------------------------------------------------------------------------------
# STEP 9, 10 & 11: DEVELOPER REVIEW
# -----------------------------------------------------------------------------------------
Write-Host "`n[9/11] Generating Diff Summary for Developer Review..." -ForegroundColor Cyan
if (-not $DryRun) {
    & git add .
    & git status
    Write-Host "`n--- DIFF STATS ---" -ForegroundColor Yellow
    & git diff --cached --stat
    
    Write-Host "`n============================================================" -ForegroundColor Green
    Write-Host "GUARDIAN ENGINE COMPLETE: REPOSITORY VALIDATED." -ForegroundColor Green
    Write-Host "Branch '$BranchName' is staged with minimal patches." -ForegroundColor Green
    Write-Host "`n[STEP 10] Manual Commit Command:" -ForegroundColor White
    Write-Host "  git commit -m `"chore(architecture): forensic maintenance and UTF-8 normalization`"" -ForegroundColor DarkGray
    Write-Host "`n[STEP 11] Manual Push Command:" -ForegroundColor White
    Write-Host "  git push origin $BranchName" -ForegroundColor DarkGray
    Write-Host "============================================================" -ForegroundColor Green
} else {
    Write-Host "`n[DRY RUN COMPLETE] Zero bytes written to disk. Repository untouched." -ForegroundColor Yellow
}