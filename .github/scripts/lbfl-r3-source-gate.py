#!/usr/bin/env python3
"""Exact-head fail-closed source and production-contract guard for isolated LBFL R3 lab."""
import argparse,hashlib,json,os,re,subprocess,sys
from pathlib import Path
from xml.etree import ElementTree as ET
ROOT=Path.cwd()
SCOPE=('labs/lbfl-scientific-review/','labs/lbfl-scientific-integration/','assets/lbfl-homepage-r2/', '.github/scripts/lbfl-r3-', '.github/workflows/lbfl-r3-scientific-homepage-ci.yml','docs/lbfl-homepage-r3/')
parser=argparse.ArgumentParser();parser.add_argument('--base');parser.add_argument('--built');parser.add_argument('--staged',action='store_true',help='Examine staged additions against the exact base before first commit');args=parser.parse_args()
if args.staged and not args.base:parser.error('--staged requires --base')
errors=[]
def check(v,msg):
 if not v:errors.append(msg)
def read(path):return (ROOT/path).read_text(encoding='utf-8')
if args.base:
 base=args.base
 head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
 if args.staged:
  check(head==base,'Stage must begin at exact protected-main base')
  cp=subprocess.run(['git','diff','--cached','--name-only'],capture_output=True,text=True,check=True)
  states=subprocess.run(['git','diff','--cached','--name-status'],capture_output=True,text=True,check=True)
  check(all(row.startswith('A\t') for row in states.stdout.splitlines() if row),'Candidate must add files only; changes/deletions forbidden')
  unstaged=subprocess.run(['git','diff','--name-only'],capture_output=True,text=True,check=True)
  check(not unstaged.stdout.strip(),'Unstaged tracked changes present in candidate worktree')
 else:
  cp=subprocess.run(['git','diff','--name-only',f'{base}...HEAD'],capture_output=True,text=True,check=True)
  check(subprocess.run(['git','merge-base','--is-ancestor',base,'HEAD']).returncode==0,'Base is not an ancestor of candidate HEAD')
 changed=[x for x in cp.stdout.splitlines() if x]
 check(len(changed)>0,'empty candidate');check(all(x.startswith(SCOPE) for x in changed),'candidate modifies protected or out-of-scope files: '+str([x for x in changed if not x.startswith(SCOPE)]))
 report={'base':base,'head':head,'staged':args.staged,'changed':changed}
else:report={}
# Data contract from live protected main: NOT 6! eight curated HSC Botany routes.
home=read('_data/homepage.yml')
lo=home.find('latest_learning:')
hi=home.find('\nsynaptic_bridge:',lo)
check(lo>=0 and hi>lo,'Missing latest_learning data section')
learning=home[lo:hi] if lo>=0 and hi>lo else ''
maxima=re.findall(r'(?m)^  maximum_items: (\d+)\s*$',learning)
ids=re.findall(r'(?m)^    - id: (\S+)\s*$',learning)
labels=re.findall(r'(?m)^      label: "(Lecture \d{2})"\s*$',learning)
urls=re.findall(r'(?m)^      url: "([^"\n]+)"\s*$',learning)
paths=re.findall(r'(?m)^      pathway: "([^"\n]+)"\s*$',learning)
items=[{'id':i,'url':u,'label':label,'pathway':path} for i,u,label,path in zip(ids,urls,labels,paths)]
check(maxima==['8'],'Homepage V3 maximum_items must remain 8')
check(len(ids)==len(urls)==len(labels)==len(paths)==8 and len(set(ids))==8,'Homepage eight curated lecture entries must remain unique')
check(labels==[f'Lecture {i:02}' for i in range(1,9)],'Lecture 01-08 order wrong')
check(all(x=='HSC Botany' for x in paths) and all(u.startswith('/biology/hsc-corner/botany/') for u in urls),'Unexpected homepage lesson links')
index=read('index.html');layout=read('_layouts/homepage-v3.html')
check('layout: homepage-v3' in index and 'academic_role: platform_home' in index,'Protected homepage frontmatter ownership missing')
check('include home-v3/header.html' in layout and 'include home-v3/footer.html' in layout,'Shared header/footer ownership missing')
check('include body/brevo-marketing.html' in layout and 'include body/gdpr-banner.html' in layout,'Shared newsletter/GDPR ownership missing')
check('include_cached search/search_form.html' in layout,'Shared site-wide search ownership missing')
shell=read('labs/lbfl-scientific-integration/index.html')
lab=read('labs/lbfl-scientific-review/index.html')
check('layout: homepage-v3' in shell and 'robots: noindex,nofollow' in shell,'Shared-shell lab frontmatter missing')
check('layout: null' in lab and 'robots: noindex,nofollow' in lab,'Standalone lab frontmatter missing')
check('{{%20' not in shell+lab,'URL-escaped Liquid markers remain')
check('<header class="top"' not in shell and '<footer class="footer"' not in shell,'R3 duplicates shared header/footer')
check('lbfl-r2-search-dialog' not in shell,'R3 duplicates shared search')
check('lbfl-r2-figure-dialog' in shell,'Shared-shell lab figure dialog absent')
check('lbfl-r2-pre-evidence' in shell and 'lbfl-r2-explanation' in shell and shell.index('lbfl-r2-pre-evidence') < shell.index('lbfl-r2-explanation'),'No independent pre-evidence reasoning field')
check(all(f'site.data.homepage.pathways[{n}].url' in shell for n in range(4)),'Some pathway route is not data bound')
check(all(f'site.data.homepage.latest_learning.items[{n}].url' in shell for n in range(8)),'Eight source routes not bound to live data')
js=read('assets/lbfl-homepage-r2/homepage-shell.js')
check('https://learningbiologyforlife.org/bn/biology/' not in js and 'lbfl-r2-route-search' not in js,'Dead parallel search contains unverified absolute routes')
check('querySelector(\'#lbfl-science-review\')' in js,'R3 script must stay root scoped')
check('fetch(' not in js and 'localStorage' not in js,'R3 script unexpected external/network persistence')
# Source-owned generated SVG bytes and inactive elements, 8 of 8.
provenance=json.loads(read('docs/lbfl-homepage-r3/asset-provenance.json'))
check(len(provenance)==8,'Wrong number of figure provenance entries')
for item in provenance:
 p=ROOT/'assets/lbfl-homepage-r2/figures'/f"{item['id']}.svg"
 if not p.exists():errors.append('Missing '+str(p));continue
 raw=p.read_bytes();digest=hashlib.sha256(raw).hexdigest()
 # The original embedded SHA is historical custody, not the normalized candidate SHA.
 # A layout-neutral whitespace repair is explicitly recorded for the membrane figure.
 check(digest==item['jekyll_file_sha256'],f"Candidate figure SHA mismatch {item['id']}")
 check(len(raw)==item['bytes'],f"Candidate figure length mismatch {item['id']}")
 check(not any(line.rstrip(b' \t')!=line for line in raw.splitlines()),f"Candidate SVG trailing whitespace {item['id']}")
 if item['id']=='membrane':
  proof=item.get('formatting_only_normalization',{})
  check(item['embedded_sha256']=='2b0626056aa145f3000096f8a7b1cf64b97f7047521c5cc5388b42f1b4eceaeb','Membrane historical embedded SHA changed')
  check(item['jekyll_file_sha256']=='12c7ce6de84cf06b22fffccb483466617462562d30228945bda3903008cc603f','Unreviewed membrane candidate SVG SHA')
  check(item['standalone_to_jekyll_parity'] is False,'Membrane byte parity must not be falsely marked true')
  check(proof.get('source_embedded_sha256')==item['embedded_sha256'] and proof.get('normalized_jekyll_sha256')==digest,'Missing source-to-candidate membrane custody proof')
  check(proof.get('source_embedded_bytes')==481807 and proof.get('normalized_jekyll_bytes')==481712 and proof.get('trailing_tab_lines_repaired')==95,'Membrane tab-only formatting repair evidence changed')
 else:
  check(item['embedded_sha256']==item['jekyll_file_sha256'] and item['standalone_to_jekyll_parity'] is True,f"Unexpected historical/source mismatch {item['id']}")
 try:
  doc=ET.fromstring(raw)
  for el in doc.iter():
   local=el.tag.rsplit('}',1)[-1].lower()
   check(local not in ('script','foreignobject','iframe'),f"Active SVG element {item['id']} {local}")
   for k,v in el.attrib.items():
    key=k.rsplit('}',1)[-1].lower()
    check(not key.startswith('on'),f"Active SVG attribute {item['id']} {key}")
    if key=='href':check(v.startswith('#'),f"External SVG href {item['id']} {v}")
 except ET.ParseError:errors.append('Invalid SVG '+item['id'])
if args.built:
 generated=ROOT/args.built
 check((generated/'index.html').is_file(),'Missing original Homepage V3 index.html in Jekyll output')
 prefixes=['','bn','en']
 candidates=[]
 for prefix in prefixes:
  base=generated/prefix
  if (base/'labs/lbfl-scientific-review/index.html').is_file() and (base/'labs/lbfl-scientific-integration/index.html').is_file():
   candidates.append(prefix)
 check(len(candidates)>=1,'Missing real Jekyll output for both lab routes (root or localized /bn or /en)')
 prefix=candidates[0] if candidates else None
 report['jekyll_lab_prefix']=prefix
 if prefix is not None:
  (ROOT/'lbfl-r3-prefix.txt').write_text('/'+prefix if prefix else '',encoding='utf-8')
  for route in ('labs/lbfl-scientific-review/index.html','labs/lbfl-scientific-integration/index.html'):
   page=(generated/prefix/route)
   html=page.read_text(encoding='utf-8')
   check(not re.search(r'\{\{\s*\x27/assets/lbfl-homepage-r2',html),'Unrendered Liquid in '+str(page))
   check('noindex' in html,'Jekyll lab must remain noindex: '+str(page))
  rendered=(generated/prefix/'labs/lbfl-scientific-integration/index.html').read_text(encoding='utf-8')
  for item in items:check(item['url'] in rendered,'R3 missing canonical lecture '+item['url'])
report.update({'figure_sha_count':len(provenance),'homepage_lecture_count':len(items),'errors':errors,'status':'PASS' if not errors else 'FAIL'})
(ROOT/'lbfl-r3-source-gate.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(1 if errors else 0)
