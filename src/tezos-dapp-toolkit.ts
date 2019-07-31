import { TzProvider } from './tz/interface'
import { RpcClient } from './rpc/rpc'
import { ContractProvider } from './contract/interface'
import { RpcTzProvider } from './tz/rpc-tz-provider'

/**
 * @description Facade class that surfaces all of the libraries capability and allow it's configuration
 */
export class TezosToolkit {
  private _rpcClient = new RpcClient()
  private _tz: TzProvider = new RpcTzProvider(this._rpcClient)

  setProvider(provider: string | TzProvider) {
    if (typeof provider === 'string') {
      this._tz = new RpcTzProvider(new RpcClient(provider))
    } else {
      this._tz = provider
    }
  }

  get tz(): TzProvider {
    return this._tz
  }
}

export const Tezos = new TezosToolkit()
