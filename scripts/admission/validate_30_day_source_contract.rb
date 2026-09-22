# frozen_string_literal: true
require "json"

ROOT = File.expand_path("../..", __dir__)
PATH = File.join(ROOT, "_data/admission/30_day_source_contract_v1.json")

data = JSON.parse(File.read(PATH, encoding: "UTF-8"))
errors = []

errors << "schema mismatch" unless data["schema"] == "lbfl-admission-30-day-source-contract-v1"
errors << "source_days must be 30" unless data.dig("summary", "source_days") == 30
errors << "current_repo_day_routes must be 7" unless data.dig("summary", "current_repo_day_routes") == 7
errors << "absent_day_routes must be 23" unless data.dig("summary", "absent_day_routes") == 23
errors << "source_equivalent_daily_tests must remain 0" unless data.dig("summary", "source_equivalent_daily_tests") == 0
errors << "equivalence claim must remain false" unless data.dig("repository_baseline", "equivalence_claim_allowed") == false

days = Array(data["days"])
errors << "days must contain exactly 30 rows" unless days.length == 30
errors << "day sequence must be 1..30" unless days.map { |d| d["day"] } == (1..30).to_a

implemented = days.select { |d| d["repo_day_route"] }
missing = days.select { |d| d["repo_day_route"].nil? }
errors << "implemented route rows must be 7" unless implemented.length == 7
errors << "missing route rows must be 23" unless missing.length == 23

expected_routes = (1..7).map { |n| "/admission/day-#{n}/" }
errors << "implemented route set mismatch" unless implemented.map { |d| d["repo_day_route"] } == expected_routes
errors << "Day 8-30 must remain absent" unless missing.map { |d| d["day"] } == (8..30).to_a

days.each do |row|
  errors << "day #{row["day"]}: source_test missing" if row["source_test"].to_s.strip.empty?
  errors << "day #{row["day"]}: alignment missing" if row["alignment"].to_s.strip.empty?
end

if errors.any?
  warn "Admission 30-Day Source Contract Validation: FAIL"
  errors.each { |e| warn "- #{e}" }
  exit 1
end

puts "Admission 30-Day Source Contract Validation: PASS"
puts "days=30 implemented=7 absent=23 source_equivalent_daily_tests=0"
