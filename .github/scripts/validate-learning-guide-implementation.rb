#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "66ee179e5f9b72338e50cf87aeec8307e27f344c"
MANIFEST_PATH = ROOT.join("_data/academic/learning_guide_implementation_v1.json")
ROUTE_PATH = ROOT.join("_pages/utility/learn.md")
CTA_PATH = ROOT.join("_includes/education/learning-guide-cta.html")
LEDGER_PATH = ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
DOC_PATH = ROOT.join("docs/academic/conv04/LEARNING_GUIDE_IMPLEMENTATION.md")
STATE_PATH = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
BROWSER_PATH = ROOT.join(".github/scripts/learning-guide-browser-certification.mjs")
WORKFLOW_PATH = ROOT.join(".github/workflows/learning-guide-implementation-certification.yml")

ALLOWED_FILES = %w[
  .github/scripts/learning-guide-browser-certification.mjs
  .github/scripts/validate-learning-guide-implementation.rb
  .github/workflows/learning-guide-implementation-certification.yml
  _data/academic/learning_guide_implementation_v1.json
  _includes/education/learning-guide-cta.html
  _pages/utility/learn.md
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/CONV04_STATE.md
  docs/academic/conv04/LEARNING_GUIDE_IMPLEMENTATION.md
].freeze

CYCLE = %w[Understand Retrieve Explain Apply Reflect Repair].freeze
FRAMEWORK_URLS = %w[
  /frameworks/lolo-lala/
  /frameworks/bloom-taxonomy/
  /frameworks/cq-studio/
  /frameworks/assessment-rubric/
  /frameworks/practical-framework/
].freeze

errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def fm_value(source, key)
  lines = source.lines
  return nil unless lines.first&.strip == "---"

  finish = nil
  lines.each_with_index do |line, index|
    next if index.zero?
    if line.strip == "---"
      finish = index
      break
    end
  end
  return nil unless finish

  fm = lines[1...finish].join
  match = fm.match(/^#{Regexp.escape(key)}:\s*(.+?)\s*$/)
  return nil unless match

  value = match[1].strip
  value = value[1..-2] if value.length >= 2 &&
    ((value.start_with?('"') && value.end_with?('"')) ||
     (value.start_with?("'") && value.end_with?("'")))
  value
end

[
  MANIFEST_PATH, ROUTE_PATH, CTA_PATH, LEDGER_PATH, DOC_PATH,
  STATE_PATH, BROWSER_PATH, WORKFLOW_PATH
].each do |path|
  errors << "Missing required C-02 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

manifest = {}
if MANIFEST_PATH.file?
  begin
    manifest = JSON.parse(read_utf8(MANIFEST_PATH))
  rescue JSON::ParserError => e
    errors << "Implementation manifest JSON invalid: #{e.message}"
  end
end

unless manifest.empty?
  errors << "Manifest schema mismatch" unless manifest["schema"] == "lbfl-learning-guide-implementation-v1"
  errors << "Manifest version mismatch" unless manifest["version"] == "CONV-04C-02-1.0.0"
  errors << "Manifest authorized base mismatch" unless manifest["authorized_base"] == BASE
  errors << "Manifest phase mismatch" unless manifest["phase"] == "CONV-04C-02"

  route = manifest["route"] || {}
  expected_route = {
    "title" => "How to Learn with LBFL",
    "permalink" => "/learn/",
    "source_file" => "_pages/utility/learn.md",
    "layout" => "single",
    "academic_system" => "v1",
    "academic_role" => "academic_gateway",
    "lang" => "en",
    "learning_guide" => "canonical",
    "enforcement" => "strict"
  }
  errors << "Manifest route contract mismatch" unless route == expected_route
  errors << "Canonical cycle mismatch" unless manifest["canonical_cycle"] == CYCLE

  urls = Array(manifest["specialist_references"]).map { |item| item["url"] }
  errors << "Specialist framework map mismatch" unless urls == FRAMEWORK_URLS
  errors << "Gateway CTA must remain not injected in C-02" unless manifest["gateway_cta_activation"] == "created-not-injected"
end

if ROUTE_PATH.file?
  route = read_utf8(ROUTE_PATH)
  {
    "title" => "How to Learn with LBFL",
    "layout" => "single",
    "permalink" => "/learn/",
    "academic_system" => "v1",
    "academic_role" => "academic_gateway",
    "lang" => "en",
    "learning_guide" => "canonical"
  }.each do |key, expected|
    actual = fm_value(route, key)
    errors << "Route front matter #{key} expected #{expected.inspect}, got #{actual.inspect}" unless actual == expected
  end

  errors << "Route must not contain inline style" if route.match?(/<style\b/i) || route.match?(/\sstyle\s*=/i)
  errors << "Route must not require inline script" if route.match?(/<script\b/i)

  CYCLE.each do |stage|
    errors << "Missing canonical stage #{stage}" unless route.include?("data-learning-stage=\"#{stage}\"")
  end

  FRAMEWORK_URLS.each do |url|
    errors << "Missing framework link #{url}" unless route.include?(url)
  end

  errors << "Route must use Academic stepper" unless route.include?('class="lbfl-academic-stepper"')
  errors << "Route must use Academic framework grid" unless route.include?('data-framework-map="specialist-references"')
end

if CTA_PATH.file?
  cta = read_utf8(CTA_PATH)
  errors << "CTA must link to canonical /learn/" unless cta.include?("/learn/")
  errors << "CTA must name the canonical guide" unless cta.include?("How to Learn with LBFL")
  errors << "CTA must expose the canonical cycle" unless cta.include?("Understand → Retrieve → Explain → Apply → Reflect → Repair")
  errors << "CTA must not contain inline style/script" if cta.match?(/<style\b|<script\b|\sstyle\s*=/i)
end

if LEDGER_PATH.file?
  begin
    ledger = JSON.parse(read_utf8(LEDGER_PATH))
    matches = Array(ledger["routes"]).select { |r| r["id"] == "learning-guide" || r["canonical_route"] == "/learn/" }
    if matches.length != 1
      errors << "Ledger must contain exactly one learning-guide /learn/ route"
    else
      entry = matches.first
      errors << "Ledger source mismatch" unless entry["source_file"] == "_pages/utility/learn.md"
      errors << "Ledger role mismatch" unless entry["academic_role"] == "academic_gateway"
      errors << "Ledger language mismatch" unless entry["language"] == "en"
      errors << "Ledger learning-guide owner mismatch" unless entry["learning_guide_owner"] == "canonical"
      errors << "Ledger must promote /learn/ to strict" unless entry["enforcement"] == "strict"
      errors << "Strict /learn/ source_debt must be empty" unless Array(entry["source_debt"]).empty?
      errors << "Strict /learn/ live_debt must be empty" unless Array(entry["live_debt"]).empty?
    end
  rescue JSON::ParserError => e
    errors << "Academic route ledger invalid JSON: #{e.message}"
  end
end

if STATE_PATH.file?
  state = read_utf8(STATE_PATH)
  errors << "CONV04_STATE must identify phase CONV-04C-02" unless state.include?("phase: CONV-04C-02")
  errors << "CONV04_STATE must bind exact C-02 base" unless state.include?(BASE)
  errors << "Existing learning-method cleanup must remain frozen" unless state.include?("existing_learning_method_cleanup: frozen")
  errors << "Gateway CTA injection must remain deferred" unless state.include?("gateway_cta_injection: deferred")
end

if DOC_PATH.file?
  doc = read_utf8(DOC_PATH)
  errors << "Implementation document missing canonical route" unless doc.include?("/learn/")
  errors << "Implementation document missing canonical cycle" unless doc.include?("Understand → Retrieve → Explain → Apply → Reflect → Repair")
  errors << "Implementation document must defer gateway injection" unless doc.include?("without injecting it into legacy gateways")
end

if BROWSER_PATH.file?
  browser = read_utf8(BROWSER_PATH)
  %w[320 390 768 1280 1440].each do |width|
    errors << "Browser matrix missing #{width}px" unless browser.include?("width:#{width}")
  end
  errors << "Browser certification must run Axe" unless browser.include?("axe.run")
  errors << "Browser certification must test no-JavaScript" unless browser.include?("javaScriptEnabled:false")
  errors << "Browser certification must test text spacing" unless browser.include?("letter-spacing")
end

if WORKFLOW_PATH.file?
  workflow = read_utf8(WORKFLOW_PATH)
  errors << "Workflow must bind exact candidate SHA" unless workflow.include?("CANDIDATE_SHA")
  errors << "Workflow must bind PR base SHA" unless workflow.include?("PR_BASE_SHA")
  errors << "Workflow must run implementation validator" unless workflow.include?("validate-learning-guide-implementation.rb")
  errors << "Workflow must run browser certification" unless workflow.include?("learning-guide-browser-certification.mjs")
end

comparison_base = ENV.fetch("PR_BASE_SHA", BASE)
stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
  unexpected = changed - ALLOWED_FILES.sort
  missing = ALLOWED_FILES.sort - changed if comparison_base == BASE
  errors << "Unexpected C-02 changed files: #{unexpected.join(', ')}" unless unexpected.empty?
  errors << "Expected C-02 files not changed: #{missing.join(', ')}" if missing && !missing.empty?
else
  errors << "Unable to inspect changed-file scope: #{stdout.strip}"
end

if errors.empty?
  puts "CONV-04C-02 Learning Guide implementation: PASS"
  exit 0
end

warn "CONV-04C-02 Learning Guide implementation: FAIL"
errors.each { |error| warn "- #{error}" }
exit 1
