# GTM and GA4 Setup Notes

These rules protect analytics, consent, and AdSense review stability.

## 1. Current Approved IDs

```text
Google Tag Manager Web Container: GTM-WPZ6MPK4
Primary GA4 Property: G-2SCLLF93NS
```

Do not create duplicate containers or duplicate GA4 tags during active AdSense review.

## 2. Deprecated / Do Not Use

Do not use or revive stale/unused IDs without a documented reason:

```text
Old GA4: G-GQ4LENQ3R7
Ads tag: AW-18047859733
AMP GTM container: GTM-PKB7TP9F
```

If these exist in GTM, keep them paused, restricted by consent, or removed if unused.

## 3. GTM Placement Rule

The official GTM head snippet should load through the site head include. The GTM noscript iframe should be placed immediately after `<body>` in the default layout.

Do not inject GTM through:

- Cloudflare Zaraz.
- Cloudflare Tag Gateway.
- A Worker rewrite.
- Random Markdown pages.
- Theme files without review.

## 4. Consent Mode Rule

Default state should be privacy-safe:

```text
analytics_storage: denied by default where applicable
ad_storage: denied by default where applicable
ad_user_data: denied by default where applicable
ad_personalization: denied by default where applicable
```

Consent may be updated after the user accepts the cookie banner.

## 5. No Personally Identifiable Information Rule

Do not send the following to GA4 or GTM:

- Names.
- Email addresses.
- Phone numbers.
- Student IDs.
- Contact form message text.
- Individual MI/personality responses.
- Cognitive Graph records.
- Sensitive health or psychological self-assessment data.

## 6. Event Tracking Rule

Allowed low-risk events:

- Page view.
- Navigation click.
- Quiz start.
- Quiz complete without personal answers.
- Newsletter CTA click.
- Language switch click.

Avoid tracking raw quiz answers, personality answers, MI answers, mental-health reflection text, or private learner notes.

## 7. Tag Cleanup Rule

Remove or pause unused templates and tags, especially consent/CMP templates not used by the current site.

Before deleting a template:

1. Open GTM.
2. Check whether the template is used by any tag.
3. Delete only if usage count is zero.
4. Preview.
5. Publish with a clear version name.

Recommended version name:

```text
Remove unused consent templates
```

## 8. Debugging Rule

Before changing site code, verify in GTM Preview:

- Container loads once.
- GA4 fires once.
- Consent defaults apply.
- Consent update fires only after user action.
- AdSense script is not duplicated.

## 9. Freeze Rule

During AdSense review, do not experiment with:

- New ad tags.
- New Ads conversion tags.
- New CMP templates.
- Server-side tagging.
- Cloudflare Tag Gateway.
- Multiple GA4 properties.
