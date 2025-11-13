/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from '../../src/context';
import { RPCEstimateProvider } from '../../src/estimate/rpc-estimate-provider';
import { miStr, ligoSample, entrypointsGenericMultisig } from '../contract/data';
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
  TransferTicketNoReveal,
  TransferTicketWithReveal,
  updateConsensusKeyNoReveal,
  updateCompanionKeyNoReveal,
  smartRollupAddMessagesNoReveal,
  smartRollupOriginateWithReveal,
  smartRollupExecuteOutboxMessageNoReveal,
  stakeNoReveal,
  unstakeNoReveal,
  finalizeUnstakeNoReveal,
  finalizeUnstakeNoRevealDiffSourceDestination,
} from '../contract/helper';
import { OpKind, PvmKind } from '@taquito/rpc';
import { TransferTicketParams } from '../../src/operations/types';
import { InvalidAddressError } from '@taquito/utils';
import { ContractAbstraction } from '../../src/contract';
import { genericMultisig } from '../../../../integration-tests/data/multisig';
import { RpcContractProvider } from '../../src/contract/rpc-contract-provider';
import { Estimate } from '../../src/estimate';

/**
 * RPCEstimateProvider test
 */
describe('RPCEstimateProvider test signer', () => {
  let estimateProvider: RPCEstimateProvider;
  let mockRpcClient: {
    getScript: jest.Mock<any, any>;
    getBalance: jest.Mock<any, any>;
    getSpendable: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
    getBlockHeader: jest.Mock<any, any>;
    getManagerKey: jest.Mock<any, any>;
    getBlock: jest.Mock<any, any>;
    getContract: jest.Mock<any, any>;
    getBlockMetadata: jest.Mock<any, any>;
    runOperation: jest.Mock<any, any>;
    simulateOperation: jest.Mock<any, any>;
    injectOperation: jest.Mock<any, any>;
    preapplyOperations: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
    getConstants: jest.Mock<any, any>;
    getProtocols: jest.Mock<any, any>;
  };

  let mockForger: {
    forge: jest.Mock<any, any>;
  };

  let mockSigner: {
    publicKeyHash: jest.Mock<any, any>;
    publicKey: jest.Mock<any, any>;
    sign: jest.Mock<any, any>;
  };

  let context: Context;

  beforeEach(() => {
    mockRpcClient = {
      runOperation: jest.fn(),
      simulateOperation: jest.fn(),
      getBalance: jest.fn(),
      getSpendable: jest.fn(),
      getBlock: jest.fn(),
      getScript: jest.fn(),
      getManagerKey: jest.fn(),
      getStorage: jest.fn(),
      getBlockHeader: jest.fn(),
      getBlockMetadata: jest.fn(),
      getContract: jest.fn(),
      injectOperation: jest.fn(),
      preapplyOperations: jest.fn(),
      getChainId: jest.fn(),
      getConstants: jest.fn(),
      getProtocols: jest.fn(),
    };

    mockForger = {
      forge: jest.fn(),
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
    mockRpcClient.getProtocols.mockResolvedValue({ next_protocol: 'test_proto' });
    mockForger.forge.mockResolvedValue('1234');
    mockRpcClient.preapplyOperations.mockResolvedValue([]);
    mockRpcClient.getChainId.mockResolvedValue('chain-id');
    mockRpcClient.getConstants.mockResolvedValue({
      hard_gas_limit_per_operation: new BigNumber(1040000),
      hard_storage_limit_per_operation: new BigNumber(60000),
      hard_gas_limit_per_block: new BigNumber(5200000),
      cost_per_byte: new BigNumber(1000),
    });

    mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
    mockSigner.publicKey.mockResolvedValue(
      'edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn'
    );
    mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
    context = new Context(mockRpcClient as any, mockSigner as any);
    context.forger = mockForger;
    estimateProvider = new RPCEstimateProvider(context);
  });

  describe('originate', () => {
    it('should produce a reveal and origination operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue({
        contents: [
          {
            kind: 'origination',
            fee: 10000,
            metadata: {
              operation_result: {
                consumed_milligas: 1000000,
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
    });

    it('should produce estimate for an origination operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue({
        contents: [
          {
            kind: 'origination',
            fee: 10000,
            metadata: {
              operation_result: {
                consumed_milligas: 1000000,
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
      });
      expect(estimate.gasLimit).toEqual(1100);
    });
  });

  describe('staking', () => {
    it('should return estimates for stake pseudo-operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(stakeNoReveal);

      const estimate = await estimateProvider.stake({
        amount: 2,
      });

      expect(estimate.gasLimit).toEqual(3630);
    });

    it('should return estimates for unstake pseudo-operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(unstakeNoReveal);

      const estimate = await estimateProvider.unstake({
        amount: 2,
      });

      expect(estimate.gasLimit).toEqual(4250);
    });

    it('should return estimates for finalize_unstake pseudo-operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(finalizeUnstakeNoReveal);

      const estimate = await estimateProvider.finalizeUnstake({});

      expect(estimate.gasLimit).toEqual(1529);
    });

    it('should return estimates for finalize_unstake pseudo-operation with different source and destination', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(
        finalizeUnstakeNoRevealDiffSourceDestination
      );

      const estimate = await estimateProvider.finalizeUnstake({});

      expect(estimate.gasLimit).toEqual(1715);
    });
  });

  describe('transfer', () => {
    it('return the correct estimate for multiple internal origination', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.simulateOperation.mockResolvedValue(multipleInternalOrigination());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(297).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 40928,
        storageLimit: 654,
        suggestedFeeMutez: 4412,
      });
    });

    it('return the correct estimate for multiple internal origination, no reveal', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(multipleInternalOriginationNoReveal());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(297).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 40928,
        storageLimit: 654,
        suggestedFeeMutez: 4574,
      });
    });

    it('return the correct estimate for 2 internal transfer that need allocation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.simulateOperation.mockResolvedValue(multipleInternalTransfer());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(285).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 36875,
        storageLimit: 534,
        suggestedFeeMutez: 3995,
      });
    });

    it('return the correct estimate for delegation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.simulateOperation.mockResolvedValue(delegate());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(149).fill('aa').join(''));
      const estimate = await estimateProvider.setDelegate({
        source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        delegate: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      });
      expect(estimate).toMatchObject({
        gasLimit: 10000,
        storageLimit: 0,
        suggestedFeeMutez: 1171,
      });
    });

    it('return the correct estimate for origination', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.simulateOperation.mockResolvedValue(origination());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(445).fill('aa').join(''));
      const estimate = await estimateProvider.originate({
        code: ligoSample,
        storage: 0,
      });
      expect(estimate).toMatchObject({
        gasLimit: 17932,
        storageLimit: 591,
        suggestedFeeMutez: 2261,
      });
    });

    it('return the correct estimate for internal transfer without allocation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.simulateOperation.mockResolvedValue(internalTransfer());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(226).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 26260,
        storageLimit: 0,
        suggestedFeeMutez: 2874,
      });
    });

    it('return the correct estimate for transfer without allocation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.simulateOperation.mockResolvedValue(transferWithoutAllocation());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(153).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 10207,
        storageLimit: 0,
        suggestedFeeMutez: 1196,
      });
    });

    it('return the correct estimate for transfer with allocation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.simulateOperation.mockResolvedValue(transferWithAllocation());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(153).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 10207,
        storageLimit: 277,
        suggestedFeeMutez: 1196,
      });
    });

    const mockRpcClientSimulateOperation = () => {
      mockRpcClient.simulateOperation.mockResolvedValue({
        contents: [
          {
            kind: 'transaction',
            fee: 10000,
            metadata: {
              operation_result: {
                consumed_milligas: 1000000,
              },
            },
          },
        ],
      });
    };

    it('should produce a reveal and transaction operation', async () => {
      mockRpcClientSimulateOperation();
      const estimate = await estimateProvider.transfer({
        to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });
      expect(estimate.gasLimit).toEqual(1000);
    });

    it('should use the maximum storage the protocol allow if user can afford it', async () => {
      mockRpcClientSimulateOperation();
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('800000000'));
      await estimateProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
      });
      expect(mockRpcClient.simulateOperation).toHaveBeenCalledWith(
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
    });

    it('should use the storage limit the user specified', async () => {
      mockRpcClientSimulateOperation();
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('1100'));
      await estimateProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        storageLimit: 200,
      });
      expect(mockRpcClient.simulateOperation).toHaveBeenCalledWith(
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
    });

    it('should use the gas limit the user specified', async () => {
      mockRpcClientSimulateOperation();
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        gasLimit: 200,
      });
      expect(mockRpcClient.simulateOperation).toHaveBeenCalledWith(
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
    });

    it('should use the fees the user specified', async () => {
      mockRpcClientSimulateOperation();
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
      });
      expect(mockRpcClient.simulateOperation).toHaveBeenCalledWith(
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
    });

    it('should return parsed error from RPC result', async () => {
      const params = {
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.simulateOperation.mockResolvedValue(preapplyResultFrom(params).withError()[0]);
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      await expect(estimateProvider.transfer(params)).rejects.toMatchObject({
        id: 'proto.006-PsCARTHA.michelson_v1.script_rejected',
        message: 'test',
      });
    });

    it('should return parsed error from RPC result', async () => {
      const params = {
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.simulateOperation.mockResolvedValue(
        preapplyResultFrom(params).withBalanceTooLowError()[0]
      );
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      await expect(estimateProvider.transfer(params)).rejects.toMatchObject({
        id: 'proto.006-PsCARTHA.contract.balance_too_low',
        message: '(temporary) proto.006-PsCARTHA.contract.balance_too_low',
      });
    });

    it('should return internal error when received from preapply', async () => {
      const params = {
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.simulateOperation.mockResolvedValue(
        preapplyResultFrom(params).withInternalError()[0]
      );
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      await expect(estimateProvider.transfer(params)).rejects.toMatchObject({
        id: 'proto.005-PsBabyM1.gas_exhausted.operation',
        message: '(temporary) proto.005-PsBabyM1.gas_exhausted.operation',
      });
    });
  });

  describe('transferTicket', () => {
    it('should return the correct estimation for a transfer Ticket Operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(TransferTicketNoReveal);

      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
        fee: 804,
        gasLimit: 5009,
        storageLimit: 130,
        ticketContents: { string: 'foobar' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticketAmount: 2,
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
        entrypoint: 'default',
      };

      const estimate = await estimateProvider.transferTicket(params);

      expect(mockRpcClient.simulateOperation).toHaveBeenCalledWith(
        expect.objectContaining({
          operation: expect.objectContaining({
            contents: expect.arrayContaining([
              expect.objectContaining({
                fee: '804',
                gas_limit: '5009',
                storage_limit: '130',
              }),
            ]),
          }),
        })
      );
      expect(estimate).toMatchObject({
        gasLimit: 2223,
        storageLimit: 86,
      });
    });

    it('should return estimation with reveal for transfer ticket operation', async () => {
      mockRpcClient.getManagerKey.mockReturnValue(null);
      mockForger.forge.mockReturnValue(new Array(224).fill('aa').join(''));
      mockRpcClient.simulateOperation.mockReturnValue(TransferTicketWithReveal);

      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
        fee: 804,
        gasLimit: 5009,
        storageLimit: 130,
        ticketContents: { string: 'foobar' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticketAmount: 2,
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
        entrypoint: 'default',
      };

      const estimate = await estimateProvider.transferTicket(params);

      expect(estimate).toMatchObject({
        gasLimit: 2223,
        storageLimit: 86,
      });
    });

    it('should throw an error with invalid source', async () => {
      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHG',
        fee: 804,
        gasLimit: 5009,
        storageLimit: 130,
        ticketContents: { string: 'foobar' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticketAmount: 2,
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
        entrypoint: 'default',
      };

      expect(() => estimateProvider.transferTicket(params)).rejects.toThrowError(
        InvalidAddressError
      );
    });

    it('should throw an error with invalid destination', async () => {
      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
        fee: 804,
        gasLimit: 5009,
        storageLimit: 130,
        ticketContents: { string: 'foobar' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticketAmount: 2,
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26F',
        entrypoint: 'default',
      };

      expect(() => estimateProvider.transferTicket(params)).rejects.toThrowError(
        InvalidAddressError
      );
    });
  });

  describe('batch', () => {
    it('should produce a batch operation, no reveal', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue({
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
                consumed_milligas: 1000000,
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
                consumed_milligas: 1000000,
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
          kind: OpKind.REGISTER_GLOBAL_CONSTANT,
          value: {
            prim: 'Pair',
            args: [{ int: '998' }, { int: '999' }],
          },
        },
      ]);
      expect(estimate.length).toEqual(3);
      expect(estimate[0].gasLimit).toEqual(1000);
      expect(estimate[1].gasLimit).toEqual(1000);
      expect(estimate[2].gasLimit).toEqual(1330);
    });

    it('should produce a batch operation, with reveal', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockForger.forge.mockResolvedValue(new Array(224).fill('aa').join(''));
      mockRpcClient.simulateOperation.mockResolvedValue({
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
              operation_result: { status: 'applied', consumed_milligas: '1000000' },
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
                consumed_milligas: 1000000,
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
                consumed_milligas: 1000000,
              },
            },
          },
        ],
      });
      const estimate = await estimateProvider.batch([
        {
          kind: OpKind.REGISTER_GLOBAL_CONSTANT,
          value: {
            prim: 'Pair',
            args: [{ int: '998' }, { int: '999' }],
          },
        },
        { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
        { kind: OpKind.TRANSACTION, to: 'tz3hRZUScFCcEVhdDjXWoyekbgd1Gatga6mp', amount: 2 },
      ]);
      expect(estimate.length).toEqual(4);

      expect(estimate[0]).toMatchObject({
        gasLimit: 1000,
        storageLimit: 0,
        suggestedFeeMutez: 382,
      });
      expect(estimate[1]).toMatchObject({
        gasLimit: 1330,
        storageLimit: 93,
        suggestedFeeMutez: 349,
      });
      expect(estimate[2].suggestedFeeMutez).toEqual(316);
      expect(estimate[3].suggestedFeeMutez).toEqual(316);

      expect(estimate[2]).toMatchObject({
        gasLimit: 1000,
        storageLimit: 0,
        suggestedFeeMutez: 316,
      });
      expect(estimate[3]).toMatchObject({
        gasLimit: 1000,
        storageLimit: 0,
        suggestedFeeMutez: 316,
      });
    });

    it('runOperation should be called with a gas_limit equal to the hard_gas_limit_per_operation constant', async () => {
      const transactionResult = {
        kind: 'transaction',
        metadata: {
          operation_result: {
            consumed_milligas: 1000000,
          },
        },
      };
      mockForger.forge.mockResolvedValue(new Array(149).fill('aa').join(''));
      mockRpcClient.simulateOperation.mockResolvedValue({
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
      expect(mockRpcClient.simulateOperation).toHaveBeenCalledWith(
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
    });

    it('runOperation should be called with a gas_limit calculated with the hard_gas_limit_per_block constant and the number of operation in the batch', async () => {
      const transactionResult = {
        kind: 'transaction',
        fee: 10000,
        metadata: {
          operation_result: {
            consumed_milligas: 1000000,
          },
        },
      };
      mockForger.forge.mockResolvedValue(new Array(149).fill('aa').join(''));
      mockRpcClient.simulateOperation.mockResolvedValue({
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
      expect(mockRpcClient.simulateOperation).toHaveBeenCalledWith(
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
    });

    it('should produce a batch operation containing 2 transactions, no reveal', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue({
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
                consumed_milligas: 1000000,
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
                consumed_milligas: 1000000,
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
          kind: OpKind.REGISTER_GLOBAL_CONSTANT,
          value: {
            prim: 'Pair',
            args: [{ int: '998' }, { int: '999' }],
          },
        },
      ]);
      expect(estimate.length).toEqual(3);
      expect(estimate[0].gasLimit).toEqual(1000);
      expect(estimate[1].gasLimit).toEqual(1000);
      expect(estimate[2].gasLimit).toEqual(1330);
    });
  });

  describe('registerGlobalConstant', () => {
    it('should return the correct estimate for registerGlobalConstant operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(registerGlobalConstantNoReveal);
      const estimate = await estimateProvider.registerGlobalConstant({
        value: {
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
        },
      });
      expect(estimate).toMatchObject({
        gasLimit: 1330,
        storageLimit: 93,
        suggestedFeeMutez: 319,
      });
    });

    it('should produce a reveal and a registerGlobalConstant operation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.simulateOperation.mockResolvedValue(registerGlobalConstantWithReveal);
      const estimate = await estimateProvider.registerGlobalConstant({
        value: {
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
        },
      });
      expect(estimate).toMatchObject({
        gasLimit: 1330,
        storageLimit: 93,
        suggestedFeeMutez: 157,
      });
    });

    it('should use the storage limit the user specified', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(registerGlobalConstantNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('1100'));
      await estimateProvider.registerGlobalConstant({
        value: {
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
        },
        storageLimit: 200,
      });
      expect(mockRpcClient.simulateOperation).toHaveBeenCalledWith(
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
    });

    it('should use the gas limit the user specified', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(registerGlobalConstantNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.registerGlobalConstant({
        value: {
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
        },
        gasLimit: 200,
      });
      expect(mockRpcClient.simulateOperation).toHaveBeenCalledWith(
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
    });

    it('should use the fees the user specified', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(registerGlobalConstantNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.registerGlobalConstant({
        value: {
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
        },
        fee: 10000,
      });
      expect(mockRpcClient.simulateOperation).toHaveBeenCalledWith(
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
    });

    it('should return parsed error from RPC result', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(registerGlobalConstantWithError);

      await expect(
        estimateProvider.registerGlobalConstant({
          value: {
            prim: 'Pair',
            args: [{ int: '998' }, { int: '999' }],
          },
        })
      ).rejects.toMatchObject({
        errors: [
          {
            kind: 'branch',
            id: 'proto.011-PtHangzH.Expression_already_registered',
          },
          {
            kind: 'permanent',
            id: 'proto.011-PtHangzH.context.storage_error',
            existing_key: [
              'global_constant',
              'f4b54fa94f3255df3ab6a95d0112964d825642706d42de848b3c507ff4602c4a',
              'len',
            ],
          },
        ],
        name: 'TezosOperationError',
        id: 'proto.011-PtHangzH.context.storage_error',
        kind: 'permanent',
        message: '(permanent) proto.011-PtHangzH.context.storage_error',
      });
    });
  });

  describe('contractCall', () => {
    it('should return estimates for contract calls', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue({
        contents: [
          {
            kind: 'transaction',
            fee: 10000,
            metadata: {
              operation_result: {
                consumed_milligas: 1000000,
              },
            },
          },
        ],
      });

      const mockEstimate = {};
      const mockReadProvider = {};
      const rpcContractProvider = new RpcContractProvider(context, mockEstimate as any);

      const contractAbs = new ContractAbstraction(
        'contractAddress',
        {
          code: genericMultisig,
          storage: {},
        },
        rpcContractProvider,
        rpcContractProvider,
        entrypointsGenericMultisig,
        mockRpcClient as any,
        mockReadProvider as any
      );

      const contractMethod = contractAbs.methodsObject.main({
        payload: {
          counter: 2,
          action: {
            change_keys: {
              threshold: 2,
              keys: ['edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g'],
            },
          },
        },
        sigs: ['sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd'],
      });

      const estimate = await estimateProvider.contractCall(contractMethod);

      expect(estimate).toBeInstanceOf(Estimate);
    });
  });
});

describe('RPCEstimateProvider test wallet', () => {
  let estimateProvider: RPCEstimateProvider;
  let mockRpcClient: {
    getScript: jest.Mock<any, any>;
    getBalance: jest.Mock<any, any>;
    getSpendable: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
    getBlockHeader: jest.Mock<any, any>;
    getManagerKey: jest.Mock<any, any>;
    getBlock: jest.Mock<any, any>;
    getContract: jest.Mock<any, any>;
    getBlockMetadata: jest.Mock<any, any>;
    runOperation: jest.Mock<any, any>;
    simulateOperation: jest.Mock<any, any>;
    injectOperation: jest.Mock<any, any>;
    preapplyOperations: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
    getConstants: jest.Mock<any, any>;
    getProtocols: jest.Mock<any, any>;
  };

  let mockForger: {
    forge: jest.Mock<any, any>;
  };

  let mockWalletProvider: {
    getPKH: jest.Mock<any, any>;
  };

  let mockSigner: {
    publicKeyHash: jest.Mock<any, any>;
    publicKey: jest.Mock<any, any>;
    sign: jest.Mock<any, any>;
  };

  beforeEach(() => {
    mockRpcClient = {
      runOperation: jest.fn(),
      simulateOperation: jest.fn(),
      getBalance: jest.fn(),
      getSpendable: jest.fn(),
      getBlock: jest.fn(),
      getScript: jest.fn(),
      getManagerKey: jest.fn(),
      getStorage: jest.fn(),
      getBlockHeader: jest.fn(),
      getBlockMetadata: jest.fn(),
      getContract: jest.fn(),
      injectOperation: jest.fn(),
      preapplyOperations: jest.fn(),
      getChainId: jest.fn(),
      getConstants: jest.fn(),
      getProtocols: jest.fn(),
    };

    mockForger = {
      forge: jest.fn(),
    };

    mockWalletProvider = {
      getPKH: jest.fn(),
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
    mockRpcClient.getProtocols.mockResolvedValue({ next_protocol: 'test_proto' });
    mockForger.forge.mockResolvedValue('1234');
    mockRpcClient.preapplyOperations.mockResolvedValue([]);
    mockRpcClient.getChainId.mockResolvedValue('chain-id');
    mockRpcClient.getConstants.mockResolvedValue({
      hard_gas_limit_per_operation: new BigNumber(1040000),
      hard_storage_limit_per_operation: new BigNumber(60000),
      hard_gas_limit_per_block: new BigNumber(5200000),
      cost_per_byte: new BigNumber(1000),
    });

    mockWalletProvider.getPKH.mockResolvedValue('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb');
    mockSigner.publicKeyHash.mockResolvedValue('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb');
    mockSigner.publicKey.mockResolvedValue(
      'edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn'
    );
    const context = new Context(mockRpcClient as any);
    context.forger = mockForger;
    context.signer = mockSigner as any;
    context.walletProvider = mockWalletProvider as any;
    estimateProvider = new RPCEstimateProvider(context);
  });

  describe('originate', () => {
    it('should produce an estimate for origination operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue({
        contents: [
          {
            kind: 'origination',
            fee: 10000,
            metadata: {
              operation_result: {
                consumed_milligas: 1000000,
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
    });
  });

  describe('transfer', () => {
    it('return the correct estimate for multiple internal origination, no reveal', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(multipleInternalOriginationNoReveal());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(297).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 40928,
        storageLimit: 654,
        suggestedFeeMutez: 4574,
      });
    });
  });

  describe('setDelegate', () => {
    it('return the correct estimate for delegation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue({
        contents: [
          {
            kind: 'delegation',
            fee: 10000,
            metadata: {
              operation_result: { status: 'applied', consumed_milligas: '10000000' },
            },
          },
        ],
      });
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(149).fill('aa').join(''));
      const estimate = await estimateProvider.setDelegate({
        source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        delegate: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      });
      expect(estimate).toMatchObject({
        gasLimit: 10000,
        storageLimit: 0,
        suggestedFeeMutez: 1333,
      });
    });
  });

  describe('registerDelegate', () => {
    it('return the correct estimate for delegation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue({
        contents: [
          {
            kind: 'delegation',
            fee: 10000,
            metadata: {
              operation_result: { status: 'applied', consumed_milligas: '10000000' },
            },
          },
        ],
      });
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(149).fill('aa').join(''));
      const estimate = await estimateProvider.registerDelegate({});
      expect(estimate).toMatchObject({
        gasLimit: 10000,
        storageLimit: 0,
        suggestedFeeMutez: 1333,
      });
    });
  });

  describe('batch', () => {
    it('should produce a batch operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue({
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
                consumed_milligas: 1000000,
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
                consumed_milligas: 1000000,
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
          kind: OpKind.REGISTER_GLOBAL_CONSTANT,
          value: {
            prim: 'Pair',
            args: [{ int: '998' }, { int: '999' }],
          },
        },
      ]);
      expect(estimate[0].gasLimit).toEqual(1000);
      expect(estimate[1].gasLimit).toEqual(1000);
      expect(estimate[2].gasLimit).toEqual(1330);
    });
  });

  describe('registerGlobalConstant', () => {
    it('should return the correct estimate for registerGlobalConstant operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(registerGlobalConstantNoReveal);
      const estimate = await estimateProvider.registerGlobalConstant({
        value: {
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
        },
      });
      expect(estimate).toMatchObject({
        gasLimit: 1330,
        storageLimit: 93,
        suggestedFeeMutez: 319,
      });
    });
  });

  describe('updateConsensusKey', () => {
    it('should return estimate for updateConsensusKey operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(updateConsensusKeyNoReveal);
      const estimate = await estimateProvider.updateConsensusKey({
        pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      });

      expect(estimate.gasLimit).toEqual(1100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(296);
    });
  });

  describe('updateCompanionKey', () => {
    it('should return estimate for updateCompanionKey operation', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(updateCompanionKeyNoReveal);
      const estimate = await estimateProvider.updateCompanionKey({
        pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
        proof:
          'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
      });

      expect(estimate.gasLimit).toEqual(1100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(296);
    });
  });

  describe('smartRollupAddMessages', () => {
    it('should return the correct estimate for smartRollupAddMessages op', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(smartRollupAddMessagesNoReveal);
      const estimate = await estimateProvider.smartRollupAddMessages({
        message: [
          '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
        ],
      });

      expect(estimate.gasLimit).toEqual(1103);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(297);
    });
  });

  describe('smartRollupOriginate', () => {
    it('Should return the correct estimate for SmartRollupOriginate operation', async () => {
      mockRpcClient.getConstants.mockResolvedValue({
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_storage_limit_per_operation: new BigNumber(60000),
        hard_gas_limit_per_block: new BigNumber(5200000),
        cost_per_byte: new BigNumber(1000),
        smart_rollup_origination_size: new BigNumber(6314),
      });
      mockRpcClient.simulateOperation.mockResolvedValue(smartRollupOriginateWithReveal);

      const estimate = await estimateProvider.smartRollupOriginate({
        pvmKind: PvmKind.WASM2,
        kernel:
          '0061736d0100000001280760037f7f7f017f60027f7f017f60057f7f7f7f7f017f60017f0060017f017f60027f7f0060000002610311736d6172745f726f6c6c75705f636f72650a726561645f696e707574000011736d6172745f726f6c6c75705f636f72650c77726974655f6f7574707574000111736d6172745f726f6c6c75705f636f72650b73746f72655f77726974650002030504030405060503010001071402036d656d02000a6b65726e656c5f72756e00060aa401042a01027f41fa002f0100210120002f010021022001200247044041e4004112410041e400410010021a0b0b0800200041c4006b0b5001057f41fe002d0000210341fc002f0100210220002d0000210420002f0100210520011004210620042003460440200041016a200141016b10011a0520052002460440200041076a200610011a0b0b0b1d01017f41dc0141840241901c100021004184022000100541840210030b0b38050041e4000b122f6b65726e656c2f656e762f7265626f6f740041f8000b0200010041fa000b0200020041fc000b0200000041fe000b0101',
        parametersType: {
          prim: 'bytes',
        },
      });
      expect(estimate.gasLimit).toEqual(3849);
      expect(estimate.storageLimit).toEqual(6572);
      expect(estimate.suggestedFeeMutez).toEqual(733);
      expect(estimate).toMatchObject({
        gasLimit: 3849,
        storageLimit: 6572,
        suggestedFeeMutez: 733,
        minimalFeeMutez: 713,
      });
    });
  });

  describe('smartRollupExecuteOutboxMessage', () => {
    it('should return the correct estimate for smartRollupExecuteOutboxMessage op', async () => {
      mockRpcClient.simulateOperation.mockResolvedValue(smartRollupExecuteOutboxMessageNoReveal);
      const estimate = await estimateProvider.smartRollupExecuteOutboxMessage({
        rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
        cementedCommitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
        outputProof:
          '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
      });

      expect(estimate).toMatchObject({
        gasLimit: 6385,
        storageLimit: 36,
        suggestedFeeMutez: 825,
      });
    });
  });
});
