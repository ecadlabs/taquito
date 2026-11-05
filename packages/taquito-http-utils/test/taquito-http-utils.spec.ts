import { vi } from 'vitest';
import {
  HttpBackend,
  HttpRequestFailed,
  HttpResponseError,
  HttpTimeoutError,
} from '../src/taquito-http-utils';

const mockFetch = vi.fn();
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
    json: vi.fn().mockResolvedValue(opts.jsonBody ?? {}),
    text: vi.fn().mockResolvedValue(opts.body ?? ''),
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

      it('passes custom headers without mutating caller headers object', async () => {
        const callerHeaders: Record<string, string> = { Authorization: 'Bearer tok' };
        await backend.createRequest({
          url: 'https://rpc.example.com/',
          headers: callerHeaders,
        });
        expect(mockFetch.mock.calls[0][1].headers).toMatchObject({
          Authorization: 'Bearer tok',
          'Content-Type': 'application/json',
        });
        expect(callerHeaders).toEqual({ Authorization: 'Bearer tok' });
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

    describe('caller AbortSignal', () => {
      it('throws immediately without calling fetch when signal is already aborted', async () => {
        const controller = new AbortController();
        const reason = new Error('caller cancelled');
        controller.abort(reason);
        await expect(
          backend.createRequest({
            url: 'https://rpc.example.com/',
            signal: controller.signal,
          })
        ).rejects.toBe(reason);
        expect(mockFetch).not.toHaveBeenCalled();
      });

      it('rethrows caller abort error without wrapping in HttpTimeoutError or retrying', async () => {
        const controller = new AbortController();
        const reason = new DOMException('Aborted by caller', 'AbortError');
        mockFetch.mockImplementationOnce((_url: string, init: RequestInit) => {
          expect(init.signal).toBeInstanceOf(AbortSignal);
          controller.abort(reason);
          return Promise.reject(reason);
        });
        await expect(
          backend.createRequest({
            url: 'https://rpc.example.com/',
            signal: controller.signal,
          })
        ).rejects.toBe(reason);
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });
    });

    describe('network errors', () => {
      it('throws HttpRequestFailed for generic fetch errors', async () => {
        mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));
        await expect(backend.createRequest({ url: 'https://rpc.example.com/' })).rejects.toThrow(
          HttpRequestFailed
        );
      });

      it('throws HttpRequestFailed when fetch returns undefined response', async () => {
        mockFetch.mockResolvedValueOnce(undefined);
        await expect(backend.createRequest({ url: 'https://rpc.example.com/' })).rejects.toThrow(
          HttpRequestFailed
        );
      });

      it('wraps non-Error rejection reasons in HttpRequestFailed', async () => {
        mockFetch.mockRejectedValueOnce('raw string failure');
        await expect(
          backend.createRequest({ url: 'https://rpc.example.com/', method: 'POST' })
        ).rejects.toMatchObject({
          name: 'HttpRequestFailed',
          message: 'POST https://rpc.example.com/: raw string failure',
        });
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

      it('surfaces nested Error and object-shaped causes from native fetch rejections', async () => {
        const socketErr = new Error('read ECONNRESET');
        (socketErr as unknown as Record<string, unknown>)['code'] = 'ECONNRESET';
        const wrappedErrorCause = new TypeError('fetch failed', { cause: socketErr });

        const wrappedObjectCause = new TypeError('fetch failed', {
          cause: { message: 'other side closed', code: 'UND_ERR_SOCKET' },
        });

        mockFetch
          .mockRejectedValueOnce(wrappedErrorCause)
          .mockRejectedValueOnce(wrappedObjectCause);

        await expect(
          backend.createRequest({ url: 'https://rpc.example.com/broken', method: 'POST' })
        ).rejects.toMatchObject({
          name: 'HttpRequestFailed',
          message: expect.stringContaining('read ECONNRESET [ECONNRESET]'),
        });

        await expect(
          backend.createRequest({ url: 'https://rpc.example.com/broken', method: 'POST' })
        ).rejects.toMatchObject({
          name: 'HttpRequestFailed',
          message: expect.stringContaining('other side closed [UND_ERR_SOCKET]'),
        });
      });
    });

    describe('retry logic', () => {
      // Retry calls sleep() internally. Use fake timers to avoid real delays.
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
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
        await vi.advanceTimersByTimeAsync(10_000);
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

      it('does not retry 500 HttpResponseError even if body contains transport-like text', async () => {
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
          .mockResolvedValueOnce(
            mockResponse({
              status: 502,
              statusText: 'Bad Gateway',
              body: '<html>502 Bad Gateway</html>',
            })
          )
          .mockResolvedValueOnce(mockResponse({ jsonBody: { ok: true } }));
        await drainRetries(
          backend.createRequest(
            {
              url: 'https://rpc.example.com/chains/main/blocks/head/helpers/scripts/simulate_operation',
              method: 'POST',
            },
            data
          )
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(callCount).toBe(1);
        // Body should be identical and non-empty on both calls (serialized once)
        const body1 = mockFetch.mock.calls[0][1].body;
        const body2 = mockFetch.mock.calls[1][1].body;
        expect(body1).toBe('{"branch":"head","contents":[1]}');
        expect(body2).toBe(body1);
      });

      it('throws after exhausting retries (fetch called 2x)', async () => {
        mockFetch.mockRejectedValue(econnreset());
        const promise = backend.createRequest({ url: 'https://rpc.example.com/' });
        // Attach rejection handler BEFORE advancing timers to avoid unhandled rejection warning
        const assertion = expect(promise).rejects.toThrow(HttpRequestFailed);
        // Drain the sleep between retries
        await vi.advanceTimersByTimeAsync(10_000);
        await assertion;
        // Default retry count is 1, so 1 initial + 1 retry = 2 calls
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      it.each([
        [502, 'Bad Gateway'],
        [503, 'Service Unavailable'],
        [504, 'Gateway Timeout'],
      ])('retries GET on %i %s and succeeds on second attempt', async (status, statusText) => {
        mockFetch
          .mockResolvedValueOnce(
            mockResponse({
              status,
              statusText,
              body: `<html><h1>${status} ${statusText}</h1></html>`,
            })
          )
          .mockResolvedValueOnce(mockResponse({ jsonBody: { ok: true } }));
        const result = await drainRetries(
          backend.createRequest({ url: 'https://rpc.example.com/chains/main/blocks/head' })
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ ok: true });
      });

      it.each([
        '/chains/main/blocks/head/helpers/scripts/simulate_operation',
        '/chains/main/blocks/head/helpers/scripts/run_operation',
        '/chains/main/blocks/head/helpers/scripts/run_code',
        '/chains/main/blocks/head/helpers/scripts/run_view',
        '/chains/main/blocks/head/helpers/scripts/run_script_view',
        '/chains/main/blocks/head/helpers/scripts/pack_data',
        '/chains/main/blocks/head/helpers/forge/operations',
        '/chains/main/blocks/head/helpers/preapply/operations',
        '/injection/operation',
      ])('retries POST to %s on 502 Bad Gateway', async (path) => {
        mockFetch
          .mockResolvedValueOnce(
            mockResponse({
              status: 502,
              statusText: 'Bad Gateway',
              body: '<html><head><title>502 Bad Gateway</title></head></html>',
            })
          )
          .mockResolvedValueOnce(mockResponse({ jsonBody: { ok: true } }));
        const result = await drainRetries(
          backend.createRequest(
            {
              url: `https://rpc.example.com${path}`,
              method: 'POST',
              query: { version: '1' },
            },
            { contents: [] }
          )
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ ok: true });
      });

      it('retries POST /injection/operation with identical signed bytes and propagates final 500 on duplicate replay', async () => {
        const signedOpBytes = '8f3d2a01020304deadbeef';
        mockFetch
          .mockResolvedValueOnce(
            mockResponse({
              status: 504,
              statusText: 'Gateway Timeout',
              body: '<html>504 Gateway Timeout</html>',
            })
          )
          .mockResolvedValueOnce(
            mockResponse({
              status: 500,
              statusText: 'Internal Server Error',
              body: '[{"kind":"branch","id":"injection_operation_error"}]',
            })
          );
        const promise = backend.createRequest(
          {
            url: 'https://rpc.example.com/injection/operation',
            method: 'POST',
          },
          signedOpBytes
        );
        const assertion = expect(promise).rejects.toMatchObject({
          name: 'HttpResponseError',
          status: 500,
          statusText: 'Internal Server Error',
          body: '[{"kind":"branch","id":"injection_operation_error"}]',
          url: 'https://rpc.example.com/injection/operation',
        });
        await vi.advanceTimersByTimeAsync(10_000);
        await assertion;
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch.mock.calls[0][1].body).toBe(JSON.stringify(signedOpBytes));
        expect(mockFetch.mock.calls[1][1].body).toBe(JSON.stringify(signedOpBytes));
      });

      it('throws the final HttpResponseError after exhausting retries on persistent gateway errors', async () => {
        mockFetch
          .mockResolvedValueOnce(
            mockResponse({
              status: 502,
              statusText: 'Bad Gateway',
              body: '<html>first attempt 502</html>',
            })
          )
          .mockResolvedValueOnce(
            mockResponse({
              status: 503,
              statusText: 'Service Unavailable',
              body: '<html>second attempt 503</html>',
            })
          );
        const promise = backend.createRequest({
          url: 'https://rpc.example.com/chains/main/blocks/head/helpers/scripts/simulate_operation',
          method: 'POST',
        });
        const assertion = expect(promise).rejects.toMatchObject({
          name: 'HttpResponseError',
          status: 503,
          statusText: 'Service Unavailable',
          body: '<html>second attempt 503</html>',
          url: 'https://rpc.example.com/chains/main/blocks/head/helpers/scripts/simulate_operation',
        });
        await vi.advanceTimersByTimeAsync(10_000);
        await assertion;
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      it('preserves HTTP status policy when reading the error response body fails', async () => {
        // 1. A 500 response whose body stream resets must NOT be retried as a transport error
        mockFetch.mockResolvedValueOnce({
          status: 500,
          statusText: 'Internal Server Error',
          text: () => Promise.reject(econnreset()),
          json: () => Promise.reject(econnreset()),
        } as unknown as Response);
        await expect(
          backend.createRequest({
            url: 'https://rpc.example.com/chains/main/blocks/head',
            method: 'GET',
          })
        ).rejects.toMatchObject({
          name: 'HttpResponseError',
          status: 500,
          statusText: 'Internal Server Error',
        });
        expect(mockFetch).toHaveBeenCalledTimes(1);

        // 2. A 503 response whose body stream aborts/resets IS retried as a 503 gateway error
        mockFetch.mockClear();
        mockFetch
          .mockResolvedValueOnce({
            status: 503,
            statusText: 'Service Unavailable',
            text: () => Promise.reject(econnreset()),
            json: () => Promise.reject(econnreset()),
          } as unknown as Response)
          .mockResolvedValueOnce(mockResponse({ jsonBody: { ok: true } }));
        const result = await drainRetries(
          backend.createRequest({
            url: 'https://rpc.example.com/chains/main/blocks/head',
            method: 'GET',
          })
        );
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ ok: true });
      });

      it('does not retry 502 on non-allowlisted POST endpoint even if query contains allowlisted suffix', async () => {
        mockFetch.mockResolvedValueOnce(
          mockResponse({
            status: 502,
            statusText: 'Bad Gateway',
            body: '<html>502 Bad Gateway</html>',
          })
        );
        await expect(
          backend.createRequest({
            url: 'https://rpc.example.com/v2/shadownet',
            method: 'POST',
            query: { next: '/helpers/scripts/simulate_operation' },
          })
        ).rejects.toThrow(HttpResponseError);
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      it.each([400, 404, 500])(
        'does not retry %i status on allowlisted requests',
        async (status) => {
          mockFetch.mockResolvedValueOnce(
            mockResponse({
              status,
              statusText: 'Error',
              body: 'error body',
            })
          );
          await expect(
            backend.createRequest({
              url: 'https://rpc.example.com/chains/main/blocks/head/helpers/scripts/simulate_operation',
              method: 'POST',
            })
          ).rejects.toThrow(HttpResponseError);
          expect(mockFetch).toHaveBeenCalledTimes(1);
        }
      );
    });
  });

  describe('createRequestBytes', () => {
    const backend = new HttpBackend();

    function streamFromChunks(
      chunks: Uint8Array[],
      opts?: { keepOpen?: boolean; onCancel?: () => Promise<void> }
    ): {
      stream: ReadableStream<Uint8Array>;
      cancelled: () => boolean;
    } {
      let index = 0;
      let wasCancelled = false;
      const stream = new ReadableStream<Uint8Array>({
        pull(controller) {
          if (index < chunks.length) {
            controller.enqueue(chunks[index++]);
          } else if (!opts?.keepOpen) {
            controller.close();
          }
        },
        async cancel() {
          wasCancelled = true;
          if (opts?.onCancel) {
            await opts.onCancel();
          }
        },
      });
      return { stream, cancelled: () => wasCancelled };
    }

    it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
      'rejects invalid maxResponseBytes (%s) with RangeError before calling fetch',
      async (invalidLimit) => {
        await expect(
          backend.createRequestBytes({ url: 'https://rpc.example.com/bytes' }, invalidLimit)
        ).rejects.toThrow(RangeError);
        expect(mockFetch).not.toHaveBeenCalled();
      }
    );

    it('returns an empty Uint8Array when response.body is null', async () => {
      mockFetch.mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        body: null,
      } as unknown as Response);
      const bytes = await backend.createRequestBytes({ url: 'https://rpc.example.com/empty' }, 64);
      expect(bytes).toEqual(new Uint8Array());
    });

    it('concatenates multiple response stream chunks in order', async () => {
      const { stream } = streamFromChunks([
        new Uint8Array([1, 2]),
        new Uint8Array([3, 4, 5]),
        new Uint8Array([6]),
      ]);
      mockFetch.mockResolvedValueOnce(new Response(stream, { status: 200 }));
      const bytes = await backend.createRequestBytes({ url: 'https://rpc.example.com/bytes' }, 6);
      expect(Array.from(bytes)).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('throws RangeError without retrying when response exceeds maxResponseBytes and cancels the stream', async () => {
      const { stream, cancelled } = streamFromChunks(
        [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])],
        { keepOpen: true }
      );
      mockFetch.mockResolvedValueOnce(new Response(stream, { status: 200 }));
      await expect(
        backend.createRequestBytes({ url: 'https://rpc.example.com/oversized' }, 4)
      ).rejects.toThrow(new RangeError('HTTP response exceeds 4 bytes'));
      expect(cancelled()).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('propagates RangeError even if reader.cancel() rejects during cleanup', async () => {
      const { stream, cancelled } = streamFromChunks([new Uint8Array([1, 2, 3, 4, 5])], {
        keepOpen: true,
        onCancel: () => Promise.reject(new Error('cancel failed')),
      });
      mockFetch.mockResolvedValueOnce(new Response(stream, { status: 200 }));
      await expect(
        backend.createRequestBytes({ url: 'https://rpc.example.com/oversized' }, 2)
      ).rejects.toThrow(new RangeError('HTTP response exceeds 2 bytes'));
      expect(cancelled()).toBe(true);
    });

    it('decodes bounded error response bodies into HttpResponseError', async () => {
      const errorBytes = new TextEncoder().encode('not found body');
      const { stream } = streamFromChunks([errorBytes]);
      mockFetch.mockResolvedValueOnce(
        new Response(stream, { status: 404, statusText: 'Not Found' })
      );
      await expect(
        backend.createRequestBytes({ url: 'https://rpc.example.com/missing' }, 64)
      ).rejects.toMatchObject({
        name: 'HttpResponseError',
        status: 404,
        statusText: 'Not Found',
        body: 'not found body',
      });
    });

    it('falls back to statusText (or empty string) when error response body exceeds maxResponseBytes', async () => {
      const oversizedError = new TextEncoder().encode('oversized error payload');
      const { stream } = streamFromChunks([oversizedError]);
      mockFetch.mockResolvedValueOnce({
        status: 400,
        statusText: '',
        body: stream,
      } as unknown as Response);
      await expect(
        backend.createRequestBytes({ url: 'https://rpc.example.com/bad' }, 4)
      ).rejects.toMatchObject({
        name: 'HttpResponseError',
        status: 400,
        statusText: '',
        body: '',
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

    it('HttpRequestFailed walks nested Error cause chain', () => {
      const root = new Error('read ECONNRESET');
      (root as unknown as Record<string, unknown>)['code'] = 'ECONNRESET';
      const mid = new TypeError('fetch failed');
      (mid as unknown as Record<string, unknown>).cause = root;
      const err = new HttpRequestFailed('GET', 'https://rpc.example.com/', mid);
      expect(err.message).toContain('ECONNRESET');
      expect(err.message).toContain('read ECONNRESET');
      expect(err.message).toContain('GET');
    });

    it('HttpRequestFailed includes transport kind in message', () => {
      const cause = new Error('connect refused');
      const transport = { kind: 'connect' as const, mayHaveReachedServer: false, original: cause };
      const err = new HttpRequestFailed('POST', 'https://rpc.example.com/', cause, transport);
      expect(err.message).toContain('(connect)');
    });

    it('HttpRequestFailed handles object-shaped cause (non-Error)', () => {
      const inner = { message: 'socket hang up', code: 'UND_ERR_SOCKET' };
      const cause = new TypeError('fetch failed');
      (cause as unknown as Record<string, unknown>).cause = inner;
      const err = new HttpRequestFailed('GET', 'https://rpc.example.com/', cause);
      expect(err.message).toContain('socket hang up');
      expect(err.message).toContain('UND_ERR_SOCKET');
    });

    it('HttpRequestFailed survives circular cause chain without hanging', () => {
      const a = new Error('loop A');
      const b = new Error('loop B');
      (a as unknown as Record<string, unknown>).cause = b;
      (b as unknown as Record<string, unknown>).cause = a;
      const err = new HttpRequestFailed('GET', 'https://rpc.example.com/', a);
      // Should not hang; should produce a message containing one of the loop errors
      expect(err.message).toContain('GET');
      expect(err.message).toBeDefined();
    });

    it('HttpRequestFailed with no cause chain uses top-level message', () => {
      const cause = new Error('something broke');
      const err = new HttpRequestFailed('GET', 'https://rpc.example.com/', cause);
      expect(err.message).toContain('something broke');
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

  describe('HTTP trace logging', () => {
    const backend = new HttpBackend();
    const originalTrace = process.env.TAQUITO_HTTP_TRACE;

    afterEach(() => {
      if (originalTrace === undefined) {
        delete process.env.TAQUITO_HTTP_TRACE;
      } else {
        process.env.TAQUITO_HTTP_TRACE = originalTrace;
      }
      vi.restoreAllMocks();
    });

    it('emits structured JSON trace logs with query-stripped URLs and formatted cause chains when TAQUITO_HTTP_TRACE=1', async () => {
      process.env.TAQUITO_HTTP_TRACE = '1';
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

      // 1. Successful request with a relative URL (exercises normalizeTraceUrl fallback)
      mockFetch.mockResolvedValueOnce(mockResponse({ jsonBody: { ok: true } }));
      await backend.createRequest({ url: '/relative/path', query: { secret: '1' } });

      // 2. Non-retriable HTTP error response
      mockFetch.mockResolvedValueOnce(
        mockResponse({ status: 404, statusText: 'Not Found', body: 'missing' })
      );
      await expect(
        backend.createRequest({ url: 'https://rpc.example.com/missing', query: { a: '1' } })
      ).rejects.toThrow(HttpResponseError);

      // 3. Timeout error
      const abortErr = new Error('The operation was aborted');
      abortErr.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(abortErr);
      await expect(
        backend.createRequest({ url: 'https://rpc.example.com/slow', timeout: 100 })
      ).rejects.toThrow(HttpTimeoutError);

      // 4. Transport failure with nested cause chain and non-Error failure
      const rootErr = new Error('connect ECONNREFUSED');
      (rootErr as unknown as Record<string, unknown>)['code'] = 'ECONNREFUSED';
      const wrappedErr = new TypeError('fetch failed', { cause: rootErr });
      mockFetch.mockRejectedValueOnce(wrappedErr).mockRejectedValueOnce('plain failure');
      await expect(
        backend.createRequest({ url: 'https://rpc.example.com/down', method: 'POST' })
      ).rejects.toThrow(HttpRequestFailed);
      await expect(
        backend.createRequest({ url: 'https://rpc.example.com/down', method: 'POST' })
      ).rejects.toThrow(HttpRequestFailed);

      const traces = logSpy.mock.calls.map(([line]) =>
        JSON.parse(String(line).replace(/^\[taquito:http-trace\] /, ''))
      );
      expect(traces).toEqual([
        expect.objectContaining({ stage: 'response-ok', url: '/relative/path', status: 200 }),
        expect.objectContaining({
          stage: 'response-error',
          url: 'https://rpc.example.com/missing',
          status: 404,
        }),
        expect.objectContaining({
          stage: 'http-response-error',
          url: 'https://rpc.example.com/missing',
          status: 404,
        }),
        expect.objectContaining({
          stage: 'timeout',
          url: 'https://rpc.example.com/slow',
          timeoutMs: 100,
        }),
        expect.objectContaining({
          stage: 'request-failed',
          url: 'https://rpc.example.com/down',
          transportKind: 'connect',
          error: 'TypeError: fetch failed → Error: connect ECONNREFUSED [ECONNREFUSED]',
        }),
        expect.objectContaining({
          stage: 'request-failed',
          url: 'https://rpc.example.com/down',
          error: 'plain failure',
        }),
      ]);
    });
  });
});
