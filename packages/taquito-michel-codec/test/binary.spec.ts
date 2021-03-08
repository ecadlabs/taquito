import fs from "fs";
import path from "path";

import { MichelsonData, MichelsonType } from "../src/michelson-types";
import { packData, unpackData } from "../src/binary";
import { parseHex } from "../src/utils";

interface TestData {
    title: string,
    type: MichelsonType,
    data: MichelsonData,
    packed: string,
}

describe("Pack", () => {
    const filename = path.resolve(__dirname, "binary-data.json");
    const src: TestData[] = JSON.parse(fs.readFileSync(filename).toString());

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