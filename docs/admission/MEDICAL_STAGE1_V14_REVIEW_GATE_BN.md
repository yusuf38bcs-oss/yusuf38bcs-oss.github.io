# LBFL মেডিকেল ভর্তি প্রস্তুতি — V14 Preview Gate

**অবস্থা: Draft / Branch-only / No production authorization**

## কাজের সীমানা

- পুরোনো `/admission/` Foundation Sprint অপরিবর্তিত। নতুন route `/admission/medical/`।
- ১৮টি Study Day, তিনটি Friday Review/Recovery, প্রতিদিন ছয় Paper-এর ৫৪০ মিনিট PCB; অতিরিক্ত English ৬০ ও GK ৩০ মিনিট। ঘড়ির সময় শিক্ষার্থী নির্ধারণ করবে।
- ২৭০টি শিক্ষক-প্রস্তুত প্রশ্ন, ১৮টি Daily Test, ৩টি Friday Test এবং ৭০ প্রশ্নের PCB benchmark। ২০২৫–২৬ নম্বরবণ্টন কেবল carry-forward planning baseline।
- সঠিক উত্তর প্রকাশ শুধুমাত্র submit-এর পরে UI-তে; তবে স্থির JSON ফাইল ব্রাউজার থেকে পড়া যায়। এটি **secure/proctored examination নয়**।
- Day completion, test result এবং error ledger শুধু browser localStorage-এ; account বা cross-device sync নেই। Storage unavailable হলে সতর্কবার্তা থাকবে।
- ভুল/ফাঁকা প্রশ্ন revision queue-তে যায়। Retest correct = স্থায়ী mastery নয়।

## Validation

1. `python scripts/admission/validate_medical_stage1_v14.py` (read-only contract)
2. `node --check assets/js/learning/admission-medical-preview-v14.js`
3. `bundle exec jekyll build --trace` **সঠিক Ruby/Bundler ও repo dependency environment-এ চালাতে হবে**।
4. Browser: Day 1, Friday 30, PCB70; scoring, answer reveal, localStorage progress & error retest; keyboard and mobile accessibility check।
5. Exact HEAD-এর ভিত্তিতে CI, zero unresolved security review, writer containment এবং release governance gate।

## Publication HOLD

- কোনো protected main merge, Pages/Worker deployment, workflow dispatch, environment secret বা ruleset পরিবর্তন এই PR অনুমোদন করে না।
- প্রযোজ্য YESAF E4/E7 production-writer HOLD বহাল থাকলে merging নিষিদ্ধ।
- পূর্ণাঙ্গ official 2026–27 syllabus দাবি করা যাবে না।
- Existing historical Medical PYQ-এর সঙ্গে teacher-authored assessment-এর provenance এক করা যাবে না।

## Rollback

এই নতুন route এবং ৩ asset অপসারণ করলে মূল Foundation Sprint অপরিবর্তিত থাকবে। রিলিজের আগে reversible branch-only scope বজায় রাখতে হবে।
