#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "5af320549210f44cd3eacec919766ef86665214b"
PHASE = "CONV-04F-09-R40"
SOURCE_REL = "_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md"
SOURCE = ROOT.join(SOURCE_REL)
MANIFEST_REL = "_data/academic/conv04f_zoology_practical_permanent_slides_v1.json"
MANIFEST = ROOT.join(MANIFEST_REL)
LEDGER_REL = "docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json"
LEDGER = ROOT.join(LEDGER_REL)
STATE_REL = "docs/academic/conv04/CONV04_STATE.md"
STATE = ROOT.join(STATE_REL)
AUTH_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_PERMANENT_SLIDES_F09_R4_AUTHORIZATION.md"
AUTH = ROOT.join(AUTH_REL)
IMPL_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_PERMANENT_SLIDES_F09_R40_IMPLEMENTATION.md"
IMPL = ROOT.join(IMPL_REL)
COURSE_REL = "_data/academic/course_contract_v1.json"
COURSE = ROOT.join(COURSE_REL)
COVERAGE_REL = "_data/zoology-practical-213106-coverage.json"
COVERAGE = ROOT.join(COVERAGE_REL)
SHARED_CSS_REL = "assets/css/zoology-practical.css"
SHARED_CSS = ROOT.join(SHARED_CSS_REL)
SHARED_JS_REL = "assets/js/zoology-practical.js"
SHARED_JS = ROOT.join(SHARED_JS_REL)
BROWSER_REL = ".github/scripts/conv04f-zoology-practical-permanent-slides-browser-certification.mjs"
BROWSER = ROOT.join(BROWSER_REL)
WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-permanent-slides-certification.yml"
WORKFLOW = ROOT.join(WORKFLOW_REL)
PROD_WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-permanent-slides-production-parity.yml"
PROD_WORKFLOW = ROOT.join(PROD_WORKFLOW_REL)
CTA = "{% include education/learning-guide-cta.html %}"

BASE_BLOBS = {
  "_biology/higher-zoology-tree/practical/index.bn.md" => "d45ae49889c5e6d02445776ca5120f5fcedda65e",
  "_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md" => "bf14db772daaa5bbf1d7386d7f146b7d9a730799",
  SOURCE_REL => "50825b1a7178d062c437cf10b2a1d8ef8c1780f8",
  "_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md" => "904933f7b29a301f72b7d370582d605364b906e6",
  "_biology/higher-zoology-tree/practical/04-dissection.bn.md" => "0bca70d74c04305fd2399f54fbb5c650f0b158c3",
  "_biology/higher-zoology-tree/practical/05-temporary-mounts.bn.md" => "b01e88d0bfe9441e984ac2a10f3a0ee761379850",
  "_biology/higher-zoology-tree/practical/06-appendages.bn.md" => "36e36c4dd8cfffb99f1669033b4a21bc0e45d939",
  "_biology/higher-zoology-tree/practical/07-zooplankton.bn.md" => "c120863ca31d85a33f1476b3f5bab59d571950cf",
  "_biology/higher-zoology-tree/practical/08-field-report.bn.md" => "6398c601c3a1b3cd891e8ea945d704d5d94b9711",
  COURSE_REL => "a02365ea6743c44a1eddaf84ad05f66d670ade6b",
  COVERAGE_REL => "ab66ddafc1346b65337bc52236d1029a77cf5792",
  SHARED_CSS_REL => "0962ae71cd1e424e27949b409f5284493f722dd3",
  SHARED_JS_REL => "207684413ad7925686334cafc3748861a439f206"
}.freeze

CHANGED_FILES = [
  BROWSER_REL,
  ".github/scripts/validate-conv04f-zoology-practical-permanent-slides.rb",
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

def authorized_transform(source)
  out = source.dup
  out = out.sub(
    "locale: bn-BD\ntoc: true",
    "locale: bn-BD\nacademic_system: v1\nacademic_role: practical\nlearning_guide: canonical\ntoc: true"
  )
  out = out.sub(
    "# Study of Permanent Slides\n\n",
    "# Study of Permanent Slides\n\n#{CTA}\n\n"
  )
  out
end

def phase_order(value)
  m = /\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.match(value.to_s.strip)
  m ? [m[1].ord, (m[2] || "0").to_i, (m[3] || "0").to_i] : nil
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

def route_entry(text)
  data = JSON.parse(text)
  Array(data["routes"]).find { |r| r["id"] == "higher-zoology-practical-permanent-slides" }
end

def course_entry(text)
  data = JSON.parse(text)
  Array(data["pathways"]).find { |e| e["course_id"] == "nu-zoology-practical-213106" }
end

comparison_base = ENV["PR_BASE_SHA"].to_s.strip
comparison_base = BASE if comparison_base.empty?
state_text = STATE.file? ? read_utf8(STATE) : ""
phase = state_text[/^phase:\s*(\S+)/, 1]
bootstrap = comparison_base == BASE && phase == PHASE
future = comparison_base != BASE
current_order = phase_order(phase)
r40_order = phase_order(PHASE)
maintenance = future && current_order && r40_order &&
  current_order[0,2] == r40_order[0,2] &&
  current_order[2].between?(41,49)

changed = []
stdout, stderr, status = git("diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
else
  errors << "Unable to inspect R40 changed-file scope: #{stderr.strip}"
end

successor_authorized = false
successor_allowlist = []
if future && STATE.file? && changed.include?(STATE_REL)
  base_state, _, bs = git("show", "#{comparison_base}:#{STATE_REL}")
  if bs.success?
    base_phase = base_state[/^phase:\s*(\S+)/, 1]
    bo = phase_order(base_phase)
    co = phase_order(phase)
    successor_authorized = bo && co && r40_order && (co <=> bo) > 0 && (co <=> r40_order) > 0 &&
      state_text.include?("authorized_base: #{comparison_base}")
    successor_allowlist = top_level_list(state_text, "learner_mutation_allowlist")
  else
    errors << "Unable to authenticate R40 successor base state"
  end
end

[SOURCE, MANIFEST, LEDGER, STATE, AUTH, IMPL, COURSE, COVERAGE, SHARED_CSS, SHARED_JS, BROWSER, WORKFLOW, PROD_WORKFLOW].each do |path|
  errors << "Missing R40 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

BASE_BLOBS.each do |relative, expected|
  blob, _, st = git("rev-parse", "#{BASE}:#{relative}")
  need(errors, st.success? && blob.strip == expected, "R40 authenticated base blob mismatch: #{relative}")
  next if relative == SOURCE_REL || !bootstrap
  baseline, _, show_status = git("show", "#{BASE}:#{relative}")
  need(errors, show_status.success? && read_utf8(ROOT.join(relative)) == baseline,
       "R40 changed protected baseline: #{relative}")
end

if SOURCE.file?
  baseline, _, st = git("show", "#{BASE}:#{SOURCE_REL}")
  if st.success?
    src = read_utf8(SOURCE)
    if bootstrap
      need(errors, src == authorized_transform(baseline),
           "Permanent Slides source differs from exact authorized structural transform")
    elsif future && changed.include?(SOURCE_REL)
      need(errors, successor_authorized, "Successor changed prac-02 without advanced exact-base authority")
      need(errors, successor_allowlist.include?(SOURCE_REL), "Successor changed prac-02 without learner allowlist authority")
    end
    need(errors, fm_value(src, "permalink") == "/biology/higher-zoology-tree/practical/permanent-slides/", "R40 permalink drift")
    need(errors, fm_value(src, "course_id") == "zoology-practical-213106", "R40 course_id drift")
    need(errors, fm_value(src, "course_role") == "practical-lecture", "R40 course_role drift")
    need(errors, fm_value(src, "language") == "bn" && fm_value(src, "lang") == "bn", "R40 language drift")
    need(errors, fm_value(src, "locale") == "bn-BD", "R40 locale drift")
    need(errors, fm_value(src, "academic_system") == "v1", "R40 academic_system missing")
    need(errors, fm_value(src, "academic_role") == "practical", "R40 academic_role mismatch")
    need(errors, fm_value(src, "learning_guide") == "canonical", "R40 canonical Learning Guide missing")
    need(errors, src.scan(CTA).length == 1, "R40 requires exactly one canonical Learning Guide CTA")
    need(errors, src.include?("43-preparation reference bank"), "R40 43-preparation teaching-bank statement missing")
    need(errors, src.include?("at least 20 slides") && src.include?("≥20"), "R40 ≥20 syllabus rule missing")
    need(errors, src.include?("Modern terminology note:"), "R40 terminology note missing")
    need(errors, src.include?("### Slide-answer rule"), "R40 mouthpart answer rule missing")
    need(errors, src.include?("## Permanent-slide Spotting Template"), "R40 spotting template missing")
    need(errors, src.include?("## Microscope Workflow"), "R40 microscope workflow missing")
    microscope = src[/^## Microscope Workflow\s*$\n(.*)\z/m, 1].to_s
    need(errors, microscope.scan(/^\d+\.\s/).length == 6, "R40 microscope workflow must remain six steps")
    need(errors, !src.match?(/<style\b/i), "R40 source contains embedded style block")
    need(errors, !src.match?(/\sstyle\s*=/i), "R40 source contains inline style")
  else
    errors << "Unable to authenticate R40 learner baseline"
  end
end

if MANIFEST.file?
  begin
    m = JSON.parse(read_utf8(MANIFEST))
    need(errors, m["schema"] == "lbfl-conv04f-zoology-practical-permanent-slides-v1", "R40 manifest schema drift")
    need(errors, m["version"] == "CONV-04F-09-R40-1.0.0", "R40 manifest version drift")
    need(errors, m["authorized_base"] == BASE, "R40 manifest base drift")
    need(errors, m["module_id"] == "prac-02", "R40 manifest module drift")
    need(errors, m["baseline_blob_sha"] == BASE_BLOBS[SOURCE_REL], "R40 baseline blob drift")
    c = m["content_census"] || {}
    need(errors, c["whole_animals"] == 8 && c["arthropod_mouthparts"] == 6 &&
      c["parasites"] == 11 && c["larval_forms"] == 10 &&
      c["histological_preparations"] == 8 && c["teaching_bank_total"] == 43,
      "R40 content census drift")
    need(errors, c["syllabus_minimum"] == 20 && c["microscope_workflow_steps"] == 6,
      "R40 syllabus/workflow census drift")
    p = m["preservation"] || {}
    need(errors, p["scientific_content_rewrite"] == false &&
      p["taxonomic_content_rewrite"] == false &&
      p["curriculum_content_rewrite"] == false, "R40 rewrite boundary drift")
  rescue JSON::ParserError => e
    errors << "R40 manifest JSON invalid: #{e.message}"
  end
end

if LEDGER.file?
  begin
    current = JSON.parse(read_utf8(LEDGER))
    row = Array(current["routes"]).find { |r| r["id"] == "higher-zoology-practical-permanent-slides" }
    expected = {
      "id" => "higher-zoology-practical-permanent-slides",
      "canonical_route" => "/biology/higher-zoology-tree/practical/permanent-slides/",
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
    need(errors, row == expected, "R40 strict route-ledger row drift")
    if bootstrap
      base_text, _, bs = git("show", "#{BASE}:#{LEDGER_REL}")
      if bs.success?
        before = JSON.parse(base_text)
        before_rows = Array(before["routes"])
        after_rows = Array(current["routes"])
        need(errors, after_rows.length == before_rows.length + 1, "R40 ledger must add exactly one route")
        stripped = after_rows.reject { |r| r["id"] == expected["id"] }
        need(errors, stripped == before_rows, "R40 changed pre-existing Academic Route Ledger rows")
      else
        errors << "Unable to authenticate R40 base route ledger"
      end
    elsif future && changed.include?(LEDGER_REL)
      base_text, _, bs = git("show", "#{comparison_base}:#{LEDGER_REL}")
      need(errors, bs.success? && route_entry(base_text) == row, "Successor changed governed prac-02 ledger row")
    end
  rescue JSON::ParserError => e
    errors << "R40 ledger JSON invalid: #{e.message}"
  end
end

if COURSE.file?
  begin
    entry = course_entry(read_utf8(COURSE))
    need(errors, !entry.nil? && entry["enforcement"] == "strict", "R40 Practical course contract missing/weak")
    if entry
      mods = Array(entry["modules"])
      need(errors, mods.map { |m| m["module_id"] } == (1..8).map { |n| format("prac-%02d", n) }, "R40 module order drift")
      mod = mods.find { |m| m["module_id"] == "prac-02" }
      need(errors, mod && mod["order"] == 2 && mod["source_file"] == SOURCE_REL &&
        mod["route"] == "/biology/higher-zoology-tree/practical/permanent-slides/" &&
        mod["previous"] == "prac-01" && mod["next"] == "prac-03", "R40 prac-02 course identity drift")
    end
  rescue JSON::ParserError => e
    errors << "R40 course contract JSON invalid: #{e.message}"
  end
end

if COVERAGE.file?
  begin
    c = JSON.parse(read_utf8(COVERAGE))
    mod = Array(c["modules"]).find { |x| x["id"] == "02" }
    need(errors, mod && mod["status"] == "complete-teaching-bank", "R40 coverage status drift")
    need(errors, mod && mod["coverage"] == "43-preparation teaching bank; syllabus minimum >=20; no fixed canonical 30",
      "R40 coverage ledger text drift")
  rescue JSON::ParserError => e
    errors << "R40 coverage JSON invalid: #{e.message}"
  end
end

if STATE.file?
  if bootstrap
    need(errors, phase == PHASE, "R40 state phase mismatch")
    need(errors, state_text.include?("authorized_base: #{BASE}"), "R40 state base mismatch")
    need(errors, state_text.include?("learner_mutation_allowlist:\n  - #{SOURCE_REL}\n"), "R40 exact learner allowlist missing")
    need(errors, state_text.include?("R40-R49 prac-02"), "R40 Practical continuation namespace missing")
  elsif future
    need(errors, current_order && r40_order && (current_order <=> r40_order) >= 0, "R40 successor state regressed")
    need(errors, successor_authorized, "R40 successor state must advance and bind exact current base") if changed.include?(STATE_REL)
  end
end

if bootstrap
  need(errors, changed == CHANGED_FILES, "R40 changed-file scope mismatch: #{changed}")
elsif future
  protected_artifacts = [MANIFEST_REL, IMPL_REL, BROWSER_REL, WORKFLOW_REL, PROD_WORKFLOW_REL]
  touched = changed & protected_artifacts
  if maintenance
    need(errors, successor_authorized, "R40 maintenance requires advanced exact-base authority")
  else
    need(errors, touched.empty?, "Successor changed protected R40 artifacts: #{touched.join(', ')}")
  end
  if changed.include?(COURSE_REL)
    before, _, bs = git("show", "#{comparison_base}:#{COURSE_REL}")
    need(errors, bs.success? && course_entry(before) == course_entry(read_utf8(COURSE)),
      "Successor changed governed Practical course identity/sequence")
  end
end

if errors.empty?
  puts "CONV-04F-09-R40 Permanent Slides convergence: PASS"
  puts "module=prac-02 teaching_bank=43 syllabus_minimum=>=20 scientific_rewrite=none shared_practical_css_js=unchanged"
  exit 0
end

warn "CONV-04F-09-R40 Permanent Slides convergence: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
