import { TezosToolkit, WalletProvider, Wallet, WalletParamsWithKind } from '../../src/taquito';
import {
  BlockResponse,
  OperationContentsAndResult,
  OpKind,
  PvmKind,
  RpcClient,
} from '@taquito/rpc';
import { UnsupportedActionError } from '@taquito/core';

import { blockResponse } from '../read-provider/data';

const hash = 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
const address = 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx';

function setup(contents: OperationContentsAndResult[] = []) {
  const rpc = new RpcClient('http://localhost:0');
  const tezos = new TezosToolkit(rpc);
  const provider: WalletProvider = {
    getPKH: async () => address,
    getPK: async () => '',
    sign: async () => '',
    mapTransferParamsToWalletParams: vi.fn(async (get) => ({
      kind: OpKind.TRANSACTION,
      ...(await get()),
    })),
    mapOriginateParamsToWalletParams: vi.fn(async (get) => await get()),
    mapDelegateParamsToWalletParams: vi.fn(async (get) => await get()),
    mapTransferTicketParamsToWalletParams: vi.fn(async (get) => await get()),
    mapRegisterGlobalConstantParamsToWalletParams: vi.fn(async (get) => await get()),
    mapStakeParamsToWalletParams: vi.fn(async (get) => await get()),
    mapUnstakeParamsToWalletParams: vi.fn(async (get) => await get()),
    mapFinalizeUnstakeParamsToWalletParams: vi.fn(async (get) => await get()),
    mapIncreasePaidStorageWalletParams: vi.fn(async (get) => await get()),
    sendOperations: vi.fn(async () => hash),
  };
  tezos.setWalletProvider(provider);
  const block: BlockResponse = {
    ...blockResponse,
    header: { ...blockResponse.header, level: 100 },
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
      [
        {
          protocol: blockResponse.protocol,
          chain_id: blockResponse.chain_id,
          hash,
          branch: blockResponse.hash,
          contents,
        },
      ],
    ],
  };
  vi.spyOn(rpc, 'getBlockHeader').mockResolvedValue({
    ...block.header,
    timestamp: '2026-10-22T00:00:00Z',
    protocol: block.protocol,
    chain_id: block.chain_id,
    hash: block.hash,
    content: { command: 'activate', hash: '', fitness: [], protocol_parameters: '' },
  });
  vi.spyOn(rpc, 'getBlockHash').mockResolvedValue(block.hash);
  vi.spyOn(rpc, 'getBlock').mockResolvedValue(block);
  return { tezos, provider, rpc };
}

afterEach(() => vi.restoreAllMocks());

it('rejects an unsupported rollup before mapping any earlier batch operation', async () => {
  const { tezos, provider } = setup();
  await expect(
    tezos.wallet
      .batch()
      .withTransfer({ to: address, amount: 1 })
      .withSmartRollupAddMessages({ message: ['00'] })
      .send()
  ).rejects.toBeInstanceOf(UnsupportedActionError);
  expect(provider.mapTransferParamsToWalletParams).not.toHaveBeenCalled();
  expect(provider.sendOperations).not.toHaveBeenCalled();
});

const messages = { message: ['00', 'ff'], fee: 0, gasLimit: 1, storageLimit: 0 };
const originate = {
  pvmKind: PvmKind.WASM2,
  kernel: '0061736d01000000',
  parametersType: { prim: 'bytes' },
};
const outbox = {
  rollup: 'sr1JZsZT5u27MUQXeTh1aHqZBo8NvyxRKnyv',
  cementedCommitment: 'src13rFpXGRRwQTPRcvTA8Ka5avJMt6MCrCEodDTCvD65BVVEoShoh',
  outputProof: '00ff',
};
const manager = {
  source: address,
  fee: '100',
  counter: '1',
  gas_limit: '1000',
  storage_limit: '0',
};
const receiptCases = [
  {
    name: 'add messages',
    content: {
      ...manager,
      kind: OpKind.SMART_ROLLUP_ADD_MESSAGES,
      message: ['00'],
      metadata: { operation_result: { status: 'applied' } },
    },
    send: (wallet: Wallet) => wallet.smartRollupAddMessages(messages).send(),
  },
  {
    name: 'originate',
    content: {
      ...manager,
      kind: OpKind.SMART_ROLLUP_ORIGINATE,
      pvm_kind: PvmKind.WASM2,
      kernel: '00',
      parameters_ty: { prim: 'bytes' },
      metadata: { operation_result: { status: 'applied', address: outbox.rollup } },
    },
    send: (wallet: Wallet) => wallet.smartRollupOriginate(originate).send(),
  },
  {
    name: 'execute outbox',
    content: {
      ...manager,
      kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
      rollup: outbox.rollup,
      cemented_commitment: outbox.cementedCommitment,
      output_proof: '00ff',
      metadata: { operation_result: { status: 'applied' } },
    },
    send: (wallet: Wallet) => wallet.smartRollupExecuteOutboxMessage(outbox).send(),
  },
] satisfies {
  name: string;
  content: OperationContentsAndResult;
  send: (wallet: Wallet) => Promise<{
    status(): Promise<string>;
    operationResults(): Promise<OperationContentsAndResult[] | undefined>;
    revealOperation(): Promise<unknown>;
    confirmation(n: number): Promise<unknown>;
  }>;
}[];

function support(provider: WalletProvider) {
  provider.mapSmartRollupAddMessagesParamsToWalletParams = vi.fn(async function (
    this: WalletProvider,
    get
  ) {
    expect(this).toBe(provider);
    return { ...(await get()), kind: OpKind.SMART_ROLLUP_ADD_MESSAGES };
  });
  provider.mapSmartRollupOriginateParamsToWalletParams = vi.fn(async function (
    this: WalletProvider,
    get
  ) {
    expect(this).toBe(provider);
    return { ...(await get()), kind: OpKind.SMART_ROLLUP_ORIGINATE };
  });
  provider.mapSmartRollupExecuteOutboxMessageParamsToWalletParams = vi.fn(async function (
    this: WalletProvider,
    get
  ) {
    expect(this).toBe(provider);
    return { ...(await get()), kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE };
  });
}

it.each(receiptCases)(
  '$name submits and reads the matching included receipt',
  async ({ send, content }) => {
    const reveal: OperationContentsAndResult = {
      ...manager,
      kind: OpKind.REVEAL,
      public_key: 'public-key-fixture',
      metadata: { operation_result: { status: 'applied' } },
    };
    const { tezos, provider } = setup([reveal, content]);
    support(provider);
    const operation = await send(tezos.wallet);
    expect(await operation.operationResults()).toEqual([reveal, content]);
    expect(await operation.status()).toBe('applied');
    expect(await operation.revealOperation()).toEqual(reveal);
    expect(await operation.confirmation(1)).toMatchObject({ completed: true });
    expect(provider.sendOperations).toHaveBeenCalledTimes(1);
  }
);

it.each(receiptCases)('$name reports a failed receipt', async ({ send, content }) => {
  const failed = { ...content, metadata: { operation_result: { status: 'failed' as const } } };
  const { tezos, provider } = setup([failed]);
  support(provider);
  const operation = await send(tezos.wallet);
  await operation.operationResults();
  expect(await operation.status()).toBe('failed');
});

it.each(receiptCases)('$name reports unknown for a missing matching receipt', async ({ send }) => {
  const { tezos, provider } = setup();
  support(provider);
  const operation = await send(tezos.wallet);
  await operation.operationResults();
  expect(await operation.status()).toBe('unknown');
});

it('returns the originated rollup address', async () => {
  const { tezos, provider } = setup([receiptCases[1].content]);
  support(provider);
  const operation = await tezos.wallet.smartRollupOriginate(originate).send();
  expect(await operation.rollupAddress()).toBe(outbox.rollup);
  expect((await operation.smartRollupOriginateOperation())?.kind).toBe(
    OpKind.SMART_ROLLUP_ORIGINATE
  );
});

it('defers mapping until send and anchors before submission', async () => {
  const { tezos, provider, rpc } = setup();
  support(provider);
  const command = tezos.wallet.smartRollupAddMessages(messages);
  expect(provider.mapSmartRollupAddMessagesParamsToWalletParams).not.toHaveBeenCalled();
  await command.send();
  expect(provider.sendOperations).toHaveBeenCalledWith([
    { ...messages, kind: OpKind.SMART_ROLLUP_ADD_MESSAGES },
  ]);
  expect(vi.mocked(rpc.getBlockHeader).mock.invocationCallOrder[0]).toBeLessThan(
    vi.mocked(provider.sendOperations).mock.invocationCallOrder[0]
  );
  expect(rpc.getBlock).toHaveBeenCalledWith({ block: '100' });
});

it.each(['fluent', 'array'])('preserves mixed batch order through the %s route', async (route) => {
  const { tezos, provider } = setup([receiptCases[0].content]);
  support(provider);
  const params: WalletParamsWithKind[] = [
    { ...messages, kind: OpKind.SMART_ROLLUP_ADD_MESSAGES },
    { to: address, amount: 1, kind: OpKind.TRANSACTION },
    { ...originate, kind: OpKind.SMART_ROLLUP_ORIGINATE },
    { ...outbox, kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE },
  ];
  const batch =
    route === 'array'
      ? tezos.wallet.batch(params)
      : tezos.wallet
          .batch()
          .withSmartRollupAddMessages(messages)
          .withTransfer({ to: address, amount: 1 })
          .withSmartRollupOriginate(originate)
          .withSmartRollupExecuteOutboxMessage(outbox);
  const operation = await batch.send();
  expect(provider.sendOperations).toHaveBeenCalledExactlyOnceWith(params);
  await operation.operationResults();
  expect(await operation.status()).toBe('applied');
});

it.each(receiptCases)('$name rejects missing capabilities without submission', async ({ send }) => {
  const { tezos, provider } = setup();
  await expect(send(tezos.wallet)).rejects.toBeInstanceOf(UnsupportedActionError);
  expect(provider.sendOperations).not.toHaveBeenCalled();
});

it('preserves the mapping error and does not submit', async () => {
  const { tezos, provider } = setup();
  const failure = new Error('mapping failed');
  provider.mapSmartRollupAddMessagesParamsToWalletParams = async () => {
    throw failure;
  };
  await expect(tezos.wallet.smartRollupAddMessages(messages).send()).rejects.toBe(failure);
  expect(provider.sendOperations).not.toHaveBeenCalled();
});

it('preserves a wallet rejection', async () => {
  const { tezos, provider } = setup();
  support(provider);
  const failure = new Error('wallet rejected');
  vi.mocked(provider.sendOperations).mockRejectedValue(failure);
  await expect(tezos.wallet.smartRollupAddMessages(messages).send()).rejects.toBe(failure);
});

it('continues to send transfers with an old provider lacking rollup methods', async () => {
  const { tezos, provider } = setup();
  await tezos.wallet.transfer({ to: address, amount: 1 }).send();
  expect(provider.sendOperations).toHaveBeenCalledExactlyOnceWith([
    { to: address, amount: 1, kind: OpKind.TRANSACTION },
  ]);
});

it.each(receiptCases)('$name is pending before inclusion', async ({ send }) => {
  const { tezos, provider, rpc } = setup();
  support(provider);
  vi.mocked(rpc.getBlock).mockRejectedValue(new Error('No inclusion yet'));
  const operation = await send(tezos.wallet);
  expect(await operation.status()).toBe('pending');
});

it('does not invent an address when origination has no address', async () => {
  const { tezos, provider } = setup();
  support(provider);
  const operation = await tezos.wallet.smartRollupOriginate(originate).send();
  expect(await operation.rollupAddress()).toBeUndefined();
});

it('rejects a later missing capability before mapping supported rollups', async () => {
  const { tezos, provider } = setup();
  support(provider);
  delete provider.mapSmartRollupOriginateParamsToWalletParams;
  await expect(
    tezos.wallet
      .batch()
      .withSmartRollupAddMessages(messages)
      .withSmartRollupOriginate(originate)
      .send()
  ).rejects.toBeInstanceOf(UnsupportedActionError);
  expect(provider.mapSmartRollupAddMessagesParamsToWalletParams).not.toHaveBeenCalled();
  expect(provider.sendOperations).not.toHaveBeenCalled();
});

it('keeps source selection with the wallet in public parameter types', () => {
  expectTypeOf<Parameters<Wallet['smartRollupAddMessages']>[0]>().not.toHaveProperty('source');
  expectTypeOf<Parameters<Wallet['smartRollupOriginate']>[0]>().not.toHaveProperty('source');
  expectTypeOf<Parameters<Wallet['smartRollupExecuteOutboxMessage']>[0]>().not.toHaveProperty(
    'source'
  );
});
