#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "a104260266a292bee58f6935a5038693380e8c04"
BANK = ROOT.join("_mcq-arena/academic/botany-cell-division-mcq-2.md")
RUNTIME = ROOT.join("assets/js/learning/academic-assessment-runtime.js")
MANIFEST = ROOT.join("_data/academic/assessment_runtime_second_bank_v1.json")
DOC = ROOT.join("docs/academic/conv04/ASSESSMENT_RUNTIME_SECOND_BANK.md")
AUTH = ROOT.join("docs/academic/conv04/ASSESSMENT_RUNTIME_SECOND_BANK_AUTHORIZATION.md")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
BROWSER = ROOT.join(".github/scripts/assessment-runtime-second-bank-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/assessment-runtime-second-bank-certification.yml")

ALLOWED_FILES = %w[
  .github/scripts/assessment-runtime-second-bank-browser-certification.mjs
  .github/scripts/validate-assessment-runtime-second-bank.rb
  .github/workflows/assessment-runtime-second-bank-certification.yml
  _data/academic/assessment_runtime_second_bank_v1.json
  _mcq-arena/academic/botany-cell-division-mcq-2.md
  docs/academic/conv04/ASSESSMENT_RUNTIME_SECOND_BANK.md
  docs/academic/conv04/ASSESSMENT_RUNTIME_SECOND_BANK_AUTHORIZATION.md
  docs/academic/conv04/CONV04_STATE.md
].freeze

EXPECTED_CONTENT = JSON.parse(<<~JSON)
{
  "questions": [
    "১. ক্রোমাটিন তন্তুর প্রকৃত গঠন কী?",
    "২. কোষ বিভাজনের সময় ক্রোমাটিন কীসে রূপান্তরিত হয়?",
    "৩. ইউক্রোমাটিনের প্রধান কাজ কী?",
    "৪. সিস্টার ক্রোমাটিড কোথায় যুক্ত থাকে?",
    "৫. মেটাফেজে ক্রোমোজোমের বৈশিষ্ট্য কী?",
    "৬. অ্যাসেন্ট্রিক (Acentric) ক্রোমোজোমের বৈশিষ্ট্য কী?",
    "৭. ‘V’ আকৃতির ক্রোমোজোম কোনটি?",
    "৮. অ্যানাফেজ পর্যায়ে কী ঘটে?"
  ],
  "options": [
    "শুধু DNA",
    "শুধু প্রোটিন",
    "DNA ও হিস্টোন প্রোটিন",
    "RNA ও প্রোটিন",
    "নিউক্লিওলাস",
    "ক্রোমোজোম",
    "রাইবোজোম",
    "সেন্ট্রিওল",
    "নিষ্ক্রিয় DNA সংরক্ষণ",
    "সক্রিয় থেকে mRNA সংশ্লেষণ",
    "শক্তি উৎপাদন",
    "বিভাজন বন্ধ করা",
    "টেলোমিয়ার",
    "কাইনেটোকোর",
    "সেন্ট্রোমিয়ার",
    "স্যাটেলাইট",
    "লম্বা ও পাতলা",
    "অদৃশ্য",
    "খাটো ও মোটা (সর্বোচ্চ কন্ডেন্সড)",
    "বিভাজিত নয়",
    "একাধিক সেন্ট্রোমিয়ার",
    "কোনো সেন্ট্রোমিয়ার নেই",
    "মাঝখানে সেন্ট্রোমিয়ার",
    "দুই প্রান্তে সেন্ট্রোমিয়ার",
    "অ্যাক্রোসেন্ট্রিক",
    "টেলোসেন্ট্রিক",
    "মেটাসেন্ট্রিক",
    "সাবমেটাসেন্ট্রিক",
    "নিউক্লিয়ার মেমব্রেন তৈরি",
    "DNA প্রতিলিপি",
    "ক্রোমাটিড পৃথক হয়ে মেরুর দিকে যায়",
    "নিউক্লিওলাস সৃষ্টি"
  ],
  "answers": [
    2,
    1,
    1,
    2,
    2,
    1,
    2,
    2
  ],
  "explanations": [
    "✔ সঠিক: DNA ও প্রোটিন মিলে ক্রোমাটিন গঠিত।",
    "✔ সঠিক: কুণ্ডলিত হয়ে ক্রোমোজোমে রূপ নেয়।",
    "✔ সঠিক: এটি ট্রান্সক্রিপশনে সক্রিয় অংশ।",
    "✔ সঠিক: সেন্ট্রোমিয়ারে যুক্ত থাকে।",
    "✔ সঠিক: সবচেয়ে কন্ডেন্সড অবস্থায় থাকে।",
    "✔ সঠিক: সেন্ট্রোমিয়ার না থাকলে বিভাজন হয় না।",
    "✔ সঠিক: মেটাসেন্ট্রিক।",
    "✔ সঠিক: ক্রোমাটিড পৃথক হয়ে অপত্য ক্রোমোজোম হয়।"
  ]
}
JSON

errors = []
def read_utf8(path) = File.read(path, encoding: "UTF-8")

[BANK, RUNTIME, MANIFEST, DOC, AUTH, STATE, BROWSER, WORKFLOW].each do |path|
  errors << "Missing D-05 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

if BANK.file?
  source = read_utf8(BANK)
  questions = source.scan(/<div class="q-text"[^>]*>([\s\S]*?)<\/div>/).flatten.map(&:strip)
  options = source.scan(/<button[^>]*class="opt"[^>]*data-assessment-option[^>]*>([\s\S]*?)<\/button>/).flatten.map(&:strip)
  answers = source.scan(/data-assessment-question\s+data-a="(\d+)"/).flatten.map(&:to_i)
  explanations = source.scan(/<div class="exp"[^>]*data-assessment-explanation[^>]*>([\s\S]*?)<\/div>/).flatten.map(&:strip)
  errors << "D-05 question text changed" unless questions == EXPECTED_CONTENT.fetch("questions")
  errors << "D-05 option text changed" unless options == EXPECTED_CONTENT.fetch("options")
  errors << "D-05 answer keys changed" unless answers == EXPECTED_CONTENT.fetch("answers")
  errors << "D-05 authored explanations changed" unless explanations == EXPECTED_CONTENT.fetch("explanations")
  errors << "Shared authored runtime hook missing" unless source.include?("/assets/js/learning/academic-assessment-runtime.js")
  errors << "Authored assessment root missing" unless source.include?('data-assessment-runtime="authored-v1"')
  errors << "Botany repair target missing" unless source.include?('data-source-return="/biology/hsc-corner/botany/"')
  errors << "Submit control missing" unless source.include?("data-assessment-submit")
  errors << "Reattempt control missing" unless source.include?("data-assessment-retry")
  errors << "Result status region missing" unless source.include?("data-assessment-results")
  errors << "Legacy initQuiz call remains" if source.include?("initQuiz(")
  errors << "Legacy submitQuiz call remains" if source.include?("submitQuiz(")
  errors << "Inline onclick remains" if source.include?("onclick=")
  errors << "Reload-only restart remains" if source.include?("location.reload")
  errors << "Legacy neural wrapper remains" if source.include?("neural-quiz-wrapper")
  errors << "Question groups must expose radiogroup semantics" unless source.scan('role="radiogroup"').length == 8
  errors << "Options must expose radio semantics" unless source.scan('role="radio"').length == 32
  errors << "Question groups must be labelled by prompts" unless source.scan(/aria-labelledby="q\d+-label"/).length == 8
end

if RUNTIME.file?
  current_runtime = read_utf8(RUNTIME)
  base_runtime, base_status = Open3.capture2e("git", "-C", ROOT.to_s, "show", "#{BASE}:assets/js/learning/academic-assessment-runtime.js")
  if base_status.success?
    errors << "Shared authored runtime changed without D-05 authority" unless current_runtime == base_runtime
  else
    errors << "Unable to authenticate shared runtime against D-05 base: #{base_runtime.strip}"
  end
end

if MANIFEST.file?
  data = JSON.parse(read_utf8(MANIFEST))
  errors << "D-05 manifest schema mismatch" unless data["schema"] == "lbfl-assessment-runtime-second-bank-v1"
  errors << "D-05 manifest version mismatch" unless data["version"] == "CONV-04D-05-1.0.0"
  errors << "D-05 manifest base mismatch" unless data["authorized_base"] == BASE
  errors << "D-05 route mismatch" unless data["route"] == "/mcq-arena/academic/botany-cell-division-mcq-2/"
  errors << "D-05 runtime mismatch" unless data["runtime"] == "assets/js/learning/academic-assessment-runtime.js"
  errors << "D-05 runtime policy mismatch" unless data["runtime_policy"] == "reuse-unchanged-by-default"
  errors << "D-05 source-return mismatch" unless data["source_return"] == "/biology/hsc-corner/botany/"
  errors << "D-05 canonical loop mismatch" unless data["canonical_loop"] == %w[Attempt Feedback Repair Reattempt]
  errors << "D-05 question count mismatch" unless data.dig("content_preservation","questions") == 8
  errors << "D-05 option count mismatch" unless data.dig("content_preservation","options") == 32
  errors << "D-05 answer-key count mismatch" unless data.dig("content_preservation","answer_keys") == 8
  errors << "D-05 explanation count mismatch" unless data.dig("content_preservation","authored_explanations") == 8
end

if DOC.file?
  doc = read_utf8(DOC)
  ["Attempt → Feedback → Repair → Reattempt","assets/js/learning/academic-assessment-runtime.js","/biology/hsc-corner/botany/","32 option texts","8 authored explanations","reuse"].each do |needle|
    errors << "D-05 implementation document missing: #{needle}" unless doc.include?(needle)
  end
end

if STATE.file?
  state = read_utf8(STATE)
  errors << "CONV04_STATE must identify D-05" unless state.include?("phase: CONV-04D-05")
  errors << "CONV04_STATE must bind D-05 base" unless state.include?(BASE)
  errors << "Exact D-05 learner authority missing" unless state.include?("learner_mutation_allowlist:\n  - _mcq-arena/academic/botany-cell-division-mcq-2.md")
  errors << "Shared runtime reuse policy missing" unless state.include?("shared_authored_runtime: reuse unchanged by default")
  errors << "BOT-08 must remain frozen" unless state.include?("bot_08: frozen")
end

certification_mode = ENV.fetch("CERTIFICATION_MODE", "local")
pr_base = ENV["PR_BASE_SHA"].to_s.strip
errors << "D-05 pull-request base mismatch: expected #{BASE}, got #{pr_base}" if certification_mode == "pull_request" && pr_base != BASE

stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{BASE}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort
  unexpected = changed - ALLOWED_FILES.sort
  missing = ALLOWED_FILES.sort - changed
  errors << "Unexpected D-05 changed files: #{unexpected.join(', ')}" unless unexpected.empty?
  errors << "Expected D-05 files not changed: #{missing.join(', ')}" unless missing.empty?
else
  errors << "Unable to inspect D-05 changed-file scope: #{stdout.strip}"
end

if errors.empty?
  puts "CONV-04D-05 Botany Cell Division Runtime Migration: PASS"
  exit 0
end
warn "CONV-04D-05 Botany Cell Division Runtime Migration: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
