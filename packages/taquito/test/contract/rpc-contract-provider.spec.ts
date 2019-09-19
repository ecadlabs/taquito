import { RpcContractProvider } from '../../src/contract/rpc-contract-provider';
import { sample, sampleStorage, sampleBigMapValue, miStr, miSample } from './data';
import BigNumber from 'bignumber.js';
import { Context } from '../../src/context';

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

  beforeEach(() => {
    mockRpcClient = {
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

    // Required for operations confirmation polling
    mockRpcClient.getBlock.mockResolvedValue({
      operations: [[], [], [], []],
      header: {
        level: 0,
      },
    });

    mockRpcClient.getManagerKey.mockResolvedValue('test');

    rpcContractProvider = new RpcContractProvider(
      new Context(mockRpcClient as any, mockSigner as any)
    );
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
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.getBlockMetadata.mockResolvedValue({ nextProtocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miStr,
        init: '{}',
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '1',
              fee: '1420',
              gas_limit: '10600',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              storage_limit: '300',
            },
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
  });

  describe('transfer', () => {
    it('should produce a reveal and transaction operation', async done => {
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getBlockMetadata.mockResolvedValue({ nextProtocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      const result = await rpcContractProvider.transfer({ to: 'test_to', amount: 2 });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '1',
              fee: '1420',
              gas_limit: '10600',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              storage_limit: '300',
            },
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
  });

  describe('setDelegate', () => {
    it('should produce a reveal and delegation operation', async done => {
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.getBlockMetadata.mockResolvedValue({ nextProtocol: 'test_proto' });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      const result = await rpcContractProvider.setDelegate({
        source: 'test_source',
        delegate: 'test_delegate',
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '1',
              fee: '1420',
              gas_limit: '10600',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'test_source',
              storage_limit: '300',
            },
            {
              delegate: 'test_delegate',
              counter: '2',
              fee: '1000',
              gas_limit: '10600',
              kind: 'delegation',
              source: 'test_source',
              storage_limit: '0',
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

  describe('registerDelegate', () => {
    it('should produce a reveal and delegation operation', async done => {
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getBlockMetadata.mockResolvedValue({ nextProtocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      const result = await rpcContractProvider.registerDelegate({});
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            {
              counter: '1',
              fee: '1420',
              gas_limit: '10600',
              kind: 'reveal',
              public_key: 'test_pub_key',
              source: 'test_pub_key_hash',
              storage_limit: '300',
            },
            {
              delegate: 'test_pub_key_hash',
              counter: '2',
              fee: '1000',
              gas_limit: '10600',
              kind: 'delegation',
              source: 'test_pub_key_hash',
              storage_limit: '0',
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
