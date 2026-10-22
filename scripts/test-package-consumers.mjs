import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { basename, dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const temporary = mkdtempSync(join(tmpdir(), 'taquito-consumers-'));
const consumer = join(temporary, 'consumer');
const packages = ['core', 'http-utils'];
function run(command, args, cwd = consumer) {
  console.log(`Checking ${command} ${args.join(' ')}`);
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    timeout: 180000,
    maxBuffer: 10 * 1024 * 1024,
    env: { ...process.env, NODE_PATH: '', TAQUITO_HTTP_RETRY_COUNT: '0' },
  });
}
try {
  cpSync(join(root, 'package-tests'), consumer, { recursive: true });
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({ name: 'taquito-package-consumer', private: true })
  );
  const tarballs = packages.map((name) => {
    const result = JSON.parse(
      run(
        'npm',
        ['pack', '--json', '--ignore-scripts', '--pack-destination', temporary],
        join(root, 'packages', `taquito-${name}`)
      )
    );
    assert.equal(result.length, 1);
    return join(temporary, result[0].filename);
  });
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', ...tarballs]);
  const lock = readFileSync(join(consumer, 'package-lock.json'));
  const provenance = {
    node: process.version,
    typescript: JSON.parse(readFileSync(join(root, 'node_modules/typescript/package.json'), 'utf8'))
      .version,
    lockSha256: createHash('sha256').update(lock).digest('hex'),
    tarballs: tarballs.map((path) => ({
      name: basename(path),
      sha256: createHash('sha256').update(readFileSync(path)).digest('hex'),
    })),
    dependencies: JSON.parse(lock.toString()).packages,
  };
  console.log(JSON.stringify(provenance, null, 2));
  if (process.env.TAQUITO_PACKAGE_REPORT_DIR) {
    mkdirSync(process.env.TAQUITO_PACKAGE_REPORT_DIR, { recursive: true });
    writeFileSync(join(process.env.TAQUITO_PACKAGE_REPORT_DIR, 'package-lock.json'), lock);
    writeFileSync(
      join(process.env.TAQUITO_PACKAGE_REPORT_DIR, 'provenance.json'),
      JSON.stringify(provenance, null, 2) + '\n'
    );
  }
  const requireConsumer = createRequire(join(consumer, 'package.json'));
  const httpEntry = requireConsumer.resolve('@taquito/http-utils');
  const requireHttp = createRequire(httpEntry);
  const coreEntry = realpathSync(requireConsumer.resolve('@taquito/core'));
  assert.equal(realpathSync(requireHttp.resolve('@taquito/core')), coreEntry);
  for (const name of packages) {
    assert.ok(
      realpathSync(requireConsumer.resolve(`@taquito/${name}`)).startsWith(
        join(consumer, 'node_modules', '@taquito', name) + sep
      )
    );
  }
  console.log(run(process.execPath, ['commonjs.cjs']));
  console.log(run(process.execPath, ['esm.mjs']));
  const typeSource = readFileSync(join(consumer, 'types.ts'), 'utf8');
  for (const extension of ['cts', 'mts']) {
    writeFileSync(join(consumer, `types.${extension}`), typeSource);
    console.log(
      run(process.execPath, [
        join(root, 'node_modules/typescript/bin/tsc'),
        '--noEmit',
        '--strict',
        '--skipLibCheck',
        'false',
        '--target',
        'ES2022',
        '--module',
        'NodeNext',
        '--moduleResolution',
        'NodeNext',
        `types.${extension}`,
      ])
    );
  }
  console.log(
    run(process.execPath, [
      join(root, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      'false',
      '--target',
      'ES2022',
      '--module',
      'preserve',
      '--moduleResolution',
      'bundler',
      'types.ts',
    ])
  );
  const requireRoot = createRequire(join(root, 'package.json'));
  console.log(
    run(process.execPath, [
      'browser-runner.mjs',
      requireRoot.resolve('vite'),
      requireRoot.resolve('playwright'),
    ])
  );
  console.log('Packed package consumers passed.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
