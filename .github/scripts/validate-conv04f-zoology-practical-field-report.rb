#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "d86325ec281e21de1a208f1a1f31ecb531821eb4"
PHASE = "CONV-04F-09-R101"
SOURCE_REL = "_biology/higher-zoology-tree/practical/08-field-report.bn.md"
MANIFEST_REL = "_data/academic/conv04f_zoology_practical_field_report_v1.json"
LEDGER_REL = "docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json"
STATE_REL = "docs/academic/conv04/CONV04_STATE.md"
AUTH_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_FIELD_REPORT_F09_R100_AUTHORIZATION.md"
IMPL_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_FIELD_REPORT_F09_R101_IMPLEMENTATION.md"
COURSE_REL = "_data/academic/course_contract_v1.json"
COVERAGE_REL = "_data/zoology-practical-213106-coverage.json"
SHARED_CSS_REL = "assets/css/zoology-practical.css"
SHARED_JS_REL = "assets/js/zoology-practical.js"
ACADEMIC_CSS_REL = "assets/css/academic-design-system.css"
CTA_INCLUDE_REL = "_includes/education/learning-guide-cta.html"
BROWSER_REL = ".github/scripts/conv04f-zoology-practical-field-report-browser-certification.mjs"
CERT_WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-field-report-certification.yml"
PROD_WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-field-report-production-parity.yml"
SUCCESSOR_GUARD_REL = ".github/workflows/conv04f-zoology-practical-field-report-successor-guard.yml"
TRUSTED_BOOTSTRAP_WORKFLOW_REL = ".github/workflows/zoology-practical-213106-certification.yml"
VALIDATOR_REL = ".github/scripts/validate-conv04f-zoology-practical-field-report.rb"
CTA = "{% include education/learning-guide-cta.html %}"

EVIDENCE_RELS = %w[
  docs/academic/conv04/ZOOLOGY_PRACTICAL_FIELD_REPORT_F09_R101_A11Y_EVIDENCE.md
  docs/academic/conv04/ZOOLOGY_PRACTICAL_FIELD_REPORT_F09_R101_ALLOWLIST.md
  docs/academic/conv04/ZOOLOGY_PRACTICAL_FIELD_REPORT_F09_R101_BROWSER_EVIDENCE.md
  docs/academic/conv04/ZOOLOGY_PRACTICAL_FIELD_REPORT_F09_R101_CERTIFICATION.md
  docs/academic/conv04/ZOOLOGY_PRACTICAL_FIELD_REPORT_F09_R101_PRODUCTION_EVIDENCE.md
  docs/academic/conv04/ZOOLOGY_PRACTICAL_FIELD_REPORT_F09_R101_REGRESSION.md
  docs/academic/conv04/ZOOLOGY_PRACTICAL_FIELD_REPORT_F09_R101_SCOPE.md
].freeze

PATHS = {
  source: ROOT.join(SOURCE_REL),
  manifest: ROOT.join(MANIFEST_REL),
  ledger: ROOT.join(LEDGER_REL),
  state: ROOT.join(STATE_REL),
  auth: ROOT.join(AUTH_REL),
  impl: ROOT.join(IMPL_REL),
  course: ROOT.join(COURSE_REL),
  coverage: ROOT.join(COVERAGE_REL)
}.freeze

BASE_BLOBS = {
  "_biology/higher-zoology-tree/practical/index.bn.md" => "d45ae49889c5e6d02445776ca5120f5fcedda65e",
  "_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md" => "bf14db772daaa5bbf1d7386d7f146b7d9a730799",
  "_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md" => "0594b755e3cf2301de48e04e60324be3a404531a",
  "_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md" => "e308b42266dbbf5963cd7c9b89c12a6fb2427424",
  "_biology/higher-zoology-tree/practical/04-dissection.bn.md" => "13b112f04ebf484d74cbca8e98fd39ab70430e3c",
  "_biology/higher-zoology-tree/practical/05-temporary-mounts.bn.md" => "c91e0bbbd8b10f5503aef0aa262864523949c97a",
  "_biology/higher-zoology-tree/practical/06-appendages.bn.md" => "5ba59f589effd233770e120487430fde5b983204",
  "_biology/higher-zoology-tree/practical/07-zooplankton.bn.md" => "aae980594ea09f38567e69e5184dc1c581100148",
  SOURCE_REL => "6398c601c3a1b3cd891e8ea945d704d5d94b9711",
  COURSE_REL => "a02365ea6743c44a1eddaf84ad05f66d670ade6b",
  COVERAGE_REL => "ab66ddafc1346b65337bc52236d1029a77cf5792",
  SHARED_CSS_REL => "0962ae71cd1e424e27949b409f5284493f722dd3",
  SHARED_JS_REL => "207684413ad7925686334cafc3748861a439f206",
  ACADEMIC_CSS_REL => "e461a46d9defd592bb098adfa12472543dacd41b",
  CTA_INCLUDE_REL => "701c02c2e9faa5e63db71cc8a16cb4ba8c87e233"
}.freeze

CHANGED_FILES = ([
  BROWSER_REL,
  VALIDATOR_REL,
  CERT_WORKFLOW_REL,
  PROD_WORKFLOW_REL,
  SUCCESSOR_GUARD_REL,
  TRUSTED_BOOTSTRAP_WORKFLOW_REL,
  SOURCE_REL,
  MANIFEST_REL,
  LEDGER_REL,
  STATE_REL,
  IMPL_REL
] + EVIDENCE_RELS).sort.freeze

errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def need(errors, condition, message)
  errors << message unless condition
end

def git(*args)
  Open3.capture3("git", "-C", ROOT.to_s, *args)
end

def fm_value(source, key)
  return nil unless source.start_with?("---")
  front = source.split(/^---\s*$\n?/, 3)[1].to_s
  line = front.lines.find { |l| l.match?(/\A#{Regexp.escape(key)}:\s*/) }
  return nil unless line
  value = line.sub(/\A#{Regexp.escape(key)}:\s*/, "").strip
  value = value[1..-2] if value.length >= 2 &&
    ((value.start_with?('"') && value.end_with?('"')) ||
     (value.start_with?("'") && value.end_with?("'")))
  value
end

def phase_order(value)
  m = /\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.match(value.to_s.strip)
  m ? [m[1].ord, (m[2] || "0").to_i, (m[3] || "0").to_i] : nil
end

def top_level_scalar(source, key)
  top = source.split(/^##\s/, 2).first.to_s
  match = top.match(/^#{Regexp.escape(key)}:\s*(\S.*?)\s*$/)
  match ? match[1].strip : nil
end

def top_level_list(source, key)
  top = source.split(/^##\s/, 2).first.to_s
  lines = top.lines
  index = lines.index { |line| line.match?(/\A#{Regexp.escape(key)}:\s*\z/) }
  return [] unless index
  items = []
  lines[(index + 1)..].to_a.each do |line|
    if (match = line.match(/^\s+-\s+(.+?)\s*$/))
      items << match[1].strip
    elsif line.strip.empty?
      next
    elsif line.match?(/^\S/)
      break
    end
  end
  items
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

def authorized_transform(source)
  out = source.dup
  anchor = "locale: bn-BD\n"
  raise "R101 locale anchor missing" unless out.include?(anchor)
  out.sub!(anchor, anchor + "academic_system: v1\nacademic_role: practical\nlearning_guide: canonical\n")

  h1 = "# Field Visit, Collection & Scientific Report\n\n## Syllabus Requirement"
  raise "R101 H1 anchor missing" unless out.include?(h1)
  out.sub!(h1, "# Field Visit, Collection & Scientific Report\n\n#{CTA}\n\n## Syllabus Requirement")

  tables = markdown_tables(source)
  raise "R101 baseline table count must be 2" unless tables.length == 2
  labels = ["Field Report results table", "Field Report 17-mark distribution table"]
  tables.each_with_index do |table, index|
    wrapper = %(<div class="lbfl-academic-table-wrap zoology-practical-table-scroll" tabindex="0" role="region" aria-label="#{labels[index]}" markdown="1">\n\n#{table}\n\n</div>)
    raise "R101 table replacement failed" unless out.include?(table)
    out.sub!(table, wrapper)
  end
  out
end

comparison_base = ENV["PR_BASE_SHA"].to_s.strip
comparison_base = BASE if comparison_base.empty?
state_text = PATHS[:state].file? ? read_utf8(PATHS[:state]) : ""
phase = top_level_scalar(state_text, "phase")
bootstrap = comparison_base == BASE
future = comparison_base != BASE
need(errors, phase == PHASE, "R101 bootstrap phase must be exactly #{PHASE}") if bootstrap

current_order = phase_order(phase)
r101_order = phase_order(PHASE)
maintenance = future && current_order && r101_order &&
  current_order[0,2] == r101_order[0,2] &&
  current_order[2].between?(102,109)

changed = []
stdout, stderr, status = git("diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
else
  errors << "Unable to inspect R101 changed-file scope: #{stderr.strip}"
end

successor_authorized = false
successor_allowlist = []
# CONV-04J governance-only transition is not a Practical successor release.
# Preserve all Practical source/contract checks; bypass only the obsolete
# state-phase advancement predicate when the complete PR diff is J governance.
j_governance_only = false
if changed.sort == ["docs/academic/conv04/CONV04_STATE.md", "docs/academic/conv04/CONV04_J_RELEASE_CLOSURE.md"].sort && phase == "CONV-04J-R1"
  j_base = top_level_scalar(state_text, "j_implementation_base")
  j_governance_only = j_base && j_base.match?(/\A[0-9a-f]{40}\z/) &&
    git("merge-base", "--is-ancestor", j_base, "HEAD").last.success?
end
if future && PATHS[:state].file? && changed.include?(STATE_REL)
  base_state, _, bs = git("show", "#{comparison_base}:#{STATE_REL}")
  if bs.success?
    base_phase = top_level_scalar(base_state, "phase")
    bo = phase_order(base_phase)
    co = phase_order(phase)
    successor_authorized = bo && co && r101_order &&
      (co <=> bo) > 0 && (co <=> r101_order) > 0 &&
      top_level_scalar(state_text, "authorized_base") == comparison_base
    successor_allowlist = top_level_list(state_text, "learner_mutation_allowlist")
  else
    errors << "Unable to authenticate R101 successor base state"
  end
end

[
  SOURCE_REL, MANIFEST_REL, LEDGER_REL, STATE_REL, AUTH_REL, IMPL_REL,
  COURSE_REL, COVERAGE_REL, BROWSER_REL,
  CERT_WORKFLOW_REL, PROD_WORKFLOW_REL, SUCCESSOR_GUARD_REL, TRUSTED_BOOTSTRAP_WORKFLOW_REL, VALIDATOR_REL,
  SHARED_CSS_REL, SHARED_JS_REL, ACADEMIC_CSS_REL, CTA_INCLUDE_REL,
  *EVIDENCE_RELS
].each do |relative|
  errors << "Missing R101 artifact: #{relative}" unless ROOT.join(relative).file?
end

BASE_BLOBS.each do |relative, expected|
  blob, _, st = git("rev-parse", "#{BASE}:#{relative}")
  need(errors, st.success? && blob.strip == expected, "R101 authenticated base blob mismatch: #{relative}")
  next if relative == SOURCE_REL || !bootstrap
  baseline, _, show_status = git("show", "#{BASE}:#{relative}")
  need(errors, show_status.success? && read_utf8(ROOT.join(relative)) == baseline,
       "R101 changed protected baseline: #{relative}")
end

if PATHS[:source].file?
  baseline, _, st = git("show", "#{BASE}:#{SOURCE_REL}")
  if st.success?
    source = read_utf8(PATHS[:source])
    if bootstrap
      need(errors, source == authorized_transform(baseline),
           "Field Report source differs from exact R100-authorized reconstruction")
    elsif future && changed.include?(SOURCE_REL)
      need(errors, successor_authorized, "Successor changed prac-08 without advanced exact-base authority")
      need(errors, successor_allowlist.include?(SOURCE_REL), "Successor changed prac-08 without learner allowlist authority")
    end

    need(errors, fm_value(source, "permalink") == "/biology/higher-zoology-tree/practical/field-report/", "R101 permalink drift")
    need(errors, fm_value(source, "course_id") == "zoology-practical-213106", "R101 course_id drift")
    need(errors, fm_value(source, "page_id") == "zoology-practical-field-report", "R101 page_id drift")
    need(errors, fm_value(source, "academic_system") == "v1", "R101 academic_system missing")
    need(errors, fm_value(source, "academic_role") == "practical", "R101 academic_role missing")
    need(errors, fm_value(source, "learning_guide") == "canonical", "R101 learning_guide missing")
    need(errors, source.scan(CTA).length == 1, "R101 canonical CTA count must be 1")

    body = source.sub(/\A---\n.*?\n---\n/m, "")
    need(errors, body.scan(/^# /).length == 1, "R101 H1 source hierarchy drift")
    need(errors, body.scan(/^## /).length == 11, "R101 H2 source hierarchy drift")
    need(errors, body.scan(/^### /).length == 11, "R101 H3 source hierarchy drift")

    tables = markdown_tables(source)
    need(errors, tables.length == 2, "R101 must retain exactly two Markdown tables inside wrappers")
    need(errors, tables[0].lines.length == 4, "R101 results table must retain header + separator + 2 data rows")
    need(errors, tables[1].lines.length == 10, "R101 marks table must retain header + separator + 8 data rows")

    wrappers = source.scan(/<div class="lbfl-academic-table-wrap zoology-practical-table-scroll" tabindex="0" role="region" aria-label="([^"]+)" markdown="1">/).flatten
    need(errors, wrappers == ["Field Report results table", "Field Report 17-mark distribution table"],
         "R101 accessible wrapper labels/order drift")
    need(errors, source.scan(%r{</div>}).length >= 2, "R101 accessible wrapper closure missing")

    protected = [
      "at least **10 samples** collect",
      "Protected, threatened বা legally restricted organism collect করবে না",
      "Habitat damage এবং non-target mortality minimize করবে",
      "Sample ID:",
      "Identification status:",
      "sampling effort;",
      "photo number if photographed;",
      "\\text{Total area}=q\\times a",
      "\\bar{x}=\\frac{\\sum x_i}{q}",
      "\\text{Frequency (\\%)}=",
      "Density এবং frequency একই ecological metric নয়।",
      "p_i=\\frac{n_i}{N}",
      "H'=-\\sum p_i\\ln p_i",
      "natural log recommended",
      "Only observed/calculated data:",
      "Do not convert correlation into causation without experiment/evidence",
      "| ≥10 preserved sample submission | 7 |",
      "| **Total** | **17** |",
      "at least 10;",
      "আমার conclusion কি actual data-এর চেয়ে বেশি claim করছে?",
      "Shannon value difference ecological difference, sampling difference, নাকি দুটোই হতে পারে?"
    ]
    protected.each { |token| need(errors, source.include?(token), "R101 protected Field Report corpus missing: #{token}") }
    need(errors, source.scan(/^\d+\. /).length == 5, "R101 Socratic question count must remain 5")
  else
    errors << "Unable to read R101 baseline source"
  end
end

expected_row = {
  "id" => "higher-zoology-practical-field-report",
  "canonical_route" => "/biology/higher-zoology-tree/practical/field-report/",
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

if PATHS[:ledger].file?
  ledger = JSON.parse(read_utf8(PATHS[:ledger]))
  rows = Array(ledger["routes"]).select { |r| r["id"] == expected_row["id"] }
  need(errors, rows.length == 1, "R101 strict Field Report route row count must be 1")
  expected_row.each { |k,v| need(errors, rows.first && rows.first[k] == v, "R101 ledger mismatch for #{k}") }

  if bootstrap
    base_ledger_text, _, ledger_status = git("show", "#{BASE}:#{LEDGER_REL}")
    if ledger_status.success?
      base_ledger = JSON.parse(base_ledger_text)
      expected_ledger = JSON.parse(JSON.generate(base_ledger))
      routes = Array(expected_ledger["routes"])
      anchor = routes.index { |r| r["id"] == "higher-zoology-practical-zooplankton" }
      if anchor
        routes.insert(anchor + 1, expected_row)
        need(errors, ledger == expected_ledger,
             "R101 ledger must equal authenticated R100 base plus exactly one Field Report row")
      else
        errors << "R101 base ledger missing Zooplankton insertion anchor"
      end
    else
      errors << "Unable to authenticate R101 base route ledger"
    end
  end
end

if PATHS[:state].file?
  if bootstrap
    need(errors, phase == PHASE, "R101 state phase mismatch")
    need(errors, top_level_scalar(state_text, "mode") == "implementation candidate — prac-08 Field Report", "R101 state mode mismatch")
    need(errors, top_level_scalar(state_text, "authorized_base") == BASE, "R101 state base mismatch")
    need(errors, top_level_scalar(state_text, "branch") == "conv-04f-09-r101-prac08-field-report-20261006", "R101 branch binding mismatch")
    need(errors, top_level_list(state_text, "learner_mutation_allowlist") == [SOURCE_REL], "R101 exact learner allowlist missing")
  elsif future
    need(errors, current_order && r101_order && (current_order <=> r101_order) >= 0, "R101 successor state regressed")
    need(errors, successor_authorized || j_governance_only, "R101 successor state must advance and bind exact current base") if changed.include?(STATE_REL)
  end
end

if PATHS[:course].file?
  course = JSON.parse(read_utf8(PATHS[:course]))
  pathway = Array(course["pathways"]).find { |p| p["course_id"] == "nu-zoology-practical-213106" }
  modules = pathway ? Array(pathway["modules"]) : []
  mod = modules.find { |m| m["module_id"] == "prac-08" || m["source_file"] == SOURCE_REL }
  need(errors, !mod.nil?, "R101 prac-08 course-contract entry missing")
  if mod
    need(errors, mod["order"] == 8, "R101 course order drift")
    need(errors, mod["source_file"] == SOURCE_REL, "R101 course source drift")
    need(errors, mod["route"] == "/biology/higher-zoology-tree/practical/field-report/", "R101 course route drift")
    need(errors, mod["previous"] == "prac-07", "R101 previous-module drift")
    need(errors, mod["next"].nil?, "R101 next-module must remain null")
  end
end

if PATHS[:coverage].file?
  coverage = JSON.parse(read_utf8(PATHS[:coverage]))
  mod = Array(coverage["modules"]).find { |m| m["id"] == "08" }
  need(errors, !mod.nil?, "R101 coverage prac-08 missing")
  if mod
    need(errors, mod["status"] == "complete", "R101 coverage status drift")
    need(errors, mod["coverage"] == ">=10 samples + quadrat + Shannon + 17-mark report", "R101 coverage corpus drift")
  end
end

if PATHS[:manifest].file?
  manifest = JSON.parse(read_utf8(PATHS[:manifest]))
  need(errors, manifest["phase"] == PHASE, "R101 manifest phase mismatch")
  need(errors, manifest["authorized_base_sha"] == BASE, "R101 manifest authorized base mismatch")
  need(errors, manifest["baseline_blob"] == BASE_BLOBS[SOURCE_REL], "R101 manifest baseline blob mismatch")
  need(errors, manifest["module_id"] == "prac-08", "R101 manifest module mismatch")
  need(errors, manifest["order"] == 8, "R101 manifest order mismatch")
  need(errors, manifest["previous"] == "prac-07", "R101 manifest previous mismatch")
  need(errors, manifest["next"].nil?, "R101 manifest next must remain null")
  preservation = manifest["preservation"] || {}
  {"h1"=>1,"h2"=>11,"h3"=>11,"markdown_tables"=>2,"minimum_samples"=>10,"field_report_marks"=>17,"socratic_questions"=>5}.each do |k,v|
    need(errors, preservation[k] == v, "R101 manifest preservation mismatch: #{k}")
  end
end

if bootstrap
  need(errors, changed == CHANGED_FILES, "R101 changed-file scope mismatch: #{changed}")
elsif future
  protected_artifacts = [
    VALIDATOR_REL, MANIFEST_REL, AUTH_REL, IMPL_REL, BROWSER_REL,
    CERT_WORKFLOW_REL, PROD_WORKFLOW_REL, SUCCESSOR_GUARD_REL, TRUSTED_BOOTSTRAP_WORKFLOW_REL
  ]
  touched = changed & protected_artifacts
  if maintenance
    need(errors, successor_authorized, "R101 maintenance requires advanced exact-base authority")
  else
    need(errors, touched.empty?, "Successor changed protected R101 artifacts: #{touched.join(', ')}")
  end
end

if ROOT.join(TRUSTED_BOOTSTRAP_WORKFLOW_REL).file?
  trusted = read_utf8(ROOT.join(TRUSTED_BOOTSTRAP_WORKFLOW_REL))
  need(errors, trusted.include?("Bootstrap R101 Field Report exact-head preservation gate"),
       "R101 trusted bootstrap workflow must invoke exact-head preservation gate")
  need(errors, trusted.include?("playwright@1.62.1 axe-core@4.13.0"),
       "R101 trusted bootstrap workflow must pin browser dependencies")
  need(errors, trusted.include?("--base-url http://127.0.0.1:4173"),
       "R101 trusted bootstrap workflow must run local exact-head browser gate")
end

if ROOT.join(CERT_WORKFLOW_REL).file?
  cert = read_utf8(ROOT.join(CERT_WORKFLOW_REL))
  need(errors, cert.include?("ruby/setup-ruby@a0102e0972be65f351c307e2d64b9314a57c8073"), "R101 certification Ruby action must be immutable-pinned")
  need(errors, cert.include?('ref: ${{ env.CANDIDATE_SHA }}'), "R101 certification must check out immutable candidate SHA")
  need(errors, cert.include?("playwright@1.62.1 axe-core@4.13.0"), "R101 browser dependencies must be pinned")
end

if ROOT.join(PROD_WORKFLOW_REL).file?
  prod = read_utf8(ROOT.join(PROD_WORKFLOW_REL))
  need(errors, prod.include?("push:\n    branches: [\"main\"]"), "R101 production parity must be push-to-main")
  need(errors, !prod.include?("workflow_dispatch:"), "R101 production parity must not expose manual secret-bearing dispatch")
  need(errors, prod.include?("resolve-cloudflare-targets.py"), "R101 production parity must resolve exact Cloudflare deployment")
  need(errors, prod.include?("pages_url"), "R101 production parity must certify exact resolved Pages URL")
  need(errors, prod.include?("wrangler-4.147.0-package-lock.json"), "R101 production parity must use reviewed Wrangler lock")
end

if errors.empty?
  puts "CONV-04F-09-R101 Field Report preservation/scope: PASS"
else
  warn "CONV-04F-09-R101 Field Report preservation/scope: FAIL"
  errors.each { |e| warn "- #{e}" }
  exit 1
end
