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

function parseSequence(scanner: Iterator<Token>, initTok: Token | null, expectBracket: boolean): Seq {
    const seq: Seq = [];
    for (; ;) {
        let startTok: Token;
        if (initTok !== null) {
            startTok = initTok;
            initTok = null;
        } else {
            const tok = scanner.next();
            if (tok.done) {
                if (expectBracket) {
                    throw errEOF;
                } else {
                    return seq;
                }
            }
            startTok = tok.value;
        }

        if (startTok.t === Literal.Ident) {
            // Instruction
            const itm: Prim = {
                prim: startTok.v,
            };
            seq.push(itm);

            for (; ;) {
                const tok = scanner.next();
                if (tok.done) {
                    if (expectBracket) {
                        throw errEOF;
                    } else {
                        return seq;
                    }
                } else if (tok.value.t === "}") {
                    if (!expectBracket) {
                        throw new ParseError(tok.value, `Seq: unexpected token: ${tok.value.v}`);
                    } else {
                        return seq;
                    }
                } else if (tok.value.t === ";") {
                    break;
                }

                if (isAnnotation(tok.value)) {
                    itm.annots = itm.annots || [];
                    itm.annots.push(tok.value.v);
                } else {
                    itm.args = itm.args || [];
                    itm.args.push(parseExpr(scanner, tok.value));
                }
            }
        } else if (startTok.t === "{") {
            // Nested sequence
            seq.push(parseSequence(scanner, null, true));

            const tok = scanner.next();
            if (tok.done) {
                if (expectBracket) {
                    throw errEOF;
                } else {
                    return seq;
                }
            } else if (tok.value.t === "}") {
                if (!expectBracket) {
                    throw new ParseError(tok.value, `Seq: unexpected token: ${tok.value.v}`);
                } else {
                    return seq;
                }
            } else if (tok.value.t !== ";") {
                throw new ParseError(tok.value, `Seq: unexpected token: ${tok.value.v}`);
            }
        } else if (startTok.t === "}") {
            if (!expectBracket) {
                throw new ParseError(startTok, `Seq: unexpected token: ${startTok.v}`);
            } else {
                return seq;
            }
        } else {
            throw new ParseError(startTok, `Seq: unexpected token: ${startTok.v}`);
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

export function parseMicheline(src: string): Seq | null {
    const scanner = scan(src);
    const tok = scanner.next();
    if (tok.done) {
        return null;
    }
    return tok.value.t === "{" ?
        parseSequence(scanner, null, true) :
        parseSequence(scanner, tok.value, false);
}
