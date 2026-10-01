# CONV-04 — Clean Academic Experience Convergence

programme: CONV-04
phase: CONV-04A4
mode: isolated contract authoring
authorized_base: `b5368a947221d332c4ede1f57f6a41dcb47c6a9f`
branch: `conv-04a-academic-surface-contract-20261001`
mutation_authority: contract + ledger + progressive validator + minimum CI only
learner_content_authoring: frozen
bot_08: frozen
admission_pr_356: protected / untouched
worker_cloudflare: out of scope
ready_transition: not authorized
merge: not authorized

## Locked decisions

1. Clean Academic LBFL is governed as an experience architecture, not as unrelated page fixes.
2. CONV-00B remains the academic pathway/course-ownership contract. CONV-04 adds page-role, presentation, learning-method, assessment-placement, language, and responsive-accessibility governance.
3. Existing historical routes migrate progressively. Legacy debt is recorded; it is not silently exempted.
4. New or migrated strict surfaces must comply with the Academic Surface Contract.
5. One canonical language key is `lang`. Historical `language` is migration debt, not the authority consumed by the document shell.
6. Generic educational boundaries are owned by the page-role system. Page-local duplicates are migration debt.
7. General “how to learn” guidance will move to one canonical learning guide in CONV-04C. Lectures may contain concise contextual prompts, not repeated framework essays.
8. Full assessment banks belong to MCQ Arena / assessment surfaces. Lectures retain concise retrieval checks after migration.
9. Personality Pattern Reflection and MI-Informed Learning Reflection remain educational, reflective, non-clinical, non-diagnostic, and non-psychometric.
10. Academic science must stand on scientific/curriculum evidence. Reflective or Synaptic extensions are optional and visibly separated.
11. Responsive design is one fluid system certified across representative viewports, including equivalent 320 CSS px reflow.
12. No new global hotfix layer is permitted as a CONV-04 solution.

## Authenticated root causes

- A1-01: active Omega hero rule can force 85vh/85dvh on generic page heroes.
- A1-02: global `overflow-wrap:anywhere` reaches ordinary page and table content.
- A1-03: the single layout injects an educational boundary while some pages own a second boundary.
- A1-04: Zoology learning-method ownership is mixed between layout injection and page-specific guidance.
- A1-05: page-local inline CSS is widespread across academic surfaces.
- A1-06: escaped AdSense comments render visibly on historical Botany lessons.
- A1-07: full MCQ banks remain embedded inside lessons.
- A1-08: `language` and `lang` are inconsistent while the document shell consumes `page.lang`.
- A1-09: MCQ Academic index queries `site.categories["MCQ"]` although assessment documents live in the `mcq-arena` collection.
- A1-10: several active global/course style layers overlap.

## Live canary evidence

TinyFish live verification fetched 10/10 canary routes with zero fetch errors.

Confirmed examples:
- Homepage remains curated as six Botany functions while Lecture 07 is active.
- Lecture 01 visibly exposes the escaped adsense-policy comment.
- Lecture 01 and Lecture 07 combine the global educational note with page-local boundary content.
- Full MCQ practice remains inside Lecture 01 and Lecture 07.
- MCQ Academic renders an empty-state message despite academic assessment documents existing.
- MCQ Academic and MI-Informed Learning Reflection expose repeated boundary text.
- Botany gateway production metadata reports English document language although the learner-facing gateway is Bangla-dominant.

## Current contract artifacts

- `docs/academic/conv04/ACADEMIC_SURFACE_CONTRACT.md`
- `docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json`
- `.github/scripts/validate-academic-surface-contract.rb`
- `.github/workflows/academic-surface-contract-certification.yml`

## Enforcement

- inventory: registry/source identity only; findings are warnings.
- progressive: detected source debt must exactly match declared source debt; no silent new debt.
- strict: no declared or detected source/live debt; required contract metadata is enforced.

## Next gate

Run the progressive validator and exact-head PR certification. Do not begin CONV-04B until the contract itself is certified and reviewed.
