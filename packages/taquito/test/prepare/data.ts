import { MichelsonData, MichelsonContractStorage } from '@taquito/michel-codec';
import {
  RPCDelegateOperation,
  RPCDrainDelegateOperation,
  RPCOriginationOperation,
  RPCTransferOperation,
} from '../../src/operations';
import { OpKind } from '@taquito/rpc';
import {
  RPCBallotOperation,
  RPCIncreasePaidStorageOperation,
  RPCProposalsOperation,
  RPCRegisterGlobalConstantOperation,
  RPCTransferTicketOperation,
  RPCTxRollupBatchOperation,
  RPCTxRollupOriginationOperation,
  RPCUpdateConsensusKeyOperation,
} from '../../src/operations/types';

export const sampleContract: MichelsonContractStorage = {
  prim: 'storage',
  args: [
    {
      prim: 'pair',
      args: [
        {
          prim: 'big_map',
          args: [
            { prim: 'address' },
            {
              prim: 'pair',
              args: [
                { prim: 'nat' },
                { prim: 'map', args: [{ prim: 'address' }, { prim: 'nat' }] },
              ],
            },
          ],
        },
        {
          prim: 'pair',
          args: [{ prim: 'address' }, { prim: 'pair', args: [{ prim: 'bool' }, { prim: 'nat' }] }],
        },
      ],
    },
  ],
};

export const sampleStorage: MichelsonData = {
  prim: 'Pair',
  args: [
    [],
    {
      prim: 'Pair',
      args: [
        { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' },
        { prim: 'Pair', args: [{ prim: 'False' }, { int: '200' }] },
      ],
    },
  ],
};

export const originationOp = {
  kind: OpKind.ORIGINATION,
  fee: 1,
  gas_limit: 2,
  storage_limit: 2,
  balance: '100',
  script: {
    code: [sampleContract],
    storage: sampleStorage,
  },
} as RPCOriginationOperation;

export const transactionOp = {
  kind: OpKind.TRANSACTION,
  fee: 1,
  gas_limit: 2,
  storage_limit: 2,
  amount: '5',
  destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
} as RPCTransferOperation;

export const drainDelegateOp = {
  kind: OpKind.DRAIN_DELEGATE,
  consensus_key: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
  delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
  destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
} as RPCDrainDelegateOperation;

export const delegateOp = {
  kind: OpKind.DELEGATION,
  fee: 2,
  gas_limit: 1,
  storage_limit: 1,
  delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
} as RPCDelegateOperation;

export const registerGlobalConstantOp = {
  kind: OpKind.REGISTER_GLOBAL_CONSTANT,
  fee: 1,
  gas_limit: 1,
  storage_limit: 2,
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
} as RPCRegisterGlobalConstantOperation;

export const txRollupOriginationOp = {} as RPCTxRollupOriginationOperation;

export const txRollupSubmitBatch = {} as RPCTxRollupBatchOperation;

export const UpdateConsensusKeyOp = {
  kind: OpKind.UPDATE_CONSENSUS_KEY,
  source: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
  fee: 1,
  gas_limit: 1,
  storage_limit: 2,
  pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
} as RPCUpdateConsensusKeyOperation;

export const transferTicketOp = {} as RPCTransferTicketOperation;

export const increasePaidStorageOp = {
  kind: OpKind.INCREASE_PAID_STORAGE,
  fee: 1,
  gas_limit: 1,
  storage_limit: 2,
  amount: 10,
  destination: 'KT1Vjr5PFC2Qm5XbSQZ8MdFZLgYMzwG5WZNh',
} as RPCIncreasePaidStorageOperation;

export const ballotOp = {
  proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
  ballot: 'yay',
} as RPCBallotOperation;

export const proposalsOp = {
  proposals: ['PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg'],
} as RPCProposalsOperation;
