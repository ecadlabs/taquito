import { RpcClient } from '@tezos-ts/rpc';
import { Signer } from './signer/interface';
import { NoopSigner } from './signer/noop';

export class Context {
  constructor(
    private _rpcClient: RpcClient = new RpcClient(),
    private _signer: Signer = new NoopSigner()
  ) {}

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

  clone(): Context {
    return new Context(this.rpc, this.signer);
  }
}
