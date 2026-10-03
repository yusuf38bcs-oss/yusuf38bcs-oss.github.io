#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "4b8f96300a81289432da7a01cfddecacbada3623"
PHASE = "CONV-04F-08"
SOURCE_REL = "_biology/higher-zoology-tree/practical/index.bn.md"
SOURCE = ROOT.join(SOURCE_REL)
MANIFEST = ROOT.join("_data/academic/conv04f_zoology_practical_gateway_v1.json")
LEDGER = ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
AUTH_DOC = ROOT.join("docs/academic/conv04/ZOOLOGY_PRACTICAL_GATEWAY_F08_AUTHORIZATION.md")
COURSE_CONTRACT = ROOT.join("_data/academic/course_contract_v1.json")
BROWSER = ROOT.join(".github/scripts/conv04f-zoology-practical-gateway-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/conv04f-zoology-practical-gateway-certification.yml")
CTA = "{% include education/learning-guide-cta.html %}"

MODULES = [
  ["prac-01", "_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md", "26e1711cf9c6bace8ddd8419797c38511987420c"],
  ["prac-02", "_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md", "50825b1a7178d062c437cf10b2a1d8ef8c1780f8"],
  ["prac-03", "_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md", "904933f7b29a301f72b7d370582d605364b906e6"],
  ["prac-04", "_biology/higher-zoology-tree/practical/04-dissection.bn.md", "0bca70d74c04305fd2399f54fbb5c650f0b158c3"],
  ["prac-05", "_biology/higher-zoology-tree/practical/05-temporary-mounts.bn.md", "b01e88d0bfe9441e984ac2a10f3a0ee761379850"],
  ["prac-06", "_biology/higher-zoology-tree/practical/06-appendages.bn.md", "36e36c4dd8cfffb99f1669033b4a21bc0e45d939"],
  ["prac-07", "_biology/higher-zoology-tree/practical/07-zooplankton.bn.md", "c120863ca31d85a33f1476b3f5bab59d571950cf"],
  ["prac-08", "_biology/higher-zoology-tree/practical/08-field-report.bn.md", "6398c601c3a1b3cd891e8ea945d704d5d94b9711"]
].freeze

BOOTSTRAP_FILES = %w[
  .github/scripts/conv04f-zoology-practical-gateway-browser-certification.mjs
  .github/scripts/validate-conv04f-zoology-practical-gateway.rb
  .github/workflows/conv04f-zoology-practical-gateway-certification.yml
  _biology/higher-zoology-tree/practical/index.bn.md
  _data/academic/conv04f_zoology_practical_gateway_v1.json
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/CONV04_STATE.md
  docs/academic/conv04/ZOOLOGY_PRACTICAL_GATEWAY_F08_AUTHORIZATION.md
].sort.freeze

IMMUTABLE_F08 = %w[
  .github/scripts/conv04f-zoology-practical-gateway-browser-certification.mjs
  .github/scripts/validate-conv04f-zoology-practical-gateway.rb
  .github/workflows/conv04f-zoology-practical-gateway-certification.yml
  _biology/higher-zoology-tree/practical/index.bn.md
  _data/academic/conv04f_zoology_practical_gateway_v1.json
  docs/academic/conv04/ZOOLOGY_PRACTICAL_GATEWAY_F08_AUTHORIZATION.md
].freeze

EXPECTED_ROUTES = %w[
  /biology/higher-zoology-tree/practical/museum-specimens/
  /biology/higher-zoology-tree/practical/permanent-slides/
  /biology/higher-zoology-tree/practical/whole-mounts/
  /biology/higher-zoology-tree/practical/dissection/
  /biology/higher-zoology-tree/practical/temporary-mounts/
  /biology/higher-zoology-tree/practical/appendages/
  /biology/higher-zoology-tree/practical/zooplankton/
  /biology/higher-zoology-tree/practical/field-report/
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
  m = /\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.match(value.to_s.strip)
  m ? [m[1].ord, (m[2] || "0").to_i, (m[3] || "0").to_i] : nil
end

def top_level_list(source, key)
  top = source.split(/^##\s/, 2).first.to_s
  lines = top.lines
  index = lines.index { |line| line.match?(/\A#{Regexp.escape(key)}:\s*\z/) }
  return [] unless index

  items = []
  lines[(index + 1)..].to_a.each do |line|
    if (match = line.match(/^\s+-\s+(.+?)\s*$/))
      items << match[1].strip
    elsif line.strip.empty?
      next
    elsif line.match?(/^\S/)
      break
    end
  end
  items
end

def authorized_transform(source)
  out = source.dup
  out = out.sub(
    "locale: bn-BD\ntoc: true",
    "locale: bn-BD\nacademic_system: v1\nacademic_role: practical\nlearning_guide: canonical\ntoc: true"
  )
  out = out.sub(
    "# Zoology Practical-I — Higher Zoology Tree\n\n",
    "# Zoology Practical-I — Higher Zoology Tree\n\n{% include education/learning-guide-cta.html %}\n\n"
  )
  out = out.sub(
    "## Course Identity\n\n| Item | Value |\n|---|---|\n| Course Code | **213106** |\n| Course Title | **Zoology Practical-I** |\n| Marks | **100** |\n| Credits | **4** |\n| Class Hours | **60** |",
    "## Course Identity\n\n<div class=\"lbfl-academic-table-wrap zoology-practical-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"Zoology Practical-I course identity\" markdown=\"1\">\n\n| Item | Value |\n|---|---|\n| Course Code | **213106** |\n| Course Title | **Zoology Practical-I** |\n| Marks | **100** |\n| Credits | **4** |\n| Class Hours | **60** |\n\n</div>"
  )
  out = out.sub(
    "## Module Sequence\n\n| No. | Module | Coverage |",
    "## Module Sequence\n\n<div class=\"lbfl-academic-table-wrap zoology-practical-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"Zoology Practical-I module sequence\" markdown=\"1\">\n\n| No. | Module | Coverage |"
  )
  out = out.sub(
    "| 08 | [Field Report]({{ '/biology/higher-zoology-tree/practical/field-report/' | relative_url }}) | ≥10 samples, quadrat density, Shannon–Wiener, scientific report |\n\n## Practical Reasoning Rule",
    "| 08 | [Field Report]({{ '/biology/higher-zoology-tree/practical/field-report/' | relative_url }}) | ≥10 samples, quadrat density, Shannon–Wiener, scientific report |\n\n</div>\n\n## Practical Reasoning Rule"
  )
  out
end

def course_entry(json_text)
  data = JSON.parse(json_text)
  Array(data["pathways"]).find { |entry| entry["course_id"] == "nu-zoology-practical-213106" }
end

[SOURCE, MANIFEST, LEDGER, STATE, AUTH_DOC, COURSE_CONTRACT, BROWSER, WORKFLOW].each do |path|
  errors << "Missing F-08 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end
MODULES.each do |_id, relative, _sha|
  errors << "Missing protected Practical module: #{relative}" unless ROOT.join(relative).file?
end

state = STATE.file? ? read_utf8(STATE) : ""
mode = ENV.fetch("CERTIFICATION_MODE", "local")
phase = state[/^phase:\s*(\S+)/, 1]
comparison_base = ENV["PR_BASE_SHA"].to_s.strip
if mode == "manual" && comparison_base.empty?
  comparison_base = state[/^authorized_base:\s*(\S+)/, 1].to_s.strip
end
bootstrap = !comparison_base.empty? && comparison_base == BASE && phase == PHASE
future = !comparison_base.empty? && comparison_base != BASE
changed = []

unless comparison_base.empty?
  stdout, stderr, status = git("diff", "--name-only", "#{comparison_base}...HEAD")
  if status.success?
    changed = stdout.lines.map(&:strip).reject(&:empty?).sort
  else
    errors << "Unable to inspect F-08 changed-file scope: #{stderr.strip}"
  end
end

successor_phase_authorized = false
successor_allowlist = []

if future && STATE.file? && changed.include?("docs/academic/conv04/CONV04_STATE.md")
  base_state, _, base_state_status = git("show", "#{comparison_base}:docs/academic/conv04/CONV04_STATE.md")
  if base_state_status.success?
    base_phase = base_state[/^phase:\s*(\S+)/, 1]
    base_order = phase_order(base_phase)
    current_order = phase_order(phase)
    f08_order = phase_order(PHASE)
    successor_phase_authorized =
      base_order && current_order && f08_order &&
      (current_order <=> base_order) > 0 &&
      (current_order <=> f08_order) > 0 &&
      state.include?("authorized_base: #{comparison_base}")
    successor_allowlist = top_level_list(state, "learner_mutation_allowlist")
  else
    errors << "Unable to authenticate successor base CONV04_STATE"
  end
end

if SOURCE.file?
  baseline, _, status = git("show", "#{BASE}:#{SOURCE_REL}")
  if status.success?
    candidate = read_utf8(SOURCE)
    need(errors, candidate == authorized_transform(baseline),
         "Practical gateway differs from the exact F-08 authorized transformation")
    need(errors, fm_value(candidate, "permalink") == "/biology/higher-zoology-tree/practical/", "F-08 permalink drift")
    need(errors, fm_value(candidate, "course_id") == "zoology-practical-213106", "F-08 course_id drift")
    need(errors, fm_value(candidate, "course_role") == "gateway", "F-08 course_role drift")
    need(errors, fm_value(candidate, "academic_system") == "v1", "F-08 academic_system must be v1")
    need(errors, fm_value(candidate, "academic_role") == "practical", "F-08 academic_role must be practical")
    need(errors, fm_value(candidate, "lang") == "bn", "F-08 lang must remain bn")
    need(errors, fm_value(candidate, "language") == "bn", "F-08 language must remain bn")
    need(errors, fm_value(candidate, "locale") == "bn-BD", "F-08 locale must remain bn-BD")
    need(errors, fm_value(candidate, "learning_guide") == "canonical", "F-08 canonical Learning Guide ownership missing")
    need(errors, candidate.scan(CTA).length == 1, "F-08 must contain exactly one canonical Learning Guide CTA")
    need(errors, candidate.scan('class="lbfl-academic-table-wrap zoology-practical-table-scroll"').length == 2, "F-08 must contain exactly two Academic-v1 table wrappers")
    need(errors, candidate.include?('aria-label="Zoology Practical-I course identity"'), "F-08 course-identity table accessibility wrapper missing")
    need(errors, candidate.include?('aria-label="Zoology Practical-I module sequence"'), "F-08 module-sequence table accessibility wrapper missing")
    need(errors, candidate.include?("/assets/css/zoology-practical.css"), "F-08 dedicated Practical CSS declaration missing")
    need(errors, candidate.include?("/assets/js/zoology-practical.js"), "F-08 dedicated Practical JS declaration missing")
    need(errors, candidate.include?("Practical Reasoning Rule"), "F-08 Practical Reasoning Rule missing")
    need(errors, candidate.include?("Safety and Academic Integrity"), "F-08 safety/integrity section missing")
    positions = EXPECTED_ROUTES.map { |route| candidate.index(route) }
    need(errors, positions.none?(&:nil?), "F-08 one or more Practical module routes missing")
    need(errors, positions.compact == positions.compact.sort, "F-08 Practical module route order drift")
  else
    errors << "Unable to authenticate F-08 baseline source at #{BASE}"
  end
end

if COURSE_CONTRACT.file?
  baseline, _, status = git("show", "#{BASE}:_data/academic/course_contract_v1.json")
  if status.success?
    unless future
      need(errors, read_utf8(COURSE_CONTRACT) == baseline, "F-08 changed the governed Practical course contract")
    end
    begin
      entry = course_entry(read_utf8(COURSE_CONTRACT))
      need(errors, !entry.nil?, "Governed Practical course entry missing")
      if entry
        need(errors, entry["enforcement"] == "strict", "Practical course enforcement must remain strict")
        modules = Array(entry["modules"])
        need(errors, modules.map { |m| m["module_id"] } == (1..8).map { |n| format("prac-%02d", n) },
             "Practical module IDs/order drift")
      end
    rescue JSON::ParserError => e
      errors << "Course contract JSON invalid: #{e.message}"
    end
  else
    errors << "Unable to authenticate F-08 course contract baseline"
  end
end

MODULES.each do |id, relative, expected_blob|
  baseline, _, status = git("show", "#{BASE}:#{relative}")
  if status.success?
    if future
      if changed.include?(relative)
        need(errors, successor_phase_authorized,
             "Successor changed protected module #{id} without an explicit advanced CONV-04 phase bound to current base")
        need(errors, successor_allowlist.include?(relative),
             "Successor changed protected module #{id} without exact learner_mutation_allowlist authority")
      end
    else
      need(errors, read_utf8(ROOT.join(relative)) == baseline, "F-08 changed protected module #{id}")
    end
    blob, _, blob_status = git("rev-parse", "#{BASE}:#{relative}")
    need(errors, blob_status.success? && blob.strip == expected_blob, "F-08 baseline blob mismatch for #{id}")
  else
    errors << "Unable to authenticate protected Practical module #{id}"
  end
end

if MANIFEST.file?
  begin
    m = JSON.parse(read_utf8(MANIFEST))
    need(errors, m["schema"] == "lbfl-conv04f-zoology-practical-gateway-v1", "F-08 manifest schema drift")
    need(errors, m["version"] == "CONV-04F-08-1.0.0", "F-08 manifest version drift")
    need(errors, m["authorized_base"] == BASE, "F-08 manifest base drift")
    need(errors, m["baseline_blob_sha"] == "da3660be82ec695bfee239494312fede78cd4a24", "F-08 gateway baseline blob drift")
    need(errors, m["scientific_content_rewrite"] == false, "F-08 must forbid scientific rewrite")
    need(errors, m.dig("course_contract", "enforcement") == "strict", "F-08 manifest course enforcement drift")
    need(errors, m.dig("course_contract", "module_count") == 8, "F-08 manifest module count drift")
    need(errors, m.dig("additions", "academic_role") == "practical", "F-08 manifest role drift")
  rescue JSON::ParserError => e
    errors << "F-08 manifest JSON invalid: #{e.message}"
  end
end

if LEDGER.file?
  begin
    ledger = JSON.parse(read_utf8(LEDGER))
    route = Array(ledger["routes"]).find { |r| r["id"] == "higher-zoology-practical-gateway" }
    need(errors, !route.nil?, "Academic Route Ledger missing Practical gateway")
    if route
      need(errors, route["canonical_route"] == "/biology/higher-zoology-tree/practical/", "F-08 ledger route drift")
      need(errors, route["source_file"] == SOURCE_REL, "F-08 ledger source drift")
      need(errors, route["academic_role"] == "practical", "F-08 ledger role drift")
      need(errors, route["language"] == "bn", "F-08 ledger language drift")
      need(errors, route["boundary_owner"] == "layout", "F-08 boundary owner drift")
      need(errors, route["learning_guide_owner"] == "canonical", "F-08 Learning Guide owner drift")
      need(errors, route["assessment_owner"] == "mcq-arena", "F-08 assessment owner drift")
      need(errors, route["enforcement"] == "strict", "F-08 route must be strict")
      need(errors, Array(route["source_debt"]).empty?, "F-08 source debt remains")
      need(errors, Array(route["live_debt"]).empty?, "F-08 live debt remains")
    end
  rescue JSON::ParserError => e
    errors << "Academic Route Ledger JSON invalid: #{e.message}"
  end
end

if STATE.file?
  need(errors, state.include?("programme: CONV-04"), "CONV-04 programme identity missing")
  need(errors, !phase_order(phase).nil?, "Malformed CONV-04 phase: #{phase}")
  if bootstrap
    need(errors, phase == PHASE, "F-08 bootstrap phase mismatch")
    need(errors, state.include?("authorized_base: #{BASE}"), "F-08 state base mismatch")
    need(errors, state.include?("production_verified_main: #{BASE}"), "F-08 production base missing")
    need(errors, state.include?("learner_mutation_allowlist:\n  - #{SOURCE_REL}"), "Exact F-08 learner authority missing")
  end
end

unless comparison_base.empty?
  if bootstrap
      need(errors, changed == BOOTSTRAP_FILES, "F-08 bootstrap changed-file scope mismatch: #{changed}")
  elsif future
    touched = changed & IMMUTABLE_F08
    need(errors, touched.empty?, "Successor phase changed protected F-08 gateway artifacts: #{touched.join(', ')}")

    if changed.include?("_data/academic/course_contract_v1.json")
      base_contract, _, bs = git("show", "#{comparison_base}:_data/academic/course_contract_v1.json")
      if bs.success?
        begin
          before = course_entry(base_contract)
          after = course_entry(read_utf8(COURSE_CONTRACT))
          need(errors, before == after, "Successor phase changed governed Practical course identity/sequence")
        rescue JSON::ParserError => e
          errors << "Unable to compare successor Practical course contract: #{e.message}"
        end
      else
        errors << "Unable to authenticate successor base course contract"
      end
    end

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
end

if errors.empty?
  puts "CONV-04F-08 Zoology Practical-I gateway convergence: PASS"
  exit 0
end

warn "CONV-04F-08 Zoology Practical-I gateway convergence: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
