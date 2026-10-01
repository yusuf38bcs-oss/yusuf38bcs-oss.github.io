#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
LEDGER = ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
REPORT = ROOT.join("academic-surface-contract-report.json")

ALLOWED_STATES = %w[inventory progressive strict].freeze
ALLOWED_ROLES = %w[
  platform_home academic_gateway chapter_index lecture assessment_gateway
  assessment practical revision reflection_gateway reflection application
].freeze
ALLOWED_SOURCE_DEBT = %w[
  missing_academic_role missing_academic_system missing_lang legacy_language_key
  lang_mismatch role_mismatch academic_system_mismatch inline_style
  escaped_source_comment embedded_full_mcq local_boundary_block
  category_collection_mismatch stale_homepage_course_count
].freeze
ALLOWED_LIVE_DEBT = %w[
  rendered_boundary_duplication rendered_language_mismatch
  rendered_empty_assessment_state rendered_word_fragmentation
  rendered_blank_hero_space rendered_low_contrast
].freeze
ALLOWED_SYSTEM_DEBT = %w[
  global_hero_85vh global_overflow_anywhere multi_layer_override_stack
  late_lesson_design_stylesheet
].freeze

errors = []
warnings = []
route_reports = []

def add_error(errors, message)
  errors << message
end

def add_warning(warnings, message)
  warnings << message
end

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def front_matter(source)
  lines = source.lines
  return "" unless lines.first&.strip == "---"

  finish = nil
  lines.each_with_index do |line, idx|
    next if idx.zero?
    if line.strip == "---"
      finish = idx
      break
    end
  end
  return "" unless finish

  lines[1...finish].join
end

def fm_value(source, key)
  fm = front_matter(source)
  match = fm.match(/^#{Regexp.escape(key)}:\s*(.+?)\s*$/)
  return nil unless match

  value = match[1].strip
  value = value[1..-2] if value.length >= 2 &&
    ((value.start_with?('"') && value.end_with?('"')) ||
     (value.start_with?("'") && value.end_with?("'")))
  value
end

def route_findings(route, source, combined_source)
  findings = []
  role = route.fetch("academic_role")

  academic_role = fm_value(source, "academic_role")
  academic_system = fm_value(source, "academic_system")
  lang = fm_value(source, "lang")
  legacy_language = fm_value(source, "language")

  findings << "missing_academic_role" if academic_role.nil? || academic_role.empty?
  findings << "missing_academic_system" if academic_system.nil? || academic_system.empty?
  findings << "missing_lang" if lang.nil? || lang.empty?

  if legacy_language && (lang.nil? || lang.empty? || legacy_language != lang)
    findings << "legacy_language_key"
  end

  if lang && !lang.empty? && lang != route.fetch("language")
    findings << "lang_mismatch"
  end

  if academic_role && !academic_role.empty? && academic_role != role
    findings << "role_mismatch"
  end

  if academic_system && !academic_system.empty? && academic_system != "v1"
    findings << "academic_system_mismatch"
  end

  findings << "inline_style" if source.match?(/<style\b/i) || source.match?(/\sstyle\s*=/i)
  findings << "escaped_source_comment" if source.match?(/&lt;!--[^\n]{0,200}adsense-policy/i)

  if role == "lecture" &&
     source.match?(/Interactive MCQ Practice|data-lbfl-quiz|lbfl-mcq-card/i)
    findings << "embedded_full_mcq"
  end

  if route["boundary_owner"] == "layout"
    markdown_boundary = source.match?(/^[#]{1,4}\s+(?:শিক্ষাগত সীমা|শিক্ষামূলক সীমা|Educational Boundary|Educational Note)/i)
    html_boundary = source.match?(/class=["'][^"']*\bboundary\b[^"']*["'][^>]*>[\s\S]{0,300}<h[1-4][^>]*>\s*(?:শিক্ষাগত সীমা|শিক্ষামূলক সীমা|Educational Boundary|Educational Note)/i)
    findings << "local_boundary_block" if markdown_boundary || html_boundary
  end

  if role == "assessment_gateway" && source.include?('site.categories["MCQ"]')
    findings << "category_collection_mismatch"
  end

  if role == "platform_home" &&
     combined_source.include?("Six Functions. One Living System.") &&
     !combined_source.include?("lecture-07-cell-wall-vacuole")
    findings << "stale_homepage_course_count"
  end

  findings.uniq.sort
end

def system_findings(root)
  findings = []

  omega = read_utf8(root.join("_sass/layout/_omega-overrides.scss"))
  if omega.match?(/min-height:\s*85(?:d)?vh/i)
    findings << "global_hero_85vh"
  end

  synaptic = read_utf8(root.join("assets/css/synaptic-overrides.css"))
  hotfix = read_utf8(root.join("assets/css/production-hotfix.css"))
  if synaptic.match?(/overflow-wrap:\s*anywhere/i) ||
     hotfix.match?(/overflow-wrap:\s*anywhere/i)
    findings << "global_overflow_anywhere"
  end

  head = read_utf8(root.join("_includes/head/head.html"))
  main = read_utf8(root.join("assets/css/main.scss"))
  if head.include?("synaptic-overrides.css") &&
     head.include?("production-hotfix.css") &&
     main.include?('layout/omega-overrides')
    findings << "multi_layer_override_stack"
  end

  footer = read_utf8(root.join("_includes/footer/custom.html"))
  if footer.include?("lbfl-lesson-design.css")
    findings << "late_lesson_design_stylesheet"
  end

  findings.uniq.sort
end

unless LEDGER.file?
  warn "ACADEMIC SURFACE CONTRACT FAIL: ledger missing: #{LEDGER}"
  exit 1
end

begin
  ledger = JSON.parse(read_utf8(LEDGER))
rescue JSON::ParserError => e
  warn "ACADEMIC SURFACE CONTRACT FAIL: invalid JSON: #{e.message}"
  exit 1
end

add_error(errors, "Unexpected schema") unless ledger["schema"] == "lbfl-academic-surface-contract-v1"
add_error(errors, "Missing version") if ledger["version"].to_s.empty?
add_error(errors, "Missing authorized_base_sha") if ledger["authorized_base_sha"].to_s.empty?

states = ledger.dig("enforcement_model", "states")
add_error(errors, "Enforcement states must be inventory/progressive/strict") unless states == ALLOWED_STATES

roles = ledger["allowed_roles"]
add_error(errors, "Ledger allowed_roles drifted from validator") unless roles == ALLOWED_ROLES

source_vocab = ledger["allowed_source_debt"]
add_error(errors, "Ledger source-debt vocabulary drifted from validator") unless source_vocab == ALLOWED_SOURCE_DEBT

live_vocab = ledger["allowed_live_debt"]
add_error(errors, "Ledger live-debt vocabulary drifted from validator") unless live_vocab == ALLOWED_LIVE_DEBT

routes = ledger["routes"]
add_error(errors, "routes must be a non-empty array") unless routes.is_a?(Array) && !routes.empty?
routes = [] unless routes.is_a?(Array)

ids = {}
canonical_routes = {}

routes.each_with_index do |route, idx|
  unless route.is_a?(Hash)
    add_error(errors, "route #{idx + 1} must be an object")
    next
  end

  required = %w[
    id canonical_route source_file academic_role language boundary_owner
    learning_guide_owner assessment_owner enforcement source_debt live_debt
  ]
  required.each do |key|
    add_error(errors, "route #{idx + 1} missing #{key}") unless route.key?(key)
  end

  id = route["id"].to_s
  canonical = route["canonical_route"].to_s
  source_file = route["source_file"].to_s
  enforcement = route["enforcement"].to_s
  role = route["academic_role"].to_s

  add_error(errors, "route #{idx + 1} has empty id") if id.empty?
  add_error(errors, "duplicate route id: #{id}") if ids.key?(id)
  ids[id] = true unless id.empty?

  unless canonical.start_with?("/") && canonical.end_with?("/")
    add_error(errors, "#{id}: canonical_route must start and end with /")
  end
  add_error(errors, "duplicate canonical route: #{canonical}") if canonical_routes.key?(canonical)
  canonical_routes[canonical] = id unless canonical.empty?

  add_error(errors, "#{id}: invalid academic_role #{role}") unless ALLOWED_ROLES.include?(role)
  add_error(errors, "#{id}: invalid enforcement #{enforcement}") unless ALLOWED_STATES.include?(enforcement)

  declared_source_debt = Array(route["source_debt"])
  declared_live_debt = Array(route["live_debt"])

  unknown_source = declared_source_debt - ALLOWED_SOURCE_DEBT
  unknown_live = declared_live_debt - ALLOWED_LIVE_DEBT
  add_error(errors, "#{id}: unknown source_debt #{unknown_source.join(', ')}") unless unknown_source.empty?
  add_error(errors, "#{id}: unknown live_debt #{unknown_live.join(', ')}") unless unknown_live.empty?
  add_error(errors, "#{id}: duplicate source_debt entries") unless declared_source_debt.uniq.length == declared_source_debt.length
  add_error(errors, "#{id}: duplicate live_debt entries") unless declared_live_debt.uniq.length == declared_live_debt.length

  source_path = ROOT.join(source_file)
  unless source_path.file?
    add_error(errors, "#{id}: source file missing: #{source_file}")
    next
  end

  support_files = Array(route["support_files"])
  missing_support = support_files.reject { |p| ROOT.join(p).file? }
  unless missing_support.empty?
    add_error(errors, "#{id}: support file(s) missing: #{missing_support.join(', ')}")
  end

  source = read_utf8(source_path)
  combined = ([source_file] + support_files).select { |p| ROOT.join(p).file? }.map do |p|
    read_utf8(ROOT.join(p))
  end.join("\n")

  detected = route_findings(route, source, combined)

  case enforcement
  when "inventory"
    detected.each { |d| add_warning(warnings, "#{id}: inventory finding #{d}") }
  when "progressive"
    undeclared = detected - declared_source_debt
    stale = declared_source_debt - detected
    add_error(errors, "#{id}: undeclared progressive debt #{undeclared.join(', ')}") unless undeclared.empty?
    add_error(errors, "#{id}: declared debt no longer detected #{stale.join(', ')}") unless stale.empty?
  when "strict"
    add_error(errors, "#{id}: strict route declares source debt") unless declared_source_debt.empty?
    add_error(errors, "#{id}: strict route declares live debt") unless declared_live_debt.empty?
    add_error(errors, "#{id}: strict route detected #{detected.join(', ')}") unless detected.empty?

    add_error(errors, "#{id}: strict academic_role mismatch") unless fm_value(source, "academic_role") == role
    add_error(errors, "#{id}: strict academic_system must be v1") unless fm_value(source, "academic_system") == "v1"
    add_error(errors, "#{id}: strict lang mismatch") unless fm_value(source, "lang") == route["language"]
  end

  route_reports << {
    "id" => id,
    "route" => canonical,
    "source_file" => source_file,
    "role" => role,
    "enforcement" => enforcement,
    "declared_source_debt" => declared_source_debt.sort,
    "detected_source_debt" => detected,
    "declared_live_debt" => declared_live_debt.sort
  }
end

declared_system = Array(ledger.dig("system", "source_debt")).sort
unknown_system = declared_system - ALLOWED_SYSTEM_DEBT
add_error(errors, "Unknown system debt: #{unknown_system.join(', ')}") unless unknown_system.empty?

detected_system = system_findings(ROOT)
system_enforcement = ledger.dig("system", "enforcement")

unless ALLOWED_STATES.include?(system_enforcement)
  add_error(errors, "Invalid system enforcement #{system_enforcement.inspect}")
end

case system_enforcement
when "inventory"
  detected_system.each { |d| add_warning(warnings, "system inventory finding #{d}") }
when "progressive"
  undeclared = detected_system - declared_system
  stale = declared_system - detected_system
  add_error(errors, "Undeclared system debt: #{undeclared.join(', ')}") unless undeclared.empty?
  add_error(errors, "Declared system debt no longer detected: #{stale.join(', ')}") unless stale.empty?
when "strict"
  add_error(errors, "Strict system still declares debt") unless declared_system.empty?
  add_error(errors, "Strict system still detects #{detected_system.join(', ')}") unless detected_system.empty?
end

report = {
  "schema" => ledger["schema"],
  "version" => ledger["version"],
  "authorized_base_sha" => ledger["authorized_base_sha"],
  "routes" => route_reports.length,
  "progressive_routes" => route_reports.count { |r| r["enforcement"] == "progressive" },
  "strict_routes" => route_reports.count { |r| r["enforcement"] == "strict" },
  "system_enforcement" => system_enforcement,
  "declared_system_debt" => declared_system,
  "detected_system_debt" => detected_system,
  "warnings" => warnings,
  "errors" => errors,
  "route_reports" => route_reports,
  "result" => errors.empty? ? "PASS" : "FAIL"
}

File.write(REPORT, JSON.pretty_generate(report) + "\n", encoding: "UTF-8")
puts JSON.pretty_generate(report)

exit(errors.empty? ? 0 : 1)
