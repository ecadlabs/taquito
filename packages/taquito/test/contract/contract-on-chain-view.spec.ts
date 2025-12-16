import { ViewSchema } from '@taquito/michelson-encoder';
import { OnChainView } from '../../src/contract/contract-methods/contract-on-chain-view';
import BigNumber from 'bignumber.js';
import { InvalidViewSimulationContext, ViewSimulationError } from '../../src/contract';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { RpcReadAdapter } from '../../src/read-provider/rpc-read-adapter';
import { Protocols } from '../../src/constants';
import { InvalidViewParameterError } from '@taquito/core';

describe('OnChainView test on K protocol', () => {
  let view: OnChainView;
  let mockRpcClient: {
    getProtocols: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
    runScriptView: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
  };
  let mockReadProvider: any;
  beforeEach(() => {
    mockRpcClient = {
      getProtocols: jest.fn(),
      getChainId: jest.fn(),
      runScriptView: jest.fn(),
      getStorage: jest.fn(),
    };

    mockRpcClient.getProtocols.mockResolvedValue({ protocol: Protocols.PtKathman });

    mockRpcClient.getChainId.mockResolvedValue('test_chain_id');

    mockRpcClient.runScriptView.mockResolvedValue({
      data: { int: '23' },
    });
    mockRpcClient.getStorage.mockResolvedValue({ int: '3' });

    mockReadProvider = new RpcReadAdapter(mockRpcClient as any);

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
      parameter: { __michelsonType: 'nat', schema: 'nat' },
      result: { __michelsonType: 'nat', schema: 'nat' },
    });
  });

  it('should execute of the view', async () => {
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
  });

  it('should throw an error if the caller of the view is an invalid contract address', async () => {
    try {
      await view.executeView({
        viewCaller: 'notAnAddress',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidViewSimulationContext);
    }
  });

  it('should throw an error if an invalid address is set as the source of the view', async () => {
    try {
      await view.executeView({
        source: 'notAnAddress',
        viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidViewSimulationContext);
    }
  });

  it('should throw the original error when it does not contain a "with" property', async () => {
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
  });

  it('should throw a ViewSimulationError error with a detailed message if the view simulation reaches a failwith instruction', async () => {
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
      expect(error.cause).toEqual(httpError);
    }
  });

  it('should throw a InvalidViewParameterError error if the parameter of the view is invalid', async () => {
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
  });
});
