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
import { ticketCode, ticketStorage } from './code_with_ticket';
import {
  ticketCodeProto14,
  ticketCode2Proto14,
  ticketCode3Proto14,
  ticketCode4Proto14,
  ticketStorageProto14,
  ticketStorage2Proto14,
  ticketStorage3Proto14,
  ticketStorage4Proto14,
} from './code_with_ticket_proto14';
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
import { MichelsonV1Expression, OpKind } from '@taquito/rpc';
import { emitCode } from './code_with_emit';
import { opMappingProto14 } from '../../packages/taquito-local-forging/src/proto14-kathmandu/constants-proto14'

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
    name: 'Delegation',
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
    name: 'Reveal',
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
  ...extractOp(0, 151, opMappingProto14).map((op): TestCase => {
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
    name: 'Origination where storage is a pair of 2 optional annotated tickets',
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
            code: ticketCodeProto14,
            storage: ticketStorageProto14,
          },
        },
      ],
    },
  },
  {
    name: 'Origination where parameter contains a pair having 3 args',
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
            code: ticketCode2Proto14,
            storage: ticketStorage2Proto14,
          },
        },
      ],
    },
  },
  {
    name: 'Origination where storage contains nested pairs and a ticket inside a big map',
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
            code: ticketCode3Proto14,
            storage: ticketStorage3Proto14,
          },
        },
      ],
    },
  },
  {
    name: 'Origination with ticket',
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
            code: ticketCode4Proto14,
            storage: ticketStorage4Proto14,
          },
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
    name: 'Endorsement',
    operation: {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: OpKind.ENDORSEMENT,
          slot: 0,
          level: 66299,
          round: 5,
          block_payload_hash: 'vh3FEkypvxUYLwjGYd2Sme7aWyfX8npDsqxcL6imVpBWnAZeNn2n',
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
    name: `Tx rollup origination`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.TX_ROLLUP_ORIGINATION,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          tx_rollup_origination: {},
        },
      ],
    },
  },
  {
    name: `Tx rollup submit batch`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.TX_ROLLUP_SUBMIT_BATCH,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
          content: 'abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd',
          burn_limit: '1000000',
        },
      ],
    },
  },
  {
    name: `Tx rollup submit batch no burn limit`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.TX_ROLLUP_SUBMIT_BATCH,
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
          content: '1234',
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
];

export const limaCases: TestCase[] = [
  // In `opMapping` from the file `constants.ts`, the operations and types starting at `ticket` were added in the lima protocol
  ...extractOp(154, 154, opMapping).map((op): TestCase => {
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
    name: `Update Consensus Key operation`,
    operation: {
      branch: 'BMV9bffK5yjWCJgUJBsoTRifb4SsAYbkCVwVkKbJHffJYn7ePBL',
      contents: [
        {
          kind: OpKind.UPDATE_CONSENSUS_KEY,
          counter: '1',
          source: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
          fee: '100',
          gas_limit: '10000',
          storage_limit: '10',
          pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7'
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
];
