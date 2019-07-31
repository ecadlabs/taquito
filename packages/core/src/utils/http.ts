const defaultTimeout = 10000;

/**
 * @description Interface that define base methods for http backends
 */
export interface HttpBackend {
  /**
   *
   * @param options contains options to be passed for the HTTP request (url, method and timeout)
   */
  createRequest<T>(options: HttpRequestOptions): Promise<T>;
}

interface HttpRequestOptions {
  url: string;
  method?: "GET" | "POST";
  timeout?: number;
}

/**
 * @description Default http backend
 */
export class HttpBackend {
  private createXHR(): XMLHttpRequest {
    // tslint:disable: strict-type-predicates
    if (
      typeof process !== "undefined" &&
      process.versions != null &&
      process.versions.node != null
      // tslint:enable: strict-type-predicates
    ) {
      const NodeXHR = require("xhr2-cookies").XMLHttpRequest;
      const request = new NodeXHR();
      return request;
    } else {
      return new XMLHttpRequest();
    }
  }

  /**
   *
   * @param options contains options to be passed for the HTTP request (url, method and timeout)
   */
  createRequest<T>({ url, method, timeout }: HttpRequestOptions, data?: {}) {
    return new Promise<T>((resolve, reject) => {
      const request = this.createXHR();
      request.open(method || "GET", url);
      request.setRequestHeader("Content-Type", "application/json");
      request.timeout = timeout || defaultTimeout;
      request.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          resolve(JSON.parse(request.response));
        } else {
          reject({
            status: this.status,
            statusText: request.statusText
          });
        }
      };
      request.onerror = function() {
        reject({
          status: this.status,
          statusText: request.statusText
        });
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
