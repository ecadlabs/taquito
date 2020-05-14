import { emitMicheline, APIData, Seq, FormatOptions } from "../src";
import fs from "fs";
import process from "process";

let api = false;
let indent = false;

for (const arg of process.argv.slice(2)) {
    switch (arg) {
        case "-a":
            api = true;
            break;
        case "-i":
            indent = true;
    }
}

const opt: FormatOptions | undefined = indent ? {
    indent: "    ",
    newline: "\n",
} : undefined;

const buf = fs.readFileSync(0).toString();
const json = JSON.parse(buf);

if (api) {
    const script: APIData = json;
    console.log("Code:");
    console.log(emitMicheline(script.code, opt));
    console.log("\nStorage:");
    console.log(emitMicheline(script.storage, opt));
} else {
    const script: Seq = json;
    console.log(emitMicheline(script, opt));
}