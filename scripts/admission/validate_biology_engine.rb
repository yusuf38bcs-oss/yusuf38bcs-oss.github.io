# frozen_string_literal: true

require "json"

ROOT = File.expand_path("../..", __dir__)
ENGINE_PATH = File.join(
  ROOT,
  "_data",
  "admission",
  "biology",
  "engine_v1.json"
)

EXPECTED_VERSION = "1.0"

EXPECTED_YEARS = %w[
  2016-17
  2017-18
  2018-19
  2019-20
  2020-21
  2021-22
  2022-23
  2023-24
  2024-25
  2025-26
].freeze

EXPECTED_TOPIC_IDS = (1..28).map { |n| format("B%02d", n) }.freeze

EXPECTED_LEGAL_STATES = %w[
  0
  U
  P
  X
  F-S2
  F-V2
].freeze

ALLOWED_ROLES = %w[
  P0
  P1
  P2
  P3
].freeze

ALLOWED_LANES = [
  "Common Core",
  "University Edge",
  "Medical Edge"
].freeze

errors = []
warnings = []

def fail_check(errors, message)
  errors << message
end

unless File.file?(ENGINE_PATH)
  abort "FAIL: engine file not found: #{ENGINE_PATH}"
end

begin
  data = JSON.parse(File.read(ENGINE_PATH, encoding: "UTF-8"))
rescue JSON::ParserError => e
  abort "FAIL: invalid JSON: #{e.message}"
end

# --------------------------------------------------
# Core metadata
# --------------------------------------------------

unless data["version"] == EXPECTED_VERSION
  fail_check(
    errors,
    "version must be #{EXPECTED_VERSION.inspect}; found #{data['version'].inspect}"
  )
end

unless data["engine"].is_a?(String) && !data["engine"].strip.empty?
  fail_check(errors, "engine name is missing")
end

# --------------------------------------------------
# Audit window
# --------------------------------------------------

audit_window = data["audit_window"]

unless audit_window == EXPECTED_YEARS
  fail_check(
    errors,
    "audit_window must exactly equal #{EXPECTED_YEARS.inspect}"
  )
end

# --------------------------------------------------
# Legal audit states
# --------------------------------------------------

legal_states = data.fetch("legal_states", {}).keys

missing_states = EXPECTED_LEGAL_STATES - legal_states
unexpected_states = legal_states - EXPECTED_LEGAL_STATES

unless missing_states.empty?
  fail_check(errors, "missing legal states: #{missing_states.join(', ')}")
end

unless unexpected_states.empty?
  fail_check(errors, "unexpected legal states: #{unexpected_states.join(', ')}")
end

# --------------------------------------------------
# Frozen taxonomy
# --------------------------------------------------

taxonomy = data["taxonomy"]

unless taxonomy.is_a?(Array)
  fail_check(errors, "taxonomy must be an array")
  taxonomy = []
end

unless taxonomy.length == 28
  fail_check(errors, "taxonomy must contain exactly 28 topics; found #{taxonomy.length}")
end

topic_ids = taxonomy.map { |topic| topic["id"] }

unless topic_ids == EXPECTED_TOPIC_IDS
  fail_check(
    errors,
    "topic IDs must be exactly B01..B28 in frozen order"
  )
end

duplicates = topic_ids.group_by(&:itself).select { |_id, values| values.length > 1 }.keys

unless duplicates.empty?
  fail_check(errors, "duplicate topic IDs: #{duplicates.join(', ')}")
end

taxonomy.each do |topic|
  id = topic["id"] || "(unknown)"

  %w[bn en include exclude lane provisional_role].each do |field|
    value = topic[field]

    unless value.is_a?(String) && !value.strip.empty?
      fail_check(errors, "#{id}: missing/blank field #{field.inspect}")
    end
  end

  role = topic["provisional_role"]

  unless ALLOWED_ROLES.include?(role)
    fail_check(errors, "#{id}: invalid provisional_role #{role.inspect}")
  end

  lane = topic["lane"]

  unless ALLOWED_LANES.include?(lane)
    fail_check(errors, "#{id}: invalid lane #{lane.inspect}")
  end
end

# --------------------------------------------------
# QYI model
# --------------------------------------------------

qyi = data.fetch("qyi_model", {})

du_weights = qyi.fetch("qyi_du", {})
medical_weights = qyi.fetch("qyi_medical", {})
common_weights = qyi.fetch("qyi_common", {})

def validate_weight_sum(errors, label, weights)
  unless weights.is_a?(Hash) && !weights.empty?
    errors << "#{label}: weight map is missing"
    return
  end

  unless weights.values.all? { |v| v.is_a?(Numeric) }
    errors << "#{label}: every weight must be numeric"
    return
  end

  total = weights.values.sum.to_f

  unless (total - 1.0).abs < 0.000001
    errors << "#{label}: weights must sum to 1.0; found #{total}"
  end
end

validate_weight_sum(errors, "QYI-DU", du_weights)
validate_weight_sum(errors, "QYI-Medical", medical_weights)
validate_weight_sum(errors, "QYI-Common", common_weights)

recent = qyi.fetch("recent_3y_weights", {})

validate_weight_sum(errors, "Recent-3Y", recent)

unless qyi["release_gate"].is_a?(String) && !qyi["release_gate"].strip.empty?
  fail_check(errors, "QYI release gate must be explicitly defined")
end

# --------------------------------------------------
# Blind backtest integrity
# --------------------------------------------------

backtest = data.fetch("backtest", {})
train = backtest["train"]
holdout = backtest["holdout"]

expected_train = EXPECTED_YEARS.first(7)
expected_holdout = EXPECTED_YEARS.last(3)

unless train == expected_train
  fail_check(
    errors,
    "backtest training window must be #{expected_train.inspect}"
  )
end

unless holdout == expected_holdout
  fail_check(
    errors,
    "backtest holdout must be #{expected_holdout.inspect}"
  )
end

unless Array(train) + Array(holdout) == EXPECTED_YEARS
  fail_check(errors, "training + holdout must partition the audit window exactly")
end

# --------------------------------------------------
# Premature-QYI guard
# --------------------------------------------------

taxonomy.each do |topic|
  forbidden = %w[
    final_qyi
    qyi_final
    qyi_du_final
    qyi_medical_final
    qyi_common_final
  ]

  present = forbidden.select { |key| topic.key?(key) }

  unless present.empty?
    fail_check(
      errors,
      "#{topic['id']}: premature final QYI field present: #{present.join(', ')}"
    )
  end
end

# --------------------------------------------------
# Result
# --------------------------------------------------

if errors.any?
  puts
  puts "LBFL Biology Engine Validation: FAIL"
  puts "Version: #{data['version']}"
  puts "Topics: #{taxonomy.length}"
  puts "Audit window: #{Array(audit_window).length}"
  puts "Blocking violations: #{errors.length}"
  puts

  errors.each_with_index do |error, index|
    puts "#{index + 1}. #{error}"
  end

  exit 1
end

puts "LBFL Biology Engine Validation: PASS"
puts "Version: #{data['version']}"
puts "Topics: #{taxonomy.length}"
puts "Audit window: #{audit_window.length}"
puts "Training years: #{train.length}"
puts "Holdout years: #{holdout.length}"
puts "Publishable QYI: NO"
puts "Blocking violations: 0"

unless warnings.empty?
  puts
  warnings.each { |warning| puts "WARNING: #{warning}" }
end
