import { SaplingToolkit, InMemorySpendingKey } from '@taquito/sapling';
import { RpcClient } from '@taquito/rpc';
import { RpcReadAdapter } from '@taquito/taquito';

declare const saplingSigner: InMemorySpendingKey;
const readProvider = new RpcReadAdapter(new RpcClient('https://example.invalid'));
const keys = { saplingSigner };
const contract = { contractAddress: 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC', memoSize: 8 };

new SaplingToolkit(keys, contract, readProvider);
new SaplingToolkit(keys, { ...contract, outputOrder: 'preserve' }, readProvider);
new SaplingToolkit(keys, { ...contract, outputOrder: 'randomized' }, readProvider);
// @ts-expect-error Unknown policies must fail for a public consumer.
new SaplingToolkit(keys, { ...contract, outputOrder: 'random' }, readProvider);
