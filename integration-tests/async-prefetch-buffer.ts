class BufferedEntry<T> {
  readyAt?: number;
  readonly promise: Promise<T>;

  constructor(producer: () => Promise<T>) {
    this.promise = producer().then((value) => {
      this.readyAt = Date.now();
      return value;
    });
  }
}

export interface BufferedTakeResult<T> {
  value: T;
  waitMs: number;
  wasPrefetched: boolean;
  readyLeadMs: number;
}

/**
 * Keeps a small background buffer of one-shot async values.
 *
 * This is intentionally tiny and dumb:
 * - values are still consumed exactly once
 * - the producer is still authoritative
 * - we only overlap producer latency with useful test execution
 *
 * That is enough to hide slow runner -> keygen round-trips without lying to
 * integration tests about account freshness.
 */
export class AsyncPrefetchBuffer<T> {
  private readonly entries: BufferedEntry<T>[] = [];

  constructor(
    private readonly producer: () => Promise<T>,
    private readonly targetSize: number
  ) {}

  async take(): Promise<BufferedTakeResult<T>> {
    const takeStartedAt = Date.now();
    const entry = this.getNextEntry();
    const wasPrefetched = typeof entry.readyAt === 'number';
    const value = await entry.promise;
    const waitMs = Date.now() - takeStartedAt;
    const readyAt = entry.readyAt;

    return {
      value,
      waitMs,
      wasPrefetched,
      readyLeadMs: wasPrefetched && typeof readyAt === 'number' ? takeStartedAt - readyAt : 0,
    };
  }

  private getNextEntry(): BufferedEntry<T> {
    if (this.targetSize <= 0) {
      return this.createEntry();
    }

    this.fill();
    const entry = this.entries.shift() ?? this.createEntry();
    this.fill();
    return entry;
  }

  private fill() {
    while (this.entries.length < this.targetSize) {
      this.entries.push(this.createEntry());
    }
  }

  private createEntry(): BufferedEntry<T> {
    return new BufferedEntry(this.producer);
  }
}
