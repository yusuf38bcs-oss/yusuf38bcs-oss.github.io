# CONV-04D-01 — Assessment Ownership Contract

**Contract:** `lbfl-assessment-ownership-v1`
**Version:** `CONV-04D-01-1.0.0`
**Authorized base:** `824a8188f7d7837091cc5d969a9b5194e49408bc`
**Status:** architecture-only; learner-facing assessment mutation remains frozen.

## 1. Canonical assessment loop

Every full assessment surface that supports interactive or repeated practice converges on:

**Attempt → Feedback → Repair → Reattempt**

- **Attempt** — answer before seeing the solution.
- **Feedback** — reveal correctness plus answer validity/explanation.
- **Repair** — identify the mistaken concept and return to the relevant source lesson or explanation.
- **Reattempt** — try the same concept or a comparable item after repair.

A score alone is not the canonical completion state.

## 2. Surface ownership

### Lecture

Lectures may own:

- 2–3 concise retrieval checks;
- a prediction, misconception, or transfer prompt;
- a CTA to the appropriate assessment route.

Lectures must not become the canonical owner of full MCQ/CQ banks or duplicate complete assessment engines.

### Assessment gateway

The assessment gateway owns:

- discovery of available assessment modules;
- grouping/filtering/orientation;
- concise explanation of the assessment-repair loop;
- routing to assessment modules and source learning routes.

It must not report an empty state when valid collection assessments exist.

### Assessment page

Assessment pages own:

- complete question banks;
- attempt state;
- answer feedback and validity logic;
- source-return guidance;
- repair prompt;
- reattempt capability or an explicit route to reattempt.

### Model test

Model-test surfaces may combine MCQ/CQ/short-answer/diagram work, but after scoring they must preserve the same repair principle: wrong or weak answers return to source learning before another attempt.

### Socratic reflection

Socratic reflection may inspect reasoning after assessment, but it is not the owner of academic answer correctness or the MCQ bank.

## 3. Collection truth

The `mcq-arena` Jekyll collection is authoritative for MCQ Arena learner documents.

A gateway for `/mcq-arena/academic/` must enumerate the relevant `mcq-arena` collection documents, not unrelated post-category membership.

## 4. Runtime rule

D-01 records the duplicate MCQ runtimes but does not consolidate them.

Before later consolidation:

- no runtime may weaken answer feedback;
- generated or authored items must escape untrusted text before DOM insertion;
- learner-facing completion must not imply validated cognitive diagnosis;
- the canonical repair loop must remain available without requiring a clinical, psychological, or intelligence interpretation.

## 5. Source-return rule

A wrong or weak assessment result should identify a relevant source learning route when that relationship is known.

The source-return CTA is educational repair navigation, not a score penalty.

## 6. Reattempt rule

After repair, the learner must have a clear way to reattempt:

- restart the assessment;
- retry the item/set;
- or open an equivalent assessment set.

The interface must not end permanently at a score.

## 7. Protected boundaries

D-01 does not authorize learner mutation.

Protected:

- all `_mcq-arena/` learner files;
- Biology lecture/course content;
- model-test learner content;
- Socratic/MI/Personality content;
- Practical content;
- BOT-08;
- Admission / PR #356;
- Worker/Cloudflare.

## 8. Promotion rule

D-01 may merge only when:

1. the machine-readable contract matches this document;
2. the authenticated assessment census is present;
3. changed-file scope is architecture-only;
4. validator syntax and execution pass;
5. production Jekyll build passes;
6. review threads are zero;
7. exact-head governance authority is valid.
