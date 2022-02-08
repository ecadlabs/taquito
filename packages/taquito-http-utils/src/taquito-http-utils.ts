/**
 * @packageDocumentation
 * @module @taquito/http-utils
 */

import { STATUS_CODE } from './status_code';
import axios from 'axios';

export * from './status_code';
export { VERSION } from './version';

const defaultTimeout = 30000;

export interface HttpRequestOptions {
  url: string;
  method?: 'GET' | 'POST';
  timeout?: number;
  json?: boolean;
  query?: { [key: string]: any };
  headers?: { [key: string]: string };
  mimeType?: string;
}

export class HttpResponseError extends Error {
  public name = 'HttpResponse';

  constructor(
    public message: string,
    public status: STATUS_CODE,
    public statusText: string,
    public body: string,
    public url: string
  ) {
    super(message);
  }
}

export class HttpRequestFailed extends Error {
  public name = 'HttpRequestFailed';

  constructor(public url: string, public innerEvent: any) {
    super(`Request to ${url} failed`);
  }
}

export class HttpBackend {
  protected serialize(obj?: { [key: string]: any }) {
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
   */
  async createRequest<T>(
    {
      url,
      method,
      timeout = defaultTimeout,
      query,
      headers = {},
      json = true
    }: HttpRequestOptions,
    data?: object | string
  ) {
    let resType: 'text' | 'json';
    let transformResponse = undefined;

    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    if (!json) {
      resType = 'text'
      transformResponse = [(v: any) => v]
    } else {
      resType = 'json';
    }
  
    let response;
    try {
      response = await axios.request<T>({
        url: url + this.serialize(query),
        method: method ?? 'GET',
        headers: headers,
        responseType: resType,
        transformResponse,
        timeout: timeout,
        data: data,
      });
    } catch (err: any) {
      throw new HttpResponseError(
        `Http error response: (${err.response.status}) ${JSON.stringify(err.response.data)}`,
        err.response.status as STATUS_CODE,
        err.response.statusText,
        JSON.stringify(err.response.data),
        url + this.serialize(query)
      )
    }

    return response.data
  }
}
