/**
 * @packageDocumentation
 * @module @taquito/http-utils
 */

let fetch = globalThis?.fetch;
let createAgent: ((url: string) => { keepAlive?: boolean; [key: string]: any }) | undefined;
let useNodeFetchAgent = false;
let nodeKeepAliveEnabled = false;

const isNode = typeof process !== 'undefined' && !!process?.versions?.node;
const isBrowserLike = typeof window !== 'undefined';
const httpTraceEnabled =
  /^(1|true)$/i.test(process?.env?.TAQUITO_HTTP_TRACE ?? '') || process?.env?.RUNNER_DEBUG === '1';
const parsedHttpRetryCount = Number(process?.env?.TAQUITO_HTTP_RETRY_COUNT ?? '1');
const httpRetryCount =
  Number.isFinite(parsedHttpRetryCount) && parsedHttpRetryCount >= 0
    ? Math.floor(parsedHttpRetryCount)
    : 1;
const parsedHttpRetryBaseMs = Number(process?.env?.TAQUITO_HTTP_RETRY_BASE_MS ?? '100');
const httpRetryBaseMs =
  Number.isFinite(parsedHttpRetryBaseMs) && parsedHttpRetryBaseMs >= 0
    ? parsedHttpRetryBaseMs
    : 100;

// Use native fetch in browser-like environments (they have reliable native fetch)
// Use node-fetch in pure Node.js CLI for better compatibility and keepAlive control
if (isNode && !isBrowserLike) {
  // Handle both ESM and CJS default export patterns for webpack compatibility
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeFetch = require('node-fetch');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const https = require('https');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const http = require('http');
  fetch = nodeFetch.default || nodeFetch;
  useNodeFetchAgent = true;
  const keepAliveFlag = process?.env?.TAQUITO_HTTP_KEEPALIVE?.toLowerCase();
  // Default remains false for reliability. Set TAQUITO_HTTP_KEEPALIVE=true to opt in.
  nodeKeepAliveEnabled = keepAliveFlag === 'true' || keepAliveFlag === '1';
  const httpsAgent = new https.Agent({
    keepAlive: nodeKeepAliveEnabled,
    maxFreeSockets: 10,
    keepAliveMsecs: 1000,
    family: 4,
  });
  const httpAgent = new http.Agent({
    keepAlive: nodeKeepAliveEnabled,
    maxFreeSockets: 10,
    keepAliveMsecs: 1000,
    family: 4,
  });
  createAgent = (url: string) => {
    return url.startsWith('https') ? httpsAgent : httpAgent;
  };
} else if (typeof fetch !== 'function') {
  throw new Error('No fetch implementation available');
}

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

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
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

export interface HttpRequestOptions {
  url: string;
  method?: 'GET' | 'POST';
  timeout?: number;
  json?: boolean;
  query?: ObjectType;
  headers?: { [key: string]: string };
  mimeType?: string;
}

export class HttpBackend {
  constructor(private timeout: number = 30000) {}

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
   *
   * @param options contains options to be passed for the HTTP request (url, method and timeout)
   * @throws {@link HttpRequestFailed} | {@link HttpResponseError} | {@link HttpTimeoutError}
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

        const response = await fetch(urlWithQuery, {
          method,
          headers,
          body,
          signal: controller.signal,
          ...(useNodeFetchAgent && createAgent ? { agent: createAgent(urlWithQuery) } : {}),
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
            keepAlive: nodeKeepAliveEnabled,
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
          keepAlive: nodeKeepAliveEnabled,
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
            keepAlive: nodeKeepAliveEnabled,
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
            keepAlive: nodeKeepAliveEnabled,
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
            keepAlive: nodeKeepAliveEnabled,
          });
          throw new HttpRequestFailed(methodValue, urlWithQuery, e as Error, classified);
        }
      } finally {
        clearTimeout(t);
      }
    }

    throw new Error('Unexpected request retry flow');
  }
}
