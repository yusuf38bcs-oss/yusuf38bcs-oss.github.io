# frozen_string_literal: true

require "fileutils"
require "json"
require "open3"
require "rbconfig"
require "tmpdir"

VALIDATOR_SOURCE = File.expand_path("validate_biology_audit.rb", __dir__)
SCENARIO_COUNT = 15

def write_json(root, relative_path, payload)
  path = File.join(root, relative_path)
  FileUtils.mkdir_p(File.dirname(path))
  File.write(path, JSON.pretty_generate(payload) + "\n", encoding: "UTF-8")
end

def read_json(root, relative_path)
  JSON.parse(File.read(File.join(root, relative_path), encoding: "UTF-8"))
end

def schema_fixture
  {
    "schema_version" => "1.0",
    "engine_version" => "1.0",
    "paper_audit_states" => %w[U P X F-S2 F-V2],
    "verification_statuses" => %w[unstarted V1 V2 conflict],
    "source_tiers" => { "B2" => "Independent historical transcription" },
    "source_statuses" => %w[candidate reviewed verified rejected],
    "allowed_components" => {
      "DU" => %w[mcq written],
      "Medical" => %w[mcq]
    },
    "question_record_required_fields" => %w[
      question_id
      question_no
      component
      primary_topic_id
      secondary_topic_ids
      question_fingerprint
      source_refs
      verification_status
    ],
    "source_record_required_fields" => %w[
      source_id
      tier
      kind
      url
      status
      supports
    ]
  }
end

def source_fixture
  {
    "source_id" => "TEST-SOURCE",
    "tier" => "B2",
    "kind" => "test-fixture",
    "url" => "https://example.test/source",
    "status" => "reviewed",
    "supports" => "Regression fixture only"
  }
end

def question_fixture(id:, number:, component: "mcq", verification: "V1", topic: "B17")
  {
    "question_id" => id,
    "question_no" => number,
    "component" => component,
    "primary_topic_id" => topic,
    "secondary_topic_ids" => [],
    "question_fingerprint" => "Regression fixture #{id}",
    "source_refs" => ["TEST-SOURCE"],
    "verification_status" => verification
  }
end

def unaudited_du_fixture
  {
    "schema_version" => "1.0",
    "engine_version" => "1.0",
    "exam" => "DU",
    "session" => "2016-17",
    "component_scope" => ["mcq"],
    "paper_audit_state" => "U",
    "verification_status" => "unstarted",
    "paper_complete" => false,
    "expected_biology_question_count" => nil,
    "audited_question_count" => 0,
    "zero_claims_allowed" => false,
    "matrix_release_allowed" => false,
    "sources" => [],
    "questions" => []
  }
end

def partial_medical_fixture
  questions = (1..2).map do |number|
    question_fixture(id: format("MED-TEST-%03d", number), number: number)
  end

  {
    "schema_version" => "1.0",
    "engine_version" => "1.0",
    "exam" => "Medical",
    "session" => "2016-17",
    "component_scope" => ["mcq"],
    "paper_audit_state" => "P",
    "verification_status" => "V1",
    "paper_complete" => false,
    "expected_biology_question_count" => nil,
    "audited_question_count" => questions.length,
    "zero_claims_allowed" => false,
    "matrix_release_allowed" => false,
    "sources" => [source_fixture],
    "questions" => questions,
    "derived_topic_counts" => { "B17" => questions.length }
  }
end

def build_fixture(root)
  write_json(root, "_data/admission/biology/engine_v1.json", { "version" => "1.0", "taxonomy" => [{ "id" => "B17" }] })
  write_json(root, "_data/admission/biology/audit_schema_v1.json", schema_fixture)
  write_json(root, "_data/admission/biology/du/2016-17.json", unaudited_du_fixture)
  write_json(root, "_data/admission/biology/medical/2016-17.json", partial_medical_fixture)

  validator_path = File.join(root, "scripts/admission/validate_biology_audit.rb")
  FileUtils.mkdir_p(File.dirname(validator_path))
  FileUtils.cp(VALIDATOR_SOURCE, validator_path)
end

def run_validator(root)
  Open3.capture3(RbConfig.ruby, File.join(root, "scripts/admission/validate_biology_audit.rb"))
end

def with_fixture
  Dir.mktmpdir("lbfl-audit-validator-test") do |root|
    build_fixture(root)
    yield root
  end
end

def assert_success(name, expected_output: [])
  with_fixture do |root|
    yield root if block_given?
    stdout, stderr, status = run_validator(root)
    raise "#{name} unexpectedly failed:\n#{stdout}#{stderr}" unless status.success?

    output = stdout + stderr
    missing = expected_output.reject { |message| output.include?(message) }
    raise "#{name} missed expected output: #{missing.inspect}\n#{output}" unless missing.empty?
  end
end

def assert_rejection(name, expected_messages)
  with_fixture do |root|
    yield root
    stdout, stderr, status = run_validator(root)
    output = stdout + stderr
    missing = expected_messages.reject { |message| output.include?(message) }

    raise "#{name} unexpectedly passed" if status.success?
    raise "#{name} missed expected diagnostics: #{missing.inspect}\n#{output}" unless missing.empty?
  end
end

# 15. Valid baseline. Also proves certification output is derived, not hard-coded.
assert_success(
  "valid baseline",
  expected_output: [
    "DU 2016-17: state=U verification=unstarted audited=0",
    "Medical 2016-17: state=P verification=V1 audited=2",
    "Final QYI release: NOT EVALUATED"
  ]
)

# 1. F-V2 with one question below V2. Paper-level verification is valid so this
# scenario independently protects the per-question F-V2 invariant.
assert_rejection("F-V2 question below V2", ["F-V2 requires every question verification_status=V2"]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["paper_audit_state"] = "F-V2"
  data["verification_status"] = "V2"
  data["paper_complete"] = true
  data["expected_biology_question_count"] = data["questions"].length
  data["zero_claims_allowed"] = true
  data["questions"].each { |question| question["verification_status"] = "V2" }
  data["questions"][0]["verification_status"] = "V1"
  write_json(root, path, data)
end

# 2. Question outside declared component_scope.
assert_rejection("outside component_scope", ["outside declared component_scope"]) do |root|
  path = "_data/admission/biology/du/2016-17.json"
  data = unaudited_du_fixture
  question = question_fixture(id: "DU-TEST-001", number: 1, component: "written")
  data.merge!(
    "paper_audit_state" => "P",
    "verification_status" => "V1",
    "audited_question_count" => 1,
    "sources" => [source_fixture],
    "questions" => [question],
    "derived_topic_counts" => { "B17" => 1 }
  )
  write_json(root, path, data)
end

# 3. Invalid component for the exam.
assert_rejection("invalid component", ["invalid component \"written\""]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["questions"][0]["component"] = "written"
  write_json(root, path, data)
end

# 4. Duplicate question_id.
assert_rejection("duplicate question_id", ["duplicate question_id detected"]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["questions"][1]["question_id"] = data["questions"][0]["question_id"]
  write_json(root, path, data)
end

# 5. Required-field failure.
assert_rejection("required field", ["missing required field question_fingerprint"]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["questions"][0].delete("question_fingerprint")
  write_json(root, path, data)
end

# 6. derived_topic_counts mismatch.
assert_rejection("derived counts mismatch", ["derived_topic_counts must be derived exactly from questions"]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["derived_topic_counts"] = { "B17" => 99 }
  write_json(root, path, data)
end

# 7. audited_question_count mismatch.
assert_rejection("audited count mismatch", ["audited_question_count must equal questions.length"]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["audited_question_count"] = 99
  write_json(root, path, data)
end

# 8. Illegal paper_complete.
assert_rejection("illegal paper_complete", ["P requires paper_complete=false"]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["paper_complete"] = true
  write_json(root, path, data)
end

# 9. Illegal zero_claims_allowed.
assert_rejection("illegal zero claims", ["P requires zero_claims_allowed=false"]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["zero_claims_allowed"] = true
  write_json(root, path, data)
end

# 10. Illegal matrix_release_allowed.
assert_rejection("illegal matrix release", ["P requires matrix_release_allowed=false"]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["matrix_release_allowed"] = true
  write_json(root, path, data)
end

# 11. Missing source reference.
assert_rejection("missing source reference", ["unresolved source_refs [\"MISSING-SOURCE\"]"]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["questions"][0]["source_refs"] = ["MISSING-SOURCE"]
  write_json(root, path, data)
end

# 12. Invalid taxonomy topic.
assert_rejection("invalid taxonomy topic", ["invalid primary_topic_id \"B99\""]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["questions"][0]["primary_topic_id"] = "B99"
  data["derived_topic_counts"] = { "B99" => 1, "B17" => 1 }
  write_json(root, path, data)
end

# 13. Unsupported verification transition/state pairing.
assert_rejection("unsupported verification transition", ["unsupported verification/state transition P/unstarted"]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["verification_status"] = "unstarted"
  write_json(root, path, data)
end

# 14. Unresolved conflict falsely promoted.
assert_rejection("conflict falsely promoted", ["unresolved conflict requires paper_audit_state=X"]) do |root|
  path = "_data/admission/biology/medical/2016-17.json"
  data = read_json(root, path)
  data["questions"][0]["verification_status"] = "conflict"
  write_json(root, path, data)
end

puts "LBFL Biology audit validator regression tests: PASS"
puts "Scenarios: #{SCENARIO_COUNT} (1 valid baseline + 14 expected rejections)"
