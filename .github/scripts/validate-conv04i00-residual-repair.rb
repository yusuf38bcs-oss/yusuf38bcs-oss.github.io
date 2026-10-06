#!/usr/bin/env ruby
# frozen_string_literal: true

ROOT = File.expand_path("../..", __dir__)
BASE = "69283ada5df7a294a2ce8986cef089ef9fdcf161"
errors = []

def read(root, path)
  File.read(File.join(root, path), encoding: "UTF-8")
end

component = read(ROOT, "_includes/components/personality-analysis.html")
errors << "personality component must load personality-engine.js exactly once" unless component.scan("assets/js/learning/personality-engine.js").length == 1

layout = read(ROOT, "_layouts/single.html")
errors << "single layout missing reflection owner guard" unless layout.include?("lbfl_reflection_boundary_owned") && layout.include?("{% unless lbfl_reflection_boundary_owned %}")

reflection_pages = %w[
  _pages/hubs/socratic.md
  _pages/socratic-multiple-intelligences.md
  _pages/tools/mi-analysis.md
  _socratic/personality-archetypes.md
]
reflection_pages.each do |path|
  text = read(ROOT, path)
  errors << "#{path} must bind component-owned reflection boundary" unless text.include?("reflection_boundary_owner: component")
  errors << "#{path} must render the shared reflection boundary once" unless text.scan("{% include socratic/reflection-boundary.html %}").length == 1
end

frequency = read(ROOT, "_biology/higher-zoology-tree/biostatistics/frequency_distribution_histogram_and_polygon.md")
errors << "frequency module dark canvas missing" unless frequency.include?("color: #cbd5e1; background: #0f172a;")

%w[
  _biology/higher-zoology-tree/biostatistics/correlation_and_regression.md
  _biology/higher-zoology-tree/biostatistics/hypothesis_testing.md
].each do |path|
  text = read(ROOT, path)
  errors << "#{path} retains transparent light-shell intro" if text.include?("background: rgba(255,255,255,0.02); border-left: 4px solid #64748b;")
  errors << "#{path} dark intro repair missing" unless text.include?("background: #0f172a; border-left: 4px solid #64748b;")
end

nav = read(ROOT, "_data/navigation.yml")
errors << "global navigation still targets legacy Socratic assessment" if nav.include?('url: "/socratic-4/socratic-assessment/"')
errors << "global navigation missing canonical MI reflection" unless nav.include?('url: "/socratic/multiple-intelligences/"')

behaviour = read(ROOT, "_biology/higher-zoology-tree/human-behaviour/index.md")
errors << "Human Behaviour still targets legacy Socratic assessment" if behaviour.include?("'/socratic-4/socratic-assessment/'")
errors << "Human Behaviour missing canonical MI reflection" unless behaviour.include?("'/socratic/multiple-intelligences/'")

ledger = read(ROOT, "docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
errors << "route ledger lost canonical MI reflection ownership" unless ledger.include?('"canonical_route": "/socratic/multiple-intelligences/"')

if system("git rev-parse --is-inside-work-tree >/dev/null 2>&1")
  changed = IO.popen(["git", "diff", "--name-only", "#{BASE}...HEAD"], &:read).lines.map(&:strip).reject(&:empty?)
  allowed = %w[
    _includes/components/personality-analysis.html
    _layouts/single.html
    _pages/hubs/socratic.md
    _pages/socratic-multiple-intelligences.md
    _pages/tools/mi-analysis.md
    _socratic/personality-archetypes.md
    _biology/higher-zoology-tree/biostatistics/frequency_distribution_histogram_and_polygon.md
    _biology/higher-zoology-tree/biostatistics/correlation_and_regression.md
    _biology/higher-zoology-tree/biostatistics/hypothesis_testing.md
    _data/navigation.yml
    _biology/higher-zoology-tree/human-behaviour/index.md
    docs/academic/conv04/CONV04_I00_RESIDUAL_REPAIR.md
    docs/academic/conv04/CONV04_STATE.md
    .github/scripts/validate-conv04i00-residual-repair.rb
    .github/scripts/conv04i00-browser-certification.mjs
    .github/workflows/conv04i00-residual-repair-certification.yml
  ]
  unexpected = changed - allowed
  errors << "unexpected changed files: #{unexpected.join(', ')}" unless unexpected.empty?
end

if errors.empty?
  puts "CONV-04I-00 residual-repair validator: PASS"
  exit 0
end

warn "CONV-04I-00 residual-repair validator: FAIL"
errors.each { |error| warn "- #{error}" }
exit 1
