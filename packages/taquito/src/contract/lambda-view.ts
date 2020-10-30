import { MichelsonV1Expression } from '@taquito/rpc';
import { Contract } from './contract';
import { TezosOperationError } from '../operations/operation-errors';

export default class LambdaView {
  public readonly voidLambda: Object;

  constructor(
    private lambdaContract: Contract,
    private viewContract: Contract,
    public readonly viewMethod: string = 'default',
    private contractParameter: MichelsonV1Expression = { prim: 'Unit' }
  ) {
    this.voidLambda = this.createVoidLambda();
  }

  async execute(): Promise<any> {
    try {
      await this.lambdaContract.methods.default(this.voidLambda).send();
    } catch (ex) {
      if (ex instanceof TezosOperationError) {
        const lastError: any = ex.errors[ex.errors.length - 1];

        const failedWith = lastError.with;
        return failedWith;
      }
    }
  }

  private createVoidLambda(): Object {
    const [parameter, callback] = this.getView();

    let contractArgs: MichelsonV1Expression[] = [
      {
        prim: 'pair',
        args: [parameter, { prim: 'contract', args: [callback] }],
      },
    ];

    if (this.viewMethod === 'default') {
      contractArgs = ([{ string: '%default' }] as MichelsonV1Expression[]).concat(contractArgs);
    }

    return [
      { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
      { prim: 'NONE', args: [{ prim: 'key_hash' }] },
      {
        prim: 'CREATE_CONTRACT',
        args: [
          [
            { prim: 'parameter', args: [callback] },
            { prim: 'storage', args: [{ prim: 'unit' }] },
            {
              prim: 'code',
              args: [[{ prim: 'CAR' }, { prim: 'FAILWITH' }]],
            },
          ],
        ],
      },
      {
        prim: 'DIP',
        args: [
          [
            {
              prim: 'DIP',
              args: [
                [
                  {
                    prim: 'LAMBDA',
                    args: [
                      {
                        prim: 'pair',
                        args: [{ prim: 'address' }, { prim: 'unit' }],
                      },
                      {
                        prim: 'pair',
                        args: [{ prim: 'list', args: [{ prim: 'operation' }] }, { prim: 'unit' }],
                      },
                      [
                        { prim: 'CAR' },
                        { prim: 'CONTRACT', args: [callback] },
                        {
                          prim: 'IF_NONE',
                          args: [
                            [
                              {
                                prim: 'PUSH',
                                args: [{ prim: 'string' }, { string: `Callback type unmatched` }],
                              },
                              { prim: 'FAILWITH' },
                            ],
                            [],
                          ],
                        },
                        {
                          prim: 'PUSH',
                          args: [parameter, this.contractParameter],
                        },
                        { prim: 'PAIR' },
                        {
                          prim: 'DIP',
                          args: [
                            [
                              {
                                prim: 'PUSH',
                                args: [
                                  { prim: 'address' },
                                  { string: `${this.viewContract.address}%${this.viewMethod}` },
                                ],
                              },
                              { prim: 'DUP' },
                              { prim: 'CONTRACT', args: contractArgs },
                              {
                                prim: 'IF_NONE',
                                args: [
                                  [
                                    {
                                      prim: 'PUSH',
                                      args: [
                                        { prim: 'string' },
                                        { string: `Contract does not exist` },
                                      ],
                                    },
                                    { prim: 'FAILWITH' },
                                  ],
                                  [{ prim: 'DIP', args: [[{ prim: 'DROP' }]] }],
                                ],
                              },
                              {
                                prim: 'PUSH',
                                args: [{ prim: 'mutez' }, { int: '0' }],
                              },
                            ],
                          ],
                        },
                        { prim: 'TRANSFER_TOKENS' },
                        {
                          prim: 'DIP',
                          args: [[{ prim: 'NIL', args: [{ prim: 'operation' }] }]],
                        },
                        { prim: 'CONS' },
                        { prim: 'DIP', args: [[{ prim: 'UNIT' }]] },
                        { prim: 'PAIR' },
                      ],
                    ],
                  },
                ],
              ],
            },
            { prim: 'APPLY' },
            {
              prim: 'DIP',
              args: [
                [
                  {
                    prim: 'PUSH',
                    args: [{ prim: 'address' }, { string: this.lambdaContract.address }],
                  },
                  { prim: 'DUP' },
                  {
                    prim: 'CONTRACT',
                    args: [
                      {
                        prim: 'lambda',
                        args: [
                          { prim: 'unit' },
                          {
                            prim: 'pair',
                            args: [
                              { prim: 'list', args: [{ prim: 'operation' }] },
                              { prim: 'unit' },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    prim: 'IF_NONE',
                    args: [
                      [
                        {
                          prim: 'PUSH',
                          args: [{ prim: 'string' }, { string: `Contract does not exists` }],
                        },
                        { prim: 'FAILWITH' },
                      ],
                      [{ prim: 'DIP', args: [[{ prim: 'DROP' }]] }],
                    ],
                  },
                  { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
                ],
              ],
            },
            { prim: 'TRANSFER_TOKENS' },
            {
              prim: 'DIP',
              args: [[{ prim: 'NIL', args: [{ prim: 'operation' }] }]],
            },
            { prim: 'CONS' },
          ],
        ],
      },
      { prim: 'CONS' },
      { prim: 'DIP', args: [[{ prim: 'UNIT' }]] },
      { prim: 'PAIR' },
    ];
  }

  private getView(): [MichelsonV1Expression, MichelsonV1Expression] {
    const entrypoints = this.viewContract.entrypoints.entrypoints;
    const entrypoint = entrypoints[this.viewMethod] as MichelsonV1Expression;

    if (!entrypoint) {
      throw Error(
        `Contract at ${this.viewContract.address} does not have entrypoint: ${this.viewMethod}`
      );
    }

    if (!('prim' in entrypoint) || !entrypoint.args) {
      // TODO: Enhance this error message to be more descriptive
      throw Error('Entrypoint args undefined');
    }

    const args = Array.from(entrypoint.args) as [MichelsonV1Expression, MichelsonV1Expression];
    const [parameter, callbackContract] = args;

    if (!('prim' in callbackContract) || !callbackContract.args) {
      // TODO: Enhance this error message to be more descriptive
      throw Error('Callback contract args undefined');
    }

    let message;
    if (entrypoint.prim !== 'pair') {
      message = `Expected {'prim': 'pair', ..} but found {'prim': ${entrypoint.prim}, ..}`;
    } else if (args.length !== 2) {
      message = `Expected an Array of length 2, but found: ${args}`;
    } else if (callbackContract.prim !== 'contract') {
      message = `Expected a {prim: 'contract', ...}, but found: ${callbackContract.prim}`;
    } else if (callbackContract.args && callbackContract.args.length !== 1) {
      message = `Expected a single argument to 'contract', but found: ${callbackContract.args}`;
    }

    if (message) throw Error(message);

    return [parameter, callbackContract.args[0]] as [MichelsonV1Expression, MichelsonV1Expression];
  }
}

export enum DefaultLambdaAddresses {
  carthagenet = 'KT1VAy1o1FGiXYfD3YT7x7k5eF5HSHhmc1u6',
}
