#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "2ef87d24d73d733d541fcc624474836d72486b30"

ALLOWED = %w[
  index.html
  _layouts/homepage-v3.html
  _includes/home-v3/header.html
  _includes/home-v3/footer.html
  _includes/home-v3/journey.html
  _data/homepage.yml
  _data/homepage-v3.yml
  assets/css/homepage-v3.css
  docs/homepage-v3/DESIGN-CONTRACT.md
  docs/homepage-v3/ROUTE-MANIFEST.md
  docs/homepage-v3/VISUAL-REGRESSION-MANIFEST.md
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/CONV04_STATE.md
  docs/academic/conv04/CONV04_I01_FORENSIC_CENSUS.md
  .github/scripts/validate-conv04-i02-homepage-integration.rb
  .github/scripts/conv04-i02-homepage-browser-certification.mjs
  .github/workflows/conv04-i02-homepage-integration-certification.yml
].freeze

errors = []

def text(path)
  File.read(ROOT.join(path), encoding: "UTF-8")
end

def require_text(errors, source, needle, message)
  errors << message unless source.include?(needle)
end

stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{BASE}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
  unexpected = changed - ALLOWED.sort
  missing = ALLOWED.sort - changed
  errors << "Unexpected I-02 files: #{unexpected.join(', ')}" unless unexpected.empty?
  errors << "Expected I-02 files not changed: #{missing.join(', ')}" unless missing.empty?
else
  errors << "Unable to calculate exact I-02 diff: #{stdout.strip}"
  changed = []
end

index = text("index.html")
[
  "page_id: home",
  "academic_system: v1",
  "academic_role: platform_home",
  "lang: en",
  "robots: index,follow"
].each { |needle| require_text(errors, index, needle, "index missing #{needle}") }

sequence = %w[
  home-v3/hero.html
  home-v3/pathways.html
  home-v3/journey.html
  home-v3/method.html
  home-v3/repair.html
  home-v3/evidence.html
  home-v3/continue.html
]
positions = sequence.map { |needle| index.index(needle) }
errors << "Homepage V3 narrative section missing" if positions.any?(&:nil?)
errors << "Homepage V3 narrative order changed" unless positions.compact == positions.compact.sort

layout = text("_layouts/homepage-v3.html")
require_text(errors, layout, "include_cached search/search_form.html", "Homepage does not consume shared search form")
require_text(errors, layout, ".no-js .lbfl-v3-search-button,", "Homepage no-JS search-toggle fallback missing")
require_text(errors, layout, ".no-js .brevo-open-modal-btn { display: none !important; }", "Homepage no-JS newsletter-trigger fallback missing")
no_js_rule = layout.index(".no-js .lbfl-v3-search-button")
compact_media = layout.index("@media (max-width: 1024px)")
errors << "Homepage no-JS search fallback is compact-only" unless no_js_rule && compact_media && no_js_rule < compact_media
require_text(errors, layout, "function canRestoreFocus(element)", "Homepage non-focusable Escape guard missing")
require_text(errors, layout, "event.stopImmediatePropagation();", "Homepage hidden-modal Escape isolation missing")
errors << "Homepage retains minute-precision asset revision" if layout.include?("site.time | date: '%Y%m%d%H%M'")
require_text(errors, layout, "include body/brevo-marketing.html", "Homepage does not consume canonical Brevo surface")
require_text(errors, layout, "include scripts.html", "Homepage does not load shared site runtime")
require_text(errors, layout, "closed shared Brevo modal must not steal later Escape focus", "Homepage closed-Brevo Escape guard missing")
require_text(errors, layout, ".lbfl-home-v3 .brevo-modal-close:focus-visible", "Homepage Brevo close focus-visible bridge missing")
require_text(errors, layout, "body.lbfl-home-v3 #brevo-newsletter-modal .brevo-modal-close:focus-visible", "Homepage late-cascade Brevo focus bridge missing")
require_text(errors, layout, "outline-offset: 3px !important;", "Homepage Brevo close focus offset is not enforced")
require_text(errors, layout, "function bindBrevoAutofocusBridge()", "Homepage Brevo autofocus bridge missing")
require_text(errors, layout, "email.focus({ preventScroll: true });", "Homepage Brevo deterministic autofocus missing")
require_text(errors, layout, "function bindBrevoFocusRingBridge()", "Homepage Brevo runtime focus-ring bridge missing")
require_text(errors, layout, "close.style.setProperty('outline-offset', '3px', 'important');", "Homepage Brevo runtime focus offset is not enforced")
errors << "Homepage retains stale fixed V3 asset revision" if layout.include?("v3.5.1-main-4bc3a7e-20260921")
errors << "Homepage layout duplicates legacy theme-color override" if layout.include?('<meta name="theme-color" content="#06272d">')

header = text("_includes/home-v3/header.html")
require_text(errors, header, "include brand/lbfl-identity.html", "Homepage header does not consume canonical identity")
require_text(errors, header, "search__toggle", "Homepage header does not expose shared search")
errors << "Homepage retains page-local LBFL mark" if header.include?("lbfl-v3-brand__mark")

workflow = text(".github/workflows/conv04-i02-homepage-integration-certification.yml")
homepage_dependencies = [
  "assets/js/home/homepage-v3.js",
  "assets/css/lbfl-platform-system.css",
  "assets/css/academic-design-system.css",
  "assets/css/main.scss",
  "assets/css/synaptic-overrides.css",
  "assets/css/production-hotfix.css",
  "_sass/**",
  "_includes/brand/lbfl-identity.html",
  "_includes/body/brevo-marketing.html",
  "_includes/body/gdpr-banner.html",
  "_includes/footer/legal-links.html",
  "_includes/head.html",
  "_includes/head/**",
  "_config.yml",
  "assets/images/logo.png",
  "Gemfile",
  "Gemfile.lock"
]
homepage_dependencies.each do |dependency|
  require_text(
    errors,
    workflow,
    "- \"#{dependency}\"",
    "I-02 workflow does not watch Homepage dependency #{dependency}"
  )
end

require_text(
  errors,
  workflow,
  'git diff --check "$PR_BASE_SHA...$PR_HEAD_SHA"',
  "Homepage dependency regression does not validate the current PR range"
)
if workflow.include?('git merge-base --is-ancestor "$PR_BASE_SHA" "$PR_HEAD_SHA"')
  errors << "Homepage dependency regression incorrectly requires current base tip to be an ancestor of PR head"
end
require_text(
  errors,
  workflow,
  'git merge-base --is-ancestor "$AUTHORIZED_BASE" "$PR_HEAD_SHA"',
  "Frozen I-02 candidate lost strict authorized-base ancestry check"
)

browser_certification = text(".github/scripts/conv04-i02-homepage-browser-certification.mjs")
require_text(errors, browser_certification, "legalFocusFocused", "Browser certification does not prove keyboard focus reaches an imported legal link")
require_text(errors, browser_certification, "legalFocusVisible", "Browser certification does not prove imported legal-link focus visibility")
require_text(errors, browser_certification, "legalFocusStyle", "Browser certification does not capture imported legal-link computed focus style")
require_text(errors, browser_certification, "newsletterCloseFocused", "Browser certification does not prove keyboard focus reaches Brevo close control")
require_text(errors, browser_certification, "newsletterCloseFocusVisible", "Browser certification does not prove Brevo close focus visibility")
require_text(errors, browser_certification, "newsletterHiddenEscapeNoTriggerSteal", "Browser certification does not prove hidden Brevo Escape avoids newsletter-trigger focus theft")
require_text(errors, browser_certification, "newsletterBodyHiddenEscapeNoTriggerSteal", "Browser certification does not prove body-origin hidden Escape avoids newsletter-trigger focus theft")
require_text(errors, browser_certification, 'page.keyboard.press("Shift+Tab")', "Browser certification does not exercise keyboard focus on Brevo close control")

footer = text("_includes/home-v3/footer.html")
require_text(errors, footer, "lbfl-platform-footer", "Homepage footer lacks platform hook")
require_text(errors, footer, "include footer/legal-links.html", "Homepage footer does not consume canonical legal footer")
require_text(errors, footer, "@media print", "Homepage legal-footer print bridge missing")
require_text(errors, footer, ".lbfl-home-v3 .footer-legal-area", "Homepage print legal-area owner missing")
require_text(errors, footer, "background: #fff !important;", "Homepage print legal-area background normalization missing")
require_text(errors, footer, ".lbfl-home-v3 .footer-legal-links a", "Homepage print legal-link owner missing")
require_text(errors, footer, ".lbfl-home-v3 .footer-legal-links a:focus-visible", "Homepage legal-link focus-visible bridge missing")
require_text(errors, footer, "outline-style: solid !important;", "Homepage legal-link focus style is not enforced")
require_text(errors, footer, "outline-width: 3px !important;", "Homepage legal-link focus width is not enforced")
require_text(errors, footer, "outline-color: var(--lbfl-platform-focus, #73d9f2) !important;", "Homepage legal-link focus color is not enforced")
require_text(errors, footer, "outline-offset: 3px !important;", "Homepage legal-link focus offset is not enforced")
require_text(errors, footer, "transition: none !important;", "Homepage legal-link transition suppression missing")
require_text(errors, footer, "function bindHomepageLegalFocusRing()", "Homepage legal-link runtime focus bridge missing")
require_text(errors, footer, "link.style.setProperty('outline-offset', '3px', 'important');", "Homepage legal-link runtime focus offset is not enforced")

journey = text("_includes/home-v3/journey.html")
require_text(errors, journey, "featured_route.lesson_count", "Journey aria-label is not data-bound")

homepage = text("_data/homepage.yml")
require_text(errors, homepage, 'title_accent: "Eight Functions. One Living System."', "Homepage journey title is not eight-function current")
require_text(errors, homepage, "lesson_count: 8", "Homepage lesson_count must be 8")
require_text(errors, homepage, "maximum_items: 8", "Homepage maximum_items must be 8")
require_text(errors, homepage, "lecture-07-cell-wall-vacuole", "Homepage missing Lecture 07")
require_text(errors, homepage, "lecture-08-plastid-chloroplast", "Homepage missing Lecture 08")
errors << "Stale six-function journey remains" if homepage.include?("Six Functions. One Living System.")

v3 = text("_data/homepage-v3.yml")
require_text(errors, v3, BASE, "Homepage V3 authority is not bound to I-02 base")
require_text(errors, v3, 'platform_system: "lbfl-platform-visual-system-v1"', "Homepage V3 platform system binding missing")
require_text(errors, v3, 'academic_role: "platform_home"', "Homepage V3 role binding missing")
require_text(errors, v3, 'shared_newsletter: "body/brevo-marketing.html"', "Homepage V3 newsletter ownership missing")
css_blob, css_blob_status = Open3.capture2("git", "-C", ROOT.to_s, "hash-object", "assets/css/homepage-v3.css")
js_blob, js_blob_status = Open3.capture2("git", "-C", ROOT.to_s, "hash-object", "assets/js/home/homepage-v3.js")
if css_blob_status.success? && js_blob_status.success?
  expected_asset_revision = "css-#{css_blob.strip[0, 12]}-js-#{js_blob.strip[0, 12]}"
  require_text(errors, v3, "asset_revision: \"#{expected_asset_revision}\"", "Homepage V3 asset revision is not content-addressed")
  require_text(errors, layout, "?v=#{expected_asset_revision}", "Homepage asset URLs do not use the content-addressed revision")
else
  errors << "Unable to compute Homepage CSS/JS blob identities"
end

css = text("assets/css/homepage-v3.css")
require_text(errors, css, "var(--lbfl-platform-shell", "Homepage CSS does not consume platform shell token")
require_text(errors, css, "var(--lbfl-platform-font-sans", "Homepage CSS does not consume platform font token")
require_text(errors, css, "var(--lbfl-platform-focus", "Homepage CSS does not consume platform focus token")
require_text(errors, css, ".lbfl-v3-brand__logo", "Homepage canonical logo styling missing")
require_text(errors, css, ".lbfl-v3-search-button", "Homepage shared-search control styling missing")
require_text(errors, css, ".lbfl-home-v3 .lbfl-v3-search-button.lbfl-search-toggle", "Homepage 44px search-target override missing")
require_text(errors, css, "min-height: 44px !important;", "Homepage search-target minimum height missing")
errors << "Deferred oversized 12.3vw mobile hero rule remains" if css.include?("12.3vw")
errors << "Deferred oversized 12vw mobile hero rule remains" if css.include?("12vw")
errors << "Deferred oversized 11.4vw mobile hero rule remains" if css.include?("11.4vw")
require_text(errors, css, "clamp(2.25rem, 9.8vw, 3.5rem)", "Normalized compact-mobile hero typography missing")
require_text(errors, css, "clamp(2.05rem, 9.4vw, 2.85rem)", "Normalized narrow-mobile hero typography missing")
require_text(errors, css, "@media (max-width: 340px)", "Narrow-header overflow guard missing")
require_text(errors, css, ".lbfl-home-v3 .brevo-open-modal-btn", "Homepage Brevo reduced-motion bridge missing")
require_text(errors, css, ".lbfl-home-v3 .footer-legal-links a", "Homepage legal-link 44px bridge missing")
require_text(errors, css, ".lbfl-home-v3 .brevo-modal-close", "Homepage Brevo close 44px bridge missing")
require_text(errors, css, "html.brevo-modal-open", "Homepage Brevo scroll-lock owner missing")
require_text(errors, css, "body.lbfl-home-v3.brevo-modal-open", "Homepage Brevo body scroll lock missing")
require_text(errors, css, "overflow: hidden !important;", "Homepage Brevo scroll lock declaration missing")
require_text(errors, css, "html.brevo-modal-open #gdpr-banner", "Homepage consent/modal coordination missing")
require_text(errors, css, "visibility: hidden !important;", "Homepage consent suppression while newsletter is open missing")
require_text(errors, css, "body.lbfl-home-v3 #newsletter", "Homepage print newsletter owner missing")
require_text(errors, css, "body.lbfl-home-v3 #brevo-newsletter-modal", "Homepage print modal omission missing")
require_text(errors, css, "display: none !important;", "Homepage newsletter print omission missing")
require_text(errors, css, ".lbfl-home-v3 .custom-submit-btn", "Homepage Brevo submit reduced-motion bridge missing")

ledger = JSON.parse(text("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json"))
home = ledger.fetch("routes").find { |route| route["id"] == "home" }
if home.nil?
  errors << "Academic route ledger home row missing"
else
  errors << "Home route is not strict" unless home["enforcement"] == "strict"
  errors << "Home route source debt remains" unless Array(home["source_debt"]).empty?
  errors << "Home route live debt remains" unless Array(home["live_debt"]).empty?
  errors << "Home role drift" unless home["academic_role"] == "platform_home"
end

state = text("docs/academic/conv04/CONV04_STATE.md")
require_text(errors, state, "phase: CONV-04I-02", "CONV04 state is not I-02")
require_text(errors, state, "authorized_base: #{BASE}", "I-02 authorized base mismatch")
require_text(errors, state, "I-02 merge: **HOLD pending unchanged-head certification**", "I-02 merge HOLD gate missing")

design = text("docs/homepage-v3/DESIGN-CONTRACT.md")
route = text("docs/homepage-v3/ROUTE-MANIFEST.md")
census = text("docs/academic/conv04/CONV04_I01_FORENSIC_CENSUS.md")
require_text(errors, design, "does **not** redesign Homepage V3", "Design preservation contract missing")
require_text(errors, route, "The production root is the canonical Homepage V3 route", "Route manifest still lacks root authority")
require_text(errors, census, "I-02 implementation: GO", "Forensic census GO evidence missing")

result = {
  "schema" => "lbfl-conv04-i02-homepage-integration-v1",
  "authorized_base" => BASE,
  "changed_files" => changed,
  "errors" => errors,
  "result" => errors.empty? ? "PASS" : "FAIL"
}

puts JSON.pretty_generate(result)
exit(errors.empty? ? 0 : 1)
