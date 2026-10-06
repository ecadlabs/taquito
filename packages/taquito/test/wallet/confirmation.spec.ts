import { BlockResponse, OpKind, RpcClient } from '@taquito/rpc';
import { Context } from '../../src/context';
import { ConfirmationTimeoutError } from '../../src/errors';
import { PollingSubscribeProvider } from '../../src/subscribe/polling-subcribe-provider';
import { Wallet, WalletOperation } from '../../src/wallet';
import { blockResponse } from '../read-provider/data';

const operationHash = 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
const address = 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx';
const contract = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton';
const confirmationTimeoutSeconds = 3;

function makeBlock(level: number, includesOperation = false): BlockResponse {
  return {
    ...blockResponse,
    hash: `block-${level}`,
    header: { ...blockResponse.header, level },
    metadata: {
      protocol: blockResponse.protocol,
      next_protocol: blockResponse.protocol,
      test_chain_status: { status: 'not_running' },
      max_operations_ttl: 120,
      max_operation_data_length: 32768,
      max_block_header_length: 239,
      max_operation_list_length: [],
      baker: address,
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
              branch: blockResponse.hash,
              contents: [
                {
                  kind: OpKind.TRANSACTION,
                  source: address,
                  destination: address,
                  amount: '1',
                  fee: '100',
                  counter: '1',
                  gas_limit: '1000',
                  storage_limit: '0',
                  metadata: { operation_result: { status: 'applied' } },
                },
              ],
            },
          ]
        : [],
    ],
  };
}

const sendCases: { name: string; send: (wallet: Wallet) => Promise<WalletOperation> }[] = [
  { name: 'transfer', send: (wallet) => wallet.transfer({ to: address, amount: 1 }).send() },
  {
    name: 'batch',
    send: (wallet) => wallet.batch().withTransfer({ to: address, amount: 1 }).send(),
  },
  {
    name: 'originate',
    send: (wallet) =>
      wallet
        .originate({
          code: 'parameter unit; storage unit; code { CDR; NIL operation; PAIR }',
          init: { prim: 'Unit' },
        })
        .send(),
  },
  { name: 'setDelegate', send: (wallet) => wallet.setDelegate({ delegate: address }).send() },
  { name: 'registerDelegate', send: (wallet) => wallet.registerDelegate().send() },
  { name: 'stake', send: (wallet) => wallet.stake({ amount: 1 }).send() },
  { name: 'unstake', send: (wallet) => wallet.unstake({ amount: 1 }).send() },
  { name: 'finalizeUnstake', send: (wallet) => wallet.finalizeUnstake({}).send() },
  {
    name: 'increasePaidStorage',
    send: (wallet) => wallet.increasePaidStorage({ destination: contract, amount: 1 }).send(),
  },
  {
    name: 'registerGlobalConstant',
    send: (wallet) => wallet.registerGlobalConstant({ value: { prim: 'Unit' } }).send(),
  },
  {
    name: 'transferTicket',
    send: (wallet) =>
      wallet
        .transferTicket({
          ticketContents: { string: 'ticket' },
          ticketTy: { prim: 'string' },
          ticketTicketer: contract,
          ticketAmount: 1,
          destination: address,
          entrypoint: 'default',
        })
        .send(),
  },
];

describe('Wallet confirmation', () => {
  let context: Context;
  let rpc: RpcClient;
  let head: BlockResponse;
  let blocks: BlockResponse[];

  beforeEach(() => {
    vi.useFakeTimers();
    blocks = Array.from({ length: 6 }, (_, offset) => makeBlock(100 + offset, offset === 1));
    head = blocks[0];
    rpc = new RpcClient('http://localhost:0');
    const getBlock = (identifier = 'head') => {
      const block =
        identifier === 'head'
          ? head
          : blocks.find(
              (candidate) =>
                candidate.hash === identifier || String(candidate.header.level) === identifier
            );
      if (!block || block.header.level > head.header.level) {
        throw new Error(`Unexpected block requested: ${identifier}`);
      }
      return block;
    };
    vi.spyOn(rpc, 'getBlock').mockImplementation(async ({ block } = { block: 'head' }) =>
      getBlock(block)
    );
    context = new Context(rpc);
    vi.spyOn(context.readProvider, 'getBlockLevel').mockImplementation(
      async (identifier) => getBlock(String(identifier)).header.level
    );
    vi.spyOn(context.readProvider, 'getNextProtocol').mockResolvedValue(blockResponse.protocol);
    context.setPartialConfig({ confirmationPollingTimeoutSecond: confirmationTimeoutSeconds });
    context.stream = new PollingSubscribeProvider(context, { pollingIntervalMilliseconds: 100 });
    vi.spyOn(context.walletProvider, 'getPKH').mockResolvedValue(address);
    vi.spyOn(context.walletProvider, 'sendOperations').mockImplementation(async () => {
      // Inclusion and another block precede the wallet returning the operation hash.
      head = blocks[2];
      return operationHash;
    });
  });

  afterEach(async () => {
    // Dispose polling even when a regression assertion fails before confirmation settles.
    await vi.advanceTimersByTimeAsync(confirmationTimeoutSeconds * 1000);
    vi.clearAllTimers();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it.each(sendCases)(
    '$name finds inclusion before the wallet returns the hash',
    async ({ send }) => {
      const operation = await send(context.wallet);
      const resolved = vi.fn();
      const rejected = vi.fn();
      void operation.confirmation(1).then(resolved, rejected);

      await vi.advanceTimersByTimeAsync(100);

      expect(resolved).toHaveBeenCalledWith(expect.objectContaining({ completed: true }));
      expect(rejected).not.toHaveBeenCalled();
      expect(await operation.operationResults()).toEqual(blocks[1].operations[3][0].contents);
      expect(context.walletProvider.sendOperations).toHaveBeenCalledTimes(1);
    }
  );

  it('reports applied status and waits for the remaining confirmations after historical inclusion', async () => {
    const operation = await context.wallet.transfer({ to: address, amount: 1 }).send();
    const resolved = vi.fn();
    const rejected = vi.fn();
    void operation.confirmation(3).then(resolved, rejected);
    await vi.advanceTimersByTimeAsync(100);

    expect(await operation.status()).toBe('applied');
    expect(await operation.getCurrentConfirmation()).toBe(2);
    expect(resolved).not.toHaveBeenCalled();

    head = blocks[3];
    await vi.advanceTimersByTimeAsync(100);
    expect(resolved).toHaveBeenCalledWith(
      expect.objectContaining({ currentConfirmation: 3, completed: true })
    );
    expect(rejected).not.toHaveBeenCalled();
  });

  it('captures a fresh reference when send is called, not when the command is created', async () => {
    const command = context.wallet.transfer({ to: address, amount: 1 });
    head = blocks[3];
    blocks[4] = makeBlock(104, true);
    vi.mocked(context.walletProvider.sendOperations).mockImplementation(async () => {
      head = blocks[5];
      return operationHash;
    });
    const operation = await command.send();
    const resolved = vi.fn();
    void operation.confirmation(1).then(resolved, vi.fn());
    await vi.advanceTimersByTimeAsync(100);

    expect(resolved).toHaveBeenCalledWith(expect.objectContaining({ block: blocks[4] }));
  });

  it('finishes a slow historical read while newer heads keep arriving', async () => {
    const getBlock = context.readProvider.getBlock.bind(context.readProvider);
    vi.spyOn(context.readProvider, 'getBlock').mockImplementation(async (identifier) => {
      if (identifier === 101) {
        await new Promise<void>((resolve) => setTimeout(resolve, 250));
      }
      return getBlock(identifier);
    });
    // An explicit reference isolates backfill cancellation from the wallet-send regression.
    head = blocks[2];
    const operation = await context.operationFactory.createTransactionOperation(operationHash, {
      blockIdentifier: '100',
    });
    const resolved = vi.fn();
    const rejected = vi.fn();
    void operation.confirmation(1).then(resolved, rejected);
    await vi.advanceTimersByTimeAsync(0);

    for (const level of [103, 104, 105]) {
      head = blocks[level - 100];
      await vi.advanceTimersByTimeAsync(100);
    }

    expect(resolved).toHaveBeenCalledWith(expect.objectContaining({ completed: true }));
    expect(rejected).not.toHaveBeenCalled();
    expect(await operation.status()).toBe('applied');
  });

  it.each([false, true])(
    'does not rewind confirmations when monitoring resumes (prior confirmation call: %s)',
    async (confirmFirst) => {
      const getBlock = vi.spyOn(context.readProvider, 'getBlock');
      const operation = await context.wallet.transfer({ to: address, amount: 1 }).send();
      const first = confirmFirst ? operation.confirmation(1) : undefined;
      await vi.advanceTimersByTimeAsync(100);
      if (first) {
        await first;
      }
      // Both the constructor's inclusion monitor and confirmation(1) have unsubscribed.
      expect(await operation.status()).toBe('applied');
      const confirmations: number[] = [];
      const completed = vi.fn();
      const failed = vi.fn();
      const subscription = operation.confirmationObservable(3).subscribe({
        next: (result) => confirmations.push(result.currentConfirmation),
        complete: completed,
        error: failed,
      });
      try {
        await vi.advanceTimersByTimeAsync(100);
        expect(confirmations).toEqual([2]);
        expect(completed).not.toHaveBeenCalled();
        head = blocks[3];
        await vi.advanceTimersByTimeAsync(100);
        expect(confirmations).toEqual([2, 3]);
        expect(completed).toHaveBeenCalledOnce();
        expect(failed).not.toHaveBeenCalled();
        expect(getBlock.mock.calls.filter(([identifier]) => identifier === 101)).toHaveLength(1);
      } finally {
        subscription.unsubscribe();
      }
    }
  );

  it('confirms inclusion in the first observed head', async () => {
    vi.mocked(context.walletProvider.sendOperations).mockImplementation(async () => {
      head = blocks[1];
      return operationHash;
    });
    const operation = await context.wallet.transfer({ to: address, amount: 1 }).send();
    const resolved = vi.fn();
    void operation.confirmation(1).then(resolved, vi.fn());
    await vi.advanceTimersByTimeAsync(100);

    expect(resolved).toHaveBeenCalledWith(
      expect.objectContaining({ completed: true, currentConfirmation: 1 })
    );
  });

  it('times out when neither historical blocks nor new heads contain the operation', async () => {
    blocks = blocks.map((block) => makeBlock(block.header.level));
    head = blocks[0];
    const operation = await context.wallet.transfer({ to: address, amount: 1 }).send();
    const rejected = vi.fn();
    void operation.confirmation(1).then(vi.fn(), rejected);
    await vi.advanceTimersByTimeAsync(confirmationTimeoutSeconds * 1000);

    expect(rejected).toHaveBeenCalledWith(expect.any(ConfirmationTimeoutError));
    expect(await operation.status()).toBe('pending');
  });

  it('does not submit an operation when the reference block lookup fails', async () => {
    const error = new Error('Head unavailable');
    vi.mocked(context.readProvider.getBlockLevel).mockRejectedValue(error);
    const rejected = vi.fn();
    await context.wallet.transfer({ to: address, amount: 1 }).send().catch(rejected);
    expect(rejected).toHaveBeenCalledWith(error);
    expect(context.walletProvider.sendOperations).not.toHaveBeenCalled();
  });

  it('preserves wallet rejection without starting confirmation polling', async () => {
    const error = new Error('Wallet rejected request');
    vi.mocked(context.walletProvider.sendOperations).mockRejectedValue(error);
    const subscribe = vi.spyOn(context.stream, 'subscribeBlock');
    await expect(context.wallet.transfer({ to: address, amount: 1 }).send()).rejects.toBe(error);
    expect(subscribe).not.toHaveBeenCalled();
  });

  it('surfaces a historical read failure through confirmation', async () => {
    const error = new Error('Historical block unavailable');
    const getBlock = context.readProvider.getBlock.bind(context.readProvider);
    vi.spyOn(context.readProvider, 'getBlock').mockImplementation(async (identifier) => {
      if (identifier === 101) {
        throw error;
      }
      return getBlock(identifier);
    });
    const operation = await context.wallet.transfer({ to: address, amount: 1 }).send();
    const rejected = vi.fn();
    void operation.confirmation(1).then(vi.fn(), rejected);
    await vi.advanceTimersByTimeAsync(100);

    expect(rejected).toHaveBeenCalledWith(error);
  });
});
