import { scan, Token, Literal } from './scan';
import { Expr, Prim, StringLiteral, IntLiteral, BytesLiteral, sourceReference, List, SourceReference } from './micheline';
import { expandMacros } from './macros';
import { ProtocolOptions } from './michelson-types';

export class MichelineParseError extends Error {
    /**
     * @param token A token caused the error
     * @param message An error message
     */
    constructor(public token: Token | null, message?: string) {
        super(message);
        Object.setPrototypeOf(this, MichelineParseError.prototype);
    }
}

export class JSONParseError extends Error {
    /**
     * @param node A node caused the error
     * @param message An error message
     */
    constructor(public node: any, message?: string) {
        super(message);
        Object.setPrototypeOf(this, JSONParseError.prototype);
    }
}

const errEOF = new MichelineParseError(null, 'Unexpected EOF');

function isAnnotation(tok: Token): boolean {
    return tok.t === Literal.Ident && (tok.v[0] === '@' || tok.v[0] === '%' || tok.v[0] === ':');
}

const intRe = new RegExp('^-?[0-9]+$');
const bytesRe = new RegExp('^([0-9a-fA-F]{2})*$');

export interface ParserOptions extends ProtocolOptions {
    /**
     * Expand [Michelson macros](https://tezos.gitlab.io/whitedoc/michelson.html#macros) during parsing.
     */
    expandMacros?: boolean;
}

/**
 * Converts and validates Michelson expressions between JSON-based Michelson and Micheline
 *
 * Pretty Print a Michelson Smart Contract:
 * ```
 * const contract = await Tezos.contract.at("KT1Vsw3kh9638gqWoHTjvHCoHLPKvCbMVbCg");
 * const p = new Parser();
 *
 * const michelsonCode = p.parseJSON(contract.script.code);
 * const storage = p.parseJSON(contract.script.storage);
 *
 * console.log("Pretty print Michelson smart contract:");
 * console.log(emitMicheline(michelsonCode, {indent:"    ", newline: "\n",}));
 *
 * console.log("Pretty print Storage:");
 * console.log(emitMicheline(storage, {indent:"    ", newline: "\n",}));
 * ```
 *
 * Encode a Michelson expression for inital storage of a smart contract
 * ```
 * const src = `(Pair (Pair { Elt 1
 *                (Pair (Pair "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")
 *                      0x0501000000026869) }
 *          10000000)
 *    (Pair 2 333))`;
 *
 * const p = new Parser();
 *
 * const exp = p.parseMichelineExpression(src);
 * console.log(JSON.stringify(exp));
 * ```
 */
export class Parser {
    constructor(private opt?: ParserOptions) {
    }

    private expand(ex: Prim): Expr {
        if (this.opt?.expandMacros !== undefined ? this.opt?.expandMacros : true) {
            const ret = expandMacros(ex, this.opt);
            if (ret !== ex) {
                ret[sourceReference] = { ...(ex[sourceReference] || { first: 0, last: 0 }), macro: ex };
            }
            return ret;
        } else {
            return ex;
        }
    }

    private parseListExpr(scanner: Iterator<Token>, start: Token): Expr {
        const ref: SourceReference = {
            first: start.first,
            last: start.last,
        };

        const expectBracket = start.t === "(";
        let tok: IteratorResult<Token>;
        if (expectBracket) {
            tok = scanner.next();
            if (tok.done) {
                throw errEOF;
            }
            ref.last = tok.value.last;
        } else {
            tok = { value: start };
        }

        if (tok.value.t !== Literal.Ident) {
            throw new MichelineParseError(tok.value, `not an identifier: ${tok.value.v}`);
        }

        const ret: Prim = {
            prim: tok.value.v,
            [sourceReference]: ref,
        };

        for (; ;) {
            const tok = scanner.next();
            if (tok.done) {
                if (expectBracket) {
                    throw errEOF;
                }
                break;
            } else if (tok.value.t === ')') {
                if (!expectBracket) {
                    throw new MichelineParseError(tok.value, `unexpected closing bracket`);
                }
                ref.last = tok.value.last;
                break;
            } else if (isAnnotation(tok.value)) {
                ret.annots = ret.annots || [];
                ret.annots.push(tok.value.v);
                ref.last = tok.value.last;
            } else {
                ret.args = ret.args || [];
                const arg = this.parseExpr(scanner, tok.value);
                ref.last = arg[sourceReference]?.last || ref.last;
                ret.args.push(arg);
            }
        }
        return this.expand(ret);
    }

    private parseArgs(scanner: Iterator<Token>, start: Token): [Prim, IteratorResult<Token>] {
        // Identifier with arguments
        const ref: SourceReference = {
            first: start.first,
            last: start.last,
        };
        const p: Prim = {
            prim: start.v,
            [sourceReference]: ref,
        };

        for (; ;) {
            const t = scanner.next();
            if (t.done || t.value.t === '}' || t.value.t === ';') {
                return [p, t];
            }

            if (isAnnotation(t.value)) {
                ref.last = t.value.last;
                p.annots = p.annots || [];
                p.annots.push(t.value.v);
            } else {
                const arg = this.parseExpr(scanner, t.value);
                ref.last = arg[sourceReference]?.last || ref.last;
                p.args = p.args || [];
                p.args.push(arg);
            }
        }
    }

    private parseSequenceExpr(scanner: Iterator<Token>, start: Token): List<Expr> {
        const ref: SourceReference = {
            first: start.first,
            last: start.last,
        };
        const seq: List<Expr> = [];
        seq[sourceReference] = ref;

        const expectBracket = start.t === "{";
        let tok: IteratorResult<Token> | null = start.t === "{" ? null : { value: start };

        for (; ;) {
            if (tok === null) {
                tok = scanner.next();
                if (!tok.done) {
                    ref.last = tok.value.last;
                }
            }
            if (tok.done) {
                if (expectBracket) {
                    throw errEOF;
                } else {
                    return seq;
                }
            }

            if (tok.value.t === "}") {
                if (!expectBracket) {
                    throw new MichelineParseError(tok.value, `unexpected closing bracket`);
                } else {
                    return seq;
                }
            } else if (tok.value.t === Literal.Ident) {
                // Identifier with arguments
                const [itm, n] = this.parseArgs(scanner, tok.value);
                ref.last = itm[sourceReference]?.last || ref.last;
                seq.push(this.expand(itm));
                tok = n;
            } else {
                // Other
                const ex = this.parseExpr(scanner, tok.value);
                ref.last = ex[sourceReference]?.last || ref.last;
                seq.push(ex);
                tok = null;
            }

            if (tok === null) {
                tok = scanner.next();
                if (!tok.done) {
                    ref.last = tok.value.last;
                }
            }
            if (!tok.done && tok.value.t === ";") {
                tok = null;
            }
        }
    }

    private parseExpr(scanner: Iterator<Token>, tok: Token): Expr {
        switch (tok.t) {
            case Literal.Ident:
                return this.expand({ prim: tok.v, [sourceReference]: { first: tok.first, last: tok.last } });

            case Literal.Number:
                return { int: tok.v, [sourceReference]: { first: tok.first, last: tok.last } };

            case Literal.String:
                return { string: JSON.parse(tok.v) as string, [sourceReference]: { first: tok.first, last: tok.last } };

            case Literal.Bytes:
                return { bytes: tok.v.slice(2), [sourceReference]: { first: tok.first, last: tok.last } };

            case '{':
                return this.parseSequenceExpr(scanner, tok);

            default:
                return this.parseListExpr(scanner, tok);
        }
    }

    /**
     * Parses a Micheline sequence expression, such as smart contract source. Enclosing curly brackets may be omitted.
     * @param src A Micheline sequence `{parameter ...; storage int; code { DUP ; ...};}` or `parameter ...; storage int; code { DUP ; ...};`
     */
    parseSequence(src: string): Expr[] | null {
        // tslint:disable-next-line: strict-type-predicates
        if (typeof src !== "string") {
            throw new TypeError(`string type was expected, got ${typeof src} instead`);
        }

        const scanner = scan(src);
        const tok = scanner.next();
        if (tok.done) {
            return null;
        }
        return this.parseSequenceExpr(scanner, tok.value);
    }

    /**
     * Parse a Micheline sequence expression. Enclosing curly brackets may be omitted.
     * @param src A Michelson list expression such as `(Pair {Elt "0" 0} 0)` or `Pair {Elt "0" 0} 0`
     * @returns An AST node or null for empty document.
     */
    parseList(src: string): Expr | null {
        // tslint:disable-next-line: strict-type-predicates
        if (typeof src !== "string") {
            throw new TypeError(`string type was expected, got ${typeof src} instead`);
        }

        const scanner = scan(src);
        const tok = scanner.next();
        if (tok.done) {
            return null;
        }
        return this.parseListExpr(scanner, tok.value);
    }

    /**
     * Parse any Michelson expression
     * @param src A Michelson expression such as `(Pair {Elt "0" 0} 0)` or `{parameter ...; storage int; code { DUP ; ...};}`
     * @returns An AST node or null for empty document.
     */
    parseMichelineExpression(src: string): Expr | null {
        // tslint:disable-next-line: strict-type-predicates
        if (typeof src !== "string") {
            throw new TypeError(`string type was expected, got ${typeof src} instead`);
        }

        const scanner = scan(src);
        const tok = scanner.next();
        if (tok.done) {
            return null;
        }
        return this.parseExpr(scanner, tok.value);
    }

    /**
     * Parse a Micheline sequence expression, such as smart contract source. Enclosing curly brackets may be omitted.
     * An alias for `parseSequence`
     * @param src A Micheline sequence `{parameter ...; storage int; code { DUP ; ...};}` or `parameter ...; storage int; code { DUP ; ...};`
     */
    parseScript(src: string): Expr[] | null {
        return this.parseSequence(src);
    }

    /**
     * Parse a Micheline sequence expression. Enclosing curly brackets may be omitted.
     * An alias for `parseList`
     * @param src A Michelson list expression such as `(Pair {Elt "0" 0} 0)` or `Pair {Elt "0" 0} 0`
     * @returns An AST node or null for empty document.
     */
    parseData(src: string): Expr | null {
        return this.parseList(src);
    }

    /**
     * Takes a JSON-encoded Michelson, validates it, strips away unneeded properties and optionally expands macros (See {@link ParserOptions}).
     * @param src An object containing JSON-encoded Michelson, usually returned by `JSON.parse()`
     */
    parseJSON(src: object): Expr {
        // tslint:disable-next-line: strict-type-predicates
        if (typeof src !== "object") {
            throw new TypeError(`object type was expected, got ${typeof src} instead`);
        }

        if (Array.isArray(src)) {
            const ret: Expr[] = [];
            for (const n of src) {
                if (n === null || typeof n !== 'object') {
                    throw new JSONParseError(n, `unexpected sequence element: ${n}`);
                }
                ret.push(this.parseJSON(n));
            }
            return ret;

        } else if ('prim' in src) {
            const p = src as { prim: any, annots?: any[], args?: any[] };
            if (
                typeof p.prim === 'string' &&
                (p.annots === undefined || Array.isArray(p.annots)) &&
                (p.args === undefined || Array.isArray(p.args))
            ) {
                const ret: Prim = {
                    prim: p.prim,
                };

                if (p.annots !== undefined) {
                    for (const a of p.annots) {
                        if (typeof a !== 'string') {
                            throw new JSONParseError(a, `string expected: ${a}`);
                        }
                    }
                    ret.annots = p.annots;
                }

                if (p.args !== undefined) {
                    ret.args = [];
                    for (const a of p.args) {
                        if (a === null || typeof a !== 'object') {
                            throw new JSONParseError(a, `unexpected argument: ${a}`);
                        }
                        ret.args.push(this.parseJSON(a));
                    }
                }

                return this.expand(ret);
            }

            throw new JSONParseError(src, `malformed prim expression: ${src}`);
        } else if ('string' in src) {
            if (typeof (src as any).string === 'string') {
                return { string: (src as StringLiteral).string };
            }

            throw new JSONParseError(src, `malformed string literal: ${src}`);
        } else if ('int' in src) {
            if (typeof (src as any).int === 'string' && intRe.test((src as IntLiteral).int)) {
                return { int: (src as IntLiteral).int };
            }

            throw new JSONParseError(src, `malformed int literal: ${src}`);
        } else if ('bytes' in src) {
            if (
                typeof (src as any).bytes === 'string' &&
                bytesRe.test((src as BytesLiteral).bytes)
            ) {
                return { bytes: (src as BytesLiteral).bytes };
            }

            throw new JSONParseError(src, `malformed bytes literal: ${src}`);
        } else {
            throw new JSONParseError(src, `unexpected object: ${src}`);
        }
    }
}
