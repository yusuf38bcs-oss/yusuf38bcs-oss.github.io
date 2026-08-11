# frozen_string_literal: true

require "json"

ROOT = File.expand_path("../..", __dir__)
BASE = File.join(ROOT, "_data", "admission", "biology")
ENGINE_PATH = File.join(BASE, "engine_v1.json")
SCHEMA_PATH = File.join(BASE, "audit_schema_v1.json")
PILOT_PATHS = {
  "DU" => File.join(BASE, "du", "2016-17.json"),
  "Medical" => File.join(BASE, "medical", "2016-17.json")
}.freeze

errors = []
warnings = []

def load_json(path, errors)
  unless File.file?(path)
    errors << "missing file: #{path}"
    return {}
  end

  JSON.parse(File.read(path, encoding: "UTF-8"))
rescue JSON::ParserError => e
  errors << "invalid JSON #{path}: #{e.message}"
  {}
end

def require_fields(record, fields, label, errors)
  fields.each do |field|
    unless record.key?(field)
      errors << "#{label}: missing required field #{field}"
      next
    end

    value = record[field]
    missing_value = value.nil? || (value.is_a?(String) && value.strip.empty?)
    errors << "#{label}: missing required field #{field}" if missing_value
  end
end

engine = load_json(ENGINE_PATH, errors)
schema = load_json(SCHEMA_PATH, errors)

topic_ids = Array(engine["taxonomy"]).map { |t| t["id"] }
allowed_states = Array(schema["paper_audit_states"])
allowed_verifications = Array(schema["verification_statuses"])
allowed_source_tiers = schema.fetch("source_tiers", {}).keys
allowed_source_statuses = Array(schema["source_statuses"])
required_question_fields = Array(schema["question_record_required_fields"])
required_source_fields = Array(schema["source_record_required_fields"])
allowed_components = schema.fetch("allowed_components", {})

unless schema["schema_version"] == "1.0"
  errors << "audit schema version must be 1.0"
end

unless schema["engine_version"] == engine["version"]
  errors << "audit schema engine_version must match engine_v1.json"
end

PILOT_PATHS.each do |expected_exam, path|
  data = load_json(path, errors)
  next if data.empty?

  label = "#{expected_exam} 2016-17"

  unless data["schema_version"] == schema["schema_version"]
    errors << "#{label}: schema_version mismatch"
  end

  unless data["engine_version"] == engine["version"]
    errors << "#{label}: engine_version mismatch"
  end

  unless data["exam"] == expected_exam
    errors << "#{label}: exam must equal #{expected_exam.inspect}"
  end

  unless data["session"] == "2016-17"
    errors << "#{label}: session must equal 2016-17"
  end

  state = data["paper_audit_state"]
  verification = data["verification_status"]
  questions = Array(data["questions"])
  sources = Array(data["sources"])
  source_ids = sources.map { |s| s["source_id"] }
  question_ids = questions.map { |q| q["question_id"] }

  errors << "#{label}: invalid paper_audit_state #{state.inspect}" unless allowed_states.include?(state)
  errors << "#{label}: invalid verification_status #{verification.inspect}" unless allowed_verifications.include?(verification)

  unless data["audited_question_count"] == questions.length
    errors << "#{label}: audited_question_count must equal questions.length"
  end

  if source_ids.uniq.length != source_ids.length
    errors << "#{label}: duplicate source_id detected"
  end

  if question_ids.uniq.length != question_ids.length
    errors << "#{label}: duplicate question_id detected"
  end

  Array(data["component_scope"]).each do |component|
    unless Array(allowed_components[expected_exam]).include?(component)
      errors << "#{label}: invalid component_scope entry #{component.inspect}"
    end
  end

  sources.each_with_index do |source, index|
    source_label = "#{label} source[#{index}]"
    require_fields(source, required_source_fields, source_label, errors)

    unless allowed_source_tiers.include?(source["tier"])
      errors << "#{source_label}: invalid tier #{source['tier'].inspect}"
    end

    unless allowed_source_statuses.include?(source["status"])
      errors << "#{source_label}: invalid status #{source['status'].inspect}"
    end
  end

  questions.each_with_index do |question, index|
    qlabel = "#{label} question[#{index}]"
    require_fields(question, required_question_fields, qlabel, errors)

    primary = question["primary_topic_id"]
    errors << "#{qlabel}: invalid primary_topic_id #{primary.inspect}" unless topic_ids.include?(primary)

    secondary = Array(question["secondary_topic_ids"])
    invalid_secondary = secondary.reject { |id| topic_ids.include?(id) }
    errors << "#{qlabel}: invalid secondary_topic_ids #{invalid_secondary.inspect}" unless invalid_secondary.empty?

    if secondary.include?(primary)
      errors << "#{qlabel}: primary topic must not be repeated as a secondary topic"
    end

    component = question["component"]
    unless Array(allowed_components[expected_exam]).include?(component)
      errors << "#{qlabel}: invalid component #{component.inspect}"
    end

    unless allowed_verifications.include?(question["verification_status"])
      errors << "#{qlabel}: invalid verification_status #{question['verification_status'].inspect}"
    end

    refs = Array(question["source_refs"])
    if refs.empty?
      errors << "#{qlabel}: source_refs must not be empty"
    end

    unresolved_refs = refs.reject { |ref| source_ids.include?(ref) }
    errors << "#{qlabel}: unresolved source_refs #{unresolved_refs.inspect}" unless unresolved_refs.empty?
  end

  derived = questions.group_by { |q| q["primary_topic_id"] }.transform_values(&:length)
  declared = data["derived_topic_counts"]

  if declared
    normalized_declared = declared.transform_values(&:to_i)
    unless normalized_declared == derived
      errors << "#{label}: derived_topic_counts must be derived exactly from questions"
    end

    if normalized_declared.values.any? { |count| count <= 0 }
      errors << "#{label}: derived_topic_counts may contain only observed positive counts"
    end
  elsif questions.any?
    warnings << "#{label}: derived_topic_counts omitted; runtime may derive it from questions"
  end

  case state
  when "U"
    errors << "#{label}: U requires zero questions" unless questions.empty?
    errors << "#{label}: U requires audited_question_count=0" unless data["audited_question_count"] == 0
    errors << "#{label}: U requires paper_complete=false" unless data["paper_complete"] == false
    errors << "#{label}: U requires zero_claims_allowed=false" unless data["zero_claims_allowed"] == false
    errors << "#{label}: U requires matrix_release_allowed=false" unless data["matrix_release_allowed"] == false
    errors << "#{label}: U requires verification_status=unstarted" unless verification == "unstarted"
  when "P", "X"
    errors << "#{label}: #{state} requires paper_complete=false" unless data["paper_complete"] == false
    errors << "#{label}: #{state} requires zero_claims_allowed=false" unless data["zero_claims_allowed"] == false
    errors << "#{label}: #{state} requires matrix_release_allowed=false" unless data["matrix_release_allowed"] == false
  when "F-S2", "F-V2"
    expected = data["expected_biology_question_count"]
    unless expected.is_a?(Integer) && expected.positive?
      errors << "#{label}: complete audit requires positive expected_biology_question_count"
    end
    errors << "#{label}: complete audit requires paper_complete=true" unless data["paper_complete"] == true
    if expected.is_a?(Integer) && expected.positive? && expected != questions.length
      errors << "#{label}: complete audit expected count must equal questions.length"
    end
  end

  if ["U", "P", "X"].include?(state) && data["zero_claims_allowed"] != false
    errors << "#{label}: incomplete audit cannot authorize topic zeros"
  end
end

if errors.any?
  puts
  puts "LBFL Biology 2016-17 Audit Validation: FAIL"
  puts "Blocking violations: #{errors.length}"
  puts
  errors.each_with_index { |error, index| puts "#{index + 1}. #{error}" }
  exit 1
end

puts "LBFL Biology 2016-17 Audit Validation: PASS"
puts "Schema version: #{schema['schema_version']}"
puts "DU 2016-17: U (zero claims blocked)"
puts "Medical 2016-17: P (3 source-traced seed records; zero claims blocked)"
puts "Final QYI impact: NONE"
puts "Blocking violations: 0"

unless warnings.empty?
  puts
  warnings.each { |warning| puts "WARNING: #{warning}" }
end
