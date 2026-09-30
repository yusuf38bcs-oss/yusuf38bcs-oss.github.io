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

EXPECTED_BASE = "8f306f14f0570df5bc46d65f91702984c3c4d692"
EXPECTED_VERSION = "CONV-03B2-2.0.0"
EXPECTED_CURRICULUM_INDEX = "https://nctb.gov.bd/pages/files/6922dbc6933eb65569e0c702"
EXPECTED_CURRICULUM_PDF = "https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-nctb/2024/12/ca39e59575134a74b26a35b760d193eb.pdf"
EXPECTED_CURRENT_TEXTBOOK_PAGE = "https://nctb.gov.bd/pages/static-pages/6922e145933eb65569e2b37b"
EXPECTED_PAGES = [31, 32, 33]
EXPECTED_COMMON_BOOKS = {
    "সাহিত্যপাঠ",
    "সহপাঠ",
    "English for Today",
    "তথ্য ও যোগাযোগ প্রযুক্তি",
    "তথ্য ও যোগাযোগ প্রযুক্তি (ইংলিশ ভার্সন)",
}
EXPECTED_TOPIC_IDS = {
    "cell-wall","plasmalemma","cytoplasm","ribosome","endoplasmic-reticulum",
    "golgi-apparatus","mitochondrion","chloroplast","lysosome","vacuole",
    "centriole-microtubule","nucleus-nucleolus-chromatin-chromosome",
    "cell-chemical-components","prokaryotic-eukaryotic-comparison",
    "unicellular-multicellular-organization","cell-size-shape-inclusions",
    "cell-theory-history","microscopy-mounting-drawing",
    "organelle-structure-function","practical-applied-observation",
}
EXPECTED_GAPS = {
    "gap-01-cell-wall","gap-02-chloroplast","gap-03-vacuole",
    "gap-04-centriole-microtubule","gap-05-nuclear-components",
    "gap-06-cell-chemical-components","gap-07-prokaryotic-eukaryotic-comparison",
    "gap-08-cell-size-shape-inclusions","gap-09-cell-discovery-history",
    "gap-10-microscopy-mounting-drawing","gap-11-chapter-practical-integration",
}
EXPECTED_AUTHORING_ACTIONS = {
    "expand-bot-01","bot-07","bot-08","bot-09","bot-10","bot-11","bot-12","bot-pr01"
}
ALLOWED_MAP_STATUS = {"covered", "partial", "missing"}

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

def frontmatter_value(text, key):
    match = re.search(rf"(?m)^{re.escape(key)}:\s*['\"]?([^'\"\n]+)", text)
    return match.group(1).strip() if match else None

def main():
    scope = load_json(SCOPE)
    contract = load_json(COURSE_CONTRACT)

    require(scope.get("schema") == "lbfl-hsc-botany-chapter01-scope-v1", "Unexpected scope schema")
    require(scope.get("version") == EXPECTED_VERSION, "Unexpected CONV-03B.2 version")
    base = scope.get("authorized_base_sha", "")
    require(bool(SHA40.fullmatch(base)), "authorized_base_sha must be a 40-character lowercase SHA")
    require(base == EXPECTED_BASE, f"Authorized base drift: {base}")
    require(scope.get("state") == "curriculum-authoring-authorized-textbook-alignment-pending", "Unexpected state")
    require(scope.get("strict_child_authorized") is False, "Strict Chapter-01 promotion must remain unauthorized")
    require(scope.get("missing_lesson_authoring_authorized") is True, "Edition-neutral missing-lesson authoring must be authorized")

    parent_id = scope.get("parent_course_id")
    parent = next((x for x in contract.get("pathways", []) if isinstance(x, dict) and x.get("course_id") == parent_id), None)
    require(parent is not None, f"Parent course not registered: {parent_id}")
    if parent:
        require(parent.get("enforcement") == "progressive", "HSC Botany parent must remain progressive")
        require(parent.get("status") == "convergence-pending", "HSC Botany parent must remain convergence-pending")

    gateway = ROOT / scope.get("gateway_file", "")
    require(gateway.is_file(), "Chapter gateway missing")
    gateway_text = gateway.read_text(encoding="utf-8") if gateway.is_file() else ""
    require(frontmatter_value(gateway_text, "permalink") == scope.get("canonical_route"), "Chapter route mismatch")
    require(frontmatter_value(gateway_text, "contract_state") == "convergence-pending", "Gateway contract_state drift")
    require(frontmatter_value(gateway_text, "chapter_completion") == "not-certified", "Gateway cannot claim chapter completion")
    require(frontmatter_value(gateway_text, "source_scope") == "NCTB curriculum 2012 pp.31-33", "Gateway source scope drift")

    curriculum = scope.get("primary_curriculum_custody", {})
    require(curriculum.get("obtained") is True, "Primary NCTB curriculum custody must remain true")
    require(curriculum.get("official_index_url") == EXPECTED_CURRICULUM_INDEX, "NCTB curriculum index mismatch")
    require(curriculum.get("official_pdf_url") == EXPECTED_CURRICULUM_PDF, "NCTB Biology curriculum PDF mismatch")
    require(curriculum.get("pdf_page_range") == EXPECTED_PAGES, "NCTB Chapter-01 curriculum pages must remain 31-33")
    require(curriculum.get("allocated_periods") == 25, "NCTB Chapter-01 allocation must remain 25 periods")

    textbook = scope.get("primary_textbook_custody", {})
    require(textbook.get("custody_model") == "nctb-approved-private-hsc-textbook-optional-alignment", "Textbook custody model mismatch")
    require(textbook.get("official_current_textbook_page_url") == EXPECTED_CURRENT_TEXTBOOK_PAGE, "Current NCTB XI-XII textbook page mismatch")
    require(textbook.get("current_applicable_edition_selected") is False, "Do not silently select a private textbook edition")
    require(textbook.get("current_nctb_approval_verified") is False, "Do not claim current private-edition approval without evidence")
    require(textbook.get("textbook_bytes_obtained") is False, "Do not claim textbook bytes")
    require(textbook.get("file_sha256") is None, "Textbook SHA-256 must remain null without custody")
    require(textbook.get("chapter01_page_range") is None, "Private-textbook Chapter-01 pages must remain unset")
    require(textbook.get("required_before_missing_lesson_authoring") is False, "Private textbook custody must not block curriculum-bound authoring")
    require(textbook.get("required_before_textbook_specific_claims") is True, "Textbook custody must remain required for textbook-specific claims")
    require(textbook.get("role") == "optional-corroborative-alignment-not-normative-authoring-gate", "Textbook role mismatch")

    source = next((x for x in scope.get("source_evidence", []) if x.get("source_class") == "official-nctb-current-hsc-textbook-page"), None)
    require(source is not None, "Current official NCTB XI-XII textbook page evidence missing")
    if source:
        require(source.get("url") == EXPECTED_CURRENT_TEXTBOOK_PAGE, "Current textbook source URL mismatch")
        observed = set(source.get("observed_textbook_rows", []))
        require(observed == EXPECTED_COMMON_BOOKS, "Observed common textbook rows must match the five authenticated rows")
        require("জীববিজ্ঞান" not in observed and "Biology" not in observed, "Biology must not be represented as a current downloadable textbook row")

    policy = scope.get("authoring_authority_policy", {})
    require(policy.get("normative_scope_source") == "official-nctb-curriculum-pdf", "Normative scope source must be the official NCTB curriculum")
    require(policy.get("normative_scope_pages") == EXPECTED_PAGES, "Authoring authority pages must be 31-33")
    require(policy.get("model") == "curriculum-bound-edition-neutral", "Authoring model must be edition-neutral")
    require(policy.get("learner_content_authoring_authorized") is True, "Learner-content authoring must be authorized")
    require(policy.get("textbook_specific_wording_or_page_claims_authorized") is False, "Textbook-specific claims must remain blocked")
    minimum = set(policy.get("minimum_authoring_evidence", []))
    require("exact NCTB curriculum topic_id mapping" in minimum, "NCTB topic mapping requirement missing")
    require("at least two authoritative biology references for substantive scientific claims" in minimum, "Two-reference scientific evidence rule missing")
    require("LBFL academic review before merge" in minimum, "Academic review requirement missing")

    lessons = scope.get("published_lessons", [])
    require(len(lessons) == 6, "Exactly six existing published lessons must remain")
    ids, orders = [], []
    mcq_count = cq_count = 0
    for lesson in lessons:
        lid = lesson.get("lesson_id")
        ids.append(lid); orders.append(lesson.get("order"))
        path = ROOT / lesson.get("source_file", "")
        require(path.is_file(), f"{lid}: source file missing")
        if not path.is_file():
            continue
        txt = path.read_text(encoding="utf-8")
        require(frontmatter_value(txt, "permalink") == lesson.get("route"), f"{lid}: route mismatch")
        has_mcq = bool(re.search(r"data-lbfl-quiz|Interactive MCQ Practice|MCQ Practice", txt, re.I))
        has_cq = bool(re.search(r"CQ Practice|Creative Question|সৃজনশীল", txt, re.I))
        require(has_mcq == bool(lesson.get("mcq")), f"{lid}: MCQ evidence mismatch")
        require(has_cq == bool(lesson.get("cq")), f"{lid}: CQ evidence mismatch")
        mcq_count += int(has_mcq); cq_count += int(has_cq)
    require(ids == [f"bot-0{i}" for i in range(1,7)], "Existing lesson IDs/order drift")
    require(orders == list(range(1,7)), "Existing lesson order drift")

    topic_map = scope.get("topic_lesson_map", [])
    topic_ids = [x.get("topic_id") for x in topic_map]
    require(set(topic_ids) == EXPECTED_TOPIC_IDS, "NCTB topic map drift")
    require(len(topic_ids) == len(set(topic_ids)), "Duplicate topic IDs")
    gap_ids = set()
    status_counts = Counter()
    for item in topic_map:
        status = item.get("status")
        status_counts[status] += 1
        require(status in ALLOWED_MAP_STATUS, f"{item.get('topic_id')}: invalid status")
        require(item.get("source_pages") == EXPECTED_PAGES, f"{item.get('topic_id')}: curriculum pages drift")
        if status == "covered":
            require(item.get("gap_id") is None, f"{item.get('topic_id')}: covered topic cannot carry gap")
        else:
            gap = item.get("gap_id")
            require(gap in EXPECTED_GAPS, f"{item.get('topic_id')}: invalid gap")
            gap_ids.add(gap)
    require(gap_ids == EXPECTED_GAPS, "All 11 incomplete curriculum gaps must remain explicit")

    buckets = scope.get("provisional_missing_lesson_buckets", [])
    bucket_ids = {x.get("bucket_id") for x in buckets}
    require(bucket_ids == EXPECTED_GAPS, "Gap bucket set drift")
    for bucket in buckets:
        require(bucket.get("architecture_status") == "provisional-not-authorized", f"{bucket.get('bucket_id')}: original bucket must remain provenance-only")

    plan = scope.get("authoring_plan", [])
    action_ids = {x.get("action_id") for x in plan}
    require(action_ids == EXPECTED_AUTHORING_ACTIONS, "Authoring action set drift")
    plan_gap_ids = []
    for action in plan:
        require(action.get("authoring_status") == "authorized", f"{action.get('action_id')}: authoring action not authorized")
        require(action.get("action") in {"expand-existing-lesson","create-new-lesson","create-practical-module"}, f"{action.get('action_id')}: invalid action type")
        plan_gap_ids.extend(action.get("gap_ids", []))
    require(set(plan_gap_ids) == EXPECTED_GAPS, "Authoring plan must cover all 11 gaps")
    require(len(plan_gap_ids) == len(set(plan_gap_ids)), "Each gap must map to exactly one authoring action")

    bindings = scope.get("textbook_page_gap_bindings", [])
    require({x.get("gap_id") for x in bindings} == EXPECTED_GAPS, "Optional textbook alignment ledger must retain all 11 gaps")
    for item in bindings:
        gid = item.get("gap_id")
        require(item.get("status") == "optional-textbook-alignment-pending", f"{gid}: textbook alignment status mismatch")
        require(item.get("textbook_page_start") is None and item.get("textbook_page_end") is None, f"{gid}: unverified textbook pages cannot be claimed")
        require(item.get("claim_mapping_verified") is False, f"{gid}: textbook mapping cannot be marked verified")

    architecture = scope.get("lesson_architecture_authorization", {})
    require(architecture.get("gap_consolidation_status") == "authorized-from-primary-curriculum", "Gap consolidation must be curriculum-authorized")
    require(architecture.get("final_lesson_count_status") == "authoring-baseline-authorized-not-strict-certified", "Lesson-count status mismatch")
    require(architecture.get("deterministic_sequence_authorized") is True, "Authoring sequence must be authorized")
    require(architecture.get("expansion_of_existing_lessons_authorized") is True, "Existing lesson expansion must be authorized")
    require(architecture.get("creation_of_new_lessons_authorized") is True, "New lesson creation must be authorized")
    require(architecture.get("missing_lesson_authoring_authorized") is True, "Architecture must authorize missing-lesson authoring")
    require(architecture.get("strict_release_authorized") is False, "Strict release must remain blocked until content exists and is certified")

    assessment = scope.get("assessment_audit", {})
    require(assessment.get("published_lessons") == 6, "Assessment lesson count mismatch")
    require(assessment.get("lessons_with_mcq") == mcq_count == 6, "Existing MCQ coverage must remain 6/6")
    require(assessment.get("lessons_with_cq") == cq_count == 6, "Existing CQ coverage must remain 6/6")
    require(assessment.get("chapter_completion_assessment_authorized") is False, "Chapter completion assessment remains unauthorized")

    promotion = scope.get("promotion_gate", {})
    require(promotion.get("require_primary_curriculum_custody") is True, "Primary curriculum custody gate missing")
    require(promotion.get("require_authoring_plan_coverage_all_gaps") is True, "Authoring-plan coverage gate missing")
    require(promotion.get("require_each_new_or_expanded_lesson_content_certification") is True, "Content certification gate missing")
    require(promotion.get("forbid_textbook_specific_claims_without_custody") is True, "Textbook-specific claim guard missing")
    require(promotion.get("textbook_alignment_optional_for_authoring") is True, "Textbook alignment must be optional for authoring")
    require(promotion.get("parent_hsc_botany_remains_progressive") is True, "Parent HSC Botany must remain progressive")

    report = {
        "schema": scope.get("schema"),
        "version": scope.get("version"),
        "authorized_base_sha": base,
        "primary_curriculum_custody": curriculum.get("obtained"),
        "current_common_textbook_rows": sorted(EXPECTED_COMMON_BOOKS),
        "private_textbook_selected": textbook.get("current_applicable_edition_selected"),
        "textbook_alignment_role": textbook.get("role"),
        "learner_content_authoring_authorized": policy.get("learner_content_authoring_authorized"),
        "textbook_specific_claims_authorized": policy.get("textbook_specific_wording_or_page_claims_authorized"),
        "published_lessons": len(lessons),
        "lessons_with_mcq": mcq_count,
        "lessons_with_cq": cq_count,
        "topic_map_entries": len(topic_ids),
        "topic_status_counts": dict(status_counts),
        "curriculum_gap_count": len(EXPECTED_GAPS),
        "authoring_actions": [x.get("action_id") for x in plan],
        "authoring_plan_gap_coverage": len(set(plan_gap_ids)),
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
