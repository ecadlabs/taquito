/**
 * @packageDocumentation
 * @module @taquito/beacon-wallet
 */

import {
  DAppClient,
  DAppClientOptions,
  RequestPermissionInput,
  PermissionScope,
  getDAppClientInstance,
} from '@airgap/beacon-dapp';

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

/**
 *  @category Error
 *  @description Error that indicates the Beacon wallet not being initialized
 */
export class BeaconWalletNotInitialized extends Error {
  name = 'BeaconWalletNotInitialized';

  constructor() {
    super('You need to initialize BeaconWallet by calling beaconWallet.requestPermissions first');
  }
}

/**
 *  @category Error
 *  @description Error that indicates missing required persmission scopes
 */
export class MissingRequiredScopes extends Error {
  name = 'MissingRequiredScopes';

  constructor(public requiredScopes: PermissionScope[]) {
    super(`Required permissions scopes were not granted: ${requiredScopes.join(',')}`);
  }
}

export class BeaconWallet implements WalletProvider {
  public client: DAppClient;

  constructor(options: DAppClientOptions) {
    this.client = getDAppClientInstance(options);
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

  async mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>) {
    let walletParams: WalletTransferParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI();
      throw err;
    }
    return this.removeDefaultParams(
      walletParams,
      await createTransferOperation(this.formatParameters(walletParams))
    );
  }

  async mapOriginateParamsToWalletParams(params: () => Promise<WalletOriginateParams>) {
    let walletParams: WalletOriginateParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI();
      throw err;
    }
    return this.removeDefaultParams(
      walletParams,
      await createOriginationOperation(this.formatParameters(walletParams))
    );
  }

  async mapDelegateParamsToWalletParams(params: () => Promise<WalletDelegateParams>) {
    let walletParams: WalletDelegateParams;
    await this.client.showPrepare();
    try {
      walletParams = await params();
    } catch (err) {
      await this.client.hideUI();
      throw err;
    }
    return this.removeDefaultParams(
      walletParams,
      await createSetDelegateOperation(this.formatParameters(walletParams))
    );
  }

  formatParameters(params: any) {
    if (params.fee) {
      params.fee = params.fee.toString();
    }
    if (params.storageLimit) {
      params.storageLimit = params.storageLimit.toString();
    }
    if (params.gasLimit) {
      params.gasLimit = params.gasLimit.toString();
    }
    return params;
  }

  removeDefaultParams(
    params: WalletTransferParams | WalletOriginateParams | WalletDelegateParams,
    operatedParams: any
  ) {
    // If fee, storageLimit or gasLimit is undefined by user
    // in case of beacon wallet, dont override it by
    // defaults.
    if (!params.fee) {
      delete operatedParams.fee;
    }
    if (!params.storageLimit) {
      delete operatedParams.storage_limit;
    }
    if (!params.gasLimit) {
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
   * You will have to instantiate a new BeaconWallet.
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
