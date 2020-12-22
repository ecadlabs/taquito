import { StringLiteral, IntLiteral, Prim, Expr, sourceReference } from "./micheline";
import {
    MichelsonType, MichelsonData, MichelsonComparableType, MichelsonMapElt, MichelsonCode,
    MichelsonTypeOption, MichelsonContract,
    MichelsonContractSection, MichelsonStackType, MichelsonTypePair, MichelsonTypeUnit, MichelsonInstruction, InstructionList, MichelsonPassableType, PairArgs
} from "./michelson-types";
import {
    unpackAnnotations, MichelsonError, isNatural,
    LongInteger, parseBytes, compareBytes, isDecimal,
    checkTezosID, tezosPrefix, UnpackedAnnotations, Nullable, UnpackAnnotationsOptions,
} from "./utils";
import { decodeBase58Check } from "./base58";
import {
    assertMichelsonComparableType, instructionIDs,
    assertMichelsonSerializableType, assertMichelsonStorableType
} from "./michelson-validator";

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

export class MichelsonInstructionError extends MichelsonError<MichelsonCode> {
    /**
     * @param val Value of a type node caused the error
     * @param stackState Current stack state
     * @param message An error message
     */
    constructor(val: MichelsonCode, public stackState: MichelsonStackType, message?: string) {
        super(val, message);
        Object.setPrototypeOf(this, MichelsonInstructionError.prototype);
    }
}

// reassemble comb pair for transparent comparison etc. non-recursive!
function buildComb<T extends MichelsonTypePair | MichelsonData<MichelsonTypePair>>(v: T): T {
    if (v.args.length === 2) {
        return v;
    }
    const ret: MichelsonTypePair | MichelsonData<MichelsonTypePair> = {
        ...v,
        args: [
            v.args[0],
            {
                prim: v.prim,
                args: v.args.slice(1) as (MichelsonTypePair | MichelsonData<MichelsonTypePair>)["args"],
            },
        ],
    };
    return ret as T;
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
            const aComb = buildComb(a);
            const bComb = buildComb(b as typeof a);
            assertScalarTypesEqual(aComb.args[0], bComb.args[0], true);
            assertScalarTypesEqual(aComb.args[1], bComb.args[1], true);
            break;

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
            for (const a of t.args) {
                assertTypeAnnotationsValid(a, true);
            }
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
                const tComb = buildComb(t);
                const aComb = buildComb(a);
                const bComb = buildComb(b);
                const x = compareMichelsonData(tComb.args[0], aComb.args[0], bComb.args[0]);
                if (x !== 0) {
                    return x;
                }
                return compareMichelsonData(tComb.args[0], aComb.args[1], bComb.args[1]);
            }

    }
    // Unlikely, types are expected to be verified before the function call
    throw new MichelsonTypeError(t, undefined, `${t.prim}: not comparable values: ${JSON.stringify(a)}, ${JSON.stringify(b)}`);
}

function isInstruction(p: Prim): p is MichelsonInstruction {
    return Object.prototype.hasOwnProperty.call(instructionIDs, p.prim);
}

// Simplified version of assertMichelsonInstruction() for previously validated data
function isFunction(d: MichelsonData): d is InstructionList {
    if (!Array.isArray(d)) {
        return false;
    }
    for (const v of d) {
        if (!(Array.isArray(v) && isFunction(v) ||
            ("prim" in v) && isInstruction(v))) {
            return false;
        }
    }
    return true;
}

function assertDataValidInternal(d: MichelsonData, t: MichelsonType, ctx: Context | null): void {
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
            if ("bytes" in d) {
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
                    assertDataValidInternal(d.args[0], t.args[0], ctx);
                    return;
                }
            }
            throw new MichelsonTypeError(t, d, `option expected: ${JSON.stringify(d)}`);

        case "list":
        case "set":
            if (Array.isArray(d)) {
                let prev: MichelsonData | undefined;
                for (const v of d) {
                    if ("prim" in v) {
                        if (isInstruction(v)) {
                            throw new MichelsonTypeError(t, d, `Instruction outside of a lambda: ${JSON.stringify(d)}`);
                        } else if (v.prim === "Elt") {
                            throw new MichelsonTypeError(t, d, `Elt item outside of a map literal: ${JSON.stringify(d)}`);
                        }
                    }
                    assertDataValidInternal(v, t.args[0], ctx);
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
                const dComb = buildComb(d);
                const tComb = buildComb(t);
                assertDataValidInternal(dComb.args[0], tComb.args[0], ctx);
                assertDataValidInternal(dComb.args[1], tComb.args[1], ctx);
                return;
            }
            throw new MichelsonTypeError(t, d, `pair expected: ${JSON.stringify(d)}`);

        case "or":
            if ("prim" in d) {
                if (d.prim === "Left") {
                    assertDataValidInternal(d.args[0], t.args[0], ctx);
                    return;
                } else if (d.prim === "Right") {
                    assertDataValidInternal(d.args[0], t.args[1], ctx);
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
                    assertDataValidInternal(v.args[0], t.args[0], ctx);
                    assertDataValidInternal(v.args[1], t.args[1], ctx);
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

type MichelsonTypeID = MichelsonType["prim"];
type StackType<T extends (MichelsonTypeID[] | null)[]> = {
    [N in keyof T]: T[N] extends MichelsonTypeID[] ? MichelsonType<T[N][number]> : MichelsonType;
};

export interface InstructionTrace {
    op: MichelsonCode;
    in: MichelsonType[];
    out: MichelsonStackType;
}

function instructionListType(inst: InstructionList, stack: MichelsonType[], ctx: Context | null): MichelsonStackType {
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


function functionTypeInternal(inst: MichelsonCode, stack: MichelsonType[], ctx: Context | null): MichelsonStackType {
    if (Array.isArray(inst)) {
        return instructionListType(inst, stack, ctx);
    }
    const instruction = inst; // Make it const for type guarding

    // make sure the stack has enough number of arguments of specific types
    function args<T extends (MichelsonTypeID[] | null)[]>(n: number, ...typeIds: T): StackType<T> {
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

    function rethrow<T extends unknown[], U>(fn: (...args: T) => U) {
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

    function rethrowTypeGuard<T extends Expr, U extends MichelsonType & T>(fn: (arg: T) => arg is U) {
        return (arg: T): arg is U => {
            try {
                return fn(arg);
            } catch (err) {
                if (err instanceof MichelsonError) {
                    throw new MichelsonInstructionError(instruction, stack, err.message);
                } else {
                    throw err;
                }
            }
        };
    }

    const argAnn = rethrow(unpackAnnotations);
    const ensureTypesEqual = rethrow(assertTypesEqualInternal);
    const ensureComparableType = rethrowTypeGuard(assertMichelsonComparableType);
    const ensureSerializableType = rethrowTypeGuard(assertMichelsonSerializableType);
    const ensureStorableType = rethrowTypeGuard(assertMichelsonStorableType);

    // unpack instruction annotations and assert their maximum number
    function instructionAnn(num: { f?: number; t?: number; v?: number }, opt?: UnpackAnnotationsOptions) {
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
        const src = argAnn(t);
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
        const ia = instructionAnn({ v: 1 });
        return annotate(t, { v: ia.v !== undefined ? ia.v : def !== undefined ? [def] : null, t: null });
    }

    // annotate CAR/CDR/UNPAIR/GET
    function annotateField(arg: MichelsonTypePair, field: MichelsonType, insAnn: UnpackedAnnotations, n: number, defField: string): MichelsonType {
        const fieldAnn = argAnn(field).f?.[0]; // field's field annotation
        const insFieldAnn = insAnn.f?.[n];
        if (insFieldAnn !== undefined && fieldAnn !== undefined && insFieldAnn !== fieldAnn) {
            throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: field names doesn't match: ${insFieldAnn} !== ${fieldAnn}`);
        }
        const insVarAnn = insAnn.v?.[n]; // nth instruction's variable annotation
        const varAnn = argAnn(arg).v?.[0]; // instruction argument's variable annotation
        return annotate(field, {
            t: null,
            v: insVarAnn ?
                insVarAnn === "@%" ?
                    fieldAnn ? ["@" + fieldAnn.slice(1)] : undefined :
                    insVarAnn === "@%%" ?
                        varAnn ?
                            ["@" + varAnn.slice(1) + "." + (fieldAnn ? fieldAnn.slice(1) : defField)] :
                            fieldAnn ? ["@" + fieldAnn.slice(1)] : undefined :
                        [insVarAnn] :
                null,
        });
    }

    // comb helper functions
    function getN(src: MichelsonTypePair, n: number, i: number = n): MichelsonType[] {
        const p = buildComb(src);
        if (i === 1) {
            return [p.args[0]];
        } else if (i === 2) {
            return p.args;
        }
        const right = p.args[1];
        if (right.prim === "pair") {
            return [p.args[0], ...getN(right, n, i - 1)];
        } else {
            throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: at least ${n} fields are expected`);
        }
    }

    function getNth(src: MichelsonTypePair, n: number, i: number = n): MichelsonType {
        if (i === 0) {
            return src;
        }
        const p = buildComb(src);
        if (i === 1) {
            return p.args[0];
        }
        const right = p.args[1];
        if (right.prim === "pair") {
            return getNth(right, n, i - 2);
        } else if (i === 2) {
            return right;
        }
        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: at least ${n + 1} fields are expected`);
    }

    function updateNth(src: MichelsonTypePair, x: MichelsonType, n: number, i: number = n): MichelsonType {
        if (i === 0) {
            return x;
        }
        const p = buildComb(src);
        if (i === 1) {
            return {
                ...p,
                args: [x, p.args[1]],
            };
        }
        const right = p.args[1];
        if (right.prim === "pair") {
            return {
                ...p,
                args: [p.args[0], updateNth(right, x, n, i - 2)],
            };
        } else if (i === 2) {
            return {
                ...p,
                args: [p.args[0], x],
            };
        }
        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: at least ${n + 1} fields are expected`);
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

    let retStack = ((instruction: MichelsonInstruction): MichelsonStackType => {
        switch (instruction.prim) {
            case "DUP":
                {
                    const n = instruction.args ? parseInt(instruction.args[0].int, 10) : 1;
                    if (n === 0) {
                        throw new MichelsonInstructionError(instruction, stack, "DUP 0 is forbidden");
                    }
                    return [args(n - 1, null)[0], ...stack];
                }

            case "SWAP":
                {
                    const s = args(0, null, null);
                    instructionAnn({});
                    return [s[1], s[0], ...stack.slice(2)];
                }

            case "SOME":
                return [annotate({ prim: "option", args: [args(0, null)[0]] }, instructionAnn({ t: 1, v: 1 })), ...stack.slice(1)];

            case "UNIT":
                return [annotate({ prim: "unit" }, instructionAnn({ v: 1, t: 1 })), ...stack];

            case "PAIR":
                {
                    const n = instruction.args ? parseInt(instruction.args[0].int, 10) : 2;
                    if (n < 2) {
                        throw new MichelsonInstructionError(instruction, stack, `PAIR ${n} is forbidden`);
                    }
                    const s = args(0, ...new Array<null>(n).fill(null));
                    const ia = instructionAnn({ f: n, t: 1, v: 1 }, { specialFields: true, emptyFields: true });
                    const trim = (s: string) => {
                        const i = s.lastIndexOf(".");
                        return s.slice(i > 0 ? i + 1 : 1);
                    };
                    const retArgs = s.map((v, i) => {
                        const va = argAnn(v);
                        const f = ia.f && ia.f.length > i && ia.f[i] !== "%" ?
                            ia.f[i] === "%@" ?
                                va.v ? ["%" + trim(va.v?.[0] || "")] : undefined :
                                [ia.f[i]] :
                            undefined;
                        return annotate(v, { v: null, t: null, f: f });
                    });
                    return [
                        annotate({
                            prim: "pair",
                            args: retArgs as PairArgs,
                        }, { t: ia.t, v: ia.v }),
                        ...stack.slice(n)
                    ];
                }

            case "UNPAIR":
                {
                    const n = instruction.args ? parseInt(instruction.args[0].int, 10) : 2;
                    if (n < 2) {
                        throw new MichelsonInstructionError(instruction, stack, `UNPAIR ${n} is forbidden`);
                    }
                    const s = args(0, ["pair"])[0];
                    const ia = instructionAnn({ f: 2, v: 2 }, { specialVar: true });
                    const fields = getN(s, n);
                    return [...fields.map((field, i) => annotateField(s, field, ia, i, i === 0 ? "car" : "cdr")), ...stack.slice(1)];
                }

            case "CAR":
            case "CDR":
                {
                    const s = args(0, ["pair"])[0];
                    const field = s.args[instruction.prim === "CAR" ? 0 : 1];
                    const ia = instructionAnn({ f: 1, v: 1 }, { specialVar: true });
                    return [annotateField(s, field, ia, 0, instruction.prim.toLocaleLowerCase()), ...stack.slice(1)];
                }

            case "CONS":
                {
                    const s = args(0, null, ["list"]);
                    ensureTypesEqual(s[0], s[1].args[0]);
                    return [annotateVar({ prim: "list", args: [s[1].args[0]] }), ...stack.slice(2)];
                }

            case "SIZE":
                args(0, ["string", "list", "set", "map", "bytes"]);
                return [annotateVar({ prim: "nat" }), ...stack.slice(1)];

            case "MEM":
                {
                    const s = args(0, null, ["set", "map", "big_map"]);
                    ensureComparableType(s[0]);
                    ensureTypesEqual(s[0], s[1].args[0]);
                    return [annotateVar({ prim: "bool" }), ...stack.slice(2)];
                }

            case "GET":
                if (instruction.args) {
                    // comb operation
                    const n = parseInt(instruction.args[0].int, 10);
                    const s = args(0, ["pair"])[0];
                    return [annotateVar(getNth(s, n)), ...stack.slice(1)];
                } else {
                    // map operation
                    const s = args(0, null, ["map", "big_map"]);
                    ensureComparableType(s[0]);
                    ensureTypesEqual(s[0], s[1].args[0]);
                    return [annotateVar({ prim: "option", args: [s[1].args[1]] }), ...stack.slice(2)];
                }

            case "UPDATE":
                if (instruction.args) {
                    // comb operation
                    const n = parseInt(instruction.args[0].int, 10);
                    const s = args(0, null, ["pair"]);
                    return [annotateVar(updateNth(s[1], s[0], n)), ...stack.slice(2)];

                } else {
                    // map operation
                    const s0 = args(0, null, ["bool", "option"]);
                    if (ensureComparableType(s0[0])) {
                        if (s0[1].prim === "bool") {
                            const s1 = args(2, ["set"]);
                            ensureTypesEqual<MichelsonComparableType, MichelsonComparableType>(s0[0], s1[0].args[0]);
                            return [annotateVar({
                                prim: "set",
                                args: [annotate(s0[0], { t: null })],
                            }), ...stack.slice(3)];
                        }

                        const s1 = args(2, ["map", "big_map"]);
                        ensureTypesEqual<MichelsonComparableType, MichelsonComparableType>(s0[0], s1[0].args[0]);
                        if (s1[0].prim === "map") {
                            return [annotateVar({
                                prim: "map",
                                args: [
                                    annotate(s0[0], { t: null }),
                                    annotate(s0[1].args[0], { t: null }),
                                ],
                            }), ...stack.slice(3)];
                        } else if (ensureSerializableType(s0[1].args[0])) {
                            return [annotateVar({
                                prim: "big_map",
                                args: [
                                    annotate(s0[0], { t: null }),
                                    annotate(s0[1].args[0], { t: null }),
                                ],
                            }), ...stack.slice(3)];
                        }
                    }
                    return []; // never
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
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: function's argument must be a pair: ${s[1].args[0].prim}`);
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
                            throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't concatenate list of ${s0[0].args[0].prim}'s`);
                        }
                        return [annotateVar(s0[0].args[0]), ...stack.slice(1)];
                    }
                    const s1 = args(1, ["string", "bytes"]);
                    if (s0[0].prim !== s1[0].prim) {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't concatenate ${s0[0].prim} with ${s1[0].prim}`);
                    }
                    return [annotateVar(s1[0]), ...stack.slice(2)];
                }

            case "SLICE":
                return [annotateVar({ prim: "option", args: [args(0, ["nat"], ["nat"], ["string", "bytes"])[2]] }, "@slice"), ...stack.slice(3)];

            case "PACK":
                {
                    const s = args(0, null)[0];
                    ensureSerializableType(s);
                    return [annotateVar({ prim: "bytes" }, "@packed"), ...stack.slice(1)];
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
                    }
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't add ${s[0].prim} to ${s[1].prim}`);
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
                    }
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't subtract ${s[0].prim} from ${s[1].prim}`);
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
                    }
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't multiply ${s[0].prim} by ${s[1].prim}`);
                }

            case "EDIV":
                {
                    const res = (a: "nat" | "int" | "mutez", b: "nat" | "int" | "mutez"): MichelsonTypeOption => ({ prim: "option", args: [{ prim: "pair", args: [{ prim: a }, { prim: b }] }] });
                    const s = args(0, ["nat", "int", "mutez"], ["nat", "int", "mutez"]);
                    if (s[0].prim === "nat" && s[1].prim === "nat") {
                        return [annotateVar(res("nat", "nat")), ...stack.slice(2)];
                    } else if ((s[0].prim === "nat" || s[0].prim === "int") && (s[1].prim === "nat" || s[1].prim === "int")) {
                        return [annotateVar(res("int", "nat")), ...stack.slice(2)];
                    } else if (s[0].prim === "mutez" && s[1].prim === "nat") {
                        return [annotateVar(res("mutez", "mutez")), ...stack.slice(2)];
                    } else if (s[0].prim === "mutez" && s[1].prim === "mutez") {
                        return [annotateVar(res("nat", "mutez")), ...stack.slice(2)];
                    }
                    throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: can't euclideally divide ${s[0].prim} by ${s[1].prim}`);
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
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: both arguments must be of the same type: ${s[0].prim}, ${s[1].prim}`);
                    }
                    return [annotateVar(s[1]), ...stack.slice(2)];
                }

            case "AND":
                {
                    const s = args(0, ["nat", "bool", "int"], ["nat", "bool"]);
                    if ((s[0].prim !== "int" || s[1].prim !== "nat") && s[0].prim !== s[1].prim) {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: both arguments must be of the same type: ${s[0].prim}, ${s[1].prim}`);
                    }
                    return [annotateVar(s[1]), ...stack.slice(2)];
                }

            case "NOT":
                {
                    const s = args(0, ["nat", "bool", "int"])[0];
                    if (s.prim === "bool") {
                        return [annotateVar({ prim: "bool" }), ...stack.slice(1)];
                    }
                    return [annotateVar({ prim: "int" }), ...stack.slice(1)];
                }

            case "COMPARE":
                {
                    const s = args(0, null, null);
                    ensureComparableType(s[0]);
                    ensureComparableType(s[1]);
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
                    if (ctx?.contract === undefined) {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: contract required`);
                    }
                    const ia = instructionAnn({ f: 1, v: 1 });
                    const ep = contractEntryPoint(ctx.contract, ia.f?.[0]);
                    if (ep === null) {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: contract has no entrypoint named ${ep}`);
                    }
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
                    const s = args(0, ["option"])[0];
                    if (s.args[0].prim !== "key_hash") {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: key hash expected: ${s.args[0].prim}`);
                    }
                    return [annotateVar({ prim: "operation" }), ...stack.slice(1)];
                }

            case "CREATE_ACCOUNT":
                {
                    const ia = instructionAnn({ v: 2 }, { emptyVar: true });
                    const s = args(0, ["key_hash"], ["option"], ["bool"], ["mutez"]);
                    if (s[1].args[0].prim !== "key_hash") {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: key hash expected: ${s[1].args[0].prim}`);
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
                    const s = args(0, ["contract"])[0];
                    const ia = instructionAnn({ v: 1 });
                    return [
                        annotate({ prim: "address" }, { v: ia.v ? ia.v : varSuffix(argAnn(s), "address") }),
                        ...stack.slice(1)];
                }

            case "CHAIN_ID":
                return [annotateVar({ prim: "chain_id" }), ...stack];

            case "DROP":
                {
                    instructionAnn({});
                    const n = instruction.args !== undefined ? parseInt(instruction.args[0].int, 10) : 1;
                    args(n - 1, null);
                    return stack.slice(n);
                }

            case "DIG":
                {
                    instructionAnn({});
                    const n = parseInt(instruction.args[0].int, 10);
                    return [args(n, null)[0], ...stack.slice(0, n), ...stack.slice(n + 1)];
                }

            case "DUG":
                {
                    instructionAnn({});
                    const n = parseInt(instruction.args[0].int, 10);
                    return [...stack.slice(1, n + 1), args(0, null)[0], ...stack.slice(n + 1)];
                }

            case "NONE":
                assertTypeAnnotationsValid(instruction.args[0]);
                return [annotate({ prim: "option", args: [instruction.args[0]] }, instructionAnn({ t: 1, v: 1 })), ...stack];

            case "LEFT":
            case "RIGHT":
                {
                    const s = args(0, null)[0];
                    const ia = instructionAnn({ f: 2, t: 1, v: 1 }, { specialFields: true });
                    const va = argAnn(s);

                    const children: [MichelsonType, MichelsonType] = [
                        annotate(s, {
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
                    }, { t: ia.t, v: ia.v }), ...stack.slice(1)];
                }

            case "NIL":
                assertTypeAnnotationsValid(instruction.args[0]);
                return [annotate({ prim: "list", args: [instruction.args[0]] }, instructionAnn({ t: 1, v: 1 })), ...stack];

            case "UNPACK":
                args(0, ["bytes"]);
                assertTypeAnnotationsValid(instruction.args[0]);
                return [annotateVar({ prim: "option", args: [instruction.args[0]] }, "@unpacked"), ...stack.slice(1)];

            case "CONTRACT":
                {
                    const s = args(0, ["address"])[0];
                    assertTypeAnnotationsValid(instruction.args[0]);
                    const ia = instructionAnn({ v: 1, f: 1 });
                    return [
                        annotate({ prim: "option", args: [{ prim: "contract", args: [instruction.args[0]] }] }, { v: ia.v ? ia.v : varSuffix(argAnn(s), "contract") }),
                        ...stack.slice(1)];
                }

            case "CAST":
                instructionAnn({});
                const s = args(0, null)[0];
                assertTypeAnnotationsValid(instruction.args[0]);
                assertTypesEqualInternal(instruction.args[0], s);
                return [instruction.args[0], ...stack.slice(1)];

            case "IF_NONE":
                {
                    instructionAnn({});
                    const s = args(0, ["option"])[0];
                    const tail = stack.slice(1);
                    const br0 = functionTypeInternal(instruction.args[0], tail, ctx);
                    const br1 = functionTypeInternal(instruction.args[1], [annotate(s.args[0], { t: null, v: varSuffix(argAnn(s), "some") }), ...tail], ctx);
                    return branchType(br0, br1);
                }

            case "IF_LEFT":
                {
                    instructionAnn({});
                    const s = args(0, ["or"])[0];
                    const va = argAnn(s);
                    const lefta = argAnn(s.args[0]);
                    const righta = argAnn(s.args[1]);
                    const tail = stack.slice(1);
                    const br0 = functionTypeInternal(instruction.args[0],
                        [
                            annotate(s.args[0], { t: null, v: varSuffix(va, lefta.f ? lefta.f[0].slice(1) : "left") }),
                            ...tail
                        ],
                        ctx);
                    const br1 = functionTypeInternal(instruction.args[1],
                        [
                            annotate(s.args[1], { t: null, v: varSuffix(va, righta.f ? righta.f[0].slice(1) : "right") }),
                            ...tail
                        ],
                        ctx);
                    return branchType(br0, br1);
                }

            case "IF_CONS":
                {
                    instructionAnn({});
                    const s = args(0, ["list"])[0];
                    const va = argAnn(s);
                    const tail = stack.slice(1);
                    const br0 = functionTypeInternal(instruction.args[0],
                        [
                            annotate(s.args[0], { t: null, v: varSuffix(va, "hd") }),
                            annotate(s, { t: null, v: varSuffix(va, "tl") }),
                            ...tail
                        ],
                        ctx);
                    const br1 = functionTypeInternal(instruction.args[1], tail, ctx);
                    return branchType(br0, br1);
                }

            case "IF":
                {
                    instructionAnn({});
                    args(0, ["bool"]);
                    const tail = stack.slice(1);
                    const br0 = functionTypeInternal(instruction.args[0], tail, ctx);
                    const br1 = functionTypeInternal(instruction.args[1], tail, ctx);
                    return branchType(br0, br1);
                }

            case "MAP":
                {
                    const s = args(0, ["list", "map"])[0];
                    const tail = stack.slice(1);
                    const elt = s.prim === "map" ? { prim: "pair" as const, args: s.args } : s.args[0];
                    const body = functionTypeInternal(instruction.args[0],
                        [annotate(elt, { t: null, v: varSuffix(argAnn(s), "elt") }), ...tail],
                        ctx);
                    if ("failed" in body) {
                        return body;
                    }
                    if (body.length < 1) {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: function must return a value`);
                    }
                    ensureTypesEqual(body.slice(1), tail);
                    if (s.prim === "list") {
                        return [annotateVar({ prim: "list", args: [body[0]] }), ...tail];
                    }
                    return [annotateVar({ prim: "map", args: [s.args[0], body[0]] }), ...tail];
                }

            case "ITER":
                {
                    instructionAnn({});
                    const s = args(0, ["set", "list", "map"])[0];
                    const tail = stack.slice(1);
                    const elt = s.prim === "map" ? { prim: "pair" as const, args: s.args } : s.args[0];
                    const body = functionTypeInternal(instruction.args[0],
                        [annotate(elt, { t: null, v: varSuffix(argAnn(s), "elt") }), ...tail],
                        ctx);
                    if ("failed" in body) {
                        return body;
                    }
                    ensureTypesEqual(body, tail);
                    return tail;
                }

            case "LOOP":
                {
                    instructionAnn({});
                    args(0, ["bool"]);
                    const tail = stack.slice(1);
                    const body = functionTypeInternal(instruction.args[0], tail, ctx);
                    if ("failed" in body) {
                        return body;
                    }
                    ensureTypesEqual(body, [{ prim: "bool" }, ...tail]);
                    return tail;
                }

            case "LOOP_LEFT":
                {
                    instructionAnn({});
                    const s = args(0, ["or"])[0];
                    const tail = stack.slice(1);
                    const body = functionTypeInternal(instruction.args[0],
                        [annotate(s.args[0], { t: null, v: varSuffix(argAnn(s), "left") }), ...tail],
                        ctx);
                    if ("failed" in body) {
                        return body;
                    }
                    ensureTypesEqual(body, [s, ...tail]);
                    return [annotate(s.args[1], { t: null, v: instructionAnn({ v: 1 }).v }), ...tail];
                }

            case "DIP":
                {
                    instructionAnn({});
                    const n = instruction.args.length === 2 ? parseInt(instruction.args[0].int, 10) : 1;
                    args(n - 1, null);
                    const head = stack.slice(0, n);
                    const tail = stack.slice(n);
                    // ternary operator is a type guard so use it instead of just `instruction.args.length - 1`
                    const body = instruction.args.length === 2 ?
                        functionTypeInternal(instruction.args[1], tail, ctx) :
                        functionTypeInternal(instruction.args[0], tail, ctx);
                    if ("failed" in body) {
                        return body;
                    }
                    return [...head, ...body];
                }

            case "CREATE_CONTRACT":
                {
                    const ia = instructionAnn({ v: 2 }, { emptyVar: true });
                    const s = args(0, ["option"], ["mutez"], null);
                    if (s[0].args[0].prim !== "key_hash") {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: key hash expected: ${s[0].args[0].prim}`);
                    }
                    if (ensureStorableType(s[2])) {
                        assertContractValid(instruction.args[0]);
                        assertTypesEqualInternal(contractSection(instruction.args[0], "storage").args[0], s[2]);
                    }
                    return [
                        annotate({ prim: "operation" }, { v: ia.v && ia.v.length > 0 && ia.v[0] !== "@" ? [ia.v[0]] : undefined }),
                        annotate({ prim: "address" }, { v: ia.v && ia.v.length > 1 && ia.v[1] !== "@" ? [ia.v[1]] : undefined }),
                        ...stack.slice(3)
                    ];
                }

            case "PUSH":
                assertTypeAnnotationsValid(instruction.args[0]);
                assertDataValidInternal(instruction.args[1], instruction.args[0], ctx);
                return [annotateVar(instruction.args[0]), ...stack];

            case "EMPTY_SET":
                assertTypeAnnotationsValid(instruction.args[0]);
                return [annotate({ prim: "set", args: instruction.args }, instructionAnn({ t: 1, v: 1 })), ...stack];

            case "EMPTY_MAP":
                assertTypeAnnotationsValid(instruction.args[0]);
                assertTypeAnnotationsValid(instruction.args[1]);
                return [annotate({ prim: "map", args: instruction.args }, instructionAnn({ t: 1, v: 1 })), ...stack];

            case "EMPTY_BIG_MAP":
                assertTypeAnnotationsValid(instruction.args[0]);
                assertTypeAnnotationsValid(instruction.args[1]);
                return [annotate({ prim: "big_map", args: instruction.args }, instructionAnn({ t: 1, v: 1 })), ...stack];

            case "LAMBDA":
                {
                    assertTypeAnnotationsValid(instruction.args[0]);
                    assertTypeAnnotationsValid(instruction.args[1]);
                    const body = functionTypeInternal(instruction.args[2], [instruction.args[0]], ctx);
                    if ("failed" in body) {
                        return body;
                    }
                    if (body.length !== 1) {
                        throw new MichelsonInstructionError(instruction, stack, `${instruction.prim}: function must return a value`);
                    }
                    assertTypesEqualInternal(instruction.args[1], body[0]);
                    return [annotateVar({ prim: "lambda", args: [instruction.args[0], instruction.args[1]] }), ...stack];
                }

            default:
                throw new MichelsonError((instruction as MichelsonCode), `unexpected instruction: ${(instruction as Prim).prim}`);
        }
    })(instruction);

    if (ctx?.traceCallback !== undefined) {
        const trace: InstructionTrace = {
            op: instruction,
            in: stack,
            out: retStack,
        };
        ctx.traceCallback(trace);
    }

    return retStack;
}

export function contractSection<T extends "parameter" | "storage" | "code">(contract: MichelsonContract, section: T): MichelsonContractSection<T> {
    for (const s of contract) {
        if (s.prim === section) {
            return s as MichelsonContractSection<T>;
        }
    }
    throw new MichelsonError(contract, `missing contract section: ${section}`);
}

export function contractEntryPoint(src: MichelsonContract | MichelsonPassableType, ep?: string): MichelsonPassableType | null {
    ep = ep || "%default";
    const entryPoint = contractEntryPoints(src).find(x => x[0] === ep);

    if (entryPoint !== undefined) {
        return entryPoint[1];
    } else if (ep === "%default") {
        return Array.isArray(src) ? contractSection(src, "parameter").args[0] : src;
    }
    return null;
}

export function contractEntryPoints(src: MichelsonContract | MichelsonPassableType): [string, MichelsonPassableType][] {
    if (Array.isArray(src)) {
        const param = contractSection(src, "parameter");
        const ch = contractEntryPoints(param.args[0]);
        const a = unpackAnnotations(param);
        return a.f ? [[a.f[0], param.args[0]], ...ch] : ch;
    }

    if (src.prim === "or") {
        const getArg = (n: 0 | 1): [string, MichelsonPassableType][] => {
            const a = unpackAnnotations(src.args[n]);
            if (src.args[n].prim === "or") {
                const ch = contractEntryPoints(src.args[n]);
                return a.f ? [[a.f[0], src.args[n]], ...ch] : ch;
            }
            return a.f ? [[a.f[0], src.args[n]]] : [];
        };
        return [...getArg(0), ...getArg(1)];
    }
    return [];
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

export function assertDataValid<T extends MichelsonType>(d: MichelsonData, t: T, ctx?: Context): d is MichelsonData<T> {
    assertTypeAnnotationsValid(t);
    assertDataValidInternal(d, t, ctx || null);
    return true;
}

export function functionType(inst: MichelsonCode, stack: MichelsonType[], ctx?: Context): MichelsonStackType {
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

export function isTypeAnnotationsValid(t: MichelsonType, field: boolean = false): boolean {
    try {
        assertTypeAnnotationsValid(t, field);
        return true;
    } catch {
        return false;
    }
}

export function isContractValid(contract: MichelsonContract, ctx?: Context): MichelsonStackType | null {
    try {
        return assertContractValid(contract, ctx);
    } catch {
        return null;
    }
}

export function isDataValid<T extends MichelsonType>(d: MichelsonData, t: T, ctx?: Context): d is MichelsonData<T> {
    try {
        return assertDataValid(d, t, ctx);
    } catch {
        return false;
    }
}

export function isTypeEqual<T1 extends MichelsonType | MichelsonType[], T2 extends T1>(a: T1, b: T2, field: boolean = false): boolean {
    try {
        assertTypesEqual(a, b, field);
        return true;
    } catch {
        return false;
    }
}