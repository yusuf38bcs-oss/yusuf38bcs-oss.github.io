#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCOPE = ROOT / "_data" / "academic" / "hsc_botany_chapter01_scope_v1.json"
COURSE_CONTRACT = ROOT / "_data" / "academic" / "course_contract_v1.json"
REPORT = ROOT / "hsc-botany-chapter01-scope-report.json"
SHA40 = re.compile(r"^[0-9a-f]{40}$")

errors = []
warnings = []

def fail(message):
    errors.append(message)

def require(condition, message):
    if not condition:
        fail(message)

def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"Unable to parse {path.relative_to(ROOT)}: {exc}")
        return {}

def frontmatter_value(text, key):
    match = re.search(rf"(?m)^{re.escape(key)}:\s*['\"]?([^'\"\n]+)", text)
    return match.group(1).strip() if match else None

def main():
    scope = load_json(SCOPE)
    contract = load_json(COURSE_CONTRACT)

    require(scope.get("schema") == "lbfl-hsc-botany-chapter01-scope-v1", "Unexpected Chapter 01 scope schema")
    require(scope.get("version") == "CONV-03A-1.0.0", "Unexpected CONV-03A version")
    base = scope.get("authorized_base_sha", "")
    require(bool(SHA40.fullmatch(base)), "authorized_base_sha must be a lowercase 40-character SHA")

    parent_id = scope.get("parent_course_id")
    pathways = contract.get("pathways", [])
    parent = next((x for x in pathways if isinstance(x, dict) and x.get("course_id") == parent_id), None)
    require(parent is not None, f"Parent course not registered: {parent_id}")
    if parent:
        require(parent.get("enforcement") == "progressive", "HSC Botany parent must remain progressive in CONV-03A")
        require(parent.get("status") == "convergence-pending", "HSC Botany parent must remain convergence-pending in CONV-03A")

    gateway_rel = scope.get("gateway_file", "")
    gateway = ROOT / gateway_rel
    require(gateway.is_file(), f"Chapter gateway missing: {gateway_rel}")
    gateway_text = gateway.read_text(encoding="utf-8") if gateway.is_file() else ""
    require(frontmatter_value(gateway_text, "permalink") == scope.get("canonical_route"), "Chapter canonical route mismatch")
    require(frontmatter_value(gateway_text, "contract_state") == "convergence-pending", "Chapter contract_state must remain convergence-pending")
    require(frontmatter_value(gateway_text, "chapter_completion") == "not-certified", "Chapter completion must remain not-certified")

    forbidden = scope.get("route_integrity", {}).get("forbid_prefix", "")
    if forbidden:
        require(forbidden not in gateway_text, f"Forbidden legacy Bengali route prefix remains in chapter gateway: {forbidden}")
    for route in scope.get("route_integrity", {}).get("fixed_routes", []):
        require(route in gateway_text, f"Canonical repaired route not present in chapter gateway: {route}")

    lessons = scope.get("published_lessons", [])
    require(isinstance(lessons, list) and len(lessons) == 6, "CONV-03A must describe exactly the six currently published Chapter 01 lessons")
    lesson_ids = []
    lesson_orders = []
    mcq_count = 0
    cq_count = 0

    for lesson in lessons if isinstance(lessons, list) else []:
        lid = lesson.get("lesson_id")
        lesson_ids.append(lid)
        lesson_orders.append(lesson.get("order"))
        path_rel = lesson.get("source_file", "")
        path = ROOT / path_rel
        require(path.is_file(), f"{lid}: source file missing: {path_rel}")
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        permalink = frontmatter_value(text, "permalink")
        require(permalink == lesson.get("route"), f"{lid}: permalink mismatch ({permalink!r})")
        has_mcq = bool(re.search(r"data-lbfl-quiz|Interactive MCQ Practice|MCQ Practice", text, re.I))
        has_cq = bool(re.search(r"CQ Practice|Creative Question|সৃজনশীল", text, re.I))
        require(has_mcq == bool(lesson.get("mcq")), f"{lid}: MCQ evidence mismatch")
        require(has_cq == bool(lesson.get("cq")), f"{lid}: CQ evidence mismatch")
        mcq_count += int(has_mcq)
        cq_count += int(has_cq)

    require(len(lesson_ids) == len(set(lesson_ids)), "Duplicate published lesson_id")
    require(lesson_orders == list(range(1, len(lesson_orders) + 1)), "Published lesson orders must be contiguous from 1")

    planned = scope.get("planned_lessons", [])
    planned_topics = {x.get("topic"): x for x in planned if isinstance(x, dict)}
    for required_topic in ("Plastid and Chloroplast", "Nucleus and Chromosome"):
        require(required_topic in planned_topics, f"Missing planned required topic: {required_topic}")
        if required_topic in planned_topics:
            require(planned_topics[required_topic].get("required") is True, f"{required_topic}: must be required")
            require(planned_topics[required_topic].get("status") == "missing", f"{required_topic}: must remain missing until authored")

    coverage = scope.get("coverage_units", [])
    allowed_status = {"covered", "partial", "missing"}
    required_topic_ids = {
        "cell-foundation-theory",
        "cell-wall",
        "plasma-membrane",
        "cytoplasm-ribosome",
        "endoplasmic-reticulum",
        "golgi-lysosome",
        "mitochondrion",
        "plastid-chloroplast",
        "centriole",
        "nucleus",
        "chromosome",
        "dna-rna-structure",
        "dna-replication",
        "transcription-translation",
        "gene-genetic-code",
    }
    coverage_map = {}
    for item in coverage if isinstance(coverage, list) else []:
        tid = item.get("topic_id")
        status = item.get("status")
        require(status in allowed_status, f"{tid}: invalid coverage status {status!r}")
        require(tid not in coverage_map, f"Duplicate coverage topic: {tid}")
        coverage_map[tid] = status
    require(set(coverage_map) == required_topic_ids, "Coverage-unit set does not match authenticated Chapter 01 scope")

    incomplete = sorted(tid for tid, status in coverage_map.items() if status != "covered")
    require(bool(incomplete), "CONV-03A must not claim Chapter 01 fully covered")
    require(scope.get("strict_child_authorized") is False, "strict_child_authorized must remain false while scope is incomplete")
    require(scope.get("missing_lesson_authoring_authorized") is False, "Missing-lesson authoring must remain unauthorized without primary text custody")

    custody = scope.get("primary_text_custody", {})
    require(custody.get("nctb_primary_text_or_page_evidence_obtained") is False, "Primary-text custody state unexpectedly changed")
    require(custody.get("required_before_missing_lesson_authoring") is True, "Primary-text custody must be required before authoring")

    sources = scope.get("source_evidence", [])
    source_classes = {x.get("source_class") for x in sources if isinstance(x, dict)}
    require(len(sources) >= 4, "At least four source-evidence records are required")
    require("government-teacher-portal" in source_classes, "Government teacher-portal corroboration is required")
    require("secondary-syllabus-index" in source_classes, "Independent syllabus-map corroboration is required")
    urls = [x.get("url", "") for x in sources if isinstance(x, dict)]
    require(len(urls) == len(set(urls)), "Duplicate source-evidence URL")

    assessment = scope.get("assessment_audit", {})
    require(assessment.get("published_lessons") == len(lessons), "Assessment published-lessons count mismatch")
    require(assessment.get("lessons_with_mcq") == mcq_count, "Assessment MCQ count mismatch")
    require(assessment.get("lessons_with_cq") == cq_count, "Assessment CQ count mismatch")
    require(assessment.get("chapter_completion_assessment_authorized") is False, "Chapter-completion assessment authority must remain false")

    report = {
        "schema": scope.get("schema"),
        "version": scope.get("version"),
        "authorized_base_sha": base,
        "parent_course_id": parent_id,
        "parent_enforcement": parent.get("enforcement") if parent else None,
        "published_lessons": len(lessons),
        "lessons_with_mcq": mcq_count,
        "lessons_with_cq": cq_count,
        "coverage_units": len(coverage_map),
        "incomplete_units": incomplete,
        "primary_text_custody": custody.get("nctb_primary_text_or_page_evidence_obtained"),
        "strict_child_authorized": scope.get("strict_child_authorized"),
        "missing_lesson_authoring_authorized": scope.get("missing_lesson_authoring_authorized"),
        "source_evidence_count": len(sources),
        "errors": errors,
        "warnings": warnings,
        "result": "PASS" if not errors else "FAIL",
    }
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
