import { BlockResponse, RpcClient } from '@taquito/rpc';
import { b58Encode, PrefixV2 } from '@taquito/utils';
import { Context } from '../../src/context';
import { ConfirmationTimeoutError } from '../../src/errors';
import { Operation } from '../../src/operations/operations';
import { OperationReorgError } from '../../src/operations/errors';
import { PollingSubscribeProvider } from '../../src/subscribe/polling-subcribe-provider';
import { blockResponse } from '../read-provider/data';

const operationHash = 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
const branchHash = blockResponse.hash;
const confirmationTimeoutSeconds = 30;

function blockHash(level: number, replacement = false): string {
  if (level === 100) return branchHash;
  const bytes = new Uint8Array(32);
  bytes[0] = replacement ? 1 : 0;
  bytes[31] = level;
  return b58Encode(bytes, PrefixV2.BlockHash);
}

function makeBlock(level: number, includesOperation = false, replacement = false): BlockResponse {
  return {
    ...blockResponse,
    hash: blockHash(level, replacement),
    header: {
      ...blockResponse.header,
      level,
      predecessor: blockHash(level - 1, replacement),
    },
    metadata: {
      ...blockResponse.metadata,
      test_chain_status: { status: 'not_running' },
    },
    operations: [
      [],
      [],
      [],
      includesOperation
        ? [
            {
              protocol: blockResponse.protocol,
              chain_id: blockResponse.chain_id,
              hash: operationHash,
              branch: branchHash,
              contents: [],
            },
          ]
        : [],
    ],
  };
}

describe('Operation.confirmation', () => {
  let context: Context;
  let head: BlockResponse;
  let blocks: BlockResponse[];
  let rpc: RpcClient;

  beforeEach(() => {
    vi.useFakeTimers();
    blocks = Array.from({ length: 6 }, (_, offset) => makeBlock(100 + offset, offset === 1));
    head = blocks[0];

    rpc = new RpcClient('http://localhost:0');
    const getBlock = (identifier = 'head'): BlockResponse => {
      const [id, offset] = identifier.split('~');
      let block =
        id === 'head'
          ? head
          : blocks.find(
              (candidate) => candidate.hash === id || String(candidate.header.level) === id
            );
      for (let n = 0; block && n < Number(offset); n++) {
        const predecessor = block.header.predecessor;
        block = blocks.find((candidate) => candidate.hash === predecessor);
      }
      if (!block || block.header.level > head.header.level) {
        throw new Error(`Unexpected block requested: ${identifier}`);
      }
      return block;
    };
    vi.spyOn(rpc, 'getBlock').mockImplementation(async ({ block } = {}) => getBlock(block));
    vi.spyOn(rpc, 'getBlockHeader').mockImplementation(async ({ block } = {}) => ({
      ...getBlock(block).header,
      hash: getBlock(block).hash,
      protocol: getBlock(block).protocol,
      chain_id: getBlock(block).chain_id,
    }));

    vi.spyOn(rpc, 'getBlockHash').mockImplementation(
      async ({ block } = {}) => getBlock(block).hash
    );
    context = new Context(rpc);
    context.config = {
      ...context.config,
      confirmationPollingTimeoutSecond: confirmationTimeoutSeconds,
    };
    context.stream = new PollingSubscribeProvider(context, { pollingIntervalMilliseconds: 100 });
  });

  afterEach(async () => {
    // Let confirmation's own timeout dispose subscriptions, including after a failed assertion.
    await vi.advanceTimersByTimeAsync(confirmationTimeoutSeconds * 1000);
    vi.clearAllTimers();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function createOperation() {
    return new Operation(
      operationHash,
      { opbytes: '', opOb: { branch: branchHash, contents: [] }, counter: 0 },
      [],
      context
    );
  }

  it.each([
    { confirmations: 1, headLevel: 102, expectedLevel: 101 },
    { confirmations: 3, headLevel: 105, expectedLevel: 103 },
  ])(
    'finds inclusion before the first observed head (confirmation count $confirmations, head $headLevel)',
    async ({ confirmations, headLevel, expectedLevel }) => {
      const operation = createOperation();

      // The operation lands at 101 while the caller delays starting confirmation.
      await vi.advanceTimersByTimeAsync(8000);
      head = blocks[headLevel - 100];
      expect(blocks[1].operations[3][0].hash).toBe(operationHash);
      expect(head.operations).toEqual([[], [], [], []]);

      const confirmation = expect(operation.confirmation(confirmations)).resolves.toBe(
        expectedLevel
      );
      // Attach the rejection handler before advancing fake time to avoid an unhandled rejection.
      const settled = Promise.allSettled([confirmation]);
      await vi.advanceTimersByTimeAsync(confirmationTimeoutSeconds * 1000);
      await settled;
      await confirmation;
      expect(operation.includedInBlock).toBe(101);
      const historicalReads = vi
        .mocked(rpc.getBlock)
        .mock.calls.map(([options]) => options?.block)
        .filter((block) => block !== undefined && block !== 'head');
      expect(historicalReads.length).toBeGreaterThan(0);
      expect(new Set(historicalReads).size).toBe(historicalReads.length);
      for (const identifier of historicalReads) {
        const block = await rpc.getBlock({ block: identifier });
        expect(block?.header.level).toBeGreaterThan(100);
        expect(block?.header.level).toBeLessThanOrEqual(headLevel);
      }
    }
  );

  it('waits for the remaining confirmations after finding historical inclusion', async () => {
    const operation = createOperation();
    head = blocks[2];
    const resolved = vi.fn();
    const rejected = vi.fn();
    const confirmation = operation.confirmation(3).then(resolved, rejected);

    await vi.advanceTimersByTimeAsync(200);
    expect(resolved).not.toHaveBeenCalled();
    expect(rejected).not.toHaveBeenCalled();
    expect(operation.includedInBlock).toBe(101);

    head = blocks[3];
    await vi.advanceTimersByTimeAsync(100);
    expect(resolved).toHaveBeenCalledWith(103);
    expect(rejected).not.toHaveBeenCalled();
    await confirmation;
  });

  it('finds inclusion that predates construction of the operation object', async () => {
    head = blocks[2];
    const operation = createOperation();
    const resolved = vi.fn();
    const rejected = vi.fn();
    void operation.confirmation(1).then(resolved, rejected);

    await vi.advanceTimersByTimeAsync(100);

    expect(resolved).toHaveBeenCalledWith(101);
    expect(rejected).not.toHaveBeenCalled();
    expect(operation.includedInBlock).toBe(101);
  });

  it('finishes a slow historical read while new heads continue arriving', async () => {
    const getBlock = context.readProvider.getBlock.bind(context.readProvider);
    vi.spyOn(context.readProvider, 'getBlock').mockImplementation(async (block) => {
      if (block === `${blocks[2].hash}~1`) {
        await new Promise<void>((resolve) => setTimeout(resolve, 250));
      }
      return getBlock(block);
    });
    const operation = createOperation();
    head = blocks[2];
    const resolved = vi.fn();
    const rejected = vi.fn();
    void operation.confirmation(1).then(resolved, rejected);
    await vi.advanceTimersByTimeAsync(0);

    head = blocks[3];
    await vi.advanceTimersByTimeAsync(100);
    head = blocks[4];
    await vi.advanceTimersByTimeAsync(100);
    head = blocks[5];
    await vi.advanceTimersByTimeAsync(100);

    expect(resolved).toHaveBeenCalledWith(101);
    expect(rejected).not.toHaveBeenCalled();
  });

  it('continues on a newer head after a superseded historical read fails', async () => {
    const getBlock = context.readProvider.getBlock.bind(context.readProvider);
    const historicalRead = `${blocks[2].hash}~1`;
    const reader = vi.spyOn(context.readProvider, 'getBlock').mockImplementation(async (block) => {
      if (block === historicalRead) {
        await new Promise<void>((resolve) => setTimeout(resolve, 250));
        throw new Error('Previous tip unavailable');
      }
      return getBlock(block);
    });
    const operation = createOperation();
    head = blocks[2];
    const resolved = vi.fn();
    const rejected = vi.fn();
    void operation.confirmation(1).then(resolved, rejected);
    await vi.advanceTimersByTimeAsync(100);
    expect(reader).toHaveBeenCalledWith(historicalRead);

    head = blocks[3];
    await vi.advanceTimersByTimeAsync(200);

    expect(resolved).toHaveBeenCalledWith(101);
    expect(rejected).not.toHaveBeenCalled();
  });

  it('preserves first-head confirmation when the raw operation has no branch', async () => {
    const operation = new Operation(
      operationHash,
      { opbytes: '', opOb: { contents: [] }, counter: 0 },
      [],
      context
    );
    head = blocks[1];
    const confirmation = operation.confirmation(1);

    await vi.advanceTimersByTimeAsync(0);

    await expect(confirmation).resolves.toBe(101);
  });

  it('surfaces a failed branch lookup instead of hiding it behind a confirmation timeout', async () => {
    const error = new Error('Branch header unavailable');
    vi.spyOn(context.readProvider, 'getBlockLevel').mockRejectedValue(error);
    head = blocks[2];
    const operation = createOperation();
    const rejected = vi.fn();
    const resolved = vi.fn();
    void operation.confirmation(1).then(resolved, rejected);

    await vi.advanceTimersByTimeAsync(100);

    expect(rejected).toHaveBeenCalledWith(error);
    expect(resolved).not.toHaveBeenCalled();
  });

  it('allows retrying confirmation on the same Operation after a transient branch lookup failure', async () => {
    const error = new Error('Branch header temporarily unavailable');
    const getBlockLevel = context.readProvider.getBlockLevel.bind(context.readProvider);
    let shouldFail = true;
    vi.spyOn(context.readProvider, 'getBlockLevel').mockImplementation(async (block) => {
      if (shouldFail) {
        throw error;
      }
      return getBlockLevel(block);
    });
    head = blocks[2];
    const operation = createOperation();
    const firstRejected = vi.fn();
    void operation.confirmation(1).then(vi.fn(), firstRejected);
    await vi.advanceTimersByTimeAsync(100);
    expect(firstRejected).toHaveBeenCalledWith(error);

    shouldFail = false;
    const secondResolved = vi.fn();
    const secondRejected = vi.fn();
    void operation.confirmation(1).then(secondResolved, secondRejected);
    await vi.advanceTimersByTimeAsync(100);

    expect(secondRejected).not.toHaveBeenCalled();
    expect(secondResolved).toHaveBeenCalledWith(101);
    expect(operation.includedInBlock).toBe(101);
  });

  it('confirms inclusion in the first observed head', async () => {
    const operation = createOperation();
    head = blocks[1];
    const confirmation = operation.confirmation(1);

    await vi.advanceTimersByTimeAsync(0);

    await expect(confirmation).resolves.toBe(101);
    expect(operation.includedInBlock).toBe(101);
  });

  it('finds inclusion in a block skipped between observed heads', async () => {
    const operation = createOperation();
    const confirmation = operation.confirmation(1);
    await vi.advanceTimersByTimeAsync(0);

    head = blocks[3];
    await vi.advanceTimersByTimeAsync(100);

    await expect(confirmation).resolves.toBe(101);
    expect(operation.includedInBlock).toBe(101);
  });

  it('rejects at the timeout when a replacement branch omits the operation', async () => {
    const operation = createOperation();
    head = blocks[1];
    const initial = expect(operation.confirmation(1)).resolves.toBe(101);
    await vi.advanceTimersByTimeAsync(0);
    await initial;

    const replacement = [makeBlock(101, false, true), makeBlock(102, false, true)];
    blocks.push(...replacement);
    head = replacement[1];
    const resolved = vi.fn();
    const rejected = vi.fn();
    void operation.confirmation(1).then(resolved, rejected);
    await vi.advanceTimersByTimeAsync(100);
    expect(rejected).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(confirmationTimeoutSeconds * 1000);
    expect(resolved).not.toHaveBeenCalled();
    expect(rejected).toHaveBeenCalledWith(expect.any(OperationReorgError));
  });

  it('keeps waiting when a node behind the inclusion reports the head', async () => {
    const operation = createOperation();
    head = blocks[1];
    const resolved = vi.fn();
    const rejected = vi.fn();
    void operation.confirmation(3).then(resolved, rejected);
    await vi.advanceTimersByTimeAsync(150);

    head = blocks[0];
    await vi.advanceTimersByTimeAsync(150);
    head = blocks[3];
    await vi.advanceTimersByTimeAsync(300);

    expect(rejected).not.toHaveBeenCalled();
    expect(resolved).toHaveBeenCalledWith(103);
  });

  it('counts from a re-inclusion after a same-level replacement omits the operation', async () => {
    const operation = createOperation();
    head = blocks[1];
    const resolved = vi.fn();
    const rejected = vi.fn();
    void operation.confirmation(2).then(resolved, rejected);
    await vi.advanceTimersByTimeAsync(150);

    const replacement = [
      makeBlock(101, false, true),
      makeBlock(102, true, true),
      makeBlock(103, false, true),
    ];
    blocks.push(...replacement);
    for (const block of replacement) {
      head = block;
      await vi.advanceTimersByTimeAsync(150);
    }

    expect(rejected).not.toHaveBeenCalled();
    expect(resolved).toHaveBeenCalledWith(103);
    expect(operation.includedInBlock).toBe(102);
  });

  it('checks only the new head while consecutive heads omit the operation', async () => {
    const operation = createOperation();
    head = blocks[1];
    const initial = expect(operation.confirmation(1)).resolves.toBe(101);
    await vi.advanceTimersByTimeAsync(0);
    await initial;

    const replacement = [
      makeBlock(101, false, true),
      makeBlock(102, false, true),
      makeBlock(103, false, true),
      makeBlock(104, true, true),
    ];
    blocks.push(...replacement);
    head = replacement[1];
    const confirmation = expect(operation.confirmation(1)).resolves.toBe(104);
    await vi.advanceTimersByTimeAsync(150);

    const getBlock = context.readProvider.getBlock.bind(context.readProvider);
    const ancestorReads: unknown[] = [];
    vi.spyOn(context.readProvider, 'getBlock').mockImplementation(async (block) => {
      if (block !== head.hash) ancestorReads.push(block);
      return getBlock(block);
    });
    head = replacement[2];
    await vi.advanceTimersByTimeAsync(150);
    head = replacement[3];
    await vi.advanceTimersByTimeAsync(150);

    await confirmation;
    expect(ancestorReads).toEqual([]);
  });

  it('rejects with the read error when an ancestry read fails while waiting for re-inclusion', async () => {
    const operation = createOperation();
    head = blocks[1];
    const initial = expect(operation.confirmation(1)).resolves.toBe(101);
    await vi.advanceTimersByTimeAsync(0);
    await initial;

    const replacement = [101, 102, 103, 104].map((level) => makeBlock(level, false, true));
    blocks.push(...replacement);
    head = replacement[1];
    const resolved = vi.fn();
    const rejected = vi.fn();
    void operation.confirmation(1).then(resolved, rejected);
    await vi.advanceTimersByTimeAsync(150);
    expect(rejected).not.toHaveBeenCalled();

    const error = new Error('Ancestry lookup failed');
    vi.spyOn(context.readProvider, 'getBlockHash').mockRejectedValue(error);
    head = replacement[3];
    await vi.advanceTimersByTimeAsync(150);

    expect(resolved).not.toHaveBeenCalled();
    expect(rejected).toHaveBeenCalledWith(error);
  });

  it('searches the whole branch again when the last search stopped at the block limit', async () => {
    const operation = createOperation();
    head = blocks[1];
    const initial = expect(operation.confirmation(1)).resolves.toBe(101);
    await vi.advanceTimersByTimeAsync(0);
    await initial;

    const replacement = Array.from({ length: 126 }, (_, offset) =>
      makeBlock(101 + offset, false, true)
    );
    blocks.push(...replacement);
    head = replacement[124];
    const resolved = vi.fn();
    const rejected = vi.fn();
    void operation.confirmation(1).then(resolved, rejected);
    await vi.advanceTimersByTimeAsync(150);

    const getBlock = context.readProvider.getBlock.bind(context.readProvider);
    const ancestorReads: unknown[] = [];
    vi.spyOn(context.readProvider, 'getBlock').mockImplementation(async (block) => {
      if (block !== head.hash) ancestorReads.push(block);
      return getBlock(block);
    });
    head = replacement[125];
    await vi.advanceTimersByTimeAsync(150);

    expect(ancestorReads.length).toBeGreaterThan(0);

    await vi.advanceTimersByTimeAsync(confirmationTimeoutSeconds * 1000);
    expect(resolved).not.toHaveBeenCalled();
    expect(rejected).toHaveBeenCalledWith(expect.any(ConfirmationTimeoutError));
  });

  it('propagates an ancestry lookup failure for the current head', async () => {
    const operation = createOperation();
    head = blocks[1];
    const initial = expect(operation.confirmation(1)).resolves.toBe(101);
    await vi.advanceTimersByTimeAsync(0);
    await initial;

    const error = new Error('Ancestry lookup failed');
    vi.spyOn(context.readProvider, 'getBlockHash').mockRejectedValue(error);
    head = blocks[3];
    const confirmation = expect(operation.confirmation(1)).rejects.toBe(error);
    await vi.advanceTimersByTimeAsync(100);
    await confirmation;
  });

  it('counts concurrent confirmations from a verified replacement inclusion', async () => {
    const operation = createOperation();
    head = blocks[1];
    const initial = expect(operation.confirmation(1)).resolves.toBe(101);
    await vi.advanceTimersByTimeAsync(0);
    await initial;

    const replacement = [makeBlock(101, false, true), makeBlock(102, true, true)];
    blocks.push(...replacement);
    head = replacement[1];
    const firstConfirmation = expect(operation.confirmation(1)).resolves.toBe(102);
    const secondConfirmation = expect(operation.confirmation(2)).resolves.toBe(103);
    await vi.advanceTimersByTimeAsync(100);
    await firstConfirmation;
    expect(operation.includedInBlock).toBe(102);

    head = makeBlock(103, false, true);
    blocks.push(head);
    await vi.advanceTimersByTimeAsync(100);
    await secondConfirmation;
  });

  it('counts a replacement inclusion when intermediate heads were skipped', async () => {
    const operation = createOperation();
    head = blocks[1];
    const initial = expect(operation.confirmation(1)).resolves.toBe(101);
    await vi.advanceTimersByTimeAsync(0);
    await initial;

    const replacement = [makeBlock(101, false, true), makeBlock(102, false, true)];
    head = makeBlock(103, true, true);
    blocks.push(...replacement, head);
    const confirmation = expect(operation.confirmation(1)).resolves.toBe(103);
    await vi.advanceTimersByTimeAsync(100);

    await confirmation;
    expect(operation.includedInBlock).toBe(103);
  });

  it('uses a completed ancestry read to verify newer consecutive heads', async () => {
    const operation = createOperation();
    head = blocks[1];
    const initial = expect(operation.confirmation(1)).resolves.toBe(101);
    await vi.advanceTimersByTimeAsync(0);
    await initial;

    const getBlockHash = context.readProvider.getBlockHash.bind(context.readProvider);
    const ancestryReads = vi
      .spyOn(context.readProvider, 'getBlockHash')
      .mockImplementation(async (block) => {
        if (block !== 'head') {
          await new Promise<void>((resolve) => setTimeout(resolve, 250));
        }
        return getBlockHash(block);
      });
    head = blocks[3];
    const resolved = vi.fn();
    const rejected = vi.fn();
    void operation.confirmation(5).then(resolved, rejected);
    await vi.advanceTimersByTimeAsync(100);
    head = blocks[4];
    await vi.advanceTimersByTimeAsync(100);
    head = blocks[5];
    await vi.advanceTimersByTimeAsync(150);

    expect(resolved).toHaveBeenCalledWith(105);
    expect(rejected).not.toHaveBeenCalled();
    expect(ancestryReads.mock.calls.filter(([block]) => block !== 'head')).toEqual([
      [`${blocks[3].hash}~2`],
    ]);
  });

  it('counts from the newer observed branch when a confirmation read overlaps a head change', async () => {
    const operation = createOperation();
    head = blocks[1];
    const initial = expect(operation.confirmation(1)).resolves.toBe(101);
    await vi.advanceTimersByTimeAsync(0);
    await initial;

    const getBlockHash = context.readProvider.getBlockHash.bind(context.readProvider);
    const olderAncestor = `${blocks[3].hash}~2`;
    const ancestryRead = vi
      .spyOn(context.readProvider, 'getBlockHash')
      .mockImplementation(async (block) => {
        if (block === olderAncestor) {
          await new Promise<void>((resolve) => setTimeout(resolve, 250));
        }
        return getBlockHash(block);
      });

    head = blocks[3];
    const confirmation = expect(operation.confirmation(3)).resolves.toBe(104);
    await vi.advanceTimersByTimeAsync(100);
    expect(ancestryRead).toHaveBeenCalledWith(olderAncestor);

    const replacement = [
      makeBlock(101, false, true),
      makeBlock(102, true, true),
      makeBlock(103, false, true),
    ];
    head = makeBlock(104, false, true);
    blocks.push(...replacement, head);

    await vi.advanceTimersByTimeAsync(500);
    await confirmation;
    expect(operation.includedInBlock).toBe(102);
  });

  it('times out when the operation is absent from both historical blocks and the head', async () => {
    blocks = blocks.map((block) => makeBlock(block.header.level));
    const operation = createOperation();
    head = blocks[3];
    const confirmation = expect(operation.confirmation(1)).rejects.toBeInstanceOf(
      ConfirmationTimeoutError
    );

    await vi.advanceTimersByTimeAsync(confirmationTimeoutSeconds * 1000);

    await confirmation;
    expect(operation.includedInBlock).toBe(Number.POSITIVE_INFINITY);
  });
});
