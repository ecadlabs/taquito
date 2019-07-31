import { TezosToolkit } from '../src/tezos-dapp-toolkit'
import { RpcTzProvider } from '../src/tz/rpc-tz-provider'
import { RpcContractProvider } from '../src/contract/rpc-contract-provider'

describe('TezosToolkit test', () => {
  it('is instantiable', () => {
    expect(new TezosToolkit()).toBeInstanceOf(TezosToolkit)
  })

  it('setProvider should change provider', () => {
    const toolkit = new TezosToolkit()

    const oldTz = toolkit.tz
    const oldContract = toolkit.contract
    toolkit.setProvider({} as any)
    expect(toolkit.tz).not.toBe(oldTz)
    expect(toolkit.contract).not.toBe(oldContract)
  })

  it('setProvider with string should create rpc provider', () => {
    const toolkit = new TezosToolkit()

    toolkit.setProvider('test')
    expect(toolkit.tz).toBeInstanceOf(RpcTzProvider)
    expect(toolkit.contract).toBeInstanceOf(RpcContractProvider)
  })
})
