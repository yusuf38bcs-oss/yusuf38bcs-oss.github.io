#!/usr/bin/env ruby
require "date"
require "yaml"
require "digest"
require "pathname"
ROOT=Pathname.new(File.expand_path("../..", __dir__))
COURSE=ROOT.join("_biology/higher-zoology-tree/animal-diversity")
MANIFEST=ROOT.join("_data/animal-diversity-10.yml")
ASSET_MANIFEST=ROOT.join("_data/animal-diversity-10-assets.yml")
def fail!(m); warn "FAIL: #{m}"; exit 1; end
def fm(path)
  text=File.read(path,encoding:"UTF-8"); m=text.match(/\A---\s*\n(.*?)\n---\s*\n(.*)\z/m); fail!("front matter missing #{path}") unless m
  [YAML.safe_load(m[1], permitted_classes:[Date,Time], aliases:true)||{},m[2],text]
end
manifest=YAML.load_file(MANIFEST); fail!("course_id") unless manifest["course_id"]=="animal-diversity-10"
slots=manifest["lecture_slots"]||[]; fail!("expected 10 lecture slots") unless slots.size==10
fail!("lecture numbers") unless slots.map{|s|s["lecture_number"]}==(1..10).map{|n|"%02d"%n}
fail!("page ids not unique") unless slots.map{|s|s["page_id"]}.uniq.size==10
fail!("slugs not unique") unless slots.map{|s|s["slug"]}.uniq.size==10
imported=slots.count{|s|["IMPORTED_CERTIFICATION_PENDING","CERTIFIED"].include?(s["status"])}
fail!("content import incomplete: #{imported}/10 lecture slots imported") unless imported==10
slots.each_with_index do |s,idx|
  n=s["lecture_number"]; slug=s["slug"]; page_id=s["page_id"]
  {"en"=>COURSE.join("#{slug}.md"),"bn"=>COURSE.join("#{slug}.bn.md")}.each do |lang,path|
    fail!("missing #{lang} lecture #{n}") unless path.file?
    data,body,text=fm(path)
    fail!("course_id #{path}") unless data["course_id"]=="animal-diversity-10"
    fail!("course_role #{path}") unless data["course_role"]=="lecture"
    fail!("lecture_number #{path}") unless data["lecture_number"]==n
    fail!("page_id #{path}") unless data["page_id"]==page_id
    fail!("lang #{path}") unless data["lang"]==lang && data["language"]==lang
    fail!("layout #{path}") unless data["layout"]=="animal-diversity-course"
    fail!("status #{path}") unless data["status"]=="Active" && data["published"]==true
    fail!("permalink #{path}") unless data["permalink"]=="/biology/animal-diversity/#{slug}/"
    fail!("markdown H1 #{path}") unless body.scan(/^# (?!#)/).size==1
    fail!("learning strategy leaked #{path}") if text.match?(/framework-links\.html|\bLOLO\b|\bLALA\b|LBFL Educational Framework/i)
    fail!("old package route leaked #{path}") if text.include?("/biology/animal-diversity/223101/")
    fail!("old asset namespace leaked #{path}") if text.include?("animal-diversity-223101")
    expected_index = lang=="en" ? "/biology/animal-diversity/course/" : "/bn/biology/animal-diversity/course/"
    fail!("course index nav #{path}") unless data["course_index_url"]==expected_index
  end
end
assets=(YAML.load_file(ASSET_MANIFEST)["assets"]||[]); fail!("expected 32 assets") unless assets.size==32
fail!("asset paths not unique") unless assets.map{|a|a["path"]}.uniq.size==32
fail!("asset hashes not unique") unless assets.map{|a|a["sha256"]}.uniq.size==32
assets.each do |a|
  path=ROOT.join(a["path"].sub(%r{\A/},"")); fail!("missing asset #{a['path']}") unless path.file?
  fail!("asset hash mismatch #{a['path']}") unless Digest::SHA256.file(path).hexdigest==a["sha256"]
end
[COURSE.join("index.md"),COURSE.join("index.bn.md"),COURSE.join("course-index.md"),COURSE.join("course-index.bn.md")].each{|p|fail!("support source missing #{p}") unless p.file?}
puts "ANIMAL_DIVERSITY_10_SOURCE_PASS"
if ROOT.join("_site").directory?
  routes=["/biology/animal-diversity/","/biology/animal-diversity/course/","/bn/biology/animal-diversity/","/bn/biology/animal-diversity/course/"]
  slots.each do |s|
    routes << "/biology/animal-diversity/#{s['slug']}/"
    routes << "/bn/biology/animal-diversity/#{s['slug']}/"
  end
  routes.each do |route|
    p=ROOT.join("_site",route.sub(%r{\A/},""),"index.html"); fail!("rendered route missing #{route}") unless p.file?
    html=File.read(p,encoding:"UTF-8"); fail!("rendered H1 != 1 #{route}") unless html.scan(/<h1\b/i).size==1
    fail!("learning cycle rendered #{route}") if html.include?("data-zoology-learning-cycle")
    fail!("framework rendered #{route}") if html.include?("lbfl-framework-links")
  end
  puts "ANIMAL_DIVERSITY_10_RENDER_PASS"
end
