#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "b07beb8119c4ee001d542a357f38c0e27e5017ba"
PHASE = "CONV-04E-01"

AUTH = ROOT.join("_data/academic/conv04e_botany_gateway_authorization_v1.json")
MANIFEST = ROOT.join("_data/academic/conv04e_botany_gateway_v1.json")
GATEWAY = ROOT.join("_biology/hsc-corner/botany/index.md")
CHAPTER = ROOT.join("_biology/hsc-corner/botany/chapter-01-cell-and-its-structure.md")
SCOPE = ROOT.join("_data/academic/hsc_botany_chapter01_scope_v1.json")
LEDGER = ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
AUTH_DOC = ROOT.join("docs/academic/conv04/BOTANY_GATEWAY_AUTHORIZATION.md")
DOC = ROOT.join("docs/academic/conv04/BOTANY_GATEWAY_CONVERGENCE.md")
BROWSER = ROOT.join(".github/scripts/conv04e-botany-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/conv04e-botany-gateway-certification.yml")

CTA = "{% include education/learning-guide-cta.html %}"
PHASE_PATTERN = /\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.freeze

BOOTSTRAP_FILES = %w[
  .github/scripts/conv04e-botany-browser-certification.mjs
  .github/scripts/validate-conv04e-botany-gateway.rb
  .github/workflows/conv04e-botany-gateway-certification.yml
  _biology/hsc-corner/botany/chapter-01-cell-and-its-structure.md
  _biology/hsc-corner/botany/index.md
  _data/academic/conv04e_botany_gateway_authorization_v1.json
  _data/academic/conv04e_botany_gateway_v1.json
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/BOTANY_GATEWAY_AUTHORIZATION.md
  docs/academic/conv04/BOTANY_GATEWAY_CONVERGENCE.md
  docs/academic/conv04/CONV04_STATE.md
].freeze

IMMUTABLE_E01 = %w[
  .github/scripts/conv04e-botany-browser-certification.mjs
  .github/scripts/validate-conv04e-botany-gateway.rb
  .github/workflows/conv04e-botany-gateway-certification.yml
  _data/academic/conv04e_botany_gateway_authorization_v1.json
  _data/academic/conv04e_botany_gateway_v1.json
  docs/academic/conv04/BOTANY_GATEWAY_AUTHORIZATION.md
  docs/academic/conv04/BOTANY_GATEWAY_CONVERGENCE.md
].freeze

PROTECTED_LECTURES = {
  "_biology/hsc-corner/botany/lecture-01-cell-protoplasm-cell-theory.md" => "c110aabe0a28bdd5dcf155a1c2a50ee8fd185b2b",
  "_biology/hsc-corner/botany/lecture-02-plasma-membrane-fluid-mosaic-model.md" => "5a527af8c2445f65c7c82fb75dc4729afe5250c1",
  "_biology/hsc-corner/botany/lecture-03-cytoplasm-ribosome-protein-factory.md" => "74187f00fc403477cce289dd2720df046f94303a",
  "_biology/hsc-corner/botany/lecture-04-endoplasmic-reticulum-transport-network.md" => "2fcfc0aebf2f32f61b7fe830ba7c5905e84302c5",
  "_biology/hsc-corner/botany/lecture-05-golgi-body-lysosome-peroxisome.md" => "7e378a14699c2f47ec582ba7954f32ee914053d3",
  "_biology/hsc-corner/botany/lecture-06-mitochondria.md" => "73c8d50c9bcf0628039cce69708b98ac242d1fef",
  "_biology/hsc-corner/botany/lecture-07-cell-wall-vacuole.md" => "d3adcdfe7d263cd0c4b7a94c9b120be3b08dca16"
}

EXPECTED_GATEWAY_LINKS = ["/biology/hsc-corner/botany/chapter-01-cell-and-its-structure/","/biology/hsc-corner/botany/lecture-01-cell-protoplasm-cell-theory/","/biology/hsc-corner/botany/lecture-02-plasma-membrane-fluid-mosaic-model/","/biology/hsc-corner/botany/lecture-03-cytoplasm-ribosome-protein-factory/","/biology/hsc-corner/botany/lecture-04-endoplasmic-reticulum-transport-network/","/biology/hsc-corner/botany/lecture-05-golgi-body-lysosome-peroxisome/","/biology/hsc-corner/botany/lecture-06-mitochondria/","/biology/hsc-corner/botany/lecture-07-cell-wall-vacuole/"]
EXPECTED_CHAPTER_LINKS = ["/biology/hsc-corner/botany/lecture-01-cell-protoplasm-cell-theory/","/biology/hsc-corner/botany/lecture-02-plasma-membrane-fluid-mosaic-model/","/biology/hsc-corner/botany/lecture-03-cytoplasm-ribosome-protein-factory/","/biology/hsc-corner/botany/lecture-04-endoplasmic-reticulum-transport-network/","/biology/hsc-corner/botany/lecture-05-golgi-body-lysosome-peroxisome/","/biology/hsc-corner/botany/lecture-06-mitochondria/","/biology/hsc-corner/botany/lecture-07-cell-wall-vacuole/","/biology/hsc-corner/botany/"]
EXPECTED_GAPS = ["gap-02-chloroplast","gap-04-centriole-microtubule","gap-05-nuclear-components","gap-06-cell-chemical-components","gap-07-prokaryotic-eukaryotic-comparison","gap-08-cell-size-shape-inclusions","gap-09-cell-discovery-history","gap-10-microscopy-mounting-drawing","gap-11-chapter-practical-integration"]

errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def need(errors, condition, message)
  errors << message unless condition
end

def fm_value(source, key)
  return nil unless source.start_with?("---")
  front = source.split(/^---\s*$\n?/, 3)[1].to_s
  line = front.lines.find { |entry| entry.match?(/\A#{Regexp.escape(key)}:\s*/) }
  return nil unless line
  value = line.sub(/\A#{Regexp.escape(key)}:\s*/, "").strip
  if value.length >= 2 && ((value.start_with?('"') && value.end_with?('"')) || (value.start_with?("'") && value.end_with?("'")))
    value = value[1..-2]
  end
  value
end

def phase_order(value)
  match = PHASE_PATTERN.match(value.to_s.strip)
  return nil unless match
  [match[1].ord, match[2] ? match[2].to_i : 0, match[3] ? match[3].to_i : 0]
end

def strip_authorized_additions(source)
  cleaned = source.gsub("\n\n#{CTA}", "")
  cleaned.lines.reject do |line|
    line.match?(/\A(?:academic_system:\s*v1|academic_role:\s*(?:academic_gateway|chapter_index)|lang:\s*bn|learning_guide:\s*canonical)\s*\z/)
  end.join
end

def git_show(base, relative)
  Open3.capture2e("git", "-C", ROOT.to_s, "show", "#{base}:#{relative}")
end

[AUTH, MANIFEST, GATEWAY, CHAPTER, SCOPE, LEDGER, STATE, AUTH_DOC, DOC, BROWSER, WORKFLOW].each do |path|
  errors << "Missing E-01 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

auth = AUTH.file? ? JSON.parse(read_utf8(AUTH)) : {}
manifest = MANIFEST.file? ? JSON.parse(read_utf8(MANIFEST)) : {}

unless auth.empty?
  need(errors, auth["schema"] == "lbfl-conv04e-botany-gateway-authorization-v1", "E-01 authorization schema mismatch")
  need(errors, auth["authorized_base"] == BASE, "E-01 authorization base mismatch")
  need(errors, auth["status"] == "authorized-not-implemented", "Historical authorization record must remain immutable")
end

unless manifest.empty?
  need(errors, manifest["schema"] == "lbfl-conv04e-botany-gateway-v1", "E-01 manifest schema mismatch")
  need(errors, manifest["version"] == "CONV-04E-01-1.0.0", "E-01 manifest version mismatch")
  need(errors, manifest["phase"] == PHASE, "E-01 manifest phase mismatch")
  need(errors, manifest["authorized_base"] == BASE, "E-01 manifest base mismatch")
  need(errors, manifest.dig("retained_contract","state_progression") == "strictly-monotonic", "E-01 retained phase progression missing")
end

{
  GATEWAY => ["academic_gateway", "/biology/hsc-corner/botany/"],
  CHAPTER => ["chapter_index", "/biology/hsc-corner/botany/chapter-01-cell-and-its-structure/"]
}.each do |path, (role, route)|
  next unless path.file?
  source = read_utf8(path)
  need(errors, fm_value(source, "academic_system") == "v1", "#{path.basename}: academic_system must be v1")
  need(errors, fm_value(source, "academic_role") == role, "#{path.basename}: academic_role mismatch")
  need(errors, fm_value(source, "lang") == "bn", "#{path.basename}: lang must be bn")
  need(errors, fm_value(source, "language") == "bn", "#{path.basename}: legacy language must agree with lang")
  need(errors, fm_value(source, "learning_guide") == "canonical", "#{path.basename}: canonical Learning Guide ownership missing")
  need(errors, fm_value(source, "permalink") == route, "#{path.basename}: permalink drift")
  need(errors, source.scan(CTA).length == 1, "#{path.basename}: must contain exactly one canonical Learning Guide CTA")
  need(errors, !source.include?("education/framework-links.html"), "#{path.basename}: legacy framework panel must not appear")
  need(errors, !source.match?(/<style\b|\sstyle\s*=/i), "#{path.basename}: local styling debt not authorized")
end

if CHAPTER.file?
  chapter_source = read_utf8(CHAPTER)
  need(errors, fm_value(chapter_source, "source_scope") == "NCTB curriculum 2012 pp.31-33", "Chapter source_scope drift")
end

if LEDGER.file?
  data = JSON.parse(read_utf8(LEDGER))
  routes = Array(data["routes"])
  expected = {
    "hsc-botany-gateway" => ["academic_gateway", "/biology/hsc-corner/botany/"],
    "hsc-botany-chapter-01" => ["chapter_index", "/biology/hsc-corner/botany/chapter-01-cell-and-its-structure/"]
  }
  expected.each do |id, (role, route)|
    item = routes.find { |r| r["id"] == id }
    need(errors, !item.nil?, "Ledger missing #{id}")
    next unless item
    need(errors, item["canonical_route"] == route, "#{id}: route drift")
    need(errors, item["academic_role"] == role, "#{id}: role drift")
    need(errors, item["language"] == "bn", "#{id}: language drift")
    need(errors, item["boundary_owner"] == "layout", "#{id}: boundary owner drift")
    need(errors, item["learning_guide_owner"] == "canonical", "#{id}: guide owner drift")
    need(errors, item["assessment_owner"] == "mcq-arena", "#{id}: assessment owner drift")
    need(errors, item["enforcement"] == "strict", "#{id}: surface must remain strict")
    need(errors, Array(item["source_debt"]).empty?, "#{id}: source debt remains")
    need(errors, Array(item["live_debt"]).empty?, "#{id}: live debt remains")
  end
end

certification_mode = ENV.fetch("CERTIFICATION_MODE", "local")
comparison_base = ENV["PR_BASE_SHA"].to_s.strip
if comparison_base.empty?
  parent, status = Open3.capture2e("git", "-C", ROOT.to_s, "rev-parse", "HEAD^")
  comparison_base = status.success? ? parent.strip : BASE
end

bootstrap_pr = certification_mode == "pull_request" && comparison_base == BASE
future_phase_pr = certification_mode == "pull_request" && comparison_base != BASE

if STATE.file?
  state = read_utf8(STATE)
  need(errors, state.include?("programme: CONV-04"), "CONV-04 programme identity missing")
  phase_line = state.lines.find { |line| line.start_with?("phase:") }.to_s
  current_phase = phase_line.sub(/^phase:\s*/, "").strip
  need(errors, !phase_order(current_phase).nil?, "Malformed CONV-04 phase: #{current_phase}")

  if bootstrap_pr
    need(errors, current_phase == PHASE, "E-01 bootstrap state phase mismatch")
    need(errors, state.include?("authorized_base: #{BASE}"), "E-01 state base mismatch")
    need(errors, state.include?("learner_mutation_allowlist:\n  - _biology/hsc-corner/botany/index.md\n  - _biology/hsc-corner/botany/chapter-01-cell-and-its-structure.md"), "Exact E-01 learner authority missing")
  end
end

if bootstrap_pr
  chapter_source = read_utf8(CHAPTER)
  need(errors, fm_value(chapter_source, "contract_state") == "convergence-pending", "E-01 bootstrap chapter contract_state must remain convergence-pending")
  need(errors, fm_value(chapter_source, "chapter_completion") == "not-certified", "E-01 bootstrap chapter_completion must remain not-certified")

  {
    "_biology/hsc-corner/botany/index.md" => GATEWAY,
    "_biology/hsc-corner/botany/chapter-01-cell-and-its-structure.md" => CHAPTER
  }.each do |relative, path|
    base_source, status = git_show(BASE, relative)
    if status.success?
      need(errors, strip_authorized_additions(read_utf8(path)) == base_source, "#{relative}: content changed outside authorized metadata/CTA additions")
    else
      errors << "Unable to authenticate baseline #{relative}: #{base_source.strip}"
    end
  end

  PROTECTED_LECTURES.each_key do |relative|
    current = ROOT.join(relative)
    base_source, status = git_show(BASE, relative)
    if status.success? && current.file?
      need(errors, read_utf8(current) == base_source, "#{relative}: protected lecture changed in E-01")
    else
      errors << "Unable to authenticate protected lecture #{relative}"
    end
  end

  base_scope, scope_status = git_show(BASE, "_data/academic/hsc_botany_chapter01_scope_v1.json")
  if scope_status.success?
    need(errors, read_utf8(SCOPE) == base_scope, "Chapter-01 scope contract changed in E-01")
  else
    errors << "Unable to authenticate Chapter-01 scope contract"
  end

  need(errors, EXPECTED_GATEWAY_LINKS.all? { |link| read_utf8(GATEWAY).include?(link) }, "Gateway lost authenticated learner link")
  need(errors, EXPECTED_CHAPTER_LINKS.all? { |link| read_utf8(CHAPTER).include?(link) }, "Chapter index lost authenticated learner link")

  scope_data = JSON.parse(read_utf8(SCOPE))
  need(errors, Array(scope_data["remaining_curriculum_gaps"]) == EXPECTED_GAPS, "Remaining curriculum-gap set changed in E-01")
  need(errors, scope_data.dig("lesson_architecture_authorization","strict_release_authorized") == false, "E-01 must not authorize strict curriculum completion")
end

stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
  if bootstrap_pr
    unexpected = changed - BOOTSTRAP_FILES.sort
    missing = BOOTSTRAP_FILES.sort - changed
    errors << "Unexpected E-01 changed files: #{unexpected.join(', ')}" unless unexpected.empty?
    errors << "Expected E-01 files not changed: #{missing.join(', ')}" unless missing.empty?
  elsif future_phase_pr
    forbidden = changed & IMMUTABLE_E01
    errors << "Future phase changed immutable E-01 artifacts: #{forbidden.join(', ')}" unless forbidden.empty?

    if changed.include?("docs/academic/conv04/CONV04_STATE.md")
      base_state, base_status = git_show(comparison_base, "docs/academic/conv04/CONV04_STATE.md")
      if base_status.success?
        candidate_phase = read_utf8(STATE).lines.find { |l| l.start_with?("phase:") }.to_s.sub(/^phase:\s*/, "").strip
        base_phase = base_state.lines.find { |l| l.start_with?("phase:") }.to_s.sub(/^phase:\s*/, "").strip
        candidate_order = phase_order(candidate_phase)
        base_order = phase_order(base_phase)
        errors << "Future E retained state has malformed candidate phase" unless candidate_order
        errors << "Future E retained state has malformed base phase" unless base_order
        if candidate_order && base_order && (candidate_order <=> base_order) <= 0
          errors << "Future phase must advance beyond #{base_phase}, got #{candidate_phase}"
        end
      else
        errors << "Unable to read base CONV04_STATE for retained E-01 certification"
      end
    end
  end
else
  errors << "Unable to inspect E-01 changed-file scope: #{stdout.strip}"
end

if errors.empty?
  puts "CONV-04E-01 Botany gateway + Chapter-01 convergence: PASS"
  exit 0
end

warn "CONV-04E-01 Botany gateway + Chapter-01 convergence: FAIL"
errors.each { |error| warn "- #{error}" }
exit 1
