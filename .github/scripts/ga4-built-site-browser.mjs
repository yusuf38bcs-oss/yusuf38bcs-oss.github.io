// Candidate browser evidence only: serve an exact-head Jekyll build on loopback.
// Google libraries execute normally; collection requests are recorded and aborted.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:4173';
const measurement = 'G-2SCLLF93NS';
const output = 'ga4-browser-evidence';
const report = { expectedSha: process.env.PR_HEAD_SHA, scope: 'LOCAL_JEKYLL_CANDIDATE_ONLY', passed: false, phases: [] };
assert.match(report.expectedSha || '', /^[a-f0-9]{40}$/);
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext();
const requests = [];
const errors = [];
let phase = 'fresh';
const isGoogle = host => host === 'googletagmanager.com' || host.endsWith('.googletagmanager.com') || host === 'google-analytics.com' || host.endsWith('.google-analytics.com');
const isAd = host => ['doubleclick.net', 'googlesyndication.com', 'googleadservices.com'].some(domain => host === domain || host.endsWith('.' + domain));
await context.route('**/*', async route => {
  const request = route.request();
  const url = new URL(request.url());
  if (isGoogle(url.hostname) || isAd(url.hostname)) {
    requests.push({ phase, host: url.hostname, path: url.pathname, query: url.search, body: request.postData() || '' });
    if (isAd(url.hostname) || url.pathname.endsWith('/collect')) return route.abort();
  }
  return route.continue();
});
const page = await context.newPage();
page.on('pageerror', error => errors.push(String(error)));
const state = () => page.evaluate(() => ({
  consent: localStorage.getItem('cookie-consent'),
  disabled: window['ga-disable-G-2SCLLF93NS'],
  calls: (window.dataLayer || []).map(item => item && typeof item === 'object' && '0' in item ? Array.from(item) : item),
  scripts: Array.from(document.scripts, script => script.src).filter(Boolean),
}));
const snapshot = async () => { const result = await state(); report.phases.push({ phase, ...result }); return result; };
const navigate = async (pathname = '/') => {
  const target = origin + pathname + '?test_private_query=must_not_collect#test_private_fragment';
  const response = page.url() === target ? await page.reload() : await page.goto(target);
  assert.equal(response.status(), 200);
  await page.waitForTimeout(1000);
};
const hits = () => requests.filter(r => r.phase === phase && r.path.endsWith('/collect'));
const verifyPageview = async () => {
  await page.waitForFunction(() => window.google_tag_manager, { timeout: 15000 });
  for (let attempt = 0; attempt < 30 && hits().length === 0; attempt++) await page.waitForTimeout(500);
  const current = await snapshot();
  const calls = current.calls.filter(Array.isArray);
  assert.equal(calls.filter(c => c[0] === 'config' && c[1] === measurement).length, 1);
  assert.equal(calls.filter(c => c[0] === 'event' && c[1] === 'page_view').length, 1);
  assert.equal(current.scripts.filter(src => src.startsWith('https://www.googletagmanager.com/gtag/js?')).length, 1);
  assert.equal(current.scripts.filter(src => src.includes('/gtm.js')).length, 0);
  const pageviews = hits().flatMap(hit => (hit.body ? hit.body.split('\n') : ['']).map(body => new URLSearchParams(hit.query + '&' + body))).filter(params => params.get('en') === 'page_view');
  assert.equal(pageviews.length, 1, 'Real Google library must attempt exactly one page_view');
  assert.equal(pageviews[0].get('tid'), measurement);
  assert.ok(!pageviews[0].get('dl')?.includes('test_private'));
  assert.ok(!pageviews[0].get('dr'));
};
try {
  await navigate();
  await page.locator('#gdpr-banner[data-cookie-banner]').waitFor({ state: 'visible' });
  await snapshot();
  assert.equal(requests.length, 0, 'No Google analytics or advertising request before consent');
  phase = 'decline';
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  assert.equal((await snapshot()).consent, 'denied');
  phase = 'declined-reload';
  await navigate();
  assert.equal(requests.length, 0, 'Stored denial must not load analytics');
  await snapshot();
  await context.clearCookies();
  await page.evaluate(() => localStorage.clear());
  phase = 'accept';
  await navigate();
  await page.getByRole('button', { name: 'Accept', exact: true }).click();
  await verifyPageview();
  phase = 'granted-reload';
  await navigate();
  await verifyPageview();
  phase = 'withdraw';
  await navigate('/cookie-preferences/');
  await page.locator('[data-gdpr-consent="denied"]').click();
  assert.equal((await snapshot()).disabled, true);
  // Ignore already-started hits on entering the preferences document.
  requests.splice(0, requests.length, ...requests.filter(request => request.phase !== phase));
  await page.evaluate(() => window.gtag('event', 'lbfl_withdrawal_probe', { send_to: 'G-2SCLLF93NS' }));
  await page.waitForTimeout(2000);
  assert.equal(hits().length, 0, 'Withdrawal must suppress subsequent hits');
  phase = 'withdrawn-reload';
  await navigate();
  const withdrawn = await snapshot();
  assert.equal(withdrawn.consent, 'denied');
  assert.equal(requests.filter(r => r.phase === phase).length, 0);
  assert.equal(requests.filter(r => isAd(r.host)).length, 0, 'No advertising requests in any phase');
  assert.deepEqual(errors, []);
  report.passed = true;
} catch (error) {
  report.error = String(error);
  await page.screenshot({ path: output + '/failure.png', fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  report.requests = requests;
  report.pageErrors = errors;
  await fs.writeFile(output + '/report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ scope: report.scope, passed: report.passed, error: report.error }));
  await browser.close();
}
