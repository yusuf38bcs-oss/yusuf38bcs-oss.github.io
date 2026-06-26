# Deployment Protocol

Use this protocol for every production change to `learningbiologyforlife.org`.

## 1. Deployment Authority

Only the `main` branch is production. Do not treat a branch, preview, local server, GitHub Wiki, or `.github.io` fallback page as production.

Production URL:

```text
https://learningbiologyforlife.org
```

Repository:

```text
yusuf38bcs-oss/yusuf38bcs-oss.github.io
```

## 2. Safe Deployment Command

Use the clean deployment trigger folder:

```powershell
cd C:\Users\user\yusuf38bcs-deploy-trigger

git fetch origin
git reset --hard origin/main

git commit --allow-empty -m "Trigger deploy after verified production update"
git push origin main
```

## 3. Required GitHub Actions Result

After every push, check:

```text
GitHub → Actions → Deploy to GitHub Pages
```

Required result:

```text
build   success
deploy  success
```

If the build succeeds but deployment is skipped, stop. Do not assume the live site changed.

## 4. Cloudflare Cache Purge Rule

Purge Cloudflare cache after any of these changes:

- Homepage changes.
- Navigation changes.
- Legal pages.
- Cookie or consent pages.
- AdSense, GTM, GA4, or script changes.
- CSS or JavaScript affecting visible layout.
- Any page that looked stale after deployment.

Recommended path:

```text
Cloudflare → Caching → Configuration → Purge Everything
```

## 5. Post-Deploy Verification

Always check these first:

```text
https://learningbiologyforlife.org/
https://learningbiologyforlife.org/categories/
https://learningbiologyforlife.org/privacy-policy/
https://learningbiologyforlife.org/cookie-preferences/
https://learningbiologyforlife.org/editorial-policy/
https://learningbiologyforlife.org/bn/
```

For content-specific deploys, also check the changed page directly.

## 6. Emergency Rollback Rule

If production breaks after a deploy:

1. Identify the last known good commit.
2. Revert the faulty commit or reset locally to the last known good state.
3. Push to `main`.
4. Confirm GitHub Pages deploy success.
5. Purge Cloudflare.
6. Re-check homepage, legal pages, and the changed page.

Never patch blindly without identifying whether the problem is source code, GitHub Actions, GitHub Pages deployment, or Cloudflare cache.

## 7. Production Freeze Rule During AdSense Review

During active AdSense review, avoid:

- Major homepage redesign.
- Removing or replacing GTM, GA4, AdSense, `ads.txt`, or consent logic.
- Adding open comments.
- Adding unmanaged third-party scripts.
- Changing DNS, proxy, SSL, or redirect behavior unless necessary.
- Publishing thin placeholder pages.

Allowed during review:

- Fixing broken pages.
- Correcting factual errors.
- Improving accessibility.
- Adding explanation to existing educational content.
- Fixing deployment, cache, or routing errors.
