import { TezosToolkit } from "@taquito/taquito";
import { ConstantsResponse } from "@taquito/rpc";

const rpcUrl = 'https://api.tez.ie/rpc/mainnet';
const delphinetUrl = 'https://api.tez.ie/rpc/delphinet';
const Tezos = new TezosToolkit(rpcUrl);
const TezosDelphi = new TezosToolkit(delphinetUrl);

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

    // TODO: Test that we aren't getting any extra properties. Currently, tests will pass even if we had extra properties in JSON response
    it('successfully fetches Proto1 constants at level 1', async (done) => {
        try {
            // Get constants for protocol
            const constants = await Tezos.rpc.getConstants({ block: "1" });
            // expect(constants).toBeInstanceOf(ConstantsResponse);
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
            if (constants.block_reward) {
                expect(constants.block_reward?.toString()).toEqual("0");
            } else {
                expect(constants.block_reward).toBeUndefined();
            }
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
            if (constants.block_reward) {
                expect(constants.block_reward?.toString()).toEqual("0");
            } else {
                expect(constants.block_reward).toBeUndefined();
            }
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
            if (constants.block_reward) {
                expect(constants.block_reward.toString()).toEqual("16000000");
            } else {
                expect(constants.block_reward).toBeUndefined();
            }
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
            if (constants.block_reward) {
                expect(constants.block_reward?.toString()).toEqual("16000000");
            } else {
                expect(constants.block_reward).toBeUndefined();
            }
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
            if (constants.block_reward) {
                expect(constants.block_reward?.toString()).toEqual("16000000");
            } else {
                expect(constants.block_reward).toBeUndefined();
            }

            expect(constants.endorsement_reward.toString()).toEqual("2000000");
            expect(constants.cost_per_byte.toString()).toEqual("1000");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");
            if (constants.test_chain_duration) {
                expect(constants.test_chain_duration?.toString()).toEqual("1966080");
            } else {
                expect(constants.test_chain_duration).toBeUndefined();
            }

        } catch (ex) {
            fail(ex);
        }
        done();
    })


    it('successfully fetches Proto5 constants at level 700000', async (done) => {
        try {
            const constants = await Tezos.rpc.getConstants({ block: "700000" });
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
            if (constants.block_reward) {
                expect(constants.block_reward?.toString()).toEqual("16000000");
            } else {
                expect(constants.block_reward).toBeUndefined();
            }

            expect(constants.endorsement_reward.toString()).toEqual("2000000");
            expect(constants.cost_per_byte.toString()).toEqual("1000");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");

            if (constants.test_chain_duration) {
                expect(constants.test_chain_duration?.toString()).toEqual("1966080");
            } else {
                expect(constants.test_chain_duration).toBeUndefined();
            }

            if (constants.quorum_min) {
                expect(constants).toHaveProperty("quorum_min", 2000);
            } else {
                expect(constants.quorum_min).toBeUndefined();
            }

            if (constants.quorum_max) {
                expect(constants).toHaveProperty("quorum_max", 7000);
            } else {
                expect(constants.quorum_max).toBeUndefined();
            }

            if (constants.min_proposal_quorum) {
                expect(constants).toHaveProperty("min_proposal_quorum", 500);
            } else {
                expect(constants.min_proposal_quorum).toBeUndefined();
            }

            if (constants.initial_endorsers) {
                expect(constants).toHaveProperty("initial_endorsers", 24);
            } else {
                expect(constants.initial_endorsers).toBeUndefined();
            }

            if (constants.delay_per_missing_endorsement) {
                expect(constants.delay_per_missing_endorsement.toString()).toEqual("8");
            } else {
                expect(constants.delay_per_missing_endorsement).toBeUndefined();
            }

        } catch (ex) {
            fail(ex);
        }
        done();
    })

    it('successfully fetches Proto6 constants at level 900000', async (done) => {
        try {
            const constants = await Tezos.rpc.getConstants({ block: "900000" });
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
            if (constants.baking_reward_per_endorsement) {
                expect(constants.baking_reward_per_endorsement.toString()).toEqual("1250000,187500");
            } else {
                expect(constants).toBeUndefined();
            }
            expect(constants.endorsement_reward.toString()).toEqual("1250000,833333");
            expect(constants.cost_per_byte.toString()).toEqual("1000");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");

            if (constants.test_chain_duration) {
                expect(constants.test_chain_duration?.toString()).toEqual("1966080");
            } else {
                expect(constants.test_chain_duration).toBeUndefined();
            }

            if (constants.quorum_min) {
                expect(constants).toHaveProperty("quorum_min", 2000);
            } else {
                expect(constants.quorum_min).toBeUndefined();
            }

            if (constants.quorum_max) {
                expect(constants).toHaveProperty("quorum_max", 7000);
            } else {
                expect(constants.quorum_max).toBeUndefined();
            }

            if (constants.min_proposal_quorum) {
                expect(constants).toHaveProperty("min_proposal_quorum", 500);
            } else {
                expect(constants.min_proposal_quorum).toBeUndefined();
            }

            if (constants.initial_endorsers) {
                expect(constants).toHaveProperty("initial_endorsers", 24);
            } else {
                expect(constants.initial_endorsers).toBeUndefined();
            }

            if (constants.delay_per_missing_endorsement) {
                expect(constants.delay_per_missing_endorsement.toString()).toEqual("8");
            } else {
                expect(constants.delay_per_missing_endorsement).toBeUndefined();
            }

        } catch (ex) {
            fail(ex);
        }
        done();
    })

    it('successfully fetches Proto7 constants at level 1212416', async (done) => {
        try {
            const constants = await Tezos.rpc.getConstants({ block: "1212416" });
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
            if (constants.baking_reward_per_endorsement) {
                expect(constants.baking_reward_per_endorsement.toString()).toEqual("1250000,187500");
            } else {
                expect(constants).toBeUndefined();
            }
            expect(constants.endorsement_reward.toString()).toEqual("1250000,833333");
            expect(constants.cost_per_byte.toString()).toEqual("250");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");

            if (constants.test_chain_duration) {
                expect(constants.test_chain_duration?.toString()).toEqual("1966080");
            } else {
                expect(constants.test_chain_duration).toBeUndefined();
            }

            if (constants.quorum_min) {
                expect(constants).toHaveProperty("quorum_min", 2000);
            } else {
                expect(constants.quorum_min).toBeUndefined();
            }

            if (constants.quorum_max) {
                expect(constants).toHaveProperty("quorum_max", 7000);
            } else {
                expect(constants.quorum_max).toBeUndefined();
            }

            if (constants.min_proposal_quorum) {
                expect(constants).toHaveProperty("min_proposal_quorum", 500);
            } else {
                expect(constants.min_proposal_quorum).toBeUndefined();
            }

            if (constants.initial_endorsers) {
                expect(constants).toHaveProperty("initial_endorsers", 24);
            } else {
                expect(constants.initial_endorsers).toBeUndefined();
            }

            if (constants.delay_per_missing_endorsement) {
                expect(constants.delay_per_missing_endorsement.toString()).toEqual("8");
            } else {
                expect(constants.delay_per_missing_endorsement).toBeUndefined();
            }

        } catch (ex) {
            fail(ex);
        }
        done();
    })

})

describe('Fetch constants for Proto7 from delphinet', () => {
    // delphinet is taking longer to call, so set timeout
    jest.setTimeout(30000);
    it('succesfully fetches constants for Proto7', async (done) => {
        try {
            const constants = await TezosDelphi.rpc.getConstants();
            expect(constants).toHaveProperty("proof_of_work_nonce_size", 8);
            expect(constants).toHaveProperty("nonce_length", 32);
            expect(constants).toHaveProperty("max_anon_ops_per_block", 132);
            expect(constants).toHaveProperty("max_operation_data_length", 16384);
            expect(constants).toHaveProperty("max_proposals_per_delegate", 20);
            expect(constants).toHaveProperty("preserved_cycles", 3);
            expect(constants).toHaveProperty("blocks_per_cycle", 2048);
            expect(constants).toHaveProperty("blocks_per_commitment", 16);
            expect(constants).toHaveProperty("blocks_per_roll_snapshot", 128);
            expect(constants).toHaveProperty("blocks_per_voting_period", 2048);
            expect(constants.time_between_blocks.toString()).toEqual("30,20");
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
            if (constants.baking_reward_per_endorsement) {
                expect(constants.baking_reward_per_endorsement.toString()).toEqual("1250000,187500");
            } else {
                expect(constants).toBeUndefined();
            }
            expect(constants.endorsement_reward.toString()).toEqual("1250000,833333");
            expect(constants.cost_per_byte.toString()).toEqual("250");
            expect(constants.hard_storage_limit_per_operation.toString()).toEqual("60000");

            if (constants.test_chain_duration) {
                expect(constants.test_chain_duration?.toString()).toEqual("61440");
            } else {
                expect(constants.test_chain_duration).toBeUndefined();
            }

            if (constants.quorum_min) {
                expect(constants).toHaveProperty("quorum_min", 2000);
            } else {
                expect(constants.quorum_min).toBeUndefined();
            }

            if (constants.quorum_max) {
                expect(constants).toHaveProperty("quorum_max", 7000);
            } else {
                expect(constants.quorum_max).toBeUndefined();
            }

            if (constants.min_proposal_quorum) {
                expect(constants).toHaveProperty("min_proposal_quorum", 500);
            } else {
                expect(constants.min_proposal_quorum).toBeUndefined();
            }

            if (constants.initial_endorsers) {
                expect(constants).toHaveProperty("initial_endorsers", 24);
            } else {
                expect(constants.initial_endorsers).toBeUndefined();
            }

            if (constants.delay_per_missing_endorsement) {
                expect(constants.delay_per_missing_endorsement.toString()).toEqual("4");
            } else {
                expect(constants.delay_per_missing_endorsement).toBeUndefined();
            }
        } catch (ex) {
            fail(ex);
        }
        done();
    })
})