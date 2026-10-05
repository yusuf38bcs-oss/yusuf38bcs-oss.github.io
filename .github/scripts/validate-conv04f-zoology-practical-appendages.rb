#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "bbe90f4454ac25982f60b531f47e887ebe51c096"
PHASE = "CONV-04F-09-R81"
SOURCE_REL = "_biology/higher-zoology-tree/practical/06-appendages.bn.md"
MANIFEST_REL = "_data/academic/conv04f_zoology_practical_appendages_v1.json"
LEDGER_REL = "docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json"
STATE_REL = "docs/academic/conv04/CONV04_STATE.md"
AUTH_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_APPENDAGES_F09_R80_AUTHORIZATION.md"
IMPL_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_APPENDAGES_F09_R81_IMPLEMENTATION.md"
COURSE_REL = "_data/academic/course_contract_v1.json"
COVERAGE_REL = "_data/zoology-practical-213106-coverage.json"
SHARED_CSS_REL = "assets/css/zoology-practical.css"
SHARED_JS_REL = "assets/js/zoology-practical.js"
ACADEMIC_CSS_REL = "assets/css/academic-design-system.css"
CTA_INCLUDE_REL = "_includes/education/learning-guide-cta.html"
BROWSER_REL = ".github/scripts/conv04f-zoology-practical-appendages-browser-certification.mjs"
WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-appendages-certification.yml"
PROD_WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-appendages-production-parity.yml"
VALIDATOR_REL = ".github/scripts/validate-conv04f-zoology-practical-appendages.rb"
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
  "_biology/higher-zoology-tree/practical/04-dissection.bn.md" => "13b112f04ebf484d74cbca8e98fd39ab70430e3c",
  "_biology/higher-zoology-tree/practical/05-temporary-mounts.bn.md" => "c91e0bbbd8b10f5503aef0aa262864523949c97a",
  SOURCE_REL => "36e36c4dd8cfffb99f1669033b4a21bc0e45d939",
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

def markdown_table_blocks(source)
  tables = []
  current = []
  source.lines.each do |line|
    if line.start_with?("|")
      current << line
    elsif !current.empty?
      tables << current.join
      current = []
    end
  end
  tables << current.join unless current.empty?
  tables
end

def stripped_authorized_transform(source)
  out = source.dup
  out.sub!(/^academic_system:\s*v1\n/, "")
  out.sub!(/^academic_role:\s*practical\n/, "")
  out.sub!(/^learning_guide:\s*canonical\n/, "")
  out.sub!("#{CTA}\n\n", "")
  out.gsub!(
    /^<div class="lbfl-academic-table-wrap zoology-practical-table-scroll" tabindex="0" role="region" aria-label="(?:Cockroach mouth parts table|Prawn appendages table)" markdown="1">\n\n/,
    ""
  )
  out.gsub!(/\n\n<\/div>\n\n/, "\n\n")
  out
end

comparison_base = ENV["PR_BASE_SHA"].to_s.strip
comparison_base = BASE if comparison_base.empty?
state_text = PATHS[:state].file? ? read_utf8(PATHS[:state]) : ""
phase = top_level_scalar(state_text, "phase")
bootstrap = comparison_base == BASE
future = comparison_base != BASE
need(errors, phase == PHASE, "R81 bootstrap phase must be exactly #{PHASE}") if bootstrap

current_order = phase_order(phase)
r81_order = phase_order(PHASE)
maintenance = future && current_order && r81_order &&
  current_order[0,2] == r81_order[0,2] &&
  current_order[2].between?(82,89)

changed = []
stdout, stderr, status = git("diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
else
  errors << "Unable to inspect R81 changed-file scope: #{stderr.strip}"
end

successor_authorized = false
successor_allowlist = []
if future && PATHS[:state].file? && changed.include?(STATE_REL)
  base_state, _, bs = git("show", "#{comparison_base}:#{STATE_REL}")
  if bs.success?
    base_phase = top_level_scalar(base_state, "phase")
    bo = phase_order(base_phase)
    co = phase_order(phase)
    successor_authorized = bo && co && r81_order && (co <=> bo) > 0 && (co <=> r81_order) > 0 &&
      top_level_scalar(state_text, "authorized_base") == comparison_base
    successor_allowlist = top_level_list(state_text, "learner_mutation_allowlist")
  else
    errors << "Unable to authenticate R81 successor base state"
  end
end

[
  SOURCE_REL, MANIFEST_REL, LEDGER_REL, STATE_REL, AUTH_REL, IMPL_REL,
  COURSE_REL, COVERAGE_REL, BROWSER_REL, WORKFLOW_REL, PROD_WORKFLOW_REL, VALIDATOR_REL,
  SHARED_CSS_REL, SHARED_JS_REL, ACADEMIC_CSS_REL, CTA_INCLUDE_REL
].each do |relative|
  errors << "Missing R81 artifact: #{relative}" unless ROOT.join(relative).file?
end

BASE_BLOBS.each do |relative, expected|
  blob, _, st = git("rev-parse", "#{BASE}:#{relative}")
  need(errors, st.success? && blob.strip == expected, "R81 authenticated base blob mismatch: #{relative}")
  next if relative == SOURCE_REL || !bootstrap
  baseline, _, show_status = git("show", "#{BASE}:#{relative}")
  need(errors, show_status.success? && read_utf8(ROOT.join(relative)) == baseline,
       "R81 changed protected baseline: #{relative}")
end

if PATHS[:source].file?
  baseline, _, st = git("show", "#{BASE}:#{SOURCE_REL}")
  if st.success?
    src = read_utf8(PATHS[:source])

    cta_anchor = "# Study of Appendages — Cockroach and Prawn\n\n#{CTA}\n\nAssessment emphasis:"
    need(errors, src.include?(cta_anchor),
         "R81 canonical Learning Guide CTA must immediately follow the existing H1")

    baseline_tables = markdown_table_blocks(baseline)
    need(errors, baseline_tables.length == 2, "R81 authenticated baseline must contain exactly two Markdown tables")
    if baseline_tables.length == 2
      wrapper_specs = [
        ["Cockroach mouth parts table", baseline_tables[0]],
        ["Prawn appendages table", baseline_tables[1]]
      ]
      wrapper_specs.each do |label, table|
        open = %(<div class="lbfl-academic-table-wrap zoology-practical-table-scroll" tabindex="0" role="region" aria-label="#{label}" markdown="1">)
        exact = "#{open}\n\n#{table}\n</div>"
        need(errors, src.include?(exact),
             "R81 #{label} wrapper must directly enclose its authenticated Markdown table")
      end
    end

    if bootstrap
      need(errors, stripped_authorized_transform(src) == baseline,
           "Appendages source differs from exact R80 baseline plus only authorized metadata/CTA/table wrappers")
    elsif future && changed.include?(SOURCE_REL)
      need(errors, successor_authorized, "Successor changed prac-06 without advanced exact-base authority")
      need(errors, successor_allowlist.include?(SOURCE_REL), "Successor changed prac-06 without learner allowlist authority")
    end

    need(errors, fm_value(src, "permalink") == "/biology/higher-zoology-tree/practical/appendages/", "R81 permalink drift")
    need(errors, fm_value(src, "course_id") == "zoology-practical-213106", "R81 course_id drift")
    need(errors, fm_value(src, "page_id") == "zoology-practical-appendages", "R81 page_id drift")
    need(errors, fm_value(src, "academic_system") == "v1", "R81 academic_system missing")
    need(errors, fm_value(src, "academic_role") == "practical", "R81 academic_role missing")
    need(errors, fm_value(src, "learning_guide") == "canonical", "R81 learning_guide missing")
    need(errors, src.scan(CTA).length == 1, "R81 canonical Learning Guide CTA count must be 1")

    need(errors, src.scan(/^# /).length == 1, "R81 H1 hierarchy drift")
    need(errors, src.scan(/^## /).length == 5, "R81 H2 hierarchy drift")
    need(errors, src.scan(/^### /).length == 6, "R81 H3 hierarchy drift")
    need(errors, src.scan(/^\|.*\|$/).length == 19, "R81 Markdown table-line census must remain 19")
    need(errors, src.scan(/^\d+\. /).length == 6, "R81 placement-rule census must remain 6")
    need(errors, src.scan(/^- /).length == 10, "R81 total body bullet census must remain 10")

    wrapper_open = /^<div class="lbfl-academic-table-wrap zoology-practical-table-scroll" tabindex="0" role="region" aria-label="([^"]+)" markdown="1">$/
    labels = src.lines.filter_map { |line| (m = wrapper_open.match(line.strip)) && m[1] }
    need(errors, labels == ["Cockroach mouth parts table", "Prawn appendages table"],
         "R81 table wrappers must be exactly two named keyboard-focusable regions")
    need(errors, src.lines.count { |line| line.strip == "</div>" } == 2, "R81 table wrapper closing count must be 2")

    protected = [
      "Assessment emphasis: **detachment + correct placement + course-sheet drawing + labelling + displaying**.",
      "**Type:** biting and chewing.",
      "**coxa → trochanter → femur → tibia → tarsus → pretarsal claws/arolium**.",
      "Hind legs are not saltatorial like grasshopper; cockroach legs are cursorial/running type.",
      "Antennae are primarily sensory, not true prehensile organs.",
      "Paired posterior cerci air-current/vibration sense করে rapid escape response trigger করতে সাহায্য করে।",
      "Male terminal genital structures/phallomeres copulation-এ ব্যবহৃত; female ovipositor-like gonapophyses reproductive passage/egg-case handling-এ অংশ নেয়।",
      "**protopod (coxa + basis) + endopod + exopod**",
      "| Antennule | equilibrium + sensory | basal statocyst; biramous flagella |",
      "| Chelipeds | prehensile / offensive-defensive | claw-forming pereiopods |",
      "| Uropods | rapid swimming / steering | paired tail-fan elements with telson |",
      "- **Locomotory:** cockroach legs; prawn pereiopods, pleopods, uropods.",
      "- **Prehensile:** prawn chelipeds; cockroach mouth appendages hold/manipulate food but “prehensile” should not be forced onto antenna.",
      "- **Food capture:** cockroach mandibles/maxillae; prawn maxillipeds/chelipeds.",
      "- **Copulatory:** male genital appendages; modified prawn pleopods depending on sex/species.",
      "- **Defensive/offensive:** cockroach rapid locomotor/cerci-mediated escape + mandibles; prawn chelae, rostrum and tail-flip apparatus.",
      "- correct appendage detached?",
      "- intact proximal and distal ends?",
      "- proper sequence?",
      "- drawing proportional?",
      "- labels readable?"
    ]
    protected.each { |text| need(errors, src.include?(text), "R81 protected Appendages corpus drift: #{text}") }
  else
    errors << "Unable to read R81 Appendages baseline from authenticated base"
  end
end

if PATHS[:ledger].file?
  ledger = JSON.parse(read_utf8(PATHS[:ledger]))
  expected_row = {
    "id" => "higher-zoology-practical-appendages",
    "canonical_route" => "/biology/higher-zoology-tree/practical/appendages/",
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
  need(errors, rows.length == 1, "R81 Appendages route ledger row count must be 1")
  expected_row.each { |k,v| need(errors, rows.first && rows.first[k] == v, "R81 ledger mismatch for #{k}") }

  if bootstrap
    base_ledger_text, _, ledger_status = git("show", "#{BASE}:#{LEDGER_REL}")
    if ledger_status.success?
      base_ledger = JSON.parse(base_ledger_text)
      expected_ledger = JSON.parse(JSON.generate(base_ledger))
      routes = Array(expected_ledger["routes"])
      anchor = routes.index { |r| r["id"] == "higher-zoology-practical-temporary-mounts" }
      if anchor
        routes.insert(anchor + 1, expected_row)
        need(errors, ledger == expected_ledger,
             "R81 ledger must equal authenticated R80 base plus exactly one Appendages row")
      else
        errors << "R81 base ledger missing Temporary Mounts insertion anchor"
      end
    else
      errors << "Unable to authenticate R81 base route ledger"
    end
  end
end

if PATHS[:course].file?
  course = JSON.parse(read_utf8(PATHS[:course]))
  pathway = Array(course["pathways"]).find { |p| p["course_id"] == "nu-zoology-practical-213106" }
  modules = pathway ? Array(pathway["modules"]) : []
  mod = modules.find { |m| m["module_id"] == "prac-06" || m["source_file"] == SOURCE_REL }
  need(errors, !mod.nil?, "R81 prac-06 course-contract entry missing")
  if mod
    need(errors, mod["order"] == 6, "R81 course order drift")
    need(errors, mod["source_file"] == SOURCE_REL, "R81 course source drift")
    need(errors, mod["route"] == "/biology/higher-zoology-tree/practical/appendages/", "R81 course route drift")
    need(errors, mod["previous"] == "prac-05", "R81 previous-module drift")
    need(errors, mod["next"] == "prac-07", "R81 next-module drift")
  end
end

if PATHS[:coverage].file?
  coverage = JSON.parse(read_utf8(PATHS[:coverage]))
  mod = Array(coverage["modules"]).find { |m| m["id"] == "06" }
  need(errors, !mod.nil?, "R81 coverage prac-06 missing")
  if mod
    need(errors, mod["status"] == "complete", "R81 coverage status drift")
    need(errors, mod["coverage"] == "cockroach + prawn functional categories", "R81 coverage corpus drift")
  end
end

if PATHS[:manifest].file?
  manifest = JSON.parse(read_utf8(PATHS[:manifest]))
  need(errors, manifest["authorized_base"] == BASE, "R81 manifest authorized base mismatch")
  need(errors, manifest["module_id"] == "prac-06", "R81 manifest module mismatch")
  need(errors, manifest["baseline_blob_sha"] == BASE_BLOBS[SOURCE_REL], "R81 manifest baseline blob mismatch")
  census = manifest["content_census"] || {}
  {
    "h1"=>1, "h2"=>5, "h3"=>6, "markdown_tables"=>2, "markdown_table_lines"=>19,
    "cockroach_mouthpart_rows"=>5, "prawn_appendage_rows"=>10,
    "syllabus_functional_groups"=>5, "placement_rules"=>6, "self_check_bullets"=>5
  }.each { |k,v| need(errors, census[k] == v, "R81 manifest census mismatch: #{k}") }
  need(errors, manifest.dig("mutation","learner_source_count") == 1, "R81 manifest learner mutation count mismatch")
  need(errors, manifest.dig("mutation","strict_route_rows_added") == 1, "R81 manifest route mutation mismatch")
  need(errors, manifest.dig("mutation","table_wrapper_count") == 2, "R81 table wrapper count must be 2")
  need(errors, manifest.dig("preservation","heading_normalization") == false, "R81 heading normalization must remain false")
end

if PATHS[:state].file?
  if bootstrap
    need(errors, phase == PHASE, "R81 state phase mismatch")
    need(errors, top_level_scalar(state_text, "authorized_base") == BASE, "R81 state base mismatch")
    need(errors, top_level_list(state_text, "learner_mutation_allowlist") == [SOURCE_REL], "R81 exact learner allowlist missing")
  elsif future
    need(errors, current_order && r81_order && (current_order <=> r81_order) >= 0, "R81 successor state regressed")
    need(errors, successor_authorized, "R81 successor state must advance and bind exact current base") if changed.include?(STATE_REL)
  end
end

if bootstrap
  need(errors, changed == CHANGED_FILES, "R81 changed-file scope mismatch: #{changed}")
elsif future
  protected_artifacts = [VALIDATOR_REL, MANIFEST_REL, AUTH_REL, IMPL_REL, BROWSER_REL, WORKFLOW_REL, PROD_WORKFLOW_REL]
  touched = changed & protected_artifacts
  if maintenance
    need(errors, successor_authorized, "R81 maintenance requires advanced exact-base authority")
  else
    need(errors, touched.empty?, "Successor changed protected R81 artifacts: #{touched.join(', ')}")
  end
end

if errors.empty?
  puts "CONV-04F-09-R81 Appendages preservation/scope: PASS"
else
  warn "CONV-04F-09-R81 Appendages preservation/scope: FAIL"
  errors.each { |e| warn "- #{e}" }
  exit 1
end
