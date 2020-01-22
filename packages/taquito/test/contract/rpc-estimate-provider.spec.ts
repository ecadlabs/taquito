import { Context } from '../../src/context';
import { RPCEstimateProvider } from '../../src/contract/rpc-estimate-provider';
import { miStr, ligoSample } from './data';
import BigNumber from 'bignumber.js';
import {
  preapplyResultFrom,
  multipleInternalOrigination,
  multipleInternalTransfer,
  internalTransfer,
  delegate,
  origination,
  transferWithoutAllocation,
  transferWithAllocation,
} from './helper';

/**
 * RPCEstimateProvider test
 */
describe('RPCEstimateProvider test', () => {
  let estimateProvider: RPCEstimateProvider;
  let mockRpcClient: {
    getScript: jest.Mock<any, any>;
    getBalance: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
    getBigMapKey: jest.Mock<any, any>;
    getBlockHeader: jest.Mock<any, any>;
    getManagerKey: jest.Mock<any, any>;
    getBlock: jest.Mock<any, any>;
    getContract: jest.Mock<any, any>;
    getBlockMetadata: jest.Mock<any, any>;
    forgeOperations: jest.Mock<any, any>;
    runOperation: jest.Mock<any, any>;
    injectOperation: jest.Mock<any, any>;
    preapplyOperations: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
    getConstants: jest.Mock<any, any>;
  };

  let mockSigner: {
    publicKeyHash: jest.Mock<any, any>;
    publicKey: jest.Mock<any, any>;
    sign: jest.Mock<any, any>;
  };

  beforeEach(() => {
    mockRpcClient = {
      runOperation: jest.fn(),
      getBalance: jest.fn(),
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
      getChainId: jest.fn(),
      getConstants: jest.fn(),
    };

    mockSigner = {
      publicKeyHash: jest.fn(),
      publicKey: jest.fn(),
      sign: jest.fn(),
    };

    // Required for operations confirmation polling
    mockRpcClient.getBlock.mockResolvedValue({
      operations: [[], [], [], []],
      header: {
        level: 0,
      },
    });

    mockRpcClient.getBalance.mockResolvedValue(new BigNumber(20000000));
    mockRpcClient.getManagerKey.mockResolvedValue('test');
    mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
    mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
    mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
    mockRpcClient.forgeOperations.mockResolvedValue('1234');
    mockRpcClient.preapplyOperations.mockResolvedValue([]);
    mockRpcClient.getChainId.mockResolvedValue('chain-id');
    mockRpcClient.getConstants.mockResolvedValue({
      hard_gas_limit_per_operation: new BigNumber(80000),
      hard_storage_limit_per_operation: new BigNumber(60000),
      cost_per_byte: new BigNumber(1000),
    });

    mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
    mockSigner.publicKey.mockResolvedValue('test_pub_key');
    mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
    estimateProvider = new RPCEstimateProvider(
      new Context(mockRpcClient as any, mockSigner as any)
    );
  });

  describe('originate', () => {
    it('should produce a reveal and origination operation', async done => {
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          {
            kind: 'origination',
            metadata: {
              operation_result: {
                consumed_gas: 1000,
              },
            },
          },
        ],
      });
      const estimate = await estimateProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miStr,
        init: '{}',
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
      });
      expect(estimate.gasLimit).toEqual(1100);
      done();
    });
  });

  describe('transfer', () => {
    test('return the correct estimate for multiple internal origination', async done => {
      mockRpcClient.runOperation.mockResolvedValue(multipleInternalOrigination());
      // Simulate real op size
      mockRpcClient.forgeOperations.mockResolvedValue(new Array(297).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 40928,
        storageLimit: 634,
        suggestedFeeMutez: 4590,
      });
      done();
    });

    test('return the correct estimate for 2 internal transfer that need allocation', async done => {
      mockRpcClient.runOperation.mockResolvedValue(multipleInternalTransfer());
      // Simulate real op size
      mockRpcClient.forgeOperations.mockResolvedValue(new Array(285).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 36875,
        storageLimit: 514,
        suggestedFeeMutez: 4173,
      });
      done();
    });

    test('return the correct estimate for delegation', async done => {
      mockRpcClient.runOperation.mockResolvedValue(delegate());
      // Simulate real op size
      mockRpcClient.forgeOperations.mockResolvedValue(new Array(149).fill('aa').join(''));
      const estimate = await estimateProvider.setDelegate({
        source: 'test',
        delegate: 'test',
      });
      expect(estimate).toMatchObject({
        gasLimit: 10100,
        storageLimit: 0,
        suggestedFeeMutez: 1359,
      });
      done();
    });

    test('return the correct estimate for origination', async done => {
      mockRpcClient.runOperation.mockResolvedValue(origination());
      // Simulate real op size
      mockRpcClient.forgeOperations.mockResolvedValue(new Array(445).fill('aa').join(''));
      const estimate = await estimateProvider.originate({
        code: ligoSample,
        storage: 0,
      });
      expect(estimate).toMatchObject({
        gasLimit: 17932,
        storageLimit: 571,
        suggestedFeeMutez: 2439,
      });
      done();
    });

    test('return the correct estimate for internal transfer without allocation', async done => {
      mockRpcClient.runOperation.mockResolvedValue(internalTransfer());
      // Simulate real op size
      mockRpcClient.forgeOperations.mockResolvedValue(new Array(226).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 26260,
        storageLimit: 0,
        suggestedFeeMutez: 3052,
      });
      done();
    });

    test('return the correct estimate for transfer without allocation', async done => {
      mockRpcClient.runOperation.mockResolvedValue(transferWithoutAllocation());
      // Simulate real op size
      mockRpcClient.forgeOperations.mockResolvedValue(new Array(153).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 10307,
        storageLimit: 0,
        suggestedFeeMutez: 1384,
      });
      done();
    });

    test('return the correct estimate for transfer with allocation', async done => {
      mockRpcClient.runOperation.mockResolvedValue(transferWithAllocation());
      // Simulate real op size
      mockRpcClient.forgeOperations.mockResolvedValue(new Array(153).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 10307,
        storageLimit: 257,
        suggestedFeeMutez: 1384,
      });
      done();
    });

    it('should produce a reveal and transaction operation', async done => {
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          {
            kind: 'transaction',
            metadata: {
              operation_result: {
                consumed_gas: 1000,
              },
            },
          },
        ],
      });
      const estimate = await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });
      expect(estimate.gasLimit).toEqual(1100);
      done();
    });

    it('should use the maximum storage an account can afford', async done => {
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          {
            kind: 'transaction',
            metadata: {
              operation_result: {
                consumed_gas: 1000,
              },
            },
          },
        ],
      });
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('1100'));
      await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                fee: '0',
                storage_limit: '1',
                gas_limit: '80000',
              }),
            ]),
          }),
        })
      );
      done();
    });

    it('should use the maximum storage the protocol allow if user can afford it', async done => {
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          {
            kind: 'transaction',
            metadata: {
              operation_result: {
                consumed_gas: 1000,
              },
            },
          },
        ],
      });
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('800000000'));
      await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                fee: '0',
                storage_limit: '60000',
                gas_limit: '80000',
              }),
            ]),
          }),
        })
      );
      done();
    });

    it('should return parsed error from RPC result', async done => {
      const params = {
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.runOperation.mockResolvedValue(preapplyResultFrom(params).withError()[0]);
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      await expect(estimateProvider.transfer(params)).rejects.toMatchObject({
        id: 'proto.006-PsCARTHA.michelson_v1.script_rejected',
        message: 'test',
      });
      done();
    });

    it('should return parsed error from RPC result', async done => {
      const params = {
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.runOperation.mockResolvedValue(
        preapplyResultFrom(params).withBalanceTooLowError()[0]
      );
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      await expect(estimateProvider.transfer(params)).rejects.toMatchObject({
        id: 'proto.006-PsCARTHA.contract.balance_too_low',
        message: '(temporary) proto.006-PsCARTHA.contract.balance_too_low',
      });
      done();
    });

    it('should return internal error when received from preapply', async done => {
      const params = {
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.runOperation.mockResolvedValue(
        preapplyResultFrom(params).withInternalError()[0]
      );
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      await expect(estimateProvider.transfer(params)).rejects.toMatchObject({
        id: 'proto.005-PsBabyM1.gas_exhausted.operation',
        message: '(temporary) proto.005-PsBabyM1.gas_exhausted.operation',
      });
      done();
    });
  });
});
