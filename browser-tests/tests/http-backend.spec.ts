import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { once } from 'node:events';
import { expect, test as base, type Page } from '@playwright/test';
import type {} from '../smoke-app/src/http-backend';

type Request = { method: string; url: string; headers: IncomingMessage['headers']; body: string };
type Endpoint = {
  url: string;
  requests: Request[];
  preflights: Request[];
  respond: (request: Request, response: ServerResponse) => void;
  allowCors: boolean;
};

const test = base.extend<{ endpoint: Endpoint }>({
  endpoint: async ({ baseURL }, use) => {
    if (!baseURL) throw new Error('The browser test baseURL must be configured');
    const endpoint: Endpoint = {
      url: '',
      requests: [],
      preflights: [],
      allowCors: true,
      respond: (request, response) => response.end(JSON.stringify(request)),
    };
    const serverErrors: unknown[] = [];
    const server = createServer(async (request, response) => {
      const chunks: Buffer[] = [];
      try {
        for await (const chunk of request) chunks.push(Buffer.from(chunk));
      } catch (error) {
        response.destroy();
        if (!request.aborted) serverErrors.push(error);
        return;
      }
      const received: Request = {
        method: request.method ?? '',
        url: request.url ?? '',
        headers: request.headers,
        body: Buffer.concat(chunks).toString(),
      };
      if (endpoint.allowCors) {
        response.setHeader('Access-Control-Allow-Origin', new URL(baseURL).origin);
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.setHeader('Access-Control-Allow-Headers', 'content-type, x-taquito-test');
      }
      if (request.method === 'OPTIONS') {
        endpoint.preflights.push(received);
        response.writeHead(204).end();
        return;
      }
      endpoint.requests.push(received);
      response.setHeader('Content-Type', 'application/json');
      endpoint.respond(received, response);
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Expected a loopback port');
    endpoint.url = `http://127.0.0.1:${address.port}`;
    try {
      await use(endpoint);
    } finally {
      const closed = new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      );
      server.closeAllConnections();
      await closed;
      expect(serverErrors).toEqual([]);
    }
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto('/http.html');
  await page.waitForFunction(() => !!window.httpTest);
});

test('imports built HTTP artifacts without Node globals and sends GET by default', async ({
  page,
  endpoint,
}) => {
  expect(
    await page.evaluate(() => ({
      before: window.httpTest.beforeImport,
      after: window.httpTest.afterImport,
    }))
  ).toEqual({
    before: {
      process: 'undefined',
      global: 'undefined',
      Buffer: 'undefined',
      require: 'undefined',
    },
    after: { process: 'undefined', global: 'undefined', Buffer: 'undefined', require: 'undefined' },
  });
  const result = await page.evaluate(
    (url) =>
      window.httpTest.request({
        url,
        query: { chain: 'main chain' },
        headers: { 'X-Taquito-Test': 'browser' },
      }),
    `${endpoint.url}/echo`
  );
  expect(result).toMatchObject({
    kind: 'success',
    value: {
      method: 'GET',
      url: '/echo?chain=main%20chain',
      headers: { 'content-type': 'application/json', 'x-taquito-test': 'browser' },
      body: '',
    },
  });
  expect(await page.evaluate(() => window.httpTest.fetchAttempts())).toBe(1);
  expect(endpoint.requests.length).toBeGreaterThan(0);
  expect(endpoint.preflights.length).toBeGreaterThan(0);
});
test('sends JSON POST data and preserves an explicit content type', async ({ page, endpoint }) => {
  const result = await page.evaluate(
    (url) =>
      window.httpTest.request(
        { url, method: 'POST', headers: { 'Content-Type': 'application/custom+json' } },
        { value: 'é' }
      ),
    `${endpoint.url}/echo`
  );
  expect(result).toMatchObject({
    kind: 'success',
    value: {
      method: 'POST',
      headers: { 'content-type': 'application/custom+json' },
      body: '{"value":"é"}',
    },
  });
});

test('returns text when JSON parsing is disabled', async ({ page, endpoint }) => {
  endpoint.respond = (_request, response) => response.end('plain response');
  expect(
    await page.evaluate((url) => window.httpTest.request({ url, json: false }), endpoint.url)
  ).toEqual({ kind: 'success', value: 'plain response' });
});

for (const status of [404, 500]) {
  test(`returns HttpResponseError for ${status} without retrying transport-like text`, async ({
    page,
    endpoint,
  }) => {
    endpoint.respond = (_request, response) =>
      response.writeHead(status).end('connection reset: fetch failed');
    expect(await page.evaluate((url) => window.httpTest.request({ url }), endpoint.url)).toEqual({
      kind: 'response',
      status,
      body: 'connection reset: fetch failed',
      url: endpoint.url,
    });
    expect(await page.evaluate(() => window.httpTest.fetchAttempts())).toBe(1);
    expect(endpoint.requests.length).toBeGreaterThan(0);
  });
}

test('reports the configured timeout after the server receives the request', async ({
  page,
  endpoint,
}) => {
  let received!: () => void;
  const receipt = new Promise<void>((resolve) => {
    received = resolve;
  });
  endpoint.respond = () => received();
  const pending = page.evaluate(
    (url) => window.httpTest.request({ url, timeout: 1500 }),
    endpoint.url
  );
  await receipt;
  expect(await pending).toEqual({ kind: 'timeout', timeout: 1500, url: endpoint.url });
  expect(await page.evaluate(() => window.httpTest.fetchAttempts())).toBe(1);
  expect(endpoint.requests.length).toBeGreaterThan(0);
});

for (const json of [true, false]) {
  test(`keeps the timeout active after response headers (json=${json})`, async ({
    page,
    endpoint,
  }) => {
    endpoint.respond = (_request, response) => {
      response.writeHead(200);
      response.flushHeaders();
      response.write('{"level":');
    };
    const pending = page.evaluate(
      ({ url, json }) => window.httpTest.request({ url, timeout: 1500, json }),
      { url: endpoint.url, json }
    );
    await expect.poll(() => page.evaluate(() => window.httpTest.responseHeaders())).toBe(1);
    expect(await pending).toEqual({ kind: 'timeout', timeout: 1500, url: endpoint.url });
    expect(await page.evaluate(() => window.httpTest.fetchAttempts())).toBe(1);
  });
}

// Keep failing through the browser's internal socket replay. Recover only after
// native fetch fails, so success requires an HttpBackend retry.
const recoverAfterFetchFailure = (page: Page, endpoint: Endpoint) => {
  endpoint.respond = (_request, response) => response.destroy();
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(`${endpoint.url}/`) && request.method() !== 'OPTIONS') {
      endpoint.respond = (_request, response) => response.end('{"recovered":true}');
    }
  });
};

test('retries GET after a transport failure', async ({ page, endpoint }) => {
  recoverAfterFetchFailure(page, endpoint);
  const result = await page.evaluate((url) => window.httpTest.request({ url }), endpoint.url);
  expect(result).toEqual({ kind: 'success', value: { recovered: true } });
  expect(await page.evaluate(() => window.httpTest.fetchAttempts())).toBe(2);
});
for (const path of [
  '/chains/main/blocks/head/helpers/forge/operations',
  '/chains/main/blocks/head/helpers/preapply/operations',
  '/chains/main/blocks/head/helpers/scripts/simulate_operation',
  '/chains/main/blocks/head/helpers/scripts/run_operation',
  '/injection/operation',
]) {
  test(`retries POST ${path} with unchanged bytes`, async ({ page, endpoint }) => {
    recoverAfterFetchFailure(page, endpoint);
    const result = await page.evaluate(
      (url) =>
        window.httpTest.request(
          { url, method: 'POST', query: { chain: 'main' } },
          'signed-operation'
        ),
      `${endpoint.url}${path}`
    );
    expect(result).toEqual({ kind: 'success', value: { recovered: true } });
    expect(await page.evaluate(() => window.httpTest.fetchAttempts())).toBe(2);
    expect(endpoint.requests.length).toBeGreaterThanOrEqual(2);
    expect(new Set(endpoint.requests.map(({ body }) => body))).toEqual(
      new Set(['"signed-operation"'])
    );
  });
}

test('does not retry an ordinary POST transport failure', async ({ page, endpoint }) => {
  endpoint.respond = (_request, response) => response.destroy();
  const url = `${endpoint.url}/unsafe`;
  const result = await page.evaluate(
    (url) => window.httpTest.request({ url, method: 'POST' }, { value: 1 }),
    url
  );
  expect(result, JSON.stringify(result)).toMatchObject({
    kind: 'transport',
    method: 'POST',
    url,
    causeIsError: true,
    transportKind: 'network',
  });
  expect(await page.evaluate(() => window.httpTest.fetchAttempts())).toBe(1);
  expect(endpoint.requests.length).toBeGreaterThan(0);
});

for (const method of ['GET', 'POST'] as const) {
  test(`reports HttpRequestFailed when ${method} retries are exhausted`, async ({
    page,
    endpoint,
  }) => {
    endpoint.respond = (_request, response) => response.destroy();
    const url = `${endpoint.url}/injection/operation`;
    expect(
      await page.evaluate(
        ({ url, method }) =>
          window.httpTest.request(
            { url, method },
            method === 'POST' ? 'signed-operation' : undefined
          ),
        { url, method }
      )
    ).toMatchObject({
      kind: 'transport',
      method,
      url,
      causeIsError: true,
      transportKind: 'network',
    });
    expect(await page.evaluate(() => window.httpTest.fetchAttempts())).toBe(2);
  });
}

test('reports a CORS rejection without exposing an HTTP response', async ({ page, endpoint }) => {
  endpoint.allowCors = false;
  const result = await page.evaluate(
    (url) => window.httpTest.request({ url, method: 'POST' }, { value: 1 }),
    endpoint.url
  );
  expect(result).toMatchObject({
    kind: 'transport',
    method: 'POST',
    url: endpoint.url,
    causeIsError: true,
  });
  expect(endpoint.preflights.length).toBeGreaterThan(0);
  expect(endpoint.requests).toEqual([]);
});
