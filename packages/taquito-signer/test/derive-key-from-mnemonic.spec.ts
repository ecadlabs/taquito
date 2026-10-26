import { deriveKeyFromMnemonic, InvalidMnemonicError, InMemorySigner } from '../src/taquito-signer';
import { InvalidCurveError, ToBeImplemented } from '../src/errors';
import { InvalidDerivationPathError } from '@taquito/core';
import { verifySignature } from '@taquito/utils';
import vectors from './fixtures/mnemonic-vectors';

describe('derived mnemonic key compatibility', () => {
  it.each(vectors)(
    'matches independent and existing signer values for $label',
    async ({ params, expected }) => {
      const result = deriveKeyFromMnemonic(params);
      expect(result).toEqual(expected);
      const signer = InMemorySigner.fromMnemonic(params);
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
  describe.each([
    { name: 'deriveKeyFromMnemonic', derive: deriveKeyFromMnemonic },
    { name: 'InMemorySigner.fromMnemonic', derive: InMemorySigner.fromMnemonic },
  ])('$name error compatibility', ({ derive }) => {
    it('rejects invalid mnemonics without exposing the phrase in error properties', () => {
      const mnemonic = 'never-display-this-invalid-phrase';
      let error: unknown;
      try {
        derive({ mnemonic });
      } catch (caught) {
        error = caught;
      }
      expect(error).toBeInstanceOf(InvalidMnemonicError);
      if (!(error instanceof Error)) throw new Error('Expected a mnemonic error');
      expect(String(error)).not.toContain(mnemonic);
      expect(JSON.stringify(error)).not.toContain(mnemonic);
      const properties = Object.getOwnPropertyNames(error)
        .map((key) => String(Reflect.get(error, key)))
        .join(' ');
      expect(properties).not.toContain(mnemonic);
    });
    it('preserves the rejection of nonhardened Ed25519 paths', () => {
      expect(() =>
        derive({ mnemonic: vectors[0].params.mnemonic, derivationPath: '44/1729/0/0' })
      ).toThrow(InvalidDerivationPathError);
    });
    it('retains the unimplemented bip25519 error', () => {
      expect(() => derive({ mnemonic: vectors[0].params.mnemonic, curve: 'bip25519' })).toThrow(
        ToBeImplemented
      );
    });
    it('rejects unsupported mnemonic curves', () => {
      expect(() =>
        Reflect.apply(derive, undefined, [{ mnemonic: vectors[0].params.mnemonic, curve: 'bls' }])
      ).toThrow(InvalidCurveError);
    });
  });
});
