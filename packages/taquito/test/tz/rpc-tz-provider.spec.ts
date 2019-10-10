import { RpcTzProvider } from '../../src/tz/rpc-tz-provider';
import BigNumber from 'bignumber.js';
import { Context } from '../../src/context';

describe('RpcTzProvider test', () => {
  it('is instantiable', () => {
    expect(new RpcTzProvider(new Context())).toBeInstanceOf(RpcTzProvider);
  });

  describe('getBalance', () => {
    it('calls get balance from the rpc client', async done => {
      const mockRpcClient = {
        getBalance: jest.fn(),
      };

      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000'));

      const provider = new RpcTzProvider(new Context(mockRpcClient as any));
      const result = await provider.getBalance('test-address');
      expect(result).toBeInstanceOf(BigNumber);
      expect(result.toString()).toStrictEqual('10000');
      expect(mockRpcClient.getBalance.mock.calls[0][0]).toEqual('test-address');
      done();
    });
  });

  describe('getDelegate', () => {
    it('calls get delegate from the rpc client', async done => {
      const mockRpcClient = {
        getDelegate: jest.fn(),
      };

      mockRpcClient.getDelegate.mockResolvedValue('KT1G393LjojNshvMdf68XQD24Hwjn7xarzNe');

      const provider = new RpcTzProvider(new Context(mockRpcClient as any));
      const result = await provider.getDelegate('test-address');
      expect(result).toStrictEqual('KT1G393LjojNshvMdf68XQD24Hwjn7xarzNe');
      expect(mockRpcClient.getDelegate.mock.calls[0][0]).toEqual('test-address');
      done();
    });
  });

  describe('activate', () => {
    it('should produce a activate_account operation', async done => {
      const mockRpcClient = {
        getBlock: jest.fn(),
        getScript: jest.fn(),
        getManagerKey: jest.fn(),
        getStorage: jest.fn(),
        getBigMapKey: jest.fn(),
        getBlockHeader: jest.fn(),
        getBlockMetadata: jest.fn(),
        getContract: jest.fn(),
        forgeOperations: jest.fn(),
        injectOperation: jest.fn(),
        preapplyOperations: jest.fn(),
      };
      // Required for operations confirmation polling
      mockRpcClient.getBlock.mockResolvedValue({
        operations: [[], [], [], []],
        header: {
          level: 0,
        },
      });

      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockRpcClient.forgeOperations.mockResolvedValue('test');
      const provider = new RpcTzProvider(new Context(mockRpcClient as any));
      const result = await provider.activate('test', '123');
      expect(result.raw).toEqual({
        counter: NaN,
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'activate_account',
              pkh: 'test',
              secret: '123',
            },
          ],
          protocol: 'test_proto',
        },
        opbytes:
          'test00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      });
      done();
    });
  });
});
