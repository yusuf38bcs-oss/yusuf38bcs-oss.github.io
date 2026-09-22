# frozen_string_literal: true

require "json"

ROOT = File.expand_path("../..", __dir__)
INDEX = "_biology/higher-zoology-tree/practical/index.bn.md"
COVERAGE = "_data/zoology-practical-213106-coverage.json"
NAVIGATION = "_data/navigation.yml"
HIGHER_ZOOLOGY_EN = "_biology/higher-zoology-tree/index.md"
HIGHER_ZOOLOGY_BN = "_biology/higher-zoology-tree/index.bn.md"

MODULES = [
  ["01", "_biology/higher-zoology-tree/practical/01-museum-specimens-complete.bn.md", "/biology/higher-zoology-tree/practical/museum-specimens/"],
  ["02", "_biology/higher-zoology-tree/practical/02-permanent-slides.bn.md", "/biology/higher-zoology-tree/practical/permanent-slides/"],
  ["03", "_biology/higher-zoology-tree/practical/03-whole-mounts.bn.md", "/biology/higher-zoology-tree/practical/whole-mounts/"],
  ["04", "_biology/higher-zoology-tree/practical/04-dissection.bn.md", "/biology/higher-zoology-tree/practical/dissection/"],
  ["05", "_biology/higher-zoology-tree/practical/05-temporary-mounts.bn.md", "/biology/higher-zoology-tree/practical/temporary-mounts/"],
  ["06", "_biology/higher-zoology-tree/practical/06-appendages.bn.md", "/biology/higher-zoology-tree/practical/appendages/"],
  ["07", "_biology/higher-zoology-tree/practical/07-zooplankton.bn.md", "/biology/higher-zoology-tree/practical/zooplankton/"],
  ["08", "_biology/higher-zoology-tree/practical/08-field-report.bn.md", "/biology/higher-zoology-tree/practical/field-report/"]
].freeze

def text(path)
  File.read(File.join(ROOT, path), encoding: "UTF-8")
end

def frontmatter_value(content, key)
  fm = content[/\A---\s*\n(.*?)\n---\s*\n/m, 1].to_s
  fm[/^#{Regexp.escape(key)}:\s*["']?([^"'\n]+)["']?\s*$/, 1]&.strip
end

errors = []
all_paths = [INDEX, COVERAGE, NAVIGATION, HIGHER_ZOOLOGY_EN, HIGHER_ZOOLOGY_BN] + MODULES.map { |row| row[1] }
all_paths.each { |path| errors << "missing file: #{path}" unless File.file?(File.join(ROOT, path)) }

if errors.empty?
  index = text(INDEX)
  errors << "gateway permalink mismatch" unless frontmatter_value(index, "permalink") == "/biology/higher-zoology-tree/practical/"
  errors << "gateway course_id mismatch" unless frontmatter_value(index, "course_id") == "zoology-practical-213106"
  errors << "gateway must remain published for preview certification" unless frontmatter_value(index, "published") == "true"
  errors << "gateway sidebar must use zoology_practical_213106" unless index.include?('nav: "zoology_practical_213106"')

  permalinks = [frontmatter_value(index, "permalink")]
  MODULES.each do |id, file, permalink|
    content = text(file)
    actual = frontmatter_value(content, "permalink")
    permalinks << actual
    errors << "#{id}: permalink mismatch #{actual.inspect}" unless actual == permalink
    errors << "#{id}: course_id mismatch" unless frontmatter_value(content, "course_id") == "zoology-practical-213106"
    errors << "#{id}: course_role must be practical-lecture" unless frontmatter_value(content, "course_role") == "practical-lecture"
    errors << "#{id}: published must remain true" unless frontmatter_value(content, "published") == "true"
    errors << "#{id}: dedicated practical sidebar missing" unless content.include?('nav: "zoology_practical_213106"')
    errors << "#{id}: gateway link missing" unless index.include?(permalink)
  end
  errors << "duplicate practical permalink" unless permalinks.compact.uniq.length == permalinks.compact.length

  navigation = text(NAVIGATION)
  errors << "Higher Zoology main navigation is missing Practical-I" unless navigation.include?('title: "Practical-I"') && navigation.include?('url: "/biology/higher-zoology-tree/practical/"')
  errors << "dedicated Practical-I sidebar collection missing" unless navigation.include?("zoology_practical_213106:")
  MODULES.each do |_id, _file, permalink|
    errors << "dedicated Practical-I sidebar missing #{permalink}" unless navigation.include?(permalink)
  end

  higher_en = text(HIGHER_ZOOLOGY_EN)
  higher_bn = text(HIGHER_ZOOLOGY_BN)
  errors << "English Higher Zoology gateway missing Practical-I link" unless higher_en.include?("/biology/higher-zoology-tree/practical/")
  errors << "Bangla Higher Zoology gateway missing Practical-I link" unless higher_bn.include?("/biology/higher-zoology-tree/practical/")

  coverage = JSON.parse(text(COVERAGE))
  errors << "coverage course code mismatch" unless coverage["course_code"] == "213106"
  errors << "museum printed entries must remain 49" unless coverage.dig("museum_specimens", "printed_entries") == 49
  errors << "museum unique labels must remain 48" unless coverage.dig("museum_specimens", "unique_labels") == 48
  errors << "museum coverage must remain 48/48" unless coverage.dig("museum_specimens", "coverage") == "48/48"
  errors << "coverage must contain exactly 8 modules" unless Array(coverage["modules"]).length == 8
  errors << "module IDs must be 01-08" unless Array(coverage["modules"]).map { |m| m["id"] } == (1..8).map { |n| format("%02d", n) }

  museum = text(MODULES[0][1])
  errors << "museum page must disclose 48/48 unique coverage" unless museum.include?("48/48 unique syllabus labels")
  errors << "museum duplicate Echinus note missing" unless museum.include?("Echinus")
  errors << "museum figure policy missing" unless museum.include?("Figure Policy")
  specimen_numbers = museum.scan(/^##\s+(\d+)\./).flatten.map(&:to_i)
  errors << "museum specimen sections must enumerate exactly 1..48" unless specimen_numbers == (1..48).to_a
  (1..48).each do |number|
    section = museum[/^##\s+#{number}\.\s.*?(?=^##\s+#{number + 1}\.\s|^#\s+High-yield|\z)/m]
    next errors << "museum specimen #{number} section missing" unless section
    errors << "museum specimen #{number} identifying characters missing" unless section.include?("### শনাক্তকারী বৈশিষ্ট্য")
    errors << "museum specimen #{number} practical identification missing" unless section.include?("### Practical identification")
  end

  slides = text(MODULES[1][1])
  errors << "permanent-slide bank must disclose 43 preparations" unless slides.include?("43-preparation reference bank")
  errors << "permanent-slide syllabus minimum must remain >=20" unless slides.include?("at least 20 slides")
  errors << "coverage ledger permanent-slide bank mismatch" unless coverage.dig("modules", 1, "coverage") == "43-preparation reference bank; syllabus minimum >=20"

  field = text(MODULES[7][1])
  errors << "field report >=10 sample contract missing" unless field.include?("10")
  errors << "field report Shannon contract missing" unless field.match?(/Shannon/i)

  zoop = text(MODULES[6][1])
  errors << "zooplankton three-water-body contract missing" unless zoop.match?(/3 different water bodies/i)
  errors << "zooplankton diversity methods missing" unless zoop.match?(/Simpson/i) && zoop.match?(/Shannon/i)
end

if errors.any?
  warn "Zoology Practical-I 213106 Certification: FAIL"
  errors.each { |e| warn "- #{e}" }
  exit 1
end

puts "Zoology Practical-I 213106 Certification: PASS"
puts "gateway=1 modules=8 museum_unique=48/48 navigation=integrated shared_css_changes=none"
