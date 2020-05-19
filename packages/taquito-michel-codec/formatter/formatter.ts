import { emitMicheline, APIData, Expr, FormatOptions, assertMichelsonScript, assertMichelsonData } from "../src";
import fs from "fs";
import process from "process";

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

if (api) {
    const script: APIData = json;
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
    const script: Expr = json;
    if (validate) {
        assertMichelsonScript(script);
    }

    console.log(emitMicheline(script, opt));
}