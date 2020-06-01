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

function mayRename(annots?: string[]): Prim[] {
    return annots !== undefined ? [{ prim: "RENAME", annots }] : [];
}

type PT = [number, [string | null, string | null]];

function parsePairUnpairExpr(p: Prim, expr: string, annotations: string[], agg: (a: PT[], v: PT) => PT[]): { r: PT[], n: number, an: number } {
    const res: PT[] = [];
    let i = 0;
    let ai = 0;
    const ann: [string | null, string | null] = [null, null];

    // Left expression
    if (i === expr.length) {
        throw new MacroError(p, `unexpected end: ${p.prim}`);
    }
    let c = expr[i++];
    switch (c) {
        case "P":
            const { r, n, an } = parsePairUnpairExpr(p, expr.substring(i), annotations.slice(ai), agg);
            res.push(...r);
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
            const { r, n, an } = parsePairUnpairExpr(p, expr.substring(i), annotations.slice(ai), agg);
            res.push(...r.map<PT>(([v, a]) => [v + 1, a]));
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

    return { r: agg(res, [0, ann]), n: i, an: ai };
}

function trimLast<T>(a: T[], v: T): T[] {
    let l = a.length;
    while (l > 0 && a[l - 1] === v) {
        l--;
    }
    return a.slice(0, l);
}

function filterAnnotations(a?: string[]): {
    fields: string[];
    rest: string[];
} {
    const fields: string[] = [];
    const rest: string[] = [];
    if (a !== undefined) {
        for (const v of a) {
            (v.length !== 0 && v[0] === "%" ? fields : rest).push(v);
        }
    }
    return { fields, rest };
}

const pairRe = /^P[PAI]{3,}R$/;
const unpairRe = /^UNP[PAI]{2,}R$/;

// Unspecified code expression
type CExpr = Prim | CExpr[];

export function expandMacros(ex: Prim): CExpr {
    function mkPrim({ prim, annots, args }: Prim): Prim {
        return {
            prim,
            ...(annots && { annots }),
            ...(args && { args }),
        };
    }

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
            const { fields, rest } = filterAnnotations(ex.annots);
            const { r } = parsePairUnpairExpr(ex, ex.prim.substring(1), fields, (a, v) => [...a, v]);

            return r.map(([v, a], i) => {
                const ann = [
                    ...trimLast(a, null).map(v => v === null ? "%" : v),
                    ...((v === 0 && i === r.length - 1) ? rest : [])];

                const leaf = mkPrim({ prim: "PAIR", annots: ann.length !== 0 ? ann : undefined, });

                return v === 0 ? leaf : {
                    prim: "DIP",
                    args: v === 1 ? [[leaf]] : [{ int: String(v) }, [leaf]],
                };
            });
        }
    }

    // UNPAPPAIIR macro
    if (unpairRe.test(ex.prim)) {
        if (assertArgs(ex, 0)) {
            const { r } = parsePairUnpairExpr(ex, ex.prim.substring(3), ex.annots || [], (a, v) => [v, ...a]);

            return r.map(([v, a]) => {
                const leaf: Prim[] = [
                    { prim: "DUP" },
                    mkPrim({ prim: "CAR", annots: a[0] !== null ? [a[0]] : undefined }),
                    {
                        prim: "DIP",
                        args: [[mkPrim({ prim: "CDR", annots: a[1] !== null ? [a[1]] : undefined })]],
                    }
                ];

                return v === 0 ? leaf : {
                    prim: "DIP",
                    args: v === 1 ? [[leaf]] : [{ int: String(v) }, [leaf]],
                };
            });
        }
    }

    return ex;
}