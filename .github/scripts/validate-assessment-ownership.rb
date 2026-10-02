#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "824a8188f7d7837091cc5d969a9b5194e49408bc"
MANIFEST = ROOT.join("_data/academic/assessment_ownership_v1.json")
CENSUS = ROOT.join("docs/academic/conv04/ASSESSMENT_CENSUS.md")
CONTRACT = ROOT.join("docs/academic/conv04/ASSESSMENT_OWNERSHIP_CONTRACT.md")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
WORKFLOW = ROOT.join(".github/workflows/assessment-ownership-certification.yml")
MCQ_GATEWAY = ROOT.join("_mcq-arena/academic/index.md")
CONFIG = ROOT.join("_config.yml")
MCQ_ENGINE = ROOT.join("assets/js/learning/mcq-engine.js")
MCQ_COMPONENT = ROOT.join("_includes/components/mcq-arena.html")
MODEL_TEST = ROOT.join("_pages/assessments/biology-model-test.md")

ALLOWED_FILES = %w[
  .github/scripts/validate-assessment-ownership.rb
  .github/workflows/assessment-ownership-certification.yml
  _data/academic/assessment_ownership_v1.json
  docs/academic/conv04/ASSESSMENT_CENSUS.md
  docs/academic/conv04/ASSESSMENT_OWNERSHIP_CONTRACT.md
  docs/academic/conv04/CONV04_STATE.md
].freeze

FROZEN_D01_ARTIFACTS = %w[
  _data/academic/assessment_ownership_v1.json
  docs/academic/conv04/ASSESSMENT_CENSUS.md
  docs/academic/conv04/ASSESSMENT_OWNERSHIP_CONTRACT.md
].freeze

LOOP = %w[Attempt Feedback Repair Reattempt].freeze
errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

[MANIFEST, CENSUS, CONTRACT, STATE, WORKFLOW, MCQ_GATEWAY, CONFIG, MCQ_ENGINE, MCQ_COMPONENT, MODEL_TEST].each do |path|
  errors << "Missing D-01 dependency/artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

if MANIFEST.file?
  data = JSON.parse(read_utf8(MANIFEST))
  errors << "Assessment contract schema mismatch" unless data["schema"] == "lbfl-assessment-ownership-v1"
  errors << "Assessment contract version mismatch" unless data["version"] == "CONV-04D-01-1.0.0"
  errors << "Assessment contract base mismatch" unless data["authorized_base"] == BASE
  errors << "D-01 must remain architecture-only" unless data["mode"] == "architecture-only"
  errors << "D-01 must not authorize learner mutation" unless data["learner_mutation_authorized"] == false
  errors << "Canonical assessment loop mismatch" unless data["canonical_loop"] == LOOP
  errors << "Authenticated assessment count mismatch" unless data.dig("collection_truth","authenticated_academic_assessment_count") == 6
  errors << "MCQ collection ownership missing" unless data.dig("collection_truth","collection") == "mcq-arena"
end

if CONTRACT.file?
  doc = read_utf8(CONTRACT)
  [
    "Attempt → Feedback → Repair → Reattempt",
    "A score alone is not the canonical completion state.",
    "The `mcq-arena` Jekyll collection is authoritative",
    "source-return",
    "Reattempt",
    "D-01 does not authorize learner mutation."
  ].each do |needle|
    errors << "Assessment contract missing: #{needle}" unless doc.include?(needle)
  end
end

if CENSUS.file?
  census = read_utf8(CENSUS)
  [
    "No diagnostic modules found in the Academic Matrix.",
    "site.categories[\"MCQ\"]",
    "assets/js/learning/mcq-engine.js",
    "_includes/components/mcq-arena.html",
    "D-02 implementation defect"
  ].each do |needle|
    errors << "Assessment census missing authenticated finding: #{needle}" unless census.include?(needle)
  end
end

if CONFIG.file?
  config = read_utf8(CONFIG)
  errors << "mcq-arena collection output missing" unless config.match?(/^\s{2}mcq-arena:\s*$/)
  errors << "mcq-arena collection output must be true" unless config.match?(/^\s{4}output:\s*true\s*$/)
end


certification_mode = ENV.fetch("CERTIFICATION_MODE", "local")
comparison_base = ENV["PR_BASE_SHA"].to_s.strip
if comparison_base.empty?
  parent_stdout, parent_status = Open3.capture2e("git", "-C", ROOT.to_s, "rev-parse", "HEAD^")
  comparison_base = parent_status.success? ? parent_stdout.strip : BASE
end
bootstrap_pr = certification_mode == "pull_request" && comparison_base == BASE

if bootstrap_pr
  if MCQ_ENGINE.file?
    engine = read_utf8(MCQ_ENGINE)
    errors << "MCQ engine attempt/feedback evidence missing" unless engine.include?("evaluateAssessment") && engine.include?("Correct answer:") && engine.include?("Validity logic:")
  end

  if MCQ_COMPONENT.file?
    component = read_utf8(MCQ_COMPONENT)
    errors << "Duplicate inline MCQ runtime evidence missing" unless component.include?("function evaluateQuiz()") && component.include?("localSocraticBank")
  end

  if MODEL_TEST.file?
    model = read_utf8(MODEL_TEST)
    errors << "Model-test source-return evidence missing" unless model.include?("Return to the lesson")
    errors << "Model-test reattempt evidence missing" unless model.include?("Repeat after correction")
  end
end

if STATE.file?
  state = read_utf8(STATE)
  if bootstrap_pr
    errors << "CONV04_STATE must identify phase CONV-04D-01" unless state.include?("phase: CONV-04D-01")
    errors << "CONV04_STATE must bind D-01 base" unless state.include?(BASE)
    errors << "D-01 learner mutation must remain frozen" unless state.include?("learner_content_authoring: frozen")
    allowlist_line = state.lines.find { |line| line.start_with?("learner_mutation_allowlist:") }.to_s.strip
    errors << "D-01 learner allowlist key missing" unless allowlist_line == "learner_mutation_allowlist:"
  else
    errors << "CONV-04 programme identity missing" unless state.include?("programme: CONV-04")
    phase_line = state.lines.find { |line| line.start_with?("phase:") }.to_s.strip
    errors << "CONV04_STATE must identify a valid CONV-04 phase" unless phase_line.match?(/\Aphase:\s+CONV-04[A-Z](?:-\d+)?(?:-[A-Z0-9]+)?\z/)
  end
end

if MCQ_GATEWAY.file? && bootstrap_pr
  gateway = read_utf8(MCQ_GATEWAY)
  errors << "Authenticated category/collection mismatch disappeared; refresh census" unless gateway.include?('site.categories["MCQ"]')
  errors << "Authenticated empty-state text disappeared; refresh census" unless gateway.include?("No diagnostic modules found in the Academic Matrix.")
end

stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
  if bootstrap_pr
    unexpected = changed - ALLOWED_FILES.sort
    missing = ALLOWED_FILES.sort - changed
    errors << "Unexpected D-01 changed files: #{unexpected.join(', ')}" unless unexpected.empty?
    errors << "Expected D-01 files not changed: #{missing.join(', ')}" unless missing.empty?
  else
    frozen_changes = changed & FROZEN_D01_ARTIFACTS
    errors << "Later D phase changed frozen D-01 contract artifacts: #{frozen_changes.join(', ')}" unless frozen_changes.empty?
  end
else
  errors << "Unable to inspect D-01 changed-file scope: #{stdout.strip}"
end

if errors.empty?
  puts "CONV-04D-01 Assessment Ownership Contract: PASS"
  exit 0
end

warn "CONV-04D-01 Assessment Ownership Contract: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
