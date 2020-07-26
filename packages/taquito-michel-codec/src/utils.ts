import { Prim, Expr } from "./micheline";
import { MichelsonUnaryInstructionId, MichelsonInstructionId } from "./michelson-types";
import { decodeBase58Check } from "./base58";

export type Tuple<N extends number, T> = N extends 1 ? [T] :
    N extends 2 ? [T, T] :
    N extends 3 ? [T, T, T] :
    N extends 4 ? [T, T, T, T] :
    never;

type RequiredProp<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type OmitProp<T, K extends keyof T> = Omit<T, K> & { [P in K]?: never };

export type ReqArgs<T extends Prim> = RequiredProp<T, "args">;
export type NoArgs<T extends Prim> = OmitProp<T, "args">;
export type NoAnnots<T extends Prim> = OmitProp<T, "annots">;

export type Nullable<T> = { [P in keyof T]: T[P] | null };

export interface ObjectTreePath<T extends Expr = Expr> {
    /**
     * Node's index. Either argument index or sequence index.
     */
    index: number;
    /**
     * Node's value.
     */
    val: T;
}

export class MichelsonError<T extends Expr = Expr> extends Error {
    /**
     * @param val Value of a type node caused the error
     * @param path Path to a node caused the error
     * @param message An error message
     */
    constructor(public val: T, public path?: ObjectTreePath[], message?: string) {
        super(message);
        Object.setPrototypeOf(this, MichelsonError.prototype);
    }
}

// Ad hoc big integer parser
export class LongInteger {
    private neg = false;
    private buf: number[] = [];

    private append(c: number) {
        let i = 0;
        while (c !== 0 || i < this.buf.length) {
            const m = (this.buf[i] || 0) * 10 + c;
            this.buf[i++] = m % 256;
            c = Math.floor(m / 256);
        }
    }

    constructor(arg?: string | number) {
        if (arg === undefined) {
            return;
        }
        if (typeof arg === "string") {
            for (let i = 0; i < arg.length; i++) {
                let c = arg.charCodeAt(i);
                if (i === 0 && c === 0x2d) {
                    this.neg = true;
                } else {
                    if (c < 0x30 || c > 0x39) {
                        throw new Error(`unexpected character in integer constant: ${arg[i]}`);
                    }
                    this.append(c - 0x30);
                }
            }
        } else if (arg < 0) {
            this.neg = true;
            this.append(-arg);
        } else {
            this.append(arg);
        }
    }

    cmp(arg: LongInteger): number {
        if (this.neg !== arg.neg) {
            return (arg.neg ? 1 : 0) - (this.neg ? 1 : 0);
        } else {
            let ret = 0;
            if (this.buf.length !== arg.buf.length) {
                ret = this.buf.length < arg.buf.length ? -1 : 1;
            } else if (this.buf.length !== 0) {
                let i = arg.buf.length - 1;
                while (i >= 0 && this.buf[i] === arg.buf[i]) {
                    i--;
                }
                ret = i < 0 ? 0 : this.buf[i] < arg.buf[i] ? -1 : 1;
            }
            return !this.neg ? ret : ret === 0 ? 0 : -ret;
        }
    }

    get sign(): number {
        return this.buf.length === 0 ? 0 : this.neg ? -1 : 1;
    }
}

export function parseBytes(s: string): number[] | null {
    const ret: number[] = [];
    for (let i = 0; i < s.length; i += 2) {
        const x = parseInt(s.slice(i, i + 2), 16);
        if (Number.isNaN(x)) {
            return null;
        }
        ret.push(x);
    }
    return ret;
}

export function compareBytes(a: number[] | Uint8Array, b: number[] | Uint8Array): number {
    if (a.length !== b.length) {
        return a.length < b.length ? -1 : 1;
    } else if (a.length !== 0) {
        let i = 0;
        while (i < a.length && a[i] === b[i]) {
            i++;
        }
        return i === a.length ? 0 : a[i] < b[i] ? -1 : 1;
    } else {
        return 0;
    }
}

export function isDecimal(x: string): boolean {
    try {
        // tslint:disable-next-line: no-unused-expression
        new LongInteger(x);
        return true;
    } catch {
        return false;
    }
}

export function isNatural(x: string): boolean {
    try {
        return new LongInteger(x).sign >= 0;
    } catch {
        return false;
    }
}

export interface UnpackedAnnotations {
    f?: string[];
    t?: string[];
    v?: string[];
}

const annRe = /^(@%|@%%|%@|[@:%]([_a-zA-Z][_0-9a-zA-Z\.%@]*)?)$/;
export function unpackAnnotations(p: Prim, allowEmptyFields = false): UnpackedAnnotations {
    let field: string[] | undefined;
    let type: string[] | undefined;
    let vars: string[] | undefined;

    if (p.annots !== undefined) {
        for (const v of p.annots) {
            if (v.length !== 0) {
                if (!annRe.test(v)) {
                    throw new Error(`unexpected annotation: ${v[0]}`);
                }
                switch (v[0]) {
                    case "%":
                        if (allowEmptyFields || v.length > 1) {
                            field = field || [];
                            field.push(v);
                        }
                        break;
                    case ":":
                        if (v.length > 1) {
                            type = type || [];
                            type.push(v);
                        }
                        break;
                    case "@":
                        if (v.length > 1) {
                            vars = vars || [];
                            vars.push(v);
                        }
                        break;
                }
            }
        }
    }
    return { f: field, t: type, v: vars };
}

export const unaryInstructionTable: Record<MichelsonUnaryInstructionId, boolean> = {
    "DUP": true, "SWAP": true, "SOME": true, "UNIT": true, "PAIR": true, "CAR": true, "CDR": true,
    "CONS": true, "SIZE": true, "MEM": true, "GET": true, "UPDATE": true, "EXEC": true, "APPLY": true, "FAILWITH": true, "RENAME": true, "CONCAT": true, "SLICE": true,
    "PACK": true, "ADD": true, "SUB": true, "MUL": true, "EDIV": true, "ABS": true, "ISNAT": true, "INT": true, "NEG": true, "LSL": true, "LSR": true, "OR": true,
    "AND": true, "XOR": true, "NOT": true, "COMPARE": true, "EQ": true, "NEQ": true, "LT": true, "GT": true, "LE": true, "GE": true, "SELF": true,
    "TRANSFER_TOKENS": true, "SET_DELEGATE": true, "CREATE_ACCOUNT": true, "IMPLICIT_ACCOUNT": true, "NOW": true, "AMOUNT": true,
    "BALANCE": true, "CHECK_SIGNATURE": true, "BLAKE2B": true, "SHA256": true, "SHA512": true, "HASH_KEY": true, "STEPS_TO_QUOTA": true,
    "SOURCE": true, "SENDER": true, "ADDRESS": true, "CHAIN_ID": true,
};

export const instructionTable: Record<MichelsonInstructionId, boolean> = Object.assign({}, unaryInstructionTable, {
    "DROP": true, "DIG": true, "DUG": true, "NONE": true, "LEFT": true, "RIGHT": true, "NIL": true, "UNPACK": true, "CONTRACT": true, "CAST": true,
    "IF_NONE": true, "IF_LEFT": true, "IF_CONS": true, "IF": true, "MAP": true, "ITER": true, "LOOP": true, "LOOP_LEFT": true, "DIP": true,
    "CREATE_CONTRACT": true, "PUSH": true, "EMPTY_SET": true, "EMPTY_MAP": true, "EMPTY_BIG_MAP": true, "LAMBDA": true,
});

export type TezosIDType = "BlockHash" | "OperationHash" | "OperationListHash" | "OperationListListHash" |
    "ProtocolHash" | "ContextHash" | "ED25519PublicKeyHash" | "SECP256K1PublicKeyHash" |
    "P256PublicKeyHash" | "ContractHash" | "CryptoboxPublicKeyHash" | "ED25519Seed" |
    "ED25519PublicKey" | "SECP256K1SecretKey" | "P256SecretKey" | "ED25519EncryptedSeed" |
    "SECP256K1EncryptedSecretKey" | "P256EncryptedSecretKey" | "SECP256K1PublicKey" |
    "P256PublicKey" | "SECP256K1Scalar" | "SECP256K1Element" | "ED25519SecretKey" |
    "ED25519Signature" | "SECP256K1Signature" | "P256Signature" | "GenericSignature" | "ChainID";

export type TezosIDPrefix = [number, number[]]; // payload length, prefix

export const tezosPrefix: Record<TezosIDType, TezosIDPrefix> = {
    BlockHash: [32, [1, 52]], // B(51)
    OperationHash: [32, [5, 116]], // o(51)
    OperationListHash: [32, [133, 233]], // Lo(52)
    OperationListListHash: [32, [29, 159, 109]], // LLo(53)
    ProtocolHash: [32, [2, 170]], // P(51)
    ContextHash: [32, [79, 199]], // Co(52)
    ED25519PublicKeyHash: [20, [6, 161, 159]], // tz1(36)
    SECP256K1PublicKeyHash: [20, [6, 161, 161]], // tz2(36)
    P256PublicKeyHash: [20, [6, 161, 164]], // tz3(36)
    ContractHash: [20, [2, 90, 121]], // KT1(36)
    CryptoboxPublicKeyHash: [16, [153, 103]], // id(30)
    ED25519Seed: [32, [13, 15, 58, 7]], // edsk(54)
    ED25519PublicKey: [32, [13, 15, 37, 217]], // edpk(54)
    SECP256K1SecretKey: [32, [17, 162, 224, 201]], // spsk(54)
    P256SecretKey: [32, [16, 81, 238, 189]], // p2sk(54)
    ED25519EncryptedSeed: [56, [7, 90, 60, 179, 41]], // edesk(88)
    SECP256K1EncryptedSecretKey: [56, [9, 237, 241, 174, 150]], // spesk(88)
    P256EncryptedSecretKey: [56, [9, 48, 57, 115, 171]], // p2esk(88)
    SECP256K1PublicKey: [33, [3, 254, 226, 86]], // sppk(55)
    P256PublicKey: [33, [3, 178, 139, 127]], // p2pk(55)
    SECP256K1Scalar: [33, [38, 248, 136]], // SSp(53)
    SECP256K1Element: [33, [5, 92, 0]], // GSp(54)
    ED25519SecretKey: [64, [43, 246, 78, 7]], // edsk(98)
    ED25519Signature: [64, [9, 245, 205, 134, 18]], // edsig(99)
    SECP256K1Signature: [64, [13, 115, 101, 19, 63]], // spsig1(99)
    P256Signature: [64, [54, 240, 44, 52]], // p2sig(98)
    GenericSignature: [64, [4, 130, 43]], // sig(96)
    ChainID: [4, [87, 82, 0]],
};

export function checkTezosID(id: string | number[], ...types: TezosIDType[]): [TezosIDType, number[]] | null {
    const buf = Array.isArray(id) ? id : decodeBase58Check(id);
    for (const t of types) {
        const prefix = tezosPrefix[t];
        if (buf.length === prefix[0] + prefix[1].length) {
            let i = 0;
            while (i < prefix[1].length && buf[i] === prefix[1][i]) {
                i++;
            }
            if (i === prefix[1].length) {
                return [t, buf.slice(prefix[1].length)];
            }
        }
    }
    return null;
}