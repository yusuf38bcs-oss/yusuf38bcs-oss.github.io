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

TOP_LEVEL_KEYS = %w[
  schema_version
  engine_version
  exam
  session
  component_scope
  paper_audit_state
  verification_status
  paper_complete
  expected_biology_question_count
  audited_question_count
  zero_claims_allowed
  matrix_release_allowed
  sources
  questions
].freeze

LEGAL_VERIFICATION_BY_STATE = {
  "U" => %w[unstarted],
  "P" => %w[V1 V2],
  "X" => %w[conflict],
  "F-S2" => %w[V1],
  "F-V2" => %w[V2]
}.freeze

errors = []
warnings = []
validated_records = {}

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

def require_keys(record, fields, label, errors)
  fields.each do |field|
    errors << "#{label}: missing required key #{field}" unless record.key?(field)
  end
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

def bool?(value)
  value == true || value == false
end

engine = load_json(ENGINE_PATH, errors)
schema = load_json(SCHEMA_PATH, errors)

topic_ids = Array(engine["taxonomy"]).map { |topic| topic["id"] }
allowed_states = Array(schema["paper_audit_states"])
allowed_verifications = Array(schema["verification_statuses"])
allowed_source_tiers = schema.fetch("source_tiers", {}).keys
allowed_source_statuses = Array(schema["source_statuses"])
required_question_fields = Array(schema["question_record_required_fields"])
required_source_fields = Array(schema["source_record_required_fields"])
allowed_components = schema.fetch("allowed_components", {})

errors << "audit schema version must be 1.0" unless schema["schema_version"] == "1.0"
errors << "audit schema engine_version must match engine_v1.json" unless schema["engine_version"] == engine["version"]

PILOT_PATHS.each do |expected_exam, path|
  data = load_json(path, errors)
  next if data.empty?

  label = "#{expected_exam} 2016-17"
  validated_records[expected_exam] = data
  require_keys(data, TOP_LEVEL_KEYS, label, errors)

  errors << "#{label}: schema_version mismatch" unless data["schema_version"] == schema["schema_version"]
  errors << "#{label}: engine_version mismatch" unless data["engine_version"] == engine["version"]
  errors << "#{label}: exam must equal #{expected_exam.inspect}" unless data["exam"] == expected_exam
  errors << "#{label}: session must equal 2016-17" unless data["session"] == "2016-17"

  state = data["paper_audit_state"]
  verification = data["verification_status"]
  questions = Array(data["questions"])
  sources = Array(data["sources"])
  source_ids = sources.map { |source| source["source_id"] }
  question_ids = questions.map { |question| question["question_id"] }
  component_scope = Array(data["component_scope"])

  errors << "#{label}: invalid paper_audit_state #{state.inspect}" unless allowed_states.include?(state)
  errors << "#{label}: invalid verification_status #{verification.inspect}" unless allowed_verifications.include?(verification)

  legal_verifications = LEGAL_VERIFICATION_BY_STATE[state]
  if legal_verifications && !legal_verifications.include?(verification)
    errors << "#{label}: unsupported verification/state transition #{state}/#{verification}; allowed=#{legal_verifications.join(',')}"
  end

  errors << "#{label}: paper_complete must be boolean" unless bool?(data["paper_complete"])
  errors << "#{label}: zero_claims_allowed must be boolean" unless bool?(data["zero_claims_allowed"])
  errors << "#{label}: matrix_release_allowed must be boolean" unless bool?(data["matrix_release_allowed"])

  unless data["audited_question_count"] == questions.length
    errors << "#{label}: audited_question_count must equal questions.length"
  end

  errors << "#{label}: duplicate source_id detected" if source_ids.uniq.length != source_ids.length
  errors << "#{label}: duplicate question_id detected" if question_ids.uniq.length != question_ids.length

  errors << "#{label}: component_scope must not be empty" if component_scope.empty?
  component_scope.each do |component|
    unless Array(allowed_components[expected_exam]).include?(component)
      errors << "#{label}: invalid component_scope entry #{component.inspect}"
    end
  end

  sources.each_with_index do |source, index|
    source_label = "#{label} source[#{index}]"
    require_fields(source, required_source_fields, source_label, errors)

    errors << "#{source_label}: invalid tier #{source['tier'].inspect}" unless allowed_source_tiers.include?(source["tier"])
    errors << "#{source_label}: invalid status #{source['status'].inspect}" unless allowed_source_statuses.include?(source["status"])
  end

  questions.each_with_index do |question, index|
    qlabel = "#{label} question[#{index}]"
    require_fields(question, required_question_fields, qlabel, errors)

    primary = question["primary_topic_id"]
    errors << "#{qlabel}: invalid primary_topic_id #{primary.inspect}" unless topic_ids.include?(primary)

    secondary = Array(question["secondary_topic_ids"])
    invalid_secondary = secondary.reject { |id| topic_ids.include?(id) }
    errors << "#{qlabel}: invalid secondary_topic_ids #{invalid_secondary.inspect}" unless invalid_secondary.empty?
    errors << "#{qlabel}: primary topic must not be repeated as a secondary topic" if secondary.include?(primary)

    component = question["component"]
    exam_components = Array(allowed_components[expected_exam])
    if !exam_components.include?(component)
      errors << "#{qlabel}: invalid component #{component.inspect}"
    elsif !component_scope.include?(component)
      errors << "#{qlabel}: component #{component.inspect} is outside declared component_scope #{component_scope.inspect}"
    end

    unless allowed_verifications.include?(question["verification_status"])
      errors << "#{qlabel}: invalid verification_status #{question['verification_status'].inspect}"
    end

    refs = Array(question["source_refs"])
    errors << "#{qlabel}: source_refs must not be empty" if refs.empty?
    unresolved_refs = refs.reject { |ref| source_ids.include?(ref) }
    errors << "#{qlabel}: unresolved source_refs #{unresolved_refs.inspect}" unless unresolved_refs.empty?
  end

  if state != "X" && (verification == "conflict" || questions.any? { |question| question["verification_status"] == "conflict" })
    errors << "#{label}: unresolved conflict requires paper_audit_state=X"
  end

  derived = questions.group_by { |question| question["primary_topic_id"] }.transform_values(&:length)
  declared = data["derived_topic_counts"]

  if declared
    normalized_declared = declared.transform_values(&:to_i)
    errors << "#{label}: derived_topic_counts must be derived exactly from questions" unless normalized_declared == derived
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

    if state == "F-S2"
      questions.each_with_index do |question, index|
        next if %w[V1 V2].include?(question["verification_status"])

        errors << "#{label} question[#{index}]: F-S2 requires question verification_status V1 or V2"
      end
    end

    if state == "F-V2"
      errors << "#{label}: F-V2 requires verification_status=V2" unless verification == "V2"
      questions.each_with_index do |question, index|
        next if question["verification_status"] == "V2"

        errors << "#{label} question[#{index}]: F-V2 requires every question verification_status=V2"
      end
    end
  end

  if data["zero_claims_allowed"] == true && !%w[F-S2 F-V2].include?(state)
    errors << "#{label}: zero_claims_allowed=true requires a complete audit state"
  end

  if data["matrix_release_allowed"] == true
    unless state == "F-V2" && verification == "V2" && data["paper_complete"] == true && data["zero_claims_allowed"] == true
      errors << "#{label}: matrix_release_allowed=true requires complete independently verified F-V2 authority"
    end
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
validated_records.each do |exam, data|
  puts format(
    "%s 2016-17: state=%s verification=%s audited=%d complete=%s zero_claims=%s matrix_release=%s",
    exam,
    data["paper_audit_state"],
    data["verification_status"],
    Array(data["questions"]).length,
    data["paper_complete"],
    data["zero_claims_allowed"],
    data["matrix_release_allowed"]
  )
end
puts "Final QYI release: NOT EVALUATED by this pilot validator; engine release_gate remains authoritative"
puts "Blocking violations: 0"

unless warnings.empty?
  puts
  warnings.each { |warning| puts "WARNING: #{warning}" }
end
