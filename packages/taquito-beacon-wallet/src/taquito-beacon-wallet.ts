import { DAppClient } from '@airgap/beacon-sdk/dist/clients/DappClient';
import { PermissionResponse } from '@airgap/beacon-sdk/dist/messages/Messages';
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

export enum PermissionScopeEnum {
  READ_ADDRESS = 'read_address',
  SIGN = 'sign',
  OPERATION_REQUEST = 'operation_request',
  THRESHOLD = 'threshold',
}

export class BeaconWalletNotInitialized implements Error {
  name = 'BeaconWalletNotInitialized';
  message = 'You need to initialize BeaconWallet by calling beaconWallet.requestPermissions first';
}

export class MissingRequiredScopes implements Error {
  name = 'MissingRequiredScopes';
  message: string;

  constructor(public requiredScopes: PermissionScopeEnum[]) {
    this.message = `Required permissions scopes were not granted: ${requiredScopes.join(',')}`;
  }
}

export class BeaconWallet implements WalletProvider {
  private readonly MANDATORY_SCOPES = [PermissionScopeEnum.READ_ADDRESS];
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
    requiredScopes: PermissionScopeEnum[]
  ) {
    const mandatoryScope = new Set(requiredScopes);

    for (const scope of permission.permissions.scopes) {
      if (mandatoryScope.has(scope as PermissionScopeEnum)) {
        mandatoryScope.delete(scope as PermissionScopeEnum);
      }
    }

    if (mandatoryScope.size > 0) {
      throw new MissingRequiredScopes(Array.from(mandatoryScope));
    }
  }

  async requestPermissions() {
    const result = await this.client.requestPermissions();

    this.validateRequiredScopesOrFail(result, this.MANDATORY_SCOPES);

    this.permissions = result;
  }

  private removeFeeAndLimit<T extends { gas_limit: any; storage_limit: any; fee: any }>(op: T) {
    const { fee, gas_limit, storage_limit, ...rest } = op;
    return rest;
  }

  getPKH() {
    const { permissions } = this.getPermissionOrFail();

    return encodeKeyHash(permissions.pubkey);
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
    this.validateRequiredScopesOrFail(permissions, [PermissionScopeEnum.OPERATION_REQUEST]);

    const network = permissions.permissions.networks;
    const { transactionHashes } = await this.client.requestOperation({
      network: network[0],
      operationDetails: params.map(op => ({
        ...this.removeFeeAndLimit(op),
      })) as any,
    });
    return transactionHashes[0];
  }
}
