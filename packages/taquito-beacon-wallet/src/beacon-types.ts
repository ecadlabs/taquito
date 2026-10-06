// Side-effect-free re-exports from @tezos-x/octez.connect-types.
// Importing this module does NOT pull in the Beacon DAppClient or trigger
// any octez.connect-dapp initialization. Safe for type-only or enum-only usage.
//
// For BeaconEvent and DAppClientOptions, import from '@taquito/beacon-wallet'
// (the main entry point) instead, since those live in @tezos-x/octez.connect-dapp
// which has unavoidable side effects.
export { NetworkType, PermissionScope, SigningType, Regions } from '@tezos-x/octez.connect-types';
export type {
  RequestPermissionInput,
  RequestSignPayloadInput,
  NodeDistributions,
} from '@tezos-x/octez.connect-types';
