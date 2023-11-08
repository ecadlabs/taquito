import { NetworkError } from '@taquito/core';
import { STATUS_CODE } from './status_code';
import stringify from 'json-stringify-safe';

/**
 *  @category Error
 *  @description Error that indicates a general failure in making the HTTP request
 */
export class HttpRequestFailed extends NetworkError {
  constructor(
    public readonly method: string,
    public readonly url: string,
    public readonly cause: Error,
    public readonly additionalInfo?: string
  ) {
    super();
    this.name = 'HttpRequestFailed';
    this.message = `${method} ${url} ${stringify(cause)}`;
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
