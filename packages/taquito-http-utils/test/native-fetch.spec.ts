import { createServer, type RequestListener } from 'node:http';
import { HttpBackend, HttpTimeoutError } from '../src/taquito-http-utils';

async function withServer(handler: RequestListener, run: (url: string) => Promise<void>) {
  const server = createServer(handler);
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing server address');
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
}

async function withResponseHeaders(run: (received: Promise<void>) => Promise<void>) {
  const nativeFetch = globalThis.fetch;
  let received!: () => void;
  const headersReceived = new Promise<void>((resolve) => {
    received = resolve;
  });
  // Observe the real fetch response without replacing it. The next event-loop turn
  // lets HttpBackend begin reading the body before the test closes the server stream.
  globalThis.fetch = async (...args: Parameters<typeof fetch>) => {
    const response = await nativeFetch(...args);
    setImmediate(received);
    return response;
  };
  try {
    await run(headersReceived);
  } finally {
    globalThis.fetch = nativeFetch;
  }
}

describe('HttpBackend with native fetch', () => {
  it('reads JSON from a real HTTP response', async () => {
    await withServer(
      (_request, response) => {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end('{"level":42}');
      },
      async (url) => {
        expect(await new HttpBackend().createRequest<{ level: number }>({ url })).toEqual({
          level: 42,
        });
      }
    );
  });

  it('reports a timeout when the server does not send headers', async () => {
    await withServer(
      () => {},
      async (url) => {
        await expect(
          new HttpBackend(100).createRequest({ url, method: 'POST' })
        ).rejects.toBeInstanceOf(HttpTimeoutError);
      }
    );
  });

  it.each([true, false])(
    'keeps the timeout active while reading a body (json=%s)',
    async (json) => {
      await withServer(
        (_request, response) => {
          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.flushHeaders();
          response.write('{"level":');
        },
        async (url) => {
          await withResponseHeaders(async (headersReceived) => {
            const request = new HttpBackend(1000).createRequest({ url, method: 'POST', json });
            const outcome = request.then(
              () => undefined,
              (error: unknown) => error
            );
            let deadline!: ReturnType<typeof setTimeout>;
            const expired = new Promise<string>((resolve) => {
              deadline = setTimeout(() => resolve('body read did not time out'), 3000);
            });
            try {
              const first = await Promise.race([
                headersReceived.then(() => 'headers'),
                outcome.then(() => 'request settled before headers'),
                expired,
              ]);
              expect(first).toBe('headers');
              expect(await Promise.race([outcome, expired])).toBeInstanceOf(HttpTimeoutError);
            } finally {
              clearTimeout(deadline);
            }
          });
        }
      );
    }
  );

  it('preserves JSON parse errors without retrying the request', async () => {
    let requests = 0;
    await withServer(
      (_request, response) => {
        requests++;
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end('{');
      },
      async (url) => {
        await expect(new HttpBackend().createRequest({ url })).rejects.toBeInstanceOf(SyntaxError);
        expect(requests).toBe(1);
      }
    );
  });

  it('preserves the native error when a successful response body ends prematurely', async () => {
    let terminate!: () => void;
    await withServer(
      (_request, response) => {
        response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': '100' });
        response.flushHeaders();
        response.write('{"level":');
        terminate = () => response.destroy();
      },
      async (url) => {
        await withResponseHeaders(async (headersReceived) => {
          const request = new HttpBackend().createRequest({ url, method: 'POST' });
          const outcome = request.then(
            () => undefined,
            (error: unknown) => error
          );
          await headersReceived;
          terminate();
          const error = await outcome;
          expect(error).toBeInstanceOf(TypeError);
          expect(error).toMatchObject({ cause: { code: 'UND_ERR_SOCKET' } });
        });
      }
    );
  });
});
