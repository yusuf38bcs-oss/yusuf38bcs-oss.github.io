#!/usr/bin/env ruby
# frozen_string_literal: true

PAGE = "_pages/admission/foundation-model-test-01.md"
EXPECTED_TEST_ID = "admission-foundation-01"
EXPECTED_COUNT = 30

text = File.read(PAGE, encoding: "UTF-8")
errors = []

def attr(attrs, name)
  match = attrs.match(/\b#{Regexp.escape(name)}="([^"]*)"/)
  match && match[1]
end

blocks = text.scan(/<fieldset\b([^>]*)>(.*?)<\/fieldset>/m)
errors << "expected #{EXPECTED_COUNT} fieldsets, found #{blocks.length}" unless blocks.length == EXPECTED_COUNT

ids = []
names = []
blocks.each_with_index do |(attrs, body), index|
  number = index + 1
  expected_id = format("admission-foundation-01-q%02d", number)
  question_id = attr(attrs, "data-question-id")
  topic_id = attr(attrs, "data-topic-id")
  source_ref = attr(attrs, "data-source-ref")
  source_status = attr(attrs, "data-source-status")
  answer = attr(attrs, "data-answer")

  ids << question_id
  errors << "Q#{number}: question id #{question_id.inspect} != #{expected_id}" unless question_id == expected_id
  errors << "Q#{number}: missing topic id" if topic_id.to_s.empty?
  errors << "Q#{number}: source ref must be internal NCTB alignment metadata" unless source_ref.to_s.start_with?("NCTB-HSC-")
  errors << "Q#{number}: unexpected source status" unless source_status == "topic-aligned-primary-page-verification-pending"

  option_names = body.scan(/<input[^>]*type="radio"[^>]*name="([^"]+)"[^>]*value="([0-3])"/)
  errors << "Q#{number}: expected 4 radio options, found #{option_names.length}" unless option_names.length == 4
  q_names = option_names.map(&:first).uniq
  errors << "Q#{number}: radio group must have exactly one name" unless q_names.length == 1
  names << q_names.first
  values = option_names.map { |pair| pair[1] }
  errors << "Q#{number}: options must contain values 0..3" unless values.sort == %w[0 1 2 3]
  errors << "Q#{number}: answer #{answer.inspect} not present in options" unless values.include?(answer)
end

errors << "duplicate or missing permanent question IDs" unless ids.compact.length == EXPECTED_COUNT && ids.uniq.length == EXPECTED_COUNT
errors << "duplicate or missing radio group names" unless names.compact.length == EXPECTED_COUNT && names.uniq.length == EXPECTED_COUNT
errors << "missing permanent test ID" unless text.include?(%{data-test-id="#{EXPECTED_TEST_ID}"})
errors << "Q20 malformed historical typo remains" if text.include?("For y = x² + y² = 25")
errors << "Q20 corrected equation missing" unless text.include?("For x² + y² = 25, implicit differentiation gives")
errors << "source-boundary disclosure missing" unless text.include?("Primary page-level NCTB verification remains a separate evidence task.")
errors << "recommended-time wording missing" unless text.include?("recommended 15-minute target")
errors << "teacher-authored historical boundary missing" unless text.include?("not a reconstruction of historical DU or Medical admission papers")

if errors.any?
  warn "Admission Foundation Model Test Integrity: FAIL"
  errors.each { |error| warn "- #{error}" }
  exit 1
end

puts "Admission Foundation Model Test Integrity: PASS"
puts "test_id=#{EXPECTED_TEST_ID} questions=#{EXPECTED_COUNT} permanent_ids=unique radio_groups=unique"
puts "source_metadata=topic-aligned primary_page_verification=pending"
