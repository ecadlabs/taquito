import BigNumber from 'bignumber.js';

export const rpcUrl = 'rpcTest';
export const blockResponse = {
  protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
  chain_id: 'NetXz969SFaFn8k',
  hash: 'BMUMMDZRvvTfLrpmtYMUtYgk498WssaSfNnpkWwEiL7GNTwUYus',
  header: {
    level: 536085,
    proto: 2,
    predecessor: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
    timestamp: '2021-10-04T18:11:32Z',
    validation_pass: 4,
    operations_hash: 'LLoZRH5DQMZiuE5eZ588fFC9JkL7qN8QjMdTUWQAHcAut2BmoUGZM',
    fitness: ['01', '0000000000082e14'],
    context: 'CoWCv7EjSWa6naU4fonnAcSSDDRjq9ddgdC13nuBdfR5x9xnR1sR',
    priority: 0,
    proof_of_work_nonce: 'bc2cc86f726c0000',
    liquidity_baking_escape_vote: false,
    signature:
      'sigPoYZryqKDksRqXpfby9eDfx6SbaLAq2vwLVnWJNrv73JrfAwAgiM1mCZrR7UaqEwvuR48QRJfj2FW6dCFAPynmJbgjysg',
  },
  metadata: {
    protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
    next_protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
    test_chain_status: { status: 'not_running' },
    max_operations_ttl: 120,
    max_operation_data_length: 32768,
    max_block_header_length: 239,
    max_operation_list_length: [
      { max_size: 4194304, max_op: 2048 },
      { max_size: 32768 },
      { max_size: 135168, max_op: 132 },
      { max_size: 524288 },
    ],
    baker: 'tz1RomaiWJV3NFDZWTMVR2aEeHknsn3iF5Gi',
    level_info: {
      level: 536085,
      level_position: 536084,
      cycle: 131,
      cycle_position: 3604,
      expected_commitment: false,
    },
    voting_period_info: {
      voting_period: { index: 26, kind: 'proposal', start_position: 532481 },
      position: 3603,
      remaining: 16876,
    },
    nonce_hash: null,
    consumed_gas: '108015000',
    deactivated: [],
    balance_updates: [
      {
        kind: 'contract',
        contract: 'tz1RomaiWJV3NFDZWTMVR2aEeHknsn3iF5Gi',
        change: '-640000000',
        origin: 'block',
      },
      {
        kind: 'freezer',
        category: 'deposits',
        delegate: 'tz1RomaiWJV3NFDZWTMVR2aEeHknsn3iF5Gi',
        cycle: 131,
        change: '640000000',
        origin: 'block',
      },
      {
        kind: 'freezer',
        category: 'rewards',
        delegate: 'tz1RomaiWJV3NFDZWTMVR2aEeHknsn3iF5Gi',
        cycle: 131,
        change: '16093750',
        origin: 'block',
      },
    ],
    liquidity_baking_escape_ema: 281925,
    implicit_operations_results: [
      {
        kind: 'transaction',
        storage: [
          { int: '81141010' },
          { int: '1004154556389' },
          { int: '87443' },
          { bytes: '01e927f00ef734dfc85919635e9afc9166c83ef9fc00' },
          { bytes: '0115eb0104481a6d7921160bc982c5e0a561cd8a3a00' },
        ],
        balance_updates: [
          {
            kind: 'contract',
            contract: 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5',
            change: '2500000',
            origin: 'subsidy',
          },
        ],
        consumed_gas: '2118',
        consumed_milligas: '2117300',
        storage_size: '4636',
      },
    ],
  },
  operations: [
    [
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'ooK6Fj6pPV8LMfuuo9CTTyDzd28CRiRzC1UFzwxrvuWCtfiuBHA',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigQigTJyznbECHxo3sokWyvsMX3GdUWhfND76bhpdQgrmj8MLcVpTQTudg8T7dswKAm4wVq9dXx3sdGiwnz1tWwatJJ2JGP',
            },
            slot: 7,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1NFs6yP2sXd5vAAbR43bbDRpV2nahDZope',
                  change: '-62500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1NFs6yP2sXd5vAAbR43bbDRpV2nahDZope',
                  cycle: 131,
                  change: '62500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1NFs6yP2sXd5vAAbR43bbDRpV2nahDZope',
                  cycle: 131,
                  change: '1953125',
                  origin: 'block',
                },
              ],
              delegate: 'tz1NFs6yP2sXd5vAAbR43bbDRpV2nahDZope',
              slots: [
                7, 26, 28, 31, 52, 55, 56, 57, 73, 81, 90, 100, 116, 137, 139, 141, 150, 155, 194,
                204, 209, 219, 226, 240, 255,
              ],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'opVPpVtkcwWYW3AaKCLYgLXDLVteewJxv1mqvRKJxiBVx4hR3Ld',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigucwWZSCHugH3w3g8Mm9k8C2vLQfCU2CixgRTLSQF2xDg5Xf6VqEDB2snUJQjZHFD4EFejrAuQhcGFJ2j729ABYAxgQdZV',
            },
            slot: 25,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1TGKSrZrBpND3PELJ43nVdyadoeiM1WMzb',
                  change: '-12500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1TGKSrZrBpND3PELJ43nVdyadoeiM1WMzb',
                  cycle: 131,
                  change: '12500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1TGKSrZrBpND3PELJ43nVdyadoeiM1WMzb',
                  cycle: 131,
                  change: '390625',
                  origin: 'block',
                },
              ],
              delegate: 'tz1TGKSrZrBpND3PELJ43nVdyadoeiM1WMzb',
              slots: [25, 49, 59, 143, 241],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'ooV7jeBXUjeAXb7sB6UbiPrFeadyUWAQjyVbiezYV4dQ2jh7nXZ',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigjgqeWJXQGxt7nuUJy9ZfJQrUyoMVgi34YKsCmvuKczKc198x6izoCgMGRVb7iTqDgqzEKcPFeLJpW6jxzFJ5AGXgCDPAK',
            },
            slot: 1,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
                  change: '-37500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
                  cycle: 131,
                  change: '37500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
                  cycle: 131,
                  change: '1171875',
                  origin: 'block',
                },
              ],
              delegate: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
              slots: [1, 12, 19, 20, 32, 46, 66, 93, 129, 146, 174, 176, 185, 187, 236],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'ooAcSPWvGdxWHs9axWkkUv8auevgo5S65y6BGuqKUyzxmQtAkkw',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigshnJHvMozfhProNP2iBV1baiUoUGoZC9yc7XyKk3TKBHZ6pJyLb8vWUcGpvqPPv732HzB5px7QsBm9KVm2n9TgERgCDmB',
            },
            slot: 62,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1Qr3aFcxjRGu84PfDEtqQSM2PQutSn635P',
                  change: '-5000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1Qr3aFcxjRGu84PfDEtqQSM2PQutSn635P',
                  cycle: 131,
                  change: '5000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1Qr3aFcxjRGu84PfDEtqQSM2PQutSn635P',
                  cycle: 131,
                  change: '156250',
                  origin: 'block',
                },
              ],
              delegate: 'tz1Qr3aFcxjRGu84PfDEtqQSM2PQutSn635P',
              slots: [62, 102],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'onrL2x7aon3qi1p3wsroWnRfx8KigzYNQg5S2EYyB3k7N72Nqcy',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigWwT3mRjCzfvxy65Nd76yHDH6MBwDw1RhhMf4miDp6MvtBjCvcgXhL7z4WM1vZrGEB74UiAbnJzNCSJ3KDwNFwBbU2kpU4',
            },
            slot: 3,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
                  change: '-62500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
                  cycle: 131,
                  change: '62500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
                  cycle: 131,
                  change: '1953125',
                  origin: 'block',
                },
              ],
              delegate: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
              slots: [
                3, 6, 13, 21, 37, 63, 68, 86, 94, 110, 123, 133, 134, 152, 169, 170, 208, 212, 213,
                215, 218, 221, 223, 232, 254,
              ],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'onseUqV43jrnEQDWV6S7pNEWAQ1W1jVwDrtjXLXUMMYqLJUaCKo',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigeeqviP7cPW2SdBNx53trnr9zCDTJKZd2ixZGTg5qz17CcEJaHZgQZjcEcFcy2EnEDusA4m9yeT9JK24fipu9XyiprZ6pH',
            },
            slot: 184,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1LKV2Hb8XezQXFqCmsKXYDc8BWQkvFnzcP',
                  change: '-2500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1LKV2Hb8XezQXFqCmsKXYDc8BWQkvFnzcP',
                  cycle: 131,
                  change: '2500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1LKV2Hb8XezQXFqCmsKXYDc8BWQkvFnzcP',
                  cycle: 131,
                  change: '78125',
                  origin: 'block',
                },
              ],
              delegate: 'tz1LKV2Hb8XezQXFqCmsKXYDc8BWQkvFnzcP',
              slots: [184],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'ooFD5AWihGns7RaZHKqyiJPFDAYuCpXJGT72p6CCig4EQsYm9tT',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigiDTLARKGSKx1KnhxMdhxV7h4NnChw3gzYy8fJv9C58vPD9mCuKsvCrRGUk79mCqaxudyUu5T3qxWkuJqugJysSeg45KBT',
            },
            slot: 5,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1RomaiWJV3NFDZWTMVR2aEeHknsn3iF5Gi',
                  change: '-80000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1RomaiWJV3NFDZWTMVR2aEeHknsn3iF5Gi',
                  cycle: 131,
                  change: '80000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1RomaiWJV3NFDZWTMVR2aEeHknsn3iF5Gi',
                  cycle: 131,
                  change: '2500000',
                  origin: 'block',
                },
              ],
              delegate: 'tz1RomaiWJV3NFDZWTMVR2aEeHknsn3iF5Gi',
              slots: [
                5, 18, 22, 24, 51, 77, 79, 95, 98, 115, 140, 145, 151, 157, 162, 163, 167, 171, 181,
                188, 189, 195, 196, 198, 202, 205, 207, 227, 231, 238, 242, 252,
              ],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'ooqKhCA49xFX9wwyU3LmgwJZu8qwfgRQNHHjaoA45QkmAR8rxmW',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigkD1y57jWwdGyzwgHXZoEFsNuJCcWsC4SRpMeMiAzFbgf5G3ATQoZF2pCtCdfxvXYu1nDixosqJvqttiX7hNNWWw7H5H3o',
            },
            slot: 16,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                  change: '-45000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                  cycle: 131,
                  change: '45000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                  cycle: 131,
                  change: '1406250',
                  origin: 'block',
                },
              ],
              delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
              slots: [
                16, 35, 42, 53, 76, 80, 85, 87, 91, 125, 126, 127, 179, 186, 214, 225, 239, 245,
              ],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'ooiBEZGpe15vBVEJBD7f42NhtXUVyMgZFJ6Kq6Rz9x59acRjfqC',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigo63PyYEcmFmGoWiLoY7aChpqq4AzE3u6EyeMbX5dfmSyFPqrbKJgTrH4Pg9ELZJfFWW9DmurYw77nqmH529wLYxVq43ec',
            },
            slot: 201,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1PUv7oRg5xpMf4nFewZrtRtnmCizW2ETtU',
                  change: '-2500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1PUv7oRg5xpMf4nFewZrtRtnmCizW2ETtU',
                  cycle: 131,
                  change: '2500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1PUv7oRg5xpMf4nFewZrtRtnmCizW2ETtU',
                  cycle: 131,
                  change: '78125',
                  origin: 'block',
                },
              ],
              delegate: 'tz1PUv7oRg5xpMf4nFewZrtRtnmCizW2ETtU',
              slots: [201],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'oogyZfDdZPWFxuyRAQs1J53CxmxUbnd6Q1WixifHKpnicphrEbb',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigpznVMjV53auoAPqxYxkYANxbrYaMmuq242ueQqo1NijaQvZRUEZP5sFwMLVpLGRUzHEkrYkX6NGFm1RfKKb4yBmBjrHr5',
            },
            slot: 15,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1T8UYSbVuRm6CdhjvwCfXsKXb4yL9ai9Q3',
                  change: '-75000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1T8UYSbVuRm6CdhjvwCfXsKXb4yL9ai9Q3',
                  cycle: 131,
                  change: '75000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1T8UYSbVuRm6CdhjvwCfXsKXb4yL9ai9Q3',
                  cycle: 131,
                  change: '2343750',
                  origin: 'block',
                },
              ],
              delegate: 'tz1T8UYSbVuRm6CdhjvwCfXsKXb4yL9ai9Q3',
              slots: [
                15, 23, 30, 34, 38, 45, 60, 61, 64, 67, 70, 75, 78, 89, 92, 104, 112, 114, 122, 124,
                138, 149, 160, 175, 191, 197, 199, 230, 233, 234,
              ],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'oozpKKz7XcaihZhSsEMiLcUPvGxjZe74yz1hrNzvYg9W1NNCjTx',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigqhueAmzzAArEiHLnwQUpLEVcz8wWcn2qxfMKmRrGRg2cn6k4q17eBaU9bHDepsf1jnGN3cDHrTfbas58BW7pbUoCJgHUh',
            },
            slot: 120,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1VpvtSaSxKvykrqajFJTZqCXgoVJ5cKaM1',
                  change: '-5000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1VpvtSaSxKvykrqajFJTZqCXgoVJ5cKaM1',
                  cycle: 131,
                  change: '5000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1VpvtSaSxKvykrqajFJTZqCXgoVJ5cKaM1',
                  cycle: 131,
                  change: '156250',
                  origin: 'block',
                },
              ],
              delegate: 'tz1VpvtSaSxKvykrqajFJTZqCXgoVJ5cKaM1',
              slots: [120, 131],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'onwE9jGH8LXetQmPTHekChAnecpcmV92md8WMSgTcjok6DUDtJ9',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigfTpvZPXMb2ur3PhQ2w6N93auNHft7swUHdf4QsizPMgbKHxNFV4TU8MmHXQ5ZivMkeCAbwBEdDApAw25uf9vzzPuAFoAK',
            },
            slot: 8,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1VWasoyFGAWZt5K2qZRzP3cWzv3z7MMhP8',
                  change: '-65000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1VWasoyFGAWZt5K2qZRzP3cWzv3z7MMhP8',
                  cycle: 131,
                  change: '65000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1VWasoyFGAWZt5K2qZRzP3cWzv3z7MMhP8',
                  cycle: 131,
                  change: '2031250',
                  origin: 'block',
                },
              ],
              delegate: 'tz1VWasoyFGAWZt5K2qZRzP3cWzv3z7MMhP8',
              slots: [
                8, 10, 11, 33, 41, 58, 99, 107, 108, 111, 118, 128, 147, 148, 154, 156, 158, 168,
                172, 183, 192, 228, 237, 244, 250, 253,
              ],
            },
          },
        ],
      },
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'oo7qUvuxaxUthTzfbTYk56TPBQ1V59iycoTmbTpPYGPENyuR7Fi',
        branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BM44sPfEofA59iibf5v5AC1wB1BH2kYi9YsKXHmQeDqZFkMSDD7',
              operations: { kind: 'endorsement', level: 536084 },
              signature:
                'sigeiWyjufSMaWBEHqotERDGUSFtTLimnFhTH4gm1Pi8qB7hrz41czWXquqHGcVAdt8a3Z96o6Ktg5SkMJ9cyr6qFq8ccmTM',
            },
            slot: 9,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1SwJwrKe8H1yi6KnYKCYkVHPApJRnZcHsa',
                  change: '-60000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1SwJwrKe8H1yi6KnYKCYkVHPApJRnZcHsa',
                  cycle: 131,
                  change: '60000000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1SwJwrKe8H1yi6KnYKCYkVHPApJRnZcHsa',
                  cycle: 131,
                  change: '1875000',
                  origin: 'block',
                },
              ],
              delegate: 'tz1SwJwrKe8H1yi6KnYKCYkVHPApJRnZcHsa',
              slots: [
                9, 14, 27, 43, 54, 83, 84, 96, 101, 105, 113, 136, 144, 153, 159, 164, 180, 182,
                203, 211, 224, 247, 249, 251,
              ],
            },
          },
        ],
      },
    ],
    [],
    [],
    [
      {
        protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
        chain_id: 'NetXz969SFaFn8k',
        hash: 'ooybqGUDKq3QUbZVe4qZ1oLx2GhTqZ6VdVTuA7SZDfE5B2jbHRd',
        branch: 'BLEzWSy1Aze5Enuv3KimDvqZbAXbzSHxQeRDztN6tvXknfTCAus',
        contents: [
          {
            kind: 'transaction',
            source: 'tz1cpnaaG6FkPAUcrsj45zhYYSPMvJnxyc59',
            fee: '0',
            counter: '703827',
            gas_limit: '3422',
            storage_limit: '67',
            amount: '0',
            destination: 'KT1RxHZJCrFVuPQJWqhVLBZeZxm7SawHdHGL',
            parameters: {
              entrypoint: 'update_operators',
              value: [
                {
                  prim: 'Left',
                  args: [
                    {
                      prim: 'Pair',
                      args: [
                        { string: 'tz1cpnaaG6FkPAUcrsj45zhYYSPMvJnxyc59' },
                        {
                          prim: 'Pair',
                          args: [{ string: 'KT1PrWB2PSwWNzbfpA9SJbUaHXxCzbLSJspm' }, { int: '1' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            metadata: {
              balance_updates: [],
              operation_result: {
                status: 'applied',
                storage: {
                  prim: 'Pair',
                  args: [
                    { prim: 'Pair', args: [{ int: '20440' }, { int: '20441' }] },
                    { prim: 'Pair', args: [{ int: '20442' }, { int: '20443' }] },
                  ],
                },
                big_map_diff: [
                  {
                    action: 'update',
                    big_map: '20442',
                    key_hash: 'exprtpmtn8bL4jrTW2AfMZJ9p2yx1k9xMkN5f7EWhxtUVPtvutxqNL',
                    key: {
                      prim: 'Pair',
                      args: [
                        { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                        {
                          prim: 'Pair',
                          args: [
                            { bytes: '01a783b18821ce1f502c8a1c2fd9761ad21c1391d600' },
                            { int: '1' },
                          ],
                        },
                      ],
                    },
                    value: { prim: 'Unit' },
                  },
                ],
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz1cpnaaG6FkPAUcrsj45zhYYSPMvJnxyc59',
                    change: '-16750',
                    origin: 'block',
                  },
                ],
                consumed_gas: '3322',
                consumed_milligas: '3321239',
                storage_size: '48520',
                paid_storage_size_diff: '67',
                lazy_storage_diff: [
                  { kind: 'big_map', id: '20443', diff: { action: 'update', updates: [] } },
                  {
                    kind: 'big_map',
                    id: '20442',
                    diff: {
                      action: 'update',
                      updates: [
                        {
                          key_hash: 'exprtpmtn8bL4jrTW2AfMZJ9p2yx1k9xMkN5f7EWhxtUVPtvutxqNL',
                          key: {
                            prim: 'Pair',
                            args: [
                              { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                              {
                                prim: 'Pair',
                                args: [
                                  { bytes: '01a783b18821ce1f502c8a1c2fd9761ad21c1391d600' },
                                  { int: '1' },
                                ],
                              },
                            ],
                          },
                          value: { prim: 'Unit' },
                        },
                      ],
                    },
                  },
                  { kind: 'big_map', id: '20441', diff: { action: 'update', updates: [] } },
                  { kind: 'big_map', id: '20440', diff: { action: 'update', updates: [] } },
                ],
              },
            },
          },
          {
            kind: 'transaction',
            source: 'tz1cpnaaG6FkPAUcrsj45zhYYSPMvJnxyc59',
            fee: '0',
            counter: '703828',
            gas_limit: '101201',
            storage_limit: '70',
            amount: '0',
            destination: 'KT1PrWB2PSwWNzbfpA9SJbUaHXxCzbLSJspm',
            parameters: {
              entrypoint: 'swap_exact_for_tokens',
              value: {
                prim: 'Pair',
                args: [
                  {
                    prim: 'Pair',
                    args: [
                      {
                        prim: 'Pair',
                        args: [
                          { string: 'tz1cpnaaG6FkPAUcrsj45zhYYSPMvJnxyc59' },
                          { int: '5000000000' },
                        ],
                      },
                      {
                        prim: 'Pair',
                        args: [{ int: '14146908' }, { string: '2022-01-28T11:57:44.601Z' }],
                      },
                    ],
                  },
                  {
                    prim: 'Pair',
                    args: [
                      {
                        prim: 'Pair',
                        args: [
                          { string: 'KT1RxHZJCrFVuPQJWqhVLBZeZxm7SawHdHGL' },
                          { prim: 'Some', args: [{ int: '1' }] },
                        ],
                      },
                      {
                        prim: 'Pair',
                        args: [
                          { string: 'KT1RxHZJCrFVuPQJWqhVLBZeZxm7SawHdHGL' },
                          { prim: 'Some', args: [{ int: '0' }] },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            metadata: {
              balance_updates: [],
              operation_result: {
                status: 'applied',
                storage: {
                  prim: 'Pair',
                  args: [
                    {
                      prim: 'Pair',
                      args: [
                        {
                          prim: 'Some',
                          args: [
                            {
                              prim: 'Pair',
                              args: [
                                {
                                  prim: 'Pair',
                                  args: [
                                    {
                                      prim: 'Pair',
                                      args: [
                                        { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                                        { prim: 'None' },
                                      ],
                                    },
                                    {
                                      prim: 'Pair',
                                      args: [
                                        { prim: 'None' },
                                        { prim: 'Right', args: [{ prim: 'Unit' }] },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  prim: 'Pair',
                                  args: [
                                    {
                                      prim: 'Pair',
                                      args: [
                                        {
                                          prim: 'Pair',
                                          args: [
                                            {
                                              bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600',
                                            },
                                            { prim: 'Some', args: [{ int: '1' }] },
                                          ],
                                        },
                                        {
                                          prim: 'Pair',
                                          args: [
                                            {
                                              bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600',
                                            },
                                            { prim: 'Some', args: [{ int: '0' }] },
                                          ],
                                        },
                                      ],
                                    },
                                    { prim: 'None' },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        { bytes: '012582f9db72407f07e78f065db7965ff42c46248700' },
                      ],
                    },
                    { prim: 'Pair', args: [{ int: '20669' }, { int: '20670' }] },
                  ],
                },
                big_map_diff: [],
                consumed_gas: '12665',
                consumed_milligas: '12664013',
                storage_size: '32990',
                lazy_storage_diff: [
                  { kind: 'big_map', id: '20670', diff: { action: 'update', updates: [] } },
                  { kind: 'big_map', id: '20669', diff: { action: 'update', updates: [] } },
                ],
              },
              internal_operation_results: [
                {
                  kind: 'transaction',
                  source: 'KT1PrWB2PSwWNzbfpA9SJbUaHXxCzbLSJspm',
                  nonce: 0,
                  amount: '0',
                  destination: 'KT1K2U9q55iPwGJEFyEqfbL3AKhHX4f6UThT',
                  parameters: {
                    entrypoint: 'get_reserves',
                    value: {
                      bytes:
                        '01a783b18821ce1f502c8a1c2fd9761ad21c1391d60072657365727665735f63616c6c6261636b',
                    },
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        [
                          {
                            prim: 'Pair',
                            args: [
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    prim: 'Pair',
                                    args: [
                                      { prim: 'Pair', args: [{ int: '20832' }, { int: '20833' }] },
                                      { prim: 'Pair', args: [{ int: '20834' }, { int: '20835' }] },
                                    ],
                                  },
                                  { int: '20836' },
                                ],
                              },
                              { prim: 'Pair', args: [{ prim: 'None' }, { int: '20837' }] },
                            ],
                          },
                          { prim: 'Pair', args: [{ int: '2369921' }, { int: '976068754' }] },
                          { int: '1633368712' },
                          { int: '3520039054386878' },
                        ],
                        {
                          prim: 'Pair',
                          args: [
                            [
                              {
                                prim: 'Pair',
                                args: [
                                  { int: '9999515636866' },
                                  { int: '35198685566720594775323444348' },
                                ],
                              },
                              {
                                prim: 'Pair',
                                args: [
                                  { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                                  { prim: 'Some', args: [{ int: '1' }] },
                                ],
                              },
                              { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                              { prim: 'Some', args: [{ int: '0' }] },
                            ],
                            { bytes: '012582f9db72407f07e78f065db7965ff42c46248700' },
                          ],
                        },
                      ],
                    },
                    big_map_diff: [],
                    consumed_gas: '9288',
                    consumed_milligas: '9287559',
                    storage_size: '19227',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20837', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20836', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20835', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20834', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20833', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20832', diff: { action: 'update', updates: [] } },
                    ],
                  },
                },
                {
                  kind: 'transaction',
                  source: 'KT1K2U9q55iPwGJEFyEqfbL3AKhHX4f6UThT',
                  nonce: 2,
                  amount: '0',
                  destination: 'KT1PrWB2PSwWNzbfpA9SJbUaHXxCzbLSJspm',
                  parameters: {
                    entrypoint: 'reserves_callback',
                    value: {
                      prim: 'Pair',
                      args: [
                        {
                          prim: 'Pair',
                          args: [{ int: '3520039054386878' }, { int: '9999515636866' }],
                        },
                        { int: '188166353164099' },
                      ],
                    },
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        {
                          prim: 'Pair',
                          args: [
                            {
                              prim: 'Some',
                              args: [
                                {
                                  prim: 'Pair',
                                  args: [
                                    {
                                      prim: 'Pair',
                                      args: [
                                        {
                                          prim: 'Pair',
                                          args: [
                                            {
                                              bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f',
                                            },
                                            { prim: 'Some', args: [{ int: '3520039054386878' }] },
                                          ],
                                        },
                                        {
                                          prim: 'Pair',
                                          args: [
                                            { prim: 'Some', args: [{ int: '9999515636866' }] },
                                            { prim: 'Left', args: [{ prim: 'Unit' }] },
                                          ],
                                        },
                                      ],
                                    },
                                    {
                                      prim: 'Pair',
                                      args: [
                                        {
                                          prim: 'Pair',
                                          args: [
                                            {
                                              prim: 'Pair',
                                              args: [
                                                {
                                                  bytes:
                                                    '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600',
                                                },
                                                { prim: 'Some', args: [{ int: '1' }] },
                                              ],
                                            },
                                            {
                                              prim: 'Pair',
                                              args: [
                                                {
                                                  bytes:
                                                    '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600',
                                                },
                                                { prim: 'Some', args: [{ int: '0' }] },
                                              ],
                                            },
                                          ],
                                        },
                                        { prim: 'Some', args: [{ int: '188166353164099' }] },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                            { bytes: '012582f9db72407f07e78f065db7965ff42c46248700' },
                          ],
                        },
                        { prim: 'Pair', args: [{ int: '20669' }, { int: '20670' }] },
                      ],
                    },
                    big_map_diff: [],
                    consumed_gas: '9479',
                    consumed_milligas: '9478157',
                    storage_size: '33015',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20670', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20669', diff: { action: 'update', updates: [] } },
                    ],
                  },
                },
                {
                  kind: 'transaction',
                  source: 'KT1PrWB2PSwWNzbfpA9SJbUaHXxCzbLSJspm',
                  nonce: 1,
                  amount: '0',
                  destination: 'KT1PrWB2PSwWNzbfpA9SJbUaHXxCzbLSJspm',
                  parameters: {
                    entrypoint: 'main_entry',
                    value: {
                      prim: 'Left',
                      args: [
                        {
                          prim: 'Left',
                          args: [
                            {
                              prim: 'Left',
                              args: [
                                {
                                  prim: 'Right',
                                  args: [
                                    [
                                      {
                                        prim: 'Pair',
                                        args: [
                                          {
                                            prim: 'Pair',
                                            args: [
                                              {
                                                bytes:
                                                  '0000bc82eedf570c81349226f937bed3d3485a2b080f',
                                              },
                                              { int: '5000000000' },
                                            ],
                                          },
                                          {
                                            prim: 'Pair',
                                            args: [{ int: '14146908' }, { int: '1643371064' }],
                                          },
                                        ],
                                      },
                                      {
                                        prim: 'Pair',
                                        args: [
                                          { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                                          { prim: 'Some', args: [{ int: '1' }] },
                                        ],
                                      },
                                      { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                                      { prim: 'Some', args: [{ int: '0' }] },
                                    ],
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        {
                          prim: 'Pair',
                          args: [
                            { prim: 'None' },
                            { bytes: '012582f9db72407f07e78f065db7965ff42c46248700' },
                          ],
                        },
                        { prim: 'Pair', args: [{ int: '20669' }, { int: '20670' }] },
                      ],
                    },
                    big_map_diff: [],
                    consumed_gas: '11667',
                    consumed_milligas: '11666798',
                    storage_size: '32875',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20670', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20669', diff: { action: 'update', updates: [] } },
                    ],
                  },
                },
                {
                  kind: 'transaction',
                  source: 'KT1PrWB2PSwWNzbfpA9SJbUaHXxCzbLSJspm',
                  nonce: 3,
                  amount: '0',
                  destination: 'KT1RxHZJCrFVuPQJWqhVLBZeZxm7SawHdHGL',
                  parameters: {
                    entrypoint: 'transfer',
                    value: [
                      {
                        prim: 'Pair',
                        args: [
                          { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                          [
                            {
                              prim: 'Pair',
                              args: [
                                { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                                { prim: 'Pair', args: [{ int: '1' }, { int: '5000000000' }] },
                              ],
                            },
                          ],
                        ],
                      },
                    ],
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        { prim: 'Pair', args: [{ int: '20440' }, { int: '20441' }] },
                        { prim: 'Pair', args: [{ int: '20442' }, { int: '20443' }] },
                      ],
                    },
                    big_map_diff: [
                      {
                        action: 'update',
                        big_map: '20440',
                        key_hash: 'exprtqGiP8vxvoGE35foNVciCmRtuofNsZVinQfSE2SKdQdAvSTcBS',
                        key: {
                          prim: 'Pair',
                          args: [
                            { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                            { int: '1' },
                          ],
                        },
                        value: { int: '5000000000' },
                      },
                      {
                        action: 'update',
                        big_map: '20440',
                        key_hash: 'exprv6HH2WDmykE9AQ5kmXbsZAbEHzr2Wy6Bkt5CCS9U9CEgiNdRJr',
                        key: {
                          prim: 'Pair',
                          args: [
                            { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                            { int: '1' },
                          ],
                        },
                        value: { int: '3520044054386878' },
                      },
                    ],
                    consumed_gas: '5018',
                    consumed_milligas: '5017728',
                    storage_size: '48520',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20443', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20442', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20441', diff: { action: 'update', updates: [] } },
                      {
                        kind: 'big_map',
                        id: '20440',
                        diff: {
                          action: 'update',
                          updates: [
                            {
                              key_hash: 'exprv6HH2WDmykE9AQ5kmXbsZAbEHzr2Wy6Bkt5CCS9U9CEgiNdRJr',
                              key: {
                                prim: 'Pair',
                                args: [
                                  { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                                  { int: '1' },
                                ],
                              },
                              value: { int: '3520044054386878' },
                            },
                            {
                              key_hash: 'exprtqGiP8vxvoGE35foNVciCmRtuofNsZVinQfSE2SKdQdAvSTcBS',
                              key: {
                                prim: 'Pair',
                                args: [
                                  { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                                  { int: '1' },
                                ],
                              },
                              value: { int: '5000000000' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'transaction',
                  source: 'KT1PrWB2PSwWNzbfpA9SJbUaHXxCzbLSJspm',
                  nonce: 4,
                  amount: '0',
                  destination: 'KT1K2U9q55iPwGJEFyEqfbL3AKhHX4f6UThT',
                  parameters: {
                    entrypoint: 'start_swap',
                    value: {
                      prim: 'Pair',
                      args: [
                        {
                          prim: 'Pair',
                          args: [
                            { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                            { int: '0' },
                          ],
                        },
                        { prim: 'Pair', args: [{ int: '14161068' }, { prim: 'None' }] },
                      ],
                    },
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        [
                          {
                            prim: 'Pair',
                            args: [
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    prim: 'Pair',
                                    args: [
                                      { prim: 'Pair', args: [{ int: '20832' }, { int: '20833' }] },
                                      { prim: 'Pair', args: [{ int: '20834' }, { int: '20835' }] },
                                    ],
                                  },
                                  { int: '20836' },
                                ],
                              },
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    prim: 'Some',
                                    args: [
                                      {
                                        prim: 'Pair',
                                        args: [
                                          {
                                            prim: 'Pair',
                                            args: [
                                              {
                                                prim: 'Pair',
                                                args: [
                                                  {
                                                    bytes:
                                                      '0000bc82eedf570c81349226f937bed3d3485a2b080f',
                                                  },
                                                  { int: '0' },
                                                ],
                                              },
                                              {
                                                prim: 'Pair',
                                                args: [{ int: '14161068' }, { prim: 'None' }],
                                              },
                                            ],
                                          },
                                          {
                                            prim: 'Pair',
                                            args: [
                                              { prim: 'None' },
                                              { prim: 'Right', args: [{ prim: 'Unit' }] },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  { int: '20837' },
                                ],
                              },
                            ],
                          },
                          { prim: 'Pair', args: [{ int: '2369921' }, { int: '976068754' }] },
                          { int: '1633368712' },
                          { int: '3520039054386878' },
                        ],
                        {
                          prim: 'Pair',
                          args: [
                            [
                              {
                                prim: 'Pair',
                                args: [
                                  { int: '9999515636866' },
                                  { int: '35198685566720594775323444348' },
                                ],
                              },
                              {
                                prim: 'Pair',
                                args: [
                                  { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                                  { prim: 'Some', args: [{ int: '1' }] },
                                ],
                              },
                              { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                              { prim: 'Some', args: [{ int: '0' }] },
                            ],
                            { bytes: '012582f9db72407f07e78f065db7965ff42c46248700' },
                          ],
                        },
                      ],
                    },
                    big_map_diff: [],
                    consumed_gas: '12571',
                    consumed_milligas: '12570775',
                    storage_size: '19279',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20837', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20836', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20835', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20834', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20833', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20832', diff: { action: 'update', updates: [] } },
                    ],
                  },
                },
                {
                  kind: 'transaction',
                  source: 'KT1K2U9q55iPwGJEFyEqfbL3AKhHX4f6UThT',
                  nonce: 5,
                  amount: '0',
                  destination: 'KT1RxHZJCrFVuPQJWqhVLBZeZxm7SawHdHGL',
                  parameters: {
                    entrypoint: 'transfer',
                    value: [
                      {
                        prim: 'Pair',
                        args: [
                          { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                          [
                            {
                              prim: 'Pair',
                              args: [
                                { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                                { prim: 'Pair', args: [{ int: '1' }, { int: '0' }] },
                              ],
                            },
                          ],
                        ],
                      },
                    ],
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        { prim: 'Pair', args: [{ int: '20440' }, { int: '20441' }] },
                        { prim: 'Pair', args: [{ int: '20442' }, { int: '20443' }] },
                      ],
                    },
                    big_map_diff: [
                      {
                        action: 'update',
                        big_map: '20440',
                        key_hash: 'exprtqGiP8vxvoGE35foNVciCmRtuofNsZVinQfSE2SKdQdAvSTcBS',
                        key: {
                          prim: 'Pair',
                          args: [
                            { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                            { int: '1' },
                          ],
                        },
                        value: { int: '5000000000' },
                      },
                      {
                        action: 'update',
                        big_map: '20440',
                        key_hash: 'exprv6HH2WDmykE9AQ5kmXbsZAbEHzr2Wy6Bkt5CCS9U9CEgiNdRJr',
                        key: {
                          prim: 'Pair',
                          args: [
                            { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                            { int: '1' },
                          ],
                        },
                        value: { int: '3520044054386878' },
                      },
                    ],
                    consumed_gas: '4759',
                    consumed_milligas: '4758619',
                    storage_size: '48520',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20443', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20442', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20441', diff: { action: 'update', updates: [] } },
                      {
                        kind: 'big_map',
                        id: '20440',
                        diff: {
                          action: 'update',
                          updates: [
                            {
                              key_hash: 'exprv6HH2WDmykE9AQ5kmXbsZAbEHzr2Wy6Bkt5CCS9U9CEgiNdRJr',
                              key: {
                                prim: 'Pair',
                                args: [
                                  { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                                  { int: '1' },
                                ],
                              },
                              value: { int: '3520044054386878' },
                            },
                            {
                              key_hash: 'exprtqGiP8vxvoGE35foNVciCmRtuofNsZVinQfSE2SKdQdAvSTcBS',
                              key: {
                                prim: 'Pair',
                                args: [
                                  { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                                  { int: '1' },
                                ],
                              },
                              value: { int: '5000000000' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'transaction',
                  source: 'KT1K2U9q55iPwGJEFyEqfbL3AKhHX4f6UThT',
                  nonce: 6,
                  amount: '0',
                  destination: 'KT1RxHZJCrFVuPQJWqhVLBZeZxm7SawHdHGL',
                  parameters: {
                    entrypoint: 'transfer',
                    value: [
                      {
                        prim: 'Pair',
                        args: [
                          { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                          [
                            {
                              prim: 'Pair',
                              args: [
                                { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                                { prim: 'Pair', args: [{ int: '0' }, { int: '14161068' }] },
                              ],
                            },
                          ],
                        ],
                      },
                    ],
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        { prim: 'Pair', args: [{ int: '20440' }, { int: '20441' }] },
                        { prim: 'Pair', args: [{ int: '20442' }, { int: '20443' }] },
                      ],
                    },
                    big_map_diff: [
                      {
                        action: 'update',
                        big_map: '20440',
                        key_hash: 'exprtsTQSSJpAVrr1qEA9LRMaNz7zpBH4bpmGGBM8N6JztetYSREov',
                        key: {
                          prim: 'Pair',
                          args: [
                            { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                            { int: '0' },
                          ],
                        },
                        value: { int: '9999501475798' },
                      },
                      {
                        action: 'update',
                        big_map: '20440',
                        key_hash: 'expruhP7hUgjQpeNgzkjxgBt8Bz3bncenkYmC383MS2UYEsTMYXYaU',
                        key: {
                          prim: 'Pair',
                          args: [
                            { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                            { int: '0' },
                          ],
                        },
                        value: { int: '14161068' },
                      },
                    ],
                    balance_updates: [
                      {
                        kind: 'contract',
                        contract: 'tz1cpnaaG6FkPAUcrsj45zhYYSPMvJnxyc59',
                        change: '-17500',
                        origin: 'block',
                      },
                    ],
                    consumed_gas: '4522',
                    consumed_milligas: '4521387',
                    storage_size: '48590',
                    paid_storage_size_diff: '70',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20443', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20442', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20441', diff: { action: 'update', updates: [] } },
                      {
                        kind: 'big_map',
                        id: '20440',
                        diff: {
                          action: 'update',
                          updates: [
                            {
                              key_hash: 'expruhP7hUgjQpeNgzkjxgBt8Bz3bncenkYmC383MS2UYEsTMYXYaU',
                              key: {
                                prim: 'Pair',
                                args: [
                                  { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                                  { int: '0' },
                                ],
                              },
                              value: { int: '14161068' },
                            },
                            {
                              key_hash: 'exprtsTQSSJpAVrr1qEA9LRMaNz7zpBH4bpmGGBM8N6JztetYSREov',
                              key: {
                                prim: 'Pair',
                                args: [
                                  { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                                  { int: '0' },
                                ],
                              },
                              value: { int: '9999501475798' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'transaction',
                  source: 'KT1K2U9q55iPwGJEFyEqfbL3AKhHX4f6UThT',
                  nonce: 7,
                  amount: '0',
                  destination: 'KT1RxHZJCrFVuPQJWqhVLBZeZxm7SawHdHGL',
                  parameters: {
                    entrypoint: 'balance_of',
                    value: {
                      prim: 'Pair',
                      args: [
                        [
                          {
                            prim: 'Pair',
                            args: [
                              { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                              { int: '1' },
                            ],
                          },
                        ],
                        {
                          bytes:
                            '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc40062616c616e63655f63616c6c6261636b',
                        },
                      ],
                    },
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        { prim: 'Pair', args: [{ int: '20440' }, { int: '20441' }] },
                        { prim: 'Pair', args: [{ int: '20442' }, { int: '20443' }] },
                      ],
                    },
                    big_map_diff: [],
                    consumed_gas: '5064',
                    consumed_milligas: '5063541',
                    storage_size: '48590',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20443', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20442', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20441', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20440', diff: { action: 'update', updates: [] } },
                    ],
                  },
                },
                {
                  kind: 'transaction',
                  source: 'KT1RxHZJCrFVuPQJWqhVLBZeZxm7SawHdHGL',
                  nonce: 10,
                  amount: '0',
                  destination: 'KT1K2U9q55iPwGJEFyEqfbL3AKhHX4f6UThT',
                  parameters: {
                    entrypoint: 'balance_callback',
                    value: [
                      {
                        prim: 'Pair',
                        args: [
                          {
                            prim: 'Pair',
                            args: [
                              { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                              { int: '1' },
                            ],
                          },
                          { int: '3520044054386878' },
                        ],
                      },
                    ],
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        [
                          {
                            prim: 'Pair',
                            args: [
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    prim: 'Pair',
                                    args: [
                                      { prim: 'Pair', args: [{ int: '20832' }, { int: '20833' }] },
                                      { prim: 'Pair', args: [{ int: '20834' }, { int: '20835' }] },
                                    ],
                                  },
                                  { int: '20836' },
                                ],
                              },
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    prim: 'Some',
                                    args: [
                                      {
                                        prim: 'Pair',
                                        args: [
                                          {
                                            prim: 'Pair',
                                            args: [
                                              {
                                                prim: 'Pair',
                                                args: [
                                                  {
                                                    bytes:
                                                      '0000bc82eedf570c81349226f937bed3d3485a2b080f',
                                                  },
                                                  { int: '0' },
                                                ],
                                              },
                                              {
                                                prim: 'Pair',
                                                args: [
                                                  { int: '14161068' },
                                                  {
                                                    prim: 'Some',
                                                    args: [{ int: '3520044054386878' }],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          {
                                            prim: 'Pair',
                                            args: [
                                              { prim: 'None' },
                                              {
                                                prim: 'Left',
                                                args: [{ prim: 'Left', args: [{ prim: 'Unit' }] }],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  { int: '20837' },
                                ],
                              },
                            ],
                          },
                          { prim: 'Pair', args: [{ int: '2369921' }, { int: '976068754' }] },
                          { int: '1633368712' },
                          { int: '3520039054386878' },
                        ],
                        {
                          prim: 'Pair',
                          args: [
                            [
                              {
                                prim: 'Pair',
                                args: [
                                  { int: '9999515636866' },
                                  { int: '35198685566720594775323444348' },
                                ],
                              },
                              {
                                prim: 'Pair',
                                args: [
                                  { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                                  { prim: 'Some', args: [{ int: '1' }] },
                                ],
                              },
                              { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                              { prim: 'Some', args: [{ int: '0' }] },
                            ],
                            { bytes: '012582f9db72407f07e78f065db7965ff42c46248700' },
                          ],
                        },
                      ],
                    },
                    big_map_diff: [],
                    consumed_gas: '7023',
                    consumed_milligas: '7022609',
                    storage_size: '19290',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20837', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20836', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20835', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20834', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20833', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20832', diff: { action: 'update', updates: [] } },
                    ],
                  },
                },
                {
                  kind: 'transaction',
                  source: 'KT1K2U9q55iPwGJEFyEqfbL3AKhHX4f6UThT',
                  nonce: 8,
                  amount: '0',
                  destination: 'KT1RxHZJCrFVuPQJWqhVLBZeZxm7SawHdHGL',
                  parameters: {
                    entrypoint: 'balance_of',
                    value: {
                      prim: 'Pair',
                      args: [
                        [
                          {
                            prim: 'Pair',
                            args: [
                              { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                              { int: '0' },
                            ],
                          },
                        ],
                        {
                          bytes:
                            '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc40062616c616e63655f63616c6c6261636b',
                        },
                      ],
                    },
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        { prim: 'Pair', args: [{ int: '20440' }, { int: '20441' }] },
                        { prim: 'Pair', args: [{ int: '20442' }, { int: '20443' }] },
                      ],
                    },
                    big_map_diff: [],
                    consumed_gas: '5064',
                    consumed_milligas: '5063529',
                    storage_size: '48590',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20443', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20442', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20441', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20440', diff: { action: 'update', updates: [] } },
                    ],
                  },
                },
                {
                  kind: 'transaction',
                  source: 'KT1RxHZJCrFVuPQJWqhVLBZeZxm7SawHdHGL',
                  nonce: 11,
                  amount: '0',
                  destination: 'KT1K2U9q55iPwGJEFyEqfbL3AKhHX4f6UThT',
                  parameters: {
                    entrypoint: 'balance_callback',
                    value: [
                      {
                        prim: 'Pair',
                        args: [
                          {
                            prim: 'Pair',
                            args: [
                              { bytes: '01728d89975f2119d0bcc6dee11eb7d627b0fe5dc400' },
                              { int: '0' },
                            ],
                          },
                          { int: '9999501475798' },
                        ],
                      },
                    ],
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        [
                          {
                            prim: 'Pair',
                            args: [
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    prim: 'Pair',
                                    args: [
                                      { prim: 'Pair', args: [{ int: '20832' }, { int: '20833' }] },
                                      { prim: 'Pair', args: [{ int: '20834' }, { int: '20835' }] },
                                    ],
                                  },
                                  { int: '20836' },
                                ],
                              },
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    prim: 'Some',
                                    args: [
                                      {
                                        prim: 'Pair',
                                        args: [
                                          {
                                            prim: 'Pair',
                                            args: [
                                              {
                                                prim: 'Pair',
                                                args: [
                                                  {
                                                    bytes:
                                                      '0000bc82eedf570c81349226f937bed3d3485a2b080f',
                                                  },
                                                  { int: '0' },
                                                ],
                                              },
                                              {
                                                prim: 'Pair',
                                                args: [
                                                  { int: '14161068' },
                                                  {
                                                    prim: 'Some',
                                                    args: [{ int: '3520044054386878' }],
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                          {
                                            prim: 'Pair',
                                            args: [
                                              { prim: 'Some', args: [{ int: '9999501475798' }] },
                                              {
                                                prim: 'Left',
                                                args: [{ prim: 'Right', args: [{ prim: 'Unit' }] }],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                  { int: '20837' },
                                ],
                              },
                            ],
                          },
                          { prim: 'Pair', args: [{ int: '2369921' }, { int: '976068754' }] },
                          { int: '1633368712' },
                          { int: '3520039054386878' },
                        ],
                        {
                          prim: 'Pair',
                          args: [
                            [
                              {
                                prim: 'Pair',
                                args: [
                                  { int: '9999515636866' },
                                  { int: '35198685566720594775323444348' },
                                ],
                              },
                              {
                                prim: 'Pair',
                                args: [
                                  { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                                  { prim: 'Some', args: [{ int: '1' }] },
                                ],
                              },
                              { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                              { prim: 'Some', args: [{ int: '0' }] },
                            ],
                            { bytes: '012582f9db72407f07e78f065db7965ff42c46248700' },
                          ],
                        },
                      ],
                    },
                    big_map_diff: [],
                    consumed_gas: '7025',
                    consumed_milligas: '7024325',
                    storage_size: '19298',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20837', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20836', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20835', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20834', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20833', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20832', diff: { action: 'update', updates: [] } },
                    ],
                  },
                },
                {
                  kind: 'transaction',
                  source: 'KT1K2U9q55iPwGJEFyEqfbL3AKhHX4f6UThT',
                  nonce: 9,
                  amount: '0',
                  destination: 'KT1K2U9q55iPwGJEFyEqfbL3AKhHX4f6UThT',
                  parameters: {
                    entrypoint: 'finalize_action',
                    value: { prim: 'Right', args: [{ prim: 'Unit' }] },
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Pair',
                      args: [
                        [
                          {
                            prim: 'Pair',
                            args: [
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    prim: 'Pair',
                                    args: [
                                      { prim: 'Pair', args: [{ int: '20832' }, { int: '20833' }] },
                                      { prim: 'Pair', args: [{ int: '20834' }, { int: '20835' }] },
                                    ],
                                  },
                                  { int: '20836' },
                                ],
                              },
                              { prim: 'Pair', args: [{ prim: 'None' }, { int: '20837' }] },
                            ],
                          },
                          { prim: 'Pair', args: [{ int: '2369927' }, { int: '976906563' }] },
                          { int: '1633371092' },
                          { int: '3520044054386878' },
                        ],
                        {
                          prim: 'Pair',
                          args: [
                            [
                              {
                                prim: 'Pair',
                                args: [
                                  { int: '9999501475798' },
                                  { int: '35198685566720594775323444348' },
                                ],
                              },
                              {
                                prim: 'Pair',
                                args: [
                                  { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                                  { prim: 'Some', args: [{ int: '1' }] },
                                ],
                              },
                              { bytes: '01be8be8d6aa8aa77b26fcdfb58b2d3abc097ba74600' },
                              { prim: 'Some', args: [{ int: '0' }] },
                            ],
                            { bytes: '012582f9db72407f07e78f065db7965ff42c46248700' },
                          ],
                        },
                      ],
                    },
                    big_map_diff: [],
                    consumed_gas: '6962',
                    consumed_milligas: '6961817',
                    storage_size: '19227',
                    lazy_storage_diff: [
                      { kind: 'big_map', id: '20837', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20836', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20835', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20834', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20833', diff: { action: 'update', updates: [] } },
                      { kind: 'big_map', id: '20832', diff: { action: 'update', updates: [] } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'transaction',
            source: 'tz1cpnaaG6FkPAUcrsj45zhYYSPMvJnxyc59',
            fee: '12049',
            counter: '703829',
            gas_limit: '3392',
            storage_limit: '0',
            amount: '0',
            destination: 'KT1RxHZJCrFVuPQJWqhVLBZeZxm7SawHdHGL',
            parameters: {
              entrypoint: 'update_operators',
              value: [
                {
                  prim: 'Right',
                  args: [
                    {
                      prim: 'Pair',
                      args: [
                        { string: 'tz1cpnaaG6FkPAUcrsj45zhYYSPMvJnxyc59' },
                        {
                          prim: 'Pair',
                          args: [{ string: 'KT1PrWB2PSwWNzbfpA9SJbUaHXxCzbLSJspm' }, { int: '1' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1cpnaaG6FkPAUcrsj45zhYYSPMvJnxyc59',
                  change: '-12049',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'fees',
                  delegate: 'tz1RomaiWJV3NFDZWTMVR2aEeHknsn3iF5Gi',
                  cycle: 131,
                  change: '12049',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                storage: {
                  prim: 'Pair',
                  args: [
                    { prim: 'Pair', args: [{ int: '20440' }, { int: '20441' }] },
                    { prim: 'Pair', args: [{ int: '20442' }, { int: '20443' }] },
                  ],
                },
                big_map_diff: [
                  {
                    action: 'update',
                    big_map: '20442',
                    key_hash: 'exprtpmtn8bL4jrTW2AfMZJ9p2yx1k9xMkN5f7EWhxtUVPtvutxqNL',
                    key: {
                      prim: 'Pair',
                      args: [
                        { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                        {
                          prim: 'Pair',
                          args: [
                            { bytes: '01a783b18821ce1f502c8a1c2fd9761ad21c1391d600' },
                            { int: '1' },
                          ],
                        },
                      ],
                    },
                  },
                ],
                consumed_gas: '3292',
                consumed_milligas: '3291138',
                storage_size: '48523',
                lazy_storage_diff: [
                  { kind: 'big_map', id: '20443', diff: { action: 'update', updates: [] } },
                  {
                    kind: 'big_map',
                    id: '20442',
                    diff: {
                      action: 'update',
                      updates: [
                        {
                          key_hash: 'exprtpmtn8bL4jrTW2AfMZJ9p2yx1k9xMkN5f7EWhxtUVPtvutxqNL',
                          key: {
                            prim: 'Pair',
                            args: [
                              { bytes: '0000bc82eedf570c81349226f937bed3d3485a2b080f' },
                              {
                                prim: 'Pair',
                                args: [
                                  { bytes: '01a783b18821ce1f502c8a1c2fd9761ad21c1391d600' },
                                  { int: '1' },
                                ],
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  { kind: 'big_map', id: '20441', diff: { action: 'update', updates: [] } },
                  { kind: 'big_map', id: '20440', diff: { action: 'update', updates: [] } },
                ],
              },
            },
          },
        ],
        signature:
          'siggVH9Kh81y4UraZqdPvH2zdP3RgjUSt2XvM2VDD9N5mGptMrF31GRhaKAxtk6xErHsxLqohMvudwvLkjsMg7TkfGrbwMdC',
      },
    ],
  ],
};
export const blockHash = 'BlockHash';
export const liveBlocks = [
  'BKiHeQzuKM5quBsgVL25UDFXKcZyaTt26AQUtUkbA4Vh3dAQY21',
  'BKiboc2xTLtbCXt6AWX2BpR4km41onVrLmhFSTjYUA2iWKBwSTH',
];
export const balance = new BigNumber(4138876344398);
export const storage = { prim: 'Pair', args: [{ int: '0' }, { int: '1' }] };
export const script = {
  code: [
    { prim: 'parameter', args: [] },
    { prim: 'storage', args: [] },
    { prim: 'code', args: [] },
  ],
  storage: { prim: 'Pair', args: [] },
};
export const contract = {
  balance: new BigNumber(765),
  script: {
    code: [],
    storage: { prim: 'Pair', args: [] },
  },
};

export const managerKey = 'edpkvP1NXoo8vhYbPSvXdy466EHoYWBpf6zmjghB2p3DwJPjbB5nsf';
export const delegate = 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD';
export const bigmapValue = { prim: 'Pair', args: [[], { int: '100' }] };
export const delegates = {
  deactivated: false,
  balance: new BigNumber('5821087107868'),
  frozen_balance: new BigNumber('1682643263470'),
  staking_balance: new BigNumber('5792534034676'),
  delegated_contracts: ['tz2ApgXezUaJKaY49nxEYbMjsjnkAz2mTiFC'],
  delegated_balance: new BigNumber('12714439280'),
  grace_period: 131,
  voting_power: 747,
};
export const votingInfo = {
  voting_power: '1005169895965',
  remaining_proposals: 20,
};
export const constants = {
  proof_of_work_nonce_size: 8,
  nonce_length: 32,
  max_anon_ops_per_block: 132,
  max_operation_data_length: 32768,
  max_proposals_per_delegate: 20,
  preserved_cycles: 3,
  blocks_per_cycle: 4096,
  blocks_per_commitment: 32,
  blocks_per_roll_snapshot: 256,
  blocks_per_voting_period: 20480,
  time_between_blocks: [new BigNumber(30), new BigNumber(20)],
  endorsers_per_block: 256,
  hard_gas_limit_per_operation: new BigNumber(1040000),
  hard_gas_limit_per_block: new BigNumber(5200000),
  proof_of_work_threshold: new BigNumber(70368744177663),
  minimal_stake: new BigNumber(8000000000),
  michelson_maximum_type_size: 1000,
  seed_nonce_revelation_tip: new BigNumber(125000),
  origination_size: 257,
  block_security_deposit: new BigNumber(640000000),
  endorsement_security_deposit: new BigNumber(2500000),
  baking_reward_per_endorsement: [new BigNumber(78125), new BigNumber(11719)],
  endorsement_reward: [new BigNumber(78125), new BigNumber(52083)],
  cost_per_byte: new BigNumber(250),
  hard_storage_limit_per_operation: new BigNumber(60000),
  quorum_min: 2000,
  quorum_max: 7000,
  min_proposal_quorum: 500,
  initial_endorsers: 192,
  delay_per_missing_endorsement: new BigNumber(4),
  minimal_block_delay: new BigNumber(15),
  liquidity_baking_subsidy: new BigNumber(2500000),
  liquidity_baking_sunset_level: 2032928,
  liquidity_baking_escape_ema_threshold: 1000000,
};
export const blockHeader = {
  protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
  chain_id: 'NetXz969SFaFn8k',
  hash: 'BMZXDPn8kKMCSXX1ZfpkCHBuSeXkwqbEp3MJtEwNB21TNVC3Gsp',
  level: 516500,
  proto: 2,
  predecessor: 'BM4FhgGT16ikghoVoz1WoG5z2pmo24GC9sTrfMk5UB4KEnzjNTu',
  timestamp: '2021-09-27T20:41:55Z',
  validation_pass: 4,
  operations_hash: 'LLoZRW4irfmyGwY5ufakDd52aA1P6bVhn3zpjBbQxdjPvwjeEaDkK',
  fitness: ['01', '000000000007e193'],
  context: 'CoWX5BdtfTGKmmwpwhF9cpU6SqBmP5MqostAPP6b3oZp94PG9V2S',
  priority: 0,
  proof_of_work_nonce: '36055190bec80200',
  liquidity_baking_escape_vote: false,
  signature:
    'sigXwcYckn43nA9uqFKKTqFbkiyhBdKfRd8mbCWHnk4kFqis7unT4VJozBrT7f1pVZNUnTPwHYBqarCdVTRajj5bhWg4qGSF',
};

export const bakingRights = [
  {
    level: 516501,
    delegate: 'tz1VWasoyFGAWZt5K2qZRzP3cWzv3z7MMhP8',
    priority: 0,
    estimated_time: '2021-09-27T20:42:10Z',
  },
];

export const blockMetadata = {
  protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
  next_protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
  test_chain_status: { status: 'not_running' },
  max_operations_ttl: 120,
  max_operation_data_length: 32768,
  max_block_header_length: 239,
  max_operation_list_length: [
    { max_size: 4194304, max_op: 2048 },
    { max_size: 32768 },
    { max_size: 135168, max_op: 132 },
    { max_size: 524288 },
  ],
  baker: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
  level_info: {
    level: 516500,
    level_position: 516499,
    cycle: 127,
    cycle_position: 403,
    expected_commitment: false,
  },
  voting_period_info: {
    voting_period: { index: 25, kind: 'proposal', start_position: 512001 },
    position: 4498,
    remaining: 15981,
  },
  nonce_hash: null,
  consumed_gas: '0',
  deactivated: [],
  balance_updates: [
    {
      kind: 'contract',
      contract: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
      change: '-640000000',
      origin: 'block',
    },
    {
      kind: 'freezer',
      category: 'deposits',
      delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
      cycle: 127,
      change: '640000000',
      origin: 'block',
    },
    {
      kind: 'freezer',
      category: 'rewards',
      delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
      cycle: 127,
      change: '16484375',
      origin: 'block',
    },
  ],
  liquidity_baking_escape_ema: 243180,
  implicit_operations_results: [
    {
      kind: 'transaction',
      storage: [Array],
      balance_updates: [Array],
      consumed_gas: '2118',
      consumed_milligas: '2117300',
      storage_size: '4636',
    },
  ],
};
export const endorsingRights = [
  {
    level: 516500,
    delegate: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
    slots: [12, 37, 80, 120, 130, 206, 209, 219, 229],
    estimated_time: '2021-09-27T20:41:55Z',
  },
];
export const ballotList = [];
export const ballots = { yay: 0, nay: 0, pass: 0 };
export const currentPeriodKind = {
  voting_period: { index: 25, kind: 'proposal', start_position: 512001 },
  position: 4498,
  remaining: 15981,
};
export const currentProposal = null;
export const currentQuorum = 5500;
export const votesListing = [{ pkh: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5', rolls: 399 }];
export const porposals = [];
export const entryPoints = {
  entrypoints: { main: { prim: 'pair', args: [] }, default: { prim: 'unit' } },
};
export const chainId = 'NetXz969SFaFn8k';
export const packData = {
  gas: 'unaccounted',
  packed: '050a000000160000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c',
};
export const currentPeriod = {
  voting_period: { index: 25, kind: 'proposal', start_position: 512001 },
  position: 4498,
  remaining: 15981,
};
export const successorPeriod = {
  voting_period: { index: 25, kind: 'proposal', start_position: 512001 },
  position: 4539,
  remaining: 15940,
};

export const protocols = {
  protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
  next_protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
};

export const delegatesIthacanetResponse = {
  full_balance: '1198951292321',
  current_frozen_deposits: '120167343864',
  frozen_deposits: '120167343864',
  staking_balance: '1203308804406',
  delegated_contracts: ['tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD'],
  delegated_balance: '4357512085',
  deactivated: false,
  grace_period: 37,
  voting_power: 199,
};

export const delegatesKathmandunetResponse = {
  full_balance: '965532868030',
  current_frozen_deposits: '96350095609',
  frozen_deposits: '96350095609',
  staking_balance: '970221941952',
  delegated_contracts: ['tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD'],
  delegated_balance: '4689073922',
  deactivated: false,
  grace_period: 42,
  voting_power: '968128693450',
  remaining_proposals: 20,
};

export const votingInfoKathmandunetResponse = {
  voting_power: '1054404383333',
  remaining_proposals: 20,
};

export const blockIthacanetResponse = {
  protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
  chain_id: 'NetXnHfVqm9iesp',
  hash: 'BMGdK16iMkm4YmgAneYuvd7B4R5S8nYQKFfKzXCKMHP1FqS5hXQ',
  header: {
    level: 135596,
    proto: 2,
    predecessor: 'BLgx6Cr7DYwXEexuz828mBUqCKotCXo8PRAN55A9wovUrYWvao8',
    timestamp: '2022-02-24T01:09:20Z',
    validation_pass: 4,
    operations_hash: 'LLoaKP1SEeTE1ziKFRHipDYihitAoTHhEZbiartSvehqMPvu7v661',
    fitness: ['02', '000211ac', '', 'ffffffff', '00000000'],
    context: 'CoVkVfBsmMSCeTLcBesUe4TdhDhvZxhm8SN48Rky5B3aD8U92hY9',
    payload_hash: 'vh28CE8X2KKMvt5S4aGzPdMq5FpcfVRSoeyU3D3TUdVyk9zucR31',
    payload_round: 0,
    proof_of_work_nonce: '409a3f3f250d0100',
    liquidity_baking_escape_vote: false,
    signature:
      'sigtWPWubCNXDfaH7NZQcei2hzBbHKQtw56z2WRvrmyPNBLRYP2cNAycFob1Dr8MBbbCGtCUny2BaEbzBa4kVEadMNrGp6Mk',
  },
  metadata: {
    protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
    next_protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
    test_chain_status: {
      status: 'not_running',
    },
    max_operations_ttl: 120,
    max_operation_data_length: 32768,
    max_block_header_length: 289,
    max_operation_list_length: [
      {
        max_size: 4194304,
        max_op: 2048,
      },
      {
        max_size: 32768,
      },
      {
        max_size: 135168,
        max_op: 132,
      },
      {
        max_size: 524288,
      },
    ],
    proposer: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
    baker: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
    level_info: {
      level: 135596,
      level_position: 135595,
      cycle: 33,
      cycle_position: 427,
      expected_commitment: false,
    },
    voting_period_info: {
      voting_period: {
        index: 6,
        kind: 'proposal',
        start_position: 122880,
      },
      position: 12715,
      remaining: 7764,
    },
    nonce_hash: null,
    consumed_gas: '1000000',
    deactivated: [],
    balance_updates: [
      {
        kind: 'accumulator',
        category: 'block fees',
        change: '-1500',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking rewards',
        change: '-5000000',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
        change: '5001500',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking bonuses',
        change: '-4217424',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
        change: '4217424',
        origin: 'block',
      },
    ],
    liquidity_baking_escape_ema: 119624,
    implicit_operations_results: [
      {
        kind: 'transaction',
        storage: [
          {
            int: '1',
          },
          {
            int: '338987500100',
          },
          {
            int: '100',
          },
          {
            bytes: '01e927f00ef734dfc85919635e9afc9166c83ef9fc00',
          },
          {
            bytes: '0115eb0104481a6d7921160bc982c5e0a561cd8a3a00',
          },
        ],
        balance_updates: [
          {
            kind: 'minted',
            category: 'subsidy',
            change: '-2500000',
            origin: 'subsidy',
          },
          {
            kind: 'contract',
            contract: 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5',
            change: '2500000',
            origin: 'subsidy',
          },
        ],
        consumed_gas: '225',
        consumed_milligas: '224023',
        storage_size: '4632',
      },
    ],
  },
  operations: [
    [
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'ooqwt58nxiSHAsmwaBDux3LoEkNE9p14v1TXtnB4CfEaobgHuZ2',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 0,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1iZ9LkpAhN8X1L6RpBtfy3wxpEWzFrXz8j',
              endorsement_power: 206,
            },
          },
        ],
        signature:
          'sigT3AuNgusteshSqt2J5aha7iSsYAXsYVGAr62RNZkrd1Gp6JjY59CtD33a4zyv57ZwV7J5JvWRD7uZrwaE6NSzmP61SGkb',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'opZP7VfVcdqY5ivF5tyFYr48SR4wj74wrc4hQHyQWLv5azBZtiN',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 1,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1RuHDSj9P7mNNhfKxsyLGRDahTX5QD1DdP',
              endorsement_power: 121,
            },
          },
        ],
        signature:
          'sigdipDBAxcvLShbKRHNkBoSxxFUr2bTnoVsaM3df8zZhmNex1SefwfNmBJQPePvXSyePWMHSxQiDxpCDkzppEEade6eaSjh',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'onxcESouatMhSqYxmtQPtM99df28TYavNR2izyJtULDG29eq5FY',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 2,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1RJ74UepJA9tigjoEeUEFajowzVB3QQaVx',
              endorsement_power: 257,
            },
          },
        ],
        signature:
          'sigeNkH2F3rFUha9Qr1kunmoTHMsWcDKtjh6owGkmBu1xJW7VWfFvgGJtz3qvi2a7npnTfLzVPKroAQwTc8XjY3rMNwDZuUr',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'op2gAd6kzpWPViXxC5QhH62HhtRjjthf2QT78C9vC7epL9V5sxo',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 3,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
              endorsement_power: 1227,
            },
          },
        ],
        signature:
          'sigVwJmrALwEdqetE3Z6EDJyGpett54p4A68xKSpvZMnS2aJZa6Dqr6hiQFroEaV97VsZdVoBZZK1pn7o5CvwZ6BuHG89v7j',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'oorGPbxDrdFc8aZfa7BSLm2v2x3DEWdnThvvq6sxwv2Xbra74A9',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 4,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1XMiZwHpHZ8a1AfwRWKfzLskJgZNyV8PHs',
              endorsement_power: 139,
            },
          },
        ],
        signature:
          'sigRz9Ev7mwTiRtVdBegKCGHLqWz3JSt8HwwmmPoTNYEHyijovj62MRHQBAuaKVi6c7rwoP2451v1ejKB1diHYvgQ2L9iVBj',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'opLpk7KV13f8ZkjZrf15PW6gjaiBAeJeWgz3xsgcHv538afebPR',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 5,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1XGwK6kkiJaq2ZEJYcWEj5Tc8bcV6pNHqV',
              endorsement_power: 48,
            },
          },
        ],
        signature:
          'sigXSUhDQmNG4PuQR6Eaz5ffDsL3upXZ1QwsSd7Q4LTTkkucbsYTqorgpY9dh28XtcTFkxi6cGYN2cUUPvDaMXZxX4nJ4Zg2',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'op55vJPHBNdwmAztCGSEezNgUBMLrLa19F7FXGt4mXmYBJ2rz6i',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 7,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1cg5EqC3WdZgRSvGJeW328S4KQNrT4jvyv',
              endorsement_power: 264,
            },
          },
        ],
        signature:
          'sigWtL6YhYswrxoBxACy7P8dwrcWW4syiTeeggTL5sLyS1PdQUYaTMVgvTzWmdX5LdpC4JSB5o3xxF941ac3nbnFtzXgwMYc',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'onxq8YLBdsL8AJy81MXrsSMKdBKFnLk7GVqAUxjjoCLFt6D8HMN',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 8,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1NGS7FEGGfEFp5XRVkHBqVqSQ8VuumF9j3',
              endorsement_power: 33,
            },
          },
        ],
        signature:
          'sigpDY5wQs7Rxo7sFTcJUkxzXeBMvbnseLZaLAT5JB95iGS9ndwdQF1WYLSdAYDhwiXKuZpcGDFLHipHYizpQh8qQFg8xrYU',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'onqHgJw1HWxoHucpim35NQ2t4V4sPzJmPTPhru4cxuBJuMjQzwh',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 10,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1TGKSrZrBpND3PELJ43nVdyadoeiM1WMzb',
              endorsement_power: 164,
            },
          },
        ],
        signature:
          'sigUfJLBuU6HnaCVRDvFG6YELjMy3YmoMwj8ohgaYt9mTQUbK28AkfxjDcck72e3LsL6KGBZZjmSWDwwU6DtJanM5orRTubY',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'ooCYNg4ZMQWt3yzfyrDbmK6dtyMuwYr6spj2eCCoJf76iZeP3mP',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 12,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1MeT8NACB8Q4uV9dPQ3YxXBmYgapbxQxQ5',
              endorsement_power: 782,
            },
          },
        ],
        signature:
          'sigWwS6Cqc32rrngX136d2KKfp9SgBDdosgA2HoALEk62tRMjU6LJSa6m6SDnrKitAZrXTtD9VguMCc61X8oUuYyYt5nT1CF',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'opDt75d4MTscbTgXzcJVrKD25QPofMpkTzofCAeRZgskLYwbJX5',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 13,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1dqPQn5HXNJ7yjcqBx2w6sozjPXTV1kpfh',
              endorsement_power: 156,
            },
          },
        ],
        signature:
          'sigijCvAxjub2QdmhNT4wQkppQDYrKAxt7MN1v9iwRszcR3bMkKK6VfACHpy7RkQ4VvN3caPMJf6rhnLRdgpAqpQrAwj6KBT',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'oohJgzphmFhuqPzhhSgMThmeuUQNmpqbwUMjc2tPCGryQTFDCQ8',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 17,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
              endorsement_power: 237,
            },
          },
        ],
        signature:
          'sigQkUSHt6izTh7TNn3GTtELiL6rypCYUYHFPU65FXWojV6xhsL7jDkJipxSLvpPhshK8d7EebWSe2PhFrtqgUWBbuGibNtm',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'ooQnVunqu4u6KVD65kKfruyh4fUDLD8ahqmvg3tWQbo1WX6yreK',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 18,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1NiaviJwtMbpEcNqSP6neeoBYj8Brb3QPv',
              endorsement_power: 240,
            },
          },
        ],
        signature:
          'sigqVDESVHH7tkjtyuM63TsL28C3HSjmesdGJn7ALFKVQHn1Ciw23PhAXeeR3iS9LtVihM7LQy4hqjZhZqCWnP5BmoPgXSFr',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'ooUzJx1JK2uMnSxzwTzN7VCaaGropVm32w1CMXc25fLwBvNoSiF',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 20,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1LQ32syCNyGj6FdAuJfko42Wep87iYZk8k',
              endorsement_power: 159,
            },
          },
        ],
        signature:
          'sigTcHdNzSGKd3WoKTcwFYvZXseN3oya2eNnRWvnh3yjDoqjB4mJedUrvVPHb3XphnejGhmqscWQeqo8qz5SMJGFvSLsaU5R',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'onfyPPCxtU937rMKNtkXV978ckQSnTqgM9VMEsB18ha9QXHZbyw',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 28,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1funU3PjPsuXvmtXMgnAckY1s4pNT6V7WJ',
              endorsement_power: 152,
            },
          },
        ],
        signature:
          'sigfiyUP39iz8GGq6opn5eMiUqGCJ1vRWF8r92ByyeL7zhGe7b21WEKREYNmAPfhcWFWHm9rFRB5uav4LMFd2V6NCwkQtsaF',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'ooosvu7cCgZZG9E8SYgrNBFBJcVtTnrhhuoEuckNGzsEi5ug8uk',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 29,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz3Q67aMz7gSMiQRcW729sXSfuMtkyAHYfqc',
              endorsement_power: 158,
            },
          },
        ],
        signature:
          'sigqFLE4Q2uZ6yMo8QWjrsbzVKV4bWNWbppP5ZhLDsvL83HbzJQG2ABHbCALrqXNrZR1znRcvAaB7JYEHDScw9tqWVN2VpKt',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'ooT5Fy1ZkamhGPBKSE6uFhQicoaZJNBC4AsoWo9F9v7W6AVRvpv',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 33,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1cXeGHP8Urj2pQRwpAkCdPGbCdqFUPsQwU',
              endorsement_power: 163,
            },
          },
        ],
        signature:
          'sigvGuQyTgdreAChYGAjUYR76pQSKKTq7ed4vFuzSGe6sZyiSa1uXS8wRDqH5nXTugTKs6S7sSDps4UsT6SRuTXQFN5iDekk',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'onway6W9qLwef1ejbEFPtKiU6wzjubKfj6YorREHtiaZhNQuRuD',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 35,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1ituzNz9MGaMSL9dVDN7jE5SArCEWNmZbS',
              endorsement_power: 161,
            },
          },
        ],
        signature:
          'sigN9vEVaZerpXewKGoDUhXqDoyw69jawRuewDAf55z839E4JSaW3KDGX3AZHN5vRxPxiQLTUmvnUCTxK73fQL63aJ8CMiLF',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'op2tvcwvEN8vDoBQdHinKCpJpq5xr8uhXjESfNpQg4dUYKXv3RC',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 43,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1hm7NuCGNSKZQLQSawjUnehJcX8yCBcCAq',
              endorsement_power: 162,
            },
          },
        ],
        signature:
          'sigmCvUw4dFVcru7Vpa4yiQKh8M5zX4EPXNwg5VTggXDiQmxTeZdwsKggZJwh3CDyiBWvLL7gnnbCK644Kwy59xXpZvQi19h',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'onr9HZHYKAgRxrZKgvQWraBGaGAoWGqtEaT8bArT9JzfxisgWTw',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 44,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1Q7YBzLJkw87c2FdwaWuGKyacSDc4QghzQ',
              endorsement_power: 137,
            },
          },
        ],
        signature:
          'sigwKZiwNPK4mw5eEBBGh8TNNGuhuQ2snncTLWuQhMxs9GFxMFRD8GrkLUwsPQV84Qcr6pwbFFPFQx5U6TUBT7ZXU9jovyLY',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'opUPRQxsDU1XsppujmWr66YwQLD135vApq6EbVz7mtY58EKCSGq',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 46,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1NFs6yP2sXd5vAAbR43bbDRpV2nahDZope',
              endorsement_power: 117,
            },
          },
        ],
        signature:
          'siggYsKR7C7hMFfUXNv4KvUx9t2djbZxVHeSJQvd5Zcmz8tg5bCZLmXV8rwAeB5bFahuVn5z6iAp8SMXT35peAPc37256pEE',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'ooM4BoirczR6W8hXEVsYQ8cHerbHbE9in4z5wMS2AhxvP2Ufad4',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 47,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1KkJtLB9pMdLKNpVRNZw9zmysrxKmYcRGU',
              endorsement_power: 158,
            },
          },
        ],
        signature:
          'sigpDri9hyWVNm6VrnS8Kr4yY3bdNXEWwXPmUEMbvJSM6nLEgzHczAN9QQ73WiHv6xJdjdhgUjitkHkyU8tsmEHSpJMGLrTt',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'ooLKxLjcVBoeB2GJ2QNg6afi4HwUQ2upCfaxWsjT4k1nrtxmL8h',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 48,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1V9CRVyKP3roXsnjcFJP3p9DSXX63KL7iP',
              endorsement_power: 166,
            },
          },
        ],
        signature:
          'sigVjebUbAjkjvw1wyvQ73FyEn9GJfnytuqN9Xd3ghEzaFyacaWEiD7c1ANv67XYDgrquV3GsHF29booHXinSjGjP4cAgcRU',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'oo36GYoDhvBuhb4wqFRRZ2ugLJNkKfHGmcaHhjLCg9SgdiQPJSY',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 54,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1Zt8QQ9aBznYNk5LUBjtME9DuExomw9YRs',
              endorsement_power: 153,
            },
          },
        ],
        signature:
          'sigV2Cfek4NvEY5CvN91nJLfAG2xG7r8hAt3nZQFPNYu5Qtz3TEQbYLxfwbs8UozKvv8bwAzVk35L9VKgcMUkaEZ3NHsYYg1',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'oopWQdrwuxWCBkw7qaVesBLCsGExxuhRuU7FJqQuA9pQcr7nPzw',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 59,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1e841Z7k7XHSoTSyHyBHG2Gijv7DzzjEBb',
              endorsement_power: 170,
            },
          },
        ],
        signature:
          'signyax1oDM1SxWoQir1aMRNXnm1zDnSvLyZnGdPZzh8kqYiK7GqiNb9tP3DUxcLnZeYtiQbWNuBCf6eZzXnXtc7mUhYXAHV',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'oo4t2WvJgwZhAsf5CwcDtKCfSkiaKp9wTNYL7LuAbJ9k3sJvTEg',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 61,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY',
              endorsement_power: 74,
            },
          },
        ],
        signature:
          'signNkorAErY1hBzFRkzeMTqUy6inFFTd9EmpYPKfFyUGX139DyHtsfUHfumPFHeomLtXZMmGQ5g2vi4R1tveaS9yQvz7aba',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'opUy2TmnHxDqjUt3Ht7dCsWyLLNz9sRpA1eC5qZqkhyvHND67pu',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 64,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1QXAAasy8TciwfvDC4a7MWo1tm3K37uN9Y',
              endorsement_power: 153,
            },
          },
        ],
        signature:
          'sigtoch1ijiGuNGW3qHtAngiEDhEqL5T4acdNEGKt4ew2NoPNkxScgshoxttV45NYxKpLNw6J3FQHPRyaT22fGgwbd9ySu3k',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'ooArbFfPVgM6mc3RUroxf2qsimXProumPK6XuidgfjosoT2VN34',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 70,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1MvCE9dczhoij2bd4sLL2AfVuMtWfFAoCN',
              endorsement_power: 137,
            },
          },
        ],
        signature:
          'sigb2eh47AatunkNSZPVpsZg9nqGqu8GG2C24Hx4D6SoRJ1sz4jgFPjAhP1rk9BkRJ8GfM3AYyY7PGdFqzod3a6q1Wk4ZRVK',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'ood93Z7NmwMeLSo2dW8tBUBst3p3ogcEmkUrDR9T8coHrVApZzF',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 71,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
              endorsement_power: 119,
            },
          },
        ],
        signature:
          'sigiSzxJ1dSeHujvRtv1VKCAc5V1mu5ftRfyutfgKyjjCLGRrNG73k8jb5nqjiTu9T79L4oKdf1g7AEQMCK6eENWPcaMwfFN',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'onjvGqyScQLdGb5cMPwHbnd9UVmh3MhcUze3P1wGHSXRarfxAwY',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 75,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1edUYGqBtteStneTGDBrQWTFmq9cnEELiW',
              endorsement_power: 135,
            },
          },
        ],
        signature:
          'siggwc4K8yWEU8ttzA8HhQh15zV2fYcyK6nfbuVGVs3G2TbM1nVrJxLiC6sHKqBtBuofiC8pYzDLJxVY9zdCzGqBhyMPCw4M',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'opBqy3cLQugeT2xVvKoJUn3yLp79hzuXHc7r5BqSa5HHHFddYgB',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 85,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
              endorsement_power: 139,
            },
          },
        ],
        signature:
          'sigoZ5bh1XPA8kHFkBCs4U9Dq6nT9Ng3i9LENKKCHg8k96TP4KVcFmh1iyVTpxSSiM8V21bnZ7W91KsDL2vekru1ACXsU8Yp',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'opCRv7Ewfh3s96PDiVKPC2c4A9oT6nf8FVeQYB2EUEJFT81UTET',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 90,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1SFbdg2jjkixHNU1Jm9f8JA4pYnMXsgATC',
              endorsement_power: 5,
            },
          },
        ],
        signature:
          'sigcmrbc6rZnDpEkR268Pvzz2GPSRi8nWnTthYXt8L6Tg9pB4vzdh4uy8gKYrMQFbJTwRSsyPa31xR5u8FMH9xMAfrWn9r48',
      },
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'op9TeE362FGyayWVRghVrRxm2FdezqPdqJRM4VTeq5C6ievFDkd',
        branch: 'BLzJ1MtqtmWwnG6ZdX7LPygJGvaE51eDqX55KVQM4HNHcVbeDKs',
        contents: [
          {
            kind: 'endorsement',
            slot: 116,
            level: 135595,
            round: 0,
            block_payload_hash: 'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6',
            metadata: {
              balance_updates: [],
              delegate: 'tz1RBECWBXv4tKcuDbxYmBguvdn8wzjrejHg',
              endorsement_power: 143,
            },
          },
        ],
        signature:
          'sigQ5nhdCPRiddmNUYLXCeBk5qs3T6fxMiitKgFJQg5Nuo8sqJTamyJctbF5Gt7MrDZEdiCcmZBj4dEHa9fjDLyCSdgHsL3x',
      },
    ],
    [],
    [],
    [
      {
        protocol: 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
        chain_id: 'NetXnHfVqm9iesp',
        hash: 'oowvQuTHNxiG8x1TzewhUHtKGLhFPbhiaaHJFKpUnvkv2h3RDsz',
        branch: 'BLZNxWPKB9CGGZ8bCYvkq7NwHZNHLuCHnueiJz7QFEzUztT4TjP',
        contents: [
          {
            kind: 'set_deposits_limit',
            source: 'tz2FViF6XzJ4PqD5TTuaAtZScmiwpJBGBpSh',
            fee: '1500',
            counter: '146662',
            gas_limit: '1000',
            storage_limit: '10000',
            limit: '3',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz2FViF6XzJ4PqD5TTuaAtZScmiwpJBGBpSh',
                  change: '-1500',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '1500',
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
          'sigegUy94SxjpBw2MwKMsqFjEjbeoQu8VdcXciXRryv4KA1hMT2gGKRCKnDFinKHaaWGCZskHzo2Hb6XB1iV6gonUdhBuCuN',
      },
    ],
  ],
};

export const blockJakartanetResponse = {
  protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
  chain_id: 'NetXLH1uAxK7CCh',
  hash: 'BLivfHQoHCtixrwXCNnsMQj33F3mLukQBBh4KoJ9AT6ADvLz7Ev',
  header: {
    level: 63401,
    proto: 2,
    predecessor: 'BLzrD8thayxjzCxQAy2y3WYg7Rqvh59V3FX2UpDZdNkoeutt935',
    timestamp: '2022-05-09T22:46:29Z',
    validation_pass: 4,
    operations_hash: 'LLoaagEt9R7Tujwg4rnn5asisJ1e1cnnvN7aqvTmX4cr8i9jK5qjE',
    fitness: ['02', '0000f7a9', '', 'ffffffff', '00000000'],
    context: 'CoVAg76cML89Kqfgcsir6EPNjs6aTjB7ESWaTBSJsCUys4tzoDf2',
    payload_hash: 'vh2RohN1n4qVrPifqwdhvPty2qFmeHfhhKWh7qwJF5vQHuze25Jz',
    payload_round: 0,
    proof_of_work_nonce: '4abb58b400000000',
    liquidity_baking_toggle_vote: 'off',
    signature:
      'sigcRoFAEPYkmtMRGReeSd5tjnSNfgAntG3H5aHyTk4WSKc42QVzj5xHf9RsDvkyGSgLsm7hvYVoQ27p8pd9QYSmNUWdS11t',
  },
  metadata: {
    protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
    next_protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
    test_chain_status: {
      status: 'not_running',
    },
    max_operations_ttl: 120,
    max_operation_data_length: 32768,
    max_block_header_length: 289,
    max_operation_list_length: [
      {
        max_size: 4194304,
        max_op: 2048,
      },
      {
        max_size: 32768,
      },
      {
        max_size: 135168,
        max_op: 132,
      },
      {
        max_size: 524288,
      },
    ],
    proposer: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
    baker: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
    level_info: {
      level: 63401,
      level_position: 63400,
      cycle: 15,
      cycle_position: 1960,
      expected_commitment: false,
    },
    voting_period_info: {
      voting_period: {
        index: 15,
        kind: 'proposal',
        start_position: 61440,
      },
      position: 1960,
      remaining: 2135,
    },
    nonce_hash: null,
    consumed_gas: '1521000',
    deactivated: [],
    balance_updates: [
      {
        kind: 'accumulator',
        category: 'block fees',
        change: '-380',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking rewards',
        change: '-10000000',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
        change: '10000380',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking bonuses',
        change: '-8533426',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
        change: '8533426',
        origin: 'block',
      },
    ],
    liquidity_baking_toggle_ema: 521773279,
    implicit_operations_results: [
      {
        kind: 'transaction',
        storage: [
          {
            int: '1',
          },
          {
            int: '158500000100',
          },
          {
            int: '100',
          },
          {
            bytes: '01e927f00ef734dfc85919635e9afc9166c83ef9fc00',
          },
          {
            bytes: '0115eb0104481a6d7921160bc982c5e0a561cd8a3a00',
          },
        ],
        balance_updates: [
          {
            kind: 'minted',
            category: 'subsidy',
            change: '-2500000',
            origin: 'subsidy',
          },
          {
            kind: 'contract',
            contract: 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5',
            change: '2500000',
            origin: 'subsidy',
          },
        ],
        consumed_gas: '205',
        consumed_milligas: '204975',
        storage_size: '4632',
      },
    ],
    consumed_milligas: '1521000',
  },
  operations: [
    [
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'oodkkuZhFs4vfU7iYUQxoQgukBybT7MakLAetVFg2Qx4MxDbvfh',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 0,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
              endorsement_power: 1389,
            },
          },
        ],
        signature:
          'sigQFZbKyETsWini9WfDLNEvB74V2C3pcjb7SKnU9ZqUvJwsn8hSbhTEi6tUisUgoqXNfFq86UPmcWxY1oxzdJWv55nQn2iz',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'oniP1RkPbXkYx6JqScJFo7zTaeh8Yk3EvYKCk4LeTLwapxZhcKf',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 1,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1WzwobH5AFz3ea8n2UEramfYm1LY96hKJK',
              endorsement_power: 328,
            },
          },
        ],
        signature:
          'sigNtMYSRZcwbUL1zJmM1M4VimtoT3wPtUJV3B8aZwjFFR74o8wV62Zte7QNM6umJug4LxYbxg9LMSNxLrLziUcvMtvR7RbP',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'ooVsncQsfHFiPniZeJ6RiyFwMnEmac1apTZhjecZH5TeX6AHhx1',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 2,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
              endorsement_power: 471,
            },
          },
        ],
        signature:
          'sigQmXbRPsprFhuac6eeW66qp9Nf2RoHyjeNBwHYXSixdP7LiXNirCFAWB7YwV5cF3kQtaAqRTH21BjFbJo96ZAGTh6kK2PE',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'op3CxsBNtV1bkXM6rwqN7kW4AQ9pZYtnDDkZVNEgKGV7i1s5CXk',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 3,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1MvCE9dczhoij2bd4sLL2AfVuMtWfFAoCN',
              endorsement_power: 220,
            },
          },
        ],
        signature:
          'sigf34YLEzjWP3iF5KPzBTAgv4942SgvwRje4dByVEVMVKGWSb48ygUdXtg7umiEfKVrNx5zoq6xTCXXb1T9wCFkGDQyCSHA',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'op5xBzwaZ3xkSMLgpnUrJAR4baCjKAgNQjQCzDAo5hFZShe33or',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 4,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1iTzWpFhURP5EnWqAc9hUkuVe2b2tSAGXC',
              endorsement_power: 317,
            },
          },
        ],
        signature:
          'sigbCpffpWqNLYY8ehNZHwVGEt2RCT46zHjNZxM5YuUVg9tYRA6Kt99PMwMQCy8Y7HfVP54LnoH3xyDXi339Up5hMYP2VLQi',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'op4Z6oKBNLpm43LZp3NyKFujNcPd891neF5LouVewHDd13Yg33o',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 5,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1XGwK6kkiJaq2ZEJYcWEj5Tc8bcV6pNHqV',
              endorsement_power: 226,
            },
          },
        ],
        signature:
          'sigPTqcf6fHWkWoD9C3LL7KDFguvjrSgZ6p4yf3GvdMWuGxeY6aaWmFNxLRyzt3c3ALmEm3EwZNX79kSCccumXyC8Jrb9Vav',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'ooB93dyDk13ASFL8y4EbtQdjDVcqkGxXZQUjgpMJ45aWSYG6vae',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 6,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1KkJtLB9pMdLKNpVRNZw9zmysrxKmYcRGU',
              endorsement_power: 368,
            },
          },
        ],
        signature:
          'siggGigRRh4LqDir1Bjgheve9dzi3wQDWnfGrbGtfcshZEr9PmanTb8VK2RAdCLFnHyhTC1cTZ5Va3h9QWWk5FsQBVEYkUqA',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'oo9D3ajMuU362tHD91ooE72s3EmPWq7aaQmSn8ir7wHLVNYMxpu',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 9,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1Zt8QQ9aBznYNk5LUBjtME9DuExomw9YRs',
              endorsement_power: 355,
            },
          },
        ],
        signature:
          'sigtxzPKVendcBHhHPUKLN88qpL8Ge3mnKeJnXXp1E8VT9ZKxzcgBeA8JTo2idzicNEcoimzUXDPGfomrFhCMtiv6DxcmQFy',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'onjJxn5oipcyRPQnmZfMo2HPvrHud4toAANnRX7ARkT5gvyYXNX',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 12,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1ccniXhg7WdHVJfvnXMVMihxitQTijQeEd',
              endorsement_power: 111,
            },
          },
        ],
        signature:
          'sigXiaGXhC9H3F1VLXuL8h7AL1Xu3YDfMthY348fNxx8Przh38VNWVs68ELNa682WYGyLXYEgL76rpt76yxdQEb6ohsU9Nmy',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'onuXN99bd5DhE63jJWD5pcQQebT5tT7LKxkQnJvHRa6k9GtBFS3',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 14,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1RuHDSj9P7mNNhfKxsyLGRDahTX5QD1DdP',
              endorsement_power: 323,
            },
          },
        ],
        signature:
          'siga5gLgGCXnfrHJQJRKxze5TXD4dZFYkMu15A3z3CFZoHocEhPJxQr9YkEzJHMZTbT5Wkfr2yVDXM2XHC8TBecCaRpB9p5o',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'opBaGizW8iuRFpy24PWExWRmfp8Da7rZ5RnLrpFwM1rwyt7DYqg',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 17,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1hm7NuCGNSKZQLQSawjUnehJcX8yCBcCAq',
              endorsement_power: 280,
            },
          },
        ],
        signature:
          'sigbVaSBRhiZFJ9ne4AiNZwf6HFQo212BVzAn96HLmovsQAqAd8diUXEoUuTvav9z1d3NGobuQD4NuvnBg7bBmwyLUcSdnZU',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'ooPowq4hovzxUb67axpg6hbRhHie5x6oFehiy68NRVDVdJ3pero',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 18,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1hoyMUiJYYr4FRPMU8Z7WJzYkqgjygjaTy',
              endorsement_power: 343,
            },
          },
        ],
        signature:
          'sigw9Ve969dwbpFiZSPNXgH9LKPfusyxKrYUXvA3gyErR6AhwYBgUtcrbeDbXvLbFcGzKztVPNP7ZNtZ2zfPJw4cTTcpNH32',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'ooh8tXizxmbpA9HUqgNkKsVnzYREkBhNWq1kCsLfsnVe194wQYQ',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 19,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1Q6VpNkHPsdTaoKJ7hFF9kAycrs1wxYZQY',
              endorsement_power: 80,
            },
          },
        ],
        signature:
          'sigcVE9tMqxxydNp9NVePq86wvRFVmd5K7ay6nq9MURw5TFL6YxnFhL9sDLwxGEmkMk6L3vf7W94pLWzmDRtKSh7edyJpLx4',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'ontAWJPLYyTvqoMMYY5KbA9fECjCVo9FdW1mPgvPELVxDJwvAYA',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 20,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
              endorsement_power: 307,
            },
          },
        ],
        signature:
          'sigNjxaUBWhR3ppDEHq7x4gjwtCJ2PR5Yr5GzJYHwhPLenkerPwYSQiE5NEsjVV6CmTQN2jCrRXsfvZSxgNoWkGMtmKocsjQ',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'oo2bMFcvpg2EFGnYxTDhM9w1v4XwTLPjKr2bVTJS6uxKi8u85CA',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 22,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1cXeGHP8Urj2pQRwpAkCdPGbCdqFUPsQwU',
              endorsement_power: 141,
            },
          },
        ],
        signature:
          'sigb6k3e1hsQtJkzFUNXxDdEM8Pz9mT5hvX7nBo4586krePFuBvjcYQSsoUKvBC9hBRxANSv5DnbRj5ySenD6p1d3tygtyPo',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'opBjvNqfRjnWaP8LPfxBJzAX8dMGZp5Fi9ogCaknXo1anLzquVz',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 26,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz3Q67aMz7gSMiQRcW729sXSfuMtkyAHYfqc',
              endorsement_power: 332,
            },
          },
        ],
        signature:
          'sigmxp4mrHbtjjfGvnbnQGictJAws1uGGBQ2u4GRpQAqWCukz8Us5kwpeAWDnbyMEMZM6f7e4SzHH558TzRoPzkypg8mGLUA',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'onyKnSuaZERZJMoK4FobMio7Pa5V4vsSx32nfdJQSxWcofQHwrm',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 32,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
              endorsement_power: 341,
            },
          },
        ],
        signature:
          'sigoVLK4Pyakb3oqxSsHSdBPbA2uJ3a36gdiKukUzyhQ5SSfe8DDnn3QzsfDyTSzDWs2bE6p5RNWf6MLm2qZgv3z1v77NMPb',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'opHupJB4w7WJvx8bDJbMYNcTvgUEgwWXD54FBgg6oScqj1n5znz',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 37,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1KhTJVAkKc5zhN29VBA3uEijtCKy6kfNBP',
              endorsement_power: 361,
            },
          },
        ],
        signature:
          'signkqd9KuDqmNn6PAs8ekkW3L1xL29ojMBfFrRNoAkyfeEptkEB4FZEq1BgwuhBQ6uywKUycVhtMi8hzTnKP1MUWhBeYmBV',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'opUbx3eAV1cMFjy3KWrhCPHYD3pAkHyuV1aUNJwEbvM5tyPdSxi',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 47,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1XpntqFmUYqAJw3qMxjGMR4m8rJUrvuMnp',
              endorsement_power: 304,
            },
          },
        ],
        signature:
          'sigr3fuug1YVi1jhJ3zqHFgw5JQGDHpKAKy3L3XJJa3NT6DQapFsvSgxzfaVWJ4fKoBQWvvKdiFeBgaXmTcV51eVNmaerhD7',
      },
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'ooVheinh7dJFdMFsnvKA6RQiHZN5EZTASay4BnPGP5sTKQH7igX',
        branch: 'BLWjScATovLPaC9CC2WTTcQLPtSeDsvi3KYQv9sdADCUckuKqAG',
        contents: [
          {
            kind: 'endorsement',
            slot: 123,
            level: 63400,
            round: 0,
            block_payload_hash: 'vh2rPXnC3mDgAQ5CR15VF91QfHtAzP5aEyR1VBV6NL3bJbck4th1',
            metadata: {
              delegate: 'tz1funU3PjPsuXvmtXMgnAckY1s4pNT6V7WJ',
              endorsement_power: 61,
            },
          },
        ],
        signature:
          'sigjAJmfrSUJxxPFqPqZPXTzktZZ6rFBgD4MsVtnStVGwSvSBsZkqdFCrHFDbq8CM2HsGowKvknQqBn4KdVutviTVqh6mBuM',
      },
    ],
    [],
    [],
    [
      {
        protocol: 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
        chain_id: 'NetXLH1uAxK7CCh',
        hash: 'ooxVg6Ggafc8BZQ463DYN6L5n91kZT7vicBNauVoTvP6N2H5UAU',
        branch: 'BLK2bAvb39oqRLzZnofB3ht1F5iR1Po2WDdmq2i7pSzSVgEtV8u',
        contents: [
          {
            kind: 'tx_rollup_origination',
            source: 'tz1QWLc8oL7Bo7BMa6CKfFioeJ4XdmCFf2xZ',
            fee: '380',
            counter: '173977',
            gas_limit: '1521',
            storage_limit: '4020',
            tx_rollup_origination: {},
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1QWLc8oL7Bo7BMa6CKfFioeJ4XdmCFf2xZ',
                  change: '-380',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '380',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz1QWLc8oL7Bo7BMa6CKfFioeJ4XdmCFf2xZ',
                    change: '-1000000',
                    origin: 'block',
                  },
                  {
                    kind: 'burned',
                    category: 'storage fees',
                    change: '1000000',
                    origin: 'block',
                  },
                ],
                consumed_gas: '1421',
                consumed_milligas: '1420108',
                originated_rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
              },
            },
          },
          {
            kind: 'tx_rollup_submit_batch',
            source: 'tz1QWLc8oL7Bo7BMa6CKfFioeJ4XdmCFf2xZ',
            fee: '476',
            counter: '173978',
            gas_limit: '2209',
            storage_limit: '0',
            rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
            content: '626c6f62',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1QWLc8oL7Bo7BMa6CKfFioeJ4XdmCFf2xZ',
                  change: '-476',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '476',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [],
                consumed_gas: '2109',
                consumed_milligas: '2108268',
                paid_storage_size_diff: '0',
              },
            },
          },
          {
            kind: 'tx_rollup_commit',
            source: 'tz1gqDrJYH8rTkdG3gCLTtRA1d7UZDjYFNRY',
            fee: '735',
            counter: '182217',
            gas_limit: '3838',
            storage_limit: '0',
            rollup: 'txr1Nbn66mC1yYHBkfD3ink45XVJso6QJZeHe',
            commitment: {
              level: 1,
              messages: ['txmr344vtdPzvWsfnoSd3mJ3MCFA5ehKLQs1pK9WGcX4FEACg1rVgC'],
              predecessor: 'txc3PQbuB4fmpXMq2NqXGpCnu8EDotTWeHf5w3jJRpyQHSNKRug3U',
              inbox_merkle_root: 'txi3Ef5CSsBWRaqQhWj2zg51J3tUqHFD47na6ex7zcboTG5oXEFrm',
            },
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1gqDrJYH8rTkdG3gCLTtRA1d7UZDjYFNRY',
                  change: '-735',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '735',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [],
                consumed_gas: '3738',
                consumed_milligas: '3737532',
              },
            },
          },
          {
            kind: 'tx_rollup_finalize_commitment',
            source: 'tz1gqDrJYH8rTkdG3gCLTtRA1d7UZDjYFNRY',
            fee: '507',
            counter: '182232',
            gas_limit: '2602',
            storage_limit: '0',
            rollup: 'txr1RHjM395hdwNfgpM8GixQrPAimk7i2Tjy1',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1gqDrJYH8rTkdG3gCLTtRA1d7UZDjYFNRY',
                  change: '-507',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '507',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [],
                consumed_gas: '2502',
                consumed_milligas: '2501420',
                level: 0,
              },
            },
          },
          {
            kind: 'tx_rollup_dispatch_tickets',
            source: 'tz1inuxjXxKhd9e4b97N1Wgz7DwmZSxFcDpM',
            fee: '835',
            counter: '252405',
            gas_limit: '4354',
            storage_limit: '86',
            tx_rollup: 'txr1YMZxstAHqQ9V313sYjLBCHBXsvSmDZuTs',
            level: 4,
            context_hash: 'CoV7iqRirVx7sZa5TAK9ymoEJBrW6z4hwwrzMhz6YLeHYXrQwRWG',
            message_index: 0,
            message_result_path: ['txM2eYt63gJ98tv3z4nj3aWPMzpjLnW9xpUdmz4ftMnbvNG34Y4wB'],
            tickets_info: [
              {
                contents: {
                  string: 'third-deposit',
                },
                ty: {
                  prim: 'string',
                },
                ticketer: 'KT1EMQxfYVvhTJTqMiVs2ho2dqjbYfYKk6BY',
                amount: '2',
                claimer: 'tz1inuxjXxKhd9e4b97N1Wgz7DwmZSxFcDpM',
              },
            ],
          },
          {
            kind: 'tx_rollup_remove_commitment',
            source: 'tz1M1PXyMAhAsXroc6DtuWUUeHvb79ZzCnCp',
            fee: '574',
            counter: '252310',
            gas_limit: '3272',
            storage_limit: '0',
            rollup: 'txr1YMZxstAHqQ9V313sYjLBCHBXsvSmDZuTs',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1M1PXyMAhAsXroc6DtuWUUeHvb79ZzCnCp',
                  change: '-574',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '574',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [],
                consumed_gas: '3172',
                consumed_milligas: '3171088',
                level: 0,
              },
            },
          },
          {
            kind: 'tx_rollup_rejection',
            source: 'tz1MDU45gNc9Ko1Q9obcz6hQkKSMiQRib6GZ',
            fee: '2837',
            counter: '266515',
            gas_limit: '11633',
            storage_limit: '0',
            rollup: 'txr1V16e1hXyVKndP4aE8cujRfryoHTiHK9fG',
            level: 11,
            message: {
              batch:
                '01b2530bd9f4d594ee6116286cbb045a972305e38e6365b396f49d153815fbdd15c8974b7fdc50aee4bc3f8195e95075ab0fca5d31927917ede7a408fe70c61cd4a0525b2836eca0e797cdf9ae9b3bf58735fd62a7bf21775d46940ae9bd83a8d501130187e8c631aba41d88a67da49cf5f4db947fdf5a76084f1d4b6c14531f6582b239db26dd0375ca7172cdbecd8b6f080ffa58c748f83cc7a2afce164c1bcc53712ff5a9e50c39fb0172acda0a',
            },
            message_position: '0',
            message_path: ['txi1WZKF1fkUWfKbmaHbb5b8gn68rKSyUy4k7NnSVY4p79BKYz5RB'],
            message_result_hash: 'txmr344vtdPzvWsfnoSd3mJ3MCFA5ehKLQs1pK9WGcX4FEACg1rVgC',
            message_result_path: ['txM2eYt63gJ98tv3z4nj3aWPMzpjLnW9xpUdmz4ftMnbvNG34Y4wB'],
            previous_message_result: {
              context_hash: 'CoVUv68XdJts8f6Ysaoxm4jnt4JKXfqx8WYVFnkj2UFfgKHJUrLs',
              withdraw_list_hash: 'txw1sFoLju3ySMAdY6v1dcHUMqJ4Zxc1kcynC8xkYgCmH6bpNSDhV',
            },
            previous_message_result_path: ['txM2eYt63gJ98tv3z4nj3aWPMzpjLnW9xpUdmz4ftMnbvNG34Y4wB'],
            proof: {
              version: 3,
              before: { node: 'CoVUv68XdJts8f6Ysaoxm4jnt4JKXfqx8WYVFnkj2UFfgKHJUrLs' },
              after: { node: 'CoUn3twa3TmvNby5VAGeN2jHvzbfpmJAXcyDHJuLLAuuLiaZZnzC' },
              state: [
                {
                  inode: {
                    length: '14',
                    proofs: [
                      'CoVbQczQE6uDug4tWErtLgszzZBRDJKEGHgcQp8jGYSEfBLnsMXH',
                      'CoWZ31tY65qh38Sfgm64Ny8kDTLQQMr5xuRDkDkz1JopiBnPDu11',
                    ],
                  },
                },
                {
                  inode: {
                    length: '6',
                    proofs: [
                      'CoVecMq8ageb8fsmr6MPdNDH583cEpfCjVu8dQJpBP4J5GxM4Fex',
                      'CoUh6FXy5xrEqSswAJ8MmAWcJMUiLyCq53RQiEHoHdovYxzXLHVE',
                    ],
                  },
                },
                {
                  inode: {
                    length: '3',
                    proofs: [null, 'CoVPGhaCkq2yV5JJs8Bxq1idndEhBn3SCJe3rSH5eYvr9BnRnv8i'],
                  },
                },
                {
                  inode: {
                    length: '3',
                    proofs: [
                      'CoWawEsrigKz7nfmXdCE84Rj6sJzzSj3RdeyuySjaxzhFZ17EFjb',
                      'CoVWwp2qJWcRXvNA4adk9nUHRvKT22qY8QEoaAYK2Fz5tviyCaBw',
                    ],
                  },
                },
                {
                  other_elts: {
                    node: [
                      [
                        '0287e8c631aba41d88a67da49cf5f4db947fdf5a76',
                        { value: 'CoW4fTVfN6WBZ6XqT38EqLzn5raQUYkjSL4Ce7J2KsGKcFPjgUJy' },
                      ],
                      [
                        '050000000100000002',
                        { value: 'CoWQdcsnqDRRNEb1F4dRSPffKXfAnBXhhdpwo5mMyQibrXx5BKmF' },
                      ],
                    ],
                  },
                },
                {
                  other_elts: {
                    other_elts: { value: '00000000' },
                  },
                },
                {
                  inode: {
                    length: '3',
                    proofs: [
                      'CoW1wvLQ8e7wwDXM431GKDFZ5FJMTu9aGtHCY6NE9jmcH2rBn3UU',
                      'CoWVAyWNj6anjKBcoGmpEKpcURyTSvjPBJiHs8TcWruhVwNKzbiv',
                    ],
                  },
                },
                {
                  other_elts: {
                    node: [
                      [
                        '0000000000',
                        { value: 'CoWXftiVdu561NbMwSyvQ8aJ5mPNCdCiyL3e9MP5fpb12nhEa6BQ' },
                      ],
                      [
                        '0000000001',
                        { value: 'CoVjtgM389FfgNSs91E4J7mVWwvtAVkPCV8UrGR8onjUmbvAYFz1' },
                      ],
                    ],
                  },
                },
                {
                  other_elts: {
                    other_elts: {
                      value:
                        '00000000000000070000003087bdec4b6745183b7ea589128f836e037e92a8e7fbad7818c0e371840b78aca9cceb24d627c59ace2962c9b801606016',
                    },
                  },
                },
                {
                  other_elts: {
                    node: [
                      [
                        '021d4b6c14531f6582b239db26dd0375ca7172cdbe',
                        { value: 'CoWG69nMHdez4s8SahwsB2m5ZPCLqPre7Qmi5uwdJ9nhFsEX7RdN' },
                      ],
                    ],
                  },
                },
                {
                  other_elts: {
                    other_elts: { value: '00000001' },
                  },
                },
                {
                  inode: {
                    length: '8',
                    proofs: [
                      'CoV8yd9SQTRz1ic9WyiMNAfyTq3Q9Jq9iUwNPtT3Tuxm999F2GnY',
                      'CoW6PzNAZdnTY1NB1AXS5gx23BGpm66FvBW2yahScM4d8LEa3csN',
                    ],
                  },
                },
                {
                  inode: {
                    length: '4',
                    proofs: [
                      'CoWKdEp4XjM5dYvDJoYzsa9ofVRrqKrwbryd9TmKD9uTT1pVHTfb',
                      'CoUzXw8c38PwQdyMUo7ZatPL5xWRfLuAuCQFvtMJJu3T5jt9qDLq',
                    ],
                  },
                },
                {
                  inode: {
                    length: '3',
                    proofs: [
                      'CoWFsG1gkdG17aE9emaKrhEJEhc41VMpmG4mmTmjt6wPkdjfJmhj',
                      'CoV4P6w3UKpWRmbFJVL1x46YHaxCBVNqJKBYhT29W9pjK2Vum5a2',
                    ],
                  },
                },
                {
                  other_elts: {
                    node: [
                      [
                        '04cd8b6f080ffa58c748f83cc7a2afce164c1bcc53712ff5a9e50c39fb0172acda',
                        { value: 'CoW4fTVfN6WBZ6XqT38EqLzn5raQUYkjSL4Ce7J2KsGKcFPjgUJy' },
                      ],
                      [
                        '050000000000000000',
                        { value: 'CoVd2R5Mf2KMjBgCDpPYEmgQVbg7fXCcv6hmfFKUPyiNotbkKqkf' },
                      ],
                    ],
                  },
                },
                {
                  other_elts: {
                    other_elts: { value: '0032' },
                  },
                },
                {
                  other_elts: {
                    node: [
                      [
                        '050000000000000001',
                        { value: 'CoVZMPkooCZg5EDUd7PqvowuM7pknwEbcjGSaKzeCrsJUynoWKvR' },
                      ],
                    ],
                  },
                },
                {
                  other_elts: {
                    other_elts: { value: '0028' },
                  },
                },
              ],
            },
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1MDU45gNc9Ko1Q9obcz6hQkKSMiQRib6GZ',
                  change: '-2837',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '2837',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'freezer',
                    category: 'bonds',
                    contract: 'tz1Lg9iLTS8Hk6kLfTN6rrrL9gYPfsTQ9z75',
                    bond_id: { tx_rollup: 'txr1V16e1hXyVKndP4aE8cujRfryoHTiHK9fG' },
                    change: '-10000000000',
                    origin: 'block',
                  },
                  {
                    kind: 'burned',
                    category: 'tx_rollup_rejection_punishments',
                    change: '10000000000',
                    origin: 'block',
                  },
                  {
                    kind: 'minted',
                    category: 'tx_rollup_rejection_rewards',
                    change: '-5000000000',
                    origin: 'block',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz1MDU45gNc9Ko1Q9obcz6hQkKSMiQRib6GZ',
                    change: '5000000000',
                    origin: 'block',
                  },
                ],
                consumed_gas: '11533',
                consumed_milligas: '11532006',
              },
            },
          },
          {
            kind: 'tx_rollup_return_bond',
            source: 'tz2Q3efwpRvKL2Tvta8h6N5niV54Rw8iSEes',
            fee: '512',
            counter: '36',
            gas_limit: '2676',
            storage_limit: '0',
            rollup: 'txr1TeZQiQrjaEop11Lh8fpsTdyJgQvr5igST',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz2Q3efwpRvKL2Tvta8h6N5niV54Rw8iSEes',
                  change: '-512',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '512',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'freezer',
                    category: 'bonds',
                    contract: 'tz2Q3efwpRvKL2Tvta8h6N5niV54Rw8iSEes',
                    bond_id: {
                      tx_rollup: 'txr1TeZQiQrjaEop11Lh8fpsTdyJgQvr5igST',
                    },
                    change: '-10000000000',
                    origin: 'block',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz2Q3efwpRvKL2Tvta8h6N5niV54Rw8iSEes',
                    change: '10000000000',
                    origin: 'block',
                  },
                ],
                consumed_milligas: '2575028',
              },
            },
          },
        ],
        signature:
          'sigmpiJiuk1wbno2KAvxFufUkZ4JnrTuuxmVWmGVP3bPKNft8Nv8LZwkKAKtvUeBSiBEMxa5vAxcKc5FddwZvhjuZyydZeKD',
      },
    ],
  ],
};

export const blockKathmandunetResponse = {
  protocol: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
  chain_id: 'NetXi2ZagzEsXbZ',
  hash: 'BLHBkJLRFwRhs1Nvrbrf8gVnVgSxx5515iTdizVnagm97baSXNF',
  header: {
    level: 133163,
    proto: 2,
    predecessor: 'BMD5idn9K4pGGAk9EbXBgUicYzTeDJLhY2a75Xfq6WNfahiRWZy',
    timestamp: '2022-08-24T17:48:35Z',
    validation_pass: 4,
    operations_hash: 'LLobDJY3zxBWiCiHUryckHzkGSDknfKDwbALteiURoPcfkRmEfoxr',
    fitness: ['02', '0002082b', '', 'ffffffff', '00000001'],
    context: 'CoWDgrLLcSaBXq2sbZ5jwcoNkAuLmMHUurE8GTVd5SfPpRdP9MgF',
    payload_hash: 'vh3LQUfufR7Z1soGCLdFymvHyW1aHokiEzN8eov9rcgQ4zvWeCuN',
    payload_round: 1,
    proof_of_work_nonce: 'ae384fb900000000',
    liquidity_baking_toggle_vote: 'pass',
    signature:
      'signuyFG2mYvJh4WZSzVrSTBTUe7wvS9NYbFqUUqrAEp9ktwjYi8PSwEoTo2Z6cvmZAzPo9ZaSrnehuejvKpYpdXVnazSiHR',
  },
  metadata: {
    protocol: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
    next_protocol: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
    test_chain_status: {
      status: 'not_running',
    },
    max_operations_ttl: 120,
    max_operation_data_length: 32768,
    max_block_header_length: 289,
    max_operation_list_length: [
      {
        max_size: 4194304,
        max_op: 2048,
      },
      {
        max_size: 32768,
      },
      {
        max_size: 135168,
        max_op: 132,
      },
      {
        max_size: 524288,
      },
    ],
    proposer: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
    baker: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
    level_info: {
      level: 133163,
      level_position: 133162,
      cycle: 32,
      cycle_position: 2090,
      expected_commitment: false,
    },
    voting_period_info: {
      voting_period: {
        index: 32,
        kind: 'proposal',
        start_position: 131072,
      },
      position: 2090,
      remaining: 2005,
    },
    nonce_hash: null,
    deactivated: [],
    balance_updates: [
      {
        kind: 'accumulator',
        category: 'block fees',
        change: '-16643',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking rewards',
        change: '-10000000',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
        change: '10016643',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking bonuses',
        change: '-8700580',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
        change: '8700580',
        origin: 'block',
      },
    ],
    liquidity_baking_toggle_ema: 0,
    implicit_operations_results: [
      {
        kind: 'transaction',
        storage: [
          {
            int: '1',
          },
          {
            int: '332905000100',
          },
          {
            int: '100',
          },
          {
            bytes: '01e927f00ef734dfc85919635e9afc9166c83ef9fc00',
          },
          {
            bytes: '0115eb0104481a6d7921160bc982c5e0a561cd8a3a00',
          },
        ],
        balance_updates: [
          {
            kind: 'minted',
            category: 'subsidy',
            change: '-2500000',
            origin: 'subsidy',
          },
          {
            kind: 'contract',
            contract: 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5',
            change: '2500000',
            origin: 'subsidy',
          },
        ],
        consumed_milligas: '205035',
        storage_size: '4632',
      },
    ],
    consumed_milligas: '24380000',
  },
  operations: [
    [
      {
        protocol: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
        chain_id: 'NetXi2ZagzEsXbZ',
        hash: 'onyJZz2gwEmspLbZaCd2P7Ws5RF7od6j2685VYrTPDaEZhpDbvx',
        branch: 'BLeoVyx5LNjQ4ZvnpvdrgFszvSn9KPJVcqmApLaa6bn6VS1vNig',
        contents: [
          {
            kind: 'endorsement',
            slot: 2696,
            level: 133162,
            round: 0,
            block_payload_hash: 'vh2vcfabPoDQuNw6HQkZtWEzZkHe1uAmhF2sxta7varX3vriHPKD',
            metadata: {
              delegate: 'tz1ehn3nZ8PhiJ2ygtLM3Z5hVtSzU4ZKgqLZ',
              endorsement_power: 6,
            },
          },
        ],
        signature:
          'sigUqaWrk8u6zckJvLfivskoC5mkK62swsfNFq2eAuhFaghLC9LfahFMaEVag3pLjz4WjouVnYa4gekqs85kgH1s7p2hHyP3',
      },
    ],
    [],
    [],
    [
      {
        protocol: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
        chain_id: 'NetXi2ZagzEsXbZ',
        hash: 'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
        branch: 'BMNHgXcGnPQo2daGRvXnFV5DX7QfqCwpssPtaL4NWkUhuhYWwdS',
        contents: [
          {
            kind: 'increase_paid_storage',
            source: 'tz2RVendfy3AQGEBwrhXF4kwyRiJUpa7qLnG',
            fee: '349',
            counter: '108123',
            gas_limit: '1000',
            storage_limit: '0',
            amount: '2',
            destination: 'KT1Vjr5PFC2Qm5XbSQZ8MdFZLgYMzwG5WZNh',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz2RVendfy3AQGEBwrhXF4kwyRiJUpa7qLnG',
                  change: '-349',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '349',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz2RVendfy3AQGEBwrhXF4kwyRiJUpa7qLnG',
                    change: '-500',
                    origin: 'block',
                  },
                  {
                    kind: 'burned',
                    category: 'storage fees',
                    change: '500',
                    origin: 'block',
                  },
                ],
                consumed_milligas: '1000000',
              },
            },
          },
        ],
        signature:
          'sigdUXgzV3FcbhV7qUAYGCbV86xZEpcBq1S3Acng974GvG8rULLnoNkXn1dvKvfbfvz3zChYCpjcDmR8f1shjAg1uSksceRp',
      },
      {
        protocol: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
        chain_id: 'NetXi2ZagzEsXbZ',
        hash: 'oorMQ4cCHReHtUdyEqpWBjyAgu59AWYMzSP5bSwi2gSGGHBSLF5',
        branch: 'BKuq9qvyUfiZH64z7J7nxKAt7HGA1m2rgiR24XrCsAEgBh2JJd1',
        contents: [
          {
            kind: 'transaction',
            source: 'tz1ejWMc4oNPuYJcs2UBFALuzQy3jKcZxEwL',
            fee: '673',
            counter: '84777',
            gas_limit: '4224',
            storage_limit: '0',
            amount: '0',
            destination: 'KT1D7mKRckD2ZoWGcGtUvBpDxb48WxpnLu1Q',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1ejWMc4oNPuYJcs2UBFALuzQy3jKcZxEwL',
                  change: '-673',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '673',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                storage: {
                  prim: 'Unit',
                },
                consumed_milligas: '2123011',
                storage_size: '133',
              },
              internal_operation_results: [
                {
                  kind: 'event',
                  source: 'KT1D7mKRckD2ZoWGcGtUvBpDxb48WxpnLu1Q',
                  nonce: 0,
                  type: {
                    prim: 'or',
                    args: [
                      {
                        prim: 'nat',
                      },
                      {
                        prim: 'string',
                      },
                    ],
                  },
                  tag: 'event',
                  payload: {
                    prim: 'Left',
                    args: [
                      {
                        int: '10',
                      },
                    ],
                  },
                  result: {
                    status: 'applied',
                    consumed_milligas: '1000000',
                  },
                },
                {
                  kind: 'event',
                  source: 'KT1D7mKRckD2ZoWGcGtUvBpDxb48WxpnLu1Q',
                  nonce: 1,
                  type: {
                    prim: 'or',
                    args: [
                      {
                        prim: 'nat',
                        annots: ['%number'],
                      },
                      {
                        prim: 'string',
                        annots: ['%words'],
                      },
                    ],
                  },
                  tag: 'event',
                  payload: {
                    prim: 'Right',
                    args: [
                      {
                        string: 'lorem ipsum',
                      },
                    ],
                  },
                  result: {
                    status: 'applied',
                    consumed_milligas: '1000000',
                  },
                },
              ],
            },
          },
        ],
        signature:
          'sigfSTrupvjTWBW4NNXJHLyNEd6gUuD3Jzm9YZzSrH82X3somYZPpgCayRTkzmk1NwxGQCKJHLGsv7xxhVNKsgtxTqF8FEqe',
      },
    ],
  ],
};

export const blockLimanetResponse = {
  protocol: 'PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW',
  chain_id: 'NetXizpkH94bocH',
  hash: 'BM5sGpbt1rEiNmfbbo8jcQHJaUZQYwKUXe4MK6B8hcxHDeEfuJx',
  header: {
    level: 104428,
    proto: 2,
    predecessor: 'BLoSHvgQ6i64fxa2cWV2PW77FB2apjFpuMgGT9CN9YTCkLHYUEu',
    timestamp: '2022-11-02T02:02:55Z',
    validation_pass: 4,
    operations_hash: 'LLob51uyaK2Kn61U7LPTwPDGe7bEsAifAGjHaAXb5QvfwWv1nBwCC',
    fitness: ['02', '000197ec', '', 'ffffffff', '00000000'],
    context: 'CoVH2RtM1HHzLZmdbM86EkfwLEg42hmcdr4UGVmUezUDjyUEqYyj',
    payload_hash: 'vh2keAERJ5aCT7EagCysfCYcxshQiDKmX1nVPw5mMxB1C6QVZ4eP',
    payload_round: 0,
    proof_of_work_nonce: 'e45ea3f000000000',
    liquidity_baking_toggle_vote: 'off',
    signature:
      'sigPXDyg4aUDxaCQKFvsX1Bttek8M9LxSinKCfNnoFEKYBKRL2V7of9vRJUPVckdaA8GYaTcW5W3MXpvASNQX4PeHEkMSrM3',
  },
  metadata: {
    protocol: 'PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW',
    next_protocol: 'PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW',
    test_chain_status: { status: 'not_running' },
    max_operations_ttl: 120,
    max_operation_data_length: 32768,
    max_block_header_length: 289,
    max_operation_list_length: [
      { max_size: 4194304, max_op: 2048 },
      { max_size: 32768 },
      { max_size: 135168, max_op: 132 },
      { max_size: 524288 },
    ],
    proposer: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
    baker: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
    level_info: {
      level: 104428,
      level_position: 104427,
      cycle: 25,
      cycle_position: 2027,
      expected_commitment: false,
    },
    voting_period_info: {
      voting_period: { index: 5, kind: 'proposal', start_position: 102400 },
      position: 2027,
      remaining: 2068,
    },
    nonce_hash: null,
    deactivated: [],
    balance_updates: [
      {
        kind: 'minted',
        category: 'baking rewards',
        change: '-5000000',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1MeT8NACB8Q4uV9dPQ3YxXBmYgapbxQxQ5',
        change: '5000000',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking bonuses',
        change: '-4073843',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1MeT8NACB8Q4uV9dPQ3YxXBmYgapbxQxQ5',
        change: '4073843',
        origin: 'block',
      },
    ],
    liquidity_baking_toggle_ema: 583905253,
    implicit_operations_results: [
      {
        kind: 'transaction',
        storage: [
          { int: '1' },
          { int: '261067500100' },
          { int: '100' },
          { bytes: '01e927f00ef734dfc85919635e9afc9166c83ef9fc00' },
          { bytes: '0115eb0104481a6d7921160bc982c5e0a561cd8a3a00' },
        ],
        balance_updates: [
          {
            kind: 'minted',
            category: 'subsidy',
            change: '-2500000',
            origin: 'subsidy',
          },
          {
            kind: 'contract',
            contract: 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5',
            change: '2500000',
            origin: 'subsidy',
          },
        ],
        consumed_gas: '225',
        consumed_milligas: '224023',
        storage_size: '4632',
      },
    ],
    proposer_consensus_key: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
    baker_consensus_key: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
    consumed_milligas: '1100000',
  },
  operations: [
    [
      {
        protocol: 'PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW',
        chain_id: 'NetXizpkH94bocH',
        hash: 'opT8tdDhEafJu7qrzsdtwSqP1LcD9rKCNG7DoVT59vQV1JdxUu3',
        branch: 'BKtKnh7dkSaZyRbAhRL8vF4ZT1SDKRvXptBQ4pKEh6pbmKE7yf4',
        contents: [
          {
            kind: 'endorsement',
            slot: 0,
            level: 104427,
            round: 0,
            block_payload_hash: 'vh2zfP3jrzMXxabzESqDmMvSf6iStm9gW6TwsQHscCa423YbrULT',
            metadata: {
              delegate: 'tz3Q67aMz7gSMiQRcW729sXSfuMtkyAHYfqc',
              endorsement_power: 316,
              consensus_key: 'tz3Q67aMz7gSMiQRcW729sXSfuMtkyAHYfqc',
            },
          },
        ],
        signature:
          'sigRk4JF7pC3BcfqqPYqdPvv3yAuxJBfUkTMqnx6oDDm6WZZggH7DLkyJMFennY1AaXtprhHBgFtnVptfxPYGRLYLYutqggG',
      },
    ],
    [],
    [],
    [
      {
        protocol: 'PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW',
        chain_id: 'NetXizpkH94bocH',
        hash: 'opNzjyNGHBAgvsVMyezUAPSZKbFcXZmTh6GTjcTjAGtGMpVG3Eh',
        branch: 'BM6qkBbRP17B4UeQAFJBzWyPuy2bxEbKHGbUiP97xihMeeRywzW',
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
          {
            kind: 'drain_delegate',
            consensus_key: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
            delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
            destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
                  change: '-15525772494',
                  origin: 'block',
                },
                {
                  kind: 'contract',
                  contract: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
                  change: '15525772494',
                  origin: 'block',
                },
                {
                  kind: 'contract',
                  contract: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
                  change: '-156825984',
                  origin: 'block',
                },
                {
                  kind: 'contract',
                  contract: 'tz1hoyMUiJYYr4FRPMU8Z7WJzYkqgjygjaTy',
                  change: '156825984',
                  origin: 'block',
                },
              ],
            },
          },
        ],
        signature:
          'sigrsWF7LpFpUBrTdvLnKm8DMuijk1LcZovZdKZDgsaafTPZhKsvLzPFHDzZYKCy4kobkgxVL7YPGnU5qzJJBcP2cAu5HW1C',
      },
    ],
  ],
};

export const blockMondaynetResponse = {
  protocol: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
  chain_id: 'NetXrxsLyu6hTHx',
  hash: 'BLxSQZzbnjL8yWqo8fJDE6cy2ATPmqQSaLKtheFBzAz4QVTcm5h',
  header: {
    level: 8215,
    proto: 2,
    predecessor: 'BL9zTL6ejYpVwLLDNvZayft5PADYZMit3GPV3u3huQtYLgfnHFb',
    timestamp: '2022-09-14T21:08:52Z',
    validation_pass: 4,
    operations_hash: 'LLob52r9i4cfn4uarsAfQhMAQrHrTgho8snr4kAaiP3tjMptaQ5Vg',
    fitness: ['02', '00002017', '', 'ffffffff', '00000000'],
    context: 'CoWA7xHEpEUv7eLhNHQ7eq6kYQU2J87e9CiMDxHimZ7g9J8aTNCh',
    payload_hash: 'vh2abve8bjZpFr1FEEH4ySWtXV4svNb7vZ7spty8RGEAQuAPzowv',
    payload_round: 0,
    proof_of_work_nonce: 'd84ec51000000000',
    liquidity_baking_toggle_vote: 'pass',
    signature:
      'sigYFwK4Y6br6JKypqywernuthHE8oJmVBno7c9n2aM4VN5buviZFu7ABU84C3Lo2bBtrhh563k9Licq2WGoGLgqnpR7vYku',
  },
  metadata: {
    protocol: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
    next_protocol: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
    test_chain_status: {
      status: 'not_running',
    },
    max_operations_ttl: 120,
    max_operation_data_length: 32768,
    max_block_header_length: 289,
    max_operation_list_length: [
      {
        max_size: 4194304,
        max_op: 2048,
      },
      {
        max_size: 32768,
      },
      {
        max_size: 135168,
        max_op: 132,
      },
      {
        max_size: 524288,
      },
    ],
    proposer: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
    baker: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
    level_info: {
      level: 8215,
      level_position: 8214,
      cycle: 64,
      cycle_position: 22,
      expected_commitment: false,
    },
    voting_period_info: {
      voting_period: {
        index: 64,
        kind: 'proposal',
        start_position: 8192,
      },
      position: 22,
      remaining: 105,
    },
    nonce_hash: null,
    deactivated: [],
    balance_updates: [
      {
        kind: 'accumulator',
        category: 'block fees',
        change: '-1066',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking rewards',
        change: '-10000000',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
        change: '10001066',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking bonuses',
        change: '-9999238',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
        change: '9999238',
        origin: 'block',
      },
    ],
    liquidity_baking_toggle_ema: 0,
    implicit_operations_results: [
      {
        kind: 'transaction',
        storage: [
          {
            int: '1',
          },
          {
            int: '20535000100',
          },
          {
            int: '100',
          },
          {
            bytes: '01e927f00ef734dfc85919635e9afc9166c83ef9fc00',
          },
          {
            bytes: '0115eb0104481a6d7921160bc982c5e0a561cd8a3a00',
          },
        ],
        balance_updates: [
          {
            kind: 'minted',
            category: 'subsidy',
            change: '-2500000',
            origin: 'subsidy',
          },
          {
            kind: 'contract',
            contract: 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5',
            change: '2500000',
            origin: 'subsidy',
          },
        ],
        consumed_milligas: '204995',
        storage_size: '4632',
      },
    ],
    proposer_consensus_key: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
    baker_consensus_key: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
    consumed_milligas: '6009000',
  },
  operations: [
    [],
    [],
    [],
    [
      {
        protocol: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
        chain_id: 'NetXrxsLyu6hTHx',
        hash: 'oohBkdej63Xf68KKAi9KfBUKzzX9NDQ6uqUa99bgWUCjL5JBAF1',
        branch: 'BMHnqNtChbedSiBp9XPMmsMHKDmFVkHN64CP1ohyeA2imwLc3W9',
        contents: [
          {
            kind: 'reveal',
            source: 'tz1TNiFHBzrJjVkXXzigJLxGaNrcgREe7Hwa',
            fee: '358',
            counter: '1825',
            gas_limit: '1000',
            storage_limit: '0',
            public_key: 'edpkuyMNjhh4w8S7iwuKh6bJgE4cjfSEvRRAXC9qHQUE1u9avfZykW',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1TNiFHBzrJjVkXXzigJLxGaNrcgREe7Hwa',
                  change: '-358',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '358',
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
            kind: 'transfer_ticket',
            source: 'tz1TNiFHBzrJjVkXXzigJLxGaNrcgREe7Hwa',
            fee: '708',
            counter: '1826',
            gas_limit: '5009',
            storage_limit: '130',
            ticket_contents: {
              string: 'foobar',
            },
            ticket_ty: {
              prim: 'string',
            },
            ticket_ticketer: 'KT1P57aaa5RgxqMdgoUoerWg8HVwXjbP2vxS',
            ticket_amount: '2',
            destination: 'KT1BnDCAv62hqTQ3kDnMxWGKVpEgdQgX3TPm',
            entrypoint: 'default',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1TNiFHBzrJjVkXXzigJLxGaNrcgREe7Hwa',
                  change: '-708',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '708',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz1TNiFHBzrJjVkXXzigJLxGaNrcgREe7Hwa',
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
              internal_operation_results: [
                {
                  kind: 'transaction',
                  source: 'tz1TNiFHBzrJjVkXXzigJLxGaNrcgREe7Hwa',
                  nonce: 0,
                  amount: '0',
                  destination: 'KT1BnDCAv62hqTQ3kDnMxWGKVpEgdQgX3TPm',
                  parameters: {
                    entrypoint: 'default',
                    value: {
                      prim: 'Pair',
                      args: [
                        {
                          bytes: '019eee1d62435cc1a5248d89bade87b9760bd7644300',
                        },
                        {
                          prim: 'Pair',
                          args: [
                            {
                              string: 'foobar',
                            },
                            {
                              int: '2',
                            },
                          ],
                        },
                      ],
                    },
                  },
                  result: {
                    status: 'applied',
                    storage: {
                      prim: 'Some',
                      args: [
                        {
                          prim: 'Pair',
                          args: [
                            {
                              bytes: '019eee1d62435cc1a5248d89bade87b9760bd7644300',
                            },
                            {
                              prim: 'Pair',
                              args: [
                                {
                                  string: 'foobar',
                                },
                                {
                                  int: '2',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    balance_updates: [
                      {
                        kind: 'contract',
                        contract: 'tz1TNiFHBzrJjVkXXzigJLxGaNrcgREe7Hwa',
                        change: '-11000',
                        origin: 'block',
                      },
                      {
                        kind: 'burned',
                        category: 'storage fees',
                        change: '11000',
                        origin: 'block',
                      },
                    ],
                    consumed_milligas: '2785855',
                    storage_size: '90',
                    paid_storage_size_diff: '44',
                  },
                },
              ],
            },
          },
        ],
        signature:
          'sigcwwEnrdbzVXzm2hiiU8KoDK8rxgDzU5GaDj4YGounA53n2kNKQYunVeV5jfqo5hVdzcjskKW8P5WzQLPpDeAJNKB2wHmh',
      },
    ],
  ],
};

export const txRollupState = {
  last_removed_commitment_hashes: null,
  finalized_commitments: {
    next: 0,
  },
  unfinalized_commitments: {
    next: 0,
  },
  uncommitted_inboxes: {
    newest: 0,
    oldest: 0,
  },
  commitment_newest_hash: null,
  tezos_head_level: 63691,
  burn_per_byte: '0',
  allocated_storage: '4000',
  occupied_storage: '40',
  inbox_ema: 0,
  commitments_watermark: null,
};

export const txRollupInbox = {
  inbox_length: 1,
  cumulated_size: 4,
  merkle_root: 'txi3Ef5CSsBWRaqQhWj2zg51J3tUqHFD47na6ex7zcboTG5oXEFrm',
};

export const ticketBalancesResponse = [
  {
    ticketer: 'KT1X6mCNdfQZSpyU9zZw9sWckPVJyz2X8vwD',
    content_type: {
      prim: 'string',
    },
    content: {
      string: 'ticket1',
    },
    amount: '1',
  },
];

export const pendingOperationsResponse = {
  applied: [
    {
      hash: 'onjTGvtnaudo1o5sfTe51XEumhsENAhM7oMzhvsSXzZFXNcj1LE',
      branch: 'BLvb5tzmepwJkxhRYCnnQeYXqRWhUvdmx4NbpVK9w4nkM6tdXEr',
      contents: [
        {
          kind: 'preendorsement',
          slot: 14,
          level: 128135,
          round: 0,
          block_payload_hash: 'vh3Tk5KEy88s4scEbJM1n6vzYdYSn3PNmsH5uSP4zoLccNVyXAZd',
        },
      ],
      signature:
        'sigNWXUeYUraaGi1GrxjrqKTfk7KF8xRG4pABA1qeZi8bQWRmcSmDWD6BehCNC1qNDMgQkf3JdEFHKuomToBza2iGucg9SuC',
    },
  ],
  refused: [
    {
      hash: 'ongFJ3rNnTwratXX2mTHN8MLww2rG11BeJwiPGxr2z2KdESZKKG',
      protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
      branch: 'BLf8hVJk9kK539kTKQ9PHFjtet3nJuAKYGqCqvFuHTZQWavrP7u',
      contents: [
        {
          kind: 'reveal',
          source: 'tz2GeK37F1ThiGwamtxUykBuWqamWc7UcmHN',
          fee: '374',
          counter: '54971',
          gas_limit: '1100',
          storage_limit: '0',
          public_key: 'sppk7c9pb7WyLmaw2JwHyH2PYeXcmALCnGwHzVCTfzx33XMV8bW3aT7',
        },
        {
          kind: 'origination',
          source: 'tz2GeK37F1ThiGwamtxUykBuWqamWc7UcmHN',
          fee: '544',
          counter: '54972',
          gas_limit: '600000',
          storage_limit: '319',
          balance: '0',
          script: {
            code: [
              { prim: 'parameter', args: [{ prim: 'string' }] },
              { prim: 'storage', args: [{ prim: 'string' }] },
              {
                prim: 'code',
                args: [
                  [
                    { prim: 'CAR' },
                    { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'Hello ' }] },
                    { prim: 'CONCAT' },
                    { prim: 'NIL', args: [{ prim: 'operation' }] },
                    { prim: 'PAIR' },
                  ],
                ],
              },
            ],
            storage: { string: 'test' },
          },
        },
      ],
      signature:
        'sigaD9KjwZXtfhUEpxGirsvNWyScLKQVFQM9kkFB4sTgixfwnJD2D9wt2Km1CM5o2ExGGRTZGLxAr1dZDESurwJusiuHKQvZ',
      error: [
        {
          kind: 'permanent',
          id: 'proto.016-PtMumbai.prefilter.fees_too_low',
        },
      ],
    },
  ],
  outdated: [
    {
      hash: 'oneJE697j4ZNCnhoEsbyPyj4Y5MmyQh4xX6FU3HEGzKnaJkdL5B',
      protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
      branch: 'BLf4UgJixDsXcRnirtBzfst8uzzkcpbBjXQuMmzwwJwD75gh3GU',
      contents: [
        {
          kind: 'preendorsement',
          slot: 15,
          level: 128095,
          round: 0,
          block_payload_hash: 'vh3Xu8Y1EQDMGFYaLXiau3sLukEWGjs3zHW7jynH1m7RaLTqXJpw',
        },
      ],
      signature:
        'sigsVPdVAmQZrCeucDX5QNjz3H4jNWGfVEZRhjXBGg8ZSxWRK2cGdgUCdyDF47DctaJXqAbMwMHB24En9qWj4mEaTwWMC4SN',
      error: [
        {
          kind: 'Preendorsement',
          id: 'proto.016-PtMumbai.validate.consensus_operation_for_old_level',
          expected: 128096,
          provided: 128095,
        },
      ],
    },
  ],
  branch_refused: [],
  branch_delayed: [],
  unprocessed: [],
};

export const ticketUpdatesResponse = {
  protocol: 'PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW',
  chain_id: 'NetXizpkH94bocH',
  hash: 'BLAoXLidLrRnUQaUNPanuiaGTS3Ce2azZQysz2mMTCUnFg2799j',
  header: {},
  metadata: {},
  operations: [
    [
      {
        protocol: 'PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW',
        chain_id: 'NetXizpkH94bocH',
        hash: 'onrYwrpBkF54XTGkxQBUhEcVhgqoava49oWMo5DmGgrh3yqodYN',
        branch: 'BKmKts5CAQ2oLv3UvB3jWTMNHKsbxSofMeaNGLWA8WAavY9jqWb',
        contents: [
          {
            kind: 'transaction',
            source: 'tz1PVMKUxmFBB2c3NqKTRi7K7TKgfNYP97Ly',
            fee: '2122',
            counter: '76',
            gas_limit: '18472',
            storage_limit: '929',
            amount: '0',
            destination: 'KT1JoRgUcR6NApwMLnBZ2pehCzp8tR4HtkHj',
            parameters: {
              entrypoint: 'exchange_tickets',
              value: {
                int: '2',
              },
            },
            metadata: {
              operation_result: {
                status: 'applied',
                storage: {
                  prim: 'Pair',
                  args: [
                    {
                      prim: 'Pair',
                      args: [
                        {
                          prim: 'None',
                        },
                        [],
                      ],
                    },
                    {
                      prim: 'Pair',
                      args: [
                        {
                          bytes: '00002a3c4ef8b90e40d0a0f3d793e78da4d40ff7ab05',
                        },
                        {
                          bytes: '016a41f23d91041e57a4cf22d0ebf27bba7bc67b2c00',
                        },
                      ],
                    },
                  ],
                },
                ticket_updates: [
                  {
                    ticket_token: {
                      ticketer: 'KT1JGcC8DuWHcShu6XvtfgKVnV2zcYsZ4TVH',
                      content_type: {
                        prim: 'unit',
                      },
                      content: {
                        prim: 'Unit',
                      },
                    },
                    updates: [
                      {
                        account: 'KT1JoRgUcR6NApwMLnBZ2pehCzp8tR4HtkHj',
                        amount: '-2',
                      },
                    ],
                  },
                ],
                consumed_milligas: '4077693',
                storage_size: '5600',
              },
              internal_operation_results: [
                {
                  kind: 'transaction',
                  source: 'KT1JGcC8DuWHcShu6XvtfgKVnV2zcYsZ4TVH',
                  nonce: 1,
                  amount: '0',
                  destination: 'KT1JoRgUcR6NApwMLnBZ2pehCzp8tR4HtkHj',
                  parameters: {
                    entrypoint: 'receive_cards',
                    value: [],
                  },
                  result: {
                    status: 'applied',
                    ticket_receipt: [
                      {
                        ticket_token: {
                          ticketer: 'KT1JGcC8DuWHcShu6XvtfgKVnV2zcYsZ4TVH',
                          content_type: {
                            prim: 'string',
                          },
                          content: {
                            string: 'Ferosinge',
                          },
                        },
                        updates: [
                          {
                            account: 'KT1JoRgUcR6NApwMLnBZ2pehCzp8tR4HtkHj',
                            amount: '1',
                          },
                        ],
                      },
                    ],
                    consumed_milligas: '7372756',
                    storage_size: '6015',
                    paid_storage_size_diff: '380',
                  },
                },
              ],
            },
          },
        ],
        signature:
          'sigXx1HE97LT5dFaBDGyRZJQvGes8zgTwrcbHidn93VjCAoULiGiqFA2ArzMW89Pt81TuEP5SZoqKpSGfg6qhjhEgQ5Tza9H',
      },
    ],
  ],
};

export const smartRollupOriginateResponse = {
  protocol: 'PtMumbaiiFFEGbew1rRjzSPyzRbA51Tm3RVZL5suHPxSZYDhCEc',
  chain_id: 'NetXQw6nWSnrJ5t',
  hash: 'BLFkxJtgGauWp3PXUiX2PuFfEj96WdP94Mtv2nyHcGkEFtvKr6Q',
  header: {},
  metadata: {},
  operations: [
    [],
    [
      {
        protocol: 'PtMumbaiiFFEGbew1rRjzSPyzRbA51Tm3RVZL5suHPxSZYDhCEc',
        chain_id: 'NetXQw6nWSnrJ5t',
        hash: 'ooMhfCwjiBzaCcYSxo1kyk4tQMgeDwu22NwPdjU8Yvaybyn26z5',
        branch: 'BLsmwYwwt1GsoQ2ZSzqYncwbpyhVS52UzsQpEMgbpgzuKCYYw9s',
        contents: [
          {
            kind: 'smart_rollup_originate',
            source: 'tz1NyHPL2CidRquW3a9zPGde59YYtMDyyzCg',
            fee: '1497',
            counter: '19783',
            gas_limit: '2849',
            storage_limit: '6572',
            pvm_kind: 'wasm_2_0_0',
            kernel:
              '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a',
            origination_proof:
              '0300020c4a316fa1079bfc23dac5ecc609ab10e26490e378a81e774c51176040bea18030fab8a3adde4b553c4d391e9cd19ee13b17941c1f49c040d621bbfbea964993810764757261626c658108726561646f6e6c79d00b749948da9186d29aed2f9327b46793f18b1e6499c40f0ddbf0bf785e85e2e9',
            parameters_ty: {
              prim: 'bytes',
            },
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1NyHPL2CidRquW3a9zPGde59YYtMDyyzCg',
                  change: '-1497',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '1497',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz1NyHPL2CidRquW3a9zPGde59YYtMDyyzCg',
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
                address: 'sr1K3AUoYanTUup53MCb8DkbvLsiAmFuXfFm',
                genesis_commitment_hash: 'src14Khe1dnFbwrtTSEi4XWxxM7ej7L29YmduJhQY7U24Y523dmMtw',
                consumed_milligas: '2748269',
                size: '6552',
              },
            },
          },
        ],
        signature:
          'sigiKU2RGwT94sQBn4EFFy4SSVgYSGbULKzUneRyi8rURMg94uAJyYPgCpEfcjR8mkaSAoYnRCxqmit8XzVoHdbxGKoNfXRB',
      },
    ],
  ],
};

export const smartRollupAddMessagesResponse = {
  protocol: 'PtMumbaiiFFEGbew1rRjzSPyzRbA51Tm3RVZL5suHPxSZYDhCEc',
  chain_id: 'NetXQw6nWSnrJ5t',
  hash: 'BLFkxJtgGauWp3PXUiX2PuFfEj96WdP94Mtv2nyHcGkEFtvKr6Q',
  header: {},
  metadata: {},
  operations: [
    [],
    [
      {
        protocol: 'PtMumbaiiFFEGbew1rRjzSPyzRbA51Tm3RVZL5suHPxSZYDhCEc',
        chain_id: 'NetXQw6nWSnrJ5t',
        hash: 'op3GFxBQArsgC3eHjEiw4Qp31jHrprKfftcgwibKAwnANpzWncG',
        branch: 'BL7USLDrUeuMzDUX6PdxuCbhngMYCcnmy9WFuotiVRmdBftZeDv',
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
      },
    ],
  ],
};

export const smartRollupExecuteOutboxMessageResponse = {
  protocol: 'PtMumbaiiFFEGbew1rRjzSPyzRbA51Tm3RVZL5suHPxSZYDhCEc',
  chain_id: 'NetXQw6nWSnrJ5t',
  hash: 'BLFkxJtgGauWp3PXUiX2PuFfEj96WdP94Mtv2nyHcGkEFtvKr6Q',
  header: {},
  metadata: {},
  operations: [
    [],
    [
      {
        protocol: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
        chain_id: 'NetXxkAx4woPLyu',
        hash: 'opKmyxpe2XWDbynt3YPSouVpf55ChKZxwCradz6AYJ6rMFFEsRZ',
        branch: 'BKqyTFKbU7bMrnN393YCBJ28quXG9zMwuPq61Z5ce4gVjsAgZmk',
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
      },
    ],
  ],
};

export const smartRollupCementResponse = {
  protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
  chain_id: 'NetXgbcrNtXD2yA',
  hash: 'BLs7YR6xRt4pBu7f9B8ndikSU7KwjqAAFkd8mMWBxgLVidY3Z62',
  header: {},
  metadata: {},
  operations: [
    [
      {
        protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
        chain_id: 'NetXgbcrNtXD2yA',
        hash: 'oohRSufw6kfFxX1kA3zWqzQMbo8q69DGY9ACvLW5FpvWxPYKxeg',
        branch: 'BMLa28j2y5QjbVHpkUpdZGg1Sddfa99YXJNCagQ9dhzK6d3dHCb',
        contents: [
          {
            kind: 'smart_rollup_cement',
            source: 'tz1gCe1sFpppbGGVwCt5jLRqDS9FD1W4Qca4',
            fee: '922',
            counter: '41267',
            gas_limit: '6432',
            storage_limit: '0',
            rollup: 'sr1AE6U3GNzE8iKzj6sKS5wh1U32ogeULCoN',
            commitment: 'src13w2EBEZmVg4jsDd5PfYNakBRZ6GqSGDgWLz7EHZGeeG1gm7HT5',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1gCe1sFpppbGGVwCt5jLRqDS9FD1W4Qca4',
                  change: '-922',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '922',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                consumed_milligas: '6331052',
                inbox_level: 197111,
              },
            },
          },
        ],
        signature:
          'sigjozz364ebVDu7w8upHMfYwGShKHVpAGSi8LjaX7bzU6eipEW8qZ5ctiLeX8PYDvpCzgwQy7SW4HbcWbsH5oQyjWZk7HZy',
      },
    ],
  ],
};

export const smartRollupPublishResponse = {
  protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
  chain_id: 'NetXgbcrNtXD2yA',
  hash: 'BL9UBPLykShAAvAebxCiZxELFjSJBxhbQXC12pfZb2ddwtCa1XU',
  header: {},
  metadata: {},
  operations: [
    [
      {
        protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
        chain_id: 'NetXgbcrNtXD2yA',
        hash: 'opaTRLSsdqtd8APeDHqU3BxvqYDg4Lor3roR2cdh3V3Hv1VXucm',
        branch: 'BM8ZBBpLnURFuRB1Wd6s7Z6iN3LiddUkKM4vsTS3LgqSmFMtCLE',
        contents: [
          {
            kind: 'smart_rollup_publish',
            source: 'tz1gCe1sFpppbGGVwCt5jLRqDS9FD1W4Qca4',
            fee: '964',
            counter: '41266',
            gas_limit: '6418',
            storage_limit: '0',
            rollup: 'sr1AE6U3GNzE8iKzj6sKS5wh1U32ogeULCoN',
            commitment: {
              compressed_state: 'srs13FywcbcZV9VvHxdVkYK83Ch4477cqHMgM8d5oT955yf4XXMvKS',
              inbox_level: 197151,
              predecessor: 'src12i7dL2z9VbgshFDdGFP5TPBoJu6WnZNWJXGa1QQgPTErVPPtd8',
              number_of_ticks: '880000000000',
            },
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1gCe1sFpppbGGVwCt5jLRqDS9FD1W4Qca4',
                  change: '-964',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '964',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                consumed_milligas: '6317837',
                staked_hash: 'src13TanyZ7RvSULqVb2tjx1zRVw2jyJC2ToHLz1ZKg38sZ4HBYdSN',
                published_at_level: 197154,
                balance_updates: [],
              },
            },
          },
        ],
        signature:
          'sigiYrQFjQLnYe94Vc9VH1jGEkfSAsBGkZzBVL8jLgBK88vhbLM6fBD2x24wBhBdN718WRRTSMBqCGR7Zp9Z5eDmDotgGaTu',
      },
      {
        protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
        chain_id: 'NetXgbcrNtXD2yA',
        hash: 'onjnz6RP5FPXafHfWupSb9Hv3uJZt5BGpVHPTisJkLsYEjP114H',
        branch: 'BKyGmNai1eFrUv3BBMz1ZNhtmMVW7KQH9x8DEj2egDZEH86ajno',
        contents: [
          {
            kind: 'smart_rollup_publish',
            source: 'tz1QD39GBmSzccuDxWMevj2gudiTX1pZL5kC',
            fee: '956',
            counter: '32544',
            gas_limit: '7298',
            storage_limit: '0',
            rollup: 'sr1LhGA2zC9VcYALSifpRBCgDiQfDSQ6bb4x',
            commitment: {
              compressed_state: 'srs12r6jebz4VTuP1C58mHGzezqFQdV6n5pdaqEamDo4FvD9omn9YJ',
              inbox_level: 41806,
              predecessor: 'src12rCbiTAvYntPQXcMoqdNh6ZXXBmfxzhaxZsxsbRKGC7bE3L1mD',
              number_of_ticks: '880000000000',
            },
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1QD39GBmSzccuDxWMevj2gudiTX1pZL5kC',
                  change: '-956',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '956',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                consumed_milligas: '7197891',
                staked_hash: 'src14ErSMhBhf3Hi6isN3cEdR4RgxT5egSjQYtgHEc5NP9qVFgmcpE',
                published_at_level: 41809,
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz1QD39GBmSzccuDxWMevj2gudiTX1pZL5kC',
                    change: '-10000000000',
                    origin: 'block',
                  },
                  {
                    kind: 'freezer',
                    category: 'bonds',
                    contract: 'tz1QD39GBmSzccuDxWMevj2gudiTX1pZL5kC',
                    bond_id: {
                      smart_rollup: 'sr1LhGA2zC9VcYALSifpRBCgDiQfDSQ6bb4x',
                    },
                    change: '10000000000',
                    origin: 'block',
                  },
                ],
              },
            },
          },
        ],
        signature:
          'sigosbVhqFLPBoXUhtjwZ7UBDq4veP1pGECDm2nc7iviBE8gqmzGFgh9tPMviTDhETd4rjCwcRCCMwEL5hBu3tfgNJcydnrS',
      },
    ],
  ],
};

export const smartRollupRefuteResponse = {
  protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
  chain_id: 'NetXgbcrNtXD2yA',
  hash: 'BMRMq4e7QgU2xw5hHyFtDgv4rZCGCRbF9Z8FhWoAwmprSsJKPGx',
  header: {},
  operations: [
    [
      {
        protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
        chain_id: 'NetXgbcrNtXD2yA',
        hash: 'oofTxRxHWQCYo9B4vmpLY7FZfQXrH9s1n7rRU7wHjazhrqVu2oJ',
        branch: 'BLDgHuXsD2qtEPy8SYcYCk1Wt2uDdDXUYXYmbfX6g1s1an8L5u6',
        contents: [
          {
            kind: 'smart_rollup_refute',
            source: 'tz1ZpuBypK6G754crXDZyoMPaVPoBmBsPda2',
            fee: '2096',
            counter: '32553',
            gas_limit: '6299',
            storage_limit: '0',
            rollup: 'sr1LhGA2zC9VcYALSifpRBCgDiQfDSQ6bb4x',
            opponent: 'tz1QD39GBmSzccuDxWMevj2gudiTX1pZL5kC',
            refutation: {
              refutation_kind: 'move',
              choice: '176000000003',
              step: {
                pvm_step:
                  '03000298e4e3d5c88da366e885edf675ffd7a5087c8e0a2fcd508e7951113fe4c1491810067c06a78b88cb7c3e60c56b47ba9e14c922dbdbd4811ac6fee80a309620630005820764757261626c6582066b65726e656cd07d20c53bdd5b536a6be9c4cdad16e69a9af40b93a6564655fffd88bba050519008726561646f6e6c7982066b65726e656cd0a645771d9d5228a31312b282119c596699ccb6b60b93d759c2072a493ddbb5740c7761736d5f76657273696f6e8101408208636f6e74656e7473810130c10200322e302e30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066c656e677468c008000000000000000503746167c00800000004536f6d650003810370766d00050004000381166f7574626f785f76616c69646974795f706572696f64c00400013b0082136c6173745f746f705f6c6576656c5f63616c6cc00680c0abd38f05196d6178696d756d5f7265626f6f74735f7065725f696e707574c002e80781146f7574626f785f6d6573736167655f6c696d6974c002a401810c6d61785f6e625f7469636b73c00580dc9afd28820576616c7565810370766d8107627566666572738205696e7075740003810468656164c001008208636f6e74656e7473d06e2c0a5b371a53e76a9b7f221a5baa67170b3f9f43205fb06c0649123cec2358066c656e677468c00103066f75747075740004820132810a6c6173745f6c6576656cc0040000a33f0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f786573d0ccbff4c181451166adb153f7a1631e9f036832f8e5c82acd8e8c12876eeeda870134810d6d6573736167655f6c696d6974c002a401047761736d00048205696e707574c0050000a33f0203746167c00b0000000770616464696e67820c63757272656e745f7469636bc00683c0abd38f050e7265626f6f745f636f756e746572c002e907',
              },
            },
          },
        ],
        signature:
          'sigQYS3D4Ppabx7MhsmJyHkQUo9cmAfieSykZXWnGmvVbn6W4cQvVvxbRXDPSnaNVn72N2ih9QwovsPw7Cv1eoELapdNjLTB',
      },
      {
        protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
        chain_id: 'NetXgbcrNtXD2yA',
        hash: 'opUUHJwTXLDe2jMwvTWtC3bwoEQukhBjdPiYa5Ri1qBo7TiYJpq',
        branch: 'BMJcT8gh5PgoTvjWi6SQSUGn7gbx3Bb2rSKcdJQKB9PbzpS7FvH',
        contents: [
          {
            kind: 'smart_rollup_refute',
            source: 'tz1Qn5AXWB5vYPgzDXsunDbZ7tTUp9cFDaRp',
            fee: '943',
            counter: '25002',
            gas_limit: '6109',
            storage_limit: '0',
            rollup: 'sr1Ce7znpA1ea2YZca3v1CefxqXMhqYgDEXR',
            opponent: 'tz1VN3J6DyH712W1y13Uu1N8fxkt8RvMyqzm',
            refutation: {
              refutation_kind: 'start',
              player_commitment_hash: 'src14Liog4xxPoZ55AgpBpeDweFSxHK6b3zbybhp7ChsWbM9g1Jsrd',
              opponent_commitment_hash: 'src12q2zZyxuK5UeYPQYSutA6RPMv7sZDtJ7oAWxAytuJC3rjvWct6',
            },
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1Qn5AXWB5vYPgzDXsunDbZ7tTUp9cFDaRp',
                  change: '-943',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '943',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                consumed_milligas: '6008940',
                game_status: 'ongoing',
                balance_updates: [],
              },
            },
          },
        ],
        signature:
          'sigg9W1bDVuvKgs7WDq9Q4wKp2oTtMwWsm1tt7khCYYCa4PZ3fvsWUWktuAR8SyTzmywKmBWX752VcDb28JzHUmYJ7De94Kt',
      },
      {
        protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
        chain_id: 'NetXgbcrNtXD2yA',
        hash: 'onqrLmUkjEowxhiS3t2CmxBCKQAEUf3PA4d8RD3zja9v2PtU11a',
        branch: 'BMbQxrYG4uUmjqy2Dht5FUeskoiQcebXqN46H9kt26hSzZ5W3Qs',
        contents: [
          {
            kind: 'smart_rollup_refute',
            source: 'tz1QD39GBmSzccuDxWMevj2gudiTX1pZL5kC',
            fee: '1989',
            counter: '32546',
            gas_limit: '4333',
            storage_limit: '0',
            rollup: 'sr1LhGA2zC9VcYALSifpRBCgDiQfDSQ6bb4x',
            opponent: 'tz1ZpuBypK6G754crXDZyoMPaVPoBmBsPda2',
            refutation: {
              refutation_kind: 'move',
              choice: '0',
              step: [
                {
                  state: 'srs11y1ZCJfeWnHzoX3rAjcTXiphwg8NvqQhvishP3PU68jgSREuk6',
                  tick: '0',
                },
                {
                  state: 'srs12ti4nRqiqahBZedqjgnFx9ZK88KkSgpYD8ns5Q41UMEXGg9w3b',
                  tick: '22000000000',
                },
                {
                  state: 'srs12zdMUHiLiqTAuN81f1NS3rgD1M7fqUtMq4RpWq3wf3QDvsPCxa',
                  tick: '44000000000',
                },
              ],
            },
          },
        ],
        signature:
          'sigojctsjFdB6nv51JNAyRdANvbnSB5NyrfNq5KBnov58Hcqi9d1CHPWYwEJeQgBjjJv5vgQJC37tKMSUJZZoY4pPQj6A2X5',
      },
    ],
  ],
};

export const smartRollupRecoverBondResponse = {
  protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
  chain_id: 'NetXgbcrNtXD2yA',
  hash: 'BLxusPoX4vzCKAc9qmfS4myFs8KKEJpvwgAuMrccqqPXcn8Rxon',
  header: {},
  metadata: {},
  operations: [
    [
      {
        protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
        chain_id: 'NetXgbcrNtXD2yA',
        hash: 'opWkyTZEwh5929VqXC4BZgrBSRQ7JvomNTv71rdkx1QAiRLpYAu',
        branch: 'BL5EYnuHPXMTq9s1HR8CcFWkgNHCvoZyVQCU2H2DjSudr6GXgXf',
        contents: [
          {
            kind: 'smart_rollup_recover_bond',
            source: 'tz1bTS4QDBnpQPmMPNM3rn7jN1hevkWDHSKw',
            fee: '1000000',
            counter: '25156',
            gas_limit: '4016',
            storage_limit: '0',
            rollup: 'sr1EYxm4fQjr15TASs2Q7PgZ1LqS6unkZhHL',
            staker: 'tz1bTS4QDBnpQPmMPNM3rn7jN1hevkWDHSKw',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1bTS4QDBnpQPmMPNM3rn7jN1hevkWDHSKw',
                  change: '-1000000',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '1000000',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'freezer',
                    category: 'bonds',
                    contract: 'tz1bTS4QDBnpQPmMPNM3rn7jN1hevkWDHSKw',
                    bond_id: {
                      smart_rollup: 'sr1EYxm4fQjr15TASs2Q7PgZ1LqS6unkZhHL',
                    },
                    change: '-10000000000',
                    origin: 'block',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz1bTS4QDBnpQPmMPNM3rn7jN1hevkWDHSKw',
                    change: '10000000000',
                    origin: 'block',
                  },
                ],
                consumed_milligas: '3915240',
              },
            },
          },
        ],
        signature:
          'sigPbtnebwMZD1CZUEfFnhcjGuhyLhX2WPEFvQEFKaD6DKeYjMSBD6pc4UkR4zkAw5KdifSH7QdJ7wg9CmsruSi9cUGvqEap',
      },
    ],
  ],
};

export const smartRollupTimeoutResponse = {
  protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
  chain_id: 'NetXgbcrNtXD2yA',
  hash: 'BM5txTKWoRptQ7k8M4hF2SjLQjz7ezriNfaHZQZxNjHsqzESjMu',
  header: {},
  metadata: {},
  operations: [
    [
      {
        protocol: 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
        chain_id: 'NetXgbcrNtXD2yA',
        hash: 'opZMSbsYYSL1tMKYxgPoDvtaehAt24PSbwuNeQo8ry52KpWwzqa',
        branch: 'BLpiGot997JRMKyrYoP8MmjVMWHHXMiLj17gue86uNaRnip8jux',
        contents: [
          {
            kind: 'smart_rollup_timeout',
            source: 'tz1TecRhYLVV9bTKRKU9g1Hhpb1Ymw3ynzWS',
            fee: '753',
            counter: '23077',
            gas_limit: '4647',
            storage_limit: '0',
            rollup: 'sr1QZkk1swognQW3dmiXvga3wVkEgBq7QFjE',
            stakers: {
              alice: 'tz1TecRhYLVV9bTKRKU9g1Hhpb1Ymw3ynzWS',
              bob: 'tz1iFnSQ6V2d8piVMPMjtDNdkYNMaUfKwsoy',
            },
          },
        ],
        signature:
          'sigN53ibLsMQAnkeE7EQZY9ZFkiBgtdsLKtsPdswdvGHU4kPAMh3Arz2fFDGKT3EyKHuYy5G9T6pJtTdfkRuWpN2fgvmH1Pr',
      },
    ],
  ],
};
