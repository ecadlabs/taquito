import BigNumber from 'bignumber.js';

export const rpcUrl = 'rpcTest';
export const blockResponse = {
  protocol: 'PsParisCZo7KAh1Z1smVd9ZMZ1HHn5gkzbM94V3PLCpknFWhUAi',
  chain_id: 'NetXXWAHLEvre9b',
  hash: 'BLauzww5KwkaBTuPjxANENMHHR4BapJ2G9B86z2bsZHHi5oKanb',
  header: {
    level: 989795,
    proto: 1,
    predecessor: 'BL2Ba8XNJYRTHUjapPQYNxuymQNA2u2PWhsuEXRrTT9pvEm9E65',
    timestamp: '2024-09-06T20:47:46Z',
    validation_pass: 4,
    operations_hash: 'LLoaKUBDXGeocTaJiuyb3w4d7JzHs419R7B6HFpMqQTwMpkdfcRq8',
    fitness: ['02', '000f1a63', '', 'ffffffff', '00000000'],
    context: 'CoWHYezPfU43VGjBjEyxN4f2hdGq73ghasPgWHzhJN9aGYU2W8H6',
    payload_hash: 'vh2ifehMZB2C7GFb2M4YycExTMWAY5PnDC4PoPtDmWh7yNNVbfLj',
    payload_round: 0,
    proof_of_work_nonce: '1a991a0300000000',
    liquidity_baking_toggle_vote: 'on',
    adaptive_issuance_vote: 'pass',
    signature:
      'sigWZtc4cGRxY7Fm1uPWFqHLyZYTgouUvAyTFfPLtE669VGezRNpfLXuxjUrU4DjviZjJcQe59RvNE4wLj1zEXpYsmwF6AXs',
  },
  metadata: {
    protocol: 'PsParisCZo7KAh1Z1smVd9ZMZ1HHn5gkzbM94V3PLCpknFWhUAi',
    next_protocol: 'PsParisCZo7KAh1Z1smVd9ZMZ1HHn5gkzbM94V3PLCpknFWhUAi',
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
    proposer: 'tz1fLH7NNTTshW2zycQ3rFJ8ZPjcxp9mXboX',
    baker: 'tz1fLH7NNTTshW2zycQ3rFJ8ZPjcxp9mXboX',
    level_info: {
      level: 989795,
      level_position: 989794,
      cycle: 7732,
      cycle_position: 98,
      expected_commitment: false,
    },
    voting_period_info: {
      voting_period: { index: 7732, kind: 'proposal', start_position: 989696 },
      position: 98,
      remaining: 29,
    },
    nonce_hash: null,
    deactivated: [],
    balance_updates: [
      {
        kind: 'accumulator',
        category: 'block fees',
        change: '-437',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1fLH7NNTTshW2zycQ3rFJ8ZPjcxp9mXboX',
        change: '437',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking rewards',
        change: '-156420503',
        origin: 'block',
      },
      {
        kind: 'freezer',
        category: 'deposits',
        staker: { baker_own_stake: 'tz1fLH7NNTTshW2zycQ3rFJ8ZPjcxp9mXboX' },
        change: '156420503',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking rewards',
        change: '-156420503',
        origin: 'block',
      },
      {
        kind: 'freezer',
        category: 'deposits',
        staker: { delegate: 'tz1fLH7NNTTshW2zycQ3rFJ8ZPjcxp9mXboX' },
        change: '156420503',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking rewards',
        change: '-244566',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1fLH7NNTTshW2zycQ3rFJ8ZPjcxp9mXboX',
        change: '244566',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking bonuses',
        change: '-156325272',
        origin: 'block',
      },
      {
        kind: 'freezer',
        category: 'deposits',
        staker: { baker_own_stake: 'tz1fLH7NNTTshW2zycQ3rFJ8ZPjcxp9mXboX' },
        change: '156325272',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking bonuses',
        change: '-156325272',
        origin: 'block',
      },
      {
        kind: 'freezer',
        category: 'deposits',
        staker: { delegate: 'tz1fLH7NNTTshW2zycQ3rFJ8ZPjcxp9mXboX' },
        change: '156325272',
        origin: 'block',
      },
      {
        kind: 'minted',
        category: 'baking bonuses',
        change: '-244417',
        origin: 'block',
      },
      {
        kind: 'contract',
        contract: 'tz1fLH7NNTTshW2zycQ3rFJ8ZPjcxp9mXboX',
        change: '244417',
        origin: 'block',
      },
    ],
    liquidity_baking_toggle_ema: 2550,
    adaptive_issuance_vote_ema: 2634186,
    adaptive_issuance_activation_cycle: 0,
    implicit_operations_results: [
      {
        kind: 'transaction',
        storage: [
          { int: '1' },
          { int: '116095517093' },
          { int: '100' },
          { bytes: '01e927f00ef734dfc85919635e9afc9166c83ef9fc00' },
          { bytes: '0115eb0104481a6d7921160bc982c5e0a561cd8a3a00' },
        ],
        balance_updates: [
          {
            kind: 'minted',
            category: 'subsidy',
            change: '-583333',
            origin: 'subsidy',
          },
          {
            kind: 'contract',
            contract: 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5',
            change: '583333',
            origin: 'subsidy',
          },
        ],
        consumed_milligas: '206532',
        storage_size: '4632',
      },
    ],
    proposer_consensus_key: 'tz1fLH7NNTTshW2zycQ3rFJ8ZPjcxp9mXboX',
    baker_consensus_key: 'tz1fLH7NNTTshW2zycQ3rFJ8ZPjcxp9mXboX',
    consumed_milligas: '277000',
    dal_attestation: '0',
  },
  operations: [
    [
      {
        protocol: 'PsParisCZo7KAh1Z1smVd9ZMZ1HHn5gkzbM94V3PLCpknFWhUAi',
        chain_id: 'NetXXWAHLEvre9b',
        hash: 'opNoTGfrSBj1k2deQvh5mZGXm6tBhBZz5YHRQsxStTFrjWjwV3q',
        branch: 'BLQNVpuLN5vi7Js8QML9jPBr61X3QwW2h8dH9ptp33hxuBwzDpJ',
        contents: [
          {
            kind: 'attestation',
            slot: 0,
            level: 989794,
            round: 0,
            block_payload_hash: 'vh3Y2ysro9mSgkGmB1uNmoGho98gCTF3ycSfSKGXGrYEowXbDraa',
            metadata: {
              delegate: 'tz1Zt8QQ9aBznYNk5LUBjtME9DuExomw9YRs',
              consensus_power: 2558,
              consensus_key: 'tz1Zt8QQ9aBznYNk5LUBjtME9DuExomw9YRs',
            },
          },
        ],
        signature:
          'sigXErmHKcQpsTZ9tEc7MtLjPde16tZDwPtbvCdBJum5S55tRSQuoTQ88CRgYz1Yw1ap5F5PhjGTpqq5GdGp3MFZonkZLxUo',
      },
    ],
    [],
    [],
    [
      {
        protocol: 'PsParisCZo7KAh1Z1smVd9ZMZ1HHn5gkzbM94V3PLCpknFWhUAi',
        chain_id: 'NetXXWAHLEvre9b',
        hash: 'opS8fwbeZEv9riec1GzYCSuxtBEVeuJzLhwtRV7DAsR3BurRRRV',
        branch: 'BLQNVpuLN5vi7Js8QML9jPBr61X3QwW2h8dH9ptp33hxuBwzDpJ',
        contents: [
          {
            kind: 'smart_rollup_add_messages',
            source: 'tz1NxvcLNywVH5jkZgqKnFbGyn9rjp5Rkkgi',
            fee: '437',
            counter: '740739',
            gas_limit: '277',
            storage_limit: '0',
            message: [
              '006f3183e65b011f6c0f0bc9f5665aeca477e6ad8103f897adeca08a42b0140371b7d91998994355379608669f83503adfe3527153d485e0018dd4c0c088696adb6600000000a095ba080000000000000000000000000000000000000000000000000000000000820100820000b840d177389e13cbc219d847dfa13fe66762647f55a369c0f1af75331f7045ed05d2ee87f2d76699fcdbddbdd63fcce6e5a656e295c17848f24c7662eeee57e8d806',
            ],
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1NxvcLNywVH5jkZgqKnFbGyn9rjp5Rkkgi',
                  change: '-437',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '437',
                  origin: 'block',
                },
              ],
              operation_result: { status: 'applied', consumed_milligas: '176870' },
            },
          },
        ],
        signature:
          'sigoadYdMRfktcFDDMtKrhper43S4fSKF6MtkJDkTjtY2EPG9Wz7oGN5XqjqfBbLNMcpowsyYWirCYQKd28vcTxX55RC8zN2',
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
export const unstakeRequestsResponse = {
  finalizable: [
    {
      delegate: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA',
      cycle: 10,
      amount: new BigNumber('500000000'),
    },
  ],
  unfinalizable: {
    delegate: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA',
    requests: [
      {
        cycle: 11,
        amount: new BigNumber('200000000'),
      },
    ],
  },
};
export const managerKey = 'edpkvP1NXoo8vhYbPSvXdy466EHoYWBpf6zmjghB2p3DwJPjbB5nsf';
export const delegate = 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD';
export const bigmapValue = { prim: 'Pair', args: [[], { int: '100' }] };
export const delegates = {
  full_balance: new BigNumber('10289576365'),
  current_frozen_deposits: new BigNumber('2028957741'),
  frozen_deposits: new BigNumber('1028957741'),
  staking_balance: new BigNumber('10289576365'),
  delegated_contracts: ['tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'],
  delegated_balance: new BigNumber('0'),
  min_delegated_in_current_cycle: {
    amount: '8260618624',
    level: {
      level: 81924,
      level_position: 81923,
      cycle: 7,
      cycle_position: 3,
      expected_commitment: false,
    },
  },
  deactivated: false,
  grace_period: 7,
  pending_denunciations: false,
  total_delegated_stake: new BigNumber('0'),
  staking_denominator: new BigNumber('0'),
  voting_power: new BigNumber('10289577405'),
  remaining_proposals: 20,
  active_consensus_key: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
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
  max_micheline_node_count: 50000,
  max_micheline_bytes_limit: 50000,
  max_allowed_global_constants_depth: 10000,
  cache_layout_size: 3,
  michelson_maximum_type_size: 2001,
  max_slashing_period: 2,
  smart_rollup_max_wrapped_proof_binary_size: 30000,
  smart_rollup_message_size_limit: 4096,
  smart_rollup_max_number_of_messages_per_level: '1000000',
  consensus_rights_delay: 2,
  blocks_preservation_cycles: 1,
  delegate_parameters_activation_delay: 3,
  blocks_per_cycle: 128,
  blocks_per_commitment: 16,
  nonce_revelation_threshold: 32,
  cycles_per_voting_period: 1,
  hard_gas_limit_per_operation: '1040000',
  hard_gas_limit_per_block: '5200000',
  proof_of_work_threshold: '-1',
  minimal_stake: '6000000000',
  minimal_frozen_stake: '600000000',
  vdf_difficulty: '10000000',
  origination_size: 257,
  issuance_weights: {
    base_total_issued_per_minute: '85007812',
    baking_reward_fixed_portion_weight: 5120,
    baking_reward_bonus_weight: 5120,
    attesting_reward_weight: 10240,
    seed_nonce_revelation_tip_weight: 1,
    vdf_revelation_tip_weight: 1,
  },
  cost_per_byte: '250',
  hard_storage_limit_per_operation: '60000',
  quorum_min: 2000,
  quorum_max: 7000,
  min_proposal_quorum: 500,
  liquidity_baking_subsidy: '5000000',
  liquidity_baking_toggle_ema_threshold: 100000,
  max_operations_time_to_live: 120,
  minimal_block_delay: '7',
  delay_increment_per_round: '7',
  consensus_committee_size: 7000,
  consensus_threshold: 4667,
  minimal_participation_ratio: { numerator: 2, denominator: 3 },
  limit_of_delegation_over_baking: 9,
  percentage_of_frozen_deposits_slashed_per_double_baking: 700,
  percentage_of_frozen_deposits_slashed_per_double_attestation: 5000,
  max_slashing_per_block: 10000,
  max_slashing_threshold: 2334,
  cache_script_size: 100000000,
  cache_stake_distribution_cycles: 8,
  cache_sampler_state_cycles: 8,
  dal_parametric: {
    feature_enable: true,
    incentives_enable: false,
    number_of_slots: 32,
    attestation_lag: 8,
    attestation_threshold: 66,
    redundancy_factor: 8,
    page_size: 3967,
    slot_size: 126944,
    number_of_shards: 512,
  },
  smart_rollup_arith_pvm_enable: true,
  smart_rollup_origination_size: 6314,
  smart_rollup_challenge_window_in_blocks: 40,
  smart_rollup_stake_amount: '32000000',
  smart_rollup_commitment_period_in_blocks: 20,
  smart_rollup_max_lookahead_in_blocks: 30000,
  smart_rollup_max_active_outbox_levels: 20160,
  smart_rollup_max_outbox_messages_per_level: 100,
  smart_rollup_number_of_sections_in_dissection: 32,
  smart_rollup_timeout_period_in_blocks: 500,
  smart_rollup_max_number_of_cemented_commitments: 5,
  smart_rollup_max_number_of_parallel_games: 32,
  smart_rollup_reveal_activation_level: {
    raw_data: { Blake2B: 0 },
    metadata: 0,
    dal_page: 1,
    dal_parameters: 1,
    dal_attested_slots_validity_lag: 241920,
  },
  smart_rollup_private_enable: true,
  smart_rollup_riscv_pvm_enable: true,
  zk_rollup_enable: true,
  zk_rollup_origination_size: 4000,
  zk_rollup_min_pending_to_process: 10,
  zk_rollup_max_ticket_payload_size: 2048,
  global_limit_of_staking_over_baking: 5,
  edge_of_staking_over_delegation: 2,
  adaptive_issuance_launch_ema_threshold: 0,
  adaptive_rewards_params: {
    issuance_ratio_final_min: { numerator: '1', denominator: '400' },
    issuance_ratio_final_max: { numerator: '1', denominator: '10' },
    issuance_ratio_initial_min: { numerator: '9', denominator: '200' },
    issuance_ratio_initial_max: { numerator: '11', denominator: '200' },
    initial_period: 10,
    transition_period: 50,
    max_bonus: '50000000000000',
    growth_rate: { numerator: '1', denominator: '100' },
    center_dz: { numerator: '1', denominator: '2' },
    radius_dz: { numerator: '1', denominator: '50' },
  },
  adaptive_issuance_activation_vote_enable: true,
  autostaking_enable: true,
  adaptive_issuance_force_activation: true,
  ns_enable: true,
  direct_ticket_spending_enable: false,
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
export const attestationRights = [
  {
    level: 151187,
    delegates: [
      {
        delegate: 'tz3Q1fwk1vh3zm5LqyUV9e2wZBdaEXcovh2r',
        first_slot: 79,
        attestation_power: 326,
        consensus_key: 'tz3Q1fwk1vh3zm5LqyUV9e2wZBdaEXcovh2r',
      },
    ],
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
export const proposals = [];
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

export const delegatesRionetResponse = {
  deactivated: false,
  is_forbidden: false,
  participation: {
    expected_cycle_activity: 1213042,
    minimal_cycle_activity: 808694,
    missed_slots: 0,
    missed_levels: 0,
    remaining_allowed_missed_slots: 404348,
    expected_attesting_rewards: '55053911170',
  },
  dal_participation: {
    expected_assigned_shards_per_slot: 88725,
    delegate_attested_dal_slots: 1713,
    delegate_attestable_dal_slots: 2268,
    expected_dal_rewards: '12235354950',
    sufficient_dal_participation: true,
    denounced: false,
  },
  grace_period: 484,
  active_staking_parameters: {
    limit_of_staking_over_baking_millionth: 0,
    edge_of_baking_over_staking_billionth: 1000000000,
  },
  pending_staking_parameters: [],
  baking_power: '57551867152447',
  total_staked: '57551308701145',
  total_delegated: '1678004730',
  min_delegated_in_current_cycle: {
    amount: '1675353907',
    level: {
      level: 433801,
      level_position: 433800,
      cycle: 482,
      cycle_position: 0,
      expected_commitment: false,
    },
  },
  own_full_balance: '57552984687135',
  own_staked: '57551308701145',
  own_delegated: '1675985990',
  external_staked: '0',
  external_delegated: '2018740',
  total_unstaked_per_cycle: [
    {
      cycle: 478,
      deposit: '0',
    },
    {
      cycle: 479,
      deposit: '0',
    },
    {
      cycle: 480,
      deposit: '0',
    },
    {
      cycle: 481,
      deposit: '0',
    },
    {
      cycle: 482,
      deposit: '0',
    },
  ],
  denunciations: [],
  estimated_shared_pending_slashed_amount: '0',
  staking_denominator: '0',
  current_voting_power: '57552986705875',
  voting_power: '57510398676966',
  voting_info: {
    voting_power: '57510398676966',
    remaining_proposals: 20,
  },
  consensus_key: {
    active: {
      pkh: 'tz1Zt8QQ9aBznYNk5LUBjtME9DuExomw9YRs',
      pk: 'edpkubw32gvTfUYRERGECHbMTsiLdM9z9JrEXGVEahbZf9yMhTozSg',
    },
  },
  stakers: [
    {
      staker: 'tz1Zt8QQ9aBznYNk5LUBjtME9DuExomw9YRs',
      frozen_deposits: '57551308701145',
    },
  ],
  delegators: [
    'tz3hTtJw23HdaLWLyjyaRDabYnK4yeXSHYhK',
    'tz3XTGMVdBjGkJeKA33xk6aHaWYqiWJVQKd6',
    'tz1Zt8QQ9aBznYNk5LUBjtME9DuExomw9YRs',
  ],
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

export const blockWeeklynetResponse = {
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

export const aiLaunchCycle = 6;

export const pendingOperationsResponse = {
  validated: [
    {
      hash: 'onwh9Z2SHQVDFq2FeuAfoQKC8PzCDkJbDr11ZJTZPCK6C51Gv8U',
      branch: 'BLpiU9xW7CdwkodmSdpvEyi2yJ3ZehW5S7ke6sdf6Rd8zEknwdk',
      contents: [
        {
          kind: 'preattestation',
          slot: 1,
          level: 176131,
          round: 0,
          block_payload_hash: 'vh1uUGEefGiif4iMAGaCiKNLccKArF8SoCsBiCPM788to6Z6DeXH',
        },
      ],
      signature:
        'sigQ5EvfC4NNFVVZKoXoVgmK7oko4CUywnrqpRTroDqY8tzNcUib1bqvUA2fWdTb6qaW5k6s9AaEWoJ6553C4MF3FxcwPbxh',
    },
  ],
  refused: [
    {
      hash: 'onyUMdZgVkjXoHCo4w7aA9mmRmuSDrdfgXTEVhm1774w64zVhVx',
      protocol: 'PtBetaaEZxGcn9JDpkpAZ6E92Kh7bQb5FDoTCeYhmkfcwNehZcT',
      branch: 'BMXLrvc4bTFKRNohYgQ9Y1Xj4ztborPMczRQPMPiFsFF2TZkx4j',
      contents: [
        {
          kind: 'origination',
          source: 'tz2RqxsYQyFuP9amsmrr25x9bUcBMWXGvjuD',
          fee: '379',
          counter: '1817',
          gas_limit: '600000',
          storage_limit: '339',
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
                    {
                      prim: 'PUSH',
                      args: [{ prim: 'string' }, { string: 'Hello ' }],
                    },
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
        'sigVW5CsvXPizGNvQR3P1A7jcZEB5jBFhkFvhTAbdY3DDzVdxgztG9JMDpV9kQYMx3CpUT1pNbZymwTLoNd6LCwHKhytgmJG',
      error: [{ kind: 'permanent', id: 'proto.beta.prefilter.fees_too_low' }],
    },
  ],
  outdated: [
    {
      hash: 'oneF43sGDQHXMfXqJYnn8cf7nNwqWmxpG4SUVpomwLB6LXFU77a',
      protocol: 'PtBetaaEZxGcn9JDpkpAZ6E92Kh7bQb5FDoTCeYhmkfcwNehZcT',
      branch: 'BMSMobj7qdiDmE53TCVuPGLKHFYdHJYaYVoKrADxEV6P4q6DaHb',
      contents: [
        {
          kind: 'preattestation',
          slot: 3,
          level: 176013,
          round: 0,
          block_payload_hash: 'vh25hajrfSyZwJCu4YCNzxikdJiJQuH5wDu61XXjmsfFsrjnrrcN',
        },
      ],
      signature:
        'sigrrifWiv9pAuidW3tKv1syrb9fuwQCWj52PJ2LmmnsV1DXZd2fZmrEf5UoSxLpchsW5yG3fbfL1zCiPoD6719HpAMNZfDz',
      error: [
        {
          kind: 'Preattestation',
          id: 'proto.beta.validate.consensus_operation_for_old_level',
          expected: 176015,
          provided: 176013,
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
  protocol: 'PtNairobiyssHuh87hEhfVBGCVrK3WnS8Z2FT4ymB5tAa4r1nQf',
  chain_id: 'NetXyuzvDo2Ugzb',
  hash: 'BM2HKHuf7cx6d5Uq6MG4P6czUepc5Tw9d71M7h8E4MdmPHTuvMN',
  header: {},
  metadata: {},
  operations: [
    [
      {
        protocol: 'PtNairobiyssHuh87hEhfVBGCVrK3WnS8Z2FT4ymB5tAa4r1nQf',
        chain_id: 'NetXyuzvDo2Ugzb',
        hash: 'ooty1P68jMrhZ3HXRWrpnvzaWS4Rdcvxbu6LdwgQYcpXwvfqG9U',
        branch: 'BKs1WHe13yyEHu68UEJ7Yk7YrM7axhxuofjJYeW9YbY3sAYjx7Z',
        contents: [
          {
            kind: 'smart_rollup_cement',
            source: 'tz1d5inEKUnAChSgScYuaJrtVmAZ9L5cKGSW',
            fee: '977',
            counter: '150010',
            gas_limit: '6986',
            storage_limit: '0',
            rollup: 'sr1CCHLfB1jjz4ikB2bm4XGPvTjafVgUzhLB',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1d5inEKUnAChSgScYuaJrtVmAZ9L5cKGSW',
                  change: '-977',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '977',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                consumed_milligas: '6884964',
                inbox_level: 337913,
                commitment_hash: 'src12wj4nwXiEkwYacLfkLR8X8Md76LNuMzwUgTwgLA9Y3DANaeRay',
              },
            },
          },
        ],
        signature:
          'sigPnRSud9gGtNAcAcZkv6kYoa5Nsp1u8388DBjRgUeuefZHRQxkXdVZxZy3QqVesBasDHQmAhp8yySYH5YMbzzbNz2JLZRw',
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
