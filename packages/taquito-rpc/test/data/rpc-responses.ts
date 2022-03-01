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
  tokens_per_roll: new BigNumber(8000000000),
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

export const delegatesIthacanetSample = {
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

export const blockIthacanetSample = {
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
