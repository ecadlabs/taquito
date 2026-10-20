import { createServer, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { RpcClient } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { RpcReadAdapter, TezosToolkit } from '../src/taquito';

const address = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton';

describe('RPC provider switching (#2845)', () => {
  let server: Server;
  let base: string;
  let requests: string[];
  let pauseContract: { started: () => void; release: Promise<void> } | undefined;

  beforeAll(async () => {
    server = createServer(async (request, response) => {
      const path = request.url!;
      requests.push(path);
      const node = path.split('/')[1];
      const value = node === 'a' ? '1' : node === 'b' ? '2' : '3';
      const contractPath = `/${node}/chains/main/blocks/head/context/contracts/${address}`;
      if (
        !['a', 'b', 'c'].includes(node) ||
        ![contractPath, `${contractPath}/entrypoints`, `${contractPath}/balance`].includes(path)
      ) {
        response.writeHead(404).end();
        return;
      }
      response.setHeader('Content-Type', 'application/json');
      if (path.endsWith('/entrypoints')) {
        response.end(JSON.stringify({ entrypoints: { default: { prim: 'unit' } } }));
      } else if (path.endsWith('/balance')) {
        response.end(JSON.stringify(value));
      } else {
        if (pauseContract) {
          const pause = pauseContract;
          pauseContract = undefined;
          pause.started();
          await pause.release;
        }
        response.end(
          JSON.stringify({
            balance: value,
            script: {
              code: [
                { prim: 'parameter', args: [{ prim: 'unit' }] },
                { prim: 'storage', args: [{ prim: 'int' }] },
                {
                  prim: 'code',
                  args: [
                    [
                      { prim: 'CDR' },
                      { prim: 'NIL', args: [{ prim: 'operation' }] },
                      { prim: 'PAIR' },
                    ],
                  ],
                },
              ],
              storage: { int: value },
            },
          })
        );
      }
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  beforeEach(() => {
    requests = [];
    pauseContract = undefined;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  });

  it('uses the new RPC for wallet contract reads after setRpcProvider', async () => {
    const toolkit = new TezosToolkit(`${base}/a`);
    toolkit.setRpcProvider(`${base}/b`);
    expect(toolkit.rpc.getRpcUrl()).toBe(`${base}/b`);
    await toolkit.wallet.at(address);
    expect(requests).toEqual([
      `/b/chains/main/blocks/head/context/contracts/${address}`,
      `/b/chains/main/blocks/head/context/contracts/${address}/entrypoints`,
    ]);
  });

  it('uses a supplied RPC client for contract reads after repeated switches', async () => {
    const toolkit = new TezosToolkit(new RpcClient(`${base}/a`));
    toolkit.setRpcProvider(new RpcClient(`${base}/b`));
    await toolkit.contract.at(address);
    expect(requests).toHaveLength(2);
    expect(requests.every((path) => path.startsWith('/b/'))).toBe(true);
    requests = [];
    toolkit.setRpcProvider(`${base}/a`);
    await toolkit.contract.at(address);
    expect(requests).toHaveLength(2);
    expect(requests.every((path) => path.startsWith('/a/'))).toBe(true);
  });

  it('keeps an in-flight wallet read on its captured provider', async () => {
    const toolkit = new TezosToolkit(`${base}/a`);
    let release!: () => void;
    const released = new Promise<void>((resolve) => {
      release = resolve;
    });
    const started = new Promise<void>((resolve) => {
      pauseContract = { started: resolve, release: released };
    });
    const pending = toolkit.wallet.at(address);
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<never>((_, reject) => {
      timeout = setTimeout(
        () => reject(new Error('Contract request did not reach the fixture')),
        2000
      );
    });
    try {
      await Promise.race([started, pending, deadline]);
      toolkit.setRpcProvider(`${base}/b`);
      release();
      await pending;
    } finally {
      clearTimeout(timeout);
      pauseContract = undefined;
      release();
      await pending.catch(() => undefined);
    }
    expect(requests).toEqual([
      `/a/chains/main/blocks/head/context/contracts/${address}`,
      `/a/chains/main/blocks/head/context/contracts/${address}/entrypoints`,
    ]);
    requests = [];
    await toolkit.wallet.at(address);
    expect(requests).toHaveLength(2);
    expect(requests.every((path) => path.startsWith('/b/'))).toBe(true);
  });

  describe('existing compatibility', () => {
    it('preserves a custom reader implementation', async () => {
      class IndexerReader extends RpcReadAdapter {
        async getBalance() {
          return new BigNumber(77);
        }
      }
      const toolkit = new TezosToolkit(`${base}/a`);
      toolkit.setReadProvider(new IndexerReader(new RpcClient(`${base}/c`)));
      toolkit.setRpcProvider(`${base}/b`);
      expect((await toolkit.tz.getBalance(address)).toString()).toBe('77');
      expect(requests).toEqual([]);
    });

    it('treats an explicitly reselected default adapter as caller-owned', async () => {
      const toolkit = new TezosToolkit(`${base}/a`);
      toolkit.addExtension({
        configureContext(context) {
          toolkit.setReadProvider(context.readProvider);
        },
      });
      toolkit.setRpcProvider(`${base}/b`);
      expect((await toolkit.tz.getBalance(address)).toString()).toBe('1');
    });

    it('keeps an explicitly supplied RPC read adapter on its own endpoint', async () => {
      const toolkit = new TezosToolkit(`${base}/a`);
      toolkit.setReadProvider(new RpcReadAdapter(new RpcClient(`${base}/c`)));
      toolkit.setRpcProvider(`${base}/b`);
      expect((await toolkit.tz.getBalance(address)).toString()).toBe('3');
    });

    it('keeps an extension-installed read provider', async () => {
      const toolkit = new TezosToolkit(`${base}/a`);
      toolkit.addExtension({
        configureContext(context) {
          context.readProvider = new RpcReadAdapter(new RpcClient(`${base}/c`));
        },
      });
      toolkit.setRpcProvider(`${base}/b`);
      expect((await toolkit.tz.getBalance(address)).toString()).toBe('3');
    });

    it('keeps the selected providers when setRpcProvider has no argument', async () => {
      const toolkit = new TezosToolkit(`${base}/a`);
      toolkit.setReadProvider(new RpcReadAdapter(new RpcClient(`${base}/c`)));
      toolkit.setRpcProvider();
      expect(toolkit.rpc.getRpcUrl()).toBe(`${base}/a`);
      expect((await toolkit.tz.getBalance(address)).toString()).toBe('3');
    });

    it.each(['rpc', 'empty', 'config'] as const)(
      'retains the default-reader reset in setProvider: %s',
      async (kind) => {
        const toolkit = new TezosToolkit(`${base}/a`);
        toolkit.setReadProvider(new RpcReadAdapter(new RpcClient(`${base}/c`)));
        toolkit.setProvider(
          kind === 'rpc'
            ? { rpc: `${base}/b` }
            : kind === 'config'
              ? { config: { defaultConfirmationCount: 2 } }
              : {}
        );
        expect((await toolkit.tz.getBalance(address)).toString()).toBe(kind === 'rpc' ? '2' : '1');
      }
    );

    it('selects the explicit reader in setProvider', async () => {
      const toolkit = new TezosToolkit(`${base}/a`);
      toolkit.setProvider({
        rpc: `${base}/b`,
        readProvider: new RpcReadAdapter(new RpcClient(`${base}/c`)),
      });
      expect((await toolkit.tz.getBalance(address)).toString()).toBe('3');
    });

    it('resets reads to the current RPC with setReadProvider()', async () => {
      const toolkit = new TezosToolkit(`${base}/a`);
      toolkit.setReadProvider(new RpcReadAdapter(new RpcClient(`${base}/c`)));
      toolkit.setRpcProvider(`${base}/b`);
      toolkit.setReadProvider();
      expect((await toolkit.tz.getBalance(address)).toString()).toBe('2');
    });
  });

  it('preserves routing through every sequence of three provider changes', async () => {
    // Expected transitions describe the public configuration contract, not adapter identity.
    type State = { rpc: 'a' | 'b'; reader: 'default' | 'custom' };
    const custom = new RpcReadAdapter(new RpcClient(`${base}/c`));
    const actions: {
      name: string;
      apply: (toolkit: TezosToolkit) => void;
      next: (state: State) => State;
    }[] = [
      {
        name: 'rpc URL A',
        apply: (t) => t.setRpcProvider(`${base}/a`),
        next: (s) => ({ ...s, rpc: 'a' }),
      },
      {
        name: 'rpc client B',
        apply: (t) => t.setRpcProvider(new RpcClient(`${base}/b`)),
        next: (s) => ({ ...s, rpc: 'b' }),
      },
      {
        name: 'custom reader',
        apply: (t) => t.setReadProvider(custom),
        next: (s) => ({ ...s, reader: 'custom' }),
      },
      {
        name: 'extension reader',
        apply: (t) =>
          t.addExtension({
            configureContext: (c) => {
              c.readProvider = custom;
            },
          }),
        next: (s) => ({ ...s, reader: 'custom' }),
      },
      {
        name: 'reset reader',
        apply: (t) => t.setReadProvider(),
        next: (s) => ({ ...s, reader: 'default' }),
      },
      {
        name: 'setProvider RPC',
        apply: (t) => t.setProvider({ rpc: `${base}/b` }),
        next: () => ({ rpc: 'b', reader: 'default' }),
      },
      {
        name: 'setProvider custom',
        apply: (t) => t.setProvider({ rpc: `${base}/b`, readProvider: custom }),
        next: () => ({ rpc: 'b', reader: 'custom' }),
      },
      { name: 'no RPC argument', apply: (t) => t.setRpcProvider(), next: (s) => s },
      {
        name: 'empty setProvider',
        apply: (t) => t.setProvider({}),
        next: (s) => ({ ...s, reader: 'default' }),
      },
    ];
    for (const first of actions) {
      for (const second of actions) {
        for (const third of actions) {
          const toolkit = new TezosToolkit(`${base}/a`);
          let state: State = { rpc: 'a', reader: 'default' };
          const trace: string[] = [];
          for (const action of [first, second, third]) {
            trace.push(action.name);
            action.apply(toolkit);
            state = action.next(state);
            const expected = state.reader === 'custom' ? '3' : state.rpc === 'a' ? '1' : '2';
            expect((await toolkit.tz.getBalance(address)).toString(), trace.join(' -> ')).toBe(
              expected
            );
            expect(toolkit.rpc.getRpcUrl(), trace.join(' -> ')).toBe(`${base}/${state.rpc}`);
          }
        }
      }
    }
  }, 30000);
});
