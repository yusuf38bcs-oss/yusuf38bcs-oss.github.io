#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "4ef010685532eb652ed0867e03c8945b49dedb70"
MANIFEST = ROOT.join("_data/academic/assessment_runtime_v1.json")
CENSUS = ROOT.join("docs/academic/conv04/ASSESSMENT_RUNTIME_CENSUS.md")
CONTRACT = ROOT.join("docs/academic/conv04/ASSESSMENT_RUNTIME_CONTRACT.md")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
WORKFLOW = ROOT.join(".github/workflows/assessment-runtime-contract-certification.yml")
GENERATED_ENGINE = ROOT.join("assets/js/learning/mcq-engine.js")
LEGACY_COMPONENT = ROOT.join("_includes/components/mcq-arena.html")

INTERACTIVE = %w[
  _mcq-arena/academic/botany-cell-biology-mcq-1.md
  _mcq-arena/academic/botany-cell-division-mcq-2.md
  _mcq-arena/academic/zoology-animal-diversity-mcq-1.md
  _mcq-arena/academic/zoology-chordata-arthropoda-mcq-pro.md
  _mcq-arena/academic/zoology-respiratory-system-mcq-5.md
].freeze

MISSING_LOCAL_RUNTIME = %w[
  _mcq-arena/academic/botany-cell-biology-mcq-1.md
  _mcq-arena/academic/botany-cell-division-mcq-2.md
  _mcq-arena/academic/zoology-respiratory-system-mcq-5.md
].freeze

STATIC_SET = "_mcq-arena/academic/digestive-system-mcq-set-01.md"
LEGACY_OWNER = "_mcq-arena/academic/zoology-animal-diversity-mcq-1.md"
STANDALONE = "_mcq-arena/academic/zoology-chordata-arthropoda-mcq-pro.md"

ALLOWED_FILES = %w[
  .github/scripts/validate-assessment-runtime-contract.rb
  .github/workflows/assessment-runtime-contract-certification.yml
  _data/academic/assessment_runtime_v1.json
  docs/academic/conv04/ASSESSMENT_RUNTIME_CENSUS.md
  docs/academic/conv04/ASSESSMENT_RUNTIME_CONTRACT.md
  docs/academic/conv04/CONV04_STATE.md
].freeze

FROZEN_D03_ARTIFACTS = %w[
  _data/academic/assessment_runtime_v1.json
  docs/academic/conv04/ASSESSMENT_RUNTIME_CENSUS.md
  docs/academic/conv04/ASSESSMENT_RUNTIME_CONTRACT.md
].freeze

errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

[MANIFEST, CENSUS, CONTRACT, STATE, WORKFLOW, GENERATED_ENGINE, LEGACY_COMPONENT].each do |path|
  errors << "Missing D-03 artifact/dependency: #{path.relative_path_from(ROOT)}" unless path.file?
end
(INTERACTIVE + [STATIC_SET]).each do |relative|
  errors << "Missing academic assessment: #{relative}" unless ROOT.join(relative).file?
end

if MANIFEST.file?
  data = JSON.parse(read_utf8(MANIFEST))
  errors << "Runtime contract schema mismatch" unless data["schema"] == "lbfl-assessment-runtime-v1"
  errors << "Runtime contract version mismatch" unless data["version"] == "CONV-04D-03-1.0.0"
  errors << "Runtime contract base mismatch" unless data["authorized_base"] == BASE
  errors << "D-03 must remain architecture-only" unless data["mode"] == "architecture-only"
  errors << "D-03 must not authorize learner mutation" unless data["learner_mutation_authorized"] == false
  errors << "Canonical loop mismatch" unless data["canonical_loop"] == %w[Attempt Feedback Repair Reattempt]
  errors << "Canonical authored runtime path mismatch" unless data.dig("runtime_ownership","canonical_authored_runtime_future_path") == "assets/js/learning/academic-assessment-runtime.js"
  errors << "Pilot route mismatch" unless data.dig("pilot","route") == "/mcq-arena/academic/botany-cell-biology-mcq-1/"
end

if CONTRACT.file?
  doc = read_utf8(CONTRACT)
  [
    "Attempt → Feedback → Repair → Reattempt",
    "assets/js/learning/academic-assessment-runtime.js",
    "_mcq-arena/academic/botany-cell-biology-mcq-1.md",
    "/biology/hsc-corner/botany/",
    "A visible score or Restart button alone is not sufficient."
  ].each do |needle|
    errors << "Runtime contract missing: #{needle}" unless doc.include?(needle)
  end
end

certification_mode = ENV.fetch("CERTIFICATION_MODE", "local")
comparison_base = ENV["PR_BASE_SHA"].to_s.strip
if comparison_base.empty?
  parent_stdout, parent_status = Open3.capture2e("git", "-C", ROOT.to_s, "rev-parse", "HEAD^")
  comparison_base = parent_status.success? ? parent_stdout.strip : BASE
end
bootstrap_pr = certification_mode == "pull_request" && comparison_base == BASE

if bootstrap_pr
  styles = INTERACTIVE.map do |relative|
    source = read_utf8(ROOT.join(relative))
    source[/<style>([\s\S]*?)<\/style>/i, 1].to_s
  end
  errors << "Interactive assessment style block missing" if styles.any?(&:empty?)
  errors << "Five interactive assessment style blocks are no longer identical; refresh D-03 census" unless styles.uniq.length == 1

  MISSING_LOCAL_RUNTIME.each do |relative|
    source = read_utf8(ROOT.join(relative))
    errors << "#{relative} no longer calls initQuiz; refresh D-03 census" unless source.include?("initQuiz(")
    errors << "#{relative} unexpectedly defines initQuiz; refresh D-03 census" if source.match?(/function\s+initQuiz/)
    errors << "#{relative} unexpectedly defines submitQuiz; refresh D-03 census" if source.match?(/function\s+submitQuiz/)
  end

  owner = read_utf8(ROOT.join(LEGACY_OWNER))
  errors << "Animal Diversity legacy initQuiz definition missing" unless owner.match?(/function\s+initQuiz/)
  errors << "Animal Diversity legacy submitQuiz definition missing" unless owner.match?(/function\s+submitQuiz/)

  standalone = read_utf8(ROOT.join(STANDALONE))
  errors << "Chordata standalone runtime evidence missing" unless standalone.include?("function submitJSQuiz")
  errors << "Chordata legacy diagnostic completion evidence missing" unless standalone.include?("Diagnostic Complete")

  static_source = read_utf8(ROOT.join(STATIC_SET))
  errors << "Digestive static-set census changed; script now present" if static_source.match?(/<script[\s>]/i)
  errors << "Digestive static-set census changed; inline style now present" if static_source.match?(/<style[\s>]/i)

  INTERACTIVE.each do |relative|
    source = read_utf8(ROOT.join(relative))
    errors << "#{relative} unexpectedly references generated mcq-engine.js" if source.include?("mcq-engine.js")
    errors << "#{relative} unexpectedly includes legacy mcq-arena component" if source.include?("components/mcq-arena.html")
  end
end

if STATE.file?
  state = read_utf8(STATE)
  if bootstrap_pr
    errors << "CONV04_STATE must identify D-03" unless state.include?("phase: CONV-04D-03")
    errors << "CONV04_STATE must bind D-03 base" unless state.include?(BASE)
    errors << "D-03 learner authoring must remain frozen" unless state.include?("learner_content_authoring: frozen")
    allowlist_line = state.lines.find { |line| line.start_with?("learner_mutation_allowlist:") }.to_s.strip
    errors << "D-03 learner allowlist must be empty" unless allowlist_line == "learner_mutation_allowlist:"
  else
    errors << "CONV-04 programme identity missing" unless state.include?("programme: CONV-04")
    phase_line = state.lines.find { |line| line.start_with?("phase:") }.to_s.strip
    errors << "CONV04_STATE must identify a valid CONV-04 phase" unless phase_line.match?(/\Aphase:\s+CONV-04[A-Z](?:-\d+)?(?:-[A-Z0-9]+)?\z/)
  end
end

stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
  if bootstrap_pr
    unexpected = changed - ALLOWED_FILES.sort
    missing = ALLOWED_FILES.sort - changed
    errors << "Unexpected D-03 changed files: #{unexpected.join(', ')}" unless unexpected.empty?
    errors << "Expected D-03 files not changed: #{missing.join(', ')}" unless missing.empty?
  else
    frozen_changes = changed & FROZEN_D03_ARTIFACTS
    errors << "Later D phase changed frozen D-03 contract artifacts: #{frozen_changes.join(', ')}" unless frozen_changes.empty?
  end
else
  errors << "Unable to inspect D-03 changed-file scope: #{stdout.strip}"
end

if errors.empty?
  puts "CONV-04D-03 Authored Assessment Runtime Contract: PASS"
  exit 0
end

warn "CONV-04D-03 Authored Assessment Runtime Contract: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
