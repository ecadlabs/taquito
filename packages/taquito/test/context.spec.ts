import { Context } from '../src/context';

describe('Taquito context class', () => {

    let mockRpcClient: any;
  
    beforeEach(() => {
      mockRpcClient = {
        getConstants: jest.fn()
      };
    });
    
    it('getConfirmationPollingInterval should return polling interval for sandbox environment', async () => {
        mockRpcClient.getConstants.mockResolvedValue({
            "proof_of_work_nonce_size": 8,
            "nonce_length": 32,
            "max_anon_ops_per_block": 132,
            "max_operation_data_length": 16384,
            "max_proposals_per_delegate": 20,
            "preserved_cycles": 3,
            "blocks_per_cycle": 2048,
            "blocks_per_commitment": 16,
            "blocks_per_roll_snapshot": 128,
            "blocks_per_voting_period": 4096,
            "time_between_blocks": [
            "2",
            "3"
            ],
            "endorsers_per_block": 32,
            "hard_gas_limit_per_operation": "1040000",
            "hard_gas_limit_per_block": "10400000",
            "proof_of_work_threshold": "70368744177663",
            "tokens_per_roll": "8000000000",
            "michelson_maximum_type_size": 1000,
            "seed_nonce_revelation_tip": "125000",
            "origination_size": 257,
            "block_security_deposit": "512000000",
            "endorsement_security_deposit": "64000000",
            "baking_reward_per_endorsement": [
            "1250000",
            "187500"
            ],
            "endorsement_reward": [
            "1250000",
            "833333"
            ],
            "cost_per_byte": "250",
            "hard_storage_limit_per_operation": "60000",
            "test_chain_duration": "61440",
            "quorum_min": 2000,
            "quorum_max": 7000,
            "min_proposal_quorum": 500,
            "initial_endorsers": 1,
            "delay_per_missing_endorsement": "1"
        });
        const pollingInterval = await new Context(mockRpcClient).getConfirmationPollingInterval();
        expect(pollingInterval).toBe(2/3);
    });

    it('getConfirmationPollingInterval should return polling interval for production enviornment', async () => {
        mockRpcClient.getConstants.mockResolvedValue({
            "proof_of_work_nonce_size": 8,
            "nonce_length": 32,
            "max_anon_ops_per_block": 132,
            "max_operation_data_length": 16384,
            "max_proposals_per_delegate": 20,
            "preserved_cycles": 3,
            "blocks_per_cycle": 2048,
            "blocks_per_commitment": 16,
            "blocks_per_roll_snapshot": 128,
            "blocks_per_voting_period": 4096,
            "time_between_blocks": [
            "30",
            "20"
            ],
            "endorsers_per_block": 32,
            "hard_gas_limit_per_operation": "1040000",
            "hard_gas_limit_per_block": "10400000",
            "proof_of_work_threshold": "70368744177663",
            "tokens_per_roll": "8000000000",
            "michelson_maximum_type_size": 1000,
            "seed_nonce_revelation_tip": "125000",
            "origination_size": 257,
            "block_security_deposit": "512000000",
            "endorsement_security_deposit": "64000000",
            "baking_reward_per_endorsement": [
            "1250000",
            "187500"
            ],
            "endorsement_reward": [
            "1250000",
            "833333"
            ],
            "cost_per_byte": "250",
            "hard_storage_limit_per_operation": "60000",
            "test_chain_duration": "61440",
            "quorum_min": 2000,
            "quorum_max": 7000,
            "min_proposal_quorum": 500,
            "initial_endorsers": 24,
            "delay_per_missing_endorsement": "4"
        });
        const pollingInterval = await new Context(mockRpcClient).getConfirmationPollingInterval();
        expect(pollingInterval).toBe(10);

    });
    

    it('getConfirmationPollingInterval should return polling interval when rpc call to get constants file fails', async () => {
        mockRpcClient.getConstants.mockImplementation(() => {
            throw new Error();
        });
        const pollingInterval = await new Context(mockRpcClient).getConfirmationPollingInterval();
        expect(pollingInterval).toBe(10);
    });
});
