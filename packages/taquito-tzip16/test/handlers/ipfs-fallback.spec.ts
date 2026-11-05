import { vi } from 'vitest';
import { IpfsHttpHandler } from '../../src/handlers/ipfs-handler';
import { MetadataProvider } from '../../src/metadata-provider';
import {
  blocks,
  fixtures,
  gatewayResponse,
  metadataContract,
} from '../fixtures/metadata-integrity';

describe('default IPFS gateway fallback', () => {
  const { context, contract } = metadataContract();
  const uri = `ipfs://${fixtures.raw.cid}`;
  afterEach(() => vi.restoreAllMocks());

  it.each(['explicit', 'default'])(
    'does not start child requests after the %s gateway deadline',
    async (selection) => {
      const timeout = 1000;
      let now = 0;
      vi.spyOn(Date, 'now').mockImplementation(() => now);
      const requests: URL[] = [];
      const firstHost = selection === 'explicit' ? 'private.example.com' : 'ipfs.filebase.io';
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
        const url = new URL(input instanceof Request ? input.url : input.toString());
        requests.push(url);
        // Advance wall time without running timer callbacks, as synchronous decoding can do.
        if (url.hostname === firstHost) now = timeout;
        return gatewayResponse(input, init);
      });
      const handler = new IpfsHttpHandler(
        selection === 'explicit' ? firstHost : undefined,
        timeout
      );
      const result = handler.getMetadata(
        contract,
        {
          protocol: 'ipfs',
          location: `//${fixtures.multi.cid}`,
          sha256hash: undefined,
        },
        context
      );
      if (selection === 'explicit') {
        await expect(result).rejects.toMatchObject({ name: 'HttpTimeoutError', timeout });
      } else {
        await expect(result).resolves.toBe(fixtures.metadata);
        expect([...new Set(requests.map((url) => url.hostname))]).toEqual([
          firstHost,
          'gateway.pinata.cloud',
        ]);
      }
      expect(
        requests.filter((url) => url.hostname === firstHost).map((url) => url.pathname)
      ).toEqual([`/ipfs/${fixtures.multi.cid}`]);
    }
  );

  it.each(['rate limit', 'HTML', 'malformed JSON', 'wrong hash'])(
    'tries another gateway after %s and returns verified metadata',
    async (failure) => {
      const hosts: string[] = [];
      vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
        const url = new URL(input instanceof Request ? input.url : input.toString());
        hosts.push(url.hostname);
        if (url.hostname === 'ipfs.filebase.io') {
          if (failure === 'rate limit')
            return Promise.resolve(new Response('Rate limited', { status: 429 }));
          const body =
            failure === 'HTML'
              ? '<html>Unavailable</html>'
              : failure === 'malformed JSON'
                ? '{"name":'
                : '{"name":"Attacker"}';
          if (failure === 'wrong hash') {
            const tampered = blocks.map((block) =>
              block.cid === fixtures.raw.cid
                ? { ...block, hex: Buffer.from(body).toString('hex') }
                : block
            );
            return Promise.resolve(gatewayResponse(input, init, tampered, body));
          }
          return Promise.resolve(new Response(body));
        }
        return Promise.resolve(gatewayResponse(input, init));
      });
      const provider = new MetadataProvider(new Map([['ipfs', new IpfsHttpHandler()]]));
      await expect(provider.provideMetadata(contract, uri, context)).resolves.toMatchObject({
        metadata: { name: 'Verified café' },
      });
      expect(hosts[0]).toBe('ipfs.filebase.io');
      expect(new Set(hosts).size).toBe(2);
    }
  );

  it('retains every gateway failure when the default list is exhausted', async () => {
    const hosts: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = new URL(input instanceof Request ? input.url : input.toString());
      hosts.push(url.hostname);
      return Promise.resolve(new Response(`Failure at ${url.hostname}`, { status: 429 }));
    });
    const provider = new MetadataProvider(new Map([['ipfs', new IpfsHttpHandler()]]));
    const result = provider.provideMetadata(contract, uri, context);
    await expect(result).rejects.toMatchObject({ errors: expect.any(Array) });
    const error: unknown = await result.catch((reason) => reason);
    if (!(error instanceof Error) || !('errors' in error) || !Array.isArray(error.errors)) {
      throw new Error('Expected an aggregate gateway error');
    }
    const distinctHosts = [...new Set(hosts)];
    expect(distinctHosts).toEqual(['ipfs.filebase.io', 'gateway.pinata.cloud']);
    expect(error.message).toMatch(/SLA|self-hosted/i);
    // Preserve every gateway's failure, allowing multiple format attempts per gateway.
    for (const host of distinctHosts) {
      expect(
        error.errors.some((cause) => cause instanceof Error && cause.message.includes(host))
      ).toBe(true);
    }
  });

  it('does not contact another service when a caller explicitly selects a gateway', async () => {
    const hosts: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = new URL(input instanceof Request ? input.url : input.toString());
      hosts.push(url.hostname);
      return Promise.resolve(new Response('Rate limited', { status: 429 }));
    });
    const provider = new MetadataProvider(
      new Map([['ipfs', new IpfsHttpHandler('private.example.com')]])
    );
    await expect(provider.provideMetadata(contract, uri, context)).rejects.toThrow();
    expect([...new Set(hosts)]).toEqual(['private.example.com']);
  });

  it('waits for the first gateway to fail and stops after the next succeeds', async () => {
    vi.useFakeTimers();
    let failFirst: (response: Response) => void = () => {
      throw new Error('First request not started');
    };
    const firstResponse = new Promise<Response>((resolve) => {
      failFirst = resolve;
    });
    let markStarted: () => void = () => {
      throw new Error('Missing start callback');
    };
    const started = new Promise<void>((resolve) => {
      markStarted = resolve;
    });
    const hosts: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
      const url = new URL(input instanceof Request ? input.url : input.toString());
      hosts.push(url.hostname);
      markStarted();
      return url.hostname === 'ipfs.filebase.io'
        ? firstResponse.then((response) => response.clone())
        : Promise.resolve(gatewayResponse(input, init));
    });
    const provider = new MetadataProvider(new Map([['ipfs', new IpfsHttpHandler()]]));
    const result = provider.provideMetadata(contract, uri, context);
    // Handle the baseline's rejection before resolving the deferred gateway.
    const outcome = result.catch((error: unknown) => error);
    try {
      await started;
      await vi.advanceTimersByTimeAsync(5000);
      expect(hosts).toEqual(['ipfs.filebase.io']);
      failFirst(new Response('Rate limited', { status: 429 }));
      await vi.runAllTimersAsync();
      await expect(outcome).resolves.toMatchObject({ metadata: { name: 'Verified café' } });
      await vi.runAllTimersAsync();
      expect(new Set(hosts).size).toBe(2);
    } finally {
      failFirst(new Response('Rate limited', { status: 429 }));
      await vi.runAllTimersAsync();
      await outcome;
      vi.useRealTimers();
    }
  });

  it('does not contact fallback gateways when the first returns valid content', async () => {
    const hosts: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
      const url = new URL(input instanceof Request ? input.url : input.toString());
      hosts.push(url.hostname);
      return Promise.resolve(gatewayResponse(input, init));
    });
    const provider = new MetadataProvider(new Map([['ipfs', new IpfsHttpHandler()]]));
    await expect(provider.provideMetadata(contract, uri, context)).resolves.toMatchObject({
      metadata: { name: 'Verified café' },
    });
    expect([...new Set(hosts)]).toEqual(['ipfs.filebase.io']);
  });

  it('fails closed when every gateway returns substituted valid JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () => new Response('{"name":"Attacker"}')
    );
    const provider = new MetadataProvider(new Map([['ipfs', new IpfsHttpHandler()]]));
    await expect(provider.provideMetadata(contract, uri, context)).rejects.toThrow();
  });

  it('aborts a stalled gateway body before trying the next gateway', async () => {
    vi.useFakeTimers();
    const stalled: {
      signal: AbortSignal;
      controller: ReadableStreamDefaultController<Uint8Array>;
    }[] = [];
    const hosts: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const request = new Request(input, init);
      const host = new URL(request.url).hostname;
      hosts.push(host);
      if (host !== 'ipfs.filebase.io') return gatewayResponse(input, init, blocks, null);
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          stalled.push({ signal: request.signal, controller });
          request.signal.addEventListener(
            'abort',
            () =>
              controller.error(new DOMException('Timed out reading gateway body', 'AbortError')),
            { once: true }
          );
        },
      });
      const format = new URL(request.url).searchParams.get('format');
      const accept = request.headers.get('Accept') ?? '';
      return new Response(body, {
        headers: {
          'Content-Type':
            format === 'car' || accept.includes('application/vnd.ipld.car')
              ? 'application/vnd.ipld.car; version=1'
              : 'application/vnd.ipld.raw',
        },
      });
    });
    const provider = new MetadataProvider(new Map([['ipfs', new IpfsHttpHandler()]]));
    let settled = false;
    const outcome = provider.provideMetadata(contract, uri, context).then(
      (value) => {
        settled = true;
        return value;
      },
      (error: unknown) => {
        settled = true;
        return error;
      }
    );
    try {
      await vi.advanceTimersByTimeAsync(9999);
      expect(hosts).toEqual(['ipfs.filebase.io']);
      expect(stalled.every(({ signal }) => !signal.aborted)).toBe(true);
      await vi.advanceTimersByTimeAsync(1);
      expect(settled).toBe(true);
      expect(stalled.length).toBeGreaterThan(0);
      expect(stalled.every(({ signal }) => signal.aborted)).toBe(true);
      await expect(outcome).resolves.toMatchObject({ metadata: { name: 'Verified café' } });
      expect([...new Set(hosts)]).toEqual(['ipfs.filebase.io', 'gateway.pinata.cloud']);
    } finally {
      for (const { signal, controller } of stalled) {
        if (!signal.aborted) controller.close();
      }
      await vi.runAllTimersAsync();
      await outcome;
      vi.useRealTimers();
    }
  });
});
