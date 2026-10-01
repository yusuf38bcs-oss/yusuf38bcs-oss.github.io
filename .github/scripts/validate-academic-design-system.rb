#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
MANIFEST_PATH = ROOT.join("_data/academic/design_system_v1.json")
CSS_PATH = ROOT.join("assets/css/academic-design-system.css")
HEAD_PATH = ROOT.join("_includes/head/head.html")
DEFAULT_LAYOUT = ROOT.join("_layouts/default.html")
HOMEPAGE_LAYOUT = ROOT.join("_layouts/homepage-v3.html")
SINGLE_LAYOUT = ROOT.join("_layouts/single.html")
CUSTOM_HEAD = ROOT.join("_includes/head/custom.html")
STATE_PATH = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
DOC_PATH = ROOT.join("docs/academic/conv04/ACADEMIC_DESIGN_SYSTEM.md")

EXPECTED_SCHEMA = "lbfl-academic-design-system-v1"
EXPECTED_VERSION = "CONV-04B-1.0.0"
EXPECTED_BASE = "9f20bfa7398db8c2e5f1dbdd3db61c43eef3e5bf"

ALLOWED_FILES = %w[
  .github/scripts/validate-academic-design-system.rb
  .github/workflows/academic-design-system-certification.yml
  _data/academic/design_system_v1.json
  _includes/head/head.html
  _includes/head/custom.html
  _layouts/default.html
  _layouts/homepage-v3.html
  _layouts/single.html
  assets/css/academic-design-system.css
  assets/css/production-hotfix.css
  docs/academic/conv04/ACADEMIC_DESIGN_SYSTEM.md
  docs/academic/conv04/CONV04_STATE.md
].freeze

EXPECTED_ROLES = %w[
  platform_home academic_gateway chapter_index lecture assessment_gateway
  assessment practical revision reflection_gateway reflection application
].freeze

EXPECTED_IMPORTANT_PROPERTIES = %w[
  min-height height overflow-wrap word-break
].freeze

errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def fail_if(errors, condition, message)
  errors << message if condition
end

[MANIFEST_PATH, CSS_PATH, HEAD_PATH, CUSTOM_HEAD, DEFAULT_LAYOUT, HOMEPAGE_LAYOUT, SINGLE_LAYOUT, STATE_PATH, DOC_PATH].each do |path|
  fail_if(errors, !path.file?, "Missing required CONV-04B file: #{path.relative_path_from(ROOT)}")
end

if MANIFEST_PATH.file?
  begin
    manifest = JSON.parse(read_utf8(MANIFEST_PATH))
  rescue JSON::ParserError => e
    errors << "Invalid design-system manifest JSON: #{e.message}"
    manifest = {}
  end

  fail_if(errors, manifest["schema"] != EXPECTED_SCHEMA, "Unexpected design-system schema")
  fail_if(errors, manifest["version"] != EXPECTED_VERSION, "Unexpected design-system version")
  fail_if(errors, manifest["authorized_base_sha"] != EXPECTED_BASE, "Design-system authorized base drift")
  fail_if(errors, manifest["roles"] != EXPECTED_ROLES, "Role vocabulary drifted from CONV-04A")

  activation = manifest["activation"] || {}
  fail_if(errors, activation.dig("front_matter", "academic_system") != "v1", "academic_system activation must be v1")
  fail_if(errors, activation["html_class"] != "lbfl-academic-v1", "HTML activation class mismatch")
  fail_if(errors, activation["article_attribute"] != "data-lbfl-academic-surface", "Article surface attribute mismatch")

  css = CSS_PATH.file? ? read_utf8(CSS_PATH) : ""
  Array(manifest["tokens"]).each do |token|
    fail_if(errors, !css.include?("#{token}:"), "Missing CSS token #{token}")
  end
  (manifest["components"] || {}).each_value do |class_name|
    fail_if(errors, !css.include?(".#{class_name}"), "Missing component class .#{class_name}")
  end

  fail_if(errors, css.match?(/min-height:\s*85(?:d)?vh/i), "Academic design system must not introduce 85vh hero forcing")
  fail_if(errors, css.match?(/overflow-wrap:\s*anywhere/i), "Academic design system must not use overflow-wrap:anywhere")
  fail_if(errors, css.match?(/word-break:\s*break-all/i), "Academic design system must not use word-break:break-all")

  selector_source = css.gsub(%r{/\*.*?\*/}m, "")
  selector_source.scan(/([^{}]+)\{/m).flatten.each do |prelude|
    prelude = prelude.strip
    next if prelude.empty? || prelude.start_with?("@")
    prelude.split(",").map(&:strip).reject(&:empty?).each do |selector|
      unless selector.start_with?("html.lbfl-academic-v1")
        errors << "Unscoped academic selector: #{selector.inspect}"
      end
    end
  end

  manifest_important = Array(manifest.dig("legacy_bridge", "allowed_important_properties"))
  fail_if(
    errors,
    manifest_important != EXPECTED_IMPORTANT_PROPERTIES,
    "Legacy bridge !important allowlist drifted from fixed validator policy"
  )
  css.each_line.with_index(1) do |line, line_no|
    next unless line.include?("!important")
    property = line.split(":", 2).first.to_s.strip
    unless EXPECTED_IMPORTANT_PROPERTIES.include?(property)
      errors << "Disallowed !important property #{property.inspect} at academic-design-system.css:#{line_no}"
    end
  end
end

if HEAD_PATH.file?
  head = read_utf8(HEAD_PATH)
  fail_if(errors, !head.include?("page.academic_system == 'v1'"), "Head must conditionally load academic v1")
  fail_if(errors, !head.include?("/assets/css/academic-design-system.css"), "Head must load academic-design-system.css")
end

if DEFAULT_LAYOUT.file?
  layout = read_utf8(DEFAULT_LAYOUT)
  fail_if(errors, !layout.include?("lbfl_academic_v1"), "Default layout missing academic v1 activation variable")
  fail_if(errors, !layout.include?("lbfl-academic-v1"), "Default layout missing academic v1 HTML class")
  fail_if(errors, !layout.include?("lbfl-academic-v1-active"), "Default layout missing academic v1 body class")
end

if HOMEPAGE_LAYOUT.file?
  layout = read_utf8(HOMEPAGE_LAYOUT)
  fail_if(errors, !layout.include?("page.academic_system == 'v1'"), "Homepage V3 missing academic v1 activation")
  fail_if(errors, !layout.include?("lbfl-academic-v1"), "Homepage V3 missing academic v1 HTML class")
  fail_if(errors, !layout.include?("data-lbfl-academic-surface=\"v1\""), "Homepage V3 missing academic surface metadata")
  fail_if(errors, !layout.include?("data-lbfl-academic-role="), "Homepage V3 missing academic role metadata")
end

if CUSTOM_HEAD.file?
  custom_head = read_utf8(CUSTOM_HEAD)
  fail_if(
    errors,
    !custom_head.include?("lbfl_zoology_route and page.academic_system != 'v1'"),
    "Academic v1 must not load the legacy Zoology stylesheet"
  )
  fail_if(
    errors,
    !custom_head.include?("unless page.academic_system == 'v1'"),
    "Academic v1 must not load the legacy respiratory stylesheet"
  )
end

production_hotfix_path = ROOT.join("assets/css/production-hotfix.css")
if production_hotfix_path.file?
  production_hotfix = read_utf8(production_hotfix_path)
  fail_if(
    errors,
    production_hotfix.match?(/^\s*\.layout--single\.wide\s/m),
    "Legacy wide-page hotfix must exclude Academic v1 surfaces"
  )
  fail_if(
    errors,
    !production_hotfix.include?(":where(body:not(.lbfl-academic-v1-active)).layout--single.wide"),
    "Legacy wide-page hotfix missing Academic v1 exclusion"
  )
end

if CSS_PATH.file?
  css = read_utf8(CSS_PATH)
  fail_if(errors, !css.include?(".educational-boundary strong"), "Academic v1 boundary strong-text theme missing")
  fail_if(errors, !css.include?(".educational-boundary span[lang=\"bn\"]"), "Academic v1 Bangla boundary theme missing")
  fail_if(errors, !css.include?("html.lbfl-academic-v1:not(.lbfl-home-v3-document)"), "Homepage V3 shell isolation missing")
end

if SINGLE_LAYOUT.file?
  layout = read_utf8(SINGLE_LAYOUT)
  fail_if(errors, !layout.include?("data-lbfl-academic-surface=\"v1\""), "Single layout missing academic surface attribute")
  fail_if(errors, !layout.include?("data-lbfl-academic-role="), "Single layout missing academic role attribute")
  fail_if(errors, !layout.include?("lbfl-academic-role--"), "Single layout missing academic role class")
end

if STATE_PATH.file?
  state = read_utf8(STATE_PATH)
  fail_if(errors, !state.include?("phase: CONV-04B"), "CONV04_STATE must identify phase CONV-04B")
  fail_if(errors, !state.include?(EXPECTED_BASE), "CONV04_STATE must bind the authorized base")
end

if DOC_PATH.file?
  doc = read_utf8(DOC_PATH)
  fail_if(errors, !doc.include?(EXPECTED_VERSION), "Academic Design System doc version mismatch")
  fail_if(errors, !doc.include?("academic_system: v1"), "Academic Design System doc must document explicit activation")
end

git_dir = ROOT.join(".git")
if git_dir.exist?
  candidate_state = STATE_PATH.file? ? read_utf8(STATE_PATH) : ""
  comparison_base = ENV.fetch("PR_BASE_SHA", EXPECTED_BASE)
  stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{comparison_base}...HEAD")
  if status.success?
    changed = stdout.lines.map(&:strip).reject(&:empty?).sort

    if candidate_state.include?("phase: CONV-04B")
      unexpected = changed - ALLOWED_FILES.sort
      missing = ALLOWED_FILES.sort - changed
      errors << "Unexpected CONV-04B changed files: #{unexpected.join(', ')}" unless unexpected.empty?
      errors << "Expected CONV-04B files not changed: #{missing.join(', ')}" unless missing.empty?
    end

    protected = changed.select do |path|
      path.start_with?("_biology/", "_mcq-arena/", "_socratic/", "workers/", "cloudflare/") ||
        path.match?(/admission/i)
    end
    errors << "Protected learner/Admission/Worker scope changed: #{protected.join(', ')}" unless protected.empty?
  else
    errors << "Unable to calculate candidate changed-file scope from #{comparison_base}: #{stdout.strip}"
  end
end

result = {
  "schema" => EXPECTED_SCHEMA,
  "version" => EXPECTED_VERSION,
  "authorized_base_sha" => EXPECTED_BASE,
  "allowed_files" => ALLOWED_FILES,
  "errors" => errors,
  "result" => errors.empty? ? "PASS" : "FAIL"
}

puts JSON.pretty_generate(result)
exit(errors.empty? ? 0 : 1)
