import { OperationContentsAndResult } from '@taquito/rpc';

export const resultOriginations = [
  {
    kind: 'origination',
    source: 'tz2Gqo2mHThaY3ymDpEE223i25jW7pAVtEyH',
    fee: '723',
    counter: '587775',
    gas_limit: '1570',
    storage_limit: '571',
    balance: '1000000',
    script: {
      code: [],
      storage: {
        int: '0',
      },
    },
    metadata: {
      balance_updates: [],
      operation_result: {
        status: 'applied',
        balance_updates: [],
        originated_contracts: ['KT1Wr1xjQAzb44AcPRV9F9oyPurkFz7y2otC'],
        consumed_milligas: '1469767',
        storage_size: '314',
        paid_storage_size_diff: '314',
      },
    },
  },
  {
    kind: 'origination',
    source: 'tz2Gqo2mHThaY3ymDpEE223i25jW7pAVtEyH',
    fee: '723',
    counter: '587776',
    gas_limit: '1570',
    storage_limit: '571',
    balance: '1000000',
    script: {
      code: [],
      storage: {
        int: '0',
      },
    },
    metadata: {
      balance_updates: [],
      operation_result: {
        status: 'applied',
        balance_updates: [],
        originated_contracts: ['KT1SG1LfkoMoEqR5srtiYeYcciaZfBTGzTgY'],
        consumed_milligas: '1469767',
        storage_size: '314',
        paid_storage_size_diff: '314',
      },
    },
  },
] as unknown as OperationContentsAndResult[];

export const successfulResult = [
  {
    kind: 'transaction',
    source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
    fee: '1831',
    counter: '121636',
    gas_limit: '15385',
    storage_limit: '257',
    amount: '1000000',
    destination: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
    metadata: {
      balance_updates: [
        { kind: 'contract', contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys', change: '-1831' },
        {
          kind: 'freezer',
          category: 'fees',
          delegate: 'tz1VxS7ff4YnZRs8b4mMP4WaMVpoQjuo1rjf',
          cycle: 55,
          change: '1831',
        },
      ],
      operation_result: {
        status: 'applied',
        storage: { bytes: '00b2e19a9e74440d86c59f13dab8a18ff873e889ea' },
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
            change: '-1000000',
          },
          {
            kind: 'contract',
            contract: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
            change: '1000000',
          },
        ],
        consumed_milligas: '15285000',
        storage_size: '232',
      },
    },
  },
  {
    kind: 'transaction',
    source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
    fee: '2991',
    counter: '121637',
    gas_limit: '26260',
    storage_limit: '257',
    amount: '0',
    destination: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
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
      balance_updates: [
        { kind: 'contract', contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys', change: '-2991' },
        {
          kind: 'freezer',
          category: 'fees',
          delegate: 'tz1VxS7ff4YnZRs8b4mMP4WaMVpoQjuo1rjf',
          cycle: 55,
          change: '2991',
        },
      ],
      operation_result: {
        status: 'applied',
        storage: { bytes: '00b2e19a9e74440d86c59f13dab8a18ff873e889ea' },
        consumed_milligas: '15953000',
        storage_size: '232',
      },
      internal_operation_results: [
        {
          kind: 'transaction',
          source: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
          nonce: 0,
          amount: '50',
          destination: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
          result: {
            status: 'applied',
            balance_updates: [
              {
                kind: 'contract',
                contract: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
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
  {
    kind: 'transaction',
    source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
    fee: '2947',
    counter: '121638',
    gas_limit: '25894',
    storage_limit: '257',
    amount: '0',
    destination: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
    parameters: {
      entrypoint: 'do',
      value: [
        { prim: 'DROP' },
        { prim: 'NIL', args: [{ prim: 'operation' }] },
        {
          prim: 'PUSH',
          args: [{ prim: 'key_hash' }, { string: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9' }],
        },
        { prim: 'SOME' },
        { prim: 'SET_DELEGATE' },
        { prim: 'CONS' },
      ],
    },
    metadata: {
      balance_updates: [
        { kind: 'contract', contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys', change: '-2947' },
        {
          kind: 'freezer',
          category: 'fees',
          delegate: 'tz1VxS7ff4YnZRs8b4mMP4WaMVpoQjuo1rjf',
          cycle: 55,
          change: '2947',
        },
      ],
      operation_result: {
        status: 'applied',
        storage: { bytes: '00b2e19a9e74440d86c59f13dab8a18ff873e889ea' },
        consumed_milligas: '15794000',
        storage_size: '232',
      },
      internal_operation_results: [
        {
          kind: 'delegation',
          source: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
          nonce: 1,
          delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
          result: { status: 'applied', consumed_milligas: '10000000' },
        },
      ],
    },
  },
  {
    kind: 'transaction',
    source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
    fee: '2897',
    counter: '121639',
    gas_limit: '25822',
    storage_limit: '257',
    amount: '0',
    destination: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
    parameters: {
      entrypoint: 'do',
      value: [
        { prim: 'DROP' },
        { prim: 'NIL', args: [{ prim: 'operation' }] },
        { prim: 'NONE', args: [{ prim: 'key_hash' }] },
        { prim: 'SET_DELEGATE' },
        { prim: 'CONS' },
      ],
    },
    metadata: {
      balance_updates: [
        { kind: 'contract', contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys', change: '-2897' },
        {
          kind: 'freezer',
          category: 'fees',
          delegate: 'tz1VxS7ff4YnZRs8b4mMP4WaMVpoQjuo1rjf',
          cycle: 55,
          change: '2897',
        },
      ],
      operation_result: {
        status: 'applied',
        storage: { bytes: '00b2e19a9e74440d86c59f13dab8a18ff873e889ea' },
        consumed_milligas: '15722000',
        storage_size: '232',
      },
      internal_operation_results: [
        {
          kind: 'delegation',
          source: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
          nonce: 2,
          result: { status: 'applied', consumed_milligas: '10000000' },
        },
      ],
    },
  },
] as unknown as OperationContentsAndResult[];

export const resultWithoutOrigination = [
  {
    kind: 'origination',
    source: 'tz2Gqo2mHThaY3ymDpEE223i25jW7pAVtEyH',
    fee: '723',
    counter: '587775',
    gas_limit: '1570',
    storage_limit: '571',
    balance: '1000000',
    script: {
      code: {},
    },
    metadata: {
      balance_updates: [],
      operation_result: {
        status: 'applied',
        balance_updates: [],
        consumed_milligas: '1469767',
        storage_size: '314',
        paid_storage_size_diff: '314',
      },
    },
  },
  {
    kind: 'origination',
    source: 'tz2Gqo2mHThaY3ymDpEE223i25jW7pAVtEyH',
    fee: '723',
    counter: '587776',
    gas_limit: '1570',
    storage_limit: '571',
    balance: '1000000',
    script: {
      code: {},
    },
    metadata: {
      balance_updates: [],
      operation_result: {
        status: 'applied',
        balance_updates: [],
        consumed_milligas: '1469767',
        storage_size: '314',
        paid_storage_size_diff: '314',
      },
    },
  },
] as unknown as OperationContentsAndResult[];

export const resultSingleOrigination = [
  {
    kind: 'transaction',
    source: 'tz2Ayd83C7j9tSfpNDSRMVvic2Hj3ingjrY2',
    fee: '495',
    counter: '504878',
    gas_limit: '1551',
    storage_limit: '0',
    amount: '20000',
    destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
    metadata: {
      balance_updates: [],
      operation_result: {
        status: 'applied',
        balance_updates: [],
        consumed_milligas: '1450040',
      },
    },
  },
  {
    kind: 'transaction',
    source: 'tz2Ayd83C7j9tSfpNDSRMVvic2Hj3ingjrY2',
    fee: '495',
    counter: '504879',
    gas_limit: '1551',
    storage_limit: '0',
    amount: '20000',
    destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
    metadata: {
      balance_updates: [],
      operation_result: {
        status: 'applied',
        balance_updates: [],
        consumed_milligas: '1450040',
      },
    },
  },
  {
    kind: 'transaction',
    source: 'tz2Ayd83C7j9tSfpNDSRMVvic2Hj3ingjrY2',
    fee: '495',
    counter: '504880',
    gas_limit: '1551',
    storage_limit: '0',
    amount: '20000',
    destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
    metadata: {
      balance_updates: [],
      operation_result: {
        status: 'applied',
        balance_updates: [],
        consumed_milligas: '1450040',
      },
    },
  },
  {
    kind: 'origination',
    source: 'tz2Ayd83C7j9tSfpNDSRMVvic2Hj3ingjrY2',
    fee: '496',
    counter: '504881',
    gas_limit: '1570',
    storage_limit: '571',
    balance: '1000000',
    script: {
      code: [],
      storage: {
        int: '0',
      },
    },
    metadata: {
      balance_updates: [],
      operation_result: {
        status: 'applied',
        balance_updates: [],
        originated_contracts: ['KT1Em8ALyerHtZd1s5s6quJDZrTRxnmdKcKd'],
        consumed_milligas: '1469767',
        storage_size: '314',
        paid_storage_size_diff: '314',
      },
    },
  },
] as unknown as OperationContentsAndResult[];
