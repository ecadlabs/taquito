import { AsyncPrefetchBuffer } from '../async-prefetch-buffer';

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });

  return { promise, resolve };
};

describe('AsyncPrefetchBuffer', () => {
  it('refills in the background after a value is consumed', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const third = deferred<string>();
    const fourth = deferred<string>();
    const queue = [first, second, third, fourth];
    let producerCalls = 0;

    const buffer = new AsyncPrefetchBuffer(() => {
      producerCalls++;
      const next = queue.shift();
      if (!next) {
        throw new Error('producer exhausted');
      }
      return next.promise;
    }, 2);

    const takePromise = buffer.take();
    expect(producerCalls).toBe(3);

    first.resolve('first');
    const taken = await takePromise;
    expect(taken.value).toBe('first');

    // The consumed slot should be refilled immediately so later callers can use
    // a prefetched value instead of paying the full producer latency again.
    expect(producerCalls).toBe(3);

    second.resolve('second');
    await Promise.resolve();
    const secondTake = await buffer.take();
    expect(secondTake.value).toBe('second');
    expect(secondTake.wasPrefetched).toBe(true);

    third.resolve('third');
    fourth.resolve('fourth');
  });

  it('can be disabled and behave like a direct producer call', async () => {
    const first = deferred<string>();
    let producerCalls = 0;

    const buffer = new AsyncPrefetchBuffer(() => {
      producerCalls++;
      return first.promise;
    }, 0);

    const takePromise = buffer.take();
    expect(producerCalls).toBe(1);

    first.resolve('direct');
    const taken = await takePromise;
    expect(taken.value).toBe('direct');
    expect(taken.wasPrefetched).toBe(false);
  });
});
