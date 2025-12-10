/* eslint-disable @typescript-eslint/ban-types */
import { Context } from '../../src/context';
import { ContractAbstraction, MANAGER_LAMBDA } from '../../src/contract';
import { ContractMethodObject } from '../../src/contract/contract-methods/contract-method-object-param';
import { RpcContractProvider } from '../../src/contract/rpc-contract-provider';
import { noAnnotCode } from '../../../../integration-tests/data/token_without_annotation';
import { genericMultisig } from '../../../../integration-tests/data/multisig';
import { entrypointsGenericMultisig } from './data';
import { OnChainView } from '../../src/contract/contract-methods/contract-on-chain-view';
import { mainContractWithEvents } from '../data/main-contract-with-events';
import { mainContractWithDuplicateEvents } from '../data/main-contract-with-duplicate-events';

describe('ContractAbstraction test', () => {
  let rpcContractProvider: RpcContractProvider;
  let mockRpcClient: {};
  let mockReadProvider: {};
  let mockSigner: {};
  let mockEstimate: {};

  beforeEach(() => {
    mockRpcClient = {};
    mockReadProvider = {};
    mockSigner = {};
    mockEstimate = {};
    const context = new Context(mockRpcClient as any, mockSigner as any);
    context.readProvider = mockReadProvider as any;
    rpcContractProvider = new RpcContractProvider(context, mockEstimate as any);
  });

  describe('Calling the `toTransferParams` method on a `ContractMethodObject` should return the correct value', () => {
    it('calls the main method of a contract having annotations (genericMultisig where action is change_keys)', async () => {
      const contractAbs = new ContractAbstraction(
        'contractAddress',
        {
          code: genericMultisig,
          storage: {},
        },
        rpcContractProvider,
        rpcContractProvider,
        entrypointsGenericMultisig,
        mockRpcClient as any,
        mockReadProvider as any
      );

      const methodObjectMainChangeKeys = contractAbs.methodsObject.main({
        payload: {
          counter: 2,
          action: {
            // the chosen action is change_keys (rather than operation)
            change_keys: {
              threshold: 2,
              keys: ['edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g'],
            },
          },
        },
        sigs: [
          'sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd',
        ],
      });

      expect(methodObjectMainChangeKeys).toBeInstanceOf(ContractMethodObject);
      expect(methodObjectMainChangeKeys.getSignature()).toEqual({
        __michelsonType: 'pair',
        schema: {
          payload: {
            __michelsonType: 'pair',
            schema: {
              counter: { __michelsonType: 'nat', schema: 'nat' },
              action: {
                __michelsonType: 'or',
                schema: {
                  change_keys: {
                    __michelsonType: 'pair',
                    schema: {
                      threshold: { __michelsonType: 'nat', schema: 'nat' },
                      keys: {
                        __michelsonType: 'list',
                        schema: { __michelsonType: 'key', schema: 'key' },
                      },
                    },
                  },
                  operation: {
                    __michelsonType: 'lambda',
                    schema: {
                      parameters: { __michelsonType: 'unit', schema: 'unit' },
                      returns: {
                        __michelsonType: 'list',
                        schema: { __michelsonType: 'operation', schema: 'operation' },
                      },
                    },
                  },
                },
              },
            },
          },
          sigs: {
            __michelsonType: 'list',
            schema: {
              __michelsonType: 'option',
              schema: { __michelsonType: 'signature', schema: 'signature' },
            },
          },
        },
      });
      expect(methodObjectMainChangeKeys.toTransferParams()).toEqual({
        to: 'contractAddress',
        amount: 0,
        mutez: false,
        parameter: {
          entrypoint: 'main',
          value: {
            prim: 'Pair',
            args: [
              {
                prim: 'Pair',
                args: [
                  {
                    int: '2',
                  },
                  {
                    prim: 'Right',
                    args: [
                      {
                        prim: 'Pair',
                        args: [
                          {
                            int: '2',
                          },
                          [
                            {
                              string: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
                            },
                          ],
                        ],
                      },
                    ],
                  },
                ],
              },
              [
                {
                  prim: 'Some',
                  args: [
                    {
                      string:
                        'sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd',
                    },
                  ],
                },
              ],
            ],
          },
        },
      });
    });

    it('calls the main method of a contract having annotations (genericMultisig where action is operation)', async () => {
      const contractAbs = new ContractAbstraction(
        'contractAddress',
        {
          code: genericMultisig,
          storage: {},
        },
        rpcContractProvider,
        rpcContractProvider,
        entrypointsGenericMultisig,
        mockRpcClient as any,
        mockReadProvider as any
      );

      const methodObjectMainoperation = contractAbs.methodsObject.main({
        payload: {
          counter: 2,
          action: {
            // the chosen action is operation (rather than change_keys)
            operation: MANAGER_LAMBDA.transferImplicit('tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh', 500),
          },
        },
        sigs: [
          'sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd',
        ],
      });

      expect(methodObjectMainoperation).toBeInstanceOf(ContractMethodObject);

      expect(methodObjectMainoperation.toTransferParams()).toEqual({
        to: 'contractAddress',
        amount: 0,
        mutez: false,
        parameter: {
          entrypoint: 'main',
          value: {
            prim: 'Pair',
            args: [
              {
                prim: 'Pair',
                args: [
                  {
                    int: '2',
                  },
                  {
                    prim: 'Left',
                    args: [
                      [
                        {
                          prim: 'DROP',
                        },
                        {
                          prim: 'NIL',
                          args: [
                            {
                              prim: 'operation',
                            },
                          ],
                        },
                        {
                          prim: 'PUSH',
                          args: [
                            {
                              prim: 'key_hash',
                            },
                            {
                              string: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
                            },
                          ],
                        },
                        {
                          prim: 'IMPLICIT_ACCOUNT',
                        },
                        {
                          prim: 'PUSH',
                          args: [
                            {
                              prim: 'mutez',
                            },
                            {
                              int: '500',
                            },
                          ],
                        },
                        {
                          prim: 'UNIT',
                        },
                        {
                          prim: 'TRANSFER_TOKENS',
                        },
                        {
                          prim: 'CONS',
                        },
                      ],
                    ],
                  },
                ],
              },
              [
                {
                  prim: 'Some',
                  args: [
                    {
                      string:
                        'sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd',
                    },
                  ],
                },
              ],
            ],
          },
        },
      });
    });

    it('calls the first entry point (0) of a contract having no annotation', async () => {
      const contractAbs = new ContractAbstraction(
        'contractAddress',
        {
          code: noAnnotCode,
          storage: [],
        },
        rpcContractProvider,
        rpcContractProvider,
        { entrypoints: {} },
        mockRpcClient as any,
        mockReadProvider as any
      );

      const methodObject0 = contractAbs.methodsObject[0]({
        0: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        1: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        2: '1',
      });
      expect(methodObject0).toBeInstanceOf(ContractMethodObject);
      expect(methodObject0.getSignature()).toEqual({
        __michelsonType: 'pair',
        schema: {
          '0': { __michelsonType: 'address', schema: 'address' },
          '1': { __michelsonType: 'address', schema: 'address' },
          '2': { __michelsonType: 'nat', schema: 'nat' },
        },
      });

      expect(methodObject0.toTransferParams()).toEqual({
        to: 'contractAddress',
        amount: 0,
        mutez: false,
        parameter: {
          entrypoint: 'default',
          value: {
            prim: 'Left',
            args: [
              {
                prim: 'Left',
                args: [
                  {
                    prim: 'Left',
                    args: [
                      {
                        prim: 'Pair',
                        args: [
                          {
                            string: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                          },
                          {
                            prim: 'Pair',
                            args: [
                              {
                                string: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                              },
                              {
                                int: '1',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      });
    });

    it('calls the third entry point (2) of a contract having no annotation', async () => {
      const contractAbs = new ContractAbstraction(
        'contractAddress',
        {
          code: noAnnotCode,
          storage: [],
        },
        rpcContractProvider,
        rpcContractProvider,
        { entrypoints: {} },
        mockRpcClient as any,
        mockReadProvider as any
      );

      const methodObject = contractAbs.methodsObject[2]({
        0: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        1: '1',
      });
      expect(methodObject).toBeInstanceOf(ContractMethodObject);

      expect(methodObject.toTransferParams()).toEqual({
        to: 'contractAddress',
        amount: 0,
        mutez: false,
        parameter: {
          entrypoint: 'default',
          value: {
            prim: 'Left',
            args: [
              {
                prim: 'Left',
                args: [
                  {
                    prim: 'Right',
                    args: [
                      {
                        prim: 'Right',
                        args: [
                          {
                            prim: 'Pair',
                            args: [
                              {
                                string: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                              },
                              {
                                int: '1',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      });
    });
  });

  describe('On-chain views initialization', () => {
    const fakeScriptWithViews = {
      code: [
        {
          prim: 'view',
          args: [
            { string: 'add' },
            { prim: 'nat' },
            { prim: 'nat' },
            [{ prim: 'UNPAIR' }, { prim: 'ADD' }],
          ],
        },
        {
          prim: 'view',
          args: [
            { string: 'id' },
            { prim: 'nat' },
            { prim: 'pair', args: [{ prim: 'nat' }, { prim: 'nat' }] },
            [],
          ],
        },
        { prim: 'parameter', args: [{ prim: 'nat' }] },
        { prim: 'storage', args: [{ prim: 'nat' }] },
        { prim: 'code', args: [] },
      ],
      storage: [{ int: '2' }],
    };

    it('populate the contractViews member with a function matching each view name from the script', async () => {
      const contractAbs = new ContractAbstraction(
        'contractAddress',
        fakeScriptWithViews,
        rpcContractProvider,
        rpcContractProvider,
        { entrypoints: {} },
        mockRpcClient as any,
        mockReadProvider as any
      );

      expect(Object.keys(contractAbs.contractViews).length).toEqual(2);

      const viewAdd = contractAbs.contractViews.add();
      expect(viewAdd).toBeInstanceOf(OnChainView);

      const viewId = contractAbs.contractViews.id();
      expect(viewId).toBeInstanceOf(OnChainView);
    });

    it('contract events should be extracted properly', async () => {
      const contractAbs = new ContractAbstraction(
        'contractAddress',
        mainContractWithEvents,
        rpcContractProvider,
        rpcContractProvider,
        { entrypoints: {} },
        mockRpcClient as any,
        mockReadProvider as any
      );

      expect(contractAbs.eventSchema.length).toEqual(2);

      expect(contractAbs.eventSchema[0].tag).toEqual('%intFromMainContract');
      expect(contractAbs.eventSchema[0].type?.prim).toEqual('int');

      expect(contractAbs.eventSchema[1].tag).toEqual('%stringFromMainContract');
      expect(contractAbs.eventSchema[1].type?.prim).toEqual('string');
    });

    it('contract events should be extracted properly even if there are duplicates', async () => {
      const contractAbs = new ContractAbstraction(
        'contractAddress',
        mainContractWithDuplicateEvents,
        rpcContractProvider,
        rpcContractProvider,
        { entrypoints: {} },
        mockRpcClient as any,
        mockReadProvider as any
      );

      expect(contractAbs.eventSchema.length).toEqual(3);

      expect(contractAbs.eventSchema[0].tag).toEqual('%tagOneOnlyIntRepeated');
      expect(contractAbs.eventSchema[0].type?.prim).toEqual('int');

      expect(contractAbs.eventSchema[1].tag).toEqual('%tagTwoIntAndString');
      expect(contractAbs.eventSchema[1].type?.prim).toEqual('string');

      expect(contractAbs.eventSchema[2].tag).toEqual('%tagTwoIntAndString');
      expect(contractAbs.eventSchema[2].type?.prim).toEqual('int');
    });
  });
});
