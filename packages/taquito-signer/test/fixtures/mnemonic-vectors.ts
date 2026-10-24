import type { FromMnemonicParams } from '../../src/taquito-signer';
import vectors from './mnemonic-keys.json';

export default vectors.map(({ params, ...vector }) => {
  const { curve, ...options } = params;
  if (
    curve !== undefined &&
    curve !== 'ed25519' &&
    curve !== 'secp256k1' &&
    curve !== 'p256' &&
    curve !== 'bip25519'
  ) {
    throw new Error(`Invalid mnemonic fixture curve in "${vector.label}"`);
  }
  const parsed: FromMnemonicParams = curve === undefined ? options : { ...options, curve };
  return { ...vector, params: parsed };
});
