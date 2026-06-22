#!/usr/bin/env python3
"""Validation tests for scripts/audit_quiz_includes.py."""
from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("audit_quiz_includes.py")
SPEC = importlib.util.spec_from_file_location("audit_quiz_includes", MODULE_PATH)
audit_module = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(audit_module)


class QuizIncludeAuditTests(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        (self.root / "_data").mkdir()
        (self.root / "_includes").mkdir()
        (self.root / "content").mkdir()
        (self.root / "_data" / "quizzes.yml").write_text(
            "genetics:\n  quiz_title: Genetics\n", encoding="utf-8"
        )
        audit_module.ROOT = self.root
        audit_module.QUIZ_DATA = self.root / "_data" / "quizzes.yml"
        audit_module.BASELINE = self.root / "scripts" / "quiz_include_audit_baseline.txt"

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def write_page(self, body: str) -> None:
        (self.root / "content" / "page.md").write_text(body, encoding="utf-8")

    def test_bare_literal_quiz_id_passes_without_comments(self) -> None:
        self.write_page("{% include components/quiz-render.html quiz_id=genetics %}")
        issues, dynamic_comments = audit_module.audit()
        self.assertEqual([], issues)
        self.assertEqual([], dynamic_comments)

    def test_single_quoted_literal_quiz_id_passes_without_comments(self) -> None:
        self.write_page("{% include components/quiz-render.html quiz_id='genetics' %}")
        issues, dynamic_comments = audit_module.audit()
        self.assertEqual([], issues)
        self.assertEqual([], dynamic_comments)

    def test_double_quoted_literal_quiz_id_passes_without_comments(self) -> None:
        self.write_page('{% include components/quiz-render.html quiz_id="genetics" %}')
        issues, dynamic_comments = audit_module.audit()
        self.assertEqual([], issues)
        self.assertEqual([], dynamic_comments)

    def test_page_quiz_id_resolves_from_front_matter_and_passes(self) -> None:
        self.write_page(
            "---\nquiz_id: genetics\ntitle: Genetics Quiz\n---\n{% include components/quiz-render.html quiz_id=page.quiz_id %}\n"
        )
        issues, dynamic_comments = audit_module.audit()
        self.assertEqual([], issues)
        self.assertEqual(
            [
                "content/page.md:5: page.quiz_id resolves to 'genetics' and is defined in _data/quizzes.yml"
            ],
            dynamic_comments,
        )

    def test_page_quiz_id_without_front_matter_fails(self) -> None:
        self.write_page("{% include components/quiz-render.html quiz_id=page.quiz_id %}\n")
        issues, dynamic_comments = audit_module.audit()
        self.assertEqual(
            ["content/page.md:1: page.quiz_id used but no quiz_id front matter found"],
            issues,
        )
        self.assertEqual([], dynamic_comments)

    def test_page_quiz_id_with_missing_data_key_fails(self) -> None:
        self.write_page(
            "---\nquiz_id: missing-bank\n---\n{% include components/quiz-render.html quiz_id=page.quiz_id %}\n"
        )
        issues, dynamic_comments = audit_module.audit()
        self.assertEqual(
            [
                "content/page.md:4: page.quiz_id resolves to 'missing-bank' but it is not defined in _data/quizzes.yml"
            ],
            issues,
        )
        self.assertEqual([], dynamic_comments)

    def test_include_quiz_id_wrapper_is_skipped(self) -> None:
        self.write_page("{% include quiz-render.html quiz_id=include.quiz_id %}")
        issues, dynamic_comments = audit_module.audit()
        self.assertEqual([], issues)
        self.assertEqual(
            [
                "content/page.md:1: include.quiz_id pass-through wrapper is accepted and checked by callers"
            ],
            dynamic_comments,
        )


if __name__ == "__main__":
    unittest.main()
