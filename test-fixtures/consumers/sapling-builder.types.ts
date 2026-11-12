/// <reference types="node" />
import { SaplingTransactionBuilder, SaplingForger, InMemorySpendingKey } from '@taquito/sapling';
import { RpcClient } from '@taquito/rpc';
import { RpcReadAdapter } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

declare const saplingSigner: InMemorySpendingKey;
const builder = new SaplingTransactionBuilder(
  { saplingSigner },
  new SaplingForger(),
  { contractAddress: 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC', memoSize: 8 },
  new RpcReadAdapter(new RpcClient('https://example.invalid'))
);
const amount = new BigNumber(1);
const boundData = Buffer.from('050a00000000', 'hex');
void builder.createShieldedTx([], amount, boundData);
void builder.createSaplingTx([], amount, boundData, {
  inputsToSpend: [],
  sumSelectedInputs: amount,
});
