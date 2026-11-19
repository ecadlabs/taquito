import { beforeEach, afterEach, it, expect, vi } from 'vitest';
beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.stubEnv('TAQUITO_HTTP_RETRY_COUNT', '1');
  vi.stubEnv('TAQUITO_HTTP_RETRY_BASE_MS', '0');
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
it.each([429, 500])(
  'does not retry POST HTTP %s, including an injection endpoint',
  async (status) => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        new Response('connection reset', { status, headers: { 'Retry-After': '0' } })
      );
    vi.stubGlobal('fetch', fetch);
    const { HttpBackend, HttpResponseError } = await import('../src/taquito-http-utils');
    const result = new HttpBackend().createRequest(
      { url: 'https://rpc.example/injection/operation', method: 'POST' },
      'signedbytes'
    );
    await expect(result).rejects.toBeInstanceOf(HttpResponseError);
    await expect(result).rejects.toMatchObject({ status, body: 'connection reset' });
    expect(fetch).toHaveBeenCalledTimes(1);
  }
);
it.each([400, 404, 500])('does not retry unrelated GET HTTP %s', async (status) => {
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValue(new Response('connection reset', { status }));
  vi.stubGlobal('fetch', fetch);
  const { HttpBackend } = await import('../src/taquito-http-utils');
  await expect(
    new HttpBackend().createRequest({ url: 'https://rpc.example/read' })
  ).rejects.toMatchObject({ status, body: 'connection reset' });
  expect(fetch).toHaveBeenCalledTimes(1);
});
it('retains eligible POST transport recovery with identical serialized bytes', async () => {
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockRejectedValueOnce(new TypeError('fetch failed'))
    .mockResolvedValueOnce(Response.json('ok'));
  vi.stubGlobal('fetch', fetch);
  const { HttpBackend } = await import('../src/taquito-http-utils');
  const result = new HttpBackend().createRequest(
    { url: 'https://rpc.example/helpers/forge/operations', method: 'POST' },
    { branch: 'fixed' }
  );
  const checked = expect(result).resolves.toBe('ok');
  await vi.runAllTimersAsync();
  await checked;
  expect(fetch.mock.calls.map(([, init]) => init?.body)).toEqual([
    '{"branch":"fixed"}',
    '{"branch":"fixed"}',
  ]);
});
it('preserves a successful raw-text GET', async () => {
  const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(new Response('text'));
  vi.stubGlobal('fetch', fetch);
  const { HttpBackend } = await import('../src/taquito-http-utils');
  expect(
    await new HttpBackend().createRequest({ url: 'https://rpc.example/read', json: false })
  ).toBe('text');
  expect(fetch).toHaveBeenCalledTimes(1);
});

it('preserves the status and excessive Retry-After when the error body cannot be read', async () => {
  const body = new ReadableStream({
    start(controller) {
      controller.error(new TypeError('fetch failed'));
    },
  });
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValueOnce(new Response(body, { status: 429, headers: { 'Retry-After': '31' } }))
    .mockResolvedValueOnce(Response.json('ok'));
  vi.stubGlobal('fetch', fetch);
  const { HttpBackend } = await import('../src/taquito-http-utils');
  await expect(
    new HttpBackend().createRequest({ url: 'https://rpc.example/read' })
  ).rejects.toMatchObject({
    status: 429,
  });
  expect(fetch).toHaveBeenCalledTimes(1);
});

it('cancels a Retry-After wait with the external abort reason', async () => {
  const controller = new AbortController();
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValueOnce(new Response('busy', { status: 429, headers: { 'Retry-After': '30' } }));
  vi.stubGlobal('fetch', fetch);
  const { HttpBackend } = await import('../src/taquito-http-utils');
  const pending = new HttpBackend().createRequest({
    url: 'https://rpc.example/read',
    signal: controller.signal,
  });
  const reason = new Error('stop waiting');
  const checked = expect(pending).rejects.toBe(reason);
  await vi.advanceTimersByTimeAsync(1);
  controller.abort(reason);
  await checked;
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(vi.getTimerCount()).toBe(0);
});

it.each(['gateway-status', 'transport'] as const)(
  'cancels a %s backoff with the external abort reason',
  async (failure) => {
    vi.stubEnv('TAQUITO_HTTP_RETRY_BASE_MS', '10000');
    const controller = new AbortController();
    const fetch = vi.fn<typeof globalThis.fetch>();
    if (failure === 'gateway-status') {
      fetch.mockResolvedValueOnce(new Response('unavailable', { status: 503 }));
    } else {
      fetch.mockRejectedValueOnce(new TypeError('fetch failed'));
    }
    vi.stubGlobal('fetch', fetch);
    const { HttpBackend } = await import('../src/taquito-http-utils');
    const pending = new HttpBackend().createRequest({
      url: 'https://rpc.example/chains/main/blocks/head/hash',
      signal: controller.signal,
    });
    const reason = new Error('stop waiting');
    const checked = expect(pending).rejects.toBe(reason);
    await vi.advanceTimersByTimeAsync(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    controller.abort(reason);
    await checked;
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  }
);

it('applies the same GET rate-limit policy to bounded binary requests', async () => {
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValueOnce(new Response('busy', { status: 429, headers: { 'Retry-After': '0' } }))
    .mockResolvedValueOnce(new Response(new Uint8Array([4, 2])));
  vi.stubGlobal('fetch', fetch);
  const { HttpBackend } = await import('../src/taquito-http-utils');
  const pending = new HttpBackend().createRequestBytes({ url: 'https://rpc.example/bytes' }, 2);
  const checked = expect(pending).resolves.toEqual(new Uint8Array([4, 2]));
  await vi.runAllTimersAsync();
  await checked;
  expect(fetch).toHaveBeenCalledTimes(2);
});
