# CONV-04C-01 — Canonical Learning Guide Contract

**Contract:** `lbfl-learning-guide-contract-v1`
**Version:** `CONV-04C-01-1.0.0`
**Authorized base:** `5e3a3e8919d1f26740ebab94fce099a49fe7f1b1`
**Status:** architecture-only; learner-facing authoring remains frozen.

## 1. Canonical ownership

LBFL will have one platform-wide learner guide:

**How to Learn with LBFL**

Reserved planned permalink:

`/learn/`

C-01 reserves the ownership and route identity only. It does not create the learner-facing route.

The guide will own the explanation of how a learner should move through LBFL. Course gateways, lectures, assessments, practical pages, and reflection pages may link to it but must not independently reproduce a second full platform-learning guide.

## 2. Canonical learning cycle

The platform learning cycle is:

`Understand → Retrieve → Explain → Apply → Reflect → Repair`

1. **Understand** — build an accurate concept/mechanism model.
2. **Retrieve** — recall or predict without immediately rereading.
3. **Explain** — express the mechanism, relationship, or evidence in the learner’s own words.
4. **Apply** — transfer the concept to a diagram, stimulus, practical context, data set, or real-life case.
5. **Reflect** — inspect uncertainty, misconceptions, reasoning quality, and learning strategy.
6. **Repair** — return to the source concept, correct the model, and reattempt.

This is the top-level learner journey. Existing LBFL frameworks support it; they do not compete with it.

## 3. Supporting-framework ownership

### LOLO / LALA

`_pages/frameworks/lolo-lala.md` remains the specialist constructive-alignment reference.

It owns:
- Learning Objectives;
- Learning Outcomes;
- Learning Activities;
- Learning Applications.

Topic-specific objectives and outcomes remain legitimate lesson content. What should disappear during later migration is repeated **explanation of the LOLO/LALA method**, not the objectives/outcomes themselves.

### Bloom Taxonomy

`_pages/frameworks/bloom-taxonomy.md` remains the cognitive-demand reference.

It helps select task demand from remember through create. It is not the learner’s global navigation model.

### CQ Studio

`_pages/frameworks/cq-studio.md` remains the creative-question reference.

It owns stimulus-linked CQ construction and answer logic, not the full LBFL learning pathway.

### Assessment Rubric

`_pages/frameworks/assessment-rubric.md` remains the assessment-quality reference.

It supports feedback and self-check but does not replace assessment ownership in MCQ/CQ surfaces.

### Practical Learning Framework

`_pages/frameworks/practical-framework.md` remains the observation/evidence/application reference.

It supports **Apply** and **Reflect** without becoming generic lecture boilerplate.

### Synaptic Bridge cycle

The homepage data currently defines:

**Observe → Question → Connect → Explain**

This remains a critical-thinking mechanism that supports **Understand** and **Explain**.

### Assessment repair loop

The homepage data currently defines:

**Attempt → Feedback → Repair → Reattempt**

This remains the feedback mechanism that supports **Retrieve** and **Repair**.

## 4. Surface rules

### Gateways

May:
- explain course orientation;
- show sequence/progress;
- provide a concise “How to learn here” entry point;
- link to `/learn/`.

Must not:
- embed the full global learning-method guide.

### Lectures

Own:
- topic-specific learning objectives/outcomes;
- scientific explanation;
- figures/examples;
- 2–3 concise retrieval checks;
- prediction or misconception prompts where useful;
- references/provenance;
- a canonical assessment CTA when available.

Must not:
- repeat full LOLO/LALA, Bloom, CQ, Practical, Synaptic, or generic study-method essays.

### Assessment surfaces

Own:
- complete MCQ/CQ/short-answer banks;
- attempt;
- feedback;
- misconception/source return;
- reattempt.

### Practical surfaces

Own:
- procedure;
- materials/specimen;
- observation;
- safety;
- record/calculation;
- topic-specific application.

### Reflection surfaces

Own:
- educational metacognition and reflection under the existing non-clinical/non-diagnostic boundary.

## 5. Migration bridges

`_includes/education/framework-links.html` and `_includes/zoology/learning-cycle.html` are **temporary migration bridges**.

C-01 does not remove them.

Later C-phase work may:
- make the canonical guide the primary method entry point;
- retain links to specialist references;
- collapse repeated method explanation to concise route-appropriate guidance.

## 6. Route-creation gate

The future learner-facing guide must not be authored until a later CONV-04C gate explicitly authorizes it.

Before route creation, that gate must bind:

- exact source path;
- front matter;
- language;
- accessibility;
- Academic v1 activation;
- navigation entry points;
- no-JavaScript information availability;
- relationship to existing framework pages.

## 7. Protected boundaries

CONV-04C-01 does not authorize:

- learner-facing page mutation;
- framework-page rewriting;
- MCQ ownership migration;
- Botany/Higher Zoology/Practical migration;
- Socratic/MI/Personality migration;
- homepage course-data convergence;
- BOT-08;
- Admission / PR #356 mutation;
- Worker/Cloudflare mutation.

## 8. Promotion rule

C-01 may merge only when:

1. the machine-readable contract matches this document;
2. the authenticated census is present;
3. the changed-file scope contains only C-01 architecture artifacts;
4. validator syntax and execution pass;
5. production Jekyll build passes;
6. review threads are zero;
7. exact-head governance authority is valid.

Only after C-01 merges may the next CONV-04C gate authorize learner-facing implementation.
