import { CONFIGS } from "./config";
import { ConstantsResponse } from "@taquito/rpc";

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    describe(`Test fetching protocol constants using: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })
        it('succesfully fails at fetching constants for level 0', async (done) => {
            // Get constants for protocol
            try {
                await Tezos.rpc.getConstants({ block: "0" });

                // expect(constants).toBeInstanceOf(ConstantsResponse);
                expect.assertions(1);                
            } catch(ex) {
                expect(ex.message).toMatch('Http error response: (404) ');
            }
            done();
            })

        it('fetches constants at level 1', async (done) => {
            // Get constants for protocol
            const constants = await Tezos.rpc.getConstants({ block: "1" });
            // expect(constants).toBeInstanceOf(ConstantsResponse);
            expect(constants).toMatchObject({"proof_of_work_nonce_size":8,"nonce_length":32,"max_revelations_per_block":32,"max_operation_data_length":16384,"preserved_cycles":5,"blocks_per_cycle":4096,"blocks_per_commitment":32,"blocks_per_roll_snapshot":256,"blocks_per_voting_period":32768,"time_between_blocks":["60","75"],"endorsers_per_block":32,"hard_gas_limit_per_operation":"400000","hard_gas_limit_per_block":"4000000","proof_of_work_threshold":"70368744177663","tokens_per_roll":"10000000000","michelson_maximum_type_size":1000,"seed_nonce_revelation_tip":"125000","origination_burn":"257000","block_security_deposit":"0","endorsement_security_deposit":"0","block_reward":"0","endorsement_reward":"0","cost_per_byte":"1000","hard_storage_limit_per_operation":"60000"});
            done();
        })

        // it('fetches constants at level 2', async (done) => {
        //     // Get constants for protocol
        //     const constants = await Tezos.rpc.getConstants({ block: "2" });
        //     console.log(constants);
        //     // expect(constants).toBeInstanceOf(ConstantsResponse);
        //     expect(constants).toMatchObject({ "proof_of_work_nonce_size": 8, "nonce_length": 32, "max_revelations_per_block": 32, "max_operation_data_length": 16384, "preserved_cycles": 5, "blocks_per_cycle": 4096, "blocks_per_commitment": 32, "blocks_per_roll_snapshot": 256, "blocks_per_voting_period": 32768, "time_between_blocks": ["60", "75"], "endorsers_per_block": 32, "hard_gas_limit_per_operation": "400000", "hard_gas_limit_per_block": "4000000", "proof_of_work_threshold": "70368744177663", "tokens_per_roll": "10000000000", "michelson_maximum_type_size": 1000, "seed_nonce_revelation_tip": "125000", "origination_burn": "257000", "block_security_deposit": "0", "endorsement_security_deposit": "0", "block_reward": "0", "endorsement_reward": "0", "cost_per_byte": "1000", "hard_storage_limit_per_operation": "60000" })
        //     done();
        // })

        // it('fetches constants at level 100000', async (done) => {
        //     // Get constants for protocol
        //     const constants = await Tezos.rpc.getConstants({ block: "100000" });
        //     console.log(constants);
        //     // expect(constants).toBeInstanceOf(ConstantsResponse);
        //     expect(constants).toMatchObject({"proof_of_work_nonce_size":8,"nonce_length":32,"max_revelations_per_block":32,"max_operation_data_length":16384,"preserved_cycles":5,"blocks_per_cycle":4096,"blocks_per_commitment":32,"blocks_per_roll_snapshot":256,"blocks_per_voting_period":32768,"time_between_blocks":["60","75"],"endorsers_per_block":32,"hard_gas_limit_per_operation":"400000","hard_gas_limit_per_block":"4000000","proof_of_work_threshold":"70368744177663","tokens_per_roll":"10000000000","michelson_maximum_type_size":1000,"seed_nonce_revelation_tip":"125000","origination_burn":"257000","block_security_deposit":"192000000","endorsement_security_deposit":"24000000","block_reward":"16000000","endorsement_reward":"2000000","cost_per_byte":"1000","hard_storage_limit_per_operation":"60000"});
        //     done();
        // })

        // it('fetches constants at level 300000', async (done) => {
        //     // Get constants for protocol
        //     const constants = await Tezos.rpc.getConstants({ block: "300000" });
        //     console.log(constants);
        //     // expect(constants).toBeInstanceOf(ConstantsResponse);
        //     expect(constants).toMatchObject({"proof_of_work_nonce_size":8,"nonce_length":32,"max_revelations_per_block":32,"max_operation_data_length":16384,"max_proposals_per_delegate":20,"preserved_cycles":5,"blocks_per_cycle":4096,"blocks_per_commitment":32,"blocks_per_roll_snapshot":256,"blocks_per_voting_period":32768,"time_between_blocks":["60","75"],"endorsers_per_block":32,"hard_gas_limit_per_operation":"400000","hard_gas_limit_per_block":"4000000","proof_of_work_threshold":"70368744177663","tokens_per_roll":"10000000000","michelson_maximum_type_size":1000,"seed_nonce_revelation_tip":"125000","origination_size":257,"block_security_deposit":"512000000","endorsement_security_deposit":"64000000","block_reward":"16000000","endorsement_reward":"2000000","cost_per_byte":"1000","hard_storage_limit_per_operation":"60000"});
        //     done();
        // })

        // it('fetches constants at level ', async (done) => {
        //     // Get constants for protocol
        //     const constants = await Tezos.rpc.getConstants({ block: "0" });
        //     console.log(constants);
        //     // expect(constants).toBeInstanceOf(ConstantsResponse);
        //     expect(constants).toMatchObject({
        //     done();
        // })

        // it('fetches constants at level 0', async (done) => {
        //     // Get constants for protocol
        //     const constants = await Tezos.rpc.getConstants({ block: "0" });
        //     console.log(constants);
        //     // expect(constants).toBeInstanceOf(ConstantsResponse);
        //     expect(constants).toMatchObject(
        //     done();
        // })

        // it('fetches constants at level 0', async (done) => {
        //     // Get constants for protocol
        //     const constants = await Tezos.rpc.getConstants({ block: "0" });
        //     console.log(constants);
        //     // expect(constants).toBeInstanceOf(ConstantsResponse);
        //     expect(constants).toMatchObject(
        //     done();
        // })
    });

})
