import { Prim, Expr, IntLiteral } from "./micheline";
import { DefaultProtocol, Protocol, ProtocolOptions } from "./michelson-types";
import { Tuple, NoArgs, ReqArgs, NoAnnots } from "./utils";

export class MacroError extends Error {
    constructor(public prim: Prim, message?: string) {
        super(message);
        Object.setPrototypeOf(this, MacroError.prototype);
    }
}

function assertArgs<N extends number>(ex: Prim, n: N):
    ex is N extends 0 ?
    NoArgs<Prim<string>> :
    ReqArgs<Prim<string, Tuple<N, Expr>>> {
    if ((n === 0 && ex.args === undefined) || ex.args?.length === n) {
        return true;
    }
    throw new MacroError(ex, `macro ${ex.prim} expects ${n} arguments, was given ${ex.args?.length}`);
}

function assertNoAnnots(ex: Prim): ex is NoAnnots<Prim> {
    if (ex.annots === undefined) {
        return true;
    }
    throw new MacroError(ex, `unexpected annotation on macro ${ex.prim}: ${ex.annots}`);
}

function assertIntArg(ex: Prim, arg: Expr): arg is IntLiteral {
    if ("int" in arg) {
        return true;
    }
    throw new MacroError(ex, `macro ${ex.prim} expects int argument`);
}

type PT = [number, [string | null, string | null]];

function parsePairUnpairExpr(p: Prim, expr: string, annotations: string[], agg: (l: PT[] | undefined, r: PT[] | undefined, top: PT) => PT[]): { r: PT[], n: number, an: number } {
    let i = 0;
    let ai = 0;
    const ann: [string | null, string | null] = [null, null];

    // Left expression
    let lexpr: PT[] | undefined;
    if (i === expr.length) {
        throw new MacroError(p, `unexpected end: ${p.prim}`);
    }
    let c = expr[i++];
    switch (c) {
        case "P":
            const { r, n, an } = parsePairUnpairExpr(p, expr.slice(i), annotations.slice(ai), agg);
            lexpr = r;
            i += n;
            ai += an;
            break;
        case "A":
            if (ai !== annotations.length) {
                ann[0] = annotations[ai++];
            }
            break;
        default:
            throw new MacroError(p, `${p.prim}: unexpected character: ${c}`);
    }

    // Right expression
    let rexpr: PT[] | undefined;
    if (i === expr.length) {
        throw new MacroError(p, `unexpected end: ${p.prim}`);
    }
    c = expr[i++];
    switch (c) {
        case "P":
            const { r, n, an } = parsePairUnpairExpr(p, expr.slice(i), annotations.slice(ai), agg);
            rexpr = r.map<PT>(([v, a]) => [v + 1, a]);
            i += n;
            ai += an;
            break;
        case "I":
            if (ai !== annotations.length) {
                ann[1] = annotations[ai++];
            }
            break;
        default:
            throw new MacroError(p, `${p.prim}: unexpected character: ${c}`);
    }

    return { r: agg(lexpr, rexpr, [0, ann]), n: i, an: ai };
}

function parseSetMapCadr(p: Prim, expr: string, vann: string[], term: { a: Expr, d: Expr }): Expr {
    const c = expr[0];
    switch (c) {
        case "A":
            return expr.length > 1 ?
                [
                    { prim: "DUP" },
                    {
                        prim: "DIP",
                        args: [[
                            { prim: "CAR", annots: ["@%%"] },
                            parseSetMapCadr(p, expr.slice(1), [], term),
                        ]],
                    },
                    { prim: "CDR", annots: ["@%%"] },
                    { prim: "SWAP" },
                    { prim: "PAIR", annots: ["%@", "%@", ...vann] },
                ] : term.a;

        case "D":
            return expr.length > 1 ?
                [
                    { prim: "DUP" },
                    {
                        prim: "DIP",
                        args: [[
                            { prim: "CDR", annots: ["@%%"] },
                            parseSetMapCadr(p, expr.slice(1), [], term),
                        ]],
                    },
                    { prim: "CAR", annots: ["@%%"] },
                    { prim: "PAIR", annots: ["%@", "%@", ...vann] },
                ] : term.d;

        default:
            throw new MacroError(p, `${p.prim}: unexpected character: ${c}`);
    }
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

function mkPrim({ prim, annots, args }: Prim): Prim {
    return {
        prim,
        ...(annots && { annots }),
        ...(args && { args }),
    };
}

const pairRe = /^P[PAI]{3,}R$/;
const unpairRe = /^UNP[PAI]{2,}R$/;
const cadrRe = /^C[AD]{2,}R$/;
const setCadrRe = /^SET_C[AD]+R$/;
const mapCadrRe = /^MAP_C[AD]+R$/;
const diipRe = /^DI{2,}P$/;
const duupRe = /^DU+P$/;

export function expandMacros(ex: Prim, opt?: ProtocolOptions): Expr {
    const proto = opt?.protocol || DefaultProtocol;

    function mayRename(annots?: string[]): Prim[] {
        return annots !== undefined ? [{ prim: "RENAME", annots }] : [];
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
                    mkPrim({ prim: ex.prim.slice(3), annots: ex.annots }),
                ];
            }
            break;

        case "IFEQ":
        case "IFNEQ":
        case "IFLT":
        case "IFGT":
        case "IFLE":
        case "IFGE":
            if (assertArgs(ex, 2)) {
                return [
                    { prim: ex.prim.slice(2) },
                    mkPrim({ prim: "IF", annots: ex.annots, args: ex.args }),
                ];
            }
            break;

        case "IFCMPEQ":
        case "IFCMPNEQ":
        case "IFCMPLT":
        case "IFCMPGT":
        case "IFCMPLE":
        case "IFCMPGE":
            if (assertArgs(ex, 2)) {
                return [
                    { prim: "COMPARE" },
                    { prim: ex.prim.slice(5) },
                    mkPrim({ prim: "IF", annots: ex.annots, args: ex.args }),
                ];
            }
            break;

        // Fail
        case "FAIL":
            if (assertArgs(ex, 0) && assertNoAnnots(ex)) {
                return [
                    { prim: "UNIT" },
                    { prim: "FAILWITH" },
                ];
            }
            break;

        // Assertion macros
        case "ASSERT":
            if (assertArgs(ex, 0) && assertNoAnnots(ex)) {
                return [{
                    prim: "IF", args: [
                        [],
                        [[{ prim: "UNIT" }, { prim: "FAILWITH" }]],
                    ]
                }];
            }
            break;

        case "ASSERT_EQ":
        case "ASSERT_NEQ":
        case "ASSERT_LT":
        case "ASSERT_GT":
        case "ASSERT_LE":
        case "ASSERT_GE":
            if (assertArgs(ex, 0) && assertNoAnnots(ex)) {
                return [
                    { prim: ex.prim.slice(7) },
                    {
                        prim: "IF", args: [
                            [],
                            [[{ prim: "UNIT" }, { prim: "FAILWITH" }]],
                        ]
                    },
                ];
            }
            break;

        case "ASSERT_CMPEQ":
        case "ASSERT_CMPNEQ":
        case "ASSERT_CMPLT":
        case "ASSERT_CMPGT":
        case "ASSERT_CMPLE":
        case "ASSERT_CMPGE":
            if (assertArgs(ex, 0) && assertNoAnnots(ex)) {
                return [
                    [
                        { prim: "COMPARE" },
                        { prim: ex.prim.slice(10) },
                    ],
                    {
                        prim: "IF", args: [
                            [],
                            [[{ prim: "UNIT" }, { prim: "FAILWITH" }]],
                        ]
                    },
                ];
            }
            break;

        case "ASSERT_NONE":
            if (assertArgs(ex, 0) && assertNoAnnots(ex)) {
                return [{
                    prim: "IF_NONE", args: [
                        [],
                        [[{ prim: "UNIT" }, { prim: "FAILWITH" }]],
                    ]
                }];
            }
            break;

        case "ASSERT_SOME":
            if (assertArgs(ex, 0)) {
                return [{
                    prim: "IF_NONE", args: [
                        [[{ prim: "UNIT" }, { prim: "FAILWITH" }]],
                        mayRename(ex.annots),
                    ]
                }];
            }
            break;

        case "ASSERT_LEFT":
            if (assertArgs(ex, 0)) {
                return [{
                    prim: "IF_LEFT", args: [
                        mayRename(ex.annots),
                        [[{ prim: "UNIT" }, { prim: "FAILWITH" }]],
                    ]
                }];
            }
            break;

        case "ASSERT_RIGHT":
            if (assertArgs(ex, 0)) {
                return [{
                    prim: "IF_LEFT", args: [
                        [[{ prim: "UNIT" }, { prim: "FAILWITH" }]],
                        mayRename(ex.annots),
                    ]
                }];
            }
            break;

        // Syntactic conveniences

        case "IF_SOME":
            if (assertArgs(ex, 2)) {
                return [mkPrim({ prim: "IF_NONE", annots: ex.annots, args: [ex.args[1], ex.args[0]] })];
            }
            break;

        case "IF_RIGHT":
            if (assertArgs(ex, 2)) {
                return [mkPrim({ prim: "IF_LEFT", annots: ex.annots, args: [ex.args[1], ex.args[0]] })];
            }
            break;

        // CAR/CDR n
        case "CAR":
        case "CDR":
            if (ex.args !== undefined) {
                if (assertArgs(ex, 1) && assertIntArg(ex, ex.args[0])) {
                    const n = parseInt(ex.args[0].int, 10);
                    return mkPrim({
                        prim: "GET",
                        args: [{ int: ex.prim === "CAR" ? String(n * 2 + 1) : String(n * 2) }],
                        annots: ex.annots,
                    });
                }
            } else {
                return ex;
            }
    }

    // More syntactic conveniences

    // PAPPAIIR macro
    if (pairRe.test(ex.prim)) {
        if (assertArgs(ex, 0)) {
            const { fields, rest } = filterAnnotations(ex.annots);
            const { r } = parsePairUnpairExpr(ex, ex.prim.slice(1), fields, (l, r, top) => [...(l || []), ...(r || []), top]);

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
        if (proto === Protocol.PtEdo2Zk || 
            proto === Protocol.PsrsRVg1) {
            if (ex.prim === "UNPAIR") {
                return ex;
            }
            if (assertArgs(ex, 0)) {
                // 008_edo: annotations are deprecated
                const { r } = parsePairUnpairExpr(ex, ex.prim.slice(3), [], (l, r, top) => [top, ...(r || []), ...(l || [])]);
                return r.map(([v]) => {
                    const leaf = mkPrim({
                        prim: "UNPAIR",
                    });

                    return v === 0 ? leaf : {
                        prim: "DIP",
                        args: v === 1 ? [[leaf]] : [{ int: String(v) }, [leaf]],
                    };
                });
            }
        } else if (assertArgs(ex, 0)) {
            const { r } = parsePairUnpairExpr(ex, ex.prim.slice(3), ex.annots || [], (l, r, top) => [top, ...(r || []), ...(l || [])]);
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

    // C[AD]+R macro
    if (cadrRe.test(ex.prim)) {
        if (assertArgs(ex, 0)) {
            const ch = [...ex.prim.slice(1, ex.prim.length - 1)];

            return ch.map<Prim>((c, i) => {
                const ann = i === ch.length - 1 ? ex.annots : undefined;
                switch (c) {
                    case "A":
                        return mkPrim({ prim: "CAR", annots: ann });
                    case "D":
                        return mkPrim({ prim: "CDR", annots: ann });
                    default:
                        throw new MacroError(ex, `unexpected character: ${c}`);
                }
            });
        }
    }

    // SET_C[AD]+R macro
    if (setCadrRe.test(ex.prim)) {
        if (assertArgs(ex, 0)) {
            const { fields, rest } = filterAnnotations(ex.annots);
            if (fields.length > 1) {
                throw new MacroError(ex, `unexpected annotation on macro ${ex.prim}: ${fields}`);
            }

            const term = fields.length !== 0 ?
                {
                    a: [
                        { prim: "DUP" },
                        { prim: "CAR", annots: fields },
                        { prim: "DROP" },
                        { prim: "CDR", annots: ["@%%"] },
                        { prim: "SWAP" },
                        { prim: "PAIR", annots: [fields[0], "%@"] },
                    ],
                    d: [
                        { prim: "DUP" },
                        { prim: "CDR", annots: fields },
                        { prim: "DROP" },
                        { prim: "CAR", annots: ["@%%"] },
                        { prim: "PAIR", annots: ["%@", fields[0]] },
                    ],
                } :
                {
                    a: [
                        { prim: "CDR", annots: ["@%%"] },
                        { prim: "SWAP" },
                        { prim: "PAIR", annots: ["%", "%@"] },
                    ],
                    d: [
                        { prim: "CAR", annots: ["@%%"] },
                        { prim: "PAIR", annots: ["%@", "%"] },
                    ],
                };

            return parseSetMapCadr(ex, ex.prim.slice(5, ex.prim.length - 1), rest, term);
        }
    }

    // MAP_C[AD]+R macro
    if (mapCadrRe.test(ex.prim)) {
        if (assertArgs(ex, 1)) {
            const { fields } = filterAnnotations(ex.annots);
            if (fields.length > 1) {
                throw new MacroError(ex, `unexpected annotation on macro ${ex.prim}: ${fields}`);
            }

            const term = {
                a: [
                    { prim: "DUP" },
                    { prim: "CDR", annots: ["@%%"] },
                    {
                        prim: "DIP", args: [[
                            mkPrim({ prim: "CAR", annots: fields.length !== 0 ? ["@" + fields[0].slice(1)] : undefined }),
                            ex.args[0],
                        ]]
                    },
                    { prim: "SWAP" },
                    { prim: "PAIR", annots: [fields.length !== 0 ? fields[0] : "%", "%@"] },
                ],
                d: [
                    { prim: "DUP" },
                    mkPrim({ prim: "CDR", annots: fields.length !== 0 ? ["@" + fields[0].slice(1)] : undefined }),
                    ex.args[0],
                    { prim: "SWAP" },
                    { prim: "CAR", annots: ["@%%"] },
                    { prim: "PAIR", annots: ["%@", fields.length !== 0 ? fields[0] : "%"] },
                ],
            };

            return parseSetMapCadr(ex, ex.prim.slice(5, ex.prim.length - 1), [], term);
        }
    }

    // Expand deprecated DI...IP to [DIP n]
    if (diipRe.test(ex.prim)) {
        if (assertArgs(ex, 1)) {
            let n = 0;
            while (ex.prim[1 + n] === "I") { n++; }
            return mkPrim({ prim: "DIP", args: [{ int: String(n) }, ex.args[0]] });
        }
    }

    // Expand DU...UP and DUP n
    if (duupRe.test(ex.prim)) {
        let n = 0;
        while (ex.prim[1 + n] === "U") { n++; }
        if (proto === Protocol.PtEdo2Zk || 
            proto === Protocol.PsrsRVg1) {
            if (n === 1) {
                return ex;
            }
            if (assertArgs(ex, 0)) {
                return mkPrim({ prim: "DUP", args: [{ int: String(n) }], annots: ex.annots });
            }
        } else {
            if (n === 1) {
                if (ex.args === undefined) {
                    return ex; // skip
                }
                if (assertArgs(ex, 1) && assertIntArg(ex, ex.args[0])) {
                    n = parseInt(ex.args[0].int, 10);
                }
            } else {
                assertArgs(ex, 0);
            }

            if (n === 1) {
                return [mkPrim({ prim: "DUP", annots: ex.annots })];

            } else if (n === 2) {
                return [
                    {
                        prim: "DIP",
                        args: [[mkPrim({ prim: "DUP", annots: ex.annots })]],
                    },
                    { prim: "SWAP" },
                ];

            } else {
                return [
                    {
                        prim: "DIP",
                        args: [
                            { int: String(n - 1) },
                            [mkPrim({ prim: "DUP", annots: ex.annots })],
                        ],
                    },
                    {
                        prim: "DIG",
                        args: [{ int: String(n) }],
                    },
                ];
            }
        }
    }

    return ex;
}