# YESAF M1.A — Non-production trusted status probe

This file is a deliberately inert document for an isolated, unmerged pull request. It exercises the newly merged `pull_request_target` trusted static authority evaluator without changing application code, production Worker behavior, Cloudflare configuration, GitHub rulesets, or eight legacy Pages publisher workflows.

Probe contract:

- Draft PR must be rejected by `YESAF M1 Trusted Static Authority` on the **exact candidate HEAD**.
- A separately owner-authorized Ready PR must receive success on the **same exact candidate HEAD**, if the protected-main policy, control-plane files, and Worker static authority checks are all sound.
- New commits must invalidate prior owner-specific exact-head markers, and stale or modified authority-policy source must fail closed.
- Test PR remains **unmerged** and no production cutover permission is granted.

This document is evidence only and not a release authorization.
