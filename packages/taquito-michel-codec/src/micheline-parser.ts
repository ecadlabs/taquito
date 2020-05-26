import { scan, Token, Literal } from "./scan";
import { Expr, Prim, StringLiteral, IntLiteral, BytesLiteral } from "./micheline";
import { expandMacros } from "./macros";

export class MichelineParseError extends Error {
    constructor(public token: Token | null, message?: string) {
        super(message);
    }
}

export class JSONParseError extends Error {
    constructor(public node: any, message?: string) {
        super(message);
    }
}

const errEOF = new MichelineParseError(null, "Unexpected EOF");

function isAnnotation(tok: Token): boolean {
    return tok.t === Literal.Ident && (tok.v[0] === "@" || tok.v[0] === "%" || tok.v[0] === ":");
}

const intRe = new RegExp("^-?[0-9]+$");
const bytesRe = new RegExp("^([0-9a-fA-F]{2})+$");

export interface ParserOptions {
    expandMacros: boolean;
}

export class Parser {
    constructor(private opt?: ParserOptions) { }

    private expandMacros(ex: Prim): Prim | Prim[] {
        return this.opt?.expandMacros ? expandMacros(ex) : ex;
    }

    private parseList(scanner: Iterator<Token>): Prim | Prim[] {
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
            if (tok.value.t === ")") {
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
        return this.expandMacros(ret);
    }

    private parseArgs(scanner: Iterator<Token>, prim: string, expectBracket: boolean): [Prim, boolean] {
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
            } else if (t.value.t === "}") {
                if (!expectBracket) {
                    throw new MichelineParseError(t.value, `Seq: unexpected token: ${t.value.v}`);
                } else {
                    return [p, true];
                }
            } else if (t.value.t === ";") {
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

    private parseSequence(scanner: Iterator<Token>, initialToken: Token | null, expectBracket: boolean): Expr[] {
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

            if (tok.t === "}") {
                if (!expectBracket) {
                    throw new MichelineParseError(tok, `Seq: unexpected token: ${tok.v}`);
                } else {
                    return seq;
                }
            } else if (tok.t === Literal.Ident) {
                // Identifier with arguments
                const [itm, done] = this.parseArgs(scanner, tok.v, expectBracket);
                seq.push(this.expandMacros(itm));
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
                } else if (t.value.t === "}") {
                    if (!expectBracket) {
                        throw new MichelineParseError(t.value, `Seq: unexpected token: ${t.value.v}`);
                    } else {
                        return seq;
                    }
                } else if (t.value.t !== ";") {
                    throw new MichelineParseError(t.value, `Seq: unexpected token: ${t.value.v}`);
                }
            }
        }
    }

    private parseExpr(scanner: Iterator<Token>, tok: Token): Expr {
        switch (tok.t) {
            case Literal.Ident:
                return { prim: tok.v };

            case Literal.Number:
                return { int: tok.v };

            case Literal.String:
                return { string: <string>JSON.parse(tok.v) };

            case Literal.Bytes:
                return { bytes: tok.v.substr(2) };

            case "(":
                return this.parseList(scanner);

            case "{":
                return this.parseSequence(scanner, null, true);

            default:
                throw new MichelineParseError(tok, `Expr: unexpected token: ${tok.v}`);
        }
    }

    parseScript(src: string): Expr[] | null {
        const scanner = scan(src);
        const tok = scanner.next();
        if (tok.done) {
            return null;
        }

        return tok.value.t === "{" ?
            this.parseSequence(scanner, null, true) :
            this.parseSequence(scanner, tok.value, false);
    }

    parseMichelineExpression(src: string): Expr | null {
        const scanner = scan(src);
        const tok = scanner.next();
        if (tok.done) {
            return null;
        }
        return this.parseExpr(scanner, tok.value);
    }

    parseJSON(src: object): Expr {
        if (Array.isArray(src)) {
            const ret: Expr[] = [];
            for (const n of src) {
                if (n === null || typeof n !== "object") {
                    throw new JSONParseError(n, `unexpected sequence element: ${n}`);
                }
                ret.push(this.parseJSON(n));
            }
            return ret;
        }

        if ("prim" in src) {
            const p = <Prim>src;
            if (typeof p.prim === "string" &&
                (p.annots === undefined || Array.isArray(p.annots)) &&
                (p.args === undefined || Array.isArray(p.args))) {

                const ret: Prim = {
                    prim: p.prim,
                };

                if (p.annots !== undefined) {
                    for (const a of p.annots) {
                        if (typeof a !== "string") {
                            throw new JSONParseError(a, `string expected: ${a}`);
                        }
                    }
                    ret.annots = p.annots;
                }

                if (p.args !== undefined) {
                    ret.args = [];
                    for (const a of p.args) {
                        if (a === null || typeof a !== "object") {
                            throw new JSONParseError(a, `unexpected argument: ${a}`);
                        }
                        ret.args.push(this.parseJSON(a));
                    }
                }

                return ret;
            }

            throw new JSONParseError(src, `malformed prim expression: ${src}`);
        } else if ("string" in src) {
            if (typeof (<StringLiteral>src).string === "string") {
                return { string: (<StringLiteral>src).string };
            }

            throw new JSONParseError(src, `malformed string literal: ${src}`);
        } else if ("int" in src) {
            if (typeof (<IntLiteral>src).int === "string" && intRe.test((<IntLiteral>src).int)) {
                return { int: (<IntLiteral>src).int };
            }

            throw new JSONParseError(src, `malformed int literal: ${src}`);
        } else if ("bytes" in src) {
            if (typeof (<BytesLiteral>src).bytes === "string" && bytesRe.test((<BytesLiteral>src).bytes)) {
                return { bytes: (<BytesLiteral>src).bytes };
            }

            throw new JSONParseError(src, `malformed bytes literal: ${src}`);
        } else {
            throw new JSONParseError(src, `unexpected object: ${src}`);
        }
    }
}
