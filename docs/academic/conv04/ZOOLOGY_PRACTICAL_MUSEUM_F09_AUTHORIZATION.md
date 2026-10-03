# CONV-04F-09 — prac-01 Museum Specimens Authorization

**Status:** AUTHORIZED FOR ISOLATED IMPLEMENTATION  
**Authorized base:** `f04ac472ee261fa19dc17de6052bde02b75e99c4`  
**Selected module:** `prac-01 Museum Specimens`  
**Learner source:** `_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md`  
**Baseline learner blob:** `26e1711cf9c6bace8ddd8419797c38511987420c`

## Baseline acceptance

F-09 authentication was accepted through merged PR #423. Its final candidate head `78630f701b384fd5eb9fc88d3c91e19da5d89d62` completed 23/23 retained pull-request certifications, Trusted Release Governance PASS, and zero unresolved review threads before merge. The resulting authoritative base for this implementation is `f04ac472ee261fa19dc17de6052bde02b75e99c4`.

## Scientific and curriculum custody

The selected module is bound to the following immutable baseline evidence:

- Practical-I coverage manifest blob: `ab66ddafc1346b65337bc52236d1029a77cf5792`.
- Museum figure-custody manifest blob: `9529da79d51bfff15c56128bfcf56a88a6735869`.
- Strict Practical course-contract blob: `a02365ea6743c44a1eddaf84ad05f66d670ade6b`.
- Practical gateway blob: `d45ae49889c5e6d02445776ca5120f5fcedda65e`.
- Shared Practical CSS blob: `0962ae71cd1e424e27949b409f5284493f722dd3`.
- Shared Practical JS blob: `207684413ad7925686334cafc3748861a439f206`.

The curriculum/content baseline is:

- printed syllabus entries: **49**;
- unique syllabus labels: **48**;
- covered unique labels: **48/48**;
- duplicated printed label: **Echinus**;
- museum visual custody: **15 verified-image / 33 pending-verified-image**;
- public visual rendering: **15 true / 33 false**;
- governed course: `nu-zoology-practical-213106`;
- course enforcement: **strict**;
- governed module sequence: exactly `prac-01` through `prac-08`, unchanged.

### Seven protected nomenclature flags

1. Metaphere spelling/identity requires departmental specimen-label verification.
2. Pheretima remains a separate syllabus label because the syllabus lists it separately.
3. Traditional *Diphyllobothrium latum* maps to modern *Dibothriocephalus latus*.
4. *Hymenolepis nana* retains syllabus/CDC usage; NCBI current name is *Rodentolepis nana*.
5. *Convoluta* modern placement Xenacoelomorpha/Acoela differs from traditional Platyhelminthes.
6. *Sipunculus* traditional phylum framing differs from modern annelid phylogeny.
7. *Eupagurus* is a traditional genus label with many species moved to *Pagurus*/other genera.

No taxonomic, diagnostic-character, classification, nomenclature, syllabus-label, image-provenance, or curriculum-coverage rewrite is authorized by F-09.

## Exact learner mutation allowlist

Only this learner-facing source may change:

`_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md`

Authorized transformation is structural Academic-v1 convergence only:

- add `academic_system: v1`;
- add `academic_role: practical`;
- add `learning_guide: canonical`;
- add exactly one canonical Learning Guide CTA after the learner-owned H1;
- remove duplicate source-level loading of the shared Practical CSS/JS because layout ownership already loads them for course `zoology-practical-213106`;
- replace the 15 evidence-bound inline sprite-position declarations with equivalent module-owned CSS selectors in a **new module-specific stylesheet**, preserving exact specimen-to-sprite coordinates;
- no scientific prose, classification table, diagnostic character, figure caption, figure provenance, syllabus note, spotting template, or nomenclature note may change.

## Protected surfaces

The following are immutable in F-09:

- all seven sibling Practical module sources (`prac-02` … `prac-08`);
- Practical gateway `_biology/higher-zoology-tree/practical/index.bn.md`;
- strict course contract `_data/academic/course_contract_v1.json`;
- coverage manifest `_data/zoology-practical-213106-coverage.json`;
- museum figure-custody manifest `_data/zoology-practical-museum-figures.json`;
- shared `assets/css/zoology-practical.css`;
- shared `assets/js/zoology-practical.js`;
- all verified image assets and pending-image status;
- assessment runtime, Socratic surfaces, Admission/#356, Worker and Cloudflare configuration.

## Authorized non-learner implementation artifacts

F-09 may add or update only the governance/certification artifacts required to prove this exact mutation, including:

- this authorization record;
- `docs/academic/conv04/CONV04_STATE.md`;
- `docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json`;
- one F-09 manifest;
- one F-09 source validator;
- one F-09 browser/Axe validator;
- one F-09 GitHub Actions certification workflow;
- one new module-specific Museum stylesheet containing only the authenticated 15 sprite-position mappings.

## Promotion contract

Promotion is forbidden unless the exact candidate head proves:

1. exact current base ancestry and unchanged learner allowlist;
2. authorized-transform equality against learner blob `26e1711c...`;
3. 48/48 labels and 49 printed-entry semantics preserved;
4. 15 verified / 33 pending image custody preserved;
5. all seven nomenclature flags preserved;
6. all 15 verified specimen identifiers, captions, accessible labels and sprite coordinates preserved;
7. strict course identity and eight-module order preserved;
8. gateway, sibling modules and shared Practical CSS/JS byte-identical to the authorized base;
9. Academic Surface, retained CONV-04, Practical-I 213106, Jekyll, browser, Axe, keyboard, reflow, text-spacing, reduced-motion and no-JS checks PASS;
10. exact-head Cloudflare Pages preview PASS;
11. zero unresolved review threads;
12. exact-head SOLO-MAINTAINER approval, Ready-state recertification and Trusted Governance PASS.

Scientific/curriculum rewrite authority remains **NONE**.
