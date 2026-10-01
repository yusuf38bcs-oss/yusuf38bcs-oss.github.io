# CONV-04C-01 — Authenticated Learning-Method Census

**Snapshot:** `5e3a3e8919d1f26740ebab94fce099a49fe7f1b1`  
**Mode:** read-only census recorded before learner-facing migration.  
**Purpose:** distinguish platform-wide learning-method explanation from topic-specific teaching content so CONV-04C does not solve duplication by deleting useful instructional structure.

## Authenticated repository observations

GitHub code search and source inspection at the authorized baseline established the following:

| Signal | Authenticated count / location | Interpretation |
|---|---:|---|
| Files declaring “This page is the canonical reference” | 5 | LOLO/LALA, Bloom Taxonomy, CQ Studio, Assessment Rubric, and Practical Learning each claim specialist canonical-reference status. |
| Files containing `LOLO` | 36 | The term is distributed across framework, utility, include, documentation, and learner-content surfaces. |
| Files containing `LALA` | 36 | Same distributed ownership pattern as LOLO. |
| Direct uses of `education/framework-links.html` | 45 | A shared framework-link panel is already widely injected into hubs, assessment pages, and Biology routes. |
| Zoology learning-cycle include | `_includes/zoology/learning-cycle.html`, injected from `_layouts/single.html` | A separate LOLO→LALA cycle exists as a route-level learning-method bridge. |
| Exact “Study Route” phrase | 3 learner pages | Some courses also carry local study-sequence guidance. |
| `## Learning Objectives` in `_biology` | 32 files | These are topic-specific instructional elements and are not automatically duplication debt. |
| `## Learning Outcomes` in `_biology` | 11 files | Same: topic-specific outcomes remain legitimate lesson ownership. |
| Exact `DOT-LINE-CIRCLE` phrase | 2 files | It is documented in governance/contract material but is not currently a widespread learner-facing pattern. |

## Five specialist reference pages

The current specialist references are:

1. `_pages/frameworks/lolo-lala.md`
2. `_pages/frameworks/bloom-taxonomy.md`
3. `_pages/frameworks/cq-studio.md`
4. `_pages/frameworks/assessment-rubric.md`
5. `_pages/frameworks/practical-framework.md`

Each explicitly tells hubs/lectures/assessment pages to link to the central reference instead of repeating its full explanation. The problem is therefore not absence of framework documentation; it is the lack of one learner-facing **platform learning guide** that explains when and how these specialist references fit together.

## Existing shared cycles

Two additional platform-level learning cycles are already encoded in `_data/homepage.yml`:

- Synaptic Bridge: **Observe → Question → Connect → Explain**.
- Assessment repair loop: **Attempt → Feedback → Repair → Reattempt**.

CONV-04C must integrate these as supporting mechanisms rather than create another competing vocabulary.

## Ownership conclusion

The canonical guide will own the platform-wide explanation of **how to learn with LBFL**.

It will not take ownership away from:

- lesson-specific objectives/outcomes;
- course-specific sequence/progression;
- full assessment banks;
- practical procedures;
- reflective instruments;
- specialist framework reference pages.

The convergence target is:

```text
Understand → Retrieve → Explain → Apply → Reflect → Repair
       │          │          │         │         │        │
       └──── specialist frameworks and route-specific tasks support the cycle ────┘
```

## C-01 boundary

This census authorizes architecture only. It does **not** authorize:

- creation of the learner-facing `/learn/` page;
- rewriting any framework page;
- removing LOLO/LALA from a learner page;
- changing MCQ ownership;
- changing Botany/Zoology/Practical/Socratic content;
- BOT-08;
- Admission / PR #356;
- Worker or Cloudflare mutation.

Those changes require a later CONV-04C implementation gate.
