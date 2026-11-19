import { beforeEach, afterEach, it, expect, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-25T00:00:00Z'));
  vi.stubEnv('TAQUITO_HTTP_RETRY_COUNT', '1');
  vi.stubEnv('TAQUITO_HTTP_RETRY_BASE_MS', '100');
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
it('honors GET Retry-After seconds and preserves the query and headers', async () => {
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValueOnce(new Response('busy', { status: 429, headers: { 'Retry-After': '2' } }))
    .mockResolvedValueOnce(Response.json({ ok: true }));
  vi.stubGlobal('fetch', fetch);
  const { HttpBackend } = await import('../src/taquito-http-utils');
  const pending = new HttpBackend().createRequest({
    url: 'https://rpc.example/read',
    query: { block: 'head' },
    headers: { Authorization: 'token' },
  });
  const checked = expect(pending).resolves.toEqual({ ok: true });
  await vi.advanceTimersByTimeAsync(1999);
  expect(fetch).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(1);
  await checked;
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch.mock.calls.map(([url]) => url)).toEqual([
    'https://rpc.example/read?block=head',
    'https://rpc.example/read?block=head',
  ]);
  expect(fetch.mock.calls[1]?.[1]?.headers).toMatchObject({ Authorization: 'token' });
});

it.each([
  { header: 'Sun, 25 Oct 2026 00:00:02 GMT', delay: 2000 },
  { header: 'Sunday, 25-Oct-26 00:00:02 GMT', delay: 2000 },
  { header: 'Sun Oct 25 00:00:02 2026', delay: 2000 },
  { header: 'Sat, 24 Oct 2026 23:59:59 GMT', delay: 0 },
  { header: '0', delay: 0 },
  { header: '30', delay: 30000 },
  { header: '1.5', delay: 100 },
  { header: '-1', delay: 100 },
  { header: 'tomorrow', delay: 100 },
  { header: '2026-10-25', delay: 100 },
  { header: 'Sun, 31 Feb 2026 00:00:02 GMT', delay: 100 },
  { header: 'Mon, 25 Oct 2026 00:00:02 GMT', delay: 100 },
])('uses the bounded delay for $header', async ({ header, delay }) => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValueOnce(
      new Response('busy', { status: 429, headers: { 'Retry-After': header } })
    )
    .mockResolvedValueOnce(Response.json('ready'));
  vi.stubGlobal('fetch', fetch);
  const { HttpBackend } = await import('../src/taquito-http-utils');
  const result = new HttpBackend(100).createRequest({ url: 'https://rpc.example/read' });
  const checked = expect(result).resolves.toBe('ready');
  if (delay > 0) {
    await vi.advanceTimersByTimeAsync(delay - 1);
    expect(fetch).toHaveBeenCalledTimes(1);
  }
  await vi.advanceTimersByTimeAsync(delay > 0 ? 1 : 0);
  await checked;
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch.mock.calls[0]?.[1]?.signal?.aborted).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
});
it.each(['31', '99999999999999999999999999', 'Sun, 25 Oct 2026 00:00:31 GMT'])(
  'preserves an excessive server delay %s as an error',
  async (header) => {
    const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(
      new Response('rate limited', {
        status: 429,
        statusText: 'Too Many Requests',
        headers: { 'Retry-After': header },
      })
    );
    vi.stubGlobal('fetch', fetch);
    const { HttpBackend, HttpResponseError } = await import('../src/taquito-http-utils');
    const result = new HttpBackend().createRequest({ url: 'https://rpc.example/read' });
    await expect(result).rejects.toBeInstanceOf(HttpResponseError);
    await expect(result).rejects.toMatchObject({
      status: 429,
      body: 'rate limited',
      statusText: 'Too Many Requests',
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  }
);
it('disables rate-limit retries with the existing environment setting', async () => {
  vi.stubEnv('TAQUITO_HTTP_RETRY_COUNT', '0');
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValue(new Response('busy', { status: 429 }));
  vi.stubGlobal('fetch', fetch);
  const { HttpBackend } = await import('../src/taquito-http-utils');
  await expect(
    new HttpBackend().createRequest({ url: 'https://rpc.example/read' })
  ).rejects.toMatchObject({ status: 429 });
  expect(fetch).toHaveBeenCalledTimes(1);
});
it.each([true, false])(
  'shares the transport and status retry budget, transportFirst=%s',
  async (transportFirst) => {
    const fetch = vi.fn<typeof globalThis.fetch>();
    const limited = () => new Response('busy', { status: 429, headers: { 'Retry-After': '0' } });
    if (transportFirst)
      fetch.mockRejectedValueOnce(new TypeError('fetch failed')).mockResolvedValueOnce(limited());
    else
      fetch.mockResolvedValueOnce(limited()).mockRejectedValueOnce(new TypeError('fetch failed'));
    vi.stubGlobal('fetch', fetch);
    const { HttpBackend } = await import('../src/taquito-http-utils');
    const result = new HttpBackend().createRequest({ url: 'https://rpc.example/read' });
    const checked = expect(result).rejects.toMatchObject(
      transportFirst ? { status: 429 } : { name: 'HttpRequestFailed' }
    );
    await vi.runAllTimersAsync();
    await checked;
    expect(fetch).toHaveBeenCalledTimes(2);
  }
);
it('preserves the final HTTP error after exhausting the status budget', async () => {
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValueOnce(new Response('first', { status: 429, headers: { 'Retry-After': '0' } }))
    .mockResolvedValueOnce(new Response('last', { status: 429, statusText: 'Limited' }));
  vi.stubGlobal('fetch', fetch);
  const { HttpBackend } = await import('../src/taquito-http-utils');
  const checked = expect(
    new HttpBackend().createRequest({ url: 'https://rpc.example/read', query: { secret: 'value' } })
  ).rejects.toMatchObject({
    status: 429,
    body: 'last',
    statusText: 'Limited',
    url: 'https://rpc.example/read?secret=value',
  });
  await vi.runAllTimersAsync();
  await checked;
  expect(fetch).toHaveBeenCalledTimes(2);
});
it('omits query values and response bodies from rate-limit trace records', async () => {
  vi.stubEnv('TAQUITO_HTTP_TRACE', '1');
  const logs = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  vi.stubGlobal(
    'fetch',
    vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(
        new Response('private body', { status: 429, headers: { 'Retry-After': '0' } })
      )
      .mockResolvedValueOnce(Response.json('ok'))
  );
  const { HttpBackend } = await import('../src/taquito-http-utils');
  const result = new HttpBackend().createRequest({
    url: 'https://rpc.example/read',
    query: { secret: 'private query' },
  });
  await vi.runAllTimersAsync();
  await result;
  expect(logs.mock.calls.flat().join(' ')).not.toMatch(/private body|private query/);
  expect(logs.mock.calls.flat().join(' ')).toContain('request-retry');
});

it.each([
  { now: '2026-11-05T00:00:00Z', header: 'Thu Nov 05 00:00:02 2026', delay: 2000 },
  { now: '2026-12-31T23:59:58Z', header: 'Thu, 31 Dec 2026 23:59:60 GMT', delay: 2000 },
  { now: '2026-10-25T00:00:00Z', header: 'Monday, 25-Oct-76 00:00:01 GMT', delay: 0 },
])('accepts valid legacy or leap-second date $header', async ({ now, header, delay }) => {
  vi.setSystemTime(new Date(now));
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValueOnce(
      new Response('busy', { status: 429, headers: { 'Retry-After': header } })
    )
    .mockResolvedValueOnce(Response.json('ok'));
  vi.stubGlobal('fetch', fetch);
  const { HttpBackend } = await import('../src/taquito-http-utils');
  const checked = expect(
    new HttpBackend().createRequest({ url: 'https://rpc.example/read' })
  ).resolves.toBe('ok');
  await vi.advanceTimersByTimeAsync(delay);
  await checked;
  expect(fetch).toHaveBeenCalledTimes(2);
});
