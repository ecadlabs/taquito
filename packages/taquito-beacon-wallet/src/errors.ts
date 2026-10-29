import { PermissionScope } from '@tezos-x/octez.connect-dapp';
import { PermissionDeniedError } from '@taquito/core';

/**
 *  @category Error
 *  Error that indicates the Beacon wallet not being initialized
 */
export class BeaconWalletNotInitialized extends PermissionDeniedError {
  constructor() {
    super();
    this.name = 'BeaconWalletNotInitialized';
    this.message =
      'BeaconWallet needs to be initialized by calling `await BeaconWallet.requestPermissions()` after configuring its constructor network first.';
  }
}

/**
 *  @category Error
 *  Error that indicates missing required permission scopes
 */
export class MissingRequiredScopes extends PermissionDeniedError {
  constructor(public readonly requiredScopes: PermissionScope[]) {
    super();
    this.name = 'MissingRequiredScopes';
    this.message = `Required permissions scopes: ${requiredScopes.join(',')} were not granted.`;
  }
}

/** Another wrapper request or account transition is still pending. */
export class BeaconWalletBusyError extends Error {
  constructor() {
    super('A Beacon wallet request is already pending. Finish it or disconnect before continuing.');
    this.name = 'BeaconWalletBusyError';
  }
}

/** A wrapper teardown interrupted the request. It does not cancel an injected operation. */
export class BeaconWalletRequestInterruptedError extends Error {
  constructor() {
    super('The Beacon wallet request was interrupted by account clearing or disconnection.');
    this.name = 'BeaconWalletRequestInterruptedError';
  }
}

export class InvalidBeaconNetworkError extends Error {
  constructor(public readonly network: string) {
    super(
      `Cannot resolve Tezos network "${network}". Supply a valid chain ID for custom or rotating networks.`
    );
    this.name = 'InvalidBeaconNetworkError';
  }
}

export class NetworkNotGrantedError extends Error {
  constructor(public readonly network: string) {
    super(`No stored account for the active wallet peer grants network "${network}".`);
    this.name = 'NetworkNotGrantedError';
  }
}

export class AmbiguousBeaconNetworkError extends Error {
  constructor(public readonly network: string) {
    super(
      `Several accounts for the active wallet peer use network "${network}". Select an exact account through the client.`
    );
    this.name = 'AmbiguousBeaconNetworkError';
  }
}
