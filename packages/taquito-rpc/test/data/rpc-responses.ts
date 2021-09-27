import BigNumber from "bignumber.js";

export const rpcUrl = 'rpcTest';
export const blockHash = 'BlockHash';
export const liveBlocks = ['BKiHeQzuKM5quBsgVL25UDFXKcZyaTt26AQUtUkbA4Vh3dAQY21', 'BKiboc2xTLtbCXt6AWX2BpR4km41onVrLmhFSTjYUA2iWKBwSTH']
export const balance = new BigNumber(4138876344398)
export const storage = { prim: 'Pair', args: [{ int: '0' }, { int: '1' }] }
export const script = {
    code: [
        { prim: 'parameter', args: [] },
        { prim: 'storage', args: [] },
        { prim: 'code', args: [] }
    ],
    storage: { prim: 'Pair', args: [] }
}
export const contract = {
    balance: new BigNumber(765),
    script: {
        code: [],
        storage: { prim: 'Pair', args: [] }
    }
}

export const managerKey = 'edpkvP1NXoo8vhYbPSvXdy466EHoYWBpf6zmjghB2p3DwJPjbB5nsf'
export const delegate = 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD'
export const bigmapValue = { prim: 'Pair', args: [[], { int: '100' }] }
export const delegates = {
    deactivated: false,
    balance: new BigNumber('5821087107868'),
    frozen_balance: new BigNumber('1682643263470'),
    staking_balance: new BigNumber('5792534034676'),
    delegated_contracts: [
        'tz2ApgXezUaJKaY49nxEYbMjsjnkAz2mTiFC'
    ],
    delegated_balance: new BigNumber('12714439280'),
    grace_period: 131,
    voting_power: 747
}
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
    time_between_blocks: [
        new BigNumber(30),
        new BigNumber(20)
    ],
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
    baking_reward_per_endorsement: [
        new BigNumber(78125),
        new BigNumber(11719)
    ],
    endorsement_reward: [
        new BigNumber(78125),
        new BigNumber(52083)
    ],
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
    liquidity_baking_escape_ema_threshold: 1000000
}
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
    signature: 'sigXwcYckn43nA9uqFKKTqFbkiyhBdKfRd8mbCWHnk4kFqis7unT4VJozBrT7f1pVZNUnTPwHYBqarCdVTRajj5bhWg4qGSF'
}

export const bakingRights = [
    {
        level: 516501,
        delegate: 'tz1VWasoyFGAWZt5K2qZRzP3cWzv3z7MMhP8',
        priority: 0,
        estimated_time: '2021-09-27T20:42:10Z'
    }
]

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
        { max_size: 524288 }
    ],
    baker: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
    level_info: {
        level: 516500,
        level_position: 516499,
        cycle: 127,
        cycle_position: 403,
        expected_commitment: false
    },
    voting_period_info: {
        voting_period: { index: 25, kind: 'proposal', start_position: 512001 },
        position: 4498,
        remaining: 15981
    },
    nonce_hash: null,
    consumed_gas: '0',
    deactivated: [],
    balance_updates: [
        {
            kind: 'contract',
            contract: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
            change: '-640000000',
            origin: 'block'
        },
        {
            kind: 'freezer',
            category: 'deposits',
            delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
            cycle: 127,
            change: '640000000',
            origin: 'block'
        },
        {
            kind: 'freezer',
            category: 'rewards',
            delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
            cycle: 127,
            change: '16484375',
            origin: 'block'
        }
    ],
    liquidity_baking_escape_ema: 243180,
    implicit_operations_results: [
        {
            kind: 'transaction',
            storage: [Array],
            balance_updates: [Array],
            consumed_gas: '2118',
            consumed_milligas: '2117300',
            storage_size: '4636'
        }
    ]
}
export const endorsingRights = [
    {
        level: 516500,
        delegate: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
        slots: [
            12, 37, 80, 120,
            130, 206, 209, 219,
            229
        ],
        estimated_time: '2021-09-27T20:41:55Z'
    }
]
export const ballotList = []
export const ballots = { yay: 0, nay: 0, pass: 0 }
export const currentPeriodKind = {
    voting_period: { index: 25, kind: 'proposal', start_position: 512001 },
    position: 4498,
    remaining: 15981
}
export const currentProposal = null;
export const currentQuorum = 5500
export const votesListing = [
    { pkh: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5', rolls: 399 }
]
export const porposals = []
export const entryPoints = {
    entrypoints: { main: { prim: 'pair', args: [] }, default: { prim: 'unit' } }
}
export const chainId = 'NetXz969SFaFn8k'
export const packData = {
    gas: 'unaccounted',
    packed: '050a000000160000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c'
}
export const currentPeriod = {
    voting_period: { index: 25, kind: 'proposal', start_position: 512001 },
    position: 4498,
    remaining: 15981
}
export const successorPeriod = {
    voting_period: { index: 25, kind: 'proposal', start_position: 512001 },
    position: 4539,
    remaining: 15940
}