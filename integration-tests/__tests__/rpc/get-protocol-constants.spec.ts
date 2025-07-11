import { Protocols } from '@taquito/taquito';
import { CONFIGS, NetworkType } from '../../config';
import BigNumber from 'bignumber.js';
import { ConstantsResponseProto021, ConstantsResponseProto022, ConstantsResponseProto023 } from '@taquito/rpc';

CONFIGS().forEach(({ lib, protocol, rpc, networkType }) => {
  const Tezos = lib;
  const weeklynet = (networkType == NetworkType.TESTNET && protocol === Protocols.ProtoALpha) ? test : test.skip;
  const rionet = (networkType == NetworkType.TESTNET && protocol === Protocols.PsRiotuma) ? test : test.skip;
  const seoulnet = (networkType == NetworkType.TESTNET && protocol === Protocols.PtSeouLou) ? test : test.skip;

  describe('Test fetching constants for all protocols on Mainnet', () => {
    const rpcUrl = 'https://mainnet.tezos.ecadinfra.com/';
    Tezos.setRpcProvider(rpcUrl);
    it(`should successfully fetch Proto22(Rio) constants at head`, async () => {
      const constants: ConstantsResponseProto021 = await Tezos.rpc.getConstants();
      expect(constants).toEqual(   {
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
        denunciation_period: 1,
        slashing_delay: 1,
        smart_rollup_max_wrapped_proof_binary_size: 30000,
        smart_rollup_message_size_limit: 4096,
        smart_rollup_max_number_of_messages_per_level: '1000000',
        consensus_rights_delay: 2,
        blocks_preservation_cycles: 1,
        delegate_parameters_activation_delay: 5,
        tolerated_inactivity_period: 2,
        blocks_per_cycle: 10800,
        blocks_per_commitment: 240,
        nonce_revelation_threshold: 960,
        cycles_per_voting_period: 14,
        hard_gas_limit_per_operation: new BigNumber('1040000'),
        hard_gas_limit_per_block: new BigNumber ('1386666'),
        proof_of_work_threshold: new BigNumber ("281474976710655"),
        minimal_stake: new BigNumber ('6000000000'),
        minimal_frozen_stake: '600000000',
        vdf_difficulty: new BigNumber ('8000000000'),
        origination_size: 257,
        issuance_weights: {
          base_total_issued_per_minute: '80007812',
          baking_reward_fixed_portion_weight: 5120,
          baking_reward_bonus_weight: 5120,
          attesting_reward_weight: 10240,
          seed_nonce_revelation_tip_weight: 1,
          vdf_revelation_tip_weight: 1,
          dal_rewards_weight: 2275
        },
        cost_per_byte: new BigNumber ('250'),
        hard_storage_limit_per_operation: new BigNumber ('60000'),
        quorum_min: 2000,
        quorum_max: 7000,
        min_proposal_quorum: 500,
        liquidity_baking_subsidy: new BigNumber ('5000000'),
        liquidity_baking_toggle_ema_threshold: 1000000000,
        max_operations_time_to_live: 450,
        minimal_block_delay: new BigNumber ('8'),
        delay_increment_per_round: new BigNumber ('4'),
        consensus_committee_size: 7000,
        consensus_threshold_size: 4667,
        minimal_participation_ratio: { numerator: 2, denominator: 3 },
        limit_of_delegation_over_baking: 9,
        percentage_of_frozen_deposits_slashed_per_double_baking: 500,
        max_slashing_per_block: 10000,
        max_slashing_threshold: { numerator: 1, denominator: 3 },
        cache_script_size: 100000000,
        cache_stake_distribution_cycles: 5,
        cache_sampler_state_cycles: 5,
        dal_parametric: {
          feature_enable: true,
          incentives_enable: true,
          number_of_slots: 32,
          attestation_lag: 8,
          attestation_threshold: 66,
          minimal_participation_ratio: { numerator: '16', denominator: '25' },
          rewards_ratio: { numerator: '1', denominator: '10' },
          traps_fraction: { numerator: '1', denominator: '2000' },
          redundancy_factor: 8,
          page_size: 3967,
          slot_size: 126944,
          number_of_shards: 512
        },
        smart_rollup_arith_pvm_enable: false,
        smart_rollup_origination_size: 6314,
        smart_rollup_challenge_window_in_blocks: 151200,
        smart_rollup_stake_amount: '10000000000',
        smart_rollup_commitment_period_in_blocks: 112,
        smart_rollup_max_lookahead_in_blocks: 324000,
        smart_rollup_max_active_outbox_levels: 151200,
        smart_rollup_max_outbox_messages_per_level: 100,
        smart_rollup_number_of_sections_in_dissection: 32,
        smart_rollup_timeout_period_in_blocks: 75600,
        smart_rollup_max_number_of_cemented_commitments: 5,
        smart_rollup_max_number_of_parallel_games: 32,
        smart_rollup_reveal_activation_level: {
          raw_data: { Blake2B: 0 },
          metadata: 0,
          dal_page: 5726209,
          dal_parameters: 5726209,
          dal_attested_slots_validity_lag: 241920
        },
        smart_rollup_private_enable: true,
        smart_rollup_riscv_pvm_enable: false,
        zk_rollup_enable: false,
        zk_rollup_origination_size: 4000,
        zk_rollup_min_pending_to_process: 10,
        zk_rollup_max_ticket_payload_size: 2048,
        global_limit_of_staking_over_baking: 9,
        edge_of_staking_over_delegation: 3,
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
          radius_dz: { numerator: '1', denominator: '50' }
        },
        direct_ticket_spending_enable: false,
        aggregate_attestation: false,
        allow_tz4_delegate_enable: false,
        all_bakers_attest_activation_level: null,
        issuance_modification_delay: 2,
        consensus_key_activation_delay: 2,
        unstake_finalization_delay: 3
      });
    });
  });

  describe(`Fetch constants for testnet`, () => {
    seoulnet(`should successfully fetch all constants for Seoulnet
      using ${rpc}`, async () => {
      Tezos.setRpcProvider(rpc);
      const constants: ConstantsResponseProto023 = await Tezos.rpc.getConstants();
      // console.log(JSON.stringify(constants, null, 2))
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
        denunciation_period: 1,
        slashing_delay: 1,
        smart_rollup_max_wrapped_proof_binary_size: 30000,
        smart_rollup_message_size_limit: 4096,
        smart_rollup_max_number_of_messages_per_level: '1000000',
        consensus_rights_delay: 2,
        blocks_preservation_cycles: 1,
        delegate_parameters_activation_delay: 3,
        tolerated_inactivity_period: 2,
        blocks_per_cycle: 300,
        blocks_per_commitment: 25,
        nonce_revelation_threshold: 50,
        cycles_per_voting_period: 1,
        hard_gas_limit_per_operation: new BigNumber('1040000'),
        hard_gas_limit_per_block: new BigNumber('1386666'),
        proof_of_work_threshold: new BigNumber('-1'),
        minimal_stake: new BigNumber('6000000000'),
        minimal_frozen_stake: '600000000',
        vdf_difficulty: new BigNumber('10000000'),
        origination_size: 257,
        issuance_weights: {
          base_total_issued_per_minute: '85007812',
          baking_reward_fixed_portion_weight: 5120,
          baking_reward_bonus_weight: 5120,
          attesting_reward_weight: 10240,
          seed_nonce_revelation_tip_weight: 1,
          vdf_revelation_tip_weight: 1,
          dal_rewards_weight: 2275
        },
        cost_per_byte: new BigNumber(250),
        hard_storage_limit_per_operation: new BigNumber(60000),
        quorum_min: 2000,
        quorum_max: 7000,
        min_proposal_quorum: 500,
        liquidity_baking_subsidy: new BigNumber(5000000),
        liquidity_baking_toggle_ema_threshold: 100000,
        max_operations_time_to_live: 150,
        minimal_block_delay: new BigNumber(4),
        delay_increment_per_round: new BigNumber(2),
        consensus_committee_size: 7000,
        consensus_threshold_size: 4667,
        minimal_participation_ratio: {
          numerator: 2,
          denominator: 3
        },
        limit_of_delegation_over_baking: 9,
        percentage_of_frozen_deposits_slashed_per_double_baking: 500,
        max_slashing_per_block: 10000,
        max_slashing_threshold: {
          numerator: 1,
          denominator: 3
        },
        testnet_dictator: 'tz1e1TX7KghsqWUBXWmBTAAtPK3W6JTbNc82',
        cache_script_size: 100000000,
        cache_stake_distribution_cycles: 5,
        cache_sampler_state_cycles: 5,
        dal_parametric: {
          feature_enable: true,
          incentives_enable: false,
          number_of_slots: 32,
          attestation_lag: 8,
          attestation_threshold: 66,
          minimal_participation_ratio: {
            numerator: '16',
            denominator: '25'
          },
          rewards_ratio: {
            numerator: '1',
            denominator: '10'
          },
          traps_fraction: {
            numerator: '1',
            denominator: '2000'
          },
          redundancy_factor: 8,
          page_size: 3967,
          slot_size: 126944,
          number_of_shards: 512
        },
        smart_rollup_arith_pvm_enable: true,
        smart_rollup_origination_size: 6314,
        smart_rollup_challenge_window_in_blocks: 62,
        smart_rollup_stake_amount: '32000000',
        smart_rollup_commitment_period_in_blocks: 31,
        smart_rollup_max_lookahead_in_blocks: 46875,
        smart_rollup_max_active_outbox_levels: 31500,
        smart_rollup_max_outbox_messages_per_level: 100,
        smart_rollup_number_of_sections_in_dissection: 32,
        smart_rollup_timeout_period_in_blocks: 781,
        smart_rollup_max_number_of_cemented_commitments: 5,
        smart_rollup_max_number_of_parallel_games: 32,
        smart_rollup_reveal_activation_level: {
          raw_data: {
            Blake2B: 0
          },
          metadata: 0,
          dal_page: 1,
          dal_parameters: 1,
          dal_attested_slots_validity_lag: 241920
        },
        smart_rollup_private_enable: true,
        smart_rollup_riscv_pvm_enable: true,
        zk_rollup_enable: true,
        zk_rollup_origination_size: 4000,
        zk_rollup_min_pending_to_process: 10,
        zk_rollup_max_ticket_payload_size: 2048,
        global_limit_of_staking_over_baking: 9,
        edge_of_staking_over_delegation: 3,
        adaptive_rewards_params: {
          issuance_ratio_final_min: {
            numerator: '1',
            denominator: '400'
          },
          issuance_ratio_final_max: {
            numerator: '1',
            denominator: '10'
          },
          issuance_ratio_initial_min: {
            numerator: '9',
            denominator: '200'
          },
          issuance_ratio_initial_max: {
            numerator: '11',
            denominator: '200'
          },
          initial_period: 10,
          transition_period: 50,
          max_bonus: '50000000000000',
          growth_rate: {
            numerator: '1',
            denominator: '100'
          },
          center_dz: {
            numerator: '1',
            denominator: '2'
          },
          radius_dz: {
            numerator: '1',
            denominator: '50'
          }
        },
        direct_ticket_spending_enable: false,
        aggregate_attestation: true,
        allow_tz4_delegate_enable: true,
        all_bakers_attest_activation_level: null,
        issuance_modification_delay: 2,
        consensus_key_activation_delay: 2,
        unstake_finalization_delay: 3
      });
    });

    rionet(`should successfully fetch all constants for Rionet
      using ${rpc}`, async () => {
      Tezos.setRpcProvider(rpc);
      const constants: ConstantsResponseProto022 = await Tezos.rpc.getConstants();
      // console.log(JSON.stringify(constants, null, 2))
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
        denunciation_period: 1,
        slashing_delay: 1,
        smart_rollup_max_wrapped_proof_binary_size: 30000,
        smart_rollup_message_size_limit: 4096,
        smart_rollup_max_number_of_messages_per_level: '1000000',
        consensus_rights_delay: 2,
        blocks_preservation_cycles: 1,
        delegate_parameters_activation_delay: 3,
        tolerated_inactivity_period: 2,
        blocks_per_cycle: 900,
        blocks_per_commitment: 25,
        nonce_revelation_threshold: 50,
        cycles_per_voting_period: 1,
        hard_gas_limit_per_operation: new BigNumber('1040000'),
        hard_gas_limit_per_block: new BigNumber('1386666'),
        proof_of_work_threshold: new BigNumber('-1'),
        minimal_stake: new BigNumber('6000000000'),
        minimal_frozen_stake: '600000000',
        vdf_difficulty: new BigNumber('10000000'),
        origination_size: 257,
        issuance_weights: {
          base_total_issued_per_minute: '85007812',
          baking_reward_fixed_portion_weight: 5120,
          baking_reward_bonus_weight: 5120,
          attesting_reward_weight: 10240,
          seed_nonce_revelation_tip_weight: 1,
          vdf_revelation_tip_weight: 1,
          dal_rewards_weight: 2275
        },
        cost_per_byte: new BigNumber(250),
        hard_storage_limit_per_operation: new BigNumber(60000),
        quorum_min: 2000,
        quorum_max: 7000,
        min_proposal_quorum: 500,
        liquidity_baking_subsidy: new BigNumber(5000000),
        liquidity_baking_toggle_ema_threshold: 100000,
        max_operations_time_to_live: 150,
        minimal_block_delay: new BigNumber(4),
        delay_increment_per_round: new BigNumber(2),
        consensus_committee_size: 7000,
        consensus_threshold_size: 4667,
        minimal_participation_ratio: {
          numerator: 2,
          denominator: 3
        },
        limit_of_delegation_over_baking: 9,
        percentage_of_frozen_deposits_slashed_per_double_baking: 500,
        max_slashing_per_block: 10000,
        max_slashing_threshold: {
          numerator: 1,
          denominator: 3
        },
        testnet_dictator: 'tz1e1TX7KghsqWUBXWmBTAAtPK3W6JTbNc82',
        cache_script_size: 100000000,
        cache_stake_distribution_cycles: 5,
        cache_sampler_state_cycles: 5,
        dal_parametric: {
          feature_enable: true,
          incentives_enable: true,
          number_of_slots: 32,
          attestation_lag: 8,
          attestation_threshold: 66,
          minimal_participation_ratio: {
            numerator: '16',
            denominator: '25'
          },
          rewards_ratio: {
            numerator: '1',
            denominator: '10'
          },
          traps_fraction: {
            numerator: '1',
            denominator: '2000'
          },
          redundancy_factor: 8,
          page_size: 3967,
          slot_size: 126944,
          number_of_shards: 512
        },
        smart_rollup_arith_pvm_enable: true,
        smart_rollup_origination_size: 6314,
        smart_rollup_challenge_window_in_blocks: 62,
        smart_rollup_stake_amount: '32000000',
        smart_rollup_commitment_period_in_blocks: 31,
        smart_rollup_max_lookahead_in_blocks: 46875,
        smart_rollup_max_active_outbox_levels: 31500,
        smart_rollup_max_outbox_messages_per_level: 100,
        smart_rollup_number_of_sections_in_dissection: 32,
        smart_rollup_timeout_period_in_blocks: 781,
        smart_rollup_max_number_of_cemented_commitments: 5,
        smart_rollup_max_number_of_parallel_games: 32,
        smart_rollup_reveal_activation_level: {
          raw_data: {
            Blake2B: 0
          },
          metadata: 0,
          dal_page: 1,
          dal_parameters: 1,
          dal_attested_slots_validity_lag: 241920
        },
        smart_rollup_private_enable: true,
        smart_rollup_riscv_pvm_enable: true,
        zk_rollup_enable: true,
        zk_rollup_origination_size: 4000,
        zk_rollup_min_pending_to_process: 10,
        zk_rollup_max_ticket_payload_size: 2048,
        global_limit_of_staking_over_baking: 9,
        edge_of_staking_over_delegation: 3,
        adaptive_rewards_params: {
          issuance_ratio_final_min: {
            numerator: '1',
            denominator: '400'
          },
          issuance_ratio_final_max: {
            numerator: '1',
            denominator: '10'
          },
          issuance_ratio_initial_min: {
            numerator: '9',
            denominator: '200'
          },
          issuance_ratio_initial_max: {
            numerator: '11',
            denominator: '200'
          },
          initial_period: 10,
          transition_period: 50,
          max_bonus: '50000000000000',
          growth_rate: {
            numerator: '1',
            denominator: '100'
          },
          center_dz: {
            numerator: '1',
            denominator: '2'
          },
          radius_dz: {
            numerator: '1',
            denominator: '50'
          }
        },
        direct_ticket_spending_enable: false,
        aggregate_attestation: false,
        allow_tz4_delegate_enable: false,
        all_bakers_attest_activation_level: null,
        issuance_modification_delay: 2,
        consensus_key_activation_delay: 2,
        unstake_finalization_delay: 3
      });
    });

    weeklynet(`should successfully fetch all constants for weeklynet using ${rpc}`, async () => {
      Tezos.setRpcProvider(rpc);
      const constants: ConstantsResponseProto022 = await Tezos.rpc.getConstants();

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
        denunciation_period: 1,
        slashing_delay: 1,
        smart_rollup_max_wrapped_proof_binary_size: 30000,
        smart_rollup_message_size_limit: 4096,
        smart_rollup_max_number_of_messages_per_level: '1000000',
        consensus_rights_delay: 2,
        blocks_preservation_cycles: 1,
        delegate_parameters_activation_delay: 3,
        tolerated_inactivity_period: 1,
        blocks_per_cycle: 200,
        blocks_per_commitment: 25,
        nonce_revelation_threshold: 50,
        cycles_per_voting_period: 1,
        hard_gas_limit_per_operation: new BigNumber('1040000'),
        hard_gas_limit_per_block: new BigNumber('3328000'),
        proof_of_work_threshold: new BigNumber('-1'),
        minimal_stake: new BigNumber('6000000000'),
        minimal_frozen_stake: '600000000',
        vdf_difficulty: new BigNumber('10000000'),
        origination_size: 257,
        issuance_weights: {
          base_total_issued_per_minute: '85007812',
          baking_reward_fixed_portion_weight: 5120,
          baking_reward_bonus_weight: 5120,
          attesting_reward_weight: 10240,
          seed_nonce_revelation_tip_weight: 1,
          vdf_revelation_tip_weight: 1,
          dal_rewards_weight: 0
        },
        cost_per_byte: new BigNumber(250),
        hard_storage_limit_per_operation: new BigNumber(60000),
        quorum_min: 2000,
        quorum_max: 7000,
        min_proposal_quorum: 500,
        liquidity_baking_subsidy: new BigNumber(5000000),
        liquidity_baking_toggle_ema_threshold: 100000,
        max_operations_time_to_live: 120,
        minimal_block_delay: new BigNumber(4),
        delay_increment_per_round: new BigNumber(2),
        consensus_committee_size: 7000,
        consensus_threshold_size: 4667,
        minimal_participation_ratio: {
          numerator: 2,
          denominator: 3
        },
        limit_of_delegation_over_baking: 9,
        percentage_of_frozen_deposits_slashed_per_double_baking: 700,
        max_slashing_per_block: 10000,
        max_slashing_threshold: {
          numerator: 1,
          denominator: 3
        },
        cache_script_size: 100000000,
        cache_stake_distribution_cycles: 5,
        cache_sampler_state_cycles: 5,
        dal_parametric: {
          feature_enable: true,
          incentives_enable: true,
          number_of_slots: 32,
          attestation_lag: 8,
          attestation_threshold: 66,
          minimal_participation_ratio: {
            numerator: '16',
            denominator: '25'
          },
          rewards_ratio: {
            numerator: '1',
            denominator: '10'
          },
          traps_fraction: {
            numerator: '1',
            denominator: '2000'
          },
          redundancy_factor: 8,
          page_size: 3967,
          slot_size: 126944,
          number_of_shards: 512
        },
        smart_rollup_arith_pvm_enable: true,
        smart_rollup_origination_size: 6314,
        smart_rollup_challenge_window_in_blocks: 62,
        smart_rollup_stake_amount: '32000000',
        smart_rollup_commitment_period_in_blocks: 31,
        smart_rollup_max_lookahead_in_blocks: 346875,
        smart_rollup_max_active_outbox_levels: 31500,
        smart_rollup_max_outbox_messages_per_level: 100,
        smart_rollup_number_of_sections_in_dissection: 32,
        smart_rollup_timeout_period_in_blocks: 781,
        smart_rollup_max_number_of_cemented_commitments: 5,
        smart_rollup_max_number_of_parallel_games: 32,
        smart_rollup_reveal_activation_level: {
          raw_data: {
            Blake2B: 0
          },
          metadata: 0,
          dal_page: 1,
          dal_parameters: 1,
          dal_attested_slots_validity_lag: 80
        },
        smart_rollup_private_enable: true,
        smart_rollup_riscv_pvm_enable: true,
        zk_rollup_enable: true,
        zk_rollup_origination_size: 4000,
        zk_rollup_min_pending_to_process: 10,
        zk_rollup_max_ticket_payload_size: 2048,
        global_limit_of_staking_over_baking: 5,
        edge_of_staking_over_delegation: 2,
        adaptive_rewards_params: {
          issuance_ratio_final_min: {
            numerator: '1',
            denominator: '400'
          },
          issuance_ratio_final_max: {
            numerator: '1',
            denominator: '10'
          },
          issuance_ratio_initial_min: {
            numerator: '9',
            denominator: '200'
          },
          issuance_ratio_initial_max: {
            numerator: '11',
            denominator: '200'
          },
          initial_period: 10,
          transition_period: 50,
          max_bonus: '50000000000000',
          growth_rate: {
            numerator: '1',
            denominator: '100'
          },
          center_dz: {
            numerator: '1',
            denominator: '2'
          },
          radius_dz: {
            numerator: '1',
            denominator: '50'
          }
        },
        direct_ticket_spending_enable: false,
        aggregate_attestation: true,
        allow_tz4_delegate_enable: true,
        all_bakers_attest_activation_level: null,
        issuance_modification_delay: 2,
        consensus_key_activation_delay: 2,
        unstake_finalization_delay: 3
      });

    });
  });
});