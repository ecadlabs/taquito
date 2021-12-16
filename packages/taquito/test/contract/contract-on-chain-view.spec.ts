import { ViewSchema } from '@taquito/michelson-encoder';
import { OnChainView } from '../../src/contract/contract-methods/contract-on-chain-view';
import BigNumber from 'bignumber.js';
import { InvalidViewParameterError, InvalidViewSimulationContext, ViewSimulationError } from '../../src/contract';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';

describe('OnChainView test', () => {
  let view: OnChainView;
    let mockRpcClient: {
        getChainId: jest.Mock<any, any>;
        getBalance: jest.Mock<any, any>;
        runCode: jest.Mock<any, any>;
    };
    beforeEach(() => {
        mockRpcClient = {
            getChainId: jest.fn(),
            getBalance: jest.fn(),
            runCode: jest.fn()
        };
        mockRpcClient.getChainId.mockResolvedValue('test_chain_id');
        mockRpcClient.getBalance.mockResolvedValue(new BigNumber(5000000));
        mockRpcClient.runCode.mockResolvedValue({storage: { prim: 'Some', args: [ { int: '23' } ] }, operations: []})
    
        view = new OnChainView(
          mockRpcClient as any,
          'contractAddress',
          new ViewSchema([ { string: 'add' }, { prim: 'nat' }, { prim: 'nat' }, [ { prim: 'UNPAIR' }, { prim: 'ADD' } ] ]),
          { prim: 'nat' },
          {int: '3'},
          20
      )
      })

  it('OnChainView is instantiable', () => {
    expect(view).toBeInstanceOf(OnChainView);
  });

  it('should extract the signature of the view', () => {
    expect(view.getSignature()).toEqual({
      parameter: 'nat',
      result: 'nat'
    });
  });

  it('should execute of the view', async (done) => {
    expect(await view.executeView({
      viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH'
    })).toEqual(new BigNumber(23));

    expect(mockRpcClient.getBalance).toHaveBeenCalledWith('contractAddress');
    expect(mockRpcClient.runCode).toHaveBeenCalledWith({
      script: [
        { prim: 'parameter', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'nat' }] }] },
            { prim: 'storage', args: [{ prim: 'option', args: [{ prim: 'nat' }] }] },
            {
                prim: 'code',
                args: [
                    [
                        { prim: 'CAR' },
                        [ { prim: 'UNPAIR' }, { prim: 'ADD' } ],
                        { prim: 'SOME' },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' }
                    ]
                ]
            }
      ],
      storage: { prim: 'None' },
      input: { prim: 'Pair', args:[{ int: '20' }, { int: '3' }]},
      amount: '0',
      balance: '5000000',
      chain_id: 'test_chain_id'
    });

    done();
  });

  it('should adapt the instructions SENDER, SELF_ADDRESS, BALANCE and AMOUNT to the context before executing the view', async (done) => {
    const view = new OnChainView(
      mockRpcClient as any,
      'contractAddress',
      new ViewSchema([ { string: 'viewName' }, { prim: 'nat' }, { prim: 'nat' }, [
      { prim: 'SENDER' },
      { prim: 'SELF_ADDRESS' },
      { prim: 'BALANCE' },
      { prim: 'AMOUNT' }
    ] ]),
      { prim: 'nat' },
      {int: '3'},
      20
  )
    await view.executeView({
      viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH'
    })

    expect(mockRpcClient.getBalance).toHaveBeenCalledWith('contractAddress');
    expect(mockRpcClient.runCode).toHaveBeenCalledWith({
      script: [
        { prim: 'parameter', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'nat' }] }] },
            { prim: 'storage', args: [{ prim: 'option', args: [{ prim: 'nat' }] }] },
            {
                prim: 'code',
                args: [
                    [
                        { prim: 'CAR' },
                        [ [{ prim: 'PUSH', args: [{ prim: 'address' }, { string: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH' }] }],
                        [{ prim: 'PUSH', args: [{ prim: 'address' }, { string: 'contractAddress' }]}],
                        [{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '5000000' }] }],
                        [{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] }]
                       ],
                        { prim: 'SOME' },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' }
                    ]
                ]
            }
      ],
      storage: { prim: 'None' },
      input: { prim: 'Pair', args:[{ int: '20' }, { int: '3' }]},
      amount: '0',
      balance: '5000000',
      chain_id: 'test_chain_id'
    });

    done();
  });

  it('should adapt the view instructions to the context before executing it when there are nested instructions to replace', async (done) => {
    // All occurences of `{ prim: 'SELF_ADDRESS' }` in the view instructions need to be replace with `[{ prim: 'PUSH', args: [{ prim: 'address' }, { string: 'contractAddress' }] }]`
    const view = new OnChainView(
      mockRpcClient as any,
      'contractAddress',
      new ViewSchema([ 
        { string: 'viewName' }, 
        { prim: 'nat' }, 
        { prim: 'nat' }, 
      [
				{ prim: 'CAR' },
				{ prim: 'DUP' },
				{ prim: 'PUSH', args: [ { prim: 'nat' }, { int: '0' } ] },
				{ prim: 'COMPARE' },
				{ prim: 'EQ' },
				{
					prim: 'IF',
					args: [
						[],
						[
							{ prim: 'DUP' },
							{ prim: 'PUSH', args: [ { prim: 'nat' }, { int: '1' } ] },
							{ prim: 'COMPARE' },
							{ prim: 'EQ' },
							{
								prim: 'IF',
								args: [
									[],
									[
										{ prim: 'DUP' },
										{ prim: 'PUSH', args: [ { prim: 'nat' }, { int: '1' } ] },
										{ prim: 'SWAP' },
										{ prim: 'SUB' },
										{ prim: 'ABS' },
										{ prim: 'SELF_ADDRESS' },
										{ prim: 'SWAP' },
										{ prim: 'VIEW', args: [ { string: 'fib' }, { prim: 'nat' } ] },
										[
											{
												prim: 'IF_NONE',
												args: [
													[ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ],
													[
														{ prim: 'SWAP' },
														{ prim: 'PUSH', args: [ { prim: 'nat' }, { int: '2' } ] },
														{ prim: 'SWAP' },
														{ prim: 'SUB' },
														{ prim: 'ABS' },
														{ prim: 'SELF_ADDRESS' },
														{ prim: 'SWAP' },
														{ prim: 'VIEW', args: [ { string: 'fib' }, { prim: 'nat' } ] },
														[
															{
																prim: 'IF_NONE',
																args: [
																	[ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ],
																	[ { prim: 'ADD' } ]
																]
															}
														]
													]
												]
											}
										]
									]
								]
							}
						]
					]
				}
			]
    ]),
      { prim: 'nat' },
      {int: '3'},
      20
  )
    await view.executeView({
      viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH'
    })

    expect(mockRpcClient.getBalance).toHaveBeenCalledWith('contractAddress');
    expect(mockRpcClient.runCode).toHaveBeenCalledWith({
      script: [
        { prim: 'parameter', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'nat' }] }] },
            { prim: 'storage', args: [{ prim: 'option', args: [{ prim: 'nat' }] }] },
            {
                prim: 'code',
                args: [
                    [
                        { prim: 'CAR' },
                        [
                          { prim: 'CAR' },
                          { prim: 'DUP' },
                          { prim: 'PUSH', args: [ { prim: 'nat' }, { int: '0' } ] },
                          { prim: 'COMPARE' },
                          { prim: 'EQ' },
                          {
                            prim: 'IF',
                            args: [
                              [],
                              [
                                { prim: 'DUP' },
                                { prim: 'PUSH', args: [ { prim: 'nat' }, { int: '1' } ] },
                                { prim: 'COMPARE' },
                                { prim: 'EQ' },
                                {
                                  prim: 'IF',
                                  args: [
                                    [],
                                    [
                                      { prim: 'DUP' },
                                      { prim: 'PUSH', args: [ { prim: 'nat' }, { int: '1' } ] },
                                      { prim: 'SWAP' },
                                      { prim: 'SUB' },
                                      { prim: 'ABS' },
                                      [{ prim: 'PUSH', args: [{ prim: 'address' }, { string: 'contractAddress' }] }],
                                      { prim: 'SWAP' },
                                      { prim: 'VIEW', args: [ { string: 'fib' }, { prim: 'nat' } ] },
                                      [
                                        {
                                          prim: 'IF_NONE',
                                          args: [
                                            [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ],
                                            [
                                              { prim: 'SWAP' },
                                              { prim: 'PUSH', args: [ { prim: 'nat' }, { int: '2' } ] },
                                              { prim: 'SWAP' },
                                              { prim: 'SUB' },
                                              { prim: 'ABS' },
                                              [{ prim: 'PUSH', args: [{ prim: 'address' }, { string: 'contractAddress' }] }],
                                              { prim: 'SWAP' },
                                              { prim: 'VIEW', args: [ { string: 'fib' }, { prim: 'nat' } ] },
                                              [
                                                {
                                                  prim: 'IF_NONE',
                                                  args: [
                                                    [ [ { prim: 'UNIT' }, { prim: 'FAILWITH' } ] ],
                                                    [ { prim: 'ADD' } ]
                                                  ]
                                                }
                                              ]
                                            ]
                                          ]
                                        }
                                      ]
                                    ]
                                  ]
                                }
                              ]
                            ]
                          }
                        ],
                        { prim: 'SOME' },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' }
                    ]
                ]
            }
      ],
      storage: { prim: 'None' },
      input: { prim: 'Pair', args:[{ int: '20' }, { int: '3' }]},
      amount: '0',
      balance: '5000000',
      chain_id: 'test_chain_id'
    });

    done();
  });

  it('should throw an error if the caller of the view is an invalid contract address', async (done) => {
    try {
     await view.executeView({
        viewCaller: 'notAnAddress'
      })
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidViewSimulationContext);
    }
    done();
  });

  it('should throw an error if an invalid address is set as the source of the view', async (done) => {
    try {
     await view.executeView({
        source: 'notAnAddress',
        viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH'
      })
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidViewSimulationContext);
    }
    done();
  });

  it('should throw an error if the view response is invalid', async (done) => {
    mockRpcClient.runCode.mockResolvedValue({storage: {}, operations: []})
    try {
     await view.executeView({
        viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH'
      })
    } catch (error) {
      expect(error).toBeInstanceOf(ViewSimulationError);
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
    mockRpcClient.runCode.mockRejectedValue(httpError);

    try {
      await view.executeView({
        viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH'
      })
    } catch(error: any) {
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
    mockRpcClient.runCode.mockRejectedValue(httpError);

    try {
      await view.executeView({
        viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH'
      })
    } catch(error: any) {
      expect(error).toBeInstanceOf(ViewSimulationError);
      expect(error.message).toEqual('The simulation of the on-chain view named add failed with: {"prim":"Unit"}');
      expect(error.originalError).toEqual(httpError);
    }

    done();
  });

  it('should throw a InvalidViewParameterError error if the parameter of the view is invalid', async (done) => {
    view = new OnChainView(
      mockRpcClient as any,
      'contractAddress',
      new ViewSchema([ { string: 'add' }, { prim: 'nat' }, { prim: 'nat' }, [ { prim: 'UNPAIR' }, { prim: 'ADD' } ] ]),
      { prim: 'nat' },
      {int: '3'},
      'test'
  )
    try {
     await view.executeView({
        viewCaller: 'KT1TRHzT3HdLe3whe35q6rNxavGx8WVFHSpH'
      })
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidViewParameterError);
    }
    done();
  });

});
