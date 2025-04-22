/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { OpKind, RpcClient } from '../src/taquito-rpc';
import BigNumber from 'bignumber.js';
import {
  LazyStorageDiffBigMap,
  OperationContentsAndResultAttestationWithDal,
  OperationContentsAndResultOrigination,
  OperationResultTransaction,
  OperationContentsAndResultTransaction,
  LazyStorageDiffSaplingState,
  OperationContentsAndResultRegisterGlobalConstant,
  RPCRunViewParam,
  RPCRunScriptViewParam,
  OperationContentsAndResultSetDepositsLimit,
  METADATA_BALANCE_UPDATES_CATEGORY,
  OperationContentsAndResultIncreasePaidStorage,
  OperationResultEvent,
  OperationContentsAndResultTransferTicket,
  OperationContentsAndResultUpdateConsensusKey,
  OperationContentsAndResultDrainDelegate,
  ConstantsResponseProto015,
  OperationContentsAndResultSmartRollupOriginate,
  OperationContentsAndResultSmartRollupAddMessages,
  OperationContentsAndResultSmartRollupExecuteOutboxMessage,
  RPCRunOperationParam,
  OperationMetadataBalanceUpdates,
  PendingOperationsV1,
  PendingOperationsV2,
  OperationContentsAndResultSmartRollupCement,
  OperationContentsAndResultSmartRollupPublish,
  OperationContentsAndResultSmartRollupRefute,
  SmartRollupRefutationMove,
  OperationContentsAndResultSmartRollupRecoverBond,
  OperationContentsAndResultSmartRollupTimeout,
  SmartRollupRefutationStart,
  SmartRollupRefutationOptions,
  RPCSimulateOperationParam,
  OperationContentsAndResultDalPublishCommitment,
  OperationContentsAndResultAttestation,
  OperationContentsAndResultEndorsement,
} from '../src/types';
import {
  blockIthacanetResponse,
  blockKathmandunetResponse,
  blockLimanetResponse,
  blockWeeklynetResponse,
  delegatesIthacanetResponse,
  delegatesKathmandunetResponse,
  delegatesRionetResponse,
  votingInfoKathmandunetResponse,
  ticketUpdatesResponse,
  ticketBalancesResponse,
  smartRollupOriginateResponse,
  smartRollupAddMessagesResponse,
  smartRollupExecuteOutboxMessageResponse,
  pendingOperationsResponse,
  smartRollupCementResponse,
  smartRollupPublishResponse,
  smartRollupRefuteResponse,
  smartRollupRecoverBondResponse,
  smartRollupTimeoutResponse,
  aiLaunchCycle,
  unstakeRequestsResponse,
  protocolActivations,
  protocolActivation,
} from './data/rpc-responses';

/**
 * RpcClient test
 */
describe('RpcClient test', () => {
  let client: RpcClient;
  let httpBackend: {
    createRequest: jest.Mock<any, any>;
  };

  const contractAddress = 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D';

  beforeEach(() => {
    httpBackend = {
      createRequest: jest.fn(),
    };
    client = new RpcClient('root', 'test', httpBackend as any);
  });

  it('RpcClient is instantiable', () => {
    const rpcUrl = 'test';
    expect(new RpcClient(rpcUrl)).toBeInstanceOf(RpcClient);
  });

  describe('Concat url properly', () => {
    it('Should prevent double slashes given multiple trailing slashes', async () => {
      const client = new RpcClient('root.com/test///', 'test', httpBackend as any);
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      await client.getBalance(contractAddress);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root.com/test/chains/test/blocks/head/context/contracts/${contractAddress}/balance`,
      });
    });

    it('Should prevent double slashes given one trailing slash', async () => {
      const client = new RpcClient('root.com/test/', 'test', httpBackend as any);
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      await client.getBalance(contractAddress);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root.com/test/chains/test/blocks/head/context/contracts/${contractAddress}/balance`,
      });
    });

    it('Should prevent double slashes given no trailing slash', async () => {
      const client = new RpcClient('root.com/test', 'test', httpBackend as any);
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      await client.getBalance(contractAddress);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root.com/test/chains/test/blocks/head/context/contracts/${contractAddress}/balance`,
      });
    });
  });

  describe('getBalance', () => {
    it('should query the right url and return a string', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      const balance = await client.getBalance(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/balance`,
      });
      expect(balance).toBeInstanceOf(BigNumber);
      expect(balance.toString()).toEqual('10000');
    });
  });

  describe('getSpendable', () => {
    it('should query the right url and return a string', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      const balance = await client.getSpendable(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/spendable`,
      });
      expect(balance).toBeInstanceOf(BigNumber);
      expect(balance.toString()).toEqual('10000');
    });
  });

  describe('getBalanceAndFrozenBonds', () => {
    it('should query the right url and return a string', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      const balance = await client.getBalanceAndFrozenBonds(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/balance_and_frozen_bonds`,
      });
      expect(balance).toBeInstanceOf(BigNumber);
      expect(balance.toString()).toEqual('10000');
    });
  });

  describe('getSpendableAndFrozenBonds', () => {
    it('should query the right url and return a string', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      const balance = await client.getSpendableAndFrozenBonds(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/spendable_and_frozen_bonds`,
      });
      expect(balance).toBeInstanceOf(BigNumber);
      expect(balance.toString()).toEqual('10000');
    });
  });

  describe('getFullBalance', () => {
    it('should query the right url and return a string', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      const balance = await client.getFullBalance(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/full_balance`,
      });
      expect(balance).toBeInstanceOf(BigNumber);
      expect(balance.toString()).toEqual('10000');
    });
  });

  describe('getStakedBalance', () => {
    it('should query the right url and return a string', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      const balance = await client.getStakedBalance(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/staked_balance`,
      });
      expect(balance).toBeInstanceOf(BigNumber);
      expect(balance.toString()).toEqual('10000');
    });
  });

  describe('getUnstakedFinalizableBalance', () => {
    it('should query the right url and return a string', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      const balance = await client.getUnstakedFinalizableBalance(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/unstaked_finalizable_balance`,
      });
      expect(balance).toBeInstanceOf(BigNumber);
      expect(balance.toString()).toEqual('10000');
    });
  });

  describe('getUnstakedFrozenBalance', () => {
    it('should query the right url and return a string', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      const balance = await client.getUnstakedFrozenBalance(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/unstaked_frozen_balance`,
      });
      expect(balance).toBeInstanceOf(BigNumber);
      expect(balance.toString()).toEqual('10000');
    });
  });

  describe('getUnstakeRequests', () => {
    it('should query the right url', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(unstakeRequestsResponse));
      await client.getUnstakeRequests(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/unstake_requests`,
      });
    });

    it('should parse the response properly', async () => {
      httpBackend.createRequest.mockResolvedValue(unstakeRequestsResponse);
      const response = await client.getUnstakeRequests(contractAddress);

      expect(response).toEqual({
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
      });
    });
  });

  describe('getStorage', () => {
    it('should query the right url', async () => {
      await client.getStorage(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/storage`,
      });
    });

    it('should query used_space url correctly', async () => {
      await client.getStorageUsedSpace(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/storage/used_space`,
      });
    });

    it('should query used_paid url correctly', async () => {
      await client.getStoragePaidSpace(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/storage/paid_space`,
      });
    });
  });

  describe('getScript', () => {
    it('should query the right url', async () => {
      await client.getScript(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/script`,
      });
    });
  });

  describe('getNormalizedScript', () => {
    it('should query the right url', async () => {
      await client.getNormalizedScript(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/script/normalized`,
      });
      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({ unparsing_mode: 'Readable' });
    });
  });

  describe('getContract', () => {
    it('should query the right url', async () => {
      httpBackend.createRequest.mockResolvedValue({ balance: '10000' });
      const response = await client.getContract(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}`,
      });

      expect(response.balance).toBeInstanceOf(BigNumber);
      expect(response.balance.toString()).toEqual('10000');
    });
  });

  describe('getManagerKey', () => {
    it('should query the right url', async () => {
      await client.getManagerKey(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/manager_key`,
      });
    });
  });

  describe('getDelegate', () => {
    it('should query the right url', async () => {
      await client.getDelegate(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/delegate`,
      });
    });
  });

  describe('getBlockHash', () => {
    it('should query the right url', async () => {
      await client.getBlockHash();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/hash',
      });
    });
  });

  describe('getAllDelegates', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockResolvedValue(['tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD']);
      const result = await client.getAllDelegates({ active: true, with_minimal_stake: true });
      await client.getAllDelegates({ active: true, with_minimal_stake: true });
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/delegates',
        query: { active: true, with_minimal_stake: true },
      });

      expect(result).toEqual(['tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD']);
    });
  });

  describe('getDelegates', () => {
    const sampleResponse = {
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

    it('should query the right url', async () => {
      httpBackend.createRequest.mockResolvedValue(sampleResponse);
      await client.getDelegates(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/delegates/${contractAddress}`,
      });
    });

    it('should parse the response properly', async () => {
      httpBackend.createRequest.mockResolvedValue(sampleResponse);
      const response = await client.getDelegates(contractAddress);

      expect(response).toEqual({
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
      });
    });

    it('should parse the response properly, proto10', async () => {
      // deposit replaced by deposits
      httpBackend.createRequest.mockResolvedValue({
        balance: '5976016544884',
        frozen_balance: '2436709362932',
        frozen_balance_by_cycle: [
          { cycle: 52, deposits: '463410000000', fees: '143599', rewards: '13998796117' },
          { cycle: 53, deposits: '770072500000', fees: '784655', rewards: '23952869735' },
        ],
        staking_balance: '5902972035162',
        delegated_contracts: ['tz1NFs6yP2sXd5vAAbR43bbDRpV2nahDZope'],
        delegated_balance: '0',
        deactivated: false,
        grace_period: 59,
        voting_power: 729,
      });
      const response = await client.getDelegates(contractAddress);

      expect(response).toEqual({
        balance: new BigNumber('5976016544884'),
        frozen_balance: new BigNumber('2436709362932'),
        frozen_balance_by_cycle: [
          {
            cycle: 52,
            deposits: new BigNumber('463410000000'),
            fees: new BigNumber('143599'),
            rewards: new BigNumber('13998796117'),
          },
          {
            cycle: 53,
            deposits: new BigNumber('770072500000'),
            fees: new BigNumber('784655'),
            rewards: new BigNumber('23952869735'),
          },
        ],
        staking_balance: new BigNumber('5902972035162'),
        delegated_contracts: ['tz1NFs6yP2sXd5vAAbR43bbDRpV2nahDZope'],
        delegated_balance: new BigNumber('0'),
        deactivated: false,
        grace_period: 59,
        voting_power: new BigNumber(729),
      });
    });

    it('should parse the response properly, proto12', async () => {
      httpBackend.createRequest.mockResolvedValue(delegatesIthacanetResponse);
      const response = await client.getDelegates(contractAddress);

      expect(response).toEqual({
        full_balance: new BigNumber('1198951292321'),
        current_frozen_deposits: new BigNumber('120167343864'),
        frozen_deposits: new BigNumber('120167343864'),
        staking_balance: new BigNumber('1203308804406'),
        delegated_contracts: ['tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD'],
        delegated_balance: new BigNumber('4357512085'),
        deactivated: false,
        grace_period: 37,
        voting_power: new BigNumber(199),
      });
    });

    it('should parse the response properly, proto14', async () => {
      httpBackend.createRequest.mockResolvedValue(delegatesKathmandunetResponse);
      const response = await client.getDelegates(contractAddress);

      expect(response).toEqual({
        full_balance: new BigNumber('965532868030'),
        current_frozen_deposits: new BigNumber('96350095609'),
        frozen_deposits: new BigNumber('96350095609'),
        staking_balance: new BigNumber('970221941952'),
        delegated_contracts: ['tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD'],
        delegated_balance: new BigNumber('4689073922'),
        deactivated: false,
        grace_period: 42,
        voting_power: new BigNumber(968128693450),
        remaining_proposals: 20,
      });
    });
  });

  it('should parse the response properly, proto22', async () => {
    httpBackend.createRequest.mockResolvedValue(delegatesRionetResponse);
    const response = await client.getDelegates(contractAddress);

    expect(response).toEqual({
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
      staking_denominator: new BigNumber('0'),
      current_voting_power: '57552986705875',
      voting_power: new BigNumber('57510398676966'),
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
    });
  });

  describe('getVotingInfo', () => {
    it('should query the right url', async () => {
      httpBackend.createRequest.mockResolvedValue(votingInfoKathmandunetResponse);
      await client.getVotingInfo(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/delegates/${contractAddress}/voting_info`,
      });
    });

    it('should parse the response properly', async () => {
      httpBackend.createRequest.mockResolvedValue(votingInfoKathmandunetResponse);
      const response = await client.getVotingInfo(contractAddress);

      expect(response).toEqual({
        voting_power: '1054404383333',
        remaining_proposals: 20,
      });
    });
  });

  describe('getBigMapKey', () => {
    it('should query the right url', async () => {
      await client.getBigMapKey(contractAddress, { key: 'test', type: 'string' } as any);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/big_map_get`,
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({ key: 'test', type: 'string' });
    });
  });

  describe('forgeOperation', () => {
    it('should query the right url', async () => {
      await client.forgeOperations({} as any);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/forge/operations',
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({});
    });
  });

  describe('injectOperations', () => {
    it('should query the right url', async () => {
      await client.injectOperation({} as any);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/injection/operation',
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({});
    });
  });

  describe('preapplyOperations', () => {
    it('should query the right url', async () => {
      httpBackend.createRequest.mockResolvedValue({});
      await client.preapplyOperations({} as any);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/preapply/operations',
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({});
    });
  });

  describe('getBlockHeader', () => {
    it('should query the right url', async () => {
      const sampleResponse = {
        protocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
        chain_id: 'NetXdQprcVkpaWU',
        hash: 'BLjs6BSiYpwV5u6YpNHNSAqr1iuJRGDHXK3Qb6DH1ZkN8QbAitW',
        level: 596467,
        proto: 4,
        predecessor: 'BMYidfFK1tfryqoTRnAPLMonagy3f2goaw2QBpGsHF8YySQe8tU',
        timestamp: '2019-09-06T15:08:29Z',
        validation_pass: 4,
        operations_hash: 'LLoaq9gTDXXLgKZGd6af1iwnfmmQXkJJnGn6WS6XhE7kh5AsdmFER',
        fitness: ['00', '00000000011f6a7c'],
        context: 'CoWNJGqDcKWeQaiRZoo5akYwXrQBGtWAncgV9QnF16yUpAM47T5F',
        priority: 0,
        proof_of_work_nonce: '000000036e2c8c91',
        signature:
          'siguGHqTYQjaDMjZgDQjAXG9Fc8HnqCJceVJMUCHRbSFoJJCx3Lz9VpBy53nat4W4T1CvbzPJKKgq2YfFAGXeaXcQLbN4CFz',
      };

      httpBackend.createRequest.mockResolvedValue(sampleResponse);
      const result = await client.getBlockHeader();
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/header',
      });

      expect(result).toEqual({
        protocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
        chain_id: 'NetXdQprcVkpaWU',
        hash: 'BLjs6BSiYpwV5u6YpNHNSAqr1iuJRGDHXK3Qb6DH1ZkN8QbAitW',
        level: 596467,
        proto: 4,
        predecessor: 'BMYidfFK1tfryqoTRnAPLMonagy3f2goaw2QBpGsHF8YySQe8tU',
        timestamp: '2019-09-06T15:08:29Z',
        validation_pass: 4,
        operations_hash: 'LLoaq9gTDXXLgKZGd6af1iwnfmmQXkJJnGn6WS6XhE7kh5AsdmFER',
        fitness: ['00', '00000000011f6a7c'],
        context: 'CoWNJGqDcKWeQaiRZoo5akYwXrQBGtWAncgV9QnF16yUpAM47T5F',
        priority: 0,
        proof_of_work_nonce: '000000036e2c8c91',
        signature:
          'siguGHqTYQjaDMjZgDQjAXG9Fc8HnqCJceVJMUCHRbSFoJJCx3Lz9VpBy53nat4W4T1CvbzPJKKgq2YfFAGXeaXcQLbN4CFz',
      });
    });
  });

  describe('getBlockMetadata', () => {
    it('should query the right url', async () => {
      const sampleResponse = {
        protocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
        next_protocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
        test_chain_status: {
          status: 'running',
          chain_id: 'NetXpqTM3MbtXCx',
          genesis: 'BMRaLy3WBWJTdWVjosVGyYi2z4rnGxZfxqPt1RW1QMZuKUnkBuJ',
          protocol: 'PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU',
          expiration: '2019-09-24T12:01:51Z',
        },
        max_operations_ttl: 60,
        max_operation_data_length: 16384,
        max_block_header_length: 238,
        max_operation_list_length: [
          { max_size: 32768, max_op: 32 },
          { max_size: 32768 },
          { max_size: 135168, max_op: 132 },
          { max_size: 524288 },
        ],
        baker: 'tz1Lhf4J9Qxoe3DZ2nfe8FGDnvVj7oKjnMY6',
        level: {
          level: 596469,
          level_position: 596468,
          cycle: 145,
          cycle_position: 2548,
          voting_period: 18,
          voting_period_position: 6644,
          expected_commitment: false,
        },
        voting_period_kind: 'testing',
        nonce_hash: null,
        consumed_gas: '10200',
        deactivated: [],
        proposer_consensus_key: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
        baker_consensus_key: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1Lhf4J9Qxoe3DZ2nfe8FGDnvVj7oKjnMY6',
            change: '-512000000',
          },
          {
            kind: 'freezer',
            category: 'deposits',
            delegate: 'tz1Lhf4J9Qxoe3DZ2nfe8FGDnvVj7oKjnMY6',
            cycle: 145,
            change: '512000000',
          },
          {
            kind: 'freezer',
            category: 'rewards',
            delegate: 'tz1Lhf4J9Qxoe3DZ2nfe8FGDnvVj7oKjnMY6',
            cycle: 145,
            change: '16000000',
          },
        ],
      };

      httpBackend.createRequest.mockResolvedValue(sampleResponse);
      const result = await client.getBlockMetadata();
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/metadata',
      });

      expect(result).toEqual({
        protocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
        next_protocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
        test_chain_status: {
          status: 'running',
          chain_id: 'NetXpqTM3MbtXCx',
          genesis: 'BMRaLy3WBWJTdWVjosVGyYi2z4rnGxZfxqPt1RW1QMZuKUnkBuJ',
          protocol: 'PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU',
          expiration: '2019-09-24T12:01:51Z',
        },
        max_operations_ttl: 60,
        max_operation_data_length: 16384,
        max_block_header_length: 238,
        max_operation_list_length: [
          { max_size: 32768, max_op: 32 },
          { max_size: 32768 },
          { max_size: 135168, max_op: 132 },
          { max_size: 524288 },
        ],
        baker: 'tz1Lhf4J9Qxoe3DZ2nfe8FGDnvVj7oKjnMY6',
        level: {
          level: 596469,
          level_position: 596468,
          cycle: 145,
          cycle_position: 2548,
          voting_period: 18,
          voting_period_position: 6644,
          expected_commitment: false,
        },
        voting_period_kind: 'testing',
        nonce_hash: null,
        consumed_gas: '10200',
        deactivated: [],
        proposer_consensus_key: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
        baker_consensus_key: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1Lhf4J9Qxoe3DZ2nfe8FGDnvVj7oKjnMY6',
            change: '-512000000',
          },
          {
            kind: 'freezer',
            category: 'deposits',
            delegate: 'tz1Lhf4J9Qxoe3DZ2nfe8FGDnvVj7oKjnMY6',
            cycle: 145,
            change: '512000000',
          },
          {
            kind: 'freezer',
            category: 'rewards',
            delegate: 'tz1Lhf4J9Qxoe3DZ2nfe8FGDnvVj7oKjnMY6',
            cycle: 145,
            change: '16000000',
          },
        ],
      });
    });
  });

  describe('getConstants Proto015', () => {
    it('should query the right url and casts relevant properties to BigNumber', async () => {
      httpBackend.createRequest.mockResolvedValue({
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
        hard_gas_limit_per_operation: '1040000',
        hard_gas_limit_per_block: '5200000',
        proof_of_work_threshold: '-1',
        minimal_stake: '6000000000',
        vdf_difficulty: '2000000000',
        seed_nonce_revelation_tip: '125000',
        origination_size: 257,
        baking_reward_fixed_portion: '10000000',
        baking_reward_bonus_per_slot: '4286',
        endorsing_reward_per_slot: '2857',
        cost_per_byte: '250',
        hard_storage_limit_per_operation: '60000',
        quorum_min: 2000,
        quorum_max: 7000,
        min_proposal_quorum: 500,
        liquidity_baking_subsidy: '2500000',
        liquidity_baking_toggle_ema_threshold: 1000000000,
        max_operations_time_to_live: 120,
        minimal_block_delay: '15',
        delay_increment_per_round: '5',
        consensus_committee_size: 7000,
        consensus_threshold: 4667,
        minimal_participation_ratio: {
          numerator: 2,
          denominator: 3,
        },
        max_slashing_period: 2,
        frozen_deposits_percentage: 10,
        double_baking_punishment: '640000000',
        ratio_of_frozen_deposits_slashed_per_double_endorsement: {
          numerator: 1,
          denominator: 2,
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
        tx_rollup_commitment_bond: '10000000000',
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
          page_size: 4096,
        },
        sc_rollup_enable: false,
        sc_rollup_origination_size: 6314,
        sc_rollup_challenge_window_in_blocks: 20160,
        sc_rollup_max_number_of_messages_per_commitment_period: 300000000,
        sc_rollup_stake_amount: '10000000000',
        sc_rollup_commitment_period_in_blocks: 30,
        sc_rollup_max_lookahead_in_blocks: 30000,
        sc_rollup_max_active_outbox_levels: 20160,
        sc_rollup_max_outbox_messages_per_level: 100,
        sc_rollup_number_of_sections_in_dissection: 32,
        sc_rollup_timeout_period_in_blocks: 20160,
        sc_rollup_max_number_of_cemented_commitments: 5,
        zk_rollup_enable: false,
        zk_rollup_origination_size: 4000,
        zk_rollup_min_pending_to_process: 10,
      });

      const response: ConstantsResponseProto015 = await client.getConstants();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/constants',
      });
      expect(response).toEqual({
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
          denominator: 3,
        },
        max_slashing_period: 2,
        frozen_deposits_percentage: 10,
        double_baking_punishment: new BigNumber(640000000),
        ratio_of_frozen_deposits_slashed_per_double_endorsement: {
          numerator: 1,
          denominator: 2,
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
          page_size: 4096,
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
        zk_rollup_min_pending_to_process: 10,
      });
    });
  });
  describe('getConstants Proto014', () => {
    it('should query the right url and casts relevant properties to BigNumber', async () => {
      httpBackend.createRequest.mockResolvedValue({
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
        max_wrapped_proof_binary_size: 30000,
        preserved_cycles: 3,
        blocks_per_cycle: 4096,
        blocks_per_commitment: 32,
        nonce_revelation_threshold: 256,
        blocks_per_stake_snapshot: 256,
        cycles_per_voting_period: 1,
        hard_gas_limit_per_operation: '1040000',
        hard_gas_limit_per_block: '5200000',
        proof_of_work_threshold: '-1',
        tokens_per_roll: '6000000000',
        vdf_difficulty: '8000000000',
        seed_nonce_revelation_tip: '125000',
        origination_size: 257,
        baking_reward_fixed_portion: '10000000',
        baking_reward_bonus_per_slot: '4286',
        endorsing_reward_per_slot: '2857',
        cost_per_byte: '250',
        hard_storage_limit_per_operation: '60000',
        quorum_min: 2000,
        quorum_max: 7000,
        min_proposal_quorum: 500,
        liquidity_baking_subsidy: '2500000',
        liquidity_baking_sunset_level: 10000000,
        liquidity_baking_toggle_ema_threshold: 1000000000,
        max_operations_time_to_live: 120,
        minimal_block_delay: '15',
        delay_increment_per_round: '15',
        consensus_committee_size: 7000,
        consensus_threshold: 4667,
        minimal_participation_ratio: {
          numerator: 2,
          denominator: 3,
        },
        max_slashing_period: 2,
        frozen_deposits_percentage: 10,
        double_baking_punishment: '640000000',
        ratio_of_frozen_deposits_slashed_per_double_endorsement: {
          numerator: 1,
          denominator: 2,
        },
        cache_script_size: 100000000,
        cache_stake_distribution_cycles: 8,
        cache_sampler_state_cycles: 8,
        tx_rollup_enable: true,
        tx_rollup_origination_size: 4000,
        tx_rollup_hard_size_limit_per_inbox: 500000,
        tx_rollup_hard_size_limit_per_message: 5000,
        tx_rollup_max_withdrawals_per_batch: 15,
        tx_rollup_commitment_bond: '10000000000',
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
        },
        sc_rollup_enable: false,
        sc_rollup_origination_size: 6314,
        sc_rollup_challenge_window_in_blocks: 20160,
        sc_rollup_max_available_messages: 1000000,
        sc_rollup_stake_amount: '32000000',
        sc_rollup_commitment_period_in_blocks: 30,
        sc_rollup_max_lookahead_in_blocks: 30000,
        sc_rollup_max_active_outbox_levels: 20160,
        sc_rollup_max_outbox_messages_per_level: 100,
      });

      const response = await client.getConstants();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/constants',
      });
      expect(response).toEqual({
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
        max_wrapped_proof_binary_size: 30000,
        preserved_cycles: 3,
        blocks_per_cycle: 4096,
        blocks_per_commitment: 32,
        nonce_revelation_threshold: 256,
        blocks_per_stake_snapshot: 256,
        cycles_per_voting_period: 1,
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_gas_limit_per_block: new BigNumber(5200000),
        proof_of_work_threshold: new BigNumber(-1),
        tokens_per_roll: new BigNumber(6000000000),
        vdf_difficulty: new BigNumber(8000000000),
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
        liquidity_baking_sunset_level: 10000000,
        liquidity_baking_toggle_ema_threshold: 1000000000,
        max_operations_time_to_live: 120,
        minimal_block_delay: new BigNumber(15),
        delay_increment_per_round: new BigNumber(15),
        consensus_committee_size: 7000,
        consensus_threshold: 4667,
        minimal_participation_ratio: {
          numerator: 2,
          denominator: 3,
        },
        max_slashing_period: 2,
        frozen_deposits_percentage: 10,
        double_baking_punishment: new BigNumber(640000000),
        ratio_of_frozen_deposits_slashed_per_double_endorsement: {
          numerator: 1,
          denominator: 2,
        },
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
        },
        sc_rollup_enable: false,
        sc_rollup_origination_size: 6314,
        sc_rollup_challenge_window_in_blocks: 20160,
        sc_rollup_max_available_messages: 1000000,
        sc_rollup_stake_amount: new BigNumber(32000000),
        sc_rollup_commitment_period_in_blocks: 30,
        sc_rollup_max_lookahead_in_blocks: 30000,
        sc_rollup_max_active_outbox_levels: 20160,
        sc_rollup_max_outbox_messages_per_level: 100,
      });
    });
  });

  describe('getConstants Proto012', () => {
    it('should query the right url and casts property to BigNumber', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          proof_of_work_nonce_size: 8,
          nonce_length: 32,
          max_anon_ops_per_block: 132,
          max_operation_data_length: 32768,
          max_proposals_per_delegate: 20,
          max_micheline_node_count: 50000,
          max_micheline_bytes_limit: 50000,
          max_allowed_global_constants_depth: 10000,
          cache_layout: ['100000000', '240000', '2560'],
          michelson_maximum_type_size: 2001,
          preserved_cycles: 3,
          blocks_per_cycle: 4096,
          blocks_per_commitment: 32,
          blocks_per_stake_snapshot: 256,
          blocks_per_voting_period: 20480,
          hard_gas_limit_per_operation: '1040000',
          hard_gas_limit_per_block: '5200000',
          proof_of_work_threshold: '70368744177663',
          tokens_per_roll: '6000000000',
          seed_nonce_revelation_tip: '125000',
          origination_size: 257,
          baking_reward_fixed_portion: '5000000',
          baking_reward_bonus_per_slot: '2143',
          endorsing_reward_per_slot: '1428',
          cost_per_byte: '250',
          hard_storage_limit_per_operation: '60000',
          quorum_min: 2000,
          quorum_max: 7000,
          min_proposal_quorum: 500,
          liquidity_baking_subsidy: '2500000',
          liquidity_baking_sunset_level: 10000000,
          liquidity_baking_escape_ema_threshold: 666667,
          max_operations_time_to_live: 120,
          minimal_block_delay: '15',
          delay_increment_per_round: '5',
          consensus_committee_size: 7000,
          consensus_threshold: 4667,
          minimal_participation_ratio: { numerator: 2, denominator: 3 },
          max_slashing_period: 2,
          frozen_deposits_percentage: 10,
          double_baking_punishment: '640000000',
          ratio_of_frozen_deposits_slashed_per_double_endorsement: { numerator: 1, denominator: 2 },
        })
      );
      const response = await client.getConstants();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/constants',
      });
      expect(response).toEqual({
        proof_of_work_nonce_size: 8,
        nonce_length: 32,
        max_anon_ops_per_block: 132,
        max_operation_data_length: 32768,
        max_proposals_per_delegate: 20,
        preserved_cycles: 3,
        blocks_per_cycle: 4096,
        blocks_per_commitment: 32,
        blocks_per_voting_period: 20480,
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
        liquidity_baking_sunset_level: 10000000,
        liquidity_baking_escape_ema_threshold: 666667,
        max_allowed_global_constants_depth: 10000,
        max_micheline_bytes_limit: 50000,
        max_micheline_node_count: 50000,
        michelson_maximum_type_size: 2001,
        cache_layout: [new BigNumber(100000000), new BigNumber(240000), new BigNumber(2560)],
        blocks_per_stake_snapshot: 256,
        baking_reward_fixed_portion: new BigNumber(5000000),
        baking_reward_bonus_per_slot: new BigNumber(2143),
        endorsing_reward_per_slot: new BigNumber(1428),
        max_operations_time_to_live: 120,
        minimal_block_delay: new BigNumber(15),
        delay_increment_per_round: new BigNumber(5),
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
      });
    });
  });

  describe('getConstants Proto007', () => {
    it('should query the right url and casts property to BigNumber', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          proof_of_work_nonce_size: 8,
          nonce_length: 32,
          max_anon_ops_per_block: 132,
          max_operation_data_length: 16384,
          max_proposals_per_delegate: 20,
          preserved_cycles: 3,
          blocks_per_cycle: 2048,
          blocks_per_commitment: 16,
          blocks_per_roll_snapshot: 128,
          blocks_per_voting_period: 2048,
          time_between_blocks: ['30', '20'],
          endorsers_per_block: 32,
          hard_gas_limit_per_operation: '1040000',
          hard_gas_limit_per_block: '10400000',
          proof_of_work_threshold: '70368744177663',
          tokens_per_roll: '8000000000',
          michelson_maximum_type_size: 1000,
          seed_nonce_revelation_tip: '125000',
          origination_size: 257,
          block_security_deposit: '512000000',
          endorsement_security_deposit: '64000000',
          baking_reward_per_endorsement: ['1250000', '187500'],
          endorsement_reward: ['1250000', '833333'],
          cost_per_byte: '250',
          hard_storage_limit_per_operation: '60000',
          test_chain_duration: '61440',
          quorum_min: 2000,
          quorum_max: 7000,
          min_proposal_quorum: 500,
          initial_endorsers: 24,
          delay_per_missing_endorsement: '4',
        })
      );
      const response = await client.getConstants();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/constants',
      });
      expect(response.block_security_deposit).toBeInstanceOf(BigNumber);
      expect(response.block_security_deposit.toString()).toEqual('512000000');

      expect(response.endorsement_reward).toBeDefined();
      if (response.endorsement_reward instanceof Array) {
        expect(response.endorsement_reward[0]).toBeInstanceOf(BigNumber);
        expect(response.endorsement_reward[0].toString()).toEqual('1250000');
        expect(response.endorsement_reward[1]).toBeInstanceOf(BigNumber);
        expect(response.endorsement_reward[1].toString()).toEqual('833333');
      }

      expect(response.baking_reward_per_endorsement).toBeDefined();
      expect(response.baking_reward_per_endorsement![0]).toBeInstanceOf(BigNumber);
      expect(response.baking_reward_per_endorsement![0].toString()).toEqual('1250000');
      expect(response.baking_reward_per_endorsement![1]).toBeInstanceOf(BigNumber);
      expect(response.baking_reward_per_endorsement![1].toString()).toEqual('187500');

      expect(response.delay_per_missing_endorsement).toBeDefined();
      expect(response.delay_per_missing_endorsement!).toBeInstanceOf(BigNumber);
      expect(response.delay_per_missing_endorsement!.toString()).toEqual('4');

      expect(response.max_anon_ops_per_block).toBeDefined();
      expect(response.max_anon_ops_per_block!).toEqual(132);

      expect(response.max_revelations_per_block).toBeUndefined();
      expect(response.block_reward).toBeUndefined();
      expect(response.origination_burn).toBeUndefined();
    });
  });

  describe('getConstants Proto006', () => {
    it('should properties return by the RPC are accessible and the ones that do not belong to proto6 are undefined', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          proof_of_work_nonce_size: 8,
          nonce_length: 32,
          max_revelations_per_block: 32,
          max_operation_data_length: 16384,
          max_proposals_per_delegate: 20,
          preserved_cycles: 5,
          blocks_per_cycle: 4096,
          blocks_per_commitment: 32,
          blocks_per_roll_snapshot: 256,
          blocks_per_voting_period: 32768,
          time_between_blocks: ['60', '40'],
          endorsers_per_block: 32,
          hard_gas_limit_per_operation: '1040000',
          hard_gas_limit_per_block: '10400000',
          proof_of_work_threshold: '70368744177663',
          tokens_per_roll: '8000000000',
          michelson_maximum_type_size: 1000,
          seed_nonce_revelation_tip: '125000',
          origination_size: 257,
          block_security_deposit: '512000000',
          endorsement_security_deposit: '64000000',
          baking_reward_per_endorsement: ['1250000', '187500'],
          endorsement_reward: ['1250000', '833333'],
          cost_per_byte: '1000',
          hard_storage_limit_per_operation: '60000',
          test_chain_duration: '1966080',
          quorum_min: 2000,
          quorum_max: 7000,
          min_proposal_quorum: 500,
          initial_endorsers: 24,
          delay_per_missing_endorsement: '8',
        })
      );
      const response = await client.getConstants();

      expect(response.hard_gas_limit_per_operation).toBeInstanceOf(BigNumber);
      expect(response.hard_gas_limit_per_operation.toString()).toEqual('1040000');

      expect(response.max_revelations_per_block).toBeDefined();
      expect(response.max_revelations_per_block!).toEqual(32);

      expect(response.origination_size).toBeDefined();
      expect(response.origination_size!).toEqual(257);

      expect(response.max_anon_ops_per_block).toBeUndefined();
      expect(response.block_reward).toBeUndefined();
      expect(response.origination_burn).toBeUndefined();
    });
  });

  describe('getConstants Proto005', () => {
    it('should properties return by the RPC are accessible and the ones that do not belong to proto5 are undefined', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          proof_of_work_nonce_size: 8,
          nonce_length: 32,
          max_revelations_per_block: 32,
          max_operation_data_length: 16384,
          max_proposals_per_delegate: 20,
          preserved_cycles: 5,
          blocks_per_cycle: 4096,
          blocks_per_commitment: 32,
          blocks_per_roll_snapshot: 256,
          blocks_per_voting_period: 32768,
          time_between_blocks: ['60', '40'],
          endorsers_per_block: 32,
          hard_gas_limit_per_operation: '800000',
          hard_gas_limit_per_block: '8000000',
          proof_of_work_threshold: '70368744177663',
          tokens_per_roll: '8000000000',
          michelson_maximum_type_size: 1000,
          seed_nonce_revelation_tip: '125000',
          origination_size: 257,
          block_security_deposit: '512000000',
          endorsement_security_deposit: '64000000',
          block_reward: '16000000',
          baking_reward_per_endorsement: ['1250000', '187500'],
          endorsement_reward: '2000000',
          cost_per_byte: '1000',
          hard_storage_limit_per_operation: '60000',
          test_chain_duration: '1966080',
          quorum_min: 2000,
          quorum_max: 7000,
          min_proposal_quorum: 500,
          initial_endorsers: 24,
          delay_per_missing_endorsement: '8',
        })
      );
      const response = await client.getConstants();

      expect(response.endorsement_reward).toBeInstanceOf(BigNumber);
      expect(response.endorsement_reward.toString()).toEqual('2000000');

      expect(response.block_reward).toBeDefined();
      if (response.block_reward) {
        expect(response.block_reward).toBeInstanceOf(BigNumber);
        expect(response.block_reward.toString()).toEqual('16000000');
      }
      expect(response.quorum_max).toBeDefined();
      if (response.quorum_max) {
        expect(response.quorum_max).toEqual(7000);
      }

      expect(response.test_chain_duration).toBeDefined();
      if (response.test_chain_duration) {
        expect(response.block_reward).toBeInstanceOf(BigNumber);
        expect(response.test_chain_duration.toString()).toEqual('1966080');
      }

      expect(response.max_anon_ops_per_block).toBeUndefined();
      expect(response.origination_burn).toBeUndefined();
    });
  });

  describe('getBlock', () => {
    it('should query the right url and property for endorsement', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          protocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
          chain_id: 'NetXdQprcVkpaWU',
          hash: 'BMJZyYF1aYafqFs7HE6i32XFy9raoye4z93dDi68jiB6swgGztx',
          header: {
            level: 578756,
            proto: 4,
            predecessor: 'BMAAqpF8w3qPSDUaGAsJXA3QQTgzeBJbRWerSvnpGjpR9ERGNEX',
            timestamp: '2019-08-24T21:37:32Z',
            validation_pass: 4,
            operations_hash: 'LLoa7BV7nk6eVGiTsoMtgYegmnFrn5A1rZFPUQKzUgKHLTnc44hVu',
            fitness: ['00', '000000000116a295'],
            context: 'CoUqeHHzXBuizWXjsxcFHQ385ETgSyWth5CxJJt2mVpjkkDYo2W1',
            priority: 0,
            proof_of_work_nonce: '00000003a8df54b7',
            signature:
              'sigcqr3u5kY8sB8iY3CFo6FWEFb97trx92JjLnJpwQSibqwRUW3sQoHFH22E1FfpGYfgmZYxmhxrghNV5zSRqsvCSRBfmMzk',
          },
          metadata: {
            protocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
            next_protocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
            test_chain_status: {
              status: 'not_running',
            },
            max_operations_ttl: 60,
            max_operation_data_length: 16384,
            max_block_header_length: 238,
            max_operation_list_length: [
              {
                max_size: 32768,
                max_op: 32,
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
            baker: 'tz1NpWrAyDL9k2Lmnyxcgr9xuJakbBxdq7FB',
            level: {
              level: 578756,
              level_position: 578755,
              cycle: 141,
              cycle_position: 1219,
              voting_period: 17,
              voting_period_position: 21699,
              expected_commitment: false,
            },
            voting_period_kind: 'testing_vote',
            nonce_hash: null,
            consumed_gas: '112200',
            deactivated: [],
            balance_updates: [
              {
                kind: 'contract',
                contract: 'tz1NpWrAyDL9k2Lmnyxcgr9xuJakbBxdq7FB',
                change: '-512000000',
              },
              {
                kind: 'freezer',
                category: 'deposits',
                delegate: 'tz1NpWrAyDL9k2Lmnyxcgr9xuJakbBxdq7FB',
                cycle: 141,
                change: '512000000',
              },
              {
                kind: 'freezer',
                category: 'rewards',
                delegate: 'tz1NpWrAyDL9k2Lmnyxcgr9xuJakbBxdq7FB',
                cycle: 141,
                change: '16000000',
              },
            ],
          },
          operations: [
            [
              {
                protocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
                chain_id: 'NetXdQprcVkpaWU',
                hash: 'oondRNZutoyWCZtXvvxKXcw8Us7ms8vhN8VUet32PopSREiMF1a',
                branch: 'BMAAqpF8w3qPSDUaGAsJXA3QQTgzeBJbRWerSvnpGjpR9ERGNEX',
                contents: [
                  {
                    kind: 'endorsement',
                    level: 578755,
                    metadata: {
                      balance_updates: [
                        {
                          kind: 'contract',
                          contract: 'tz1iZEKy4LaAjnTmn2RuGDf2iqdAQKnRi8kY',
                          change: '-64000000',
                        },
                        {
                          kind: 'freezer',
                          category: 'deposits',
                          delegate: 'tz1iZEKy4LaAjnTmn2RuGDf2iqdAQKnRi8kY',
                          cycle: 141,
                          change: '64000000',
                        },
                        {
                          kind: 'freezer',
                          category: 'rewards',
                          delegate: 'tz1iZEKy4LaAjnTmn2RuGDf2iqdAQKnRi8kY',
                          cycle: 141,
                          change: '2000000',
                        },
                      ],
                      delegate: 'tz1iZEKy4LaAjnTmn2RuGDf2iqdAQKnRi8kY',
                      slots: [16],
                    },
                  },
                ],
                signature:
                  'sigWXsVEVYZFkNVuJJR6PCjt4kX89jrRSxjNqcRdPPe1Bsawvjr7BeuuFjMfAhgqB84R8HmHuLKyoAhU5vngC82xjuuQuWH6',
              },
            ],
          ],
        })
      );
      const response = await client.getBlock();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head',
      });
      const attestation = response.operations[0][0]
        .contents[0] as OperationContentsAndResultAttestation;
      expect(attestation.metadata.balance_updates![0].kind).toEqual('contract');
    });
  });

  describe('getBlock', () => {
    it('should query the right url and property for operation', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          protocol: 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
          chain_id: 'NetXSgo1ZT2DRUG',
          hash: 'BKjqpGqKggVrYbkBmBUYjLx8QdCUxBLaVGr1GWKho4ziBo1KQFX',
          header: {
            level: 90973,
            proto: 1,
            predecessor: 'BMF7j462upRKLRWEdmFYTCMK3kuEfbQdR2Apo7noc1ZwzPZi2ji',
            timestamp: '2021-03-16T17:49:35Z',
            validation_pass: 4,
            operations_hash: 'LLoZv71M2tWPD8mMjDhf7QcE5ZaHrtYCu4wFRhmPkBWvwCEMxacei',
            fitness: ['01', '000000000001635c'],
            context: 'CoV8F9ro52txU4rGRGNXfQZgbE3pZVMygNV4UGjf6foKhBMb8MJC',
            priority: 0,
            proof_of_work_nonce: '6102c8089c360500',
            signature:
              'sigkj5nVVW6Zq7F9dEstPs5o2s1vTnUfwhsWi3UnmwrjYVwN9gfmXUBArzSLeXEUNQBM4KUYSg385i1ajR9TugSkM2swFzQp',
          },
          metadata: {
            protocol: 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
            next_protocol: 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
            test_chain_status: {
              status: 'not_running',
            },
            max_operations_ttl: 60,
            max_operation_data_length: 16384,
            max_block_header_length: 238,
            max_operation_list_length: [
              {
                max_size: 32768,
                max_op: 32,
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
            baker: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
            level: {
              level: 90973,
              level_position: 90972,
              cycle: 44,
              cycle_position: 860,
              voting_period: 22,
              voting_period_position: 860,
              expected_commitment: false,
            },
            level_info: {
              level: 90973,
              level_position: 90972,
              cycle: 44,
              cycle_position: 860,
              expected_commitment: false,
            },
            voting_period_kind: 'proposal',
            voting_period_info: {
              voting_period: {
                index: 22,
                kind: 'proposal',
                start_position: 90112,
              },
              position: 860,
              remaining: 3235,
            },
            nonce_hash: null,
            consumed_gas: '73225095',
            deactivated: [],
            balance_updates: [
              {
                kind: 'contract',
                contract: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                change: '-512000000',
              },
              {
                kind: 'freezer',
                category: 'deposits',
                delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                cycle: 44,
                change: '512000000',
              },
              {
                kind: 'freezer',
                category: 'rewards',
                delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                cycle: 44,
                change: '38750000',
              },
            ],
          },
          operations: [
            [
              {
                protocol: 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
                chain_id: 'NetXSgo1ZT2DRUG',
                hash: 'onefqcSYA5FNfNW68ghLqQajxnM9cZ3vvdNaTDR1Mhv34LBAhaG',
                branch: 'BMF7j462upRKLRWEdmFYTCMK3kuEfbQdR2Apo7noc1ZwzPZi2ji',
                contents: [
                  {
                    kind: 'transaction',
                    source: 'tz3beCZmQhd5Q1KNMZbiLCarXVo9aqpPHYe8',
                    fee: '2820',
                    counter: '184578',
                    gas_limit: '24760',
                    storage_limit: '1',
                    amount: '0',
                    destination: 'KT1LSuT4NgCQyZK1CWpss7FcJTTw68NDgPyR',
                    parameters: {
                      entrypoint: 'mint',
                      value: {
                        prim: 'Pair',
                        args: [
                          {
                            string: 'tz3beCZmQhd5Q1KNMZbiLCarXVo9aqpPHYe8',
                          },
                          {
                            int: '100',
                          },
                        ],
                      },
                    },
                    metadata: {
                      balance_updates: [
                        {
                          kind: 'contract',
                          contract: 'tz3beCZmQhd5Q1KNMZbiLCarXVo9aqpPHYe8',
                          change: '-2820',
                        },
                        {
                          kind: 'freezer',
                          category: 'fees',
                          delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                          cycle: 44,
                          change: '2820',
                        },
                      ],
                      operation_result: {
                        status: 'applied',
                        storage: [
                          {
                            int: '33681',
                          },
                          {
                            bytes: '0002a7f8d8600737ff279e4b9a4b1518157b653a314d',
                          },
                          {
                            prim: 'False',
                          },
                          {
                            int: '300',
                          },
                        ],
                        big_map_diff: [
                          {
                            action: 'update',
                            big_map: '33681',
                            key_hash: 'expruAQuDQJ9ojnpqipCAbR23gBSSff7AxaMT9UBRjpZpiDHfJ6b6L',
                            key: {
                              bytes: '0002a7f8d8600737ff279e4b9a4b1518157b653a314d',
                            },
                            value: {
                              prim: 'Pair',
                              args: [
                                {
                                  int: '102',
                                },
                                [],
                              ],
                            },
                          },
                        ],
                        balance_updates: [
                          {
                            kind: 'contract',
                            contract: 'tz3beCZmQhd5Q1KNMZbiLCarXVo9aqpPHYe8',
                            change: '-250',
                          },
                        ],
                        consumed_gas: '24660',
                        consumed_milligas: '24659284',
                        storage_size: '5335',
                        paid_storage_size_diff: '1',
                        lazy_storage_diff: [
                          {
                            kind: 'big_map',
                            id: '33681',
                            diff: {
                              action: 'update',
                              updates: [
                                {
                                  key_hash:
                                    'expruAQuDQJ9ojnpqipCAbR23gBSSff7AxaMT9UBRjpZpiDHfJ6b6L',
                                  key: {
                                    bytes: '0002a7f8d8600737ff279e4b9a4b1518157b653a314d',
                                  },
                                  value: {
                                    prim: 'Pair',
                                    args: [
                                      {
                                        int: '102',
                                      },
                                      [],
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
                signature:
                  'sigmCS2nZquXi3vXX8p7iwc6TVYC87FsGYkxSgEMiQESbM5dnnP4SGe4YHLRFXuRwcs1VaNLsiFWzVQVnpbNDfAhYhPgRnCG',
              },
            ],
          ],
        })
      );

      const response = await client.getBlock();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head',
      });
      const transaction = response.operations[0][0]
        .contents[0] as OperationContentsAndResultTransaction;
      expect(transaction.metadata.balance_updates![0].kind).toEqual('contract');
      expect(transaction.metadata.balance_updates![0].change).toEqual('-2820');
      expect(transaction.metadata.operation_result.status).toEqual('applied');
      expect(transaction.metadata.operation_result.consumed_gas).toEqual('24660');
    });

    it('should query the right url and properties (big_map_diff and lazy_storage_diff) in transaction operation result, proto 9', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          protocol: 'PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i',
          chain_id: 'NetXdQprcVkpaWU',
          hash: 'BLQFAtBgdUtRHoceLfvfVEL6ick7JvZrNoyvAdvqJGD1HWuJ7fV',
          header: {
            level: 1470478,
            proto: 9,
            predecessor: 'BKqxeSBXxYZhjjuFc8At4vEtYjZQJKEPxb83iJqetYDU3CGYQ42',
            timestamp: '2021-05-14T00:13:58Z',
            validation_pass: 4,
            operations_hash: 'LLoaX8tJAJqhkhXhc2cy7yzwjQbikUYmQxQKYqQvYm9Tfq9E9tML7',
            fitness: ['01', '00000000000c700e'],
            context: 'CoWFaDTwc3TnXws8hfdzE8QNUA3WCvH64XBR2ZaC9EBKePBwpkSy',
            priority: 0,
            proof_of_work_nonce: '31e6641dd3560300',
            signature:
              'sigw8azwmbdkJjMNoGD6Ls2idXAdxuexUZZV5VMTpJnx1PADBqhFgDma42PGyVLEfd4FybianKrEJcTVMBb6GMgdZtSDYbYL',
          },
          metadata: {
            protocol: 'PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i',
            next_protocol: 'PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i',
            test_chain_status: {
              status: 'not_running',
            },
            max_operations_ttl: 60,
            max_operation_data_length: 32768,
            max_block_header_length: 238,
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
            baker: 'tz1W5VkdB5s7ENMESVBtwyt9kyvLqPcUczRT',
            level: {
              level: 1470478,
              level_position: 1470477,
              cycle: 359,
              cycle_position: 13,
              voting_period: 47,
              voting_period_position: 4110,
              expected_commitment: false,
            },
            level_info: {
              level: 1470478,
              level_position: 1470477,
              cycle: 359,
              cycle_position: 13,
              expected_commitment: false,
            },
            voting_period_kind: 'proposal',
            voting_period_info: {
              voting_period: {
                index: 47,
                kind: 'proposal',
                start_position: 1466367,
              },
              position: 4110,
              remaining: 16369,
            },
            nonce_hash: null,
            consumed_gas: '1644308817',
            deactivated: [],
            balance_updates: [
              {
                kind: 'contract',
                contract: 'tz1W5VkdB5s7ENMESVBtwyt9kyvLqPcUczRT',
                change: '-512000000',
                origin: 'block',
              },
              {
                kind: 'freezer',
                category: 'deposits',
                delegate: 'tz1W5VkdB5s7ENMESVBtwyt9kyvLqPcUczRT',
                cycle: 359,
                change: '512000000',
                origin: 'block',
              },
              {
                kind: 'freezer',
                category: 'rewards',
                delegate: 'tz1W5VkdB5s7ENMESVBtwyt9kyvLqPcUczRT',
                cycle: 359,
                change: '33750000',
                origin: 'block',
              },
            ],
          },
          operations: [
            [
              {
                protocol: 'PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i',
                chain_id: 'NetXdQprcVkpaWU',
                hash: 'oo4ZXrmij79uZfWKPzxQHsyVS3TLecHDVx8ZrLv6qpeijLLzP3b',
                branch: 'BKqxeSBXxYZhjjuFc8At4vEtYjZQJKEPxb83iJqetYDU3CGYQ42',
                contents: [
                  {
                    kind: 'transaction',
                    source: 'tz1PaJwmmL2nrRt5K6HvwFEc6fUfxNe6Dyp5',
                    fee: '12543',
                    counter: '12961179',
                    gas_limit: '122564',
                    storage_limit: '212',
                    amount: '500000',
                    destination: 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9',
                    parameters: {
                      entrypoint: 'collect',
                      value: {
                        prim: 'Pair',
                        args: [
                          {
                            int: '1',
                          },
                          {
                            int: '140470',
                          },
                        ],
                      },
                    },
                    metadata: {
                      balance_updates: [
                        {
                          kind: 'contract',
                          contract: 'tz1PaJwmmL2nrRt5K6HvwFEc6fUfxNe6Dyp5',
                          change: '-12543',
                          origin: 'block',
                        },
                        {
                          kind: 'freezer',
                          category: 'fees',
                          delegate: 'tz1W5VkdB5s7ENMESVBtwyt9kyvLqPcUczRT',
                          cycle: 359,
                          change: '12543',
                          origin: 'block',
                        },
                      ],
                      operation_result: {
                        status: 'applied',
                        storage: [
                          [
                            {
                              prim: 'Pair',
                              args: [
                                {
                                  bytes: '01d4bbb83486df92642008e9ce812481f4d564611100',
                                },
                                {
                                  prim: 'Pair',
                                  args: [
                                    {
                                      int: '1618452581',
                                    },
                                    {
                                      bytes: '01123aaf8d2c25e0ddafa6d98e16582de7478f092500',
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              prim: 'True',
                            },
                            {
                              bytes: '00005db799bf9b0dc319ba1cf21ab01461a9639043ca',
                            },
                            {
                              int: '521',
                            },
                          ],
                          {
                            prim: 'Pair',
                            args: [
                              {
                                bytes: '01b752c7f3de31759bce246416a6823e86b9756c6c00',
                              },
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    int: '78796',
                                  },
                                  {
                                    int: '522',
                                  },
                                ],
                              },
                            ],
                          },
                          {
                            int: '0',
                          },
                          {
                            int: '142549',
                          },
                          {
                            int: '523',
                          },
                        ],
                        big_map_diff: [
                          {
                            action: 'update',
                            big_map: '523',
                            key_hash: 'exprttR8DRSn1Ry4mfsAUQTnEqNrHGppnGdyk7hz3hTinLEWsX3HQg',
                            key: {
                              int: '140470',
                            },
                            value: {
                              prim: 'Pair',
                              args: [
                                {
                                  prim: 'Pair',
                                  args: [
                                    {
                                      bytes: '0000c7e376baa5650223728c95963f77119148e4f5f4',
                                    },
                                    {
                                      int: '14',
                                    },
                                  ],
                                },
                                {
                                  prim: 'Pair',
                                  args: [
                                    {
                                      int: '77582',
                                    },
                                    {
                                      int: '500000',
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                        ],
                        balance_updates: [
                          {
                            kind: 'contract',
                            contract: 'tz1PaJwmmL2nrRt5K6HvwFEc6fUfxNe6Dyp5',
                            change: '-500000',
                            origin: 'block',
                          },
                          {
                            kind: 'contract',
                            contract: 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9',
                            change: '500000',
                            origin: 'block',
                          },
                        ],
                        consumed_gas: '91530',
                        consumed_milligas: '91529556',
                        storage_size: '16397849',
                        lazy_storage_diff: [
                          {
                            kind: 'big_map',
                            id: '523',
                            diff: {
                              action: 'update',
                              updates: [
                                {
                                  key_hash:
                                    'exprttR8DRSn1Ry4mfsAUQTnEqNrHGppnGdyk7hz3hTinLEWsX3HQg',
                                  key: {
                                    int: '140470',
                                  },
                                  value: {
                                    prim: 'Pair',
                                    args: [
                                      {
                                        prim: 'Pair',
                                        args: [
                                          {
                                            bytes: '0000c7e376baa5650223728c95963f77119148e4f5f4',
                                          },
                                          {
                                            int: '14',
                                          },
                                        ],
                                      },
                                      {
                                        prim: 'Pair',
                                        args: [
                                          {
                                            int: '77582',
                                          },
                                          {
                                            int: '500000',
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                          {
                            kind: 'big_map',
                            id: '522',
                            diff: {
                              action: 'update',
                              updates: [],
                            },
                          },
                          {
                            kind: 'big_map',
                            id: '521',
                            diff: {
                              action: 'update',
                              updates: [],
                            },
                          },
                        ],
                      },
                      internal_operation_results: [
                        {
                          kind: 'transaction',
                          source: 'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9',
                          nonce: 26,
                          amount: '0',
                          destination: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
                          parameters: {
                            entrypoint: 'transfer',
                            value: [
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    bytes: '016498b7494a18a572c1d24484038545662c0454ed00',
                                  },
                                  [
                                    {
                                      prim: 'Pair',
                                      args: [
                                        {
                                          bytes: '00002b2c68041fe4a6d3219220a12d64a7cc06288e7a',
                                        },
                                        {
                                          prim: 'Pair',
                                          args: [
                                            {
                                              int: '77582',
                                            },
                                            {
                                              int: '1',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                ],
                              },
                            ],
                          },
                          result: {
                            status: 'applied',
                            storage: [
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    bytes: '016498b7494a18a572c1d24484038545662c0454ed00',
                                  },
                                  {
                                    prim: 'Pair',
                                    args: [
                                      {
                                        int: '78796',
                                      },
                                      {
                                        int: '511',
                                      },
                                    ],
                                  },
                                ],
                              },
                              {
                                prim: 'Pair',
                                args: [
                                  {
                                    int: '512',
                                  },
                                  {
                                    int: '513',
                                  },
                                ],
                              },
                              {
                                prim: 'False',
                              },
                              {
                                int: '514',
                              },
                            ],
                            big_map_diff: [
                              {
                                action: 'update',
                                big_map: '511',
                                key_hash: 'exprtjwzEHJr4evsEBcd8va7d8fyb6aA8LRkfsGdVhXGxM9Unjgk3i',
                                key: {
                                  prim: 'Pair',
                                  args: [
                                    {
                                      bytes: '016498b7494a18a572c1d24484038545662c0454ed00',
                                    },
                                    {
                                      int: '77582',
                                    },
                                  ],
                                },
                                value: {
                                  int: '14',
                                },
                              },
                              {
                                action: 'update',
                                big_map: '511',
                                key_hash: 'exprtw5AgJ5izrup4msD2ovuwgoVciojz4fGz6YoknvHvjo7xEMzcm',
                                key: {
                                  prim: 'Pair',
                                  args: [
                                    {
                                      bytes: '00002b2c68041fe4a6d3219220a12d64a7cc06288e7a',
                                    },
                                    {
                                      int: '77582',
                                    },
                                  ],
                                },
                                value: {
                                  int: '1',
                                },
                              },
                            ],
                            balance_updates: [
                              {
                                kind: 'contract',
                                contract: 'tz1PaJwmmL2nrRt5K6HvwFEc6fUfxNe6Dyp5',
                                change: '-16750',
                                origin: 'block',
                              },
                            ],
                            consumed_gas: '26673',
                            consumed_milligas: '26672257',
                            storage_size: '47030669',
                            paid_storage_size_diff: '67',
                            lazy_storage_diff: [
                              {
                                kind: 'big_map',
                                id: '514',
                                diff: {
                                  action: 'update',
                                  updates: [],
                                },
                              },
                              {
                                kind: 'big_map',
                                id: '513',
                                diff: {
                                  action: 'update',
                                  updates: [],
                                },
                              },
                              {
                                kind: 'big_map',
                                id: '512',
                                diff: {
                                  action: 'update',
                                  updates: [],
                                },
                              },
                              {
                                kind: 'big_map',
                                id: '511',
                                diff: {
                                  action: 'update',
                                  updates: [
                                    {
                                      key_hash:
                                        'exprtw5AgJ5izrup4msD2ovuwgoVciojz4fGz6YoknvHvjo7xEMzcm',
                                      key: {
                                        prim: 'Pair',
                                        args: [
                                          {
                                            bytes: '00002b2c68041fe4a6d3219220a12d64a7cc06288e7a',
                                          },
                                          {
                                            int: '77582',
                                          },
                                        ],
                                      },
                                      value: {
                                        int: '1',
                                      },
                                    },
                                    {
                                      key_hash:
                                        'exprtjwzEHJr4evsEBcd8va7d8fyb6aA8LRkfsGdVhXGxM9Unjgk3i',
                                      key: {
                                        prim: 'Pair',
                                        args: [
                                          {
                                            bytes: '016498b7494a18a572c1d24484038545662c0454ed00',
                                          },
                                          {
                                            int: '77582',
                                          },
                                        ],
                                      },
                                      value: {
                                        int: '14',
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                ],
                signature:
                  'sigvCzuirg8Dgwe37iXHEhBxD4NJ9aUUTn6679jzSF9Uwq2yJ3GbK4rnVEuKS935CateN8L4fHDD13RtRWomBUE4M92QqEvN',
              },
            ],
          ],
        })
      );

      const response = await client.getBlock();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head',
      });

      const transaction = response.operations[0][0]
        .contents[0] as OperationContentsAndResultTransaction;
      expect(transaction.kind).toEqual('transaction');
      expect(transaction.metadata.operation_result.lazy_storage_diff).toBeDefined();

      expect(transaction.metadata.operation_result.lazy_storage_diff![0].kind).toEqual('big_map');
      expect(transaction.metadata.operation_result.lazy_storage_diff![0].id).toEqual('523');
      expect(transaction.metadata.operation_result.lazy_storage_diff![0].diff.action).toEqual(
        'update'
      );

      expect(
        transaction.metadata.operation_result.lazy_storage_diff![0].diff.updates
      ).toBeDefined();
      const update0 = transaction.metadata.operation_result
        .lazy_storage_diff![0] as LazyStorageDiffBigMap;
      expect(update0.diff.updates).toBeDefined();
      expect(update0.diff.updates![0].key_hash).toEqual(
        'exprttR8DRSn1Ry4mfsAUQTnEqNrHGppnGdyk7hz3hTinLEWsX3HQg'
      );

      expect(transaction.metadata.operation_result.big_map_diff).toBeDefined();
      expect(transaction.metadata.operation_result.big_map_diff![0].action).toEqual('update');
      expect(transaction.metadata.operation_result.big_map_diff![0].big_map!.toString()).toEqual(
        '523'
      );

      expect(transaction.metadata.internal_operation_results).toBeDefined();
      expect(transaction.metadata.internal_operation_results![0].kind).toEqual('transaction');
      expect(transaction.metadata.internal_operation_results![0].source).toEqual(
        'KT1Hkg5qeNhfwpKW4fXvq7HGZB9z2EnmCCA9'
      );
      expect(transaction.metadata.internal_operation_results![0].nonce).toEqual(26);

      const result = transaction.metadata.internal_operation_results![0]
        .result as OperationResultTransaction;
      expect(result.status).toEqual('applied');
      expect(result.big_map_diff).toBeDefined();
      expect(result.big_map_diff![0].action).toEqual('update');
      expect(result.big_map_diff![0].key_hash).toEqual(
        'exprtjwzEHJr4evsEBcd8va7d8fyb6aA8LRkfsGdVhXGxM9Unjgk3i'
      );
      expect(result.balance_updates).toBeDefined();
      expect(result.balance_updates![0].kind).toEqual('contract');
      expect(result.balance_updates![0].origin).toEqual('block');
      expect(result.lazy_storage_diff).toBeDefined();
      expect(result.lazy_storage_diff![0].kind).toEqual('big_map');
      expect(result.lazy_storage_diff![0].id).toEqual('514');
    });

    it('should query the right url and properties (lazy_storage_diff of kind sapling_state) in transaction operation result, proto 8', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          protocol: 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
          chain_id: 'NetXSgo1ZT2DRUG',
          hash: 'BL463rWSReHJRLkwUPdGSS6fDqvJwAVPeaZGTBhEkFbYecAR9Ks',
          header: {},
          metadata: {},
          operations: [
            [],
            [],
            [],
            [
              {
                protocol: 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
                chain_id: 'NetXSgo1ZT2DRUG',
                hash: 'onhF4PVPmPDJjrRfiFf1Tg1wBM4SjQuk5h2Ucx84f42CfAeQtVe',
                branch: 'BKkgRGNt4kw7EDZvWXQjYVzCQvMsZYkpUSweepc9HZumQ3qSdnv',
                contents: [
                  {
                    kind: 'origination',
                    source: 'tz2BG2915vryjQF4kTnqUWC7hQ6Bc4YKZQC4',
                    fee: '2138',
                    counter: '1000052',
                    gas_limit: '8849',
                    storage_limit: '1302',
                    balance: '0',
                    script: {},
                    metadata: {
                      balance_updates: [],
                      operation_result: {
                        status: 'applied',
                        big_map_diff: [],
                        balance_updates: [
                          {
                            kind: 'contract',
                            contract: 'tz2BG2915vryjQF4kTnqUWC7hQ6Bc4YKZQC4',
                            change: '-261250',
                          },
                          {
                            kind: 'contract',
                            contract: 'tz2BG2915vryjQF4kTnqUWC7hQ6Bc4YKZQC4',
                            change: '-64250',
                          },
                        ],
                        originated_contracts: ['KT1RqdcabssqPDfKoBvVNZjPVPBpmuUW4UVe'],
                        consumed_gas: '8749',
                        consumed_milligas: '8748162',
                        storage_size: '1045',
                        paid_storage_size_diff: '1045',
                        lazy_storage_diff: [
                          {
                            kind: 'sapling_state',
                            id: '12515',
                            diff: {
                              action: 'alloc',
                              updates: {
                                commitments_and_ciphertexts: [],
                                nullifiers: [],
                              },
                              memo_size: 8,
                            },
                          },
                          {
                            kind: 'sapling_state',
                            id: '12514',
                            diff: {
                              action: 'alloc',
                              updates: {
                                commitments_and_ciphertexts: [],
                                nullifiers: [],
                              },
                              memo_size: 8,
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
                signature:
                  'sigs45ddgjWHNHRNTFxirJahw6ZBFnMTFgNNXvuKAxS7nrgBrVG31TPnwjF9Rma48rf9iuFT7hqJg69MWR5ZsnQkqa3Ekaoj',
              },
            ],
          ],
        })
      );

      const response = await client.getBlock();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head',
      });

      const origination = response.operations[3][0]
        .contents[0] as OperationContentsAndResultOrigination;
      expect(origination.kind).toEqual('origination');
      expect(origination.metadata.operation_result.lazy_storage_diff).toBeDefined();
      const lazy_storage_diff_0 = origination.metadata.operation_result
        .lazy_storage_diff![0] as LazyStorageDiffSaplingState;
      expect(lazy_storage_diff_0.kind).toEqual('sapling_state');
      expect(lazy_storage_diff_0.id).toEqual('12515');
      expect(lazy_storage_diff_0.diff.action).toEqual('alloc');
      expect(lazy_storage_diff_0.diff.updates).toBeDefined();
      expect(lazy_storage_diff_0.diff.updates!.commitments_and_ciphertexts).toBeInstanceOf(Array);
      expect(lazy_storage_diff_0.diff.updates!.nullifiers).toBeInstanceOf(Array);
      expect(lazy_storage_diff_0.diff.memo_size).toBeDefined();
      expect(lazy_storage_diff_0.diff.memo_size).toEqual(8);
    });

    it('should access new properties "liquidity_baking_escape_ema", "implicit_operations_results" and "subsidy" in block metadata, proto 10', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          protocol: 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
          chain_id: 'NetXz969SFaFn8k',
          hash: 'BMUN7Jt6hv7pVwnVSULxujYXy6qVaFLVoUbd6sQXsagjXpH4iWw',
          header: {
            level: 218022,
            proto: 2,
            predecessor: 'BKovSSUyqB2dfs5RtrVfFLDugyYavpQ4ULi5KexV8r6HPXA6QL3',
            timestamp: '2021-07-19T23:41:07Z',
            validation_pass: 4,
            operations_hash: 'LLoasnx73KY1xekuqN6qnG7GQUrdr6MsuRxJB5S6rqphsR2oX7sDc',
            fitness: ['01', '00000000000353a5'],
            context: 'CoWYkYRZg8KswUR8eq9CcXNUuUiqjnck1enWRXmtPRocSg4kPXo4',
            priority: 0,
            proof_of_work_nonce: 'bc2cc86f02c40200',
            liquidity_baking_escape_vote: false,
            signature:
              'sigiHpzCAzTLxdSmuD8c3Tn4yHxfhbKErnZwrW8VGr2Q4Y848RNWfLhRrmp9FQExZtXc9ESQab3trtckRdukrvXd7ruBsL4n',
          },
          metadata: {
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
              level: 218022,
              level_position: 218021,
              cycle: 54,
              cycle_position: 933,
              expected_commitment: false,
            },
            voting_period_info: {
              voting_period: { index: 10, kind: 'proposal', start_position: 204801 },
              position: 13220,
              remaining: 7259,
            },
            nonce_hash: null,
            consumed_gas: '0',
            deactivated: [],
            balance_updates: [],
            liquidity_baking_escape_ema: 283204,
            implicit_operations_results: [
              {
                kind: 'transaction',
                storage: [
                  { int: '104' },
                  { int: '177311484916' },
                  { int: '118' },
                  { bytes: '01e927f00ef734dfc85919635e9afc9166c83ef9fc00' },
                  { bytes: '0115eb0104481a6d7921160bc982c5e0a561cd8a3a00' },
                ],
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5',
                    change: '2500000',
                    origin: 'subsidy',
                  },
                ],
                consumed_gas: '2118',
                consumed_milligas: '2117037',
                storage_size: '4633',
              },
            ],
          },
          operations: [],
        })
      );

      const response = await client.getBlock();

      expect(response.metadata.liquidity_baking_escape_ema).toEqual(283204);
      expect(typeof response.metadata.liquidity_baking_escape_ema).toBe('number');

      expect(response.metadata.implicit_operations_results).toBeDefined();
      expect(response.metadata.implicit_operations_results!).toBeInstanceOf(Array);
      expect(response.metadata.implicit_operations_results!.length).toEqual(1);

      expect(response.metadata.implicit_operations_results![0].kind).toEqual('transaction');

      expect(response.metadata.implicit_operations_results![0].consumed_gas).toBeDefined();
      expect(response.metadata.implicit_operations_results![0].consumed_gas).toEqual('2118');

      expect(response.metadata.implicit_operations_results![0].consumed_milligas).toBeDefined();
      expect(response.metadata.implicit_operations_results![0].consumed_milligas).toEqual(
        '2117037'
      );

      expect(response.metadata.implicit_operations_results![0].storage).toBeDefined();
      expect(response.metadata.implicit_operations_results![0].big_map_diff).toBeUndefined();

      expect(response.metadata.implicit_operations_results![0].balance_updates).toBeDefined();
      expect(
        response.metadata.implicit_operations_results![0].balance_updates![0].origin
      ).toBeDefined();
      expect(response.metadata.implicit_operations_results![0].balance_updates![0].origin).toEqual(
        'subsidy'
      );

      expect(
        response.metadata.implicit_operations_results![0].originated_contracts
      ).toBeUndefined();

      expect(response.metadata.implicit_operations_results![0].storage_size).toBeDefined();
      expect(response.metadata.implicit_operations_results![0].storage_size).toEqual('4633');

      expect(
        response.metadata.implicit_operations_results![0].paid_storage_size_diff
      ).toBeUndefined();
      expect(response.metadata.implicit_operations_results![0].lazy_storage_diff).toBeUndefined();
    });

    it('should fetch a block having a RegisterGlobalConstant operation and it validates its properties, proto 11', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          protocol: 'PtHangzHogokSuiMHemCuowEavgYTP8J5qQ9fQS793MHYFpCY3r',
          chain_id: 'NetXuXoGoLxNK6o',
          hash: 'BLGJTp5epczxcqaKkDdpPSKStBQ9FbLDR8qjprW1LE5SbkzmyCJ',
          header: {},
          metadata: {},
          operations: [
            [],
            [],
            [],
            [
              {
                protocol: 'PtHangzHogokSuiMHemCuowEavgYTP8J5qQ9fQS793MHYFpCY3r',
                chain_id: 'NetXuXoGoLxNK6o',
                hash: 'ooG5DTHDKCeJTSaJhmQqxc2K4CVt5qYJaCXCupaMxAMAabcAJkc',
                branch: 'BLU4Led8FWFT9WiYgSLbFb9AJ6eTi4LxfwshHpvZwsupuKzLeLN',
                contents: [
                  {
                    kind: 'register_global_constant',
                    source: 'tz1TJGsZxvr6aBGUqfQVxufesTtA7QGi696D',
                    fee: '372',
                    counter: '7423375',
                    gas_limit: '1330',
                    storage_limit: '93',
                    value: {
                      prim: 'Pair',
                      args: [
                        {
                          int: '999',
                        },
                        {
                          int: '999',
                        },
                      ],
                    },
                    metadata: {
                      balance_updates: [
                        {
                          kind: 'contract',
                          contract: 'tz1TJGsZxvr6aBGUqfQVxufesTtA7QGi696D',
                          change: '-372',
                          origin: 'block',
                        },
                        {
                          kind: 'freezer',
                          category: 'fees',
                          delegate: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
                          cycle: 17,
                          change: '372',
                          origin: 'block',
                        },
                      ],
                      operation_result: {
                        status: 'applied',
                        balance_updates: [
                          {
                            kind: 'contract',
                            contract: 'tz1TJGsZxvr6aBGUqfQVxufesTtA7QGi696D',
                            change: '-18250',
                            origin: 'block',
                          },
                        ],
                        consumed_gas: '1230',
                        storage_size: '73',
                        global_address: 'exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2',
                      },
                    },
                  },
                ],
                signature:
                  'sigVW23SZBAnGLYQSDxN8y4YvMLUkZ13bBRHSoQSBpLASZvKgXZWWmp1q1iaqqV4hr3xRN9neYong8jHqxak2Y5vRYK8LaBY',
              },
            ],
          ],
        })
      );

      const response = await client.getBlock();

      expect(response.operations[3][0].contents[0].kind).toEqual('register_global_constant');
      const content = response.operations[3][0]
        .contents[0] as OperationContentsAndResultRegisterGlobalConstant;
      expect(content.source).toEqual('tz1TJGsZxvr6aBGUqfQVxufesTtA7QGi696D');
      expect(content.fee).toEqual('372');
      expect(content.counter).toEqual('7423375');
      expect(content.gas_limit).toEqual('1330');
      expect(content.storage_limit).toEqual('93');
      expect(content.value).toEqual({
        prim: 'Pair',
        args: [
          {
            int: '999',
          },
          {
            int: '999',
          },
        ],
      });
      expect(content.metadata.balance_updates![0].kind).toEqual('contract');
      expect(content.metadata.balance_updates![0].contract).toBeDefined();
      expect(content.metadata.balance_updates![0].contract).toEqual(
        'tz1TJGsZxvr6aBGUqfQVxufesTtA7QGi696D'
      );
      expect(content.metadata.balance_updates![0].change).toBeDefined();
      expect(content.metadata.balance_updates![0].change).toEqual('-372');
      expect(content.metadata.balance_updates![0].origin).toBeDefined();
      expect(content.metadata.balance_updates![0].origin).toEqual('block');
      expect(content.metadata.balance_updates![0].category).toBeUndefined();
      expect(content.metadata.balance_updates![0].delegate).toBeUndefined();
      expect(content.metadata.balance_updates![0].cycle).toBeUndefined();

      expect(content.metadata.operation_result.global_address).toBeDefined();
      expect(content.metadata.operation_result.status).toEqual('applied');
      expect(content.metadata.operation_result.balance_updates).toBeDefined();
      expect(content.metadata.operation_result.global_address).toEqual(
        'exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2'
      );
      expect(content.metadata.operation_result.consumed_gas).toBeDefined();
      expect(content.metadata.operation_result.storage_size).toBeDefined();
      expect(content.metadata.operation_result.errors).toBeUndefined();

      expect(content.metadata.internal_operation_results).toBeUndefined();
    });

    it('should use enum to represent property category in balance_updates, proto 12', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(blockIthacanetResponse));

      const response = await client.getBlock();

      // To avoid dealing with the space in the property name returned by the RPC
      expect(response.metadata.balance_updates![0].category).toBeDefined();
      expect(response.metadata.balance_updates![0].category).toEqual(
        METADATA_BALANCE_UPDATES_CATEGORY.BLOCK_FEES
      );
      expect(response.metadata.balance_updates![1].category).toBeDefined();
      expect(response.metadata.balance_updates![1].category).toEqual(
        METADATA_BALANCE_UPDATES_CATEGORY.BAKING_REWARDS
      );
      expect(response.metadata.balance_updates![3].category).toBeDefined();
      expect(response.metadata.balance_updates![3].category).toEqual(
        METADATA_BALANCE_UPDATES_CATEGORY.BAKING_BONUSES
      );
    });

    it('should fetch a block and access new properties in header, proto 12', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(blockIthacanetResponse));

      const response = await client.getBlock();

      expect(response.header.payload_hash).toBeDefined();
      expect(response.header.payload_hash).toEqual(
        'vh28CE8X2KKMvt5S4aGzPdMq5FpcfVRSoeyU3D3TUdVyk9zucR31'
      );
      expect(response.header.payload_round).toBeDefined();
      expect(response.header.payload_round).toEqual(0);
      expect(response.header.liquidity_baking_escape_vote).toBeDefined();
      expect(response.header.liquidity_baking_escape_vote).toBeFalsy();
    });

    it('should fetch a block and access new properties in metadata, proto 12', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(blockIthacanetResponse));

      const response = await client.getBlock();

      expect(response.metadata.proposer).toBeDefined();
      expect(response.metadata.proposer).toEqual('tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9');
      expect(response.metadata.balance_updates![0].category).toBeDefined();
    });

    it('should access new properties of the operation type endorsement, proto 12', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(blockIthacanetResponse));

      const response = await client.getBlock();

      expect(response.operations[0][0].contents[0].kind).toEqual(OpKind.ENDORSEMENT);
      const contentEndorsement = response.operations[0][0]
        .contents[0] as OperationContentsAndResultEndorsement;
      expect(contentEndorsement.slot).toBeDefined();
      expect(contentEndorsement.slot).toEqual(0);
      expect(contentEndorsement.round).toBeDefined();
      expect(contentEndorsement.round).toEqual(0);
      expect(contentEndorsement.block_payload_hash).toBeDefined();
      expect(contentEndorsement.block_payload_hash).toEqual(
        'vh2SkkaBZp19oyMUmTTXy5Q33hKKWZSAzXa7Tz2F6mtyeAgXsHC6'
      );

      expect(contentEndorsement.metadata.balance_updates).toEqual([]);
      expect(contentEndorsement.metadata.endorsement_power).toBeDefined();
      expect(contentEndorsement.metadata.endorsement_power).toEqual(206);
    });

    it('should access new properties of the operation type set_deposits_limit, proto 12', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(blockIthacanetResponse));

      const response = await client.getBlock();

      expect(response.operations[3][0].contents[0].kind).toEqual(OpKind.SET_DEPOSITS_LIMIT);
      const content = response.operations[3][0]
        .contents[0] as OperationContentsAndResultSetDepositsLimit;
      expect(content.source).toEqual('tz2FViF6XzJ4PqD5TTuaAtZScmiwpJBGBpSh');
      expect(content.fee).toEqual('1500');
      expect(content.counter).toEqual('146662');
      expect(content.gas_limit).toEqual('1000');
      expect(content.storage_limit).toEqual('10000');
      expect(content.limit).toBeDefined();
      expect(content.limit).toEqual('3');
      expect(content.metadata.balance_updates![0].kind).toEqual('contract');
      expect(content.metadata.balance_updates![0].contract).toBeDefined();
      expect(content.metadata.balance_updates![0].contract).toEqual(
        'tz2FViF6XzJ4PqD5TTuaAtZScmiwpJBGBpSh'
      );
      expect(content.metadata.balance_updates![0].change).toBeDefined();
      expect(content.metadata.balance_updates![0].change).toEqual('-1500');
      expect(content.metadata.balance_updates![0].origin).toBeDefined();
      expect(content.metadata.balance_updates![0].origin).toEqual('block');
      expect(content.metadata.balance_updates![0].category).toBeUndefined();
      expect(content.metadata.balance_updates![0].delegate).toBeUndefined();
      expect(content.metadata.balance_updates![0].cycle).toBeUndefined();

      expect(content.metadata.operation_result.status).toEqual('applied');
      expect(content.metadata.operation_result.consumed_gas).toBeDefined();
      expect(content.metadata.operation_result.consumed_gas).toEqual('1000');
      expect(content.metadata.operation_result.consumed_milligas).toBeDefined();
      expect(content.metadata.operation_result.consumed_milligas).toEqual('1000000');
    });

    it('should be able to access the properties of operation type transfer_ticket, proto14', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(blockWeeklynetResponse));
      const response = await client.getBlock();
      const content = response.operations[3][0]
        .contents[1] as OperationContentsAndResultTransferTicket;

      expect(content.kind).toEqual(OpKind.TRANSFER_TICKET);
      expect(content.source).toEqual('tz1TNiFHBzrJjVkXXzigJLxGaNrcgREe7Hwa');
      expect(content.fee).toEqual('708');
      expect(content.counter).toEqual('1826');
      expect(content.gas_limit).toEqual('5009');
      expect(content.storage_limit).toEqual('130');
      expect(content.ticket_amount).toEqual('2');
      expect(content.destination).toEqual('KT1BnDCAv62hqTQ3kDnMxWGKVpEgdQgX3TPm');
      expect(content.entrypoint).toEqual('default');
      expect(content.ticket_contents).toEqual({ string: 'foobar' });
      expect(content.ticket_ty).toEqual({ prim: 'string' });
      expect(content.ticket_ticketer).toEqual('KT1P57aaa5RgxqMdgoUoerWg8HVwXjbP2vxS');

      expect(content.metadata.balance_updates).toBeDefined();

      expect(content.metadata.balance_updates![0].kind).toEqual('contract');
      expect(content.metadata.balance_updates![0].contract).toEqual(
        'tz1TNiFHBzrJjVkXXzigJLxGaNrcgREe7Hwa'
      );
      expect(content.metadata.balance_updates![0].change).toEqual('-708');
      expect(content.metadata.balance_updates![0].origin).toEqual('block');
      expect(content.metadata.balance_updates![1].kind).toEqual('accumulator');
      expect(content.metadata.balance_updates![1].category).toEqual('block fees');
      expect(content.metadata.balance_updates![1].change).toEqual('708');
      expect(content.metadata.balance_updates![1].origin).toEqual('block');

      expect(content.metadata.operation_result.status).toEqual('applied');
      expect(content.metadata.operation_result.balance_updates).toBeDefined();
      expect(content.metadata.operation_result.consumed_milligas).toEqual('2122881');
      expect(content.metadata.operation_result.paid_storage_size_diff).toEqual('66');
    });

    it('should be able to access the properties of operation type increase_paid_storage, proto14', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(blockKathmandunetResponse));

      const response = await client.getBlock();
      const content = response.operations[3][0]
        .contents[0] as OperationContentsAndResultIncreasePaidStorage;

      expect(content.kind).toEqual(OpKind.INCREASE_PAID_STORAGE);
      expect(content.source).toEqual('tz2RVendfy3AQGEBwrhXF4kwyRiJUpa7qLnG');
      expect(content.fee).toEqual('349');
      expect(content.counter).toEqual('108123');
      expect(content.gas_limit).toEqual('1000');
      expect(content.storage_limit).toEqual('0');
      expect(content.amount).toEqual('2');
      expect(content.destination).toEqual('KT1Vjr5PFC2Qm5XbSQZ8MdFZLgYMzwG5WZNh');

      expect(content.metadata.balance_updates).toBeDefined();

      expect(content.metadata.balance_updates![0].kind).toEqual('contract');
      expect(content.metadata.balance_updates![0].contract).toEqual(
        'tz2RVendfy3AQGEBwrhXF4kwyRiJUpa7qLnG'
      );
      expect(content.metadata.balance_updates![0].change).toEqual('-349');
      expect(content.metadata.balance_updates![1].origin).toEqual('block');

      expect(content.metadata.balance_updates![1].kind).toEqual('accumulator');
      expect(content.metadata.balance_updates![1].category).toEqual('block fees');
      expect(content.metadata.balance_updates![1].change).toEqual('349');
      expect(content.metadata.balance_updates![1].origin).toEqual('block');

      expect(content.metadata.operation_result.status).toEqual('applied');
      expect(content.metadata.operation_result.balance_updates).toBeDefined();
      expect(content.metadata.operation_result.consumed_milligas).toEqual('1000000');
    });

    it('should be able to access the properties of internal operation type event, proto14', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(blockKathmandunetResponse));

      const response = await client.getBlock();
      const content = response.operations[3][1]
        .contents[0] as OperationContentsAndResultTransaction;

      expect(content.metadata.internal_operation_results).toBeDefined();
      expect(content.metadata.internal_operation_results![0].kind).toEqual(OpKind.EVENT);
      expect(content.metadata.internal_operation_results![0].source).toEqual(
        'KT1D7mKRckD2ZoWGcGtUvBpDxb48WxpnLu1Q'
      );
      expect(content.metadata.internal_operation_results![0].nonce).toEqual(0);

      expect(content.metadata.internal_operation_results![0].amount).toBeUndefined();
      expect(content.metadata.internal_operation_results![0].destination).toBeUndefined();
      expect(content.metadata.internal_operation_results![0].parameters).toBeUndefined();
      expect(content.metadata.internal_operation_results![0].public_key).toBeUndefined();
      expect(content.metadata.internal_operation_results![0].balance).toBeUndefined();
      expect(content.metadata.internal_operation_results![0].delegate).toBeUndefined();
      expect(content.metadata.internal_operation_results![0].value).toBeUndefined();
      expect(content.metadata.internal_operation_results![0].limit).toBeUndefined();
      expect(content.metadata.internal_operation_results![0].script).toBeUndefined();

      expect(content.metadata.internal_operation_results![0].type).toBeDefined();
      expect(content.metadata.internal_operation_results![0].type).toEqual({
        prim: 'or',
        args: [{ prim: 'nat' }, { prim: 'string' }],
      });
      expect(content.metadata.internal_operation_results![0].tag).toBeDefined();
      expect(content.metadata.internal_operation_results![0].tag).toEqual('event');
      expect(content.metadata.internal_operation_results![0].payload).toBeDefined();
      expect(content.metadata.internal_operation_results![0].payload).toEqual({
        prim: 'Left',
        args: [{ int: '10' }],
      });
      expect(content.metadata.internal_operation_results![0].result).toBeDefined();

      const internalResult = content.metadata.internal_operation_results![0]
        .result as OperationResultEvent;
      expect(internalResult.status).toEqual('applied');
      expect(internalResult.consumed_milligas).toBeDefined();
      expect(internalResult.consumed_milligas).toEqual('1000000');
      expect(internalResult.errors).toBeUndefined();
    });

    it('should be able to access the properties of operation type drain_delegate, proto15', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(blockLimanetResponse));

      const response = await client.getBlock();
      const content = response.operations[3][0]
        .contents[1] as OperationContentsAndResultDrainDelegate;

      expect(content.kind).toEqual(OpKind.DRAIN_DELEGATE);
      expect(content.consensus_key).toEqual('tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj');
      expect(content.delegate).toEqual('tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv');
      expect(content.destination).toEqual('tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj');

      expect(content.metadata.balance_updates).toBeDefined();

      expect(content.metadata.balance_updates![0].kind).toEqual('contract');
      expect(content.metadata.balance_updates![0].contract).toEqual(
        'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv'
      );
      expect(content.metadata.balance_updates![0].change).toEqual('-15525772494');
      expect(content.metadata.balance_updates![0].origin).toEqual('block');

      expect(content.metadata.balance_updates![1].kind).toEqual('contract');
      expect(content.metadata.balance_updates![1].contract).toEqual(
        'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj'
      );
      expect(content.metadata.balance_updates![1].change).toEqual('15525772494');
      expect(content.metadata.balance_updates![1].origin).toEqual('block');

      expect(content.metadata.balance_updates![2].kind).toEqual('contract');
      expect(content.metadata.balance_updates![2].contract).toEqual(
        'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv'
      );
      expect(content.metadata.balance_updates![2].change).toEqual('-156825984');
      expect(content.metadata.balance_updates![2].origin).toEqual('block');

      expect(content.metadata.balance_updates![3].kind).toEqual('contract');
      expect(content.metadata.balance_updates![3].contract).toEqual(
        'tz1hoyMUiJYYr4FRPMU8Z7WJzYkqgjygjaTy'
      );
      expect(content.metadata.balance_updates![3].change).toEqual('156825984');
      expect(content.metadata.balance_updates![3].origin).toEqual('block');
    });

    it('should be able to access the properties of operation type update_consensus_key, proto15', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(blockLimanetResponse));

      const response = await client.getBlock();
      const content = response.operations[3][0]
        .contents[0] as OperationContentsAndResultUpdateConsensusKey;

      expect(content.kind).toEqual(OpKind.UPDATE_CONSENSUS_KEY);
      expect(content.source).toEqual('tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv');
      expect(content.fee).toEqual('369');
      expect(content.counter).toEqual('19043');
      expect(content.gas_limit).toEqual('1100');
      expect(content.storage_limit).toEqual('0');
      expect(content.pk).toEqual('edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7');

      expect(content.metadata.balance_updates).toBeDefined();

      expect(content.metadata.balance_updates![0].kind).toEqual('contract');
      expect(content.metadata.balance_updates![0].contract).toEqual(
        'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv'
      );
      expect(content.metadata.balance_updates![0].change).toEqual('-369');
      expect(content.metadata.balance_updates![0].origin).toEqual('block');

      expect(content.metadata.balance_updates![1].kind).toEqual('accumulator');
      expect(content.metadata.balance_updates![1].category).toEqual('block fees');
      expect(content.metadata.balance_updates![1].change).toEqual('369');
      expect(content.metadata.balance_updates![1].origin).toEqual('block');

      expect(content.metadata.operation_result.status).toEqual('applied');
      expect(content.metadata.operation_result.consumed_milligas).toEqual('1000000');
    });
    it('should contain ticket_updates for transactions updating ticket storage', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(ticketUpdatesResponse));

      const response = await client.getBlock();
      const content = response.operations[0][0]
        .contents[0] as OperationContentsAndResultTransaction;
      const ticketUpdates =
        content.metadata.operation_result.ticket_updates &&
        content.metadata.operation_result.ticket_updates[0];

      expect(ticketUpdates).toBeDefined();
      expect(ticketUpdates?.ticket_token.ticketer).toEqual('KT1JGcC8DuWHcShu6XvtfgKVnV2zcYsZ4TVH');
      expect(ticketUpdates?.updates[0].account).toEqual('KT1JoRgUcR6NApwMLnBZ2pehCzp8tR4HtkHj');
      expect(ticketUpdates?.updates[0].amount).toEqual('-2');
    });
    // may be removed
    it('should contain ticket_receipt for transactions updating ticket storage', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(ticketUpdatesResponse));

      const response = await client.getBlock();
      const content = response.operations[0][0]
        .contents[0] as OperationContentsAndResultTransaction;
      const internalContent =
        content.metadata.internal_operation_results &&
        (content.metadata.internal_operation_results[0].result as OperationResultTransaction);
      const ticketReceipt = internalContent?.ticket_receipt && internalContent.ticket_receipt[0];

      expect(ticketReceipt).toBeDefined();
      expect(ticketReceipt?.ticket_token.ticketer).toEqual('KT1JGcC8DuWHcShu6XvtfgKVnV2zcYsZ4TVH');
      expect(ticketReceipt?.updates[0].account).toEqual('KT1JoRgUcR6NApwMLnBZ2pehCzp8tR4HtkHj');
      expect(ticketReceipt?.updates[0].amount).toEqual('1');
    });

    it('should query the right url and property for operation, proto 20, attestation_with_dal', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          protocol: 'PsParisCZo7KAh1Z1smVd9ZMZ1HHn5gkzbM94V3PLCpknFWhUAi',
          chain_id: 'NetXo8SqH1c38SS',
          hash: 'BKsCfYZrh417adJiKbGsyhVG2XrvUBJDhhkCAkZQzWzkEHCejXr',
          header: {
            level: 416914,
            proto: 2,
            predecessor: 'BLBXzegi3m1K8YjP7w9YgEpts5a9ZCFjY7xqRcm16p6yFxXbZGT',
            timestamp: '2024-05-06T18:01:07Z',
            validation_pass: 4,
            operations_hash: 'LLoZxmgEJQyZ74XCrZQu8Jtcov4SnGGRyuYf32fYmURW2Xfcj58Gv',
            fitness: ['02', '00065c92', '', 'ffffffff', '00000000'],
            context: 'CoV1GGrMBca5uBG4AzQbKNrQhQHHTtSYJAHVk7pJtuMw3uWiNvTV',
            payload_hash: 'vh1mfavAuf7E1m1tZUEHkWomS8BDiLsVZz9T1A79Afu8Cag5DQHG',
            payload_round: 0,
            proof_of_work_nonce: 'e38cf66600000000',
            liquidity_baking_toggle_vote: 'on',
            adaptive_issuance_vote: 'on',
            signature:
              'sighpgD4aPxorZUvPxKvBHYNvnQEBRctF14bYXFX9qLbXbCGZv64S1dFVduBLzWBSEXCcHWiBuUT1iLZt9SE2mKCTkLtWuo5',
          },
          metadata: {},
          operations: [
            [
              {
                protocol: 'PsParisCZo7KAh1Z1smVd9ZMZ1HHn5gkzbM94V3PLCpknFWhUAi',
                chain_id: 'NetXo8SqH1c38SS',
                hash: 'opSmHyeasw4QcJ4Jc2qi6arNeSQMhFRjHBdFYWXGoMydLkgVRtb',
                branch: 'BLHyjaqV2FhuHLQL3CBjWJqgZZ77BxcNxh3ehXcNYMQjjqAPwqA',
                contents: [
                  {
                    kind: 'attestation_with_dal',
                    slot: 19,
                    level: 416913,
                    round: 0,
                    block_payload_hash: 'vh27AvfjAJob9VdcZHEPHFbMAzi6nhCiHVzAyDBEdAPDCcEa676t',
                    dal_attestation: '0',
                    metadata: {
                      delegate: 'tz1Zt8QQ9aBznYNk5LUBjtME9DuExomw9YRs',
                      consensus_power: 532,
                      consensus_key: 'tz1Zt8QQ9aBznYNk5LUBjtME9DuExomw9YRs',
                    },
                  },
                ],
                signature:
                  'sigh9rmktxbqmK6fXaq2ciAQrbrVH8pZhKeXEKHCzgNmJaP6gc1njofiMMzvhx2SRXQ7Gv8aVDzBM18kDGmUoBxQA693Bk2o',
              },
            ],
          ],
        })
      );

      const response = await client.getBlock();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head',
      });
      const AttestationWithDal = response.operations[0][0]
        .contents[0] as OperationContentsAndResultAttestationWithDal;
      expect(AttestationWithDal.kind).toEqual('attestation_with_dal');
      expect(AttestationWithDal.slot).toEqual(19);
      expect(AttestationWithDal.dal_attestation).toEqual('0');
    });

    it('should query the right url and property for operation, proto 20, dal_publish_commitment', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          protocol: 'PsParisCZo7KAh1Z1smVd9ZMZ1HHn5gkzbM94V3PLCpknFWhUAi',
          chain_id: 'NetXo8SqH1c38SS',
          hash: 'BKsCfYZrh417adJiKbGsyhVG2XrvUBJDhhkCAkZQzWzkEHCejXr',
          header: {
            level: 416914,
            proto: 2,
            predecessor: 'BLBXzegi3m1K8YjP7w9YgEpts5a9ZCFjY7xqRcm16p6yFxXbZGT',
            timestamp: '2024-05-06T18:01:07Z',
            validation_pass: 4,
            operations_hash: 'LLoZxmgEJQyZ74XCrZQu8Jtcov4SnGGRyuYf32fYmURW2Xfcj58Gv',
            fitness: ['02', '00065c92', '', 'ffffffff', '00000000'],
            context: 'CoV1GGrMBca5uBG4AzQbKNrQhQHHTtSYJAHVk7pJtuMw3uWiNvTV',
            payload_hash: 'vh1mfavAuf7E1m1tZUEHkWomS8BDiLsVZz9T1A79Afu8Cag5DQHG',
            payload_round: 0,
            proof_of_work_nonce: 'e38cf66600000000',
            liquidity_baking_toggle_vote: 'on',
            adaptive_issuance_vote: 'on',
            signature:
              'sighpgD4aPxorZUvPxKvBHYNvnQEBRctF14bYXFX9qLbXbCGZv64S1dFVduBLzWBSEXCcHWiBuUT1iLZt9SE2mKCTkLtWuo5',
          },
          metadata: {},
          operations: [
            [
              {
                protocol: 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
                chain_id: 'NetXycmjU7QxoVf',
                hash: 'onhU8VcKQ7Jfh2wE2ABJMq4MHN2x9262WVeSXV6SVzpZjZcqSj8',
                branch: 'BMT5yA3UH3CJkaYJBq33Q1BNZU6NL4zZNBhCHKwxygSm59P1x9M',
                contents: [
                  {
                    kind: 'dal_publish_commitment',
                    source: 'tz1Mp9zrMAJ3jckh3juLXGobfDv6oyUycfSy',
                    fee: '513',
                    counter: '67',
                    gas_limit: '1433',
                    storage_limit: '0',
                    slot_header: {
                      slot_index: 0,
                      commitment:
                        'sh1vHbHrPSt7eWqYJmM9EUk5scjbvR5PKBckJxmmDJzYHHBkca8Lz4hxXX6zpW5wbhJhswJd4v',
                      commitment_proof:
                        '90c6576ad09e11b14eb464cdd214fe061ba8e8e5a3175e29fe7ff40526f90c2f2f4e02fe9fe03f7adb0fe286d7828b970eb1979f0f65ca3637a51d5456b442377d20397eb1b02544c2e435d79e156881443179fe16b32ad9e9501622a647c2ce',
                    },
                    metadata: {
                      balance_updates: [
                        {
                          kind: 'contract',
                          contract: 'tz1Mp9zrMAJ3jckh3juLXGobfDv6oyUycfSy',
                          change: '-513',
                          origin: 'block',
                        },
                        {
                          kind: 'accumulator',
                          category: 'block fees',
                          change: '513',
                          origin: 'block',
                        },
                      ],
                      operation_result: {
                        status: 'applied',
                        slot_header: {
                          version: '0',
                          level: 117424,
                          index: 0,
                          commitment:
                            'sh1vHbHrPSt7eWqYJmM9EUk5scjbvR5PKBckJxmmDJzYHHBkca8Lz4hxXX6zpW5wbhJhswJd4v',
                        },
                        consumed_milligas: '1332590',
                      },
                    },
                  },
                ],
                signature:
                  'sigwNUDa4HvpGMwpNEuqha91o9vgQzE4AkHZvLiYybRv1137jtorpHr1RZrhw5K167Z4e5UkbPHUsBMTq3KFyPkA1N6ZQnZD',
              },
            ],
          ],
        })
      );

      const response = await client.getBlock();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head',
      });
      const dalPublishCommitment = response.operations[0][0]
        .contents[0] as OperationContentsAndResultDalPublishCommitment;
      expect(dalPublishCommitment.kind).toEqual('dal_publish_commitment');
      expect(dalPublishCommitment.slot_header.slot_index).toEqual(0);
      expect(dalPublishCommitment.slot_header.commitment).toEqual(
        'sh1vHbHrPSt7eWqYJmM9EUk5scjbvR5PKBckJxmmDJzYHHBkca8Lz4hxXX6zpW5wbhJhswJd4v'
      );
      expect(dalPublishCommitment.slot_header.commitment_proof).toEqual(
        '90c6576ad09e11b14eb464cdd214fe061ba8e8e5a3175e29fe7ff40526f90c2f2f4e02fe9fe03f7adb0fe286d7828b970eb1979f0f65ca3637a51d5456b442377d20397eb1b02544c2e435d79e156881443179fe16b32ad9e9501622a647c2ce'
      );
    });
  });

  describe('getBakingRights', () => {
    it('query the right url and data', async () => {
      httpBackend.createRequest.mockResolvedValue([
        {
          level: 547387,
          delegate: 'tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN',
          priority: 4,
          estimated_time: '2019-08-02T09:48:56Z',
          consensus_key: 'tz1asyQFDgjv2muoaiZ5x5U5RPpaNz33Z2F6',
        },
        {
          level: 547387,
          delegate: 'tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e',
          priority: 8,
          estimated_time: '2019-08-02T09:53:56Z',
          consensus_key: 'tz1N4GvBKsfdBdtgbNeQQLv52L7YB4FBZtVf',
        },
      ]);
      const result = await client.getBakingRights({
        delegate: ['tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN', 'tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e'],
      });

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        query: {
          delegate: [
            'tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN',
            'tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e',
          ],
        },
        url: 'root/chains/test/blocks/head/helpers/baking_rights',
      });

      expect(result[0].delegate).toEqual('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN');
      expect(result[0].estimated_time).toEqual('2019-08-02T09:48:56Z');
      expect(result[0].consensus_key).toEqual('tz1asyQFDgjv2muoaiZ5x5U5RPpaNz33Z2F6');
    });
  });

  describe('getBallotList', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve([
          {
            pkh: 'tz3e75hU4EhDU3ukyJueh5v6UvEHzGwkg3yC',
            ballot: 'yay',
          },
          {
            pkh: 'tz1iJ4qgGTzyhaYEzd1RnC6duEkLBd1nzexh',
            ballot: 'yay',
          },
          {
            pkh: 'tz1hx8hMmmeyDBi6WJgpKwK4n5S2qAEpavx2',
            ballot: 'yay',
          },
          {
            pkh: 'tz1gvrUnfTfEcRW6qcgB6FJdZnAxv4HG1rj9',
            ballot: 'yay',
          },
          {
            pkh: 'tz1go7f6mEQfT2xX2LuHAqgnRGN6c2zHPf5c',
            ballot: 'yay',
          },
          {
            pkh: 'tz1gCx1V63bSaQnPZoQreqNgVLuFMzyMcqry',
            ballot: 'yay',
          },
        ])
      );
      const response = await client.getBallotList();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/ballot_list',
      });
      expect(response[2].pkh).toEqual('tz1hx8hMmmeyDBi6WJgpKwK4n5S2qAEpavx2');
    });
  });

  describe('getBallots', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve({ yay: 5943, nay: 0, pass: 0 }));
      const response = await client.getBallots();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/ballots',
      });
      expect(response.yay).toEqual(new BigNumber(5943));
    });
  });

  describe('getCurrentProposal', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve('PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU')
      );
      const response = await client.getCurrentProposal();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/current_proposal',
      });
      expect(response).toEqual('PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU');
    });
  });

  describe('getCurrentQuorum', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(7291));
      const response = await client.getCurrentQuorum();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/current_quorum',
      });
      expect(response).toEqual(7291);
    });
  });

  describe('getVotesListings', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve([
          {
            pkh: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m',
            voting_power: 3726,
          },
          {
            pkh: 'tz2Q7Km98GPzV1JLNpkrQrSo5YUhPfDp6LmA',
            rolls: 2,
          },
          {
            pkh: 'tz2PdGc7U5tiyqPgTSgqCDct94qd6ovQwP6u',
            rolls: 73,
          },
          {
            pkh: 'tz2KrmHRWu7b7Vr3GYQ3SJ41xaW64PiqWBYm',
            rolls: 17,
          },
          {
            pkh: 'tz2JMPu9yVKuX2Au8UUbp7YrKBZJSdYhgwwu',
            rolls: 2,
          },
          {
            pkh: 'tz2FCNBrERXtaTtNX6iimR1UJ5JSDxvdHM93',
            rolls: 233,
          },
          {
            pkh: 'tz2E3BvcMiGvFEgNVdsAiwVvPHcwJDTA8wLt',
            rolls: 14,
          },
          {
            pkh: 'tz3eQFJL9Pw7EXkuEVSYTVtuwtfjhUU3xqi1',
            rolls: 1,
          },
          {
            pkh: 'tz3e7LbZvUtoXhpUD1yb6wuFodZpfYRb9nWJ',
            rolls: 25,
          },
          {
            pkh: 'tz3e75hU4EhDU3ukyJueh5v6UvEHzGwkg3yC',
            rolls: 334,
          },
        ])
      );
      const response = await client.getVotesListings();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/listings',
      });
      expect(response[0].voting_power).toEqual(new BigNumber(3726));
      expect(response[0].rolls).toBeUndefined();
      expect(response[4].pkh).toEqual('tz2JMPu9yVKuX2Au8UUbp7YrKBZJSdYhgwwu');
      expect(response[4].voting_power).toBeUndefined();
    });
  });

  describe('getProposals', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve([
          ['PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU', 2832],
          ['PsBABY5nk4JhdEv1N1pZbt6m6ccB9BfNqa23iKZcHBh23jmRS9f', 9492],
        ])
      );
      const response = await client.getProposals();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/proposals',
      });
      expect(response[0][1]).toEqual(new BigNumber(2832));
    });
  });

  describe('getEntrypoints', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockReturnValue({ entrypoints: {} });
      const response = await client.getEntrypoints(contractAddress);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/entrypoints`,
      });
      expect(response).toEqual({ entrypoints: {} });
    });
  });

  describe('runOperation', () => {
    it('should query the right url and data', async () => {
      const testData = {};

      httpBackend.createRequest.mockResolvedValue({ content: {} });
      await client.runOperation(testData as any);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/scripts/run_operation',
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual(testData);
    });

    it('should use enum for property category to avoid space in name', async () => {
      const testData = {};

      httpBackend.createRequest.mockResolvedValue({
        contents: [
          {
            metadata: {
              balance_updates: [
                {
                  kind: 'minted',
                  category: 'baking bonuses',
                  change: '-266662',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  staker: {
                    baker: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                  },
                  change: '266662',
                  origin: 'block',
                },
              ],
            },
          },
        ],
      });
      const response = await client.runOperation(testData as RPCRunOperationParam);

      const balanceUpdate =
        'metadata' in response.contents[0]
          ? (response.contents[0]['metadata'][
              'balance_updates'
            ] as OperationMetadataBalanceUpdates[])
          : [];
      expect(balanceUpdate![0]['category']).toEqual(
        METADATA_BALANCE_UPDATES_CATEGORY.BAKING_BONUSES
      );
      expect(balanceUpdate![1]['category']).toEqual(METADATA_BALANCE_UPDATES_CATEGORY.DEPOSITS);
    });
  });

  describe('simulateOperation', () => {
    it('should query the right url and data', async () => {
      const testData = {};

      httpBackend.createRequest.mockResolvedValue({ content: {} });
      await client.simulateOperation(testData as any);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/scripts/simulate_operation',
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual(testData);
    });

    it('should use enum for property category to avoid space in name', async () => {
      const testData = {};

      httpBackend.createRequest.mockResolvedValue({
        contents: [
          {
            metadata: {
              balance_updates: [
                {
                  kind: 'minted',
                  category: 'baking rewards',
                  change: '-266667',
                  origin: 'block',
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  staker: {
                    baker: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                  },
                  change: '266667',
                  origin: 'block',
                },
              ],
            },
          },
        ],
      });
      const response = await client.simulateOperation(testData as RPCSimulateOperationParam);

      const balanceUpdate =
        'metadata' in response.contents[0]
          ? (response.contents[0]['metadata'][
              'balance_updates'
            ] as OperationMetadataBalanceUpdates[])
          : [];
      expect(balanceUpdate![0]['category']).toEqual(
        METADATA_BALANCE_UPDATES_CATEGORY.BAKING_REWARDS
      );
      expect(balanceUpdate![1]['category']).toEqual(METADATA_BALANCE_UPDATES_CATEGORY.DEPOSITS);
    });
  });

  describe('runScriptView', () => {
    it('query the right url and data', async () => {
      const testData: RPCRunScriptViewParam = {
        contract: 'test',
        view: 'test',
        chain_id: 'test',
        input: {
          int: '0',
        },
      };

      await client.runScriptView(testData);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/scripts/run_script_view',
      });
      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({
        ...testData,
        unparsing_mode: 'Readable',
      });
    });

    it('query the right url and data with unparsing_mode overwritten', async () => {
      const testData: RPCRunScriptViewParam = {
        contract: 'test',
        view: 'test',
        chain_id: 'test',
        input: {
          int: '0',
        },
        unparsing_mode: 'Optimized',
      };

      await client.runScriptView(testData);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/scripts/run_script_view',
      });
      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual(testData);
    });
  });

  describe('runView', () => {
    it('should query the right url and data', async () => {
      const testData: RPCRunViewParam = {
        contract: 'test',
        entrypoint: 'test',
        chain_id: 'test',
        input: {
          string: 'test',
        },
      };

      await client.runView(testData);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/scripts/run_view',
      });
      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({
        contract: 'test',
        entrypoint: 'test',
        chain_id: 'test',
        input: {
          string: 'test',
        },
        unparsing_mode: 'Readable',
      });
    });

    it('should query the right url and data with unparsing_mode overwritten', async () => {
      const testData: RPCRunViewParam = {
        contract: 'test',
        entrypoint: 'test',
        chain_id: 'test',
        input: {
          string: 'test',
        },
        unparsing_mode: 'Optimized',
      };

      await client.runView(testData);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/scripts/run_view',
      });
      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual(testData);
    });
  });

  describe('packData', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockResolvedValue({ packed: 'cafe', gas: 'unaccounted' });
      const response = await client.packData({
        data: { string: 'test' },
        type: { prim: 'string' },
      });

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/scripts/pack_data',
      });
      expect(response).toEqual({ packed: 'cafe', gas: 'unaccounted' });
    });

    it('should return a big number for gas when it is a big number', async () => {
      httpBackend.createRequest.mockResolvedValue({ packed: 'cafe', gas: '2' });
      const response = await client.packData({
        data: { string: 'test' },
        type: { prim: 'string' },
      });
      expect(response).toEqual({ packed: 'cafe', gas: new BigNumber(2) });
      expect(response.gas).toBeInstanceOf(BigNumber);
    });

    it('should return undefined for gas when it is missing', async () => {
      httpBackend.createRequest.mockResolvedValue({ packed: 'cafe' });
      const response = await client.packData({
        data: { string: 'test' },
        type: { prim: 'string' },
      });
      expect(response).toEqual({ packed: 'cafe' });
      expect(response.gas).toBeUndefined();
    });
  });

  describe('getBigMapExpr', () => {
    it('should query the right url and data', async () => {
      await client.getBigMapExpr('1', '2');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/big_maps/1/2',
      });
    });
  });

  describe('getRpcUrl', () => {
    it('should return the RPC Url', () => {
      const url = 'https://mainnet.tezos.ecadinfra.com/';
      const rpcUrlMainnet = new RpcClient(url).getRpcUrl();
      expect(rpcUrlMainnet).toEqual('https://mainnet.tezos.ecadinfra.com/');
      const rpcUrlCarthagenet = new RpcClient('https://ghostnet.tezos.ecadinfra.com').getRpcUrl();
      expect(rpcUrlCarthagenet).toEqual('https://ghostnet.tezos.ecadinfra.com');
    });
  });

  describe('getCurrentPeriod', () => {
    it('should query the right url and data', async () => {
      const mockedResponse = {
        voting_period: {
          index: 87,
          kind: 'proposal',
          start_position: 89088,
        },
        position: 902,
        remaining: 121,
      };

      httpBackend.createRequest.mockReturnValue(Promise.resolve(mockedResponse));
      const response = await client.getCurrentPeriod();
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/current_period',
      });
      expect(response).toEqual(mockedResponse);
    });
  });

  describe('getSuccessorPeriod', () => {
    it('should query the right url and data', async () => {
      const mockedResponse = {
        voting_period: {
          index: 87,
          kind: 'proposal',
          start_position: 89088,
        },
        position: 902,
        remaining: 121,
      };

      httpBackend.createRequest.mockReturnValue(Promise.resolve(mockedResponse));
      const response = await client.getSuccessorPeriod();
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/successor_period',
      });
      expect(response).toEqual(mockedResponse);
    });
  });

  describe('getSaplingDiffById', () => {
    it('should query the right url', async () => {
      httpBackend.createRequest.mockResolvedValue({
        root: 'fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e',
        commitments_and_ciphertexts: [],
        nullifiers: [],
      });
      const response = await client.getSaplingDiffById('123');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/sapling/123/get_diff',
      });

      expect(response.root).toEqual(
        'fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e'
      );
      expect(response.commitments_and_ciphertexts).toEqual([]);
      expect(response.nullifiers).toEqual([]);
    });
  });

  describe('getSaplingDiffByContract', () => {
    it('should query the right url', async () => {
      httpBackend.createRequest.mockResolvedValue({
        root: 'fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e',
        commitments_and_ciphertexts: [],
        nullifiers: [],
      });
      const response = await client.getSaplingDiffByContract(
        'KT18tv2siXNxfc3FkCoS4esPuLqvaYrcGV92'
      );

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/KT18tv2siXNxfc3FkCoS4esPuLqvaYrcGV92/single_sapling_get_diff',
      });

      expect(response.root).toEqual(
        'fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e'
      );
      expect(response.commitments_and_ciphertexts).toEqual([]);
      expect(response.nullifiers).toEqual([]);
    });
  });

  describe('getProtocols', () => {
    it('should query the right url and return a ProtocolsResponse', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
          next_protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
        })
      );
      const protocols = await client.getProtocols();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/protocols`,
      });
      expect(protocols.next_protocol).toEqual(
        'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx'
      );
      expect(protocols.protocol).toEqual('PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx');
    });
  });

  describe('getProtocolActivations', () => {
    it('should query the right url and return a list of ProtocolActivations', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(protocolActivations));
      const response = await client.getProtocolActivations();
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/protocols/`,
      });
      expect(response).toEqual(protocolActivations);
    });
    it('should query the right url and return a ProtocolActivation', async () => {
      const protocol = 'PsRiotumaAMotcRoDWW1bysEhQy2n1M5fy8JgRp8jjRfHGmfeA7';
      httpBackend.createRequest.mockReturnValue(Promise.resolve(protocolActivation));
      const response = await client.getProtocolActivations(protocol);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/protocols/${protocol}`,
      });
      expect(response).toEqual(protocolActivation);
    });
  });

  describe('smartRollupOriginate', () => {
    it('should have correct types to access smart_rollup_originate results', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(smartRollupOriginateResponse));
      const response = await client.getBlock();
      const content = response.operations[1][0]
        .contents[0] as OperationContentsAndResultSmartRollupOriginate;

      expect(content.kind).toEqual(OpKind.SMART_ROLLUP_ORIGINATE);
      expect(content.source).toEqual('tz1NyHPL2CidRquW3a9zPGde59YYtMDyyzCg');
      expect(content.fee).toEqual('1497');
      expect(content.counter).toEqual('19783');
      expect(content.gas_limit).toEqual('2849');
      expect(content.storage_limit).toEqual('6572');
      expect(content.pvm_kind).toEqual('wasm_2_0_0');
      expect(content.kernel).toEqual(
        '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a'
      );
      expect(content.parameters_ty).toEqual({ prim: 'bytes' });

      const soruResult = content.metadata.operation_result;

      expect(soruResult.status).toEqual('applied');
      expect(soruResult.address).toEqual('sr1K3AUoYanTUup53MCb8DkbvLsiAmFuXfFm');
      expect(soruResult.genesis_commitment_hash).toEqual(
        'src14Khe1dnFbwrtTSEi4XWxxM7ej7L29YmduJhQY7U24Y523dmMtw'
      );
      expect(soruResult.consumed_milligas).toEqual('2748269');
      expect(soruResult.size).toEqual('6552');
    });
  });

  describe('smartRollupAddMessages', () => {
    it('should have correct types to access smart_rollup_add_messages results', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(smartRollupAddMessagesResponse));
      const response = await client.getBlock();
      const content = response.operations[1][0]
        .contents[0] as OperationContentsAndResultSmartRollupAddMessages;

      expect(content.kind).toEqual(OpKind.SMART_ROLLUP_ADD_MESSAGES);
      expect(content.source).toEqual('tz2Q3yRaczTqZVf3ZQvwiiTqKjhJFyDzeRSz');
      expect(content.fee).toEqual('398');
      expect(content.counter).toEqual('12191');
      expect(content.gas_limit).toEqual('1103');
      expect(content.storage_limit).toEqual('0');
      expect(content.message[0]).toEqual(
        '0000000031010000000b48656c6c6f20776f726c6401cc9e352a850d7475bf9b6cf103aa17ca404bc9dd000000000764656661756c74'
      );

      const soruResult = content.metadata.operation_result;

      expect(soruResult.status).toEqual('applied');
      expect(soruResult.consumed_milligas).toEqual('1002777');
    });
  });

  describe('smartRollupOutboxMessages', () => {
    it('should have correct types to access smart_rollup_execute_outbox_message results', async () => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve(smartRollupExecuteOutboxMessageResponse)
      );
      const response = await client.getBlock();
      const content = response.operations[1][0]
        .contents[0] as OperationContentsAndResultSmartRollupExecuteOutboxMessage;

      expect(content.kind).toEqual(OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE);
      expect(content.source).toEqual('tz1adKm6kWEkiejZ9WYpuHvBCgUewtCxpqRF');
      expect(content.fee).toEqual('1618');
      expect(content.counter).toEqual('13');
      expect(content.gas_limit).toEqual('6485');
      expect(content.storage_limit).toEqual('36');
      expect(content.rollup).toEqual('sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy');
      expect(content.cemented_commitment).toEqual(
        'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628'
      );
      expect(content.output_proof).toEqual(
        '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
      );

      const soruResult = content.metadata.operation_result;

      expect(soruResult.status).toEqual('applied');
      expect(soruResult.consumed_milligas).toEqual('4731015');
      expect(soruResult.ticket_updates).toEqual([]);
      expect(soruResult.paid_storage_size_diff).toEqual('5');
    });
  });

  describe('smartRollupPublish', () => {
    it('should have correct types to access smart_rollup_publish results', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(smartRollupPublishResponse));
      const response = await client.getBlock();
      const content = response.operations[0][0]
        .contents[0] as OperationContentsAndResultSmartRollupPublish;

      expect(content.kind).toEqual(OpKind.SMART_ROLLUP_PUBLISH);
      expect(content.source).toEqual('tz1gCe1sFpppbGGVwCt5jLRqDS9FD1W4Qca4');
      expect(content.fee).toEqual('964');
      expect(content.counter).toEqual('41266');
      expect(content.gas_limit).toEqual('6418');
      expect(content.storage_limit).toEqual('0');
      expect(content.rollup).toEqual('sr1AE6U3GNzE8iKzj6sKS5wh1U32ogeULCoN');

      const commitment = content.commitment;
      expect(commitment.compressed_state).toEqual(
        'srs13FywcbcZV9VvHxdVkYK83Ch4477cqHMgM8d5oT955yf4XXMvKS'
      );
      expect(commitment.inbox_level).toEqual(197151);
      expect(commitment.predecessor).toEqual(
        'src12i7dL2z9VbgshFDdGFP5TPBoJu6WnZNWJXGa1QQgPTErVPPtd8'
      );
      expect(commitment.number_of_ticks).toEqual('880000000000');

      const soruResult = content.metadata.operation_result;
      expect(soruResult.status).toEqual('applied');
      expect(soruResult.consumed_milligas).toEqual('6317837');
      expect(soruResult.staked_hash).toEqual(
        'src13TanyZ7RvSULqVb2tjx1zRVw2jyJC2ToHLz1ZKg38sZ4HBYdSN'
      );
      expect(soruResult.published_at_level).toEqual(197154);
      expect(soruResult.balance_updates).toEqual([]);
    });

    it('should have correct access to metadata.operation_result.balanceUpdate in smart_rollup_publish', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(smartRollupPublishResponse));
      const response = await client.getBlock();
      const contentWithDiffBalanceUpdate = response.operations[0][1]
        .contents[0] as OperationContentsAndResultSmartRollupPublish;

      const balanceUpdates =
        contentWithDiffBalanceUpdate.metadata.operation_result.balance_updates ?? [];

      const diffBalanceUpdate = balanceUpdates[1];
      expect(diffBalanceUpdate.bond_id?.smart_rollup).toEqual(
        'sr1LhGA2zC9VcYALSifpRBCgDiQfDSQ6bb4x'
      );
    });
  });

  describe('smartRollupCement', () => {
    it('shoud have correct types to access smart_rollup_cement results', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(smartRollupCementResponse));
      const response = await client.getBlock();
      const content = response.operations[0][0]
        .contents[0] as OperationContentsAndResultSmartRollupCement;

      expect(content.kind).toEqual(OpKind.SMART_ROLLUP_CEMENT);
      expect(content.source).toEqual('tz1d5inEKUnAChSgScYuaJrtVmAZ9L5cKGSW');
      expect(content.fee).toEqual('977');
      expect(content.counter).toEqual('150010');
      expect(content.gas_limit).toEqual('6986');
      expect(content.storage_limit).toEqual('0');
      expect(content.rollup).toEqual('sr1CCHLfB1jjz4ikB2bm4XGPvTjafVgUzhLB');

      const soruResult = content.metadata.operation_result;

      expect(soruResult.status).toEqual('applied');
      expect(soruResult.consumed_milligas).toEqual('6884964');
      expect(soruResult.inbox_level).toEqual(337913);
      expect(soruResult.commitment_hash).toEqual(
        'src12wj4nwXiEkwYacLfkLR8X8Md76LNuMzwUgTwgLA9Y3DANaeRay'
      );
    });
  });

  describe('smartRollupRefute', () => {
    it('should have correct types to access smart_rollup_refute results move with pvm_step', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(smartRollupRefuteResponse));
      const response = await client.getBlock();
      const content = response.operations[0][0]
        .contents[0] as OperationContentsAndResultSmartRollupRefute;

      expect(content.kind).toEqual(OpKind.SMART_ROLLUP_REFUTE);
      expect(content.source).toEqual('tz1ZpuBypK6G754crXDZyoMPaVPoBmBsPda2');
      expect(content.fee).toEqual('2096');
      expect(content.counter).toEqual('32553');
      expect(content.gas_limit).toEqual('6299');
      expect(content.storage_limit).toEqual('0');
      expect(content.rollup).toEqual('sr1LhGA2zC9VcYALSifpRBCgDiQfDSQ6bb4x');
      expect(content.opponent).toEqual('tz1QD39GBmSzccuDxWMevj2gudiTX1pZL5kC');

      const refutation = content.refutation as SmartRollupRefutationMove;
      if (refutation.refutation_kind !== SmartRollupRefutationOptions.MOVE) {
        fail('expected refutation_kind: "move"');
      }

      expect(refutation.refutation_kind).toEqual('move');
      expect(refutation.choice).toEqual('176000000003');

      const step = refutation.step;
      if (Array.isArray(step)) {
        fail('expected an object not an array');
      }

      expect(step.pvm_step).toEqual(
        '03000298e4e3d5c88da366e885edf675ffd7a5087c8e0a2fcd508e7951113fe4c1491810067c06a78b88cb7c3e60c56b47ba9e14c922dbdbd4811ac6fee80a309620630005820764757261626c6582066b65726e656cd07d20c53bdd5b536a6be9c4cdad16e69a9af40b93a6564655fffd88bba050519008726561646f6e6c7982066b65726e656cd0a645771d9d5228a31312b282119c596699ccb6b60b93d759c2072a493ddbb5740c7761736d5f76657273696f6e8101408208636f6e74656e7473810130c10200322e302e30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066c656e677468c008000000000000000503746167c00800000004536f6d650003810370766d00050004000381166f7574626f785f76616c69646974795f706572696f64c00400013b0082136c6173745f746f705f6c6576656c5f63616c6cc00680c0abd38f05196d6178696d756d5f7265626f6f74735f7065725f696e707574c002e80781146f7574626f785f6d6573736167655f6c696d6974c002a401810c6d61785f6e625f7469636b73c00580dc9afd28820576616c7565810370766d8107627566666572738205696e7075740003810468656164c001008208636f6e74656e7473d06e2c0a5b371a53e76a9b7f221a5baa67170b3f9f43205fb06c0649123cec2358066c656e677468c00103066f75747075740004820132810a6c6173745f6c6576656cc0040000a33f0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f786573d0ccbff4c181451166adb153f7a1631e9f036832f8e5c82acd8e8c12876eeeda870134810d6d6573736167655f6c696d6974c002a401047761736d00048205696e707574c0050000a33f0203746167c00b0000000770616464696e67820c63757272656e745f7469636bc00683c0abd38f050e7265626f6f745f636f756e746572c002e907'
      );
    });

    it('should have correct types to access smart_rollup_refute results start', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(smartRollupRefuteResponse));
      const response = await client.getBlock();
      const content = response.operations[0][1]
        .contents[0] as OperationContentsAndResultSmartRollupRefute;

      expect(content.kind).toEqual(OpKind.SMART_ROLLUP_REFUTE);
      expect(content.source).toEqual('tz1Qn5AXWB5vYPgzDXsunDbZ7tTUp9cFDaRp');
      expect(content.fee).toEqual('943');
      expect(content.counter).toEqual('25002');
      expect(content.gas_limit).toEqual('6109');
      expect(content.storage_limit).toEqual('0');
      expect(content.rollup).toEqual('sr1Ce7znpA1ea2YZca3v1CefxqXMhqYgDEXR');
      expect(content.opponent).toEqual('tz1VN3J6DyH712W1y13Uu1N8fxkt8RvMyqzm');

      const refutation = content.refutation as SmartRollupRefutationStart;

      expect(refutation.refutation_kind).toEqual('start');
      expect(refutation.player_commitment_hash).toEqual(
        'src14Liog4xxPoZ55AgpBpeDweFSxHK6b3zbybhp7ChsWbM9g1Jsrd'
      );
      expect(refutation.opponent_commitment_hash).toEqual(
        'src12q2zZyxuK5UeYPQYSutA6RPMv7sZDtJ7oAWxAytuJC3rjvWct6'
      );
    });
    it('should have correct types to access smart_rollup_refute results move with dissection', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(smartRollupRefuteResponse));
      const response = await client.getBlock();
      const content = response.operations[0][2]
        .contents[0] as OperationContentsAndResultSmartRollupRefute;

      expect(content.kind).toEqual(OpKind.SMART_ROLLUP_REFUTE);
      expect(content.source).toEqual('tz1QD39GBmSzccuDxWMevj2gudiTX1pZL5kC');
      expect(content.fee).toEqual('1989');
      expect(content.counter).toEqual('32546');
      expect(content.gas_limit).toEqual('4333');
      expect(content.storage_limit).toEqual('0');
      expect(content.rollup).toEqual('sr1LhGA2zC9VcYALSifpRBCgDiQfDSQ6bb4x');
      expect(content.opponent).toEqual('tz1ZpuBypK6G754crXDZyoMPaVPoBmBsPda2');

      const refutation = content.refutation;
      if (refutation.refutation_kind !== SmartRollupRefutationOptions.MOVE) {
        fail('Expected Refutation kind: "move"');
      }

      expect(refutation.refutation_kind).toEqual('move');
      expect(refutation.choice).toEqual('0');

      const step = refutation.step;
      if (!Array.isArray(step)) {
        fail('expected step to be an array');
      }
      expect(step[0]).toEqual({
        state: 'srs11y1ZCJfeWnHzoX3rAjcTXiphwg8NvqQhvishP3PU68jgSREuk6',
        tick: '0',
      });
      expect(step[1]).toEqual({
        state: 'srs12ti4nRqiqahBZedqjgnFx9ZK88KkSgpYD8ns5Q41UMEXGg9w3b',
        tick: '22000000000',
      });
    });
  });

  describe('smartRollupRecoverBond', () => {
    it('should have correct types to access smart_rollup_recover_bond results', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(smartRollupRecoverBondResponse));
      const response = await client.getBlock();
      const content = response.operations[0][0]
        .contents[0] as OperationContentsAndResultSmartRollupRecoverBond;

      expect(content.kind).toEqual(OpKind.SMART_ROLLUP_RECOVER_BOND);
      expect(content.source).toEqual('tz1bTS4QDBnpQPmMPNM3rn7jN1hevkWDHSKw');
      expect(content.fee).toEqual('1000000');
      expect(content.counter).toEqual('25156');
      expect(content.gas_limit).toEqual('4016');
      expect(content.storage_limit).toEqual('0');
      expect(content.rollup).toEqual('sr1EYxm4fQjr15TASs2Q7PgZ1LqS6unkZhHL');
      expect(content.staker).toEqual('tz1bTS4QDBnpQPmMPNM3rn7jN1hevkWDHSKw');
    });
  });

  describe('smartRollupTimeout', () => {
    it('should have correct types to access smart_rollup_timeout', async () => {
      httpBackend.createRequest.mockResolvedValue(Promise.resolve(smartRollupTimeoutResponse));
      const response = await client.getBlock();
      const content = response.operations[0][0]
        .contents[0] as OperationContentsAndResultSmartRollupTimeout;

      expect(content.kind).toEqual(OpKind.SMART_ROLLUP_TIMEOUT);
      expect(content.source).toEqual('tz1TecRhYLVV9bTKRKU9g1Hhpb1Ymw3ynzWS');
      expect(content.fee).toEqual('753');
      expect(content.counter).toEqual('23077');
      expect(content.gas_limit).toEqual('4647');
      expect(content.storage_limit).toEqual('0');
      expect(content.rollup).toEqual('sr1QZkk1swognQW3dmiXvga3wVkEgBq7QFjE');

      const stakers = content.stakers;

      expect(stakers.alice).toEqual('tz1TecRhYLVV9bTKRKU9g1Hhpb1Ymw3ynzWS');
      expect(stakers.bob).toEqual('tz1iFnSQ6V2d8piVMPMjtDNdkYNMaUfKwsoy');
    });
  });

  describe('ticketBalance', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockResolvedValue('3');
      const response = await client.getTicketBalance(contractAddress, {
        ticketer: contractAddress,
        content_type: { prim: 'string ' },
        content: { string: 'ticket1' },
      });

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: `root/chains/test/blocks/head/context/contracts/${contractAddress}/ticket_balance`,
      });

      expect(response).toEqual('3');
    });
  });

  describe('ticketAllBalance', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockResolvedValue(ticketBalancesResponse);
      const response = await client.getAllTicketBalances('KT1X6mCNdfQZSpyU9zZw9sWckPVJyz2X8vwD');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/contracts/KT1X6mCNdfQZSpyU9zZw9sWckPVJyz2X8vwD/all_ticket_balances`,
      });

      expect(response).toEqual(ticketBalancesResponse);
    });
  });

  describe('AdaptiveIssuanceLaunchCycle', () => {
    it('should query the right url and data', async () => {
      httpBackend.createRequest.mockResolvedValue(aiLaunchCycle);
      const response = await client.getAdaptiveIssuanceLaunchCycle();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/blocks/head/context/adaptive_issuance_launch_cycle`,
      });

      expect(response).toEqual(aiLaunchCycle);
    });
  });

  describe('getPendingOperations', () => {
    it('should query the correct url and return pending operations in mempool', async () => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(pendingOperationsResponse));
      const response: PendingOperationsV1 | PendingOperationsV2 =
        await client.getPendingOperations();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: `root/chains/test/mempool/pending_operations`,
        query: {},
      });

      expect(response).toEqual(pendingOperationsResponse);
    });
  });
});
