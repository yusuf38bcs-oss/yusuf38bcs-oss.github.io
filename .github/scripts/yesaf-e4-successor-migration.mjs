#!/usr/bin/env node
// YESAF E4 controlled-successor migration: pure read-only attestation.
// This file is NOT a successor-guard override, trusted status writer, merge
// approval, workflow dispatch, repository-setting update, or production writer.
import { evaluateBridge, POLICY, gitBlobSha1 } from './yesaf-e4-bridge.mjs';

export const SUCCESSOR_MIGRATION = Object.freeze({
  schema: 'yesaf-e4-controlled-successor-migration/v1',
  repository: POLICY.repository,
  base: POLICY.mainSha,
  sixWriterPr: { number: 496, head: POLICY.pr496 },
  twoWriterPr: { number: 497, head: POLICY.pr497 },
  guardedCandidates: Object.freeze([
    Object.freeze({
      path: '.github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml',
      retiringBlob: '305b555b153c30719fedcc88164947a2c85fe5f9',
      predecessorGuard: '.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml',
      predecessorGuardBlob: '1142d9c341f34d5926a5855cfc06c54a46a82d13',
    }),
    Object.freeze({
      path: '.github/workflows/conv04f-zoology-practical-field-report-production-parity.yml',
      retiringBlob: '9c5facafde56309951db4e768f7040582c0aa96c',
      predecessorGuard: '.github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml',
      predecessorGuardBlob: 'e92f4f9bec9d4e2db51bcbeb65da958cfa3a1114',
    }),
  ]),
});

function must(ok, message) {
  if (!ok) throw new Error(`YESAF E4 MIGRATION FAIL-CLOSED: ${message}`);
}
function setEqual(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length &&
    new Set(actual).size === actual.length &&
    JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}

// Candidate files are inert *only at their reviewed exact Git blob identities*.
// Regex alone is not a security proof; use Git's full blob object hash first.
export function verifyTwoRetirementCandidates(candidateBlobs) {
  const list = SUCCESSOR_MIGRATION.guardedCandidates;
  must(setEqual(candidateBlobs?.map(x => x.path), list.map(x => x.path)),
    'exact two-file retirement source inventory required');
  for (const expected of list) {
    const b = candidateBlobs.find(x => x.path === expected.path);
    must(b.ref === POLICY.pr497 && b.sha === expected.retiringBlob,
      `unreviewed PR #497 candidate identity: ${expected.path}`);
    must(typeof b.content === 'string' && gitBlobSha1(b.content) === b.sha,
      `content / immutable Git blob mismatch: ${expected.path}`);
    must(/^on:\s*\n\s+workflow_dispatch:\s*$/m.test(b.content) &&
      /^permissions:\s*\n\s+contents:\s*read\s*$/m.test(b.content) &&
      /\bretired_notice:\s*$/m.test(b.content),
      `retirement source does not have the reviewed notice structure: ${expected.path}`);
    must(!/^\s*(?:push|pull_request_target|workflow_run|repository_dispatch|schedule):/m.test(b.content) &&
      !/wrangler|CLOUDFLARE_.*TOKEN|deploy-pages|pages:\s*write|id-token:\s*write|environment:\s*production/i.test(b.content),
      `retirement source retains a privileged publishing pattern: ${expected.path}`);
  }
  return Object.freeze({verified: 2, source: `PR #497 @ ${POLICY.pr497}`});
}

/**
 * A strict migration evidence packet; the predecessor immutability conflict
 * must remain explicitly acknowledged. Old trusted base guards always reject
 * edits/renames of their own guard files and these two publisher files.
 * This function can never return release or merge authorization.
 */
export function evaluateControlledSuccessorMigration(input) {
  must(input?.schema === SUCCESSOR_MIGRATION.schema, 'unexpected migration packet schema');
  const interim = evaluateBridge(input.bridge_snapshot);
  must(interim.verdict === 'INTERIM_QUARANTINE_EVIDENCE_PASS' &&
    interim.production_release === 'HOLD' && interim.eligible_for_merge === false,
    'read-only nine-writer interim quarantine is not established');
  const candidate = verifyTwoRetirementCandidates(input.retirement_candidates);
  must(input.predecessor_guards === 'IMMUTABLE_AND_ENFORCED',
    'existing predecessor guards must be explicitly preserved, not bypassed');
  must(input.existing_guard_disposition === 'FAIL_FOR_PROTECTED_RETIREMENT',
    'old R91/R101 guard failure cannot be silently waived');
  must(input.control_plane_mutation === false && input.ruleset_bypass === false &&
    input.source_merge === false && input.production_deployed === false,
    'input illegally claims completed control-plane or production promotion');
  for (const protectedEntry of SUCCESSOR_MIGRATION.guardedCandidates) {
    const guard = input.bridge_snapshot?.blobs?.find(x =>
      x.path === protectedEntry.predecessorGuard && x.ref === POLICY.mainSha);
    must(guard?.sha === protectedEntry.predecessorGuardBlob,
      `predecessor guard identity drift: ${protectedEntry.predecessorGuard}`);
  }
  return Object.freeze({
    verdict: 'CONTROLLED_SUCCESSOR_MIGRATION_CANDIDATE_VERIFIED',
    six_writer_retirement: `PR #496 @ ${POLICY.pr496}`,
    two_writer_retirement: candidate.source,
    predecessor_guard_disposition: 'EXPECTED_FAIL_UNTIL_SEPARATELY_AUTHORIZED_GOVERNANCE_MIGRATION',
    interim_disabled_publishers: 9,
    production_release: 'HOLD',
    eligible_for_merge: false,
    authorized_guard_exception: false,
    mandatory_next_gate: 'OWNER-AUTHORIZED CONTROL-PLANE TRANSITION WITH INDEPENDENT NEGATIVE TESTS AND FIRST-PUSH PROOF',
    non_waivable_requirements: [
      'No silent predecessor guard bypass or fabricated green status',
      'A separately documented owner-approved migration is required for any protected guard/file modification',
      'Nine publisher disablements and zero live publishing runs must be revalidated immediately before a main merge',
      'No production credentials in candidate CI and no write-token fallback',
      'Five required current-HEAD statuses, review thread resolution and tested rollback',
      'Re-certify current main/Cloudflare Pages UUID/SHA and Worker identity after each separately authorized release',
    ],
  });
}
