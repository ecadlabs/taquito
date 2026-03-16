import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import {
  NetworkType,
  PermissionScope,
  SigningType,
  Regions,
} from '../src/beacon-types';

import type {
  RequestPermissionInput,
  RequestSignPayloadInput,
  NodeDistributions,
} from '../src/beacon-types';

// BeaconEvent and DAppClientOptions live on the main entry point (not ./types)
// because they require @ecadlabs/beacon-dapp which has side effects.
import { BeaconEvent } from '../src/taquito-beacon-wallet';
import type { DAppClientOptions } from '../src/taquito-beacon-wallet';

describe('beacon-types re-exports (side-effect-free)', () => {
  it('should export NetworkType enum', () => {
    expect(NetworkType.GHOSTNET).toBeDefined();
    expect(NetworkType.MAINNET).toBeDefined();
  });

  it('should export PermissionScope enum', () => {
    expect(PermissionScope.OPERATION_REQUEST).toBeDefined();
  });

  it('should export SigningType enum', () => {
    expect(SigningType.OPERATION).toBeDefined();
    expect(SigningType.RAW).toBeDefined();
    expect(SigningType.MICHELINE).toBeDefined();
  });

  it('should export Regions enum', () => {
    expect(Regions.EUROPE_WEST).toBeDefined();
  });
});

describe('main entry re-exports (beacon-dapp types)', () => {
  it('should export BeaconEvent enum', () => {
    expect(BeaconEvent.ACTIVE_ACCOUNT_SET).toBeDefined();
  });
});

describe('package.json exports map', () => {
  const pkgDir = resolve(__dirname, '..');
  const distDir = resolve(pkgDir, 'dist');
  const pkg = JSON.parse(readFileSync(resolve(pkgDir, 'package.json'), 'utf-8'));

  it('should declare a ./types export', () => {
    expect(pkg.exports['./types']).toBeDefined();
  });

  // This test validates that the exports map points at real files.
  // It requires a prior build (dist/ must exist). Skip gracefully on
  // clean `nx test` runs where build hasn't happened yet.
  const hasDist = existsSync(distDir);
  (hasDist ? it : it.skip)('should point ./types at files that exist after build', () => {
    const typesExport = pkg.exports['./types'];
    for (const [condition, relPath] of Object.entries(typesExport)) {
      const fullPath = resolve(pkgDir, relPath as string);
      expect({ condition, exists: existsSync(fullPath) }).toEqual({
        condition,
        exists: true,
      });
    }
  });
});

// Type-level assertions: these assignments verify the types exist and are structurally correct.
// They never execute; they only need to compile.
const _opts: DAppClientOptions = {} as DAppClientOptions;
const _perm: RequestPermissionInput = {} as RequestPermissionInput;
const _sign: RequestSignPayloadInput = {} as RequestSignPayloadInput;
const _nodes: NodeDistributions = {} as NodeDistributions;

void _opts;
void _perm;
void _sign;
void _nodes;
