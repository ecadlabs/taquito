/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from '../../src/context';
import { RPCEstimateProvider } from '../../src/estimate/rpc-estimate-provider';
import { miStr, ligoSample } from '../contract/data';
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
  txRollupOriginateNoReveal,
  txRollupOriginateWithReveal,
  txRollupSubmitBatchNoReveal,
  txRollupSubmitBatchWithReveal,
  TransferTicketNoReveal,
  TransferTicketWithReveal,
  updateConsensusKeyNoReveal,
  smartRollupAddMessagesNoReveal,
  smartRollupOriginateWithReveal,
} from '../contract/helper';
import { OpKind, PvmKind } from '@taquito/rpc';
import { TransferTicketParams } from '../../src/operations/types';
import { InvalidAddressError } from '@taquito/utils';

/**
 * RPCEstimateProvider test
 */
describe('RPCEstimateProvider test signer', () => {
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
    runOperation: jest.Mock<any, any>;
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
    mockSigner.publicKey.mockResolvedValue('test_pub_key');
    mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
    const context = new Context(mockRpcClient as any, mockSigner as any);
    context.forger = mockForger;
    estimateProvider = new RPCEstimateProvider(context);
  });

  describe('originate', () => {
    it('should produce a reveal and origination operation', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          {
            kind: 'origination',
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
      done();
    });
  });

  describe('transfer', () => {
    it('return the correct estimate for multiple internal origination', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(multipleInternalOrigination());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(297).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 40928,
        storageLimit: 634,
        suggestedFeeMutez: 4590,
      });
      done();
    });

    it('return the correct estimate for multiple internal origination, no reveal', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(multipleInternalOriginationNoReveal());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(297).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 40928,
        storageLimit: 634,
        suggestedFeeMutez: 4590,
      });
      done();
    });

    it('return the correct estimate for 2 internal transfer that need allocation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(multipleInternalTransfer());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(285).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 36875,
        storageLimit: 514,
        suggestedFeeMutez: 4173,
      });
      done();
    });

    it('return the correct estimate for delegation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(delegate());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(149).fill('aa').join(''));
      const estimate = await estimateProvider.setDelegate({
        source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        delegate: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      });
      expect(estimate).toMatchObject({
        gasLimit: 10100,
        storageLimit: 0,
        suggestedFeeMutez: 1359,
      });
      done();
    });

    it('return the correct estimate for origination', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(origination());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(445).fill('aa').join(''));
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

    it('return the correct estimate for internal transfer without allocation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(internalTransfer());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(226).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 26260,
        storageLimit: 0,
        suggestedFeeMutez: 3052,
      });
      done();
    });

    it('return the correct estimate for transfer without allocation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(transferWithoutAllocation());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(153).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 10307,
        storageLimit: 0,
        suggestedFeeMutez: 1384,
      });
      done();
    });

    it('return the correct estimate for transfer with allocation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(transferWithAllocation());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(153).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
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
                consumed_milligas: 1000000,
              },
            },
          },
        ],
      });
    };

    it('should produce a reveal and transaction operation', async (done) => {
      mockRpcClientRunOperation();
      const estimate = await estimateProvider.transfer({
        to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
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
        to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
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
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
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
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
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
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
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
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
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
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
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
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
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
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
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

  describe('transferTicket', () => {
    it('should return the correct estimation for a transfer Ticket Operation', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(TransferTicketNoReveal);

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

      expect(mockRpcClient.runOperation).toHaveBeenCalledWith(
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
        storageLimit: 66,
      });
      done();
    });
    it('should return estimation with reveal for transfer ticket operation', async (done) => {
      mockRpcClient.getManagerKey.mockReturnValue(null);
      mockForger.forge.mockReturnValue(new Array(224).fill('aa').join(''));
      mockRpcClient.runOperation.mockReturnValue(TransferTicketWithReveal);

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
        storageLimit: 66,
      });

      done();
    });

    it('should throw an error with invalid source', async (done) => {
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

      done();
    });

    it('should throw an error with invalid destination', async (done) => {
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
      expect(estimate[0].gasLimit).toEqual(1100);
      expect(estimate[1].gasLimit).toEqual(1100);
      expect(estimate[2].gasLimit).toEqual(1330);
      done();
    });

    it('should produce a batch operation, with reveal', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockForger.forge.mockResolvedValue(new Array(224).fill('aa').join(''));
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
        gasLimit: 1100,
        storageLimit: 0,
        suggestedFeeMutez: 374,
      });
      expect(estimate[1]).toMatchObject({
        gasLimit: 1330,
        storageLimit: 73,
        suggestedFeeMutez: 408,
      });
      expect(estimate[2].suggestedFeeMutez).toEqual(385);
      expect(estimate[3].suggestedFeeMutez).toEqual(385);
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
            consumed_milligas: 1000000,
          },
        },
      };
      mockForger.forge.mockResolvedValue(new Array(149).fill('aa').join(''));
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
            consumed_milligas: 1000000,
          },
        },
      };
      mockForger.forge.mockResolvedValue(new Array(149).fill('aa').join(''));
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

    it('should produce a batch operation containing 2 txRollupOriginate, no reveal', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [txRollupOriginateNoReveal.contents[0], txRollupOriginateNoReveal.contents[0]],
      });
      const estimate = await estimateProvider.batch([
        { kind: OpKind.TX_ROLLUP_ORIGINATION },
        { kind: OpKind.TX_ROLLUP_ORIGINATION },
      ]);
      expect(estimate.length).toEqual(2);
      expect(estimate[0].gasLimit).toEqual(1521);
      expect(estimate[1].gasLimit).toEqual(1521);
      done();
    });

    it('should produce a batch operation containing 2 txRollupSubmitBatch, no reveal', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          txRollupSubmitBatchNoReveal.contents[0],
          txRollupSubmitBatchNoReveal.contents[0],
        ],
      });
      const estimate = await estimateProvider.batch([
        {
          kind: OpKind.TX_ROLLUP_SUBMIT_BATCH,
          content: '626c6f62',
          rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
        },
        {
          kind: OpKind.TX_ROLLUP_SUBMIT_BATCH,
          content: '626c6f62',
          rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
        },
      ]);
      expect(estimate.length).toEqual(2);
      expect(estimate[0].gasLimit).toEqual(2869);
      expect(estimate[1].gasLimit).toEqual(2869);
      done();
    });
  });

  describe('registerGlobalConstant', () => {
    it('should return the correct estimate for registerGlobalConstant operation', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(registerGlobalConstantNoReveal);
      const estimate = await estimateProvider.registerGlobalConstant({
        value: {
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
        },
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
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
        },
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
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
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
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
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
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
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
      done();
    });
  });

  describe('txRollupOriginate', () => {
    beforeEach(() => {
      mockRpcClient.getConstants.mockResolvedValue({
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_storage_limit_per_operation: new BigNumber(60000),
        hard_gas_limit_per_block: new BigNumber(5200000),
        cost_per_byte: new BigNumber(1000),
        tx_rollup_origination_size: 4000,
      });
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(64).fill('aa').join(''));
    });
    it('should return the correct estimate for txRollupOriginate operation', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(txRollupOriginateNoReveal);
      const estimate = await estimateProvider.txRollupOriginate();
      expect(estimate).toMatchObject({
        gasLimit: 1521,
        storageLimit: 4000,
        suggestedFeeMutez: 417,
      });
      done();
    });

    it('should produce a reveal and a txRollupOriginate operation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(txRollupOriginateWithReveal);
      const estimate = await estimateProvider.txRollupOriginate();
      expect(estimate).toMatchObject({
        gasLimit: 1521,
        storageLimit: 4000,
        suggestedFeeMutez: 417,
      });
      done();
    });

    it('should use the storage limit the user specified', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(txRollupOriginateNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('1100'));
      await estimateProvider.txRollupOriginate({
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
      mockRpcClient.runOperation.mockResolvedValue(txRollupOriginateNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.txRollupOriginate({
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
      mockRpcClient.runOperation.mockResolvedValue(txRollupOriginateNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.txRollupOriginate({
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
  });

  describe('txRollupSubmitBatch', () => {
    beforeEach(() => {
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(93).fill('aa').join(''));
    });
    it('should return the correct estimate for txRollupSubmitBatch operation', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(txRollupSubmitBatchNoReveal);
      const estimate = await estimateProvider.txRollupSubmitBatch({
        rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
        content: '626c6f62',
      });

      expect(estimate).toMatchObject({
        gasLimit: 2869,
        storageLimit: 0,
        suggestedFeeMutez: 580,
      });
      done();
    });

    it('should produce a reveal and a txRollupSubmitBatch operation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(txRollupSubmitBatchWithReveal);
      const estimate = await estimateProvider.txRollupSubmitBatch({
        rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
        content: '626c6f62',
      });

      expect(estimate).toMatchObject({
        gasLimit: 2869,
        storageLimit: 0,
        suggestedFeeMutez: 580,
      });
      done();
    });

    it('should use the storage limit the user specified', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(txRollupSubmitBatchNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('1100'));
      await estimateProvider.txRollupSubmitBatch({
        rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
        content: '626c6f62',
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
      mockRpcClient.runOperation.mockResolvedValue(txRollupSubmitBatchNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.txRollupSubmitBatch({
        rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
        content: '626c6f62',
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
      mockRpcClient.runOperation.mockResolvedValue(txRollupSubmitBatchNoReveal);
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000000000'));
      await estimateProvider.txRollupSubmitBatch({
        rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
        content: '626c6f62',
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
  });
});

describe('RPCEstimateProvider test wallet', () => {
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
    runOperation: jest.Mock<any, any>;
    injectOperation: jest.Mock<any, any>;
    preapplyOperations: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
    getConstants: jest.Mock<any, any>;
    getProtocols: jest.Mock<any, any>;
    getOriginationProof: jest.Mock<any, any>;
  };

  let mockForger: {
    forge: jest.Mock<any, any>;
  };

  let mockWalletProvider: {
    getPKH: jest.Mock<any, any>;
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
      injectOperation: jest.fn(),
      preapplyOperations: jest.fn(),
      getChainId: jest.fn(),
      getConstants: jest.fn(),
      getProtocols: jest.fn(),
      getOriginationProof: jest.fn(),
    };

    mockForger = {
      forge: jest.fn(),
    };

    mockWalletProvider = {
      getPKH: jest.fn(),
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

    mockWalletProvider.getPKH.mockResolvedValue('test_wallet_pub_key_hash');
    const context = new Context(mockRpcClient as any);
    context.forger = mockForger;
    context.walletProvider = mockWalletProvider as any;
    estimateProvider = new RPCEstimateProvider(context);
  });

  describe('originate', () => {
    it('should produce an estimate for origination operation', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          {
            kind: 'origination',
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
      done();
    });

    it('should throw an error if the account is unrevealed', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      try {
        await estimateProvider.originate({
          code: ligoSample,
          storage: 0,
        });
      } catch (e) {
        expect(e.message).toEqual(
          'Unable to estimate the reveal operation, the public key is unknown'
        );
      }
      done();
    });
  });

  describe('transfer', () => {
    it('return the correct estimate for multiple internal origination, no reveal', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(multipleInternalOriginationNoReveal());
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(297).fill('aa').join(''));
      const estimate = await estimateProvider.transfer({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
      });
      expect(estimate).toMatchObject({
        gasLimit: 40928,
        storageLimit: 634,
        suggestedFeeMutez: 4590,
      });
      done();
    });

    it('should throw an error if the account is unrevealed', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      try {
        await estimateProvider.transfer({
          to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: 2,
        });
      } catch (e) {
        expect(e.message).toEqual(
          'Unable to estimate the reveal operation, the public key is unknown'
        );
      }
      done();
    });
  });

  describe('setDelegate', () => {
    it('return the correct estimate for delegation', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          {
            kind: 'delegation',
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
        gasLimit: 10100,
        storageLimit: 0,
        suggestedFeeMutez: 1359,
      });
      done();
    });

    it('should throw an error if the account is unrevealed', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      try {
        await estimateProvider.setDelegate({
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          delegate: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
        });
      } catch (e) {
        expect(e.message).toEqual(
          'Unable to estimate the reveal operation, the public key is unknown'
        );
      }
      done();
    });
  });

  describe('registerDelegate', () => {
    it('return the correct estimate for delegation', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue({
        contents: [
          {
            kind: 'delegation',
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
        gasLimit: 10100,
        storageLimit: 0,
        suggestedFeeMutez: 1359,
      });
      done();
    });

    it('should throw an error if the account is unrevealed', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      try {
        await estimateProvider.registerDelegate({});
      } catch (e) {
        expect(e.message).toEqual(
          'Unable to estimate the reveal operation, the public key is unknown'
        );
      }
      done();
    });
  });

  describe('batch', () => {
    it('should produce a batch operation', async (done) => {
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
          txRollupOriginateNoReveal.contents[0],
          txRollupSubmitBatchNoReveal.contents[0],
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
        { kind: OpKind.TX_ROLLUP_ORIGINATION },
        {
          kind: OpKind.TX_ROLLUP_SUBMIT_BATCH,
          rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
          content: '626c6f62',
        },
      ]);
      expect(estimate.length).toEqual(5);
      expect(estimate[0].gasLimit).toEqual(1100);
      expect(estimate[1].gasLimit).toEqual(1100);
      expect(estimate[2].gasLimit).toEqual(1330);
      expect(estimate[3].gasLimit).toEqual(1521);
      expect(estimate[4].gasLimit).toEqual(2869);
      done();
    });

    it('should throw an error if the account is unrevealed', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);

      try {
        await estimateProvider.batch([
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
      } catch (e) {
        expect(e.message).toEqual(
          'Unable to estimate the reveal operation, the public key is unknown'
        );
      }

      done();
    });
  });

  describe('registerGlobalConstant', () => {
    it('should return the correct estimate for registerGlobalConstant operation', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(registerGlobalConstantNoReveal);
      const estimate = await estimateProvider.registerGlobalConstant({
        value: {
          prim: 'Pair',
          args: [{ int: '998' }, { int: '999' }],
        },
      });
      expect(estimate).toMatchObject({
        gasLimit: 1330,
        storageLimit: 73,
        suggestedFeeMutez: 335,
      });
      done();
    });

    it('should throw an error if account is unrevealed', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(registerGlobalConstantWithReveal);
      try {
        await estimateProvider.registerGlobalConstant({
          value: {
            prim: 'Pair',
            args: [{ int: '998' }, { int: '999' }],
          },
        });
      } catch (e) {
        expect(e.message).toEqual(
          'Unable to estimate the reveal operation, the public key is unknown'
        );
      }
      done();
    });
  });

  describe('reveal', () => {
    it('should throw an error', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      try {
        await estimateProvider.reveal({});
      } catch (e) {
        expect(e.message).toEqual(
          'Unable to estimate the reveal operation, the public key is unknown'
        );
      }
      done();
    });
  });

  describe('updateConsensusKey', () => {
    it('should return estimate for updateConsensusKey operation', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(updateConsensusKeyNoReveal);
      const estimate = await estimateProvider.updateConsensusKey({
        pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      });

      expect(estimate.gasLimit).toEqual(1100);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(312);
      done();
    });
  });

  describe('txRollupOriginate', () => {
    it('should return the correct estimate for txRollupOriginate operation', async (done) => {
      mockRpcClient.getConstants.mockResolvedValue({
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_storage_limit_per_operation: new BigNumber(60000),
        hard_gas_limit_per_block: new BigNumber(5200000),
        cost_per_byte: new BigNumber(1000),
        tx_rollup_origination_size: 4000,
      });
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(64).fill('aa').join(''));
      mockRpcClient.runOperation.mockResolvedValue(txRollupOriginateNoReveal);
      const estimate = await estimateProvider.txRollupOriginate();
      expect(estimate).toMatchObject({
        gasLimit: 1521,
        storageLimit: 4000,
        suggestedFeeMutez: 417,
      });
      done();
    });

    it('should throw an error if account is unrevealed', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(txRollupOriginateWithReveal);
      try {
        await estimateProvider.txRollupOriginate();
      } catch (e) {
        expect(e.message).toEqual(
          'Unable to estimate the reveal operation, the public key is unknown'
        );
      }
      done();
    });
  });

  describe('txRollupSubmitBatch', () => {
    it('should return the correct estimate for txRollupSubmitBatch operation', async (done) => {
      // Simulate real op size
      mockForger.forge.mockResolvedValue(new Array(93).fill('aa').join(''));
      mockRpcClient.runOperation.mockResolvedValue(txRollupSubmitBatchNoReveal);
      const estimate = await estimateProvider.txRollupSubmitBatch({
        rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
        content: '626c6f62',
      });
      expect(estimate).toMatchObject({
        gasLimit: 2869,
        storageLimit: 0,
        suggestedFeeMutez: 580,
      });
      done();
    });

    it('should throw an error if account is unrevealed', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      mockRpcClient.runOperation.mockResolvedValue(txRollupSubmitBatchWithReveal);
      try {
        await estimateProvider.txRollupSubmitBatch({
          rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
          content: '626c6f62',
        });
      } catch (e) {
        expect(e.message).toEqual(
          'Unable to estimate the reveal operation, the public key is unknown'
        );
      }
      done();
    });
  });

  describe('smartRollupAddMessages', () => {
    it('should return the correct estimate for smartRollupAddMessages op', async (done) => {
      mockRpcClient.runOperation.mockResolvedValue(smartRollupAddMessagesNoReveal);
      const estimate = await estimateProvider.smartRollupAddMessages({
        message: [
          '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
        ],
      });

      expect(estimate.gasLimit).toEqual(1103);
      expect(estimate.storageLimit).toEqual(0);
      expect(estimate.suggestedFeeMutez).toEqual(313);
      done();
    });

    it('should return an error if account is unrevealed', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);

      try {
        await estimateProvider.smartRollupAddMessages({
          message: [
            '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
          ],
        });
      } catch (e) {
        expect(e.message).toEqual(
          'Unable to estimate the reveal operation, the public key is unknown'
        );
      }
      done();
    });
  });

  describe('smartRollupOriginate', () => {
    it('Should return the correct estimate for SmartRollupOriginate operation', async (done) => {
      mockRpcClient.getConstants.mockResolvedValue({
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_storage_limit_per_operation: new BigNumber(60000),
        hard_gas_limit_per_block: new BigNumber(5200000),
        cost_per_byte: new BigNumber(1000),
        smart_rollup_origination_size: new BigNumber(6314),
      });
      mockRpcClient.runOperation.mockResolvedValue(smartRollupOriginateWithReveal);
      mockRpcClient.getOriginationProof.mockResolvedValue('987654321');

      const estimate = await estimateProvider.smartRollupOriginate({
        pvmKind: PvmKind.WASM2,
        kernel:
          '0061736d0100000001280760037f7f7f017f60027f7f017f60057f7f7f7f7f017f60017f0060017f017f60027f7f0060000002610311736d6172745f726f6c6c75705f636f72650a726561645f696e707574000011736d6172745f726f6c6c75705f636f72650c77726974655f6f7574707574000111736d6172745f726f6c6c75705f636f72650b73746f72655f77726974650002030504030405060503010001071402036d656d02000a6b65726e656c5f72756e00060aa401042a01027f41fa002f0100210120002f010021022001200247044041e4004112410041e400410010021a0b0b0800200041c4006b0b5001057f41fe002d0000210341fc002f0100210220002d0000210420002f0100210520011004210620042003460440200041016a200141016b10011a0520052002460440200041076a200610011a0b0b0b1d01017f41dc0141840241901c100021004184022000100541840210030b0b38050041e4000b122f6b65726e656c2f656e762f7265626f6f740041f8000b0200010041fa000b0200020041fc000b0200000041fe000b0101',
        parametersType: {
          prim: 'bytes',
        },
      });
      expect(estimate.gasLimit).toEqual(3849);
      expect(estimate.storageLimit).toEqual(6552);
      expect(estimate.suggestedFeeMutez).toEqual(651);

      expect(estimate).toMatchObject({
        gasLimit: 3849,
        storageLimit: 6552,
        suggestedFeeMutez: 651,
        minimalFeeMutez: 551,
      });
      done();
    });
  });
});
