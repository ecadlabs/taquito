import fs from "fs";
import path from "path";

import { MichelsonData, MichelsonType } from "../src/michelson-types";
import { packData } from "../src/binary";

interface TestData {
    title: string,
    type: MichelsonType,
    data: MichelsonData,
    packed: string,
}

function parseHex(s: string): number[] {
    const res: number[] = [];
    for (let i = 0; i < s.length; i += 2) {
        res.push(parseInt(s.slice(i, i + 2), 16));
    }
    return res;
}

describe("Pack", () => {
    const filename = path.resolve(__dirname, "binary-data.json");
    const src: TestData[] = JSON.parse(fs.readFileSync(filename).toString());

    for (const s of src) {
        it(s.title, () => {
            const p = packData(s.data, s.type);
            expect(p).toEqual(parseHex(s.packed));
        });
    }
});