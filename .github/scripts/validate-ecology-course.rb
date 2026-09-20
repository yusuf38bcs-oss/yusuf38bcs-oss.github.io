#!/usr/bin/env ruby
# frozen_string_literal: true
require "yaml"; require "date"; require "pathname"; require "set"
ROOT = Pathname.new(__dir__).join("../..").expand_path
ECOLOGY = ROOT.join("_biology/higher-zoology-tree/ecology")
SITE = ROOT.join("_site")
COURSE_ID = "ecology-v2-10"
EXPECTED_PAIRS = 10
EXPECTED_PAGES = 20
BENGALI = /[\u0980-\u09FF]/

def fail!(m); warn "ECOLOGY V2-10 CERTIFICATION FAIL: #{m}"; exit 1; end

def fm(path)
  text=File.read(path,encoding:"UTF-8"); m=text.match(/\A---\s*\n(.*?)\n---\s*\n/m); fail!("missing front matter #{path}") unless m
  [YAML.safe_load(m[1],permitted_classes:[Time,Date],aliases:true)||{},text,text[m.end(0)..]||""]
end

def rendered(route); SITE.join(route.sub(%r{\A/},""),"index.html"); end

all_md=Dir.glob(ECOLOGY.join("**/*.md").to_s).sort
records=[]
all_md.each do |p|
  data,text,body=fm(p); next unless data["course_id"]==COURSE_ID && data["course_role"]=="lecture"
  records << {path:Pathname.new(p),fm:data,text:text,body:body}
end
fail!("expected #{EXPECTED_PAGES} lecture pages, found #{records.length}") unless records.length==EXPECTED_PAGES
langs=records.group_by{|r| r[:fm]["language"]}
fail!("Bangla pages must be 10") unless Array(langs["bn"]).length==10
fail!("English pages must be 10") unless Array(langs["en"]).length==10
%w[bn en].each do |lang|
  nums=langs[lang].map{|r| r[:fm]["lecture_number"].to_s}.sort
  fail!("#{lang} lecture numbers must be 01-10") unless nums==(1..10).map{|n|format("%02d",n)}
end
permalinks=records.map{|r|r[:fm]["permalink"].to_s}; nodes=records.map{|r|r[:fm]["node_id"].to_s}
fail!("duplicate permalinks") unless permalinks.uniq.length==20
fail!("duplicate node ids") unless nodes.uniq.length==20
records.each do |r|
  d=r[:fm]; body=r[:body]; lang=d["language"]
  fail!("inactive #{r[:path]}") unless d["status"]=="Active" && d["published"]==true
  fail!("framework include remains #{r[:path]}") if r[:text].include?("framework-links.html")
  fail!("LOLO/LALA branding remains #{r[:path]}") if body.match?(/\b(?:LOLO|LALA)\b/)
  fail!("H1 count !=1 #{r[:path]}") unless body.scan(/^# (?!#)/).length==1
  fail!("missing References #{r[:path]}") unless body.lines.any? { |line| line.match?(/^##\s+(?:\d+\.\s+)?References\b/i) }
  fail!("English mirror contains Bengali #{r[:path]}") if lang=="en" && r[:text].match?(BENGALI)
  mate=records.find{|x| x[:fm]["permalink"].to_s==d["translation_of"].to_s}
  fail!("translation pair missing #{r[:path]}") unless mate
  fail!("translation pair not reciprocal #{r[:path]}") unless mate[:fm]["translation_of"].to_s==d["permalink"].to_s
  fail!("translation pair order mismatch #{r[:path]}") unless mate[:fm]["lecture_number"].to_s==d["lecture_number"].to_s
  fail!("Lecture 10 points to Lecture 11 #{r[:path]}") if d["lecture_number"].to_s=="10" && body.include?("ecology-11-")
end
# No retired ecology-29 content may remain in source.
all_md.each do |p|
  data,text,body=fm(p)
  fail!("retired ecology-29 source remains: #{p}") if data["course_id"]=="ecology-29"
end
# Gateway/index identities
root_fm,root_text,=fm(ECOLOGY.join("index.md")); fail!("gateway route") unless root_fm["permalink"]=="/biology/higher-zoology-tree/ecology/"
en_fm,en_text,=fm(ECOLOGY.join("en/index.md")); fail!("English gateway route") unless en_fm["permalink"]=="/en/biology/higher-zoology-tree/ecology/"
idx_fm,idx_text,=fm(ECOLOGY.join("course-index.md")); fail!("course index route") unless idx_fm["permalink"]=="/biology/higher-zoology-tree/ecology/course-index/"
fail!("course index must expose 10 Bangla + 10 English links") unless records.all?{|r| idx_text.include?(r[:fm]["permalink"])}
# Sitemap source contract
site_map=File.read(ROOT.join("ecology-sitemap.xml"),encoding:"UTF-8")
fail!("sitemap course id") unless site_map.include?('where: "course_id", "ecology-v2-10"')
puts "ECOLOGY_V2_10_SOURCE_PASS"
puts "lecture_pairs=10"; puts "lecture_pages=20"; puts "bangla=10"; puts "english=10"; puts "retired_previous_lectures=0"
exit 0 unless SITE.directory?
records.each do |r|
  rp=rendered(r[:fm]["permalink"]); fail!("missing rendered #{r[:fm]["permalink"]}") unless rp.file?
  html=File.read(rp,encoding:"UTF-8"); fail!("H1 rendered !=1 #{r[:fm]["permalink"]}") unless html.scan(/<h1\b/i).length==1
  fail!("shared learning cycle present #{r[:fm]["permalink"]}") if html.include?("data-zoology-learning-cycle")
  fail!("framework panel present #{r[:fm]["permalink"]}") if html.include?("lbfl-framework-links")
end
[root_fm,en_fm,idx_fm].each{|d| fail!("support route missing #{d['permalink']}") unless rendered(d["permalink"]).file?}
sm=SITE.join("ecology-sitemap.xml"); fail!("sitemap not rendered") unless sm.file?; xml=File.read(sm,encoding:"UTF-8")
records.each{|r| url="https://learningbiologyforlife.org#{r[:fm]['permalink']}"; fail!("sitemap missing #{url}") unless xml.include?(url)}
puts "ECOLOGY_V2_10_RENDER_PASS"; puts "rendered_lecture_pages=20"; puts "ECOLOGY_V2_10_EXACT_HEAD_PASS"