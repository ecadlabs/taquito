import {
  createOriginationOperation,
  createSetDelegateOperation,
  createTransferOperation,
  WalletDelegateParams,
  WalletOriginateParams,
  WalletProvider,
  WalletTransferParams,
} from '@taquito/taquito';

declare var tezbridge: any;

export class TezBridgeNotDetectedError implements Error {
  name: string = 'TezBridgeNotDetectedError';
  message: string = 'tezbridge plugin could not be detected in your browser';
}

export class TezBridgeWallet implements WalletProvider {
  constructor() {
    if (typeof tezbridge === 'undefined') {
      throw new TezBridgeNotDetectedError();
    }
  }

  getPKH() {
    return tezbridge.request({
      method: 'get_source',
    });
  }

  /**
   *
   * @description Allow user to pre-define their host for easy use on custom nodes
   *
   * @param host host's RPC url
   */
<<<<<<< HEAD
  setHost(host: string) {
    return tezbridge.request({
=======
  async setHost(host: string) {
    // returns user's address
    await tezbridge.request({
<<<<<<< HEAD
>>>>>>> e1a67b40... Removed unnecessary return from .setHost()
=======
>>>>>>> e1a67b40... Removed unnecessary return from .setHost()
      method: 'set_host',
      host: host,
    });
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
    const { operation_id } = await tezbridge.request({
      method: 'inject_operations',
      operations: params.map(op => ({
        ...this.removeFeeAndLimit(op),
      })),
    });
    return operation_id;
  }

  private removeFeeAndLimit<T extends { gas_limit: any; storage_limit: any; fee: any }>(op: T) {
    const { fee, gas_limit, storage_limit, ...rest } = op;
    return rest;
  }
}
