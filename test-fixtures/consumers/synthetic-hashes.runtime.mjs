// Runs against the installed packages through require and import (see scripts/test-installed-consumers.mjs).
export default async function ({ assert, load }) {
  const [utilsPkg, corePkg] = await Promise.all(['@taquito/utils', '@taquito/core'].map(load));
  const utils = utilsPkg.default ?? utilsPkg;

  const parentHex = '0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20';
  const parentOperationHash = 'onef1shcAkeuHdHJGckAYjbuzZSg4ZGPMyGxrc1L5RadvNJNNmM';
  const expectedMichelsonOperationHash = 'oon3NRVSUVJUDwBSfeMcXYFVU1GgFghM4ciDQsP8kuvpGrmj4kG';
  const expectedEthereumTransactionHash =
    '0x5e0287136dd2a96e55aad495edcc329afc57df76e896e29c42e1f80d9da7deb4';

  assert.equal(utils.getTezosOperationHash(parentHex), expectedMichelsonOperationHash);
  assert.equal(
    utils.getEthereumTransactionHash(parentOperationHash),
    expectedEthereumTransactionHash
  );
  assert.throws(() => utils.getTezosOperationHash('zz'), corePkg.InvalidHexStringError);
}
