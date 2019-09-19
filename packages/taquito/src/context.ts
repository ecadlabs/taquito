import { RpcClient } from '@taquito/rpc';
import { Signer } from './signer/interface';
import { NoopSigner } from './signer/noop';

/**
 * @description Encapsulate common service used throughout different part of the library
 */
export class Context {
  constructor(
    private _rpcClient: RpcClient = new RpcClient(),
    private _signer: Signer = new NoopSigner()
  ) { }

  get rpc() {
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

  /**
   * @description Create a copy of the current context. Useful when you have long running operation and you do not want a context change to affect the operation
   */
  clone(): Context {
    return new Context(this.rpc, this.signer);
  }
}
