// Installs actual tarballs outside the monorepo before loading their browser entrypoints.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  copyFileSync,
  writeFileSync,
  realpathSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const temporary = mkdtempSync(join(tmpdir(), 'taquito-buffer-'));
const consumer = join(temporary, 'consumer');
const run = (command, args, cwd = consumer) =>
  execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    timeout: 240000,
    maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, NODE_PATH: '' },
  });
try {
  console.log(
    run(
      join(root, 'node_modules', '.bin', 'tsc'),
      [
        '--ignoreConfig',
        '--noEmit',
        '--skipLibCheck',
        '--strict',
        '--types',
        'node',
        '--moduleResolution',
        'bundler',
        '--module',
        'esnext',
        '--target',
        'es2020',
        'browser-tests/tests/buffer-portability.spec.ts',
        'browser-tests/smoke-app/src/buffer-scenarios.ts',
      ],
      root
    )
  );
  mkdirSync(consumer);
  const rootPackage = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({
      name: 'taquito-buffer-consumer',
      private: true,
      overrides: rootPackage.overrides,
    })
  );
  const packages = readdirSync(join(root, 'packages')).filter((name) => {
    try {
      return !JSON.parse(readFileSync(join(root, 'packages', name, 'package.json'), 'utf8'))
        .private;
    } catch {
      return false;
    }
  });
  const tarballs = packages.map((name) => {
    const [packed] = JSON.parse(
      run(
        'npm',
        ['pack', '--json', '--ignore-scripts', '--pack-destination', temporary],
        join(root, 'packages', name)
      )
    );
    return join(temporary, packed.filename);
  });
  console.log(run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', ...tarballs]));
  for (const name of ['buffer-fixtures.ts', 'buffer-scenarios.ts'])
    copyFileSync(join(root, 'browser-tests/smoke-app/src', name), join(consumer, name));
  writeFileSync(
    join(consumer, 'scenario.html'),
    '<div id="status">{"status":"loading"}</div><script type="module" src="/main.ts"></script>'
  );
  writeFileSync(
    join(consumer, 'main.ts'),
    `import {runBufferScenario} from './buffer-scenarios';
    try { const id=new URL(location.href).searchParams.get('scenario'); const result=await runBufferScenario(id ?? ''); document.querySelector('#status').textContent=JSON.stringify({status:'ok',...result}); }
    catch(error) { document.querySelector('#status').textContent=JSON.stringify({status:'error',message:error instanceof Error ? error.message : String(error),stack:error instanceof Error ? error.stack : ''}); }`
  );
  console.log(
    run(join(root, 'node_modules/.bin/tsc'), [
      '--ignoreConfig',
      '--noEmit',
      '--skipLibCheck',
      '--strict',
      '--moduleResolution',
      'bundler',
      '--module',
      'esnext',
      '--target',
      'es2020',
      'buffer-scenarios.ts',
    ])
  );
  const config = join(temporary, 'vite.config.mjs');
  writeFileSync(
    config,
    'export default ' +
      JSON.stringify({
        root: consumer,
        build: {
          target: 'es2022',
          minify: false,
          rollupOptions: { input: join(consumer, 'scenario.html') },
        },
        preview: { host: '127.0.0.1', port: 4373, strictPort: true },
      })
  );
  console.log(run(join(root, 'node_modules/.bin/vite'), ['build', '--config', config], root));
  const require = createRequire(join(consumer, 'package.json'));
  for (const name of packages) {
    const pkg = JSON.parse(readFileSync(join(root, 'packages', name, 'package.json'), 'utf8'));
    assert.ok(
      realpathSync(require.resolve(pkg.name)).startsWith(
        join(consumer, 'node_modules', '@taquito') + '/'
      )
    );
  }
  let result;
  try {
    result = execFileSync(
      join(root, 'node_modules', '.bin', 'playwright'),
      [
        'test',
        '--config',
        'browser-tests/playwright.config.ts',
        'browser-tests/tests/buffer-portability.spec.ts',
        '--project=chromium',
      ],
      {
        cwd: root,
        encoding: 'utf8',
        timeout: 180000,
        maxBuffer: 16 * 1024 * 1024,
        env: {
          ...process.env,
          NODE_PATH: '',
          CI: '1',
          TAQUITO_BROWSER_PORT: '4373',
          TAQUITO_BUFFER_CONSUMER_CONFIG: config,
          TAQUITO_BROWSER_PACKAGES_DIR: join(consumer, 'node_modules', '@taquito'),
        },
      }
    );
  } catch (error) {
    if (error?.stdout) console.error(error.stdout);
    if (error?.stderr) console.error(error.stderr);
    throw error;
  }
  console.log(result);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
