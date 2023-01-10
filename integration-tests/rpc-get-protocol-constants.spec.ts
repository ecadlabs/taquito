import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';
import BigNumber from 'bignumber.js';
import { ConstantsResponseProto009, ConstantsResponseProto010, ConstantsResponseProto011, ConstantsResponseProto012, ConstantsResponseProto013, ConstantsResponseProto014, ConstantsResponseProto015 } from '@taquito/rpc';

CONFIGS().forEach(({ lib, protocol, rpc }) => {
  const Tezos = lib;
  const limanet = (protocol === Protocols.PtLimaPtL) ? test : test.skip;
  const alpha = (protocol === Protocols.ProtoALpha) ? test : test.skip;

  describe('Test fetching constants for all protocols on Mainnet', () => {

    const rpcUrl = 'https://mainnet-archive.api.tez.ie/';
    Tezos.setRpcProvider(rpcUrl);
    it('successfully fails at fetching constants for level 0', async (done) => {
      try {
        await Tezos.rpc.getConstants({ block: '0' });
        expect.assertions(1);
      } catch (ex: any) {
        expect(ex.message).toMatch('Http error response: (404) ');
      }
      done();
    });

    it('Verify that rpc.getConstants successfully fetches Proto1 constants at level 1', async (done) => {
      // Get constants for protocol
      const constants = await Tezos.rpc.getConstants({ block: '1' });
      expect(Object.keys(constants)).toHaveLength(24);
      expect(constants).toHaveProperty('proof_of_work_nonce_size', 8);
      expect(constants).toHaveProperty('nonce_length', 32);
      expect(constants).toHaveProperty('max_revelations_per_block', 32);
      expect(constants).toHaveProperty('max_operation_data_length', 16384);
      expect(constants).toHaveProperty('preserved_cycles', 5);
      expect(constants).toHaveProperty('blocks_per_cycle', 4096);
      expect(constants).toHaveProperty('blocks_per_commitment', 32);
      expect(constants).toHaveProperty('blocks_per_roll_snapshot', 256);
      expect(constants).toHaveProperty('blocks_per_voting_period', 32768);
      expect(constants.time_between_blocks.toString()).toEqual('60,75');
      expect(constants).toHaveProperty('endorsers_per_block', 32);
      expect(constants.hard_gas_limit_per_operation.toString()).toEqual('400000');
      expect(constants.hard_gas_limit_per_block.toString()).toEqual('4000000');
      expect(constants.proof_of_work_threshold.toString()).toEqual('70368744177663');
      expect(constants.tokens_per_roll.toString()).toEqual('10000000000');
      expect(constants).toHaveProperty('michelson_maximum_type_size', 1000);
      expect(constants.seed_nonce_revelation_tip.toString()).toEqual('125000');
      expect(constants.origination_burn?.toString()).toEqual('257000');
      expect(constants.block_security_deposit.toString()).toEqual('0');
      expect(constants.endorsement_security_deposit.toString()).toEqual('0');
      expect(constants.block_reward?.toString()).toEqual('0');
      expect(constants.endorsement_reward.toString()).toEqual('0');
      expect(constants.cost_per_byte.toString()).toEqual('1000');
      expect(constants.hard_storage_limit_per_operation.toString()).toEqual('60000');
      done();
    });

    it('Verify that rpc.getConstants successfully fetches Proto1 constants at level 2', async (done) => {
      const constants = await Tezos.rpc.getConstants({ block: '2' });
      expect(Object.keys(constants)).toHaveLength(24);
      expect(constants).toHaveProperty('proof_of_work_nonce_size', 8);
      expect(constants).toHaveProperty('nonce_length', 32);
      expect(constants).toHaveProperty('max_revelations_per_block', 32);
      expect(constants).toHaveProperty('max_operation_data_length', 16384);
      expect(constants).toHaveProperty('preserved_cycles', 5);
      expect(constants).toHaveProperty('blocks_per_cycle', 4096);
      expect(constants).toHaveProperty('blocks_per_commitment', 32);
      expect(constants).toHaveProperty('blocks_per_roll_snapshot', 256);
      expect(constants).toHaveProperty('blocks_per_voting_period', 32768);
      expect(constants.time_between_blocks.toString()).toEqual('60,75');
      expect(constants).toHaveProperty('endorsers_per_block', 32);
      expect(constants.hard_gas_limit_per_operation.toString()).toEqual('400000');
      expect(constants.hard_gas_limit_per_block.toString()).toEqual('4000000');
      expect(constants.proof_of_work_threshold.toString()).toEqual('70368744177663');
      expect(constants.tokens_per_roll.toString()).toEqual('10000000000');
      expect(constants).toHaveProperty('michelson_maximum_type_size', 1000);
      expect(constants.seed_nonce_revelation_tip.toString()).toEqual('125000');
      expect(constants.origination_burn?.toString()).toEqual('257000');
      expect(constants.block_security_deposit.toString()).toEqual('0');
      expect(constants.endorsement_security_deposit.toString()).toEqual('0');
      expect(constants.block_reward?.toString()).toEqual('0');
      expect(constants.endorsement_reward.toString()).toEqual('0');
      expect(constants.cost_per_byte.toString()).toEqual('1000');
      expect(constants.hard_storage_limit_per_operation.toString()).toEqual('60000');
      done();
    });


    it('Verify that rpc.getConstants successfully fetches Proto2 constants at level 100000', async (done) => {
      const constants = await Tezos.rpc.getConstants({ block: '100000' });
      expect(Object.keys(constants)).toHaveLength(24);
      expect(constants).toHaveProperty('proof_of_work_nonce_size', 8);
      expect(constants).toHaveProperty('nonce_length', 32);
      expect(constants).toHaveProperty('max_revelations_per_block', 32);
      expect(constants).toHaveProperty('max_operation_data_length', 16384);
      expect(constants).toHaveProperty('preserved_cycles', 5);
      expect(constants).toHaveProperty('blocks_per_cycle', 4096);
      expect(constants).toHaveProperty('blocks_per_commitment', 32);
      expect(constants).toHaveProperty('blocks_per_roll_snapshot', 256);
      expect(constants).toHaveProperty('blocks_per_voting_period', 32768);
      expect(constants.time_between_blocks.toString()).toEqual('60,75');
      expect(constants).toHaveProperty('endorsers_per_block', 32);
      expect(constants.hard_gas_limit_per_operation.toString()).toEqual('400000');
      expect(constants.hard_gas_limit_per_block.toString()).toEqual('4000000');
      expect(constants.proof_of_work_threshold.toString()).toEqual('70368744177663');
      expect(constants.tokens_per_roll.toString()).toEqual('10000000000');
      expect(constants).toHaveProperty('michelson_maximum_type_size', 1000);
      expect(constants.seed_nonce_revelation_tip.toString()).toEqual('125000');
      expect(constants.origination_burn?.toString()).toEqual('257000');
      expect(constants.block_security_deposit.toString()).toEqual('192000000');
      expect(constants.endorsement_security_deposit.toString()).toEqual('24000000');
      expect(constants.block_reward?.toString()).toEqual('16000000');
      expect(constants.endorsement_reward.toString()).toEqual('2000000');
      expect(constants.cost_per_byte.toString()).toEqual('1000');
      expect(constants.hard_storage_limit_per_operation.toString()).toEqual('60000');
      done();
    });

    it('Verify that rpc.getConstants successfully fetches Proto3 constants at level 300000', async (done) => {
      const constants = await Tezos.rpc.getConstants({ block: '300000' });
      expect(Object.keys(constants)).toHaveLength(25);
      expect(constants).toHaveProperty('proof_of_work_nonce_size', 8);
      expect(constants).toHaveProperty('nonce_length', 32);
      expect(constants).toHaveProperty('max_revelations_per_block', 32);
      expect(constants).toHaveProperty('max_operation_data_length', 16384);
      expect(constants).toHaveProperty('max_proposals_per_delegate', 20);
      expect(constants).toHaveProperty('preserved_cycles', 5);
      expect(constants).toHaveProperty('blocks_per_cycle', 4096);
      expect(constants).toHaveProperty('blocks_per_commitment', 32);
      expect(constants).toHaveProperty('blocks_per_roll_snapshot', 256);
      expect(constants).toHaveProperty('blocks_per_voting_period', 32768);
      expect(constants.time_between_blocks.toString()).toEqual('60,75');
      expect(constants).toHaveProperty('endorsers_per_block', 32);
      expect(constants.hard_gas_limit_per_operation.toString()).toEqual('400000');
      expect(constants.hard_gas_limit_per_block.toString()).toEqual('4000000');
      expect(constants.proof_of_work_threshold.toString()).toEqual('70368744177663');
      expect(constants.tokens_per_roll.toString()).toEqual('10000000000');
      expect(constants).toHaveProperty('michelson_maximum_type_size', 1000);
      expect(constants.seed_nonce_revelation_tip.toString()).toEqual('125000');
      expect(constants).toHaveProperty('origination_size', 257);
      expect(constants.block_security_deposit.toString()).toEqual('512000000');
      expect(constants.endorsement_security_deposit.toString()).toEqual('64000000');
      expect(constants.block_reward?.toString()).toEqual('16000000');
      expect(constants.endorsement_reward.toString()).toEqual('2000000');
      expect(constants.cost_per_byte.toString()).toEqual('1000');
      expect(constants.hard_storage_limit_per_operation.toString()).toEqual('60000');
      done();
    });


    it('Verify that rpc.getConstants successfully fetches Proto4 constants at level 600000', async (done) => {
      const constants = await Tezos.rpc.getConstants({ block: '600000' });
      expect(Object.keys(constants)).toHaveLength(26);
      expect(constants).toHaveProperty('proof_of_work_nonce_size', 8);
      expect(constants).toHaveProperty('nonce_length', 32);
      expect(constants).toHaveProperty('max_revelations_per_block', 32);
      expect(constants).toHaveProperty('max_operation_data_length', 16384);
      expect(constants).toHaveProperty('max_proposals_per_delegate', 20);
      expect(constants).toHaveProperty('preserved_cycles', 5);
      expect(constants).toHaveProperty('blocks_per_cycle', 4096);
      expect(constants).toHaveProperty('blocks_per_commitment', 32);
      expect(constants).toHaveProperty('blocks_per_roll_snapshot', 256);
      expect(constants).toHaveProperty('blocks_per_voting_period', 32768);
      expect(constants.time_between_blocks.toString()).toEqual('60,75');
      expect(constants).toHaveProperty('endorsers_per_block', 32);
      expect(constants.hard_gas_limit_per_operation.toString()).toEqual('800000');
      expect(constants.hard_gas_limit_per_block.toString()).toEqual('8000000');
      expect(constants.proof_of_work_threshold.toString()).toEqual('70368744177663');
      expect(constants.tokens_per_roll.toString()).toEqual('8000000000');
      expect(constants).toHaveProperty('michelson_maximum_type_size', 1000);
      expect(constants.seed_nonce_revelation_tip.toString()).toEqual('125000');
      expect(constants).toHaveProperty('origination_size', 257);
      expect(constants.block_security_deposit.toString()).toEqual('512000000');
      expect(constants.endorsement_security_deposit.toString()).toEqual('64000000');
      expect(constants.block_reward?.toString()).toEqual('16000000');
      expect(constants.endorsement_reward.toString()).toEqual('2000000');
      expect(constants.cost_per_byte.toString()).toEqual('1000');
      expect(constants.hard_storage_limit_per_operation.toString()).toEqual('60000');
      expect(constants.test_chain_duration?.toString()).toEqual('1966080');
      done();
    });


    it('Verify that rpc.getConstants successfully fetches Proto5 constants at level 700000', async (done) => {
      const constants = await Tezos.rpc.getConstants({ block: '700000' });
      expect(Object.keys(constants)).toHaveLength(31);
      expect(constants).toHaveProperty('proof_of_work_nonce_size', 8);
      expect(constants).toHaveProperty('nonce_length', 32);
      expect(constants).toHaveProperty('max_revelations_per_block', 32);
      expect(constants).toHaveProperty('max_operation_data_length', 16384);
      expect(constants).toHaveProperty('max_proposals_per_delegate', 20);
      expect(constants).toHaveProperty('preserved_cycles', 5);
      expect(constants).toHaveProperty('blocks_per_cycle', 4096);
      expect(constants).toHaveProperty('blocks_per_commitment', 32);
      expect(constants).toHaveProperty('blocks_per_roll_snapshot', 256);
      expect(constants).toHaveProperty('blocks_per_voting_period', 32768);
      expect(constants.time_between_blocks.toString()).toEqual('60,40');
      expect(constants).toHaveProperty('endorsers_per_block', 32);
      expect(constants.hard_gas_limit_per_operation.toString()).toEqual('800000');
      expect(constants.hard_gas_limit_per_block.toString()).toEqual('8000000');
      expect(constants.proof_of_work_threshold.toString()).toEqual('70368744177663');
      expect(constants.tokens_per_roll.toString()).toEqual('8000000000');
      expect(constants).toHaveProperty('michelson_maximum_type_size', 1000);
      expect(constants.seed_nonce_revelation_tip.toString()).toEqual('125000');
      expect(constants).toHaveProperty('origination_size', 257);
      expect(constants.block_security_deposit.toString()).toEqual('512000000');
      expect(constants.endorsement_security_deposit.toString()).toEqual('64000000');
      expect(constants.block_reward?.toString()).toEqual('16000000');
      expect(constants.endorsement_reward.toString()).toEqual('2000000');
      expect(constants.cost_per_byte.toString()).toEqual('1000');
      expect(constants.hard_storage_limit_per_operation.toString()).toEqual('60000');
      expect(constants.test_chain_duration?.toString()).toEqual('1966080');
      expect(constants).toHaveProperty('quorum_min', 2000);
      expect(constants).toHaveProperty('quorum_max', 7000);
      expect(constants).toHaveProperty('min_proposal_quorum', 500);
      expect(constants).toHaveProperty('initial_endorsers', 24);
      expect(constants.delay_per_missing_endorsement?.toString()).toEqual('8');
      done();
    });

    it('Verify that rpc.getConstants successfully fetches Proto6 constants at level 900000', async (done) => {
      const constants = await Tezos.rpc.getConstants({ block: '900000' });
      expect(Object.keys(constants)).toHaveLength(31);
      expect(constants).toHaveProperty('proof_of_work_nonce_size', 8);
      expect(constants).toHaveProperty('nonce_length', 32);
      expect(constants).toHaveProperty('max_revelations_per_block', 32);
      expect(constants).toHaveProperty('max_operation_data_length', 16384);
      expect(constants).toHaveProperty('max_proposals_per_delegate', 20);
      expect(constants).toHaveProperty('preserved_cycles', 5);
      expect(constants).toHaveProperty('blocks_per_cycle', 4096);
      expect(constants).toHaveProperty('blocks_per_commitment', 32);
      expect(constants).toHaveProperty('blocks_per_roll_snapshot', 256);
      expect(constants).toHaveProperty('blocks_per_voting_period', 32768);
      expect(constants.time_between_blocks.toString()).toEqual('60,40');
      expect(constants).toHaveProperty('endorsers_per_block', 32);
      expect(constants.hard_gas_limit_per_operation.toString()).toEqual('1040000');
      expect(constants.hard_gas_limit_per_block.toString()).toEqual('10400000');
      expect(constants.proof_of_work_threshold.toString()).toEqual('70368744177663');
      expect(constants.tokens_per_roll.toString()).toEqual('8000000000');
      expect(constants).toHaveProperty('michelson_maximum_type_size', 1000);
      expect(constants.seed_nonce_revelation_tip.toString()).toEqual('125000');
      expect(constants).toHaveProperty('origination_size', 257);
      expect(constants.block_security_deposit.toString()).toEqual('512000000');
      expect(constants.endorsement_security_deposit.toString()).toEqual('64000000');
      expect(constants.baking_reward_per_endorsement?.toString()).toEqual('1250000,187500');
      expect(constants.endorsement_reward.toString()).toEqual('1250000,833333');
      expect(constants.cost_per_byte.toString()).toEqual('1000');
      expect(constants.hard_storage_limit_per_operation.toString()).toEqual('60000');
      expect(constants.test_chain_duration?.toString()).toEqual('1966080');
      expect(constants).toHaveProperty('quorum_min', 2000);
      expect(constants).toHaveProperty('quorum_max', 7000);
      expect(constants).toHaveProperty('min_proposal_quorum', 500);
      expect(constants).toHaveProperty('initial_endorsers', 24);
      expect(constants.delay_per_missing_endorsement?.toString()).toEqual('8');
      done();
    });

    it('Verify that rpc.getConstants successfully fetches Proto7 constants at level 1212416', async (done) => {
      const constants = await Tezos.rpc.getConstants({ block: '1212416' });
      expect(Object.keys(constants)).toHaveLength(31);
      expect(constants).toHaveProperty('proof_of_work_nonce_size', 8);
      expect(constants).toHaveProperty('nonce_length', 32);
      expect(constants).toHaveProperty('max_operation_data_length', 16384);
      expect(constants).toHaveProperty('max_proposals_per_delegate', 20);
      expect(constants).toHaveProperty('preserved_cycles', 5);
      expect(constants).toHaveProperty('blocks_per_cycle', 4096);
      expect(constants).toHaveProperty('blocks_per_commitment', 32);
      expect(constants).toHaveProperty('blocks_per_roll_snapshot', 256);
      expect(constants).toHaveProperty('blocks_per_voting_period', 32768);
      expect(constants.time_between_blocks.toString()).toEqual('60,40');
      expect(constants).toHaveProperty('endorsers_per_block', 32);
      expect(constants.hard_gas_limit_per_operation.toString()).toEqual('1040000');
      expect(constants.hard_gas_limit_per_block.toString()).toEqual('10400000');
      expect(constants.proof_of_work_threshold.toString()).toEqual('70368744177663');
      expect(constants.tokens_per_roll.toString()).toEqual('8000000000');
      expect(constants).toHaveProperty('michelson_maximum_type_size', 1000);
      expect(constants.seed_nonce_revelation_tip.toString()).toEqual('125000');
      expect(constants).toHaveProperty('origination_size', 257);
      expect(constants.block_security_deposit.toString()).toEqual('512000000');
      expect(constants.endorsement_security_deposit.toString()).toEqual('64000000');
      expect(constants.baking_reward_per_endorsement?.toString()).toEqual('1250000,187500');
      expect(constants.endorsement_reward.toString()).toEqual('1250000,833333');
      expect(constants.cost_per_byte.toString()).toEqual('250');
      expect(constants.hard_storage_limit_per_operation.toString()).toEqual('60000');
      expect(constants.test_chain_duration?.toString()).toEqual('1966080');
      expect(constants).toHaveProperty('quorum_min', 2000);
      expect(constants).toHaveProperty('quorum_max', 7000);
      expect(constants).toHaveProperty('min_proposal_quorum', 500);
      expect(constants).toHaveProperty('initial_endorsers', 24);
      expect(constants.delay_per_missing_endorsement?.toString()).toEqual('8');
      done();
    });


    it('Verify that rpc.getConstants successfully fetches Proto8 constants at level 1350000', async (done) => {
      const constants = await Tezos.rpc.getConstants({ block: '1350000' });
      expect(Object.keys(constants)).toHaveLength(31);
      expect(constants).toHaveProperty('proof_of_work_nonce_size', 8);
      expect(constants).toHaveProperty('nonce_length', 32);
      expect(constants).toHaveProperty('max_operation_data_length', 16384);
      expect(constants).toHaveProperty('max_proposals_per_delegate', 20);
      expect(constants).toHaveProperty('preserved_cycles', 5);
      expect(constants).toHaveProperty('blocks_per_cycle', 4096);
      expect(constants).toHaveProperty('blocks_per_commitment', 32);
      expect(constants).toHaveProperty('blocks_per_roll_snapshot', 256);
      expect(constants).toHaveProperty('blocks_per_voting_period', 20480);
      expect(constants.time_between_blocks.toString()).toEqual('60,40');
      expect(constants).toHaveProperty('endorsers_per_block', 32);
      expect(constants.hard_gas_limit_per_operation.toString()).toEqual('1040000');
      expect(constants.hard_gas_limit_per_block.toString()).toEqual('10400000');
      expect(constants.proof_of_work_threshold.toString()).toEqual('70368744177663');
      expect(constants.tokens_per_roll.toString()).toEqual('8000000000');
      expect(constants).toHaveProperty('michelson_maximum_type_size', 1000);
      expect(constants.seed_nonce_revelation_tip.toString()).toEqual('125000');
      expect(constants).toHaveProperty('origination_size', 257);
      expect(constants.block_security_deposit.toString()).toEqual('512000000');
      expect(constants.endorsement_security_deposit.toString()).toEqual('64000000');
      expect(constants.baking_reward_per_endorsement?.toString()).toEqual('1250000,187500');
      expect(constants.endorsement_reward.toString()).toEqual('1250000,833333');
      expect(constants.cost_per_byte.toString()).toEqual('250');
      expect(constants.hard_storage_limit_per_operation.toString()).toEqual('60000');
      expect(constants.test_chain_duration?.toString()).toEqual('1228800');
      expect(constants).toHaveProperty('quorum_min', 2000);
      expect(constants).toHaveProperty('quorum_max', 7000);
      expect(constants).toHaveProperty('min_proposal_quorum', 500);
      expect(constants).toHaveProperty('initial_endorsers', 24);
      expect(constants.delay_per_missing_endorsement?.toString()).toEqual('8');
      done();
    });

    it('Verify that rpc.getConstants successfully fetches Proto9 constants at level 1480000', async (done) => {
      const constants: ConstantsResponseProto009 = await Tezos.rpc.getConstants({ block: '1480000' });

      expect(constants).toEqual({
        proof_of_work_nonce_size: 8,
        nonce_length: 32,
        max_anon_ops_per_block: 132,
        max_operation_data_length: 32768,
        max_proposals_per_delegate: 20,
        preserved_cycles: 5,
        blocks_per_cycle: 4096,
        blocks_per_commitment: 32,
        blocks_per_roll_snapshot: 256,
        blocks_per_voting_period: 20480,
        time_between_blocks: [new BigNumber(60), new BigNumber(40)],
        endorsers_per_block: 32,
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_gas_limit_per_block: new BigNumber(10400000),
        proof_of_work_threshold: new BigNumber(70368744177663),
        tokens_per_roll: new BigNumber(8000000000),
        michelson_maximum_type_size: 1000,
        seed_nonce_revelation_tip: new BigNumber(125000),
        origination_size: 257,
        block_security_deposit: new BigNumber(512000000),
        endorsement_security_deposit: new BigNumber(64000000),
        baking_reward_per_endorsement: [new BigNumber(1250000), new BigNumber(187500)],
        endorsement_reward: [new BigNumber(1250000), new BigNumber(833333)],
        cost_per_byte: new BigNumber(250),
        hard_storage_limit_per_operation: new BigNumber(60000),
        test_chain_duration: new BigNumber(0),
        quorum_min: 2000,
        quorum_max: 7000,
        min_proposal_quorum: 500,
        initial_endorsers: 24,
        delay_per_missing_endorsement: new BigNumber(8)
      });
      done();
    });

    it('Verify that rpc.getConstants successfully fetches Proto10 constants at level 1589492', async (done) => {
      const constants: ConstantsResponseProto010 = await Tezos.rpc.getConstants({ block: '1589492' });

      expect(constants).toEqual({
        proof_of_work_nonce_size: 8,
        nonce_length: 32,
        max_anon_ops_per_block: 132,
        max_operation_data_length: 32768,
        max_proposals_per_delegate: 20,
        preserved_cycles: 5,
        blocks_per_cycle: 8192,
        blocks_per_commitment: 64,
        blocks_per_roll_snapshot: 512,
        blocks_per_voting_period: 40960,
        time_between_blocks: [new BigNumber(60), new BigNumber(40)],
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
        minimal_block_delay: new BigNumber(30),
        liquidity_baking_subsidy: new BigNumber(2500000),
        liquidity_baking_sunset_level: 2032928,
        liquidity_baking_escape_ema_threshold: 1000000
      });
      done();
    });

    it('successfully fetches Proto11 constants at level 1932041', async (done) => {
      const constants: ConstantsResponseProto011 = await Tezos.rpc.getConstants({ block: '1932041' });

      expect(constants).toEqual({
        proof_of_work_nonce_size: 8,
        nonce_length: 32,
        max_anon_ops_per_block: 132,
        max_operation_data_length: 32768,
        max_proposals_per_delegate: 20,
        max_micheline_node_count: 50000,
        max_micheline_bytes_limit: 50000,
        max_allowed_global_constants_depth: 10000,
        cache_layout: [new BigNumber(100000000)],
        michelson_maximum_type_size: 2001,
        preserved_cycles: 5,
        blocks_per_cycle: 8192,
        blocks_per_commitment: 64,
        blocks_per_roll_snapshot: 512,
        blocks_per_voting_period: 40960,
        time_between_blocks: [new BigNumber(60), new BigNumber(40)],
        endorsers_per_block: 256,
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_gas_limit_per_block: new BigNumber(5200000),
        proof_of_work_threshold: new BigNumber(70368744177663),
        tokens_per_roll: new BigNumber(8000000000),
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
        minimal_block_delay: new BigNumber(30),
        liquidity_baking_subsidy: new BigNumber(2500000),
        liquidity_baking_sunset_level: 2244609,
        liquidity_baking_escape_ema_threshold: 1000000
      });
      done();
    });

    it('successfully fetches Proto12 constants at level 2354016', async (done) => {
      const constants: ConstantsResponseProto012 = await Tezos.rpc.getConstants({ block: '2354016' });

      expect(constants).toEqual({
        proof_of_work_nonce_size: 8,
        nonce_length: 32,
        max_anon_ops_per_block: 132,
        max_operation_data_length: 32768,
        max_proposals_per_delegate: 20,
        max_micheline_node_count: 50000,
        max_micheline_bytes_limit: 50000,
        max_allowed_global_constants_depth: 10000,
        cache_layout: [new BigNumber(100000000), new BigNumber(240000), new BigNumber(2560)],
        michelson_maximum_type_size: 2001,
        preserved_cycles: 5,
        blocks_per_cycle: 8192,
        blocks_per_commitment: 64,
        blocks_per_voting_period: 40960,
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_gas_limit_per_block: new BigNumber(5200000),
        proof_of_work_threshold: new BigNumber(70368744177663),
        tokens_per_roll: new BigNumber(6000000000),
        seed_nonce_revelation_tip: new BigNumber(125000),
        origination_size: 257,
        cost_per_byte: new BigNumber(250),
        hard_storage_limit_per_operation: new BigNumber(60000),
        quorum_min: 2000,
        quorum_max: 7000,
        min_proposal_quorum: 500,
        minimal_block_delay: new BigNumber(30),
        liquidity_baking_subsidy: new BigNumber(2500000),
        liquidity_baking_sunset_level: 3063809,
        liquidity_baking_escape_ema_threshold: 666667,
        blocks_per_stake_snapshot: 512,
        baking_reward_fixed_portion: new BigNumber('10000000'),
        baking_reward_bonus_per_slot: new BigNumber(4286),
        endorsing_reward_per_slot: new BigNumber(2857),
        max_operations_time_to_live: 120,
        consensus_committee_size: 7000,
        consensus_threshold: 4667,
        minimal_participation_ratio: {
          numerator: 2,
          denominator: 3
        },
        max_slashing_period: 2,
        frozen_deposits_percentage: 10,
        double_baking_punishment: new BigNumber(640000000),
        ratio_of_frozen_deposits_slashed_per_double_endorsement: {
          numerator: 1,
          denominator: 2
        },
        delay_increment_per_round: new BigNumber(15),
      });
      done();
    });

    it('successfully fetches Proto13 constants at level 2656071', async (done) => {
      const constants: ConstantsResponseProto013 = await Tezos.rpc.getConstants({ block: '2656071' });

      expect(constants).toEqual({
        proof_of_work_nonce_size: 8,
        nonce_length: 32,
        max_anon_ops_per_block: 132,
        max_operation_data_length: 32768,
        max_proposals_per_delegate: 20,
        preserved_cycles: 5,
        blocks_per_cycle: 8192,
        blocks_per_commitment: 64,
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_gas_limit_per_block: new BigNumber(5200000),
        proof_of_work_threshold: new BigNumber(70368744177663),
        tokens_per_roll: new BigNumber(6000000000),
        seed_nonce_revelation_tip: new BigNumber(125000),
        origination_size: 257,
        cost_per_byte: new BigNumber(250),
        hard_storage_limit_per_operation: new BigNumber(60000),
        quorum_min: 2000,
        quorum_max: 7000,
        min_proposal_quorum: 500,
        liquidity_baking_subsidy: new BigNumber(2500000),
        liquidity_baking_sunset_level: 3063809,
        liquidity_baking_toggle_ema_threshold: 1000000000,
        max_allowed_global_constants_depth: 10000,
        max_micheline_bytes_limit: 50000,
        max_micheline_node_count: 50000,
        michelson_maximum_type_size: 2001,
        blocks_per_stake_snapshot: 512,
        baking_reward_fixed_portion: new BigNumber(10000000),
        baking_reward_bonus_per_slot: new BigNumber(4286),
        endorsing_reward_per_slot: new BigNumber(2857),
        max_operations_time_to_live: 120,
        consensus_committee_size: 7000,
        consensus_threshold: 4667,
        minimal_participation_ratio: {
          denominator: 3,
          numerator: 2,
        },
        max_slashing_period: 2,
        frozen_deposits_percentage: 10,
        double_baking_punishment: new BigNumber(640000000),
        ratio_of_frozen_deposits_slashed_per_double_endorsement: {
          denominator: 2,
          numerator: 1,
        },
        minimal_block_delay: new BigNumber(30),
        delay_increment_per_round: new BigNumber(15),
        cache_layout_size: 3,
        cache_sampler_state_cycles: 8,
        cache_script_size: 100000000,
        cache_stake_distribution_cycles: 8,
        cycles_per_voting_period: 5,
        sc_rollup_challenge_window_in_blocks: 20160,
        sc_rollup_enable: false,
        sc_rollup_max_available_messages: 1000000,
        sc_rollup_origination_size: 6314,
        tx_rollup_commitment_bond: new BigNumber(10000000000),
        tx_rollup_cost_per_byte_ema_factor: 120,
        tx_rollup_enable: true,
        tx_rollup_finality_period: 40000,
        tx_rollup_hard_size_limit_per_inbox: 500000,
        tx_rollup_hard_size_limit_per_message: 5000,
        tx_rollup_max_commitments_count: 80100,
        tx_rollup_max_inboxes_count: 40100,
        tx_rollup_max_messages_per_inbox: 1010,
        tx_rollup_max_ticket_payload_size: 2048,
        tx_rollup_max_withdrawals_per_batch: 15,
        tx_rollup_origination_size: 4000,
        tx_rollup_rejection_max_proof_size: 30000,
        tx_rollup_sunset_level: 3473409,
        tx_rollup_withdraw_period: 40000,
      });
      done();
    });
  });

  describe(`Fetch constants for testnet`, () => {

    limanet(`successfully fetches all constants for limanet using ${rpc}`, async (done) => {
      Tezos.setRpcProvider(rpc);
      const constants: ConstantsResponseProto015 = await Tezos.rpc.getConstants();

      expect(constants).toEqual({
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
        sc_max_wrapped_proof_binary_size: 30000,
        sc_rollup_message_size_limit: 4096,
        preserved_cycles: 3,
        blocks_per_cycle: 4096,
        blocks_per_commitment: 32,
        nonce_revelation_threshold: 256,
        blocks_per_stake_snapshot: 256,
        cycles_per_voting_period: 1,
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_gas_limit_per_block: new BigNumber(5200000),
        proof_of_work_threshold: new BigNumber(-1),
        minimal_stake: new BigNumber(6000000000),
        vdf_difficulty: new BigNumber(2000000000),
        seed_nonce_revelation_tip: new BigNumber(125000),
        origination_size: 257,
        baking_reward_fixed_portion: new BigNumber(10000000),
        baking_reward_bonus_per_slot: new BigNumber(4286),
        endorsing_reward_per_slot: new BigNumber(2857),
        cost_per_byte: new BigNumber(250),
        hard_storage_limit_per_operation: new BigNumber(60000),
        quorum_min: 2000,
        quorum_max: 7000,
        min_proposal_quorum: 500,
        liquidity_baking_subsidy: new BigNumber(2500000),
        liquidity_baking_toggle_ema_threshold: 1000000000,
        max_operations_time_to_live: 120,
        minimal_block_delay: new BigNumber(15),
        delay_increment_per_round: new BigNumber(5),
        consensus_committee_size: 7000,
        consensus_threshold: 4667,
        minimal_participation_ratio: {
          numerator: 2,
          denominator: 3
        },
        max_slashing_period: 2,
        frozen_deposits_percentage: 10,
        double_baking_punishment: new BigNumber(640000000),
        ratio_of_frozen_deposits_slashed_per_double_endorsement: {
          numerator: 1,
          denominator: 2
        },
        testnet_dictator: 'tz1Xf8zdT3DbAX9cHw3c3CXh79rc4nK4gCe8',
        cache_script_size: 100000000,
        cache_stake_distribution_cycles: 8,
        cache_sampler_state_cycles: 8,
        tx_rollup_enable: true,
        tx_rollup_origination_size: 4000,
        tx_rollup_hard_size_limit_per_inbox: 500000,
        tx_rollup_hard_size_limit_per_message: 5000,
        tx_rollup_max_withdrawals_per_batch: 15,
        tx_rollup_commitment_bond: new BigNumber(10000000000),
        tx_rollup_finality_period: 40000,
        tx_rollup_withdraw_period: 40000,
        tx_rollup_max_inboxes_count: 40100,
        tx_rollup_max_messages_per_inbox: 1010,
        tx_rollup_max_commitments_count: 80100,
        tx_rollup_cost_per_byte_ema_factor: 120,
        tx_rollup_max_ticket_payload_size: 2048,
        tx_rollup_rejection_max_proof_size: 30000,
        tx_rollup_sunset_level: 10000000,
        dal_parametric: {
          feature_enable: false,
          number_of_slots: 256,
          number_of_shards: 2048,
          endorsement_lag: 1,
          availability_threshold: 50,
          slot_size: 1048576,
          redundancy_factor: 16,
          page_size: 4096
        },
        sc_rollup_enable: false,
        sc_rollup_origination_size: 6314,
        sc_rollup_challenge_window_in_blocks: 20160,
        sc_rollup_max_number_of_messages_per_commitment_period: 300000000,
        sc_rollup_stake_amount: new BigNumber(10000000000),
        sc_rollup_commitment_period_in_blocks: 30,
        sc_rollup_max_lookahead_in_blocks: 30000,
        sc_rollup_max_active_outbox_levels: 20160,
        sc_rollup_max_outbox_messages_per_level: 100,
        sc_rollup_number_of_sections_in_dissection: 32,
        sc_rollup_timeout_period_in_blocks: 20160,
        sc_rollup_max_number_of_cemented_commitments: 5,
        zk_rollup_enable: false,
        zk_rollup_origination_size: 4000,
        zk_rollup_min_pending_to_process: 10
      });

      done();
    });


    alpha(`successfully fetches all constants for mondaynet using ${rpc}`, async (done) => {
      Tezos.setRpcProvider(rpc);
      const constants: ConstantsResponseProto015 = await Tezos.rpc.getConstants();

      expect(constants).toEqual({
        proof_of_work_nonce_size: 8,
        nonce_length: 32,
        nonce_revelation_threshold: 64,
        max_anon_ops_per_block: 132,
        max_operation_data_length: 32768,
        max_proposals_per_delegate: 20,
        preserved_cycles: 3,
        blocks_per_cycle: 256,
        blocks_per_commitment: 32,
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_gas_limit_per_block: new BigNumber(2600000),
        proof_of_work_threshold: new BigNumber(-1),
        seed_nonce_revelation_tip: new BigNumber(125000),
        origination_size: 257,
        cost_per_byte: new BigNumber(250),
        hard_storage_limit_per_operation: new BigNumber(60000),
        quorum_min: 2000,
        quorum_max: 7000,
        min_proposal_quorum: 500,
        liquidity_baking_subsidy: new BigNumber(666666),
        liquidity_baking_toggle_ema_threshold: 100000,
        max_allowed_global_constants_depth: 10000,
        max_micheline_bytes_limit: 50000,
        max_micheline_node_count: 50000,
        michelson_maximum_type_size: 2001,
        blocks_per_stake_snapshot: 128,
        baking_reward_fixed_portion: new BigNumber(2666666),
        baking_reward_bonus_per_slot: new BigNumber(1143),
        endorsing_reward_per_slot: new BigNumber(761),
        max_operations_time_to_live: 240,
        consensus_committee_size: 7000,
        consensus_threshold: 4667,
        minimal_participation_ratio: {
          denominator: 3,
          numerator: 2,
        },
        max_slashing_period: 2,
        frozen_deposits_percentage: 10,
        double_baking_punishment: new BigNumber(640000000),
        ratio_of_frozen_deposits_slashed_per_double_endorsement: {
          denominator: 2,
          numerator: 1,
        },
        minimal_block_delay: new BigNumber(8),
        delay_increment_per_round: new BigNumber(8),
        dal_parametric: {
          attestation_lag: 2,
          attestation_threshold: 50,
          feature_enable: true,
          number_of_shards: 2048,
          number_of_slots: 256,
          page_size: 4096,
          redundancy_factor: 16,
          slot_size: 1048576,
          blocks_per_epoch: 32,
        },
        minimal_stake: new BigNumber('6000000000'),
        cache_layout_size: 3,
        cache_sampler_state_cycles: 8,
        cache_script_size: 100000000,
        cache_stake_distribution_cycles: 8,
        cycles_per_voting_period: 1,
        smart_rollup_arith_pvm_enable: false,
        smart_rollup_challenge_window_in_blocks: 80640,
        smart_rollup_commitment_period_in_blocks: 60,
        smart_rollup_enable: true,
        smart_rollup_max_active_outbox_levels: 80640,
        smart_rollup_max_lookahead_in_blocks: 172800,
        smart_rollup_max_number_of_cemented_commitments: 5,
        smart_rollup_max_number_of_messages_per_level: "1000000",
        smart_rollup_max_number_of_parallel_games: 32,
        smart_rollup_max_outbox_messages_per_level: 100,
        smart_rollup_max_wrapped_proof_binary_size: 30000,
        smart_rollup_message_size_limit: 4096,
        smart_rollup_number_of_sections_in_dissection: 32,
        smart_rollup_origination_size: 6314,
        smart_rollup_stake_amount: "32000000",
        smart_rollup_timeout_period_in_blocks: 40320,
        tx_rollup_commitment_bond: new BigNumber(10000000000),
        tx_rollup_cost_per_byte_ema_factor: 120,
        tx_rollup_enable: false,
        tx_rollup_finality_period: 10,
        tx_rollup_hard_size_limit_per_inbox: 500000,
        tx_rollup_hard_size_limit_per_message: 5000,
        tx_rollup_max_commitments_count: 30,
        tx_rollup_max_inboxes_count: 15,
        tx_rollup_max_messages_per_inbox: 1010,
        tx_rollup_max_ticket_payload_size: 2048,
        tx_rollup_max_withdrawals_per_batch: 15,
        tx_rollup_origination_size: 4000,
        tx_rollup_rejection_max_proof_size: 30000,
        tx_rollup_sunset_level: 10000000,
        tx_rollup_withdraw_period: 10,
        vdf_difficulty: new BigNumber('10000000'),
        zk_rollup_enable: true,
        zk_rollup_min_pending_to_process: 10,
        zk_rollup_origination_size: 4000,
      });

      done();
    });
  });
});
