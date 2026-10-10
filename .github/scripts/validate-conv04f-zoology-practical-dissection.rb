#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "cae5dd2252081007fab2ccd581006bc03fee37d0"
PHASE = "CONV-04F-09-R61"
SOURCE_REL = "_biology/higher-zoology-tree/practical/04-dissection.bn.md"
MANIFEST_REL = "_data/academic/conv04f_zoology_practical_dissection_v1.json"
LEDGER_REL = "docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json"
STATE_REL = "docs/academic/conv04/CONV04_STATE.md"
AUTH_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_DISSECTION_F09_R60_AUTHORIZATION.md"
IMPL_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_DISSECTION_F09_R61_IMPLEMENTATION.md"
COURSE_REL = "_data/academic/course_contract_v1.json"
COVERAGE_REL = "_data/zoology-practical-213106-coverage.json"
SHARED_CSS_REL = "assets/css/zoology-practical.css"
SHARED_JS_REL = "assets/js/zoology-practical.js"
ACADEMIC_CSS_REL = "assets/css/academic-design-system.css"
CTA_INCLUDE_REL = "_includes/education/learning-guide-cta.html"
BROWSER_REL = ".github/scripts/conv04f-zoology-practical-dissection-browser-certification.mjs"
WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-dissection-certification.yml"
PROD_WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-dissection-production-parity.yml"
VALIDATOR_REL = ".github/scripts/validate-conv04f-zoology-practical-dissection.rb"
CTA = "{% include education/learning-guide-cta.html %}"

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
  SOURCE_REL => "0bca70d74c04305fd2399f54fbb5c650f0b158c3",
  "_biology/higher-zoology-tree/practical/05-temporary-mounts.bn.md" => "b01e88d0bfe9441e984ac2a10f3a0ee761379850",
  "_biology/higher-zoology-tree/practical/06-appendages.bn.md" => "36e36c4dd8cfffb99f1669033b4a21bc0e45d939",
  "_biology/higher-zoology-tree/practical/07-zooplankton.bn.md" => "c120863ca31d85a33f1476b3f5bab59d571950cf",
  "_biology/higher-zoology-tree/practical/08-field-report.bn.md" => "6398c601c3a1b3cd891e8ea945d704d5d94b9711",
  COURSE_REL => "a02365ea6743c44a1eddaf84ad05f66d670ade6b",
  COVERAGE_REL => "ab66ddafc1346b65337bc52236d1029a77cf5792",
  SHARED_CSS_REL => "0962ae71cd1e424e27949b409f5284493f722dd3",
  SHARED_JS_REL => "207684413ad7925686334cafc3748861a439f206",
  ACADEMIC_CSS_REL => "e461a46d9defd592bb098adfa12472543dacd41b",
  CTA_INCLUDE_REL => "701c02c2e9faa5e63db71cc8a16cb4ba8c87e233"
}.freeze

CHANGED_FILES = [
  BROWSER_REL,
  VALIDATOR_REL,
  WORKFLOW_REL,
  PROD_WORKFLOW_REL,
  SOURCE_REL,
  MANIFEST_REL,
  LEDGER_REL,
  STATE_REL,
  IMPL_REL
].sort.freeze

errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def need(errors, cond, msg)
  errors << msg unless cond
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
  m = top.match(/^#{Regexp.escape(key)}:\s*(\S.*?)\s*$/)
  m ? m[1].strip : nil
end

def top_level_list(source, key)
  top = source.split(/^##\s/, 2).first.to_s
  lines = top.lines
  idx = lines.index { |line| line.match?(/\A#{Regexp.escape(key)}:\s*\z/) }
  return [] unless idx
  items = []
  lines[(idx + 1)..].to_a.each do |line|
    if (m = line.match(/^\s+-\s+(.+?)\s*$/))
      items << m[1].strip
    elsif line.strip.empty?
      next
    elsif line.match?(/^\S/)
      break
    end
  end
  items
end

def authorized_transform(source)
  out = source.dup
  out = out.sub(
    "locale: bn-BD\ntoc: true",
    "locale: bn-BD\nacademic_system: v1\nacademic_role: practical\nlearning_guide: canonical\ntoc: true"
  )
  out = out.sub(
    "# External Morphology and Dissection\n\n",
    "# External Morphology and Dissection\n\n#{CTA}\n\n"
  )
  out
end

comparison_base = ENV["PR_BASE_SHA"].to_s.strip
comparison_base = BASE if comparison_base.empty?
state_text = PATHS[:state].file? ? read_utf8(PATHS[:state]) : ""
phase = top_level_scalar(state_text, "phase")
bootstrap = comparison_base == BASE
future = comparison_base != BASE
need(errors, phase == PHASE, "R61 bootstrap phase must be exactly #{PHASE}") if bootstrap
current_order = phase_order(phase)
r61_order = phase_order(PHASE)
maintenance = future && current_order && r61_order &&
  current_order[0,2] == r61_order[0,2] &&
  current_order[2].between?(62,69)

changed = []
stdout, stderr, status = git("diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
else
  errors << "Unable to inspect R61 changed-file scope: #{stderr.strip}"
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
    successor_authorized = bo && co && r61_order && (co <=> bo) > 0 && (co <=> r61_order) > 0 &&
      top_level_scalar(state_text, "authorized_base") == comparison_base
    successor_allowlist = top_level_list(state_text, "learner_mutation_allowlist")
  else
    errors << "Unable to authenticate R61 successor base state"
  end
end

[
  SOURCE_REL, MANIFEST_REL, LEDGER_REL, STATE_REL, AUTH_REL, IMPL_REL,
  COURSE_REL, COVERAGE_REL, BROWSER_REL, WORKFLOW_REL, PROD_WORKFLOW_REL, VALIDATOR_REL,
  SHARED_CSS_REL, SHARED_JS_REL, ACADEMIC_CSS_REL, CTA_INCLUDE_REL
].each do |relative|
  errors << "Missing R61 artifact: #{relative}" unless ROOT.join(relative).file?
end

BASE_BLOBS.each do |relative, expected|
  blob, _, st = git("rev-parse", "#{BASE}:#{relative}")
  need(errors, st.success? && blob.strip == expected, "R61 authenticated base blob mismatch: #{relative}")
  next if relative == SOURCE_REL || !bootstrap
  baseline, _, show_status = git("show", "#{BASE}:#{relative}")
  need(errors, show_status.success? && read_utf8(ROOT.join(relative)) == baseline,
       "R61 changed protected baseline: #{relative}")
end

if PATHS[:source].file?
  baseline, _, st = git("show", "#{BASE}:#{SOURCE_REL}")
  if st.success?
    src = read_utf8(PATHS[:source])
    if bootstrap
      need(errors, src == authorized_transform(baseline),
           "Dissection source differs from exact authorized metadata/CTA transform")
    elsif future && changed.include?(SOURCE_REL)
      need(errors, successor_authorized, "Successor changed prac-04 without advanced exact-base authority")
      need(errors, successor_allowlist.include?(SOURCE_REL), "Successor changed prac-04 without learner allowlist authority")
    end

    need(errors, fm_value(src, "permalink") == "/biology/higher-zoology-tree/practical/dissection/", "R61 permalink drift")
    need(errors, fm_value(src, "course_id") == "zoology-practical-213106", "R61 course_id drift")
    need(errors, fm_value(src, "page_id") == "zoology-practical-dissection", "R61 page_id drift")
    need(errors, fm_value(src, "academic_system") == "v1", "R61 academic_system missing")
    need(errors, fm_value(src, "academic_role") == "practical", "R61 academic_role missing")
    need(errors, fm_value(src, "learning_guide") == "canonical", "R61 learning_guide missing")
    need(errors, src.scan(CTA).length == 1, "R61 canonical Learning Guide CTA count must be 1")

    need(errors, src.scan(/^# /).length == 6, "R61 H1 hierarchy drift")
    need(errors, src.scan(/^## /).length == 22, "R61 H2 hierarchy drift")
    need(errors, src.scan(/^### /).length == 29, "R61 H3 hierarchy drift")
    need(errors, src.scan(/^\|.*\|$/).empty?, "R61 unexpectedly introduced Markdown table content")

    general = src[/## General Dissection Rules\n(.*?)(?=\n---)/m,1].to_s
    need(errors, general.scan(/^\d+\. /).length == 7, "R61 General Dissection Rules must remain 7")

    ext = src[/# A\. External Morphology\n(.*?)(?=\n---\n\n# B\. Major Dissections)/m,1].to_s
    need(errors, ext.scan(/^## /).length == 5, "R61 external morphology taxa must remain 5")

    major = src[/# B\. Major Dissections\n(.*?)(?=\n---\n\n# C\. Minor Dissections)/m,1].to_s
    need(errors, major.scan(/^## \d+\./).length == 11, "R61 major dissection count must remain 11")

    minor = src[/# C\. Minor Dissections\n(.*?)(?=\n---\n\n# Dissection Drawing Template)/m,1].to_s
    digestive = minor.scan(/^## (?:12|13|14)\./).length
    nervous = minor.scan(/^## 15–17\./).length == 1 ? 3 : 0
    need(errors, digestive + nervous == 6, "R61 minor dissection count must remain 6")

    drawing = src[/# Dissection Drawing Template\n(.*?)(?=\n# Practical Viva Questions)/m,1].to_s
    need(errors, drawing.scan(/^- /).length == 7, "R61 drawing rule count must remain 7")

    viva = src[/# Practical Viva Questions\n(.*)\z/m,1].to_s
    need(errors, viva.scan(/^\d+\. /).length == 6, "R61 viva question count must remain 6")

    protected = [
      "Circulatory system — **earthworm, prawn**",
      "Nervous system — **cockroach, grasshopper, prawn, Pila, Lamellidens**",
      "Reproductive system — **earthworm, cockroach, grasshopper, prawn**",
      "Digestive system — **prawn, Pila, Lamellidens**",
      "Specimen আগে external orientation নিশ্চিত করো।",
      "Cut line shallow রাখবে; internal organs blind-cut করবে না।",
      "Wet specimen শুকাতে দেবে না।",
      "Dorsal vessel-কে gut wall-এর pigmented line ধরে নেওয়া; vessel continuity verify করবে।",
      "Connective vs commissure গুলিয়ে ফেলা: same-side ganglia linking = connective; paired opposite ganglia linking = commissure.",
      "Note: bivalves lack a radula.",
      "no artistic shading;",
      "Male vs female cockroach reproductive system-এর fastest visible distinction কী?"
    ]
    protected.each { |token| need(errors, src.include?(token), "R61 protected Dissection corpus missing: #{token}") }
  else
    errors << "Unable to read R61 baseline source"
  end
end

if PATHS[:ledger].file?
  ledger = JSON.parse(read_utf8(PATHS[:ledger]))
  expected_row = {
    "id" => "higher-zoology-practical-dissection",
    "canonical_route" => "/biology/higher-zoology-tree/practical/dissection/",
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
  rows = Array(ledger["routes"]).select { |r| r["id"] == expected_row["id"] }
  need(errors, rows.length == 1, "R61 Dissection route ledger row count must be 1")
  expected_row.each { |k,v| need(errors, rows.first && rows.first[k] == v, "R61 ledger mismatch for #{k}") }

  if bootstrap
    base_ledger_text, _, ledger_status = git("show", "#{BASE}:#{LEDGER_REL}")
    if ledger_status.success?
      base_ledger = JSON.parse(base_ledger_text)
      expected_ledger = JSON.parse(JSON.generate(base_ledger))
      routes = Array(expected_ledger["routes"])
      anchor = routes.index { |r| r["id"] == "higher-zoology-practical-whole-mounts" }
      if anchor
        routes.insert(anchor + 1, expected_row)
        need(errors, ledger == expected_ledger,
             "R61 ledger must equal the authenticated base plus exactly one Dissection row")
      else
        errors << "R61 base ledger missing Whole Mounts insertion anchor"
      end
    else
      errors << "Unable to authenticate R61 base route ledger"
    end
  end
end

if PATHS[:course].file?
  course = JSON.parse(read_utf8(PATHS[:course]))
  pathway = Array(course["pathways"]).find { |p| p["course_id"] == "nu-zoology-practical-213106" }
  modules = pathway ? Array(pathway["modules"]) : []
  mod = modules.find { |m| m["module_id"] == "prac-04" || m["source_file"] == SOURCE_REL }
  need(errors, !mod.nil?, "R61 prac-04 course-contract entry missing")
  if mod
    need(errors, mod["order"] == 4, "R61 course order drift")
    need(errors, mod["source_file"] == SOURCE_REL, "R61 course source drift")
    need(errors, mod["route"] == "/biology/higher-zoology-tree/practical/dissection/", "R61 course route drift")
    need(errors, mod["previous"] == "prac-03", "R61 previous-module drift")
    need(errors, mod["next"] == "prac-05", "R61 next-module drift")
  end
end

if PATHS[:coverage].file?
  coverage = JSON.parse(read_utf8(PATHS[:coverage]))
  mod = Array(coverage["modules"]).find { |m| m["id"] == "04" }
  need(errors, !mod.nil?, "R61 coverage prac-04 missing")
  if mod
    need(errors, mod["status"] == "complete-syllabus-map", "R61 coverage status drift")
    need(errors, mod["coverage"] == "all listed major/minor systems + external morphology", "R61 coverage corpus drift")
  end
end

if PATHS[:manifest].file?
  manifest = JSON.parse(read_utf8(PATHS[:manifest]))
  need(errors, manifest["authorized_base"] == BASE, "R61 manifest authorized base mismatch")
  need(errors, manifest["module_id"] == "prac-04", "R61 manifest module mismatch")
  need(errors, manifest["baseline_blob_sha"] == BASE_BLOBS[SOURCE_REL], "R61 manifest baseline blob mismatch")
  census = manifest["content_census"] || {}
  {
    "h1"=>6,"h2"=>22,"h3"=>29,"general_dissection_rules"=>7,"external_morphology_taxa"=>5,
    "major_dissections"=>11,"minor_dissections"=>6,"drawing_rules"=>7,"viva_questions"=>6
  }.each { |k,v| need(errors, census[k] == v, "R61 manifest census mismatch: #{k}") }
  need(errors, manifest.dig("mutation","learner_source_count") == 1, "R61 manifest learner mutation count mismatch")
  need(errors, manifest.dig("mutation","strict_route_rows_added") == 1, "R61 manifest route mutation mismatch")
  need(errors, manifest.dig("mutation","table_wrapper_count") == 0, "R61 table wrapper must remain unauthorized")
  need(errors, manifest.dig("preservation","heading_normalization") == false, "R61 heading normalization must remain false")
end

if PATHS[:state].file?
  if bootstrap
    need(errors, phase == PHASE, "R61 state phase mismatch")
    need(errors, top_level_scalar(state_text, "authorized_base") == BASE, "R61 state base mismatch")
    need(errors, top_level_list(state_text, "learner_mutation_allowlist") == [SOURCE_REL], "R61 exact learner allowlist missing")
  elsif future
    need(errors, current_order && r61_order && (current_order <=> r61_order) >= 0, "R61 successor state regressed")
    need(errors, successor_authorized || j_governance_only, "R61 successor state must advance and bind exact current base") if changed.include?(STATE_REL)
  end
end

if bootstrap
  need(errors, changed == CHANGED_FILES, "R61 changed-file scope mismatch: #{changed}")
elsif future
  protected_artifacts = [VALIDATOR_REL, MANIFEST_REL, AUTH_REL, IMPL_REL, BROWSER_REL, WORKFLOW_REL, PROD_WORKFLOW_REL]
  touched = changed & protected_artifacts
  if maintenance
    need(errors, successor_authorized, "R61 maintenance requires advanced exact-base authority")
  else
    need(errors, touched.empty?, "Successor changed protected R61 artifacts: #{touched.join(', ')}")
  end
end

if errors.empty?
  puts "CONV-04F-09-R61 Dissection preservation/scope: PASS"
else
  warn "CONV-04F-09-R61 Dissection preservation/scope: FAIL"
  errors.each { |e| warn "- #{e}" }
  exit 1
end
