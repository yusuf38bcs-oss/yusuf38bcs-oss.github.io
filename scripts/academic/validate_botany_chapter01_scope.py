#!/usr/bin/env python3
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCOPE = ROOT / "_data" / "academic" / "hsc_botany_chapter01_scope_v1.json"
COURSE_CONTRACT = ROOT / "_data" / "academic" / "course_contract_v1.json"
REPORT = ROOT / "hsc-botany-chapter01-scope-report.json"
SHA40 = re.compile(r"^[0-9a-f]{40}$")

EXPECTED_BASE = "3626353584608434123ee71c32e368c078f5d3b0"
EXPECTED_INDEX = "https://nctb.gov.bd/pages/files/6922dbc6933eb65569e0c702"
EXPECTED_PDF = "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-nctb/2024/12/ca39e59575134a74b26a35b760d193eb.pdf"
EXPECTED_PAGES = [31, 32, 33]
EXPECTED_TOPIC_IDS = {
    "cell-wall",
    "plasmalemma",
    "cytoplasm",
    "ribosome",
    "endoplasmic-reticulum",
    "golgi-apparatus",
    "mitochondrion",
    "chloroplast",
    "lysosome",
    "vacuole",
    "centriole-microtubule",
    "nucleus-nucleolus-chromatin-chromosome",
    "cell-chemical-components",
    "prokaryotic-eukaryotic-comparison",
    "unicellular-multicellular-organization",
    "cell-size-shape-inclusions",
    "cell-theory-history",
    "microscopy-mounting-drawing",
    "organelle-structure-function",
    "practical-applied-observation",
}
RETIRED_SECONDARY_IDS = {
    "dna-rna-structure",
    "dna-replication",
    "transcription-translation",
    "gene-genetic-code",
}
ALLOWED_MAP_STATUS = {"covered", "partial", "missing"}

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
    require(scope.get("version") == "CONV-03B1-1.0.0", "Unexpected CONV-03B.1 version")
    base = scope.get("authorized_base_sha", "")
    require(bool(SHA40.fullmatch(base)), "authorized_base_sha must be a lowercase 40-character SHA")
    require(base == EXPECTED_BASE, f"CONV-03B.1 authorized base drift: {base}")

    parent_id = scope.get("parent_course_id")
    pathways = contract.get("pathways", [])
    parent = next((x for x in pathways if isinstance(x, dict) and x.get("course_id") == parent_id), None)
    require(parent is not None, f"Parent course not registered: {parent_id}")
    if parent:
        require(parent.get("enforcement") == "progressive", "HSC Botany parent must remain progressive")
        require(parent.get("status") == "convergence-pending", "HSC Botany parent must remain convergence-pending")

    gateway_rel = scope.get("gateway_file", "")
    gateway = ROOT / gateway_rel
    require(gateway.is_file(), f"Chapter gateway missing: {gateway_rel}")
    gateway_text = gateway.read_text(encoding="utf-8") if gateway.is_file() else ""
    require(frontmatter_value(gateway_text, "permalink") == scope.get("canonical_route"), "Chapter canonical route mismatch")
    require(frontmatter_value(gateway_text, "contract_state") == "convergence-pending", "Chapter contract_state must remain convergence-pending")
    require(frontmatter_value(gateway_text, "chapter_completion") == "not-certified", "Chapter completion must remain not-certified")
    require(frontmatter_value(gateway_text, "source_scope") == "NCTB curriculum 2012 pp.31-33", "Gateway must expose primary curriculum source scope")
    require(frontmatter_value(gateway_text, "source_custody") == "curriculum-acquired-textbook-pending", "Gateway source-custody boundary mismatch")

    forbidden = scope.get("route_integrity", {}).get("forbid_prefix", "")
    if forbidden:
        require(forbidden not in gateway_text, f"Forbidden legacy Bengali route prefix remains in chapter gateway: {forbidden}")
    for route in scope.get("route_integrity", {}).get("fixed_routes", []):
        require(route in gateway_text, f"Canonical repaired route not present in chapter gateway: {route}")

    curriculum = scope.get("primary_curriculum_custody", {})
    require(curriculum.get("obtained") is True, "Primary NCTB curriculum custody must be true")
    require(curriculum.get("official_index_url") == EXPECTED_INDEX, "Official NCTB curriculum index URL mismatch")
    require(curriculum.get("official_pdf_url") == EXPECTED_PDF, "Official NCTB Biology curriculum PDF URL mismatch")
    require(curriculum.get("pdf_page_range") == EXPECTED_PAGES, "NCTB Chapter 01 page range must be exactly 31–33")
    require(curriculum.get("allocated_periods") == 25, "NCTB Chapter 01 allocated periods must be 25")

    textbook = scope.get("primary_textbook_custody", {})
    require(textbook.get("nctb_textbook_chapter_pages_obtained") is False, "CONV-03B.1 must not overstate textbook-chapter custody")
    require(textbook.get("required_before_missing_lesson_authoring") is True, "Textbook-chapter custody must remain required before authoring")
    require(scope.get("missing_lesson_authoring_authorized") is False, "Missing-lesson authoring must remain unauthorized")
    require(scope.get("strict_child_authorized") is False, "Strict child promotion must remain unauthorized")

    sources = scope.get("source_evidence", [])
    source_classes = [x.get("source_class") for x in sources if isinstance(x, dict)]
    require(source_classes.count("official-nctb-curriculum-index") == 1, "Exactly one official NCTB curriculum-index evidence record is required")
    require(source_classes.count("official-nctb-curriculum-pdf") == 1, "Exactly one official NCTB curriculum-PDF evidence record is required")
    require("secondary-syllabus-index" not in source_classes, "Secondary syllabus index must be removed from active authority")
    require(all(x.get("authority_level") == "primary-authority" for x in sources if isinstance(x, dict)), "All active CONV-03B.1 sources must be primary-authority")
    urls = [x.get("url", "") for x in sources if isinstance(x, dict)]
    require(EXPECTED_INDEX in urls and EXPECTED_PDF in urls, "Required official NCTB URLs missing")
    require(len(urls) == len(set(urls)), "Duplicate source-evidence URL")

    retired = scope.get("retired_secondary_assumptions", [])
    retired_ids = {x.get("topic_id") for x in retired if isinstance(x, dict)}
    require(retired_ids == RETIRED_SECONDARY_IDS, "Retired secondary-assumption set must be exact")
    for item in retired if isinstance(retired, list) else []:
        require(item.get("previous_basis") == "secondary-syllabus-index", f"{item.get('topic_id')}: previous basis must be secondary-syllabus-index")
        require(item.get("status") == "not-asserted-by-acquired-nctb-pages-31-33", f"{item.get('topic_id')}: retired status mismatch")

    lessons = scope.get("published_lessons", [])
    require(isinstance(lessons, list) and len(lessons) == 6, "CONV-03B.1 must retain exactly six currently published lessons")
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
        require(frontmatter_value(text, "permalink") == lesson.get("route"), f"{lid}: permalink mismatch")
        has_mcq = bool(re.search(r"data-lbfl-quiz|Interactive MCQ Practice|MCQ Practice", text, re.I))
        has_cq = bool(re.search(r"CQ Practice|Creative Question|সৃজনশীল", text, re.I))
        require(has_mcq == bool(lesson.get("mcq")), f"{lid}: MCQ evidence mismatch")
        require(has_cq == bool(lesson.get("cq")), f"{lid}: CQ evidence mismatch")
        mcq_count += int(has_mcq)
        cq_count += int(has_cq)
    require(len(lesson_ids) == len(set(lesson_ids)), "Duplicate published lesson_id")
    require(lesson_orders == list(range(1, len(lesson_orders) + 1)), "Published lesson orders must be contiguous from 1")

    topic_map = scope.get("topic_lesson_map", [])
    require(isinstance(topic_map, list), "topic_lesson_map must be a list")
    topic_ids = [x.get("topic_id") for x in topic_map if isinstance(x, dict)]
    require(set(topic_ids) == EXPECTED_TOPIC_IDS, "Topic-to-lesson map must match the acquired NCTB Chapter 01 scope exactly")
    require(len(topic_ids) == len(set(topic_ids)), "Duplicate topic_id in topic_lesson_map")

    valid_lesson_ids = set(lesson_ids)
    gap_ids = []
    status_counter = Counter()
    for item in topic_map if isinstance(topic_map, list) else []:
        tid = item.get("topic_id")
        status = item.get("status")
        status_counter[status] += 1
        require(status in ALLOWED_MAP_STATUS, f"{tid}: invalid map status {status!r}")
        require(item.get("source_pages") == EXPECTED_PAGES, f"{tid}: source_pages must be exactly 31–33")
        existing = item.get("existing_lessons", [])
        require(isinstance(existing, list), f"{tid}: existing_lessons must be a list")
        require(set(existing).issubset(valid_lesson_ids), f"{tid}: unknown existing lesson reference")
        gap_id = item.get("gap_id")
        if status == "covered":
            require(gap_id is None, f"{tid}: covered topic cannot carry a gap_id")
            require(item.get("missing_lesson_requirement") == "none", f"{tid}: covered topic cannot require a missing lesson")
        else:
            require(isinstance(gap_id, str) and gap_id.startswith("gap-"), f"{tid}: incomplete topic requires a gap_id")
            require(item.get("missing_lesson_requirement") != "none", f"{tid}: incomplete topic requires explicit remediation")
            gap_ids.append(gap_id)

    require(not (RETIRED_SECONDARY_IDS & set(topic_ids)), "Retired secondary assumptions must not remain in active NCTB topic map")

    buckets = scope.get("provisional_missing_lesson_buckets", [])
    bucket_ids = [x.get("bucket_id") for x in buckets if isinstance(x, dict)]
    require(set(bucket_ids) == set(gap_ids), "Provisional missing-lesson buckets must match all incomplete topic gaps")
    require(len(bucket_ids) == len(set(bucket_ids)), "Duplicate provisional missing-lesson bucket")
    for bucket in buckets if isinstance(buckets, list) else []:
        require(bucket.get("architecture_status") == "provisional-not-authorized", f"{bucket.get('bucket_id')}: bucket must remain non-authorizing")

    assessment = scope.get("assessment_audit", {})
    require(assessment.get("published_lessons") == len(lessons), "Assessment published-lessons count mismatch")
    require(assessment.get("lessons_with_mcq") == mcq_count, "Assessment MCQ count mismatch")
    require(assessment.get("lessons_with_cq") == cq_count, "Assessment CQ count mismatch")
    require(assessment.get("chapter_completion_assessment_authorized") is False, "Chapter-completion assessment authority must remain false")

    promotion = scope.get("promotion_gate", {})
    require(promotion.get("require_primary_curriculum_custody") is True, "Primary curriculum custody must be a promotion prerequisite")
    require(promotion.get("require_primary_textbook_chapter_custody_before_authoring") is True, "Textbook-chapter custody must be required before authoring")
    require(promotion.get("require_all_required_topic_map_entries_covered") is True, "All NCTB topic-map entries must be covered before strict promotion")
    require(promotion.get("parent_hsc_botany_remains_progressive") is True, "Parent HSC Botany must remain progressive")

    incomplete = sorted(x.get("topic_id") for x in topic_map if isinstance(x, dict) and x.get("status") != "covered")
    require(bool(incomplete), "CONV-03B.1 must not claim Chapter 01 fully covered")

    report = {
        "schema": scope.get("schema"),
        "version": scope.get("version"),
        "authorized_base_sha": base,
        "parent_course_id": parent_id,
        "parent_enforcement": parent.get("enforcement") if parent else None,
        "primary_curriculum_custody": curriculum.get("obtained"),
        "nctb_pdf_page_range": curriculum.get("pdf_page_range"),
        "allocated_periods": curriculum.get("allocated_periods"),
        "primary_textbook_chapter_custody": textbook.get("nctb_textbook_chapter_pages_obtained"),
        "published_lessons": len(lessons),
        "lessons_with_mcq": mcq_count,
        "lessons_with_cq": cq_count,
        "topic_map_entries": len(topic_ids),
        "topic_status_counts": dict(status_counter),
        "incomplete_topics": incomplete,
        "provisional_gap_buckets": sorted(bucket_ids),
        "retired_secondary_assumptions": sorted(retired_ids),
        "strict_child_authorized": scope.get("strict_child_authorized"),
        "missing_lesson_authoring_authorized": scope.get("missing_lesson_authoring_authorized"),
        "errors": errors,
        "warnings": warnings,
        "result": "PASS" if not errors else "FAIL",
    }
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
