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

EXPECTED_BASE = "8771910b7a11adca87ba495d14b4124d61a8657b"
EXPECTED_VERSION = "CONV-03C01-1.0.0"
EXPECTED_PAGES = [31, 32, 33]
EXPECTED_TOPIC_IDS = {
    "cell-wall","plasmalemma","cytoplasm","ribosome","endoplasmic-reticulum",
    "golgi-apparatus","mitochondrion","chloroplast","lysosome","vacuole",
    "centriole-microtubule","nucleus-nucleolus-chromatin-chromosome",
    "cell-chemical-components","prokaryotic-eukaryotic-comparison",
    "unicellular-multicellular-organization","cell-size-shape-inclusions",
    "cell-theory-history","microscopy-mounting-drawing",
    "organelle-structure-function","practical-applied-observation",
}
ALL_AUTHORIZED_GAPS = {
    "gap-01-cell-wall","gap-02-chloroplast","gap-03-vacuole",
    "gap-04-centriole-microtubule","gap-05-nuclear-components",
    "gap-06-cell-chemical-components","gap-07-prokaryotic-eukaryotic-comparison",
    "gap-08-cell-size-shape-inclusions","gap-09-cell-discovery-history",
    "gap-10-microscopy-mounting-drawing","gap-11-chapter-practical-integration",
}
EXPECTED_REMAINING_GAPS = ALL_AUTHORIZED_GAPS - {"gap-01-cell-wall", "gap-03-vacuole"}
EXPECTED_AUTHORING_ACTIONS = {
    "expand-bot-01","bot-07","bot-08","bot-09","bot-10","bot-11","bot-12","bot-pr01"
}
EXPECTED_LESSON_IDS = [f"bot-0{i}" for i in range(1, 8)]
ALLOWED_MAP_STATUS = {"covered", "partial", "missing"}
ALLOWED_ACTION_STATUS = {"authorized", "implemented-candidate", "implemented-certified"}

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

def main():
    scope = load_json(SCOPE)
    course = load_json(COURSE_CONTRACT)

    require(scope.get("schema") == "lbfl-hsc-botany-chapter01-scope-v1", "Unexpected scope schema")
    require(scope.get("version") == EXPECTED_VERSION, "Unexpected CONV-03C-01 scope version")
    base = scope.get("authorized_base_sha", "")
    require(bool(SHA40.fullmatch(base)), "authorized_base_sha must be a lowercase 40-character SHA")
    require(base == EXPECTED_BASE, f"Authorized base drift: {base}")
    require(scope.get("state") == "learner-content-in-progress", "Unexpected Chapter-01 state")
    require(scope.get("strict_child_authorized") is False, "Chapter 01 must remain non-strict")
    require(scope.get("missing_lesson_authoring_authorized") is True, "Learner-content authoring authority must remain enabled")

    parent = next((x for x in course.get("pathways", []) if isinstance(x, dict) and x.get("course_id") == scope.get("parent_course_id")), None)
    require(parent is not None, "HSC Botany parent missing from academic course contract")
    if parent:
        require(parent.get("enforcement") == "progressive", "HSC Botany parent must remain progressive")
        require(parent.get("status") == "convergence-pending", "HSC Botany parent must remain convergence-pending")

    gateway = ROOT / scope.get("gateway_file", "")
    require(gateway.is_file(), "Chapter gateway missing")
    gateway_text = gateway.read_text(encoding="utf-8") if gateway.is_file() else ""
    require(fm_scalar(gateway_text, "permalink") == scope.get("canonical_route"), "Chapter canonical route mismatch")
    require(fm_scalar(gateway_text, "contract_state") == "convergence-pending", "Chapter contract_state must remain convergence-pending")
    require(fm_scalar(gateway_text, "chapter_completion") == "not-certified", "Chapter completion must remain not-certified")
    require(fm_scalar(gateway_text, "source_scope") == "NCTB curriculum 2012 pp.31-33", "Chapter source_scope drift")
    require("/biology/hsc-corner/botany/lecture-07-cell-wall-vacuole/" in gateway_text, "Chapter gateway must expose Lecture 07")

    curriculum = scope.get("primary_curriculum_custody", {})
    require(curriculum.get("obtained") is True, "Primary NCTB curriculum custody must remain true")
    require(curriculum.get("pdf_page_range") == EXPECTED_PAGES, "NCTB Chapter-01 pages must remain 31–33")
    require(curriculum.get("allocated_periods") == 25, "NCTB Chapter-01 allocation must remain 25 periods")

    policy = scope.get("authoring_authority_policy", {})
    require(policy.get("model") == "curriculum-bound-edition-neutral", "Authoring model must remain edition-neutral")
    require(policy.get("learner_content_authoring_authorized") is True, "Learner-content authoring must remain authorized")
    require(policy.get("textbook_specific_wording_or_page_claims_authorized") is False, "Textbook-specific claims must remain blocked")

    lessons = scope.get("published_lessons", [])
    ids = [x.get("lesson_id") for x in lessons]
    orders = [x.get("order") for x in lessons]
    require(ids == EXPECTED_LESSON_IDS, f"Published lesson identity/order drift: {ids}")
    require(orders == list(range(1, 8)), f"Published lesson order drift: {orders}")
    mcq_count = cq_count = 0
    for lesson in lessons:
        lid = lesson.get("lesson_id")
        path = ROOT / lesson.get("source_file", "")
        require(path.is_file(), f"{lid}: source file missing")
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        require(fm_scalar(text, "permalink") == lesson.get("route"), f"{lid}: permalink mismatch")
        has_mcq = bool(re.search(r"data-lbfl-quiz|Interactive MCQ Practice|MCQ Practice", text, re.I))
        has_cq = bool(re.search(r"CQ Practice|Creative Question|সৃজনশীল", text, re.I))
        require(has_mcq == bool(lesson.get("mcq")), f"{lid}: MCQ evidence mismatch")
        require(has_cq == bool(lesson.get("cq")), f"{lid}: CQ evidence mismatch")
        mcq_count += int(has_mcq)
        cq_count += int(has_cq)

    topic_map = scope.get("topic_lesson_map", [])
    topic_ids = [x.get("topic_id") for x in topic_map]
    require(set(topic_ids) == EXPECTED_TOPIC_IDS, "NCTB topic-map identity drift")
    require(len(topic_ids) == len(set(topic_ids)), "Duplicate topic_id in topic map")
    remaining_gaps = set()
    status_counts = Counter()
    for item in topic_map:
        tid = item.get("topic_id")
        status = item.get("status")
        status_counts[status] += 1
        require(status in ALLOWED_MAP_STATUS, f"{tid}: invalid status {status!r}")
        require(item.get("source_pages") == EXPECTED_PAGES, f"{tid}: source pages drift")
        if status == "covered":
            require(item.get("gap_id") is None, f"{tid}: covered topic cannot retain gap_id")
            require(item.get("missing_lesson_requirement") == "none", f"{tid}: covered topic cannot require a missing lesson")
        else:
            gap = item.get("gap_id")
            require(gap in ALL_AUTHORIZED_GAPS, f"{tid}: invalid gap_id")
            remaining_gaps.add(gap)

    require(remaining_gaps == EXPECTED_REMAINING_GAPS, f"Remaining gap set mismatch: {sorted(remaining_gaps)}")
    for tid in ("cell-wall", "vacuole"):
        item = next((x for x in topic_map if x.get("topic_id") == tid), None)
        require(item is not None and item.get("status") == "covered", f"{tid}: CONV-03C-01 must close this topic")
        require(item is not None and item.get("existing_lessons") == ["bot-07"], f"{tid}: must map exclusively to bot-07")

    buckets = scope.get("provisional_missing_lesson_buckets", [])
    bucket_ids = {x.get("bucket_id") for x in buckets}
    require(bucket_ids == EXPECTED_REMAINING_GAPS, "Provisional gap buckets must match only remaining incomplete gaps")

    plan = scope.get("authoring_plan", [])
    action_ids = {x.get("action_id") for x in plan}
    require(action_ids == EXPECTED_AUTHORING_ACTIONS, "Authoring action set drift")
    all_plan_gaps = []
    bot07 = None
    for action in plan:
        require(action.get("authoring_status") in ALLOWED_ACTION_STATUS, f"{action.get('action_id')}: invalid authoring status")
        all_plan_gaps.extend(action.get("gap_ids", []))
        if action.get("action_id") == "bot-07":
            bot07 = action
    require(set(all_plan_gaps) == ALL_AUTHORIZED_GAPS, "Authoring-plan historical gap coverage drift")
    require(len(all_plan_gaps) == len(set(all_plan_gaps)), "Each original gap must map to exactly one authoring action")
    require(bot07 is not None and bot07.get("authoring_status") in {"implemented-candidate","implemented-certified"}, "bot-07 must be implemented")
    if bot07:
        require(bot07.get("topic_ids") == ["cell-wall", "vacuole"], "bot-07 topic mapping drift")
        impl = bot07.get("implementation", {})
        require(impl.get("source_file") == "_biology/hsc-corner/botany/lecture-07-cell-wall-vacuole.md", "bot-07 source_file mismatch")
        require(impl.get("route") == "/biology/hsc-corner/botany/lecture-07-cell-wall-vacuole/", "bot-07 route mismatch")
        require(impl.get("exact_head_certification_required") is True, "bot-07 exact-head certification requirement missing")

    implementations = scope.get("content_implementations", [])
    bot07_impl = next((x for x in implementations if x.get("lesson_id") == "bot-07"), None)
    require(bot07_impl is not None, "bot-07 content implementation record missing")
    if bot07_impl:
        require(bot07_impl.get("closed_gap_ids") == ["gap-01-cell-wall","gap-03-vacuole"], "bot-07 closed-gap record mismatch")
        require(bot07_impl.get("mcq_count") == 10, "bot-07 MCQ count contract must be 10")
        require(bot07_impl.get("cq_count") == 3, "bot-07 CQ count contract must be 3")
        require(bot07_impl.get("scientific_reference_minimum") == 2, "bot-07 reference minimum must remain 2")
        require(bot07_impl.get("academic_review_file") == "docs/academic/CONV-03C01_BOT07_CONTENT_REVIEW.md", "bot-07 academic review file mismatch")
        require(bot07_impl.get("status") in {"candidate-exact-head-certification-required","exact-head-certified"}, "bot-07 implementation status invalid")

    assessment = scope.get("assessment_audit", {})
    require(assessment.get("published_lessons") == 7, "Assessment lesson count must be 7")
    require(assessment.get("lessons_with_mcq") == mcq_count == 7, "MCQ coverage must be 7/7")
    require(assessment.get("lessons_with_cq") == cq_count == 7, "CQ coverage must be 7/7")
    require(assessment.get("chapter_completion_assessment_authorized") is False, "Chapter-completion assessment must remain unauthorized")

    remaining_field = set(scope.get("remaining_curriculum_gaps", []))
    require(remaining_field == EXPECTED_REMAINING_GAPS, "remaining_curriculum_gaps field mismatch")

    architecture = scope.get("lesson_architecture_authorization", {})
    require(architecture.get("strict_release_authorized") is False, "Strict release must remain blocked")
    require(architecture.get("missing_lesson_authoring_authorized") is True, "Further learner-content authoring must remain authorized")

    report = {
        "schema": scope.get("schema"),
        "version": scope.get("version"),
        "authorized_base_sha": base,
        "published_lessons": len(lessons),
        "lessons_with_mcq": mcq_count,
        "lessons_with_cq": cq_count,
        "topic_map_entries": len(topic_ids),
        "topic_status_counts": dict(status_counts),
        "closed_by_bot07": ["gap-01-cell-wall", "gap-03-vacuole"],
        "remaining_curriculum_gaps": sorted(remaining_gaps),
        "remaining_gap_count": len(remaining_gaps),
        "strict_child_authorized": scope.get("strict_child_authorized"),
        "chapter_completion": fm_scalar(gateway_text, "chapter_completion"),
        "result": "PASS" if not errors else "FAIL",
        "errors": errors,
        "warnings": warnings,
    }
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
