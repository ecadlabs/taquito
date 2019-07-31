import { RpcClient } from '../../src/rpc/rpc'

/**
 * RpcClient test
 */
describe('RpcClient test', () => {
  let client: RpcClient
  let httpBackend: {
    createRequest: jest.Mock<any, any>
  }

  beforeEach(() => {
    httpBackend = {
      createRequest: jest.fn()
    }
    client = new RpcClient('root', 'test', httpBackend as any)
  })

  it('RpcClient is instantiable', () => {
    expect(new RpcClient()).toBeInstanceOf(RpcClient)
  })

  describe('getBalance', () => {
    it('query the right url and returns a string', async done => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'))
      const balance = await client.getBalance('address')

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/balance'
      })
      expect(balance).toStrictEqual('10000')

      done()
    })
  })

  describe('getStorage', () => {
    it('query the right url', async done => {
      await client.getStorage('address')

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/storage'
      })

      done()
    })
  })

  describe('getScript', () => {
    it('query the right url', async done => {
      await client.getScript('address')

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/script'
      })

      done()
    })
  })

  describe('getContract', () => {
    it('query the right url', async done => {
      await client.getContract('address')

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address'
      })

      done()
    })
  })

  describe('getBigMapKey', () => {
    it('query the right url', async done => {
      await client.getBigMapKey('address', { key: 'test', type: 'string' })

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/context/contracts/address/big_map_get'
      })

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({ key: 'test', type: 'string' })

      done()
    })
  })
})
