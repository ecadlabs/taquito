import { vi } from 'vitest';
import {
  HttpRequestFailed,
  HttpResponseError,
  HttpTimeoutError,
  STATUS_CODE,
} from '@taquito/http-utils';
import { Context } from '@taquito/taquito';
import { IpfsHttpHandler } from '../../src/handlers/ipfs-handler';
import { MetadataProvider } from '../../src/metadata-provider';
import { Tzip16Module } from '../../src/tzip16-extension';
import {
  blocks,
  fixtures,
  gatewayResponse,
  metadataContract,
} from '../fixtures/metadata-integrity';

describe('TZIP-16 IPFS HTTP handler', () => {
  const { context, contract } = metadataContract();
  const cid = fixtures.raw.cid;
  const uri = { sha256hash: undefined, protocol: 'ipfs', location: `//${cid}` };

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it.each([undefined, ''])('uses the default gateway when given %s', async (gateway) => {
    const hosts: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      hosts.push(new Request(input, init).url);
      return gatewayResponse(input, init, blocks, null);
    });
    await expect(new IpfsHttpHandler(gateway).getMetadata(contract, uri, context)).resolves.toBe(
      fixtures.metadata
    );
    expect([...new Set(hosts.map((url) => new URL(url).hostname))]).toEqual(['ipfs.filebase.io']);
  });

  it('uses verified retrieval through the default Tzip16Module', async () => {
    const hosts: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      hosts.push(new URL(new Request(input, init).url).hostname);
      return gatewayResponse(input, init, blocks, null);
    });
    const metadataContext = Object.assign(new Context('https://rpc.example.com'), {
      metadataProvider: new MetadataProvider(new Map()),
    });
    new Tzip16Module().configureContext(metadataContext);
    await expect(
      metadataContext.metadataProvider.provideMetadata(contract, `ipfs://${cid}`, metadataContext)
    ).resolves.toMatchObject({ uri: `ipfs://${cid}`, metadata: { name: 'Verified café' } });
    expect([...new Set(hosts)]).toEqual(['ipfs.filebase.io']);
  });

  it.each(['gateway.example.com', 'ipfs.io', 'dweb.link'])(
    'preserves the explicit gateway %s and resolves the committed directory path',
    async (gateway) => {
      const hosts: string[] = [];
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
        hosts.push(new URL(new Request(input, init).url).hostname);
        return gatewayResponse(input, init, blocks, null);
      });
      await expect(
        new IpfsHttpHandler(gateway).getMetadata(
          contract,
          { ...uri, location: `//${fixtures.directory.cid}/metadata.json` },
          context
        )
      ).resolves.toBe(fixtures.metadata);
      expect([...new Set(hosts)]).toEqual([gateway]);
    }
  );

  it.each([STATUS_CODE.TOO_MANY_REQUESTS, STATUS_CODE.SERVICE_UNAVAILABLE, STATUS_CODE.NOT_FOUND])(
    'explains an IPFS HTTP %s failure and preserves response details',
    async (status) => {
      const urls: string[] = [];
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
        urls.push(new Request(input, init).url);
        return new Response('Gateway response', { status, statusText: 'Gateway failure' });
      });
      const result = new IpfsHttpHandler('gateway.example.com').getMetadata(contract, uri, context);
      await expect(result).rejects.toBeInstanceOf(HttpResponseError);
      await expect(result).rejects.toMatchObject({
        status,
        statusText: 'Gateway failure',
        body: 'Gateway response',
        url: expect.stringContaining('gateway.example.com'),
        message: expect.stringContaining('IpfsHttpHandler'),
      });
      const error: unknown = await result.catch((reason: unknown) => reason);
      if (!(error instanceof HttpResponseError)) throw new Error('Expected HTTP response error');
      expect(urls).toContain(error.url);
      expect(error.message).toContain(error.url);
      expect(error.message).toContain(String(status));
      expect([...new Set(urls.map((url) => new URL(url).hostname))]).toEqual([
        'gateway.example.com',
      ]);
    }
  );

  it('explains an IPFS timeout and preserves its duration and URL', async () => {
    vi.useFakeTimers();
    const urls: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
      const request = new Request(input, init);
      urls.push(request.url);
      return new Promise<Response>((_resolve, reject) => {
        request.signal.addEventListener(
          'abort',
          () => reject(new DOMException('Timed out', 'AbortError')),
          { once: true }
        );
      });
    });
    const result = new IpfsHttpHandler('gateway.example.com').getMetadata(contract, uri, context);
    const outcome = result.catch((error: unknown) => error);
    await vi.runAllTimersAsync();
    const error = await outcome;
    expect(error).toBeInstanceOf(HttpTimeoutError);
    if (!(error instanceof HttpTimeoutError)) throw new Error('Expected timeout error');
    expect(error.timeout).toBe(10000);
    expect(urls).toContain(error.url);
    expect(error.message).toContain(String(error.timeout));
    expect(error.message).toContain('IpfsHttpHandler');
    expect(error.message).toMatch(/SLA|self-hosted/i);
    expect(error.message).toContain(error.url);
    expect([...new Set(urls.map((url) => new URL(url).hostname))]).toEqual(['gateway.example.com']);
  });

  it('explains an IPFS network failure and preserves its underlying cause', async () => {
    const cause = new TypeError('Failed to fetch');
    const urls: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      urls.push(new Request(input, init).url);
      throw cause;
    });
    const result = new IpfsHttpHandler('gateway.example.com').getMetadata(contract, uri, context);
    await expect(result).rejects.toBeInstanceOf(HttpRequestFailed);
    await expect(result).rejects.toMatchObject({
      method: 'GET',
      cause,
      message: expect.stringContaining('IpfsHttpHandler'),
    });
    const error: unknown = await result.catch((reason: unknown) => reason);
    if (!(error instanceof HttpRequestFailed)) throw new Error('Expected request failure');
    expect(urls).toContain(error.url);
    expect(error.message).toContain(error.url);
    expect(error.message).toContain('Failed to fetch');
    expect([...new Set(urls.map((url) => new URL(url).hostname))]).toEqual(['gateway.example.com']);
  });
});
