// Side-effect-free re-exports from @ecadlabs/beacon-types.
// Importing this module does NOT pull in the Beacon DAppClient or trigger
// any beacon-dapp initialization. Safe for type-only or enum-only usage.
//
// For BeaconEvent and DAppClientOptions, import from '@taquito/beacon-wallet'
// (the main entry point) instead, since those live in @ecadlabs/beacon-dapp
// which has unavoidable side effects.
export { NetworkType, PermissionScope, SigningType, Regions } from '@ecadlabs/beacon-types';
export type {
  RequestPermissionInput,
  RequestSignPayloadInput,
  NodeDistributions,
} from '@ecadlabs/beacon-types';
