#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "cbd6de2cc95f3a573fdd784e29fc045e6448cbda"
PHASE = "CONV-04F-05"
PHASE_PATTERN = /\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.freeze

AUTH = ROOT.join("_data/academic/conv04f_genetics_authorization_v1.json")
MANIFEST = ROOT.join("_data/academic/conv04f_genetics_v1.json")
GATEWAY = ROOT.join("_biology/higher-zoology-tree/genetics/index.md")
COURSE_INDEX = ROOT.join("_biology/higher-zoology-tree/genetics/course-index.md")
COURSE_CONTRACT = ROOT.join("_data/academic/course_contract_v1.json")
LEDGER = ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
AUTH_DOC = ROOT.join("docs/academic/conv04/GENETICS_CONVERGENCE_AUTHORIZATION.md")
DOC = ROOT.join("docs/academic/conv04/GENETICS_CONVERGENCE.md")
BROWSER = ROOT.join(".github/scripts/conv04f-genetics-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/conv04f-genetics-certification.yml")
CONFIG = ROOT.join("_config.yml")
BN_GATEWAY_REDIRECT = ROOT.join("bn/biology/higher-zoology-tree/genetics/index.html")
BN_COURSE_REDIRECT = ROOT.join("bn/biology/higher-zoology-tree/genetics/course-index/index.html")

CTA = "{% include education/learning-guide-cta.html %}"
LEGACY = "{% include education/framework-links.html %}"
TABLE_OPEN = '<div class="lbfl-academic-table-wrap" tabindex="0" role="region" aria-label="Genetics 17-lecture route map" markdown="1">'

BOOTSTRAP_FILES = %w[
  .github/scripts/conv04f-genetics-browser-certification.mjs
  .github/scripts/validate-conv04f-genetics.rb
  .github/workflows/conv04f-genetics-certification.yml
  _biology/higher-zoology-tree/genetics/course-index.md
  _biology/higher-zoology-tree/genetics/index.md
  _config.yml
  bn/biology/higher-zoology-tree/genetics/course-index/index.html
  bn/biology/higher-zoology-tree/genetics/index.html
  _data/academic/conv04f_genetics_authorization_v1.json
  _data/academic/conv04f_genetics_v1.json
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/CONV04_STATE.md
  docs/academic/conv04/GENETICS_CONVERGENCE.md
  docs/academic/conv04/GENETICS_CONVERGENCE_AUTHORIZATION.md
].freeze

IMMUTABLE_F05 = %w[
  .github/scripts/conv04f-genetics-browser-certification.mjs
  .github/scripts/validate-conv04f-genetics.rb
  .github/workflows/conv04f-genetics-certification.yml
  bn/biology/higher-zoology-tree/genetics/course-index/index.html
  bn/biology/higher-zoology-tree/genetics/index.html
  _data/academic/conv04f_genetics_authorization_v1.json
  _data/academic/conv04f_genetics_v1.json
  docs/academic/conv04/GENETICS_CONVERGENCE.md
  docs/academic/conv04/GENETICS_CONVERGENCE_AUTHORIZATION.md
].freeze

MODULE_BLOBS = {
  "_biology/higher-zoology-tree/genetics/lecture-01-foundations-of-genetics.md" => "575a2188d96101d5caca491d80027a495eb73ec1",
  "_biology/higher-zoology-tree/genetics/lecture-02-genetic-terminology.md" => "b8caef89d6f08a5002a6ad77dd6cda1250642097",
  "_biology/higher-zoology-tree/genetics/lecture-03-mendel-and-pea-plant.md" => "0992d1c73c36f86a50269e985d8216bce850a21a",
  "_biology/higher-zoology-tree/genetics/lecture-04-one-character.md" => "963b1dc2cfbc8d9d0641a585f3e5d8fb3078a618",
  "_biology/higher-zoology-tree/genetics/lecture-05-two-character.md" => "6515548e4d85e20e78c133f82655a425c0cc0a10",
  "_biology/higher-zoology-tree/genetics/lecture-06.md" => "1986ed229c93783db005c68107144959690e13a3",
  "_biology/higher-zoology-tree/genetics/lecture-07.md" => "5393cad5910141bb622ea9e10d523c6687106d51",
  "_biology/higher-zoology-tree/genetics/lecture-08.md" => "d74f2bfb03a6a37e7854f1cd75145c03e30bfe0c",
  "_biology/higher-zoology-tree/genetics/lecture-09.md" => "2d16fc78828cc00e3968acddcee38d55f3379ec4",
  "_biology/higher-zoology-tree/genetics/lecture-10-basic.md" => "4c6f04b0998023ea3801d65ac48d5b6b0f18372a",
  "_biology/higher-zoology-tree/genetics/lecture-011.md" => "c1cd7d7b5dde9cffbc5c50dcd7341ef8d57b0ff0",
  "_biology/higher-zoology-tree/genetics/lecture-012-safe.md" => "1214573ed6e7b1f628b49fcb046360ca7d044e8b",
  "_biology/higher-zoology-tree/genetics/lecture-013-safe.md" => "f349551856101020d0ec78338df3ba81c9f27979",
  "_biology/higher-zoology-tree/genetics/lecture-014-safe.md" => "df7cc1edca1ab2216ff0252badb5f2d699635ea9",
  "_biology/higher-zoology-tree/genetics/lecture-015-safe.md" => "69141a8d77a059a840f8e211ff2b017ec4a91628",
  "_biology/higher-zoology-tree/genetics/l16-safe.md" => "b24b5f17f26f37734fc5a1512c87a0a6a66998fe",
  "_biology/higher-zoology-tree/genetics/l17-safe.md" => "62e49f7e6d3af44fd7ed5708e9b38655d292139b"
}.freeze

EXPECTED_ROUTES = [
  "/biology/higher-zoology-tree/genetics/foundations-of-genetics/",
  "/biology/higher-zoology-tree/genetics/genetic-terminology/",
  "/biology/higher-zoology-tree/genetics/mendel-and-pea-plant/",
  "/biology/higher-zoology-tree/genetics/monohybrid-cross/",
  "/biology/higher-zoology-tree/genetics/dihybrid-cross/",
  "/biology/higher-zoology-tree/genetics/gene-interaction/",
  "/biology/higher-zoology-tree/genetics/epistasis-gene-ratios/",
  "/biology/higher-zoology-tree/genetics/linkage/",
  "/biology/higher-zoology-tree/genetics/gene-mapping/",
  "/biology/higher-zoology-tree/genetics/chromosome-patterns/",
  "/biology/higher-zoology-tree/genetics/lecture-11/",
  "/biology/higher-zoology-tree/genetics/lecture-12/",
  "/biology/higher-zoology-tree/genetics/lecture-13/",
  "/biology/higher-zoology-tree/genetics/lecture-14/",
  "/biology/higher-zoology-tree/genetics/lecture-15/",
  "/biology/higher-zoology-tree/genetics/lecture-16/",
  "/biology/higher-zoology-tree/genetics/lecture-17/"
].freeze

RESPONSIBLE = "Genetics examples may discuss inheritance patterns, textbook conditions, chromosomal abnormalities, mutation, and family-pattern logic. These discussions are educational and do not provide medical diagnosis, family-risk prediction, genetic counselling, treatment guidance, or institutional certification."

errors = []

def need(errors, condition, message)
  errors << message unless condition
end

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def fm(source, key)
  front = source.split(/^---\s*$\n?/, 3)[1].to_s
  line = front.lines.find { |l| l.match?(/\A#{Regexp.escape(key)}:\s*/) }
  return nil unless line
  value = line.sub(/\A#{Regexp.escape(key)}:\s*/, "").strip
  if value.length >= 2 && ((value.start_with?('"') && value.end_with?('"')) || (value.start_with?("'") && value.end_with?("'")))
    value = value[1..-2]
  end
  value
end

def git(*args)
  Open3.capture2e("git", "-C", ROOT.to_s, *args)
end

def phase_order(value)
  m = PHASE_PATTERN.match(value.to_s.strip)
  return nil unless m
  [m[1].ord, m[2] ? m[2].to_i : 0, m[3] ? m[3].to_i : 0]
end

def strip_added_frontmatter(source)
  source.lines.reject do |line|
    line.match?(/\A(?:lang:\s*en|academic_system:\s*v1|academic_role:\s*academic_gateway|learning_guide:\s*canonical)\s*\z/)
  end.join
end

def normalize_gateway(source)
  strip_added_frontmatter(source).sub(CTA, LEGACY)
end

def normalize_course_index(source)
  cleaned = strip_added_frontmatter(source)
  cleaned = cleaned.sub(/^language:\s*en$/m, "language: bn")
  cleaned = cleaned.sub(CTA, LEGACY)
  cleaned = cleaned.sub("#{TABLE_OPEN}\n\n", "")
  cleaned = cleaned.sub("\n\n</div>\n\n## Recommended Learning Path", "\n\n## Recommended Learning Path")
  cleaned
end

[AUTH, MANIFEST, GATEWAY, COURSE_INDEX, COURSE_CONTRACT, LEDGER, STATE, AUTH_DOC, DOC, BROWSER, WORKFLOW, CONFIG, BN_GATEWAY_REDIRECT, BN_COURSE_REDIRECT].each do |path|
  need(errors, path.file?, "Missing F-05 artifact: #{path.relative_path_from(ROOT)}")
end

auth = AUTH.file? ? JSON.parse(read_utf8(AUTH)) : {}
manifest = MANIFEST.file? ? JSON.parse(read_utf8(MANIFEST)) : {}
gateway = GATEWAY.file? ? read_utf8(GATEWAY) : ""
course_index = COURSE_INDEX.file? ? read_utf8(COURSE_INDEX) : ""

need(errors, auth["schema"] == "lbfl-conv04f-genetics-authorization-v1", "F-05 authorization schema mismatch")
need(errors, auth["authorized_base"] == BASE, "F-05 authorization base mismatch")
need(errors, auth["status"] == "authorized-not-implemented", "Historical F-05 authorization must remain immutable")
need(errors, manifest["schema"] == "lbfl-conv04f-genetics-v1", "F-05 manifest schema mismatch")
need(errors, manifest["phase"] == PHASE, "F-05 manifest phase mismatch")
need(errors, manifest["authorized_base"] == BASE, "F-05 manifest base mismatch")
need(
  errors,
  Array(manifest["compatibility_route_owners"]).sort == %w[
    bn/biology/higher-zoology-tree/genetics/course-index/index.html
    bn/biology/higher-zoology-tree/genetics/index.html
  ],
  "F-05 compatibility route-owner manifest drift"
)

{
  GATEWAY => ["/biology/higher-zoology-tree/genetics/", "Genetics Matrix"],
  COURSE_INDEX => ["/biology/higher-zoology-tree/genetics/course-index/", "Genetics Course Index"]
}.each do |path, values|
  route, title = values
  source = read_utf8(path)
  need(errors, fm(source, "permalink") == route, "#{path.basename}: permalink drift")
  need(errors, fm(source, "language") == "en", "#{path.basename}: legacy language must be en")
  need(errors, fm(source, "lang") == "en", "#{path.basename}: lang must be en")
  need(errors, fm(source, "academic_system") == "v1", "#{path.basename}: academic_system must be v1")
  need(errors, fm(source, "academic_role") == "academic_gateway", "#{path.basename}: role mismatch")
  need(errors, fm(source, "learning_guide") == "canonical", "#{path.basename}: canonical Learning Guide owner missing")
  need(errors, source.scan(CTA).length == 1, "#{path.basename}: exactly one canonical Learning Guide CTA required")
  need(errors, !source.include?(LEGACY), "#{path.basename}: legacy framework include remains")
  need(errors, !source.match?(/<style\b|\sstyle\s*=/i), "#{path.basename}: local style debt not authorized")
  need(errors, !source.match?(/<script\b/i), "#{path.basename}: local script debt not authorized")
  need(errors, source.include?("# #{title}"), "#{path.basename}: H1 content drift")
end

{
  BN_GATEWAY_REDIRECT => "/biology/higher-zoology-tree/genetics/",
  BN_COURSE_REDIRECT => "/biology/higher-zoology-tree/genetics/course-index/"
}.each do |path, canonical|
  source = read_utf8(path)
  need(errors, source.include?("data-f05-genetics-bn-fallback"), "#{path.basename}: compatibility marker missing")
  need(errors, source.include?("href=\"#{canonical}\""), "#{path.basename}: canonical English destination missing")
  need(errors, source.include?("content=\"0; url=#{canonical}\""), "#{path.basename}: compatibility redirect target missing")
end

config = read_utf8(CONFIG)
[
  "bn/biology/higher-zoology-tree/genetics/index.html",
  "bn/biology/higher-zoology-tree/genetics/course-index/index.html"
].each do |relative|
  need(errors, config.lines.any? { |line| line.strip == "- #{relative}" }, "Polyglot localization exclusion missing: #{relative}")
end

need(errors, gateway.include?(RESPONSIBLE), "Responsible Genetics Boundary wording changed")
need(errors, course_index.include?(TABLE_OPEN), "Genetics course map missing Academic table wrapper")
EXPECTED_ROUTES.each { |route| need(errors, course_index.include?(route), "Course index lost route #{route}") }
course_table = course_index[/## Complete Lecture Route Map\s*(.*?)\s*## Recommended Learning Path/m, 1].to_s
ordered_course_routes = course_table.scan(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/).flatten
need(errors, ordered_course_routes == EXPECTED_ROUTES, "Genetics course-index learner route order drift")

base_contract, contract_status = git("show", "#{BASE}:_data/academic/course_contract_v1.json")
need(errors, contract_status.success?, "Unable to authenticate base course contract")

MODULE_BLOBS.each do |relative, expected_blob|
  current, status = git("rev-parse", "HEAD:#{relative}")
  need(errors, status.success?, "Unable to resolve protected module #{relative}")
  need(errors, current.strip == expected_blob, "Protected Genetics module changed: #{relative}") if status.success?
end

if COURSE_CONTRACT.file?
  contract = JSON.parse(read_utf8(COURSE_CONTRACT))
  genetics = Array(contract["pathways"]).find { |x| x["course_id"] == "higher-zoology-genetics" }
  need(errors, !genetics.nil?, "Genetics course contract entry missing")
  if genetics
    modules = Array(genetics["modules"])
    need(errors, modules.length == 17, "Genetics course contract must remain 17 modules")
    need(errors, modules.map { |m| m["order"] } == (1..17).to_a, "Genetics module order drift")
    need(errors, modules.map { |m| m["route"] } == EXPECTED_ROUTES, "Genetics module route sequence drift")
    need(errors, genetics["canonical_route"] == "/biology/higher-zoology-tree/genetics/course-index/", "Genetics canonical course route drift")
    if contract_status.success?
      base_contract_json = JSON.parse(base_contract)
      base_genetics = Array(base_contract_json["pathways"]).find { |x| x["course_id"] == "higher-zoology-genetics" }
      need(errors, genetics == base_genetics, "Protected higher-zoology-genetics course-contract entry changed")
    end
  end
end

if LEDGER.file?
  ledger = JSON.parse(read_utf8(LEDGER))
  expected = {
    "genetics-gateway" => ["/biology/higher-zoology-tree/genetics/", "_biology/higher-zoology-tree/genetics/index.md"],
    "genetics-course-index" => ["/biology/higher-zoology-tree/genetics/course-index/", "_biology/higher-zoology-tree/genetics/course-index.md"]
  }
  expected.each do |id, values|
    route, source_file = values
    item = Array(ledger["routes"]).find { |x| x["id"] == id }
    need(errors, !item.nil?, "Route ledger missing #{id}")
    next unless item
    need(errors, item["canonical_route"] == route, "#{id}: route drift")
    need(errors, item["source_file"] == source_file, "#{id}: source drift")
    need(errors, item["academic_role"] == "academic_gateway", "#{id}: role drift")
    need(errors, item["language"] == "en", "#{id}: language drift")
    need(errors, item["boundary_owner"] == "layout", "#{id}: boundary owner drift")
    need(errors, item["learning_guide_owner"] == "canonical", "#{id}: Learning Guide owner drift")
    need(errors, item["assessment_owner"] == "mcq-arena", "#{id}: assessment owner drift")
    need(errors, item["enforcement"] == "strict", "#{id}: strict enforcement missing")
    need(errors, Array(item["source_debt"]).empty? && Array(item["live_debt"]).empty?, "#{id}: strict debt remains")
  end
end

mode = ENV.fetch("CERTIFICATION_MODE", "local")
comparison_base = ENV["PR_BASE_SHA"].to_s.strip
if comparison_base.empty?
  parent, status = git("rev-parse", "HEAD^")
  comparison_base = status.success? ? parent.strip : BASE
end
bootstrap = mode == "pull_request" && comparison_base == BASE
future = mode == "pull_request" && comparison_base != BASE

if bootstrap
  need(errors, read_utf8(COURSE_CONTRACT) == base_contract, "Course contract changed in F-05 bootstrap") if contract_status.success?
  base_gateway, sg = git("show", "#{BASE}:_biology/higher-zoology-tree/genetics/index.md")
  base_index, si = git("show", "#{BASE}:_biology/higher-zoology-tree/genetics/course-index.md")
  need(errors, sg.success? && normalize_gateway(gateway) == base_gateway, "Genetics gateway changed outside authorized structural additions")
  need(errors, si.success? && normalize_course_index(course_index) == base_index, "Genetics course index changed outside authorized structural additions")
  state = read_utf8(STATE)
  need(errors, state.include?("phase: #{PHASE}"), "F-05 state phase mismatch")
  need(errors, state.include?("authorized_base: #{BASE}"), "F-05 state base mismatch")
end

diff, diff_status = git("diff", "--name-only", "#{comparison_base}...HEAD")
if diff_status.success?
  changed = diff.lines.map(&:strip).reject(&:empty?).sort
  if bootstrap
    missing = BOOTSTRAP_FILES.sort - changed
    extra = changed - BOOTSTRAP_FILES.sort
    need(errors, missing.empty?, "F-05 expected changed files missing: #{missing.join(', ')}")
    need(errors, extra.empty?, "F-05 unexpected changed files: #{extra.join(', ')}")
  elsif future
    forbidden = changed & IMMUTABLE_F05
    need(errors, forbidden.empty?, "Successor phase changed immutable F-05 artifacts: #{forbidden.join(', ')}")
    if changed.include?("docs/academic/conv04/CONV04_STATE.md")
      base_state, bs = git("show", "#{comparison_base}:docs/academic/conv04/CONV04_STATE.md")
      if bs.success?
        bp = base_state[/^phase:\s*(\S+)/, 1]
        cp = read_utf8(STATE)[/^phase:\s*(\S+)/, 1]
        bo, co = phase_order(bp), phase_order(cp)
        need(errors, bo && co && (co <=> bo) > 0, "Successor phase must advance CONV04_STATE monotonically")
      else
        errors << "Unable to authenticate base state for retained F-05 certification"
      end
    end
  end
else
  errors << "Unable to inspect F-05 changed-file scope: #{diff.strip}"
end

if errors.empty?
  puts "CONV-04F-05 Genetics convergence: PASS"
  exit 0
end

warn "CONV-04F-05 Genetics convergence: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
