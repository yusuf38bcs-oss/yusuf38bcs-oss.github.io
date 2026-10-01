#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
MANIFEST_PATH = ROOT.join("_data/academic/learning_guide_contract_v1.json")
CENSUS_PATH = ROOT.join("docs/academic/conv04/LEARNING_METHOD_CENSUS.md")
CONTRACT_PATH = ROOT.join("docs/academic/conv04/LEARNING_GUIDE_CONTRACT.md")
STATE_PATH = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
WORKFLOW_PATH = ROOT.join(".github/workflows/learning-guide-contract-certification.yml")

EXPECTED_SCHEMA = "lbfl-learning-guide-contract-v1"
EXPECTED_VERSION = "CONV-04C-01-1.0.0"
EXPECTED_BASE = "5e3a3e8919d1f26740ebab94fce099a49fe7f1b1"
EXPECTED_PHASE = "CONV-04C-01"
EXPECTED_TITLE = "How to Learn with LBFL"
EXPECTED_PERMALINK = "/learn/"
EXPECTED_CYCLE = %w[Understand Retrieve Explain Apply Reflect Repair].freeze

EXPECTED_FRAMEWORKS = {
  "lolo_lala" => "_pages/frameworks/lolo-lala.md",
  "bloom_taxonomy" => "_pages/frameworks/bloom-taxonomy.md",
  "cq_studio" => "_pages/frameworks/cq-studio.md",
  "assessment_rubric" => "_pages/frameworks/assessment-rubric.md",
  "practical_learning" => "_pages/frameworks/practical-framework.md",
  "synaptic_bridge" => "_data/homepage.yml",
  "assessment_repair_loop" => "_data/homepage.yml"
}.freeze

ALLOWED_FILES = %w[
  .github/scripts/validate-learning-guide-contract.rb
  .github/workflows/learning-guide-contract-certification.yml
  _data/academic/learning_guide_contract_v1.json
  docs/academic/conv04/CONV04_STATE.md
  docs/academic/conv04/LEARNING_GUIDE_CONTRACT.md
  docs/academic/conv04/LEARNING_METHOD_CENSUS.md
].freeze

errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def fail_if(errors, condition, message)
  errors << message if condition
end

required = [MANIFEST_PATH, CENSUS_PATH, CONTRACT_PATH, STATE_PATH, WORKFLOW_PATH]
required.each { |path| errors << "Missing required artifact: #{path.relative_path_from(ROOT)}" unless path.file? }

manifest = {}
if MANIFEST_PATH.file?
  begin
    manifest = JSON.parse(read_utf8(MANIFEST_PATH))
  rescue JSON::ParserError => e
    errors << "Manifest JSON invalid: #{e.message}"
  end
end

unless manifest.empty?
  fail_if(errors, manifest["schema"] != EXPECTED_SCHEMA, "Manifest schema mismatch")
  fail_if(errors, manifest["version"] != EXPECTED_VERSION, "Manifest version mismatch")
  fail_if(errors, manifest["authorized_base"] != EXPECTED_BASE, "Authorized base mismatch")
  fail_if(errors, manifest["phase"] != EXPECTED_PHASE, "Phase mismatch")
  fail_if(errors, manifest["mode"] != "architecture-only", "C-01 must remain architecture-only")

  guide = manifest["canonical_guide"] || {}
  fail_if(errors, guide["title"] != EXPECTED_TITLE, "Canonical guide title mismatch")
  fail_if(errors, guide["planned_permalink"] != EXPECTED_PERMALINK, "Canonical guide permalink mismatch")
  fail_if(errors, guide["route_creation_authorized"] != false, "C-01 must not authorize route creation")
  fail_if(errors, guide["learner_content_authoring"] != "frozen", "Learner content must remain frozen")

  fail_if(errors, manifest["canonical_cycle"] != EXPECTED_CYCLE, "Canonical learning cycle drifted")

  actual_frameworks = (manifest["supporting_frameworks"] || {}).transform_values { |v| v["source"] }
  fail_if(errors, actual_frameworks != EXPECTED_FRAMEWORKS, "Supporting-framework source map drifted")

  bridges = Array(manifest["temporary_bridges"]).map { |b| b["source"] }.sort
  expected_bridges = [
    "_includes/education/framework-links.html",
    "_includes/zoology/learning-cycle.html"
  ].sort
  fail_if(errors, bridges != expected_bridges, "Temporary migration-bridge set mismatch")
end

EXPECTED_FRAMEWORKS.values.uniq.each do |relative|
  path = ROOT.join(relative)
  errors << "Authenticated framework source missing: #{relative}" unless path.file?
end

if ROOT.join("_pages/frameworks/lolo-lala.md").file?
  five = EXPECTED_FRAMEWORKS.values.grep(/_pages\/frameworks/).uniq
  five.each do |relative|
    source = read_utf8(ROOT.join(relative))
    fail_if(errors, !source.include?("This page is the canonical reference"), "#{relative} no longer declares specialist canonical-reference status")
  end
end

if ROOT.join("_data/homepage.yml").file?
  homepage = read_utf8(ROOT.join("_data/homepage.yml"))
  %w[Observe Question Connect Explain Attempt Feedback Repair Reattempt].each do |term|
    fail_if(errors, !homepage.include?(term), "Homepage learning-cycle evidence missing: #{term}")
  end
end

if CENSUS_PATH.file?
  census = read_utf8(CENSUS_PATH)
  fail_if(errors, !census.include?("Files containing `LOLO` | 36"), "Census LOLO count missing")
  fail_if(errors, !census.include?("Direct uses of `education/framework-links.html` | 45"), "Census framework-link count missing")
  fail_if(errors, !census.include?("## Learning Objectives` in `_biology` | 32"), "Census Learning Objectives count missing")
  fail_if(errors, !census.include?("## Learning Outcomes` in `_biology` | 11"), "Census Learning Outcomes count missing")
end

if CONTRACT_PATH.file?
  contract = read_utf8(CONTRACT_PATH)
  fail_if(errors, !contract.include?("Understand → Retrieve → Explain → Apply → Reflect → Repair"), "Canonical cycle missing from contract")
  fail_if(errors, !contract.include?("C-01 reserves the ownership and route identity only"), "Architecture-only route boundary missing")
  fail_if(errors, !contract.include?("temporary migration bridges"), "Migration-bridge ownership missing")
end

certification_mode = ENV.fetch("CERTIFICATION_MODE", "local")
comparison_base = ENV["PR_BASE_SHA"].to_s.strip
if comparison_base.empty?
  parent_stdout, parent_status = Open3.capture2e("git", "-C", ROOT.to_s, "rev-parse", "HEAD^")
  comparison_base = parent_status.success? ? parent_stdout.strip : EXPECTED_BASE
end
bootstrap_pr = certification_mode == "pull_request" && comparison_base == EXPECTED_BASE

if STATE_PATH.file?
  state = read_utf8(STATE_PATH)
  if bootstrap_pr
    fail_if(errors, !state.include?("phase: CONV-04C-01"), "CONV04_STATE must identify phase CONV-04C-01 on the bootstrap PR")
    fail_if(errors, !state.include?(EXPECTED_BASE), "CONV04_STATE must bind the authorized CONV-04C-01 base")
    fail_if(errors, !state.include?("learner_content_authoring: frozen"), "CONV04_STATE must freeze learner content in C-01")
  else
    fail_if(errors, !state.include?("programme: CONV-04"), "CONV-04 programme identity missing")
    phase_line = state.lines.find { |line| line.start_with?("phase:") }.to_s.strip
    fail_if(errors, !phase_line.match?(/\Aphase:\s+CONV-04[A-Z](?:-\d+)?\z/), "CONV04_STATE must identify a valid CONV-04 phase")
  end
end

if WORKFLOW_PATH.file?
  workflow = read_utf8(WORKFLOW_PATH)
  fail_if(errors, !workflow.include?("PR_BASE_SHA"), "Workflow must bind PR base SHA")
  fail_if(errors, !workflow.include?("CANDIDATE_SHA"), "Workflow must bind candidate SHA")
end

git_dir = ROOT.join(".git")
if git_dir.exist?
  stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{comparison_base}...HEAD")
  if status.success?
    changed = stdout.lines.map(&:strip).reject(&:empty?).sort
    unexpected = changed - ALLOWED_FILES.sort
    missing = ALLOWED_FILES.sort - changed if bootstrap_pr
    errors << "Unexpected CONV-04C-01 changed files: #{unexpected.join(', ')}" unless unexpected.empty?
    errors << "Expected CONV-04C-01 architecture files not changed: #{missing.join(', ')}" if missing && !missing.empty?
  else
    errors << "Unable to inspect changed-file scope: #{stdout.strip}"
  end
end

if errors.empty?
  puts "CONV-04C-01 learning-guide contract: PASS"
  exit 0
end

warn "CONV-04C-01 learning-guide contract: FAIL"
errors.each { |error| warn "- #{error}" }
exit 1
