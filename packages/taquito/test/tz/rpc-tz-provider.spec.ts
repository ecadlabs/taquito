import { RpcTzProvider } from '../../src/tz/rpc-tz-provider';
import BigNumber from 'bignumber.js';
import { Context } from '../../src/context';

describe('RpcTzProvider test', () => {
  it('is instantiable', () => {
    expect(new RpcTzProvider(new Context('url'))).toBeInstanceOf(RpcTzProvider);
  });

  describe('getBalance', () => {
    it('calls get balance from the rpc client', async () => {
      const mockRpcClient = {
        getBalance: jest.fn(),
      };

      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000'));

      const provider = new RpcTzProvider(new Context(mockRpcClient as any));
      const result = await provider.getBalance('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn');
      expect(result).toBeInstanceOf(BigNumber);
      expect(result.toString()).toStrictEqual('10000');
      expect(mockRpcClient.getBalance.mock.calls[0][0]).toEqual(
        'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
      );
    });
  });

  describe('getSpendable', () => {
    it('calls get spendable from the rpc client', async () => {
      const mockRpcClient = {
        getSpendable: jest.fn(),
      };

      mockRpcClient.getSpendable.mockResolvedValue(new BigNumber('10000'));

      const provider = new RpcTzProvider(new Context(mockRpcClient as any));
      const result = await provider.getSpendable('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn');
      expect(result).toBeInstanceOf(BigNumber);
      expect(result.toString()).toStrictEqual('10000');
      expect(mockRpcClient.getSpendable.mock.calls[0][0]).toEqual(
        'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
      );
    });
  });

  describe('getDelegate', () => {
    it('calls get delegate from the rpc client', async () => {
      const mockRpcClient = {
        getDelegate: jest.fn(),
      };

      mockRpcClient.getDelegate.mockResolvedValue('KT1G393LjojNshvMdf68XQD24Hwjn7xarzNe');

      const provider = new RpcTzProvider(new Context(mockRpcClient as any));
      const result = await provider.getDelegate('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn');
      expect(result).toStrictEqual('KT1G393LjojNshvMdf68XQD24Hwjn7xarzNe');
      expect(mockRpcClient.getDelegate.mock.calls[0][0]).toEqual(
        'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
      );
    });
  });

  describe('activate', () => {
    let mockSigner: {
      publicKeyHash: jest.Mock<any, any>;
      publicKey: jest.Mock<any, any>;
      sign: jest.Mock<any, any>;
    };
    it('should produce a activate_account operation', async () => {
      const mockRpcClient = {
        getBlock: jest.fn(),
        getScript: jest.fn(),
        getManagerKey: jest.fn(),
        getStorage: jest.fn(),
        getBlockHeader: jest.fn(),
        getProtocols: jest.fn(),
        getContract: jest.fn(),
        injectOperation: jest.fn(),
        preapplyOperations: jest.fn(),
      };
      const mockForger = {
        forge: jest.fn(),
      };
      // Required for operations confirmation polling
      mockRpcClient.getBlock.mockResolvedValue({
        operations: [[], [], [], []],
        header: {
          level: 0,
        },
      });

      mockSigner = {
        publicKeyHash: jest.fn(),
        publicKey: jest.fn(),
        sign: jest.fn(),
      };

      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({
        hash: 'BLJjnzaPtSsxykZ9pLTFLSfsKuiN3z7SjSPDPWwbE4Q68u5EpBw',
      });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getProtocols.mockResolvedValue({ next_protocol: 'test_proto' });
      mockForger.forge.mockResolvedValue('test');
      mockRpcClient.injectOperation.mockResolvedValue(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'
      );

      const context = new Context(mockRpcClient as any, mockSigner as any);
      context.forger = mockForger;
      const provider = new RpcTzProvider(context);
      const result = await provider.activate('tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m', '123');
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'BLJjnzaPtSsxykZ9pLTFLSfsKuiN3z7SjSPDPWwbE4Q68u5EpBw',
          contents: [
            {
              kind: 'activate_account',
              pkh: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m',
              secret: '123',
            },
          ],
          protocol: 'test_proto',
        },
        opbytes:
          'test00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      });
    });
  });
});
