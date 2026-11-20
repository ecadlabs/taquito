import { createServer } from 'node:http';
import { once } from 'node:events';
import { it, expect, vi, afterEach } from 'vitest';
import { HttpBackend, HttpResponseError } from '@taquito/http-utils';
import { UnsupportedActionError } from '@taquito/core';
import {
  OpKind,
  RpcClient,
  RpcClientCache,
  RPCRunCodeParam,
  TraceCodeResult,
  TraceCodeStep,
} from '../src/taquito-rpc';

afterEach(() => vi.restoreAllMocks());

const chain_id = 'NetXsqzbfFenSTS';

// parameter nat; storage nat; code { UNPAIR; ADD; NIL operation; PAIR }
const params: RPCRunCodeParam = {
  script: [
    { prim: 'parameter', args: [{ prim: 'nat' }] },
    { prim: 'storage', args: [{ prim: 'nat' }] },
    {
      prim: 'code',
      args: [
        [
          { prim: 'UNPAIR' },
          { prim: 'ADD' },
          { prim: 'NIL', args: [{ prim: 'operation' }] },
          { prim: 'PAIR' },
        ],
      ],
    },
  ],
  storage: { int: '1' },
  input: { int: '2' },
  amount: '0',
  chain_id,
};

// Response returned by https://rpc.shadownet.teztnets.com for `params` on 2026-11-17.
const shadownetResponse: TraceCodeResult = {
  storage: { int: '3' },
  operations: [],
  trace: [
    { location: 7, gas: '4158', stack: [{ prim: 'Pair', args: [{ int: '2' }, { int: '1' }] }] },
    { location: 7, gas: '10', stack: [{ int: '2' }, { int: '1' }] },
    { location: 8, gas: '35', stack: [{ int: '3' }] },
    { location: 9, gas: '10', stack: [[], { int: '3' }] },
    { location: 11, gas: '10', stack: [{ prim: 'Pair', args: [[], { int: '3' }] }] },
  ],
};

// The fixtures below were recorded on Shadownet at block
// BM6GgWzYpkAaeQ6CLxuz7YTPtsbNRUV19tc3TpHZLNDz21dm4Lt (protocol PsUshuai) on 2026-11-19.

// parameter unit; storage nat;
// code { CDR; NIL operation; PUSH key_hash "tz1burn..."; IMPLICIT_ACCOUNT;
//        PUSH mutez 0; UNIT; TRANSFER_TOKENS; CONS; PAIR }
const burn = 'tz1burnburnburnburnburnburnburjAYjjX';
const transferBytes =
  '011d23c1d3d2f8a4ea5e8784b8f7ecf2ad304c0fe600000001000000b28066369a8ed09ba9d3d47f19598440266013f000';
const transferParams: RPCRunCodeParam = {
  script: [
    { prim: 'parameter', args: [{ prim: 'unit' }] },
    { prim: 'storage', args: [{ prim: 'nat' }] },
    {
      prim: 'code',
      args: [
        [
          { prim: 'CDR' },
          { prim: 'NIL', args: [{ prim: 'operation' }] },
          { prim: 'PUSH', args: [{ prim: 'key_hash' }, { string: burn }] },
          { prim: 'IMPLICIT_ACCOUNT' },
          { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
          { prim: 'UNIT' },
          { prim: 'TRANSFER_TOKENS' },
          { prim: 'CONS' },
          { prim: 'PAIR' },
        ],
      ],
    },
  ],
  storage: { int: '1' },
  input: { prim: 'Unit' },
  amount: '0',
  chain_id,
};
const transferResponse: TraceCodeResult = {
  storage: { int: '1' },
  operations: [
    {
      source: 'KT1BEqzn5Wx8uJrZNvuS9DVHmLvG9td3fDLi',
      nonce: 0,
      kind: OpKind.TRANSACTION,
      amount: '0',
      destination: burn,
    },
  ],
  trace: [
    {
      location: 7,
      gas: '11515',
      stack: [{ prim: 'Pair', args: [{ prim: 'Unit' }, { int: '1' }] }],
    },
    { location: 7, gas: '10', stack: [{ int: '1' }] },
    { location: 8, gas: '10', stack: [[], { int: '1' }] },
    { location: 10, gas: '10', stack: [{ string: burn }, [], { int: '1' }] },
    { location: 13, gas: '10', stack: [{ string: burn }, [], { int: '1' }] },
    { location: 14, gas: '10', stack: [{ int: '0' }, { string: burn }, [], { int: '1' }] },
    {
      location: 17,
      gas: '10',
      stack: [{ prim: 'Unit' }, { int: '0' }, { string: burn }, [], { int: '1' }],
    },
    { location: 18, gas: '60', stack: [{ bytes: transferBytes }, [], { int: '1' }] },
    { location: 19, gas: '10', stack: [[{ bytes: transferBytes }], { int: '1' }] },
    {
      location: 20,
      gas: '10',
      stack: [{ prim: 'Pair', args: [[{ bytes: transferBytes }], { int: '1' }] }],
    },
  ],
};

// parameter unit; storage (big_map string nat);
// code { CDR; PUSH nat 1; SOME; PUSH string "key"; UPDATE; NIL operation; PAIR }
const bigMapParams: RPCRunCodeParam = {
  script: [
    { prim: 'parameter', args: [{ prim: 'unit' }] },
    { prim: 'storage', args: [{ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'nat' }] }] },
    {
      prim: 'code',
      args: [
        [
          { prim: 'CDR' },
          { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
          { prim: 'SOME' },
          { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'key' }] },
          { prim: 'UPDATE' },
          { prim: 'NIL', args: [{ prim: 'operation' }] },
          { prim: 'PAIR' },
        ],
      ],
    },
  ],
  storage: [],
  input: { prim: 'Unit' },
  amount: '0',
  chain_id,
};
const entry = { prim: 'Elt', args: [{ string: 'key' }, { int: '1' }] };
const bigMapResponse: TraceCodeResult = {
  storage: { int: '60741' },
  operations: [],
  trace: [
    { location: 9, gas: '7304', stack: [{ prim: 'Pair', args: [{ prim: 'Unit' }, []] }] },
    { location: 9, gas: '10', stack: [[]] },
    { location: 10, gas: '10', stack: [{ int: '1' }, []] },
    { location: 13, gas: '10', stack: [{ prim: 'Some', args: [{ int: '1' }] }, []] },
    {
      location: 14,
      gas: '10',
      stack: [{ string: 'key' }, { prim: 'Some', args: [{ int: '1' }] }, []],
    },
    { location: 17, gas: '747', stack: [[entry]] },
    { location: 18, gas: '10', stack: [[], [entry]] },
    { location: 20, gas: '10', stack: [{ prim: 'Pair', args: [[], [entry]] }] },
  ],
  lazy_storage_diff: [
    {
      kind: 'big_map',
      id: '60741',
      diff: {
        action: 'alloc',
        updates: [
          {
            key_hash: 'exprvJQWw8khUVvcynWacjW9dtJf6t6u4yd7yByBufGLufDo5D1oxu',
            key: { string: 'key' },
            value: { int: '1' },
          },
        ],
        key_type: { prim: 'string' },
        value_type: { prim: 'nat' },
      },
    },
  ],
};

// parameter unit; storage nat; code { CDR; FAILWITH }
const failParams: RPCRunCodeParam = {
  script: [
    { prim: 'parameter', args: [{ prim: 'unit' }] },
    { prim: 'storage', args: [{ prim: 'nat' }] },
    { prim: 'code', args: [[{ prim: 'CDR' }, { prim: 'FAILWITH' }]] },
  ],
  storage: { int: '1' },
  input: { prim: 'Unit' },
  amount: '0',
  chain_id,
};
const failTrace: TraceCodeStep[] = [
  { location: 7, gas: '2753', stack: [{ prim: 'Pair', args: [{ prim: 'Unit' }, { int: '1' }] }] },
  { location: 7, gas: '10', stack: [{ int: '1' }] },
];
// The HTTP 500 body the node returns for `failParams`.
const failBody = [
  {
    kind: 'temporary',
    id: 'proto.025-PsUshuai.michelson_v1.runtime_error',
    contract_handle: 'KT1BEqzn5Wx8uJrZNvuS9DVHmLvG9td3fDLi',
    contract_code: 'Deprecated',
  },
  {
    kind: 'temporary',
    id: 'proto.025-PsUshuai.michelson_v1.script_rejected',
    location: 8,
    with: { int: '1' },
    trace: failTrace,
  },
];

type Reply = { status: number; body: unknown };
type Recorded = { url: string | undefined; method: string | undefined; body: unknown };

// Serve one canned reply per request body over a real socket, through the real HttpBackend.
async function withNode(
  reply: (body: unknown) => Reply,
  run: (client: RpcClient, requests: Recorded[]) => Promise<void>
) {
  const requests: Recorded[] = [];
  const server = createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
    const body: unknown = JSON.parse(Buffer.concat(chunks).toString());
    requests.push({ url: req.url, method: req.method, body });
    const { status, body: responseBody } = reply(body);
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(responseBody));
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    if (address === null || typeof address === 'string') throw new Error('No TCP address');
    await run(new RpcClient('http://127.0.0.1:' + address.port), requests);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
}

it('posts run_code parameters to trace_code on the requested chain and block', async () => {
  const backend = new HttpBackend();
  const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(shadownetResponse);
  const client = new RpcClient('https://rpc.invalid/', 'custom', backend);

  expect(await client.traceCode(params, { block: 'head~2' })).toBe(shadownetResponse);
  expect(request).toHaveBeenCalledExactlyOnceWith(
    {
      url: 'https://rpc.invalid/chains/custom/blocks/head~2/helpers/scripts/trace_code',
      method: 'POST',
    },
    params
  );
});

it('defaults to the head block', async () => {
  const backend = new HttpBackend();
  const request = vi.spyOn(backend, 'createRequest').mockResolvedValue(shadownetResponse);
  await new RpcClient('https://rpc.invalid', undefined, backend).traceCode(params);
  expect(request.mock.calls[0]?.[0]).toEqual({
    url: 'https://rpc.invalid/chains/main/blocks/head/helpers/scripts/trace_code',
    method: 'POST',
  });
});

it('sends the exact JSON through the real HTTP backend and returns the trace', async () => {
  await withNode(
    () => ({ status: 200, body: shadownetResponse }),
    async (client, requests) => {
      const result = await client.traceCode(params);

      expect(result).toEqual(shadownetResponse);
      expect(result.trace.map((step) => step.location)).toEqual([7, 7, 8, 9, 11]);
      expect(requests).toEqual([
        {
          url: '/chains/main/blocks/head/helpers/scripts/trace_code',
          method: 'POST',
          body: params,
        },
      ]);
    }
  );
});

it('starts the trace with the Pair parameter storage stack', async () => {
  await withNode(
    () => ({ status: 200, body: shadownetResponse }),
    async (client) => {
      const [first] = (await client.traceCode(params)).trace;
      expect(first).toEqual({
        location: 7,
        gas: '4158',
        stack: [{ prim: 'Pair', args: [params.input, params.storage] }],
      });
    }
  );
});

it('types and returns emitted operations, which carry no application result', async () => {
  await withNode(
    () => ({ status: 200, body: transferResponse }),
    async (client) => {
      const { operations } = await client.traceCode(transferParams);
      expect(operations).toEqual(transferResponse.operations);
      expect(operations[0]).not.toHaveProperty('result');
    }
  );
});

it('types and returns the big map allocation as a lazy_storage_diff list', async () => {
  await withNode(
    () => ({ status: 200, body: bigMapResponse }),
    async (client) => {
      const { lazy_storage_diff } = await client.traceCode(bigMapParams);
      expect(lazy_storage_diff).toEqual(bigMapResponse.lazy_storage_diff);
      expect(lazy_storage_diff?.map((diff) => diff.kind)).toEqual(['big_map']);
    }
  );
});

it('rejects a FAILWITH run with the partial trace in the error body', async () => {
  await withNode(
    () => ({ status: 500, body: failBody }),
    async (client, requests) => {
      const error: unknown = await client.traceCode(failParams).then(
        () => undefined,
        (reason: unknown) => reason
      );

      if (!(error instanceof HttpResponseError)) throw new Error('Expected HttpResponseError');
      expect(error.status).toBe(500);
      const errors: unknown = JSON.parse(error.body);
      if (!Array.isArray(errors)) throw new Error('Expected a list of node errors');
      const rejected = errors.find(
        (item: unknown) =>
          typeof item === 'object' &&
          item !== null &&
          'id' in item &&
          typeof item.id === 'string' &&
          item.id.endsWith('.michelson_v1.script_rejected')
      );
      expect(rejected).toEqual({
        kind: 'temporary',
        id: 'proto.025-PsUshuai.michelson_v1.script_rejected',
        location: 8,
        with: { int: '1' },
        trace: failTrace,
      });
      expect(requests).toHaveLength(1);
    }
  );
});

it('forwards each cache call to the client without caching the result', async () => {
  const rpc = new RpcClient('https://rpc.invalid');
  const forwarded = vi.spyOn(rpc, 'traceCode').mockResolvedValue(shadownetResponse);
  const cache = new RpcClientCache(rpc);

  expect(await cache.traceCode(params, { block: 'head~1' })).toBe(shadownetResponse);
  expect(await cache.traceCode(params, { block: 'head~1' })).toBe(shadownetResponse);
  expect(forwarded).toHaveBeenCalledTimes(2);
  expect(forwarded).toHaveBeenLastCalledWith(params, { block: 'head~1' });
});

it('reports a missing optional capability on a custom client', async () => {
  const rpc = new RpcClient('https://rpc.invalid');
  Object.defineProperty(rpc, 'traceCode', { value: undefined });
  await expect(new RpcClientCache(rpc).traceCode(params)).rejects.toBeInstanceOf(
    UnsupportedActionError
  );
});
