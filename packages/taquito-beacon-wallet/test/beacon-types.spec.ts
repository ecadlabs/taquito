import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import { NetworkType, PermissionScope, SigningType, Regions } from '../src/beacon-types';

import type {
  AccountInfo,
  Network,
  RequestPermissionInput,
  RequestPermissionNetwork,
  RequestSignPayloadInput,
  NodeDistributions,
} from '../src/beacon-types';

// BeaconEvent, DAppClientOptions and the CAIP-2 helpers live on the main entry
// point (not ./types) because they require @tezos-x/octez.connect-dapp which has
// side effects.
import {
  BeaconEvent,
  TEZOS_NETWORK_GENESIS_IDS,
  isValidTezosCaip2,
  networkTypeFromTezosCaip2,
  normalizeTezosCaip2,
  tezosCaip2FromNetworkType,
} from '../src/taquito-beacon-wallet';
import type { DAppClientOptions } from '../src/taquito-beacon-wallet';

describe('beacon-types re-exports (side-effect-free)', () => {
  it('should export NetworkType enum', () => {
    expect(NetworkType.SHADOWNET).toBeDefined();
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

  it('should export the CAIP-2 chain id helpers', () => {
    expect(tezosCaip2FromNetworkType(NetworkType.MAINNET)).toEqual('tezos:NetXdQprcVkpaWU');
    expect(networkTypeFromTezosCaip2('tezos:NetXdQprcVkpaWU')).toEqual(NetworkType.MAINNET);
    expect(normalizeTezosCaip2('NetXdQprcVkpaWU')).toEqual('tezos:NetXdQprcVkpaWU');
    expect(isValidTezosCaip2('tezos:NetXdQprcVkpaWU')).toBe(true);
    expect(TEZOS_NETWORK_GENESIS_IDS[NetworkType.GHOSTNET]).toEqual('NetXnHfVqm9iesp');
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
const _account: AccountInfo = {} as AccountInfo;
const _network: Network = {} as Network;
const _requestNetwork: RequestPermissionNetwork = { chainId: 'tezos:NetXdQprcVkpaWU' };
const _multiNetworkPerm: RequestPermissionInput = { networks: [_requestNetwork] };

void _opts;
void _perm;
void _sign;
void _nodes;
void _account;
void _network;
void _multiNetworkPerm;
