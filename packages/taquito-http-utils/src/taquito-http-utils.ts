/**
 * @packageDocumentation
 * @module @taquito/http-utils
 */

import { Agent as HttpsAgent } from 'https';
import { Agent as HttpAgent } from 'http';

let fetch = globalThis?.fetch;
let createAgent: ((url: string) => HttpsAgent | HttpAgent) | undefined;
// Will only use browser fetch if we are in a browser environment,
// default to the more stable node-fetch otherwise
const isNode = typeof process !== 'undefined' && !!process?.versions?.node;
if (isNode) {
  // Handle both ESM and CJS default export patterns for webpack compatibility
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeFetch = require('node-fetch');
  fetch = nodeFetch.default || nodeFetch;
  if (Number(process.versions.node.split('.')[0]) >= 19) {
    // we need agent with keepalive false for node 19 and above
    createAgent = (url: string) => {
      return url.startsWith('https')
        ? new HttpsAgent({ keepAlive: false })
        : new HttpAgent({ keepAlive: false });
    };
  }
}

import { STATUS_CODE } from './status_code';
import { HttpRequestFailed, HttpResponseError, HttpTimeoutError } from './errors';
import { VERSION } from './version';

export * from './status_code';
export { VERSION } from './version';
export { HttpRequestFailed, HttpResponseError, HttpTimeoutError } from './errors';

type ObjectType = Record<string, any>;

export interface HttpRequestOptions {
  url: string;
  method?: 'GET' | 'POST';
  timeout?: number;
  json?: boolean;
  query?: ObjectType;
  headers?: { [key: string]: string };
  mimeType?: string;
}

/**
 * Warning callback for CORS-related issues with analytics headers
 */
export type CorsWarningCallback = (warning: CorsWarning) => void;

export interface CorsWarning {
  header: string;
  url: string;
  message: string;
}

export interface ClientInfo {
  appName?: string;
  appUrl?: string;
  sendSdkVersion?: boolean;
  onCorsWarning?: CorsWarningCallback;
}

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Header names for RPC analytics
const HEADER_SDK = 'X-Tezos-SDK';
const HEADER_APP_NAME = 'X-Tezos-App-Name';
const HEADER_APP_URL = 'X-Tezos-App-Url';

/**
 * Get the browser origin if available, undefined otherwise
 */
function getBrowserOrigin(): string | undefined {
  if (isBrowser && typeof window.location?.origin === 'string') {
    return window.location.origin;
  }
  return undefined;
}

export class HttpBackend {
  // Track if we've already warned about specific headers for specific URLs
  private allowedHeadersCache: Map<string, Set<string>> = new Map();
  private warnedHeaders: Set<string> = new Set();
  // Track in-flight CORS verification promises to avoid duplicate requests
  private pendingCorsChecks: Map<string, Promise<void>> = new Map();

  constructor(
    private timeout: number = 30000,
    private clientInfo?: ClientInfo
  ) {}

  /**
   * Verifies which analytics headers are supported by the RPC server via CORS.
   * This performs a preflight-style OPTIONS request to check Access-Control-Allow-Headers.
   *
   * @param url The RPC URL to check
   * @returns Object indicating which headers are supported
   */
  async verifyCorsSupport(url: string): Promise<{
    sdkHeader: boolean;
    appNameHeader: boolean;
    appUrlHeader: boolean;
    allowedHeaders: string[];
  }> {
    const origin = this.getUrlOrigin(url);
    const headersToCheck = [HEADER_SDK, HEADER_APP_NAME, HEADER_APP_URL];

    try {
      // Perform OPTIONS request to check CORS support
      const response = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': headersToCheck.join(', '),
        },
      });

      const allowHeadersRaw = response.headers.get('Access-Control-Allow-Headers') ?? '';
      const allowedHeadersList = allowHeadersRaw
        .split(',')
        .map((h) => h.trim().toLowerCase())
        .filter((h) => h.length > 0);

      const allowedSet = new Set(allowedHeadersList);
      this.allowedHeadersCache.set(origin, allowedSet);

      const result = {
        sdkHeader: allowedSet.has(HEADER_SDK.toLowerCase()),
        appNameHeader: allowedSet.has(HEADER_APP_NAME.toLowerCase()),
        appUrlHeader: allowedSet.has(HEADER_APP_URL.toLowerCase()),
        allowedHeaders: allowedHeadersList,
      };

      // Emit warnings for unsupported headers that the user configured
      this.emitWarningsForUnsupportedHeaders(url, result);

      return result;
    } catch {
      // If OPTIONS request fails, assume no custom headers are allowed
      this.allowedHeadersCache.set(origin, new Set());
      const result = {
        sdkHeader: false,
        appNameHeader: false,
        appUrlHeader: false,
        allowedHeaders: [],
      };
      // Still emit warnings since headers won't be sent
      this.emitWarningsForUnsupportedHeaders(url, result);
      return result;
    }
  }

  /**
   * Ensures CORS verification has been done for the given URL.
   * Uses caching to avoid duplicate requests. Called lazily on first request.
   */
  private async ensureCorsVerified(url: string): Promise<void> {
    const origin = this.getUrlOrigin(url);

    // Already verified
    if (this.allowedHeadersCache.has(origin)) {
      return;
    }

    // Check if verification is already in progress
    const pending = this.pendingCorsChecks.get(origin);
    if (pending) {
      return pending;
    }

    // Start verification and track the promise
    const verifyPromise = this.verifyCorsSupport(url).then(() => {
      this.pendingCorsChecks.delete(origin);
    });
    this.pendingCorsChecks.set(origin, verifyPromise);
    return verifyPromise;
  }

  /**
   * Checks if a specific header is allowed for the given URL based on cached CORS info.
   */
  private isHeaderAllowed(url: string, header: string): boolean {
    const origin = this.getUrlOrigin(url);
    const allowedHeaders = this.allowedHeadersCache.get(origin);

    // Should not happen if ensureCorsVerified was called first
    if (!allowedHeaders) {
      return false;
    }

    return allowedHeaders.has(header.toLowerCase());
  }

  /**
   * Extracts the origin from a URL
   */
  private getUrlOrigin(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.origin;
    } catch {
      return url;
    }
  }

  /**
   * Emits warnings for headers that are configured but not supported by the server
   */
  private emitWarningsForUnsupportedHeaders(
    url: string,
    corsResult: { sdkHeader: boolean; appNameHeader: boolean; appUrlHeader: boolean }
  ): void {
    if (!this.clientInfo?.onCorsWarning) return;

    const origin = this.getUrlOrigin(url);

    if (this.clientInfo.sendSdkVersion && !corsResult.sdkHeader) {
      const warnKey = `${origin}:${HEADER_SDK}`;
      if (!this.warnedHeaders.has(warnKey)) {
        this.warnedHeaders.add(warnKey);
        this.clientInfo.onCorsWarning({
          header: HEADER_SDK,
          url: origin,
          message: `The RPC server at ${origin} does not support the ${HEADER_SDK} header. This header will not be sent. Consider using a different RPC provider or disabling sendSdkVersion.`,
        });
      }
    }

    if (this.clientInfo.appName && !corsResult.appNameHeader) {
      const warnKey = `${origin}:${HEADER_APP_NAME}`;
      if (!this.warnedHeaders.has(warnKey)) {
        this.warnedHeaders.add(warnKey);
        this.clientInfo.onCorsWarning({
          header: HEADER_APP_NAME,
          url: origin,
          message: `The RPC server at ${origin} does not support the ${HEADER_APP_NAME} header. This header will not be sent. Consider using a different RPC provider or removing the appName configuration.`,
        });
      }
    }

    const appUrl = this.clientInfo.appUrl ?? getBrowserOrigin();
    if (appUrl && !corsResult.appUrlHeader) {
      const warnKey = `${origin}:${HEADER_APP_URL}`;
      if (!this.warnedHeaders.has(warnKey)) {
        this.warnedHeaders.add(warnKey);
        this.clientInfo.onCorsWarning({
          header: HEADER_APP_URL,
          url: origin,
          message: `The RPC server at ${origin} does not support the ${HEADER_APP_URL} header. This header will not be sent. Consider using a different RPC provider or removing the appUrl configuration.`,
        });
      }
    }
  }

  protected serialize(obj?: ObjectType) {
    if (!obj) {
      return '';
    }

    const str = [];
    for (const p in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(p) && typeof obj[p] !== 'undefined') {
        const prop = typeof obj[p].toJSON === 'function' ? obj[p].toJSON() : obj[p];
        // query arguments can have no value so we need some way of handling that
        // example https://domain.com/query?all
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

    // Adds default header entry if there aren't any Content-Type header
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Adds client info headers for RPC analytics (only if allowed by CORS)
    // Lazily verify CORS support on first request to this origin
    if (this.clientInfo) {
      await this.ensureCorsVerified(url);

      if (this.clientInfo.sendSdkVersion && this.isHeaderAllowed(url, HEADER_SDK)) {
        headers[HEADER_SDK] = `taquito/${VERSION.version}`;
      }
      if (this.clientInfo.appName && this.isHeaderAllowed(url, HEADER_APP_NAME)) {
        headers[HEADER_APP_NAME] = this.clientInfo.appName;
      }
      // Use provided appUrl, or auto-detect from browser origin if available
      const appUrl = this.clientInfo.appUrl ?? getBrowserOrigin();
      if (appUrl && this.isHeaderAllowed(url, HEADER_APP_URL)) {
        headers[HEADER_APP_URL] = appUrl;
      }
    }

    // Creates a new AbortController instance to handle timeouts
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(urlWithQuery, {
        keepalive: false, // Disable keepalive (keepalive defaults to true starting from Node 19 & 20)
        method,
        headers,
        body: JSON.stringify(data),
        signal: controller.signal,
        ...(isNode && createAgent ? { agent: createAgent(urlWithQuery) } : {}),
      });

      if (typeof response === 'undefined') {
        throw new Error('Response is undefined');
      }

      // Handle responses with status code >= 400
      if (response.status >= 400) {
        const errorData = await response.text();
        throw new HttpResponseError(
          `Http error response: (${response.status}) ${errorData}`,
          response.status as STATUS_CODE,
          response.statusText,
          errorData,
          urlWithQuery
        );
      }

      if (json) {
        return response.json() as T;
      } else {
        return response.text() as unknown as T;
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') {
        throw new HttpTimeoutError(timeout, urlWithQuery);
      } else if (e instanceof HttpResponseError) {
        throw e;
      } else {
        throw new HttpRequestFailed(String(method), urlWithQuery, e as Error);
      }
    } finally {
      clearTimeout(t);
    }
  }
}
