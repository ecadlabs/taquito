import { TzProvider } from './tz/interface'
import { RpcClient } from './rpc/rpc'
import { ContractProvider } from './contract/interface'
import { RpcTzProvider } from './tz/rpc-tz-provider'
import { RpcContractProvider } from './contract/rpc-contract-provider'

/**
 * @description Facade class that surfaces all of the libraries capability and allow it's configuration
 */
export class TezosToolkit {
  private _rpcClient = new RpcClient()
  private _tz!: TzProvider
  private _contract!: ContractProvider

  constructor() {
    this.setProvider(this._rpcClient)
  }

  setProvider(provider: string | RpcClient) {
    if (typeof provider === 'string') {
      this._rpcClient = new RpcClient(provider)
    } else {
      this._rpcClient = provider
    }
    this._tz = new RpcTzProvider(this._rpcClient)
    this._contract = new RpcContractProvider(this._rpcClient)
  }

  get tz(): TzProvider {
    return this._tz
  }

  get contract(): ContractProvider {
    return this._contract
  }
}

export const Tezos = new TezosToolkit()
