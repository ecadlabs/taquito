import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const temp = mkdtempSync(join(tmpdir(), 'taquito-big-map-values-'));
const consumer = join(temp, 'consumer');
const run = (cmd, args, cwd = consumer) =>
  execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    timeout: 180000,
    env: { ...process.env, NODE_PATH: '' },
  });
try {
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({ private: true, devDependencies: { '@types/node': '^22.20.5' } })
  );
  const tarballs = [
    'core',
    'utils',
    'http-utils',
    'rpc',
    'michel-codec',
    'michelson-encoder',
    'local-forging',
    'signer',
    'taquito',
  ].map((name) => {
    const folder = name === 'taquito' ? name : 'taquito-' + name;
    const [item] = JSON.parse(
      run(
        'npm',
        ['pack', '--json', '--ignore-scripts', '--pack-destination', temp],
        join(root, 'packages', folder)
      )
    );
    return join(temp, item.filename);
  });
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', ...tarballs]);
  const require = createRequire(join(consumer, 'package.json'));
  for (const name of ['taquito', 'rpc'])
    assert.ok(
      realpathSync(require.resolve('@taquito/' + name)).startsWith(join(consumer, 'node_modules'))
    );
  const exercise = `
    const backend = new httpPkg.HttpBackend();
    const calls = [];
    backend.createRequest = async function(options) { calls.push(options); return options.url.endsWith('/hash') ? 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX' : [{ int: '42' }]; };
    const rpc = new rpcPkg.RpcClient('https://rpc.invalid', 'main', backend);
    const toolkit = new sdkPkg.TezosToolkit(rpc);
    const schema = new encoderPkg.Schema({ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'nat' }] });
    const page = await toolkit.contract.getBigMapValuesPageByID('123', schema, { length: 1 });
    assert.equal(page.values[0].toFixed(), '42');
    assert.equal(calls[1].url, 'https://rpc.invalid/chains/main/blocks/' + page.blockHash + '/context/big_maps/123');
    assert.deepEqual(calls[1].query, { offset: 0, length: 1 });
    Object.defineProperty(rpc, 'getBigMapValuesPage', { value: undefined });
    await assert.rejects(new rpcPkg.RpcClientCache(rpc).getBigMapValuesPage('123'), corePkg.UnsupportedActionError);
  `;
  const names = {
    sdkPkg: 'taquito',
    rpcPkg: 'rpc',
    corePkg: 'core',
    httpPkg: 'http-utils',
    encoderPkg: 'michelson-encoder',
  };
  const cjs = Object.entries(names)
    .map(([name, pkg]) => `const ${name} = require('@taquito/${pkg}');`)
    .join('');
  const esm = Object.entries(names)
    .map(([name, pkg]) => `import ${name} from '@taquito/${pkg}';`)
    .join('');
  writeFileSync(
    join(consumer, 'check.cjs'),
    "const assert = require('node:assert/strict');" +
      cjs +
      '(async()=>{' +
      exercise +
      '})().catch(error=>{console.error(error);process.exitCode=1});'
  );
  writeFileSync(
    join(consumer, 'check.mjs'),
    "import assert from 'node:assert/strict';" + esm + exercise
  );
  run(process.execPath, ['check.cjs']);
  run(process.execPath, ['check.mjs']);
  const types = readFileSync(join(root, 'test-fixtures/big-map-values-types.ts'), 'utf8');
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
  console.log(
    'Installed CJS, native ESM imports, strict declarations, exact-block reads and legacy provider types passed.'
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}
