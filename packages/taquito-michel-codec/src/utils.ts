import { Prim } from "./micheline";

export type Tuple<T, N extends number> = N extends 1 ? [T] :
    N extends 2 ? [T, T] :
    N extends 3 ? [T, T, T] :
    N extends 4 ? [T, T, T, T] :
    never;

type RequiredProp<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type OmitProp<T, K extends keyof T> = Omit<T, K> & { [P in K]?: never };

export type ReqArgs<T extends Prim> = RequiredProp<T, "args">;
export type NoArgs<T extends Prim> = OmitProp<T, "args">;
export type NoAnnots<T extends Prim> = OmitProp<T, "annots">;

// Ad hoc big integer parser
export class LongInteger {
    private neg = false;
    private buf: number[] = [];

    private append(c: number) {
        let i = 0;
        while (c !== 0 || i < this.buf.length) {
            const m = (this.buf[i] || 0) * 10 + c;
            this.buf[i++] = m % 256;
            c = Math.floor(m / 256);
        }
    }

    constructor(arg?: string | number) {
        if (arg === undefined) {
            return;
        }
        if (typeof arg === "string") {
            for (let i = 0; i < arg.length; i++) {
                let c = arg.charCodeAt(i);
                if (i === 0 && c === 0x2d) {
                    this.neg = true;
                } else {
                    if (c < 0x30 || c > 0x39) {
                        throw new Error(`unexpected character in integer constant: ${arg[i]}`);
                    }
                    this.append(c - 0x30);
                }
            }
        } else if (arg < 0) {
            this.neg = true;
            this.append(-arg);
        } else {
            this.append(arg);
        }
    }

    cmp(arg: LongInteger): number {
        if (this.neg !== arg.neg) {
            return (arg.neg ? 1 : 0) - (this.neg ? 1 : 0);
        } else {
            let ret = 0;
            if (this.buf.length !== arg.buf.length) {
                ret = this.buf.length < arg.buf.length ? -1 : 1;
            } else if (this.buf.length !== 0) {
                let i = arg.buf.length - 1;
                while (i >= 0 && this.buf[i] === arg.buf[i]) {
                    i--;
                }
                ret = i < 0 ? 0 : this.buf[i] < arg.buf[i] ? -1 : 1;
            }
            return !this.neg ? ret : ret === 0 ? 0 : -ret;
        }
    }

    get sign(): number {
        return this.buf.length === 0 ? 0 : this.neg ? -1 : 1;
    }
}

export function parseBytes(s: string): number[] | null {
    const ret: number[] = [];
    for (let i = 0; i < s.length; i += 2) {
        const x = parseInt(s.slice(i, i + 2), 16);
        if (Number.isNaN(x)) {
            return null;
        }
        ret.push(x);
    }
    return ret;
}

export function compareBytes(a: number[] | Uint8Array, b: number[] | Uint8Array): number {
    if (a.length !== b.length) {
        return a.length < b.length ? -1 : 1;
    } else if (a.length !== 0) {
        let i = 0;
        while (i < a.length && a[i] === b[i]) {
            i++;
        }
        return i === a.length ? 0 : a[i] < b[i] ? -1 : 1;
    } else {
        return 0;
    }
}

export function isDecimal(x: string): boolean {
    try {
        // tslint:disable-next-line: no-unused-expression
        new LongInteger(x);
        return true;
    } catch {
        return false;
    }
}

export function isNatural(x: string): boolean {
    try {
        return new LongInteger(x).sign >= 0;
    } catch {
        return false;
    }
}