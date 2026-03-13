/**
 * Cross-runtime transport error classifier.
 *
 * Inspects structural properties first (err.code, err.cause.code, err.name),
 * falls back to message substring matching only when structure isn't enough.
 * Handles node-fetch FetchError, native fetch/undici TypeError + cause chain,
 * browser TypeError, Deno, and Bun error shapes.
 */

export type TransportErrorKind =
  | 'abort' // AbortController fired (our timeout or caller cancel)
  | 'dns' // ENOTFOUND, EAI_AGAIN -- never reached server
  | 'connect' // ECONNREFUSED, UND_ERR_CONNECT_TIMEOUT -- never reached server
  | 'socket' // ECONNRESET, socket hang up, UND_ERR_SOCKET -- may have reached server
  | 'tls' // cert/handshake failure -- never reached server
  | 'timeout' // ETIMEDOUT -- may have reached server
  | 'network'; // generic fetch failed / Failed to fetch -- may have reached server

/** Result of classifying a transport-level error. */
export interface ClassifiedTransportError {
  /** The category of transport failure. */
  readonly kind: TransportErrorKind;
  /** Whether the request may have been received by the server before the failure. */
  readonly mayHaveReachedServer: boolean;
  /** The original error that was classified. */
  readonly original: Error;
}

const MAY_HAVE_REACHED: Record<TransportErrorKind, boolean> = {
  abort: false,
  dns: false,
  connect: false,
  socket: true,
  tls: false,
  timeout: true,
  network: true,
};

function extractCode(err: unknown): string | undefined {
  if (typeof err !== 'object' || err === null) return undefined;
  const code = (err as Record<string, unknown>)['code'];
  return typeof code === 'string' ? code : undefined;
}

function extractCause(err: unknown): unknown {
  if (typeof err !== 'object' || err === null) return undefined;
  return (err as Record<string, unknown>)['cause'];
}

function extractCauseCode(err: unknown): string | undefined {
  return extractCode(extractCause(err));
}

function extractCauseMessage(err: unknown): string {
  const cause = extractCause(err);
  if (typeof cause === 'object' && cause !== null) {
    const msg = (cause as Record<string, unknown>)['message'];
    if (typeof msg === 'string') return msg.toLowerCase();
  }
  return '';
}

function classify(kind: TransportErrorKind, err: Error): ClassifiedTransportError {
  return { kind, mayHaveReachedServer: MAY_HAVE_REACHED[kind], original: err };
}

/**
 * Classify a thrown value as a transport-level error.
 *
 * Inspects structural properties first (err.code, err.cause.code, err.name),
 * then falls back to message substring matching. Handles node-fetch FetchError,
 * native fetch/undici TypeError + cause chain, browser TypeError, Deno, and Bun.
 *
 * @returns the classification, or `undefined` if the error is not transport-related.
 */
export function classifyTransportError(err: unknown): ClassifiedTransportError | undefined {
  if (!(err instanceof Error)) return undefined;

  const code = extractCode(err);
  const causeCode = extractCauseCode(err);
  const msg = err.message.toLowerCase();
  const causeMsg = extractCauseMessage(err);

  // 1. AbortError (our timeout or caller cancel)
  if (err.name === 'AbortError') {
    return classify('abort', err);
  }

  // 2. DNS resolution failure
  if (
    code === 'ENOTFOUND' ||
    code === 'EAI_AGAIN' ||
    causeCode === 'ENOTFOUND' ||
    causeCode === 'EAI_AGAIN' ||
    msg.includes('enotfound') ||
    msg.includes('eai_again')
  ) {
    return classify('dns', err);
  }

  // 3. Connection refused / connect timeout
  if (
    code === 'ECONNREFUSED' ||
    causeCode === 'ECONNREFUSED' ||
    causeCode === 'UND_ERR_CONNECT_TIMEOUT' ||
    msg.includes('econnrefused')
  ) {
    return classify('connect', err);
  }

  // 4. TLS errors (check before socket/timeout since TLS errors can also set ECONNRESET)
  // Also inspect cause.message for native fetch which wraps TLS errors in TypeError("fetch failed")
  if (
    msg.includes('certificate') ||
    msg.includes('self signed') ||
    msg.includes('ssl') ||
    msg.includes('handshake') ||
    causeMsg.includes('certificate') ||
    causeMsg.includes('self signed') ||
    causeMsg.includes('ssl') ||
    causeMsg.includes('handshake')
  ) {
    return classify('tls', err);
  }

  // 5. TCP/connect timeout and undici header/body timeouts
  if (
    code === 'ETIMEDOUT' ||
    causeCode === 'ETIMEDOUT' ||
    causeCode === 'UND_ERR_HEADERS_TIMEOUT' ||
    causeCode === 'UND_ERR_BODY_TIMEOUT' ||
    msg.includes('etimedout') ||
    msg.includes('timed out')
  ) {
    return classify('timeout', err);
  }

  // 6. Socket-level errors (connection was established or partially established)
  if (
    code === 'ECONNRESET' ||
    causeCode === 'ECONNRESET' ||
    causeCode === 'UND_ERR_SOCKET' ||
    msg.includes('econnreset') ||
    msg.includes('socket hang up') ||
    msg.includes('other side closed') ||
    msg.includes('closed unexpectedly') ||
    msg.includes('connection reset')
  ) {
    return classify('socket', err);
  }

  // 7. Generic fetch failure (browser TypeError, undici wrapper)
  // "terminated" is undici's wrapper for body-read failures (e.g. response.json() after socket drop)
  if (
    err instanceof TypeError &&
    (msg.includes('fetch failed') ||
      msg.includes('failed to fetch') ||
      msg.includes('network error') ||
      msg.includes('error sending request') ||
      msg === 'terminated')
  ) {
    return classify('network', err);
  }

  // 8. Remaining node-fetch FetchError.
  // Transport types: 'system' (OS-level), 'request-timeout', 'body-timeout'.
  // Non-transport types: 'invalid-json', 'no-redirect', 'max-size'.
  if (err.name === 'FetchError') {
    const fetchType = (err as unknown as Record<string, unknown>)['type'];
    if (fetchType === 'request-timeout' || fetchType === 'body-timeout') {
      return classify('timeout', err);
    }
    if (fetchType === 'system') {
      return classify('network', err);
    }
    // Not a transport error (e.g. JSON parse failure on a 200 response)
    return undefined;
  }

  // Not a transport error
  return undefined;
}
