import { HttpResponseError } from '@taquito/http-utils';
import { InvalidBigMapParameterError, UnsupportedActionError } from '@taquito/core';
import { afterEach, it, expect, vi } from 'vitest';
import BigNumber from 'bignumber.js';
import { Schema, MichelsonMap, type Semantic } from '@taquito/michelson-encoder';
import {
  RpcClient,
  InvalidBigMapParameterError as RpcInvalidBigMapParameterError,
  UnsupportedActionError as RpcUnsupportedActionError,
  type BigMapPagination,
  type MichelsonV1Expression,
} from '@taquito/rpc';
import {
  TezosToolkit,
  RpcReadAdapter,
  BigMapAbstraction,
  InvalidBigMapParameterError as TaquitoInvalidBigMapParameterError,
  UnsupportedActionError as TaquitoUnsupportedActionError,
} from '../../src/taquito';
import { RPCResponseError } from '../../src/errors';
import type { BlockIdentifier } from '../../src/read-provider/interface';
import type { BigMapValuesOptions } from '../../src/contract/interface';
const BLOCK = 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX';
class Reader extends RpcReadAdapter {
  constructor() {
    super(new RpcClient('http://127.0.0.1:1'));
  }
  override getBlockHash = vi.fn(async (_block: BlockIdentifier) => BLOCK);
  override getBigMapValuesPage = vi.fn(
    async (
      _id: string,
      _page: BigMapPagination,
      _block: BlockIdentifier
    ): Promise<MichelsonV1Expression[]> => []
  );
}
const schema = new Schema({ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'nat' }] });
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
afterEach(() => {
  vi.restoreAllMocks();
});

it('checks emptiness with one undecoded read and no block lookup', async () => {
  const reader = new Reader();
  const decode = vi.spyOn(schema, 'ExecuteOnBigMapValue');
  const { map } = make(reader);
  expect(await map.isEmpty()).toBe(true);
  reader.getBigMapValuesPage.mockResolvedValue([{ int: '1' }]);
  expect(await map.isEmpty()).toBe(false);
  expect(reader.getBlockHash).not.toHaveBeenCalled();
  expect(reader.getBigMapValuesPage).toHaveBeenCalledTimes(2);
  expect(reader.getBigMapValuesPage).toHaveBeenCalledWith('123', { offset: 0, length: 1 }, 'head');
  expect(decode).not.toHaveBeenCalled();
});
it('reads decoded values with one request at the requested block', async () => {
  const reader = new Reader();
  reader.getBigMapValuesPage.mockResolvedValue([{ int: '42' }, { int: '7' }]);
  const values = await make(reader).map.listValues<BigNumber>({ offset: 5, length: 2, block: 42 });
  expect(values.map((value) => value.toFixed())).toEqual(['42', '7']);
  expect(reader.getBlockHash).not.toHaveBeenCalled();
  expect(reader.getBigMapValuesPage).toHaveBeenCalledExactlyOnceWith(
    '123',
    { offset: 5, length: 2 },
    42
  );
});
it('decodes a finite nat page and exposes a reusable exact hash', async () => {
  const reader = new Reader();
  reader.getBigMapValuesPage.mockResolvedValue([{ int: '42' }, { int: '7' }]);
  const { map } = make(reader);
  const page = await map.getValuesPage<BigNumber>({ offset: 5, length: 2, block: 42 });
  expect(page.values.map((value) => value.toFixed())).toEqual(['42', '7']);
  expect(page.blockHash).toBe(BLOCK);
  expect(reader.getBlockHash).toHaveBeenCalledExactlyOnceWith(42);
  expect(reader.getBigMapValuesPage).toHaveBeenCalledExactlyOnceWith(
    '123',
    { offset: 5, length: 2 },
    BLOCK
  );
  await map.getValuesPage({ offset: 7, length: 2, block: page.blockHash });
  expect(reader.getBlockHash).toHaveBeenCalledTimes(1);
});
it('preserves the abstraction default block for every read', async () => {
  const reader = new Reader();
  reader.getBigMapValuesPage.mockResolvedValue([{ int: '1' }]);
  const { map } = make(reader, schema, 42);
  expect(await map.isEmpty()).toBe(false);
  await map.listValues();
  expect(reader.getBigMapValuesPage).toHaveBeenNthCalledWith(
    1,
    '123',
    { offset: 0, length: 1 },
    42
  );
  expect(reader.getBigMapValuesPage).toHaveBeenNthCalledWith(
    2,
    '123',
    { offset: 0, length: 100 },
    42
  );
  expect(reader.getBlockHash).not.toHaveBeenCalled();
  await map.getValuesPage();
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
  reader.getBigMapValuesPage.mockResolvedValue([
    { prim: 'Pair', args: [{ string: 'item' }, { prim: 'Some', args: [{ int: '42' }] }] },
  ]);
  const pair = await make(reader, pairSchema).map.listValues();
  expect(pair).toEqual([{ name: 'item', amount: { Some: new BigNumber(42) } }]);
  const mapSchema = new Schema({
    prim: 'big_map',
    args: [{ prim: 'string' }, { prim: 'map', args: [{ prim: 'string' }, { prim: 'nat' }] }],
  });
  reader.getBigMapValuesPage.mockResolvedValue([
    [{ prim: 'Elt', args: [{ string: 'a' }, { int: '7' }] }],
  ]);
  const values = await make(reader, mapSchema).map.listValues<MichelsonMap<string, BigNumber>>();
  expect(values[0]).toBeInstanceOf(MichelsonMap);
  expect(values[0].get('a')?.toFixed()).toBe('7');
});
it('passes RPC values to the decoder unchanged', async () => {
  const reader = new Reader();
  const entry = { int: '42' };
  reader.getBigMapValuesPage.mockResolvedValue([entry]);
  const decode = vi.spyOn(schema, 'ExecuteOnBigMapValue');
  await make(reader).map.listValues();
  await make(reader).map.getValuesPage();
  expect(decode).toHaveBeenCalledTimes(2);
  expect(decode.mock.calls.every(([value]) => value === entry)).toBe(true);
});
it.each([404, 403, 502])('keeps HTTP %s visible from every read', async (status) => {
  const reader = new Reader();
  const error = new HttpResponseError('controlled', status, 'failed', 'body', 'http://rpc.invalid');
  reader.getBigMapValuesPage.mockRejectedValue(error);
  const { map } = make(reader);
  await expect(map.isEmpty()).rejects.toBe(error);
  await expect(map.listValues()).rejects.toBe(error);
  await expect(map.getValuesPage()).rejects.toBe(error);
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
  const { map } = make(reader);
  await expect(map.listValues(options)).rejects.toBeInstanceOf(InvalidBigMapParameterError);
  await expect(map.getValuesPage(options)).rejects.toBeInstanceOf(InvalidBigMapParameterError);
  expect(reader.getBlockHash).not.toHaveBeenCalled();
  expect(reader.getBigMapValuesPage).not.toHaveBeenCalled();
});
it.each([null, 5, 'page'])('rejects non-object options %# before reading', async (options) => {
  const reader = new Reader();
  const { map } = make(reader);
  const invalid = options as unknown as BigMapValuesOptions;
  await expect(map.listValues(invalid)).rejects.toBeInstanceOf(InvalidBigMapParameterError);
  await expect(map.getValuesPage(invalid)).rejects.toBeInstanceOf(InvalidBigMapParameterError);
  expect(reader.getBigMapValuesPage).not.toHaveBeenCalled();
});
it('rejects an invalid hash and overlength responses instead of returning values', async () => {
  const reader = new Reader();
  const { map } = make(reader);
  reader.getBlockHash.mockResolvedValueOnce('invalid');
  await expect(map.getValuesPage()).rejects.toThrow(RPCResponseError);
  expect(reader.getBigMapValuesPage).not.toHaveBeenCalled();
  reader.getBigMapValuesPage.mockResolvedValue([{ int: '1' }, { int: '2' }]);
  await expect(map.isEmpty()).rejects.toThrow(RPCResponseError);
  await expect(map.listValues({ length: 1 })).rejects.toThrow(RPCResponseError);
  await expect(map.getValuesPage({ length: 1 })).rejects.toThrow(RPCResponseError);
  reader.getBigMapValuesPage.mockResolvedValue({} as unknown as MichelsonV1Expression[]);
  await expect(map.listValues()).rejects.toThrow(RPCResponseError);
});
it.each(['isEmpty', 'listValues', 'getValuesPage'] as const)(
  '%s does not bypass an unsupported selected read provider',
  async (method) => {
    const reader = new Reader();
    Object.defineProperty(reader, 'getBigMapValuesPage', { value: undefined });
    await expect(make(reader).map[method]()).rejects.toBeInstanceOf(UnsupportedActionError);
    expect(reader.getBlockHash).not.toHaveBeenCalled();
  }
);
it('reports an RPC client without the values capability', async () => {
  const rpc = new RpcClient('http://127.0.0.1:1');
  Object.defineProperty(rpc, 'getBigMapValuesPage', { value: undefined });
  await expect(
    new RpcReadAdapter(rpc).getBigMapValuesPage('123', { length: 1 }, BLOCK)
  ).rejects.toBeInstanceOf(UnsupportedActionError);
});
it('re-exports the core error classes of the big-map values API', () => {
  expect(TaquitoUnsupportedActionError).toBe(UnsupportedActionError);
  expect(RpcUnsupportedActionError).toBe(UnsupportedActionError);
  expect(TaquitoInvalidBigMapParameterError).toBe(InvalidBigMapParameterError);
  expect(RpcInvalidBigMapParameterError).toBe(InvalidBigMapParameterError);
});
it('keeps a pending page on its captured provider when block resolution is delayed', async () => {
  const original = new Reader();
  const replacement = new Reader();
  const ready = deferred<string>();
  original.getBlockHash.mockReturnValueOnce(ready.promise);
  original.getBigMapValuesPage.mockResolvedValue([{ int: '42' }]);
  replacement.getBigMapValuesPage.mockResolvedValue([{ int: '99' }]);
  const { toolkit, map } = make(original);
  const pending = map.getValuesPage<BigNumber>();
  toolkit.setReadProvider(replacement);
  ready.resolve(BLOCK);
  expect((await pending).values[0].toFixed()).toBe('42');
  expect(replacement.getBigMapValuesPage).not.toHaveBeenCalled();
  expect(original.getBigMapValuesPage).toHaveBeenCalledWith(
    '123',
    { offset: 0, length: 100 },
    BLOCK
  );
});
it('keeps a pending page on its captured provider when the page response is delayed', async () => {
  const original = new Reader();
  const replacement = new Reader();
  const ready = deferred<MichelsonV1Expression[]>();
  original.getBigMapValuesPage.mockReturnValueOnce(ready.promise);
  const { toolkit, map } = make(original);
  const pending = map.getValuesPage<BigNumber>();
  await vi.waitFor(() => expect(original.getBigMapValuesPage).toHaveBeenCalledTimes(1));
  toolkit.setReadProvider(replacement);
  ready.resolve([{ int: '42' }]);
  expect((await pending).values[0].toFixed()).toBe('42');
  expect(replacement.getBigMapValuesPage).not.toHaveBeenCalled();
});
it('propagates decoder failures unchanged', async () => {
  const error = new Error('controlled decoder failure');
  class RejectingSchema extends Schema {
    override ExecuteOnBigMapValue() {
      throw error;
    }
  }
  const reader = new Reader();
  reader.getBigMapValuesPage.mockResolvedValue([{ int: '1' }]);
  await expect(make(reader, new RejectingSchema({ prim: 'nat' })).map.listValues()).rejects.toBe(
    error
  );
});
it('leaves malformed entries to the schema decoder', async () => {
  const reader = new Reader();
  reader.getBigMapValuesPage.mockResolvedValue([{ int: 'not-an-integer' }]);
  await expect(make(reader).map.listValues()).rejects.toThrow();
});
it('does not mistake an empty map value for an empty big map', async () => {
  const reader = new Reader();
  reader.getBigMapValuesPage.mockResolvedValue([[]]);
  const mapSchema = new Schema({
    prim: 'big_map',
    args: [{ prim: 'string' }, { prim: 'map', args: [{ prim: 'string' }, { prim: 'nat' }] }],
  });
  expect(await make(reader, mapSchema).map.isEmpty()).toBe(false);
});
it.each([
  ['getValuesPage', BLOCK, 'original'],
  ['listValues', 'head', 'replacement'],
] as const)(
  '%s gives synthetic semantic abstractions its block (%s) and the %s read provider',
  async (method, expectedBlock, expectedReader) => {
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
    original.getBigMapValuesPage.mockResolvedValue([{ int: '1' }]);
    const replacement = new Reader();
    const keys = {
      original: vi.spyOn(original, 'getBigMapValue').mockResolvedValue({ int: '9' }),
      replacement: vi.spyOn(replacement, 'getBigMapValue').mockResolvedValue({ int: '9' }),
    };
    const { toolkit, map } = make(
      original,
      new SyntheticSemanticSchema({ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'nat' }] })
    );
    toolkit.setPackerProvider({ packData: async () => ({ packed: '0501000000016b' }) });
    const result = await map[method]<BigMapAbstraction>();
    const [child] = Array.isArray(result) ? result : result.values;
    toolkit.setReadProvider(replacement);
    expect((await child.get<BigNumber>('k'))?.toFixed()).toBe('9');
    expect(keys[expectedReader]).toHaveBeenCalledWith(
      expect.objectContaining({ id: '456' }),
      expectedBlock
    );
    const other = expectedReader === 'original' ? 'replacement' : 'original';
    expect(keys[other]).not.toHaveBeenCalled();
  }
);
it('accepts valid lambda sequences and contract literals without changing their decoder', async () => {
  const reader = new Reader();
  const body = [{ prim: 'DROP' }, { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] }];
  reader.getBigMapValuesPage.mockResolvedValue([body]);
  const lambda = new Schema({
    prim: 'big_map',
    args: [{ prim: 'string' }, { prim: 'lambda', args: [{ prim: 'unit' }, { prim: 'nat' }] }],
  });
  expect(await make(reader, lambda).map.listValues()).toEqual([body]);
  const address = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton';
  reader.getBigMapValuesPage.mockResolvedValue([{ string: address }]);
  const contract = new Schema({
    prim: 'big_map',
    args: [{ prim: 'string' }, { prim: 'contract', args: [{ prim: 'unit' }] }],
  });
  expect(await make(reader, contract).map.listValues()).toEqual([address]);
});
