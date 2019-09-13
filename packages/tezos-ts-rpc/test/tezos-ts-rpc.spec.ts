import { RpcClient } from '../src/tezos-ts-rpc';
import BigNumber from 'bignumber.js';
import { OperationContentsAndResultEndorsement } from '../src/types';

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
    expect(new RpcClient()).toBeInstanceOf(RpcClient);
  });

  describe('getBalance', () => {
    it('query the right url and returns a string', async done => {
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

  describe('getManager', () => {
    it('query the right url', async done => {
      await client.getManager('address');

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/contracts/address/manager',
      });

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
        frozenBalance: new BigNumber('2155290163074'),
        frozenBalanceByCycle: [
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
        stakingBalance: new BigNumber('20936607331513'),
        delegatedContracts: [
          'KT1VvXEpeBpreAVpfp4V8ZujqWu2gVykwXBJ',
          'KT1VsSxSXUkgw6zkBGgUuDXXuJs9ToPqkrCg',
        ],
        delegatedBalance: new BigNumber('15908924646030'),
        deactivated: false,
        gracePeriod: 146,
      });

      done();
    });
  });

  describe('getBigMapKey', () => {
    it('query the right url', async done => {
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
        chainId: 'NetXdQprcVkpaWU',
        hash: 'BLjs6BSiYpwV5u6YpNHNSAqr1iuJRGDHXK3Qb6DH1ZkN8QbAitW',
        level: 596467,
        proto: 4,
        predecessor: 'BMYidfFK1tfryqoTRnAPLMonagy3f2goaw2QBpGsHF8YySQe8tU',
        timestamp: '2019-09-06T15:08:29Z',
        validationPass: 4,
        operationsHash: 'LLoaq9gTDXXLgKZGd6af1iwnfmmQXkJJnGn6WS6XhE7kh5AsdmFER',
        fitness: ['00', '00000000011f6a7c'],
        context: 'CoWNJGqDcKWeQaiRZoo5akYwXrQBGtWAncgV9QnF16yUpAM47T5F',
        priority: 0,
        proofOfWorkNonce: '000000036e2c8c91',
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
        nextProtocol: 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
        testChainStatus: {
          status: 'running',
          chainId: 'NetXpqTM3MbtXCx',
          genesis: 'BMRaLy3WBWJTdWVjosVGyYi2z4rnGxZfxqPt1RW1QMZuKUnkBuJ',
          protocol: 'PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU',
          expiration: '2019-09-24T12:01:51Z',
        },
        maxOperationsTtl: 60,
        maxOperationDataLength: 16384,
        maxBlockHeaderLength: 238,
        maxOperationListLength: [
          { maxSize: 32768, maxOp: 32 },
          { maxSize: 32768 },
          { maxSize: 135168, maxOp: 132 },
          { maxSize: 524288 },
        ],
        baker: 'tz1Lhf4J9Qxoe3DZ2nfe8FGDnvVj7oKjnMY6',
        level: {
          level: 596469,
          levelPosition: 596468,
          cycle: 145,
          cyclePosition: 2548,
          votingPeriod: 18,
          votingPeriodPosition: 6644,
          expectedCommitment: false,
        },
        votingPeriodKind: 'testing',
        nonceHash: null,
        consumedGas: '10200',
        deactivated: [],
        balanceUpdates: [
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

  describe('getConstants', () => {
    it('query the right url and casts property to BigNumber', async done => {
      httpBackend.createRequest.mockReturnValue(
        Promise.resolve({
          proof_of_work_nonce_size: 8,
          nonce_length: 32,
          max_revelations_per_block: 32,
          max_operation_data_length: 16384,
          max_proposals_per_delegate: 20,
          preserved_cycles: 3,
          blocks_per_cycle: 2048,
          blocks_per_commitment: 32,
          blocks_per_roll_snapshot: 256,
          blocks_per_voting_period: 8192,
          time_between_blocks: ['30', '40'],
          endorsers_per_block: 32,
          hard_gas_limit_per_operation: '400000',
          hard_gas_limit_per_block: '4000000',
          proof_of_work_threshold: '70368744177663',
          tokens_per_roll: '10000000000',
          michelson_maximum_type_size: 1000,
          seed_nonce_revelation_tip: '125000',
          origination_size: 257,
          block_security_deposit: '128000000',
          endorsement_security_deposit: '16000000',
          block_reward: '0',
          endorsement_reward: '0',
          cost_per_byte: '1000',
          hard_storage_limit_per_operation: '60000',
        })
      );
      const response = await client.getConstants();

      expect(httpBackend.createRequest.mock.calls[0][0]).toEqual({
        method: 'GET',
        url: 'root/chains/test/blocks/head/context/constants',
      });
      expect(response.blockSecurityDeposit).toBeInstanceOf(BigNumber);
      expect(response.blockSecurityDeposit.toString()).toEqual('128000000');

      done();
    });
  });

  describe('getBlock', () => {
    it('query the right url and property', async done => {
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
      expect(endorsement.metadata.balanceUpdates[0].kind).toEqual('contract');

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
      expect(result[0].estimatedTime).toEqual('2019-08-02T09:48:56Z');
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
      expect(result[1].estimatedTime).toEqual('2019-08-02T09:42:56Z');
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
});
