/**
 * @packageDocumentation
 * @module @taquito/http-utils
 */

if (typeof globalThis.fetch !== 'function') {
  throw new Error(
    'No fetch implementation available. Requires Node.js >= 22 or a browser environment.'
  );
}

const env = typeof process !== 'undefined' ? process.env : undefined;

const isHttpTraceEnabled = () => {
  const trace = env?.TAQUITO_HTTP_TRACE;
  return (trace !== undefined && /^(1|true)$/i.test(trace)) || env?.RUNNER_DEBUG === '1';
};
const parsedHttpRetryCount = Number(env?.TAQUITO_HTTP_RETRY_COUNT ?? '1');
const httpRetryCount =
  Number.isFinite(parsedHttpRetryCount) && parsedHttpRetryCount >= 0
    ? Math.floor(parsedHttpRetryCount)
    : 1;
const parsedHttpRetryBaseMs = Number(env?.TAQUITO_HTTP_RETRY_BASE_MS ?? '100');
const httpRetryBaseMs =
  Number.isFinite(parsedHttpRetryBaseMs) && parsedHttpRetryBaseMs >= 0
    ? parsedHttpRetryBaseMs
    : 100;

import { STATUS_CODE } from './status_code';
import {
  formatErrorCauseChain,
  HttpRequestFailed,
  HttpResponseError,
  HttpTimeoutError,
} from './errors';
import { classifyTransportError } from './transport-errors';

export * from './status_code';
export { VERSION } from './version';
export { HttpRequestFailed, HttpResponseError, HttpTimeoutError } from './errors';
export { classifyTransportError } from './transport-errors';
export type { ClassifiedTransportError, TransportErrorKind } from './transport-errors';

type ObjectType = Record<string, any>;

const normalizeTraceUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.origin}${parsedUrl.pathname}`;
  } catch {
    return url.split('?')[0];
  }
};

const traceHttp = (buildPayload: () => Record<string, unknown>) => {
  if (!isHttpTraceEnabled()) {
    return;
  }
  // JSON logs make CI-side grepping and aggregation much easier.
  console.log(`[taquito:http-trace] ${JSON.stringify(buildPayload())}`);
};

const isRetriableRequest = (method: string, url: string) => {
  const normalizedMethod = method.toUpperCase();

  if (normalizedMethod === 'GET') {
    return true;
  }

  if (normalizedMethod !== 'POST') {
    return false;
  }

  const normalizedUrl = normalizeTraceUrl(url);
  return (
    normalizedUrl.endsWith('/helpers/forge/operations') ||
    normalizedUrl.endsWith('/helpers/preapply/operations') ||
    normalizedUrl.endsWith('/helpers/scripts/simulate_operation') ||
    normalizedUrl.endsWith('/helpers/scripts/run_operation') ||
    normalizedUrl.endsWith('/helpers/scripts/run_code') ||
    normalizedUrl.endsWith('/helpers/scripts/trace_code') ||
    normalizedUrl.endsWith('/helpers/scripts/run_view') ||
    normalizedUrl.endsWith('/helpers/scripts/run_script_view') ||
    normalizedUrl.endsWith('/helpers/scripts/pack_data') ||
    // Safe to retry: ops are content-addressed, mempool deduplicates identical bytes,
    // and counter prevents replay. If the first request secretly succeeded but the
    // connection dropped, the retry may get a 500 (async_injection_failed) which
    // propagates to the caller via HttpResponseError (not retried). No silent corruption,
    // but the caller may see an error despite the op being on-chain.
    normalizedUrl.endsWith('/injection/operation')
  );
};

const isRetriableStatus = (status: number) =>
  status === STATUS_CODE.BAD_GATEWAY ||
  status === STATUS_CODE.SERVICE_UNAVAILABLE ||
  status === STATUS_CODE.GATEWAY_TIMEOUT;

const computeRetryDelayMs = (attempt: number) => {
  const exponential = httpRetryBaseMs * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * httpRetryBaseMs);
  return exponential + jitter;
};

// Related to Octez.js #50. This policy retries GET 429 only, not POST responses.
const MAX_RETRY_AFTER_MS = 30000;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Accept HTTP-date's three specified forms, without Date.parse's loose date syntax.
function retryAfterDelay(value: string | null): number | undefined {
  if (value === null) return undefined;
  const text = value.trim();
  if (/^\d+$/.test(text)) return Number(text) * 1000;
  const imf =
    /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{2}):(\d{2}):(\d{2}) GMT$/.exec(
      text
    );
  const rfc850 =
    /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{2}):(\d{2}):(\d{2}) GMT$/.exec(
      text
    );
  const asctime =
    /^(Sun|Mon|Tue|Wed|Thu|Fri|Sat) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|0[1-9]|[12]\d|3[01]) (\d{2}):(\d{2}):(\d{2}) (\d{4})$/.exec(
      text
    );
  const match =
    imf ??
    rfc850 ??
    (asctime
      ? [
          asctime[0],
          asctime[1],
          asctime[3],
          asctime[2],
          asctime[7],
          asctime[4],
          asctime[5],
          asctime[6],
        ]
      : null);
  if (!match) return undefined;
  const day = Number(match[2]);
  const month = months.indexOf(match[3]);
  let year = Number(match[4]);
  const hour = Number(match[5]);
  const minute = Number(match[6]);
  const second = Number(match[7]);
  const date = new Date(0);
  if (rfc850) {
    const cutoff = new Date(Date.now());
    cutoff.setUTCFullYear(cutoff.getUTCFullYear() + 50);
    year += Math.floor(cutoff.getUTCFullYear() / 100) * 100;
    date.setUTCFullYear(year, month, day);
    date.setUTCHours(hour, minute, Math.min(second, 59), 0);
    if (date.getTime() > cutoff.getTime()) year -= 100;
  }
  date.setUTCFullYear(year, month, day);
  date.setUTCHours(hour, minute, Math.min(second, 59), 0);
  const weekday = match[1].slice(0, 3);
  if (
    second > 60 ||
    (second === 60 && (hour !== 23 || minute !== 59)) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day ||
    date.getUTCHours() !== hour ||
    date.getUTCMinutes() !== minute ||
    weekdays[date.getUTCDay()] !== weekday
  )
    return undefined;
  return Math.max(0, date.getTime() + (second === 60 ? 1000 : 0) - Date.now());
}

const sleep = (ms: number, signal?: AbortSignal): Promise<void> => {
  if (!signal) return new Promise<void>((resolve) => setTimeout(resolve, ms));
  signal.throwIfAborted();
  // A caller's earlier listener must not suppress cancellation of this wait.
  const waitSignal = AbortSignal.any([signal]);
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      reject(waitSignal.reason);
    };
    const timer = setTimeout(() => {
      waitSignal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    waitSignal.addEventListener('abort', onAbort, { once: true });
  });
};

const RETRY_BODY_DRAIN_LIMIT = 64 * 1024;
const RETRY_BODY_DRAIN_TIMEOUT_MS = 10;

const discardRetryBody = async (body: ReadableStream<Uint8Array> | null): Promise<void> => {
  if (!body) return;
  const reader = body.getReader();
  const cancel = () => void reader.cancel().catch(() => undefined);
  const timer = setTimeout(cancel, RETRY_BODY_DRAIN_TIMEOUT_MS);
  try {
    let remaining = RETRY_BODY_DRAIN_LIMIT;
    while (remaining >= 0) {
      const { done, value } = await reader.read();
      if (done) return;
      remaining -= Math.max(1, value.byteLength);
    }
  } finally {
    clearTimeout(timer);
    cancel();
    reader.releaseLock();
  }
};

const readBoundedBytes = async (
  response: Response,
  maxResponseBytes: number
): Promise<Uint8Array> => {
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxResponseBytes) {
        throw new RangeError(`HTTP response exceeds ${maxResponseBytes} bytes`);
      }
      chunks.push(value);
    }
  } finally {
    // Cancel on limits/read failures, and release the stream before retrying.
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
};

/** Options for {@link HttpBackend.createRequest}. */
export interface HttpRequestOptions {
  /** RPC endpoint URL. */
  url: string;
  /** HTTP method. Defaults to `'GET'`. */
  method?: 'GET' | 'POST';
  /** Per-attempt timeout in milliseconds, including response body reads. Defaults to the backend's constructor value (30 000 ms). */
  timeout?: number;
  /** Optional caller cancellation, independent of the per-attempt timeout. */
  signal?: AbortSignal;
  /** Parse the response as JSON. When `false`, returns raw text. Defaults to `true`. */
  json?: boolean;
  /** Query parameters appended to the URL as a query string. */
  query?: ObjectType;
  /** HTTP headers. `Content-Type: application/json` is set by default if not provided. */
  headers?: { [key: string]: string };
}

/**
 * HTTP client used by Taquito to communicate with Tezos RPC nodes.
 *
 * Uses `globalThis.fetch` (Node.js >= 22 built-in or browser native).
 * Retries eligible transport failures, such as socket resets and DNS errors, and transient
 * gateway HTTP statuses (`502`, `503`, `504`) on allowlisted requests (`GET` and
 * safe RPC `POST` endpoints) with exponential backoff and jitter. Requests that fail
 * with {@link HttpTimeoutError} are not retried. GET 429 responses also use bounded Retry-After handling.
 * Configure via environment variables:
 *
 * - `TAQUITO_HTTP_RETRY_COUNT` - max retries (default `1`)
 * - `TAQUITO_HTTP_RETRY_BASE_MS` - base delay in ms (default `100`)
 * - `TAQUITO_HTTP_TRACE` - emit JSON request logs when `true` or `1`
 */
export class HttpBackend {
  /**
   * @param timeout - Default per-attempt request timeout in milliseconds (default `30000`).
   */
  constructor(private timeout: number = 30000) {}

  /** Serialize an object into a URL query string (including the leading `?`). */
  protected serialize(obj?: ObjectType) {
    if (!obj) {
      return '';
    }

    const str = [];
    for (const p in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(p) && typeof obj[p] !== 'undefined') {
        const val = obj[p];
        // query arguments can have no value so we need some way of handling that
        // example https://domain.com/query?all
        if (val === null) {
          str.push(encodeURIComponent(p));
          continue;
        }
        const prop = typeof val.toJSON === 'function' ? val.toJSON() : val;
        if (prop === null) {
          str.push(encodeURIComponent(p));
          continue;
        }
        // another use case is multiple arguments with the same name
        // they are passed as array
        if (Array.isArray(prop)) {
          prop.forEach((item) => {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(item));
          });
          continue;
        }
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(prop));
      }
    }
    const serialized = str.join('&');
    if (serialized) {
      return `?${serialized}`;
    } else {
      return '';
    }
  }

  /**
   * Send an HTTP request to the given URL, with automatic retries on retriable transport
   * errors and transient gateway statuses (`502`, `503`, `504`) for allowlisted requests.
   * The timeout covers headers and body reads for each attempt. Non-abort errors
   * reading a successful response body, including JSON parse errors, propagate unchanged.
   * Failures reading an HTTP error response body retain the status-based retry policy.
   *
   * @param options - Request configuration (URL, method, per-attempt timeout, headers, etc.).
   * @param data - Request body, serialized to JSON via `JSON.stringify`.
   * @returns The parsed JSON response (or raw text when `json: false`).
   * @throws {@link HttpResponseError} when the server returns HTTP status >= 400 (after any applicable retries).
   * @throws {@link HttpTimeoutError} when an attempt times out before response headers or while reading a successful response body.
   * @throws {@link HttpRequestFailed} for transport failures before reading a successful body.
   */
  async createRequest<T>(options: HttpRequestOptions, data?: object | string): Promise<T> {
    return this.request(options, data, async (response) => {
      if (options.json !== false) {
        return response.json() as Promise<T>;
      }
      // The existing generic API lets callers specify the raw text result type.
      return response.text() as unknown as Promise<T>;
    });
  }

  /** Fetch binary data without text decoding, with a bound on buffered response bytes. */
  async createRequestBytes(
    options: HttpRequestOptions,
    maxResponseBytes: number
  ): Promise<Uint8Array> {
    if (!Number.isSafeInteger(maxResponseBytes) || maxResponseBytes <= 0) {
      throw new RangeError('maxResponseBytes must be a positive safe integer');
    }
    const readBytes = (response: Response) => readBoundedBytes(response, maxResponseBytes);
    return this.request(options, undefined, readBytes, async (response) =>
      new TextDecoder().decode(await readBytes(response))
    );
  }

  private async request<T>(
    { url, method, timeout = this.timeout, signal, query, headers = {} }: HttpRequestOptions,
    data: object | string | undefined,
    readResponse: (response: Response) => Promise<T>,
    readErrorResponse: (response: Response) => Promise<string> = (response) => response.text()
  ) {
    // Serializes query params
    const urlWithQuery = url + this.serialize(query);
    const methodValue = String(method ?? 'GET');

    // Default Content-Type without mutating the caller's headers object
    const requestHeaders: { [key: string]: string } = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Serialized once on first attempt, reused on retries for byte-stable requests.
    let body: string | undefined;
    let bodySerialized = false;

    for (let attempt = 0; attempt <= httpRetryCount; attempt++) {
      signal?.throwIfAborted();
      // Creates a new AbortController instance to handle timeouts
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), timeout);
      const requestStartedAt = Date.now();
      let readingResponseBody = false;

      try {
        if (!bodySerialized) {
          body = JSON.stringify(data);
          bodySerialized = true;
        }

        const response = await globalThis.fetch(urlWithQuery, {
          method,
          headers: requestHeaders,
          body,
          signal: signal ? AbortSignal.any([controller.signal, signal]) : controller.signal,
        });

        if (typeof response === 'undefined') {
          throw new Error('Response is undefined');
        }

        // Handle responses with status code >= 400
        if (response.status >= 400) {
          const canRetryRateLimit =
            response.status === 429 &&
            methodValue.toUpperCase() === 'GET' &&
            attempt < httpRetryCount;
          let retryDelayMs: number | undefined;
          if (canRetryRateLimit) {
            const requestedDelay = retryAfterDelay(response.headers.get('Retry-After'));
            if (requestedDelay === undefined || requestedDelay <= MAX_RETRY_AFTER_MS) {
              retryDelayMs = requestedDelay ?? computeRetryDelayMs(attempt);
            }
          }

          let errorData = '';
          if (retryDelayMs === undefined) {
            try {
              errorData = await readErrorResponse(response);
            } catch {
              // Preserve the HTTP status when the error body cannot be read.
              errorData = response.statusText || '';
            }
          }
          traceHttp(() => ({
            stage: 'response-error',
            method: methodValue,
            url: normalizeTraceUrl(urlWithQuery),
            status: response.status,
            elapsedMs: Date.now() - requestStartedAt,
          }));
          if (retryDelayMs !== undefined) {
            clearTimeout(t);
            // Draining a small, ready body preserves the connection without delaying the retry.
            void discardRetryBody(response.body).catch(() => undefined);
            traceHttp(() => ({
              stage: 'request-retry',
              method: methodValue,
              url: normalizeTraceUrl(urlWithQuery),
              status: response.status,
              attempt: attempt + 1,
              maxAttempts: httpRetryCount + 1,
              retryDelayMs,
            }));
            await sleep(retryDelayMs, signal);
            continue;
          }
          throw new HttpResponseError(
            `Http error response: (${response.status}) ${errorData}`,
            response.status as STATUS_CODE,
            response.statusText,
            errorData,
            urlWithQuery
          );
        }

        traceHttp(() => ({
          stage: 'response-ok',
          method: methodValue,
          url: normalizeTraceUrl(urlWithQuery),
          status: response.status,
          elapsedMs: Date.now() - requestStartedAt,
        }));

        // Keep the deadline active while retaining the existing body-error policy.
        readingResponseBody = true;
        return await readResponse(response);
      } catch (e: unknown) {
        clearTimeout(t);
        if (signal?.aborted) throw e;
        // Preserve the public JSON parse error; it is not a transport failure.
        if (e instanceof SyntaxError) throw e;
        // HttpResponseError is an application-level error (status >= 400), not a transport error.
        // Only transient gateway errors (502, 503, 504) on allowlisted requests are retried;
        // other status codes (e.g. 500 from Octez RPC) short-circuit before transport
        // classification so RPC body text containing strings like "connection reset" is not
        // misclassified as a transport error.
        if (e instanceof HttpResponseError) {
          if (
            attempt < httpRetryCount &&
            isRetriableStatus(e.status) &&
            isRetriableRequest(methodValue, urlWithQuery)
          ) {
            const retryDelayMs = computeRetryDelayMs(attempt);
            traceHttp(() => ({
              stage: 'request-retry',
              method: methodValue,
              url: normalizeTraceUrl(urlWithQuery),
              elapsedMs: Date.now() - requestStartedAt,
              attempt: attempt + 1,
              maxAttempts: httpRetryCount + 1,
              retryDelayMs,
              status: e.status,
              statusText: e.statusText,
            }));
            await sleep(retryDelayMs, signal);
            continue;
          }
          traceHttp(() => ({
            stage: 'http-response-error',
            method: methodValue,
            url: normalizeTraceUrl(urlWithQuery),
            elapsedMs: Date.now() - requestStartedAt,
            status: e.status,
          }));
          throw e;
        }

        const classified = e instanceof Error ? classifyTransportError(e) : undefined;
        // Preserve body-read and JSON parse errors without transport wrapping or retries.
        // An aborted body read still uses the request's timeout error.
        if (readingResponseBody && classified?.kind !== 'abort') {
          throw e;
        }
        const isRetriableTransport =
          classified !== undefined && classified.kind !== 'abort' && classified.kind !== 'tls';
        const shouldRetry =
          attempt < httpRetryCount &&
          isRetriableRequest(methodValue, urlWithQuery) &&
          isRetriableTransport;

        if (shouldRetry) {
          const retryDelayMs = computeRetryDelayMs(attempt);
          traceHttp(() => ({
            stage: 'request-retry',
            method: methodValue,
            url: normalizeTraceUrl(urlWithQuery),
            elapsedMs: Date.now() - requestStartedAt,
            attempt: attempt + 1,
            maxAttempts: httpRetryCount + 1,
            retryDelayMs,
            error: formatErrorCauseChain(e),
            transportKind: classified?.kind,
          }));
          await sleep(retryDelayMs, signal);
          continue;
        }

        if (classified?.kind === 'abort') {
          traceHttp(() => ({
            stage: 'timeout',
            method: methodValue,
            url: normalizeTraceUrl(urlWithQuery),
            elapsedMs: Date.now() - requestStartedAt,
            timeoutMs: timeout,
          }));
          throw new HttpTimeoutError(timeout, urlWithQuery);
        } else {
          traceHttp(() => ({
            stage: 'request-failed',
            method: methodValue,
            url: normalizeTraceUrl(urlWithQuery),
            elapsedMs: Date.now() - requestStartedAt,
            error: formatErrorCauseChain(e),
            transportKind: classified?.kind,
          }));
          const cause = e instanceof Error ? e : new Error(String(e));
          throw new HttpRequestFailed(methodValue, urlWithQuery, cause, classified);
        }
      } finally {
        clearTimeout(t);
      }
    }

    throw new Error('Unexpected request retry flow');
  }
}
