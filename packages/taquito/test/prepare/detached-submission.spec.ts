import { RpcInjector } from '../../src/injector/rpc-injector';
import { RpcClient, RpcClientCache } from '@taquito/rpc';
import { LocalForger } from '@taquito/local-forging';
import { TezosToolkit, PreparedOperation, Operation } from '../../src/taquito';
import { fixtureServer } from './detached-test-server';
import vectors from './detached-signing-vectors';

describe('detached submission', () => {
  let server: Awaited<ReturnType<typeof fixtureServer>>;
  beforeEach(async () => {
    server = await fixtureServer();
  });
  afterEach(async () => {
    await server.close();
  });
  const vector = vectors.vectors[0];
  function prepared(): PreparedOperation {
    return structuredClone({
      opOb: { ...vector.operation, protocol: vector.protocol },
      counter: 0,
    });
  }
  it('submits exact signed bytes once and returns a confirmation handle', async () => {
    const workflow = new TezosToolkit(server.url).prepareFor(vector);
    const signable = await workflow.toSignable(prepared());
    const signed = workflow.attachSignature(signable, vector.signature);
    const first = workflow.inject(signed);
    expect(workflow.inject(signed)).toBe(first);
    const operation = await first;
    expect(operation).toBeInstanceOf(Operation);
    expect(operation.raw.opbytes).toBe(vector.signedBytes);
    expect(operation.status).toBe('applied');
    expect(await operation.confirmation(1)).toBe(1);
    expect(
      server.requests.filter((request) => request.path.startsWith('/injection/operation'))
    ).toEqual([{ path: '/injection/operation', body: vector.signedBytes }]);
    expect(workflow.inject(signed)).toBe(first);
  });

  it('keeps default forge, injection and confirmation on the captured network', async () => {
    const other = await fixtureServer();
    try {
      const tezos = new TezosToolkit(server.url);
      const workflow = tezos.prepareFor(vector);
      tezos.setProvider({ rpc: other.url, config: { defaultConfirmationCount: 9 } });
      const signed = workflow.attachSignature(
        await workflow.toSignable(prepared()),
        vector.signature
      );
      const operation = await workflow.inject(signed);
      expect(await operation.confirmation()).toBe(1);
      expect(other.requests).toHaveLength(0);
      expect(server.requests.some((request) => request.path.endsWith('/protocols'))).toBe(true);
    } finally {
      await other.close();
    }
  });
  it('does not reforge, inject or retry after a counter error', async () => {
    server.setPreapplyResult(
      [
        {
          id: 'proto.contract.counter_in_the_past',
          kind: 'temporary',
          contract: vector.pkh,
          expected: '2',
          found: '1',
        },
      ],
      500
    );
    const workflow = new TezosToolkit(server.url).prepareFor(vector);
    const signed = workflow.attachSignature(
      await workflow.toSignable(prepared()),
      vector.signature
    );
    const pending = workflow.inject(signed);
    await expect(pending).rejects.toThrow();
    expect(workflow.inject(signed)).toBe(pending);
    expect(server.requests.filter((request) => request.path.includes('/preapply/'))).toHaveLength(
      1
    );
    expect(server.requests.some((request) => request.path.includes('/injection/'))).toBe(false);
  });
  it.each(['failed', 'backtracked', 'skipped'])('rejects %s operation results', async (status) => {
    server.setPreapplyResult([
      {
        ...vector.operation,
        contents: vector.operation.contents.map((content) => ({
          ...content,
          metadata: { operation_result: { status } },
        })),
      },
    ]);
    const workflow = new TezosToolkit(server.url).prepareFor(vector);
    const signed = workflow.attachSignature(
      await workflow.toSignable(prepared()),
      vector.signature
    );
    await expect(workflow.inject(signed)).rejects.toThrow();
    expect(server.requests.some((request) => request.path.includes('/injection/'))).toBe(false);
  });
  it('rejects internal operation failure and malformed preapply responses', async () => {
    const workflow = new TezosToolkit(server.url).prepareFor(vector);
    for (const response of [
      {},
      [],
      [{ contents: [] }],
      [
        {
          contents: [
            {
              ...vector.operation.contents[0],
              metadata: {
                operation_result: { status: 'applied' },
                internal_operation_results: [
                  {
                    kind: 'transaction',
                    result: { status: 'failed', errors: [{ id: 'failure', kind: 'temporary' }] },
                  },
                ],
              },
            },
          ],
        },
      ],
    ]) {
      server.setPreapplyResult(response);
      const signed = workflow.attachSignature(
        await workflow.toSignable(prepared()),
        vector.signature
      );
      await expect(workflow.inject(signed)).rejects.toThrow();
    }
    expect(server.requests.some((request) => request.path.includes('/injection/'))).toBe(false);
  });
  it('rejects copied signed values and values owned by another workflow', async () => {
    const tezos = new TezosToolkit(server.url);
    const workflow = tezos.prepareFor(vector);
    const signed = workflow.attachSignature(
      await workflow.toSignable(prepared()),
      vector.signature
    );
    await expect(workflow.inject({ ...signed })).rejects.toThrow('another');
    await expect(tezos.prepareFor(vector).inject(signed)).rejects.toThrow('another');
  });

  it('preserves a custom built-in injector subclass and its error', async () => {
    class CustomInjector extends RpcInjector {
      calls = 0;
      async inject(_bytes: string): Promise<string> {
        this.calls++;
        throw new Error('Custom injector failure');
      }
    }
    const tezos = new TezosToolkit(server.url);
    const injector = tezos.getFactory(CustomInjector)();
    tezos.setInjectorProvider(injector);
    const workflow = tezos.prepareFor(vector);
    const signed = workflow.attachSignature(
      await workflow.toSignable(prepared()),
      vector.signature
    );
    await expect(workflow.inject(signed)).rejects.toThrow('Custom injector failure');
    await expect(workflow.inject(signed)).rejects.toThrow('Custom injector failure');
    expect(injector.calls).toBe(1);
  });
  it('preserves an explicit custom forger and invalidates the selected RPC cache', async () => {
    const rpc = new RpcClientCache(new RpcClient(server.url));
    const clear = vi.spyOn(rpc, 'deleteAllCachedData');
    const tezos = new TezosToolkit(rpc);
    const forger = new LocalForger();
    const forge = vi.spyOn(forger, 'forge');
    tezos.setForgerProvider(forger);
    const workflow = tezos.prepareFor(vector);
    const signed = workflow.attachSignature(
      await workflow.toSignable(prepared()),
      vector.signature
    );
    const operation = await workflow.inject(signed);
    await operation.confirmation(1);
    expect(forge).toHaveBeenCalledOnce();
    expect(clear).toHaveBeenCalledOnce();
  });

  it('preapplies the original contents after caller and custom forger mutations', async () => {
    const tezos = new TezosToolkit(server.url);
    let release: () => void = () => {
      throw new Error('Missing gate');
    };
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    tezos.setForgerProvider({
      forge: async (params) => {
        await gate;
        const bytes = await new LocalForger().forge(params);
        params.contents.length = 0;
        return bytes;
      },
    });
    const workflow = tezos.prepareFor(vector);
    const input = prepared();
    const pending = workflow.toSignable(input);
    input.opOb.contents.length = 0;
    release();
    const operation = await workflow.inject(
      workflow.attachSignature(await pending, vector.signature)
    );
    await operation.confirmation(1);
    const request = server.requests.find((item) => item.path.includes('/preapply/'));
    expect(request?.body).toEqual([
      { ...vector.operation, protocol: vector.protocol, signature: vector.signature },
    ]);
    expect(operation.raw.opOb.contents).toEqual(vector.operation.contents);
  });
});
