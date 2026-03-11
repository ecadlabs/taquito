import {
  HttpBackend,
  HttpRequestFailed,
  HttpResponseError,
  HttpTimeoutError,
} from '../src/taquito-http-utils';

const mockFetch = jest.fn();
const originalFetch = globalThis.fetch;

beforeAll(() => {
  globalThis.fetch = mockFetch as unknown as typeof globalThis.fetch;
});

afterAll(() => {
  globalThis.fetch = originalFetch;
});

beforeEach(() => {
  mockFetch.mockReset();
});

function mockResponse(opts: {
  status?: number;
  statusText?: string;
  body?: string;
  jsonBody?: unknown;
}) {
  return {
    status: opts.status ?? 200,
    statusText: opts.statusText ?? 'OK',
    json: jest.fn().mockResolvedValue(opts.jsonBody ?? {}),
    text: jest.fn().mockResolvedValue(opts.body ?? ''),
  };
}

describe('HttpBackend', () => {
  describe('constructor', () => {
    it('default timeout is 30000', () => {
      const backend = new HttpBackend();
      expect(backend['timeout']).toEqual(30000);
    });

    it('accepts custom timeout', () => {
      const backend = new HttpBackend(15000);
      expect(backend['timeout']).toEqual(15000);
    });
  });

  describe('serialize', () => {
    const backend = new HttpBackend();

    it('serializes object with non-zero values', () => {
      const result = backend['serialize']({
        delegate: ['tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN', 'tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e'],
        max_priority: 1,
      });
      expect(result).toEqual(
        '?delegate=tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN&delegate=tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e&max_priority=1'
      );
    });

    it('serializes object with zero values', () => {
      const result = backend['serialize']({
        delegate: ['tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN', 'tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e'],
        max_priority: 0,
      });
      expect(result).toEqual(
        '?delegate=tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN&delegate=tz1NMdMmWZN8QPB8pY4ddncACDg1cHi1xD2e&max_priority=0'
      );
    });

    it('returns empty string for undefined', () => {
      expect(backend['serialize'](undefined)).toEqual('');
    });

    it('returns empty string for empty object', () => {
      expect(backend['serialize']({})).toEqual('');
    });

    it('calls toJSON() on values that have it', () => {
      const result = backend['serialize']({
        block: { toJSON: () => 'head' },
      });
      expect(result).toEqual('?block=head');
    });

    it('serializes null values as bare keys', () => {
      const result = backend['serialize']({ all: null });
      expect(result).toEqual('?all');
    });

    it('serializes toJSON-returning-null values as bare keys', () => {
      const result = backend['serialize']({ all: { toJSON: () => null } });
      expect(result).toEqual('?all');
    });
  });

  describe('createRequest', () => {
    const backend = new HttpBackend();

    describe('fetch call shape', () => {
      beforeEach(() => {
        mockFetch.mockResolvedValue(mockResponse({}));
      });

      it('calls fetch with correct URL', async () => {
        await backend.createRequest({ url: 'https://rpc.example.com/chains/main/blocks/head' });
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch.mock.calls[0][0]).toBe('https://rpc.example.com/chains/main/blocks/head');
      });

      it('defaults to GET', async () => {
        await backend.createRequest({ url: 'https://rpc.example.com/' });
        expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: undefined });
      });

      it('passes provided method', async () => {
        await backend.createRequest({ url: 'https://rpc.example.com/', method: 'POST' });
        expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: 'POST' });
      });

      it('appends serialized query to URL', async () => {
        await backend.createRequest({
          url: 'https://rpc.example.com/path',
          query: { level: 42 },
        });
        expect(mockFetch.mock.calls[0][0]).toBe('https://rpc.example.com/path?level=42');
      });

      it('sets Content-Type: application/json by default', async () => {
        await backend.createRequest({ url: 'https://rpc.example.com/' });
        expect(mockFetch.mock.calls[0][1].headers).toMatchObject({
          'Content-Type': 'application/json',
        });
      });

      it('preserves explicit Content-Type', async () => {
        await backend.createRequest({
          url: 'https://rpc.example.com/',
          headers: { 'Content-Type': 'text/plain' },
        });
        expect(mockFetch.mock.calls[0][1].headers).toMatchObject({
          'Content-Type': 'text/plain',
        });
      });

      it('passes custom headers', async () => {
        await backend.createRequest({
          url: 'https://rpc.example.com/',
          headers: { Authorization: 'Bearer tok' },
        });
        expect(mockFetch.mock.calls[0][1].headers).toMatchObject({
          Authorization: 'Bearer tok',
          'Content-Type': 'application/json',
        });
      });

      it('serializes data object as JSON body', async () => {
        const data = { branch: 'head', contents: [] };
        await backend.createRequest({ url: 'https://rpc.example.com/', method: 'POST' }, data);
        expect(mockFetch.mock.calls[0][1].body).toBe(JSON.stringify(data));
      });

      it('passes AbortSignal for timeout', async () => {
        await backend.createRequest({ url: 'https://rpc.example.com/' });
        expect(mockFetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
      });
    });

    describe('successful responses', () => {
      it('parses JSON by default', async () => {
        mockFetch.mockResolvedValue(mockResponse({ jsonBody: { protocol: 'PtMumbai' } }));
        const result = await backend.createRequest({ url: 'https://rpc.example.com/' });
        expect(result).toEqual({ protocol: 'PtMumbai' });
      });

      it('returns text when json: false', async () => {
        mockFetch.mockResolvedValue(mockResponse({ body: 'raw bytes here' }));
        const result = await backend.createRequest({
          url: 'https://rpc.example.com/',
          json: false,
        });
        expect(result).toBe('raw bytes here');
      });
    });

    describe('error responses', () => {
      it('throws HttpResponseError for status 400', async () => {
        mockFetch.mockResolvedValue(
          mockResponse({ status: 400, statusText: 'Bad Request', body: 'bad body' })
        );
        await expect(backend.createRequest({ url: 'https://rpc.example.com/' })).rejects.toThrow(
          HttpResponseError
        );
      });

      it('throws HttpResponseError for status 500', async () => {
        mockFetch.mockResolvedValue(
          mockResponse({ status: 500, statusText: 'Internal Server Error', body: 'server down' })
        );
        await expect(backend.createRequest({ url: 'https://rpc.example.com/' })).rejects.toThrow(
          HttpResponseError
        );
      });

      it('error contains status, body, and url', async () => {
        mockFetch.mockResolvedValue(
          mockResponse({ status: 404, statusText: 'Not Found', body: 'not here' })
        );
        try {
          await backend.createRequest({ url: 'https://rpc.example.com/missing' });
          fail('should have thrown');
        } catch (e) {
          expect(e).toBeInstanceOf(HttpResponseError);
          const err = e as HttpResponseError;
          expect(err.status).toBe(404);
          expect(err.body).toBe('not here');
          expect(err.url).toBe('https://rpc.example.com/missing');
          expect(err.statusText).toBe('Not Found');
        }
      });
    });

    describe('timeout', () => {
      function abortError() {
        const err = new Error('The operation was aborted');
        err.name = 'AbortError';
        return err;
      }

      it('throws HttpTimeoutError on AbortError', async () => {
        mockFetch.mockRejectedValue(abortError());
        await expect(
          backend.createRequest({ url: 'https://rpc.example.com/', timeout: 5000 })
        ).rejects.toThrow(HttpTimeoutError);
      });

      it('error contains timeout and url', async () => {
        mockFetch.mockRejectedValue(abortError());
        try {
          await backend.createRequest({ url: 'https://rpc.example.com/slow', timeout: 5000 });
          fail('should have thrown');
        } catch (e) {
          expect(e).toBeInstanceOf(HttpTimeoutError);
          const err = e as HttpTimeoutError;
          expect(err.timeout).toBe(5000);
          expect(err.url).toBe('https://rpc.example.com/slow');
          expect(err.message).toContain('5000');
        }
      });
    });

    describe('network errors', () => {
      it('throws HttpRequestFailed for generic fetch errors', async () => {
        mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));
        await expect(backend.createRequest({ url: 'https://rpc.example.com/' })).rejects.toThrow(
          HttpRequestFailed
        );
      });

      it('error contains method, url, and cause', async () => {
        const cause = new TypeError('Failed to fetch');
        mockFetch.mockRejectedValue(cause);
        try {
          await backend.createRequest({ url: 'https://rpc.example.com/broken', method: 'POST' });
          fail('should have thrown');
        } catch (e) {
          expect(e).toBeInstanceOf(HttpRequestFailed);
          const err = e as HttpRequestFailed;
          expect(err.method).toBe('POST');
          expect(err.url).toBe('https://rpc.example.com/broken');
          expect(err.cause).toBe(cause);
        }
      });
    });

    describe('retry logic', () => {
      // Retry calls sleep() internally. Use fake timers to avoid real delays.
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      function econnreset() {
        const err = new Error('read ECONNRESET');
        err.name = 'Error';
        return err;
      }

      function socketHangUp() {
        const err = new Error('socket hang up');
        err.name = 'Error';
        return err;
      }

      function etimedout() {
        const err = new Error('connect ETIMEDOUT');
        err.name = 'Error';
        return err;
      }

      async function drainRetries(promise: Promise<unknown>) {
        // Advance timers to flush any pending sleep() calls during retry
        await jest.advanceTimersByTimeAsync(10_000);
        return promise;
      }

      it('retries GET on ECONNRESET', async () => {
        mockFetch
          .mockRejectedValueOnce(econnreset())
          .mockResolvedValueOnce(mockResponse({ jsonBody: { ok: true } }));
        const result = await drainRetries(
          backend.createRequest({ url: 'https://rpc.example.com/' })
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ ok: true });
      });

      it('retries GET on socket hang up', async () => {
        mockFetch
          .mockRejectedValueOnce(socketHangUp())
          .mockResolvedValueOnce(mockResponse({ jsonBody: { ok: true } }));
        const result = await drainRetries(
          backend.createRequest({ url: 'https://rpc.example.com/' })
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ ok: true });
      });

      it('retries GET on ETIMEDOUT', async () => {
        mockFetch
          .mockRejectedValueOnce(etimedout())
          .mockResolvedValueOnce(mockResponse({ jsonBody: { ok: true } }));
        const result = await drainRetries(
          backend.createRequest({ url: 'https://rpc.example.com/' })
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ ok: true });
      });

      it('succeeds on retry after initial failure', async () => {
        mockFetch
          .mockRejectedValueOnce(econnreset())
          .mockResolvedValueOnce(mockResponse({ jsonBody: { block: 'head' } }));
        const result = await drainRetries(
          backend.createRequest({ url: 'https://rpc.example.com/chains/main/blocks/head' })
        );
        expect(result).toEqual({ block: 'head' });
      });

      it('does not retry HttpResponseError even if body contains transport-like text', async () => {
        // RPC returns 500 with body text that matches transport error patterns
        mockFetch.mockResolvedValue(
          mockResponse({
            status: 500,
            statusText: 'Internal Server Error',
            body: 'connection reset by peer',
          })
        );
        await expect(backend.createRequest({ url: 'https://rpc.example.com/' })).rejects.toThrow(
          HttpResponseError
        );
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      it('does not retry non-transport errors', async () => {
        mockFetch.mockRejectedValueOnce(new TypeError('Cannot read properties of undefined'));
        // No retry, no sleep, no need to drain timers
        await expect(backend.createRequest({ url: 'https://rpc.example.com/' })).rejects.toThrow(
          HttpRequestFailed
        );
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      it('does not retry POST to non-allowlisted path', async () => {
        mockFetch.mockRejectedValueOnce(econnreset());
        // Non-retriable request, no sleep
        await expect(
          backend.createRequest({
            url: 'https://rpc.example.com/some/random/endpoint',
            method: 'POST',
          })
        ).rejects.toThrow(HttpRequestFailed);
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      it('retries POST to /injection/operation on ECONNRESET', async () => {
        mockFetch
          .mockRejectedValueOnce(econnreset())
          .mockResolvedValueOnce(mockResponse({ jsonBody: '"oph4Rkj..."' }));
        const result = await drainRetries(
          backend.createRequest({
            url: 'https://rpc.example.com/injection/operation',
            method: 'POST',
          })
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual('"oph4Rkj..."');
      });

      it('retries POST to /injection/operation on socket hang up', async () => {
        mockFetch
          .mockRejectedValueOnce(socketHangUp())
          .mockResolvedValueOnce(mockResponse({ jsonBody: '"oph4Rkj..."' }));
        const result = await drainRetries(
          backend.createRequest({
            url: 'https://rpc.example.com/injection/operation',
            method: 'POST',
          })
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual('"oph4Rkj..."');
      });

      it('retries POST to /helpers/forge/operations', async () => {
        mockFetch
          .mockRejectedValueOnce(econnreset())
          .mockResolvedValueOnce(mockResponse({ jsonBody: { forged: '00' } }));
        const result = await drainRetries(
          backend.createRequest({
            url: 'https://rpc.example.com/chains/main/blocks/head/helpers/forge/operations',
            method: 'POST',
          })
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ forged: '00' });
      });

      it('sends identical body bytes on retry (body serialized once before loop)', async () => {
        let callCount = 0;
        const data = {
          branch: 'head',
          get contents() {
            callCount++;
            return [callCount];
          },
        };
        mockFetch
          .mockRejectedValueOnce(econnreset())
          .mockResolvedValueOnce(mockResponse({ jsonBody: { ok: true } }));
        await drainRetries(
          backend.createRequest({ url: 'https://rpc.example.com/', method: 'GET' }, data)
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        // Body should be identical on both calls (serialized once)
        const body1 = mockFetch.mock.calls[0][1].body;
        const body2 = mockFetch.mock.calls[1][1].body;
        expect(body1).toBe(body2);
      });

      it('throws after exhausting retries (fetch called 2x)', async () => {
        mockFetch.mockRejectedValue(econnreset());
        const promise = backend.createRequest({ url: 'https://rpc.example.com/' });
        // Attach rejection handler BEFORE advancing timers to avoid unhandled rejection warning
        const assertion = expect(promise).rejects.toThrow(HttpRequestFailed);
        // Drain the sleep between retries
        await jest.advanceTimersByTimeAsync(10_000);
        await assertion;
        // Default retry count is 1, so 1 initial + 1 retry = 2 calls
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('error classes', () => {
    it('HttpRequestFailed properties and message', () => {
      const cause = new Error('ECONNREFUSED');
      const err = new HttpRequestFailed('GET', 'https://rpc.example.com/', cause);
      expect(err.name).toBe('HttpRequestFailed');
      expect(err.method).toBe('GET');
      expect(err.url).toBe('https://rpc.example.com/');
      expect(err.cause).toBe(cause);
      expect(err.message).toContain('ECONNREFUSED');
      expect(err.message).toContain('GET');
    });

    it('HttpResponseError properties', () => {
      const err = new HttpResponseError(
        'Http error response: (404) not found',
        404,
        'Not Found',
        'not found',
        'https://rpc.example.com/missing'
      );
      expect(err.name).toBe('HttpResponseError');
      expect(err.status).toBe(404);
      expect(err.statusText).toBe('Not Found');
      expect(err.body).toBe('not found');
      expect(err.url).toBe('https://rpc.example.com/missing');
      expect(err.message).toContain('404');
    });

    it('HttpTimeoutError properties and message', () => {
      const err = new HttpTimeoutError(30000, 'https://rpc.example.com/slow');
      expect(err.name).toBe('HttpTimeoutError');
      expect(err.timeout).toBe(30000);
      expect(err.url).toBe('https://rpc.example.com/slow');
      expect(err.message).toContain('30000');
    });
  });
});
