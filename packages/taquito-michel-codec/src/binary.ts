import { BytesLiteral, Expr, Prim } from "./micheline";
import {
    MichelsonTypeID, MichelsonDataID,
    MichelsonSectionID, MichelsonInstructionID, MichelsonData, MichelsonType, MichelsonMapElt, MichelsonDataOr, MichelsonDataOption
} from "./michelson-types";
import {
    checkDecodeTezosID,
    isPairData, isPairType, MichelsonTypeError,
    parseBytes, parseDate, unpackComb
} from "./utils";

type PrimID = MichelsonTypeID |
    MichelsonDataID |
    MichelsonSectionID |
    MichelsonInstructionID |
    "Elt";

const primitives: PrimID[] = ["parameter", "storage", "code", "False", "Elt", "Left", "None", "Pair",
    "Right", "Some", "True", "Unit", "PACK", "UNPACK", "BLAKE2B", "SHA256", "SHA512", "ABS", "ADD",
    "AMOUNT", "AND", "BALANCE", "CAR", "CDR", "CHECK_SIGNATURE", "COMPARE", "CONCAT", "CONS",
    "CREATE_ACCOUNT", "CREATE_CONTRACT", "IMPLICIT_ACCOUNT", "DIP", "DROP", "DUP", "EDIV", "EMPTY_MAP",
    "EMPTY_SET", "EQ", "EXEC", "FAILWITH", "GE", "GET", "GT", "HASH_KEY", "IF", "IF_CONS", "IF_LEFT",
    "IF_NONE", "INT", "LAMBDA", "LE", "LEFT", "LOOP", "LSL", "LSR", "LT", "MAP", "MEM", "MUL", "NEG",
    "NEQ", "NIL", "NONE", "NOT", "NOW", "OR", "PAIR", "PUSH", "RIGHT", "SIZE", "SOME", "SOURCE",
    "SENDER", "SELF", "STEPS_TO_QUOTA", "SUB", "SWAP", "TRANSFER_TOKENS", "SET_DELEGATE", "UNIT",
    "UPDATE", "XOR", "ITER", "LOOP_LEFT", "ADDRESS", "CONTRACT", "ISNAT", "CAST", "RENAME", "bool",
    "contract", "int", "key", "key_hash", "lambda", "list", "map", "big_map", "nat", "option", "or",
    "pair", "set", "signature", "string", "bytes", "mutez", "timestamp", "unit", "operation",
    "address", "SLICE", "DIG", "DUG", "EMPTY_BIG_MAP", "APPLY", "chain_id", "CHAIN_ID", "LEVEL",
    "SELF_ADDRESS", "never", "NEVER", "UNPAIR", "VOTING_POWER", "TOTAL_VOTING_POWER", "KECCAK",
    "SHA3", "PAIRING_CHECK", "bls12_381_g1", "bls12_381_g2", "bls12_381_fr", "sapling_state",
    "sapling_transaction", "SAPLING_EMPTY_STATE", "SAPLING_VERIFY_UPDATE", "ticket", "TICKET",
    "READ_TICKET", "SPLIT_TICKET", "JOIN_TICKETS", "GET_AND_UPDATE"];

const primTags: { [key in PrimID]?: number } & { [key: string]: number | undefined; } = Object.assign({}, ...primitives.map((v, i) => ({ [v]: i })));

enum Tag {
    Int = 0,
    String = 1,
    Sequence = 2,
    Prim0 = 3,
    Prim0Annot = 4,
    Prim1 = 5,
    Prim1Annot = 6,
    Prim2 = 7,
    Prim2Annot = 8,
    Prim = 9,
    Bytes = 10,
}

const hexBytes = (bytes: number[]) => bytes.map(x => ((x >> 4) & 0xf).toString(16) + (x & 0xf).toString(16)).join("");

class Writer {
    public buffer: number[] = [];

    get length(): number {
        return this.buffer.length;
    }

    writeBytes(val: number[]) {
        this.buffer.push(...val.map(v => v & 0xff));
    }

    writeUint8(val: number) {
        const v = val | 0;
        this.buffer.push(v & 0xff);
    }

    writeUint16(val: number) {
        const v = val | 0;
        this.buffer.push((v >> 8) & 0xff);
        this.buffer.push(v & 0xff);
    }

    writeUint32(val: number) {
        const v = val | 0;
        this.buffer.push((v >> 24) & 0xff);
        this.buffer.push((v >> 16) & 0xff);
        this.buffer.push((v >> 8) & 0xff);
        this.buffer.push(v & 0xff);
    }

    writeInt8(val: number) {
        this.writeUint8(val);
    }

    writeInt16(val: number) {
        this.writeUint16(val);
    }

    writeInt32(val: number) {
        this.writeUint32(val);
    }
}

const boundsErr = new Error("bounds out of range");
class Reader {
    constructor(private buffer: Uint8Array, private idx: number = 0, private cap: number = buffer.length) {
    }

    /** Remaining length */
    get length(): number {
        return this.cap - this.idx;
    }

    readBytes(len: number): Uint8Array {
        if (this.cap - this.idx < len) {
            throw boundsErr;
        }
        const ret = this.buffer.slice(this.idx, this.idx + len);
        this.idx += len;
        return ret;
    }

    reader(len: number): Reader {
        if (this.cap - this.idx < len) {
            throw boundsErr;
        }
        const ret = new Reader(this.buffer, this.idx, this.idx + len);
        this.idx += len;
        return ret;
    }

    readUint8(): number {
        if (this.cap - this.idx < 1) {
            throw boundsErr;
        }
        return this.buffer[this.idx++] >>> 0;
    }

    readUint16(): number {
        if (this.cap - this.idx < 2) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        return ((x0 << 8) | x1) >>> 0;
    }

    readUint32(): number {
        if (this.cap - this.idx < 4) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        const x2 = this.buffer[this.idx++];
        const x3 = this.buffer[this.idx++];
        return ((x0 << 24) | (x1 << 16) | (x2 << 8) | x3) >>> 0;
    }

    readInt8(): number {
        if (this.cap - this.idx < 1) {
            throw boundsErr;
        }
        const x = this.buffer[this.idx++];
        return (x << 24) >> 24;
    }

    readInt16(): number {
        if (this.cap - this.idx < 2) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        return (((x0 << 8) | x1) << 16) >> 16;
    }

    readInt32(): number {
        if (this.cap - this.idx < 4) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        const x2 = this.buffer[this.idx++];
        const x3 = this.buffer[this.idx++];
        return (x0 << 24) | (x1 << 16) | (x2 << 8) | x3;
    }
}

enum ContractID {
    Implicit = 0,
    Originated = 1,
}

enum PublicKeyHashID {
    ED25519 = 0,
    SECP256K1 = 1,
    P256 = 2,
}

type AddressType = "ED25519PublicKeyHash" | "SECP256K1PublicKeyHash" | "P256PublicKeyHash" | "ContractHash";

export interface Address {
    type: AddressType;
    hash: number[] | Uint8Array;
    entryPoint?: string;
}

function readPublicKeyHash(rd: Reader): Address {
    let type: AddressType;
    const tag = rd.readUint8();
    switch (tag) {
        case PublicKeyHashID.ED25519:
            type = "ED25519PublicKeyHash";
            break;
        case PublicKeyHashID.SECP256K1:
            type = "SECP256K1PublicKeyHash";
            break;
        case PublicKeyHashID.P256:
            type = "P256PublicKeyHash";
            break;
        default:
            throw new Error(`unknown public key hash tag: ${tag}`);
    }
    return { type, hash: rd.readBytes(20) };
}

function readAddress(rd: Reader): Address {
    let address: Address;
    const tag = rd.readUint8();
    switch (tag) {
        case ContractID.Implicit:
            address = readPublicKeyHash(rd);
            break;

        case ContractID.Originated:
            address = {
                type: "ContractHash",
                hash: rd.readBytes(20),
            };
            rd.readBytes(1);
            break;

        default:
            throw new Error(`unknown address tag: ${tag}`);
    }

    if (rd.length !== 0) {
        // entry point
        const dec = new TextDecoder();
        address.entryPoint = dec.decode(rd.readBytes(rd.length));
    }
    return address;
}

function writePublicKeyHash(a: Address, w: Writer): void {
    let tag: PublicKeyHashID;
    switch (a.type) {
        case "ED25519PublicKeyHash":
            tag = PublicKeyHashID.ED25519;
            break;
        case "SECP256K1PublicKeyHash":
            tag = PublicKeyHashID.SECP256K1;
            break;
        case "P256PublicKeyHash":
            tag = PublicKeyHashID.P256;
            break;
        default:
            throw new Error(`unexpected address type: ${a.type}`);
    }
    w.writeUint8(tag);
    w.writeBytes(Array.from(a.hash));
}

function writeAddress(a: Address, w: Writer): void {
    if (a.type === "ContractHash") {
        w.writeUint8(ContractID.Originated);
        w.writeBytes(Array.from(a.hash));
        w.writeUint8(0);
    } else {
        w.writeUint8(ContractID.Implicit);
        writePublicKeyHash(a, w);
    }

    if (a.entryPoint !== undefined && a.entryPoint !== "" && a.entryPoint !== "default") {
        const enc = new TextEncoder();
        const bytes = enc.encode(a.entryPoint);
        w.writeBytes(Array.from(bytes));
    }
}

enum PublicKeyID {
    ED25519 = 0,
    SECP256K1 = 1,
    P256 = 2,
}

export type PublicKeyType = "ED25519PublicKey" | "SECP256K1PublicKey" | "P256PublicKey";
export interface PublicKey {
    type: PublicKeyType;
    publicKey: number[] | Uint8Array;
}

function readPublicKey(rd: Reader): PublicKey {
    let ln: number;
    let type: PublicKeyType;
    const tag = rd.readUint8();
    switch (tag) {
        case PublicKeyID.ED25519:
            type = "ED25519PublicKey";
            ln = 32;
            break;
        case PublicKeyID.SECP256K1:
            type = "SECP256K1PublicKey";
            ln = 33;
            break;
        case PublicKeyID.P256:
            type = "P256PublicKey";
            ln = 33;
            break;
        default:
            throw new Error(`unknown public key tag: ${tag}`);
    }
    return { type, publicKey: rd.readBytes(ln) };
}

function writePublicKey(pk: PublicKey, w: Writer): void {
    let tag: PublicKeyID;
    switch (pk.type) {
        case "ED25519PublicKey":
            tag = PublicKeyID.ED25519;
            break;
        case "SECP256K1PublicKey":
            tag = PublicKeyID.SECP256K1;
            break;
        case "P256PublicKey":
            tag = PublicKeyID.P256;
            break;
        default:
            throw new Error(`unexpected public key type: ${pk.type}`);
    }
    w.writeUint8(tag);
    w.writeBytes(Array.from(pk.publicKey));
}

type TransformFunc = (e: Expr) => [Expr, IterableIterator<[Expr, TransformFunc]>];
function writeExpr(expr: Expr, wr: Writer, tr: TransformFunc): void {
    const [e, args] = tr(expr);

    if (Array.isArray(e)) {
        const w = new Writer();
        for (const [v, t] of args) {
            writeExpr(v, w, t);
        }
        wr.writeUint8(Tag.Sequence);
        wr.writeUint32(w.length);
        wr.writeBytes(w.buffer);
        return;
    }

    if ("string" in e) {
        const enc = new TextEncoder();
        const bytes = enc.encode(e.string);
        wr.writeUint8(Tag.String);
        wr.writeUint32(bytes.length);
        wr.writeBytes(Array.from(bytes));
        return;
    }

    if ("int" in e) {
        wr.writeUint8(Tag.Int);
        let val = BigInt(e.int);
        const sign = val < 0;
        if (sign) {
            val = -val;
        }
        let i = 0;
        do {
            const bits = (i === 0) ? BigInt(6) : BigInt(7);
            let byte = val & ((BigInt(1) << bits) - BigInt(1));
            val >>= bits;
            if (val) {
                byte |= BigInt(0x80);
            }
            if (i === 0 && sign) {
                byte |= BigInt(0x40);
            }
            wr.writeUint8(Number(byte));
            i++;
        } while (val);
        return;
    }

    if ("bytes" in e) {
        const bytes: number[] = [];
        for (let i = 0; i < e.bytes.length; i += 2) {
            bytes.push(parseInt(e.bytes.slice(i, i + 2), 16));
        }
        wr.writeUint8(Tag.Bytes);
        wr.writeUint32(bytes.length);
        wr.writeBytes(bytes);
        return;
    }

    const prim = primTags[e.prim];
    if (prim === undefined) {
        throw new TypeError(`Can't encode primary: ${e.prim}`);
    }

    const tag = e.args?.length || 0 < 3 ?
        Tag.Prim0 + (e.args?.length || 0) * 2 + (e.annots === undefined || e.annots.length === 0 ? 0 : 1) :
        Tag.Prim;

    wr.writeUint8(tag);
    wr.writeUint8(prim);

    if (e.args !== undefined) {
        if (e.args.length < 3) {
            for (const [v, t] of args) {
                writeExpr(v, wr, t);
            }
        } else {
            const w = new Writer();
            for (const [v, t] of args) {
                writeExpr(v, w, t);
            }
            wr.writeUint8(Tag.Sequence);
            wr.writeUint32(w.length);
            wr.writeBytes(w.buffer);
        }
    }

    if (e.annots !== undefined && e.annots.length !== 0) {
        const enc = new TextEncoder();
        const bytes = enc.encode(e.annots.join(" "));
        wr.writeUint32(bytes.length);
        wr.writeBytes(Array.from(bytes));
    }
}

function readExpr(rd: Reader): Expr {
    const tag = rd.readUint8();
    switch (tag) {
        case Tag.Int:
            {
                const buf: number[] = [];
                let byte: number;
                do {
                    byte = rd.readInt8();
                    buf.push(byte);
                } while ((byte & 0x80) !== 0);
                let val = BigInt(0);
                let sign = false;
                for (let i = buf.length - 1; i >= 0; i--) {
                    const bits = (i === 0) ? BigInt(6) : BigInt(7);
                    const byte = BigInt(buf[i]);
                    val <<= bits;
                    val |= byte & ((BigInt(1) << bits) - BigInt(1));
                    if (i === 0) {
                        sign = !!(byte & BigInt(0x40));
                    }
                }
                if (sign) {
                    val = -val;
                }
                return { int: String(val) };
            }

        case Tag.String:
            {
                const length = rd.readUint32();
                const bytes = rd.readBytes(length);
                const dec = new TextDecoder();
                return { string: dec.decode(bytes) };
            }

        case Tag.Bytes:
            {
                const length = rd.readUint32();
                const bytes = rd.readBytes(length);
                const hex = hexBytes(Array.from(bytes));
                return { bytes: hex };
            }

        case Tag.Sequence:
            {
                const res: Expr[] = [];
                const length = rd.readUint32();
                const r = rd.reader(length);
                while (r.length > 0) {
                    res.push(readExpr(r));
                }
                return res;
            }

        default:
            {
                if (tag > 9) {
                    throw new Error(`Unknown tag: ${tag}`);
                }
                const p = rd.readUint8();
                if (p >= primitives.length) {
                    throw new Error(`Unknown primitive tag: ${p}`);
                }
                const res: Prim = {
                    prim: primitives[p],
                };

                const argn = (tag - 3) >> 1;
                if (argn < 3) {
                    for (let i = 0; i < argn; i++) {
                        res.args = res.args || [];
                        res.args.push(readExpr(rd));
                    }
                } else {
                    res.args = res.args || [];
                    const length = rd.readUint32();
                    const r = rd.reader(length);
                    while (r.length > 0) {
                        res.args.push(readExpr(r));
                    }
                }

                if (((tag - 3) & 1) === 1) {
                    // annotations
                    const length = rd.readUint32();
                    const bytes = rd.readBytes(length);
                    const dec = new TextDecoder();
                    res.annots = dec.decode(bytes).split(" ");
                }
                return res;
            }
    }
}

const passThrough: TransformFunc = (e: Expr) => [e, (function* (): Generator<[Expr, TransformFunc]> {
    if (Array.isArray(e) || "prim" in e) {
        const args = Array.isArray(e) ? e : (e.args || []);
        for (const a of args) {
            yield [a, passThrough];
        }
    }
})()];

export function emitBinary(expr: Expr): number[] {
    const w = new Writer();
    writeExpr(expr, w, passThrough);
    return w.buffer;
}

const isOrData = (e: Expr): e is MichelsonDataOr => "prim" in e && (e.prim === "Left" || e.prim === "Right");
const isOptionData = (e: Expr): e is MichelsonDataOption => "prim" in e && (e.prim === "Some" || e.prim === "None");

export function packData(d: MichelsonData, t: MichelsonType): number[] {
    const transform = (t: MichelsonType): TransformFunc => (d: Expr): [Expr, IterableIterator<[Expr, TransformFunc]>] => {
        if (isPairType(t)) {
            if (!isPairData(d)) {
                throw new MichelsonTypeError(t, d, `pair expected: ${JSON.stringify(d)}`);
            }
            // combs aren't used in pack format
            const dc = unpackComb("Pair", d);
            const tc = unpackComb("pair", t);
            return [dc, (function* (): Generator<[Expr, TransformFunc]> {
                for (let i = 0; i < tc.args.length; i++) {
                    yield [dc.args[i], transform(tc.args[i])];
                }
            })()];
        }

        switch (t.prim) {
            case "or":
                if (isOrData(d)) {
                    return [d, (function* (): Generator<[Expr, TransformFunc]> {
                        yield [d.args[0], transform(d.prim === "Left" ? t.args[0] : t.args[1])];
                    })()];
                }
                throw new MichelsonTypeError(t, d, `or expected: ${JSON.stringify(d)}`);

            case "option":
                if (isOptionData(d)) {
                    return [d, (function* (): Generator<[Expr, TransformFunc]> {
                        const dd = d;
                        if (dd.prim === "Some") {
                            yield [dd.args[0], transform(t.args[0])];
                        }
                    })()];
                }
                throw new MichelsonTypeError(t, d, `option expected: ${JSON.stringify(d)}`);

            case "list":
            case "set":
                if (Array.isArray(d)) {
                    return [d, (function* (): Generator<[Expr, TransformFunc]> {
                        for (const v of d) {
                            yield [v, transform(t.args[0])];
                        }
                    })()];
                }
                throw new MichelsonTypeError(t, d, `${t.prim} expected: ${JSON.stringify(d)}`);

            case "map":
                if (Array.isArray(d)) {
                    return [d, (function* (): Generator<[Expr, TransformFunc]> {
                        for (const elt of d) {
                            if (!("prim" in elt) || elt.prim !== "Elt") {
                                throw new MichelsonTypeError(t, elt, `map element expected: ${JSON.stringify(elt)}`);
                            }
                            yield [elt, (elt: Expr) => [elt, (function* (): Generator<[Expr, TransformFunc]> {
                                for (let i = 0; i < t.args.length; i++) {
                                    const isElt = (e: Expr): e is MichelsonMapElt => "prim" in e && e.prim === "Elt";
                                    if (isElt(elt)) {
                                        yield [elt.args[i], transform(t.args[i])];
                                    }
                                }
                            })()]];
                        }
                    })()];
                }
                throw new MichelsonTypeError(t, d, `map expected: ${JSON.stringify(d)}`);

            case "chain_id":
                if ("bytes" in d || "string" in d) {
                    let bytes: string | null;
                    if ("string" in d) {
                        const id = checkDecodeTezosID(d.string, "ChainID");
                        bytes = id !== null ? hexBytes(id[1]) : null;
                    } else {
                        bytes = d.bytes;
                    }
                    if (bytes !== null) {
                        return [{ bytes }, (function* () { /* wow such empty */ })()];
                    }
                }
                throw new MichelsonTypeError(t, d, `chain id expected: ${JSON.stringify(d)}`);

            case "signature":
                if ("bytes" in d || "string" in d) {
                    let bytes: string | null;
                    if ("string" in d) {
                        const id = checkDecodeTezosID(d.string,
                            "ED25519Signature",
                            "SECP256K1Signature",
                            "P256Signature",
                            "GenericSignature");
                        bytes = id !== null ? hexBytes(id[1]) : null;
                    } else {
                        bytes = d.bytes;
                    }
                    if (bytes !== null) {
                        return [{ bytes }, (function* () { /* wow such empty */ })()];
                    }
                }
                throw new MichelsonTypeError(t, d, `signature expected: ${JSON.stringify(d)}`);

            case "key_hash":
                if ("bytes" in d || "string" in d) {
                    let bytes: string | null = null;
                    if ("string" in d) {
                        const pkh = checkDecodeTezosID(d.string,
                            "ED25519PublicKeyHash",
                            "SECP256K1PublicKeyHash",
                            "P256PublicKeyHash");
                        if (pkh !== null) {
                            const w = new Writer();
                            writePublicKeyHash({ type: pkh[0], hash: pkh[1] }, w);
                            bytes = hexBytes(w.buffer);
                        }
                    } else {
                        bytes = d.bytes;
                    }
                    if (bytes !== null) {
                        return [{ bytes }, (function* () { /* wow such empty */ })()];
                    }
                }
                throw new MichelsonTypeError(t, d, `key hash expected: ${JSON.stringify(d)}`);

            case "key":
                if ("bytes" in d || "string" in d) {
                    let bytes: string | null = null;
                    if ("string" in d) {
                        const pkh = checkDecodeTezosID(d.string,
                            "ED25519PublicKey",
                            "SECP256K1PublicKey",
                            "P256PublicKey");
                        if (pkh !== null) {
                            const w = new Writer();
                            writePublicKey({ type: pkh[0], publicKey: pkh[1] }, w);
                            bytes = hexBytes(w.buffer);
                        }
                    } else {
                        bytes = d.bytes;
                    }
                    if (bytes !== null) {
                        return [{ bytes }, (function* () { /* wow such empty */ })()];
                    }
                }
                throw new MichelsonTypeError(t, d, `public key expected: ${JSON.stringify(d)}`);

            case "address":
                if ("bytes" in d || "string" in d) {
                    let bytes: string | null = null;
                    if ("string" in d) {
                        const s = d.string.split("%");
                        const address = checkDecodeTezosID(s[0],
                            "ED25519PublicKeyHash",
                            "SECP256K1PublicKeyHash",
                            "P256PublicKeyHash",
                            "ContractHash");
                        if (address !== null) {
                            const w = new Writer();
                            writeAddress({ type: address[0], hash: address[1], entryPoint: s.length > 1 ? s[1] : undefined }, w);
                            bytes = hexBytes(w.buffer);
                        }
                    } else {
                        bytes = d.bytes;
                    }
                    if (bytes !== null) {
                        return [{ bytes }, (function* () { /* wow such empty */ })()];
                    }
                }
                throw new MichelsonTypeError(t, d, `address expected: ${JSON.stringify(d)}`);

            case "timestamp":
                if ("string" in d || "int" in d) {
                    let int: string | null = null;
                    if ("string" in d) {
                        const p = parseDate(d);
                        if (p !== null) {
                            int = String(Math.floor(p.getTime() / 1000));
                        }
                    } else {
                        int = d.int;
                    }
                    if (int !== null) {
                        return [{ int }, (function* () { /* wow such empty */ })()];
                    }
                }
                throw new MichelsonTypeError(t, d, `timestamp expected: ${JSON.stringify(d)}`);

            default:
                return passThrough(d);

            // TODO check lambdas for typed instructions like PUSH etc
        }
    };
    const w = new Writer();
    w.writeUint8(5);
    writeExpr(d, w, transform(t));
    return w.buffer;
}

export function packDataBytes(d: MichelsonData, t: MichelsonType): BytesLiteral {
    return { bytes: hexBytes(packData(d, t)) };
}

export function parseBinary(buf: Uint8Array | number[]): Expr | null {
    if (buf.length === 0) {
        return null;
    }
    const rd = new Reader(new Uint8Array(buf));
    return readExpr(rd);
}

export function decodeAddressBytes(b: BytesLiteral): Address {
    const bytes = parseBytes(b.bytes);
    if (bytes === null) {
        throw new Error(`can't parse bytes: "${b.bytes}"`);
    }
    const rd = new Reader(new Uint8Array(bytes));
    return readAddress(rd);
}

export function decodePublicKeyHashBytes(b: BytesLiteral): Address {
    const bytes = parseBytes(b.bytes);
    if (bytes === null) {
        throw new Error(`can't parse bytes: "${b.bytes}"`);
    }
    const rd = new Reader(new Uint8Array(bytes));
    return readPublicKeyHash(rd);
}

export function decodePublicKeyBytes(b: BytesLiteral): PublicKey {
    const bytes = parseBytes(b.bytes);
    if (bytes === null) {
        throw new Error(`can't parse bytes: "${b.bytes}"`);
    }
    const rd = new Reader(new Uint8Array(bytes));
    return readPublicKey(rd);
}