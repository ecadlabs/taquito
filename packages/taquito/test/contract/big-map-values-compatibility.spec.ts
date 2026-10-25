import { it, expect, vi } from 'vitest';
import BigNumber from 'bignumber.js';
import { Schema, MichelsonMap, type MichelsonMapKey } from '@taquito/michelson-encoder';
import { RpcClient } from '@taquito/rpc';
import { HttpResponseError } from '@taquito/http-utils';
import {
  BigMapAbstraction,
  TezosToolkit,
  RpcReadAdapter,
  type StorageProvider,
} from '../../src/taquito';
const schema = new Schema({ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'nat' }] });
const unexpected = async () => {
  throw new Error('Unexpected fixture request');
};
const legacyProvider = {
  getStorage: unexpected,
  getBigMapKeyByID: async () => {
    throw new HttpResponseError('missing', 404, 'Not Found', 'missing', 'http://fixture.invalid');
  },
  getBigMapKeysByID: async () => new MichelsonMap<MichelsonMapKey, never>(),
  getSaplingDiffByID: unexpected,
} satisfies StorageProvider;
it('keeps old storage implementations usable without page capability', async () => {
  const map = new BigMapAbstraction(new BigNumber(123), schema, legacyProvider);
  expect(await map.get('missing')).toBeUndefined();
  expect((await map.getMultipleValues([])).size).toBe(0);
  expect(map.toJSON()).toBe('123');
  expect(map.toString()).toBe('123');
});
it('retains live single-key routing rather than adding block resolution to old reads', async () => {
  const toolkit = new TezosToolkit('http://127.0.0.1:1');
  const reader = new RpcReadAdapter(new RpcClient('http://127.0.0.1:1'));
  const key = vi.spyOn(reader, 'getBigMapValue').mockResolvedValue({ int: '42' });
  const hash = vi.spyOn(reader, 'getBlockHash');
  toolkit.setReadProvider(reader);
  toolkit.setPackerProvider({ packData: async () => ({ packed: '0501000000016b' }) });
  const map = new BigMapAbstraction(new BigNumber(123), schema, toolkit.contract);
  expect((await map.get<BigNumber>('k'))?.toFixed()).toBe('42');
  expect(key).toHaveBeenCalledWith(expect.objectContaining({ id: '123' }), 'head');
  expect(hash).not.toHaveBeenCalled();
});
