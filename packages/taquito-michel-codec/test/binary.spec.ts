import { Parser } from "../src/micheline-parser";
import { MichelsonData, MichelsonType, Protocol } from "../src/michelson-types";
import { emitBinary, packData, parseBinary } from "../src/binary";

function parseHex(s: string): number[] {
    const res: number[] = [];
    for (let i = 0; i < s.length; i += 2) {
        res.push(parseInt(s.slice(i, i + 2), 16));
    }
    return res;
}

describe("Pack", () => {
    it("address", () => {
        const type: MichelsonType = { prim: "address" };
        const data: MichelsonData = { string: "KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv" };
        const p = packData(data, type);
        expect(p).toEqual(parseHex("050a0000001601be41ee922ddd2cf33201e49d32da0afec571dce300"));
    });
});