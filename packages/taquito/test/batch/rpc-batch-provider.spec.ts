import {
  InvalidAddressError,
  InvalidAmountError,
  InvalidKeyHashError,
  InvalidOperationKindError,
  InvalidProofError,
  ProhibitedActionError,
} from '@taquito/core';
import type { Forger } from '@taquito/local-forging';
import { PvmKind } from '@taquito/rpc';
import {
  BATCH_KINDS,
  OperationBatch,
  RPCBatchProvider,
} from '../../src/batch/rpc-batch-provider';
import { Context } from '../../src/context';
import { Estimate } from '../../src/estimate/estimate';
import { OpKind, ParamsWithKind } from '../../src/operations/types';
import BigNumber from 'bignumber.js';

/**
 * OperationBatch test
 */
describe('OperationBatch test', () => {
  let context: Context;
  let operationBatch: OperationBatch;
  let mockRpcClient: {
    getScript: ReturnType<typeof vi.fn>;
    getStorage: ReturnType<typeof vi.fn>;
    getBigMapExpr: ReturnType<typeof vi.fn>;
    getBlockHeader: ReturnType<typeof vi.fn>;
    getEntrypoints: ReturnType<typeof vi.fn>;
    getManagerKey: ReturnType<typeof vi.fn>;
    getBlock: ReturnType<typeof vi.fn>;
    getContract: ReturnType<typeof vi.fn>;
    getBlockMetadata: ReturnType<typeof vi.fn>;
    injectOperation: ReturnType<typeof vi.fn>;
    packData: ReturnType<typeof vi.fn>;
    preapplyOperations: ReturnType<typeof vi.fn>;
    getChainId: ReturnType<typeof vi.fn>;
    getSaplingDiffById: ReturnType<typeof vi.fn>;
    getProtocols: ReturnType<typeof vi.fn>;
  };

  let mockReadProvider: {
    getBlockHash: ReturnType<typeof vi.fn>;
    getNextProtocol: ReturnType<typeof vi.fn>;
    getCounter: ReturnType<typeof vi.fn>;
    getProtocolConstants: ReturnType<typeof vi.fn>;
    getBalance: ReturnType<typeof vi.fn>;
    getSpendable: ReturnType<typeof vi.fn>;
    isAccountRevealed: ReturnType<typeof vi.fn>;
    getChainId: ReturnType<typeof vi.fn>;
  };

  let mockSigner: {
    publicKeyHash: ReturnType<typeof vi.fn>;
    publicKey: ReturnType<typeof vi.fn>;
    sign: ReturnType<typeof vi.fn>;
  };

  let mockEstimate: {
    originate: ReturnType<typeof vi.fn>;
    transfer: ReturnType<typeof vi.fn>;
    setDelegate: ReturnType<typeof vi.fn>;
    registerDelegate: ReturnType<typeof vi.fn>;
    batch: ReturnType<typeof vi.fn>;
    reveal: ReturnType<typeof vi.fn>;
    registerGlobalConstant: ReturnType<typeof vi.fn>;
  };

  let mockForger: {
    forge: ReturnType<typeof vi.fn<Forger['forge']>>;
  };

  beforeEach(() => {
    mockRpcClient = {
      getBigMapExpr: vi.fn(),
      getEntrypoints: vi.fn(),
      getBlock: vi.fn(),
      getScript: vi.fn(),
      getManagerKey: vi.fn(),
      getStorage: vi.fn(),
      getBlockHeader: vi.fn(),
      getBlockMetadata: vi.fn(),
      getContract: vi.fn(),
      injectOperation: vi.fn(),
      packData: vi.fn(),
      preapplyOperations: vi.fn(),
      getChainId: vi.fn(),
      getSaplingDiffById: vi.fn(),
      getProtocols: vi.fn(),
    };

    mockSigner = {
      publicKeyHash: vi.fn(),
      publicKey: vi.fn(),
      sign: vi.fn(),
    };

    mockReadProvider = {
      getBlockHash: vi.fn(),
      getNextProtocol: vi.fn(),
      getCounter: vi.fn(),
      getProtocolConstants: vi.fn(),
      getBalance: vi.fn(),
      getSpendable: vi.fn(),
      isAccountRevealed: vi.fn(),
      getChainId: vi.fn(),
    };

    mockEstimate = {
      originate: vi.fn(),
      transfer: vi.fn(),
      registerDelegate: vi.fn(),
      setDelegate: vi.fn(),
      batch: vi.fn(),
      reveal: vi.fn(),
      registerGlobalConstant: vi.fn(),
    };

    mockForger = {
      forge: vi.fn(),
    };

    // Required for operations confirmation polling
    mockRpcClient.getBlock.mockResolvedValue({
      operations: [[], [], [], []],
      header: {
        level: 0,
      },
    });

    mockRpcClient.getContract.mockResolvedValue({ counter: 123456 });
    mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
    mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
    mockRpcClient.getProtocols.mockResolvedValue({ next_protocol: 'test_proto' });
    mockRpcClient.getManagerKey.mockResolvedValue('test');
    mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
    mockSigner.publicKey.mockResolvedValue('test_pub_key');
    mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
    mockRpcClient.preapplyOperations.mockResolvedValue([]);
    mockRpcClient.getChainId.mockResolvedValue('chain-id');
    mockRpcClient.injectOperation.mockResolvedValue(
      'onwtjK2Q32ndjF9zbEPPtmifdBq5qB59wjMP2oCH22mARjyKnGP'
    );

    mockReadProvider.getProtocolConstants.mockResolvedValue({
      hard_gas_limit_per_operation: new BigNumber('1040000'),
      hard_gas_limit_per_block: new BigNumber('5200000'),
      cost_per_byte: new BigNumber('250'),
      hard_storage_limit_per_operation: new BigNumber('60000'),
      minimal_block_delay: new BigNumber('30'),
      time_between_blocks: [new BigNumber('60'), new BigNumber('40')],
    });
    mockReadProvider.getBalance.mockResolvedValue(new BigNumber('10000000000'));
    mockReadProvider.getNextProtocol.mockResolvedValue('test_proto');
    mockReadProvider.getBlockHash.mockResolvedValue('test');

    context = new Context(mockRpcClient as any, mockSigner as any);
    context.readProvider = mockReadProvider as any;
    context.forger = mockForger;
    operationBatch = new OperationBatch(context, mockEstimate as any);
  });

  describe('withRegisterGlobalConstant', () => {
    it('should produce a batch operation which contains a registerGlobalConstant operation', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);
      const batchOp = await operationBatch
        .withRegisterGlobalConstant({ value: { int: '2' } })
        .send();
      expect(batchOp.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              value: { int: '2' },
              counter: '1',
              fee: '385',
              gas_limit: '1230',
              kind: 'register_global_constant',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('should produce a batch operation which contains a registerGlobalConstant operation where fee, gas limit and storage limit are specified by the user', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);
      const batchOp = await operationBatch
        .withRegisterGlobalConstant({
          value: { int: '2' },
          fee: 500,
          gasLimit: 1400,
          storageLimit: 100,
        })
        .send();

      expect(batchOp.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              value: { int: '2' },
              counter: '1',
              fee: '500',
              gas_limit: '1400',
              kind: 'register_global_constant',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '100',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('should produce a batch operation which contains a reveal and a registerGlobalConstant operation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const estimateReveal = new Estimate(1000000, 0, 64, 250);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimateReveal, estimate]);

      const batchOp = await operationBatch
        .withRegisterGlobalConstant({ value: { int: '2' } })
        .send();
      expect(batchOp.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '1',
              fee: '334',
              gas_limit: '633',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '0',
            },
            {
              value: { int: '2' },
              counter: '2',
              fee: '385',
              gas_limit: '1230',
              kind: 'register_global_constant',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });
  });

  describe('with registerGlobalConstant operation', () => {
    it('should produce a batch operation which contains a registerGlobalConstant operation', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.REGISTER_GLOBAL_CONSTANT,
          value: { string: 'test' },
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();
      expect(batchOp.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              value: { string: 'test' },
              counter: '1',
              fee: '385',
              gas_limit: '1230',
              kind: 'register_global_constant',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('should produce a batch operation which contains a registerGlobalConstant operation where fee, gas limit and storage limit are specified by the user', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.REGISTER_GLOBAL_CONSTANT,
          value: { string: 'test' },
          fee: 500,
          gasLimit: 1400,
          storageLimit: 100,
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();
      expect(batchOp.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              value: { string: 'test' },
              counter: '1',
              fee: '500',
              gas_limit: '1400',
              kind: 'register_global_constant',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '100',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('should produce a batch operation which contains a reveal and a registerGlobalConstant operation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const estimateReveal = new Estimate(1000000, 0, 64, 250);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimateReveal, estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.REGISTER_GLOBAL_CONSTANT,
          value: { string: 'test' },
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '1',
              fee: '334',
              gas_limit: '633',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '0',
            },
            {
              value: { string: 'test' },
              counter: '2',
              fee: '385',
              gas_limit: '1230',
              kind: 'register_global_constant',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });
  });

  describe('withIncreasePaidStorage batch operation', () => {
    it('should produce an operation batch which contains an increasePaidStorage operation', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.INCREASE_PAID_STORAGE,
          amount: 1,
          destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();
      expect(batchOp.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'increase_paid_storage',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '385',
              gas_limit: '1230',
              storage_limit: '93',
              amount: '1',
              destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('should produce an operation batch which contains a reveal and an increasePaidStorage operation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const estimateReveal = new Estimate(1000000, 0, 64, 250);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimateReveal, estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.INCREASE_PAID_STORAGE,
          amount: 1,
          destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '1',
              fee: '334',
              gas_limit: '633',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '0',
            },
            {
              kind: 'increase_paid_storage',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '385',
              gas_limit: '1230',
              storage_limit: '93',
              amount: '1',
              destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });

    it('should produce a batch operation which contants an increasePaidStorage operation where fee, gas limit, and storage limit are specified by the user', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.INCREASE_PAID_STORAGE,
          fee: 500,
          gasLimit: 1400,
          storageLimit: 100,
          amount: 1,
          destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();
      expect(batchOp.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'increase_paid_storage',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '500',
              gas_limit: '1400',
              storage_limit: '100',
              amount: '1',
              destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
    });
  });

  describe('withSmartRollupAddMessages op', () => {
    it('should produce a batch op which contains a smartRollupAddMessages operation', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.SMART_ROLLUP_ADD_MESSAGES,
          message: [
            '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
          ],
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'smart_rollup_add_messages',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '385',
              gas_limit: '1230',
              storage_limit: '93',
              message: [
                '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
              ],
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce a batch op with estimate values overridden', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.SMART_ROLLUP_ADD_MESSAGES,
          message: [
            '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
          ],
          gasLimit: 1100,
          fee: 399,
          storageLimit: 95,
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'smart_rollup_add_messages',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '399',
              gas_limit: '1100',
              storage_limit: '95',
              message: [
                '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
              ],
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce a batch op with reveal operation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const estimateReveal = new Estimate(1000000, 0, 64, 250);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimateReveal, estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.SMART_ROLLUP_ADD_MESSAGES,
          message: [
            '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
          ],
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'reveal',
              fee: '334',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '633',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'smart_rollup_add_messages',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '385',
              gas_limit: '1230',
              storage_limit: '93',
              message: [
                '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
              ],
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });

  describe('withSmartRollupOriginate op', () => {
    it('should produce a batch op without reveal', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.SMART_ROLLUP_ORIGINATE,
          pvmKind: PvmKind.WASM2,
          kernel: '1234567890',
          parametersType: { prim: 'bytes' },
        },
      ];
      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'smart_rollup_originate',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '385',
              gas_limit: '1230',
              storage_limit: '93',
              kernel: '1234567890',
              parameters_ty: { prim: 'bytes' },
              pvm_kind: 'wasm_2_0_0',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce a batch op with estimate values overridden', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.SMART_ROLLUP_ORIGINATE,
          pvmKind: PvmKind.WASM2,
          kernel: '1234567890',
          parametersType: { prim: 'bytes' },
          gasLimit: 1100,
          fee: 399,
          storageLimit: 95,
        },
      ];
      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'smart_rollup_originate',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '399',
              gas_limit: '1100',
              storage_limit: '95',
              kernel: '1234567890',
              parameters_ty: { prim: 'bytes' },
              pvm_kind: 'wasm_2_0_0',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce a batch op with reveal', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const estimateReveal = new Estimate(1000000, 0, 64, 250);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimateReveal, estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.SMART_ROLLUP_ORIGINATE,
          pvmKind: PvmKind.WASM2,
          kernel: '1234567890',
          parametersType: { prim: 'bytes' },
        },
      ];
      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'reveal',
              fee: '334',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '633',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'smart_rollup_originate',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '385',
              gas_limit: '1230',
              storage_limit: '93',
              kernel: '1234567890',
              parameters_ty: { prim: 'bytes' },
              pvm_kind: 'wasm_2_0_0',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });

  describe('withSmartRollupExecuteOutboxMessage op', () => {
    it('should produce a batch op without reveal', async () => {
      const estimate = new Estimate(6385000, 36, 769, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
          rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
          cementedCommitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
          outputProof:
            '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736120555f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
        },
      ];
      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'smart_rollup_execute_outbox_message',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '1528',
              gas_limit: '6385',
              storage_limit: '36',
              rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
              cemented_commitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
              output_proof:
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736120555f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce a batch op with reveal operation', async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const estimateReveal = new Estimate(1000000, 0, 64, 250);
      const estimate = new Estimate(6385000, 36, 769, 250);
      mockEstimate.batch.mockResolvedValue([estimateReveal, estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
          rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
          cementedCommitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
          outputProof:
            '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736120555f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'reveal',
              fee: '334',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '633',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'smart_rollup_execute_outbox_message',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '1528',
              gas_limit: '6385',
              storage_limit: '36',
              rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
              cemented_commitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
              output_proof:
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736120555f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              counter: '2',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });

    it('should produce a batch op with overridden estimate values', async () => {
      const estimate = new Estimate(6385000, 36, 769, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
          rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
          cementedCommitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
          outputProof:
            '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736120555f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
          fee: 2000,
          gasLimit: 10000,
          storageLimit: 100,
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        opbytes: 'test',
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'smart_rollup_execute_outbox_message',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '2000',
              gas_limit: '10000',
              storage_limit: '100',
              rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
              cemented_commitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
              output_proof:
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736120555f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              counter: '1',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 0,
      });
    });
  });
  it('sends all wallet rollup kinds through the default legacy provider and RPC batch', async () => {
    vi.spyOn(context.estimate, 'batch').mockResolvedValue([
      new Estimate(1000000, 0, 100, 250),
      new Estimate(1000000, 0, 100, 250),
      new Estimate(1000000, 0, 100, 250),
    ]);
    context.readProvider = {
      ...context.readProvider,
      getBlockLevel: async () => 100,
      getBlock: async () => {
        throw new Error('End controlled polling');
      },
    };
    mockReadProvider.isAccountRevealed.mockResolvedValue(true);
    mockForger.forge.mockResolvedValue('00');
    const operation = await context.wallet
      .batch()
      .withSmartRollupAddMessages({ message: ['00'] })
      .withSmartRollupOriginate({
        pvmKind: PvmKind.WASM2,
        kernel: '00',
        parametersType: { prim: 'bytes' },
      })
      .withSmartRollupExecuteOutboxMessage({
        rollup: 'sr1-rollup',
        cementedCommitment: 'src1-commitment',
        outputProof: '00ff',
      })
      .send();
    expect(operation.opHash).toBe('onwtjK2Q32ndjF9zbEPPtmifdBq5qB59wjMP2oCH22mARjyKnGP');
    expect(mockForger.forge).toHaveBeenCalledWith(
      expect.objectContaining({
        contents: [
          expect.objectContaining({
            kind: OpKind.SMART_ROLLUP_ADD_MESSAGES,
            message: ['00'],
            source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
            counter: '1',
          }),
          expect.objectContaining({
            kind: OpKind.SMART_ROLLUP_ORIGINATE,
            pvm_kind: 'wasm_2_0_0',
            kernel: '00',
            parameters_ty: { prim: 'bytes' },
            counter: '2',
          }),
          expect.objectContaining({
            kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
            rollup: 'sr1-rollup',
            cemented_commitment: 'src1-commitment',
            output_proof: '00ff',
            counter: '3',
          }),
        ],
      })
    );
    expect(mockRpcClient.injectOperation).toHaveBeenCalledExactlyOnceWith('test');
  });

  describe('withTransfer and withContractCall', () => {
    it('adds a transfer operation via withTransfer and via with()', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate, estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const batchOp = await operationBatch
        .withTransfer({
          to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          amount: 2,
        })
        .with([
          {
            kind: OpKind.TRANSACTION,
            to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
            amount: 0,
          },
        ])
        .send({ source: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu' });

      expect(batchOp.source).toBe('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu');
      expect(batchOp.raw.opOb.contents).toEqual([
        expect.objectContaining({
          kind: OpKind.TRANSACTION,
          destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          amount: '2000000',
          counter: '1',
        }),
        expect.objectContaining({
          kind: OpKind.TRANSACTION,
          destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          amount: '0',
          counter: '2',
        }),
      ]);
    });

    it('rejects negative transfer amounts with InvalidAmountError', () => {
      expect(() =>
        operationBatch.withTransfer({
          to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          amount: -1,
        })
      ).toThrowError(InvalidAmountError);
    });

    it('rejects invalid recipient addresses with InvalidAddressError', () => {
      expect(() =>
        operationBatch.withTransfer({
          to: 'tz1invalid',
          amount: 1,
        })
      ).toThrowError(InvalidAddressError);
    });

    it('delegates withContractCall to withTransfer using toTransferParams', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const toTransferParams = vi.fn().mockReturnValue({
        to: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        amount: 5,
        parameter: { entrypoint: 'default', value: { prim: 'Unit' } },
      });

      const contractMethod = {
        toTransferParams,
      } as unknown as Parameters<OperationBatch['withContractCall']>[0];
      const batchOp = await operationBatch.withContractCall(contractMethod, { amount: 5 }).send();

      expect(toTransferParams).toHaveBeenCalledWith({ amount: 5 });
      expect(batchOp.raw.opOb.contents).toEqual([
        expect.objectContaining({
          kind: OpKind.TRANSACTION,
          destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
          amount: '5000000',
        }),
      ]);
    });
  });

  describe('withTransferTicket', () => {
    const validTransferTicketParams = {
      ticketContents: { string: 'foobar' },
      ticketTy: { prim: 'string' },
      ticketTicketer: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
      ticketAmount: 2,
      destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
      entrypoint: 'default',
    };

    it('adds a transfer_ticket operation via withTransferTicket and via with()', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate, estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const batchOp = await operationBatch
        .withTransferTicket(validTransferTicketParams)
        .with([{ kind: OpKind.TRANSFER_TICKET, ...validTransferTicketParams }])
        .send();

      expect(batchOp.raw.opOb.contents).toEqual([
        expect.objectContaining({
          kind: OpKind.TRANSFER_TICKET,
          destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
          ticket_amount: '2',
          counter: '1',
        }),
        expect.objectContaining({
          kind: OpKind.TRANSFER_TICKET,
          destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
          ticket_amount: '2',
          counter: '2',
        }),
      ]);
    });

    it('rejects invalid destination addresses with InvalidAddressError', () => {
      expect(() =>
        operationBatch.withTransferTicket({
          ...validTransferTicketParams,
          destination: 'KT1invalid',
        })
      ).toThrowError(InvalidAddressError);
    });
  });

  describe('withDelegation', () => {
    it('adds delegation and clear-delegation operations via withDelegation and via with()', async () => {
      const estimate = new Estimate(1230000, 0, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate, estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const batchOp = await operationBatch
        .withDelegation({
          source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
          delegate: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        })
        .with([{ kind: OpKind.DELEGATION }])
        .send();

      expect(batchOp.raw.opOb.contents).toEqual([
        expect.objectContaining({
          kind: OpKind.DELEGATION,
          source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
          delegate: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          counter: '1',
        }),
        expect.objectContaining({
          kind: OpKind.DELEGATION,
          source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
          delegate: undefined,
          counter: '2',
        }),
      ]);
    });

    it('rejects invalid source or delegate addresses with InvalidAddressError', () => {
      expect(() =>
        operationBatch.withDelegation({
          source: 'tz1invalid',
          delegate: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        })
      ).toThrowError(InvalidAddressError);

      expect(() =>
        operationBatch.withDelegation({
          delegate: 'tz1invalid',
        })
      ).toThrowError(InvalidAddressError);
    });
  });

  describe('withActivation and withOrigination', () => {
    it('adds activation and origination operations via builder methods and via with()', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate, estimate, estimate, estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const originationParams = {
        code: [
          { prim: 'parameter', args: [{ prim: 'unit' }] },
          { prim: 'storage', args: [{ prim: 'unit' }] },
          {
            prim: 'code',
            args: [[{ prim: 'CDR' }, { prim: 'NIL', args: [{ prim: 'operation' }] }, { prim: 'PAIR' }]],
          },
        ],
        init: { prim: 'Unit' },
      };

      const batchOp = await operationBatch
        .withActivation({
          pkh: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          secret: '0123456789abcdef',
        })
        .withOrigination(originationParams)
        .with([
          {
            kind: OpKind.ACTIVATION,
            pkh: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
            secret: 'fedcba9876543210',
          },
          {
            kind: OpKind.ORIGINATION,
            ...originationParams,
          },
        ])
        .send();

      expect(batchOp.raw.opOb.contents).toEqual([
        {
          kind: OpKind.ACTIVATION,
          pkh: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          secret: '0123456789abcdef',
        },
        expect.objectContaining({
          kind: OpKind.ORIGINATION,
          counter: '1',
        }),
        {
          kind: OpKind.ACTIVATION,
          pkh: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
          secret: 'fedcba9876543210',
        },
        expect.objectContaining({
          kind: OpKind.ORIGINATION,
          counter: '2',
        }),
      ]);
    });

    it('supports direct withIncreasePaidStorage builder call', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const batchOp = await operationBatch
        .withIncreasePaidStorage({
          amount: 2,
          destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        })
        .send();

      expect(batchOp.raw.opOb.contents).toEqual([
        expect.objectContaining({
          kind: OpKind.INCREASE_PAID_STORAGE,
          amount: '2',
          destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        }),
      ]);
    });

    it('rejects invalid activation pkh with InvalidKeyHashError', () => {
      expect(() =>
        operationBatch.withActivation({
          pkh: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
          secret: '0123456789abcdef',
        })
      ).toThrowError(InvalidKeyHashError);
    });
  });

  describe('withUpdateConsensusKey and withUpdateCompanionKey', () => {
    const edpk = 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7';
    const blpk = 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt';
    const blsProof =
      'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx';

    it('includes UPDATE_CONSENSUS_KEY and UPDATE_COMPANION_KEY in BATCH_KINDS', () => {
      expect(BATCH_KINDS).toContain(OpKind.UPDATE_CONSENSUS_KEY);
      expect(BATCH_KINDS).toContain(OpKind.UPDATE_COMPANION_KEY);
    });

    it('adds update_consensus_key (edpk and BLpk) and update_companion_key via builder methods and via with()', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate, estimate, estimate, estimate, estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const batchOp = await operationBatch
        .withUpdateConsensusKey({ pk: edpk })
        .withUpdateConsensusKey({ pk: blpk, proof: blsProof })
        .withUpdateCompanionKey({ pk: blpk, proof: blsProof })
        .with([
          { kind: OpKind.UPDATE_CONSENSUS_KEY, pk: edpk },
          { kind: OpKind.UPDATE_COMPANION_KEY, pk: blpk, proof: blsProof },
        ])
        .send();

      expect(batchOp.raw.opOb.contents).toEqual([
        expect.objectContaining({
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          pk: edpk,
          counter: '1',
        }),
        expect.objectContaining({
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          pk: blpk,
          proof: blsProof,
          counter: '2',
        }),
        expect.objectContaining({
          kind: OpKind.UPDATE_COMPANION_KEY,
          pk: blpk,
          proof: blsProof,
          counter: '3',
        }),
        expect.objectContaining({
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          pk: edpk,
          counter: '4',
        }),
        expect.objectContaining({
          kind: OpKind.UPDATE_COMPANION_KEY,
          pk: blpk,
          proof: blsProof,
          counter: '5',
        }),
      ]);
    });

    it('validates proof and key prefix constraints for withUpdateConsensusKey', () => {
      expect(() => operationBatch.withUpdateConsensusKey({ pk: blpk })).toThrowError(
        InvalidProofError
      );
      expect(() =>
        operationBatch.withUpdateConsensusKey({ pk: edpk, proof: blsProof })
      ).toThrowError(ProhibitedActionError);
    });

    it('validates proof and key prefix constraints for withUpdateCompanionKey', () => {
      expect(() =>
        operationBatch.withUpdateCompanionKey({ pk: edpk, proof: blsProof })
      ).toThrowError(ProhibitedActionError);
      expect(() => operationBatch.withUpdateCompanionKey({ pk: blpk })).toThrowError(
        InvalidProofError
      );
    });
  });

  describe('with() error handling and RPCBatchProvider', () => {
    it('throws InvalidOperationKindError when with() receives an unsupported operation kind', () => {
      expect(() =>
        operationBatch.with([
          {
            kind: OpKind.FAILING_NOOP,
            arbitrary: 'deadbeef',
            basedOnBlock: 'head',
          },
        ])
      ).toThrowError(new InvalidOperationKindError('"failing_noop"'));
    });

    it('creates an empty or pre-populated OperationBatch via RPCBatchProvider.batch()', async () => {
      const provider = new RPCBatchProvider(
        context,
        mockEstimate as unknown as ConstructorParameters<typeof RPCBatchProvider>[1]
      );
      expect(provider.batch()).toBeInstanceOf(OperationBatch);

      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const batchOp = await provider
        .batch([
          {
            kind: OpKind.TRANSACTION,
            to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
            amount: 1,
          },
        ])
        .send();

      expect(batchOp.raw.opOb.contents).toEqual([
        expect.objectContaining({
          kind: OpKind.TRANSACTION,
          destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
          amount: '1000000',
        }),
      ]);
    });
  });
});
