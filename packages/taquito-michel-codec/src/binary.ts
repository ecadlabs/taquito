import { BytesLiteral, Expr, IntLiteral, Prim } from "./micheline";
import {
    MichelsonTypeID, MichelsonDataID,
    MichelsonSectionID, MichelsonInstructionID,
    MichelsonData, MichelsonType, MichelsonDataOr,
    MichelsonDataOption, MichelsonInstruction
} from "./michelson-types";
import { assertMichelsonData, assertMichelsonInstruction } from "./michelson-validator";
import {
    checkDecodeTezosID, encodeTezosID, hexBytes,
    isPairData, isPairType, MichelsonTypeError,
    parseBytes, parseDate, parseHex, unpackComb
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
    constructor(private buffer: number[] | Uint8Array, private idx: number = 0, private cap: number = buffer.length) {
    }

    /** Remaining length */
    get length(): number {
        return this.cap - this.idx;
    }

    readBytes(len: number): number[] | Uint8Array {
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

    copy(): Reader {
        return new Reader(this.buffer, this.idx, this.cap);
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
        address.entryPoint = dec.decode(new Uint8Array(rd.readBytes(rd.length)));
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

type WriteTransformFunc = (e: Expr) => [Expr, IterableIterator<WriteTransformFunc>];

function writeExpr(expr: Expr, wr: Writer, tf: WriteTransformFunc): void {
    const [e, args] = tf(expr);

    if (Array.isArray(e)) {
        const w = new Writer();
        for (const v of e) {
            const a = args.next();
            if (a.done) {
                throw new Error("REPORT ME: iterator is done");
            }
            writeExpr(v, w, a.value);
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
        const bytes = parseHex(e.bytes);
        wr.writeUint8(Tag.Bytes);
        wr.writeUint32(bytes.length);
        wr.writeBytes(bytes);
        return;
    }

    const prim = primTags[e.prim];
    if (prim === undefined) {
        throw new TypeError(`Can't encode primary: ${e.prim}`);
    }

    const tag = (e.args?.length || 0) < 3 ?
        Tag.Prim0 + (e.args?.length || 0) * 2 + (e.annots === undefined || e.annots.length === 0 ? 0 : 1) :
        Tag.Prim;

    wr.writeUint8(tag);
    wr.writeUint8(prim);

    if (e.args !== undefined) {
        if (e.args.length < 3) {
            for (const v of e.args) {
                const a = args.next();
                if (a.done) {
                    throw new Error("REPORT ME: iterator is done");
                }
                writeExpr(v, wr, a.value);
            }
        } else {
            const w = new Writer();
            for (const v of e.args) {
                const a = args.next();
                if (a.done) {
                    throw new Error("REPORT ME: iterator is done");
                }
                writeExpr(v, w, a.value);
            }
            wr.writeUint32(w.length);
            wr.writeBytes(w.buffer);
        }
    }

    if (e.annots !== undefined && e.annots.length !== 0) {
        const enc = new TextEncoder();
        const bytes = enc.encode(e.annots.join(" "));
        wr.writeUint32(bytes.length);
        wr.writeBytes(Array.from(bytes));
    } else if (e.args !== undefined && e.args.length >= 3) {
        wr.writeUint32(0);
    }
}

type ReadTransformFuncs = [(e: Expr) => IterableIterator<ReadTransformFuncs>, (e: Expr) => Expr];

function readExpr(rd: Reader, tf: ReadTransformFuncs): Expr {
    function* rpt() {
        while (true) {
            yield readPassThrough;
        }
    }
    const [args, tr] = tf;
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
                return tr({ int: String(val) });
            }

        case Tag.String:
            {
                const length = rd.readUint32();
                const bytes = rd.readBytes(length);
                const dec = new TextDecoder();
                return tr({ string: dec.decode(new Uint8Array(bytes)) });
            }

        case Tag.Bytes:
            {
                const length = rd.readUint32();
                const bytes = rd.readBytes(length);
                const hex = hexBytes(Array.from(bytes));
                return tr({ bytes: hex });
            }

        case Tag.Sequence:
            {
                const length = rd.readUint32();
                let res: Expr[] = [];
                let savedrd = rd.copy();
                // make two passes
                let it: IterableIterator<ReadTransformFuncs> = rpt();
                for (let n = 0; n < 2; n++) {
                    const r = savedrd.reader(length);
                    res = [];
                    while (r.length > 0) {
                        const a = it.next();
                        if (a.done) {
                            throw new Error("REPORT ME: iterator is done");
                        }
                        res.push(readExpr(r, a.value));
                    }
                    // make a second pass with injected side effects
                    it = args(res);
                    savedrd = rd;
                }
                return tr(res);
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
                const prim = primitives[p];
                const argn = (tag - 3) >> 1;
                let res: Prim = { prim };
                // make two passes
                let it: IterableIterator<ReadTransformFuncs> = rpt();
                let savedrd = rd.copy();
                for (let n = 0; n < 2; n++) {
                    res = { prim };
                    if (argn < 3) {
                        for (let i = 0; i < argn; i++) {
                            const a = it.next();
                            if (a.done) {
                                throw new Error("REPORT ME: iterator is done");
                            }
                            res.args = res.args || [];
                            res.args.push(readExpr(savedrd, a.value));
                        }
                    } else {
                        res.args = res.args || [];
                        const length = savedrd.readUint32();
                        const r = savedrd.reader(length);
                        while (r.length > 0) {
                            const a = it.next();
                            if (a.done) {
                                throw new Error("REPORT ME: iterator is done");
                            }
                            res.args.push(readExpr(r, a.value));
                        }
                    }
                    // make a second pass with injected side effects
                    it = args(res);
                    savedrd = rd;
                }

                if (((tag - 3) & 1) === 1 || argn === 3) {
                    // read annotations
                    const length = rd.readUint32();
                    if (length !== 0) {
                        const bytes = rd.readBytes(length);
                        const dec = new TextDecoder();
                        res.annots = dec.decode(new Uint8Array(bytes)).split(" ");
                    }
                }
                return tr(res);
            }
    }
}

const isOrData = (e: Expr): e is MichelsonDataOr => "prim" in e && (e.prim === "Left" || e.prim === "Right");
const isOptionData = (e: Expr): e is MichelsonDataOption => "prim" in e && (e.prim === "Some" || e.prim === "None");

const getWriteTransformFunc = (t: MichelsonType): WriteTransformFunc => {
    if (isPairType(t)) {
        return (d: Expr) => {
            if (!isPairData(d)) {
                throw new MichelsonTypeError(t, d, `pair expected: ${JSON.stringify(d)}`);
            }
            // combs aren't used in pack format
            const tc = unpackComb("pair", t);
            const dc = unpackComb("Pair", d);
            return [dc, (function* () {
                for (const a of tc.args) {
                    yield getWriteTransformFunc(a);
                }
            })()];
        };
    }

    switch (t.prim) {
        case "or":
            return (d: Expr) => {
                if (!isOrData(d)) {
                    throw new MichelsonTypeError(t, d, `or expected: ${JSON.stringify(d)}`);
                }
                return [d, (function* () {
                    yield getWriteTransformFunc(t.args[d.prim === "Left" ? 0 : 1]);
                })()];
            };

        case "option":
            return (d: Expr) => {
                if (!isOptionData(d)) {
                    throw new MichelsonTypeError(t, d, `option expected: ${JSON.stringify(d)}`);
                }
                return [d, (function* () {
                    const dd = d;
                    if (dd.prim === "Some") {
                        yield getWriteTransformFunc(t.args[0]);
                    }
                })()];
            };

        case "list":
        case "set":
            return (d: Expr) => {
                if (!Array.isArray(d)) {
                    throw new MichelsonTypeError(t, d, `${t.prim} expected: ${JSON.stringify(d)}`);
                }
                return [d, (function* () {
                    for (const v of d) {
                        yield getWriteTransformFunc(t.args[0]);
                    }
                })()];
            };

        case "map":
            return (d: Expr) => {
                if (!Array.isArray(d)) {
                    throw new MichelsonTypeError(t, d, `map expected: ${JSON.stringify(d)}`);
                }
                return [d, (function* (): Generator<WriteTransformFunc> {
                    for (const elt of d) {
                        yield (elt: Expr) => {
                            if (!("prim" in elt) || elt.prim !== "Elt") {
                                throw new MichelsonTypeError(t, elt, `map element expected: ${JSON.stringify(elt)}`);
                            }
                            return [elt, (function* () {
                                for (const a of t.args) {
                                    yield getWriteTransformFunc(a);
                                }
                            })()];
                        };
                    }
                })()];
            };

        case "chain_id":
            return (d: Expr) => {
                if (!("bytes" in d) && !("string" in d)) {
                    throw new MichelsonTypeError(t, d, `chain id expected: ${JSON.stringify(d)}`);
                }
                let bytes: BytesLiteral;
                if ("string" in d) {
                    const id = checkDecodeTezosID(d.string, "ChainID");
                    if (id === null) {
                        throw new MichelsonTypeError(t, d, `chain id base58 expected: ${d.string}`);
                    }
                    bytes = { bytes: hexBytes(id[1]) };
                } else {
                    bytes = d;
                }
                return [bytes, [][Symbol.iterator]()];
            };

        case "signature":
            return (d: Expr) => {
                if (!("bytes" in d) && !("string" in d)) {
                    throw new MichelsonTypeError(t, d, `signature expected: ${JSON.stringify(d)}`);
                }
                let bytes: BytesLiteral;
                if ("string" in d) {
                    const sig = checkDecodeTezosID(d.string, "ED25519Signature", "SECP256K1Signature", "P256Signature", "GenericSignature");
                    if (sig === null) {
                        throw new MichelsonTypeError(t, d, `signature base58 expected: ${d.string}`);
                    }
                    bytes = { bytes: hexBytes(sig[1]) };
                } else {
                    bytes = d;
                }
                return [bytes, [][Symbol.iterator]()];
            };

        case "key_hash":
            return (d: Expr) => {
                if (!("bytes" in d) && !("string" in d)) {
                    throw new MichelsonTypeError(t, d, `key hash expected: ${JSON.stringify(d)}`);
                }
                let bytes: BytesLiteral;
                if ("string" in d) {
                    const pkh = checkDecodeTezosID(d.string, "ED25519PublicKeyHash", "SECP256K1PublicKeyHash", "P256PublicKeyHash");
                    if (pkh === null) {
                        throw new MichelsonTypeError(t, d, `key hash base58 expected: ${d.string}`);
                    }
                    const w = new Writer();
                    writePublicKeyHash({ type: pkh[0], hash: pkh[1] }, w);
                    bytes = { bytes: hexBytes(w.buffer) };
                } else {
                    bytes = d;
                }
                return [bytes, [][Symbol.iterator]()];
            };

        case "key":
            return (d: Expr) => {
                if (!("bytes" in d) && !("string" in d)) {
                    throw new MichelsonTypeError(t, d, `public key expected: ${JSON.stringify(d)}`);
                }
                let bytes: BytesLiteral;
                if ("string" in d) {
                    const key = checkDecodeTezosID(d.string, "ED25519PublicKey", "SECP256K1PublicKey", "P256PublicKey");
                    if (key === null) {
                        throw new MichelsonTypeError(t, d, `public key base58 expected: ${d.string}`);
                    }
                    const w = new Writer();
                    writePublicKey({ type: key[0], publicKey: key[1] }, w);
                    bytes = { bytes: hexBytes(w.buffer) };
                } else {
                    bytes = d;
                }
                return [bytes, [][Symbol.iterator]()];
            };

        case "address":
            return (d: Expr) => {
                if (!("bytes" in d) && !("string" in d)) {
                    throw new MichelsonTypeError(t, d, `address expected: ${JSON.stringify(d)}`);
                }
                let bytes: BytesLiteral;
                if ("string" in d) {
                    const s = d.string.split("%");
                    const address = checkDecodeTezosID(s[0], "ED25519PublicKeyHash", "SECP256K1PublicKeyHash", "P256PublicKeyHash", "ContractHash");
                    if (address === null) {
                        throw new MichelsonTypeError(t, d, `address base58 expected: ${d.string}`);
                    }
                    const w = new Writer();
                    writeAddress({ type: address[0], hash: address[1], entryPoint: s.length > 1 ? s[1] : undefined }, w);
                    bytes = { bytes: hexBytes(w.buffer) };
                } else {
                    bytes = d;
                }
                return [bytes, [][Symbol.iterator]()];
            };

        case "timestamp":
            return (d: Expr) => {
                if (!("string" in d) && !("int" in d)) {
                    throw new MichelsonTypeError(t, d, `timestamp expected: ${JSON.stringify(d)}`);
                }
                let int: IntLiteral;
                if ("string" in d) {
                    const p = parseDate(d);
                    if (p === null) {
                        throw new MichelsonTypeError(t, d, `can't parse date: ${d.string}`);
                    }
                    int = { int: String(Math.floor(p.getTime() / 1000)) };
                } else {
                    int = d;
                }
                return [int, [][Symbol.iterator]()];
            };

        default:
            return writePassThrough;
    }
};

type PushInstruction = MichelsonInstruction & Prim<"PUSH">;
const isPushInstruction = (e: Expr): e is PushInstruction => "prim" in e && e.prim === "PUSH";

const writePassThrough: WriteTransformFunc = (e: Expr) => {
    if (isPushInstruction(e)) {
        assertMichelsonInstruction(e);
        // capture inlined type definition
        return [e, (function* () {
            yield writePassThrough;
            yield getWriteTransformFunc(e.args[0]);
        })()];
    }

    return [e, (function* () {
        while (true) {
            yield writePassThrough;
        }
    })()];
};

export function packData(d: MichelsonData, t?: MichelsonType): number[] {
    const w = new Writer();
    w.writeUint8(5);
    writeExpr(d, w, t !== undefined ? getWriteTransformFunc(t) : writePassThrough);
    return w.buffer;
}

export function packDataBytes(d: MichelsonData, t: MichelsonType): BytesLiteral {
    return { bytes: hexBytes(packData(d, t)) };
}

const getReadTransformFuncs = (t: MichelsonType): ReadTransformFuncs => {
    if (isPairType(t)) {
        const args = Array.isArray(t) ? t : t.args;
        return [
            (d: Expr) => {
                if (!isPairData(d)) {
                    throw new MichelsonTypeError(t, d, `pair expected: ${JSON.stringify(d)}`);
                }
                return (function* () {
                    for (const a of args) {
                        yield getReadTransformFuncs(a);
                    }
                })();
            },
            (d: Expr) => d
        ];
    }

    switch (t.prim) {
        case "or":
            return [
                (d: Expr) => {
                    if (!isOrData(d)) {
                        throw new MichelsonTypeError(t, d, `or expected: ${JSON.stringify(d)}`);
                    }
                    return (function* () {
                        yield getReadTransformFuncs(t.args[d.prim === "Left" ? 0 : 1]);
                    })();
                },
                (d: Expr) => d
            ];

        case "option":
            return [
                (d: Expr) => {
                    if (!isOptionData(d)) {
                        throw new MichelsonTypeError(t, d, `option expected: ${JSON.stringify(d)}`);
                    }
                    return (function* () {
                        if (d.prim === "Some") {
                            yield getReadTransformFuncs(t.args[0]);
                        }
                    })();
                },
                (d: Expr) => d
            ];

        case "list":
        case "set":
            return [
                (d: Expr) => {
                    if (!Array.isArray(d)) {
                        throw new MichelsonTypeError(t, d, `${t.prim} expected: ${JSON.stringify(d)}`);
                    }
                    return (function* () {
                        while (true) {
                            yield getReadTransformFuncs(t.args[0]);
                        }
                    })();
                },
                (d: Expr) => d
            ];

        case "map":
            return [
                (d: Expr): IterableIterator<ReadTransformFuncs> => {
                    if (!Array.isArray(d)) {
                        throw new MichelsonTypeError(t, d, `map expected: ${JSON.stringify(d)}`);
                    }
                    return (function* (): Generator<ReadTransformFuncs> {
                        while (true) {
                            yield [
                                (elt: Expr) => {
                                    if (!("prim" in elt) || elt.prim !== "Elt") {
                                        throw new MichelsonTypeError(t, elt, `map element expected: ${JSON.stringify(elt)}`);
                                    }
                                    return (function* () {
                                        for (const a of t.args) {
                                            yield getReadTransformFuncs(a);
                                        }
                                    })();
                                },
                                (elt: Expr) => elt
                            ];
                        }
                    })();
                },
                (d: Expr) => d
            ];

        case "chain_id":
            return [
                () => [][Symbol.iterator](),
                (d: Expr) => {
                    if (!("bytes" in d) && !("string" in d)) {
                        throw new MichelsonTypeError(t, d, `chain id expected: ${JSON.stringify(d)}`);
                    }
                    if ("string" in d) {
                        return d;
                    }
                    const bytes = parseBytes(d.bytes);
                    if (bytes === null) {
                        throw new MichelsonTypeError(t, d, `can't parse bytes: ${d.bytes}`);
                    }
                    return { string: encodeTezosID("ChainID", bytes) };
                }
            ];

        case "signature":
            return [
                () => [][Symbol.iterator](),
                (d: Expr) => {
                    if (!("bytes" in d) && !("string" in d)) {
                        throw new MichelsonTypeError(t, d, `signature expected: ${JSON.stringify(d)}`);
                    }
                    if ("string" in d) {
                        return d;
                    }
                    const bytes = parseBytes(d.bytes);
                    if (bytes === null) {
                        throw new MichelsonTypeError(t, d, `can't parse bytes: ${d.bytes}`);
                    }
                    return { string: encodeTezosID("GenericSignature", bytes) };
                }
            ];

        case "key_hash":
            return [
                () => [][Symbol.iterator](),
                (d: Expr) => {
                    if (!("bytes" in d) && !("string" in d)) {
                        throw new MichelsonTypeError(t, d, `key hash expected: ${JSON.stringify(d)}`);
                    }
                    if ("string" in d) {
                        return d;
                    }
                    const bytes = parseBytes(d.bytes);
                    if (bytes === null) {
                        throw new MichelsonTypeError(t, d, `can't parse bytes: ${d.bytes}`);
                    }
                    const rd = new Reader(new Uint8Array(bytes));
                    const addr = readPublicKeyHash(rd);
                    return { string: encodeTezosID(addr.type, addr.hash) + (addr.entryPoint ? "%" + addr.entryPoint : "") };
                }
            ];

        case "key":
            return [
                () => [][Symbol.iterator](),
                (d: Expr) => {
                    if (!("bytes" in d) && !("string" in d)) {
                        throw new MichelsonTypeError(t, d, `public key expected: ${JSON.stringify(d)}`);
                    }
                    if ("string" in d) {
                        return d;
                    }
                    const bytes = parseBytes(d.bytes);
                    if (bytes === null) {
                        throw new MichelsonTypeError(t, d, `can't parse bytes: ${d.bytes}`);
                    }
                    const rd = new Reader(new Uint8Array(bytes));
                    const pk = readPublicKey(rd);
                    return { string: encodeTezosID(pk.type, pk.publicKey) };
                }
            ];

        case "address":
            return [
                () => [][Symbol.iterator](),
                (d: Expr) => {
                    if (!("bytes" in d) && !("string" in d)) {
                        throw new MichelsonTypeError(t, d, `address expected: ${JSON.stringify(d)}`);
                    }
                    if ("string" in d) {
                        return d;
                    }
                    const bytes = parseBytes(d.bytes);
                    if (bytes === null) {
                        throw new MichelsonTypeError(t, d, `can't parse bytes: ${d.bytes}`);
                    }
                    const rd = new Reader(new Uint8Array(bytes));
                    const addr = readAddress(rd);
                    return { string: encodeTezosID(addr.type, addr.hash) + (addr.entryPoint ? "%" + addr.entryPoint : "") };
                }
            ];

        case "timestamp":
            return [
                () => [][Symbol.iterator](),
                (d: Expr) => {
                    if (!("int" in d) && !("string" in d)) {
                        throw new MichelsonTypeError(t, d, `address expected: ${JSON.stringify(d)}`);
                    }
                    if ("string" in d) {
                        return d;
                    }
                    const date = new Date(parseInt(d.int, 10) * 1000);
                    return { string: date.toISOString().slice(0, 19) + "Z" };
                }
            ];

        default:
            return readPassThrough;
    }
};

const readPassThrough: ReadTransformFuncs = [
    (e: Expr) => {
        if (isPushInstruction(e)) {
            assertMichelsonInstruction(e);
            // capture inlined type definition
            return (function* () {
                yield readPassThrough;
                yield getReadTransformFuncs(e.args[0]);
            })();
        }

        return (function* () {
            while (true) {
                yield readPassThrough;
            }
        })();
    },
    (e: Expr) => e
];

export function unpackData(src: number[] | Uint8Array, t?: MichelsonType): MichelsonData {
    const r = new Reader(src);
    if (r.readUint8() !== 5) {
        throw new Error("incorrect packed data magic number");
    }
    const ex = readExpr(r, t !== undefined ? getReadTransformFuncs(t) : readPassThrough);
    if (assertMichelsonData(ex)) {
        return ex;
    }
    throw new Error(); // never
}

export function unpackDataBytes(src: BytesLiteral, t?: MichelsonType): MichelsonData {
    const bytes = parseBytes(src.bytes);
    if (bytes === null) {
        throw new Error(`can't parse bytes: "${src.bytes}"`);
    }
    return unpackData(bytes, t);
}

// helper functions also used by validator

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