/**
 * @packageDocumentation
 * @module @taquito/http-utils
 */

import { STATUS_CODE } from './status_code';
import axios, { AxiosAdapter, AxiosResponse } from 'axios';

const isNode =
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const adapterPromise = isNode
  ? undefined
  : import('@vespaiach/axios-fetch-adapter').then((mod) => mod.default).catch(() => undefined);

export * from './status_code';
export { VERSION } from './version';

enum ResponseType {
  TEXT = 'text',
  JSON = 'json',
}

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

export interface AxiosFetchAdapterErrorResponse {
  request?: string;
  response?: AxiosResponse;
  message?: string;
  config?: string;
  code?: string;
  status?: number;
}

/**
 *  @category Error
 *  @description This error will be thrown when the endpoint returns an HTTP error to the client
 */
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

/**
 *  @category Error
 *  @description Error that indicates a general failure in making the HTTP request
 */
export class HttpRequestFailed extends Error {
  public name = 'HttpRequestFailed';

  constructor(public message: string) {
    super(message);
  }
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
   */
  async createRequest<T>(
    { url, method, timeout = this.timeout, query, headers = {}, json = true }: HttpRequestOptions,
    data?: object | string
  ) {
    let resType: ResponseType;
    let transformResponse = undefined;

    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (!json) {
      resType = ResponseType.TEXT;
      transformResponse = [<Type>(v: Type) => v];
    } else {
      resType = ResponseType.JSON;
    }

    try {
      const adapter = adapterPromise && ((await adapterPromise) as AxiosAdapter);
      const response = await axios.request<T>({
        url: url + this.serialize(query),
        method: method ?? 'GET',
        headers: headers,
        responseType: resType,
        transformResponse,
        timeout: timeout,
        data: data,
        adapter,
      });

      return response.data;
    } catch (err: any) {
      if ((axios.isAxiosError(err) && err.response) || (!isNode && err.response)) {
        let errorData;

        if (typeof err.response.data === 'object') {
          errorData = JSON.stringify(err.response.data);
        } else {
          errorData = err.response.data;
        }

        throw new HttpResponseError(
          `Http error response: (${err.response.status}) ${errorData}`,
          err.response.status as STATUS_CODE,
          err.response.statusText,
          errorData,
          url + this.serialize(query)
        );
      } else {
        throw new HttpRequestFailed(`${method} ${url + this.serialize(query)} ${String(err)}`);
      }
    }
  }
}
