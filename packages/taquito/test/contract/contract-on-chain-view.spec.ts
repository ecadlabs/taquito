import { ViewSchema } from '@taquito/michelson-encoder';
import { OnChainView } from '../../src/contract/contract-methods/contract-on-chain-view';
import BigNumber from 'bignumber.js';
import {
  InvalidViewParameterError,
  InvalidViewSimulationContext,
  ViewSimulationError,
} from '../../src/contract';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { Context } from '../../src/context';
import { RpcReadAdapter } from '../../src/read-provider/rpc-read-adapter';

describe('OnChainView test', () => {
  let view: OnChainView;
  let mockRpcClient: {
    getChainId: jest.Mock<any, any>;
    runScriptView: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
  };
  let mockReadProvider: any;
  beforeEach(() => {
    mockRpcClient = {
      getChainId: jest.fn(),
      runScriptView: jest.fn(),
      getStorage: jest.fn(),
    };
    mockRpcClient.getChainId.mockResolvedValue('test_chain_id');

    mockRpcClient.runScriptView.mockResolvedValue({
      data: { int: '23' },
    });
    mockRpcClient.getStorage.mockResolvedValue({ int: '3' });

    const context = new Context(mockRpcClient as any);
    mockReadProvider = new RpcReadAdapter(context);

    view = new OnChainView(
      mockRpcClient as any,
      mockReadProvider,
      'contractAddress',
      new ViewSchema([
        { string: 'add' },
        { prim: 'nat' },
        { prim: 'nat' },
        [{ prim: 'UNPAIR' }, { prim: 'ADD' }],
      ]),
      { prim: 'nat' },
      20
    );
  });

  it('OnChainView is instantiable', () => {
    expect(view).toBeInstanceOf(OnChainView);
  });

  it('should extract the signature of the view', () => {
    expect(view.getSignature()).toEqual({
      parameter: 'nat',
      result: 'nat',
    });
  });

  it('should execute of the view', async (done) => {
    expect(
      await view.executeView({
        viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH',
      })
    ).toEqual(new BigNumber(23));

    expect(mockRpcClient.runScriptView).toHaveBeenCalledWith({
      contract: 'contractAddress',
      view: 'add',
      input: { int: '20' },
      chain_id: 'test_chain_id',
      source: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH',
    });

    done();
  });

  it('should adapt the instructions SENDER, SELF_ADDRESS, BALANCE and AMOUNT to the context before executing the view', async (done) => {
    const view = new OnChainView(
      mockRpcClient as any,
      mockReadProvider,
      'contractAddress',
      new ViewSchema([
        { string: 'viewName' },
        { prim: 'nat' },
        { prim: 'nat' },
        [{ prim: 'SENDER' }, { prim: 'SELF_ADDRESS' }, { prim: 'BALANCE' }, { prim: 'AMOUNT' }],
      ]),
      { prim: 'nat' },
      20
    );
    await view.executeView({
      viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH',
    });
    expect(mockRpcClient.runScriptView).toHaveBeenCalledWith({
      contract: 'contractAddress',
      view: 'viewName',
      input: { int: '20' },
      chain_id: 'test_chain_id',
      source: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH',
    });

    done();
  });

  it('should adapt the view instructions to the context before executing it when there are nested instructions to replace', async (done) => {
    // All occurences of `{ prim: 'SELF_ADDRESS' }` in the view instructions need to be replace with `[{ prim: 'PUSH', args: [{ prim: 'address' }, { string: 'contractAddress' }] }]`
    const view = new OnChainView(
      mockRpcClient as any,
      mockReadProvider,
      'contractAddress',
      new ViewSchema([
        { string: 'viewName' },
        { prim: 'nat' },
        { prim: 'nat' },
        [
          { prim: 'CAR' },
          { prim: 'DUP' },
          { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
          { prim: 'COMPARE' },
          { prim: 'EQ' },
          {
            prim: 'IF',
            args: [
              [],
              [
                { prim: 'DUP' },
                { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
                { prim: 'COMPARE' },
                { prim: 'EQ' },
                {
                  prim: 'IF',
                  args: [
                    [],
                    [
                      { prim: 'DUP' },
                      { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
                      { prim: 'SWAP' },
                      { prim: 'SUB' },
                      { prim: 'ABS' },
                      { prim: 'SELF_ADDRESS' },
                      { prim: 'SWAP' },
                      { prim: 'VIEW', args: [{ string: 'fib' }, { prim: 'nat' }] },
                      [
                        {
                          prim: 'IF_NONE',
                          args: [
                            [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]],
                            [
                              { prim: 'SWAP' },
                              { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '2' }] },
                              { prim: 'SWAP' },
                              { prim: 'SUB' },
                              { prim: 'ABS' },
                              { prim: 'SELF_ADDRESS' },
                              { prim: 'SWAP' },
                              { prim: 'VIEW', args: [{ string: 'fib' }, { prim: 'nat' }] },
                              [
                                {
                                  prim: 'IF_NONE',
                                  args: [
                                    [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]],
                                    [{ prim: 'ADD' }],
                                  ],
                                },
                              ],
                            ],
                          ],
                        },
                      ],
                    ],
                  ],
                },
              ],
            ],
          },
        ],
      ]),
      { prim: 'nat' },
      20
    );
    await view.executeView({
      viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH',
    });

    expect(mockRpcClient.runScriptView).toHaveBeenCalledWith({
      contract: 'contractAddress',
      view: 'viewName',
      input: { int: '20' },
      chain_id: 'test_chain_id',
      source: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH',
    });

    done();
  });

  it('should throw an error if the caller of the view is an invalid contract address', async (done) => {
    try {
      await view.executeView({
        viewCaller: 'notAnAddress',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidViewSimulationContext);
    }
    done();
  });

  it('should throw an error if an invalid address is set as the source of the view', async (done) => {
    try {
      await view.executeView({
        source: 'notAnAddress',
        viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidViewSimulationContext);
    }
    done();
  });

  it('should throw the original error when it does not contain a "with" property', async (done) => {
    const httpError = new HttpResponseError(
      'fail',
      STATUS_CODE.FORBIDDEN,
      'err',
      'test',
      'https://test.com'
    );
    mockRpcClient.runScriptView.mockRejectedValue(httpError);

    try {
      await view.executeView({
        viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH',
      });
    } catch (error: any) {
      expect(error).toBeInstanceOf(HttpResponseError);
    }

    done();
  });

  it('should throw a ViewSimulationError error with a detailed message if the view simulation reaches a failwith instruction', async (done) => {
    const httpError = new HttpResponseError(
      'fail',
      STATUS_CODE.FORBIDDEN,
      'err',
      '[{},{"kind":"temporary","with":{"prim":"Unit"}}]',
      'https://test.com'
    );
    mockRpcClient.runScriptView.mockRejectedValue(httpError);

    try {
      await view.executeView({
        viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH',
      });
    } catch (error: any) {
      expect(error).toBeInstanceOf(ViewSimulationError);
      expect(error.message).toEqual(
        'The simulation of the on-chain view named add failed with: {"prim":"Unit"}'
      );
      expect(error.viewName).toEqual('add');
      expect(error.failWith).toEqual({ prim: 'Unit' });
      expect(error.originalError).toEqual(httpError);
    }

    done();
  });

  it('should throw a InvalidViewParameterError error if the parameter of the view is invalid', async (done) => {
    view = new OnChainView(
      mockRpcClient as any,
      mockReadProvider,
      'contractAddress',
      new ViewSchema([
        { string: 'add' },
        { prim: 'nat' },
        { prim: 'nat' },
        [{ prim: 'UNPAIR' }, { prim: 'ADD' }],
      ]),
      { prim: 'nat' },
      'test'
    );
    try {
      await view.executeView({
        viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidViewParameterError);
    }
    done();
  });
});
