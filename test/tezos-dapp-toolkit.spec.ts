import { TezosToolkit } from '../../src/tezos-dapp-toolkit'
import { RpcProvider } from '../../src/tz/rpc/rpc'

describe('TezosToolkit test', () => {
  it('is instantiable', () => {
    expect(new TezosToolkit()).toBeInstanceOf(TezosToolkit)
  })

  it('setProvider should change provider', () => {
    const toolkit = new TezosToolkit()

    const old = toolkit.tz
    toolkit.setProvider({} as any)
    expect(toolkit.tz).not.toBe(old)
  })

  it('setProvider with string should create rpc provider', () => {
    const toolkit = new TezosToolkit()

    toolkit.setProvider('test')
    expect(toolkit.tz).toBeInstanceOf(RpcProvider)
  })
})
