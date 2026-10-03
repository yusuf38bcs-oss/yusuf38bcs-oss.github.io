# CONV-04F-06 — HSC Digestive System Gateway Authorization

**Status:** AUTHORIZED — learner implementation not yet performed  
**Exact base:** `55fd04f004f3f352cf90d4e026702d6714096072`  
**Branch:** `conv-04f-06-digestive-gateway-authorization-20261003`

## Actual route owner

Canonical route:

`/biology/hsc-corner/zoology/digestive-system/`

is owned by:

`_biology/hsc-corner/zoology/digestive-system/index.md`

No competing static route owner was found. The page already uses `layout: single`; the existing Academic-v1 layout path can supply its educational boundary, so no shared-layout mutation is authorized.

## Protected governed course

The course contract is already **governed / strict** with an exact 14-module sequence (`dig-01` → `dig-14`). The course-contract blob and all fourteen lecture-source blobs are captured in the authorization manifest and must remain byte-identical.

## Authorized learner scope

Exactly one learner-facing file may change:

`_biology/hsc-corner/zoology/digestive-system/index.md`

Authorized metadata:

```yaml
academic_system: v1
academic_role: course_index
lang: bn
learning_guide: canonical
```

The agreeing legacy `language: bn` key may remain. Add exactly one canonical Learning Guide CTA.

The current gateway contains a page-local `<style>` block. F-06 may remove it only by migrating the existing hero/cards to **existing Academic-v1 primitives**. Shared CSS and shared layout are out of scope.

All 14 lecture links/order, learner-facing scientific descriptions, and Editorial and Exam Alignment wording must remain semantically unchanged.

## Route ledger

Register the Digestive System gateway as a strict Academic-v1 course index with `bn`, layout-owned boundary, canonical Learning Guide ownership, MCQ Arena assessment ownership, and zero source/live debt after certification.

## Explicit exclusions

No lecture rewrite, course-contract mutation, assessment-bank/runtime mutation, Higher Zoology, Botany, Socratic, Practical, Admission/#356, Worker, Cloudflare, shared CSS, or shared layout mutation is authorized.

## Next gate

Implement only the gateway plus F-06 ledger/manifest/validator/browser/workflow/state artifacts. Retain A–E, F-01 through F-05, D-04/D-05/D-06, the course contract, and all fourteen lecture sources.
