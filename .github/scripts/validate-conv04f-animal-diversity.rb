#!/usr/bin/env ruby
# frozen_string_literal: true
require "json"
require "open3"
require "pathname"

ROOT=Pathname.new(__dir__).join("../..").expand_path
BASE="8330368a1c4bc8b7083d1528a3c50118217e258a"
PHASE="CONV-04F-03"
GATEWAY_REL="_biology/higher-zoology-tree/animal-diversity/index.md"
COURSE_REL="_biology/higher-zoology-tree/animal-diversity/course-index.md"
LAYOUT_REL="_layouts/animal-diversity-course.html"
GATEWAY=ROOT.join(GATEWAY_REL)
COURSE=ROOT.join(COURSE_REL)
LAYOUT=ROOT.join(LAYOUT_REL)
AUTH=ROOT.join("_data/academic/conv04f_animal_diversity_authorization_v1.json")
MANIFEST=ROOT.join("_data/academic/conv04f_animal_diversity_v1.json")
LEDGER=ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
STATE=ROOT.join("docs/academic/conv04/CONV04_STATE.md")
AUTH_DOC=ROOT.join("docs/academic/conv04/ANIMAL_DIVERSITY_F03_AUTHORIZATION.md")
DOC=ROOT.join("docs/academic/conv04/ANIMAL_DIVERSITY_F03_CONVERGENCE.md")
COURSE_CONTRACT=ROOT.join("_data/academic/course_contract_v1.json")
BROWSER=ROOT.join(".github/scripts/conv04f-animal-diversity-browser-certification.mjs")
WORKFLOW=ROOT.join(".github/workflows/conv04f-animal-diversity-certification.yml")
CTA="{% include education/learning-guide-cta.html %}"
PHASE_PATTERN=/\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.freeze

EXPECTED_MODULE_ROUTES=[
  "/biology/animal-diversity/lecture-01-chordate-plan-classification/",
  "/biology/animal-diversity/lecture-02-ascidia/",
  "/biology/animal-diversity/lecture-03-branchiostoma/",
  "/biology/animal-diversity/lecture-04-myxine-petromyzon/",
  "/biology/animal-diversity/lecture-05-scoliodon/",
  "/biology/animal-diversity/lecture-06-labeo-rohita/",
  "/biology/animal-diversity/lecture-07-bufo/",
  "/biology/animal-diversity/lecture-08-hemidactylus/",
  "/biology/animal-diversity/lecture-09-columba-livia/",
  "/biology/animal-diversity/lecture-10-homo-sapiens-eye-ear/"
].freeze

EXPECTED_MODULE_TITLES=[
  "Chordate Plan and Classification",
  "Ascidia",
  "Branchiostoma",
  "Myxine and Petromyzon",
  "Scoliodon",
  "Labeo rohita",
  "Bufo",
  "Hemidactylus",
  "Columba livia",
  "Homo sapiens: Eye and Ear"
].freeze

BOOTSTRAP=%w[
  .github/scripts/conv04f-animal-diversity-browser-certification.mjs
  .github/scripts/validate-conv04f-animal-diversity.rb
  .github/workflows/conv04f-animal-diversity-certification.yml
  _biology/higher-zoology-tree/animal-diversity/course-index.md
  _biology/higher-zoology-tree/animal-diversity/index.md
  _data/academic/conv04f_animal_diversity_authorization_v1.json
  _data/academic/conv04f_animal_diversity_v1.json
  _layouts/animal-diversity-course.html
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/ANIMAL_DIVERSITY_F03_AUTHORIZATION.md
  docs/academic/conv04/ANIMAL_DIVERSITY_F03_CONVERGENCE.md
  docs/academic/conv04/CONV04_STATE.md
].sort.freeze

IMMUTABLE=%w[
  .github/scripts/conv04f-animal-diversity-browser-certification.mjs
  .github/scripts/validate-conv04f-animal-diversity.rb
  .github/workflows/conv04f-animal-diversity-certification.yml
  _data/academic/conv04f_animal_diversity_authorization_v1.json
  _data/academic/conv04f_animal_diversity_v1.json
  docs/academic/conv04/ANIMAL_DIVERSITY_F03_AUTHORIZATION.md
  docs/academic/conv04/ANIMAL_DIVERSITY_F03_CONVERGENCE.md
].freeze

errors=[]
def need(errors,c,m); errors<<m unless c; end
def read_utf8(p); File.read(p,encoding:"UTF-8"); end
def git(*args); Open3.capture3("git","-C",ROOT.to_s,*args); end
def fm(src,key)
  parts=src.split(/^---\s*$\n?/,3); front=parts[1].to_s
  line=front.lines.find{|l|l.match?(/\A#{Regexp.escape(key)}:\s*/)}
  return nil unless line
  v=line.sub(/\A#{Regexp.escape(key)}:\s*/,"").strip
  v=v[1..-2] if v.length>=2 && ((v.start_with?('"')&&v.end_with?('"'))||(v.start_with?("'")&&v.end_with?("'")))
  v
end
def strip_source(src)
  s=src.gsub("\n\n#{CTA}\n\n","\n\n")
  s=s.gsub(%Q{<div class="lbfl-academic-table-wrap" tabindex="0" role="region" aria-label="Animal Diversity lecture sequence" markdown="1">\n\n},"")
  s=s.gsub("\n\n</div>\n\n[Back to Animal Diversity]","\n\n[Back to Animal Diversity]")
  s.lines.reject{|l|%w[academic_system academic_role learning_guide].any?{|k|l.match?(/\A#{k}:\s*/)}}.join
end
def phase_order(value)
  m=PHASE_PATTERN.match(value.to_s.strip)
  m ? [m[1].ord,(m[2]||"0").to_i,(m[3]||"0").to_i] : nil
end
def expected_layout(base)
  s=base.dup
  s=s.sub(
    "{% assign lbfl_content_owns_h1 = false %}\n{% if content contains '<h1' %}{% assign lbfl_content_owns_h1 = true %}{% endif %}",
    "{% assign lbfl_content_owns_h1 = false %}\n{% if content contains '<h1' %}{% assign lbfl_content_owns_h1 = true %}{% endif %}\n{% assign lbfl_canonical_learning_guide = false %}\n{% if page.learning_guide == 'canonical' %}{% assign lbfl_canonical_learning_guide = true %}{% endif %}"
  )
  s=s.sub(
    "  <article class=\"page lbfl-animal-diversity-document\" itemscope itemtype=\"https://schema.org/CreativeWork\">",
    "  <article class=\"page lbfl-animal-diversity-document{% if page.academic_system == 'v1' %} lbfl-academic-surface lbfl-academic-role--{{ page.academic_role | default: 'unassigned' | escape }}{% endif %}\"{% if lbfl_canonical_learning_guide %} data-lbfl-learning-guide=\"canonical\"{% endif %}{% if page.academic_system == 'v1' %} data-lbfl-academic-surface=\"v1\" data-lbfl-academic-role=\"{{ page.academic_role | default: 'unassigned' | escape }}\"{% endif %} itemscope itemtype=\"https://schema.org/CreativeWork\">"
  )
  s=s.sub(
    "      <section class=\"page__content\" itemprop=\"text\">{{ content }}</section>",
    "      <section class=\"page__content\" itemprop=\"text\">{% if page.academic_system == 'v1' %}{% include components/educational-boundary.html %}{% endif %}{{ content }}</section>"
  )
  s
end

[GATEWAY,COURSE,LAYOUT,AUTH,MANIFEST,LEDGER,STATE,AUTH_DOC,DOC,COURSE_CONTRACT,BROWSER,WORKFLOW].each do |p|
  errors<<"Missing F-03 artifact: #{p.relative_path_from(ROOT)}" unless p.file?
end

auth=AUTH.file? ? JSON.parse(read_utf8(AUTH)) : {}
man=MANIFEST.file? ? JSON.parse(read_utf8(MANIFEST)) : {}
need(errors,auth["authorized_base"]==BASE,"F-03 authorization base drift")
need(errors,auth["status"]=="authorized-not-implemented","Historical F-03 authorization must remain immutable")
need(errors,man["phase"]==PHASE,"F-03 manifest phase mismatch")
need(errors,man["authorized_base"]==BASE,"F-03 manifest base mismatch")
if COURSE_CONTRACT.file?
  contract=JSON.parse(read_utf8(COURSE_CONTRACT))
  pathway=Array(contract["pathways"]).find{|p|p["course_id"]=="higher-zoology-animal-diversity"}
  need(errors,!pathway.nil?,"Animal Diversity course contract missing")
  if pathway
    modules=Array(pathway["modules"])
    need(errors,modules.length==10,"Animal Diversity course contract must retain ten modules")
    need(errors,modules.map{|m|m["route"]}==EXPECTED_MODULE_ROUTES,
      "Animal Diversity course-contract route order drift")
    need(errors,modules.map{|m|m["title"]}==EXPECTED_MODULE_TITLES,
      "Animal Diversity course-contract title order drift")
  end
end

{GATEWAY=>["/biology/animal-diversity/","Animal Diversity"],COURSE=>["/biology/animal-diversity/course/","Animal Diversity Course — Lectures 01–10"]}.each do |path,(route,title)|
  next unless path.file?
  s=read_utf8(path)
  need(errors,fm(s,"academic_system")=="v1","#{path.basename}: academic_system")
  need(errors,fm(s,"academic_role")=="academic_gateway","#{path.basename}: academic_role")
  need(errors,fm(s,"lang")=="en","#{path.basename}: lang")
  need(errors,fm(s,"language")=="en","#{path.basename}: language agreement")
  need(errors,fm(s,"learning_guide")=="canonical","#{path.basename}: Learning Guide")
  need(errors,fm(s,"permalink")==route,"#{path.basename}: permalink drift")
  need(errors,s.scan(CTA).length==1,"#{path.basename}: exactly one CTA")
  need(errors,s.include?(title),"#{path.basename}: title text missing")
  if path == COURSE
    need(errors,s.include?('class="lbfl-academic-table-wrap"'),"Course index must use Academic-v1 table wrapper")
    need(errors,s.include?('tabindex="0" role="region" aria-label="Animal Diversity lecture sequence"'),"Course table wrapper accessibility contract missing")

    route_positions=EXPECTED_MODULE_ROUTES.map{|route| s.index(route)}
    title_positions=EXPECTED_MODULE_TITLES.map{|title| s.index(title)}
    need(errors,route_positions.all?,"Course index must retain all ten canonical lecture links")
    need(errors,title_positions.all?,"Course index must retain all ten lecture titles")
    if route_positions.all?
      need(errors,route_positions==route_positions.sort && route_positions.uniq.length==10,
        "Course index lecture links must remain unique and ordered 01–10")
    end
    if title_positions.all?
      need(errors,title_positions==title_positions.sort,
        "Course index lecture titles must remain ordered 01–10")
    end
  end
  need(errors,!s.match?(/<style\b|\sstyle\s*=/i),"#{path.basename}: local style debt not authorized")
end

if LEDGER.file?
  routes=Array(JSON.parse(read_utf8(LEDGER))["routes"])
  {
    "animal-diversity-gateway"=>["/biology/animal-diversity/",GATEWAY_REL],
    "animal-diversity-course-index"=>["/biology/animal-diversity/course/",COURSE_REL]
  }.each do |id,(route,source)|
    x=routes.find{|r|r["id"]==id}
    need(errors,!x.nil?,"Ledger missing #{id}")
    next unless x
    need(errors,x["canonical_route"]==route,"#{id}: route drift")
    need(errors,x["source_file"]==source,"#{id}: source drift")
    need(errors,x["academic_role"]=="academic_gateway","#{id}: role drift")
    need(errors,x["language"]=="en","#{id}: language drift")
    need(errors,x["boundary_owner"]=="layout","#{id}: boundary owner")
    need(errors,x["learning_guide_owner"]=="canonical","#{id}: guide owner")
    need(errors,x["assessment_owner"]=="mcq-arena","#{id}: assessment owner")
    need(errors,x["enforcement"]=="strict","#{id}: must remain strict")
    need(errors,Array(x["source_debt"]).empty? && Array(x["live_debt"]).empty?,"#{id}: strict route debt")
  end
end

mode=ENV.fetch("CERTIFICATION_MODE","local")
comparison=ENV["PR_BASE_SHA"].to_s.strip
if comparison.empty?
  out,_,st=git("rev-parse","HEAD^"); comparison=st.success? ? out.strip : BASE
end
candidate=%w[pull_request manual].include?(mode)
bootstrap=candidate && comparison==BASE
future=candidate && comparison!=BASE

if bootstrap
  [[GATEWAY_REL,GATEWAY],[COURSE_REL,COURSE]].each do |rel,path|
    b,_,st=git("show","#{BASE}:#{rel}")
    st.success? ? need(errors,strip_source(read_utf8(path))==b,"#{rel}: content changed beyond authorized metadata/CTA transform") : errors<<"Unable to authenticate #{rel}"
  end
  b,_,st=git("show","#{BASE}:#{LAYOUT_REL}")
  st.success? ? need(errors,read_utf8(LAYOUT)==expected_layout(b),"Animal Diversity layout changed beyond authorized conditional transform") : errors<<"Unable to authenticate layout baseline"
  cc,_,st=git("show","#{BASE}:_data/academic/course_contract_v1.json")
  st.success? ? need(errors,read_utf8(COURSE_CONTRACT)==cc,"Course contract changed in F-03") : errors<<"Unable to authenticate course contract"
  need(errors,read_utf8(STATE).include?("phase: CONV-04F-03"),"F-03 state phase mismatch")
  need(errors,read_utf8(STATE).include?("authorized_base: #{BASE}"),"F-03 state base mismatch")
end

stdout,stderr,st=git("diff","--name-only","#{comparison}...HEAD")
if st.success?
  changed=stdout.lines.map(&:strip).reject(&:empty?).sort
  if bootstrap
    need(errors,changed==BOOTSTRAP,"F-03 bootstrap changed-file scope mismatch: #{changed}")
  elsif future
    forbidden=changed & IMMUTABLE
    need(errors,forbidden.empty?,"Future phase changed immutable F-03 artifacts: #{forbidden.join(', ')}")
    if changed.include?("docs/academic/conv04/CONV04_STATE.md")
      b,_,bst=git("show","#{comparison}:docs/academic/conv04/CONV04_STATE.md")
      if bst.success?
        bp=b[/^phase:\s*(\S+)/,1]; cp=read_utf8(STATE)[/^phase:\s*(\S+)/,1]
        bo=phase_order(bp); co=phase_order(cp)
        need(errors,bo&&co&&(co<=>bo)>0,"Future phase must advance beyond #{bp}")
      else
        errors<<"Unable to authenticate base state"
      end
    end
  end
else
  errors<<"Unable to inspect F-03 changed files: #{stderr.strip}"
end

if errors.empty?
  puts "CONV-04F-03 Animal Diversity convergence: PASS"; exit 0
end
warn "CONV-04F-03 Animal Diversity convergence: FAIL"
errors.each{|e|warn "- #{e}"}
exit 1
