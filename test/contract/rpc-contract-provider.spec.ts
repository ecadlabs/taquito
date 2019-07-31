import { RpcContractProvider } from '../../src/contract/rpc-contract-provider'
import { sample, sampleStorage } from './data'

/**
 * RPCContractProvider test
 */
describe('RpcContractProvider test', () => {
  let rpcContractProvider: RpcContractProvider
  let mockRpcClient: {
    getScript: jest.Mock<any, any>
    getStorage: jest.Mock<any, any>
  }

  beforeEach(() => {
    mockRpcClient = {
      getScript: jest.fn(),
      getStorage: jest.fn()
    }

    rpcContractProvider = new RpcContractProvider(mockRpcClient as any)
  })

  describe('getStorage', () => {
    it('should call getStorage', async done => {
      mockRpcClient.getScript.mockResolvedValue({ code: [sample] })
      mockRpcClient.getStorage.mockResolvedValue(sampleStorage)
      const result = await rpcContractProvider.getStorage('test')
      expect(result).toEqual({
        '0': {},
        '1': undefined,
        '2': 'False',
        '3': '200'
      })
      done()
    })
  })
})
