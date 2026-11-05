import { NetworkError } from '@taquito/core';
import { STATUS_CODE } from './status_code';
import { ClassifiedTransportError } from './transport-errors';

const MAX_CAUSE_DEPTH = 10;

interface CauseEntry {
  name?: string;
  message: string;
  code?: string;
}

const getRecordCode = (value: Record<string, unknown>): string | undefined =>
  typeof value['code'] === 'string' ? value['code'] : undefined;

/** Walk the `.cause` chain (including undici `{ message, code }` objects) up to `MAX_CAUSE_DEPTH`. */
function walkCauseChain(err: Error): CauseEntry[] {
  const chain: CauseEntry[] = [{ name: err.name, message: err.message }];
  let current: unknown = (err as unknown as Record<string, unknown>)['cause'];
  let depth = 0;
  while (depth < MAX_CAUSE_DEPTH) {
    if (current instanceof Error) {
      chain.push({
        name: current.name,
        message: current.message,
        code: getRecordCode(current as unknown as Record<string, unknown>),
      });
      current = (current as unknown as Record<string, unknown>)['cause'];
      depth++;
      continue;
    }
    // Handle object-shaped causes (e.g. undici sometimes throws { message, code } objects)
    if (
      typeof current === 'object' &&
      current !== null &&
      typeof (current as Record<string, unknown>)['message'] === 'string'
    ) {
      const obj = current as Record<string, unknown>;
      chain.push({
        message: obj['message'] as string,
        code: getRecordCode(obj),
      });
    }
    break;
  }
  return chain;
}

/** Format an error and its `.cause` chain as a single human-readable diagnostic string. */
export function formatErrorCauseChain(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }
  return walkCauseChain(error)
    .map((entry, index) => {
      const prefix = entry.name ? `${entry.name}: ` : '';
      const codeSuffix = index > 0 && entry.code ? ` [${entry.code}]` : '';
      return `${prefix}${entry.message}${codeSuffix}`;
    })
    .join(' → ');
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
    const chain = walkCauseChain(cause);
    const rootCause = chain[chain.length - 1];
    const detail =
      chain.length > 1
        ? `${rootCause.message}${rootCause.code ? ` [${rootCause.code}]` : ''}`
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
