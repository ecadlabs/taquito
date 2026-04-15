const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } = require('node:fs');
const { join } = require('node:path');

const { syncWorkspaceDeps } = require('./sync-workspace-deps.js');

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('syncWorkspaceDeps only rewrites versions for workspace packages', () => {
  const root = mkdtempSync(join(os.tmpdir(), 'sync-workspace-deps-'));

  try {
    mkdirSync(join(root, 'packages', 'taquito'), { recursive: true });
    mkdirSync(join(root, 'packages', 'taquito-core'), { recursive: true });
    mkdirSync(join(root, 'packages', 'taquito-sapling'), { recursive: true });
    mkdirSync(join(root, 'integration-tests'), { recursive: true });

    writeJson(join(root, 'package.json'), {
      name: 'taquito-monorepo',
      version: '24.2.0',
      workspaces: ['packages/*', 'integration-tests'],
    });

    writeJson(join(root, 'packages', 'taquito', 'package.json'), {
      name: '@taquito/taquito',
      version: '24.2.0',
      dependencies: {
        '@taquito/core': '^24.2.0',
      },
    });

    writeJson(join(root, 'packages', 'taquito-core', 'package.json'), {
      name: '@taquito/core',
      version: '24.2.0',
    });

    writeJson(join(root, 'packages', 'taquito-sapling', 'package.json'), {
      name: '@taquito/sapling',
      version: '24.2.0',
      dependencies: {
        '@taquito/core': '^24.2.0',
        '@taquito/sapling-wasm': '0.2.0',
      },
    });

    writeJson(join(root, 'integration-tests', 'package.json'), {
      name: 'integration-tests',
      version: '24.2.0',
      dependencies: {
        '@taquito/taquito': '^24.2.0',
      },
    });

    syncWorkspaceDeps(root, '24.3.0-beta.3');

    assert.equal(readJson(join(root, 'package.json')).version, '24.3.0-beta.3');
    assert.equal(
      readJson(join(root, 'packages', 'taquito', 'package.json')).dependencies['@taquito/core'],
      '^24.3.0-beta.3'
    );
    assert.equal(
      readJson(join(root, 'packages', 'taquito-sapling', 'package.json')).dependencies['@taquito/core'],
      '^24.3.0-beta.3'
    );
    assert.equal(
      readJson(join(root, 'packages', 'taquito-sapling', 'package.json')).dependencies['@taquito/sapling-wasm'],
      '0.2.0'
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
