import { NetworkError } from '@taquito/core';
import { STATUS_CODE } from './status_code';
import { ClassifiedTransportError } from './transport-errors';

const MAX_CAUSE_DEPTH = 10;

/** Walk the `.cause` chain and return the deepest Error (or object-shaped cause). */
function deepestCause(err: Error): { message: string; code?: string } {
  let current: { message: string; code?: string } = err;
  let depth = 0;
  for (;;) {
    if (depth >= MAX_CAUSE_DEPTH) break;
    const next: unknown = (current as unknown as Record<string, unknown>)['cause'];
    if (next instanceof Error) {
      current = next;
      depth++;
      continue;
    }
    // Handle object-shaped causes (e.g. undici sometimes throws { message, code } objects)
    if (
      typeof next === 'object' &&
      next !== null &&
      typeof (next as Record<string, unknown>)['message'] === 'string'
    ) {
      const obj = next as Record<string, unknown>;
      current = {
        message: obj['message'] as string,
        code: typeof obj['code'] === 'string' ? obj['code'] : undefined,
      };
      break;
    }
    break;
  }
  return current;
}

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
    const rootCause = deepestCause(cause);
    const rootCode = rootCause.code;
    const detail =
      rootCause !== (cause as { message: string; code?: string })
        ? `${rootCause.message}${rootCode ? ` [${rootCode}]` : ''}`
        : cause.message;
    const kindLabel = transportError ? ` (${transportError.kind})` : '';
    this.message = `${method} ${url}${kindLabel}: ${detail}`;
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
