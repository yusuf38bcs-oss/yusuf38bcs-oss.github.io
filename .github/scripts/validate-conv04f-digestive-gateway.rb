#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "55fd04f004f3f352cf90d4e026702d6714096072"
PHASE = "CONV-04F-06"
SOURCE_REL = "_biology/hsc-corner/zoology/digestive-system/index.md"
SOURCE = ROOT.join(SOURCE_REL)
MANIFEST = ROOT.join("_data/academic/conv04f_digestive_gateway_authorization_v1.json")
LEDGER = ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
AUTH_DOC = ROOT.join("docs/academic/conv04/DIGESTIVE_GATEWAY_AUTHORIZATION.md")
COURSE_CONTRACT = ROOT.join("_data/academic/course_contract_v1.json")
BROWSER = ROOT.join(".github/scripts/conv04f-digestive-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/conv04f-digestive-gateway-certification.yml")
CTA = "{% include education/learning-guide-cta.html %}"

LECTURES = %w[
  _biology/hsc-corner/zoology/digestive-system/lecture-01-human-digestive-system-overview.md
  _biology/hsc-corner/zoology/digestive-system/lecture-02-oral-cavity-saliva-teeth.md
  _biology/hsc-corner/zoology/digestive-system/lecture-03-stomach.md
  _biology/hsc-corner/zoology/digestive-system/lecture-04-liver-bile.md
  _biology/hsc-corner/zoology/digestive-system/lecture-05-pancreas.md
  _biology/hsc-corner/zoology/digestive-system/lecture-06-intestine.md
  _biology/hsc-corner/zoology/digestive-system/lecture-07-carbohydrate-digestion.md
  _biology/hsc-corner/zoology/digestive-system/lecture-08-amino-acid.md
  _biology/hsc-corner/zoology/digestive-system/lecture-09-lipid-digestion.md
  _biology/hsc-corner/zoology/digestive-system/lecture-10-absorption.md
  _biology/hsc-corner/zoology/digestive-system/lecture-11-summary.md
  _biology/hsc-corner/zoology/digestive-system/lecture-12-large-intestine.md
  _biology/hsc-corner/zoology/digestive-system/lecture-13-health-issues.md
  _biology/hsc-corner/zoology/digestive-system/lecture-14-revision.md
].freeze

EXPECTED_ROUTES = %w[
  /biology/hsc-corner/zoology/digestive-system/human-digestive-system-overview/
  /biology/hsc-corner/zoology/digestive-system/oral-cavity-saliva-teeth/
  /biology/hsc-corner/zoology/digestive-system/stomach/
  /biology/hsc-corner/zoology/digestive-system/liver-bile/
  /biology/hsc-corner/zoology/digestive-system/pancreas/
  /biology/hsc-corner/zoology/digestive-system/intestine/
  /biology/hsc-corner/zoology/digestive-system/carbohydrate-digestion/
  /biology/hsc-corner/zoology/digestive-system/amino-acid-pathway/
  /biology/hsc-corner/zoology/digestive-system/lipid-digestion/
  /biology/hsc-corner/zoology/digestive-system/absorption/
  /biology/hsc-corner/zoology/digestive-system/lecture-11/
  /biology/hsc-corner/zoology/digestive-system/large-intestine/
  /biology/hsc-corner/zoology/digestive-system/health-issues/
  /biology/hsc-corner/zoology/digestive-system/revision/
].freeze

BOOTSTRAP_FILES = %w[
  .github/scripts/conv04f-digestive-browser-certification.mjs
  .github/scripts/validate-conv04f-digestive-gateway.rb
  .github/workflows/conv04f-digestive-gateway-certification.yml
  _biology/hsc-corner/zoology/digestive-system/index.md
  _data/academic/conv04f_digestive_gateway_authorization_v1.json
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/CONV04_STATE.md
  docs/academic/conv04/DIGESTIVE_GATEWAY_AUTHORIZATION.md
].sort.freeze

IMMUTABLE_F06 = %w[
  .github/scripts/conv04f-digestive-browser-certification.mjs
  .github/scripts/validate-conv04f-digestive-gateway.rb
  .github/workflows/conv04f-digestive-gateway-certification.yml
  _biology/hsc-corner/zoology/digestive-system/index.md
  _data/academic/conv04f_digestive_gateway_authorization_v1.json
  docs/academic/conv04/DIGESTIVE_GATEWAY_AUTHORIZATION.md
].freeze

errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def need(errors, condition, message)
  errors << message unless condition
end

def git(*args)
  Open3.capture3("git", "-C", ROOT.to_s, *args)
end

def fm_value(source, key)
  return nil unless source.start_with?("---")
  front = source.split(/^---\s*$\n?/, 3)[1].to_s
  line = front.lines.find { |l| l.match?(/\A#{Regexp.escape(key)}:\s*/) }
  return nil unless line
  value = line.sub(/\A#{Regexp.escape(key)}:\s*/, "").strip
  if value.length >= 2 &&
     ((value.start_with?('"') && value.end_with?('"')) ||
      (value.start_with?("'") && value.end_with?("'")))
    value = value[1..-2]
  end
  value
end

def phase_order(value)
  match = /\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.match(value.to_s.strip)
  return nil unless match
  [match[1].ord, (match[2] || "0").to_i, (match[3] || "0").to_i]
end

def authorized_transform(source)
  out = source.dup
  out = out.sub(
    "language: bn\nstatus: \"Active\"",
    "language: bn\nlang: bn\nacademic_system: v1\nacademic_role: course_index\nlearning_guide: canonical\nstatus: \"Active\""
  )
  out = out.sub(
    "# Digestive System: 14-Lecture Ecosystem\n\n",
    "# Digestive System: 14-Lecture Ecosystem\n\n{% include education/learning-guide-cta.html %}\n\n"
  )
  out = out.sub('<section class="digestive-course-hero" markdown="1">', '<section class="lbfl-academic-callout" markdown="1">')
  out = out.sub('<div class="digestive-lecture-grid">', '<div class="lbfl-academic-grid">')
  out = out.gsub('class="digestive-lecture-card"', 'class="lbfl-academic-card"')
  out = out.sub(/\n<style>[\s\S]*?<\/style>\s*\z/, "\n")
  out
end

[SOURCE, MANIFEST, LEDGER, STATE, AUTH_DOC, COURSE_CONTRACT, BROWSER, WORKFLOW].each do |path|
  errors << "Missing F-06 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end
LECTURES.each do |relative|
  errors << "Missing protected Digestive lecture: #{relative}" unless ROOT.join(relative).file?
end

base_source, _, base_source_status = git("show", "#{BASE}:#{SOURCE_REL}")
if base_source_status.success? && SOURCE.file?
  candidate = read_utf8(SOURCE)
  need(errors, candidate == authorized_transform(base_source),
       "Digestive gateway differs from the exact authorized transformation")
  need(errors, fm_value(candidate, "permalink") == "/biology/hsc-corner/zoology/digestive-system/", "Digestive permalink drift")
  need(errors, fm_value(candidate, "academic_system") == "v1", "Digestive academic_system must be v1")
  need(errors, fm_value(candidate, "academic_role") == "course_index", "Digestive academic_role must be course_index")
  need(errors, fm_value(candidate, "lang") == "bn", "Digestive lang must be bn")
  need(errors, fm_value(candidate, "language") == "bn", "Legacy language must remain bn")
  need(errors, fm_value(candidate, "learning_guide") == "canonical", "Canonical Learning Guide ownership missing")
  need(errors, candidate.scan(CTA).length == 1, "Digestive gateway must contain exactly one canonical Learning Guide CTA")
  need(errors, !candidate.match?(/<style\b/i), "Digestive gateway still owns a page-local style block")
  need(errors, !candidate.include?("digestive-course-hero"), "Legacy Digestive hero class remains")
  need(errors, !candidate.include?("digestive-lecture-grid"), "Legacy Digestive grid class remains")
  need(errors, !candidate.include?("digestive-lecture-card"), "Legacy Digestive card class remains")
  need(errors, candidate.scan('class="lbfl-academic-card"').length == 14, "Expected exactly 14 Academic-v1 lecture cards")
  route_positions = EXPECTED_ROUTES.map { |route| candidate.index(route) }
  need(errors, route_positions.none?(&:nil?), "One or more Digestive routes are missing")
  need(errors, route_positions.compact == route_positions.compact.sort, "Digestive route order drift")
else
  errors << "Unable to authenticate Digestive gateway baseline at #{BASE}"
end

base_contract, _, contract_status = git("show", "#{BASE}:_data/academic/course_contract_v1.json")
if contract_status.success? && COURSE_CONTRACT.file?
  need(errors, read_utf8(COURSE_CONTRACT) == base_contract, "Digestive course contract changed from authorized base")
else
  errors << "Unable to authenticate course contract at #{BASE}"
end

LECTURES.each do |relative|
  baseline, _, status = git("show", "#{BASE}:#{relative}")
  if status.success?
    need(errors, read_utf8(ROOT.join(relative)) == baseline, "Protected Digestive lecture changed: #{relative}")
  else
    errors << "Unable to authenticate protected Digestive lecture: #{relative}"
  end
end

if MANIFEST.file?
  begin
    manifest = JSON.parse(read_utf8(MANIFEST))
    need(errors, manifest["schema"] == "lbfl-conv04f-digestive-gateway-authorization-v1", "F-06 manifest schema drift")
    need(errors, manifest["version"] == "CONV-04F-06-authorization-1.0.0", "F-06 manifest version drift")
    need(errors, manifest["status"] == "implemented-candidate", "F-06 manifest must identify implemented candidate")
    need(errors, manifest["authorization_snapshot_status"] == "authorized-not-implemented", "Historical authorization status not preserved")
    need(errors, manifest["authorized_base"] == BASE, "F-06 manifest authorized base drift")
    need(errors, manifest.dig("authenticated_baseline", "gateway_blob_sha") == "5adb6967bbe53351dac265bd1a443a120927da8e", "Gateway baseline blob drift")
    need(errors, manifest.dig("implementation", "canonical_learning_guide_cta_count") == 1, "F-06 CTA contract drift")
    need(errors, manifest.dig("implementation", "course_contract_changed") == false, "F-06 course-contract protection drift")
    need(errors, manifest.dig("implementation", "lecture_sources_changed") == false, "F-06 lecture protection drift")
  rescue JSON::ParserError => e
    errors << "F-06 manifest JSON invalid: #{e.message}"
  end
end

if LEDGER.file?
  begin
    ledger = JSON.parse(read_utf8(LEDGER))
    route = Array(ledger["routes"]).find { |r| r["id"] == "hsc-digestive-system-course-index" }
    need(errors, !route.nil?, "Academic Route Ledger missing Digestive course index")
    if route
      need(errors, route["canonical_route"] == "/biology/hsc-corner/zoology/digestive-system/", "Digestive ledger route drift")
      need(errors, route["source_file"] == SOURCE_REL, "Digestive ledger source drift")
      need(errors, route["academic_role"] == "course_index", "Digestive ledger role drift")
      need(errors, route["language"] == "bn", "Digestive ledger language drift")
      need(errors, route["boundary_owner"] == "layout", "Digestive boundary owner drift")
      need(errors, route["learning_guide_owner"] == "canonical", "Digestive Learning Guide owner drift")
      need(errors, route["assessment_owner"] == "mcq-arena", "Digestive assessment owner drift")
      need(errors, route["enforcement"] == "strict", "Digestive route must be strict")
      need(errors, Array(route["source_debt"]).empty?, "Digestive route source debt remains")
      need(errors, Array(route["live_debt"]).empty?, "Digestive route live debt remains")
    end
  rescue JSON::ParserError => e
    errors << "Academic Route Ledger JSON invalid: #{e.message}"
  end
end

state = STATE.file? ? read_utf8(STATE) : ""
mode = ENV.fetch("CERTIFICATION_MODE", "local")
comparison_base = ENV["PR_BASE_SHA"].to_s.strip
candidate_mode = mode == "pull_request"
bootstrap = candidate_mode && comparison_base == BASE
future = candidate_mode && !comparison_base.empty? && comparison_base != BASE

if STATE.file?
  phase = state[/^phase:\s*(\S+)/, 1]
  need(errors, state.include?("programme: CONV-04"), "CONV-04 programme identity missing")
  need(errors, !phase_order(phase).nil?, "Malformed CONV-04 phase: #{phase}")
  if bootstrap
    need(errors, phase == PHASE, "F-06 bootstrap state phase mismatch")
    need(errors, state.include?("authorized_base: #{BASE}"), "F-06 state base mismatch")
    need(errors, state.include?("production_verified_main: #{BASE}"), "F-05 production-verified base missing")
    need(errors, state.include?("learner_mutation_allowlist:\n  - #{SOURCE_REL}"), "Exact F-06 learner mutation authority missing")
  end
end

unless comparison_base.empty?
  stdout, stderr, status = git("diff", "--name-only", "#{comparison_base}...HEAD")
  if status.success?
    changed = stdout.lines.map(&:strip).reject(&:empty?).sort
    if bootstrap
      need(errors, changed == BOOTSTRAP_FILES, "F-06 bootstrap changed-file scope mismatch: #{changed}")
    elsif future
      protected = IMMUTABLE_F06 + LECTURES + ["_data/academic/course_contract_v1.json"]
      touched = changed & protected
      need(errors, touched.empty?, "Successor phase changed protected F-06 artifacts: #{touched.join(', ')}")
      if changed.include?("docs/academic/conv04/CONV04_STATE.md")
        base_state, _, bs = git("show", "#{comparison_base}:docs/academic/conv04/CONV04_STATE.md")
        if bs.success?
          bp = base_state[/^phase:\s*(\S+)/, 1]
          cp = state[/^phase:\s*(\S+)/, 1]
          bo = phase_order(bp)
          co = phase_order(cp)
          need(errors, bo && co && (co <=> bo) > 0, "Successor phase must advance CONV04_STATE beyond #{bp}")
        else
          errors << "Unable to authenticate successor base CONV04_STATE"
        end
      end
    end
  else
    errors << "Unable to inspect F-06 changed-file scope: #{stderr.strip}"
  end
end

if errors.empty?
  puts "CONV-04F-06 Digestive System gateway convergence: PASS"
  exit 0
end

warn "CONV-04F-06 Digestive System gateway convergence: FAIL"
errors.each { |error| warn "- #{error}" }
exit 1
