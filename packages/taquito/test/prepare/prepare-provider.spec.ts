/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from '../../src/context';
import { PrepareProvider } from '../../src/prepare/prepare-provider';
import BigNumber from 'bignumber.js';
import { preparedOriginationOpWithReveal, preparedOriginationOpNoReveal } from './data';
import { Estimate } from '../../src/estimate';

import { TransferTicketParams, OpKind } from '../../src/operations/types';
import { PvmKind } from '@taquito/rpc';

describe('PrepareProvider test', () => {
  let prepareProvider: PrepareProvider;

  let mockForger: {
    forge: jest.Mock<any, any>;
  };

  let mockReadProvider: {
    getBlockHash: jest.Mock<any, any>;
    getNextProtocol: jest.Mock<any, any>;
    getCounter: jest.Mock<any, any>;
    getProtocolConstants: jest.Mock<any, any>;
    getBalance: jest.Mock<any, any>;
    isAccountRevealed: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
  };

  let mockRpcClient: {
    getBlockHeader: jest.Mock<any, any>;
    getProtocols: jest.Mock<any, any>;
    getContract: jest.Mock<any, any>;
    getCurrentPeriod: jest.Mock<any, any>;
    getConstants: jest.Mock<any, any>;
    getManagerKey: jest.Mock<any, any>;
    getOriginationProof: jest.Mock<any, any>;
  };

  let mockSigner: {
    publicKeyHash: jest.Mock<any, any>;
    publicKey: jest.Mock<any, any>;
  };

  let estimate: Estimate;
  let context: Context;

  beforeEach(() => {
    mockReadProvider = {
      getBlockHash: jest.fn(),
      getNextProtocol: jest.fn(),
      getCounter: jest.fn(),
      getProtocolConstants: jest.fn(),
      getBalance: jest.fn(),
      isAccountRevealed: jest.fn(),
      getChainId: jest.fn(),
    };

    mockForger = {
      forge: jest.fn(),
    };

    mockRpcClient = {
      getBlockHeader: jest.fn(),
      getProtocols: jest.fn(),
      getContract: jest.fn(),
      getCurrentPeriod: jest.fn(),
      getConstants: jest.fn(),
      getManagerKey: jest.fn(),
      getOriginationProof: jest.fn(),
    };

    mockSigner = {
      publicKeyHash: jest.fn(),
      publicKey: jest.fn(),
    };

    mockRpcClient.getContract.mockResolvedValue({
      counter: 0,
      script: {
        code: [],
        storage: 'sampleStorage',
      },
    });

    mockRpcClient.getConstants.mockResolvedValue({
      hard_gas_limit_per_operation: new BigNumber(1040000),
      hard_storage_limit_per_operation: new BigNumber(60000),
      hard_gas_limit_per_block: new BigNumber(5200000),
      cost_per_byte: new BigNumber(1000),
    });

    mockReadProvider.getProtocolConstants.mockResolvedValue({
      hard_gas_limit_per_operation: new BigNumber('1040000'),
      hard_gas_limit_per_block: new BigNumber('5200000'),
      cost_per_byte: new BigNumber('250'),
      hard_storage_limit_per_operation: new BigNumber('60000'),
      minimal_block_delay: new BigNumber('30'),
      time_between_blocks: [new BigNumber('60'), new BigNumber('40')],
    });

    mockReadProvider.getBalance.mockResolvedValue(new BigNumber('10000000000'));
    mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test_block_header' });
    mockRpcClient.getProtocols.mockResolvedValue({ next_protocol: 'test_proto' });
    mockRpcClient.getCurrentPeriod.mockResolvedValue({
      voting_period: {
        index: 103,
        kind: 'proposal',
        start_position: 421888,
      },
      position: 3413,
      remaining: 682,
    });

    mockReadProvider.getChainId.mockResolvedValue('chain-id');

    mockSigner.publicKeyHash.mockResolvedValue('test_public_key_hash');
    mockSigner.publicKey.mockResolvedValue('test_pub_key');

    mockReadProvider.getBlockHash.mockResolvedValue('test_block_hash');
    mockReadProvider.getNextProtocol.mockResolvedValue('test_protocol');
    mockReadProvider.getCounter.mockResolvedValue('0');

    context = new Context(mockRpcClient as any, mockSigner as any);
    context.readProvider = mockReadProvider as any;

    context.forger = mockForger;

    estimate = new Estimate(1000, 1000, 180, 1000);
    jest.spyOn(context.estimate, 'setDelegate').mockResolvedValue(estimate);
    jest.spyOn(context.estimate, 'originate').mockResolvedValue(estimate);
    jest.spyOn(context.estimate, 'transfer').mockResolvedValue(estimate);
    jest.spyOn(context.estimate, 'transferTicket').mockResolvedValue(estimate);
    jest.spyOn(context.estimate, 'registerDelegate').mockResolvedValue(estimate);
    jest.spyOn(context.estimate, 'registerGlobalConstant').mockResolvedValue(estimate);
    jest.spyOn(context.estimate, 'increasePaidStorage').mockResolvedValue(estimate);
    jest.spyOn(context.estimate, 'txRollupOriginate').mockResolvedValue(estimate);
    jest.spyOn(context.estimate, 'txRollupSubmitBatch').mockResolvedValue(estimate);
    jest.spyOn(context.estimate, 'updateConsensusKey').mockResolvedValue(estimate);
    jest.spyOn(context.estimate, 'smartRollupAddMessages').mockResolvedValue(estimate);
    jest.spyOn(context.estimate, 'smartRollupOriginate').mockResolvedValue(estimate);

    prepareProvider = new PrepareProvider(context);
  });

  describe('originate', () => {
    it('should return a prepared origination operation with a reveal operation', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(estimate);

      const prepared = await prepareProvider.originate({
        balance: '1',
        code: `parameter string;
        storage string;
        code {CAR;
          PUSH string "Hello ";
          CONCAT;
          NIL operation; PAIR};
          `,
        init: `"test"`,
      });

      const res = JSON.parse(JSON.stringify(prepared));

      expect(res).toEqual(preparedOriginationOpWithReveal);
    });

    it('should be able to prepare origination op without reveal op when reveal estimate returns undefined', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(undefined);

      const prepared = await prepareProvider.originate({
        balance: '1',
        code: `parameter string;
        storage string;
        code {CAR;
              PUSH string "Hello ";
              CONCAT;
              NIL operation; PAIR};
        `,
        init: `"test"`,
      });

      const res = JSON.parse(JSON.stringify(prepared));

      expect(res).toEqual(preparedOriginationOpNoReveal);
    });
  });

  describe('transaction', () => {
    it('should return a prepared Transaction operation with a reveal op', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(estimate);

      const prepared = await prepareProvider.transaction({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '391',
              public_key: 'test_pub_key',
              source: 'test_public_key_hash',
              gas_limit: '101',
              storage_limit: '1000',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              amount: '2000000',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              source: 'test_public_key_hash',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare transaction op without reveal op when estimate returns undefined', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(undefined);

      const prepared = await prepareProvider.transaction({
        to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        amount: 2,
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'transaction',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              amount: '2000000',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              source: 'test_public_key_hash',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('drainDelegate', () => {
    it('should return a prepared drain_delegate operation', async () => {
      const prepared = await prepareProvider.drainDelegate({
        consensus_key: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
        delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
        destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'drain_delegate',
              consensus_key: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
              delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
              destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('delegation', () => {
    it('should return a prepared delegation operation with reveal operation', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(estimate);

      const prepared = await prepareProvider.delegation({
        source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        delegate: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '391',
              public_key: 'test_pub_key',
              source: 'test_public_key_hash',
              gas_limit: '101',
              storage_limit: '1000',
              counter: '1',
            },
            {
              kind: 'delegation',
              source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              delegate: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should return a prepared delegation op without reveal operation when reveal Estimation returns undefined', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(undefined);

      const prepared = await prepareProvider.delegation({
        source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        delegate: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'delegation',
              source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              delegate: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('registerGlobalConstant', () => {
    it('should return a prepared registerGlobalConstant operation', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(estimate);

      const prepared = await prepareProvider.registerGlobalConstant({
        value: { prim: 'Pair', args: [{ int: '999' }, { int: '999' }] },
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '391',
              public_key: 'test_pub_key',
              source: 'test_public_key_hash',
              gas_limit: '101',
              storage_limit: '1000',
              counter: '1',
            },
            {
              kind: 'register_global_constant',
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
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              source: 'test_public_key_hash',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare register_global_constant op ', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(undefined);

      const prepared = await prepareProvider.registerGlobalConstant({
        value: { prim: 'Pair', args: [{ int: '999' }, { int: '999' }] },
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'register_global_constant',
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
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              source: 'test_public_key_hash',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });
  describe('updateConsensusKey', () => {
    it('should return a prepared udpateConsensusKey operation', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(estimate);

      const prepared = await prepareProvider.updateConsensusKey({
        pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '391',
              public_key: 'test_pub_key',
              source: 'test_public_key_hash',
              gas_limit: '101',
              storage_limit: '1000',
              counter: '1',
            },
            {
              kind: 'update_consensus_key',
              source: 'test_public_key_hash',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare update_consensus_key operation prepended with reveal op', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(undefined);

      const prepared = await prepareProvider.updateConsensusKey({
        pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'update_consensus_key',
              source: 'test_public_key_hash',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('transferTicket', () => {
    it('should return a prepared transferTicket operation', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(estimate);

      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
        fee: 804,
        gasLimit: 5009,
        storageLimit: 130,
        ticketContents: { string: 'foobar' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticketAmount: 2,
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
        entrypoint: 'default',
      };

      const prepared = await prepareProvider.transferTicket(params);

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '391',
              public_key: 'test_pub_key',
              source: 'test_public_key_hash',
              gas_limit: '101',
              storage_limit: '1000',
              counter: '1',
            },
            {
              kind: 'transfer_ticket',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
              ticket_contents: {
                string: 'foobar',
              },
              ticket_ty: {
                prim: 'string',
              },
              ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
              ticket_amount: '2',
              destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
              entrypoint: 'default',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare transfer_ticket operation prepended with reveal op', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(undefined);

      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
        fee: 804,
        gasLimit: 5009,
        storageLimit: 130,
        ticketContents: { string: 'foobar' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
        ticketAmount: 2,
        destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
        entrypoint: 'default',
      };
      const prepared = await prepareProvider.transferTicket(params);

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'transfer_ticket',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
              ticket_contents: {
                string: 'foobar',
              },
              ticket_ty: {
                prim: 'string',
              },
              ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
              ticket_amount: '2',
              destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
              entrypoint: 'default',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('increasePaidStorage', () => {
    it('should return a prepared increasePaidStorage operation with reveal op', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(estimate);

      const prepared = await prepareProvider.increasePaidStorage({
        amount: 1,
        destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '391',
              public_key: 'test_pub_key',
              source: 'test_public_key_hash',
              gas_limit: '101',
              storage_limit: '1000',
              counter: '1',
            },
            {
              kind: 'increase_paid_storage',
              source: 'test_public_key_hash',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              amount: '1',
              destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare increase_paid_storage op without reveal op when estimate is undefined', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(undefined);

      const prepared = await prepareProvider.increasePaidStorage({
        amount: 1,
        destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'increase_paid_storage',
              source: 'test_public_key_hash',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              amount: '1',
              destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('ballot', () => {
    it('should return a prepared ballot operation', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(estimate);

      const prepared = await prepareProvider.ballot({
        proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
        ballot: 'yay',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              ballot: 'yay',
              kind: 'ballot',
              period: 103,
              proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare ballot operation with the source overridden', async () => {
      const prepared = await prepareProvider.ballot({
        proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
        ballot: 'yay',
        source: 'test_override_source',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'ballot',
              period: 103,
              proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
              ballot: 'yay',
              source: 'test_override_source',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('proposals', () => {
    it('should return a prepared proposals operation', async () => {
      const prepared = await prepareProvider.proposals({
        proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg'],
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'proposals',
              period: 103,
              proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg'],
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare proposals operation with the source overridden', async () => {
      const prepared = await prepareProvider.proposals({
        proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg'],
        source: 'test_override_source',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'proposals',
              period: 103,
              proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg'],
              source: 'test_override_source',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('txRollupOriginate', () => {
    it('should be able to prepare a txRollupOriginate op with reveal op', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(estimate);

      const prepared = await prepareProvider.txRollupOrigination();

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '391',
              public_key: 'test_pub_key',
              source: 'test_public_key_hash',
              gas_limit: '101',
              storage_limit: '1000',
              counter: '1',
            },
            {
              kind: 'tx_rollup_origination',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              source: 'test_public_key_hash',
              tx_rollup_origination: {},
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare a txRollupOriginate op without reveal op when estimate is undefined', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(undefined);

      const prepared = await prepareProvider.txRollupOrigination();

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'tx_rollup_origination',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              source: 'test_public_key_hash',
              tx_rollup_origination: {},
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('txRollupSubmitBatch', async () => {
    it('should be able to prepare a txRollupSubmitBatch op with reveal op', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(estimate);

      const prepared = await prepareProvider.txRollupSubmitBatch({
        content: '1234',
        rollup: 'txr1ckoTVCU3FHdcW4VotdBha6pYCcA3wpCXi',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '391',
              public_key: 'test_pub_key',
              source: 'test_public_key_hash',
              gas_limit: '101',
              storage_limit: '1000',
              counter: '1',
            },
            {
              kind: 'tx_rollup_submit_batch',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              source: 'test_public_key_hash',
              content: '1234',
              rollup: 'txr1ckoTVCU3FHdcW4VotdBha6pYCcA3wpCXi',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare a txRollupSubmitBatch op without reveal op when estimate is undefined', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(undefined);

      const prepared = await prepareProvider.txRollupSubmitBatch({
        content: '1234',
        rollup: 'txr1ckoTVCU3FHdcW4VotdBha6pYCcA3wpCXi',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'tx_rollup_submit_batch',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              source: 'test_public_key_hash',
              content: '1234',
              rollup: 'txr1ckoTVCU3FHdcW4VotdBha6pYCcA3wpCXi',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('smartRollupAddMessages', () => {
    it('should be able to prepare a smartRollupAddMessages operation', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(estimate);

      const prepared = await prepareProvider.smartRollupAddMessages({
        message: [
          '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
        ],
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '391',
              public_key: 'test_pub_key',
              source: 'test_public_key_hash',
              gas_limit: '101',
              storage_limit: '1000',
              counter: '1',
            },
            {
              kind: 'smart_rollup_add_messages',
              source: 'test_public_key_hash',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              message: [
                '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              ],
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare smartRollupAddMessages op without reveal when estimate is undefined', async () => {
      jest.spyOn(context.estimate, 'reveal').mockResolvedValue(undefined);

      const prepared = await prepareProvider.smartRollupAddMessages({
        message: [
          '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
        ],
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'smart_rollup_add_messages',
              source: 'test_public_key_hash',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              message: [
                '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              ],
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('batch', () => {
    it('should be able to prepare a batch operation', async () => {
      jest.spyOn(context.estimate, 'batch').mockResolvedValue([estimate, estimate, estimate]);

      const prepared = await prepareProvider.batch([
        {
          kind: OpKind.TRANSACTION,
          to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
          amount: 2,
        },
        {
          kind: OpKind.TRANSACTION,
          to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: 2,
        },
      ]);

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '391',
              public_key: 'test_pub_key',
              source: 'test_public_key_hash',
              gas_limit: '101',
              storage_limit: '1000',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              amount: '2000000',
              destination: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
              source: 'test_public_key_hash',
              counter: '2',
            },
            {
              kind: 'transaction',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              amount: '2000000',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              source: 'test_public_key_hash',
              counter: '3',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare a batch operation', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      jest.spyOn(context.estimate, 'batch').mockResolvedValue([estimate, estimate]);

      const prepared = await prepareProvider.batch([
        {
          kind: OpKind.TRANSACTION,
          to: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
          amount: 2,
        },
        {
          kind: OpKind.TRANSACTION,
          to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: 2,
        },
      ]);

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'transaction',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              amount: '2000000',
              destination: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
              source: 'test_public_key_hash',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              amount: '2000000',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              source: 'test_public_key_hash',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('SmartRollupOriginate', () => {
    it('Should prepare smartRollupOriginate without reveal', async (done) => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);
      mockRpcClient.getOriginationProof.mockResolvedValue('987654321');

      jest.spyOn(context.estimate, 'smartRollupOriginate').mockResolvedValue(estimate);

      const prepared = await prepareProvider.smartRollupOriginate({
        pvmKind: PvmKind.WASM2,
        kernel: '123456789',
        parametersType: {
          prim: 'bytes',
        },
      });
      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'smart_rollup_originate',
              pvm_kind: 'wasm_2_0_0',
              kernel: '123456789',
              origination_proof: '987654321',
              parameters_ty: {
                prim: 'bytes',
              },
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              counter: '1',
              source: 'test_public_key_hash',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
      done();
    });
  });
});
