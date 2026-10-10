#!/usr/bin/env python3
"""Provisional fail-closed migration policy. Not a waiver of existing Practical gates."""
from __future__ import annotations
import argparse
import subprocess
import sys
import unittest

BASE = "81950a9f4602f1d9be34f2d53d4585831926bffa"
CANDIDATE = "25ef8edbf08e32dca9964456a602cd3c49865dbf"
EXPECTED = {
    "museum": ("43aa1d96c71e524f0af4eca954766e51e9c423f5", "431bef9bed725350b9f40608551cc2d74bf38820"),
    "whole-mounts": ("fc9b9f07164676798b4f98fe7802053dddd0f929", "2531802368b29395c99aab789796baa3ef079f1d"),
    "field-report": ("cef2b7aca4f5a388421d89e39213947016341e43", "e0e0f8c977536413c45e7223f8f84a88e455a809"),
    "temporary-mounts": ("4e588a411174b23225a8bb5d796e77f48af573ac", "56176cb05a1c726e0edae624d7f4e5d6e57008a2"),
    "permanent-slides": ("7efc49f9a063385e18dda50221f30bfb865f2cdb", "a9f60816663ca059c2b01af2bf8c3a9d5c4fb274"),
    "appendages": ("e0b25189300804447108bcc201e97653330e0e87", "0a0a481e7d3020fa37c4f586cb55c73db10d9eb4"),
    "dissection": ("7318e8c3215838093b68978760746e9c4240fb72", "ecef2631129666f9a6d64dc085027cb397b5c96d"),
}
PATHS = {f".github/scripts/validate-conv04f-zoology-practical-{key}.rb": pair for key, pair in EXPECTED.items()}

def policy(base, candidate, changed, originals, proposed, ancestor, authorized=False):
    # In no circumstances may candidate-supplied data grant its own authorization.
    if not authorized:
        return False, "independent authorization absent"
    if base != BASE or candidate != CANDIDATE or not ancestor:
        return False, "exact commit binding / ancestry mismatch"
    if len(changed) != len(PATHS) or set(changed) != set(PATHS):
        return False, "changed-file allowlist mismatch"
    for path, (before, after) in PATHS.items():
        if originals.get(path) != before or proposed.get(path) != after:
            return False, f"protected blob mismatch: {path}"
    return True, "exact proposal matches independently authorized identities"

def git(*args):
    p = subprocess.run(["git", *args], capture_output=True, text=True)
    if p.returncode:
        raise RuntimeError(p.stderr.strip() or f"git {' '.join(args)} failed")
    return p.stdout.strip()

def verify():
    # This repository-contained tool deliberately has no approval token or approval flag:
    # until an external trusted gate supplies authorization, it must always reject.
    changed = git("diff", "--name-only", BASE, CANDIDATE).splitlines()
    originals = {p: git("rev-parse", f"{BASE}:{p}") for p in PATHS}
    proposed = {p: git("rev-parse", f"{CANDIDATE}:{p}") for p in PATHS}
    ancestor = git("merge-base", BASE, CANDIDATE) == BASE
    # Identity evidence is useful even though authorization is not granted:
    match, reason = policy(BASE, CANDIDATE, changed, originals, proposed, ancestor, authorized=True)
    print(("IDENTITY PASS: " if match else "IDENTITY FAIL: ") + reason)
    approval, reason = policy(BASE, CANDIDATE, changed, originals, proposed, ancestor, authorized=False)
    print(("AUTH PASS: " if approval else "AUTH HOLD: ") + reason)
    return 0 if match and not approval else 1

class Regression(unittest.TestCase):
    def setUp(self):
        self.args = [BASE, CANDIDATE, list(PATHS), {p: a for p,(a,b) in PATHS.items()},
                     {p: b for p,(a,b) in PATHS.items()}, True]
    def check(self, expected, *args, **kw):
        actual, reason = policy(*args, **kw)
        self.assertEqual(actual, expected, reason)
    def test_P01_exact_candidate_with_independent_authorization(self):
        self.check(True, *self.args, authorized=True)
    def test_N01_absent_independent_approval(self):
        self.check(False, *self.args)
    def test_N02_extra_file(self):
        a = self.args.copy(); a[2] += ["_biology/unauthorized.md"]
        self.check(False, *a, authorized=True)
    def test_N03_changed_candidate_blob(self):
        a = self.args.copy(); a[4] = dict(a[4]); a[4][next(iter(PATHS))] = "0"*40
        self.check(False, *a, authorized=True)
    def test_N04_changed_original_blob(self):
        a = self.args.copy(); a[3] = dict(a[3]); a[3][next(iter(PATHS))] = "0"*40
        self.check(False, *a, authorized=True)
    def test_N05_invalid_base(self):
        a = self.args.copy(); a[0] = "0"*40
        self.check(False, *a, authorized=True)
    def test_N06_nonancestor(self):
        a = self.args.copy(); a[5] = False
        self.check(False, *a, authorized=True)
    def test_N07_other_candidate(self):
        a = self.args.copy(); a[1] = "0"*40
        self.check(False, *a, authorized=True)
    def test_N08_missing_file(self):
        a = self.args.copy(); a[2] = a[2][1:]
        self.check(False, *a, authorized=True)
    def test_N09_duplicate_changed_path(self):
        a = self.args.copy(); a[2] += [a[2][0]]
        self.check(False, *a, authorized=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--verify", action="store_true")
    options = parser.parse_args()
    if options.self_test:
        sys.argv = [sys.argv[0]]
        unittest.main()
    elif options.verify:
        try:
            raise SystemExit(verify())
        except RuntimeError as exc:
            print(f"FAIL: {exc}", file=sys.stderr)
            raise SystemExit(1)
    else:
        parser.error("choose --self-test or --verify")
