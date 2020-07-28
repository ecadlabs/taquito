import { StringLiteral, IntLiteral, Prim } from "./micheline";
import {
    MichelsonType, MichelsonData, MichelsonComparableType, MichelsonMapElt,
    MichelsonTypeId, MichelsonSimpleComparableTypeId, MichelsonInstruction,
    MichelsonTypeOption, MichelsonContract,
    MichelsonContractSection
} from "./michelson-types";
import {
    unpackAnnotations, ObjectTreePath, MichelsonError, isNatural,
    LongInteger, parseBytes, compareBytes, isDecimal, instructionTable,
    checkTezosID, tezosPrefix, UnpackedAnnotations, Nullable, UnpackAnnotationsOptions
} from "./utils";
import { decodeBase58Check } from "./base58";
import { inspect } from "util";

export class MichelsonTypeError extends MichelsonError<MichelsonType | MichelsonType[], MichelsonType | MichelsonData> {
    /**
     * @param val Value of a type node caused the error
     * @param data Value of a data node caused the error
     * @param path Path to a node caused the error
     * @param message An error message
     */
    constructor(val: MichelsonType | MichelsonType[], data?: MichelsonType | MichelsonData, path?: ObjectTreePath[], message?: string) {
        super(val, data, path, message);
        Object.setPrototypeOf(this, MichelsonTypeError.prototype);
    }
}

export enum TypeEqualityMode {
    Field,
    Strict,
    Loose
}

function assertScalarTypesEqual(a: MichelsonType, b: MichelsonType, path: ObjectTreePath[], mode: TypeEqualityMode): void {
    function getAnnotations(t: MichelsonType): UnpackedAnnotations {
        try {
            return unpackAnnotations(t);
        } catch (err) {
            if (err instanceof Error) {
                throw new MichelsonTypeError(a, b, path, `${t.prim}: ${err.message}`);
            } else {
                throw err;
            }
        }
    }

    if (a.prim !== b.prim) {
        throw new MichelsonTypeError(a, b, path, `types mismatch: ${a.prim} != ${b.prim}`);
    }

    if (mode !== TypeEqualityMode.Loose) {
        const ann = [getAnnotations(a), getAnnotations(b)];
        if (ann[0].t && ann[1].t && ann[0].t[0] !== ann[1].t[0]) {
            throw new MichelsonTypeError(a, b, path, `${a.prim}: type names mismatch: ${ann[0].t[0]} != ${ann[1].t[0]}`);
        }
        if (mode === TypeEqualityMode.Field &&
            (ann[0].f && ann[1].f && ann[0].f[0] !== ann[1].f[0])) {
            throw new MichelsonTypeError(a, b, path, `${a.prim}: field names mismatch: ${ann[0].f[0]} != ${ann[1].f}`);
        }
    }

    switch (a.prim) {
        case "option":
        case "list":
        case "contract":
        case "set":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }], mode === TypeEqualityMode.Loose ? TypeEqualityMode.Loose : TypeEqualityMode.Strict);
            break;

        case "pair":
        case "or":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }], mode === TypeEqualityMode.Loose ? TypeEqualityMode.Loose : TypeEqualityMode.Field);
            assertScalarTypesEqual(a.args[1], (b as typeof a).args[1], [...path, { index: 1, val: a.args[1] }], mode === TypeEqualityMode.Loose ? TypeEqualityMode.Loose : TypeEqualityMode.Field);
            break;

        case "lambda":
        case "map":
        case "big_map":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }], mode === TypeEqualityMode.Loose ? TypeEqualityMode.Loose : TypeEqualityMode.Strict);
            assertScalarTypesEqual(a.args[1], (b as typeof a).args[1], [...path, { index: 1, val: a.args[1] }], mode === TypeEqualityMode.Loose ? TypeEqualityMode.Loose : TypeEqualityMode.Strict);
    }
}

function assertTypesEqualInternal<T1 extends MichelsonType | MichelsonType[], T2 extends T1>(a: T1, b: T2, path: ObjectTreePath[] = [], mode: TypeEqualityMode = TypeEqualityMode.Strict): void {
    if (Array.isArray(a)) {
        // type guards don't work for parametrized generic types
        const aa = a as MichelsonType[];
        const bb = b as MichelsonType[];
        if (aa.length !== bb.length) {
            throw new MichelsonTypeError(aa, undefined, path, `stack length mismatch: ${aa.length} != ${bb.length}`);
        }
        for (let i = 0; i < aa.length; i++) {
            assertScalarTypesEqual(aa[i], bb[i], [...path, { index: i, val: aa[i] }], mode);
        }
    } else {
        assertScalarTypesEqual(a as MichelsonType, b as MichelsonType, path, mode);
    }
}

export function assertTypeAnnotationsValid(t: MichelsonType, path: ObjectTreePath[] = [], field: boolean = false): void {
    function getAnnotations(t: MichelsonType): UnpackedAnnotations {
        try {
            return unpackAnnotations(t);
        } catch (err) {
            if (err instanceof Error) {
                throw new MichelsonTypeError(t, undefined, path, `${t.prim}: ${err.message}`);
            } else {
                throw err;
            }
        }
    }

    const ann = getAnnotations(t);
    if ((ann.t?.length || 0) > 1) {
        throw new MichelsonTypeError(t, undefined, path, `${t.prim}: at most one type annotation allowed: ${t.annots}`);
    }

    if (field) {
        if ((ann.f?.length || 0) > 1) {
            throw new MichelsonTypeError(t, undefined, path, `${t.prim}: at most one field annotation allowed: ${t.annots}`);
        }
    } else {
        if ((ann.f?.length || 0) > 0) {
            throw new MichelsonTypeError(t, undefined, path, `${t.prim}: field annotations aren't allowed: ${t.annots}`);
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

// Data integrity check

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

// Simplified version of assertMichelsonInstruction() for previously validated data
function isFunction(d: MichelsonData): d is MichelsonInstruction[] {
    if (!Array.isArray(d)) {
        return false;
    }
    for (const v of d) {
        if (!(Array.isArray(v) && isFunction(v) ||
            ("prim" in v) && Object.prototype.hasOwnProperty.call(instructionTable, v.prim))) {
            return false;
        }
    }
    return true;
}

function assertDataValidInternal(t: MichelsonType, d: MichelsonData, contract?: MichelsonContract, path: ObjectTreePath[] = []): void {
    switch (t.prim) {
        // Atomic literals
        case "int":
            if (("int" in d) && isDecimal(d.int)) {
                return;
            }
            throw new MichelsonTypeError(t, d, path, `integer value expected: ${d}`);

        case "nat":
        case "mutez":
            if (("int" in d) && isNatural(d.int)) {
                return;
            }
            throw new MichelsonTypeError(t, d, path, `natural value expected: ${d}`);

        case "string":
            if ("string" in d) {
                return;
            }
            throw new MichelsonTypeError(t, d, path, `string value expected: ${d}`);

        case "bytes":
            if ("bytes" in d) {
                return;
            }
            throw new MichelsonTypeError(t, d, path, `bytes value expected: ${d}`);

        case "bool":
            if (("prim" in d) && (d.prim === "True" || d.prim === "False")) {
                return;
            }
            throw new MichelsonTypeError(t, d, path, `boolean value expected: ${d}`);

        case "key_hash":
            if (("string" in d) &&
                checkTezosID(d.string,
                    "ED25519PublicKeyHash",
                    "SECP256K1PublicKeyHash",
                    "P256PublicKeyHash") !== null) {
                return;
            }
            throw new MichelsonTypeError(t, d, path, `key hash expected: ${d}`);

        case "timestamp":
            if ((("string" in d) || ("int" in d)) && parseDate(d) !== null) {
                return;
            }
            throw new MichelsonTypeError(t, d, path, `timestamp expected: ${d}`);

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
            throw new MichelsonTypeError(t, d, path, `address expected: ${d}`);

        case "key":
            if (("string" in d) &&
                checkTezosID(d.string,
                    "ED25519PublicKey",
                    "SECP256K1PublicKey",
                    "P256PublicKey") !== null) {
                return;
            }
            throw new MichelsonTypeError(t, d, path, `public key expected: ${d}`);

        case "unit":
            if (("prim" in d) && d.prim === "Unit") {
                return;
            }
            throw new MichelsonTypeError(t, d, path, `unit value expected: ${d}`);

        case "signature":
            if (("string" in d) &&
                checkTezosID(d.string,
                    "ED25519Signature",
                    "SECP256K1Signature",
                    "P256Signature",
                    "GenericSignature") !== null) {
                return;
            }
            throw new MichelsonTypeError(t, d, path, `signature expected: ${d}`);

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
            throw new MichelsonTypeError(t, d, path, `chain id expected: ${d}`);

        case "operation":
            throw new MichelsonTypeError(t, d, path, "operation type can't be represented as a literal value");

        case "contract":
            throw new MichelsonTypeError(t, d, path, "contract type can't be represented as a literal value");

        // Complex types
        case "option":
            if ("prim" in d) {
                if (d.prim === "None") {
                    return;
                } else if (d.prim === "Some") {
                    assertDataValidInternal(t.args[0], d.args[0], contract, [...path, { index: 0, val: t.args[0] }]);
                    return;
                }
            }
            throw new MichelsonTypeError(t, d, path, `option expected: ${d}`);

        case "list":
        case "set":
            if (Array.isArray(d)) {
                const p = [...path, { index: 0, val: t.args[0] }];
                let prev: MichelsonData | undefined;
                for (const v of d) {
                    if (("prim" in v) && v.prim === "Elt") {
                        throw new MichelsonTypeError(t, d, path, `Elt item outside of a map literal: ${d}`);
                    }
                    assertDataValidInternal(t.args[0], v, contract, p);
                    if (t.prim === "set") {
                        if (prev === undefined) {
                            prev = v;
                        } else if (compareMichelsonData(t.args[0], prev, v) > 0) {
                            throw new MichelsonTypeError(t, d, path, `set elements must be ordered: ${d}`);
                        }
                    }
                }
                return;
            }
            throw new MichelsonTypeError(t, d, path, `${t.prim} expected: ${d}`);

        case "pair":
            if (("prim" in d) && d.prim === "Pair") {
                assertDataValidInternal(t.args[0], d.args[0], contract, [...path, { index: 0, val: t.args[0] }]);
                assertDataValidInternal(t.args[1], d.args[1], contract, [...path, { index: 1, val: t.args[1] }]);
                return;
            }
            throw new MichelsonTypeError(t, d, path, `pair expected: ${d}`);

        case "or":
            if ("prim" in d) {
                if (d.prim === "Left") {
                    assertDataValidInternal(t.args[0], d.args[0], contract, [...path, { index: 0, val: t.args[0] }]);
                    return;
                } else if (d.prim === "Right") {
                    assertDataValidInternal(t.args[1], d.args[0], contract, [...path, { index: 1, val: t.args[1] }]);
                    return;
                }
            }
            throw new MichelsonTypeError(t, d, path, `union (or) expected: ${d}`);

        case "lambda":
            if (isFunction(d)) {
                const body = functionTypeInternal(d, [t.args[0]], contract || null, path);
                if ("failed" in body) {
                    throw new MichelsonTypeError(t, d, path, `function is failed with error type: ${body.failed}`);
                }
                if (body.length !== 1) {
                    throw new MichelsonTypeError(t, d, path, `function must return a value`);
                }
                assertTypesEqualInternal(t.args[1], body[0], [...path, { index: 1, val: t.args[1] }]);
                return;
            }
            throw new MichelsonTypeError(t, d, path, `function expected: ${d}`);

        case "map":
        case "big_map":
            if (Array.isArray(d)) {
                let prev: MichelsonMapElt | undefined;
                for (const v of d) {
                    if (!("prim" in v) || v.prim !== "Elt") {
                        throw new MichelsonTypeError(t, d, path, `map elements expected: ${d}`);
                    }
                    assertDataValidInternal(t.args[0], v.args[0], contract, [...path, { index: 0, val: t.args[0] }]);
                    assertDataValidInternal(t.args[1], v.args[1], contract, [...path, { index: 1, val: t.args[1] }]);
                    if (prev === undefined) {
                        prev = v;
                    } else if (compareMichelsonData(t.args[0], prev.args[0], v.args[0]) > 0) {
                        throw new MichelsonTypeError(t, d, path, `map elements must be ordered: ${d}`);
                    }
                }
                return;
            }
            throw new MichelsonTypeError(t, d, path, `${t.prim} expected: ${d}`);

        default:
            throw new MichelsonTypeError(t, d, path, `unexpected type: ${t}`);
    }
}

// Code validation

export class MichelsonCodeError extends MichelsonError<MichelsonInstruction | MichelsonType | MichelsonType[], MichelsonType | MichelsonType[] | MichelsonData> {
    /**
     * @param val Value of a type node caused the error
     * @param stackState Current stack state
     * @param path Path to a node caused the error
     * @param message An error message
     */
    constructor(val: MichelsonInstruction | MichelsonType | MichelsonType[], data: MichelsonType | MichelsonType[] | MichelsonData | undefined, public stackState: MichelsonStackType, path?: ObjectTreePath[], message?: string) {
        super(val, data, path, message);
        Object.setPrototypeOf(this, MichelsonCodeError.prototype);
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

/*
export interface InstructionTrace {
    op: MichelsonInstruction;
    in: MichelsonType | MichelsonType[];
    out: MichelsonStackType;
    nested?: InstructionTrace[][];
}

interface FunctionTypeResult {
    ret: MichelsonStackType;
    trace: InstructionTrace
}
*/

function functionTypeInternal(inst: MichelsonInstruction, stack: MichelsonType[], contract: MichelsonContract | null, path: ObjectTreePath[]): MichelsonStackType {
    if (Array.isArray(inst)) {
        let i = 0;
        for (const ins of inst) {
            const s = functionTypeInternal(ins, stack, contract, [...path, { index: i, val: ins }]);
            if ("failed" in s) {
                return s;
            }
            stack = s;
            i++;
        }
        return stack;
    }
    const instruction = inst; // Make it const for type guarding

    // make sure the stack has enough number of arguments of specific types
    function args<T extends ((readonly MichelsonTypeId[]) | null)[]>(n: number, ...typeIds: T): StackType<T> {
        if (stack.length < typeIds.length + n) {
            throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: stack must have at least ${typeIds.length} element(s)`);
        }

        let i = n;
        for (const ids of typeIds) {
            if (ids !== null && ids.length !== 0) {
                let ii = 0;
                while (ii < ids.length && ids[ii] !== stack[i].prim) {
                    ii++;
                }
                if (ii === ids.length) {
                    throw new MichelsonCodeError(instruction, stack[i], stack, path, `${instruction.prim}: stack type mismatch: [${i}] expected to be ${ids}, got ${stack[i].prim} instead`);
                }
            }
            i++;
        }
        return stack.slice(n, typeIds.length + n) as StackType<T>;
    }

    function assertComparableType(type: MichelsonType) {
        if (Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, type.prim)) {
            return;
        } else if (type.prim === "pair" && Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, type.args[0].prim)) {
            assertComparableType(type.args[1]);
        } else {
            throw new MichelsonCodeError(instruction, type, stack, path, `${instruction.prim}: comparable type expected: ${type}`);
        }
    }

    // rethrows an error with a correct path inside the code tree
    const wrap = <T extends unknown[], U>(fn: (...args: T) => U) => {
        return (...args: T): U => {
            try {
                return fn(...args);
            } catch (err) {
                if (err instanceof MichelsonError) {
                    throw new MichelsonCodeError(instruction, err.val, stack, path, `${instruction.prim}: ${err.message}`);
                } else {
                    throw err;
                }
            }
        };
    };

    const getAnnotations = wrap(unpackAnnotations);

    // unpack instruction annotations and assert their maximum number
    function instructionAnnotations(num: { f?: number; t?: number; v?: number }, opt?: UnpackAnnotationsOptions) {
        const a = getAnnotations(instruction, opt);
        const assertNum = (a: string[] | undefined, n: number | undefined, type: string) => {
            if (a && a.length > (n || 0)) {
                throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: at most ${n || 0} ${type} annotations allowed`);
            }
        };
        assertNum(a.f, num.f, "field");
        assertNum(a.t, num.t, "type");
        assertNum(a.v, num.v, "variable");
        return a;
    }

    // also keeps annotation class if null is provided
    function annotate<T extends MichelsonType>(t: T, a: Nullable<UnpackedAnnotations>): T {
        const src = getAnnotations(t);
        const ann = (a.v !== undefined || a.t !== undefined || a.f !== undefined) ?
            [
                ...((a.v === null ? src.v : a.v) || []),
                ...((a.t === null ? src.t : a.t) || []),
                ...((a.f === null ? src.f : a.f) || [])
            ] : undefined;

        const { annots, ...rest } = t;
        return { ...(rest as T), ...(ann && ann.length !== 0 && { annots: ann }) };
    }

    // shortcut to copy at most one variable annotation from the instruction to the type
    function annotateVar<T extends MichelsonType>(t: T, def?: string) {
        const ia = instructionAnnotations({ v: 1 });
        return annotate(t, { v: ia.v !== undefined ? ia.v : def !== undefined ? [def] : null });
    }

    const varSuffix = (a: UnpackedAnnotations, suffix: string) => ["@" + (a.v ? a.v[0].slice(1) + "." : "") + suffix];
    const ensureTypesEqual = wrap(assertTypesEqualInternal);

    function branchType(br0: MichelsonStackType, br1: MichelsonStackType): MichelsonStackType {
        if (("failed" in br0) || ("failed" in br1)) {
            if (("failed" in br0) && ("failed" in br1)) {
                try {
                    assertTypesEqualInternal(br0.failed, br1.failed);
                    return br0;
                } catch {
                    return { failed: { prim: "or", args: [br0.failed, br1.failed] } }; // Might be useful for debugging
                }
            } else {
                return ("failed" in br0) ? br1 : br0;
            }
        } else {
            ensureTypesEqual(br0, br1);
            return br0;
        }
    }

    function getEntrypoint(contract: MichelsonContract | MichelsonType, ep?: string): MichelsonType {
        let entrypoint: MichelsonType | null;
        try {
            entrypoint = contractEntrypoint(contract, ep);
        } catch (err) {
            if (err instanceof Error) {
                throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: ${err.message}`);
            } else {
                throw err;
            }
        }
        if (entrypoint === null) {
            throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: contract has no entrypoint named ${ep}`);
        }
        return entrypoint;
    }

    console.log(inspect(instruction, false, null));
    console.log(inspect(stack, false, null));

    switch (instruction.prim) {
        case "DUP":
            return [args(0, null)[0], ...stack];

        case "SWAP":
            {
                const s = args(0, null, null);
                instructionAnnotations({});
                return [s[1], s[0], ...stack.slice(2)];
            }

        case "SOME":
            return [annotate({ prim: "option", args: [args(0, null)[0]] }, instructionAnnotations({ t: 1, v: 1 })), ...stack.slice(1)];

        case "UNIT":
            return [annotate({ prim: "unit" }, instructionAnnotations({ v: 1, t: 1 })), ...stack];

        case "PAIR":
            {
                const s = args(0, null, null);
                const va = [getAnnotations(s[0]), getAnnotations(s[1])] as const; // stack annotations
                const ia = instructionAnnotations({ f: 2, t: 1, v: 1 }, { specialFields: true, emptyFields: true }); // instruction annotations
                const trim = (s: string) => {
                    const i = s.indexOf(".");
                    return s.slice(i > 0 ? i + 1 : 1);
                };
                const field = (n: 0 | 1) =>
                    ia.f && ia.f.length > n && ia.f[n] !== "%" ?
                        ia.f[n] === "%@" ?
                            va[n].v ? ["%" + trim(va[n].v?.[0] || "")] : undefined :
                            [ia.f[n]] :
                        undefined;

                return [annotate({
                    prim: "pair", args: [
                        annotate(s[0], { v: null, t: null, f: field(0) }),
                        annotate(s[1], { v: null, t: null, f: field(1) }),
                    ]
                }, { t: ia.t, v: ia.v }), ...stack.slice(2)];
            }

        case "CAR":
        case "CDR":
            {
                const s = args(0, ["pair"]);
                const ia = instructionAnnotations({ f: 1, v: 1 }, { specialVar: true });
                const child = s[0].args[instruction.prim === "CAR" ? 0 : 1];
                const ca = getAnnotations(child);
                if (ia.f && ca.f && ia.f[0] !== ca.f[0]) {
                    throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: field names doesn't match: ${ia.f[0]} !== ${ca.f[0]}`);
                }
                const va = getAnnotations(s[0]);
                return [annotate(child, {
                    t: null,
                    v: ia.v ?
                        ia.v[0] === "@%" ?
                            ca.f ? ["@" + ca.f[0].slice(1)] : undefined :
                            ia.v[0] === "@%%" ?
                                va.v ?
                                    ["@" + va.v[0].slice(1) + "." + (ca.f ? ca.f[0].slice(1) : instruction.prim.toLocaleLowerCase())] :
                                    ca.f ? ["@" + ca.f[0].slice(1)] : undefined :
                                ia.v :
                        null
                }), ...stack.slice(1)];
            }

        case "CONS":
            {
                const s = args(0, null, ["list"]);
                ensureTypesEqual(s[0], s[1].args[0]);
                return [annotateVar(s[1]), ...stack.slice(2)];
            }

        case "SIZE":
            args(0, ["string", "list", "set", "map", "bytes"]);
            return [annotateVar({ prim: "nat" }), ...stack.slice(1)];

        case "MEM":
            {
                const s = args(0, null, ["set", "map", "big_map"]);
                assertComparableType(s[0]);
                ensureTypesEqual(s[0], s[1].args[0]);
                return [annotateVar({ prim: "bool" }), ...stack.slice(2)];
            }

        case "GET":
            {
                const s = args(0, null, ["map", "big_map"]);
                assertComparableType(s[0]);
                ensureTypesEqual(s[0], s[1].args[0]);
                return [annotateVar({ prim: "option", args: [s[1].args[1]] }), ...stack.slice(2)];
            }

        case "UPDATE":
            {
                const s0 = args(0, null, ["bool", "option"]);
                assertComparableType(s0[0]);
                if (s0[1].prim === "bool") {
                    const s2 = args(2, ["set"]);
                    ensureTypesEqual(s0[0], s2[0].args[0]);
                    return [annotateVar(s2[0]), ...stack.slice(3)];
                } else {
                    const s2 = args(2, ["map", "big_map"]);
                    ensureTypesEqual(s0[0], s2[0].args[0]);
                    return [annotateVar(s2[0]), ...stack.slice(3)];
                }
            }

        case "EXEC":
            {
                const s = args(0, null, ["lambda"]);
                ensureTypesEqual(s[0], s[1].args[0]);
                return [annotateVar(s[1].args[1]), ...stack.slice(2)];
            }

        case "APPLY":
            {
                const s = args(0, null, ["lambda"]);
                if (s[1].args[0].prim !== "pair") {
                    throw new MichelsonCodeError(instruction, s[1], stack, path, `${instruction.prim}: function's argument must be a pair: ${s[1].args[0].prim}`);
                }
                const pt = s[1].args[0];
                ensureTypesEqual(s[0], pt.args[0]);
                return [annotateVar({ prim: "lambda", args: [pt.args[1], s[1].args[1]] }), ...stack.slice(2)];
            }

        case "FAILWITH":
            return { failed: args(0, null)[0] };

        case "RENAME":
            return [annotateVar(args(0, null)[0]), ...stack.slice(1)];

        case "CONCAT":
            {
                const s0 = args(0, ["string", "list", "bytes"]);
                if (s0[0].prim === "list") {
                    if (s0[0].args[0].prim !== "string" && s0[0].args[0].prim !== "bytes") {
                        throw new MichelsonCodeError(instruction, s0[0], stack, path, `${instruction.prim}: can't concatenate list of ${s0[0].args[0].prim}'s`);
                    }
                    return [annotateVar(s0[0].args[0]), ...stack.slice(1)];
                } else {
                    const s1 = args(1, ["string", "bytes"]);
                    if (s0[0].prim !== s1[0].prim) {
                        throw new MichelsonCodeError(instruction, s1[0], stack, path, `${instruction.prim}: can't concatenate ${s0[0].prim} with ${s1[0].prim}`);
                    }
                    return [annotateVar(s1[0]), ...stack.slice(2)];
                }
            }

        case "SLICE":
            return [annotateVar({ prim: "option", args: [args(0, ["nat"], ["nat"], ["string", "bytes"])[2]] }), ...stack.slice(3)];

        case "PACK":
            {
                const s = args(0, null);
                if (s[0].prim === "big_map" || s[0].prim === "operation") {
                    throw new MichelsonCodeError(instruction, s[0], stack, path, `${instruction.prim}: non packable type: ${s[0].prim}`);
                }
                return [annotateVar({ prim: "bytes" }), ...stack.slice(1)];
            }

        case "ADD":
            {
                const s = args(0, ["nat", "int", "timestamp", "mutez"], ["nat", "int", "timestamp", "mutez"]);
                if (s[0].prim === "nat" && s[1].prim === "nat") {
                    return [annotateVar({ prim: "nat" }), ...stack.slice(2)];
                } else if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) {
                    return [annotateVar({ prim: "int" }), ...stack.slice(2)];
                } else if (s[0].prim === "int" && s[1].prim === "timestamp" || s[0].prim === "timestamp" && s[1].prim === "int") {
                    return [annotateVar({ prim: "timestamp" }), ...stack.slice(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
                    return [annotateVar({ prim: "mutez" }), ...stack.slice(2)];
                } else {
                    throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: can't add ${s[0].prim} to ${s[1].prim}`);
                }
            }

        case "SUB":
            {
                const s = args(0, ["nat", "int", "timestamp", "mutez"], ["nat", "int", "timestamp", "mutez"]);
                if (((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) ||
                    s[0].prim === "timestamp" && s[1].prim === "timestamp") {
                    return [annotateVar({ prim: "int" }), ...stack.slice(2)];
                } else if (s[0].prim === "timestamp" && s[1].prim === "int") {
                    return [annotateVar({ prim: "timestamp" }), ...stack.slice(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
                    return [annotateVar({ prim: "mutez" }), ...stack.slice(2)];
                } else {
                    throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: can't subtract ${s[0].prim} from ${s[1].prim}`);
                }
            }

        case "MUL":
            {
                const s = args(0, ["nat", "int", "mutez"], ["nat", "int", "mutez"]);
                if (s[0].prim === "nat" && s[1].prim === "nat") {
                    return [annotateVar({ prim: "nat" }), ...stack.slice(2)];
                } else if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) {
                    return [annotateVar({ prim: "int" }), ...stack.slice(2)];
                } else if (s[0].prim === "nat" && s[1].prim === "mutez" || s[0].prim === "mutez" && s[1].prim === "nat") {
                    return [annotateVar({ prim: "mutez" }), ...stack.slice(2)];
                } else {
                    throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: can't multiply ${s[0].prim} by ${s[1].prim}`);
                }
            }

        case "EDIV":
            {
                const res = (a: "nat" | "int" | "mutez", b: "nat" | "int" | "mutez"): MichelsonTypeOption => ({ prim: "option", args: [{ prim: "pair", args: [{ prim: a }, { prim: b }] }] });
                const s = args(0, ["nat", "int", "mutez"], ["nat", "int", "mutez"]);
                if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) {
                    return [annotateVar(res("int", "nat")), ...stack.slice(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "nat") {
                    return [annotateVar(res("mutez", "mutez")), ...stack.slice(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
                    return [annotateVar(res("nat", "mutez")), ...stack.slice(2)];
                } else {
                    throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: can't euclideally divide ${s[0].prim} by ${s[1].prim}`);
                }
            }

        case "ABS":
            args(0, ["int"]);
            return [annotateVar({ prim: "nat" }), ...stack.slice(1)];

        case "ISNAT":
            args(0, ["int"]);
            return [annotateVar({ prim: "option", args: [{ prim: "nat" }] }), ...stack.slice(1)];

        case "INT":
            args(0, ["nat"]);
            return [annotateVar({ prim: "int" }), ...stack.slice(1)];

        case "NEG":
            args(0, ["nat", "int"]);
            return [annotateVar({ prim: "int" }), ...stack.slice(1)];

        case "LSL":
        case "LSR":
            args(0, ["nat"], ["nat"]);
            return [annotateVar({ prim: "nat" }), ...stack.slice(2)];

        case "OR":
        case "XOR":
            {
                const s = args(0, ["nat", "bool"], ["nat", "bool"]);
                if (s[0].prim !== s[1].prim) {
                    throw new MichelsonCodeError(instruction, s[0], stack, path, `${instruction.prim}: both arguments must be of the same type: ${s[0].prim}, ${s[1].prim}`);
                }
                return [annotateVar(s[1]), ...stack.slice(2)];
            }

        case "AND":
            {
                const s = args(0, ["nat", "bool", "int"], ["nat", "bool"]);
                if ((s[0].prim !== "int" || s[1].prim !== "nat") && s[0].prim !== s[1].prim) {
                    throw new MichelsonCodeError(instruction, s[0], stack, path, `${instruction.prim}: both arguments must be of the same type: ${s[0].prim}, ${s[1].prim}`);
                }
                return [annotateVar(s[1]), ...stack.slice(2)];
            }

        case "NOT":
            {
                const s = args(0, ["nat", "bool", "int"]);
                if (s[0].prim === "bool") {
                    return [annotateVar({ prim: "bool" }), ...stack.slice(1)];
                } else {
                    return [annotateVar({ prim: "int" }), ...stack.slice(1)];
                }
            }

        case "COMPARE":
            {
                const s = args(0, null, null);
                assertComparableType(s[0]);
                assertComparableType(s[1]);
                return [annotateVar({ prim: "int" }), ...stack.slice(2)];
            }

        case "EQ":
        case "NEQ":
        case "LT":
        case "GT":
        case "LE":
        case "GE":
            args(0, ["int"]);
            return [annotateVar({ prim: "bool" }), ...stack.slice(1)];

        case "SELF":
            {
                if (!contract) {
                    throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: contract required`);
                }
                const ia = instructionAnnotations({ f: 1, v: 1 });
                const ep = getEntrypoint(contract, ia.f?.[0]);
                return [annotate({ prim: "contract", args: [ep] }, { v: ia.v ? ia.v : ["@self"] }), ...stack];
            }

        case "TRANSFER_TOKENS":
            {
                const s = args(0, null, ["mutez"], ["contract"]);
                ensureTypesEqual(s[0], s[2].args[0]);
                return [annotateVar({ prim: "operation" }), ...stack.slice(3)];
            }

        case "SET_DELEGATE":
            {
                const s = args(0, ["option"]);
                if (s[0].args[0].prim !== "key_hash") {
                    throw new MichelsonCodeError(instruction, s[0], stack, path, `${instruction.prim}: key hash expected: ${s[0].args[0].prim}`);
                }
                return [annotateVar({ prim: "operation" }), ...stack.slice(1)];
            }

        case "CREATE_ACCOUNT":
            {
                const ia = instructionAnnotations({ v: 2 }, { emptyVar: true });
                const s = args(0, ["key_hash"], ["option"], ["bool"], ["mutez"]);
                if (s[1].args[0].prim !== "key_hash") {
                    throw new MichelsonCodeError(instruction, s[1], stack, path, `${instruction.prim}: key hash expected: ${s[1].args[0].prim}`);
                }
                return [
                    annotate({ prim: "operation" }, { v: ia.v && ia.v.length > 0 && ia.v[0] !== "@" ? [ia.v[0]] : undefined }),
                    annotate({ prim: "address" }, { v: ia.v && ia.v.length > 1 && ia.v[1] !== "@" ? [ia.v[1]] : undefined }),
                    ...stack.slice(4)
                ];
            }

        case "IMPLICIT_ACCOUNT":
            args(0, ["key_hash"]);
            return [annotateVar({ prim: "contract", args: [{ prim: "unit" }] }), ...stack.slice(1)];

        case "NOW":
            return [annotateVar({ prim: "timestamp" }, "@now"), ...stack];

        case "AMOUNT":
            return [annotateVar({ prim: "mutez" }, "@amount"), ...stack];

        case "BALANCE":
            return [annotateVar({ prim: "mutez" }, "@balance"), ...stack];

        case "CHECK_SIGNATURE":
            args(0, ["key"], ["signature"], ["bytes"]);
            return [annotateVar({ prim: "bool" }), ...stack.slice(3)];

        case "BLAKE2B":
        case "SHA256":
        case "SHA512":
            args(0, ["bytes"]);
            return [annotateVar({ prim: "bytes" }), ...stack.slice(1)];

        case "HASH_KEY":
            args(0, ["key"]);
            return [annotateVar({ prim: "key_hash" }), ...stack.slice(1)];

        case "STEPS_TO_QUOTA":
            return [annotateVar({ prim: "nat" }, "@steps"), ...stack];

        case "SOURCE":
            return [annotateVar({ prim: "address" }, "@source"), ...stack];

        case "SENDER":
            return [annotateVar({ prim: "address" }, "@sender"), ...stack];

        case "ADDRESS":
            {
                const s = args(0, ["contract"]);
                const ia = instructionAnnotations({ v: 1 });
                return [
                    annotate({ prim: "address" }, { v: ia.v ? ia.v : varSuffix(getAnnotations(s[0]), "address") }),
                    ...stack.slice(1)];
            }

        case "CHAIN_ID":
            return [annotateVar({ prim: "chain_id" }), ...stack];

        case "DROP":
            {
                instructionAnnotations({});
                const n = instruction.args !== undefined ? parseInt(instruction.args[0].int, 10) : 1;
                args(n - 1, null);
                return stack.slice(n);
            }

        case "DIG":
            {
                instructionAnnotations({});
                const n = parseInt(instruction.args[0].int, 10);
                return [args(n, null)[0], ...stack.slice(0, n), ...stack.slice(n + 1)];
            }

        case "DUG":
            {
                instructionAnnotations({});
                const n = parseInt(instruction.args[0].int, 10);
                return [...stack.slice(1, n + 1), args(0, null)[0], ...stack.slice(n + 1)];
            }

        case "NONE":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            return [annotate({ prim: "option", args: [instruction.args[0]] }, instructionAnnotations({ t: 1, v: 1 })), ...stack];

        case "LEFT":
        case "RIGHT":
            {
                const s = args(0, null);
                const ia = instructionAnnotations({ f: 2, t: 1, v: 1 }, { specialFields: true });
                const va = getAnnotations(s[0]);

                const children: [MichelsonType, MichelsonType] = [
                    annotate(s[0], {
                        t: null,
                        v: null,
                        f: ia.f && ia.f.length > 0 && ia.f[0] !== "%" ?
                            ia.f[0] === "%@" ?
                                va.v ? ["%" + va.v[0].slice(1)] : undefined :
                                ia.f :
                            undefined,
                    }),
                    annotate(instruction.args[0], {
                        t: null,
                        f: ia.f && ia.f.length > 1 && ia.f[1] !== "%" ? ia.f : undefined,
                    }),
                ];

                return [annotate({
                    prim: "or", args: instruction.prim === "LEFT" ? children : [children[1], children[0]]
                }, { t: ia.t, v: ia.v }), ...stack.slice(2)];
            }

        case "NIL":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            return [annotate({ prim: "list", args: [instruction.args[0]] }, instructionAnnotations({ t: 1, v: 1 })), ...stack];

        case "UNPACK":
            args(0, ["bytes"]);
            if (instruction.args[0].prim === "big_map" || instruction.args[0].prim === "operation") {
                throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: non packable type: ${instruction.args[0].prim}`);
            }
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            return [annotateVar({ prim: "option", args: [instruction.args[0]] }), ...stack.slice(1)];

        case "CONTRACT":
            {
                const s = args(0, ["address"]);
                assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
                const ia = instructionAnnotations({ v: 1, f: 1 });
                return [
                    annotate({ prim: "option", args: [{ prim: "contract", args: [instruction.args[0]] }] }, { v: ia.v ? ia.v : varSuffix(getAnnotations(s[0]), "contract") }),
                    ...stack.slice(1)];
            }

        case "CAST":
            const s = args(0, null);
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            assertTypesEqualInternal(instruction.args[0], s[0], [...path, { index: 0, val: instruction.args[0] }], TypeEqualityMode.Loose);
            return stack;

        case "IF_NONE":
            {
                instructionAnnotations({});
                const s = args(0, ["option"]);
                const tail = stack.slice(1);
                const br0 = functionTypeInternal(instruction.args[0], tail, contract, [...path, { index: 0, val: instruction.args[0] }]);
                const br1 = functionTypeInternal(instruction.args[1],
                    [annotate(s[0].args[0], { t: null, v: varSuffix(getAnnotations(s[0]), "some") }), ...tail],
                    contract, [...path, { index: 1, val: instruction.args[1] }]);
                return branchType(br0, br1);
            }

        case "IF_LEFT":
            {
                instructionAnnotations({});
                const s = args(0, ["or"]);
                const va = getAnnotations(s[0]);
                const lefta = getAnnotations(s[0].args[0]);
                const righta = getAnnotations(s[0].args[1]);
                const tail = stack.slice(1);
                const br0 = functionTypeInternal(instruction.args[0],
                    [
                        annotate(s[0].args[0], { t: null, v: varSuffix(va, lefta.f ? lefta.f[0].slice(1) : "left") }),
                        ...tail
                    ],
                    contract, [...path, { index: 0, val: instruction.args[0] }]);
                const br1 = functionTypeInternal(instruction.args[1],
                    [
                        annotate(s[0].args[1], { t: null, v: varSuffix(va, righta.f ? righta.f[0].slice(1) : "right") }),
                        ...tail
                    ],
                    contract, [...path, { index: 1, val: instruction.args[1] }]);
                return branchType(br0, br1);
            }

        case "IF_CONS":
            {
                instructionAnnotations({});
                const s = args(0, ["list"]);
                const va = getAnnotations(s[0]);
                const tail = stack.slice(1);
                const br0 = functionTypeInternal(instruction.args[0],
                    [
                        annotate(s[0].args[0], { t: null, v: varSuffix(va, "hd") }),
                        annotate(s[0], { t: null, v: varSuffix(va, "tl") }),
                        ...tail
                    ],
                    contract, [...path, { index: 0, val: instruction.args[0] }]);
                const br1 = functionTypeInternal(instruction.args[1], tail, contract, [...path, { index: 1, val: instruction.args[1] }]);
                return branchType(br0, br1);
            }

        case "IF":
            {
                instructionAnnotations({});
                args(0, ["bool"]);
                const tail = stack.slice(1);
                const br0 = functionTypeInternal(instruction.args[0], tail, contract, [...path, { index: 0, val: instruction.args[0] }]);
                const br1 = functionTypeInternal(instruction.args[1], tail, contract, [...path, { index: 1, val: instruction.args[1] }]);
                return branchType(br0, br1);
            }

        case "MAP":
            {
                const s = args(0, ["list", "map"]);
                const tail = stack.slice(1);
                const elt = s[0].prim === "map" ? { prim: "pair" as const, args: s[0].args } : s[0].args[0];
                const body = functionTypeInternal(instruction.args[0],
                    [annotate(elt, { t: null, v: varSuffix(getAnnotations(s[0]), "elt") }), ...tail],
                    contract, [...path, { index: 0, val: instruction.args[0] }]);
                if ("failed" in body) {
                    return body;
                }
                if (body.length < 1) {
                    throw new MichelsonCodeError(instruction, undefined, stack, path, `${instruction.prim}: function must return a value`);
                }
                ensureTypesEqual(body.slice(1), tail);
                if (s[0].prim === "list") {
                    return [annotateVar({ prim: "list", args: [body[0]] }), ...tail];
                } else {
                    return [annotateVar({ prim: "map", args: [s[0].args[0], body[0]] }), ...tail];
                }
            }

        case "ITER":
            {
                instructionAnnotations({});
                const s = args(0, ["set", "list", "map"]);
                const tail = stack.slice(1);
                const elt = s[0].prim === "map" ? { prim: "pair" as const, args: s[0].args } : s[0].args[0];
                const body = functionTypeInternal(instruction.args[0],
                    [annotate(elt, { t: null, v: varSuffix(getAnnotations(s[0]), "elt") }), ...tail],
                    contract, [...path, { index: 0, val: instruction.args[0] }]);
                if ("failed" in body) {
                    return body;
                }
                ensureTypesEqual(body, tail);
                return tail;
            }

        case "LOOP":
            {
                instructionAnnotations({});
                args(0, ["bool"]);
                const tail = stack.slice(1);
                const body = functionTypeInternal(instruction.args[0], tail, contract, [...path, { index: 0, val: instruction.args[0] }]);
                if ("failed" in body) {
                    return body;
                }
                ensureTypesEqual(body, [{ prim: "bool" }, ...tail]);
                return tail;
            }

        case "LOOP_LEFT":
            {
                instructionAnnotations({});
                const s = args(0, ["or"]);
                const tail = stack.slice(1);
                const body = functionTypeInternal(instruction.args[0],
                    [annotate(s[0].args[0], { t: null, v: varSuffix(getAnnotations(s[0]), "left") }), ...tail],
                    contract, [...path, { index: 0, val: instruction.args[0] }]);
                if ("failed" in body) {
                    return body;
                }
                ensureTypesEqual(body, [s[0], ...tail]);
                return [annotate(s[0].args[1], { t: null, v: instructionAnnotations({ v: 1 }).v }), ...tail];
            }

        case "DIP":
            {
                instructionAnnotations({});
                const n = instruction.args.length === 2 ? parseInt(instruction.args[0].int, 10) : 1;
                args(n - 1, null);
                const head = stack.slice(0, n);
                const tail = stack.slice(n);
                // ternary operator is a type guard so use it instead of just `instruction.args.length - 1`
                const body = instruction.args.length === 2 ?
                    functionTypeInternal(instruction.args[1], tail, contract, [...path, { index: 1, val: instruction.args[1] }]) :
                    functionTypeInternal(instruction.args[0], tail, contract, [...path, { index: 0, val: instruction.args[0] }]);
                if ("failed" in body) {
                    return body;
                }
                return [...head, ...body];
            }

        case "CREATE_CONTRACT":
            {
                const ia = instructionAnnotations({ v: 2 }, { emptyVar: true });
                const s = args(0, ["option"], ["mutez"], null);
                if (s[0].args[0].prim !== "key_hash") {
                    throw new MichelsonCodeError(instruction, s[0], stack, path, `${instruction.prim}: key hash expected: ${s[0].args[0].prim}`);
                }
                assertContractValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
                ensureTypesEqual(contractSection(instruction.args[0], "storage")[0].args[0], s[2]);
                return [
                    annotate({ prim: "operation" }, { v: ia.v && ia.v.length > 0 && ia.v[0] !== "@" ? [ia.v[0]] : undefined }),
                    annotate({ prim: "address" }, { v: ia.v && ia.v.length > 1 && ia.v[1] !== "@" ? [ia.v[1]] : undefined }),
                    ...stack.slice(3)
                ];
            }

        case "PUSH":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            assertDataValidInternal(instruction.args[0], instruction.args[1], contract || undefined, [...path, { index: 0, val: instruction.args[0] }]);
            return [annotateVar(instruction.args[0]), ...stack];

        case "EMPTY_SET":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            return [annotate({ prim: "set", args: instruction.args }, instructionAnnotations({ t: 1, v: 1 })), ...stack];

        case "EMPTY_MAP":
        case "EMPTY_BIG_MAP":
            assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
            assertTypeAnnotationsValid(instruction.args[1], [...path, { index: 1, val: instruction.args[1] }]);
            return [annotate({ prim: instruction.prim === "EMPTY_MAP" ? "map" : "big_map", args: instruction.args }, instructionAnnotations({ t: 1, v: 1 })), ...stack];

        case "LAMBDA":
            {
                assertTypeAnnotationsValid(instruction.args[0], [...path, { index: 0, val: instruction.args[0] }]);
                assertTypeAnnotationsValid(instruction.args[1], [...path, { index: 1, val: instruction.args[1] }]);
                const body = functionTypeInternal(instruction.args[2], [instruction.args[0]], contract, [...path, { index: 2, val: instruction.args[2] }]);
                if ("failed" in body) {
                    return body;
                }
                if (body.length !== 1) {
                    throw new MichelsonCodeError(instruction, body, stack, path, `${instruction.prim}: function must return a value`);
                }
                assertTypesEqualInternal(instruction.args[1], body[0], [...path, { index: 1, val: instruction.args[1] }]);
                return [annotateVar({ prim: "lambda", args: [instruction.args[0], instruction.args[1]] }), ...stack];
            }

        default:
            throw new Error(`Unexpected instruction: ${(instruction as Prim).prim}`);
    }
}

function contractSection<T extends "parameter" | "storage" | "code">(contract: MichelsonContract, section: T): [MichelsonContractSection<T>, number] {
    let i = 0;
    for (const s of contract) {
        if (s.prim === section) {
            return [s as MichelsonContractSection<T>, i];
        }
        i++;
    }
    throw new Error(`missing contract section: ${section}`);
}

export function contractEntrypoint(contract: MichelsonContract | MichelsonType, ep?: string): MichelsonType | null {
    const parameter = Array.isArray(contract) ? contractSection(contract, "parameter")[0].args[0] : contract;

    function lookup(parameter: MichelsonType, ep?: string): MichelsonType | null {
        const a = unpackAnnotations(parameter);
        if (a.f && a.f[0] === (ep || "%default")) {
            return parameter;
        } else if (parameter.prim === "or") {
            const left = lookup(parameter.args[0], ep);
            const right = lookup(parameter.args[1], ep);
            if (left !== null && right !== null) {
                throw new Error(`duplicate entrypoint: ${ep}`);
            } else {
                return left || right;
            }
        } else {
            return null;
        }
    }

    const entrypoint = lookup(parameter, ep);

    return entrypoint !== null ? entrypoint :
        ep === undefined || ep === "%default" ? parameter : null;
}

// Contract validation

export function assertContractValid(contract: MichelsonContract, path: ObjectTreePath[] = []): void {
    const parameter = contractSection(contract, "parameter");
    assertTypeAnnotationsValid(parameter[0].args[0], [...path, { index: parameter[1], val: parameter[0] }]);

    const storage = contractSection(contract, "storage");
    assertTypeAnnotationsValid(storage[0].args[0], [...path, { index: storage[1], val: storage[0] }]);

    const annotateVar = (t: MichelsonType, a: string) => ({ ...t, ...{ annots: [a] } });
    const arg: MichelsonType = {
        "prim": "pair",
        args: [
            annotateVar(parameter[0].args[0], "@parameter"),
            annotateVar(storage[0].args[0], "@storage"),
        ]
    };

    const code = contractSection(contract, "code");
    const ret = functionTypeInternal(code[0].args[0], [arg], contract, [...path, { index: code[1], val: code[0] }]);

    if ("failed" in ret) {
        throw new MichelsonCodeError(code[0].args[0], ret.failed, ret, [...path, { index: code[1], val: code[0] }], `contract fails with ${ret.failed.prim} error type`);
    }

    const expected: MichelsonType = {
        "prim": "pair",
        args: [
            { "prim": "list", args: [{ "prim": "operation" }] },
            storage[0].args[0],
        ]
    };

    try {
        assertTypesEqualInternal(ret, [expected]);
    } catch (err) {
        if (err instanceof MichelsonError) {
            throw new MichelsonCodeError(code[0].args[0], undefined, ret, [...path, { index: code[1], val: code[0] }], err.message);
        } else {
            throw err;
        }
    }
}

// Exported wrapper functions

export function assertDataValid(t: MichelsonType, d: MichelsonData, contract?: MichelsonContract, path: ObjectTreePath[] = []): void {
    assertTypeAnnotationsValid(t, path);
    assertDataValidInternal(t, d, contract, path);
}

export function functionType(inst: MichelsonInstruction, stack: MichelsonType[], contract?: MichelsonContract, path: ObjectTreePath[] = []): MichelsonStackType {
    let i = 0;
    for (const t of stack) {
        assertTypeAnnotationsValid(t, [...path, { index: i++, val: t }]);
    }

    if (contract) {
        for (const typesec of ["parameter", "storage"] as const) {
            const sec = contractSection(contract, typesec);
            assertTypeAnnotationsValid(sec[0].args[0], [...path, { index: sec[1], val: sec[0] }]);
        }
    }

    return functionTypeInternal(inst, stack, contract || null, path);
}

export function assertTypesEqual<T1 extends MichelsonType | MichelsonType[], T2 extends T1>(a: T1, b: T2, path: ObjectTreePath[] = [], mode: TypeEqualityMode = TypeEqualityMode.Strict): void {
    if (Array.isArray(a)) {
        // type guards don't work for parametrized generic types
        const aa = a as MichelsonType[];
        const bb = b as MichelsonType[];
        for (let i = 0; i < aa.length; i++) {
            assertTypeAnnotationsValid(aa[i], [...path, { index: i, val: aa[i] }]);
        }
        for (let i = 0; i < bb.length; i++) {
            assertTypeAnnotationsValid(bb[i], [...path, { index: i, val: bb[i] }]);
        }
    } else {
        assertTypeAnnotationsValid(a as MichelsonType, path);
        assertTypeAnnotationsValid(b as MichelsonType, path);
    }
    assertTypesEqualInternal(a, b, path, mode);
}