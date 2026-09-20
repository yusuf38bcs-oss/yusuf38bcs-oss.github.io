# Homepage V3.5 — Production Release Contract

Production base: `main@c86996050f8bbdf5267c2d0c3b58dcc9dc07ce9c`  
Certified staging integration: `d0fd6427b9c61d267113b6a4796923a9929c9b70`  
Certified design candidate: `28b95d1b6a77b0447e720da2533ea3327d514feb`  
Certified candidate tree: `2eaa9fdec023319bea01617da52b62eea12db385`

Semantic/design donor: PR #290 at `44723eed41dd40d9b152e333f108ed34ee66ea5b` — donor only.  
Historical design provenance: PR #287 at `9b4239c11b71ee22a5a3ef683207a9603750f7c6` — historical only.

Candidate state: `production-release-candidate`.

## Narrative
Identity → Choice → Experience → Method → Feedback/Repair → Evidence → Action.

## Production release rules
- Activate Homepage V3.5 only at the canonical root `/`.
- Preserve the lab route at `/labs/homepage-v3/` as noindex/nofollow.
- Port only the certified Homepage V3 namespace; do not bulk-promote staging.
- Preserve production SEO, canonical/polyglot metadata, AdSense boundary, analytics-consent runtime, GTM consent defaults, and GDPR notice.
- Keep AdSense/CMP configuration unchanged.
- Keep Worker, DNS, course content, shared layouts, workflows, and `_config.yml` unchanged.
- Keep the premium scientific-editorial design rules, Save-Data behavior, reduced-motion behavior, 44px target preference, and mobile/no-dialog fallbacks.
- Production promotion requires fresh exact-head build, responsive/accessibility evidence, Cloudflare preview identity, zero unresolved threads, and trusted governance on this main-based release candidate.

## Scope
The release contains the certified 23-path V3 namespace plus exactly one production activation path: `index.html`.
