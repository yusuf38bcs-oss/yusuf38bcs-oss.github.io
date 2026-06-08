#Requires -Version 5.1
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = (Get-Location).Path
$reportsDir = Join-Path $repoRoot 'audit-reports'
if (-not (Test-Path $reportsDir)) { New-Item -ItemType Directory -Path $reportsDir | Out-Null }

function Normalize-Url($url) {
    $u = $url.Trim()
    if (-not $u.StartsWith('/')) { $u = '/' + $u }
    if ($u.Length -gt 1 -and $u.EndsWith('/')) { $u = $u.TrimEnd('/') }
    return $u
}

# --- 1. Navigation URLs ---
$navUrls = [System.Collections.Generic.List[string]]::new()
$navYml = Join-Path $repoRoot '_data\navigation.yml'
if (Test-Path $navYml) {
    $content = Get-Content -Raw $navYml
    [regex]::Matches($content, '^\s*url:\s*["'']?(.+?)["'']?\s*$', [System.Text.RegularExpressions.RegexOptions]::Multiline) | ForEach-Object {
        $u = $_.Groups[1].Value.Trim()
        if (-not $navUrls.Contains($u)) { $navUrls.Add($u) }
    }
}

# --- 2. Hardcoded masthead URLs ---
$hardcodedUrls = [System.Collections.Generic.List[string]]::new()
$masthead = Join-Path $repoRoot '_includes\navigation\masthead.html'
$mastheadContent = ''
if (Test-Path $masthead) {
    $mastheadContent = Get-Content -Raw $masthead
    [regex]::Matches($mastheadContent, 'href=\{\{\s*["'']?(.+?)["'']?\s*\|\s*relative_url\s*\}\}') | ForEach-Object {
        $u = $_.Groups[1].Value.Trim()
        if (-not $hardcodedUrls.Contains($u)) { $hardcodedUrls.Add($u) }
        if (-not $navUrls.Contains($u)) { $navUrls.Add($u) }
    }
    [regex]::Matches($mastheadContent, 'href=["'']([^"''{}]+)["'']') | ForEach-Object {
        $u = $_.Groups[1].Value.Trim()
        if ($u.StartsWith('/') -and -not $u.StartsWith('//') -and -not $navUrls.Contains($u)) {
            $navUrls.Add($u)
        }
    }
}

# --- 3. Scan _site (HTML only) ---
$siteUrls = [System.Collections.Generic.List[string]]::new()
$siteDir = Join-Path $repoRoot '_site'
if (Test-Path $siteDir) {
    Get-ChildItem -Path $siteDir -Recurse -File -Filter '*.html' | ForEach-Object {
        $rel = $_.FullName.Substring($siteDir.Length).Replace('\', '/')
        $url = switch ($rel) {
            '/index.html' { '/' }
            default {
                if ($rel -match '/index\.html$') {
                    $rel -replace '/index\.html$', '/'
                } elseif ($rel -match '\.html$') {
                    $rel -replace '\.html$', ''
                } else {
                    $rel
                }
            }
        }
        if (-not $siteUrls.Contains($url)) { $siteUrls.Add($url) }
    }
}

$normSite = $siteUrls | ForEach-Object { Normalize-Url $_ } | Sort-Object -Unique
$normNav = $navUrls | ForEach-Object { Normalize-Url $_ } | Sort-Object -Unique

$workingLinks = [System.Collections.Generic.List[hashtable]]::new()
$brokenLinks = [System.Collections.Generic.List[hashtable]]::new()
foreach ($url in $normNav) {
    $found = $normSite -contains $url
    $entry = @{ Url = $url; Found = $found }
    if ($found) { $workingLinks.Add($entry) } else { $brokenLinks.Add($entry) }
}

# --- 4. Search botany / zoology / contact (FIXED EXCLUSION) ---
$searchTerms = @('botany','zoology','contact')
$foundSources = @{}
foreach ($term in $searchTerms) { $foundSources[$term] = [System.Collections.Generic.List[string]]::new() }

$excludePaths = @('*\_site\*','*\.git\*','*\node_modules\*','*\vendor\*','*\audit-reports\*')
$allSourceItems = Get-ChildItem -Path $repoRoot -Recurse -File | Where-Object {
    $file = $_
    $file.Extension -in @('.md','.html','.markdown') -and
    -not ($excludePaths | Where-Object { $file.FullName -like $_ })
}

foreach ($item in $allSourceItems) {
    $name = $item.Name.ToLower()
    $content = Get-Content -Raw $item.FullName -ErrorAction SilentlyContinue
    foreach ($term in $searchTerms) {
        if ($name.Contains($term) -or ($content -and $content.ToLower().Contains($term))) {
            $rel = $item.FullName.Substring($repoRoot.Length).TrimStart('\','/').Replace('\','/')
            if (-not $foundSources[$term].Contains($rel)) { $foundSources[$term].Add($rel) }
        }
    }
}

# --- 5. Route map & front matter (ROBUST REGEX) ---
$routeMap = [System.Collections.Generic.List[hashtable]]::new()
$pagesWithoutPermalink = [System.Collections.Generic.List[string]]::new()
$configYml = Join-Path $repoRoot '_config.yml'
$collectionsOutput = @{}
$globalPermalinkStyle = ''
if (Test-Path $configYml) {
    $cfg = Get-Content -Raw $configYml
    if ($cfg -match 'permalink:\s*["'']?(.+?)["'']?\s*[\r\n]') { $globalPermalinkStyle = $matches[1].Trim() }
    $colMatch = [regex]::Match($cfg, 'collections:\s*(.*?)(?=\n\w|\z)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($colMatch.Success) {
        $block = $colMatch.Groups[1].Value
        [regex]::Matches($block, '^\s*(\w+):\s*$([^\n]*(?:\n\s+[^\n]+)*)', [System.Text.RegularExpressions.RegexOptions]::Multiline) | ForEach-Object {
            $cname = $_.Groups[1].Value.Trim()
            $cbody = $_.Groups[2].Value
            $collectionsOutput[$cname] = $cbody -match 'output:\s*true'
        }
    }
}

foreach ($item in $allSourceItems) {
    $relPath = $item.FullName.Substring($repoRoot.Length).TrimStart('\','/').Replace('\','/')
    $content = Get-Content -Raw $item.FullName -ErrorAction SilentlyContinue
    $hasFm = $false
    $permalink = $null
    $title = $null
    $layout = $null

    # More robust front-matter detection
    if ($content -and ($content -match '(?s)^---\r?\n(.*?)\r?\n---\r?\n')) {
        $hasFm = $true
        $fm = $matches[1]
        if ($fm -match 'permalink:\s*["'']?(.+?)["'']?(?:\s*$|\s*[\r\n])') { $permalink = $matches[1].Trim() }
        if ($fm -match 'title:\s*["'']?(.+?)["'']?(?:\s*$|\s*[\r\n])') { $title = $matches[1].Trim() }
        if ($fm -match 'layout:\s*["'']?(.+?)["'']?(?:\s*$|\s*[\r\n])') { $layout = $matches[1].Trim() }
    }

    $inCollection = $false
    $colName = $null
    foreach ($c in $collectionsOutput.Keys) {
        if ($relPath -like "_$c/*") { $inCollection = $true; $colName = $c; break }
    }

    $predicted = $null
    if ($permalink) {
        $predicted = $permalink
    } elseif ($relPath -match '^_.*') {
        $predicted = $null
        if ($inCollection -and $collectionsOutput[$colName]) {
            $slug = [System.IO.Path]::GetFileNameWithoutExtension($item.Name)
            $predicted = "/$colName/$slug/"
        }
    } else {
        $dir = [System.IO.Path]::GetDirectoryName($relPath)
        if ($dir) { $dir = $dir.Replace('\','/') }
        $name = [System.IO.Path]::GetFileNameWithoutExtension($item.Name)
        if ($name -eq 'index') {
            $predicted = if ($dir) { "/$dir/" } else { "/" }
        } else {
            $predicted = if ($dir) { "/$dir/$name/" } else { "/$name/" }
        }
    }

    $routeMap.Add(@{
        SourceFile = $relPath
        Title = $title
        Layout = $layout
        Permalink = $permalink
        PredictedUrl = $predicted
        HasFrontMatter = $hasFm
    })

    if ($hasFm -and -not $permalink -and -not $inCollection -and -not ($relPath -match '^_')) {
        $pagesWithoutPermalink.Add($relPath)
    }
}

# Build a lookup of existing source permalinks to catch "source exists but not built" cases
$sourcePermalinks = @{}
foreach ($r in $routeMap) {
    if ($r.Permalink) {
        $n = Normalize-Url $r.Permalink
        $sourcePermalinks[$n] = $r.SourceFile
    }
}

# --- 6. Collections not outputting ---
$collectionsNotOutputting = [System.Collections.Generic.List[string]]::new()
foreach ($c in $collectionsOutput.Keys) {
    if (-not $collectionsOutput[$c]) { $collectionsNotOutputting.Add($c) }
}

# --- 7. Masthead checks ---
$mastheadChecks = @{
    HasNeuralMobileToggle = $mastheadContent -match 'id=["'']neural-mobile-toggle["'']'
    HasNeuralMobileDrawer = $mastheadContent -match 'id=["'']neural-mobile-drawer["'']'
    HasAriaExpanded = $mastheadContent -match 'aria-expanded'
    HasAriaHidden = $mastheadContent -match 'aria-hidden=["'']true["'']'
    HasIsActiveDrawerToggle = $mastheadContent -match 'is-active-drawer'
    HasClickListener = $mastheadContent -match 'addEventListener\s*\(\s*["'']click["'']'
    HasEscapeListener = $mastheadContent -match 'Escape'
    HasStopPropagation = $mastheadContent -match 'stopPropagation\s*\(\s*\)'
    HasDocumentClick = $mastheadContent -match 'document\.addEventListener\s*\(\s*["'']click["'']'
}

# --- 8. SCSS checks ---
$scssFile = Join-Path $repoRoot '_sass\layout\_homepage-stabilizer.scss'
$scssChecks = @{}
$scssContent = ''
if (Test-Path $scssFile) {
    $scssContent = Get-Content -Raw $scssFile
    $db = [regex]::Match($scssContent, '\.masthead-mobile-dropdown-drawer\s*\{([^}]*)\}')
    if ($db.Success) {
        $b = $db.Groups[1].Value
        $scssChecks['DrawerOpacityZero'] = $b -match 'opacity:\s*0'
        $scssChecks['DrawerVisibilityHidden'] = $b -match 'visibility:\s*hidden'
        $scssChecks['DrawerDisplayNone'] = $b -match 'display:\s*none'
        $scssChecks['DrawerTransform'] = $b -match 'transform:'
        $scssChecks['DrawerPointerEvents'] = $b -match 'pointer-events:'
        $scssChecks['DrawerZIndex'] = $b -match 'z-index:'
    }
    $ab = [regex]::Match($scssContent, '\.neural-site-masthead\.is-active-drawer\s+\.masthead-mobile-dropdown-drawer\s*\{([^}]*)\}')
    if ($ab.Success) {
        $b = $ab.Groups[1].Value
        $scssChecks['ActiveOpacityOne'] = $b -match 'opacity:\s*1'
        $scssChecks['ActiveVisibilityVisible'] = $b -match 'visibility:\s*visible'
        $scssChecks['ActiveDisplayBlock'] = $b -match 'display:\s*block'
        $scssChecks['ActiveTransformNone'] = $b -match 'transform:\s*translateY\s*\(\s*0\s*\)'
    }
}

# --- 9. External JS interference ---
$extJs = @{}
$jsPaths = @('assets\js\neural-nav.js','assets\js\synaptic-navigation.js')
foreach ($jp in $jsPaths) {
    $jfull = Join-Path $repoRoot $jp
    if (Test-Path $jfull) {
        $jc = Get-Content -Raw $jfull
        $extJs[$jp] = @{
            RefsToggle = $jc -match 'neural-mobile-toggle|masthead__menu-toggle'
            RefsDrawer = $jc -match 'neural-mobile-drawer|masthead__menu|\.mobile-menu'
            RefsActive = $jc -match 'is-active-drawer'
        }
    }
}

# --- 10. Orphan pages ---
$orphanUrls = [System.Collections.Generic.List[string]]::new()
if ($normSite.Count -gt 0) {
    foreach ($u in $normSite) {
        if ($u -ne '/' -and -not ($normNav -contains $u)) {
            $orphanUrls.Add($u)
        }
    }
}

# --- REPORTS ---

# NAVIGATION_REPORT.md
$lines = @()
$lines += '# Navigation Report'
$lines += ''
$lines += "## Working Links ($($workingLinks.Count))"
foreach ($l in $workingLinks) { $lines += "- $($l.Url)" }
$lines += ''
$lines += "## Broken Links ($($brokenLinks.Count))"
foreach ($l in $brokenLinks) {
    $norm = Normalize-Url $l.Url
    $sugg = $normSite | Where-Object { $_ -like "*$($norm.Trim('/').Split('/')[-1])*" } | Select-Object -First 1
    $suggTxt = if ($sugg) { " -> Suggested: $sugg" } else { ' -> Suggested: create source page or update navigation.yml' }
    if ($sourcePermalinks.ContainsKey($norm)) {
        $suggTxt = " -> SOURCE EXISTS ($($sourcePermalinks[$norm])) but _site build missing. Rebuild Jekyll."
    }
    $lines += "- $($l.Url)$suggTxt"
}
$lines += ''
$lines += "## Hardcoded URLs in masthead.html ($($hardcodedUrls.Count))"
foreach ($u in $hardcodedUrls) { $lines += "- $u" }
$lines += ''
$lines += '## Search Results'
foreach ($term in $searchTerms) {
    $lines += "### $term"
    $items = $foundSources[$term]
    if ($items.Count -eq 0) { $lines += '- No source files found' }
    else { foreach ($i in $items) { $lines += "- $i" } }
}
$lines -join "`n" | Out-File -FilePath (Join-Path $reportsDir 'NAVIGATION_REPORT.md') -Encoding utf8

# FIX_REPORT.md
$flines = @()
$flines += '# Fix Report'
$flines += ''
$flines += "## Broken Navigation Routes ($($brokenLinks.Count))"
foreach ($l in $brokenLinks) {
    $norm = Normalize-Url $l.Url
    if ($sourcePermalinks.ContainsKey($norm)) {
        $flines += "- $($l.Url): Source file found ($($sourcePermalinks[$norm])) but missing from _site. Run Jekyll build."
    } else {
        $flines += "- $($l.Url): Create corresponding source file or fix url in _data/navigation.yml."
    }
}
$flines += ''
$flines += "## Pages Without Permalink ($($pagesWithoutPermalink.Count))"
if ($pagesWithoutPermalink.Count -eq 0) { $flines += '- None' } else { foreach ($p in $pagesWithoutPermalink) { $flines += "- $p" } }
$flines += ''
$flines += "## Collections Not Outputting ($($collectionsNotOutputting.Count))"
if ($collectionsNotOutputting.Count -eq 0) { $flines += '- None' } else { foreach ($c in $collectionsNotOutputting) { $flines += "- ${c}: add output: true to _config.yml" } }
$flines += ''
$flines += "## Orphan Pages in _site ($($orphanUrls.Count))"
if ($orphanUrls.Count -eq 0) { $flines += '- None' } else { foreach ($o in $orphanUrls) { $flines += "- $o" } }
$flines += ''
$flines += '## Masthead JS Audit'
foreach ($k in $mastheadChecks.Keys | Sort-Object) {
    $v = $mastheadChecks[$k]
    $status = if ($v) { 'PASS' } else { 'FAIL' }
    $flines += "- $k : $status"
}
$flines += ''
$flines += '## Mobile Drawer CSS Audit'
foreach ($k in $scssChecks.Keys | Sort-Object) {
    $v = $scssChecks[$k]
    $status = if ($v) { 'PRESENT' } else { 'MISSING' }
    $flines += "- $k : $status"
}
$flines += ''
$flines += '## External JS Interference'
foreach ($k in $extJs.Keys | Sort-Object) {
    $flines += "### $k"
    foreach ($p in $extJs[$k].Keys | Sort-Object) {
        $v = $extJs[$k][$p]
        $status = if ($v) { 'YES' } else { 'NO' }
        $flines += "- $p : $status"
    }
}
$flines -join "`n" | Out-File -FilePath (Join-Path $reportsDir 'FIX_REPORT.md') -Encoding utf8

# ROUTE_MAP.md
$rlines = @()
$rlines += '# Route Map'
$rlines += ''
$rlines += '| Source File | Title | Layout | Permalink | Predicted URL |'
$rlines += '|-------------|-------|--------|-----------|---------------|'
foreach ($r in $routeMap) {
    $t = if ($r.Title) { $r.Title } else { '' }
    $l = if ($r.Layout) { $r.Layout } else { '' }
    $p = if ($r.Permalink) { $r.Permalink } else { '' }
    $u = if ($r.PredictedUrl) { $r.PredictedUrl } else { 'N/A' }
    $rlines += "| $($r.SourceFile) | $t | $l | $p | $u |"
}
$rlines -join "`n" | Out-File -FilePath (Join-Path $reportsDir 'ROUTE_MAP.md') -Encoding utf8

# PATCH_RECOMMENDATIONS.md
$plines = @()
$plines += '# Patch Recommendations'
$plines += ''
$plines += '## 1. Wire Mobile Drawer to _data/navigation.yml'
$plines += '**File:** _includes/navigation/masthead.html'
$plines += ''
$plines += 'Replace the hardcoded <ul class="mobile-nav-menu-list"> block inside <div id="neural-mobile-drawer"> with:'
$plines += ''
$plines += '```liquid'
$plines += '<ul class="mobile-nav-menu-list">'
$plines += '  {% for item in site.data.navigation.main %}'
$plines += '    {% if item.children %}'
$plines += '      <li class="mobile-menu-section-header">{{ item.title }}</li>'
$plines += '      {% for child in item.children %}'
$plines += '        <li><a href="{{ child.url | relative_url }}" class="mobile-sub-link">{{ child.title }}</a></li>'
$plines += '      {% endfor %}'
$plines += '    {% else %}'
$plines += '      <li><a href="{{ item.url | relative_url }}">{{ item.title }}</a></li>'
$plines += '    {% endif %}'
$plines += '  {% endfor %}'
$plines += '  <li><a href="{{ "/contact/" | relative_url }}">Contact</a></li>'
$plines += '</ul>'
$plines += '```'
$plines += ''
$plines += '## 2. Fix Missing Routes'
foreach ($l in $brokenLinks) {
    $norm = Normalize-Url $l.Url
    if (-not $sourcePermalinks.ContainsKey($norm)) {
        $slug = $l.Url.Trim('/').Replace('/','-')
        $plines += "- Create source for $($l.Url) (e.g., $slug.md) with front matter including permalink: $($l.Url)"
    } else {
        $plines += "- $($l.Url): Source exists at $($sourcePermalinks[$norm]); rebuild Jekyll to generate _site output."
    }
}
$plines += ''
$plines += '## 3. CSS Drawer Visibility Fix'
$plines += 'If .masthead-mobile-dropdown-drawer is hidden by display: none and .is-active-drawer does not override it, add to _sass/layout/_homepage-stabilizer.scss:'
$plines += ''
$plines += '```scss'
$plines += '.masthead-mobile-dropdown-drawer {'
$plines += '  display: block; /* ensure not none */'
$plines += '}'
$plines += ''
$plines += '.neural-site-masthead.is-active-drawer .masthead-mobile-dropdown-drawer {'
$plines += '  opacity: 1;'
$plines += '  visibility: visible;'
$plines += '  transform: translateY(0);'
$plines += '  pointer-events: auto;'
$plines += '}'
$plines += '```'
$plines += ''
$plines += '## 4. External JS Conflict Resolution'
$plines += 'If neural-nav.js or synaptic-navigation.js target different selectors, update them to use #neural-mobile-toggle and #neural-mobile-drawer, or remove them if masthead.html already contains inline JS.'
$plines += ''
$plines += '## 5. Collection Output'
if ($collectionsNotOutputting.Count -gt 0) {
    $plines += 'Enable output for collections in _config.yml:'
    $plines += '```yaml'
    foreach ($c in $collectionsNotOutputting) {
        $plines += "${c}:"
        $plines += '  output: true'
    }
    $plines += '```'
}
$plines -join "`n" | Out-File -FilePath (Join-Path $reportsDir 'PATCH_RECOMMENDATIONS.md') -Encoding utf8

# --- HEALTH SCORES ---
$totalNav = $normNav.Count
$navHealth = if ($totalNav -gt 0) { [math]::Round(($workingLinks.Count / $totalNav) * 100, 1) } else { 0 }

$validRoutes = 0
foreach ($r in $routeMap) {
    if ($r.PredictedUrl -and ($normSite -contains (Normalize-Url $r.PredictedUrl))) { $validRoutes++ }
}
$totalSrc = $routeMap.Count
$routeHealth = if ($totalSrc -gt 0) { [math]::Round(($validRoutes / $totalSrc) * 100, 1) } else { 0 }

$jekyllHealth = 100
if ($pagesWithoutPermalink.Count -gt 0) { $jekyllHealth -= [math]::Min(25, $pagesWithoutPermalink.Count * 2) }
if ($collectionsNotOutputting.Count -gt 0) { $jekyllHealth -= [math]::Min(25, $collectionsNotOutputting.Count * 5) }
if (-not (Test-Path $siteDir)) { $jekyllHealth -= 20 }
$jekyllHealth = [math]::Max(0, [math]::Min(100, $jekyllHealth))

$mobileHealth = 100
if (-not $mastheadChecks['HasNeuralMobileToggle']) { $mobileHealth -= 20 }
if (-not $mastheadChecks['HasNeuralMobileDrawer']) { $mobileHealth -= 20 }
if (-not $mastheadChecks['HasIsActiveDrawerToggle']) { $mobileHealth -= 15 }
if (-not $mastheadChecks['HasClickListener']) { $mobileHealth -= 10 }
if (-not $mastheadChecks['HasDocumentClick']) { $mobileHealth -= 5 }
if ($scssChecks['DrawerDisplayNone'] -and -not $scssChecks['ActiveDisplayBlock']) { $mobileHealth -= 20 }
if (-not $scssChecks['ActiveOpacityOne']) { $mobileHealth -= 5 }
if (-not $scssChecks['ActiveVisibilityVisible']) { $mobileHealth -= 5 }
$mobileHealth = [math]::Max(0, [math]::Min(100, $mobileHealth))

Write-Host ''
Write-Host '========================================'
Write-Host 'AUDIT COMPLETE'
Write-Host '========================================'
Write-Host "Reports directory : $reportsDir"
Write-Host "Navigation Health : $navHealth%"
Write-Host "Route Health      : $routeHealth%"
Write-Host "Jekyll Health     : $jekyllHealth%"
Write-Host "Mobile Menu Health: $mobileHealth%"
Write-Host '========================================'
