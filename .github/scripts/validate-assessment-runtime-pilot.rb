#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "b74f47c19508aed4ffd122d4fd7b9a8044419b20"
PILOT = ROOT.join("_mcq-arena/academic/botany-cell-biology-mcq-1.md")
RUNTIME = ROOT.join("assets/js/learning/academic-assessment-runtime.js")
MANIFEST = ROOT.join("_data/academic/assessment_runtime_pilot_v1.json")
DOC = ROOT.join("docs/academic/conv04/ASSESSMENT_RUNTIME_PILOT.md")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
BROWSER = ROOT.join(".github/scripts/assessment-runtime-pilot-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/assessment-runtime-pilot-certification.yml")

ALLOWED_FILES = %w[
  .github/scripts/assessment-runtime-pilot-browser-certification.mjs
  .github/scripts/validate-assessment-runtime-pilot.rb
  .github/workflows/assessment-runtime-pilot-certification.yml
  _data/academic/assessment_runtime_pilot_v1.json
  _mcq-arena/academic/botany-cell-biology-mcq-1.md
  assets/js/learning/academic-assessment-runtime.js
  docs/academic/conv04/ASSESSMENT_RUNTIME_PILOT.md
  docs/academic/conv04/CONV04_STATE.md
].freeze

EXPECTED_CONTENT = JSON.parse(<<~JSON)
{
  "questions": [
    "১. প্রোটোপ্লাজম কেন জীবনের ভৌত ভিত্তি?",
    "২. ফ্লিপ-ফ্লপ মুভমেন্ট (Flip-flop movement) কী নির্দেশ করে?",
    "৩. গ্লাইকোক্যালিক্স নষ্ট হলে কী হবে?",
    "৪. গলগি বডি কেন ট্রাফিক পুলিশ?",
    "৫. অটোফ্যাগী কীভাবে সাহায্য করে?",
    "৬. Cyclosis বন্ধ হলে কী হবে?",
    "৭. রাইবোজোম কেন প্রোটিন ফ্যাক্টরি?",
    "৮. ER এর পার্থক্য কী?",
    "৯. ক্রিস্টি কেন ভাঁজ করা থাকে?",
    "১০. ব্যাকটেরিয়া কীভাবে শক্তি উৎপাদন করে?"
  ],
  "options": [
    "DNA থাকে",
    "আকার দেয়",
    "সব জৈবিক ক্রিয়া হয়",
    "পানি বেশি থাকে",
    "দৃঢ়তা",
    "তরলতা",
    "অভেদ্যতা",
    "বিভাজন",
    "শক্তি বন্ধ হবে",
    "প্রোটিন বন্ধ হবে",
    "কোষ শনাক্ত করতে পারবে না",
    "ক্রোমোজোম কমবে",
    "শত্রু আটকায়",
    "প্যাকেজিং ও গন্তব্যে পাঠায়",
    "বিভাজন করে",
    "শক্তি তৈরি করে",
    "খাদ্য তৈরি করে",
    "নিজ অঙ্গাণু ভেঙে শক্তি দেয়",
    "বিভাজন বাড়ায়",
    "পানি বাড়ায়",
    "DNA নষ্ট হবে",
    "কোষের ভেতর সাইটোপ্লাজমিক পরিবহন বন্ধ হবে",
    "পর্দা ফেটে যাবে",
    "আকার বাড়বে",
    "DNA তৈরি করে",
    "মুক্ত থাকে",
    "প্রোটিন তৈরি করে",
    "বড় অঙ্গাণু",
    "লিপিড/প্রোটিন উল্টো",
    "RER প্রোটিন, SER লিপিড তৈরি করে",
    "শক্তি উৎপাদন",
    "DNA রক্ষা",
    "ছোট দেখায়",
    "Surface area বা কর্মক্ষেত্র বাড়ায়",
    "প্রোটিন জমা রাখে",
    "DNA রক্ষা করে",
    "করে না",
    "সূর্য শোষণ করে",
    "মেসোজোম ব্যবহার করে",
    "রাইবোজোম দিয়ে"
  ],
  "answers": [
    2,
    1,
    2,
    1,
    1,
    1,
    2,
    1,
    1,
    2
  ],
  "explanations": [
    "✔ সঠিক: সব জৈবিক ক্রিয়া এখানেই হয়।",
    "✔ সঠিক: এটি প্লাজমা মেমব্রেনের তরলতা বা ফ্লুইডিটি প্রমাণ করে।",
    "✔ সঠিক: কোষ তার সেলফ-আইডেন্টিটি হারাবে এবং ইমিউন সিস্টেম তাকে চিনতে পারবে না।",
    "✔ সঠিক: এটি প্রোটিন প্যাকেজিং ও গন্তব্য নির্ধারণ করে।",
    "✔ সঠিক: খাদ্যাভাবে লাইসোজোম নিজ অঙ্গাণু ভেঙে কোষকে শক্তি দেয়।",
    "✔ সঠিক: অভ্যন্তরীণ পরিবহন ব্যাহত হবে।",
    "✔ সঠিক: এটি mRNA ডিকোড করে প্রোটিন সংশ্লেষণ করে।",
    "✔ সঠিক: অমসৃণ এন্ডোপ্লাজমিক রেটিকুলাম (RER) প্রোটিন এবং মসৃণ (SER) লিপিড তৈরি করে।",
    "✔ সঠিক: বেশি পরিমাণ ATP উৎপাদনের জন্য।",
    "✔ সঠিক: মেসোজোম (Mesosome) ব্যাকটেরিয়ার শক্তিঘর হিসেবে কাজ করে।"
  ]
}
JSON

errors = []

PHASE_PATTERN = /\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.freeze

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def conv04_phase_order(value)
  match = PHASE_PATTERN.match(value.to_s.strip)
  return nil unless match

  lane = match[1].ord
  stage = match[2] ? match[2].to_i : 0
  revision = match[3] ? match[3].to_i : 0
  [lane, stage, revision]
end

[PILOT, RUNTIME, MANIFEST, DOC, STATE, BROWSER, WORKFLOW].each do |path|
  errors << "Missing D-04 artifact: #{path.relative_path_from(ROOT)}" unless path.file?
end

if PILOT.file?
  source = read_utf8(PILOT)

  questions = source.scan(/<div class="q-text"[^>]*>([\s\S]*?)<\/div>/).flatten.map(&:strip)
  options = source.scan(/<button[^>]*class="opt"[^>]*data-assessment-option[^>]*>([\s\S]*?)<\/button>/).flatten.map(&:strip)
  answers = source.scan(/data-assessment-question\s+data-a="(\d+)"/).flatten.map(&:to_i)
  explanations = source.scan(/<div class="exp"[^>]*data-assessment-explanation[^>]*>([\s\S]*?)<\/div>/).flatten.map(&:strip)

  errors << "Pilot question text changed" unless questions == EXPECTED_CONTENT.fetch("questions")
  errors << "Pilot option text changed" unless options == EXPECTED_CONTENT.fetch("options")
  errors << "Pilot answer keys changed" unless answers == EXPECTED_CONTENT.fetch("answers")
  errors << "Pilot authored explanations changed" unless explanations == EXPECTED_CONTENT.fetch("explanations")

  errors << "Shared authored runtime hook missing" unless source.include?("/assets/js/learning/academic-assessment-runtime.js")
  errors << "Authored assessment root missing" unless source.include?('data-assessment-runtime="authored-v1"')
  errors << "Botany repair target missing" unless source.include?('data-source-return="/biology/hsc-corner/botany/"')
  errors << "Submit control missing" unless source.include?("data-assessment-submit")
  errors << "Reattempt control missing" unless source.include?("data-assessment-retry")
  errors << "Result status region missing" unless source.include?("data-assessment-results")
  errors << "Legacy initQuiz call remains" if source.include?("initQuiz(")
  errors << "Legacy submitQuiz call remains" if source.include?("submitQuiz(")
  errors << "Inline onclick remains in D-04 pilot" if source.include?("onclick=")
  errors << "Question groups must expose radiogroup semantics" unless source.scan('role="radiogroup"').length == 10
  errors << "Options must expose radio semantics" unless source.scan('role="radio"').length == 40
  errors << "Question groups must be labelled by prompts" unless source.scan(/aria-labelledby="q\d+-label"/).length == 10
end

if RUNTIME.file?
  source = read_utf8(RUNTIME)
  [
    "data-assessment-question",
    "data-assessment-option",
    "data-assessment-submit",
    "data-assessment-retry",
    "dataset.assessmentRepair",
    "aria-checked",
    "prefers-reduced-motion",
    "deadlineAt",
    "Date.now()",
    "ArrowRight",
    "tabIndex",
    "submitButton.disabled",
    "Assessment feedback",
    "Review the marked answers and authored explanations before your next attempt."
  ].each do |needle|
    errors << "Shared runtime missing behavior marker: #{needle}" unless source.include?(needle)
  end
  errors << "Shared runtime must not depend on SynapticAI" if source.include?("SynapticAI")
  errors << "Shared runtime must not insert diagnostic framing" if source.match?(/diagnostic|neural retention|cognitive (?:ability|gap|model)/i)
end

if MANIFEST.file?
  data = JSON.parse(read_utf8(MANIFEST))
  errors << "Pilot manifest schema mismatch" unless data["schema"] == "lbfl-assessment-runtime-pilot-v1"
  errors << "Pilot manifest version mismatch" unless data["version"] == "CONV-04D-04-1.0.0"
  errors << "Pilot manifest base mismatch" unless data["authorized_base"] == BASE
  errors << "Pilot route mismatch" unless data["route"] == "/mcq-arena/academic/botany-cell-biology-mcq-1/"
  errors << "Pilot runtime mismatch" unless data["runtime"] == "assets/js/learning/academic-assessment-runtime.js"
  errors << "Pilot source-return mismatch" unless data["source_return"] == "/biology/hsc-corner/botany/"
  errors << "Pilot canonical loop mismatch" unless data["canonical_loop"] == %w[Attempt Feedback Repair Reattempt]
  errors << "Pilot question count mismatch" unless data.dig("content_preservation","questions") == 10
  errors << "Pilot option count mismatch" unless data.dig("content_preservation","options") == 40
  errors << "Pilot explanation count mismatch" unless data.dig("content_preservation","authored_explanations") == 10
end

if DOC.file?
  doc = read_utf8(DOC)
  [
    "Attempt → Feedback → Repair → Reattempt",
    "assets/js/learning/academic-assessment-runtime.js",
    "/biology/hsc-corner/botany/",
    "40 option texts",
    "10 authored explanations"
  ].each do |needle|
    errors << "D-04 implementation document missing: #{needle}" unless doc.include?(needle)
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
    errors << "CONV04_STATE must identify D-04" unless state.include?("phase: CONV-04D-04")
    errors << "CONV04_STATE must bind D-04 base" unless state.include?(BASE)
    errors << "Exact D-04 learner authority missing" unless state.include?("learner_mutation_allowlist:\n  - _mcq-arena/academic/botany-cell-biology-mcq-1.md")
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
    errors << "Unexpected D-04 changed files: #{unexpected.join(', ')}" unless unexpected.empty?
    errors << "Expected D-04 files not changed: #{missing.join(', ')}" unless missing.empty?
  elsif future_phase_pr
    future_phase_control_files = %w[
      .github/scripts/validate-assessment-runtime-pilot.rb
      docs/academic/conv04/CONV04_STATE.md
    ]
    protected_d04_files = ALLOWED_FILES - future_phase_control_files
    touched_protected = changed & protected_d04_files
    errors << "Future phase changed protected D-04 artifacts: #{touched_protected.join(', ')}" unless touched_protected.empty?

    if changed.include?("docs/academic/conv04/CONV04_STATE.md")
      candidate_state = read_utf8(STATE)
      candidate_phase_lines = candidate_state.lines.grep(/^phase:\s*/)
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
          candidate_phase = candidate_phase_lines.first.sub(/^phase:\s*/, "").strip
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
  errors << "Unable to inspect D-04 changed-file scope: #{stdout.strip}"
end

if errors.empty?
  puts "CONV-04D-04 Botany Cell Biology Runtime Pilot: PASS"
  exit 0
end

warn "CONV-04D-04 Botany Cell Biology Runtime Pilot: FAIL"
errors.each { |e| warn "- #{e}" }
exit 1
