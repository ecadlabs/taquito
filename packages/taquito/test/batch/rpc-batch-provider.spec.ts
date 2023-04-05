import { PvmKind } from '@taquito/rpc';
import { OperationBatch } from '../../src/batch/rpc-batch-provider';
import { Context } from '../../src/context';
import { Estimate } from '../../src/estimate/estimate';
import { OpKind, ParamsWithKind } from '../../src/operations/types';

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
    mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
    mockRpcClient.preapplyOperations.mockResolvedValue([]);
    mockRpcClient.getChainId.mockResolvedValue('chain-id');
    mockRpcClient.injectOperation.mockResolvedValue(
      'onwtjK2Q32ndjF9zbEPPtmifdBq5qB59wjMP2oCH22mARjyKnGP'
    );

    context = new Context(mockRpcClient as any, mockSigner as any);
    context.forger = mockForger;
    operationBatch = new OperationBatch(context, mockEstimate as any);
  });

  describe('withRegisterGlobalConstant', () => {
    it('should produce a batch operation which contains a registerGlobalConstant operation', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const batchOp = await operationBatch
        .withRegisterGlobalConstant({ value: { int: '2' } })
        .send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              value: { int: '2' },
              counter: '123457',
              fee: '475',
              gas_limit: '1330',
              kind: 'register_global_constant',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains a registerGlobalConstant operation where fee, gas limit and storage limit are specified by the user', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const batchOp = await operationBatch
        .withRegisterGlobalConstant({
          value: { int: '2' },
          fee: 500,
          gasLimit: 1400,
          storageLimit: 100,
        })
        .send();

      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              value: { int: '2' },
              counter: '123457',
              fee: '500',
              gas_limit: '1400',
              kind: 'register_global_constant',
              source: 'test_pub_key_hash',
              storage_limit: '100',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains a reveal and a registerGlobalConstant operation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const estimateReveal = new Estimate(1000000, 0, 64, 250);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimateReveal, estimate]);

      const batchOp = await operationBatch
        .withRegisterGlobalConstant({ value: { int: '2' } })
        .send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '123457',
              fee: '374',
              gas_limit: '1100',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              storage_limit: '0',
            },
            {
              value: { int: '2' },
              counter: '123458',
              fee: '475',
              gas_limit: '1330',
              kind: 'register_global_constant',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });
  });

  describe('withTxRollupOrigination', () => {
    it('should produce a batch operation which contains an txRollupOriginate operation', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const batchOp = await operationBatch.withTxRollupOrigination().send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              tx_rollup_origination: {},
              counter: '123457',
              fee: '475',
              gas_limit: '1330',
              kind: 'tx_rollup_origination',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains an txRollupOriginate operation where fee, gas limit and storage limit are specified by the user', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const batchOp = await operationBatch
        .withTxRollupOrigination({
          fee: 500,
          gasLimit: 1400,
          storageLimit: 100,
        })
        .send();

      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              tx_rollup_origination: {},
              counter: '123457',
              fee: '500',
              gas_limit: '1400',
              kind: 'tx_rollup_origination',
              source: 'test_pub_key_hash',
              storage_limit: '100',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains a reveal and a txRollupOriginate operation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const estimateReveal = new Estimate(1000000, 0, 64, 250);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimateReveal, estimate]);

      const batchOp = await operationBatch.withTxRollupOrigination().send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '123457',
              fee: '374',
              gas_limit: '1100',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              storage_limit: '0',
            },
            {
              tx_rollup_origination: {},
              counter: '123458',
              fee: '475',
              gas_limit: '1330',
              kind: 'tx_rollup_origination',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });
  });

  describe('withTxRollupSubmitBatch', () => {
    it('should produce a batch operation which contains a tx rollup submit batch operation', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const batchOp = await operationBatch
        .withTxRollupSubmitBatch({
          content: '00',
          rollup: 'txr1RHjM395hdwNfgpM8GixQrPAimk7i2Tjy1',
        })
        .send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              content: '00',
              rollup: 'txr1RHjM395hdwNfgpM8GixQrPAimk7i2Tjy1',
              counter: '123457',
              fee: '475',
              gas_limit: '1330',
              kind: 'tx_rollup_submit_batch',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains a tx rollup submit batch operation where fee, gas limit and storage limit are specified by the user', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const batchOp = await operationBatch
        .withTxRollupSubmitBatch({
          content: '00',
          rollup: 'txr1RHjM395hdwNfgpM8GixQrPAimk7i2Tjy1',
          fee: 500,
          gasLimit: 1400,
          storageLimit: 100,
        })
        .send();

      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              content: '00',
              rollup: 'txr1RHjM395hdwNfgpM8GixQrPAimk7i2Tjy1',
              counter: '123457',
              fee: '500',
              gas_limit: '1400',
              kind: 'tx_rollup_submit_batch',
              source: 'test_pub_key_hash',
              storage_limit: '100',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains a reveal and a tx rollup submit batch operation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const estimateReveal = new Estimate(1000000, 0, 64, 250);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimateReveal, estimate]);

      const batchOp = await operationBatch
        .withTxRollupSubmitBatch({
          content: '00',
          rollup: 'txr1RHjM395hdwNfgpM8GixQrPAimk7i2Tjy1',
        })
        .send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '123457',
              fee: '374',
              gas_limit: '1100',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              storage_limit: '0',
            },
            {
              content: '00',
              rollup: 'txr1RHjM395hdwNfgpM8GixQrPAimk7i2Tjy1',
              counter: '123458',
              fee: '475',
              gas_limit: '1330',
              kind: 'tx_rollup_submit_batch',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });
  });

  describe('with registerGlobalConstant operation', () => {
    it('should produce a batch operation which contains a registerGlobalConstant operation', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.REGISTER_GLOBAL_CONSTANT,
          value: { string: 'test' },
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              value: { string: 'test' },
              counter: '123457',
              fee: '475',
              gas_limit: '1330',
              kind: 'register_global_constant',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains a registerGlobalConstant operation where fee, gas limit and storage limit are specified by the user', async (done) => {
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
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              value: { string: 'test' },
              counter: '123457',
              fee: '500',
              gas_limit: '1400',
              kind: 'register_global_constant',
              source: 'test_pub_key_hash',
              storage_limit: '100',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains a reveal and a registerGlobalConstant operation', async (done) => {
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
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '123457',
              fee: '374',
              gas_limit: '1100',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              storage_limit: '0',
            },
            {
              value: { string: 'test' },
              counter: '123458',
              fee: '475',
              gas_limit: '1330',
              kind: 'register_global_constant',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });
  });

  describe('withIncreasePaidStorage batch operation', () => {
    it('should produce an operation batch which contains an increasePaidStorage operation', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.INCREASE_PAID_STORAGE,
          amount: 1,
          destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'increase_paid_storage',
              source: 'test_pub_key_hash',
              fee: '475',
              gas_limit: '1330',
              storage_limit: '93',
              amount: '1',
              destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
              counter: '123457',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce an operation batch which contains a reveal and an increasePaidStorage operation', async (done) => {
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
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '123457',
              fee: '374',
              gas_limit: '1100',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              storage_limit: '0',
            },
            {
              kind: 'increase_paid_storage',
              source: 'test_pub_key_hash',
              fee: '475',
              gas_limit: '1330',
              storage_limit: '93',
              amount: '1',
              destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
              counter: '123458',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contants an increasePaidStorage operation where fee, gas limit, and storage limit are specified by the user', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

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
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              kind: 'increase_paid_storage',
              source: 'test_pub_key_hash',
              fee: '500',
              gas_limit: '1400',
              storage_limit: '100',
              amount: '1',
              destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
              counter: '123457',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });
  });

  describe('withSmartRollupAddMessage op', () => {
    it('should produce a batch op which contains a smartRollupAddMessages operation', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

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
              source: 'test_pub_key_hash',
              fee: '475',
              gas_limit: '1330',
              storage_limit: '93',
              message: [
                '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
              ],
              counter: '123457',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 123456,
      });
      done();
    });

    it('should produce a batch op with estimate values overridden', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

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
              source: 'test_pub_key_hash',
              fee: '399',
              gas_limit: '1100',
              storage_limit: '95',
              message: [
                '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
              ],
              counter: '123457',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 123456,
      });
      done();
    });

    it('should produce a batch op with reveal operation', async (done) => {
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
              fee: '374',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              gas_limit: '1100',
              storage_limit: '0',
              counter: '123457',
            },
            {
              kind: 'smart_rollup_add_messages',
              source: 'test_pub_key_hash',
              fee: '475',
              gas_limit: '1330',
              storage_limit: '93',
              message: [
                '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
              ],
              counter: '123458',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 123456,
      });

      done();
    });
  });

  describe('withSmartRollupOriginate op', () => {
    it('should produce a batch op without reveal', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.SMART_ROLLUP_ORIGINATE,
          pvmKind: PvmKind.WASM2,
          kernel: '1234567890',
          originationProof: '0987654321',
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
              source: 'test_pub_key_hash',
              fee: '475',
              gas_limit: '1330',
              storage_limit: '93',
              kernel: '1234567890',
              origination_proof: '0987654321',
              parameters_ty: { prim: 'bytes' },
              pvm_kind: 'wasm_2_0_0',
              counter: '123457',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 123456,
      });
    });

    it('should produce a batch op with estimate values overridden', async () => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.SMART_ROLLUP_ORIGINATE,
          pvmKind: PvmKind.WASM2,
          kernel: '1234567890',
          originationProof: '0987654321',
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
              source: 'test_pub_key_hash',
              fee: '399',
              gas_limit: '1100',
              storage_limit: '95',
              kernel: '1234567890',
              origination_proof: '0987654321',
              parameters_ty: { prim: 'bytes' },
              pvm_kind: 'wasm_2_0_0',
              counter: '123457',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 123456,
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
          originationProof: '0987654321',
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
              fee: '374',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              gas_limit: '1100',
              storage_limit: '0',
              counter: '123457',
            },
            {
              kind: 'smart_rollup_originate',
              source: 'test_pub_key_hash',
              fee: '475',
              gas_limit: '1330',
              storage_limit: '93',
              kernel: '1234567890',
              origination_proof: '0987654321',
              parameters_ty: { prim: 'bytes' },
              pvm_kind: 'wasm_2_0_0',
              counter: '123458',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        counter: 123456,
      });
    });
  });

  describe('with txRollupOriginate operation', () => {
    it('should produce a batch operation which contains an txRollupOriginate operation', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.TX_ROLLUP_ORIGINATION,
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              tx_rollup_origination: {},
              counter: '123457',
              fee: '475',
              gas_limit: '1330',
              kind: 'tx_rollup_origination',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains an txRollupOriginate operation where fee, gas limit and storage limit are specified by the user', async (done) => {
      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.TX_ROLLUP_ORIGINATION,
          fee: 500,
          gasLimit: 1400,
          storageLimit: 100,
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              tx_rollup_origination: {},
              counter: '123457',
              fee: '500',
              gas_limit: '1400',
              kind: 'tx_rollup_origination',
              source: 'test_pub_key_hash',
              storage_limit: '100',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains a reveal and a txRollupOriginate operation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const estimateReveal = new Estimate(1000000, 0, 64, 250);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimateReveal, estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.TX_ROLLUP_ORIGINATION,
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '123457',
              fee: '374',
              gas_limit: '1100',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              storage_limit: '0',
            },
            {
              tx_rollup_origination: {},
              counter: '123458',
              fee: '475',
              gas_limit: '1330',
              kind: 'tx_rollup_origination',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });
  });

  describe('with txRollupBatch operation', () => {
    it('should produce a batch operation which contains a txRollupSubmitBatch operation', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.TX_ROLLUP_SUBMIT_BATCH,
          content: '1234',
          rollup: 'txr1ckoTVCU3FHdcW4VotdBha6pYCcA3wpCXi',
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              content: '1234',
              rollup: 'txr1ckoTVCU3FHdcW4VotdBha6pYCcA3wpCXi',
              counter: '123457',
              fee: '475',
              gas_limit: '1330',
              kind: 'tx_rollup_submit_batch',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains a txRollupSubmitBatch operation where fee, gas limit and storage limit are specified by the user', async (done) => {
      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.TX_ROLLUP_SUBMIT_BATCH,
          content: '1234',
          rollup: 'txr1ckoTVCU3FHdcW4VotdBha6pYCcA3wpCXi',
          fee: 500,
          gasLimit: 1400,
          storageLimit: 100,
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();
      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              content: '1234',
              rollup: 'txr1ckoTVCU3FHdcW4VotdBha6pYCcA3wpCXi',
              counter: '123457',
              fee: '500',
              gas_limit: '1400',
              kind: 'tx_rollup_submit_batch',
              source: 'test_pub_key_hash',
              storage_limit: '100',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should produce a batch operation which contains a reveal and a txRollupSubmitBatch operation', async (done) => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);
      const estimateReveal = new Estimate(1000000, 0, 64, 250);
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimateReveal, estimate]);

      const opToBatch: ParamsWithKind[] = [
        {
          kind: OpKind.TX_ROLLUP_SUBMIT_BATCH,
          content: '1234',
          rollup: 'txr1ckoTVCU3FHdcW4VotdBha6pYCcA3wpCXi',
        },
      ];

      const batchOp = await operationBatch.with(opToBatch).send();

      expect(batchOp.raw).toEqual({
        counter: 123456,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '123457',
              fee: '374',
              gas_limit: '1100',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              storage_limit: '0',
            },
            {
              content: '1234',
              rollup: 'txr1ckoTVCU3FHdcW4VotdBha6pYCcA3wpCXi',
              counter: '123458',
              fee: '475',
              gas_limit: '1330',
              kind: 'tx_rollup_submit_batch',
              source: 'test_pub_key_hash',
              storage_limit: '93',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });
  });
});
