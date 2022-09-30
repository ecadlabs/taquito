import { checkDecodeTezosID, encodeTezosID } from '@taquito/michel-codec';
import * as ed25519 from '@stablelib/ed25519';
import * as blake2b from '@stablelib/blake2b';
import elliptic from 'elliptic';
import { TezosIDType } from '@taquito/michel-codec';

enum PublicKeyHashID {
    ED25519 = 0,
    SECP256K1 = 1,
    P256 = 2,
}

function computeDigest(msg: Uint8Array, pkh: [TezosIDType, number[]]): Uint8Array {
    const hashType = pkh[0] == 'ED25519PublicKeyHash' ? PublicKeyHashID.ED25519 :
        pkh[0] == 'SECP256K1PublicKeyHash' ? PublicKeyHashID.SECP256K1 :
        PublicKeyHashID.P256;

    const buf = new Uint8Array(msg.length + pkh[1].length + 3);
    buf.set([4, 1, hashType]);
    buf.set(pkh[1], 3);
    buf.set(msg, 3+pkh[1].length);
    return blake2b.hash(buf, 32);
}

export function authenticateRequest(msg: Uint8Array, pk: string, pkh: string): string {
    const tmp = checkDecodeTezosID(pk, 'ED25519Seed', 'P256SecretKey', 'SECP256K1SecretKey');
    if (tmp == null) {
        throw new Error('invalid private key format');
    }
    const [t, priv] = tmp;
    const pubHash = checkDecodeTezosID(pkh, 'ED25519PublicKeyHash', 'P256PublicKeyHash', 'SECP256K1PublicKeyHash');
    if (pubHash == null) {
        throw new Error('invalid public key hash format');
    }
    const sec = new Uint8Array(priv);
    const digest = computeDigest(msg, pubHash);
    let signature: Uint8Array;
    let sigType: TezosIDType;
    if (t == 'ED25519Seed') {
        const kp = ed25519.generateKeyPairFromSeed(sec);
        signature = ed25519.sign(kp.secretKey, digest);
        sigType = 'ED25519Signature';
    } else {
        const kp = new elliptic.ec(t == 'SECP256K1SecretKey' ? 'secp256k1' : 'p256').keyFromPrivate(sec);
        const sig = kp.sign(digest);
        const r = sig.r.toArray();
        const s = sig.s.toArray();
        signature = new Uint8Array(64);
        signature.set(r, 32-r.length);
        signature.set(s, 64-s.length);
        sigType = t == 'SECP256K1SecretKey' ? 'SECP256K1Signature' : 'P256Signature';
    }
    return encodeTezosID(sigType, signature);
}