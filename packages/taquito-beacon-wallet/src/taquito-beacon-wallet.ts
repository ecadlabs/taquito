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

    const network = permissions.network;
    const { transactionHash } = await this.client.requestOperation({
      network,
      operationDetails: params.map(op => ({
        ...this.removeFeeAndLimit(op),
      })) as any,
    });
    return transactionHash;
  }
}
