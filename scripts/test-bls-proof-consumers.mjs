import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync,realpathSync} from 'node:fs';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(dirname(fileURLToPath(import.meta.url)));const temp=mkdtempSync(join(tmpdir(),'taquito-bls-proofs-'));const consumer=join(temp,'consumer');
const run=(cmd,args,cwd=consumer)=>execFileSync(cmd,args,{cwd,encoding:'utf8',timeout:180000,env:{...process.env,NODE_PATH:''}});
try{
 mkdirSync(consumer);writeFileSync(join(consumer,'package.json'),JSON.stringify({private:true,devDependencies:{'@types/node':'^22.20.5'}}));
 const tarballs=['core','utils','http-utils','rpc','signer'].map(name=>{const [item]=JSON.parse(run('npm',['pack','--json','--ignore-scripts','--pack-destination',temp],join(root,'packages/taquito-'+name)));return join(temp,item.filename);});
 run('npm',['install','--ignore-scripts','--no-audit','--no-fund',...tarballs]);const require=createRequire(join(consumer,'package.json'));for(const name of ['signer','rpc'])assert.ok(realpathSync(require.resolve('@taquito/'+name)).startsWith(join(consumer,'node_modules')));
 const fixture=JSON.parse(readFileSync(join(root,'test-fixtures/bls-aggregate-proofs.json')));
 const exercise="const fixtures="+JSON.stringify(fixture)+";const signer=new signerPkg.InMemorySigner(fixtures.members[0].secretKey);assert.equal((await signer.provePossession(fixtures.aggregate.public_key)).prefixSig,fixtures.members[0].overrideProof);const rpc=new rpcPkg.RpcClient('https://rpc.invalid');assert.equal(typeof rpc.aggregateProofs,'function');Object.defineProperty(rpc,'aggregateProofs',{value:undefined});await assert.rejects(new rpcPkg.RpcClientCache(rpc).aggregateProofs({public_key:fixtures.aggregate.public_key,proofs:[]}),corePkg.UnsupportedActionError);";
 writeFileSync(join(consumer,'check.cjs'),"const assert=require('node:assert/strict');const signerPkg=require('@taquito/signer');const rpcPkg=require('@taquito/rpc');const corePkg=require('@taquito/core');(async()=>{"+exercise+"})().catch(error=>{console.error(error);process.exitCode=1});");
 writeFileSync(join(consumer,'check.mjs'),"import assert from 'node:assert/strict';import signerPkg from '@taquito/signer';import rpcPkg from '@taquito/rpc';import corePkg from '@taquito/core';"+exercise);
 run(process.execPath,['check.cjs']);run(process.execPath,['check.mjs']);
 const types=readFileSync(join(root,'test-fixtures/bls-proof-types.ts'),'utf8');
 for(const ext of ['cts','mts']){writeFileSync(join(consumer,'types.'+ext),types);run(process.execPath,[join(root,'node_modules/typescript/bin/tsc'),'--strict','--noEmit','--target','ES2022','--module','NodeNext','--moduleResolution','NodeNext','types.'+ext]);}
 console.log('Installed CJS, native ESM imports, strict declarations and legacy custom interfaces passed.');
}finally{rmSync(temp,{recursive:true,force:true});}
