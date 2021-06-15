import { TezosToolkit } from "@taquito/taquito";
import { ConstantsResponse } from "@taquito/rpc";

const rpcUrl = 'https://api.tez.ie/rpc/mainnet';
const delphinetUrl = 'https://api.tez.ie/rpc/delphinet';
const Tezos = new TezosToolkit(rpcUrl);

describe('Fetch constants for all protocols on Mainnet', () => {
    // tests
    it('succesfully fails at fetching constants for level 0', async (done) => {
        try {
            await Tezos.rpc.getConstants({ block: "0" });
            expect.assertions(1);
        } catch (ex) {
            expect(ex.message).toMatch('Http error response: (404) ');
        }
        done();
    })

       it('successfully fetches Proto1 constants at level 1', async (done) => {
        try {
            // Get constants for protocol
            const constants = await Tezos.rpc.getConstants({ block: "1" });
            expect(Object.keys(constants)).toHaveLength(24)
            expect(constants).toHaveProperty("proof_of_work_nonce_size", 8);
            expect(constants).toHaveProperty("nonce_length", 32);
            expect(constants).toHaveProperty("max_revelations_per_block", 32);
            expect(constants).toHaveProperty("max_operation_data_length", 16384);
            expect(constants).toHaveProperty("preserved_cycles", 5);
            expect(constants).toHaveProperty("blocks_per_cycle", 4096);
            expect(constants).toHaveProperty("blocks_per_commitment", 32);
            expect(constants).toHaveProperty("blocks_per_roll_snapshot", 256);
            expect(constants).toHaveProperty("blocks_per_voting_period", 32768);
            expect(constants.time_between_blocks.toString()).toEqual("60,75");
            expect(constants).toHaveProperty("endorsers_per_block", 32);
            expect(constants.hard_gas_limit_per_operation.toString()).toEqual("400000");
            expect(constants.hard_gas_limit_per_block.toString()).toEqual("4000000");
            expect(constants.proof_of_work_threshold.toString()).toEqual("70368744177663");
            expect(constants.tokens_per_roll.toString()).toEqual("10000000000");
            expect(constants).toHaveProperty("michelson_maximum_type_size", 1000);
            expect(constants.seed_nonce_revelation_tip.toString()).toEqual("125000");
            expect(constants.origination_burn?.toString()).toEqual("257000");
            expect(constants.block_security_deposit.toString()).toEqual("0");
            expect(constants.endorsement_security_deposit.toString()).toEqual("0");
            expect(constants.block_reward?.toString()).toEqual("0");
            expect(constants.endorsement_reward.toString()).toEqual("0");
            expect(constants.cost_per_byte.toString()).toEqual("1000");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");
        } catch (ex) {
            fail(ex);
        }
        done();
    })

    it('successfully fetches Proto1 constants at level 2', async (done) => {
        try {
            const constants = await Tezos.rpc.getConstants({ block: "2" });
            expect(Object.keys(constants)).toHaveLength(24)
            expect(constants).toHaveProperty("proof_of_work_nonce_size", 8);
            expect(constants).toHaveProperty("nonce_length", 32);
            expect(constants).toHaveProperty("max_revelations_per_block", 32);
            expect(constants).toHaveProperty("max_operation_data_length", 16384);
            expect(constants).toHaveProperty("preserved_cycles", 5);
            expect(constants).toHaveProperty("blocks_per_cycle", 4096);
            expect(constants).toHaveProperty("blocks_per_commitment", 32);
            expect(constants).toHaveProperty("blocks_per_roll_snapshot", 256);
            expect(constants).toHaveProperty("blocks_per_voting_period", 32768);
            expect(constants.time_between_blocks.toString()).toEqual("60,75");
            expect(constants).toHaveProperty("endorsers_per_block", 32);
            expect(constants.hard_gas_limit_per_operation.toString()).toEqual("400000");
            expect(constants.hard_gas_limit_per_block.toString()).toEqual("4000000");
            expect(constants.proof_of_work_threshold.toString()).toEqual("70368744177663");
            expect(constants.tokens_per_roll.toString()).toEqual("10000000000");
            expect(constants).toHaveProperty("michelson_maximum_type_size", 1000);
            expect(constants.seed_nonce_revelation_tip.toString()).toEqual("125000");
            expect(constants.origination_burn?.toString()).toEqual("257000");
            expect(constants.block_security_deposit.toString()).toEqual("0");
            expect(constants.endorsement_security_deposit.toString()).toEqual("0");
            expect(constants.block_reward?.toString()).toEqual("0");
            expect(constants.endorsement_reward.toString()).toEqual("0");
            expect(constants.cost_per_byte.toString()).toEqual("1000");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");
        } catch (ex) {
            fail(ex);
        }
        done();
    })


    it('successfully fetches Proto2 constants at level 100000', async (done) => {
        try {
            const constants = await Tezos.rpc.getConstants({ block: "100000" });
            expect(Object.keys(constants)).toHaveLength(24)
            expect(constants).toHaveProperty("proof_of_work_nonce_size", 8);
            expect(constants).toHaveProperty("nonce_length", 32);
            expect(constants).toHaveProperty("max_revelations_per_block", 32);
            expect(constants).toHaveProperty("max_operation_data_length", 16384);
            expect(constants).toHaveProperty("preserved_cycles", 5);
            expect(constants).toHaveProperty("blocks_per_cycle", 4096);
            expect(constants).toHaveProperty("blocks_per_commitment", 32);
            expect(constants).toHaveProperty("blocks_per_roll_snapshot", 256);
            expect(constants).toHaveProperty("blocks_per_voting_period", 32768);
            expect(constants.time_between_blocks.toString()).toEqual("60,75");
            expect(constants).toHaveProperty("endorsers_per_block", 32);
            expect(constants.hard_gas_limit_per_operation.toString()).toEqual("400000");
            expect(constants.hard_gas_limit_per_block.toString()).toEqual("4000000");
            expect(constants.proof_of_work_threshold.toString()).toEqual("70368744177663");
            expect(constants.tokens_per_roll.toString()).toEqual("10000000000");
            expect(constants).toHaveProperty("michelson_maximum_type_size", 1000);
            expect(constants.seed_nonce_revelation_tip.toString()).toEqual("125000");
            expect(constants.origination_burn?.toString()).toEqual("257000");
            expect(constants.block_security_deposit.toString()).toEqual("192000000");
            expect(constants.endorsement_security_deposit.toString()).toEqual("24000000");
            expect(constants.block_reward?.toString()).toEqual("16000000");
            expect(constants.endorsement_reward.toString()).toEqual("2000000");
            expect(constants.cost_per_byte.toString()).toEqual("1000");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");
        } catch (ex) {
            fail(ex);
        }
        done();
    })

    it('successfully fetches Proto3 constants at level 300000', async (done) => {
        try {
            const constants = await Tezos.rpc.getConstants({ block: "300000" });
            expect(Object.keys(constants)).toHaveLength(25)
            expect(constants).toHaveProperty("proof_of_work_nonce_size", 8);
            expect(constants).toHaveProperty("nonce_length", 32);
            expect(constants).toHaveProperty("max_revelations_per_block", 32);
            expect(constants).toHaveProperty("max_operation_data_length", 16384);
            expect(constants).toHaveProperty("max_proposals_per_delegate", 20);
            expect(constants).toHaveProperty("preserved_cycles", 5);
            expect(constants).toHaveProperty("blocks_per_cycle", 4096);
            expect(constants).toHaveProperty("blocks_per_commitment", 32);
            expect(constants).toHaveProperty("blocks_per_roll_snapshot", 256);
            expect(constants).toHaveProperty("blocks_per_voting_period", 32768);
            expect(constants.time_between_blocks.toString()).toEqual("60,75");
            expect(constants).toHaveProperty("endorsers_per_block", 32);
            expect(constants.hard_gas_limit_per_operation.toString()).toEqual("400000");
            expect(constants.hard_gas_limit_per_block.toString()).toEqual("4000000");
            expect(constants.proof_of_work_threshold.toString()).toEqual("70368744177663");
            expect(constants.tokens_per_roll.toString()).toEqual("10000000000");
            expect(constants).toHaveProperty("michelson_maximum_type_size", 1000);
            expect(constants.seed_nonce_revelation_tip.toString()).toEqual("125000");
            expect(constants).toHaveProperty("origination_size", 257);
            expect(constants.block_security_deposit.toString()).toEqual("512000000");
            expect(constants.endorsement_security_deposit.toString()).toEqual("64000000");
            expect(constants.block_reward?.toString()).toEqual("16000000");
            expect(constants.endorsement_reward.toString()).toEqual("2000000");
            expect(constants.cost_per_byte.toString()).toEqual("1000");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");
        } catch (ex) {
            fail(ex);
        }
        done();
    })


    it('successfully fetches Proto4 constants at level 600000', async (done) => {
        try {
            const constants = await Tezos.rpc.getConstants({ block: "600000" });
            expect(Object.keys(constants)).toHaveLength(26)
            expect(constants).toHaveProperty("proof_of_work_nonce_size", 8);
            expect(constants).toHaveProperty("nonce_length", 32);
            expect(constants).toHaveProperty("max_revelations_per_block", 32);
            expect(constants).toHaveProperty("max_operation_data_length", 16384);
            expect(constants).toHaveProperty("max_proposals_per_delegate", 20);
            expect(constants).toHaveProperty("preserved_cycles", 5);
            expect(constants).toHaveProperty("blocks_per_cycle", 4096);
            expect(constants).toHaveProperty("blocks_per_commitment", 32);
            expect(constants).toHaveProperty("blocks_per_roll_snapshot", 256);
            expect(constants).toHaveProperty("blocks_per_voting_period", 32768);
            expect(constants.time_between_blocks.toString()).toEqual("60,75");
            expect(constants).toHaveProperty("endorsers_per_block", 32);
            expect(constants.hard_gas_limit_per_operation.toString()).toEqual("800000");
            expect(constants.hard_gas_limit_per_block.toString()).toEqual("8000000");
            expect(constants.proof_of_work_threshold.toString()).toEqual("70368744177663");
            expect(constants.tokens_per_roll.toString()).toEqual("8000000000");
            expect(constants).toHaveProperty("michelson_maximum_type_size", 1000);
            expect(constants.seed_nonce_revelation_tip.toString()).toEqual("125000");
            expect(constants).toHaveProperty("origination_size", 257);
            expect(constants.block_security_deposit.toString()).toEqual("512000000");
            expect(constants.endorsement_security_deposit.toString()).toEqual("64000000");
            expect(constants.block_reward?.toString()).toEqual("16000000");
            expect(constants.endorsement_reward.toString()).toEqual("2000000");
            expect(constants.cost_per_byte.toString()).toEqual("1000");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");
            expect(constants.test_chain_duration?.toString()).toEqual("1966080");
        } catch (ex) {
            fail(ex);
        }
        done();
    })


    it('successfully fetches Proto5 constants at level 700000', async (done) => {
        try {
            const constants = await Tezos.rpc.getConstants({ block: "700000" });
            expect(Object.keys(constants)).toHaveLength(31)
            expect(constants).toHaveProperty("proof_of_work_nonce_size", 8);
            expect(constants).toHaveProperty("nonce_length", 32);
            expect(constants).toHaveProperty("max_revelations_per_block", 32);
            expect(constants).toHaveProperty("max_operation_data_length", 16384);
            expect(constants).toHaveProperty("max_proposals_per_delegate", 20);
            expect(constants).toHaveProperty("preserved_cycles", 5);
            expect(constants).toHaveProperty("blocks_per_cycle", 4096);
            expect(constants).toHaveProperty("blocks_per_commitment", 32);
            expect(constants).toHaveProperty("blocks_per_roll_snapshot", 256);
            expect(constants).toHaveProperty("blocks_per_voting_period", 32768);
            expect(constants.time_between_blocks.toString()).toEqual("60,40");
            expect(constants).toHaveProperty("endorsers_per_block", 32);
            expect(constants.hard_gas_limit_per_operation.toString()).toEqual("800000");
            expect(constants.hard_gas_limit_per_block.toString()).toEqual("8000000");
            expect(constants.proof_of_work_threshold.toString()).toEqual("70368744177663");
            expect(constants.tokens_per_roll.toString()).toEqual("8000000000");
            expect(constants).toHaveProperty("michelson_maximum_type_size", 1000);
            expect(constants.seed_nonce_revelation_tip.toString()).toEqual("125000");
            expect(constants).toHaveProperty("origination_size", 257);
            expect(constants.block_security_deposit.toString()).toEqual("512000000");
            expect(constants.endorsement_security_deposit.toString()).toEqual("64000000");
            expect(constants.block_reward?.toString()).toEqual("16000000");
            expect(constants.endorsement_reward.toString()).toEqual("2000000");
            expect(constants.cost_per_byte.toString()).toEqual("1000");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");
            expect(constants.test_chain_duration?.toString()).toEqual("1966080");
            expect(constants).toHaveProperty("quorum_min", 2000);
            expect(constants).toHaveProperty("quorum_max", 7000);
            expect(constants).toHaveProperty("min_proposal_quorum", 500);
            expect(constants).toHaveProperty("initial_endorsers", 24);         
            expect(constants.delay_per_missing_endorsement?.toString()).toEqual("8");
            } catch (ex) {
            fail(ex);
        }
        done();
    })

    it('successfully fetches Proto6 constants at level 900000', async (done) => {
        try {
            const constants = await Tezos.rpc.getConstants({ block: "900000" });
            expect(Object.keys(constants)).toHaveLength(31)
            expect(constants).toHaveProperty("proof_of_work_nonce_size", 8);
            expect(constants).toHaveProperty("nonce_length", 32);
            expect(constants).toHaveProperty("max_revelations_per_block", 32);
            expect(constants).toHaveProperty("max_operation_data_length", 16384);
            expect(constants).toHaveProperty("max_proposals_per_delegate", 20);
            expect(constants).toHaveProperty("preserved_cycles", 5);
            expect(constants).toHaveProperty("blocks_per_cycle", 4096);
            expect(constants).toHaveProperty("blocks_per_commitment", 32);
            expect(constants).toHaveProperty("blocks_per_roll_snapshot", 256);
            expect(constants).toHaveProperty("blocks_per_voting_period", 32768);
            expect(constants.time_between_blocks.toString()).toEqual("60,40");
            expect(constants).toHaveProperty("endorsers_per_block", 32);
            expect(constants.hard_gas_limit_per_operation.toString()).toEqual("1040000");
            expect(constants.hard_gas_limit_per_block.toString()).toEqual("10400000");
            expect(constants.proof_of_work_threshold.toString()).toEqual("70368744177663");
            expect(constants.tokens_per_roll.toString()).toEqual("8000000000");
            expect(constants).toHaveProperty("michelson_maximum_type_size", 1000);
            expect(constants.seed_nonce_revelation_tip.toString()).toEqual("125000");
            expect(constants).toHaveProperty("origination_size", 257);
            expect(constants.block_security_deposit.toString()).toEqual("512000000");
            expect(constants.endorsement_security_deposit.toString()).toEqual("64000000");
            expect(constants.baking_reward_per_endorsement?.toString()).toEqual("1250000,187500");
            expect(constants.endorsement_reward.toString()).toEqual("1250000,833333");
            expect(constants.cost_per_byte.toString()).toEqual("1000");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");
            expect(constants.test_chain_duration?.toString()).toEqual("1966080");
            expect(constants).toHaveProperty("quorum_min", 2000);
            expect(constants).toHaveProperty("quorum_max", 7000);
            expect(constants).toHaveProperty("min_proposal_quorum", 500);
            expect(constants).toHaveProperty("initial_endorsers", 24);
            expect(constants.delay_per_missing_endorsement?.toString()).toEqual("8");
        } catch (ex) {
            fail(ex);
        }
        done();
    })

    it('successfully fetches Proto7 constants at level 1212416', async (done) => {
        try {
            const constants = await Tezos.rpc.getConstants({ block: "1212416" });
            expect(Object.keys(constants)).toHaveLength(31)
            expect(constants).toHaveProperty("proof_of_work_nonce_size", 8);
            expect(constants).toHaveProperty("nonce_length", 32);
            expect(constants).toHaveProperty("max_operation_data_length", 16384);
            expect(constants).toHaveProperty("max_proposals_per_delegate", 20);
            expect(constants).toHaveProperty("preserved_cycles", 5);
            expect(constants).toHaveProperty("blocks_per_cycle", 4096);
            expect(constants).toHaveProperty("blocks_per_commitment", 32);
            expect(constants).toHaveProperty("blocks_per_roll_snapshot", 256);
            expect(constants).toHaveProperty("blocks_per_voting_period", 32768);
            expect(constants.time_between_blocks.toString()).toEqual("60,40");
            expect(constants).toHaveProperty("endorsers_per_block", 32);
            expect(constants.hard_gas_limit_per_operation.toString()).toEqual("1040000");
            expect(constants.hard_gas_limit_per_block.toString()).toEqual("10400000");
            expect(constants.proof_of_work_threshold.toString()).toEqual("70368744177663");
            expect(constants.tokens_per_roll.toString()).toEqual("8000000000");
            expect(constants).toHaveProperty("michelson_maximum_type_size", 1000);
            expect(constants.seed_nonce_revelation_tip.toString()).toEqual("125000");
            expect(constants).toHaveProperty("origination_size", 257);
            expect(constants.block_security_deposit.toString()).toEqual("512000000");
            expect(constants.endorsement_security_deposit.toString()).toEqual("64000000");
            expect(constants.baking_reward_per_endorsement?.toString()).toEqual("1250000,187500");
            expect(constants.endorsement_reward.toString()).toEqual("1250000,833333");
            expect(constants.cost_per_byte.toString()).toEqual("250");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");
            expect(constants.test_chain_duration?.toString()).toEqual("1966080");
            expect(constants).toHaveProperty("quorum_min", 2000);
            expect(constants).toHaveProperty("quorum_max", 7000);
            expect(constants).toHaveProperty("min_proposal_quorum", 500);
            expect(constants).toHaveProperty("initial_endorsers", 24);
            expect(constants.delay_per_missing_endorsement?.toString()).toEqual("8");
        } catch (ex) {
            fail(ex);
        }
        done();
    })

    
    it('successfully fetches Proto8 constants at level 1350000', async (done) => {
        try {
            const constants = await Tezos.rpc.getConstants({ block: "1350000" });
            expect(Object.keys(constants)).toHaveLength(31)
            expect(constants).toHaveProperty("proof_of_work_nonce_size", 8);
            expect(constants).toHaveProperty("nonce_length", 32);
            expect(constants).toHaveProperty("max_operation_data_length", 16384);
            expect(constants).toHaveProperty("max_proposals_per_delegate", 20);
            expect(constants).toHaveProperty("preserved_cycles", 5);
            expect(constants).toHaveProperty("blocks_per_cycle", 4096);
            expect(constants).toHaveProperty("blocks_per_commitment", 32);
            expect(constants).toHaveProperty("blocks_per_roll_snapshot", 256);
            expect(constants).toHaveProperty("blocks_per_voting_period", 20480);
            expect(constants.time_between_blocks.toString()).toEqual("60,40");
            expect(constants).toHaveProperty("endorsers_per_block", 32);
            expect(constants.hard_gas_limit_per_operation.toString()).toEqual("1040000");
            expect(constants.hard_gas_limit_per_block.toString()).toEqual("10400000");
            expect(constants.proof_of_work_threshold.toString()).toEqual("70368744177663");
            expect(constants.tokens_per_roll.toString()).toEqual("8000000000");
            expect(constants).toHaveProperty("michelson_maximum_type_size", 1000);
            expect(constants.seed_nonce_revelation_tip.toString()).toEqual("125000");
            expect(constants).toHaveProperty("origination_size", 257);
            expect(constants.block_security_deposit.toString()).toEqual("512000000");
            expect(constants.endorsement_security_deposit.toString()).toEqual("64000000");
            expect(constants.baking_reward_per_endorsement?.toString()).toEqual("1250000,187500");
            expect(constants.endorsement_reward.toString()).toEqual("1250000,833333");
            expect(constants.cost_per_byte.toString()).toEqual("250");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");
            expect(constants.test_chain_duration?.toString()).toEqual("1228800");
            expect(constants).toHaveProperty("quorum_min", 2000);
            expect(constants).toHaveProperty("quorum_max", 7000);
            expect(constants).toHaveProperty("min_proposal_quorum", 500);
            expect(constants).toHaveProperty("initial_endorsers", 24);
            expect(constants.delay_per_missing_endorsement?.toString()).toEqual("8");
        } catch (ex) {
            fail(ex);
        }
        done();
    })
})