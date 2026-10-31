import { it, expect } from 'vitest';
import { InMemorySigner } from '../src/taquito-signer';
import { ProhibitedActionError } from '@taquito/core';
import fixtures from '../../../test-fixtures/bls-aggregate-proofs.json';
it.each(fixtures.members)(
  'preserves the public self proof and identity for $publicKeyHash',
  async (member) => {
    const signer = new InMemorySigner(member.secretKey);
    const expected = {
      prefixSig: member.selfProof,
      sig: member.selfProofGeneric,
      rawSignature: Uint8Array.from(Buffer.from(member.selfProofRawHex, 'hex')),
    };
    expect(await signer.provePossession()).toEqual(expected);
    expect(await signer.provePossession(undefined)).toEqual(expected);
    expect(await signer.publicKey()).toBe(member.publicKey);
    expect(await signer.publicKeyHash()).toBe(member.publicKeyHash);
    expect(signer.canProvePossession).toBe(true);
  }
);
it('preserves non-BLS rejection and capability reporting', async () => {
  const signer = new InMemorySigner('edsk4TjJWEszkHKono7XMnepVqwi37FrpbVt1KCsifJeAGimxheShG');
  expect(signer.canProvePossession).toBe(false);
  await expect(signer.provePossession()).rejects.toBeInstanceOf(ProhibitedActionError);
  await expect(signer.provePossession(fixtures.aggregate.public_key)).rejects.toBeInstanceOf(ProhibitedActionError);
});
