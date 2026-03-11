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
    /** The HTTP method that was attempted. */
    public readonly method: string,
    /** The URL that was requested. */
    public readonly url: string,
    /** The underlying error that caused the request to fail. */
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
    /** The HTTP status code (e.g. 404, 500). */
    public readonly status: STATUS_CODE,
    /** The HTTP status text (e.g. "Not Found"). */
    public readonly statusText: string,
    /** The raw response body text. */
    public readonly body: string,
    /** The URL that was requested. */
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
    /** The timeout duration in milliseconds that was exceeded. */
    public readonly timeout: number,
    /** The URL that was requested. */
    public readonly url: string
  ) {
    super();
    this.name = 'HttpTimeoutError';
    this.message = `HTTP request timeout of ${timeout}ms exceeded`;
  }
}
