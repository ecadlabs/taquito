import { PvmKind } from '@taquito/rpc';
import { OperationBatch } from '../../src/batch/rpc-batch-provider';
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
    getScript: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
    getBigMapExpr: jest.Mock<any, any>;
    getBigMapKey: jest.Mock<any, any>;
    getBlockHeader: jest.Mock<any, any>;
    getEntrypoints: jest.Mock<any, any>;
    getManagerKey: jest.Mock<any, any>;
    getBlock: jest.Mock<any, any>;
    getContract: jest.Mock<any, any>;
    getBlockMetadata: jest.Mock<any, any>;
    injectOperation: jest.Mock<any, any>;
    packData: jest.Mock<any, any>;
    preapplyOperations: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
    getSaplingDiffById: jest.Mock<any, any>;
    getProtocols: jest.Mock<any, any>;
  };

  let mockReadProvider: {
    getBlockHash: jest.Mock<any, any>;
    getNextProtocol: jest.Mock<any, any>;
    getCounter: jest.Mock<any, any>;
    getProtocolConstants: jest.Mock<any, any>;
    getBalance: jest.Mock<any, any>;
    getSpendable: jest.Mock<any, any>;
    isAccountRevealed: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
  };

  let mockSigner: {
    publicKeyHash: jest.Mock<any, any>;
    publicKey: jest.Mock<any, any>;
    sign: jest.Mock<any, any>;
  };

  let mockEstimate: {
    originate: jest.Mock<any, any>;
    transfer: jest.Mock<any, any>;
    setDelegate: jest.Mock<any, any>;
    registerDelegate: jest.Mock<any, any>;
    batch: jest.Mock<any, any>;
    reveal: jest.Mock<any, any>;
    registerGlobalConstant: jest.Mock<any, any>;
  };

  let mockForger: {
    forge: jest.Mock<any, any>;
  };

  beforeEach(() => {
    mockRpcClient = {
      getBigMapExpr: jest.fn(),
      getEntrypoints: jest.fn(),
      getBlock: jest.fn(),
      getScript: jest.fn(),
      getManagerKey: jest.fn(),
      getStorage: jest.fn(),
      getBigMapKey: jest.fn(),
      getBlockHeader: jest.fn(),
      getBlockMetadata: jest.fn(),
      getContract: jest.fn(),
      injectOperation: jest.fn(),
      packData: jest.fn(),
      preapplyOperations: jest.fn(),
      getChainId: jest.fn(),
      getSaplingDiffById: jest.fn(),
      getProtocols: jest.fn(),
    };

    mockSigner = {
      publicKeyHash: jest.fn(),
      publicKey: jest.fn(),
      sign: jest.fn(),
    };

    mockReadProvider = {
      getBlockHash: jest.fn(),
      getNextProtocol: jest.fn(),
      getCounter: jest.fn(),
      getProtocolConstants: jest.fn(),
      getBalance: jest.fn(),
      getSpendable: jest.fn(),
      isAccountRevealed: jest.fn(),
      getChainId: jest.fn(),
    };

    mockEstimate = {
      originate: jest.fn(),
      transfer: jest.fn(),
      registerDelegate: jest.fn(),
      setDelegate: jest.fn(),
      batch: jest.fn(),
      reveal: jest.fn(),
      registerGlobalConstant: jest.fn(),
    };

    mockForger = {
      forge: jest.fn(),
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
            '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736163355f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
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
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736163355f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
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
            '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736163355f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
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
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736163355f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
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
            '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736163355f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
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
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736163355f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
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
});
