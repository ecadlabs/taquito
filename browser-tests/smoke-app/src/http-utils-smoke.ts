import { setSmokeResult, toErrorResult } from './smoke-shared';

declare const __RAW_HTTP_UTILS_URL__: string;

setSmokeResult({ status: 'loading' });

void (async () => {
  try {
    const { HttpBackend, HttpRequestFailed, HttpResponseError } = await import(
      /* @vite-ignore */ __RAW_HTTP_UTILS_URL__
    );
    const backend = new HttpBackend(1234);

    setSmokeResult({
      status: 'ok',
      exports: ['HttpBackend', 'HttpRequestFailed', 'HttpResponseError'],
      summary: {
        backendTimeout: backend.timeout,
        requestFailedName: HttpRequestFailed.name,
        responseErrorName: HttpResponseError.name,
      },
    });
  } catch (error) {
    setSmokeResult(toErrorResult(error));
  }
})();
