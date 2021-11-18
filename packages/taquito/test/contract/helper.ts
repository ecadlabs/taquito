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
    withInternalError: () => {
      result[0].contents[0].metadata.operation_result = {
        status: 'backtracked',
        storage: { bytes: '00b2e19a9e74440d86c59f13dab8a18ff873e889ea' },
        consumed_gas: '15953',
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
          operation_result: { status: 'applied', consumed_gas: '10000' },
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
            consumed_gas: '17707',
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
                consumed_gas: '11560',
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
                consumed_gas: '11561',
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
            consumed_gas: '17707',
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
                consumed_gas: '11560',
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
                consumed_gas: '11561',
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
          operation_result: { status: 'applied', consumed_gas: '10000' },
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
            consumed_gas: '16361',
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
                consumed_gas: '10207',
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
                consumed_gas: '10207',
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
          operation_result: { status: 'applied', consumed_gas: '10000' },
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
            consumed_gas: '15953',
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
                consumed_gas: '10207',
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
          operation_result: { status: 'applied', consumed_gas: '10000' },
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
          operation_result: { status: 'applied', consumed_gas: '10000' },
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
          operation_result: { status: 'applied', consumed_gas: '10000' },
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
            consumed_gas: '17832',
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
          operation_result: { status: 'applied', consumed_gas: '10000' },
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
            consumed_gas: '10207',
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
          operation_result: { status: 'applied', consumed_gas: '10000' },
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
            consumed_gas: '10207',
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
        args: [{ int: '998' }, { int: '999' }]
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
              origin: 'block'
            }
          ],
          consumed_gas: '1230',
          storage_size: '73',
          global_address: 'exprui2KzJsukZATaHBgRCM3vZEZtwYMW3rdJwHm5pCX3KeXVC1Koc'
        }
      }
    }
  ],
  signature: 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg'
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
            change: '1420'
          }
        ],
        operation_result: { status: 'applied', consumed_gas: '10000' }
      }
    },
    registerGlobalConstantNoReveal.contents[0]
  ],
  signature: 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg'
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
              id: 'proto.011-PtHangzH.Expression_already_registered'
            },
            {
              kind: 'permanent',
              id: 'proto.011-PtHangzH.context.storage_error',
              existing_key: [
                'global_constant',
                'f4b54fa94f3255df3ab6a95d0112964d825642706d42de848b3c507ff4602c4a',
                'len'
              ]
            }
          ]
        }
      }
    }
  ],
  signature: 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg'
};
