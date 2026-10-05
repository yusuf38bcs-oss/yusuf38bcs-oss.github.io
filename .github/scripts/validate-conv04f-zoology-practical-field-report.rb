#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "d86325ec281e21de1a208f1a1f31ecb531821eb4"
SOURCE_REL = "_biology/higher-zoology-tree/practical/08-field-report.bn.md"
LEDGER_REL = "docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json"
MANIFEST_REL = "_data/academic/conv04f_zoology_practical_field_report_v1.json"
CTA = "{% include education/learning-guide-cta.html %}"

def git_text(*args)
  out, err, st = Open3.capture3("git", "-C", ROOT.to_s, *args)
  abort(err) unless st.success?
  out
end

def markdown_tables(source)
  out=[]; current=[]
  source.lines.each do |line|
    if line.start_with?("|"); current << line
    elsif !current.empty?; out << current.join.chomp; current=[]
    end
  end
  out << current.join.chomp unless current.empty?
  out
end

baseline = git_text("show", "#{BASE}:#{SOURCE_REL}")
candidate = File.read(ROOT.join(SOURCE_REL), encoding: "UTF-8")
expected = baseline.dup
marker = "locale: bn-BD\n"
abort "missing locale anchor" unless expected.include?(marker)
expected.sub!(marker, marker + "academic_system: v1\nacademic_role: practical\nlearning_guide: canonical\n")
h1 = "# Field Visit, Collection & Scientific Report\n\n## Syllabus Requirement"
abort "missing H1 anchor" unless expected.include?(h1)
expected.sub!(h1, "# Field Visit, Collection & Scientific Report\n\n#{CTA}\n\n## Syllabus Requirement")
tables = markdown_tables(baseline)
abort "baseline table count != 2" unless tables.length == 2
labels = ["Field Report results table", "Field Report 17-mark distribution table"]
tables.each_with_index do |table,i|
  wrapper = %(<div class="lbfl-academic-table-wrap zoology-practical-table-scroll" tabindex="0" role="region" aria-label="#{labels[i]}" markdown="1">\n\n#{table}\n\n</div>)
  expected.sub!(table, wrapper)
end
abort "R101 learner source differs from exact authorized reconstruction" unless candidate == expected

body = candidate.sub(/\A---\n.*?\n---\n/m, "")
abort "H1 drift" unless body.scan(/^# /).length == 1
abort "H2 drift" unless body.scan(/^## /).length == 11
abort "H3 drift" unless body.scan(/^### /).length == 11
abort "CTA count drift" unless candidate.scan(CTA).length == 1
abort "minimum sample custody lost" unless candidate.include?("at least **10 samples** collect")
abort "Shannon custody lost" unless candidate.include?("H'=-\\sum p_i\\ln p_i")
abort "17-mark custody lost" unless candidate.include?("**Total** | **17**")
abort "Socratic custody lost" unless candidate.scan(/^\d+\. /).length == 5

ledger = JSON.parse(File.read(ROOT.join(LEDGER_REL), encoding: "UTF-8"))
row = {
  "id"=>"higher-zoology-practical-field-report",
  "canonical_route"=>"/biology/higher-zoology-tree/practical/field-report/",
  "source_file"=>SOURCE_REL,
  "support_files"=>["_data/zoology-practical-213106-coverage.json"],
  "academic_role"=>"practical", "language"=>"bn", "boundary_owner"=>"layout",
  "learning_guide_owner"=>"canonical", "assessment_owner"=>"mcq-arena",
  "enforcement"=>"strict", "source_debt"=>[], "live_debt"=>[]
}
rows = Array(ledger["routes"]).select { |r| r["id"] == row["id"] }
abort "strict Field Report route row mismatch" unless rows.length == 1 && rows.first == row

manifest = JSON.parse(File.read(ROOT.join(MANIFEST_REL), encoding: "UTF-8"))
abort "manifest base mismatch" unless manifest["authorized_base_sha"] == BASE
abort "manifest baseline mismatch" unless manifest["baseline_blob"] == "6398c601c3a1b3cd891e8ea945d704d5d94b9711"

puts "CONV-04F-09-R101 Field Report preservation PASS"
