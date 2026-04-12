import { defineConfig } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const browserTestsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(browserTestsDir, '..');
const packagesDir = join(repoRoot, 'packages');

const taquitoAliases = Object.fromEntries(
  readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(packagesDir, entry.name, 'package.json'))
    .filter((packageJsonPath) => {
      try {
        const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        return typeof pkg.name === 'string' && pkg.name.startsWith('@taquito/') && typeof pkg.module === 'string';
      } catch {
        return false;
      }
    })
    .map((packageJsonPath) => {
      const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      return [pkg.name, join(dirname(packageJsonPath), pkg.module)];
    })
);

export default defineConfig({
  root: join(browserTestsDir, 'smoke-app'),
  define: {
    __RAW_HTTP_UTILS_URL__: JSON.stringify(
      `/@fs/${join(repoRoot, 'packages/taquito-http-utils/dist/taquito-http-utils.es6.js')}`
    ),
    __RAW_TAQUITO_URL__: JSON.stringify(
      `/@fs/${join(repoRoot, 'packages/taquito/dist/taquito.es6.js')}`
    ),
  },
  resolve: {
    alias: taquitoAliases,
  },
  server: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
});
