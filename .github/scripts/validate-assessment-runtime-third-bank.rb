#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "d623e0016fdc98ee7b6ddc3b21a7c60c8383965b"
AUTHORIZATION_HEAD = "5d4c837fa7e1beee898305c2c0633ba161f1686b"
BANK = ROOT.join("_mcq-arena/academic/zoology-respiratory-system-mcq-5.md")
RUNTIME = ROOT.join("assets/js/learning/academic-assessment-runtime.js")
AUTH = ROOT.join("_data/academic/assessment_runtime_third_bank_authorization_v1.json")
MANIFEST = ROOT.join("_data/academic/assessment_runtime_third_bank_v1.json")
DOC = ROOT.join("docs/academic/conv04/ASSESSMENT_RUNTIME_THIRD_BANK.md")
AUTH_DOC = ROOT.join("docs/academic/conv04/ASSESSMENT_RUNTIME_THIRD_BANK_AUTHORIZATION.md")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
BROWSER = ROOT.join(".github/scripts/assessment-runtime-third-bank-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/assessment-runtime-third-bank-certification.yml")
CONTRAST_AUTH_DOC = ROOT.join("docs/academic/conv04/ASSESSMENT_RUNTIME_THIRD_BANK_CONTRAST_R1_AUTHORIZATION.md")
CONTRAST_REMEDIATION_PHASE = "CONV-04F-07-R1"
CONTRAST_REMEDIATION_FILES = %w[
  .github/scripts/validate-academic-design-system.rb
  .github/scripts/validate-assessment-runtime-third-bank.rb
  _mcq-arena/academic/zoology-respiratory-system-mcq-5.md
  docs/academic/conv04/ASSESSMENT_RUNTIME_THIRD_BANK_CONTRAST_R1_AUTHORIZATION.md
  docs/academic/conv04/CONV04_STATE.md
].sort.freeze

ALLOWED_FILES = %w[
  .github/scripts/assessment-runtime-third-bank-browser-certification.mjs
  .github/scripts/validate-assessment-runtime-third-bank.rb
  .github/workflows/assessment-runtime-third-bank-certification.yml
  _data/academic/assessment_runtime_third_bank_authorization_v1.json
  _data/academic/assessment_runtime_third_bank_v1.json
  _mcq-arena/academic/zoology-respiratory-system-mcq-5.md
  docs/academic/conv04/ASSESSMENT_RUNTIME_THIRD_BANK.md
  docs/academic/conv04/ASSESSMENT_RUNTIME_THIRD_BANK_AUTHORIZATION.md
  docs/academic/conv04/CONV04_STATE.md
].freeze

PROTECTED_AFTER_MERGE = (ALLOWED_FILES - ["docs/academic/conv04/CONV04_STATE.md"]).freeze
PHASE_PATTERN = /\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.freeze

EXPECTED_CONTENT = JSON.parse(<<~JSON)
{
  "questions": [
    "১. প্রশ্বাস বায়ুতে কার্বন ডাই-অক্সাইডের পরিমাণ কত?",
    "২. সারফেকট্যান্ট কোথায় ক্ষরিত হয়?",
    "৩. সাইনুসাইটিসের প্রধান লক্ষণ কোনটি?",
    "৪. কোথায় সেরাস ফ্লুইড পাওয়া যায়?",
    "৫. দু’চোখের মাঝের সাইনাস কোনটি?",
    "৬. টিস্যুতে কার্বন ডাই-অক্সাইডের আংশিক চাপ ($) কত?",
    "৭. নিচের কোনটি সঠিক?",
    "৮. COPD এর পূর্ণরূপ কী?"
  ],
  "options": [
    "০.৪%",
    "০.০৪%",
    "২০%",
    "৪.০%",
    "স্বরযন্ত্রে",
    "শ্বাসনালিতে",
    "অ্যালভিওলাসে",
    "ব্রঙ্কাসে",
    "কাশি",
    "বমি",
    "জ্বর",
    "তীব্র মাথাব্যথা",
    "ফুসফুসের প্লুরা গহ্বরে",
    "ব্রঙ্কাসে",
    "অ্যালভিওলাসে",
    "ট্রাকিয়ায়",
    "ম্যাক্সিলারি",
    "ফ্রন্টাল",
    "স্কেটেনয়েড",
    "এথময়েড",
    "৪০ mmHg",
    "৪৬ mmHg",
    "৬০ mmHg",
    "৭০ mmHg",
    "ডান ব্রঙ্কাস ছোট ও সরু",
    "বাম ব্রঙ্কাস খাটো ও চওড়া",
    "ডান ব্রঙ্কাস খাটো ও চওড়া",
    "হাইলাম দিয়ে বের হয়",
    "Chronic Obstructive Pleural Disease",
    "Chronic Obstructive Pulmonary Disease",
    "Central Obstructive Pulmonary Disease",
    "Chronic Obsessive Pulmonary Disease"
  ],
  "answers": [
    1,
    2,
    3,
    0,
    3,
    1,
    2,
    1
  ],
  "explanations": [
    "✔ সঠিক: ০.০৪% (নিঃশ্বাসে থাকে ৪%)।",
    "✔ সঠিক: অ্যালভিওলাসের প্রাচীর থেকে (পৃষ্ঠটান কমাতে)।",
    "✔ সঠিক: মাথাব্যথা।",
    "✔ সঠিক: ফুসফুসের দুই স্তরী প্লুরা পর্দার মাঝে ঘর্ষণ রোধ করতে।",
    "✔ সঠিক: এথময়েড (Ethmoid) সাইনাস।",
    "✔ সঠিক: প্রায় ৪৬ mmHg।",
    "✔ সঠিক: ডান ব্রঙ্কাস অপেক্ষাকৃত খাটো এবং চওড়া।",
    "✔ সঠিক: Chronic Obstructive Pulmonary Disease।"
  ]
}
JSON

errors = []

def read_utf8(path) = File.read(path, encoding: "UTF-8")

def conv04_phase_order(value)
  match = PHASE_PATTERN.match(value.to_s.strip)
  return nil unless match
  [match[1].ord, match[2] ? match[2].to_i : 0, match[3] ? match[3].to_i : 0]
end

def authorized_contrast_transform(source)
  source
    .sub(
      "@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }",
      "@keyframes slideUp { from { transform: translateY(20px); } to { transform: translateY(0); } }"
    )
    .sub(
      "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }",
      "@keyframes fadeIn { from { transform: translateY(4px); } to { transform: translateY(0); } }"
    )
end

[BANK, RUNTIME, AUTH, MANIFEST, DOC, AUTH_DOC, STATE, BROWSER, WORKFLOW].each do |path|
  errors << "Missing D-06 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

if BANK.file?
  source = read_utf8(BANK)
  questions = source.scan(/<div class="q-text"[^>]*>([\s\S]*?)<\/div>/).flatten.map(&:strip)
  options = source.scan(/<button[^>]*class="opt"[^>]*data-assessment-option[^>]*>([\s\S]*?)<\/button>/).flatten.map(&:strip)
  answers = source.scan(/data-assessment-question\s+data-a="(\d+)"/).flatten.map(&:to_i)
  explanations = source.scan(/<div class="exp"[^>]*data-assessment-explanation[^>]*>([\s\S]*?)<\/div>/).flatten.map(&:strip)

  errors << "D-06 question text changed" unless questions == EXPECTED_CONTENT.fetch("questions")
  errors << "D-06 option text changed" unless options == EXPECTED_CONTENT.fetch("options")
  errors << "D-06 answer keys changed" unless answers == EXPECTED_CONTENT.fetch("answers")
  errors << "D-06 authored explanations changed" unless explanations == EXPECTED_CONTENT.fetch("explanations")

  errors << "Shared authored runtime hook missing" unless source.include?("/assets/js/learning/academic-assessment-runtime.js")
  errors << "Authored assessment root missing" unless source.include?('data-assessment-runtime="authored-v1"')
  errors << "Zoology repair target missing" unless source.include?('data-source-return="/biology/hsc-corner/zoology/"')
  errors << "900-second timer missing" unless source.include?('data-time-limit="900"')
  errors << "15:00 initial timer text missing" unless source.include?("⏱️ 15:00")
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
    errors << "Shared authored runtime changed without D-06 authority" unless current_runtime == base_runtime
  else
    errors << "Unable to authenticate shared runtime against D-06 base: #{base_runtime.strip}"
  end
end

if AUTH.file?
  data = JSON.parse(read_utf8(AUTH))
  errors << "D-06 authorization schema mismatch" unless data["schema"] == "lbfl-assessment-runtime-third-bank-authorization-v1"
  errors << "D-06 authorization version mismatch" unless data["version"] == "CONV-04D-06-authorization-1.1.0"
  errors << "D-06 authorization base mismatch" unless data["authorized_base"] == BASE
  errors << "D-06 authorization route mismatch" unless data["route"] == "/mcq-arena/academic/zoology-respiratory-system-mcq-5/"
  errors << "D-06 authorization timer mismatch" unless data["legacy_time_limit_seconds"] == 900
  preserved = data["content_preservation"] || {}
  errors << "D-06 authorization question corpus drift" unless preserved["questions"] == EXPECTED_CONTENT.fetch("questions")
  errors << "D-06 authorization option corpus drift" unless preserved["options"] == EXPECTED_CONTENT.fetch("options")
  errors << "D-06 authorization answer corpus drift" unless preserved["answer_keys"] == EXPECTED_CONTENT.fetch("answers")
  errors << "D-06 authorization explanation corpus drift" unless preserved["authored_explanations"] == EXPECTED_CONTENT.fetch("explanations")
  errors << "D-06 future compatibility model missing" unless data.dig("future_phase_compatibility","certification_model") == "bootstrap-plus-retained"
end


# Historical D-06 authorization is immutable provenance after the authorization head.
if AUTH.file?
  current_auth = read_utf8(AUTH)
  authorized_auth, auth_status = Open3.capture2e("git", "-C", ROOT.to_s, "show", "#{AUTHORIZATION_HEAD}:_data/academic/assessment_runtime_third_bank_authorization_v1.json")
  if auth_status.success?
    errors << "D-06 authorization manifest changed after authorization head" unless current_auth == authorized_auth
  else
    errors << "Unable to authenticate D-06 authorization manifest at #{AUTHORIZATION_HEAD}: #{authorized_auth.strip}"
  end
end

if AUTH_DOC.file?
  current_auth_doc = read_utf8(AUTH_DOC)
  authorized_auth_doc, auth_doc_status = Open3.capture2e("git", "-C", ROOT.to_s, "show", "#{AUTHORIZATION_HEAD}:docs/academic/conv04/ASSESSMENT_RUNTIME_THIRD_BANK_AUTHORIZATION.md")
  if auth_doc_status.success?
    errors << "D-06 authorization document changed after authorization head" unless current_auth_doc == authorized_auth_doc
  else
    errors << "Unable to authenticate D-06 authorization document at #{AUTHORIZATION_HEAD}: #{authorized_auth_doc.strip}"
  end
end

if MANIFEST.file?
  data = JSON.parse(read_utf8(MANIFEST))
  errors << "D-06 manifest schema mismatch" unless data["schema"] == "lbfl-assessment-runtime-third-bank-v1"
  errors << "D-06 manifest version mismatch" unless data["version"] == "CONV-04D-06-1.0.0"
  errors << "D-06 manifest base mismatch" unless data["authorized_base"] == BASE
  errors << "D-06 authorization head mismatch" unless data["authorization_head"] == AUTHORIZATION_HEAD
  errors << "D-06 route mismatch" unless data["route"] == "/mcq-arena/academic/zoology-respiratory-system-mcq-5/"
  errors << "D-06 runtime mismatch" unless data["runtime"] == "assets/js/learning/academic-assessment-runtime.js"
  errors << "D-06 runtime policy mismatch" unless data["runtime_policy"] == "reuse-unchanged-by-default"
  errors << "D-06 source-return mismatch" unless data["source_return"] == "/biology/hsc-corner/zoology/"
  errors << "D-06 timer mismatch" unless data["time_limit_seconds"] == 900
  errors << "D-06 canonical loop mismatch" unless data["canonical_loop"] == %w[Attempt Feedback Repair Reattempt]
  errors << "D-06 question count mismatch" unless data.dig("content_preservation","questions") == 8
  errors << "D-06 option count mismatch" unless data.dig("content_preservation","options") == 32
  errors << "D-06 answer-key count mismatch" unless data.dig("content_preservation","answer_keys") == 8
  errors << "D-06 explanation count mismatch" unless data.dig("content_preservation","authored_explanations") == 8
  errors << "D-06 retained model mismatch" unless data.dig("future_phase_compatibility","model") == "bootstrap-plus-retained"
end

if DOC.file?
  doc = read_utf8(DOC)
  [
    "Attempt → Feedback → Repair → Reattempt",
    "assets/js/learning/academic-assessment-runtime.js",
    "/biology/hsc-corner/zoology/",
    "32 option texts",
    "8 authored explanations",
    "900-second",
    "bootstrap contract + retained contract",
    "expected_main_sha"
  ].each do |needle|
    errors << "D-06 implementation document missing: #{needle}" unless doc.include?(needle)
  end
end

certification_mode = ENV.fetch("CERTIFICATION_MODE", "local")
comparison_base = ENV["PR_BASE_SHA"].to_s.strip
if comparison_base.empty?
  parent_stdout, parent_status = Open3.capture2e("git", "-C", ROOT.to_s, "rev-parse", "HEAD^")
  comparison_base = parent_status.success? ? parent_stdout.strip : BASE
end

bootstrap_pr = certification_mode == "pull_request" && comparison_base == BASE
future_phase_pr = certification_mode == "pull_request" && comparison_base != BASE

if STATE.file?
  state = read_utf8(STATE)
  if bootstrap_pr
    errors << "CONV04_STATE must identify D-06" unless state.include?("phase: CONV-04D-06")
    errors << "CONV04_STATE must bind D-06 base" unless state.include?(BASE)
    errors << "Exact D-06 learner authority missing" unless state.include?("learner_mutation_allowlist:\n  - _mcq-arena/academic/zoology-respiratory-system-mcq-5.md")
    errors << "Shared runtime reuse policy missing" unless state.include?("shared_authored_runtime: reuse unchanged by default")
    errors << "Future-compatible D-06 model missing" unless state.include?("bootstrap + retained modes")
    errors << "BOT-08 must remain frozen" unless state.include?("bot_08: frozen")
  else
    errors << "CONV-04 programme identity missing" unless state.include?("programme: CONV-04")
  end
end

stdout, status = Open3.capture2e("git", "-C", ROOT.to_s, "diff", "--name-only", "#{comparison_base}...HEAD")
if status.success?
  changed = stdout.lines.map(&:strip).reject(&:empty?).sort

  if bootstrap_pr
    unexpected = changed - ALLOWED_FILES.sort
    missing = ALLOWED_FILES.sort - changed
    errors << "Unexpected D-06 changed files: #{unexpected.join(', ')}" unless unexpected.empty?
    errors << "Expected D-06 files not changed: #{missing.join(', ')}" unless missing.empty?
  elsif future_phase_pr
    candidate_state = STATE.file? ? read_utf8(STATE) : ""
    candidate_phase_lines = candidate_state.lines.grep(/^phase:\s*/)
    candidate_phase = candidate_phase_lines.length == 1 ? candidate_phase_lines.first.sub(/^phase:\s*/, "").strip : nil
    contrast_remediation =
      candidate_phase == CONTRAST_REMEDIATION_PHASE &&
      candidate_state.include?("authorized_base: #{comparison_base}") &&
      candidate_state.include?("learner_mutation_allowlist:\n  - _mcq-arena/academic/zoology-respiratory-system-mcq-5.md")

    if contrast_remediation
      unexpected = changed - CONTRAST_REMEDIATION_FILES
      missing = CONTRAST_REMEDIATION_FILES - changed
      errors << "Unexpected D-06 contrast-remediation files: #{unexpected.join(', ')}" unless unexpected.empty?
      errors << "Missing D-06 contrast-remediation files: #{missing.join(', ')}" unless missing.empty?

      base_bank, base_bank_status = Open3.capture2e(
        "git", "-C", ROOT.to_s, "show",
        "#{comparison_base}:_mcq-arena/academic/zoology-respiratory-system-mcq-5.md"
      )
      if base_bank_status.success?
        errors << "D-06 contrast remediation exceeded the exact animation-only transform" unless
          read_utf8(BANK) == authorized_contrast_transform(base_bank)
      else
        errors << "Unable to authenticate D-06 contrast-remediation bank baseline: #{base_bank.strip}"
      end

      unless CONTRAST_AUTH_DOC.file?
        errors << "D-06 contrast-remediation authorization document missing"
      else
        contrast_doc = read_utf8(CONTRAST_AUTH_DOC)
        errors << "D-06 contrast-remediation authorization must bind exact base" unless contrast_doc.include?("Exact base: `#{comparison_base}`")
        errors << "D-06 contrast-remediation authorization must prohibit content rewrite" unless contrast_doc.include?("Scientific/question/answer/explanation rewrite: **PROHIBITED**")
      end

      touched_protected = (changed & PROTECTED_AFTER_MERGE) - [
        ".github/scripts/validate-assessment-runtime-third-bank.rb",
        "_mcq-arena/academic/zoology-respiratory-system-mcq-5.md"
      ]
      errors << "D-06 contrast remediation changed other protected artifacts: #{touched_protected.join(', ')}" unless touched_protected.empty?
    else
      touched_protected = changed & PROTECTED_AFTER_MERGE
      errors << "Future phase changed protected D-06 artifacts: #{touched_protected.join(', ')}" unless touched_protected.empty?
    end

    if changed.include?("docs/academic/conv04/CONV04_STATE.md")
      base_state, base_state_status = Open3.capture2e(
        "git", "-C", ROOT.to_s, "show",
        "#{comparison_base}:docs/academic/conv04/CONV04_STATE.md"
      )

      if candidate_phase_lines.length != 1
        errors << "Future phase CONV04_STATE must contain exactly one phase declaration"
      elsif !base_state_status.success?
        errors << "Unable to read base CONV04_STATE at #{comparison_base}: #{base_state.strip}"
      else
        base_phase_lines = base_state.lines.grep(/^phase:\s*/)
        if base_phase_lines.length != 1
          errors << "Base CONV04_STATE must contain exactly one phase declaration"
        else
          base_phase = base_phase_lines.first.sub(/^phase:\s*/, "").strip
          candidate_order = conv04_phase_order(candidate_phase)
          base_order = conv04_phase_order(base_phase)
          errors << "Future phase CONV04_STATE has malformed phase: #{candidate_phase}" unless candidate_order
          errors << "Base CONV04_STATE has malformed phase: #{base_phase}" unless base_order
          if candidate_order && base_order && (candidate_order <=> base_order) <= 0
            errors << "Future phase CONV04_STATE must advance beyond base phase #{base_phase}, got #{candidate_phase}"
          end
        end
      end
    end
  end
else
  errors << "Unable to inspect D-06 changed-file scope: #{stdout.strip}"
end

if errors.empty?
  puts "CONV-04D-06 Zoology Respiratory System Runtime Migration: PASS"
  exit 0
end

warn "CONV-04D-06 Zoology Respiratory System Runtime Migration: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
