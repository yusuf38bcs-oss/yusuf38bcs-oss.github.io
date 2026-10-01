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

EXPECTED_REDUCED_MOTION_CARD_SELECTOR = [
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .neural-card"
].freeze

EXPECTED_REDUCED_MOTION_HOVER_SELECTOR = [
  "html.lbfl-academic-v1 [data-lbfl-academic-surface] .neural-card:hover"
].freeze

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
    "selectors" => EXPECTED_REDUCED_MOTION_CARD_SELECTOR,
    "declarations" => ["transition:none"]
  },
  {
    "selectors" => EXPECTED_REDUCED_MOTION_HOVER_SELECTOR,
    "declarations" => ["transform:none"]
  }
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
    fail_if(
      errors,
      !reduced_motion_source.match?(/\.neural-card\s*\{[^{}]*transition\s*:\s*none\s*!\s*important\s*;/im),
      "Reduced-motion neural-card transition override missing from reduced-motion media query"
    )
    fail_if(
      errors,
      !reduced_motion_source.match?(/\.neural-card:hover\s*\{[^{}]*transform\s*:\s*none\s*!\s*important\s*;/im),
      "Reduced-motion neural-card transform override missing from reduced-motion media query"
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
  fail_if(errors, !doc.include?('class="lbfl-academic-table-wrap" tabindex="0" role="region" aria-label='), "Academic Design System doc must require a focusable, named table wrapper")
  fail_if(errors, !doc.include?("aria-labelledby"), "Academic Design System doc must document aria-labelledby as an accessible-name option")
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
