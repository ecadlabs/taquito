import { BlockResponse, RpcClient } from '@taquito/rpc';
import { Context } from '../../src/context';
import { ConfirmationTimeoutError } from '../../src/errors';
import { Operation } from '../../src/operations/operations';
import { PollingSubscribeProvider } from '../../src/subscribe/polling-subcribe-provider';
import { blockResponse } from '../read-provider/data';

const operationHash = 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
const branchHash = blockResponse.hash;
const confirmationTimeoutSeconds = 30;

function makeBlock(level: number, includesOperation = false): BlockResponse {
  return {
    ...blockResponse,
    hash: level === 100 ? branchHash : `block-${level}`,
    header: {
      ...blockResponse.header,
      level,
      predecessor: level === 101 ? branchHash : `block-${level - 1}`,
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
      const block =
        identifier === 'head'
          ? head
          : blocks.find((candidate) =>
              identifier.startsWith('head~')
                ? candidate.header.level === head.header.level - Number(identifier.slice(5))
                : candidate.hash === identifier || String(candidate.header.level) === identifier
            );
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
        const block = blocks.find(
          (candidate) =>
            candidate.hash === identifier || String(candidate.header.level) === identifier
        );
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
      if (block === 101) {
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
