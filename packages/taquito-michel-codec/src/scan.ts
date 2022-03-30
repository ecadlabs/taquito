/**
 *  @category Error
 *  @description Error that indicates a failure when performing the scan step when parsing Michelson
 */
export class ScanError extends Error {
  constructor(public src: string, public idx: number, message?: string) {
    super(message);
    Object.setPrototypeOf(this, ScanError.prototype);
  }
}

export enum Literal {
  Comment,
  Number,
  String,
  Bytes,
  Ident,
}

export type TokenType = '(' | ')' | '{' | '}' | ';' | Literal;

const isSpace = new RegExp('\\s');
const isIdentStart = new RegExp('[:@%_A-Za-z]');
const isIdent = new RegExp('[@%_\\.A-Za-z0-9]');
const isDigit = new RegExp('[0-9]');
const isHex = new RegExp('[0-9a-fA-F]');

export interface Token {
  t: TokenType;
  v: string;
  first: number;
  last: number;
}

export function* scan(src: string, scanComments = false): Generator<Token, void> {
  let i = 0;
  while (i < src.length) {
    // Skip space
    while (i < src.length && isSpace.test(src[i])) {
      i++;
    }
    if (i === src.length) {
      return;
    }

    const s = src[i];
    const start = i;
    if (isIdentStart.test(s)) {
      // Identifier
      i++;
      while (i < src.length && isIdent.test(src[i])) {
        i++;
      }
      yield { t: Literal.Ident, v: src.slice(start, i), first: start, last: i };
    } else if (src.length - i > 1 && src.substr(i, 2) === '0x') {
      // Bytes
      i += 2;
      while (i < src.length && isHex.test(src[i])) {
        i++;
      }
      if (((i - start) & 1) !== 0) {
        throw new ScanError(src, i, 'Bytes literal length is expected to be power of two');
      }
      yield { t: Literal.Bytes, v: src.slice(start, i), first: start, last: i };
    } else if (isDigit.test(s) || s === '-') {
      // Number
      if (s === '-') {
        i++;
      }
      const ii = i;
      while (i < src.length && isDigit.test(src[i])) {
        i++;
      }
      if (ii === i) {
        throw new ScanError(src, i, 'Number literal is too short');
      }
      yield { t: Literal.Number, v: src.slice(start, i), first: start, last: i };
    } else if (s === '"') {
      // String
      i++;
      let esc = false;
      for (; i < src.length && (esc || src[i] !== '"'); i++) {
        if (!esc && src[i] === '\\') {
          esc = true;
        } else {
          esc = false;
        }
      }
      if (i === src.length) {
        throw new ScanError(src, i, 'Unterminated string literal');
      }
      i++;
      yield { t: Literal.String, v: src.slice(start, i), first: start, last: i };
    } else if (s === '#') {
      // Comment
      i++;
      while (i < src.length && src[i] !== '\n') {
        i++;
      }
      if (scanComments) {
        yield { t: Literal.Comment, v: src.slice(start, i), first: start, last: i };
      }
    } else if (src.length - i > 1 && src.substr(i, 2) === '/*') {
      // C style comment
      i += 2;
      while (i < src.length && !(src.length - i > 1 && src.substr(i, 2) === '*/')) {
        i++;
      }
      if (i === src.length) {
        throw new ScanError(src, i, 'Unterminated C style comment');
      }
      i += 2;
      if (scanComments) {
        yield { t: Literal.Comment, v: src.slice(start, i), first: start, last: i };
      }
    } else if (s === '(' || s === ')' || s === '{' || s === '}' || s === ';') {
      i++;
      yield { t: s, v: s, first: start, last: i };
    } else {
      throw new ScanError(src, i, `Invalid character at offset ${i}: \`${s}'`);
    }
  }
}
