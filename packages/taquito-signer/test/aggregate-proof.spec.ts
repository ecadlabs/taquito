import { it, expect } from 'vitest';
import { InMemorySigner } from '../src/taquito-signer';
import { InvalidPublicKeyError } from '@taquito/utils';
import fixtures from '../../../test-fixtures/bls-aggregate-proofs.json';
it.each(fixtures.members)(
  'matches the independent aggregate-key proof for $publicKeyHash',
  async (member) => {
    const signer = new InMemorySigner(member.secretKey);
    const proof = await signer.provePossession(fixtures.aggregate.public_key);
    expect(proof).toEqual({
      prefixSig: member.overrideProof,
      sig: member.overrideProofGeneric,
      rawSignature: Uint8Array.from(Buffer.from(member.overrideProofRawHex, 'hex')),
    });
    expect(proof.prefixSig).not.toBe(member.selfProof);
  }
);
it.each(fixtures.points)('matches Octez compressed point acceptance for $label', async (point) => {
  const signer = new InMemorySigner(fixtures.members[0].secretKey);
  if (point.accepted)
    expect((await signer.provePossession(point.publicKey)).prefixSig).toBe(point.proof);
  else
    await expect(signer.provePossession(point.publicKey)).rejects.toBeInstanceOf(
      InvalidPublicKeyError
    );
});
it.each([
  null,
  42,
  'not-a-key',
  'edpkvJELH15q7a8ShGRsoULGxLQfUQaGahwRTFywCsnWPPdwnmASRH',
  fixtures.aggregate.public_key.slice(0, -1) + '1',
])('rejects invalid JavaScript override %#', async (value) => {
  const signer = new InMemorySigner(fixtures.members[0].secretKey);
  await expect(Reflect.apply(signer.provePossession, signer, [value])).rejects.toBeInstanceOf(
    InvalidPublicKeyError
  );
});
it('does not echo a mistakenly supplied secret key in validation errors', async () => {
  const secret = fixtures.members[0].secretKey;
  const signer = new InMemorySigner(secret);
  const error = await signer.provePossession(secret).catch((error: unknown) => error);
  expect(error).toBeInstanceOf(InvalidPublicKeyError);
  expect(String(error)).not.toContain(secret);
  expect(JSON.stringify(error)).not.toContain(secret);
});
