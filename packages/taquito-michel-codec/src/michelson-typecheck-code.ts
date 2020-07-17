import {
    MichelsonInstruction, MichelsonType, MichelsonTypeId,
    MichelsonSimpleComparableTypeId, MichelsonTypeOption
} from "./michelson-types";
import { ObjectTreePath, MichelsonError } from "./utils";
import { assertTypesEqual, typesEqual } from "./michelson-typecheck-type";
import { Prim } from "./micheline";

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
            throw new MichelsonError(instruction, path, `${prim}: stack must have at least ${typeIds.length} element(s)`);
        }

        let i = n;
        for (const ids of typeIds) {
            if (ids !== null && ids.length !== 0) {
                let ii = 0;
                while (ii < ids.length && ids[ii] !== stack[i].prim) {
                    ii++;
                }
                if (ii === ids.length) {
                    throw new MichelsonError(instruction, path, `${prim}: stack type mismatch: [${i}] expected to be ${ids}, got ${stack[i].prim} instead`);
                }
            }
            i++;
        }
        return stack.slice(n, typeIds.length + n) as StackType<T>;
    }

    function rest(n?: number): MichelsonType[] {
        if (n !== undefined && stack.length < n) {
            throw new MichelsonError(instruction, path, `${prim}: stack must have at least ${n} element(s)`);
        }
        return stack.slice(n);
    }


    function assertComparableType(type: MichelsonType) {
        if (Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, type.prim)) {
            return;
        } else if (type.prim === "pair" && Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, type.args[0].prim)) {
            assertComparableType(type.args[1]);
        } else {
            throw new MichelsonError(instruction, path, `${prim}: comparable type expected: ${type}`);
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
                    throw new MichelsonError(instruction, path, `${instruction.prim}: function's argument must be a pair: ${s[1].args[0].prim}`);
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
                        throw new MichelsonError(instruction, path, `${instruction.prim}: can't concatenate list of ${s0[0].args[0].prim}'s`);
                    }
                    return [s0[0].args[0], ...rest(1)];
                } else {
                    const s1 = top(1, ["string", "bytes"]);
                    if (s0[0].prim !== s1[0].prim) {
                        throw new MichelsonError(instruction, path, `${instruction.prim}: can't concatenate ${s0[0].prim} with ${s1[0].prim}`);
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
                    throw new MichelsonError(instruction, path, `${instruction.prim}: can't add ${s[0].prim} to ${s[1].prim}`);
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
                    throw new MichelsonError(instruction, path, `${instruction.prim}: can't subtract ${s[0].prim} from ${s[1].prim}`);
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
                    throw new MichelsonError(instruction, path, `${instruction.prim}: can't multiply ${s[0].prim} by ${s[1].prim}`);
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
                    throw new MichelsonError(instruction, path, `${instruction.prim}: can't euclideally divide ${s[0].prim} by ${s[1].prim}`);
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
                    throw new MichelsonError(instruction, path, `${instruction.prim}: both arguments must be of the same type: ${s[0].prim}, ${s[1].prim}`);
                }
                return rest(1);
            }

        case "AND":
            {
                const s = top(0, ["nat", "bool", "int"], ["nat", "bool"]);
                if ((s[0].prim !== "int" || s[1].prim !== "nat") && s[0].prim !== s[1].prim) {
                    throw new MichelsonError(instruction, path, `${instruction.prim}: both arguments must be of the same type: ${s[0].prim}, ${s[1].prim}`);
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
                    throw new MichelsonError(instruction, path, `${instruction.prim}: key hash expected: ${s[0].args[0].prim}`);
                }
                return [{ prim: "operation" }, ...rest(1)];
            }

        case "CREATE_ACCOUNT":
            {
                const s = top(0, ["key_hash"], ["option"], ["bool"], ["mutez"]);
                if (s[1].args[0].prim !== "key_hash") {
                    throw new MichelsonError(instruction, path, `${instruction.prim}: key hash expected: ${s[1].args[0].prim}`);
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
            return [{ prim: "option", args: [instruction.args[0]] }, ...stack];

        case "LEFT":
            return [{ prim: "or", args: [top(0, null)[0], instruction.args[0]] }, ...rest(1)];

        case "RIGHT":
            return [{ prim: "or", args: [instruction.args[0], top(0, null)[0]] }, ...rest(1)];

        case "NIL":
            return [{ prim: "list", args: [instruction.args[0]] }, ...stack];

        case "UNPACK":
            if (!Object.prototype.hasOwnProperty.call(packableTypesTable, instruction.args[0].prim)) {
                throw new MichelsonError(instruction, path, `${instruction.prim}: packable type expected: ${instruction.args[0].prim}`);
            }
            top(0, ["bytes"]);
            return [{ prim: "option", args: [instruction.args[0]] }, ...rest(1)];

        case "CONTRACT":
            top(0, ["address"]);
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
                    throw new MichelsonError(instruction, path, `${instruction.prim}: body must return a value`);
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
            return [instruction.args[0], ...stack];

        case "EMPTY_SET":
            return [{ prim: "set", args: instruction.args }, ...stack];

        case "EMPTY_MAP":
        case "EMPTY_BIG_MAP":
            return [{ prim: instruction.prim === "EMPTY_MAP" ? "map" : "big_map", args: instruction.args }, ...stack];

        case "LAMBDA":
            {
                const body = instructionType(instruction.args[2], [instruction.args[0]], [...path, { index: 2, val: instruction.args[2] }]);
                if ("failed" in body) {
                    return body;
                }
                assertTypesEqual([instruction.args[1]], body, path);
                return [{ prim: "lambda", args: [instruction.args[0], instruction.args[1]] }, ...stack];
            }

        default:
            throw new Error(`Unexpected instruction: ${(instruction as Prim).prim}`);
    }
}
