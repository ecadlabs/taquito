import { NetworkError, TaquitoError } from '@taquito/core';
import { STATUS_CODE } from './status_code';

/**
 *  @category Error
 *  @description Error indicates a general failure in making the HTTP request
 */
export class HttpRequestFailed extends TaquitoError {
  constructor(public method: string, public url: string, public cause: Error) {
    super();
    this.name = 'HttpRequestFailed';
    this.message = `${method} ${url} ${String(cause)}`;
  }
}

/**
 *  @category Error
 *  @description Error thrown when the endpoint returns an HTTP error to the client
 */
export class HttpResponseError extends NetworkError {
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
