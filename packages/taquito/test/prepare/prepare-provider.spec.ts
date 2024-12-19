/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from '../../src/context';
import { PrepareProvider } from '../../src/prepare/prepare-provider';
import BigNumber from 'bignumber.js';
import { preparedOriginationOpWithReveal, preparedOriginationOpNoReveal } from './data';

import { TransferTicketParams, OpKind } from '../../src/operations/types';
import { PvmKind } from '@taquito/rpc';
import { preparedTransactionMock } from '../helpers';
import { PreparedOperation } from '../../src/prepare';

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
    getSpendable: jest.Mock<any, any>;
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
    forgeOperations: jest.Mock<any, any>;
  };

  let mockSigner: {
    publicKeyHash: jest.Mock<any, any>;
    publicKey: jest.Mock<any, any>;
    sign: jest.Mock<any, any>;
  };

  let context: Context;

  beforeEach(() => {
    mockReadProvider = {
      getBlockHash: jest.fn(),
      getNextProtocol: jest.fn(),
      getCounter: jest.fn(),
      getProtocolConstants: jest.fn(),
      getBalance: jest.fn(),
      getSpendable: jest.fn(),
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
      forgeOperations: jest.fn(),
    };

    mockSigner = {
      publicKeyHash: jest.fn(),
      publicKey: jest.fn(),
      sign: jest.fn(),
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

    mockSigner.publicKeyHash.mockResolvedValue('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM');
    mockSigner.publicKey.mockResolvedValue('test_pub_key');

    mockReadProvider.getBlockHash.mockResolvedValue('test_block_hash');
    mockReadProvider.getNextProtocol.mockResolvedValue('test_protocol');
    mockReadProvider.getCounter.mockResolvedValue('0');

    context = new Context(mockRpcClient as any, mockSigner as any);
    context.readProvider = mockReadProvider as any;

    context.forger = mockForger;

    prepareProvider = new PrepareProvider(context);
  });

  describe('activate', () => {
    it('should return a prepared activation operation', async () => {
      const prepared = await prepareProvider.activate({
        pkh: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        secret: '123',
      });

      expect(prepared).toEqual({
        counter: 0,
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'activate_account',
              pkh: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              secret: '123',
            },
          ],
          protocol: 'test_protocol',
        },
      });
    });
  });

  describe('originate', () => {
    it('should return a prepared origination operation with a reveal operation', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

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

    it('should be able to prepare origination op without reveal op', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

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
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

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
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '2000000',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
              parameters: undefined,
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare transaction op without reveal op when estimate returns undefined', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

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
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '2000000',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('stake', () => {
    it('should return a prepared stake pseudo operation with a reveal op', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

      const prepared = await prepareProvider.stake({
        amount: 1000000000,
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '1000000000000000',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'stake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should return a prepared stake pseudo operation without a reveal op', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const prepared = await prepareProvider.stake({
        amount: 1000000000,
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'transaction',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '1000000000000000',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'stake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('finalize_unstake', () => {
    it('should return an unstake pseudo operation with a reveal op', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

      const prepared = await prepareProvider.unstake({
        amount: 9999,
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '9999000000',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'unstake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should return an unstake pseudo operation without a reveal op', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const prepared = await prepareProvider.unstake({
        amount: 9999,
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'transaction',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '9999000000',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'unstake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('finalize_unstake', () => {
    it('should return a prepared finalize_unstake pseudo operation with a reveal op', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

      const prepared = await prepareProvider.finalizeUnstake({});

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '0',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'finalize_unstake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should return a prepared finalize_unstake pseudo operation without a reveal op', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const prepared = await prepareProvider.finalizeUnstake({});

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'transaction',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '0',
              destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              parameters: {
                entrypoint: 'finalize_unstake',
                value: {
                  prim: 'Unit',
                },
              },
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
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
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

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
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

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
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'delegation',
              source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
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
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

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
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
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
    it('should return a prepared registerGlobalConstant operation with reveal', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

      const prepared = await prepareProvider.registerGlobalConstant({
        value: { prim: 'Pair', args: [{ int: '999' }, { int: '999' }] },
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
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
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare register_global_constant op without reveal', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

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
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
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
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

      const prepared = await prepareProvider.updateConsensusKey({
        pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'update_consensus_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
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
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const prepared = await prepareProvider.updateConsensusKey({
        pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'update_consensus_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
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
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
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
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transfer_ticket',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
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
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const params: TransferTicketParams = {
        source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
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
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
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

    it('should be able to prepare transfer_ticket op with estimates overriden', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

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
              fee: '804',
              gas_limit: '5009',
              storage_limit: '130',
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
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

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
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'increase_paid_storage',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
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
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

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
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
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

  describe('smartRollupAddMessages', () => {
    it('should be able to prepare a smartRollupAddMessages operation', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

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
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'smart_rollup_add_messages',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
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
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

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
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
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
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

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
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '2000000',
              destination: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
              parameters: undefined,
            },
            {
              kind: 'transaction',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '2000000',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '3',
              parameters: undefined,
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare a batch operation', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

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
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '2000000',
              destination: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              amount: '2000000',
              destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('toPreapply should forge, sign forged bytes and return the PreapplyParams object', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);
      mockSigner.sign.mockResolvedValue({
        sig: '',
        bytes: '',
        prefixSig:
          'spsig18HJsGY8pVAeHNHE7hURPsFfkGGBuH7cVifwabCAby2iN5R5ckNUqWfPBr8KxwUMJfrug1DZS1fjGzyemWDgukbAeRpwUe',
        sbytes: '',
      });

      const { contents, branch, protocol } = preparedTransactionMock.opOb;

      const result = await prepareProvider.toPreapply(preparedTransactionMock);
      expect(result).toEqual([
        {
          contents,
          branch,
          protocol,
          signature:
            'spsig18HJsGY8pVAeHNHE7hURPsFfkGGBuH7cVifwabCAby2iN5R5ckNUqWfPBr8KxwUMJfrug1DZS1fjGzyemWDgukbAeRpwUe',
        },
      ]);
    });

    it('toForge should return the ForgeParams that can be forged', async () => {
      mockRpcClient.forgeOperations.mockResolvedValue('1234');
      const { contents, branch } = preparedTransactionMock.opOb;

      const result = prepareProvider.toForge(preparedTransactionMock as PreparedOperation);
      expect(result).toEqual({
        contents,
        branch,
      });
      const forged = await prepareProvider.rpc.forgeOperations(result);
      expect(forged).toEqual('1234');
    });
  });

  describe('smartRollupOriginate', () => {
    it('Should prepare smartRollupOriginate without reveal', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

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
              parameters_ty: {
                prim: 'bytes',
              },
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              counter: '1',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('Should prepare smartRollupOriginate with reveal', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

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
              kind: 'reveal',
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'smart_rollup_originate',
              pvm_kind: 'wasm_2_0_0',
              kernel: '123456789',
              parameters_ty: {
                prim: 'bytes',
              },
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              counter: '2',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });

  describe('smartRollupExecuteOutboxMessage', () => {
    it('should be able to prepare smartRollupExecuteOutboxMessage op without reveal', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(true);

      const prepared = await prepareProvider.smartRollupExecuteOutboxMessage({
        rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
        cementedCommitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
        outputProof:
          '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736162555f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'smart_rollup_execute_outbox_message',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
              cemented_commitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
              output_proof:
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736162555f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should be able to prepare a smartRollupExecuteOutboxMessage operation with reveal', async () => {
      mockReadProvider.isAccountRevealed.mockResolvedValue(false);

      const prepared = await prepareProvider.smartRollupExecuteOutboxMessage({
        rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
        cementedCommitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
        outputProof:
          '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736162555f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '331',
              public_key: 'test_pub_key',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              gas_limit: '625',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'smart_rollup_execute_outbox_message',
              source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
              fee: '0',
              gas_limit: '1040000',
              storage_limit: '60000',
              rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
              cemented_commitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
              output_proof:
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736162555f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });
  });
});
