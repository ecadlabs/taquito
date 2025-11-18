import { RpcContractProvider } from '../../src/contract/rpc-contract-provider';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import {
  sample,
  sampleStorage,
  tokenInit,
  tokenCode,
  sampleBigMapAbstractionValue,
} from './data';
import BigNumber from 'bignumber.js';
import { Context } from '../../src/context';
import { Schema } from '@taquito/michelson-encoder';
import { BigMapAbstraction } from '../../src/contract/big-map';
import { ContractMethodObject } from '../../src/contract/contract-methods/contract-method-object-param';
import { smallNestedMapTypecheck, ticketTokenTestMock } from '../helpers';

/**
 * RPCContractProvider test
 */
describe('RpcContractProvider test', () => {
  let rpcContractProvider: RpcContractProvider;
  let mockRpcClient: {
    getScript: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
    getBigMapExpr: jest.Mock<any, any>;
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
  };

  let mockSigner: {
    publicKeyHash: jest.Mock<any, any>;
    publicKey: jest.Mock<any, any>;
    sign: jest.Mock<any, any>;
  };

  let mockEstimate;

  beforeEach(() => {
    mockRpcClient = {
      getBigMapExpr: jest.fn(),
      getEntrypoints: jest.fn(),
      getBlock: jest.fn(),
      getScript: jest.fn(),
      getManagerKey: jest.fn(),
      getStorage: jest.fn(),
      getBlockHeader: jest.fn(),
      getBlockMetadata: jest.fn(),
      getContract: jest.fn(),
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

    mockEstimate = {};

    // Required for operations confirmation polling
    mockRpcClient.getBlock.mockResolvedValue({
      operations: [[], [], [], []],
      header: {
        level: 0,
      },
    });

    const context = new Context(mockRpcClient as any, mockSigner as any);
    rpcContractProvider = new RpcContractProvider(
      // deepcode ignore no-any: any is good enough
      context,
      mockEstimate as any
    );

    mockRpcClient.getBigMapExpr.mockResolvedValue({
      prim: 'Pair',
      args: [{ int: '100' }, []],
    });
    mockRpcClient.getContract.mockResolvedValue({
      counter: 0,
      script: {
        code: [sample],
        storage: sampleStorage,
      },
    });
    mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });

    mockRpcClient.packData.mockResolvedValue({
      packed: '747a325542477245424b7a7a5736686a586a78786951464a4e6736575232626d3647454e',
    });
  });

  describe('getStorage', () => {
    it('should call getStorage', async () => {
      const result = await rpcContractProvider.getStorage('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D');
      expect(result).toEqual({
        '0': {},
        '1': 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        '2': false,
        '3': new BigNumber('200'),
      });
    });
  });

  describe('getBigMapKeyByID', () => {
    it('should call getBigMapKeyByID', async () => {
      mockRpcClient.packData.mockResolvedValue({
        packed: '050a00000016000035e993d8c7aaa42b5e3ccd86a33390ececc73abd',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValue({ int: '3' });

      const result = await rpcContractProvider.getBigMapKeyByID(
        '133',
        'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        new Schema({
          prim: 'big_map',
          args: [{ prim: 'address' }, { prim: 'nat' }],
        })
      );
      expect(result).toEqual(new BigNumber(3));
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: '000035e993d8c7aaa42b5e3ccd86a33390ececc73abd',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        'expruc6BZL8Lz2pipLAwGEqGwUjbdMzbVikNvD589fhVf4tKSG58ic'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][2]).toEqual({ block: 'head' });
    });

    it('should call getBigMapKeyByID when a block level is specified', async () => {
      mockRpcClient.packData.mockResolvedValue({
        packed: '050a00000016000035e993d8c7aaa42b5e3ccd86a33390ececc73abd',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValue({ int: '3' });

      const result = await rpcContractProvider.getBigMapKeyByID(
        '133',
        'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        new Schema({
          prim: 'big_map',
          args: [{ prim: 'address' }, { prim: 'nat' }],
        }),
        123456
      );
      expect(result).toEqual(new BigNumber(3));
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: '000035e993d8c7aaa42b5e3ccd86a33390ececc73abd',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        'expruc6BZL8Lz2pipLAwGEqGwUjbdMzbVikNvD589fhVf4tKSG58ic'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][2]).toEqual({
        block: '123456',
      });
    });
  });

  describe('getBigMapKeysByID', () => {
    it('should call getBigMapKeysByID', async () => {
      mockRpcClient.getBlockHeader.mockResolvedValue({ level: 123456 });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: '050a00000016000035e993d8c7aaa42b5e3ccd86a33390ececc73abd',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: '3' });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: '050a000000160000e7670f32038107a59a2b9cfefae36ea21f5aa63c',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: '7' });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: '050a00000016000002298c03ed7d454a101eb7022bc95f7e5f41ac78',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: '6' });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: '050a000000160000eadc0855adb415fa69a76fc10397dc2fb37039a0',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: '5' });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: '050a000000160000cf49f66b9ea137e11818f2a78b4b6fc9895b4e50',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: '4' });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: '050a0000001600001bc28a6b8fb2fb6af99fe3bba054e614539e5f12',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: '1' });

      const result = await rpcContractProvider.getBigMapKeysByID(
        '133',
        [
          'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
          'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
          'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY',
          'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
          'tz1NAozDvi5e7frVq9cUaC3uXQQannemB8Jw',
        ],
        new Schema({
          prim: 'big_map',
          args: [{ prim: 'address' }, { prim: 'nat' }],
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
          bytes: '000035e993d8c7aaa42b5e3ccd86a33390ececc73abd',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.packData.mock.calls[1][0]).toEqual({
        data: {
          bytes: '0000e7670f32038107a59a2b9cfefae36ea21f5aa63c',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.packData.mock.calls[2][0]).toEqual({
        data: {
          bytes: '000002298c03ed7d454a101eb7022bc95f7e5f41ac78',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.packData.mock.calls[3][0]).toEqual({
        data: {
          bytes: '0000eadc0855adb415fa69a76fc10397dc2fb37039a0',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.packData.mock.calls[4][0]).toEqual({
        data: {
          bytes: '0000cf49f66b9ea137e11818f2a78b4b6fc9895b4e50',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.packData.mock.calls[5][0]).toEqual({
        data: {
          bytes: '00001bc28a6b8fb2fb6af99fe3bba054e614539e5f12',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        'expruc6BZL8Lz2pipLAwGEqGwUjbdMzbVikNvD589fhVf4tKSG58ic'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][2]).toEqual({
        block: '123456',
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][1]).toEqual(
        'exprvPCPwzweu2FnFYTpZJoAM2vEWmPtHDXvsvNsrsKM6ZHMzeahE7'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][2]).toEqual({
        block: '123456',
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[2][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[2][1]).toEqual(
        'expruH3qgknRBJVLVkwdzf6wfBxd7Y1uqNxr7zuMFxTC12e5PacLfv'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[2][2]).toEqual({
        block: '123456',
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[3][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[3][1]).toEqual(
        'exprvEVwRjW3or3tGBSmpyXeqxzzp6XSJGRiKdxV5W1m4s5CceC83b'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[3][2]).toEqual({
        block: '123456',
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[4][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[4][1]).toEqual(
        'exprvPo6agtDv551oeRrjSDcETVHBi8TkRvFy7W6f3fGvygU6Un8NX'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[4][2]).toEqual({
        block: '123456',
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[5][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[5][1]).toEqual(
        'exprtzAeDbQY935rEquwCdbZaaTYgXttwjkBNAVkRGck1EY6smmFUF'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[5][2]).toEqual({
        block: '123456',
      });
    });

    it('getBigMapKeysByID should set value to undefined for key that does not exist', async () => {
      mockRpcClient.getBlockHeader.mockResolvedValue({ level: 123456 });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: '050a00000016000035e993d8c7aaa42b5e3ccd86a33390ececc73abd',
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
        packed: '050a000000160000e7670f32038107a59a2b9cfefae36ea21f5aa63c',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: '3' });

      const result = await rpcContractProvider.getBigMapKeysByID(
        '133',
        [
          'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn', // this is not a key of the big map
          'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN',
        ],
        new Schema({
          prim: 'big_map',
          args: [{ prim: 'address' }, { prim: 'nat' }],
        })
      );
      expect(result.get('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toBeUndefined();
      expect(result.get('tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN')).toEqual(new BigNumber(3));

      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: '000035e993d8c7aaa42b5e3ccd86a33390ececc73abd',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.packData.mock.calls[1][0]).toEqual({
        data: {
          bytes: '0000e7670f32038107a59a2b9cfefae36ea21f5aa63c',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        'expruc6BZL8Lz2pipLAwGEqGwUjbdMzbVikNvD589fhVf4tKSG58ic'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][2]).toEqual({
        block: '123456',
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][1]).toEqual(
        'exprvPCPwzweu2FnFYTpZJoAM2vEWmPtHDXvsvNsrsKM6ZHMzeahE7'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][2]).toEqual({
        block: '123456',
      });
    });

    it("getBigMapKeysByID should accept a level has a parameter and don't fetch the level form the rpc", async () => {
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: '050a00000016000035e993d8c7aaa42b5e3ccd86a33390ececc73abd',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: '34' });
      mockRpcClient.packData.mockResolvedValueOnce({
        packed: '050a000000160000e7670f32038107a59a2b9cfefae36ea21f5aa63c',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValueOnce({ int: '3' });

      const result = await rpcContractProvider.getBigMapKeysByID(
        '133',
        ['tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn', 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN'],
        new Schema({
          prim: 'big_map',
          args: [{ prim: 'address' }, { prim: 'nat' }],
        }),
        654321
      );
      expect(result.get('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')).toEqual(new BigNumber(34));
      expect(result.get('tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN')).toEqual(new BigNumber(3));

      expect(mockRpcClient.getBlock.mock.calls[0]).toBeUndefined();
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: '000035e993d8c7aaa42b5e3ccd86a33390ececc73abd',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.packData.mock.calls[1][0]).toEqual({
        data: {
          bytes: '0000e7670f32038107a59a2b9cfefae36ea21f5aa63c',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        'expruc6BZL8Lz2pipLAwGEqGwUjbdMzbVikNvD589fhVf4tKSG58ic'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][2]).toEqual({
        block: '654321',
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][1]).toEqual(
        'exprvPCPwzweu2FnFYTpZJoAM2vEWmPtHDXvsvNsrsKM6ZHMzeahE7'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[1][2]).toEqual({
        block: '654321',
      });
    });

    it('getBigMapKeysByID should set value to undefined if only 1 key to fetch and that it does not exist', async () => {
      mockRpcClient.packData.mockResolvedValue({
        packed: '050a000000160000e7670f32038107a59a2b9cfefae36ea21f5aa63c',
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
        '133',
        ['tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN'],
        new Schema({
          prim: 'big_map',
          args: [{ prim: 'address' }, { prim: 'nat' }],
        })
      );

      expect(result.get('tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN')).toBeUndefined();

      expect(mockRpcClient.getBlock.mock.calls[0]).toBeUndefined();
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: '0000e7670f32038107a59a2b9cfefae36ea21f5aa63c',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        'exprvPCPwzweu2FnFYTpZJoAM2vEWmPtHDXvsvNsrsKM6ZHMzeahE7'
      );
    });

    it('getBigMapKeysByID should not call getBlock when there is only 1 key to fetch', async () => {
      mockRpcClient.packData.mockResolvedValue({
        packed: '050a000000160000e7670f32038107a59a2b9cfefae36ea21f5aa63c',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValue({ int: '3' });

      const result = await rpcContractProvider.getBigMapKeysByID(
        '133',
        ['tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN'],
        new Schema({
          prim: 'big_map',
          args: [{ prim: 'address' }, { prim: 'nat' }],
        })
      );

      expect(result.get('tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN')).toEqual(new BigNumber(3));

      expect(mockRpcClient.getBlock.mock.calls[0]).toBeUndefined();
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          bytes: '0000e7670f32038107a59a2b9cfefae36ea21f5aa63c',
        },
        type: {
          prim: 'bytes',
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        'exprvPCPwzweu2FnFYTpZJoAM2vEWmPtHDXvsvNsrsKM6ZHMzeahE7'
      );
    });

    it('getBigMapKeysByID with a pair as key and a pair as value', async () => {
      mockRpcClient.packData.mockResolvedValue({
        packed: '0507070100000005746573743201000000057465737433',
      });
      mockRpcClient.getBigMapExpr.mockResolvedValue({
        prim: 'Pair',
        args: [{ int: '2' }, { string: '3' }],
      });

      const result = await rpcContractProvider.getBigMapKeysByID(
        '133',
        [{ test: 'test2', test2: 'test3' }],
        new Schema({
          prim: 'big_map',
          args: [
            {
              prim: 'pair',
              args: [
                { prim: 'string', annots: ['%test'] },
                { prim: 'string', annots: ['%test2'] },
              ],
            },
            { prim: 'pair', args: [{ prim: 'int' }, { prim: 'int' }] },
          ],
        })
      );
      expect(result.has({ test: 'test2', test2: 'test3' })).toBeTruthy();
      expect(result.get({ test: 'test2', test2: 'test3' })).toEqual({
        0: new BigNumber(2),
        1: new BigNumber(3),
      });
      expect(mockRpcClient.getBlock.mock.calls[0]).toBeUndefined();
      expect(mockRpcClient.packData.mock.calls[0][0]).toEqual({
        data: {
          prim: 'Pair',
          args: [{ string: 'test2' }, { string: 'test3' }],
        },
        type: {
          prim: 'pair',
          args: [{ prim: 'string' }, { prim: 'string' }],
        },
      });
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual('133');
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        'exprteZPr9h8pkyKKw9PMFEXqG1jbMBkj4A2KC9Mp5cAAjSrDWvfXs'
      );
    });

    it('getBigMapKeysByID unexpected exception', async () => {
      mockRpcClient.getBlock.mockResolvedValue({ header: { level: 123456 } });
      const expectedError = new HttpResponseError(
        'fail',
        STATUS_CODE.UNAUTHORIZED,
        'err',
        'test',
        'https://test.com'
      );
      mockRpcClient.packData.mockRejectedValue(expectedError);

      try {
        await rpcContractProvider.getBigMapKeysByID(
          '133',
          ['tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn', 'tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN'],
          new Schema({
            prim: 'big_map',
            args: [{ prim: 'address' }, { prim: 'nat' }],
          })
        );
      } catch (err) {
        expect(err).toBeInstanceOf(HttpResponseError);
      }
    });
  });

  describe('BigMapAbstraction', () => {
    it('returns undefined on bad key in BigMap', async () => {
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
    });
    it('returns error if error is not 404 from key lookup in BigMap', async () => {
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
    });
  });

  describe('getSaplingDiffByID', () => {
    it('should call getSaplingDiffById', async () => {
      mockRpcClient.getBlock.mockResolvedValue({ header: { level: 123456 } });
      mockRpcClient.getSaplingDiffById.mockResolvedValue({
        root: 'fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e',
        commitments_and_ciphertexts: [],
        nullifiers: [],
      });

      const result = await rpcContractProvider.getSaplingDiffByID('133');
      expect(result.root).toEqual(
        'fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e'
      );
      expect(result.commitments_and_ciphertexts).toEqual([]);
      expect(result.nullifiers).toEqual([]);

      expect(mockRpcClient.getSaplingDiffById.mock.calls[0][0]).toEqual('133');
      expect(mockRpcClient.getSaplingDiffById.mock.calls[0][1]).toEqual({ block: 'head' }); // no block specified
    });

    it('should call getSaplingDiffById with a specified block level', async () => {
      mockRpcClient.getBlock.mockResolvedValue({ header: { level: 123456 } });
      mockRpcClient.getSaplingDiffById.mockResolvedValue({
        root: 'fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e',
        commitments_and_ciphertexts: [],
        nullifiers: [],
      });

      const result = await rpcContractProvider.getSaplingDiffByID('133', 654321);
      expect(result.root).toEqual(
        'fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e'
      );
      expect(result.commitments_and_ciphertexts).toEqual([]);
      expect(result.nullifiers).toEqual([]);

      expect(mockRpcClient.getSaplingDiffById.mock.calls[0][0]).toEqual('133');
      expect(mockRpcClient.getSaplingDiffById.mock.calls[0][1]).toEqual({ block: '654321' });
    });
  });

  describe('at', () => {
    it('should return contract method', async () => {
      mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
      mockRpcClient.getEntrypoints.mockResolvedValue({
        entrypoints: {
          mint: { prim: 'pair', args: [{ prim: 'key' }, { prim: 'nat' }] },
        },
      });
      mockRpcClient.preapplyOperations.mockResolvedValue([]);
      mockRpcClient.getContract.mockResolvedValue({
        counter: 0,
        script: {
          code: tokenCode,
          storage: tokenInit,
        },
      });
      mockRpcClient.getBlockMetadata.mockResolvedValue({
        next_protocol: 'PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU',
      });
      mockSigner.sign.mockResolvedValue({ sbytes: 'test', prefixSig: 'test_sig' });
      mockSigner.publicKey.mockResolvedValue('test_pub_key');
      mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
      const result = await rpcContractProvider.at('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D');
      expect(result.methodsObject.mint({ 0: 'test', 1: 100 })).toBeInstanceOf(ContractMethodObject);
    });
  });

  describe('Storage', () => {
    it('should have defined storage with TicketTokens without errors', async () => {
      mockRpcClient.getEntrypoints.mockResolvedValue({
        entrypoints: {},
      });
      mockRpcClient.getContract.mockResolvedValue(ticketTokenTestMock);
      const rpcContract = await rpcContractProvider.at('KT19mzgsjrR2Er4rm4vuDqAcMfBF5DBMs2uq');
      const storage = (await rpcContract.storage()) as any;
      expect(rpcContract).toBeDefined();

      const keyList = storage.keyMap;
      expect(keyList.size).toEqual(3);
    });

    it('Should have defined storage with Nested bigmap in multiple maps', async () => {
      mockRpcClient.getEntrypoints.mockResolvedValue({
        entrypoints: {},
      });
      mockRpcClient.getContract.mockResolvedValue(smallNestedMapTypecheck);
      const rpcContract = await rpcContractProvider.at('KT1SpsNu3hGHN5T5Vt9g9GKUggzvBpxaLxq7');
      expect(rpcContract).toBeDefined();
      const storage = (await rpcContract.storage()) as any;

      const keyList = storage.keyMap;
      expect(keyList.size).toEqual(1);
    });
  });
});
