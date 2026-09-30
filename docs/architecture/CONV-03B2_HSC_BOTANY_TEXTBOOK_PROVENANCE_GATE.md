# CONV-03B.2 — HSC Botany Authoring Authority & Textbook-Alignment Boundary

**Authorized base:** `8f306f14f0570df5bc46d65f91702984c3c4d692`  
**Parent pathway:** `hsc-botany`  
**Mode:** primary-curriculum authority / edition-neutral authoring / fail-closed textbook claims

## Executive resolution

CONV-03B.2 began with an assumption that learner-content creation must wait until LBFL selected and byte-acquired a single current NCTB-approved Biology 1st Paper textbook edition.

Fresh official-source review shows that assumption is too strong and structurally unsound.

The current official NCTB 2025–26 XI–XII textbook page exposes exactly five centrally distributed/common textbook rows:

1. সাহিত্যপাঠ
2. সহপাঠ
3. English for Today
4. তথ্য ও যোগাযোগ প্রযুক্তি
5. তথ্য ও যোগাযোগ প্রযুক্তি (ইংলিশ ভার্সন)

It does **not** expose Biology, Physics, Chemistry, or Higher Mathematics as downloadable subject-textbook rows.

Separately, the official NCTB Biology document already in custody is **National Curriculum 2012 — Biology (XI–XII)**. It is a curriculum document, not a private Biology textbook.

Historical NCTB approval registers prove that XI–XII Biology 1st Paper has had multiple privately published NCTB-approved editions. The 2018–2021 register explicitly lists several Biology 1st Paper author/publisher combinations. That evidence establishes the private-edition approval model, but it does not establish a single current-2026 canonical private edition.

Therefore a single private textbook edition cannot be treated as the normative authoring authority for LBFL.

## Corrected source hierarchy

### Tier 1 — normative scope authority

The official NCTB Biology curriculum is the governing source for:

- Chapter identity;
- required topic scope;
- learning outcomes and expected coverage;
- period allocation;
- practical/assessment expectations.

For Chapter 01, the authoritative range remains:

**NCTB Biology curriculum 2012, PDF pages 31–33, 25 periods.**

### Tier 2 — scientific content authority

Every new or expanded learner lesson must be written against:

- its exact NCTB curriculum `topic_id`; and
- at least two authoritative biology references for substantive scientific claims; and
- an LBFL academic review before merge.

This supports academically correct, curriculum-bound content without making unsupported claims about a particular commercial edition.

### Tier 3 — private textbook alignment

A current NCTB-approved private Biology 1st Paper edition may later be acquired and used for corroborative alignment.

Until exact edition custody exists, LBFL must not:

- claim exact agreement with a named private edition;
- cite unverified private-textbook page numbers;
- present a private publisher's wording as canonical NCTB wording.

Private textbook alignment is therefore **optional for authoring** and **required only for textbook-specific claims**.

## Why this resolves the blocker

The previous gate conflated two different questions:

1. **What must students learn?** — answered by the official NCTB curriculum.
2. **How does a particular approved publisher present it?** — answered by a private textbook edition.

Only the first question is necessary to begin evidence-based learner-content creation.

Requiring one private edition before authoring would create three problems:

- it would make one publisher an artificial normative authority;
- it would freeze authoring when current private-edition approval evidence is not publicly discoverable;
- it would contradict the multi-edition approval model shown in NCTB's own historical registers.

CONV-03B.2 therefore separates **authoring authority** from **textbook-alignment authority**.

## Authorized authoring architecture

The 11 unresolved Chapter-01 coverage gaps are now consolidated into the following deterministic authoring baseline.

| Action | Type | Curriculum gaps |
|---|---|---|
| `expand-bot-01` | expand existing lesson | cell size/shape/inclusions; cell discovery history |
| `bot-07` — Cell Wall and Vacuole | new lesson | cell wall; vacuole |
| `bot-08` — Plastid and Chloroplast | new lesson | chloroplast |
| `bot-09` — Centriole and Microtubule Structures | new lesson | centriole/microtubule |
| `bot-10` — Nucleus, Nucleolus, Chromatin and Chromosome | new lesson | nuclear components |
| `bot-11` — Chemical Components of the Cell | new lesson | cell chemical components |
| `bot-12` — Prokaryotic and Eukaryotic Cells | new lesson | prokaryotic/eukaryotic comparison |
| `bot-pr01` — Microscopy, Mounting, Drawing and Cell Observation | practical module | microscopy/mounting/drawing; chapter practical integration |

This mapping covers all 11 gap IDs exactly once.

The numbering above is an **authoring baseline**, not strict chapter certification. The new/expanded content must still pass its own academic, route, assessment, and browser gates before Chapter 01 can be promoted.

## Current authority

After this change:

`missing_lesson_authoring_authorized = true`

`strict_child_authorized = false`

`textbook_specific_wording_or_page_claims_authorized = false`

This means learner-content creation may begin, but Chapter 01 remains convergence-pending and not-certified.

## Textbook alignment ledger

The existing 11 textbook page-binding entries are preserved, but their role changes from blocking authoring to optional corroborative alignment.

Each remains:

- no selected current edition;
- no claimed page number;
- no claimed page-label mapping;
- no verified textbook claim mapping.

Status:

`optional-textbook-alignment-pending`

## Fail-closed authoring rules

A new or expanded lesson must not be merged merely because authoring is authorized.

Each lesson must:

1. map to one or more authorized NCTB Chapter-01 topic IDs;
2. preserve the edition-neutral boundary;
3. use at least two authoritative biology references for substantive scientific claims;
4. include the appropriate LBFL assessment surface;
5. pass content review and normal repository certification;
6. avoid claiming private-textbook wording or page alignment without exact custody.

## Strict promotion remains blocked

HSC Botany remains:

`progressive / convergence-pending`

Chapter 01 remains:

`not-certified`

Strict Chapter-01 promotion still requires:

- all required curriculum topics to become covered;
- every new/expanded lesson to pass academic content certification;
- MCQ/CQ or practical assessment coverage as appropriate;
- canonical route integrity;
- deterministic navigation;
- chapter-level final review.

## Non-authority

CONV-03B.2 does not:

- select a private Biology textbook edition;
- claim current NCTB approval for a private edition;
- claim private textbook bytes or SHA-256 custody;
- cite unverified private textbook pages;
- promote Chapter 01 to strict;
- promote the parent HSC Botany course to strict;
- write the learner-content lessons themselves;
- modify Worker, Cloudflare, DNS, AdSense or production runtime;
- modify Admission PR #356.

## Next gate

After CONV-03B.2 is merged, learner-content creation may start with an isolated content PR, beginning with the first authorized action:

**`expand-bot-01` or `bot-07 — Cell Wall and Vacuole`**

Each content PR must remain source-bound and independently certified before merge.
