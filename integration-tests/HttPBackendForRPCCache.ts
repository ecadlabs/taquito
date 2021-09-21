import { HttpBackend, HttpRequestFailed, HttpResponseError } from '@taquito/http-utils';
import { STATUS_CODE } from '../packages/taquito-http-utils/src/status_code';

export interface HttpRequestOptions {
    url: string;
    method?: 'GET' | 'POST';
    timeout?: number;
    json?: boolean;
    query?: { [key: string]: any };
    headers?: { [key: string]: string };
    mimeType?: string;
  }

const defaultTimeout = 30000;

export class HttpBackendForRPCCache extends HttpBackend { 
  constructor() {
    super();
  }
    
  public rpcCountingMap = new Map<string, number>();

  createRequest<T>(
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
    return new Promise<T>((resolve, reject) => {
      const request = this.createXHR();

      request.open(method || 'GET', `${url}${this.serialize(query)}`);

      let counter = this.rpcCountingMap.get(url);
      if (counter) {
        this.rpcCountingMap.set(url,++counter);        
      } else {
        this.rpcCountingMap.set(url, 1);
      }
      
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
              resolve(JSON.parse(request.response));
            } catch (ex) {
              reject(new Error(`Unable to parse response: ${request.response}`));
            }
          } else {
            resolve(request.response);
          }
        } else {
          reject(
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
        reject(new Error(`Request timed out after: ${request.timeout}ms`));
      };

      request.onerror = function (err) {
        reject(new HttpRequestFailed(url, err));
      };

      if (data) {
        const dataStr = JSON.stringify(data);
        request.send(dataStr);
      } else {
        request.send();
      }
    });
  }
}
