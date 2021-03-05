import fs from "fs";
import path from "path";

import { MichelsonData, MichelsonType } from "../src/michelson-types";
import { packData } from "../src/binary";
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

    for (const s of src) {
        it(s.title, () => {
            const p = packData(s.data, s.type);
            expect(p).toEqual(parseHex(s.packed));
        });
    }
});