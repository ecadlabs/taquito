import { Signer } from '@taquito/core';
import { ParameterSchema } from '@taquito/michelson-encoder';
import { OpKind, PvmKind } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { Context } from '../../src/context';
import { ContractMethodObject } from '../../src/contract/contract-methods/contract-method-object-param';
import { PreparedOperation } from '../../src/prepare';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe('PrepareProvider concurrent counter allocation', () => {
  const source = 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM';
  const destination = 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn';
  let context: Context;

  beforeEach(() => {
    context = new Context('http://example.test', {
      publicKeyHash: async () => source,
      publicKey: async () => 'test_pub_key',
      secretKey: vi.fn<Signer['secretKey']>(),
      sign: vi.fn<Signer['sign']>(),
    });
    vi.spyOn(context.readProvider, 'getBlockHash').mockResolvedValue('test_block_hash');
    vi.spyOn(context.readProvider, 'getNextProtocol').mockResolvedValue('test_protocol');
    vi.spyOn(context.readProvider, 'getCounter').mockResolvedValue('155');
    vi.spyOn(context.readProvider, 'isAccountRevealed').mockResolvedValue(true);
    vi.spyOn(context.readProvider, 'getProtocolConstants').mockResolvedValue({
      hard_gas_limit_per_operation: new BigNumber(1040000),
      hard_gas_limit_per_block: new BigNumber(5200000),
      hard_storage_limit_per_operation: new BigNumber(60000),
      cost_per_byte: new BigNumber(250),
      smart_rollup_origination_size: 6314,
    });
    vi.spyOn(context.rpc, 'getMempoolFilter').mockRejectedValue(new Error('Endpoint unavailable'));
  });

  async function overlapPreparations(
    first: () => Promise<PreparedOperation>,
    second: () => Promise<PreparedOperation>,
    resolveSecondFirst: boolean,
    firstCounter = '155',
    secondCounter = '155'
  ) {
    const firstRead = deferred<string>();
    const secondRead = deferred<string>();
    const firstStarted = deferred<void>();
    const secondStarted = deferred<void>();
    vi.mocked(context.readProvider.getCounter)
      .mockImplementationOnce(() => {
        firstStarted.resolve();
        return firstRead.promise;
      })
      .mockImplementationOnce(() => {
        secondStarted.resolve();
        return secondRead.promise;
      });

    // Head reads must proceed independently, even while another preparation's read is pending.
    // Hold both reads before allowing either preparation to allocate counters.
    const firstPreparation = first();
    await firstStarted.promise;
    const secondPreparation = second();
    await secondStarted.promise;

    if (resolveSecondFirst) {
      secondRead.resolve(secondCounter);
      await secondPreparation;
      firstRead.resolve(firstCounter);
    } else {
      firstRead.resolve(firstCounter);
      secondRead.resolve(secondCounter);
    }

    return Promise.all([firstPreparation, secondPreparation]);
  }

  describe.each([false, true])(
    'complete the second preparation before releasing the first: %s',
    (resolveSecondFirst) => {
      it('starts independent transfers at the same next counter', async () => {
        const prepared = await overlapPreparations(
          () => context.prepare.transaction({ to: destination, amount: 1 }),
          () => context.prepare.transaction({ to: destination, amount: 2 }),
          resolveSecondFirst
        );

        expect(prepared.map((operation) => operation.opOb.contents)).toMatchObject([
          [{ kind: OpKind.TRANSACTION, source, counter: '156', amount: '1000000' }],
          [{ kind: OpKind.TRANSACTION, source, counter: '156', amount: '2000000' }],
        ]);
        expect(prepared.map((operation) => operation.counter)).toEqual([155, 155]);
      });

      it('allocates consecutive counters within each batch including its automatic reveal', async () => {
        vi.mocked(context.readProvider.isAccountRevealed).mockResolvedValue(false);
        const prepared = await overlapPreparations(
          () =>
            context.prepare.batch([
              { kind: OpKind.TRANSACTION, to: destination, amount: 1 },
              { kind: OpKind.DELEGATION, delegate: destination },
            ]),
          () =>
            context.prepare.batch([
              { kind: OpKind.TRANSACTION, to: destination, amount: 2 },
              { kind: OpKind.TRANSACTION, to: destination, amount: 3 },
            ]),
          resolveSecondFirst
        );

        expect(prepared.map((operation) => operation.opOb.contents)).toMatchObject([
          [
            { kind: OpKind.REVEAL, source, counter: '156' },
            { kind: OpKind.TRANSACTION, source, counter: '157', amount: '1000000' },
            { kind: OpKind.DELEGATION, source, counter: '158', delegate: destination },
          ],
          [
            { kind: OpKind.REVEAL, source, counter: '156' },
            { kind: OpKind.TRANSACTION, source, counter: '157', amount: '2000000' },
            { kind: OpKind.TRANSACTION, source, counter: '158', amount: '3000000' },
          ],
        ]);
        expect(prepared.map((operation) => operation.counter)).toEqual([155, 155]);
      });

      it('isolates contract calls that await protocol constants after reading the head counter', async () => {
        const method = new ContractMethodObject(
          context.contract,
          'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
          new ParameterSchema({ prim: 'unit' }),
          'default'
        );
        // Releasing both reads together also catches a shared reset moved past the head await:
        // contractCall still awaits protocol constants before allocating its counters.
        const prepared = await overlapPreparations(
          () => context.prepare.contractCall(method),
          () => context.prepare.contractCall(method),
          resolveSecondFirst
        );

        for (const operation of prepared) {
          expect(operation.opOb.contents).toMatchObject([
            { kind: OpKind.TRANSACTION, source, counter: '156' },
          ]);
        }
        expect(prepared.map((operation) => operation.counter)).toEqual([155, 155]);
      });
    }
  );

  it.each([
    {
      name: 'reveal',
      kind: OpKind.REVEAL,
      prepare: () => context.prepare.reveal({}),
    },
    {
      name: 'originate',
      kind: OpKind.ORIGINATION,
      prepare: () =>
        context.prepare.originate({
          code: 'parameter unit; storage unit; code { CDR; NIL operation; PAIR }',
          init: 'Unit',
        }),
    },
    {
      name: 'stake',
      kind: OpKind.TRANSACTION,
      prepare: () => context.prepare.stake({ amount: 1 }),
    },
    {
      name: 'unstake',
      kind: OpKind.TRANSACTION,
      prepare: () => context.prepare.unstake({ amount: 1 }),
    },
    {
      name: 'finalizeUnstake',
      kind: OpKind.TRANSACTION,
      prepare: () => context.prepare.finalizeUnstake({}),
    },
    {
      name: 'delegation',
      kind: OpKind.DELEGATION,
      prepare: () => context.prepare.delegation({ delegate: destination }),
    },
    {
      name: 'registerDelegate',
      kind: OpKind.DELEGATION,
      prepare: () => context.prepare.registerDelegate({}),
    },
    {
      name: 'registerGlobalConstant',
      kind: OpKind.REGISTER_GLOBAL_CONSTANT,
      prepare: () => context.prepare.registerGlobalConstant({ value: { int: '1' } }),
    },
    {
      name: 'increasePaidStorage',
      kind: OpKind.INCREASE_PAID_STORAGE,
      prepare: () =>
        context.prepare.increasePaidStorage({
          amount: 1,
          destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        }),
    },
    {
      name: 'transferTicket',
      kind: OpKind.TRANSFER_TICKET,
      prepare: () =>
        context.prepare.transferTicket({
          ticketContents: { string: 'ticket' },
          ticketTy: { prim: 'string' },
          ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
          ticketAmount: 1,
          destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
          entrypoint: 'default',
        }),
    },
    {
      name: 'updateConsensusKey',
      kind: OpKind.UPDATE_CONSENSUS_KEY,
      prepare: () =>
        context.prepare.updateConsensusKey({
          pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
        }),
    },
    {
      name: 'updateCompanionKey',
      kind: OpKind.UPDATE_COMPANION_KEY,
      prepare: () =>
        context.prepare.updateCompanionKey({
          pk: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
          proof:
            'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
        }),
    },
    {
      name: 'smartRollupAddMessages',
      kind: OpKind.SMART_ROLLUP_ADD_MESSAGES,
      prepare: () => context.prepare.smartRollupAddMessages({ message: ['00'] }),
    },
    {
      name: 'smartRollupOriginate',
      kind: OpKind.SMART_ROLLUP_ORIGINATE,
      prepare: () =>
        context.prepare.smartRollupOriginate({
          pvmKind: PvmKind.WASM2,
          kernel: '00',
          parametersType: { prim: 'bytes' },
        }),
    },
    {
      name: 'smartRollupExecuteOutboxMessage',
      kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
      prepare: () =>
        context.prepare.smartRollupExecuteOutboxMessage({
          rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
          cementedCommitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
          outputProof: '00',
        }),
    },
  ])('isolates concurrent $name preparations', async ({ prepare, kind }) => {
    const prepared = await overlapPreparations(prepare, prepare, false);

    for (const operation of prepared) {
      expect(operation.opOb.contents).toMatchObject([{ kind, source, counter: '156' }]);
    }
    expect(prepared.map((operation) => operation.counter)).toEqual([155, 155]);
  });

  it("uses each preparation's own head counter when a newer read resolves first", async () => {
    const prepared = await overlapPreparations(
      () => context.prepare.transaction({ to: destination, amount: 1 }),
      () => context.prepare.transaction({ to: destination, amount: 2 }),
      true,
      '155',
      '205'
    );

    expect(prepared.map((operation) => operation.opOb.contents)).toMatchObject([
      [{ kind: OpKind.TRANSACTION, counter: '156' }],
      [{ kind: OpKind.TRANSACTION, counter: '206' }],
    ]);
    expect(prepared.map((operation) => operation.counter)).toEqual([155, 205]);
  });

  it('does not carry allocations into a later preparation', async () => {
    vi.mocked(context.readProvider.getCounter)
      .mockResolvedValueOnce('155')
      .mockResolvedValueOnce('155');
    const first = await context.prepare.batch([
      { kind: OpKind.TRANSACTION, to: destination, amount: 1 },
      { kind: OpKind.TRANSACTION, to: destination, amount: 2 },
    ]);
    const second = await context.prepare.transaction({ to: destination, amount: 3 });

    expect(first.opOb.contents).toMatchObject([{ counter: '156' }, { counter: '157' }]);
    expect(second.opOb.contents).toMatchObject([{ counter: '156' }]);
  });

  it('does not allocate manager counters to an activation in a batch', async () => {
    const prepared = await context.prepare.batch([
      { kind: OpKind.ACTIVATION, pkh: destination, secret: '123' },
      { kind: OpKind.TRANSACTION, to: destination, amount: 1 },
      { kind: OpKind.TRANSACTION, to: destination, amount: 2 },
    ]);

    expect(prepared.opOb.contents).toMatchObject([
      { kind: OpKind.ACTIVATION },
      { kind: OpKind.TRANSACTION, counter: '156' },
      { kind: OpKind.TRANSACTION, counter: '157' },
    ]);
    expect(prepared.opOb.contents[0]).not.toHaveProperty('counter');
  });
});
