import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  cpSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  realpathSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, dirname, basename, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const fixtures = join(root, 'test-fixtures/consumers');
const run = (cmd, args, cwd = consumer) =>
  execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    timeout: 180000,
    maxBuffer: 10 * 1024 * 1024,
    env: { ...process.env, NODE_PATH: '', TAQUITO_HTTP_RETRY_COUNT: '0' },
  });
const workspace = new Map();
for (const folder of readdirSync(join(root, 'packages'))) {
  const file = join(root, 'packages', folder, 'package.json');
  if (!existsSync(file)) continue;
  const manifest = JSON.parse(readFileSync(file, 'utf8'));
  workspace.set(manifest.name, { dir: dirname(file), manifest });
}
const packages = new Set();
const collect = (name) => {
  if (packages.has(name) || !workspace.has(name)) return;
  packages.add(name);
  Object.keys(workspace.get(name).manifest.dependencies ?? {}).forEach(collect);
};
const fixtureFiles = (suffix, dir = fixtures) => {
  const files = readdirSync(dir).filter((file) => file.endsWith(suffix));
  assert.ok(files.length > 0, `Expected consumer fixtures matching *${suffix}`);
  return files;
};
const runtimeFixtures = fixtureFiles('.runtime.mjs');
const typeFixtures = fixtureFiles('.types.ts');
const browserFixtures = fixtureFiles('.js', join(fixtures, 'browser')).map((file) =>
  join('browser', file)
);
for (const file of [...runtimeFixtures, ...typeFixtures, ...browserFixtures]) {
  for (const [name] of readFileSync(join(fixtures, file), 'utf8').matchAll(
    /@taquito\/[a-z0-9-]+/g
  )) {
    assert.ok(workspace.has(name), `${file} names ${name}, which is not a workspace package`);
    collect(name);
  }
}
for (const name of packages) {
  const { dir, manifest } = workspace.get(name);
  assert.ok(existsSync(join(dir, manifest.main)), `${name} is not built; run npm run build first`);
}
const temp = mkdtempSync(join(tmpdir(), 'taquito-consumers-'));
const consumer = join(temp, 'consumer');
try {
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({ private: true, devDependencies: { '@types/node': '^22.20.5' } })
  );
  const tarballs = [...packages].map((name) => {
    const [item] = JSON.parse(
      run(
        'npm',
        ['pack', '--json', '--ignore-scripts', '--pack-destination', temp],
        workspace.get(name).dir
      )
    );
    return join(temp, item.filename);
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
  console.log(`Consumer runtime ${provenance.node}, TypeScript ${provenance.typescript}`);
  if (process.env.TAQUITO_PACKAGE_REPORT_DIR) {
    mkdirSync(process.env.TAQUITO_PACKAGE_REPORT_DIR, { recursive: true });
    writeFileSync(join(process.env.TAQUITO_PACKAGE_REPORT_DIR, 'package-lock.json'), lock);
    writeFileSync(
      join(process.env.TAQUITO_PACKAGE_REPORT_DIR, 'provenance.json'),
      JSON.stringify(provenance, null, 2) + '\n'
    );
  }
  const require = createRequire(join(consumer, 'package.json'));
  for (const name of packages) {
    const installed = realpathSync(join(consumer, 'node_modules', name)) + sep;
    assert.ok(realpathSync(require.resolve(name)).startsWith(installed));
  }

  for (const file of runtimeFixtures) {
    writeFileSync(join(consumer, file), readFileSync(join(fixtures, file), 'utf8'));
    const base = file.replace(/\.runtime\.mjs$/, '');
    writeFileSync(
      join(consumer, base + '.check.cjs'),
      `const assert = require('node:assert/strict');
const load = async (name) => require(name);
import('./${file}')
  .then((fixture) => fixture.default({ assert, load, mode: 'require' }))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
`
    );
    writeFileSync(
      join(consumer, base + '.check.mjs'),
      `import assert from 'node:assert/strict';
import fixture from './${file}';
await fixture({ assert, load: (name) => import(name), mode: 'import' });
`
    );
    run(process.execPath, [base + '.check.cjs']);
    run(process.execPath, [base + '.check.mjs']);
  }

  for (const file of typeFixtures) {
    for (const { ext, module, moduleResolution } of [
      { ext: 'cts', module: 'NodeNext', moduleResolution: 'NodeNext' },
      { ext: 'mts', module: 'NodeNext', moduleResolution: 'NodeNext' },
      { ext: 'ts', module: 'preserve', moduleResolution: 'bundler' },
    ]) {
      const name = file.replace(/\.ts$/, '.' + ext);
      writeFileSync(join(consumer, name), readFileSync(join(fixtures, file), 'utf8'));
      for (const types of [[], ['node']]) {
        const config = `tsconfig.${ext}.${types.length ? 'node' : 'empty'}.json`;
        writeFileSync(
          join(consumer, config),
          JSON.stringify({
            compilerOptions: {
              strict: true,
              noEmit: true,
              target: 'ES2022',
              module,
              moduleResolution,
              types,
            },
            files: [name],
          })
        );
        run(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '--project', config]);
      }
    }
  }
  cpSync(join(fixtures, 'browser'), consumer, { recursive: true });
  const requireRoot = createRequire(join(root, 'package.json'));
  console.log(
    run(process.execPath, [
      'browser-runner.mjs',
      requireRoot.resolve('vite'),
      requireRoot.resolve('playwright'),
    ])
  );
  console.log(
    `Installed ${packages.size} packages: ${runtimeFixtures.length} runtime and ${typeFixtures.length} type fixture(s) passed.`
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}
