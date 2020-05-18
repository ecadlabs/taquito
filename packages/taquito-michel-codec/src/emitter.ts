import { Expr, Prim } from "./ast";

export interface FormatOptions {
    indent?: string;
    newline?: string;
}

class Formatter {
    constructor(private opt?: FormatOptions, private lev: number = 0) {
    }

    indent(n = 0): string {
        let ret = "";
        if (this.opt?.indent !== undefined) {
            for (let i = this.lev + n; i > 0; i--) {
                ret += this.opt.indent;
            }
        }
        return ret;
    }

    get lf(): string {
        return this.opt?.newline || "";
    }

    get lfsp(): string {
        return this.opt?.newline || " ";
    }

    down(n: number): Formatter {
        return new Formatter(this.opt, this.lev + n);
    }
}

function hasArgs(node: Expr): node is Prim {
    return ("prim" in node) &&
        ((node.annots !== undefined && node.annots.length !== 0) ||
            (node.args !== undefined && node.args.length !== 0));
}

function isMultiline(node: Prim): boolean {
    if (node.args !== undefined) {
        for (const a of node.args) {
            if (Array.isArray(a) || hasArgs(a)) {
                return true;
            }
        }
    }
    return false;
}

function emitExpr(node: Expr, f: Formatter): string {
    if (Array.isArray(node)) {
        return emitSeq(node, f);

    } else if ("string" in node) {
        return JSON.stringify(node.string);

    } else if ("int" in node) {
        return node.int;

    } else if ("bytes" in node) {
        return "0x" + node.bytes;

    } else {
        if ((node.annots === undefined || node.annots.length === 0) &&
            (node.args === undefined || node.args.length === 0)) {
            return node.prim;
        }

        let ret = "(" + node.prim;
        if (node.annots !== undefined) {
            for (const a of node.annots) {
                ret += " " + a;
            }
        }
        if (node.args !== undefined) {
            const multiline = isMultiline(node);
            for (const a of node.args) {
                if (multiline) {
                    ret += f.lfsp + f.indent(1) + emitExpr(a, f.down(1));
                } else {
                    ret += " " + emitExpr(a, f);
                }
            }
        }
        return ret + ")";
    }
}

function emitSeq(node: Expr[], f: Formatter): string {
    let ret = "{" + f.lf;
    let i = node.length;
    for (const el of node) {
        ret += f.indent(1);

        if ("prim" in el) {
            ret += el.prim;

            if (el.annots !== undefined) {
                for (const a of el.annots) {
                    ret += " " + a;
                }
            }
            if (el.args !== undefined) {
                const multiline = isMultiline(el);
                for (const a of el.args) {
                    if (multiline) {
                        ret += f.lfsp + f.indent(2) + emitExpr(a, f.down(2));
                    } else {
                        ret += " " + emitExpr(a, f);
                    }
                }
            }
        } else {
            ret += emitExpr(el, f.down(1));
        }

        ret += (i > 1 ? ";" : "") + f.lf;
        i--;
    }
    return ret + f.indent() + "}";
}

export function emitMicheline(expr: Expr, opt?: FormatOptions): string {
    return emitExpr(expr, new Formatter(opt));
}