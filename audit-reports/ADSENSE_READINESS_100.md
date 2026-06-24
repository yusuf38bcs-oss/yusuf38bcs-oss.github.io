# AdSense Approval Readiness — Final Forensic Execution Gate

Branch: `main`
Site: `learningbiologyforlife.org`
Publisher: `ca-pub-9144658795059352`

## Repository execution fixes completed

- Set `future: false` in `_config.yml` to prevent unfinished or future-dated material from entering production review.
- Centralized the AdSense publisher client under `adsense.client` in `_config.yml`.
- Preserved the existing static AdSense script in `_includes/head/custom.html` for site review and ownership visibility.
- Hardened `_includes/head/head.html` so consent-based loading cannot inject a duplicate AdSense script when the static script already exists.
- Rendered one canonical GDPR banner from `_includes/body/gdpr-banner.html`.
- Removed the duplicate GDPR banner from `_includes/footer/mycorrhizal-footer.html`.
- Added `_includes/footer/legal-links.html` and included it globally from `_includes/footer.html`.
- Reordered the footer so legal links appear above the copyright/status section.
- Aligned `CNAME` with the AdSense apex domain: `learningbiologyforlife.org`.
- Simplified `robots.txt` to allow crawler access to pages, CSS, JavaScript, and assets.
- Normalized `ads.txt` without UTF-8 BOM.
- Added a clean `/categories/` page with crawlable internal links and category archives.
- Hardened `.github/workflows/jekyll-gh-pages.yml` so deployment validates AdSense-readiness routes before publishing.

## GitHub Pages deployment evidence

The production workflow must show both jobs successful:

- `build`: success
- `deploy`: success

The verified production run after the trigger commit showed both jobs successful and produced the `github-pages` artifact.

## Manual live verification checklist

Open these live URLs after the final deployment and Cloudflare cache purge:

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

## Required live results before AdSense review

- Homepage opens normally.
- Homepage renders exactly one cookie/GDPR banner.
- Footer displays legal pages first: About, Contact, Privacy Policy, Terms, Disclaimer, Cookie Preferences.
- Footer displays the copyright/status section below the legal links.
- `/categories/` shows the Categories archive, not the homepage.
- `/robots.txt` returns `Allow: /` and the sitemap URL.
- `/ads.txt` returns `google.com, pub-9144658795059352, DIRECT, f08c47fec0942fa0`.
- `/sitemap.xml` returns valid XML with `learningbiologyforlife.org` URLs.

## Final external actions required outside repository

1. GitHub Pages settings:
   - Source: GitHub Actions
   - Custom domain: `learningbiologyforlife.org`
   - Enforce HTTPS: enabled
2. Cloudflare DNS:
   - Apex routes to GitHub Pages correctly.
   - `www` routes to the apex or GitHub Pages consistently.
3. Cloudflare cache:
   - Purge Everything after final deployment.
   - Purge the homepage, `/categories/`, `/robots.txt`, `/ads.txt`, and `/sitemap.xml` explicitly if needed.
4. Cloudflare Rules / Workers:
   - No rule may rewrite `/categories/`, `/robots.txt`, `/ads.txt`, or `/sitemap.xml` to `/`.

## AdSense resubmission rule

Do not request review until the live domain, not only the GitHub artifact or Cloudflare preview URL, returns all required URLs correctly.
