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
SHA256 = re.compile(r"^[0-9a-f]{64}$")

EXPECTED_BASE = "8f306f14f0570df5bc46d65f91702984c3c4d692"
EXPECTED_INDEX = "https://nctb.gov.bd/pages/files/6922dbc6933eb65569e0c702"
EXPECTED_CURRICULUM_PDF = "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-nctb/2024/12/ca39e59575134a74b26a35b760d193eb.pdf"
EXPECTED_CURRENT_TEXTBOOK_PAGE = "https://nctb.gov.bd/pages/static-pages/6922e145933eb65569e2b37b"
EXPECTED_APPROVAL_REGISTER = "https://nctb.gov.bd/pages/files/6922da5f933eb65569e040f1"
EXPECTED_HISTORICAL_APPROVAL_ATTACHMENT = "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-nctb/2024/12/849ea804187344b4a7dd84cf0e10cd34.pdf"
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
    require(scope.get("version") == "CONV-03B2-1.0.0", "Unexpected CONV-03B.2 version")
    base = scope.get("authorized_base_sha", "")
    require(bool(SHA40.fullmatch(base)), "authorized_base_sha must be a lowercase 40-character SHA")
    require(base == EXPECTED_BASE, f"CONV-03B.2 authorized base drift: {base}")

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
    require(frontmatter_value(gateway_text, "source_scope") == "NCTB curriculum 2012 pp.31-33", "Gateway must retain primary curriculum source scope")
    require(frontmatter_value(gateway_text, "source_custody") == "curriculum-acquired-textbook-pending", "Gateway source-custody boundary mismatch")

    forbidden = scope.get("route_integrity", {}).get("forbid_prefix", "")
    if forbidden:
        require(forbidden not in gateway_text, f"Forbidden legacy Bengali route prefix remains in chapter gateway: {forbidden}")

    curriculum = scope.get("primary_curriculum_custody", {})
    require(curriculum.get("obtained") is True, "Primary NCTB curriculum custody must remain true")
    require(curriculum.get("official_index_url") == EXPECTED_INDEX, "Official NCTB curriculum index URL mismatch")
    require(curriculum.get("official_pdf_url") == EXPECTED_CURRICULUM_PDF, "Official NCTB Biology curriculum PDF URL mismatch")
    require(curriculum.get("pdf_page_range") == EXPECTED_PAGES, "NCTB curriculum Chapter 01 page range must remain 31–33")
    require(curriculum.get("allocated_periods") == 25, "NCTB Chapter 01 allocated periods must remain 25")

    textbook = scope.get("primary_textbook_custody", {})
    require(textbook.get("custody_model") == "nctb-approved-private-hsc-textbook", "Textbook custody model must reflect NCTB-approved private subject textbooks")
    require(textbook.get("centrally_published_nctb_biology_pdf_exposed_on_current_textbook_page") is False, "Do not claim a centrally exposed NCTB Biology textbook PDF")
    require(textbook.get("official_current_textbook_page_url") == EXPECTED_CURRENT_TEXTBOOK_PAGE, "Current NCTB textbook page URL mismatch")
    require(textbook.get("official_approval_register_url") == EXPECTED_APPROVAL_REGISTER, "NCTB approval-register URL mismatch")
    require(textbook.get("official_historical_approval_attachment_url") == EXPECTED_HISTORICAL_APPROVAL_ATTACHMENT, "Historical approval attachment URL mismatch")
    require(textbook.get("current_applicable_edition_selected") is False, "No current applicable textbook edition has been selected")
    require(textbook.get("current_nctb_approval_verified") is False, "Current NCTB approval must remain unverified until primary evidence exists")
    require(textbook.get("selected_edition") is None, "selected_edition must remain null while custody is unresolved")
    require(textbook.get("textbook_bytes_obtained") is False, "Textbook bytes must not be claimed as obtained")
    require(textbook.get("file_sha256") is None, "Textbook SHA-256 must remain null without byte custody")
    require(textbook.get("chapter01_page_range") is None, "Textbook Chapter-01 page range must remain null")
    require(textbook.get("gap_page_bindings_complete") is False, "Textbook gap-page bindings must remain incomplete")
    require(textbook.get("required_before_missing_lesson_authoring") is True, "Textbook custody must remain required before authoring")

    require(scope.get("missing_lesson_authoring_authorized") is False, "Missing-lesson authoring must remain unauthorized")
    require(scope.get("strict_child_authorized") is False, "Strict child promotion must remain unauthorized")

    sources = scope.get("source_evidence", [])
    source_classes = [x.get("source_class") for x in sources if isinstance(x, dict)]
    required_source_classes = {
        "official-nctb-curriculum-index",
        "official-nctb-curriculum-pdf",
        "official-nctb-current-hsc-textbook-page",
        "official-nctb-approved-textbook-register",
        "official-nctb-historical-approval-attachment",
    }
    require(required_source_classes.issubset(set(source_classes)), "Required official NCTB provenance classes are missing")
    require("secondary-syllabus-index" not in source_classes, "Secondary syllabus index must not return as active authority")
    urls = [x.get("url", "") for x in sources if isinstance(x, dict)]
    for expected in (EXPECTED_INDEX, EXPECTED_CURRICULUM_PDF, EXPECTED_CURRENT_TEXTBOOK_PAGE, EXPECTED_APPROVAL_REGISTER, EXPECTED_HISTORICAL_APPROVAL_ATTACHMENT):
        require(expected in urls, f"Required official source missing: {expected}")
    require(len(urls) == len(set(urls)), "Duplicate source-evidence URL")

    retired = scope.get("retired_secondary_assumptions", [])
    retired_ids = {x.get("topic_id") for x in retired if isinstance(x, dict)}
    require(retired_ids == RETIRED_SECONDARY_IDS, "Retired secondary-assumption set must remain exact")

    lessons = scope.get("published_lessons", [])
    require(isinstance(lessons, list) and len(lessons) == 6, "CONV-03B.2 must retain exactly six currently published lessons")
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
    topic_ids = [x.get("topic_id") for x in topic_map if isinstance(x, dict)]
    require(set(topic_ids) == EXPECTED_TOPIC_IDS, "Topic-to-lesson map must remain the acquired NCTB curriculum scope")
    require(len(topic_ids) == len(set(topic_ids)), "Duplicate topic_id in topic_lesson_map")

    valid_lesson_ids = set(lesson_ids)
    gap_ids = []
    status_counter = Counter()
    for item in topic_map if isinstance(topic_map, list) else []:
        tid = item.get("topic_id")
        status = item.get("status")
        status_counter[status] += 1
        require(status in ALLOWED_MAP_STATUS, f"{tid}: invalid map status {status!r}")
        require(item.get("source_pages") == EXPECTED_PAGES, f"{tid}: curriculum source_pages must remain 31–33")
        existing = item.get("existing_lessons", [])
        require(isinstance(existing, list), f"{tid}: existing_lessons must be a list")
        require(set(existing).issubset(valid_lesson_ids), f"{tid}: unknown existing lesson reference")
        gap_id = item.get("gap_id")
        if status == "covered":
            require(gap_id is None, f"{tid}: covered topic cannot carry a gap_id")
        else:
            require(isinstance(gap_id, str) and gap_id.startswith("gap-"), f"{tid}: incomplete topic requires a gap_id")
            gap_ids.append(gap_id)
    require(not (RETIRED_SECONDARY_IDS & set(topic_ids)), "Retired secondary assumptions must not return to active topic map")

    buckets = scope.get("provisional_missing_lesson_buckets", [])
    bucket_ids = [x.get("bucket_id") for x in buckets if isinstance(x, dict)]
    require(set(bucket_ids) == set(gap_ids), "Provisional gap buckets must match every incomplete curriculum topic")
    require(len(bucket_ids) == len(set(bucket_ids)), "Duplicate provisional gap bucket")
    for bucket in buckets if isinstance(buckets, list) else []:
        require(bucket.get("architecture_status") == "provisional-not-authorized", f"{bucket.get('bucket_id')}: bucket must remain non-authorizing")

    bindings = scope.get("textbook_page_gap_bindings", [])
    binding_ids = [x.get("gap_id") for x in bindings if isinstance(x, dict)]
    require(set(binding_ids) == set(bucket_ids), "Textbook page-binding ledger must contain exactly the 11 current gap buckets")
    require(len(binding_ids) == len(set(binding_ids)), "Duplicate textbook page-binding gap_id")
    for item in bindings if isinstance(bindings, list) else []:
        gid = item.get("gap_id")
        require(item.get("status") == "pending-current-approved-edition-custody", f"{gid}: page binding must remain pending custody")
        require(item.get("textbook_page_start") is None, f"{gid}: textbook_page_start cannot be claimed yet")
        require(item.get("textbook_page_end") is None, f"{gid}: textbook_page_end cannot be claimed yet")
        require(item.get("printed_page_labels") is None, f"{gid}: printed page labels cannot be claimed yet")
        require(item.get("claim_mapping_verified") is False, f"{gid}: claim mapping cannot be verified yet")

    architecture = scope.get("lesson_architecture_authorization", {})
    require(architecture.get("gap_consolidation_status") == "blocked-on-current-approved-textbook-custody", "Gap consolidation must remain blocked")
    require(architecture.get("final_lesson_count_status") == "not-authorized", "Final lesson count must remain unauthorized")
    require(architecture.get("deterministic_sequence_authorized") is False, "Deterministic lesson sequence must remain unauthorized")
    require(architecture.get("expansion_of_existing_lessons_authorized") is False, "Existing-lesson expansion must remain unauthorized")
    require(architecture.get("creation_of_new_lessons_authorized") is False, "New-lesson creation must remain unauthorized")
    require(architecture.get("missing_lesson_authoring_authorized") is False, "Architecture must preserve authoring HOLD")

    assessment = scope.get("assessment_audit", {})
    require(assessment.get("published_lessons") == len(lessons), "Assessment published-lessons count mismatch")
    require(assessment.get("lessons_with_mcq") == mcq_count, "Assessment MCQ count mismatch")
    require(assessment.get("lessons_with_cq") == cq_count, "Assessment CQ count mismatch")
    require(assessment.get("chapter_completion_assessment_authorized") is False, "Chapter-completion assessment authority must remain false")

    promotion = scope.get("promotion_gate", {})
    require(promotion.get("require_primary_curriculum_custody") is True, "Primary curriculum custody must remain required")
    require(promotion.get("require_current_applicable_nctb_approved_textbook_edition") is True, "Current approved textbook edition must be required")
    require(promotion.get("require_selected_textbook_bytes_and_sha256") is True, "Selected textbook bytes and SHA-256 must be required")
    require(promotion.get("require_exact_textbook_page_binding_for_all_gaps") is True, "Exact textbook page binding must be required")
    require(promotion.get("require_final_lesson_architecture_authorization") is True, "Final architecture authorization must be required")
    require(promotion.get("require_all_required_topic_map_entries_covered") is True, "All curriculum topics must be covered before strict promotion")
    require(promotion.get("parent_hsc_botany_remains_progressive") is True, "Parent HSC Botany must remain progressive")

    incomplete = sorted(x.get("topic_id") for x in topic_map if isinstance(x, dict) and x.get("status") != "covered")
    require(bool(incomplete), "CONV-03B.2 must not claim Chapter 01 fully covered")

    report = {
        "schema": scope.get("schema"),
        "version": scope.get("version"),
        "authorized_base_sha": base,
        "parent_course_id": parent_id,
        "parent_enforcement": parent.get("enforcement") if parent else None,
        "primary_curriculum_custody": curriculum.get("obtained"),
        "textbook_custody_model": textbook.get("custody_model"),
        "current_applicable_edition_selected": textbook.get("current_applicable_edition_selected"),
        "current_nctb_approval_verified": textbook.get("current_nctb_approval_verified"),
        "textbook_bytes_obtained": textbook.get("textbook_bytes_obtained"),
        "textbook_sha256": textbook.get("file_sha256"),
        "chapter01_textbook_page_range": textbook.get("chapter01_page_range"),
        "published_lessons": len(lessons),
        "lessons_with_mcq": mcq_count,
        "lessons_with_cq": cq_count,
        "topic_map_entries": len(topic_ids),
        "topic_status_counts": dict(status_counter),
        "incomplete_topics": incomplete,
        "provisional_gap_buckets": sorted(bucket_ids),
        "textbook_page_bindings": len(binding_ids),
        "gap_consolidation_status": architecture.get("gap_consolidation_status"),
        "deterministic_sequence_authorized": architecture.get("deterministic_sequence_authorized"),
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
