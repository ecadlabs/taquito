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

const httpTraceEnabled =
  /^(1|true)$/i.test(env?.TAQUITO_HTTP_TRACE ?? '') || env?.RUNNER_DEBUG === '1';
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
import { HttpRequestFailed, HttpResponseError, HttpTimeoutError } from './errors';
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

const traceHttp = (payload: Record<string, unknown>) => {
  if (!httpTraceEnabled) {
    return;
  }
  // JSON logs make CI-side grepping and aggregation much easier.
  console.log(`[taquito:http-trace] ${JSON.stringify(payload)}`);
};

const getCause = (err: Error): unknown => (err as unknown as Record<string, unknown>)['cause'];

const getCode = (err: Error): string | undefined => {
  const code = (err as unknown as Record<string, unknown>)['code'];
  return typeof code === 'string' ? code : undefined;
};

const MAX_CAUSE_DEPTH = 10;

const toErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return String(error);
  }
  const parts: string[] = [`${error.name}: ${error.message}`];
  let current: unknown = getCause(error);
  let depth = 0;
  while (depth < MAX_CAUSE_DEPTH) {
    if (current instanceof Error) {
      const code = getCode(current);
      const codeSuffix = code ? ` [${code}]` : '';
      parts.push(`${current.name}: ${current.message}${codeSuffix}`);
      current = getCause(current);
      depth++;
      continue;
    }
    // Handle object-shaped causes (e.g. undici { message, code } objects)
    if (
      typeof current === 'object' &&
      current !== null &&
      typeof (current as Record<string, unknown>)['message'] === 'string'
    ) {
      const obj = current as Record<string, unknown>;
      const code = typeof obj['code'] === 'string' ? obj['code'] : undefined;
      const codeSuffix = code ? ` [${code}]` : '';
      parts.push(`${obj['message']}${codeSuffix}`);
    }
    break;
  }
  return parts.join(' → ');
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
    // Safe to retry: ops are content-addressed, mempool deduplicates identical bytes,
    // and counter prevents replay. If the first request secretly succeeded but the
    // connection dropped, the retry may get a 500 (async_injection_failed) which
    // propagates to the caller via HttpResponseError (not retried). No silent corruption,
    // but the caller may see an error despite the op being on-chain.
    normalizedUrl.endsWith('/injection/operation')
  );
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Options for {@link HttpBackend.createRequest}. */
export interface HttpRequestOptions {
  /** RPC endpoint URL. */
  url: string;
  /** HTTP method. Defaults to `'GET'`. */
  method?: 'GET' | 'POST';
  /** Per-request timeout in milliseconds. Defaults to the backend's constructor value (30 000 ms). */
  timeout?: number;
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
 * Retries retriable transport errors (socket resets, DNS, timeouts) with
 * exponential backoff and jitter. Configure via environment variables:
 *
 * - `TAQUITO_HTTP_RETRY_COUNT` - max retries (default `1`)
 * - `TAQUITO_HTTP_RETRY_BASE_MS` - base delay in ms (default `100`)
 * - `TAQUITO_HTTP_TRACE` - emit JSON request logs when `true` or `1`
 */
export class HttpBackend {
  /**
   * @param timeout - Default request timeout in milliseconds (default `30000`).
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
   * Send an HTTP request to the given URL, with automatic retries on transport errors.
   *
   * @param options - Request configuration (URL, method, timeout, headers, etc.).
   * @param data - Request body, serialized to JSON via `JSON.stringify`.
   * @returns The parsed JSON response (or raw text when `json: false`).
   * @throws {@link HttpResponseError} when the server returns HTTP status >= 400.
   * @throws {@link HttpTimeoutError} when the request exceeds the configured timeout.
   * @throws {@link HttpRequestFailed} for transport-level failures (network, DNS, socket, etc.).
   */
  async createRequest<T>(
    { url, method, timeout = this.timeout, query, headers = {}, json = true }: HttpRequestOptions,
    data?: object | string
  ) {
    // Serializes query params
    const urlWithQuery = url + this.serialize(query);
    const methodValue = String(method ?? 'GET');

    // Adds default header entry if there aren't any Content-Type header
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Serialized once on first attempt, reused on retries for byte-stable requests.
    let body: string | undefined;
    let bodySerialized = false;

    for (let attempt = 0; attempt <= httpRetryCount; attempt++) {
      // Creates a new AbortController instance to handle timeouts
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), timeout);
      const requestStartedAt = Date.now();

      try {
        if (!bodySerialized) {
          body = JSON.stringify(data);
          bodySerialized = true;
        }

        const response = await globalThis.fetch(urlWithQuery, {
          method,
          headers,
          body,
          signal: controller.signal,
        });

        if (typeof response === 'undefined') {
          throw new Error('Response is undefined');
        }

        // Handle responses with status code >= 400
        if (response.status >= 400) {
          const errorData = await response.text();
          traceHttp({
            stage: 'response-error',
            method: methodValue,
            url: normalizeTraceUrl(urlWithQuery),
            status: response.status,
            elapsedMs: Date.now() - requestStartedAt,
          });
          throw new HttpResponseError(
            `Http error response: (${response.status}) ${errorData}`,
            response.status as STATUS_CODE,
            response.statusText,
            errorData,
            urlWithQuery
          );
        }

        traceHttp({
          stage: 'response-ok',
          method: methodValue,
          url: normalizeTraceUrl(urlWithQuery),
          status: response.status,
          elapsedMs: Date.now() - requestStartedAt,
        });

        if (json) {
          return response.json() as T;
        } else {
          return response.text() as unknown as T;
        }
      } catch (e: unknown) {
        // HttpResponseError is an application-level error (status >= 400), not a transport error.
        // Short-circuit before classification to prevent RPC body text (which may contain
        // strings like "connection reset") from being misclassified as a transport error.
        if (e instanceof HttpResponseError) {
          traceHttp({
            stage: 'http-response-error',
            method: methodValue,
            url: normalizeTraceUrl(urlWithQuery),
            elapsedMs: Date.now() - requestStartedAt,
            status: e.status,
          });
          throw e;
        }

        const classified = e instanceof Error ? classifyTransportError(e) : undefined;
        const isRetriableTransport =
          classified !== undefined && classified.kind !== 'abort' && classified.kind !== 'tls';
        const shouldRetry =
          attempt < httpRetryCount &&
          isRetriableRequest(methodValue, urlWithQuery) &&
          isRetriableTransport;

        if (shouldRetry) {
          const exponential = httpRetryBaseMs * Math.pow(2, attempt);
          const jitter = Math.floor(Math.random() * httpRetryBaseMs);
          const retryDelayMs = exponential + jitter;
          traceHttp({
            stage: 'request-retry',
            method: methodValue,
            url: normalizeTraceUrl(urlWithQuery),
            elapsedMs: Date.now() - requestStartedAt,
            attempt: attempt + 1,
            maxAttempts: httpRetryCount + 1,
            retryDelayMs,
            error: toErrorMessage(e),
            transportKind: classified?.kind,
          });
          await sleep(retryDelayMs);
          continue;
        }

        if (classified?.kind === 'abort') {
          traceHttp({
            stage: 'timeout',
            method: methodValue,
            url: normalizeTraceUrl(urlWithQuery),
            elapsedMs: Date.now() - requestStartedAt,
            timeoutMs: timeout,
          });
          throw new HttpTimeoutError(timeout, urlWithQuery);
        } else {
          traceHttp({
            stage: 'request-failed',
            method: methodValue,
            url: normalizeTraceUrl(urlWithQuery),
            elapsedMs: Date.now() - requestStartedAt,
            error: toErrorMessage(e),
            transportKind: classified?.kind,
          });
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
