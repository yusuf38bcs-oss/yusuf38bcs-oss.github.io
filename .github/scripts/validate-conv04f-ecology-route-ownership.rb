#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "open3"
require "pathname"

ROOT = Pathname.new(__dir__).join("../..").expand_path
BASE = "27ed06453ae6ee9398d06c52a1b44a442004774b"
PHASE = "CONV-04F-04"
PHASE_PATTERN = /\ACONV-04([A-Z])(?:-(\d{2}))?(?:-R([1-9]\d*))?\z/.freeze

ROOT_STATIC = ROOT.join("biology/higher-zoology-tree/ecology/index.html")
BN = ROOT.join("_pages/ecology-v2-gateway.bn.md")
EN = ROOT.join("_biology/higher-zoology-tree/ecology/en/index.md")
INDEX = ROOT.join("_biology/higher-zoology-tree/ecology/course-index.md")
LAYOUT = ROOT.join("_layouts/single.html")
COURSE = ROOT.join("_data/academic/course_contract_v1.json")
LEDGER = ROOT.join("docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json")
STATE = ROOT.join("docs/academic/conv04/CONV04_STATE.md")
AUTH = ROOT.join("_data/academic/conv04f04_ecology_route_ownership_v1.json")
MANIFEST = ROOT.join("_data/academic/conv04f04_ecology_v1.json")
AUTH_DOC = ROOT.join("docs/academic/conv04/ECOLOGY_ROUTE_OWNERSHIP.md")
DOC = ROOT.join("docs/academic/conv04/ECOLOGY_F04_CONVERGENCE.md")
BROWSER = ROOT.join(".github/scripts/conv04f-ecology-browser-certification.mjs")
WORKFLOW = ROOT.join(".github/workflows/conv04f-ecology-route-certification.yml")
CONFIG = ROOT.join("_config.yml")

CTA = "{% include education/learning-guide-cta.html %}"

BOOTSTRAP_FILES = %w[
  .github/scripts/conv04f-ecology-browser-certification.mjs
  .github/scripts/validate-conv04f-ecology-route-ownership.rb
  .github/workflows/conv04f-ecology-route-certification.yml
  _config.yml
  _biology/higher-zoology-tree/ecology/course-index.md
  _biology/higher-zoology-tree/ecology/en/index.md
  _data/academic/conv04f04_ecology_route_ownership_v1.json
  _data/academic/conv04f04_ecology_v1.json
  _layouts/single.html
  _pages/ecology-v2-gateway.bn.md
  biology/higher-zoology-tree/ecology/index.html
  docs/academic/conv04/ACADEMIC_ROUTE_LEDGER.json
  docs/academic/conv04/CONV04_STATE.md
  docs/academic/conv04/ECOLOGY_F04_CONVERGENCE.md
  docs/academic/conv04/ECOLOGY_ROUTE_OWNERSHIP.md
].freeze

IMMUTABLE_F04 = %w[
  .github/scripts/conv04f-ecology-browser-certification.mjs
  .github/scripts/validate-conv04f-ecology-route-ownership.rb
  .github/workflows/conv04f-ecology-route-certification.yml
  _data/academic/conv04f04_ecology_route_ownership_v1.json
  _data/academic/conv04f04_ecology_v1.json
  docs/academic/conv04/ECOLOGY_F04_CONVERGENCE.md
  docs/academic/conv04/ECOLOGY_ROUTE_OWNERSHIP.md
].freeze

errors = []

def need(condition, message)
  errors = Thread.current[:errors]
  errors << message unless condition
end

Thread.current[:errors] = errors

def read_utf8(path)
  File.read(path, encoding: "UTF-8")
end

def front_matter(source)
  return "" unless source.start_with?("---")
  source.split(/^---\s*$\n?/, 3)[1].to_s
end

def fm_value(source, key)
  line = front_matter(source).lines.find { |l| l.match?(/\A#{Regexp.escape(key)}:\s*/) }
  return nil unless line
  v=line.sub(/\A#{Regexp.escape(key)}:\s*/,"").strip
  v=v[1..-2] if v.length>=2 && ((v.start_with?('"')&&v.end_with?('"'))||(v.start_with?("'")&&v.end_with?("'")))
  v
end

def git_show(relative, ref=BASE)
  Open3.capture2e("git","-C",ROOT.to_s,"show","#{ref}:#{relative}")
end

def git(*args)
  Open3.capture2e("git","-C",ROOT.to_s,*args)
end

def phase_order(value)
  m=PHASE_PATTERN.match(value.to_s.strip)
  return nil unless m
  [m[1].ord, m[2] ? m[2].to_i : 0, m[3] ? m[3].to_i : 0]
end

def strip_academic_additions(source)
  cleaned=source.gsub("\n\n#{CTA}\n","\n")
  cleaned=cleaned.gsub(%Q(<div class="lbfl-academic-table-wrap" tabindex="0" role="region" aria-label="Ecology lecture sequence" markdown="1">\n\n), "")
  cleaned=cleaned.gsub("\n\n</div>\n\n[Back to Ecology]", "\n\n[Back to Ecology]")
  cleaned.lines.reject do |line|
    line.match?(/\A(?:academic_system:\s*v1|academic_role:\s*academic_gateway|learning_guide:\s*canonical)\s*\z/)
  end.join
end

[ROOT_STATIC,BN,EN,INDEX,LAYOUT,COURSE,LEDGER,STATE,AUTH,MANIFEST,AUTH_DOC,DOC,BROWSER,WORKFLOW,CONFIG].each do |p|
  errors << "Missing F-04 artifact: #{p.relative_path_from(ROOT)}" unless p.file?
end

auth=AUTH.file? ? JSON.parse(read_utf8(AUTH)) : {}
manifest=MANIFEST.file? ? JSON.parse(read_utf8(MANIFEST)) : {}

need(auth["schema"]=="lbfl-conv04f04-ecology-route-ownership-authorization-v1","F-04 authorization schema drift")
need(auth["authorized_base"]==BASE,"F-04 authorization base drift")
need(auth["status"]=="authorized-route-ownership-correction-not-implemented","Historical F-04 authorization record must remain immutable")
need(manifest["schema"]=="lbfl-conv04f04-ecology-convergence-v1","F-04 manifest schema drift")
need(manifest["authorized_base"]==BASE,"F-04 manifest base drift")

root=ROOT_STATIC.file? ? read_utf8(ROOT_STATIC) : ""
need(root.include?('<html lang="en">'),"Compatibility root must declare English language")
need(root.include?('rel="canonical" href="https://learningbiologyforlife.org/biology/higher-zoology-tree/ecology/course-index/"'),"Compatibility root canonical target drift")
need(root.include?('href="/biology/higher-zoology-tree/ecology/course-index/"'),"Compatibility root missing canonical course link")
need(root.include?('href="/en/biology/higher-zoology-tree/ecology/"'),"Compatibility root missing English gateway link")
need(root.include?('href="/bn/biology/higher-zoology-tree/ecology/"'),"Compatibility root missing Bangla gateway link")
need(!root.match?(/<style\b|\sstyle\s*=/i),"Compatibility root must not carry a local style layer")
need(root.scan(/<h1\b/i).length==1,"Compatibility root must contain exactly one H1")

{
  BN=>["bn","/biology/higher-zoology-tree/ecology/"],
  EN=>["en","/en/biology/higher-zoology-tree/ecology/"],
  INDEX=>["en","/biology/higher-zoology-tree/ecology/course-index/"]
}.each do |path,(lang,permalink)|
  next unless path.file?
  source=read_utf8(path)
  need(fm_value(source,"academic_system")=="v1","#{path.basename}: academic_system must be v1")
  need(fm_value(source,"academic_role")=="academic_gateway","#{path.basename}: academic_role must be academic_gateway")
  need(fm_value(source,"learning_guide")=="canonical","#{path.basename}: Learning Guide ownership must be canonical")
  need(fm_value(source,"lang")==lang,"#{path.basename}: lang mismatch")
  need(fm_value(source,"language")==lang,"#{path.basename}: legacy language must agree with lang")
  need(fm_value(source,"permalink")==permalink,"#{path.basename}: source permalink drift")
  need(source.scan(CTA).length==1,"#{path.basename}: exactly one canonical Learning Guide CTA required")
  need(!source.match?(/<style\b|\sstyle\s*=/i),"#{path.basename}: local style debt not authorized")
  if path == INDEX
    need(source.include?('<div class="lbfl-academic-table-wrap" tabindex="0" role="region" aria-label="Ecology lecture sequence" markdown="1">'), "Ecology course index table must use the Academic-v1 accessible table wrapper")
  end
end

config=CONFIG.file? ? read_utf8(CONFIG) : ""
need(config.include?("exclude_from_localization:\n") && config.include?("  - biology/higher-zoology-tree/ecology/index.html\n"), "Polyglot must exclude the exact Ecology static compatibility owner from localization")
need(config.scan(/^\s*- biology\/higher-zoology-tree\/ecology\/index\.html\s*$/).length==1, "Ecology static localization exclusion must appear exactly once")

layout=LAYOUT.file? ? read_utf8(LAYOUT) : ""
expected_layout=%q({% if lbfl_ecology_surface %}
          {% if page.academic_system == 'v1' %}
            {% include components/educational-boundary.html %}
          {% endif %}
        {% else %}
          {% include components/educational-boundary.html %}
        {% endif %})
need(layout.include?(expected_layout),"Single layout missing conditional Academic-v1 Ecology boundary rule")

course_now=COURSE.file? ? read_utf8(COURSE) : ""
course_base,status=git_show("_data/academic/course_contract_v1.json")
need(status.success? && course_now==course_base,"Ecology course contract must remain byte-identical to authorized base")

if LEDGER.file?
  ledger=JSON.parse(read_utf8(LEDGER))
  expected={
    "ecology-course-index"=>["/biology/higher-zoology-tree/ecology/course-index/","_biology/higher-zoology-tree/ecology/course-index.md","en"],
    "ecology-gateway-en"=>["/en/biology/higher-zoology-tree/ecology/","_biology/higher-zoology-tree/ecology/en/index.md","en"],
    "ecology-gateway-bn"=>["/bn/biology/higher-zoology-tree/ecology/","_pages/ecology-v2-gateway.bn.md","bn"]
  }
  expected.each do |id,(route,source,lang)|
    row=Array(ledger["routes"]).find{|x|x["id"]==id}
    need(!row.nil?,"Ledger missing #{id}")
    next unless row
    need(row["canonical_route"]==route,"#{id}: route drift")
    need(row["source_file"]==source,"#{id}: source-owner drift")
    need(row["academic_role"]=="academic_gateway","#{id}: role drift")
    need(row["language"]==lang,"#{id}: language drift")
    need(row["boundary_owner"]=="layout","#{id}: boundary owner drift")
    need(row["learning_guide_owner"]=="canonical","#{id}: Learning Guide owner drift")
    need(row["assessment_owner"]=="mcq-arena","#{id}: assessment owner drift")
    need(row["enforcement"]=="strict","#{id}: must remain strict")
    need(Array(row["source_debt"]).empty? && Array(row["live_debt"]).empty?,"#{id}: strict route cannot carry debt")
  end
end

mode=ENV.fetch("CERTIFICATION_MODE","local")
comparison_base=ENV["PR_BASE_SHA"].to_s.strip
if comparison_base.empty?
  parent,status=git("rev-parse","HEAD^")
  comparison_base=status.success? ? parent.strip : BASE
end
bootstrap=mode=="pull_request" && comparison_base==BASE
future=mode=="pull_request" && comparison_base!=BASE

if bootstrap
  {
    "_pages/ecology-v2-gateway.bn.md"=>BN,
    "_biology/higher-zoology-tree/ecology/en/index.md"=>EN,
    "_biology/higher-zoology-tree/ecology/course-index.md"=>INDEX
  }.each do |relative,path|
    base_source,status=git_show(relative)
    need(status.success?,"Unable to authenticate #{relative} baseline")
    need(strip_academic_additions(read_utf8(path))==base_source,"#{relative}: changed outside authorized Academic-v1 metadata/CTA additions") if status.success?
  end

  base_config,status=git_show("_config.yml")
  if status.success?
    expected_config=base_config.sub("  - scripts\nparallel_localization: false","  - scripts\n  - biology/higher-zoology-tree/ecology/index.html\nparallel_localization: false")
    need(config==expected_config,"_config.yml changed outside exact Ecology static localization exclusion")
  else
    errors << "Unable to authenticate _config.yml baseline"
  end

  base_layout,status=git_show("_layouts/single.html")
  if status.success?
    reconstructed=layout.sub(expected_layout,%q({% unless lbfl_ecology_surface %}
          {% include components/educational-boundary.html %}
        {% endunless %}))
    need(reconstructed==base_layout,"_layouts/single.html changed outside authorized Ecology boundary condition")
  else
    errors << "Unable to authenticate single layout baseline"
  end
end

stdout,status=git("diff","--name-only","#{comparison_base}...HEAD")
if status.success?
  changed=stdout.lines.map(&:strip).reject(&:empty?).sort
  if bootstrap
    missing=BOOTSTRAP_FILES.sort-changed
    unexpected=changed-BOOTSTRAP_FILES.sort
    errors << "F-04 expected changed files missing: #{missing.join(', ')}" unless missing.empty?
    errors << "F-04 unexpected changed files: #{unexpected.join(', ')}" unless unexpected.empty?
  elsif future
    forbidden=changed & IMMUTABLE_F04
    errors << "Successor phase changed immutable F-04 artifacts: #{forbidden.join(', ')}" unless forbidden.empty?
    if changed.include?("docs/academic/conv04/CONV04_STATE.md")
      base_state,status=git_show("docs/academic/conv04/CONV04_STATE.md",comparison_base)
      if status.success?
        b=base_state[/^phase:\s*(\S+)/,1]
        c=read_utf8(STATE)[/^phase:\s*(\S+)/,1]
        bo=phase_order(b); co=phase_order(c)
        need(bo && co && (co<=>bo)>0,"Successor CONV04_STATE must advance monotonically")
      else
        errors << "Unable to authenticate base CONV04_STATE"
      end
    end
  end
else
  errors << "Unable to inspect F-04 changed-file scope"
end

if errors.empty?
  puts "CONV-04F-04 Ecology route ownership + Academic-v1 convergence: PASS"
  exit 0
end
warn "CONV-04F-04 Ecology route ownership + Academic-v1 convergence: FAIL"
errors.each{|e|warn "- #{e}"}
exit 1
