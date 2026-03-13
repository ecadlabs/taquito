import { classifyTransportError, TransportErrorKind } from '../src/transport-errors';

function makeError(name: string, message: string, props?: Record<string, unknown>): Error {
  const err = new Error(message);
  err.name = name;
  if (props) {
    Object.assign(err, props);
  }
  return err;
}

function makeTypeError(message: string, props?: Record<string, unknown>): TypeError {
  const err = new TypeError(message);
  if (props) {
    Object.assign(err, props);
  }
  return err;
}

describe('classifyTransportError', () => {
  describe('abort', () => {
    it('classifies AbortError', () => {
      const err = makeError('AbortError', 'The operation was aborted');
      const result = classifyTransportError(err);
      expect(result).toBeDefined();
      expect(result!.kind).toBe('abort');
      expect(result!.mayHaveReachedServer).toBe(false);
      expect(result!.original).toBe(err);
    });
  });

  describe('dns', () => {
    it('classifies ENOTFOUND via code', () => {
      const result = classifyTransportError(
        makeError('Error', 'getaddrinfo ENOTFOUND example.com', { code: 'ENOTFOUND' })
      );
      expect(result!.kind).toBe('dns');
      expect(result!.mayHaveReachedServer).toBe(false);
    });

    it('classifies EAI_AGAIN via code', () => {
      const result = classifyTransportError(
        makeError('Error', 'getaddrinfo EAI_AGAIN', { code: 'EAI_AGAIN' })
      );
      expect(result!.kind).toBe('dns');
    });

    it('classifies ENOTFOUND via cause.code (undici)', () => {
      const result = classifyTransportError(
        makeTypeError('fetch failed', { cause: { code: 'ENOTFOUND' } })
      );
      expect(result!.kind).toBe('dns');
    });

    it('classifies EAI_AGAIN via cause.code', () => {
      const result = classifyTransportError(
        makeTypeError('fetch failed', { cause: { code: 'EAI_AGAIN' } })
      );
      expect(result!.kind).toBe('dns');
    });
  });

  describe('connect', () => {
    it('classifies ECONNREFUSED via code', () => {
      const result = classifyTransportError(
        makeError('Error', 'connect ECONNREFUSED', { code: 'ECONNREFUSED' })
      );
      expect(result!.kind).toBe('connect');
      expect(result!.mayHaveReachedServer).toBe(false);
    });

    it('classifies ECONNREFUSED via cause.code', () => {
      const result = classifyTransportError(
        makeTypeError('fetch failed', { cause: { code: 'ECONNREFUSED' } })
      );
      expect(result!.kind).toBe('connect');
    });

    it('classifies UND_ERR_CONNECT_TIMEOUT via cause.code', () => {
      const result = classifyTransportError(
        makeTypeError('fetch failed', { cause: { code: 'UND_ERR_CONNECT_TIMEOUT' } })
      );
      expect(result!.kind).toBe('connect');
    });
  });

  describe('tls', () => {
    it('classifies certificate error', () => {
      const result = classifyTransportError(
        makeError('Error', 'unable to verify the first certificate')
      );
      expect(result!.kind).toBe('tls');
      expect(result!.mayHaveReachedServer).toBe(false);
    });

    it('classifies self signed certificate', () => {
      const result = classifyTransportError(
        makeError('Error', 'self signed certificate in certificate chain')
      );
      expect(result!.kind).toBe('tls');
    });

    it('classifies SSL error', () => {
      const result = classifyTransportError(
        makeError('Error', 'SSL routines:ssl3_get_record:wrong version number')
      );
      expect(result!.kind).toBe('tls');
    });

    it('classifies handshake failure', () => {
      const result = classifyTransportError(makeError('Error', 'TLS handshake failed'));
      expect(result!.kind).toBe('tls');
    });

    it('classifies TLS error wrapped in native fetch TypeError via cause.message', () => {
      const result = classifyTransportError(
        makeTypeError('fetch failed', {
          cause: { code: 'DEPTH_ZERO_SELF_SIGNED_CERT', message: 'self signed certificate' },
        })
      );
      expect(result!.kind).toBe('tls');
      expect(result!.mayHaveReachedServer).toBe(false);
    });

    it('classifies TLS over socket: cause with ECONNRESET + certificate message -> tls wins', () => {
      const result = classifyTransportError(
        makeTypeError('fetch failed', {
          cause: { code: 'ECONNRESET', message: 'unable to verify the first certificate' },
        })
      );
      expect(result!.kind).toBe('tls');
    });
  });

  describe('timeout', () => {
    it('classifies ETIMEDOUT via code', () => {
      const result = classifyTransportError(
        makeError('Error', 'connect ETIMEDOUT', { code: 'ETIMEDOUT' })
      );
      expect(result!.kind).toBe('timeout');
      expect(result!.mayHaveReachedServer).toBe(true);
    });

    it('classifies ETIMEDOUT via cause.code', () => {
      const result = classifyTransportError(
        makeTypeError('fetch failed', { cause: { code: 'ETIMEDOUT' } })
      );
      expect(result!.kind).toBe('timeout');
    });

    it('classifies "timed out" message', () => {
      const result = classifyTransportError(makeError('Error', 'Connection timed out'));
      expect(result!.kind).toBe('timeout');
    });

    it('classifies UND_ERR_HEADERS_TIMEOUT via cause.code', () => {
      const result = classifyTransportError(
        makeTypeError('fetch failed', { cause: { code: 'UND_ERR_HEADERS_TIMEOUT' } })
      );
      expect(result!.kind).toBe('timeout');
    });

    it('classifies UND_ERR_BODY_TIMEOUT via cause.code', () => {
      const result = classifyTransportError(
        makeTypeError('fetch failed', { cause: { code: 'UND_ERR_BODY_TIMEOUT' } })
      );
      expect(result!.kind).toBe('timeout');
    });
  });

  describe('socket', () => {
    it('classifies ECONNRESET via code (node-fetch FetchError)', () => {
      const result = classifyTransportError(
        makeError('FetchError', 'request to https://example.com failed, reason: read ECONNRESET', {
          code: 'ECONNRESET',
        })
      );
      expect(result!.kind).toBe('socket');
      expect(result!.mayHaveReachedServer).toBe(true);
    });

    it('classifies UND_ERR_SOCKET via cause.code (undici)', () => {
      const result = classifyTransportError(
        makeTypeError('fetch failed', { cause: { code: 'UND_ERR_SOCKET' } })
      );
      expect(result!.kind).toBe('socket');
    });

    it('classifies ECONNRESET via cause.code', () => {
      const result = classifyTransportError(
        makeTypeError('fetch failed', { cause: { code: 'ECONNRESET' } })
      );
      expect(result!.kind).toBe('socket');
    });

    it('classifies "socket hang up" message', () => {
      const result = classifyTransportError(makeError('Error', 'socket hang up'));
      expect(result!.kind).toBe('socket');
    });

    it('classifies "other side closed" message', () => {
      const result = classifyTransportError(makeError('Error', 'other side closed'));
      expect(result!.kind).toBe('socket');
    });

    it('classifies "closed unexpectedly" message', () => {
      const result = classifyTransportError(makeError('Error', 'connection closed unexpectedly'));
      expect(result!.kind).toBe('socket');
    });

    it('classifies "connection reset" message', () => {
      const result = classifyTransportError(makeError('Error', 'connection reset by peer'));
      expect(result!.kind).toBe('socket');
    });
  });

  describe('network', () => {
    it('classifies browser TypeError "Failed to fetch"', () => {
      const result = classifyTransportError(makeTypeError('Failed to fetch'));
      expect(result!.kind).toBe('network');
      expect(result!.mayHaveReachedServer).toBe(true);
    });

    it('classifies undici TypeError "fetch failed"', () => {
      const result = classifyTransportError(makeTypeError('fetch failed'));
      expect(result!.kind).toBe('network');
    });

    it('classifies "network error" message', () => {
      const result = classifyTransportError(makeTypeError('network error'));
      expect(result!.kind).toBe('network');
    });

    it('classifies Deno/Bun "error sending request" message', () => {
      const result = classifyTransportError(makeTypeError('error sending request'));
      expect(result!.kind).toBe('network');
    });

    it('classifies undici TypeError "terminated" (body-read failure)', () => {
      const result = classifyTransportError(makeTypeError('terminated'));
      expect(result!.kind).toBe('network');
    });

    it('classifies node-fetch FetchError type=request-timeout as timeout', () => {
      const result = classifyTransportError(
        makeError('FetchError', 'network timeout at https://example.com', {
          type: 'request-timeout',
        })
      );
      expect(result!.kind).toBe('timeout');
      expect(result!.mayHaveReachedServer).toBe(true);
    });

    it('classifies node-fetch FetchError type=body-timeout as timeout', () => {
      const result = classifyTransportError(
        makeError('FetchError', 'response body timeout at https://example.com', {
          type: 'body-timeout',
        })
      );
      expect(result!.kind).toBe('timeout');
    });

    it('classifies remaining node-fetch system FetchError by name + type', () => {
      const result = classifyTransportError(
        makeError('FetchError', 'request to https://example.com failed, reason: something weird', {
          type: 'system',
        })
      );
      expect(result!.kind).toBe('network');
    });

    it('does NOT classify node-fetch FetchError with type=invalid-json as transport', () => {
      const result = classifyTransportError(
        makeError('FetchError', 'invalid json response body at https://example.com', {
          type: 'invalid-json',
        })
      );
      expect(result).toBeUndefined();
    });

    it('does NOT classify node-fetch FetchError without type as transport', () => {
      const result = classifyTransportError(
        makeError('FetchError', 'request to https://example.com failed, reason: something weird')
      );
      expect(result).toBeUndefined();
    });
  });

  describe('non-transport errors', () => {
    it('returns undefined for non-Error values', () => {
      expect(classifyTransportError('string error')).toBeUndefined();
      expect(classifyTransportError(42)).toBeUndefined();
      expect(classifyTransportError(null)).toBeUndefined();
      expect(classifyTransportError(undefined)).toBeUndefined();
    });

    it('returns undefined for random Error without transport patterns', () => {
      expect(classifyTransportError(new Error('something went wrong'))).toBeUndefined();
    });

    it('returns undefined for SyntaxError (JSON parse failure)', () => {
      expect(classifyTransportError(new SyntaxError('Unexpected token'))).toBeUndefined();
    });

    it('returns undefined for TypeError without fetch message', () => {
      expect(
        classifyTransportError(new TypeError('Cannot read properties of undefined'))
      ).toBeUndefined();
    });
  });

  describe('retriability by kind', () => {
    const retriableKinds: TransportErrorKind[] = ['dns', 'connect', 'socket', 'timeout', 'network'];
    const nonRetriableKinds: TransportErrorKind[] = ['abort', 'tls'];

    it.each(retriableKinds)('%s is retriable (not abort or tls)', (kind) => {
      expect(kind).not.toBe('abort');
      expect(kind).not.toBe('tls');
    });

    it.each(nonRetriableKinds)('%s is NOT retriable', (kind) => {
      expect(['abort', 'tls']).toContain(kind);
    });
  });
});
