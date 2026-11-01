import type { HttpRequestOptions } from '@taquito/http-utils';

declare const __RAW_PACKAGE_URLS__: Record<string, string>;

const nodeGlobals = () =>
  Object.fromEntries(
    ['process', 'global', 'Buffer', 'require'].map((name) => [
      name,
      typeof Reflect.get(globalThis, name),
    ])
  );
const beforeImport = nodeGlobals();
const http = (await import(
  /* @vite-ignore */ __RAW_PACKAGE_URLS__['@taquito/http-utils']
)) as typeof import('@taquito/http-utils');

// Native engines can replay a socket request within one fetch call. Observe calls
// without changing requests, responses, or rejections.
const nativeFetch = globalThis.fetch.bind(globalThis);
let fetchAttempts = 0;
let responseHeaders = 0;
globalThis.fetch = async (...args) => {
  fetchAttempts++;
  const response = await nativeFetch(...args);
  responseHeaders++;
  return response;
};

const request = async (options: HttpRequestOptions, data?: object | string) => {
  try {
    return {
      kind: 'success' as const,
      value: await new http.HttpBackend().createRequest(options, data),
    };
  } catch (error) {
    if (error instanceof http.HttpResponseError) {
      return { kind: 'response' as const, status: error.status, body: error.body, url: error.url };
    }
    if (error instanceof http.HttpTimeoutError) {
      return { kind: 'timeout' as const, timeout: error.timeout, url: error.url };
    }
    if (error instanceof http.HttpRequestFailed) {
      return {
        kind: 'transport' as const,
        method: error.method,
        url: error.url,
        causeIsError: error.cause instanceof Error,
        causeName: error.cause.name,
        causeMessage: error.cause.message,
        transportKind: error.transportError?.kind,
      };
    }
    throw error;
  }
};

declare global {
  interface Window {
    httpTest: {
      request: typeof request;
      fetchAttempts: () => number;
      responseHeaders: () => number;
      beforeImport: Record<string, string>;
      afterImport: Record<string, string>;
    };
  }
}
window.httpTest = {
  request,
  fetchAttempts: () => fetchAttempts,
  responseHeaders: () => responseHeaders,
  beforeImport,
  afterImport: nodeGlobals(),
};
