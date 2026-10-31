import { TezosToolkit, WalletProvider, Wallet, WalletParamsWithKind } from '../../src/taquito';
import {
  BlockResponse,
  OperationContentsAndResult,
  OpKind,
  PvmKind,
  RpcClient,
} from '@taquito/rpc';
import { UnsupportedActionError } from '@taquito/core';
import { firstValueFrom, Subject } from 'rxjs';

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

const messages = { message: ['00', 'ff'], fee: 0, gasLimit: 1, storageLimit: 0 };
const originate = {
  pvmKind: PvmKind.WASM2,
  kernel: '0061736d01000000',
  parametersType: { prim: 'bytes' },
  whitelist: ['tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh', 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx'],
};
const outbox = {
  rollup: 'sr1JZsZT5u27MUQXeTh1aHqZBo8NvyxRKnyv',
  cementedCommitment: 'src13rFpXGRRwQTPRcvTA8Ka5avJMt6MCrCEodDTCvD65BVVEoShoh',
  outputProof: '00ff',
};
const unsupportedBatchCases: WalletParamsWithKind[] = [
  { ...messages, kind: OpKind.SMART_ROLLUP_ADD_MESSAGES },
  { ...originate, kind: OpKind.SMART_ROLLUP_ORIGINATE },
  { ...outbox, kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE },
];
it.each(unsupportedBatchCases)(
  'rejects unsupported $kind before mapping an earlier transfer',
  async (operation) => {
    const { tezos, provider } = setup();
    await expect(
      tezos.wallet.batch([{ kind: OpKind.TRANSACTION, to: address, amount: 1 }, operation]).send()
    ).rejects.toBeInstanceOf(UnsupportedActionError);
    expect(provider.mapTransferParamsToWalletParams).not.toHaveBeenCalled();
    expect(provider.sendOperations).not.toHaveBeenCalled();
  }
);

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

it('forwards an ordered origination whitelist without changing the input', async () => {
  const { tezos, provider } = setup();
  support(provider);
  const input = Object.freeze({ ...originate, whitelist: [...originate.whitelist] });
  Object.freeze(input.whitelist);
  await tezos.wallet.smartRollupOriginate(input).send();
  expect(provider.sendOperations).toHaveBeenCalledExactlyOnceWith([
    {
      kind: OpKind.SMART_ROLLUP_ORIGINATE,
      pvmKind: PvmKind.WASM2,
      kernel: '0061736d01000000',
      parametersType: { prim: 'bytes' },
      whitelist: ['tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh', 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx'],
    },
  ]);
  expect(input.whitelist).toEqual([
    'tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
    'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
  ]);
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
  const batchOriginate = { ...originate, whitelist: [...originate.whitelist] };
  Object.freeze(batchOriginate.whitelist);
  const params: WalletParamsWithKind[] = [
    { ...messages, kind: OpKind.SMART_ROLLUP_ADD_MESSAGES },
    { to: address, amount: 1, kind: OpKind.TRANSACTION },
    { ...batchOriginate, kind: OpKind.SMART_ROLLUP_ORIGINATE },
    { ...outbox, kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE },
  ];
  const batch =
    route === 'array'
      ? tezos.wallet.batch(params)
      : tezos.wallet
          .batch()
          .withSmartRollupAddMessages(messages)
          .withTransfer({ to: address, amount: 1 })
          .withSmartRollupOriginate(batchOriginate)
          .withSmartRollupExecuteOutboxMessage(outbox);
  const operation = await batch.send();
  expect(provider.sendOperations).toHaveBeenCalledExactlyOnceWith(params);
  expect(batchOriginate.whitelist).toEqual([
    'tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh',
    'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
  ]);
  await operation.operationResults();
  expect(await operation.status()).toBe('applied');
});

it.each(receiptCases)('$name rejects missing capabilities without submission', async ({ send }) => {
  const { tezos, provider } = setup();
  await expect(send(tezos.wallet)).rejects.toBeInstanceOf(UnsupportedActionError);
  expect(provider.sendOperations).not.toHaveBeenCalled();
});

it.each(['fluent', 'array'])(
  'preserves legacy-only batches through the %s route',
  async (route) => {
    const { tezos, provider, rpc } = setup();
    vi.spyOn(rpc, 'getProtocols').mockResolvedValue({
      protocol: blockResponse.protocol,
      next_protocol: blockResponse.protocol,
    });
    const origination = Object.freeze({
      code: 'parameter unit; storage unit; code { CDR; NIL operation; PAIR }',
      init: 'Unit',
    });
    const ticket = {
      ticketContents: { string: 'ticket' },
      ticketTy: { prim: 'string' },
      ticketTicketer: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
      ticketAmount: 1,
      destination: address,
      entrypoint: 'default',
    };
    const params: WalletParamsWithKind[] = [
      { ...origination, kind: OpKind.ORIGINATION },
      { delegate: address, kind: OpKind.DELEGATION },
      { destination: address, amount: 1, kind: OpKind.INCREASE_PAID_STORAGE },
      { value: { prim: 'Unit' }, kind: OpKind.REGISTER_GLOBAL_CONSTANT },
      { ...ticket, kind: OpKind.TRANSFER_TICKET },
    ];
    const batch =
      route === 'array'
        ? tezos.wallet.batch(params)
        : tezos.wallet
            .batch()
            .withOrigination(origination)
            .withDelegation({ delegate: address })
            .withIncreasePaidStorage({ destination: address, amount: 1 })
            .withRegisterGlobalConstant({ value: { prim: 'Unit' } })
            .withTransferTicket(ticket);
    await batch.send();
    expect(provider.sendOperations).toHaveBeenCalledTimes(1);
    // Parser source-location symbols are not part of the serialized wallet payload.
    const submitted: unknown = JSON.parse(
      JSON.stringify(vi.mocked(provider.sendOperations).mock.calls[0][0])
    );
    expect(submitted).toEqual([
      {
        kind: OpKind.ORIGINATION,
        code: [
          { prim: 'parameter', args: [{ prim: 'unit' }] },
          { prim: 'storage', args: [{ prim: 'unit' }] },
          {
            prim: 'code',
            args: [
              [{ prim: 'CDR' }, { prim: 'NIL', args: [{ prim: 'operation' }] }, { prim: 'PAIR' }],
            ],
          },
        ],
        init: { prim: 'Unit' },
      },
      { delegate: address, kind: OpKind.DELEGATION },
      { destination: address, amount: 1, kind: OpKind.INCREASE_PAID_STORAGE },
      { value: { prim: 'Unit' }, kind: OpKind.REGISTER_GLOBAL_CONSTANT },
      {
        kind: OpKind.TRANSFER_TICKET,
        ticketContents: { string: 'ticket' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
        ticketAmount: 1,
        destination: address,
        entrypoint: 'default',
      },
    ]);
    expect(origination.code).toBe(
      'parameter unit; storage unit; code { CDR; NIL operation; PAIR }'
    );
    expect(origination.init).toBe('Unit');
  }
);

it('waits for each batch mapper before starting the next one', async () => {
  const { tezos, provider } = setup();
  support(provider);
  const gate = new Subject<void>();
  provider.mapTransferParamsToWalletParams = vi.fn(async (get) => {
    await firstValueFrom(gate);
    return { ...(await get()), kind: OpKind.TRANSACTION };
  });
  const pending = tezos.wallet
    .batch()
    .withTransfer({ to: address, amount: 1 })
    .withSmartRollupOriginate(originate)
    .send();
  try {
    expect(provider.mapTransferParamsToWalletParams).toHaveBeenCalledTimes(1);
    expect(provider.mapSmartRollupOriginateParamsToWalletParams).not.toHaveBeenCalled();
    expect(provider.sendOperations).not.toHaveBeenCalled();
  } finally {
    gate.next();
    gate.complete();
    await pending;
  }
  expect(provider.mapSmartRollupOriginateParamsToWalletParams).toHaveBeenCalledTimes(1);
  expect(provider.sendOperations).toHaveBeenCalledTimes(1);
});

it('stops batch mapping on rejection without reading a block or submitting', async () => {
  const { tezos, provider, rpc } = setup();
  support(provider);
  const failure = new Error('batch mapping failed');
  vi.mocked(provider.mapTransferParamsToWalletParams).mockRejectedValue(failure);
  await expect(
    tezos.wallet
      .batch()
      .withTransfer({ to: address, amount: 1 })
      .withSmartRollupOriginate(originate)
      .send()
  ).rejects.toBe(failure);
  expect(provider.mapSmartRollupOriginateParamsToWalletParams).not.toHaveBeenCalled();
  expect(rpc.getBlockHeader).not.toHaveBeenCalled();
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
