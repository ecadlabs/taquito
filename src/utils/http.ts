const defaultTimeout = 10000

/**
 * @description Interface that define base methods for http backends
 */
export interface HttpBackend {
  /**
   *
   * @param options contains options to be passed for the HTTP request (url, method and timeout)
   */
  createRequest<T>(options: HttpRequestOptions): Promise<T>
}

interface HttpRequestOptions {
  url: string
  method?: 'GET' | 'POST'
  timeout?: number
}

/**
 * @description Default http backend used in browser
 */
export class BrowserHttpBackend implements HttpBackend {
  createRequest<T>({ url, method, timeout }: HttpRequestOptions) {
    return new Promise<T>(function(resolve, reject) {
      const request = new XMLHttpRequest()
      request.open(method || 'GET', url)
      request.setRequestHeader('Content-Type', 'application/json')
      request.timeout = timeout || defaultTimeout
      request.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          resolve(request.response)
        } else {
          reject({
            status: this.status,
            statusText: request.statusText
          })
        }
      }
      request.onerror = function() {
        reject({
          status: this.status,
          statusText: request.statusText
        })
      }
      request.send()
    })
  }
}
