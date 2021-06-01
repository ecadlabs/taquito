/**
 * @packageDocumentation
 * @module @taquito/beacon-wallet
 */

import {
  DAppClient,
  DAppClientOptions,
  RequestPermissionInput,
  PermissionScope,
} from '@airgap/beacon-sdk';

import {
  createOriginationOperation,
  createSetDelegateOperation,
  createTransferOperation,
  WalletDelegateParams,
  WalletOriginateParams,
  WalletProvider,
  WalletTransferParams,
} from '@taquito/taquito';

export { VERSION } from './version';

export class BeaconWalletNotInitialized implements Error {
  name = 'BeaconWalletNotInitialized';
  message = 'You need to initialize BeaconWallet by calling beaconWallet.requestPermissions first';
}

export class MissingRequiredScopes implements Error {
  name = 'MissingRequiredScopes';
  message: string;

  constructor(public requiredScopes: PermissionScope[]) {
    this.message = `Required permissions scopes were not granted: ${requiredScopes.join(',')}`;
  }
}

export class BeaconWallet implements WalletProvider {
  public client: DAppClient;

  constructor(options: DAppClientOptions) {
    this.client = new DAppClient(options);
  }

  private validateRequiredScopesOrFail(
    permissionScopes: PermissionScope[],
    requiredScopes: PermissionScope[]
  ) {
    const mandatoryScope = new Set(requiredScopes);

    for (const scope of permissionScopes) {
      if (mandatoryScope.has(scope)) {
        mandatoryScope.delete(scope);
      }
    }

    if (mandatoryScope.size > 0) {
      throw new MissingRequiredScopes(Array.from(mandatoryScope));
    }
  }

  async requestPermissions(request?: RequestPermissionInput) {
    await this.client.requestPermissions(request);
  }

  async getPKH() {
    const account = await this.client.getActiveAccount();
    if (!account) {
      throw new BeaconWalletNotInitialized();
    }
    return account.address;
  }

  async mapTransferParamsToWalletParams(params: WalletTransferParams) {
    return this.removeDefaultParams(params, await createTransferOperation(params));
  }

  async mapOriginateParamsToWalletParams(params: WalletOriginateParams) {
      return this.removeDefaultParams(params, await createOriginationOperation(params as any));
  }

  async mapDelegateParamsToWalletParams(params: WalletDelegateParams) {
    return this.removeDefaultParams(params, await createSetDelegateOperation(params as any));
  }

  removeDefaultParams(params: WalletTransferParams|WalletOriginateParams|WalletDelegateParams, operatedParams:any) {
    // If fee, storageLimit or gasLimit is undefined by user
    // in case of beacon wallet, dont override it by
    // defaults.
    if(!params.fee) {
      delete operatedParams.fee;
    }
    if(!params.storageLimit) {
      delete operatedParams.storage_limit;
    }
    if(!params.gasLimit) {
      delete operatedParams.gas_limit;
    }
    return operatedParams;
  }

  async sendOperations(params: any[]) {
    const account = await this.client.getActiveAccount();
    if (!account) {
      throw new BeaconWalletNotInitialized();
    }
    const permissions = account.scopes;
    this.validateRequiredScopesOrFail(permissions, [PermissionScope.OPERATION_REQUEST]);
    
    const { transactionHash } = await this.client.requestOperation({ operationDetails: params });
    return transactionHash;
  }
 
  /**
   * 
   * @description Removes all beacon values from the storage. After using this method, this instance is no longer usable. 
   * You will have to instanciate a new BeaconWallet.
   */
  async disconnect() {
    await this.client.destroy();
  }

  /**
   * 
   * @description This method removes the active account from local storage by setting it to undefined.
   */
  async clearActiveAccount() {
    await this.client.setActiveAccount();
  }
}
