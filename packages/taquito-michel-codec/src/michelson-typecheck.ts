import { StringLiteral, IntLiteral, Prim } from "./micheline";
import {
    MichelsonType, MichelsonData, MichelsonComparableType, MichelsonMapElt,
    MichelsonTypeId, MichelsonSimpleComparableTypeId, MichelsonInstruction,
    MichelsonTypeOption
} from "./michelson-types";
import { assertMichelsonInstruction } from "./michelson-validator";
import {
    getAnnotations, ObjectTreePath, MichelsonError, isNatural,
    LongInteger, parseBytes, compareBytes, isDecimal
} from "./utils";
import { decodeBase58Check } from "./base58";

// Type equality check

export class MichelsonTypeError extends MichelsonError<MichelsonType | MichelsonType[]> { }

function assertScalarTypesEqual(a: MichelsonType, b: MichelsonType, path: ObjectTreePath[], field: boolean = false): void {
    if (a.prim !== b.prim) {
        throw new MichelsonTypeError(a, path, `unequal types: ${a.prim} != ${b.prim}`);
    }

    const ann = [getAnnotations(a.annots), getAnnotations(b.annots)];
    if ((ann[0].type !== undefined || ann[1].type !== undefined) && ann[0].type?.[0] !== ann[1].type?.[0]) {
        throw new MichelsonTypeError(a, path, `unequal type names: ${ann[0].type?.[0] || "<undefined>"} != ${ann[1].type?.[0] || "<undefined>"}`);
    }
    if (field &&
        ((ann[0].field !== undefined || ann[1].field !== undefined) && ann[0].field?.[0] !== ann[1].field?.[0])) {
        throw new MichelsonTypeError(a, path, `unequal field names: ${ann[0].field?.[0] || "<undefined>"} != ${ann[1].field?.[0] || "<undefined>"}`);
    }

    switch (a.prim) {
        case "option":
        case "list":
        case "contract":
        case "set":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }]);
            break;

        case "pair":
        case "or":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }], true);
            assertScalarTypesEqual(a.args[1], (b as typeof a).args[1], [...path, { index: 1, val: a.args[1] }], true);
            break;

        case "lambda":
        case "map":
        case "big_map":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }]);
            assertScalarTypesEqual(a.args[1], (b as typeof a).args[1], [...path, { index: 1, val: a.args[1] }]);
    }
}

function assertTypeAnnotationsValid(t: MichelsonType, path: ObjectTreePath[], field: boolean = false): void {
    const ann = getAnnotations(t.annots);
    if ((ann.type?.length || 0) > 1) {
        throw new MichelsonTypeError(t, path, `${t.prim}: at most one type annotation allowed: ${t.annots}`);
    }

    if (field) {
        if ((ann.field?.length || 0) > 1) {
            throw new MichelsonTypeError(t, path, `${t.prim}: at most one field annotation allowed: ${t.annots}`);
        }
    } else {
        if ((ann.field?.length || 0) > 0) {
            throw new MichelsonTypeError(t, path, `${t.prim}: field annotations aren't allowed here: ${t.annots}`);
        }
    }

    switch (t.prim) {
        case "option":
        case "list":
        case "contract":
        case "set":
            assertTypeAnnotationsValid(t.args[0], [...path, { index: 0, val: t.args[0] }]);
            break;

        case "pair":
        case "or":
            assertTypeAnnotationsValid(t.args[0], [...path, { index: 0, val: t.args[0] }], true);
            assertTypeAnnotationsValid(t.args[1], [...path, { index: 1, val: t.args[1] }], true);
            break;

        case "lambda":
        case "map":
        case "big_map":
            assertTypeAnnotationsValid(t.args[0], [...path, { index: 0, val: t.args[0] }]);
            assertTypeAnnotationsValid(t.args[1], [...path, { index: 1, val: t.args[1] }]);
    }
}

export function assertTypesEqual<T1 extends MichelsonType | MichelsonType[], T2 extends T1>(a: T1, b: T2, path: ObjectTreePath[] = []): void {
    if (Array.isArray(a)) {
        // type guards don't work for parametrized generic types
        const aa = a as MichelsonType[];
        const bb = b as MichelsonType[];
        if (aa.length !== bb.length) {
            throw new MichelsonTypeError(aa, path, `unequal stack lengths: ${aa.length} != ${bb.length}`);
        }
        for (let i = 0; i < aa.length; i++) {
            assertTypeAnnotationsValid(aa[i], [...path, { index: i, val: aa[0] }]);
            assertTypeAnnotationsValid(bb[i], []);
            assertScalarTypesEqual(aa[i], bb[i], [...path, { index: i, val: aa[0] }]);
        }
    } else {
        assertTypeAnnotationsValid(a as MichelsonType, path);
        assertTypeAnnotationsValid(b as MichelsonType, []);
        assertScalarTypesEqual(a as MichelsonType, b as MichelsonType, path);
    }
}

export function typesEqual<T1 extends MichelsonType | MichelsonType[], T2 extends T1>(a: T1, b: T2): boolean {
    try {
        assertTypesEqual(a, b);
        return true;
    } catch {
        return false;
    }
}

// Data integrity check

export class MichelsonDataError extends MichelsonError<MichelsonType> {
    /**
     * @param val Value of a type node caused the error
     * @param data Value of a data node caused the error
     * @param path Path to a node caused the error
     * @param message An error message
     */
    constructor(val: MichelsonType, public data: MichelsonData, path?: ObjectTreePath[], message?: string) {
        super(val, path, message);
    }
}

type TezosIDType = "BlockHash" | "OperationHash" | "OperationListHash" | "OperationListListHash" |
    "ProtocolHash" | "ContextHash" | "ED25519PublicKeyHash" | "SECP256K1PublicKeyHash" |
    "P256PublicKeyHash" | "ContractHash" | "CryptoboxPublicKeyHash" | "ED25519Seed" |
    "ED25519PublicKey" | "SECP256K1SecretKey" | "P256SecretKey" | "ED25519EncryptedSeed" |
    "SECP256K1EncryptedSecretKey" | "P256EncryptedSecretKey" | "SECP256K1PublicKey" |
    "P256PublicKey" | "SECP256K1Scalar" | "SECP256K1Element" | "ED25519SecretKey" |
    "ED25519Signature" | "SECP256K1Signature" | "P256Signature" | "GenericSignature" | "ChainID";

type TezosIDPrefix = [number, number[]]; // payload length, prefix

const tezosPrefix: Record<TezosIDType, TezosIDPrefix> = {
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

function checkTezosID(id: string | number[], ...types: TezosIDType[]): [TezosIDType, number[]] | null {
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

const rfc3339Re = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(Z|[+-]([01][0-9]|2[0-3]):([0-5][0-9]))$/;

function parseDate(a: StringLiteral | IntLiteral): Date | null {
    if ("string" in a) {
        if (isNatural(a.string)) {
            return new Date(parseInt(a.string, 10));
        } else if (rfc3339Re.test(a.string)) {
            const x = new Date(a.string);
            if (!Number.isNaN(x.valueOf)) {
                return x;
            }
        }
    } else if (isNatural(a.int)) {
        return new Date(parseInt(a.int, 10));
    }
    return null;
}

function compareMichelsonData(t: MichelsonComparableType, a: MichelsonData, b: MichelsonData): number {
    switch (t.prim) {
        case "int":
        case "nat":
        case "mutez":
            if (("int" in a) && ("int" in b)) {
                return new LongInteger(a.int).cmp(new LongInteger(b.int));
            }
            break;

        case "string":
            if (("string" in a) && ("string" in b)) {
                const x = a.string.localeCompare(b.string);
                return x < 0 ? -1 : x > 0 ? 1 : 0;
            }
            break;

        case "bytes":
            if (("bytes" in a) && ("bytes" in b)) {
                const aa = parseBytes(a.bytes);
                const bb = parseBytes(b.bytes);
                if (aa !== null && bb !== null) {
                    return compareBytes(aa, bb);
                }
            }
            break;

        case "bool":
            if (("prim" in a) && ("prim" in b) && (a.prim === "True" || a.prim === "False") && (b.prim === "True" || b.prim === "False")) {
                return a.prim === b.prim ? 0 : a.prim === "False" ? -1 : 1;
            }
            break;

        case "key_hash":
        case "address":
            if (("string" in a) && ("string" in b)) {
                return compareBytes(decodeBase58Check(a.string), decodeBase58Check(b.string));
            }
            break;

        case "timestamp":
            if ((("string" in a) || ("int" in a)) && (("string" in b) || ("int" in b))) {
                const aa = parseDate(a);
                const bb = parseDate(b);
                if (aa !== null && bb !== null) {
                    const x = aa.valueOf() - bb.valueOf();
                    return x < 0 ? -1 : x > 0 ? 1 : 0;
                }
            }
            break;

        case "pair":
            if (("prim" in a) && ("prim" in b) && (a.prim === "Pair") && (b.prim === "Pair")) {
                const x = compareMichelsonData(t.args[0], a.args[0], b.args[0]);
                if (x !== 0) {
                    return x;
                }
                return compareMichelsonData(t.args[1], a.args[1], b.args[1]);
            }

    }
    // Unlikely, types are expected to be verified before the function call
    throw new Error(`non comparable values: ${a}, ${b}`);
}

export function assertDataValid(t: MichelsonType, d: MichelsonData, path: ObjectTreePath[] = []): void {
    switch (t.prim) {
        // Atomic literals
        case "int":
            if (("int" in d) && isDecimal(d.int)) {
                return;
            }
            throw new MichelsonDataError(t, d, path, `integer value expected: ${d}`);

        case "nat":
        case "mutez":
            if (("int" in d) && isNatural(d.int)) {
                return;
            }
            throw new MichelsonDataError(t, d, path, `natural value expected: ${d}`);

        case "string":
            if ("string" in d) {
                return;
            }
            throw new MichelsonDataError(t, d, path, `string value expected: ${d}`);

        case "bytes":
            if ("bytes" in d) {
                return;
            }
            throw new MichelsonDataError(t, d, path, `bytes value expected: ${d}`);

        case "bool":
            if (("prim" in d) && (d.prim === "True" || d.prim === "False")) {
                return;
            }
            throw new MichelsonDataError(t, d, path, `boolean value expected: ${d}`);

        case "key_hash":
            if (("string" in d) &&
                checkTezosID(d.string,
                    "ED25519PublicKeyHash",
                    "SECP256K1PublicKeyHash",
                    "P256PublicKeyHash") !== null) {
                return;
            }
            throw new MichelsonDataError(t, d, path, `key hash expected: ${d}`);

        case "timestamp":
            if ((("string" in d) || ("int" in d)) && parseDate(d) !== null) {
                return;
            }
            throw new MichelsonDataError(t, d, path, `timestamp expected: ${d}`);

        case "address":
            if ("string" in d) {
                let address = d.string;
                const ep = d.string.indexOf("%");
                if (ep >= 0) {
                    // trim entry point
                    address = d.string.slice(0, ep);
                }
                if (checkTezosID(address,
                    "ED25519PublicKeyHash",
                    "SECP256K1PublicKeyHash",
                    "P256PublicKeyHash",
                    "ContractHash") !== null) {
                    return;
                }
            }
            throw new MichelsonDataError(t, d, path, `address expected: ${d}`);

        case "key":
            if (("string" in d) &&
                checkTezosID(d.string,
                    "ED25519PublicKey",
                    "SECP256K1PublicKey",
                    "P256PublicKey") !== null) {
                return;
            }
            throw new MichelsonDataError(t, d, path, `public key expected: ${d}`);

        case "unit":
            if (("prim" in d) && d.prim === "Unit") {
                return;
            }
            throw new MichelsonDataError(t, d, path, `unit value expected: ${d}`);

        case "signature":
            if (("string" in d) &&
                checkTezosID(d.string,
                    "ED25519Signature",
                    "SECP256K1Signature",
                    "P256Signature",
                    "GenericSignature") !== null) {
                return;
            }
            throw new MichelsonDataError(t, d, path, `signature expected: ${d}`);

        case "chain_id":
            if ("string" in d) {
                if (checkTezosID(d.string, "ChainID") !== null) {
                    return;
                }
            } else if ("bytes" in d) {
                const x = parseBytes(d.bytes);
                if (x !== null && x.length === tezosPrefix.ChainID[0]) {
                    return;
                }
            }
            throw new MichelsonDataError(t, d, path, `chain id expected: ${d}`);

        case "operation":
            throw new MichelsonDataError(t, d, path, "operation type can't be represented as a literal value");

        case "contract":
            throw new MichelsonDataError(t, d, path, "contract type can't be represented as a literal value");

        // Complex types
        case "option":
            if ("prim" in d) {
                if (d.prim === "None") {
                    return;
                } else if (d.prim === "Some") {
                    assertDataValid(t.args[0], d.args[0], [...path, { index: 0, val: t.args[0] }]);
                    return;
                }
            }
            throw new MichelsonDataError(t, d, path, `option expected: ${d}`);

        case "list":
        case "set":
            if (Array.isArray(d)) {
                const p = [...path, { index: 0, val: t.args[0] }];
                let prev: MichelsonData | undefined;
                for (const v of d) {
                    if (("prim" in v) && v.prim === "Elt") {
                        throw new MichelsonDataError(t, d, path, `Elt item outside of a map literal: ${d}`);
                    }
                    assertDataValid(t.args[0], v, p);
                    if (t.prim === "set") {
                        if (prev === undefined) {
                            prev = v;
                        } else if (compareMichelsonData(t.args[0], prev, v) > 0) {
                            throw new MichelsonDataError(t, d, path, `set elements must be ordered: ${d}`);
                        }
                    }
                }
                return;
            }
            throw new MichelsonDataError(t, d, path, `${t.prim} expected: ${d}`);

        case "pair":
            if (("prim" in d) && d.prim === "Pair") {
                assertDataValid(t.args[0], d.args[0], [...path, { index: 0, val: t.args[0] }]);
                assertDataValid(t.args[1], d.args[1], [...path, { index: 1, val: t.args[1] }]);
                return;
            }
            throw new MichelsonDataError(t, d, path, `pair expected: ${d}`);

        case "or":
            if ("prim" in d) {
                if (d.prim === "Left") {
                    assertDataValid(t.args[0], d.args[0], [...path, { index: 0, val: t.args[0] }]);
                    return;
                } else if (d.prim === "Right") {
                    assertDataValid(t.args[1], d.args[0], [...path, { index: 1, val: t.args[1] }]);
                    return;
                }
            }
            throw new MichelsonDataError(t, d, path, `union (or) expected: ${d}`);

        case "lambda":
            if (Array.isArray(d) && assertMichelsonInstruction(d, path)) {
                const body = instructionType(d, [t.args[0]], path);
                if ("failed" in body) {
                    throw new MichelsonDataError(t, d, path, `function is failed with error type: ${body.failed}`);
                }
                assertTypesEqual([t.args[1]], body, [...path, { index: 1, val: t.args[1] }]);
            }
            throw new MichelsonDataError(t, d, path, `function expected: ${d}`);

        case "map":
        case "big_map":
            if (Array.isArray(d)) {
                let prev: MichelsonMapElt | undefined;
                for (const v of d) {
                    if (!("prim" in v) || v.prim !== "Elt") {
                        throw new MichelsonDataError(t, d, path, `map elements expected: ${d}`);
                    }
                    assertDataValid(t.args[0], v.args[0], [...path, { index: 0, val: t.args[0] }]);
                    assertDataValid(t.args[1], v.args[1], [...path, { index: 1, val: t.args[1] }]);
                    if (prev === undefined) {
                        prev = v;
                    } else if (compareMichelsonData(t.args[0], prev.args[0], v.args[0]) > 0) {
                        throw new MichelsonDataError(t, d, path, `map elements must be ordered: ${d}`);
                    }
                }
                return;
            }
            throw new MichelsonDataError(t, d, path, `${t.prim} expected: ${d}`);

        default:
            throw new MichelsonDataError(t, d, path, `unexpected type: ${t}`);
    }
}

// Code validation

export class MichelsonCodeError extends MichelsonError<MichelsonInstruction> {
    /**
     * @param val Value of a type node caused the error
     * @param stackState Current stack state
     * @param path Path to a node caused the error
     * @param message An error message
     */
    constructor(val: MichelsonInstruction, public stackState: MichelsonStackType, path?: ObjectTreePath[], message?: string) {
        super(val, path, message);
    }
}

export interface MichelsonTypeFailed {
    failed: MichelsonType;
}

export type MichelsonStackType = MichelsonType[] | MichelsonTypeFailed;

type TT1<T1 extends MichelsonTypeId[] | null> = [T1];
type TT2<T1 extends MichelsonTypeId[] | null, T2 extends MichelsonTypeId[] | null> = [T1, T2];
type TT3<T1 extends MichelsonTypeId[] | null, T2 extends MichelsonTypeId[] | null, T3 extends MichelsonTypeId[] | null> = [T1, T2, T3];
type TT4<T1 extends MichelsonTypeId[] | null, T2 extends MichelsonTypeId[] | null, T3 extends MichelsonTypeId[] | null, T4 extends MichelsonTypeId[] | null> = [T1, T2, T3, T4];
type MT<T extends readonly MichelsonTypeId[] | null> = MichelsonType<T extends readonly MichelsonTypeId[] ? T[number] : MichelsonTypeId>;

type StackType<T extends ((readonly MichelsonTypeId[]) | null)[]> =
    T extends TT1<infer T1> ? [MT<T1>] :
    T extends TT2<infer T1, infer T2> ? [MT<T1>, MT<T2>] :
    T extends TT3<infer T1, infer T2, infer T3> ? [MT<T1>, MT<T2>, MT<T3>] :
    T extends TT4<infer T1, infer T2, infer T3, infer T4> ? [MT<T1>, MT<T2>, MT<T3>, MT<T4>] :
    never;

const simpleComparableTypeTable: Record<MichelsonSimpleComparableTypeId, boolean> = {
    "int": true, "nat": true, "string": true, "bytes": true, "mutez": true,
    "bool": true, "key_hash": true, "timestamp": true, "address": true,
};

const packableTypes = ["key_hash", "timestamp", "address", "key", "unit", "signature", "chain_id", "option", "list", "contract", "pair", "or", "lambda", "set", "map"] as const;
const packableTypesTable: Record<(typeof packableTypes)[number], boolean> = {
    "key_hash": true, "timestamp": true, "address": true, "key": true, "unit": true,
    "signature": true, "chain_id": true, "option": true, "list": true, "contract": true,
    "pair": true, "or": true, "lambda": true, "set": true, "map": true
};

export function instructionType(instruction: MichelsonInstruction, stack: MichelsonType[], path: ObjectTreePath[] = []): MichelsonStackType {
    if (Array.isArray(instruction)) {
        let i = 0;
        for (const ins of instruction) {
            const s = instructionType(ins, stack, [...path, { index: i, val: ins }]);
            if ("failed" in s) {
                return s;
            }
            stack = s;
            i++;
        }
        return stack;
    }

    const prim = instruction.prim;

    function top<T extends ((readonly MichelsonTypeId[]) | null)[]>(n: number, ...typeIds: T): StackType<T> {
        if (stack.length < typeIds.length + n) {
            throw new MichelsonCodeError(instruction, stack, path, `${prim}: stack must have at least ${typeIds.length} element(s)`);
        }

        let i = n;
        for (const ids of typeIds) {
            if (ids !== null && ids.length !== 0) {
                let ii = 0;
                while (ii < ids.length && ids[ii] !== stack[i].prim) {
                    ii++;
                }
                if (ii === ids.length) {
                    throw new MichelsonCodeError(instruction, stack, path, `${prim}: stack type mismatch: [${i}] expected to be ${ids}, got ${stack[i].prim} instead`);
                }
            }
            i++;
        }
        return stack.slice(n, typeIds.length + n) as StackType<T>;
    }

    function rest(n?: number): MichelsonType[] {
        if (n !== undefined && stack.length < n) {
            throw new MichelsonCodeError(instruction, stack, path, `${prim}: stack must have at least ${n} element(s)`);
        }
        return stack.slice(n);
    }


    function assertComparableType(type: MichelsonType) {
        if (Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, type.prim)) {
            return;
        } else if (type.prim === "pair" && Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, type.args[0].prim)) {
            assertComparableType(type.args[1]);
        } else {
            throw new MichelsonCodeError(instruction, stack, path, `${prim}: comparable type expected: ${type}`);
        }
    }

    switch (instruction.prim) {
        case "DUP":
            return [...top(0, null), ...stack];

        case "SWAP":
            {
                const s = top(0, null, null);
                return [s[1], s[0], ...stack];
            }

        case "SOME":
            return [{ prim: "option", args: [top(0, null)[0]] }, ...rest(1)];

        case "UNIT":
            return [{ prim: "unit" }, ...stack];

        case "PAIR":
            return [{ prim: "pair", args: top(0, null, null) }, ...rest(2)];

        case "CAR":
        case "CDR":
            return [top(0, ["pair"])[0].args[instruction.prim === "CAR" ? 0 : 1], ...rest(1)];

        case "CONS":
            {
                const s = top(0, null, ["list"]);
                assertTypesEqual(s[0], s[1].args[0], path);
                return rest(1);
            }

        case "SIZE":
            top(0, ["string", "list", "set", "map", "bytes"]);
            return [{ prim: "nat" }, ...rest(1)];

        case "MEM":
            {
                const s = top(0, null, ["set", "map", "big_map"]);
                assertComparableType(s[0]);
                assertTypesEqual(s[0], s[1].args[0], path);
                return [{ prim: "bool" }, ...rest(2)];
            }

        case "GET":
            {
                const s = top(0, null, ["map", "big_map"]);
                assertComparableType(s[0]);
                assertTypesEqual(s[0], s[1].args[0], path);
                return [{ prim: "option", args: [s[1].args[1]] }, ...rest(2)];
            }

        case "UPDATE":
            {
                const s0 = top(0, null, ["bool", "option"]);
                assertComparableType(s0[0]);
                if (s0[1].prim === "bool") {
                    const s2 = top(2, ["set"]);
                    assertTypesEqual(s0[0], s2[0].args[0], path);
                } else {
                    const s2 = top(2, ["map", "big_map"]);
                    assertTypesEqual(s0[0], s2[0].args[0], path);
                }
                return rest(2);
            }

        case "EXEC":
            {
                const s = top(0, null, ["lambda"]);
                assertTypesEqual(s[0], s[1].args[0], path);
                return [s[1].args[1], ...rest(2)];
            }

        case "APPLY":
            {
                const s = top(0, null, ["lambda"]);
                if (s[1].args[0].prim !== "pair") {
                    throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: function's argument must be a pair: ${s[1].args[0].prim}`);
                }
                const pt = s[1].args[0];
                assertTypesEqual(s[0], pt.args[0], path);
                return [{ prim: "lambda", args: [pt.args[1], s[1].args[1]] }, ...rest(2)];
            }

        case "FAILWITH":
            return { failed: top(0, null)[0] };

        case "RENAME":
            top(0, null);
            return stack;

        case "CONCAT":
            {
                const s0 = top(0, ["string", "list", "bytes"]);
                if (s0[0].prim === "list") {
                    if (s0[0].args[0].prim !== "string" && s0[0].args[0].prim !== "bytes") {
                        throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: can't concatenate list of ${s0[0].args[0].prim}'s`);
                    }
                    return [s0[0].args[0], ...rest(1)];
                } else {
                    const s1 = top(1, ["string", "bytes"]);
                    if (s0[0].prim !== s1[0].prim) {
                        throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: can't concatenate ${s0[0].prim} with ${s1[0].prim}`);
                    }
                    return rest(1);
                }
            }

        case "SLICE":
            return [{ prim: "option", args: [top(0, ["nat"], ["nat"], ["string", "bytes"])[2]] }, ...rest(3)];

        case "PACK":
            top(0, packableTypes);
            return [{ prim: "bytes" }, ...rest(1)];

        case "ADD":
            {
                const s = top(0, ["nat", "int", "timestamp", "mutez"], ["nat", "int", "timestamp", "mutez"]);
                if (s[0].prim === "nat" && s[1].prim === "nat") {
                    return [{ prim: "nat" }, ...rest(2)];
                } else if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) {
                    return [{ prim: "int" }, ...rest(2)];
                } else if (s[0].prim === "int" && s[1].prim === "timestamp" || s[0].prim === "timestamp" && s[1].prim === "int") {
                    return [{ prim: "timestamp" }, ...rest(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
                    return [{ prim: "mutez" }, ...rest(2)];
                } else {
                    throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: can't add ${s[0].prim} to ${s[1].prim}`);
                }
            }

        case "SUB":
            {
                const s = top(0, ["nat", "int", "timestamp", "mutez"], ["nat", "int", "timestamp", "mutez"]);
                if (((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) ||
                    s[0].prim === "timestamp" && s[1].prim === "timestamp") {
                    return [{ prim: "int" }, ...rest(2)];
                } else if (s[0].prim === "timestamp" && s[1].prim === "int") {
                    return [{ prim: "timestamp" }, ...rest(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
                    return [{ prim: "mutez" }, ...rest(2)];
                } else {
                    throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: can't subtract ${s[0].prim} from ${s[1].prim}`);
                }
            }

        case "MUL":
            {
                const s = top(0, ["nat", "int", "mutez"], ["nat", "int", "mutez"]);
                if (s[0].prim === "nat" && s[1].prim === "nat") {
                    return [{ prim: "nat" }, ...rest(2)];
                } else if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) {
                    return [{ prim: "int" }, ...rest(2)];
                } else if (s[0].prim === "nat" && s[1].prim === "mutez" || s[0].prim === "mutez" && s[1].prim === "nat") {
                    return [{ prim: "mutez" }, ...rest(2)];
                } else {
                    throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: can't multiply ${s[0].prim} by ${s[1].prim}`);
                }
            }

        case "EDIV":
            {
                const res = (a: "nat" | "int" | "mutez", b: "nat" | "int" | "mutez"): MichelsonTypeOption => ({ prim: "option", args: [{ prim: "pair", args: [{ prim: a }, { prim: b }] }] });
                const s = top(0, ["nat", "int", "mutez"], ["nat", "int", "mutez"]);
                if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) {
                    return [res("int", "nat"), ...rest(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "nat") {
                    return [res("mutez", "mutez"), ...rest(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
                    return [res("nat", "mutez"), ...rest(2)];
                } else {
                    throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: can't euclideally divide ${s[0].prim} by ${s[1].prim}`);
                }
            }

        case "ABS":
            top(0, ["int"]);
            return [{ prim: "nat" }, ...rest(1)];

        case "ISNAT":
            top(0, ["int"]);
            return [{ prim: "option", args: [{ prim: "nat" }] }, ...rest(1)];

        case "INT":
            top(0, ["nat"]);
            return [{ prim: "int" }, ...rest(1)];

        case "NEG":
            top(0, ["nat", "int"]);
            return [{ prim: "int" }, ...rest(1)];

        case "LSL":
        case "LSR":
            top(0, ["nat"], ["nat"]);
            return rest(1);

        case "OR":
        case "XOR":
            {
                const s = top(0, ["nat", "bool"], ["nat", "bool"]);
                if (s[0].prim !== s[1].prim) {
                    throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: both arguments must be of the same type: ${s[0].prim}, ${s[1].prim}`);
                }
                return rest(1);
            }

        case "AND":
            {
                const s = top(0, ["nat", "bool", "int"], ["nat", "bool"]);
                if ((s[0].prim !== "int" || s[1].prim !== "nat") && s[0].prim !== s[1].prim) {
                    throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: both arguments must be of the same type: ${s[0].prim}, ${s[1].prim}`);
                }
                return rest(1);
            }

        case "NOT":
            {
                const s = top(0, ["nat", "bool", "int"]);
                if (s[0].prim === "bool") {
                    return stack;
                } else {
                    return [{ prim: "int" }, ...rest(1)];
                }
            }

        case "COMPARE":
            {
                const s = top(0, null, null);
                assertComparableType(s[0]);
                assertComparableType(s[1]);
                return [{ prim: "int" }, ...rest(2)];
            }

        case "EQ":
        case "NEQ":
        case "LT":
        case "GT":
        case "LE":
        case "GE":
            top(0, ["int"]);
            return [{ prim: "bool" }, ...rest(1)];

        case "SELF":
            // TODO
            throw new Error(`${instruction.prim}: TODO`);

        case "TRANSFER_TOKENS":
            {
                const s = top(0, null, ["mutez"], ["contract"]);
                assertTypesEqual(s[0], s[2].args[0], path);
                return [{ prim: "operation" }, ...rest(3)];
            }

        case "SET_DELEGATE":
            {
                const s = top(0, ["option"]);
                if (s[0].args[0].prim !== "key_hash") {
                    throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: key hash expected: ${s[0].args[0].prim}`);
                }
                return [{ prim: "operation" }, ...rest(1)];
            }

        case "CREATE_ACCOUNT":
            {
                const s = top(0, ["key_hash"], ["option"], ["bool"], ["mutez"]);
                if (s[1].args[0].prim !== "key_hash") {
                    throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: key hash expected: ${s[1].args[0].prim}`);
                }
                return [{ prim: "operation" }, { prim: "address" }, ...rest(4)];
            }

        case "IMPLICIT_ACCOUNT":
            top(0, ["key_hash"]);
            return [{ prim: "contract", args: [{ prim: "unit" }] }, ...rest(1)];

        case "NOW":
            return [{ prim: "timestamp" }, ...stack];

        case "AMOUNT":
        case "BALANCE":
            return [{ prim: "mutez" }, ...stack];

        case "CHECK_SIGNATURE":
            top(0, ["key"], ["signature"], ["bytes"]);
            return [{ prim: "bool" }, ...rest(3)];

        case "BLAKE2B":
        case "SHA256":
        case "SHA512":
            top(0, ["bytes"]);
            return stack;

        case "HASH_KEY":
            top(0, ["key"]);
            return [{ prim: "key_hash" }, ...rest(1)];

        case "STEPS_TO_QUOTA":
            return [{ prim: "nat" }, ...stack];

        case "SOURCE":
        case "SENDER":
            return [{ prim: "address" }, ...stack];

        case "ADDRESS":
            top(0, ["contract"]);
            return [{ prim: "address" }, ...rest(1)];

        case "CHAIN_ID":
            return [{ prim: "chain_id" }, ...stack];

        case "DROP":
            return rest(instruction.args !== undefined ? parseInt(instruction.args[0].int, 10) : 1);

        case "DIG":
            {
                const n = parseInt(instruction.args[0].int, 10);
                return [top(n, null)[0], ...stack.slice(0, n), ...rest(n + 1)];
            }

        case "DUG":
            {
                const n = parseInt(instruction.args[0].int, 10);
                return [...stack.slice(1, n + 1), top(0, null)[0], ...rest(n + 1)];
            }

        case "NONE":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            return [{ prim: "option", args: [instruction.args[0]] }, ...stack];

        case "LEFT":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            return [{ prim: "or", args: [top(0, null)[0], instruction.args[0]] }, ...rest(1)];

        case "RIGHT":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            return [{ prim: "or", args: [instruction.args[0], top(0, null)[0]] }, ...rest(1)];

        case "NIL":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            return [{ prim: "list", args: [instruction.args[0]] }, ...stack];

        case "UNPACK":
            top(0, ["bytes"]);
            if (!Object.prototype.hasOwnProperty.call(packableTypesTable, instruction.args[0].prim)) {
                throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: packable type expected: ${instruction.args[0].prim}`);
            }
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            return [{ prim: "option", args: [instruction.args[0]] }, ...rest(1)];

        case "CONTRACT":
            top(0, ["address"]);
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            return [{ prim: "option", args: [{ prim: "contract", args: [instruction.args[0]] }] }, ...rest(1)];

        case "CAST":
            // TODO
            throw new Error(`${instruction.prim}: TODO`);

        case "IF_NONE":
        case "IF_LEFT":
        case "IF_CONS":
        case "IF":
            {
                top(0, [instruction.prim === "IF_NONE" ? "option" : instruction.prim === "IF_LEFT" ? "or" : instruction.prim === "IF_CONS" ? "list" : "bool"]);
                const br0 = instructionType(instruction.args[0], rest(1), [...path, { index: 0, val: instruction.args[0] }]);
                const br1 = instructionType(instruction.args[1], rest(1), [...path, { index: 1, val: instruction.args[1] }]);
                if (("failed" in br0) || ("failed" in br1)) {
                    if (("failed" in br0) && ("failed" in br1)) {
                        if (typesEqual(br0.failed, br1.failed)) {
                            return br0;
                        } else {
                            return { failed: { prim: "or", args: [br0.failed, br1.failed] } }; // Might be useful for debugging
                        }
                    } else {
                        return ("failed" in br0) ? br1 : br0;
                    }
                } else {
                    assertTypesEqual(br0, br1, path);
                    return br0;
                }
            }

        case "MAP":
            {
                const s = top(0, ["list", "map"]);
                const tail = rest(1);
                const elt = s[0].prim === "map" ? { prim: "pair" as const, args: s[0].args } : s[0].args[0];
                const body = instructionType(instruction.args[0], [elt, ...tail], [...path, { index: 0, val: instruction.args[0] }]);
                if ("failed" in body) {
                    return body;
                }
                if (body.length < 1) {
                    throw new MichelsonCodeError(instruction, stack, path, `${instruction.prim}: body must return a value`);
                }
                assertTypesEqual(tail, body.slice(1), path);
                if (s[0].prim === "list") {
                    return [{ prim: "list", args: [body[0]] }, ...tail];
                } else {
                    return [{ prim: "map", args: [s[0].args[0], body[0]] }, ...tail];
                }
            }

        case "ITER":
            {
                const s = top(0, ["set", "list", "map"]);
                const tail = rest(1);
                const elt = s[0].prim === "map" ? { prim: "pair" as const, args: s[0].args } : s[0].args[0];
                const body = instructionType(instruction.args[0], [elt, ...tail], [...path, { index: 0, val: instruction.args[0] }]);
                if ("failed" in body) {
                    return body;
                }
                assertTypesEqual(tail, body, path);
                return tail;
            }

        case "LOOP":
            {
                top(0, ["bool"]);
                const tail = rest(1);
                const body = instructionType(instruction.args[0], tail, [...path, { index: 0, val: instruction.args[0] }]);
                if ("failed" in body) {
                    return body;
                }
                assertTypesEqual([{ prim: "bool" }, ...tail], body, path);
                return tail;
            }

        case "LOOP_LEFT":
            {
                const s = top(0, ["or"]);
                const tail = rest(1);
                const body = instructionType(instruction.args[0], [s[0].args[0], ...tail], [...path, { index: 0, val: instruction.args[0] }]);
                if ("failed" in body) {
                    return body;
                }
                assertTypesEqual([s[0], ...tail], body, path);
                return [s[0].args[1], ...tail];
            }

        case "DIP":
            {
                const n = instruction.args.length === 2 ? parseInt(instruction.args[0].int, 10) : 1;
                const tail = rest(n);
                const head = stack.slice(0, n);
                // ternary operator is a type guard so use it instead of just `instruction.args.length - 1`
                const body = instruction.args.length === 2 ?
                    instructionType(instruction.args[1], tail, [...path, { index: 1, val: instruction.args[1] }]) :
                    instructionType(instruction.args[0], tail, [...path, { index: 0, val: instruction.args[0] }]);
                if ("failed" in body) {
                    return body;
                }
                return [...head, ...body];
            }

        case "CREATE_CONTRACT":
            // TODO
            throw new Error(`${instruction.prim}: TODO`);

        case "PUSH":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            assertDataValid(instruction.args[0], instruction.args[1], [...path, { index: 0, val: instruction.args[0] }]);
            return [instruction.args[0], ...stack];

        case "EMPTY_SET":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            return [{ prim: "set", args: instruction.args }, ...stack];

        case "EMPTY_MAP":
        case "EMPTY_BIG_MAP":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            assertTypeAnnotationsValid(instruction.args[1], [...path, { index: 1, val: instruction.args[1] }]);
            return [{ prim: instruction.prim === "EMPTY_MAP" ? "map" : "big_map", args: instruction.args }, ...stack];

        case "LAMBDA":
            {
                assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
                assertTypeAnnotationsValid(instruction.args[1], [...path, { index: 1, val: instruction.args[1] }]);
                const body = instructionType(instruction.args[2], [instruction.args[0]], [...path, { index: 2, val: instruction.args[2] }]);
                if ("failed" in body) {
                    return body;
                }
                assertTypesEqual([instruction.args[1]], body, [...path, { index: 1, val: instruction.args[1] }]);
                return [{ prim: "lambda", args: [instruction.args[0], instruction.args[1]] }, ...stack];
            }

        default:
            throw new Error(`Unexpected instruction: ${(instruction as Prim).prim}`);
    }
}
