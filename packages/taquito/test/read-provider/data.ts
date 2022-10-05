import BigNumber from 'bignumber.js';

/* sample responses from the RPC */

export const constantsRpc = {
  proof_of_work_nonce_size: 8,
  nonce_length: 32,
  max_anon_ops_per_block: 132,
  max_operation_data_length: 32768,
  max_proposals_per_delegate: 20,
  max_micheline_node_count: 50000,
  max_micheline_bytes_limit: 50000,
  max_allowed_global_constants_depth: 10000,
  cache_layout: [new BigNumber('100000000')],
  michelson_maximum_type_size: 2001,
  preserved_cycles: 5,
  blocks_per_cycle: 8192,
  blocks_per_commitment: 64,
  blocks_per_roll_snapshot: 512,
  blocks_per_voting_period: 40960,
  time_between_blocks: [new BigNumber('60'), new BigNumber('40')],
  endorsers_per_block: 256,
  hard_gas_limit_per_operation: new BigNumber('1040000'),
  hard_gas_limit_per_block: new BigNumber('5200000'),
  proof_of_work_threshold: new BigNumber('70368744177663'),
  tokens_per_roll: new BigNumber('8000000000'),
  seed_nonce_revelation_tip: new BigNumber('125000'),
  origination_size: 257,
  block_security_deposit: new BigNumber('640000000'),
  endorsement_security_deposit: new BigNumber('2500000'),
  baking_reward_per_endorsement: [new BigNumber('78125'), new BigNumber('11719')],
  endorsement_reward: [new BigNumber('78125'), new BigNumber('52083')],
  cost_per_byte: new BigNumber('250'),
  hard_storage_limit_per_operation: new BigNumber('60000'),
  quorum_min: 2000,
  quorum_max: 7000,
  min_proposal_quorum: 500,
  initial_endorsers: 192,
  delay_per_missing_endorsement: new BigNumber('4'),
  minimal_block_delay: new BigNumber('30'),
  liquidity_baking_subsidy: new BigNumber('2500000'),
  liquidity_baking_sunset_level: 2244609,
  liquidity_baking_escape_ema_threshold: 1000000,
};

export const contractCodeSample = [
  {
    prim: 'parameter',
    args: [
      {
        prim: 'or',
        args: [
          {
            prim: 'address',
            annots: ['%addOwner'],
          },
          {
            prim: 'string',
            annots: ['%storeValue'],
          },
        ],
      },
    ],
  },
  {
    prim: 'storage',
    args: [
      {
        prim: 'pair',
        args: [
          {
            prim: 'set',
            args: [
              {
                prim: 'address',
              },
            ],
            annots: ['%owners'],
          },
          {
            prim: 'string',
            annots: ['%storedValue'],
          },
        ],
      },
    ],
  },
  {
    prim: 'code',
    args: [
      [
        [
          [
            {
              prim: 'DUP',
            },
            {
              prim: 'CAR',
            },
            {
              prim: 'DIP',
              args: [
                [
                  {
                    prim: 'CDR',
                  },
                ],
              ],
            },
          ],
        ],
        {
          prim: 'SWAP',
        },
        {
          prim: 'DUP',
        },
        {
          prim: 'DUG',
          args: [
            {
              int: '2',
            },
          ],
        },
        {
          prim: 'SENDER',
        },
        {
          prim: 'SWAP',
        },
        {
          prim: 'CAR',
        },
        {
          prim: 'SWAP',
        },
        {
          prim: 'MEM',
        },
        {
          prim: 'IF',
          args: [
            [],
            [
              {
                prim: 'PUSH',
                args: [
                  {
                    prim: 'string',
                  },
                  {
                    string: 'failed assertion',
                  },
                ],
              },
              {
                prim: 'FAILWITH',
              },
            ],
          ],
        },
        {
          prim: 'IF_LEFT',
          args: [
            [
              {
                prim: 'SWAP',
              },
              {
                prim: 'DUP',
              },
              {
                prim: 'DUG',
                args: [
                  {
                    int: '2',
                  },
                ],
              },
              {
                prim: 'CDR',
              },
              {
                prim: 'DIG',
                args: [
                  {
                    int: '2',
                  },
                ],
              },
              {
                prim: 'CAR',
              },
              {
                prim: 'DIG',
                args: [
                  {
                    int: '2',
                  },
                ],
              },
              {
                prim: 'PUSH',
                args: [
                  {
                    prim: 'bool',
                  },
                  {
                    prim: 'True',
                  },
                ],
              },
              {
                prim: 'SWAP',
              },
              {
                prim: 'UPDATE',
              },
              {
                prim: 'PAIR',
              },
              {
                prim: 'NIL',
                args: [
                  {
                    prim: 'operation',
                  },
                ],
              },
              {
                prim: 'PAIR',
              },
            ],
            [
              {
                prim: 'SWAP',
              },
              {
                prim: 'CAR',
              },
              {
                prim: 'PAIR',
              },
              {
                prim: 'NIL',
                args: [
                  {
                    prim: 'operation',
                  },
                ],
              },
              {
                prim: 'PAIR',
              },
            ],
          ],
        },
      ],
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const storageType = contractCodeSample.find((x) => x.prim === 'storage')!.args[0] as any;

export const contractStorage = {
  prim: 'Pair',
  args: [
    [
      {
        bytes: '00000e5b9b05c6a04a01254bc879eb50bb1bed651aff',
      },
    ],
    {
      string: '1feb23303c012f0c1b56b2b9fe2c85c9fd725662aec3c35ea835c0588deb8f2e',
    },
  ],
};

export const blockHeader = {
  protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
  chain_id: 'NetXdQprcVkpaWU',
  hash: 'BMLSgpbkkpjwPcz4V73DBehuyUiusANELHKPMiQhsb9psm5gTWD',
  level: 2100696,
  proto: 11,
  predecessor: 'BKqt4gUvfccTEKLwo4j75aepBbgh27h8q7RfrULHu5Cmuv2GMr2',
  timestamp: '2022-02-08T16:49:34Z',
  validation_pass: 4,
  operations_hash: 'LLoap4wCgvDCFEN3hmqkhzYCbT4Cce3FzWFiiM9GGgeEEvonk2Emo',
  fitness: ['01', '0000000000160dd8'],
  context: 'CoUokoYDnP28w2dQrhjAeiYhK8KHppdXPbdb4J2hoftVTGbNJ72U',
  priority: 0,
  proof_of_work_nonce: '0e7a0e9ae2da0300',
  liquidity_baking_escape_vote: false,
  signature:
    'sigoCZ1nQJuzMTCpB18tWFhdNRvFH9EvbhCdWJqNzxeFsSWsKn5Rw3Ha3upgTWEctzcAPHwK22jNtNhBMao3DapmeACDS6k6',
};

export const contractResponse = {
  balance: '51348935600',
  counter: '161327',
};

export const bigmapValue = {
  prim: 'Pair',
  args: [
    [],
    {
      int: '100',
    },
  ],
};

export const saplingState = {
  root: 'fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e',
  commitments_and_ciphertexts: [],
  nullifiers: [],
};

export const contractEntrypoints = {
  entrypoints: {
    increment: {
      prim: 'int',
    },
    decrement: {
      prim: 'int',
    },
  },
};

export const blockResponse = {
  protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
  chain_id: 'NetXZSsxBpMQeAT',
  hash: 'BLSodLFPzE4dDUwHx3PPD8uuJmN2Xx1sGdvTGazmVTvX3H53KLi',
  header: {
    level: 545281,
    proto: 2,
    predecessor: 'BLMZNGicumHeJz3QjMifcvhXzXTdNWs26ztSFshmGd5dxEokEJC',
    timestamp: '2022-02-19T01:04:28Z',
    validation_pass: 4,
    operations_hash: 'LLoZdYVCUZwLrGcTb1ThFvMSgH9cdHT6jkCgirnbUs2bwdoELL49y',
    fitness: ['01', '0000000000085220'],
    context: 'CoVa12jHhvVeEbV2AXM45PsYSuP45JJ74oSjLP5S3H72CPoCKcHQ',
    priority: 0,
    proof_of_work_nonce: '0e7a0e9a2a290000',
    liquidity_baking_escape_vote: false,
    signature:
      'sigpDnzNjZqvDsAFQbr6aFwgrAAjxMFDhwYmezEVj5CmDwDxSkjGDYqEbU9MwJ3ULHQyNh1WFkDbMaiLiWAL2j69hoXYA4gK',
  },
  metadata: {
    protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
    next_protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
    test_chain_status: {
      status: 'not_running',
    },
    max_operations_ttl: 120,
    max_operation_data_length: 32768,
    max_block_header_length: 239,
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
    baker: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
    level_info: {
      level: 545281,
      level_position: 545280,
      cycle: 133,
      cycle_position: 512,
      expected_commitment: false,
    },
    voting_period_info: {
      voting_period: {
        index: 26,
        kind: 'proposal',
        start_position: 532480,
      },
      position: 12800,
      remaining: 7679,
    },
    nonce_hash: null,
    consumed_gas: '3040000',
    deactivated: [],
    balance_updates: [
      {
        kind: 'contract',
        contract: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
        change: '-640000000',
        origin: 'block',
      },
      {
        kind: 'freezer',
        category: 'deposits',
        delegate: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
        cycle: 133,
        change: '640000000',
        origin: 'block',
      },
      {
        kind: 'freezer',
        category: 'rewards',
        delegate: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
        cycle: 133,
        change: '19765625',
        origin: 'block',
      },
    ],
    liquidity_baking_escape_ema: 100390,
    implicit_operations_results: [],
  },
  operations: [
    [
      {
        protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
        chain_id: 'NetXZSsxBpMQeAT',
        hash: 'oo5Mtpg6GyqHoPCfTaLj8uM1WEy8GgSTbFyxxQvYvG26YTGxLx9',
        branch: 'BLMZNGicumHeJz3QjMifcvhXzXTdNWs26ztSFshmGd5dxEokEJC',
        contents: [
          {
            kind: 'endorsement_with_slot',
            endorsement: {
              branch: 'BLMZNGicumHeJz3QjMifcvhXzXTdNWs26ztSFshmGd5dxEokEJC',
              operations: {
                kind: 'endorsement',
                level: 545280,
              },
              signature:
                'sigcCGBckk7d1jQFEugzhDCrCfXXmNEuJXR6XfTHyevrRo2BvFk1FgfhAyuuzWptNmoaMNYjBpsHhCygqgGcuuBTeuWNfzqi',
            },
            slot: 71,
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1edUYGqBtteStneTGDBrQWTFmq9cnEELiW',
                  change: '-7500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1edUYGqBtteStneTGDBrQWTFmq9cnEELiW',
                  cycle: 133,
                  change: '7500000',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1edUYGqBtteStneTGDBrQWTFmq9cnEELiW',
                  cycle: 133,
                  change: '234375',
                  origin: 'block',
                },
              ],
              delegate: 'tz1edUYGqBtteStneTGDBrQWTFmq9cnEELiW',
              slots: [71, 131, 225],
            },
          },
        ],
      },
    ],
    [],
    [],
    [
      {
        protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
        chain_id: 'NetXZSsxBpMQeAT',
        hash: 'ooBFEqoFmEaxCthntgz84zdVTUoFvjRJv9XQNdBf38CT4e77MbH',
        branch: 'BLMZNGicumHeJz3QjMifcvhXzXTdNWs26ztSFshmGd5dxEokEJC',
        contents: [
          {
            kind: 'transaction',
            source: 'tz1Nbp1gNPMzn9MB9ZhBnfsajsaQBLYScdd5',
            fee: '403',
            counter: '43409',
            gas_limit: '1520',
            storage_limit: '277',
            amount: '100',
            destination: 'tz1X5QfLiPrc9fYhbyaeaRa4ZEV52axzG7Tt',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1Nbp1gNPMzn9MB9ZhBnfsajsaQBLYScdd5',
                  change: '-403',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'fees',
                  delegate: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
                  cycle: 133,
                  change: '403',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz1Nbp1gNPMzn9MB9ZhBnfsajsaQBLYScdd5',
                    change: '-100',
                    origin: 'block',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz1X5QfLiPrc9fYhbyaeaRa4ZEV52axzG7Tt',
                    change: '100',
                    origin: 'block',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz1Nbp1gNPMzn9MB9ZhBnfsajsaQBLYScdd5',
                    change: '-64250',
                    origin: 'block',
                  },
                ],
                consumed_gas: '1420',
                consumed_milligas: '1420000',
                allocated_destination_contract: true,
              },
            },
          },
          {
            kind: 'transaction',
            source: 'tz1Nbp1gNPMzn9MB9ZhBnfsajsaQBLYScdd5',
            fee: '308',
            counter: '43410',
            gas_limit: '1520',
            storage_limit: '277',
            amount: '200',
            destination: 'tz1WfY3TuM9EPZZyqYMjHHTXHnM1r9LvBiX9',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1Nbp1gNPMzn9MB9ZhBnfsajsaQBLYScdd5',
                  change: '-308',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'fees',
                  delegate: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
                  cycle: 133,
                  change: '308',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz1Nbp1gNPMzn9MB9ZhBnfsajsaQBLYScdd5',
                    change: '-200',
                    origin: 'block',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz1WfY3TuM9EPZZyqYMjHHTXHnM1r9LvBiX9',
                    change: '200',
                    origin: 'block',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz1Nbp1gNPMzn9MB9ZhBnfsajsaQBLYScdd5',
                    change: '-64250',
                    origin: 'block',
                  },
                ],
                consumed_gas: '1420',
                consumed_milligas: '1420000',
                allocated_destination_contract: true,
              },
            },
          },
        ],
        signature:
          'sighgK3MmmRXyAmhNiyH2fernC4gdcBcqo6zKxgHSC26GUzwYvL7GWSJeHMwyyGcceCv5KoLwWfzzGNNLch1ZiegaawWhLeH',
      },
    ],
  ],
};

export const liveBlocks = [
  'BKjCKsditsV3M8Xgk9H5RJMxovN49Ac3CKK32KNtuyhQoXrcbCS',
  'BKjUBSp4gfjqhJj31ScyAQae8rJapAnR7f6isRgyUasxUZyUjyx',
  'BKmZLJZ1d4bxPLmXw9WuHj2kNSkPtXLtDrHgWX4Gn2NhKhAvUde',
  'BKoT6aFLchTPCEdk68Kswv2HALqUGo1fN1z3EyQpiMnoh7X2k4F',
  'BKoXGxyiaPQ4343gt7jMxTj2zfzFKJq9JvCuyqi5Sw8VMET9JjT',
  'BKotzbg3iSjNb2KRgheSi6mUp7HV19LfGihbGyRUYtqMd3wktxL',
  'BKp8QU7kGXQxL5CzTebNgAXH7aQXKpUhHU2KcWBVams1hEy3N57',
  'BKpHSXNSrXQxYixoTC23AtpVojZprXCySGP5ZMcTfo2ZNFpQYF2',
  'BKpQtusnoScmpjmVnpVMHrtWKZD8Cvkgqic773xdV1XhVP3uuKs',
  'BKqbZAFBoTwNfNFrkvzJqnxxQ7fJpPYk2JsKRLUi4QJ68dEePAo',
  'BKszKhwMZBCy2vN42Fh9nTUqPEqPKeYVCtts7CgBnVyTS1SbY5V',
  'BKt4bvJ1puVLXSbk2jbWWJzphReVinTc3sBHj394cWaYDZ6hZzA',
  'BKuHqsYyuhMunizzM9hTZGPjyxcjmq68Xq2gnvuBbNnBgm4CMDV',
  'BKwvWyvifs1a5RFFeiiAxAni8bdf5TCxCMELjpR4GPbihwDeJEp',
  'BKwzfj4HGpdjJJ8HBTQPjs1cVFdqm4MVFXpkfFmLyCyNV23bxLe',
  'BKxPDBXCah9jzFtbuU57P3tRC9Xrbt6wh42fiyeuzvoLcdtXZix',
  'BKz9A6VkB9YzhByQ46nHdw1cjLByxSarcyjfq3wsoXhPJH7ztDB',
  'BKzyXYHRTz1N7QhFWATTq7FXUDXqzGi3UFQHpASRXqYqvJR1dam',
  'BL1MgjeZygK5r1W8zTHvcHWxYuCWuFue27o47xp8CUxzRn4wqz8',
  'BL28NYgHsuBPhTtMyvYLobCtYK2sLZvAkzcUWRwnYZcYZ1ejhXu',
  'BL2nqt5EbDCgWxGE6DFcfi5nYWnb6D3gBRy7U5Js6JwUvAHFNJY',
  'BL4Q1tXWoXqYyVZeszLDvsNNyzZc92Z3NDpNK3cQCJLc79UbpAf',
  'BL64V16WcbC9s8kBQwQVBD9htuYzsPNTzpwp7GVr7AR54nbxNBx',
  'BL6ppVgVe5GvkY3tMmSVuAGjGLUxfCgz6Jy1xVeQd6vmT6Z8qVy',
  'BL9upiouU5DNB2c3iM2Sb9mToZybZ18uE47TMJRrBFbQSSPtv1Y',
  'BLBUHPi1bC316Gtf4XSknk91Xban2SuYF4eP2Jsc83xf1NpcMe3',
  'BLCWELjos1zvs93dVtJuDu2VDtbsu9hehscvSkmj62o7qEaipWA',
  'BLDBRNYzVvgJGnjjnQ3gJceSU4TeJj7h9b3gYSF45XJjYpMuyYG',
  'BLEjBzUgAyykhjeW52jnXK7ejNuVWchexheaYSzixRarxUXF68A',
  'BLFeqmvr69oV6ns6n6nmYCiKADNcmPV4RV6Mg3ccKhgVB2baJBv',
  'BLJLJDNGeH187tf55BfMmC5vw2fiqiA655mgQiRPcTicGCEiQXn',
  'BLJNoAjBj2Z2jsFnsVo17Rv6v1R7LDYEP9ETnxATvkEisk2zrKM',
  'BLK2C8P1YdkSaUK65sUkkWAbEA6eafuhMQ7yhozEsWxafYttbN6',
  'BLKJvygwtkTDzcZPRiozAgLMsc3WFCv82w7YusUe9kkubhXxbHj',
  'BLMRPPiBaKBmjVxSkEzZx1uTxerxYYjkwoZPTsnsgh5noS8aUY1',
  'BLMZNGicumHeJz3QjMifcvhXzXTdNWs26ztSFshmGd5dxEokEJC',
  'BLNLdthEfDLUPzXuhheXNUP2VzTnBwWCXm7Qhj9ibaaJbiog45N',
  'BLNvw8U3mH7ueyZVDvPtX24VJTBf87rKev4DF7FQKHSt9hs1nyL',
  'BLPJaRZNfQZTvXUTBF3FmbdyPi7hoDasis34TJuZw88C6khj7eN',
  'BLS5zMjAiWzEbnvEcHC6JkPJ1W3kg99GpJjsUy7f4ASaXRH6vKz',
  'BLSVwgyhop3BceZSXryu5DPQGzw9De6y8upAHEdwLBNM1sgonUZ',
  'BLSodLFPzE4dDUwHx3PPD8uuJmN2Xx1sGdvTGazmVTvX3H53KLi',
  'BLT2bRpAmLQfnoKgFeB89H2t451Qc3E2DH7YBkCbVVBzRtKfpGW',
  'BLT97wTvFZeAqM5gq52n7wekEfno5KEezamzFkSsa2pejh3RPyq',
  'BLV7j8LT64sDW9auJQTLHcN9AAKedjQ8nLEgDGxQgXszdC3eKto',
  'BLaXPsaWGjq2baLheAtQsBeRvgfopa4buhoZVQZ51vJXBdDi4Ut',
  'BLbjmaxwrGFH9XonnF8EsMTC5Geje7RZQQr3qeAJ2KyC4RQs8Ko',
  'BLcxwtmorkvaPhecRkdVYgdh44haqw1LhjL4wJWzDd8FRe35kGf',
  'BLe9LDaAADu679bvkAY2x9eFNgY5795XgCDBsHH5upS1yjwp9xp',
  'BLfdg52J2dxpo2nVpzrQBcXHA1KaWb7Ecj9JgqU7P15y9Zq7foN',
  'BLfx4jfGR42NyB8qPSRamhiDMQ1X6oHuDUAsYyMWX2nGUDyG1NY',
  'BLgNfZcqLWVgPeVn4HnjtBF399TFEESLKpPAt1nXS5EyxPzhMH8',
  'BLgScUPpreWNcDKMUWT75uLMTQqvAUXP9unM79Ks7y5cxgtcKww',
  'BLjs7qreJ2Y5o6hs4ptnQSF6oLp5G6d8wLwzqNo5iDgEZDAB9gu',
  'BLkHQityxP7hr38ZZZDMuS4QBNh31Y9gN3KW3FmvwEk6pbu6SKJ',
  'BLkXQMGsBg7YHy18ss4EBRUipAKCFypZ82BnCptF7q4JvNLj6uu',
  'BLn3GrJkJKT5bYjFvLB1TrXhwWPxpYkRYQVVXJsLtSfWUXy6Qsu',
  'BLnFYViUU26NBjQEFM8YJw8DQW54zhmW6GHqiTU6hooRuYr7Uyc',
  'BLnQ3q6mS5ozvXd9cQY4kL2K8ueHtucPMGoa6hRoGmDG8drkfXm',
  'BLnbk4SVQMKyPDhQXkSio9oSvEp968rTzuTatd9ymQu5oa5mmry',
  'BLnmqdGik8VYZm71kj6M285g9MF1A1HziDbWv7K5ujMu6WDMdTg',
  'BLpybFxteZbcstgSAozkiddFuHPvZ9ErsiFeAnkMPCWKjiV3TUs',
  'BLsJLfpD9AuzXEbEwuHr5R6ErjAGQFSSQzUUiXT2NZ5ovgZFK86',
  'BLuvEmn186Zu1bTLG3xDy8WMqGqa6XWzfto4Ggj1njk5drYCaf9',
  'BLvrmKUMvinN2nq9ZJtUviiYxgxLcwnvjnjRh2uh5q7ymJXaakY',
  'BLw2Jr22WPaUv8Dnee69rZiRXUePxA7DhGmPyeULaCUD71PCezJ',
  'BLw2mx6ekkG9nxiqEXTG1Ba7aSdptsMP1HTNksH4ZztUxZ2qXcE',
  'BLwrvAHnB6drpdy9ux1L8P7kL6i3jSPYGUYspHBvaM8V7CJSNC9',
  'BLx8xD5AW8JyTtDZD66s9cvPYgxFmNav9ebYverQ5jdfE1EfMGG',
  'BLyPBttMsnhKGUZtsbFs6xwNr2yEb3S2nFRXLEHwLbKVUr89Cyp',
  'BLzRfyoM7h5PThjqG85WngBKT8a4bYRKwDkPu2yh8eLLGDTum3N',
  'BLzVds4pxxozzcZbiXizAccnNZJtpbvjTkqeRnag5rTXgpHM4mn',
  'BLzeMYXWqQQhRT44q1fc822ihBTr6in1ZsqXdq4ygfXPBt4MuQi',
  'BM14rMML5Wee7W2APxHWVihGNvyr6MRUF8Lujkad3cJxbyoKPkh',
  'BM1FfuHbZhb9BRij1vD1cKruKwLPzi5pkkrJwacWihNLGwkauRf',
  'BM2pBskXqWPXUwQpV4S4igrZMnicYnK9kjCB2GCzMrzqs8KYpqh',
  'BM3DtDsYWi7L8KdSvXviMHE8bQem6DTDJzXXwPGbwqey3dhoG5d',
  'BM4Y46cQn4VYRD8cd2nMP7AfW5MLCdqRUDc9XP2onPWJ4muYdz8',
  'BM4dkTs2t7ZtaFKTVTndd2K6ha26BtFLJVnpeuTBUrFXGRi9cQ8',
  'BM5sL2nVbQdHEkW7RqgDEFF4ZUbnR4QtnFKrfDSGoGYZLkn3ac1',
  'BM6SajQ3Z9NAj4yA48tfYwCoy7Uac79C668bkduaY4RuT2neLHc',
  'BM6u9xuz8DjRi72KhH8muKaxBJSJjF1MVF6FKErHx7HwxafpBsN',
  'BM7PhP3We9LBh8SmFpW5uS6mo6oQWB6dybJymsWRkAeksqnzbmu',
  'BM98UiZPBKyDHzCJFy42zDFn3DzGUuGh76DSDByXo8vjUgaxCdE',
  'BM9ubfgKy6u93PR5q9PKSY5QeGo9KTEbtf6EKcrfC6uR17c4ZMu',
  'BMAYadX6wBTvXdEfqYdKU2EG1WvwqFFx47D23RjxNad5is7QFxx',
  'BMAsdt2scf1UXnQ59mPNqVm8XR7P7CrqzCxqKo2kbFjpozuxUxZ',
  'BMBQpNZa6muHXPFYUUVg26vPEa1tubCVmJJ3qWfJFZQBWpQ5Pxh',
  'BMDFZBiozyhcQyfX5voxWxciq2bZHMmWh2TkzwNR2zEmuZBqEg8',
  'BMDGzEiBEehAWvfaeSmhc4TZfBUb2MSZc4kanXyD8dqxVJRiYGq',
  'BMDfBW7wBiCK3FtHx9H7i5Bd6tz5usewSQxkxnwWxrxmSbuJDPj',
  'BMEPkUoBSQnr2rGLGB3vXzx2Nit3Yyv9x4eYoigKQbhkXAXxTZM',
  'BMJT6FUt6p6BMf13As93LuMCdTqnfVb8ebvz6RM1dTipkqVLBtX',
  'BMKASHaqoshTVdrYtEiMXXVKxUjSwei56aFd8miv4VTehNoD9Fc',
  'BMKjiFCcwE1pBJYFougKTNBaYLiczTrAKrseELvmK3SCnJP4KWF',
  'BMKmG7mjNfhHzTQ5Xiv5Mdnn951RM2xvuUWG7jpWok4H7bFWjZ4',
  'BMM7pEamQqC9myeyxieuJGGkMFxQ445EeUCERm8w84E9VhuTLfp',
  'BMMpVuYXz9bkzapvFoDZVAbXRx9n6HheDWWYrvTNGQAJvakSTo1',
  'BMNFEaCqbg2cSmPtZVMKwqBjq14W1CJYukQzTbtgj8EDDD2QpmU',
  'BMNzT5cguzNGTV7xM2WXeSWGxLkRK6dXkgWAAjLUnTTaNb4YUeV',
  'BMQHpHW8QY2QWZequ7TZCK4niA1Zt1vsFV1m7PAntLNYs16rZ7Z',
  'BMQZ7FkaecwgW3aM94yu8TzmAirGUcC8Bvx5Mz7hB4jxtRQHrPF',
  'BMUPez8zEXFPYVjkZHxQusxF8Prfo9M4HR14d7PESsF4w4amyW7',
  'BMVV5XaffTHDsBzPtzN47EWXbdkjCn2yFD1WiAqQzWmWo137Cu9',
  'BMWcmpi1uFJdUo8kxZ7xjzGELbqfTCn5pWqPxSfS3nMeHhECDDR',
  'BMWkh8HLcEbFPRrNRg36zhLFBA3nzQ4YL2NxTGiPU4magnLXmVJ',
  'BMWugSVCFED2MBKFypycHq9wJ3GxzcQCB2pyburEADPSQjgggkB',
  'BMXNJM9CKjsVRRK4dWUTabnMw1GQdvcrVEZYstiHKeBoZ1UEtDV',
  'BMZGoxegcSPPj45eRa6CmfSZYGCDQeH2hNJri8hxpLcddvVGGNz',
  'BMZXc7umf6CbaMh3MDydzzXt8QmMS8yX3HgB38UoJ5yRBrUdVmX',
  'BMaG5Hub8Dgb4hJ18fqr8wUsbzqRQbnxQk3oTFCo6HV5AZkf1U1',
  'BMaWvBTWEFc3UeYt81BQqdcGfwv5Lfwc5EJojnbQUXg5S5zF9iB',
  'BMafA1j5UmXGPK9wXmALpnfy8T3YWqUDmqjThBQz7WmhQoVQHVa',
  'BMauMo2VqsJuu29YcSxEEnQTKYAqroaCfVFh1EZVF9RyV2KELYk',
  'BMazpM1w9bgBJNXkA8xFeJDSZGPdqq9TTkEWckaoyHQHaPPYezo',
  'BMbqeUJa78uDHQovSMxnBBrLbH9G11yf2Yid8AfipwHSr91jav6',
  'BMbv2LbMhBSLKccpjwUdyxodJRUMzXMNDE1seDVBXPZ3tGJ9VZQ',
  'BMcEAu1fbgKQdp7Lsz7jcHHghgp2SnfBjRWCeFiZLNXjyUtABHm',
  'BMcMzrYcrg6i8iBW8A3WstCpDGo1ph5sXKWo9VsLjf4zHW9b5Zk',
  'BMcczQyMnGAzM2WJPQ2vbgyzryg52GQgNWLggpHDKPqhQzJUeT8',
  'BMdaQruY6gep3cmRwGoxEUqx2XJ79XQKqpTT7jusKLA1bSTowRc',
];
