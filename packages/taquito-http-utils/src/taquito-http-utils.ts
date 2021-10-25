/**
 * @packageDocumentation
 * @module @taquito/http-utils
 */

import { STATUS_CODE } from './status_code';

type runtime = 'node' | 'deno' | 'browser'
let runtime : runtime = typeof window !== 'undefined'
  ? (
    window.hasOwnProperty('Deno')
      ? 'deno'
      : 'browser'
  )
  : 'node'

const xhrModule = (
  () => {
    switch (runtime) {
      case 'browser': return './xhr'
      case 'node': return './xhr-node'
      case 'deno': return 'https://deno.land/x/xhr@0.1.0/mod.ts'
    }
  }
)()

const XMLHttpRequestCTOR = async () => await import(xhrModule)

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

export class HttpResponseError implements Error {
  public name = 'HttpResponse';

  constructor(
    public message: string,
    public status: STATUS_CODE,
    public statusText: string,
    public body: string,
    public url: string
  ) {}
}

export class HttpRequestFailed implements Error {
  public name = 'HttpRequestFailed';
  public message: string;

  constructor(public url: string, public innerEvent: any) {
    this.message = `Request to ${url} failed`;
  }
}

export class HttpBackend {
  protected serialize(obj?: { [key: string]: any }) {
    if (!obj) {
      return '';
    }

    const str = [];
    for (const p in obj) {
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

  protected async createXHR(): Promise<XMLHttpRequest> {
    const ctor = await XMLHttpRequestCTOR()
    return new ctor()
  }

  /**
   *
   * @param options contains options to be passed for the HTTP request (url, method and timeout)
   */
  createRequest(
    {
      url,
      method,
      timeout,
      query,
      headers = {},
      json = true,
      mimeType = undefined,
    }: HttpRequestOptions,
    data?: {}
  ) {
    return this.createXHR()
      .then(request => {
        request.open(method || 'GET', `${url}${this.serialize(query)}`);
        if (!headers['Content-Type']) {
          request.setRequestHeader('Content-Type', 'application/json');
        }
        if (mimeType) {
          request.overrideMimeType(`${mimeType}`);
        }
        for (const k in headers) {
          request.setRequestHeader(k, headers[k]);
        }
        request.timeout = timeout || defaultTimeout;
        request.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            if (json) {
              try {
                return Promise.resolve(JSON.parse(request.response));
              } catch (ex) {
                return Promise.reject(new Error(`Unable to parse response: ${request.response}`));
              }
            } else {
              return Promise.resolve(request.response);
            }
          } else {
            return Promise.reject(
              new HttpResponseError(
                `Http error response: (${this.status}) ${request.response}`,
                this.status as STATUS_CODE,
                request.statusText,
                request.response,
                url
              )
            );
          }
        };

        request.ontimeout = function () {
          return Promise.reject(new Error(`Request timed out after: ${request.timeout}ms`));
        };

        request.onerror = function (err) {
          return Promise.reject(new HttpRequestFailed(url, err));
        };

        if (data) {
          const dataStr = JSON.stringify(data);
          request.send(dataStr);
        } else {
          request.send();
        }
      })
  }
}
