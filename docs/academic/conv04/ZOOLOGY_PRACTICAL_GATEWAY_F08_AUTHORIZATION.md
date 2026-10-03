# CONV-04F-08 — Zoology Practical-I Gateway Convergence

**Status:** IMPLEMENTATION CANDIDATE — rebound exact-head certification pending
**Exact base:** `4b8f96300a81289432da7a01cfddecacbada3623`
**Target route:** `/biology/higher-zoology-tree/practical/`
**Target source:** `_biology/higher-zoology-tree/practical/index.bn.md`
**Baseline blob:** `da3660be82ec695bfee239494312fede78cd4a24`

## Rebound prerequisite

Before F-08 promotion, two retained accessibility prerequisites were closed:

1. PR #421 / CONV-04F-07-R1 removed the D-06 opacity-based reveal contrast defect and repaired retained phase-parser compatibility.
2. PR #422 / CONV-04F-07-R2 removed the identical D-04/D-05 opacity reveal defect while preserving all authored assessment content and the shared runtime.

PR #422 merged as authoritative `main@4b8f96300a81289432da7a01cfddecacbada3623`. F-08 is rebound to that exact baseline. The Practical gateway source, governed course contract, and all eight Practical module blobs remain unchanged from the original F-08 baseline.

## F-08 authenticated baseline

The National University Zoology Practical-I pathway is already governed by the strict `nu-zoology-practical-213106` course contract with eight modules in exact order:

```text
prac-01 Museum Specimens
prac-02 Permanent Slides
prac-03 Whole Mounts
prac-04 Dissection
prac-05 Temporary Mounts
prac-06 Appendages
prac-07 Zooplankton
prac-08 Field Report
```

The existing Practical validator independently protects the 213106 course identity, eight routes, dedicated navigation, 48/48 museum-label coverage, 15 verified/33 pending museum images, permanent-slide coverage, zooplankton calculations and field-report requirements.

The Academic Surface ledger had no Practical-I route row at F-08 binding.

## Exact learner mutation authority

F-08 changes exactly one learner-facing source:

`_biology/higher-zoology-tree/practical/index.bn.md`

Authorized additions are only:

```yaml
academic_system: v1
academic_role: practical
learning_guide: canonical
```

plus exactly one canonical Learning Guide CTA immediately after the page H1.

Existing `language: bn`, `lang: bn`, `locale: bn-BD`, course identity, the two gateway tables, all eight module links and order, Practical Reasoning Rule, Safety and Academic Integrity, dedicated Practical CSS/JS declarations, scientific wording and curriculum facts are preserved.

F-08 does **not** rewrite any Practical module. Module-level Clean Academic convergence belongs to F-09.

## Route-ledger target

The route is registered as:

```text
id: higher-zoology-practical-gateway
academic_role: practical
language: bn
boundary_owner: layout
learning_guide_owner: canonical
assessment_owner: mcq-arena
enforcement: strict
source_debt: []
live_debt: []
```

When `learning_guide: canonical` is active, the single-page layout suppresses the legacy Zoology LOLO/LALA learning-cycle panel on this gateway; exact-head browser certification must prove one canonical CTA and zero legacy cycle panels.

## Protected F-08 boundary

During F-08:

- all eight Practical module files are byte-identical to exact base;
- `_data/academic/course_contract_v1.json` is byte-identical;
- Practical shared CSS/JS are unchanged;
- museum evidence/coverage/navigation assets are unchanged;
- no assessment runtime, Socratic, Admission/#356, Worker or Cloudflare configuration mutation is authorized.

The F-08 retained validator is successor-aware: F-09 may later authorize module-source convergence, but F-08 gateway artifacts and the governed Practical course identity remain protected.

## Promotion gate

Draft until unchanged-head F-08 source preservation, native Zoology Practical-I 213106 certification, retained A–F07/D/E, production Jekyll, exact-head browser/Axe/keyboard/320px reflow/text-spacing/reduced-motion/no-JS, CodeQL, review convergence, required Pages and Trusted Governance pass.


## F-08 exact-head table remediation

The first F-08 exact-head browser/Axe pass authenticated a deterministic presentation defect on the gateway only:

- Axe rule: `color-contrast` / serious;
- affected nodes: **5 table-header cells** across the unchanged Course Identity and Module Sequence tables;
- observed contrast: **1.39:1** (`#172033` on `#353845`);
- all F-08 metadata, Learning Guide, route order, keyboard focus, language, boundary count and reflow checks otherwise passed.

The authorized remediation is narrow and reuses the already-certified Academic-v1 table primitive:

`lbfl-academic-table-wrap`

Both unchanged Markdown tables are wrapped in keyboard-focusable `role="region"` containers with accessible names. No table wording, module order, scientific/curriculum content, Practical CSS/JS, module source or shared Academic-v1 CSS is changed.


## Review reconciliation

Two exact-head review findings were addressed without broadening learner scope:

1. Successor phases such as F-09 may change Practical module sources under their own authority. The F-08 validator now enforces byte-identical module content only for F-08/bootstrap certification while still authenticating the original F-08 module blobs and applying successor-phase scope rules.
2. The two Academic-v1 table wrappers also carry the existing `zoology-practical-table-scroll` class. This causes the retained Practical table enhancer to recognize the wrappers and skip creating nested focusable regions. Exact-head browser certification requires exactly two dual-purpose wrappers and zero nested Practical table wrappers.

No shared Practical JavaScript or CSS is changed.


## Final review hardening

Two late exact-head review findings are closed in the retained F-08 contract:

1. **Manual exact-main successor context.** `workflow_dispatch` now derives the comparison base from the current `CONV04_STATE authorized_base`, exports it as `PR_BASE_SHA`, and the validator classifies bootstrap/successor mode from that authenticated comparison base plus phase. Manual certification therefore remains valid after an authorized F-09 successor instead of falling back to F-08 byte-identity rules.
2. **Academic-v1 stylesheet trigger.** `assets/css/academic-design-system.css` is now in the F-08 workflow path filter, so any change to the presentation layer adopted by the Practical gateway reruns the five-viewport browser/Axe/reflow/focus/text-spacing/reduced-motion certification.

Neither hardening change broadens learner-content authority or weakens any browser/Axe assertion.
