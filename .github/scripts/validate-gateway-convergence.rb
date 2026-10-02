#!/usr/bin/env ruby
# frozen_string_literal: true

require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "fd06e558c22decd32daa69373cdd6c236a1bbca4"
GATEWAY = ROOT.join("_biology/hsc-corner/zoology/index.md")
LAYOUT = ROOT.join("_layouts/single.html")
ZOO_VALIDATOR = ROOT.join(".github/scripts/validate-zoology-academic-design.rb")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
DOC = ROOT.join("docs/academic/conv04/GATEWAY_CONVERGENCE.md")
WORKFLOW = ROOT.join(".github/workflows/gateway-convergence-certification.yml")
ZOO_WORKFLOW = ROOT.join(".github/workflows/zoology-academic-design-certification.yml")
BROWSER = ROOT.join(".github/scripts/zoology-browser-certification.mjs")
SITE_ROUTE = ROOT.join("_site/biology/hsc-corner/zoology/index.html")

BOOTSTRAP_FILES = %w[
  .github/scripts/validate-gateway-convergence.rb
  .github/scripts/validate-zoology-academic-design.rb
  .github/scripts/zoology-browser-certification.mjs
  .github/workflows/gateway-convergence-certification.yml
  .github/workflows/zoology-academic-design-certification.yml
  _biology/hsc-corner/zoology/index.md
  _layouts/single.html
  docs/academic/conv04/CONV04_STATE.md
  docs/academic/conv04/GATEWAY_CONVERGENCE.md
].freeze

errors = []

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

[GATEWAY, LAYOUT, ZOO_VALIDATOR, STATE, DOC, WORKFLOW, ZOO_WORKFLOW, BROWSER].each do |path|
  errors << "Missing C-03 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

if GATEWAY.file?
  source = read_utf8(GATEWAY)
  errors << "HSC Zoology gateway must declare learning_guide: canonical" unless source.match?(/^learning_guide:\s*canonical\s*$/)
  errors << "HSC Zoology gateway must render canonical Learning Guide CTA" unless source.include?("{% include education/learning-guide-cta.html %}")
  errors << "HSC Zoology gateway still includes legacy framework panel" if source.include?("{% include education/framework-links.html %}")
  [
    "## Core Learning Route",
    "## Available Zoology Logs",
    "## Extended Zoology Pathways",
    "## Study Sequence",
    "## Responsible Learning Boundary",
    "## Connected Nodes",
    "Assessment readiness",
    "Return to the source lesson after any MCQ or model-test mistake."
  ].each do |needle|
    errors << "Topic-specific gateway content removed: #{needle}" unless source.include?(needle)
  end
end

if LAYOUT.file?
  source = read_utf8(LAYOUT)
  errors << "Single layout missing canonical learning-guide flag" unless source.include?("lbfl_canonical_learning_guide")
  errors << "Single layout missing canonical ownership data attribute" unless source.include?('data-lbfl-learning-guide="canonical"')
  errors << "Single layout does not suppress legacy cycle for canonical-guide routes" unless
    source.include?("lbfl_ecology_surface or lbfl_course_owned_surface or lbfl_canonical_learning_guide")
end

if ZOO_VALIDATOR.file?
  source = read_utf8(ZOO_VALIDATOR)
  errors << "Zoology validator does not recognize canonical-guide surfaces" unless source.include?("canonical_learning_guide_surface")
  errors << "Zoology validator does not guard /learn/ CTA" unless source.include?("does not link to /learn/")
  errors << "Zoology validator does not reject framework duplication" unless source.include?("still renders framework panel")
end

if BROWSER.file?
  source = read_utf8(BROWSER)
  errors << "Zoology browser validator does not detect canonical-guide ownership" unless source.include?("hasCanonicalLearningGuideShell")
  errors << "Zoology browser validator does not require exactly one Learning Guide CTA" unless source.include?("learningGuideCtaCount === 1")
  errors << "Zoology browser validator does not require /learn/ linkage" unless source.include?("hasLearningGuideLink === true")
  errors << "Zoology browser validator does not include canonical-guide routes in full-page Axe" unless source.include?("isCanonicalLearningGuideCandidate")
end

if ZOO_WORKFLOW.file?
  source = read_utf8(ZOO_WORKFLOW)
  errors << "Zoology browser workflow does not trigger on Learning Guide CTA changes" unless
    source.include?('"_includes/education/learning-guide-cta.html"')
end

certification_mode = ENV.fetch("CERTIFICATION_MODE", "local")
comparison_base = ENV["PR_BASE_SHA"].to_s.strip
if comparison_base.empty?
  parent_stdout, parent_status = Open3.capture2e("git", "-C", ROOT.to_s, "rev-parse", "HEAD^")
  comparison_base = parent_status.success? ? parent_stdout.strip : BASE
end
bootstrap_pr = certification_mode == "pull_request" && comparison_base == BASE

if STATE.file?
  state = read_utf8(STATE)
  if bootstrap_pr
    errors << "CONV04_STATE must identify phase CONV-04C-03" unless state.include?("phase: CONV-04C-03")
    errors << "CONV04_STATE must bind C-03 base" unless state.include?(BASE)
    errors << "Assessment ownership crossed into D" unless state.include?("assessment_ownership: unchanged / CONV-04D not started")
    errors << "Gateway pilot scope missing" unless state.include?("gateway_cta_injection: hsc-zoology-only")
    errors << "Exact learner mutation authority missing" unless state.include?("learner_mutation_allowlist:\n  - _biology/hsc-corner/zoology/index.md")
  else
    errors << "CONV-04 programme identity missing" unless state.include?("programme: CONV-04")
    phase_line = state.lines.find { |line| line.start_with?("phase:") }.to_s.strip
    errors << "CONV04_STATE must identify a valid CONV-04 phase" unless phase_line.match?(/\Aphase:\s+CONV-04[A-Z](?:-\d+)?(?:-[A-Z0-9]+)?\z/)
  end
end

if DOC.file?
  doc = read_utf8(DOC)
  errors << "Gateway convergence document missing pilot route" unless doc.include?("/biology/hsc-corner/zoology/")
  errors << "Gateway convergence document missing canonical destination" unless doc.include?("/learn/")
  errors << "Gateway convergence document must preserve Study Sequence" unless doc.include?("Study Sequence")
  errors << "Gateway convergence document must defer CONV-04D" unless doc.include?("CONV-04D")
end

if SITE_ROUTE.file?
  html = read_utf8(SITE_ROUTE)
  errors << "Rendered HSC Zoology route must expose canonical ownership" unless html.include?('data-lbfl-learning-guide="canonical"')
  errors << "Rendered HSC Zoology route must contain exactly one Learning Guide CTA" unless html.scan("lbfl-learning-guide-cta").length == 1
  errors << "Rendered HSC Zoology CTA must link to /learn/" unless html.match?(%r{href=["'][^"']*/learn/["']})
  errors << "Rendered HSC Zoology route still contains legacy framework panel" if html.include?("lbfl-framework-links")
  errors << "Rendered HSC Zoology route still contains injected LOLO/LALA cycle" if html.include?("data-zoology-learning-cycle")
  [
    "Core Learning Route",
    "Available Zoology Logs",
    "Extended Zoology Pathways",
    "Study Sequence",
    "Responsible Learning Boundary",
    "Connected Nodes"
  ].each do |needle|
    errors << "Rendered topic-specific section missing: #{needle}" unless html.include?(needle)
  end
end

stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
  if bootstrap_pr
    unexpected = changed - BOOTSTRAP_FILES.sort
    missing = BOOTSTRAP_FILES.sort - changed
    errors << "Unexpected C-03 changed files: #{unexpected.join(', ')}" unless unexpected.empty?
    errors << "Expected C-03 files not changed: #{missing.join(', ')}" unless missing.empty?
  end
else
  errors << "Unable to inspect C-03 changed-file scope: #{stdout.strip}"
end

if errors.empty?
  puts "CONV-04C-03 HSC Zoology gateway convergence: PASS"
  exit 0
end

warn "CONV-04C-03 HSC Zoology gateway convergence: FAIL"
errors.each { |error| warn "- #{error}" }
exit 1
