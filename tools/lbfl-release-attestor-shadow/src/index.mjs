import { sign } from 'node:crypto';

// Non-authorizing, authentication-only shadow Worker. NO review/merge API.
export const EXPECTED = Object.freeze({
  appId: 5266418,
  appSlug: 'lbfl-release-attestor-yusuf38bcs',
  owner: 'yusuf38bcs-oss',
  repo: 'yusuf38bcs-oss.github.io',
  fullName: 'yusuf38bcs-oss/yusuf38bcs-oss.github.io',
  api: 'https://api.github.com',
});

export function signAppJwt(privateKeyPem, nowMs = Date.now()) {
  if (typeof privateKeyPem !== 'string' ||
      !/^-----BEGIN (?:RSA )?PRIVATE KEY-----/.test(privateKeyPem.trim())) {
    throw new Error('Required RSA PEM secret is missing or malformed.');
  }
  const now = Math.floor(nowMs / 1000);
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const unsigned = encode({ alg: 'RS256', typ: 'JWT' }) + '.' +
    encode({ iat: now - 60, exp: now + 8 * 60, iss: String(EXPECTED.appId) });
  const signature = sign('RSA-SHA256', Buffer.from(unsigned), privateKeyPem).toString('base64url');
  return unsigned + '.' + signature;
}

async function apiCall(fetchImpl, path, token, options = {}) {
  const response = await fetchImpl(EXPECTED.api + path, {
    method: options.method || 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer ' + token,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'LBFL-Release-Attestor-Shadow-Auth-Only',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  if (!response.ok) {
    throw new Error('GitHub API failed at ' + path + ' with HTTP ' + response.status + '; fail closed.');
  }
  return response.json();
}

export async function runAuthenticationProbe({ env, fetchImpl = fetch, nowMs = Date.now() }) {
  if (!env?.LBFL_RELEASE_ATTESTOR_PRIVATE_KEY ||
      typeof env.LBFL_RELEASE_ATTESTOR_PRIVATE_KEY.get !== 'function') {
    throw new Error('Cloudflare Secrets Store binding is not configured.');
  }
  const pem = await env.LBFL_RELEASE_ATTESTOR_PRIVATE_KEY.get();
  const jwt = signAppJwt(pem, nowMs);
  const app = await apiCall(fetchImpl, '/app', jwt);
  if (app.id !== EXPECTED.appId || app.slug !== EXPECTED.appSlug ||
      app.owner?.login?.toLowerCase() !== EXPECTED.owner) {
    throw new Error('GitHub App ID, slug or owner mismatch.');
  }
  const installation = await apiCall(
    fetchImpl, '/repos/' + EXPECTED.owner + '/' + EXPECTED.repo + '/installation', jwt,
  );
  if (!Number.isInteger(installation.id) || installation.id <= 0 ||
      installation.app_id !== EXPECTED.appId ||
      installation.account?.login?.toLowerCase() !== EXPECTED.owner ||
      installation.repository_selection !== 'selected') {
    throw new Error('Installation identity or repository selection mismatch.');
  }
  // The installation token is narrowed to read-only even though the App has review permissions.
  const grant = await apiCall(
    fetchImpl, '/app/installations/' + installation.id + '/access_tokens', jwt,
    { method: 'POST', body: { permissions: { contents: 'read', pull_requests: 'read' } } },
  );
  if (typeof grant.token !== 'string' || grant.token.length < 10) {
    throw new Error('Read-only installation token issuance failed.');
  }
  // Check the installation's actual repository list, not merely requested token selection.
  const repositories = await apiCall(fetchImpl, '/installation/repositories?per_page=100', grant.token);
  if (repositories.total_count !== 1 ||
      !Array.isArray(repositories.repositories) || repositories.repositories.length !== 1 ||
      repositories.repositories[0]?.full_name !== EXPECTED.fullName) {
    throw new Error('Installation has the wrong repository scope.');
  }
  return Object.freeze({
    result: 'PASS',
    app_id: EXPECTED.appId,
    installation_id: installation.id,
    repository: EXPECTED.fullName,
    selected_repository_count: 1,
    capability: 'authentication-readonly',
  });
}

export default {
  // No public capability or authentication trigger.
  fetch() { return new Response('Not Found', { status: 404 }); },
  // Deliberately no cron trigger in Wrangler; schedule requires a separate review.
  async scheduled(_event, env) {
    const summary = await runAuthenticationProbe({ env });
    console.log('LBFL_ATTESTOR_SHADOW_AUTH', JSON.stringify(summary));
  },
};
