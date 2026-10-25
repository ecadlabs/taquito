import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'vite';
import { chromium } from 'playwright';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const temporary = mkdtempSync(join(tmpdir(), 'taquito-hash-consumer-'));
const consumer = join(temporary, 'consumer');
const vector = JSON.parse(
  readFileSync(join(root, 'packages/taquito-utils/test/data/synthetic-hashes.json'))
).vectors[0];
const run = (cmd, args, cwd = consumer) =>
  execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NODE_PATH: '' },
    timeout: 180000,
  });
const check = `assert.equal(getTezosOperationHash('${vector.parentHex}'), '${vector.michelsonOperationHash}'); assert.equal(getEthereumTransactionHash('${vector.parentOperationHash}'), '${vector.ethereumTransactionHash}');`;
let server;
let browser;
try {
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({ private: true, devDependencies: { '@types/node': '^22.20.5' } })
  );
  const tarballs = ['core', 'utils'].map((name) => {
    const result = JSON.parse(
      run(
        'npm',
        ['pack', '--json', '--ignore-scripts', '--pack-destination', temporary],
        join(root, 'packages/taquito-' + name)
      )
    );
    return join(temporary, result[0].filename);
  });
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', ...tarballs]);
  const require = createRequire(join(consumer, 'package.json'));
  assert.ok(
    realpathSync(require.resolve('@taquito/utils')).startsWith(join(consumer, 'node_modules'))
  );
  writeFileSync(
    join(consumer, 'check.cjs'),
    `const assert = require('node:assert/strict'); const {getTezosOperationHash,getEthereumTransactionHash} = require('@taquito/utils'); ${check}`
  );
  writeFileSync(
    join(consumer, 'check.mjs'),
    `import assert from 'node:assert/strict'; import utils from '@taquito/utils'; const {getTezosOperationHash,getEthereumTransactionHash} = utils; ${check}`
  );
  run(process.execPath, ['check.cjs']);
  run(process.execPath, ['check.mjs']);
  const types = `import {getTezosOperationHash,getEthereumTransactionHash,InvalidHexStringError,toHexBuf,numToHexBuffer} from '@taquito/utils'; const a:string=getTezosOperationHash('00');const b:string=getEthereumTransactionHash('o'); const error:Error=new InvalidHexStringError('bad');const x:import('buffer').Buffer=toHexBuf(1);const y:import('buffer').Buffer=numToHexBuffer(1);void [a,b,error,x,y];`;
  for (const ext of ['cts', 'mts']) {
    writeFileSync(join(consumer, 'types.' + ext), types);
    run(process.execPath, [
      join(root, 'node_modules/typescript/bin/tsc'),
      '--strict',
      '--noEmit',
      '--target',
      'ES2022',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      'types.' + ext,
    ]);
  }
  writeFileSync(join(consumer, 'index.html'), '<script type="module" src="/main.js"></script>');
  writeFileSync(
    join(consumer, 'main.js'),
    `import {getTezosOperationHash,getEthereumTransactionHash} from '@taquito/utils'; if(typeof globalThis.Buffer!=='undefined')throw new Error('Unexpected Buffer');window.result=[getTezosOperationHash('${vector.parentHex}'),getEthereumTransactionHash('${vector.parentOperationHash}')];if(typeof globalThis.Buffer!=='undefined')throw new Error('Leaked Buffer');`
  );
  await build({ root: consumer, configFile: false, logLevel: 'warn' });
  server = await preview({
    root: consumer,
    configFile: false,
    preview: { port: 4375, strictPort: true, host: '127.0.0.1' },
  });
  browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:4375');
  await page.waitForFunction(() => Array.isArray(window.result));
  assert.deepEqual(await page.evaluate(() => window.result), [
    vector.michelsonOperationHash,
    vector.ethereumTransactionHash,
  ]);
  assert.deepEqual(errors, []);
  console.log(
    'Installed CJS, native Node ESM import, strict declarations and Chromium production bundle passed.'
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => (server ? server.httpServer.close(resolve) : resolve()));
  rmSync(temporary, { recursive: true, force: true });
}
