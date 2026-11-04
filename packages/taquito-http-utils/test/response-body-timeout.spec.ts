import { vi } from 'vitest';
import { HttpBackend, HttpTimeoutError } from '../src/taquito-http-utils';

describe('HTTP response body deadline', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it.each([false, true])(
    'aborts a stalled successful body with json=%s instead of clearing the deadline at headers',
    async (json) => {
      vi.useFakeTimers();
      const signals: AbortSignal[] = [];
      const controllers: ReadableStreamDefaultController<Uint8Array>[] = [];
      vi.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
        const signal = init?.signal;
        if (!signal) throw new Error('Request must have an abort signal');
        signals.push(signal);
        const body = new ReadableStream<Uint8Array>({
          start(controller) {
            controllers.push(controller);
            signal.addEventListener(
              'abort',
              () => controller.error(new DOMException('Timed out reading body', 'AbortError')),
              { once: true }
            );
          },
        });
        return Promise.resolve(new Response(body));
      });

      const result = new HttpBackend(20).createRequest<unknown>({
        url: 'https://gateway.example.com/ipfs/example',
        method: 'GET',
        json,
      });
      // Attach rejection handling before advancing timers, including any retries.
      let settled = false;
      const outcome = result.then(
        (value) => {
          settled = true;
          return value;
        },
        (error: unknown) => {
          settled = true;
          return error;
        }
      );
      try {
        await vi.runAllTimersAsync();
        expect(settled).toBe(true);
        expect(signals.length).toBeGreaterThan(0);
        expect(signals.every((signal) => signal.aborted)).toBe(true);
        expect(await outcome).toBeInstanceOf(HttpTimeoutError);
      } finally {
        // Release the pending read on the broken baseline as well.
        for (let i = 0; i < controllers.length; i++) {
          if (!signals[i].aborted) controllers[i].close();
        }
        await outcome;
      }
    }
  );
});
