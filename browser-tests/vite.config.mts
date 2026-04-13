import { defineConfig } from 'vite';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const browserTestsDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(browserTestsDir, '..');
const packagesDir = join(repoRoot, 'packages');
const browserTestShimsDir = join(browserTestsDir, 'smoke-app', 'src', 'shims');

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
    __RAW_PACKAGE_URLS__: JSON.stringify(
      Object.fromEntries(
        Object.entries(taquitoAliases).map(([packageName, packagePath]) => [
          packageName,
          `/@fs/${packagePath}`,
        ])
      )
    ),
  },
  resolve: {
    alias: {
      ...taquitoAliases,
      '@taquito/sapling-spend-params': join(browserTestShimsDir, 'sapling-spend-params.ts'),
      '../saplingOutputParams.js': join(browserTestShimsDir, 'sapling-output-params.ts'),
    },
  },
  optimizeDeps: {
    entries: [join(browserTestsDir, 'smoke-app', 'src', 'prewarm-packages.ts')],
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
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
