#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "61348e5b9387bdcc565106a9813135cbcc9bcdcc"
PHASE = "CONV-04F-09-R91"
SOURCE_REL = "_biology/higher-zoology-tree/practical/07-zooplankton.bn.md"
MANIFEST_REL = "_data/academic/conv04f_zoology_practical_zooplankton_v1.json"
LEDGER_REL = "docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json"
STATE_REL = "docs/academic/conv04/CONV04_STATE.md"
AUTH_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_ZOOPLANKTON_F09_R90_AUTHORIZATION.md"
IMPL_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_ZOOPLANKTON_F09_R91_IMPLEMENTATION.md"
COURSE_REL = "_data/academic/course_contract_v1.json"
COVERAGE_REL = "_data/zoology-practical-213106-coverage.json"
SHARED_CSS_REL = "assets/css/zoology-practical.css"
SHARED_JS_REL = "assets/js/zoology-practical.js"
ACADEMIC_CSS_REL = "assets/css/academic-design-system.css"
CTA_INCLUDE_REL = "_includes/education/learning-guide-cta.html"
BROWSER_REL = ".github/scripts/conv04f-zoology-practical-zooplankton-browser-certification.mjs"
WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-zooplankton-certification.yml"
PROD_WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml"
VALIDATOR_REL = ".github/scripts/validate-conv04f-zoology-practical-zooplankton.rb"
RESOLVER_REL = ".github/scripts/resolve-cloudflare-targets.py"
CTA = "{% include education/learning-guide-cta.html %}"

CHANGED_FILES = [
  BROWSER_REL, VALIDATOR_REL, WORKFLOW_REL, PROD_WORKFLOW_REL,
  SOURCE_REL, MANIFEST_REL, LEDGER_REL, STATE_REL, IMPL_REL
].sort.freeze

BASE_BLOBS = {
  "_biology/higher-zoology-tree/practical/index.bn.md" => "d45ae49889c5e6d02445776ca5120f5fcedda65e",
  "_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md" => "bf14db772daaa5bbf1d7386d7f146b7d9a730799",
  "_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md" => "0594b755e3cf2301de48e04e60324be3a404531a",
  "_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md" => "e308b42266dbbf5963cd7c9b89c12a6fb2427424",
  "_biology/higher-zoology-tree/practical/04-dissection.bn.md" => "13b112f04ebf484d74cbca8e98fd39ab70430e3c",
  "_biology/higher-zoology-tree/practical/05-temporary-mounts.bn.md" => "c91e0bbbd8b10f5503aef0aa262864523949c97a",
  "_biology/higher-zoology-tree/practical/06-appendages.bn.md" => "5ba59f589effd233770e120487430fde5b983204",
  SOURCE_REL => "c120863ca31d85a33f1476b3f5bab59d571950cf",
  "_biology/higher-zoology-tree/practical/08-field-report.bn.md" => "6398c601c3a1b3cd891e8ea945d704d5d94b9711",
  COURSE_REL => "a02365ea6743c44a1eddaf84ad05f66d670ade6b",
  COVERAGE_REL => "ab66ddafc1346b65337bc52236d1029a77cf5792",
  SHARED_CSS_REL => "0962ae71cd1e424e27949b409f5284493f722dd3",
  SHARED_JS_REL => "207684413ad7925686334cafc3748861a439f206",
  ACADEMIC_CSS_REL => "e461a46d9defd592bb098adfa12472543dacd41b",
  CTA_INCLUDE_REL => "701c02c2e9faa5e63db71cc8a16cb4ba8c87e233",
  RESOLVER_REL => "7a31ba767463340bfbb53b841c1cc62fb33487e5",
  AUTH_REL => "6a91f9ddb944ba172d157ee035fe49bdb3fe02ce"
}.freeze

errors = []

def need(errors, cond, msg)
  errors << msg unless cond
end

def read_utf8(rel)
  File.read(ROOT.join(rel), encoding: "UTF-8")
end

def git(*args)
  Open3.capture3("git", "-C", ROOT.to_s, *args)
end

def git_text(*args)
  out, err, st = git(*args)
  raise "git #{args.join(' ')} failed: #{err}" unless st.success?
  out
end

def top_scalar(source, key)
  top = source.split(/^##\s/, 2).first.to_s
  m = top.match(/^#{Regexp.escape(key)}:\s*(.*?)\s*$/)
  m && m[1]
end

def top_list(source, key)
  top = source.split(/^##\s/, 2).first.to_s
  lines = top.lines
  i = lines.index { |x| x.match?(/\A#{Regexp.escape(key)}:\s*\z/) }
  return [] unless i
  out = []
  lines[(i + 1)..].to_a.each do |line|
    if (m = line.match(/^\s+-\s+(.+?)\s*$/))
      out << m[1].strip
    elsif line.match?(/^\S/)
      break
    end
  end
  out
end

def phase_order(value)
  m = /\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.match(value.to_s.strip)
  m ? [m[1].ord, (m[2] || "0").to_i, (m[3] || "0").to_i] : nil
end

def markdown_tables(source)
  out = []
  current = []
  source.lines.each do |line|
    if line.start_with?("|")
      current << line
    elsif !current.empty?
      out << current.join.chomp
      current = []
    end
  end
  out << current.join.chomp unless current.empty?
  out
end

def expected_source(baseline)
  out = baseline.dup
  marker = "locale: bn-BD\n"
  raise "locale anchor missing" unless out.include?(marker)
  out.sub!(marker, marker + "academic_system: v1\nacademic_role: practical\nlearning_guide: canonical\n")

  h1_anchor = "# Quantify Zooplankton in Three Water Bodies\n\n## Research Question"
  raise "H1 anchor missing" unless out.include?(h1_anchor)
  out.sub!(h1_anchor, "# Quantify Zooplankton in Three Water Bodies\n\n#{CTA}\n\n## Research Question")

  tables = markdown_tables(baseline)
  raise "baseline table count != 3" unless tables.length == 3
  labels = [
    "Zooplankton suggested metadata table",
    "Zooplankton example data table",
    "Zooplankton 20-mark report structure table"
  ]
  tables.each_with_index do |table, i|
    wrapper = %(<div class="lbfl-academic-table-wrap zoology-practical-table-scroll" tabindex="0" role="region" aria-label="#{labels[i]}" markdown="1">\n\n#{table}\n\n</div>)
    raise "table replacement anchor missing #{i}" unless out.include?(table)
    out.sub!(table, wrapper)
  end
  out
end

comparison_base = ENV["PR_BASE_SHA"].to_s.strip
comparison_base = BASE if comparison_base.empty?
bootstrap = comparison_base == BASE
future = !bootstrap
state_text = File.exist?(ROOT.join(STATE_REL)) ? read_utf8(STATE_REL) : ""
phase = top_scalar(state_text, "phase")

changed = git_text("diff", "--name-only", "#{comparison_base}...HEAD").lines.map(&:strip).reject(&:empty?).sort
if bootstrap
  need(errors, phase == PHASE, "R91 bootstrap phase must be exactly #{PHASE}")
  need(errors, changed == CHANGED_FILES, "R91 changed-file scope mismatch: #{changed.inspect}")
end

# Authenticate immutable R90 baseline and protect it during the bootstrap phase.
BASE_BLOBS.each do |rel, expected|
  actual = git_text("rev-parse", "#{BASE}:#{rel}").strip
  need(errors, actual == expected, "R91 authenticated base blob mismatch: #{rel}")

  # The merged R90 authorization is permanent authority evidence. It is immutable
  # on bootstrap and on every successor; a later PR cannot rewrite its own authority.
  if rel == AUTH_REL
    current = git_text("rev-parse", "HEAD:#{rel}").strip
    need(errors, current == expected, "R91/R90 authorization record drift: #{rel}")
    next
  end

  next if rel == SOURCE_REL || !bootstrap
  current = git_text("rev-parse", "HEAD:#{rel}").strip
  need(errors, current == expected, "R91 changed protected baseline: #{rel}")
end

[ SOURCE_REL, MANIFEST_REL, LEDGER_REL, STATE_REL, AUTH_REL, IMPL_REL,
  COURSE_REL, COVERAGE_REL, BROWSER_REL, WORKFLOW_REL, PROD_WORKFLOW_REL, VALIDATOR_REL, RESOLVER_REL
].each do |rel|
  need(errors, File.file?(ROOT.join(rel)), "Missing R91 artifact: #{rel}")
end

baseline = git_text("show", "#{BASE}:#{SOURCE_REL}")
candidate = read_utf8(SOURCE_REL)
expected = expected_source(baseline)

predecessor_authorized = false
if !bootstrap && candidate != expected
  # Successor learner authority must already exist in the authenticated PR base.
  # The candidate is forbidden from granting itself authority by editing STATE_REL
  # and the learner source in the same PR.
  base_state = git_text("show", "#{comparison_base}:#{STATE_REL}")
  bo = phase_order(top_scalar(base_state, "phase"))
  co = phase_order(phase)
  ro = phase_order(PHASE)
  base_mode = top_scalar(base_state, "mode").to_s

  predecessor_authorized =
    bo && co && ro &&
    (bo <=> ro) > 0 &&
    (co <=> bo) > 0 &&
    base_mode.include?("authorization-only") &&
    top_list(base_state, "learner_mutation_allowlist").include?(SOURCE_REL) &&
    top_scalar(state_text, "authorized_base") == comparison_base
end
need(errors, candidate == expected || predecessor_authorized,
     "R91 successor learner mutation lacks authority already present in the authenticated predecessor/base state")

if bootstrap
  need(errors, candidate == expected, "R91 learner source exact reconstruction failed")
end

# Source-level census stays frozen.
body = candidate.sub(/\A---\n.*?\n---\n/m, "")
need(errors, body.scan(/^# /).length == 1, "R91 H1 hierarchy drift")
need(errors, body.scan(/^## /).length == 13, "R91 H2 hierarchy drift")
need(errors, body.scan(/^### /).length == 3, "R91 H3 hierarchy drift")
need(errors, body.scan(/^\|.*\|$/).length == 33, "R91 Markdown table-line census drift")
need(errors, body.scan(/^\d+\. /).length == 11, "R91 numbered-item census drift")
need(errors, body.scan(/^- /).length == 13, "R91 bullet census drift")
need(errors, candidate.scan(CTA).length == 1, "R91 canonical CTA count must be 1")
need(errors, candidate.include?("# Quantify Zooplankton in Three Water Bodies\n\n#{CTA}\n\n## Research Question"),
     "R91 CTA must immediately follow the existing H1")

labels = candidate.scan(/^<div class="lbfl-academic-table-wrap zoology-practical-table-scroll" tabindex="0" role="region" aria-label="([^"]+)" markdown="1">$/).flatten
need(errors, labels == [
  "Zooplankton suggested metadata table",
  "Zooplankton example data table",
  "Zooplankton 20-mark report structure table"
], "R91 wrapper labels/order drift")
need(errors, candidate.lines.count { |l| l.strip == "</div>" } == 3, "R91 wrapper closing count must be 3")

# Complete-ledger proof on bootstrap; retained row proof on successors.
ledger = JSON.parse(read_utf8(LEDGER_REL))
route_row = {
  "id" => "higher-zoology-practical-zooplankton",
  "canonical_route" => "/biology/higher-zoology-tree/practical/zooplankton/",
  "source_file" => SOURCE_REL,
  "support_files" => [COVERAGE_REL],
  "academic_role" => "practical",
  "language" => "bn",
  "boundary_owner" => "layout",
  "learning_guide_owner" => "canonical",
  "assessment_owner" => "mcq-arena",
  "enforcement" => "strict",
  "source_debt" => [],
  "live_debt" => []
}
rows = Array(ledger["routes"]).select { |r| r["id"] == route_row["id"] }
need(errors, rows.length == 1 && rows.first == route_row, "R91 strict Zooplankton route row mismatch")
if bootstrap
  base_ledger = JSON.parse(git_text("show", "#{BASE}:#{LEDGER_REL}"))
  expected_ledger = JSON.parse(JSON.generate(base_ledger))
  routes = Array(expected_ledger["routes"])
  anchor = routes.index { |r| r["id"] == "higher-zoology-practical-appendages" }
  if anchor
    routes.insert(anchor + 1, route_row)
    need(errors, ledger == expected_ledger, "R91 ledger must equal exact R90 base + one Zooplankton row")
  else
    errors << "R91 base ledger missing Appendages insertion anchor"
  end
end

course = JSON.parse(read_utf8(COURSE_REL))
pathway = Array(course["pathways"]).find { |p| p["course_id"] == "nu-zoology-practical-213106" }
mod = Array(pathway && pathway["modules"]).find { |m| m["module_id"] == "prac-07" }
need(errors, mod && mod["order"] == 7 && mod["source_file"] == SOURCE_REL &&
  mod["route"] == "/biology/higher-zoology-tree/practical/zooplankton/" &&
  mod["previous"] == "prac-06" && mod["next"] == "prac-08",
  "R91 course-contract custody mismatch")

coverage = JSON.parse(read_utf8(COVERAGE_REL))
cov = Array(coverage["modules"]).find { |m| m["id"] == "07" }
need(errors, cov && cov["status"] == "complete" &&
  cov["coverage"] == "3 water bodies + counting + Simpson + Shannon + 20-mark report",
  "R91 coverage custody mismatch")

manifest = JSON.parse(read_utf8(MANIFEST_REL))
need(errors, manifest["authorized_base"] == BASE, "R91 manifest base mismatch")
need(errors, manifest["module_id"] == "prac-07", "R91 manifest module mismatch")
need(errors, manifest["baseline_blob_sha"] == BASE_BLOBS[SOURCE_REL], "R91 manifest baseline mismatch")
expected_census = {
  "h1"=>1, "h2"=>13, "h3"=>3, "markdown_tables"=>3, "markdown_table_lines"=>33,
  "numbered_items"=>11, "bullet_items"=>13, "suggested_metadata_rows"=>11,
  "example_data_rows"=>6, "report_rows_including_total"=>10,
  "sampling_steps"=>6, "discussion_questions"=>5
}
need(errors, manifest["content_census"] == expected_census, "R91 manifest census mismatch")
need(errors, manifest.dig("mutation","table_wrapper_count") == 3, "R91 manifest wrapper count mismatch")
need(errors, manifest.dig("preservation","heading_normalization") == false, "R91 heading normalization must be false")
need(errors, manifest.dig("preservation","new_stylesheet_or_script_import") == false, "R91 import mutation must be false")

if bootstrap
  need(errors, top_scalar(state_text, "authorized_base") == BASE, "R91 state base mismatch")
  need(errors, top_list(state_text, "learner_mutation_allowlist") == [SOURCE_REL], "R91 state learner allowlist mismatch")
  need(errors,
       top_scalar(state_text, "next_module_gate") == "prac-08 BLOCKED — requires R91 exact-main immutable + canonical production parity PASS",
       "R91 top-level next-module gate must keep prac-08 blocked until exact-main production parity")
elsif future
  protected_artifacts = [VALIDATOR_REL, MANIFEST_REL, AUTH_REL, IMPL_REL, BROWSER_REL, WORKFLOW_REL, PROD_WORKFLOW_REL, RESOLVER_REL]
  touched = changed & protected_artifacts
  need(errors, touched.empty?, "Successor changed protected R91 enforcement artifacts: #{touched.join(', ')}")
end

# Workflow security/certification boundaries.
prod = read_utf8(PROD_WORKFLOW_REL)
need(errors, !prod.match?(/^\s*workflow_dispatch\s*:/), "R91 production parity must be push-to-main only")
need(errors, prod.include?("pull_request_target:"), "R91 trusted successor guard trigger missing")
pull_target = prod[/pull_request_target:\n(.*?)(?=\npermissions:)/m, 1].to_s
need(errors, !pull_target.include?("paths:"), "R91 trusted successor guard must be unfiltered by paths")
need(errors, prod.include?('".github/scripts/resolve-cloudflare-targets.py"'), "R91 trusted guard must protect resolver")
need(errors, prod.include?('PUSH_BEFORE: ${{ github.event.before }}'), "R91 production parity must authenticate the complete push range")
need(errors, prod.include?('PR_BASE_SHA=$PUSH_BEFORE'), "R91 validator comparison base must use push.before")
need(errors, prod.include?("build_site:"), "R91 unprivileged build job missing")
need(errors, prod.include?("needs: build_site"), "R91 credentialed production job must depend on isolated build artifact")
need(errors, prod.include?("wrangler@4.147.0"), "R91 production parity must pin Wrangler 4.147.0")
need(errors, prod.include?("--registry=https://registry.npmjs.org/"), "R91 npm registry must be explicit")
need(errors, prod.include?("NPM_CONFIG_USERCONFIG:"), "R91 isolated npm user config missing")
need(errors, prod.include?("NPM_CONFIG_GLOBALCONFIG:"), "R91 isolated npm global config missing")
need(errors, prod.include?('$RUNNER_TEMP/wrangler-tool/node_modules/.bin/wrangler'), "R91 Wrangler must execute from isolated temp workspace")
need(errors, prod.include?("trusted-repo/.github/scripts/resolve-cloudflare-targets.py"), "R91 resolver must execute from clean credentialed checkout")
need(errors, prod.include?('$RUNNER_TEMP/browser-tool/certifier.mjs'), "R91 browser certifier must execute from isolated temp workspace")
production_section = prod.split(/^  production:\s*$/m, 2)[1].to_s
need(errors, !production_section.include?("bundle exec jekyll"), "R91 credentialed production job must not execute candidate Jekyll")
need(errors, !production_section.include?("bundle install"), "R91 credentialed production job must not execute candidate Bundler")

if errors.empty?
  puts "CONV-04F-09-R91 Zooplankton preservation/scope: PASS"
else
  warn "CONV-04F-09-R91 Zooplankton preservation/scope: FAIL"
  errors.each { |e| warn "- #{e}" }
  exit 1
end
