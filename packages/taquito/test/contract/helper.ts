import { TransferParams } from '../../src/operations/types';

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
