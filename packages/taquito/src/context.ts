import { RpcClient } from '@taquito/rpc';
import { Signer } from './signer/interface';
import { NoopSigner } from './signer/noop';
import { Protocols } from './constants';

export interface Config {
  confirmationPollingIntervalSecond?: number;
  confirmationPollingTimeoutSecond?: number;
  defaultConfirmationCount?: number;
}

export const defaultConfig: Required<Config> = {
  confirmationPollingIntervalSecond: 10,
  defaultConfirmationCount: 0,
  confirmationPollingTimeoutSecond: 180,
};

/**
 * @description Encapsulate common service used throughout different part of the library
 */
export class Context {
  constructor(
    private _rpcClient: RpcClient = new RpcClient(),
    private _signer: Signer = new NoopSigner(),
    private _proto?: Protocols,
    private _config?: Partial<Config>
  ) {
    this.config = _config as any;
  }

  get config(): Required<Config> {
    return this._config as any;
  }

  set config(value: Required<Config>) {
    this._config = {
      ...defaultConfig,
      ...value,
    };
  }

  get rpc(): RpcClient {
    return this._rpcClient;
  }

  set rpc(value: RpcClient) {
    this._rpcClient = value;
  }

  get signer() {
    return this._signer;
  }

  set signer(value: Signer) {
    this._signer = value;
  }

  set proto(value: Protocols | undefined) {
    this._proto = value;
  }

  get proto() {
    return this._proto;
  }

  async isAnyProtocolActive(protocol: string[] = []) {
    if (this._proto) {
      return protocol.includes(this._proto);
    } else {
      const { next_protocol } = await this.rpc.getBlockMetadata();
      return protocol.includes(next_protocol);
    }
  }

  /**
   * @description Create a copy of the current context. Useful when you have long running operation and you do not want a context change to affect the operation
   */
  clone(): Context {
    return new Context(this.rpc, this.signer);
  }
}
