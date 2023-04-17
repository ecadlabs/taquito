/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * Minimal-pubkey-size: public keys are points in G1, signatures are points in G2
 */
import {
    Blst, getSuite, Scheme, PkMsgPair,
    ScalarByteLength, P1CompressedByteLength, P2CompressedByteLength
} from "./blst";

export class PrivateKey {
    static readonly ByteLength = ScalarByteLength;

    private constructor(private readonly scalar: Uint8Array) { }

    static generate(ikm: Uint8Array): PrivateKey {
        return new PrivateKey(Blst.blst!.keygen(ikm));
    }

    static fromBytes(bytes: Uint8Array): PrivateKey {
        return new PrivateKey(Blst.blst!.scalar_from_lendian(bytes));
    }

    bytes(): Uint8Array {
        return Blst.blst!.lendian_from_scalar(this.scalar);
    }

    public(): PublicKey {
        return PublicKey.fromPoint(Blst.blst!.sk_to_pk2_in_g1(this.scalar));
    }

    sign(msg: Uint8Array, scheme: Scheme, cipherSuite?: string): Signature {
        const suite = cipherSuite != null ? new TextEncoder().encode(cipherSuite) : getSuite(scheme, 2);
        const aug = scheme === "aug" ? this.public().bytes() : undefined;
        const q = Blst.blst!.hash_to_g2(msg, suite, aug);
        return Signature.fromPoint(Blst.blst!.sign_pk2_in_g1(q, this.scalar));
    }
}

export class PublicKey {
    static readonly ByteLength = P1CompressedByteLength;

    private constructor(public readonly _point: Uint8Array) { }

    static fromBytes(bytes: Uint8Array): PublicKey {
        return new PublicKey(Blst.blst!.p1_uncompress(bytes));
    }

    static fromPoint(point: Uint8Array): PublicKey {
        return new PublicKey(point);
    }

    bytes(): Uint8Array {
        return Blst.blst!.p1_affine_compress(this._point);
    }

    valid(): boolean {
        return !Blst.blst!.p1_affine_is_inf(this._point) && Blst.blst!.p1_affine_in_g1(this._point);
    }

    onCurve(): boolean {
        return Blst.blst!.p1_affine_on_curve(this._point);
    }

    equal(other: PublicKey): boolean {
        if (!(other instanceof PublicKey)) {
            return false;
        }
        return Blst.blst!.p1_affine_is_equal(this._point, other._point);
    }
}

export class Signature {
    static readonly ByteLength = P2CompressedByteLength;

    private constructor(readonly _point: Uint8Array) { }

    static fromBytes(bytes: Uint8Array): Signature {
        return new Signature(Blst.blst!.p2_uncompress(bytes));
    }

    static fromPoint(point: Uint8Array): Signature {
        return new Signature(point);
    }

    bytes(): Uint8Array {
        return Blst.blst!.p2_affine_compress(this._point);
    }

    aggregateVerify(scheme: Scheme, pairs: [PublicKey, Uint8Array][], cipherSuite?: string): boolean {
        const suite = cipherSuite != null ? new TextEncoder().encode(cipherSuite) : getSuite(scheme, 2);
        const verifyPairs = pairs.map<PkMsgPair>(([pk, msg]) => {
            if (!(pk instanceof PublicKey)) {
                throw new Error("invalid public key");
            }
            return {
                pk: pk._point,
                msg,
                aug: scheme === "aug" ? pk.bytes() : undefined
            };
        });
        return Blst.blst!.core_aggregate_verify_g1(this._point, true, verifyPairs, true, true, suite);
    }

    verify(scheme: Scheme, pk: PublicKey, msg: Uint8Array, cipherSuite?: string): boolean {
        const suite = cipherSuite != null ? new TextEncoder().encode(cipherSuite) : getSuite(scheme, 2);
        if (!(pk instanceof PublicKey)) {
            throw new Error("invalid public key");
        }
        const aug = scheme === "aug" ? pk.bytes() : undefined;
        return Blst.blst!.core_verify_pk_in_g1(pk._point, this._point, true, msg, suite, aug);
    }

    valid(groupCheck = false): boolean {
        return !Blst.blst!.p2_affine_is_inf(this._point) && (!groupCheck || Blst.blst!.p2_affine_in_g2(this._point));
    }

    onCurve(): boolean {
        return Blst.blst!.p2_affine_on_curve(this._point);
    }

    equal(other: Signature): boolean {
        if (!(other instanceof Signature)) {
            throw new Error("invalid signature");
        }
        return Blst.blst!.p2_affine_is_equal(this._point, other._point);
    }
}

export function aggregateSignatures(...src: Signature[]): Signature {
    if (src.length === 0) {
        throw new Error("zero arguments");
    }
    src.forEach((x) => {
        if (!(x instanceof Signature)) {
            throw new Error("invalid signature");
        }
    });
    let acc = Blst.blst!.p2_from_affine(src[0]._point);
    for (let i = 1; i < src.length; i++) {
        acc = Blst.blst!.p2_add_or_double_affine(acc, src[i]._point);
    }
    return Signature.fromPoint(Blst.blst!.p2_to_affine(acc));
}
