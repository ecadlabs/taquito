import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'vite';
import { chromium } from 'playwright';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const temp = realpathSync(mkdtempSync(join(tmpdir(), 'taquito-tezosx-consumer-')));
const consumer = join(temp, 'consumer');
const run = (cmd, args, cwd = consumer) =>
  execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    timeout: 180000,
    maxBuffer: 10 * 1024 * 1024,
    env: { ...process.env, NODE_PATH: '' },
  });
const vectors = JSON.parse(
  readFileSync(join(root, 'packages/taquito-tezosx/test/data/nac-vectors.json'))
);
const exercise = `const call=api.buildMichelsonToEvmCall({to:vectors.evm,value:1000000000000000n}); const transfer=api.toTransferParams(call);const evm=api.buildEvmToMichelsonCall({kind:'transfer',destination:vectors.account,amount:1000});assert.equal(transfer.amount,1000);assert.deepEqual(transfer.parameter.value,vectors.nativeParameter);assert.equal(evm.data,vectors.evmTransferData);assert.equal(evm.value,1000000000000000n);assert.equal(api.buildEvmToMichelsonCall({kind:'call-michelson',destination:vectors.destination,entrypoint:'message',parameter:{value:{string:'taquito 🐙 café'}}}).data,vectors.unicode.calldata);`;
let server, browser;
try {
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({ private: true, devDependencies: { '@types/node': '^22.20.5' } })
  );
  const tarballs = [
    'core',
    'http-utils',
    'michel-codec',
    'utils',
    'rpc',
    'michelson-encoder',
    'local-forging',
    'signer',
    'taquito',
    'tezosx',
  ].map((name) => {
    const [item] = JSON.parse(
      run(
        'npm',
        ['pack', '--json', '--ignore-scripts', '--pack-destination', temp],
        join(root, 'packages', 'taquito' + (name === 'taquito' ? '' : '-' + name))
      )
    );
    return join(temp, item.filename);
  });
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', ...tarballs]);
  const require = createRequire(join(consumer, 'package.json'));
  for (const name of ['tezosx', 'utils', 'taquito'])
    assert.ok(
      realpathSync(require.resolve('@taquito/' + name)).startsWith(join(consumer, 'node_modules', '@taquito', name) + sep)
    );
  writeFileSync(join(consumer, 'vectors.json'), JSON.stringify(vectors));
  writeFileSync(
    join(consumer, 'consumer.cjs'),
    `const api=require('@taquito/tezosx');const assert=require('node:assert/strict');const vectors=require('./vectors.json');${exercise}`
  );
  writeFileSync(
    join(consumer, 'consumer.mjs'),
    `import * as api from '@taquito/tezosx';import assert from 'node:assert/strict';import vectors from './vectors.json' with {type:'json'};${exercise}`
  );
  run(process.execPath, ['consumer.cjs']);
  run(process.execPath, ['consumer.mjs']);
  const types = `import {buildMichelsonToEvmCall,toTransferParams,buildEvmToMichelsonCall} from '@taquito/tezosx';import type {TransferParams} from '@taquito/taquito';const transfer:TransferParams=toTransferParams(buildMichelsonToEvmCall({to:'0x1111111111111111111111111111111111111111'}));const data:\`0x\${string}\`=buildEvmToMichelsonCall({kind:'transfer',destination:'tz1...',amount:0n}).data;void [transfer,data];`;
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
    `import * as api from '@taquito/tezosx';import vectors from './vectors.json';if(typeof globalThis.Buffer!=='undefined')throw new Error('Unexpected Buffer');const transfer=api.toTransferParams(api.buildMichelsonToEvmCall({to:vectors.evm,value:1000000000000000n}));const call=api.buildEvmToMichelsonCall({kind:'transfer',destination:vectors.account,amount:1000});window.result={transfer,data:call.data,value:call.value.toString(),unicode:api.buildEvmToMichelsonCall({kind:'call-michelson',destination:vectors.destination,entrypoint:'message',parameter:{value:{string:'taquito 🐙 café'}}}).data};`
  );
  await build({ root: consumer, configFile: false, logLevel: 'warn' });
  server = await preview({
    root: consumer,
    configFile: false,
    preview: { host: '127.0.0.1', port: 4377, strictPort: true },
  });
  browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://127.0.0.1:4377');
  await page.waitForFunction(() => window.result !== undefined);
  const result = await page.evaluate(() => window.result);
  assert.equal(result.transfer.amount, 1000);
  assert.deepEqual(result.transfer.parameter.value, vectors.nativeParameter);
  assert.equal(result.data, vectors.evmTransferData);
  assert.equal(result.value, '1000000000000000');
  assert.equal(result.unicode, vectors.unicode.calldata);
  assert.deepEqual(errors, []);
  const utils = JSON.parse(readFileSync(join(root, 'packages/taquito-utils/package.json')));
  assert.equal(utils.dependencies.viem, undefined);
  assert.equal(utils.dependencies['@taquito/tezosx'], undefined);
  assert.equal(utils.dependencies['@taquito/michel-codec'], undefined);
  console.log(
    'Installed CJS, native ESM, strict SDK transfer types and Chrome production consumers passed.'
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => (server ? server.httpServer.close(resolve) : resolve()));
  rmSync(temp, { recursive: true, force: true });
}
