import { emitMicheline, Expr, FormatOptions, assertMichelsonScript, assertMichelsonData, Parser } from "../src";
import fs from "fs";
import process from "process";

interface APIData {
    code: Expr;
    storage: Expr;
}

let api = false;
let indent = false;
let validate = false;
let code = false;
let storage = false;

for (const arg of process.argv.slice(2)) {
    switch (arg) {
        case "-a":
            api = true;
            break;
        case "-i":
            indent = true;
            break;
        case "-v":
            validate = true;
            break;
        case "-c":
            code = true;
            break;
        case "-s":
            storage = true;
    }
}

if (!code && !storage) {
    code = true;
    storage = true;
}

const opt: FormatOptions | undefined = indent ? {
    indent: "    ",
    newline: "\n",
} : undefined;

const buf = fs.readFileSync(0).toString();
const json = JSON.parse(buf);
const parser = new Parser({ expandMacros: true });

if (api) {
    const script: APIData = {
        code: parser.parseJSON((<APIData>json).code),
        storage: parser.parseJSON((<APIData>json).storage),
    };

    if (validate) {
        assertMichelsonScript(script.code);
        assertMichelsonData(script.storage);
    }

    if (code) {
        if (storage) {
            console.log("Code:");
        }
        console.log(emitMicheline(script.code, opt));
    }
    if (storage) {
        if (code) {
            console.log("\nStorage:");
        }
        console.log(emitMicheline(script.storage, opt));
    }
} else {
    const script: Expr = parser.parseJSON(json);
    if (validate) {
        assertMichelsonScript(script);
    }

    console.log(emitMicheline(script, opt));
}