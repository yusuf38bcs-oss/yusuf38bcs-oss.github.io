# frozen_string_literal: true

require "fileutils"
require "json"
require "open3"
require "rbconfig"
require "tmpdir"

VALIDATOR_SOURCE = File.expand_path("validate_biology_audit.rb", __dir__)

def write_json(root, relative_path, payload)
  path = File.join(root, relative_path)
  FileUtils.mkdir_p(File.dirname(path))
  File.write(path, JSON.pretty_generate(payload) + "\n", encoding: "UTF-8")
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

def question_fixture(id:, number:, component:, verification:)
  {
    "question_id" => id,
    "question_no" => number,
    "component" => component,
    "primary_topic_id" => "B17",
    "secondary_topic_ids" => [],
    "question_fingerprint" => "Regression fixture",
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
  questions = (1..3).map do |number|
    question_fixture(
      id: format("MED-TEST-%03d", number),
      number: number,
      component: "mcq",
      verification: "V1"
    )
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
  write_json(
    root,
    "_data/admission/biology/engine_v1.json",
    { "version" => "1.0", "taxonomy" => [{ "id" => "B17" }] }
  )
  write_json(root, "_data/admission/biology/audit_schema_v1.json", schema_fixture)
  write_json(root, "_data/admission/biology/du/2016-17.json", unaudited_du_fixture)
  write_json(root, "_data/admission/biology/medical/2016-17.json", partial_medical_fixture)

  validator_path = File.join(root, "scripts/admission/validate_biology_audit.rb")
  FileUtils.mkdir_p(File.dirname(validator_path))
  FileUtils.cp(VALIDATOR_SOURCE, validator_path)
end

def run_validator(root)
  Open3.capture3(
    RbConfig.ruby,
    File.join(root, "scripts/admission/validate_biology_audit.rb")
  )
end

def with_fixture
  Dir.mktmpdir("lbfl-audit-validator-test") do |root|
    build_fixture(root)
    yield root
  end
end

def assert_success(name)
  with_fixture do |root|
    stdout, stderr, status = run_validator(root)
    return if status.success?

    raise "#{name} unexpectedly failed:\n#{stdout}#{stderr}"
  end
end

def assert_rejection(name, expected_messages)
  with_fixture do |root|
    yield root
    stdout, stderr, status = run_validator(root)
    output = stdout + stderr
    missing = expected_messages.reject { |message| output.include?(message) }

    if status.success?
      raise "#{name} unexpectedly passed"
    end

    unless missing.empty?
      raise "#{name} missed expected diagnostics: #{missing.inspect}\n#{output}"
    end
  end
end

assert_success("baseline U/P records")

assert_rejection(
  "F-V2 without V2 verification",
  [
    "F-V2 requires verification_status=V2",
    "F-V2 requires every question verification_status=V2"
  ]
) do |root|
  question = question_fixture(
    id: "DU-TEST-001",
    number: 1,
    component: "mcq",
    verification: "unstarted"
  )
  write_json(
    root,
    "_data/admission/biology/du/2016-17.json",
    {
      "schema_version" => "1.0",
      "engine_version" => "1.0",
      "exam" => "DU",
      "session" => "2016-17",
      "component_scope" => ["mcq"],
      "paper_audit_state" => "F-V2",
      "verification_status" => "unstarted",
      "paper_complete" => true,
      "expected_biology_question_count" => 1,
      "audited_question_count" => 1,
      "zero_claims_allowed" => false,
      "matrix_release_allowed" => false,
      "sources" => [source_fixture],
      "questions" => [question],
      "derived_topic_counts" => { "B17" => 1 }
    }
  )
end

assert_rejection(
  "question outside declared component_scope",
  ["component \"written\" is outside declared component_scope [\"mcq\"]"]
) do |root|
  question = question_fixture(
    id: "DU-TEST-001",
    number: 1,
    component: "written",
    verification: "V1"
  )
  write_json(
    root,
    "_data/admission/biology/du/2016-17.json",
    {
      "schema_version" => "1.0",
      "engine_version" => "1.0",
      "exam" => "DU",
      "session" => "2016-17",
      "component_scope" => ["mcq"],
      "paper_audit_state" => "P",
      "verification_status" => "V1",
      "paper_complete" => false,
      "expected_biology_question_count" => nil,
      "audited_question_count" => 1,
      "zero_claims_allowed" => false,
      "matrix_release_allowed" => false,
      "sources" => [source_fixture],
      "questions" => [question],
      "derived_topic_counts" => { "B17" => 1 }
    }
  )
end

puts "LBFL Biology audit validator regression tests: PASS"
puts "Scenarios: baseline U/P + 2 expected rejections"
