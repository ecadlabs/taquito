import { StringLiteral, IntLiteral, Prim } from "./micheline";
import {
    MichelsonType, MichelsonData, MichelsonComparableType, MichelsonMapElt,
    MichelsonTypeId, MichelsonInstruction,
    MichelsonTypeOption, MichelsonContract,
    MichelsonContractSection, MichelsonStackType
} from "./michelson-types";
import {
    unpackAnnotations, MichelsonError, isNatural,
    LongInteger, parseBytes, compareBytes, isDecimal, instructionTable,
    checkTezosID, tezosPrefix, UnpackedAnnotations, Nullable, UnpackAnnotationsOptions, simpleComparableTypeTable
} from "./utils";
import { decodeBase58Check } from "./base58";

export interface Context {
    contract?: MichelsonContract;
    traceCallback?: (t: InstructionTrace) => void;
}

export class MichelsonTypeError extends MichelsonError<MichelsonType | MichelsonType[]> {
    public data?: MichelsonData;

    /**
     * @param val Value of a type node caused the error
     * @param data Value of a data node caused the error
     * @param message An error message
     */
    constructor(val: MichelsonType | MichelsonType[], data?: MichelsonData, message?: string) {
        super(val, message);
        if (data !== undefined) {
            this.data = data;
        }
        Object.setPrototypeOf(this, MichelsonTypeError.prototype);
    }
}

export class MichelsonInstructionError extends MichelsonError<MichelsonInstruction> {
    /**
     * @param val Value of a type node caused the error
     * @param stackState Current stack state
     * @param message An error message
     */
    constructor(val: MichelsonInstruction, public stackState: MichelsonStackType, message?: string) {
        super(val, message);
        Object.setPrototypeOf(this, MichelsonInstructionError.prototype);
    }
}

function assertScalarTypesEqual(a: MichelsonType, b: MichelsonType, field: boolean = false): void {
    if (a.prim !== b.prim) {
        throw new MichelsonTypeError(a, undefined, `types mismatch: ${a.prim} != ${b.prim}`);
    }

    const ann = [unpackAnnotations(a), unpackAnnotations(b)];
    if (ann[0].t && ann[1].t && ann[0].t[0] !== ann[1].t[0]) {
        throw new MichelsonTypeError(a, undefined, `${a.prim}: type names mismatch: ${ann[0].t[0]} != ${ann[1].t[0]}`);
    }
    if (field &&
        (ann[0].f && ann[1].f && ann[0].f[0] !== ann[1].f[0])) {
        throw new MichelsonTypeError(a, undefined, `${a.prim}: field names mismatch: ${ann[0].f[0]} != ${ann[1].f}`);
    }

    switch (a.prim) {
        case "option":
        case "list":
        case "contract":
        case "set":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0]);
            break;

        case "pair":
        case "or":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0], true);
            assertScalarTypesEqual(a.args[1], (b as typeof a).args[1], true);
            break;

        case "lambda":
        case "map":
        case "big_map":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0]);
            assertScalarTypesEqual(a.args[1], (b as typeof a).args[1]);
    }
}

function assertTypesEqualInternal<T1 extends MichelsonType | MichelsonType[], T2 extends T1>(a: T1, b: T2, field: boolean = false): void {
    if (Array.isArray(a)) {
        // type guards don't work for parametrized generic types
        const aa = a as MichelsonType[];
        const bb = b as MichelsonType[];
        if (aa.length !== bb.length) {
            throw new MichelsonTypeError(aa, undefined, `stack length mismatch: ${aa.length} != ${bb.length}`);
        }
        for (let i = 0; i < aa.length; i++) {
            assertScalarTypesEqual(aa[i], bb[i], field);
        }
    } else {
        assertScalarTypesEqual(a as MichelsonType, b as MichelsonType, field);
    }
}

export function assertTypeAnnotationsValid(t: MichelsonType, field: boolean = false): void {
    const ann = unpackAnnotations(t);
    if ((ann.t?.length || 0) > 1) {
        throw new MichelsonTypeError(t, undefined, `${t.prim}: at most one type annotation allowed: ${t.annots}`);
    }

    if (field) {
        if ((ann.f?.length || 0) > 1) {
            throw new MichelsonTypeError(t, undefined, `${t.prim}: at most one field annotation allowed: ${t.annots}`);
        }
    } else {
        if ((ann.f?.length || 0) > 0) {
            throw new MichelsonTypeError(t, undefined, `${t.prim}: field annotations aren't allowed: ${t.annots}`);
        }
    }

    switch (t.prim) {
        case "option":
        case "list":
        case "contract":
        case "set":
            assertTypeAnnotationsValid(t.args[0]);
            break;

        case "pair":
        case "or":
            assertTypeAnnotationsValid(t.args[0], true);
            assertTypeAnnotationsValid(t.args[1], true);
            break;

        case "lambda":
        case "map":
        case "big_map":
            assertTypeAnnotationsValid(t.args[0]);
            assertTypeAnnotationsValid(t.args[1]);
    }
}

// Data integrity check

const rfc3339Re = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[T ]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(Z|[+-]([01][0-9]|2[0-3]):([0-5][0-9]))$/;

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
    throw new MichelsonTypeError(t, undefined, `non comparable values: ${a}, ${b}`);
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

function assertDataValidInternal(t: MichelsonType, d: MichelsonData, ctx: Context | null): void {
    switch (t.prim) {
        // Atomic literals
        case "int":
            if (("int" in d) && isDecimal(d.int)) {
                return;
            }
            throw new MichelsonTypeError(t, d, `integer value expected: ${JSON.stringify(d)}`);

        case "nat":
        case "mutez":
            if (("int" in d) && isNatural(d.int)) {
                return;
            }
            throw new MichelsonTypeError(t, d, `natural value expected: ${JSON.stringify(d)}`);

        case "string":
            if ("string" in d) {
                return;
            }
            throw new MichelsonTypeError(t, d, `string value expected: ${JSON.stringify(d)}`);

        case "bytes":
            if ("bytes" in d) {
                return;
            }
            throw new MichelsonTypeError(t, d, `bytes value expected: ${JSON.stringify(d)}`);

        case "bool":
            if (("prim" in d) && (d.prim === "True" || d.prim === "False")) {
                return;
            }
            throw new MichelsonTypeError(t, d, `boolean value expected: ${JSON.stringify(d)}`);

        case "key_hash":
            if (("string" in d) &&
                checkTezosID(d.string,
                    "ED25519PublicKeyHash",
                    "SECP256K1PublicKeyHash",
                    "P256PublicKeyHash") !== null) {
                return;
            }
            throw new MichelsonTypeError(t, d, `key hash expected: ${JSON.stringify(d)}`);

        case "timestamp":
            if ((("string" in d) || ("int" in d)) && parseDate(d) !== null) {
                return;
            }
            throw new MichelsonTypeError(t, d, `timestamp expected: ${JSON.stringify(d)}`);

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
            throw new MichelsonTypeError(t, d, `address expected: ${JSON.stringify(d)}`);

        case "key":
            if (("string" in d) &&
                checkTezosID(d.string,
                    "ED25519PublicKey",
                    "SECP256K1PublicKey",
                    "P256PublicKey") !== null) {
                return;
            }
            throw new MichelsonTypeError(t, d, `public key expected: ${JSON.stringify(d)}`);

        case "unit":
            if (("prim" in d) && d.prim === "Unit") {
                return;
            }
            throw new MichelsonTypeError(t, d, `unit value expected: ${JSON.stringify(d)}`);

        case "signature":
            if (("string" in d) &&
                checkTezosID(d.string,
                    "ED25519Signature",
                    "SECP256K1Signature",
                    "P256Signature",
                    "GenericSignature") !== null) {
                return;
            }
            throw new MichelsonTypeError(t, d, `signature expected: ${JSON.stringify(d)}`);

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
            throw new MichelsonTypeError(t, d, `chain id expected: ${JSON.stringify(d)}`);

        case "operation":
            throw new MichelsonTypeError(t, d, "operation type can't be represented as a literal value");

        case "contract":
            throw new MichelsonTypeError(t, d, "contract type can't be represented as a literal value");

        // Complex types
        case "option":
            if ("prim" in d) {
                if (d.prim === "None") {
                    return;
                } else if (d.prim === "Some") {
                    assertDataValidInternal(t.args[0], d.args[0], ctx);
                    return;
                }
            }
            throw new MichelsonTypeError(t, d, `option expected: ${JSON.stringify(d)}`);

        case "list":
        case "set":
            if (Array.isArray(d)) {
                let prev: MichelsonData | undefined;
                for (const v of d) {
                    if (("prim" in v) && v.prim === "Elt") {
                        throw new MichelsonTypeError(t, d, `Elt item outside of a map literal: ${JSON.stringify(d)}`);
                    }
                    assertDataValidInternal(t.args[0], v, ctx);
                    if (t.prim === "set") {
                        if (prev === undefined) {
                            prev = v;
                        } else if (compareMichelsonData(t.args[0], prev, v) > 0) {
                            throw new MichelsonTypeError(t, d, `set elements must be ordered: ${JSON.stringify(d)}`);
                        }
                    }
                }
                return;
            }
            throw new MichelsonTypeError(t, d, `${t.prim} expected: ${JSON.stringify(d)}`);

        case "pair":
            if (("prim" in d) && d.prim === "Pair") {
                assertDataValidInternal(t.args[0], d.args[0], ctx);
                assertDataValidInternal(t.args[1], d.args[1], ctx);
                return;
            }
            throw new MichelsonTypeError(t, d, `pair expected: ${JSON.stringify(d)}`);

        case "or":
            if ("prim" in d) {
                if (d.prim === "Left") {
                    assertDataValidInternal(t.args[0], d.args[0], ctx);
                    return;
                } else if (d.prim === "Right") {
                    assertDataValidInternal(t.args[1], d.args[0], ctx);
                    return;
                }
            }
            throw new MichelsonTypeError(t, d, `union (or) expected: ${JSON.stringify(d)}`);

        case "lambda":
            if (isFunction(d)) {
                const ret = functionTypeInternal(d, [t.args[0]], ctx);
                if ("failed" in ret) {
                    throw new MichelsonTypeError(t, d, `function is failed with error type: ${ret.failed}`);
                }
                if (ret.length !== 1) {
                    throw new MichelsonTypeError(t, d, `function must return a value`);
                }
                assertTypesEqualInternal(t.args[1], ret[0]);
                return;
            }
            throw new MichelsonTypeError(t, d, `function expected: ${JSON.stringify(d)}`);

        case "map":
        case "big_map":
            if (Array.isArray(d)) {
                let prev: MichelsonMapElt | undefined;
                for (const v of d) {
                    if (!("prim" in v) || v.prim !== "Elt") {
                        throw new MichelsonTypeError(t, d, `map elements expected: ${JSON.stringify(d)}`);
                    }
                    assertDataValidInternal(t.args[0], v.args[0], ctx);
                    assertDataValidInternal(t.args[1], v.args[1], ctx);
                    if (prev === undefined) {
                        prev = v;
                    } else if (compareMichelsonData(t.args[0], prev.args[0], v.args[0]) > 0) {
                        throw new MichelsonTypeError(t, d, `map elements must be ordered: ${JSON.stringify(d)}`);
                    }
                }
                return;
            }
            throw new MichelsonTypeError(t, d, `${t.prim} expected: ${JSON.stringify(d)}`);

        default:
            throw new MichelsonTypeError((t as MichelsonType), d, `unexpected type: ${(t as MichelsonType).prim}`);
    }
}

// Code validation

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

export interface InstructionTrace {
    op: MichelsonInstruction;
    in: MichelsonType[];
    out: MichelsonStackType;
}

function functionTypeInternal(inst: MichelsonInstruction, stack: MichelsonType[], ctx: Context | null): MichelsonStackType {
    if (Array.isArray(inst)) {
        let ret: MichelsonStackType = stack;
        let s = stack;
        let i = 0;
        for (const op of inst) {
            const ft = functionTypeInternal(op, s, ctx);
            ret = ft;
            if ("failed" in ft) {
                break;
            }
            s = ft;
            i++;
        }

        if (("failed" in ret) && i !== inst.length - 1) {
            throw new MichelsonInstructionError(inst, ret, "FAIL must appear in a tail position");
        }

        if (ctx?.traceCallback !== undefined) {
            const trace: InstructionTrace = {
                op: inst,
                in: stack,
                out: ret,
            };
            ctx.traceCallback(trace);
        }

        return ret;
    }
    const instruction = inst; // Make it const for type guarding

    // make sure the stack has enough number of arguments of specific types
    function args<T extends ((readonly MichelsonTypeId[]) | null)[]>(n: number, ...typeIds: T): StackType<T> {
        if (stack.length < typeIds.length + n) {
            throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: stack must have at least ${typeIds.length} element(s)`);
        }

        let i = n;
        for (const ids of typeIds) {
            if (ids !== null && ids.length !== 0) {
                let ii = 0;
                while (ii < ids.length && ids[ii] !== stack[i].prim) {
                    ii++;
                }
                if (ii === ids.length) {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: stack type mismatch: [${i}] expected to be ${ids}, got ${stack[i].prim} instead`);
                }
            }
            i++;
        }
        return stack.slice(n, typeIds.length + n) as StackType<T>;
    }

    function ensureComparableType(type: MichelsonType): type is MichelsonComparableType {
        if (Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, type.prim)) {
            return true;
        } else if (type.prim === "pair" && Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, type.args[0].prim)) {
            return ensureComparableType(type.args[1]);
        } else {
            throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: comparable type expected: ${type}`);
        }
    }

    function wrap<T extends unknown[], U>(fn: (...args: T) => U) {
        return (...args: T): U => {
            try {
                return fn(...args);
            } catch (err) {
                if (err instanceof MichelsonError) {
                    throw new MichelsonInstructionError(instruction, stack, err.message);
                } else {
                    throw err;
                }
            }
        };
    }

    const argAnnotations = wrap(unpackAnnotations);
    const ensureTypesEqual = wrap(assertTypesEqualInternal);

    // unpack instruction annotations and assert their maximum number
    function instructionAnnotations(num: { f?: number; t?: number; v?: number }, opt?: UnpackAnnotationsOptions) {
        const a = unpackAnnotations(instruction, opt);
        const assertNum = (a: string[] | undefined, n: number | undefined, type: string) => {
            if (a && a.length > (n || 0)) {
                throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: at most ${n || 0} ${type} annotations allowed`);
            }
        };
        assertNum(a.f, num.f, "field");
        assertNum(a.t, num.t, "type");
        assertNum(a.v, num.v, "variable");
        return a;
    }

    // also keeps annotation class if null is provided
    function annotate<T extends MichelsonType>(t: T, a: Nullable<UnpackedAnnotations>): T {
        const src = argAnnotations(t);
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

    function branchType(br0: MichelsonStackType, br1: MichelsonStackType): MichelsonStackType {
        if (("failed" in br0) || ("failed" in br1)) {
            // Might be useful for debugging
            if (("failed" in br0) && ("failed" in br1)) {
                try {
                    assertTypesEqualInternal(br0.failed, br1.failed);
                    return br0;
                } catch {
                    return { failed: { prim: "or", args: [br0.failed, br1.failed] } };
                }
            } else {
                return ("failed" in br0) ? br1 : br0;
            }
        } else {
            ensureTypesEqual(br0, br1);
            return br0;
        }
    }

    let ret: MichelsonStackType;

    switch (instruction.prim) {
        case "DUP":
            ret = [args(0, null)[0], ...stack];
            break;

        case "SWAP":
            {
                const s = args(0, null, null);
                instructionAnnotations({});
                ret = [s[1], s[0], ...stack.slice(2)];
                break;
            }

        case "SOME":
            ret = [annotate({ prim: "option", args: [args(0, null)[0]] }, instructionAnnotations({ t: 1, v: 1 })), ...stack.slice(1)];
            break;

        case "UNIT":
            ret = [annotate({ prim: "unit" }, instructionAnnotations({ v: 1, t: 1 })), ...stack];
            break;

        case "PAIR":
            {
                const s = args(0, null, null);
                const va = [argAnnotations(s[0]), argAnnotations(s[1])] as const; // stack annotations
                const ia = instructionAnnotations({ f: 2, t: 1, v: 1 }, { specialFields: true, emptyFields: true }); // instruction annotations
                const trim = (s: string) => {
                    const i = s.lastIndexOf(".");
                    return s.slice(i > 0 ? i + 1 : 1);
                };
                const field = (n: 0 | 1) =>
                    ia.f && ia.f.length > n && ia.f[n] !== "%" ?
                        ia.f[n] === "%@" ?
                            va[n].v ? ["%" + trim(va[n].v?.[0] || "")] : undefined :
                            [ia.f[n]] :
                        undefined;

                ret = [annotate({
                    prim: "pair", args: [
                        annotate(s[0], { v: null, t: null, f: field(0) }),
                        annotate(s[1], { v: null, t: null, f: field(1) }),
                    ]
                }, { t: ia.t, v: ia.v }), ...stack.slice(2)];
                break;
            }

        case "CAR":
        case "CDR":
            {
                const s = args(0, ["pair"]);
                const ia = instructionAnnotations({ f: 1, v: 1 }, { specialVar: true });
                const child = s[0].args[instruction.prim === "CAR" ? 0 : 1];
                const ca = argAnnotations(child);
                if (ia.f && ca.f && ia.f[0] !== ca.f[0]) {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: field names doesn't match: ${ia.f[0]} !== ${ca.f[0]}`);
                }
                const va = argAnnotations(s[0]);
                ret = [annotate(child, {
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
                break;
            }

        case "CONS":
            {
                const s = args(0, null, ["list"]);
                ensureTypesEqual(s[0], s[1].args[0]);
                ret = [annotateVar({ prim: "list", args: [s[1].args[0]] }), ...stack.slice(2)];
                break;
            }

        case "SIZE":
            args(0, ["string", "list", "set", "map", "bytes"]);
            ret = [annotateVar({ prim: "nat" }), ...stack.slice(1)];
            break;

        case "MEM":
            {
                const s = args(0, null, ["set", "map", "big_map"]);
                ensureComparableType(s[0]);
                ensureTypesEqual(s[0], s[1].args[0]);
                ret = [annotateVar({ prim: "bool" }), ...stack.slice(2)];
                break;
            }

        case "GET":
            {
                const s = args(0, null, ["map", "big_map"]);
                ensureComparableType(s[0]);
                ensureTypesEqual(s[0], s[1].args[0]);
                ret = [annotateVar({ prim: "option", args: [s[1].args[1]] }), ...stack.slice(2)];
                break;
            }

        case "UPDATE":
            {
                const s0 = args(0, null, ["bool", "option"]);
                if (ensureComparableType(s0[0])) {
                    if (s0[1].prim === "bool") {
                        const s1 = args(2, ["set"]);
                        ensureTypesEqual<MichelsonComparableType, MichelsonComparableType>(s0[0], s1[0].args[0]);
                        ret = [annotateVar({
                            prim: "set",
                            args: [annotate(s0[0], { t: null })],
                        }), ...stack.slice(3)];
                    } else {
                        const s1 = args(2, ["map", "big_map"]);
                        ensureTypesEqual<MichelsonComparableType, MichelsonComparableType>(s0[0], s1[0].args[0]);
                        ret = [annotateVar({
                            prim: s1[0].prim,
                            args: [
                                annotate(s0[0], { t: null }),
                                annotate(s0[1].args[0], { t: null }),
                            ],
                        }), ...stack.slice(3)];
                    }
                } else {
                    ret = []; // never
                }
                break;
            }

        case "EXEC":
            {
                const s = args(0, null, ["lambda"]);
                ensureTypesEqual(s[0], s[1].args[0]);
                ret = [annotateVar(s[1].args[1]), ...stack.slice(2)];
                break;
            }

        case "APPLY":
            {
                const s = args(0, null, ["lambda"]);
                if (s[1].args[0].prim !== "pair") {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: function's argument must be a pair: ${s[1].args[0].prim}`);
                }
                const pt = s[1].args[0];
                ensureTypesEqual(s[0], pt.args[0]);
                ret = [annotateVar({ prim: "lambda", args: [pt.args[1], s[1].args[1]] }), ...stack.slice(2)];
                break;
            }

        case "FAILWITH":
            ret = { failed: args(0, null)[0] };
            break;

        case "RENAME":
            ret = [annotateVar(args(0, null)[0]), ...stack.slice(1)];
            break;

        case "CONCAT":
            {
                const s0 = args(0, ["string", "list", "bytes"]);
                if (s0[0].prim === "list") {
                    if (s0[0].args[0].prim !== "string" && s0[0].args[0].prim !== "bytes") {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't concatenate list of ${s0[0].args[0].prim}'s`);
                    }
                    ret = [annotateVar(s0[0].args[0]), ...stack.slice(1)];
                } else {
                    const s1 = args(1, ["string", "bytes"]);
                    if (s0[0].prim !== s1[0].prim) {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't concatenate ${s0[0].prim} with ${s1[0].prim}`);
                    }
                    ret = [annotateVar(s1[0]), ...stack.slice(2)];
                }
                break;
            }

        case "SLICE":
            ret = [annotateVar({ prim: "option", args: [args(0, ["nat"], ["nat"], ["string", "bytes"])[2]] }), ...stack.slice(3)];
            break;

        case "PACK":
            {
                const s = args(0, null);
                if (s[0].prim === "big_map" || s[0].prim === "operation") {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: non packable type: ${s[0].prim}`);
                }
                ret = [annotateVar({ prim: "bytes" }), ...stack.slice(1)];
                break;
            }

        case "ADD":
            {
                const s = args(0, ["nat", "int", "timestamp", "mutez"], ["nat", "int", "timestamp", "mutez"]);
                if (s[0].prim === "nat" && s[1].prim === "nat") {
                    ret = [annotateVar({ prim: "nat" }), ...stack.slice(2)];
                } else if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) {
                    ret = [annotateVar({ prim: "int" }), ...stack.slice(2)];
                } else if (s[0].prim === "int" && s[1].prim === "timestamp" || s[0].prim === "timestamp" && s[1].prim === "int") {
                    ret = [annotateVar({ prim: "timestamp" }), ...stack.slice(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
                    ret = [annotateVar({ prim: "mutez" }), ...stack.slice(2)];
                } else {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't add ${s[0].prim} to ${s[1].prim}`);
                }
                break;
            }

        case "SUB":
            {
                const s = args(0, ["nat", "int", "timestamp", "mutez"], ["nat", "int", "timestamp", "mutez"]);
                if (((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) ||
                    s[0].prim === "timestamp" && s[1].prim === "timestamp") {
                    ret = [annotateVar({ prim: "int" }), ...stack.slice(2)];
                } else if (s[0].prim === "timestamp" && s[1].prim === "int") {
                    ret = [annotateVar({ prim: "timestamp" }), ...stack.slice(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
                    ret = [annotateVar({ prim: "mutez" }), ...stack.slice(2)];
                } else {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't subtract ${s[0].prim} from ${s[1].prim}`);
                }
                break;
            }

        case "MUL":
            {
                const s = args(0, ["nat", "int", "mutez"], ["nat", "int", "mutez"]);
                if (s[0].prim === "nat" && s[1].prim === "nat") {
                    ret = [annotateVar({ prim: "nat" }), ...stack.slice(2)];
                } else if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) {
                    ret = [annotateVar({ prim: "int" }), ...stack.slice(2)];
                } else if (s[0].prim === "nat" && s[1].prim === "mutez" || s[0].prim === "mutez" && s[1].prim === "nat") {
                    ret = [annotateVar({ prim: "mutez" }), ...stack.slice(2)];
                } else {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't multiply ${s[0].prim} by ${s[1].prim}`);
                }
                break;
            }

        case "EDIV":
            {
                const res = (a: "nat" | "int" | "mutez", b: "nat" | "int" | "mutez"): MichelsonTypeOption => ({ prim: "option", args: [{ prim: "pair", args: [{ prim: a }, { prim: b }] }] });
                const s = args(0, ["nat", "int", "mutez"], ["nat", "int", "mutez"]);
                if (s[0].prim === "nat" && s[1].prim === "nat") {
                    ret = [annotateVar(res("nat", "nat")), ...stack.slice(2)];
                } else if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) {
                    ret = [annotateVar(res("int", "nat")), ...stack.slice(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "nat") {
                    ret = [annotateVar(res("mutez", "mutez")), ...stack.slice(2)];
                } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
                    ret = [annotateVar(res("nat", "mutez")), ...stack.slice(2)];
                } else {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't euclideally divide ${s[0].prim} by ${s[1].prim}`);
                }
                break;
            }

        case "ABS":
            args(0, ["int"]);
            ret = [annotateVar({ prim: "nat" }), ...stack.slice(1)];
            break;

        case "ISNAT":
            args(0, ["int"]);
            ret = [annotateVar({ prim: "option", args: [{ prim: "nat" }] }), ...stack.slice(1)];
            break;

        case "INT":
            args(0, ["nat"]);
            ret = [annotateVar({ prim: "int" }), ...stack.slice(1)];
            break;

        case "NEG":
            args(0, ["nat", "int"]);
            ret = [annotateVar({ prim: "int" }), ...stack.slice(1)];
            break;

        case "LSL":
        case "LSR":
            args(0, ["nat"], ["nat"]);
            ret = [annotateVar({ prim: "nat" }), ...stack.slice(2)];
            break;

        case "OR":
        case "XOR":
            {
                const s = args(0, ["nat", "bool"], ["nat", "bool"]);
                if (s[0].prim !== s[1].prim) {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: both arguments must be of the same type: ${s[0].prim}, ${s[1].prim}`);
                }
                ret = [annotateVar(s[1]), ...stack.slice(2)];
                break;
            }

        case "AND":
            {
                const s = args(0, ["nat", "bool", "int"], ["nat", "bool"]);
                if ((s[0].prim !== "int" || s[1].prim !== "nat") && s[0].prim !== s[1].prim) {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: both arguments must be of the same type: ${s[0].prim}, ${s[1].prim}`);
                }
                ret = [annotateVar(s[1]), ...stack.slice(2)];
                break;
            }

        case "NOT":
            {
                const s = args(0, ["nat", "bool", "int"]);
                if (s[0].prim === "bool") {
                    ret = [annotateVar({ prim: "bool" }), ...stack.slice(1)];
                } else {
                    ret = [annotateVar({ prim: "int" }), ...stack.slice(1)];
                }
                break;
            }

        case "COMPARE":
            {
                const s = args(0, null, null);
                ensureComparableType(s[0]);
                ensureComparableType(s[1]);
                ret = [annotateVar({ prim: "int" }), ...stack.slice(2)];
                break;
            }

        case "EQ":
        case "NEQ":
        case "LT":
        case "GT":
        case "LE":
        case "GE":
            args(0, ["int"]);
            ret = [annotateVar({ prim: "bool" }), ...stack.slice(1)];
            break;

        case "SELF":
            {
                if (ctx?.contract === undefined) {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: contract required`);
                }
                const ia = instructionAnnotations({ f: 1, v: 1 });
                const ep = contractEntryPoint(ctx.contract, ia.f?.[0]);
                if (ep === null) {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: contract has no entrypoint named ${ep}`);
                }
                ret = [annotate({ prim: "contract", args: [ep] }, { v: ia.v ? ia.v : ["@self"] }), ...stack];
                break;
            }

        case "TRANSFER_TOKENS":
            {
                const s = args(0, null, ["mutez"], ["contract"]);
                ensureTypesEqual(s[0], s[2].args[0]);
                ret = [annotateVar({ prim: "operation" }), ...stack.slice(3)];
                break;
            }

        case "SET_DELEGATE":
            {
                const s = args(0, ["option"]);
                if (s[0].args[0].prim !== "key_hash") {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: key hash expected: ${s[0].args[0].prim}`);
                }
                ret = [annotateVar({ prim: "operation" }), ...stack.slice(1)];
                break;
            }

        case "CREATE_ACCOUNT":
            {
                const ia = instructionAnnotations({ v: 2 }, { emptyVar: true });
                const s = args(0, ["key_hash"], ["option"], ["bool"], ["mutez"]);
                if (s[1].args[0].prim !== "key_hash") {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: key hash expected: ${s[1].args[0].prim}`);
                }
                ret = [
                    annotate({ prim: "operation" }, { v: ia.v && ia.v.length > 0 && ia.v[0] !== "@" ? [ia.v[0]] : undefined }),
                    annotate({ prim: "address" }, { v: ia.v && ia.v.length > 1 && ia.v[1] !== "@" ? [ia.v[1]] : undefined }),
                    ...stack.slice(4)
                ];
                break;
            }

        case "IMPLICIT_ACCOUNT":
            args(0, ["key_hash"]);
            ret = [annotateVar({ prim: "contract", args: [{ prim: "unit" }] }), ...stack.slice(1)];
            break;

        case "NOW":
            ret = [annotateVar({ prim: "timestamp" }, "@now"), ...stack];
            break;

        case "AMOUNT":
            ret = [annotateVar({ prim: "mutez" }, "@amount"), ...stack];
            break;

        case "BALANCE":
            ret = [annotateVar({ prim: "mutez" }, "@balance"), ...stack];
            break;

        case "CHECK_SIGNATURE":
            args(0, ["key"], ["signature"], ["bytes"]);
            ret = [annotateVar({ prim: "bool" }), ...stack.slice(3)];
            break;

        case "BLAKE2B":
        case "SHA256":
        case "SHA512":
            args(0, ["bytes"]);
            ret = [annotateVar({ prim: "bytes" }), ...stack.slice(1)];
            break;

        case "HASH_KEY":
            args(0, ["key"]);
            ret = [annotateVar({ prim: "key_hash" }), ...stack.slice(1)];
            break;

        case "STEPS_TO_QUOTA":
            ret = [annotateVar({ prim: "nat" }, "@steps"), ...stack];
            break;

        case "SOURCE":
            ret = [annotateVar({ prim: "address" }, "@source"), ...stack];
            break;

        case "SENDER":
            ret = [annotateVar({ prim: "address" }, "@sender"), ...stack];
            break;

        case "ADDRESS":
            {
                const s = args(0, ["contract"]);
                const ia = instructionAnnotations({ v: 1 });
                ret = [
                    annotate({ prim: "address" }, { v: ia.v ? ia.v : varSuffix(argAnnotations(s[0]), "address") }),
                    ...stack.slice(1)];
                break;
            }

        case "CHAIN_ID":
            ret = [annotateVar({ prim: "chain_id" }), ...stack];
            break;

        case "DROP":
            {
                instructionAnnotations({});
                const n = instruction.args !== undefined ? parseInt(instruction.args[0].int, 10) : 1;
                args(n - 1, null);
                ret = stack.slice(n);
                break;
            }

        case "DIG":
            {
                instructionAnnotations({});
                const n = parseInt(instruction.args[0].int, 10);
                ret = [args(n, null)[0], ...stack.slice(0, n), ...stack.slice(n + 1)];
                break;
            }

        case "DUG":
            {
                instructionAnnotations({});
                const n = parseInt(instruction.args[0].int, 10);
                ret = [...stack.slice(1, n + 1), args(0, null)[0], ...stack.slice(n + 1)];
                break;
            }

        case "NONE":
            assertTypeAnnotationsValid(instruction.args[0]);
            ret = [annotate({ prim: "option", args: [instruction.args[0]] }, instructionAnnotations({ t: 1, v: 1 })), ...stack];
            break;

        case "LEFT":
        case "RIGHT":
            {
                const s = args(0, null);
                const ia = instructionAnnotations({ f: 2, t: 1, v: 1 }, { specialFields: true });
                const va = argAnnotations(s[0]);

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

                ret = [annotate({
                    prim: "or", args: instruction.prim === "LEFT" ? children : [children[1], children[0]]
                }, { t: ia.t, v: ia.v }), ...stack.slice(1)];
                break;
            }

        case "NIL":
            assertTypeAnnotationsValid(instruction.args[0]);
            ret = [annotate({ prim: "list", args: [instruction.args[0]] }, instructionAnnotations({ t: 1, v: 1 })), ...stack];
            break;

        case "UNPACK":
            args(0, ["bytes"]);
            if (instruction.args[0].prim === "big_map" || instruction.args[0].prim === "operation") {
                throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: non packable type: ${instruction.args[0].prim}`);
            }
            assertTypeAnnotationsValid(instruction.args[0]);
            ret = [annotateVar({ prim: "option", args: [instruction.args[0]] }), ...stack.slice(1)];
            break;

        case "CONTRACT":
            {
                const s = args(0, ["address"]);
                assertTypeAnnotationsValid(instruction.args[0]);
                const ia = instructionAnnotations({ v: 1, f: 1 });
                ret = [
                    annotate({ prim: "option", args: [{ prim: "contract", args: [instruction.args[0]] }] }, { v: ia.v ? ia.v : varSuffix(argAnnotations(s[0]), "contract") }),
                    ...stack.slice(1)];
                break;
            }

        case "CAST":
            instructionAnnotations({});
            const s = args(0, null);
            assertTypeAnnotationsValid(instruction.args[0]);
            assertTypesEqualInternal(instruction.args[0], s[0]);
            ret = [instruction.args[0], ...stack.slice(1)];
            break;

        case "IF_NONE":
            {
                instructionAnnotations({});
                const s = args(0, ["option"]);
                const tail = stack.slice(1);
                const br0 = functionTypeInternal(instruction.args[0], tail, ctx);
                const br1 = functionTypeInternal(instruction.args[1], [annotate(s[0].args[0], { t: null, v: varSuffix(argAnnotations(s[0]), "some") }), ...tail], ctx);
                ret = branchType(br0, br1);
                break;
            }

        case "IF_LEFT":
            {
                instructionAnnotations({});
                const s = args(0, ["or"]);
                const va = argAnnotations(s[0]);
                const lefta = argAnnotations(s[0].args[0]);
                const righta = argAnnotations(s[0].args[1]);
                const tail = stack.slice(1);
                const br0 = functionTypeInternal(instruction.args[0],
                    [
                        annotate(s[0].args[0], { t: null, v: varSuffix(va, lefta.f ? lefta.f[0].slice(1) : "left") }),
                        ...tail
                    ],
                    ctx);
                const br1 = functionTypeInternal(instruction.args[1],
                    [
                        annotate(s[0].args[1], { t: null, v: varSuffix(va, righta.f ? righta.f[0].slice(1) : "right") }),
                        ...tail
                    ],
                    ctx);
                ret = branchType(br0, br1);
                break;
            }

        case "IF_CONS":
            {
                instructionAnnotations({});
                const s = args(0, ["list"]);
                const va = argAnnotations(s[0]);
                const tail = stack.slice(1);
                const br0 = functionTypeInternal(instruction.args[0],
                    [
                        annotate(s[0].args[0], { t: null, v: varSuffix(va, "hd") }),
                        annotate(s[0], { t: null, v: varSuffix(va, "tl") }),
                        ...tail
                    ],
                    ctx);
                const br1 = functionTypeInternal(instruction.args[1], tail, ctx);
                ret = branchType(br0, br1);
                break;
            }

        case "IF":
            {
                instructionAnnotations({});
                args(0, ["bool"]);
                const tail = stack.slice(1);
                const br0 = functionTypeInternal(instruction.args[0], tail, ctx);
                const br1 = functionTypeInternal(instruction.args[1], tail, ctx);
                ret = branchType(br0, br1);
                break;
            }

        case "MAP":
            {
                const s = args(0, ["list", "map"]);
                const tail = stack.slice(1);
                const elt = s[0].prim === "map" ? { prim: "pair" as const, args: s[0].args } : s[0].args[0];
                const body = functionTypeInternal(instruction.args[0],
                    [annotate(elt, { t: null, v: varSuffix(argAnnotations(s[0]), "elt") }), ...tail],
                    ctx);
                if ("failed" in body) {
                    ret = body;
                } else {
                    if (body.length < 1) {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: function must return a value`);
                    }
                    ensureTypesEqual(body.slice(1), tail);
                    if (s[0].prim === "list") {
                        ret = [annotateVar({ prim: "list", args: [body[0]] }), ...tail];
                    } else {
                        ret = [annotateVar({ prim: "map", args: [s[0].args[0], body[0]] }), ...tail];
                    }
                }
                break;
            }

        case "ITER":
            {
                instructionAnnotations({});
                const s = args(0, ["set", "list", "map"]);
                const tail = stack.slice(1);
                const elt = s[0].prim === "map" ? { prim: "pair" as const, args: s[0].args } : s[0].args[0];
                const body = functionTypeInternal(instruction.args[0],
                    [annotate(elt, { t: null, v: varSuffix(argAnnotations(s[0]), "elt") }), ...tail],
                    ctx);
                if ("failed" in body) {
                    ret = body;
                } else {
                    ensureTypesEqual(body, tail);
                    ret = tail;
                }
                break;
            }

        case "LOOP":
            {
                instructionAnnotations({});
                args(0, ["bool"]);
                const tail = stack.slice(1);
                const body = functionTypeInternal(instruction.args[0], tail, ctx);
                if ("failed" in body) {
                    ret = body;
                } else {
                    ensureTypesEqual(body, [{ prim: "bool" }, ...tail]);
                    ret = tail;
                }
                break;
            }

        case "LOOP_LEFT":
            {
                instructionAnnotations({});
                const s = args(0, ["or"]);
                const tail = stack.slice(1);
                const body = functionTypeInternal(instruction.args[0],
                    [annotate(s[0].args[0], { t: null, v: varSuffix(argAnnotations(s[0]), "left") }), ...tail],
                    ctx);
                if ("failed" in body) {
                    ret = body;
                } else {
                    ensureTypesEqual(body, [s[0], ...tail]);
                    ret = [annotate(s[0].args[1], { t: null, v: instructionAnnotations({ v: 1 }).v }), ...tail];
                }
                break;
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
                    functionTypeInternal(instruction.args[1], tail, ctx) :
                    functionTypeInternal(instruction.args[0], tail, ctx);
                if ("failed" in body) {
                    ret = body;
                } else {
                    ret = [...head, ...body];
                }
                break;
            }

        case "CREATE_CONTRACT":
            {
                const ia = instructionAnnotations({ v: 2 }, { emptyVar: true });
                const s = args(0, ["option"], ["mutez"], null);
                if (s[0].args[0].prim !== "key_hash") {
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: key hash expected: ${s[0].args[0].prim}`);
                }
                assertContractValid(instruction.args[0]);
                assertTypesEqualInternal(contractSection(instruction.args[0], "storage").args[0], s[2]);
                ret = [
                    annotate({ prim: "operation" }, { v: ia.v && ia.v.length > 0 && ia.v[0] !== "@" ? [ia.v[0]] : undefined }),
                    annotate({ prim: "address" }, { v: ia.v && ia.v.length > 1 && ia.v[1] !== "@" ? [ia.v[1]] : undefined }),
                    ...stack.slice(3)
                ];
                break;
            }

        case "PUSH":
            assertTypeAnnotationsValid(instruction.args[0]);
            assertDataValidInternal(instruction.args[0], instruction.args[1], ctx);
            ret = [annotateVar(instruction.args[0]), ...stack];
            break;

        case "EMPTY_SET":
            assertTypeAnnotationsValid(instruction.args[0]);
            ret = [annotate({ prim: "set", args: instruction.args }, instructionAnnotations({ t: 1, v: 1 })), ...stack];
            break;

        case "EMPTY_MAP":
        case "EMPTY_BIG_MAP":
            assertTypeAnnotationsValid(instruction.args[0]);
            assertTypeAnnotationsValid(instruction.args[1]);
            ret = [annotate({ prim: instruction.prim === "EMPTY_MAP" ? "map" : "big_map", args: instruction.args }, instructionAnnotations({ t: 1, v: 1 })), ...stack];
            break;

        case "LAMBDA":
            {
                assertTypeAnnotationsValid(instruction.args[0]);
                assertTypeAnnotationsValid(instruction.args[1]);
                const body = functionTypeInternal(instruction.args[2], [instruction.args[0]], ctx);
                if ("failed" in body) {
                    ret = body;
                } else {
                    if (body.length !== 1) {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: function must return a value`);
                    }
                    assertTypesEqualInternal(instruction.args[1], body[0]);
                    ret = [annotateVar({ prim: "lambda", args: [instruction.args[0], instruction.args[1]] }), ...stack];
                }
                break;
            }

        default:
            throw new MichelsonError((instruction as MichelsonInstruction), `unexpected instruction: ${(instruction as Prim).prim}`);
    }


    if (ctx?.traceCallback !== undefined) {
        const trace: InstructionTrace = {
            op: instruction,
            in: stack,
            out: ret,
        };
        ctx.traceCallback(trace);
    }

    return ret;
}

export function contractSection<T extends "parameter" | "storage" | "code">(contract: MichelsonContract, section: T): MichelsonContractSection<T> {
    for (const s of contract) {
        if (s.prim === section) {
            return s as MichelsonContractSection<T>;
        }
    }
    throw new MichelsonError(contract, `missing contract section: ${section}`);
}

export function contractEntryPoint(src: MichelsonContract | MichelsonType, ep?: string): MichelsonType | null {
    ep = ep || "%default";
    let parameter: MichelsonType;

    if (Array.isArray(src)) {
        const sec = contractSection(src, "parameter");
        const a = unpackAnnotations(sec);
        if (a.f && a.f[0] === ep) {
            return sec.args[0];
        }
        parameter = sec.args[0];
    } else {
        parameter = src;
    }

    function lookup(parameter: MichelsonType, ep: string): MichelsonType | null {
        const a = unpackAnnotations(parameter);
        if (a.f && a.f[0] === ep) {
            return parameter;
        } else if (parameter.prim === "or") {
            const left = lookup(parameter.args[0], ep);
            const right = lookup(parameter.args[1], ep);
            if (left !== null && right !== null) {
                throw new MichelsonError(src, `duplicate entrypoint: ${ep}`);
            } else {
                return left || right;
            }
        } else {
            return null;
        }
    }

    const entrypoint = lookup(parameter, ep);
    return entrypoint !== null ? entrypoint : ep === "%default" ? parameter : null;
}

// Contract validation

export function assertContractValid(contract: MichelsonContract, ctx?: Context): MichelsonStackType {
    const parameter = contractSection(contract, "parameter").args[0];
    assertTypeAnnotationsValid(parameter, true);

    const storage = contractSection(contract, "storage").args[0];
    assertTypeAnnotationsValid(storage);

    const arg: MichelsonType = {
        "prim": "pair",
        args: [
            { ...parameter, ...{ annots: ["@parameter"] } },
            { ...storage, ...{ annots: ["@storage"] } },
        ]
    };

    const code = contractSection(contract, "code").args[0];
    const ret = functionTypeInternal(code, [arg], { ...ctx, ...{ contract } });

    if ("failed" in ret) {
        // throw new MichelsonInstructionError(code, ret, `contract fails with ${ret.failed.prim} error type`);
        return ret;
    }

    const expected: MichelsonType = {
        "prim": "pair",
        args: [
            { "prim": "list", args: [{ "prim": "operation" }] },
            storage,
        ]
    };

    try {
        assertTypesEqualInternal(ret, [expected]);
    } catch (err) {
        if (err instanceof MichelsonError) {
            throw new MichelsonInstructionError(code, ret, err.message);
        } else {
            throw err;
        }
    }

    return ret;
}

// Exported wrapper functions

export function assertDataValid(t: MichelsonType, d: MichelsonData, ctx?: Context): void {
    assertTypeAnnotationsValid(t);
    assertDataValidInternal(t, d, ctx || null);
}

export function functionType(inst: MichelsonInstruction, stack: MichelsonType[], ctx?: Context): MichelsonStackType {
    for (const t of stack) {
        assertTypeAnnotationsValid(t);
    }

    if (ctx?.contract !== undefined) {
        for (const typesec of ["parameter", "storage"] as const) {
            const sec = contractSection(ctx.contract, typesec).args[0];
            assertTypeAnnotationsValid(sec);
        }
    }

    return functionTypeInternal(inst, stack, ctx || null);
}

export function assertTypesEqual<T1 extends MichelsonType | MichelsonType[], T2 extends T1>(a: T1, b: T2, field: boolean = false): void {
    if (Array.isArray(a)) {
        // type guards don't work for parametrized generic types
        for (const v of a as MichelsonType[]) {
            assertTypeAnnotationsValid(v);
        }
        for (const v of b as MichelsonType[]) {
            assertTypeAnnotationsValid(v);
        }
    } else {
        assertTypeAnnotationsValid(a as MichelsonType);
        assertTypeAnnotationsValid(b as MichelsonType);
    }
    assertTypesEqualInternal(a, b, field);
}