import {
    Expr, Prim, StringLiteral, IntLiteral, BytesLiteral,
    MichelsonScript, NoArgs, ReqArgs, MichelsonInstruction,
    MichelsonData, MichelsonType, MichelsonUnaryInstructionId,
    MichelsonComparableType, MichelsonSimpleComparableType,
    MichelsonSimpleComparableTypeId,
    MichelsonInstructionId,
} from "./ast";

interface PathElem {
    index: number;
    val: Expr;
}

export class ValidationError extends Error {
    constructor(public val: Expr, public path?: PathElem[], message?: string) {
        super(message);
    }
}

function isPrim(ex: Expr): ex is Prim {
    if (typeof ex === "object" &&
        "prim" in ex &&
        typeof ex.prim === "string" &&
        (ex.annots === undefined || Array.isArray(ex.annots)) &&
        (ex.args === undefined || Array.isArray(ex.args))) {

        if (ex.annots !== undefined) {
            for (const a of ex.annots) {
                if (typeof a !== "string") {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}

function isStringLiteral(ex: Expr): ex is StringLiteral {
    return typeof ex === "object" &&
        "string" in ex
        && typeof ex.string === "string";
}

const intRe = new RegExp("^-?[0-9]+$");
const bytesRe = new RegExp("^([0-9a-fA-F]{2})+$");

function isIntLiteral(ex: Expr): ex is IntLiteral {
    return typeof ex === "object" &&
        "int" in ex &&
        typeof ex.int === "string" &&
        intRe.test(ex.int);
}

function isBytesLiteral(ex: Expr): ex is BytesLiteral {
    return typeof ex === "object" &&
        "bytes" in ex &&
        typeof ex.bytes === "string" &&
        bytesRe.test(ex.bytes);
}

function assertPrim(ex: Expr, path: PathElem[]): ex is Prim {
    if (isPrim(ex)) {
        return true;
    }
    throw new ValidationError(ex, path, "prim expression expected");
}

function assertSeq(ex: Expr, path: PathElem[]): ex is Expr[] {
    if (Array.isArray(ex)) {
        return true;
    }
    throw new ValidationError(ex, path, "sequence expression expected");
}

function assertNatural(i: IntLiteral, path: PathElem[]) {
    if (i.int[0] === "-") {
        throw new ValidationError(i, path, "natural number expected");
    }
}

function assertIntLiteral(ex: Expr, path: PathElem[]): ex is IntLiteral {
    if (isIntLiteral(ex)) {
        return true;
    }
    throw new ValidationError(ex, path, "int literal expected");
}

type Tuple<T, N extends number> = N extends 1 ? [T] :
    N extends 2 ? [T, T] :
    N extends 3 ? [T, T, T] :
    N extends 4 ? [T, T, T, T] :
    never;

function assertArgs<N extends number>(ex: Prim, n: N, path: PathElem[]):
    ex is N extends 0 ?
    NoArgs<Prim> :
    ReqArgs<Prim<string, Tuple<Expr, N>>> {
    if ((n === 0 && ex.args === undefined) || ex.args?.length === n) {
        return true;
    }
    throw new ValidationError(ex, path, `${n} arguments expected`);
}

const unaryInstructionTable: Record<MichelsonUnaryInstructionId, boolean> = {
    "DUP": true, "SWAP": true, "SOME": true, "UNIT": true, "PAIR": true, "CAR": true, "CDR": true,
    "CONS": true, "SIZE": true, "MEM": true, "GET": true, "UPDATE": true, "EXEC": true, "FAILWITH": true, "RENAME": true, "CONCAT": true, "SLICE": true,
    "PACK": true, "ADD": true, "SUB": true, "MUL": true, "EDIV": true, "ABS": true, "ISNAT": true, "INT": true, "NEG": true, "LSL": true, "LSR": true, "OR": true,
    "AND": true, "XOR": true, "NOT": true, "COMPARE": true, "EQ": true, "NEQ": true, "LT": true, "GT": true, "LE": true, "GE": true, "SELF": true,
    "TRANSFER_TOKENS": true, "SET_DELEGATE": true, "CREATE_ACCOUNT": true, "IMPLICIT_ACCOUNT": true, "NOW": true, "AMOUNT": true,
    "BALANCE": true, "CHECK_SIGNATURE": true, "BLAKE2B": true, "SHA256": true, "SHA512": true, "HASH_KEY": true, "STEPS_TO_QUOTA": true,
    "SOURCE": true, "SENDER": true, "ADDRESS": true, "CHAIN_ID": true,
};

const instructionTable: Record<MichelsonInstructionId, boolean> = Object.assign({}, unaryInstructionTable, {
    "DROP": true, "DIG": true, "DUG": true, "NONE": true, "LEFT": true, "RIGHT": true, "NIL": true, "UNPACK": true, "CONTRACT": true, "CAST": true,
    "IF_NONE": true, "IF_LEFT": true, "IF_CONS": true, "IF": true, "MAP": true, "ITER": true, "LOOP": true, "LOOP_LEFT": true, "DIP": true,
    "CREATE_CONTRACT": true, "PUSH": true, "EMPTY_SET": true, "EMPTY_MAP": true, "EMPTY_BIG_MAP": true, "LAMBDA": true,
});

function assertMichelsonInstruction(ex: Expr[] | Prim, path: PathElem[]): ex is MichelsonInstruction {
    if (Array.isArray(ex)) {
        let i = 0;
        for (const n of ex) {
            const p = [...path, { index: i, val: n }];
            if (!Array.isArray(n) && !isPrim(n)) {
                throw new ValidationError(ex, p, "sequence or prim expected");
            }
            assertMichelsonInstruction(n, p);
            i++;
        }
    } else if (Object.prototype.hasOwnProperty.call(unaryInstructionTable, ex.prim)) {
        assertArgs(ex, 0, path);
    } else {
        switch (ex.prim) {
            case "DROP":
                if (ex.args !== undefined && assertArgs(ex, 1, path)) {
                    const p = [...path, { index: 0, val: ex.args[0] }];
                    /* istanbul ignore else */
                    if (assertIntLiteral(ex.args[0], p)) {
                        assertNatural(ex.args[0], p);
                    }
                }
                break;

            case "DIG":
            case "DUG":
                /* istanbul ignore else */
                if (assertArgs(ex, 1, path)) {
                    const p = [...path, { index: 0, val: ex.args[0] }];
                    /* istanbul ignore else */
                    if (assertIntLiteral(ex.args[0], p)) {
                        assertNatural(ex.args[0], p);
                    }
                }
                break;

            case "NONE":
            case "LEFT":
            case "RIGHT":
            case "NIL":
            case "UNPACK":
            case "CONTRACT":
            case "CAST":
                /* istanbul ignore else */
                if (assertArgs(ex, 1, path)) {
                    assertMichelsonTypeInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                }
                break;

            case "IF_NONE":
            case "IF_LEFT":
            case "IF_CONS":
            case "IF":
                /* istanbul ignore else */
                if (assertArgs(ex, 2, path)) {
                    const p0 = [...path, { index: 0, val: ex.args[0] }];
                    /* istanbul ignore else */
                    if (assertSeq(ex.args[0], p0)) {
                        assertMichelsonInstruction(ex.args[0], p0);
                    }
                    const p1 = [...path, { index: 1, val: ex.args[1] }];
                    /* istanbul ignore else */
                    if (assertSeq(ex.args[1], p1)) {
                        assertMichelsonInstruction(ex.args[1], p1);
                    }
                }
                break;

            case "MAP":
            case "ITER":
            case "LOOP":
            case "LOOP_LEFT":
            case "CREATE_CONTRACT":
                /* istanbul ignore else */
                if (assertArgs(ex, 1, path)) {
                    const p = [...path, { index: 0, val: ex.args[0] }];
                    /* istanbul ignore else */
                    if (assertSeq(ex.args[0], p)) {
                        assertMichelsonInstruction(ex.args[0], p);
                    }
                }
                break;

            case "DIP":
                if (ex.args?.length === 2) {
                    const p0 = [...path, { index: 0, val: ex.args[0] }];
                    /* istanbul ignore else */
                    if (assertIntLiteral(ex.args[0], p0)) {
                        assertNatural(ex.args[0], p0);
                    }
                    const p1 = [...path, { index: 1, val: ex.args[1] }];
                    /* istanbul ignore else */
                    if (assertSeq(ex.args[1], p1)) {
                        assertMichelsonInstruction(ex.args[1], p1);
                    }
                } else if (ex.args?.length === 1) {
                    const p = [...path, { index: 0, val: ex.args[0] }];
                    /* istanbul ignore else */
                    if (assertSeq(ex.args[0], p)) {
                        assertMichelsonInstruction(ex.args[0], p);
                    }
                } else {
                    throw new ValidationError(ex, path, "1 or 2 arguments expected");
                }
                break;

            case "PUSH":
                /* istanbul ignore else */
                if (assertArgs(ex, 2, path)) {
                    assertMichelsonTypeInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                    assertMichelsonDataInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
                }
                break;

            case "EMPTY_SET":
                /* istanbul ignore else */
                if (assertArgs(ex, 1, path)) {
                    assertMichelsonComparableType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                }
                break;

            case "EMPTY_MAP":
            case "EMPTY_BIG_MAP":
                /* istanbul ignore else */
                if (assertArgs(ex, 2, path)) {
                    assertMichelsonComparableType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                    assertMichelsonTypeInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
                }
                break;

            case "LAMBDA":
                /* istanbul ignore else */
                if (assertArgs(ex, 3, path)) {
                    assertMichelsonTypeInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                    assertMichelsonTypeInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
                    const p2 = [...path, { index: 2, val: ex.args[2] }];
                    /* istanbul ignore else */
                    if (assertSeq(ex.args[2], p2)) {
                        assertMichelsonInstruction(ex.args[2], p2);
                    }
                }
                break;

            default:
                throw new ValidationError(ex, path, "instruction expected");
        }
    }
    return true;
}

const simpleComparableTypeTable: Record<MichelsonSimpleComparableTypeId, boolean> = {
    "int": true, "nat": true, "string": true, "bytes": true, "mutez": true,
    "bool": true, "key_hash": true, "timestamp": true, "address": true,
};

function assertMichelsonSimpleComparableType(ex: Expr, path: PathElem[]): ex is MichelsonSimpleComparableType {
    /* istanbul ignore else */
    if (assertPrim(ex, path)) {
        if (!Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, ex.prim)) {
            throw new ValidationError(ex, path, "simple comparable type expected");
        }
        assertArgs(ex, 0, path);
    }
    return true;
}

function assertMichelsonComparableType(ex: Expr, path: PathElem[]): ex is MichelsonComparableType {
    /* istanbul ignore else */
    if (assertPrim(ex, path)) {
        if (Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, ex.prim)) {
            assertArgs(ex, 0, path);
        } else if (ex.prim === "pair") {
            /* istanbul ignore else */
            if (assertArgs(ex, 2, path)) {
                assertMichelsonSimpleComparableType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                assertMichelsonComparableType(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
            }
        } else {
            throw new ValidationError(ex, path, "comparable type expected");
        }
    }
    return true;
}

function assertMichelsonTypeInternal(ex: Expr, path: PathElem[]): ex is MichelsonType {
    /* istanbul ignore else */
    if (assertPrim(ex, path)) {
        switch (ex.prim) {
            case "key":
            case "unit":
            case "signature":
            case "operation":
            case "chain_id":
                assertArgs(ex, 0, path);
                break;

            case "option":
            case "list":
            case "contract":
                /* istanbul ignore else */
                if (assertArgs(ex, 1, path)) {
                    assertMichelsonTypeInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                }
                break;

            case "pair":
            case "or":
            case "lambda":
                /* istanbul ignore else */
                if (assertArgs(ex, 2, path)) {
                    assertMichelsonTypeInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                    assertMichelsonTypeInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
                }
                break;

            case "set":
                /* istanbul ignore else */
                if (assertArgs(ex, 1, path)) {
                    assertMichelsonComparableType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                }
                break;

            case "map":
            case "big_map":
                /* istanbul ignore else */
                if (assertArgs(ex, 2, path)) {
                    assertMichelsonComparableType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                    assertMichelsonTypeInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
                }
                break;

            default:
                assertMichelsonComparableType(ex, path);
        }
    }

    return true;
}

function assertMichelsonDataInternal(ex: Expr, path: PathElem[]): ex is MichelsonData {
    if (isIntLiteral(ex) || isStringLiteral(ex) || isBytesLiteral(ex)) {
        return true;
    }

    if (Array.isArray(ex)) {
        let mapElts = 0;
        let i = 0;
        for (const n of ex) {
            const p = [...path, { index: i, val: n }];
            if (isPrim(n) && n.prim === "Elt") {
                /* istanbul ignore else */
                if (assertArgs(n, 2, p)) {
                    assertMichelsonDataInternal(n.args[0], [...p, { index: 0, val: n.args[0] }]);
                    assertMichelsonDataInternal(n.args[1], [...p, { index: 1, val: n.args[1] }]);
                }
                mapElts++;
            } else {
                assertMichelsonDataInternal(n, p);
            }
            i++;
        }

        if (mapElts !== 0 && mapElts !== ex.length) {
            throw new ValidationError(ex, path, "data entries and map elements can't be intermixed");
        }
        return true;
    }

    if (isPrim(ex)) {
        switch (ex.prim) {
            case "Unit":
            case "True":
            case "False":
            case "None":
                assertArgs(ex, 0, path);
                break;

            case "Pair":
                /* istanbul ignore else */
                if (assertArgs(ex, 2, path)) {
                    assertMichelsonDataInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                    assertMichelsonDataInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
                }
                break;

            case "Left":
            case "Right":
            case "Some":
                /* istanbul ignore else */
                if (assertArgs(ex, 1, path)) {
                    assertMichelsonDataInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
                }
                break;

            default:
                if (Object.prototype.hasOwnProperty.call(instructionTable, ex.prim)) {
                    assertMichelsonInstruction(ex, path);
                } else {
                    throw new ValidationError(ex, path, "data entry or instruction expected");
                }
        }
    } else {
        throw new ValidationError(ex, path, "data entry expected");
    }

    return true;
}

function assertMichelsonScriptInternal(ex: Expr, path: PathElem[]): ex is MichelsonScript {
    /* istanbul ignore else */
    if (assertSeq(ex, path) && ex.length === 3 &&
        assertPrim(ex[0], [...path, { index: 0, val: ex[0] }]) &&
        assertPrim(ex[1], [...path, { index: 1, val: ex[1] }]) &&
        assertPrim(ex[2], [...path, { index: 2, val: ex[2] }])) {

        const p = [ex[0].prim, ex[1].prim, ex[2].prim].sort();
        if (p[0] === "code" && p[1] === "parameter" && p[2] === "storage") {
            let i = 0;
            for (const n of <Prim[]>ex) {
                const p = [...path, { index: i, val: n }];

                /* istanbul ignore else */
                if (assertArgs(n, 1, p)) {
                    const pp = [...p, { index: 0, val: n.args[0] }];

                    switch (n.prim) {
                        case "code":
                            /* istanbul ignore else */
                            if (assertSeq(n.args[0], pp)) {
                                assertMichelsonInstruction(n.args[0], pp);
                            }
                            break;

                        case "parameter":
                        case "storage":
                            assertMichelsonTypeInternal(n.args[0], pp);
                    }
                }
                i++;
            }
        } else {
            throw new ValidationError(ex, path, "valid Michelson script expected");
        }
    }
    return true;
}

export function assertMichelsonScript(ex: Expr): ex is MichelsonScript {
    return assertMichelsonScriptInternal(ex, []);
}

export function assertMichelsonData(ex: Expr): ex is MichelsonData {
    return assertMichelsonDataInternal(ex, []);
}

export function assertMichelsonCode(ex: Expr[]): ex is MichelsonInstruction[] {
    return assertMichelsonInstruction(ex, []);
}

export function assertMichelsonType(ex: Expr): ex is MichelsonType {
    return assertMichelsonTypeInternal(ex, []);
}
