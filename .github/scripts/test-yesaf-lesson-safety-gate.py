#!/usr/bin/env python3
"""YESAF isolated fixture tests for the embedded trusted pull_request_target gate.

Tests execute the workflow's actual inline Python using mocked GitHub API
responses. No credentials, external network, PR mutation, or deployment.
"""
import contextlib
import io
import json
import os
from pathlib import Path
import tempfile
import textwrap
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = ROOT / ".github/workflows/ai-pr-safety-gate.yml"
source = WORKFLOW.read_text(encoding="utf-8")
start = "          python3 - <<'PY'\n"
end = "\n          PY"
assert source.count(start) == 1 and source.count(end) == 1
gate = textwrap.dedent(source.split(start, 1)[1].split(end, 1)[0])

def row(name, status="modified", previous_filename=""):
    return {"filename": name, "status": status, "previous_filename": previous_filename}

def check(label, head, changed, expected, base="staging", note=None):
    event = {
        "pull_request": {
            "head": {"ref": head},
            "base": {"ref": base},
            "number": 42,
        }
    }
    urls = []
    def mock_urlopen(request, timeout=30):
        urls.append(request.full_url)
        assert "pulls/42/files?per_page=100&page=1" in request.full_url
        return io.BytesIO(json.dumps(changed).encode("utf-8"))

    with tempfile.TemporaryDirectory(prefix="yesaf-path-fixture-") as directory:
        event_path = Path(directory) / "event.json"
        event_path.write_text(json.dumps(event), encoding="utf-8")
        env = {
            "GITHUB_EVENT_PATH": str(event_path),
            "GITHUB_REPOSITORY": "test-owner/test-repo",
            "GH_TOKEN": "fixture-read-only-token",
            "GITHUB_STEP_SUMMARY": "",
        }
        stdout = io.StringIO()
        stderr = io.StringIO()
        exit_code = 0
        with patch.dict(os.environ, env, clear=True), patch("urllib.request.urlopen", mock_urlopen), (
            contextlib.redirect_stdout(stdout)
        ), contextlib.redirect_stderr(stderr):
            try:
                exec(compile(gate, "<trusted-gate-fixture>", "exec"), {"__name__": "__main__"})
            except SystemExit as exc:
                exit_code = exc.code if isinstance(exc.code, int) else 1
        result = json.loads(stdout.getvalue())
    assert result["status"] == expected, (label, result, stderr.getvalue())
    assert (exit_code == 0) == (expected == "PASS"), (label, exit_code)
    if note is not None:
        assert note in result.get("note", ""), (label, result)
        assert urls == [], (label, urls)
    else:
        assert len(urls) == 1, (label, urls)
    print("PASS", label)

check("lesson botany one Markdown", "lesson/botany", [
    row("_biology/hsc-corner/botany/lesson-01.md")], "PASS")
check("lesson zoology one Markdown", "lesson/zoology", [
    row("_biology/hsc-corner/zoology/lesson-01.md")], "PASS")
check("lesson higher zoology one Markdown", "lesson/higher", [
    row("_biology/higher-zoology-tree/ecology.md")], "PASS")
check("lesson reject old ai-only posts zone", "lesson/posts", [
    row("_posts/sneaky.md")], "FAIL")
check("lesson reject CSS", "lesson/css", [
    row("assets/css/lesson/breakpoint.css")], "FAIL")
check("lesson reject workflow file", "lesson/workflow", [
    row(".github/workflows/deploy.yml")], "FAIL")
check("lesson reject non Markdown", "lesson/non-md", [
    row("_biology/hsc-corner/botany/update.html")], "FAIL")
check("lesson reject extra file", "lesson/two", [
    row("_biology/hsc-corner/botany/01.md"),
    row("_biology/hsc-corner/botany/02.md")], "FAIL")
check("lesson reject rename", "lesson/rename", [
    row("_biology/hsc-corner/botany/02.md", "renamed",
        "_biology/hsc-corner/botany/01.md")], "FAIL")
check("lesson reject traversal", "lesson/traversal", [
    row("_biology/hsc-corner/botany/../zoology/02.md")], "FAIL")
check("lesson reject main base", "lesson/main-base", [
    row("_biology/hsc-corner/botany/01.md")], "FAIL", base="main")
check("legacy ai posts retained", "ai/legacy", [
    row("_posts/2026-10-11-example.md")], "PASS")
check("legacy ai biology scope remains prohibited", "ai/not-lesson", [
    row("_biology/hsc-corner/botany/01.md")], "FAIL")
check("non-ai non-lesson branches bypass scoped guard", "fix/workflow-only", [
    row(".github/workflows/ai-pr-safety-gate.yml")], "PASS",
    note="Non-ai/* and non-lesson/* branch")
print("YESAF_SAFETY_GATE_FIXTURE_MATRIX=14/14 PASS")
