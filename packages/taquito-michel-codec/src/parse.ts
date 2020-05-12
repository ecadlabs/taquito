import { scan, Token, Literal } from "./scan";
import { Prim, Seq, Expr } from "./ast";

export class ParseError extends Error {
    constructor(public token: Token | null, message?: string) {
        super(message);
    }
}

const errEOF = new ParseError(null, "Unexpected EOF");

function isAnnotation(tok: Token): boolean {
    return tok.t === Literal.Ident && (tok.v[0] === "@" || tok.v[0] === "%" || tok.v[0] === ":");
}

function parseList(scanner: Iterator<Token>): Prim {
    const tok = scanner.next();
    if (tok.done) {
        throw errEOF;
    }

    if (tok.value.t !== Literal.Ident) {
        throw new ParseError(tok.value, `List: not an identifier: ${tok.value.v}`);
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
            ret.args.push(parseExpr(scanner, tok.value));
        }
    }
    return ret;
}

function parseSequence(scanner: Iterator<Token>, initialToken: Token | null, expectBracket: boolean): Seq {
    const seq: Seq = [];
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
                throw new ParseError(tok, `Seq: unexpected token: ${tok.v}`);
            } else {
                return seq;
            }
        } else if (tok.t === Literal.Ident) {
            // Identifier with arguments
            const itm: Prim = {
                prim: tok.v,
            };
            seq.push(itm);

            for (; ;) {
                const t = scanner.next();
                if (t.done) {
                    if (expectBracket) {
                        throw errEOF;
                    } else {
                        return seq;
                    }
                } else if (t.value.t === "}") {
                    if (!expectBracket) {
                        throw new ParseError(t.value, `Seq: unexpected token: ${t.value.v}`);
                    } else {
                        return seq;
                    }
                } else if (t.value.t === ";") {
                    break;
                }

                if (isAnnotation(t.value)) {
                    itm.annots = itm.annots || [];
                    itm.annots.push(t.value.v);
                } else {
                    itm.args = itm.args || [];
                    itm.args.push(parseExpr(scanner, t.value));
                }
            }
        } else {
            // Other
            seq.push(parseExpr(scanner, tok));

            const t = scanner.next();
            if (t.done) {
                if (expectBracket) {
                    throw errEOF;
                } else {
                    return seq;
                }
            } else if (t.value.t === "}") {
                if (!expectBracket) {
                    throw new ParseError(t.value, `Seq: unexpected token: ${t.value.v}`);
                } else {
                    return seq;
                }
            } else if (t.value.t !== ";") {
                throw new ParseError(t.value, `Seq: unexpected token: ${t.value.v}`);
            }
        }
    }
}

function parseExpr(scanner: Iterator<Token>, tok: Token): Expr {
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
            return parseList(scanner);

        case "{":
            return parseSequence(scanner, null, true);

        default:
            throw new ParseError(tok, `Expr: unexpected token: ${tok.v}`);
    }
}

export function parseMichelineScript(src: string): Seq | null {
    const scanner = scan(src);
    const tok = scanner.next();
    if (tok.done) {
        return null;
    }
    return tok.value.t === "{" ?
        parseSequence(scanner, null, true) :
        parseSequence(scanner, tok.value, false);
}

export function parseMichelineExpression(src: string): Expr | null {
    const scanner = scan(src);
    const tok = scanner.next();
    if (tok.done) {
        return null;
    }
    return parseExpr(scanner, tok.value);
}