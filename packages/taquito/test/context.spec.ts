import { retry, tap } from 'rxjs/operators';
import { Context } from '../src/context';

describe('Configurations for the confirmation methods and streamer', () => {
    let mockRpcClient: any;
    let context: Context;

    beforeAll(() => {
        mockRpcClient = {
            getConstants: jest.fn()
        };
        context = new Context(mockRpcClient);
    });

    it('Context is initialized with default config values except for the confirmationPollingIntervalSecond property', () => {
        expect(context.config.confirmationPollingIntervalSecond).toBeUndefined();
        expect(context.config.confirmationPollingTimeoutSecond).toEqual(180);
        expect(context.config.defaultConfirmationCount).toEqual(1);
        expect(context.config.streamerPollingIntervalMilliseconds).toEqual(20000);
        expect(context.config.shouldObservableSubscriptionRetry).toBeFalsy();
        expect(context.config.observableSubscriptionRetryFunction.prototype).toEqual(retry().prototype);
    });

    it('Calling the getConfirmationPollingInterval should set the confirmationPollingIntervalSecond based on RPC constants', async (done) => {
        mockRpcClient.getConstants.mockResolvedValue({
            "time_between_blocks": [
                "30",
                "20"
            ],
            "endorsers_per_block": 32,
            "minimal_block_delay": 15,
            "initial_endorsers": 24,
            "delay_per_missing_endorsement": "4"
        });
        await context.getConfirmationPollingInterval();
        expect(context.config.confirmationPollingIntervalSecond).toEqual(5);
        expect(context.config.confirmationPollingTimeoutSecond).toEqual(180);
        expect(context.config.defaultConfirmationCount).toEqual(1);
        expect(context.config.streamerPollingIntervalMilliseconds).toEqual(20000);
        expect(context.config.shouldObservableSubscriptionRetry).toBeFalsy();
        expect(context.config.observableSubscriptionRetryFunction.prototype).toEqual(retry().prototype);
        done()
    });

    it('Configurations for the confirmation methods and streamer are customizable via the config setter', () => {
        context.config = {
            confirmationPollingIntervalSecond: 10,
            confirmationPollingTimeoutSecond: 300,
            defaultConfirmationCount: 2,
            streamerPollingIntervalMilliseconds: 10000,
            shouldObservableSubscriptionRetry: true,
            observableSubscriptionRetryFunction: tap()
        }
        expect(context.config.confirmationPollingIntervalSecond).toEqual(10);
        expect(context.config.confirmationPollingTimeoutSecond).toEqual(300);
        expect(context.config.defaultConfirmationCount).toEqual(2);
        expect(context.config.streamerPollingIntervalMilliseconds).toEqual(10000);
        expect(context.config.shouldObservableSubscriptionRetry).toBeTruthy();
        expect(context.config.observableSubscriptionRetryFunction.prototype).toEqual(tap().prototype);
    });

    it('Configurations for the confirmation methods and streamer can be partially customized using the setPartialConfig method', () => {
        context.setPartialConfig({
            defaultConfirmationCount: 3,
            streamerPollingIntervalMilliseconds: 4000
        });
        expect(context.config.confirmationPollingIntervalSecond).toEqual(10);
        expect(context.config.defaultConfirmationCount).toEqual(3);
        expect(context.config.streamerPollingIntervalMilliseconds).toEqual(4000);
        expect(context.config.shouldObservableSubscriptionRetry).toBeTruthy();
        expect(context.config.observableSubscriptionRetryFunction.prototype).toEqual(tap().prototype);
    });
})

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

    it('getConfirmationPollingInterval should return polling interval for production environment', async () => {
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
            "minimal_block_delay": 15,
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
        expect(pollingInterval).toBe(5);

    });
    

    it('getConfirmationPollingInterval should return polling interval when rpc call to get constants file fails', async () => {
        mockRpcClient.getConstants.mockImplementation(() => {
            throw new Error();
        });
        const pollingInterval = await new Context(mockRpcClient).getConfirmationPollingInterval();
        expect(pollingInterval).toBe(5);
    });
});
