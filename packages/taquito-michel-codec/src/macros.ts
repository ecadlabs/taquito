import { Prim, Expr, IntLiteral } from "./micheline";
import { Tuple, NoArgs, ReqArgs, NoAnnots } from "./utils";

export class MacroError extends Error {
    constructor(public prim: Prim, message?: string) {
        super(message);
    }
}

function assertArgs<N extends number>(ex: Prim, n: N):
    ex is N extends 0 ?
    NoArgs<Prim<string>> :
    ReqArgs<Prim<string, Tuple<Expr, N>>> {
    if ((n === 0 && ex.args === undefined) || ex.args?.length === n) {
        return true;
    }
    throw new MacroError(ex, `macro ${ex.prim} expects ${n} arguments, was given ${ex.args?.length}`);
}

function assertNoAnnots(ex: Prim): ex is NoAnnots<Prim> {
    if (ex.annots === undefined) {
        return true;
    }
    throw new MacroError(ex, `unexpected annotation for macro ${ex.prim}`);
}

function assertIntArg(ex: Prim, arg: Expr): arg is IntLiteral {
    if ("int" in arg) {
        return true;
    }
    throw new MacroError(ex, `macro ${ex.prim} expects int argument`);
}

function mkPrim({ prim, annots, args }: { prim: string; annots?: string[]; args?: Expr[]; }): Prim {
    const ret: Prim = { prim };
    if (annots !== undefined) {
        ret.annots = annots;
    }
    if (args !== undefined) {
        ret.args = args;
    }
    return ret;
}

function mayRename(annots?: string[]): Prim[] {
    return annots !== undefined ? [{ prim: "RENAME", annots }] : [];
}

function parsePairExpr(p: Prim, expr: string, annotations: string[]): [[number, string[]][], number, number] {
    const ret: [number, string[]][] = [];
    let i = 0;
    let ai = 0;
    const ann: string[] = ["", ""];

    // Left expression
    if (i === expr.length) {
        throw new MacroError(p, `unexpected end: ${p.prim}`);
    }
    let c = expr[i++];
    switch (c) {
        case "P":
            const [r, n, an] = parsePairExpr(p, expr.substring(i), annotations.slice(ai));
            ret.push(...r);
            i += n;
            ai += an;
            break;
        case "A":
            if (ai !== annotations.length) {
                ann[0] = annotations[ai++];
            }
            break;
        default:
            throw new MacroError(p, `unexpected character: ${c}`);
    }

    // Right expression
    if (i === expr.length) {
        throw new MacroError(p, `unexpected end: ${p.prim}`);
    }
    c = expr[i++];
    switch (c) {
        case "P":
            const [r, n, an] = parsePairExpr(p, expr.substring(i), annotations.slice(ai));
            ret.push(...r.map<[number, string[]]>(([v, a]) => [v + 1, a]));
            i += n;
            ai += an;
            break;
        case "I":
            if (ai !== annotations.length) {
                ann[1] = annotations[ai++];
            }
            break;
        default:
            throw new MacroError(p, `unexpected character: ${c}`);
    }

    while (ann.length !== 0 && ann[ann.length - 1] === "") {
        ann.pop();
    }
    ret.push([0, ann.map(v => v === "" ? "%" : v)]);

    return [ret, i, ai];
}

/**
 * PAPPAIIR macro
 * Tezos client uses DIP N {code}. It expands nested blocks then collapses nested DIPs:
 * `DIP { DIP { DIP { PAIR } ; PAIR } ; PAIR } ; PAIR` ->
 * `DIP { DIP { DIP { PAIR }}} ; DIP { DIP { PAIR }} ; DIP { PAIR } ; PAIR` ->
 * `DIP 3 { PAIR } ; DIP 2 { PAIR } ; DIP { PAIR } ; PAIR`
 */

function parsePair(ex: Prim): Prim[] {
    const fieldAnnotations: string[] = [];
    const restAnnotations: string[] = [];
    if (ex.annots !== undefined) {
        for (const v of ex.annots) {
            (v.length !== 0 && v[0] === "%" ? fieldAnnotations : restAnnotations).push(v);
        }
    }

    const [r] = parsePairExpr(ex, ex.prim.substring(1), fieldAnnotations);
    return r.map(([v, a], i) => {
        if (v === 0) {
            const ann = i === r.length - 1 ? [...a, ...restAnnotations] : a;
            return mkPrim({
                prim: "PAIR",
                annots: ann.length !== 0 ? ann : undefined,
            });
        } else {
            return {
                prim: "DIP",
                args: v === 1 ?
                    [
                        [mkPrim({ prim: "PAIR", annots: a.length !== 0 ? a : undefined })]
                    ] :
                    [
                        { int: String(v) },
                        [mkPrim({ prim: "PAIR", annots: a.length !== 0 ? a : undefined })]
                    ],
            };
        }
    });
}
/*
function parseUnpairExpr(p: Prim, expr: string, annotations: string[]): [[number, string[]][], number, number] {
    const ret: [number, string[]][] = [];
    let i = 0;
    let ai = 0;

    // Left expression
    if (i === expr.length) {
        throw new MacroError(p, `unexpected end: ${p.prim}`);
    }
    let c = expr[i++];
    if (c === "P") {
        const [r, n, an] = parseUnpairExpr(p, expr.substring(i), annotations.slice(ai));
        ret.push(...r);
        i += n;
        ai += an;
    } else if (c !== "A") {
        throw new MacroError(p, `unexpected character: ${c}`);
    }

    // Right expression
    if (i === expr.length) {
        throw new MacroError(p, `unexpected end: ${p.prim}`);
    }
    c = expr[i++];
    if (c === "P") {
        const [r, n, an] = parseUnpairExpr(p, expr.substring(i), annotations.slice(ai));
        ret.push(...r.map<[number, string[]]>(([v, a]) => [v + 1, a]));
        i += n;
        ai += an;
    } else if (c !== "I") {
        throw new MacroError(p, `unexpected character: ${c}`);
    }

    const an = annotations.length - ai > 2 ? 2 : annotations.length - ai;
    return [
        [[0, annotations.slice(ai, ai + an)], ...ret], i, ai
    ];
}
*/

const pairRe = /^P[PAI]{3,}R$/;

export function expandMacros(ex: Prim): Prim | Prim[] {
    switch (ex.prim) {
        // Compare
        case "CMPEQ":
        case "CMPNEQ":
        case "CMPLT":
        case "CMPGT":
        case "CMPLE":
        case "CMPGE":
            if (assertArgs(ex, 0)) {
                return [
                    { prim: "COMPARE" },
                    mkPrim({ prim: ex.prim.substring(3), annots: ex.annots }),
                ];
            }

        case "IFEQ":
        case "IFNEQ":
        case "IFLT":
        case "IFGT":
        case "IFLE":
        case "IFGE":
            if (assertArgs(ex, 2)) {
                return [
                    { prim: ex.prim.substring(2) },
                    mkPrim({ prim: "IF", annots: ex.annots, args: ex.args }),
                ];
            }

        case "IFCMPEQ":
        case "IFCMPNEQ":
        case "IFCMPLT":
        case "IFCMPGT":
        case "IFCMPLE":
        case "IFCMPGE":
            if (assertArgs(ex, 2)) {
                return [
                    { prim: "COMPARE" },
                    { prim: ex.prim.substring(5) },
                    mkPrim({ prim: "IF", annots: ex.annots, args: ex.args }),
                ];
            }

        // Fail
        case "FAIL":
            if (assertArgs(ex, 0) && assertNoAnnots(ex)) {
                return [
                    { prim: "UNIT" },
                    { prim: "FAILWITH" },
                ];
            }

        // Assertion macros
        case "ASSERT":
            if (assertArgs(ex, 0) && assertNoAnnots(ex)) {
                return [{
                    prim: "IF", args: [
                        [],
                        [expandMacros({ prim: "FAIL" })],
                    ]
                }];
            }

        case "ASSERT_EQ":
        case "ASSERT_NEQ":
        case "ASSERT_LT":
        case "ASSERT_GT":
        case "ASSERT_LE":
        case "ASSERT_GE":
        case "ASSERT_CMPEQ":
        case "ASSERT_CMPNEQ":
        case "ASSERT_CMPLT":
        case "ASSERT_CMPGT":
        case "ASSERT_CMPLE":
        case "ASSERT_CMPGE":
            if (assertArgs(ex, 0) && assertNoAnnots(ex)) {
                return expandMacros({
                    prim: "IF" + ex.prim.substring(7), args: [
                        [],
                        [expandMacros({ prim: "FAIL" })],
                    ]
                });
            }

        case "ASSERT_NONE":
            if (assertArgs(ex, 0) && assertNoAnnots(ex)) {
                return [{
                    prim: "IF_NONE", args: [
                        [],
                        [expandMacros({ prim: "FAIL" })],
                    ]
                }];
            }

        case "ASSERT_SOME":
            if (assertArgs(ex, 0)) {
                return [{
                    prim: "IF_NONE", args: [
                        [expandMacros({ prim: "FAIL" })],
                        mayRename(ex.annots),
                    ]
                }];
            }

        case "ASSERT_LEFT":
            if (assertArgs(ex, 0)) {
                return [{
                    prim: "IF_LEFT", args: [
                        mayRename(ex.annots),
                        [expandMacros({ prim: "FAIL" })],
                    ]
                }];
            }

        case "ASSERT_RIGHT":
            if (assertArgs(ex, 0)) {
                return [{
                    prim: "IF_LEFT", args: [
                        [expandMacros({ prim: "FAIL" })],
                        mayRename(ex.annots),
                    ]
                }];
            }

        // Syntactic conveniences
        case "DUP":
            if (ex.args === undefined) {
                return ex;
            }

            if (assertArgs(ex, 1) && assertIntArg(ex, ex.args[0])) {
                const n = parseInt(ex.args[0].int, 10);

                if (n === 1) {
                    return [mkPrim({ prim: "DUP", annots: ex.annots })];

                } else if (n === 2) {
                    return [
                        {
                            prim: "DIP",
                            args: [mkPrim({ prim: "DUP", annots: ex.annots })],
                        },
                        { prim: "SWAP" },
                    ];

                } else {
                    return [
                        {
                            prim: "DIP",
                            args: [
                                { int: String(n - 1) },
                                mkPrim({ prim: "DUP", annots: ex.annots }),
                            ],
                        },
                        {
                            prim: "DIG",
                            args: [{ int: String(n) }],
                        },
                    ];
                }
            }

        case "IF_SOME":
            if (assertArgs(ex, 2)) {
                return [mkPrim({ prim: "IF_NONE", annots: ex.annots, args: [ex.args[1], ex.args[0]] })];
            }

        case "IF_RIGHT":
            if (assertArgs(ex, 2)) {
                return [mkPrim({ prim: "IF_LEFT", annots: ex.annots, args: [ex.args[1], ex.args[0]] })];
            }
    }

    // More syntactic conveniences

    // PAPPAIIR macro
    if (pairRe.test(ex.prim)) {
        if (assertArgs(ex, 0)) {
            return parsePair(ex);
        }
    }

    /*
    // UNPAPPAIIR macro
    if (/^UNP[PAI]{2,}R$/.test(ex.prim)) {

    }
    */

    return ex;
}