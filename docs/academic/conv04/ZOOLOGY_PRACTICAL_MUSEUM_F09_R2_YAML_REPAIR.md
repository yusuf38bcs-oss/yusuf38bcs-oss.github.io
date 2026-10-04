# CONV-04F-09-R2 — Production Parity Workflow YAML Repair

**Mode:** certification-only workflow repair
**Authorized base:** `ec7fc9f12e4f42ebba257b6e9d12f1be7d1b155b`
**Learner mutation authority:** **NONE**

## Trigger

PR #426 merged F-09-R1 successfully, but the new post-merge production-parity workflow failed before any job started because GitHub rejected the workflow YAML at line 153.

Authenticated run:

- workflow run: `37170258135`
- main SHA: `ec7fc9f12e4f42ebba257b6e9d12f1be7d1b155b`
- failure: `Invalid workflow file ... line 153`

The defect is confined to YAML indentation of the embedded Python heredoc inside:

`.github/workflows/conv04f-zoology-practical-museum-production-parity.yml`

No Cloudflare production deployment or Museum browser certification from that workflow was executed.

## Exact repair scope

R2 may change only:

1. `.github/workflows/conv04f-zoology-practical-museum-production-parity.yml`
   - repair YAML block indentation and trigger on R2 authority changes;
2. `.github/workflows/conv04f-zoology-practical-museum-certification.yml`
   - trigger retained Museum certification when R1/R2 authority artifacts change;
3. `.github/scripts/validate-conv04f-zoology-practical-museum.rb`
   - authorize this one exact R2 maintenance transition and protect the R2 artifact in successor phases;
4. `docs/academic/conv04/CONV04_STATE.md`;
5. this R2 authorization document.

## Protected

Unchanged:

- prac-01 learner source;
- Museum route CSS;
- 48/48 curriculum corpus;
- 15 verified / 33 pending figure custody;
- 7 nomenclature flags;
- Practical course contract and module order;
- shared Practical CSS/JS;
- F-09 browser harness;
- all assessment and other learner surfaces.

## Promotion and production gate

After exact-head R2 retained checks, Ready, exact SOLO authority, Trusted Governance, and unchanged-head merge:

1. the push-triggered production-parity workflow must parse and start;
2. exact merge SHA must be deployed to the Cloudflare Pages production branch;
3. resolver must authenticate canonical successful exact-head production;
4. native F-09 browser certification must PASS against both:
   - the immutable exact deployment URL;
   - `https://learningbiologyforlife.org`;
5. current main must remain unchanged through the run.

`prac-02` remains blocked until this production gate passes.
