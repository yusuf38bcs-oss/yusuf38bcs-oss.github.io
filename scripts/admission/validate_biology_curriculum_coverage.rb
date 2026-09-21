# frozen_string_literal: true

require "json"

ROOT = File.expand_path("../..", __dir__)
LEDGER = File.join(ROOT, "_data/admission/biology/curriculum_coverage_v1.json")
ENGINE = File.join(ROOT, "_data/admission/biology/engine_v1.json")
MODEL_TEST = File.join(ROOT, "_pages/admission/foundation-model-test-01.md")

ledger = JSON.parse(File.read(LEDGER, encoding: "UTF-8"))
engine = JSON.parse(File.read(ENGINE, encoding: "UTF-8"))
model = File.read(MODEL_TEST, encoding: "UTF-8")
errors = []

expected_ids = engine.fetch("taxonomy").map { |topic| topic.fetch("id") }
topics = ledger.fetch("topics", [])
ids = topics.map { |topic| topic["id"] }

errors << "expected 28 taxonomy rows, found #{topics.length}" unless topics.length == 28
errors << "coverage IDs do not exactly match engine taxonomy order" unless ids == expected_ids
errors << "duplicate topic IDs detected" unless ids.uniq.length == ids.length

boundary = ledger.fetch("boundary", {})
errors << "historical occurrence substitution must remain disabled" unless boundary["historical_occurrence_substitution_allowed"] == false
errors << "Matrix/QYI release must remain disabled" unless boundary["matrix_qyi_release_allowed"] == false
errors << "F-V2 promotion must remain disabled" unless boundary["f_v2_promotion_allowed"] == false
errors << "page-level primary NCTB verification must not be claimed complete" unless boundary["nctb_page_level_primary_verification_complete"] == false

question_topics = {}
model.scan(/<fieldset\b[^>]*data-question-id="([^"]+)"[^>]*data-topic-id="([^"]+)"[^>]*>/) do |question_id, topic_id|
  question_topics[question_id] = topic_id
end

topic_statuses = %w[gap partial complete]
component_statuses = %w[gap present]
source_statuses = %w[not-yet-mapped topic-aligned-primary-page-verification-pending verified-primary]
all_model_ids = []

topics.each do |topic|
  id = topic.fetch("id")
  status = topic["status"]
  errors << "#{id}: invalid topic status #{status.inspect}" unless topic_statuses.include?(status)

  %w[learning_content practice model_test_coverage explanation nctb_source].each do |field|
    errors << "#{id}: missing #{field}" unless topic.key?(field)
  end

  learning = topic.fetch("learning_content", {})
  practice = topic.fetch("practice", {})
  model_cov = topic.fetch("model_test_coverage", {})
  explanation = topic.fetch("explanation", {})
  source = topic.fetch("nctb_source", {})

  errors << "#{id}: invalid learning status" unless component_statuses.include?(learning["status"])
  errors << "#{id}: invalid practice status" unless component_statuses.include?(practice["status"])
  errors << "#{id}: invalid model-test status" unless component_statuses.include?(model_cov["status"])
  errors << "#{id}: invalid explanation status" unless component_statuses.include?(explanation["status"])
  errors << "#{id}: invalid NCTB source status" unless source_statuses.include?(source["status"])

  routes = Array(learning["routes"]) + Array(practice["routes"])
  routes.each do |route|
    errors << "#{id}: route must be root-relative: #{route.inspect}" unless route.is_a?(String) && route.start_with?("/")
  end

  question_ids = Array(model_cov["question_ids"])
  explanation_ids = Array(explanation["question_ids"])
  all_model_ids.concat(question_ids)

  if model_cov["status"] == "present"
    errors << "#{id}: present model coverage requires question IDs" if question_ids.empty?
  elsif question_ids.any?
    errors << "#{id}: gap model coverage must not list question IDs"
  end

  if explanation["status"] == "present"
    errors << "#{id}: present explanation requires question IDs" if explanation_ids.empty?
  elsif explanation_ids.any?
    errors << "#{id}: gap explanation must not list question IDs"
  end

  question_ids.each do |question_id|
    errors << "#{id}: unknown Foundation Test question #{question_id}" unless question_topics.key?(question_id)
    if question_topics[question_id] && question_topics[question_id] != id
      errors << "#{id}: #{question_id} is bound to #{question_topics[question_id]} in the Foundation Test"
    end
  end

  explanation_ids.each do |question_id|
    errors << "#{id}: explanation #{question_id} is not part of model coverage" unless question_ids.include?(question_id)
  end

  refs = Array(source["refs"])
  case source["status"]
  when "not-yet-mapped"
    errors << "#{id}: unmapped NCTB source must not carry refs" if refs.any?
  when "topic-aligned-primary-page-verification-pending"
    errors << "#{id}: pending NCTB alignment requires at least one ref" if refs.empty?
  when "verified-primary"
    errors << "#{id}: verified-primary requires at least one ref" if refs.empty?
  end

  if status == "complete"
    complete_components =
      learning["status"] == "present" &&
      practice["status"] == "present" &&
      model_cov["status"] == "present" &&
      explanation["status"] == "present" &&
      source["status"] == "verified-primary"
    errors << "#{id}: complete topic does not satisfy the curriculum-completion contract" unless complete_components
  end

  if status == "gap"
    any_present = [learning, practice, model_cov, explanation].any? { |component| component["status"] == "present" }
    errors << "#{id}: gap topic contains present curriculum coverage" if any_present
  end
end

errors << "Foundation Model Test question ID reused across curriculum topics" unless all_model_ids.uniq.length == all_model_ids.length

summary = ledger.fetch("summary", {})
actual_complete = topics.count { |topic| topic["status"] == "complete" }
actual_partial = topics.count { |topic| topic["status"] == "partial" }
actual_gap = topics.count { |topic| topic["status"] == "gap" }
errors << "summary total_topics mismatch" unless summary["total_topics"] == topics.length
errors << "summary complete_topics mismatch" unless summary["complete_topics"] == actual_complete
errors << "summary partial_topics mismatch" unless summary["partial_topics"] == actual_partial
errors << "summary gap_topics mismatch" unless summary["gap_topics"] == actual_gap
errors << "summary counts do not total 28" unless actual_complete + actual_partial + actual_gap == 28

if errors.any?
  warn "Admission R2 Curriculum Coverage Validation: FAIL"
  errors.each { |error| warn "- #{error}" }
  exit 1
end

puts "Admission R2 Curriculum Coverage Validation: PASS"
puts "topics=#{topics.length} complete=#{actual_complete} partial=#{actual_partial} gap=#{actual_gap}"
puts "historical_occurrence_substitution=false matrix_qyi_release=false f_v2_promotion=false"
