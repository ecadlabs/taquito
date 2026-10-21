import { InMemorySigner, type FromMnemonicParams } from '../src/taquito-signer';
import { InvalidCurveError, InvalidMnemonicError, ToBeImplemented } from '../src/errors';
import { InvalidDerivationPathError } from '@taquito/core';
import vectors from '../../../test-fixtures/mnemonic-keys.json';

describe('existing mnemonic signer compatibility', () => {
  it.each(vectors)('preserves the complete key tuple for $label', async ({ params, expected }) => {
    const signer = InMemorySigner.fromMnemonic(params as FromMnemonicParams);
    expect({
      publicKey: await signer.publicKey(),
      publicKeyHash: await signer.publicKeyHash(),
      secretKey: await signer.secretKey(),
    }).toEqual(expected);
  });

  it('keeps invalid mnemonic errors free of the supplied phrase', () => {
    const mnemonic = 'private-invalid-phrase';
    expect(() => InMemorySigner.fromMnemonic({ mnemonic })).toThrow(InvalidMnemonicError);
    try {
      InMemorySigner.fromMnemonic({ mnemonic });
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidMnemonicError);
      expect(JSON.stringify(error)).not.toContain(mnemonic);
      expect(String(error)).not.toContain(mnemonic);
    }
  });

  it('retains rejection of nonhardened Ed25519 paths', () => {
    expect(() =>
      InMemorySigner.fromMnemonic({
        mnemonic: vectors[0].params.mnemonic,
        derivationPath: '44/1729/0/0',
      })
    ).toThrow(InvalidDerivationPathError);
  });
  it('retains unimplemented bip25519 behavior', () => {
    expect(() =>
      InMemorySigner.fromMnemonic({ mnemonic: vectors[0].params.mnemonic, curve: 'bip25519' })
    ).toThrow(ToBeImplemented);
  });
  it('retains unsupported curve errors', () => {
    expect(() =>
      InMemorySigner.fromMnemonic({
        mnemonic: vectors[0].params.mnemonic,
        curve: 'bls' as FromMnemonicParams['curve'],
      })
    ).toThrow(InvalidCurveError);
  });
});
