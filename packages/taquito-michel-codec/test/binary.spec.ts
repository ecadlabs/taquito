import fs from "fs";
import path from "path";

import { MichelsonData, MichelsonType } from "../src/michelson-types";
import { packData, unpackData } from "../src/binary";
import { parseHex } from "../src/utils";

interface TypedTestData {
    title: string,
    type: MichelsonType,
    data: MichelsonData,
    packed: string,
}

interface UntypedTestData {
    val: MichelsonData,
    bytes: string,
}

describe("Pack", () => {
    describe("Typed", () => {
        const filename = path.resolve(__dirname, "binary-data1.json");
        const src: TypedTestData[] = JSON.parse(fs.readFileSync(filename).toString());
        describe("pack", () => {
            for (const s of src) {
                it(s.title, () => {
                    const p = packData(s.data, s.type);
                    expect(p).toEqual(parseHex(s.packed));
                });
            }
        });
        describe("unpack", () => {
            for (const s of src) {
                it(s.title, () => {
                    const ex = unpackData(parseHex(s.packed), s.type);
                    expect(ex).toEqual(s.data);
                });
            }
        });
    });
    describe("Untyped", () => {
        const filename = path.resolve(__dirname, "binary-data2.json");
        const src: UntypedTestData[] = JSON.parse(fs.readFileSync(filename).toString());
        describe("pack", () => {
            for (const s of src) {
                it(JSON.stringify(s.val), () => {
                    const p = packData(s.val);
                    expect(p).toEqual(parseHex(s.bytes));
                });
            }
        });
        describe("unpack", () => {
            for (const s of src) {
                it(JSON.stringify(s.val), () => {
                    const ex = unpackData(parseHex(s.bytes));
                    expect(ex).toEqual(s.val);
                });
            }
        });
    });
});