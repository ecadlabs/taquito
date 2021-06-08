import { HttpBackend, HttpRequestFailed, HttpResponseError, STATUS_CODE, HttpRequestOptions } from '@taquito/http-utils';
import { RpcClient } from '@taquito/rpc';
import AbortController from "abort-controller";

const defaultTimeout = 30000;

class CancellableHttpBackend extends HttpBackend {
  private abortCtrl: AbortController;
  constructor() {
    super(),
      this.abortCtrl = new AbortController();
  }

  resetAbortCtrl() {
    this.abortCtrl = new AbortController();
  }

  cancelRequest() {
    this.abortCtrl.abort();
  };

  createRequest<T>(
    { url, method, timeout, query, headers = {}, json = true, mimeType = undefined }: HttpRequestOptions,
    data?: {}
  ) {
    return new Promise<T>((resolve, reject) => {
      const request = this.createXHR();
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

      request.onabort = function () {
        reject(
          new HttpResponseError(
            `Request canceled`,
            this.status as STATUS_CODE,
            request.statusText,
            request.response,
            url
          )
        );
      };

      const abort = () => {
        request.abort();
        this.resetAbortCtrl();
      }

      this.abortCtrl.signal.addEventListener("abort", abort);

      if (data) {
        const dataStr = JSON.stringify(data);
        request.send(dataStr);
      } else {
        request.send();
      }
    });
  }
}

export class CancellableRpcClient extends RpcClient {
  httpBackend: CancellableHttpBackend;

  constructor(
    url: string,
    chain: string = 'main',
    cancellableHttpBackend: CancellableHttpBackend = new CancellableHttpBackend()
  ) {
    super(url, chain, cancellableHttpBackend);
      this.httpBackend = cancellableHttpBackend;
  }

  cancelRequest() {
    this.httpBackend.cancelRequest();
  }
}
