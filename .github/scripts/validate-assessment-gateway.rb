#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "ee7a10d419a1ee970a1a18b8eda98ffce7b32923"
GATEWAY = ROOT.join("_mcq-arena/academic/index.md")
MANIFEST = ROOT.join("_data/academic/assessment_gateway_v1.json")
DOC = ROOT.join("docs/academic/conv04/ASSESSMENT_GATEWAY_IMPLEMENTATION.md")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
LEDGER = ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
BROWSER = ROOT.join(".github/scripts/assessment-gateway-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/assessment-gateway-certification.yml")
SITE = ROOT.join("_site/mcq-arena/academic/index.html")

ALLOWED_FILES = %w[
  .github/scripts/assessment-gateway-browser-certification.mjs
  .github/scripts/validate-assessment-gateway.rb
  .github/workflows/assessment-gateway-certification.yml
  _data/academic/assessment_gateway_v1.json
  _mcq-arena/academic/index.md
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/ASSESSMENT_GATEWAY_IMPLEMENTATION.md
  docs/academic/conv04/CONV04_STATE.md
].freeze

EXPECTED_MODULES = %w[
  /mcq-arena/academic/botany-cell-biology-mcq-1/
  /mcq-arena/academic/botany-cell-division-mcq-2/
  /mcq-arena/academic/digestive-system-mcq-set-01/
  /mcq-arena/academic/zoology-animal-diversity-mcq-1/
  /mcq-arena/academic/zoology-chordata-arthropoda-mcq-pro/
  /mcq-arena/academic/zoology-respiratory-system-mcq-5/
].freeze

FORBIDDEN = [
  "Diagnostic Node",
  "diagnostic modules",
  "neural retention",
  "cognitive models",
  "cognitive gaps"
].freeze

errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

[GATEWAY, MANIFEST, DOC, STATE, LEDGER, BROWSER, WORKFLOW].each do |path|
  errors << "Missing D-02 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

if GATEWAY.file?
  source = read_utf8(GATEWAY)
  errors << "Academic v1 opt-in missing" unless source.match?(/^academic_system:\s*v1\s*$/)
  errors << "assessment_gateway role missing" unless source.match?(/^academic_role:\s*assessment_gateway\s*$/)
  errors << "lang: en missing" unless source.match?(/^lang:\s*en\s*$/)
  errors << "legacy language key remains" if source.match?(/^language:/)
  errors << "canonical learning guide ownership missing" unless source.match?(/^learning_guide:\s*canonical\s*$/)
  errors << "post-category discovery remains" if source.include?('site.categories["MCQ"]')
  errors << "mcq-arena collection discovery missing" unless source.include?('site.collections | where: "label", "mcq-arena" | first')
  errors << "Academic route filtering missing" unless source.include?('item.url contains "/mcq-arena/academic/"')
  errors << "canonical repair loop missing" unless source.include?("Attempt → Feedback → Repair → Reattempt")
  errors << "Botany source-return hub missing" unless source.include?("/biology/hsc-corner/botany/")
  errors << "Zoology source-return hub missing" unless source.include?("/biology/hsc-corner/zoology/")
  errors << "D-02 must remove inline style blocks" if source.include?("<style")
  errors << "D-02 must remove inline style attributes" if source.match?(/\sstyle=/)
  FORBIDDEN.each { |term| errors << "Forbidden assessment framing remains: #{term}" if source.downcase.include?(term.downcase) }
end

if MANIFEST.file?
  data = JSON.parse(read_utf8(MANIFEST))
  errors << "Manifest schema mismatch" unless data["schema"] == "lbfl-assessment-gateway-v1"
  errors << "Manifest version mismatch" unless data["version"] == "CONV-04D-02-1.0.0"
  errors << "Manifest base mismatch" unless data["authorized_base"] == BASE
  errors << "Expected module count mismatch" unless data["expected_module_count"] == 6
  errors << "Expected module routes mismatch" unless data["expected_modules"] == EXPECTED_MODULES
  errors << "Canonical loop mismatch" unless data["canonical_loop"] == %w[Attempt Feedback Repair Reattempt]
  errors << "Botany source strategy mismatch" unless data.dig("source_return","botany") == "/biology/hsc-corner/botany/"
  errors << "Zoology source strategy mismatch" unless data.dig("source_return","zoology") == "/biology/hsc-corner/zoology/"
end

if STATE.file?
  state = read_utf8(STATE)
  errors << "CONV04_STATE must identify D-02" unless state.include?("phase: CONV-04D-02")
  errors << "CONV04_STATE must bind D-02 base" unless state.include?(BASE)
  errors << "Exact D-02 learner authority missing" unless state.include?("learner_mutation_allowlist:\n  - _mcq-arena/academic/index.md")
  errors << "BOT-08 must remain frozen" unless state.include?("bot_08: frozen")
end

if LEDGER.file?
  ledger = JSON.parse(read_utf8(LEDGER))
  entry = ledger.fetch("routes").find { |route| route["id"] == "mcq-academic-gateway" }
  errors << "MCQ gateway ledger entry missing" unless entry
  if entry
    errors << "Ledger role mismatch" unless entry["academic_role"] == "assessment_gateway"
    errors << "Ledger enforcement must be strict" unless entry["enforcement"] == "strict"
    errors << "Ledger source debt must be empty" unless entry["source_debt"] == []
    errors << "Ledger live debt must be empty" unless entry["live_debt"] == []
  end
end

if DOC.file?
  doc = read_utf8(DOC)
  errors << "D-02 document missing collection repair" unless doc.include?("authoritative `mcq-arena` Jekyll collection")
  errors << "D-02 document missing canonical loop" unless doc.include?("Attempt → Feedback → Repair → Reattempt")
  errors << "D-02 document must preserve assessment banks" unless doc.include?("does not")
end

if SITE.file?
  html = read_utf8(SITE)
  errors << "Rendered gateway missing Academic v1 surface" unless html.include?("data-lbfl-academic-surface=\"v1\"")
  errors << "Rendered gateway role mismatch" unless html.include?('data-lbfl-academic-role="assessment_gateway"')
  errors << "Rendered module count must be six" unless html.scan(/<article[^>]*\sdata-assessment-module(?:\s|>)/).length == 6
  errors << "Rendered start-link count must be six" unless html.scan("data-assessment-start").length == 6
  errors << "Rendered source-link count must be six" unless html.scan("data-assessment-source").length == 6
  EXPECTED_MODULES.each do |route|
    errors << "Rendered expected module missing: #{route}" unless html.include?("href=\"#{route}\"") || html.include?("href='#{route}'")
  end
  errors << "Rendered false empty state remains" if html.include?("No diagnostic modules found")
  FORBIDDEN.each { |term| errors << "Rendered forbidden assessment framing remains: #{term}" if html.downcase.include?(term.downcase) }
  errors << "Rendered raw Liquid detected" if html.match?(/\{\{|\{%/)
end

comparison_base = ENV["PR_BASE_SHA"].to_s.strip
comparison_base = BASE if comparison_base.empty?
stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
  unexpected = changed - ALLOWED_FILES.sort
  missing = ALLOWED_FILES.sort - changed if comparison_base == BASE
  errors << "Unexpected D-02 changed files: #{unexpected.join(', ')}" unless unexpected.empty?
  errors << "Expected D-02 files not changed: #{missing.join(', ')}" if missing && !missing.empty?
else
  errors << "Unable to inspect D-02 changed-file scope: #{stdout.strip}"
end

if errors.empty?
  puts "CONV-04D-02 Academic MCQ Gateway: PASS"
  exit 0
end

warn "CONV-04D-02 Academic MCQ Gateway: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
