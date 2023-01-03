import { Context } from '../../src/context';
import { PrepareProvider } from '../../src/prepare/prepare-provider';
import {
  drainDelegateOp,
  originationOp,
  transactionOp,
  delegateOp,
  registerGlobalConstantOp,
  updateConsensusKeyOp,
  increasePaidStorageOp,
  ballotOp,
  proposalsOp,
  transferTicketOp,
  revealOp,
  preparedOriginationOp,
  preparedOriginationOpWithReveal,
} from './data';

describe('PrepareProvider test', () => {
  let prepareProvider: PrepareProvider;

  let mockReadProvider: {
    getBlockHash: jest.Mock<any, any>;
    getNextProtocol: jest.Mock<any, any>;
    getCounter: jest.Mock<any, any>;
  };

  let mockRpcClient: {
    getBlockHeader: jest.Mock<any, any>;
    getProtocols: jest.Mock<any, any>;
    getContract: jest.Mock<any, any>;
    getCurrentPeriod: jest.Mock<any, any>;
  };

  let mockSigner: {
    publicKeyHash: jest.Mock<any, any>;
  };

  beforeEach(() => {
    mockReadProvider = {
      getBlockHash: jest.fn(),
      getNextProtocol: jest.fn(),
      getCounter: jest.fn(),
    };

    mockRpcClient = {
      getBlockHeader: jest.fn(),
      getProtocols: jest.fn(),
      getContract: jest.fn(),
      getCurrentPeriod: jest.fn(),
    };

    mockSigner = {
      publicKeyHash: jest.fn(),
    };

    mockRpcClient.getContract.mockResolvedValue({
      counter: 0,
      script: {
        code: [],
        storage: 'sampleStorage',
      },
    });

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

    mockSigner.publicKeyHash.mockResolvedValue('test_public_key_hash');

    mockReadProvider.getBlockHash.mockResolvedValue('test_block_hash');
    mockReadProvider.getNextProtocol.mockResolvedValue('test_protocol');
    mockReadProvider.getCounter.mockResolvedValue('0');

    const context = new Context(mockRpcClient as any, mockSigner as any);
    context.readProvider = mockReadProvider as any;

    prepareProvider = new PrepareProvider(context);
  });

  describe('originate', () => {
    it('should return a prepared Origination operation', async () => {
      const prepared = await prepareProvider.originate({ operation: originationOp });

      expect(prepared).toEqual(preparedOriginationOp);
    });

    it('should throw an error if parameters does not have related operation kind to the method', async () => {
      try {
        await prepareProvider.originate({ operation: transactionOp });
      } catch (e) {
        expect(e.message).toEqual(`No 'origination' operation parameters have been passed`);
      }
    });

    it('should be able to prepare operation prepended with reveal op', async () => {
      const prepared = await prepareProvider.originate({ operation: [revealOp, originationOp] });

      expect(prepared).toBeDefined();
      expect(prepared).toEqual(preparedOriginationOpWithReveal);
    });
  });

  describe('transaction', () => {
    it('should return a prepared Transaction operation', async () => {
      const prepared = await prepareProvider.transaction({ operation: transactionOp });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'transaction',
              fee: '1',
              gas_limit: '2',
              storage_limit: '2',
              amount: '5',
              destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
              source: 'test_public_key_hash',
              counter: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should throw error if params does not include transaction operation', async () => {
      try {
        await prepareProvider.transaction({ operation: originationOp });
      } catch (e) {
        expect(e.message).toEqual(`No 'transaction' operation parameters have been passed`);
      }
    });

    it('should be able to prepare transaction operation prepended with reveal op', async () => {
      const prepared = await prepareProvider.transaction({ operation: [revealOp, transactionOp] });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '374',
              public_key: 'test_public_key',
              source: 'test_pkh_reveal',
              gas_limit: '1100',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'transaction',
              fee: '1',
              gas_limit: '2',
              storage_limit: '2',
              amount: '5',
              destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
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

  describe('drainDelegate', () => {
    it('should return a prepared drainDelegate operation', async () => {
      const prepared = await prepareProvider.drainDelegate({ operation: drainDelegateOp });
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

    it('should throw an error if paramaters does not include a drain_delegate operation', async () => {
      try {
        await prepareProvider.drainDelegate({ operation: transactionOp });
      } catch (e) {
        expect(e.message).toEqual(`No 'drain_delegate' operation parameters have been passed`);
      }
    });

    it('should be able to prepare drain_delegate operation prepended with reveal op', async () => {
      const prepared = await prepareProvider.drainDelegate({
        operation: [revealOp, drainDelegateOp],
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '374',
              public_key: 'test_public_key',
              source: 'test_pkh_reveal',
              gas_limit: '1100',
              storage_limit: '0',
              counter: '1',
            },
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
    it('should return a prepared delegation operation', async () => {
      const prepared = await prepareProvider.delegation({ operation: delegateOp });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              counter: '1',
              delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
              fee: '2',
              gas_limit: '1',
              kind: 'delegation',
              source: 'test_public_key_hash',
              storage_limit: '1',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should throw an error when params do not include a delegation operation', async () => {
      try {
        await prepareProvider.delegation({ operation: transactionOp });
      } catch (e) {
        expect(e.message).toEqual(`No 'delegation' operation parameters have been passed`);
      }
    });

    it('should be able to prepare delegate operation prepended with reveal op', async () => {
      const prepared = await prepareProvider.delegation({ operation: [revealOp, delegateOp] });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '374',
              public_key: 'test_public_key',
              source: 'test_pkh_reveal',
              gas_limit: '1100',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'delegation',
              fee: '2',
              gas_limit: '1',
              storage_limit: '1',
              delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
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

  describe('registerGlobalConstant', () => {
    it('should return a prepared registerGlobalConstant operation', async () => {
      const prepared = await prepareProvider.registerGlobalConstant({
        operation: registerGlobalConstantOp,
      });
      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              counter: '1',
              fee: '1',
              gas_limit: '1',
              kind: 'register_global_constant',
              source: 'test_public_key_hash',
              storage_limit: '2',
              value: {
                args: [
                  {
                    int: '999',
                  },
                  {
                    int: '999',
                  },
                ],
                prim: 'Pair',
              },
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    it('should throw error when params does not include a registerGlobalConstant operation', async () => {
      try {
        await prepareProvider.registerGlobalConstant({ operation: transactionOp });
      } catch (e) {
        expect(e.message).toEqual(
          `No 'register_global_constant' operation parameters have been passed`
        );
      }
    });

    it('should be able to prepare register_global_constant operation prepended with reveal op', async () => {
      const prepared = await prepareProvider.registerGlobalConstant({
        operation: [revealOp, registerGlobalConstantOp],
      });

      expect(prepared).toEqual({
        opOb: {
          branch: 'test_block_hash',
          contents: [
            {
              kind: 'reveal',
              fee: '374',
              public_key: 'test_public_key',
              source: 'test_pkh_reveal',
              gas_limit: '1100',
              storage_limit: '0',
              counter: '1',
            },
            {
              kind: 'register_global_constant',
              fee: '1',
              gas_limit: '1',
              storage_limit: '2',
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
              source: 'test_public_key_hash',
              counter: '2',
            },
          ],
          protocol: 'test_protocol',
        },
        counter: 0,
      });
    });

    describe('updateConsensusKey', () => {
      it('should return a prepared udpateConsensusKey operation', async () => {
        const prepared = await prepareProvider.updateConsensusKey({
          operation: updateConsensusKeyOp,
        });

        expect(prepared).toEqual({
          opOb: {
            branch: 'test_block_hash',
            contents: [
              {
                counter: '1',
                fee: '1',
                gas_limit: '1',
                kind: 'update_consensus_key',
                pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
                source: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
                storage_limit: '2',
              },
            ],
            protocol: 'test_protocol',
          },
          counter: 0,
        });
      });

      it('should throw error when params does not include an updateConsensusKey operation', async () => {
        try {
          await prepareProvider.updateConsensusKey({ operation: transactionOp });
        } catch (e) {
          expect(e.message).toEqual(
            `No 'update_consensus_key' operation parameters have been passed`
          );
        }
      });

      it('should be able to prepare update_consensus_key operation prepended with reveal op', async () => {
        const prepared = await prepareProvider.updateConsensusKey({
          operation: [revealOp, updateConsensusKeyOp],
        });

        expect(prepared).toEqual({
          opOb: {
            branch: 'test_block_hash',
            contents: [
              {
                kind: 'reveal',
                fee: '374',
                public_key: 'test_public_key',
                source: 'test_pkh_reveal',
                gas_limit: '1100',
                storage_limit: '0',
                counter: '1',
              },
              {
                kind: 'update_consensus_key',
                source: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
                fee: '1',
                gas_limit: '1',
                storage_limit: '2',
                pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
                counter: '2',
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
        const prepared = await prepareProvider.transferTicket({ operation: transferTicketOp });

        expect(prepared).toEqual({
          opOb: {
            branch: 'test_block_hash',
            contents: [
              {
                counter: '1',
                destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
                entrypoint: 'default',
                fee: '804',
                gas_limit: '5009',
                kind: 'transfer_ticket',
                source: 'test_public_key_hash',
                storage_limit: '130',
                ticket_amount: '2',
                ticket_contents: {
                  string: 'foobar',
                },
                ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
                ticket_ty: {
                  prim: 'string',
                },
              },
            ],
            protocol: 'test_protocol',
          },
          counter: 0,
        });
      });

      it('should throw error when params does not include a transferTicket operation', async () => {
        try {
          await prepareProvider.transferTicket({ operation: transactionOp });
        } catch (e) {
          expect(e.message).toEqual(`No 'transfer_ticket' operation parameters have been passed`);
        }
      });

      it('should be able to prepare transfer_ticket operation prepended with reveal op', async () => {
        const prepared = await prepareProvider.transferTicket({
          operation: [revealOp, transferTicketOp],
        });

        expect(prepared).toEqual({
          opOb: {
            branch: 'test_block_hash',
            contents: [
              {
                kind: 'reveal',
                fee: '374',
                public_key: 'test_public_key',
                source: 'test_pkh_reveal',
                gas_limit: '1100',
                storage_limit: '0',
                counter: '1',
              },
              {
                kind: 'transfer_ticket',
                fee: '804',
                gas_limit: '5009',
                storage_limit: '130',
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

    describe('increasePaidStorage', () => {
      it('should return a prepared increasePaidStorage operation', async () => {
        const prepared = await prepareProvider.increasePaidStorage({
          operation: increasePaidStorageOp,
        });

        expect(prepared).toEqual({
          opOb: {
            branch: 'test_block_hash',
            contents: [
              {
                amount: '10',
                counter: '1',
                destination: 'KT1Vjr5PFC2Qm5XbSQZ8MdFZLgYMzwG5WZNh',
                fee: '1',
                gas_limit: '1',
                kind: 'increase_paid_storage',
                source: 'test_public_key_hash',
                storage_limit: '2',
              },
            ],
            protocol: 'test_protocol',
          },
          counter: 0,
        });
      });

      it('should throw error when params does not include an increasePaidStorage operation', async () => {
        try {
          await prepareProvider.increasePaidStorage({ operation: transactionOp });
        } catch (e) {
          expect(e.message).toEqual(
            `No 'increase_paid_storage' operation parameters have been passed`
          );
        }
      });

      it('should be able to prepare increase_paid_storage operation prepended with reveal op', async () => {
        const prepared = await prepareProvider.increasePaidStorage({
          operation: [revealOp, increasePaidStorageOp],
        });

        expect(prepared).toEqual({
          opOb: {
            branch: 'test_block_hash',
            contents: [
              {
                kind: 'reveal',
                fee: '374',
                public_key: 'test_public_key',
                source: 'test_pkh_reveal',
                gas_limit: '1100',
                storage_limit: '0',
                counter: '1',
              },
              {
                kind: 'increase_paid_storage',
                fee: '1',
                gas_limit: '1',
                storage_limit: '2',
                amount: '10',
                destination: 'KT1Vjr5PFC2Qm5XbSQZ8MdFZLgYMzwG5WZNh',
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

    describe('ballot', () => {
      it('should return a prepared ballot operation', async () => {
        const prepared = await prepareProvider.ballot({ operation: ballotOp });

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

      it('should throw error when params does not include a ballot operation', async () => {
        try {
          await prepareProvider.ballot({ operation: transactionOp });
        } catch (e) {
          expect(e.message).toEqual(`No 'ballot' operation parameters have been passed`);
        }
      });

      it('should be able to prepare increase_paid_storage operation prepended with reveal op', async () => {
        const prepared = await prepareProvider.ballot({ operation: [revealOp, ballotOp] });

        expect(prepared).toEqual({
          opOb: {
            branch: 'test_block_hash',
            contents: [
              {
                kind: 'reveal',
                fee: '374',
                public_key: 'test_public_key',
                source: 'test_pkh_reveal',
                gas_limit: '1100',
                storage_limit: '0',
                counter: '1',
              },
              {
                kind: 'ballot',
                period: 103,
                proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
                ballot: 'yay',
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
        const prepared = await prepareProvider.proposals({ operation: proposalsOp });

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

      it('should throw error when params does not include a proposals operation', async () => {
        try {
          await prepareProvider.proposals({ operation: transactionOp });
        } catch (e) {
          expect(e.message).toEqual(`No 'proposals' operation parameters have been passed`);
        }
      });

      it('should be able to prepare proposals operation prepended with reveal op', async () => {
        const prepared = await prepareProvider.proposals({ operation: [revealOp, proposalsOp] });

        expect(prepared).toEqual({
          opOb: {
            branch: 'test_block_hash',
            contents: [
              {
                kind: 'reveal',
                fee: '374',
                public_key: 'test_public_key',
                source: 'test_pkh_reveal',
                gas_limit: '1100',
                storage_limit: '0',
                counter: '1',
              },
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
    });
  });
});
