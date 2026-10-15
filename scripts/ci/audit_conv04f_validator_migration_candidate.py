#!/usr/bin/env python3
"""Fail-closed identity audit for CONV-04F validator migration evidence.

This does NOT authorize protected-file modification or waive any CI check.
Invoke from a full git checkout with history for both commits.
"""
from __future__ import annotations
import subprocess
import sys

BASE = "81950a9f4602f1d9be34f2d53d4585831926bffa"
HEAD = "25ef8edbf08e32dca9964456a602cd3c49865dbf"
BLOBS = {
 "museum": ("43aa1d96c71e524f0af4eca954766e51e9c423f5", "431bef9bed725350b9f40608551cc2d74bf38820"),
 "whole-mounts": ("fc9b9f07164676798b4f98fe7802053dddd0f929", "2531802368b29395c99aab789796baa3ef079f1d"),
 "field-report": ("cef2b7aca4f5a388421d89e39213947016341e43", "e0e0f8c977536413c45e7223f8f84a88e455a809"),
 "temporary-mounts": ("4e588a411174b23225a8bb5d796e77f48af573ac", "56176cb05a1c726e0edae624d7f4e5d6e57008a2"),
 "permanent-slides": ("7efc49f9a063385e18dda50221f30bfb865f2cdb", "a9f60816663ca059c2b01af2bf8c3a9d5c4fb274"),
 "appendages": ("e0b25189300804447108bcc201e97653330e0e87", "0a0a481e7d3020fa37c4f586cb55c73db10d9eb4"),
 "dissection": ("7318e8c3215838093b68978760746e9c4240fb72", "ecef2631129666f9a6d64dc085027cb397b5c96d"),
}

def git(*args: str) -> str:
    p = subprocess.run(["git", *args], text=True, capture_output=True)
    if p.returncode:
        raise RuntimeError(f"git {' '.join(args)}: {p.stderr.strip()}")
    return p.stdout.strip()

def main() -> int:
    errors = []
    try:
        if git("merge-base", BASE, HEAD) != BASE:
            errors.append("comparison base is not an ancestor of candidate")
        actual = set(git("diff", "--name-only", BASE, HEAD).splitlines())
        expected = {f".github/scripts/validate-conv04f-zoology-practical-{n}.rb" for n in BLOBS}
        if actual != expected:
            errors.append(f"changed path set mismatch: unexpected={sorted(actual-expected)}, missing={sorted(expected-actual)}")
        for n, (before, after) in BLOBS.items():
            path = f".github/scripts/validate-conv04f-zoology-practical-{n}.rb"
            for ref, expected_sha in ((BASE, before), (HEAD, after)):
                observed = git("rev-parse", f"{ref}:{path}")
                if observed != expected_sha:
                    errors.append(f"{ref[:12]}:{path}: expected {expected_sha}, observed {observed}")
    except RuntimeError as exc:
        errors.append(str(exc))
    if errors:
        for error in errors:
            print("FAIL:", error, file=sys.stderr)
        return 1
    print("PASS: seven exact validator blob identities and diff scope; NOT a migration authorization")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
