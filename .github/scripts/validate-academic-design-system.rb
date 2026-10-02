#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
MANIFEST_PATH = ROOT.join("_data/academic/design_system_v1.json")
CSS_PATH = ROOT.join("assets/css/academic-design-system.css")
PRODUCTION_HOTFIX_PATH = ROOT.join("assets/css/production-hotfix.css")
CERT_WORKFLOW_PATH = ROOT.join(".github/workflows/academic-design-system-certification.yml")
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

EXPECTED_TOKENS = %w[
  --lbfl-academic-paper
  --lbfl-academic-surface
  --lbfl-academic-soft
  --lbfl-academic-ink
  --lbfl-academic-muted
  --lbfl-academic-heading
  --lbfl-academic-link
  --lbfl-academic-accent
  --lbfl-academic-border
  --lbfl-academic-focus
  --lbfl-academic-radius
  --lbfl-academic-shadow
  --lbfl-academic-measure
  --lbfl-academic-space
].freeze

EXPECTED_COMPONENTS = {
  "grid" => "lbfl-academic-grid",
  "card" => "lbfl-academic-card",
  "lead" => "lbfl-academic-lead",
  "stepper" => "lbfl-academic-stepper",
  "comparison" => "lbfl-academic-comparison",
  "flow" => "lbfl-academic-flow",
  "term" => "lbfl-academic-term",
  "misconception" => "lbfl-academic-misconception",
  "evidence" => "lbfl-academic-evidence",
  "table_wrap" => "lbfl-academic-table-wrap",
  "callout" => "lbfl-academic-callout",
  "actions" => "lbfl-academic-actions",
  "button" => "lbfl-academic-button",
  "details" => "lbfl-academic-details",
  "tabs" => "lbfl-academic-tabs"
}.freeze

EXPECTED_ACCESSIBILITY = {
  "target_min_css_px" => 24,
  "preferred_control_css_px" => 40,
  "reflow_css_px" => 320,
  "text_spacing" => true,
  "keyboard_focus" => true,
  "reduced_motion" => true
}.freeze

EXPECTED_ACTIVATION = {
  "front_matter" => { "academic_system" => "v1" },
  "html_class" => "lbfl-academic-v1",
  "body_class" => "lbfl-academic-v1-active",
  "article_class" => "lbfl-academic-surface",
  "article_attribute" => "data-lbfl-academic-surface",
  "role_attribute" => "data-lbfl-academic-role"
}.freeze

EXPECTED_IMPORTANT_PROPERTIES = %w[
  min-height height overflow-wrap word-break
  background color padding border border-radius border-color
  font-family font-weight transition transform box-shadow cursor
].freeze

EXPECTED_HERO_IMPORTANT_SELECTORS = [
  "html.lbfl-academic-v1 .page__hero",
  "html.lbfl-academic-v1 .page__hero--overlay"
].sort.freeze

EXPECTED_READING_IMPORTANT_SELECTORS = [
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .page__content",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .page__content p",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .page__content li",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .page__content th",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .page__content td",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .page__content h1",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .page__content h2",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .page__content h3",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .page__content h4"
].sort.freeze

EXPECTED_ACADEMIC_STATIC_SHELL_SELECTORS = [
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) .masthead",
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) .breadcrumbs",
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) #main",
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) .page__footer",
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) .page__hero",
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) .page__hero--overlay"
].freeze

EXPECTED_ACADEMIC_SURFACE_PRIORITY_SELECTORS = [
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) body",
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) .initial-content",
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) #main",
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) .page",
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) [data-lbfl-academic-surface] .page__inner-wrap",
  "html.lbfl-academic-v1:not(.lbfl-home-v3-document) [data-lbfl-academic-surface] .page__content"
].sort.freeze

EXPECTED_ACADEMIC_ANCHOR_BUTTON_PRIORITY_SELECTORS = [
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] a.lbfl-academic-button",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] a.lbfl-academic-button:visited"
].sort.freeze

EXPECTED_ACADEMIC_BUTTON_PRIORITY_SELECTORS = [
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] button.lbfl-academic-button"
].freeze

EXPECTED_ACADEMIC_TAB_PRIORITY_SELECTORS = [
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] button.lbfl-academic-tab"
].freeze

EXPECTED_ACADEMIC_TAB_SELECTED_PRIORITY_SELECTORS = [
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] button.lbfl-academic-tab[aria-selected=\"true\"]"
].freeze

EXPECTED_ACADEMIC_DISABLED_CONTROL_PRIORITY_SELECTORS = [
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] button.lbfl-academic-button:disabled",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] button.lbfl-academic-tab:disabled"
].sort.freeze

EXPECTED_REDUCED_MOTION_TRANSITION_SELECTORS = [
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .neural-card",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .mi-question-card",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .mi-btn-calculate"
].sort.freeze

EXPECTED_REDUCED_MOTION_TRANSFORM_SELECTORS = [
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .neural-card:hover",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .mi-question-card:hover",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .mi-btn-calculate:hover",
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .mi-btn-calculate:active"
].sort.freeze

EXPECTED_REDUCED_MOTION_IMPORTANT_RULES = [
  {
    "selectors" => EXPECTED_REDUCED_MOTION_TRANSITION_SELECTORS,
    "declarations" => ["transition:none"]
  },
  {
    "selectors" => EXPECTED_REDUCED_MOTION_TRANSFORM_SELECTORS,
    "declarations" => ["transform:none"]
  }
].sort_by { |rule| rule["selectors"].join(",") }.freeze

EXPECTED_IMPORTANT_RULES = [
  {
    "selectors" => EXPECTED_HERO_IMPORTANT_SELECTORS,
    "declarations" => ["height:auto", "min-height:0"].sort
  },
  {
    "selectors" => EXPECTED_READING_IMPORTANT_SELECTORS,
    "declarations" => ["overflow-wrap:normal", "word-break:normal"].sort
  },
  {
    "selectors" => EXPECTED_ACADEMIC_SURFACE_PRIORITY_SELECTORS,
    "declarations" => ["background:var(--lbfl-academic-paper)"]
  },
  {
    "selectors" => EXPECTED_ACADEMIC_ANCHOR_BUTTON_PRIORITY_SELECTORS,
    "declarations" => [
      "background:var(--lbfl-academic-accent)",
      "border:2px solid var(--lbfl-academic-accent)",
      "color:#ffffff"
    ].sort
  },
  {
    "selectors" => EXPECTED_ACADEMIC_BUTTON_PRIORITY_SELECTORS,
    "declarations" => [
      "background:var(--lbfl-academic-accent)",
      "border:2px solid var(--lbfl-academic-accent)",
      "border-radius:0.7rem",
      "box-shadow:none",
      "color:#ffffff",
      "font-family:inherit",
      "font-weight:750",
      "padding:0.6rem 1rem",
      "transform:none",
      "transition:none"
    ].sort
  },
  {
    "selectors" => EXPECTED_ACADEMIC_TAB_PRIORITY_SELECTORS,
    "declarations" => [
      "background:var(--lbfl-academic-surface)",
      "border:1px solid var(--lbfl-academic-border)",
      "border-radius:0.65rem",
      "box-shadow:none",
      "color:var(--lbfl-academic-link)",
      "font-family:inherit",
      "font-weight:750",
      "padding:0.55rem 0.85rem",
      "transform:none",
      "transition:none"
    ].sort
  },
  {
    "selectors" => EXPECTED_ACADEMIC_TAB_SELECTED_PRIORITY_SELECTORS,
    "declarations" => [
      "background:var(--lbfl-academic-soft)",
      "border-color:var(--lbfl-academic-accent)",
      "color:var(--lbfl-academic-heading)"
    ].sort
  },
  {
    "selectors" => EXPECTED_ACADEMIC_DISABLED_CONTROL_PRIORITY_SELECTORS,
    "declarations" => [
      "background:#e2e8f0",
      "border-color:var(--lbfl-academic-border)",
      "color:#64748b",
      "cursor:not-allowed"
    ].sort
  },
  *EXPECTED_REDUCED_MOTION_IMPORTANT_RULES
].sort_by { |rule| rule["selectors"].join(",") }.freeze

ACADEMIC_SELECTOR_ROOT = /\Ahtml\.lbfl-academic-v1(?:\z|(?=[\s>+~.#:\[]))/.freeze

errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def fail_if(errors, condition, message)
  errors << message if condition
end

# Split a selector list only on top-level commas. Commas inside functional
# pseudo-classes, attribute selectors, quoted strings, or escaped sequences
# belong to the current selector.
def split_selector_list(prelude)
  selectors = []
  current = +""
  depth = 0
  quote = nil
  escaped = false

  prelude.each_char do |char|
    if escaped
      current << char
      escaped = false
      next
    end

    if char == "\\"
      current << char
      escaped = true
      next
    end

    if quote
      current << char
      quote = nil if char == quote
      next
    end

    case char
    when '"', "'"
      quote = char
      current << char
    when "(", "["
      depth += 1
      current << char
    when ")", "]"
      depth -= 1 if depth.positive?
      current << char
    when ","
      if depth.zero?
        selector = current.strip
        selectors << selector unless selector.empty?
        current = +""
      else
        current << char
      end
    else
      current << char
    end
  end

  selector = current.strip
  selectors << selector unless selector.empty?
  selectors
end

def blank_preserving_newlines(text)
  text.gsub(/[^\n]/, " ")
end

# Remove semicolon-terminated statement at-rules before selector-root checks.
# Block at-rules such as @media remain so nested selectors are still scanned.
def strip_statement_at_rules(source)
  output = +""
  index = 0

  while index < source.length
    if source[index] != "@"
      output << source[index]
      index += 1
      next
    end

    cursor = index + 1
    quote = nil
    escaped = false
    paren_depth = 0
    bracket_depth = 0
    terminator = nil

    while cursor < source.length
      char = source[cursor]

      if escaped
        escaped = false
        cursor += 1
        next
      end

      if char == "\\"
        escaped = true
        cursor += 1
        next
      end

      if quote
        quote = nil if char == quote
        cursor += 1
        next
      end

      case char
      when '"', "'"
        quote = char
      when "("
        paren_depth += 1
      when ")"
        paren_depth -= 1 if paren_depth.positive?
      when "["
        bracket_depth += 1
      when "]"
        bracket_depth -= 1 if bracket_depth.positive?
      when ";"
        if paren_depth.zero? && bracket_depth.zero?
          terminator = :statement
          break
        end
      when "{"
        if paren_depth.zero? && bracket_depth.zero?
          terminator = :block
          break
        end
      end

      cursor += 1
    end

    if terminator == :statement
      output << blank_preserving_newlines(source[index..cursor])
      index = cursor + 1
    else
      output << source[index]
      index += 1
    end
  end

  output
end

def normalize_css_value(value)
  value.strip.downcase.gsub(/\s+/, " ")
end

def extract_important_rules(source)
  rules = []

  source.scan(/([^{}]+)\{([^{}]*)\}/m).each do |prelude, body|
    declarations = body.scan(/([a-z-]+)\s*:\s*([^;{}]*?)\s*!\s*important\b\s*;?/i).map do |property, value|
      "#{property.downcase}:#{normalize_css_value(value)}"
    end.sort

    next if declarations.empty?

    rules << {
      "selectors" => split_selector_list(prelude.strip).sort,
      "declarations" => declarations
    }
  end

  rules.sort_by { |rule| rule["selectors"].join(",") }
end

def extract_at_rule_block(source, header)
  start = source.index(header)
  return nil unless start

  open_brace = source.index("{", start + header.length)
  return nil unless open_brace

  depth = 1
  quote = nil
  escaped = false
  cursor = open_brace + 1

  while cursor < source.length
    char = source[cursor]

    if escaped
      escaped = false
      cursor += 1
      next
    end

    if char == "\\"
      escaped = true
      cursor += 1
      next
    end

    if quote
      quote = nil if char == quote
      cursor += 1
      next
    end

    case char
    when '"', "'"
      quote = char
    when "{"
      depth += 1
    when "}"
      depth -= 1
      return source[(open_brace + 1)...cursor] if depth.zero?
    end

    cursor += 1
  end

  nil
end

[
  MANIFEST_PATH,
  CSS_PATH,
  PRODUCTION_HOTFIX_PATH,
  CERT_WORKFLOW_PATH,
  HEAD_PATH,
  CUSTOM_HEAD,
  DEFAULT_LAYOUT,
  HOMEPAGE_LAYOUT,
  SINGLE_LAYOUT,
  STATE_PATH,
  DOC_PATH
].each do |path|
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
  fail_if(errors, manifest["tokens"] != EXPECTED_TOKENS, "Token vocabulary drifted from published Academic Design System v1")
  fail_if(errors, manifest["components"] != EXPECTED_COMPONENTS, "Component vocabulary drifted from published Academic Design System v1")
  fail_if(errors, manifest["accessibility"] != EXPECTED_ACCESSIBILITY, "Accessibility manifest drifted from published Academic Design System v1")

  activation = manifest["activation"] || {}
  fail_if(errors, activation != EXPECTED_ACTIVATION, "Activation manifest drifted from published Academic Design System v1")

  css = CSS_PATH.file? ? read_utf8(CSS_PATH) : ""
  policy_source = css.gsub(%r{/\*.*?\*/}m) { |comment| "\n" * comment.count("\n") }

  EXPECTED_TOKENS.each do |token|
    token_pattern = /#{Regexp.escape(token)}\s*:/
    fail_if(errors, !policy_source.match?(token_pattern), "Missing CSS token #{token}")
  end
  EXPECTED_COMPONENTS.each_value do |class_name|
    class_pattern = /\.#{Regexp.escape(class_name)}(?![A-Za-z0-9_-])/
    fail_if(errors, !policy_source.match?(class_pattern), "Missing component class .#{class_name}")
  end
  fail_if(errors, !policy_source.include?("a.lbfl-academic-button"), "Academic button anchor specificity contract missing")
  fail_if(errors, !policy_source.include?("button.lbfl-academic-button"), "Academic button element contract missing")
  fail_if(errors, !policy_source.include?(".lbfl-info-card a"), "Dark legacy info-card linked-text bridge missing")
  fail_if(errors, !policy_source.include?(".lbfl-clean-card h3 a"), "Dark legacy Botany linked-heading bridge missing")
  fail_if(errors, !policy_source.match?(/\.neural-card h3[\s\S]*?\.omega-audit-hero h4\s*\{\s*color\s*:\s*#f8fafc\s*;/m), "Dark migration-surface heading contrast bridge missing")
  fail_if(errors, !policy_source.include?(".neural-card:focus-visible"), "Dark neural-card focus bridge missing")
  fail_if(errors, !policy_source.include?(".lbfl-clean-card :focus-visible"), "Dark Botany focus bridge missing")
  fail_if(errors, !policy_source.include?(".omega-audit-hero :focus-visible"), "Dark reflection-hero focus bridge missing")
  fail_if(errors, !policy_source.include?(".lbfl-framework-link:focus-visible"), "Dark framework-link focus bridge missing")
  fail_if(errors, !policy_source.match?(/outline\s*:\s*3px\s+solid\s+#f8fafc\s*;/i), "Dark-surface light focus ring missing")
  fail_if(errors, !policy_source.match?(/box-shadow\s*:\s*0\s+0\s+0\s+6px\s+#0f766e\s*;/i), "Dark-surface outer focus ring missing")
  fail_if(errors, !policy_source.include?(".lbfl-zoology-cycle__steps"), "Academic v1 Zoology learning-cycle treatment missing")
  fail_if(errors, !policy_source.include?(".lbfl-academic-tablist"), "Academic progressive-tabs tablist primitive missing")
  fail_if(errors, !policy_source.include?(".lbfl-academic-tab-panel"), "Academic progressive-tabs panel primitive missing")
  fail_if(errors, !policy_source.include?(".contextual-sidebar-nav"), "Academic v1 contextual-sidebar theme missing")
  fail_if(errors, !policy_source.include?('.lbfl-academic-table-wrap[tabindex="0"]:focus-visible'), "Focusable Academic table-wrapper treatment missing")
  fail_if(errors, !policy_source.match?(/\.lbfl-academic-table-wrap table\s*\{[^{}]*display\s*:\s*table\s*;[^{}]*overflow(?:-x)?\s*:\s*visible\s*;/im), "Academic table wrapper must restore the native table display/overflow model")

  fail_if(errors, policy_source.match?(/min-height\s*:\s*85(?:d)?vh/i), "Academic design system must not introduce 85vh hero forcing")
  fail_if(errors, policy_source.match?(/overflow-wrap\s*:\s*anywhere/i), "Academic design system must not use overflow-wrap:anywhere")
  fail_if(errors, policy_source.match?(/word-break\s*:\s*break-all/i), "Academic design system must not use word-break:break-all")

  selector_source = strip_statement_at_rules(policy_source)
  selector_source.scan(/([^{}]+)\{/m).flatten.each do |prelude|
    prelude = prelude.strip
    next if prelude.empty? || prelude.start_with?("@")
    split_selector_list(prelude).each do |selector|
      unless selector.match?(ACADEMIC_SELECTOR_ROOT)
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
  actual_important_rules = extract_important_rules(policy_source)
  fail_if(
    errors,
    actual_important_rules != EXPECTED_IMPORTANT_RULES,
    "Academic priority rules drifted from the exact selector/value contract"
  )

  reduced_motion_source = extract_at_rule_block(policy_source, "@media (prefers-reduced-motion: reduce)")
  fail_if(errors, reduced_motion_source.nil?, "Reduced-motion media query missing")
  if reduced_motion_source
    reduced_motion_important_rules = extract_important_rules(reduced_motion_source)
    fail_if(
      errors,
      reduced_motion_important_rules != EXPECTED_REDUCED_MOTION_IMPORTANT_RULES,
      "Reduced-motion priority rules drifted from the exact retained-control contract"
    )
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

if PRODUCTION_HOTFIX_PATH.file?
  production_hotfix = read_utf8(PRODUCTION_HOTFIX_PATH)
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
  EXPECTED_ACADEMIC_STATIC_SHELL_SELECTORS.each do |selector|
    fail_if(errors, !css.include?(selector), "Academic v1 static-shell selector missing: #{selector}")
  end
  static_shell_rule = css.match(/html\.lbfl-academic-v1:not\(\.lbfl-home-v3-document\) \.masthead,[\s\S]*?\{([\s\S]*?)\}/)
  fail_if(errors, static_shell_rule.nil?, "Academic v1 static-shell animation rule missing")
  if static_shell_rule
    declarations = static_shell_rule[1]
    fail_if(errors, !declarations.include?("-webkit-animation: none;"), "Academic v1 static shell must disable webkit intro animation")
    fail_if(errors, !declarations.include?("animation: none;"), "Academic v1 static shell must disable intro animation")
  end
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

certification_mode = ENV.fetch("CERTIFICATION_MODE", "local")
comparison_base = ENV["PR_BASE_SHA"].to_s.strip
if comparison_base.empty?
  parent_stdout, parent_status = Open3.capture2e("git", "-C", ROOT.to_s, "rev-parse", "HEAD^")
  comparison_base = parent_status.success? ? parent_stdout.strip : EXPECTED_BASE
end

if STATE_PATH.file?
  state = read_utf8(STATE_PATH)
  bootstrap_pr = certification_mode == "pull_request" && comparison_base == EXPECTED_BASE
  if bootstrap_pr
    fail_if(errors, !state.include?("phase: CONV-04B"), "CONV04_STATE must identify phase CONV-04B on the bootstrap PR")
    fail_if(errors, !state.include?(EXPECTED_BASE), "CONV04_STATE must bind the authorized CONV-04B bootstrap base")
  else
    fail_if(errors, !state.include?("programme: CONV-04"), "CONV-04 programme identity missing")
    phase_line = state.lines.find { |line| line.start_with?("phase:") }.to_s.strip
    fail_if(
      errors,
      !phase_line.match?(/\Aphase:\s+CONV-04[A-Z](?:-\d+)?\z/),
      "CONV04_STATE must identify a valid CONV-04 phase"
    )
  end
end

if DOC_PATH.file?
  doc = read_utf8(DOC_PATH)
  fail_if(errors, !doc.include?(EXPECTED_VERSION), "Academic Design System doc version mismatch")
  fail_if(errors, !doc.include?("academic_system: v1"), "Academic Design System doc must document explicit activation")
  fail_if(errors, !doc.include?('class="lbfl-academic-table-wrap" tabindex="0" role="region" aria-label='), "Academic Design System doc must require a focusable, named table wrapper")
  fail_if(errors, !doc.include?("aria-labelledby"), "Academic Design System doc must document aria-labelledby as an accessible-name option")
end

git_dir = ROOT.join(".git")
if git_dir.exist?
  candidate_state = STATE_PATH.file? ? read_utf8(STATE_PATH) : ""
  stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{comparison_base}...HEAD")
  if status.success?
    changed = stdout.lines.map(&:strip).reject(&:empty?).sort

    if candidate_state.include?("phase: CONV-04B")
      unexpected = changed - ALLOWED_FILES.sort
      errors << "Unexpected CONV-04B changed files: #{unexpected.join(', ')}" unless unexpected.empty?

      # The exact twelve-file completeness requirement belongs only to the
      # original CONV-04B bootstrap PR against the authorized base. Later
      # maintenance PRs may legitimately change a subset of those artifacts.
      if comparison_base == EXPECTED_BASE
        missing = ALLOWED_FILES.sort - changed
        errors << "Expected CONV-04B bootstrap files not changed: #{missing.join(', ')}" unless missing.empty?
      end
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