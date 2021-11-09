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
  multipleInternalOriginationNoReveal,
  registerGlobalConstantNoReveal,
  registerGlobalConstantWithReveal,
  registerGlobalConstantWithError,
} from './helper';
import { OpKind } from '@taquito/rpc';

/**
 * RPCEstimateProvider test
 */
describe('RPCEstimateProvider test', () => {
  let estimateProvider: RPCEstimateProvider;
  let mockRpcClient: {
    getScript: jest.Mock<any, any>;
    getBalance: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
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
      hard_gas_limit_per_operation: new BigNumber(1040000),
      hard_storage_limit_per_operation: new BigNumber(60000),
      hard_gas_limit_per_block: new BigNumber(5200000),
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
    it('should produce a reveal and origination operation', async (done) => {
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
    test('return the correct estimate for multiple internal origination', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
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

    test('return the correct estimate for multiple internal origination, no reveal', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(multipleInternalOriginationNoReveal());
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

    test('return the correct estimate for 2 internal transfer that need allocation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
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

    test('return the correct estimate for delegation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
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

    test('return the correct estimate for origination', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
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

    test('return the correct estimate for internal transfer without allocation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
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

    test('return the correct estimate for transfer without allocation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
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

    test('return the correct estimate for transfer with allocation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
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

    const mockRpcClientRunOperation = () => {
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
    };

    it('should produce a reveal and transaction operation', async (done) => {
      mockRpcClientRunOperation();
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

    it('should use the maximum storage an account can afford', async (done) => {
      mockRpcClientRunOperation();
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('1100'));
      await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
      });
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                fee: '0',
                storage_limit: '1',
                gas_limit: '1040000',
              }),
            ]),
          }),
        })
      );
      done();
    });

    it('should use the maximum storage the protocol allow if user can afford it', async (done) => {
      mockRpcClientRunOperation();
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('800000000'));
      await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
      });
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                fee: '0',
                storage_limit: '60000',
                gas_limit: '1040000',
              }),
            ]),
          }),
        })
      );
      done();
    });

    it('should use the storage limit the user specified', async (done) => {
      mockRpcClientRunOperation();
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('1100'));
      await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
        storageLimit: 200,
      });
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                fee: '0',
                storage_limit: '200',
                gas_limit: '1040000',
              }),
            ]),
          }),
        })
      );
      done();
    });

    it('should use the gas limit the user specified', async (done) => {
      mockRpcClientRunOperation();
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
        gasLimit: 200,
      });
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                fee: '0',
                storage_limit: '60000',
                gas_limit: '200',
              }),
            ]),
          }),
        })
      );
      done();
    });

    it('should use the fees the user specified', async (done) => {
      mockRpcClientRunOperation();
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.transfer({
        to: 'test_to',
        amount: 2,
        fee: 10000,
      });
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                fee: '10000',
                storage_limit: '60000',
                gas_limit: '1040000',
              }),
            ]),
          }),
        })
      );
      done();
    });

    it('should return parsed error from RPC result', async (done) => {
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

    it('should return parsed error from RPC result', async (done) => {
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

    it('should return internal error when received from preapply', async (done) => {
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

  describe('batch', () => {
    it('should produce a batch operation, no reveal', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          {
            kind: 'transaction',
            source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
            fee: '0',
            counter: '294313',
            gas_limit: '800000',
            storage_limit: '2000',
            amount: '1700000',
            destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
            metadata: {
              operation_result: {
                consumed_gas: 1000,
              },
            },
          },
          {
            kind: 'transaction',
            source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
            fee: '0',
            counter: '294313',
            gas_limit: '800000',
            storage_limit: '2000',
            amount: '1700000',
            destination: 'tz3hRZUScFCcEVhdDjXWoyekbgd1Gatga6mp',
            metadata: {
              operation_result: {
                consumed_gas: 1000,
              },
            },
          },
          registerGlobalConstantNoReveal.contents[0],
        ],
      });
      const estimate = await estimateProvider.batch([
        { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
        { kind: OpKind.TRANSACTION, to: 'tz3hRZUScFCcEVhdDjXWoyekbgd1Gatga6mp', amount: 2 },
        {
          kind: OpKind.REGISTER_GLOBAL_CONSTANT, value: {
            prim: 'Pair',
            args: [{ int: '998' }, { int: '999' }]
          }
        },
      ]);
      expect(estimate.length).toEqual(3);
      expect(estimate[0].gasLimit).toEqual(1100);
      expect(estimate[1].gasLimit).toEqual(1100);
      expect(estimate[2].gasLimit).toEqual(1330);
      done();
    });

    it('should produce a batch operation, with reveal', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.forgeOperations.mockResolvedValue(new Array(224).fill('aa').join(''));
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          {
            kind: 'reveal',
            source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
            fee: '1420',
            counter: '294312',
            gas_limit: '10600',
            storage_limit: '0',
            public_key: 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
            metadata: {
              operation_result: { status: 'applied', consumed_gas: '1000' },
            },
          },
          registerGlobalConstantNoReveal.contents[0],
          {
            kind: 'transaction',
            source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
            fee: '0',
            counter: '294313',
            gas_limit: '800000',
            storage_limit: '2000',
            amount: '1700000',
            destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
            metadata: {
              operation_result: {
                consumed_gas: 1000,
              },
            },
          },
          {
            kind: 'transaction',
            source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
            fee: '0',
            counter: '294313',
            gas_limit: '800000',
            storage_limit: '2000',
            amount: '1700000',
            destination: 'tz3hRZUScFCcEVhdDjXWoyekbgd1Gatga6mp',
            metadata: {
              operation_result: {
                consumed_gas: 1000,
              },
            },
          },
        ],
      });
      const estimate = await estimateProvider.batch([
        {
          kind: OpKind.REGISTER_GLOBAL_CONSTANT, value: {
            prim: 'Pair',
            args: [{ int: '998' }, { int: '999' }]
          }
        },
        { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
        { kind: OpKind.TRANSACTION, to: 'tz3hRZUScFCcEVhdDjXWoyekbgd1Gatga6mp', amount: 2 },
      ]);
      expect(estimate.length).toEqual(4);

      expect(estimate[0]).toMatchObject({
        gasLimit: 1100,
        storageLimit: 0,
        suggestedFeeMutez: 374,
      });
      expect(estimate[1]).toMatchObject({
        gasLimit: 1330,
        storageLimit: 73,
        suggestedFeeMutez: 408,
      });
      expect(estimate[2].suggestedFeeMutez).toEqual(385)
      expect(estimate[3].suggestedFeeMutez).toEqual(385)
      expect(estimate[2]).toMatchObject({
        gasLimit: 1100,
        storageLimit: 0,
        suggestedFeeMutez: 385,
      });
      expect(estimate[3]).toMatchObject({
        gasLimit: 1100,
        storageLimit: 0,
        suggestedFeeMutez: 385,
      });

      done();
    });

    it('runOperation should be called with a gas_limit equal to the hard_gas_limit_per_operation constant', async (done) => {
      const transactionResult = {
        kind: 'transaction',
        metadata: {
          operation_result: {
            consumed_gas: 1000,
          },
        },
      };
      mockRpcClient.forgeOperations.mockResolvedValue(new Array(149).fill('aa').join(''));
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [transactionResult, transactionResult, transactionResult, transactionResult],
      });
      await estimateProvider.batch([
        { kind: OpKind.TRANSACTION, to: 'test', amount: 2 },
        { kind: OpKind.TRANSACTION, to: 'test', amount: 2 },
        { kind: OpKind.TRANSACTION, to: 'test', amount: 2 },
        { kind: OpKind.TRANSACTION, to: 'test', amount: 2 },
      ]);
      // using the hard_gas_limit_per_operation which is 1040000,
      // the total gas_limit of the batch (4*1040000=4160000) is lower than the hard_gas_limit_per_block (5200000)
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                gas_limit: '1040000',
              }),
              expect.objectContaining({
                gas_limit: '1040000',
              }),
              expect.objectContaining({
                gas_limit: '1040000',
              }),
              expect.objectContaining({
                gas_limit: '1040000',
              }),
            ]),
          }),
        })
      );

      done();
    });

    it('runOperation should be called with a gas_limit calculated with the hard_gas_limit_per_block constant and the number of operation in the batch', async (done) => {
      const transactionResult = {
        kind: 'transaction',
        metadata: {
          operation_result: {
            consumed_gas: 1000,
          },
        },
      };
      mockRpcClient.forgeOperations.mockResolvedValue(new Array(149).fill('aa').join(''));
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          transactionResult,
          transactionResult,
          transactionResult,
          transactionResult,
          transactionResult,
          transactionResult,
        ],
      });
      await estimateProvider.batch([
        { kind: OpKind.TRANSACTION, to: 'test', amount: 2 },
        { kind: OpKind.TRANSACTION, to: 'test', amount: 2 },
        { kind: OpKind.TRANSACTION, to: 'test', amount: 2 },
        { kind: OpKind.TRANSACTION, to: 'test', amount: 2 },
        { kind: OpKind.TRANSACTION, to: 'test', amount: 2 },
        { kind: OpKind.TRANSACTION, to: 'test', amount: 2 },
      ]);

      // the gas_limit need to be calculated, can not be set to the hard_gas_limit_per_operation which is 1040000,
      // otherwise the total gas_limit of the batch is higher (6*1040000=6240000) than hard_gas_limit_per_block (5200000)
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                gas_limit: '742857',
              }),
              expect.objectContaining({
                gas_limit: '742857',
              }),
              expect.objectContaining({
                gas_limit: '742857',
              }),
              expect.objectContaining({
                gas_limit: '742857',
              }),
              expect.objectContaining({
                gas_limit: '742857',
              }),
              expect.objectContaining({
                gas_limit: '742857',
              }),
            ]),
          }),
        })
      );
      done();
    });
  });

  describe('registerGlobalConstant', () => {
    it('should return the correct estimate for registerGlobalConstant operation', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(registerGlobalConstantNoReveal);
      const estimate = await estimateProvider.registerGlobalConstant({
        value: {
          "prim": "Pair",
          "args": [{ "int": "998" }, { "int": "999" }]
        }
      });
      expect(estimate).toMatchObject({
        gasLimit: 1330,
        storageLimit: 73,
        suggestedFeeMutez: 335,
      });
      done();
    });

    it('should produce a reveal and a registerGlobalConstant operation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(registerGlobalConstantWithReveal);
      const estimate = await estimateProvider.registerGlobalConstant({
        value: {
          "prim": "Pair",
          "args": [{ "int": "998" }, { "int": "999" }]
        }
      });
      expect(estimate).toMatchObject({
        gasLimit: 1330,
        storageLimit: 73,
        suggestedFeeMutez: 335,
      });
      done();
    });

    it('should use the storage limit the user specified', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(registerGlobalConstantNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('1100'));
      await estimateProvider.registerGlobalConstant({
        value: {
          "prim": "Pair",
          "args": [{ "int": "998" }, { "int": "999" }]
        },
        storageLimit: 200,
      });
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                fee: '0',
                storage_limit: '200',
                gas_limit: '1040000',
              }),
            ]),
          }),
        })
      );
      done();
    });

    it('should use the gas limit the user specified', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(registerGlobalConstantNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.registerGlobalConstant({
        value: {
          "prim": "Pair",
          "args": [{ "int": "998" }, { "int": "999" }]
        },
        gasLimit: 200,
      });
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                fee: '0',
                storage_limit: '60000',
                gas_limit: '200',
              }),
            ]),
          }),
        })
      );
      done();
    });

    it('should use the fees the user specified', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(registerGlobalConstantNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.registerGlobalConstant({
        value: {
          "prim": "Pair",
          "args": [{ "int": "998" }, { "int": "999" }]
        },
        fee: 10000,
      });
      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                fee: '10000',
                storage_limit: '60000',
                gas_limit: '1040000',
              }),
            ]),
          }),
        })
      );
      done();
    });

    it('should return parsed error from RPC result', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(registerGlobalConstantWithError);

      await expect(estimateProvider.registerGlobalConstant({
        value: {
          "prim": "Pair",
          "args": [{ "int": "998" }, { "int": "999" }]
        }
      })).rejects.toMatchObject({
        errors:
          [{
            kind: 'branch',
            id: 'proto.011-PtHangzH.Expression_already_registered'
          },
          {
            kind: 'permanent',
            id: 'proto.011-PtHangzH.context.storage_error',
            existing_key: [
              'global_constant',
              'f4b54fa94f3255df3ab6a95d0112964d825642706d42de848b3c507ff4602c4a',
              'len'
            ]
          }],
        name: 'TezosOperationError',
        id: 'proto.011-PtHangzH.context.storage_error',
        kind: 'permanent',
        message: '(permanent) proto.011-PtHangzH.context.storage_error'
      });
      done();
    });
  });
});
