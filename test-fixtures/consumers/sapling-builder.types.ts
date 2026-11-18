import {
  SaplingTransactionBuilder,
  SaplingForger,
  InMemorySpendingKey,
  type Input,
  type SaplingTransactionParams,
  type SaplingContractDetails,
  type SaplingTransaction,
  type SaplingTransactionInputSelection,
} from '@taquito/sapling';
import { RpcClient } from '@taquito/rpc';
import { RpcReadAdapter } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

declare const saplingSigner: InMemorySpendingKey;
declare const input: Input;
const contract: SaplingContractDetails = {
  contractAddress: 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC',
  memoSize: 8,
};
const forger = new SaplingForger();
const builder = new SaplingTransactionBuilder(
  { saplingSigner },
  forger,
  contract,
  new RpcReadAdapter(new RpcClient('https://example.invalid'))
);
const amount = new BigNumber(1);
const boundData = Uint8Array.of(5, 10, 0, 0, 0, 0);
const outputs: SaplingTransactionParams[] = [];
const chosenInputs: SaplingTransactionInputSelection = {
  inputsToSpend: [input],
  sumSelectedInputs: amount,
};
void builder.createShieldedTx(outputs, amount, boundData);
async function buildTransaction(): Promise<SaplingTransaction> {
  const description = await builder.createSaplingTx(outputs, amount, boundData, chosenInputs);
  const transaction: SaplingTransaction = { ...description, root: '00'.repeat(32), boundData };
  forger.forgeSaplingTransaction(transaction);
  return transaction;
}
void buildTransaction;
