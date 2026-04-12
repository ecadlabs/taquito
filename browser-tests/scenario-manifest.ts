export type PackageScenarioId =
  | 'core-import'
  | 'http-utils-behavior'
  | 'utils-behavior'
  | 'rpc-behavior'
  | 'michel-codec-behavior'
  | 'michelson-encoder-behavior'
  | 'local-forging-behavior'
  | 'signer-import'
  | 'taquito-behavior'
  | 'tzip16-behavior'
  | 'tzip12-behavior'
  | 'contracts-library-behavior'
  | 'timelock-behavior'
  | 'beacon-wallet-import'
  | 'wallet-connect-import'
  | 'ledger-signer-behavior'
  | 'sapling-import';

export type PackageScenario = {
  id: PackageScenarioId;
  packageName: string;
  description: string;
};

export const packageScenarios: readonly PackageScenario[] = [
  {
    id: 'core-import',
    packageName: '@taquito/core',
    description: 'imports the core package in a browser',
  },
  {
    id: 'http-utils-behavior',
    packageName: '@taquito/http-utils',
    description: 'imports http-utils and instantiates HttpBackend',
  },
  {
    id: 'utils-behavior',
    packageName: '@taquito/utils',
    description: 'imports utils and round-trips UTF-8 bytes',
  },
  {
    id: 'rpc-behavior',
    packageName: '@taquito/rpc',
    description: 'imports rpc and instantiates RpcClient',
  },
  {
    id: 'michel-codec-behavior',
    packageName: '@taquito/michel-codec',
    description: 'imports michel-codec and parses Micheline',
  },
  {
    id: 'michelson-encoder-behavior',
    packageName: '@taquito/michelson-encoder',
    description: 'imports michelson-encoder and encodes a bytes-like token value',
  },
  {
    id: 'local-forging-behavior',
    packageName: '@taquito/local-forging',
    description: 'imports local-forging and forges a manager operation',
  },
  {
    id: 'signer-import',
    packageName: '@taquito/signer',
    description: 'imports the signer package in a browser',
  },
  {
    id: 'taquito-behavior',
    packageName: '@taquito/taquito',
    description: 'imports taquito and instantiates TezosToolkit',
  },
  {
    id: 'tzip16-behavior',
    packageName: '@taquito/tzip16',
    description: 'imports tzip16 and instantiates Tzip16Module',
  },
  {
    id: 'tzip12-behavior',
    packageName: '@taquito/tzip12',
    description: 'imports tzip12 and instantiates Tzip12Module',
  },
  {
    id: 'contracts-library-behavior',
    packageName: '@taquito/contracts-library',
    description: 'imports contracts-library and stores contract metadata',
  },
  {
    id: 'timelock-behavior',
    packageName: '@taquito/timelock',
    description: 'imports timelock and opens a generated chest',
  },
  {
    id: 'beacon-wallet-import',
    packageName: '@taquito/beacon-wallet',
    description: 'imports beacon-wallet in a browser',
  },
  {
    id: 'wallet-connect-import',
    packageName: '@taquito/wallet-connect',
    description: 'imports wallet-connect in a browser',
  },
  {
    id: 'ledger-signer-behavior',
    packageName: '@taquito/ledger-signer',
    description: 'imports ledger-signer and exercises LedgerSigner byte helpers',
  },
  {
    id: 'sapling-import',
    packageName: '@taquito/sapling',
    description: 'imports sapling in a browser',
  },
] as const;
