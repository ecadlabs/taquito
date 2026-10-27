import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  existsSync,
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
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
// Packs the built @taquito packages that the fixtures name, with their workspace dependencies,
// installs the tarballs into a fresh consumer, runs every test-fixtures/consumers/*.runtime.mjs
// through require and import, and type-checks every test-fixtures/consumers/*.types.ts as CJS and
// ESM. Run `npm run build` first. The packages ship UMD builds without an
// exports map, so the import run checks Node's CJS interop, not a separate ESM build.
const fixtures = join(root, 'test-fixtures/consumers');
const run = (cmd, args, cwd = consumer) =>
  execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    timeout: 180000,
    env: { ...process.env, NODE_PATH: '' },
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
const fixtureFiles = (suffix) => {
  const files = readdirSync(fixtures).filter((file) => file.endsWith(suffix));
  assert.ok(files.length > 0, `Expected consumer fixtures matching *${suffix}`);
  return files;
};
const runtimeFixtures = fixtureFiles('.runtime.mjs');
const typeFixtures = fixtureFiles('.types.ts');
for (const file of [...runtimeFixtures, ...typeFixtures]) {
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
  const require = createRequire(join(consumer, 'package.json'));
  for (const name of packages)
    assert.ok(realpathSync(require.resolve(name)).startsWith(join(consumer, 'node_modules')));

  for (const file of runtimeFixtures) {
    writeFileSync(join(consumer, file), readFileSync(join(fixtures, file), 'utf8'));
    const base = file.replace(/\.runtime\.mjs$/, '');
    writeFileSync(
      join(consumer, base + '.check.cjs'),
      `const assert = require('node:assert/strict');
const load = async (name) => require(name);
import('./${file}')
  .then((fixture) => fixture.default({ assert, load }))
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
await fixture({ assert, load: async (name) => (await import(name)).default });
`
    );
    run(process.execPath, [base + '.check.cjs']);
    run(process.execPath, [base + '.check.mjs']);
  }

  for (const file of typeFixtures) {
    for (const ext of ['cts', 'mts']) {
      const name = file.replace(/\.ts$/, '.' + ext);
      writeFileSync(join(consumer, name), readFileSync(join(fixtures, file), 'utf8'));
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
        name,
      ]);
    }
  }
  console.log(
    `Installed ${packages.size} packages: ${runtimeFixtures.length} runtime and ${typeFixtures.length} type fixture(s) passed.`
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}
