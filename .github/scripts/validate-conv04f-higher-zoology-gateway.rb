#!/usr/bin/env ruby
# frozen_string_literal: true
require "json"
require "open3"
require "pathname"

ROOT=Pathname.new(__dir__).join("../..").expand_path
BASE="571e73b7b17023487cf40660f307e6d11091b919"
PHASE="CONV-04F-02"
EN_REL="_biology/higher-zoology-tree/index.md"
BN_REL="_biology/higher-zoology-tree/index.bn.md"
EN=ROOT.join(EN_REL)
BN=ROOT.join(BN_REL)
AUTH=ROOT.join("_data/academic/conv04f_higher_zoology_gateway_authorization_v1.json")
MANIFEST=ROOT.join("_data/academic/conv04f_higher_zoology_gateway_v1.json")
LEDGER=ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
STATE=ROOT.join("docs/academic/conv04/CONV04_STATE.md")
DOC=ROOT.join("docs/academic/conv04/HIGHER_ZOOLOGY_F02_CONVERGENCE.md")
AUTH_DOC=ROOT.join("docs/academic/conv04/HIGHER_ZOOLOGY_F02_AUTHORIZATION.md")
BROWSER=ROOT.join(".github/scripts/conv04f-higher-zoology-browser-certification.mjs")
WORKFLOW=ROOT.join(".github/workflows/conv04f-higher-zoology-gateway-certification.yml")
CTA="{% include education/learning-guide-cta.html %}"
LEGACY="{% include education/framework-links.html %}"
PHASE_PATTERN=/\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.freeze

BOOTSTRAP=%w[
  .github/scripts/conv04f-higher-zoology-browser-certification.mjs
  .github/scripts/validate-conv04f-higher-zoology-gateway.rb
  .github/workflows/conv04f-higher-zoology-gateway-certification.yml
  _sass/components/_assessment-system.scss
  _biology/higher-zoology-tree/index.bn.md
  _biology/higher-zoology-tree/index.md
  _data/academic/conv04f_higher_zoology_gateway_authorization_v1.json
  _data/academic/conv04f_higher_zoology_gateway_v1.json
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/CONV04_STATE.md
  docs/academic/conv04/HIGHER_ZOOLOGY_F02_AUTHORIZATION.md
  docs/academic/conv04/HIGHER_ZOOLOGY_F02_CONVERGENCE.md
].sort.freeze

IMMUTABLE=%w[
  .github/scripts/conv04f-higher-zoology-browser-certification.mjs
  .github/scripts/validate-conv04f-higher-zoology-gateway.rb
  .github/workflows/conv04f-higher-zoology-gateway-certification.yml
  _data/academic/conv04f_higher_zoology_gateway_authorization_v1.json
  _data/academic/conv04f_higher_zoology_gateway_v1.json
  docs/academic/conv04/HIGHER_ZOOLOGY_F02_AUTHORIZATION.md
  docs/academic/conv04/HIGHER_ZOOLOGY_F02_CONVERGENCE.md
].freeze

errors=[]
def need(errors,condition,message); errors<<message unless condition; end
def read_utf8(path); File.read(path,encoding:"UTF-8"); end
def fm(source,key)
  parts=source.split(/^---\s*$\n?/,3); front=parts[1].to_s
  line=front.lines.find{|l|l.match?(/\A#{Regexp.escape(key)}:\s*/)}
  return nil unless line
  v=line.sub(/\A#{Regexp.escape(key)}:\s*/,"").strip
  v=v[1..-2] if v.length>=2 && ((v.start_with?('"')&&v.end_with?('"'))||(v.start_with?("'")&&v.end_with?("'")))
  v
end
def git(*args); Open3.capture3("git","-C",ROOT.to_s,*args); end
def phase_order(value)
  m=PHASE_PATTERN.match(value.to_s.strip)
  m ? [m[1].ord,(m[2]||"0").to_i,(m[3]||"0").to_i] : nil
end
def strip_transform(source,lang_added:)
  s=source.gsub("\n#{CTA}\n","\n#{LEGACY}\n")
  keys=["academic_system","academic_role","learning_guide"]
  keys << "lang" if lang_added
  s.lines.reject{|l|keys.any?{|k|l.match?(/\A#{Regexp.escape(k)}:\s*/)}}.join
end

[EN,BN,AUTH,MANIFEST,LEDGER,STATE,DOC,AUTH_DOC,BROWSER,WORKFLOW].each do |p|
  errors<<"Missing F-02 artifact: #{p.relative_path_from(ROOT)}" unless p.file?
end

auth=AUTH.file? ? JSON.parse(read_utf8(AUTH)) : {}
man=MANIFEST.file? ? JSON.parse(read_utf8(MANIFEST)) : {}
need(errors,auth["authorized_base"]==BASE,"F-02 authorization base drift")
need(errors,auth["status"]=="authorized-not-implemented","Historical F-02 authorization must remain immutable")
expected_links=[
  "/biology/animal-diversity/",
  "/biology/higher-zoology-tree/human-physiology/",
  "/biology/higher-zoology-tree/ecology/",
  "/biology/higher-zoology-tree/genetics/",
  "/biology/higher-zoology-tree/biostatistics/",
  "/biology/higher-zoology-tree/practical/",
  "/biology/",
  "/biology/higher-zoology-tree/genetics/",
  "/mcq-arena/",
  "/synaptic-bridge/"
]
need(errors,auth.dig("baseline","english","links")==expected_links,"F-02 English baseline-link census drift")
need(errors,auth.dig("baseline","bangla","links")==expected_links,"F-02 Bangla baseline-link census drift")
need(errors,man["phase"]==PHASE,"F-02 manifest phase mismatch")
need(errors,man["authorized_base"]==BASE,"F-02 manifest base mismatch")
sass_path=ROOT.join("_sass/components/_assessment-system.scss")
assessment_sass=sass_path.file? ? read_utf8(sass_path) : ""
[
  ".authored-assessment-wrapper .q .exp",
  ".authored-assessment-wrapper .score-board h3",
  ".authored-assessment-wrapper .score-board p",
  ".authored-assessment-wrapper .score-board a.btn-restart[data-assessment-repair]"
].each do |selector_fragment|
  need(errors,assessment_sass.include?(selector_fragment),"F-02 retained assessment contrast bridge missing: #{selector_fragment}")
end

{EN=>["en","/biology/higher-zoology-tree/"],BN=>["bn","/biology/higher-zoology-tree/"]}.each do |path,(lang,permalink)|
  next unless path.file?
  s=read_utf8(path)
  need(errors,fm(s,"academic_system")=="v1","#{path.basename}: academic_system")
  need(errors,fm(s,"academic_role")=="academic_gateway","#{path.basename}: academic_role")
  need(errors,fm(s,"lang")==lang,"#{path.basename}: lang")
  need(errors,fm(s,"language")==lang,"#{path.basename}: legacy language agreement")
  need(errors,fm(s,"learning_guide")=="canonical","#{path.basename}: canonical Learning Guide")
  need(errors,fm(s,"permalink")==permalink,"#{path.basename}: source permalink drift")
  need(errors,s.scan(CTA).length==1,"#{path.basename}: exactly one canonical CTA required")
  need(errors,!s.include?(LEGACY),"#{path.basename}: legacy framework include remains")
  need(errors,!s.match?(/<style\b|\sstyle\s*=/i),"#{path.basename}: local style debt not authorized")
end

if LEDGER.file?
  l=JSON.parse(read_utf8(LEDGER)); routes=Array(l["routes"])
  {
    "higher-zoology-gateway"=>["/biology/higher-zoology-tree/",EN_REL,"en"],
    "higher-zoology-gateway-bn"=>["/bn/biology/higher-zoology-tree/",BN_REL,"bn"]
  }.each do |id,(route,source,lang)|
    x=routes.find{|r|r["id"]==id}
    need(errors,!x.nil?,"Ledger missing #{id}")
    next unless x
    need(errors,x["canonical_route"]==route,"#{id}: route drift")
    need(errors,x["source_file"]==source,"#{id}: source drift")
    need(errors,x["academic_role"]=="academic_gateway","#{id}: role drift")
    need(errors,x["language"]==lang,"#{id}: language drift")
    need(errors,x["boundary_owner"]=="layout","#{id}: boundary owner drift")
    need(errors,x["learning_guide_owner"]=="canonical","#{id}: guide owner drift")
    need(errors,x["assessment_owner"]=="mcq-arena","#{id}: assessment owner drift")
    need(errors,x["enforcement"]=="strict","#{id}: must remain strict")
    need(errors,Array(x["source_debt"]).empty?,"#{id}: source debt")
    need(errors,Array(x["live_debt"]).empty?,"#{id}: live debt")
  end
end

mode=ENV.fetch("CERTIFICATION_MODE","local")
comparison=ENV["PR_BASE_SHA"].to_s.strip
if comparison.empty?
  out,_,st=git("rev-parse","HEAD^"); comparison=st.success? ? out.strip : BASE
end
candidate_mode=%w[pull_request manual].include?(mode)
bootstrap=candidate_mode && comparison==BASE
future=candidate_mode && comparison!=BASE

if bootstrap
  [[EN_REL,EN,true],[BN_REL,BN,false]].each do |rel,path,lang_added|
    base_source,_,st=git("show","#{BASE}:#{rel}")
    if st.success?
      need(errors,strip_transform(read_utf8(path),lang_added:lang_added)==base_source,"#{rel}: content changed beyond authorized F-02 transform")
    else
      errors<<"Unable to authenticate #{rel} baseline"
    end
  end
  need(errors,read_utf8(STATE).include?("phase: CONV-04F-02"),"F-02 bootstrap state phase mismatch")
  need(errors,read_utf8(STATE).include?("authorized_base: #{BASE}"),"F-02 bootstrap state base mismatch")
end

stdout,stderr,st=git("diff","--name-only","#{comparison}...HEAD")
if st.success?
  changed=stdout.lines.map(&:strip).reject(&:empty?).sort
  if bootstrap
    need(errors,changed==BOOTSTRAP,"F-02 bootstrap changed-file scope mismatch: #{changed}")
  elsif future
    forbidden=changed & IMMUTABLE
    need(errors,forbidden.empty?,"Future phase changed immutable F-02 artifacts: #{forbidden.join(', ')}")
    if changed.include?("docs/academic/conv04/CONV04_STATE.md")
      b,_,bst=git("show","#{comparison}:docs/academic/conv04/CONV04_STATE.md")
      if bst.success?
        bp=b[/^phase:\s*(\S+)/,1]; cp=read_utf8(STATE)[/^phase:\s*(\S+)/,1]
        bo=phase_order(bp); co=phase_order(cp)
        need(errors,bo&&co&&(co<=>bo)>0,"Future phase must advance CONV04_STATE beyond #{bp}")
      else
        errors<<"Unable to authenticate base state"
      end
    end
  end
else
  errors<<"Unable to inspect F-02 changed files: #{stderr.strip}"
end

if errors.empty?
  puts "CONV-04F-02 Higher Zoology gateway: PASS"; exit 0
end
warn "CONV-04F-02 Higher Zoology gateway: FAIL"
errors.each{|e|warn "- #{e}"}
exit 1
