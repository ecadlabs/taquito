import { emitMicheline, Script, Seq, FormatOptions } from "../src";
import fs from "fs";
import process from "process";

const opt: FormatOptions = {
    indent: "    ",
    newline: "\n",
};

const api = process.argv.length > 2 && process.argv[2] === "-a";
const buf = fs.readFileSync(0).toString();
const json = JSON.parse(buf);

if (api) {
    const script: Script = json;
    console.log("Code:");
    console.log(emitMicheline(script.code, opt));
    console.log("\nStorage:");
    console.log(emitMicheline(script.storage, opt));
} else {
    const script: Seq = json;
    console.log(emitMicheline(script, opt));
}