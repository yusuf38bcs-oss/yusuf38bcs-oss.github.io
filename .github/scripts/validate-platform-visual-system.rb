#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "3c9d57e8b3b40a599de960d145165e2f4f4304cd"
MANIFEST_PATH = ROOT.join("_data/academic/platform_visual_system_v1.json")
CSS_PATH = ROOT.join("assets/css/lbfl-platform-system.css")
ACADEMIC_CSS_PATH = ROOT.join("assets/css/academic-design-system.css")
HEAD_PATH = ROOT.join("_includes/head/head.html")
BRAND_PATH = ROOT.join("_includes/brand/lbfl-identity.html")
MASTHEAD_PATH = ROOT.join("_includes/navigation/masthead.html")
DEFAULT_LAYOUT_PATH = ROOT.join("_layouts/default.html")
FOOTER_PRIMARY_PATH = ROOT.join("_includes/footer/mycorrhizal-footer.html")
FOOTER_LEGAL_PATH = ROOT.join("_includes/footer/legal-links.html")
DOC_PATH = ROOT.join("docs/academic/conv04/PLATFORM_VISUAL_SYSTEM_G_R1.md")
STATE_PATH = ROOT.join("docs/academic/conv04/CONV04_STATE.md")

ALLOWED_FILES = %w[
  _data/academic/platform_visual_system_v1.json
  assets/css/lbfl-platform-system.css
  assets/css/academic-design-system.css
  _includes/brand/lbfl-identity.html
  _includes/navigation/masthead.html
  _includes/head/head.html
  _layouts/default.html
  _includes/footer/mycorrhizal-footer.html
  _includes/footer/legal-links.html
  docs/academic/conv04/PLATFORM_VISUAL_SYSTEM_G_R1.md
  docs/academic/conv04/CONV04_STATE.md
  .github/scripts/validate-platform-visual-system.rb
  .github/workflows/platform-visual-system-certification.yml
].freeze

TOKENS = %w[
  --lbfl-platform-paper
  --lbfl-platform-surface
  --lbfl-platform-soft
  --lbfl-platform-ink
  --lbfl-platform-muted
  --lbfl-platform-heading
  --lbfl-platform-link
  --lbfl-platform-accent
  --lbfl-platform-border
  --lbfl-platform-focus
  --lbfl-platform-dark
  --lbfl-platform-dark-surface
  --lbfl-platform-dark-ink
  --lbfl-platform-dark-muted
  --lbfl-platform-gold
  --lbfl-platform-radius
  --lbfl-platform-shadow
  --lbfl-platform-measure
  --lbfl-platform-shell
  --lbfl-platform-gutter
  --lbfl-platform-space
  --lbfl-platform-font-sans
  --lbfl-platform-body-size
  --lbfl-platform-small-size
  --lbfl-platform-card-title-size
  --lbfl-platform-section-title-size
  --lbfl-platform-page-title-size
  --lbfl-platform-display-size
].freeze

COMPONENTS = %w[
  lbfl-platform-shell
  lbfl-platform-header
  lbfl-platform-brand
  lbfl-platform-footer
  lbfl-platform-matrix
  lbfl-platform-card
  lbfl-platform-table-wrap
  lbfl-platform-figure
].freeze

REQUIRED_FILES = [
  MANIFEST_PATH, CSS_PATH, ACADEMIC_CSS_PATH, HEAD_PATH, BRAND_PATH,
  MASTHEAD_PATH, DEFAULT_LAYOUT_PATH, FOOTER_PRIMARY_PATH,
  FOOTER_LEGAL_PATH, DOC_PATH, STATE_PATH
].freeze

def read_utf8(path)
  path.read(encoding: "UTF-8")
end

def add_error(errors, condition, message)
  errors << message if condition
end

errors = []

REQUIRED_FILES.each do |path|
  add_error(errors, !path.file?, "Missing required G-R1 file: #{path.relative_path_from(ROOT)}")
end

manifest = MANIFEST_PATH.file? ? JSON.parse(read_utf8(MANIFEST_PATH)) : {}
css = CSS_PATH.file? ? read_utf8(CSS_PATH) : ""
academic_css = ACADEMIC_CSS_PATH.file? ? read_utf8(ACADEMIC_CSS_PATH) : ""
head = HEAD_PATH.file? ? read_utf8(HEAD_PATH) : ""
brand = BRAND_PATH.file? ? read_utf8(BRAND_PATH) : ""
masthead = MASTHEAD_PATH.file? ? read_utf8(MASTHEAD_PATH) : ""
default_layout = DEFAULT_LAYOUT_PATH.file? ? read_utf8(DEFAULT_LAYOUT_PATH) : ""
footer_primary = FOOTER_PRIMARY_PATH.file? ? read_utf8(FOOTER_PRIMARY_PATH) : ""
footer_legal = FOOTER_LEGAL_PATH.file? ? read_utf8(FOOTER_LEGAL_PATH) : ""
state = STATE_PATH.file? ? read_utf8(STATE_PATH) : ""

add_error(errors, manifest["schema"] != "lbfl-platform-visual-system-v1", "Platform manifest schema mismatch")
add_error(errors, manifest["version"] != "CONV-04G-R1-1.0.0", "Platform manifest version mismatch")
add_error(errors, manifest["authorized_base_sha"] != BASE, "Platform manifest base mismatch")
add_error(errors, Array(manifest["allowed_files"]).sort != ALLOWED_FILES.sort, "Platform manifest allowed-files drift")
add_error(errors, Array(manifest["tokens"]) != TOKENS, "Platform manifest token vocabulary drift")
manifest_components = manifest["components"].is_a?(Hash) ? manifest["components"].values : []
add_error(errors, manifest_components != COMPONENTS, "Platform manifest component vocabulary drift")

TOKENS.each do |token|
  add_error(errors, !css.match?(/#{Regexp.escape(token)}\s*:/), "Missing platform token #{token}")
end
COMPONENTS.each do |klass|
  add_error(errors, !css.match?(/\.#{Regexp.escape(klass)}(?:[\s:{.#>]|$)/), "Missing platform component .#{klass}")
end

add_error(errors, css.include?("!important"), "Platform CSS must not introduce !important")
selector_groups = css.gsub(%r{/\*.*?\*/}m, "").scan(/([^{}]+)\{/m).flatten
bare_selector = selector_groups.any? do |group|
  next false if group.lstrip.start_with?("@")

  group.split(",").any? do |selector|
    candidate = selector.strip
    candidate.match?(/\A(?:body|html|h[1-6]|p|a|img|figure|table|th|td)(?:\z|:{1,2}[a-zA-Z-]+(?:\([^)]*\))?\z)/)
  end
end
add_error(errors, bare_selector, "Platform CSS contains a forbidden bare global content selector")
add_error(errors, !css.include?("@media (max-width: 27.5rem)"), "Platform CSS missing narrow responsive contract")
add_error(errors, !css.include?("@media (prefers-reduced-motion: reduce)"), "Platform CSS missing reduced-motion contract")

platform_link = "lbfl-platform-system.css"
academic_link = "academic-design-system.css"
platform_index = head.index(platform_link)
academic_index = head.index(academic_link)
add_error(errors, platform_index.nil?, "Head does not load platform visual system")
add_error(errors, !platform_index.nil? && !academic_index.nil? && platform_index > academic_index, "Platform CSS must load before Academic-v1 CSS")

add_error(errors, !brand.include?("site.logo"), "Canonical identity must consume site.logo")
add_error(errors, !brand.include?("site.title"), "Canonical identity must consume site.title")
%w[lbfl-platform-brand lbfl-platform-brand__logo lbfl-platform-brand__title].each do |klass|
  add_error(errors, !brand.include?(klass), "Canonical identity missing #{klass}")
end

add_error(errors, !masthead.include?("brand/lbfl-identity.html"), "Masthead does not consume canonical identity include")
add_error(errors, !masthead.include?("lbfl-platform-header"), "Masthead missing platform header hook")
add_error(errors, !masthead.include?("lbfl-platform-shell"), "Masthead missing platform shell hook")
add_error(errors, !default_layout.include?("site-footer-shell lbfl-platform-footer"), "Default layout missing platform footer hook")
add_error(errors, !footer_primary.include?("lbfl-platform-footer__primary"), "Primary footer missing platform hook")
add_error(errors, !footer_legal.include?("lbfl-platform-footer__legal"), "Legal footer missing platform hook")
add_error(errors, !academic_css.include?("var(--lbfl-platform-"), "Academic-v1 is not consuming platform tokens")

current_phase = state[/^phase:\s*(\S+)/, 1]
bootstrap_state = current_phase == "CONV-04G-R1"

add_error(errors, current_phase.nil?, "CONV04_STATE phase is missing")
add_error(errors, !state.include?("conv04f_status: FORMALLY CLOSED"), "CONV-04F is not formally closed in state")

if bootstrap_state
  add_error(errors, !state.include?("learner_content_authoring: NO"), "G-R1 must not authorize learner content")

  allowlist_declaration = state.lines.find { |line| line.start_with?("learner_mutation_allowlist:") }.to_s.strip
  add_error(errors, allowlist_declaration != "learner_mutation_allowlist: []", "G-R1 learner mutation allowlist declaration must be exactly []")

  allowlist_lines = state.lines.drop_while { |line| !line.start_with?("learner_mutation_allowlist:") }.drop(1)
  allowlist_entries = allowlist_lines.take_while { |line| line.start_with?("  ") }.grep(/^\s+-\s+/)
  add_error(errors, !allowlist_entries.empty?, "G-R1 learner mutation allowlist must be empty")
end

config = ROOT.join("_config.yml")
if config.file?
  config_text = read_utf8(config)
  add_error(errors, !config_text.include?("logo: /assets/images/logo.png"), "Canonical configured LBFL logo path drifted")
end

base_sha = ENV["PR_BASE_SHA"].to_s
if ENV["CERTIFICATION_MODE"] == "pull_request"
  add_error(errors, !base_sha.match?(/\A[0-9a-f]{40}\z/), "PR_BASE_SHA must be an exact SHA")
  if base_sha.match?(/\A[0-9a-f]{40}\z/)
    out, err, status = Open3.capture3("git", "diff", "--name-only", "#{base_sha}...HEAD", chdir: ROOT.to_s)
    add_error(errors, !status.success?, "Unable to enumerate changed files: #{err.strip}")
    if status.success?
      changed = out.lines.map(&:strip).reject(&:empty?).sort
      forbidden = changed.grep(/\A(?:worker\/|workers\/|wrangler|\.github\/workflows\/worker-|\.github\/scripts\/cloudflare-worker)/)
      add_error(errors, !forbidden.empty?, "Worker/Cloudflare deployment mutation is forbidden: #{forbidden.join(', ')}")

      if base_sha == BASE
        unexpected = changed - ALLOWED_FILES.sort
        missing = ALLOWED_FILES.sort - changed
        add_error(errors, !unexpected.empty?, "Unexpected G-R1 changed files: #{unexpected.join(', ')}")
        add_error(errors, !missing.empty?, "Expected G-R1 files not changed: #{missing.join(', ')}")
      end
    end
  end
end

result = {
  schema: "lbfl-platform-visual-system-v1",
  phase: "CONV-04G-R1",
  authorized_base_sha: BASE,
  allowed_files: ALLOWED_FILES,
  errors: errors,
  result: errors.empty? ? "PASS" : "FAIL"
}

puts JSON.pretty_generate(result)
exit(errors.empty? ? 0 : 1)
