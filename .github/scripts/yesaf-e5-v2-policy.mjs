/** YESAF E5 V2: prospective policy contract. No privilege, no status writes.
 * Historical failures never become PASS. This function only evaluates
 * authenticated source data supplied by an independently trusted caller.
 */
import {PIN, evaluateSourceContinuity} from './yesaf-e5-v2-source-continuity.mjs';
export const V2_POLICY_VERSION = 'YESAF_E5_V2_2026_10_29';
export const CONTEXT_APPS = Object.freeze({
  'validate': 15368,
  'Cloudflare Pages': 85455,
  'LBFL Trusted Release Governance': 15368,
  'LBFL Worker Static Preflight': 15368,
  'YESAF M1 Trusted Static Authority': 15368,
});
export const HISTORICALLY_FROZEN = Object.freeze({
  R91: '.github/workflows/conv04f-zoology-practical-zooplankton-successor-guard.yml',
  R101: '.github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml',
});
export const V2_POLICY_PATH = 'docs/yesaf/E5_VERSIONED_PROSPECTIVE_POLICY_V2.json';
const sha = v => typeof v==='string' && /^[a-f0-9]{40}$/.test(v);
const requireTrue = (v, msg) => {if(!v) throw Error('V2_POLICY_HOLD: '+msg);};

function latestChecksFromGitHub(checks, head) {
  requireTrue(Array.isArray(checks?.check_runs) && checks.total_count === checks.check_runs.length,
    'incomplete check-run response');
  const byName = new Map();
  for (const c of checks.check_runs) {
    if (!Object.hasOwn(CONTEXT_APPS,c.name)) continue;
    requireTrue(c.head_sha === head, 'check-run SHA drift');
    requireTrue(c.app?.id === CONTEXT_APPS[c.name], 'check-run issuer mismatch: '+c.name);
    const t = Date.parse(c.started_at);
    requireTrue(Number.isFinite(t), 'unorderable check-run '+c.name);
    if (byName.has(c.name)) requireTrue(byName.get(c.name).at !== t, 'ambiguous check ordering');
    if (!byName.has(c.name) || byName.get(c.name).at < t) byName.set(c.name,{check:c,at:t});
  }
  return byName;
}
export function evaluateV2ProspectiveAcceptance({sourcePacket, originalManifest, policy, policyBlob,
  trustedMain, ownerApproval, currentChecks, currentCommitStatuses, oldGuardFindings}) {
  const source = evaluateSourceContinuity(sourcePacket,originalManifest);
  requireTrue(trustedMain?.sha===source.currentMain && trustedMain?.protected===true,
    'protected-main identity mismatch');
  requireTrue(policy?.version===V2_POLICY_VERSION && policy?.scope==='SOURCE_ONLY' &&
    policy?.production_write_allowed===false && policy?.production_release_authorized===false,
    'invalid V2 scope');
  requireTrue(sha(policyBlob) && policyBlob===trustedMain?.policy_blob,
    'V2 source not independently loaded from trusted main');
  requireTrue(policy.historical_base===PIN.historicalBase && policy.historical_head===PIN.historicalHead &&
    policy.historical_run===PIN.historicalRun, 'historical V1 proof altered');
  requireTrue(Array.isArray(policy.retirement_paths) && JSON.stringify([...policy.retirement_paths].sort())===JSON.stringify(Object.keys(PIN.retirement).sort()),
    'retirement scope differs from exactly eight');
  requireTrue(policy.superseded_future_obligations?.length===2 &&
    policy.superseded_future_obligations.includes('R91 publisher-YAML immutability') &&
    policy.superseded_future_obligations.includes('R101 publisher-YAML immutability'),
    'prospective V1 supersession not exact');
  requireTrue(ownerApproval?.issuer==='yusuf38bcs-oss' && ownerApproval?.scope==='E5_V2_SOURCE_ONLY' &&
    ownerApproval?.approved===true && ownerApproval?.repository===PIN.repository &&
    ownerApproval?.pr===520 && ownerApproval?.head===source.currentCandidate &&
    ownerApproval?.base===source.currentMain && ownerApproval?.policy_blob===policyBlob &&
    ownerApproval?.production_write_allowed===false && ownerApproval?.production_release_authorized===false &&
    ownerApproval?.authenticated===true && ownerApproval?.replay_checked===true,
    'missing independent, current, exact-head owner authorization');
  // A supplied ownerApproval object is NOT authentication. Trusted caller MUST
  // independently authenticate identity/signature, expiry and replay before calling.
  requireTrue(currentCommitStatuses?.sha===source.currentCandidate &&
    Array.isArray(currentCommitStatuses.statuses),'untrusted status snapshot');
  const checks = latestChecksFromGitHub(currentChecks,source.currentCandidate);
  for (const [name,app] of Object.entries(CONTEXT_APPS)) {
    const c=checks.get(name)?.check;
    const statuses=currentCommitStatuses.statuses.filter(s=>s.context===name);
    requireTrue((!!c)!==(statuses.length>0),'duplicate/missing required status '+name);
    if(c) requireTrue(c.status==='completed' && c.conclusion==='success' && c.app?.id===app,
      'required check not successful '+name);
    else requireTrue(statuses.length===1 && statuses[0].state==='success' &&
      (!statuses[0].sha || statuses[0].sha===source.currentCandidate),
      'required status not successful '+name);
  }
  requireTrue(oldGuardFindings?.R91==='failure' && oldGuardFindings?.R101==='failure' &&
    oldGuardFindings?.historical_results_preserved===true &&
    oldGuardFindings?.prospective_supersession_only===true,
    'original guard history must remain truthful');
  return Object.freeze({
    result:'V2_SOURCE_MIGRATION_CONTRACT_ELIGIBLE_ONLY',
    currentHead:source.currentCandidate,currentBase:source.currentMain,policyBlob,
    originalScientificRun:PIN.historicalRun,
    originalGuardFailuresPreserved:true,
    certificateIssued:false,policyActivatedInThisEvaluation:false,
    productionWriteAllowed:false,productionReleaseAuthorized:false,
  });
}
