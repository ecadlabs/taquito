import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const { build } = await import(pathToFileURL(process.argv[2]).href);
const {
  default: { chromium },
} = await import(pathToFileURL(process.argv[3]).href);
const root = process.cwd();
const expected = ['core', 'http-utils'].map((name) => {
  const directory = join(root, 'node_modules', '@taquito', name);
  const pkg = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'));
  return join(directory, pkg.module);
});
await build({
  root,
  configFile: false,
  logLevel: 'warn',
  plugins: [
    {
      name: 'verify-installed-module-route',
      generateBundle() {
        const modules = new Set(this.getModuleIds());
        for (const path of expected)
          assert.ok(modules.has(path), `Missing installed ESM route: ${path}`);
      },
    },
  ],
});
const output = join(root, 'dist');
const server = createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = resolve(output, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(output + sep)) {
    response.writeHead(404).end();
    return;
  }
  try {
    response.setHeader('content-type', file.endsWith('.js') ? 'text/javascript' : 'text/html');
    response.end(readFileSync(file));
  } catch {
    response.writeHead(404).end();
  }
});
let browser;
try {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  browser = await chromium.launch({ headless: true, timeout: 30000 });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}`, { timeout: 15000 });
  await page.waitForFunction(() => globalThis.consumerPassed === true, undefined, {
    timeout: 15000,
  });
  assert.deepEqual(errors, []);
  console.log('Installed Vite browser consumer passed.');
} finally {
  try {
    if (browser) await browser.close();
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
