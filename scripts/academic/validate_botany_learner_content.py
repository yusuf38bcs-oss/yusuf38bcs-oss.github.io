#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LESSON = ROOT / "_biology" / "hsc-corner" / "botany" / "lecture-07-cell-wall-vacuole.md"
PREV = ROOT / "_biology" / "hsc-corner" / "botany" / "lecture-06-mitochondria.md"
NEXT = ROOT / "_biology" / "hsc-corner" / "botany" / "lecture-08-plastid-chloroplast.md"
GATEWAY = ROOT / "_biology" / "hsc-corner" / "botany" / "chapter-01-cell-and-its-structure.md"
BOTANY_INDEX = ROOT / "_biology" / "hsc-corner" / "botany" / "index.md"
SCOPE = ROOT / "_data" / "academic" / "hsc_botany_chapter01_scope_v1.json"
REVIEW = ROOT / "docs" / "academic" / "CONV-03C01_BOT07_CONTENT_REVIEW.md"
REPORT = ROOT / "bot07-learner-content-report.json"

EXPECTED_ROUTE = "/biology/hsc-corner/botany/lecture-07-cell-wall-vacuole/"
NEXT_ROUTE = "/biology/hsc-corner/botany/lecture-08-plastid-chloroplast/"
EXPECTED_TOPICS = {"cell-wall", "vacuole"}
EXPECTED_GAPS = {"gap-01-cell-wall", "gap-03-vacuole"}
REQUIRED_SCIENCE_URLS = {
    "https://www.ncbi.nlm.nih.gov/books/NBK26928/",
    "https://www.ncbi.nlm.nih.gov/books/NBK9874/",
    "https://www.ncbi.nlm.nih.gov/books/NBK26844/",
    "https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells",
}
NCTB_URL = "https://nctb.gov.bd/pages/files/6922dbc6933eb65569e0c702"

errors = []
warnings = []

def require(condition, message):
    if not condition:
        errors.append(message)

def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"Unable to parse {path.relative_to(ROOT)}: {exc}")
        return {}

def fm_scalar(text, key):
    m = re.search(rf"(?m)^{re.escape(key)}:\s*['\"]?([^'\"\n]+)", text)
    return m.group(1).strip() if m else None

def fm_list(text, key):
    m = re.search(rf"(?m)^{re.escape(key)}:\s*\n((?:- [^\n]+\n?)+)", text)
    if not m:
        return []
    return [line[2:].strip() for line in m.group(1).splitlines() if line.startswith("- ")]

def main():
    require(LESSON.is_file(), "BOT-07 lesson file missing")
    require(REVIEW.is_file(), "BOT-07 academic review file missing")
    require(GATEWAY.is_file(), "Chapter-01 gateway missing")
    require(BOTANY_INDEX.is_file(), "Top-level Botany gateway missing")
    require(PREV.is_file(), "BOT-06 previous lesson missing")
    lesson = LESSON.read_text(encoding="utf-8") if LESSON.is_file() else ""
    review = REVIEW.read_text(encoding="utf-8") if REVIEW.is_file() else ""
    gateway = GATEWAY.read_text(encoding="utf-8") if GATEWAY.is_file() else ""
    botany_index = BOTANY_INDEX.read_text(encoding="utf-8") if BOTANY_INDEX.is_file() else ""
    prev = PREV.read_text(encoding="utf-8") if PREV.is_file() else ""
    next_text = NEXT.read_text(encoding="utf-8") if NEXT.is_file() else ""
    scope = load_json(SCOPE)

    require(fm_scalar(lesson, "permalink") == EXPECTED_ROUTE, "BOT-07 canonical route mismatch")
    require(fm_scalar(lesson, "lesson_order") == "7", "BOT-07 lesson_order must be 7")
    require(fm_scalar(lesson, "authoring_model") == "curriculum-bound-edition-neutral", "BOT-07 authoring model mismatch")
    require(fm_scalar(lesson, "source_scope") == "NCTB curriculum 2012 pp.31-33", "BOT-07 source_scope mismatch")
    require(fm_scalar(lesson, "content_review_id") == "conv-03c01-bot07", "BOT-07 review ID mismatch")
    require(fm_scalar(lesson, "translation_status") == "single-source-unpaired", "BOT-07 must remain explicitly unpaired until an English mirror exists")
    require(set(fm_list(lesson, "nctb_topic_ids")) == EXPECTED_TOPICS, "BOT-07 NCTB topic mapping mismatch")
    require(set(fm_list(lesson, "gap_ids")) == EXPECTED_GAPS, "BOT-07 closed-gap frontmatter mismatch")

    mcq_cards = len(re.findall(r'class="lbfl-mcq-card"', lesson))
    cq_cards = len(re.findall(r'class="lbfl-cq-card"', lesson))
    answers = re.findall(r'class="lbfl-mcq-card"\s+data-answer="([A-D])"', lesson)
    radio_names = re.findall(r'<input\s+name="(bot07-q\d+)"\s+type="radio"', lesson)
    require(mcq_cards == 10, f"BOT-07 must contain exactly 10 MCQ cards, found {mcq_cards}")
    require(cq_cards == 3, f"BOT-07 must contain exactly 3 CQ cards, found {cq_cards}")
    require(len(answers) == 10, f"BOT-07 must expose 10 answer keys, found {len(answers)}")
    require(set(radio_names) == {f"bot07-q{i}" for i in range(1, 11)}, "BOT-07 radio-group identity drift")
    for i in range(1, 11):
        count = len(re.findall(rf'name="bot07-q{i}"', lesson))
        require(count == 4, f"BOT-07 q{i} must contain exactly four options, found {count}")

    urls = set(re.findall(r'https?://[^"\s<]+', lesson))
    require(NCTB_URL in urls, "BOT-07 must cite the official NCTB curriculum index")
    found_science = REQUIRED_SCIENCE_URLS & urls
    require(len(found_science) >= 2, f"BOT-07 requires at least two authoritative biology references, found {len(found_science)}")
    require(REQUIRED_SCIENCE_URLS.issubset(urls), "BOT-07 authoritative reference set is incomplete")

    required_terms = [
        "Middle lamella", "Primary wall", "Secondary wall", "Cellulose",
        "Tonoplast", "Cell sap", "Turgor pressure", "hemicellulose", "pectin"
    ]
    for term in required_terms:
        require(term.lower() in lesson.lower(), f"BOT-07 missing required concept: {term}")

    require("exact wording" in lesson.lower() and "দাবি" in lesson, "BOT-07 must state the private-textbook provenance boundary")
    require("named private hsc biology textbook edition-এর exact wording বা page number এই lesson-এ দাবি করা হয়নি" in lesson.lower(), "BOT-07 must explicitly preserve the private-textbook non-claim boundary")

    require("ACADEMIC CONTENT REVIEW: PASS" in review, "Academic review must record PASS")
    for url in REQUIRED_SCIENCE_URLS:
        require(url in review, f"Academic review missing source URL: {url}")
    require("`cell-wall`" in review and "`vacuole`" in review, "Academic review must explicitly name both authorized NCTB topic IDs")
    require("`gap-01-cell-wall`" in review and "`gap-03-vacuole`" in review, "Academic review must explicitly bind both closed curriculum gaps")

    require(EXPECTED_ROUTE in gateway, "Chapter gateway must link BOT-07")
    require(EXPECTED_ROUTE in botany_index, "Top-level Botany gateway must expose BOT-07")
    marker = re.search(r"active-chapter-01-lessons:\s*01-(\d{2})", botany_index)
    require(marker is not None, "Top-level Botany active-lesson marker missing")
    active_last = int(marker.group(1)) if marker else 0
    published_lessons = scope.get("published_lessons", [])
    published_count = len(published_lessons)
    require(active_last == published_count,
            f"Top-level Botany active-lesson marker must equal published lesson count ({published_count})")
    bengali_count_words = {
        7: ("সাতটি",),
        8: ("আটটি",),
        9: ("নয়টি","নয়টি"),
        10: ("দশটি",),
        11: ("এগারোটি",),
        12: ("বারোটি",),
    }
    words = bengali_count_words.get(published_count, ())
    require(bool(words), f"Unsupported public lesson-count wording for {published_count} published lessons")
    require(any(f"{word} সক্রিয় পাঠ" in botany_index for word in words),
            f"Top-level Botany visible lesson count must match {published_count} published lessons")
    require(fm_scalar(gateway, "chapter_completion") == "not-certified", "Chapter 01 must remain not-certified")
    require(fm_scalar(gateway, "contract_state") == "convergence-pending", "Chapter 01 must remain convergence-pending")
    require(EXPECTED_ROUTE in prev, "BOT-06 must link forward to BOT-07")
    require("/biology/hsc-corner/botany/lecture-06-mitochondria/" in lesson, "BOT-07 must link back to BOT-06")
    if NEXT.is_file():
        require(active_last >= 8, "BOT-08 exists but active-lesson marker has not advanced to at least 08")
        require(NEXT_ROUTE in gateway, "BOT-08 exists but Chapter gateway does not expose it")
        require(NEXT_ROUTE in botany_index, "BOT-08 exists but top-level Botany gateway does not expose it")
        require(NEXT_ROUTE in lesson, "BOT-08 exists but BOT-07 does not link forward to it")
        require(fm_scalar(next_text, "permalink") == NEXT_ROUTE, "BOT-08 canonical route mismatch")
        require(fm_scalar(next_text, "lesson_order") == "8", "BOT-08 lesson_order must be 8")
        require(EXPECTED_ROUTE in next_text, "BOT-08 must link back to BOT-07")

        bot08_published = next((x for x in published_lessons if x.get("lesson_id") == "bot-08"), None)
        require(bot08_published is not None, "BOT-08 file exists but scope published_lessons does not register bot-08")
        if bot08_published:
            require(bot08_published.get("source_file") == "_biology/hsc-corner/botany/lecture-08-plastid-chloroplast.md",
                    "BOT-08 published source_file mismatch")
            require(bot08_published.get("route") == NEXT_ROUTE, "BOT-08 published route mismatch")

        bot08_action = next((x for x in scope.get("authoring_plan", []) if x.get("action_id") == "bot-08"), None)
        require(bot08_action is not None, "BOT-08 file exists but pre-authorized bot-08 action is missing")
        if bot08_action:
            require(bot08_action.get("authoring_status") in {"implemented-candidate","implemented-certified"},
                    "BOT-08 file exists but bot-08 authoring action is not implemented")

        bot08_impl = next((x for x in scope.get("content_implementations", []) if x.get("lesson_id") == "bot-08"), None)
        require(bot08_impl is not None, "BOT-08 file exists but content implementation record is missing")
        if bot08_impl:
            require("gap-02-chloroplast" in set(bot08_impl.get("closed_gap_ids", [])),
                    "BOT-08 implementation record must close gap-02-chloroplast")

        chloroplast = next((x for x in scope.get("topic_lesson_map", []) if x.get("topic_id") == "chloroplast"), None)
        require(chloroplast is not None and chloroplast.get("status") == "covered",
                "BOT-08 file exists but chloroplast topic is not covered")
        require(chloroplast is not None and "bot-08" in chloroplast.get("existing_lessons", []),
                "BOT-08 file exists but chloroplast topic does not cite bot-08")
        require("gap-02-chloroplast" not in set(scope.get("remaining_curriculum_gaps", [])),
                "BOT-08 file exists but gap-02-chloroplast remains open")
    else:
        require(NEXT_ROUTE not in lesson, "BOT-07 cannot link to BOT-08 before the target file exists")

    implementation = next((x for x in scope.get("content_implementations", []) if x.get("lesson_id") == "bot-07"), None)
    require(implementation is not None, "Scope contract missing BOT-07 implementation record")
    if implementation:
        require(set(implementation.get("topic_ids", [])) == EXPECTED_TOPICS, "Contract BOT-07 topic mapping mismatch")
        require(set(implementation.get("closed_gap_ids", [])) == EXPECTED_GAPS, "Contract BOT-07 closed-gap mapping mismatch")
        require(implementation.get("mcq_count") == 10, "Contract BOT-07 MCQ count mismatch")
        require(implementation.get("cq_count") == 3, "Contract BOT-07 CQ count mismatch")
        require(implementation.get("academic_review_file") == "docs/academic/CONV-03C01_BOT07_CONTENT_REVIEW.md", "Contract review file mismatch")
        require(implementation.get("status") == "candidate-exact-head-certification-required", "Repository contract must remain candidate-bound; exact-head PASS lives in external workflow evidence")
        historical = implementation.get("historical_certification", {})
        require(historical.get("certified_head_sha") == "f7239f4ac42eb564e137da5278e4d94763f8ed71", "Historical BOT-07 certification head drift")
        require(historical.get("certification_run_id") == 36758752854, "Historical BOT-07 certification run drift")
        require(historical.get("merge_commit_sha") == "b210ad75d7c7f92e95d7fae1438736a6bab54d1a", "Historical BOT-07 merge identity drift")

    topic_map = scope.get("topic_lesson_map", [])
    for tid in EXPECTED_TOPICS:
        item = next((x for x in topic_map if x.get("topic_id") == tid), None)
        require(item is not None and item.get("status") == "covered", f"{tid}: must be covered")
        require(item is not None and item.get("existing_lessons") == ["bot-07"], f"{tid}: must map to bot-07")
        require(item is not None and item.get("gap_id") is None, f"{tid}: closed topic cannot retain gap_id")

    report = {
        "schema": "lbfl-bot07-learner-content-certification-v1",
        "lesson_id": "bot-07",
        "route": EXPECTED_ROUTE,
        "topic_ids": sorted(EXPECTED_TOPICS),
        "closed_gap_ids": sorted(EXPECTED_GAPS),
        "mcq_count": mcq_cards,
        "cq_count": cq_cards,
        "authoritative_science_references": sorted(found_science),
        "authoritative_science_reference_count": len(found_science),
        "nctb_curriculum_reference_present": NCTB_URL in urls,
        "academic_review_pass": "ACADEMIC CONTENT REVIEW: PASS" in review,
        "chapter_completion": fm_scalar(gateway, "chapter_completion"),
        "bot08_present": NEXT.is_file(),
        "future_phase_compatible": True,
        "result": "PASS" if not errors else "FAIL",
        "errors": errors,
        "warnings": warnings,
    }
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
