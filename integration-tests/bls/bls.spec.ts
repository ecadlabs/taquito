import { RpcClient, RpcClientCache } from '../../packages/taquito-rpc/src/taquito-rpc';
import { HttpResponseError } from '@taquito/http-utils';
import { blsFixture } from '../../test-fixtures/bls-rpc';

const endpoint = process.env.TAQUITO_BLS_RPC;
if (!endpoint) throw new Error('Set TAQUITO_BLS_RPC to an Octez node exposing /bls RPCs.');

describe.each(['direct', 'cache decorator'] as const)('BLS RPCs, %s', (kind) => {
  const direct = new RpcClient(endpoint);
  const client = kind === 'direct' ? direct : new RpcClientCache(direct);
  const proof = { public_key: blsFixture.public_key, proof: blsFixture.proof };

  it('checks possession and aggregates a public key', async () => {
    expect(await client.checkProof(proof)).toBe(true);
    expect(await client.aggregatePublicKeys([proof])).toEqual({
      public_key: blsFixture.public_key,
      public_key_hash: blsFixture.public_key_hash,
    });
  });

  it('matches independent Octez aggregation and threshold fixtures', async () => {
    expect(await client.aggregateSignatures(blsFixture.aggregate)).toBe(blsFixture.signature);
    expect(await client.thresholdSignatures(blsFixture.threshold)).toBe(blsFixture.signature);
  });

  it('preserves false proofs and null aggregation results', async () => {
    const invalidProof = { public_key: blsFixture.public_key, proof: blsFixture.signature };
    expect(await client.checkProof(invalidProof)).toBe(false);
    expect(await client.aggregatePublicKeys([invalidProof])).toBeNull();
    expect(
      await client.aggregateSignatures({ ...blsFixture.aggregate, signature_shares: [] })
    ).toBeNull();
    expect(
      await client.thresholdSignatures({ ...blsFixture.threshold, signature_shares: [] })
    ).toBeNull();
  });

  it('preserves a malformed key rejection', async () => {
    await expect(client.checkProof({ ...proof, public_key: 'invalid' })).rejects.toBeInstanceOf(
      HttpResponseError
    );
  });
});
