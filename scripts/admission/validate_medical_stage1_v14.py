#!/usr/bin/env python3
"""Read-only, dependency-free LBFL admission preview contract validation."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'assets/data/admission/medical/stage1-v14.json'
PAGE = ROOT / '_pages/admission/medical/index.md'
CSS = ROOT / 'assets/css/admission-medical-preview-v14.css'
JS = ROOT / 'assets/js/learning/admission-medical-preview-v14.js'


def check():
    for p in (DATA, PAGE, CSS, JS):
        assert p.is_file(), f'missing {p}'
    d = json.loads(DATA.read_text(encoding='utf8'))
    assert d['version'] == 'stage1-v14-isolated-preview'
    assert d['status'].startswith('DRAFT__')
    assert len(d['study_days']) == 21
    assert len(d['questions']) == 270
    assert len(d['tests']) == 22
    assert d['marks_baseline']['Physics'] == 15
    assert d['marks_baseline']['Chemistry'] == 25
    assert d['marks_baseline']['Biology'] == 30
    assert d['marks_baseline']['academic_year'] == '2025-26'
    assert [s['day'] for s in d['study_days'] if s['kind'] == 'FRIDAY_REVIEW'] == [7,14,21]
    qs = {q['id']:q for q in d['questions']}
    assert len(qs)==270
    study=0
    for s in d['study_days']:
        ids=[b['id'] for b in s['blocks']]
        assert len(ids)==len(set(ids))
        if s['kind']=='STUDY':
            study+=1
            assert len(s['blocks'])==8
            pcb=[b for b in s['blocks'] if b['subject'] in ('Physics','Chemistry','Biology')]
            assert len(pcb)==6 and sum(b['minutes'] for b in pcb)==540
            assert { (b['subject'],b['paper']) for b in pcb}=={(sub,pap) for sub in ('Physics','Chemistry','Biology') for pap in ('I','II')}
            assert sum(b['minutes'] for b in s['blocks'])==630
        else:
            assert len(s['blocks'])==3
    assert study==18
    for q in qs.values():
        assert set(q['options']) == set('ABCD')
        assert q['correct_option'] in 'ABCD'
        assert all(str(q.get(x,'' )).strip() for x in ['stem','explanation_bn','subject','chapter_title'])
        assert set(q['option_analysis_bn'])==set('ABCD')
        assert all(str(v).strip() for v in q['option_analysis_bn'].values())
    kinds={}
    for t in d['tests']:
        kinds[t['kind']]=kinds.get(t['kind'],0)+1
        assert t['count']==len(t['question_ids'])
        assert len(t['question_ids'])==len(set(t['question_ids']))
        assert all(i in qs for i in t['question_ids'])
        if t['kind']=='DAILY':assert t['count']==15
        elif t['kind']=='FRIDAY_CUMULATIVE_RETEST':assert t['count']==30
        elif t['kind']=='PCB70_DIAGNOSTIC':assert t['count']==70
    assert kinds.get('DAILY')==18
    assert kinds.get('FRIDAY_CUMULATIVE_RETEST')==3
    assert kinds.get('PCB70_DIAGNOSTIC')==1
    page=PAGE.read_text(encoding='utf8')
    assert '/admission/medical/' in page and 'noindex,nofollow' in page
    assert 'admission-medical-preview-v14.js' in page
    assert 'stage1-v14.json' in page
    js=JS.read_text(encoding='utf8')
    for token in ['localStorage','med-retest','aria-live','med-blocks','escapeHtml','correct_option','schema:2','function restore()','safe.errors[q.id]=true']:
        assert token in js
    for forbidden in ['state=old', 'last_choice:', 'last_seen:', 'last_correct:', 'score:raw,max,answered', 'state.updated=', 'schema:1, blocks:']:
        assert forbidden not in js, f'unsafe persisted learner detail: {forbidden}'
    print('PASS: 21-day/270-MCQ/22-test contract; 6-paper times; provenance and draft route')
    print('NOTE: This is structural QA, not a full Jekyll build, end-to-end CI or new scientific certification.')

if __name__=='__main__':check()
