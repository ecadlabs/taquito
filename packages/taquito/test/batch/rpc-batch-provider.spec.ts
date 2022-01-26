import { OperationBatch } from '../../src/batch/rpc-batch-provider';
import { Context } from '../../src/context';
import { Estimate } from '../../src/contract/estimate';
import { OpKind, ParamsWithKind } from '../../src/operations/types';

/**
 * OperationBatch test
 */
describe('OperationBatch test', () => {
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
    forgeOperations: jest.Mock<any, any>;
    injectOperation: jest.Mock<any, any>;
    packData: jest.Mock<any, any>;
    preapplyOperations: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
    getSaplingDiffById: jest.Mock<any, any>;
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
      forgeOperations: jest.fn(),
      injectOperation: jest.fn(),
      packData: jest.fn(),
      preapplyOperations: jest.fn(),
      getChainId: jest.fn(),
      getSaplingDiffById: jest.fn(),
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
    mockRpcClient.getManagerKey.mockResolvedValue('test');
    mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
    mockSigner.publicKey.mockResolvedValue('test_pub_key');
    mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
    mockRpcClient.preapplyOperations.mockResolvedValue([]);
    mockRpcClient.getChainId.mockResolvedValue('chain-id');
    mockRpcClient.injectOperation.mockResolvedValue(
      'onwtjK2Q32ndjF9zbEPPtmifdBq5qB59wjMP2oCH22mARjyKnGP'
    );
  });

  describe('withRegisterGlobalConstant', () => {
    it('should produce a batch operation which contains a registerGlobalConstant operation', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const operationBatch = new OperationBatch(
        new Context(mockRpcClient as any, mockSigner as any),
        mockEstimate as any
      );

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

      const operationBatch = new OperationBatch(
        new Context(mockRpcClient as any, mockSigner as any),
        mockEstimate as any
      );

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

      const operationBatch = new OperationBatch(
        new Context(mockRpcClient as any, mockSigner as any),
        mockEstimate as any
      );

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

  describe('with', () => {
    it('should produce a batch operation which contains a registerGlobalConstant operation', async (done) => {
      const estimate = new Estimate(1230000, 93, 142, 250);
      mockEstimate.batch.mockResolvedValue([estimate]);

      const operationBatch = new OperationBatch(
        new Context(mockRpcClient as any, mockSigner as any),
        mockEstimate as any
      );

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
      const operationBatch = new OperationBatch(
        new Context(mockRpcClient as any, mockSigner as any),
        mockEstimate as any
      );

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

      const operationBatch = new OperationBatch(
        new Context(mockRpcClient as any, mockSigner as any),
        mockEstimate as any
      );

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
});
