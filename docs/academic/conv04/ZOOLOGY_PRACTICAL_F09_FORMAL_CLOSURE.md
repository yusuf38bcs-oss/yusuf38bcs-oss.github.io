# CONV-04F-09 — Zoology Practical-I Formal Closure

**Closure base:** `9b739e7371ede99c60bb509ed750670eeb0853c9`
**Closure date:** 2026-10-06
**Scope:** whole-programme forensic closure for F-09 only
**Learner-content mutation:** none
**Next phase:** CONV-04F-10A Ecology BN 01–10 authorization, only after this closure is merged and exact-main re-authenticated.

## 1. Closure decision

F-09 is eligible for formal closure because the final module implementation (R101 / prac-08 Field Report) merged to exact main and the required post-merge production evidence is now complete.

This closure does not authorize any Ecology learner-content mutation. It only records the completed Practical programme and advances the CONV-04 state machine to the F-10A authorization gate.

## 2. Exact-main evidence

Authenticated main:

`9b739e7371ede99c60bb509ed750670eeb0853c9`

Merge identity:

- PR #444 — CONV-04F-09-R101: converge prac-08 Field Report
- reviewed R101 head: `bfbd7f71f3673afe1eb35b2d8f907ed8cb5bcf25`
- merge/main: `9b739e7371ede99c60bb509ed750670eeb0853c9`

Post-merge exact-main workflows:

| Evidence | Run | Conclusion |
|---|---:|---|
| Deploy to GitHub Pages | 37396500713 | PASS |
| Sovereign Site Audit v4 | 37396500784 | PASS |
| CodeQL Exact-Head Security Scan | 37396501322 | PASS |
| Museum Production Parity | 37396500911 | PASS |
| Permanent Slides Production Parity | 37396501199 | PASS |
| Whole Mounts Production Parity | 37396501509 | PASS |
| Dissection Production Parity | 37396501007 | PASS |
| Temporary Mounts Production Parity | 37396500983 | PASS |
| Appendages Production Parity | 37396500808 | PASS |
| Zooplankton Production Parity | 37396500865 | PASS |
| R101 Field Report Production Parity | 37396500764 | PASS |
| Ecology 10-Lecture Live Production Certification | 37396643047 | PASS / retained evidence only |

All listed runs are completed with `conclusion: success` and `head_sha: 9b739e7371ede99c60bb509ed750670eeb0853c9`.

## 3. 8/8 Practical route ownership

The strict Academic Route Ledger contains the gateway plus all eight canonical Practical modules with:

- `academic_role: practical`;
- `learning_guide_owner: canonical`;
- `boundary_owner: layout`;
- `assessment_owner: mcq-arena`;
- `enforcement: strict`;
- empty `source_debt`;
- empty `live_debt`.

Canonical modules:

1. `/biology/higher-zoology-tree/practical/museum-specimens/`
2. `/biology/higher-zoology-tree/practical/permanent-slides/`
3. `/biology/higher-zoology-tree/practical/whole-mounts/`
4. `/biology/higher-zoology-tree/practical/dissection/`
5. `/biology/higher-zoology-tree/practical/temporary-mounts/`
6. `/biology/higher-zoology-tree/practical/appendages/`
7. `/biology/higher-zoology-tree/practical/zooplankton/`
8. `/biology/higher-zoology-tree/practical/field-report/`

Gateway:

`/biology/higher-zoology-tree/practical/`

## 4. Preservation contract

F-09 closure preserves the already-certified scientific/curriculum corpus and does not reopen module authoring.

Protected at closure:

- course identity and module order;
- Practical gateway/navigation ownership;
- shared Academic-v1 runtime and CSS/JS;
- MCQ Arena assessment ownership;
- canonical Learning Guide ownership;
- module scientific/curriculum content;
- Museum 48-label contract and verified/pending-figure evidence;
- Practical nomenclature flags and evidence;
- Field Report ecological/statistical/ethical/reporting corpus, including the ≥10-sample requirement, quadrat calculations, Shannon–Wiener calculation, exact 17-mark distribution and five Socratic questions;
- all non-Practical CONV-04 surfaces;
- F-10 Ecology learner content.

## 5. Programme closure

```text
F-09 gateway                         PASS
F-09 prac-01 Museum                 PASS
F-09 prac-02 Permanent Slides       PASS
F-09 prac-03 Whole Mounts           PASS
F-09 prac-04 Dissection             PASS
F-09 prac-05 Temporary Mounts       PASS
F-09 prac-06 Appendages             PASS
F-09 prac-07 Zooplankton            PASS
F-09 prac-08 Field Report           PASS
8/8 strict route-ledger ownership   PASS
8/8 exact-main production parity    PASS
Pages / Site Audit / CodeQL         PASS
learner mutation in closure         NONE
                                      ↓
CONV-04F-09 FORMALLY CLOSED
```

## 6. Successor gate

After this closure PR is merged:

1. authenticate the new exact `main`;
2. confirm this closure record is present on that exact main;
3. authorize **CONV-04F-10A Ecology BN 01–10** in a new isolated branch/PR;
4. freeze the Ecology Bangla source/curriculum/scientific baseline before mutation;
5. protect English synchronization for F-10B;
6. reserve whole-F certification for F-11.

No F-10A implementation is authorized by this document itself.
