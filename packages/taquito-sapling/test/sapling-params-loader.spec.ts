import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Buffer } from 'buffer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const initParameters = vi.fn();
const withProvingContext = vi.fn();
const getOutgoingViewingKey = vi.fn();

vi.mock('../src/sapling-wasm', () => ({
  initParameters,
  withProvingContext,
  getOutgoingViewingKey,
}));

const spendDigest = '8e48ffd23abb3a5fd9c5589204f32d9c31285a04b78096ba40a79b75677efc13';
const outputDigest = '2f0ebbcbb9bb0bcffe95a397e7eba89c29eb4dde6191c339db88570e3f3fb0e4';

const hexToArrayBuffer = (hex: string) => Uint8Array.from(Buffer.from(hex, 'hex')).buffer;

describe('Sapling params loader', () => {
  const originalCrypto = globalThis.crypto;
  const originalFetch = globalThis.fetch;
  const originalProcess = globalThis.process;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    initParameters.mockResolvedValue(undefined);
    withProvingContext.mockImplementation(async (action: (context: number) => Promise<unknown>) =>
      action(17)
    );
    getOutgoingViewingKey.mockResolvedValue(Buffer.from('outgoing-viewing-key'));
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'crypto', {
      value: originalCrypto,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'fetch', {
      value: originalFetch,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'process', {
      value: originalProcess,
      configurable: true,
    });
  });

  it('exports initSapling and preloadSaplingParams from the public package entry', async () => {
    const saplingModule = (await import('../src/taquito-sapling')) as Record<string, unknown>;

    expect(saplingModule.initSapling).toEqual(expect.any(Function));
    expect(saplingModule.preloadSaplingParams).toEqual(expect.any(Function));
  });

  it('does not load proving params for viewing-only wrapper calls, then lazy-loads them once for proving flows', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(Uint8Array.from([1, 2, 3])))
      .mockResolvedValueOnce(new Response(Uint8Array.from([4, 5, 6])));
    const digestMock = vi
      .fn()
      .mockResolvedValueOnce(hexToArrayBuffer(spendDigest))
      .mockResolvedValueOnce(hexToArrayBuffer(outputDigest));

    Object.defineProperty(globalThis, 'fetch', {
      value: fetchMock,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        subtle: { digest: digestMock },
      },
      configurable: true,
    });

    const { initSapling } = (await import('../src/taquito-sapling')) as {
      initSapling: (options?: unknown) => Promise<void>;
    };
    const { SaplingWrapper } = (await import('../src/sapling-module-wrapper')) as {
      SaplingWrapper: new () => {
        getOutgoingViewingKey(vk: Buffer): Promise<Buffer>;
        withProvingContext<T>(action: (context: number) => Promise<T>): Promise<T>;
      };
    };

    await initSapling();

    const wrapper = new SaplingWrapper();
    await wrapper.getOutgoingViewingKey(Buffer.alloc(32));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(initParameters).not.toHaveBeenCalled();

    await expect(wrapper.withProvingContext(async (context) => context)).resolves.toEqual(17);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      'https://sapling.taquito.io/params/groth16-mainnet-1/spend.params',
      'https://sapling.taquito.io/params/groth16-mainnet-1/output.params',
    ]);
    expect(digestMock).toHaveBeenCalledTimes(2);
    expect(initParameters).toHaveBeenCalledTimes(1);

    await expect(wrapper.withProvingContext(async () => 'done')).resolves.toEqual('done');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(initParameters).toHaveBeenCalledTimes(1);
  });

  it('dedupes concurrent preload calls and supports trusted local file paths without digests', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'sapling-params-'));
    const spendParams = Buffer.from('local-spend-params');
    const outputParams = Buffer.from('local-output-params');
    const spendPath = join(tempDir, 'sapling-spend.params');
    const outputPath = join(tempDir, 'sapling-output.params');

    await writeFile(spendPath, spendParams);
    await writeFile(outputPath, outputParams);

    Object.defineProperty(globalThis, 'fetch', {
      value: vi.fn(),
      configurable: true,
    });

    const { initSapling, preloadSaplingParams } = (await import('../src/taquito-sapling')) as {
      initSapling: (options?: unknown) => Promise<void>;
      preloadSaplingParams: () => Promise<void>;
    };

    await initSapling({
      params: {
        spendParamsPath: spendPath,
        outputParamsPath: outputPath,
      },
    });

    await Promise.all([preloadSaplingParams(), preloadSaplingParams()]);

    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(initParameters).toHaveBeenCalledTimes(1);
    expect(initParameters).toHaveBeenCalledWith(spendParams, outputParams);
  });

  it('rejects custom remote URLs without explicit digests', async () => {
    const { initSapling } = (await import('../src/taquito-sapling')) as {
      initSapling: (options?: unknown) => Promise<void>;
    };

    await expect(
      initSapling({
        params: {
          spendParamsUrl: 'https://example.test/spend.params',
          outputParamsUrl: 'https://example.test/output.params',
        },
      })
    ).rejects.toThrow(/digest/i);
  });

  it('allows switching parameter sources after a failed load before any params are initialized', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string | URL | Request) => {
      const normalizedUrl = String(url);

      if (normalizedUrl.startsWith('https://sapling.taquito.io/')) {
        throw new Error('mirror unavailable');
      }

      if (normalizedUrl === 'https://download.z.cash/downloads/sapling-spend.params') {
        return new Response(Uint8Array.from([1, 2, 3]));
      }

      if (normalizedUrl === 'https://download.z.cash/downloads/sapling-output.params') {
        return new Response(Uint8Array.from([4, 5, 6]));
      }

      throw new Error(`Unexpected URL ${normalizedUrl}`);
    });
    const digestMock = vi
      .fn()
      .mockResolvedValueOnce(hexToArrayBuffer(spendDigest))
      .mockResolvedValueOnce(hexToArrayBuffer(outputDigest));

    Object.defineProperty(globalThis, 'fetch', {
      value: fetchMock,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        subtle: { digest: digestMock },
      },
      configurable: true,
    });

    const { initSapling, preloadSaplingParams } = (await import('../src/taquito-sapling')) as {
      initSapling: (options?: unknown) => Promise<void>;
      preloadSaplingParams: () => Promise<void>;
    };

    await initSapling({ params: { source: 'taquito' } });
    await expect(preloadSaplingParams()).rejects.toMatchObject({
      code: 'SAPLING_PARAMS_FETCH_FAILED',
      source: 'taquito',
    });

    await initSapling({ params: { source: 'zcash' } });
    await expect(preloadSaplingParams()).resolves.toBeUndefined();

    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      'https://sapling.taquito.io/params/groth16-mainnet-1/spend.params',
      'https://sapling.taquito.io/params/groth16-mainnet-1/output.params',
      'https://download.z.cash/downloads/sapling-spend.params',
      'https://download.z.cash/downloads/sapling-output.params',
    ]);
    expect(initParameters).toHaveBeenCalledTimes(1);
  });

  it('rejects local params in browser-like runtimes without Node filesystem access', async () => {
    const { initSapling, preloadSaplingParams } = (await import('../src/taquito-sapling')) as {
      initSapling: (options?: unknown) => Promise<void>;
      preloadSaplingParams: () => Promise<void>;
    };

    await initSapling({
      params: {
        spendParamsPath: '/tmp/spend.params',
        outputParamsPath: '/tmp/output.params',
      },
    });

    Object.defineProperty(globalThis, 'process', {
      value: {
        ...originalProcess,
        versions: {},
      },
      configurable: true,
    });

    await expect(preloadSaplingParams()).rejects.toMatchObject({
      code: 'SAPLING_PARAMS_UNSUPPORTED_RUNTIME',
      source: 'local',
    });
  });

  it('reports the expected and actual SHA-256 digests when integrity verification fails', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(Uint8Array.from([1, 2, 3])))
      .mockResolvedValueOnce(new Response(Uint8Array.from([4, 5, 6])));
    const actualDigest = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const digestMock = vi.fn().mockResolvedValue(hexToArrayBuffer(actualDigest));

    Object.defineProperty(globalThis, 'fetch', {
      value: fetchMock,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        subtle: { digest: digestMock },
      },
      configurable: true,
    });

    const { preloadSaplingParams } = (await import('../src/taquito-sapling')) as {
      preloadSaplingParams: () => Promise<void>;
    };

    try {
      await preloadSaplingParams();
      throw new Error('Expected preloadSaplingParams to reject');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toMatchObject({
        code: 'SAPLING_PARAMS_HASH_MISMATCH',
        source: 'taquito',
      });
      expect((error as Error).message).toContain(spendDigest);
      expect((error as Error).message).toContain(actualDigest);
    }
  });
});
