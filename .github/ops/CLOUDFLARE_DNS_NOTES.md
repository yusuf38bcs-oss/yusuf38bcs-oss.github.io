# Cloudflare DNS Notes

These rules protect `learningbiologyforlife.org` DNS, SSL, caching, email, and AdSense review stability.

## 1. Cloudflare Role

Cloudflare should act as:

- DNS manager.
- CDN/cache layer.
- HTTPS/SSL edge.
- Firewall/security layer.
- Performance layer.

Cloudflare should not inject extra advertising, analytics, consent, or tag scripts during AdSense review.

## 2. Do Not Enable During AdSense Review

Keep these disabled unless there is a clear post-review reason:

- Cloudflare Zaraz.
- Cloudflare Google Tag Gateway.
- Extra Worker-based tag injection.
- Unreviewed HTML rewriting tools.
- Rocket Loader for critical script paths if it breaks GTM, AdSense, or site JavaScript.

## 3. DNS Stability Rules

Do not modify DNS records unless the purpose is clear and documented.

Before editing DNS, record:

```text
Date:
Record type:
Name:
Old value:
New value:
Reason:
Rollback plan:
```

## 4. Apex and WWW Rules

The canonical public domain is:

```text
learningbiologyforlife.org
```

The `www` version should redirect or resolve consistently to the canonical domain if configured.

Avoid split behavior where apex and `www` show different content.

## 5. Email DNS Warning

Do not remove Google Workspace MX records unless email migration has been fully planned and tested.

Before changing email DNS, verify:

- MX records.
- SPF.
- DKIM.
- DMARC.
- Mailbox or alias routing.
- Admin, info, and support addresses.

Changing MX records incorrectly may cause total email failure.

## 6. SSL/TLS Rules

Use a stable HTTPS configuration. Avoid repeatedly switching SSL modes.

Minimum required result:

```text
https://learningbiologyforlife.org loads without certificate warning
```

## 7. Cache Rules

After every production deployment that changes HTML, CSS, JS, or legal/consent text:

```text
Cloudflare → Caching → Configuration → Purge Everything
```

If only one page is stale, single-URL purge is acceptable, but full purge is safer after structural updates.

## 8. Worker Boundary

Cloudflare Worker should remain limited to its intended AI/API proxy role. It must not:

- Inject AdSense code.
- Rewrite legal pages.
- Rewrite canonical links.
- Serve different content to Google crawlers.
- Hide content from users or crawlers.

## 9. Security Rule

Never paste Cloudflare API tokens into ChatGPT, GitHub issues, commits, wiki pages, screenshots, or docs.

If a token is exposed, revoke it immediately and create a new scoped token.
