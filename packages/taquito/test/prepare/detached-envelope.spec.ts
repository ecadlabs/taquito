import { b58Encode, b58DecodeAndCheckPrefix, PrefixV2 } from '@taquito/utils';
import { TezosToolkit } from '../../src/taquito';
import { LocalForger } from '@taquito/local-forging';
import { PreparedOperation } from '../../src/prepare';
import vectors from './detached-operation-vectors';

describe('detached operation envelopes', () => {
  for (const vector of vectors.vectors) {
    it(`matches Octez ${vector.scheme} ${vector.operationKind}`, async () => {
      const tezos = new TezosToolkit('http://unused.invalid');
      tezos.setForgerProvider(new LocalForger());
      const workflow = tezos.prepareFor(vector);
      const prepared: PreparedOperation = structuredClone({
        opOb: { ...vector.operation, protocol: vector.protocol },
        counter: 0,
      });
      const signable = await workflow.toSignable(prepared);
      expect(signable.unsignedBytes).toBe(vector.unsignedBytes);
      expect(signable.watermarkedBytes).toBe(vector.watermarkedBytes);
      expect(signable.blake2bDigest).toBe(vector.blake2bDigest);
      expect(workflow.attachSignature(signable, vector.signature).signedBytes).toBe(
        vector.signedBytes
      );
    });
  }

  const vector = vectors.vectors[0];
  function setup() {
    const tezos = new TezosToolkit('http://unused.invalid');
    tezos.setForgerProvider(new LocalForger());
    const workflow = tezos.prepareFor(vector);
    const prepared: PreparedOperation = structuredClone({
      opOb: { ...vector.operation, protocol: vector.protocol },
      counter: 0,
    });
    return { tezos, workflow, prepared };
  }
  it('rejects foreign and copied signable objects', async () => {
    const { tezos, workflow, prepared } = setup();
    const signable = await workflow.toSignable(prepared);
    expect(() => tezos.prepareFor(vector).attachSignature(signable, vector.signature)).toThrow(
      'another'
    );
    expect(() => workflow.attachSignature({ ...signable }, vector.signature)).toThrow('another');
  });
  it('rejects a wrong scheme and a signature over different bytes', async () => {
    const { workflow, prepared } = setup();
    const signable = await workflow.toSignable(prepared);
    expect(() => workflow.attachSignature(signable, vectors.vectors[3].signature)).toThrow();
    expect(() => workflow.attachSignature(signable, vectors.vectors[1].signature)).toThrow('match');
  });
  it('copies prepared data before an asynchronous custom forger runs', async () => {
    const { tezos, prepared } = setup();
    let release: () => void = () => {
      throw new Error('Gate not initialized');
    };
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    tezos.setForgerProvider({
      forge: async (params) => {
        await gate;
        const bytes = await new LocalForger().forge(params);
        params.contents.length = 0;
        return bytes;
      },
    });
    const workflow = tezos.prepareFor(vector);
    const pending = workflow.toSignable(prepared);
    prepared.opOb.contents.length = 0;
    release();
    const signable = await pending;
    expect(signable.unsignedBytes).toBe(vector.unsignedBytes);
    expect(Object.isFrozen(signable)).toBe(true);
    expect(workflow.attachSignature(signable, vector.signature).signedBytes).toBe(
      vector.signedBytes
    );
  });
  it('rejects mixed sources, empty contents and nonmanager contents', async () => {
    for (const contents of [
      [],
      [{ kind: 'ballot' }],
      [{ ...vector.operation.contents[0], source: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' }],
    ]) {
      const { workflow, prepared } = setup();
      // Exercise values supplied by an untyped JavaScript caller.
      prepared.opOb.contents = JSON.parse(JSON.stringify(contents));
      await expect(workflow.toSignable(prepared)).rejects.toThrow();
    }
  });
  it('rejects invalid BLS proof and per-call proof overrides', () => {
    const bls = vectors.vectors.find((item) => item.scheme === 'bls');
    if (!bls || !('proof' in bls)) throw new Error('Missing BLS fixture');
    const tezos = new TezosToolkit('http://unused.invalid');
    expect(() => tezos.prepareFor({ ...bls, proof: bls.signature })).toThrow('proof');
    const workflow = tezos.prepareFor(bls);
    expect(() => workflow.prepare.reveal({ proof: bls.signature })).toThrow('differs');
    expect(() => workflow.estimate.reveal({ proof: bls.signature })).toThrow('differs');
  });

  for (const genericVector of vectors.vectors.filter(
    (item) =>
      ['ed25519', 'secp256k1', 'p256'].includes(item.scheme) && item.operationKind === 'transaction'
  )) {
    it(`accepts generic sig for ${genericVector.scheme}`, async () => {
      const tezos = new TezosToolkit('http://unused.invalid');
      tezos.setForgerProvider(new LocalForger());
      const workflow = tezos.prepareFor(genericVector);
      const signable = await workflow.toSignable({
        opOb: { ...genericVector.operation, protocol: genericVector.protocol },
        counter: 0,
      });
      const [signature] = b58DecodeAndCheckPrefix(genericVector.signature);
      expect(
        workflow.attachSignature(signable, b58Encode(signature, PrefixV2.GenericSignature))
          .signedBytes
      ).toBe(genericVector.signedBytes);
    });
  }
  it('rejects a malformed signature before submission', async () => {
    const { workflow, prepared } = setup();
    const signable = await workflow.toSignable(prepared);
    for (const signature of ['', 'edsig-invalid', vector.signature.slice(0, -1)]) {
      expect(() => workflow.attachSignature(signable, signature)).toThrow();
    }
  });
  it.each(['cycle', 'accessor', 'prototype', 'nonfinite'])(
    'rejects %s data before forging',
    async (kind) => {
      const { tezos, prepared } = setup();
      const forge = vi.fn(async () => vector.unsignedBytes);
      tezos.setForgerProvider({ forge });
      const workflow = tezos.prepareFor(vector);
      if (kind === 'cycle') Object.assign(prepared, { counter: prepared });
      if (kind === 'accessor')
        Object.defineProperty(prepared.opOb, 'branch', {
          get() {
            throw new Error('Getter executed');
          },
        });
      if (kind === 'prototype') Object.setPrototypeOf(prepared.opOb, { inherited: true });
      if (kind === 'nonfinite') prepared.counter = Infinity;
      await expect(workflow.toSignable(prepared)).rejects.toThrow(/Operation must contain/);
      expect(forge).not.toHaveBeenCalled();
    }
  );
  it.each(['', 'abc', 'not-hex'])('rejects invalid custom-forger bytes %s', async (bytes) => {
    const { tezos, prepared } = setup();
    tezos.setForgerProvider({ forge: async () => bytes });
    await expect(tezos.prepareFor(vector).toSignable(prepared)).rejects.toThrow(
      'invalid operation bytes'
    );
  });
  it('rejects a reveal with a different public key before forging', async () => {
    const reveal = vectors.vectors.find((item) => item.operationKind === 'reveal');
    if (!reveal) throw new Error('Missing reveal fixture');
    const { tezos } = setup();
    const forge = vi.fn(async () => vector.unsignedBytes);
    tezos.setForgerProvider({ forge });
    const workflow = tezos.prepareFor(vector);
    const input: PreparedOperation = structuredClone({
      opOb: { ...reveal.operation, protocol: reveal.protocol },
      counter: 0,
    });
    for (const content of input.opOb.contents) {
      if (content.kind === 'reveal') content.public_key = 'wrong-public-key';
    }
    await expect(workflow.toSignable(input)).rejects.toThrow('Reveal key differs');
    expect(forge).not.toHaveBeenCalled();
  });
  it('rejects a prepared operation without its source', async () => {
    const { workflow, prepared } = setup();
    for (const content of prepared.opOb.contents) Reflect.deleteProperty(content, 'source');
    await expect(workflow.toSignable(prepared)).rejects.toThrow('Operation source differs');
  });
  it('rejects a BLS reveal snapshot missing the validated identity proof', async () => {
    const bls = vectors.vectors.find(
      (item) => item.scheme === 'bls' && item.operationKind === 'reveal'
    );
    if (!bls) throw new Error('Missing BLS reveal fixture');
    const { tezos } = setup();
    const input: PreparedOperation = structuredClone({
      opOb: { ...bls.operation, protocol: bls.protocol },
      counter: 0,
    });
    for (const content of input.opOb.contents) Reflect.deleteProperty(content, 'proof');
    await expect(tezos.prepareFor(bls).toSignable(input)).rejects.toThrow(
      'Reveal must contain the identity proof'
    );
  });
});
