import { TransferParams } from '../../src/operations/types';

const errorBuilder = (result: any) => {
  return {
    withError: () => {
      result[0].contents[0].metadata.operation_result = {
        status: 'failed',
        errors: [
          {
            kind: 'temporary',
            id: 'proto.006-PsCARTHA.michelson_v1.runtime_error',
            contract_handle: 'KT1BjNCteztvGsjvbHTtQ5ynWqhjSVdR285M',
            contract_code: [
              { prim: 'parameter', args: [{ prim: 'unit' }] },
              { prim: 'storage', args: [{ prim: 'unit' }] },
              {
                prim: 'code',
                args: [
                  [
                    { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'test' }] },
                    { prim: 'FAILWITH' },
                  ],
                ],
              },
            ],
          },
          {
            kind: 'temporary',
            id: 'proto.006-PsCARTHA.michelson_v1.script_rejected',
            location: 10,
            with: { string: 'test' },
          },
        ],
      };
      return result;
    },
    withIntError: () => {
      result[0].contents[0].metadata.operation_result = {
        status: 'failed',
        errors: [
          {
            kind: 'temporary',
            id: 'proto.011-PtHangz2.michelson_v1.runtime_error',
            contract_handle: 'KT1BjNCteztvGsjvbHTtQ5ynWqhjSVdR285M',
            contract_code: [
              { prim: 'parameter', args: [{ prim: 'unit' }] },
              { prim: 'storage', args: [{ prim: 'unit' }] },
              {
                prim: 'code',
                args: [
                  [{ prim: 'PUSH', args: [{ prim: 'int' }, { string: 5 }] }, { prim: 'FAILWITH' }],
                ],
              },
            ],
          },
          {
            kind: 'temporary',
            id: 'proto.011-PtHangz2.michelson_v1.script_rejected',
            location: 10,
            with: { int: 5 },
          },
        ],
      };
      return result;
    },
    withPairError: () => {
      result[0].contents[0].metadata.operation_result = {
        status: 'failed',
        errors: [
          {
            kind: 'temporary',
            id: 'proto.011-PtHangz2.michelson_v1.script_rejected',
            location: 10,
            with: { args: [{ int: 6 }, { string: 'taquito' }], prim: 'Pair' },
          },
        ],
      };
      return result;
    },
    withInternalError: () => {
      result[0].contents[0].metadata.operation_result = {
        status: 'backtracked',
        storage: { bytes: '00b2e19a9e74440d86c59f13dab8a18ff873e889ea' },
        consumed_milligas: '15953000',
        storage_size: '232',
      };
      (result[0].contents[0].metadata as any).internal_operation_results = [
        {
          kind: 'transaction',
          source: 'KT1Rod9ZzsJXLhzDNrrFSh3yaWTjEJriYXjo',
          nonce: 0,
          amount: '50000000',
          destination: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
          result: {
            status: 'failed',
            errors: [
              {
                kind: 'temporary',
                id: 'proto.005-PsBabyM1.gas_exhausted.operation',
              },
            ],
          },
        },
      ];
      return result;
    },
    withBalanceTooLowError: () => {
      result[0].contents[0].metadata.operation_result = {
        status: 'failed',
        errors: [
          {
            kind: 'temporary',
            id: 'proto.006-PsCARTHA.contract.balance_too_low',
            contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
            balance: '31106391540',
            amount: '31106411541000000',
          },
        ],
      };
      return result;
    },
  };
};

export const multipleInternalOrigination = () => {
  return {
    contents: [
      {
        kind: 'reveal',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '1420',
        counter: '294312',
        gas_limit: '10600',
        storage_limit: '0',
        public_key: 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
        metadata: {
          balance_updates: [
            { kind: 'contract', contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD', change: '-1420' },
            {
              kind: 'freezer',
              category: 'fees',
              delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
              cycle: 104,
              change: '1420',
            },
          ],
          operation_result: { status: 'applied', consumed_milligas: '10000000' },
        },
      },
      {
        kind: 'transaction',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '0',
        counter: '294313',
        gas_limit: '800000',
        storage_limit: '2000',
        amount: '0',
        destination: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
        parameters: {
          entrypoint: 'do',
          value: [
            { prim: 'DROP' },
            { prim: 'NIL', args: [{ prim: 'operation' }] },
            { prim: 'NIL', args: [{ prim: 'int' }] },
            { prim: 'AMOUNT' },
            { prim: 'NONE', args: [{ prim: 'key_hash' }] },
            {
              prim: 'CREATE_CONTRACT',
              args: [
                [
                  { prim: 'parameter', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  { prim: 'storage', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  {
                    prim: 'code',
                    args: [
                      [
                        { prim: 'CAR' },
                        {
                          prim: 'MAP',
                          args: [
                            [
                              { prim: 'PUSH', args: [{ prim: 'int' }, { int: '1' }] },
                              { prim: 'ADD' },
                            ],
                          ],
                        },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' },
                      ],
                    ],
                  },
                ],
              ],
            },
            { prim: 'SWAP' },
            { prim: 'DROP' },
            { prim: 'CONS' },
            { prim: 'NIL', args: [{ prim: 'int' }] },
            { prim: 'AMOUNT' },
            { prim: 'NONE', args: [{ prim: 'key_hash' }] },
            {
              prim: 'CREATE_CONTRACT',
              args: [
                [
                  { prim: 'parameter', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  { prim: 'storage', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  {
                    prim: 'code',
                    args: [
                      [
                        { prim: 'CAR' },
                        {
                          prim: 'MAP',
                          args: [
                            [
                              { prim: 'PUSH', args: [{ prim: 'int' }, { int: '1' }] },
                              { prim: 'ADD' },
                            ],
                          ],
                        },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' },
                      ],
                    ],
                  },
                ],
              ],
            },
            { prim: 'SWAP' },
            { prim: 'DROP' },
            { prim: 'CONS' },
          ],
        },
        metadata: {
          balance_updates: [],
          operation_result: {
            status: 'applied',
            storage: { bytes: '012ffebbf1560632ca767bc960ccdb84669d284c2c' },
            consumed_milligas: '17707000',
            storage_size: '232',
          },
          internal_operation_results: [
            {
              kind: 'origination',
              source: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
              nonce: 1,
              balance: '0',
              script: {
                code: [
                  { prim: 'parameter', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  { prim: 'storage', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  {
                    prim: 'code',
                    args: [
                      [
                        { prim: 'CAR' },
                        {
                          prim: 'MAP',
                          args: [
                            [
                              { prim: 'PUSH', args: [{ prim: 'int' }, { int: '1' }] },
                              { prim: 'ADD' },
                            ],
                          ],
                        },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' },
                      ],
                    ],
                  },
                ],
                storage: [],
              },
              result: {
                status: 'applied',
                big_map_diff: [],
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                    change: '-60000',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                    change: '-257000',
                  },
                ],
                originated_contracts: ['KT1D1AoSDxnmGk8UWFW7DcT9JP1VpLqUNh4F'],
                consumed_milligas: '11560000',
                storage_size: '60',
                paid_storage_size_diff: '60',
              },
            },
            {
              kind: 'origination',
              source: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
              nonce: 0,
              balance: '0',
              script: {
                code: [
                  { prim: 'parameter', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  { prim: 'storage', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  {
                    prim: 'code',
                    args: [
                      [
                        { prim: 'CAR' },
                        {
                          prim: 'MAP',
                          args: [
                            [
                              { prim: 'PUSH', args: [{ prim: 'int' }, { int: '1' }] },
                              { prim: 'ADD' },
                            ],
                          ],
                        },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' },
                      ],
                    ],
                  },
                ],
                storage: [],
              },
              result: {
                status: 'applied',
                big_map_diff: [],
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                    change: '-60000',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                    change: '-257000',
                  },
                ],
                originated_contracts: ['KT1A5V7HHF7Z7QPn5n9dg4EjzTRJ4mnE21zE'],
                consumed_milligas: '11561000',
                storage_size: '60',
                paid_storage_size_diff: '60',
              },
            },
          ],
        },
      },
    ],
    signature:
      'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
  };
};

export const multipleInternalOriginationNoReveal = () => {
  return {
    contents: [
      {
        kind: 'transaction',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '0',
        counter: '294313',
        gas_limit: '800000',
        storage_limit: '2000',
        amount: '0',
        destination: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
        parameters: {
          entrypoint: 'do',
          value: [
            { prim: 'DROP' },
            { prim: 'NIL', args: [{ prim: 'operation' }] },
            { prim: 'NIL', args: [{ prim: 'int' }] },
            { prim: 'AMOUNT' },
            { prim: 'NONE', args: [{ prim: 'key_hash' }] },
            {
              prim: 'CREATE_CONTRACT',
              args: [
                [
                  { prim: 'parameter', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  { prim: 'storage', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  {
                    prim: 'code',
                    args: [
                      [
                        { prim: 'CAR' },
                        {
                          prim: 'MAP',
                          args: [
                            [
                              { prim: 'PUSH', args: [{ prim: 'int' }, { int: '1' }] },
                              { prim: 'ADD' },
                            ],
                          ],
                        },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' },
                      ],
                    ],
                  },
                ],
              ],
            },
            { prim: 'SWAP' },
            { prim: 'DROP' },
            { prim: 'CONS' },
            { prim: 'NIL', args: [{ prim: 'int' }] },
            { prim: 'AMOUNT' },
            { prim: 'NONE', args: [{ prim: 'key_hash' }] },
            {
              prim: 'CREATE_CONTRACT',
              args: [
                [
                  { prim: 'parameter', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  { prim: 'storage', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  {
                    prim: 'code',
                    args: [
                      [
                        { prim: 'CAR' },
                        {
                          prim: 'MAP',
                          args: [
                            [
                              { prim: 'PUSH', args: [{ prim: 'int' }, { int: '1' }] },
                              { prim: 'ADD' },
                            ],
                          ],
                        },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' },
                      ],
                    ],
                  },
                ],
              ],
            },
            { prim: 'SWAP' },
            { prim: 'DROP' },
            { prim: 'CONS' },
          ],
        },
        metadata: {
          balance_updates: [],
          operation_result: {
            status: 'applied',
            storage: { bytes: '012ffebbf1560632ca767bc960ccdb84669d284c2c' },
            consumed_milligas: '17707000',
            storage_size: '232',
          },
          internal_operation_results: [
            {
              kind: 'origination',
              source: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
              nonce: 1,
              balance: '0',
              script: {
                code: [
                  { prim: 'parameter', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  { prim: 'storage', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  {
                    prim: 'code',
                    args: [
                      [
                        { prim: 'CAR' },
                        {
                          prim: 'MAP',
                          args: [
                            [
                              { prim: 'PUSH', args: [{ prim: 'int' }, { int: '1' }] },
                              { prim: 'ADD' },
                            ],
                          ],
                        },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' },
                      ],
                    ],
                  },
                ],
                storage: [],
              },
              result: {
                status: 'applied',
                big_map_diff: [],
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                    change: '-60000',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                    change: '-257000',
                  },
                ],
                originated_contracts: ['KT1D1AoSDxnmGk8UWFW7DcT9JP1VpLqUNh4F'],
                consumed_milligas: '11560000',
                storage_size: '60',
                paid_storage_size_diff: '60',
              },
            },
            {
              kind: 'origination',
              source: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
              nonce: 0,
              balance: '0',
              script: {
                code: [
                  { prim: 'parameter', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  { prim: 'storage', args: [{ prim: 'list', args: [{ prim: 'int' }] }] },
                  {
                    prim: 'code',
                    args: [
                      [
                        { prim: 'CAR' },
                        {
                          prim: 'MAP',
                          args: [
                            [
                              { prim: 'PUSH', args: [{ prim: 'int' }, { int: '1' }] },
                              { prim: 'ADD' },
                            ],
                          ],
                        },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' },
                      ],
                    ],
                  },
                ],
                storage: [],
              },
              result: {
                status: 'applied',
                big_map_diff: [],
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                    change: '-60000',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                    change: '-257000',
                  },
                ],
                originated_contracts: ['KT1A5V7HHF7Z7QPn5n9dg4EjzTRJ4mnE21zE'],
                consumed_milligas: '11561000',
                storage_size: '60',
                paid_storage_size_diff: '60',
              },
            },
          ],
        },
      },
    ],
    signature:
      'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
  };
};

export const multipleInternalTransfer = () => {
  return {
    contents: [
      {
        kind: 'reveal',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '1420',
        counter: '294312',
        gas_limit: '10600',
        storage_limit: '0',
        public_key: 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
        metadata: {
          balance_updates: [
            { kind: 'contract', contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD', change: '-1420' },
            {
              kind: 'freezer',
              category: 'fees',
              delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
              cycle: 104,
              change: '1420',
            },
          ],
          operation_result: { status: 'applied', consumed_milligas: '10000000' },
        },
      },
      {
        kind: 'transaction',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '0',
        counter: '294313',
        gas_limit: '800000',
        storage_limit: '2000',
        amount: '0',
        destination: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
        parameters: {
          entrypoint: 'do',
          value: [
            { prim: 'DROP' },
            { prim: 'NIL', args: [{ prim: 'operation' }] },
            {
              prim: 'PUSH',
              args: [{ prim: 'key_hash' }, { string: 'tz3hRZUScFCcEVhdDjXWoyekbgd1Gatga6mp' }],
            },
            { prim: 'IMPLICIT_ACCOUNT' },
            { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '50' }] },
            { prim: 'UNIT' },
            { prim: 'TRANSFER_TOKENS' },
            { prim: 'CONS' },
            {
              prim: 'PUSH',
              args: [{ prim: 'key_hash' }, { string: 'tz2UBGrEBKzzW6hjXjxxiQFJNg6WR2bm6GEN' }],
            },
            { prim: 'IMPLICIT_ACCOUNT' },
            { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '50' }] },
            { prim: 'UNIT' },
            { prim: 'TRANSFER_TOKENS' },
            { prim: 'CONS' },
          ],
        },
        metadata: {
          balance_updates: [],
          operation_result: {
            status: 'applied',
            storage: { bytes: '012ffebbf1560632ca767bc960ccdb84669d284c2c' },
            consumed_milligas: '16361000',
            storage_size: '232',
          },
          internal_operation_results: [
            {
              kind: 'transaction',
              source: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
              nonce: 1,
              amount: '50',
              destination: 'tz2UBGrEBKzzW6hjXjxxiQFJNg6WR2bm6GEN',
              result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
                    change: '-50',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz2UBGrEBKzzW6hjXjxxiQFJNg6WR2bm6GEN',
                    change: '50',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                    change: '-257000',
                  },
                ],
                consumed_milligas: '10207000',
                allocated_destination_contract: true,
              },
            },
            {
              kind: 'transaction',
              source: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
              nonce: 0,
              amount: '50',
              destination: 'tz3hRZUScFCcEVhdDjXWoyekbgd1Gatga6mp',
              result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
                    change: '-50',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz3hRZUScFCcEVhdDjXWoyekbgd1Gatga6mp',
                    change: '50',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                    change: '-257000',
                  },
                ],
                consumed_milligas: '10207000',
                allocated_destination_contract: true,
              },
            },
          ],
        },
      },
    ],
    signature:
      'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
  };
};

export const internalTransfer = () => {
  return {
    contents: [
      {
        kind: 'reveal',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '1420',
        counter: '294312',
        gas_limit: '10600',
        storage_limit: '0',
        public_key: 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
        metadata: {
          balance_updates: [
            { kind: 'contract', contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD', change: '-1420' },
            {
              kind: 'freezer',
              category: 'fees',
              delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
              cycle: 104,
              change: '1420',
            },
          ],
          operation_result: { status: 'applied', consumed_milligas: '10000000' },
        },
      },
      {
        kind: 'transaction',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '0',
        counter: '294313',
        gas_limit: '800000',
        storage_limit: '2000',
        amount: '0',
        destination: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
        parameters: {
          entrypoint: 'do',
          value: [
            { prim: 'DROP' },
            { prim: 'NIL', args: [{ prim: 'operation' }] },
            {
              prim: 'PUSH',
              args: [{ prim: 'key_hash' }, { string: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh' }],
            },
            { prim: 'IMPLICIT_ACCOUNT' },
            { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '50' }] },
            { prim: 'UNIT' },
            { prim: 'TRANSFER_TOKENS' },
            { prim: 'CONS' },
          ],
        },
        metadata: {
          balance_updates: [],
          operation_result: {
            status: 'applied',
            storage: { bytes: '012ffebbf1560632ca767bc960ccdb84669d284c2c' },
            consumed_milligas: '15953000',
            storage_size: '232',
          },
          internal_operation_results: [
            {
              kind: 'transaction',
              source: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
              nonce: 0,
              amount: '50',
              destination: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
              result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'KT1CaQ97jZnvA9KgNFSFoNfGXJXJgMrFvqkb',
                    change: '-50',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
                    change: '50',
                  },
                ],
                consumed_milligas: '10207000',
              },
            },
          ],
        },
      },
    ],
    signature:
      'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
  };
};

export const delegate = () => {
  return {
    contents: [
      {
        kind: 'reveal',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '1420',
        counter: '294312',
        gas_limit: '10600',
        storage_limit: '0',
        public_key: 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
        metadata: {
          balance_updates: [
            { kind: 'contract', contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD', change: '-1420' },
            {
              kind: 'freezer',
              category: 'fees',
              delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
              cycle: 104,
              change: '1420',
            },
          ],
          operation_result: { status: 'applied', consumed_milligas: '10000000' },
        },
      },
      {
        kind: 'delegation',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '0',
        counter: '294313',
        gas_limit: '800000',
        storage_limit: '2000',
        delegate: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
        metadata: {
          balance_updates: [],
          operation_result: { status: 'applied', consumed_milligas: '10000000' },
        },
      },
    ],
    signature:
      'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
  };
};

export const origination = () => {
  return {
    contents: [
      {
        kind: 'reveal',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '1420',
        counter: '294312',
        gas_limit: '10600',
        storage_limit: '0',
        public_key: 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
        metadata: {
          balance_updates: [
            { kind: 'contract', contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD', change: '-1420' },
            {
              kind: 'freezer',
              category: 'fees',
              delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
              cycle: 104,
              change: '1420',
            },
          ],
          operation_result: { status: 'applied', consumed_milligas: '10000000' },
        },
      },
      {
        kind: 'origination',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '0',
        counter: '294313',
        gas_limit: '800000',
        storage_limit: '2000',
        balance: '1000000',
        script: {
          code: [
            { prim: 'parameter', args: [{ prim: 'int' }] },
            { prim: 'storage', args: [{ prim: 'int' }] },
            {
              prim: 'code',
              args: [
                [
                  [],
                  [
                    [
                      [[{ prim: 'DUP' }], { prim: 'CAR' }],
                      [
                        [
                          [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                          { prim: 'CDR' },
                        ],
                        [
                          { prim: 'PUSH', args: [{ prim: 'unit' }, { prim: 'Unit' }] },
                          [
                            [
                              [
                                [
                                  [
                                    {
                                      prim: 'DIP',
                                      args: [
                                        [
                                          [
                                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                            { prim: 'SWAP' },
                                          ],
                                        ],
                                      ],
                                    },
                                    { prim: 'SWAP' },
                                  ],
                                  [
                                    {
                                      prim: 'DIP',
                                      args: [
                                        [
                                          [
                                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                            { prim: 'SWAP' },
                                          ],
                                        ],
                                      ],
                                    },
                                    { prim: 'SWAP' },
                                  ],
                                ],
                                { prim: 'ADD' },
                              ],
                              { prim: 'NIL', args: [{ prim: 'operation' }] },
                            ],
                            { prim: 'PAIR' },
                          ],
                        ],
                        [],
                        {
                          prim: 'DIP',
                          args: [
                            [
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [[{ prim: 'DIP', args: [[[]]] }]],
                                              },
                                            ],
                                          ],
                                        },
                                        { prim: 'DROP' },
                                      ],
                                    ],
                                  ],
                                },
                                { prim: 'DROP' },
                              ],
                            ],
                          ],
                        },
                      ],
                      [],
                      {
                        prim: 'DIP',
                        args: [
                          [
                            [
                              { prim: 'DIP', args: [[{ prim: 'DIP', args: [[[]]] }]] },
                              { prim: 'DROP' },
                            ],
                          ],
                        ],
                      },
                    ],
                    { prim: 'DIP', args: [[[{ prim: 'DIP', args: [[[]]] }, { prim: 'DROP' }]]] },
                  ],
                ],
              ],
            },
          ],
          storage: { int: '0' },
        },
        metadata: {
          balance_updates: [],
          operation_result: {
            status: 'applied',
            big_map_diff: [],
            balance_updates: [
              {
                kind: 'contract',
                contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                change: '-314000',
              },
              {
                kind: 'contract',
                contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                change: '-257000',
              },
              {
                kind: 'contract',
                contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                change: '-1000000',
              },
              {
                kind: 'contract',
                contract: 'KT1SHzXbcUAiCSUn5QYca872gYcDACr6AuuC',
                change: '1000000',
              },
            ],
            originated_contracts: ['KT1SHzXbcUAiCSUn5QYca872gYcDACr6AuuC'],
            consumed_milligas: '17832000',
            storage_size: '314',
            paid_storage_size_diff: '314',
          },
        },
      },
    ],
    signature:
      'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
  };
};

export const transferWithoutAllocation = () => {
  return {
    contents: [
      {
        kind: 'reveal',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '1420',
        counter: '294312',
        gas_limit: '10600',
        storage_limit: '0',
        public_key: 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
        metadata: {
          balance_updates: [
            { kind: 'contract', contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD', change: '-1420' },
            {
              kind: 'freezer',
              category: 'fees',
              delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
              cycle: 104,
              change: '1420',
            },
          ],
          operation_result: { status: 'applied', consumed_milligas: '10000000' },
        },
      },
      {
        kind: 'transaction',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '0',
        counter: '294313',
        gas_limit: '800000',
        storage_limit: '2000',
        amount: '1900000',
        destination: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
        metadata: {
          balance_updates: [],
          operation_result: {
            status: 'applied',
            balance_updates: [
              {
                kind: 'contract',
                contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                change: '-1900000',
              },
              {
                kind: 'contract',
                contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
                change: '1900000',
              },
            ],
            consumed_milligas: '10207000',
          },
        },
      },
    ],
    signature:
      'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
  };
};

export const transferWithAllocation = () => {
  return {
    contents: [
      {
        kind: 'reveal',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '1420',
        counter: '294312',
        gas_limit: '10600',
        storage_limit: '0',
        public_key: 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
        metadata: {
          balance_updates: [
            { kind: 'contract', contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD', change: '-1420' },
            {
              kind: 'freezer',
              category: 'fees',
              delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
              cycle: 104,
              change: '1420',
            },
          ],
          operation_result: { status: 'applied', consumed_milligas: '10000000' },
        },
      },
      {
        kind: 'transaction',
        source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
        fee: '0',
        counter: '294313',
        gas_limit: '800000',
        storage_limit: '2000',
        amount: '1700000',
        destination: 'tz3hRZUScFCcEVhdDjXWoyekbgd1Gatga6mp',
        metadata: {
          balance_updates: [],
          operation_result: {
            status: 'applied',
            balance_updates: [
              {
                kind: 'contract',
                contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                change: '-1700000',
              },
              {
                kind: 'contract',
                contract: 'tz3hRZUScFCcEVhdDjXWoyekbgd1Gatga6mp',
                change: '1700000',
              },
              {
                kind: 'contract',
                contract: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
                change: '-257000',
              },
            ],
            consumed_milligas: '10207000',
            allocated_destination_contract: true,
          },
        },
      },
    ],
    signature:
      'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
  };
};

export const preapplyResultFrom = (_params: TransferParams) => {
  const result = [
    {
      contents: [
        {
          kind: 'transaction',
          source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
          fee: '20000',
          counter: '121528',
          gas_limit: '20000',
          storage_limit: '0',
          amount: '0',
          destination: 'KT1BjNCteztvGsjvbHTtQ5ynWqhjSVdR285M',
          metadata: {
            balance_updates: [
              {
                kind: 'contract',
                contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
                change: '-20000',
              },
              {
                kind: 'freezer',
                category: 'fees',
                delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
                cycle: 48,
                change: '20000',
              },
            ],
            operation_result: {},
          },
        },
      ],
      signature:
        'edsigtood4PgwEsysYdC2UTUCftkov56JYmLBU6eAYP7Knsf2HMJYcs9JjC4ufKGz115EE5Pa6A223ysscdwksEW6scK2b6aNEc',
    },
  ];
  return errorBuilder(result);
};

export const registerGlobalConstantNoReveal = {
  contents: [
    {
      kind: 'register_global_constant',
      source: 'tz2EAB6atB3w7tJPwYF43vymDShZtGLh8TRb',
      fee: '0',
      counter: '8642842',
      gas_limit: '1040000',
      storage_limit: '32768',
      value: {
        prim: 'Pair',
        args: [{ int: '998' }, { int: '999' }],
      },
      metadata: {
        balance_updates: [],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz2EAB6atB3w7tJPwYF43vymDShZtGLh8TRb',
              change: '-18250',
              origin: 'block',
            },
          ],
          consumed_milligas: '1230000',
          storage_size: '73',
          global_address: 'exprui2KzJsukZATaHBgRCM3vZEZtwYMW3rdJwHm5pCX3KeXVC1Koc',
        },
      },
    },
  ],
  signature:
    'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
};

export const registerGlobalConstantWithReveal = {
  contents: [
    {
      kind: 'reveal',
      source: 'tz2EAB6atB3w7tJPwYF43vymDShZtGLh8TRb',
      fee: '1420',
      counter: '294312',
      gas_limit: '10600',
      storage_limit: '0',
      public_key: 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
      metadata: {
        balance_updates: [
          { kind: 'contract', contract: 'tz2EAB6atB3w7tJPwYF43vymDShZtGLh8TRb', change: '-1420' },
          {
            kind: 'freezer',
            category: 'fees',
            delegate: 'tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU',
            cycle: 104,
            change: '1420',
          },
        ],
        operation_result: { status: 'applied', consumed_milligas: '10000000' },
      },
    },
    registerGlobalConstantNoReveal.contents[0],
  ],
  signature:
    'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
};

export const registerGlobalConstantWithError = {
  contents: [
    {
      ...registerGlobalConstantNoReveal.contents[0],
      metadata: {
        balance_updates: [],
        operation_result: {
          status: 'failed',
          errors: [
            {
              kind: 'branch',
              id: 'proto.011-PtHangzH.Expression_already_registered',
            },
            {
              kind: 'permanent',
              id: 'proto.011-PtHangzH.context.storage_error',
              existing_key: [
                'global_constant',
                'f4b54fa94f3255df3ab6a95d0112964d825642706d42de848b3c507ff4602c4a',
                'len',
              ],
            },
          ],
        },
      },
    },
  ],
  signature:
    'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
};

export const TransferTicketNoReveal = {
  contents: [
    {
      kind: 'transfer_ticket',
      source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
      fee: '804',
      gas_limit: '5009',
      storage_limit: '130',
      counter: '145',
      ticket_contents: { string: 'foobar' },
      ticket_ty: { prim: 'string' },
      ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
      ticket_amount: '2',
      destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
      entrypoint: 'default',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
            change: '-804',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '804',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
              change: '-16500',
              origin: 'block',
            },
            {
              kind: 'burned',
              category: 'storage fees',
              change: '16500',
              origin: 'block',
            },
          ],
          consumed_milligas: '2122881',
          paid_storage_size_diff: '66',
        },
      },
    },
  ],
  signature:
    'sigSqrxEBiHXwuXgXUB8S67dtSycbFvduxpi2Fn7LeVdefgr7FicV5KajbW1z44hykdZA6Mznef3fpPXAcbfaYBUYdWPPbXG',
};

export const TransferTicketWithReveal = {
  contents: [
    {
      kind: 'reveal',
      source: 'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
      fee: '1420',
      counter: '294312',
      gas_limit: '10600',
      storage_limit: '0',
      public_key: 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
      metadata: {
        operation_result: { status: 'applied', consumed_milligas: '1000000' },
      },
    },
    {
      kind: 'transfer_ticket',
      source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
      fee: '804',
      gas_limit: '5009',
      storage_limit: '130',
      counter: '145',
      ticket_contents: { string: 'foobar' },
      ticket_ty: { prim: 'string' },
      ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
      ticket_amount: '2',
      destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
      entrypoint: 'default',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
            change: '-804',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '804',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
              change: '-16500',
              origin: 'block',
            },
            {
              kind: 'burned',
              category: 'storage fees',
              change: '16500',
              origin: 'block',
            },
          ],
          consumed_milligas: '2122881',
          paid_storage_size_diff: '66',
        },
      },
    },
  ],
  signature:
    'sigSqrxEBiHXwuXgXUB8S67dtSycbFvduxpi2Fn7LeVdefgr7FicV5KajbW1z44hykdZA6Mznef3fpPXAcbfaYBUYdWPPbXG',
};

export const updateConsensusKeyNoReveal = {
  contents: [
    {
      kind: 'update_consensus_key',
      source: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
      fee: '369',
      counter: '19043',
      gas_limit: '1100',
      storage_limit: '0',
      pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
            change: '-369',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '369',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          consumed_gas: '1000',
          consumed_milligas: '1000000',
        },
      },
    },
  ],
  signature:
    'sigrsWF7LpFpUBrTdvLnKm8DMuijk1LcZovZdKZDgsaafTPZhKsvLzPFHDzZYKCy4kobkgxVL7YPGnU5qzJJBcP2cAu5HW1C',
};

export const updateCompanionKeyNoReveal = {
  contents: [
    {
      kind: 'update_companion_key',
      source: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
      fee: '369',
      counter: '19043',
      gas_limit: '1100',
      storage_limit: '0',
      pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
            change: '-369',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '369',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          consumed_gas: '1000',
          consumed_milligas: '1000000',
        },
      },
    },
  ],
  signature:
    'sigrsWF7LpFpUBrTdvLnKm8DMuijk1LcZovZdKZDgsaafTPZhKsvLzPFHDzZYKCy4kobkgxVL7YPGnU5qzJJBcP2cAu5HW1C',
};
export const smartRollupAddMessagesNoReveal = {
  contents: [
    {
      kind: 'smart_rollup_add_messages',
      source: 'tz2Q3yRaczTqZVf3ZQvwiiTqKjhJFyDzeRSz',
      fee: '398',
      counter: '12191',
      gas_limit: '1103',
      storage_limit: '0',
      message: [
        '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74',
      ],
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz2Q3yRaczTqZVf3ZQvwiiTqKjhJFyDzeRSz',
            change: '-398',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '398',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          consumed_milligas: '1002777',
        },
      },
    },
  ],
  signature:
    'sigSUjvKxjAZ4dBWbo4idKKwFDVfLtYscMMqHoQY8KgyghtyaswECPaBhjK921vj2uEsdKD7WJTeVVT1ZDcvwp8rkRuEW9kv',
};

export const smartRollupOriginateWithReveal = {
  contents: [
    {
      kind: 'reveal',
      source: 'tz2Q3yRaczTqZVf3ZQvwiiTqKjhJFyDzeRSz',
      fee: '359',
      counter: '12054',
      gas_limit: '1000',
      storage_limit: '0',
      public_key: 'sppk7d2tnVN58p2fnxD2ru52kZs71YxdLv4CpWSp1DhkwdaE1vtUeTJ',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz2Q3yRaczTqZVf3ZQvwiiTqKjhJFyDzeRSz',
            change: '-359',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '359',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          consumed_milligas: '1000000',
        },
      },
    },
    {
      kind: 'smart_rollup_originate',
      source: 'tz2Q3yRaczTqZVf3ZQvwiiTqKjhJFyDzeRSz',
      fee: '957',
      counter: '12055',
      gas_limit: '2849',
      storage_limit: '6572',
      pvm_kind: 'wasm_2_0_0',
      kernel:
        '0061736d0100000001280760037f7f7f017f60027f7f017f60057f7f7f7f7f017f60017f0060017f017f60027f7f0060000002610311736d6172745f726f6c6c75705f636f72650a726561645f696e707574000011736d6172745f726f6c6c75705f636f72650c77726974655f6f7574707574000111736d6172745f726f6c6c75705f636f72650b73746f72655f77726974650002030504030405060503010001071402036d656d02000a6b65726e656c5f72756e00060aa401042a01027f41fa002f0100210120002f010021022001200247044041e4004112410041e400410010021a0b0b0800200041c4006b0b5001057f41fe002d0000210341fc002f0100210220002d0000210420002f0100210520011004210620042003460440200041016a200141016b10011a0520052002460440200041076a200610011a0b0b0b1d01017f41dc0141840241901c100021004184022000100541840210030b0b38050041e4000b122f6b65726e656c2f656e762f7265626f6f740041f8000b0200010041fa000b0200020041fc000b0200000041fe000b0101',
      parameters_ty: {
        prim: 'bytes',
      },
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz2Q3yRaczTqZVf3ZQvwiiTqKjhJFyDzeRSz',
            change: '-957',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '957',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz2Q3yRaczTqZVf3ZQvwiiTqKjhJFyDzeRSz',
              change: '-1638000',
              origin: 'block',
            },
            {
              kind: 'burned',
              category: 'storage fees',
              change: '1638000',
              origin: 'block',
            },
          ],
          address: 'sr1HxZ24YmT3hkpeSaxb6N7vrpp6BfbPSrEh',
          genesis_commitment_hash: 'src135NQY1CGVUaYdE5Jp4PZn8CzGuznh4bz8z5cwtuCbSanLMdPER',
          consumed_milligas: '2748269',
          size: '6552',
        },
      },
    },
  ],
  signature:
    'sigRjjHRNcKkfHxRf7kMeQ1Qsjn4SzX6e7Y4zKZqYHDiWC4C9yHDg5f4pusM6usfbitBxmAS9efcVUxBg8TpD6MhR5fipAya',
};

export const smartRollupExecuteOutboxMessageNoReveal = {
  contents: [
    {
      kind: 'smart_rollup_execute_outbox_message',
      source: 'tz1adKm6kWEkiejZ9WYpuHvBCgUewtCxpqRF',
      fee: '1618',
      counter: '13',
      gas_limit: '6485',
      storage_limit: '36',
      rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
      cemented_commitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
      output_proof:
        '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1adKm6kWEkiejZ9WYpuHvBCgUewtCxpqRF',
            change: '-1618',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '1618',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz1adKm6kWEkiejZ9WYpuHvBCgUewtCxpqRF',
              change: '-1250',
              origin: 'block',
            },
            {
              kind: 'burned',
              category: 'storage fees',
              change: '1250',
              origin: 'block',
            },
          ],
          ticket_updates: [],
          consumed_milligas: '4731015',
          paid_storage_size_diff: '5',
        },
        internal_operation_results: [
          {
            kind: 'transaction',
            source: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
            nonce: 0,
            amount: '0',
            destination: 'KT1RstTQHYxjwHpN8jHaqBPgtxJdMSC4cc3w',
            parameters: {
              entrypoint: 'default',
              value: {
                string: 'Hello world',
              },
            },
            result: {
              status: 'applied',
              storage: {
                string: 'Hello world',
              },
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1adKm6kWEkiejZ9WYpuHvBCgUewtCxpqRF',
                  change: '-2750',
                  origin: 'block',
                },
                {
                  kind: 'burned',
                  category: 'storage fees',
                  change: '2750',
                  origin: 'block',
                },
              ],
              consumed_milligas: '1653300',
              storage_size: '52',
              paid_storage_size_diff: '11',
            },
          },
        ],
      },
    },
  ],
  signature:
    'sigs8LVwSkqcMLzTVZWa1yS8aNz26A8bzR6QUHws5uVELh6kcmH7dWz5aKPqW3RXoFfynf5kVCvLJcsP3ucB5P6DEbD2YcQR',
};

export const stakeNoReveal = {
  contents: [
    {
      kind: 'transaction',
      source: 'tz1X1TKpLiZuPEo2YVvDiqQ47Zp9a797ejkp',
      fee: '623',
      counter: '390',
      gas_limit: '3630',
      storage_limit: '0',
      amount: '6000000000',
      destination: 'tz1X1TKpLiZuPEo2YVvDiqQ47Zp9a797ejkp',
      parameters: {
        entrypoint: 'stake',
        value: {
          prim: 'Unit',
        },
      },
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1X1TKpLiZuPEo2YVvDiqQ47Zp9a797ejkp',
            change: '-623',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '623',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz1X1TKpLiZuPEo2YVvDiqQ47Zp9a797ejkp',
              change: '-6000000000',
              origin: 'block',
            },
            {
              kind: 'freezer',
              category: 'deposits',
              staker: {
                baker: 'tz1X1TKpLiZuPEo2YVvDiqQ47Zp9a797ejkp',
              },
              change: '6000000000',
              origin: 'block',
            },
          ],
          consumed_milligas: '3629020',
        },
      },
    },
  ],
  signature:
    'sigRn6MmipGZEBYYCrN5MYQmc8A6ye8iBJdahUY4gfHwFAP8kFXaoRvEx51bmo2qmfEDobuUJ4Ld9HKyuS9tV45qmKzLhuVE',
};

export const unstakeNoReveal = {
  contents: [
    {
      kind: 'transaction',
      source: 'tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX',
      fee: '689',
      counter: '408',
      gas_limit: '4250',
      storage_limit: '0',
      amount: '99999999999000000',
      destination: 'tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX',
      parameters: {
        entrypoint: 'unstake',
        value: {
          prim: 'Unit',
        },
      },
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX',
            change: '-689',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '689',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'staking',
              category: 'delegate_denominator',
              delegate: 'tz1X1TKpLiZuPEo2YVvDiqQ47Zp9a797ejkp',
              change: '-1000000000',
              origin: 'block',
            },
            {
              kind: 'staking',
              category: 'delegator_numerator',
              delegator: 'tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX',
              change: '-1000000000',
              origin: 'block',
            },
            {
              kind: 'freezer',
              category: 'deposits',
              staker: {
                contract: 'tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX',
                delegate: 'tz1X1TKpLiZuPEo2YVvDiqQ47Zp9a797ejkp',
              },
              change: '-1000000000',
              origin: 'block',
            },
            {
              kind: 'freezer',
              category: 'unstaked_deposits',
              staker: {
                contract: 'tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX',
                delegate: 'tz1X1TKpLiZuPEo2YVvDiqQ47Zp9a797ejkp',
              },
              cycle: 37,
              change: '1000000000',
              origin: 'block',
            },
          ],
          consumed_milligas: '4249152',
        },
      },
    },
  ],
  signature:
    'sighibvGpL1NnZUyBfHPpPqE67tCb3aFK9L5JWhXA1GS9GqcizyZEEUfAGvzLMHxFG9oohhDzCJdMLFxppy3xbS9ZX45tWhM',
};

export const finalizeUnstakeNoReveal = {
  contents: [
    {
      kind: 'transaction',
      source: 'tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX',
      fee: '409',
      counter: '409',
      gas_limit: '1529',
      storage_limit: '0',
      amount: '0',
      destination: 'tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX',
      parameters: {
        entrypoint: 'finalize_unstake',
        value: {
          prim: 'Unit',
        },
      },
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1eDDguimfor6kkt96Ri4pBeEZXEzvuyjQX',
            change: '-409',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '409',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          consumed_milligas: '1528887',
        },
      },
    },
  ],
  signature:
    'sigoVqiaKpRr5jctRcRXmpJaeRFPxKTRAaUyEbhGXWbKyo1EZ1eBCjVzN7Cg7nzSexQLWit75o2cJPd3bfJn1ciwHRHDLCSf',
};

export const finalizeUnstakeNoRevealDiffSourceDestination = {
  contents: [
    {
      kind: 'transaction',
      source: 'tz2RqxsYQyFuP9amsmrr25x9bUcBMWXGvjuD',
      fee: '429',
      counter: '2414',
      gas_limit: '1729',
      storage_limit: '0',
      amount: '0',
      destination: 'tz1NFvwejbSCLBBuzCrZQgod3GkaMQJ9HoMf',
      parameters: {
        entrypoint: 'finalize_unstake',
        value: {
          prim: 'Unit',
        },
      },
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz2RqxsYQyFuP9amsmrr25x9bUcBMWXGvjuD',
            change: '-429',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '429',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'freezer',
              category: 'unstaked_deposits',
              staker: {
                contract: 'tz1NFvwejbSCLBBuzCrZQgod3GkaMQJ9HoMf',
                delegate: 'tz1TGKSrZrBpND3PELJ43nVdyadoeiM1WMzb',
              },
              cycle: 965,
              change: '-4999999',
              origin: 'block',
            },
            {
              kind: 'contract',
              contract: 'tz1NFvwejbSCLBBuzCrZQgod3GkaMQJ9HoMf',
              change: '4999999',
              origin: 'block',
            },
          ],
          consumed_milligas: '1714687',
        },
      },
    },
  ],
  signature:
    'spsig1bX45Tx8xMBLqgpuX34SRhqkc4QYoKrAreUQgHxsHuAqFVm3Kzs5oRYXyJF166dxNjMd3W3R3e1pTxUmFtKWfq3J84u8GH',
};
