import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { vi, type MockInstance } from 'vitest';
import type { TransportErrorKind } from '@taquito/http-utils';

const secretKey = 'spsk21y52Cp943kGnqPBSjXMC2xf1hz8QDGGih7AJdFqhxPcm1ihRN';
const pkh = 'tz2RqxsYQyFuP9amsmrr25x9bUcBMWXGvjuD';

describe('fresh-key setup with local HTTP fixtures', () => {
  let server: Server;
  let base: string;
  let replies: Array<number | 'malformed' | 'invalid-key'>;
  let balance: string;
  let rpcStatus: number;
  let balanceReplies: Array<{ status: number; value?: string }>;
  let managerReplies: Array<{ status: number; value?: unknown }>;
  let revealed: boolean;
  let requests: Array<{ method: string; path: string; body: unknown }>;
  let keyRequests: number;
  let rpcRequests: number;
  let keyRequestTimes: number[];
  let warn: MockInstance<typeof console.warn>;
  let log: MockInstance<typeof console.log>;

  beforeAll(async () => {
    server = createServer(async (request, response) => {
      const chunks: Buffer[] = [];
      for await (const chunk of request) chunks.push(Buffer.from(chunk));
      const body = Buffer.concat(chunks).toString();
      requests.push({
        method: request.method!,
        path: request.url!,
        body: body ? JSON.parse(body) : null,
      });
      response.setHeader('Content-Type', 'application/json');
      if (request.url === '/v2/shadownet' && request.method === 'POST') {
        keyRequests++;
        keyRequestTimes.push(Date.now());
        const reply = replies.shift() ?? 200;
        if (reply === 'malformed') {
          response.end(JSON.stringify({ pkh }));
        } else if (reply === 'invalid-key') {
          response.end(JSON.stringify({ secret_key: 'invalid-key', pkh }));
        } else if (reply !== 200) {
          response.writeHead(reply).end(JSON.stringify({ error: 'fixture service unavailable' }));
        } else {
          response.end(JSON.stringify({ secret_key: secretKey, pkh }));
        }
      } else if (request.method === 'GET' && request.url?.endsWith('/manager_key')) {
        rpcRequests++;
        const reply = managerReplies.shift();
        response
          .writeHead(reply?.status ?? rpcStatus)
          .end(
            JSON.stringify(reply ? (reply.value ?? null) : revealed ? 'fixture-revealed-key' : null)
          );
      } else if (request.method === 'GET' && request.url?.endsWith('/balance')) {
        rpcRequests++;
        const reply = balanceReplies.shift();
        response.writeHead(reply?.status ?? rpcStatus).end(JSON.stringify(reply?.value ?? balance));
      } else {
        response.writeHead(404).end('{}');
      }
    });
  });

  beforeEach(async () => {
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    replies = [];
    balance = '15000000';
    rpcStatus = 200;
    balanceReplies = [];
    managerReplies = [];
    revealed = false;
    requests = [];
    keyRequests = 0;
    rpcRequests = 0;
    keyRequestTimes = [];
    vi.resetModules();
    vi.stubEnv('TAQUITO_KEYGEN_URL', base);
    vi.stubEnv('TEZOS_RPC_SHADOWNET', base);
    vi.stubEnv('TAQUITO_FRESH_KEY_PREFETCH', '0');
    vi.stubEnv('TAQUITO_FRESH_KEY_RETRY_MS', '0');
    vi.stubEnv('TAQUITO_ITEST_DIAGNOSTICS', 'true');
    vi.stubEnv('RPC_CACHE_MILLISECONDS', '0');
    for (const flag of [
      'RUN_WITH_SECRET_KEY',
      'RUN_SHADOWNET_WITH_SECRET_KEY',
      'RUN_WEEKLYNET_WITH_SECRET_KEY',
      'RUN_TEZLINKSHADOWNET_WITH_SECRET_KEY',
    ])
      vi.stubEnv(flag, '');
    warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  const config = async () => (await import('../config')).CONFIGS()[0];

  describe('transient-service regression', () => {
    it.each([502, 503, 504])(
      'recovers from HTTP %i within the existing attempt budget',
      async (status) => {
        replies = [status, 200];
        const selected = await config();
        await selected.setup({ preferFreshKey: true, minBalanceMutez: 5000000, maxAttempts: 3 });
        expect(keyRequests).toBe(2);
        expect(rpcRequests).toBe(2);
        expect(await selected.lib.signer.publicKeyHash()).toBe(pkh);
        const payloads = requests
          .filter((request) => request.method === 'POST')
          .map((request) => request.body);
        expect(payloads).toEqual(
          Array(2).fill({
            require_unrevealed: false,
            key_prefixes: ['tz1'],
            max_selection_attempts: 3,
            min_balance_mutez: 5000000,
          })
        );
        expect(
          log.mock.calls.some(([message]) => String(message).includes('fresh-key-request-retry'))
        ).toBe(true);
        expect(warn).toHaveBeenCalled();
      }
    );

    it('waits for the configured delay before the next direct request', async () => {
      replies = [504, 200];
      const selected = await config();
      await selected.setup({ preferFreshKey: true, maxAttempts: 2, retryDelayMs: 100 });
      expect(keyRequests).toBe(2);
      expect(keyRequestTimes[1] - keyRequestTimes[0]).toBeGreaterThanOrEqual(90);
    });

    it('stops after the configured number of transient failures and preserves the HTTP error', async () => {
      replies = [504, 504, 504, 200];
      const selected = await config();
      await expect(selected.setup({ preferFreshKey: true, maxAttempts: 3 })).rejects.toMatchObject({
        name: 'HttpResponseError',
        status: 504,
        url: `${base}/v2/shadownet`,
      });
      expect(keyRequests).toBe(3);
      expect(rpcRequests).toBe(0);
    });

    it('uses the same budget for service failures and rejected key constraints', async () => {
      replies = [504, 200, 200, 200];
      balance = '1';
      const selected = await config();
      await expect(
        selected.setup({ preferFreshKey: true, minBalanceMutez: 5000000, maxAttempts: 3 })
      ).rejects.toThrow('after 3 attempts');
      expect(keyRequests).toBe(3);
      expect(rpcRequests).toBe(4);
    });

    it('recovers when the consumed prefetch entry failed', async () => {
      vi.stubEnv('TAQUITO_FRESH_KEY_PREFETCH', '1');
      replies = [504, 200];
      const selected = await config();
      await selected.setup({ preferFreshKey: true, maxAttempts: 3, requireUnrevealed: true });
      expect(await selected.lib.signer.publicKeyHash()).toBe(pkh);
      expect(rpcRequests).toBe(2);
      expect(
        log.mock.calls.some(([message]) => String(message).includes('fresh-key-request-retry'))
      ).toBe(true);
    });

    it('disables prefetch for high-balance requests that require on-chain top-up', async () => {
      vi.stubEnv('TAQUITO_FRESH_KEY_PREFETCH', '4');
      balance = '20000000';
      replies = [503, 200];
      const selected = await config();
      await selected.setup({
        preferFreshKey: true,
        minBalanceMutez: 20_000_000,
        maxAttempts: 3,
        retryDelayMs: 50,
      });
      expect(keyRequests).toBe(2);
      expect(keyRequestTimes[1] - keyRequestTimes[0]).toBeGreaterThanOrEqual(40);
      expect(await selected.lib.signer.publicKeyHash()).toBe(pkh);
    });
  });

  describe('required RPC state', () => {
    const readRequests = (field: string) =>
      requests.filter((request) => request.path.endsWith(`/${field}`));

    it.each(['balance', 'manager_key'])(
      'preserves a persistent %s failure without requesting another key',
      async (field) => {
        rpcStatus = 503;
        const selected = await config();
        await expect(
          selected.setup({
            preferFreshKey: true,
            minBalanceMutez: field === 'balance' ? 5000000 : 0,
            requireUnrevealed: field === 'manager_key',
            maxAttempts: 3,
          })
        ).rejects.toMatchObject({
          name: 'HttpResponseError',
          status: 503,
          url: `${base}/chains/main/blocks/head/context/contracts/${pkh}/${field}`,
        });
        expect(keyRequests).toBe(1);
        expect(readRequests(field)).toHaveLength(4);
        expect(rpcRequests).toBe(6);
        expect(warn.mock.calls.some(([message]) => String(message).includes('rejected key'))).toBe(
          false
        );
      }
    );

    it.each(['balance', 'manager_key'])(
      'retries only the failed required %s read for the same key despite cached rejection',
      async (field) => {
        vi.stubEnv('RPC_CACHE_MILLISECONDS', '60000');
        const failures = [{ status: 503 }, { status: 503 }, { status: 200 }];
        if (field === 'balance') balanceReplies = failures;
        else managerReplies = failures;
        const selected = await config();
        await selected.setup({
          preferFreshKey: true,
          minBalanceMutez: 5000000,
          requireUnrevealed: true,
          maxAttempts: 1,
        });
        if (field === 'balance') {
          expect((await selected.lib.rpc.getBalance(pkh)).toString()).toBe(balance);
        } else {
          expect(await selected.lib.rpc.getManagerKey(pkh)).toBeNull();
        }
        (await import('../config')).clearRpcCache(selected.lib);
        expect(keyRequests).toBe(1);
        expect(readRequests(field)).toHaveLength(3);
        expect(rpcRequests).toBe(4);
        expect(readRequests(field).every((request) => request.path.includes(`/${pkh}/`))).toBe(
          true
        );
      }
    );

    it.each([400, 401, 403, 404, 500])('does not retry a required HTTP %i read', async (status) => {
      balanceReplies = [{ status }];
      const selected = await config();
      await expect(
        selected.setup({ preferFreshKey: true, minBalanceMutez: 5000000 })
      ).rejects.toMatchObject({ status });
      expect(keyRequests).toBe(1);
      expect(rpcRequests).toBe(2);
    });

    it.each(['not-a-balance', 'NaN', '-1', '1.5', 'Infinity'])(
      'rejects malformed required balance %s without allocating another key',
      async (value) => {
        balanceReplies = [{ status: 200, value }];
        const selected = await config();
        await expect(
          selected.setup({ preferFreshKey: true, minBalanceMutez: 5000000 })
        ).rejects.toThrow(
          value === 'not-a-balance' ? '[BigNumber Error] Not a number' : 'Invalid balance returned'
        );
        expect(keyRequests).toBe(1);
        expect(rpcRequests).toBe(2);
      }
    );

    it.each(['', false, 0, {}, { key: '' }, { key: null }])(
      'rejects malformed required manager key %j without allocating another key',
      async (value) => {
        managerReplies = [{ status: 200, value }];
        const selected = await config();
        await expect(
          selected.setup({ preferFreshKey: true, requireUnrevealed: true })
        ).rejects.toThrow('Invalid manager key returned');
        expect(keyRequests).toBe(1);
        expect(rpcRequests).toBe(2);
      }
    );

    it('retains legacy revealed manager-key responses', async () => {
      managerReplies = [{ status: 200, value: { key: 'fixture-revealed-key' } }];
      const selected = await config();
      await selected.setup({ preferFreshKey: true, requireUnrevealed: true, maxAttempts: 2 });
      expect(keyRequests).toBe(2);
      expect(rpcRequests).toBe(4);
    });

    it('preserves a required request timeout without retrying', async () => {
      const selected = await config();
      const { HttpTimeoutError } = await import('@taquito/http-utils');
      const error = new HttpTimeoutError(30000, `${base}/balance`);
      const read = vi.spyOn(selected.lib.rpc, 'getBalance').mockRejectedValue(error);
      await expect(selected.setup({ preferFreshKey: true, minBalanceMutez: 5000000 })).rejects.toBe(
        error
      );
      expect(read).toHaveBeenCalledTimes(1);
      expect(keyRequests).toBe(1);
    });

    it.each([
      { kind: 'socket', retry: true },
      { kind: 'tls', retry: false },
      { kind: undefined, retry: false },
    ] satisfies Array<{ kind: TransportErrorKind | undefined; retry: boolean }>)(
      'handles classified $kind transport failures without allocating another key',
      async ({ kind, retry }) => {
        const selected = await config();
        const { HttpRequestFailed } = await import('@taquito/http-utils');
        const cause = new Error('fixture transport failure');
        const error = new HttpRequestFailed(
          'GET',
          `${base}/balance`,
          cause,
          kind ? { kind, original: cause, mayHaveReachedServer: true } : undefined
        );
        const read = vi.spyOn(selected.lib.rpc, 'getBalance').mockRejectedValueOnce(error);
        const setup = selected.setup({ preferFreshKey: true, minBalanceMutez: 5000000 });
        if (retry) await setup;
        else await expect(setup).rejects.toBe(error);
        expect(read).toHaveBeenCalledTimes(retry ? 2 : 1);
        expect(keyRequests).toBe(1);
        expect(rpcRequests).toBe(retry ? 2 : 1);
      }
    );

    it('bounds the added retry wait and preserves the original failure', async () => {
      const selected = await config();
      const { HttpResponseError } = await import('@taquito/http-utils');
      const error = new HttpResponseError(
        'fixture unavailable',
        503,
        'Unavailable',
        '',
        `${base}/balance`
      );
      vi.spyOn(selected.lib.rpc, 'getManagerKey').mockResolvedValue('fixture-manager-key');
      const read = vi.spyOn(selected.lib.rpc, 'getBalance').mockRejectedValueOnce(error);
      const started = new Promise<void>((resolve) => {
        read.mockImplementationOnce(() => {
          vi.useFakeTimers();
          resolve();
          return new Promise(() => {});
        });
      });
      const setup = expect(
        selected.setup({ preferFreshKey: true, minBalanceMutez: 5000000 })
      ).rejects.toBe(error);
      try {
        await started;
        await vi.advanceTimersByTimeAsync(5000);
        await setup;
        expect(read).toHaveBeenCalledTimes(2);
        expect(keyRequests).toBe(1);
        expect(vi.getTimerCount()).toBe(0);
      } finally {
        vi.useRealTimers();
      }
    });

    it('still selects another key after a successful read reports a low balance', async () => {
      balanceReplies = [{ status: 200, value: '1' }, { status: 200 }];
      const selected = await config();
      await selected.setup({ preferFreshKey: true, minBalanceMutez: 5000000, maxAttempts: 2 });
      expect(keyRequests).toBe(2);
      expect(rpcRequests).toBe(4);
    });

    it('keeps optional manager failures nonfatal with diagnostics disabled', async () => {
      vi.stubEnv('TAQUITO_ITEST_DIAGNOSTICS', 'false');
      managerReplies = [{ status: 503 }, { status: 503 }];
      const selected = await config();
      await selected.setup({ preferFreshKey: true, minBalanceMutez: 5000000 });
      expect(keyRequests).toBe(1);
      expect(rpcRequests).toBe(3);
      expect(log).not.toHaveBeenCalled();
    });
  });

  describe('previously valid behavior', () => {
    it('does not retry signer construction failures', async () => {
      replies = ['invalid-key', 200];
      const selected = await config();
      await expect(selected.setup({ preferFreshKey: true, maxAttempts: 3 })).rejects.toThrow();
      expect(keyRequests).toBe(1);
      expect(rpcRequests).toBe(0);
    });

    it('retains null RPC state when no balance threshold is required', async () => {
      rpcStatus = 503;
      const selected = await config();
      await selected.setup({ preferFreshKey: true, maxAttempts: 3 });
      expect(await selected.lib.signer.publicKeyHash()).toBe(pkh);
      expect(keyRequests).toBe(1);
      expect(rpcRequests).toBe(4);
      expect(
        log.mock.calls.some(([message]) => String(message).includes('fresh-key-request-retry'))
      ).toBe(false);
    });

    it('selects a successful key on the first request', async () => {
      const selected = await config();
      await selected.setup({ preferFreshKey: true, maxAttempts: 3 });
      expect(keyRequests).toBe(1);
      expect(rpcRequests).toBe(2);
      expect(await selected.lib.signer.publicKeyHash()).toBe(pkh);
    });

    it.each([400, 401, 403, 404, 500])(
      'does not retry HTTP %i outside the selected transient statuses',
      async (status) => {
        replies = [status, 200];
        const selected = await config();
        await expect(
          selected.setup({ preferFreshKey: true, maxAttempts: 3 })
        ).rejects.toMatchObject({
          name: 'HttpResponseError',
          status,
        });
        expect(keyRequests).toBe(1);
        expect(rpcRequests).toBe(0);
      }
    );

    it('does not retry a malformed successful response', async () => {
      replies = ['malformed', 200];
      const selected = await config();
      await expect(selected.setup({ preferFreshKey: true, maxAttempts: 3 })).rejects.toThrow(
        'did not return secret_key'
      );
      expect(keyRequests).toBe(1);
      expect(rpcRequests).toBe(0);
    });

    it('keeps a one-attempt limit', async () => {
      replies = [504, 200];
      const selected = await config();
      await expect(selected.setup({ preferFreshKey: true, maxAttempts: 1 })).rejects.toMatchObject({
        status: 504,
      });
      expect(keyRequests).toBe(1);
    });

    it('continues to reject insufficiently funded keys', async () => {
      balance = '1';
      const selected = await config();
      await expect(
        selected.setup({ preferFreshKey: true, minBalanceMutez: 5000000, maxAttempts: 2 })
      ).rejects.toThrow('balance_below_5000000');
      expect(keyRequests).toBe(2);
      expect(rpcRequests).toBe(4);
    });

    it('continues to reject revealed keys when an unrevealed key is required', async () => {
      revealed = true;
      const selected = await config();
      await expect(
        selected.setup({ preferFreshKey: true, requireUnrevealed: true, maxAttempts: 2 })
      ).rejects.toThrow('already_revealed');
      expect(keyRequests).toBe(2);
      expect(rpcRequests).toBe(4);
    });
  });
});
