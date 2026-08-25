#!/usr/bin/env ruby
# frozen_string_literal: true

require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
SITE = ROOT.join("_site")

def fail!(message)
  warn "ZOOLOGY PREMIER REGRESSION FAIL: #{message}"
  exit 1
end

def read_repo(path)
  File.read(ROOT.join(path), encoding: "UTF-8")
end

css         = read_repo("assets/css/zoology-academic.css")
custom_head = read_repo("_includes/head/custom.html")
single      = read_repo("_layouts/single.html")
default     = read_repo("_layouts/default.html")

# A — Known forced dark heading regression must remain absent.
if css.include?("color: #153f3b !important;")
  fail!("legacy forced dark heading override remains")
end

unless css.include?("--zoo-heading-color")
  fail!("semantic Zoology heading token is missing")
end

# B — Canonical Animal Diversity must participate in routing.
[
  ["_includes/head/custom.html", custom_head],
  ["_layouts/single.html", single],
  ["_layouts/default.html", default]
].each do |path, text|
  unless text.include?("/biology/animal-diversity/")
    fail!("#{path} omits canonical Animal Diversity routing")
  end
end

# C — Publishing workflow/source-ingestion residue must not reach learner Markdown.
Dir.glob(ROOT.join("_biology/**/*.md").to_s).sort.each do |path|
  text = File.read(path, encoding: "UTF-8")

  if text.match?(/^\s*(?:[-*+]\s*)?Uploaded source\s*:/i)
    rel = Pathname.new(path).relative_path_from(ROOT)
    fail!("learner-facing Uploaded source residue in #{rel}")
  end

  if text.match?(/Source Processing Note/i)
    rel = Pathname.new(path).relative_path_from(ROOT)
    fail!("learner-facing source-processing note in #{rel}")
  end
end

# D — Foundational scope must be server-rendered, not activated by JavaScript.
if custom_head.include?(
  'document.documentElement.classList.add("lbfl-zoology-route")'
)
  fail!("Zoology scope still depends on JavaScript")
end

unless default.include?("lbfl_zoology_document") &&
       default.include?("lbfl-zoology-route")
  fail!("default document root lacks server-rendered Zoology scope")
end

unless SITE.directory?
  puts "ZOOLOGY_PREMIER_SOURCE_PASS"
  exit 0
end

route_roots = [
  SITE.join("biology/hsc-corner/zoology"),
  SITE.join("biology/higher-zoology-tree"),
  SITE.join("biology/animal-diversity")
]

route_roots.each do |root|
  next unless root.directory?

  pages = Dir.glob(root.join("**/*.html").to_s)
  fail!("no rendered pages under #{root}") if pages.empty?

  scoped = pages.any? do |path|
    html = File.read(path, encoding: "UTF-8")

    html.match?(
      /<html\b[^>]*class=["'][^"']*\blbfl-zoology-route\b[^"']*["']/i
    )
  end

  fail!("no server-scoped document found under #{root}") unless scoped

  pages.each do |path|
    html = File.read(path, encoding: "UTF-8")

    if html.match?(/Uploaded source\s*:/i)
      rel = Pathname.new(path).relative_path_from(SITE)
      fail!("rendered Uploaded source residue in #{rel}")
    end
  end
end

puts "ZOOLOGY_PREMIER_REGRESSION_PASS"