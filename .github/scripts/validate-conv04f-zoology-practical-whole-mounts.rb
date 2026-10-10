#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "ee9608a739e33ef01b0f5776c3e8827c7ea8dd12"
PHASE = "CONV-04F-09-R51"
SOURCE_REL = "_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md"
SOURCE = ROOT.join(SOURCE_REL)
MANIFEST_REL = "_data/academic/conv04f_zoology_practical_whole_mounts_v1.json"
MANIFEST = ROOT.join(MANIFEST_REL)
LEDGER_REL = "docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json"
LEDGER = ROOT.join(LEDGER_REL)
STATE_REL = "docs/academic/conv04/CONV04_STATE.md"
STATE = ROOT.join(STATE_REL)
AUTH_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_WHOLE_MOUNTS_F09_R50_AUTHORIZATION.md"
AUTH = ROOT.join(AUTH_REL)
IMPL_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_WHOLE_MOUNTS_F09_R51_IMPLEMENTATION.md"
IMPL = ROOT.join(IMPL_REL)
COURSE_REL = "_data/academic/course_contract_v1.json"
COURSE = ROOT.join(COURSE_REL)
COVERAGE_REL = "_data/zoology-practical-213106-coverage.json"
COVERAGE = ROOT.join(COVERAGE_REL)
SHARED_CSS_REL = "assets/css/zoology-practical.css"
SHARED_JS_REL = "assets/js/zoology-practical.js"
ACADEMIC_CSS_REL = "assets/css/academic-design-system.css"
CTA_INCLUDE_REL = "_includes/education/learning-guide-cta.html"
BROWSER_REL = ".github/scripts/conv04f-zoology-practical-whole-mounts-browser-certification.mjs"
WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-whole-mounts-certification.yml"
PROD_WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-whole-mounts-production-parity.yml"
VALIDATOR_REL = ".github/scripts/validate-conv04f-zoology-practical-whole-mounts.rb"
CTA = "{% include education/learning-guide-cta.html %}"

BASE_BLOBS = {
  "_biology/higher-zoology-tree/practical/index.bn.md" => "d45ae49889c5e6d02445776ca5120f5fcedda65e",
  "_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md" => "bf14db772daaa5bbf1d7386d7f146b7d9a730799",
  "_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md" => "0594b755e3cf2301de48e04e60324be3a404531a",
  SOURCE_REL => "904933f7b29a301f72b7d370582d605364b906e6",
  "_biology/higher-zoology-tree/practical/04-dissection.bn.md" => "0bca70d74c04305fd2399f54fbb5c650f0b158c3",
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

def authorized_transform(source)
  out = source.dup
  out = out.sub(
    "locale: bn-BD\ntoc: true",
    "locale: bn-BD\nacademic_system: v1\nacademic_role: practical\nlearning_guide: canonical\ntoc: true"
  )
  out = out.sub(
    "# Preparation and Study of Whole Mounts\n\n",
    "# Preparation and Study of Whole Mounts\n\n#{CTA}\n\n"
  )
  table_re = /(^\| Preparation \| Main labels \|\n^\|---\|---\|\n(?:^\|.*\|\n){10})/m
  matched = out.match(table_re)
  raise "R51 expected one 10-row baseline Markdown table" unless matched
  table = matched[1].rstrip
  wrapper = "<div class=\"lbfl-academic-table-wrap zoology-practical-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"Whole Mounts suggested preparations table\" markdown=\"1\">\n\n#{table}\n\n</div>\n"
  out.sub(table_re, wrapper)
end

comparison_base = ENV["PR_BASE_SHA"].to_s.strip
comparison_base = BASE if comparison_base.empty?
state_text = STATE.file? ? read_utf8(STATE) : ""
phase = top_level_scalar(state_text, "phase")
bootstrap = comparison_base == BASE && phase == PHASE
future = comparison_base != BASE
current_order = phase_order(phase)
r51_order = phase_order(PHASE)
maintenance = future && current_order && r51_order &&
  current_order[0,2] == r51_order[0,2] &&
  current_order[2].between?(52,59)

changed = []
stdout, stderr, status = git("diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
else
  errors << "Unable to inspect R51 changed-file scope: #{stderr.strip}"
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
if future && STATE.file? && changed.include?(STATE_REL)
  base_state, _, bs = git("show", "#{comparison_base}:#{STATE_REL}")
  if bs.success?
    base_phase = top_level_scalar(base_state, "phase")
    bo = phase_order(base_phase)
    co = phase_order(phase)
    successor_authorized = bo && co && r51_order && (co <=> bo) > 0 && (co <=> r51_order) > 0 &&
      top_level_scalar(state_text, "authorized_base") == comparison_base
    successor_allowlist = top_level_list(state_text, "learner_mutation_allowlist")
  else
    errors << "Unable to authenticate R51 successor base state"
  end
end

[SOURCE, MANIFEST, LEDGER, STATE, AUTH, IMPL, COURSE, COVERAGE,
 ROOT.join(SHARED_CSS_REL), ROOT.join(SHARED_JS_REL), ROOT.join(ACADEMIC_CSS_REL),
 ROOT.join(CTA_INCLUDE_REL), ROOT.join(BROWSER_REL), ROOT.join(WORKFLOW_REL),
 ROOT.join(PROD_WORKFLOW_REL), ROOT.join(VALIDATOR_REL)].each do |path|
  errors << "Missing R51 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

BASE_BLOBS.each do |relative, expected|
  blob, _, st = git("rev-parse", "#{BASE}:#{relative}")
  need(errors, st.success? && blob.strip == expected, "R51 authenticated base blob mismatch: #{relative}")
  next if relative == SOURCE_REL || !bootstrap
  baseline, _, show_status = git("show", "#{BASE}:#{relative}")
  need(errors, show_status.success? && read_utf8(ROOT.join(relative)) == baseline,
       "R51 changed protected baseline: #{relative}")
end

if SOURCE.file?
  baseline, _, st = git("show", "#{BASE}:#{SOURCE_REL}")
  if st.success?
    src = read_utf8(SOURCE)
    if bootstrap
      need(errors, src == authorized_transform(baseline),
           "Whole Mounts source differs from exact authorized structural transform")
    elsif future && changed.include?(SOURCE_REL)
      need(errors, successor_authorized, "Successor changed prac-03 without advanced exact-base authority")
      need(errors, successor_allowlist.include?(SOURCE_REL), "Successor changed prac-03 without learner allowlist authority")
    end

    need(errors, fm_value(src, "permalink") == "/biology/higher-zoology-tree/practical/whole-mounts/", "R51 permalink drift")
    need(errors, fm_value(src, "course_id") == "zoology-practical-213106", "R51 course_id drift")
    need(errors, fm_value(src, "page_id") == "zoology-practical-whole-mounts", "R51 page_id drift")
    need(errors, fm_value(src, "academic_system") == "v1", "R51 academic_system missing")
    need(errors, fm_value(src, "academic_role") == "practical", "R51 academic_role missing")
    need(errors, fm_value(src, "learning_guide") == "canonical", "R51 learning_guide missing")
    need(errors, src.scan(CTA).length == 1, "R51 canonical Learning Guide CTA count must be 1")
    need(errors, src.scan(/^# Preparation and Study of Whole Mounts\s*$/).length == 1, "R51 H1 drift")
    need(errors, src.scan(/^## /).length == 6, "R51 H2 count drift")
    need(errors, src.scan(/^### Safety note\s*$/).length == 1, "R51 Safety note heading drift")
    need(errors, src.scan(/class="lbfl-academic-table-wrap zoology-practical-table-scroll"/).length == 1, "R51 table wrapper count must be 1")
    need(errors, src.include?('aria-label="Whole Mounts suggested preparations table"'), "R51 table accessible name missing")

    protected = [
      "Whole mount-এর উদ্দেশ্য হলো ছোট specimen/organ-কে section না কেটে সম্পূর্ণ অবস্থায় এমনভাবে mount করা যাতে overall organization দেখা যায়।",
      "Hydra whole mount | tentacles, hypostome, basal disc, bud",
      "Planarian whole mount | auricles, eyespots, pharynx region",
      "Rotifer whole mount | corona, mastax, trunk, foot",
      "*Daphnia* whole mount | carapace, antennae, eye, brood chamber",
      "*Cyclops* whole mount | antennules, median eye, thorax, abdomen, egg sacs",
      "Mosquito larva | head, thorax, abdomen, siphon (species dependent)",
      "Mosquito pupa | cephalothorax, respiratory trumpets, abdomen, paddles",
      "Cockroach mouthparts | individual parts in correct orientation",
      "Prawn appendage | basal protopod + rami/segments as applicable",
      "Nematode small specimen | anterior/posterior and sex-specific structures",
      "Fix according to departmental SOP",
      "Label + observe + draw",
      "Permanent preparation-এর exact fixative, stain, dehydration, clearing agent ও mounting resin **departmental SOP** অনুযায়ী নির্বাচন করতে হবে।",
      "Ethanol, formalin/formaldehyde, xylene/clearing agents এবং permanent mountants-এর hazard profile আলাদা।",
      "Local laboratory SOP, ventilation/fume hood, PPE এবং approved waste stream ছাড়া protocol পরিবর্তন করবে না।"
    ]
    protected.each { |token| need(errors, src.include?(token), "R51 protected learner corpus missing: #{token}") }

    table = src.match(/\| Preparation \| Main labels \|\n\|---\|---\|\n((?:\|.*\|\n){10})/)
    need(errors, !table.nil?, "R51 10-row suggested preparation table missing")

    core = src[/## Core Workflow\n\n```text\n(.*?)\n```/m,1].to_s
    need(errors, core.scan(/↓/).length == 8, "R51 Core Workflow must retain 9 stages")

    permanent = src[/## Permanent Whole Mount\n(.*?)(?=\n### Safety note)/m,1].to_s
    need(errors, permanent.scan(/^\d+\. /).length == 6, "R51 Permanent Whole Mount logic must retain 6 steps")

    qc = src[/## Quality-control Checklist\n(.*?)(?=\n## Drawing Rule)/m,1].to_s
    need(errors, qc.scan(/^- /).length == 8, "R51 QC checklist must retain 8 checks")

    drawing = src[/## Drawing Rule\n(.*)\z/m,1].to_s
    need(errors, drawing.scan(/^- /).length == 5, "R51 Drawing Rule must retain 5 rules")
  else
    errors << "Unable to read R51 baseline source"
  end
end

if LEDGER.file?
  ledger = JSON.parse(read_utf8(LEDGER))
  rows = Array(ledger["routes"]).select { |r| r["id"] == "higher-zoology-practical-whole-mounts" }
  need(errors, rows.length == 1, "R51 Whole Mounts route ledger row count must be 1")
  if rows.length == 1
    row = rows.first
    expected = {
      "canonical_route" => "/biology/higher-zoology-tree/practical/whole-mounts/",
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
    expected.each { |k,v| need(errors, row[k] == v, "R51 ledger mismatch for #{k}") }
  end
end

if COURSE.file?
  course = JSON.parse(read_utf8(COURSE))
  pathway = Array(course["pathways"]).find { |p| p["course_id"] == "nu-zoology-practical-213106" }
  modules = pathway ? Array(pathway["modules"]) : []
  mod = modules.find { |m| m["id"] == "prac-03" || m["module_id"] == "prac-03" || m["source_file"] == SOURCE_REL }
  need(errors, !mod.nil?, "R51 prac-03 course-contract entry missing")
  if mod
    need(errors, mod["source_file"] == SOURCE_REL, "R51 course source drift")
    need(errors, mod["route"] == "/biology/higher-zoology-tree/practical/whole-mounts/", "R51 course route drift")
  end
end

if COVERAGE.file?
  coverage = JSON.parse(read_utf8(COVERAGE))
  mod = Array(coverage["modules"]).find { |m| m["id"] == "03" }
  need(errors, !mod.nil?, "R51 coverage prac-03 missing")
  if mod
    need(errors, mod["status"] == "complete-core-protocol", "R51 coverage status drift")
    need(errors, mod["coverage"] == "general preparation + 10 suggested whole mounts", "R51 coverage corpus drift")
  end
end

if MANIFEST.file?
  manifest = JSON.parse(read_utf8(MANIFEST))
  need(errors, manifest["authorized_base"] == BASE, "R51 manifest authorized base mismatch")
  need(errors, manifest["module_id"] == "prac-03", "R51 manifest module mismatch")
  need(errors, manifest["baseline_blob_sha"] == BASE_BLOBS[SOURCE_REL], "R51 manifest baseline blob mismatch")
  need(errors, manifest.dig("content_census","suggested_preparations") == 10, "R51 manifest preparation count mismatch")
  need(errors, manifest.dig("content_census","core_workflow_stages") == 9, "R51 manifest workflow count mismatch")
  need(errors, manifest.dig("content_census","permanent_logic_steps") == 6, "R51 manifest permanent logic count mismatch")
  need(errors, manifest.dig("content_census","quality_control_checks") == 8, "R51 manifest QC count mismatch")
  need(errors, manifest.dig("content_census","drawing_rules") == 5, "R51 manifest drawing count mismatch")
  need(errors, manifest.dig("mutation","learner_source_count") == 1, "R51 manifest learner mutation count mismatch")
  need(errors, manifest.dig("mutation","strict_route_rows_added") == 1, "R51 manifest ledger mutation mismatch")
end

if STATE.file?
  if bootstrap
    need(errors, phase == PHASE, "R51 state phase mismatch")
    need(errors, top_level_scalar(state_text, "authorized_base") == BASE, "R51 state base mismatch")
    need(errors, top_level_list(state_text, "learner_mutation_allowlist") == [SOURCE_REL], "R51 exact learner allowlist missing")
  elsif future
    need(errors, current_order && r51_order && (current_order <=> r51_order) >= 0, "R51 successor state regressed")
    need(errors, successor_authorized || j_governance_only, "R51 successor state must advance and bind exact current base") if changed.include?(STATE_REL)
  end
end

if bootstrap
  need(errors, changed == CHANGED_FILES, "R51 changed-file scope mismatch: #{changed}")
elsif future
  protected_artifacts = [VALIDATOR_REL, MANIFEST_REL, AUTH_REL, IMPL_REL, BROWSER_REL, WORKFLOW_REL, PROD_WORKFLOW_REL]
  touched = changed & protected_artifacts
  if maintenance
    need(errors, successor_authorized, "R51 maintenance requires advanced exact-base authority")
  else
    migration_scope_exact = comparison_base == "81950a9f4602f1d9be34f2d53d4585831926bffa" && changed.sort == [".github/scripts/validate-conv04f-zoology-practical-museum.rb", ".github/scripts/validate-conv04f-zoology-practical-whole-mounts.rb", ".github/scripts/validate-conv04f-zoology-practical-field-report.rb", ".github/scripts/validate-conv04f-zoology-practical-temporary-mounts.rb", ".github/scripts/validate-conv04f-zoology-practical-permanent-slides.rb", ".github/scripts/validate-conv04f-zoology-practical-appendages.rb", ".github/scripts/validate-conv04f-zoology-practical-dissection.rb"].sort
    # Only the exact-seven-script migration may pass this legacy self-protection predicate.
    # Other learner/source/contract/asset protections remain in force.
    need(errors, touched.empty? || migration_scope_exact, "Successor changed protected R51 artifacts: #{touched.join(', ')}")
  end
end

if errors.empty?
  puts "CONV-04F-09-R51 Whole Mounts preservation/scope: PASS"
else
  warn "CONV-04F-09-R51 Whole Mounts preservation/scope: FAIL"
  errors.each { |e| warn "- #{e}" }
  exit 1
end
