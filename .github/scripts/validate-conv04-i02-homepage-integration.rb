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
%w[
  "page_id: home"
  "academic_system: v1"
  "academic_role: platform_home"
  "lang: en"
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
require_text(errors, layout, "include body/brevo-marketing.html", "Homepage does not consume canonical Brevo surface")
require_text(errors, layout, "include scripts.html", "Homepage does not load shared site runtime")
errors << "Homepage retains stale fixed V3 asset revision" if layout.include?("v3.5.1-main-4bc3a7e-20260921")
errors << "Homepage layout duplicates legacy theme-color override" if layout.include?('<meta name="theme-color" content="#06272d">')

header = text("_includes/home-v3/header.html")
require_text(errors, header, "include brand/lbfl-identity.html", "Homepage header does not consume canonical identity")
require_text(errors, header, "search__toggle", "Homepage header does not expose shared search")
errors << "Homepage retains page-local LBFL mark" if header.include?("lbfl-v3-brand__mark")

footer = text("_includes/home-v3/footer.html")
require_text(errors, footer, "lbfl-platform-footer", "Homepage footer lacks platform hook")
require_text(errors, footer, "include footer/legal-links.html", "Homepage footer does not consume canonical legal footer")

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

css = text("assets/css/homepage-v3.css")
require_text(errors, css, "var(--lbfl-platform-shell", "Homepage CSS does not consume platform shell token")
require_text(errors, css, "var(--lbfl-platform-font-sans", "Homepage CSS does not consume platform font token")
require_text(errors, css, "var(--lbfl-platform-focus", "Homepage CSS does not consume platform focus token")
require_text(errors, css, ".lbfl-v3-brand__logo", "Homepage canonical logo styling missing")
require_text(errors, css, ".lbfl-v3-search-button", "Homepage shared-search control styling missing")
errors << "Deferred oversized 12.3vw mobile hero rule remains" if css.include?("12.3vw")

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
