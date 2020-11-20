import {
  DAppClient,
  DAppClientOptions,
  RequestPermissionInput,
  PermissionResponseOutput,
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

  private permissions?: PermissionResponseOutput;

  constructor(options: DAppClientOptions) {
    this.client = new DAppClient(options);
  }

  private getPermissionOrFail() {
    if (!this.permissions) {
      throw new BeaconWalletNotInitialized();
    }

    return this.permissions;
  }

  private validateRequiredScopesOrFail(
    permission: PermissionResponseOutput,
    requiredScopes: PermissionScope[]
  ) {
    const mandatoryScope = new Set(requiredScopes);

    for (const scope of permission.scopes) {
      if (mandatoryScope.has(scope)) {
        mandatoryScope.delete(scope);
      }
    }

    if (mandatoryScope.size > 0) {
      throw new MissingRequiredScopes(Array.from(mandatoryScope));
    }
  }

  async requestPermissions(request?: RequestPermissionInput) {
    const activeAccount = await this.client.getActiveAccount();

    if (activeAccount) {
      this.permissions = activeAccount;
      return;
    }

    const result = await this.client.requestPermissions(request);
    this.permissions = result;
  }

  private removeFeeAndLimit<T extends { gas_limit: any; storage_limit: any; fee: any }>(op: T) {
    const { fee, gas_limit, storage_limit, ...rest } = op;
    return rest;
  }

  getPKH() {
    const { address } = this.getPermissionOrFail();
    return Promise.resolve(address);
  }

  mapTransferParamsToWalletParams(params: WalletTransferParams) {
    return createTransferOperation(params);
  }

  mapOriginateParamsToWalletParams(params: WalletOriginateParams) {
    return createOriginationOperation(params as any);
  }

  mapDelegateParamsToWalletParams(params: WalletDelegateParams) {
    return createSetDelegateOperation(params as any);
  }

  async sendOperations(params: any[]) {
    const permissions = this.getPermissionOrFail();
    this.validateRequiredScopesOrFail(permissions, [PermissionScope.OPERATION_REQUEST]);

    const { transactionHash } = await this.client.requestOperation({
      operationDetails: params.map(op => ({
        ...this.removeFeeAndLimit(op),
      })) as any,
    });
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
   * @description Allows to remove an account from the local storage
   * @param accountIdentifier optional identifier of the account to remove from the storage. 
   * If none is specified, the active account (if defined) will be removed from the storage.
   */
  async removeAccount(accountIdentifier?: string) {
    let accountInfo = accountIdentifier 
      ? await this.client.getAccount(accountIdentifier)
      : await this.client.getActiveAccount();

    if (accountInfo) {
      await this.client.removeAccount(accountInfo.accountIdentifier);
    }
  }

  /**
   * 
   * @description Allows to remove all accounts and set active account to undefined
   */
  async removeAllAccounts() {
    await this.client.removeAllAccounts();
  }

  /**
   * 
   * @description Return the active account
   */
  async getActiveAccount() {
    const activeAccount = await this.client.getActiveAccount();
    return activeAccount;
  }

  /**
   * 
   * @description Return all accounts in storage
   */
  async getAccounts() {
    const activeAccount = await this.client.getAccounts();
    return activeAccount;
  }
}
