// Runs against the installed packages through require and import (see scripts/test-installed-consumers.mjs).
export default async function ({ assert, load }) {
  const [signerPkg, rpcPkg, corePkg] = await Promise.all(
    ['@taquito/signer', '@taquito/rpc', '@taquito/core'].map(load)
  );
  const secretKey = 'BLsk2jjZe6wQH9TwtBzJwL7xLePfEgUxsV6BfwDP8dGfsosgnekSgC';
  const aggregatePublicKey =
    'BLpk1nGsPWudaiPFkzo7iZRGrbbFSH5RD9PXXzNKajKmBGKcGHUaZxKBSibQbYUW1Swo3VbuuNC8';
  const expectedOverrideProof =
    'BLsig9qErEnSP3AMZXnXfY85YdhJmW91xq5QsqWJBbFW3t8YFzHbGhsbfEfEuEFL7UPGWFh9Nmai2TomRZiKv8vkhwvk8kDhtAUV5qVNTiSwWNzWFEuLjxGp3bKhKPW3mFzmh93w4Fvrg9';

  const signer = new signerPkg.InMemorySigner(secretKey);
  assert.equal((await signer.provePossession(aggregatePublicKey)).prefixSig, expectedOverrideProof);

  const rpc = new rpcPkg.RpcClient('https://rpc.invalid');
  assert.equal(typeof rpc.aggregateProofs, 'function');
  Object.defineProperty(rpc, 'aggregateProofs', { value: undefined });
  await assert.rejects(
    new rpcPkg.RpcClientCache(rpc).aggregateProofs({
      public_key: aggregatePublicKey,
      proofs: [],
    }),
    corePkg.UnsupportedActionError
  );
}
