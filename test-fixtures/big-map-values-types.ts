import {
  BigMapAbstraction,
  type BigMapValuesOptions,
  type BigMapValuesPage,
  type StorageProvider,
  type TzReadProvider,
  type BlockIdentifier,
} from '@taquito/taquito';
import { RpcClient, type RpcClientInterface } from '@taquito/rpc';
declare const storage: Omit<StorageProvider, 'getBigMapValuesPageByID'>;
declare const reader: Omit<TzReadProvider, 'getBigMapValuesPage'>;
declare const oldRpc: Omit<RpcClientInterface, 'getBigMapValuesPage'>;
const preservedStorage: StorageProvider = storage;
const preservedReader: TzReadProvider = reader;
const preservedRpc: RpcClientInterface = oldRpc;
declare const map: BigMapAbstraction;
const options: BigMapValuesOptions = { offset: 0, length: 10, block: 'head' };
const page: Promise<BigMapValuesPage<string>> = map.getValuesPage<string>(options);
page.then((value) => {
  const block: BlockIdentifier = value.blockHash;
  return map.isEmpty(block);
});
const raw = new RpcClient('https://rpc.invalid').getBigMapValuesPage('123');
void [preservedStorage, preservedReader, preservedRpc, raw];
