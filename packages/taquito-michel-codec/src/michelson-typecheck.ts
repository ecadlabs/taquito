import { MichelsonType, MichelsonData, MichelsonComparableType, MichelsonDataId, MichelsonMapElt, MichelsonDataLiteral } from "./michelson-types";
import { decodeBase58Check } from "./base58";
import { LongInteger, compareBytes, parseBytes, isDecimal, isNatural } from "./utils";
import { IntLiteral, StringLiteral } from "./micheline";

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

interface PathElem {
    /**
     * An argument index
     */
    index: number;
    /**
     * Node's value.
     */
    val: MichelsonType;
}

export class MichelsonTypeError extends Error {
    /**
     * @param val Value of a type node caused the error
     * @param path Path to a node caused the error
     * @param message An error message
     */
    constructor(public val: MichelsonType, public path?: PathElem[], message?: string) {
        super(message);
    }
}

export class MichelsonDataError extends MichelsonTypeError {
    /**
     * @param val Value of a type node caused the error
     * @param data Value of a data node caused the error
     * @param path Path to a node caused the error
     * @param message An error message
     */
    constructor(val: MichelsonType, public data: MichelsonData, path?: PathElem[], message?: string) {
        super(val, path, message);
    }
}

function getAnnotations(a?: string[]): {
    field?: string[];
    type?: string[];
    var?: string[];
} {
    let field: string[] | undefined;
    let type: string[] | undefined;
    let vars: string[] | undefined;

    if (a !== undefined) {
        for (const v of a) {
            if (v.length !== 0) {
                switch (v[0]) {
                    case "%":
                        field = field || [];
                        field.push(v);
                        break;
                    case ":":
                        type = type || [];
                        type.push(v);
                        break;
                    case "@":
                        vars = vars || [];
                        vars.push(v);
                        break;
                    default:
                        throw new Error(`unexpected annotation prefix: ${v[0]}`);
                }
            }
        }
    }
    return { field, type, var: vars };
}

function assertTypesEqualInternal(a: MichelsonType, b: MichelsonType, path: PathElem[], field: boolean = false): void {
    if (a.prim !== b.prim) {
        throw new MichelsonTypeError(a, path, `unequal types: ${a.prim} != ${b.prim}`);
    }

    const ann = [getAnnotations(a.annots), getAnnotations(b.annots)];
    for (const v of ann) {
        if ((v.type?.length || 0) > 1) {
            throw new MichelsonTypeError(a, path, `at most one type annotation allowed: ${v.type}`);
        }
        if ((v.field?.length || 0) > 1) {
            throw new MichelsonTypeError(a, path, `at most one field annotation allowed: ${v.field}`);
        }
    }

    if (ann[0].type !== undefined && ann[1].type !== undefined && ann[0].type[0] !== ann[1].type[0]) {
        throw new MichelsonTypeError(a, path, `unequal type names: ${ann[0].type[0]} != ${ann[1].type[0]}`);
    }

    if (field &&
        (ann[0].field?.length !== ann[1].field?.length || ann[0].field?.[0] !== ann[1].field?.[0])) {
        throw new MichelsonTypeError(a, path, `unequal field names: ${ann[0].field?.[0]} != ${ann[1].field?.[0]}`);
    }

    switch (a.prim) {
        case "option":
        case "list":
        case "contract":
        case "set":
            assertTypesEqualInternal(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }]);
            break;

        case "pair":
        case "or":
            assertTypesEqualInternal(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }], true);
            assertTypesEqualInternal(a.args[1], (b as typeof a).args[1], [...path, { index: 1, val: a.args[1] }], true);
            break;

        case "lambda":
        case "map":
        case "big_map":
            assertTypesEqualInternal(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }]);
            assertTypesEqualInternal(a.args[1], (b as typeof a).args[1], [...path, { index: 1, val: a.args[1] }]);
    }
}

export function assertTypesEqual(a: MichelsonType, b: MichelsonType): void {
    assertTypesEqualInternal(a, b, []);
}

export function typesEqual(a: MichelsonType, b: MichelsonType): boolean {
    try {
        assertTypesEqualInternal(a, b, []);
        return true;
    } catch {
        return false;
    }
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

function assertDataValidInternal(t: MichelsonType, d: MichelsonData, path: PathElem[]): void {
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
                    assertDataValidInternal(t.args[0], d.args[0], [...path, { index: 0, val: t.args[0] }]);
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
                    assertDataValidInternal(t.args[0], v, p);
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
                assertDataValidInternal(t.args[0], d.args[0], [...path, { index: 0, val: t.args[0] }]);
                assertDataValidInternal(t.args[1], d.args[1], [...path, { index: 1, val: t.args[1] }]);
                return;
            }
            throw new MichelsonDataError(t, d, path, `pair expected: ${d}`);

        case "or":
            if ("prim" in d) {
                if (d.prim === "Left") {
                    assertDataValidInternal(t.args[0], d.args[0], [...path, { index: 0, val: t.args[0] }]);
                    return;
                } else if (d.prim === "Right") {
                    assertDataValidInternal(t.args[1], d.args[0], [...path, { index: 1, val: t.args[1] }]);
                    return;
                }
            }
            throw new MichelsonDataError(t, d, path, `union (or) expected: ${d}`);

        case "lambda":
            // TODO
            throw new Error("lambdas aren't implemented");

        case "map":
        case "big_map":
            if (Array.isArray(d)) {
                let prev: MichelsonMapElt | undefined;
                for (const v of d) {
                    if (!("prim" in v) || v.prim !== "Elt") {
                        throw new MichelsonDataError(t, d, path, `map elements expected: ${d}`);
                    }
                    assertDataValidInternal(t.args[0], v.args[0], [...path, { index: 0, val: t.args[0] }]);
                    assertDataValidInternal(t.args[1], v.args[1], [...path, { index: 1, val: t.args[1] }]);
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

export function assertDataValid(t: MichelsonType, d: MichelsonData): void {
    assertDataValidInternal(t, d, []);
}