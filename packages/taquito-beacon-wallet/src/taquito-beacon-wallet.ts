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

export class BeaconWalletNotInitialized implements Error {
  name = 'BeaconWalletNotInitialized';
  message = 'You need to initialize BeaconWallet by calling beaconWallet.requestPermissions first';
}

export class BeaconWallet implements WalletProvider {
  public client: DAppClient;

  private permissions?: PermissionResponse;

  constructor(name: string) {
    this.client = new DAppClient(name);
  }

  private getPermissionOrFail() {
    if (!this.permissions) {
      throw new BeaconWalletNotInitialized();
    }

    return this.permissions;
  }

  async requestPermissions() {
    const result = await this.client.requestPermissions();
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
    const network = this.getPermissionOrFail().permissions.networks;
    const { transactionHashes } = await this.client.requestOperation({
      network: network[0],
      operationDetails: params.map(op => ({
        ...this.removeFeeAndLimit(op),
      })) as any,
    });
    return transactionHashes[0];
  }
}
