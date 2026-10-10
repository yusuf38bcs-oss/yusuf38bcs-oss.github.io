// Regression harness for the REAL governance function, parsed from the PR's workflow.
// This fixture provides fake read-only GitHub responses; it cannot issue statuses.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const repoRoot = path.resolve(import.meta.dirname, '../..');
const yaml = fs.readFileSync(path.join(repoRoot, '.github/workflows/release-governance-gate.yml'), 'utf8');
const start = yaml.indexOf('  GOVERNANCE_SCRIPT: |\n');
assert.ok(start >= 0, 'trusted governance executable block must be present');
const codeStart = start + '  GOVERNANCE_SCRIPT: |\n'.length;
const codeEnd = yaml.indexOf('\njobs:\n', codeStart);
assert.ok(codeEnd > codeStart);
const script = yaml.slice(codeStart,codeEnd)
  .split('\n').map(line => line.startsWith('    ') ? line.slice(4) : line).join('\n');
const fnStart=script.indexOf('async function verifyOneTimePracticalValidatorMigration(');
const fnEnd=script.indexOf('async function evaluatePull(',fnStart);
assert.ok(fnStart >= 0 && fnEnd > fnStart, 'real trusted migration function required');
const fnSource=script.slice(fnStart,fnEnd);
const match=fnSource.match(/const permitted = (\{[\s\S]*?\});\s*const expectedPaths/);
assert.ok(match,'seven Git blob SHA identities must be pinned by trusted function');
const expected=vm.runInNewContext('('+match[1]+')');
const paths=Object.keys(expected);
assert.equal(paths.length,7,'migration must affect exactly seven validators');

function fixture(overrides={}) {
  const current=Object.assign({
    number:468,baseRef:'main',
    headRef:'repair/conv04f-retained-validator-j-compat-20261010',
    files:paths.map(filename=>({filename,status:'modified'})),
    baseMode:'100644',headMode:'100644',baseType:'blob',headType:'blob',
    missing:null,altered:null,truncated:false
  },overrides);
  const base='b'.repeat(40), head='a'.repeat(40);
  const tree = revision => ({
    truncated:current.truncated,
    tree: paths.filter(p=>p!==current.missing).map(p=>({
      path:p,
      sha: p===current.altered ? '0'.repeat(40) :
          expected[p][revision===base?0:1],
      mode:revision===base?current.baseMode:current.headMode,
      type:revision===base?current.baseType:current.headType,
    }))
  });
  const github={
    paginate:async()=>current.files,
    rest:{
      pulls:{listFiles:()=>{}},
      git:{
        getCommit:async({commit_sha})=>({data:{tree:{sha:commit_sha==='a'.repeat(40)?'1'.repeat(40):'2'.repeat(40)}}}),
        getTree:async({tree_sha})=>({data:tree(tree_sha==='2'.repeat(40)?'b'.repeat(40):'a'.repeat(40))})
      }
    }
  };
  const sandbox={owner:'yusuf38bcs-oss',repo:'yusuf38bcs-oss.github.io',
    github,core:{info:()=>{}}};
  const verify=vm.runInNewContext(fnSource+'\nverifyOneTimePracticalValidatorMigration',sandbox);
  const pull={number:current.number,base:{ref:current.baseRef},head:{ref:current.headRef}};
  return verify(pull,head,base);
}
test('P01 trusted gate approves exact seven blob/mode/type files',async()=> {
  await assert.doesNotReject(fixture());
});
test('N01 rejects staging target',async()=> {
  await assert.rejects(fixture({baseRef:'staging'}),/protected main/);
});
test('N02 rejects unapproved branch',async()=> {
  await assert.rejects(fixture({headRef:'unauthorized'}),/branch identity/);
});
test('N03 rejects extra mutated path',async()=> {
  await assert.rejects(fixture({files:[...paths.map(filename=>({filename,status:'modified'})),{filename:'other.txt',status:'added'}]}),/exact protected seven/);
});
test('N04 rejects missing path',async()=> {
  await assert.rejects(fixture({files:paths.slice(1).map(filename=>({filename,status:'modified'}))}),/exact protected seven/);
});
test('N05 rejects candidate symlink',async()=> {
  await assert.rejects(fixture({headMode:'120000'}),/SHA\/mode\/type mismatch/);
});
test('N06 rejects base gitlink',async()=> {
  await assert.rejects(fixture({baseMode:'160000',baseType:'commit'}),/SHA\/mode\/type mismatch/);
});
test('N07 rejects altered blob',async()=> {
  await assert.rejects(fixture({altered:paths[0]}),/SHA\/mode\/type mismatch/);
});
test('N08 rejects missing tree entry',async()=> {
  await assert.rejects(fixture({missing:paths[0]}),/Missing protected validator/);
});
test('N09 rejects truncated tree',async()=> {
  await assert.rejects(fixture({truncated:true}),/truncated/);
});
test('N10 rejects nonmodified file',async()=> {
  await assert.rejects(fixture({files:paths.map((filename,i)=>({filename,status:i?'modified':'added'}))}),/exact protected seven/);
});
