# CONV-04E-01 — HSC Botany Gateway + Chapter-01 Academic-v1 Convergence

**Authorized base:** `b07beb8119c4ee001d542a357f38c0e27e5017ba`

## Scope

E-01 changes exactly two learner-facing surfaces:

- `/biology/hsc-corner/botany/`
- `/biology/hsc-corner/botany/chapter-01-cell-and-its-structure/`

Both now declare Academic-v1 metadata and canonical Learning Guide ownership.

## Structural change only

The Botany gateway declares:

```yaml
academic_system: v1
academic_role: academic_gateway
lang: bn
learning_guide: canonical
```

The Chapter-01 index declares:

```yaml
academic_system: v1
academic_role: chapter_index
lang: bn
learning_guide: canonical
```

Each surface renders exactly one canonical **How to Learn with LBFL** CTA to `/learn/`.

The legacy `language: bn` key remains because it agrees with canonical `lang: bn`.

## Content-preservation boundary

On the bootstrap E-01 PR, removing only the four authorized front-matter additions and the one canonical Learning Guide include from each target must reproduce the authenticated base files byte-for-byte.

BOT-01 through BOT-07 and `_data/academic/hsc_botany_chapter01_scope_v1.json` remain byte-identical to the authorized base.

No scientific-content rewrite, new lesson authoring, assessment mutation, shared-runtime mutation, Zoology, Socratic, Practical, Admission/#356, Worker, or Cloudflare mutation is authorized.

## Chapter completion boundary

The Chapter-01 index remains:

```yaml
contract_state: convergence-pending
chapter_completion: not-certified
```

The nine authenticated curriculum gaps remain open. A **strict Academic Surface** means the page conforms to the Academic-v1 presentation/ownership contract; it does not mean Chapter-01 curriculum completion.

## Route ledger

- `hsc-botany-gateway` becomes strict with zero source/live debt.
- `hsc-botany-chapter-01` is registered as a strict `chapter_index` surface.

## Retained D contracts

D-04, D-05 and D-06 must remain green. D-06 runs in retained mode and is not reopened unless an actual retained-contract regression is found.

## Future-phase compatibility

E-01 ships its own bootstrap + retained model from the first implementation.

On later phases:

- live PR base identity replaces the historical E-01 base for candidate authentication;
- E-01's structural invariants must remain true;
- later Botany phases may extend learner content without rewriting E-01 historical provenance;
- immutable E-01 authorization/certification artifacts may not be silently changed;
- `CONV04_STATE.md` may advance only to a strictly later valid phase.

Manual certification requires `expected_main_sha` to equal both remote `main` and checked-out HEAD.

## Promotion gate

E-01 remains Draft until exact-head source preservation, retained A-D/D-06 contracts, production Jekyll, route-ledger rendering, browser/Axe, keyboard/focus, 320px reflow, text-spacing, reduced-motion, no-JS, CodeQL, review convergence, required Pages and Trusted Governance are satisfied.


## Exact-head accessibility remediation

The first exact-head Axe run exposed inherited legacy Botany colors after Academic-v1 activation. The remediation remains entirely inside the two authorized learner surfaces; **no shared CSS file is changed**.

- The canonical Learning Guide CTA is rendered outside the legacy `.lbfl-botany-index` dark-color wrapper on both surfaces.
- The Chapter-01 remaining-gap paragraph uses the existing `.lbfl-academic-lead` semantic class.
- The existing Botany return link keeps its text and destination but uses the existing `.lbfl-academic-button` semantic class.

No scientific wording, curriculum status, learner link destination, heading, card, assessment artifact, or shared runtime is changed by this remediation.
