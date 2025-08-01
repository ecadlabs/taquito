import { b58Encode, Prefix } from '@taquito/utils';
import { PrivateKey as PrivateKeyEd } from './derivation-tools/ed25519';
import { PrivateKey as PrivateKeyEc } from './derivation-tools/ecdsa';
import { Path } from './derivation-tools';
import { InvalidCurveError, ToBeImplemented } from './errors';

export type Curves = 'ed25519' | 'secp256k1' | 'p256' | 'bip25519';

// bip32 when supported add to @param curve bip25519
/**
 *
 * @param seed bip39.mnemonicToSeed
 * @param derivationPath Tezos Requirement 44'/1729' for HD key address default 44'/1729'/0'/0'
 * @param curve 'ed25519' | 'secp256k1' | 'p256''
 * @returns final Derivation of HD keys tezos Secret key
 * @throws {@link InvalidCurveError} | {@link ToBeImplemented}
 */
export const generateSecretKey = (seed: Uint8Array, derivationPath: string, curve: Curves) => {
  const path = Path.fromString(derivationPath);
  let node: PrivateKeyEc | PrivateKeyEd;

  switch (curve) {
    case 'ed25519': {
      node = PrivateKeyEd.fromSeed(seed).derivePath(path);
      const sk = b58Encode(node.seed().slice(0, 32), Prefix.Ed25519Seed);
      return sk;
    }
    case 'secp256k1':
    case 'p256': {
      const prefixType = curve === 'secp256k1' ? Prefix.Secp256k1SecretKey : Prefix.P256SecretKey;
      let privKey = PrivateKeyEc.fromSeed(seed, curve);
      privKey = privKey.derivePath(path);
      const uint8arr = new Uint8Array(privKey.keyPair.getPrivate().toArray());
      const sk = b58Encode(uint8arr, prefixType);
      return sk;
    }
    case 'bip25519': {
      throw new ToBeImplemented();
    }
    default: {
      throw new InvalidCurveError(
        `Unsupported curve "${curve}" expecting one of the following "ed25519", "secp256k1", "p256"`
      );
    }
  }
};
