#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "9895c190f75d0d6b3167370a043181e9cc5c14ad"
PHASE = "CONV-04F-07"
BASE_SOURCE_REL = "_biology/higher-zoology-tree/physiology/human-blood-circulation-overview.md"
SOURCE_REL = "_biology/higher-zoology-tree/physiology/human-blood-circulation-overview.bn.md"
SOURCE = ROOT.join(SOURCE_REL)
MANIFEST = ROOT.join("_data/academic/conv04f_blood_circulation_revision_v1.json")
LEDGER = ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
AUTH_DOC = ROOT.join("docs/academic/conv04/BLOOD_CIRCULATION_REVISION_F07_AUTHORIZATION.md")
BROWSER = ROOT.join(".github/scripts/conv04f-blood-circulation-revision-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/conv04f-blood-circulation-revision-certification.yml")
CTA = "{% include education/learning-guide-cta.html %}"

BOOTSTRAP_FILES = %w[
  .github/scripts/conv04f-blood-circulation-revision-browser-certification.mjs
  .github/scripts/validate-conv04f-blood-circulation-revision.rb
  .github/workflows/conv04f-blood-circulation-revision-certification.yml
  _biology/higher-zoology-tree/physiology/human-blood-circulation-overview.bn.md
  _data/academic/conv04f_blood_circulation_revision_v1.json
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/BLOOD_CIRCULATION_REVISION_F07_AUTHORIZATION.md
  docs/academic/conv04/CONV04_STATE.md
].sort.freeze

IMMUTABLE_F07 = %w[
  .github/scripts/conv04f-blood-circulation-revision-browser-certification.mjs
  .github/scripts/validate-conv04f-blood-circulation-revision.rb
  .github/workflows/conv04f-blood-circulation-revision-certification.yml
  _biology/higher-zoology-tree/physiology/human-blood-circulation-overview.bn.md
  _biology/higher-zoology-tree/physiology/human-blood-circulation-overview.md
  _data/academic/conv04f_blood_circulation_revision_v1.json
  docs/academic/conv04/BLOOD_CIRCULATION_REVISION_F07_AUTHORIZATION.md
].freeze

EXPECTED_STUDY_ROUTES = %w[
  /biology/higher-zoology-tree/physiology/blood-circulation/
  /biology/higher-zoology-tree/physiology/blood-corpuscles-transport-immunity/
  /biology/higher-zoology-tree/physiology/heart-structure-cardiac-cycle-circulation/
  /biology/higher-zoology-tree/physiology/circulatory-diseases-causes-symptoms-treatment-awareness/
  /biology/higher-zoology-tree/physiology/cardiac-surgery-bypass-angioplasty-open-heart-treatment/
  /biology/higher-zoology-tree/physiology/cardiovascular-health-lifestyle-learning-application/
].freeze

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
  if value.length >= 2 &&
     ((value.start_with?('"') && value.end_with?('"')) ||
      (value.start_with?("'") && value.end_with?("'")))
    value = value[1..-2]
  end
  value
end

def phase_order(value)
  m = /\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.match(value.to_s.strip)
  m ? [m[1].ord, (m[2] || "0").to_i, (m[3] || "0").to_i] : nil
end

def authorized_transform(source)
  out = source.dup
  out = out.sub(
    "language: bn\ncurriculum_tracks:",
    "language: bn\nlang: bn\nacademic_system: v1\nacademic_role: revision\nlearning_guide: canonical\ncurriculum_tracks:"
  )
  out = out.sub(
    "# Blood Circulation Revision Map: রক্ত, হৃদপিণ্ড, সঞ্চালন ও রোগ এক পাতায়\n\n",
    "# Blood Circulation Revision Map: রক্ত, হৃদপিণ্ড, সঞ্চালন ও রোগ এক পাতায়\n\n{% include education/learning-guide-cta.html %}\n\n"
  )
  out
end

[SOURCE, MANIFEST, LEDGER, STATE, AUTH_DOC, BROWSER, WORKFLOW].each do |path|
  errors << "Missing F-07 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

if SOURCE.file?
  baseline, _, status = git("show", "#{BASE}:#{BASE_SOURCE_REL}")
  if status.success?
    candidate = read_utf8(SOURCE)
    need(errors, candidate == authorized_transform(baseline),
         "Blood Circulation revision differs from the exact authorized transformation")
    need(errors, fm_value(candidate, "permalink") == "/biology/higher-zoology-tree/physiology/human-blood-circulation-overview/", "F-07 permalink drift")
    need(errors, fm_value(candidate, "academic_system") == "v1", "F-07 academic_system must be v1")
    need(errors, fm_value(candidate, "academic_role") == "revision", "F-07 role must be revision")
    need(errors, fm_value(candidate, "lang") == "bn", "F-07 lang must be bn")
    need(errors, fm_value(candidate, "language") == "bn", "F-07 legacy language must remain bn")
    need(errors, fm_value(candidate, "learning_guide") == "canonical", "F-07 canonical Learning Guide ownership missing")
    need(errors, candidate.scan(CTA).length == 1, "F-07 must contain exactly one canonical Learning Guide CTA")
    need(errors, candidate.include?("overlay_image: /assets/images/biology/physiology-banner.webp"), "F-07 must preserve header overlay metadata")
    %w[
      Purpose\ of\ This\ Revision\ Map
      Study\ Route
      Master\ Mind\ Map
      Blood\ Flow\ One-page\ Diagram
      Impulse\ Flow\ One-page\ Diagram
      High-yield\ Comparison\ Table
      Quick\ Short-answer\ Bank
      MCQ\ Validity\ Logic\ Template
      Synaptic\ Bridge
      References
    ].each do |escaped|
      needle = escaped.gsub("\\ ", " ")
      need(errors, candidate.include?(needle), "F-07 retained section missing: #{needle}")
    end
    positions = EXPECTED_STUDY_ROUTES.map { |r| candidate.index(r) }
    need(errors, positions.none?(&:nil?), "F-07 one or more six study routes missing")
    need(errors, positions.compact == positions.compact.sort, "F-07 study-route order drift")
  else
    errors << "Unable to authenticate F-07 baseline source"
  end
end

if MANIFEST.file?
  begin
    m = JSON.parse(read_utf8(MANIFEST))
    need(errors, m["schema"] == "lbfl-conv04f-blood-circulation-revision-v1", "F-07 manifest schema drift")
    need(errors, m["version"] == "CONV-04F-07-1.0.0", "F-07 manifest version drift")
    need(errors, m["authorized_base"] == BASE, "F-07 manifest base drift")
    need(errors, m["baseline_blob_sha"] == "0eceb2542287fc99356b73dc400b3ede8a8db4f4", "F-07 baseline blob drift")
    need(errors, m["scientific_content_rewrite"] == false, "F-07 must forbid scientific rewrite")
    need(errors, m.dig("additions", "academic_role") == "revision", "F-07 manifest role drift")
  rescue JSON::ParserError => e
    errors << "F-07 manifest JSON invalid: #{e.message}"
  end
end

if LEDGER.file?
  begin
    ledger = JSON.parse(read_utf8(LEDGER))
    route = Array(ledger["routes"]).find { |r| r["id"] == "blood-circulation-revision" }
    need(errors, !route.nil?, "Academic Route Ledger missing blood-circulation-revision")
    if route
      need(errors, route["canonical_route"] == "/biology/higher-zoology-tree/physiology/human-blood-circulation-overview/", "F-07 ledger route drift")
      need(errors, route["source_file"] == SOURCE_REL, "F-07 ledger source drift")
      need(errors, route["academic_role"] == "revision", "F-07 ledger role drift")
      need(errors, route["language"] == "bn", "F-07 ledger language drift")
      need(errors, route["boundary_owner"] == "layout", "F-07 boundary owner drift")
      need(errors, route["learning_guide_owner"] == "canonical", "F-07 Learning Guide owner drift")
      need(errors, route["assessment_owner"] == "mcq-arena", "F-07 assessment owner drift")
      need(errors, route["enforcement"] == "strict", "F-07 route must be strict")
      need(errors, Array(route["source_debt"]).empty?, "F-07 source debt remains")
      need(errors, Array(route["live_debt"]).empty?, "F-07 live debt remains")
    end
  rescue JSON::ParserError => e
    errors << "Academic Route Ledger JSON invalid: #{e.message}"
  end
end

state = STATE.file? ? read_utf8(STATE) : ""
mode = ENV.fetch("CERTIFICATION_MODE", "local")
comparison_base = ENV["PR_BASE_SHA"].to_s.strip
bootstrap = mode == "pull_request" && comparison_base == BASE
future = mode == "pull_request" && !comparison_base.empty? && comparison_base != BASE

if STATE.file?
  phase = state[/^phase:\s*(\S+)/, 1]
  need(errors, state.include?("programme: CONV-04"), "CONV-04 programme identity missing")
  need(errors, !phase_order(phase).nil?, "Malformed CONV-04 phase: #{phase}")
  if bootstrap
    need(errors, phase == PHASE, "F-07 bootstrap phase mismatch")
    need(errors, state.include?("authorized_base: #{BASE}"), "F-07 state base mismatch")
    need(errors, state.include?("production_verified_main: #{BASE}"), "F-07 production base missing")
    need(errors, state.include?("learner_mutation_allowlist:\n  - #{SOURCE_REL}"), "Exact F-07 learner authority missing")
  end
end

unless comparison_base.empty?
  stdout, stderr, status = git("diff", "--name-only", "#{comparison_base}...HEAD")
  if status.success?
    changed = stdout.lines.map(&:strip).reject(&:empty?).sort
    if bootstrap
      need(errors, changed == BOOTSTRAP_FILES, "F-07 bootstrap changed-file scope mismatch: #{changed}")
    elsif future
      touched = changed & IMMUTABLE_F07
      need(errors, touched.empty?, "Successor phase changed protected F-07 artifacts: #{touched.join(', ')}")
      if changed.include?("docs/academic/conv04/CONV04_STATE.md")
        base_state, _, bs = git("show", "#{comparison_base}:docs/academic/conv04/CONV04_STATE.md")
        if bs.success?
          bp = base_state[/^phase:\s*(\S+)/, 1]
          cp = state[/^phase:\s*(\S+)/, 1]
          bo = phase_order(bp)
          co = phase_order(cp)
          need(errors, bo && co && (co <=> bo) > 0, "Successor phase must advance CONV04_STATE beyond #{bp}")
        else
          errors << "Unable to authenticate successor base CONV04_STATE"
        end
      end
    end
  else
    errors << "Unable to inspect F-07 changed-file scope: #{stderr.strip}"
  end
end

if errors.empty?
  puts "CONV-04F-07 Blood Circulation revision convergence: PASS"
  exit 0
end

warn "CONV-04F-07 Blood Circulation revision convergence: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
