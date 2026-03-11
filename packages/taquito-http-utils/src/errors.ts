import { NetworkError } from '@taquito/core';
import { STATUS_CODE } from './status_code';
import { ClassifiedTransportError } from './transport-errors';

/**
 *  @category Error
 *  Error that indicates a general failure in making the HTTP request
 */
export class HttpRequestFailed extends NetworkError {
  /** Structured classification of the transport failure, if one was identified. */
  public readonly transportError?: ClassifiedTransportError;

  constructor(
    public readonly method: string,
    public readonly url: string,
    public readonly cause: Error,
    transportError?: ClassifiedTransportError
  ) {
    super();
    this.name = 'HttpRequestFailed';
    this.message = `${method} ${url} ${String(cause)}`;
    this.transportError = transportError;
  }
}

/**
 *  @category Error
 *  Error thrown when the endpoint returns an HTTP error to the client
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
    this.name = 'HttpResponseError';
  }
}

/**
 *  @category Error
 *  Error thrown when an HTTP request exceeds its configured timeout duration.
 */
export class HttpTimeoutError extends NetworkError {
  constructor(
    public readonly timeout: number,
    public readonly url: string
  ) {
    super();
    this.name = 'HttpTimeoutError';
    this.message = `HTTP request timeout of ${timeout}ms exceeded`;
  }
}
