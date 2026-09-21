# frozen_string_literal: true

require "json"

ROOT = File.expand_path("../..", __dir__)
ARCHITECTURE_PATH = File.join(ROOT, "_data/admission/curriculum_architecture_v1.json")
ENGINE_PATH = File.join(ROOT, "_data/admission/biology/engine_v1.json")
COVERAGE_PATH = File.join(ROOT, "_data/admission/biology/curriculum_coverage_v1.json")
REUSE_PATH = File.join(ROOT, "_data/admission/biology/reuse_audit_v1.json")

def load_json(path)
  JSON.parse(File.read(path, encoding: "UTF-8"))
rescue Errno::ENOENT
  abort "Admission R2.1 Curriculum Architecture Validation: FAIL\n- missing file: #{path}"
rescue JSON::ParserError => e
  abort "Admission R2.1 Curriculum Architecture Validation: FAIL\n- invalid JSON #{path}: #{e.message}"
end

errors = []
architecture = load_json(ARCHITECTURE_PATH)
engine = load_json(ENGINE_PATH)
coverage = load_json(COVERAGE_PATH)
reuse = load_json(REUSE_PATH)

expected_subject_ids = %w[PHY CHEM MATH BIO]
expected_topic_ids = Array(engine["taxonomy"]).map { |topic| topic["id"] }
coverage_by_id = Array(coverage["topics"]).to_h { |topic| [topic["id"], topic] }

unless architecture["schema"] == "lbfl-admission-curriculum-architecture-v1"
  errors << "architecture schema mismatch"
end
unless architecture["version"] == "R2.1-0.1"
  errors << "architecture version mismatch"
end

subjects = Array(architecture["subjects"])
subject_ids = subjects.map { |subject| subject["subject_id"] }
errors << "subjects must be exactly PHY,CHEM,MATH,BIO in canonical order" unless subject_ids == expected_subject_ids
errors << "subject IDs must be unique" unless subject_ids.uniq.length == subject_ids.length

subject_order = Array(architecture["subject_order"])
errors << "subject_order mismatch" unless subject_order == expected_subject_ids

subjects.each do |subject|
  sid = subject["subject_id"]
  papers = Array(subject["papers"])
  errors << "#{sid}: expected exactly two paper shells" unless papers.length == 2

  paper_ids = papers.map { |paper| paper["paper_id"] }
  errors << "#{sid}: duplicate paper IDs" unless paper_ids.uniq.length == paper_ids.length

  papers.each do |paper|
    unless paper["chapter_taxonomy_status"] == "pending-authenticated-source-mapping"
      errors << "#{paper['paper_id']}: chapter taxonomy must remain pending authenticated source mapping"
    end
    unless Array(paper["chapters"]).empty?
      errors << "#{paper['paper_id']}: R2.1 architecture packet must not invent chapter rows"
    end
  end
end

bio = subjects.find { |subject| subject["subject_id"] == "BIO" }
if bio.nil?
  errors << "BIO subject missing"
else
  topic_taxonomy = bio["topic_taxonomy"] || {}
  errors << "BIO taxonomy source must remain engine_v1.json" unless topic_taxonomy["source"] == "_data/admission/biology/engine_v1.json"
  errors << "BIO expected_topic_ids must exactly preserve engine taxonomy" unless Array(topic_taxonomy["expected_topic_ids"]) == expected_topic_ids
  unless topic_taxonomy["chapter_mapping_status"] == "pending-authenticated-source-mapping"
    errors << "BIO chapter mapping must remain pending authenticated source mapping"
  end
end

boundary = architecture["boundary"] || {}
%w[
  chapter_taxonomy_authenticated
  chapter_completion_allowed
  new_model_test_batch_allowed
  historical_occurrence_substitution_allowed
  f_v2_promotion_allowed
  matrix_qyi_release_allowed
  ready_merge_production_authority
].each do |field|
  errors << "architecture boundary #{field} must remain false" unless boundary[field] == false
end

required_contract = %w[
  authenticated_curriculum_source
  authenticated_exact_authorized_textbook_edition_or_equivalent_primary_source
  chapter_to_topic_mapping
  learning_routes
  retrieval_practice
  application_practice
  chapter_model_test
  complete_question_explanations
  distractor_or_error_logic
  repair_routes
  second_content_verification
]
contract = architecture.dig("chapter_complete_contract", "required")
errors << "chapter completion contract mismatch" unless Array(contract) == required_contract

unless reuse["schema"] == "lbfl-admission-biology-reuse-audit-v1"
  errors << "reuse audit schema mismatch"
end
unless reuse["audited_parent_head"] == "5d1368228ca369febdd12f984a4ee6f796a2b435"
  errors << "reuse audit must remain bound to PR #345 exact parent head"
end
unless reuse["taxonomy_source"] == "_data/admission/biology/engine_v1.json"
  errors << "reuse audit taxonomy source mismatch"
end
unless reuse["coverage_source"] == "_data/admission/biology/curriculum_coverage_v1.json"
  errors << "reuse audit coverage source mismatch"
end

rows = Array(reuse["topics"])
row_ids = rows.map { |row| row["topic_id"] }
errors << "reuse audit must contain exactly 28 rows" unless rows.length == 28
errors << "reuse audit IDs must exactly match B01-B28 engine order" unless row_ids == expected_topic_ids
errors << "reuse audit topic IDs must be unique" unless row_ids.uniq.length == row_ids.length

allowed_reuse = %w[strong-reuse-candidate partial-reuse-candidate no-obvious-existing-route]
counts = Hash.new(0)

rows.each do |row|
  id = row["topic_id"]
  reuse_status = row["reuse_status"]
  counts[reuse_status] += 1

  errors << "#{id}: invalid reuse_status #{reuse_status.inspect}" unless allowed_reuse.include?(reuse_status)

  parent_status = coverage_by_id.dig(id, "status")
  if row["coverage_status_at_parent"] != parent_status
    errors << "#{id}: coverage_status_at_parent mismatch (#{row['coverage_status_at_parent'].inspect} != #{parent_status.inspect})"
  end

  paths = Array(row["candidate_paths"])
  if reuse_status == "no-obvious-existing-route"
    errors << "#{id}: no-obvious-existing-route must not carry candidate paths" unless paths.empty?
  else
    errors << "#{id}: reuse candidate must include at least one repository path" if paths.empty?
  end

  paths.each do |relative|
    unless relative.is_a?(String) && relative.start_with?("_biology/")
      errors << "#{id}: candidate path must be an existing canonical _biology repository path: #{relative.inspect}"
      next
    end

    full = File.join(ROOT, relative)
    errors << "#{id}: candidate path does not exist: #{relative}" unless File.file?(full)
  end

  errors << "#{id}: gap_note missing" if row["gap_note"].to_s.strip.empty?
  errors << "#{id}: next_action missing" if row["next_action"].to_s.strip.empty?
end

summary = reuse["summary"] || {}
errors << "reuse summary total_topics mismatch" unless summary["total_topics"] == rows.length
errors << "reuse summary strong count mismatch" unless summary["strong_reuse_candidates"] == counts["strong-reuse-candidate"]
errors << "reuse summary partial count mismatch" unless summary["partial_reuse_candidates"] == counts["partial-reuse-candidate"]
errors << "reuse summary no-obvious count mismatch" unless summary["no_obvious_existing_route"] == counts["no-obvious-existing-route"]

reuse_boundaries = reuse["boundaries"] || {}
%w[
  changes_existing_topic_status
  creates_new_lectures
  creates_new_model_tests
  establishes_primary_source_verification
  authorizes_matrix_qyi
].each do |field|
  errors << "reuse boundary #{field} must remain false" unless reuse_boundaries[field] == false
end

if errors.any?
  warn "Admission R2.1 Curriculum Architecture Validation: FAIL"
  errors.each { |error| warn "- #{error}" }
  exit 1
end

puts "Admission R2.1 Curriculum Architecture Validation: PASS"
puts "subjects=#{subjects.length} papers=#{subjects.sum { |subject| Array(subject['papers']).length }} chapter_rows=0"
puts "biology_topics=#{rows.length} strong_reuse=#{counts['strong-reuse-candidate']} partial_reuse=#{counts['partial-reuse-candidate']} no_obvious_route=#{counts['no-obvious-existing-route']}"
puts "chapter_taxonomy_authenticated=false new_model_test_batch_allowed=false matrix_qyi_release=false ready_merge_production_authority=false"
