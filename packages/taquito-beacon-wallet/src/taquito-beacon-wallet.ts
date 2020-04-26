import {
  DAppClient,
  RequestPermissionInput,
  PermissionResponse,
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
import { encodeKeyHash } from '@taquito/utils';

export type BeaconWalletOptions = { name: string };

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
  private readonly MANDATORY_SCOPES = [PermissionScope.READ_ADDRESS];
  public client: DAppClient;

  private permissions?: PermissionResponse;

  constructor({ name }: BeaconWalletOptions) {
    this.client = new DAppClient(name);
  }

  private getPermissionOrFail() {
    if (!this.permissions) {
      throw new BeaconWalletNotInitialized();
    }

    return this.permissions;
  }

  private validateRequiredScopesOrFail(
    permission: PermissionResponse,
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
    const result = await this.client.requestPermissions(request);

    this.validateRequiredScopesOrFail(result, this.MANDATORY_SCOPES);

    this.permissions = result;
  }

  private removeFeeAndLimit<T extends { gas_limit: any; storage_limit: any; fee: any }>(op: T) {
    const { fee, gas_limit, storage_limit, ...rest } = op;
    return rest;
  }

  getPKH() {
    const { pubkey } = this.getPermissionOrFail();

    if (pubkey) {
      return encodeKeyHash(pubkey);
    }
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
