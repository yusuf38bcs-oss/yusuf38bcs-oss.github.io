#!/usr/bin/env python3
"""Read-only integration readiness: prove protected checks remain active.

This deliberately fails closed when the proposed seven-validator migration
would still be rejected by existing Practical validators.
"""
import pathlib
import re
import sys

ROOT=pathlib.Path(__file__).resolve().parents[2]
names=["museum","whole-mounts","field-report","temporary-mounts","permanent-slides","appendages","dissection"]
errors=[]
for name in names:
    path=ROOT/".github"/"scripts"/f"validate-conv04f-zoology-practical-{name}.rb"
    if not path.is_file():
        errors.append(f"{name}: validator absent")
        continue
    data=path.read_text(encoding="utf-8")
    if not re.search(r'Successor changed protected .* artifacts:',data):
        errors.append(f"{name}: preserved-script rejection predicate not found")
    print(f"{name}: protected-script predicate {'present' if re.search(r'Successor changed protected .* artifacts:',data) else 'MISSING'}")
if errors:
    for error in errors: print("FAIL:",error,file=sys.stderr)
    sys.exit(1)
print("PASS: all seven original protected-script predicates present")
print("BLOCKED: an independent identity check alone does not allow the seven changed scripts through these predicates")
