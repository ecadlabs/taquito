import path from 'path';

const PageSize = (64 * 1024) | 0;
export const P1CompressedByteLength = 48 | 0;
export const P2CompressedByteLength = 96 | 0;
export const ScalarByteLength = 32 | 0;

export enum Err {
  SUCCESS,
  BAD_ENCODING,
  POINT_NOT_ON_CURVE,
  POINT_NOT_IN_GROUP,
  AGGR_TYPE_MISMATCH,
  VERIFY_FAIL,
  PK_IS_INFINITY,
  BAD_SCALAR,
}

const ErrorMessage: Record<number, string> = {
  [Err.SUCCESS]: 'success',
  [Err.BAD_ENCODING]: 'bad encoding',
  [Err.POINT_NOT_ON_CURVE]: 'point is not on a curve',
  [Err.POINT_NOT_IN_GROUP]: 'point is not in a group',
  [Err.AGGR_TYPE_MISMATCH]: 'aggregate type mismatch',
  [Err.VERIFY_FAIL]: 'verify fail',
  [Err.PK_IS_INFINITY]: 'pk is infinity',
  [Err.BAD_SCALAR]: 'bad scalar',
};

export class BlstError extends Error {
  constructor(code: number) {
    const message = code in ErrorMessage ? ErrorMessage[code] : `${code}`;
    super(message);
  }
}

type I32 = number;

export interface PkMsgPair {
  pk: Uint8Array;
  msg: Uint8Array;
  aug?: Uint8Array;
}

/**
 * blst export section type
 */
interface Exports {
  memory: WebAssembly.Memory;
  // always provided by LLVM linker
  __heap_base: WebAssembly.Global;

  blst_scalar_sizeof: () => I32;
  blst_p1_sizeof: () => I32;
  blst_p1_affine_sizeof: () => I32;
  blst_p2_sizeof: () => I32;
  blst_p2_affine_sizeof: () => I32;
  blst_pairing_sizeof: () => I32;
  blst_fp12_sizeof: () => I32;

  // void blst_keygen(blst_scalar *out_SK, const byte *IKM, size_t IKM_len, const byte *info DEFNULL, size_t info_len DEFNULL);
  blst_keygen: (
    out_SK: I32,
    IKM: I32,
    IKM_len: I32,
    info: I32,
    info_len: I32
  ) => void;
  // void blst_sk_to_pk2_in_g1(byte out[96], blst_p1_affine *out_pk, const blst_scalar *SK);
  blst_sk_to_pk2_in_g1: (out: I32, out_pk_p1a: I32, SK: I32) => void;
  // void blst_sign_pk2_in_g1(byte out[192], blst_p2_affine *out_sig, const blst_p2 *hash, const blst_scalar *SK);
  blst_sign_pk2_in_g1: (out: I32, out_sig: I32, hash_p2: I32, SK: I32) => void;
  // void blst_sk_to_pk2_in_g2(byte out[192], blst_p2_affine *out_pk, const blst_scalar *SK);
  blst_sk_to_pk2_in_g2: (out: I32, out_pk_p2a: I32, SK: I32) => void;
  // void blst_sign_pk2_in_g2(byte out[96], blst_p1_affine *out_sig, const blst_p1 *hash, const blst_scalar *SK);
  blst_sign_pk2_in_g2: (out: I32, out_sig: I32, hash_p1: I32, SK: I32) => void;
  // BLST_ERROR blst_p1_uncompress(blst_p1_affine *out, const byte in[48]);
  blst_p1_uncompress: (out: I32, inp: I32) => I32;
  // void blst_p1_affine_compress(byte out[48], const blst_p1_affine *in);
  blst_p1_affine_compress: (out: I32, inp: I32) => void;
  // BLST_ERROR blst_p2_uncompress(blst_p2_affine *out, const byte in[96]);
  blst_p2_uncompress: (out: I32, inp: I32) => I32;
  // void blst_p2_affine_compress(byte out[96], const blst_p2_affine *in);
  blst_p2_affine_compress: (out: I32, inp: I32) => void;
  // void blst_lendian_from_scalar(byte out[32], const blst_scalar *a);
  blst_lendian_from_scalar: (out: I32, a: I32) => void;
  // void blst_scalar_from_lendian(blst_scalar *out, const byte a[32]);
  blst_scalar_from_lendian: (out: I32, a: I32) => void;
  // void blst_hash_to_g1(blst_p1 *out, const byte *msg, size_t msg_len, const byte *DST DEFNULL, size_t DST_len DEFNULL, const byte *aug DEFNULL, size_t aug_len DEFNULL);
  blst_hash_to_g1: (
    out_p1: I32,
    msg: I32,
    msg_len: I32,
    DST: I32,
    DST_len: I32,
    aug: I32,
    aug_len: I32
  ) => void;
  // void blst_hash_to_g2(blst_p2 *out, const byte *msg, size_t msg_len, const byte *DST DEFNULL, size_t DST_len DEFNULL, const byte *aug DEFNULL, size_t aug_len DEFNULL);
  blst_hash_to_g2: (
    out_p2: I32,
    msg: I32,
    msg_len: I32,
    DST: I32,
    DST_len: I32,
    aug: I32,
    aug_len: I32
  ) => void;
  // void blst_pairing_init(blst_pairing *new_ctx, bool hash_or_encode, const byte *DST DEFNULL, size_t DST_len DEFNULL);
  blst_pairing_init: (
    out: I32,
    hash_or_encode: I32,
    DST: I32,
    DST_len: I32
  ) => void;
  // BLST_ERROR blst_pairing_chk_n_aggr_pk_in_g1(blst_pairing *ctx,
  //     const blst_p1_affine *PK,
  //     bool pk_grpchk,
  //     const blst_p2_affine *signature,
  //     bool sig_grpchk,
  //     const byte *msg, size_t msg_len,
  //     const byte *aug DEFNULL,
  //     size_t aug_len DEFNULL);
  blst_pairing_chk_n_aggr_pk_in_g1: (
    ctx: I32,
    pk_p1a: I32,
    pk_grpchk: I32,
    sig_p2a: I32,
    sig_grpchk: I32,
    msg: I32,
    msg_len: I32,
    aug: I32,
    aug_len: I32
  ) => I32;
  // BLST_ERROR blst_pairing_chk_n_aggr_pk_in_g2(blst_pairing *ctx,
  //     const blst_p2_affine *PK,
  //     bool pk_grpchk,
  //     const blst_p1_affine *signature,
  //     bool sig_grpchk,
  //     const byte *msg, size_t msg_len,
  //     const byte *aug DEFNULL,
  //     size_t aug_len DEFNULL);
  blst_pairing_chk_n_aggr_pk_in_g2: (
    ctx: I32,
    pk_p2a: I32,
    pk_grpchk: I32,
    sig_p1a: I32,
    sig_grpchk: I32,
    msg: I32,
    msg_len: I32,
    aug: I32,
    aug_len: I32
  ) => I32;
  // void blst_pairing_commit(blst_pairing *ctx);
  blst_pairing_commit: (ctx: I32) => void;
  // bool blst_pairing_finalverify(const blst_pairing *ctx, const blst_fp12 *gtsig DEFNULL);
  blst_pairing_finalverify: (ctx: I32, gtsig: I32) => I32;
  // bool blst_p1_affine_on_curve(const blst_p1_affine *p);
  blst_p1_affine_on_curve: (p: I32) => I32;
  // bool blst_p1_affine_in_g1(const blst_p1_affine *p);
  blst_p1_affine_in_g1: (p: I32) => I32;
  // bool blst_p1_affine_is_inf(const blst_p1_affine *a);
  blst_p1_affine_is_inf: (p: I32) => I32;
  // bool blst_p1_affine_is_equal(const blst_p1_affine *a, const blst_p1_affine *b);
  blst_p1_affine_is_equal: (a: I32, b: I32) => I32;
  // bool blst_p2_affine_on_curve(const blst_p2_affine *p);
  blst_p2_affine_on_curve: (p: I32) => I32;
  // bool blst_p2_affine_in_g2(const blst_p2_affine *p);
  blst_p2_affine_in_g2: (p: I32) => I32;
  // bool blst_p2_affine_is_inf(const blst_p2_affine *a);
  blst_p2_affine_is_inf: (p: I32) => I32;
  // bool blst_p2_affine_is_equal(const blst_p2_affine *a, const blst_p2_affine *b);
  blst_p2_affine_is_equal: (a: I32, b: I32) => I32;
  // "One-shot" CoreVerify entry points.
  // BLST_ERROR blst_core_verify_pk_in_g1(const blst_p1_affine *pk,
  //     const blst_p2_affine *signature,
  //     bool hash_or_encode,
  //     const byte *msg, size_t msg_len,
  //     const byte *DST DEFNULL,
  //     size_t DST_len DEFNULL,
  //     const byte *aug DEFNULL,
  //     size_t aug_len DEFNULL);
  blst_core_verify_pk_in_g1: (
    pk_p1a: I32,
    sig_p2a: I32,
    hash_or_encode: I32,
    msg: I32,
    msg_len: I32,
    DST: I32,
    DST_len: I32,
    aug: I32,
    aug_len: I32
  ) => I32;
  // BLST_ERROR blst_core_verify_pk_in_g2(const blst_p2_affine *pk,
  //     const blst_p1_affine *signature,
  //     bool hash_or_encode,
  //     const byte *msg, size_t msg_len,
  //     const byte *DST DEFNULL,
  //     size_t DST_len DEFNULL,
  //     const byte *aug DEFNULL,
  //     size_t aug_len DEFNULL);
  blst_core_verify_pk_in_g2: (
    pk_p2a: I32,
    sig_p1a: I32,
    hash_or_encode: I32,
    msg: I32,
    msg_len: I32,
    DST: I32,
    DST_len: I32,
    aug: I32,
    aug_len: I32
  ) => I32;
  // void blst_p1_add_or_double_affine(blst_p1 *out, const blst_p1 *a, const blst_p1_affine *b);
  blst_p1_add_or_double_affine: (out_p1: I32, a_p1: I32, b_p1a: I32) => void;
  // void blst_p2_add_or_double_affine(blst_p2 *out, const blst_p2 *a, const blst_p2_affine *b);
  blst_p2_add_or_double_affine: (out_p2: I32, a_p2: I32, b_p2a: I32) => void;
  // void blst_p1_from_affine(blst_p1 *out, const blst_p1_affine *in);
  blst_p1_from_affine: (out_p1: I32, in_p1a: I32) => void;
  // void blst_p2_from_affine(blst_p2 *out, const blst_p2_affine *in);
  blst_p2_from_affine: (out_p2: I32, in_p2a: I32) => void;
  // void blst_p1_to_affine(blst_p1_affine *out, const blst_p1 *in);
  blst_p1_to_affine: (out_p1a: I32, in_p1: I32) => void;
  // void blst_p2_to_affine(blst_p2_affine *out, const blst_p2 *in);
  blst_p2_to_affine: (out_p2a: I32, in_p2: I32) => void;
}

/**
 * A glue class responsible for passing arguments to blst functions and returning results by copying them in and out
 * of Wasm instance's memory. All non-primitive types are represented as Uint8Array's holding copies of in-memory
 * representation of blst types. It allows to use extremely simple memory allocation scheme.
 */
export class BlstWrapper {
  private readonly alloc: Allocator;
  private readonly api: Exports;
  private readonly sizeof: {
    scalar: number;
    p1: number;
    p1_affine: number;
    p2: number;
    p2_affine: number;
    pairing: number;
    fp12: number;
  };

  constructor(inst: WebAssembly.Instance) {
    this.api = inst.exports as unknown as Exports;
    this.alloc = new Allocator(inst);
    this.sizeof = {
      scalar: this.api.blst_scalar_sizeof(),
      p1: this.api.blst_p1_sizeof(),
      p1_affine: this.api.blst_p1_affine_sizeof(),
      p2: this.api.blst_p2_sizeof(),
      p2_affine: this.api.blst_p2_affine_sizeof(),
      pairing: this.api.blst_pairing_sizeof(),
      fp12: this.api.blst_fp12_sizeof(),
    };
  }

  keygen(ikm: Uint8Array, info?: Uint8Array): Uint8Array {
    if (ikm.length < 32) {
      throw new Error('input key material is too short');
    }
    const [sp, [vmOut, vmIkm, vmInfo]] =
      info != null
        ? this.alloc.allocateFrame(
            this.sizeof.scalar,
            ikm.byteLength,
            info.byteLength
          )
        : this.alloc.allocateFrame(this.sizeof.scalar, ikm.byteLength);
    vmIkm.set(ikm);
    if (info != null && vmInfo != null) {
      vmInfo?.set(info);
    }
    this.api.blst_keygen(
      vmOut.byteOffset,
      vmIkm.byteOffset,
      vmIkm.byteLength,
      vmInfo != null ? vmInfo.byteOffset : 0,
      vmInfo != null ? vmInfo.byteLength : 0
    );
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  sk_to_pk2_in_g1(sk: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmSk]] = this.alloc.allocateFrame(
      this.sizeof.p1_affine,
      this.sizeof.scalar
    );
    vmSk.set(sk);
    this.api.blst_sk_to_pk2_in_g1(0, vmOut.byteOffset, vmSk.byteOffset);
    const pk = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return pk;
  }

  sk_to_pk2_in_g2(sk: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmSk]] = this.alloc.allocateFrame(
      this.sizeof.p2_affine,
      this.sizeof.scalar
    );
    vmSk.set(sk);
    this.api.blst_sk_to_pk2_in_g2(0, vmOut.byteOffset, vmSk.byteOffset);
    const pk = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return pk;
  }

  sign_pk2_in_g1(q: Uint8Array, sk: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmQ, vmSk]] = this.alloc.allocateFrame(
      this.sizeof.p2_affine,
      this.sizeof.p2,
      this.sizeof.scalar
    );
    vmQ.set(q);
    vmSk.set(sk);
    this.api.blst_sign_pk2_in_g1(
      0,
      vmOut.byteOffset,
      vmQ.byteOffset,
      vmSk.byteOffset
    );
    const sig = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return sig;
  }

  sign_pk2_in_g2(q: Uint8Array, sk: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmQ, vmSk]] = this.alloc.allocateFrame(
      this.sizeof.p1_affine,
      this.sizeof.p1,
      this.sizeof.scalar
    );
    vmQ.set(q);
    vmSk.set(sk);
    this.api.blst_sign_pk2_in_g2(
      0,
      vmOut.byteOffset,
      vmQ.byteOffset,
      vmSk.byteOffset
    );
    const sig = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return sig;
  }

  p1_uncompress(inp: Uint8Array): Uint8Array {
    if (inp.length !== P1CompressedByteLength) {
      throw new Error('invalid compressed point size');
    }
    const [sp, [vmOut, vmIn]] = this.alloc.allocateFrame(
      this.sizeof.p1_affine,
      P1CompressedByteLength
    );
    vmIn.set(inp);
    const err = this.api.blst_p1_uncompress(vmOut.byteOffset, vmIn.byteOffset);
    if (err !== Err.SUCCESS) {
      this.alloc.disposeFrame(sp);
      throw new BlstError(err);
    }
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  p1_affine_compress(inp: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmIn]] = this.alloc.allocateFrame(
      P1CompressedByteLength,
      this.sizeof.p1_affine
    );
    vmIn.set(inp);
    this.api.blst_p1_affine_compress(vmOut.byteOffset, vmIn.byteOffset);
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  p2_uncompress(inp: Uint8Array): Uint8Array {
    if (inp.length !== P2CompressedByteLength) {
      throw new Error('invalid compressed point size');
    }
    const [sp, [vmOut, vmIn]] = this.alloc.allocateFrame(
      this.sizeof.p2_affine,
      P2CompressedByteLength
    );
    vmIn.set(inp);
    const err = this.api.blst_p2_uncompress(vmOut.byteOffset, vmIn.byteOffset);
    if (err !== Err.SUCCESS) {
      this.alloc.disposeFrame(sp);
      throw new BlstError(err);
    }
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  p2_affine_compress(inp: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmIn]] = this.alloc.allocateFrame(
      P2CompressedByteLength,
      this.sizeof.p2_affine
    );
    vmIn.set(inp);
    this.api.blst_p2_affine_compress(vmOut.byteOffset, vmIn.byteOffset);
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  lendian_from_scalar(scalar: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmIn]] = this.alloc.allocateFrame(
      ScalarByteLength,
      this.sizeof.scalar
    );
    vmIn.set(scalar);
    this.api.blst_lendian_from_scalar(vmOut.byteOffset, vmIn.byteOffset);
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  scalar_from_lendian(inp: Uint8Array): Uint8Array {
    if (inp.length !== ScalarByteLength) {
      throw new Error('invalid scalar size');
    }
    const [sp, [vmOut, vmIn]] = this.alloc.allocateFrame(
      this.sizeof.scalar,
      ScalarByteLength
    );
    vmIn.set(inp);
    this.api.blst_scalar_from_lendian(vmOut.byteOffset, vmIn.byteOffset);
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  hash_to_g1(msg: Uint8Array, suite: Uint8Array, aug?: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmMsg, vmDst, vmAug]] =
      aug != null
        ? this.alloc.allocateFrame(
            this.sizeof.p1,
            msg.byteLength,
            suite.byteLength,
            aug.byteLength
          )
        : this.alloc.allocateFrame(
            this.sizeof.p1,
            msg.byteLength,
            suite.byteLength
          );
    vmMsg.set(msg);
    vmDst.set(suite);
    if (aug != null && vmAug != null) {
      vmAug.set(aug);
    }
    this.api.blst_hash_to_g1(
      vmOut.byteOffset,
      vmMsg.byteOffset,
      vmMsg.byteLength,
      vmDst.byteOffset,
      vmDst.byteLength,
      vmAug != null ? vmAug.byteOffset : 0,
      vmAug != null ? vmAug.byteLength : 0
    );
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  hash_to_g2(msg: Uint8Array, suite: Uint8Array, aug?: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmMsg, vmDst, vmAug]] =
      aug != null
        ? this.alloc.allocateFrame(
            this.sizeof.p2,
            msg.byteLength,
            suite.byteLength,
            aug.byteLength
          )
        : this.alloc.allocateFrame(
            this.sizeof.p2,
            msg.byteLength,
            suite.byteLength
          );
    vmMsg.set(msg);
    vmDst.set(suite);
    if (aug != null && vmAug != null) {
      vmAug.set(aug);
    }
    this.api.blst_hash_to_g2(
      vmOut.byteOffset,
      vmMsg.byteOffset,
      vmMsg.byteLength,
      vmDst.byteOffset,
      vmDst.byteLength,
      vmAug != null ? vmAug?.byteOffset : 0,
      vmAug != null ? vmAug?.byteLength : 0
    );
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  p1_affine_on_curve(p: Uint8Array): boolean {
    const [sp, [vmP]] = this.alloc.allocateFrame(this.sizeof.p1_affine);
    vmP.set(p);
    const ret = this.api.blst_p1_affine_on_curve(vmP.byteOffset);
    this.alloc.disposeFrame(sp);
    return ret !== 0;
  }

  p1_affine_is_inf(p: Uint8Array): boolean {
    const [sp, [vmP]] = this.alloc.allocateFrame(this.sizeof.p1_affine);
    vmP.set(p);
    const ret = this.api.blst_p1_affine_is_inf(vmP.byteOffset);
    this.alloc.disposeFrame(sp);
    return ret !== 0;
  }

  p1_affine_in_g1(p: Uint8Array): boolean {
    const [sp, [vmP]] = this.alloc.allocateFrame(this.sizeof.p1_affine);
    vmP.set(p);
    const ret = this.api.blst_p1_affine_in_g1(vmP.byteOffset);
    this.alloc.disposeFrame(sp);
    return ret !== 0;
  }

  p1_affine_is_equal(a: Uint8Array, b: Uint8Array): boolean {
    const [sp, [vmA, vmB]] = this.alloc.allocateFrame(
      this.sizeof.p1_affine,
      this.sizeof.p1_affine
    );
    vmA.set(a);
    vmB.set(b);
    const ret = this.api.blst_p1_affine_is_equal(
      vmA.byteOffset,
      vmB.byteOffset
    );
    this.alloc.disposeFrame(sp);
    return ret !== 0;
  }

  p2_affine_on_curve(p: Uint8Array): boolean {
    const [sp, [vmP]] = this.alloc.allocateFrame(this.sizeof.p2_affine);
    vmP.set(p);
    const ret = this.api.blst_p2_affine_on_curve(vmP.byteOffset);
    this.alloc.disposeFrame(sp);
    return ret !== 0;
  }

  p2_affine_is_inf(p: Uint8Array): boolean {
    const [sp, [vmP]] = this.alloc.allocateFrame(this.sizeof.p2_affine);
    vmP.set(p);
    const ret = this.api.blst_p2_affine_is_inf(vmP.byteOffset);
    this.alloc.disposeFrame(sp);
    return ret !== 0;
  }

  p2_affine_in_g2(p: Uint8Array): boolean {
    const [sp, [vmP]] = this.alloc.allocateFrame(this.sizeof.p2_affine);
    vmP.set(p);
    const ret = this.api.blst_p2_affine_in_g2(vmP.byteOffset);
    this.alloc.disposeFrame(sp);
    return ret !== 0;
  }

  p2_affine_is_equal(a: Uint8Array, b: Uint8Array): boolean {
    const [sp, [vmA, vmB]] = this.alloc.allocateFrame(
      this.sizeof.p2_affine,
      this.sizeof.p2_affine
    );
    vmA.set(a);
    vmB.set(b);
    const ret = this.api.blst_p2_affine_is_equal(
      vmA.byteOffset,
      vmB.byteOffset
    );
    this.alloc.disposeFrame(sp);
    return ret !== 0;
  }

  core_verify_pk_in_g1(
    pkP1a: Uint8Array,
    sigP2a: Uint8Array,
    hash: boolean,
    msg: Uint8Array,
    suite: Uint8Array,
    aug?: Uint8Array
  ): boolean {
    const [sp, [vmPk, vmSig, vmMsg, vmDst, vmAug]] =
      aug != null
        ? this.alloc.allocateFrame(
            this.sizeof.p1_affine,
            this.sizeof.p2_affine,
            msg.byteLength,
            suite.byteLength,
            aug.byteLength
          )
        : this.alloc.allocateFrame(
            this.sizeof.p1_affine,
            this.sizeof.p2_affine,
            msg.byteLength,
            suite.byteLength
          );
    vmPk.set(pkP1a);
    vmSig.set(sigP2a);
    vmMsg.set(msg);
    vmDst.set(suite);
    if (aug != null && vmAug != null) {
      vmAug.set(aug);
    }
    const ret = this.api.blst_core_verify_pk_in_g1(
      vmPk.byteOffset,
      vmSig.byteOffset,
      hash ? 1 : 0,
      vmMsg.byteOffset,
      vmMsg.byteLength,
      vmDst.byteOffset,
      vmDst.byteLength,
      vmAug != null ? vmAug?.byteOffset : 0,
      vmAug != null ? vmAug?.byteLength : 0
    );
    this.alloc.disposeFrame(sp);

    switch (ret) {
      case Err.SUCCESS:
        return true;
      case (Err.PK_IS_INFINITY, Err.POINT_NOT_IN_GROUP, Err.VERIFY_FAIL):
        return false;
      default:
        throw new BlstError(ret);
    }
  }

  core_verify_pk_in_g2(
    pkP2a: Uint8Array,
    sigP1a: Uint8Array,
    hash: boolean,
    msg: Uint8Array,
    suite: Uint8Array,
    aug?: Uint8Array
  ): boolean {
    const [sp, [vmPk, vmSig, vmMsg, vmDst, vmAug]] =
      aug != null
        ? this.alloc.allocateFrame(
            this.sizeof.p2_affine,
            this.sizeof.p1_affine,
            msg.byteLength,
            suite.byteLength,
            aug.byteLength
          )
        : this.alloc.allocateFrame(
            this.sizeof.p2_affine,
            this.sizeof.p1_affine,
            msg.byteLength,
            suite.byteLength
          );
    vmPk.set(pkP2a);
    vmSig.set(sigP1a);
    vmMsg.set(msg);
    vmDst.set(suite);
    if (aug != null && vmAug != null) {
      vmAug.set(aug);
    }
    const ret = this.api.blst_core_verify_pk_in_g2(
      vmPk.byteOffset,
      vmSig.byteOffset,
      hash ? 1 : 0,
      vmMsg.byteOffset,
      vmMsg.byteLength,
      vmDst.byteOffset,
      vmDst.byteLength,
      vmAug != null ? vmAug?.byteOffset : 0,
      vmAug != null ? vmAug?.byteLength : 0
    );
    this.alloc.disposeFrame(sp);
    if (ret === Err.SUCCESS) {
      return true;
    } else if (ret === Err.VERIFY_FAIL) {
      return false;
    } else {
      throw new BlstError(ret);
    }
  }

  // higher level method which is kept here to avoid copying in and out heavy pairing context
  core_aggregate_verify_g1(
    sigP2a: Uint8Array,
    sigCk: boolean,
    pairs: PkMsgPair[],
    pkCk: boolean,
    hash: boolean,
    suite: Uint8Array
  ): boolean {
    const [sp, [vmCtx, vmSig, vmDst]] = this.alloc.allocateFrame(
      this.sizeof.pairing,
      this.sizeof.p2_affine,
      suite.byteLength
    );
    vmSig.set(sigP2a);
    vmDst.set(suite);
    const vmPairs = pairs.map<PkMsgPair>((p) => {
      const [, [pk, msg, aug]] =
        p.aug != null
          ? this.alloc.allocateFrame(
              this.sizeof.p1_affine,
              p.msg.byteLength,
              p.aug.byteLength
            )
          : this.alloc.allocateFrame(this.sizeof.p1_affine, p.msg.byteLength);
      pk.set(p.pk);
      msg.set(p.msg);
      if (p.aug != null && aug != null) {
        aug.set(p.aug);
      }
      return { pk, msg, aug };
    });

    this.api.blst_pairing_init(
      vmCtx.byteOffset,
      hash ? 1 : 0,
      vmDst.byteOffset,
      vmDst.byteLength
    );
    let ok = true;
    for (const [i, p] of vmPairs.entries()) {
      const err = this.api.blst_pairing_chk_n_aggr_pk_in_g1(
        vmCtx.byteOffset,
        p.pk.byteOffset,
        pkCk ? 1 : 0,
        i === 0 ? vmSig.byteOffset : 0,
        0,
        p.msg.byteOffset,
        p.msg.byteLength,
        p.aug != null ? p.aug?.byteOffset : 0,
        p.aug != null ? p.aug?.byteLength : 0
      );
      switch (err) {
        case Err.SUCCESS:
          break;
        case (Err.PK_IS_INFINITY, Err.POINT_NOT_IN_GROUP):
          ok = false;
          break;
        default:
          this.alloc.disposeFrame(sp);
          throw new BlstError(err);
      }
    }
    this.api.blst_pairing_commit(vmCtx.byteOffset);
    if (ok) {
      ok =
        (!sigCk || this.api.blst_p2_affine_in_g2(vmSig.byteOffset) !== 0) &&
        this.api.blst_pairing_finalverify(vmCtx.byteOffset, 0) !== 0;
    }
    this.alloc.disposeFrame(sp);
    return ok;
  }

  // higher level method which is kept here to avoid copying in and out heavy pairing context
  core_aggregate_verify_g2(
    sigP1a: Uint8Array,
    sigCk: boolean,
    pairs: PkMsgPair[],
    pkCk: boolean,
    hash: boolean,
    suite: Uint8Array
  ): boolean {
    const [sp, [vmCtx, vmSig, vmDst]] = this.alloc.allocateFrame(
      this.sizeof.pairing,
      this.sizeof.p1_affine,
      suite.byteLength
    );
    vmSig.set(sigP1a);
    vmDst.set(suite);
    const vmPairs = pairs.map<PkMsgPair>((p) => {
      const [, [pk, msg, aug]] =
        p.aug != null
          ? this.alloc.allocateFrame(
              this.sizeof.p2_affine,
              p.msg.byteLength,
              p.aug.byteLength
            )
          : this.alloc.allocateFrame(this.sizeof.p2_affine, p.msg.byteLength);
      pk.set(p.pk);
      msg.set(p.msg);
      if (p.aug != null && aug != null) {
        aug.set(p.aug);
      }
      return { pk, msg, aug };
    });

    this.api.blst_pairing_init(
      vmCtx.byteOffset,
      hash ? 1 : 0,
      vmDst.byteOffset,
      vmDst.byteLength
    );
    let ok = true;
    for (const [i, p] of vmPairs.entries()) {
      const err = this.api.blst_pairing_chk_n_aggr_pk_in_g2(
        vmCtx.byteOffset,
        p.pk.byteOffset,
        pkCk ? 1 : 0,
        i === 0 ? vmSig.byteOffset : 0,
        0,
        p.msg.byteOffset,
        p.msg.byteLength,
        p.aug != null ? p.aug?.byteOffset : 0,
        p.aug != null ? p.aug?.byteLength : 0
      );
      switch (err) {
        case Err.SUCCESS:
          break;
        case (Err.PK_IS_INFINITY, Err.POINT_NOT_IN_GROUP):
          ok = false;
          break;
        default:
          this.alloc.disposeFrame(sp);
          throw new BlstError(err);
      }
    }
    this.api.blst_pairing_commit(vmCtx.byteOffset);
    if (ok) {
      ok =
        (!sigCk || this.api.blst_p1_affine_in_g1(vmSig.byteOffset) !== 0) &&
        this.api.blst_pairing_finalverify(vmCtx.byteOffset, 0) !== 0;
    }
    this.alloc.disposeFrame(sp);
    return ok;
  }

  p1_add_or_double_affine(aP1: Uint8Array, bP1a: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmA, vmB]] = this.alloc.allocateFrame(
      this.sizeof.p1,
      this.sizeof.p1,
      this.sizeof.p1_affine
    );
    vmA.set(aP1);
    vmB.set(bP1a);
    this.api.blst_p1_add_or_double_affine(
      vmOut.byteOffset,
      vmA.byteOffset,
      vmB.byteOffset
    );
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  p2_add_or_double_affine(aP2: Uint8Array, bP2a: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmA, vmB]] = this.alloc.allocateFrame(
      this.sizeof.p2,
      this.sizeof.p2,
      this.sizeof.p2_affine
    );
    vmA.set(aP2);
    vmB.set(bP2a);
    this.api.blst_p2_add_or_double_affine(
      vmOut.byteOffset,
      vmA.byteOffset,
      vmB.byteOffset
    );
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  p1_from_affine(inP1a: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmIn]] = this.alloc.allocateFrame(
      this.sizeof.p1,
      this.sizeof.p1_affine
    );
    vmIn.set(inP1a);
    this.api.blst_p1_from_affine(vmOut.byteOffset, vmIn.byteOffset);
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  p2_from_affine(inP2a: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmIn]] = this.alloc.allocateFrame(
      this.sizeof.p2,
      this.sizeof.p2_affine
    );
    vmIn.set(inP2a);
    this.api.blst_p2_from_affine(vmOut.byteOffset, vmIn.byteOffset);
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  p1_to_affine(inP1: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmIn]] = this.alloc.allocateFrame(
      this.sizeof.p1_affine,
      this.sizeof.p1
    );
    vmIn.set(inP1);
    this.api.blst_p1_to_affine(vmOut.byteOffset, vmIn.byteOffset);
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }

  p2_to_affine(inP2: Uint8Array): Uint8Array {
    const [sp, [vmOut, vmIn]] = this.alloc.allocateFrame(
      this.sizeof.p2_affine,
      this.sizeof.p2
    );
    vmIn.set(inP2);
    this.api.blst_p2_to_affine(vmOut.byteOffset, vmIn.byteOffset);
    const out = new Uint8Array(vmOut);
    this.alloc.disposeFrame(sp);
    return out;
  }
}

function alignSize(x: number): number {
  return ((x | 0) + (7 | 0)) & ~(7 | 0);
}

/**
 * Simple stack-like heap allocator
 */
class Allocator {
  private readonly heapBase: number;
  private top: number;
  private readonly memory: WebAssembly.Memory;

  constructor(inst: WebAssembly.Instance) {
    const exports = inst.exports as unknown as Exports;
    this.heapBase = exports.__heap_base.value | 0;
    this.memory = exports.memory;
    this.top = this.heapBase;
  }

  allocateFrame(l0: number): [number, [Uint8Array]];
  allocateFrame(l0: number, l1: number): [number, [Uint8Array, Uint8Array]];
  allocateFrame(
    l0: number,
    l1: number,
    l2: number
  ): [number, [Uint8Array, Uint8Array, Uint8Array]];
  allocateFrame(
    l0: number,
    l1: number,
    l2: number,
    l3: number
  ): [number, [Uint8Array, Uint8Array, Uint8Array, Uint8Array]];
  allocateFrame(
    l0: number,
    l1: number,
    l2: number,
    l3: number,
    l4: number
  ): [number, [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array]];
  allocateFrame(
    l0: number,
    l1: number,
    l2: number,
    l3: number,
    l4: number,
    l5: number
  ): [
    number,
    [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array]
  ];
  allocateFrame(...lengths: number[]): [number, Uint8Array[]];
  allocateFrame(...lengths: number[]): [number, Uint8Array[]] {
    const total = lengths.reduce((acc, val) => acc + alignSize(val), 0);
    const addr = this.top;
    this.top += total;
    if (this.memory.buffer.byteLength < this.top) {
      // grow
      const pages = (this.memory.buffer.byteLength / PageSize) | 0;
      const newPages = ((this.top + PageSize - 1) / PageSize) | 0;
      this.memory.grow(newPages - pages);
    }
    let start = addr;
    const out: Uint8Array[] = [];
    for (const len of lengths) {
      out.push(new Uint8Array(this.memory.buffer, start, len));
      start += alignSize(len);
    }
    return [addr, out];
  }

  disposeFrame(sp: number): void {
    if (sp < this.top) {
      this.top = sp;
    }
  }
}

export type Scheme = 'basic' | 'aug';

export function getSuite(s: Scheme, g: number): Uint8Array {
  const str =
    s === 'basic'
      ? `BLS_SIG_BLS12381G${g}_XMD:SHA-256_SSWU_RO_NUL_`
      : `BLS_SIG_BLS12381G${g}_XMD:SHA-256_SSWU_RO_AUG_`;
  return new TextEncoder().encode(str);
}

export const Blst: {
    blst: undefined | BlstWrapper;
} = {
    blst: undefined,   
};

const loadBlst = async() => {
    console.log(`\n\n\n\n=====================Loading====================\n\n\n\n`);
    const thePath = path.join(__dirname, '../../dist/blst.wasm');
    console.log(`\n\n\n==============${thePath}===========\n\n\n`);
    const url = new URL(`file://${thePath}`);
    if (typeof window === 'undefined') {
      const fs = await import('fs/promises');
      const buf = await fs.readFile(url);
      return await WebAssembly.instantiate(buf);
    } else {
      return await WebAssembly.instantiateStreaming(fetch(url.toString()));
    }
}

loadBlst().then(result => {
    Blst.blst = new BlstWrapper(result.instance);
    console.log(`\n\n\n\n=====================Loaded====================\n\n\n\n`);
});
