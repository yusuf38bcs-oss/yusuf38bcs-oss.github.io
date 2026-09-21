# frozen_string_literal: true

require "json"

ROOT = File.expand_path("../..", __dir__)
ARCHITECTURE_PATH = File.join(ROOT, "_data/admission/curriculum_architecture_v1.json")
ENGINE_PATH = File.join(ROOT, "_data/admission/biology/engine_v1.json")
COVERAGE_PATH = File.join(ROOT, "_data/admission/biology/curriculum_coverage_v1.json")
REUSE_PATH = File.join(ROOT, "_data/admission/biology/reuse_audit_v1.json")
CHAPTER_MAP_PATH = File.join(ROOT, "_data/admission/biology/chapter_map_v1.json")
REFERENCE_POLICY_PATH = File.join(ROOT, "_data/admission/biology/reference_policy_v1.json")
CLAIM_MATRIX_PATH = File.join(ROOT, "_data/admission/biology/claim_source_matrix_v1.json")
REFERENCE_REGISTRY_PATH = File.join(ROOT, "_data/admission/biology/reference_registry_v1.json")
SECOND_VERIFICATION_PATH = File.join(ROOT, "_data/admission/biology/r2-3_second_verification_v1.json")
SOURCE_EVIDENCE_PATH = File.join(ROOT, "_data/admission/biology/sources/r2-2-shared-syllabus-photo-set.json")
EDITORIAL_POLICY_PATH = File.join(ROOT, "_pages/utility/editorial-policy.md")

PERMANENT_RULE = "LBFL will not depend on a single guidebook or textbook. Curriculum boundaries will follow NCTB. Explanations will be developed through cross-verification among NCTB-authorized HSC texts and appropriate authoritative scientific references. Every substantial source-dependent claim will identify its reference, and uncertainty or disagreement among sources will be stated rather than silently reconciled."

EXPECTED_SUBJECT_IDS = %w[PHY CHEM MATH BIO].freeze
EXPECTED_BIO_CHAPTER_IDS = [
  *(1..12).map { |number| format("BIO-P1-C%02d", number) },
  *(1..12).map { |number| format("BIO-P2-C%02d", number) }
].freeze
EXPECTED_P1_PERIODS = 140
EXPECTED_P2_PERIODS = 141

EXPECTED_CHAPTERS = {
  "BIO-P1-C01" => ["কোষ ও এর গঠন", "Cell and its Structure", 15, 110, 25],
  "BIO-P1-C02" => ["কোষ বিভাজন", "Cell Division", 111, 146, 8],
  "BIO-P1-C03" => ["কোষ রসায়ন", "Cell Chemistry", 147, 204, 8],
  "BIO-P1-C04" => ["অণুজীব", "Microorganism", 205, 264, 15],
  "BIO-P1-C05" => ["শৈবাল ও ছত্রাক", "Algae and Fungi", 265, 304, 10],
  "BIO-P1-C06" => ["ব্রায়োফাইটা ও টেরিডোফাইটা", "Bryophyta and Pteridophyta", 305, 324, 8],
  "BIO-P1-C07" => ["নগ্নবীজী ও আবৃতবীজী উদ্ভিদ", "Gymnosperm and Angiosperm", 325, 362, 8],
  "BIO-P1-C08" => ["টিস্যু ও টিস্যুতন্ত্র", "Tissue and Tissue System", 363, 392, 7],
  "BIO-P1-C09" => ["উদ্ভিদ শারীরতত্ত্ব", "Plant Physiology", 393, 460, 19],
  "BIO-P1-C10" => ["উদ্ভিদ প্রজনন", "Plant Reproduction", 461, 488, 4],
  "BIO-P1-C11" => ["জীবপ্রযুক্তি", "Biotechnology", 489, 530, 10],
  "BIO-P1-C12" => ["জীবের পরিবেশ, বিস্তার ও সংরক্ষণ", "Environment, Distribution and Conservation of Organisms", 531, 586, 18],
  "BIO-P2-C01" => ["প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস", "Animal Diversity and Classification", 1, 58, 7],
  "BIO-P2-C02" => ["প্রাণীর পরিচিতি", "Introduction to Animals", 59, 146, 25],
  "BIO-P2-C03" => ["মানব শারীরতত্ত্ব : পরিপাক ও শোষণ", "Human Physiology: Digestion and Absorption", 147, 187, 12],
  "BIO-P2-C04" => ["মানব শারীরতত্ত্ব : রক্ত সংবহন", "Human Physiology: Blood Circulation", 188, 237, 14],
  "BIO-P2-C05" => ["মানব শারীরতত্ত্ব : শ্বসন ও শ্বাসক্রিয়া", "Human Physiology: Respiration and Breathing", 238, 262, 10],
  "BIO-P2-C06" => ["মানব শারীরতত্ত্ব : বর্জ্য ও নিষ্কাশন", "Human Physiology: Wastes and Excretion", 263, 286, 6],
  "BIO-P2-C07" => ["মানব শারীরতত্ত্ব : চলন ও অঙ্গ চালনা", "Human Physiology: Locomotion and Movement", 287, 329, 12],
  "BIO-P2-C08" => ["মানব শারীরতত্ত্ব : সমন্বয় ও নিয়ন্ত্রণ", "Human Physiology: Coordination and Control", 330, 378, 12],
  "BIO-P2-C09" => ["মানব জীবনের ধারাবাহিকতা", "Continuity of Human Life", 379, 425, 11],
  "BIO-P2-C10" => ["মানবদেহের প্রতিরক্ষা", "Human Body Defense", 426, 454, 9],
  "BIO-P2-C11" => ["জিনতত্ত্ব ও বিবর্তন", "Genetics and Evolution", 455, 506, 15],
  "BIO-P2-C12" => ["প্রাণীর আচরণ", "Animal Behaviour", 507, 533, 8]
}.freeze

def load_json(path)
  JSON.parse(File.read(path, encoding: "UTF-8"))
rescue Errno::ENOENT
  abort "Admission R2.3 Biology Evidence Population Validation: FAIL\n- missing file: #{path}"
rescue JSON::ParserError => e
  abort "Admission R2.3 Biology Evidence Population Validation: FAIL\n- invalid JSON #{path}: #{e.message}"
end

def blank?(value)
  value.nil? || (value.respond_to?(:empty?) && value.empty?)
end

def sha256?(value)
  value.is_a?(String) && value.match?(/\A[0-9a-f]{64}\z/)
end

errors = []
architecture = load_json(ARCHITECTURE_PATH)
engine = load_json(ENGINE_PATH)
coverage = load_json(COVERAGE_PATH)
reuse = load_json(REUSE_PATH)
chapter_map = load_json(CHAPTER_MAP_PATH)
reference_policy = load_json(REFERENCE_POLICY_PATH)
claim_matrix = load_json(CLAIM_MATRIX_PATH)
reference_registry = load_json(REFERENCE_REGISTRY_PATH)
second_verification = load_json(SECOND_VERIFICATION_PATH)
source_evidence = load_json(SOURCE_EVIDENCE_PATH)
editorial_policy = File.read(EDITORIAL_POLICY_PATH, encoding: "UTF-8")

expected_topic_ids = Array(engine["taxonomy"]).map { |topic| topic["id"] }
coverage_by_id = Array(coverage["topics"]).to_h { |topic| [topic["id"], topic] }

errors << "architecture schema mismatch" unless architecture["schema"] == "lbfl-admission-curriculum-architecture-v1"
errors << "architecture version must be R2.3-0.1" unless architecture["version"] == "R2.3-0.1"
errors << "architecture parent head mismatch" unless architecture.dig("parent_contract", "parent_head") == "c89e126a6e5e8372f761c825729bca6df628ab4a"

subjects = Array(architecture["subjects"])
subject_ids = subjects.map { |subject| subject["subject_id"] }
errors << "subjects must be exactly PHY,CHEM,MATH,BIO" unless subject_ids == EXPECTED_SUBJECT_IDS
errors << "subject IDs must be unique" unless subject_ids.uniq.length == subject_ids.length

subjects.reject { |subject| subject["subject_id"] == "BIO" }.each do |subject|
  Array(subject["papers"]).each do |paper|
    errors << "#{paper['paper_id']}: non-Biology chapter taxonomy must remain pending" unless paper["chapter_taxonomy_status"] == "pending-authenticated-source-mapping"
    errors << "#{paper['paper_id']}: non-Biology chapter rows must remain empty" unless Array(paper["chapters"]).empty?
  end
end

bio = subjects.find { |subject| subject["subject_id"] == "BIO" }
if bio.nil?
  errors << "BIO subject missing"
else
  errors << "BIO architecture status mismatch" unless bio["architecture_status"] == "24-chapter-mapping-authenticated-r2-3-source-populated-second-verification-blocked"
  errors << "BIO engine taxonomy source changed" unless bio.dig("topic_taxonomy", "source") == "_data/admission/biology/engine_v1.json"
  errors << "BIO topic IDs changed" unless Array(bio.dig("topic_taxonomy", "expected_topic_ids")) == expected_topic_ids
  errors << "BIO chapter mapping status mismatch" unless bio.dig("topic_taxonomy", "chapter_mapping_status") == "curriculum-mapping-authenticated-source-populated-claim-page-and-second-verification-pending"

  bio_chapters = Array(bio["papers"]).flat_map { |paper| Array(paper["chapters"]) }
  errors << "BIO architecture must contain exactly 24 chapter rows" unless bio_chapters.length == 24
  errors << "BIO architecture chapter IDs mismatch" unless bio_chapters.map { |chapter| chapter["chapter_id"] } == EXPECTED_BIO_CHAPTER_IDS

  Array(bio["papers"]).each do |paper|
    errors << "#{paper['paper_id']}: taxonomy must be authenticated" unless paper["chapter_taxonomy_status"] == "curriculum-mapping-authenticated"
    errors << "#{paper['paper_id']}: expected 12 chapters" unless Array(paper["chapters"]).length == 12
  end
end

boundary = architecture["boundary"] || {}
errors << "global four-subject taxonomy must remain unauthenticated" unless boundary["chapter_taxonomy_authenticated"] == false
errors << "Biology taxonomy must be authenticated" unless boundary["biology_chapter_taxonomy_authenticated"] == true
errors << "Biology source population must be complete" unless boundary["biology_claim_source_population_complete"] == true
errors << "Biology claim-page verification must remain incomplete" unless boundary["biology_claim_page_verification_complete"] == false
errors << "Biology second verification must remain incomplete" unless boundary["biology_second_verification_complete"] == false
%w[
  chapter_completion_allowed
  new_model_test_batch_allowed
  historical_occurrence_substitution_allowed
  f_v2_promotion_allowed
  matrix_qyi_release_allowed
  ready_merge_production_authority
].each do |field|
  errors << "architecture boundary #{field} must remain false" unless boundary[field] == false
end

errors << "reference policy path mismatch" unless architecture["reference_policy"] == "_data/admission/biology/reference_policy_v1.json"
errors << "chapter map path mismatch" unless architecture["biology_chapter_map"] == "_data/admission/biology/chapter_map_v1.json"
errors << "claim matrix path mismatch" unless architecture["biology_claim_source_matrix"] == "_data/admission/biology/claim_source_matrix_v1.json"
errors << "reference registry path mismatch" unless architecture["biology_reference_registry"] == "_data/admission/biology/reference_registry_v1.json"
errors << "second verification path mismatch" unless architecture["biology_second_verification"] == "_data/admission/biology/r2-3_second_verification_v1.json"

errors << "chapter-map schema mismatch" unless chapter_map["schema"] == "lbfl-admission-biology-24-chapter-map-v1"
errors << "chapter-map version mismatch" unless chapter_map["version"] == "R2.2-0.1"
errors << "chapter-map parent mismatch" unless chapter_map["exact_parent_head"] == "af233662565dff7802598d60861fe64f9e305df6"
errors << "chapter-map status mismatch" unless chapter_map["mapping_status"] == "curriculum-mapping-authenticated-multireference-claim-verification-pending"

chapters = Array(chapter_map["papers"]).flat_map { |paper| Array(paper["chapters"]) }
chapter_ids = chapters.map { |chapter| chapter["chapter_id"] }
errors << "chapter map must contain 24 chapters" unless chapters.length == 24
errors << "chapter IDs must match canonical order" unless chapter_ids == EXPECTED_BIO_CHAPTER_IDS
errors << "chapter IDs must be unique" unless chapter_ids.uniq.length == chapter_ids.length

chapters.each do |chapter|
  id = chapter["chapter_id"]
  expected = EXPECTED_CHAPTERS[id]
  if expected.nil?
    errors << "#{id}: unexpected chapter"
    next
  end

  expected_bn, expected_en, expected_start, expected_end, expected_periods = expected
  errors << "#{id}: Bengali title mismatch" unless chapter["bn_title"] == expected_bn
  errors << "#{id}: English title mismatch" unless chapter["en_title"] == expected_en
  errors << "#{id}: printed page start mismatch" unless chapter.dig("printed_pages", "start") == expected_start
  errors << "#{id}: printed page end mismatch" unless chapter.dig("printed_pages", "end") == expected_end
  errors << "#{id}: NCTB period count mismatch" unless chapter["nctb_periods"] == expected_periods
  errors << "#{id}: chapter must remain incomplete" unless chapter["chapter_completion_status"] == "incomplete"
  errors << "#{id}: reference bundle status must remain pending" unless chapter["reference_bundle_status"] == "multi-reference-expansion-and-claim-page-mapping-pending"
  errors << "#{id}: claim-source matrix status must remain pending" unless chapter["claim_source_matrix_status"] == "chapter-topic-scope-established-claim-level-page-verification-pending"

  mappings = Array(chapter["topic_mappings"])
  errors << "#{id}: topic mapping missing" if mappings.empty?
  mappings.each do |mapping|
    topic_id = mapping["topic_id"]
    errors << "#{id}: unknown topic #{topic_id}" unless expected_topic_ids.include?(topic_id)
    errors << "#{id}: mapped facet missing for #{topic_id}" if blank?(mapping["facet"])
  end

  bundle = chapter["reference_bundle"] || {}
  errors << "#{id}: curriculum source missing" if Array(bundle["curriculum_sources"]).empty?
  errors << "#{id}: authorized HSC textbook source missing" if Array(bundle["nctb_authorized_textbooks"]).empty?
  errors << "#{id}: supplementary_authorized_books must be an array" unless bundle["supplementary_authorized_books"].is_a?(Array)
  errors << "#{id}: scientific_references must be an array" unless bundle["scientific_references"].is_a?(Array)
  errors << "#{id}: disagreements must be an array" unless bundle["disagreements"].is_a?(Array)

  reuse_routes = Array(chapter["reuse_routes"])
  reuse_routes.each do |entry|
    relative = entry["path"]
    if blank?(relative) || !relative.start_with?("_biology/")
      errors << "#{id}: invalid LBFL reuse path #{relative.inspect}"
      next
    end
    errors << "#{id}: reuse path missing: #{relative}" unless File.file?(File.join(ROOT, relative))
    errors << "#{id}: reuse class missing for #{relative}" if blank?(entry["class"])
  end

  errors << "#{id}: missing-lecture claims must be explicit" if Array(chapter["missing_lecture_claims"]).empty?
end

p1 = Array(chapter_map["papers"]).find { |paper| paper["paper_id"] == "BIO-P1" }
p2 = Array(chapter_map["papers"]).find { |paper| paper["paper_id"] == "BIO-P2" }
errors << "BIO-P1 chapter count mismatch" unless p1 && p1["chapter_count"] == 12 && Array(p1["chapters"]).length == 12
errors << "BIO-P2 chapter count mismatch" unless p2 && p2["chapter_count"] == 12 && Array(p2["chapters"]).length == 12
errors << "BIO-P1 period total mismatch" unless p1 && p1["total_periods"] == EXPECTED_P1_PERIODS && Array(p1["chapters"]).sum { |c| c["nctb_periods"].to_i } == EXPECTED_P1_PERIODS
errors << "BIO-P2 period total mismatch" unless p2 && p2["total_periods"] == EXPECTED_P2_PERIODS && Array(p2["chapters"]).sum { |c| c["nctb_periods"].to_i } == EXPECTED_P2_PERIODS

mapped_topic_ids = chapters.flat_map { |chapter| Array(chapter["topic_mappings"]).map { |mapping| mapping["topic_id"] } }
errors << "chapter crosswalk must cover all B01-B28" unless (expected_topic_ids - mapped_topic_ids.uniq).empty?
errors << "chapter crosswalk contains unknown topic IDs" unless (mapped_topic_ids.uniq - expected_topic_ids).empty?
errors << "B28 must be split across Genetics/Evolution and Animal Behaviour chapters" unless mapped_topic_ids.count("B28") == 2
errors << "B13 must map only once in the canonical chapter map" unless mapped_topic_ids.count("B13") == 1

b13_chapter = chapters.find { |chapter| chapter["chapter_id"] == "BIO-P1-C10" }
unless Array(b13_chapter && b13_chapter["unmapped_engine_facets"]).any? { |value| value.include?("plant-growth") } &&
       Array(b13_chapter && b13_chapter["unmapped_engine_facets"]).any? { |value| value.include?("plant-hormone") }
  errors << "B13 growth/hormone unmapped facets must remain explicit"
end

errors << "reference-policy schema mismatch" unless reference_policy["schema"] == "lbfl-admission-biology-reference-policy-v1"
errors << "permanent rule mismatch" unless reference_policy["permanent_rule"] == PERMANENT_RULE
errors << "single-book dependency must be prohibited" unless reference_policy.dig("claim_rules", "single_book_dependency_prohibited") == true
errors << "silent reconciliation must be prohibited" unless reference_policy.dig("claim_rules", "silent_reconciliation_prohibited") == true
errors << "historical substitution must be prohibited" unless reference_policy.dig("claim_rules", "historical_occurrence_substitution_prohibited") == true
errors << "editorial policy page is missing permanent multi-reference rule" unless editorial_policy.include?(PERMANENT_RULE)

errors << "claim-matrix schema mismatch" unless claim_matrix["schema"] == "lbfl-admission-biology-claim-source-matrix-v1"
errors << "claim-matrix version mismatch" unless claim_matrix["version"] == "R2.3-0.1"
errors << "claim-matrix status mismatch" unless claim_matrix["status"] == "all-rows-source-populated-claim-page-and-second-verification-pending"
errors << "claim-matrix registry path mismatch" unless claim_matrix["reference_registry"] == "_data/admission/biology/reference_registry_v1.json"
matrix_rows = Array(claim_matrix["rows"])
errors << "claim matrix must have 29 chapter-topic rows" unless matrix_rows.length == 29
errors << "claim matrix must cover 24 chapters" unless matrix_rows.map { |row| row["chapter_id"] }.uniq.length == 24
errors << "claim matrix must cover all 28 topics" unless matrix_rows.map { |row| row["topic_id"] }.uniq.sort == expected_topic_ids.sort
errors << "primary chapter-range population must be 29" unless claim_matrix.dig("summary", "primary_chapter_range_populated_rows") == 29
errors << "supplementary candidate population must be 29" unless claim_matrix.dig("summary", "supplementary_candidate_populated_rows") == 29
errors << "scientific locator population must be 29" unless claim_matrix.dig("summary", "scientific_locator_populated_rows") == 29
errors << "additional authorized claim-page population must remain zero" unless claim_matrix.dig("summary", "additional_authorized_claim_page_populated_rows") == 0
errors << "claim matrix page-verified count must remain zero" unless claim_matrix.dig("summary", "page_verified_claim_rows") == 0
errors << "claim matrix second-verified count must remain zero" unless claim_matrix.dig("summary", "second_verified_rows") == 0

matrix_rows.each do |row|
  label = row["matrix_id"]
  locator = row["primary_textbook_chapter_locator"] || {}
  errors << "#{label}: primary printed chapter range missing" unless locator["locator_type"] == "printed-chapter-page-range" && locator["page_start"].is_a?(Integer) && locator["page_start"].positive? && locator["page_end"].is_a?(Integer) && locator["page_end"] >= locator["page_start"]
  errors << "#{label}: primary chapter locator must not claim row-level verification" unless locator["evidence_scope"].to_s.include?("does not by itself verify")
  errors << "#{label}: supplementary candidates missing" if Array(row["supplementary_book_candidates"]).empty?
  errors << "#{label}: unverified candidates must not enter supplementary_authorized_books" unless Array(row["supplementary_authorized_books"]).empty?
  errors << "#{label}: authoritative scientific locator missing" if Array(row["scientific_references"]).empty?
  errors << "#{label}: scientific locator state mismatch" unless row["scientific_locator_status"] == "populated-web-locators-verified"
  errors << "#{label}: page-evidence state mismatch" unless row["page_evidence_status"] == "primary-chapter-range-populated-additional-book-claim-pages-pending"
  errors << "#{label}: claim verification must remain pending" unless row["claim_verification_status"] == "source-populated-claim-page-verification-pending"
  errors << "#{label}: disagreement refs must be explicit array" unless row["disagreement_refs"].is_a?(Array)
  errors << "#{label}: second verification must remain blocked" unless row["second_verification_status"] == "blocked-pending-claim-page-evidence-from-additional-authorized-reference"
end

errors << "reference-registry schema mismatch" unless reference_registry["schema"] == "lbfl-admission-biology-reference-registry-v1"
errors << "reference-registry version mismatch" unless reference_registry["version"] == "R2.3-0.1"
errors << "reference-registry parent mismatch" unless reference_registry["exact_parent_head"] == "c89e126a6e5e8372f761c825729bca6df628ab4a"
book_candidates = Array(reference_registry["textbook_reference_candidates"])
scientific_refs = Array(reference_registry["scientific_references"])
disagreements = Array(reference_registry["known_disagreements"])
errors << "expected 5 HSC reference candidates" unless book_candidates.length == 5
errors << "expected at least 30 authoritative scientific locators" unless scientific_refs.length >= 30
errors << "expected 5 explicit disagreement records" unless disagreements.length == 5
book_candidates.each do |source|
  errors << "#{source['source_id']}: candidate must not claim page locator" unless source["claim_page_locator_available"] == false
  errors << "#{source['source_id']}: authorization status missing" if blank?(source["authorization_status"])
end
scientific_ids = scientific_refs.map { |source| source["source_id"] }
errors << "scientific source IDs must be unique" unless scientific_ids.uniq.length == scientific_ids.length
scientific_refs.each do |source|
  errors << "#{source['source_id']}: scientific locator must be verified" unless source["verification_status"] == "web-locator-verified"
  errors << "#{source['source_id']}: scientific URL missing" if blank?(source["url"])
end
matrix_rows.each do |row|
  unknown = Array(row["scientific_references"]) - scientific_ids
  errors << "#{row['matrix_id']}: unknown scientific refs: #{unknown.join(', ')}" if unknown.any?
end

errors << "second-verification schema mismatch" unless second_verification["schema"] == "lbfl-admission-biology-r2-3-second-verification-v1"
errors << "second-verification version mismatch" unless second_verification["version"] == "R2.3-0.1"
errors << "second-verification parent mismatch" unless second_verification["exact_parent_head"] == "c89e126a6e5e8372f761c825729bca6df628ab4a"
verification_rows = Array(second_verification["rows"])
errors << "second-verification must contain 29 rows" unless verification_rows.length == 29
errors << "pass-1 source population count must be 29" unless second_verification.dig("summary", "pass_1_source_population") == 29
errors << "pass-2 verified count must remain zero" unless second_verification.dig("summary", "pass_2_verified") == 0
errors << "pass-2 blocked count must be 29" unless second_verification.dig("summary", "pass_2_blocked") == 29
verification_rows.each do |row|
  errors << "#{row['matrix_id']}: pass 1 must be PASS" unless row.dig("pass_1_source_population", "status") == "PASS"
  errors << "#{row['matrix_id']}: pass 2 must be BLOCKED" unless row.dig("pass_2_independent_claim_verification", "status") == "BLOCKED"
  errors << "#{row['matrix_id']}: lecture authority must remain false" unless row["lecture_authoring_authority"] == false
  errors << "#{row['matrix_id']}: model-test authority must remain false" unless row["model_test_authority"] == false
end

errors << "source evidence schema mismatch" unless source_evidence["schema"] == "lbfl-admission-biology-r2-2-source-evidence-v1"
errors << "source evidence set ID mismatch" unless source_evidence["source_set_id"] == "BIO-R2-2-SHARED-SYLLABUS-PHOTO-SET-20260922"
images = Array(source_evidence["images"])
errors << "expected 16 source photographs" unless images.length == 16
images.each do |image|
  errors << "#{image['file']}: invalid SHA-256" unless sha256?(image["sha256"])
  errors << "#{image['file']}: invalid byte size" unless image["bytes"].is_a?(Integer) && image["bytes"].positive?
  errors << "#{image['file']}: role missing" if blank?(image["role"])
end
errors << "First Paper authorization evidence not recorded" unless source_evidence.dig("first_paper", "authorization_evidence", "status") == "verified-book-family-current-curriculum-origin"
errors << "Second Paper authorization lineage not recorded" unless source_evidence.dig("second_paper", "authorization_evidence", "status") == "verified-authorization-lineage-and-inspected-revision"
errors << "Second Paper inspected revision must be 2026" unless source_evidence.dig("second_paper", "edition_or_revision") == "সংশোধিত সংস্করণ ২০২৬"

coverage_by_id.each do |id, topic|
  unless %w[gap partial complete].include?(topic["status"])
    errors << "#{id}: inherited coverage status invalid"
  end
end
errors << "R2.3 must not change existing B01-B28 completion arithmetic" unless coverage.dig("summary", "complete_topics") == 0 && coverage.dig("summary", "partial_topics") == 6 && coverage.dig("summary", "gap_topics") == 22

unless reuse["schema"] == "lbfl-admission-biology-reuse-audit-v1"
  errors << "R2.1 reuse audit schema changed unexpectedly"
end

map_boundaries = chapter_map["boundaries"] || {}
%w[
  writes_new_lectures
  writes_new_model_tests
  changes_b01_b28_completion_status
  authorizes_matrix_qyi
  authorizes_ready_merge_production
].each do |field|
  errors << "chapter-map boundary #{field} must remain false" unless map_boundaries[field] == false
end

matrix_boundaries = claim_matrix["boundaries"] || {}
%w[
  may_promote_verified_primary
  may_complete_chapter
  may_authorize_new_model_test_batch
  may_authorize_matrix_qyi
].each do |field|
  errors << "claim-matrix boundary #{field} must remain false" unless matrix_boundaries[field] == false
end

if errors.any?
  warn "Admission R2.3 Biology Evidence Population Validation: FAIL"
  errors.each { |error| warn "- #{error}" }
  exit 1
end

puts "Admission R2.3 Biology Evidence Population Validation: PASS"
puts "biology_chapters=24 p1=12 p2=12 periods_p1=#{EXPECTED_P1_PERIODS} periods_p2=#{EXPECTED_P2_PERIODS}"
puts "chapter_topic_rows=#{matrix_rows.length} unique_topics=#{matrix_rows.map { |row| row['topic_id'] }.uniq.length} source_populated_rows=29 page_verified_claim_rows=0 second_verified_rows=0"
puts "multi_reference_rule=active textbook_candidates=#{book_candidates.length} scientific_locators=#{scientific_refs.length} disagreements=#{disagreements.length} single_book_dependency=false silent_reconciliation=false"
puts "pass1_source_population=29 pass2_verified=0 pass2_blocked=29 new_lectures=false new_model_tests=false b01_b28_completion_unchanged=true matrix_qyi_release=false ready_merge_production=false"
