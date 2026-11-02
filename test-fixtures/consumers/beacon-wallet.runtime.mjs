import { createRequire } from 'node:module';

// Import installed packages with Node's default globals, without a DOM shim.
export default async function ({ assert, load }) {
  assert.equal(typeof globalThis.window, 'undefined');
  const require = createRequire(import.meta.url);
  for (const name of ['@taquito/beacon-wallet', '@taquito/beacon-wallet/types']) {
    const commonjs = require(name);
    const loaded = await load(name);
    for (const key of Object.keys(commonjs)) {
      assert.equal(loaded[key], commonjs[key], `${name} changed named export ${key}`);
    }
  }
  const { BeaconWallet } = await load('@taquito/beacon-wallet');
  const { NetworkType, SigningType } = await load('@taquito/beacon-wallet/types');
  assert.equal(typeof BeaconWallet, 'function');
  assert.equal(NetworkType.MAINNET, 'mainnet');
  assert.equal(SigningType.RAW, 'raw');
}
