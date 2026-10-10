#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "f04ac472ee261fa19dc17de6052bde02b75e99c4"
PHASE = "CONV-04F-09"
R1_PHASE = "CONV-04F-09-R1"
R1_BASE = "787a680b543e8b80823125342a51683342f49b6f"
R2_PHASE = "CONV-04F-09-R2"
R2_BASE = "ec7fc9f12e4f42ebba257b6e9d12f1be7d1b155b"
R3_PHASE = "CONV-04F-09-R3"
R3_BASE = "9a09a8975018b035935685820958bd6d968f4b4d"
SOURCE_REL = "_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md"
SOURCE = ROOT.join(SOURCE_REL)
ROUTE_CSS_REL = "assets/css/zoology-practical-museum-f09.css"
ROUTE_CSS = ROOT.join(ROUTE_CSS_REL)
MANIFEST = ROOT.join("_data/academic/conv04f_zoology_practical_museum_v1.json")
LEDGER = ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
AUTH = ROOT.join("docs/academic/conv04/ZOOLOGY_PRACTICAL_MUSEUM_F09_AUTHORIZATION.md")
COURSE = ROOT.join("_data/academic/course_contract_v1.json")
COVERAGE = ROOT.join("_data/zoology-practical-213106-coverage.json")
FIGURES = ROOT.join("_data/zoology-practical-museum-figures.json")
SHARED_CSS = ROOT.join("assets/css/zoology-practical.css")
SHARED_JS = ROOT.join("assets/js/zoology-practical.js")
BROWSER = ROOT.join(".github/scripts/conv04f-zoology-practical-museum-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/conv04f-zoology-practical-museum-certification.yml")
PRODUCTION_WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-museum-production-parity.yml"
PRODUCTION_WORKFLOW = ROOT.join(PRODUCTION_WORKFLOW_REL)
R1_AUTH_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_MUSEUM_F09_R1_PRODUCTION_PARITY.md"
R1_AUTH = ROOT.join(R1_AUTH_REL)
R2_AUTH_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_MUSEUM_F09_R2_YAML_REPAIR.md"
R2_AUTH = ROOT.join(R2_AUTH_REL)
R3_AUTH_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_MUSEUM_F09_R3_CANONICAL_BEACON_CERTIFICATION.md"
R3_AUTH = ROOT.join(R3_AUTH_REL)
CTA = "{% include education/learning-guide-cta.html %}"

BASE_BLOBS = {
  SOURCE_REL => "26e1711cf9c6bace8ddd8419797c38511987420c",
  "_data/zoology-practical-213106-coverage.json" => "ab66ddafc1346b65337bc52236d1029a77cf5792",
  "_data/zoology-practical-museum-figures.json" => "9529da79d51bfff15c56128bfcf56a88a6735869",
  "_data/academic/course_contract_v1.json" => "a02365ea6743c44a1eddaf84ad05f66d670ade6b",
  "assets/css/zoology-practical.css" => "0962ae71cd1e424e27949b409f5284493f722dd3",
  "assets/js/zoology-practical.js" => "207684413ad7925686334cafc3748861a439f206",
  "_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md" => "50825b1a7178d062c437cf10b2a1d8ef8c1780f8",
  "_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md" => "904933f7b29a301f72b7d370582d605364b906e6",
  "_biology/higher-zoology-tree/practical/04-dissection.bn.md" => "0bca70d74c04305fd2399f54fbb5c650f0b158c3",
  "_biology/higher-zoology-tree/practical/05-temporary-mounts.bn.md" => "b01e88d0bfe9441e984ac2a10f3a0ee761379850",
  "_biology/higher-zoology-tree/practical/06-appendages.bn.md" => "36e36c4dd8cfffb99f1669033b4a21bc0e45d939",
  "_biology/higher-zoology-tree/practical/07-zooplankton.bn.md" => "c120863ca31d85a33f1476b3f5bab59d571950cf",
  "_biology/higher-zoology-tree/practical/08-field-report.bn.md" => "6398c601c3a1b3cd891e8ea945d704d5d94b9711"
}.freeze

CHANGED_FILES = %w[
  .github/scripts/conv04f-zoology-practical-museum-browser-certification.mjs
  .github/scripts/validate-conv04f-zoology-practical-museum.rb
  .github/workflows/conv04f-zoology-practical-museum-certification.yml
  _biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md
  _data/academic/conv04f_zoology_practical_museum_v1.json
  assets/css/zoology-practical-museum-f09.css
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/CONV04_STATE.md
  docs/academic/conv04/ZOOLOGY_PRACTICAL_MUSEUM_F09_AUTHORIZATION.md
].sort.freeze

SPRITES = {
  "sycon" => ["0%", "0%"],
  "adamsia" => ["50%", "0%"],
  "tubifex" => ["100%", "0%"],
  "lumbricus" => ["0%", "25%"],
  "ancylostoma" => ["50%", "25%"],
  "enterobius" => ["100%", "25%"],
  "wuchereria" => ["0%", "50%"],
  "hirudo" => ["50%", "50%"],
  "fasciola" => ["100%", "50%"],
  "schistosoma" => ["0%", "75%"],
  "pila" => ["50%", "75%"],
  "octopus" => ["100%", "75%"],
  "centipedes" => ["0%", "100%"],
  "echinus" => ["50%", "100%"],
  "holothuria" => ["100%", "100%"]
}.freeze

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
    "<link rel=\"stylesheet\" href=\"{{ '/assets/css/zoology-practical.css' | relative_url }}\">",
    "<link rel=\"stylesheet\" href=\"{{ '/assets/css/zoology-practical.css' | relative_url }}\">\n<link rel=\"stylesheet\" href=\"{{ '/assets/css/zoology-practical-museum-f09.css' | relative_url }}\">"
  )
  out = out.sub(
    "# Study of Museum Specimens — Complete NU Coverage\n\n",
    "# Study of Museum Specimens — Complete NU Coverage\n\n#{CTA}\n\n"
  )
  out.gsub(/\sstyle=\"--museum-x:[^\"]+;--museum-y:[^\"]+;\"/, "")
end

def course_entry(text)
  data = JSON.parse(text)
  Array(data["pathways"]).find { |e| e["course_id"] == "nu-zoology-practical-213106" }
end

comparison_base = ENV["PR_BASE_SHA"].to_s.strip
comparison_base = BASE if comparison_base.empty?
state_text = STATE.file? ? read_utf8(STATE) : ""
phase = state_text[/^phase:\s*(\S+)/, 1]

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

bootstrap = comparison_base == BASE && phase == PHASE
future = comparison_base != BASE
maintenance_r1 = comparison_base == R1_BASE && phase == R1_PHASE
maintenance_r2 = comparison_base == R2_BASE && phase == R2_PHASE
maintenance_r3 = comparison_base == R3_BASE && phase == R3_PHASE
successor_authorized = false
successor_allowlist = []
changed = []

unless comparison_base.empty?
  stdout, stderr, status = git("diff", "--name-only", "#{comparison_base}...HEAD")
  if status.success?
    changed = stdout.lines.map(&:strip).reject(&:empty?).sort
  else
    errors << "Unable to inspect F-09 changed-file scope: #{stderr.strip}"
  end
end

# CONV-04J governance-only transition is not a Practical successor release.
# Preserve all Practical source/contract checks; bypass only the obsolete
# state-phase advancement predicate when the complete PR diff is J governance.
j_governance_only = false
if changed.sort == ["docs/academic/conv04/CONV04_STATE.md", "docs/academic/conv04/CONV04_J_RELEASE_CLOSURE.md"].sort && phase == "CONV-04J-R1"
  j_base = state_text[/^j_implementation_base:\\s*(\\S+)/, 1]
  j_governance_only = j_base && j_base.match?(/\\A[0-9a-f]{40}\\z/) &&
    git("merge-base", "--is-ancestor", j_base, "HEAD").last.success?
end
if future && STATE.file? && changed.include?("docs/academic/conv04/CONV04_STATE.md")
  base_state, _, bs = git("show", "#{comparison_base}:docs/academic/conv04/CONV04_STATE.md")
  if bs.success?
    base_phase = base_state[/^phase:\s*(\S+)/, 1]
    bo = phase_order(base_phase)
    co = phase_order(phase)
    fo = phase_order(PHASE)
    successor_authorized = bo && co && fo && (co <=> bo) > 0 && (co <=> fo) > 0 &&
      state_text.include?("authorized_base: #{comparison_base}")
    successor_allowlist = top_level_list(state_text, "learner_mutation_allowlist")
  else
    errors << "Unable to authenticate F-09 successor base state"
  end
end

[SOURCE, ROUTE_CSS, MANIFEST, LEDGER, STATE, AUTH, COURSE, COVERAGE, FIGURES, SHARED_CSS, SHARED_JS, BROWSER, WORKFLOW, PRODUCTION_WORKFLOW, R1_AUTH, R2_AUTH, R3_AUTH].each do |path|
  errors << "Missing F-09 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

BASE_BLOBS.each do |relative, expected|
  blob, _, status = git("rev-parse", "#{BASE}:#{relative}")
  need(errors, status.success? && blob.strip == expected, "F-09 authenticated base blob mismatch: #{relative}")
  next if relative == SOURCE_REL || !bootstrap
  baseline, _, show_status = git("show", "#{BASE}:#{relative}")
  if show_status.success?
    need(errors, read_utf8(ROOT.join(relative)) == baseline, "F-09 changed protected bootstrap baseline: #{relative}")
  else
    errors << "Unable to read protected baseline: #{relative}"
  end
end

if SOURCE.file?
  baseline, _, status = git("show", "#{BASE}:#{SOURCE_REL}")
  if status.success?
    source = read_utf8(SOURCE)
    if bootstrap
      need(errors, source == authorized_transform(baseline),
           "Museum source differs from exact F-09 authorized transformation")
    elsif future && changed.include?(SOURCE_REL)
      need(errors, successor_authorized, "Successor changed prac-01 without an advanced CONV-04 phase bound to current base")
      need(errors, successor_allowlist.include?(SOURCE_REL), "Successor changed prac-01 without exact learner_mutation_allowlist authority")
    end
    need(errors, fm_value(source, "permalink") == "/biology/higher-zoology-tree/practical/museum-specimens/", "F-09 permalink drift")
    need(errors, fm_value(source, "course_id") == "zoology-practical-213106", "F-09 course_id drift")
    need(errors, fm_value(source, "course_role") == "practical-lecture", "F-09 course_role drift")
    need(errors, fm_value(source, "language") == "bn", "F-09 language drift")
    need(errors, fm_value(source, "lang") == "bn", "F-09 lang drift")
    need(errors, fm_value(source, "locale") == "bn-BD", "F-09 locale drift")
    need(errors, fm_value(source, "academic_system") == "v1", "F-09 academic_system missing")
    need(errors, fm_value(source, "academic_role") == "practical", "F-09 academic_role mismatch")
    need(errors, fm_value(source, "learning_guide") == "canonical", "F-09 canonical Learning Guide missing")
    need(errors, source.scan(CTA).length == 1, "F-09 requires exactly one canonical Learning Guide CTA")
    need(errors, source.include?("/assets/css/zoology-practical-museum-f09.css"), "F-09 route-owned stylesheet link missing")
    need(errors, !source.match?(/\sstyle\s*=/i), "F-09 Museum source still contains inline style")
    need(errors, !source.match?(/<style\b/i), "F-09 Museum source contains embedded style block")
    need(errors, source.scan(/^##\s+(\d+)\./).flatten.map(&:to_i) == (1..48).to_a, "F-09 specimen numbering must remain 1..48")
    need(errors, source.scan(/^\| Rank \| Taxon \|$/).length == 48, "F-09 must preserve 48 classification tables")
    need(errors, source.scan(/^\| Pair \| Fast distinction \|$/).length == 1, "F-09 high-yield comparison table drift")
    need(errors, source.scan(/class=\"museum-verified-figure\"/).length == 15, "F-09 verified figure count drift")
    need(errors, source.include?("48/48 unique syllabus labels"), "F-09 48/48 coverage disclosure missing")
    need(errors, source.include?("Echinus"), "F-09 duplicate Echinus note missing")
    %w[
      Metaphere Pheretima Diphyllobothrium Hymenolepis Convoluta Sipunculus Eupagurus
    ].each { |term| need(errors, source.include?(term), "F-09 nomenclature flag missing: #{term}") }
    need(errors, source.include?("# Spotting Template"), "F-09 Spotting Template missing")
    (1..48).each do |n|
      next_n = n + 1
      section = if n < 48
        source[/^##\s+#{n}\.\s.*?(?=^##\s+#{next_n}\.\s)/m]
      else
        source[/^##\s+48\.\s.*?(?=^#\s+High-yield)/m]
      end
      need(errors, !section.nil?, "F-09 specimen section missing: #{n}")
      if section
        need(errors, section.include?("### শনাক্তকারী বৈশিষ্ট্য"), "F-09 identifying characters missing: #{n}")
        need(errors, section.include?("### Practical identification"), "F-09 Practical identification missing: #{n}")
      end
    end
  else
    errors << "Unable to authenticate Museum baseline source"
  end
end

if ROUTE_CSS.file?
  css = read_utf8(ROUTE_CSS)
  SPRITES.each do |slug, (x, y)|
    pattern = /\.museum-verified-figure\[data-specimen=\"#{Regexp.escape(slug)}\"\]\s+\.museum-verified-image\s*\{[^}]*--museum-x:\s*#{Regexp.escape(x)};[^}]*--museum-y:\s*#{Regexp.escape(y)};/m
    need(errors, css.match?(pattern), "F-09 sprite coordinate drift: #{slug}")
  end
  need(errors, css.include?('article.zoology-practical-page[data-lbfl-academic-role="practical"]'), "F-09 CSS is not Practical-role scoped")
  need(errors, css.include?(".page__content table th"), "F-09 table-header ownership missing")
  need(errors, css.include?("@media (max-width: 30rem)"), "F-09 mobile rule missing")
  need(errors, css.include?("@media (prefers-reduced-motion: reduce)"), "F-09 reduced-motion rule missing")
  need(errors, !css.include?("url("), "F-09 route CSS must not replace the governed verified sprite asset")
end

if COVERAGE.file?
  begin
    c = JSON.parse(read_utf8(COVERAGE))
    need(errors, c["course_code"] == "213106", "F-09 coverage course code drift")
    need(errors, c.dig("museum_specimens", "printed_entries") == 49, "F-09 printed-entry census drift")
    need(errors, c.dig("museum_specimens", "unique_labels") == 48, "F-09 unique-label census drift")
    need(errors, c.dig("museum_specimens", "covered_unique_labels") == 48, "F-09 covered-label census drift")
    need(errors, c.dig("museum_specimens", "coverage") == "48/48", "F-09 coverage status drift")
    need(errors, c.dig("museum_specimens", "duplicate_printed_label") == "Echinus", "F-09 duplicate-label custody drift")
    need(errors, Array(c["nomenclature_flags"]).length == 7, "F-09 nomenclature-flag census drift")
  rescue JSON::ParserError => e
    errors << "Coverage JSON invalid: #{e.message}"
  end
end

if FIGURES.file?
  begin
    f = JSON.parse(read_utf8(FIGURES))
    figures = Array(f["figures"])
    verified = figures.select { |x| x["visual_status"] == "verified-image" }
    pending = figures.select { |x| x["visual_status"] == "pending-verified-image" }
    need(errors, figures.length == 48, "F-09 figure manifest must remain 48")
    need(errors, verified.length == 15 && verified.all? { |x| x["public_render"] == true }, "F-09 verified-image custody drift")
    need(errors, pending.length == 33 && pending.all? { |x| x["public_render"] == false }, "F-09 pending-image custody drift")
    need(errors, verified.map { |x| x["slug"] }.sort == SPRITES.keys.sort, "F-09 verified slug set drift")
  rescue JSON::ParserError => e
    errors << "Figure manifest JSON invalid: #{e.message}"
  end
end

if COURSE.file?
  begin
    entry = course_entry(read_utf8(COURSE))
    need(errors, !entry.nil?, "F-09 Practical course entry missing")
    if entry
      need(errors, entry["enforcement"] == "strict", "F-09 Practical course must remain strict")
      mods = Array(entry["modules"])
      need(errors, mods.map { |m| m["module_id"] } == (1..8).map { |n| format("prac-%02d", n) }, "F-09 module order drift")
      first = mods.first
      need(errors, first && first["source_file"] == SOURCE_REL, "F-09 prac-01 source ownership drift")
      need(errors, first && first["route"] == "/biology/higher-zoology-tree/practical/museum-specimens/", "F-09 prac-01 route drift")
    end
  rescue JSON::ParserError => e
    errors << "Course contract JSON invalid: #{e.message}"
  end
end

if MANIFEST.file?
  begin
    m = JSON.parse(read_utf8(MANIFEST))
    need(errors, m["schema"] == "lbfl-conv04f-zoology-practical-museum-v1", "F-09 manifest schema drift")
    need(errors, m["version"] == "CONV-04F-09-1.0.0", "F-09 manifest version drift")
    need(errors, m["authorized_base"] == BASE, "F-09 manifest base drift")
    need(errors, m["module_id"] == "prac-01", "F-09 manifest module drift")
    need(errors, m["baseline_blob_sha"] == BASE_BLOBS[SOURCE_REL], "F-09 manifest source baseline drift")
    need(errors, m.dig("preservation", "scientific_content_rewrite") == false, "F-09 scientific rewrite must remain false")
    need(errors, m.dig("preservation", "curriculum_content_rewrite") == false, "F-09 curriculum rewrite must remain false")
    need(errors, m.dig("preservation", "coverage") == "48/48", "F-09 manifest coverage drift")
    need(errors, m.dig("preservation", "verified_images") == 15, "F-09 manifest verified count drift")
    need(errors, m.dig("preservation", "pending_images") == 33, "F-09 manifest pending count drift")
  rescue JSON::ParserError => e
    errors << "F-09 manifest JSON invalid: #{e.message}"
  end
end

if LEDGER.file?
  begin
    ledger = JSON.parse(read_utf8(LEDGER))
    route = Array(ledger["routes"]).find { |r| r["id"] == "higher-zoology-practical-museum-specimens" }
    need(errors, !route.nil?, "F-09 strict Museum route missing from ledger")
    if route
      need(errors, route["canonical_route"] == "/biology/higher-zoology-tree/practical/museum-specimens/", "F-09 ledger route drift")
      need(errors, route["source_file"] == SOURCE_REL, "F-09 ledger source drift")
      need(errors, route["academic_role"] == "practical", "F-09 ledger role drift")
      need(errors, route["language"] == "bn", "F-09 ledger language drift")
      need(errors, route["boundary_owner"] == "layout", "F-09 ledger boundary owner drift")
      need(errors, route["learning_guide_owner"] == "canonical", "F-09 ledger Learning Guide owner drift")
      need(errors, route["assessment_owner"] == "mcq-arena", "F-09 ledger assessment owner drift")
      need(errors, route["enforcement"] == "strict", "F-09 ledger route must be strict")
      need(errors, Array(route["source_debt"]).empty? && Array(route["live_debt"]).empty?, "F-09 strict route must have zero debt")
    end
  rescue JSON::ParserError => e
    errors << "Academic Route Ledger JSON invalid: #{e.message}"
  end
end

if STATE.file?
  s = read_utf8(STATE)
  if bootstrap
    need(errors, s.match?(/^phase:\s*#{Regexp.escape(PHASE)}$/), "F-09 state phase mismatch")
    need(errors, s.include?("authorized_base: #{BASE}"), "F-09 state base mismatch")
    need(errors, s.include?("production_verified_main: #{BASE}"), "F-09 production baseline mismatch")
    need(errors, s.include?("learner_mutation_allowlist:\n  - #{SOURCE_REL}\n"), "F-09 exact learner allowlist missing")
    need(errors, s.include?("scientific and curriculum rewrite forbidden"), "F-09 scientific preservation authority missing")
  elsif future
    current_order = phase_order(phase)
    f09_order = phase_order(PHASE)
    need(errors, !current_order.nil?, "F-09 successor state phase malformed")
    if current_order && f09_order
      need(errors, (current_order <=> f09_order) >= 0, "F-09 successor state regressed behind F-09")
    end
    if changed.include?("docs/academic/conv04/CONV04_STATE.md")
      need(errors, successor_authorized || j_governance_only, "Successor state must advance beyond F-09 and bind current base")
    end
  else
    errors << "F-09 validator could not classify bootstrap or future certification"
  end
end

if bootstrap
  need(errors, changed == CHANGED_FILES, "F-09 bootstrap changed-file scope mismatch: #{changed}")
elsif future
  immutable = [
    ROUTE_CSS_REL,
    "_data/academic/conv04f_zoology_practical_museum_v1.json",
    "docs/academic/conv04/ZOOLOGY_PRACTICAL_MUSEUM_F09_AUTHORIZATION.md",
    ".github/scripts/validate-conv04f-zoology-practical-museum.rb",
    ".github/scripts/conv04f-zoology-practical-museum-browser-certification.mjs",
    ".github/workflows/conv04f-zoology-practical-museum-certification.yml",
    PRODUCTION_WORKFLOW_REL,
    R1_AUTH_REL,
    R2_AUTH_REL,
    R3_AUTH_REL
  ]
  if maintenance_r1
    r1_scope = [
      ".github/scripts/validate-conv04f-zoology-practical-museum.rb",
      ".github/scripts/conv04f-zoology-practical-museum-browser-certification.mjs",
      PRODUCTION_WORKFLOW_REL,
      "docs/academic/conv04/CONV04_STATE.md",
      R1_AUTH_REL
    ].sort
    need(errors, changed == r1_scope, "F-09-R1 production-parity scope mismatch: #{changed}")
    need(errors, successor_authorized, "F-09-R1 state must advance from exact merged F-09 main")
  elsif maintenance_r2
    r2_scope = [
      ".github/scripts/validate-conv04f-zoology-practical-museum.rb",
      ".github/workflows/conv04f-zoology-practical-museum-certification.yml",
      PRODUCTION_WORKFLOW_REL,
      "docs/academic/conv04/CONV04_STATE.md",
      R2_AUTH_REL
    ].sort
    need(errors, changed == r2_scope, "F-09-R2 production-parity YAML repair scope mismatch: #{changed}")
    need(errors, successor_authorized, "F-09-R2 state must advance from exact merged F-09-R1 main")
  elsif maintenance_r3
    r3_scope = [
      ".github/scripts/validate-conv04f-zoology-practical-museum.rb",
      ".github/scripts/conv04f-zoology-practical-museum-browser-certification.mjs",
      PRODUCTION_WORKFLOW_REL,
      "docs/academic/conv04/CONV04_STATE.md",
      R3_AUTH_REL
    ].sort
    need(errors, changed == r3_scope, "F-09-R3 canonical-certification scope mismatch: #{changed}")
    need(errors, successor_authorized, "F-09-R3 state must advance from exact merged F-09-R2 main")
  else
    touched = changed & immutable
    need(errors, touched.empty?, "Successor changed protected F-09 artifacts: #{touched.join(', ')}")
  end

  if changed.include?("_data/academic/course_contract_v1.json")
    before_text, _, bs = git("show", "#{comparison_base}:_data/academic/course_contract_v1.json")
    if bs.success?
      begin
        need(errors, course_entry(before_text) == course_entry(read_utf8(COURSE)),
             "Successor changed governed Practical course identity/sequence")
      rescue JSON::ParserError => e
        errors << "Unable to compare successor course contract: #{e.message}"
      end
    else
      errors << "Unable to authenticate successor base course contract"
    end
  end

  if changed.include?("docs/academic/conv04/CONV04_STATE.md")
    need(errors, successor_authorized || j_governance_only, "Successor state must advance beyond F-09 and bind current base")
  end
end

if errors.empty?
  puts "CONV-04F-09 Practical Museum Specimens convergence: PASS"
  puts "module=prac-01 coverage=48/48 figures=15_verified/33_pending scientific_rewrite=none shared_practical_css_js=unchanged"
  exit 0
end

warn "CONV-04F-09 Practical Museum Specimens convergence: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
