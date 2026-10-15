#!/usr/bin/env python3
"""CONV-04F one-time migration: identity preflight and trusted authorization.

--preflight and --self-test are NON-AUTHORIZING, including on PR branches.
--authorize must execute from the trusted PR target base, never candidate code.
"""
from __future__ import annotations
import argparse
import json
import os
import re
import subprocess
import sys
import unittest
import urllib.request

ORIGIN_BASE = "e9e5c68b1c63286099368cfe9954a3d76b28d8ea"
ORIGIN_CANDIDATE = "7fcab53b9cf41c3bb10565e92691e8b36986d837"
REPOSITORY = "yusuf38bcs-oss/yusuf38bcs-oss.github.io"
AUTHORIZED_PR = 468
AUTHORIZED_BRANCH = "repair/conv04f-retained-validator-j-compat-20261010"
SOLO_LINE = "SOLO-MAINTAINER-EXCEPTION: LBFL-PERMANENT-SOLO-MAINTAINER"
SOLO_APPROVAL = "SOLO-MAINTAINER-APPROVAL: "
EXPECTED = {
    "museum": ("43aa1d96c71e524f0af4eca954766e51e9c423f5", "57fa42431ced38f17dd48dbb76be2acf0f324487"),
    "whole-mounts": ("fc9b9f07164676798b4f98fe7802053dddd0f929", "51ea08d567ae46cfa8732c6538457f970bc2f832"),
    "field-report": ("cef2b7aca4f5a388421d89e39213947016341e43", "ab1c600a75611c41a349a4e9fbc15084e09eca21"),
    "temporary-mounts": ("4e588a411174b23225a8bb5d796e77f48af573ac", "6f9ff0be5ad7c9a244b5c1e468bc89306cbae335"),
    "permanent-slides": ("7efc49f9a063385e18dda50221f30bfb865f2cdb", "cac8c14cbc6e3ef22ac871a8e63a450016fbda81"),
    "appendages": ("e0b25189300804447108bcc201e97653330e0e87", "669f6acd66e87922e5cd3a6007aa3ff50c20e4ee"),
    "dissection": ("7318e8c3215838093b68978760746e9c4240fb72", "f3ba18ec34ccf13f13203ed7eac8c14d0dcb7e3c"),
}
PATHS = {".github/scripts/validate-conv04f-zoology-practical-" + name + ".rb": pair
         for name, pair in EXPECTED.items()}
HEX40 = re.compile(r"^[0-9a-f]{40}$")

def git(*args):
    p = subprocess.run(["git", *args], capture_output=True, text=True)
    if p.returncode:
        raise RuntimeError(p.stderr.strip() or "git command failed")
    return p.stdout.strip()

def is_ancestor(before, after):
    return subprocess.run(["git", "merge-base", "--is-ancestor", before, after],
                          capture_output=True).returncode == 0

def changed_files(base, head):
    return git("diff", "--name-only", base + "..."+ head).splitlines()

def blobs(revision):
    return {p: git("rev-parse", revision + ":" + p) for p in PATHS}

def tree_modes(revision):
    """Compare tree mode/type; blob hashes alone do not identify symlinks."""
    result = {}
    for path in PATHS:
        row = git("ls-tree", revision, "--", path).split("\t", 1)[0].split()
        result[path] = tuple(row[:2]) if len(row) == 3 else ("", "")
    return result

def regular_files(modes):
    return len(modes) == len(PATHS) and all(
        modes.get(path) == ("100644", "blob") for path in PATHS)

def original_identity(base, candidate, changed, before_blobs, after_blobs, lineage, before_modes, after_modes):
    if base != ORIGIN_BASE or candidate != ORIGIN_CANDIDATE or not lineage:
        return False, "origin identity or ancestry mismatch"
    if len(changed) != len(PATHS) or set(changed) != set(PATHS):
        return False, "origin changed-file allowlist mismatch"
    for path, (before, after) in PATHS.items():
        if before_blobs.get(path) != before or after_blobs.get(path) != after:
            return False, "origin blob mismatch: " + path
    if not regular_files(before_modes) or not regular_files(after_modes):
        return False, "origin tree mode/type drift"
    return True, "original seven-file identity matches"

def live_authority(*, trusted, event_head, live_head, event_base,
                   live_base, checkout_sha, branch, owner, repository,
                   draft, open_state, changed, current_blobs,
                   current_base_blobs, base_ancestor, candidate_ancestor,
                   approval_lines, current_modes, current_base_modes):
    # Fail closed on any stale event, source, branch, mutation or authority.
    if not trusted:
        return False, "trusted policy source not authenticated"
    if not all(HEX40.fullmatch(x or "") for x in
               [event_head, live_head, event_base, live_base, checkout_sha]):
        return False, "malformed revision"
    if event_head != live_head:
        return False, "stale triggering PR head"
    if event_base != live_base or checkout_sha != live_base:
        return False, "stale or untrusted comparison base"
    if branch != AUTHORIZED_BRANCH or owner != "yusuf38bcs-oss" or repository != REPOSITORY:
        return False, "unauthorized PR identity"
    if draft or not open_state:
        return False, "draft or closed PR is not authorized"
    if not base_ancestor or not candidate_ancestor:
        return False, "current main/original candidate ancestry mismatch"
    if len(changed) != len(PATHS) or set(changed) != set(PATHS):
        return False, "current-base changed-file scope mismatch"
    for path, (before, after) in PATHS.items():
        if current_base_blobs.get(path) != before or current_blobs.get(path) != after:
            return False, "current-base/candidate protected blob mismatch: " + path
    if not regular_files(current_modes) or not regular_files(current_base_modes):
        return False, "protected tree mode/type mismatch (symlink or gitlink)"
    if approval_lines.count(SOLO_LINE) != 1 or approval_lines.count(SOLO_APPROVAL + live_head) != 1:
        return False, "no owner-authorized exact-head SOLO migration decision"
    if sum(x.startswith("SOLO-MAINTAINER-EXCEPTION:") for x in approval_lines) != 1:
        return False, "ambiguous SOLO exception"
    if sum(x.startswith(SOLO_APPROVAL) for x in approval_lines) != 1:
        return False, "ambiguous SOLO approval"
    return True, "TRUSTED AUTHORIZATION PASS for live exact head and seven blobs"

def preflight():
    matched, detail = original_identity(ORIGIN_BASE, ORIGIN_CANDIDATE,
        changed_files(ORIGIN_BASE, ORIGIN_CANDIDATE), blobs(ORIGIN_BASE),
        blobs(ORIGIN_CANDIDATE), is_ancestor(ORIGIN_BASE, ORIGIN_CANDIDATE),
        tree_modes(ORIGIN_BASE), tree_modes(ORIGIN_CANDIDATE))
    print(("IDENTITY PREFLIGHT PASS: " if matched else "IDENTITY PREFLIGHT FAIL: ") + detail)
    print("NOT AN AUTHORIZATION: only the trusted pull_request_target gate may authorize PR #468")
    return 0 if matched else 1

def api(path, token):
    req = urllib.request.Request(
        "https://api.github.com/repos/" + REPOSITORY + path,
        headers={"Authorization": "Bearer " + token,
                 "Accept": "application/vnd.github+json",
                 "X-GitHub-Api-Version": "2022-11-28"})
    with urllib.request.urlopen(req, timeout=20) as response:
        return json.load(response)

def authorize():
    if os.environ.get("GITHUB_EVENT_NAME") != "pull_request_target":
        raise RuntimeError("authorization requires trusted pull_request_target event")
    if os.environ.get("GITHUB_REPOSITORY") != REPOSITORY:
        raise RuntimeError("repository mismatch")
    token = os.environ.get("GH_TOKEN")
    if not token:
        raise RuntimeError("trusted read-only GitHub token missing")
    with open(os.environ["GITHUB_EVENT_PATH"], encoding="utf-8") as handle:
        event = json.load(handle)
    if event.get("number") != AUTHORIZED_PR:
        raise RuntimeError("event PR number mismatch")
    event_pr = event["pull_request"]
    event_head = event_pr["head"]["sha"]
    event_base = event_pr["base"]["sha"]
    live = api("/pulls/" + str(AUTHORIZED_PR), token)
    current_branch = api("/branches/main", token)
    live_head = live["head"]["sha"]
    live_base = current_branch["commit"]["sha"]
    if live["base"]["ref"] != "main" or live["base"]["sha"] != live_base:
        raise RuntimeError("current main does not match live PR base")
    if event_pr["head"]["ref"] != live["head"]["ref"]:
        raise RuntimeError("head ref switched after event")
    checkout_sha = git("rev-parse", "HEAD")
    # Data only: no candidate file, workflow or script is executed.
    git("fetch", "--no-tags", "origin", live_head)
    if git("rev-parse", "FETCH_HEAD") != live_head:
        raise RuntimeError("fetched PR head mismatch")
    approved, detail = live_authority(
        trusted=(checkout_sha == os.environ.get("GITHUB_SHA") == event_base),
        event_head=event_head, live_head=live_head,
        event_base=event_base, live_base=live_base, checkout_sha=checkout_sha,
        branch=live["head"]["ref"], owner=live["user"]["login"],
        repository=live["head"]["repo"]["full_name"],
        draft=live["draft"], open_state=live["state"] == "open",
        changed=changed_files(live_base, live_head),
        current_blobs=blobs(live_head), current_base_blobs=blobs(live_base),
        base_ancestor=is_ancestor(live_base, live_head),
        candidate_ancestor=is_ancestor(ORIGIN_CANDIDATE, live_head),
        approval_lines=[x.strip() for x in (live.get("body") or "").splitlines()],
        current_modes=tree_modes(live_head), current_base_modes=tree_modes(live_base))
    print(("AUTH PASS: " if approved else "AUTH FAIL: ") + detail)
    return 0 if approved else 1

class Regression(unittest.TestCase):
    def setUp(self):
        self.good = dict(trusted=True, event_head="a"*40, live_head="a"*40,
            event_base="b"*40, live_base="b"*40, checkout_sha="b"*40,
            branch=AUTHORIZED_BRANCH, owner="yusuf38bcs-oss",
            repository=REPOSITORY, draft=False, open_state=True,
            changed=list(PATHS), current_blobs={p:v[1] for p,v in PATHS.items()},
            current_base_blobs={p:v[0] for p,v in PATHS.items()},
            base_ancestor=True, candidate_ancestor=True,
            approval_lines=[SOLO_LINE, SOLO_APPROVAL + "a"*40],
            current_modes={p:("100644","blob") for p in PATHS},
            current_base_modes={p:("100644","blob") for p in PATHS})

    def assert_rejected(self, **changes):
        x = dict(self.good)
        x.update(changes)
        accepted, detail = live_authority(**x)
        self.assertFalse(accepted, detail)

    def test_P01_authorized_exact_live_candidate(self):
        allowed, msg = live_authority(**self.good)
        self.assertTrue(allowed, msg)

    def test_N01_missing_authorization(self): self.assert_rejected(approval_lines=[])
    def test_N02_stale_head(self): self.assert_rejected(event_head="c"*40)
    def test_N03_stale_base(self): self.assert_rejected(event_base="c"*40)
    def test_N04_untrusted_source(self): self.assert_rejected(trusted=False)
    def test_N05_mutated_gate_or_extra_file(self): self.assert_rejected(changed=list(PATHS)+["scripts/ci/conv04f_narrow_migration_gate.py"])
    def test_N06_bad_candidate_blob(self):
        d=dict(self.good["current_blobs"]);d[next(iter(PATHS))]="0"*40
        self.assert_rejected(current_blobs=d)
    def test_N07_bad_base_blob(self):
        d=dict(self.good["current_base_blobs"]);d[next(iter(PATHS))]="0"*40
        self.assert_rejected(current_base_blobs=d)
    def test_N08_missing_validator(self): self.assert_rejected(changed=list(PATHS)[1:])
    def test_N09_duplicate_validator(self): self.assert_rejected(changed=list(PATHS)+[next(iter(PATHS))])
    def test_N10_foreign_branch(self): self.assert_rejected(branch="unauthorized")
    def test_N11_forged_author(self): self.assert_rejected(owner="attacker")
    def test_N12_new_head_without_exact_approval(self): self.assert_rejected(live_head="c"*40)
    def test_N13_changed_ancestry(self): self.assert_rejected(candidate_ancestor=False)
    def test_N14_base_not_ancestor(self): self.assert_rejected(base_ancestor=False)
    def test_N15_draft_pr(self): self.assert_rejected(draft=True)
    def test_N16_duplicate_authority(self): self.assert_rejected(approval_lines=[SOLO_LINE,SOLO_LINE,SOLO_APPROVAL+"a"*40])
    def test_N17_malformed_head(self): self.assert_rejected(live_head="invalid")
    def test_N18_main_changes_before_gate(self): self.assert_rejected(live_base="d"*40)
    def test_N19_candidate_symlink_same_blob_sha(self):
        d=dict(self.good["current_modes"]); d[next(iter(PATHS))]=("120000", "blob")
        self.assert_rejected(current_modes=d)
    def test_N20_candidate_gitlink(self):
        d=dict(self.good["current_modes"]); d[next(iter(PATHS))]=("160000", "commit")
        self.assert_rejected(current_modes=d)
    def test_N21_base_symlink_same_blob_sha(self):
        d=dict(self.good["current_base_modes"]); d[next(iter(PATHS))]=("120000", "blob")
        self.assert_rejected(current_base_modes=d)
    def test_N22_missing_tree_entry(self):
        d=dict(self.good["current_modes"]); d.pop(next(iter(PATHS)))
        self.assert_rejected(current_modes=d)

class WorkflowWiringRegression(unittest.TestCase):
    """Non-authorizing preflight regression; the protected main gate owns authority."""
    def setUp(self):
        from pathlib import Path
        root = Path(__file__).resolve().parents[2]
        self.bridge = (root / ".github/workflows/conv04f-trusted-migration-authorization.yml").read_text(encoding="utf-8")
        self.governance = (root / ".github/workflows/release-governance-gate.yml").read_text(encoding="utf-8")

    def test_N23_no_reusable_sha_status_in_migration_bridge(self):
        self.assertNotIn("statuses: write", self.bridge)
        self.assertNotIn("pull_request_target:", self.bridge)
        self.assertNotIn("createCommitStatus", self.bridge)

    def test_N24_canonical_trusted_gate_owns_migration(self):
        self.assertIn("CONV04F_TRUSTED_MIGRATION_POLICY_V1", self.governance)
        self.assertIn("verifyOneTimePracticalValidatorMigration(pull, headSha, currentBaseSha)", self.governance)
        self.assertIn("Number(pull.number) !== 468", self.governance)
        self.assertIn("pull_request_target:", self.governance)

    def test_N25_protected_blob_type_and_mode_are_checked(self):
        self.assertIn("before.mode !== '100644'", self.governance)
        self.assertIn("after.type !== 'blob'", self.governance)
        self.assertIn("response.data.truncated", self.governance)

    def test_N26_migration_diff_is_exactly_seven_modified_files(self):
        self.assertIn("actualFiles.length !== expectedPaths.length", self.governance)
        self.assertIn("f.status !== 'modified'", self.governance)

    def test_N27_status_writer_must_not_use_candidate_review_event(self):
        self.assertIn("pull_request_target:", self.governance)
        self.assertNotIn("  pull_request_review:\n", self.governance)
        self.assertIn("types: [opened, synchronize, reopened", self.governance)

    def test_N28_unprotected_review_dismissal_cannot_authorize(self):
        self.assertNotIn("independent-review:", self.governance)
        self.assertNotIn("github.rest.pulls.listReviews", self.governance)
        self.assertIn("GOVERNANCE_SOLO_ONLY", self.governance)
        self.assertIn("SOLO-MAINTAINER-APPROVAL:", self.governance)

if __name__ == "__main__":
    ap=argparse.ArgumentParser()
    group=ap.add_mutually_exclusive_group(required=True)
    group.add_argument("--self-test",action="store_true")
    group.add_argument("--preflight",action="store_true")
    group.add_argument("--authorize",action="store_true")
    o=ap.parse_args()
    try:
        if o.self_test:
            sys.argv=[sys.argv[0]]
            unittest.main()
        else:
            raise SystemExit(preflight() if o.preflight else authorize())
    except (RuntimeError, KeyError, OSError, urllib.error.URLError) as exc:
        print("FAIL CLOSED: " + str(exc), file=sys.stderr)
        raise SystemExit(1)
