#!/usr/bin/env ruby
require "yaml"
manifest_path = File.join(__dir__, "../../_data/animal-diversity-10.yml")
abort "FAIL: missing Animal Diversity manifest" unless File.exist?(manifest_path)
manifest = YAML.load_file(manifest_path)
errors = []
errors << "course_id must be animal-diversity-10" unless manifest["course_id"] == "animal-diversity-10"
slots = manifest["lecture_slots"] || []
errors << "expected exactly 10 lecture slots" unless slots.size == 10
errors << "lecture numbers must be 01-10" unless slots.map { |s| s["lecture_number"] } == (1..10).map { |n| "%02d" % n }
errors << "page_id values must be unique" unless slots.map { |s| s["page_id"] }.uniq.size == slots.size
errors << "slug values must be unique" unless slots.map { |s| s["slug"] }.uniq.size == slots.size
imported = slots.count { |s| ["IMPORTED_CERTIFICATION_PENDING","CERTIFIED"].include?(s["status"]) }
errors << "content import incomplete: #{imported}/10 lecture slots imported" unless imported == 10
gateway = "_biology/higher-zoology-tree/animal-diversity/index.md"
errors << "missing gateway" unless File.exist?(gateway)
if File.exist?(gateway)
  g = File.read(gateway)
  errors << "gateway still contains 17-lecture terminology" if g.match?(/17[- ]lecture/i)
  errors << "gateway still contains Complete Matrix terminology" if g.match?(/Complete Matrix/i)
  errors << "gateway still contains LOLO/LALA" if g.match?(/LOLO|LALA/i)
end
if errors.any?
  warn errors.map { |e| "FAIL: #{e}" }.join("\n")
  exit 1
end
puts "PASS: Animal Diversity 10 exact-head source contract"
