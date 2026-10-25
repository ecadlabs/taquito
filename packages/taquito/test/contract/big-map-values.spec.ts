import { HttpResponseError } from '@taquito/http-utils';
import { UnsupportedActionError } from '@taquito/core';
import { it, expect, vi } from 'vitest';
import BigNumber from 'bignumber.js';
import { Schema, MichelsonMap, type Semantic } from '@taquito/michelson-encoder';
import { RpcClient, type BigMapPagination, type MichelsonV1Expression } from '@taquito/rpc';
import { TezosToolkit, RpcReadAdapter, BigMapAbstraction } from '../../src/taquito';
import type { BlockIdentifier } from '../../src/read-provider/interface';
const BLOCK = 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX';
class Reader extends RpcReadAdapter {
  constructor() {
    super(new RpcClient('http://127.0.0.1:1'));
  }
  override getBlockHash = vi.fn(async (_block: BlockIdentifier) => BLOCK);
  override getBigMapValues = vi.fn(
    async (
      _id: string,
      _page: BigMapPagination,
      _block: BlockIdentifier
    ): Promise<MichelsonV1Expression[]> => []
  );
}
const schema = new Schema({ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'nat' }] });
it('checks empty maps through one finite value read at an exact block', async () => {
  const toolkit = new TezosToolkit('http://127.0.0.1:1');
  const reader = new Reader();
  toolkit.setReadProvider(reader);
  const map = new BigMapAbstraction(new BigNumber(123), schema, toolkit.contract);
  expect(await map.isEmpty()).toBe(true);
  expect(reader.getBlockHash).toHaveBeenCalledExactlyOnceWith('head');
  expect(reader.getBigMapValues).toHaveBeenCalledExactlyOnceWith(
    '123',
    { offset: 0, length: 1 },
    BLOCK
  );
});

const make = (reader = new Reader(), selectedSchema = schema, block?: BlockIdentifier) => {
  const toolkit = new TezosToolkit('http://127.0.0.1:1');
  toolkit.setReadProvider(reader);
  return {
    toolkit,
    map: new BigMapAbstraction(new BigNumber(123), selectedSchema, toolkit.contract, block),
  };
};
function deferred<T>() {
  let resolve: (value: T) => void = () => undefined;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
it('decodes a finite nat page and exposes a reusable exact hash', async () => {
  const reader = new Reader();
  reader.getBigMapValues.mockResolvedValue([{ int: '42' }, { int: '7' }]);
  const { map } = make(reader);
  const page = await map.getValuesPage<BigNumber>({ offset: 5, length: 2, block: 42 });
  expect(page.values.map((value) => value.toFixed())).toEqual(['42', '7']);
  expect(page.blockHash).toBe(BLOCK);
  expect(reader.getBlockHash).toHaveBeenCalledExactlyOnceWith(42);
  expect(reader.getBigMapValues).toHaveBeenCalledExactlyOnceWith(
    '123',
    { offset: 5, length: 2 },
    BLOCK
  );
  await map.getValues({ offset: 7, length: 2, block: page.blockHash });
  expect(reader.getBlockHash).toHaveBeenCalledTimes(1);
});
it('preserves the abstraction default block and reports a nonempty map', async () => {
  const reader = new Reader();
  reader.getBigMapValues.mockResolvedValue([{ int: '1' }]);
  const { map } = make(reader, schema, 42);
  expect(await map.isEmpty()).toBe(false);
  expect(reader.getBlockHash).toHaveBeenCalledExactlyOnceWith(42);
});
it('decodes annotated pairs, options and maps with the existing value decoder', async () => {
  const reader = new Reader();
  const pairSchema = new Schema({
    prim: 'big_map',
    args: [
      { prim: 'string' },
      {
        prim: 'pair',
        args: [
          { prim: 'string', annots: ['%name'] },
          { prim: 'option', annots: ['%amount'], args: [{ prim: 'nat' }] },
        ],
      },
    ],
  });
  reader.getBigMapValues.mockResolvedValue([
    { prim: 'Pair', args: [{ string: 'item' }, { prim: 'Some', args: [{ int: '42' }] }] },
  ]);
  const pair = await make(reader, pairSchema).map.getValues();
  expect(pair).toEqual([{ name: 'item', amount: { Some: new BigNumber(42) } }]);
  const mapSchema = new Schema({
    prim: 'big_map',
    args: [{ prim: 'string' }, { prim: 'map', args: [{ prim: 'string' }, { prim: 'nat' }] }],
  });
  reader.getBigMapValues.mockResolvedValue([
    [{ prim: 'Elt', args: [{ string: 'a' }, { int: '7' }] }],
  ]);
  const values = await make(reader, mapSchema).map.getValues<MichelsonMap<string, BigNumber>>();
  expect(values[0]).toBeInstanceOf(MichelsonMap);
  expect(values[0].get('a')?.toFixed()).toBe('7');
});
it.each([404, 403, 502])('keeps HTTP %s visible when checking emptiness', async (status) => {
  const reader = new Reader();
  const error = new HttpResponseError('controlled', status, 'failed', 'body', 'http://rpc.invalid');
  reader.getBigMapValues.mockRejectedValue(error);
  await expect(make(reader).map.isEmpty()).rejects.toBe(error);
});
it.each([
  { offset: -1 },
  { offset: 1.5 },
  { offset: Number.MAX_SAFE_INTEGER + 1 },
  { length: 0 },
  { length: 1001 },
  { length: NaN },
])('rejects invalid high-level pagination %# before reading', async (options) => {
  const reader = new Reader();
  await expect(make(reader).map.getValues(options)).rejects.toBeInstanceOf(RangeError);
  expect(reader.getBlockHash).not.toHaveBeenCalled();
  expect(reader.getBigMapValues).not.toHaveBeenCalled();
});
it('rejects an invalid hash and an overlength page instead of returning empty', async () => {
  const reader = new Reader();
  reader.getBlockHash.mockResolvedValueOnce('invalid');
  await expect(make(reader).map.isEmpty()).rejects.toThrow();
  expect(reader.getBigMapValues).not.toHaveBeenCalled();
  reader.getBigMapValues.mockResolvedValue([{ int: '1' }, { int: '2' }]);
  await expect(make(reader).map.isEmpty()).rejects.toThrow('overlength');
});
it('does not bypass an unsupported selected read provider', async () => {
  const reader = new Reader();
  Object.defineProperty(reader, 'getBigMapValues', { value: undefined });
  await expect(make(reader).map.isEmpty()).rejects.toBeInstanceOf(UnsupportedActionError);
  expect(reader.getBlockHash).not.toHaveBeenCalled();
});
it('keeps a pending page on its captured provider when block resolution is delayed', async () => {
  const original = new Reader();
  const replacement = new Reader();
  const ready = deferred<string>();
  original.getBlockHash.mockReturnValueOnce(ready.promise);
  original.getBigMapValues.mockResolvedValue([{ int: '42' }]);
  replacement.getBigMapValues.mockResolvedValue([{ int: '99' }]);
  const { toolkit, map } = make(original);
  const pending = map.getValues<BigNumber>();
  toolkit.setReadProvider(replacement);
  ready.resolve(BLOCK);
  expect((await pending)[0].toFixed()).toBe('42');
  expect(replacement.getBigMapValues).not.toHaveBeenCalled();
  expect(original.getBigMapValues).toHaveBeenCalledWith('123', { offset: 0, length: 100 }, BLOCK);
});
it('keeps a pending page on its captured provider when the page response is delayed', async () => {
  const original = new Reader();
  const replacement = new Reader();
  const ready = deferred<MichelsonV1Expression[]>();
  original.getBigMapValues.mockReturnValueOnce(ready.promise);
  const { toolkit, map } = make(original);
  const pending = map.getValues<BigNumber>();
  await vi.waitFor(() => expect(original.getBigMapValues).toHaveBeenCalledTimes(1));
  toolkit.setReadProvider(replacement);
  ready.resolve([{ int: '42' }]);
  expect((await pending)[0].toFixed()).toBe('42');
  expect(replacement.getBigMapValues).not.toHaveBeenCalled();
});
it('propagates decoder failures unchanged', async () => {
  const error = new Error('controlled decoder failure');
  class RejectingSchema extends Schema {
    override ExecuteOnBigMapValue() {
      throw error;
    }
  }
  const reader = new Reader();
  reader.getBigMapValues.mockResolvedValue([{ int: '1' }]);
  await expect(make(reader, new RejectingSchema({ prim: 'nat' })).map.getValues()).rejects.toBe(
    error
  );
});

it('does not mistake an empty map value for an empty big map', async () => {
  const reader = new Reader();
  reader.getBigMapValues.mockResolvedValue([[]]);
  const mapSchema = new Schema({
    prim: 'big_map',
    args: [{ prim: 'string' }, { prim: 'map', args: [{ prim: 'string' }, { prim: 'nat' }] }],
  });
  expect(await make(reader, mapSchema).map.isEmpty()).toBe(false);
});
it('keeps provider and block for a synthetic semantic abstraction after decoding', async () => {
  // Instrument the public semantic callback. This is not an on-chain nested-big-map fixture.
  class SyntheticSemanticSchema extends Schema {
    override ExecuteOnBigMapValue(_value: unknown, semantics?: Semantic): BigMapAbstraction {
      if (!semantics?.big_map) throw new Error('Missing semantic callback');
      return semantics.big_map(
        { int: '456' },
        { prim: 'big_map', args: [{ prim: 'string' }, { prim: 'nat' }] }
      );
    }
  }
  const original = new Reader();
  original.getBigMapValues.mockResolvedValue([{ int: '1' }]);
  const originalKey = vi.spyOn(original, 'getBigMapValue').mockResolvedValue({ int: '9' });
  const replacement = new Reader();
  const replacementKey = vi.spyOn(replacement, 'getBigMapValue').mockResolvedValue({ int: '99' });
  const { toolkit, map } = make(
    original,
    new SyntheticSemanticSchema({ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'nat' }] })
  );
  toolkit.setPackerProvider({ packData: async () => ({ packed: '0501000000016b' }) });
  const children = await map.getValues<BigMapAbstraction>();
  toolkit.setReadProvider(replacement);
  expect((await children[0].get<BigNumber>('k'))?.toFixed()).toBe('9');
  expect(originalKey).toHaveBeenCalledWith(expect.objectContaining({ id: '456' }), BLOCK);
  expect(replacementKey).not.toHaveBeenCalled();
});

it.each([
  { entry: {} },
  { entry: { int: 'not-an-integer' } },
  { entry: { bytes: 'zz' } },
  { entry: { string: 42 } },
  { entry: { prim: 'Some', args: [] } },
])('rejects malformed Micheline page entries from custom readers %#', async ({ entry }) => {
  const reader = new Reader();
  Object.defineProperty(reader, 'getBigMapValues', { value: async () => [entry] });
  await expect(make(reader).map.getValues()).rejects.toThrow();
});
it('accepts valid lambda sequences and contract literals without changing their decoder', async () => {
  const reader = new Reader();
  const body = [{ prim: 'DROP' }, { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] }];
  reader.getBigMapValues.mockResolvedValue([body]);
  const lambda = new Schema({
    prim: 'big_map',
    args: [{ prim: 'string' }, { prim: 'lambda', args: [{ prim: 'unit' }, { prim: 'nat' }] }],
  });
  expect(await make(reader, lambda).map.getValues()).toEqual([body]);
  const address = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton';
  reader.getBigMapValues.mockResolvedValue([{ string: address }]);
  const contract = new Schema({
    prim: 'big_map',
    args: [{ prim: 'string' }, { prim: 'contract', args: [{ prim: 'unit' }] }],
  });
  expect(await make(reader, contract).map.getValues()).toEqual([address]);
});
it('reports unsupported storage and RPC capabilities without substituting providers', async () => {
  const reader = new Reader();
  const { map, toolkit } = make(reader);
  Object.defineProperty(toolkit.contract, 'getBigMapValuesPageByID', { value: undefined });
  await expect(map.getValues()).rejects.toBeInstanceOf(UnsupportedActionError);
  expect(reader.getBlockHash).not.toHaveBeenCalled();
  const rpc = new RpcClient('http://127.0.0.1:1');
  Object.defineProperty(rpc, 'getBigMapValues', { value: undefined });
  await expect(
    new RpcReadAdapter(rpc).getBigMapValues('123', { length: 1 }, BLOCK)
  ).rejects.toBeInstanceOf(UnsupportedActionError);
});

it('decodes the validated representation rather than discarded extra fields', async () => {
  const reader = new Reader();
  Object.defineProperty(reader, 'getBigMapValues', {
    value: async () => [{ unexpected: 'not-a-number', int: '42' }],
  });
  expect((await make(reader).map.getValues<BigNumber>())[0]?.toFixed()).toBe('42');
});
