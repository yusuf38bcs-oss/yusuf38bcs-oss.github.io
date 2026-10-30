// YESAF E5 V2 prospective source-continuity preflight.
// REVIEW ONLY. No trusted status, signature, merge or deployment authority.
export const PIN=Object.freeze({
  repository:'yusuf38bcs-oss/yusuf38bcs-oss.github.io',
  historicalBase:'3164d2537b4f19381c52bbfb5c9e1b7ee7d15846',
  historicalHead:'ab762c7d9ab82f397e37244014753c913f4eb966',
  historicalRun:40806678033,
  historicalWorkflow:400121489,
  manifestBlob:'aff7d622b11a41050e0d1df145609f694605e2a1',
  retirement:Object.freeze({
    '.github/workflows/conv04f-zoology-practical-appendages-production-parity.yml':'a28bf51cac8e4ec07a9228d16d636b1a5af73972',
    '.github/workflows/conv04f-zoology-practical-dissection-production-parity.yml':'68e11e232a437823258f5f74530db51017ce5de4',
    '.github/workflows/conv04f-zoology-practical-museum-production-parity.yml':'bf91156ff62791c21f90c880e72838f2843c3926',
    '.github/workflows/conv04f-zoology-practical-permanent-slides-production-parity.yml':'a17d3221cc69dcb4b4760693814eec40d26d719e',
    '.github/workflows/conv04f-zoology-practical-temporary-mounts-production-parity.yml':'07b28127f234d5819e568497d206851230e13810',
    '.github/workflows/conv04f-zoology-practical-whole-mounts-production-parity.yml':'1f8f8ab0b9347a7c1c3e2e66e729ea1427c31a0a',
    '.github/workflows/conv04f-zoology-practical-zooplankton-production-parity.yml':'305b555b153c30719fedcc88164947a2c85fe5f9',
    '.github/workflows/conv04f-zoology-practical-field-report-production-parity.yml':'9c5facafde56309951db4e768f7040582c0aa96c'
  })
});
const must=(ok,msg)=>{if(!ok)throw Error('YESAF_V2_HOLD: '+msg)};
const isSha=v=>typeof v==='string'&&/^[a-f0-9]{40}$/.test(v);
const names=(actual,expected)=>Array.isArray(actual)&&new Set(actual).size===actual.length&&actual.length===expected.length&&actual.every(k=>expected.includes(k));

// Accepts only externally authenticated REST evidence. A candidate-provided packet
// cannot become a trusted certificate; this function has no issuer/write authority.
export function evaluateSourceContinuity(x,manifest){
  must(manifest?.BASE===PIN.historicalBase&&manifest.HEAD===PIN.historicalHead&&
    manifest.RUN===PIN.historicalRun&&manifest.REPO===PIN.repository,
    'historical evidence manifest identity');
  must(x?.manifest_blob_sha===PIN.manifestBlob,'untrusted or changed original manifest blob');
  const source=manifest.ORIGINAL,acad=manifest.ACADEMIC;
  must(source&&Object.keys(source).length===41&&acad&&Object.keys(acad).length===8&&
    Object.keys(PIN.retirement).length===8&&manifest.CHANGED?.length===25&&
    manifest.JOBS?.length===9,'original evidence manifest cardinality');
  for(const [path,id] of Object.entries(PIN.retirement))
    must(source[path]&&isSha(source[path])&&id!==source[path], 'missing distinct original publisher '+path);
  const current=x?.main?.commit?.sha,pr=x?.pr;
  must(isSha(current)&&x?.main?.protected===true,'protected current main not authenticated');
  must(pr?.number===520&&pr.state==='open'&&pr.head?.repo?.full_name===PIN.repository&&
    isSha(pr.head.sha)&&pr.base?.ref==='main'&&pr.base.sha===current,
    'current PR identity or exact base mismatch');
  const comparison=x?.comparison;
  must(comparison?.merge_base_commit?.sha===current&&comparison.behind_by===0&&
    Number.isInteger(comparison.ahead_by)&&comparison.ahead_by>=0,
    'candidate must include current protected main ancestry');
  must(x.files?.length===pr.changed_files&&names(x.files.map(f=>f.filename),manifest.CHANGED),
    'current PR changed-file list incomplete or modified scope');
  for(const f of x.files){
    must(!f.previous_filename&&isSha(f.sha),'bad or renamed file');
    if(Object.hasOwn(PIN.retirement,f.filename))
      must(f.status==='modified'&&f.sha===PIN.retirement[f.filename],
        'unauthorized legacy publisher retirement blob '+f.filename);
    else must(f.status==='added','previously added nonpublisher source altered '+f.filename);
  }
  must(x.tree?.truncated===false&&Array.isArray(x.tree.tree),'truncated or absent candidate tree');
  const index=new Map();
  for(const item of x.tree.tree){
    must(typeof item.path==='string'&&!index.has(item.path),'duplicate tree entry');
    index.set(item.path,item);
  }
  for(const [path,id] of Object.entries(source)){
    const expectation=PIN.retirement[path]||id, item=index.get(path);
    must(item?.sha===expectation&&item?.type==='blob'&&item?.mode==='100644',
      'protected science/control source drift '+path);
  }
  for(const [path,id] of Object.entries(acad)){
    const item=index.get(path);
    must(item?.sha===id&&item?.type==='tree'&&item?.mode==='040000',
      'academic tree changed '+path);
  }
  const run=x.run;
  must(run?.id===PIN.historicalRun&&run.head_sha===PIN.historicalHead&&
    run.workflow_id===PIN.historicalWorkflow&&run.run_attempt===1&&
    run.status==='completed'&&run.conclusion==='success'&&
    run.event==='pull_request'&&run.path==='.github/workflows/yesaf-e4e5-migration-science.yml'&&
    run.repository?.full_name===PIN.repository,'historical run invalid or falsely transferred');
  must(x.jobs?.total_count===9&&names(x.jobs.jobs?.map(j=>j.name),manifest.JOBS),
    'historical jobs incomplete');
  for(const j of x.jobs.jobs)
    must(Number.isSafeInteger(j.id)&&j.id>0&&j.run_id===PIN.historicalRun&&
      j.status==='completed'&&j.conclusion==='success','historical job not successful');
  return Object.freeze({
    result:'SOURCE_CONTINUITY_EVIDENCE_ONLY', currentMain:current,currentCandidate:pr.head.sha,
    historicalScienceHead:PIN.historicalHead,historicalRun:PIN.historicalRun,
    preservedOriginalScienceJobs:9,retirementBlobs:8,protectedSources:33,academicTrees:8,
    actualV2Installed:false,oldPredecessorFailuresRemainBinding:true,
    independentCertificateIssued:false,mergeAllowed:false,productionWriteAllowed:false,
    productionReleaseAuthorized:false,production:'HOLD_NO_GO'
  });
}
