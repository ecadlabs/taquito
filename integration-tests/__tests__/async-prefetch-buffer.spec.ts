import { AsyncPrefetchBuffer } from '../async-prefetch-buffer';

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
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

  it('discards prefetched entries that already failed before the next take', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const third = deferred<string>();
    const fourth = deferred<string>();
    const fifth = deferred<string>();
    const sixth = deferred<string>();
    const queue = [first, second, third, fourth, fifth, sixth];
    let producerCalls = 0;

    const buffer = new AsyncPrefetchBuffer(() => {
      producerCalls++;
      const next = queue.shift();
      if (!next) {
        throw new Error('producer exhausted');
      }
      return next.promise;
    }, 2);

    const firstTake = buffer.take();
    expect(producerCalls).toBe(3);

    first.reject(new Error('burst failure 1'));
    second.reject(new Error('burst failure 2'));
    third.reject(new Error('burst failure 3'));
    await expect(firstTake).rejects.toThrow('burst failure 1');
    await Promise.resolve();

    fourth.resolve('recovered');
    fifth.resolve('next');
    sixth.resolve('after-next');
    const secondTake = await buffer.take();
    expect(secondTake.value).toBe('recovered');
    expect(producerCalls).toBe(6);
  });
});
