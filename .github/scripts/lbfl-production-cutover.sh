#!/usr/bin/env bash
set -Eeuo pipefail

: "${CLOUDFLARE_ACCOUNT_ID:?missing CLOUDFLARE_ACCOUNT_ID}"
: "${CLOUDFLARE_API_TOKEN:?missing CLOUDFLARE_API_TOKEN}"
: "${HOSTNAME:=api.learningbiologyforlife.org}"
: "${OLD_SERVICE:=synapticai-proxy}"
: "${NEW_SERVICE:=lbfl-socratic-ai}"
: "${NEW_WORKER_URL:=https://lbfl-socratic-ai.yusuf-38bcs.workers.dev}"

EVIDENCE_DIR="${EVIDENCE_DIR:-cutover-evidence}"
mkdir -p "$EVIDENCE_DIR"
api="https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/domains"

domains() {
  curl --fail --silent --show-error \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    "$api"
}

owner() {
  domains > "$RUNNER_TEMP/lbfl-domains.json"
  node - "$RUNNER_TEMP/lbfl-domains.json" "$HOSTNAME" <<'NODE'
const fs = require('node:fs');
const [path, hostname] = process.argv.slice(2);
const payload = JSON.parse(fs.readFileSync(path, 'utf8'));
if (payload.success !== true) throw new Error('Cloudflare domain listing failed');
const domain = (payload.result || []).find((item) => item.hostname === hostname);
process.stdout.write(domain?.service || '');
NODE
}

# Capture current owner + zone metadata before any mutation.
domains > "$EVIDENCE_DIR/domains-before.json"
node - "$EVIDENCE_DIR/domains-before.json" "$HOSTNAME" "$OLD_SERVICE" "$GITHUB_OUTPUT" <<'NODE'
const fs = require('node:fs');
const [path, hostname, expectedOwner, output] = process.argv.slice(2);
const payload = JSON.parse(fs.readFileSync(path, 'utf8'));
if (payload.success !== true) throw new Error('Cloudflare domain listing failed');
const domain = (payload.result || []).find((item) => item.hostname === hostname);
if (!domain) throw new Error(`Custom domain ${hostname} not found`);
if (domain.service !== expectedOwner) throw new Error(`Expected owner ${expectedOwner}; found ${domain.service}`);
if (!domain.zone_id || !domain.zone_name) throw new Error('Zone metadata missing');
fs.appendFileSync(output, `zone_id=${domain.zone_id}\nzone_name=${domain.zone_name}\nold_owner=${domain.service}\n`);
console.log(JSON.stringify(domain, null, 2));
NODE

ZONE_ID="$(node - "$EVIDENCE_DIR/domains-before.json" "$HOSTNAME" <<'NODE'
const fs=require('node:fs'); const [p,h]=process.argv.slice(2); const j=JSON.parse(fs.readFileSync(p,'utf8')); process.stdout.write((j.result||[]).find(x=>x.hostname===h)?.zone_id||'');
NODE
)"
ZONE_NAME="$(node - "$EVIDENCE_DIR/domains-before.json" "$HOSTNAME" <<'NODE'
const fs=require('node:fs'); const [p,h]=process.argv.slice(2); const j=JSON.parse(fs.readFileSync(p,'utf8')); process.stdout.write((j.result||[]).find(x=>x.hostname===h)?.zone_name||'');
NODE
)"

# Capture old endpoint evidence and confirm the candidate independently.
curl --fail --silent --show-error -D "$EVIDENCE_DIR/old-health.headers" \
  "https://$HOSTNAME/api/health" > "$EVIDENCE_DIR/old-health.json"
curl --fail --silent --show-error -D "$EVIDENCE_DIR/candidate-health.headers" \
  "$NEW_WORKER_URL/api/health" > "$EVIDENCE_DIR/candidate-health.json"

CANDIDATE_VERSION="$(node - "$EVIDENCE_DIR/candidate-health.json" "$EVIDENCE_DIR/candidate-health.headers" <<'NODE'
const fs=require('node:fs');
const [bodyPath, headersPath]=process.argv.slice(2);
const health=JSON.parse(fs.readFileSync(bodyPath,'utf8'));
const headers=fs.readFileSync(headersPath,'utf8');
const version=headers.match(/^x-lbfl-worker-version:\s*([^\r\n]+)/im)?.[1]?.trim()||'';
if (health.ok !== true) throw new Error('Candidate health not OK');
if (health.gemini_key_configured !== true) throw new Error('Candidate Gemini key not configured');
if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(version)) throw new Error('Candidate version invalid');
if (health.worker_version_id !== version) throw new Error('Candidate body/header version mismatch');
process.stdout.write(version);
NODE
)"
echo "candidate_version=$CANDIDATE_VERSION" >> "$GITHUB_OUTPUT"

attach() {
  local service="$1"
  node - "$HOSTNAME" "$service" "$ZONE_ID" "$ZONE_NAME" > "$RUNNER_TEMP/lbfl-domain-body.json" <<'NODE'
const [hostname, service, zone_id, zone_name] = process.argv.slice(2);
process.stdout.write(JSON.stringify({hostname, service, zone_id, zone_name}));
NODE
  curl --fail --silent --show-error \
    -X PUT \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    --data-binary "@$RUNNER_TEMP/lbfl-domain-body.json" \
    "$api"
}

changed=0
rollback() {
  rc=$?
  if [[ "$changed" == "1" ]]; then
    echo "Cutover verification failed; restoring $OLD_SERVICE" >&2
    attach "$OLD_SERVICE" > "$EVIDENCE_DIR/rollback.json" || true
    restored=0
    for _ in $(seq 1 30); do
      if [[ "$(owner || true)" == "$OLD_SERVICE" ]]; then
        restored=1
        break
      fi
      sleep 2
    done
    if [[ "$restored" != "1" ]]; then
      echo "CRITICAL: rollback ownership could not be verified" >&2
    fi
  fi
  exit "$rc"
}
trap rollback ERR

# Transfer only the one custom domain.
attach "$NEW_SERVICE" > "$EVIDENCE_DIR/domain-attach.json"
changed=1
for _ in $(seq 1 30); do
  [[ "$(owner)" == "$NEW_SERVICE" ]] && break
  sleep 2
done
test "$(owner)" = "$NEW_SERVICE"
domains > "$EVIDENCE_DIR/domains-after.json"

# Health and exact Worker version at production hostname.
healthy=0
for _ in $(seq 1 20); do
  if curl --fail --silent --show-error -D "$EVIDENCE_DIR/prod-health.headers" \
       "https://$HOSTNAME/api/health" > "$EVIDENCE_DIR/prod-health.json"; then
    if node - "$EVIDENCE_DIR/prod-health.json" "$EVIDENCE_DIR/prod-health.headers" "$CANDIDATE_VERSION" <<'NODE'
const fs=require('node:fs');
const [bodyPath,headersPath,expected]=process.argv.slice(2);
const health=JSON.parse(fs.readFileSync(bodyPath,'utf8'));
const headers=fs.readFileSync(headersPath,'utf8');
const version=headers.match(/^x-lbfl-worker-version:\s*([^\r\n]+)/im)?.[1]?.trim()||'';
process.exit(health.ok===true && health.gemini_key_configured===true && health.worker_version_id===expected && version===expected ? 0 : 1);
NODE
    then
      healthy=1
      break
    fi
  fi
  sleep 2
done
test "$healthy" = "1"

# Browser-origin CORS contract.
curl --fail --silent --show-error -D "$EVIDENCE_DIR/cors.headers" -o /dev/null \
  -H 'Origin: https://learningbiologyforlife.org' \
  "https://$HOSTNAME/api/health"
grep -Eiq '^access-control-allow-origin:\s*https://learningbiologyforlife\.org\s*$' "$EVIDENCE_DIR/cors.headers"

# Genuine Gemini-backed Socratic contract on production hostname.
curl --fail --silent --show-error -D "$EVIDENCE_DIR/socratic.headers" \
  -H 'Origin: https://learningbiologyforlife.org' \
  -H 'Content-Type: application/json' \
  --data '{"type":"socratic_reflex","anomaly_question":"Why does heart rate rise when arterial blood pressure suddenly falls?","student_hypothesis":"The baroreceptor reflex reduces vagal output and increases sympathetic drive to restore cardiac output and pressure.","page_context":"/biology/","attempt_count":1}' \
  "https://$HOSTNAME/api/socratic" > "$EVIDENCE_DIR/socratic.json"

node - "$EVIDENCE_DIR/socratic.json" "$EVIDENCE_DIR/socratic.headers" "$CANDIDATE_VERSION" <<'NODE'
const fs=require('node:fs');
const [bodyPath,headersPath,expected]=process.argv.slice(2);
const result=JSON.parse(fs.readFileSync(bodyPath,'utf8'));
const headers=fs.readFileSync(headersPath,'utf8');
for (const key of ['mastery_achieved','feedback_text','next_vector','strike_count']) {
  if (!(key in result)) throw new Error(`Missing ${key}`);
}
const fallback='Your answer could not be evaluated safely. Refine your explanation by naming the biological structure, causal mechanism, and expected outcome.';
if (result.feedback_text === fallback) throw new Error('Deterministic fallback detected');
const version=headers.match(/^x-lbfl-worker-version:\s*([^\r\n]+)/im)?.[1]?.trim()||'';
if (version !== expected) throw new Error(`Socratic version ${version} does not match ${expected}`);
console.log(JSON.stringify(result,null,2));
NODE

trap - ERR
echo 'cutover_status=pass' >> "$GITHUB_OUTPUT"
echo "Controlled cutover passed; $HOSTNAME remains on $NEW_SERVICE@$CANDIDATE_VERSION"
