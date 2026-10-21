import {
  deriveKeyFromMnemonic,
  InMemorySigner,
  type FromMnemonicParams,
} from '../src/taquito-signer';
import { InvalidCurveError, InvalidMnemonicError, ToBeImplemented } from '../src/errors';
import { InvalidDerivationPathError } from '@taquito/core';
import { verifySignature } from '@taquito/utils';
import vectors from '../../../test-fixtures/mnemonic-keys.json';

describe('deriveKeyFromMnemonic', () => {
  it('returns the independent default key tuple', () => {
    expect(deriveKeyFromMnemonic(vectors[0].params)).toEqual(vectors[0].expected);
  });
});

describe('derived mnemonic key compatibility', () => {
  it.each(vectors)(
    'matches independent and existing signer values for $label',
    async ({ params, expected }) => {
      const options = params as FromMnemonicParams;
      const result = deriveKeyFromMnemonic(options);
      expect(result).toEqual(expected);
      const signer = InMemorySigner.fromMnemonic(options);
      expect(result).toEqual({
        publicKey: await signer.publicKey(),
        publicKeyHash: await signer.publicKeyHash(),
        secretKey: await signer.secretKey(),
      });
    }
  );
  it.each(['ed25519', 'secp256k1', 'p256'] as const)(
    'returns usable secret keys for %s',
    async (curve) => {
      const { publicKey, secretKey } = deriveKeyFromMnemonic({
        mnemonic: vectors[0].params.mnemonic,
        curve,
      });
      const signer = await InMemorySigner.fromSecretKey(secretKey);
      const signature = await signer.sign('00010203');
      expect(verifySignature('00010203', publicKey, signature.prefixSig)).toBe(true);
      expect(verifySignature('00010204', publicKey, signature.prefixSig)).toBe(false);
    }
  );
  it('rejects invalid mnemonics without exposing phrase text in error properties', () => {
    const mnemonic = 'never-display-this-invalid-phrase';
    expect(() => deriveKeyFromMnemonic({ mnemonic })).toThrow(InvalidMnemonicError);
    try {
      deriveKeyFromMnemonic({ mnemonic });
    } catch (error) {
      const values = Object.getOwnPropertyNames(error)
        .map((key) => String((error as Record<string, unknown>)[key]))
        .join(' ');
      expect(values).not.toContain(mnemonic);
    }
  });
  it('preserves the rejection of nonhardened Ed25519 paths', () => {
    expect(() =>
      deriveKeyFromMnemonic({ mnemonic: vectors[0].params.mnemonic, derivationPath: '44/1729/0/0' })
    ).toThrow(InvalidDerivationPathError);
  });
  it('retains the unimplemented bip25519 error', () => {
    expect(() =>
      deriveKeyFromMnemonic({ mnemonic: vectors[0].params.mnemonic, curve: 'bip25519' })
    ).toThrow(ToBeImplemented);
  });
  it('rejects unsupported mnemonic curves', () => {
    expect(() =>
      deriveKeyFromMnemonic({
        mnemonic: vectors[0].params.mnemonic,
        curve: 'bls' as FromMnemonicParams['curve'],
      })
    ).toThrow(InvalidCurveError);
  });
});
