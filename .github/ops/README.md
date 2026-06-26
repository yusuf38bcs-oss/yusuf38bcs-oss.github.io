# Learning Biology For Life — Operations Rules Index

This folder contains internal operational rules for keeping `learningbiologyforlife.org` stable, safe, and AdSense-review ready.

These files are intentionally stored under `.github/ops/` so they remain repository documentation, not public Jekyll site pages.

## Non-Negotiable Stability Rules

1. Do not make large visual, navigation, analytics, consent, or legal-policy changes during an active AdSense review unless a critical error must be fixed.
2. Never expose secrets, API keys, Cloudflare tokens, Google tokens, Formspree tokens, or private operational credentials in commits, screenshots, issues, wiki pages, or public posts.
3. All production changes must go through `main`, GitHub Actions, successful build validation, successful Pages deployment, and Cloudflare cache purge when HTML changes are involved.
4. Keep `learningbiologyforlife.org` as the only public canonical site. Avoid unmanaged public GitHub Wiki content during AdSense review.
5. Every educational page must provide original learning value: concept explanation, LOLO/LALA where appropriate, Synaptic Bridge, internal links, and assessment/reflection value.
6. MCQ/quiz content must include answer explanation and validity logic, not only an answer key.
7. Health, psychology, behaviour, and self-assessment content must remain educational and non-clinical unless reviewed by qualified professionals.
8. Do not enable open public comments before AdSense approval. Use moderated learner-reflection prompts only.

## Documents

- [Deployment Protocol](DEPLOYMENT_PROTOCOL.md)
- [Cloudflare DNS Notes](CLOUDFLARE_DNS_NOTES.md)
- [AdSense Review Checklist](ADSENSE_REVIEW_CHECKLIST.md)
- [GTM and GA4 Setup Notes](GTM_GA4_SETUP_NOTES.md)
- [Jekyll Build Recovery Guide](JEKYLL_BUILD_RECOVERY_GUIDE.md)
- [Content Publishing Rules](CONTENT_PUBLISHING_RULES.md)

## Current Production Identity

- Production domain: `https://learningbiologyforlife.org`
- Repository: `yusuf38bcs-oss/yusuf38bcs-oss.github.io`
- GitHub Pages branch: `main`
- Deploy trigger folder: `C:\Users\user\yusuf38bcs-deploy-trigger`
- GTM Web container: `GTM-WPZ6MPK4`
- GA4 property: `G-2SCLLF93NS`
- AdSense publisher: `ca-pub-9144658795059352`
- `ads.txt` publisher line: `google.com, pub-9144658795059352, DIRECT, f08c47fec0942fa0`
