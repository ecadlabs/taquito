/**
 * @packageDocumentation
 * @module @taquito/tezbridge-wallet
 */
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

export { VERSION } from './version';

export class TezBridgeWallet implements WalletProvider {
  constructor() {
    if (typeof tezbridge === 'undefined') {
      throw new TezBridgeNotDetectedError();
    }
  }

  async getPKH() {
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
  async setHost(host: string) {
    await tezbridge.request({
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
        op,
      })),
    });
    return operation_id;
  }
}
