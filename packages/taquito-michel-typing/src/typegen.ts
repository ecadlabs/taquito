import {
    MichelsonType,
    MichelsonTypePair,
    MichelsonTypeOr,
    FormatOptions,
    Contract,
} from "@taquito/michel-codec";

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

    lf(n = 0): string {
        return (this.opt?.newline || "") + this.indent(n);
    }

    lfsp(n = 0): string {
        return (this.opt?.newline || " ") + this.indent(n);
    }

    down(n: number): Formatter {
        return new Formatter(this.opt, this.lev + n);
    }
}

function emitMichelsonTypeDef(t: MichelsonType, fmt: Formatter, imports: { [n: string]: boolean }): string {
    switch (t.prim) {
        case "option":
            imports["MichelsonTypeOption"] = true;
            return `MichelsonTypeOption<${emitMichelsonTypeDef(t.args[0], fmt, imports)}>`;
        case "list":
            imports["MichelsonTypeList"] = true;
            return `MichelsonTypeList<${emitMichelsonTypeDef(t.args[0], fmt, imports)}>`;
        case "contract":
            imports["MichelsonTypeContract"] = true;
            return `MichelsonTypeContract<${emitMichelsonTypeDef(t.args[0], fmt, imports)}>`;
        case "pair":
            imports["MichelsonTypePair"] = true;
            return `MichelsonTypePair<${fmt.lf(1)}${emitMichelsonTypeDef(t.args[0], fmt.down(1), imports)},${fmt.lfsp(1)}${emitMichelsonTypeDef(t.args[1], fmt.down(1), imports)}>`;
        case "or":
            imports["MichelsonTypeOr"] = true;
            return `MichelsonTypeOr<${fmt.lf(1)}${emitMichelsonTypeDef(t.args[0], fmt.down(1), imports)},${fmt.lfsp(1)}${emitMichelsonTypeDef(t.args[1], fmt.down(1), imports)}>`;
        case "lambda":
            imports["MichelsonTypeLambda"] = true;
            return `MichelsonTypeLambda<${fmt.lf(1)}${emitMichelsonTypeDef(t.args[0], fmt.down(1), imports)},${fmt.lfsp(1)}${emitMichelsonTypeDef(t.args[1], fmt.down(1), imports)}>`;
        case "set":
            imports["MichelsonTypeSet"] = true;
            return `MichelsonTypeSet<${emitMichelsonTypeDef(t.args[0], fmt, imports)}>`;
        case "map":
            imports["MichelsonTypeMap"] = true;
            return `MichelsonTypeMap<${fmt.lf(1)}${emitMichelsonTypeDef(t.args[0], fmt.down(1), imports)},${fmt.lfsp(1)}${emitMichelsonTypeDef(t.args[1], fmt.down(1), imports)}>`;
        case "big_map":
            imports["MichelsonTypeBigMap"] = true;
            return `MichelsonTypeBigMap<${fmt.lf(1)}${emitMichelsonTypeDef(t.args[0], fmt.down(1), imports)},${fmt.lfsp(1)}${emitMichelsonTypeDef(t.args[1], fmt.down(1), imports)}>`;
        default:
            imports["MichelsonType"] = true;
            return `MichelsonType<"${t.prim}">`;
    }
}

function fieldAnn(p: MichelsonType): string | undefined {
    return p.annots?.find(v => v.length > 1 && v[0] === "%")?.slice(1);
}

const mkUnion = (t: string[]) => t.join(" | ");

interface Prop {
    name: string;
    selector: string;
    type: MichelsonType;
    path: (0 | 1)[];
}

function collectProperties<T extends MichelsonTypePair | MichelsonTypeOr>(t: T, id: T["prim"], selector: string, path: (0 | 1)[], ctx: { idx: number }): Prop[] {
    const getArg = (n: 0 | 1): Prop[] => {
        const arg = t.args[n];
        const ann = fieldAnn(arg);
        if (ann !== undefined || arg.prim !== id) {
            const name = ann || arg.prim + String(ctx.idx++);
            return [{
                name: name,
                selector: selector + "." + name,
                type: arg,
                path: [...path, n],
            }];
        }
        return collectProperties(arg, id, selector, [...path, n], ctx);
    };
    return [...getArg(0), ...getArg(1)];
}

function isTuple(t: MichelsonTypePair): boolean {
    const ann = t.args.map(v => fieldAnn(v));
    return ann[0] === undefined &&
        ann[1] === undefined &&
        (t.args[0].prim !== "pair" || t.args[1].prim !== "pair");
}

function emitObjectType(t: MichelsonTypePair, fmt: Formatter, imports: { [n: string]: boolean }): string {
    if (isTuple(t)) {
        // emit tuple
        return `[${fmt.lf(1)}${mkUnion(emitTSTypeDef(t.args[0], fmt.down(1), imports))},${fmt.lfsp(1)}${mkUnion(emitTSTypeDef(t.args[1], fmt.down(1), imports))}${fmt.lf(0)}]`;
    }
    // emit object
    const props = collectProperties(t, "pair", "", [], { idx: 0 });
    const exprs = props.map(p => `${fmt.lfsp(1)}${p.name}${p.type.prim === "option" ? "?" : ""}: ${mkUnion(emitTSTypeDef(p.type, fmt.down(1), imports))};`);
    return "{" + exprs.join("") + `${fmt.lfsp(0)}}`;
}

function emitUnion(t: MichelsonTypeOr, fmt: Formatter, imports: { [n: string]: boolean }): string[] {
    const props = collectProperties(t, "or", "", [], { idx: 0 });
    const defs: string[] = [];
    for (let pi = 0; pi < props.length; pi++) {
        defs.push("{" + props.map((p, i) => `${fmt.lfsp(1)}${p.name}${i === pi ? `: ${mkUnion(emitTSTypeDef(p.type, fmt.down(1), imports))}` : "?: undefined"};`).join("") + `${fmt.lfsp(0)}}`);
    }
    return defs;
}

function emitTSTypeDef(t: MichelsonType, fmt: Formatter, imports: { [n: string]: boolean }): string[] {
    switch (t.prim) {
        case "int":
        case "nat":
        case "mutez":
            return ["bigint", "number"];
        case "string":
        case "key_hash":
        case "address":
        case "key":
        case "signature":
            return ["string"];
        case "bytes":
        case "chain_id":
            return ["Uint8Array", "number[]", "string"];
        case "bool":
            return ["boolean"];
        case "timestamp":
            return ["string", "number", "Date"];
        case "unit":
            return ["\"Unit\""];
        case "option":
            return [...emitTSTypeDef(t.args[0], fmt, imports), "null"];
        case "pair":
            return [emitObjectType(t, fmt, imports)];
        case "or":
            return emitUnion(t, fmt, imports);
        case "list":
        case "set":
            const el = emitTSTypeDef(t.args[0], fmt, imports);
            return [(el.length > 1 ? "(" + mkUnion(el) + ")" : mkUnion(el)) + "[]"];
        case "map":
        case "big_map":
            const k = mkUnion(emitTSTypeDef(t.args[0], fmt, imports));
            const v = mkUnion(emitTSTypeDef(t.args[1], fmt, imports));
            return [`Map<${k}, ${v}>`, `[${k}, ${v}][]`];
        case "lambda":
            imports["MichelsonCode"] = true;
            return ["MichelsonCode"];
        default:
            throw new Error(`No equivalent TS type for ${t.prim}`);
    }
}

function emitPair(t: MichelsonTypePair, selector: string, ctx: { idx: number }, fmt: Formatter, imports: { [n: string]: boolean }): string {
    if (isTuple(t)) {
        // emit tuple
        return `{${fmt.lfsp(1)}prim: "Pair",${fmt.lfsp(1)}args: [${fmt.lf(2)}${emitMichelsonDataExpr(t.args[0], selector + "[0]", fmt.down(2), imports)},${fmt.lfsp(2)}${emitMichelsonDataExpr(t.args[1], selector + "[1]", fmt.down(2), imports)}${fmt.lf(1)}]${fmt.lfsp(0)}}`;
    }

    // emit object
    const getArg = (arg: MichelsonType) => {
        const ann = fieldAnn(arg);
        if (ann !== undefined || arg.prim !== "pair") {
            const name = ann || arg.prim + String(ctx.idx++);
            return emitMichelsonDataExpr(arg, selector + "." + name, fmt.down(2), imports);
        }
        return emitPair(arg, selector, ctx, fmt.down(2), imports);
    };

    return `{${fmt.lfsp(1)}prim: "Pair",${fmt.lfsp(1)}args: [${fmt.lf(2)}${getArg(t.args[0])},${fmt.lfsp(2)}${getArg(t.args[1])}${fmt.lf(1)}]${fmt.lfsp(0)}}`;
}

function emitOr(t: MichelsonTypeOr, selector: string, fmt: Formatter, imports: { [n: string]: boolean }): string {
    const buildOr = (p: (0 | 1)[], t: MichelsonType, selector: string, fmt: Formatter): string =>
        p.length > 0 ?
            `{${fmt.lfsp(1)}prim: "${p[0] === 0 ? "Left" : "Right"}",${fmt.lfsp(1)}args: [${buildOr(p.slice(1), t, selector, fmt.down(1))}]${fmt.lfsp(0)}}` :
            emitMichelsonDataExpr(t, selector, fmt, imports);

    const buildExpr = (p: Prop[], fmt: Formatter): string =>
        `${p[0].selector} !== undefined ?${fmt.lfsp(1)}${buildOr(p[0].path, p[0].type, p[0].selector, fmt.down(1))} :${fmt.lfsp(1)}${p.length > 2 ? buildExpr(p.slice(1), fmt.down(1)) : buildOr(p[1].path, p[1].type, p[1].selector, fmt.down(1))}`;

    const paths = collectProperties(t, "or", selector, [], { idx: 0 });
    return buildExpr(paths, fmt);
}

function emitMichelsonDataExpr(t: MichelsonType, selector: string, fmt: Formatter, imports: { [n: string]: boolean }): string {
    switch (t.prim) {
        case "int":
        case "nat":
        case "mutez":
            return `{ int: String(${selector}) }`;
        case "string":
        case "key_hash":
        case "address":
        case "key":
        case "signature":
            return `{ string: ${selector} }`;
        case "bytes":
        case "chain_id":
            return `{ bytes: (v => typeof v === "string" ? v : [...v].map(x => (x >> 4 & 0xf).toString(16) + (x & 0xf).toString(16)).join(""))(${selector}) }`;
        case "bool":
            return `{ prim: ${selector} ? "True" : "False"}`;
        case "timestamp":
            return `{ string: (v => v instanceof Date ? v.toISOString() : typeof v === "number" ? new Date(v * 1000).toISOString() : v)(${selector}) }`;
        case "unit":
            return "{ prim: \"Unit\" }";
        case "option":
            return `${selector} !== undefined && ${selector} !== null ? {${fmt.lfsp(1)}prim: "Some",${fmt.lfsp(1)}args: [${emitMichelsonDataExpr(t.args[0], selector, fmt.down(1), imports)}]${fmt.lfsp(0)}} : { prim: "None" }`;
        case "pair":
            return emitPair(t, selector, { idx: 0 }, fmt, imports);
        case "or":
            return emitOr(t, selector, fmt, imports);
        case "list":
        case "set":
            return `${selector}.map(v => (${emitMichelsonDataExpr(t.args[0], "v", fmt, imports)}))`;
        case "map":
        case "big_map":
            const k = emitMichelsonTypeDef(t.args[0], fmt, imports);
            const v = emitMichelsonTypeDef(t.args[1], fmt, imports);
            imports["MichelsonMapElt"] = true;
            imports["MichelsonData"] = true;
            return `[...${selector}].map<MichelsonMapElt<MichelsonData<${k}>, MichelsonData<${v}>>>(([k, v]) => ({${fmt.lfsp(1)}prim: "Elt",${fmt.lfsp(1)}args: [${fmt.lf(2)}${emitMichelsonDataExpr(t.args[0], "k", fmt.down(2), imports)},${fmt.lfsp(2)}${emitMichelsonDataExpr(t.args[1], "v", fmt.down(2), imports)}${fmt.lf(1)}]${fmt.lfsp(0)}}))`;
        case "lambda":
            return selector;
        default:
            throw new Error(`No data literal for ${t.prim}`);
    }
}

function emitObjectLiteral(t: MichelsonTypePair, selector: string, fmt: Formatter): string {
    if (isTuple(t)) {
        // emit tuple
        return `[${fmt.lf(1)}${emitTSLiteralExpr(t.args[0], `${selector}.args[0]`, fmt.down(1))},${fmt.lfsp(1)}${emitTSLiteralExpr(t.args[1], `${selector}.args[1]`, fmt.down(1))}${fmt.lf(0)}]`;
    }
    // emit object
    const props = collectProperties(t, "pair", selector, [], { idx: 0 });
    const exprs = props.map(p => `${fmt.lfsp(1)}${p.name}: ${emitTSLiteralExpr(p.type, selector + p.path.map(n => `.args[${n}]`).join(""), fmt.down(1))},`);
    return "{" + exprs.join("") + `${fmt.lfsp(0)}}`;
}

function emitUnionLiteral(t: MichelsonTypeOr, selector: string, ctx: { idx: number }, fmt: Formatter): string {
    const getArg = (arg: MichelsonType) => {
        const ann = fieldAnn(arg);
        const s = `${selector}.args[0]`;
        if (ann !== undefined || arg.prim !== "or") {
            const name = ann || arg.prim + String(ctx.idx++);
            return `{${fmt.lfsp(2)}${name}: ${emitTSLiteralExpr(arg, s, fmt.down(2))}${fmt.lfsp(1)}}`;
        }
        return emitUnionLiteral(arg, s, ctx, fmt.down(1));
    };

    return `${selector}.prim === "Left" ?${fmt.lfsp(1)}${getArg(t.args[0])} :${fmt.lfsp(1)}${getArg(t.args[1])}`;
}

function emitTSLiteralExpr(t: MichelsonType, selector: string, fmt: Formatter): string {
    switch (t.prim) {
        case "int":
        case "nat":
        case "mutez":
            return `BigInt(${selector}.int)`;
        case "string":
        case "key_hash":
        case "address":
        case "key":
        case "signature":
            return `${selector}.string`;
        case "bytes":
        case "chain_id":
            return `(v => {${fmt.lfsp(1)}const b: number[] = [];${fmt.lfsp(1)}for (let i = 0; i < v.bytes.length; i += 2) {${fmt.lfsp(2)}b.push(parseInt(v.bytes.slice(i, i + 2), 16));${fmt.lfsp(1)}}${fmt.lfsp(1)}return b;${fmt.lfsp(0)}})(${selector})`;
        case "bool":
            return `${selector}.prim === "True"`;
        case "timestamp":
            return `(v => new Date("string" in v ? v.string : parseInt(v.int, 10) * 1000))(${selector})`;
        case "unit":
            return "\"Unit\"";
        case "option":
            return `${selector}.prim === "Some" ? ${emitTSLiteralExpr(t.args[0], `${selector}.args[0]`, fmt.down(1))} : null`;
        case "pair":
            return emitObjectLiteral(t, selector, fmt);
        case "or":
            return emitUnionLiteral(t, selector, { idx: 0 }, fmt);
        case "list":
        case "set":
            return `${selector}.map(v => (${emitTSLiteralExpr(t.args[0], "v", fmt)}))`;
        case "map":
        case "big_map":
            return `new Map(${selector}.map(v => [${fmt.lf(1)}${emitTSLiteralExpr(t.args[0], "v.args[0]", fmt)},${fmt.lfsp(1)}${emitTSLiteralExpr(t.args[1], "v.args[1]", fmt)}${fmt.lf(0)}]))`;
        case "lambda":
            return selector;
        default:
            throw new Error(`No literal for ${t.prim}`);
    }
}

function emitMichelsonType(t: MichelsonType, fmt: Formatter): string {
    let props: string[] = [`prim: "${t.prim}"`];
    if (t.args !== undefined) {
        const lst: string[] = [];
        for (const a of t.args) {
            lst.push(emitMichelsonType(a, fmt.down(2)));
        }
        props.push(`args: [${fmt.lf(2)}${lst.join("," + fmt.lfsp(2))}${fmt.lf(1)}]`);
    }
    if (t.annots !== undefined) {
        props.push(`annots: [${t.annots.map(a => JSON.stringify(a)).join(", ")}]`);
    }
    return `{${fmt.lfsp(1)}${props.join("," + fmt.lfsp(1))}${fmt.lfsp(0)}}`;
}

const camel = (s: string) => s.split("_").map(v => v.length > 0 ? v[0].toUpperCase() + v.slice(1) : v).join("");
const lcamel = (s: string) => s.split("_").map((v, i) => v.length > 0 ? (i === 0 ? v[0].toLocaleLowerCase() : v[0].toUpperCase()) + v.slice(1) : v).join("");

function emitContractModule(c: Contract, prefix: string = "", fmt: Formatter): string {
    let res = "";
    const imports: { [n: string]: boolean } = {};

    // trim '%'
    const entryPoints = c.entryPoints().map((v: [string, MichelsonType]): [string, MichelsonType] => [v[0].slice(1), v[1]]);

    const types: { name: string, argName: string, type: MichelsonType, export: boolean }[] = [
        { name: "Parameter", argName: "Parameter", type: c.section("parameter").args[0], export: true },
        { name: "Storage", argName: "Storage", type: c.section("storage").args[0], export: true },
        ...entryPoints.map(v => ({ name: "EntryPoint" + camel(v[0]), argName: "EntryPoint" + camel(v[0]) + "Arg", type: v[1], export: false })),
    ];

    for (const t of types) {
        const typeName = prefix + t.name + "Type";
        const tsTypeName = prefix + t.argName;
        const dataName = prefix + t.name + "Data";
        const typeSpecName = lcamel(prefix + t.name);

        const emitAssertFunc = (typeName: string, typeSpec: string) => {
            imports["assertDataValid"] = true;
            imports["Context"] = true;
            return `function assert${typeName}(d: MichelsonData): d is ${typeName} {${fmt.lfsp(1)}return assertDataValid(d, ${typeSpec}, { contract: ${lcamel(prefix + "Contract")} });${fmt.lfsp()}}`;
        };

        const emitTypeGuardFunc = (typeName: string, typeSpec: string) => {
            imports["assertDataValid"] = true;
            imports["Context"] = true;
            return `function is${typeName}(d: MichelsonData): d is ${typeName} {${fmt.lfsp(1)}try {${fmt.lfsp(2)}return assertDataValid(d, ${typeSpec}, { contract: ${lcamel(prefix + "Contract")} });${fmt.lfsp(1)}} catch {${fmt.lfsp(2)}return false;${fmt.lfsp(1)}}${fmt.lfsp()}}`;
        };

        const exp = t.export ? "export " : "";

        res += `/* ${prefix}${t.name} */${fmt.lfsp()}${fmt.lf()}`;
        res += `${exp}type ${typeName} = ${emitMichelsonTypeDef(t.type, fmt, imports)};${fmt.lfsp()}${fmt.lf()}`;
        res += `${exp}type ${tsTypeName} = ${mkUnion(emitTSTypeDef(t.type, fmt, imports))};${fmt.lfsp()}${fmt.lf()}`;
        res += `${exp}type ${dataName} = MichelsonData<${typeName}>;${fmt.lfsp()}${fmt.lf()}`;
        res += `${exp}const ${typeSpecName}: ${typeName} = ${emitMichelsonType(t.type, fmt)};${fmt.lfsp()}${fmt.lf()}`;
        res += `${exp}const decode${tsTypeName} = (src: ${dataName}): ${tsTypeName} => (${emitTSLiteralExpr(t.type, "src", fmt)});${fmt.lfsp()}${fmt.lf()}`;
        res += `${exp}const encode${tsTypeName} = (src: ${tsTypeName}): ${dataName} => (${emitMichelsonDataExpr(t.type, "src", fmt, imports)});${fmt.lfsp()}${fmt.lf()}`;
        res += `${exp}${emitAssertFunc(dataName, typeSpecName)}${fmt.lfsp()}${fmt.lf()}`;
        res += `${exp}${emitTypeGuardFunc(dataName, typeSpecName)}${fmt.lfsp()}${fmt.lf()}`;
    }

    imports["MichelsonContract"] = true;
    const parameterAnn = c.section("parameter").annots;
    const storageAnn = c.section("storage").annots;
    res += `/* Contract literal with trimmed code section */${fmt.lfsp()}${fmt.lf()}`;
    res += `const ${lcamel(prefix + "Contract")}: MichelsonContract = [${fmt.lf(1)}{${fmt.lfsp(2)}prim: "parameter",${fmt.lfsp(2)}args: [${lcamel(prefix + "Parameter")}],${parameterAnn ? `${fmt.lfsp(2)}annots: [${parameterAnn.map(v => JSON.stringify(v)).join(", ")}]` : ""}${fmt.lfsp(1)}},${fmt.lfsp(1)}{${fmt.lfsp(2)}prim: "storage",${fmt.lfsp(2)}args: [${lcamel(prefix + "Storage")}],${storageAnn ? `${fmt.lfsp(2)}annots: [${storageAnn.map(v => JSON.stringify(v)).join(", ")}]` : ""}${fmt.lfsp(1)}},${fmt.lfsp(1)}{${fmt.lfsp(2)}prim: "code",${fmt.lfsp(2)}args: [[]],${fmt.lfsp(1)}}${fmt.lf()}];${fmt.lfsp()}${fmt.lf()}`;

    if (entryPoints.length !== 0) {
        imports["MichelsonData"] = true;

        const p = prefix + "EntryPoint";
        const idName = p + "ID";

        const conditionalType = (type: string, idType: string, list: [string, string][]) =>
            `export type ${type}<id extends ${idType}> = ` +
            list.map((v, i) => i < list.length - 1 ?
                `id extends "${v[0]}" ? ${v[1]} :${fmt.lfsp(1)}` :
                list.length > 1 ? v[1] : "never").join("") + ";";

        const emitSwitch = (cases: [string, string][]) =>
            `switch (id) {` + cases.map((v, i) => fmt.lfsp(2) + (i < cases.length - 1 ? `case "${v[0]}"` : "default") + `:${fmt.lfsp(3)}return ${v[1]};`).join("") + `${fmt.lfsp(1)}}`;

        res += `/* Entry Points */${fmt.lfsp()}${fmt.lf()}`;
        res += `export type ${p}ID = ${entryPoints.map(v => "\"" + v[0] + "\"").join(" |" + fmt.lfsp(1))};${fmt.lfsp()}${fmt.lf()}`;
        res += conditionalType(p + "Arg", idName, entryPoints.map(v => [v[0], p + camel(v[0]) + "Arg"])) + fmt.lfsp() + fmt.lf();
        res += conditionalType(p + "Type", idName, entryPoints.map(v => [v[0], p + camel(v[0]) + "Type"])) + fmt.lfsp() + fmt.lf();
        res += conditionalType(p + "Data", idName, entryPoints.map(v => [v[0], p + camel(v[0]) + "Data"])) + fmt.lfsp() + fmt.lf();
        res += `export const ${lcamel(prefix + "EntryPoints")} = {${fmt.lfsp(1)}${entryPoints.map(v => `"${v[0]}": ${lcamel(p) + camel(v[0])}`).join("," + fmt.lfsp(1))}${fmt.lfsp(0)}} as const;${fmt.lfsp()}${fmt.lf()}`;
        res += `export function assert${p}Data<T extends ${idName}>(id: T, d: MichelsonData): d is ${p}Data<T> {${fmt.lfsp(1)}${emitSwitch(entryPoints.map(v => [v[0], `assert${p}${camel(v[0])}Data(d)`]))}${fmt.lfsp(0)}}${fmt.lfsp()}${fmt.lf()}`;
        res += `export function is${p}Data<T extends ${idName}>(id: T, d: MichelsonData): d is ${p}Data<T> {${fmt.lfsp(1)}${emitSwitch(entryPoints.map(v => [v[0], `is${p}${camel(v[0])}Data(d)`]))}${fmt.lfsp(0)}}${fmt.lfsp()}${fmt.lf()}`;
        res += `export function decode${p}Arg<T extends ${idName}>(id: T, src: ${p}Data<T>): ${p}Arg<T> {${fmt.lfsp(1)}${emitSwitch(entryPoints.map(v => [v[0], `decode${p}${camel(v[0])}Arg(src as ${p}${camel(v[0])}Data) as ${p}Arg<T>`]))}${fmt.lfsp(0)}}${fmt.lfsp()}${fmt.lf()}`;
        res += `export function encode${p}Arg<T extends ${idName}>(id: T, src: ${p}Arg<T>): ${p}Data<T> {${fmt.lfsp(1)}${emitSwitch(entryPoints.map(v => [v[0], `encode${p}${camel(v[0])}Arg(src as ${p}${camel(v[0])}Arg) as ${p}Data<T>`]))}${fmt.lfsp(0)}}${fmt.lfsp()}${fmt.lf()}`;
    }

    // TODO: assert and make functions for entry points

    const names = Object.keys(imports).sort();
    res = `/* The code is automatically generated; DO NOT EDIT. */${fmt.lfsp()}${fmt.lf()}import {${fmt.lfsp(1)}${names.join("," + fmt.lfsp(1))}${fmt.lfsp()}} from "@taquito/michel-codec";${fmt.lfsp()}${fmt.lf()}${res}`;
    return res;
}

/**
 * TypeScript code generator
 */
export class Emitter {
    private fmt: Formatter;

    constructor(opt?: FormatOptions) {
        this.fmt = new Formatter(opt || { indent: "    ", newline: "\n" });
    }

    /**
     * Generate TypeScript equivalent of the Michelson type
     * @param t A Michelson type definition
     */
    tsTypeDef(t: MichelsonType): string {
        return mkUnion(emitTSTypeDef(t, this.fmt, {}));
    }

    /**
     * Generate a TypeScript type expression for the exact subtype of MichelsonType 
     * @param t A Michelson type definition
     */
    michelsonTypeDef(t: MichelsonType): string {
        return emitMichelsonTypeDef(t, this.fmt, {});
    }

    /**
     * Generate a TypeScript object literal of type definition what is basically a JSON 
     * @param t A Michelson type definition
     */
    michelsonType(t: MichelsonType): string {
        return emitMichelsonType(t, this.fmt);
    }

    michelsonDataBuilderFunc(t: MichelsonType, inType: string, outType: string): string {
        return `(src: ${inType}): MichelsonData<${outType}> => (${emitMichelsonDataExpr(t, "src", this.fmt, {})});`;
    }

    tsBuilderFunc(t: MichelsonType, inType: string, outType: string): string {
        return `(src: MichelsonData<${inType}>): ${outType} => (${emitTSLiteralExpr(t, "src", this.fmt)});`;
    }

    /**
     * Generate a TypeScript helper module for the contract
     * @param c Michelson contract
     * @param prefix Optional prefix for public names
     */
    contractModule(c: Contract, prefix: string = ""): string {
        return emitContractModule(c, prefix, this.fmt);
    }
}
