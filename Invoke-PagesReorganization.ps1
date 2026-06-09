<#
.SYNOPSIS
    Enterprise _pages/ taxonomy reorganization with permalink safety.
.PARAMETER Apply
    Execute moves. Omit for dry-run audit.
#>
param([switch]$Apply)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Get-Location).Path
$PagesDir = Join-Path $RepoRoot "_pages"

# =========================================================================================
# SAFETY PIPELINE
# =========================================================================================
$GitStatus = & git status --porcelain
if ($GitStatus) { throw "Working tree is dirty. Commit or stash first." }

if (-not $Apply) {
    Write-Host "AUDIT MODE. Use -Apply to execute.`n" -ForegroundColor Yellow
} else {
    Write-Host "EXECUTING REORGANIZATION...`n" -ForegroundColor Cyan
}

# =========================================================================================
# HELPERS
# =========================================================================================
function Has-Permalink {
    param([string]$FilePath)
    $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
    return ($content -match '^permalink:\s*\S+')
}

function Get-ImplicitPermalink {
    param([string]$FileName)
    $base = $FileName -replace '\.md$',''
    return "/$base/"
}

function Add-Permalink {
    param([string]$FilePath, [string]$Permalink)
    $content = Get-Content $FilePath -Raw
    if ($content -match '^---\r?\n') {
        $content = $content -replace '(^---\r?\n)', "`$1permalink: $Permalink`n"
        [System.IO.File]::WriteAllText($FilePath, $content, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "    [INJECTED permalink: $Permalink]" -ForegroundColor DarkYellow
    }
}

function Safe-GitMove {
    param([string]$Source, [string]$DestinationDir)
    $fileName = Split-Path $Source -Leaf
    $destPath = Join-Path $DestinationDir $fileName
    
    if (Test-Path $destPath) {
        Write-Host "  SKIP: Destination exists: $destPath" -ForegroundColor Red
        return
    }
    
    if ($Apply) {
        & git mv $Source $destPath
        Write-Host "  MOVED: $fileName -> $(Split-Path $DestinationDir -Leaf)/" -ForegroundColor Green
    } else {
        Write-Host "  AUDIT: Would move $fileName -> $(Split-Path $DestinationDir -Leaf)/" -ForegroundColor DarkGray
    }
}

# =========================================================================================
# 1. CREATE DIRECTORIES
# =========================================================================================
$subDirs = @("hubs", "categories", "assessments", "tools", "utility", "sub-hubs")
foreach ($dir in $subDirs) {
    $target = Join-Path $PagesDir $dir
    if (-not (Test-Path $target)) {
        if ($Apply) { $null = New-Item -ItemType Directory -Path $target -Force }
        Write-Host "CREATE: $target" -ForegroundColor Green
    }
}

# =========================================================================================
# 2. ROUTING MAP
# =========================================================================================
$routing = @(
    @{ Files = @("contact.md","disclaimer.md","privacy-policy.md","terms-and-conditions.md","welcome.md","thank-you.md"); Dest = "utility" }
    @{ Files = @(); Filter = "category-*.md"; Dest = "categories" }
    @{ Files = @("biology-model-test.md","biology-practical.md"); Filter = "mcq-arena*.md"; Dest = "assessments" }
    @{ Files = @("mi-analysis.md","personality-test.md","institutional-framework.md"); Dest = "tools" }
    @{ Files = @("biology.md","life-philosophy.md","life-practices.md","socratic.md","synaptic-bridge.md","research-node.md","mcq-arena.md"); Dest = "hubs" }
    @{ Files = @(); Filter = "biology-*.md"; Dest = "sub-hubs" }
)

# =========================================================================================
# 3. EXECUTE MOVES WITH PERMALINK SAFETY
# =========================================================================================
foreach ($route in $routing) {
    $destDir = Join-Path $PagesDir $route.Dest
    $filesToMove = @()
    
    foreach ($f in $route.Files) {
        $path = Join-Path $PagesDir $f
        if (Test-Path $path) { $filesToMove += $path }
    }
    
    if ($route.ContainsKey('Filter') -and $route.Filter) {
        Get-ChildItem -Path $PagesDir -Filter $route.Filter -File | ForEach-Object {
            if ($filesToMove -notcontains $_.FullName) {
                $filesToMove += $_.FullName
            }
        }
    }
    
    foreach ($filePath in $filesToMove) {
        $fileName = Split-Path $filePath -Leaf
        
        if (-not (Has-Permalink -FilePath $filePath)) {
            $implicit = Get-ImplicitPermalink -FileName $fileName
            Write-Host "  WARN: $fileName has no permalink. URL will change to $implicit unless fixed." -ForegroundColor Magenta
            
            if ($Apply) {
                Add-Permalink -FilePath $filePath -Permalink $implicit
                & git add $filePath
            }
        }
        
        Safe-GitMove -Source $filePath -DestinationDir $destDir
    }
}

# =========================================================================================
# 4. REDUNDANCY AUDIT
# =========================================================================================
Write-Host "`n[REDUNDANCY AUDIT]" -ForegroundColor Cyan
$subHubBotany = Join-Path $PagesDir "sub-hubs/biology-botany.md"
$catBotany    = Join-Path $PagesDir "categories/category-botany.md"

if ((Test-Path $subHubBotany) -and (Test-Path $catBotany)) {
    Write-Host "  FLAG: biology-botany.md and category-botany.md both exist." -ForegroundColor Yellow
    Write-Host "  RECOMMEND: Merge into one page with permalink /botany/ or /biology/botany/" -ForegroundColor Gray
}

# =========================================================================================
# COMPLETION
# =========================================================================================
if ($Apply) {
    Write-Host "`nReorganization complete. Review git status, then commit:" -ForegroundColor Cyan
    Write-Host "  git status" -ForegroundColor White
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'chore(pages): reorganize into enterprise taxonomy'" -ForegroundColor White
    Write-Host "  git push origin main" -ForegroundColor White
} else {
    Write-Host "`nAUDIT COMPLETE. No files moved. Use -Apply to execute." -ForegroundColor Yellow
}
