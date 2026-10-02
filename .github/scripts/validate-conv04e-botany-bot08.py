#!/usr/bin/env python3
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
LESSON=ROOT/"_biology/hsc-corner/botany/lecture-08-plastid-chloroplast.md"
SCOPE=ROOT/"_data/academic/hsc_botany_chapter01_scope_v1.json"
INDEX=ROOT/"_biology/hsc-corner/botany/index.md"
CHAPTER=ROOT/"_biology/hsc-corner/botany/chapter-01-cell-and-its-structure.md"
BOT07=ROOT/"_biology/hsc-corner/botany/lecture-07-cell-wall-vacuole.md"
REVIEW=ROOT/"docs/academic/CONV-04E02_BOT08_CONTENT_REVIEW.md"
MANIFEST=ROOT/"_data/academic/conv04e_botany_bot08_v1.json"
REPORT=ROOT/"conv04e-bot08-report.json"
ROUTE="/biology/hsc-corner/botany/lecture-08-plastid-chloroplast/"
SOURCES={
"https://www.ncbi.nlm.nih.gov/books/NBK9905/",
"https://www.ncbi.nlm.nih.gov/books/NBK26819/",
"https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells",
"https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis"}
errors=[]
def req(x,m):
    if not x: errors.append(m)
def fm(t,k):
    m=re.search(rf"(?m)^{re.escape(k)}:\s*['\"]?([^'\"\n]+)",t); return m.group(1).strip() if m else None
def fmlist(t,k):
    m=re.search(rf"(?m)^{re.escape(k)}:\s*\n((?:- [^\n]+\n?)+)",t)
    return [x[2:].strip() for x in m.group(1).splitlines() if x.startswith("- ")] if m else []
for p in [LESSON,SCOPE,INDEX,CHAPTER,BOT07,REVIEW,MANIFEST]:
    req(p.is_file(),f"Missing {p.relative_to(ROOT)}")
lesson=LESSON.read_text(encoding="utf-8") if LESSON.is_file() else ""
scope=json.loads(SCOPE.read_text(encoding="utf-8")) if SCOPE.is_file() else {}
index=INDEX.read_text(encoding="utf-8") if INDEX.is_file() else ""
chapter=CHAPTER.read_text(encoding="utf-8") if CHAPTER.is_file() else ""
bot07=BOT07.read_text(encoding="utf-8") if BOT07.is_file() else ""
review=REVIEW.read_text(encoding="utf-8") if REVIEW.is_file() else ""
req(fm(lesson,"permalink")==ROUTE,"BOT-08 route mismatch")
req(fm(lesson,"lesson_order")=="8","BOT-08 lesson_order must be 8")
req(fm(lesson,"authoring_model")=="curriculum-bound-edition-neutral","BOT-08 authoring model mismatch")
req(fm(lesson,"source_scope")=="NCTB curriculum 2012 pp.31-33","BOT-08 source_scope mismatch")
req(fm(lesson,"academic_system")=="v1","BOT-08 Academic-v1 activation missing")
req(fm(lesson,"academic_role")=="lecture","BOT-08 academic_role mismatch")
req(fm(lesson,"learning_guide")=="canonical","BOT-08 canonical Learning Guide ownership missing")
req(fm(lesson,"lang")=="bn" and fm(lesson,"language")=="bn","BOT-08 language metadata mismatch")
req(set(fmlist(lesson,"nctb_topic_ids"))=={"chloroplast"},"BOT-08 topic mapping mismatch")
req(set(fmlist(lesson,"gap_ids"))=={"gap-02-chloroplast"},"BOT-08 gap mapping mismatch")
req(lesson.count("{% include education/learning-guide-cta.html %}")==1,"BOT-08 must include exactly one Learning Guide CTA")
mcq=len(re.findall(r'class="lbfl-academic-card lbfl-mcq-card"',lesson))
cq=len(re.findall(r'class="lbfl-academic-card lbfl-cq-card"',lesson))
answers=re.findall(r'class="lbfl-academic-card lbfl-mcq-card" data-answer="([A-D])"',lesson)
req(mcq==10,f"BOT-08 MCQ count {mcq}, expected 10")
req(cq==3,f"BOT-08 CQ count {cq}, expected 3")
req(len(answers)==10,"BOT-08 answer-key count must be 10")
for i in range(1,11): req(len(re.findall(rf'name="bot08-q{i}"',lesson))==4,f"BOT-08 q{i} must have four options")
urls=set(re.findall(r'https?://[^"\s<]+',lesson))
req(SOURCES.issubset(urls),"BOT-08 authoritative scientific reference set incomplete")
for term in ["plastid","proplastid","chloroplast","thylakoid","granum","grana","stroma","chlorophyll","chromoplast","leucoplast","photosynthesis"]:
    req(term.lower() in lesson.lower(),f"BOT-08 missing concept: {term}")
req("exact wording" in lesson.lower() and "page number" in lesson.lower(),"BOT-08 private-textbook provenance boundary missing")
req("ACADEMIC CONTENT REVIEW: PASS" in review,"BOT-08 academic review PASS missing")
for url in SOURCES: req(url in review,f"Review missing {url}")
pub=next((x for x in scope.get("published_lessons",[]) if x.get("lesson_id")=="bot-08"),None)
req(pub is not None,"Scope missing BOT-08 published lesson")
if pub:
    req(pub.get("route")==ROUTE,"Scope BOT-08 route mismatch")
    req(pub.get("order")==8,"Scope BOT-08 order mismatch")
act=next((x for x in scope.get("authoring_plan",[]) if x.get("action_id")=="bot-08"),None)
req(act is not None and act.get("authoring_status") in {"implemented-candidate","implemented-certified"},"BOT-08 authoring action not implemented")
impl=next((x for x in scope.get("content_implementations",[]) if x.get("lesson_id")=="bot-08"),None)
req(impl is not None,"BOT-08 implementation record missing")
if impl:
    req(impl.get("closed_gap_ids")==["gap-02-chloroplast"],"BOT-08 closed-gap record mismatch")
    req(impl.get("mcq_count")==10 and impl.get("cq_count")==3,"BOT-08 assessment counts mismatch")
topic=next((x for x in scope.get("topic_lesson_map",[]) if x.get("topic_id")=="chloroplast"),None)
req(topic is not None and topic.get("status")=="covered","chloroplast topic not covered")
req(topic is not None and topic.get("existing_lessons")==["bot-08"],"chloroplast lesson mapping mismatch")
req("gap-02-chloroplast" not in scope.get("remaining_curriculum_gaps",[]),"chloroplast gap still open")
req(len(scope.get("remaining_curriculum_gaps",[]))==8,"Remaining-gap count must be 8")
req(scope.get("assessment_audit",{}).get("published_lessons")==8,"Assessment lesson count must be 8")
req(scope.get("assessment_audit",{}).get("lessons_with_mcq")==8,"MCQ coverage must be 8/8")
req(scope.get("assessment_audit",{}).get("lessons_with_cq")==8,"CQ coverage must be 8/8")
req("active-chapter-01-lessons: 01-08" in index,"Botany index active marker must be 01-08")
req("আটটি সক্রিয় পাঠ" in index,"Botany index visible count must be eight")
req(ROUTE in index and ROUTE in chapter and ROUTE in bot07,"BOT-08 navigation chain incomplete")
req(fm(chapter,"chapter_completion")=="not-certified","Chapter completion must remain not-certified")
req(fm(chapter,"contract_state")=="convergence-pending","Chapter contract_state must remain convergence-pending")
report={"schema":"lbfl-conv04e02-bot08-certification-v1","result":"PASS" if not errors else "FAIL","mcq_count":mcq,"cq_count":cq,"remaining_gap_count":len(scope.get("remaining_curriculum_gaps",[])),"errors":errors}
REPORT.write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
print(json.dumps(report,indent=2,ensure_ascii=False))
raise SystemExit(1 if errors else 0)
