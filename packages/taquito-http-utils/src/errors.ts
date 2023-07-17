import { NetworkError } from '@taquito/core';
import { STATUS_CODE } from './status_code';

/**
 *  @category Error
 *  @description Error indicates a general failure in making the HTTP request
 */
export class HttpRequestFailed extends NetworkError {
  constructor(
    public readonly method: string,
    public readonly url: string,
    public readonly cause: Error
  ) {
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
  constructor(
    public readonly message: string,
    public readonly status: STATUS_CODE,
    public readonly statusText: string,
    public readonly body: string,
    public readonly url: string
  ) {
    super();
    this.name = 'HttpResponse';
  }
}
