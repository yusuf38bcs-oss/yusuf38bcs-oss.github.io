#!/usr/bin/env ruby
# frozen_string_literal: true

require "yaml"
require "date"
require "pathname"
require "set"

ROOT = Pathname.new(__dir__).join("../..").expand_path
ECOLOGY = ROOT.join("_biology/higher-zoology-tree/ecology")
SITE = ROOT.join("_site")
ECOLOGY_SITEMAP = ROOT.join("ecology-sitemap.xml")
ROBOTS = ROOT.join("robots.txt")
BIOLOGY_HUB = ROOT.join("_pages/hubs/biology.md")
COURSE_ID = "ecology-29"
EXPECTED = 29
BENGALI = /[\u0980-\u09FF]/
FORBIDDEN = ["Source Processing Note", "Uploaded source:", "Clear Console", "javascript:void(0)"]
ANCHORS = {
  "01" => "/biology/higher-zoology-tree/ecology/ecology-history-scopes-area/",
  "06" => "/biology/higher-zoology-tree/ecology/population-ecology-a-science-of-life-motion-of-a-species/",
  "07" => "/biology/higher-zoology-tree/ecology/population-ecology-concept-on-size-of-population/",
  "10" => "/biology/higher-zoology-tree/ecology/survivorship-curve-life-table-growth-models/",
  "13" => "/biology/higher-zoology-tree/ecology/community-ecology-an-equation-of-living-together/"
}.freeze


def fail!(message)
  warn "ECOLOGY 29-ROUTE CERTIFICATION FAIL: #{message}"
  exit 1
end

def parse_front_matter(path)
  text = File.read(path, encoding: "UTF-8")
  match = text.match(/\A---\s*\n(.*?)\n---\s*\n/m)
  fail!("missing YAML front matter: #{path}") unless match
  data = YAML.safe_load(match[1], permitted_classes: [Time, Date], aliases: true) || {}
  [data, text, text[match.end(0)..] || ""]
rescue Psych::SyntaxError => e
  fail!("invalid YAML in #{path}: #{e.message}")
end

def rendered_path(permalink)
  SITE.join(permalink.sub(%r{\A/}, ""), "index.html")
end

def page_content(html)
  match = html.match(/<section class="page__content"[^>]*>(.*?)<\/section>/m)
  match ? match[1] : nil
end

fail!("Ecology source directory missing") unless ECOLOGY.directory?

records = []
Dir.glob(ECOLOGY.join("*.md").to_s).sort.each do |path|
  fm, text, body = parse_front_matter(path)
  next unless fm["course_id"] == COURSE_ID && fm["course_role"] == "lecture"
  records << { path: Pathname.new(path), fm: fm, text: text, body: body }
end

fail!("EXPECTED_LECTURES=#{EXPECTED} DISCOVERED_LECTURES=#{records.length}") unless records.length == EXPECTED

numbers = records.map { |r| r[:fm]["lecture_number"].to_s }
expected_numbers = (1..EXPECTED).map { |n| format("%02d", n) }
fail!("lecture numbers must be exactly 01-29") unless numbers.sort == expected_numbers
fail!("duplicate lecture numbers") unless numbers.uniq.length == numbers.length

node_ids = records.map { |r| r[:fm]["node_id"].to_s }
permalinks = records.map { |r| r[:fm]["permalink"].to_s }
fail!("missing node_id") if node_ids.any?(&:empty?)
fail!("duplicate node_id") unless node_ids.uniq.length == node_ids.length
fail!("missing permalink") if permalinks.any?(&:empty?)
fail!("duplicate permalink") unless permalinks.uniq.length == permalinks.length

records.each do |r|
  fm = r[:fm]
  body = r[:body]
  num = fm["lecture_number"].to_s
  %w[title excerpt description].each { |key| fail!("#{r[:path]} missing #{key}") if fm[key].to_s.strip.empty? }
  fail!("#{r[:path]} status is not Active") unless fm["status"] == "Active"
  fail!("#{r[:path]} language must be en") unless fm["language"] == "en" && fm["lang"] == "en"
  fail!("#{r[:path]} contains published:false") if fm["published"] == false || r[:text].match?(/^published:\s*false\s*$/i)
  fail!("#{r[:path]} contains Bengali codepoints") if r[:text].match?(BENGALI)
  fail!("#{r[:path]} must contain exactly one Markdown H1") unless body.scan(/^# (?!#)/).length == 1
  fail!("#{r[:path]} missing References section") unless body.include?("## References")
  FORBIDDEN.each { |needle| fail!("#{r[:path]} contains forbidden '#{needle}'") if r[:text].include?(needle) }
  fail!("#{r[:path]} contains TODO/DRAFT/PLACEHOLDER residue") if body.match?(/\b(?:TODO|DRAFT|PLACEHOLDER)\b/i)

  # Ecology P1 lecture-only presentation contract.
  fail!("#{r[:path]} must not embed the global educational framework panel") if body.include?("education/framework-links.html")
  fail!("#{r[:path]} retains LOLO/LALA branding") if body.match?(/\b(?:LOLO|LALA)\b/)
  has_tex = (body.include?("\\[") && body.include?("\\]")) || (body.include?("\\(") && body.include?("\\)"))
  fail!("#{r[:path]} contains TeX but is missing math:true") if has_tex && fm["math"] != true
  fail!("#{r[:path]} declares math:true without TeX delimiters") if fm["math"] == true && !has_tex

  # All local assets referenced directly by the course must exist at the exact head.
  r[:text].scan(%r{(?:src=|href=|overlay_image:\s*)["']?(/assets/[^"'\s)]+)}).flatten.each do |asset|
    asset_path = ROOT.join(asset.sub(%r{\A/}, ""))
    fail!("missing local resource #{asset} referenced by #{r[:path]}") unless asset_path.file?
  end

  expected_prev = num == "01" ? nil : records.find { |x| x[:fm]["lecture_number"].to_s == format("%02d", num.to_i - 1) }&.dig(:fm, "permalink")
  expected_next = num == "29" ? nil : records.find { |x| x[:fm]["lecture_number"].to_s == format("%02d", num.to_i + 1) }&.dig(:fm, "permalink")
  links = Array(fm["synaptic_links"])
  fail!("#{r[:path]} missing course-index navigation") unless links.include?("/biology/higher-zoology-tree/ecology/course-index/")
  fail!("#{r[:path]} missing previous lecture link") if expected_prev && !links.include?(expected_prev)
  fail!("#{r[:path]} missing next lecture link") if expected_next && !links.include?(expected_next)
  fail!("Lecture 01 must not expose a previous lecture") if num == "01" && links.any? { |x| x == records.find { |z| z[:fm]["lecture_number"].to_s == "00" }&.dig(:fm, "permalink") }
end

ANCHORS.each do |num, route|
  rec = records.find { |r| r[:fm]["lecture_number"].to_s == num }
  fail!("anchor lecture #{num} missing") unless rec
  fail!("anchor route changed for lecture #{num}: #{rec[:fm]["permalink"]}") unless rec[:fm]["permalink"] == route
end

# Gateway identity.
gateway_fm, gateway_text, = parse_front_matter(ECOLOGY.join("index.md"))
fail!("gateway permalink changed") unless gateway_fm["permalink"] == "/biology/higher-zoology-tree/ecology/"
fail!("gateway node_id changed") unless gateway_fm["node_id"] == "node-ecology"
fail!("gateway parent_node changed") unless gateway_fm["parent_node"] == "index-higher-zoology-tree"
fail!("gateway language changed") unless gateway_fm["language"] == "en"
fail!("gateway does not link course index") unless gateway_text.include?("/biology/higher-zoology-tree/ecology/course-index/")

# Course index identity and exact route coverage.
index_path = ECOLOGY.join("course-index.md")
fail!("course-index.md missing") unless index_path.file?
index_fm, index_text, = parse_front_matter(index_path)
fail!("course index permalink changed") unless index_fm["permalink"] == "/biology/higher-zoology-tree/ecology/course-index/"
row_routes = index_text.scan(/\[Open\]\(\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}\)/).flatten
fail!("COURSE_INDEX_ROWS expected 29 found #{row_routes.length}") unless row_routes.length == EXPECTED
fail!("course index routes must be unique") unless row_routes.uniq.length == EXPECTED
fail!("course index does not exactly match canonical lecture routes") unless row_routes.to_set == permalinks.to_set


# search-discovery source checks
fail!("ecology-sitemap.xml missing") unless ECOLOGY_SITEMAP.file?
ecology_sitemap_source = File.read(ECOLOGY_SITEMAP, encoding: "UTF-8")
fail!("Ecology sitemap does not enumerate the ecology-29 collection") unless ecology_sitemap_source.include?('where: "course_id", "ecology-29"')
fail!("Ecology sitemap must derive lecture lastmod from per-lecture metadata") unless ecology_sitemap_source.include?("lecture.last_modified_at")
lecture_loop = ecology_sitemap_source[/\{% for lecture in ecology_lectures %\}(.*?)\{% endfor %\}/m, 1].to_s
fail!("Ecology sitemap hard-codes lecture lastmod values") if lecture_loop.match?(/<lastmod>\s*20\d\d-/)
robots_source = File.read(ROBOTS, encoding: "UTF-8")
fail!("robots.txt does not advertise the Ecology sitemap") unless robots_source.include?("https://learningbiologyforlife.org/ecology-sitemap.xml")
biology_hub_source = File.read(BIOLOGY_HUB, encoding: "UTF-8")
fail!("Biology hub does not link the Ecology course index") unless biology_hub_source.include?("/biology/higher-zoology-tree/ecology/course-index/")

puts "ECOLOGY_29_SOURCE_PASS"
puts "lectures=#{records.length}"
puts "course_index_rows=#{row_routes.length}"
puts "anchor_routes=#{ANCHORS.length}"
puts "english_lectures=#{records.count { |r| r[:fm]["language"] == "en" }}"
puts "bengali_codepoints=0"
puts "duplicate_permalinks=0"
puts "duplicate_node_ids=0"
puts "broken_navigation=0"

unless SITE.directory?
  puts "ECOLOGY_29_SOURCE_ONLY_PASS (render checks skipped: _site absent)"
  exit 0
end

records.each do |r|
  route = r[:fm]["permalink"]
  rendered = rendered_path(route)
  fail!("missing rendered lecture #{route}") unless rendered.file?
  html = File.read(rendered, encoding: "UTF-8")
  content = page_content(html)
  fail!("missing page__content for #{route}") unless content
  fail!("#{route} rendered H1 count is #{html.scan(/<h1\b/i).length}, expected 1") unless html.scan(/<h1\b/i).length == 1
  fail!("#{route} missing Zoology stylesheet") unless html.include?("/assets/css/zoology-academic.css")
  fail!("#{route} must not render the shared LOLO/LALA learning cycle") if html.include?("data-zoology-learning-cycle")
  fail!("#{route} must not render the global educational framework panel") if html.include?("lbfl-framework-links")
  fail!("#{route} still renders LOLO/LALA branding") if content.match?(/\b(?:LOLO|LALA)\b/)
  if r[:fm]["math"] == true
    fail!("#{route} math page is missing the conditional MathJax loader") unless html.include?("MathJax-script")
  end
  fail!("#{route} rendered learner content contains Bengali codepoints") if content.match?(BENGALI)
  FORBIDDEN.each { |needle| fail!("#{route} rendered forbidden '#{needle}'") if content.include?(needle) }
end

index_rendered = rendered_path(index_fm["permalink"])
fail!("course index did not render") unless index_rendered.file?
gateway_rendered = rendered_path(gateway_fm["permalink"])
fail!("gateway did not render") unless gateway_rendered.file?


ecology_sitemap_rendered = SITE.join("ecology-sitemap.xml")
fail!("Ecology sitemap did not render") unless ecology_sitemap_rendered.file?
ecology_sitemap_xml = File.read(ecology_sitemap_rendered, encoding: "UTF-8")
expected_discovery_routes = [gateway_fm["permalink"], index_fm["permalink"], *permalinks]
expected_discovery_urls = expected_discovery_routes.map { |route| "https://learningbiologyforlife.org#{route}" }
missing_discovery_urls = expected_discovery_urls.reject { |url| ecology_sitemap_xml.include?(url) }
fail!("Ecology sitemap missing URLs: #{missing_discovery_urls.join(", ")}") unless missing_discovery_urls.empty?

rendered_robots = SITE.join("robots.txt")
fail!("rendered robots.txt missing") unless rendered_robots.file?
fail!("rendered robots.txt does not advertise Ecology sitemap") unless File.read(rendered_robots, encoding: "UTF-8").include?("https://learningbiologyforlife.org/ecology-sitemap.xml")

puts "ECOLOGY_29_DISCOVERY_PASS"
puts "ecology_sitemap_urls=#{expected_discovery_urls.length}"

puts "ECOLOGY_29_RENDER_PASS"
puts "rendered_lectures=#{records.length}"
puts "missing_routes=0"
puts "ECOLOGY_29_EXACT_HEAD_PASS"