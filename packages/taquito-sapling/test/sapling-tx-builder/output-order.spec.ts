/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';
import { createHash } from 'node:crypto';
import BigNumber from 'bignumber.js';
import { SaplingTransactionBuilder } from '../../src/sapling-tx-builder/sapling-transactions-builder';
import { SaplingForger } from '../../src/sapling-forger/sapling-forger';
import { SaplingWrapper } from '../../src/sapling-module-wrapper';
import { SaplingToolkit } from '../../src/taquito-sapling';
import { SaplingContractDetails, SaplingTransactionOutput } from '../../src/types';
// Forged-byte hashes from unchanged bbe1ba244356fef92da9fdef2aa212a17c43831c.
// Output descriptions are controlled fixtures. Binding hashes and serialization use real code.
// Regenerate with that revision's builder, never by recording the candidate's current output.
import compatibility from './output-order-compatibility.json';

const address = 'zet12mVvzJ4QJhnNQetGHzdwTMcLgNrdC4SFact6BB5jpeqGAefWip3iGgEjvDA9z7b9Y';
const contract = { contractAddress: 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC', memoSize: 8 };
const boundData = Buffer.from('050a0000001500eca2e9db3e096741601333274d33caefc8a16c5a', 'hex');
const forger = new SaplingForger();

function setup(outputOrder?: SaplingContractDetails['outputOrder']) {
  const random = vi.fn((_length: number) => new Uint8Array(4));
  const signature = vi.fn(async (_context: number, _balance: string, hash: Uint8Array) =>
    Buffer.from(hash)
  );
  const wrapper = {
    randR: vi.fn(async () => Buffer.alloc(32)),
    withProvingContext: async (action: (context: number) => unknown) => action(17),
    getRandomBytes: random,
    createBindingSignature: signature,
  };
  const viewer = {
    getOutgoingViewingKey: async () => Buffer.alloc(32, 4),
    getAddress: async () => ({ address }),
  };
  const keys = { saplingSigner: { getSaplingViewingKeyProvider: async () => viewer } as any };
  const readProvider = { getChainId: async () => 'NetXLH1uAxK7CCh' } as any;
  const builder = new SaplingTransactionBuilder(
    keys,
    forger,
    { ...contract, outputOrder },
    readProvider,
    wrapper as any
  );
  const constructed: SaplingTransactionOutput[] = [];
  vi.spyOn(builder, 'prepareSaplingSpendDescription').mockResolvedValue([]);
  vi.spyOn(builder, 'prepareSaplingOutputDescription').mockImplementation(async (params) => {
    const marker = constructed.length + 1;
    const output = {
      commitment: Buffer.alloc(32, marker),
      proof: Buffer.alloc(192, marker),
      ciphertext: {
        commitmentValue: Buffer.alloc(32, marker),
        ephemeralPublicKey: Buffer.alloc(32, marker),
        payloadEnc: Buffer.from(params.amount + ':' + params.memo),
        nonceEnc: Buffer.alloc(24, marker),
        payloadOut: Buffer.alloc(80, marker),
        nonceOut: Buffer.alloc(24, marker),
      },
    };
    constructed.push(output);
    return output;
  });
  const build = async (kind: 'shield' | 'private', amounts: string[], selected = 0) => {
    const params = amounts.map((amount, i) => ({ to: address, amount, memo: 'memo-' + i }));
    const total = new BigNumber(amounts.reduce((a, b) => a + Number(b), 0));
    return kind === 'shield'
      ? builder.createShieldedTx(params, total, boundData)
      : builder.createSaplingTx(params, total, boundData, {
          inputsToSpend: [],
          sumSelectedInputs: new BigNumber(selected),
        });
  };
  return { builder, build, random, signature, constructed, keys, readProvider };
}

function fingerprint(tx: Awaited<ReturnType<ReturnType<typeof setup>['build']>>) {
  return createHash('sha256')
    .update(
      forger.forgeSaplingTransaction({
        ...tx,
        root: '00'.repeat(32),
        boundData,
      })
    )
    .digest('hex');
}

describe('Sapling output order', () => {
  for (const policy of [undefined, 'preserve'] as const) {
    it.each([
      ['shield', ['2', '3'], 0],
      ['private', ['2', '3'], 9],
      ['private', ['2', '3'], 5],
      ['private', [], 0],
    ] as const)(
      'matches independent preserved-order byte fixtures with %s and policy ' + policy,
      async (kind, amounts, selected) => {
        const { build, random } = setup(policy);
        const tx = await build(kind, [...amounts], selected);
        expect(fingerprint(tx)).toBe(
          compatibility[
            (kind + ':' + amounts.join(',') + ':' + selected) as keyof typeof compatibility
          ]
        );
        expect(random).not.toHaveBeenCalled();
      }
    );
  }

  it.each([
    ['shield', ['2', '3'], 0],
    ['private', ['2', '3'], 9],
  ] as const)(
    'shuffles whole %s outputs before binding the signature',
    async (kind, amounts, selected) => {
      const { build, constructed, random, builder } = setup('randomized');
      const signed = vi.spyOn(builder, 'createBindingSignature');
      const tx = await build(kind, [...amounts], selected);
      expect(tx.outputs).toEqual([...constructed.slice(1), constructed[0]]);
      expect(tx.outputs.every((o) => constructed.includes(o))).toBe(true);
      expect(random).toHaveBeenCalledTimes(constructed.length - 1);
      expect(signed.mock.calls[0][0].outputs).toBe(tx.outputs);
      const expectedSignature = await builder.createBindingSignature({
        saplingContext: 17,
        inputs: tx.inputs,
        outputs: tx.outputs,
        balance: tx.balance,
        boundData,
      });
      expect(tx.signature).toEqual(expectedSignature);
      const wrongOrder = await builder.createBindingSignature({
        saplingContext: 17,
        inputs: tx.inputs,
        outputs: constructed,
        balance: tx.balance,
        boundData,
      });
      expect(tx.signature).not.toEqual(wrongOrder);
      expect(tx.balance.toFixed()).toBe(kind === 'shield' ? '-5' : '0');
    }
  );

  it.each([
    ['shield', [], 0],
    ['shield', ['2'], 0],
    ['private', [], 0],
    ['private', ['2'], 2],
    ['private', [], 2],
  ] as const)(
    'does not request order entropy for 0/1 %s outputs',
    async (kind, amounts, selected) => {
      const { build, random, constructed } = setup('randomized');
      const tx = await build(kind, [...amounts], selected);
      expect(tx.outputs).toEqual(constructed);
      expect(random).not.toHaveBeenCalled();
    }
  );

  it.each(['shuffle', '', null, false, 0])('rejects invalid runtime policy %s', (policy) => {
    expect(() => setup(policy as any)).toThrow('Unknown Sapling output order');
  });

  it.each(['shield', 'private'] as const)(
    'fails before creating the binding signature if %s order entropy fails',
    async (kind) => {
      const { build, random, signature } = setup('randomized');
      random.mockImplementation(() => {
        throw new Error('entropy unavailable');
      });
      await expect(build(kind, ['2', '3'], 9)).rejects.toThrow('entropy unavailable');
      expect(signature).not.toHaveBeenCalled();
    }
  );

  it('accepts the public toolkit constructor option and rejects an invalid option', () => {
    const { keys, readProvider } = setup();
    for (const outputOrder of [undefined, 'preserve', 'randomized'] as const) {
      expect(new SaplingToolkit(keys, { ...contract, outputOrder }, readProvider)).toBeInstanceOf(
        SaplingToolkit
      );
    }
    expect(
      () => new SaplingToolkit(keys, { ...contract, outputOrder: 'invalid' as any }, readProvider)
    ).toThrow('Unknown Sapling output order');
  });

  it.each([undefined, 'preserve', 'randomized', 'builder-owned'] as const)(
    'uses a supplied builder without changing its signed outputs with policy %s',
    async (outputOrder) => {
      const custom = setup();
      const transaction = await custom.build('shield', ['2', '3']);
      const createShieldedTx = vi.spyOn(custom.builder, 'createShieldedTx');
      createShieldedTx.mockResolvedValue(transaction);
      const customForger = new SaplingForger();
      const forge = vi.spyOn(customForger, 'forgeSaplingTransaction');
      const readProvider = {
        getSaplingDiffByContract: vi.fn().mockResolvedValue({ root: '00'.repeat(32) }),
      };
      const toolkit = new SaplingToolkit(
        custom.keys,
        // A supplied builder owns validation, including untyped JavaScript calls.
        { ...contract, outputOrder: outputOrder as any },
        readProvider as any,
        undefined,
        customForger,
        custom.builder
      );
      const random = vi.fn(() => {
        throw new Error('No toolkit ordering entropy expected for a supplied builder');
      });
      vi.stubGlobal('crypto', { getRandomValues: random });
      try {
        const encoded = await toolkit.prepareShieldedTransaction([
          { to: address, amount: 2, mutez: true, memo: 'first' },
          { to: address, amount: 3, mutez: true, memo: 'second' },
        ]);
        expect(createShieldedTx).toHaveBeenCalledOnce();
        expect(createShieldedTx.mock.calls[0][0]).toEqual([
          { to: address, amount: '2', memo: 'first' },
          { to: address, amount: '3', memo: 'second' },
        ]);
        expect(forge).toHaveBeenCalledOnce();
        expect(forge.mock.calls[0][0].outputs).toBe(transaction.outputs);
        expect(forge.mock.calls[0][0].signature).toBe(transaction.signature);
        expect(encoded).toBe(forge.mock.results[0].value.toString('hex'));
        expect(random).not.toHaveBeenCalled();
      } finally {
        vi.unstubAllGlobals();
      }
    }
  );

  it('uses the secure platform provider and fails when it is unavailable', () => {
    const getRandomValues = vi.fn((bytes: Uint8Array) => {
      bytes.fill(123);
      return bytes;
    });
    vi.stubGlobal('crypto', { getRandomValues });
    try {
      expect(new SaplingWrapper().getRandomBytes(4)).toEqual(new Uint8Array([123, 123, 123, 123]));
      expect(getRandomValues).toHaveBeenCalledOnce();
      vi.stubGlobal('crypto', undefined);
      expect(() => new SaplingWrapper().getRandomBytes(4)).toThrow(
        'globalThis.crypto.getRandomValues'
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
