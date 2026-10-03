#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "f04ac472ee261fa19dc17de6052bde02b75e99c4"
PHASE = "CONV-04F-09"
SOURCE_REL = "_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md"
SOURCE = ROOT.join(SOURCE_REL)
CSS_REL = "assets/css/zoology-practical-museum.css"
CSS = ROOT.join(CSS_REL)
MANIFEST_REL = "_data/academic/conv04f_zoology_practical_museum_v1.json"
MANIFEST = ROOT.join(MANIFEST_REL)
LEDGER_REL = "docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json"
LEDGER = ROOT.join(LEDGER_REL)
STATE_REL = "docs/academic/conv04/CONV04_STATE.md"
STATE = ROOT.join(STATE_REL)
AUTH_REL = "docs/academic/conv04/ZOOLOGY_PRACTICAL_MUSEUM_F09_AUTHORIZATION.md"
AUTH = ROOT.join(AUTH_REL)
BROWSER_REL = ".github/scripts/conv04f-zoology-practical-museum-browser-certification.mjs"
BROWSER = ROOT.join(BROWSER_REL)
WORKFLOW_REL = ".github/workflows/conv04f-zoology-practical-museum-certification.yml"
WORKFLOW = ROOT.join(WORKFLOW_REL)

CTA = "{% include education/learning-guide-cta.html %}"

AUTHORIZED_FILES = [
  BROWSER_REL,
  ".github/scripts/validate-conv04f-zoology-practical-museum.rb",
  WORKFLOW_REL,
  SOURCE_REL,
  MANIFEST_REL,
  CSS_REL,
  LEDGER_REL,
  STATE_REL,
  AUTH_REL
].sort.freeze

PROTECTED_BLOBS = {
  "_biology/higher-zoology-tree/practical/index.bn.md" => "d45ae49889c5e6d02445776ca5120f5fcedda65e",
  "_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md" => "50825b1a7178d062c437cf10b2a1d8ef8c1780f8",
  "_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md" => "904933f7b29a301f72b7d370582d605364b906e6",
  "_biology/higher-zoology-tree/practical/04-dissection.bn.md" => "0bca70d74c04305fd2399f54fbb5c650f0b158c3",
  "_biology/higher-zoology-tree/practical/05-temporary-mounts.bn.md" => "b01e88d0bfe9441e984ac2a10f3a0ee761379850",
  "_biology/higher-zoology-tree/practical/06-appendages.bn.md" => "36e36c4dd8cfffb99f1669033b4a21bc0e45d939",
  "_biology/higher-zoology-tree/practical/07-zooplankton.bn.md" => "c120863ca31d85a33f1476b3f5bab59d571950cf",
  "_biology/higher-zoology-tree/practical/08-field-report.bn.md" => "6398c601c3a1b3cd891e8ea945d704d5d94b9711",
  "_data/zoology-practical-213106-coverage.json" => "ab66ddafc1346b65337bc52236d1029a77cf5792",
  "_data/zoology-practical-museum-figures.json" => "9529da79d51bfff15c56128bfcf56a88a6735869",
  "_data/academic/course_contract_v1.json" => "a02365ea6743c44a1eddaf84ad05f66d670ade6b",
  "assets/css/zoology-practical.css" => "0962ae71cd1e424e27949b409f5284493f722dd3",
  "assets/js/zoology-practical.js" => "207684413ad7925686334cafc3748861a439f206"
}.freeze

NOMENCLATURE_FLAGS = [
  "Metaphere spelling/identity requires departmental specimen-label verification",
  "Pheretima retained separately because syllabus lists it separately",
  "Traditional Diphyllobothrium latum mapped to modern Dibothriocephalus latus",
  "Hymenolepis nana retains syllabus/CDC usage; NCBI current name Rodentolepis nana",
  "Convoluta modern placement Xenacoelomorpha/Acoela differs from traditional Platyhelminthes",
  "Sipunculus traditional phylum framing differs from modern annelid phylogeny",
  "Eupagurus is a traditional genus label with many species moved to Pagurus/other genera"
].freeze

errors = []

def need(errors, condition, message)
  errors << message unless condition
end

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
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

def top_level_list(source, key)
  top = source.split(/^##\s/, 2).first.to_s
  lines = top.lines
  index = lines.index { |line| line.match?(/\A#{Regexp.escape(key)}:\s*\z/) }
  return [] unless index

  items = []
  lines[(index + 1)..].to_a.each do |line|
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

def baseline_mapping(source)
  source.scan(
    /<figure class="museum-verified-figure" data-specimen="([^"]+)">\s*\n\s*<div class="museum-verified-image"[^>]*style="--museum-x:([^;"]+);--museum-y:([^;"]+);"><\/div>/
  ).map { |specimen, x, y| [specimen, x, y] }
end

def module_css(mapping)
  lines = [
    "/* CONV-04F-09 — Museum Specimens verified-image sprite coordinates.",
    "   Module-scoped only. Shared Practical CSS remains unchanged. */",
    ""
  ]
  mapping.each do |specimen, x, y|
    lines << %(.zoology-practical-page .museum-verified-figure[data-specimen="#{specimen}"] .museum-verified-image {)
    lines << "  --museum-x: #{x};"
    lines << "  --museum-y: #{y};"
    lines << "}"
    lines << ""
  end
  lines.join("\n")
end

def authorized_transform(source)
  out = source.dup
  out = out.sub(
    "locale: bn-BD\ntoc: true",
    "locale: bn-BD\nacademic_system: v1\nacademic_role: practical\nlearning_guide: canonical\ntoc: true"
  )
  out = out.sub(
    "<link rel=\"stylesheet\" href=\"{{ '/assets/css/zoology-practical.css' | relative_url }}\">\n" \
    "<script src=\"{{ '/assets/js/zoology-practical.js' | relative_url }}\" defer></script>",
    "<link rel=\"stylesheet\" href=\"{{ '/assets/css/zoology-practical-museum.css' | relative_url }}\">"
  )
  out = out.sub(
    "# Study of Museum Specimens — Complete NU Coverage\n\n",
    "# Study of Museum Specimens — Complete NU Coverage\n\n#{CTA}\n\n"
  )
  out.gsub(/ style="--museum-x:[^;"]+;--museum-y:[^;"]+;"/, "")
end

[SOURCE, CSS, MANIFEST, LEDGER, STATE, AUTH, BROWSER, WORKFLOW].each do |p|
  errors << "Missing F-09 artifact: #{p.relative_path_from(ROOT)}" unless p.file?
end

baseline, stderr, status = git("show", "#{BASE}:#{SOURCE_REL}")
if status.success?
  mapping = baseline_mapping(baseline)
  need(errors, mapping.length == 15, "Authorized baseline must contain exactly 15 verified sprite mappings")

  candidate = read_utf8(SOURCE)
  need(errors, candidate == authorized_transform(baseline),
       "prac-01 differs from the exact authorized F-09 structural transform")

  need(errors, fm_value(candidate, "permalink") == "/biology/higher-zoology-tree/practical/museum-specimens/",
       "prac-01 permalink drift")
  need(errors, fm_value(candidate, "course_id") == "zoology-practical-213106", "prac-01 course_id drift")
  need(errors, fm_value(candidate, "course_role") == "practical-lecture", "prac-01 course_role drift")
  need(errors, fm_value(candidate, "academic_system") == "v1", "prac-01 academic_system must be v1")
  need(errors, fm_value(candidate, "academic_role") == "practical", "prac-01 academic_role must be practical")
  need(errors, fm_value(candidate, "learning_guide") == "canonical", "prac-01 canonical Learning Guide ownership missing")
  need(errors, fm_value(candidate, "lang") == "bn", "prac-01 lang must remain bn")
  need(errors, fm_value(candidate, "language") == "bn", "prac-01 legacy language must remain bn")
  need(errors, candidate.scan(CTA).length == 1, "prac-01 must contain exactly one canonical Learning Guide CTA")
  need(errors, candidate.scan(/^## \d+\./).length == 48, "prac-01 must retain 48 numbered specimen sections")
  need(errors, candidate.scan(/^\| Rank \| Taxon \|$/).length == 48, "prac-01 must retain 48 classification tables")
  need(errors, candidate.scan(/^\| Pair \| Fast distinction \|$/).length == 1, "prac-01 high-yield comparison table drift")
  need(errors, candidate.scan('class="museum-verified-figure"').length == 15, "prac-01 must retain 15 verified figures")
  need(errors, candidate.scan('class="museum-verified-image"').length == 15, "prac-01 must retain 15 verified image surfaces")
  need(errors, !candidate.match?(/\sstyle\s*=/i), "prac-01 must contain no source inline style after F-09")
  need(errors, candidate.include?("/assets/css/zoology-practical-museum.css"), "prac-01 module stylesheet declaration missing")
  need(errors, !candidate.include?("/assets/css/zoology-practical.css"), "prac-01 must not duplicate layout-owned Practical CSS")
  need(errors, !candidate.include?("/assets/js/zoology-practical.js"), "prac-01 must not duplicate layout-owned Practical JS")

  need(errors, read_utf8(CSS) == module_css(mapping), "Module Museum CSS differs from authenticated 15-position mapping")
else
  errors << "Unable to authenticate prac-01 baseline at #{BASE}: #{stderr.strip}"
end

PROTECTED_BLOBS.each do |relative, expected|
  out, err, st = git("rev-parse", "HEAD:#{relative}")
  need(errors, st.success?, "Unable to resolve protected blob #{relative}: #{err.strip}")
  need(errors, out.strip == expected, "Protected blob drift: #{relative}") if st.success?
end

begin
  coverage = JSON.parse(read_utf8(ROOT.join("_data/zoology-practical-213106-coverage.json")))
  museum = coverage.fetch("museum_specimens")
  need(errors, museum["printed_entries"] == 49, "Museum printed-entry count drift")
  need(errors, museum["unique_labels"] == 48, "Museum unique-label count drift")
  need(errors, museum["covered_unique_labels"] == 48, "Museum covered-label count drift")
  need(errors, museum["coverage"] == "48/48", "Museum 48/48 coverage marker drift")
  need(errors, museum["duplicate_printed_label"] == "Echinus", "Museum duplicate printed label drift")
  need(errors, coverage["nomenclature_flags"] == NOMENCLATURE_FLAGS, "Seven nomenclature flags drift")
rescue JSON::ParserError, KeyError => e
  errors << "Coverage manifest invalid: #{e.message}"
end

begin
  figures = JSON.parse(read_utf8(ROOT.join("_data/zoology-practical-museum-figures.json")))
  items = Array(figures["figures"])
  status_counts = items.group_by { |x| x["visual_status"] }.transform_values(&:length)
  need(errors, items.length == 48, "Museum figure manifest must retain 48 entries")
  need(errors, status_counts["verified-image"] == 15, "Museum verified-image count must remain 15")
  need(errors, status_counts["pending-verified-image"] == 33, "Museum pending-verified-image count must remain 33")
  need(errors, items.count { |x| x["public_render"] == true } == 15, "Museum public_render true count must remain 15")
  need(errors, items.count { |x| x["public_render"] == false } == 33, "Museum public_render false count must remain 33")
rescue JSON::ParserError => e
  errors << "Museum figure manifest invalid: #{e.message}"
end

begin
  contract = JSON.parse(read_utf8(ROOT.join("_data/academic/course_contract_v1.json")))
  course = Array(contract["pathways"]).find { |x| x["course_id"] == "nu-zoology-practical-213106" }
  need(errors, !course.nil?, "Governed Practical course missing")
  if course
    need(errors, course["enforcement"] == "strict", "Governed Practical course must remain strict")
    modules = Array(course["modules"])
    need(errors, modules.map { |m| m["module_id"] } == (1..8).map { |n| format("prac-%02d", n) },
         "Governed Practical module IDs/order drift")
    museum_module = modules.first
    need(errors, museum_module["source_file"] == SOURCE_REL, "prac-01 course-contract source drift")
    need(errors, museum_module["route"] == "/biology/higher-zoology-tree/practical/museum-specimens/",
         "prac-01 course-contract route drift")
  end
rescue JSON::ParserError => e
  errors << "Course contract invalid: #{e.message}"
end

begin
  ledger = JSON.parse(read_utf8(LEDGER))
  row = Array(ledger["routes"]).find { |r| r["id"] == "higher-zoology-practical-museum-specimens" }
  need(errors, !row.nil?, "Academic Route Ledger missing prac-01 Museum route")
  if row
    need(errors, row["canonical_route"] == "/biology/higher-zoology-tree/practical/museum-specimens/", "Museum ledger route drift")
    need(errors, row["source_file"] == SOURCE_REL, "Museum ledger source drift")
    need(errors, row["academic_role"] == "practical", "Museum ledger role drift")
    need(errors, row["language"] == "bn", "Museum ledger language drift")
    need(errors, row["boundary_owner"] == "layout", "Museum boundary owner drift")
    need(errors, row["learning_guide_owner"] == "canonical", "Museum Learning Guide owner drift")
    need(errors, row["enforcement"] == "strict", "Museum ledger enforcement must be strict")
    need(errors, Array(row["source_debt"]).empty?, "Museum strict route must have zero source debt")
    need(errors, Array(row["live_debt"]).empty?, "Museum strict route must have zero live debt")
  end
rescue JSON::ParserError => e
  errors << "Academic Route Ledger invalid: #{e.message}"
end

begin
  manifest = JSON.parse(read_utf8(MANIFEST))
  need(errors, manifest["schema"] == "lbfl-conv04f-zoology-practical-museum-v1", "F-09 manifest schema drift")
  need(errors, manifest["version"] == "CONV-04F-09-1.0.0", "F-09 manifest version drift")
  need(errors, manifest["phase"] == PHASE, "F-09 manifest phase drift")
  need(errors, manifest["authorized_base"] == BASE, "F-09 manifest base drift")
  need(errors, manifest["baseline_blob_sha"] == "26e1711cf9c6bace8ddd8419797c38511987420c", "F-09 learner baseline blob drift")
  need(errors, manifest["scientific_content_rewrite"] == false, "F-09 scientific rewrite must remain false")
  need(errors, manifest["curriculum_rewrite"] == false, "F-09 curriculum rewrite must remain false")
  need(errors, manifest.dig("curriculum_coverage", "covered_unique_labels") == 48, "F-09 manifest coverage drift")
  need(errors, manifest.dig("image_custody", "verified_image") == 15, "F-09 manifest verified-image drift")
  need(errors, manifest.dig("image_custody", "pending_verified_image") == 33, "F-09 manifest pending-image drift")
  need(errors, manifest["nomenclature_flags"] == NOMENCLATURE_FLAGS, "F-09 manifest nomenclature flags drift")
rescue JSON::ParserError => e
  errors << "F-09 manifest invalid: #{e.message}"
end

state = STATE.file? ? read_utf8(STATE) : ""
need(errors, state.include?("programme: CONV-04"), "CONV-04 programme identity missing")
need(errors, state.include?("phase: #{PHASE}"), "F-09 state phase mismatch")
need(errors, state.include?("authorized_base: #{BASE}"), "F-09 state base mismatch")
need(errors, state.include?("production_verified_main: #{BASE}"), "F-09 production baseline mismatch")
need(errors, top_level_list(state, "learner_mutation_allowlist") == [SOURCE_REL],
     "F-09 learner mutation allowlist must contain exactly prac-01")

auth = AUTH.file? ? read_utf8(AUTH) : ""
need(errors, auth.include?(BASE), "F-09 authorization base missing")
need(errors, auth.include?("26e1711cf9c6bace8ddd8419797c38511987420c"), "F-09 learner blob authority missing")
need(errors, auth.include?("Scientific/curriculum rewrite authority remains **NONE**."), "F-09 no-rewrite boundary missing")

comparison_base = ENV["PR_BASE_SHA"].to_s.strip
mode = ENV.fetch("CERTIFICATION_MODE", "local")
if comparison_base.empty? && mode == "manual"
  comparison_base = state[/^authorized_base:\s*(\S+)/, 1].to_s.strip
end

unless comparison_base.empty?
  need(errors, comparison_base == BASE, "F-09 comparison base drift: #{comparison_base}")
  out, err, st = git("diff", "--name-only", "#{comparison_base}...HEAD")
  if st.success?
    changed = out.lines.map(&:strip).reject(&:empty?).sort
    need(errors, changed == AUTHORIZED_FILES, "F-09 changed-file scope mismatch: #{changed}")
  else
    errors << "Unable to inspect F-09 changed-file scope: #{err.strip}"
  end
end

if errors.empty?
  puts "CONV-04F-09 Zoology Practical-I Museum Specimens convergence: PASS"
  exit 0
end

warn "CONV-04F-09 Zoology Practical-I Museum Specimens convergence: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
