import { Seq, Prim, Expr } from "./ast";

interface FormatterOptions {
    ws?: string;
    indent?: string;
    newline?: string;
}

class Formatter {
    constructor(private opt?: FormatterOptions, private lev: number = 0) {
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

    down(n = 1): Formatter {
        return new Formatter(this.opt, this.lev + n);
    }
}

function emitExpr(node: Expr, f: Formatter): string {
    if (Array.isArray(node)) {
        return f.lfsp + emitSeq(node, f.down());

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
            for (const a of node.args) {
                ret += f.lfsp + f.indent(1) + emitExpr(a, f.down());
            }
        }
        return ret + ")";
    }
}

function emitElem(node: Seq | Prim, f: Formatter): string {
    if (Array.isArray(node)) {
        return emitSeq(node, f);
    }
    let ret = f.indent() + node.prim;
    if (node.annots !== undefined) {
        for (const a of node.annots) {
            ret += " " + a;
        }
    }
    if (node.args !== undefined) {
        for (const a of node.args) {
            ret += (Array.isArray(a) ? "" : " ") + emitExpr(a, f);
        }
    }
    return ret;
}

function emitSeq(node: Seq, f: Formatter): string {
    let ret = f.indent() + "{" + f.lf;
    let i = node.length;
    for (const el of node) {
        ret += emitElem(el, f.down()) + (i > 1 ? ";" : "") + f.lf;
        i--;
    }
    return ret + f.indent() + "}";
}

export function emitMicheline(doc: Seq, opt?: FormatterOptions): string {
    return emitSeq(doc, new Formatter(opt));
}