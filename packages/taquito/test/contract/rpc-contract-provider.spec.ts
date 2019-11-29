import { RpcContractProvider } from '../../src/contract/rpc-contract-provider';
import {
  sample,
  sampleStorage,
  sampleBigMapValue,
  miStr,
  miSample,
  ligoSample,
  tokenInit,
  tokenCode,
} from './data';
import BigNumber from 'bignumber.js';
import { Context } from '../../src/context';
import { LegacyContractMethod, ContractMethod } from '../../src/contract/contract';
import { Estimate } from '../../src/contract/estimate';
import { Protocols } from '../../src/constants';
import { InvalidDelegationSource } from '../../src/contract/errors';

/**
 * RPCContractProvider test
 */
describe('RpcContractProvider test', () => {
  let rpcContractProvider: RpcContractProvider;
  let mockRpcClient: {
    getScript: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
    getBigMapKey: jest.Mock<any, any>;
    getBlockHeader: jest.Mock<any, any>;
    getEntrypoints: jest.Mock<any, any>;
    getManagerKey: jest.Mock<any, any>;
    getBlock: jest.Mock<any, any>;
    getContract: jest.Mock<any, any>;
    getBlockMetadata: jest.Mock<any, any>;
    forgeOperations: jest.Mock<any, any>;
    injectOperation: jest.Mock<any, any>;
    preapplyOperations: jest.Mock<any, any>;
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
  };

  const revealOp = (source: string) => ({
    counter: '1',
    fee: '1420',
    gas_limit: '10600',
    kind: 'reveal',
    public_key: 'test_pub_key',
    source,
    storage_limit: '300',
  });

  beforeEach(() => {
    mockRpcClient = {
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
      preapplyOperations: jest.fn(),
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
    };

    // Required for operations confirmation polling
    mockRpcClient.getBlock.mockResolvedValue({
      operations: [[], [], [], []],
      header: {
        level: 0,
      },
    });

    rpcContractProvider = new RpcContractProvider(
      new Context(mockRpcClient as any, mockSigner as any),
      mockEstimate as any
    );

    mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
    mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
    mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
    mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
    mockSigner.publicKey.mockResolvedValue('test_pub_key');
    mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
    mockRpcClient.preapplyOperations.mockResolvedValue([]);
  });

  describe('getStorage', () => {
    it('should call getStorage', async done => {
      mockRpcClient.getScript.mockResolvedValue({ code: [sample] });
      mockRpcClient.getStorage.mockResolvedValue(sampleStorage);
      const result = await rpcContractProvider.getStorage('test');
      expect(result).toEqual({
        '0': {},
        '1': 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        '2': false,
        '3': new BigNumber('200'),
      });
      done();
    });
  });

  describe('getBigMapKey', () => {
    it('should call getBigMapKey', async done => {
      mockRpcClient.getScript.mockResolvedValue({ code: [sample] });
      mockRpcClient.getBigMapKey.mockResolvedValue(sampleBigMapValue);
      const result = await rpcContractProvider.getBigMapKey(
        'test',
        'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
      );
      expect(result).toEqual({
        '0': new BigNumber('261'),
        '1': {
          KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN: new BigNumber('100'),
          tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn: new BigNumber('100'),
        },
      });
      expect(mockRpcClient.getBigMapKey.mock.calls[0][0]).toEqual('test');
      expect(mockRpcClient.getBigMapKey.mock.calls[0][1]).toEqual({
        key: { bytes: '000035e993d8c7aaa42b5e3ccd86a33390ececc73abd' },
        type: { prim: 'bytes' },
      });
      done();
    });
  });

  describe('originate', () => {
    it('should produce a reveal and origination operation', async done => {
      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miStr,
        init: '{}',
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
      });
      expect(result.raw).toEqual({
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              balance: '200000000',
              counter: '2',
              delegatable: false,
              delegate: 'test_delegate',
              fee: '10000',
              gas_limit: '10600',
              kind: 'origination',
              manager_pubkey: 'test_pub_key_hash',
              script: {
                code: miSample,
                storage: {
                  args: [],
                  prim: '{}',
                },
              },
              source: 'test_pub_key_hash',
              storage_limit: '257',
              spendable: false,
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('estimate when no fees are specified', async done => {
      const estimate = new Estimate(1000, 1000, 180);
      mockEstimate.originate.mockResolvedValue(estimate);

      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miStr,
        init: '{}',
      });
      expect(result.raw).toEqual({
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              balance: '200000000',
              counter: '2',
              delegatable: false,
              delegate: 'test_delegate',
              fee: estimate.suggestedFeeMutez.toString(),
              gas_limit: estimate.gasLimit.toString(),
              kind: 'origination',
              manager_pubkey: 'test_pub_key_hash',
              script: {
                code: miSample,
                storage: {
                  args: [],
                  prim: '{}',
                },
              },
              source: 'test_pub_key_hash',
              storage_limit: estimate.storageLimit.toString(),
              spendable: false,
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should not alter code and init object when they are array and object', async done => {
      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: ligoSample,
        init: { int: '0' },
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
      });
      expect(result.raw).toEqual({
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              balance: '200000000',
              counter: '2',
              delegatable: false,
              delegate: 'test_delegate',
              fee: '10000',
              gas_limit: '10600',
              kind: 'origination',
              manager_pubkey: 'test_pub_key_hash',
              script: {
                code: ligoSample,
                storage: { int: '0' },
              },
              source: 'test_pub_key_hash',
              storage_limit: '257',
              spendable: false,
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should not alter code and init object when they are array and object', async done => {
      mockRpcClient.getScript.mockResolvedValue({ code: ligoSample, storage: { int: '0' } });
      mockRpcClient.injectOperation.mockResolvedValue('test');
      mockRpcClient.preapplyOperations.mockResolvedValue([
        {
          contents: [
            {
              hash: 'test',
              kind: 'origination',
              metadata: { operation_result: { originated_contracts: ['test'] } },
            },
          ],
        },
      ]);
      mockRpcClient.getBlock.mockResolvedValue({
        operations: [
          [
            {
              hash: 'test',
              kind: 'origination',
              metadata: { operation_result: { originated_contracts: ['test'] } },
            },
          ],
          [],
          [],
          [],
        ],
        header: {
          level: 0,
        },
      });
      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: ligoSample,
        init: { int: '0' },
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
      });
      const contract = await result.contract();
      expect(contract.script).toEqual({ code: ligoSample, storage: { int: '0' } });
      done();
    });
  });

  describe('transfer', () => {
    it('should produce a reveal and transaction operation', async done => {
      const result = await rpcContractProvider.transfer({
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });
      expect(result.raw).toEqual({
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              amount: '2000000',
              counter: '2',
              destination: 'test_to',
              fee: '10000',
              gas_limit: '10600',
              kind: 'transaction',
              source: 'test_pub_key_hash',
              storage_limit: '300',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should estimate when no fee are specified', async done => {
      const estimate = new Estimate(1000, 1000, 180);
      mockEstimate.transfer.mockResolvedValue(estimate);

      const result = await rpcContractProvider.transfer({
        to: 'test_to',
        amount: 2,
      });
      expect(result.raw).toEqual({
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              amount: '2000000',
              counter: '2',
              destination: 'test_to',
              fee: estimate.suggestedFeeMutez.toString(),
              gas_limit: estimate.gasLimit.toString(),
              kind: 'transaction',
              source: 'test_pub_key_hash',
              storage_limit: estimate.storageLimit.toString(),
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should omit reveal operation if manager is defined (BABY)', async done => {
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      const result = await rpcContractProvider.transfer({
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });
      expect(result.raw).toEqual({
        opOb: {
          branch: 'test',
          contents: [
            {
              amount: '2000000',
              counter: '1',
              destination: 'test_to',
              fee: '10000',
              gas_limit: '10600',
              kind: 'transaction',
              source: 'test_pub_key_hash',
              storage_limit: '300',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should omit reveal operation if manager is defined', async done => {
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getManagerKey.mockResolvedValue({ key: 'test' });
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      const result = await rpcContractProvider.transfer({
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });
      expect(result.raw).toEqual({
        opOb: {
          branch: 'test',
          contents: [
            {
              amount: '2000000',
              counter: '1',
              destination: 'test_to',
              fee: '10000',
              gas_limit: '10600',
              kind: 'transaction',
              source: 'test_pub_key_hash',
              storage_limit: '300',
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

  describe('setDelegate', () => {
    it('should produce a reveal and delegation operation', async done => {
      const estimate = new Estimate(1000, 1000, 180);
      mockEstimate.setDelegate.mockResolvedValue(estimate);
      const result = await rpcContractProvider.setDelegate({
        source: 'test_source',
        delegate: 'test_delegate',
      });
      expect(result.raw).toEqual({
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              delegate: 'test_delegate',
              counter: '2',
              fee: '490',
              gas_limit: '1100',
              kind: 'delegation',
              source: 'test_source',
              storage_limit: '1000',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should throw InvalidDelegationSource when setting a KT1 address in babylon', async done => {
      const estimate = new Estimate(1000, 1000, 180);
      mockEstimate.setDelegate.mockResolvedValue(estimate);
      mockRpcClient.getBlockMetadata.mockResolvedValue({
        next_protocol: Protocols.PsBabyM1,
      });
      let error;
      try {
        await rpcContractProvider.setDelegate({
          source: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK',
          delegate: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
        });
      } catch (ex) {
        error = ex;
      }
      expect(error).toBeInstanceOf(InvalidDelegationSource);
      done();
    });

    it('should accept KT1 address in athens', async done => {
      const estimate = new Estimate(1000, 1000, 180);
      mockEstimate.setDelegate.mockResolvedValue(estimate);
      mockRpcClient.getBlockMetadata.mockResolvedValue({
        next_protocol: Protocols.Pt24m4xi,
      });

      const result = await rpcContractProvider.setDelegate({
        source: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK',
        delegate: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              delegate: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
              counter: '2',
              fee: '490',
              gas_limit: '1100',
              kind: 'delegation',
              source: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK',
              storage_limit: '1000',
            },
          ],
          protocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });
  });

  describe('registerDelegate', () => {
    it('should produce a reveal and delegation operation', async done => {
      const estimate = new Estimate(1000, 1000, 180);
      mockEstimate.registerDelegate.mockResolvedValue(estimate);
      const result = await rpcContractProvider.registerDelegate({});
      expect(result.raw).toEqual({
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              delegate: 'test_pub_key_hash',
              counter: '2',
              fee: '490',
              gas_limit: '1100',
              kind: 'delegation',
              source: 'test_pub_key_hash',
              storage_limit: '1000',
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

  describe('at', () => {
    it('should return legacy contract method for proto004', async done => {
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getScript.mockResolvedValue({
        code: tokenCode,
        storage: tokenInit,
      });
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      const result = await rpcContractProvider.at('test');
      expect(result.methods.mint('test', 100)).toBeInstanceOf(LegacyContractMethod);
      done();
    });

    it('should return contract method for proto005', async done => {
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.getEntrypoints.mockResolvedValue({
        entrypoints: {
          mint: { prim: 'pair', args: [{ prim: 'key' }, { prim: 'nat' }] },
        },
      });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getScript.mockResolvedValue({
        code: tokenCode,
        storage: tokenInit,
      });
      mockRpcClient.getBlockMetadata.mockResolvedValue({
        next_protocol: 'PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU',
      });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      const result = await rpcContractProvider.at('test');
      expect(result.methods.mint('test', 100)).toBeInstanceOf(ContractMethod);
      done();
    });
  });
});
