import { describe, expect, it, vi } from 'vitest';
import { SaplingForger, SaplingTransactionBuilder } from '../../src/taquito-sapling';
import { saplingState } from './single-sapling-state-diff';

const POOL = 'KT1GFkBEDZtngCS737gNgtt6LemG2a8kaifC';
const SPENDER = 'zet12mVvzJ4QJhnNQetGHzdwTMcLgNrdC4SFact6BB5jpeqGAefWip3iGgEjvDA9z7b9Y';
const RELAYER = 'zet13JTYHFem23nK34x9AXg7rWRSKXXixCRZwN8Wd9q2HkWZiW5GjqHfvT53WFPHMZszM';

const bytes = (length: number, fill: number) => new Uint8Array(length).fill(fill);

// Fake wasm boundary; withProvingContext runs the builder's real output and balance code.
const fakeWasm = () => ({
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
});

const spendingKey = {
  getSaplingViewingKeyProvider: async () => ({
    getOutgoingViewingKey: async () => bytes(32, 11),
    getAddress: async () => ({ address: SPENDER, addressIndex: 0 }),
  }),
};

const builder = () =>
  new SaplingTransactionBuilder(
    { saplingSigner: spendingKey as never },
    new SaplingForger(),
    { contractAddress: POOL, memoSize: 8 },
    {
      getChainId: async () => 'NetXsqzbfFenSTS',
      // A recorded pool state; nothing is spent from it.
      getSaplingDiffByContract: async () => saplingState,
    } as never,
    fakeWasm() as never
  );

// No notes are spent here, so no spend proof runs; the selected total stands in for the inputs.
const selected = { inputsToSpend: [], sumSelectedInputs: '5100000' };
const fee = { to: RELAYER, amount: '50000', memo: 'fee' };

// Balance arithmetic only: proofs and signatures are faked and no note is spent, so this does not
// show that a pool accepts the transaction.
describe('createSaplingTx withdrawal with extra shielded outputs', () => {
  it('withdraws txTotalAmount minus the outputs', async () => {
    const tx = await builder().createSaplingTx([fee], '5050000', new Uint8Array(), selected);
    // fee output + change of 5,100,000 - 5,050,000
    expect(tx.outputs).toHaveLength(2);
    expect(tx.balance.toFixed()).toBe('5000000');
  });

  it('withdraws less by the outputs when txTotalAmount is only the withdrawal', async () => {
    const tx = await builder().createSaplingTx([fee], '5000000', new Uint8Array(), selected);
    expect(tx.balance.toFixed()).toBe('4950000');
  });
});
