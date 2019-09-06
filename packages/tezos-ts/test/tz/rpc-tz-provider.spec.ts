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
});
