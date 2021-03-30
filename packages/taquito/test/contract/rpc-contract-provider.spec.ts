import { RpcContractProvider } from '../../src/contract/rpc-contract-provider';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import {
  sample,
  sampleStorage,
  sampleBigMapValue,
  miStr,
  miSample,
  ligoSample,
  tokenInit,
  tokenCode,
  sampleBigMapAbstractionValue,
  miInit,
  miStorage,
} from './data';
import BigNumber from 'bignumber.js';
import { Context } from '../../src/context';
import { ContractMethod } from '../../src/contract/contract';
import { Estimate } from '../../src/contract/estimate';
import {
  Protocols,
  DEFAULT_STORAGE_LIMIT,
  DEFAULT_FEE,
  DEFAULT_GAS_LIMIT,
} from '../../src/constants';
import { InvalidCodeParameter, InvalidDelegationSource, InvalidInitParameter } from '../../src/contract/errors';
import { preapplyResultFrom } from './helper';
import { MichelsonMap, Schema } from '@taquito/michelson-encoder';
import { BigMapAbstraction } from '../../src/contract/big-map';
import { OpKind, ParamsWithKind } from '../../src/operations/types';
import { NoopParser } from '../../src/taquito';
import { OperationBatch } from '../../src/batch/rpc-batch-provider';

/**
 * RPCContractProvider test
 */
describe('RpcContractProvider test', () => {
  let rpcContractProvider: RpcContractProvider;
  let mockRpcClient: {
    // deepcode ignore no-any: any is good enough
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
  };

  let mockSigner: {
    // deepcode ignore no-any: any is good enough
    publicKeyHash: jest.Mock<any, any>;
    publicKey: jest.Mock<any, any>;
    sign: jest.Mock<any, any>;
  };

  let mockEstimate: {
    // deepcode ignore no-any: any is good enough
    originate: jest.Mock<any, any>;
    transfer: jest.Mock<any, any>;
    setDelegate: jest.Mock<any, any>;
    registerDelegate: jest.Mock<any, any>;
    batch: jest.Mock<any, any>;
  };

  const revealOp = (source: string) => ({
    counter: '1',
    fee: String(DEFAULT_FEE.REVEAL),
    gas_limit: String(DEFAULT_GAS_LIMIT.REVEAL),
    kind: 'reveal',
    public_key: 'test_pub_key',
    source,
    storage_limit: String(DEFAULT_STORAGE_LIMIT.REVEAL),
  });

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
      batch: jest.fn()
    };

    // Required for operations confirmation polling
    mockRpcClient.getBlock.mockResolvedValue({
      operations: [[], [], [], []],
      header: {
        level: 0,
      },
    });

    rpcContractProvider = new RpcContractProvider(
      // deepcode ignore no-any: any is good enough
      new Context(mockRpcClient as any, mockSigner as any),
      mockEstimate as any
    );

    mockRpcClient.getBigMapExpr.mockResolvedValue({
      prim: 'Pair',
      args: [{ int: '100' }, []],
    });
    mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
    mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
    mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
    mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
    mockSigner.publicKey.mockResolvedValue('test_pub_key');
    mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
    mockRpcClient.packData.mockResolvedValue({
      packed: '747a325542477245424b7a7a5736686a586a78786951464a4e6736575232626d3647454e',
    });
    mockRpcClient.preapplyOperations.mockResolvedValue([]);
    mockRpcClient.getChainId.mockResolvedValue('chain-id');
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
      // tslint:disable-next-line: deprecation
      const result = await rpcContractProvider.getBigMapKey(
        'test',
        'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
      );
      expect(result).toEqual({
        '0': new BigNumber('261'),
        '1': expect.objectContaining(
          MichelsonMap.fromLiteral({
            tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn: new BigNumber('100'),
            KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN: new BigNumber('100'),
          })
        ),
      });
      expect(mockRpcClient.getBigMapKey.mock.calls[0][0]).toEqual('test');
      expect(mockRpcClient.getBigMapKey.mock.calls[0][1]).toEqual({
        key: { bytes: '000035e993d8c7aaa42b5e3ccd86a33390ececc73abd' },
        type: { prim: 'bytes' },
      });
      done();
    });
  });

  describe("getBigMapKeyByID", () => {
    it("should call getBigMapKeyByID", async (done) => {
      mockRpcClient.packData.mockResolvedValue({
        packed: "050a00000016000035e993d8c7aaa42b5e3ccd86a33390ececc73abd",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValue({ int: "3" });
  
      const result = await rpcContractProvider.getBigMapKeyByID(
        "133",
        "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn",
        new Schema({
          prim: "big_map",
          args: [{ prim: "address" }, { prim: "nat" }],
        })
      );
      expect(result).toEqual(new BigNumber(3));
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: "000035e993d8c7aaa42b5e3ccd86a33390ececc73abd",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        "expruc6BZL8Lz2pipLAwGEqGwUjbdMzbVikNvD589fhVf4tKSG58ic"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][2]).toBeUndefined();
      done();
    });
  
    it("should call getBigMapKeyByID when a block level is specified", async (done) => {
      mockRpcClient.packData.mockResolvedValue({
        packed: "050a00000016000035e993d8c7aaa42b5e3ccd86a33390ececc73abd",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValue({ int: "3" });
  
      const result = await rpcContractProvider.getBigMapKeyByID(
        "133",
        "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn",
        new Schema({
          prim: "big_map",
          args: [{ prim: "address" }, { prim: "nat" }],
        }),
        123456
      );
      expect(result).toEqual(new BigNumber(3));
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: "000035e993d8c7aaa42b5e3ccd86a33390ececc73abd",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        "expruc6BZL8Lz2pipLAwGEqGwUjbdMzbVikNvD589fhVf4tKSG58ic"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][2]).toEqual({
        block: "123456",
      });
      done();
    });
  });  

  describe("getBigMapKeysByID", () => {
    it("should call getBigMapKeysByID", async (done) => {
      mockRpcClient.getBlock.mockResolvedValue({ header: { level: 123456 } });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: "050a00000016000035e993d8c7aaa42b5e3ccd86a33390ececc73abd",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: "3" });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: "050a000000160000e7670f32038107a59a2b9cfefae36ea21f5aa63c",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: "7" });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: "050a00000016000002298c03ed7d454a101eb7022bc95f7e5f41ac78",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: "6" });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: "050a000000160000eadc0855adb415fa69a76fc10397dc2fb37039a0",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: "5" });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: "050a000000160000cf49f66b9ea137e11818f2a78b4b6fc9895b4e50",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: "4" });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: "050a0000001600001bc28a6b8fb2fb6af99fe3bba054e614539e5f12",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: "1" });
  
      const result = await rpcContractProvider.getBigMapKeysByID(
        "133",
        [
          "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn",
          "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN",
          "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx",
          "tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY",
          "tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh",
          'tz1NAozDvi5e7frVq9cUaC3uXQQannemB8Jw'
        ],
        new Schema({
          prim: "big_map",
          args: [{ prim: "address" }, { prim: "nat" }],
        })
      );
      expect(result.get('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(new BigNumber(3));
      expect(result.get('tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN')).toEqual(new BigNumber(7));
      expect(result.get('tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx')).toEqual(new BigNumber(6));
      expect(result.get('tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY')).toEqual(new BigNumber(5));
      expect(result.get('tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh')).toEqual(new BigNumber(4));
      expect(result.get('tz1NAozDvi5e7frVq9cUaC3uXQQannemB8Jw')).toEqual(new BigNumber(1));

      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: "000035e993d8c7aaa42b5e3ccd86a33390ececc73abd",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.packData.mock.calls[1][0]).toEqual({
        data: {
          bytes: "0000e7670f32038107a59a2b9cfefae36ea21f5aa63c",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.packData.mock.calls[2][0]).toEqual({
        data: {
          bytes: "000002298c03ed7d454a101eb7022bc95f7e5f41ac78",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.packData.mock.calls[3][0]).toEqual({
        data: {
          bytes: "0000eadc0855adb415fa69a76fc10397dc2fb37039a0",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.packData.mock.calls[4][0]).toEqual({
        data: {
          bytes: "0000cf49f66b9ea137e11818f2a78b4b6fc9895b4e50",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.packData.mock.calls[5][0]).toEqual({
        data: {
          bytes: "00001bc28a6b8fb2fb6af99fe3bba054e614539e5f12",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        "expruc6BZL8Lz2pipLAwGEqGwUjbdMzbVikNvD589fhVf4tKSG58ic"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][2]).toEqual({
        block: "123456",
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][1]).toEqual(
        "exprvPCPwzweu2FnFYTpZJoAM2vEWmPtHDXvsvNsrsKM6ZHMzeahE7"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][2]).toEqual({
        block: "123456",
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[2][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[2][1]).toEqual(
        "expruH3qgknRBJVLVkwdzf6wfBxd7Y1uqNxr7zuMFxTC12e5PacLfv"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[2][2]).toEqual({
        block: "123456",
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[3][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[3][1]).toEqual(
        "exprvEVwRjW3or3tGBSmpyXeqxzzp6XSJGRiKdxV5W1m4s5CceC83b"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[3][2]).toEqual({
        block: "123456",
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[4][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[4][1]).toEqual(
        "exprvPo6agtDv551oeRrjSDcETVHBi8TkRvFy7W6f3fGvygU6Un8NX"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[4][2]).toEqual({
        block: "123456",
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[5][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[5][1]).toEqual(
        "exprtzAeDbQY935rEquwCdbZaaTYgXttwjkBNAVkRGck1EY6smmFUF"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[5][2]).toEqual({
        block: "123456",
      });

      done();
    });

    it("getBigMapKeysByID should set value to undefined for key that does not exist", async (done) => {
      mockRpcClient.getBlock.mockResolvedValue({ header: { level: 123456 } });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: "050a00000016000035e993d8c7aaa42b5e3ccd86a33390ececc73abd",
      });
      const expectedError = new HttpResponseError(
        'fail',
        STATUS_CODE.NOT_FOUND,
        'err',
        'test',
        'https://test.com'
      );
      mockRpcClient.getBigMapExpr.mockRejectedValueOnce(expectedError);
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: "050a000000160000e7670f32038107a59a2b9cfefae36ea21f5aa63c",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: "3" });
  
      const result = await rpcContractProvider.getBigMapKeysByID(
        "133",
        [
          "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn", // this is not a key of the big map
          "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN",
        ],
        new Schema({
          prim: "big_map",
          args: [{ prim: "address" }, { prim: "nat" }],
        })
      );
      expect(result.get('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toBeUndefined();
      expect(result.get('tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN')).toEqual(new BigNumber(3));

      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: "000035e993d8c7aaa42b5e3ccd86a33390ececc73abd",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.packData.mock.calls[1][0]).toEqual({
        data: {
          bytes: "0000e7670f32038107a59a2b9cfefae36ea21f5aa63c",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        "expruc6BZL8Lz2pipLAwGEqGwUjbdMzbVikNvD589fhVf4tKSG58ic"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][2]).toEqual({
        block: "123456",
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][1]).toEqual(
        "exprvPCPwzweu2FnFYTpZJoAM2vEWmPtHDXvsvNsrsKM6ZHMzeahE7"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][2]).toEqual({
        block: "123456",
      });
      done();
    });

    it("getBigMapKeysByID should accept a level has a parameter and don't fetch the level form the rpc", async (done) => {
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: "050a00000016000035e993d8c7aaa42b5e3ccd86a33390ececc73abd",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: "34" });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: "050a000000160000e7670f32038107a59a2b9cfefae36ea21f5aa63c",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: "3" });
  
      const result = await rpcContractProvider.getBigMapKeysByID(
        "133",
        [
          "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn", 
          "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN",
        ],
        new Schema({
          prim: "big_map",
          args: [{ prim: "address" }, { prim: "nat" }],
        }),
        654321
      );
      expect(result.get('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(new BigNumber(34));
      expect(result.get('tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN')).toEqual(new BigNumber(3));

      expect(mockRpcClient.getBlock.mock.calls[0]).toBeUndefined();
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: "000035e993d8c7aaa42b5e3ccd86a33390ececc73abd",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.packData.mock.calls[1][0]).toEqual({
        data: {
          bytes: "0000e7670f32038107a59a2b9cfefae36ea21f5aa63c",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        "expruc6BZL8Lz2pipLAwGEqGwUjbdMzbVikNvD589fhVf4tKSG58ic"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][2]).toEqual({
        block: "654321",
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][1]).toEqual(
        "exprvPCPwzweu2FnFYTpZJoAM2vEWmPtHDXvsvNsrsKM6ZHMzeahE7"
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][2]).toEqual({
        block: "654321",
      });
      done();
    });

    it("getBigMapKeysByID should set value to undefined if only 1 key to fetch and that it does not exist", async (done) => {
      mockRpcClient.packData.mockResolvedValue({
        packed: "050a000000160000e7670f32038107a59a2b9cfefae36ea21f5aa63c",
      });
      const expectedError = new HttpResponseError(
        'fail',
        STATUS_CODE.NOT_FOUND,
        'err',
        'test',
        'https://test.com'
      );
      mockRpcClient.getBigMapExpr.mockRejectedValue(expectedError);
  
      const result = await rpcContractProvider.getBigMapKeysByID(
        "133",
        [
          "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN",
        ],
        new Schema({
          prim: "big_map",
          args: [{ prim: "address" }, { prim: "nat" }],
        })
      );

      expect(result.get('tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN')).toBeUndefined();

      expect(mockRpcClient.getBlock.mock.calls[0]).toBeUndefined();
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: "0000e7670f32038107a59a2b9cfefae36ea21f5aa63c",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        "exprvPCPwzweu2FnFYTpZJoAM2vEWmPtHDXvsvNsrsKM6ZHMzeahE7"
      );
      done();
    });

    it("getBigMapKeysByID should not call getBlock when there is only 1 key to fetch", async (done) => {
      mockRpcClient.packData.mockResolvedValue({
        packed: "050a000000160000e7670f32038107a59a2b9cfefae36ea21f5aa63c",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValue({ int: "3" });
  
      const result = await rpcContractProvider.getBigMapKeysByID(
        "133",
        [
          "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN",
        ],
        new Schema({
          prim: "big_map",
          args: [{ prim: "address" }, { prim: "nat" }],
        })
      );

      expect(result.get('tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN')).toEqual(new BigNumber(3));

      expect(mockRpcClient.getBlock.mock.calls[0]).toBeUndefined();
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: "0000e7670f32038107a59a2b9cfefae36ea21f5aa63c",
        },
        type: {
          prim: "bytes",
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        "exprvPCPwzweu2FnFYTpZJoAM2vEWmPtHDXvsvNsrsKM6ZHMzeahE7"
      );
      done();
    });

    it("getBigMapKeysByID with a pair as key and a pair as value", async (done) => {
      mockRpcClient.packData.mockResolvedValue({
        packed: "0507070100000005746573743201000000057465737433",
      });
      mockRpcClient.getBigMapExpr.mockResolvedValue({  prim: "Pair", args: [{ int: "2" }, { string: "3" }] });
  
      const result = await rpcContractProvider.getBigMapKeysByID(
        "133",
        [
          { 'test': 'test2', 'test2': 'test3' },
        ],
        new Schema({
          prim: "big_map",
          args: [{ "prim": "pair", "args": [{ "prim": "string", annots: ["%test"] }, { "prim": "string", annots: ["%test2"] }] }, { "prim": "pair", "args":[{ "prim": "int" }, { "prim": "int" }] }],
        })
      );
      expect(result.has({ 'test': 'test2', 'test2': 'test3' })).toBeTruthy();
      expect(result.get({ 'test': 'test2', 'test2': 'test3' })).toEqual({
        0: new BigNumber(2),
        1: new BigNumber(3)      
      });
      expect(mockRpcClient.getBlock.mock.calls[0]).toBeUndefined();
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          prim: "Pair", args: [{ string: "test2" }, { string: "test3" }]
        },
        type: {
          prim: "pair", args: [{ prim: "string" }, { prim: "string" }]
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual("133");
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        "exprteZPr9h8pkyKKw9PMFEXqG1jbMBkj4A2KC9Mp5cAAjSrDWvfXs"
      );
      done();
    });
  });

  describe('BigMapAbstraction', () => {
    it('returns undefined on bad key in BigMap', async done => {
      const expectedError = new HttpResponseError(
        'fail',
        STATUS_CODE.NOT_FOUND,
        'err',
        'test',
        'https://test.com'
      );
      mockRpcClient.getBigMapExpr.mockRejectedValue(expectedError);
      const schema = new Schema(sampleBigMapAbstractionValue);
      const bigMap = new BigMapAbstraction(
        new BigNumber('tz2UBGrEBKzzW6hjXjxxiQFJNg6WR2bm6GEN'),
        schema,
        rpcContractProvider
      );
      const returnValue = await bigMap.get('test');
      expect(returnValue).toEqual(undefined);
      done();
    });
    it('returns error if error is not 404 from key lookup in BigMap', async done => {
      const expectedError = new HttpResponseError(
        'fail',
        STATUS_CODE.FORBIDDEN,
        'err',
        'test',
        'https://test.com'
      );
      mockRpcClient.getBigMapExpr.mockRejectedValue(expectedError);
      const schema = new Schema(sampleBigMapAbstractionValue);
      const bigMap = new BigMapAbstraction(
        new BigNumber('tz2UBGrEBKzzW6hjXjxxiQFJNg6WR2bm6GEN'),
        schema,
        rpcContractProvider
      );
      await expect(bigMap.get('test')).rejects.toEqual(expectedError);
      done();
    });
  });

  describe('originate', () => {
    it('should produce a reveal and origination operation', async done => {
      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miStr,
        init: miInit,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
      });
      const res = JSON.parse(JSON.stringify(result.raw)); // Strip symbols
      expect(res).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              balance: '200000000',
              counter: '2',
              delegate: 'test_delegate',
              fee: '10000',
              gas_limit: '10600',
              kind: 'origination',
              script: {
                code: miSample,
                storage: miStorage,
              },
              source: 'test_pub_key_hash',
              storage_limit: '257',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should not convert balance to mutez when mutez flag is set to true', async done => {
      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miStr,
        init: miInit,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
        mutez: true,
      });
      const res = JSON.parse(JSON.stringify(result.raw)); // Strip symbols
      expect(res).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              balance: '200',
              counter: '2',
              delegate: 'test_delegate',
              fee: '10000',
              gas_limit: '10600',
              kind: 'origination',
              script: {
                code: miSample,
                storage: miStorage,
              },
              source: 'test_pub_key_hash',
              storage_limit: '257',
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
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.originate.mockResolvedValue(estimate);

      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miStr,
        init: miInit,
      });
      const res = JSON.parse(JSON.stringify(result.raw)); // Strip symbols
      expect(res).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              balance: '200000000',
              counter: '2',
              delegate: 'test_delegate',
              fee: estimate.suggestedFeeMutez.toString(),
              gas_limit: estimate.gasLimit.toString(),
              kind: 'origination',
              script: {
                code: miSample,
                storage: miStorage,
              },
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
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              balance: '200000000',
              counter: '2',
              delegate: 'test_delegate',
              fee: '10000',
              gas_limit: '10600',
              kind: 'origination',
              script: {
                code: ligoSample,
                storage: { int: '0' },
              },
              source: 'test_pub_key_hash',
              storage_limit: '257',
            },
          ],
          protocol: 'test_proto',
          signature: 'test_sig',
        },
        opbytes: 'test',
      });
      done();
    });

    it('should deal with code properties in atypical order', async done => {
      const order1 = ['storage', 'code', 'parameter'];
      const result = await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: miSample
          .concat()
          // deepcode ignore no-any: any is good enough
          .sort((a: any, b: any) => order1.indexOf(a.prim) - order1.indexOf(b.prim)),
        init: { int: '0' },
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
      });
      expect(result.raw).toEqual({
        counter: 0,
        opOb: {
          branch: 'test',
          contents: [
            revealOp('test_pub_key_hash'),
            {
              balance: '200000000',
              counter: '2',
              delegate: 'test_delegate',
              fee: '10000',
              gas_limit: '10600',
              kind: 'origination',
              script: {
                code: miSample,
                storage: { int: '0' },
              },
              source: 'test_pub_key_hash',
              storage_limit: '257',
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
      const result = await rpcContractProvider.transfer({
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      });
      expect(result.raw).toEqual({
        counter: 0,
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
      const estimate = new Estimate(1000, 1000, 180, 1000);
      mockEstimate.transfer.mockResolvedValue(estimate);

      const result = await rpcContractProvider.transfer({
        to: 'test_to',
        amount: 2,
      });
      expect(result.raw).toEqual({
        counter: 0,
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
        counter: 0,
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

    it('should return parsed error from RPC result', async done => {
      const params = {
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue(preapplyResultFrom(params).withError());
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      await expect(rpcContractProvider.transfer(params)).rejects.toMatchObject({
        id: 'proto.006-PsCARTHA.michelson_v1.script_rejected',
        message: 'test',
      });
      done();
    });

    it('should return parsed error from RPC result', async done => {
      const params = {
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue(
        preapplyResultFrom(params).withBalanceTooLowError()
      );
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      await expect(rpcContractProvider.transfer(params)).rejects.toMatchObject({
        id: 'proto.006-PsCARTHA.contract.balance_too_low',
        message: '(temporary) proto.006-PsCARTHA.contract.balance_too_low',
      });
      done();
    });

    it('should return internal error when received from preapply', async done => {
      const params = {
        to: 'test_to',
        amount: 2,
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 300,
      };
      mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.preapplyOperations.mockResolvedValue(
        preapplyResultFrom(params).withInternalError()
      );
      mockRpcClient.getManagerKey.mockResolvedValue('test');
      mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('test_pub_key_hash');
      await expect(rpcContractProvider.transfer(params)).rejects.toMatchObject({
        id: 'proto.005-PsBabyM1.gas_exhausted.operation',
        message: '(temporary) proto.005-PsBabyM1.gas_exhausted.operation',
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
        counter: 0,
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
      const estimate = new Estimate(1000000, 1000, 180, 1000);
      mockEstimate.setDelegate.mockResolvedValue(estimate);
      const result = await rpcContractProvider.setDelegate({
        source: 'test_source',
        delegate: 'test_delegate',
      });
      expect(result.raw).toEqual({
        counter: 0,
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
      const estimate = new Estimate(1000, 1000, 180, 1000);
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
  });

  describe('registerDelegate', () => {
    it('should produce a reveal and delegation operation', async done => {
      const estimate = new Estimate(1000000, 1000, 180, 1000);
      mockEstimate.registerDelegate.mockResolvedValue(estimate);
      const result = await rpcContractProvider.registerDelegate({});
      expect(result.raw).toEqual({
        counter: 0,
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
    it('should return contract method', async done => {
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
  
    describe('originate with noop parser', () => {
      it('should throw InvalidCodeParameter', async done => {
        rpcContractProvider['context'].parser = new NoopParser();
        try {
          await rpcContractProvider.originate({
          delegate: 'test_delegate',
          balance: '200',
          code: miStr, // needs to be JSON Michelson
          init: miInit,
          fee: 10000,
          gasLimit: 10600,
          storageLimit: 257,
        });
      } catch( err) {
        expect(err).toBeInstanceOf(InvalidCodeParameter);
        expect(err.message).toEqual('Wrong code parameter type, expected an array');
      }
      done();
    });

    it('should throw InvalidCodeParameter when missing storage part', async done => {
      rpcContractProvider['context'].parser = new NoopParser();
      try {
        await rpcContractProvider.originate({
          delegate: 'test_delegate',
          balance: '200',
          code: [
            { prim: 'parameter', args: [{ prim: 'int' }] },
            {
                prim: 'code',
                args: [[{ prim: 'DUP' }]]
            }
          ],
          storage: 'test',
          fee: 10000,
          gasLimit: 10600,
          storageLimit: 257,
        });
      } catch( err) {
        expect(err).toBeInstanceOf(InvalidCodeParameter);
        expect(err.message).toEqual('The storage section is missing from the script');
      }
      done();
    });

  it('should throw InvalidInitParameter', async done => {
    rpcContractProvider['context'].parser = new NoopParser();
    try {
      await rpcContractProvider.originate({
        delegate: 'test_delegate',
        balance: '200',
        code: [
          { prim: 'parameter', args: [{ prim: 'int' }] },
          {
              prim: 'code',
              args: [[{ prim: 'DUP' }]]
          },
          { prim: 'storage', args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }] }
        ],
        init: 'test',
        fee: 10000,
        gasLimit: 10600,
        storageLimit: 257,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidInitParameter);
      expect(err.message).toEqual('Wrong init parameter type, expected JSON Michelson');
    }
      done();
    });

    describe('batch', () => {
      it('should produce a batch operation', async done => {

        const opToBatch: ParamsWithKind[] = [
          {
            kind: OpKind.TRANSACTION,
            to: 'test',
            amount: 2
          },
          {
            kind: OpKind.TRANSACTION,
            to: 'test',
            amount: 2
          }
        ];

        const opBatch = new OperationBatch(rpcContractProvider['context'], mockEstimate);

        expect(rpcContractProvider.batch()).toBeInstanceOf(OperationBatch);
        expect(rpcContractProvider.batch()).toEqual(opBatch);

        expect(rpcContractProvider.batch(opToBatch)).toEqual(opBatch.with(opToBatch));

        done();
      });
    }); 
  });
});
