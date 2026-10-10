# LBFL PR-scoped Attestor Shadow Pilot — test fixture

This file is deliberately non-production. It exists **only on disposable pilot
head branches** to provide one shared Git commit SHA for two independent PRs.

Pilot acceptance claims MUST be established by GitHub's server-side mergeability:
1. an App-only approval on PR A does NOT approve PR B sharing the same SHA;
2. dismissing PR A's approval immediately blocks PR A without a new CI event;
3. advancing the head invalidates its previous approval;
4. advancing the base enforces strict up-to-date checks;
5. there is no policy-bypass actor or direct protected-branch write.

Do not merge either test PR into any branch. Do not treat this fixture as evidence
of a passing test by itself. Never change main/staging rulesets during this pilot.
