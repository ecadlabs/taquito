/**
 * @packageDocumentation
 * @module @taquito/http-utils
 */

let fetch = globalThis?.fetch;
// Will only use browser fetch if we are in a browser environment,
// default to the more stable node-fetch otherwise
const isNode = typeof process !== 'undefined' && !!process?.versions?.node;
if (isNode) {
  fetch = require('node-fetch');
}

import { STATUS_CODE } from './status_code';
import { HttpRequestFailed, HttpResponseError, HttpTimeoutError } from './errors';

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

    // Creates a new AbortController instance to handle timeouts
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(urlWithQuery, {
        method,
        headers,
        body: JSON.stringify(data),
        signal: controller.signal,
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
