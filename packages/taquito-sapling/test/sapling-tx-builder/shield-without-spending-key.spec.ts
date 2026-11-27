import { describe, expect, it, vi } from 'vitest';
import {
  SaplingForger,
  SaplingTransactionBuilder,
  SpendingKeyRequiredError,
} from '../../src/taquito-sapling';

const POOL = 'KT1GFkBEDZtngCS737gNgtt6LemG2a8kaifC';
const RECIPIENT = 'zet12mVvzJ4QJhnNQetGHzdwTMcLgNrdC4SFact6BB5jpeqGAefWip3iGgEjvDA9z7b9Y';

const bytes = (length: number, fill: number) => new Uint8Array(length).fill(fill);

// Deterministic stand-in for the wasm boundary. withProvingContext runs the callback for real,
// so the builder's own output-description, encryption and binding-signature code executes.
function fakeWasm() {
  const wasm = {
    withProvingContext: vi.fn(async <T>(callback: (context: number) => Promise<T>) => callback(7)),
    randR: vi.fn(async () => bytes(32, 1)),
    getRandomBytes: vi.fn((length: number) => bytes(length, 2)),
    preparePartialOutputDescription: vi.fn(async () => ({
      commitmentValue: bytes(32, 3),
      commitment: bytes(32, 4),
      proof: bytes(192, 5),
    })),
    getDiversifiedFromRawPaymentAddress: vi.fn(async () => bytes(11, 6)),
    deriveEphemeralPublicKey: vi.fn(async () => bytes(32, 7)),
    getPkdFromRawPaymentAddress: vi.fn(async () => bytes(32, 8)),
    keyAgreement: vi.fn(async () => bytes(32, 9)),
    createBindingSignature: vi.fn(async () => bytes(64, 10)),
  };
  return wasm;
}

function readProvider() {
  return {
    getChainId: vi.fn(async () => 'NetXsqzbfFenSTS'),
    getSaplingDiffByContract: vi.fn(),
    getSaplingDiffById: vi.fn(),
  };
}

// A key that fails the test if the builder reads anything from it.
const untouchableKey = new Proxy(
  {},
  {
    get(_target, property) {
      throw new Error(`shielding read spendingKey.${String(property)}`);
    },
  }
);

describe('SaplingTransactionBuilder without a spending key', () => {
  it('shields to a payment address with no key at all', async () => {
    const wasm = fakeWasm();
    const builder = new SaplingTransactionBuilder(
      {},
      new SaplingForger(),
      { contractAddress: POOL, memoSize: 8 },
      readProvider() as never,
      wasm as never
    );

    const tx = await builder.createShieldedTx(
      [{ to: RECIPIENT, amount: '1000000', memo: 'gift' }],
      '1000000',
      new Uint8Array()
    );

    expect(tx.inputs).toEqual([]);
    expect(tx.outputs).toHaveLength(1);
    expect(tx.outputs[0].commitment).toEqual(bytes(32, 4));
    expect(tx.balance.toFixed()).toBe('-1000000');
    expect(tx.signature).toEqual(bytes(64, 10));
    expect(wasm.withProvingContext).toHaveBeenCalledTimes(1);
    expect(wasm.createBindingSignature).toHaveBeenCalledWith(7, '-1000000', expect.any(Uint8Array));
  });

  it('never reads a spending key while shielding', async () => {
    const builder = new SaplingTransactionBuilder(
      { saplingSigner: untouchableKey as never },
      new SaplingForger(),
      { contractAddress: POOL, memoSize: 8 },
      readProvider() as never,
      fakeWasm() as never
    );

    await expect(
      builder.createShieldedTx(
        [{ to: RECIPIENT, amount: '1000000', memo: '' }],
        '1000000',
        new Uint8Array()
      )
    ).resolves.toMatchObject({ inputs: [] });
  });

  it('refuses to spend without a key before any proving work starts', async () => {
    const wasm = fakeWasm();
    const builder = new SaplingTransactionBuilder(
      {},
      new SaplingForger(),
      { contractAddress: POOL, memoSize: 8 },
      readProvider() as never,
      wasm as never
    );

    await expect(
      builder.createSaplingTx(
        [{ to: RECIPIENT, amount: '1000000', memo: '' }],
        '1000000',
        new Uint8Array(),
        { inputsToSpend: [], sumSelectedInputs: '1000000' }
      )
    ).rejects.toBeInstanceOf(SpendingKeyRequiredError);
    expect(wasm.randR).not.toHaveBeenCalled();
    expect(wasm.withProvingContext).not.toHaveBeenCalled();
  });

  it('refuses a direct spend description call without a key before reading the pool', async () => {
    const wasm = fakeWasm();
    const reads = readProvider();
    const builder = new SaplingTransactionBuilder(
      {},
      new SaplingForger(),
      { contractAddress: POOL, memoSize: 8 },
      reads as never,
      wasm as never
    );

    await expect(builder.prepareSaplingSpendDescription(7, [])).rejects.toBeInstanceOf(
      SpendingKeyRequiredError
    );
    expect(wasm.randR).not.toHaveBeenCalled();
    expect(reads.getSaplingDiffByContract).not.toHaveBeenCalled();
    expect(reads.getSaplingDiffById).not.toHaveBeenCalled();
  });
});
