#!/usr/bin/env python3
import json
import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = "cc10f1cb60828be6d8aac145ecc6964c845ac71b"
PHASE = "CONV-04E-02"
AUTH = ROOT / "_data" / "academic" / "conv04e_bot08_authorization_v1.json"
CONTRACT = ROOT / "_data" / "academic" / "conv04e_bot08_content_v1.json"
LESSON = ROOT / "_biology" / "hsc-corner" / "botany" / "lecture-08-plastid-chloroplast.md"
BOT07 = ROOT / "_biology" / "hsc-corner" / "botany" / "lecture-07-cell-wall-vacuole.md"
INDEX = ROOT / "_biology" / "hsc-corner" / "botany" / "index.md"
CHAPTER = ROOT / "_biology" / "hsc-corner" / "botany" / "chapter-01-cell-and-its-structure.md"
SCOPE = ROOT / "_data" / "academic" / "hsc_botany_chapter01_scope_v1.json"
LEDGER = ROOT / "docs" / "academic" / "conv04" / "ACADEMIC_ROUTE_LEDGER.json"
REVIEW = ROOT / "docs" / "academic" / "conv04" / "BOT08_CONTENT_REVIEW.md"
STATE = ROOT / "docs" / "academic" / "conv04" / "CONV04_STATE.md"

ROUTE = "/biology/hsc-corner/botany/lecture-08-plastid-chloroplast/"
GAP = "gap-02-chloroplast"
TOPIC = "chloroplast"
REQUIRED_URLS = {
    "https://nctb.gov.bd/pages/files/6922dbc6933eb65569e0c702",
    "https://www.ncbi.nlm.nih.gov/books/NBK9905/",
    "https://www.ncbi.nlm.nih.gov/books/NBK26819/",
    "https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells",
    "https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis",
}
REQUIRED_TERMS = [
    "plastid","proplastid","chloroplast","chromoplast","leucoplast",
    "outer membrane","inner membrane","stroma","thylakoid","granum","grana",
    "stroma lamella","thylakoid lumen","chlorophyll","photosynthesis",
    "light-dependent reactions","calvin","chloroplast dna","ribosome",
    "endosymbiosis","mesophyll"
]

BOOTSTRAP_FILES = sorted([
    ".github/scripts/conv04e-bot08-browser-certification.mjs",
    ".github/workflows/hsc-botany-bot08-content-certification.yml",
    "_biology/hsc-corner/botany/chapter-01-cell-and-its-structure.md",
    "_biology/hsc-corner/botany/index.md",
    "_biology/hsc-corner/botany/lecture-07-cell-wall-vacuole.md",
    "_biology/hsc-corner/botany/lecture-08-plastid-chloroplast.md",
    "_data/academic/conv04e_bot08_authorization_v1.json",
    "_data/academic/conv04e_bot08_content_v1.json",
    "_data/academic/hsc_botany_chapter01_scope_v1.json",
    "docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json",
    "docs/academic/conv04/BOT08_AUTHORIZATION.md",
    "docs/academic/conv04/BOT08_CONTENT_REVIEW.md",
    "docs/academic/conv04/CONV04_STATE.md",
    "scripts/academic/validate_botany_bot08_content.py",
    "scripts/academic/validate_botany_chapter01_scope.py",
])

IMMUTABLE_E02 = {
    ".github/scripts/conv04e-bot08-browser-certification.mjs",
    ".github/workflows/hsc-botany-bot08-content-certification.yml",
    "_data/academic/conv04e_bot08_authorization_v1.json",
    "_data/academic/conv04e_bot08_content_v1.json",
    "docs/academic/conv04/BOT08_AUTHORIZATION.md",
    "docs/academic/conv04/BOT08_CONTENT_REVIEW.md",
    "scripts/academic/validate_botany_bot08_content.py",
}

errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"Unable to parse {path.relative_to(ROOT)}: {exc}")
        return {}

def text(path):
    try:
        return path.read_text(encoding="utf-8")
    except Exception as exc:
        errors.append(f"Unable to read {path.relative_to(ROOT)}: {exc}")
        return ""

def fm_scalar(source, key):
    if not source.startswith("---"):
        return None
    parts = re.split(r"^---\s*$", source, maxsplit=2, flags=re.M)
    front = parts[1] if len(parts) > 2 else ""
    m = re.search(rf"(?m)^{re.escape(key)}:\s*['\"]?([^'\"\n]+)", front)
    return m.group(1).strip() if m else None

def fm_list(source, key):
    if not source.startswith("---"):
        return []
    parts = re.split(r"^---\s*$", source, maxsplit=2, flags=re.M)
    front = parts[1] if len(parts) > 2 else ""
    m = re.search(rf"(?m)^{re.escape(key)}:\s*\n((?:- [^\n]+\n?)+)", front)
    return [line[2:].strip() for line in m.group(1).splitlines() if line.startswith("- ")] if m else []

def git(*args):
    return subprocess.run(["git","-C",str(ROOT),*args], text=True, capture_output=True)

def phase_order(value):
    m = re.fullmatch(r"CONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?", value or "")
    return None if not m else (ord(m.group(1)), int(m.group(2) or 0), int(m.group(3) or 0))

def main():
    for path in [AUTH,CONTRACT,LESSON,BOT07,INDEX,CHAPTER,SCOPE,LEDGER,REVIEW,STATE]:
        require(path.is_file(), f"Missing E-02 artifact: {path.relative_to(ROOT)}")

    auth = load_json(AUTH)
    contract = load_json(CONTRACT)
    scope = load_json(SCOPE)
    ledger = load_json(LEDGER)
    lesson = text(LESSON)
    bot07 = text(BOT07)
    index = text(INDEX)
    chapter = text(CHAPTER)
    review = text(REVIEW)
    state = text(STATE)

    require(auth.get("schema") == "lbfl-conv04e-bot08-authorization-v1", "BOT-08 authorization schema drift")
    require(auth.get("authorized_base") == BASE, "BOT-08 historical authorized base drift")
    require(auth.get("status") == "authorized-not-implemented", "Historical BOT-08 authorization record must remain immutable")
    require(contract.get("schema") == "lbfl-conv04e-bot08-content-contract-v1", "BOT-08 content-contract schema drift")
    require(contract.get("authorized_base") == BASE, "BOT-08 content-contract base drift")
    require(contract.get("status") == "content-contract-locked-before-authoring", "Historical BOT-08 content contract must remain immutable")

    require(fm_scalar(lesson,"permalink") == ROUTE, "BOT-08 permalink mismatch")
    require(fm_scalar(lesson,"lesson_order") == "8", "BOT-08 lesson_order must be 8")
    require(fm_scalar(lesson,"academic_system") == "v1", "BOT-08 academic_system must be v1")
    require(fm_scalar(lesson,"academic_role") == "lecture", "BOT-08 academic_role must be lecture")
    require(fm_scalar(lesson,"lang") == "bn", "BOT-08 lang must be bn")
    require(fm_scalar(lesson,"language") == "bn", "BOT-08 legacy language must agree with lang")
    require(fm_scalar(lesson,"learning_guide") == "canonical", "BOT-08 Learning Guide ownership must be canonical")
    require(fm_scalar(lesson,"authoring_model") == "curriculum-bound-edition-neutral", "BOT-08 authoring model drift")
    require(fm_scalar(lesson,"source_scope") == "NCTB curriculum 2012 pp.31-33", "BOT-08 source scope drift")
    require(set(fm_list(lesson,"nctb_topic_ids")) == {TOPIC}, "BOT-08 topic mapping must be chloroplast only")
    require(set(fm_list(lesson,"gap_ids")) == {GAP}, "BOT-08 gap mapping must close chloroplast gap only")
    require(lesson.count("{% include education/learning-guide-cta.html %}") == 1, "BOT-08 must render exactly one canonical Learning Guide CTA")
    require("<style" not in lesson.lower() and " style=" not in lesson.lower(), "BOT-08 must not contain local style debt")
    require("<script" not in lesson.lower(), "BOT-08 must not embed a JavaScript quiz/runtime")
    require("data-lbfl-quiz" not in lesson and "lbfl-mcq-card" not in lesson and "Interactive MCQ Practice" not in lesson, "BOT-08 must not embed a full MCQ bank/runtime")

    lower = lesson.lower()
    for term in REQUIRED_TERMS:
        require(term in lower, f"BOT-08 missing required concept: {term}")
    urls = set(re.findall(r'https?://[^"\s<)]+', lesson))
    require(REQUIRED_URLS.issubset(urls), "BOT-08 exact provenance/reference set incomplete")
    require("named private hsc biology textbook edition-এর exact wording বা page number" in lower, "BOT-08 private-textbook non-claim boundary missing")

    require(len(re.findall(r'data-bot08-mcq="[1-4]"', lesson)) == 4, "BOT-08 must contain exactly four short retrieval MCQs")
    require(len(re.findall(r'data-bot08-cq="[1-2]"', lesson)) == 2, "BOT-08 must contain exactly two CQ practice prompts")
    require("MCQ Practice" in lesson, "BOT-08 short MCQ retrieval heading missing")
    require("CQ Practice" in lesson, "BOT-08 CQ practice heading missing")

    require(ROUTE in index, "Botany gateway must expose BOT-08")
    require("active-chapter-01-lessons: 01-08" in index, "Botany active lesson marker must be 01-08")
    require("আটটি সক্রিয় পাঠ" in index, "Botany visible active lesson count must be eight")
    require(ROUTE in chapter, "Chapter-01 gateway must expose BOT-08")
    require(ROUTE in bot07, "BOT-07 must link forward to BOT-08")
    require("/biology/hsc-corner/botany/lecture-07-cell-wall-vacuole/" in lesson, "BOT-08 must link back to BOT-07")
    require("/biology/hsc-corner/botany/chapter-01-cell-and-its-structure/" in lesson, "BOT-08 must link to Chapter 01")

    published = next((x for x in scope.get("published_lessons",[]) if x.get("lesson_id")=="bot-08"), None)
    require(published is not None, "Scope published_lessons missing BOT-08")
    if published:
        require(published.get("order") == 8, "Scope BOT-08 order mismatch")
        require(published.get("source_file") == "_biology/hsc-corner/botany/lecture-08-plastid-chloroplast.md", "Scope BOT-08 source mismatch")
        require(published.get("route") == ROUTE, "Scope BOT-08 route mismatch")
        require(published.get("mcq") is True and published.get("cq") is True, "Scope BOT-08 MCQ/CQ evidence flags missing")

    chloroplast = next((x for x in scope.get("topic_lesson_map",[]) if x.get("topic_id")==TOPIC), None)
    require(chloroplast is not None and chloroplast.get("status")=="covered", "Chloroplast topic must be covered")
    require(chloroplast is not None and chloroplast.get("existing_lessons")==["bot-08"], "Chloroplast topic must map to BOT-08")
    require(chloroplast is not None and chloroplast.get("gap_id") is None, "Closed chloroplast topic cannot retain gap_id")
    require(GAP not in set(scope.get("remaining_curriculum_gaps",[])), "gap-02-chloroplast must be absent from remaining gaps")

    action = next((x for x in scope.get("authoring_plan",[]) if x.get("action_id")=="bot-08"), None)
    require(action is not None and action.get("authoring_status") in {"implemented-candidate","implemented-certified"}, "BOT-08 authoring action must be implemented")
    impl = next((x for x in scope.get("content_implementations",[]) if x.get("lesson_id")=="bot-08"), None)
    require(impl is not None, "BOT-08 implementation record missing")
    if impl:
        require(impl.get("closed_gap_ids")==[GAP], "BOT-08 may close only gap-02-chloroplast")
        require(impl.get("mcq_count")==4 and impl.get("cq_count")==2, "BOT-08 assessment counts must be 4 short MCQ / 2 CQ")
        require(impl.get("academic_review_file")=="docs/academic/conv04/BOT08_CONTENT_REVIEW.md", "BOT-08 academic review identity drift")
        require(impl.get("scientific_reference_minimum",0) >= 2, "BOT-08 scientific reference minimum missing")

    route = next((x for x in ledger.get("routes",[]) if x.get("id")=="hsc-botany-lecture-08"), None)
    require(route is not None, "Academic Route Ledger missing BOT-08")
    if route:
        require(route.get("canonical_route")==ROUTE, "BOT-08 ledger route drift")
        require(route.get("academic_role")=="lecture", "BOT-08 ledger role drift")
        require(route.get("language")=="bn", "BOT-08 ledger language drift")
        require(route.get("boundary_owner")=="layout", "BOT-08 boundary owner drift")
        require(route.get("learning_guide_owner")=="canonical", "BOT-08 Learning Guide owner drift")
        require(route.get("assessment_owner")=="mcq-arena", "BOT-08 assessment owner drift")
        require(route.get("enforcement")=="strict", "BOT-08 must remain a strict Academic-v1 surface")
        require(not route.get("source_debt") and not route.get("live_debt"), "BOT-08 strict route cannot carry debt")

    require("ACADEMIC CONTENT REVIEW: PASS" in review, "BOT-08 academic review must record PASS")

    mode = os.getenv("CERTIFICATION_MODE","local")
    comparison_base = os.getenv("PR_BASE_SHA","").strip()
    if not comparison_base:
        r = git("rev-parse","HEAD^")
        comparison_base = r.stdout.strip() if r.returncode == 0 else BASE
    bootstrap = mode == "pull_request" and comparison_base == BASE
    future = mode == "pull_request" and comparison_base != BASE

    diff = git("diff","--name-only",f"{comparison_base}...HEAD")
    if diff.returncode == 0:
        changed = sorted([x for x in diff.stdout.splitlines() if x.strip()])
        if bootstrap:
            require(changed == BOOTSTRAP_FILES, f"E-02 bootstrap changed-file scope mismatch: {changed}")
        elif future:
            require(not (set(changed) & IMMUTABLE_E02), f"Future phase changed immutable E-02 artifacts: {sorted(set(changed)&IMMUTABLE_E02)}")
    else:
        errors.append("Unable to inspect E-02 changed-file scope")

    if bootstrap:
        require(fm_scalar(chapter,"contract_state")=="convergence-pending", "E-02 bootstrap must keep Chapter 01 convergence-pending")
        require(fm_scalar(chapter,"chapter_completion")=="not-certified", "E-02 bootstrap must keep Chapter 01 not-certified")
        expected_remaining=set(auth.get("baseline",{}).get("remaining_curriculum_gaps",[]))-{GAP}
        require(set(scope.get("remaining_curriculum_gaps",[]))==expected_remaining, "E-02 bootstrap changed an unauthorized curriculum gap")
        require(scope.get("assessment_audit",{}).get("published_lessons")==8, "E-02 bootstrap assessment lesson count must be 8")
        require(scope.get("assessment_audit",{}).get("lessons_with_mcq")==8, "E-02 bootstrap MCQ coverage must be 8/8")
        require(scope.get("assessment_audit",{}).get("lessons_with_cq")==8, "E-02 bootstrap CQ coverage must be 8/8")
        require(PHASE in state, "E-02 bootstrap state phase missing")
        allow = [
            "_biology/hsc-corner/botany/lecture-08-plastid-chloroplast.md",
            "_biology/hsc-corner/botany/lecture-07-cell-wall-vacuole.md",
            "_biology/hsc-corner/botany/index.md",
            "_biology/hsc-corner/botany/chapter-01-cell-and-its-structure.md",
        ]
        for p in allow:
            require(f"  - {p}" in state, f"E-02 learner authority missing: {p}")

    if future and "docs/academic/conv04/CONV04_STATE.md" in (diff.stdout.splitlines() if diff.returncode==0 else []):
        base_state = git("show",f"{comparison_base}:docs/academic/conv04/CONV04_STATE.md")
        if base_state.returncode == 0:
            base_phase = re.search(r"(?m)^phase:\s*(\S+)",base_state.stdout)
            cand_phase = re.search(r"(?m)^phase:\s*(\S+)",state)
            bo = phase_order(base_phase.group(1) if base_phase else "")
            co = phase_order(cand_phase.group(1) if cand_phase else "")
            require(bo is not None and co is not None and co > bo, "Future phase must advance CONV04_STATE monotonically")
        else:
            errors.append("Unable to authenticate base CONV04_STATE in retained E-02 mode")

    report = {
        "schema":"lbfl-conv04e-bot08-certification-v1",
        "phase":PHASE,
        "route":ROUTE,
        "short_retrieval_mcq_count":len(re.findall(r'data-bot08-mcq="[1-4]"', lesson)),
        "cq_count":len(re.findall(r'data-bot08-cq="[1-2]"', lesson)),
        "gap_closed":GAP not in set(scope.get("remaining_curriculum_gaps",[])),
        "academic_review_pass":"ACADEMIC CONTENT REVIEW: PASS" in review,
        "future_phase_compatible":True,
        "result":"PASS" if not errors else "FAIL",
        "errors":errors,
    }
    (ROOT/"conv04e-bot08-report.json").write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(json.dumps(report,indent=2,ensure_ascii=False))
    return 1 if errors else 0

if __name__ == "__main__":
    raise SystemExit(main())
