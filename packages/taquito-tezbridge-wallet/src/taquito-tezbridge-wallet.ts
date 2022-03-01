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

// eslint-disable-next-line no-var
declare var tezbridge: any;

export class TezBridgeNotDetectedError extends Error {
  name = 'TezBridgeNotDetectedError';
  constructor() {
    super('tezbridge plugin could not be detected in your browser');
  }
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

  async mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>) {
    return createTransferOperation(await params());
  }

  async mapOriginateParamsToWalletParams(params: () => Promise<WalletOriginateParams>) {
    return createOriginationOperation((await params()) as any);
  }

  async mapDelegateParamsToWalletParams(params: () => Promise<WalletDelegateParams>) {
    return createSetDelegateOperation((await params()) as any);
  }

  async sendOperations(params: any[]) {
    const { operation_id } = await tezbridge.request({
      method: 'inject_operations',
      operations: params.map((op) => ({
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
