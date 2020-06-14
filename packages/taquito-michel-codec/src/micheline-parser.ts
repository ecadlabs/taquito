import { scan, Token, Literal } from './scan';
import { Expr, Prim, StringLiteral, IntLiteral, BytesLiteral } from './micheline';
import { expandMacros } from './macros';

export class MichelineParseError extends Error {
    /**
     * @param token A token caused the error
     * @param message An error message
     */
    constructor(public token: Token | null, message?: string) {
        super(message);
    }
}

export class JSONParseError extends Error {
    /**
     * @param node A node caused the error
     * @param message An error message
     */
    constructor(public node: any, message?: string) {
        super(message);
    }
}

const errEOF = new MichelineParseError(null, 'Unexpected EOF');

function isAnnotation(tok: Token): boolean {
    return tok.t === Literal.Ident && (tok.v[0] === '@' || tok.v[0] === '%' || tok.v[0] === ':');
}

const intRe = new RegExp('^-?[0-9]+$');
const bytesRe = new RegExp('^([0-9a-fA-F]{2})+$');

export interface ParserOptions {
    /**
     * Expand [Michelson macros](https://tezos.gitlab.io/whitedoc/michelson.html#macros) during parsing.
     */
    expandMacros: boolean;
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
    constructor(private opt?: ParserOptions) { }

    private expand(ex: Prim): Expr {
        return this.opt?.expandMacros ? expandMacros(ex) : ex;
    }

    private parseList(scanner: Iterator<Token>): Expr {
        const tok = scanner.next();
        if (tok.done) {
            throw errEOF;
        }

        if (tok.value.t !== Literal.Ident) {
            throw new MichelineParseError(tok.value, `List: not an identifier: ${tok.value.v}`);
        }

        const ret: Prim = {
            prim: tok.value.v,
        };

        for (; ;) {
            const tok = scanner.next();
            if (tok.done) {
                throw errEOF;
            }
            if (tok.value.t === ')') {
                break;
            }
            if (isAnnotation(tok.value)) {
                ret.annots = ret.annots || [];
                ret.annots.push(tok.value.v);
            } else {
                ret.args = ret.args || [];
                ret.args.push(this.parseExpr(scanner, tok.value));
            }
        }
        return this.expand(ret);
    }

    private parseArgs(
        scanner: Iterator<Token>,
        prim: string,
        expectBracket: boolean
    ): [Prim, boolean] {
        // Identifier with arguments
        const p: Prim = { prim };

        for (; ;) {
            const t = scanner.next();
            if (t.done) {
                if (expectBracket) {
                    throw errEOF;
                } else {
                    return [p, true];
                }
            } else if (t.value.t === '}') {
                if (!expectBracket) {
                    throw new MichelineParseError(t.value, `Seq: unexpected token: ${t.value.v}`);
                } else {
                    return [p, true];
                }
            } else if (t.value.t === ';') {
                return [p, false];
            }

            if (isAnnotation(t.value)) {
                p.annots = p.annots || [];
                p.annots.push(t.value.v);
            } else {
                p.args = p.args || [];
                p.args.push(this.parseExpr(scanner, t.value));
            }
        }
    }

    private parseSequence(
        scanner: Iterator<Token>,
        initialToken: Token | null,
        expectBracket: boolean
    ): Expr[] {
        const seq: Expr[] = [];
        for (; ;) {
            let tok: Token;
            if (initialToken !== null) {
                tok = initialToken;
                initialToken = null;
            } else {
                const t = scanner.next();
                if (t.done) {
                    if (expectBracket) {
                        throw errEOF;
                    } else {
                        return seq;
                    }
                }
                tok = t.value;
            }

            if (tok.t === '}') {
                if (!expectBracket) {
                    throw new MichelineParseError(tok, `Seq: unexpected token: ${tok.v}`);
                } else {
                    return seq;
                }
            } else if (tok.t === Literal.Ident) {
                // Identifier with arguments
                const [itm, done] = this.parseArgs(scanner, tok.v, expectBracket);
                seq.push(this.expand(itm));
                if (done) {
                    return seq;
                }
            } else {
                // Other
                seq.push(this.parseExpr(scanner, tok));

                const t = scanner.next();
                if (t.done) {
                    if (expectBracket) {
                        throw errEOF;
                    } else {
                        return seq;
                    }
                } else if (t.value.t === '}') {
                    if (!expectBracket) {
                        throw new MichelineParseError(t.value, `Seq: unexpected token: ${t.value.v}`);
                    } else {
                        return seq;
                    }
                } else if (t.value.t !== ';') {
                    throw new MichelineParseError(t.value, `Seq: unexpected token: ${t.value.v}`);
                }
            }
        }
    }

    private parseExpr(scanner: Iterator<Token>, tok: Token): Expr {
        switch (tok.t) {
            case Literal.Ident:
                return this.expand({ prim: tok.v });

            case Literal.Number:
                return { int: tok.v };

            case Literal.String:
                return { string: JSON.parse(tok.v) as string };

            case Literal.Bytes:
                return { bytes: tok.v.substr(2) };

            case '(':
                return this.parseList(scanner);

            case '{':
                return this.parseSequence(scanner, null, true);

            default:
                throw new MichelineParseError(tok, `Expr: unexpected token: ${tok.v}`);
        }
    }

    /**
     * Parses a Micheline sequence expression, such as smart contract source. Enclosing curly brackets may be omitted.
     * @param src A Micheline sequence `{parameter ...; storage int; code { DUP ; ...};}` or `parameter ...; storage int; code { DUP ; ...};`
     */
    parseScript(src: string): Expr[] | null {
        const scanner = scan(src);
        const tok = scanner.next();
        if (tok.done) {
            return null;
        }

        return tok.value.t === '{'
            ? this.parseSequence(scanner, null, true)
            : this.parseSequence(scanner, tok.value, false);
    }

    /**
     * Parse any Michelson expression
     * @param src A Michelson expression such as `(Pair {Elt "0" 0} 0)` or `{parameter ...; storage int; code { DUP ; ...};}`
     * @returns An AST node or null for empty document.
     */
    parseMichelineExpression(src: string): Expr | null {
        const scanner = scan(src);
        const tok = scanner.next();
        if (tok.done) {
            return null;
        }
        return this.parseExpr(scanner, tok.value);
    }

    /**
     * Takes a JSON-encoded Michelson, validates it, strips away unneeded properties and optionally expands macros (See {@link ParserOptions}).
     * @param src An object containing JSON-encoded Michelson, usually returned by `JSON.parse()`
     */
    parseJSON(src: object): Expr {
        if (Array.isArray(src)) {
            const ret: Expr[] = [];
            for (const n of src) {
                if (n === null || typeof n !== 'object') {
                    throw new JSONParseError(n, `unexpected sequence element: ${n}`);
                }
                ret.push(this.parseJSON(n));
            }
            return ret;
        }

        if ('prim' in src) {
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
