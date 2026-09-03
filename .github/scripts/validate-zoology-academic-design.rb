#!/usr/bin/env ruby
# frozen_string_literal: true

require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
SITE = ROOT.join("_site")


def fail!(message)
  warn "ZOOLOGY CERTIFICATION FAIL: #{message}"
  exit 1
end


def read(path)
  File.read(ROOT.join(path), encoding: "UTF-8")
end

hsc_gateway = read("_biology/hsc-corner/zoology/index.md")
lecture_02 = read("_biology/hsc-corner/zoology/digestive-system/lecture-02-oral-cavity-saliva-teeth.md")
custom_head = read("_includes/head/custom.html")
single_layout = read("_layouts/single.html")
cycle = read("_includes/zoology/learning-cycle.html")
css = read("assets/css/zoology-academic.css")
ai_shell = read("_includes/body/synaptic-ai.html")

fail!("HSC Zoology gateway does not expose the Digestive System course") unless
  hsc_gateway.include?("/biology/hsc-corner/zoology/digestive-system/")

# Reject composition statements that positively place maltase in saliva, while
# allowing an explicit misconception correction such as "Maltase saliva-এর enzyme নয়".
bad_saliva_patterns = [
  /Saliva-তে [^.\n]*(?:maltase|মল্টেজ)[^.\n]*(?:থাকে|contains)/i,
  /লালা(?:য়|তে|র)[^.\n]*মল্টেজ[^.\n]*(?:থাকে|এনজাইম)/i
]
bad_saliva_patterns.each do |pattern|
  fail!("Lecture 02 still places maltase in saliva: #{pattern.inspect}") if lecture_02.match?(pattern)
end

lectures = Dir.glob(ROOT.join("_biology/hsc-corner/zoology/digestive-system/lecture-*.md").to_s).sort
fail!("Expected 14 HSC Digestive lectures, found #{lectures.length}") unless lectures.length == 14

fail!("Zoology stylesheet is not route-scoped from head/custom.html") unless
  custom_head.include?("/biology/hsc-corner/zoology/") &&
  custom_head.include?("/biology/higher-zoology-tree/") &&
  custom_head.include?("/assets/css/zoology-academic.css")

fail!("Zoology learning cycle is not injected by the single layout") unless
  single_layout.include?("zoology/learning-cycle.html")

fail!("Legacy digestion correction guard is missing") unless
  single_layout.include?("টায়ালিন (salivary amylase)") &&
  single_layout.include?("যান্ত্রিক প্রক্রিয়া ও নির্দিষ্ট পরিপাক এনজাইমের ক্রিয়ায়")

fail!("Learner-facing Source Processing Note guard is missing") unless
  single_layout.include?("source-processing-note")

fail!("LOLO/LALA contract is incomplete") unless
  cycle.include?("Objective") && cycle.include?("Outcome") &&
  cycle.include?("Activity") && cycle.include?("Application")

fail!("Responsive Zoology cycle contract is missing") unless
  css.include?(".lbfl-zoology-cycle__steps") && css.include?("prefers-reduced-motion")

fail!("Learner-facing AI reset label was not refined") if ai_shell.include?("Clear Console")
fail!("Expected learner-facing Reset inquiry label is missing") unless ai_shell.include?("Reset inquiry")

unless SITE.directory?
  puts "ZOOLOGY_SOURCE_CONTRACT_PASS (render checks skipped: _site absent)"
  exit 0
end

html_files = []
[
  SITE.join("biology/hsc-corner/zoology"),
  SITE.join("biology/higher-zoology-tree")
].each do |root|
  next unless root.directory?
  html_files.concat(Dir.glob(root.join("**/*.html").to_s))
end

fail!("No rendered Zoology HTML was found") if html_files.empty?

forbidden_rendered = [
  "Source Processing Note",
  "Respiratory.docx",
  "স্যানিটাইজড প্রোডাকশন লেকচার নোড",
  "Clear Console",
  "নির্দিষ্ট এনজাইম এবং হরমোনের উপস্থিতিতে",
  "টায়ালিন</strong> ও <strong>মল্টেজ</strong> এনজাইম"
]

page_count = 0
html_files.each do |path|
  html = File.read(path, encoding: "UTF-8")

  # Compatibility redirects and other layout:null artifacts can live under a
  # historical Zoology pathname. The academic design contract applies to
  # rendered learner-content pages, identified by the standard page shell.
  next unless html.include?("class=\"page\"") && html.include?("class=\"page__content\"")

  page_count += 1
  fail!("Missing Zoology stylesheet in #{path}") unless html.include?("/assets/css/zoology-academic.css")
  fail!("Missing LOLO/LALA learning cycle in #{path}") unless html.include?("data-zoology-learning-cycle")

  forbidden_rendered.each do |needle|
    fail!("Learner-facing residue '#{needle}' remains in #{path}") if html.include?(needle)
  end
end

fail!("No rendered single-layout Zoology pages were certified") if page_count.zero?

lectures.each do |source_path|
  source = File.read(source_path, encoding: "UTF-8")
  permalink_line = source.each_line.find { |line| line.start_with?("permalink:") }
  fail!("Missing permalink in #{source_path}") unless permalink_line
  permalink = permalink_line.split(":", 2).last.strip
  rendered = SITE.join(permalink.sub(%r{\A/}, ""), "index.html")
  fail!("Digestive lecture did not render: #{permalink}") unless rendered.file?
end

puts "ZOOLOGY_ACADEMIC_DESIGN_PASS pages=#{page_count} digestive_lectures=#{lectures.length}"
