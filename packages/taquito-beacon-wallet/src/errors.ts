import { PermissionScope } from '@tezos-x/octez.connect-dapp';
import { ParameterValidationError, PermissionDeniedError } from '@taquito/core';

/**
 *  @category Error
 *  Error that indicates the Beacon wallet not being initialized
 */
export class BeaconWalletNotInitialized extends PermissionDeniedError {
  constructor() {
    super();
    this.name = 'BeaconWalletNotInitialized';
    this.message =
      'BeaconWallet needs to be initialized by calling `await BeaconWallet.requestPermissions({network: {type: "chosen_network"}})` first.';
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

/**
 *  @category Error
 *  Error that indicates a network was selected that the connected wallet did not
 *  grant an account for in the current session
 */
export class NetworkNotGrantedError extends PermissionDeniedError {
  constructor(
    public readonly requestedNetwork: string,
    public readonly grantedNetworks: string[]
  ) {
    super();
    this.name = 'NetworkNotGrantedError';
    this.message = `The wallet did not grant an account on ${requestedNetwork} in this session. Granted networks: ${
      grantedNetworks.length > 0 ? grantedNetworks.join(', ') : 'none'
    }. Request it with \`requestPermissions({ networks: [...] })\` first.`;
  }
}

/**
 *  @category Error
 *  Error that indicates a network was passed in a form Taquito cannot turn into a
 *  CAIP-2 chain id
 */
export class UnmappedNetworkError extends ParameterValidationError {
  constructor(public readonly network: string) {
    super();
    this.name = 'UnmappedNetworkError';
    this.message = `Cannot resolve "${network}" to a CAIP-2 chain id. Networks without a statically known genesis block (weeklynet, dailynet, custom, and networks with no public RPC) must be addressed by their CAIP-2 chain id, e.g. 'tezos:NetXdQprcVkpaWU'.`;
  }
}
