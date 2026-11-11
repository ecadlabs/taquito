/// <reference types="chrome" preserve="true" />
// Side-effect-free re-exports from @ecadlabs/beacon-types.
// Importing this module does NOT pull in the Beacon DAppClient or trigger
// any beacon-dapp initialization. Safe for type-only or enum-only usage.
//
// For BeaconEvent and DAppClientOptions, import from '@taquito/beacon-wallet'
// (the main entry point) instead, since those live in @ecadlabs/beacon-dapp
// which has unavoidable side effects.
export {
  BeaconErrorType,
  BeaconMessageType,
  ColorMode,
  NetworkType,
  Origin,
  PermissionScope,
  Regions,
  SigningType,
  TransportStatus,
  TransportType,
} from '@ecadlabs/beacon-types';
export type {
  AccountInfo,
  AppMetadata,
  BlockExplorerInterface,
  BroadcastResponseOutput,
  ConnectionContext,
  ErrorResponse,
  Network,
  NodeDistributions,
  OperationResponseOutput,
  PartialTezosOperation,
  PermissionResponseOutput,
  RequestBroadcastInput,
  RequestOperationInput,
  RequestPermissionInput,
  RequestSignPayloadInput,
  SignPayloadResponseOutput,
  WalletInfo,
} from '@ecadlabs/beacon-types';
