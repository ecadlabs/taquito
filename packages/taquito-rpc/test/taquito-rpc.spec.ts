import { RpcClient } from '../src/taquito-rpc';
import BigNumber from 'bignumber.js';
import { OperationContentsAndResultEndorsement, OperationContentsAndResultEndorsementWithSlot } from '../src/types';
import { OperationContentsAndResultTransaction } from '../src/types';

/**
 * RpcClient test
 */
describe('RpcClient test', () => {
  let client: RpcClient;
  let httpBackend: {
    createRequest: jest.Mock<any, any>;
  };

  beforeEach(() => {
    httpBackend = {
      createRequest: jest.fn(),
    };
    client = new RpcClient('root', 'test', httpBackend as any);
  });

  it('RpcClient is instantiable', () => {
    const rpcUrl: string = 'test';
    expect(new RpcClient(rpcUrl)).toBeInstanceOf(RpcClient);
  });

  describe('Concat url properly', () => {
    it('Should prevent double slashes given multiple trailing slashes', async done => {
      const client = new RpcClient('root.com/test///', 'test', httpBackend as any);
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      await client.getBalance('address');
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root.com/test/chains/test/blocks/head/context/contracts/address/balance',
      });
      done();
    });

    it('Should prevent double slashes given one trailing slash', async done => {
      const client = new RpcClient('root.com/test/', 'test', httpBackend as any);
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      await client.getBalance('address');
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root.com/test/chains/test/blocks/head/context/contracts/address/balance',
      });
      done();
    });

    it('Should prevent double slashes given no trailing slash', async done => {
      const client = new RpcClient('root.com/test', 'test', httpBackend as any);
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      await client.getBalance('address');
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root.com/test/chains/test/blocks/head/context/contracts/address/balance',
      });
      done();
    });
  });

  describe('getBalance', () => {
    it('query the right url and return a string', async done => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('10000'));
      const balance = await client.getBalance('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/balance',
      });
      expect(balance).toBeInstanceOf(BigNumber);
      expect(balance.toString()).toEqual('10000');

      done();
    });
  });

  describe('getStorage', () => {
    it('query the right url', async done => {
      await client.getStorage('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/storage',
      });

      done();
    });
  });

  describe('getScript', () => {
    it('query the right url', async done => {
      await client.getScript('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/script',
      });

      done();
    });
  });

  describe('getContract', () => {
    it('query the right url', async done => {
      httpBackend.createRequest.mockResolvedValue({ balance: '10000' });
      const response = await client.getContract('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address',
      });

      expect(response.balance).toBeInstanceOf(BigNumber);
      expect(response.balance.toString()).toEqual('10000');

      done();
    });
  });

  describe('getManagerKey', () => {
    it('query the right url', async done => {
      await client.getManagerKey('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/manager_key',
      });

      done();
    });
  });

  describe('getDelegate', () => {
    it('query the right url', async done => {
      await client.getDelegate('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/delegate',
      });

      done();
    });
  });

  describe('getBlockHash', () => {
    it('query the right url', async done => {
      await client.getBlockHash();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/hash',
      });

      done();
    });
  });

  describe('getDelegates', () => {
    const sampleResponse = {
      balance: '5092341810457',
      frozen_balance: '2155290163074',
      frozen_balance_by_cycle: [
        { cycle: 135, deposit: '381760000000', fees: '971071', rewards: '11843833332' },
        { cycle: 136, deposit: '394368000000', fees: '1433657', rewards: '12200333332' },
      ],
      staking_balance: '20936607331513',
      delegated_contracts: [
        'KT1VvXEpeBpreAVpfp4V8ZujqWu2gVykwXBJ',
        'KT1VsSxSXUkgw6zkBGgUuDXXuJs9ToPqkrCg',
      ],
      delegated_balance: '15908924646030',
      deactivated: false,
      grace_period: 146,
    };

    it('query the right url', async done => {
      httpBackend.createRequest.mockResolvedValue(sampleResponse);
      await client.getDelegates('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/delegates/address',
      });

      done();
    });

    it('parse the response properly', async done => {
      httpBackend.createRequest.mockResolvedValue(sampleResponse);
      const response = await client.getDelegates('address');

      expect(response).toEqual({
        balance: new BigNumber('5092341810457'),
        frozen_balance: new BigNumber('2155290163074'),
        frozen_balance_by_cycle: [
          {
            cycle: 135,
            deposit: new BigNumber('381760000000'),
            fees: new BigNumber('971071'),
            rewards: new BigNumber('11843833332'),
          },
          {
            cycle: 136,
            deposit: new BigNumber('394368000000'),
            fees: new BigNumber('1433657'),
            rewards: new BigNumber('12200333332'),
          },
        ],
        staking_balance: new BigNumber('20936607331513'),
        delegated_contracts: [
          'KT1VvXEpeBpreAVpfp4V8ZujqWu2gVykwXBJ',
          'KT1VsSxSXUkgw6zkBGgUuDXXuJs9ToPqkrCg',
        ],
        delegated_balance: new BigNumber('15908924646030'),
        deactivated: false,
        grace_period: 146,
      });

      done();
    });
  });

  describe('getBigMapKey', () => {
    it('query the right url', async done => {
      // tslint:disable-next-line: deprecation
      await client.getBigMapKey('address', { key: 'test', type: 'string' } as any);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/context/contracts/address/big_map_get',
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({ key: 'test', type: 'string' });

      done();
    });
  });

  describe('forgeOperation', () => {
    it('query the right url', async done => {
      await client.forgeOperations({} as any);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/forge/operations',
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({});

      done();
    });
  });

  describe('injectOperations', () => {
    it('query the right url', async done => {
      await client.injectOperation({} as any);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/injection/operation',
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({});

      done();
    });
  });

  describe('preapplyOperations', () => {
    it('query the right url', async done => {
      httpBackend.createRequest.mockResolvedValue({});
      await client.preapplyOperations({} as any);
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/preapply/operations',
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual({});

      done();
    });
  });

  describe('getBlockHeader', () => {
    it('query the right url', async done => {
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

      done();
    });
  });

  describe('getBlockMetadata', () => {
    it('query the right url', async done => {
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

      done();
    });
  });

  describe('getConstants Proto007', () => {
    it('query the right url and casts property to BigNumber', async done => {
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
          baking_reward_per_endorsement: ['1250000','187500'],
          endorsement_reward: ['1250000','833333'],
          cost_per_byte: '250',
          hard_storage_limit_per_operation: '60000',
          test_chain_duration: '61440',
          quorum_min: 2000,
          quorum_max: 7000,
          min_proposal_quorum: 500,
          initial_endorsers: 24,
          delay_per_missing_endorsement: '4'
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

      done();
    });
  });

   describe('getConstants Proto006', () => {
    it('properties return by the RPC are accessible and the ones that do not belong to proto6 are undefined', async done => {
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
          baking_reward_per_endorsement: ['1250000','187500'],
          endorsement_reward: ['1250000','833333'],
          cost_per_byte: '1000',
          hard_storage_limit_per_operation: '60000',
          test_chain_duration: '1966080',
          quorum_min: 2000,
          quorum_max: 7000,
          min_proposal_quorum: 500,
          initial_endorsers: 24,
          delay_per_missing_endorsement: '8'
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

      done();
    });
  });

  describe('getConstants Proto005', () => {
    it('properties return by the RPC are accessible and the ones that do not belong to proto5 are undefined', async done => {
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
          baking_reward_per_endorsement: ['1250000','187500'],
          endorsement_reward: '2000000',
          cost_per_byte: '1000',
          hard_storage_limit_per_operation: '60000',
          test_chain_duration: '1966080',
          quorum_min: 2000,
          quorum_max: 7000,
          min_proposal_quorum: 500,
          initial_endorsers: 24,
          delay_per_missing_endorsement: '8'
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

      done();
    });
  });

  describe('getBlock', () => {
    it('query the right url and property for endorsement', async done => {
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
      const endorsement = response.operations[0][0]
        .contents[0] as OperationContentsAndResultEndorsement;
      expect(endorsement.metadata.balance_updates[0].kind).toEqual('contract');

      done();
    });
  });

  describe('getBlock', () => {
    it('query the right url and property for operation', async done => {
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
              fitness: [
                '01',
                '000000000001635c'
              ],
              context: 'CoV8F9ro52txU4rGRGNXfQZgbE3pZVMygNV4UGjf6foKhBMb8MJC',
              priority: 0,
              proof_of_work_nonce: '6102c8089c360500',
              signature: 'sigkj5nVVW6Zq7F9dEstPs5o2s1vTnUfwhsWi3UnmwrjYVwN9gfmXUBArzSLeXEUNQBM4KUYSg385i1ajR9TugSkM2swFzQp'
            },
            metadata: {
              protocol: 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
              next_protocol: 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
              test_chain_status: {
                status: 'not_running'
              },
              max_operations_ttl: 60,
              max_operation_data_length: 16384,
              max_block_header_length: 238,
              max_operation_list_length: [
                {
                  max_size: 32768,
                  max_op: 32
                },
                {
                  max_size: 32768
                },
                {
                  max_size: 135168,
                  max_op: 132
                },
                {
                  max_size: 524288
                }
              ],
              baker: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
              level: {
                level: 90973,
                level_position: 90972,
                cycle: 44,
                cycle_position: 860,
                voting_period: 22,
                voting_period_position: 860,
                expected_commitment: false
              },
              level_info: {
                level: 90973,
                level_position: 90972,
                cycle: 44,
                cycle_position: 860,
                expected_commitment: false
              },
              voting_period_kind: 'proposal',
              voting_period_info: {
                voting_period: {
                  index: 22,
                  kind: 'proposal',
                  start_position: 90112,
                },
                position: 860,
                remaining: 3235
              },
              nonce_hash: null,
              consumed_gas: '73225095',
              deactivated: [
                
              ],
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                  change: '-512000000'
                },
                {
                  kind: 'freezer',
                  category: 'deposits',
                  delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                  cycle: 44,
                  change: '512000000'
                },
                {
                  kind: 'freezer',
                  category: 'rewards',
                  delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                  cycle: 44,
                  change: '38750000'
                }
              ]
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
                              string: 'tz3beCZmQhd5Q1KNMZbiLCarXVo9aqpPHYe8'
                            },
                            {
                              int: '100'
                            }
                          ]
                        }
                      },
                      metadata: {
                        balance_updates: [
                          {
                            kind: 'contract',
                            contract: 'tz3beCZmQhd5Q1KNMZbiLCarXVo9aqpPHYe8',
                            change: '-2820'
                          },
                          {
                            kind: 'freezer',
                            category: 'fees',
                            delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
                            cycle: 44,
                            change: '2820'
                          }
                        ],
                        operation_result: {
                          status: 'applied',
                          storage: [
                            {
                              int: '33681'
                            },
                            {
                              bytes: '0002a7f8d8600737ff279e4b9a4b1518157b653a314d'
                            },
                            {
                              prim: 'False'
                            },
                            {
                              int: '300'
                            }
                          ],
                          big_map_diff: [
                            {
                              action: 'update',
                              big_map: '33681',
                              key_hash: 'expruAQuDQJ9ojnpqipCAbR23gBSSff7AxaMT9UBRjpZpiDHfJ6b6L',
                              key: {
                                bytes: '0002a7f8d8600737ff279e4b9a4b1518157b653a314d'
                              },
                              value: {
                                prim: 'Pair',
                                args: [
                                  {
                                    int: '102'
                                  },
                                  [
                                    
                                  ]
                                ]
                              }
                            }
                          ],
                          balance_updates: [
                            {
                              kind: 'contract',
                              contract: 'tz3beCZmQhd5Q1KNMZbiLCarXVo9aqpPHYe8',
                              change: '-250'
                            }
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
                                    key_hash: 'expruAQuDQJ9ojnpqipCAbR23gBSSff7AxaMT9UBRjpZpiDHfJ6b6L',
                                    key: {
                                      bytes: '0002a7f8d8600737ff279e4b9a4b1518157b653a314d'
                                    },
                                    value: {
                                      prim: 'Pair',
                                      args: [
                                        {
                                          int: '102'
                                        },
                                        [
                                          
                                        ]
                                      ]
                                    }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    }
                  ],
                  signature: 'sigmCS2nZquXi3vXX8p7iwc6TVYC87FsGYkxSgEMiQESbM5dnnP4SGe4YHLRFXuRwcs1VaNLsiFWzVQVnpbNDfAhYhPgRnCG',
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
      expect(transaction.metadata.balance_updates[0].kind).toEqual('contract');
      expect(transaction.metadata.balance_updates[0].change).toEqual('-2820');
      expect(transaction.metadata.operation_result.status).toEqual('applied');
      expect(transaction.metadata.operation_result.consumed_gas).toEqual('24660');
      done();
    });

    it('query the right url and property for operation, proto 9, endorsement_with_slot', async done => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          "protocol": "PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i",
          "chain_id": "NetXxkAx4woPLyu",
          "hash": "BLRWVvWTrqgUt1JL76RnUguKhkqfbHnXVrznXpuCrhxemSuCrb3",
          "header": {
            "level": 174209,
            "proto": 1,
            "predecessor": "BMarN3hiEmCrSrfeo6qndubHe9FXpPy4qcj3Xr2NBGGfG4Tfcaj",
            "timestamp": "2021-05-07T18:37:59Z",
            "validation_pass": 4,
            "operations_hash": "LLoaFb5cQjcr2pzKbLsmhPN2NgLY5gGs9ePimjRsNyCtgAQejfbXg",
            "fitness": ["01", "000000000002a880"],
            "context": "CoWMJU1LmpfMn92zz4Ah1TrwXaSHnRWcy8dcso32AH7miULKad1d",
            "priority": 0,
            "proof_of_work_nonce": "08351e3d59170e00",
            "signature": "sigg9pz9Q5i17nDZpZ3mbbMQsLHNuHX3SxTxHguLwgR9xYL2x17TmH7QfVFsadQTa61QCnq5vuFXkFtymeQKNh74VsWnMu9D"
          },
          "metadata": {},
          "operations": [
            [
              {
                "protocol": "PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i",
                "chain_id": "NetXxkAx4woPLyu",
                "hash": "ooYSSxYcgreJQtrzxqyBpBdCntVbnbvHdtqA7RZsFcSDz4XFZJY",
                "branch": "BMarN3hiEmCrSrfeo6qndubHe9FXpPy4qcj3Xr2NBGGfG4Tfcaj",
                "contents": [
                  {
                    "kind": "endorsement_with_slot",
                    "endorsement": {
                      "branch": "BMarN3hiEmCrSrfeo6qndubHe9FXpPy4qcj3Xr2NBGGfG4Tfcaj",
                      "operations": { "kind": "endorsement", "level": 174208 },
                      "signature": "signiPFVn2gFXvu7dKxEnifWQgbzan9ca6z7XSS5PyNBin2BufNBTFz9hgM7imvWf2HSj6NY3ECtEvb5xmwiYnUDbpSTUQC6"
                    },
                    "slot": 4,
                    "metadata": {
                      "balance_updates": [
                        {
                          "kind": "contract",
                          "contract": "tz1VWasoyFGAWZt5K2qZRzP3cWzv3z7MMhP8",
                          "change": "-320000000",
                          "origin": "block"
                        },
                        {
                          "kind": "freezer",
                          "category": "deposits",
                          "delegate": "tz1VWasoyFGAWZt5K2qZRzP3cWzv3z7MMhP8",
                          "cycle": 85,
                          "change": "320000000",
                          "origin": "block"
                        },
                        {
                          "kind": "freezer",
                          "category": "rewards",
                          "delegate": "tz1VWasoyFGAWZt5K2qZRzP3cWzv3z7MMhP8",
                          "cycle": 85,
                          "change": "6250000",
                          "origin": "block"
                        }
                      ],
                      "delegate": "tz1VWasoyFGAWZt5K2qZRzP3cWzv3z7MMhP8",
                      "slots": [4, 11, 18, 21, 24]
                    }
                  }
                ]
              }
            ]
          ]
        }
        )
      );

      const response = await client.getBlock();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head',
      });
      const endorsementWithSlot = response.operations[0][0]
        .contents[0] as OperationContentsAndResultEndorsementWithSlot;
      expect(endorsementWithSlot.kind).toEqual('endorsement_with_slot');
      expect(endorsementWithSlot.metadata.slots).toEqual([4, 11, 18, 21, 24]);
      expect(endorsementWithSlot.slot).toEqual(4);
      done();
    });
  });

  describe('getBakingRights', () => {
    it('query the right url and data', async done => {
      httpBackend.createRequest.mockResolvedValue([
        {
          level: 547387,
          delegate: 'tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN',
          priority: 4,
          estimated_time: '2019-08-02T09:48:56Z',
        },
        {
          level: 547387,
          delegate: 'tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e',
          priority: 8,
          estimated_time: '2019-08-02T09:53:56Z',
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
      done();
    });
  });

  describe('getEndorsingRights', () => {
    it('query the right url and data', async done => {
      httpBackend.createRequest.mockResolvedValue([
        {
          level: 547386,
          delegate: 'tz3WMqdzXqRWXwyvj5Hp2H7QEepaUuS7vd9K',
          slots: [27],
          estimated_time: '2019-08-02T09:42:56Z',
        },
        {
          level: 547386,
          delegate: 'tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN',
          slots: [23, 12, 0],
          estimated_time: '2019-08-02T09:42:56Z',
        },
        {
          level: 547386,
          delegate: 'tz3RB4aoyjov4KEVRbuhvQ1CKJgBJMWhaeB8',
          slots: [31, 17, 13],
          estimated_time: '2019-08-02T09:42:56Z',
        },
        {
          level: 547386,
          delegate: 'tz3NExpXn9aPNZPorRE4SdjJ2RGrfbJgMAaV',
          slots: [24, 9, 1],
          estimated_time: '2019-08-02T09:42:56Z',
        },
      ]);
      const result = await client.getEndorsingRights();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        query: {},
        url: 'root/chains/test/blocks/head/helpers/endorsing_rights',
      });

      expect(result[1].delegate).toEqual('tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN');
      expect(result[1].estimated_time).toEqual('2019-08-02T09:42:56Z');
      expect(result[1].slots.length).toEqual(3);
      done();
    });
  });

  describe('getBallotList', () => {
    it('query the right url and data', async done => {
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

      done();
    });
  });

  describe('getBallots', () => {
    it('query the right url and data', async done => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve({ yay: 5943, nay: 0, pass: 0 }));
      const response = await client.getBallots();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/ballots',
      });
      expect(response.yay).toEqual(5943);

      done();
    });
  });

  describe('getCurrentPeriodKind', () => {
    it('query the right url and data', async done => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve('testing_vote'));
      const response = await client.getCurrentPeriodKind();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/current_period_kind',
      });
      expect(response).toEqual('testing_vote');

      done();
    });
  });

  describe('getCurrentProposal', () => {
    it('query the right url and data', async done => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve('PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU')
      );
      const response = await client.getCurrentProposal();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/current_proposal',
      });
      expect(response).toEqual('PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU');

      done();
    });
  });

  describe('getCurrentQuorum', () => {
    it('query the right url and data', async done => {
      httpBackend.createRequest.mockReturnValue(Promise.resolve(7291));
      const response = await client.getCurrentQuorum();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/current_quorum',
      });
      expect(response).toEqual(7291);

      done();
    });
  });

  describe('getVotesListings', () => {
    it('query the right url and data', async done => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve([
          {
            pkh: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m',
            rolls: 3726,
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
      expect(response[4].pkh).toEqual('tz2JMPu9yVKuX2Au8UUbp7YrKBZJSdYhgwwu');

      done();
    });
  });

  describe('getProposals', () => {
    it('query the right url and data', async done => {
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
      expect(response[0][1]).toEqual(2832);

      done();
    });
  });

  describe('getEntrypoints', () => {
    it('query the right url and data', async done => {
      httpBackend.createRequest.mockReturnValue({ entrypoints: {} });
      const response = await client.getEntrypoints('test');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/test/entrypoints',
      });
      expect(response).toEqual({ entrypoints: {} });
      done();
    });
  });
  describe('runOperation', () => {
    it('query the right url and data', async done => {
      const testData = {};

      await client.runOperation(testData as any);

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'POST',
        url: 'root/chains/test/blocks/head/helpers/scripts/run_operation',
      });

      expect(httpBackend.createRequest.mock.calls[0][1]).toEqual(testData);

      done();
    });
  });

  describe('packData', () => {
    it('query the right url and data', async done => {
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

      done();
    });

    it('return a big number for gas when it is a big number', async done => {
      httpBackend.createRequest.mockResolvedValue({ packed: 'cafe', gas: '2' });
      const response = await client.packData({
        data: { string: 'test' },
        type: { prim: 'string' },
      });
      expect(response).toEqual({ packed: 'cafe', gas: new BigNumber(2) });
      expect(response.gas).toBeInstanceOf(BigNumber);

      done();
    });

    it('return undefined for gas when it is missing', async done => {
      httpBackend.createRequest.mockResolvedValue({ packed: 'cafe' });
      const response = await client.packData({
        data: { string: 'test' },
        type: { prim: 'string' },
      });
      expect(response).toEqual({ packed: 'cafe' });
      expect(response.gas).toBeUndefined();
      done();
    });
  });

  describe('getBigMapExpr', () => {
    it('query the right url and data', async done => {
      await client.getBigMapExpr('1', '2');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/big_maps/1/2',
      });
      done();
    });
  });

  describe('getRpcUrl', () => {
    it('return the RPC Url', () => {
      const url: string = 'https://api.tez.ie/rpc/mainnet';
      const rpcUrlMainnet = (new RpcClient(url)).getRpcUrl();
      expect(rpcUrlMainnet).toEqual('https://api.tez.ie/rpc/mainnet');
      const rpcUrlCarthagenet = (new RpcClient('https://api.tez.ie/rpc/carthagenet')).getRpcUrl();
      expect(rpcUrlCarthagenet).toEqual('https://api.tez.ie/rpc/carthagenet');
    });
  });

  describe('getCurrentPeriod', () => {
    it('query the right url and data', async done => {
      const mockedResponse = {
        "voting_period": {
          "index": 87,
          "kind": "proposal",
          "start_position": 89088
          },
        "position": 902,
        "remaining": 121
      };
      
      httpBackend.createRequest.mockReturnValue(Promise.resolve(mockedResponse));
      const response = await client.getCurrentPeriod();
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/current_period',
      });
      expect(response).toEqual(mockedResponse);

      done();
    });
  });


  describe('getSuccessorPeriod', () => {
    it('query the right url and data', async done => {
      const mockedResponse = {
        "voting_period": {
          "index": 87,
          "kind": "proposal",
          "start_position": 89088
          },
        "position": 902,
        "remaining": 121
      };
      
      httpBackend.createRequest.mockReturnValue(Promise.resolve(mockedResponse));
      const response = await client.getSuccessorPeriod();
      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/votes/successor_period',
      });
      expect(response).toEqual(mockedResponse);

      done();
    });
  });
});
