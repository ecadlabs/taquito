import { opMapping, ForgeParams } from '@taquito/local-forging';
import {
  rpcContractResponse,
  rpcContractResponse2,
  rpcContractResponse4,
  rpcContractResponse5,
  rpcContractResponse7,
  example9,
  example10,
} from './code_with_sapling';
import { isImplicitAccountCode, isImplicitAccountStorage } from './code_with_is_implicit_account';
import { ticketCode, ticketStorage } from './code_with_ticket';
import { genericCode, genericStorage } from './generic_contract';
import { tokenBigmapCode, tokenBigmapStorage } from './token_bigmap';
import { noAnnotCode, noAnnotInit } from './token_without_annotation';
import { voteInitSample, voteSample } from './vote-contract';
import { submutezCode, submutezStorage } from './contract_with_sub_mutez';
import {
  storageContractWithConstant,
  codeContractWithConstant,
} from './contract_with_constant';
import { codeViewsTopLevel, storageViewsTopLevel } from './contract_views_top_level';
import { MichelsonV1Expression, OpKind, PvmKind } from '@taquito/rpc';
import { emitCode } from './code_with_emit';
import { lambdaRecCode } from './code_with_lambda_rec';
import { timelockCode, timelockStorage, timelockExpected } from './timelock-flip-contract';

function extractOp(
  startIndex: number,
  endIndex: number,
  opMap: {
    [key: string]: string;
  }
) {
  const result: string[] = [];
  let i = startIndex;
  for (i; i <= endIndex; i++) {
    let key = i.toString(16);
    if (key.length === 1) {
      key = '0' + key;
    }
    result.push(opMap[key]);
  }
  return result;
}

interface TestCase {
  name: string;
  operation: ForgeParams;
  expected?: object;
}

export const commonCases: TestCase[] = [
  {
    name: 'Delegation with tz1 delegate',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.DELEGATION,
          delegate: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
        },
      ],
    },
  },
  {
    name: 'Delegation with tz2 delegate',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.DELEGATION,
          delegate: 'tz2J1jtUzAj4CdYKCh78ubARBiotbGKceXfb',
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
        },
      ],
    },
  },
  {
    name: 'Delegation with tz3 delegate',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.DELEGATION,
          delegate: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
        },
      ],
    },
  },
  {
    name: 'Delegation with tz4 delegate',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.DELEGATION,
          delegate: 'tz4EmMVfqF7NxZsJaofqPDR9xdmXSDWcKAM7',
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
        },
      ],
    },
  },
  {
    name: 'Reveal tz1',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.REVEAL,
          counter: '1',
          source: 'tz1WRxrFJDYNJYMJiqLAeS2QCg9SwXJt4QYD',
          public_key: 'edpkuh8bYRPTrSCUUKmPSGg9WtVQiqHpEE4buEk7jynbenvQdaHTTD',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
        },
      ],
    },
  },
  {
    name: 'Reveal tz2',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.REVEAL,
          counter: '1',
          source: 'tz2JKWBpoLTR7Yxe3Vgpqpk9Ch8HSBeYBEdF',
          public_key: 'sppk7ccMwYw4ZoJL3QUFnt4GfWYn9R15fwNHP47AyivsLurGtEkDHKw',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
        },
      ],
    },
  },
  {
    name: 'Reveal tz3',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.REVEAL,
          counter: '1',
          source: 'tz3YchCjUWXRvZKnU6xZoFeJeEkWQTrhvVYi',
          public_key: 'p2pk678THitX2ewSXAA4KPJVFAMbfQZkp8XyjEh1RN4ynXbA9sbf1i9',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
        },
      ],
    },
  },
  {
    name: 'Ballot',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.BALLOT,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          period: -300,
          ballot: 'yay',
          proposal: 'PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb',
        },
      ],
    },
  },
  {
    name: 'Seed nonce revelation',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.SEED_NONCE_REVELATION,
          level: 25550,
          nonce: new Array(32).fill('ff').join(''),
        },
      ],
    },
  },
  {
    name: 'Set deposits limit 1000000',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.SET_DEPOSITS_LIMIT,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          limit: '1000000',
        },
      ],
    },
  },
  {
    name: 'Unset deposits limit',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.SET_DEPOSITS_LIMIT,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10'
        },
      ],
    },
  },
  {
    name: 'Proposals',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.PROPOSALS,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          period: 25550,
          proposals: [
            'PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb',
            'PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb',
          ],
        },
      ],
    },
  },
  {
    name: OpKind.TRANSACTION,
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with parameter',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'do',
            value: { bytes: '0202' },
          },
          destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with default entrypoint',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'default',
            value: { prim: 'Pair', args: [{ int: '2' }, { string: 'hello' }] },
          },
          destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with maximum length entrypoint',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'Tps0RV2UISBvTV6m2z16VnfCVnN5dzX',
            value: { prim: 'Pair', args: [{ int: '2' }, { string: 'hello' }] },
          },
          destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with non ascii entrypoint and string',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'entrypoint©Ͻ',
            value: { string: 'Copyright ©Ͻ' },
          },
          destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with default entrypoint and unit parameter',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'default',
            value: { prim: 'Unit' },
          },
          destination: 'KT1JHqHQdHSgWBKo6H4UfG8dw3JnZSyjGkHA',
          amount: '1000',
        },
      ],
    },
    expected: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          destination: 'KT1JHqHQdHSgWBKo6H4UfG8dw3JnZSyjGkHA',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with set_delegate entrypoint',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'set_delegate',
            value: { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' },
          },
          destination: 'KT1JHqHQdHSgWBKo6H4UfG8dw3JnZSyjGkHA',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with remove_delegate entrypoint',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'remove_delegate',
            value: { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' },
          },
          destination: 'KT1JHqHQdHSgWBKo6H4UfG8dw3JnZSyjGkHA',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with root entrypoint',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'root',
            value: { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' },
          },
          destination: 'KT1JHqHQdHSgWBKo6H4UfG8dw3JnZSyjGkHA',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with do entrypoint',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'do',
            value: { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' },
          },
          destination: 'KT1JHqHQdHSgWBKo6H4UfG8dw3JnZSyjGkHA',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with do entrypoint and unit',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'do',
            value: { prim: 'Unit' },
          },
          destination: 'KT1JHqHQdHSgWBKo6H4UfG8dw3JnZSyjGkHA',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with custom entrypoint',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'main',
            value: {
              prim: 'Pair',
              args: [
                { prim: 'Pair', args: [{ bytes: '0202' }, { int: '202' }] },
                { string: 'hello' },
              ],
            },
          },
          destination: 'KT1HPaJE1QNtuiYPgMAGhzTrs446K9wptmsR',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Transaction with default entrypoint and annotation',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'default',
            value: {
              prim: 'Pair',
              args: [{ bytes: '0202' }, { string: 'hello' }],
              annots: ['%test'],
            },
          },
          destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Kukai reported issue #1592 - bytes in the input is upper-case',
    operation: {
      branch: 'BKsV8h3bdnnqxYP4xEx52QeEdB9XqhBXuy314CZ7e2zTkXACLBs',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          counter: '392495',
          source: 'tz1UeT3VS8LuAkvB66tjQTTDP1LFf3DEC4uA',
          fee: '7267',
          gas_limit: '66341',
          storage_limit: '538',
          destination: 'KT1VgYbxiwgJPVNB7Zdht8nCMVbADeg5VpQQ',
          amount: '0',
          parameters: {
            entrypoint: 'unlock',
            value: {
              prim: 'Pair',
              args: [
                {
                  string: 'tz1UeT3VS8LuAkvB66tjQTTDP1LFf3DEC4uA',
                },
                {
                  prim: 'Pair',
                  args: [
                    [
                      {
                        prim: 'Elt',
                        args: [
                          {
                            int: '1494',
                          },
                          [
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'damage',
                                },
                                {
                                  int: '700',
                                },
                              ],
                            },
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'exp',
                                },
                                {
                                  int: '10',
                                },
                              ],
                            },
                          ],
                        ],
                      },
                      {
                        prim: 'Elt',
                        args: [
                          {
                            int: '1504',
                          },
                          [
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'damage',
                                },
                                {
                                  int: '900',
                                },
                              ],
                            },
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'exp',
                                },
                                {
                                  int: '38',
                                },
                              ],
                            },
                          ],
                        ],
                      },
                      {
                        prim: 'Elt',
                        args: [
                          {
                            int: '1557',
                          },
                          [
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'damage',
                                },
                                {
                                  int: '1100',
                                },
                              ],
                            },
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'exp',
                                },
                                {
                                  int: '24',
                                },
                              ],
                            },
                          ],
                        ],
                      },
                    ],
                    {
                      prim: 'Pair',
                      args: [
                        [],
                        {
                          prim: 'Pair',
                          args: [
                            [
                              {
                                bytes:
                                  '697066733A2F2F516D54666E6F35554D62384E51434475654A5A637167686E67713779566F475933467A7461744470417A5A526542',
                              },
                            ],
                            {
                              prim: 'Pair',
                              args: [
                                [
                                  {
                                    prim: 'Elt',
                                    args: [
                                      {
                                        int: '2',
                                      },
                                      {
                                        int: '25000000000',
                                      },
                                    ],
                                  },
                                ],
                                {
                                  string:
                                    'edsigtt6Qp118ex7tMJcnWr9tjVTuCwKXS9kAbuD1LVxb5A1raQEr5Cvz4BDaC9dH1X1898DekDsqty66M45as87juCF3ge5FWM',
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
        },
      ],
    },
    expected: {
      branch: 'BKsV8h3bdnnqxYP4xEx52QeEdB9XqhBXuy314CZ7e2zTkXACLBs',
      contents: [
        {
          kind: 'transaction',
          counter: '392495',
          source: 'tz1UeT3VS8LuAkvB66tjQTTDP1LFf3DEC4uA',
          fee: '7267',
          gas_limit: '66341',
          storage_limit: '538',
          destination: 'KT1VgYbxiwgJPVNB7Zdht8nCMVbADeg5VpQQ',
          amount: '0',
          parameters: {
            entrypoint: 'unlock',
            value: {
              prim: 'Pair',
              args: [
                {
                  string: 'tz1UeT3VS8LuAkvB66tjQTTDP1LFf3DEC4uA',
                },
                {
                  prim: 'Pair',
                  args: [
                    [
                      {
                        prim: 'Elt',
                        args: [
                          {
                            int: '1494',
                          },
                          [
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'damage',
                                },
                                {
                                  int: '700',
                                },
                              ],
                            },
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'exp',
                                },
                                {
                                  int: '10',
                                },
                              ],
                            },
                          ],
                        ],
                      },
                      {
                        prim: 'Elt',
                        args: [
                          {
                            int: '1504',
                          },
                          [
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'damage',
                                },
                                {
                                  int: '900',
                                },
                              ],
                            },
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'exp',
                                },
                                {
                                  int: '38',
                                },
                              ],
                            },
                          ],
                        ],
                      },
                      {
                        prim: 'Elt',
                        args: [
                          {
                            int: '1557',
                          },
                          [
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'damage',
                                },
                                {
                                  int: '1100',
                                },
                              ],
                            },
                            {
                              prim: 'Elt',
                              args: [
                                {
                                  string: 'exp',
                                },
                                {
                                  int: '24',
                                },
                              ],
                            },
                          ],
                        ],
                      },
                    ],
                    {
                      prim: 'Pair',
                      args: [
                        [],
                        {
                          prim: 'Pair',
                          args: [
                            [
                              {
                                // diff from given
                                bytes:
                                  '697066733a2f2f516d54666e6f35554d62384e51434475654a5a637167686e67713779566f475933467a7461744470417a5a526542',
                              },
                            ],
                            {
                              prim: 'Pair',
                              args: [
                                [
                                  {
                                    prim: 'Elt',
                                    args: [
                                      {
                                        int: '2',
                                      },
                                      {
                                        int: '25000000000',
                                      },
                                    ],
                                  },
                                ],
                                {
                                  string:
                                    'edsigtt6Qp118ex7tMJcnWr9tjVTuCwKXS9kAbuD1LVxb5A1raQEr5Cvz4BDaC9dH1X1898DekDsqty66M45as87juCF3ge5FWM',
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
        },
      ],
    },
  },
  {
    name: 'Origination vote example',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: voteSample,
            storage: voteInitSample,
          },
        },
      ],
    },
  },
  ...extractOp(0, 154, opMapping).map((op): TestCase => {
    return {
      name: `Origination operation (${op})`,
      operation: {
        branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
        contents: [
          {
            kind: OpKind.ORIGINATION,
            counter: '1',
            source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            fee: '10000',
            gas_limit: '10',
            storage_limit: '10',
            balance: '0',
            script: {
              code: genericCode(op) as MichelsonV1Expression[],
              storage: genericStorage,
            },
          },
        ],
      },
    };
  }),
  {
    name: 'Origination with bigmap',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: tokenBigmapCode,
            storage: tokenBigmapStorage,
          },
        },
      ],
    },
  },
  {
    name: 'Origination with no annot',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: noAnnotCode,
            storage: noAnnotInit('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'),
          },
        },
      ],
    },
  },
  {
    name: 'Multiple transaction at once',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.REVEAL,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          public_key: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
        },
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: noAnnotCode,
            storage: noAnnotInit('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'),
          },
        },
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          parameters: {
            entrypoint: 'default',
            value: {
              prim: 'Pair',
              args: [{ bytes: '0202' }, { string: 'hello' }],
              annots: ['%test'],
            },
          },
          destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: '1000',
        },
        {
          kind: OpKind.TRANSACTION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: '1000',
        },
      ],
    },
  },
  {
    name: 'Origination with sapling_transaction in storage',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: rpcContractResponse.script.code,
            storage: [],
          },
        },
      ],
    },
  },
  {
    name: 'Origination where storage has a pair of 3 annotated args whose 2 sapling_transaction',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: rpcContractResponse2.script.code,
            storage: { prim: 'Pair', args: [{ int: '0' }, [], []] },
          },
        },
      ],
    },
  },
  {
    name: 'Origination where storage is a pair of 2 annotated sapling_transaction and parameter contains a pair of 3 args',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: rpcContractResponse4.script.code,
            storage: { prim: 'Pair', args: [[], []] },
          },
        },
      ],
    },
  },
  {
    name: 'Origination with SAPLING_EMPTY_STATE instruction',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: rpcContractResponse5.script.code,
            storage: { prim: 'Unit' },
          },
        },
      ],
    },
  },
  {
    name: 'Origination with optional sapling_transaction in storage',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: rpcContractResponse7.script.code,
            storage: { prim: 'None' },
          },
        },
      ],
    },
  },
  {
    name: 'Origination where parameter is an annotated pairs of 18 args',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: example9.script.code,
            storage: [],
          },
        },
      ],
    },
  },
  {
    name: 'Origination where parameter is a pairs of 18 args without annotation',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: example10.script.code,
            storage: [],
          },
        },
      ],
    },
  },
  {
    name: 'Register global constant',
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.REGISTER_GLOBAL_CONSTANT,
          counter: '7423375',
          source: 'tz1TJGsZxvr6aBGUqfQVxufesTtA7QGi696D',
          fee: '372',
          gas_limit: '1330',
          storage_limit: '93',
          value: {
            prim: 'Pair',
            args: [
              {
                int: '999',
              },
              {
                int: '999',
              },
            ],
          },
        },
      ],
    },
  },
  {
    name: 'Origination of a contract that contains the type constant',
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '7423380',
          source: 'tz1TJGsZxvr6aBGUqfQVxufesTtA7QGi696D',
          fee: '670',
          gas_limit: '2360',
          storage_limit: '481',
          balance: '0',
          script: {
            code: codeContractWithConstant,
            storage: storageContractWithConstant,
          },
        },
      ],
    },
  },
  {
    name: 'Origination of a contract that contains top level views',
    operation: {
      branch: 'BKyBAx2JDtoFLjcv6tUZTBPDxjcA22JMxqCzFPGBWU4FmTX3uoD',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '8642842',
          source: 'tz2J1jtUzAj4CdYKCh78ubARBiotbGKceXfb',
          fee: '1104',
          gas_limit: '1565',
          storage_limit: '872',
          balance: '0',
          script: {
            code: codeViewsTopLevel,
            storage: storageViewsTopLevel,
          },
        },
      ],
    },
  },
  {
    name: `Origination of a contract that contains the instructions SUB_MUTEZ`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: submutezCode,
            storage: submutezStorage,
          },
        },
      ],
    },
  },
  {
    name: `Transfer ticket`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.TRANSFER_TICKET,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          ticket_contents: {
            prim: 'Pair',
            args: [{ string: 'KT1EAMUQC1yJ2sRPNPpLHVMGCzroYGe1C1ea' }, { int: '0' }, { int: '1' }],
          },
          ticket_ty: { prim: 'nat' },
          ticket_ticketer: 'KT1EAMUQC1yJ2sRPNPpLHVMGCzroYGe1C1ea',
          ticket_amount: '2',
          destination: 'KT1JHqHQdHSgWBKo6H4UfG8dw3JnZSyjGkHA',
          entrypoint: 'default',
        },
      ],
    },
  },
  {
    name: `Origination of a contract that contains the instructions EMIT`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '94141',
          source: 'tz2WH1zahKo2KiS1gcHBhNFTURPfW1Vk7qpE',
          fee: '603',
          gas_limit: '1526',
          storage_limit: '377',
          balance: '0',
          script: {
            code: emitCode,
            storage: {
              prim: 'Unit',
            },
          },
        },
      ],
    },
  },
  {
    name: `Increase Paid Storage operation`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.INCREASE_PAID_STORAGE,
          counter: '1',
          source: 'tz2WH1zahKo2KiS1gcHBhNFTURPfW1Vk7qpE',
          fee: '100',
          gas_limit: '10000',
          storage_limit: '10',
          amount: '2',
          destination: 'KT1JHqHQdHSgWBKo6H4UfG8dw3JnZSyjGkHA',
        },
      ],
    },
  },
  {
    name: `Origination of a contract that contains the instructions TICKET`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '94141',
          source: 'tz2WH1zahKo2KiS1gcHBhNFTURPfW1Vk7qpE',
          fee: '603',
          gas_limit: '1526',
          storage_limit: '377',
          balance: '0',
          script: {
            code: ticketCode,
            storage: ticketStorage,
          },
        },
      ],
    },
  },
  {
    name: `Update Consensus Key operation tz1`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'edpkuXKmpnwWUTVo55d3N7fR9Hr8JgYKPnwDfLkS9wnyfEJpYRaCSi',
        },
      ],
    },
  },
  {
    name: `Update Consensus Key operation tz2`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'sppk7d82njyoaywbKC8tupUsk5V2fnAAjPgKNpMtXdYw9wUTEdJshp7',
        },
      ],
    },
  },
  {
    name: `Update Consensus Key operation tz3`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'p2pk666o5KaJXbahSMYRGYTSuBMjfbLNZ8H7UaDYyKkq8Uv7CwwSBkK',
        },
      ],
    },
  },
  {
    name: `Update Consensus Key operation with proof BLsig(tz4)`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'BLpk1yKS9X6vrUiAZiZYfnjiDPkEf215W6rMX6c9gZ7FSFkkH63ZjAuU7VKvZfiBWaoCWtwWY8dQ',
          proof: 'BLsigASWx9GkMxUpQMGvCrHrhkcsTZ5V9pmDrXSHvkiurrX6Bf5RQcMPbDMDgqWj4GokRekK42FyG76ccMUyFYWcJEmnCd8s6Kek9gtUGkXjPkLEhu8dbFFn5LWyQ4FoMCK3QrxXn6M6LD'
        },
      ],
    },
  },
  {
    name: `Update Consensus Key operation without proof BLsig(tz4)`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'BLpk1yKS9X6vrUiAZiZYfnjiDPkEf215W6rMX6c9gZ7FSFkkH63ZjAuU7VKvZfiBWaoCWtwWY8dQ',
        },
      ],
    },
  },
  {
    name: `Drain Delegate operation`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.DRAIN_DELEGATE,
          consensus_key: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
          delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
          destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
        },
      ],
    },
  },
  {
    name: `Origination of a contract that contains the instructions LAMBDA_REC`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '94141',
          source: 'tz2WH1zahKo2KiS1gcHBhNFTURPfW1Vk7qpE',
          fee: '603',
          gas_limit: '1526',
          storage_limit: '377',
          balance: '0',
          script: {
            code: lambdaRecCode,
            storage: {
              prim: 'Unit',
            },
          },
        },
      ],
    },
  },
  {
    name: `Origination of a smart_rollup_originate operation`,
    operation: {
      branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
      contents: [
        {
          kind: OpKind.SMART_ROLLUP_ORIGINATE,
          source: 'tz1h5DrMhmdrGMpb3qkykU1RmCWoTYAkFJPu',
          fee: '1496',
          counter: '3969',
          gas_limit: '2849',
          storage_limit: '6572',
          pvm_kind: PvmKind.WASM2,
          kernel:
            '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a',
          parameters_ty: {
            prim: 'bytes',
          },
        },
      ],
    }
  },
  {
    name: `Origination of a smart_rollup_add_messages operation`,
    operation: {
      branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
      contents: [
        {
          kind: OpKind.SMART_ROLLUP_ADD_MESSAGES,
          source: 'tz1h5DrMhmdrGMpb3qkykU1RmCWoTYAkFJPu',
          fee: '1496',
          counter: '3969',
          gas_limit: '2849',
          storage_limit: '6572',
          message:
            [
              '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
            ],
        },
      ],
    }
  },
  {
    name: 'Origination of a smart_rollup_execute_outbox_message operation',
    operation: {
      branch: 'BKqyTFKbU7bMrnN393YCBJ28quXG9zMwuPq61Z5ce4gVjsAgZmk',
      contents: [
        {
          kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
          source: 'tz1adKm6kWEkiejZ9WYpuHvBCgUewtCxpqRF',
          fee: '1618',
          counter: '13',
          gas_limit: '6485',
          storage_limit: '36',
          rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
          cemented_commitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
          output_proof: '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
        }
      ]
    }
  },
  {
    name: 'A failing_noop operation',
    operation: {
      branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
      contents: [
        {
          kind: OpKind.FAILING_NOOP,
          arbitrary: '48656c6c6f20576f726c64'
        }
      ]
    }
  },
  {
    name: 'Origination of a contract that contains the types chest, chest_key and the instruction OPEN_CHEST',
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: timelockCode,
            storage: timelockStorage,
          },
        },
      ],
    },
    expected: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: timelockExpected,
            storage: timelockStorage,
          },
        },
      ],
    },
  },
  {
    name: 'Attestation',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ATTESTATION,
          slot: 0,
          level: 66299,
          round: 5,
          block_payload_hash: 'vh3FEkypvxUYLwjGYd2Sme7aWyfX8npDsqxcL6imVpBWnAZeNn2n',
        }
      ]
    }
  },
  {
    name: 'Transaction with stake entrypoint',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [{
        kind: OpKind.TRANSACTION,
        source: "tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX",
        fee: "0",
        counter: "407",
        gas_limit: "1040000",
        storage_limit: "60000",
        amount: "1000000000",
        destination: "tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX",
        parameters:
          { entrypoint: "stake", value: { prim: "Unit" } }
      }]
    },
  },
  {
    name: 'Transaction with unstake entrypoint',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          source: "tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX",
          fee: "689",
          counter: "408",
          gas_limit: "4250",
          storage_limit: "0",
          amount: "99999999999000000",
          destination: "tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX",
          parameters:
            { entrypoint: "unstake", value: { prim: "Unit" } }
        }],
    },
  },
  {
    name: 'Transaction with finalize_unstake entrypoint',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          source: "tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX",
          fee: "409",
          counter: "409",
          gas_limit: "1529",
          storage_limit: "0",
          amount: "0",
          destination: "tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX",
          parameters:
          {
            entrypoint: "finalize_unstake",
            value: { prim: "Unit" }
          }
        }],
    },
  },
  {
    name: 'Transaction with set_delegate_parameters entrypoint',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.TRANSACTION,
          source: "tz1X1TKpLiZuPEo2YVvDiqQ47Zp9a797ejkp",
          fee: "351",
          counter: "391",
          gas_limit: "791",
          storage_limit: "0",
          amount: "0",
          destination: "tz1X1TKpLiZuPEo2YVvDiqQ47Zp9a797ejkp",
          parameters:
          {
            entrypoint: "set_delegate_parameters",
            value:
            {
              prim: "Pair",
              args:
                [{ int: "5000000" },
                {
                  prim: "Pair",
                  args:
                    [{ int: "1000000000" }, { prim: "Unit" }]
                }]
            }
          }
        }]
    },
  },
  {
    name: 'Attestation With Dal operation',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ATTESTATION_WITH_DAL,
          slot: 0,
          level: 66299,
          round: 5,
          block_payload_hash: 'vh3FEkypvxUYLwjGYd2Sme7aWyfX8npDsqxcL6imVpBWnAZeNn2n',
          dal_attestation: '10'
        }
      ]
    }
  },
  {
    name: 'Dal Publish Commitment operation',
    operation: {
      branch: 'BMT5yA3UH3CJkaYJBq33Q1BNZU6NL4zZNBhCHKwxygSm59P1x9M',
      contents: [
        {
          kind: OpKind.DAL_PUBLISH_COMMITMENT,
          source: 'tz1Mp9zrMAJ3jckh3juLXGobfDv6oyUycfSy',
          fee: '513',
          counter: '67',
          gas_limit: '1433',
          storage_limit: '0',
          slot_header: {
            slot_index: 10,
            commitment: 'sh1vHbHrPSt7eWqYJmM9EUk5scjbvR5PKBckJxmmDJzYHHBkca8Lz4hxXX6zpW5wbhJhswJd4v',
            commitment_proof: '90c6576ad09e11b14eb464cdd214fe061ba8e8e5a3175e29fe7ff40526f90c2f2f4e02fe9fe03f7adb0fe286d7828b970eb1979f0f65ca3637a51d5456b442377d20397eb1b02544c2e435d79e156881443179fe16b32ad9e9501622a647c2ce'
          }
        }
      ]
    }
  },

  {
    name: 'Reveal with proof edsig(tz1)',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.REVEAL,
          counter: '1',
          source: 'tz1WRxrFJDYNJYMJiqLAeS2QCg9SwXJt4QYD',
          public_key: 'edpkuh8bYRPTrSCUUKmPSGg9WtVQiqHpEE4buEk7jynbenvQdaHTTD',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          proof: 'edsigtYFkwJo6uVY5J1KnjnMFsj3Y1MKD9vqmtX2sF2u6yyg6fLJWn6Cy1CcbwJAkmEq5Zxvh49uYkMtHHGbeBm8LqBJg2uYjqG'
        },
      ],
    },
  },
  {
    name: 'Reveal with proof spsig(tz2)',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.REVEAL,
          counter: '1',
          source: 'tz2JKWBpoLTR7Yxe3Vgpqpk9Ch8HSBeYBEdF',
          public_key: 'sppk7ccMwYw4ZoJL3QUFnt4GfWYn9R15fwNHP47AyivsLurGtEkDHKw',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          proof: 'spsig1QVVCiQ6aN2zmut2wKTg4zWLoP9ia4qUY2hBo21odA7P25gqfieFWJMyntaJWmyrd6v3mgjKF5n4d2wcaB3LxkLmd1MoJQ',
        },
      ],
    },
  },
  {
    name: 'Reveal with proof p2sig(tz3)',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.REVEAL,
          counter: '1',
          source: 'tz3YchCjUWXRvZKnU6xZoFeJeEkWQTrhvVYi',
          public_key: 'p2pk678THitX2ewSXAA4KPJVFAMbfQZkp8XyjEh1RN4ynXbA9sbf1i9',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          proof: 'p2sigN4XTiSicEot77bsR9BvpnDtSm4KDm2YyRew4isqiqxhN6fJpQeYFu8acN8NSDJCxPrqgpqyML3M7ubfBicRfqNz7oGhnX',
        },
      ],
    },
  },
  {
    name: 'Reveal with proof BLsig(tz4)',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.REVEAL,
          source: "tz4EuLnUzNkUv14qok6BczV8DTcjwa2BgEMf",
          fee: "733",
          counter: "7",
          gas_limit: "3250",
          storage_limit: "0",
          public_key:
            "BLpk1xqBc7HwrFwF7vSs8jaBy1cvx8AaL3DU1CLZiPhbimf6u8Si65LQvJu37b4J4mKTgrDf5qbc",
          proof:
            "BLsig9m7E7NBVMa29m3pKqcXZ1yq8usLr7PiaQeMvQnxxj4uCQ3u1ZXLoubmAvD9CPc7iXutSPPXG43nyfua8NxvqQSk8z3kRLq7QX14ZApkvk8Vp3TNtJPbYh4F1nxPVk1ra7XGNr6ZTB",
        },
      ],
    },
  },
  {
    name: 'Reveal without proof BLsig(tz4)',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.REVEAL,
          source: "tz4EuLnUzNkUv14qok6BczV8DTcjwa2BgEMf",
          fee: "733",
          counter: "7",
          gas_limit: "3250",
          storage_limit: "0",
          public_key:
            "BLpk1xqBc7HwrFwF7vSs8jaBy1cvx8AaL3DU1CLZiPhbimf6u8Si65LQvJu37b4J4mKTgrDf5qbc",
        },
      ],
    },
  },
  {
    name: `Update Consensus Key operation with proof edsig(tz1)`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'edpkuXKmpnwWUTVo55d3N7fR9Hr8JgYKPnwDfLkS9wnyfEJpYRaCSi',
          proof: 'edsigtYFkwJo6uVY5J1KnjnMFsj3Y1MKD9vqmtX2sF2u6yyg6fLJWn6Cy1CcbwJAkmEq5Zxvh49uYkMtHHGbeBm8LqBJg2uYjqG'
        },
      ],
    },
  },
  {
    name: `Update Consensus Key operation with proof spsig(tz2)`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'sppk7d82njyoaywbKC8tupUsk5V2fnAAjPgKNpMtXdYw9wUTEdJshp7',
          proof: 'spsig1QVVCiQ6aN2zmut2wKTg4zWLoP9ia4qUY2hBo21odA7P25gqfieFWJMyntaJWmyrd6v3mgjKF5n4d2wcaB3LxkLmd1MoJQ',
        },
      ],
    },
  },
  {
    name: `Update Consensus Key operation with proof p2sig(tz3)`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'p2pk666o5KaJXbahSMYRGYTSuBMjfbLNZ8H7UaDYyKkq8Uv7CwwSBkK',
          proof: 'p2sigN4XTiSicEot77bsR9BvpnDtSm4KDm2YyRew4isqiqxhN6fJpQeYFu8acN8NSDJCxPrqgpqyML3M7ubfBicRfqNz7oGhnX',
        },
      ],
    },
  },
  {
    name: `Update Companion Key operation with proof edsig(tz1)`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_COMPANION_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'edpkuXKmpnwWUTVo55d3N7fR9Hr8JgYKPnwDfLkS9wnyfEJpYRaCSi',
          proof: 'edsigtYFkwJo6uVY5J1KnjnMFsj3Y1MKD9vqmtX2sF2u6yyg6fLJWn6Cy1CcbwJAkmEq5Zxvh49uYkMtHHGbeBm8LqBJg2uYjqG'
        },
      ],
    },
  },
  {
    name: `Update Companion Key operation with proof spsig(tz2)`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_COMPANION_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'sppk7d82njyoaywbKC8tupUsk5V2fnAAjPgKNpMtXdYw9wUTEdJshp7',
          proof: 'spsig1QVVCiQ6aN2zmut2wKTg4zWLoP9ia4qUY2hBo21odA7P25gqfieFWJMyntaJWmyrd6v3mgjKF5n4d2wcaB3LxkLmd1MoJQ',
        },
      ],
    },
  },
  {
    name: `Update Companion Key operation with proof p2sig(tz3)`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_COMPANION_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'p2pk666o5KaJXbahSMYRGYTSuBMjfbLNZ8H7UaDYyKkq8Uv7CwwSBkK',
          proof: 'p2sigN4XTiSicEot77bsR9BvpnDtSm4KDm2YyRew4isqiqxhN6fJpQeYFu8acN8NSDJCxPrqgpqyML3M7ubfBicRfqNz7oGhnX',
        },
      ],
    },
  },
  {
    name: `Update Companion Key operation tz1`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_COMPANION_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'edpkuXKmpnwWUTVo55d3N7fR9Hr8JgYKPnwDfLkS9wnyfEJpYRaCSi',
        },
      ],
    },
  },
  {
    name: `Update Companion Key operation tz2`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_COMPANION_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'sppk7d82njyoaywbKC8tupUsk5V2fnAAjPgKNpMtXdYw9wUTEdJshp7',
        },
      ],
    },
  },
  {
    name: `Update Companion Key operation tz3`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_COMPANION_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'p2pk666o5KaJXbahSMYRGYTSuBMjfbLNZ8H7UaDYyKkq8Uv7CwwSBkK',
        },
      ],
    },
  },
  {
    name: `Update Companion Key operation with proof BLsig(tz4)`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_COMPANION_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'BLpk1yKS9X6vrUiAZiZYfnjiDPkEf215W6rMX6c9gZ7FSFkkH63ZjAuU7VKvZfiBWaoCWtwWY8dQ',
          proof: 'BLsigASWx9GkMxUpQMGvCrHrhkcsTZ5V9pmDrXSHvkiurrX6Bf5RQcMPbDMDgqWj4GokRekK42FyG76ccMUyFYWcJEmnCd8s6Kek9gtUGkXjPkLEhu8dbFFn5LWyQ4FoMCK3QrxXn6M6LD'
        },
      ],
    },
  },
  {
    name: `Update Companion Key operation without proof BLsig(tz4)`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_COMPANION_KEY,
          counter: '1125537',
          source: 'tz1PLXg3sxQ1YGRkWqxdACck6AnZpnnuVNZY',
          fee: '0',
          gas_limit: '693333',
          storage_limit: '60000',
          pk: 'BLpk1yKS9X6vrUiAZiZYfnjiDPkEf215W6rMX6c9gZ7FSFkkH63ZjAuU7VKvZfiBWaoCWtwWY8dQ',
        },
      ],
    },
  },
  {
    name: 'Origination of a contract that contains the instructions IS_IMPLICIT_ACCOUNT',
    operation: {
      branch: "BMFfghLG5oS4vRgqNvEvhjLKNQZdK8sW4ezyWLAWXoHhtfHPAzE",
      contents: [
        {
          kind: OpKind.ORIGINATION,
          source: "tz2RqxsYQyFuP9amsmrr25x9bUcBMWXGvjuD",
          fee: "337",
          counter: "1318",
          gas_limit: "666",
          storage_limit: "319",
          balance: "0",
          script: {
            code: isImplicitAccountCode,
            storage: isImplicitAccountStorage,
          }
        }
      ]
    },
  }
];
