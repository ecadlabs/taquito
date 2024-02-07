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
              fee: '475',
              gas_limit: '1330',
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
              fee: '276',
              gas_limit: '676',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '0',
            },
            {
              value: { int: '2' },
              counter: '2',
              fee: '475',
              gas_limit: '1330',
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
              fee: '475',
              gas_limit: '1330',
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
              fee: '276',
              gas_limit: '676',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '0',
            },
            {
              value: { string: 'test' },
              counter: '2',
              fee: '475',
              gas_limit: '1330',
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
              fee: '475',
              gas_limit: '1330',
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
              fee: '276',
              gas_limit: '676',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              storage_limit: '0',
            },
            {
              kind: 'increase_paid_storage',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '475',
              gas_limit: '1330',
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

  describe('withSmartRollupAddMessage op', () => {
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
              fee: '475',
              gas_limit: '1330',
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
              fee: '276',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '676',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'smart_rollup_add_messages',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '475',
              gas_limit: '1330',
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
              fee: '475',
              gas_limit: '1330',
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
              fee: '276',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '676',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'smart_rollup_originate',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '475',
              gas_limit: '1330',
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
});
