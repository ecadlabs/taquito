import { expect, it } from 'vitest';
import manifest from '../package.json';
import * as tezosx from '../src/taquito-tezosx';
import utilsManifest from '../../taquito-utils/package.json';

it('exports the package release version and source commit', () => {
  expect(tezosx).toHaveProperty('VERSION', {
    version: manifest.version,
    commitHash: expect.stringMatching(/^[0-9a-f]{40}$/),
  });
});

it('declares the Taquito source repository for npm provenance', () => {
  expect(manifest).toHaveProperty('repository.url', utilsManifest.repository.url);
});

it('keeps the Tezos X dependencies optional for utils consumers', () => {
  for (const name of ['viem', '@taquito/tezosx', '@taquito/michel-codec']) {
    expect(Object.keys(utilsManifest.dependencies)).not.toContain(name);
  }
});
