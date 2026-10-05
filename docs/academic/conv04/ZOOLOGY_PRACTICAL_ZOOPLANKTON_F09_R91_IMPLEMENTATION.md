# CONV-04F-09-R91 — prac-07 Zooplankton Implementation

status: IMPLEMENTATION CANDIDATE
phase: CONV-04F-09-R91
authorized_base: `61348e5b9387bdcc565106a9813135cbcc9bcdcc`
authorization_gate: CONV-04F-09-R90 / PR #441
selected_module: prac-07
learner_mutation_count: 1
scientific_rewrite: NONE
statistical_rewrite: NONE
ecological_rewrite: NONE
sampling_method_rewrite: NONE
equipment_protocol_rewrite: NONE
curriculum_rewrite: NONE
heading_normalization: NONE

## Exact baseline
- source: `_biology/higher-zoology-tree/practical/07-zooplankton.bn.md`
- baseline blob: `c120863ca31d85a33f1476b3f5bab59d571950cf`
- route: `/biology/higher-zoology-tree/practical/zooplankton/`
- course: `nu-zoology-practical-213106`
- module order: `prac-06 → prac-07 → prac-08`
- route-ledger baseline: `c77bc6a3353a82d1c3980ae7c43e84980be6a67f`

## Authorized learner transform
Only the three Academic-v1 metadata fields, one canonical Learning Guide CTA immediately after the existing H1, and three named keyboard-focusable wrappers directly enclosing the three authenticated Markdown tables.

Wrapper labels:
- `Zooplankton suggested metadata table`
- `Zooplankton example data table`
- `Zooplankton 20-mark report structure table`

No learner prose, formula, table cell, report mark, sampling rule, statistical convention, ecological interpretation, equipment advice, heading, example value, stylesheet import or script import may change.

## Protected census
1 H1 / 13 H2 / 3 H3; 3 tables / 33 table lines; 7 Minimum Design bullets; 11 Suggested Metadata rows; 6 Sampling Logic steps; 11 numbered items total; 13 body bullets total; 6 example-data rows; 10 report rows including Total=20; 5 Discussion Questions.

## Promotion gate
Exact-source reconstruction + complete-ledger proof → retained contracts → Jekyll → browser/Axe/keyboard/reflow/text-spacing/reduced-motion/no-JS → Cloudflare exact-head preview → fresh Codex → zero unresolved threads → exact SOLO authority → Trusted Governance → merge → exact-main immutable + canonical production parity. Only then may prac-08 be authorized.


## Latest Codex production-security remediation

The five P1 findings on exact head `09cd1dede1bff86a77ec327cd6a6bf95b0e94a48` were authenticated and remediated without learner/content expansion:

1. **Trusted guard trigger completeness** — `pull_request_target` is now unfiltered by `paths`, so the predecessor-loaded guard cannot be skipped by GitHub's >3,000-file diff path-filter cutoff.
2. **Resolver immutability** — `.github/scripts/resolve-cloudflare-targets.py` is now in both the trusted successor protected-path set and the retained R91 validator's immutable base set.
3. **Isolated npm trust boundary** — Wrangler and browser dependencies install only in `$RUNNER_TEMP` with explicit `https://registry.npmjs.org/`, empty trusted user/global npmrc files, and direct execution from the isolated temp workspace; repository `.npmrc` cannot redirect deployment tooling.
4. **Build/deploy runner separation** — candidate Bundler/Jekyll executes only in an unprivileged build job that has no Cloudflare credential. A fresh credentialed production job downloads only the static site artifact, checks out exact-main enforcement files, and never runs candidate Bundler/Jekyll.
5. **Complete push-range authentication** — post-merge validation uses `github.event.before` through `github.sha`, authenticates ancestry, and exports `PR_BASE_SHA=$PUSH_BEFORE`; it no longer reduces the protected comparison to only `TARGET_SHA^`.

The Cloudflare production job remains push-to-main only. No manual deployment dispatch exists. No Zooplankton learner, statistical, ecological, route-ledger, or browser-contract expansion was introduced by these remediations.


## CodeQL trust-workflow separation

A subsequent CodeQL artifact-poisoning alert was authenticated. The trusted successor guard and artifact-consuming production path are now in separate workflow files:

- `conv04f-zoology-practical-zooplankton-certification.yml` owns the unfiltered `pull_request_target` predecessor guard only; candidate build/certification jobs are explicitly excluded from `pull_request_target`.
- `conv04f-zoology-practical-zooplankton-production-parity.yml` is push-only and contains the unprivileged build artifact plus fresh credentialed deploy/certify job.
- No `pull_request_target` workflow downloads or consumes candidate-controlled artifacts.
- The original nine-file implementation scope is retained, plus exactly one security-only workflow: `.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml`. Current exact scope is **10 files**.


## Final trusted-workflow architecture

To eliminate CodeQL cross-context checkout/cache/artifact findings, R91 now uses three disjoint trust surfaces:

1. **Successor guard workflow** — standalone, unfiltered `pull_request_target`; API metadata only; no checkout, package execution, artifact download, or secret.
2. **Candidate certification workflow** — `pull_request` only; checks out and executes the exact PR head in a non-privileged context; no manual/default-branch dispatch.
3. **Production parity workflow** — `push` to `main` only; unprivileged Jekyll build is separated from a fresh credentialed deploy/certify job.

This required one security-only file beyond the original nine-file scope. The exact R91 learner/content mutation remains unchanged: one Zooplankton learner source plus one strict route-ledger row; no scientific/statistical/ecological rewrite.
