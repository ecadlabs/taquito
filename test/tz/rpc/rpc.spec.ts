import { RpcProvider } from '../../../src/tz/rpc/rpc'

/**
 * RpcProvider test
 */
describe('RpcProvider test', () => {
  it('RpcProvider is instantiable', () => {
    expect(new RpcProvider()).toBeInstanceOf(RpcProvider)
  })

  it('RpcProvider getBalance query the right url and returns a number', async done => {
    const httpBackend = {
      createRequest: jest.fn()
    }
    httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'))

    const rpcProvider = new RpcProvider('root', 'test', httpBackend)

    const balance = await rpcProvider.getBalance('address')

    expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
      method: 'GET',
      url: 'root/chains/test/blocks/head/context/contracts/address/balance'
    })
    expect(balance).toStrictEqual(10000)

    done()
  })
})
