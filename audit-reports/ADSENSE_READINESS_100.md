# AdSense Approval Readiness — 100/100 Execution Gate

Branch: `adsense-readiness-100`
Base: `main`

## Completed execution fixes

- Set `future: false` in `_config.yml` to prevent unfinished or future-dated material from entering production review.
- Centralized the AdSense publisher client under `adsense.client` in `_config.yml`.
- Preserved the existing static AdSense script in `_includes/head/custom.html` for site review and ownership visibility.
- Hardened `_includes/head/head.html` so consent-based loading cannot inject a duplicate AdSense script when the static script already exists.
- Removed the duplicate GDPR banner render from `_layouts/default.html`; one banner source remains active.
- Added `_includes/footer/legal-links.html` and included it globally from `_includes/footer.html`.
- Simplified `robots.txt` to allow crawler access to pages, CSS, JavaScript, and assets.
- Normalized `ads.txt` without UTF-8 BOM.
- Added a clean `/categories/` page with crawlable internal links and category archives.

## Manual verification after merge

Open these live URLs after deployment:

- `https://learningbiologyforlife.org/`
- `https://learningbiologyforlife.org/about/`
- `https://learningbiologyforlife.org/contact/`
- `https://learningbiologyforlife.org/privacy-policy/`
- `https://learningbiologyforlife.org/terms-and-conditions/`
- `https://learningbiologyforlife.org/disclaimer/`
- `https://learningbiologyforlife.org/cookie-preferences/`
- `https://learningbiologyforlife.org/categories/`
- `https://learningbiologyforlife.org/robots.txt`
- `https://learningbiologyforlife.org/ads.txt`
- `https://learningbiologyforlife.org/sitemap.xml`

## AdSense resubmission rule

Do not request review until the merged deployment is live and the URLs above return correct public pages.
