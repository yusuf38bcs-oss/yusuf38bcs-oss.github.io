#!/usr/bin/env ruby
# frozen_string_literal: true
require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "b73d04616498649b8db66afef2d80103329118f5"
PHASE = "CONV-04F-01"
SOURCE_REL = "_biology/hsc-corner/zoology/index.md"
SOURCE = ROOT.join(SOURCE_REL)
MANIFEST = ROOT.join("_data/academic/conv04f_hsc_zoology_gateway_v1.json")
LEDGER = ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
AUTH = ROOT.join("docs/academic/conv04/ZOOLOGY_GATEWAY_F01_AUTHORIZATION.md")
BROWSER = ROOT.join(".github/scripts/conv04f-hsc-zoology-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/conv04f-hsc-zoology-gateway-certification.yml")
CTA = "{% include education/learning-guide-cta.html %}"

BOOTSTRAP_FILES = %w[
  .github/scripts/assessment-runtime-second-bank-browser-certification.mjs
  .github/scripts/conv04f-hsc-zoology-browser-certification.mjs
  .github/scripts/validate-conv04f-hsc-zoology-gateway.rb
  .github/workflows/conv04f-hsc-zoology-gateway-certification.yml
  _biology/hsc-corner/zoology/index.md
  _data/academic/conv04f_hsc_zoology_gateway_v1.json
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/CONV04_STATE.md
  docs/academic/conv04/ZOOLOGY_GATEWAY_F01_AUTHORIZATION.md
].sort.freeze

IMMUTABLE_F01 = %w[
  .github/scripts/conv04f-hsc-zoology-browser-certification.mjs
  .github/scripts/validate-conv04f-hsc-zoology-gateway.rb
  .github/workflows/conv04f-hsc-zoology-gateway-certification.yml
  _biology/hsc-corner/zoology/index.md
  _data/academic/conv04f_hsc_zoology_gateway_v1.json
  docs/academic/conv04/ZOOLOGY_GATEWAY_F01_AUTHORIZATION.md
].freeze

errors=[]
def read_utf8(path) = File.read(path, encoding:"UTF-8")
def need(errors, ok, msg)
  errors << msg unless ok
end
def git(*args) = Open3.capture3("git","-C",ROOT.to_s,*args)
def fm(source,key)
  parts=source.split(/^---\s*$\n?/,3)
  front=parts[1].to_s
  line=front.lines.find{|l| l.match?(/\A#{Regexp.escape(key)}:\s*/)}
  return nil unless line
  v=line.sub(/\A#{Regexp.escape(key)}:\s*/,"").strip
  v=v[1..-2] if v.length>=2 && ((v.start_with?('"')&&v.end_with?('"'))||(v.start_with?("'")&&v.end_with?("'")))
  v
end
def phase_order(value)
  m=/\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.match(value.to_s.strip)
  m ? [m[1].ord,(m[2]||"0").to_i,(m[3]||"0").to_i] : nil
end
def strip_f01_metadata(source)
  source.lines.reject{|l| l.match?(/\A(?:lang:\s*en|academic_system:\s*v1|academic_role:\s*academic_gateway)\s*\z/)}.join
end

[SOURCE,MANIFEST,LEDGER,STATE,AUTH,BROWSER,WORKFLOW].each{|p| errors<<"Missing F-01 artifact: #{p.relative_path_from(ROOT)}" unless p.file?}

if SOURCE.file?
  s=read_utf8(SOURCE)
  need(errors,fm(s,"permalink")=="/biology/hsc-corner/zoology/","HSC Zoology permalink drift")
  need(errors,fm(s,"academic_system")=="v1","HSC Zoology academic_system must be v1")
  need(errors,fm(s,"academic_role")=="academic_gateway","HSC Zoology role mismatch")
  need(errors,fm(s,"lang")=="en","HSC Zoology lang must be en")
  need(errors,fm(s,"language")=="en","Legacy language must remain en")
  need(errors,fm(s,"learning_guide")=="canonical","Canonical Learning Guide ownership missing")
  need(errors,s.scan(CTA).length==1,"HSC Zoology must contain exactly one canonical Learning Guide CTA")
  need(errors,!s.include?("education/framework-links.html"),"Legacy framework panel returned")
  %w[Core\ Learning\ Route Available\ Zoology\ Logs Extended\ Zoology\ Pathways Study\ Sequence Responsible\ Learning\ Boundary Connected\ Nodes].each do |escaped|
    needle=escaped.gsub("\\ "," ")
    need(errors,s.include?(needle),"Topic-specific HSC Zoology content missing: #{needle}")
  end
  base_s,_,st=git("show","#{BASE}:#{SOURCE_REL}")
  if st.success?
    need(errors,strip_f01_metadata(s)==base_s,"F-01 changed HSC Zoology content beyond authorized metadata")
  else
    errors<<"Unable to read F-01 baseline source"
  end
end

if MANIFEST.file?
  m=JSON.parse(read_utf8(MANIFEST))
  need(errors,m["schema"]=="lbfl-conv04f-hsc-zoology-gateway-v1","F-01 manifest schema drift")
  need(errors,m["version"]=="CONV-04F-01-1.0.0","F-01 manifest version drift")
  need(errors,m["authorized_base"]==BASE,"F-01 manifest base drift")
  need(errors,m["baseline_blob_sha"]=="babb9f70421ce5ae5f37bfe7534a899992ab0e65","F-01 baseline blob drift")
  need(errors,m["scientific_content_rewrite"]==false,"F-01 must forbid scientific rewrite")
end

if LEDGER.file?
  data=JSON.parse(read_utf8(LEDGER))
  route=Array(data["routes"]).find{|r| r["id"]=="hsc-zoology-gateway"}
  need(errors,!route.nil?,"Ledger missing hsc-zoology-gateway")
  if route
    need(errors,route["enforcement"]=="strict","HSC Zoology ledger must be strict")
    need(errors,Array(route["source_debt"]).empty?,"HSC Zoology source debt remains")
    need(errors,Array(route["live_debt"]).empty?,"HSC Zoology live debt remains")
    need(errors,route["academic_role"]=="academic_gateway","HSC Zoology ledger role drift")
    need(errors,route["language"]=="en","HSC Zoology ledger language drift")
    need(errors,route["learning_guide_owner"]=="canonical","HSC Zoology Learning Guide owner drift")
    need(errors,route["assessment_owner"]=="mcq-arena","HSC Zoology assessment owner drift")
  end
end

state=STATE.file? ? read_utf8(STATE) : ""
mode=ENV.fetch("CERTIFICATION_MODE","local")
comparison_base=ENV["PR_BASE_SHA"].to_s.strip
if comparison_base.empty?
  parent,_,st=git("rev-parse","HEAD^")
  comparison_base=st.success? ? parent.strip : BASE
end
bootstrap=(mode=="pull_request" && comparison_base==BASE)
future=(mode=="pull_request" && comparison_base!=BASE)

if STATE.file?
  need(errors,state.include?("programme: CONV-04"),"CONV-04 programme identity missing")
  phase=state.lines.find{|l|l.start_with?("phase:")}.to_s.sub(/^phase:\s*/,"").strip
  need(errors,!phase_order(phase).nil?,"Malformed CONV-04 phase: #{phase}")
  if bootstrap
    need(errors,phase==PHASE,"F-01 bootstrap phase mismatch")
    need(errors,state.include?("authorized_base: #{BASE}"),"F-01 state base mismatch")
    need(errors,state.include?("production_verified_main: #{BASE}"),"F-01 production-verified base missing")
    need(errors,state.include?("conv04e_boundary: CLOSED / PASS / production-verified"),"E convergence boundary not recorded")
    need(errors,state.include?("learner_mutation_allowlist:\n  - #{SOURCE_REL}"),"Exact F-01 learner authority missing")
  end
end

stdout,stderr,st=git("diff","--name-only","#{comparison_base}...HEAD")
if st.success?
  changed=stdout.lines.map(&:strip).reject(&:empty?).sort
  if bootstrap
    need(errors,changed==BOOTSTRAP_FILES,"F-01 bootstrap changed-file scope mismatch: #{changed}")
  elsif future
    forbidden=changed & IMMUTABLE_F01
    need(errors,forbidden.empty?,"Future phase changed immutable F-01 artifacts: #{forbidden.join(', ')}")
    if changed.include?("docs/academic/conv04/CONV04_STATE.md")
      base_state,_,bst=git("show","#{comparison_base}:docs/academic/conv04/CONV04_STATE.md")
      if bst.success?
        bp=base_state.lines.find{|l|l.start_with?("phase:")}.to_s.sub(/^phase:\s*/,"").strip
        cp=state.lines.find{|l|l.start_with?("phase:")}.to_s.sub(/^phase:\s*/,"").strip
        bo=phase_order(bp); co=phase_order(cp)
        need(errors,bo && co && (co<=>bo)>0,"Future phase must advance CONV04_STATE beyond #{bp}")
      else
        errors<<"Unable to authenticate base CONV04_STATE in retained F-01 mode"
      end
    end
  end
else
  errors<<"Unable to inspect F-01 changed-file scope: #{stderr.strip}"
end

if errors.empty?
  puts "CONV-04F-01 HSC Zoology gateway strict convergence: PASS"
  exit 0
end
warn "CONV-04F-01 HSC Zoology gateway strict convergence: FAIL"
errors.each{|e|warn "- #{e}"}
exit 1
