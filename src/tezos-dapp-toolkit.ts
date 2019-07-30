import { TzProvider } from './tz/interface'
import { RpcProvider } from './tz/rpc/rpc'

/**
 * @description Facade class that surfaces all of the libraries capability and allow it's configuration
 */
export class TezosToolkit {
  constructor(private _tz: TzProvider = new RpcProvider()) {}

  setProvider(provider: string | TzProvider) {
    if (typeof provider === 'string') {
      this._tz = new RpcProvider(provider)
    } else {
      this._tz = provider
    }
  }

  get tz(): TzProvider {
    return this._tz
  }
}

export const Tezos = new TezosToolkit()
